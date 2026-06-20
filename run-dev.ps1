Write-Host "Starting X Platform..." -ForegroundColor Cyan

# --- Paths ---
$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"
$frontendUrl = "http://localhost:5173"

# --- Chrome paths ---
$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

# --- Start Backend ---
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
cd '$backendPath';
.\venv\Scripts\Activate.ps1;
python manage.py runserver
"

# --- Start Frontend ---
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
cd '$frontendPath';
npm run dev
"

# --- Wait until frontend is actually ready ---
Write-Host "Waiting for frontend server..." -ForegroundColor Yellow

$maxAttempts = 30
$attempt = 0
$isReady = $false

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 2

        if ($response.StatusCode -eq 200) {
            $isReady = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 1
        $attempt++
    }
}

# --- Open Chrome when ready ---
if ($isReady) {
    Write-Host "Frontend is ready. Opening Chrome..." -ForegroundColor Green

    $chromePath = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

    if ($chromePath) {
        Start-Process $chromePath $frontendUrl
    } else {
        Write-Host "Chrome not found. Opening default browser..." -ForegroundColor Red
        Start-Process $frontendUrl
    }
} else {
    Write-Host "Frontend did not become ready. Check the frontend terminal." -ForegroundColor Red
}

Write-Host "X Platform startup script finished." -ForegroundColor Cyan