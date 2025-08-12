import type { ParseResult } from "../../types";
export function toMermaidClass(pr: ParseResult): string {
  const lines = ["classDiagram"];
  pr.symbols.filter(s => s.kind === "class" || s.kind === "interface").forEach(s => {
    lines.push(`  class ${s.name} {`);
    s.members?.forEach(m => {
      if (m.kind === "property") lines.push(`    ${m.name}: ${m.type ?? "any"}`);
      if (m.kind === "method") {
        const params = (m.params ?? []).map(p => `${p.name}: ${p.type ?? "any"}`).join(", ");
        lines.push(`    ${m.name}(${params}): ${m.returns ?? "void"}`);
      }
    });
    lines.push("  }");
  });
  pr.edges?.forEach(e => {
    if (e.type === "extends") lines.push(`  ${e.from} --|> ${e.to}`);
    if (e.type === "implements") lines.push(`  ${e.from} ..|> ${e.to}`);
  });
  return lines.join("\n");
}
