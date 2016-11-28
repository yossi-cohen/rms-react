//lilox: select primitive, remove primitive (right-click)

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
        this.clearState();
    }

    clearState() {
        this.state = {
            primitiveType: 0,
            primitive: null, // selected primitive
            center: { x: 0, y: 0 },
        }
    }

    // ----------------------------------------------------------------------
    // rendering
    // ----------------------------------------------------------------------

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        window.CESIUM_BASE_URL = '/cesium/';
        Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';
        this.viewer = this.createCesiumViewer();

        this.createControls(this.viewer);
        this.handleCreatePrimitive(this.viewer);
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

    // ----------------------------------------------------------------------
    // utility methods
    // ----------------------------------------------------------------------

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

        cesiumTools.setCesiumHome(32.80, 35.13); // before creating viewer

        return new Cesium.Viewer(this.refs.cesiumNode, cesiumViewerOptions);
    }

    createControls(viewer) {
        cesiumTools.addToolbarButton('clear', this.handleClear.bind(this));
        cesiumTools.addToolbarMenu([
            { text: 'circle', value: 'circle' },
            { text: 'box', value: 'box' },
            { text: 'polygon', value: 'polygon' }
        ], this.handleChangePrimitiveType);
    }

    selectPrimitive(primitive) {
        //lilox:TODO
        this.state.primitive = primitive;
    }

    removePrimitive(viewer, primitive) {
        viewer.scene.primitives.remove(primitive);
    }

    // ----------------------------------------------------------------------
    // event handlers (toolbar/menu/...)
    // ----------------------------------------------------------------------

    handleClear() {
        viewer = this.viewer;
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
        viewer.scene.primitives.removeAll();

        this.clearState();
    }

    handleChangePrimitiveType(e) {
        this.state.primitiveType = e.target.selectedIndex;
    }

    // ----------------------------------------------------------------------
    // create primitive
    // ----------------------------------------------------------------------

    handleCreatePrimitive(viewer) {
        const self = this;
        const camera = viewer.camera;
        const ellipsoid = viewer.scene.globe.ellipsoid;
        let dragging = false;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (event) {
                dragging = true;
                self.startCreatePrimitive(viewer, event.position);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (dragging)
                    self.updateCreatePrimitive(viewer, movement.endPosition);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function () {
                if (dragging) {
                    dragging = false;
                    self.endCreatePrimitive(viewer);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT
        );
    }

    startCreatePrimitive(viewer, mousePosition) {
        cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
        const center = viewer.camera.pickEllipsoid(mousePosition, viewer.scene.globe.ellipsoid);
        this.state.center = center;
        const primitive = cesiumTools.drawCirclePrimitive(viewer, center, 0);
        this.selectPrimitive(primitive)
    }

    updateCreatePrimitive(viewer, mousePosition) {
        //lilox:TODO (bounding rect)
        const cartesian = viewer.camera.pickEllipsoid(mousePosition, viewer.scene.globe.ellipsoid);
        this.updateCreateCircle(viewer, cartesian);
    }

    endCreatePrimitive(viewer) {
        //lilox:TODO - update redux store?
        cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
    }

    updateCreateCircle(viewer, pos) {
        const center = this.state.center;
        const xsquare = Math.pow(pos.x - center.x, 2);
        const ysquare = Math.pow(pos.y - center.y, 2);
        const radius = Math.sqrt(ysquare + xsquare);
        this.removePrimitive(viewer, this.state.primitive);
        const primitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
        this.selectPrimitive(primitive);
    }

    // ----------------------------------------------------------------------
    // move primitive
    // ----------------------------------------------------------------------

    handleMovePrimitives(viewer) {
        const self = this;
        const camera = viewer.camera;
        const scene = viewer.scene;
        const ellipsoid = viewer.scene.globe.ellipsoid;
        let picked = false;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(function (click) {
            const pickedObject = scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                picked = true;
                self.state.primitive = pickedObject.primitive;
                cesiumTools.enableDefaultEventHandlers(scene, false);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!picked)
                return;
            const position = camera.pickEllipsoid(movement.endPosition, ellipsoid);
            const boundingSphere = self.state.primitive._boundingSpheres[0];
            if (boundingSphere) {
                let radius = boundingSphere.radius;
                self.removePrimitive(viewer, self.state.primitive);
                const primitive = cesiumTools.drawCirclePrimitive(viewer, position, radius);
                self.selectPrimitive(primitive)
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            if (picked) {
                picked = false;
                self.endMovePrimitive(viewer);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        viewer.zoomTo(viewer.entities);
    }

    endMovePrimitive(viewer) {
        //lilox:TODO - update redux store?
        this.state.primitive = null;
        cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
