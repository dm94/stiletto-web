import React, { Component } from "react";
import Item from "./Item";
import VirtualList from "react-tiny-virtual-list";

class Items extends Component {
  render() {
    return (
      <VirtualList
        role="listitem"
        itemCount={this.props?.items.length}
        itemSize={60}
        height="100%"
        width="100%"
        overscanCount={20}
        renderItem={({ index, style }) => (
          <div key={index} style={style}>
            <Item key={index} style={style} onAdd={this.props?.onAdd} item={this.props?.items[index]} />
          </div>
        )}
      />
    );
  }
}

export default Items;
