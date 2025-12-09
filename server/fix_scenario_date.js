const { Scenario } = require('./models');

const updateScenarioDate = async () => {
    try {
        const scenario = await Scenario.findOne({ where: { title: 'This is a test' } });
        if (scenario) {
            console.log(`Updating '${scenario.title}' (ID: ${scenario.id}) date...`);
            console.log(`Old Date: ${scenario.publishDate}`);
            scenario.publishDate = new Date(); // Set to Now
            await scenario.save();
            console.log(`New Date: ${scenario.publishDate}`);
            console.log('Update complete.');
        } else {
            console.log('Scenario "This is a test" not found.');
        }
    } catch (err) {
        console.error('Error updating scenario:', err);
    }
};

updateScenarioDate();
