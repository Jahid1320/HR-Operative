const { Scenario, Option, UserResponse } = require('../models');
const { Op } = require('sequelize');

exports.getDailyScenario = async (req, res) => {
    try {
        console.log('Fetching daily scenario...');
        // Logic: Get scenario where publishDate is today or latest before today
        // For MVP/Demo: Just get the first one or a specific one if no date logic is strictly enforced yet
        // Strict date logic:
        // const today = new Date().toISOString().split('T')[0];

        // Demo Logic: Get the most recent active scenario
        // Get the most recent active scenario where publishDate is in the past
        const scenario = await Scenario.findOne({
            where: {
                publishDate: {
                    [Op.lte]: new Date() // Less than or equal to now
                }
            },
            order: [['publishDate', 'DESC']],
            include: [{
                model: Option,
                as: 'options',
                attributes: ['id', 'text'] // Hide impacts!
            }]
        });

        if (scenario) {
            console.log(`Found scenario: ${scenario.title}, Options: ${scenario.options ? scenario.options.length : 0}`);
        } else {
            console.log('No scenario found matching criteria.');
        }

        if (!scenario) {
            return res.status(404).json({ msg: 'No active scenario available' });
        }

        // Check if user has already responded
        const response = await UserResponse.findOne({
            where: {
                userId: req.user.id,
                scenarioId: scenario.id
            }
        });

        if (response) {
            return res.json({
                scenario,
                responded: true,
                selectedOptionId: response.optionId
            });
        }

        res.json({ scenario, responded: false });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.submitResponse = async (req, res) => {
    const { scenarioId, optionId } = req.body;

    try {
        const scenario = await Scenario.findByPk(scenarioId);
        if (!scenario) return res.status(404).json({ msg: 'Scenario not found' });

        // Prevent duplicate response
        const existing = await UserResponse.findOne({
            where: { userId: req.user.id, scenarioId }
        });
        if (existing) {
            return res.status(400).json({ msg: 'Already responded to this scenario' });
        }

        // Record response
        await UserResponse.create({
            userId: req.user.id,
            scenarioId,
            optionId
        });

        // Update User Scores (Hidden Logic)
        // We need to fetch the option's impacts
        const option = await Option.findByPk(optionId);
        if (option) {
            const user = await req.user; // req.user is just the payload, we need to fetch the model or use update
            // Actually req.user came from middleware which might just be {id, role}. 
            // Let's refetch user model to increment.
            const userModel = await require('../models').User.findByPk(req.user.id);

            userModel.complianceScore += option.complianceImpact;
            userModel.efficiencyScore += option.efficiencyImpact;
            userModel.satisfactionScore += option.satisfactionImpact;
            await userModel.save();
        }

        res.json({ msg: 'Response recorded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
