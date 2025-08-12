#!/usr/bin/env node
import { Command } from "commander";
import { TsParser } from "./parsers/tsParser.js";
import { toMermaidClass } from "./generators/mermaid/classGen.js";
import { toMermaidFlow } from "./generators/mermaid/flowGen.js";
import { toMermaidSequence } from "./generators/mermaid/sequenceGen.js";
import { writeFileSync } from "node:fs";

const program = new Command();
program.name("ctd").description("Code to Diagram (Mermaid) generator");

program
  .command("generate")
  .argument("<path...>", "files or folders")
  .option("--type <type>", "class|flow|sequence", "class")
  .option("--entry <fn>", "entry function for flow/sequence")
  .option("--out <file>", "output file (default stdout)")
  .action(async (paths, opts) => {
    const parser = new TsParser();
    const pr = await parser.parse(paths);
    let out = "";
    if (opts.type === "class") out = toMermaidClass(pr);
    else if (opts.type === "flow") out = toMermaidFlow(pr, opts.entry ?? "main");
    else if (opts.type === "sequence") out = toMermaidSequence(pr, opts.entry ?? "main");
    else throw new Error("Unknown type");
    if (opts.out) { writeFileSync(opts.out, out, "utf8"); console.log(`✅ written: ${opts.out}`); }
    else { console.log(out); }
  });

program.parse();
