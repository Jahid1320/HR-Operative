const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const resetPasswords = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('jahid123', salt);
        const userPass = await bcrypt.hash('user123', salt);

        await User.update({ password: adminPass }, { where: { email: 'jislam605@gmail.com' } });
        console.log('Admin password reset to: jahid123');

        // Reset the other user too
        // I need to find the email or just update the one I saw
        const user = await User.findOne({ where: { role: 'user' } });
        if (user) {
            await User.update({ password: userPass }, { where: { id: user.id } });
            console.log(`User (${user.email}) password reset to: user123`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
};

resetPasswords();
