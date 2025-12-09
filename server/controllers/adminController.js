const { Scenario, Option, User, UserResponse, sequelize } = require('../models');

exports.createScenario = async (req, res) => {
    const { title, description, publishDate, options } = req.body;

    try {
        const scenario = await Scenario.create({
            title,
            description,
            publishDate
        });

        if (options && options.length > 0) {
            const optionsData = options.map(opt => ({
                ...opt,
                scenarioId: scenario.id
            }));
            await Option.bulkCreate(optionsData);
        }

        // Refresh to get options
        const createdScenario = await Scenario.findByPk(scenario.id, { include: ['options'] });

        res.json(createdScenario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllScenarios = async (req, res) => {
    try {
        const scenarios = await Scenario.findAll({
            order: [['publishDate', 'ASC']],
            include: ['options']
        });
        res.json(scenarios);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.count({ where: { role: 'user' } });
        const scenarioCount = await Scenario.count();
        const responseCount = await UserResponse.count();

        // Leaderboard: Top 5 users by total score (sum of 3 scores)
        // Note: Simple addition in JS after fetch or using literal if DB supports it.
        // For SQLite/Sequelize, we can order by literal.
        const leaderboard = await User.findAll({
            where: { role: 'user' },
            attributes: [
                'name',
                'company',
                'jobTitle',
                'complianceScore',
                'efficiencyScore',
                'satisfactionScore',
                [sequelize.literal('(complianceScore + efficiencyScore + satisfactionScore)'), 'totalScore']
            ],
            order: [[sequelize.literal('totalScore'), 'DESC']],
            limit: 5
        });

        res.json({ userCount, scenarioCount, responseCount, leaderboard });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateScenario = async (req, res) => {
    const { id } = req.params;
    const { title, description, publishDate, options } = req.body;

    try {
        let scenario = await Scenario.findByPk(id, { include: ['options'] });

        if (!scenario) {
            return res.status(404).json({ msg: 'Scenario not found' });
        }

        // Update Scenario details
        scenario.title = title || scenario.title;
        scenario.description = description || scenario.description;
        scenario.publishDate = publishDate || scenario.publishDate;
        await scenario.save();

        // Update Options if provided
        if (options && Array.isArray(options)) {
            const existingOptions = scenario.options;
            const incomingOptionIds = options.filter(o => o.id).map(o => o.id);

            // 1. Update existing options
            for (const opt of options) {
                if (opt.id) {
                    const optionToUpdate = existingOptions.find(eo => eo.id === opt.id);
                    if (optionToUpdate) {
                        await optionToUpdate.update({
                            text: opt.text,
                            complianceImpact: opt.complianceImpact,
                            efficiencyImpact: opt.efficiencyImpact,
                            satisfactionImpact: opt.satisfactionImpact,
                            personalityTag: opt.personalityTag
                        });
                    }
                } else {
                    // 2. Create new options
                    await Option.create({
                        ...opt,
                        scenarioId: id
                    });
                }
            }

            // 3. Delete removed options (Present in DB but not in incoming list)
            // Only perform delete if the UI is expected to send the FULL list.
            // Assuming YES for a full edit modal.
            for (const existingOpt of existingOptions) {
                if (!incomingOptionIds.includes(existingOpt.id)) {
                    await existingOpt.destroy();
                }
            }
        }

        // Refetch to return full updated object
        const updatedScenario = await Scenario.findByPk(id, { include: ['options'] });
        res.json(updatedScenario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteScenario = async (req, res) => {
    const { id } = req.params;

    try {
        const scenario = await Scenario.findByPk(id);

        if (!scenario) {
            return res.status(404).json({ msg: 'Scenario not found' });
        }

        // Delete associated options first (if constraints don't cascade, but standard Sequelize should if config matches, safe to do manual or trust cascade)
        // Here assuming constraint cascade or manual handle. Let's delete options.
        await Option.destroy({ where: { scenarioId: id } });
        await scenario.destroy();

        res.json({ msg: 'Scenario removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
