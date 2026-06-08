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
  'web',
  'web/components',
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
  <title>${name} - Генератор проекта</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>🚀 ${name}</h1>
      <p class="subtitle">Генератор React Native + Node.js Backend</p>
    </header>

    <main class="main">
      <section class="architecture">
        <h2>📋 Архитектура проекта</h2>
        <p>Ваш проект автоматически генерируется следующим образом:</p>
        <div class="flow-chart">
          <div class="flow-item">
            <div class="flow-icon">1️⃣</div>
            <div class="flow-text"><strong>Инициализация</strong><br>Загрузка shared/index.ts с конфигом</div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-item">
            <div class="flow-icon">2️⃣</div>
            <div class="flow-text"><strong>App.js</strong><br>Подключение всех библиотек и импортов</div>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-item">
            <div class="flow-icon">3️⃣</div>
            <div class="flow-text"><strong>Генерация</strong><br>Создание папок и файлов</div>
          </div>
        </div>
      </section>

      <section class="structure">
        <h2>📁 Структура файлов и папок</h2>
        <div id="status" class="status-box">⏳ Инициализация...</div>
        <div id="fileList" class="file-tree"></div>
        <button id="generateButton" class="btn-generate">🔄 Перегенерировать структуру</button>
      </section>

      <section class="explanation">
        <h2>ℹ️ Как это работает</h2>
        <div class="info-box">
          <p><strong>shared/index.ts:</strong> Хранит конфиг проекта, версии, и общие константы</p>
          <p><strong>app.js:</strong> Главная точка входа, импортирует все библиотеки и подключает модули</p>
          <p><strong>generator/:</strong> Интерфейс для визуальной генерации и управления проектом</p>
          <p><strong>auth/:</strong> Firebase + MongoDB Atlas интеграция для авторизации</p>
          <p><strong>server/:</strong> Node.js backend с Express, MongoDB Mongoose моделями</p>
          <p><strong>react-native/ (если есть):</strong> React Native приложение для мобильных платформ</p>
        </div>
      </section>

      <section class="quick-start">
        <h2>🚀 Быстрый старт</h2>
        <div class="commands">
          <p><code>npm install</code> - установка зависимостей</p>
          <p><code>npm start</code> - запуск сервера (порт 3000)</p>
          <p><code>npm run generate</code> - генерация всех платформ</p>
          <p><code>npm run generate:android</code> - генерация Android</p>
          <p><code>npm run generate:ios</code> - генерация iOS</p>
          <p><code>npm run generate:server</code> - запуск backend сервера</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>Bard Project v1.0.0 | Созданы все необходимые файлы и папки</p>
    </footer>
  </div>
  <script src="js/script.js"></script>
</body>
</html>
`);

writeFile('generator/js/script.js', `const PROJECT_STRUCTURE = {
  folders: [
    { name: '.expo', desc: 'Expo конфигурация' },
    { name: 'app', desc: 'App.js и главные компоненты' },
    { name: 'auth', desc: 'Firebase Auth, MongoDB интеграция' },
    { name: 'assets', desc: 'Изображения, иконки, фонты' },
    { name: 'components', desc: 'Переиспользуемые компоненты' },
    { name: 'hooks', desc: 'Custom React hooks' },
    { name: 'ios', desc: 'iOS (React Native)' },
    { name: 'android', desc: 'Android (React Native)' },
    { name: 'linux', desc: 'Linux' },
    { name: 'macos', desc: 'macOS' },
    { name: 'windows', desc: 'Windows' },
    { name: 'locales', desc: 'Локализация (i18n)' },
    { name: 'mobile-tab', desc: 'Мобильные компоненты с табами' },
    { name: 'server', desc: 'Node.js + Express backend' },
    { name: 'shared', desc: 'Общий конфиг и утилиты' },
    { name: 'web', desc: 'Web приложение' }
  ],
  files: [
    { name: '.env.example', desc: 'Шаблон переменных окружения' },
    { name: '.env', desc: 'Переменные окружения (локальные)' },
    { name: '.gitignore', desc: 'Git исключения' },
    { name: 'app.json', desc: 'Expo/React Native конфиг' },
    { name: 'babel.config.js', desc: 'Babel конфигурация' },
    { name: 'metro.config.js', desc: 'Metro bundler конфиг' },
    { name: 'tsconfig.json', desc: 'TypeScript конфигурация' },
    { name: 'package.json', desc: 'Зависимости и скрипты' },
    { name: 'package-lock.json', desc: 'Lockfile для npm' },
    { name: 'Firebase-MongoDB.csv', desc: 'Конфиг Firebase и MongoDB' },
    { name: 'README.md', desc: 'Документация проекта' }
  ]
};

