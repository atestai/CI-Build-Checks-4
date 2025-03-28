@echo off

echo %cd%

set /p USER=please enter a registered Beckhoff account e-mail: 

:start

if not %USER% == "" goto source

:source

TcPkg source add -n "Beckhoff Stable Feed" -s "https://public.tcpkg.beckhoff-cloud.com/api/v1/feeds/Stable" -u %USER%
goto list

:list
TcPkg list
pause
goto import

:import
TcPkg import -i %cd%"\target.config" -y
echo you can close this window now
pause

:end