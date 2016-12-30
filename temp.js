var bmp085 = require('bmp085'),
    barometer = new bmp085();

var temp = 20.0;

var jsonfile = require('jsonfile');
const file = "data/temp.json";
jsonfile.readFile(file, function(err, obj) {
  if(!err){
    temp = obj.temp;
  }
});
exports.temp = temp;

barometer.read(function (data) {
    console.log("Temperature:", data.temperature);
});

var TEMPminutes = 0.1;
setInterval(function() {
  barometer.read(function (data) {
    console.log("Temperature:", data.temperature);
    temp = data.temperature;
    exports.temp = temp;
    var json = {temp: temp};
    jsonfile.writeFile(file,json,function(err){
      if(err)
        console.error(err);
    });
  });
}, TEMPminutes * 60 * 1000);
