// ============ notes/note-2.js — Wireshark: МЕГА-КОНСПЕКТ ============

KERNEL_DATA.addNote({
    id: 2,
    section: 'notes',
    title: 'Wireshark: полный курс анализа трафика',
    desc: 'TCP/IP, рукопожатия, TLS, фильтры, tshark, статистика, поиск атак, форензика, цветовые правила, экспорт объектов и автоматизация.',
    tags: ['практика', 'сети', 'Wireshark', 'TCP', 'TLS', 'форензика', 'анализ'],
    date: '2026',
    content: function() {

        // Вспомогательные CSS-стили для конспекта
        const styles = `
            <style>
                .ws-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .ws-table th {
                    background: #2c3e50;
                    color: white;
                    padding: 10px 12px;
                    text-align: left;
                    font-weight: 600;
                }
                .ws-table td {
                    border: 1px solid #ddd;
                    padding: 8px 12px;
                }
                .ws-table tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .ws-table tr:hover {
                    background: #e8f4f8;
                }
                .ws-diagram {
                    background: #1a1a2e;
                    color: #e0e0e0;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 15px 0;
                    overflow-x: auto;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .ws-diagram .client { color: #66bbff; font-weight: bold; }
                .ws-diagram .server { color: #ff6b6b; font-weight: bold; }
                .ws-diagram .state { color: #ffd93d; }
                .ws-diagram .arrow { color: #888; }
                .ws-diagram .comment { color: #6c757d; font-style: italic; }
                .ws-packet-header {
                    background: #f0f4f8;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    overflow-x: auto;
                }
                .ws-bit-table {
                    border-collapse: collapse;
                    font-size: 11px;
                    margin: 10px 0;
                }
                .ws-bit-table td {
                    border: 1px solid #999;
                    padding: 4px 8px;
                    text-align: center;
                    min-width: 28px;
                }
                .ws-bit-table .header-row td {
                    background: #2c3e50;
                    color: #fff;
                    font-weight: bold;
                }
                .ws-bit-table .field-label {
                    background: #e8ecf0;
                    font-weight: bold;
                    text-align: right;
                    padding-right: 10px;
                }
                .ws-state-box {
                    display: inline-block;
                    padding: 8px 14px;
                    margin: 4px;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 13px;
                }
                .ws-state-established { background: #d4edda; color: #155724; border: 2px solid #28a745; }
                .ws-state-syn { background: #fff3cd; color: #856404; border: 2px solid #ffc107; }
                .ws-state-fin { background: #f8d7da; color: #721c24; border: 2px solid #dc3545; }
                .ws-state-closed { background: #e2e3e5; color: #383d41; border: 2px solid #6c757d; }
                .ws-flag-table td:first-child {
                    font-family: monospace;
                    font-weight: bold;
                    background: #f0f0f0;
                }
            </style>
        `;

        return [
            styles,

            // ============================================================
            // 1. ВВЕДЕНИЕ В WIRESHARK
            // ============================================================
            '<h3>1. Что такое Wireshark</h3>',
            '<p><strong>Wireshark</strong> — это анализатор сетевых протоколов с открытым исходным кодом. Он захватывает пакеты с сетевого интерфейса и позволяет детально изучить их содержимое. Программа работает на Windows, Linux и macOS, поддерживает более 3000 протоколов и является де-факто стандартом для анализа сетевого трафика.</p>',
            '<p>Wireshark был создан Джеральдом Комбсом в 1998 году под названием Ethereal. В 2006 году проект был переименован из-за проблем с торговой маркой. Сегодня Wireshark развивается при поддержке фонда Wireshark Foundation и сообщества разработчиков по всему миру.</p>',
            '<p>Для специалиста по информационной безопасности Wireshark — это <strong>микроскоп</strong>. Вы видите каждый бит, который компьютер отправляет в сеть и получает из неё. С помощью Wireshark можно:</p>',
            '<ul>',
            '<li>Обнаруживать и анализировать сетевые атаки: сканирование портов, ARP-спуфинг, SYN-флуд, DNS/ICMP-туннелирование, TCP session hijacking.</li>',
            '<li>Расследовать инциденты информационной безопасности — восстанавливать хронологию действий злоумышленника по дампу трафика.</li>',
            '<li>Отлаживать сетевые приложения — видеть, какие запросы уходят и какие ответы приходят на каждом уровне модели OSI.</li>',
            '<li>Изучать работу сетевых протоколов — TCP-рукопожатие, TLS-установка, HTTP-запросы, DNS-резолвинг — всё это видно в Wireshark своими глазами.</li>',
            '</ul>',
            '<p>В Kali Linux Wireshark предустановлен. Для установки на других системах: <code>sudo apt install wireshark</code> (Ubuntu/Debian) или скачать с <a href="https://www.wireshark.org/download.html" target="_blank">wireshark.org</a>.</p>',

            '<h3>2. Как работает захват трафика</h3>',
            '<p>Wireshark использует библиотеку <strong>libpcap</strong> (Linux/macOS) или <strong>Npcap</strong> (Windows) для перехвата пакетов на сетевом интерфейсе. Когда вы начинаете захват, сетевая карта переводится в <strong>promiscuous mode</strong> (неразборчивый режим) — она принимает все пакеты, которые физически видит в сетевом сегменте, а не только адресованные ей.</p>',
            '<p><strong>Важное ограничение:</strong> в современных коммутируемых сетях (Ethernet-коммутаторы) каждый порт получает только трафик, адресованный подключённому устройству, плюс broadcast-трафик. Чтобы видеть весь трафик сети, необходимо:</p>',
            '<ul>',
            '<li><strong>SPAN-порт (Port Mirroring)</strong> — настроить коммутатор на копирование трафика с одного или нескольких портов на порт, к которому подключён анализатор.</li>',
            '<li><strong>Network TAP (Test Access Point)</strong> — аппаратное устройство, которое пассивно копирует трафик между двумя точками сети.</li>',
            '<li><strong>ARP-спуфинг</strong> — атака «человек посередине», при которой злоумышленник подменяет ARP-таблицы, заставляя трафик проходить через свой компьютер. В Kali Linux для этого используется <code>arpspoof</code> из пакета dsniff.</li>',
            '</ul>',
            '<p><strong>Режимы захвата Wi-Fi:</strong></p>',
            '<table class="ws-table">',
            '<tr><th>Режим</th><th>Описание</th><th>Активация</th></tr>',
            '<tr><td><strong>Promiscuous mode</strong></td><td>Принимаются все пакеты, которые видит Wi-Fi-адаптер в рамках своей сети</td><td>По умолчанию при захвате</td></tr>',
            '<tr><td><strong>Monitor mode</strong></td><td>Слушает все беспроводные кадры на выбранном канале, включая другие сети и управляющие кадры (beacon, probe request/response)</td><td><code>airmon-ng start wlan0</code> → <code>wlan0mon</code></td></tr>',
            '</table>',

            '<h3>3. Интерфейс Wireshark</h3>',
            '<p>Главное окно Wireshark состоит из трёх панелей и строки фильтра:</p>',
            '<table class="ws-table">',
            '<tr><th>Элемент</th><th>Расположение</th><th>Назначение</th></tr>',
            '<tr><td><strong>Строка фильтра</strong></td><td>Вверху</td><td>Display filter. Зелёный = корректен, красный = ошибка</td></tr>',
            '<tr><td><strong>Packet List</strong></td><td>Верхняя панель</td><td>Список пакетов: No., Time, Source, Destination, Protocol, Length, Info</td></tr>',
            '<tr><td><strong>Packet Details</strong></td><td>Средняя панель</td><td>Дерево: Frame → Ethernet → IP → TCP → Прикладной протокол</td></tr>',
            '<tr><td><strong>Packet Bytes</strong></td><td>Нижняя панель</td><td>HEX + ASCII представление, подсветка выбранного поля</td></tr>',
            '</table>',
            '<p><strong>Горячие клавиши:</strong></p>',
            '<table class="ws-table">',
            '<tr><th>Клавиши</th><th>Действие</th></tr>',
            '<tr><td><code>Ctrl+E</code></td><td>Начать / остановить захват</td></tr>',
            '<tr><td><code>Ctrl+K</code></td><td>Открыть Capture Options</td></tr>',
            '<tr><td><code>Ctrl+.</code></td><td>Следующий пакет в диалоге (Conversation)</td></tr>',
            '<tr><td><code>Ctrl+→ / Ctrl+←</code></td><td>Следующий / предыдущий пакет</td></tr>',
            '</table>',

            // ============================================================
            // 4. ФИЛЬТРЫ
            // ============================================================
            '<h3>4. Фильтры: Capture Filter vs Display Filter</h3>',
            '<p>В Wireshark существует два принципиально разных типа фильтров. Путаница между ними — одна из самых частых ошибок начинающих:</p>',

            '<table class="ws-table">',
            '<tr><th>Характеристика</th><th>Capture Filter (BPF)</th><th>Display Filter</th></tr>',
            '<tr><td><strong>Когда применяется</strong></td><td>До начала захвата</td><td>После захвата</td></tr>',
            '<tr><td><strong>Где задаётся</strong></td><td>Capture → Options, флаг <code>-f</code> в tshark</td><td>Строка фильтра над списком пакетов</td></tr>',
            '<tr><td><strong>Синтаксис</strong></td><td>BPF (ограничен)</td><td>Богатый, точечная нотация</td></tr>',
            '<tr><td><strong>Судьба пакетов</strong></td><td>Отбрасываются навсегда</td><td>Скрыты, но сохранены в файле</td></tr>',
            '<tr><td><strong>Пример</strong></td><td><code>tcp port 80</code></td><td><code>http.request.method == "GET"</code></td></tr>',
            '</table>',

            '<h4>4.1 Capture Filter (фильтр захвата, BPF)</h4>',
            '<p>Задаётся <strong>до начала захвата</strong> в поле «Capture → Options → Capture filter» или через флаг <code>-f</code> в tshark. Определяет, какие пакеты будут сохранены в файл. Пакеты, не прошедшие фильтр, <strong>отбрасываются навсегда</strong> — восстановить их невозможно.</p>',
            '<p>Синтаксис: <strong>BPF (Berkeley Packet Filter)</strong>. Это примитивный язык, разработанный в 1992 году для tcpdump. Он ограничен: нельзя фильтровать по полям прикладного уровня (HTTP-заголовки, DNS-имена).</p>',
            '<p><strong>Базовые примитивы BPF:</strong></p>',
            App.createCodeBlock(
                '# Тип трафика\nhost 192.168.1.1          # только пакеты с/на этот IP\nnet 192.168.1.0/24        # только пакеты из этой сети\nsrc host 10.0.0.1         # только от этого источника\ndst host 10.0.0.2         # только к этому назначению\nport 443                  # только на этот порт (TCP и UDP)\ntcp port 80               # только TCP на порт 80\nudp port 53               # только UDP на порт 53\nether host 00:11:22:33:44:55  # только с этим MAC\n\n# Логические операторы\nhost A and host B         # оба условия\nhost A or host B          # любое из условий\nnot port 22               # всё кроме SSH\n\n# Комбинированные примеры\ntcp and (port 80 or port 443) and net 192.168.1.0/24\nnot broadcast and not multicast',
                'bash'
            ),

            '<h4>4.2 Display Filter (фильтр отображения)</h4>',
            '<p>Задаётся <strong>после захвата</strong> в строке фильтра над списком пакетов. Фильтрует, какие пакеты <strong>показаны</strong>, но не удаляет их из захвата. Вы можете менять фильтр сколько угодно раз.</p>',
            '<p>Синтаксис богаче, чем BPF. Можно обращаться к любому полю любого протокола через точечную нотацию: <code>ip.src</code>, <code>tcp.flags.syn</code>, <code>http.request.method</code>, <code>dns.qry.name</code>.</p>',
            '<p><strong>Операторы сравнения:</strong> <code>==</code> (равно), <code>!=</code> (не равно), <code>&gt;</code> (больше), <code>&lt;</code> (меньше), <code>&gt;=</code>, <code>&lt;=</code>, <code>contains</code> (содержит строку), <code>matches</code> (регулярное выражение).</p>',
            '<p><strong>Логические операторы:</strong> <code>&&</code> или <code>and</code>, <code>||</code> или <code>or</code>, <code>!</code> или <code>not</code>.</p>',
            App.createCodeBlock(
                '# === TCP-флаги ===\ntcp.flags.syn == 1 && tcp.flags.ack == 0    # SYN (начало соединения)\ntcp.flags.syn == 1 && tcp.flags.ack == 1    # SYN-ACK (ответ)\ntcp.flags.reset == 1                         # RST (сброс)\ntcp.flags.fin == 1                           # FIN (завершение)\ntcp.flags == 0x029                           # XMAS scan (FIN+PSH+URG)\ntcp.flags == 0x000                           # NULL scan\n\n# === HTTP ===\nhttp.request                                  # все HTTP-запросы\nhttp.request.method == "GET"                 # только GET\nhttp.request.method == "POST"                # только POST\nhttp.response.code == 200                    # успешные ответы\nhttp.response.code >= 400                    # ошибки\nhttp.user_agent contains "curl"             # curl-запросы\nhttp.host contains "example"                # запросы к домену\n\n# === DNS ===\ndns                                           # весь DNS-трафик\ndns.qry.type == 1                            # A-записи (IPv4)\ndns.qry.type == 28                           # AAAA-записи (IPv6)\ndns.qry.type == 16                           # TXT-записи\ndns.qry.name contains "google"              # запросы с "google"\ndns.qry.name.len > 50                        # длинные имена (туннелирование)\ndns.flags.rcode != 0                         # ошибки DNS\n\n# === TLS ===\ntls.handshake.type == 1                      # Client Hello\ntls.handshake.type == 2                      # Server Hello\ntls.handshake.type == 11                     # Certificate\ntls.handshake.extensions_server_name         # SNI (имя сервера)\n\n# === IP ===\nip.src == 192.168.1.100                      # от конкретного IP\nip.dst == 10.0.0.1                           # к конкретному IP\nip.addr == 192.168.1.0/24                   # из/в сеть\nip.ttl < 10                                  # подозрительно низкий TTL\nip.flags.mf == 1 || ip.frag_offset > 0       # фрагментированные пакеты\n\n# === ICMP ===\nicmp.type == 8                               # Echo Request (ping)\nicmp.type == 0                               # Echo Reply\nicmp && frame.len > 200                      # большие ICMP (туннелирование)\n\n# === Комбинированные ===\nhttp.request && ip.src == 192.168.1.0/24\ndns && !dns.qry.name contains "local"\ntcp.port == 443 && !tls                     # TCP на 443 без TLS (подозрительно)\nframe contains "password"                   # поиск строки в пакете',
                'bash'
            ),

            '<h4>4.3 Практикум по фильтрам</h4>',
            '<table class="ws-table">',
            '<tr><th>#</th><th>Задание</th><th>Решение</th></tr>',
            '<tr><td>1</td><td>Показать TCP-пакеты на порт 80 от источника из сети 192.168.1.0/24</td><td><code>tcp.dstport == 80 && ip.src == 192.168.1.0/24</code></td></tr>',
            '<tr><td>2</td><td>Найти все пакеты, содержащие строку «password»</td><td><code>frame contains "password"</code></td></tr>',
            '<tr><td>3</td><td>DNS-запросы с длиной имени > 40 символов (туннелирование)</td><td><code>dns.qry.name.len > 40</code></td></tr>',
            '</table>',

            // ============================================================
            // 5. TCP
            // ============================================================
            '<h3>5. TCP: протокол транспортного уровня</h3>',
            '<p>TCP (Transmission Control Protocol) — основной протокол транспортного уровня в стеке TCP/IP. Он обеспечивает <strong>надёжную, ориентированную на соединение</strong> доставку данных между приложениями. В отличие от UDP, TCP гарантирует, что данные дойдут в правильном порядке и без потерь.</p>',

            '<h4>5.1 Структура TCP-заголовка</h4>',
            '<p>TCP-заголовок имеет размер от 20 до 60 байт и содержит поля, управляющие соединением:</p>',

            // КРАСИВАЯ ТАБЛИЦА ДЛЯ ЗАГОЛОВКА TCP
            '<div class="ws-packet-header">',
            '<p style="font-weight: bold; margin-bottom: 10px;">📦 Структура TCP-заголовка (каждая строка = 32 бита)</p>',
            '<table class="ws-bit-table">',
            '<tr><td colspan="16" style="background:#e3f2fd; font-weight:bold;">Source Port (16 бит)</td><td colspan="16" style="background:#fff3e0; font-weight:bold;">Destination Port (16 бит)</td></tr>',
            '<tr><td colspan="32" style="background:#e8f5e9; font-weight:bold;">Sequence Number (32 бита)</td></tr>',
            '<tr><td colspan="32" style="background:#fce4ec; font-weight:bold;">Acknowledgment Number (32 бита)</td></tr>',
            '<tr>',
            '<td colspan="4" style="background:#f3e5f5;">Data Offset</td>',
            '<td colspan="3" style="background:#e0e0e0;">Reserved</td>',
            '<td>CWR</td><td>ECE</td><td>URG</td><td>ACK</td>',
            '<td>PSH</td><td>RST</td><td>SYN</td><td>FIN</td>',
            '<td colspan="16" style="background:#fff9c4;">Window Size (16 бит)</td>',
            '</tr>',
            '<tr><td colspan="16" style="background:#e1f5fe;">Checksum (16 бит)</td><td colspan="16" style="background:#f1f8e9;">Urgent Pointer (16 бит)</td></tr>',
            '<tr><td colspan="32" style="background:#eceff1; font-style:italic;">Options (переменная длина, если Data Offset > 5)</td></tr>',
            '</table>',
            '</div>',

            '<p><strong>Ключевые поля заголовка TCP:</strong></p>',
            '<table class="ws-table">',
            '<tr><th>Поле</th><th>Размер</th><th>Назначение</th></tr>',
            '<tr><td><strong>Source Port / Destination Port</strong></td><td>по 16 бит</td><td>Порты отправителя и получателя. Вместе с IP-адресами образуют сокет</td></tr>',
            '<tr><td><strong>Sequence Number</strong></td><td>32 бита</td><td>Номер первого байта данных в этом сегменте. Начальное значение случайно</td></tr>',
            '<tr><td><strong>Acknowledgment Number</strong></td><td>32 бита</td><td>Номер следующего ожидаемого байта (подтверждение получения)</td></tr>',
            '<tr><td><strong>Data Offset</strong></td><td>4 бита</td><td>Размер заголовка в 32-битных словах (обычно 5 = 20 байт)</td></tr>',
            '<tr><td><strong>Flags</strong></td><td>9 бит</td><td>NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN</td></tr>',
            '<tr><td><strong>Window Size</strong></td><td>16 бит</td><td>Размер окна приёма — управление потоком</td></tr>',
            '<tr><td><strong>Checksum</strong></td><td>16 бит</td><td>Контрольная сумма для проверки целостности</td></tr>',
            '<tr><td><strong>Urgent Pointer</strong></td><td>16 бит</td><td>Указатель на срочные данные (используется редко)</td></tr>',
            '</table>',

            '<h4>5.2 Sequence и Acknowledgment Numbers</h4>',
            '<p>Это самое важное для понимания TCP. Sequence Number (seq) — номер первого байта в сегменте. Acknowledgment Number (ack) — номер следующего байта, который ожидает отправитель.</p>',
            '<p><strong>Правила:</strong></p>',
            '<table class="ws-table">',
            '<tr><th>Правило</th><th>Пояснение</th></tr>',
            '<tr><td>Начальные seq случайны</td><td>Выбираются при установке соединения (защита от атак)</td></tr>',
            '<tr><td>Каждый байт данных +1 seq</td><td>seq увеличивается на количество переданных байт</td></tr>',
            '<tr><td>SYN и FIN считаются за 1 байт</td><td>Потребляют один номер последовательности</td></tr>',
            '<tr><td>ACK не потребляет seq</td><td>Пустой ACK не увеличивает номер последовательности</td></tr>',
            '</table>',
            '<p><strong>Пример диалога:</strong></p>',
            App.createCodeBlock(
                'Клиент → Сервер: SYN, seq=100\nСервер → Клиент: SYN-ACK, seq=500, ack=101\nКлиент → Сервер: ACK, seq=101, ack=501\nКлиент → Сервер: PSH-ACK, seq=101, ack=501, len=200 (данные 101-300)\nСервер → Клиент: ACK, seq=501, ack=301 (подтвердил 200 байт)',
                'plaintext'
            ),

            '<h4>5.3 Трёхстороннее рукопожатие (Three-Way Handshake)</h4>',
            '<p>Прежде чем начать передачу данных, TCP устанавливает соединение через трёхстороннее рукопожатие. Этот процесс синхронизирует начальные sequence numbers обеих сторон:</p>',

            // КРАСИВАЯ ДИАГРАММА РУКОПОЖАТИЯ ТАБЛИЦЕЙ
            '<table class="ws-table" style="text-align: center;">',
            '<tr style="background: #e3f2fd;">',
            '<th style="width: 5%;">Шаг</th>',
            '<th style="width: 25%;">Клиент</th>',
            '<th style="width: 10%;">Направление</th>',
            '<th style="width: 25%;">Сервер</th>',
            '<th style="width: 35%;">Детали</th>',
            '</tr>',
            '<tr>',
            '<td><span class="ws-state-syn">1</span></td>',
            '<td><strong>SYN_SENT</strong><br>seq=x</td>',
            '<td style="font-size: 20px;">→<br><small>SYN</small></td>',
            '<td>LISTEN → <strong>SYN_RCVD</strong></td>',
            '<td style="text-align: left;">Клиент отправляет SYN. Фильтр Wireshark:<br><code>tcp.flags.syn==1 && tcp.flags.ack==0</code></td>',
            '</tr>',
            '<tr>',
            '<td><span class="ws-state-syn">2</span></td>',
            '<td>SYN_SENT → <strong>ESTABLISHED</strong></td>',
            '<td style="font-size: 20px;">←<br><small>SYN-ACK</small></td>',
            '<td><strong>SYN_RCVD</strong><br>seq=y, ack=x+1</td>',
            '<td style="text-align: left;">Сервер отвечает SYN+ACK. Фильтр:<br><code>tcp.flags.syn==1 && tcp.flags.ack==1</code></td>',
            '</tr>',
            '<tr>',
            '<td><span class="ws-state-established">3</span></td>',
            '<td><strong>ESTABLISHED</strong><br>seq=x+1, ack=y+1</td>',
            '<td style="font-size: 20px;">→<br><small>ACK</small></td>',
            '<td>SYN_RCVD → <strong>ESTABLISHED</strong></td>',
            '<td style="text-align: left;">Клиент подтверждает. Фильтр:<br><code>tcp.flags.ack==1</code></td>',
            '</tr>',
            '</table>',
            '<p style="text-align: center; margin-top: 10px;"><span class="ws-state-established">✓ СОЕДИНЕНИЕ УСТАНОВЛЕНО — можно передавать данные</span></p>',

            '<p><strong>Почему именно три шага?</strong> Двухшаговое рукопожатие (SYN → SYN-ACK) не обеспечивает надёжной синхронизации: клиент не подтверждает получение серверного SYN, сервер не знает, дошёл ли его SYN-ACK. Трёхшаговое рукопожатие гарантирует, что обе стороны подтвердили готовность к обмену и согласовали начальные номера последовательностей.</p>',
            '<p><strong>Как найти рукопожатие в Wireshark:</strong></p>',
            '<ol>',
            '<li>Запустите захват на активном интерфейсе.</li>',
            '<li>Откройте браузер и зайдите на любой сайт.</li>',
            '<li>Остановите захват.</li>',
            '<li>Введите фильтр: <code>tcp.flags.syn == 1</code></li>',
            '<li>Найдите три последовательных пакета: SYN (ack=0), SYN-ACK (ack=1), ACK.</li>',
            '<li>Раскройте TCP-заголовок в средней панели и изучите поля Sequence Number и Acknowledgment Number.</li>',
            '</ol>',

            '<h4>5.4 Диаграмма состояний TCP</h4>',
            '<p>Каждое TCP-соединение проходит через серию состояний от рождения (LISTEN/SYN_SENT) до смерти (CLOSED/TIME_WAIT). Понимание этих состояний критически важно для диагностики сетевых проблем и обнаружения атак:</p>',

            // ТАБЛИЦА СОСТОЯНИЙ
            '<table class="ws-table">',
            '<tr><th>Состояние</th><th>Сторона</th><th>Описание</th><th>Индикатор</th></tr>',
            '<tr><td><span class="ws-state-closed">CLOSED</span></td><td>Обе</td><td>Соединения нет</td><td>Начальное / конечное состояние</td></tr>',
            '<tr><td><span class="ws-state-syn">LISTEN</span></td><td>Сервер</td><td>Ожидание входящих соединений</td><td>Серверный сокет открыт</td></tr>',
            '<tr><td><span class="ws-state-syn">SYN_SENT</span></td><td>Клиент</td><td>Отправлен SYN, ожидание SYN-ACK</td><td>Активное открытие (connect)</td></tr>',
            '<tr><td><span class="ws-state-syn">SYN_RCVD</span></td><td>Сервер</td><td>Получен SYN, отправлен SYN-ACK</td><td>Много = SYN-flood атака</td></tr>',
            '<tr><td><span class="ws-state-established">ESTABLISHED</span></td><td>Обе</td><td>Соединение установлено, обмен данными</td><td>Нормальное рабочее состояние</td></tr>',
            '<tr><td><span class="ws-state-fin">FIN_WAIT_1</span></td><td>Клиент</td><td>Отправлен FIN, ожидание ACK</td><td>Активное закрытие</td></tr>',
            '<tr><td><span class="ws-state-fin">FIN_WAIT_2</span></td><td>Клиент</td><td>ACK получен, ожидание FIN от сервера</td><td>Сервер может ещё слать данные</td></tr>',
            '<tr><td><span class="ws-state-fin">CLOSE_WAIT</span></td><td>Сервер</td><td>Получен FIN, но приложение ещё не закрыло сокет</td><td>Утечка ресурсов</td></tr>',
            '<tr><td><span class="ws-state-fin">LAST_ACK</span></td><td>Сервер</td><td>Отправлен FIN, ожидание ACK</td><td>Пассивное закрытие</td></tr>',
            '<tr><td><span class="ws-state-closed">TIME_WAIT</span></td><td>Клиент</td><td>Ожидание 2MSL (~60 сек) перед закрытием</td><td>Много = высокая нагрузка</td></tr>',
            '</table>',

            '<p><strong>Значение состояний для безопасности:</strong></p>',
            '<ul>',
            '<li><strong>Много соединений в SYN_RECEIVED</strong> — признак SYN-flood атаки. Сервер отправляет SYN-ACK, но не получает ответного ACK.</li>',
            '<li><strong>Много соединений в TIME_WAIT</strong> — высокая нагрузка на сервер, много коротких соединений.</li>',
            '<li><strong>Соединения в CLOSE_WAIT</strong> — приложение не закрывает сокет после получения FIN. Может указывать на утечку ресурсов.</li>',
            '<li><strong>Соединения в FIN_WAIT_2</strong> — клиент отправил FIN, сервер подтвердил, но не отправляет свой FIN. Возможно, приложение на сервере зависло.</li>',
            '</ul>',

            '<h4>5.5 Флаги TCP-заголовка</h4>',
            '<table class="ws-table ws-flag-table">',
            '<tr><th>Флаг</th><th>Бит</th><th>Hex</th><th>Назначение</th></tr>',
            '<tr><td><code>CWR</code></td><td>8</td><td>0x080</td><td>Congestion Window Reduced — окно перегрузки уменьшено</td></tr>',
            '<tr><td><code>ECE</code></td><td>7</td><td>0x040</td><td>ECN-Echo — уведомление о перегрузке</td></tr>',
            '<tr><td><code>URG</code></td><td>6</td><td>0x020</td><td>Urgent — срочные данные (используется редко)</td></tr>',
            '<tr><td><code>ACK</code></td><td>5</td><td>0x010</td><td>Acknowledge — подтверждение получения данных</td></tr>',
            '<tr><td><code>PSH</code></td><td>4</td><td>0x008</td><td>Push — передать данные приложению немедленно</td></tr>',
            '<tr><td><code>RST</code></td><td>3</td><td>0x004</td><td>Reset — принудительный разрыв соединения</td></tr>',
            '<tr><td><code>SYN</code></td><td>2</td><td>0x002</td><td>Synchronize — запрос на установку соединения</td></tr>',
            '<tr><td><code>FIN</code></td><td>1</td><td>0x001</td><td>Finish — завершение передачи данных</td></tr>',
            '</table>',
            '<p><strong>Как читать флаги в Wireshark:</strong> в панели деталей пакета раскройте «Transmission Control Protocol» → «Flags». Вы увидите шестнадцатеричное значение (например, <code>0x012</code> = SYN+ACK, <code>0x011</code> = FIN+ACK, <code>0x004</code> = RST).</p>',

            '<h4>5.6 Завершение соединения (Four-Way Handshake)</h4>',
            '<p>TCP — полнодуплексный протокол: данные могут передаваться в обе стороны одновременно. Поэтому для завершения требуется <strong>четырёхстороннее рукопожатие</strong> — каждая сторона независимо завершает свою половину соединения:</p>',

            '<table class="ws-table" style="text-align: center;">',
            '<tr style="background: #fce4ec;"><th>Шаг</th><th>Отправитель</th><th>Флаг</th><th>Получатель</th><th>Состояние после</th></tr>',
            '<tr><td>1</td><td>Инициатор</td><td>FIN</td><td>→ Получатель</td><td>Инициатор: FIN_WAIT_1</td></tr>',
            '<tr><td>2</td><td>← Получатель</td><td>ACK</td><td>Инициатор</td><td>Инициатор: FIN_WAIT_2, Получатель: CLOSE_WAIT</td></tr>',
            '<tr><td>3</td><td>← Получатель</td><td>FIN</td><td>Инициатор</td><td>Получатель: LAST_ACK</td></tr>',
            '<tr><td>4</td><td>Инициатор</td><td>ACK</td><td>→ Получатель</td><td>Инициатор: TIME_WAIT, Получатель: CLOSED</td></tr>',
            '</table>',
            '<p>В Wireshark ищите 4 пакета с флагами FIN и ACK между двумя хостами. Фильтр: <code>tcp.flags.fin == 1</code>.</p>',

            '<h4>5.7 Управление потоком: Sliding Window</h4>',
            '<p>TCP использует скользящее окно (sliding window) для управления потоком данных. Поле Window Size в заголовке TCP сообщает отправителю, сколько байт получатель готов принять. Это предотвращает переполнение буфера получателя.</p>',
            '<p><strong>В Wireshark:</strong> посмотрите на поле Window Size в TCP-заголовке. Если оно уменьшается до нуля — получатель перегружен, отправитель должен остановиться (Zero Window). Если окно то увеличивается, то уменьшается — нормальная работа.</p>',
            '<p><strong>Аномалии:</strong> постоянно маленькое окно — получатель не справляется. Постоянно нулевое окно — приложение на стороне получателя не читает данные из сокета (проблема в коде).</p>',

            '<h4>5.8 Контроль перегрузки: Congestion Control</h4>',
            '<p>В отличие от управления потоком (окно получателя), контроль перегрузки управляет тем, сколько данных отправитель может послать в сеть, не вызывая перегрузки маршрутизаторов. Алгоритмы: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.</p>',
            '<p><strong>В Wireshark:</strong> Statistics → TCP Stream Graphs → Stevens\' Throughput. График показывает пропускную способность соединения. Провалы — потери пакетов и срабатывание контроля перегрузки.</p>',

            '<h4>5.9 Практикум по TCP-анализу</h4>',
            '<table class="ws-table">',
            '<tr><th>#</th><th>Задание</th><th>Решение / Подсказка</th></tr>',
            '<tr><td>1</td><td>Найдите трёхстороннее рукопожатие и определите начальные seq клиента и сервера</td><td>Фильтр <code>tcp.stream eq N</code>, первые три пакета с флагами SYN</td></tr>',
            '<tr><td>2</td><td>Найдите пакет с флагом RST. Что могло вызвать его?</td><td>Порт закрыт, или соединение разорвано фаерволом/приложением</td></tr>',
            '<tr><td>3</td><td>Определите RTT через TCP Stream Graphs</td><td>Statistics → TCP Stream Graphs → Round Trip Time</td></tr>',
            '</table>',

            // ============================================================
            // 6. TLS
            // ============================================================
            '<h3>6. TLS Handshake в Wireshark</h3>',
            '<p>TLS (Transport Layer Security) — протокол, обеспечивающий шифрование, аутентификацию и целостность данных. Используется в HTTPS, SMTPS, IMAPS и других защищённых протоколах. Актуальная версия — TLS 1.3 (RFC 8446).</p>',

            '<h4>6.1 TLS 1.3 Handshake (упрощённый)</h4>',
            '<p>TLS 1.3 значительно упростил рукопожатие по сравнению с TLS 1.2. Теперь оно требует всего 1-RTT (Round-Trip Time) для установки соединения:</p>',

            '<table class="ws-table" style="text-align: center;">',
            '<tr style="background: #e8f5e9;"><th>Шаг</th><th>Отправитель</th><th>Сообщение</th><th>Содержимое</th></tr>',
            '<tr><td>1</td><td>Клиент → Сервер</td><td><strong>Client Hello</strong></td><td style="text-align: left;">Версии TLS, cipher suites, client random, SNI, supported_groups, key_share</td></tr>',
            '<tr><td>2</td><td>Сервер → Клиент</td><td><strong>Server Hello</strong> + Encrypted Extensions + <strong>Certificate</strong> + Certificate Verify + <strong>Finished</strong></td><td style="text-align: left;">Выбранный шифр, серверный key_share, сертификат, подпись, MAC рукопожатия</td></tr>',
            '<tr><td>3</td><td>Клиент → Сервер</td><td><strong>Finished</strong></td><td style="text-align: left;">MAC рукопожатия от клиента</td></tr>',
            '</table>',

            '<p><strong>Фильтры Wireshark для TLS:</strong></p>',
            App.createCodeBlock(
                '# Типы сообщений TLS Handshake\ntls.handshake.type == 1      # Client Hello\ntls.handshake.type == 2      # Server Hello\ntls.handshake.type == 11     # Certificate\ntls.handshake.type == 15     # Certificate Verify\ntls.handshake.type == 20     # Finished\n\n# Просмотр SNI (имени сервера)\ntls.handshake.extensions_server_name\n\n# Просмотр сертификатов\ntls.handshake.certificate\n\n# Версия TLS\ntls.handshake.version\n\n# JA3-хеш (fingerprint клиента)\ntls.handshake.ja3  # полный JA3\n\n# Всё рукопожатие одного соединения\ntls.handshake and ip.addr eq <IP сервера>',
                'bash'
            ),

            '<h4>6.2 Анализ сертификатов в Wireshark</h4>',
            '<p>При анализе TLS-трафика можно извлечь и изучить сертификаты серверов. Это помогает выявить подозрительные соединения:</p>',
            '<table class="ws-table">',
            '<tr><th>Тип сертификата</th><th>Признак</th><th>Риск</th></tr>',
            '<tr><td><strong>Поддельные сертификаты</strong></td><td>Выпущены неизвестным УЦ, не совпадают имена</td><td>MitM-атака, перехват трафика</td></tr>',
            '<tr><td><strong>Самоподписанные</strong></td><td>Issuer = Subject, нет цепочки доверия</td><td>Тестовая среда или атака</td></tr>',
            '<tr><td><strong>Просроченные</strong></td><td>Дата окончания в прошлом</td><td>Сервер не обновляет сертификаты</td></tr>',
            '</table>',
            '<p>Для просмотра сертификата: найдите пакет с <code>tls.handshake.type == 11</code>, раскройте «Transport Layer Security → Handshake Protocol: Certificate → Certificates → Certificate». В контекстном меню выберите «Export Packet Bytes» для сохранения сертификата в файл.</p>',

            '<h4>6.3 JA3 Fingerprinting</h4>',
            '<p><strong>JA3</strong> — метод создания fingerprint\'а TLS-клиента на основе параметров Client Hello. Позволяет идентифицировать приложение (браузер, скрипт, вредоносное ПО) даже если трафик зашифрован.</p>',
            '<p><strong>Алгоритм JA3:</strong> MD5-хеш от конкатенации полей Client Hello: <code>SSLVersion,Ciphers,Extensions,EllipticCurves,EllipticCurvePointFormats</code>. Wireshark автоматически вычисляет JA3-хеш для каждого Client Hello (поле <code>tls.handshake.ja3</code>).</p>',
            '<p><strong>Применение в безопасности:</strong> сравните JA3-хеши в вашем трафике с базой известных вредоносных JA3 (например, <a href="https://sslbl.abuse.ch/ja3-fingerprints/" target="_blank">Abuse.ch JA3 Database</a>). Необычные JA3 могут указывать на C2-трафик.</p>',

            '<h4>6.4 Расшифровка TLS-трафика</h4>',
            '<p><strong>Важно:</strong> Wireshark может расшифровывать TLS-трафик, если у вас есть ключи сессии или мастер-секрет. Наиболее простой способ для отладки — использовать переменную окружения <code>SSLKEYLOGFILE</code> в браузере:</p>',
            App.createCodeBlock(
                '# В Linux/macOS перед запуском браузера:\nexport SSLKEYLOGFILE=$HOME/sslkey.log\ngoogle-chrome\n\n# Затем в Wireshark:\n# Edit → Preferences → Protocols → TLS → (Pre)-Master-Secret log filename\n# Указать путь к sslkey.log',
                'bash'
            ),
            '<p>После этого весь ваш HTTPS-трафик будет расшифрован в Wireshark и вы сможете увидеть содержимое запросов и ответов.</p>',

            '<h4>6.5 Практикум по TLS</h4>',
            '<table class="ws-table">',
            '<tr><th>#</th><th>Задание</th><th>Решение</th></tr>',
            '<tr><td>1</td><td>Найдите Client Hello и определите SNI (имя сервера)</td><td>Фильтр <code>tls.handshake.type == 1</code> → Client Hello → Extension: server_name</td></tr>',
            '<tr><td>2</td><td>Извлеките сертификат сервера и проверьте срок действия</td><td>Найти пакет <code>tls.handshake.type == 11</code>, Export Packet Bytes → <code>.der</code>, открыть: <code>openssl x509 -in cert.der -inform der -text -noout</code></td></tr>',
            '</table>',

            // ============================================================
            // 7. ТИПИЧНЫЕ АТАКИ И ИХ ОБНАРУЖЕНИЕ
            // ============================================================
            '<h3>7. Обнаружение сетевых атак в Wireshark</h3>',

            '<h4>7.1 Сканирование портов</h4>',
            '<p>Злоумышленник сканирует порты жертвы для обнаружения открытых сервисов. Типичные паттерны:</p>',
            App.createCodeBlock(
                '# SYN-сканирование (половинное открытие, stealth scan)\ntcp.flags.syn == 1 && tcp.flags.ack == 0 && tcp.window_size <= 1024\n\n# NULL-сканирование (нет флагов)\ntcp.flags == 0x000\n\n# XMAS-сканирование (FIN, PSH, URG)\ntcp.flags == 0x029\n\n# Maimon-сканирование (FIN+ACK)\ntcp.flags == 0x011\n\n# Анализ: много пакетов на разные порты от одного источника\n# Statistics → Conversations → TCP',
                'bash'
            ),

            '<h4>7.2 ARP-спуфинг</h4>',
            '<p>Атакующий отправляет поддельные ARP-ответы, связывая свой MAC-адрес с IP-адресом шлюза. Признаки:</p>',
            App.createCodeBlock(
                '# Поиск ARP-пакетов\narp\n\n# Ключевой признак: дублирующиеся IP с разными MAC\narp.duplicate-address-detected\n\n# Анализ: проверьте, не меняется ли MAC для IP шлюза\n# Фильтр: arp and ip.dst == <IP шлюза>',
                'bash'
            ),

            '<h4>7.3 DNS-туннелирование</h4>',
            '<p>Злоумышленник скрывает данные в DNS-запросах для обхода файервола:</p>',
            App.createCodeBlock(
                '# Длинные DNS-имена\n dns.qry.name.len > 50\n\n# Подозрительные типы записей (TXT, NULL)\ndns.qry.type == 16 or dns.qry.type == 10\n\n# Большой объём DNS-трафика к одному серверу\n# Statistics → DNS',
                'bash'
            ),

            '<h4>7.4 ICMP-туннелирование</h4>',
            '<p>Данные скрываются в полезной нагрузке ICMP-пакетов. Признаки:</p>',
            App.createCodeBlock(
                '# Необычно большие ICMP-пакеты\nicmp && frame.len > 200\n\n# ICMP-пакеты с нестандартным payload\nicmp.payload\n\n# Большой объём ICMP между двумя узлами',
                'bash'
            ),

            '<h4>7.5 Практикум: анализ вредоносного трафика</h4>',
            '<p><strong>Сценарий:</strong> вы получили PCAP-файл от заказчика. Подозрение на компрометацию хоста. Выполните следующие шаги:</p>',
            '<ol>',
            '<li>Откройте файл, проверьте Protocol Hierarchy: нет ли аномального протокола (например, высокая доля ICMP)?</li>',
            '<li>Проверьте Conversations: какие внешние IP-адреса принимали или отправляли трафик? Есть ли соединения на нестандартные порты (8080, 4444, 31337)?</li>',
            '<li>Примените фильтр SYN-сканирования: <code>tcp.flags.syn == 1 && tcp.flags.ack == 0</code> — видите ли вы шквал SYN-пакетов на разные порты от одного источника?</li>',
            '<li>Проверьте HTTP-запросы: <code>http.request</code> — есть ли обращения к подозрительным доменам или загрузка файлов с необычными расширениями (.exe, .ps1, .vbs)?</li>',
            '<li>Проверьте DNS: <code>dns.qry.name.len > 30</code> — нет ли туннелирования?</li>',
            '<li>Экспортируйте объекты HTTP: File → Export Objects → HTTP — возможно, найдёте вредоносный файл.</li>',
            '</ol>',

            // ============================================================
            // 8. TSHARK
            // ============================================================
            '<h3>8. Tshark — консольный Wireshark</h3>',
            '<p><strong>Tshark</strong> — консольная версия Wireshark для захвата и анализа трафика в терминале или скриптах. Использует те же движки (libpcap, диссекторы протоколов) и тот же синтаксис фильтров.</p>',

            '<h4>8.1 Захват трафика</h4>',
            App.createCodeBlock(
                '# Захват на интерфейсе eth0, вывод в файл\ntshark -i eth0 -w capture.pcap\n\n# Захват с фильтром (BPF)\ntshark -i eth0 -f "tcp port 80" -w http_traffic.pcap\n\n# Автоматическая ротация файлов (каждые 10 МБ)\ntshark -i eth0 -w capture.pcap -b filesize:10240',
                'bash'
            ),

            '<h4>8.2 Чтение и анализ PCAP</h4>',
            App.createCodeBlock(
                '# Чтение файла с выводом в терминал\ntshark -r capture.pcap\n\n# Фильтрация при чтении (display filter)\ntshark -r capture.pcap -Y "http.request"\n\n# Вывод только нужных полей (как cut/awk)\ntshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.port\n\n# Статистика по протоколам\ntshark -r capture.pcap -z io,phs\n\n# Иерархия протоколов\ntshark -r capture.pcap -z io,phs,protocols',
                'bash'
            ),

            '<h4>8.3 Полезные поля для извлечения</h4>',
            App.createCodeBlock(
                '# Разбор HTTP-запросов\n tshark -r capture.pcap -Y "http.request" -T fields -e frame.time -e ip.src -e http.host -e http.request.uri\n\n# DNS-запросы\ntshark -r capture.pcap -Y "dns" -T fields -e frame.time -e ip.src -e dns.qry.name -e dns.qry.type\n\n# TCP-соединения\ntshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport',
                'bash'
            ),

            '<h4>8.4 Применение в пентесте</h4>',
            '<p><strong>Пассивный сбор данных о сети:</strong></p>',
            App.createCodeBlock(
                '# Извлечь все IP-адреса из захвата\ntshark -r capture.pcap -T fields -e ip.src -e ip.dst | tr "\\t" "\\n" | sort -u\n\n# Найти все HTTP-хосты (виртуальные хосты)\ntshark -r capture.pcap -Y "http.request" -T fields -e http.host | sort -u\n\n# Извлечь DNS-имена\ntshark -r capture.pcap -Y "dns.qry.type == 1" -T fields -e dns.qry.name | sort -u\n\n# Поиск строк в payload (пароли, токены)\ntshark -r capture.pcap -Y "http contains password" -T fields -e http.request.uri',
                'bash'
            ),

            '<h4>8.5 Практикум по tshark</h4>',
            '<table class="ws-table">',
            '<tr><th>#</th><th>Задание</th><th>Решение</th></tr>',
            '<tr><td>1</td><td>Извлечь все уникальные DNS-имена из PCAP</td><td><code>tshark -r file.pcap -Y "dns.qry.type == 1" -T fields -e dns.qry.name | sort -u</code></td></tr>',
            '<tr><td>2</td><td>Подсчитать количество HTTP POST-запросов</td><td><code>tshark -r file.pcap -Y "http.request.method == POST" | wc -l</code></td></tr>',
            '<tr><td>3</td><td>Вывести пары IP по TCP с портом назначения, сортировка по количеству пакетов</td><td><code>tshark -r file.pcap -T fields -e ip.src -e ip.dst -e tcp.dstport | sort | uniq -c | sort -rn</code></td></tr>',
            '</table>',

            // ============================================================
            // 9. СТАТИСТИКА И ГРАФИКИ
            // ============================================================
            '<h3>9. Инструменты статистики Wireshark</h3>',
            '<table class="ws-table">',
            '<tr><th>Инструмент</th><th>Путь</th><th>Что показывает</th></tr>',
            '<tr><td><strong>Protocol Hierarchy</strong></td><td>Statistics → Protocol Hierarchy</td><td>Распределение трафика по протоколам в %</td></tr>',
            '<tr><td><strong>Conversations</strong></td><td>Statistics → Conversations</td><td>Пары общающихся хостов (Ethernet, IP, TCP/UDP)</td></tr>',
            '<tr><td><strong>Endpoints</strong></td><td>Statistics → Endpoints</td><td>Статистика по каждому хосту: пакеты/байты</td></tr>',
            '<tr><td><strong>IO Graph</strong></td><td>Statistics → IO Graph</td><td>График скорости трафика во времени</td></tr>',
            '<tr><td><strong>Expert Information</strong></td><td>Analyze → Expert Information</td><td>Ошибки, предупреждения, замечания</td></tr>',
            '</table>',

            '<h4>9.6 Практикум по статистике</h4>',
            '<table class="ws-table">',
            '<tr><th>#</th><th>Задание</th><th>Решение</th></tr>',
            '<tr><td>1</td><td>Построить график HTTP-трафика в IO Graph</td><td>IO Graph → фильтр <code>tcp.port == 80</code></td></tr>',
            '<tr><td>2</td><td>Найти все повторные передачи (retransmissions)</td><td>Analyze → Expert Information → вкладка Notes/Warnings</td></tr>',
            '<tr><td>3</td><td>Сравнить нормальный трафик и трафик сканирования в Conversations</td><td>При сканировании — много коротких попыток на разные порты от одного IP</td></tr>',
            '</table>',

            // ============================================================
            // 10. ЦВЕТОВЫЕ ПРАВИЛА
            // ============================================================
            '<h3>10. Цветовые правила (Coloring Rules)</h3>',
            '<p>Wireshark использует цвета для визуального выделения пакетов. Правила настраиваются через View → Coloring Rules.</p>',
            '<table class="ws-table">',
            '<tr><th>Фильтр</th><th>Цвет</th><th>Назначение</th></tr>',
            '<tr><td><code>tcp.flags.syn == 1 && tcp.flags.ack == 0</code></td><td>🟡 Жёлтый</td><td>Подозрительные сканирования</td></tr>',
            '<tr><td><code>tcp.flags.reset == 1</code></td><td>🔴 Красный</td><td>Сброс соединения (по умолчанию)</td></tr>',
            '<tr><td><code>dns.flags.rcode != 0</code></td><td>🩷 Розовый</td><td>DNS-ошибки</td></tr>',
            '<tr><td><code>http.response.code >= 400</code></td><td>🔴 Красный</td><td>HTTP-ошибки (4xx, 5xx)</td></tr>',
            '</table>',
            '<p><strong>Совет:</strong> создайте отдельный цветовой профиль для форензики, чтобы быстро выделять аномалии. Экспортируйте его через View → Coloring Rules → Import/Export для переноса между системами.</p>',

            // ============================================================
            // 11. ЭКСПОРТ ОБЪЕКТОВ
            // ============================================================
            '<h3>11. Экспорт объектов из трафика</h3>',
            '<p>Wireshark умеет извлекать файлы, переданные по HTTP, SMB и другим протоколам. File → Export Objects → HTTP/SMB/etc. Это полезно для форензики: можно восстановить скачанные злоумышленником файлы, изображения, документы.</p>',
            '<p>В Kali Linux также есть специализированные инструменты для извлечения файлов из PCAP: <code>foremost</code>, <code>scalpel</code>, <code>bulk_extractor</code>. Wireshark удобен для быстрого просмотра и выборочного извлечения.</p>',
            '<p><strong>Практикум:</strong> откройте PCAP с HTTP-трафиком. Через File → Export Objects → HTTP найдите и сохраните все файлы изображений (Content-Type: image/...). Проверьте их содержимое — нет ли стеганографии?</p>',

            // ============================================================
            // 12. ПРАКТИЧЕСКИЙ СЦЕНАРИЙ: АНАЛИЗ ЗАХВАТА
            // ============================================================
            '<h3>12. Практический сценарий анализа PCAP</h3>',
            '<p><strong>Задача:</strong> вам прислали файл suspicious.pcap. Нужно понять, что произошло.</p>',
            '<table class="ws-table">',
            '<tr><th>Шаг</th><th>Действие</th><th>Инструмент / Фильтр</th></tr>',
            '<tr><td>1</td><td>Проверить распределение протоколов</td><td>Statistics → Protocol Hierarchy</td></tr>',
            '<tr><td>2</td><td>Определить, кто с кем общался</td><td>Statistics → Conversations</td></tr>',
            '<tr><td>3</td><td>Найти все попытки установки соединений</td><td><code>tcp.flags.syn == 1 and tcp.flags.ack == 0</code></td></tr>',
            '<tr><td>4</td><td>Проверить HTTP/DNS-запросы</td><td><code>http.request</code> / <code>dns</code></td></tr>',
            '<tr><td>5</td><td>Проверить TLS-рукопожатия (SNI)</td><td><code>tls.handshake.extensions_server_name</code></td></tr>',
            '<tr><td>6</td><td>Экспортировать объекты HTTP</td><td>File → Export Objects → HTTP</td></tr>',
            '<tr><td>7</td><td>Проверить аномалии протоколов</td><td>Analyze → Expert Information</td></tr>',
            '<tr><td>8</td><td>Открыть полный диалог подозрительного соединения</td><td>ПКМ → Follow → TCP Stream</td></tr>',
            '</table>',

            // ============================================================
            // 13. ПОЛЕЗНЫЕ КОМАНДЫ TSHARK И BPF (ШПАРГАЛКА)
            // ============================================================
            '<h3>13. Шпаргалка по BPF и tshark</h3>',
            App.createCodeBlock(
                '# ===== BPF (Capture Filter) =====\n# Захват трафика конкретного хоста\nhost 192.168.1.100\n# Захват трафика сети\nnet 192.168.1.0/24\n# Только TCP порт 80\ntcp port 80\n# Исключить SSH\nnot port 22\n# HTTP или HTTPS\ntcp and (port 80 or port 443)\n# Всё кроме broadcast/multicast\nnot broadcast and not multicast\n# Только ICMP\nicmp\n# ARP\narp\n\n# ===== TSHARK =====\n# Захват на интерфейсе\ntshark -i eth0\n# Запись в файл с фильтром\ntshark -i eth0 -f "tcp port 80" -w capture.pcap\n# Чтение с фильтром\ntshark -r capture.pcap -Y "http.request"\n# Вывод полей\ntshark -r capture.pcap -T fields -e ip.src -e ip.dst -e http.request.uri\n# Статистика\ntshark -r capture.pcap -z io,phs',
                'bash'
            ),

            // ============================================================
            // 14. ЗАКЛЮЧЕНИЕ И РЕКОМЕНДАЦИИ
            // ============================================================
            '<h3>14. Заключение и рекомендации по изучению</h3>',
            '<p>Wireshark — сложный инструмент, требующий понимания сетевых протоколов. Изучайте его постепенно:</p>',
            '<ol>',
            '<li><strong>Начните с основ:</strong> интерфейс, захват, простые фильтры.</li>',
            '<li><strong>Изучите TCP/IP:</strong> без понимания протоколов Wireshark — просто красивая картинка.</li>',
            '<li><strong>Практикуйтесь на своих захватах:</strong> захватите трафик при открытии сайта, разберите рукопожатие.</li>',
            '<li><strong>Разбирайте чужие PCAP:</strong> на сайте <a href="https://www.malware-traffic-analysis.net/" target="_blank">malware-traffic-analysis.net</a> регулярно публикуют дампы трафика с разбором инцидентов.</li>',
            '<li><strong>Изучите tshark:</strong> для автоматизации анализа.</li>',
            '<li><strong>Участвуйте в CTF:</strong> задания по форензике сетевого трафика — отличный способ прокачать навыки.</li>',
            '</ol>',
            '<p><strong>Важные ссылки:</strong></p>',
            '<ul>',
            '<li><a href="https://wiki.wireshark.org/" target="_blank">Официальная Wiki Wireshark</a> — документация, примеры фильтров</li>',
            '<li><a href="https://www.malware-traffic-analysis.net/" target="_blank">Malware Traffic Analysis</a> — разбор вредоносного трафика</li>',
            '<li><a href="https://unit42.paloaltonetworks.com/" target="_blank">Palo Alto Unit 42</a> — исследования угроз с примерами PCAP</li>',
            '<li><a href="https://www.netresec.com/?page=PcapFiles" target="_blank">Netresec PCAP Repository</a> — коллекция публичных PCAP-файлов</li>',
            '</ul>'
        ].join('');
    }
});
