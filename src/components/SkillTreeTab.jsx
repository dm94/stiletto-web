import React, { Component } from "react";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";

class SkillTreeTab extends Component {
  state = {};
  render() {
    return (
      <SkillProvider>
        <SkillTreeGroup theme={this.props.theme}>
          {() => (
            <SkillTree
              treeId={this.props.treeId}
              title={this.props.title}
              data={this.props.data}
            />
          )}
        </SkillTreeGroup>
      </SkillProvider>
    );
  }
}

export default SkillTreeTab;
