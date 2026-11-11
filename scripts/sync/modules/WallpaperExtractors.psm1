function Get-ShellThumbPath {
    param([string]$projectRoot)
    $candidates = @(
        (Join-Path $projectRoot "tools\shellthumb\ShellThumb.exe"),
        (Join-Path $env:TEMP "shellthumb\ShellThumb.exe")
    )
    foreach ($c in $candidates) {
        if ($c -and [System.IO.File]::Exists($c)) { return $c }
    }
    return $null
}

function Get-RePkgPath {
    param([string]$projectRoot)
    $candidates = @(
        (Join-Path $projectRoot "tools\repkg\RePKG.exe"),
        (Join-Path $env:TEMP "repkg\RePKG.exe")
    )
    foreach ($c in $candidates) {
        if ($c -and [System.IO.File]::Exists($c)) { return $c }
    }
    return $null
}

function Get-FfmpegPath {
    param([string]$projectRoot)
    $candidates = @(
        (Join-Path $projectRoot "tools\ffmpeg\ffmpeg.exe")
    )
    foreach ($c in $candidates) {
        if ($c -and [System.IO.File]::Exists($c)) { return $c }
    }
    $cmd = Get-Command "ffmpeg" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($cmd -and $cmd.Source) { return $cmd.Source }
    return $null
}

function Start-BackgroundWebmConversion {
    param(
        [string]$ffmpegPath,
        [string]$videoPath,
        [string]$cacheDir,
        [string]$workshopId
    )
    $outWebm  = Join-Path $cacheDir "video_wallpaper.webm"
    $tmpWebm  = Join-Path $cacheDir "video_wallpaper.tmp.webm"
    $lockFile = Join-Path $cacheDir "encoding.lock"

    if ([System.IO.File]::Exists($outWebm) -and ([System.IO.FileInfo]$outWebm).Length -gt 50000) {
        return
    }

    if ([System.IO.File]::Exists($lockFile)) {
        $lockAge = ([DateTime]::UtcNow - ([System.IO.FileInfo]$lockFile).LastWriteTimeUtc).TotalMinutes
        if ($lockAge -lt 5) {
            return
        }
        try { [System.IO.File]::Delete($lockFile) } catch {}
    }

    try {
        [System.IO.File]::WriteAllText($lockFile, "$PID")
        Write-Host " [FFmpeg] Starting full-quality WebM video conversion for: $workshopId..." -ForegroundColor Yellow

        $escapedFfmpeg = $ffmpegPath.Replace("'", "''")
        $escapedInput  = $videoPath.Replace("'", "''")
        $escapedTmp    = $tmpWebm.Replace("'", "''")
        $escapedOut    = $outWebm.Replace("'", "''")
        $escapedLock   = $lockFile.Replace("'", "''")

        $bgScript = @"
try {
    & '$escapedFfmpeg' -y -i '$escapedInput' -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' -c:v libvpx -b:v 10M -crf 18 -quality realtime -cpu-used 6 -threads 0 -an -f webm '$escapedTmp' 2>`$null
    if ([System.IO.File]::Exists('$escapedTmp') -and ([System.IO.FileInfo]'$escapedTmp').Length -gt 50000) {
        if ([System.IO.File]::Exists('$escapedOut')) { [System.IO.File]::Delete('$escapedOut') }
        [System.IO.File]::Move('$escapedTmp', '$escapedOut')
    }
} finally {
    if ([System.IO.File]::Exists('$escapedLock')) { [System.IO.File]::Delete('$escapedLock') }
}
"@
        $encoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($bgScript))
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand $encoded" -WindowStyle Hidden | Out-Null
    } catch {
        if ([System.IO.File]::Exists($lockFile)) { try { [System.IO.File]::Delete($lockFile) } catch {} }
    }
}

