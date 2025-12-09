const bcrypt = require('bcryptjs');
const { User } = require('./models');

(async () => {
    try {
        console.log("--- Debugging Login ---");
        const email = 'adminapi@example.com';
        const password = 'admin123';

        // 1. Fetch User
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User not found!");
            return;
        }
        console.log(`User found: ${user.email}`);

        // 2. Compare Password
        console.log(`Stored Hash: ${user.password}`);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password 'admin123' match result: ${isMatch}`);

        // 3. Test Fresh Hash
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(password, salt);
        console.log(`New Hash for 'admin123': ${newHash}`);
        const newMatch = await bcrypt.compare(password, newHash);
        console.log(`New Hash match result: ${newMatch}`);

        // 4. Update Password Forcefully
        if (!isMatch) {
            console.log("Updating password to 'admin123'...");
            user.password = newHash;
            await user.save();
            console.log("Password updated.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
})();
