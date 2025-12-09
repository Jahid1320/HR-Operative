const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

const createAdmin = async () => {
    try {
        await sequelize.sync(); // Ensure tables exist

        const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            jobTitle: 'System Administrator',
            company: 'Global Payroll Crisis'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        process.exit(0);
    } catch (err) {
        console.error('Failed to create admin:', err);
        process.exit(1);
    }
};

createAdmin();
