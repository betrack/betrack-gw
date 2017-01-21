var usb = require('usb');
var serialgps = require('serialgps');

var lat = process.env.BETRACK_LATITUDE;
var lon = process.env.BETRACK_LONGITUDE;
exports.lat = lat;
exports.lon = lon;

var jsonfile = require('jsonfile');
const file = "/data/location.json";
jsonfile.readFile(file, function(err, obj) {
  if(!err){
    lat = obj.lat;
    lon = obj.lon;
    exports.lat = lat;
  exports.lon = lon;
  }
});

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
    var latRaw = data.lat.split('.');
    var lonRaw = data.lon.split('.');

    if(data.fixType === 'fix' && latRaw.length>1 && lonRaw.length>1){
      var latDec = parseFloat(latRaw[0].slice(-2) + '.' + latRaw[1])/60;
      var latNew = parseInt(latRaw[0].slice(0,-2)) + latDec;
      if(data.latPole === 'S')
        latNew *= -1;

      var lonDec = parseFloat(lonRaw[0].slice(-2) + '.' + lonRaw[1])/60;
      var lonNew = parseInt(lonRaw[0].slice(0,-2)) + lonDec;
      if(data.lonPole === 'W')
        lonNew *= -1;
      if(Math.abs(lat-latNew)>0.0001 || Math.abs(lon-lonNew)>0.0001){
        lat=latNew;
        lon=lonNew;
        console.log(lat,lon);
      }
      exports.lat=latNew;
      exports.lon=lonNew;
      var json = {lat: latNew, lon: lonNew};
      jsonfile.writeFile(file,json,function(err){
        if(err)
          console.error(err);
      });
    }
    else{
      //console.log('Fix type',data.fixType);
    }
  });
}
else{
  console.log('Could not find GPS device');
}
