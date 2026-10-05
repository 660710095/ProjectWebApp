/**
 * SRT Ticket Booking Web Application - Backend Server
 * Built with Node.js standard library (Zero external dependencies)
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { users: [], bookings: [] };
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading db:', err);
    return { users: [], bookings: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // API Routes
  if (pathname.startsWith('/api/')) {
    try {
      // Health check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJson(res, 200, { status: 'ok', service: 'SRT Booking API', time: new Date().toISOString() });
      }

      // Auth: Register
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { username, email, password } = body;
        if (!username || !email || !password) {
          return sendJson(res, 400, { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const db = readDb();
        const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return sendJson(res, 409, { error: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        const newUser = {
          id: 'u-' + Date.now(),
          name: username,
          email: email.toLowerCase(),
          password,
          createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        writeDb(db);

        return sendJson(res, 201, {
          success: true,
          message: 'ลงทะเบียนสำเร็จ',
          user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });
      }

      // Auth: Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password } = body;
        if (!email || !password) {
          return sendJson(res, 400, { error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
        }

        const db = readDb();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
          return sendJson(res, 401, { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        return sendJson(res, 200, {
          success: true,
          message: 'เข้าสู่ระบบสำเร็จ',
          user: { id: user.id, name: user.name, email: user.email }
        });
      }

      // Bookings: List
      if (pathname === '/api/bookings' && method === 'GET') {
        const db = readDb();
        return sendJson(res, 200, { success: true, bookings: db.bookings || [] });
      }

      // Bookings: Create
      if (pathname === '/api/bookings' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { origin, destination, date, time, passengers, price } = body;
        if (!origin || !destination || !date || !time) {
          return sendJson(res, 400, { error: 'ข้อมูลการจองไม่ครบถ้วน' });
        }

        const db = readDb();
        const code = body.code || 'SRT' + Math.floor(10000 + Math.random() * 90000);
        const newBooking = {
          id: 'b-' + Date.now(),
          code,
          userName: body.userName || 'Guest',
          origin,
          destination,
          date,
          time,
          class: body.class || 'Economy Class',
          passengers: Number(passengers) || 1,
          price: price || '300 บาท',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };

        db.bookings.unshift(newBooking);
        writeDb(db);

        return sendJson(res, 201, { success: true, message: 'จองตั๋วสำเร็จ', booking: newBooking });
      }

      // Bookings: Cancel
      if (pathname === '/api/bookings/cancel' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { code } = body;
        if (!code) {
          return sendJson(res, 400, { error: 'กรุณาระบุรหัสตั๋ว' });
        }

        const db = readDb();
        const index = db.bookings.findIndex(b => b.code.toLowerCase() === code.trim().toLowerCase());
        if (index === -1) {
          return sendJson(res, 404, { error: `ไม่พบรหัสตั๋ว ${code} ในระบบ` });
        }

        const removed = db.bookings.splice(index, 1)[0];
        writeDb(db);

        return sendJson(res, 200, {
          success: true,
          message: `ยกเลิกตั๋วรหัส ${code} เรียบร้อยแล้ว`,
          cancelled: removed
        });
      }

      // Bookings: Clear
      if (pathname === '/api/bookings/clear' && method === 'POST') {
        const db = readDb();
        db.bookings = [];
        writeDb(db);
        return sendJson(res, 200, { success: true, message: 'ล้างประวัติการจองทั้งหมดแล้ว' });
      }

      return sendJson(res, 404, { error: 'API endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { error: 'Internal Server Error', message: err.message });
    }
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for HTML without extension
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        filePath = htmlPath;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>404 Not Found</h1><p>หน้าที่คุณค้นหาไม่มีอยู่ในระบบ</p><a href="/">กลับหน้าหลัก</a>');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Server Error reading file');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚆 SRT Web Application Server running at: http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available under http://localhost:${PORT}/api/`);
});
