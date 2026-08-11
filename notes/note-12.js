// ============ notes/note-12.js — РЕВЕРС-ИНЖИНИРИНГ И АССЕМБЛЕР ============

KERNEL_DATA.addNote({
    id: 12,
    section: 'notes',
    title: 'Реверс-инжиниринг и ассемблер x86: первые шаги',
    desc: 'Регистры процессора, стек, основные инструкции, статический анализ бинарников через strings/objdump/Ghidra, разбор простого crackme.',
    tags: ['reverse', 'ассемблер', 'база', 'CTF'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем это первокурснику</h3>',
            '<p>Reverse engineering — обратный процесс: есть скомпилированная программа, нужно понять, как она устроена, без исходного кода. Пригодится для анализа вредоносного ПО, категории <em>reverse</em> в CTF и просто для понимания того, во что превращается ваш код после компиляции.</p>',

            '<h3>1. Минимум по архитектуре x86-64</h3>',
            '<p>Регистры — это «переменные» процессора, доступные без обращения к памяти:</p>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Регистр</th><th style="padding:8px 10px;">Назначение (по соглашению)</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">RAX</td><td style="padding:6px 10px;">Аккумулятор, возвращаемое значение функции</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">RBX</td><td style="padding:6px 10px;">База, часто используется как временное хранилище</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">RSP</td><td style="padding:6px 10px;">Указатель вершины стека (Stack Pointer)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;">RBP</td><td style="padding:6px 10px;">Указатель базы текущего кадра стека (Base Pointer)</td></tr>',
            '<tr><td style="padding:6px 10px;">RIP</td><td style="padding:6px 10px;">Указатель на следующую выполняемую инструкцию</td></tr>',
            '</tbody></table>',

            '<h3>2. Стек и вызов функций</h3>',
            '<p>При каждом вызове функции создаётся «кадр стека»: сохраняется адрес возврата, локальные переменные. Понимание этого — основа для разбора переполнения буфера (buffer overflow).</p>',
            App.createCodeBlock(
                'push rbp          ; сохранить старый base pointer\nmov rbp, rsp       ; новый base pointer = текущая вершина стека\nsub rsp, 0x20       ; выделить 32 байта под локальные переменные\n; ... тело функции ...\nmov rsp, rbp        ; освободить локальные переменные\npop rbp             ; восстановить старый base pointer\nret                 ; вернуться по адресу, снятому со стека',
                'plaintext'
            ),

            '<h3>3. Базовые инструкции</h3>',
            '<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">',
            '<thead><tr style="border-bottom:2px solid var(--border);">',
            '<th style="padding:8px 10px;">Инструкция</th><th style="padding:8px 10px;">Что делает</th>',
            '</tr></thead><tbody>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><code>mov a, b</code></td><td style="padding:6px 10px;">Скопировать значение b в a</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><code>cmp a, b</code></td><td style="padding:6px 10px;">Сравнить a и b (результат — во флагах)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><code>je / jne</code></td><td style="padding:6px 10px;">Перейти, если равно / если не равно (после cmp)</td></tr>',
            '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px 10px;"><code>call / ret</code></td><td style="padding:6px 10px;">Вызвать функцию / вернуться из неё</td></tr>',
            '<tr><td style="padding:6px 10px;"><code>add / sub</code></td><td style="padding:6px 10px;">Сложение / вычитание</td></tr>',
            '</tbody></table>',

            '<h3>4. Инструменты статического анализа</h3>',
            App.createCodeBlock(
                'file program              # тип файла, архитектура\nstrings program            # все читаемые строки внутри бинарника —\n                            # часто выдаёт пароли, отладочные сообщения, URL\nobjdump -d program          # дизассемблированный код в текстовом виде\nchecksec program            # какие защиты включены (ASLR, стек-канарейки, NX)',
                'bash'
            ),
            '<p>Для более удобного визуального анализа со временем стоит освоить <strong>Ghidra</strong> (бесплатный, от АНБ) или <strong>IDA Free</strong> — они показывают не просто ассемблер, а восстанавливают псевдокод, близкий к C.</p>',

            '<h3>5. Динамический анализ: отладчик</h3>',
            '<p>В отличие от статического анализа (читаем код, не запуская), динамический — запускаем программу под контролем отладчика и смотрим, что происходит в реальном времени.</p>',
            App.createCodeBlock(
                'gdb ./program\n(gdb) break main       # поставить точку останова на функции main\n(gdb) run              # запустить\n(gdb) info registers   # посмотреть текущие значения регистров\n(gdb) step             # выполнить следующую инструкцию\n(gdb) x/20xb $rsp      # посмотреть 20 байт в памяти по адресу вершины стека',
                'bash'
            ),

            '<h3>Учебный пример: логика простого crackme</h3>',
            '<p>Типичная задача уровня "easy" в CTF: программа спрашивает пароль и сравнивает его посимвольно или через контрольную сумму. Ваша цель — найти в дизассемблированном коде место сравнения (<code>cmp</code>) и понять, с чем именно сравнивается введённый пароль.</p>',
            App.createCodeBlock(
                'mov edi, [rbp-0x8]   ; введённый пароль\ncall strlen           ; узнать длину\ncmp eax, 8            ; должна быть ровно 8 символов\njne fail\n; ... далее посимвольное сравнение или XOR с ключом ...',
                'plaintext'
            ),

            '<h3>Чек-лист: что вы должны уметь</h3>',
            '<ul>',
            '<li>Назвать назначение регистров RAX, RSP, RBP, RIP.</li>',
            '<li>Прочитать вывод <code>strings</code> и <code>objdump -d</code> на простом бинарнике.</li>',
            '<li>Поставить точку останова в gdb и пошагово пройти функцию.</li>',
            '</ul>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Практика: <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 107)">Лабораторная — статический анализ простого бинарника</a>.</p>'
        ].join('');
    }
});
