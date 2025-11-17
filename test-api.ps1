$body = @{
    title = "Test Document"
    content = "This is a test document content."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/documents" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host $response
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
}
