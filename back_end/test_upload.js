const fs = require('fs');
const path = require('path');

async function testUpload() {
  // First login to get token
  const loginRes = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@shopthoitrang.com', password: 'Admin@123456' })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginData.message);
  const token = loginData.accessToken;

  // Create a small test image (1x1 pixel PNG)
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  // Build multipart form data manually
  const boundary = '----TestBoundary' + Date.now();
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`),
    pngBuffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  console.log('Uploading test image to S3...');
  const uploadRes = await fetch('http://localhost:3000/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: body
  });

  console.log('Upload status:', uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log('Upload response:', JSON.stringify(uploadData, null, 2));
}

testUpload().catch(e => console.error('Error:', e));
