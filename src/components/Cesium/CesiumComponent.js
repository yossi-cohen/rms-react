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

        this.createControls(this.viewer);
        this.handleSelection(this.viewer);
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

        const west = longitude;
        const south = latitude;
        const east = longitude + 0.01;
        const north = latitude + 0.01;
        let extent = Cesium.Rectangle.fromDegrees(west, south, east, north);

        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
    }

    createControls(viewer) {
        //lilox:TODO

        cesiumTools.addToolbarButton('clear', this.handleToolbarButton);
        cesiumTools.addToolbarMenu([
            { text: 'circle', value: 'circle' },
            { text: 'box', value: 'box' },
            { text: 'polygon', value: 'polygon' }
        ], this.handleMenuSelection);
    }

    handleToolbarButton() {
        //lilox:TODO
        console.log('lilox: ---- handleToolbarButton');
    }

    handleMenuSelection(e) {
        //lilox:TODO
        console.log('lilox: ---- selected-menu:', e.target.value, ', selected-index:', e.target.selectedIndex);
    }

    handleSelection(viewer) {
        const self = this;
        const scene = viewer.scene;
        const camera = viewer.camera;
        const ellipsoid = scene.globe.ellipsoid;
        let dragging = false;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (event) {
                dragging = true;
                cesiumTools.enableDefaultEventHandlers(scene, false);
                const pos = cesiumTools.getLatLongAlt(viewer, event.position);
                self.state.positions = [pos];
                self.startSelectionDrawing(viewer, pos);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (dragging) {
                    const pos = cesiumTools.getLatLongAlt(viewer, movement.endPosition);
                    self.state.positions.push(pos);
                    self.updateSelectionDrawing(viewer, pos);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );

        handler.setInputAction(
            function () {
                if (dragging) {
                    dragging = false;
                    cesiumTools.enableDefaultEventHandlers(scene, true);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP
        );
    }

    reset(viewer) {
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
    }

    startSelectionDrawing(viewer, pos) {
        const scene = viewer.scene;

        //lilox
        const x = pos.longitude;
        const y = pos.latitude;

        //lilox:TODO
        // this.reset(viewer);

        // const entity = viewer.entities.add({
        //     position: Cesium.Cartesian3.fromDegrees(x, y),
        //     ellipse: {
        //         semiMajorAxis: 100.0,
        //         semiMinorAxis: 100.0,
        //         height: 50
        //     },
        //     material: Cesium.Color.fromRandom(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
        // });

        const circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: Cesium.Cartesian3.fromDegrees(x, y),
                radius: 200.0,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color : new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 0.0, 0.5)
            },
            id: 'circle'
        });

        const primitive = new Cesium.Primitive({
            geometryInstances: circleInstance,
            appearance : new Cesium.PerInstanceColorAppearance()
        });
        
        scene.primitives.add(primitive);
    }

    updateSelectionDrawing(viewer, pos) {
        //lilox:TODO
        this.updateCircle(viewer, pos);
    }

    updateCircle(viewer, pos) {
        //lilox:TODO
    }

    updateBoundingRect(viewer, pos) {
        //lilox:TODO
    }

    updatePolygon(viewer, pos) {
        //lilox:TODO
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
