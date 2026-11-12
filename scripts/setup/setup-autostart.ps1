$wsh = New-Object -ComObject WScript.Shell
$vbsPath = (Join-Path $PSScriptRoot "launch-spotify.vbs")
$spotifyExe = "$env:APPDATA\Spotify\Spotify.exe"
if (-not (Test-Path $spotifyExe)) {
    $storeExe = "$env:LOCALAPPDATA\Microsoft\WindowsApps\Spotify.exe"
    if (Test-Path $storeExe) { $spotifyExe = $storeExe }
}

Write-Host "Updating Spotify shortcuts..." -ForegroundColor Cyan

$desktopLnkPath = "$env:USERPROFILE\Desktop\Spotify.lnk"
if (Test-Path $desktopLnkPath) {
    $lnk = $wsh.CreateShortcut($desktopLnkPath)
    $lnk.TargetPath = "wscript.exe"
    $lnk.Arguments = "`"$vbsPath`""
    $lnk.WorkingDirectory = $PSScriptRoot
    $lnk.IconLocation = "$spotifyExe,0"
    $lnk.Description = "Spotify with Wallpaper Sync"
    $lnk.Save()
    Write-Host "  [OK] Updated Desktop shortcut" -ForegroundColor Green
}

$startLnkPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Spotify.lnk"
if (Test-Path $startLnkPath) {
    $lnk = $wsh.CreateShortcut($startLnkPath)
    $lnk.TargetPath = "wscript.exe"
    $lnk.Arguments = "`"$vbsPath`""
    $lnk.WorkingDirectory = $PSScriptRoot
    $lnk.IconLocation = "$spotifyExe,0"
    $lnk.Description = "Spotify with Wallpaper Sync"
    $lnk.Save()
    Write-Host "  [OK] Updated Start Menu shortcut" -ForegroundColor Green
}

try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Spotify" -Value "wscript.exe `"$vbsPath`" --autostart --minimized"
    Write-Host "  [OK] Updated Windows autostart (Registry Run)" -ForegroundColor Green
} catch {
    Write-Host "  [!] Could not write to Registry Run" -ForegroundColor Yellow
}

try {
    $startupLnkPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\SpotifyWallpaperWatcher.lnk"
    $watcherDir = Join-Path (Split-Path -Parent $PSScriptRoot) "watcher"
    $watcherVbs = Join-Path $watcherDir "watch-spotify-silent.vbs"
    $lnkW = $wsh.CreateShortcut($startupLnkPath)
    $lnkW.TargetPath = "wscript.exe"
    $lnkW.Arguments = "`"$watcherVbs`""
    $lnkW.WorkingDirectory = $watcherDir
    $lnkW.Save()
    Write-Host "  [OK] Updated Startup Watcher shortcut" -ForegroundColor Green
} catch {
    Write-Host "  [!] Could not create Startup Watcher shortcut" -ForegroundColor Yellow
}

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
