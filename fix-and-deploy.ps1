# ============================================================
#  KOKODA — conflict-proof deploy of the profile + comment fixes
#  Run in PowerShell:  powershell -ExecutionPolicy Bypass -File .\fix-and-deploy.ps1
#  Safe to re-run. It rebases your 5 fixed files straight onto the
#  latest origin/main, so there is NO merge and NO conflict.
# ============================================================

$ErrorActionPreference = "Stop"
Set-Location "C:\Cawu 5\Web Prog\KOKODA-web"

# 0) Close anything holding the repo (VS Code git, an open `git`), then
#    remove the stale lock that is blocking every git command.
Get-Process git -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item -Force ".git\index.lock" -ErrorAction SilentlyContinue
Write-Host "[0] stale lock cleared" -ForegroundColor Green

# 1) Back up the 5 fixed files (these contain all the work).
$backup = ".\_kokoda_backup"
New-Item -ItemType Directory -Force $backup | Out-Null
Copy-Item "AZURE_DEPLOYMENT.md"                              "$backup\" -Force
Copy-Item "DEPLOY_CHECKLIST_COMMENTS.md"                     "$backup\" -Force
Copy-Item "startup.sh"                                       "$backup\" -Force
Copy-Item "app\Http\Controllers\CommentController.php"       "$backup\" -Force
Copy-Item "resources\js\Pages\Profile\MyPostTab.jsx"         "$backup\" -Force
Write-Host "[1] backed up 5 fixed files" -ForegroundColor Green

# 2) Get onto a clean, up-to-date main (no conflict possible).
git checkout -f main
git fetch origin
git reset --hard origin/main
Write-Host "[2] working tree reset to latest origin/main" -ForegroundColor Green

# 3) Re-apply the 5 fixed files on top of clean main.
Copy-Item "$backup\AZURE_DEPLOYMENT.md"          "AZURE_DEPLOYMENT.md" -Force
Copy-Item "$backup\DEPLOY_CHECKLIST_COMMENTS.md" "DEPLOY_CHECKLIST_COMMENTS.md" -Force
Copy-Item "$backup\startup.sh"                   "startup.sh" -Force
Copy-Item "$backup\CommentController.php"        "app\Http\Controllers\CommentController.php" -Force
Copy-Item "$backup\MyPostTab.jsx"               "resources\js\Pages\Profile\MyPostTab.jsx" -Force
Write-Host "[3] fixes re-applied onto main" -ForegroundColor Green

# 4) Commit & push -> triggers the Azure GitHub Actions deploy.
git add "AZURE_DEPLOYMENT.md" "DEPLOY_CHECKLIST_COMMENTS.md" "startup.sh" `
        "app\Http\Controllers\CommentController.php" `
        "resources\js\Pages\Profile\MyPostTab.jsx"
git commit -m "fix(profile+comment): clickable my-post cards, create-post popup; harden comment broadcast & Reverb for Azure"
git push origin main
Write-Host "[4] pushed to origin/main — Azure deploy will start" -ForegroundColor Green

# 5) Cleanup
Remove-Item -Recurse -Force $backup -ErrorAction SilentlyContinue
Write-Host "DONE. Watch the GitHub Actions run, then hard-refresh (Ctrl+F5)." -ForegroundColor Cyan
