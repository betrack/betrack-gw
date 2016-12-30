#!/bin/bash
udevd &
udevadm trigger
modprobe i2c-dev
node index.js