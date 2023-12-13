@echo off
set "GitBashPath=C:\Program Files\Git\git-bash.exe"
set "Command1=openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048"
set "Command2=openssl rsa -pubout -in private_key.pem -out public_key.pem"
set "Command3=base64 -w 0 private_key.pem > private_key-base64.txt"
set "Command4=base64 -w 0 public_key.pem > public_key-base64.txt"

start "" "%GitBashPath%" -c "%Command1% && %Command2% && %Command3% && %Command4%"