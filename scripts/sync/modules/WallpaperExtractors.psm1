function Get-RePkgPath {
    param([string]$projectRoot)
    $p = Join-Path $projectRoot "tools\repkg\RePKG.exe"
    if ([System.IO.File]::Exists($p)) { return $p }
    return $null
}

function Get-FfmpegPath {
    param([string]$projectRoot)
    $p = Join-Path $projectRoot "tools\ffmpeg\ffmpeg.exe"
    if ([System.IO.File]::Exists($p)) { return $p }
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
    $hqMarker = Join-Path $cacheDir "video_hq.done"

    $metaFile = Join-Path $cacheDir "video_meta.json"
    $meta = $null
    if ($metaFile -and [System.IO.File]::Exists($metaFile)) {
        try { $meta = [System.IO.File]::ReadAllText($metaFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $null = $_ }
    }

    $hasIntro = $false
    $introPath = ""
    $introTrim = 0.0
    if ($meta -and $meta.hasIntro -and $meta.introFile) {
        $candIntro = Join-Path $cacheDir $meta.introFile
        if ([System.IO.File]::Exists($candIntro)) {
            $hasIntro = $true
            $introPath = $candIntro
            if ($meta.introDuration) { $introTrim = [double]$meta.introDuration }
        }
    }

    $srcStamp = if ($hasIntro) {
        "v5_stitched_" + [System.IO.Path]::GetFileName($introPath) + "_" + ([System.IO.FileInfo]$introPath).Length + "_" + [System.IO.Path]::GetFileName($videoPath) + "_" + ([System.IO.FileInfo]$videoPath).Length + "_" + $introTrim
    } else {
        "v5_" + [System.IO.Path]::GetFileName($videoPath) + "_" + ([System.IO.FileInfo]$videoPath).Length
    }

    if ([System.IO.File]::Exists($outWebm) -and ([System.IO.FileInfo]$outWebm).Length -gt 50000 -and [System.IO.File]::Exists($hqMarker) -and ([System.IO.File]::ReadAllText($hqMarker).Trim() -eq $srcStamp)) {
        return
    }

    if ([System.IO.File]::Exists($lockFile)) {
        $stale = $false
        try {
            $lockPid = [int]([System.IO.File]::ReadAllText($lockFile).Trim())
            $proc = Get-Process -Id $lockPid -ErrorAction SilentlyContinue
            if (-not $proc) { $stale = $true }
        } catch {
            $stale = $true
        }
        $lockAge = ([DateTime]::UtcNow - ([System.IO.FileInfo]$lockFile).LastWriteTimeUtc).TotalMinutes
        if (-not $stale -and $lockAge -lt 5) {
            return
        }
        try { [System.IO.File]::Delete($lockFile) } catch { $null = $_ }
    }

    try {
        [System.IO.File]::WriteAllText($lockFile, "$PID")
        Write-Host " [FFmpeg] Starting full-quality WebM video conversion for: $workshopId..." -ForegroundColor Yellow

        $escapedStamp = $srcStamp.Replace("'", "''")
        $escapedFfmpeg = $ffmpegPath.Replace("'", "''")
        $escapedInput  = $videoPath.Replace("'", "''")
        $escapedTmp    = $tmpWebm.Replace("'", "''")
        $escapedOut    = $outWebm.Replace("'", "''")
        $escapedLock   = $lockFile.Replace("'", "''")
        $escapedHq     = $hqMarker.Replace("'", "''")

        $bgScript = if ($hasIntro) {
            $escapedIntro = $introPath.Replace("'", "''")
            $trimArg = if ($introTrim -gt 0) { "-t $introTrim" } else { "" }
@"
try {
    & '$escapedFfmpeg' -y $trimArg -i '$escapedIntro' -i '$escapedInput' -filter_complex "[0:v]scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p[v0]; [1:v]scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p[v1]; [v0][v1]concat=n=2:v=1[v]" -map "[v]" -c:v libvpx-vp9 -row-mt 1 -tile-columns 2 -deadline realtime -cpu-used 5 -crf 16 -b:v 0 -threads 0 -an -f webm '$escapedTmp' 2>`$null
    if (-not ([System.IO.File]::Exists('$escapedTmp') -and ([System.IO.FileInfo]'$escapedTmp').Length -gt 50000)) {
        & '$escapedFfmpeg' -y $trimArg -i '$escapedIntro' -i '$escapedInput' -filter_complex "[0:v]scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p[v0]; [1:v]scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p[v1]; [v0][v1]concat=n=2:v=1[v]" -map "[v]" -c:v libvpx -crf 8 -b:v 35M -deadline good -cpu-used 4 -slices 4 -threads 0 -an -f webm '$escapedTmp' 2>`$null
    }
    if ([System.IO.File]::Exists('$escapedTmp') -and ([System.IO.FileInfo]'$escapedTmp').Length -gt 50000) {
        if ([System.IO.File]::Exists('$escapedOut')) { [System.IO.File]::Delete('$escapedOut') }
        [System.IO.File]::Move('$escapedTmp', '$escapedOut')
        [System.IO.File]::WriteAllText('$escapedHq', '$escapedStamp')
    }
} finally {
    if ([System.IO.File]::Exists('$escapedLock')) { [System.IO.File]::Delete('$escapedLock') }
}
"@
        } else {
@"
try {
    & '$escapedFfmpeg' -y -i '$escapedInput' -vf "scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p" -c:v libvpx-vp9 -row-mt 1 -tile-columns 2 -deadline realtime -cpu-used 5 -crf 16 -b:v 0 -threads 0 -an -f webm '$escapedTmp' 2>`$null
    if (-not ([System.IO.File]::Exists('$escapedTmp') -and ([System.IO.FileInfo]'$escapedTmp').Length -gt 50000)) {
        & '$escapedFfmpeg' -y -i '$escapedInput' -vf "scale='min(2560,iw)':-2:flags=lanczos,format=yuv420p" -c:v libvpx -crf 8 -b:v 35M -deadline good -cpu-used 4 -slices 4 -threads 0 -an -f webm '$escapedTmp' 2>`$null
    }
    if ([System.IO.File]::Exists('$escapedTmp') -and ([System.IO.FileInfo]'$escapedTmp').Length -gt 50000) {
        if ([System.IO.File]::Exists('$escapedOut')) { [System.IO.File]::Delete('$escapedOut') }
        [System.IO.File]::Move('$escapedTmp', '$escapedOut')
        [System.IO.File]::WriteAllText('$escapedHq', '$escapedStamp')
    }
} finally {
    if ([System.IO.File]::Exists('$escapedLock')) { [System.IO.File]::Delete('$escapedLock') }
}
"@
        }

        $encoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($bgScript))
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand $encoded" -WindowStyle Hidden | Out-Null
    } catch {
        if ([System.IO.File]::Exists($lockFile)) { try { [System.IO.File]::Delete($lockFile) } catch { $null = $_ } }
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
    $hqMarker = Join-Path $cacheDir "video_hq.done"

    $metaFile = Join-Path $cacheDir "video_meta.json"
    $meta = $null
    if ($metaFile -and [System.IO.File]::Exists($metaFile)) {
        try { $meta = [System.IO.File]::ReadAllText($metaFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json } catch { $null = $_ }
    }

    $hasIntro = $false
    $introPath = ""
    $introTrim = 0.0
    if ($meta -and $meta.hasIntro -and $meta.introFile) {
        $candIntro = Join-Path $cacheDir $meta.introFile
        if ([System.IO.File]::Exists($candIntro)) {
            $hasIntro = $true
            $introPath = $candIntro
            if ($meta.introDuration) { $introTrim = [double]$meta.introDuration }
        }
    }

    $srcStamp = if ($hasIntro) {
        "v5_stitched_" + [System.IO.Path]::GetFileName($introPath) + "_" + ([System.IO.FileInfo]$introPath).Length + "_" + [System.IO.Path]::GetFileName($videoPath) + "_" + ([System.IO.FileInfo]$videoPath).Length + "_" + $introTrim
    } else {
        "v5_" + [System.IO.Path]::GetFileName($videoPath) + "_" + ([System.IO.FileInfo]$videoPath).Length
    }

    if ([System.IO.File]::Exists($outWebm) -and ([System.IO.FileInfo]$outWebm).Length -gt 50000 -and [System.IO.File]::Exists($hqMarker) -and ([System.IO.File]::ReadAllText($hqMarker).Trim() -eq $srcStamp)) {
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

    if ($ffmpeg) {
        $seekCandidates = @("00:00:01", "00:00:00")
        if ($hasIntro -and $introTrim -gt 0) {
            $mainSeek = [TimeSpan]::FromSeconds($introTrim + 1.0).ToString("hh\:mm\:ss")
            $seekCandidates = @($mainSeek, "00:00:01", "00:00:00")
        }
        foreach ($seekTime in $seekCandidates) {
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
            } catch { $null = $_ }
        }
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


    $doneMarker = Join-Path $cacheDir "extract.done"
    $pkgStamp = "v2_" + [string]([System.IO.FileInfo]$pkgPath).Length + "_" + [string]([System.IO.FileInfo]$pkgPath).LastWriteTimeUtc.Ticks
    $extractOk = $false
    if ([System.IO.File]::Exists($doneMarker)) {
        try { $extractOk = ([System.IO.File]::ReadAllText($doneMarker).Trim() -eq $pkgStamp) } catch { $null = $_ }
    }
    if (-not $extractOk) {
        $repkg = Get-RePkgPath -projectRoot $projectRoot
        if ($repkg) {
            Write-Host " [RePKG] Extracting full background from: $workshopId..." -ForegroundColor Cyan
            Get-ChildItem -Path $cacheDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin @("video_wallpaper.webm", "encoding.lock") } | ForEach-Object { try { $_.Delete() } catch { $null = $_ } }
            try {
                $pinfo = New-Object System.Diagnostics.ProcessStartInfo
                $pinfo.FileName = $repkg
                $pinfo.Arguments = "extract `"$pkgPath`" -o `"$cacheDir`" -s --onlyexts tex,json,mp4,webm,mdl"
                $pinfo.UseShellExecute = $false
                $pinfo.CreateNoWindow = $true
                $pinfo.RedirectStandardOutput = $true
                $pinfo.RedirectStandardError = $true

                $proc = [System.Diagnostics.Process]::Start($pinfo)
                $null = $proc.StandardOutput.ReadToEndAsync()
                $null = $proc.StandardError.ReadToEndAsync()
                if ($proc.WaitForExit(120000)) {
                    $proc.WaitForExit()
                    if ($proc.ExitCode -eq 0) {
                        [System.IO.File]::WriteAllText($doneMarker, $pkgStamp)
                    }
                } else {
                    try { $proc.Kill() } catch { $null = $_ }
                    Write-Warning "RePKG timeout: $workshopId"
                }
            } catch {
                Write-Warning "RePKG error: $($_.Exception.Message)"
            }
        }
    }

    $pkgWebm = Get-ChildItem -Path $cacheDir -Filter "*.webm" -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "video_wallpaper.webm" -and $_.Name -notlike "*.tmp.webm" -and $_.Length -gt 50000 -and $_.Name -notmatch "intro|ruchang|入场|拉镜|开场" } | Sort-Object Length -Descending | Select-Object -First 1
    if ($pkgWebm) {
        return $pkgWebm.FullName
    }

    $compScript = Join-Path $projectRoot "tools\compositor\compose_scene.py"
    $resolvedJpg = Join-Path $cacheDir "resolved_wallpaper.jpg"
    $pkgMp4 = $null
    if ([System.IO.File]::Exists($compScript) -and -not ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 2000 -and ([System.IO.FileInfo]$resolvedJpg).LastWriteTimeUtc -ge ([System.IO.FileInfo]$compScript).LastWriteTimeUtc)) {
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
            if ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 2000) {
                Write-Host " [Compositor] Ready complete background: $workshopId" -ForegroundColor Green
            }
        } catch { $null = $_ }
    }

    $metaFile = Join-Path $cacheDir "video_meta.json"
    if ([System.IO.File]::Exists($metaFile)) {
        try {
            $meta = [System.IO.File]::ReadAllText($metaFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
            if ($meta.hasVideo -and $meta.mainFile) {
                $mainVid = Join-Path $cacheDir $meta.mainFile
                if ([System.IO.File]::Exists($mainVid)) {
                    $pkgMp4 = [System.IO.FileInfo]$mainVid
                }
            }
        } catch { $null = $_ }
    }

    if (-not $pkgMp4) {
        $primaryMp4Ref = Join-Path $cacheDir "primary_video.txt"
        if ([System.IO.File]::Exists($primaryMp4Ref)) {
            $refPath = [System.IO.File]::ReadAllText($primaryMp4Ref).Trim()
            if ($refPath -and [System.IO.File]::Exists($refPath)) {
                $pkgMp4 = [System.IO.FileInfo]$refPath
            }
        } elseif (-not ([System.IO.File]::Exists((Join-Path $cacheDir "scene.json")))) {
            $pkgMp4 = Get-ChildItem -Path $cacheDir -Filter "*.mp4" -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 1
        }
    }
    if ($pkgMp4) {
        $vidRes = Extract-VideoWallpaper -videoPath $pkgMp4.FullName -projectRoot $projectRoot
        if ($vidRes -and $vidRes.EndsWith(".webm")) { return $vidRes }
        if ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 2000) {
            return $resolvedJpg
        }
        if ($vidRes) { return $vidRes }
    }

    if ([System.IO.File]::Exists($resolvedJpg) -and ([System.IO.FileInfo]$resolvedJpg).Length -gt 2000) {
        return $resolvedJpg
    }

    return $null
}

Export-ModuleMember -Function Get-RePkgPath, Get-FfmpegPath, Extract-VideoWallpaper, Extract-SceneWallpaper
