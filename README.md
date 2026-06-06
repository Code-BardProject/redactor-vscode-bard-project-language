# 🚀 Bard Project Language

VS Code расширение для работы с файлом `.bard-project` - мощный инструмент для скаффолдинга проектов и кодогенерации для различных платформ.

## 📋 Возможности

- ✅ Язык `bard-project` с подсветкой синтаксиса
- ✅ Генерация проектов для **React Native** (Android, iOS, Windows, macOS)
- ✅ Генерация веб-приложений (HTML/CSS/JS)
- ✅ Генерация Angular приложений
- ✅ Генерация Node.js сервера с Express и MongoDB Atlas
- ✅ QR-код для подключения устройств
- ✅ Автоматическая обработка занятых портов
- ✅ Красивый фронтенд с интерактивными примерами

## 📦 npm Скрипты

### Быстрый старт

```bash
# Генерация кода для всех платформ одновременно
npm run generate

# Генерация для конкретной платформы
npm run generate:web      # 🌐 Веб-приложение
npm run generate:android  # 📱 Android приложение
npm run generate:ios      # 🍎 iOS приложение  
npm run generate:linux    # 🐧 Linux приложение
npm run generate:windows  # 🪟 Windows приложение
npm run generate:macos    # 🖥️ macOS приложение
npm run generate:server   # 🖧 Node.js сервер
npm run generate:test     # 🧪 Тестовый маршрут /api/greet
```

### Разработка расширения

```bash
# Компиляция TypeScript
npm run compile

# Наблюдение за изменениями
npm run watch

# Подготовка к публикации
npm run vscode:prepublish

# Создание нового проекта
npm run create-bard-project
```

## 🏗️ Архитектура проекта

```
bard-project-language/
├── 📄 package.json              # Конфигурация проекта и npm скрипты
├── 📄 tsconfig.json             # Конфигурация TypeScript
├── 📄 language-configuration.json # Конфигурация языка
├── 📝 README.md                 # Документация
│
├── 📁 src/
│   ├── extension.ts             # Точка входа VS Code расширения
│   └── generator.ts             # Логика генерирования кода
│
├── 📁 scripts/
│   ├── generateCode.js          # Node.js скрипт для генерирования файлов
│   └── createBardProject.js     # Скрипт создания проекта
│
├── 📁 syntaxes/
│   └── bard-project.tmLanguage.json # Определение синтаксиса языка
│
└── 📁 out/
    └── (компилированные файлы TypeScript)
```

## 📚 Структура генерируемых проектов

### После `npm run generate` вы получите:

```
my-project/
├── 🌐 web/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── package.json
│   └── components/
│       └── visual-card.js
│
├── 📱 android/
│   └── App.js
│
├── 🍎 ios/
│   └── App.js
│
├── 🐧 linux/
│   └── App.js
│
├── 🪟 windows/
│   └── App.js
│
├── 🖥️ macos/
│   └── App.js
│
└── 🖧 server/
    ├── server.js               # Express сервер с QR-кодом
    ├── package.json
    ├── public/
    │   └── index.html          # Красивый фронтенд
    ├── routes/
    │   └── index.js            # API маршруты
    └── models/
        └── exampleModel.js     # Mongoose модель
```

## 🎯 Формат файла `.bard-project`

Создайте файл с расширением `.bard-project` в своем проекте:

```bard-project
<html>
  <div class="app">
    <h1>Добро пожаловать в Bard Project</h1>
    <p>Это отличное приложение!</p>
  </div>
</html>

<css>
  .app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  h1 {
    color: white;
    font-size: 32px;
    margin: 0 0 20px 0;
  }
  
  p {
    color: #f0f0f0;
    font-size: 18px;
  }
</css>

<js>
  console.log('Bard Project запущен!');
  
  // Ваш JavaScript код здесь
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');
  });
</js>

<backend>
  route GET /api/items collection items find {}
  route POST /api/items collection items insert req.body
  route GET /api/users collection users find { active: true }
</backend>
```

## 🖧 Backend DSL

В блоке `<backend>` используйте упрощенный синтаксис для описания маршрутов:

```bard-project
<backend>
  # GET маршруты
  route GET /api/items collection items find {}
  route GET /api/items/:id collection items find { _id: req.params.id }
  
  # POST маршруты
  route POST /api/items collection items insert req.body
  route POST /api/users collection users insert req.body
  
  # Фильтрация и условия
  route GET /api/active-users collection users find { active: true }
</backend>
```

