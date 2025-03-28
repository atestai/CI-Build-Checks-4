# TwinCAT env setups

To install the virtual machine, simply follow the steps that are outlined within the PPC/Twincat/env readMe

Once the installation is finished, it will be necessary to remove TcBSD_installer.vdi from the created virtual machine, and replace network interface 1 from host-only to bridge. 


Finally, you need to transfer the bsd-config folder inside the virtual machine using SSH and execute the following commands :

1- chmod +x bsd-config/datalogger-install-one.ssh
2- ./bsd-config/datalogger-install-one.ssh

After the machine restarts run these commands :

1- chmod +x bsd-config/datalogger-install-two.ssh
2- bash ./datalogger-install-two.ssh


