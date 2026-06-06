const express = require('express');
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
  try {
    // Обновляем структуру проекта при каждом запросе
    const projectRoot = path.dirname(__dirname); // папка проекта
    
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
    
    // Создаём папки
    foldersToCreate.forEach(folder => {
      const folderPath = path.join(projectRoot, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });
    
    // Обновляем файлы
    const files = {
      'linux/.gitkeep': '',
      'ios/.gitkeep': '',
      'android/.gitkeep': '',
      'macos/.gitkeep': '',
      'windows/.gitkeep': '',
      'web/.gitkeep': '',
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
