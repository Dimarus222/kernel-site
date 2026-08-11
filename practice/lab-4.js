// ============ practice/lab-4.js — ЛАБОРАТОРНАЯ: РАБОЧИЙ ЦИКЛ GIT ============

KERNEL_DATA.addPractice({
    id: 104,
    section: 'practice',
    title: 'Лабораторная: рабочий цикл Git',
    desc: 'Создание репозитория, ветки, конфликт слияния и его разрешение, публикация на GitHub — от начала до конца.',
    tags: ['практика', 'Git', 'GitHub'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>Пройти полный цикл работы с git: от локального репозитория до конфликта слияния и его разрешения. Теория — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 9)">«Git: система контроля версий»</a>.</p>',

            '<h3>Шаг 1. Создаём репозиторий и первый коммит</h3>',
            App.createCodeBlock(
                'mkdir git-lab && cd git-lab\ngit init\necho "# Учебный репозиторий" > README.md\ngit add README.md\ngit commit -m "Первый коммит"',
                'bash'
            ),

            '<h3>Шаг 2. Создаём ветку и вносим изменения</h3>',
            App.createCodeBlock(
                'git checkout -b feature-a\necho "Строка от ветки feature-a" >> notes.txt\ngit add notes.txt\ngit commit -m "Добавлена заметка в feature-a"',
                'bash'
            ),

            '<h3>Шаг 3. Специально создаём конфликт</h3>',
            '<p>Возвращаемся в main и меняем ту же область файла по-другому:</p>',
            App.createCodeBlock(
                'git checkout main\necho "Строка от main" >> notes.txt\ngit add notes.txt\ngit commit -m "Добавлена другая заметка в main"\n\ngit merge feature-a   # здесь возникнет конфликт',
                'bash'
            ),

            '<h3>Шаг 4. Разрешаем конфликт</h3>',
            '<p>Откройте <code>notes.txt</code> — увидите маркеры <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> / <code>=======</code> / <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. Отредактируйте файл вручную, оставив нужный текст (или оба варианта), уберите маркеры:</p>',
            App.createCodeBlock(
                'nano notes.txt   # или vim notes.txt\n\ngit add notes.txt\ngit commit   # завершает merge, сообщение можно оставить по умолчанию',
                'bash'
            ),

            '<h3>Шаг 5. Публикуем на GitHub</h3>',
            '<p>Создайте пустой репозиторий на github.com (без README, чтобы не было конфликта при первом push), затем:</p>',
            App.createCodeBlock(
                'git remote add origin https://github.com/ваш-логин/git-lab.git\ngit push -u origin main',
                'bash'
            ),
            '<p>При запросе логина — username, при запросе пароля — Personal Access Token (не пароль аккаунта).</p>',

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>История коммитов (<code>git log --oneline</code>) показывает минимум 3 коммита, включая merge-коммит.</li>',
            '<li>Вы можете объяснить, что означают маркеры <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> и <code>=======</code>.</li>',
            '<li>Репозиторий виден на github.com с правильным содержимым файлов.</li>',
            '</ul>'
        ].join('');
    }
});
