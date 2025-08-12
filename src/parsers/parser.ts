import type { ParseResult } from "../types";
export interface Parser { parse(paths: string[]): Promise<ParseResult>; }
