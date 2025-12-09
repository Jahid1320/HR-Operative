const { sequelize, Scenario, Option } = require('./models');

const seedScenarios = async () => {
    try {
        await sequelize.sync();

        // Level 1 Data
        const level1 = {
            title: "Level 1: The Data Breach",
            description: "It is T-minus 2 days to global payday. IT detects unauthorized access attempts on the APAC payroll server.",
            publishDate: new Date(),
            options: [
                {
                    text: "The Fortress: Shut down server, delay pay",
                    complianceImpact: 15, // High Compliance
                    efficiencyImpact: -5,
                    satisfactionImpact: -15, // Low Satisfaction
                    personalityTag: "The Safe Hands"
                },
                {
                    text: "The Gambler: Push payment manually, ignore breach",
                    complianceImpact: -15, // Low Compliance
                    efficiencyImpact: 10,
                    satisfactionImpact: 15, // High Satisfaction (people get paid)
                    personalityTag: "The Maverick"
                },
                {
                    text: "The Collaborator: Notify authorities, pay emergency advance",
                    complianceImpact: 5, // Balanced
                    efficiencyImpact: -5,
                    satisfactionImpact: 5, // Balanced
                    personalityTag: "The Diplomat"
                },
                {
                    text: "The Delegator: Wait for Legal sign-off",
                    complianceImpact: 10,
                    efficiencyImpact: -15, // Low Efficiency (waiting)
                    satisfactionImpact: -5,
                    personalityTag: "The Strategist"
                }
            ]
        };

        // Check if level 1 exists
        const existingScenario = await Scenario.findOne({ where: { title: level1.title } });

        if (existingScenario) {
            console.log(`Scenario "${level1.title}" already exists. Skipping.`);
        } else {
            const scenario = await Scenario.create({
                title: level1.title,
                description: level1.description,
                publishDate: level1.publishDate
            });

            for (const opt of level1.options) {
                await Option.create({
                    ...opt,
                    scenarioId: scenario.id
                });
            }
            console.log(`Scenario "${level1.title}" created successfully.`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Failed to seed scenarios:', err);
        process.exit(1);
    }
};

seedScenarios();
