const API_URL = 'http://localhost:5000/api';

async function test() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'jislam605@gmail.com',
                password: 'jahid123'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Create Scenario (Publish Now)
        console.log('Creating scenario...');
        const payload = {
            title: 'API Test Scenario',
            description: 'Created via test script',
            publishDate: new Date().toISOString(),
            options: [
                { text: 'A', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: 'T' },
                { text: 'B', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: 'T' },
                { text: 'C', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: 'T' },
                { text: 'D', complianceImpact: 0, efficiencyImpact: 0, satisfactionImpact: 0, personalityTag: 'T' }
            ]
        };

        const createRes = await fetch(`${API_URL}/admin/scenario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.status} ${await createRes.text()}`);
        const createData = await createRes.json();
        console.log('Scenario created:', createData.title);

        // 3. Verify List
        console.log('Fetching list...');
        const listRes = await fetch(`${API_URL}/admin/scenarios`, {
            headers: { 'x-auth-token': token }
        });

        if (!listRes.ok) throw new Error(`List failed: ${listRes.status}`);
        const listData = await listRes.json();

        const found = listData.find(s => s.title === 'API Test Scenario');
        if (found) {
            console.log('SUCCESS: Scenario found in list.');
        } else {
            console.error('FAILURE: Scenario NOT found in list.');
            console.log('List:', listData.map(s => s.title));
        }

    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

test();
