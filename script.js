const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// navbar, botão de topo e ano
const nav=$('.navbar'),topo=$('.to-top'),bar=$('.scroll-bar'),calmo=matchMedia('(prefers-reduced-motion:reduce)').matches;
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>40);topo.classList.toggle('show',scrollY>600);bar.style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%'},{passive:true});
topo.onclick=()=>scrollTo({top:0});
$('#ano').textContent=new Date().getFullYear();

// efeito de digitação
const frases=['interfaces rápidas.','layouts responsivos.','experiências acessíveis.'],el=$('#typed');
let f=0,c=0,apagando=false;
(function digitar(){
  const t=frases[f];c+=apagando?-1:1;el.textContent=t.slice(0,c);
  let d=apagando?40:80;
  if(!apagando&&c===t.length){apagando=true;d=1400}
  else if(apagando&&c===0){apagando=false;f=(f+1)%frases.length;d=300}
  setTimeout(digitar,d);
})();

// brilho que segue o mouse no hero
const hero=$('#inicio');
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',e.clientX-r.left+'px');hero.style.setProperty('--my',e.clientY-r.top+'px')});

// revelar seções e animar contadores ao entrar na tela
function contar(el){const fim=+el.dataset.count,ini=performance.now();
  (function passo(n){const p=Math.min((n-ini)/1200,1);el.textContent=Math.round(fim*p)+'+';if(p<1)requestAnimationFrame(passo)})(ini)}
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');
  if(t.dataset.count)contar(t);
  if(t.dataset.anim&&!calmo)t.classList.add('animate__animated',t.dataset.anim);
  io.unobserve(t);
}),{threshold:.3});
// animações variadas (Animate.css) com atraso escalonado
[['.proj','animate__fadeIn'],['.cert','animate__fadeIn'],['.tool','animate__zoomIn'],['.timeline .item','animate__fadeInLeft'],['.stat','animate__bounceIn']]
  .forEach(([s,a])=>$$(s).forEach((t,i)=>{t.dataset.anim=a;t.style.animationDelay=i*90+'ms'}));
$$('.reveal,[data-count],[data-anim]').forEach(x=>io.observe(x));

// filtro de projetos
$$('[data-filter]').forEach(b=>b.onclick=()=>{
  $$('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  $$('.proj').forEach(p=>{const ocultar=b.dataset.filter!=='todos'&&p.dataset.cat!==b.dataset.filter;p.classList.toggle('d-none',ocultar);
    if(!ocultar&&!calmo){p.classList.remove('animate__animated',p.dataset.anim);void p.offsetWidth;p.classList.add('animate__animated',p.dataset.anim)}});
});

// modal de detalhes do projeto
$('#projModal').addEventListener('show.bs.modal',e=>{const d=e.relatedTarget.dataset;
  $('#projTitle').textContent=d.title;$('#projDesc').textContent=d.desc;$('#projTech').textContent=d.tech;$('#projTech').parentElement.classList.toggle('d-none',!d.tech);
  const im=$('#projImg');im.classList.add('d-none');im.onload=()=>im.classList.remove('d-none');im.onerror=()=>im.classList.add('d-none');
  const fonte=e.relatedTarget.closest('article').querySelector('.thumb img');
  if(fonte)im.src=fonte.getAttribute('src');else im.removeAttribute('src');
  [['#projCode',d.code],['#projLive',d.live]].forEach(([s,u])=>{const a=$(s);a.href=u||'#';a.classList.toggle('d-none',!u)})});

// validação do formulário (troque a simulação por Formspree, EmailJS ou sua API)
$('#form').addEventListener('submit',e=>{
  e.preventDefault();const f=e.target;f.classList.add('was-validated');
  if(!f.checkValidity())return;
  $('#ok').classList.remove('d-none');f.reset();f.classList.remove('was-validated');
});

// modal do certificado
$('#certModal').addEventListener('show.bs.modal',e=>{
  const d=e.relatedTarget.dataset,i=$('#certImg'),m=$('#certMsg');
  $('#certTitle').textContent=d.title;m.classList.add('d-none');i.classList.remove('d-none');
  i.onerror=()=>{i.classList.add('d-none');m.classList.remove('d-none')};const f=e.relatedTarget.closest('article').querySelector('.thumb img');
  if(f)i.src=f.getAttribute('src');else i.onerror();
});

