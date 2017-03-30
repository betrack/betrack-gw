var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.229.97');

var jsonfile = require('jsonfile');
var chokidar = require('chokidar');
var del = require('node-delete');

var bt = require('./bt.js');
var location = require('./location');
var temperature = require('./temp');

var GWminutes = 10;
setInterval(function() {
  console.log('Gateway status every ' + GWminutes + ' minutes.');
  var time = new Date();
  var timestamp = time.toISOString();
  time.setHours(time.getHours()-3);
  var json = {time: time.toISOString(), temp: temperature.temp, lat: location.lat, lon: location.lon};
  jsonfile.writeFile('/data/gw/'+ timestamp.replace(/[^a-z0-9]/gi, '_') + '.json',json,function(err){
    if(err)
      console.error(err);
  });
}, GWminutes * 60 * 1000);

var publishDelay = 0;
setInterval(function(){
  if(publishDelay>0){
    publishDelay-=10;
    if(publishDelay<0)
      publishDelay=0;
  }
},10*1000);

client.on('connect', function() {
  console.log("MQTT connected");

  chokidar.watch('data/gw',{
    persistent: true,
    ignored: /[\/\\]\./,
    ignoreInitial: false,
    awaitWriteFinish: true
  }).on('add', function(event, path) {
    console.log(event);
    jsonfile.readFile(event, function(err, obj) {
      if(err)
        console.log(err);
      else{
        var state = obj.time+","+obj.temp.toFixed(1)+","+obj.lat.toFixed(7)+","+obj.lon.toFixed(7);
        setTimeout(function(){
          client.publish("gw/"+bt.address, state);
          console.log(bt.address, state);
          del(event, {force:true}, function (err, files) {
            //console.log('Deleted file', files);
          });
        },(publishDelay++)*1000);
      }
    });
  });

  chokidar.watch('/data/tag',{
    persistent: true,
    ignored: /[\/\\]\./,
    ignoreInitial: false,
    awaitWriteFinish: true
  }).on('add', function(event, path) {
    console.log(event);
    jsonfile.readFile(event, function(err, obj) {
      if(err)
        console.log(err);
      else{
        var state = obj.time+","+obj.temp.toFixed(1)+","+obj.batt.toFixed(1)+","+obj.packet;
        if(obj.packet === -1)
          client.publish("tag/"+obj.address+"/00:00:00:00:00:00", state);
        else
          client.publish("tag/"+obj.address+"/"+bt.address, state);
        console.log(obj.address,bt.address, state);
        del(event, {force:true}, function (err, files) {
          //console.log('Deleted file', files);
        });
      }
    });
  });
});

client.on('error', function(error) {
  console.log(error);
  setTimeout(reboot,60000);
});

const isOnline = require('is-online');

setInterval(function(){
  isOnline().then(online => {
    if(online){
      console.log('Device online');
    }
    else{
      console.log('Device offline');
      reboot();
    }
    //=> true 
  });
},3600000); //Check for internet connectivity once every hour

const { spawn } = require('child_process');

function reboot(){
  const deploySh = spawn('sh', [ 'reboot.sh' ], {
    cwd: process.env.PWD,
    env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  });
}
