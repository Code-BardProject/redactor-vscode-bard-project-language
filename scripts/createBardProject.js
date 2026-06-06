#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) {
  console.error('Usage: node scripts/createBardProject.js <ProjectName>');
  process.exit(1);
}

const root = path.resolve(process.cwd(), name);
if (fs.existsSync(root)) {
  console.error(`Folder already exists: ${root}`);
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath, content) {
  const filePath = path.join(root, relativePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function ensureGitkeep(relativePath) {
  writeFile(path.join(relativePath, '.gitkeep'), '');
}

console.log(`Создаю проект ${name}...`);

const folders = [
  'generator/js',
  'generator/css',
  'mobile-tab/components',
  'mobile-tab/navigation',
  'assets',
  'components',
  'hooks',
  'locales',
  '.expo',
  'app',
  'android',
  'ios',
  'linux',
  'windows',
  'macos',
  'web/src/app',
  'server/routes',
  'server/models',
  'shared'
];

folders.forEach(folder => ensureDir(path.join(root, folder)));

// Копирование ассетов из шаблона расширения в новый проект
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const items = fs.readdirSync(src);
    for (const it of items) {
      copyRecursive(path.join(src, it), path.join(dest, it));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  const extAssets = path.join(__dirname, '..', 'assets');
  const targetAssets = path.join(root, 'assets');
  if (fs.existsSync(extAssets)) {
    copyRecursive(extAssets, targetAssets);
    console.log('Скопированы ассеты в проект (assets/icons, assets/images)');
  }
} catch (err) {
  console.warn('Не удалось скопировать ассеты:', err.message);
}

writeFile('generator/index.html', `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} Generator</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="app">
    <h1>${name} Generator</h1>
    <p id="status">Запуск генератора проекта...</p>
    <button id="generateButton">Перегенерировать проект</button>
  </div>
  <script src="js/script.js"></script>
</body>
</html>
`);

writeFile('generator/js/script.js', `async function runGenerate() {
  const status = document.getElementById('status');
  const button = document.getElementById('generateButton');
  button.disabled = true;
  status.textContent = 'Генерация структуры проекта...';

  try {
    const response = await fetch('/api/generate');
    const result = await response.json();
    if (response.ok) {
      status.textContent = result.message || 'Структура проекта сгенерирована.';
    } else {
      status.textContent = 'Ошибка генерации: ' + (result.message || response.statusText);
    }
  } catch (error) {
    status.textContent = 'Ошибка генерации: ' + error.message;
  } finally {
    button.disabled = false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateButton').addEventListener('click', runGenerate);
  runGenerate();
});
`);
writeFile('generator/css/style.css', `.app {
  font-family: Arial, sans-serif;
  padding: 24px;
  max-width: 760px;
  margin: 0 auto;
}
button {
  margin-top: 16px;
  padding: 12px 20px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: default;
}
`);

writeFile('mobile-tab/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VisualCard from './components/VisualCard';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} Mobile App</Text>
      <VisualCard title="Добро пожаловать" description="Автогенерированный компонент" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 }
});
`);

writeFile('mobile-tab/components/VisualCard.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VisualCard({ title, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  description: { color: '#555' }
});
`);

writeFile('mobile-tab/navigation/AppNavigator.js', `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Здесь будет React Navigation */}
    </NavigationContainer>
  );
}
`);