Генератор автоматически преобразует это в Express маршруты с MongoDB операциями.

## 🚀 Использование

### В VS Code

1. **Откройте файл `.bard-project`**
2. **Запустите команду** (Ctrl+Shift+P):
   - `Bard Project: Create Project` - создать новый проект
   - `Bard Project: Generate React Native / Angular / Node.js` - генерировать код из текущего файла

### В командной строке

```bash
# Генерация всех платформ
npm run generate

# Генерация сервера
npm run generate:server
```

### Установка CLI для создания проекта

```bash
# Из локального репозитория
cd "C:\Users\admin\Desktop\redactor vscode"
npm install -g .

# Либо локальная ссылка для разработки
cd "C:\Users\admin\Desktop\redactor vscode"
npm link

# После этого команда доступна из любой папки
create-bard-project MyApp
```

## 📁 Создание нового проекта

Есть несколько способов создать проект из этого расширения.

### 1. Использование локального npm-скрипта

```bash
cd "C:\Users\admin\Desktop\redactor vscode"
npm run create-bard-project MyApp
```

После этого будет создана папка `MyApp` рядом с текущим каталогом.

### 2. Использование глобальной команды (локально)

```bash
cd "C:\Users\admin\Desktop\redactor vscode"
npm install -g .
create-bard-project MyApp
```

### 3. Установка напрямую из GitHub

```bash
npm install -g git+https://github.com/Code-BardProject/redactor-vscode-bard-project-language.git
```

или через SSH:

```bash
npm install -g git+ssh://git@github.com/Code-BardProject/redactor-vscode-bard-project-language.git
```

После установки команда доступна из любой папки:

```bash
create-bard-project MyApp
```

### 4. Установка через npx (если пакет опубликован)

```bash
npx create-bard-project MyApp
```

## 🎨 Использование генератора структуры проекта

После создания проекта и установки зависимостей, вы можете использовать встроенный генератор:

```bash
cd MyApp
npm install      # Установить зависимости (включая Express, QRCode, Nodemailer)
npm start        # Запустить сервер на порту 3000
```

После запуска сервера откройте браузер и перейдите на `http://localhost:3000`. 

Вы увидите интерактивную страницу генератора с кнопкой "Перегенерировать проект". 

### Функции генератора:

- **Создание структуры**: Нажмите на кнопку для создания стандартной структуры папок:
  - `linux/` - код для Linux
  - `ios/` - код для iOS  
  - `android/` - код для Android
  - `macos/` - код для macOS
  - `windows/` - код для Windows
  - `web/` - веб-приложение
  - `hooks/` - React hooks
  - `locales/` - локализация
  - `components/` - переиспользуемые компоненты
  - `assets/` - изображения и ресурсы

- **Статус генерации**: Страница показывает список созданных папок и файлов

- **Автоматический запуск**: Генератор автоматически запускается при загрузке страницы

- **Управление проектом**: Все созданные файлы сохраняются в папке проекта и готовы к использованию

## 🚀 Публикация пакета

Проект настроен для публикации в npm через GitHub Actions. Для автоматической публикации:

1. Создайте секрет `NPM_TOKEN` в настройках репозитория GitHub.
2. Нажмите `Publish` или сделайте push в ветку `main`.
3. GitHub Action автоматически выполнит сборку и `npm publish`.

Если вы хотите публиковать вручную на npm, выполните:

```bash
npm publish
```

`publishConfig` уже настроен на `https://registry.npmjs.org/`, поэтому команда будет публиковаться в npm.

Если пакет будет опубликован на npm как `create-bard-project`, тогда будет работать:

```bash
npx create-bard-project MyApp
```

### Запуск сервера

```bash
cd server
npm install
npm start
```

## 🌐 Запуск сервера

После генерирования сервера:

```bash
cd server

# Установка зависимостей
npm install

# Запуск сервера (автоматически выберет свободный порт)
npm start

# Результат:
# ✅ Сервер запущен: http://localhost:3000
# ✅ API доступна: http://localhost:3000/api/greet?user=1
# ✅ Статус: http://localhost:3000/api/status
# ✅ QR-код: http://localhost:3000/api/qrcode
```

## 🎯 API маршруты сервера

### Главная страница
```
GET /
```
Красивая интерактивная страница с QR-кодом и примерами.

### Приветствие
```
GET /api/greet?user=5
```

