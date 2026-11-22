param([string]$TargetDir)

$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"
if (-not $TargetDir) { $TargetDir = "$env:LOCALAPPDATA\SpotifyWallpaperEngine" }
Add-Type -AssemblyName System.IO.Compression.FileSystem

$lockFile = Join-Path $TargetDir ".deps-installing.lock"
if (Test-Path $lockFile) {
    $age = (Get-Date) - (Get-Item $lockFile).LastWriteTime
    if ($age.TotalMinutes -lt 10) { exit 0 }
}
Set-Content -Path $lockFile -Value "$PID" -Encoding ASCII

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

try {
    $embPyDir = Join-Path $TargetDir "tools\python"
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
                & $sysPy -m pip install --quiet --no-warn-script-location --no-cache-dir --only-binary=:all: --disable-pip-version-check pillow numpy 2>$null
                & $sysPy -c "import PIL, numpy" 2>$null
                if ($LASTEXITCODE -eq 0) { $hasReadyPy = $true }
            }
        }
    }
    if (-not $hasReadyPy) {
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
        } finally {
            if (Test-Path $pyZip) { Remove-Item -Path $pyZip -Force -ErrorAction SilentlyContinue }
            if (Test-Path $getPip) { Remove-Item -Path $getPip -Force -ErrorAction SilentlyContinue }
        }
    }

    $ffmpegExe = Join-Path $TargetDir "tools\ffmpeg\ffmpeg.exe"
    $sysFfmpeg = Get-Command "ffmpeg" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not (Test-Path $ffmpegExe) -and -not ($sysFfmpeg -and $sysFfmpeg.Source)) {
        $ffZip = "$env:TEMP\ffmpeg-win64.zip"
        try {
            Download-Fast "https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-win-64.zip" $ffZip
            if (-not (Test-Path $ffZip) -or (Get-Item $ffZip).Length -lt 1000000) {
                Download-Fast "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip" $ffZip
            }
            $zipArch = [System.IO.Compression.ZipFile]::OpenRead($ffZip)
            try {
                $ffEntry = $zipArch.Entries | Where-Object { $_.Name -eq "ffmpeg.exe" } | Select-Object -First 1
                if ($ffEntry) {
                    $ffDir = Split-Path -Parent $ffmpegExe
                    if (-not (Test-Path $ffDir)) { New-Item -ItemType Directory -Path $ffDir -Force | Out-Null }
                    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($ffEntry, $ffmpegExe, $true)
                }
            } finally {
                $zipArch.Dispose()
            }
        } finally {
            if (Test-Path $ffZip) { Remove-Item -Path $ffZip -Force -ErrorAction SilentlyContinue }
        }
    }
} finally {
    Remove-Item -Path $lockFile -Force -ErrorAction SilentlyContinue
}
