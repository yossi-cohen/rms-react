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
                            currentPrimitive.rms = {
                                shape: 'circle'
                            }
                            break;
                        }

                    case 1: // box
                        {
                            const cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            dragStart = ellipsoid.cartesianToCartographic(cartesian);
                            let west, south, east, north;
                            west = south = east = north = dragStart.longitude;
                            currentPrimitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            currentPrimitive.rms = {
                                shape: 'rect',
                                location: { west: west, south: south, east: east, north: north }
                            }
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
                let rms = currentPrimitive.rms; // save it before removing primitive
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
                            currentPrimitive.rms = rms; // restore data
                            break;
                        }

                    case 1: // rect
                        {
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                            // Re-order so west < east and south < north
                            const west = Math.min(dragStart.longitude, dragEnd.longitude);
                            const east = Math.max(dragStart.longitude, dragEnd.longitude);
                            const south = Math.min(dragStart.latitude, dragEnd.latitude);
                            const north = Math.max(dragStart.latitude, dragEnd.latitude);

                            currentPrimitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            currentPrimitive.rms = rms; // restore data
                            currentPrimitive.rms.location = { west: west, south: south, east: east, north: north };
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
        let dragStart = null;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        const self = this;

        handler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                currentPrimitive = pickedObject.primitive;
                const cartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);
                dragStart = ellipsoid.cartesianToCartographic(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!currentPrimitive)
                return;

            switch (currentPrimitive.rms.shape) {
                case 'circle':
                default:
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const boundingSphere = currentPrimitive._boundingSpheres[0];
                        if (boundingSphere) {
                            let radius = boundingSphere.radius;
                            const orig_rms = currentPrimitive.rms;
                            viewer.scene.primitives.remove(currentPrimitive);
                            currentPrimitive = cesiumTools.drawCirclePrimitive(viewer, cartesian, radius);
                            currentPrimitive.rms = orig_rms;
                        }
                        break;
                    }

                case 'rect':
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                        // remove previous primitive (saving its location)
                        const orig_rms = currentPrimitive.rms;
                        viewer.scene.primitives.remove(currentPrimitive);

                        // re-calc new location
                        const new_location = {
                            west: currentPrimitive.rms.location.west + dragEnd.longitude - dragStart.longitude,
                            east: currentPrimitive.rms.location.east + dragEnd.longitude - dragStart.longitude,
                            south: currentPrimitive.rms.location.south + dragEnd.latitude - dragStart.latitude,
                            north: currentPrimitive.rms.location.north + dragEnd.latitude - dragStart.latitude
                        };

                        currentPrimitive = cesiumTools.drawBoxPrimitive(viewer,
                            new_location.west,
                            new_location.south,
                            new_location.east,
                            new_location.north);

                        currentPrimitive.rms = orig_rms;
                        currentPrimitive.rms.nextLocation = new_location; // we want to apply new location only on mouse-up
                        break;
                    }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            if (currentPrimitive) {
                currentPrimitive.rms.location = currentPrimitive.rms.nextLocation;
                currentPrimitive = null;
                dragStart = null;
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
