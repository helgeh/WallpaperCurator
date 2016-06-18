@echo off

set sdkpath=%1
set currentDir=%~dp0
set sdkDir=%currentDir%%sdkpath%
set nwjs=nw.exe
set appDir=%currentDir%app\

call "%sdkDir%%nwjs%" --enable-logging %appDir%
