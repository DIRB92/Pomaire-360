/* ---------- Navegación de tabs ---------- */
document.querySelectorAll('#pomaire-arcade .tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('#pomaire-arcade .tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('#pomaire-arcade .game').forEach(g=>g.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('game-'+tab.dataset.game).classList.add('active');
  });
});

/* ================= MEMORAMA ================= */
(function(){
  const icons = ['🏺','🔥','🌀','🖐️','🪨','🧺','🎨','🌿'];
  let deck = [], flipped = [], matched = 0, moves = 0, lock = false;

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function build(){
    deck = shuffle([...icons, ...icons]);
    flipped = []; matched = 0; moves = 0; lock = false;
    document.getElementById('memo-moves').textContent = 0;
    document.getElementById('memo-pairs').textContent = 0;
    document.getElementById('memo-win').classList.remove('show');
    const grid = document.getElementById('memo-grid');
    grid.innerHTML = '';
    deck.forEach((icon, i)=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.icon = icon;
      card.dataset.index = i;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Carta oculta');
      card.innerHTML = `
        <div class="card-face front"></div>
        <div class="card-face back">${icon}</div>
      `;
      card.addEventListener('click', ()=>flip(card));
      card.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flip(card); }
      });
      grid.appendChild(card);
    });
  }

  function flip(card){
    if(lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if(flipped.length === 2){
      moves++;
      document.getElementById('memo-moves').textContent = moves;
      lock = true;
      const [a,b] = flipped;
      if(a.dataset.icon === b.dataset.icon){
        a.classList.add('matched'); b.classList.add('matched');
        a.setAttribute('aria-label', 'Pareja encontrada: ' + a.dataset.icon);
        b.setAttribute('aria-label', 'Pareja encontrada: ' + b.dataset.icon);
        matched++;
        document.getElementById('memo-pairs').textContent = matched;
        flipped = []; lock = false;
        if(matched === icons.length){
          document.getElementById('memo-win-moves').textContent = moves;
          document.getElementById('memo-win').classList.add('show');
        }
      } else {
        a.classList.add('mismatch'); b.classList.add('mismatch');
        setTimeout(()=>{
          a.classList.remove('flipped','mismatch'); b.classList.remove('flipped','mismatch');
          flipped = []; lock = false;
        }, 700);
      }
    }
  }

  document.getElementById('memo-restart').addEventListener('click', build);
  build();
})();

