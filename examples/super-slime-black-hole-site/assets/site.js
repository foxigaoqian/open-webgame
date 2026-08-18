const game=document.getElementById('game');
const load=document.getElementById('load');
const RUNTIME_URL='https://html5.gamemonetize.games/hcx5y4cogxnwjvozussfta9q00905zv6/';

// The original Kiz10 embed wraps another provider and its downstream frame blocks
// github.io in the frame-ancestor chain. GameMonetize explicitly publishes this
// HTML5 build with third-party iframe code, so use its direct runtime instead.
if(game) game.dataset.src=RUNTIME_URL;

window.startGame=function(){
  if(game&&!game.src)game.src=game.dataset.src;
  if(load)load.classList.add('hidden');
  document.getElementById('play')?.scrollIntoView({behavior:'smooth',block:'start'});
};
window.reloadGame=function(){
  if(!game?.src){startGame();return}
  const s=game.src;game.src='about:blank';setTimeout(()=>game.src=s,180);
};
window.fullGame=function(){
  const box=document.getElementById('gameWrap');
  const fn=box?.requestFullscreen||box?.webkitRequestFullscreen||box?.mozRequestFullScreen;
  if(fn)fn.call(box);
};

(function updateRuntimeCopy(){
  const lang=(document.documentElement.lang||'en').toLowerCase().split('-')[0];
  const copy={
    en:{note:'The player lazy-loads a directly embeddable HTML5 build published by GameMonetize. The original mobile game is published by Supercent; this page is an unofficial discovery and guide site.',disclaimer:'Unofficial discovery and guide page. Super Big Slime: Black Hole 3D is published by Supercent, Inc. Browser gameplay is loaded from a GameMonetize HTML5 build that is explicitly offered for website embedding.',bar:'SUPER SLIME · HTML5 BROWSER BUILD'},
    ja:{note:'プレイヤーは GameMonetize がサイト埋め込み用に公開している HTML5 ビルドを直接読み込みます。モバイル版の開発・配信元は Supercent で、このページは非公式の案内・攻略サイトです。',disclaimer:'非公式の案内・攻略ページです。Super Big Slime: Black Hole 3D の配信元は Supercent, Inc. です。ブラウザ版はサイト埋め込み用として公開されている GameMonetize の HTML5 ビルドを読み込みます。',bar:'SUPER SLIME · HTML5 ブラウザ版'},
    ko:{note:'플레이어는 GameMonetize가 웹사이트 임베드용으로 공개한 HTML5 빌드를 직접 불러옵니다. 원본 모바일 게임은 Supercent가 배급하며, 이 페이지는 비공식 안내 및 공략 사이트입니다.',disclaimer:'비공식 안내 및 공략 페이지입니다. Super Big Slime: Black Hole 3D는 Supercent, Inc.가 배급합니다. 브라우저 플레이는 웹사이트 임베드용으로 공개된 GameMonetize HTML5 빌드를 사용합니다.',bar:'SUPER SLIME · HTML5 브라우저 빌드'}
  };
  const t=copy[lang]||copy.en;
  const note=document.querySelector('#play .sectionNote');if(note)note.textContent=t.note;
  const disclaimer=document.querySelector('#play .disclaimer');if(disclaimer)disclaimer.textContent=t.disclaimer;
  const bar=document.querySelector('#play .gamebar strong');if(bar)bar.textContent=t.bar;
  document.querySelectorAll('.sourceCard').forEach((card)=>{
    if(/Kiz10/i.test(card.textContent||'')){
      card.href='https://gamemonetize.com/growball-feed-to-grow-game';
      const strong=card.querySelector('strong');if(strong)strong.textContent='GameMonetize ↗';
      const small=card.querySelector('small');if(small)small.textContent='Direct HTML5 embed source';
    }
  });
  document.querySelectorAll('footer, .notice, #faq details').forEach((node)=>{
    if(/Kiz10/i.test(node.textContent||'')){
      node.innerHTML=node.innerHTML.replace(/Kiz10-hosted version/gi,'GameMonetize-hosted HTML5 version').replace(/Kiz10 web build/gi,'GameMonetize HTML5 build').replace(/Kiz10/g,'GameMonetize');
    }
  });
})();

(function initLanguageDropdowns(){const dropdowns=[];document.querySelectorAll('.langs').forEach((root)=>{const links=[...root.querySelectorAll('a')];if(!links.length)return;const current=links.find((link)=>link.getAttribute('aria-current')==='page')||links[0];root.classList.add('langDropdown');root.setAttribute('data-enhanced','true');const button=document.createElement('button');button.type='button';button.className='langToggle';button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Change language');button.innerHTML=`<span class="langGlobe" aria-hidden="true">🌐</span><span class="langCurrent">${current.textContent.trim()}</span><span class="langChevron" aria-hidden="true">▾</span>`;const menu=document.createElement('div');menu.className='langMenu';menu.setAttribute('role','menu');links.forEach((link)=>{link.setAttribute('role','menuitem');if(link.getAttribute('aria-current')==='page')link.classList.add('isCurrent');menu.appendChild(link)});root.replaceChildren(button,menu);const close=()=>{root.classList.remove('open');button.setAttribute('aria-expanded','false')};const open=()=>{dropdowns.forEach((item)=>{if(item.root!==root)item.close()});root.classList.add('open');button.setAttribute('aria-expanded','true')};button.addEventListener('click',(event)=>{event.stopPropagation();root.classList.contains('open')?close():open()});menu.addEventListener('click',()=>close());root.addEventListener('keydown',(event)=>{if(event.key==='Escape'){close();button.focus()}});dropdowns.push({root,close})});document.addEventListener('click',(event)=>{dropdowns.forEach(({root,close})=>{if(!root.contains(event.target))close()})})})();
