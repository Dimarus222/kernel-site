// ============ notes/note-2.js — Wireshark: МЕГА-КОНСПЕКТ ============

KERNEL_DATA.addNote({
    id: 2,
    section: 'notes',
    title: 'Wireshark: полный курс анализа трафика',
    desc: 'TCP/IP, рукопожатия, TLS, фильтры, tshark, статистика, поиск атак, форензика, цветовые правила, экспорт объектов и автоматизация.',
    tags: ['практика', 'сети', 'Wireshark', 'TCP', 'TLS', 'форензика', 'анализ'],
    date: '2026',
    content: function() {

        return [
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
            '<ul>',
            '<li><strong>Promiscuous mode</strong> — принимаются все пакеты, которые видит Wi-Fi-адаптер в рамках своей сети.</li>',
            '<li><strong>Monitor mode</strong> — адаптер слушает все беспроводные кадры на выбранном канале, включая кадры из других сетей и управляющие кадры (beacon, probe request/response). Включается командой <code>airmon-ng start wlan0</code>, после чего появляется интерфейс <code>wlan0mon</code>.</li>',
            '</ul>',

            '<h3>3. Интерфейс Wireshark</h3>',
            '<p>Главное окно Wireshark состоит из трёх панелей и строки фильтра:</p>',
            '<ul>',
            '<li><strong>Строка фильтра (Filter Toolbar)</strong> — находится вверху. Сюда вводится display filter. Зелёный цвет строки — фильтр корректен, красный — ошибка в синтаксисе.</li>',
            '<li><strong>Packet List (Список пакетов)</strong> — верхняя панель. Каждый пакет отображается одной строкой с колонками: No. (номер), Time (время от начала захвата), Source (источник), Destination (назначение), Protocol (протокол), Length (длина), Info (краткая информация). Пакеты можно сортировать по любой колонке кликом по заголовку.</li>',
            '<li><strong>Packet Details (Детали пакета)</strong> — средняя панель. Выбранный пакет раскрывается в виде дерева по уровням: Frame (метаданные захвата) → Ethernet II (MAC-адреса) → Internet Protocol Version 4 (IP-адреса, TTL, флаги) → Transmission Control Protocol (порты, флаги, seq/ack) → Прикладной протокол (HTTP, DNS, TLS). Каждый уровень можно развернуть и посмотреть значения полей.</li>',
            '<li><strong>Packet Bytes (Байты пакета)</strong> — нижняя панель. Отображает сырое содержимое пакета в шестнадцатеричном (HEX) и текстовом (ASCII) виде. Байты, соответствующие выбранному полю в средней панели, подсвечиваются. Это позволяет видеть, где именно в пакете находится, например, флаг SYN или номер порта.</li>',
            '</ul>',
            '<p><strong>Горячие клавиши:</strong></p>',
            '<ul>',
            '<li><strong>Ctrl+E</strong> — начать/остановить захват.</li>',
            '<li><strong>Ctrl+K</strong> — открыть capture options.</li>',
            '<li><strong>Ctrl+.</strong> — перейти к следующему пакету в диалоге (Conversation).</li>',
            '<li><strong>Ctrl+→ / Ctrl+←</strong> — перейти к следующему/предыдущему пакету.</li>',
            '</ul>',

            // ============================================================
            // 4. ФИЛЬТРЫ
            // ============================================================
            '<h3>4. Фильтры: Capture Filter vs Display Filter</h3>',
            '<p>В Wireshark существует два принципиально разных типа фильтров. Путаница между ними — одна из самых частых ошибок начинающих:</p>',

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
            '<p><strong>Задание 1:</strong> Откройте любой PCAP-файл. Напишите фильтр, который покажет только TCP-пакеты, адресованные на порт 80, от источника из сети 192.168.1.0/24.</p>',
            '<p><strong>Решение:</strong> <code>tcp.dstport == 80 && ip.src == 192.168.1.0/24</code></p>',
            '<p><strong>Задание 2:</strong> Найдите все пакеты, содержащие строку «password» в любом месте (заголовках или payload).</p>',
            '<p><strong>Решение:</strong> <code>frame contains "password"</code></p>',
            '<p><strong>Задание 3:</strong> Отфильтруйте все DNS-запросы, длина имени в которых превышает 40 символов (признак DNS-туннелирования).</p>',
            '<p><strong>Решение:</strong> <code>dns.qry.name.len > 40</code></p>',

            // ============================================================
            // 5. TCP
            // ============================================================
            '<h3>5. TCP: протокол транспортного уровня</h3>',
            '<p>TCP (Transmission Control Protocol) — основной протокол транспортного уровня в стеке TCP/IP. Он обеспечивает <strong>надёжную, ориентированную на соединение</strong> доставку данных между приложениями. В отличие от UDP, TCP гарантирует, что данные дойдут в правильном порядке и без потерь.</p>',

            '<h4>5.1 Структура TCP-заголовка</h4>',
            '<p>TCP-заголовок имеет размер от 20 до 60 байт и содержит поля, управляющие соединением:</p>',
            // Заменяем ASCII-схему заголовка на HTML-таблицу
            '<div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">',
            '<table style="border-collapse: collapse; text-align: center; font-size: 11px; line-height: 1.5;">',
            '<tr style="color: #888;"><td colspan="32">0                   1                   2                   3</td></tr>',
            '<tr style="color: #888;"><td colspan="32">0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1</td></tr>',
            '<tr style="border-top: 2px solid #333;">',
            '<td colspan="16" style="border: 1px solid #333; padding: 6px 12px;">Source Port</td>',
            '<td colspan="16" style="border: 1px solid #333; padding: 6px 12px;">Destination Port</td>',
            '</tr>',
            '<tr>',
            '<td colspan="32" style="border: 1px solid #333; padding: 6px;">Sequence Number</td>',
            '</tr>',
            '<tr>',
            '<td colspan="32" style="border: 1px solid #333; padding: 6px;">Acknowledgment Number</td>',
            '</tr>',
            '<tr>',
            '<td colspan="4" style="border: 1px solid #333; padding: 6px;">Data Offset</td>',
            '<td colspan="3" style="border: 1px solid #333; padding: 6px;">Resv</td>',
            '<td style="border: 1px solid #333; padding: 6px;">CWR</td>',
            '<td style="border: 1px solid #333; padding: 6px;">ECE</td>',
            '<td style="border: 1px solid #333; padding: 6px;">URG</td>',
            '<td style="border: 1px solid #333; padding: 6px;">ACK</td>',
            '<td style="border: 1px solid #333; padding: 6px;">PSH</td>',
            '<td style="border: 1px solid #333; padding: 6px;">RST</td>',
            '<td style="border: 1px solid #333; padding: 6px;">SYN</td>',
            '<td style="border: 1px solid #333; padding: 6px;">FIN</td>',
            '<td colspan="16" style="border: 1px solid #333; padding: 6px;">Window Size</td>',
            '</tr>',
            '<tr>',
            '<td colspan="16" style="border: 1px solid #333; padding: 6px;">Checksum</td>',
            '<td colspan="16" style="border: 1px solid #333; padding: 6px;">Urgent Pointer</td>',
            '</tr>',
            '<tr>',
            '<td colspan="32" style="border: 1px solid #333; padding: 6px;">Options (if Data Offset > 5)</td>',
            '</tr>',
            '</table>',
            '</div>',
            '<p><strong>Ключевые поля заголовка TCP:</strong></p>',
            '<ul>',
            '<li><strong>Source Port / Destination Port (по 16 бит)</strong> — порты отправителя и получателя. Вместе с IP-адресами образуют сокет.</li>',
            '<li><strong>Sequence Number (32 бита)</strong> — номер первого байта данных в этом сегменте. Начальное значение выбирается случайно при установке соединения.</li>',
            '<li><strong>Acknowledgment Number (32 бита)</strong> — номер следующего ожидаемого байта. Подтверждает получение всех байт до этого номера.</li>',
            '<li><strong>Data Offset (4 бита)</strong> — размер заголовка в 32-битных словах (обычно 5, т.е. 20 байт).</li>',
            '<li><strong>Flags (9 бит)</strong> — флаги управления: NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN.</li>',
            '<li><strong>Window Size (16 бит)</strong> — размер окна приёма. Сколько байт отправитель готов принять без подтверждения. Управление потоком.</li>',
            '<li><strong>Checksum (16 бит)</strong> — контрольная сумма для проверки целостности.</li>',
            '<li><strong>Urgent Pointer (16 бит)</strong> — указывает на срочные данные (используется редко).</li>',
            '</ul>',

            '<h4>5.2 Sequence и Acknowledgment Numbers</h4>',
            '<p>Это самое важное для понимания TCP. Sequence Number (seq) — номер первого байта в сегменте. Acknowledgment Number (ack) — номер следующего байта, который ожидает отправитель.</p>',
            '<p><strong>Правила:</strong></p>',
            '<ul>',
            '<li>Начальные seq выбираются случайно при установке соединения (для защиты от атак).</li>',
            '<li>Каждый байт данных увеличивает seq на 1.</li>',
            '<li>SYN и FIN считаются за 1 байт (потребляют один номер последовательности).</li>',
            '<li>ACK не потребляет номер последовательности.</li>',
            '<li>Пакет без данных (пустой ACK) не увеличивает seq.</li>',
            '</ul>',
            '<p><strong>Пример диалога:</strong></p>',
            App.createCodeBlock(
                'Клиент → Сервер: SYN, seq=100\nСервер → Клиент: SYN-ACK, seq=500, ack=101\nКлиент → Сервер: ACK, seq=101, ack=501\nКлиент → Сервер: PSH-ACK, seq=101, ack=501, len=200 (данные 101-300)\nСервер → Клиент: ACK, seq=501, ack=301 (подтвердил 200 байт)',
                'plaintext'
            ),

            '<h4>5.3 Трёхстороннее рукопожатие (Three-Way Handshake)</h4>',
            '<p>Прежде чем начать передачу данных, TCP устанавливает соединение через трёхстороннее рукопожатие. Этот процесс синхронизирует начальные sequence numbers обеих сторон:</p>',
            '<ol>',
            '<li><strong>Шаг 1 — SYN:</strong> Клиент отправляет TCP-сегмент с флагом SYN и случайным начальным seq=x. Клиент переходит в состояние <strong>SYN_SENT</strong>. В Wireshark: <code>tcp.flags.syn == 1 && tcp.flags.ack == 0</code>.</li>',
            '<li><strong>Шаг 2 — SYN-ACK:</strong> Сервер получает SYN, выделяет ресурсы под соединение (создаёт TCB — Transmission Control Block) и отправляет ответный сегмент с флагами SYN и ACK. Сервер устанавливает свой начальный seq=y и подтверждает клиентский SYN значением ack=x+1. Сервер переходит в состояние <strong>SYN_RECEIVED</strong>. В Wireshark: <code>tcp.flags.syn == 1 && tcp.flags.ack == 1</code>.</li>',
            '<li><strong>Шаг 3 — ACK:</strong> Клиент получает SYN-ACK, отправляет сегмент с флагом ACK и ack=y+1. Клиент переходит в <strong>ESTABLISHED</strong>. Сервер получает этот ACK и тоже переходит в <strong>ESTABLISHED</strong>. В Wireshark: <code>tcp.flags.ack == 1 && tcp.seq == x+1 && tcp.ack == y+1</code>.</li>',
            '</ol>',
            // Заменяем ASCII-схему рукопожатия на HTML
            '<div style="font-family: monospace; font-size: 13px; background: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; line-height: 1.7;">',
            '<span style="color: #00f;">Client</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">Server</span><br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span><br>',
            '<span style="color: #00f;">&nbsp; |</span>-------- SYN (seq=100) ----------&gt;<span style="color: #c00;">|</span> &nbsp;Шаг 1: флаг SYN<br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #888;">[SYN_SENT]</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span> &nbsp;<span style="color: #888;">[LISTEN → SYN_RCVD]</span><br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span><br>',
            '<span style="color: #00f;">&nbsp; |</span>&lt;--- SYN-ACK (seq=500, ack=101)---<span style="color: #c00;">|</span> &nbsp;Шаг 2: флаги SYN+ACK<br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #888;">[SYN_SENT → ESTABLISHED]</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span> &nbsp;<span style="color: #888;">[SYN_RCVD]</span><br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span><br>',
            '<span style="color: #00f;">&nbsp; |</span>-------- ACK (seq=101, ack=501)--&gt;<span style="color: #c00;">|</span> &nbsp;Шаг 3: флаг ACK<br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #888;">[ESTABLISHED]</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span> &nbsp;<span style="color: #888;">[SYN_RCVD → ESTABLISHED]</span><br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span><br>',
            '<span style="color: #00f;">&nbsp; |</span>===== <strong>СОЕДИНЕНИЕ УСТАНОВЛЕНО</strong> =====<span style="color: #c00;">|</span><br>',
            '<span style="color: #00f;">&nbsp; |</span> &nbsp;&nbsp;&nbsp;&nbsp; Можно передавать данные &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #c00;">|</span>',
            '</div>',
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
            // Визуализация диаграммы состояний
            '<div style="font-family: monospace; font-size: 13px; background: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; line-height: 1.6; text-align: center;">',
            '<pre style="background: none; border: none; padding: 0; margin: 0; color: #333; font-size: 12px;">',
            '                              +---------+ Активное открытие (connect)\n',
            '                              |  <strong>CLOSED</strong>  |\n',
            '                              +---------+ Пассивное открытие (listen)\n',
            '                                |     ^\n',
            '                           SYN  |     |  RST / timeout\n',
            '                                V     |\n',
            '                              +---------+\n',
            '                              |  <strong>LISTEN</strong>  |  Сервер ожидает входящих соединений\n',
            '                              +---------+\n',
            '                                |\n',
            '                           SYN  |\n',
            '                                V\n',
            '                 +---------+  SYN  +-----------+\n',
            '                 |<strong>SYN_SENT</strong> |------>|<strong>SYN_RCVD</strong>   |\n',
            '                 +---------+       +-----------+\n',
            '                      |                 |\n',
            '                 ACK  |     SYN+ACK     |  ACK\n',
            '                      V                 V\n',
            '                 +-------------------------------+\n',
            '                 |         <strong>ESTABLISHED</strong>          |  Обмен данными\n',
            '                 +-------------------------------+\n',
            '                      |                 |\n',
            '                 FIN  |                 |  FIN (close)\n',
            '                      V                 V\n',
            '                 +-----------+      +------------+\n',
            '                 |<strong>FIN_WAIT_1</strong> |      | <strong>CLOSE_WAIT</strong> |  Приложение ещё не закрыло\n',
            '                 +-----------+      +------------+\n',
            '                      |                 |\n',
            '                 ACK  |            FIN  |  (приложение закрыло сокет)\n',
            '                      V                 V\n',
            '                 +-----------+      +----------+\n',
            '                 |<strong>FIN_WAIT_2</strong> |      | <strong>LAST_ACK</strong>  |\n',
            '                 +-----------+      +----------+\n',
            '                      |                 |\n',
            '                 FIN  |            ACK  |\n',
            '                      V                 V\n',
            '                 +-----------+      +----------+\n',
            '                 | <strong>TIME_WAIT</strong> |      |  <strong>CLOSED</strong>  |\n',
            '                 +-----------+      +----------+\n',
            '                      |\n',
            '            2MSL (~60с)|\n',
            '                      V\n',
            '                    <strong>CLOSED</strong>\n',
            '</pre>',
            '</div>',
            '<p><strong>Значение состояний для безопасности:</strong></p>',
            '<ul>',
            '<li><strong>Много соединений в SYN_RECEIVED</strong> — признак SYN-flood атаки. Сервер отправляет SYN-ACK, но не получает ответного ACK.</li>',
            '<li><strong>Много соединений в TIME_WAIT</strong> — высокая нагрузка на сервер, много коротких соединений.</li>',
            '<li><strong>Соединения в CLOSE_WAIT</strong> — приложение не закрывает сокет после получения FIN. Может указывать на утечку ресурсов.</li>',
            '<li><strong>Соединения в FIN_WAIT_2</strong> — клиент отправил FIN, сервер подтвердил, но не отправляет свой FIN. Возможно, приложение на сервере зависло.</li>',
            '</ul>',

            '<h4>5.5 Флаги TCP-заголовка</h4>',
            '<div style="overflow-x: auto;">',
            '<table style="border-collapse: collapse; width: 100%; font-size: 14px;">',
            '<tr style="background: #eee;">',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Флаг</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Бит</th>',
            '<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Назначение</th>',
            '</tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">CWR</td><td style="border: 1px solid #ccc; padding: 8px;">8</td><td style="border: 1px solid #ccc; padding: 8px;">Congestion Window Reduced — окно перегрузки</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">ECE</td><td style="border: 1px solid #ccc; padding: 8px;">7</td><td style="border: 1px solid #ccc; padding: 8px;">ECN-Echo — уведомление о перегрузке</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">URG</td><td style="border: 1px solid #ccc; padding: 8px;">6</td><td style="border: 1px solid #ccc; padding: 8px;">Urgent — срочные данные (используется редко)</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">ACK</td><td style="border: 1px solid #ccc; padding: 8px;">5</td><td style="border: 1px solid #ccc; padding: 8px;">Acknowledge — подтверждение получения</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">PSH</td><td style="border: 1px solid #ccc; padding: 8px;">4</td><td style="border: 1px solid #ccc; padding: 8px;">Push — передать данные приложению немедленно</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">RST</td><td style="border: 1px solid #ccc; padding: 8px;">3</td><td style="border: 1px solid #ccc; padding: 8px;">Reset — принудительный разрыв соединения</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">SYN</td><td style="border: 1px solid #ccc; padding: 8px;">2</td><td style="border: 1px solid #ccc; padding: 8px;">Synchronize — запрос на установку соединения</td></tr>',
            '<tr><td style="border: 1px solid #ccc; padding: 8px;">FIN</td><td style="border: 1px solid #ccc; padding: 8px;">1</td><td style="border: 1px solid #ccc; padding: 8px;">Finish — завершение передачи данных</td></tr>',
            '</table>',
            '</div>',
            '<p><strong>Как читать флаги в Wireshark:</strong> в панели деталей пакета раскройте «Transmission Control Protocol» → «Flags». Вы увидите шестнадцатеричное значение (например, 0x002 = SYN, 0x010 = ACK, 0x012 = SYN+ACK, 0x011 = FIN+ACK, 0x004 = RST).</p>',

            '<h4>5.6 Завершение соединения (Four-Way Handshake)</h4>',
            '<p>TCP — полнодуплексный протокол: данные могут передаваться в обе стороны одновременно. Поэтому для завершения требуется <strong>четырёхстороннее рукопожатие</strong> — каждая сторона independently завершает свою половину соединения:</p>',
            '<ol>',
            '<li><strong>FIN от инициатора:</strong> «Я закончил передачу данных». Переходит в FIN_WAIT_1.</li>',
            '<li><strong>ACK от получателя:</strong> «Я получил твой FIN». Инициатор переходит в FIN_WAIT_2. Получатель — в CLOSE_WAIT.</li>',
            '<li><strong>FIN от получателя:</strong> «Я тоже закончил передачу». Получатель переходит в LAST_ACK.</li>',
            '<li><strong>ACK от инициатора:</strong> «Я получил твой FIN». Инициатор переходит в TIME_WAIT на 2MSL (~60 секунд). Получатель закрывается.</li>',
            '</ol>',
            '<p>В Wireshark ищите 4 пакета с флагами FIN и ACK между двумя хостами. Фильтр: <code>tcp.flags.fin == 1</code>.</p>',

            '<h4>5.7 Управление потоком: Sliding Window</h4>',
            '<p>TCP использует скользящее окно (sliding window) для управления потоком данных. Поле Window Size в заголовке TCP сообщает отправителю, сколько байт получатель готов принять. Это предотвращает переполнение буфера получателя.</p>',
            '<p><strong>В Wireshark:</strong> посмотрите на поле Window Size в TCP-заголовке. Если оно уменьшается до нуля — получатель перегружен, отправитель должен остановиться (Zero Window). Если окно то увеличивается, то уменьшается — нормальная работа.</p>',
            '<p><strong>Аномалии:</strong> постоянно маленькое окно — получатель не справляется. Постоянно нулевое окно — приложение на стороне получателя не читает данные из сокета (проблема в коде).</p>',

            '<h4>5.8 Контроль перегрузки: Congestion Control</h4>',
            '<p>В отличие от управления потоком (окно получателя), контроль перегрузки управляет тем, сколько данных отправитель может послать в сеть, не вызывая перегрузки маршрутизаторов. Алгоритмы: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery.</p>',
            '<p><strong>В Wireshark:</strong> Statistics → TCP Stream Graphs → Stevens\' Throughput. График показывает пропускную способность соединения. Провалы — потери пакетов и срабатывание контроля перегрузки.</p>',

            '<h4>5.9 Практикум по TCP-анализу</h4>',
            '<p><strong>Задание 1:</strong> Захватите трафик при открытии любого веб-сайта. Найдите трёхстороннее рукопожатие (SYN, SYN-ACK, ACK) и определите начальные sequence numbers клиента и сервера.</p>',
            '<p><strong>Решение:</strong> После захвата примените фильтр <code>tcp.stream eq N</code> для конкретного потока и найдите первые три пакета с флагами SYN.</p>',
            '<p><strong>Задание 2:</strong> Найдите в захвате пакет с флагом RST. Что могло вызвать его появление?</p>',
            '<p><strong>Подсказка:</strong> RST часто означает, что порт закрыт, или соединение было принудительно разорвано фаерволом/приложением.</p>',
            '<p><strong>Задание 3:</strong> Используя Statistics → TCP Stream Graphs → Round Trip Time, определите задержку (RTT) для выбранного соединения. Высокий RTT может указывать на проблемы в сети или удалённое расположение сервера.</p>',

            // ============================================================
            // 6. TLS
            // ============================================================
            '<h3>6. TLS Handshake в Wireshark</h3>',
            '<p>TLS (Transport Layer Security) — протокол, обеспечивающий шифрование, аутентификацию и целостность данных. Используется в HTTPS, SMTPS, IMAPS и других защищённых протоколах. Актуальная версия — TLS 1.3 (RFC 8446).</p>',

            '<h4>6.1 TLS 1.3 Handshake (упрощённый)</h4>',
            '<p>TLS 1.3 значительно упростил рукопожатие по сравнению с TLS 1.2. Теперь оно требует всего 1-RTT (Round-Trip Time) для установки соединения:</p>',
            '<ol>',
            '<li><strong>Client Hello:</strong> Клиент отправляет: поддерживаемые версии TLS, наборы шифров (cipher suites), случайное число (client random), расширения: SNI (имя сервера), supported_groups (эллиптические кривые), key_share (публичный ключ Диффи-Хеллмана).</li>',
            '<li><strong>Server Hello + Encrypted Extensions + Certificate + Certificate Verify + Finished:</strong> Сервер отвечает сразу несколькими сообщениями в одном полёте: выбирает версию и шифр, отправляет свой key_share, сертификат, подпись для верификации, и MAC рукопожатия.</li>',
            '<li><strong>Finished (клиент):</strong> Клиент проверяет сертификат и подпись, отправляет свой MAC. Рукопожатие завершено. Можно передавать данные приложения.</li>',
            '</ol>',
            '<p><strong>Фильтры Wireshark для TLS:</strong></p>',
            App.createCodeBlock(
                '# Типы сообщений TLS Handshake\ntls.handshake.type == 1      # Client Hello\ntls.handshake.type == 2      # Server Hello\ntls.handshake.type == 11     # Certificate\ntls.handshake.type == 15     # Certificate Verify\ntls.handshake.type == 20     # Finished\n\n# Просмотр SNI (имени сервера)\ntls.handshake.extensions_server_name\n\n# Просмотр сертификатов\ntls.handshake.certificate\n\n# Версия TLS\ntls.handshake.version\n\n# JA3-хеш (fingerprint клиента)\ntls.handshake.ja3  # полный JA3\n\n# Всё рукопожатие одного соединения\ntls.handshake and ip.addr eq <IP сервера>',
                'bash'
            ),

            '<h4>6.2 Анализ сертификатов в Wireshark</h4>',
            '<p>При анализе TLS-трафика можно извлечь и изучить сертификаты серверов. Это помогает выявить подозрительные соединения:</p>',
            '<ul>',
            '<li><strong>Поддельные сертификаты</strong> — выпущены неизвестным УЦ (CA), не совпадают имена.</li>',
            '<li><strong>Самоподписанные сертификаты</strong> — признак тестовой среды или атаки.</li>',
            '<li><strong>Просроченные сертификаты</strong> — сервер не обновляет сертификаты.</li>',
            '</ul>',
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
            '<p><strong>Задание 1:</strong> Найдите Client Hello пакеты в своём захвате и определите, какой SNI (имя сервера) был запрошен.</p>',
            '<p><strong>Решение:</strong> Фильтр <code>tls.handshake.type == 1</code>, затем раскройте «Transport Layer Security → TLSv1.3 Record Layer: Handshake Protocol: Client Hello → Extension: server_name».</p>',
            '<p><strong>Задание 2:</strong> Извлеките сертификат сервера из рукопожатия и проверьте его срок действия.</p>',
            '<p><strong>Решение:</strong> Найдите пакет с <code>tls.handshake.type == 11</code>, экспортируйте сертификат через контекстное меню «Export Packet Bytes», сохраните в файл с расширением <code>.der</code>. Откройте его: <code>openssl x509 -in cert.der -inform der -text -noout</code>.</p>',

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
            '<p><strong>Задание 1:</strong> Напишите однострочник для извлечения всех уникальных DNS-имён из PCAP-файла.</p>',
            '<p><strong>Решение:</strong> <code>tshark -r file.pcap -Y "dns.qry.type == 1" -T fields -e dns.qry.name | sort -u</code></p>',
            '<p><strong>Задание 2:</strong> Подсчитайте количество HTTP POST-запросов в захвате.</p>',
            '<p><strong>Решение:</strong> <code>tshark -r file.pcap -Y "http.request.method == POST" | wc -l</code></p>',
            '<p><strong>Задание 3:</strong> Выведите все пары IP-адресов, которые общались по TCP, с указанием порта назначения. Отсортируйте по количеству пакетов.</p>',
            '<p><strong>Решение:</strong> <code>tshark -r file.pcap -T fields -e ip.src -e ip.dst -e tcp.dstport | sort | uniq -c | sort -rn</code></p>',

            // ============================================================
            // 9. СТАТИСТИКА И ГРАФИКИ
            // ============================================================
            '<h3>9. Инструменты статистики Wireshark</h3>',

            '<h4>9.1 Protocol Hierarchy (Иерархия протоколов)</h4>',
            '<p>Statistics → Protocol Hierarchy. Показывает распределение трафика по протоколам в процентах. Быстрый способ увидеть: что вообще происходит в сети, нет ли аномальных протоколов (например, много ICMP при отсутствии ping\'ов — признак туннеля).</p>',

            '<h4>9.2 Conversations (Диалоги)</h4>',
            '<p>Statistics → Conversations. Группирует трафик по парам общающихся хостов. Вкладки Ethernet, IP, TCP/UDP. Позволяет найти: кто с кем общается, кто создаёт больше всего трафика, подозрительные соединения на редкие порты.</p>',

            '<h4>9.3 Endpoints (Конечные точки)</h4>',
            '<p>Statistics → Endpoints. Статистика по каждому хосту: сколько пакетов/байт отправлено и получено. Позволяет быстро найти самых активных участников сети.</p>',

            '<h4>9.4 IO Graph (График ввода-вывода)</h4>',
            '<p>Statistics → IO Graph. Строит график скорости трафика во времени. Можно добавить несколько линий с разными фильтрами (например, общий трафик + HTTP + DNS). Позволяет визуально определить пики нагрузки, DDoS-атаки, периодическую активность (C2 beaconing).</p>',

            '<h4>9.5 Expert Information</h4>',
            '<p>Analyze → Expert Information. Автоматический анализ захвата: предупреждения, ошибки, замечания по каждому протоколу. Перепроверка пакетов (retransmissions, duplicate ACKs), сбросы соединений, неправильные контрольные суммы.</p>',

            '<h4>9.6 Практикум по статистике</h4>',
            '<p><strong>Задание 1:</strong> Откройте любой PCAP-файл. Используя IO Graph, постройте график общего трафика и добавьте линию для HTTP (порт 80). Видите ли вы пики? В какое время была максимальная нагрузка?</p>',
            '<p><strong>Решение:</strong> В IO Graph добавьте фильтр <code>tcp.port == 80</code> и выберите цвет для новой линии.</p>',
            '<p><strong>Задание 2:</strong> Используя Expert Information, найдите все повторные передачи (retransmissions) в захвате. О чём это говорит?</p>',
            '<p><strong>Решение:</strong> Analyze → Expert Information, вкладка Notes/Warnings. Повторные передачи указывают на потерю пакетов в сети.</p>',
            '<p><strong>Задание 3:</strong> Сравните два захвата: нормальный трафик и трафик во время сканирования портов. Какие отличия вы видите в Conversations?</p>',
            '<p><strong>Ожидаемый результат:</strong> При сканировании будет много коротких попыток соединений на разные порты от одного IP-адреса, большинство с флагом RST в ответ.</p>',

            // ============================================================
            // 10. ЦВЕТОВЫЕ ПРАВИЛА
            // ============================================================
            '<h3>10. Цветовые правила (Coloring Rules)</h3>',
            '<p>Wireshark использует цвета для визуального выделения пакетов. Правила настраиваются через View → Coloring Rules. Стандартные правила: TCP RST — красный, HTTP — зелёный, ошибки ICMP — жёлтый.</p>',
            '<p><strong>Полезные пользовательские правила:</strong></p>',
            App.createCodeBlock(
                '# Подозрительные сканирования (SYN без ACK) — жёлтый\ntcp.flags.syn == 1 && tcp.flags.ack == 0\n\n# TCP RST — красный (уже есть по умолчанию)\ntcp.flags.reset == 1\n\n# DNS-ошибки — розовый\ndns.flags.rcode != 0\n\n# HTTP-ошибки (4xx, 5xx) — красный\nhttp.response.code >= 400',
                'bash'
            ),
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
            '<p><strong>Задача:</strong> вам прислали файл suspicious.pcap. Нужно понять, что произошло. Алгоритм действий:</p>',
            '<ol>',
            '<li><strong>Protocol Hierarchy:</strong> посмотрите, какие протоколы есть в захвате. Если видите необычные (много ICMP, странные порты) — углубитесь туда.</li>',
            '<li><strong>Conversations:</strong> определите, кто с кем общался. Выделите внешние IP-адреса, на которые были соединения.</li>',
            '<li><strong>Проверьте TCP-рукопожатия:</strong> фильтр <code>tcp.flags.syn == 1 and tcp.flags.ack == 0</code>. Это покажет все попытки установки соединений.</li>',
            '<li><strong>Найдите HTTP/DNS-запросы:</strong> возможно, были обращения к подозрительным доменам.</li>',
            '<li><strong>Проверьте TLS-рукопожатия:</strong> посмотрите SNI (<code>tls.handshake.extensions_server_name</code>) — к каким серверам обращался клиент.</li>',
            '<li><strong>Экспортируйте объекты:</strong> File → Export Objects → HTTP. Возможно, были скачаны вредоносные файлы.</li>',
            '<li><strong>Проверьте Expert Information:</strong> есть ли аномалии на уровне протоколов.</li>',
            '<li><strong>Follow TCP Stream:</strong> для подозрительных соединений откройте полный диалог (правая кнопка → Follow → TCP Stream).</li>',
            '</ol>',

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
