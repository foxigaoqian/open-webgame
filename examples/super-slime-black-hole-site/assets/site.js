const game=document.getElementById('game');
const load=document.getElementById('load');
const RUNTIME_BASE='https://html5.gamedistribution.com/a5ad329e688a43ecbdb5611008a56c3a/';

// GameDistribution requires gd_sdk_referrer_url to be the exact page that hosts
// the iframe. Build it from the current localized page instead of copying Kizi's
// referrer parameter.
const pageReferrer=window.location.href.split('#')[0].split('?')[0];
const pageLocale=(document.documentElement.lang||'en').toLowerCase();
const runtimeUrl=`${RUNTIME_BASE}?gd_sdk_referrer_url=${encodeURIComponent(pageReferrer)}&siteLocale=${encodeURIComponent(pageLocale)}&locale=${encodeURIComponent(pageLocale)}`;
if(game) game.dataset.src=runtimeUrl;

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
    en:{note:'The player loads the GameDistribution HTML5 runtime used for Super Slime: Black Hole. The original mobile game is published by Supercent; this page is an unofficial discovery and guide site.',disclaimer:'Unofficial discovery and guide page. Super Big Slime: Black Hole 3D is published by Supercent, Inc. Browser gameplay is loaded from the GameDistribution HTML5 runtime for Super Slime: Black Hole.',bar:'SUPER SLIME · GAMEDISTRIBUTION HTML5 BUILD'},
    ja:{note:'プレイヤーは Super Slime: Black Hole の GameDistribution HTML5 ランタイムを読み込みます。モバイル版の開発・配信元は Supercent で、このページは非公式の案内・攻略サイトです。',disclaimer:'非公式の案内・攻略ページです。Super Big Slime: Black Hole 3D の配信元は Supercent, Inc. です。ブラウザ版は Super Slime: Black Hole の GameDistribution HTML5 ランタイムを読み込みます。',bar:'SUPER SLIME · GAMEDISTRIBUTION HTML5'},
    ko:{note:'플레이어는 Super Slime: Black Hole의 GameDistribution HTML5 런타임을 불러옵니다. 원본 모바일 게임은 Supercent가 배급하며, 이 페이지는 비공식 안내 및 공략 사이트입니다.',disclaimer:'비공식 안내 및 공략 페이지입니다. Super Big Slime: Black Hole 3D는 Supercent, Inc.가 배급합니다. 브라우저 플레이는 Super Slime: Black Hole의 GameDistribution HTML5 런타임을 사용합니다.',bar:'SUPER SLIME · GAMEDISTRIBUTION HTML5'}
  };
  const t=copy[lang]||copy.en;
  const note=document.querySelector('#play .sectionNote');if(note)note.textContent=t.note;
  const disclaimer=document.querySelector('#play .disclaimer');if(disclaimer)disclaimer.textContent=t.disclaimer;
  const bar=document.querySelector('#play .gamebar strong');if(bar)bar.textContent=t.bar;

  document.querySelectorAll('.sourceCard').forEach((card)=>{
    if(/GameMonetize|Kiz10/i.test(card.textContent||'')){
      card.href='https://www.kizi.com/games/super-slime-black-hole';
      const strong=card.querySelector('strong');if(strong)strong.textContent='Kizi / GameDistribution ↗';
      const small=card.querySelector('small');if(small)small.textContent='Verified browser game source';
    }
  });
  document.querySelectorAll('footer a').forEach((link)=>{
    if(/gamemonetize|kiz10/i.test(link.href||'')||/GameMonetize|Kiz10/i.test(link.textContent||'')){
      link.href='https://www.kizi.com/games/super-slime-black-hole';
      link.textContent='Kizi';
    }
  });
})();

(function initLanguageDropdowns(){const dropdowns=[];document.querySelectorAll('.langs').forEach((root)=>{const links=[...root.querySelectorAll('a')];if(!links.length)return;const current=links.find((link)=>link.getAttribute('aria-current')==='page')||links[0];root.classList.add('langDropdown');root.setAttribute('data-enhanced','true');const button=document.createElement('button');button.type='button';button.className='langToggle';button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Change language');button.innerHTML=`<span class="langGlobe" aria-hidden="true">🌐</span><span class="langCurrent">${current.textContent.trim()}</span><span class="langChevron" aria-hidden="true">▾</span>`;const menu=document.createElement('div');menu.className='langMenu';menu.setAttribute('role','menu');links.forEach((link)=>{link.setAttribute('role','menuitem');if(link.getAttribute('aria-current')==='page')link.classList.add('isCurrent');menu.appendChild(link)});root.replaceChildren(button,menu);const close=()=>{root.classList.remove('open');button.setAttribute('aria-expanded','false')};const open=()=>{dropdowns.forEach((item)=>{if(item.root!==root)item.close()});root.classList.add('open');button.setAttribute('aria-expanded','true')};button.addEventListener('click',(event)=>{event.stopPropagation();root.classList.contains('open')?close():open()});menu.addEventListener('click',()=>close());root.addEventListener('keydown',(event)=>{if(event.key==='Escape'){close();button.focus()}});dropdowns.push({root,close})});document.addEventListener('click',(event)=>{dropdowns.forEach(({root,close})=>{if(!root.contains(event.target))close()})})})();