function Extract-VideoWallpaper {
    param(
        [string]$videoPath,
        [string]$projectRoot
    )
    if (-not $videoPath -or -not [System.IO.File]::Exists($videoPath)) { return $null }

    $folder = [System.IO.Path]::GetDirectoryName($videoPath)
    $workshopId = [System.IO.Path]::GetFileName($folder)
    if (-not $workshopId -or $workshopId -eq "") { $workshopId = "default" }

    $cacheRoot = Join-Path $env:TEMP "we_cache"
    $cacheDir  = Join-Path $cacheRoot $workshopId
    if (-not [System.IO.Directory]::Exists($cacheDir)) {
        [System.IO.Directory]::CreateDirectory($cacheDir) | Out-Null
    }

    $outWebm = Join-Path $cacheDir "video_wallpaper.webm"
    if ([System.IO.File]::Exists($outWebm) -and ([System.IO.FileInfo]$outWebm).Length -gt 50000) {
        return $outWebm
    }

    $ffmpeg = Get-FfmpegPath -projectRoot $projectRoot

    if ($ffmpeg) {
        Start-BackgroundWebmConversion -ffmpegPath $ffmpeg -videoPath $videoPath -cacheDir $cacheDir -workshopId $workshopId
    }

    $outJpg = Join-Path $cacheDir "video_frame.jpg"
    if ([System.IO.File]::Exists($outJpg) -and ([System.IO.FileInfo]$outJpg).Length -gt 10000) {
        return $outJpg
    }

    $outPng = Join-Path $cacheDir "video_frame.png"
    if ([System.IO.File]::Exists($outPng) -and ([System.IO.FileInfo]$outPng).Length -gt 10000) {
        return $outPng
    }

    if ($ffmpeg) {
        foreach ($seekTime in @("00:00:01", "00:00:00")) {
            try {
                $pinfo = New-Object System.Diagnostics.ProcessStartInfo
                $pinfo.FileName = $ffmpeg
                $pinfo.Arguments = "-y -ss $seekTime -i `"$videoPath`" -frames:v 1 -q:v 1 `"$outJpg`""
                $pinfo.UseShellExecute = $false
                $pinfo.CreateNoWindow = $true
                $proc = [System.Diagnostics.Process]::Start($pinfo)
                $proc.WaitForExit(8000) | Out-Null
                if ([System.IO.File]::Exists($outJpg) -and ([System.IO.FileInfo]$outJpg).Length -gt 10000) {
                    Write-Host " [FFmpeg] Extracted native Full-HD frame from: $workshopId" -ForegroundColor Cyan
                    return $outJpg
                }
            } catch {}
        }
    }

    $shellThumb = Get-ShellThumbPath -projectRoot $projectRoot
    if ($shellThumb) {
        try {
            $pinfo = New-Object System.Diagnostics.ProcessStartInfo
            $pinfo.FileName = $shellThumb
            $pinfo.Arguments = "`"$videoPath`" `"$outPng`""
            $pinfo.UseShellExecute = $false
            $pinfo.CreateNoWindow = $true
            $proc = [System.Diagnostics.Process]::Start($pinfo)
            $proc.WaitForExit(5000) | Out-Null
            if ([System.IO.File]::Exists($outPng) -and ([System.IO.FileInfo]$outPng).Length -gt 10000) {
                Write-Host " [VideoFrame] Extracted Full HD frame from: $workshopId" -ForegroundColor Cyan
                return $outPng
            }
        } catch {}
    }

    return $null
}

