const { Scenario, Option, UserResponse } = require('../models');
const { Op } = require('sequelize');

exports.getDailyScenario = async (req, res) => {
    try {
        console.log('[DEBUG] Fetching user scenarios...');
        const userId = req.user.id;

        // 1. Get all IDs of scenarios the user has already responded to
        const userResponses = await UserResponse.findAll({
            where: { userId },
            attributes: ['scenarioId']
        });
        const respondedScenarioIds = userResponses.map(r => r.scenarioId);

        // 2. Fetch all active scenarios (publishDate <= now) that are NOT in the responded list
        const activeScenarios = await Scenario.findAll({
            where: {
                publishDate: {
                    [Op.lte]: new Date()
                },
                id: {
                    [Op.notIn]: respondedScenarioIds.length > 0 ? respondedScenarioIds : [-1] // -1 to avoid empty array syntax error if Op.notIn expects valid list
                }
            },
            order: [['publishDate', 'DESC']],
            include: [{
                model: Option,
                as: 'options',
                attributes: ['id', 'text']
            }]
        });

        console.log(`[DEBUG] Found ${activeScenarios.length} active scenarios for user ${userId}`);

        // Return the list
        // Note: responded is effectively 'false' for all of these since we filtered them out.
        res.json({
            scenarios: activeScenarios,
            count: activeScenarios.length
        });

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