// inclinação 3D nos cards
if(!calmo)$$('.project-card').forEach(c=>{
  c.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(800px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-4px)`});
  c.addEventListener('pointerleave',()=>c.style.transform='');
});

// constelação de partículas no hero, ligada ao mouse
if(!calmo)(()=>{
  const cv=$('#bg'),cx=cv.getContext('2d'),m={x:-999,y:-999};let w,h,pts=[],ativo=true;
  const medir=()=>{w=cv.width=hero.clientWidth;h=cv.height=hero.clientHeight;
    pts=Array.from({length:Math.min(80,w*h/16000|0)},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};
  medir();addEventListener('resize',medir);
  hero.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  hero.addEventListener('pointerleave',()=>m.x=-999);
  new IntersectionObserver(e=>ativo=e[0].isIntersecting).observe(hero);
  const linha=(a,b,x,y,al)=>{cx.strokeStyle=`rgba(${al[0]},${al[1]})`;cx.beginPath();cx.moveTo(a,b);cx.lineTo(x,y);cx.stroke()};
  (function quadro(){requestAnimationFrame(quadro);if(!ativo)return;cx.clearRect(0,0,w,h);
    pts.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      cx.fillStyle='rgba(127,178,255,.8)';cx.beginPath();cx.arc(p.x,p.y,1.6,0,7);cx.fill();
      for(let k=i+1;k<pts.length;k++){const q=pts[k],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120)linha(p.x,p.y,q.x,q.y,['61,139,255',.25*(1-d/120)])}
      const dm=Math.hypot(p.x-m.x,p.y-m.y);if(dm<160)linha(p.x,p.y,m.x,m.y,['127,178,255',.5*(1-dm/160)])});
  })();
})();

// clicar no print do card abre os detalhes
$$('.thumb').forEach(t=>t.addEventListener('click',()=>t.nextElementSibling.querySelector('button').click()));


// quando a foto do início sai da tela, ela aparece discretamente como ícone na navbar
(()=>{
  const av=$('.avatar'),foto=$('img',av),logo=$('.logo');
  if(!foto)return;
  const iniciar=()=>{
    logo.innerHTML='<img alt="" aria-hidden="true">';$('img',logo).src=foto.getAttribute('src');
    document.body.classList.add('foto-nav');
    new IntersectionObserver(e=>document.body.classList.toggle('foto-ok',!e[0].isIntersecting),{rootMargin:'-80px 0px 0px 0px'}).observe(av);
  };
  if(foto.complete){if(foto.naturalWidth)iniciar()}else foto.addEventListener('load',iniciar);
})();

// fundo galáctico: estrelas em camadas com paralaxe, brilho e estrelas cadentes
(()=>{
  const cv=$('#galaxia'),cx=cv.getContext('2d');
  const camadas=[{q:70,v:.12,r:.7},{q:40,v:.3,r:1.1},{q:18,v:.6,r:1.7}];
  let w,h,estrelas=[],cadentes=[],mx=.5,proxima=3000;
  const medir=()=>{w=cv.width=innerWidth;h=cv.height=innerHeight;
    estrelas=camadas.flatMap(c=>Array.from({length:Math.round(c.q*w*h/2073600)+10},()=>({x:Math.random()*w,y:Math.random()*h,c,f:Math.random()*6.28,s:.5+Math.random()*1.5,azul:Math.random()<.3})));
    if(calmo)desenhar(0)};
  const desenhar=t=>{
    cx.clearRect(0,0,w,h);
    estrelas.forEach(e=>{
      const y=((e.y-scrollY*e.c.v)%h+h)%h,x=((e.x+(mx-.5)*e.c.v*40)%w+w)%w,a=calmo?.8:.45+.55*Math.sin(t*.001*e.s+e.f);
      cx.fillStyle=e.azul?`rgba(150,190,255,${a})`:`rgba(235,240,255,${a})`;
      cx.beginPath();cx.arc(x,y,e.c.r,0,6.3);cx.fill();
    });
    cadentes=cadentes.filter(m=>m.v>0);
    cadentes.forEach(m=>{
      m.x-=m.dx;m.y+=m.dy;m.v-=.018;
      const g=cx.createLinearGradient(m.x,m.y,m.x+m.dx*14,m.y-m.dy*14);
      g.addColorStop(0,`rgba(200,225,255,${m.v})`);g.addColorStop(1,'rgba(200,225,255,0)');
      cx.strokeStyle=g;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(m.x,m.y);cx.lineTo(m.x+m.dx*14,m.y-m.dy*14);cx.stroke();
    });
  };
  medir();
  addEventListener('resize',()=>{if(innerWidth!==w||Math.abs(innerHeight-h)>150)medir()});
  if(calmo){addEventListener('scroll',()=>desenhar(0),{passive:true});return}
  addEventListener('pointermove',e=>mx=e.clientX/w,{passive:true});
  (function quadro(t){
    requestAnimationFrame(quadro);
    if(t>proxima){cadentes.push({x:w*(.3+Math.random()*.7),y:Math.random()*h*.4,dx:6+Math.random()*4,dy:3+Math.random()*2,v:1});proxima=t+5000+Math.random()*6000}
    desenhar(t);
  })(0);
})();
