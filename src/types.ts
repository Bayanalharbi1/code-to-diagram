export type DiagramType = "class" | "flow" | "sequence";
export interface SourceSymbol {
  name: string;
  kind: "class"|"interface"|"function"|"method"|"property";
  visibility?: "public"|"private"|"protected";
  static?: boolean;
  params?: { name: string; type?: string }[];
  returns?: string;
  type?: string;
  extends?: string[];
  implements?: string[];
  members?: SourceSymbol[];
  calls?: string[];
}
export interface ParseResult {
  symbols: SourceSymbol[];
  edges?: { from: string; to: string; type: "extends"|"implements"|"association" }[];
}
