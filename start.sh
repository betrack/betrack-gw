#!/bin/bash
#Set the root password as root if not set as an ENV variable
export SSH_PASSWD=${SSH_PASSWD:=root}
echo "Spawn dropbear"
echo "root:$SSH_PASSWD" | chpasswd
dropbear -E -F &

echo "Turning on USB dev on RPI3"
udevd &
udevadm trigger

echo "Turning on I2C on RPI3"
modprobe i2c-dev

echo "Turning on bluetooth on RPI3"
if ! /usr/bin/hciattach /dev/ttyAMA0 bcm43xx 921600 noflow -; then
    echo "First try failed. Let's try another time."
    /usr/bin/hciattach /dev/ttyAMA0 bcm43xx 921600 noflow -
fi
hciconfig hci0 up

echo "Creating f gw and tag folders in data"
mkdir -p /data/gw
mkdir -p /data/tag

echo "Resin-wifi-connect"
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket
# Look for the network for a while
GOTNET=0
for ((i=0; i<60; i++))
do
    if curl --output /dev/null --silent --head --fail http://www.google.com; then
        GOTNET=1
        break
    fi
    sleep 1
done

# If no network, start resin-wifi-connect
if [ "$GOTNET" -eq 0 ]; then
    node resin-wifi-connect/app.js --clear=true
fi

# At this point the WiFi connection has been configured and the device has
# internet - unless the configured WiFi connection is no longer available.

echo "Running main app"
node index.js

# Don't exit the process
while true; do
    sleep 1
done