import { Tree } from "@ctypes/dto/tech";

export async function generateStaticParams() {
  // Generate static params for all tech tree types
  return Object.values(Tree).map((tree) => ({
    tree: tree.toLowerCase(),
  }));
}
