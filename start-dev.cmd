@echo off
set PATH=D:\Invoice Generator\.node;%PATH%
cd /d "D:\Invoice Generator"
node node_modules\next\dist\bin\next dev -p %PORT%
