@echo off
set /p folderName="请输入心得文件夹的名称: "
hugo new content/post/%folderName%/index.md
echo 文章目录 %folderName% 已创建
pause