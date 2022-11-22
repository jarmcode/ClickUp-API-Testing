const fileReader = require('./file_reader');

/**
 * Sets static values from configuration and environment FileSystem
 */
class ConfigurationManager {
    static setUp = fileReader.readJson('./configurationFile.json');
    static environment = fileReader.readJson('./environment.json')[ConfigurationManager.setUp.environment];
}

module.exports = ConfigurationManager;
