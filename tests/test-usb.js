var usb = require('usb');

//console.log(usb.getDeviceList());

var VID = 5446;
var PID = 423;

console.log('Looking for GPS devices', VID, ':', PID);

var gps = usb.findByIds(VID,PID);

if(gps){
  console.log(gps);
  console.log('Found GPS device on port', gps.portNumbers);
}
else{
  console.log(gps);
}
