const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

const createSpecificAdmin = async () => {
    try {
        await sequelize.sync();

        const email = 'jislam605@gmail.com';
        const password = 'jahid123';

        let user = await User.findOne({ where: { email } });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            console.log('User exists, updating to admin role...');
            user.password = hashedPassword;
            user.role = 'admin';
            user.name = 'Jahid (Admin)'; // Optional: update name
            await user.save();
        } else {
            console.log('Creating new admin user...');
            await User.create({
                name: 'Jahid (Admin)',
                email,
                password: hashedPassword,
                role: 'admin',
                jobTitle: 'Head of Crisis Management',
                company: 'Global Payroll Crisis'
            });
        }

        console.log(`Admin user ${email} configured successfully.`);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create/update admin:', err);
        process.exit(1);
    }
};

createSpecificAdmin();
