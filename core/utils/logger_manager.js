const log4js = require("log4js");
const fileReader = require('./file_reader');
const configuration = fileReader.readJson('./configurationFile.json');
const loglevel = configuration["log-level"] || "info";
log4js.configure({
  appenders: {
    console: { type: "console"},
    file: {type: "file", filename: "reports/log/exec.log", backups: 3}
},
categories: {
    default: { appenders: ["console", "file"], level: loglevel },
    console: { appenders: ["console"], level: loglevel },
    file: { appenders: ["file"], level: loglevel },
},
});

const logger = log4js.getLogger();

module.exports = logger;
