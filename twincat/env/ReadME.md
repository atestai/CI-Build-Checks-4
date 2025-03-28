# TwinCAT env setups

This repository contains automation scripts for setup of VirtualBox VMs

### Prerequisites
________________

`VirtualBox` which can be downloaded from https://www.virtualbox.org/wiki/Downloads

Please follow the information on the download page to select the proper version for your host OS.

`TwinCAT BSD ISO` which can be downloaded from https://www.beckhoff.com/en-en/support/download-finder/search-result/?download_group=586494792&download_item=586494816

#### Optional :
`Windows 10 ISO` which can be downloaded from Microsoft by using their MediaCreationTool https://www.microsoft.com/en-us/software-download/windows10

Please read and follow the instruction on Microsoft website.

This one is only needed if you wish to create a VM for the development.

### Preparation
_______________

After downloading the ISO you can also download the scripts from this repository.

Please put the scripts and ISOs in the same folder.

This folder will also be the default destination for your VM location.

### Usage
_______________

`TwinCAT BSD VM creator.bat` will automatically create a VM with TwinCAT BSD mounted and ready to install.

You can adjust the name of the VM as well as the exact TwinCAT 3 BSD build (ISO name) you're using by editing the parameters at the beginning of the script

```
SET current_directory=%~dp0
SET sourcefilename="TCBSD-x64-14-184712.iso"
SET vmname="TwinCAT3-BSD-target"
```

`TwinCAT Win10 VM creator.bat` will automatically create a VM with Windows 10 mounted and ready to install.

You can adjust the name of the VM as well as the exact Windows 10 build (ISO name) you're using by editing the parameters at the beginning of the script

```
SET current_directory=%~dp0
SET sourcefilename="Win10_22H2_x64_en-us.iso"
SET vmname="TwinCAT3-Win10-dev"
```

After creation of the VM the ISO will be mounted and started. You need to progress with the installation of the OS manually at this point.