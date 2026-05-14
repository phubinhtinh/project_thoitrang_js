async function testLogin() {
  const url = 'https://thoitranghue.onrender.com/auth/login';
  const payload = {
    email: 'admin@shopthoitrang.com',
    password: 'Admin@123456'
  };

  console.log('Sending request to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('Status code:', res.status);
    const body = await res.json();
    console.log('Response body:', JSON.stringify(body, null, 2));
  } catch (e) {
    console.error('Network error:', e);
  }
}

testLogin();
