const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: process.env.PORT || 3001,
  path: '/health',
  method: 'GET',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(`Health Check Response Code: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('Health Check Failed:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('Health Check Timeout');
  request.destroy();
  process.exit(1);
});

request.end();
