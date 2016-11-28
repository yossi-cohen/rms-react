//lilox: move primitive, remove primitive (right-click)

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
        this.initState();
    }

    initState() {
        this.state = {
            center: { x: 0, y: 0 },
            primitive: null, // current primitive we work on
            primitives: [],
            picked: false,
            pickedObject: null,
        }
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
        this.handleMovePrimitives(this.viewer);
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

        cesiumTools.addToolbarButton('clear', this.handleToolbarButtonClear.bind(this));
        cesiumTools.addToolbarMenu([
            { text: 'circle', value: 'circle' },
            { text: 'box', value: 'box' },
            { text: 'polygon', value: 'polygon' }
        ], this.handleMenuSelection);
    }

    handleToolbarButtonClear() {
        //lilox:TODO
        this.reset(this.viewer);
        this.initState();
    }

    reset(viewer) {
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
        viewer.scene.primitives.removeAll();
    }

    handleMenuSelection(e) {
        //lilox:TODO
        console.log('lilox: ---- selected-menu:', e.target.value, ', selected-index:', e.target.selectedIndex);
    }

    //lilox2
    handleMovePrimitives(viewer) {
        const self = this;
        const camera = viewer.camera;
        const scene = viewer.scene;
        const ellipsoid = viewer.scene.globe.ellipsoid;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(function (click) {
            const pickedObject = scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                self.state.picked = true;
                self.state.pickedObject = pickedObject.primitive;
                cesiumTools.enableDefaultEventHandlers(scene, false);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!self.state.picked)
                return;
            const position = camera.pickEllipsoid(movement.endPosition, ellipsoid);
            //lilox2
            // console.log('lilox ###### self.state.pickedObject:', self.state.pickedObject);
            // const radius = self.state.pickedObject._boundingSphere2D.radius;
            const radius = 200;
            self.removePrimitive(viewer, self.state.pickedObject);
            self.state.primitive = self.state.pickedObject = self.drawCirclePrimitive(viewer, position, radius);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            self.state.picked = false; // if picked
            self.state.pickedObject = null;
            cesiumTools.enableDefaultEventHandlers(scene, true);
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        viewer.zoomTo(viewer.entities);
    }

    handleSelection(viewer) {
        const self = this;
        const camera = viewer.camera;
        const ellipsoid = viewer.scene.globe.ellipsoid;
        let dragging = false;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (event) {
                dragging = true;
                self.startSelectionDrawing(viewer, event.position);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (dragging)
                    self.updateSelectionDrawing(viewer, movement.endPosition);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function () {
                if (dragging) {
                    dragging = false;
                    self.endSelectionDrawing(viewer);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT
        );
    }

    startSelectionDrawing(viewer, mousePosition) {
        cesiumTools.enableDefaultEventHandlers(viewer.scene, false);

        const center = viewer.camera.pickEllipsoid(mousePosition, viewer.scene.globe.ellipsoid);
        this.state.center = center;
        this.state.primitive = this.drawCirclePrimitive(viewer, center, 0);
    }

    updateSelectionDrawing(viewer, mousePosition) {
        //lilox:TODO
        const cartesian = viewer.camera.pickEllipsoid(mousePosition, viewer.scene.globe.ellipsoid);
        this.updateCircle(viewer, cartesian);
    }

    endSelectionDrawing(viewer) {
        //lilox:TODO - update redux store?
        this.state.primitives.push(this.state.primitive);
        cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
    }

    updateCircle(viewer, pos) {
        //lilox:TODO
        const xsquare = Math.pow(pos.x - this.state.center.x, 2);
        const ysquare = Math.pow(pos.y - this.state.center.y, 2);
        const radius = Math.sqrt(ysquare + xsquare);
        this.removePrimitive(viewer, this.state.primitive);
        this.state.primitive = this.drawCirclePrimitive(viewer, this.state.center, radius);
    }

    drawCirclePrimitive(viewer, center, radius) {
        const circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: center,
                radius: radius,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 0.0, 0.5)
            },
            id: 'circle'
        });

        const primitive = new Cesium.Primitive({
            geometryInstances: circleInstance,
            asynchronous: false,
            appearance: new Cesium.PerInstanceColorAppearance()
        });

        viewer.scene.primitives.add(primitive);
        return primitive;
    }

    drawCircleOutlinePrimitive(viewer, center, radius) {
        const circleInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleOutlineGeometry({
                center: center,
                radius: radius,
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
            },
            id: 'circle'
        });

        const primitive = new Cesium.Primitive({
            geometryInstances: circleInstance,
            asynchronous: false,
            appearance: new Cesium.PerInstanceColorAppearance({
                flat: true,
                renderState: {
                    depthTest: {
                        enabled: true
                    },
                    lineWidth: Math.min(3.0, viewer.scene.maximumAliasedLineWidth)
                }
            })
        });

        viewer.scene.primitives.add(primitive);
        return primitive;
    }

    removePrimitive(viewer, primitive) {
        viewer.scene.primitives.remove(primitive);
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
