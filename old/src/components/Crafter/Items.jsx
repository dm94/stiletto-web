import React from "react";
import Item from "./Item";
import VirtualList from "react-tiny-virtual-list";

const Items = ({ items, onAdd }) => {
  if (!items) {
    return false;
  }

  return (
    <VirtualList
      role="listitem"
      itemCount={items.length}
      itemSize={60}
      height="100%"
      width="100%"
      overscanCount={20}
      renderItem={({ index, style }) => (
        <div key={index} style={style}>
          <Item key={index} style={style} onAdd={onAdd} item={items[index]} />
        </div>
      )}
    />
  );
};

export default Items;
