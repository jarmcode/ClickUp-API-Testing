@api @task 
Feature: Task

    Defines scenarios for task feature
    @CK-001 @smoke @deleteTask @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteFolder @deleteSpace 
    Scenario: A user can create a task (CK-01)
        Given the user sets the following body:
            | name            | Another Task From Cucumber    |
            | description     | New Task Description from API |
            | due_date        | 1568036964079                 |

        When the "owner" user sends a "POST" request to "/list/(list.id)/task" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name | Another Task From Cucumber |
        And the schema response is verified with "taskSchema"

    @CK-002 @smoke @deleteTask @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteFolder @deleteSpace @createTask 
    Scenario: A user can update a task (CK-002)
        Given the user sets the following body:
            | name            | Task 2                        |
            | description     | Update Description of task 2  |
            | due_date        | 1568036964079                |

        When the "owner" user sends a "PUT" request to "/task/(task.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name            | Task 2                        |
            | description     | Update Description of task 2  |
        And the schema response is verified with "taskSchema"

    @CK-003 @smoke @deleteTask @getAssigneeId @getTeamId @createSpace @createFolder @createList @createTask  @deleteList @deleteFolder @deleteSpace
    Scenario: A user can get a task into a list (CK-003)
        When the "owner" user sends a "GET" request to "/task/(task.id)" endpoint
        Then the response status code should be 200
        And the response body should have the following values:
            | name            | new task from hook            |
            | description     | Some description here.....    |
            | due_date        | 1568016000000                 |
        And the schema response is verified with "taskSchema"

    @CK-004 @smoke @deleteTask @getAssigneeId @getTeamId @createSpace @createFolder @createList @createTask @deleteList @deleteFolder @deleteSpace 
    Scenario: A user can get all tasks into a list (CK-004)
        When the "owner" user sends a "GET" request to "/list/(list.id)/task" endpoint
        Then the response status code should be 200
        And the quantity of "tasks" found should be 1
        And Among all the "tasks" found, the user saves one on position 0
        And the response body should have the following values:
            | name            | new task from hook            |
            | description     | Some description here.....    |
            | due_date        | 1568016000000                 |

    @CK-005 @smoke @getAssigneeId @getTeamId @createSpace @createFolder @createList @createTask @deleteList @deleteFolder @deleteSpace
    Scenario: A user can delete a task into a list (CK-005)
        When the "owner" user sends a "DELETE" request to "/task/(task.id)" endpoint
        Then the response status code should be 200
        And the response body should be empty

    @CK-006 @CK-007 @negative
    Scenario Outline: Verify a user cannot get a task <tittle> id (<id>)
        When the "owner" user sends a "GET" request to "/task/<invalidData>" endpoint
        Then the response status code should be <statusCode>
        And the response body should have the following values:
            | err   | <errMessage> |
            | ECODE | <errCode>    |

        Examples:
            | id     | tittle              | invalidData | statusCode | errMessage                                | errCode   |
            | CK-006 | without an          |             | 404        | Route not found                           | APP_001   |
            | CK-007 | with a non-existent | 999999999   | 401        | Team not authorized                       | OAUTH_027 |

    @CK-008 @CK-009 @negative 
    Scenario Outline: Verify a user cannot get a task <tittle> token (<id>)
        When the "<user>" user sends a "GET" request to "/task/(task.id)" endpoint
        When An invalid user sends a "GET" request to "/task/(task.id)" endpoint with the following header:
            | Authorization | <header> |
        Then the response status code should be <statusCode>
        And the response body should have the following values:
            | err   | <errMessage> |
            | ECODE | <errCode>    |

        Examples:
            | id     | tittle          | user             | header       | statusCode | errMessage                    | errCode   |
            | CK-008 | without a       | withoutTokenUser |              | 400        | Authorization header required | OAUTH_017 |
            | CK-009 | with an invalid | invalidTokenUser | aa_123456789 | 401        | Oauth token not found         | OAUTH_019 |

    @CK-010 @CK-011 @CK-012 @negative 
    Scenario Outline: Verify a user cannot <action> a task without a <feature> id (<id>)
        When the "owner" user sends a "<verb>" request to "<endpoint>" endpoint
        Then the response status code should be 404

        Examples:
            | id     | action | feature | verb   | endpoint    |
            | CK-010 | create | list    | POST   | /list//task |
            | CK-011 | update | task    | PUT    | /task/      |
            | CK-012 | delete | task    | DELETE | /task/      |

    @CK-013 @negative @deleteTask @getAssigneeId @getTeamId @createSpace @createFolder @createList @deleteList @deleteFolder @deleteSpace 
    Scenario: A user can not create a task without a name(CK-013)
        Given the user sets the following body:
            | name            |                               |
            | description     | New Task Description from API |
            | due_date        | 1568036964079                 |
        When the "owner" user sends a "POST" request to "/list/(list.id)/task" endpoint
        Then the response status code should be 400
        And the response body should have the following values:
            | err   | Task name invalid |
            | ECODE | INPUT_005         |
