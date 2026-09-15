/* YarnScenes — procedural spinning-mill imagery drawn on <canvas data-scene="..."> */
window.YarnScenes=(function(){
const TAU=Math.PI*2,L=(a,b,t)=>a+(b-a)*t;
function rng(seed){let s=(Math.imul((seed|0)+1,2654435761)+1013904223)>>>0||7;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function lin(ctx,x0,y0,x1,y1,st){const g=ctx.createLinearGradient(x0,y0,x1,y1);for(const [t,c] of st)g.addColorStop(t,c);return g;}
function rad(ctx,x,y,r0,r1,st){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);for(const [t,c] of st)g.addColorStop(t,c);return g;}
function ell(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,Math.max(.2,rx),Math.max(.2,ry),0,0,TAU);}
function poly(ctx,p){ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();}
function rrect(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function finish(ctx,w,h,o,R){
  ctx.fillStyle=rad(ctx,w/2,h/2,Math.min(w,h)*.4,Math.hypot(w,h)*.62,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,'+(o.vignette==null?.35:o.vignette)+')']]);ctx.fillRect(0,0,w,h);
  if(o.tint){ctx.save();ctx.globalCompositeOperation='color';ctx.fillStyle=o.tint;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='multiply';ctx.fillStyle=o.mul||'rgba(36,58,80,.6)';ctx.fillRect(0,0,w,h);ctx.restore();}
  const n=Math.min(9000,Math.round(w*h/350));ctx.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<n;i++)ctx.fillRect(R()*w,R()*h,1,1);ctx.fillStyle='rgba(0,0,0,.07)';for(let i=0;i<n;i++)ctx.fillRect(R()*w,R()*h,1,1);
}
/* 1. Rack of cylindrical yarn packages, front view, receding to the right */
function pack(ctx,x,y,r,t){const bw=r*1.15,rx=r*.9;
  ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+bw,y-r*.93);ctx.lineTo(x+bw,y+r*.93);ctx.lineTo(x,y+r);ctx.closePath();
  ctx.fillStyle=lin(ctx,x,0,x+bw,0,[[0,'#d5d2ca'],[.45,'#bdbab2'],[1,'#7f7d79']]);ctx.fill();
  ctx.save();ctx.clip();ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;
  for(let i=0;i<26;i++){const yy=y-r+i/26*2*r;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+bw,yy+(i%2?r*.22:-r*.22));ctx.stroke();}
  ctx.restore();
  ell(ctx,x,y,rx,r);ctx.fillStyle=rad(ctx,x-r*.3,y-r*.3,r*.05,r*1.15,[[0,'#f2f0ea'],[.55,'#d2cfc7'],[1,'#8a8882']]);ctx.fill();
  ctx.strokeStyle='rgba(40,40,44,.11)';ctx.lineWidth=1;for(let k=1;k<14;k++){ell(ctx,x,y,rx*k/14,r*k/14);ctx.stroke();}
  ell(ctx,x,y,r*.11,r*.12);ctx.fillStyle='#26272b';ctx.fill();ell(ctx,x+r*.012,y-r*.012,r*.065,r*.075);ctx.fillStyle='#5a5b61';ctx.fill();
  if(t>0){ctx.fillStyle='rgba(46,50,57,'+(t*.5)+')';ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+bw,y-r*.93);ctx.lineTo(x+bw,y+r*.93);ctx.lineTo(x,y+r);ctx.closePath();ctx.ellipse(x,y,rx,r,0,0,TAU);ctx.fill();}
}
function cones(ctx,w,h,o){const R=rng(o.seed||11);
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#454a52'],[1,'#22252a']]);ctx.fillRect(0,0,w,h);
  const rows=[[h*1.0,h*.34],[h*.40,h*.36]];
  for(const [cy,r0] of rows){const items=[];let x=-w*.04;for(let i=0;i<10;i++){const t=i/9,r=r0*(1-.72*t);items.push([x+r*.92,cy-(r0-r)*.35,r,t]);x+=r*1.55;}
    for(let i=items.length-1;i>=0;i--)pack(ctx,items[i][0],items[i][1],items[i][2],items[i][3]);}
  finish(ctx,w,h,o,R);}
