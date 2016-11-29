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
        let primitive = null;
        let dragStart = null; // cartographic
        const self = this;

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (event) {
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                switch (self.state.shape) {
                    case 0: // circle
                    default:
                        {
                            const center = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            primitive = cesiumTools.drawCirclePrimitive(viewer, center, 0);
                            primitive.rms = {
                                shape: 'circle',
                                circle: {
                                    center: center,
                                    radius: 0
                                }
                            }
                            break;
                        }

                    case 1: // box
                        {
                            const cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            dragStart = ellipsoid.cartesianToCartographic(cartesian);
                            let west, south, east, north;
                            west = south = east = north = dragStart.longitude;
                            primitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            primitive.rms = {
                                shape: 'rect',
                                rect: { west: west, south: south, east: east, north: north }
                            }
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function (movement) {
                if (!primitive)
                    return;
                // remove previous primitive while dragging
                let rms = primitive.rms; // save it before removing primitive
                viewer.scene.primitives.remove(primitive);

                // draw new primitive
                switch (self.state.shape) {
                    case 0: // circle
                    default:
                        {
                            // re-calc radius
                            const center = rms.circle.center;
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const xsquare = Math.pow(cartesian.x - center.x, 2);
                            const ysquare = Math.pow(cartesian.y - center.y, 2);
                            const radius = Math.sqrt(ysquare + xsquare);
                            primitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
                            rms.circle.radius = radius; // update radius
                            primitive.rms = rms; // restore data
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

                            primitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            primitive.rms = rms; // restore data
                            primitive.rms.rect = { west: west, south: south, east: east, north: north };
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        handler.setInputAction(
            function () {
                if (primitive) {
                    primitive = null;
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
        let primitive = null;
        let dragStart = null; // cartographic
        const self = this;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                primitive = pickedObject.primitive;
                const cartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);
                dragStart = ellipsoid.cartesianToCartographic(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!primitive)
                return;

            switch (primitive.rms.shape) {
                case 'circle':
                default:
                    {
                        const new_center = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        let radius = primitive.rms.circle.radius;
                        const orig_rms = primitive.rms;
                        viewer.scene.primitives.remove(primitive);
                        primitive = cesiumTools.drawCirclePrimitive(viewer, new_center, radius);
                        primitive.rms = orig_rms;
                        primitive.rms.circle.new_center = new_center
                        break;
                    }

                case 'rect':
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                        // remove previous primitive (saving its location)
                        const orig_rms = primitive.rms;
                        viewer.scene.primitives.remove(primitive);

                        // re-calc new rect
                        const new_rect = {
                            west: primitive.rms.rect.west + dragEnd.longitude - dragStart.longitude,
                            east: primitive.rms.rect.east + dragEnd.longitude - dragStart.longitude,
                            south: primitive.rms.rect.south + dragEnd.latitude - dragStart.latitude,
                            north: primitive.rms.rect.north + dragEnd.latitude - dragStart.latitude
                        };

                        primitive = cesiumTools.drawBoxPrimitive(viewer,
                            new_rect.west,
                            new_rect.south,
                            new_rect.east,
                            new_rect.north);

                        primitive.rms = orig_rms;
                        primitive.rms.new_rect = new_rect; // we want to apply new location only on mouse-up
                        break;
                    }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            if (primitive) {
                switch (primitive.rms.shape) {
                    case 'circle':
                        // commit the new center
                        primitive.rms.circle.center = primitive.rms.circle.new_center;
                        break;

                    case 'rect':
                        // commit the new rect
                        primitive.rms.rect = primitive.rms.new_rect;
                        break;
                }

                primitive = null;
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
