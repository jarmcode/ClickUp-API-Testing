require('chromedriver');
const {Builder, Browser} = require('selenium-webdriver');



(async () => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.sleep(5000);
    await driver.quit();
})();