const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Working/AnhChinh/springboot4-full/demo/day1/yoedu-frontend/src/features';
const features = ['courses', 'promotions', 'rooms', 'schedule-slots', 'teachers'];

for (const f of features) {
  const formFile = path.join(baseDir, f, 'components', {
    'courses': 'CourseForm.tsx',
    'promotions': 'PromotionForm.tsx',
    'rooms': 'RoomForm.tsx',
    'schedule-slots': 'ScheduleSlotForm.tsx',
    'teachers': 'TeacherForm.tsx'
  }[f]);
  
  if (fs.existsSync(formFile)) {
    let formContent = fs.readFileSync(formFile, 'utf8');
    formContent = formContent.replace(/useForm<[^>]+>\(\{/g, 'useForm({');
    fs.writeFileSync(formFile, formContent);
  }

  const listFile = path.join(baseDir, f, 'pages', {
    'courses': 'CoursesList.tsx',
    'promotions': 'PromotionsList.tsx',
    'rooms': 'RoomsList.tsx',
    'schedule-slots': 'ScheduleSlotsList.tsx',
    'teachers': 'TeachersList.tsx'
  }[f]);

  if (fs.existsSync(listFile)) {
    let content = fs.readFileSync(listFile, 'utf8');
    content = content.replace(/from '\.\.\/\.\.\/types/g, "from '../../../types");
    content = content.replace(/from '\.\.\/\.\.\/components/g, "from '../../../components");
    content = content.replace(/from '\.\.\/\.\.\/utils/g, "from '../../../utils");
    
    // Fix implicit any
    content = content.replace(/render: \(([\w]+)\) =>/g, "render: ($1: any) =>");
    content = content.replace(/keyExtractor={\(item\) =>/g, "keyExtractor={(item: any) =>");
    content = content.replace(/onView={\(item\) =>/g, "onView={(item: any) =>");
    content = content.replace(/onEdit={\(item\) =>/g, "onEdit={(item: any) =>");
    content = content.replace(/onDelete={\(item\) =>/g, "onDelete={(item: any) =>");
    fs.writeFileSync(listFile, content);
  }
}
