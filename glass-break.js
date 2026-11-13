(function () {
    'use strict';

    var HITS_TO_BREAK = 5;
    var hits = 0;
    var root = document.documentElement;
    var shell = document.querySelector('.site-shell') || document.body;

    var style = document.createElement('style');
    style.textContent =
        '.gb-glass{position:fixed;inset:0;z-index:2147483647;touch-action:none;' +
        'background:linear-gradient(135deg,rgba(120,170,190,.28),rgba(20,40,60,.38) 55%,rgba(150,200,210,.25));' +
        '-webkit-backdrop-filter:blur(3px) saturate(1.2);backdrop-filter:blur(3px) saturate(1.2);' +
        'cursor:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'><text y=\'30\' font-size=\'30\'>🔨</text></svg>") 6 6,pointer;' +
        'user-select:none;-webkit-user-select:none}' +
        '.gb-glass canvas{position:absolute;inset:0;width:100%;height:100%}' +
        '.gb-hint{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#fff;' +
        'font:600 20px/1.3 sans-serif;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,.6);' +
        'pointer-events:none;transition:opacity .4s}' +
        '.gb-shake{animation:gb-shake .18s}' +
        '@keyframes gb-shake{25%{transform:translate(-4px,3px)}50%{transform:translate(4px,-3px)}75%{transform:translate(-2px,-2px)}}' +
        '.gb-shards{position:fixed;inset:0;z-index:2147483647;pointer-events:none;overflow:hidden}' +
        '.gb-shard{position:absolute;inset:0;background:linear-gradient(135deg,rgba(140,190,205,.45),rgba(20,40,60,.5));' +
        'animation:gb-fall var(--d) cubic-bezier(.5,0,.9,.6) forwards}' +
        '@keyframes gb-fall{to{transform:translate(var(--x),110vh) rotate(var(--r));opacity:.2}}' +
        'html.gb-locked,html.gb-locked body{overflow:hidden!important;height:100%}';
    document.head.appendChild(style);

    root.classList.add('gb-locked');
    shell.setAttribute('inert', '');

    var glass = document.createElement('div');
    glass.className = 'gb-glass';
    glass.setAttribute('role', 'dialog');
    glass.setAttribute('aria-label', 'Click the glass 5 times to break it');
    var canvas = document.createElement('canvas');
    var hint = document.createElement('div');
    hint.className = 'gb-hint';
    hint.innerHTML = 'Break the glass to enter<br><small>Hit it ' + HITS_TO_BREAK + ' times</small>';
    glass.appendChild(canvas);
    glass.appendChild(hint);
    document.body.appendChild(glass);

    var ctx = canvas.getContext('2d');
    var cracks = [];

    function resize() {
        var dpr = window.devicePixelRatio || 1;
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }

    function rnd(a, b) { return a + Math.random() * (b - a); }

    // Jagged line from (x,y) in direction angle; may spawn branches.
    function makeCrack(x, y, angle, len, depth) {
        var pts = [[x, y]];
        var d = 0;
        while (d < len) {
            var step = rnd(40, 120);
            angle += rnd(-0.08, 0.08);
            x += Math.cos(angle) * step;
            y += Math.sin(angle) * step;
            d += step;
            pts.push([x, y]);
            if (depth < 2 && Math.random() < 0.15) {
                cracks.push({ pts: makeCrack(x, y, angle + (Math.random() < .5 ? -1 : 1) * rnd(.4, .9), len * rnd(.2, .5), depth + 1), w: 1 - depth * .3 });
            }
        }
        return pts;
    }

    function addImpact(x, y) {
        var rays = Math.round(rnd(7, 11)) + hits * 2;
        var size = Math.max(innerWidth, innerHeight);
        for (var i = 0; i < rays; i++) {
            var a = (i / rays) * Math.PI * 2 + rnd(-0.25, 0.25);
            cracks.push({ pts: makeCrack(x, y, a, rnd(.15, .6) * size, 0), w: 1.4 });
        }
        cracks.push({ pts: [], w: 0, impact: [x, y] });
    }

    function redraw() {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        cracks.forEach(function (c) {
            if (c.impact) {
                var g = ctx.createRadialGradient(c.impact[0], c.impact[1], 0, c.impact[0], c.impact[1], 28);
                g.addColorStop(0, 'rgba(255,255,255,.55)');
                g.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(c.impact[0], c.impact[1], 28, 0, 6.29);
                ctx.fill();
                return;
            }
            ctx.beginPath();
            c.pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
            ctx.strokeStyle = 'rgba(0,0,0,.35)';
            ctx.lineWidth = c.w * 2.4;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,.9)';
            ctx.lineWidth = c.w;
            ctx.stroke();
        });
    }

    function shatter() {
        var wrap = document.createElement('div');
        wrap.className = 'gb-shards';
        var cols = 9, rows = 6, jit = 0.35;
        var grid = [];
        for (var j = 0; j <= rows; j++) {
            grid[j] = [];
            for (var i = 0; i <= cols; i++) {
                var edge = i === 0 || j === 0 || i === cols || j === rows;
                grid[j][i] = [
                    (i + (edge && (i === 0 || i === cols) ? 0 : rnd(-jit, jit))) / cols * 100,
                    (j + (edge && (j === 0 || j === rows) ? 0 : rnd(-jit, jit))) / rows * 100
                ];
            }
        }
        function tri(a, b, c) {
            var s = document.createElement('div');
            s.className = 'gb-shard';
            s.style.clipPath = 'polygon(' + [a, b, c].map(function (p) { return p[0] + '% ' + p[1] + '%'; }).join(',') + ')';
            s.style.setProperty('--d', rnd(.8, 1.6) + 's');
            s.style.setProperty('--x', rnd(-120, 120) + 'px');
            s.style.setProperty('--r', rnd(-40, 40) + 'deg');
            s.style.animationDelay = rnd(0, .25) + 's';
            wrap.appendChild(s);
        }
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var p = grid[y][x], q = grid[y][x + 1], r = grid[y + 1][x + 1], s2 = grid[y + 1][x];
                tri(p, q, r);
                tri(p, r, s2);
            }
        }
        document.body.appendChild(wrap);
        setTimeout(function () { wrap.remove(); }, 2200);
    }

    function breakGlass() {
        glass.remove();
        style.textContent = style.textContent.replace(/html\.gb-locked[^}]*}/, '');
        root.classList.remove('gb-locked');
        shell.removeAttribute('inert');
        removeEventListener('resize', resize);
        shatter();
    }

    function handlePointerDown(e) {
        e.preventDefault();
        hits++;
        hint.style.opacity = 0;
        if (hits >= HITS_TO_BREAK) return breakGlass();

        var x = e.clientX ?? rnd(0, innerWidth);
        var y = e.clientY ?? rnd(0, innerHeight);
        addImpact(x, y);
        redraw();

        glass.classList.remove('gb-shake');
        void glass.offsetWidth;
        glass.classList.add('gb-shake');
    }

    glass.addEventListener('pointerdown', handlePointerDown);

    // Block wheel/touch/keyboard scrolling and context menu while glass is intact.
    ['wheel', 'touchmove', 'contextmenu'].forEach(function (t) {
        glass.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false });
    });
    addEventListener('keydown', function lock(e) {
        if (!glass.isConnected) return removeEventListener('keydown', lock, true);
        if (e.key === 'Tab' || e.key.indexOf('Arrow') === 0 || e.key === ' ' || e.key.indexOf('Page') === 0 || e.key === 'Home' || e.key === 'End') {
            handlePointerDown(e);
        }
    }, true);

    addEventListener('resize', resize);
    resize();
})();
