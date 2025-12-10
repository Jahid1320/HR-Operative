const { Scenario, Option, UserResponse } = require('../models');
const { Op } = require('sequelize');

exports.getDailyScenario = async (req, res) => {
    try {
        console.log('[DEBUG] Fetching daily scenario...');
        console.log('[DEBUG] Server Time:', new Date().toISOString());
        console.log('[DEBUG] User ID:', req.user.id);

        // Logic: Get scenario where publishDate is today or latest before today
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
            console.log(`[DEBUG] Found active scenario: ID ${scenario.id}, Title: "${scenario.title}"`);
            console.log(`[DEBUG] Publish Date: ${scenario.publishDate}`);
        } else {
            console.log('[DEBUG] No active scenario found matching criteria (publishDate <= now).');
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
            console.log(`[DEBUG] User ${req.user.id} has already responded to scenario ${scenario.id}.`);
            return res.json({
                scenario,
                responded: true,
                selectedOptionId: response.optionId
            });
        }

        console.log(`[DEBUG] User ${req.user.id} has NOT responded to scenario ${scenario.id}.`);
        res.json({ scenario, responded: false });
    } catch (err) {
        console.error('[ERROR] in getDailyScenario:', err);
        res.status(500).json({ msg: 'Server error: ' + err.message });
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
