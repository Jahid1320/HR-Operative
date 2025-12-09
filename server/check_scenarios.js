const { Scenario, Option } = require('./models');
const { Op } = require('sequelize');

const checkScenarios = async () => {
    try {
        const scenarios = await Scenario.findAll({
            include: [{ model: Option, as: 'options' }],
            order: [['createdAt', 'DESC']]
        });

        console.log('--- Database Scenarios ---');
        console.log(`Current Server Time: ${new Date().toISOString()}`);
        console.log('--------------------------');

        scenarios.forEach(s => {
            const isVisible = s.publishDate <= new Date();
            console.log(`ID: ${s.id}`);
            console.log(`Title: "${s.title}"`);
            console.log(`Publish Date: ${s.publishDate} (ISO: ${new Date(s.publishDate).toISOString()})`);
            console.log(`Visible (publishDate <= now)? ${isVisible}`);
            console.log(`Options Count: ${s.options ? s.options.length : 0}`);
            console.log('--------------------------');
        });

    } catch (err) {
        console.error('Error checking scenarios:', err);
    }
};

checkScenarios();
