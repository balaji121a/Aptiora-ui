function nav(page){location.href=page;}
/* APTIORA Global JS v3 */
'use strict';

// ── THEME ──
function applyTheme(){
  let m=localStorage.getItem('darkMode')||(window.matchMedia&&window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');
  document.body.classList.toggle('light',m==='light');
  let btn=document.getElementById('themeBtn');
  if(btn)btn.innerText=m==='light'?'☀️':'🌙';
}
function toggleTheme(){
  let isLight=document.body.classList.toggle('light');
  localStorage.setItem('darkMode',isLight?'light':'dark');
  let btn=document.getElementById('themeBtn');
  if(btn)btn.innerText=isLight?'☀️':'🌙';
}

// ── SIDEBAR ──
function initSidebar(){
  let sidebar=document.getElementById('appSidebar');
  let main=document.getElementById('appMain');
  let overlay=document.getElementById('mobileOverlay');
  let colBtn=document.getElementById('collapseBtn');
  if(!sidebar)return;
  let collapsed=localStorage.getItem('sidebarCollapsed')==='1';
  if(collapsed&&window.innerWidth>768){sidebar.classList.add('collapsed');if(main)main.classList.add('collapsed');}
  if(colBtn)colBtn.onclick=()=>{
    if(window.innerWidth<=768){sidebar.classList.toggle('mobile-open');if(overlay)overlay.classList.toggle('on');}
    else{collapsed=!collapsed;sidebar.classList.toggle('collapsed',collapsed);if(main)main.classList.toggle('collapsed',collapsed);localStorage.setItem('sidebarCollapsed',collapsed?'1':'0');}
  };
  if(overlay)overlay.onclick=()=>{sidebar.classList.remove('mobile-open');overlay.classList.remove('on');};
  // Mark active nav item
  let path=location.pathname.split('/').pop();
  document.querySelectorAll('.s-item[data-page]').forEach(el=>{if(el.dataset.page===path)el.classList.add('active');});
  document.querySelectorAll('.bn-item[data-page]').forEach(el=>{if(el.dataset.page===path)el.classList.add('active');});
}

// ── PARTICLES ──
function initParticles(canvasId='bgCanvas'){
  let cv=document.getElementById(canvasId);if(!cv)return;
  let ctx=cv.getContext('2d');
  let W=cv.width=innerWidth,H=cv.height=innerHeight;
  class P{constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.4+0.3;this.dx=(Math.random()-.5)*.32;this.dy=(Math.random()-.5)*.32;this.a=Math.random()*.45+0.08;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${this.a})`;ctx.fill();}
    update(){this.x+=this.dx;this.y+=this.dy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();this.draw();}
  }
  const pts=Array.from({length:70},()=>new P()),maxD=120;
  function loop(){
    ctx.clearRect(0,0,W,H);pts.forEach(p=>p.update());
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      let d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<maxD){ctx.beginPath();ctx.strokeStyle=`rgba(124,58,237,${(1-d/maxD)*0.11})`;ctx.lineWidth=0.7;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
    }
    requestAnimationFrame(loop);
  }
  loop();
  addEventListener('resize',()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;});
}

// ── SOUND ──
let _actx=null,soundOn=localStorage.getItem('soundEnabled')!=='off';
function _getCtx(){if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();return _actx;}
function playTone(f,d,t='sine',v=0.22){
  if(!soundOn)return;
  try{let a=_getCtx(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d);o.start();o.stop(a.currentTime+d);}catch(e){}
}
function sndClick(){playTone(440,0.045);}
function sndCorrect(){playTone(523,0.08);setTimeout(()=>playTone(659,0.08),90);setTimeout(()=>playTone(784,0.18),180);}
function sndWrong(){playTone(220,0.28,'sawtooth',0.18);}
function sndWarn(){[0,180,360].forEach(d=>setTimeout(()=>playTone(880,0.09),d));}
function toggleSound(){soundOn=!soundOn;localStorage.setItem('soundEnabled',soundOn?'on':'off');let b=document.getElementById('soundBtn');if(b)b.innerText=soundOn?'🔊':'🔇';}

// ── RIPPLE ──
function addRipple(el,e){
  let r=el.getBoundingClientRect(),d=document.createElement('span');
  d.className='ripple-el';let s=Math.max(r.width,r.height);
  d.style.cssText=`width:${s}px;height:${s}px;left:${(e?e.clientX:r.left+r.width/2)-r.left-s/2}px;top:${(e?e.clientY:r.top+r.height/2)-r.top-s/2}px;`;
  el.style.position='relative';el.style.overflow='hidden';el.appendChild(d);
  setTimeout(()=>d.remove(),520);
}

// ── ANIMATED COUNTER ──
function animateCounter(el,to,duration=1200,suffix=''){
  let start=0,step=to/60,frame=duration/60;
  let iv=setInterval(()=>{start+=step;if(start>=to){start=to;clearInterval(iv);}el.innerText=Math.floor(start)+suffix;},frame);
}

// ── USERS ──
function getUsers(){return JSON.parse(localStorage.getItem('users'))||{'714524205005':{name:'Balaji',dept:'IT',batch:'2024-2028',password:'1234'},'714524205053':{name:'Vicky',dept:'IT',batch:'2024-2028',password:'1234'},'714524205027':{name:'Ismail',dept:'IT',batch:'2024-2028',password:'1234'},'714524205041':{name:'Sakthivel',dept:'IT',batch:'2024-2028',password:'1234'}};}
function getCurrentUser(){let reg=localStorage.getItem('username');if(!reg){location.href='login.html';return null;}return{reg,...(getUsers()[reg]||{name:'Student'})};}
function requireLogin(){let r=localStorage.getItem('username');if(!r)location.href='login.html';return r;}
function logout(){localStorage.removeItem('username');location.href='login.html';}

// ── SETTINGS ──
function getSettings(){return JSON.parse(localStorage.getItem('adminSettings'))||{assessTime:45,secureCode:'123456',antiCheat:true,forceFullscreen:true,shuffleQ:true,certDownload:true,courseStart:'25 Mar 2026',courseEnd:'05 Apr 2026'};}

// ── NOTIFICATIONS (push to user) ──
function pushNotif(msg,type='info'){
  let notifs=JSON.parse(localStorage.getItem('userNotifs'))||[];
  notifs.unshift({msg,type,time:new Date().toLocaleTimeString(),read:false});
  notifs=notifs.slice(0,20);
  localStorage.setItem('userNotifs',JSON.stringify(notifs));
  let dot=document.getElementById('notifDot');if(dot)dot.classList.add('on');
}

// ── SCORE HISTORY ──
function saveScoreHistory(reg,topic,score,total,extra={}){
  let hist=JSON.parse(localStorage.getItem('scoreHistory_'+reg))||[];
  hist.push({topic,score,total,date:new Date().toLocaleDateString('en-IN'),time:new Date().toLocaleTimeString(),...extra});
  localStorage.setItem('scoreHistory_'+reg,JSON.stringify(hist));
}

// ── BADGES ──
const BADGE_DEFS=[
  {id:'first_practice',icon:'🎯',name:'First Step',desc:'Completed first practice session'},
  {id:'streak_3',icon:'🔥',name:'On Fire',desc:'3-day streak'},
  {id:'streak_7',icon:'⚡',name:'Week Warrior',desc:'7-day streak'},
  {id:'perfect_score',icon:'💯',name:'Perfect Score',desc:'100% in a practice session'},
  {id:'top_3',icon:'🏆',name:'Podium',desc:'Top 3 in leaderboard'},
  {id:'assessment_done',icon:'📝',name:'Assessed',desc:'Completed first assessment'},
  {id:'interview_done',icon:'🎤',name:'Speaker',desc:'Completed mock interview'},
  {id:'coding_done',icon:'💻',name:'Coder',desc:'Solved first coding problem'},
  {id:'all_topics',icon:'📚',name:'All-Rounder',desc:'Completed all aptitude topics'},
];
function getBadges(reg){return JSON.parse(localStorage.getItem('badges_'+reg))||[];}
function awardBadge(reg,id){
  let badges=getBadges(reg);
  if(badges.includes(id))return false;
  badges.push(id);localStorage.setItem('badges_'+reg,JSON.stringify(badges));
  let def=BADGE_DEFS.find(b=>b.id===id);
  if(def)showBadgeToast(def);
  return true;
}
function showBadgeToast(def){
  let t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,rgba(124,58,237,0.95),rgba(109,40,217,0.9));color:white;padding:12px 22px;border-radius:16px;font-family:Inter,sans-serif;font-size:14px;font-weight:700;z-index:9999;opacity:0;transition:all 0.4s;box-shadow:0 8px 28px rgba(124,58,237,0.45);display:flex;align-items:center;gap:10px;';
  t.innerHTML=`<span style="font-size:24px">${def.icon}</span><div><div>Badge Unlocked!</div><div style="font-size:12px;opacity:0.8;font-weight:500">${def.name}</div></div>`;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';},50);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';setTimeout(()=>t.remove(),400);},3200);
}

// ── CONFETTI ──
function launchConfetti(count=60){
  for(let i=0;i<count;i++){
    let c=document.createElement('div');
    c.style.cssText=`position:fixed;left:${Math.random()*100}%;top:-10px;width:8px;height:8px;background:hsl(${Math.random()*360},90%,60%);z-index:9999;border-radius:2px;pointer-events:none;`;
    document.body.appendChild(c);
    c.animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(${innerHeight+20}px) rotate(720deg)`}],{duration:2800+Math.random()*1800});
    setTimeout(()=>c.remove(),5000);
  }
}

