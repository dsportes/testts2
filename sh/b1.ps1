Copy-Item -Force -Verbose -Path sh/custom-1.json -Destination src/assets/custom.json
npm run build
Copy-Item -Force -Verbose -Path sh/custom-d.json -Destination src/assets/custom.json

Write-Output "OK"
