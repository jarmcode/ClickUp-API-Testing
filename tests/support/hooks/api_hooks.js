const { After, Before } = require('@cucumber/cucumber');
const RequestManager = require('../../../core/api/RequestManager');
const logger = require('../../../core/utils/logger_manager');
const spaceApi = require('../../../main/api/space_api');
const FileReader = require('../../../core/utils/file_reader');
const { buildPath } = require('../../../core/utils/path_builder');
const FolderApi = require('../../../main/api/folder_api');
const ConfigurationManager = require('../../../core/utils/configuration_manager');

/**
 * It displays which scenario is running
 */
Before(function(scenario) {
    logger.info(`Running ${scenario.pickle.uri}, Scenario: ${scenario.pickle.name}`);
});
/**
 * It gets workspace team id, takes the first found
 */
Before({ tags: "@getTeamId" }, async function () {
    logger.info('Getting a team id...');
    const header = ConfigurationManager.environment.users['owner'];
    const response = await RequestManager.send('GET', '/team', {}, {}, header);
    this.team = response.data.teams[0];
});

/**
 * It gets the user id
 */
Before({ tags: "@getAssigneeId" }, async function () {
    logger.info('Getting a Assignee id...');
    const header = ConfigurationManager.environment.users['owner'];
    const response = await RequestManager.send('GET', '/user', {}, {}, header);
    this.user = response.data.user;
});

/**
 * It creates a goal to be used later on a step or a hook
 */
Before({ tags: "@createGoal" }, async function () {
    logger.info('Creating a goal...');
    const newGoalBody = {
        "name": "new goal from huk",
        "due_date": "1568036964079",
        "description": "Some description here.....",
        "multiple_owners": false, "color": "#32a852"
    };
    const header = ConfigurationManager.environment.users['owner'];
    const response = await RequestManager.send('POST', `/team/${this.team.id}/goal`, {}, newGoalBody, header);
    this.goal = response.data;
});

/**
 * It creates a space due to use it later on a step or a hook
 */
Before({ tags: "@createSpace" }, async function () {
    logger.info('Creating a space hook...');
    const spacePath = buildPath("main/resources/createSpace.json");
    const spaceJson = FileReader.readJson(spacePath);
    const response = await spaceApi.create(this.team.id, spaceJson);
    this.space = response.data;
});

/**
 * It creates two spaces with diferent body each one
 */
Before({ tags: "@createSpaces" }, async function () {
    logger.info('Creating spaces hook...');
    let name;
    for (let i = 0; i <= 1; i++){
        i === 0 ?  name = "createSpace" : name = "updateSpace"
        const spacePath = buildPath(`main/resources/${name}.json`);
        const spaceJson = FileReader.readJson(spacePath);
        await spaceApi.create(this.team.id, spaceJson);
    }
    logger.info(this.team.id);
    const response = await spaceApi.get(this.team.id);
    this.space = response.data.spaces[0];
    this.spaces = response.data.spaces;
    logger.debug(this.space);
});

/**
 * It creates a folder due to use it later on a step or a hook
 */
Before({ tags: "@createFolder" }, async function () {
    logger.info('Creating a folder hook...');
    const response = await FolderApi.create(this.space.id, {"name": "New Test Folder"})
    this.folder = response.data;
});

/**
 * It creates a list to be used later on a step or a hook
 */
Before({ tags: "@createList" }, async function () {
    logger.info('Creating a list hook...');
    const header = ConfigurationManager.environment.users['owner'];
    const response = await RequestManager.send('POST', `/folder/${this.folder.id}/list`, {}, {"name": "New List","content": "New List Content","due_date": "1567780450202","due_date_time": "false","priority": "1","assignee": `${this.user.id}`,"status": "red"}, header);
    this.list = response.data;
});

/**
 * It creates a task to be used later on a step or a hook
 */
Before({ tags: "@createTask" }, async function () {
    logger.info('Creating a task...');
    const newTaskBody = {
        "name": "new task from hook",
        "due_date": "1568036964079",
        "description": "Some description here.....",
    };
    const header = ConfigurationManager.environment.users['owner'];
    const response = await RequestManager.send('POST', `/list/${this.list.id}/task`, {}, newTaskBody, header);
    this.task = response.data;
})


/**
 * It deletes a space which has been created before the start of the test execution
 */
Before ({tags: "@deleteSpaceB"}, async function () {
    logger.info("Delete Space hook...");
    if (this.space === undefined)
        await spaceApi.delete(this.response.data.id);
    else
        await spaceApi.delete(this.space.id);
});

/**
 * It deletes a task which has been created before
 */
After ({tags: "@deleteTask"}, async function () {
    logger.info("Delete Task hook...");
    const header = ConfigurationManager.environment.users['owner'];
    if (this.task === undefined)
        await RequestManager.send('DELETE', `/task/${this.response.data.id}`, {}, {}, header);
    else
        await RequestManager.send('DELETE', `/task/${this.task.id}`, {}, {}, header);
});

/**
 * It deletes a list which has been created before
 */
After ({tags: "@deleteList"}, async function () {
    logger.info("Delete List hook...");
    const header = ConfigurationManager.environment.users['owner'];
    if (this.list === undefined)
        await RequestManager.send('DELETE', `/list/${this.response.data.id}`, {}, {}, header);
    else
        await RequestManager.send('DELETE', `/list/${this.list.id}`, {}, {}, header);
});

/**
 * It deletes a folder which has been created before
 */
After({ tags: "@deleteFolder" }, async function () {
    logger.info('Deleting folder hook...');
    if (this.folder === undefined)
        await FolderApi.delete(this.response.data.id);
    else
        await FolderApi.delete(this.folder.id);
});

/**
 * It deletes a space which has been created before, it also deletes a space which has been created into a hook
 */
After ({tags: "@deleteSpace"}, async function () {
    logger.info("Delete Space hook...");
    if (this.space === undefined)
        await spaceApi.delete(this.response.data.id);
    else
        await spaceApi.delete(this.space.id);
});

/**
 * It deletes all the spaces created in a team
 */
After ({tags: "@deleteSpaces"}, async function () {
    logger.info("Delete Spaces hook...");
    for(let i = 0; i < this.spaces.length; i++){
        await spaceApi.delete(this.spaces[i].id);
    }
});

/**
 * It deletes a goal which has been created before
 */
After({ tags: "@deleteGoal" }, async function () {
    logger.info('Deleting goal hook...');
    const header = ConfigurationManager.environment.users['owner'];
    if (this.goal === undefined)
        await RequestManager.send('DELETE', `/goal/${this.response.data.goal.id}`, {}, {}, header);
    else
        await RequestManager.send('DELETE', `/goal/${this.goal.goal.id}`, {}, {}, header);
});
