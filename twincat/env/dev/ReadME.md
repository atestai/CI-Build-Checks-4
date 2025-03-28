# TwinCAT dev setup

This repository contains TwinCAT Package Manager (TcPkg) setup and configuration for Development on Windows Host

`dev.config` contains the TcPkg for a development machine

`setup_dev.bat` is a batch file automating the installation of required packages.

Both files should be placed in the same location on the development machine to work properly.
Internet connection is required to connect with the Beckhoff repository.

## Manual adjustments

- on Windows Host the Microsoft Defender Firewall will block ADS communication by default.
Network interface should get Firewall rules need to be adjusted or Defender turned off for Private Network which can be set up as the Host-Only Adapter in the secondary network interface.