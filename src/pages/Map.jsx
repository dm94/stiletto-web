import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import CreateMapNoLog from "../components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "../components/ClanMaps/ResourceMapNoLog";
import { getDomain } from "../functions/utils";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapId: null,
      pass: null,
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props?.location.search);
    this.setState({
      mapId: parsed.mapid,
      pass: parsed.pass,
    });
  }

  render() {
    if (this.state.mapId != null && this.state.pass != null) {
      return (
        <Fragment>
          <Helmet>
            <title>Interactive Resource Map - Stiletto for Last Oasis</title>
            <meta
              name="description"
              content="Interactive Map of resources shared through a link"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Map - Stiletto for Last Oasis"
            />
            <meta
              name="twitter:description"
              content="Interactive Map of resources shared through a link"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
            />
            <link
              rel="canonical"
              href={
                getDomain() +
                "/map/" +
                this.state.mapId
              }
            />
          </Helmet>
          <ResourceMapNoLog mapId={this.state.mapId} pass={this.state.pass} />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Helmet>
            <title>Interactive Resource Maps - Stiletto for Last Oasis</title>
            <meta
              name="description"
              content="Create and edit interactive maps to add resources or strategic points."
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Resource Maps - Stiletto for Last Oasis"
            />
            <meta
              name="twitter:description"
              content="Create and edit interactive maps to add resources or strategic points."
            />
            <link
              rel="canonical"
              href={
                getDomain() +
                "/map"
              }
            />
          </Helmet>
          <CreateMapNoLog
            onOpen={(id, pass) => {
              this.setState({ mapId: id, pass: pass });
            }}
          />
        </Fragment>
      );
    }
  }
}

export default Map;
