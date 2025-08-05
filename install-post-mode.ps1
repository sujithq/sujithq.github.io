# Copy Post Mode to VS Code
Copy-Item ".github\chatmodes\Post.chatmode.md" "$env:APPDATA\Code\User\prompts\Post.chatmode.md" -Force

Write-Host "Post Mode has been installed to VS Code!" -ForegroundColor Green
Write-Host "Restart VS Code to use the new chat mode." -ForegroundColor Yellow
