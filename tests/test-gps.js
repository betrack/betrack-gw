var serialgps = require('serialgps');
var jsonfile = require('jsonfile');
 
var file = 'location.json';
 
//create a new instance. arguments are serial port and baud rate
var gps = new serialgps('/dev/ttyACM0',9600);
 
//monitor for data
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
