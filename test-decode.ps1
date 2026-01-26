# Test decode-message API endpoint
$headers = @{"Content-Type"="application/json"}
$body = @{
    systemPrompt = "Test"
    userInput = "Hey, I hope you are doing well. Can we grab coffee tomorrow?"
    mode = "single"
    provider = "claude"
    taskType = "decode-message"
    activityId = "decode-message"
} | ConvertTo-Json

Write-Host "Testing /api/ops/generate endpoint..."
Write-Host "Request body: $body"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/ops/generate" -Method POST -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 180
    Write-Host "SUCCESS!"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "FAILED!"
    Write-Host "Exception: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error response: $errorBody"
    }
}
