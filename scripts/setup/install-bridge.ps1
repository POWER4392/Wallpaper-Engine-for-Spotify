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

Write-Host "[2/3] Kiem tra FFmpeg & Python (chay ngam khong chan)..." -ForegroundColor Yellow
$ffmpegExe = Join-Path $targetDir "tools\ffmpeg\ffmpeg.exe"
$sysFfmpeg = Get-Command "ffmpeg" -ErrorAction SilentlyContinue | Select-Object -First 1
$hasFfmpeg = (Test-Path $ffmpegExe) -or ($sysFfmpeg -and $sysFfmpeg.Source)

$embPyExe = Join-Path $targetDir "tools\python\python.exe"
$hasReadyPy = $false
if (Test-Path $embPyExe) {
    & $embPyExe -c "import PIL, numpy" 2>$null
    if ($LASTEXITCODE -eq 0) { $hasReadyPy = $true }
}
if (-not $hasReadyPy) {
    $sysPy = (Get-Command 'py', 'python' -ErrorAction SilentlyContinue | Where-Object { $_.Source -notmatch 'WindowsApps' } | Select-Object -First 1).Source
    if ($sysPy) {
        & $sysPy -c "import PIL, numpy" 2>$null
        if ($LASTEXITCODE -eq 0) { $hasReadyPy = $true }
    }
}

if ($hasFfmpeg -and $hasReadyPy) {
    Write-Host "  [OK] Da co san FFmpeg & Python + Pillow/NumPy." -ForegroundColor Green
} else {
    $bgDepsScript = Join-Path $targetDir "scripts\setup\install-deps-bg.ps1"
    if (Test-Path $bgDepsScript) {
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$bgDepsScript`" -TargetDir `"$targetDir`"" -WindowStyle Hidden
        Write-Host "  [OK] Dang tai bo tro (FFmpeg/Python) o che do nen, khong can doi." -ForegroundColor Green
    }
}

Write-Host "[3/3] Dang ky tu dong chay ngam cung Windows..." -ForegroundColor Yellow
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