writeFile('assets/.gitkeep', '');
writeFile('components/.gitkeep', '');
writeFile('hooks/useExample.js', `export function useExample() {
  return { message: 'Hello from hooks' };
}
`);
writeFile('locales/i18n.ts', `export const i18n = {
  en: require('./en').default,
  ru: require('./ru').default,
  hy: require('./hy').default,
};
`);
writeFile('locales/en.ts', `export default {
  greeting: 'Welcome to ${name}',
};
`);
writeFile('locales/ru.ts', `export default {
  greeting: 'Добро пожаловать в ${name}',
};
`);
writeFile('locales/hy.ts', `export default {
  greeting: 'Բարի գալուստ ${name}',
};
`);
writeFile('.expo/.gitkeep', '');
writeFile('app/.gitkeep', '');
writeFile('android/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AndroidApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} Android App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);
writeFile('ios/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function IOSApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} iOS App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);
writeFile('linux/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LinuxApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} Linux App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);
writeFile('windows/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WindowsApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} Windows App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);
writeFile('macos/App.js', `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MacOSApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name} macOS App</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 24 } });
`);

writeFile('web/src/app/app.component.ts', `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>${name} Web</h1>',
  styles: ['h1 { font-family: Arial, sans-serif; }']
})
export class AppComponent {}
`);
writeFile('web/angular.json', `{
  "$schema": "https://angular.io/schema/angular-json",
  "version": 1,
  "projects": {
    "${name.toLowerCase()}": {
      "projectType": "application"
    }
  }
}
`);

writeFile('server/server.js', `const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
let port = process.env.PORT || 3000;

let QRCode;
try {
  QRCode = require('qrcode');
} catch (err) {
  console.warn('⚠ QRCode не установлен. Установите npm install qrcode');
}

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  console.warn('⚠ nodemailer не установлен. Установите npm install nodemailer');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'generator')));
app.use('/api', require('./routes'));

app.get('/api/generate', (req, res) => {
  const generatorPage = path.join(__dirname, '..', 'generator', 'index.html');
  if (!fs.existsSync(generatorPage)) {
    return res.status(404).json({ status: 'error', message: 'generator/index.html не найден' });
  }
  res.json({ status: 'ok', message: 'Страница генератора доступна и готова.' });
});

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

app.get('/', (req, res) => {
  const generatorPage = path.join(__dirname, '..', 'generator', 'index.html');
  if (fs.existsSync(generatorPage)) {
    return res.sendFile(generatorPage);
  }

  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(404).send('Файл генератора не найден');
});

app.get('/api/qrcode', async (req, res) => {
  if (!QRCode) {
    return res.status(400).json({ error: 'QRCode модуль не установлен. Установите npm install qrcode' });
  }

  try {
    const url = 'http://localhost:' + port;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode, url });
  } catch (err) {
    res.status(500).json({ error: 'Не удалось создать QR-код', message: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.path,
    availableRoutes: ['/', '/api/greet?user=1', '/api/users', '/api/status', '/api/qrcode', '/api/send-email']
  });
});

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
});
`);

writeFile('server/routes/index.js', `const express = require('express');
const router = express.Router();

router.get('/greet', (req, res) => {
  const user = parseInt(req.query.user, 10) || 1;
  const count = Math.min(10, Math.max(1, user));
  const users = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: 'Пользователь ' + (i + 1),
    message: 'Привет, ' + (i + 1) + '!',
  }));

  res.json({
    message: 'Добро пожаловать в приложение!',
    users,
    total: users.length,
    timestamp: new Date().toISOString(),
  });
});

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/users', (req, res) => {
  res.json({
    users: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: 'Пользователь ' + (i + 1),
    })),
  });
});

module.exports = router;
`);

writeFile('server/models/exampleModel.js', `// Определите Mongoose-схемы здесь
module.exports = {};`);
writeFile('shared/index.ts', `export const shared = {
  appName: '${name}',
};
`);
writeFile('.env.example', `PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/${name.toLowerCase()}?retryWrites=true&w=majority
`);
writeFile('package.json', `{
  "name": "${name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "qrcode": "^1.5.3",
    "nodemailer": "^6.9.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
`);
writeFile('package-lock.json', `{
  "name": "${name.toLowerCase().replace(/\s+/g, '-')}",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {}
}
`);
writeFile('.gitignore', `node_modules
.env
.DS_Store
`);
writeFile('README.md', `# ${name}

Автогенерированный проект ${name}.

## Запуск сервера

	npm install
	npm start

## Пример отправки почты

Сервер поддерживает POST-запрос на \`/api/send-email\`.
Требуются поля JSON: \`to\`, \`subject\`, \`text\`.

Можно задать параметры SMTP через \`.env\`:

	SMTP_HOST=smtp.example.com
	SMTP_PORT=587
	SMTP_USER=user@example.com
	SMTP_PASS=secret
	SMTP_FROM=no-reply@example.com
`);

console.log(`Проект ${name} создан в ${root}`);

// Попытка автоматически выполнить npm install для создания node_modules
try {
  const { spawnSync } = require('child_process');
  console.log('Запускаю npm install в проекте (это может занять время)...');
  const res = spawnSync('npm', ['install'], { cwd: root, stdio: 'inherit', shell: true });
  if (res.status === 0) {
    console.log('✅ Завершен npm install — node_modules созданы.');
  } else {
    console.warn('npm install завершился с кодом', res.status, '- выполните вручную: cd', root, '&& npm install');
  }
} catch (err) {
  console.warn('Автоматический npm install не выполнен:', err.message);
  console.log('Выполните вручную: cd', root, '&& npm install');
}
