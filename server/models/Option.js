module.exports = (sequelize, DataTypes) => {
    const Option = sequelize.define('Option', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        complianceImpact: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        efficiencyImpact: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        satisfactionImpact: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        personalityTag: {
            type: DataTypes.STRING // e.g., "The Risk Taker"
        }
    });

    return Option;
};
