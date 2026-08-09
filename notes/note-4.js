// ============ notes/note-4.js — LINUX И ВИРТУАЛЬНАЯ СРЕДА ============

KERNEL_DATA.addNote({
    id: 4,
    section: 'notes',
    title: 'Linux с нуля: командная строка, права, сеть в VirtualBox',
    desc: 'Установка ВМ, настройка сети (NAT / Bridged), навигация, права доступа, процессы, пакеты и bash-скрипты — всё, что нужно уметь к 1 сентября.',
    tags: ['Linux', 'база', 'VirtualBox', 'bash', 'подготовка'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем это нужно уже на старте</h3>',
            '<p>Почти все инструменты ИБ (Nmap, Wireshark в консольном режиме, Metasploit, John the Ripper) нативно живут в Linux. Лабораторные работы, CTF-платформы и большинство серверов в реальной жизни — тоже Linux. Не разобравшись с этим на старте, вы будете тормозить на каждой практической паре.</p>',

            '<h3>1. Разворачиваем виртуальную машину</h3>',
            '<p>Самый безопасный способ учиться — не трогая основную ОС. Ставим <strong>VirtualBox</strong> + дистрибутив:</p>',
            '<ul>',
            '<li><strong>Ubuntu</strong> — если нужен привычный интерфейс и максимум обучающих материалов в сети.</li>',
            '<li><strong>Kali Linux</strong> — если хочется сразу окружение с предустановленными security-инструментами (Nmap, Wireshark, Burp, Metasploit).</li>',
            '</ul>',
            '<p>Для первого курса разумно: Ubuntu — чтобы освоить базу без перегруза, Kali — поставить отдельной ВМ позже, когда понадобятся конкретные инструменты.</p>',

            '<h3>2. Сеть в VirtualBox: NAT или Bridged</h3>',
            '<p>Частая проблема новичка — ВМ поднялась, а интернета внутри нет. Разбираемся, как настроить и почему.</p>',

            '<h4>2.1 NAT — просто и безопасно (вариант по умолчанию)</h4>',
            '<p>ВМ выходит в интернет через хост, как через роутер. Другие устройства в сети её не видят, с хоста по IP тоже не достучаться напрямую.</p>',
            App.createCodeBlock(
                'Настройки ВМ → Сеть → Адаптер 1\n  [x] Включить сетевой адаптер\n  Тип подключения: NAT',
                'plaintext'
            ),
            '<p>Подходит для 90% учебных задач: установка пакетов, практика Python, работа с локальными лабами.</p>',

            '<h4>2.2 Bridged Adapter — ВМ как отдельное устройство</h4>',
            '<p>ВМ получает IP напрямую от вашего роутера и видна в сети как отдельный компьютер. Нужно, когда практикуете сканирование сети (Nmap) или хотите, чтобы к ВМ можно было подключиться с телефона/другого ПК.</p>',
            App.createCodeBlock(
                'Настройки ВМ → Сеть → Адаптер 1\n  Тип подключения: Сетевой мост (Bridged Adapter)\n  Выбрать реальный интерфейс хоста (Wi-Fi / Ethernet)',
                'plaintext'
            ),

            '<h4>2.3 Если после этого всё равно нет интернета</h4>',
            '<ol>',
            '<li><strong>Guest Additions не установлены.</strong> Устройства → Подключить образ дополнений гостевой ОС → установить внутри ВМ, перезагрузить.</li>',
            '<li><strong>Интерфейс не поднят.</strong> Проверить: <code>ip a</code>. Если нет IP — <code>sudo dhclient -v</code> или через <code>nmtui</code>.</li>',
            '<li><strong>Проблема в DNS, а не в сети.</strong> Разделяем диагностику:</li>',
            '</ol>',
            App.createCodeBlock(
                'ping 8.8.8.8       # если работает — сеть есть\nping google.com    # если НЕ работает — проблема в DNS, правим /etc/resolv.conf',
                'bash'
            ),
            '<p><strong>Правило:</strong> для учёбы берите NAT по умолчанию — ВМ не торчит в сети и ничем не рискует. На Bridged переключайтесь осознанно, когда конкретная лаба требует, чтобы ВМ была видна как отдельный хост (например, сканировать её с другого устройства).</p>',

            '<h3>3. Навигация и файловая система</h3>',
            App.createCodeBlock(
                'pwd                 # где я\nls -la              # список файлов, включая скрытые, с правами\ncd /path/to/dir     # перейти\ncd ..               # на уровень выше\nmkdir project        # создать папку\ntouch file.txt       # создать пустой файл\ncp a.txt b.txt       # копировать\nmv a.txt folder/     # переместить / переименовать\nrm file.txt          # удалить файл\nrm -r folder/        # удалить папку рекурсивно\nfind . -name "*.py"  # поиск файлов\ngrep -r "TODO" .     # поиск текста внутри файлов',
                'bash'
            ),

            '<h3>4. Права доступа</h3>',
            '<p>В Linux у каждого файла есть владелец, группа и права на чтение (r), запись (w), выполнение (x) — отдельно для владельца, группы и остальных.</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Октальное</th><th style="padding:8px 10px;">Права</th><th style="padding:8px 10px;">Значение</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">7</td><td style="padding:6px 10px;">rwx</td><td style="padding:6px 10px;">чтение + запись + выполнение</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">6</td><td style="padding:6px 10px;">rw-</td><td style="padding:6px 10px;">чтение + запись</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">5</td><td style="padding:6px 10px;">r-x</td><td style="padding:6px 10px;">чтение + выполнение</td></tr>',
            '<tr><td style="padding:6px 10px;">4</td><td style="padding:6px 10px;">r--</td><td style="padding:6px 10px;">только чтение</td></tr>',
            '</tbody></table>',
            App.createCodeBlock(
                'chmod 755 script.sh     # rwx владельцу, r-x остальным\nchmod +x script.sh      # добавить право на выполнение\nchown user:group file   # сменить владельца и группу\nsudo command             # выполнить команду от root',
                'bash'
            ),

            '<h3>5. Процессы и пакеты</h3>',
            App.createCodeBlock(
                'ps aux              # список всех процессов\ntop                 # процессы в реальном времени (q — выход)\nkill 1234           # завершить процесс по PID\nkill -9 1234         # принудительно\n\nsudo apt update          # обновить список пакетов\nsudo apt install nmap    # установить пакет\nsudo apt remove nmap     # удалить пакет',
                'bash'
            ),

            '<h3>6. Bash-скрипты: минимум для автоматизации</h3>',
            App.createCodeBlock(
                '#!/bin/bash\n# Проверяем доступность списка хостов\n\nhosts=("8.8.8.8" "1.1.1.1" "192.168.1.1")\n\nfor host in "${hosts[@]}"; do\n    if ping -c 1 -W 1 "$host" &> /dev/null; then\n        echo "$host — доступен"\n    else\n        echo "$host — недоступен"\n    fi\ndone',
                'bash'
            ),
            '<p>Основные конструкции: переменные без пробелов вокруг <code>=</code>, условия <code>if [ ... ]; then ... fi</code>, циклы <code>for ... in ...; do ... done</code>. Для редактирования файлов в консоли достаточно освоить <code>nano</code> (просто), позже — базовые команды <code>vim</code> (<code>i</code> — вставка, <code>Esc</code> — выйти из режима вставки, <code>:wq</code> — сохранить и выйти).</p>',

            '<h3>Чек-лист: к 1 сентября вы должны уметь</h3>',
            '<ul>',
            '<li>Поднять ВМ и настроить сеть (NAT или Bridged) без посторонней помощи.</li>',
            '<li>Свободно перемещаться по файловой системе и работать с правами доступа.</li>',
            '<li>Установить пакет через apt, посмотреть и завершить процесс.</li>',
            '<li>Написать и запустить простой bash-скрипт с циклом и условием.</li>',
            '</ul>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Практическое закрепление — в разделе «Практика»: <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 101)">Лабораторная 1 — разворачиваем Linux-окружение</a>.</p>'
        ].join('');
    }
});