async function runGenerate() {
  const status = document.getElementById('status');
  const button = document.getElementById('generateButton');
  const list = document.getElementById('fileList');
  
  button.disabled = true;
  status.textContent = '⏳ Генерация структуры проекта...';
  if (list) list.innerHTML = '';

  try {
    const response = await fetch('/api/generate');
    const result = await response.json();
    
    if (response.ok) {
      status.textContent = '✅ Структура проекта успешно сгенерирована';
      status.className = 'status-box success';
      
      if (list) {
        let html = '<div class="tree"><strong>📁 Папки:</strong>';
        PROJECT_STRUCTURE.folders.forEach(folder => {
          html += '<div class="tree-item"><span class="folder-icon">📂</span> <strong>' + folder.name + '/' + '</strong> <span class="desc">- ' + folder.desc + '</span></div>';
        });
        html += '</div><div class="tree"><strong>📄 Файлы:</strong>';
        PROJECT_STRUCTURE.files.forEach(file => {
          html += '<div class="tree-item"><span class="file-icon">📝</span> <strong>' + file.name + '</strong> <span class="desc">- ' + file.desc + '</span></div>';
        });
        html += '</div>';
        list.innerHTML = html;
      }
    } else {
      status.textContent = '❌ Ошибка: ' + (result.message || response.statusText);
      status.className = 'status-box error';
    }
  } catch (error) {
    status.textContent = '❌ Ошибка генерации: ' + error.message;
    status.className = 'status-box error';
  } finally {
    button.disabled = false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateButton').addEventListener('click', runGenerate);
  runGenerate();
});
`);

writeFile('generator/css/style.css', `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
}

.header h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.main {
  padding: 40px 20px;
}

section {
  margin-bottom: 40px;
}

section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.flow-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.flow-item {
  background: #f8fafc;
  border: 2px solid #667eea;
  border-radius: 10px;
  padding: 20px;
  min-width: 180px;
  text-align: center;
}

.flow-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

.flow-text {
  font-size: 14px;
  color: #333;
}

.flow-arrow {
  font-size: 24px;
  color: #667eea;
}

.status-box {
  padding: 15px;
  border-radius: 8px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  color: #1565c0;
  margin-bottom: 20px;
  font-weight: 500;
}

.status-box.success {
  background: #e8f5e9;
  border-left-color: #4caf50;
  color: #2e7d32;
}

.status-box.error {
  background: #ffebee;
  border-left-color: #f44336;
  color: #c62828;
}

.file-tree {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  max-height: 500px;
  overflow-y: auto;
}

.tree {
  margin-bottom: 20px;
}

.tree strong {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.tree-item {
  padding: 8px 12px;
  margin: 5px 0;
  background: white;
  border-radius: 5px;
  border-left: 3px solid #667eea;
  font-size: 14px;
}

.folder-icon, .file-icon {
  margin-right: 8px;
}

.desc {
  color: #666;
  font-size: 12px;
  font-weight: normal;
}

.btn-generate {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 20px;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  background: #f8fafc;
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 8px;
}

.info-box p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #333;
}

.info-box strong {
  color: #667eea;
}

.commands {
  background: #1e1e1e;
  color: #0f0;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.commands p {
  margin: 8px 0;
  padding: 8px 0;
}

code {
  background: #333;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.footer {
  background: #f5f5f5;
  text-align: center;
  padding: 20px;
  color: #666;
  border-top: 1px solid #ddd;
}

