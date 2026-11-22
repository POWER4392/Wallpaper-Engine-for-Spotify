$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { $null = $_ }
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Download-Fast([string]$url, [string]$outFile) {
    $curl = Get-Command "curl.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($curl) {
        & $curl.Source -fsSL --retry 2 --connect-timeout 10 -o $outFile $url 2>$null
        if ($LASTEXITCODE -eq 0 -and (Test-Path $outFile) -and (Get-Item $outFile).Length -gt 0) {
            return
        }
    }
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing
}

function Expand-Fast([string]$zipPath, [string]$destDir) {
    if (Test-Path $destDir) { Remove-Item -Path $destDir -Recurse -Force -ErrorAction SilentlyContinue }
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $destDir)
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Spotify <-> Wallpaper Engine Sync - Setup Chay Ngam" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$targetDir = "$env:LOCALAPPDATA\SpotifyWallpaperEngine"

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { "" }
$localRepoRoot = if ($scriptRoot) { Split-Path -Parent (Split-Path -Parent $scriptRoot) } else { "" }

if ($localRepoRoot -and (Test-Path (Join-Path $localRepoRoot "scripts\sync\sync-wallpaper.ps1"))) {
    Write-Host "[1/4] Phat hien thu muc du an goc, su dung truc tiep..." -ForegroundColor Green
    $targetDir = $localRepoRoot
} else {
    Write-Host "[1/2] Dang tai bo ket noi tu GitHub ve may..." -ForegroundColor Yellow
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $zipUrl = "https://github.com/POWER4392/Wallpaper-Engine-for-Spotify/archive/refs/heads/main.zip"
    $zipPath = "$env:TEMP\spotify-we-main.zip"
    $extractTemp = "$env:TEMP\spotify-we-extract"

    try {
        Download-Fast $zipUrl $zipPath
        Expand-Fast $zipPath $extractTemp
        $extractedDir = Get-ChildItem -Path $extractTemp -Directory | Select-Object -First 1
        if (-not $extractedDir) { throw "Khong tim thay thu muc giai nen tu GitHub." }
        $sourceDir = $extractedDir.FullName

        Copy-Item -Path (Join-Path $sourceDir "scripts") -Destination $targetDir -Recurse -Force
        Copy-Item -Path (Join-Path $sourceDir "tools") -Destination $targetDir -Recurse -Force

        Remove-Item -Path $zipPath -Force
        Remove-Item -Path $extractTemp -Recurse -Force
        if (-not (Test-Path (Join-Path $targetDir "scripts\sync\sync-wallpaper.ps1"))) {
            throw "Thieu file sync-wallpaper.ps1 sau khi copy."
        }
        Write-Host "  [OK] Da cai dat thanh cong vao: $targetDir" -ForegroundColor Green
    } catch {
        Write-Host "  [!] Loi tai online: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[2/3] Kiem tra FFmpeg..." -ForegroundColor Yellow
$ffmpegExe = Join-Path $targetDir "tools\ffmpeg\ffmpeg.exe"
$sysFfmpeg = Get-Command "ffmpeg" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not (Test-Path $ffmpegExe) -and -not ($sysFfmpeg -and $sysFfmpeg.Source)) {
    Write-Host "  Dang tai FFmpeg (~114MB) de ho tro chuyen doi video .mp4..." -ForegroundColor Yellow
    $ffZip = "$env:TEMP\ffmpeg-essentials.zip"
    try {
        Download-Fast "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip" $ffZip
        $zipArch = [System.IO.Compression.ZipFile]::OpenRead($ffZip)
        try {
            $ffEntry = $zipArch.Entries | Where-Object { $_.FullName -like "*/bin/ffmpeg.exe" } | Select-Object -First 1
            if ($ffEntry) {
                $ffDir = Split-Path -Parent $ffmpegExe
                if (-not (Test-Path $ffDir)) { New-Item -ItemType Directory -Path $ffDir -Force | Out-Null }
                [System.IO.Compression.ZipFileExtensions]::ExtractToFile($ffEntry, $ffmpegExe, $true)
                Write-Host "  [OK] Da tai FFmpeg vao: $ffmpegExe" -ForegroundColor Green
            }
        } finally {
            $zipArch.Dispose()
        }
        if (Test-Path $ffZip) { Remove-Item -Path $ffZip -Force }
    } catch {
        Write-Host "  [!] Khong tai duoc FFmpeg (van chay duoc anh/scene tinh): $($_.Exception.Message)" -ForegroundColor Yellow
        if (Test-Path $ffZip) { Remove-Item -Path $ffZip -Force }
    }
} else {
    Write-Host "  [OK] Da co san FFmpeg." -ForegroundColor Green
}

Write-Host "[3/4] Kiem tra Python (Pillow & NumPy) de ghep scene .pkg..." -ForegroundColor Yellow
$embPyDir = Join-Path $targetDir "tools\python"
$embPyExe = Join-Path $embPyDir "python.exe"
$hasReadyPy = $false
if (Test-Path $embPyExe) {
    & $embPyExe -c "import PIL, numpy" 2>$null
    if ($LASTEXITCODE -eq 0) { $hasReadyPy = $true }
}
if (-not $hasReadyPy) {
    $sysPy = (Get-Command 'py', 'python' -ErrorAction SilentlyContinue | Where-Object { $_.Source -notmatch 'WindowsApps' } | Select-Object -First 1).Source
    if ($sysPy) {
        & $sysPy -c "import PIL, numpy" 2>$null
        if ($LASTEXITCODE -eq 0) {
            $hasReadyPy = $true
        } else {
            Write-Host "  Dang cai pillow & numpy cho Python..." -ForegroundColor Yellow
            & $sysPy -m pip install --quiet --no-warn-script-location pillow numpy 2>$null
            & $sysPy -c "import PIL, numpy" 2>$null
            if ($LASTEXITCODE -eq 0) { $hasReadyPy = $true }
        }
    }
}
if (-not $hasReadyPy) {
    Write-Host "  Dang tai Python Embeddable + Pillow/NumPy (~35MB)..." -ForegroundColor Yellow
    $pyZip = "$env:TEMP\python-embed.zip"
    $getPip = "$env:TEMP\get-pip.py"
    try {
        Download-Fast "https://www.python.org/ftp/python/3.12.8/python-3.12.8-embed-amd64.zip" $pyZip
        Expand-Fast $pyZip $embPyDir
        $pthFile = Get-ChildItem -Path $embPyDir -Filter "python*._pth" | Select-Object -First 1
        if ($pthFile) {
            $pthText = Get-Content $pthFile.FullName -Raw
            $pthText = $pthText -replace '#import site', 'import site'
            Set-Content -Path $pthFile.FullName -Value $pthText -Encoding ASCII
        }
        Download-Fast "https://bootstrap.pypa.io/get-pip.py" $getPip
        & $embPyExe $getPip --no-warn-script-location --no-cache-dir --disable-pip-version-check --quiet
        & $embPyExe -m pip install --no-warn-script-location --no-cache-dir --only-binary=:all: --disable-pip-version-check --quiet pillow numpy
        & $embPyExe -c "import PIL, numpy" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Da cai dat xong Python + Pillow/NumPy vao: $embPyDir" -ForegroundColor Green
        } else {
            Write-Host "  [!] Cai Python hoan tat nhung thieu thu vien PIL/numpy." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [!] Khong tai duoc Python (van chay duoc video/anh): $($_.Exception.Message)" -ForegroundColor Yellow
    } finally {
        if (Test-Path $pyZip) { Remove-Item -Path $pyZip -Force -ErrorAction SilentlyContinue }
        if (Test-Path $getPip) { Remove-Item -Path $getPip -Force -ErrorAction SilentlyContinue }
    }
} else {
    Write-Host "  [OK] Da co san Python + Pillow/NumPy." -ForegroundColor Green
}

Write-Host "[4/4] Dang ky tu dong chay ngam cung Windows..." -ForegroundColor Yellow
try {
    $wsh = New-Object -ComObject WScript.Shell
    $startupLnk = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\SpotifyWallpaperWatcher.lnk"
    $watcherVbs = Join-Path $targetDir "scripts\watcher\watch-spotify-silent.vbs"
    if (-not (Test-Path $watcherVbs)) {
        $watcherVbs = Join-Path $targetDir "scripts\watcher\watch-spotify.ps1"
    }

    $lnk = $wsh.CreateShortcut($startupLnk)
    if ($watcherVbs.EndsWith(".vbs")) {
        $lnk.TargetPath = "wscript.exe"
        $lnk.Arguments = "`"$watcherVbs`""
    } else {
        $lnk.TargetPath = "powershell.exe"
        $lnk.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watcherVbs`""
    }
    $lnk.WorkingDirectory = (Join-Path $targetDir "scripts\watcher")
    $lnk.Description = "Spotify Wallpaper Engine Watcher Daemon"
    $lnk.Save()

    $runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    if (-not (Test-Path $runKey)) { New-Item -Path $runKey -Force | Out-Null }
    if ($watcherVbs.EndsWith(".vbs")) {
        Set-ItemProperty -Path $runKey -Name "SpotifyWallpaperWatcher" -Value "wscript.exe `"$watcherVbs`""
    } else {
        Set-ItemProperty -Path $runKey -Name "SpotifyWallpaperWatcher" -Value "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watcherVbs`""
    }

    foreach ($saKey in @(
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run"
    )) {
        if (Test-Path $saKey) {
            Remove-ItemProperty -Path $saKey -Name "SpotifyWallpaperWatcher.lnk" -ErrorAction SilentlyContinue
            Remove-ItemProperty -Path $saKey -Name "SpotifyWallpaperWatcher" -ErrorAction SilentlyContinue
        }
    }
    Write-Host "  [OK] Da tao Startup + Registry Run cho Watcher" -ForegroundColor Green
} catch {
    Write-Host "  [!] Loi tao shortcut: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Dang khoi dong Watcher & Bridge ket noi..." -ForegroundColor Cyan
$watcherRunVbs = Join-Path $targetDir "scripts\watcher\watch-spotify-silent.vbs"
if (Test-Path $watcherRunVbs) {
    Start-Process -FilePath "wscript.exe" -ArgumentList "`"$watcherRunVbs`"" -WindowStyle Hidden
}
$syncVbs = Join-Path $targetDir "scripts\sync\start-sync-silent.vbs"
if (Test-Path $syncVbs) {
    Start-Process -FilePath "wscript.exe" -ArgumentList "`"$syncVbs`"" -WindowStyle Hidden
} else {
    $syncPs = Join-Path $targetDir "scripts\sync\sync-wallpaper.ps1"
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$syncPs`"" -WindowStyle Hidden
}

Start-Sleep -Seconds 2
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "  HOAN TAT! Tu nay moi khi mo Spotify, hinh nen se tu dong sync." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
