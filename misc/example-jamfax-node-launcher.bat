@echo off
title Jamfax Node Server
echo Starting Jamfax sports proxy...
echo.

wsl -d YOUR_WSL_VERSION_NAME -e bash -lc "cd /home/YOUR_USERNAME/YOUR_PATH_TO_JAMFAX/Jamfax/node && source ~/.nvm/nvm.sh 2>/dev/null; exec node server.js"

echo.
echo Server stopped.
pause