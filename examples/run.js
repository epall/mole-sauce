var Mocha, mole;

try {
    Mocha = require('mocha');
} catch(e) {
    Mocha = require('../node_modules/mocha');
}

try {
    mole = require('mole-sauce');
} catch(e) {
    mole = require('../index');
}

var mocha = new Mocha({
    ui: 'tdd'
});
mocha.addFile(__dirname+'/example.js');

var runner = mocha.run();
var m = new mole(runner);
m.webdriverConfig = {
    host: 'ondemand.saucelabs.com'
}
