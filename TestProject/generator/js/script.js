async function runGenerate() {
  const status = document.getElementById('status');
  const button = document.getElementById('generateButton');
  const list = document.getElementById('fileList');
  
  button.disabled = true;
  status.textContent = 'Генерация структуры проекта...';
  if (list) list.innerHTML = '';

  try {
    const response = await fetch('/api/generate');
    const result = await response.json();
    
    if (response.ok) {
      status.textContent = '✅ ' + (result.message || 'Структура проекта сгенерирована успешно');
      status.style.color = 'green';
      
      // Показываем список создаваемых папок
      if (list) {
        const folders = [
          'linux/', 'ios/', 'android/', 'macos/', 'windows/',
          'web/', 'hooks/', 'locales/', 'components/', 'assets/',
          'server/', 'generator/', 'shared/'
        ];
        let html = '<strong>Созданные папки и файлы:</strong><ul>';
        folders.forEach(folder => {
          html += '<li>' + folder + '</li>';
        });
        html += '<li>.gitignore</li>';
        html += '<li>package.json</li>';
        html += '<li>README.md</li>';
        html += '</ul>';
        list.innerHTML = html;
      }
    } else {
      status.textContent = '❌ Ошибка генерации: ' + (result.message || response.statusText);
      status.style.color = 'red';
    }
  } catch (error) {
    status.textContent = '❌ Ошибка генерации: ' + error.message;
    status.style.color = 'red';
  } finally {
    button.disabled = false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateButton').addEventListener('click', runGenerate);
  runGenerate();
});
