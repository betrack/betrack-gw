#!/bin/bash
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

echo "Running main app"
node index.js

# Don't exit the process
while true; do
    sleep 1
done