/* ================= CLICKER / MOLDEADO ================= */
(function(){
  let score = 0;
  let cps = 0;
  const items = [
    {id:'torno', name:'Torno alfarero', desc:'+1 greda/seg', icon:'🌀', baseCost:15, cost:15, cps:1, owned:0},
    {id:'horno', name:'Horno de barro', desc:'+5 greda/seg', icon:'🔥', baseCost:100, cost:100, cps:5, owned:0},
    {id:'ayudante', name:'Ayudante artesano', desc:'+20 greda/seg', icon:'🖐️', baseCost:500, cost:500, cps:20, owned:0},
  ];

  const lump = document.getElementById('clay-lump');
  const wrap = document.getElementById('clay-wrap');
  const scoreEl = document.getElementById('click-score');
  const cpsEl = document.getElementById('click-cps');
  const shop = document.getElementById('shop');
  const progressBar = document.getElementById('clay-progress-bar');
  const progressText = document.getElementById('clay-progress-text');

  function cheapestUnowned(){
    // la barra de progreso siempre apunta a la mejora más barata disponible
    return items.reduce((a,b)=> a.cost < b.cost ? a : b);
  }

  function updateProgress(){
    const target = cheapestUnowned();
    const pct = Math.max(0, Math.min(100, (score/target.cost)*100));
    progressBar.style.width = pct + '%';
    progressText.textContent = Math.floor(Math.min(score,target.cost)) + ' / ' + target.cost + ' — ' + target.icon + ' ' + target.name;
  }

  function render(justBoughtId){
    scoreEl.textContent = Math.floor(score);
    cpsEl.textContent = cps;
    shop.innerHTML = '';
    items.forEach(item=>{
      const affordable = score >= item.cost;
      const div = document.createElement('div');
      div.className = 'shop-item' + (affordable ? ' affordable' : '');
      div.innerHTML = `
        <div class="info"><span class="shop-ico">${item.icon}</span><div><b>${item.name} (${item.owned})</b><span>${item.desc}</span></div></div>
        <button class="action"${affordable ? '' : ' disabled'}>Comprar · ${item.cost}</button>
      `;
      const btn = div.querySelector('button');
      if(item.id === justBoughtId) btn.classList.add('just-bought');
      btn.addEventListener('click', ()=>{
        if(score >= item.cost){
          score -= item.cost;
          item.owned++;
          cps += item.cps;
          item.cost = Math.ceil(item.baseCost * Math.pow(1.18, item.owned));
          render(item.id);
          floatText('+' + item.cps + '/seg', 'var(--arc-green)');
        }
      });
      shop.appendChild(div);
    });
    updateProgress();
  }

  function floatText(text, color){
    const el = document.createElement('span');
    el.className = 'clay-float';
    el.textContent = text;
    if(color) el.style.color = color;
    el.style.marginLeft = (Math.random()*30 - 15) + 'px';
    wrap.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  function burstParticles(){
    for(let i=0;i<7;i++){
      const p = document.createElement('span');
      p.className = 'clay-particle';
      const angle = Math.random()*Math.PI*2;
      const dist = 40 + Math.random()*40;
      p.style.setProperty('--px', (Math.cos(angle)*dist)+'px');
      p.style.setProperty('--py', (Math.sin(angle)*dist)+'px');
      p.style.background = Math.random() > 0.5 ? 'var(--arc-gold)' : 'var(--arc-fired-light)';
      wrap.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  const clayIcon = document.getElementById('clay-icon');

  function moldear(){
    score += 1;
    render();
    floatText('+1');
    burstParticles();
    lump.classList.add('is-pressed');
    setTimeout(()=>lump.classList.remove('is-pressed'), 90);
    // sacudida real de la vasija al golpearla (se reinicia si ya estaba animando)
    clayIcon.classList.remove('wobble');
    void clayIcon.offsetWidth; // fuerza reflow para poder repetir la animación
    clayIcon.classList.add('wobble');
  }

  lump.addEventListener('click', moldear);
  lump.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); moldear(); }
  });

  setInterval(()=>{
    if(cps > 0){ score += cps/10; render(); }
  }, 100);

  render();
})();