function Extract-SceneWallpaper {
    param(
        [string]$pkgPath,
        [string]$projectRoot
    )
    if (-not $pkgPath -or -not [System.IO.File]::Exists($pkgPath)) { return $null }

    $folder = [System.IO.Path]::GetDirectoryName($pkgPath)
    $workshopId = [System.IO.Path]::GetFileName($folder)
    if (-not $workshopId -or $workshopId -eq "") { $workshopId = "default" }

    $cacheRoot = Join-Path $env:TEMP "we_cache"
    $cacheDir  = Join-Path $cacheRoot $workshopId
    if (-not [System.IO.Directory]::Exists($cacheDir)) {
        [System.IO.Directory]::CreateDirectory($cacheDir) | Out-Null
    }

    $outWebm = Join-Path $cacheDir "video_wallpaper.webm"
    if ([System.IO.File]::Exists($outWebm) -and ([System.IO.FileInfo]$outWebm).Length -gt 50000) {
        return $outWebm
    }

    $hasFiles = Get-ChildItem -Path $cacheDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin @("resolved_wallpaper.jpg", "video_frame.jpg", "video_frame.png", "encoding.lock") }
    if (-not $hasFiles) {
        $repkg = Get-RePkgPath -projectRoot $projectRoot
        if ($repkg) {
            Write-Host " [RePKG] Extracting full background from: $workshopId..." -ForegroundColor Cyan
            try {
                $pinfo = New-Object System.Diagnostics.ProcessStartInfo
                $pinfo.FileName = $repkg
                $pinfo.Arguments = "extract `"$pkgPath`" -o `"$cacheDir`" -s --onlyexts tex,json,mp4,webm"
                $pinfo.UseShellExecute = $false
                $pinfo.CreateNoWindow = $true
                $pinfo.RedirectStandardOutput = $true
                $pinfo.RedirectStandardError = $true

                $proc = [System.Diagnostics.Process]::Start($pinfo)
                $proc.WaitForExit(30000) | Out-Null
            } catch {
                Write-Warning "RePKG error: $($_.Exception.Message)"
            }
        }
    }

    $pkgWebm = Get-ChildItem -Path $cacheDir -Filter "*.webm" -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "*.tmp.webm" -and $_.Length -gt 50000 } | Sort-Object Length -Descending | Select-Object -First 1
    if ($pkgWebm) {
        return $pkgWebm.FullName
    }
    $pkgMp4 = Get-ChildItem -Path $cacheDir -Filter "*.mp4" -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 1
    if ($pkgMp4) {
        $vidRes = Extract-VideoWallpaper -videoPath $pkgMp4.FullName -projectRoot $projectRoot
        if ($vidRes) { return $vidRes }
    }

    $compScript = Join-Path $projectRoot "tools\compositor\compose_scene.py"
    $resolvedJpg = Join-Path $cacheDir "resolved_wallpaper.jpg"
    if ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 10000) {
        $scriptTime = if ([System.IO.File]::Exists($compScript)) { ([System.IO.FileInfo]$compScript).LastWriteTimeUtc } else { [DateTime]::MinValue }
        $cacheTime  = ([System.IO.FileInfo]$resolvedJpg).LastWriteTimeUtc
        if ($cacheTime -ge $scriptTime) {
            return $resolvedJpg
        }
    }

    if ([System.IO.File]::Exists($compScript)) {
        try {
            $pyCmd = (Get-Command 'py', 'python' -ErrorAction SilentlyContinue | Where-Object { $_.Source -notmatch 'WindowsApps' } | Select-Object -First 1).Source
            if (-not $pyCmd) { $pyCmd = "python" }

            $pinfo = New-Object System.Diagnostics.ProcessStartInfo
            $pinfo.FileName = $pyCmd
            $pinfo.Arguments = "`"$compScript`" `"$cacheDir`""
            $pinfo.UseShellExecute = $false
            $pinfo.CreateNoWindow = $true
            $proc = [System.Diagnostics.Process]::Start($pinfo)
            $proc.WaitForExit(30000) | Out-Null
            if ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 10000) {
                Write-Host " [Compositor] Ready complete background: $workshopId" -ForegroundColor Green
                return $resolvedJpg
            }
        } catch {}
    }

    return $null
}

Export-ModuleMember -Function Get-ShellThumbPath, Get-RePkgPath, Get-FfmpegPath, Extract-VideoWallpaper, Extract-SceneWallpaper
