const { sequelize, User } = require('./models');

const promoteUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        const user = await User.findOne({ where: { email: 'adminapi@example.com' } });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${user.email} promoted to admin.`);
        } else {
            console.log('User not found.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
};

promoteUser();
