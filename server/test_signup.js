const API_URL = 'http://localhost:5000/api';

async function testSignup() {
    try {
        console.log('Attempting signup...');
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'New User',
                email: `newuser_${Date.now()}@example.com`,
                password: 'password123',
                jobTitle: 'Tester',
                company: 'Test Corp'
            })
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Signup failed: ${res.status} ${txt}`);
        }

        const data = await res.json();
        console.log('Signup successful. Token:', data.token);

    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

testSignup();
