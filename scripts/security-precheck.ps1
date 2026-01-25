# VERA Security Pre-Check Script
# Run before external penetration testing to catch obvious issues

param(
    [switch]$Verbose = $false,
    [switch]$FailOnIssues = $false
)

$ErrorCount = 0
$WarningCount = 0

function Write-Section {
    param([string]$title)
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "================================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Check {
    param([string]$name)
    Write-Host "  Checking: $name" -ForegroundColor White
}

function Write-Pass {
    param([string]$message)
    Write-Host "    [PASS] $message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$message)
    Write-Host "    [FAIL] $message" -ForegroundColor Red
    $script:ErrorCount++
}

function Write-Warn {
    param([string]$message)
    Write-Host "    [WARN] $message" -ForegroundColor Yellow
    $script:WarningCount++
}

function Write-Info {
    param([string]$message)
    if ($Verbose) {
        Write-Host "    [INFO] $message" -ForegroundColor Gray
    }
}

# Header
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     VERA Security Pre-Check                                    " -ForegroundColor Cyan
Write-Host "     Run before penetration testing engagement                  " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Working Directory: $(Get-Location)"
Write-Host ""

# 1. Dependency Vulnerabilities
Write-Section -title "1. Dependency Vulnerabilities"

Write-Check -name "npm audit"
try {
    $auditResult = npm audit --json 2>$null | ConvertFrom-Json
    $vulns = $auditResult.metadata.vulnerabilities
    
    if ($vulns.critical -gt 0) {
        Write-Fail -message "Critical vulnerabilities: $($vulns.critical)"
    } elseif ($vulns.high -gt 0) {
        Write-Warn -message "High vulnerabilities: $($vulns.high)"
    } else {
        Write-Pass -message "No critical or high vulnerabilities"
    }
    
    if ($Verbose) {
        Write-Info -message "Total: $($vulns.total) (Critical: $($vulns.critical), High: $($vulns.high), Moderate: $($vulns.moderate), Low: $($vulns.low))"
    }
} catch {
    Write-Warn -message "Could not run npm audit"
}

# 2. Secrets in Codebase
Write-Section -title "2. Secrets in Codebase"

$secretPatterns = @(
    @{ Name = "Stripe Live Keys"; Pattern = "sk_live_" },
    @{ Name = "Stripe Live Publishable"; Pattern = "pk_live_" },
    @{ Name = "AWS Access Keys"; Pattern = "AKIA[0-9A-Z]{16}" },
    @{ Name = "Private Keys"; Pattern = "PRIVATE KEY" }
)

Write-Check -name "Scanning src/ for secrets..."

foreach ($p in $secretPatterns) {
    $found = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" -ErrorAction SilentlyContinue | 
        Select-String -Pattern $p.Pattern -ErrorAction SilentlyContinue
    
    if ($found) {
        Write-Fail -message "$($p.Name) found: $($found.Count) occurrence(s)"
    } else {
        Write-Pass -message "No $($p.Name) found"
    }
}

# Run no_leak_scan if it exists
if (Test-Path "scripts/no_leak_scan.mjs") {
    Write-Check -name "Running no_leak_scan.mjs..."
    try {
        $leakResult = node scripts/no_leak_scan.mjs 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Pass -message "no_leak_scan passed"
        } else {
            Write-Fail -message "no_leak_scan found issues"
        }
    } catch {
        Write-Warn -message "Could not run no_leak_scan"
    }
}

# 3. Debug Endpoints
Write-Section -title "3. Debug Endpoints"

Write-Check -name "Scanning for debug endpoints..."
$debugPatterns = @("debug", "test-only", "dev-only", "__test__", "internal-only")

foreach ($pattern in $debugPatterns) {
    $found = Get-ChildItem -Path "src/app/api" -Recurse -Include "*.ts" -ErrorAction SilentlyContinue |
        Select-String -Pattern $pattern -ErrorAction SilentlyContinue
    
    if ($found) {
        Write-Warn -message "$pattern found in API routes: $($found.Count) occurrence(s)"
    } else {
        Write-Pass -message "No $pattern patterns in API routes"
    }
}

# 4. Console.log Statements
Write-Section -title "4. Console.log Statements"

Write-Check -name "Counting console.log statements..."
$consoleLogs = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" -ErrorAction SilentlyContinue |
    Select-String -Pattern "console\.log" -ErrorAction SilentlyContinue

$count = 0
if ($consoleLogs) {
    $count = ($consoleLogs | Measure-Object).Count
}

