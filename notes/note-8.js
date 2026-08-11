// ============ notes/note-8.js — КРИПТОГРАФИЯ: ОСНОВЫ ============

KERNEL_DATA.addNote({
    id: 8,
    section: 'notes',
    title: 'Криптография: основы',
    desc: 'Симметричное и асимметричное шифрование, хэш-функции, RSA на пальцах, TLS, соль и почему нельзя изобретать свою криптографию.',
    tags: ['криптография', 'база', 'RSA', 'AES', 'TLS'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Три задачи, которые решает криптография</h3>',
            '<ul>',
            '<li><strong>Конфиденциальность</strong> — данные читает только тот, кому предназначены (шифрование).</li>',
            '<li><strong>Целостность</strong> — данные не были изменены (хэш-функции, MAC).</li>',
            '<li><strong>Аутентификация</strong> — отправитель действительно тот, за кого себя выдаёт (цифровая подпись).</li>',
            '</ul>',

            '<h3>1. Симметричное шифрование</h3>',
            '<p>Один и тот же ключ используется для шифрования и расшифровки. Быстро, но есть проблема: как безопасно передать ключ второй стороне?</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Алгоритм</th><th style="padding:8px 10px;">Статус</th><th style="padding:8px 10px;">Комментарий</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><strong>AES-256</strong></td><td style="padding:6px 10px;">Безопасен</td><td style="padding:6px 10px;">Стандарт де-факто, используется в TLS, дисковом шифровании</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">ГОСТ 28147-89 / «Кузнечик»</td><td style="padding:6px 10px;">Безопасен</td><td style="padding:6px 10px;">Российский стандарт, обязателен в госсекторе (см. библиотеку)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">DES</td><td style="padding:6px 10px;">Устарел</td><td style="padding:6px 10px;">Ключ 56 бит — перебирается за часы</td></tr>',
            '<tr><td style="padding:6px 10px;">RC4</td><td style="padding:6px 10px;">Небезопасен</td><td style="padding:6px 10px;">Статистические смещения в потоке, исключён из TLS 1.3</td></tr>',
            '</tbody></table>',

            '<h3>2. Асимметричное шифрование</h3>',
            '<p>Пара ключей: <strong>публичный</strong> (можно раздавать всем) и <strong>приватный</strong> (хранится в секрете). Зашифрованное публичным ключом расшифровывается только приватным — и наоборот, для подписи.</p>',

            '<h4>RSA на пальцах</h4>',
            '<p>Основан на том, что перемножить два больших простых числа легко, а разложить результат обратно на множители — вычислительно почти невозможно при достаточной длине ключа (2048+ бит).</p>',
            App.createCodeBlock(
                'from sympy import isprime, mod_inverse\n\n# Учебный пример на маленьких числах — НИКОГДА не используйте в реальности\np, q = 61, 53\nn = p * q                  # публичный модуль\nphi = (p - 1) * (q - 1)\ne = 17                      # публичная экспонента\nd = mod_inverse(e, phi)    # приватная экспонента\n\nmessage = 65\nencrypted = pow(message, e, n)\ndecrypted = pow(encrypted, d, n)\nprint(encrypted, decrypted)  # decrypted == message',
                'python'
            ),
            '<p>Асимметричное шифрование медленное, поэтому на практике им шифруют не сами данные, а симметричный ключ сессии — это называется <strong>гибридным шифрованием</strong> и лежит в основе TLS.</p>',

            '<h3>3. Хэш-функции</h3>',
            '<p>Односторонняя функция: из данных легко получить хэш фиксированной длины, но восстановить данные обратно — нет. Используется для проверки целостности и хранения паролей.</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Алгоритм</th><th style="padding:8px 10px;">Статус</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">SHA-256 / SHA-3</td><td style="padding:6px 10px;">Безопасны, стандарт сегодня</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">ГОСТ Р 34.11 («Стрибог»)</td><td style="padding:6px 10px;">Российский стандарт</td></tr>',
            '<tr><td style="padding:6px 10px;">MD5, SHA-1</td><td style="padding:6px 10px;">Небезопасны — найдены коллизии, не использовать</td></tr>',
            '</tbody></table>',
            '<p><strong>Важно:</strong> для хранения паролей обычный хэш (даже SHA-256) недостаточен — нужны специализированные функции <strong>bcrypt</strong>, <strong>scrypt</strong> или <strong>Argon2</strong>, которые намеренно медленные и используют «соль» (случайную добавку к паролю перед хэшированием), чтобы затруднить перебор по радужным таблицам.</p>',

            '<h3>4. Как это всё работает вместе: TLS-рукопожатие</h3>',
            App.createCodeBlock(
                '1. Client Hello   — клиент предлагает поддерживаемые алгоритмы\n2. Server Hello   — сервер выбирает алгоритм, присылает сертификат (публичный ключ)\n3. Проверка сертификата клиентом через цепочку доверия (Certificate Authority)\n4. Обмен ключами — согласуется общий симметричный ключ сессии (гибридная схема)\n5. Дальнейшая передача данных шифруется уже симметрично (AES) — это быстро',
                'plaintext'
            ),
            '<p>Разобрать это в живом трафике можно на практике в конспекте по Wireshark — там есть отдельный раздел про TLS.</p>',

            '<h3>Золотое правило: не изобретайте свою криптографию</h3>',
            '<p>Даже профессиональные криптографы допускают ошибки при написании собственных алгоритмов — почти все взломы приходятся не на сам алгоритм (AES не взломан математически до сих пор), а на его неправильную реализацию: слабый источник случайности, повторное использование IV, отсутствие проверки целостности. Используйте проверенные библиотеки (OpenSSL, libsodium) вместо самописных решений.</p>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Практика: <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 106)">Лабораторная — RSA вручную на малых числах</a>.</p>'
        ].join('');
    }
});
