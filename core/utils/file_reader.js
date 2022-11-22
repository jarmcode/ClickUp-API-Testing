const fs = require("fs");

/**
 * Reads a .json file using synchronos function
 * @param {string} filePath relative path for file
 * @returns json object
 */
module.exports.readJson = function (filePath) {
    if (!fs.existsSync(filePath)) {
        throw Error("Invalid path value");
    }
    const rawdata = fs.readFileSync(filePath);
    return JSON.parse(rawdata);
}
