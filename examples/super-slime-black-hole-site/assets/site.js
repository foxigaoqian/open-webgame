const game=document.getElementById('game');
const load=document.getElementById('load');
const KIZ10_PLAY_URL='https://kiz10.com/super-slime---black-hole-game/';

const copy={
  en:{title:'PLAY THE BROWSER VERSION',text:'The upstream game host blocks third-party nested framing, so the game cannot reliably run inside this page. Open the Kiz10 game page to play the working browser version.',button:'PLAY ON KIZ10 ↗',note:'Browser play opens on Kiz10 because the downstream game host blocks third-party iframe nesting. The original mobile game is published by Supercent; this is an unofficial discovery and guide site.',bar:'SUPER SLIME · OPEN BROWSER VERSION'},
  ja:{title:'ブラウザ版をプレイ',text:'配信元のゲームホストが第三者サイトでの多重 iframe 埋め込みを制限しているため、このページ内では安定して起動できません。Kiz10 のゲームページを開いてプレイしてください。',button:'KIZ10でプレイ ↗',note:'配信元が第三者 iframe の多重埋め込みを制限しているため、ブラウザ版は Kiz10 で開きます。モバイル版の開発・配信元は Supercent です。',bar:'SUPER SLIME · ブラウザ版を開く'},
  ko:{title:'브라우저 버전 플레이',text:'최종 게임 호스트가 제3자 사이트의 중첩 iframe을 차단하므로 이 페이지 안에서는 안정적으로 실행할 수 없습니다. Kiz10 게임 페이지를 열어 브라우저 버전을 플레이하세요.',button:'KIZ10에서 플레이 ↗',note:'최종 게임 호스트가 제3자 iframe 중첩을 차단하므로 브라우저 버전은 Kiz10에서 열립니다. 원본 모바일 게임은 Supercent가 배급합니다.',bar:'SUPER SLIME · 브라우저 버전 열기'}
};
const lang=(document.documentElement.lang||'en').toLowerCase().split('-')[0];
const t=copy[lang]||copy.en;

function openPlayableVersion(){
  // Keep the public embed URL warm for compatibility/health checks, but do not
  // expose it as the user-facing runtime because its downstream Playhop frame
  // rejects github.io in the frame-ancestor chain.
  if(game&&!game.src&&game.dataset.src) game.src=game.dataset.src;
  const opened=window.open(KIZ10_PLAY_URL,'_blank','noopener,noreferrer');
  if(!opened) window.location.href=KIZ10_PLAY_URL;
}

window.startGame=function(){openPlayableVersion()};
window.reloadGame=function(){openPlayableVersion()};
window.fullGame=function(){openPlayableVersion()};

(function explainExternalPlay(){
  document.querySelectorAll('button[onclick="startGame()"]').forEach((button)=>{button.textContent=t.button;button.setAttribute('aria-label',t.button)});
  const h3=load?.querySelector('h3');if(h3)h3.textContent=t.title;
  const p=load?.querySelector('p');if(p)p.textContent=t.text;
  if(load)load.classList.remove('hidden');
  const note=document.querySelector('#play .sectionNote');if(note)note.textContent=t.note;
  const bar=document.querySelector('#play .gamebar strong');if(bar)bar.textContent=t.bar;
  document.querySelectorAll('#play .gameActions button').forEach((button)=>{button.style.display='none'});
})();

(function initLanguageDropdowns(){const dropdowns=[];document.querySelectorAll('.langs').forEach((root)=>{const links=[...root.querySelectorAll('a')];if(!links.length)return;const current=links.find((link)=>link.getAttribute('aria-current')==='page')||links[0];root.classList.add('langDropdown');root.setAttribute('data-enhanced','true');const button=document.createElement('button');button.type='button';button.className='langToggle';button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Change language');button.innerHTML=`<span class="langGlobe" aria-hidden="true">🌐</span><span class="langCurrent">${current.textContent.trim()}</span><span class="langChevron" aria-hidden="true">▾</span>`;const menu=document.createElement('div');menu.className='langMenu';menu.setAttribute('role','menu');links.forEach((link)=>{link.setAttribute('role','menuitem');if(link.getAttribute('aria-current')==='page')link.classList.add('isCurrent');menu.appendChild(link)});root.replaceChildren(button,menu);const close=()=>{root.classList.remove('open');button.setAttribute('aria-expanded','false')};const open=()=>{dropdowns.forEach((item)=>{if(item.root!==root)item.close()});root.classList.add('open');button.setAttribute('aria-expanded','true')};button.addEventListener('click',(event)=>{event.stopPropagation();root.classList.contains('open')?close():open()});menu.addEventListener('click',()=>close());root.addEventListener('keydown',(event)=>{if(event.key==='Escape'){close();button.focus()}});dropdowns.push({root,close})});document.addEventListener('click',(event)=>{dropdowns.forEach(({root,close})=>{if(!root.contains(event.target))close()})})})();
