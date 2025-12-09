module.exports = (sequelize, DataTypes) => {
    const Scenario = sequelize.define('Scenario', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false // The story text
        },
        publishDate: {
            type: DataTypes.DATE, // Full date and time
            allowNull: false
        }
    });

    return Scenario;
};
