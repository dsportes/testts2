Set-Location -Path ./dist
npx http-server . -p 8087 --cors -c-1 -S -C "../../asocial2-srv/cert/fullchain.pem" -K "../../asocial2-srv/cert/privkey.pem" -a test.sportes.fr
Set-Location -Path ../