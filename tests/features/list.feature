@api @list
Feature: Lists

    Defines scenarios for Lists feature
    @CP-01 @smoke @getAssigneeId @getTeamId @createSpace @createFolder @deleteList @functional @deleteSpace @deleteFolder
    Scenario: Verify a new List can be created (CP-01)
        Given the user sets the following body:
            | name          | New List         |
            | content       | New List Content |
            | due_date      | 1567780450202    |
            | due_date_time | false            |
            | priority      | 1                |
            | assignee      | (user.id)        |
            | status        | red              |
        When the "owner" user sends a "POST" request to "/folder/(folder.id)/list" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name              | New List              |
            | content           | New List Content      |
        And the schema response is verified with "listSchema"

    @CP-02 @smoke @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteSpace @deleteFolder
    Scenario: Verify a new List can be requested (CP-02)
        When the "owner" user sends a "GET" request to "/list/(list.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name              | New List              |
            | content           | New List Content      |
        And the schema response is verified with "listSchema"

    @CP-03 @smoke @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteSpace @deleteFolder
    Scenario: Verify that a list can be updated (CP-03)
        Given the user sets the following body:
            | name | New List Updated |
        When the "owner" user sends a "PUT" request to "/list/(list.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name | New List Updated |
        And the schema response is verified with "listSchema"

    @CP-04 @smoke @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteSpace @deleteFolder
    Scenario: verify that a list can be deleted (CP-04)
        When the "owner" user sends a "DELETE" request to "/list/(list.id)" endpoint
        Then the response status code should be 200
        And the response body should be empty

    @CP-05 @getAssigneeId @getTeamId @createSpace @createFolder @deleteList @functional @deleteSpace @deleteFolder 
    Scenario: verify that a list should not be created without a name (CP-05)
        Given the user sets the following body:
            | name          |                  |
            | content       | New List Content |
            | due_date      | 1567780450202    |
            | due_date_time | false            |
            | priority      | 1                |
            | assignee      | (user.id)        |
            | status        | red              |
        When the "owner" user sends a "POST" request to "/folder/(folder.id)/list" endpoint
        Then the response status code should be 400
        And the response body should have the following values:
            | err           | List Name Invalid|
            | ECODE         | SUBCAT_020       |

    @CP-06 @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteSpace @deleteFolder 
    Scenario: verify that a user should not be able to get a list with an invalid id (CP-06)
        When the "owner" user sends a "GET" request to "/list/000000" endpoint
        Then the response status code should be 401
        And the response body should have the following values:
            | err            | Team not authorized |
            | ECODE          | OAUTH_027           |

    @CP-07 @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteSpace @deleteFolder
    Scenario: verify that a user should not be able to edit a list with and invalid id (CP-07)
        Given the user sets the following body:
            | name | New List Updated |
        When the "owner" user sends a "PUT" request to "/list/000000" endpoint
        Then the response status code should be 404
        And the response body should have the following values:
            | err            | Not Found           |
            | ECODE          | OAUTH_121           |

    @CP-08 @functional @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteFolder @deleteSpace
    Scenario: verify when a user deletes a list this one is still available to be recovered (CP-08)
        When the "owner" user sends a "DELETE" request to "/list/(list.id)" endpoint
        Then the response status code should be 200
        When the "owner" user sends a "DELETE" request to "/list/(list.id)" endpoint
        Then the response status code should be 200
        And the response body should be empty
