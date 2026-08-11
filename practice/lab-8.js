// ============ practice/lab-8.js — ЛАБОРАТОРНАЯ: РАЗБОР АРТЕФАКТОВ И МЕТАДАННЫХ ============

KERNEL_DATA.addPractice({
    id: 108,
    section: 'practice',
    title: 'Лабораторная: разбор артефактов и метаданных',
    desc: 'Извлекаем EXIF из фото, прячем и находим данные через стеганографию, ищем вложенные файлы через binwalk.',
    tags: ['практика', 'форензика', 'CTF'],
    date: 'Август 2026',
    content: function() {
        return [
            '<h3>Цель</h3>',
            '<p>Пройти путь типичной CTF-задачи категории forensics: от файла-«улики» до найденного флага. Теория — в конспекте <a href="javascript:void(0)" onclick="App.openNote(\'notes\', 13)">«Цифровая криминалистика»</a>.</p>',

            '<h3>Шаг 0. Устанавливаем инструменты</h3>',
            App.createCodeBlock('sudo apt install exiftool binwalk steghide -y', 'bash'),

            '<h3>Шаг 1. Метаданные фотографии</h3>',
            '<p>Сделайте фото на телефон (или возьмите любое своё), перенесите на ВМ и посмотрите его метаданные:</p>',
            App.createCodeBlock('exiftool photo.jpg', 'bash'),
            '<p>Обратите внимание на поля <code>GPS Position</code> (если геолокация была включена), <code>Create Date</code>, <code>Camera Model</code>. Это ровно то, что находят в реальных расследованиях по случайно выложенным фото.</p>',
            '<p>Попробуйте удалить метаданные и убедиться, что они действительно исчезли:</p>',
            App.createCodeBlock('exiftool -all= photo_clean.jpg photo.jpg\nexiftool photo_clean.jpg   # метаданных быть не должно', 'bash'),

            '<h3>Шаг 2. Прячем и находим данные через стеганографию</h3>',
            '<p>Спрячьте текстовый файл внутри картинки:</p>',
            App.createCodeBlock(
                'echo "flag{steg_is_fun}" > secret.txt\nsteghide embed -cf cover.jpg -ef secret.txt -p "learnpass123"',
                'bash'
            ),
            '<p>Теперь представьте, что вы получили только <code>cover.jpg</code> без пароля, и попробуйте извлечь данные:</p>',
            App.createCodeBlock('steghide extract -sf cover.jpg', 'bash'),
            '<p>Без пароля steghide не даст извлечь — что демонстрирует правильный подход к защите: сам факт стеганографии в CTF обычно уже подсказан (задача называется «forensics»), а вот пароль часто нужно найти отдельно — в других метаданных, в названии файла, в намёке в условии задачи.</p>',

            '<h3>Шаг 3. Поиск вложенных файлов через binwalk</h3>',
            '<p>Создайте файл, в который «встроен» архив (частый трюк в CTF — просто склеить два файла):</p>',
            App.createCodeBlock(
                'zip secret.zip secret.txt\ncat cover.jpg secret.zip > combined.jpg\nbinwalk combined.jpg          # покажет сигнатуру ZIP внутри JPEG\nbinwalk -e combined.jpg        # извлечёт найденный архив в папку _combined.jpg.extracted/',
                'bash'
            ),

            '<h3>Самопроверка</h3>',
            '<ul>',
            '<li>Вы извлекли и прочитали EXIF-данные реального фото.</li>',
            '<li>Вы спрятали и (зная пароль) успешно извлекли файл через steghide.</li>',
            '<li>Вы нашли и извлекли ZIP-архив, склеенный с JPEG, через binwalk.</li>',
            '<li>Вы можете объяснить, почему для forensics-задач в CTF важно пробовать несколько инструментов подряд (file, exiftool, binwalk, strings) — редко сразу понятно, какой сработает.</li>',
            '</ul>'
        ].join('');
    }
});
