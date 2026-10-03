from pathlib import Path
import re

# One-time cleanup: keep real student credentials out of the public client bundle.
p = Path('src/data/mockData.ts')
s = p.read_text()
s = re.sub(r"    issuedKeys: \[\n(?:.*\n)*?    \],", "    issuedKeys: [],", s, count=1)
s = re.sub(r"    issuedKeys: \[\n(?:.*\n)*?    \],", "    issuedKeys: [],", s, count=1)
p.write_text(s)

for rel in ['src/components/auth/LoginPortal.tsx', 'src/components/institution/RosterManagement.tsx']:
    p = Path(rel)
    s = p.read_text()
    s = s.replace("useState('1234')", "useState('')")
    s = s.replace(" || '1234'", "")
    s = s.replace('placeholder="1234"', 'placeholder="Enter private PIN"')
    s = s.replace('placeholder="E.g., 1234 or Pass@1"', 'placeholder="Enter private PIN"')
    s = s.replace('Default: 1234', 'your private PIN')
    p.write_text(s)

Path('scripts/remove_public_creds.py').unlink(missing_ok=True)
