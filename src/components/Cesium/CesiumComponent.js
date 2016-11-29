//lilox:TODO
// - select primitive
// - remove primitive (right-click)
// - Cesium.CallbackProperty

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

const SHAPES = {
    CIRCLE: 'circle',
    RECT: 'rect',
    POLYGON: 'polygon'
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
            { text: SHAPES.CIRCLE, value: SHAPES.CIRCLE },
            { text: SHAPES.RECT, value: SHAPES.RECT },
            { text: SHAPES.POLYGON, value: SHAPES.POLYGON }
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
                            primitive._data = {
                                shape: SHAPES.CIRCLE,
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
                            primitive._data = {
                                shape: SHAPES.RECT,
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
                let data = primitive._data; // save it before removing primitive
                viewer.scene.primitives.remove(primitive);

                // draw new primitive
                switch (self.state.shape) {
                    case 0: // circle
                    default:
                        {
                            // re-calc radius
                            const center = data.circle.center;
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const xsquare = Math.pow(cartesian.x - center.x, 2);
                            const ysquare = Math.pow(cartesian.y - center.y, 2);
                            const radius = Math.sqrt(ysquare + xsquare);
                            primitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
                            data.circle.radius = radius; // update radius
                            primitive._data = data; // restore data
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
                            primitive._data = data; // restore data
                            primitive._data.rect = { west: west, south: south, east: east, north: north };
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

            switch (primitive._data.shape) {
                case SHAPES.CIRCLE:
                default:
                    {
                        const new_center = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        let radius = primitive._data.circle.radius;
                        const orig_data = primitive._data;
                        viewer.scene.primitives.remove(primitive);
                        primitive = cesiumTools.drawCirclePrimitive(viewer, new_center, radius);
                        primitive._data = orig_data;
                        primitive._data.circle.new_center = new_center
                        break;
                    }

                case SHAPES.RECT:
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                        // remove previous primitive (saving its location)
                        const orig_data = primitive._data;
                        viewer.scene.primitives.remove(primitive);

                        // re-calc new rect
                        const longOffset = dragEnd.longitude - dragStart.longitude;
                        const latOffset = dragEnd.latitude - dragStart.latitude;

                        const orig_rect = primitive._data.rect;
                        const new_rect = {
                            west: orig_rect.west + longOffset,
                            east: orig_rect.east + longOffset,
                            south: orig_rect.south + latOffset,
                            north: orig_rect.north + latOffset
                        }

                        primitive = cesiumTools.drawBoxPrimitive(viewer,
                            new_rect.west,
                            new_rect.south,
                            new_rect.east,
                            new_rect.north);

                        primitive._data = orig_data;
                        primitive._data.new_rect = new_rect; // we want to apply new location only on mouse-up
                        break;
                    }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            if (primitive) {
                switch (primitive._data.shape) {
                    case SHAPES.CIRCLE:
                        // commit the new center
                        primitive._data.circle.center = primitive._data.circle.new_center;
                        break;

                    case SHAPES.RECT:
                        // commit the new rect
                        primitive._data.rect = primitive._data.new_rect;
                        break;
                }

                primitive = null;
                dragStart = null;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
                //lilox:TODO - update redux store?
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    // ----------------------------------------------------------------------
    // select primitive
    // ----------------------------------------------------------------------
    selectPrimitive(viewer, primitive, state) {
        //lilox:TODO
        if (state) {
            primitive._data.outline = drawOutline(viewer, primitive);
        }
        else {
            if (primitive._data.outline) {
                viewer.scene.primitives.remove(primitive._data.outline);
                primitive._data.outline = null;
                redrawPrimitive(viewer, primitive);
            }
        }
    }

    drawOutline(viewer, primitive) {
        switch (primitive._data.shape) {
            case SHAPES.CIRCLE:
                this.drawCircleOutline(viewer, primitive);
                break;
            case SHAPES.RECT:
                this.drawBoxOutline(viewer, primitive);
                break;
        }
    }

    drawCircleOutline(viewer, primitive) {
        const outline = cesiumTools.drawCircleOutline(viewer,
            primitive._data.circle.center,
            primitive._data.circle.radius);
        return outline;
    }

    drawBoxOutline(viewer, primitive) {
        const outline = cesiumTools.drawBoxOutline(viewer,
            primitive._data.rect);
        return outline;
    }

    redrawPrimitive(viewer, primitive) {
        switch (primitive._data.shape) {
            case SHAPES.CIRCLE:
                this.redrawCirclePrimitive(viewer, primitive);
                break;
            case SHAPES.RECT:
                this.redrawBoxPrimitive(viewer, primitive);
                break;
        }
    }

    redrawCirclePrimitive(viewer, primitive) {
        const data = primitive._data; // hold date
        viewer.scene.primitives.remove(primitive);
        primitive = cesiumTools.drawCirclePrimitive(viewer, data.circle.center, data.circle.radius);
        primitive._data = data; // restore date
    }

    redrawBoxPrimitive(viewer, primitive) {
        const data = primitive._data; // hold date
        viewer.scene.primitives.remove(primitive);
        primitive = cesiumTools.drawBoxPrimitive(viewer,
            data.rect.west,
            data.rect.south,
            data.rect.east,
            data.rect.north);
        primitive._data = data; // restore date
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
