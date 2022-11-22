const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');
const logger = require('../../../core/utils/logger_manager');
const { validateSchemaFromPath } = require('../../../core/utils/schema_validator.js');
const fileReader = require('../../../core/utils/file_reader');
const Replacer = require('../../../core/utils/replacer');
const RequestManager = require('../../../core/api/RequestManager');
const { buildPath } = require('../../../core/utils/path_builder');
const ConfigurationManager = require('../../../core/utils/configuration_manager');

/**
 * Sets a body object for an API request from a file
 */
Given("the user sets the following file body:", function(dataTable) {
    logger.info("Parsing dataTable string to JSON...");
    const tableValue = dataTable.rowsHash();
    logger.info(tableValue['fileName']);
    const fileName = tableValue['fileName'].toString();
    this.requestBody = fileReader.readJson(`main/resources/${fileName}.json`);
});

/**
 * Sets a body object for an API request
 */
Given("the user sets the following body:", function(dataTable) {
    const object = dataTable.rowsHash();
    for (const key in object) {
        object[key] = Replacer.replaceSpecialString(object[key]);
        object[key] = Replacer.replaceNestedValue(object[key], this);
    }
    this.requestBody = object;
});

/**
 * Sets type of user, verb type and the endpoint of the request
 */
When("the {string} user sends a {string} request to {string} endpoint", async function(user, verb, endpoint) {
    endpoint = Replacer.replaceNestedValue(endpoint, this);
    const header = ConfigurationManager.environment.users[user];
    this.response =  await RequestManager.send(verb, endpoint, {}, this.requestBody, header);
});

When("An invalid user sends a {string} request to {string} endpoint with the following header:", async function(verb, endpoint, dataTable) {
    endpoint = Replacer.replaceNestedValue(endpoint, this);
    const header = dataTable.rowsHash();
    this.response =  await RequestManager.send(verb, endpoint, {}, this.requestBody, header);
});

/**
 * Verify if the response code status is the same as expected
 */
Then("the response status code should be {int}", function (expectedCodeStatus) {
    expect(this.response.status).toBe(expectedCodeStatus);
});

/**
 * Sets a 2 dimension array for a response, and verify one by one if it is the same as expected
 */
Then("the response body should have the following values:", function (table) {
    const tableValues = table.raw();
    const body = this.response.data.goal ?? this.response.data;
    for (let index = 0; index < tableValues.length; index++) {
        const value = tableValues[index];
        expect(body[value[0]].toString()).toBe(value[1]);
    }
});

/**
 * It validates schema of any OS (Linux, Windows ...)
 */
Then("the schema response is verified with {string}", function (schemaName) {
    const schemaPath = buildPath(`main/resources/${schemaName}.json`);
    logger.info(`Verifying schema on ${schemaPath}`);
    expect(validateSchemaFromPath(this.response.data, schemaPath)).toBeTruthy();
});

/**
 * It validates the elements quantity returned
 */
Then("the quantity of {string} found should be {int}", function (elements, quantity) {
    expect(this.response.data[elements]).toHaveLength(quantity);
});

/**
 * It saves one of the elements of an array, which was returned as a body response, to be able to validate body and schema
 */
Then("Among all the {string} found, the user saves one on position {int}", function (elements, position) {
    this.response.data = this.response.data[elements][position];
});

/**
 * It validates an empty body
 */
Then("the response body should be empty", function () {
    expect(this.response.data).toEqual({});
});
