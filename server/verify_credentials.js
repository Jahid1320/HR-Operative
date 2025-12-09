
const verify = async () => {
    const users = [
        { email: 'jislam605@gmail.com', password: 'jahid123', label: 'Admin' },
        { email: 'islamj64@gmail.com', password: 'islam123', label: 'User (Islam)' }
    ];

    for (const u of users) {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: u.email,
                    password: u.password
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.token) {
                    console.log(`[PASS] ${u.label} login successful. Token: ${data.token.substring(0, 10)}...`);
                } else {
                    console.log(`[FAIL] ${u.label} login failed: No token received.`);
                }
            } else {
                const txt = await res.text();
                console.log(`[FAIL] ${u.label} login failed: ${res.status} ${txt}`);
            }
        } catch (err) {
            console.log(`[FAIL] ${u.label} login failed: ${err.message}`);
        }
    }
};

verify();
