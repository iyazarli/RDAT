// Ortak kaynak: turnuva/src/engine.ts. Yenileme: scripts/integrate.mjs.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.emptyResult = void 0;
exports.fresh = fresh;
exports.played = played;
exports.winner = winner;
exports.loser = loser;
exports.validateResult = validateResult;
exports.stats = stats;
exports.standings = standings;
exports.thirds = thirds;
exports.groupComplete = groupComplete;
exports.draw = draw;
exports.reconcile = reconcile;
exports.setResult = setResult;
exports.summary = summary;
exports.demo = demo;
exports.validateTournament = validateTournament;
const emptyResult = () => ({ a: null, b: null, flag: null, sweep: null, winner: null });
exports.emptyResult = emptyResult;
function fresh(name = 'Yeni Turnuva') { return { id: crypto.randomUUID(), name, demo: false, teams: [], seed: '1', groups: [], matches: [], log: [], revision: 0 }; }
const score = (n) => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= 10000;
function played(m) { return !!m.home && !!m.away && score(m.result.a) && score(m.result.b); }
function winner(m) {
    if (!m || !played(m))
        return null;
    const { a, b, winner: selected } = m.result;
    if (a > b)
        return m.home;
    if (b > a)
        return m.away;
    return selected && [m.home, m.away].includes(selected) ? selected : null;
}
function loser(m) { const w = winner(m); return w && m ? (w === m.home ? m.away : m.home) : null; }
function validateResult(m, r) {
    if (!m.home || !m.away)
        throw new Error('Önceki tur tamamlanmadan sonuç girilemez.');
    for (const n of [r.a, r.b])
        if (n !== null && !score(n))
            throw new Error('Skor 0–10000 arasında tam sayı olmalıdır.');
    for (const id of [r.flag, r.sweep, r.winner])
        if (id !== null && ![m.home, m.away].includes(id))
            throw new Error('Seçilen takım bu maçta yer almıyor.');
    if (r.winner && (r.a === null || r.b === null || r.a !== r.b || m.stage === 'group'))
        throw new Error('Kazanan seçimi yalnızca beraberlikli eleme maçında kullanılır.');
}
function stats(ids, matches, group = 0) {
    return ids.map((id, order) => {
        const s = { id, played: 0, points: 0, hits: 0, flags: 0, sweeps: 0, order, group };
        for (const m of matches) {
            if (!played(m) || ![m.home, m.away].includes(id))
                continue;
            const own = m.home === id ? m.result.a : m.result.b;
            const other = m.home === id ? m.result.b : m.result.a;
            s.played++;
            s.hits += own;
            s.points += own > other ? 3 : own === other ? 1 : 0;
            if (m.result.flag === id) {
                s.flags++;
                s.points += 5;
            }
            if (m.result.sweep === id) {
                s.sweeps++;
                s.points += 2;
            }
        }
        return s;
    });
}
const compare = (a, b) => b.points - a.points || b.hits - a.hits || b.flags - a.flags || b.sweeps - a.sweeps;
exports.compare = compare;
function standings(t) {
    return t.groups.map((ids, g) => stats(ids, t.matches.filter(m => m.stage === 'group' && m.group === g), g).sort((a, b) => (0, exports.compare)(a, b) || a.order - b.order));
}
function thirds(t) {
    return standings(t).map(g => g[2]).filter((s) => !!s).sort((a, b) => (0, exports.compare)(a, b) || a.group - b.group);
}
function groupComplete(t) { const ms = t.matches.filter(m => m.stage === 'group'); return ms.length === 60 && ms.every(played); }
function draw(t, seed) {
    if (t.teams.length !== 40)
        throw new Error('Kura için tam 40 takım gereklidir.');
    if (!seed.trim() || seed.length > 100)
        throw new Error('Kura numarası 1–100 karakter olmalıdır.');
    const next = structuredClone(t);
    let h = 2166136261;
    for (const c of seed) {
        h ^= c.charCodeAt(0);
        h = Math.imul(h, 16777619);
    }
    const random = () => { h += 0x6D2B79F5; let x = Math.imul(h ^ h >>> 15, 1 | h); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
    const ids = next.teams.map(x => x.id).sort();
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const groups = Array.from({ length: 10 }, (_, g) => ids.slice(g * 4, g * 4 + 4));
    if (JSON.stringify(groups) === JSON.stringify(t.groups)) {
        next.seed = seed;
        return next;
    }
    next.seed = seed;
    next.groups = groups;
    next.matches = [];
    for (let g = 0; g < 10; g++)
        for (let a = 0; a < 4; a++)
            for (let b = a + 1; b < 4; b++)
                next.matches.push({ id: `g${g}-${a}${b}`, stage: 'group', round: `Grup ${String.fromCharCode(65 + g)}`, group: g, home: groups[g][a], away: groups[g][b], result: (0, exports.emptyResult)() });
    next.log.push(`Kura oluşturuldu: ${seed}. Önceki kuranın sonuçları sıfırlandı.`);
    return reconcile(next).tournament;
}
function reconcile(input) {
    const t = structuredClone(input);
    if (!t.groups.length) {
        t.matches = [];
        return { tournament: t, invalidated: [] };
    }
    const old = new Map(t.matches.map(m => [m.id, m]));
    const invalidated = [];
    t.matches = t.matches.filter(m => m.stage === 'group');
    const ready = groupComplete(t);
    const ss = standings(t);
    const ts = thirds(t);
    const rank = (g, pos) => ready ? ss[g]?.[pos - 1]?.id ?? null : null;
    const best = ready ? ts[0]?.id ?? null : null;
    const middle = ready ? ss.map(g => g[2]).filter(s => s.id !== ts[0].id && s.id !== ts[9].id).map(s => s.id) : [];
    const add = (id, stage, round, home, away) => {
        const prior = old.get(id);
        let result = (0, exports.emptyResult)();
        if (prior && prior.home === home && prior.away === away && home && away)
            result = prior.result;
        else if (prior && Object.values(prior.result).some(v => v !== null))
            invalidated.push(id);
        const m = { id, stage, round, home, away, result };
        t.matches.push(m);
        return m;
    };
    const get = (id) => t.matches.find(m => m.id === id);
    for (let i = 0; i < 4; i++)
        add(`tq${i}`, 'third', 'Çeyrek Final', middle[i * 2] ?? null, middle[i * 2 + 1] ?? null);
    for (let i = 0; i < 2; i++)
        add(`ts${i}`, 'third', 'Yarı Final', winner(get(`tq${i * 2}`)), winner(get(`tq${i * 2 + 1}`)));
    add('tf', 'third', 'Final', winner(get('ts0')), winner(get('ts1')));
    const pre = [[rank(5, 2), rank(1, 2)], [best, rank(0, 2)], [rank(3, 2), rank(7, 2)], [rank(2, 2), rank(4, 2)], [rank(6, 2), rank(9, 2)], [winner(get('tf')), rank(8, 2)]];
    pre.forEach(([a, b], i) => add(`fp${i}`, 'finals', 'Ön Eleme', a, b));
    const w = (i) => winner(get(`fp${i}`));
    const r16 = [[rank(7, 1), rank(8, 1)], [rank(1, 1), w(1)], [rank(9, 1), w(0)], [rank(6, 1), w(3)], [w(4), rank(2, 1)], [rank(5, 1), w(5)], [rank(4, 1), rank(0, 1)], [w(2), rank(3, 1)]];
    r16.forEach(([a, b], i) => add(`fr${i}`, 'finals', 'Son 16', a, b));
    for (let i = 0; i < 4; i++)
        add(`fq${i}`, 'finals', 'Çeyrek Final', winner(get(`fr${i * 2}`)), winner(get(`fr${i * 2 + 1}`)));
    for (let i = 0; i < 2; i++)
        add(`fs${i}`, 'finals', 'Yarı Final', winner(get(`fq${i * 2}`)), winner(get(`fq${i * 2 + 1}`)));
    add('fb', 'finals', 'Üçüncülük Maçı', loser(get('fs0')), loser(get('fs1')));
    add('ff', 'finals', 'Final', winner(get('fs0')), winner(get('fs1')));
    if (invalidated.length)
        t.log.push(`Eşleşmesi değişen ${invalidated.length} maçın sonucu temizlendi: ${invalidated.join(', ')}.`);
    return { tournament: t, invalidated };
}
function setResult(t, id, r) {
    const next = structuredClone(t);
    const m = next.matches.find(x => x.id === id);
    if (!m)
        throw new Error('Maç bulunamadı.');
    validateResult(m, r);
    m.result = r;
    return reconcile(next);
}
function summary(t) {
    const find = (id) => t.matches.find(m => m.id === id);
    const name = (id) => t.teams.find(x => x.id === id)?.name ?? '';
    const leaders = (stage) => {
        const values = stats(t.teams.map(x => x.id), t.matches.filter(m => m.stage === stage));
        return Object.fromEntries(['points', 'flags', 'sweeps', 'hits'].map(k => { const max = Math.max(0, ...values.map(v => v[k])); return [k, max ? values.filter(v => v[k] === max).map(v => name(v.id)).join(' - ') : '']; }));
    };
    return { gold: name(winner(find('ff'))), silver: name(loser(find('ff'))), bronze: name(winner(find('fb'))), group: leaders('group'), finals: leaders('finals') };
}
function demo() {
    let t = fresh('Demo / 40 Takım');
    t.demo = true;
    t.teams = Array.from({ length: 40 }, (_, i) => ({ id: `team-${String(i + 1).padStart(2, '0')}`, name: `Demo Takım ${String(i + 1).padStart(2, '0')}`, city: ['İstanbul', 'Ankara', 'İzmir', 'Eskişehir'][i % 4], players: [`Oyuncu ${i + 1}A`, `Oyuncu ${i + 1}B`], captain: `Oyuncu ${i + 1}A` }));
    t = draw(t, '2026');
    for (const m of t.matches.filter(x => x.stage === 'group'))
        t = setResult(t, m.id, { a: 5, b: 1, flag: m.home, sweep: m.home, winner: null }).tournament;
    for (const id of t.matches.filter(x => x.stage !== 'group').map(x => x.id)) {
        const m = t.matches.find(x => x.id === id);
        t = setResult(t, id, { a: 3, b: 2, flag: m.home, sweep: null, winner: null }).tournament;
    }
    return t;
}
function validateTournament(value) {
    if (!value || typeof value !== 'object')
        throw new Error('Geçersiz turnuva dosyası.');
    const t = value;
    if (typeof t.id !== 'string' || !t.id || t.id.length > 100 || typeof t.name !== 'string' || !t.name.trim() || t.name.length > 200 || typeof t.demo !== 'boolean' || typeof t.seed !== 'string' || !Array.isArray(t.teams) || t.teams.length > 40 || !Array.isArray(t.groups) || !Array.isArray(t.matches) || !Array.isArray(t.log) || !Number.isSafeInteger(t.revision))
        throw new Error('Turnuva yapısı geçersiz.');
    const ids = new Set();
    const names = new Set();
    for (const team of t.teams) {
        if (!team || typeof team.id !== 'string' || !team.id || ids.has(team.id) || typeof team.name !== 'string' || !team.name.trim() || team.name.length > 100 || names.has(team.name.trim().toLocaleLowerCase('tr')) || typeof team.city !== 'string' || typeof team.captain !== 'string' || !Array.isArray(team.players) || team.players.length > 100 || team.players.some(p => typeof p !== 'string' || !p.trim() || p.length > 100) || new Set(team.players).size !== team.players.length || team.captain && !team.players.includes(team.captain))
            throw new Error('Takım adı benzersiz olmalı; kaptan oyuncular arasında olmalıdır.');
        ids.add(team.id);
        names.add(team.name.trim().toLocaleLowerCase('tr'));
    }
    if (t.groups.length) {
        const flat = t.groups.flat();
        if (t.groups.length !== 10 || t.groups.some(g => !Array.isArray(g) || g.length !== 4) || flat.length !== 40 || new Set(flat).size !== 40 || flat.some(id => !ids.has(id)))
            throw new Error('Grup yerleşimi geçersiz.');
        const groupMatches = t.matches.filter(m => m.stage === 'group');
        if (groupMatches.length !== 60)
            throw new Error('60 grup maçı gereklidir.');
        const expected = new Set();
        t.groups.forEach((g, gi) => { for (let a = 0; a < 4; a++)
            for (let b = a + 1; b < 4; b++)
                expected.add(`${gi}:${[g[a], g[b]].sort().join(':')}`); });
        for (const m of groupMatches) {
            const k = `${m.group}:${[m.home, m.away].sort().join(':')}`;
            if (!expected.delete(k))
                throw new Error('Grup maçları geçersiz veya tekrarlı.');
        }
    }
    else if (t.matches.length)
        throw new Error('Kurasız turnuvada maç bulunamaz.');
    const matchIds = new Set();
    for (const m of t.matches) {
        if (!m || typeof m.id !== 'string' || matchIds.has(m.id) || !['group', 'third', 'finals'].includes(m.stage) || !m.result || typeof m.round !== 'string')
            throw new Error('Maç yapısı geçersiz.');
        matchIds.add(m.id);
        if (m.home === m.away && m.home || m.home && !ids.has(m.home) || m.away && !ids.has(m.away))
            throw new Error('Maç takımları geçersiz.');
        if (m.home && m.away)
            validateResult(m, m.result);
        else if (Object.values(m.result).some(x => x !== null))
            throw new Error('Bekleyen eşleşmede sonuç bulunamaz.');
        for (const key of ['a', 'b', 'flag', 'sweep', 'winner'])
            if (!(key in m.result))
                throw new Error('Eksik sonuç alanı.');
    }
    if (t.log.some(s => typeof s !== 'string'))
        throw new Error('Kayıt geçmişi geçersiz.');
}
