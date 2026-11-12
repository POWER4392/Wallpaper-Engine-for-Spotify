function Get-WallpaperEngineConfigPath {
    $proc = Get-Process -Name "wallpaper64", "wallpaper32" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($proc -and $proc.Path) {
        $dir = Split-Path $proc.Path
        $cfg = Join-Path $dir "config.json"
        if (Test-Path $cfg) { return $cfg }
    }

    try {
        $steamPath = (Get-ItemProperty -Path "HKCU:\Software\Valve\Steam" -Name "SteamPath" -ErrorAction SilentlyContinue).SteamPath
        if ($steamPath) {
            $cfg = Join-Path $steamPath "steamapps\common\wallpaper_engine\config.json"
            if (Test-Path $cfg) { return $cfg }
        }
    }
    catch { $null = $_ }

    $drives = Get-PSDrive -PSProvider FileSystem -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Root
    foreach ($d in $drives) {
        $candidates = @(
            (Join-Path $d "SteamLibrary\steamapps\common\wallpaper_engine\config.json"),
            (Join-Path $d "Program Files (x86)\Steam\steamapps\common\wallpaper_engine\config.json"),
            (Join-Path $d "Program Files\Steam\steamapps\common\wallpaper_engine\config.json"),
            (Join-Path $d "Steam\steamapps\common\wallpaper_engine\config.json"),
            (Join-Path $d "Games\steamapps\common\wallpaper_engine\config.json"),
            (Join-Path $d "App\steamapps\common\wallpaper_engine\config.json")
        )
        foreach ($p in $candidates) {
            if (Test-Path $p) { return $p }
        }
    }
    return $null
}

$script:cachedWallpaperInfo = $null
$script:cachedMonitorKey = ""
$script:lastWallpaperInfoCheck = [DateTime]::MinValue

