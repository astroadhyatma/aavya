import type { VercelRequest, VercelResponse } from '@vercel/node';

type PrivateAuthUser = { code:string; password:string; id:string; name:string; email:string; stage:string; schoolId:string; schoolName:string; classSection?:string; gradeNumber?:number|string; rollNumber?:string };
function getUsers(): PrivateAuthUser[] { try { const parsed=JSON.parse(process.env.AAVYA_AUTH_USERS_JSON||'[]'); return Array.isArray(parsed)?parsed:[]; } catch { return []; } }
export default function handler(req: VercelRequest,res: VercelResponse) {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const code=String(req.body?.code||'').trim().toUpperCase(); const password=String(req.body?.password||'').trim();
  if(!code||!password) return res.status(400).json({error:'ID and password are required.'});
  const user=getUsers().find(item=>item.code.toUpperCase()===code&&item.password===password);
  if(!user) return res.status(401).json({error:'Invalid ID or password.'});
  return res.status(200).json({user:{id:user.id,name:user.name,email:user.email,role:'student',stage:user.stage,schoolId:user.schoolId,schoolName:user.schoolName,classSection:user.classSection,gradeNumber:user.gradeNumber,rollNumber:user.rollNumber}});
}
