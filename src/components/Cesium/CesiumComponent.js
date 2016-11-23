import React from 'react';
import Cesium from 'cesium/Source/Cesium.js';
import 'styles/cesium.css';
import 'assets/cesiumWidgets.css'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: true,
  fullscreenElement: 'cesiumDiv',
  geocoder: true,
  homeButton: true,
  infoBox: true,
  sceneModePicker: true,
  selectionIndicator: true,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: true,
  automaticallyTrackDataSourceClocks: false
};

const styles = {
  cesium: {
    width: '640px',
    height: '480px'
  },
}

class CesiumComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    window.CESIUM_BASE_URL = '/cesium/';
    Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';
    this.viewer = new Cesium.Viewer(this.refs.cesiumNode, cesiumViewerOptions);
  }

  componentWillUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  render() {
    return (
      <div ref="cesiumNode" id="cesiumDiv" className="cesium-widget">
      </div>
    );
  }
}

export default CesiumComponent;
