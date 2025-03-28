SET current_directory=%~dp0
SET sourcefilename="TCBSD-x64-14-184712.iso"
SET vmname="TwinCAT3-BSD-target"

CD "/Program Files/Oracle/VirtualBox

SET installer_image="TcBSD_installer.vdi"
SET runtime_image="TcBSD.vhd"
SET vmdirectory=%current_directory%%vmname:"=%
SET sink=%vmdirectory%\%installer_image:"=%
SET source=%current_directory%%sourcefilename:"=%

:recreatevm
ECHO "creating Virtual Machine TwinCAT 3 BSD"
VBoxManage createvm --name %vmname% --basefolder %current_directory% --ostype FreeBSD_64 --register
IF  ERRORLEVEL 1    (
    ECHO VM already exists, deleteing existing
    VBoxManage unregistervm %vmname% --delete 
    GOTO recreatevm
) 

VBoxManage modifyvm %vmname% --memory 1024 --vram 128 --acpi on --hpet on --graphicscontroller vmsvga --firmware efi64
:recreateIf
VBoxManage modifyvm %vmname% --nic1 hostonly --hostonlyadapter1 "VirtualBox Host-Only Ethernet Adapter"
IF ERRORLEVEL 1 (
    ECHO host interface doesnt exist, creating one
    VBoxManage hostonlyif create
    GOTO recreateIf
)

ECHO "converting img image to virtualbox bootable HDD image"
VBoxManage convertfromraw --format VDI "%source%" "%sink%" 


VBoxManage modifyvm %vmname% --nic2 nat


ECHO "Creating SATA storage Controller"
VBoxManage storagectl %vmname% --name SATA --add sata --controller IntelAhci --hostiocache on --bootable on


ECHO "attaching to installation HDD to Sata Port 1"
VBoxManage storageattach %vmname% --storagectl "SATA" --device 0 --port 1 --type  hdd --medium "%sink%"

@REM set /p hddsize="Storege size in MB:"

ECHO "creating empty HDD"
SET runtime_hdd=%vmdirectory%\%runtime_image:"=%
VBoxManage createmedium --filename "%runtime_hdd%" --size 1024 --format VHD


ECHO "attaching created HDD to Sata Port 0 where we will install TwinCAT BSD"
VBoxManage storageattach %vmname% --storagectl "SATA" --device 0 --port 0 --type  hdd --medium "%runtime_hdd%"

ECHO "starting VM"
VBoxManage startvm %vmname%

ECHO "continue installation of TC/BSD in the VirtualBox"
PAUSE