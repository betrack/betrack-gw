var usb = require('usb');
var serialgps = require('serialgps');

var jsonfile = require('jsonfile');
const file = "location.json";
module.exports = {
    file: file
};

//U-Blox7 Device Specifics
var VID = 5446;
var PID = 423;
var gps = usb.findByIds(VID,PID);
if(gps){
  console.log('Found GPS device', gps.portNumbers);
  var gps = new serialgps('/dev/ttyACM0',9600);
  //TO-DO: Parse serial port error
  //Monitor for GPS data
  gps.on('fix', function(data) {
    var latRAW = data.lat.split('.');
    var lonRAW = data.lon.split('.');

    if(latRAW.length>0 && lonRAW.length>0){
      var latDec = parseFloat(latRAW[0].slice(-2) + '.' + latRAW[1])/60;
      var lat = parseInt(latRAW[0].slice(0,-2)) + latDec;
      if(data.latPole === 'S')
        lat *= -1;

      var lonDec = parseFloat(lonRAW[0].slice(-2) + '.' + lonRAW[1])/60;
            var lon = parseInt(lonRAW[0].slice(0,-2)) + lonDec;
      if(data.lonPole === 'W')
        lon *= -1;
      console.log(lat,lon);
      
      var json = {lat: lat, lon: lon};
      jsonfile.writeFile(file,json,function(err){
        if(err)
          console.error(err);
      });
    }
    else{
      console.log(data.fixType);
    }
  });
}
else{
  console.log('Could not find GPS device');
}