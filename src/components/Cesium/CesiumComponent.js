//lilox: select primitive, remove primitive (right-click)

import React from 'react';
import { connect } from "react-redux";
import Cesium from "cesium/Cesium"
import cesiumTools from './CesiumTools'
import Box from 'react-layout-components'
import 'assets/cesiumWidgets.css'
import 'styles/cesium.css';

const initialState = {
    shape: 0, // 0: circle, 1: box, 2: polygon
}

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    clearState() {
        this.setState(initialState);
        this.shapeMenu.selectedIndex = 0;
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
                <div ref="cesiumNode" id="cesiumContainer" className="cesium-viewer">
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
        this.shapeMenu = cesiumTools.addToolbarMenu([
            { text: 'circle', value: 'circle' },
            { text: 'rect', value: 'rect' },
            { text: 'polygon', value: 'polygon' }
        ], this.handleChangeShape.bind(this));
    }

    // ----------------------------------------------------------------------
    // event handlers (toolbar/menu/...)
    // ----------------------------------------------------------------------

    handleClear() {
        const viewer = this.viewer;
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
        viewer.scene.primitives.removeAll();

        this.clearState();
    }

    handleChangeShape(e) {
        this.setState({ shape: e.target.selectedIndex });
    }

    // ----------------------------------------------------------------------
    // create primitive
    // ----------------------------------------------------------------------

    handleCreatePrimitive(viewer) {
        const ellipsoid = viewer.scene.globe.ellipsoid;
        let dragging = false;
        let currentPrimitive = null;
        let center = null;
        let dragStart = null;
        let dragEnd = null;

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        const self = this;

        handler.setInputAction(
            function (event) {
                dragging = true;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                switch (self.state.shape) {
                    case 0: // circle
                    default:
                        {
                            center = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            currentPrimitive = cesiumTools.drawCirclePrimitive(viewer, center, 0);
                            break;
                        }

                    case 1: // box
                        {
                            const cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            dragStart = ellipsoid.cartesianToCartographic(cartesian);
                            currentPrimitive = cesiumTools.drawBoxPrimitive(viewer,
                                dragStart.longitude, dragStart.latitude,
                                dragStart.longitude, dragStart.latitude);
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (!dragging)
                    return;
                // remove previous primitive while dragging
                viewer.scene.primitives.remove(currentPrimitive);

                // draw new primitive
                switch (self.state.shape) {
                    case 0: // circle
                    default:
                        {
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const xsquare = Math.pow(cartesian.x - center.x, 2);
                            const ysquare = Math.pow(cartesian.y - center.y, 2);
                            const radius = Math.sqrt(ysquare + xsquare);
                            currentPrimitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
                            break;
                        }

                    case 1: // box
                        {
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                            let west, south, east, north;

                            if (dragStart.latitude >= dragEnd.latitude) {
                                if (dragStart.longitude <= dragEnd.longitude) {
                                    // (\.)
                                    west = dragStart.longitude;
                                    south = dragEnd.latitude;
                                    east = dragEnd.longitude;
                                    north = dragStart.latitude;
                                }
                                else {
                                    // (./)
                                    // dragStart.longitude > dragEnd.longitude
                                    west = dragEnd.longitude;
                                    south = dragEnd.latitude;
                                    east = dragStart.longitude;
                                    north = dragStart.latitude;
                                }
                            }
                            else {
                                // dragStart.latitude < dragEnd.latitude
                                if (dragStart.longitude <= dragEnd.longitude) {
                                    // (/^)
                                    west = dragStart.longitude;
                                    south = dragStart.latitude;
                                    east = dragEnd.longitude;
                                    north = dragEnd.latitude;
                                }
                                else {
                                    // dragStart.longitude > dragEnd.longitude
                                    // (^\)
                                    west = dragEnd.longitude;
                                    south = dragStart.latitude;
                                    east = dragStart.longitude;
                                    north = dragEnd.latitude;
                                }
                            }

                            currentPrimitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function () {
                if (dragging) {
                    dragging = false;
                    currentPrimitive = null;
                    center = null;
                    dragStart = null;
                    dragEnd = null;
                    cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
                    //lilox:TODO - update redux store?
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT
        );
    }

    // ----------------------------------------------------------------------
    // move primitive
    // ----------------------------------------------------------------------

    handleMovePrimitives(viewer) {
        const ellipsoid = viewer.scene.globe.ellipsoid;
        let picked = false;
        let currentPrimitive = null;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                currentPrimitive = pickedObject.primitive;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!currentPrimitive)
                return;
            const position = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            const boundingSphere = currentPrimitive._boundingSpheres[0];
            if (boundingSphere) {
                let radius = boundingSphere.radius;
                viewer.scene.primitives.remove(currentPrimitive);
                currentPrimitive = cesiumTools.drawCirclePrimitive(viewer, position, radius);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            if (currentPrimitive) {
                currentPrimitive = null;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
                //lilox:TODO - update redux store?
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        viewer.zoomTo(viewer.entities);
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
