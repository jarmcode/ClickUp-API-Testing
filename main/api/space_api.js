const RequestManager = require('../../core/api/RequestManager');
const ConfigurationManager = require('../../core/utils/configuration_manager');

/**
 * It manages API requests for space feature
 */
class SpaceApi {
    /**
     * Creates a space
     * @param {number} teamId, team id in which a space will be created
     * @param {json} body, object representation of the fields required to create a space
     * @returns a new space
     */
    async create(teamId, body){
        const header = ConfigurationManager.environment.users['owner'];
        const response = await RequestManager.send('POST', `/team/${teamId}/space`, {}, body, header);
        return response;
    }

    /**
     * Deletes a space
     * @param {number} id, space id to be deleted
     */
    async delete(id){
        const header = ConfigurationManager.environment.users['owner'];
        await RequestManager.send('DELETE', `/space/${id}`, {}, {}, header);
    }
    /**
     * Get all spaces in a team
     * @param {number} id, team id where spaces are storaged
     */
    async get(id){
        const header = ConfigurationManager.environment.users['owner'];
        const response = await RequestManager.send('GET', `/team/${id}/space`, {}, {}, header);
        return response;
    }
}

module.exports = new SpaceApi();
