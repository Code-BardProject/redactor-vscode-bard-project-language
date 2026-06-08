#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flags = {
  web: false,
  android: false,
  ios: false,
  linux: false,
  windows: false,
  macos: false,
  server: false,
  test: false,
  all: false
};

args.forEach(arg => {
  switch (arg) {
    case '--web': case '-o': flags.web = true; break;
    case '--android': case '-a': flags.android = true; break;
    case '--ios': case '-i': flags.ios = true; break;
    case '--linux': case '-l': flags.linux = true; break;
    case '--windows': case '-w': flags.windows = true; break;
    case '--macos': case '-m': flags.macos = true; break;
    case '--server': case '-s': flags.server = true; break;
    case '--test': case '-t': flags.test = true; break;
    case '--all': flags.all = true; break;
    default: break;
  }
});

const useAll = Object.values(flags).every(value => value === false);
if (useAll) {
  flags.all = true;
}

if (flags.test) {
  flags.server = true;
}

const root = process.cwd();
function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}
function writeFile(relativePath, content) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const projectName = path.basename(root);

function log(msg) {
  console.log(msg);
}

if (flags.all || flags.web) {
  log('Генерация web...');
  ensureDir('web');
  writeFile('web/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app">
    <h1>${projectName} Web</h1>
    <p>Generated static web page from Bard Project.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>
`);
  writeFile('web/styles.css', `.app {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: Arial, sans-serif;
  padding: 32px;
}

h1 {
  font-size: 36px;
  margin: 0 0 10px;
}

p {
  font-size: 18px;
  opacity: 0.9;
}
`);
  writeFile('web/script.js', `console.log('Welcome to ${projectName} Web');
`);
  writeFile('web/package.json', `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "npx serve ."
  },
  "dependencies": {
    "serve": "^14.0.1"
  }
}
`);
}

function createPlatform(name) {
  log(`Генерация ${name}...`);
  ensureDir(`${name}`);
  writeFile(`${name}/App.js`, `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${projectName} ${name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);
}

if (flags.all || flags.android) createPlatform('android');
if (flags.all || flags.ios) createPlatform('ios');
if (flags.all || flags.linux) createPlatform('linux');
if (flags.all || flags.windows) createPlatform('windows');
if (flags.all || flags.macos) createPlatform('macos');

