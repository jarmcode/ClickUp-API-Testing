/**
 * Chrome Driver
 */
require('chromedriver');
const { Browser, Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

/**
 * Configures Chrome Driver
 * @param {*} capabilities Browser Capabilities
 */

async function chrome(capabilities) {
    //Options
    const options = new Options();
    if (capabilities.headless) options.headless();
    if (!capabilities.maximizeWindow) options.windowSize(capabilities.windowSize);

    //Driver
    return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
}

module.exports = chrome;