/* 2. One-point-perspective spinning hall (creel variant: cream cones on the right, golden floor) */
function hall(ctx,w,h,o){const R=rng(o.seed||22);const vx=w*.5,vy=h*.45,gold=!!o.creel;
  ctx.fillStyle=lin(ctx,0,0,0,vy,[[0,'#2f353c'],[1,'#8a929b']]);ctx.fillRect(0,0,w,vy);
  ctx.fillStyle=gold?lin(ctx,0,vy,0,h,[[0,'#a48a4e'],[.5,'#c9a85c'],[1,'#e2c477']]):lin(ctx,0,vy,0,h,[[0,'#8d959e'],[.5,'#b6bdc4'],[1,'#dfe3e7']]);ctx.fillRect(0,vy,w,h-vy);
  poly(ctx,[[vx,vy],[w*.78,h],[w*.22,h]]);ctx.fillStyle=lin(ctx,0,vy,0,h,[[0,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,.38)']]);ctx.fill();
  for(let k=0;k<18;k++){const d=1-Math.pow(1-k/18,2.2);const y=L(-4,vy,d),half=L(w*.24,0,d),th=L(7,1,d);
    ctx.fillStyle='rgba(255,255,255,'+L(.05,0,d)+')';ctx.fillRect(vx-half*1.15,y-th,half*2.3,th*3);
    ctx.fillStyle='rgba(245,248,255,'+L(.9,.35,d)+')';ctx.fillRect(vx-half,y,half*2,th);}
  const side=(sgn,creel)=>{const nx=vx+sgn*w*.30,top=h*.16,bot=h*1.02;
    poly(ctx,[[nx,top],[vx,vy],[nx,bot]]);ctx.fillStyle=lin(ctx,nx,0,vx,0,[[0,'#6d7580'],[1,'#a9b0b8']]);ctx.fill();
    poly(ctx,[[nx-sgn*w*.30,top-h*.06],[nx,top],[vx,vy]]);ctx.fillStyle='#c7ccd2';ctx.fill();
    const N=64;for(let k=N;k>=0;k--){const d=1-Math.pow(1-k/N,2.4);if(d>.985)continue;const x=L(nx,vx,d),t=L(top,vy,d),b=L(bot,vy,d),H=b-t,ww=L(w*.06,0,d);if(ww<.6)continue;const xs=sgn>0?x:x-ww;
      if(creel){for(let r=0;r<3;r++){const cy=t+H*(.12+r*.22),rr=ww*.42,cx=x+sgn*ww*.35;ell(ctx,cx,cy,rr*.75,rr);ctx.fillStyle=lin(ctx,cx-rr,0,cx+rr,0,[[0,'#f6f4ee'],[1,'#c9c6bd']]);ctx.fill();ell(ctx,cx,cy,rr*.5,rr*.68);ctx.strokeStyle='rgba(190,40,60,.55)';ctx.lineWidth=Math.max(.5,rr*.12);ctx.stroke();ell(ctx,cx,cy,rr*.18,rr*.24);ctx.fillStyle='#5a5148';ctx.fill();}
        ctx.fillStyle='#6f7680';ctx.fillRect(xs,t+H*.74,ww,H*.26);}
      else{ctx.fillStyle=d<.5?'#d9dde2':'#c3c8ce';ctx.fillRect(xs,t+H*.34,ww,H*.40);
        ctx.fillStyle='#2c3138';ctx.fillRect(xs,t+H*.34,ww,H*.03);ctx.fillRect(xs,t+H*.62,ww,H*.02);
        ell(ctx,x+sgn*ww*.4,t+H*.16,ww*.36,ww*.42);ctx.fillStyle='#eeece6';ctx.fill();ell(ctx,x+sgn*ww*.4,t+H*.16,ww*.09,ww*.11);ctx.fillStyle='#3a3b40';ctx.fill();
        ctx.fillStyle='#8b929b';ctx.fillRect(xs,t+H*.76,ww,H*.24);}
    }};
  side(-1,false);side(1,!!o.creel);
  finish(ctx,w,h,o,R);}
/* 3. Sliver (tow) cans with slivers looping down from an overhead rail */
function can(ctx,x,y,cw,ch,sh,R){const ry=cw*.16;
  ctx.lineCap='round';for(let k=0;k<3;k++){const sx=x+cw*(.3+.2*k),top=y-ch*.95-R()*ch*.1;ctx.lineWidth=cw*.11;ctx.strokeStyle='rgba(222,224,227,'+sh+')';ctx.beginPath();ctx.moveTo(sx+cw*.3*(R()-.5),top);ctx.bezierCurveTo(sx-cw*.45,top+ch*.35,sx+cw*.35,y-ch*.25,x+cw*(.25+.25*k),y);ctx.stroke();ctx.lineWidth=cw*.035;ctx.strokeStyle='rgba(255,255,255,.65)';ctx.stroke();}
  ctx.fillStyle=lin(ctx,x,0,x+cw,0,[[0,'#9aa0a6'],[.25,'#f2f3f4'],[.6,'#e6e8ea'],[1,'#8d9399']]);ctx.fillRect(x,y,cw,ch);ell(ctx,x+cw/2,y+ch,cw/2,ry);ctx.fill();
  ctx.fillStyle='rgba(90,96,102,.35)';ctx.fillRect(x,y+ch*.06,cw,ch*.02);ctx.fillRect(x,y+ch*.9,cw,ch*.02);
  ell(ctx,x+cw/2,y,cw/2,ry);ctx.fillStyle='#dcdfe2';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=cw*.05;for(let k=0;k<6;k++){ell(ctx,x+cw*(.3+.4*R()),y-ry*.2+ry*.4*(R()-.5),cw*.18*(.6+R()*.6),ry*.8);ctx.stroke();}
  ctx.fillStyle='#3a3f45';ell(ctx,x+cw*.2,y+ch+ry*.6,cw*.07,cw*.07);ctx.fill();ell(ctx,x+cw*.8,y+ch+ry*.6,cw*.07,cw*.07);ctx.fill();
  if(sh<1){ctx.fillStyle='rgba(90,100,110,'+((1-sh)*1.5)+')';ctx.fillRect(x-1,y-ry-1,cw+2,ch+2*ry+2);}
}
function cans(ctx,w,h,o){const R=rng(o.seed||33);
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#5d6570'],[.45,'#7e8792'],[.46,'#aab1b9'],[1,'#c8cdd3']]);ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#4a525c';ctx.fillRect(w*.55,h*.28,w*.45,h*.35);
  ctx.fillStyle='#8f97a0';ctx.fillRect(0,h*.15,w,h*.035);ctx.fillStyle='#d5d9de';ctx.fillRect(0,h*.15,w,h*.008);
  const rows=[{y0:h*.42,ch:h*.36,cw:w*.10,off:w*.05,n:10,sh:.8},{y0:h*.55,ch:h*.5,cw:w*.135,off:-w*.02,n:9,sh:1}];
  rows.forEach(r=>{for(let i=0;i<r.n;i++)can(ctx,r.off+i*(r.cw*1.08),r.y0,r.cw,r.ch,r.sh,R);});
  finish(ctx,w,h,o,R);}
/* 4. Ring-spinning frame: red bobbins over lilac packages, receding to the left */
function spinning(ctx,w,h,o){const R=rng(o.seed||44);const vx=-w*.12,vy=h*.42;
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#f3f5f7'],[.4,'#dfe3e7'],[.41,'#c9ced4'],[1,'#eef0f2']]);ctx.fillRect(0,0,w,h);
  for(let k=0;k<7;k++){const d=k/7;ctx.fillStyle='rgba(255,255,255,'+(.9-d*.5)+')';ctx.fillRect(L(w*.1,w*.02,d),L(h*.02,h*.3,d),L(w*.9,w*.15,d),L(6,1,d));}
  const X=w*1.06,band=(y0,y1,col)=>{poly(ctx,[[X,y0],[vx,vy],[X,y1]]);ctx.fillStyle=col;ctx.fill();};
  band(h*.50,h*.60,'#e88a86');band(h*.60,h*.66,'#f4f2f0');band(h*.66,h*.70,'#9aa0a8');band(h*.90,h*1.2,'#d9dcdf');
  const N=70;for(let k=N;k>=0;k--){const u=1-1/(1+k*.075);if(u>.97)continue;const s=1-u*.92,x=L(X,vx,u);
    const pw=w*.062*s,ph=h*.20*s,py=L(h*.74,vy,u);rrect(ctx,x-pw/2,py,pw,ph,pw*.22);ctx.fillStyle=lin(ctx,x-pw/2,0,x+pw/2,0,[[0,'#8f8ccb'],[.4,'#d3d1f1'],[1,'#a2a0d8']]);ctx.fill();
    ell(ctx,x,py,pw/2,pw*.2);ctx.fillStyle='#ecebf8';ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,py);ctx.lineTo(x,L(h*.42,vy,u));ctx.stroke();
    const rr=w*.032*s,by=L(h*.36,vy,u);
    rrect(ctx,x-rr*.18,by-rr*2.1,rr*.36,rr*1.1,rr*.1);ctx.fillStyle='#202226';ctx.fill();
    ell(ctx,x,by-rr*.9,rr*.55,rr*.7);ctx.fillStyle='#f1f1f3';ctx.fill();
    ell(ctx,x,by,rr,rr*1.05);ctx.fillStyle=rad(ctx,x-rr*.3,by-rr*.3,rr*.1,rr*1.2,[[0,'#ff6a5e'],[.6,'#e5241f'],[1,'#8d0f0f']]);ctx.fill();
    ell(ctx,x,by,rr*.2,rr*.22);ctx.fillStyle='#1c1c20';ctx.fill();}
  finish(ctx,w,h,o,R);}
/* 5. Blue bobbins close-up, near end large, far end small */
function bobbins(ctx,w,h,o){const R=rng(o.seed||55);
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#f2f4f6'],[.55,'#d8dde3'],[.56,'#1e2126'],[1,'#0f1114']]);ctx.fillRect(0,0,w,h);
  const N=12;for(let k=0;k<N;k++){const t=k/(N-1),x=L(-w*.05,w*1.05,t),y=L(h*.72,h*.98,t),r=L(w*.05,w*.09,t);
    ctx.fillStyle='#2a2d33';ctx.fillRect(x-r*.6,y,r*1.2,h);
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(L(x,w*.5,.35),h*.35);ctx.stroke();
    ell(ctx,x,y,r*.55,r);ctx.fillStyle=rad(ctx,x-r*.2,y-r*.3,r*.1,r*1.1,[[0,'#8fc4ff'],[.5,'#2f7fe0'],[1,'#123f8a']]);ctx.fill();
    ell(ctx,x,y,r*.18,r*.3);ctx.fillStyle='#0f1216';ctx.fill();}
  const M=9;for(let k=0;k<M;k++){const t=k/(M-1),x=L(w*.02,w*.95,t),y=L(h*.16,h*.30,t),r=L(w*.13,w*.34,t),rx=r*.38,bw=r*.9;
    poly(ctx,[[x,y-r],[x-bw,y-r*.96],[x-bw,y+r*.96],[x,y+r]]);ctx.fillStyle=lin(ctx,0,y-r,0,y+r,[[0,'#1a4d9c'],[.3,'#3f8ff0'],[.55,'#6db3ff'],[.8,'#2b6fd0'],[1,'#12356e']]);ctx.fill();
    ctx.fillStyle='rgba(8,10,14,.85)';ctx.fillRect(x-bw*.45,y-r*.98,bw*.14,r*1.96);ctx.fillRect(x-bw*.95,y-r*.97,bw*.10,r*1.94);
    ell(ctx,x,y,rx,r);ctx.fillStyle=rad(ctx,x-rx*.4,y-r*.35,r*.1,r*1.2,[[0,'#7dbcff'],[.5,'#2f79d8'],[1,'#0e2f66']]);ctx.fill();
    ell(ctx,x,y,rx*.9,r*.9);ctx.strokeStyle='rgba(5,8,14,.9)';ctx.lineWidth=r*.08;ctx.stroke();
    ell(ctx,x,y,rx*.28,r*.28);ctx.fillStyle='#0b0d12';ctx.fill();}
  finish(ctx,w,h,o,R);}
/* 6. Dyed hanks hanging from a crane in the dyehouse */
function hanks(ctx,w,h,o){const R=rng(o.seed||66);
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#6b6f74'],[.5,'#9a9ea3'],[1,'#b9bcbf']]);ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#d19a1a';ctx.fillRect(0,h*.11,w,h*.075);ctx.fillStyle='#a8770e';ctx.fillRect(0,h*.16,w,h*.025);ctx.fillStyle='#e0ad2c';ctx.fillRect(0,h*.11,w,h*.012);
  ctx.fillStyle='#c98f18';ctx.fillRect(w*.04,h*.18,w*.03,h*.5);ctx.fillRect(w*.13,h*.18,w*.025,h*.4);ctx.fillStyle='#b98a1c';ctx.fillRect(0,h*.44,w*.3,h*.02);
  ctx.fillStyle='#5c6066';[.34,.44,.54,.64].forEach(f=>{for(let y=h*.185;y<h*.40;y+=6){ell(ctx,w*f,y,2.2,3.6);ctx.fill();}});
  const fuzz=(x,y,W,H,base,hi,lo,n)=>{ctx.fillStyle=base;ctx.fillRect(x,y,W,H);ell(ctx,x+W/2,y+H,W/2,W*.09);ctx.fill();ell(ctx,x+W/2,y,W/2,W*.09);ctx.fillStyle=hi;ctx.fill();
    for(let i=0;i<n;i++){const px=x+R()*W,py=y+R()*H,len=3+R()*W*.06;ctx.strokeStyle=R()<.5?hi:lo;ctx.globalAlpha=.35+R()*.4;ctx.lineWidth=1+R();ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+(R()-.5)*len,py+(R()-.5)*len);ctx.stroke();}
    for(let i=0;i<n/6;i++){const left=R()<.5,side=left?x:x+W,py=y+R()*H;ctx.strokeStyle=hi;ctx.globalAlpha=.6;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(side,py);ctx.lineTo(side+(left?-1:1)*(2+R()*W*.04),py+(R()-.5)*8);ctx.stroke();}
    ctx.globalAlpha=1;};
  fuzz(w*.28,h*.40,w*.44,h*.17,'#7d1a48','#b5407a','#4e0c2b',900);
  ctx.fillStyle='#e9e6df';ctx.fillRect(w*.60,h*.46,w*.04,h*.05);ctx.fillStyle='#8a8d92';ctx.fillRect(w*.28,h*.57,w*.44,h*.012);
  fuzz(-w*.05,h*.62,w*.62,h*.22,'#e0207a','#ff6fb3','#9a1052',1600);fuzz(-w*.05,h*.84,w*.62,h*.22,'#d8186f','#ff5faa','#8a0c48',1600);
  fuzz(w*.78,h*.66,w*.32,h*.4,'#ece5d3','#fbf8f0','#c8bfa8',800);
  finish(ctx,w,h,o,R);}
