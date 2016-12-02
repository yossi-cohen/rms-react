import React from 'react';
import { connect } from "react-redux";
import { actions } from 'react-redux-form';
import Cesium from "cesium/Cesium"
import cesiumTools from './CesiumTools'
import Box from 'react-layout-components'
import 'assets/cesiumWidgets.css'
import 'styles/cesium.css';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';

import { SelectField, MenuItem, IconMenu, IconButton, SvgIcon, FlatButton } from 'material-ui';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';

const SHAPES = {
    CIRCLE: 'circle',
    BOX: 'box',
    POLYGON: 'polygon'
}

const styles = {
    shapeSelectWidth: {
        width: 100,
    },
    icon: {
        width: 16,
        height: 16,
    }
};

const CircleIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </SvgIcon>
);

const RectIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" />
    </SvgIcon>
);

const PolygonIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M16.839 4l4.857 8.5-4.857 8.5h-9.678l-4.857-8.5 4.857-8.5h9.678zm1.161-2h-12l-6 10.5 6 10.5h12l6-10.5-6-10.5z" />
    </SvgIcon>
);

function getShapeIcon(value) {
    switch (value) {
        case SHAPES.CIRCLE:
        default:
            return <CircleIcon style={styles.icon} stroke="white" fill="white" strokeWidth="3" hoverColor="blue" />;
        case SHAPES.BOX:
            return <RectIcon style={styles.icon} stroke="white" fill="white" strokeWidth="3" hoverColor="blue" />;
        case SHAPES.POLYGON:
            return <PolygonIcon style={styles.icon} stroke="white" fill="white" strokeWidth="3" hoverColor="blue" />;
    }
}

