// ============ notes/note-6.js — СЕТИ TCP/IP НА ПАЛЬЦАХ ============

KERNEL_DATA.addNote({
    id: 6,
    section: 'notes',
    title: 'Сети TCP/IP на пальцах',
    desc: 'Модель OSI, IP-адресация и маски подсети, порты и сокеты, TCP-рукопожатие, диагностика ping/traceroute/netstat/DNS.',
    tags: ['сети', 'база', 'TCP/IP', 'подготовка'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем это первокурснику</h3>',
            '<p>Половина предметов по ИБ (защита сетей, анализ трафика, пентест) опирается на понимание того, как данные вообще передаются по сети. Без этого фундамента Wireshark и Nmap (см. соответствующие конспекты) превращаются в набор непонятных команд.</p>',

            '<h3>1. Модель OSI — не зубрить, а понимать зачем</h3>',
            '<p>7 уровней описывают путь данных от приложения до физического кабеля и обратно. Каждый уровень решает свою задачу и не знает, что происходит на других.</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">#</th><th style="padding:8px 10px;">Уровень</th><th style="padding:8px 10px;">Пример</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">7</td><td style="padding:6px 10px;">Приложения</td><td style="padding:6px 10px;">HTTP, DNS, FTP</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">6</td><td style="padding:6px 10px;">Представления</td><td style="padding:6px 10px;">SSL/TLS, кодировки</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">5</td><td style="padding:6px 10px;">Сеансовый</td><td style="padding:6px 10px;">Сессии, RPC</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">4</td><td style="padding:6px 10px;">Транспортный</td><td style="padding:6px 10px;">TCP, UDP</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">3</td><td style="padding:6px 10px;">Сетевой</td><td style="padding:6px 10px;">IP, маршрутизация</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">2</td><td style="padding:6px 10px;">Канальный</td><td style="padding:6px 10px;">MAC-адреса, коммутаторы</td></tr>',
            '<tr><td style="padding:6px 10px;">1</td><td style="padding:6px 10px;">Физический</td><td style="padding:6px 10px;">Кабель, радиосигнал</td></tr>',
            '</tbody></table>',
            '<p>На практике для ИБ важнее всего уровни 3 и 4 (IP и TCP/UDP) — именно с ними работают Nmap, Wireshark и большинство атак.</p>',

            '<h3>2. IP-адресация и маски подсети</h3>',
            '<p>IPv4-адрес — 4 байта, например <code>192.168.1.10</code>. Маска подсети определяет, какая часть адреса — это сеть, а какая — конкретный хост.</p>',
            App.createCodeBlock(
                '192.168.1.10  /24   →   маска 255.255.255.0\n              │\n              └─ первые 24 бита (192.168.1.x) — сеть, последние 8 бит — хост\n                 в такой подсети доступно 254 адреса для хостов (256 - сеть - broadcast)',
                'plaintext'
            ),
            '<p>Частые маски: <code>/24</code> (254 хоста), <code>/16</code> (65534 хоста), <code>/8</code> (крупная сеть). Приватные диапазоны, которые никогда не маршрутизируются в интернет: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>.</p>',

            '<h3>3. Порты и сокеты</h3>',
            '<p><strong>Порт</strong> — число от 0 до 65535, определяющее, какому приложению на хосте предназначены данные. <strong>Сокет</strong> — связка IP + порт + протокол, уникально идентифицирующая соединение.</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Порт</th><th style="padding:8px 10px;">Сервис</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">22</td><td style="padding:6px 10px;">SSH — удалённый доступ</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">53</td><td style="padding:6px 10px;">DNS — разрешение имён</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">80 / 443</td><td style="padding:6px 10px;">HTTP / HTTPS — веб</td></tr>',
            '<tr><td style="padding:6px 10px;">3389</td><td style="padding:6px 10px;">RDP — удалённый рабочий стол</td></tr>',
            '</tbody></table>',

            '<h3>4. TCP-рукопожатие (Three-Way Handshake)</h3>',
            '<p>TCP устанавливает соединение до передачи данных — в отличие от UDP, который просто отправляет пакеты без гарантий доставки.</p>',
            App.createCodeBlock(
                'Клиент                          Сервер\n   │──────── SYN ─────────────────▶│   "хочу соединение, мой seq = X"\n   │◀─────── SYN-ACK ───────────────│   "принимаю, мой seq = Y, подтверждаю X"\n   │──────── ACK ──────────────────▶│   "подтверждаю Y, соединение установлено"\n\nЗакрытие соединения — похожим образом, но флагами FIN/ACK.',
                'plaintext'
            ),
            '<p>Именно на этом основано SYN-сканирование в Nmap (<code>-sS</code>) — отправляется SYN, но рукопожатие не завершается, что делает сканирование быстрее и менее заметным.</p>',

            '<h3>5. Диагностика сети: базовые команды</h3>',
            App.createCodeBlock(
                'ping 8.8.8.8              # доступен ли хост, задержка\ntraceroute google.com    # путь пакета до хоста (tracert в Windows)\nnetstat -tulnp            # какие порты слушает локальная машина\nss -tulnp                 # современный аналог netstat\nip a                       # сетевые интерфейсы и их IP\nnslookup google.com       # проверить DNS-резолвинг',
                'bash'
            ),
            '<p>Разделяйте диагностику по уровням: <code>ping IP</code> проверяет уровень 3 (доступность сети), <code>ping домен</code> дополнительно проверяет DNS — если первое работает, а второе нет, проблема именно в резолвинге имён.</p>',

            '<h3>Чек-лист: что вы должны уметь</h3>',
            '<ul>',
            '<li>Объяснить своими словами, зачем нужна модель OSI и что происходит на уровнях 3-4.</li>',
            '<li>Посчитать, сколько хостов помещается в подсеть <code>/24</code>, <code>/28</code>.</li>',
            '<li>Нарисовать по памяти TCP three-way handshake.</li>',
            '<li>Продиагностировать «нет интернета» через ping → traceroute → nslookup.</li>',
            '</ul>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Дальше — переходите к практике анализа трафика: <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 2)">конспект по Wireshark</a> и <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 3)">конспект по Nmap</a>.</p>'
        ].join('');
    }
});
