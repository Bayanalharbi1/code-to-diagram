import type { ParseResult } from "../../types";

export function toMermaidFlow(pr: ParseResult, entry: string): string {
  const lines = [
    '%%{init: { "flowchart": { "htmlLabels": false } }}%%',
    "graph TD"
  ];
  const ids = new Map<string, string>();
  const visited = new Set<string>();
  let idx = 0;

  const esc = (s: string) => s.replace(/"/g, '\\"');

  function node(id: string, label: string) {
    lines.push(`  ${id}["${esc(label)}"]`);
  }
  function edge(a: string, b: string) {
    lines.push(`  ${a} --> ${b}`);
  }

  function walk(name: string, parentId?: string) {
    // أنشئ نود للدالة إذا ما لها نود قبل
    if (!ids.has(name)) {
      const newId = `N${idx++}`;
      ids.set(name, newId);
      node(newId, `${name}()`);
    }
    const myId = ids.get(name)!;

    // ارسم السهم من الأب للحالي
    if (parentId) edge(parentId, myId);

    // امنع الدوران، لكن لا تمنع رسم السهم للأب الحالي
    if (visited.has(name)) return;
    visited.add(name);

    const f = pr.symbols.find(s => s.kind === "function" && s.name === name);
    for (const c of (f?.calls ?? [])) walk(c, myId);
  }

  walk(entry);
  return lines.join("\n") + "\n";
}
