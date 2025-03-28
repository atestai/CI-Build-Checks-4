# TwinCAT target setup

This repository contains TwinCAT Package Manager (TcPkg) setup and configuration for Target on Windows Host

`target.config` contains the TcPkg for a target device

`setup_target.bat` is a batch file automating the installation of required packages.

Both files should be placed in the same location on the target machine to work properly.
Internet connection is required to connect with the Beckhoff repository.

## Manual adjustments

- on Windows Host the Microsoft Defender Firewall will block ADS communication by default.
Network interface should get Firewall rules need to be adjusted or Defender turned off for Private Network which can be set up as the Host-Only Adapter in the secondary network interface.