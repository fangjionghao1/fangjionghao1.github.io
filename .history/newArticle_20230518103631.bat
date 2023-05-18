@echo off
set /p folderName="input file name: "
hugo new content/post/%folderName%/index.md
echo article dir [%folderName%] created
pause