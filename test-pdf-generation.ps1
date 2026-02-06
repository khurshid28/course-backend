# Test PDF Generation for Certificates and Test Results
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   PDF GENERATION TEST" -ForegroundColor Cyan  
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"

# 1. Admin Login
Write-Host "[1] Admin login..." -ForegroundColor Yellow
$loginBody = @{
    login = "root"
    password = "root123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if (-not $loginResponse -or -not $loginResponse.access_token) {
        Write-Host "[FAIL] Login response invalid" -ForegroundColor Red
        exit 1
    }
    
    $token = $loginResponse.access_token
    Write-Host "[OK] Login successful" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0,30))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Login failed: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Get all certificates
Write-Host "`n[2] Fetching all certificates..." -ForegroundColor Yellow
try {
    $certificates = Invoke-RestMethod -Uri "$baseUrl/tests/certificates/all" -Method Get -Headers $headers
    Write-Host "[OK] Found $($certificates.Count) certificates" -ForegroundColor Green
    
    if ($certificates.Count -eq 0) {
        Write-Host "`n[WARN] No certificates found in database!" -ForegroundColor Yellow
        Write-Host "   Please complete a test first to generate a certificate." -ForegroundColor Gray
        exit 0
    }
    
    # Show first certificate details
    $cert = $certificates[0]
    Write-Host "`n[Certificate Details]" -ForegroundColor Cyan
    Write-Host "   Certificate No: $($cert.certificateNo)" -ForegroundColor White
    Write-Host "   User: $($cert.testResult.user.firstName) $($cert.testResult.user.surname)" -ForegroundColor White
    Write-Host "   Course: $($cert.testResult.test.course.title)" -ForegroundColor White
    Write-Host "   Score: $($cert.testResult.score)%" -ForegroundColor White
    Write-Host "   Date: $($cert.issuedAt)" -ForegroundColor White
} catch {
    Write-Host "[FAIL] Failed to fetch certificates: $_" -ForegroundColor Red
    exit 1
}

# 3. Get all test results  
Write-Host "`n[3] Fetching all test results..." -ForegroundColor Yellow
try {
    $results = Invoke-RestMethod -Uri "$baseUrl/tests/results/all" -Method Get -Headers $headers
    Write-Host "[OK] Found $($results.Count) test results" -ForegroundColor Green
    
    if ($results.Count -gt 0) {
        $result = $results[0]
        Write-Host "`n[Test Result Details]" -ForegroundColor Cyan
        Write-Host "   User: $($result.user.firstName) $($result.user.surname)" -ForegroundColor White
        Write-Host "   Test: $($result.test.title)" -ForegroundColor White
        Write-Host "   Score: $($result.score)%" -ForegroundColor White
        Write-Host "   Correct: $($result.correctAnswers)/$($result.totalQuestions)" -ForegroundColor White
        Write-Host "   Status: $($result.status)" -ForegroundColor White
    }
} catch {
    Write-Host "[FAIL] Failed to fetch test results: $_" -ForegroundColor Red
}

# 4. Download Certificate PDF
if ($certificates.Count -gt 0) {
    Write-Host "`n[4] Downloading PDF for certificate: $($cert.certificateNo)..." -ForegroundColor Yellow
    
    $pdfPath = Join-Path $PSScriptRoot "test-certificate-$($cert.certificateNo).pdf"
    $downloadUrl = "$baseUrl/tests/certificates/download/$($cert.certificateNo)"
    
    try {
        # Download PDF file
        Invoke-WebRequest -Uri $downloadUrl -Method Get -Headers $headers -OutFile $pdfPath
        
        if (Test-Path $pdfPath) {
            $fileSize = (Get-Item $pdfPath).Length
            Write-Host "[OK] PDF downloaded successfully!" -ForegroundColor Green
            Write-Host "   File: $pdfPath" -ForegroundColor White
            Write-Host "   Size: $([math]::Round($fileSize/1KB, 2)) KB" -ForegroundColor White
            
            # Open PDF in default viewer
            Write-Host "`n[Opening PDF...]" -ForegroundColor Yellow
            Start-Process $pdfPath
        } else {
            Write-Host "[FAIL] PDF file not created" -ForegroundColor Red
        }
    } catch {
        Write-Host "[FAIL] PDF download failed: $_" -ForegroundColor Red
        Write-Host "   URL: $downloadUrl" -ForegroundColor Gray
    }
}

# 5. Verify Certificate (Public endpoint - no auth needed)
if ($certificates.Count -gt 0) {
    Write-Host "`n[5] Verifying certificate (public endpoint)..." -ForegroundColor Yellow
    try {
        $verifyUrl = "$baseUrl/tests/certificates/verify/$($cert.certificateNo)"
        $verified = Invoke-RestMethod -Uri $verifyUrl -Method Get
        
        Write-Host "[OK] Certificate verified successfully!" -ForegroundColor Green
        Write-Host "   Valid: $($verified.valid)" -ForegroundColor White
        Write-Host "   Holder: $($verified.userName)" -ForegroundColor White
        Write-Host "   Course: $($verified.courseName)" -ForegroundColor White
    } catch {
        Write-Host "[FAIL] Certificate verification failed: $_" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
