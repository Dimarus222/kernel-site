// ============ library/lib-5.js — ИНСТРУМЕНТЫ БЕЗОПАСНИКА ============

KERNEL_DATA.addLibrary({
    id: 205,
    section: 'library',
    title: 'Инструменты безопасника: краткий обзор',
    desc: 'Burp Suite, Metasploit, John the Ripper, Hashcat, Gobuster, Hydra — что это, для чего и с чего начать.',
    tags: ['инструменты', 'пентест', 'справочник'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем этот список</h3>',
            '<p>Краткий ориентир по основным инструментам, которые встретятся на практике и в CTF. Подробные разборы Nmap и Wireshark уже есть отдельными конспектами — здесь остальное.</p>',

            '<h3>Разведка и сканирование</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструмент</th><th style="padding:8px 10px;">Назначение</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>Nmap</strong></td><td style="padding:6px 10px;">Сканирование портов и сервисов — см. отдельный конспект</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>Gobuster / dirb</strong></td><td style="padding:6px 10px;">Перебор скрытых директорий и файлов на веб-сервере</td></tr>',
            '<tr><td style="padding:6px 10px;"><strong>Nikto</strong></td><td style="padding:6px 10px;">Автоматическая проверка веб-сервера на типовые ошибки конфигурации</td></tr>',
            '</tbody></table>',

            '<h3>Анализ трафика</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструмент</th><th style="padding:8px 10px;">Назначение</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>Wireshark</strong></td><td style="padding:6px 10px;">Анализ сетевого трафика с графическим интерфейсом — см. отдельный конспект</td></tr>',
            '<tr><td style="padding:6px 10px;"><strong>tcpdump</strong></td><td style="padding:6px 10px;">Консольный захват трафика, используется на серверах без GUI</td></tr>',
            '</tbody></table>',

            '<h3>Веб-приложения</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструмент</th><th style="padding:8px 10px;">Назначение</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>Burp Suite</strong></td><td style="padding:6px 10px;">Прокси для перехвата и модификации HTTP-запросов — стандарт индустрии для тестирования веб-приложений (есть бесплатная Community-версия)</td></tr>',
            '<tr><td style="padding:6px 10px;"><strong>OWASP ZAP</strong></td><td style="padding:6px 10px;">Бесплатная альтернатива Burp с похожим функционалом</td></tr>',
            '</tbody></table>',

            '<h3>Пароли и хэши</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструмент</th><th style="padding:8px 10px;">Назначение</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>John the Ripper</strong></td><td style="padding:6px 10px;">Восстановление паролей по хэшу (словарные и брутфорс-атаки)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>Hashcat</strong></td><td style="padding:6px 10px;">То же самое, но с использованием мощности видеокарты — на порядки быстрее</td></tr>',
            '<tr><td style="padding:6px 10px;"><strong>Hydra</strong></td><td style="padding:6px 10px;">Брутфорс форм входа и сетевых сервисов (SSH, FTP, HTTP-формы)</td></tr>',
            '</tbody></table>',

            '<h3>Эксплуатация</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструмент</th><th style="padding:8px 10px;">Назначение</th>',
            '</tr></thead><tbody>',
            '<tr><td style="padding:6px 10px;"><strong>Metasploit Framework</strong></td><td style="padding:6px 10px;">База готовых эксплойтов и payload\'ов с единым интерфейсом управления — стандарт для учебных и легальных пентестов</td></tr>',
            '</tbody></table>',

            '<h3>С чего начать на первом курсе</h3>',
            '<p>Не пытайтесь освоить всё сразу. Разумный порядок: <strong>Nmap → Wireshark → Burp Suite / OWASP ZAP → John the Ripper</strong>. Metasploit и Hydra подключайте, когда уже уверенно ориентируетесь в сетях и веб-уязвимостях (конспекты выше).</p>',
            '<p><strong>Все инструменты — только на легальных целях</strong>: собственная ВМ, специально уязвимые учебные приложения (DVWA, Juice Shop), платформы TryHackMe и HackTheBox. Использование против чужих систем без письменного разрешения — уголовное преступление по ст. 272-274 УК РФ.</p>'
        ].join('');
    }
});
