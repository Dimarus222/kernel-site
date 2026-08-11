// ============ notes/note-5.js — PYTHON ДЛЯ БЕЗОПАСНИКА ============

KERNEL_DATA.addNote({
    id: 5,
    section: 'notes',
    title: 'Python для безопасника: с нуля до уверенного уровня',
    desc: 'Синтаксис, структуры данных, файлы, os/sys/re, основы ООП и практические примеры — брутфорс хэша, порт-сканер, парсер логов.',
    tags: ['Python', 'база', 'подготовка', 'скрипты'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем именно Python</h3>',
            '<p>Это язык №1 для автоматизации в ИБ: эксплойты, скрипты для CTF, парсинг логов, взаимодействие с API. Глубокое ООП на первом этапе не нужно — важнее уверенно писать короткие рабочие скрипты.</p>',

            '<h3>1. Базовый синтаксис</h3>',
            App.createCodeBlock(
                'name = "Kernel"\nage = 17\nis_student = True\n\nprint(f"{name}, возраст {age}, студент: {is_student}")\n\nif age >= 18:\n    print("Совершеннолетний")\nelse:\n    print("Несовершеннолетний")',
                'python'
            ),
            '<p>Python не использует фигурные скобки — блоки кода определяются отступами (обычно 4 пробела). Это строго: смешивание табов и пробелов вызывает ошибку.</p>',

            '<h3>2. Структуры данных</h3>',
            App.createCodeBlock(
                '# Список — упорядоченная изменяемая коллекция\npasswords = ["admin", "123456", "qwerty"]\npasswords.append("password")\n\n# Словарь — пары ключ:значение\nuser = {"login": "admin", "role": "user", "attempts": 0}\nuser["attempts"] += 1\n\n# Множество — уникальные элементы, быстрый поиск\nopen_ports = {22, 80, 443}\nprint(8080 in open_ports)  # False\n\n# Кортеж — неизменяемый список\nHOST = ("192.168.1.1", 443)',
                'python'
            ),

            '<h3>3. Функции и работа с файлами</h3>',
            App.createCodeBlock(
                'def read_lines(path):\n    with open(path, "r", encoding="utf-8") as f:\n        return [line.strip() for line in f]\n\nwords = read_lines("wordlist.txt")\nprint(f"Загружено {len(words)} строк")',
                'python'
            ),
            '<p>Конструкция <code>with open(...) as f</code> сама закрывает файл, даже если внутри произойдёт ошибка — используйте её всегда вместо ручного <code>f.close()</code>.</p>',

            '<h3>4. Модули os, sys, re</h3>',
            App.createCodeBlock(
                'import os, sys, re\n\n# os — работа с файловой системой и ОС\nfor fname in os.listdir("."):\n    print(fname)\n\n# sys — аргументы командной строки, выход из скрипта\nif len(sys.argv) < 2:\n    print("Использование: python script.py <файл>")\n    sys.exit(1)\n\n# re — регулярные выражения, ищем IP-адреса в логе\nlog_line = "Failed login from 192.168.1.45 at 10:32:01"\nmatch = re.search(r"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", log_line)\nif match:\n    print("IP:", match.group())',
                'python'
            ),

            '<h3>5. Основы ООП (без фанатизма)</h3>',
            App.createCodeBlock(
                'class Scanner:\n    def __init__(self, target):\n        self.target = target\n        self.open_ports = []\n\n    def add_port(self, port):\n        self.open_ports.append(port)\n\n    def report(self):\n        return f"{self.target}: открыты порты {self.open_ports}"\n\ns = Scanner("192.168.1.10")\ns.add_port(22)\ns.add_port(80)\nprint(s.report())',
                'python'
            ),
            '<p>Достаточно понимать: класс — шаблон, <code>__init__</code> — конструктор, <code>self</code> — ссылка на текущий объект. Глубже (наследование, полиморфизм) пригодится позже, на первом курсе это не критично.</p>',

            '<h3>6. Практика: три классических мини-скрипта</h3>',

            '<h4>6.1 Проверка хэша по словарю</h4>',
            App.createCodeBlock(
                'import hashlib\n\ndef crack_hash(target_hash, wordlist):\n    for word in wordlist:\n        if hashlib.sha256(word.encode()).hexdigest() == target_hash:\n            return word\n    return None\n\ntarget = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"\nresult = crack_hash(target, ["admin", "123456", "password", "qwerty"])\nprint(result or "Не найдено")',
                'python'
            ),

            '<h4>6.2 Простейший сканер портов</h4>',
            App.createCodeBlock(
                'import socket\n\ndef scan_port(host, port, timeout=0.5):\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(timeout)\n    result = s.connect_ex((host, port))\n    s.close()\n    return result == 0\n\nhost = "127.0.0.1"\nfor port in [21, 22, 80, 443, 3306]:\n    if scan_port(host, port):\n        print(f"Порт {port} открыт")',
                'python'
            ),
            '<p>Это учебная реализация того, что Nmap делает промышленно и в разы быстрее (см. конспект по Nmap) — но написать вручную полезно, чтобы понимать, как это работает изнутри.</p>',

            '<h4>6.3 Шифр Цезаря — азы криптографии на практике</h4>',
            App.createCodeBlock(
                'def caesar(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\nencrypted = caesar("HELLO", 3)\nprint(encrypted)              # KHOOR\nprint(caesar(encrypted, -3))  # HELLO — расшифровка',
                'python'
            ),

            '<h3>Чек-лист: что вы должны уметь</h3>',
            '<ul>',
            '<li>Писать функции, работать со списками и словарями без подглядывания в шпаргалку.</li>',
            '<li>Читать файл построчно и обрабатывать его содержимое.</li>',
            '<li>Находить нужные данные в тексте через регулярные выражения.</li>',
            '<li>Понимать, что делает класс, даже если сами пишете их редко.</li>',
            '</ul>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Больше практики: <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 102)">Лабораторная 2 — первые скрипты на Python для ИБ</a>.</p>'
        ].join('');
    }
});