/* 7. Winder with white packages on green spindles and cones on the conveyor */
function tow(ctx,w,h,o){const R=rng(o.seed||77);const vx=-w*.25,vy=h*.40;
  ctx.fillStyle=lin(ctx,0,0,0,h,[[0,'#e9ecef'],[.35,'#cfd4d9'],[.36,'#aeb4ba'],[1,'#8e949a']]);ctx.fillRect(0,0,w,h);
  for(let k=0;k<5;k++){ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillRect(w*.05+k*w*.2,h*.05+k*h*.02,w*.16,5);}
  const X=w*1.05,band=(y0,y1,col)=>{poly(ctx,[[X,y0],[vx,vy],[X,y1]]);ctx.fillStyle=col;ctx.fill();};
  band(h*.42,h*.56,'#f2f3f4');band(h*.56,h*.60,'#1f7d45');band(h*.60,h*.72,'#e2e5e8');band(h*.72,h*.76,'#2d3238');band(h*.76,h*.88,'#6d747b');
  const N=60;for(let k=N;k>=0;k--){const u=1-1/(1+k*.07);if(u>.96)continue;const s=1-u*.9,x=L(X,vx,u);
    const gy=L(h*.22,vy,u);ctx.fillStyle='#1f8a4c';ctx.fillRect(x-w*.004*s-1,gy,w*.008*s+2,h*.09*s);ell(ctx,x,gy,w*.02*s,w*.012*s);ctx.fillStyle='#2a9c58';ctx.fill();
    const pw=w*.075*s,ph=h*.11*s,py=L(h*.30,vy,u);ctx.fillStyle=lin(ctx,x-pw/2,0,x+pw/2,0,[[0,'#bfc3c7'],[.35,'#ffffff'],[1,'#c9cdd1']]);ctx.fillRect(x-pw/2,py,pw,ph);ell(ctx,x,py+ph,pw/2,pw*.18);ctx.fillStyle='#d4d7da';ctx.fill();ell(ctx,x,py,pw/2,pw*.18);ctx.fillStyle='#f4f5f6';ctx.fill();ell(ctx,x,py,pw*.12,pw*.05);ctx.fillStyle='#3b3f44';ctx.fill();
    if(k%2===0){ctx.fillStyle=['#e63946','#f4c20d','#2a9d8f','#1d6fd6'][k%4];ctx.fillRect(x-w*.006*s,L(h*.63,vy,u),w*.012*s,h*.02*s);}
    const cw=w*.065*s,ch=h*.13*s,cy=L(h*.92,vy,u);poly(ctx,[[x-cw*.30,cy-ch],[x+cw*.30,cy-ch],[x+cw*.5,cy],[x-cw*.5,cy]]);ctx.fillStyle=lin(ctx,x-cw/2,0,x+cw/2,0,[[0,'#c8ccd0'],[.4,'#fbfbfb'],[1,'#b9bec3']]);ctx.fill();ell(ctx,x,cy,cw*.5,cw*.16);ctx.fillStyle='#dcdfe2';ctx.fill();ell(ctx,x,cy-ch,cw*.3,cw*.1);ctx.fillStyle='#eceef0';ctx.fill();}
  finish(ctx,w,h,o,R);}
