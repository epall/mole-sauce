var assert = require('assert');

suite('mole-sauce examples –', function() {
    this.timeout(10000); // browser tests take a bit longer

    suite('saucelabs.com', function() {
        this.sauce = true; // flag that this suite should get a Sauce OnDemand browser

        setup(function(done) {
            // this.browser is setup and taken down by mole-sauce
            this.browser.get('https://saucelabs.com/', done);
        });

        test('features', function(done) {
            var b = this.browser;

            b.elementByCssSelector('.features-list a', function(err, el) {
                if(err) { return done(err); }
                el.click(function(err) {
                    if(err) { return done(err); }
                    b.source(function(err, source) {
                        if(err) { return done(err); }
                        assert.ok(source.match(/cross-browser test/));
                        done();
                    });
                });
            });
        });
    });

    suite('google.com', function() {
        this.sauce = true;

        // for some reason this test fails. WTF people, mole sauce is amazing!
        test('searching', function(done) {
            var b = this.browser;

            b.elementByName('q', function(err, el) {
                if(err) { return done(err); }
                el.type('mole sauce\U+E007', function(err) {
                    b.elementByLinkText('Homemade Mole Sauce', function(err, el) {
                        if(err) { return done(err); }
                        assert.ok(el);
                        b.source(function(err, source) {
                            if(err) { return done(err); }
                            assert.ok(source.match(/amazing/));
                            done();
                        });
                    });
                });
            });
        });
    });
});
