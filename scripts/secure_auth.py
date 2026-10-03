from pathlib import Path
import re

root = Path('.')

p = root / 'server.ts'
s = p.read_text()
marker = 'app.use(express.json());\n'
if 'AAVYA_AUTH_USERS_JSON' not in s:
    auth = '''\n// Private authentication store. Credentials are supplied only through the\n// server environment and are never bundled into the client.\ntype PrivateAuthUser = {\n  code: string; password: string; id: string; name: string; email: string;\n  stage: string; schoolId: string; schoolName: string; classSection?: string;\n  gradeNumber?: number | string; rollNumber?: string;\n};\n\nfunction getPrivateAuthUsers(): PrivateAuthUser[] {\n  try {\n    const parsed = JSON.parse(process.env.AAVYA_AUTH_USERS_JSON || '[]');\n    return Array.isArray(parsed) ? parsed : [];\n  } catch { return []; }\n}\n\napp.post('/api/auth/login', (req: Request, res: Response) => {\n  const code = String(req.body?.code || '').trim().toUpperCase();\n  const password = String(req.body?.password || '').trim();\n  if (!code || !password) return res.status(400).json({ error: 'ID and password are required.' });\n  const user = getPrivateAuthUsers().find((item) => item.code.toUpperCase() === code && item.password === password);\n  if (!user) return res.status(401).json({ error: 'Invalid ID or password.' });\n  return res.json({ user: { id:user.id, name:user.name, email:user.email, role:'student', stage:user.stage, schoolId:user.schoolId, schoolName:user.schoolName, classSection:user.classSection, gradeNumber:user.gradeNumber, rollNumber:user.rollNumber } });\n});\n'''
    s = s.replace(marker, marker + auth + '\n')
p.write_text(s)

p = root / 'src/context/AppContext.tsx'
s = p.read_text()
s = s.replace("loginWithStudentCode: (code: string, passwordPin?: string) => { success: boolean; error?: string };", "loginWithStudentCode: (code: string, passwordPin?: string) => Promise<{ success: boolean; error?: string }>;")
start = s.find('  // Login With Individual Student Passcode')
end = s.find('  // Login With School License Key', start)
if start != -1 and end != -1:
    new = '''  // Login with private server-side student credentials.\n  const loginWithStudentCode = async (rawCode: string, passwordPin?: string): Promise<{ success: boolean; error?: string }> => {\n    try {\n      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: rawCode, password: passwordPin || '' }) });\n      const payload = await response.json();\n      if (!response.ok || !payload.user) return { success: false, error: payload.error || 'Invalid ID or password.' };\n      const serverUser = payload.user as AuthUser;\n      const user: AuthUser = { ...serverUser, role: 'student', studentPasscode: undefined, passwordPin: undefined };\n      setCurrentUser(user);\n      return { success: true };\n    } catch {\n      return { success: false, error: 'Authentication service is unavailable. Please try again.' };\n    }\n  };\n\n'''
    s = s[:start] + new + s[end:]
p.write_text(s)

p = root / 'src/components/auth/LoginPortal.tsx'
s = p.read_text()
s = s.replace('const handleStudentLogin = (e: React.FormEvent) => {', 'const handleStudentLogin = async (e: React.FormEvent) => {')
s = s.replace('const res = loginWithStudentCode(studentCode.trim(), studentPin.trim() || undefined);', 'const res = await loginWithStudentCode(studentCode.trim(), studentPin.trim() || undefined);')
s = s.replace('placeholder="E.g., AAVYA-HER-S1124, AAVYA-HER-P401 or Name"', 'placeholder="Enter your private ID"')
a = s.find('              {/* 1-Click Fast Personas */}')
b = s.find('            </form>', a)
if a != -1 and b != -1:
    s = s[:a] + '''              <div className="pt-3 border-t border-neutral-100">\n                <p className="text-[11px] text-neutral-500 text-center">\n                  {isHi ? 'आपकी ID और password सुरक्षित server पर सत्यापित होते हैं।' : 'Your ID and password are verified securely on the server.'}\n                </p>\n              </div>\n''' + s[b:]
p.write_text(s)

p = root / 'src/components/common/RoleSwitcherModal.tsx'
s = p.read_text()
s = s.replace('    code: string;\n', '')
s = re.sub(r"\n      code: 'AAVYA-HER-[A-Z0-9]+',", '', s)
s = s.replace('    loginWithStudentCode,\n', '')
s = s.replace("      loginWithStudentCode('AAVYA-HER-S1124');", "      if (currentUser) setRoleModalOpen(false);")
s = s.replace("                      loginWithStudentCode(st.code);\n                      setStudentStage(st.key);", "                      setStudentStage(st.key);")
p.write_text(s)

p = root / '.env.example'
s = p.read_text()
if 'AAVYA_AUTH_USERS_JSON' not in s:
    s += '''\n\n# Private student credentials. Set this ONLY in Vercel/server environment variables.\n# Example format (replace with your real private values; do not commit them):\nAAVYA_AUTH_USERS_JSON='[{"code":"YOUR-ID","password":"YOUR-PASSWORD","id":"student-id","name":"Student Name","email":"student@example.com","stage":"classes_9_12","schoolId":"school-id","schoolName":"School Name","classSection":"11-A"}]'\n'''
p.write_text(s)

p = root / 'api/auth/login.ts'
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text('''import type { VercelRequest, VercelResponse } from '@vercel/node';\n\ntype PrivateAuthUser = { code:string; password:string; id:string; name:string; email:string; stage:string; schoolId:string; schoolName:string; classSection?:string; gradeNumber?:number|string; rollNumber?:string };\nfunction getUsers(): PrivateAuthUser[] { try { const parsed=JSON.parse(process.env.AAVYA_AUTH_USERS_JSON||'[]'); return Array.isArray(parsed)?parsed:[]; } catch { return []; } }\nexport default function handler(req: VercelRequest,res: VercelResponse) {\n  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});\n  const code=String(req.body?.code||'').trim().toUpperCase(); const password=String(req.body?.password||'').trim();\n  if(!code||!password) return res.status(400).json({error:'ID and password are required.'});\n  const user=getUsers().find(item=>item.code.toUpperCase()===code&&item.password===password);\n  if(!user) return res.status(401).json({error:'Invalid ID or password.'});\n  return res.status(200).json({user:{id:user.id,name:user.name,email:user.email,role:'student',stage:user.stage,schoolId:user.schoolId,schoolName:user.schoolName,classSection:user.classSection,gradeNumber:user.gradeNumber,rollNumber:user.rollNumber}});\n}\n''')

p = root / 'backend/README.md'
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text('''# AAVYA private backend\n\nStudent IDs/passwords are server-side only. Store them in `AAVYA_AUTH_USERS_JSON` as a Vercel environment variable. Do not put real credentials in GitHub or frontend code.\n\nLogin endpoint: `POST /api/auth/login`.\n''')

# Do not keep this helper in production after the patch has been applied.
Path('scripts/secure_auth.py').unlink(missing_ok=True)
