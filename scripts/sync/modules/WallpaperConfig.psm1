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
    } catch {}

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
$script:lastWallpaperInfoCheck = [DateTime]::MinValue

function Get-CurrentWallpaperInfo {
    param([string]$projectRoot)

    if ($script:cachedWallpaperInfo -and ([DateTime]::UtcNow - $script:lastWallpaperInfoCheck).TotalMilliseconds -lt 1500) {
        return $script:cachedWallpaperInfo
    }

    $configPath = Get-WallpaperEngineConfigPath
    if (-not $configPath) { return $null }

    try {
        $raw  = Get-Content $configPath -Raw -Encoding UTF8 -ErrorAction Stop
        $json = $raw | ConvertFrom-Json

        $userProps = $json.PSObject.Properties | Where-Object { $_.Name -notin @("?installdirectory", "general") }
        if (-not $userProps) { return $null }
        $userObj = $userProps[0].Value

        $wpConfig = $userObj.general.wallpaperconfig
        if (-not $wpConfig) { return $null }

        $monitor0 = $wpConfig.selectedwallpapers.Monitor0
        if (-not $monitor0 -or -not $monitor0.file) {
            $monitor0 = $wpConfig.selectedwallpapers.Monitor1
        }
        if (-not $monitor0 -or -not $monitor0.file) { return $null }

        $filePath = $monitor0.file
        $folder   = [System.IO.Path]::GetDirectoryName($filePath)

        $title    = "Wallpaper Engine"
        $projFile = Join-Path $folder "project.json"
        if ([System.IO.File]::Exists($projFile)) {
            try {
                $proj = [System.IO.File]::ReadAllText($projFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
                if ($proj.title) { $title = $proj.title }
            } catch {}
        }

        $targetMedia = $null
        $mediaType   = "image/jpeg"
        $directExt   = [System.IO.Path]::GetExtension($filePath).ToLower()
        $fileExists  = [System.IO.File]::Exists($filePath)

        if ($fileExists -and ($directExt -eq ".webm")) {
            $targetMedia = $filePath
            $mediaType   = "video/webm"
        }
        elseif ($fileExists -and ($directExt -in @(".mp4", ".mkv", ".mov", ".avi"))) {
            $resolvedVid = Extract-VideoWallpaper -videoPath $filePath -projectRoot $projectRoot
            if ($resolvedVid) {
                $targetMedia = $resolvedVid
                $ext = [System.IO.Path]::GetExtension($targetMedia).ToLower()
                if ($ext -eq ".webm") { $mediaType = "video/webm" }
                elseif ($ext -eq ".png") { $mediaType = "image/png" }
                elseif ($ext -eq ".webp") { $mediaType = "image/webp" }
                else { $mediaType = "image/jpeg" }
            }
        }

        if (-not $targetMedia -and $fileExists -and ($directExt -in @(".jpg", ".jpeg", ".png", ".webp"))) {
            $targetMedia = $filePath
            switch ($directExt) {
                ".png"  { $mediaType = "image/png" }
                ".webp" { $mediaType = "image/webp" }
                default { $mediaType = "image/jpeg" }
            }
        }

        if (-not $targetMedia -and $directExt -eq ".pkg") {
            $extracted = Extract-SceneWallpaper -pkgPath $filePath -projectRoot $projectRoot
            if ($extracted) {
                $targetMedia = $extracted
                $ext = [System.IO.Path]::GetExtension($targetMedia).ToLower()
                if ($ext -eq ".webm") { $mediaType = "video/webm" }
                elseif ($ext -eq ".png") { $mediaType = "image/png" }
                elseif ($ext -eq ".webp") { $mediaType = "image/webp" }
                else { $mediaType = "image/jpeg" }
            }
        }

        if (-not $targetMedia -and [System.IO.Directory]::Exists($folder)) {
            $allFiles = [System.IO.Directory]::GetFiles($folder) | ForEach-Object { [System.IO.FileInfo]$_ }
            $webmVid = $allFiles | Where-Object { $_.Extension -ieq ".webm" } | Sort-Object Length -Descending | Select-Object -First 1
            if ($webmVid) {
                $targetMedia = $webmVid.FullName
                $mediaType   = "video/webm"
            } else {
                $vids = $allFiles | Where-Object { $_.Extension.ToLower() -in @(".mp4", ".mkv", ".mov", ".avi") } | Sort-Object Length -Descending
                if ($vids) {
                    $resolvedVid = Extract-VideoWallpaper -videoPath $vids[0].FullName -projectRoot $projectRoot
                    if ($resolvedVid) {
                        $targetMedia = $resolvedVid
                        $ext = [System.IO.Path]::GetExtension($targetMedia).ToLower()
                        if ($ext -eq ".webm") { $mediaType = "video/webm" }
                        elseif ($ext -eq ".png") { $mediaType = "image/png" }
                        elseif ($ext -eq ".webp") { $mediaType = "image/webp" }
                        else { $mediaType = "image/jpeg" }
                    }
                }
            }
            if (-not $targetMedia) {
                $imgs = $allFiles | Where-Object { $_.Extension.ToLower() -in @(".jpg", ".jpeg", ".png", ".webp") -and $_.BaseName -notmatch "(?i)^preview$" } | Sort-Object Length -Descending
                if ($imgs) {
                    $best = $imgs | Where-Object { $_.BaseName -match "(?i)^(bg|background|image|wallpaper|scene|main|full|cover)" } | Select-Object -First 1
                    if (-not $best) { $best = $imgs | Select-Object -First 1 }
                    $targetMedia = $best.FullName
                    $ext = $best.Extension.ToLower()
                    if ($ext -eq ".png") { $mediaType = "image/png" }
                    elseif ($ext -eq ".webp") { $mediaType = "image/webp" }
                    else { $mediaType = "image/jpeg" }
                }
            }
        }

        if (-not $targetMedia) { return $null }

        $workshopId = [System.IO.Path]::GetFileName($folder)
        if (-not $workshopId -or $workshopId -eq "") { $workshopId = "default" }

        $fileVer = 0
        try {
            $fileVer = [int64]([DateTimeOffset]([System.IO.FileInfo]$targetMedia).LastWriteTimeUtc).ToUnixTimeSeconds()
        } catch {}

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
        $script:lastWallpaperInfoCheck = [DateTime]::UtcNow
        return $result
    } catch {
        return $null
    }
}

Export-ModuleMember -Function Get-WallpaperEngineConfigPath, Get-CurrentWallpaperInfo
