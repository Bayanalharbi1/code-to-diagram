# code-to-diagram

أداة **Node.js + TypeScript** لتحويل الأكواد إلى مخططات **Mermaid** (Class / Flow / Sequence) تلقائيًا.
تعتمد على **ts-morph** لتحليل مشاريع **TypeScript/JavaScript** وتنتج ملفات `.mmd` قابلة للمعاينة، مع خيار تصدير صور **PNG/SVG**.

> **v0.1.0** – تدعم TS/JS وتوليد Mermaid.

---

## ✨ المزايا
- توليد: **classDiagram**, **graph TD (flowchart)**, **sequenceDiagram**.
- تمرير **مجلد** أو **ملف** أو **glob** (`"src/**/*.ts"`).
- سكربتات جاهزة لتصدير الصور بـ **Mermaid CLI**.

---

## 🔧 المتطلبات
- Node.js 18+
- (اختياري) @mermaid-js/mermaid-cli للتصدير كصور

---

## 🚀 التثبيت والبناء
```bash
npm install
npm run build
