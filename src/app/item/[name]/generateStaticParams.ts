import { getItems } from "@functions/services";
import { getItemCodedName } from "@/functions/utils";

export async function generateStaticParams() {
  const items = await getItems();

  return items.map((item) => ({
    name: getItemCodedName(item.name),
  }));
}
