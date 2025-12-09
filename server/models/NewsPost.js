module.exports = (sequelize, DataTypes) => {
    const NewsPost = sequelize.define('NewsPost', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: true
        },
        author: {
            type: DataTypes.STRING,
            defaultValue: 'Admin'
        },
        image: {
            type: DataTypes.STRING, // URL or path
            allowNull: true
        },
        publishDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    return NewsPost;
};
