// ============ practice/lab-2.js — ЛАБОРАТОРНАЯ 2: PYTHON ДЛЯ ИБ ============

KERNEL_DATA.addPractice({
    id: 102,
    section: 'practice',
    title: 'Лабораторная 2: первые скрипты на Python для ИБ',
    desc: 'Три практических задания: подбор пароля по хэшу, сканер портов, парсер логов через regex — с заготовками и решениями.',
    tags: ['практика', 'Python', 'скрипты'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>Написать три коротких, но практически полезных скрипта. Теория — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 5)">«Python для безопасника»</a>. Попробуйте сначала сами, решение — под спойлером ниже каждого задания.</p>',

            '<h3>Задание 1. Подбор пароля по словарю</h3>',
            '<p>Дан SHA-256 хэш. Напишите функцию, которая перебирает список слов и находит совпадение.</p>',
            App.createCodeBlock(
                'import hashlib\n\ntarget_hash = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94"\nwordlist = ["qwerty", "letmein", "dragon", "monkey", "football", "iloveyou"]\n\n# TODO: реализуйте функцию crack(target_hash, wordlist)\n# должна вернуть найденное слово или None',
                'python'
            ),
            '<details style="margin:12px 0;"><summary style="cursor:pointer;color:var(--accent);">Показать решение</summary>',
            App.createCodeBlock(
                'def crack(target_hash, wordlist):\n    for word in wordlist:\n        if hashlib.sha256(word.encode()).hexdigest() == target_hash:\n            return word\n    return None\n\nprint(crack(target_hash, wordlist))',
                'python'
            ),
            '</details>',

            '<h3>Задание 2. Сканер портов на локальном хосте</h3>',
            '<p>Проверьте, какие из портов [21, 22, 80, 443, 3306, 8080] открыты на <code>127.0.0.1</code>. Ограничьте время ожидания соединения (timeout), иначе скрипт будет зависать на закрытых портах.</p>',
            App.createCodeBlock(
                'import socket\n\nports_to_check = [21, 22, 80, 443, 3306, 8080]\n\n# TODO: для каждого порта проверить, открыт ли он, и вывести результат',
                'python'
            ),
            '<details style="margin:12px 0;"><summary style="cursor:pointer;color:var(--accent);">Показать решение</summary>',
            App.createCodeBlock(
                'def scan_port(host, port, timeout=0.5):\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(timeout)\n    is_open = s.connect_ex((host, port)) == 0\n    s.close()\n    return is_open\n\nfor port in ports_to_check:\n    status = "открыт" if scan_port("127.0.0.1", port) else "закрыт"\n    print(f"Порт {port}: {status}")',
                'python'
            ),
            '</details>',

            '<h3>Задание 3. Парсер лога неудачных входов</h3>',
            '<p>Из строк лога нужно извлечь все IP-адреса, с которых были неудачные попытки входа, и посчитать, сколько раз встречается каждый.</p>',
            App.createCodeBlock(
                'log_lines = [\n    "Failed login from 192.168.1.45 at 10:32:01",\n    "Failed login from 10.0.0.7 at 10:33:12",\n    "Successful login from 192.168.1.10 at 10:34:00",\n    "Failed login from 192.168.1.45 at 10:35:44",\n]\n\n# TODO: найти все "Failed login" и посчитать количество попыток по каждому IP',
                'python'
            ),
            '<details style="margin:12px 0;"><summary style="cursor:pointer;color:var(--accent);">Показать решение</summary>',
            App.createCodeBlock(
                'import re\nfrom collections import Counter\n\nfailed_ips = []\nfor line in log_lines:\n    if "Failed login" in line:\n        match = re.search(r"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", line)\n        if match:\n            failed_ips.append(match.group())\n\ncounts = Counter(failed_ips)\nfor ip, n in counts.items():\n    print(f"{ip}: {n} неудачных попыток")',
                'python'
            ),
            '</details>',

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>Все три скрипта запускаются без ошибок и дают ожидаемый результат.</li>',
            '<li>Вы можете объяснить, зачем в сканере портов нужен <code>timeout</code>.</li>',
            '<li>Вы понимаете паттерн <code>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}</code> и могли бы написать его сами.</li>',
            '</ul>'
        ].join('');
    }
});
