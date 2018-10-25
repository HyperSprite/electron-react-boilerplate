'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "tasks", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "tasks",
    "created": "2018-10-10T00:30:53.507Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "tasks",
        {
            "id": {
                "type": Sequelize.UUID,
                "allowNull": false,
                "primaryKey": true,
                "defaultValue": Sequelize.UUIDV4
            },
            "name": {
                "type": Sequelize.TEXT,
                "defaultValue": "",
                "allowNull": false
            },
            "isActive": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": true
            },
            "isDeleted": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
