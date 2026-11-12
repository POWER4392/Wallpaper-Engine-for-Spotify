$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$syncDir = Join-Path (Split-Path -Parent $scriptDir) "sync"
$silentVbsPath = Join-Path $syncDir "start-sync-silent.vbs"
$psScriptPath = Join-Path $syncDir "sync-wallpaper.ps1"
$logPath = Join-Path $scriptDir "watcher.log"

function Write-WatcherLog([string]$msg) {
    try {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        "$timestamp - $msg" | Out-File -FilePath $logPath -Append -Encoding utf8
    } catch { $null = $_ }
}

function Test-Bridge {
    try {
        $req = [System.Net.WebRequest]::Create("http://127.0.0.1:43196/status")
        $req.Timeout = 2500
        $req.Method = "GET"
        $resp = $req.GetResponse()
        $resp.Close()
        return $true
    } catch {
        return $false
    }
}

Write-WatcherLog "Watcher started."

while ($true) {
    $spotify = Get-Process -Name "Spotify" -ErrorAction SilentlyContinue
    if ($spotify) {
        if (-not (Test-Bridge)) {
            Start-Sleep -Milliseconds 1500
            if (-not (Test-Bridge)) {
                Write-WatcherLog "Detected Spotify running, starting background bridge..."
                if (Test-Path $silentVbsPath) {
                    Start-Process -FilePath "wscript.exe" -ArgumentList "`"$silentVbsPath`"" -WindowStyle Hidden
                } else {
                    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$psScriptPath`"" -WindowStyle Hidden
                }
                Start-Sleep -Seconds 5
            }
        }
    }
    Start-Sleep -Seconds 3
}