@media (max-width: 768px) {
  .flow-chart {
    flex-direction: column;
  }
  .flow-arrow {
    transform: rotate(90deg);
  }
  section h2 {
    font-size: 20px;
  }
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

writeFile('web/App.js', `/**
 * web/App.js - React Native Web Application
 * Main entry point for web platform
 * This file is part of React Native Web setup
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>${name}</Text>
        <Text style={styles.subtitle}>React Native Web Application</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>🚀 Welcome to your web app</Text>
        <Text style={styles.text}>Powered by React Native Web + Expo</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 ${name}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    color: '#666',
  },
});
`);

writeFile('server/server.js', `const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.warn('MongoDB connection failed:', err.message));

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
  try {
    const projectRoot = path.dirname(__dirname);
    const foldersToCreate = [
      'linux',
      'ios',
      'android',
      'macos',
      'windows',
      'web',
      'hooks',
      'locales',
      'components',
      'assets'
    ];

    foldersToCreate.forEach(folder => {
      const folderPath = path.join(projectRoot, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });

    const files = {
      'linux/.gitkeep': '',
      'ios/.gitkeep': '',
      'android/.gitkeep': '',
      'macos/.gitkeep': '',
      'windows/.gitkeep': '',
      'web/App.js': \`import React from 'react';

export default function App() {
  return (
    <div>
      <h1>Welcome to ${name} Web App</h1>
      <p>React Native Web Application</p>
    </div>
  );
}\`,
      'components/.gitkeep': '',
      'assets/.gitkeep': ''
    };

    Object.entries(files).forEach(([filePath, content]) => {
      const fullPath = path.join(projectRoot, filePath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    });

    res.json({ status: 'ok', message: 'Структура проекта обновлена успешно', path: projectRoot });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Ошибка генерации: ' + error.message });
  }
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
app.use((req, res) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.path,
    availableRoutes: ['/', '/api/greet?user=1', '/api/users', '/api/status', '/api/qrcode', '/api/send-email']
  });
});

// Функция для поиска доступного порта
const findAvailablePort = (startPort, maxAttempts = 5) => {
  return new Promise((resolve) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryListen = () => {
      const server = app.listen(currentPort, () => {
        console.log('✅ Server running on http://localhost:' + currentPort);
        resolve(currentPort);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
          currentPort++;
          attempts++;
          tryListen();
        } else {
          console.error('❌ Failed to find available port:', err.message);
          process.exit(1);
        }
      });
    };

    tryListen();
  });
};

// Запуск с автоматическим поиском порта
const initialPort = process.env.PORT || 3000;
findAvailablePort(parseInt(initialPort, 10));
`);
writeFile('server/routes/index.js', `const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));

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

module.exports = router;
`);

writeFile('server/models/exampleModel.js', `// Определите Mongoose-схемы здесь
module.exports = {};`);
// === Auth screens and helpers (Firebase + MongoDB) ===
writeFile('auth/AuthScreen.tsx', `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});

type FormData = z.infer<typeof schema>;

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const saveUserToMongoDB = async (uid: string, email: string | null, provider: string) => {
    try {
      await axios.post('http://localhost:3000/api/users', { uid, email, provider, createdAt: new Date().toISOString() });
    } catch (e) {
      console.log('Не удалось сохранить в MongoDB', e.message || e);
    }
  };

  const onRegister = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(data.email, data.password);
      const user = userCredential.user;
      await saveUserToMongoDB(user.uid, user.email, 'email');
      Alert.alert('Успех', 'Регистрация прошла успешно!');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally { setLoading(false); }
  };

  const onLogin = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(data.email, data.password);
      console.log('Вход выполнен:', userCredential.user);
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally { setLoading(false); }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;
      await saveUserToMongoDB(user.uid, user.email, 'google');
      Alert.alert('Успех', 'Добро пожаловать, ' + (user.displayName || user.email));
    } catch (error: any) {
      Alert.alert('Ошибка Google', error.message);
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>

      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Email" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" />
      )} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Пароль" value={value} onChangeText={onChange} secureTextEntry />
      )} />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(isLogin ? onLogin : onRegister)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>{isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.googleText}>Войти через Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8 },
  button: { backgroundColor: '#667eea', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  googleButton: { backgroundColor: '#DB4437', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  googleText: { color: 'white', fontWeight: 'bold' },
  switchText: { textAlign: 'center', marginTop: 15, color: '#667eea' },
  error: { color: 'red', marginBottom: 10 },
});
`);

writeFile('auth/RegistrationForm.tsx', `import React from 'react';
import { View, Text } from 'react-native';
export default function RegistrationForm() {
  return (<View><Text>Registration form placeholder — используйте AuthScreen.tsx</Text></View>);
}
`);

writeFile('auth/LoginForm.tsx', `import React from 'react';
import { View, Text } from 'react-native';
export default function LoginForm() {
  return (<View><Text>Login form placeholder — используйте AuthScreen.tsx</Text></View>);
}
`);

writeFile('auth/verification-email.tsx', `import React from 'react';
import { View, Text, Button } from 'react-native';
export default function VerificationEmail({ navigation }: any) {
  return (<View><Text>Отправить письмо с подтверждением можно через Firebase Auth API</Text></View>);
}
`);

writeFile('auth/I-forgot-my-password.tsx', `import React from 'react';
import { View, Text } from 'react-native';
export default function ForgotPassword() { return (<View><Text>Восстановление пароля — используйте auth().sendPasswordResetEmail(email)</Text></View>); }
`);

writeFile('auth/Firebase.info', `Firebase: краткая инструкция
1) Создайте проект в Firebase Console
2) Включите Authentication -> Email/Password и Google
3) Скопируйте конфиг и вызовите GoogleSignin.configure({ webClientId: '...' }) в App.tsx
4) Установите @react-native-firebase/app и @react-native-firebase/auth
`);

writeFile('auth/MongoDB.info', `MongoDB Atlas: краткая инструкция
1) Создайте кластер в MongoDB Atlas
2) Создайте базу данных и пользователя доступа
3) Не подключайте Atlas напрямую из мобильного приложения — используйте backend
4) Настройте переменные окружения: MONGODB_URI
`);

// Backend: users model + route
writeFile('server/models/user.js', `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String },
  provider: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
`);

writeFile('server/routes/users.js', `const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { uid, email, provider, createdAt } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid is required' });
  try {
    const upsert = await User.findOneAndUpdate({ uid }, { uid, email, provider, createdAt }, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ status: 'ok', user: upsert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().limit(50).lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
`);

// CSV template to include in generated projects
writeFile('Firebase-MongoDB.csv', `section,type,description,example
auth,provider,Authentication provider to include,firebase
auth,google,Enable Google sign-in,true
backend,mongodb,Use MongoDB Atlas,true
notes,warning,Do not connect Atlas directly from client,Use backend
`);
writeFile('shared/index.ts', `/**
 * shared/index.ts - Общий конфиг проекта
 * Импортируется в app.js и других модулях
 * Содержит константы, конфиги, версии
 */

export const appConfig = {
  name: '${name}',
  version: '0.1.0',
  description: 'Bard Project - React Native + Node.js Backend',
  author: 'Bard Project Team',
};

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'xxx',
  appId: process.env.FIREBASE_APP_ID || 'xxx',
};

export const mongoDBConfig = {
  uri: process.env.MONGODB_URI || 'mongodb+srv://user:password@cluster.mongodb.net/database',
  database: process.env.MONGODB_DATABASE || 'bard_project_db',
};

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
};

export default { appConfig, firebaseConfig, mongoDBConfig, apiConfig };
`);

writeFile('app.js', `/**
 * app.js - Главная точка входа приложения
 * Подключает все библиотеки и инициализирует приложение
 * 
 * Структура загрузки:
 * 1. shared/index.ts - загрузка конфига
 * 2. auth/ - инициализация Firebase
 * 3. components/ - регистрация компонентов
 * 4. server/ - инициализация backend
 */

// ===== ИМПОРТ КОНФИГА =====
const { appConfig, firebaseConfig, mongoDBConfig, apiConfig } = require('./shared/index');

console.log('📋 Инициализация приложения:', appConfig.name);

// ===== REACT & REACT NATIVE =====
try {
  const React = require('react');
  const ReactNative = require('react-native');
  console.log('✅ React Native подключен');
} catch (e) {
  console.warn('⚠ React Native не установлен или не запущен в RN окружении');
}

// ===== НАВИГАЦИЯ =====
try {
  const Navigation = require('@react-navigation/native');
  const NativeStack = require('@react-navigation/native-stack');
  const BottomTabs = require('@react-navigation/bottom-tabs');
  console.log('✅ React Navigation подключена');
} catch (e) {
  console.warn('⚠ React Navigation опционально');
}

// ===== FIREBASE =====
try {
  const firebase = require('@react-native-firebase/app');
  const auth = require('@react-native-firebase/auth');
  const firestore = require('@react-native-firebase/firestore');
  console.log('✅ Firebase подключен');
} catch (e) {
  console.warn('⚠ Firebase опционально');
}

// ===== ХРАНИЛИЩЕ СОСТОЯНИЯ =====
try {
  const Zustand = require('zustand');
  const Redux = require('react-redux');
  const ReduxToolkit = require('@reduxjs/toolkit');
  console.log('✅ Системы управления состоянием подключены');
} catch (e) {
  console.warn('⚠ Zustand/Redux опционально');
}

// ===== ФОРМЫ И ВАЛИДАЦИЯ =====
try {
  const ReactHookForm = require('react-hook-form');
  const Zod = require('zod');
  console.log('✅ Формы и валидация подключены');
} catch (e) {
  console.warn('⚠ React Hook Form/Zod опционально');
}

// ===== HTTP И ХРАНИЛИЩЕ =====
try {
  const Axios = require('axios');
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const MMKV = require('react-native-mmkv');
  console.log('✅ HTTP и хранилище подключены');
} catch (e) {
  console.warn('⚠ Axios/Storage опционально');
}

// ===== АНИМАЦИИ И ЖЕСТЫ =====
try {
  const Animated = require('react-native-reanimated');
  const GestureHandler = require('react-native-gesture-handler');
  console.log('✅ Анимации и жесты подключены');
} catch (e) {
  console.warn('⚠ Reanimated/Gesture Handler опционально');
}

// ===== КОМПОНЕНТЫ И ВИЗУАЛИЗАЦИЯ =====
try {
  const FastImage = require('react-native-fast-image');
  const VectorIcons = require('react-native-vector-icons/Ionicons');
  const LinearGradient = require('react-native-linear-gradient');
  const SVG = require('react-native-svg');
  console.log('✅ Компоненты и визуализация подключены');
} catch (e) {
  console.warn('⚠ FastImage/SVG опционально');
}

// ===== NODE.JS BACKEND =====
try {
  const Express = require('express');
  const Mongoose = require('mongoose');
  const Nodemailer = require('nodemailer');
  console.log('✅ Node.js зависимости подключены');
} catch (e) {
  console.warn('⚠ Express/Mongoose опционально для браузера');
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
console.log('\\n✅ ${name} готово к использованию!');
console.log('📂 Структура проекта инициализирована в:', process.cwd());
console.log('📚 Документация доступна в README.md');
console.log('🚀 Для запуска сервера используйте: npm start\\n');

module.exports = { appConfig, firebaseConfig, mongoDBConfig, apiConfig };
`);

writeFile('app.json', `{
  "expo": {
    "name": "${name}",
    "slug": "${name.toLowerCase().replace(/\s+/g, '-')}",
    "version": "1.0.0",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    }
  }
}
`);

writeFile('babel.config.js', `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
`);

writeFile('metro.config.js', `const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
`);

writeFile('tsconfig.json', `{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
`);

writeFile('package.json', `{
  "name": "${name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node server/server.js",
    "dev": "concurrently \\"npm run server\\" \\"npm run app\\"",
    "server": "nodemon server/server.js",
    "app": "expo start",
    "web": "expo start --web",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "generate": "npm run generate:all",
    "generate:all": "echo 'Generating all platforms...' && npm run generate:web && npm run generate:android && npm run generate:ios && npm run generate:server",
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
    "axios": "^1.5.0",
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "expo": "^49.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "typescript": "^5.1.0",
    "@types/node": "^20.0.0",
    "concurrently": "^8.2.1"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
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
writeFile('README.md', `# 🚀 ${name}

Многоплатформенное приложение, созданное с помощью Bard Project Language.

## 📋 Структура проекта

\`\`\`
${name}/
├── 📄 package.json              # Зависимости и npm скрипты
├── 📄 app.json                  # Конфигурация Expo
├── 📄 babel.config.js           # Babel конфигурация
├── 📄 metro.config.js           # Metro bundler для React Native
├── 📄 tsconfig.json             # TypeScript конфигурация
├── 📄 .env.example              # Переменные окружения
│
├── 📁 server/                   # Node.js Express сервер
│   ├── server.js                # Точка входа сервера
│   ├── routes/                  # API маршруты
│   └── models/                  # MongoDB модели
│
├── 📱 android/                  # Android приложение (React Native)
├── 🍎 ios/                      # iOS приложение (React Native)
├── 🌐 web/                      # Static web приложение
│   └── package.json            # Веб-сборка
│
├── 🐧 linux/                    # Linux приложение
├── 🪟 windows/                  # Windows приложение
├── 🖥️ macos/                    # macOS приложение
│
├── 📁 generator/                # Генератор страницы
│   ├── index.html               # Интерактивная UI
│   ├── js/                      # JavaScript скрипты
│   └── css/                     # Стили
│
├── 📁 hooks/                    # React hooks
├── 📁 components/               # Переиспользуемые компоненты
├── 📁 locales/                  # Локализация (i18n)
├── 📁 assets/                   # Изображения и иконки
└── 📁 shared/                   # Общий код между платформами
\`\`\`

## 🚀 npm Скрипты

\`\`\`bash
# Все платформы одновременно
npm run generate

# Конкретные платформы
npm run generate:web             # 🌐 Web приложение
npm run generate:android         # 📱 Android (React Native)
npm run generate:ios             # 🍎 iOS (React Native)
npm run generate:linux           # 🐧 Linux
npm run generate:windows         # 🪟 Windows
npm run generate:macos           # 🖥️ macOS
npm run generate:server          # 🖧 Node.js сервер
npm run generate:test            # 🧪 Тестирование API

# Основные команды
npm install                      # Установка зависимостей
npm start                        # Запуск сервера на порту 3000
npm run dev                      # Запуск с nodemon (автоперезагрузка)
\`\`\`

## 🖧 Запуск сервера

\`\`\`bash
# Установить зависимости
npm install

# Запустить сервер (автоматически выберет свободный порт)
npm start

# Результат:
# ✅ Сервер запущен: http://localhost:3000
# ✅ Генератор: http://localhost:3000
# ✅ API доступна: http://localhost:3000/api/
\`\`\`

## 🌐 API Примеры

### Получить приветствие
\`\`\`bash
curl http://localhost:3000/api/greet?user=1
\`\`\`

**Ответ:**
\`\`\`json
{
  "message": "Добро пожаловать в приложение!",
  "users": [...],
  "total": 5
}
\`\`\`

### Статус сервера
\`\`\`bash
curl http://localhost:3000/api/status
\`\`\`

### QR-код для подключения
\`\`\`bash
curl http://localhost:3000/api/qrcode
\`\`\`

### Отправить письмо
\`\`\`bash
curl -X POST http://localhost:3000/api/send-email \\
  -H "Content-Type: application/json" \\
  -d '{"to":"user@example.com","subject":"Test","text":"Hello"}'
\`\`\`

## 🔧 Конфигурация .env

\`\`\`bash
# Порт сервера (по умолчанию 3000)
PORT=3000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# SMTP для отправки писем
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@example.com

# API ключи
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
\`\`\`

## 📱 Запуск на разных платформах

### React Native (Android, iOS, Web)
\`\`\`bash
cd ${name}
npm install

# Запустить с Expo
npx expo start

# Выберите платформу:
# a - Android
# i - iOS
# w - Web
\`\`\`

### Web (Static Web)
\`\`\`bash
cd ${name}/web
npm install
npm start

# Откройте http://localhost:5000
\`\`\`

### Node.js Сервер
\`\`\`bash
cd ${name}
npm install
npm start

# Откройте http://localhost:3000
\`\`\`

## 📦 Установленные зависимости

- **express** - веб-фреймворк
- **mongoose** - MongoDB ODM
- **nodemailer** - отправка писем
- **qrcode** - генерирование QR-кодов
- **axios** - HTTP клиент
- **cors** - CORS поддержка
- **dotenv** - переменные окружения
- **nodemon** - автоперезагрузка при разработке
- **typescript** - типизация

## 🚀 Развертывание

### Heroku
\`\`\`bash
heroku create ${name}
git push heroku master
\`\`\`

### AWS
\`\`\`bash
# EB CLI
eb create ${name}-env
eb deploy
\`\`\`

### DigitalOcean / Google Cloud
Развертывается как обычное Node.js приложение.

## 📚 Документация

- [Bard Project Language](https://github.com/Code-BardProject/redactor-vscode-bard-project-language)
- [Express.js](https://expressjs.com/)
- [React Native](https://reactnative.dev/)
- [MongoDB](https://docs.mongodb.com/)

## 🤝 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории.

---

**Последнее обновление:** ${new Date().toLocaleDateString('ru-RU')}
**Версия:** 1.0.0
\`
`);

writeFile('.env.example', `# Порт сервера
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# SMTP для Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@example.com

# API
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
`);

writeFile('.env', `# Порт сервера
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# SMTP для Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@example.com

# API
API_KEY=your-api-key-here
API_SECRET=your-api-secret-here
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
