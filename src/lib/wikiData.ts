import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { cache } from "react";

const projectRoot = process.cwd();

function toPublicUrlPath(relativePath: string) {
  if (!relativePath.startsWith("public/")) return null;
  return `/${relativePath.slice("public/".length)}`;
}

async function getBaseUrlFromRequest() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return null;
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return await getBaseUrlFromRequest();
}

async function readPublicTextViaHttp(relativePath: string): Promise<string> {
  const urlPath = toPublicUrlPath(relativePath);
  const baseUrl = await getBaseUrl();
  if (!urlPath || !baseUrl) {
    throw new Error(`Cannot resolve public URL for "${relativePath}"`);
  }

  const res = await fetch(`${baseUrl}${urlPath}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch "${urlPath}" (${res.status})`);
  }
  return await res.text();
}

const readTextFile = cache(async (relativePath: string): Promise<string> => {
  try {
    const absolutePath = path.join(projectRoot, relativePath);
    return await readFile(absolutePath, "utf8");
  } catch {
    return await readPublicTextViaHttp(relativePath);
  }
});

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const raw = await readTextFile(relativePath);
  return JSON.parse(raw) as T;
}

export async function readOptionalTextFile(
  relativePath: string,
): Promise<string | undefined> {
  try {
    return await readTextFile(relativePath);
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
