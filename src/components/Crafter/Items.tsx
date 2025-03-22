import type React from "react";
import { useRef } from "react";
import Item from "./Item";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Item as ItemType } from "../../types/item";

interface ItemsProps {
  items: ItemType[];
  onAdd: (itemName: string, count?: number) => void;
}

const Items: React.FC<ItemsProps> = ({ items = [], onAdd }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 60,
    overscan: 20,
  });

  if (items?.length <= 0) {
    return null;
  }

  const itemsToShow = virtualizer.getVirtualItems();

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
    >
      {itemsToShow.map((item) => (
        <div
          key={item.index}
          style={{
            position: "absolute",
            transform: `translateY(${item.start}px)`,
            width: "100%",
            height: `${item.size}px`,
          }}
        >
          <Item onAdd={onAdd} item={items[item.index]} />
        </div>
      ))}
    </div>
  );
};

export default Items;
