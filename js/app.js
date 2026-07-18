var App = (function() {
    var currentSection = 'notes';
    var currentNote = null;
    var isDark = false;

    function showSection(sectionName) {
        currentSection = sectionName;
        currentNote = null;
        document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('visible'); });
        document.getElementById('noteDetail').classList.remove('visible');
        document.getElementById('section-' + sectionName).classList.add('visible');
        document.querySelectorAll('.nav-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-section') === sectionName);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openNote(section, id) {
        var allItems = KERNEL_DATA.getAll();
        var item = allItems.find(function(i) { return i.section === section && i.id === id; });
        if (!item) return;
        currentNote = item;
        document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('visible'); });
        document.getElementById('noteDetail').classList.add('visible');
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailMeta').textContent = item.date + ' · ' + (item.tags || []).join(', ');
        document.getElementById('detailContent').innerHTML = typeof item.content === 'function' ? item.content() : item.content;
        document.querySelectorAll('#detailContent pre code').forEach(function(block) { hljs.highlightElement(block); });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function closeNote() {
        currentNote = null;
        document.getElementById('noteDetail').classList.remove('visible');
        document.getElementById('section-' + currentSection).classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleTheme() {
        isDark = !isDark;
        document.body.classList.toggle('dark', isDark);
        document.getElementById('hljs-light').disabled = isDark;
        document.getElementById('hljs-dark').disabled = !isDark;
        document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('kernel-theme', isDark ? 'dark' : 'light');
    }

    function loadTheme() {
        if (localStorage.getItem('kernel-theme') === 'dark') {
            isDark = false;
            toggleTheme();
        }
    }

    function renderCards(containerId, items) {
        var container = document.getElementById(containerId);
        if (!container || !items) return;
        container.innerHTML = items.map(function(item) {
            return '<button class="card" onclick="App.openNote(\'' + item.section + '\', ' + item.id + ')">' +
                '<div class="card-title">' + item.title + '</div>' +
                '<div class="card-desc">' + item.desc + '</div>' +
                '<div class="card-tags">' + (item.tags || []).map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' +
                '</button>';
        }).join('');
    }

    function init() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        loadTheme();
        renderCards('notesGrid', KERNEL_DATA.notes);
        renderCards('practiceGrid', KERNEL_DATA.practice);
        renderCards('libraryGrid', KERNEL_DATA.library);
        console.log('KERNEL v2.0');
    }

    function escapeHtml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function createCodeBlock(code, language) {
        return '<div class="code-block"><pre><code class="language-' + (language || 'plaintext') + '">' + escapeHtml(code) + '</code></pre></div>';
    }
function toggleMenu() {
    var nav = document.querySelector('.nav');
    var overlay = document.getElementById('navOverlay');
    var btn = document.getElementById('burgerBtn');
    nav.classList.toggle('open');
    overlay.classList.toggle('open');
    btn.classList.toggle('open');
    btn.textContent = nav.classList.contains('open') ? '✕' : '☰';
}
    return {
        showSection: showSection,
        openNote: openNote,
        closeNote: closeNote,
        toggleTheme: toggleTheme,
        init: init,
        escapeHtml: escapeHtml,
        createCodeBlock: createCodeBlock
    };
})();
