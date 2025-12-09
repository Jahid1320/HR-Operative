const fs = require('fs');
const path = require('path');
const { sequelize, User, Scenario, Option } = require('./models');
const bcrypt = require('bcryptjs');
const app = require('./index').app; // Note: need to export app from index.js or just replicate listeners here.
// Actually, index.js starts listening immediately. I should probably just require index.js AFTER cleaning DB?
// Better: Re-implement startup logic here to control order.

const run = async () => {
    console.log('--- STARTING FRESH ---');

    // 1. Delete DB if exists
    const dbPath = path.join(__dirname, '../database.sqlite');
    if (fs.existsSync(dbPath)) {
        try {
            fs.unlinkSync(dbPath);
            console.log('Old database deleted.');
        } catch (e) {
            console.error('Could not delete DB:', e.message);
        }
    }

    // 2. Sync DB
    await sequelize.sync({ force: true }); // force: true drops tables
    console.log('Database synced (force: true).');

    // 3. Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jahid123', salt);

    await User.create({
        name: 'Jahid (Admin)',
        email: 'jislam605@gmail.com',
        password: hashedPassword,
        role: 'admin',
        jobTitle: 'Head of Crisis Management',
        company: 'Global Payroll Crisis'
    });
    console.log('Admin user created.');

    // 4. Seed Scenario
    const scenario = await Scenario.create({
        title: 'Level 1: The Data Breach',
        description: 'A massive data breach has exposed sensitive employee payroll information. Media outlets are asking for a statement.',
        publishDate: new Date()
    });

    const optionsData = [
        { text: 'Issue immediate public apology', complianceImpact: 10, efficiencyImpact: -5, satisfactionImpact: 15, personalityTag: 'The Transparent Leader' },
        { text: 'Launch internal investigation first', complianceImpact: 15, efficiencyImpact: 5, satisfactionImpact: -5, personalityTag: 'The Cautious Strategist' },
        { text: 'Deny the breach until confirmed', complianceImpact: -20, efficiencyImpact: 10, satisfactionImpact: -15, personalityTag: 'The Risk Taker' },
        { text: 'Blame external vendor', complianceImpact: -10, efficiencyImpact: 0, satisfactionImpact: -10, personalityTag: 'The Deflector' }
    ];

    for (const opt of optionsData) {
        await Option.create({ ...opt, scenarioId: scenario.id });
    }
    console.log('Level 1 Scenario created.');

    // 5. Start Server
    // Since index.js starts the server automatically when required, we can't just require it.
    // We'll spawn it or listen here if we had the app.
    // Simpler: Just exit this script and let the user (or me) run `node index.js`.
    // But `node index.js` will sync again (non-force). That's fine.

    console.log('Setup complete. Ready to start server.');
};

run();
