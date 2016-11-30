//lilox:TODO
// - remove primitive (right-click)
// - Cesium.CallbackProperty

import React from 'react';
import { connect } from "react-redux";
import Cesium from "cesium/Cesium"
import cesiumTools from './CesiumTools'
import Box from 'react-layout-components'
import 'assets/cesiumWidgets.css'
import 'styles/cesium.css';

const SHAPES = {
    CIRCLE: 'circle',
    BOX: 'box'
}

const initialState = {
    shape: SHAPES.CIRCLE,
    selectedPrimitive: null
}

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    clearState() {
        this.setState(initialState);
        if (this.shapeMenu)
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
        this.handleClear();

        this.createControls(this.viewer);
        this.handleCreatePrimitive(this.viewer);
        this.handleMovePrimitives(this.viewer);
        this.handleSelectPrimitives(this.viewer);
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
            { text: SHAPES.BOX, value: SHAPES.BOX },
        ], this.handleChangeShape.bind(this));
    }

    //lilox:TODO
    geoJson() {
        const viewer = this.viewer;

        let geoJson = {
            "type": "GeometryCollection",
            "geometries": [
            ]
        };

        const primitives = viewer.scene.primitives;
        for (let i = 0; i < primitives.length; i++) {
            let primitive = primitives.get(i);
            if (primitive._data) {
                switch (primitive._data.shape) {
                    case SHAPES.CIRCLE:
                        geoJson.geometries.push(this.circleToGeoJson(primitive._data.circle.center, primitive._data.circle.radius));
                        break;
                    case SHAPES.BOX:
                        geoJson.geometries.push(this.boxToGeoJson(primitive._data.rect));
                        break;
                }
            }
        }

        return geoJson;
    }

    //lilox:TODO
    circleToGeoJson(center, radius) {
        const geoJson = {
            "type": "Circle",
            "geometry": {
                "center": [center.x, center.y],
                "radius": radius
            }
        };

        return geoJson;
    }

    boxToGeoJson(rect) {
        const geoJson = {
            "type": "Polygon",
            "coordinates": [
                [[rect.west.x, rect.west.y], [rect.south.x, rect.south.y], [rect.east.x, rect.east.y], [rect.north.x, rect.north.y]]
            ]
        };

        return geoJson;
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
        this.setState({ shape: e.target.value });
    }

    // ----------------------------------------------------------------------
    // create primitive
    // ----------------------------------------------------------------------

    handleCreatePrimitive(viewer) {
        let pickedPrimitive = null;
        let dragging = false;
        let dragStart = null; // cartographic
        let data = null;
        const self = this;

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        const ellipsoid = viewer.scene.globe.ellipsoid;

        // shift + left-down
        handler.setInputAction(
            function (event) {
                dragging = true;

                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                switch (self.state.shape) {
                    case SHAPES.CIRCLE:
                        {
                            const center = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            data = {
                                shape: SHAPES.CIRCLE,
                                circle: {
                                    center: center,
                                    radius: 0
                                }
                            }
                            break;
                        }

                    case SHAPES.BOX:
                        {
                            const cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);
                            dragStart = ellipsoid.cartesianToCartographic(cartesian);
                            let west, south, east, north;
                            west = south = east = north = dragStart.longitude;
                            data = {
                                shape: SHAPES.BOX,
                                rect: { west: west, south: south, east: east, north: north }
                            }
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        // shift + mouse-move
        handler.setInputAction(
            function (movement) {
                if (!dragging)
                    return;

                if (pickedPrimitive) {
                    // remove previous primitive while dragging
                    data = pickedPrimitive._data; // save it before removing primitive
                    viewer.scene.primitives.remove(pickedPrimitive);
                }

                // draw new primitive
                switch (self.state.shape) {
                    case SHAPES.CIRCLE:
                        {
                            // re-calc radius
                            const center = data.circle.center;
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const xsquare = Math.pow(cartesian.x - center.x, 2);
                            const ysquare = Math.pow(cartesian.y - center.y, 2);
                            const radius = Math.sqrt(ysquare + xsquare);
                            pickedPrimitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
                            data.circle.radius = radius; // update radius
                            pickedPrimitive._data = data; // restore data
                            break;
                        }

                    case SHAPES.BOX:
                        {
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                            // Re-order so west < east and south < north
                            const west = Math.min(dragStart.longitude, dragEnd.longitude);
                            const east = Math.max(dragStart.longitude, dragEnd.longitude);
                            const south = Math.min(dragStart.latitude, dragEnd.latitude);
                            const north = Math.max(dragStart.latitude, dragEnd.latitude);

                            pickedPrimitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            pickedPrimitive._data = data; // restore data
                            pickedPrimitive._data.rect = { west: west, south: south, east: east, north: north };
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        // shift + left-up
        handler.setInputAction(
            function () {
                dragging = false;
                if (pickedPrimitive) {
                    self.selectPrimitive(viewer, pickedPrimitive, true);
                    pickedPrimitive = null;
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
        let pickedPrimitive = null;
        let dragStartCartographic = null;
        let dragStartCartesian = null;
        const self = this;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        const ellipsoid = viewer.scene.globe.ellipsoid;

        // left-down
        handler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);

                self.selectPrimitive(viewer, pickedObject.primitive, true);
                pickedPrimitive = self.state.selectedPrimitive; // select re-creates primitive argument

                dragStartCartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);
                dragStartCartographic = ellipsoid.cartesianToCartographic(dragStartCartesian);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        //lilox:TODO - use redrawPrimitive?
        // mouse-move
        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!pickedPrimitive)
                return;

            switch (pickedPrimitive._data.shape) {
                case SHAPES.CIRCLE:
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        // calculate offset of center
                        const deltaX = cartesian.x - dragStartCartesian.x;
                        const deltaY = cartesian.y - dragStartCartesian.y;
                        const deltaZ = cartesian.z - dragStartCartesian.z;
                        const new_center = {
                            x: pickedPrimitive._data.circle.center.x + deltaX,
                            y: pickedPrimitive._data.circle.center.y + deltaY,
                            z: pickedPrimitive._data.circle.center.z + deltaZ
                        }

                        let radius = pickedPrimitive._data.circle.radius;
                        const orig_data = pickedPrimitive._data;
                        viewer.scene.primitives.remove(pickedPrimitive);
                        pickedPrimitive = cesiumTools.drawCirclePrimitive(viewer, new_center, radius);
                        pickedPrimitive._data = orig_data;
                        pickedPrimitive._data.circle.new_center = new_center; // we apply new location on mouse-up
                        self.moveOutline(viewer, pickedPrimitive);
                        break;
                    }

                case SHAPES.BOX:
                    {
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                        // remove previous primitive (saving its location)
                        const orig_data = pickedPrimitive._data;
                        viewer.scene.primitives.remove(pickedPrimitive);

                        // re-calc new rect
                        const longOffset = dragEnd.longitude - dragStartCartographic.longitude;
                        const latOffset = dragEnd.latitude - dragStartCartographic.latitude;

                        const orig_rect = pickedPrimitive._data.rect;
                        const new_rect = {
                            west: orig_rect.west + longOffset,
                            east: orig_rect.east + longOffset,
                            south: orig_rect.south + latOffset,
                            north: orig_rect.north + latOffset
                        }

                        pickedPrimitive = cesiumTools.drawBoxPrimitive(viewer,
                            new_rect.west,
                            new_rect.south,
                            new_rect.east,
                            new_rect.north);

                        pickedPrimitive._data = orig_data;
                        pickedPrimitive._data.new_rect = new_rect; // we apply new location on mouse-up
                        self.moveOutline(viewer, pickedPrimitive);
                        break;
                    }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // left-up
        handler.setInputAction(function (movement) {
            if (pickedPrimitive) {
                switch (pickedPrimitive._data.shape) {
                    case SHAPES.CIRCLE:
                        // commit the new center
                        if (pickedPrimitive._data.circle.new_center) {
                            pickedPrimitive._data.circle.center = pickedPrimitive._data.circle.new_center;
                            pickedPrimitive._data.circle.new_center = null;
                        }
                        break;

                    case SHAPES.BOX:
                        // commit the new rect
                        if (pickedPrimitive._data.new_rect) {
                            pickedPrimitive._data.rect = pickedPrimitive._data.new_rect;
                            pickedPrimitive._data.new_rect = null;
                        }
                        break;
                }

                pickedPrimitive = null;
                dragStartCartographic = null;
                dragStartCartesian = null;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
                //lilox:TODO - update redux store?
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    // ----------------------------------------------------------------------
    // select primitive
    // ----------------------------------------------------------------------

    handleSelectPrimitives(viewer) {
        const self = this;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        // left-click
        handler.setInputAction(function (click) {
            // remove any previous selection
            if (self.state.selectedPrimitive) {
                self.selectPrimitive(viewer, self.state.selectedPrimitive, false);
            }

            // select if clicked on object
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                // select pickedObject 
                self.selectPrimitive(viewer, pickedObject.primitive, true);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    selectPrimitive(viewer, primitive, state = true) {
        if (state) {
            if (this.state.selectedPrimitive)
                this.removeOutline(viewer, this.state.selectedPrimitive);
            this.drawOutline(viewer, primitive);
            this.state.selectedPrimitive = primitive;
        }
        else {
            this.removeOutline(viewer, primitive);
            this.state.selectedPrimitive = null;
        }

        return this.state.selectedPrimitive;
    }

    removeOutline(viewer, primitive) {
        if (primitive._data.outline) {
            viewer.scene.primitives.remove(primitive._data.outline);
            primitive._data.outline = null;
        }
    }

    drawOutline(viewer, primitive) {
        switch (primitive._data.shape) {
            case SHAPES.CIRCLE:
                return this.drawCircleOutline(viewer, primitive);
            case SHAPES.BOX:
                return this.drawBoxOutline(viewer, primitive);
        }
    }

    drawCircleOutline(viewer, primitive) {
        const center = primitive._data.circle.new_center ? primitive._data.circle.new_center : primitive._data.circle.center;
        const radius = primitive._data.circle.radius;
        const outline = cesiumTools.drawCircleOutlinePrimitive(viewer, center, radius);
        primitive._data.outline = outline;
        return outline;
    }

    drawBoxOutline(viewer, primitive) {
        const rect = primitive._data.new_rect ? primitive._data.new_rect : primitive._data.rect;
        const outline = cesiumTools.drawBoxOutlinePrimitive(viewer, rect.west, rect.south, rect.east, rect.north);
        primitive._data.outline = outline;
        return outline;
    }

    redrawPrimitive(viewer, primitive) {
        switch (primitive._data.shape) {
            case SHAPES.CIRCLE:
                this.redrawCirclePrimitive(viewer, primitive);
                break;
            case SHAPES.BOX:
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

    moveOutline(viewer, primitive) {
        if (!primitive._data.outline)
            return;
        // move the outline
        viewer.scene.primitives.remove(primitive._data.outline);
        this.drawOutline(viewer, primitive);
    }
}

export default connect((store) => ({
    cesium: store.search.query.cesium,
}))(CesiumComponent);
