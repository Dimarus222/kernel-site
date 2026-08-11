// ============ practice/lab-5.js — ЛАБОРАТОРНАЯ: SQL-ИНЪЕКЦИИ НА УЧЕБНОЙ БАЗЕ ============

KERNEL_DATA.addPractice({
    id: 105,
    section: 'practice',
    title: 'Лабораторная: SQL-инъекции на учебной базе данных',
    desc: 'Собираем уязвимое учебное приложение на sqlite3, воспроизводим классическую инъекцию, затем закрываем её подготовленными выражениями.',
    tags: ['практика', 'SQLi', 'web', 'Python'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>На собственной локальной базе данных (никаких сторонних сайтов) увидеть, как работает SQL-инъекция, и закрыть её правильным способом. Теория — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 10)">«Веб-уязвимости: OWASP Top 10»</a>.</p>',
            '<p><strong>Важно:</strong> вся лабораторная выполняется на локальной базе, которую вы создаёте сами. Использовать эти техники на чужих сайтах без разрешения — незаконно.</p>',

            '<h3>Шаг 1. Создаём учебную базу</h3>',
            App.createCodeBlock(
                'import sqlite3\n\nconn = sqlite3.connect("lab.db")\ncur = conn.cursor()\ncur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, login TEXT, password TEXT)")\ncur.execute("INSERT INTO users (login, password) VALUES (\'admin\', \'S3cr3tPass\')")\nconn.commit()\nconn.close()\nprint("База создана")',
                'python'
            ),

            '<h3>Шаг 2. Пишем уязвимую функцию входа</h3>',
            App.createCodeBlock(
                'import sqlite3\n\ndef login_vulnerable(login, password):\n    conn = sqlite3.connect("lab.db")\n    cur = conn.cursor()\n    # УЯЗВИМО: пользовательский ввод склеивается прямо в текст запроса\n    query = f"SELECT * FROM users WHERE login = \'{login}\' AND password = \'{password}\'"\n    print("Выполняется запрос:", query)\n    cur.execute(query)\n    result = cur.fetchone()\n    conn.close()\n    return result is not None\n\n# Обычный вход:\nprint(login_vulnerable("admin", "S3cr3tPass"))   # True\nprint(login_vulnerable("admin", "неверный"))      # False\n\n# TODO: попробуйте подобрать значение для password,\n# которое вернёт True без знания реального пароля',
                'python'
            ),
            '<details style="margin:12px 0;"><summary style="cursor:pointer;color:var(--accent);">Показать решение (инъекция)</summary>',
            App.createCodeBlock(
                '# password = любое значение, login оставляем "admin":\nprint(login_vulnerable("admin", "x\' OR \'1\'=\'1"))\n\n# Итоговый запрос:\n# SELECT * FROM users WHERE login = \'admin\' AND password = \'x\' OR \'1\'=\'1\'\n# Условие \'1\'=\'1\' истинно всегда — вход пройдёт без знания пароля',
                'python'
            ),
            '</details>',

            '<h3>Шаг 3. Исправляем через подготовленные выражения</h3>',
            App.createCodeBlock(
                'def login_safe(login, password):\n    conn = sqlite3.connect("lab.db")\n    cur = conn.cursor()\n    # БЕЗОПАСНО: значения передаются отдельно от текста запроса\n    cur.execute("SELECT * FROM users WHERE login = ? AND password = ?", (login, password))\n    result = cur.fetchone()\n    conn.close()\n    return result is not None\n\n# Повторите ту же инъекцию против безопасной версии:\nprint(login_safe("admin", "x\' OR \'1\'=\'1"))   # False — инъекция не сработала',
                'python'
            ),

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>Инъекция <code>x\' OR \'1\'=\'1</code> проходит в <code>login_vulnerable</code>, но не проходит в <code>login_safe</code>.</li>',
            '<li>Вы можете объяснить своими словами, почему именно плейсхолдер <code>?</code> закрывает уязвимость, а не просто «более аккуратный» текст запроса.</li>',
            '<li>Вы понимаете, что f-строка (или любая склейка строк) с пользовательским вводом в SQL-запросе — красный флаг при код-ревью.</li>',
            '</ul>'
        ].join('');
    }
});
