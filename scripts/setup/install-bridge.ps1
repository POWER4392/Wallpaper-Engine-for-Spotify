$ErrorActionPreference = "SilentlyContinue"
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { $null = $_ }

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Spotify <-> Wallpaper Engine Sync - Setup Chay Ngam" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$targetDir = "$env:LOCALAPPDATA\SpotifyWallpaperEngine"

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { $PWD.Path }
$localRepoRoot = Split-Path -Parent (Split-Path -Parent $scriptRoot)

if (Test-Path (Join-Path $localRepoRoot "scripts\sync\sync-wallpaper.ps1")) {
    Write-Host "[1/2] Phat hien thu muc du an goc, su dung truc tiep..." -ForegroundColor Green
    $targetDir = $localRepoRoot
} elseif (Test-Path "e:\Mod\spotify-wallpaper\scripts\sync\sync-wallpaper.ps1") {
    Write-Host "[1/2] Phat hien thu muc du an goc (e:\Mod\spotify-wallpaper), su dung truc tiep..." -ForegroundColor Green
    $targetDir = "e:\Mod\spotify-wallpaper"
} else {
    Write-Host "[1/2] Dang tai bo ket noi tu GitHub ve may..." -ForegroundColor Yellow
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $zipUrl = "https://github.com/POWER4392/Spotify---Wallpaper-Engine/archive/refs/heads/main.zip"
    $zipPath = "$env:TEMP\spotify-we-main.zip"
    $extractTemp = "$env:TEMP\spotify-we-extract"

    try {
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
        if (Test-Path $extractTemp) { Remove-Item -Path $extractTemp -Recurse -Force }
        Expand-Archive -Path $zipPath -DestinationPath $extractTemp -Force
        $sourceDir = Join-Path $extractTemp "Spotify---Wallpaper-Engine-main"

        Copy-Item -Path (Join-Path $sourceDir "scripts") -Destination $targetDir -Recurse -Force
        Copy-Item -Path (Join-Path $sourceDir "tools") -Destination $targetDir -Recurse -Force

        Remove-Item -Path $zipPath -Force
        Remove-Item -Path $extractTemp -Recurse -Force
        Write-Host "  [OK] Da cai dat thanh cong vao: $targetDir" -ForegroundColor Green
    } catch {
        Write-Host "  [!] Loi tai online: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "[2/2] Dang ky tu dong chay ngam cung Windows..." -ForegroundColor Yellow
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
    Write-Host "  [OK] Da tao shortcut trong Startup Windows" -ForegroundColor Green
} catch {
    Write-Host "  [!] Loi tao shortcut: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Dang khoi dong Bridge ket noi..." -ForegroundColor Cyan
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
