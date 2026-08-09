// ============ practice/lab-3.js — ЛАБОРАТОРНАЯ 3: ПЕРВЫЕ ШАГИ В CTF ============

KERNEL_DATA.addPractice({
    id: 103,
    section: 'practice',
    title: 'Лабораторная 3: первые шаги в CTF',
    desc: 'Методология атаки на учебную машину: разведка → сканирование → перечисление → флаг. Путь TryHackMe Pre Security и инструменты.',
    tags: ['практика', 'CTF', 'TryHackMe', 'пентест'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>Пройти первую учебную машину на CTF-платформе и закрепить общую методологию, которая работает на 90% простых задач.</p>',

            '<h3>Шаг 0. Что понадобится</h3>',
            '<ul>',
            '<li>Linux-окружение (см. <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 101)">Лабораторную 1</a>).</li>',
            '<li>Nmap — <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 3)">конспект по Nmap</a> уже есть на сайте.</li>',
            '<li>Wireshark — <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 2)">конспект по Wireshark</a>.</li>',
            '<li>Аккаунт на <a href="https://tryhackme.com" target="_blank">TryHackMe</a>, путь <strong>«Pre Security»</strong> — специально рассчитан на новичков, объясняет всё с нуля.</li>',
            '</ul>',

            '<h3>Общая методология (работает почти всегда)</h3>',
            '<ol>',
            '<li><strong>Разведка (Reconnaissance)</strong> — что вообще известно о цели: IP, домен, открытая информация.</li>',
            '<li><strong>Сканирование (Scanning)</strong> — какие порты и сервисы открыты.</li>',
            App.createCodeBlock('nmap -sV -sC -p- <IP цели>', 'bash'),
            '<li><strong>Перечисление (Enumeration)</strong> — детальное изучение найденных сервисов: версии ПО, доступные директории на веб-сервере, анонимный доступ по FTP/SMB.</li>',
            '<li><strong>Эксплуатация (Exploitation)</strong> — использование найденной уязвимости для получения доступа.</li>',
            '<li><strong>Флаг</strong> — обычно текстовый файл или строка вида <code>flag{...}</code>, которую нужно найти и отправить в форму на платформе.</li>',
            '</ol>',

            '<h3>Шаг 1. Разведка и сканирование</h3>',
            '<p>Начинайте с самого широкого скана, чтобы не пропустить нестандартные порты:</p>',
            App.createCodeBlock(
                'nmap -p- -T4 <IP>          # все 65535 портов\nnmap -sV -sC -p 22,80,445 <IP>  # версии сервисов + базовые скрипты на найденных портах',
                'bash'
            ),

            '<h3>Шаг 2. Перечисление по типу сервиса</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Сервис</th><th style="padding:8px 10px;">Что проверить в первую очередь</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">HTTP/80</td><td style="padding:6px 10px;">Исходный код страницы, robots.txt, скрытые директории (gobuster/dirb)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">FTP/21</td><td style="padding:6px 10px;">Анонимный вход: <code>ftp <IP></code>, логин anonymous</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">SMB/445</td><td style="padding:6px 10px;">Список общих папок: <code>smbclient -L <IP></code></td></tr>',
            '<tr><td style="padding:6px 10px;">SSH/22</td><td style="padding:6px 10px;">Версия — есть ли известные уязвимости под неё</td></tr>',
            '</tbody></table>',

            '<h3>Шаг 3. Фиксация находок</h3>',
            '<p>Ведите простой файл с заметками по ходу решения — это не только помогает не запутаться, но и приучает к формату будущих pentest-отчётов:</p>',
            App.createCodeBlock(
                '## Цель: 10.10.x.x\n\n### Открытые порты\n22/tcp — OpenSSH 7.9\n80/tcp — Apache 2.4.29\n\n### Находки\n- /backup/ доступен без авторизации, найден config.php с паролем\n\n### Следующий шаг\n- Проверить, переиспользуется ли пароль для SSH',
                'plaintext'
            ),

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>Вы прошли хотя бы одну машину на TryHackMe из пути Pre Security.</li>',
            '<li>Можете объяснить порядок действий: разведка → сканирование → перечисление → эксплуатация.</li>',
            '<li>У вас есть файл с заметками по решённой машине — это заготовка под будущий отчёт.</li>',
            '</ul>',
            '<p>Дальше — читайте про площадки и агрегаторы соревнований в разделе «Библиотека».</p>'
        ].join('');
    }
});
