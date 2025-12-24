const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const host = 'localhost';
    const port = 3001;

    // Register
    let body = JSON.stringify({ nama: 'tempadmin', username: 'tempadmin@example.com', password: 'P@ssw0rd123' });
    let res = await request({ hostname: host, port, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
    console.log('REGISTER', res.statusCode, res.body);

    // Login
    body = JSON.stringify({ username: 'tempadmin@example.com', password: 'P@ssw0rd123' });
    res = await request({ hostname: host, port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
    console.log('LOGIN', res.statusCode, res.body);
    const token = JSON.parse(res.body).token;
    if (!token) throw new Error('No token returned');

    // Create obat
    const obat = { nama_obat: 'Test Obat', deskripsi: 'Deskripsi test', stok: 10, harga: 12345, gambar_url: '/uploads/resep/test_resep.jpg' };
    body = JSON.stringify(obat);
    res = await request({ hostname: host, port, path: '/api/obat', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + token } }, body);
    console.log('CREATE_OBAT', res.statusCode, res.body);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
