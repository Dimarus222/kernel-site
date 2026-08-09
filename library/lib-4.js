// ============ library/lib-4.js — CTF, АНГЛИЙСКИЙ И ДОПМАТЕРИАЛЫ ============

KERNEL_DATA.addLibrary({
    id: 204,
    section: 'library',
    title: 'CTF-платформы, английский и soft skills',
    desc: 'Где практиковаться (HTB, TryHackMe, ctftime.org), где читать первоисточники на английском и как структурировать отчёт о находке.',
    tags: ['CTF', 'английский', 'ресурсы', 'отчёты'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Зачем этот список</h3>',
            '<p>Оценки на первом курсе получают многие — площадки и привычки ниже отличают тех, кто реально прокачивается в ИБ, от тех, кто просто ходит на пары. Подробный разбор мотивации — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 7)">«План подготовки к 1 курсу»</a>.</p>',

            '<h3>CTF-платформы для практики</h3>',
            '<ul>',
            '<li><strong>TryHackMe</strong> — <a href="https://tryhackme.com" target="_blank">tryhackme.com</a>. Путь «Pre Security» и «Complete Beginner» — с пошаговыми подсказками, идеально для старта без опыта.</li>',
            '<li><strong>HackTheBox</strong> — <a href="https://hackthebox.com" target="_blank">hackthebox.com</a>. Раздел «Starting Point» — учебные машины трёх уровней сложности для новичков.</li>',
            '<li><strong>CTFtime</strong> — <a href="https://ctftime.org" target="_blank">ctftime.org</a>. Агрегатор всех проходящих CTF-турниров в мире, включая студенческие и российские.</li>',
            '<li><strong>PicoCTF</strong> — <a href="https://picoctf.org" target="_blank">picoctf.org</a>. Бесплатная площадка от Carnegie Mellon, рассчитана на школьников и первокурсников.</li>',
            '</ul>',
            '<p>Совет: начинайте с площадок с подсказками (TryHackMe), а не с «голых» соревнований — иначе быстро потеряете мотивацию.</p>',

            '<h3>Английский: где читать первоисточники</h3>',
            '<ul>',
            '<li><strong>Exploit-DB</strong> — <a href="https://www.exploit-db.com" target="_blank">exploit-db.com</a> — база публичных эксплойтов с описаниями.</li>',
            '<li><strong>MITRE ATT&CK</strong> — <a href="https://attack.mitre.org" target="_blank">attack.mitre.org</a> — уже упоминался в конспекте по модели угроз, читается полностью на английском.</li>',
            '<li><strong>r/netsec</strong> на Reddit — свежие разборы инцидентов и уязвимостей от практикующих специалистов.</li>',
            '<li>Записи докладов <strong>DEF CON</strong> и <strong>Black Hat</strong> на YouTube — можно включать с субтитрами, это нормальная практика даже для опытных специалистов.</li>',
            '</ul>',
            '<p>Не обязательно понимать всё с первого раза — цель на первом курсе - привыкнуть к формату и терминологии, а не читать бегло.</p>',

            '<h3>Структура отчёта о находке (pentest report)</h3>',
            '<p>Формат, который используется индустриально и стоит освоить заранее — пригодится и в CTF-заметках, и на реальных стажировках:</p>',
            '<ol>',
            '<li><strong>Executive Summary</strong> — краткое резюме для руководства без технических деталей: что нашли, насколько критично.</li>',
            '<li><strong>Техническое описание</strong> — что именно уязвимо, версия ПО, класс уязвимости (например, по CWE).</li>',
            '<li><strong>Proof of Concept (PoC)</strong> — шаги воспроизведения, скриншоты, команды.</li>',
            '<li><strong>Рекомендации по устранению</strong> — конкретные шаги, а не общее «обновите ПО».</li>',
            '<li><strong>Оценка критичности</strong> — например, по шкале CVSS.</li>',
            '</ol>',
            '<p>Пример заготовки заметок в этом формате — в <a href="javascript:void(0)" onclick="App.openNote(\'practice\', 103)">Лабораторной 3</a>.</p>',

            '<hr style="border:1px solid var(--border);margin:24px 0;">',
            '<p>Нормативная база и ГОСТы — отдельно, в разделе «Нормативная база ИБ»: <a href="javascript:void(0)" onclick="App.openNote(\'library\', 201)">открыть</a>.</p>'
        ].join('');
    }
});
