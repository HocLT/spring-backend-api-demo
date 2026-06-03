import glob
import os
import re

base_dir = r"d:\Working\AnhChinh\springboot4-full\demo\day1\yoedu-frontend\src\features"

list_files = glob.glob(os.path.join(base_dir, "*", "pages", "*List.tsx"))
for f in list_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Fix the from expected error
    content = content.replace("import { DataTable }\nimport type { Column } from", "import { DataTable } from '../../../components/ui/DataTable';\nimport type { Column } from")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done")