/* ================= RECOLECTOR / PLATAFORMERO ================= */
(function(){
  const canvas = document.getElementById('plat-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const groundY = H - 40;

  let player = { x: W/2 - 20, y: groundY - 40, w: 40, h: 40, vy: 0, vx: 0, onGround: true, squash: 1 };
  const GRAVITY = 0.7, JUMP_V = -13, SPEED = 4;
  let items = [];
  let particles = [];
  let popups = []; // "+1" text popups
  let score = 0, lives = 3, spawnTimer = 0, running = true, t = 0;

  // fondo con degradado + colinas suaves, precalculado una vez
  const skyGrad = ctx.createLinearGradient(0,0,0,H);
  skyGrad.addColorStop(0, '#f3e6cf');
  skyGrad.addColorStop(1, '#e0c9a0');

  function resetItems(){ items = []; particles = []; popups = []; }

  function spawn(){
    const isRock = Math.random() < 0.28;
    items.push({
      x: Math.random()*(W-24),
      y: -24,
      w: 24, h: 24,
      vy: 2 + Math.random()*1.5,
      rock: isRock,
      spin: Math.random()*Math.PI*2
    });
  }

  function burst(x,y,color){
    for(let i=0;i<8;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 1.5 + Math.random()*2.5;
      particles.push({
        x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 1,
        life: 1, color
      });
    }
  }

  function update(){
    if(!running) return;
    t++;
    player.vy += GRAVITY;
    player.y += player.vy;
    player.x += player.vx;
    if(player.y + player.h >= groundY){
      if(!player.onGround) player.squash = 0.7; // aterrizaje: aplastado
      player.y = groundY - player.h; player.vy = 0; player.onGround = true;
    }
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    player.squash += (1 - player.squash) * 0.2; // vuelve a la forma normal

    spawnTimer++;
    if(spawnTimer > 45){ spawn(); spawnTimer = 0; }

    items.forEach(it => { it.y += it.vy; it.spin += 0.06; });

    items = items.filter(it=>{
      if(it.y > H) return false;
      const hit = it.x < player.x+player.w && it.x+it.w > player.x &&
                  it.y < player.y+player.h && it.y+it.h > player.y;
      if(hit){
        if(it.rock){
          lives--; document.getElementById('plat-lives').textContent = lives;
          burst(it.x+12, it.y+12, '#6b6b6b');
          popups.push({x: it.x+12, y: it.y, life:1, text:'💥', color:'#8F3A29'});
          if(lives<=0){ running=false; }
        } else {
          score++; document.getElementById('plat-score').textContent = score;
          burst(it.x+12, it.y+12, '#C88A3D');
          popups.push({x: it.x+12, y: it.y, life:1, text:'+1', color:'#4A7C59'});
        }
        return false;
      }
      return true;
    });

    particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; p.life-=0.04; });
    particles = particles.filter(p=>p.life>0);
    popups.forEach(p=>{ p.y-=0.8; p.life-=0.02; });
    popups = popups.filter(p=>p.life>0);
  }

  function drawGround(){
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0,0,W,H);
    // colinas de fondo suaves (parallax simple estático)
    ctx.fillStyle = 'rgba(184,92,44,0.10)';
    ctx.beginPath();
    ctx.moveTo(0, groundY-30);
    ctx.quadraticCurveTo(W*0.25, groundY-70, W*0.5, groundY-30);
    ctx.quadraticCurveTo(W*0.75, groundY+10, W, groundY-40);
    ctx.lineTo(W, groundY); ctx.lineTo(0, groundY);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#c9a877';
    ctx.fillRect(0, groundY, W, H-groundY);
    // textura de "tierra" con líneas suaves
    ctx.strokeStyle = 'rgba(42,35,29,0.08)';
    ctx.lineWidth = 1;
    for(let i=0;i<W;i+=26){
      ctx.beginPath();
      ctx.moveTo(i + ((t*0.15)%26), groundY+4);
      ctx.lineTo(i + ((t*0.15)%26) - 10, H);
      ctx.stroke();
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    drawGround();

    // sombra elíptica del jugador
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#2A231D';
    ctx.beginPath();
    ctx.ellipse(player.x+player.w/2, groundY+6, 16*player.squash, 5, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // jugador con squash/stretch
    ctx.save();
    ctx.translate(player.x+player.w/2, player.y+player.h/2);
    ctx.scale(1/player.squash, player.squash);
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧑‍🎨', 0, 2);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // items cayendo con rotación
    items.forEach(it=>{
      ctx.save();
      ctx.translate(it.x+12, it.y+12);
      ctx.rotate(Math.sin(it.spin)*0.3);
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(it.rock ? '⚫' : '🟤', 0, 0);
      ctx.restore();
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // partículas
    particles.forEach(p=>{
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x-2, p.y-2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // popups de puntaje
    popups.forEach(p=>{
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
      ctx.textAlign = 'left';
    });
    ctx.globalAlpha = 1;

    if(!running){
      ctx.fillStyle = 'rgba(42,35,29,0.78)';
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#F6EEE1';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏺 Fin del juego', W/2, H/2 - 16);
      ctx.font = '16px sans-serif';
      ctx.fillText('Puntos: ' + score, W/2, H/2 + 12);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = 'rgba(246,238,225,0.75)';
      ctx.fillText('Toca "Saltar" para reiniciar', W/2, H/2 + 38);
      ctx.textAlign = 'left';
    }
  }

  function loop(){
    update(); draw();
    requestAnimationFrame(loop);
  }

  function jump(){
    if(!running){
      player = { x: W/2-20, y: groundY-40, w:40, h:40, vy:0, vx:0, onGround:true, squash:1 };
      score = 0; lives = 3; resetItems(); running = true;
      document.getElementById('plat-score').textContent = 0;
      document.getElementById('plat-lives').textContent = 3;
      return;
    }
    if(player.onGround){ player.vy = JUMP_V; player.onGround = false; player.squash = 1.25; }
  }

  document.getElementById('plat-left').addEventListener('mousedown', ()=>player.vx=-SPEED);
  document.getElementById('plat-right').addEventListener('mousedown', ()=>player.vx=SPEED);
  document.getElementById('plat-left').addEventListener('touchstart', (e)=>{e.preventDefault();player.vx=-SPEED;});
  document.getElementById('plat-right').addEventListener('touchstart', (e)=>{e.preventDefault();player.vx=SPEED;});
  ['mouseup','mouseleave','touchend'].forEach(ev=>{
    document.getElementById('plat-left').addEventListener(ev, ()=>player.vx=0);
    document.getElementById('plat-right').addEventListener(ev, ()=>player.vx=0);
  });
  document.getElementById('plat-jump').addEventListener('click', jump);

  window.addEventListener('keydown', e=>{
    if(e.key === 'ArrowLeft') player.vx = -SPEED;
    if(e.key === 'ArrowRight') player.vx = SPEED;
    if(e.key === ' ') jump();
  });
  window.addEventListener('keyup', e=>{
    if(e.key === 'ArrowLeft' && player.vx<0) player.vx = 0;
    if(e.key === 'ArrowRight' && player.vx>0) player.vx = 0;
  });

  loop();
})();

/* ================= PUZZLE ================= */
(function(){
  const SIZE = 3;
  const TILE = 100;
  let board = []; // array of 0..8, 8 = blank
  let moves = 0;
  let imgURL = '';

  function drawVasija(){
    const c = document.createElement('canvas');
    c.width = SIZE*TILE; c.height = SIZE*TILE;
    const g = c.getContext('2d');
    g.fillStyle = '#E4D6BE';
    g.fillRect(0,0,c.width,c.height);
    // cuerpo de la vasija
    g.fillStyle = '#B24A34';
    g.beginPath();
    g.moveTo(150, 40);
    g.bezierCurveTo(90, 60, 60, 120, 80, 190);
    g.bezierCurveTo(95, 250, 120, 270, 150, 275);
    g.bezierCurveTo(180, 270, 205, 250, 220, 190);
    g.bezierCurveTo(240, 120, 210, 60, 150, 40);
    g.closePath();
    g.fill();
    // cuello
    g.fillStyle = '#8F3A29';
    g.fillRect(130, 20, 40, 30);
    // franjas decorativas
    g.strokeStyle = '#2A231D';
    g.lineWidth = 4;
    for(let y=100;y<230;y+=35){
      g.beginPath();
      g.moveTo(80, y);
      g.lineTo(220, y);
      g.stroke();
    }
    imgURL = c.toDataURL();
  }

  function solvedBoard(){
    return [0,1,2,3,4,5,6,7,8];
  }

  function shuffleBoard(){
    board = solvedBoard();
    let blank = 8;
    for(let i=0;i<200;i++){
      const moves2 = validMoves(blank);
      const m = moves2[Math.floor(Math.random()*moves2.length)];
      [board[blank], board[m]] = [board[m], board[blank]];
      blank = m;
    }
    moves = 0;
    document.getElementById('puzzle-moves').textContent = 0;
    document.getElementById('puzzle-status').textContent = '⏳ En progreso';
  }

  function validMoves(blankIndex){
    const r = Math.floor(blankIndex/SIZE), c = blankIndex%SIZE;
    const res = [];
    if(r>0) res.push(blankIndex-SIZE);
    if(r<SIZE-1) res.push(blankIndex+SIZE);
    if(c>0) res.push(blankIndex-1);
    if(c<SIZE-1) res.push(blankIndex+1);
    return res;
  }

  function render(){
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    board.forEach((val, idx)=>{
      const tile = document.createElement('div');
      tile.className = 'tile';
      if(val === 8){
        tile.classList.add('blank');
      } else {
        const sr = Math.floor(val/SIZE), sc = val%SIZE;
        tile.style.backgroundImage = `url(${imgURL})`;
        tile.style.backgroundSize = `${SIZE*TILE}px ${SIZE*TILE}px`;
        tile.style.backgroundPosition = `-${sc*TILE}px -${sr*TILE}px`;
      }
      if(val !== 8){
        tile.tabIndex = 0;
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', 'Pieza del rompecabezas');
        tile.addEventListener('keydown', (e)=>{
          if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tryMove(idx); }
        });
      }
      tile.addEventListener('click', ()=>tryMove(idx));
      grid.appendChild(tile);
    });
  }

  function tryMove(idx){
    const blank = board.indexOf(8);
    if(validMoves(blank).includes(idx)){
      [board[blank], board[idx]] = [board[idx], board[blank]];
      moves++;
      document.getElementById('puzzle-moves').textContent = moves;
      render();
      if(board.every((v,i)=>v===i)){
        document.getElementById('puzzle-status').textContent = '🏺 ¡Completado!';
        document.getElementById('puzzle-status-pill').style.background = 'var(--arc-raw)';
        document.getElementById('puzzle-status-pill').style.boxShadow = 'inset 0 0 0 1.5px var(--arc-green)';
      }
    }
  }

  const previewBtn = document.getElementById('puzzle-preview-btn');
  const previewEl = document.getElementById('puzzle-preview');
  previewBtn.addEventListener('click', ()=>{
    const show = !previewEl.classList.contains('show');
    if(show){
      previewEl.style.backgroundImage = `url(${imgURL})`;
      previewEl.classList.add('show');
      previewBtn.textContent = '🙈 Ocultar vasija';
    } else {
      previewEl.classList.remove('show');
      previewBtn.textContent = '👁️ Espiar la vasija completa';
    }
  });

  document.getElementById('puzzle-shuffle').addEventListener('click', ()=>{
    document.getElementById('puzzle-status-pill').style.background = '';
    document.getElementById('puzzle-status-pill').style.boxShadow = '';
    shuffleBoard(); render();
  });

  drawVasija();
  shuffleBoard();
  render();
})();

/* ================= TETRIS POMAIRINO ================= */
(function(){
  const COLS = 10, ROWS = 20;
  const canvas = document.getElementById('tetris-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CELL = canvas.width / COLS; // 24px
  const nextCanvas = document.getElementById('tetris-next');
  const nctx = nextCanvas.getContext('2d');

  // Paleta "greda de Pomaire": tonos de arcilla, horno y esmalte
  const COLORS = [
    null,
    '#B24A34', // I - greda cocida
    '#C88A3D', // O - arena/oro
    '#8F3A29', // T - greda oscura
    '#4A7C59', // S - verde esmalte
    '#D9694A', // Z - greda clara
    '#2A231D', // J - carbón/horno
    '#E6B246'  // L - dorado
  ];

  const SHAPES = {
    I: [[1,1,1,1]],
    O: [[2,2],[2,2]],
    T: [[0,3,0],[3,3,3]],
    S: [[0,4,4],[4,4,0]],
    Z: [[5,5,0],[0,5,5]],
    J: [[6,0,0],[6,6,6]],
    L: [[0,0,7],[7,7,7]]
  };
  const KEYS = Object.keys(SHAPES);

  let board, current, next, pos, score, level, lines, dropInterval, dropTimer, lastTime, running, paused, gameOver;

  function emptyBoard(){
    return Array.from({length: ROWS}, () => Array(COLS).fill(0));
  }

  function randomPiece(){
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    return { key, shape: SHAPES[key].map(row => row.slice()) };
  }

  function rotate(shape){
    const rows = shape.length, cols = shape[0].length;
    const out = Array.from({length: cols}, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++){
      for (let c = 0; c < cols; c++){
        out[c][rows - 1 - r] = shape[r][c];
      }
    }
    return out;
  }

  function collides(shape, px, py){
    for (let r = 0; r < shape.length; r++){
      for (let c = 0; c < shape[r].length; c++){
        if (!shape[r][c]) continue;
        const x = px + c, y = py + r;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && board[y][x]) return true;
      }
    }
    return false;
  }

  function merge(){
    current.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val){
          const y = pos.y + r, x = pos.x + c;
          if (y >= 0) board[y][x] = val;
        }
      });
    });
  }

  function clearLines(){
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--){
      if (board[y].every(cell => cell !== 0)){
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        cleared++;
        y++; // re-check same index after shift
      }
    }
    if (cleared > 0){
      const points = [0, 100, 300, 500, 800][cleared] || cleared * 200;
      score += points * level;
      lines += cleared;
      const newLevel = Math.floor(lines / 10) + 1;
      if (newLevel !== level){
        level = newLevel;
        dropInterval = Math.max(100, 800 - (level - 1) * 70);
      }
      updateHUD();
    }
  }

  function spawn(){
    current = next;
    next = randomPiece();
    pos = { x: Math.floor((COLS - current.shape[0].length) / 2), y: -getTopOffset(current.shape) };
    drawNext();
    if (collides(current.shape, pos.x, pos.y)){
      endGame();
    }
  }

  function getTopOffset(shape){
    // ensures piece starts fully above/at row 0 visually; simple approach: start at row 0
    return 0;
  }

  function hardDrop(){
    if (!running || paused || gameOver) return;
    while (!collides(current.shape, pos.x, pos.y + 1)) pos.y++;
    lockPiece();
  }

  function lockPiece(){
    merge();
    clearLines();
    spawn();
    draw();
  }

  function move(dx){
    if (!running || paused || gameOver) return;
    if (!collides(current.shape, pos.x + dx, pos.y)){
      pos.x += dx;
      draw();
    }
  }

  function softDrop(){
    if (!running || paused || gameOver) return;
    if (!collides(current.shape, pos.x, pos.y + 1)){
      pos.y++;
    } else {
      lockPiece();
      return;
    }
    draw();
  }

  function rotatePiece(){
    if (!running || paused || gameOver) return;
    const rotated = rotate(current.shape);
    // simple wall-kick attempts
    const kicks = [0, -1, 1, -2, 2];
    for (const k of kicks){
      if (!collides(rotated, pos.x + k, pos.y)){
        current.shape = rotated;
        pos.x += k;
        draw();
        return;
      }
    }
  }

  function updateHUD(){
    document.getElementById('tetris-score').textContent = score;
    document.getElementById('tetris-level').textContent = level;
    document.getElementById('tetris-lines').textContent = lines;
  }

  function drawCell(context, x, y, size, color){
    context.fillStyle = color;
    context.fillRect(x*size, y*size, size, size);
    context.strokeStyle = 'rgba(0,0,0,0.35)';
    context.lineWidth = 1;
    context.strokeRect(x*size+0.5, y*size+0.5, size-1, size-1);
    // brillo tipo cerámica esmaltada
    context.fillStyle = 'rgba(255,255,255,0.18)';
    context.fillRect(x*size+2, y*size+2, size-4, Math.max(2, size*0.22));
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // tablero
    for (let y = 0; y < ROWS; y++){
      for (let x = 0; x < COLS; x++){
        if (board[y][x]) drawCell(ctx, x, y, CELL, COLORS[board[y][x]]);
      }
    }
    // pieza actual
    if (current){
      current.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val){
            const y = pos.y + r;
            if (y >= 0) drawCell(ctx, pos.x + c, y, CELL, COLORS[val]);
          }
        });
      });
    }
    // grid sutil
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let x = 1; x < COLS; x++){
      ctx.beginPath(); ctx.moveTo(x*CELL, 0); ctx.lineTo(x*CELL, canvas.height); ctx.stroke();
    }
    for (let y = 1; y < ROWS; y++){
      ctx.beginPath(); ctx.moveTo(0, y*CELL), ctx.lineTo(canvas.width, y*CELL); ctx.stroke();
    }
  }

  function drawNext(){
    nctx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const shape = next.shape;
    const size = 20;
    const offX = (nextCanvas.width - shape[0].length * size) / 2 / size;
    const offY = (nextCanvas.height - shape.length * size) / 2 / size;
    shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) drawCell(nctx, c + offX, r + offY, size, COLORS[val]);
      });
    });
  }

  function endGame(){
    running = false;
    gameOver = true;
    document.getElementById('tetris-status').textContent = '🏺 ¡Juego terminado! Puntos: ' + score;
    document.getElementById('tetris-pause').textContent = '⏸ Pausar';
  }

  function resetGame(){
    board = emptyBoard();
    score = 0; level = 1; lines = 0;
    dropInterval = 800;
    running = true; paused = false; gameOver = false;
    next = randomPiece();
    spawn();
    updateHUD();
    document.getElementById('tetris-status').textContent = '';
    document.getElementById('tetris-pause').textContent = '⏸ Pausar';
    draw();
    lastTime = performance.now();
    dropTimer = 0;
  }

  function loop(time){
    if (running && !paused && !gameOver){
      const delta = time - lastTime;
      dropTimer += delta;
      if (dropTimer > dropInterval){
        dropTimer = 0;
        if (!collides(current.shape, pos.x, pos.y + 1)){
          pos.y++;
        } else {
          lockPiece();
        }
        draw();
      }
    }
    lastTime = time;
    requestAnimationFrame(loop);
  }

  function togglePause(){
    if (gameOver) return;
    paused = !paused;
    document.getElementById('tetris-pause').textContent = paused ? '▶ Reanudar' : '⏸ Pausar';
    document.getElementById('tetris-status').textContent = paused ? '⏸ En pausa' : '';
  }

  // Controles de botones
  document.getElementById('tetris-left').addEventListener('click', () => move(-1));
  document.getElementById('tetris-right').addEventListener('click', () => move(1));
  document.getElementById('tetris-rotate').addEventListener('click', rotatePiece);
  document.getElementById('tetris-drop').addEventListener('click', softDrop);
  document.getElementById('tetris-pause').addEventListener('click', togglePause);
  document.getElementById('tetris-restart').addEventListener('click', resetGame);

  // Controles de teclado (solo cuando el juego está visible/activo)
  function isTetrisActive(){
    const section = document.getElementById('game-tetris');
    return section && section.classList.contains('active');
  }
  window.addEventListener('keydown', (e) => {
    if (!isTetrisActive()) return;
    switch(e.key){
      case 'ArrowLeft': e.preventDefault(); move(-1); break;
      case 'ArrowRight': e.preventDefault(); move(1); break;
      case 'ArrowDown': e.preventDefault(); softDrop(); break;
      case 'ArrowUp': e.preventDefault(); rotatePiece(); break;
      case ' ': e.preventDefault(); hardDrop(); break;
      case 'p': case 'P': togglePause(); break;
    }
  });

  // Soporte táctil simple: swipe / tap sobre el canvas
  let touchStartX = null, touchStartY = null, touchMoved = false;
  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX; touchStartY = t.clientY; touchMoved = false;
  }, {passive:true});
  canvas.addEventListener('touchmove', (e) => {
    if (touchStartX === null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > 24){
      move(dx > 0 ? 1 : -1);
      touchStartX = t.clientX;
      touchMoved = true;
    } else if (dy > 24){
      softDrop();
      touchStartY = t.clientY;
      touchMoved = true;
    }
  }, {passive:true});
  canvas.addEventListener('touchend', () => {
    if (!touchMoved) rotatePiece();
    touchStartX = null; touchStartY = null;
  });

  resetGame();
  requestAnimationFrame(loop);
})();