**Ответ:**
```json
{
  "message": "Добро пожаловать в приложение!",
  "users": [
    { "id": 1, "name": "Пользователь 1", "message": "Привет, 1!" },
    { "id": 2, "name": "Пользователь 2", "message": "Привет, 2!" },
    // ... до 5 пользователей
  ],
  "total": 5,
  "timestamp": "2024-06-06T10:30:00.000Z"
}
```

### QR-код для подключения
```
GET /api/qrcode
```

**Ответ:**
```json
{
  "qrCode": "data:image/png;base64,...",
  "url": "http://192.168.1.100:3000"
}
```

### Статус сервера
```
GET /api/status
```

**Ответ:**
```json
{
  "status": "active",
  "timestamp": "2024-06-06T10:30:00.000Z",
  "uptime": 125.5,
  "port": 3000,
  "project": "my-project"
}
```

### Список пользователей
```
GET /api/users
```

**Ответ:**
```json
{
  "users": [
    { "id": 1, "name": "Пользователь 1" },
    { "id": 2, "name": "Пользователь 2" },
    // ... 10 пользователей
  ]
}
```

## 🔧 Решение проблем

### ❌ Ошибка: "Cannot GET /"
**Решение:** Убедитесь, что файл `server/public/index.html` существует. При запуске сервера автоматически создается главная страница с красивым интерфейсом.

### ❌ Ошибка: "EADDRINUSE: address already in use :::3000"
**Решение:** Сервер автоматически выберет следующий свободный порт (3001, 3002, и т.д.). При повторном запуске порт будет свободен.

Или вручную:
```bash
# Убить процесс на порту 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# На Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ Ошибка: "Cannot find module 'qrcode'"
**Решение:** Установите зависимости:
```bash
cd server
npm install
```

### ❌ Ошибка: "Cannot find module 'express'"
**Решение:**
```bash
cd server
npm install express
```

## 📊 Системные требования

- **Node.js** >= 14.0
- **npm** >= 6.0
- **VS Code** >= 1.90.0

## 📦 Зависимости

### Для расширения
- `@types/node` - типы Node.js
- `@types/vscode` - типы VS Code API
- `typescript` - компилятор TypeScript

### Для сервера (генерируется автоматически)
- `express` - веб-фреймворк
- `qrcode` - генерирование QR-кодов

## 🛠️ Разработка

### Сборка расширения

```bash
# Установка зависимостей
npm install

# Компиляция
npm run compile

# или наблюдение за изменениями
npm run watch
```

### Отладка

1. Откройте файл `src/extension.ts`
2. Нажмите F5 для запуска расширения в режиме отладки
3. VS Code откроет новое окно с загруженным расширением

## 📝 Примеры проектов

### Веб-приложение React

```bard-project
<html>
  <h1>Мое приложение</h1>
  <button onclick="alert('Привет!')">Нажмите меня</button>
</html>

<css>
  body {
    font-family: Arial;
    padding: 20px;
  }
  button {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</css>

<js>
  console.log('Приложение загружено');
</js>
```

### Мобильное приложение

```bard-project
<html>
  <div>
    <h1>Мобильное приложение</h1>
    <p>Это отличное мобильное приложение</p>
  </div>
</html>

<css>
  body {
    background: #f0f0f0;
    text-align: center;
  }
</css>

<js>
  // React Native код здесь
</js>
```

### Backend API

```bard-project
<backend>
  route GET /api/products collection products find {}
  route POST /api/products collection products insert req.body
  route GET /api/users collection users find { role: 'admin' }
  route DELETE /api/products/:id collection products delete { _id: req.params.id }
</backend>
```

## 🌍 Настройка для разных платформ

### Android & iOS
Сгенерированный код использует React Native, совместимый с Expo и React Native CLI.

### Web
HTML/CSS/JS код совместим с любым веб-браузером и может быть развернут на Netlify, Vercel, GitHub Pages.

### Node.js
Сгенерированный Express сервер может быть развернут на:
- Heroku
- AWS
- Google Cloud
- DigitalOcean
- Любой VPS с Node.js

## 📄 Лицензия

MIT License

## 🤝 Способствование

Приветствуются pull requests! Пожалуйста, сначала откройте issue для обсуждения.

## 📧 Контакты

- **GitHub**: https://github.com/Code-BardProject/redactor-vscode-bard-project-language
- **NPM**: https://www.npmjs.com/package/create-bard-project

---

**Последнее обновление:** 6 июня 2024
**Версия:** 0.0.1
**Статус:** В разработке 🔨















Что сделано
git add .
git commit уже был сделан
git push -f origin master:main
master теперь отслеживает origin/main