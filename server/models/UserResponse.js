module.exports = (sequelize, DataTypes) => {
    const UserResponse = sequelize.define('UserResponse', {
        // Relationships define the keys: userId, scenarioId, optionId
        // We can add a timestamp here (default createdAt works)
    });

    return UserResponse;
};
