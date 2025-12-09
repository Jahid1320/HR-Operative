const { sequelize, Scenario, Option } = require('./models');

const checkData = async () => {
    try {
        await sequelize.authenticate();
        const scenarios = await Scenario.findAll({ include: ['options'] });
        console.log(`Found ${scenarios.length} scenarios.`);

        scenarios.forEach(s => {
            console.log(`Scenario: ${s.title} (ID: ${s.id})`);
            console.log(`Options Count: ${s.options ? s.options.length : 0}`);
            if (s.options) {
                s.options.forEach(o => console.log(` - ${o.text}`));
            }
        });
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
};

checkData();
