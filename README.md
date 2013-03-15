# Mole Sauce -- Delicious Sauce Labs reporter for Mocha

Mole Sauce wraps your Mocha tests to make it easy to write WebDriver tests
in Mocha and have them run against Sauce Labs. Each suite that you tag
with `this.sauce = true` will get its own browser session, and the test
pass/fail results will be submitted to Sauce Labs when it finishes.

## Running the examples

    export SAUCE_USERNAME=XXXX
    export SAUCE_ACCESS_KEY=XXXX
    git clone https://github.com/epall/mole-sauce.git
    cd mole-sauce
    npm install
    npm run examples

## Usage

    npm install https://github.com/epall/mole-sauce.git

Add `this.sauce = true` to the body of the suites you want to add mole-sauce to.

    mocha -R mole-sauce

If you want to use mole-sauce in addition to a more communicative reporter,
you'll need to invoke mocha programmatically. See examples/run.js.

## Authors

  - Eric Allen ([epall](http://github.com/epall))

## License

  * License - BSD

## TODO

* Write some tests
* Properly tease out results from nested suites
* Support launching a session per-test instead of per-suite
