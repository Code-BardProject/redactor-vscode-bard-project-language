import * as vscode from 'vscode';
import { BardGenerator } from './generator';

export function activate(context: vscode.ExtensionContext) {
  const generator = new BardGenerator();

  const createProjectCommand = vscode.commands.registerCommand('bard-project.createProject', async () => {
    await generator.createProject();
  });

  const generateTargetsCommand = vscode.commands.registerCommand('bard-project.generateTargets', async () => {
    await generator.generateTargets();
  });

  const openProjectGuideCommand = vscode.commands.registerCommand('bard-project.openProjectGuide', async () => {
    const guide = vscode.Uri.joinPath(context.extensionUri, 'README.md');
    await vscode.commands.executeCommand('markdown.openPreview', guide.toString());
  });

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'bard-project',
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const completionItems: vscode.CompletionItem[] = [];

        const htmlSection = new vscode.CompletionItem('html-section', vscode.CompletionItemKind.Snippet);
        htmlSection.insertText = new vscode.SnippetString('<html>\n  $1\n</html>');
        htmlSection.detail = 'Insert HTML section';
        completionItems.push(htmlSection);

        const cssSection = new vscode.CompletionItem('css-section', vscode.CompletionItemKind.Snippet);
        cssSection.insertText = new vscode.SnippetString('<css>\n  $1\n</css>');
        cssSection.detail = 'Insert CSS section';
        completionItems.push(cssSection);

        const jsSection = new vscode.CompletionItem('js-section', vscode.CompletionItemKind.Snippet);
        jsSection.insertText = new vscode.SnippetString('<js>\n  $1\n</js>');
        jsSection.detail = 'Insert JavaScript section';
        completionItems.push(jsSection);

        const backendSection = new vscode.CompletionItem('backend-section', vscode.CompletionItemKind.Snippet);
        backendSection.insertText = new vscode.SnippetString('<backend>\n  // Node.js / Express / MongoDB logic\n  $1\n</backend>');
        backendSection.detail = 'Insert backend section';
        completionItems.push(backendSection);

        const button = new vscode.CompletionItem('button', vscode.CompletionItemKind.Snippet);
        button.insertText = new vscode.SnippetString('<button class="$1">$2</button>');
        button.detail = 'Insert button markup';
        completionItems.push(button);

        const container = new vscode.CompletionItem('container', vscode.CompletionItemKind.Snippet);
        container.insertText = new vscode.SnippetString('<div class="container">\n  $1\n</div>');
        container.detail = 'Insert container block';
        completionItems.push(container);

        const slider = new vscode.CompletionItem('slider', vscode.CompletionItemKind.Snippet);
        slider.insertText = new vscode.SnippetString('<div class="slider">\n  <div class="slide">$1</div>\n</div>');
        slider.detail = 'Insert slider structure';
        completionItems.push(slider);

        const navbar = new vscode.CompletionItem('navbar', vscode.CompletionItemKind.Snippet);
        navbar.insertText = new vscode.SnippetString('<nav class="navbar">\n  <a href="#">Home</a>\n  <a href="#">Features</a>\n  <a href="#">Contact</a>\n</nav>');
        navbar.detail = 'Insert navigation bar';
        completionItems.push(navbar);

        const form = new vscode.CompletionItem('form', vscode.CompletionItemKind.Snippet);
        form.insertText = new vscode.SnippetString('<form action="#">\n  <label>$1</label>\n  <input type="text" placeholder="Enter value">\n</form>');
        form.detail = 'Insert form layout';
        completionItems.push(form);

        const view = new vscode.CompletionItem('view', vscode.CompletionItemKind.Snippet);
        view.insertText = new vscode.SnippetString('<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>\n  $1\n</View>');
        view.detail = 'Insert React Native View';
        completionItems.push(view);

        return completionItems;
      }
    },
    '<'
  );

  context.subscriptions.push(createProjectCommand, generateTargetsCommand, openProjectGuideCommand, completionProvider);
}

export function deactivate() {}
