import { ImageResponse } from 'next/og';
export const alt = 'LEXID INVEST · Global Fundraising OS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OGImage(){
 return new ImageResponse(
  <div style={{height:'100%',width:'100%',display:'flex',position:'relative',overflow:'hidden',background:'#142525',color:'#eef5e9',fontFamily:'Arial,sans-serif',padding:75,flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center',gap:16,fontSize:29,fontWeight:900,letterSpacing:2}}><div style={{width:52,height:52,borderRadius:13,background:'#c9f47c',color:'#193329',display:'flex',alignItems:'center',justifyContent:'center'}}>L</div> LEXID INVEST</div>
    <div style={{display:'flex',fontSize:86,fontWeight:800,letterSpacing:-3,lineHeight:1.05,marginTop:85}}>Great ideas deserve</div>
    <div style={{display:'flex',fontSize:89,fontWeight:800,letterSpacing:-3,lineHeight:1.05,color:'#c8f17c'}}>global capital.</div>
    <div style={{display:'flex',fontSize:22,marginTop:40,color:'#b8cbbd'}}>FUNDRAISING INTELLIGENCE · INVESTOR RELATIONS · EVIDENCE-LED</div>
    <div style={{display:'flex',position:'absolute',right:-180,top:-210,width:560,height:560,border:'2px solid #8daa6b60',borderRadius:'50%'}}/>
    <div style={{display:'flex',position:'absolute',right:-80,top:-110,width:360,height:360,border:'2px solid #c3f47b50',borderRadius:'50%'}}/>
  </div>,size
 );
}
