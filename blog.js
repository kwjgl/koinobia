// 코이노비아 소식 글 도우미 ─ 운영자 사이트(admin.koinobia.com)에서 '올리기'로 올린 글을 가져와 news.js의 글과 합치고,
// 마크다운 본문을 화면용 글로 바꿔요. 소식 페이지(/news/)와 홈(/)이 함께 써요.
//
// ── 올린 글은 어디에 있나 ──
//   운영자 사이트가 Supabase(서버)에 저장하고, 여기서는 공개된 글만 읽어 와요(로그인 필요 없음, 읽기만 가능).
//   서버에 닿지 않거나 글이 없어도 news.js의 글은 그대로 보여요. 마지막으로 받은 글은 이 기기에 기억해 두었다가 다음에 바로 보여 줘요.
//   서버 주소와 공개 키는 site.js의 newsApi에 있어요(공개 값이라 코드에 둬도 돼요).
//
// ── 본문 쓰는 법(마크다운 일부) ── 운영자 사이트 '소식' 화면의 미리보기도 같은 규칙이에요(js/markdown.js). 한쪽을 고치면 다른 쪽도 맞춰요.
//   빈 줄은 문단 나누기, 줄바꿈은 그 자리에서 줄이 바뀌어요.
//   #, ##, ### 로 시작하는 줄은 작은 제목, > 는 인용, - 또는 * 는 점 목록, 1. 은 번호 목록.
//   **굵게**, *기울임*, [글자](https://주소) · [글자](/주소) · [글자](#다른-글-id). HTML은 쓸 수 없고 글자로만 보여요.
(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // 한 줄 안의 꾸밈: **굵게**, *기울임*, [글자](https://주소 · /주소 · #글id)
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*|#[\w-]+)\)/g, '<a href="$2">$1</a>');
  }
  var H = /^#{1,3}\s+(.+)$/, UL = /^[-*]\s+(.*)$/, OL = /^\d+[.)]\s+(.*)$/, Q = /^>\s?(.*)$/;
  function starts(t) { return H.test(t) || UL.test(t) || OL.test(t) || Q.test(t); }
  // 본문(마크다운) → 화면용 HTML
  function md(text) {
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n'), n = lines.length, i = 0, out = [], m, rows;
    function take(re, fn) { rows = []; while (i < n && (m = re.exec(lines[i].trim()))) { rows.push(fn(m[1])); i++; } return rows; }
    while (i < n) {
      var t = lines[i].trim();
      if (!t) { i++; continue; }
      if ((m = H.exec(t))) { out.push('<h3>' + inline(m[1]) + '</h3>'); i++; continue; }
      if (UL.test(t)) { out.push('<ul>' + take(UL, function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ul>'); continue; }
      if (OL.test(t)) { out.push('<ol>' + take(OL, function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ol>'); continue; }
      if (Q.test(t)) { out.push('<blockquote>' + take(Q, inline).join('<br>') + '</blockquote>'); continue; }
      rows = [];
      while (i < n) { t = lines[i].trim(); if (!t || starts(t)) break; rows.push(inline(t)); i++; }
      out.push('<p>' + rows.join('<br>') + '</p>');
    }
    return out.join('');
  }
  // 본문 첫 문단(제목·인용·목록이 아닌 첫 글)을 요약으로. 너무 길면 줄여요
  function lead(text) {
    var lines = String(text || '').replace(/\r\n?/g, '\n').split('\n'), i = 0, rows = [];
    while (i < lines.length && (!lines[i].trim() || starts(lines[i].trim()))) {
      // 제목·인용·목록 덩어리는 건너뛰어요
      if (lines[i].trim()) { var t0 = lines[i].trim(); var re = H.test(t0) ? H : UL.test(t0) ? UL : OL.test(t0) ? OL : Q; while (i < lines.length && re.test(lines[i].trim())) i++; } else i++;
    }
    while (i < lines.length && lines[i].trim() && !starts(lines[i].trim())) { rows.push(lines[i].trim()); i++; }
    var p = rows.join(' ');
    return p.length > 110 ? p.slice(0, 108).replace(/\s+\S*$/, '') + '…' : p;
  }

  // ── 올린 글 가져오기 ──
  var CACHE = 'koinobia-blog-v1';
  // 서버 글 → news.js 글과 같은 모양. 공지는 날짜가 있고, 개발 노트는 날짜가 없고 앱 이름·참고 자료·사진을 가질 수 있어요.
  // slug는 주소 끝(#slug)에 쓰는 이름이에요. news.js에서 옮겨 온 글은 옛 이름(note-koide-1 등) 그대로예요
  function toNews(items) {
    return (items || []).filter(function (p) {
      return p && p.title && (p.kind === '개발 노트' || /^\d{4}-\d{2}-\d{2}$/.test(p.date || ''));
    }).map(function (p) {
      var id = p.slug || (p.id ? 'post-' + p.id : '');
      if (p.kind === '개발 노트') {
        var n = { type: 'note', id: id, app: p.app || '', title: p.title, summary: p.summary || '', body: p.body || '' };
        if (p.source && p.source.length) n.source = p.source;
        if (p.images && p.images.length) n.images = p.images;
        return n;
      }
      var a = { type: 'notice', id: id, date: p.date, tag: p.tag || '', title: p.title, summary: p.summary || '', body: p.body || '' };
      if (p.source && p.source.length) a.source = p.source;
      if (p.images && p.images.length) a.images = p.images;
      return a;
    }).filter(function (n) { return n.id; });
  }
  function readCache() {
    try { var x = JSON.parse(localStorage.getItem(CACHE) || 'null'); return x && Array.isArray(x.items) ? toNews(x.items) : null; } catch (e) { return null; }
  }
  function fetchPosts(done) {
    var api = (window.KOINOBIA || {}).newsApi || {};
    if (!api.url || !api.key || !window.fetch) return;
    var ctl = window.AbortController ? new AbortController() : null, stop = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    fetch(api.url.replace(/\/+$/, '') + '/rest/v1/rpc/news_public_list', {
      method: 'POST', headers: { apikey: api.key, 'Content-Type': 'application/json' }, body: '{}', signal: ctl ? ctl.signal : undefined
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      clearTimeout(stop);
      if (!j || !Array.isArray(j.items)) return;
      try { localStorage.setItem(CACHE, JSON.stringify({ items: j.items })); } catch (e) { /* 저장이 안 되어도 글은 보여요 */ }
      done(toNews(j.items));
    }).catch(function () { clearTimeout(stop); /* 못 받으면 있는 글 그대로 */ });
  }
  // watch(함수): 기억해 둔 글이 있으면 곧바로, 서버에서 새로 받으면 또 한 번, 올린 글 목록으로 함수를 불러요. 글이 없으면 부르지 않아요.
  function watch(fn) {
    var c = readCache(); if (c) fn(c);
    fetchPosts(fn);
  }
  window.KoinobiaBlog = { md: md, lead: lead, inline: inline, watch: watch, toNews: toNews };
})();
