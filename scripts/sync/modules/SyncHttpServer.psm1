function Start-SyncHttpServer {
    param(
        [int]$Port = 43196,
        [string]$ProjectRoot = ""
    )

    if (-not $ProjectRoot) {
        $ProjectRoot = (Get-Item "$PSScriptRoot\..\..").FullName
    }

    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://127.0.0.1:${Port}/")

    try {
        $listener.Start()
        Write-Host "==========================================================" -ForegroundColor Green
        Write-Host " [Wallpaper Engine -> Spotify Sync] Running on port $Port" -ForegroundColor Cyan
        Write-Host " Features: Video (.mp4 / .webm + Range 206) / Image / Scene (.pkg)" -ForegroundColor Yellow
        Write-Host " Press Ctrl+C to stop." -ForegroundColor Gray
        Write-Host "==========================================================" -ForegroundColor Green
    } catch {
        Write-Error "Could not start port ${Port}: $($_.Exception.Message)"
        return
    }

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $req = $context.Request
            $res = $context.Response

            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD")
            $res.Headers.Add("Access-Control-Allow-Headers", "*")

            if ($req.HttpMethod -eq "OPTIONS") {
                $res.StatusCode = 200
                $res.Close()
                continue
            }

            $path = $req.Url.AbsolutePath

            if ($path -eq "/status" -or $path -eq "/health" -or $path -eq "/ping") {
                $msg = [System.Text.Encoding]::UTF8.GetBytes("OK")
                $res.ContentType = "text/plain"
                $res.StatusCode = 200
                $res.ContentLength64 = $msg.Length
                $res.OutputStream.Write($msg, 0, $msg.Length)
                $res.Close()
                continue
            }

            $info = Get-CurrentWallpaperInfo -projectRoot $ProjectRoot

            if ($path -eq "/api/current") {
                if ($info) {
                    $ver = if ($info.Version) { $info.Version } else { 0 }
                    $data = @{
                        status    = "ok"
                        id        = $info.Id
                        title     = $info.Title
                        fileName  = $info.FileName
                        version   = $ver
                        mediaType = $info.MediaType
                        mediaUrl  = "http://127.0.0.1:${Port}/media?file=" + [System.Uri]::EscapeDataString($info.FileName) + "&v=" + $ver
                    }
                    $jsonStr = $data | ConvertTo-Json
                    $buf = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $res.ContentType = "application/json; charset=utf-8"
                    $res.ContentLength64 = $buf.Length
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                } else {
                    $data = @{ status = "no_wallpaper" }
                    $buf  = [System.Text.Encoding]::UTF8.GetBytes(($data | ConvertTo-Json))
                    $res.ContentType = "application/json; charset=utf-8"
                    $res.ContentLength64 = $buf.Length
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                }
                $res.Close()
            }
            elseif ($path -eq "/media") {
                if ($info -and [System.IO.File]::Exists($info.Path)) {
                    $filePath = $info.Path
                    $fileItem = [System.IO.FileInfo]$filePath
                    $fileLen  = $fileItem.Length
                    $range    = $req.Headers["Range"]

                    $res.ContentType = $info.MediaType
                    $res.Headers.Add("Accept-Ranges", "bytes")

                    if ($range -and ($range -match "bytes=(\d*)-(\d*)")) {
                        $startStr = $matches[1]
                        $endStr   = $matches[2]

                        $start = if ($startStr -ne "") { [int64]$startStr } else { 0 }
                        $end   = if ($endStr -ne "")   { [int64]$endStr }   else { $fileLen - 1 }
                        if ($end -ge $fileLen) { $end = $fileLen - 1 }
                        $count = $end - $start + 1

                        $res.StatusCode = 206
                        $res.Headers.Add("Content-Range", "bytes $start-$end/$fileLen")
                        $res.ContentLength64 = $count

                        $fs = [System.IO.File]::OpenRead($filePath)
                        try {
                            $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                            $buf = New-Object byte[] 65536
                            $remain = $count
                            while ($remain -gt 0) {
                                $toRead = [int][Math]::Min($remain, 65536)
                                $read = $fs.Read($buf, 0, $toRead)
                                if ($read -le 0) { break }
                                $res.OutputStream.Write($buf, 0, $read)
                                $remain -= $read
                            }
                        } finally {
                            $fs.Close()
                        }
                    } else {
                        $res.StatusCode = 200
                        $res.ContentLength64 = $fileLen
                        $bytes = [System.IO.File]::ReadAllBytes($filePath)
                        $res.OutputStream.Write($bytes, 0, $bytes.Length)
                    }
                } else {
                    $res.StatusCode = 404
                }
                try { $res.Close() } catch {}
            }
            else {
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Wallpaper Engine Spotify Sync Bridge OK")
                $res.ContentType = "text/plain"
                $res.OutputStream.Write($msg, 0, $msg.Length)
                $res.Close()
            }
        } catch {
            Start-Sleep -Milliseconds 20
        }
    }
}

Export-ModuleMember -Function Start-SyncHttpServer
