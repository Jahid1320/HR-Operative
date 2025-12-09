module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        jobTitle: {
            type: DataTypes.STRING
        },
        company: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Hidden Scores (Calculated or cached)
        complianceScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        efficiencyScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        satisfactionScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return User;
};
