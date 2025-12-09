const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const users = await User.findAll();

        for (const u of users) {
            console.log(`Checking User: ${u.email}`);
            const isMatchJahid = await bcrypt.compare('jahid123', u.password);
            const isMatchUser = await bcrypt.compare('user123', u.password);

            console.log(`Matches 'jahid123'? ${isMatchJahid}`);
            console.log(`Matches 'user123'? ${isMatchUser}`);
            console.log('---');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkUsers();
