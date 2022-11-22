const { cwd } = require('process');
const path = require('path');

/**
 *
 * @param {* It's a usual path startin at the root of the project} pathGiven 
 * @returns It builds a real path starting at the root of the OS, It allows to work with paths along different OS
 */
module.exports.buildPath = pathGiven => {
    return cwd() + path.sep + pathGiven.replace('/', path.sep);
}