// ── KEYBOARD SHORTCUTS (test page) ──
function initTestKeyboard(selectAns,prevQ,nextQ,toggleFlag){
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    if(e.key==='1'||e.key==='a'||e.key==='A')selectAns(0);
    else if(e.key==='2'||e.key==='b'||e.key==='B')selectAns(1);
    else if(e.key==='3'||e.key==='c'||e.key==='C')selectAns(2);
    else if(e.key==='4'||e.key==='d'||e.key==='D')selectAns(3);
    else if(e.key==='ArrowRight'||e.key===' ')nextQ();
    else if(e.key==='ArrowLeft')prevQ();
    else if(e.key==='f'||e.key==='F')toggleFlag();
  });
}

// ── SIDEBAR NAV HTML GENERATOR ──
function buildSidebar(activePage,userName,userReg){
  return `
  <div class="app-sidebar" id="appSidebar">
    <div class="s-logo">
      <div class="s-logo-icon">📘</div>
      <div class="s-logo-text">APTIORA</div>
    </div>
    <div class="s-nav">
      <div class="s-sec-title">Main</div>
      <div class="s-item${activePage==='dashboard'?' active':''}" data-page="dashboard.html" onclick="nav('dashboard.html')"><div class="s-icon">🏠</div><div class="s-text">Dashboard</div></div>
      <div class="s-item${activePage==='aptitude'?' active':''}" data-page="aptitude.html" onclick="nav('aptitude.html')"><div class="s-icon">📖</div><div class="s-text">Aptitude</div></div>
      <div class="s-item${activePage==='coding'?' active':''}" data-page="coding.html" onclick="nav('coding.html')"><div class="s-icon">💻</div><div class="s-text">Coding</div></div>
      <div class="s-item${activePage==='english'?' active':''}" data-page="english.html" onclick="nav('english.html')"><div class="s-icon">🗣</div><div class="s-text">English</div></div>
      <div class="s-item${activePage==='technical'?' active':''}" data-page="technical.html" onclick="nav('technical.html')"><div class="s-icon">🔬</div><div class="s-text">Technical</div></div>
      <div class="s-sec-title">Practice</div>
      <div class="s-item${activePage==='interview'?' active':''}" data-page="interview.html" onclick="nav('interview.html')"><div class="s-icon">🎤</div><div class="s-text">Mock Interview</div></div>
      <div class="s-item${activePage==='placement'?' active':''}" data-page="placement.html" onclick="nav('placement.html')"><div class="s-icon">🏢</div><div class="s-text">Placement</div></div>
      <div class="s-sec-title">Results</div>
      <div class="s-item${activePage==='leaderboard'?' active':''}" data-page="leaderboard.html" onclick="nav('leaderboard.html')"><div class="s-icon">🏆</div><div class="s-text">Leaderboard</div></div>
      <div class="s-item${activePage==='profile'?' active':''}" data-page="profile.html" onclick="nav('profile.html')"><div class="s-icon">👤</div><div class="s-text">Profile</div></div>
    </div>
    <div class="s-footer">
      <div class="s-user" onclick="nav('profile.html')">
        <div class="s-avatar">${(userName||'U').charAt(0).toUpperCase()}</div>
        <div class="s-user-info"><div class="s-user-name">${userName||'Student'}</div><div class="s-user-role">${userReg||''}</div></div>
      </div>
    </div>
  </div>
  <div class="mobile-overlay" id="mobileOverlay"></div>
  <div class="bottom-nav">
    <div class="bn-item${activePage==='dashboard'?' active':''}" onclick="nav('dashboard.html')"><div class="bn-icon">🏠</div><div class="bn-label">Home</div></div>
    <div class="bn-item${activePage==='aptitude'?' active':''}" onclick="nav('aptitude.html')"><div class="bn-icon">📖</div><div class="bn-label">Aptitude</div></div>
    <div class="bn-item${activePage==='coding'?' active':''}" onclick="nav('coding.html')"><div class="bn-icon">💻</div><div class="bn-label">Coding</div></div>
    <div class="bn-item${activePage==='leaderboard'?' active':''}" onclick="nav('leaderboard.html')"><div class="bn-icon">🏆</div><div class="bn-label">Ranks</div></div>
    <div class="bn-item${activePage==='profile'?' active':''}" onclick="nav('profile.html')"><div class="bn-icon">👤</div><div class="bn-label">Profile</div></div>
  </div>`;
}

