import * as vscode from 'vscode';

export class BardGenerator {
  async createProject() {
    const folder = await this.pickWorkspaceFolder();
    if (!folder) {
      return;
    }

    const targets = await this.askProjectTargets();
    if (!targets || targets.length === 0) {
      vscode.window.showInformationMessage('No Bard Project targets selected.');
      return;
    }

    await this.createScaffold(folder.uri, targets);
    vscode.window.showInformationMessage(`Bard Project scaffold created for: ${targets.join(', ')}.`);
  }

  async generateTargets() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'bard-project') {
      vscode.window.showErrorMessage('Open a .bard-project document to generate target files.');
      return;
    }

    const folder = await this.pickWorkspaceFolder();
    if (!folder) {
      return;
    }

    const targets = await this.askProjectTargets();
    if (!targets || targets.length === 0) {
      vscode.window.showInformationMessage('No generation targets selected.');
      return;
    }

    const text = editor.document.getText();
    await this.writeTargets(folder.uri, text, targets);
    vscode.window.showInformationMessage(`Generated: ${targets.join(', ')}.`);
  }

  private async askProjectTargets(): Promise<string[] | undefined> {
    const options: vscode.QuickPickItem[] = [
      { label: 'React Native', description: 'Mobile Android / iOS / Windows / macOS' },
      { label: 'Node.js Backend', description: 'Express server with MongoDB Atlas support' },
      { label: 'Full Workspace', description: 'React Native + Node.js Backend together' }
    ];

    const selection = await vscode.window.showQuickPick(options, {
      canPickMany: true,
      placeHolder: 'Select Bard Project targets to scaffold or generate'
    });

    if (!selection || selection.length === 0) {
      return undefined;
    }

    const selected = selection.map(item => item.label);
    if (selected.includes('Full Workspace')) {
      return ['React Native', 'Node.js Backend'];
    }

    return selected;
  }

  private async pickWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      vscode.window.showErrorMessage('Open a workspace folder first.');
      return;
    }
    if (folders.length === 1) {
      return folders[0];
    }
    return vscode.window.showWorkspaceFolderPick({ placeHolder: 'Select a workspace folder for Bard Project output' });
  }

  private async createScaffold(root: vscode.Uri, targets: string[]) {
    const directories = new Set<string>();
    if (targets.includes('React Native')) {
      directories.add('react-native');
      directories.add('react-native/assets');
      directories.add('react-native/components');
    }
    if (targets.includes('Web')) {
      directories.add('web');
      directories.add('web/components');
    }
    if (targets.includes('Node.js Backend')) {
      directories.add('backend/db');
    }

    for (const folder of directories) {
      await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(root, folder));
    }

    if (targets.includes('React Native')) {
      await this.writeTextFile(root, 'react-native/App.js', this.reactNativeAppTemplate());
      await this.writeTextFile(root, 'react-native/index.js', this.reactNativeIndexTemplate());
      await this.writeTextFile(root, 'react-native/app.json', this.reactNativeAppJson());
      await this.writeTextFile(root, 'react-native/package.json', this.reactNativePackageTemplate());
      await this.writeTextFile(root, 'react-native/babel.config.js', this.reactNativeBabelConfig());
      await this.writeTextFile(root, 'react-native/components/VisualCard.js', this.reactNativeVisualCardTemplate());
    }

    if (targets.includes('Web')) {
      await this.writeTextFile(root, 'web/index.html', this.webIndexTemplate());
      await this.writeTextFile(root, 'web/styles.css', this.webStylesTemplate());
      await this.writeTextFile(root, 'web/script.js', this.webScriptTemplate());
      await this.writeTextFile(root, 'web/package.json', this.webPackageTemplate());
      await this.writeTextFile(root, 'web/components/visual-card.js', this.webVisualComponentTemplate());
    }


    if (targets.includes('Node.js Backend')) {
      await this.writeTextFile(root, 'backend/server.js', this.backendServerTemplate());
      await this.writeTextFile(root, 'backend/custom.js', this.backendCustomTemplate(''));
      await this.writeTextFile(root, 'backend/db/atlas.config.js', this.atlasConfigTemplate());
      await this.writeTextFile(root, 'backend/package.json', this.backendPackageTemplate());
      await this.writeTextFile(root, 'backend/.env.example', this.backendEnvTemplate());
    }

    await this.writeTextFile(root, 'README.md', this.rootReadmeTemplate(targets));
  }

  private async writeTargets(root: vscode.Uri, text: string, targets: string[]) {
    const sections = this.parseSections(text);

    if (targets.includes('React Native')) {
      await this.writeTextFile(root, 'react-native/App.js', this.reactNativeAppTemplate(sections));
    }
    if (targets.includes('Web')) {
      await this.writeTextFile(root, 'web/index.html', this.generateHtml(sections.html));
      await this.writeTextFile(root, 'web/styles.css', sections.css || this.webStylesTemplate());
      await this.writeTextFile(root, 'web/script.js', sections.js || this.webScriptTemplate());
    }
    if (targets.includes('Node.js Backend')) {
      await this.writeTextFile(root, 'backend/server.js', this.backendServerTemplate(sections.backend));
      await this.writeTextFile(root, 'backend/custom.js', this.backendCustomTemplate(sections.backend));
      await this.writeTextFile(root, 'backend/db/atlas.config.js', this.atlasConfigTemplate());
    }
  }

  private async writeTextFile(root: vscode.Uri, relativePath: string, content: string) {
    const file = vscode.Uri.joinPath(root, relativePath);
    await vscode.workspace.fs.writeFile(file, Buffer.from(content, 'utf8'));
  }

  private parseSections(text: string) {
    const html = this.extractSection(text, 'html');
    const css = this.extractSection(text, 'css');
    const js = this.extractSection(text, 'js');
    const backend = this.extractSection(text, 'backend');
    return { html, css, js, backend };
  }

  private extractSection(text: string, tag: string): string {
    const pattern = new RegExp(`<${tag}>([\s\S]*?)</${tag}>`, 'i');
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  }

  private generateHtml(html = '') {
    if (!html) {
      return this.webIndexTemplate();
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bard Project Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app">
    ${html}
  </div>
  <script src="script.js"></script>
</body>
</html>
`;
  }

  private reactNativeAppTemplate(sections?: { html?: string; css?: string; js?: string }) {
    const jsContent = sections?.js || 'const greeting = "Hello Bard Project";\\nconsole.log(greeting);';
    return `import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import VisualCard from './components/VisualCard';

export default function App() {
  ${jsContent.replace(/\\n/g, '\\n  ')}

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Bard Project React Native</Text>
        <VisualCard title="Bard Project" description="Visual mobile component template." />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 }
});
`;
  }

  private reactNativeIndexTemplate() {
    return `import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
