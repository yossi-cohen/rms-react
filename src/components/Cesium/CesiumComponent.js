import React from 'react';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
import Cesium from 'cesium/Source/Cesium.js';
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Entity from 'cesium/Source/DataSources/Entity';
import CesiumPatcher from './cesium.patcher.js';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import 'styles/cesium.css';
import screenfull from 'screenfull'
import { findDOMNode } from 'react-dom'

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false
};

class CesiumComponent extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {

    Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';

    BuildModuleUrl.setBaseUrl('/cesium/');

    // Create the Cesium Viewer
    this.viewer = new CesiumViewer(this.refs.cesuim, cesiumViewerOptions);

    // Add the initial points
    this.props.cities.forEach((city) => {
      this.viewer.entities.add(new Entity({
        id: city.id,
        show: city.visible,
        position: new Cartesian3.fromDegrees(city.longitude, city.latitude),
        //lilox
        // billboard: {
        //   image: require('images/pin.svg'),
        //   width: 30,
        //   height: 30
        // }
      }));
    });
  }

  componentWillReceiveProps(nextProps) {
    let patches = CesiumPatcher.calculatePatches(this.props, nextProps);

    // Map patch operations to Cesium's Entity API
    patches.forEach((patch) => {
      if (patch.attribute === 'visible') {
        this.viewer.entities.getById(patch.id).show = patch.nextValue;
      }
      // else if (patch.attribute === 'name') { .. and so on .. }
    });
  }

  onClickFullscreen = () => {
    //lilox: 
    screenfull.request(findDOMNode(this.refs.cesuim));

    // let elem = findDOMNode(this.refs.cesuim);
    // console.log('lilox ----------------------- elem:', elem);
    // console.log('lilox ----------------------- elem.requestFullscreen:', elem.requestFullscreen);

    // if (elem && elem.requestFullscreen)
    //   elem.requestFullscreen();
  }

  render() {
    return (
      <div>
        <div ref="cesuim" onTouchTap={this.onClickFullscreen}>
        </div>
      </div>
    );
  }
}

export default CesiumComponent;