function nav(page){location.href=page;}

// ── INIT ON LOAD ──
document.addEventListener('DOMContentLoaded',()=>{
  applyTheme();
  initSidebar();
  initParticles('bgCanvas');
  let sb=document.getElementById('soundBtn');
  if(sb){sb.innerText=soundOn?'🔊':'🔇';sb.onclick=toggleSound;}
  let tb=document.getElementById('themeBtn');
  if(tb)tb.onclick=toggleTheme;
});

// ── AI CONNECTION HELPER ──
async function callClaude(messages, maxTokens=300, system=''){
  try{
    let body={model:'claude-sonnet-4-20250514',max_tokens:maxTokens,messages};
    if(system)body.system=system;
    let resp=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    if(!resp.ok){
      let err=await resp.json().catch(()=>({}));
      if(resp.status===401)throw new Error('API key missing. AI features need Claude API access via claude.ai.');
      if(resp.status===429)throw new Error('Rate limit reached. Please wait a moment and try again.');
      throw new Error(err.error?.message||'API error '+resp.status);
    }
    let data=await resp.json();
    return(data.content&&data.content[0]&&data.content[0].text)||'';
  }catch(e){
    if(e.message.includes('Failed to fetch')||e.message.includes('NetworkError')){
      throw new Error('Network error. Check your internet connection.');
    }
    throw e;
  }
}