`;
  }

  private reactNativeAppJson() {
    return `{
  "name": "bard-project-react-native",
  "displayName": "Bard Project React Native"
}
`;
  }

  private reactNativePackageTemplate() {
    return `{
  "name": "bard-project-react-native",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0"
  }
}
`;
  }

  private reactNativeBabelConfig() {
    return `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};
`;
  }

  private reactNativeVisualCardTemplate() {
    return `import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VisualCard({ title, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
  },
});
`;
  }

  private webIndexTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bard Project Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app">
    <h1>Bard Project Web</h1>
    <div class="container">
      <button onclick="handleClick()">Click me</button>
    </div>
    <div id="visual-card"></div>
    <script src="script.js"></script>
    <script type="module" src="components/visual-card.js"></script>
  </div>
</body>
</html>
`;
  }

  private webStylesTemplate() {
    return `.app { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
.container { margin-top: 16px; }
button { background: #4f46e5; color: white; border: none; padding: 12px 18px; border-radius: 8px; cursor: pointer; }
button:hover { background: #4338ca; }
`;
  }

  private webScriptTemplate() {
    return `function handleClick() {
  alert('Bard Project says hello!');
}
`;
  }

  private webPackageTemplate() {
    return `{
  "name": "bard-project-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "npx serve ."
  },
  "dependencies": {
    "serve": "^14.0.1"
  }
}
`;
  }

  private webVisualComponentTemplate() {
    return `const root = document.getElementById('visual-card');

if (root) {
  root.innerHTML = '<div class="visual-card">' +
    '<h2>Bard Project Visual Component</h2>' +
    '<p>Create responsive web UI with this template.</p>' +
    '</div>';
}
`;
  }

  private backendServerTemplate(backendCode = '') {
    return `const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const atlasConfig = require('./db/atlas.config');
const customRoutes = require('./custom');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(atlasConfig.uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function start() {
  try {
    await client.connect();
    const db = client.db(atlasConfig.database);
    const items = db.collection('items');

    app.get('/api/items', async (req, res) => {
      const result = await items.find().toArray();
      res.json(result);
    });

    app.post('/api/items', async (req, res) => {
      const item = req.body;
      const result = await items.insertOne(item);
      const created = await items.findOne({ _id: result.insertedId });
      res.json(created);
    });

    app.post('/api/send-email', async (req, res) => {
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

    customRoutes.applyCustomRoutes(app, db);

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log('Server running on port ' + port));
  } catch (error) {
    console.error(error);
  }
}

start();
`;
  }

  private backendCustomTemplate(backendCode = '') {
    const body = backendCode ? this.generateBackendCustomJs(backendCode) : this.defaultBackendCustomJs();
    return body;
  }

  private defaultBackendCustomJs() {
    return `module.exports = {
  applyCustomRoutes: function(app, db) {
    // Add custom Express routes here. Use db.collection('yourCollection') to access MongoDB Atlas.
    // Example:
    // app.get('/api/custom', async (req, res) => {
    //   const data = await db.collection('items').find().toArray();
    //   res.json(data);
    // });
  }
};
`;
  }

  private generateBackendCustomJs(backendCode: string) {
    const lines = backendCode.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    const routes = lines.map(line => this.buildBackendRoute(line)).filter(Boolean).join('\n\n');
    return `module.exports = {
  applyCustomRoutes: function(app, db) {
${routes || '    // No custom routes defined in the backend section.'}
  }
};
`;
  }

  private buildBackendRoute(line: string): string {
    const routeRegex = /^route\s+(GET|POST|PUT|DELETE)\s+(\S+)\s+collection\s+(\S+)\s+(find|insert)\s+(.+)$/i;
    const routeMatch = line.match(routeRegex);
    if (routeMatch) {
      const method = routeMatch[1].toLowerCase();
      const path = routeMatch[2];
      const collection = routeMatch[3];
      const action = routeMatch[4].toLowerCase();
      const payload = routeMatch[5].trim();

      if (action === 'find') {
        return `    app.${method}('${path}', async (req, res) => {
      const query = ${payload};
      const items = db.collection('${collection}');
      const result = await items.find(query).toArray();
      res.json(result);
    });`;
      }

      if (action === 'insert') {
        return `    app.${method}('${path}', async (req, res) => {
      const document = ${payload};
      const items = db.collection('${collection}');
      const result = await items.insertOne(document);
      res.json(result.ops[0]);
    });`;
      }
    }

    return `    // Unrecognized backend DSL: ${line}`;
  }

  private atlasConfigTemplate() {
    return `module.exports = {
  uri: process.env.MONGODB_ATLAS_URI || 'your-mongodb-atlas-connection-string',
  database: process.env.MONGODB_DATABASE || 'bard_project_db'
};
`;
  }

  private backendEnvTemplate() {
    return `MONGODB_ATLAS_URI=your-mongodb-atlas-connection-string
MONGODB_DATABASE=bard_project_db
`;
  }

  private backendPackageTemplate() {
    return `{
  "name": "bard-project-backend",
  "version": "0.1.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.0",
    "mongodb": "^5.12.0",
    "nodemailer": "^6.9.4"
  }
}
`;
  }

  private rootReadmeTemplate(targets: string[]) {
    return `# Bard Project Workspace\n\nGenerated targets: ${targets.join(', ')}.\n\n## How to use\n\n- Open the workspace in VS Code.\n- Edit your .bard-project file.\n- Run the command "Bard Project: Generate React Native / Node.js" to update generated targets.\n\n## Project targets\n\n${targets.includes('React Native') ? '- React Native mobile app: Android, iOS, Windows, macOS\\n' : ''}${targets.includes('Node.js Backend') ? '- Node.js backend with MongoDB Atlas support\\n' : ''}`;
  }
}
