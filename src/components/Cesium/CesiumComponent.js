import React from 'react';
import Cesium from 'cesium/Source/Cesium.js';
import Box from 'react-layout-components'
import 'styles/cesium.css';
import 'assets/cesiumWidgets.css'

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickPositions: []
        }

        // var click1 = new Cesium.Cartesian3(-2155350.2, -4622163.4, 3817393.1);
        // this.state.clickPositions.push(click1);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        window.CESIUM_BASE_URL = '/cesium/';
        Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';
        this.viewer = this.createCesiumViewer();
        this.handleClick();
    }

    componentWillUnmount() {
        if (this.viewer)
            this.viewer.destroy();
    }

    render() {
        return (
            <Box width={500} height={300} justifyContent="center" alignItems="flex-start" alignSelf="center">
                <div ref="cesiumNode" id="cesiumContainer" className="cesium-widget">
                </div>
            </Box>
        );
    }

    createCesiumViewer() {
        const cesiumViewerOptions = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: true,
            fullscreenElement: 'cesiumContainer',
            geocoder: true,
            homeButton: true,
            infoBox: true,
            sceneModePicker: false,
            selectionIndicator: true,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            automaticallyTrackDataSourceClocks: false
        };

        // home
        const latitude = 32.80;
        const longitude = 35.13;
        const height = 17.0;

        const west = longitude;
        const south = latitude;
        const east = longitude + 0.01;
        const north = latitude + 0.01;
        let extent = Cesium.Rectangle.fromDegrees(west, south, east, north);

        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

        return new Cesium.Viewer(this.refs.cesiumNode, cesiumViewerOptions);
    }

    handleClick() {
        // handle click
        let viewer = this.viewer;
        viewer.canvas.addEventListener('click', function (e) {
            let mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);

            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
            if (cartesian) {
                let cartographic = ellipsoid.cartesianToCartographic(cartesian);
                let longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                let latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

                console.log(longitudeString + ', ' + latitudeString);
            } else {
                console.log('Globe was not picked');
            }
        }, false);
    }
}

export default CesiumComponent;
