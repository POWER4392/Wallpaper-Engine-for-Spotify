$wsh = New-Object -ComObject WScript.Shell
$spotifyExe = "$env:APPDATA\Spotify\Spotify.exe"
if (-not (Test-Path $spotifyExe)) {
    $storeExe = "$env:LOCALAPPDATA\Microsoft\WindowsApps\Spotify.exe"
    if (Test-Path $storeExe) { $spotifyExe = $storeExe }
}

$desktopLnkPath = "$env:USERPROFILE\Desktop\Spotify.lnk"
if (Test-Path $desktopLnkPath) {
    $lnk = $wsh.CreateShortcut($desktopLnkPath)
    $lnk.TargetPath = $spotifyExe
    $lnk.Arguments = ""
    $lnk.WorkingDirectory = "$env:APPDATA\Spotify"
    $lnk.IconLocation = "$spotifyExe,0"
    $lnk.Description = ""
    $lnk.Save()
    Write-Host "  [OK] Restored Desktop shortcut" -ForegroundColor Green
}

$startLnkPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Spotify.lnk"
if (Test-Path $startLnkPath) {
    $lnk = $wsh.CreateShortcut($startLnkPath)
    $lnk.TargetPath = $spotifyExe
    $lnk.Arguments = ""
    $lnk.WorkingDirectory = "$env:APPDATA\Spotify"
    $lnk.IconLocation = "$spotifyExe,0"
    $lnk.Description = ""
    $lnk.Save()
    Write-Host "  [OK] Restored Start Menu shortcut" -ForegroundColor Green
}

try {
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Spotify" -Value "`"$spotifyExe`" --autostart --minimized"
    Write-Host "  [OK] Restored Registry Run" -ForegroundColor Green
} catch { $null = $_ }

Write-Host "`nRestored Spotify shortcuts to default." -ForegroundColor Green
