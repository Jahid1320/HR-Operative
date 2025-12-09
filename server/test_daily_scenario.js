const testScenario = async () => {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'newuser_1765136602071@example.com',
                password: 'user123'
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Get Today's Scenario
        const scenarioRes = await fetch('http://localhost:5000/api/scenario/today', {
            method: 'GET',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });

        const scenarioData = await scenarioRes.json();
        console.log('Scenario Response Status:', scenarioRes.status);
        console.log('Scenario Data:', JSON.stringify(scenarioData, null, 2));

    } catch (err) {
        console.error('Error:', err.message);
    }
};

testScenario();
