import React, { Component } from "react";
import Item from "./Item";
import VirtualList from "react-tiny-virtual-list";

class Items extends Component {
  render() {
    return (
      <VirtualList
        itemCount={this.props.items.length}
        itemSize={75}
        height="100%"
        width="100%"
        overscanCount={20}
        renderItem={({ index, style }) => (
          <div key={index} style={style}>
            <Item onAdd={this.props.onAdd} item={this.props.items[index]} />
          </div>
        )}
      />
    );
  }
}

export default Items;
