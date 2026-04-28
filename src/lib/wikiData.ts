import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const absolutePath = path.join(projectRoot, relativePath);
  const raw = await readFile(absolutePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function readOptionalTextFile(
  relativePath: string,
): Promise<string | undefined> {
  try {
    const absolutePath = path.join(projectRoot, relativePath);
    return await readFile(absolutePath, "utf8");
  } catch {
    return undefined;
  }
}

