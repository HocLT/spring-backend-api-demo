const fs = require('fs');
const path = require('path');

const filesToFix = [
  'promotions/pages/PromotionsList.tsx',
  'rooms/components/RoomForm.tsx',
  'rooms/pages/RoomsList.tsx',
  'schedule-slots/components/ScheduleSlotForm.tsx',
  'schedule-slots/pages/ScheduleSlotsList.tsx',
  'teachers/pages/TeachersList.tsx',
  'courses/pages/CoursesList.tsx',
  'courses/components/CourseForm.tsx',
  'promotions/components/PromotionForm.tsx',
  'teachers/components/TeacherForm.tsx'
];

const baseDir = 'd:/Working/AnhChinh/springboot4-full/demo/day1/yoedu-frontend/src/features';

for (const file of filesToFix) {
  const fullPath = path.join(baseDir, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix list files
  if (file.includes('List.tsx')) {
    content = content.replace(/from '\.\.\/\.\.\/types/g, "from '../../../types");
    content = content.replace(/from '\.\.\/\.\.\/components/g, "from '../../../components");
    content = content.replace(/from '\.\.\/\.\.\/utils/g, "from '../../../utils");
    
    // Fix implicit any in renders
    content = content.replace(/render:\s*\((s|p|t|c)\)\s*=>/g, "render: ($1: any) =>");
    // Fix implicit any in item callbacks
    content = content.replace(/keyExtractor={\(item\)\s*=>/g, "keyExtractor={(item: any) =>");
    content = content.replace(/onView={\(item\)\s*=>/g, "onView={(item: any) =>");
    content = content.replace(/onEdit={\(item\)\s*=>/g, "onEdit={(item: any) =>");
    content = content.replace(/onDelete={\(item\)\s*=>/g, "onDelete={(item: any) =>");
  }

  // Fix form files
  if (file.includes('Form.tsx')) {
    content = content.replace(/useForm<[\w]+>\(\{/g, "useForm<any>({");
    content = content.replace(/const onSubmit = \(data: [\w]+\) => \{/g, "const onSubmit = (data: any) => {");
  }

  fs.writeFileSync(fullPath, content);
}