const defaultShape = SHAPES.CIRCLE;
const initialState = {
    shape: defaultShape,
    selectedPrimitive: null,
    shapeIcon: getShapeIcon(defaultShape)
}

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    // ----------------------------------------------------------------------
    // rendering
    // ----------------------------------------------------------------------

    //lilox
    // shouldComponentUpdate() {
    //     return false;
    // }

    componentDidMount() {
        window.CESIUM_BASE_URL = '/cesium/';
        Cesium.BingMapsApi.defaultKey = 'AlrnjpmA4KiONSspH1oyt38LOXi3FXPhf8Iy3jDyuzXnIv-DEMGGaiJdyikzFArD';
        this.viewer = this.createCesiumViewer();
        this.handleClear();

        this.handleCreatePrimitive(this.viewer);
        this.handleMovePrimitives(this.viewer);
        this.handleSelectPrimitives(this.viewer);
    }

    componentWillUnmount() {
        if (this.screenSpaceEventHandler)
            this.screenSpaceEventHandler.destroy();
        if (this.viewer)
            this.viewer.destroy();
    }

    render() {
        return (
            <div>
                <Box width={500} height={300} justifyContent="center" alignItems="flex-start" alignSelf="center">
                    <div ref="cesiumNode" id="cesiumContainer" className="cesium-viewer">
                        <div className='toolbar-left'>
                            <IconMenu
                                iconButtonElement={<IconButton title='select shape' >{this.state.shapeIcon}</IconButton>}
                                onItemTouchTap={this.handleShapeSelected.bind(this)}
                                >
                                <MenuItem value={SHAPES.CIRCLE} primaryText={SHAPES.CIRCLE} leftIcon={<CircleIcon />} />
                                <MenuItem value={SHAPES.BOX} primaryText={SHAPES.BOX} leftIcon={<RectIcon />} />
                                <MenuItem value={SHAPES.POLYGON} primaryText={SHAPES.POLYGON} leftIcon={<PolygonIcon />} />
                            </IconMenu>

                            <IconButton iconStyle={{ color: 'white' }} tooltip="delete shape" onClick={this.handleDeleteShape.bind(this)}>
                                <ActionDelete />
                            </IconButton>

                            <IconButton iconStyle={{ color: 'white' }} tooltip="remove all" onClick={this.handleClear.bind(this)}>
                                <ActionDeleteForever />
                            </IconButton>
                        </div>
                    </div>
                </Box>
            </div>
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

    add(primitive) {
        //lilox:TODO
    }

    remove(primitive) {
        if (primitive) {
            if (primitive == this.state.selectedPrimitive)
                this.removeSelection(this.viewer, primitive); // remove selection if selected
            this.viewer.scene.primitives.remove(primitive);
        }
    }

    updateStore(geoJson) {
        this.props.dispatch(actions.change('query.geoJson', this.geoJson()));
    }

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
                        geoJson.geometries.push(this.circleToGeoJson(primitive._data.center, primitive._data.radius));
                        break;
                    case SHAPES.BOX:
                        geoJson.geometries.push(this.boxToGeoJson(primitive._data.rect));
                        break;
                }
            }
        }

        return geoJson;
    }

    //lilox:TODO - geojson doesn't have 'Circle'
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
        this.setState(initialState);
    }

    handleDeleteShape(e) {
        this.remove(this.state.selectedPrimitive);
    }

    handleShapeSelected(event, child) {
        const value = child.props.value;
        this.setState({
            shape: value,
            shapeIcon: getShapeIcon(value)
        });
    }

    // ----------------------------------------------------------------------
    // create primitive
    // ----------------------------------------------------------------------

    handleCreatePrimitive(viewer) {
        let pickedPrimitive = null; // primitive we are currently drawing
        let data = null; // data for cuurent primitive

        let dragging = false; // true while left-down
        let dragStart = null; // cartographic of drag start

        const self = this;

        const ellipsoid = viewer.scene.globe.ellipsoid;

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.screenSpaceEventHandler = handler; // used for later destroy

        // shift + left-down
        handler.setInputAction(
            function (event) {
                dragging = true;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);
                const cartesian = viewer.camera.pickEllipsoid(event.position, ellipsoid);

                switch (self.state.shape) {
                    // shift + left-down
                    case SHAPES.CIRCLE:
                        {
                            data = {
                                shape: SHAPES.CIRCLE,
                                center: cartesian,
                                radius: 0
                            }
                            break;
                        }

                    // shift + left-down
                    case SHAPES.BOX:
                        {
                            dragStart = ellipsoid.cartesianToCartographic(cartesian);
                            data = {
                                shape: SHAPES.BOX,
                                rect: {
                                    west: dragStart.longitude,
                                    south: dragStart.latitude,
                                    east: dragStart.longitude,
                                    north: dragStart.latitude
                                }
                            }
                            break;
                        }

                    // shift + left-down
                    case SHAPES.POLYGON: {
                        if (!data) {
                            // polygon first point
                            data = {
                                shape: SHAPES.POLYGON,
                                points: [cartesian]
                            }
                        }
                        else {
                            // update data (add this point to the polygon)
                            data.points.push(cartesian);

                            // redraw polygon
                            if (pickedPrimitive)
                                self.remove(pickedPrimitive);
                            pickedPrimitive = cesiumTools.drawPolygonPrimitive(viewer, data.points);
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.SHIFT
        );

        // shift + mouse-move
        handler.setInputAction(
            function (movement) {
                if (!data)
                    return;

                switch (data.shape) {
                    // mouse-move
                    case SHAPES.CIRCLE:
                        {
                            if (!dragging)
                                return;

                            if (pickedPrimitive) {
                                // remove primitive (we draw a new one)
                                self.remove(pickedPrimitive);
                                pickedPrimitive = null;
                            }

                            // re-calc radius
                            const center = data.center;
                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const xsquare = Math.pow(cartesian.x - center.x, 2);
                            const ysquare = Math.pow(cartesian.y - center.y, 2);
                            const radius = Math.sqrt(ysquare + xsquare);

                            // update data
                            data.radius = radius;

                            // redraw primitive
                            pickedPrimitive = cesiumTools.drawCirclePrimitive(viewer, center, radius);
                            self.add(pickedPrimitive);
                            break;
                        }

                    // mouse-move
                    case SHAPES.BOX:
                        {
                            if (!dragging)
                                return;

                            if (pickedPrimitive) {
                                // remove primitive (we draw a new one)
                                self.remove(pickedPrimitive);
                                pickedPrimitive = null;
                            }

                            const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                            // Re-order so west < east and south < north
                            const west = Math.min(dragStart.longitude, dragEnd.longitude);
                            const east = Math.max(dragStart.longitude, dragEnd.longitude);
                            const south = Math.min(dragStart.latitude, dragEnd.latitude);
                            const north = Math.max(dragStart.latitude, dragEnd.latitude);

                            // update data
                            data.rect = { west: west, south: south, east: east, north: north };

                            // redraw primitive
                            pickedPrimitive = cesiumTools.drawBoxPrimitive(viewer, west, south, east, north);
                            self.add(pickedPrimitive);
                            break;
                        }

                    // mouse-move
                    case SHAPES.POLYGON: {
                        if (data.points.length < 2)
                            return;

                        if (pickedPrimitive) {
                            // remove primitive (we draw a new one)
                            self.remove(pickedPrimitive);
                            pickedPrimitive = null;
                        }

                        // copy points (we add current point to the copy)
                        var tmpPoints = data.points.slice();
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        tmpPoints.push(cartesian);
                        pickedPrimitive = cesiumTools.drawPolygonPrimitive(viewer, tmpPoints);
                        break;
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT
        );

        // shift + left-up
        handler.setInputAction(
            function () {
                if (!data)
                    return;

                dragging = false;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
                if (!pickedPrimitive)
                    return;

                switch (data.shape) {
                    case SHAPES.CIRCLE:
                    case SHAPES.BOX:
                        pickedPrimitive._data = data;
                        self.selectPrimitive(viewer, pickedPrimitive); // select after create
                        self.updateStore(pickedPrimitive);
                        pickedPrimitive = null;
                        dragStart = null;
                        data = null;
                        break;

                    case SHAPES.POLYGON:
                        // polygon creation ends after double-click (see below)
                        break;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.SHIFT
        );

        // shift + left-doubleclick
        // (ends polygon drawing)
        handler.setInputAction(
            function () {
                if (!data)
                    return;

                switch (data.shape) {
                    case SHAPES.POLYGON:
                        {
                            // finish polygon
                            pickedPrimitive._data = data;
                            self.selectPrimitive(viewer, pickedPrimitive); // select after create
                            pickedPrimitive = null;
                            data = null;
                            break;
                        }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK, Cesium.KeyboardEventModifier.SHIFT
        );
    }

    // ----------------------------------------------------------------------
    // move primitive
    // ----------------------------------------------------------------------

    handleMovePrimitives(viewer) {
        let pickedPrimitive = null;
        let movingSelectedPrimitive = false;
        let moveStartCartographic = null;
        let moveStartCartesian = null;
        let objectHasMoved = false; // flag indicating whether or not to update object location to store.
        const self = this;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        const ellipsoid = viewer.scene.globe.ellipsoid;

        // left-down (record move start position)
        handler.setInputAction(function (click) {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                cesiumTools.enableDefaultEventHandlers(viewer.scene, false);

                moveStartCartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);
                moveStartCartographic = ellipsoid.cartesianToCartographic(moveStartCartesian);
                pickedPrimitive = pickedObject.primitive;
                movingSelectedPrimitive = pickedObject.primitive == self.state.selectedPrimitive;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // mouse-move (move the primitive around)
        handler.setInputAction(function (movement) {
            if (!pickedPrimitive)
                return;
            objectHasMoved = true;

            switch (pickedPrimitive._data.shape) {
                // mouse-move (move the primitive around)
                case SHAPES.CIRCLE:
                    {
                        // currnet move position
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

                        // remove primitive (saving its data)
                        const orig_data = pickedPrimitive._data;
                        self.remove(pickedPrimitive);

                        // calc move offset
                        const deltaX = cartesian.x - moveStartCartesian.x;
                        const deltaY = cartesian.y - moveStartCartesian.y;
                        const deltaZ = cartesian.z - moveStartCartesian.z;

                        // re-calc position
                        let radius = orig_data.radius;
                        const new_center = {
                            x: orig_data.center.x + deltaX,
                            y: orig_data.center.y + deltaY,
                            z: orig_data.center.z + deltaZ
                        }

                        pickedPrimitive = cesiumTools.drawCirclePrimitive(viewer, new_center, radius);
                        self.add(pickedPrimitive);
                        pickedPrimitive._data = orig_data;
                        pickedPrimitive._data.new_center = new_center; // we apply new location on mouse-up
                        if (movingSelectedPrimitive)
                            self.selectPrimitive(viewer, pickedPrimitive);
                        break;
                    }

                // mouse-move (move the primitive around)
                case SHAPES.BOX:
                    {
                        // currnet move position
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        const dragEnd = ellipsoid.cartesianToCartographic(cartesian);

                        // remove primitive (saving its data)
                        const orig_data = pickedPrimitive._data;
                        self.remove(pickedPrimitive);

                        // calc move offset
                        const longOffset = dragEnd.longitude - moveStartCartographic.longitude;
                        const latOffset = dragEnd.latitude - moveStartCartographic.latitude;

                        // re-calc position
                        const new_rect = {
                            west: orig_data.rect.west + longOffset,
                            east: orig_data.rect.east + longOffset,
                            south: orig_data.rect.south + latOffset,
                            north: orig_data.rect.north + latOffset
                        }

                        pickedPrimitive = cesiumTools.drawBoxPrimitive(viewer,
                            new_rect.west,
                            new_rect.south,
                            new_rect.east,
                            new_rect.north);
                        self.add(pickedPrimitive);

                        pickedPrimitive._data = orig_data;
                        pickedPrimitive._data.new_rect = new_rect; // we apply new location on mouse-up
                        if (movingSelectedPrimitive)
                            self.selectPrimitive(viewer, pickedPrimitive);
                        break;
                    }

                // mouse-move (move the primitive around)
                case SHAPES.POLYGON:
                    {
                        // currnet move position
                        const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

                        // remove primitive (saving its data)
                        const orig_data = pickedPrimitive._data;
                        self.remove(pickedPrimitive);

                        // calc move offset
                        const offsetX = cartesian.x - moveStartCartesian.x;
                        const offsetY = cartesian.y - moveStartCartesian.y;
                        const offsetZ = cartesian.z - moveStartCartesian.z;

                        // re-calc position
                        let new_points = [];
                        for (let i = 0; i < orig_data.points.length; i++) {
                            new_points.push(
                                {
                                    x: orig_data.points[i].x + offsetX,
                                    y: orig_data.points[i].y + offsetY,
                                    z: orig_data.points[i].z + offsetZ
                                });
                        }

                        pickedPrimitive = cesiumTools.drawPolygonPrimitive(viewer, new_points);
                        self.add(pickedPrimitive);

                        pickedPrimitive._data = orig_data;
                        pickedPrimitive._data.new_points = new_points; // we apply new location on mouse-up
                        if (movingSelectedPrimitive)
                            self.selectPrimitive(viewer, pickedPrimitive);
                        break;
                    }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // left-up
        handler.setInputAction(function (movement) {
            if (pickedPrimitive) {
                switch (pickedPrimitive._data.shape) {
                    // left-up
                    case SHAPES.CIRCLE:
                        // commit the new position
                        if (pickedPrimitive._data.new_center) {
                            pickedPrimitive._data.center = pickedPrimitive._data.new_center;
                            pickedPrimitive._data.new_center = null;
                        }
                        break;

                    // left-up
                    case SHAPES.BOX:
                        // commit the new position
                        if (pickedPrimitive._data.new_rect) {
                            pickedPrimitive._data.rect = pickedPrimitive._data.new_rect;
                            pickedPrimitive._data.new_rect = null;
                        }
                        break;

                    // left-up
                    case SHAPES.POLYGON:
                        // commit the new position
                        if (pickedPrimitive._data.new_points) {
                            pickedPrimitive._data.points = pickedPrimitive._data.new_points;
                            pickedPrimitive._data.new_points = null;
                        }
                        break;
                }

                // update redux store
                if (objectHasMoved) {
                    objectHasMoved = false;
                    self.updateStore(pickedPrimitive);
                }

                // reset local state
                pickedPrimitive = null;
                movingSelectedPrimitive = false;
                moveStartCartographic = null;
                moveStartCartesian = null;
                cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
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
            if (self.state.selectedPrimitive)
                self.removeSelection(viewer, self.state.selectedPrimitive);

            // select if clicked on object
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                // select pickedObject 
                self.selectPrimitive(viewer, pickedObject.primitive); // select when object clicked
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    selectPrimitive(viewer, primitive) {
        if (this.state.selectedPrimitive)
            this.removeSelection(viewer, this.state.selectedPrimitive);
        this.drawOutline(viewer, primitive);
        this.state.selectedPrimitive = primitive;
    }

    removeSelection(viewer, primitive) {
        this.removeOutline(viewer, primitive);
        this.state.selectedPrimitive = null;
    }

    removeOutline(viewer, primitive) {
        if (primitive._data.outline) {
            this.remove(primitive._data.outline);
            primitive._data.outline = null;
        }
    }

    moveOutline(viewer, primitive) {
        if (primitive._data.outline) {
            this.remove(primitive._data.outline);
            this.drawOutline(viewer, primitive);
        }
    }

    drawOutline(viewer, primitive) {
        switch (primitive._data.shape) {
            case SHAPES.CIRCLE:
                return this.drawCircleOutline(viewer, primitive);
            case SHAPES.BOX:
                return this.drawBoxOutline(viewer, primitive);
            case SHAPES.POLYGON:
                return this.drawPolygonOutline(viewer, primitive);
        }
    }

    drawCircleOutline(viewer, primitive) {
        const center = primitive._data.new_center ? primitive._data.new_center : primitive._data.center;
        const radius = primitive._data.radius;
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

    drawPolygonOutline(viewer, primitive) {
        const points = primitive._data.new_points ? primitive._data.new_points : primitive._data.points;
        const outline = cesiumTools.drawPolygonOutlinePrimitive(viewer, points);
        primitive._data.outline = outline;
        return outline;
    }
}

export default connect((store) => ({
    geoJson: store.search.query.geoJson,
}))(CesiumComponent);