function Get-CurrentWallpaperInfo {
    param(
        [string]$projectRoot,
        [string]$TargetMonitor = ""
    )

    $cacheKey = "$TargetMonitor"
    if ($script:cachedWallpaperInfo -and $script:cachedMonitorKey -eq $cacheKey -and ([DateTime]::UtcNow - $script:lastWallpaperInfoCheck).TotalMilliseconds -lt 1500) {
        return $script:cachedWallpaperInfo
    }

    $configPath = Get-WallpaperEngineConfigPath
    if (-not $configPath) { return $null }

    try {
        $raw = Get-Content $configPath -Raw -Encoding UTF8 -ErrorAction Stop
        $json = $raw | ConvertFrom-Json

        $userProps = $json.PSObject.Properties | Where-Object { $_.Name -notin @("?installdirectory", "general") }
        if (-not $userProps) { return $null }
        $userObj = $userProps[0].Value

        $wpConfig = $userObj.general.wallpaperconfig
        if (-not $wpConfig) { return $null }

        $monTarget = $null
        if ($TargetMonitor -and $wpConfig.selectedwallpapers.$TargetMonitor -and $wpConfig.selectedwallpapers.$TargetMonitor.file) {
            $monTarget = $wpConfig.selectedwallpapers.$TargetMonitor
        }
        if (-not $monTarget -or -not $monTarget.file) {
            $monTarget = $wpConfig.selectedwallpapers.Monitor0
        }
        if (-not $monTarget -or -not $monTarget.file) {
            $monTarget = $wpConfig.selectedwallpapers.Monitor1
        }
        if (-not $monTarget -or -not $monTarget.file) { return $null }

        $filePath = $monTarget.file
        $folder = [System.IO.Path]::GetDirectoryName($filePath)

        $title = "Wallpaper Engine"
        $depId = $null
        $projFile = Join-Path $folder "project.json"
        if ([System.IO.File]::Exists($projFile)) {
            try {
                $proj = [System.IO.File]::ReadAllText($projFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
                if ($proj.title) { $title = $proj.title }
                if ($proj.dependency) { $depId = [string]$proj.dependency }
            }
            catch { $null = $_ }
        }

        $targetMedia = $null
        $directExt = [System.IO.Path]::GetExtension($filePath).ToLower()
        $fileExists = [System.IO.File]::Exists($filePath)

        if ($fileExists -and ($directExt -eq ".webm")) {
            $targetMedia = $filePath
        }
        elseif ($fileExists -and ($directExt -in @(".mp4", ".mkv", ".mov", ".avi"))) {
            $targetMedia = Extract-VideoWallpaper -videoPath $filePath -projectRoot $projectRoot
        }
        elseif ($fileExists -and ($directExt -in @(".jpg", ".jpeg", ".png", ".webp"))) {
            $targetMedia = $filePath
        }
        elseif ($directExt -eq ".pkg") {
            $targetMedia = Extract-SceneWallpaper -pkgPath $filePath -projectRoot $projectRoot
        }

        $searchFolders = @($folder)
        if ($depId) {
            $parentRoot = [System.IO.Path]::GetDirectoryName($folder)
            if ($parentRoot) {
                $depFolder = Join-Path $parentRoot $depId
                if ([System.IO.Directory]::Exists($depFolder)) {
                    $searchFolders += $depFolder
                }
            }
        }

        foreach ($scanDir in $searchFolders) {
            if ($targetMedia -or -not [System.IO.Directory]::Exists($scanDir)) { continue }

            $pkgFiles = [System.IO.Directory]::GetFiles($scanDir, "*.pkg", [System.IO.SearchOption]::TopDirectoryOnly) | ForEach-Object { [System.IO.FileInfo]$_ } | Sort-Object Length -Descending
            if ($pkgFiles) {
                $extracted = Extract-SceneWallpaper -pkgPath $pkgFiles[0].FullName -projectRoot $projectRoot
                if ($extracted) {
                    $targetMedia = $extracted
                    break
                }
            }

            $allFiles = [System.IO.Directory]::GetFiles($scanDir, "*.*", [System.IO.SearchOption]::AllDirectories) | ForEach-Object { [System.IO.FileInfo]$_ }
            $webmVid = $allFiles | Where-Object { $_.Extension -ieq ".webm" -and $_.Length -gt 50000 } | Sort-Object Length -Descending | Select-Object -First 1
            if ($webmVid) {
                $targetMedia = $webmVid.FullName
                break
            }

            $vids = $allFiles | Where-Object { $_.Extension.ToLower() -in @(".mp4", ".mkv", ".mov", ".avi") } | Sort-Object Length -Descending
            if ($vids) {
                $resolvedVid = Extract-VideoWallpaper -videoPath $vids[0].FullName -projectRoot $projectRoot
                if ($resolvedVid) {
                    $targetMedia = $resolvedVid
                    break
                }
            }

            $imgs = $allFiles | Where-Object { $_.Extension.ToLower() -in @(".jpg", ".jpeg", ".png", ".webp") -and $_.BaseName -notmatch "(?i)^(preview|error_img|face-\d+)$" -and $_.Length -gt 50000 } | Sort-Object Length -Descending
            if ($imgs) {
                $best = $imgs | Where-Object { $_.BaseName -match "(?i)(bg|background|image|wallpaper|scene|main|full|cover|poster)" } | Select-Object -First 1
                if (-not $best) { $best = $imgs | Select-Object -First 1 }
                $targetMedia = $best.FullName
                break
            }
        }

        if (-not $targetMedia) { return $null }

        $mediaType = switch ([System.IO.Path]::GetExtension($targetMedia).ToLower()) {
            ".webm" { "video/webm" }
            ".png" { "image/png" }
            ".webp" { "image/webp" }
            default { "image/jpeg" }
        }

        $workshopId = [System.IO.Path]::GetFileName($folder)
        if (-not $workshopId -or $workshopId -eq "") { $workshopId = "default" }

        $fileVer = 0
        try {
            $fileVer = [int64]([DateTimeOffset]([System.IO.FileInfo]$targetMedia).LastWriteTimeUtc).ToUnixTimeSeconds()
        }
        catch { $null = $_ }

        $result = @{
            Id        = $workshopId
            Title     = $title
            Path      = $targetMedia
            FileName  = "${workshopId}_$([System.IO.Path]::GetFileName($targetMedia))"
            Version   = $fileVer
            MediaType = $mediaType
            Folder    = $folder
        }
        $script:cachedWallpaperInfo = $result
        $script:cachedMonitorKey = $cacheKey
        $script:lastWallpaperInfoCheck = [DateTime]::UtcNow
        return $result
    }
    catch {
        return $null
    }
}

Export-ModuleMember -Function Get-WallpaperEngineConfigPath, Get-CurrentWallpaperInfo
