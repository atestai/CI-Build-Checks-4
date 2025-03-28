
echo "permit nopass Administrator as root" | doas tee -a /usr/local/etc/doas.conf

doas pkg install -y bash git htop nano 


doas cp bsd-config/FreeBSD.conf /usr/local/etc/pkg/repos/FreeBSD.conf


echo "Enabling FreeBSD repository..."
if [ -f /usr/local/etc/pkg/repos/FreeBSD.conf ]; then
    doas sed -i '' 's/enabled: no/enabled: yes/' /usr/local/etc/pkg/repos/FreeBSD.conf
    echo "FreeBSD repository enabled!"
else
    echo "The configuration file /usr/local/etc/pkg/repos/FreeBSD.conf does not exist!"
    exit 1
fi


doas pkg update -f && doas pkg upgrade -y

echo "Rebooting the system..."
reboot
