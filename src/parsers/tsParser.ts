import { Project, SyntaxKind } from "ts-morph";
import type { Parser } from "./parser";
import type { ParseResult, SourceSymbol } from "../types";

export class TsParser implements Parser {
  async parse(paths: string[]): Promise<ParseResult> {
    const project = new Project({ skipAddingFilesFromTsConfig: true });

    // جهّزي أنماط الملفات بشكل آمن (ملف / مجلد / glob)
    const globs: string[] = [];
    for (let p of paths) {
      // طبيع مسارات ويندوز عشان المسافات والباك-سلاش
      p = p.replace(/\\/g, "/");
      const looksLikeFile = /\.[tj]sx?$/.test(p);
      const looksLikeGlob = /[*?{}\[\]]/.test(p);

      if (looksLikeFile || looksLikeGlob) {
        globs.push(p);
      } else {
        // اعتبره مجلد
        globs.push(`${p}/**/*.{ts,tsx,js,jsx}`);
      }
    }
    // تجاهل مجلدات شائعة ما نبي نحللها
    globs.push("!**/{node_modules,dist,build,out,coverage,venv}/**");

    // أضِف كل الملفات مرة وحدة
    project.addSourceFilesAtPaths(globs);

    const symbols: SourceSymbol[] = [];
    const edges: ParseResult["edges"] = [];

    for (const sf of project.getSourceFiles()) {
      // Classes
      for (const cls of sf.getClasses()) {
        const name = cls.getName() ?? "AnonymousClass";
        const extendsTypes = cls.getExtends()?.getText() ? [cls.getExtends()!.getText()] : [];
        const implementsTypes = cls.getImplements().map(i => i.getText());
        const members: SourceSymbol[] = [];

        for (const p of cls.getProperties()) {
          members.push({
            name: p.getName(),
            kind: "property",
            visibility: (p.getScope() as any) ?? "public",
            type: p.getType().getText()
          });
        }
        for (const m of cls.getMethods()) {
          members.push({
            name: m.getName(),
            kind: "method",
            visibility: (m.getScope() as any) ?? "public",
            params: m.getParameters().map(pa => ({ name: pa.getName(), type: pa.getType().getText() })),
            returns: m.getReturnType().getText()
          });
        }

        symbols.push({ name, kind: "class", extends: extendsTypes, implements: implementsTypes, members });
        extendsTypes.forEach(t => edges!.push({ from: name, to: t, type: "extends" }));
        implementsTypes.forEach(t => edges!.push({ from: name, to: t, type: "implements" }));
      }

      // Interfaces
      for (const i of sf.getInterfaces()) {
        symbols.push({
          name: i.getName(),
          kind: "interface",
          members: i.getProperties().map(p => ({
            name: p.getName(),
            kind: "property",
            type: p.getType().getText()
          }))
        });
      }

      // Functions + calls (للـ flow/sequence)
      sf.forEachDescendant(node => {
        if (node.getKind() === SyntaxKind.FunctionDeclaration) {
          const n: any = node;
          const fn: SourceSymbol = {
            name: n.getName?.() ?? "anonymous",
            kind: "function",
            params:
              n.getParameters?.().map((pa: any) => ({ name: pa.getName(), type: pa.getType().getText() })) ?? [],
            returns: n.getReturnType?.().getText?.() ?? "void",
            calls: []
          };
          n.getBody?.()?.forEachDescendant?.((k: any) => {
            if (k.getKind() === SyntaxKind.CallExpression) {
              const name = k.getExpression?.().getText?.();
              if (name) fn.calls!.push(name);
            }
          });
          symbols.push(fn);
        }
      });
    }

    return { symbols, edges };
  }
}
