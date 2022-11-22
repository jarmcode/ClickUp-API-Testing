/**
 * Wait a certain amount of time before proceeding to the next step
 * @param {number} ms time in milliseconds to wait
 * @returns
 */
module.exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
