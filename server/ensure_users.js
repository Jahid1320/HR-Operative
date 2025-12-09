
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

const ensureCredentials = async () => {
    try {
        await sequelize.sync();
        const salt = await bcrypt.genSalt(10);

        // 1. Ensure Admin
        const adminEmail = 'jislam605@gmail.com';
        const adminPass = await bcrypt.hash('jahid123', salt);
        let admin = await User.findOne({ where: { email: adminEmail } });
        if (admin) {
            admin.password = adminPass;
            admin.role = 'admin'; // Ensure role
            await admin.save();
            console.log(`[UPDATED] Admin ${adminEmail} password reset to jahid123`);
        } else {
            console.log(`[WARNING] Admin ${adminEmail} not found! Creating...`);
            await User.create({
                name: 'Jahid (Admin)',
                email: adminEmail,
                password: adminPass,
                role: 'admin'
            });
        }

        // 2. Ensure User 'islamj64@gmail.com'
        const userEmail = 'islamj64@gmail.com';
        const userPass = await bcrypt.hash('islam123', salt);
        let user = await User.findOne({ where: { email: userEmail } });
        if (user) {
            user.password = userPass;
            user.role = 'user'; // Ensure role
            await user.save();
            console.log(`[UPDATED] User ${userEmail} password reset to islam123`);
        } else {
            console.log(`[CREATED] User ${userEmail} created with password islam123`);
            await User.create({
                name: 'Islam Jahid',
                email: userEmail,
                password: userPass,
                role: 'user',
                jobTitle: 'Crisis Manager',
                company: 'Global Payroll'
            });
        }

    } catch (err) {
        console.error('Error ensuring credentials:', err);
    }
};

ensureCredentials();
