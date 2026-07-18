// ============ notes/note-3.js — NMAP: МЕГА-КОНСПЕКТ ============

KERNEL_DATA.addNote({
    id: 3,
    section: 'notes',
    title: 'Nmap: полное руководство по сканированию',
    desc: 'Типы сканирования, NSE-скрипты, обход IDS/IPS, анализ результатов, автоматизация пентеста.',
    tags: ['практика', 'сети', 'Nmap', 'сканирование', 'NSE', 'пентест'],
    date: '2026',
    content: function() {

        return [
            // ============================================================
            // 1. ВВЕДЕНИЕ В NMAP
            // ============================================================
            '<h3>1. Что такое Nmap</h3>',
            '<p><strong>Nmap (Network Mapper)</strong> — это утилита с открытым исходным кодом для исследования сети и аудита безопасности. Разработана Гордоном Лайоном (Fyodor) и впервые опубликована в 1997 году. Nmap — это швейцарский нож пентестера и сетевого администратора. Он позволяет:</p>',
            '<ul>',
            '<li>Обнаруживать активные хосты в сети (host discovery).</li>',
            '<li>Сканировать порты для определения открытых сервисов (port scanning).</li>',
            '<li>Определять версии запущенных сервисов и ОС (service/OS detection).</li>',
            '<li>Запускать скрипты для расширенного анализа (NSE — Nmap Scripting Engine).</li>',
            '<li>Обходить IDS/IPS и файерволы (фрагментация, decoy, тайминг).</li>',
            '</ul>',
            '<p><strong>Установка:</strong> Nmap предустановлен в Kali Linux. На других системах: <code>sudo apt install nmap</code> (Ubuntu/Debian) или скачать с <a href="https://nmap.org/download.html" target="_blank">nmap.org</a>.</p>',

            '<h3>2. Базовое использование</h3>',
            '<p>Простейшее сканирование:</p>',
            App.createCodeBlock(
                '# Сканирование одного IP\nnmap 192.168.1.1\n\n# Сканирование подсети\nnmap 192.168.1.0/24\n\n# Сканирование диапазона IP\nnmap 192.168.1.1-100\n\n# Сканирование списка хостов\nnmap 192.168.1.1,15,23,45\n\n# Сканирование из файла\nnmap -iL targets.txt',
                'bash'
            ),

            // ============================================================
            // 3. ОБНАРУЖЕНИЕ ХОСТОВ (Host Discovery)
            // ============================================================
            '<h3>3. Обнаружение хостов (Host Discovery)</h3>',
            '<p>Перед сканированием портов Nmap должен определить, какие хосты активны. По умолчанию используются ICMP Echo Request (ping) и TCP SYN на порт 443, но это можно настраивать:</p>',

            '<h4>3.1 Типы ping-сканирований</h4>',
            App.createCodeBlock(
                '# ICMP Echo (стандартный ping)\nnmap -PE 192.168.1.0/24\n\n# ICMP Timestamp Request (обходит некоторые фаерволы)\nnmap -PP 192.168.1.0/24\n\n# ICMP Netmask Request\nnmap -PM 192.168.1.0/24\n\n# TCP SYN ping (на порт 80)\nnmap -PS80 192.168.1.0/24\n\n# TCP ACK ping\nnmap -PA443 192.168.1.0/24\n\n# UDP ping\nnmap -PU53 192.168.1.0/24\n\n# ARP ping (только в локальной сети)\nnmap -PR 192.168.1.0/24\n\n# Комбинированное обнаружение\nnmap -PE -PS80,443 -PA3389 192.168.1.0/24',
                'bash'
            ),

            '<h4>3.2 Отключение обнаружения (No Ping)</h4>',
            '<p>Если вы точно знаете, что хост активен, можно пропустить этап обнаружения для ускорения:</p>',
            App.createCodeBlock(
                '# Сканировать все указанные хосты как активные\nnmap -Pn 192.168.1.0/24\n\n# Полезно, когда фаервол блокирует ICMP',
                'bash'
            ),

            // ============================================================
            // 4. ТЕХНИКИ СКАНИРОВАНИЯ ПОРТОВ
            // ============================================================
            '<h3>4. Техники сканирования портов</h3>',
            '<p>Это ядро Nmap. Существует более десятка техник сканирования. Выбор техники влияет на скорость, скрытность и точность.</p>',

            '<h4>4.1 SYN-сканирование (Half-Open, Stealth)</h4>',
            '<p>Флаг: <code>-sS</code>. Самый популярный и быстрый метод. Nmap отправляет SYN-пакет. Если приходит SYN-ACK — порт открыт, если RST — закрыт, если нет ответа — фильтруется. Nmap не завершает рукопожатие (отправляет RST). Не логируется многими приложениями.</p>',
            App.createCodeBlock('nmap -sS 192.168.1.1', 'bash'),

            '<h4>4.2 TCP Connect-сканирование</h4>',
            '<p>Флаг: <code>-sT</code>. Используется, когда SYN-сканирование недоступно (нет raw socket прав). Nmap завершает полное TCP-рукопожатие для каждого порта. Медленнее и заметнее.</p>',
            App.createCodeBlock('nmap -sT 192.168.1.1', 'bash'),

            '<h4>4.3 UDP-сканирование</h4>',
            '<p>Флаг: <code>-sU</code>. Сканирует UDP-порты. Работает медленно, так как UDP не имеет подтверждений. Nmap отправляет UDP-пакет, если приходит ICMP Port Unreachable — порт закрыт, если нет ответа — открыт или фильтруется.</p>',
            App.createCodeBlock('nmap -sU 192.168.1.1', 'bash'),

            '<h4>4.4 FIN, NULL, XMAS-сканирования</h4>',
            '<p>Основаны на RFC 793: на закрытый порт приходит RST, на открытый — нет ответа. Обходят простые фильтры, но не работают против Windows (отправляет RST всегда).</p>',
            App.createCodeBlock(
                '# FIN-сканирование (-sF)\nnmap -sF 192.168.1.1\n\n# NULL-сканирование (нет флагов, -sN)\nnmap -sN 192.168.1.1\n\n# XMAS-сканирование (FIN, PSH, URG, -sX)\nnmap -sX 192.168.1.1',
                'bash'
            ),

            '<h4>4.5 Сравнительная таблица техник сканирования</h4>',
            '<div style="overflow-x: auto;">',
            '<table style="border-collapse: collapse; width: 100%; font-size: 14px;">',
            '<tr style="background: #eee;">',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Техника</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Флаг</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Скрытность</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Скорость</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Примечание</th>',
            '</tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">SYN (Half-Open)</td><td style="border: 1px solid #ccc; padding: 8px;">-sS</td><td style="border: 1px solid #ccc; padding: 8px;">Высокая</td><td style="border: 1px solid #ccc; padding: 8px;">Быстро</td><td style="border: 1px solid #ccc; padding: 8px;">Дефолт, нужны raw socket</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">TCP Connect</td><td style="border: 1px solid #ccc; padding: 8px;">-sT</td><td style="border: 1px solid #ccc; padding: 8px;">Низкая</td><td style="border: 1px solid #ccc; padding: 8px;">Медленно</td><td style="border: 1px solid #ccc; padding: 8px;">Без raw socket</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">UDP</td><td style="border: 1px solid #ccc; padding: 8px;">-sU</td><td style="border: 1px solid #ccc; padding: 8px;">Средняя</td><td style="border: 1px solid #ccc; padding: 8px;">Очень медленно</td><td style="border: 1px solid #ccc; padding: 8px;">Для DNS, SNMP</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">FIN</td><td style="border: 1px solid #ccc; padding: 8px;">-sF</td><td style="border: 1px solid #ccc; padding: 8px;">Высокая</td><td style="border: 1px solid #ccc; padding: 8px;">Средне</td><td style="border: 1px solid #ccc; padding: 8px;">Не работает на Windows</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">NULL</td><td style="border: 1px solid #ccc; padding: 8px;">-sN</td><td style="border: 1px solid #ccc; padding: 8px;">Высокая</td><td style="border: 1px solid #ccc; padding: 8px;">Средне</td><td style="border: 1px solid #ccc; padding: 8px;">Не работает на Windows</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">XMAS</td><td style="border: 1px solid #ccc; padding: 8px;">-sX</td><td style="border: 1px solid #ccc; padding: 8px;">Высокая</td><td style="border: 1px solid #ccc; padding: 8px;">Средне</td><td style="border: 1px solid #ccc; padding: 8px;">Не работает на Windows</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">ACK</td><td style="border: 1px solid #ccc; padding: 8px;">-sA</td><td style="border: 1px solid #ccc; padding: 8px;">Высокая</td><td style="border: 1px solid #ccc; padding: 8px;">Быстро</td><td style="border: 1px solid #ccc; padding: 8px;">Для маппинга файерволов</td></tr>',
            '</table>',
            '</div>',

            // ============================================================
            // 5. ОБНАРУЖЕНИЕ СЕРВИСОВ И ОС
            // ============================================================
            '<h3>5. Обнаружение сервисов и ОС</h3>',

            '<h4>5.1 Определение версий сервисов</h4>',
            '<p>Флаг: <code>-sV</code>. Nmap опрашивает открытые порты и пытается определить, какой сервис и какой версии на них работает. Использует базу сигнатур <code>nmap-service-probes</code>.</p>',
            App.createCodeBlock(
                '# Базовое определение версий\nnmap -sV 192.168.1.1\n\n# Интенсивное сканирование (больше запросов, точнее)\nnmap -sV --version-intensity 9 192.168.1.1\n\n# Лёгкое сканирование (быстрее, но менее точно)\nnmap -sV --version-intensity 2 192.168.1.1',
                'bash'
            ),

            '<h4>5.2 Определение ОС</h4>',
            '<p>Флаг: <code>-O</code>. Nmap анализирует ответы хоста (TTL, TCP window size, флаги) и сравнивает с базой сигнатур ОС.</p>',
            App.createCodeBlock(
                '# Базовое определение ОС\nnmap -O 192.168.1.1\n\n# Комбинированное определение (ОС + сервисы + скрипты)\nnmap -A 192.168.1.1\n\n# Агрессивное сканирование = -O -sV -sC --traceroute\nnmap -A 192.168.1.1',
                'bash'
            ),

            // ============================================================
            // 6. NSE — NMAP SCRIPTING ENGINE
            // ============================================================
            '<h3>6. NSE — Nmap Scripting Engine</h3>',
            '<p>NSE — это встроенный в Nmap интерпретатор Lua, позволяющий запускать скрипты для автоматизации расширенного анализа. Скрипты находятся в <code>/usr/share/nmap/scripts/</code> и разделены на категории:</p>',
            '<ul>',
            '<li><strong>safe</strong> — безопасные, не нарушают работу сервиса.</li>',
            '<li><strong>intrusive</strong> — агрессивные, могут вызвать сбои.</li>',
            '<li><strong>vuln</strong> — проверка уязвимостей.</li>',
            '<li><strong>exploit</strong> — эксплуатация уязвимостей.</li>',
            '<li><strong>auth</strong> — обход аутентификации.</li>',
            '<li><strong>brute</strong> — брутфорс.</li>',
            '<li><strong>discovery</strong> — обнаружение сервисов.</li>',
            '<li><strong>default</strong> — скрипты по умолчанию (<code>-sC</code>).</li>',
            '</ul>',

            '<h4>6.1 Запуск скриптов</h4>',
            App.createCodeBlock(
                '# Запуск скриптов по умолчанию (категория default)\nnmap -sC 192.168.1.1\n\n# Запуск конкретного скрипта\nnmap --script http-title 192.168.1.1\n\n# Запуск всех скриптов категории\nnmap --script vuln 192.168.1.1\n\n# Запуск нескольких категорий\nnmap --script "default,safe,vuln" 192.168.1.1\n\n# Запуск с аргументами\nnmap --script http-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.1\n\n# Обновление базы скриптов\nnmap --script-updatedb',
                'bash'
            ),

            '<h4>6.2 Основные категории NSE-скриптов</h4>',
            '<div style="overflow-x: auto;">',
            '<table style="border-collapse: collapse; width: 100%; font-size: 14px;">',
            '<tr style="background: #eee;">',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Категория</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Описание</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Примеры скриптов</th>',
            '</tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">default</td><td style="border: 1px solid #ccc; padding: 8px;">Запускаются с флагом -sC</td><td style="border: 1px solid #ccc; padding: 8px;">http-title, ssh-hostkey</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">vuln</td><td style="border: 1px solid #ccc; padding: 8px;">Проверка уязвимостей</td><td style="border: 1px solid #ccc; padding: 8px;">http-shellshock, ssl-heartbleed, smb-vuln-ms17-010</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">auth</td><td style="border: 1px solid #ccc; padding: 8px;">Обход аутентификации</td><td style="border: 1px solid #ccc; padding: 8px;">http-auth, ftp-anon</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">brute</td><td style="border: 1px solid #ccc; padding: 8px;">Брутфорс-атаки</td><td style="border: 1px solid #ccc; padding: 8px;">http-brute, ssh-brute, ftp-brute</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">discovery</td><td style="border: 1px solid #ccc; padding: 8px;">Обнаружение сервисов</td><td style="border: 1px solid #ccc; padding: 8px;">dns-zone-transfer, smb-enum-shares</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">safe</td><td style="border: 1px solid #ccc; padding: 8px;">Безопасные скрипты</td><td style="border: 1px solid #ccc; padding: 8px;">http-headers, whois-ip</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">exploit</td><td style="border: 1px solid #ccc; padding: 8px;">Эксплуатация уязвимостей</td><td style="border: 1px solid #ccc; padding: 8px;">http-shellshock, smb-vuln-ms08-067</td></tr>',
            '</table>',
            '</div>',

            '<h4>6.3 Полезные NSE-скрипты</h4>',
            App.createCodeBlock(
                '# Проверка HTTP-заголовков безопасности\nnmap --script http-security-headers -p 80,443 target.com\n\n# Перебор директорий на веб-сервере\nnmap --script http-enum -p 80,443 target.com\n\n# Проверка на Heartbleed (CVE-2014-0160)\nnmap --script ssl-heartbleed -p 443 target.com\n\n# Проверка на Shellshock (CVE-2014-6271)\nnmap --script http-shellshock --script-args uri=/cgi-bin/test.cgi -p 80 target.com\n\n# Получение информации о SMB-сервере\nnmap --script smb-os-discovery,smb-enum-shares -p 445 target.com\n\n# Проверка EternalBlue (MS17-010)\nnmap --script smb-vuln-ms17-010 -p 445 target.com\n\n# Брутфорс SSH\nnmap --script ssh-brute --script-args userdb=users.txt -p 22 target.com',
                'bash'
            ),

            // ============================================================
            // 7. УПРАВЛЕНИЕ СКОРОСТЬЮ И ТАЙМИНГОМ
            // ============================================================
            '<h3>7. Управление скоростью и таймингом</h3>',

            '<h4>7.1 Шаблоны тайминга (-T)</h4>',
            App.createCodeBlock(
                '# Параноидальный (1 порт/5 мин)\nnmap -T0 192.168.1.1\n\n# Осторожный (1 порт/6 сек)\nnmap -T1 192.168.1.1\n\n# Вежливый (1 порт/0.4 сек)\nnmap -T2 192.168.1.1\n\n# Нормальный (по умолчанию)\nnmap -T3 192.168.1.1\n\n# Агрессивный (сканирует быстро)\nnmap -T4 192.168.1.1\n\n# Безумный (максимальная скорость, возможны потери)\nnmap -T5 192.168.1.1',
                'bash'
            ),

            '<h4>7.2 Ручное управление таймингом</h4>',
            App.createCodeBlock(
                '# Минимальная задержка между пакетами\nnmap --scan-delay 1s 192.168.1.1\n\n# Максимальное количество параллельных запросов\nnmap --max-parallelism 100 192.168.1.1\n\n# Таймаут ожидания ответа\nnmap --host-timeout 10m 192.168.1.1',
                'bash'
            ),

            // ============================================================
            // 8. ОБХОД IDS/IPS И ФАЕРВОЛОВ
            // ============================================================
            '<h3>8. Обход IDS/IPS и фаерволов</h3>',

            '<h4>8.1 Фрагментация пакетов</h4>',
            '<p>Разбивает TCP-заголовок на несколько пакетов, усложняя детектирование:</p>',
            App.createCodeBlock(
                '# Фрагментация на 8 байт\nnmap -f 192.168.1.1\n\n# Фрагментация с указанием MTU\nnmap --mtu 16 192.168.1.1',
                'bash'
            ),

            '<h4>8.2 Decoy-сканирование (подставные хосты)</h4>',
            '<p>Nmap отправляет пакеты от имени нескольких IP-адресов, маскируя реальный сканирующий хост:</p>',
            App.createCodeBlock(
                '# Подставные хосты (реальный хост среди них)\nnmap -D RND:10 192.168.1.1\n\n# Явное указание decoy-хостов\nnmap -D 10.0.0.1,10.0.0.2,ME 192.168.1.1',
                'bash'
            ),

            '<h4>8.3 Смена source port и MAC-адреса</h4>',
            App.createCodeBlock(
                '# Использовать определённый source port\nnmap --source-port 53 192.168.1.1\n\n# Подмена MAC-адреса (только в локальной сети)\nnmap --spoof-mac 00:11:22:33:44:55 192.168.1.1\n\n# Случайный MAC\nnmap --spoof-mac 0 192.168.1.1',
                'bash'
            ),

            // ============================================================
            // 9. ВЫВОД И АНАЛИЗ РЕЗУЛЬТАТОВ
            // ============================================================
            '<h3>9. Вывод и анализ результатов</h3>',

            '<h4>9.1 Форматы вывода</h4>',
            App.createCodeBlock(
                '# Нормальный вывод (на экран)\nnmap 192.168.1.1\n\n# XML-вывод (для автоматизации)\nnmap -oX scan.xml 192.168.1.1\n\n# Grepable-вывод (для парсинга)\nnmap -oG scan.gnmap 192.168.1.1\n\n# Все форматы сразу\nnmap -oA scan_results 192.168.1.1\n# Создаст: scan_results.nmap, scan_results.xml, scan_results.gnmap',
                'bash'
            ),

            '<h4>9.2 Парсинг XML-вывода</h4>',
            App.createCodeBlock(
                '# Извлечь все открытые порты из XML\npython3 -c "\nimport xml.etree.ElementTree as ET\ntree = ET.parse('scan.xml')\nroot = tree.getroot()\nfor host in root.findall('host'):\n    ip = host.find('address').get('addr')\n    for port in host.findall('.//port'):\n        if port.find('state').get('state') == 'open':\n            print(f'{ip}:{port.get(\"portid\")}/tcp')\n"\n\n# С помощью ndiff (сравнение двух сканов)\nndiff scan1.xml scan2.xml',
                'bash'
            ),

            // ============================================================
            // 10. ПРАКТИЧЕСКИЕ ПРИМЕРЫ
            // ============================================================
            '<h3>10. Практические примеры</h3>',

            '<h4>10.1 Быстрый аудит веб-сервера</h4>',
            App.createCodeBlock('nmap -sV -sC --script http-enum,http-headers,http-methods -p 80,443 target.com', 'bash'),

            '<h4>10.2 Полный аудит Windows-сервера</h4>',
            App.createCodeBlock('nmap -sS -sV -O --script smb-vuln-ms17-010,smb-enum-shares,smb-os-discovery -p 135,139,445,3389 target.com', 'bash'),

            '<h4>10.3 Обнаружение всех хостов в сети</h4>',
            App.createCodeBlock('nmap -sn 192.168.1.0/24', 'bash'),

            '<h4>10.4 Сканирование топ-100 портов</h4>',
            App.createCodeBlock('nmap --top-ports 100 192.168.1.1', 'bash'),

            // ============================================================
            // 11. ПРАКТИКУМ ПО NMAP
            // ============================================================
            '<h3>11. Практикум по Nmap</h3>',
            '<p><strong>Задание 1:</strong> Выполните SYN-сканирование локальной подсети и определите все активные хосты с открытыми портами.</p>',
            '<p><strong>Решение:</strong> <code>nmap -sS -Pn 192.168.1.0/24</code></p>',

            '<p><strong>Задание 2:</strong> Запустите NSE-скрипт http-enum против веб-сервера и найдите скрытые директории.</p>',
            '<p><strong>Решение:</strong> <code>nmap --script http-enum -p 80,443 target.com</code></p>',

            '<p><strong>Задание 3:</strong> Создайте decoy-сканирование с 5 подставными хостами и определите, логирует ли цель ваш реальный IP.</p>',
            '<p><strong>Решение:</strong> <code>nmap -D RND:5 192.168.1.1</code></p>',

            '<p><strong>Задание 4:</strong> Просканируйте UDP-порты DNS-сервера и определите версию BIND.</p>',
            '<p><strong>Решение:</strong> <code>nmap -sU -sV -p 53 192.168.1.1</code></p>',

            // ============================================================
            // 12. ШПАРГАЛКА ПО NMAP
            // ============================================================
            '<h3>12. Шпаргалка по Nmap</h3>',
            App.createCodeBlock(
                '# ===== ОБНАРУЖЕНИЕ ХОСТОВ =====\nnmap -sn 192.168.1.0/24          # Ping scan (только живые хосты)\nnmap -Pn 192.168.1.1             # Пропустить обнаружение\n\n# ===== ТЕХНИКИ СКАНИРОВАНИЯ =====\nnmap -sS 192.168.1.1             # SYN scan (stealth)\nnmap -sT 192.168.1.1             # TCP Connect scan\nnmap -sU 192.168.1.1             # UDP scan\nnmap -sF 192.168.1.1             # FIN scan\nnmap -sN 192.168.1.1             # NULL scan\nnmap -sX 192.168.1.1             # XMAS scan\nnmap -sA 192.168.1.1             # ACK scan (маппинг фаервола)\n\n# ===== ОПРЕДЕЛЕНИЕ СЕРВИСОВ И ОС =====\nnmap -sV 192.168.1.1             # Версии сервисов\nnmap -O 192.168.1.1              # Определение ОС\nnmap -A 192.168.1.1              # Агрессивное (ОС + сервисы + скрипты)\n\n# ===== NSE-СКРИПТЫ =====\nnmap -sC 192.168.1.1             # Скрипты по умолчанию\nnmap --script vuln 192.168.1.1   # Проверка уязвимостей\nnmap --script http-enum -p 80,443 target.com\n\n# ===== ТАЙМИНГ =====\nnmap -T4 192.168.1.1             # Агрессивный тайминг\n\n# ===== ОБХОД ЗАЩИТЫ =====\nnmap -f 192.168.1.1              # Фрагментация\nnmap -D RND:10 192.168.1.1       # Decoy-сканирование\nnmap --spoof-mac 0 192.168.1.1   # Случайный MAC\n\n# ===== ВЫВОД =====\nnmap -oA results 192.168.1.1     # Все форматы вывода',
                'bash'
            ),

            // ============================================================
            // 13. ЗАКЛЮЧЕНИЕ
            // ============================================================
            '<h3>13. Заключение</h3>',
            '<p>Nmap — фундаментальный инструмент для пентестера. Ключевые принципы работы с ним:</p>',
            '<ol>',
            '<li><strong>Начинайте с пассивного сбора:</strong> сначала определите живые хосты (ping scan), затем порты, затем сервисы.</li>',
            '<li><strong>Используйте NSE:</strong> скрипты автоматизируют рутину и позволяют быстро находить уязвимости.</li>',
            '<li><strong>Контролируйте скорость:</strong> в реальных пентестах используйте -T2 или -T3, чтобы не перегружать сеть и не тригерить IDS.</li>',
            '<li><strong>Документируйте результаты:</strong> всегда сохраняйте вывод в XML/Grepable для отчётов и парсинга.</li>',
            '<li><strong>Комбинируйте техники:</strong> SYN + UDP + NSE дают полную картину поверхности атаки.</li>',
            '</ol>',
            '<p><strong>Полезные ссылки:</strong></p>',
            '<ul>',
            '<li><a href="https://nmap.org/book/" target="_blank">Официальная книга Nmap (бесплатно)</a></li>',
            '<li><a href="https://nmap.org/nsedoc/" target="_blank">Документация по NSE-скриптам</a></li>',
            '<li><a href="https://github.com/nmap/nmap" target="_blank">Репозиторий Nmap на GitHub</a></li>',
            '</ul>'
        ].join('');
    }
});
