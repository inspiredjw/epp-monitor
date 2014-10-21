var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    appName: 'EP Pure Monitor',
    files: './**/**', // use the glob format
    platforms: ['win','osx'],
    buildDir: './build',
    // macIcns: './ico/icon.icns',
    // winIco: './ico/icon.ico',
    version: 'v0.8.4' // Node 0.10.22
});

// Log stuff you want
nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});

// And supports callbacks
nw.build(function(err) {
    if(err) console.log(err);
})