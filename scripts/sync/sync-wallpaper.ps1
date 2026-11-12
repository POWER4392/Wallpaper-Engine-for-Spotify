try { $Host.UI.RawUI.WindowTitle = "Wallpaper Engine - Spotify Sync Bridge" } catch { $null = $_ }

$currentPid = $PID
$myParent = (Get-CimInstance Win32_Process -Filter "ProcessId = $currentPid" -ErrorAction SilentlyContinue).ParentProcessId
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.ProcessId -ne $currentPid -and $_.ProcessId -ne $myParent -and $_.Name -match "powershell" -and $_.CommandLine -match "-File\s+.*sync-wallpaper\.ps1"
} | ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch { $null = $_ }
}

$projectRoot = (Get-Item "$PSScriptRoot\..\..").FullName
if (-not $projectRoot) { $projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent }

$modulesDir = Join-Path $PSScriptRoot "modules"

Import-Module (Join-Path $modulesDir "WallpaperExtractors.psm1") -Force
Import-Module (Join-Path $modulesDir "WallpaperConfig.psm1") -Force
Import-Module (Join-Path $modulesDir "SyncHttpServer.psm1") -Force

Start-SyncHttpServer -Port 43196 -ProjectRoot $projectRoot
