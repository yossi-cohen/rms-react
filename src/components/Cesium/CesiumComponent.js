import React from 'react';
import { connect } from "react-redux";
import Cesium from "cesium/Cesium"
import cesiumTools from './CesiumTools'
import Box from 'react-layout-components'
import 'assets/cesiumWidgets.css'
import 'styles/cesium.css';

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);

        //lilox
        this.state = {
            positions: [],
        }

        // this.state = {
        //     clickPositions: [],
        // }
        // let click1 = new Cesium.Cartesian3(-2155350.2, -4622163.4, 3817393.1);
        // this.state.clickPositions.push(click1);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        window.CESIUM_BASE_URL = '/cesium/';
        Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';
        this.viewer = this.createCesiumViewer();

        this.createControls();

        this.captureMouse();
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
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            automaticallyTrackDataSourceClocks: false,
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/world'
            })
        };

        this.setCesiumHome(); // before creating viewer

        return new Cesium.Viewer(this.refs.cesiumNode, cesiumViewerOptions);
    }

    setCesiumHome() {
        //lilox: home
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
    }

    createControls() {
        //lilox:TODO

        cesiumTools.addToolbarButton('clear', this.handleToolbarButton);
        cesiumTools.addToolbarMenu([
            { text: 'circle', value: 'circle' },
            { text: 'box', value: 'box' },
            { text: 'polygon', value: 'polygon' }
        ], this.handleMenuSelection);
    }

    captureMouse() {
        const self = this;
        const viewer = this.viewer;
        const scene = viewer.scene;
        const camera = viewer.camera;
        const ellipsoid = scene.globe.ellipsoid;
        let dragging = false;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (event) {
                dragging = true;
                self.enableDefaultEventHandlers(scene, false);
                const pos = self.getLatLongAlt(viewer, event.position);
                self.state.positions = [pos];
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (dragging) {
                    const pos = self.getLatLongAlt(viewer, movement.endPosition);
                    self.state.positions.push(pos);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );

        handler.setInputAction(
            function () {
                if (dragging) {
                    dragging = false;
                    self.enableDefaultEventHandlers(scene, true);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP
        );
    }

    // enable/disable cesium default event handlers
    enableDefaultEventHandlers(scene, enable = true) {
        scene.screenSpaceCameraController.enableRotate = enable;
        scene.screenSpaceCameraController.enableTranslate = enable;
        scene.screenSpaceCameraController.enableZoom = enable;
        scene.screenSpaceCameraController.enableTilt = enable;
        scene.screenSpaceCameraController.enableLook = enable;
    }

    // get ongitude, latitude, altitude from mouse position
    getLatLongAlt(viewer, mousePosition) {
        const scene = viewer.scene;
        const ellipsoid = scene.globe.ellipsoid;

        let pos = { longitude: 0, latitude: 0, altitude: 0 };

        const cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
        if (cartesian) {
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            pos.longitude = Cesium.Math.toDegrees(cartographic.longitude);
            pos.latitude = Cesium.Math.toDegrees(cartographic.latitude);

            // get height
            const ray = viewer.camera.getPickRay(mousePosition);
            const position = viewer.scene.globe.pick(ray, viewer.scene);
            if (Cesium.defined(position)) {
                const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                pos.altitude = cartographic.height;
            }
        }

        //lilox
        // console.log(
        //     '### longitude:', pos.longitude.toFixed(2),
        //     ', latitude:', pos.latitude.toFixed(2),
        //     ', height:', pos.altitude.toFixed(2));

        return pos;
    }

    handleToolbarButton() {
        //lilox:TODO
        console.log('lilox: ---- handleToolbarButton');
    }

    handleMenuSelection(e) {
        //lilox:TODO
        console.log('lilox: ---- selected-menu:', e.target.value, ', selected-index:', e.target.selectedIndex);
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
