var util = require('util');
var mocha = require('mocha');
var wd = require('wd');
var saucelabs = require('saucelabs');

var Base = mocha.reporters.Base;

function MoleSauce(runner) {
    Base.call(this, runner);
    this.desiredCapabilities = {};
    this.webdriverConfig = {
        host: 'ondemand.saucelabs.com'
    };
    this.local = false;

    var self = this;
    runner.on('suite', function(suite) {
        if(suite.sauce) {
            suite.beforeAll(function(done) {
                setupWebdriver(
                    suite,
                    self.desiredCapabilities,
                    self.webdriverConfig,
                    done
                );
            });
            // force this beforeAll to run ahead of anything defined
            // inside the suite so that the browser object is created
            // and ready to be used inside the suite's beforeAll.
            var hook = suite._beforeAll.pop();
            hook.timeout(60000); // browsers can take a while to start up
            suite._beforeAll.unshift(hook);

            suite.afterAll(function(done) {
                teardownWebdriver(suite, !self.local, done);
            });
        }
    });
}
util.inherits(MoleSauce, Base);

function setupWebdriver(suite, desiredCapabilities, webdriverConfig, callback) {
    var b = wd.remote(webdriverConfig);
    var caps = {};
    for(var k in desiredCapabilities) {
        caps[k] = desiredCapabilities[k];
    }
    caps.name = suite.fullTitle();

    b.init(caps, function(err) {
        if(err) {
            // wd has a habit of emitting raw objects, which Mocha gets
            // upset about. Make them play nice together:
            if(!(err instanceof Error)) {
                err = new Error(err.message+": "+err.data);
            }
            return callback(err);
        }
        suite.ctx.browser = b;
        callback(null);
    });
}

function teardownWebdriver(suite, submitResults, callback) {
    var failed = suite.tests.some(function(t) {
        return t.state == 'failed';
    });

    var b = suite.ctx.browser;
    suite.ctx.browser = null;

    b.quit(function(err) {
        if(err) { return callback(err); }
        if(submitResults) {
            var sauce = new saucelabs({
                username: process.env['SAUCE_USERNAME'],
                password: process.env['SAUCE_ACCESS_KEY']
            });
            sauce.updateJob(b.sessionID, {passed: !failed}, function(err) {
                // The saucelabs module has a habit of emitting raw objects, which
                // Mocha gets upset about. Make them play nice together:
                if(err && !(err instanceof Error)) {
                    err = new Error(err.toString());
                }
                callback(err);
            });
        } else {
            callback();
        }
    });
}

module.exports = MoleSauce;
