const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    const { name, email, password, jobTitle, company } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            jobTitle,
            company
        });

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`[LOGIN FAIL] User not found: ${email}`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[LOGIN DEBUG] Email: ${email}, Match: ${isMatch}`);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await require('../models').UserResponse.findAll({
            where: { userId: req.user.id },
            include: [
                { model: require('../models').Scenario, as: 'scenario', attributes: ['title', 'publishDate'] },
                { model: require('../models').Option, as: 'option', attributes: ['text', 'complianceImpact', 'efficiencyImpact', 'satisfactionImpact'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const { sequelize } = require('../models');
        const leaderboard = await User.findAll({
            where: { role: 'user' },
            attributes: [
                'name',
                'company',
                [sequelize.literal('(complianceScore + efficiencyScore + satisfactionScore)'), 'totalScore']
            ],
            order: [[sequelize.literal('totalScore'), 'DESC']],
            limit: 10
        });
        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    const { name, jobTitle, company, avatar } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.name = name || user.name;
        user.jobTitle = jobTitle || user.jobTitle;
        user.company = company || user.company;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            jobTitle: user.jobTitle,
            company: user.company,
            avatar: user.avatar
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
