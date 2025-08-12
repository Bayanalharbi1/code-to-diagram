import type { ParseResult } from "../../types";
export function toMermaidSequence(pr: ParseResult, entry: string): string {
  const lines = ["sequenceDiagram"]; const visited = new Set<string>();
  function emit(fnName:string){
    const f = pr.symbols.find(s => s.kind==="function" && s.name===fnName);
    if (!f) return; visited.add(fnName);
    (f.calls ?? []).forEach(c=>{
      lines.push(`  ${fnName}->>+${c}: call`);
      if (!visited.has(c)) emit(c);
      lines.push(`  ${c}-->>-${fnName}: return`);
    });
  }
  emit(entry);
  return lines.join("\n");
}