/* 8. The plant seen from the hillside: sawtooth roofs, gate canopy, road */
function factory(ctx,w,h,o){const R=rng(o.seed||88);
  ctx.fillStyle=lin(ctx,0,0,0,h*.45,[[0,'#5b6878'],[.55,'#9aa3ad'],[1,'#e2cfa6']]);ctx.fillRect(0,0,w,h*.45);
  for(let i=0;i<9;i++){const x=R()*w,y=h*(.04+R()*.22),rx=w*(.08+R()*.12),ry=h*(.02+R()*.03);ell(ctx,x,y,rx,ry);ctx.fillStyle='rgba(230,225,215,'+(.12+R()*.2)+')';ctx.fill();}
  const hill=(y,amp,col,sd)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,y);for(let x=0;x<=w+1;x+=w/24)ctx.lineTo(x,y-Math.abs(Math.sin(x/w*7+sd))*amp);ctx.lineTo(w,h);ctx.closePath();ctx.fill();};
  hill(h*.33,h*.09,'#6e7f8a',1.3);hill(h*.37,h*.06,'#5f7461',2.1);hill(h*.42,h*.03,'#4f6a4e',3.4);
  ctx.fillStyle=lin(ctx,0,h*.42,0,h,[[0,'#6f8b52'],[1,'#4f6a3a']]);ctx.fillRect(0,h*.42,w,h*.58);
  for(let i=0;i<26;i++){const x=R()*w,y=h*(.44+R()*.1),r=h*(.015+R()*.03);ell(ctx,x,y,r*1.1,r);ctx.fillStyle='rgba('+(40+R()*30|0)+','+(70+R()*30|0)+','+(35+R()*20|0)+',.95)';ctx.fill();}
  const bld=(x,y,W,D,H,shade)=>{const dx=-D*.55,dy=-D*.35;ctx.fillStyle=shade;ctx.fillRect(x,y-H,W,H);
    poly(ctx,[[x,y-H],[x+dx,y-H+dy],[x+dx,y+dy],[x,y]]);ctx.fillStyle='#aeb5bc';ctx.fill();
    const n=6;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n;poly(ctx,[[x+W*t0,y-H],[x+W*t1,y-H],[x+W*t1+dx,y-H+dy],[x+W*t0+dx,y-H+dy]]);ctx.fillStyle=i%2?'#eef0f2':'#d3d8dd';ctx.fill();}};
  bld(w*.20,h*.52,w*.25,w*.12,h*.05,'#c3c9cf');bld(w*.08,h*.60,w*.30,w*.16,h*.07,'#cfd4d9');bld(w*.72,h*.58,w*.22,w*.14,h*.06,'#c9ced3');bld(w*.36,h*.62,w*.34,w*.18,h*.08,'#d4d9de');
  ctx.fillStyle='#9a9ea2';poly(ctx,[[w*.48,h*.70],[w*1.02,h*.70],[w*1.02,h*1.05],[w*.6,h*1.05]]);ctx.fill();
  ctx.strokeStyle='#8b8f93';ctx.lineWidth=h*.07;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(w*.95,h*1.02);ctx.quadraticCurveTo(w*.7,h*.85,w*.55,h*.70);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(w*.9,h*1.02);ctx.quadraticCurveTo(w*.72,h*.88,w*.58,h*.73);ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<5;i++){ctx.fillStyle=['#e8e8e8','#2d2d2d','#c9c9c9','#b02a2a','#dcdcdc'][i];ctx.fillRect(w*(.8+i*.035),h*(.78+i*.01),w*.028,h*.022);}
  ctx.fillStyle='#f1f2f3';ctx.fillRect(w*.50,h*.60,w*.20,h*.05);ctx.fillStyle='#d5d8db';ctx.fillRect(w*.50,h*.65,w*.20,h*.008);ctx.fillStyle='#e5e7e9';ctx.fillRect(w*.505,h*.65,w*.012,h*.09);ctx.fillRect(w*.685,h*.65,w*.012,h*.09);
  ctx.fillStyle=o.brand||'#4b2a75';ell(ctx,w*.548,h*.625,w*.016,h*.009);ctx.fill();ctx.font='400 '+Math.max(8,h*.028)+'px "Alfa Slab One", Georgia, serif';ctx.textBaseline='middle';ctx.fillText(o.name||'ASL IP',w*.572,h*.626);
  for(let i=0;i<7;i++){const x=w*(i*.07)+R()*w*.03,y=h*(.9+R()*.15),r=h*(.06+R()*.06);ell(ctx,x,y,r*1.2,r);ctx.fillStyle='#2f4a2a';ctx.fill();}
  finish(ctx,w,h,Object.assign({},o,{vignette:o.vignette==null?.25:o.vignette}),R);}
const SCENES={cones,hall,creel:(c,w,h,o)=>hall(c,w,h,Object.assign({},o,{creel:true})),cans,spinning,bobbins,hanks,tow,factory};
function draw(c,force){const r=c.getBoundingClientRect(),w=Math.round(r.width),h=Math.round(r.height);if(!w||!h)return;const dpr=Math.min(2,window.devicePixelRatio||1),key=w+'x'+h+'@'+dpr;if(!force&&c.dataset.key===key)return;c.dataset.key=key;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);const fn=SCENES[c.dataset.scene];if(!fn)return;
  fn(ctx,w,h,{seed:+c.dataset.seed||0,tint:c.dataset.tint||null,mul:c.dataset.mul||null,brand:c.dataset.brand||null,name:c.dataset.name||'ASL IP',vignette:c.dataset.vignette!=null&&c.dataset.vignette!==''?+c.dataset.vignette:null});}
function all(force){document.querySelectorAll('canvas[data-scene]').forEach(c=>draw(c,force));}
let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>all(false),150);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>all(true));else all(true);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>all(true));
return{draw:draw,all:all};
})();
