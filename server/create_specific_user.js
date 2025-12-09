const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

const createSpecificUser = async () => {
    try {
        await sequelize.sync();

        const email = 'user@example.com';
        const password = 'user123';

        let user = await User.findOne({ where: { email } });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            console.log('User exists, updating password...');
            user.password = hashedPassword;
            user.role = 'user';
            await user.save();
        } else {
            console.log('Creating new regular user...');
            await User.create({
                name: 'Regular User',
                email,
                password: hashedPassword,
                role: 'user',
                jobTitle: 'Payroll Officer',
                company: 'Global Payroll Crisis'
            });
        }

        console.log(`User ${email} configured successfully.`);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create/update user:', err);
        process.exit(1);
    }
};

createSpecificUser();