if (flags.all || flags.server) {
  log('Генерация сервера...');
  ensureDir('server/routes');
  ensureDir('server/models');
  ensureDir('server/public');
  
  writeFile('server/server.js', `const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Попытка подключить QRCode и nodemailer если установлены
let QRCode;
try {
  QRCode = require('qrcode');
} catch (e) {
  console.warn('⚠ QRCode не установлен. Установите: npm install qrcode');
}

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('⚠ nodemailer не установлен. Установите: npm install nodemailer');
}

let port = process.env.PORT || 3000;
const MAX_ATTEMPTS = 5;
let attempts = 0;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты API
app.use('/api', require('./routes'));

app.post('/api/send-email', async (req, res) => {
  if (!nodemailer) {
    return res.status(500).json({ error: 'nodemailer не установлен. Установите npm install nodemailer' });
  }

  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Поля to, subject и text обязательны' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to,
      subject,
      text
    });
    res.json({ status: 'ok', message: 'Письмо отправлено', info });
  } catch (err) {
    res.status(500).json({ error: 'Не удалось отправить письмо', message: err.message });
  }
});

// Главная страница
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(\`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${projectName}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; margin: 0; }
          .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
          h1 { color: #333; margin: 0 0 20px 0; }
          p { color: #666; }
          a { color: #667eea; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 ${projectName}</h1>
          <p>Добро пожаловать! Сервер успешно запущен.</p>
          <p><a href="/api/greet?user=1">👋 Загрузить приветствие</a></p>
          <p><a href="/api/status">🔄 Проверить статус</a></p>
        </div>
      </body>
      </html>
    \`);
  }
});

// Генерирование QR-кода для подключения
app.get('/api/qrcode', async (req, res) => {
  try {
    if (!QRCode) {
      return res.status(400).json({ error: 'QRCode модуль не установлен' });
    }
    const protocol = req.protocol;
    const host = req.hostname;
    const url = \`\${protocol}://\${host}:\${port}\`;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (err) {
    res.status(500).json({ error: 'QR код не сгенерирован: ' + err.message });
  }
});

// Проверка статуса
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: port,
    project: '${projectName}'
  });
});

// Генерирование структуры проекта
app.get('/api/generate', (req, res) => {
  try {
    const projectRoot = path.dirname(__dirname);
    const foldersToCreate = [
      'linux', 'ios', 'android', 'macos', 'windows',
      'web', 'hooks', 'locales', 'components', 'assets'
    ];
    
    foldersToCreate.forEach(folder => {
      const folderPath = path.join(projectRoot, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
      }
    });
    
    res.json({ 
      status: 'ok', 
      message: 'Структура проекта обновлена успешно',
      path: projectRoot
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Ошибка генерации: ' + error.message 
    });
  }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    path: req.path,
    availableRoutes: [
      '/',
      '/api/greet?user=1',
      '/api/status',
      '/api/qrcode',
      '/api/generate',
      '/api/send-email'
    ]
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера', message: err.message });
});

// Запуск сервера с обработкой EADDRINUSE
function startServer() {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(\`\\n✅ Сервер запущен: http://localhost:\${port}\`);
    console.log(\`✅ API доступна: http://localhost:\${port}/api/greet?user=1\`);
    console.log(\`✅ Статус: http://localhost:\${port}/api/status\`);
    console.log(\`✅ QR-код: http://localhost:\${port}/api/qrcode\\n\`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      attempts++;
      if (attempts < MAX_ATTEMPTS) {
        console.warn(\`⚠ Порт \${port} занят. Пытаюсь порт \${port + 1}...\`);
        port++;
        setTimeout(startServer, 1000);
      } else {
        console.error(\`❌ Не удалось найти свободный порт после \${MAX_ATTEMPTS} попыток\`);
        process.exit(1);
      }
    } else if (err.code === 'EACCES') {
      console.error(\`❌ Нет прав доступа для порта \${port}\`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

startServer();

module.exports = app;
`);

  writeFile('server/routes/index.js', `const express = require('express');
const router = express.Router();

router.get('/greet', (req, res) => {
  const user = parseInt(req.query.user) || 1;
  const count = Math.min(10, Math.max(1, user));
  const users = [];
  
  for (let i = 1; i <= count; i++) {
    users.push({ 
      id: i, 
      name: 'Пользователь ' + i,
      message: 'Привет, ' + i + '!'
    });
  }
  
  res.json({ 
    message: 'Добро пожаловать в приложение!',
    users: users,
    total: users.length,
    timestamp: new Date().toISOString()
  });
});

router.get('/users', (req, res) => {
  res.json({
    users: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: 'Пользователь ' + (i + 1) }))
  });
});

module.exports = router;
`);

  writeFile('server/public/index.html', `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} - Добро пожаловать</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      padding: 40px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
    .subtitle { color: #999; font-size: 14px; margin-bottom: 20px; }
    p { color: #666; margin-bottom: 20px; line-height: 1.6; }
    .qr-section {
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    #qrcode {
      display: inline-block;
      padding: 10px;
      background: white;
      border-radius: 5px;
    }
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
      margin: 20px 0;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: #667eea;
      color: white;
    }
    .btn-primary:hover { background: #5568d3; }
    .btn-secondary {
      background: #e9ecef;
      color: #333;
    }
    .btn-secondary:hover { background: #dee2e6; }
    .status { 
      margin-top: 20px;
      padding: 10px;
      background: #d4edda;
      color: #155724;
      border-radius: 5px;
      font-size: 14px;
    }
    .error { background: #f8d7da; color: #721c24; }
    .success { background: #d4edda; color: #155724; }
    ul { text-align: left; display: inline-block; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 ${projectName}</h1>
    <p class="subtitle">Мощный сервер Bard Project</p>
    <p>Добро пожаловать! Ваше приложение успешно запущено.</p>
    
    <div class="qr-section">
      <h3>📱 Сканируйте QR-код</h3>
      <p style="font-size: 12px; color: #999;">Для подключения других устройств</p>
      <div id="qrcode" style="margin: 15px 0;"></div>
      <small id="qr-url" style="display: block; color: #666; word-break: break-all; margin-top: 10px;"></small>
    </div>

    <div class="button-group">
      <button class="btn-primary" onclick="checkStatus()">🔄 Проверить статус</button>
      <button class="btn-secondary" onclick="loadGreeting()">👋 Загрузить приветствие</button>
      <button class="btn-secondary" onclick="loadUsers()">👥 Загрузить пользователей</button>
    </div>

    <div id="status" class="status" style="display: none;"></div>
    <div id="greeting" style="margin-top: 15px; display: none; padding: 15px; background: #cfe2ff; color: #084298; border-radius: 5px;"></div>
    <div id="users" style="margin-top: 15px; display: none; padding: 15px; background: #fff3cd; color: #664d03; border-radius: 5px;"></div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script>
    const qrcodeContainer = document.getElementById('qrcode');
    const qrUrlElement = document.getElementById('qr-url');
    const statusDiv = document.getElementById('status');
    const greetingDiv = document.getElementById('greeting');
    const usersDiv = document.getElementById('users');

    function showError(element, message) {
      element.textContent = '❌ ' + message;
      element.className = 'status error';
      element.style.display = 'block';
    }

    function showSuccess(element, html) {
      element.innerHTML = html;
      element.className = 'status success';
      element.style.display = 'block';
    }

    // Загрузить QR-код при загрузке страницы
    window.onload = async function() {
      try {
        const res = await fetch('/api/qrcode');
        const data = await res.json();
        
        if (data.qrCode) {
          qrUrlElement.textContent = data.url;
          qrcodeContainer.innerHTML = '';
          new QRCode(qrcodeContainer, { text: data.url, width: 200, height: 200 });
        } else {
          qrUrlElement.textContent = 'QRCode модуль не установлен';
        }
      } catch (err) {
        qrUrlElement.textContent = 'Ошибка: ' + err.message;
      }
    };

    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        showSuccess(statusDiv, 
          '✓ Сервер в сети<br>' +
          'Время: ' + new Date(data.timestamp).toLocaleString('ru-RU') + '<br>' +
          'Работает: ' + Math.round(data.uptime) + 'сек<br>' +
          'Порт: ' + data.port
        );
      } catch (err) {
        showError(statusDiv, err.message);
      }
    }

    async function loadGreeting() {
      try {
        const res = await fetch('/api/greet?user=5');
        const data = await res.json();
        let html = '<strong>' + data.message + '</strong><br>';
        html += '<small>Всего пользователей: ' + data.total + '</small><br>';
        data.users.forEach(u => {
          html += '<div>' + u.name + ': ' + u.message + '</div>';
        });
        greetingDiv.innerHTML = html;
        greetingDiv.style.display = 'block';
      } catch (err) {
        showError(greetingDiv, err.message);
      }
    }

    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        let html = '<strong>Список пользователей:</strong><ul>';
        data.users.forEach(u => {
          html += '<li>ID: ' + u.id + ' - ' + u.name + '</li>';
        });
        html += '</ul>';
        usersDiv.innerHTML = html;
        usersDiv.style.display = 'block';
      } catch (err) {
        showError(usersDiv, err.message);
      }
    }
  </script>
</body>
</html>
`);

  writeFile('server/models/exampleModel.js', `// Определите модель Mongoose здесь
module.exports = {};
`);

  writeFile('server/package.json', `{
  "name": "${projectName}-server",
  "version": "1.0.0",
  "description": "Node.js Express сервер для ${projectName}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "generate": "npm run generate:all",
    "generate:all": "echo 'Generating all platforms...' && npm start",
    "generate:web": "echo '🌐 Building web...'",
    "generate:android": "echo '📱 Building Android with React Native...'",
    "generate:ios": "echo '🍎 Building iOS with React Native...'",
    "generate:linux": "echo '🐧 Building Linux...'",
    "generate:windows": "echo '🪟 Building Windows...'",
    "generate:macos": "echo '🖥️ Building macOS...'",
    "generate:server": "echo '🖧 Node.js server ready' && npm start",
    "generate:test": "echo '🧪 Testing API...'",
    "test": "echo 'Error: no test specified' && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^7.5.0",
    "nodemailer": "^6.9.6",
    "qrcode": "^1.5.3",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "typescript": "^5.1.0",
    "@types/node": "^20.0.0"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
`);
}

if (flags.test) {
  log('Генерация тестового маршрута greet для 1-10 пользователей...');
  ensureDir('server/routes');
  writeFile('server/routes/greet.js', `module.exports = (app) => {
  app.get('/api/greet', (req, res) => {
    const user = req.query.user || '1';
    res.json({ message: \`Привет, пользователь \${user}! Добро пожаловать в приложение!\` });
  });
};
`);
  const serverFile = path.join(root, 'server/server.js');
  if (fs.existsSync(serverFile)) {
    let content = fs.readFileSync(serverFile, 'utf8');
    if (!content.includes("require('./routes/greet')")) {
      content = content.replace("app.use('/api', require('./routes'));", `app.use('/api', require('./routes'));
const greetRoute = require('./routes/greet');
greetRoute(app);`);
      fs.writeFileSync(serverFile, content, 'utf8');
    }
  }
}

log('✅ Готово. Все файлы сгенерированы успешно!');
