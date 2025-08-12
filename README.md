# code-to-diagram

أداة **Node.js + TypeScript** لتحويل الأكواد إلى مخططات **Mermaid** (Class / Flow / Sequence) تلقائيًا.  
تعتمد على **ts-morph** لتحليل مشاريع **TypeScript/JavaScript** وتنتج ملفات `.mmd` قابلة للمعاينة داخل GitHub/VS Code، مع سكربتات جاهزة لتصديرها إلى صور **PNG/SVG**.

> **الحالة:** v0.1 — تدعم TS/JS + إخراج Mermaid.

---

## ✨ المزايا
- توليد: **classDiagram**, **graph TD (flowchart)**, **sequenceDiagram**.
- تقبل **مجلد** أو **ملف** أو **glob** (`"src/**/*.ts"`).
- تصميم معياري (Parser منفصل عن Generators) لتوسعة لغات ومخارج لاحقًا.
- سكربتات npm لتصدير PNG/SVG عبر Mermaid CLI.

---

## 🔧 المتطلبات
- **Node.js 18+**  
- (اختياري للصور) **@mermaid-js/mermaid-cli**

---

## 🚀 التثبيت والبناء
```bash
npm install
npm run build
