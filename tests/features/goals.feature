@api @goal
Feature: Goals

    @CM-01 @functional @getTeamId @deleteGoal
    Scenario: Verify that a new goal can be created (CM-01)
        Given the user sets the following body:
            | name            | Goal New Name    |
            | due_date        | 1568036964079    |
            | description     | Goal Description |
            | multiple_owners | false            |
            | color           | #32a852          |
        When the "owner" user sends a "POST" request to "/team/(team.id)/goal" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name | Goal New Name |
        And the schema response is verified with "GoalSchema"

    @CM-02 @functional @getTeamId @createGoal @deleteGoal
    Scenario: Verify that a goal can be updated (CM-02)
        Given the user sets the following body:
            | name            | Updated Goal Name        |
            | due_date        | 1568044355026            |
            | description     | Updated Goal Description |
            | multiple_owners | false                    |
        When the "owner" user sends a "PUT" request to "/goal/(goal.goal.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name            | Updated Goal Name        |
            | due_date        | 1568044355026            |
            | description     | Updated Goal Description |
            | multiple_owners | false                    |
        And the schema response is verified with "GoalSchema"

    @CM-03 @functional @getTeamId @createGoal
    Scenario: Verify that a goal can be deleted (CM-03)
        When the "owner" user sends a "DELETE" request to "/goal/(goal.goal.id)" endpoint
        Then the response status code should be 200
        And the response body should be empty

    @CM-04 @functional @getTeamId @createGoal @deleteGoal
    Scenario: Verify that a goal can be read (CM-04)
        Given the "owner" user sends a "GET" request to "/goal/(goal.goal.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name            | new goal from huk          |
            | description     | Some description here..... |
            | multiple_owners | false                      |
            | color           | #32a852                    |

    @CM-05 @negative
    Scenario: Verify that the user gets a 500 code when he puts on the url an incorrect goal id (CM-05)
        Given the "owner" user sends a "GET" request to "/goal/dd2a9e33-d17a-4c0e-qwuey-86e4320b740" endpoint
        Then the response status code should be 500
        And the response body should have the following values:
            | err   | invalid input syntax for type uuid: "dd2a9e33-d17a-4c0e-qwuey-86e4320b740" |
            | ECODE |                           OAUTH_101                                        |

    @CM-06 @negative @getTeamId
    Scenario: Verify that the user gets a 500 code when he doesn't set a goal name in their request (CM-06)
        Given the user sets the following body:
            | due_date          | 1568036964079     |
            | description       | Goal Description  |
            | multiple_owners   | false             |
            | color             | #32a852           |
        When the "owner" user sends a "POST" request to "/team/(team.id)/goal" endpoint
        Then the response status code should be 500
        And the response body should have the following values:
            | err   | null value in column "name" violates not-null constraint  |
            | ECODE | GOAL_005                                                  |
    
    @CM-07 @negative
    Scenario: Verify that the user gets a 401 code when he doesn't enter his own team id (CM-07)
        Given the user sets the following body:
            | name              | Goal name         |
            | due_date          | 1568036964079     |
            | description       | Goal Description  |
            | multiple_owners   | false             |
            | color             | #32a852           |
        When the "owner" user sends a "POST" request to "/team/99999999/goal" endpoint
        Then the response status code should be 401
        And the response body should have the following values:
            | err   | Team not authorized   |
            | ECODE | OAUTH_061             |

    @CM-08 @negative @getTeamId @deleteGoal
    Scenario: Verify that the user gets a 500 code, when they set a name without any character (CM-08)
        Given the user sets the following body:
            | name              |                   |
            | due_date          | 1568036964079     |
            | description       | Goal Description  |
            | multiple_owners   | false             |
            | color             | #32a852           |
        When the "owner" user sends a "POST" request to "/team/(team.id)/goal" endpoint
        Then the response status code should be 500
        And the response body should have the following values:
            | err   | null value in column "name" violates not-null constraint |
            | ECODE | GOAL_005                                                 |
