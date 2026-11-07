import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../',import.meta.url).pathname;
const slugs=['wallpilot','medipick','lonex','lawygo','greenbean','ambassador','linkr','travelgaljido','garakhansang','garakorder'];
test('10 distinct project cover assets are present and nonzero',()=>{
 assert.equal(new Set(slugs).size,10);
 for(const slug of slugs){let p=path.join(root,'public/images/brands',slug+'.webp');assert.ok(fs.existsSync(p),`Missing ${slug}`);assert.ok(fs.statSync(p).size>10000,`Too small: ${slug}`);}
});
test('image files have valid WebP RIFF signatures',()=>{
 for(const slug of slugs){let p=path.join(root,'public/images/brands',slug+'.webp');let b=fs.readFileSync(p);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');}
});
test('all portfolio slugs have approved locally hosted images',()=>{
 const s=fs.readFileSync(path.join(root,'lib/branding.ts'),'utf8');
 for(const slug of slugs)assert.match(s,new RegExp(`slug:'${slug}'`));
 assert.match(s,/approvedSlugs\.has\(slug\)/);
 assert.match(s,/\`\/images\/brands\/\$\{slug\}\.webp\`/);
});
test('branded covers are used in public landing and authenticated dashboard',()=>{
 const landing=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
 const dashboard=fs.readFileSync(path.join(root,'app/dashboard/workspace.tsx'),'utf8');
 const detail=fs.readFileSync(path.join(root,'app/p/[slug]/page.tsx'),'utf8');
 for(const src of [landing,dashboard,detail])assert.match(src,/brandImage\(/);
 assert.match(dashboard,/section==='assets'/);
 assert.match(dashboard,/download=\{`\$\{x\.slug\}-lexid-invest\.webp`\}/);
});
test('public portfolio excludes leaked source links and fabricated investor metrics',()=>{
 const landing=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
 assert.doesNotMatch(landing,/\b247\b|\b18 submissions\b|\b3 investors\b/);
 assert.match(landing,/투자확약을 의미하지 않습니다/);
});
test('PWA manifest declares standalone UI and two first-party application icons',()=>{
 const manifest=fs.readFileSync(path.join(root,'app/manifest.ts'),'utf8');
 assert.match(manifest,/display:'standalone'/);
 assert.match(manifest,/icon-192\.png/);
 assert.match(manifest,/icon-512\.png/);
 for(const n of [192,512]){
  const b=fs.readFileSync(path.join(root,`public/icons/icon-${n}.png`));
  assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');
 }
});
