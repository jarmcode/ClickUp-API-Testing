const Validator = require('jsonschema').Validator;
const FileReader = require('./file_reader');

/**
 *
 * @param {*Object which will be validated} response
 * @param {*Path of the json file in which we have the schema to validate} schemaPath
 * @returns
 */
module.exports.validateSchemaFromPath = function (response, schemaPath) {
    const validator = new Validator();
    const schema = FileReader.readJson(schemaPath);
    return validator.validate(response, schema).valid;
};
