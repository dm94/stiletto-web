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

export async function readOptionalJsonFile<T>(
  relativePath: string,
): Promise<T | undefined> {
  const text = await readOptionalTextFile(relativePath);
  if (!text) return undefined;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}
