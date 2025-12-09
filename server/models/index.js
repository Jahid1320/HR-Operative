const Sequelize = require('sequelize');
const path = require('path');

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'), // Store DB in root of server or project
        logging: false
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Scenario = require('./Scenario')(sequelize, Sequelize);
db.Option = require('./Option')(sequelize, Sequelize);
db.UserResponse = require('./UserResponse')(sequelize, Sequelize);
db.NewsPost = require('./NewsPost')(sequelize, Sequelize);

// Relationships
// Scenario has many Options
db.Scenario.hasMany(db.Option, { as: 'options', foreignKey: 'scenarioId' });
db.Option.belongsTo(db.Scenario, { foreignKey: 'scenarioId' });

// User has many Responses
db.User.hasMany(db.UserResponse, { as: 'responses', foreignKey: 'userId' });
db.UserResponse.belongsTo(db.User, { foreignKey: 'userId' });

// Response belongs to Scenario and Option
db.UserResponse.belongsTo(db.Scenario, { as: 'scenario', foreignKey: 'scenarioId' });
db.UserResponse.belongsTo(db.Option, { as: 'option', foreignKey: 'optionId' });

module.exports = db;
