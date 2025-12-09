const { Option } = require('./models');

const addOptions = async () => {
    try {
        const scenarioId = 5; // ID for "This is a test"

        console.log(`Adding options to Scenario ID: ${scenarioId}...`);

        const options = [
            {
                scenarioId,
                text: 'Ignore the glitch and process payroll manually.',
                complianceImpact: -5,
                efficiencyImpact: 10,
                satisfactionImpact: 5,
                personalityTag: 'Pragmatic'
            },
            {
                scenarioId,
                text: 'Halt payroll and conduct a full audit.',
                complianceImpact: 10,
                efficiencyImpact: -15,
                satisfactionImpact: -10,
                personalityTag: 'Bureaucrat'
            },
            {
                scenarioId,
                text: 'Notify all employees and issue partial payments.',
                complianceImpact: 5,
                efficiencyImpact: -5,
                satisfactionImpact: 10,
                personalityTag: 'Diplomat'
            }
        ];

        await Option.bulkCreate(options);
        console.log('Options added successfully.');

    } catch (err) {
        console.error('Error adding options:', err);
    }
};

addOptions();