if ($count -gt 50) {
    Write-Warn -message "$count console.log statements found (review for sensitive data)"
} elseif ($count -gt 0) {
    Write-Pass -message "$count console.log statements (review for sensitive data)"
} else {
    Write-Pass -message "No console.log statements found"
}

# 5. Security TODOs
Write-Section -title "5. Security TODOs and FIXMEs"

Write-Check -name "Scanning for security-related TODOs..."
$todoMatches = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" -ErrorAction SilentlyContinue |
    Select-String -Pattern "TODO.*security|FIXME.*security" -ErrorAction SilentlyContinue

if ($todoMatches) {
    Write-Warn -message "$($todoMatches.Count) security-related TODOs/FIXMEs found"
} else {
    Write-Pass -message "No security-related TODOs found"
}

# 6. HTTP References
Write-Section -title "6. HTTP (non-HTTPS) References"

Write-Check -name "Scanning for HTTP references..."
$httpMatches = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" -ErrorAction SilentlyContinue |
    Select-String -Pattern "http://" -ErrorAction SilentlyContinue |
    Where-Object { $_.Line -notmatch "localhost|127\.0\.0\.1" }

if ($httpMatches) {
    Write-Fail -message "$($httpMatches.Count) HTTP (non-HTTPS) references found"
} else {
    Write-Pass -message "No HTTP references found (only HTTPS)"
}

# 7. Environment Variables
Write-Section -title "7. Environment Variable Checks"

Write-Check -name "Checking .env files..."
$envFiles = Get-ChildItem -Path "." -Filter ".env*" -ErrorAction SilentlyContinue | 
    Where-Object { $_.Name -ne ".env.example" -and $_.Name -ne ".env.local.example" }

if ($envFiles) {
    Write-Warn -message "$($envFiles.Count) .env file(s) found - ensure not committed"
} else {
    Write-Pass -message "No .env files in working directory"
}

# Check .gitignore
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Pass -message ".env files are in .gitignore"
    } else {
        Write-Fail -message ".env files not in .gitignore!"
    }
} else {
    Write-Warn -message "No .gitignore file found"
}

# 8. Security Headers
Write-Section -title "8. Security Headers Configuration"

Write-Check -name "Checking next.config.ts for security headers..."
if (Test-Path "next.config.ts") {
    $nextConfig = Get-Content "next.config.ts" -Raw
    
    $headers = @(
        "Content-Security-Policy",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Strict-Transport-Security"
    )
    
    foreach ($header in $headers) {
        if ($nextConfig -match $header) {
            Write-Pass -message "$header configured"
        } else {
            Write-Warn -message "$header not found in next.config.ts"
        }
    }
} else {
    Write-Warn -message "next.config.ts not found"
}

# 9. TypeScript Configuration
Write-Section -title "9. TypeScript Configuration"

Write-Check -name "Checking tsconfig.json..."
if (Test-Path "tsconfig.json") {
    $tsconfig = Get-Content "tsconfig.json" -Raw | ConvertFrom-Json
    
    if ($tsconfig.compilerOptions.strict -eq $true) {
        Write-Pass -message "Strict mode enabled"
    } else {
        Write-Warn -message "Strict mode not enabled"
    }
} else {
    Write-Warn -message "tsconfig.json not found"
}

# 10. Test Suite
Write-Section -title "10. Test Suite Status"

Write-Check -name "Running test suite..."
try {
    npm test 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Pass -message "All tests passing"
    } else {
        Write-Fail -message "Tests failing - fix before pentest"
    }
} catch {
    Write-Warn -message "Could not run tests"
}

# Summary
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "  All checks passed!" -ForegroundColor Green
} else {
    if ($ErrorCount -gt 0) {
        Write-Host "  Errors: $ErrorCount" -ForegroundColor Red
    }
    if ($WarningCount -gt 0) {
        Write-Host "  Warnings: $WarningCount" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host -NoNewline "  Recommendation: "

if ($ErrorCount -gt 0) {
    Write-Host "Fix all errors before external pentest" -ForegroundColor Red
} elseif ($WarningCount -gt 5) {
    Write-Host "Review warnings before external pentest" -ForegroundColor Yellow
} else {
    Write-Host "Ready for external penetration testing" -ForegroundColor Green
}

Write-Host ""

if ($FailOnIssues -and ($ErrorCount -gt 0 -or $WarningCount -gt 0)) {
    exit 1
}

exit 0
