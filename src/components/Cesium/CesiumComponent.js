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

// polygon
// <path d="M 9 0 C 7.8954305 0 7 0.8954305 7 2 C 7 2.4142136 7.1281013 2.8057979 7.34375 3.125 L 3.40625 9.03125 C 3.2760548 9.0046082 3.1380712 9 3 9 C 1.8954305 9 1 9.8954305 1 11 C 1 11.779178 1.4435038 12.451112 2.09375 12.78125 L 1.40625 20.09375 C 0.59211286 20.346973 0 21.102538 0 22 C 0 23.104569 0.8954305 24 2 24 C 2.8387825 24 3.5466906 23.482178 3.84375 22.75 L 13.15625 22.75 C 13.45331 23.482178 14.161218 24 15 24 C 16.104569 24 17 23.104569 17 22 C 17 21.635035 16.889508 21.294544 16.71875 21 L 21.46875 14.9375 C 21.637102 14.983508 21.817056 15 22 15 C 23.104569 15 24 14.104569 24 13 C 24 11.895431 23.104569 11 22 11 C 21.883046 11 21.7677 11.011987 21.65625 11.03125 L 18.625 6.1875 C 18.864768 5.8576669 19 5.4389712 19 5 C 19 3.8954305 18.104569 3 17 3 C 16.41534 3 15.896947 3.2562802 15.53125 3.65625 L 11 1.96875 C 10.983107 0.87876102 10.094011 0 9 0 z M 10.46875 3.34375 L 15 5.03125 C 15.016893 6.121239 15.905989 7 17 7 C 17.127513 7 17.254117 6.9915604 17.375 6.96875 L 20.40625 11.8125 C 20.158861 12.145356 20 12.553411 20 13 C 20 13.364965 20.110492 13.705456 20.28125 14 L 15.53125 20.0625 C 15.362898 20.016492 15.182944 20 15 20 C 14.161218 20 13.45331 20.517822 13.15625 21.25 L 3.84375 21.25 C 3.6619295 20.801858 3.3346896 20.436274 2.90625 20.21875 L 3.5625 12.90625 C 4.3911873 12.66197 5 11.907818 5 11 C 5 10.585786 4.8718987 10.194202 4.65625 9.875 L 8.59375 3.96875 C 8.7239452 3.9953918 8.8619288 4 9 4 C 9.5846598 4 10.103053 3.7437198 10.46875 3.34375 z" />

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

const initialState = {
    shape: SHAPES.CIRCLE,
    selectedPrimitive: null,
    value: SHAPES.BOX,
    shapeIcon: getShapeIcon(SHAPES.CIRCLE)
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
                this.selectPrimitive(this.viewer, this.state.selectedPrimitive, false);
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

        this.clearState();
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
                    self.remove(pickedPrimitive);
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
                            self.add(pickedPrimitive);
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
                            self.add(pickedPrimitive);
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
                    // update redux store
                    self.updateStore(pickedPrimitive);
                    pickedPrimitive = null;
                    dragStart = null;
                    cesiumTools.enableDefaultEventHandlers(viewer.scene, true);
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
        let objectMoved = false;
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

        // mouse-move
        handler.setInputAction(function (movement) {
            // move the primitive around
            if (!pickedPrimitive)
                return;
            objectMoved = true;

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
                        self.remove(pickedPrimitive);
                        pickedPrimitive = cesiumTools.drawCirclePrimitive(viewer, new_center, radius);
                        self.add(pickedPrimitive);
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
                        self.remove(pickedPrimitive);

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
                        self.add(pickedPrimitive);

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

                // update redux store
                if (objectMoved) {
                    let objectMoved = false;
                    self.updateStore(pickedPrimitive);
                }

                pickedPrimitive = null;
                dragStartCartographic = null;
                dragStartCartesian = null;
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
            this.remove(primitive._data.outline);
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
        this.remove(primitive);
        primitive = cesiumTools.drawCirclePrimitive(viewer, data.circle.center, data.circle.radius);
        this.add(primitive);
        primitive._data = data; // restore date
    }

    redrawBoxPrimitive(viewer, primitive) {
        const data = primitive._data; // hold date
        this.remove(primitive);
        primitive = cesiumTools.drawBoxPrimitive(viewer,
            data.rect.west,
            data.rect.south,
            data.rect.east,
            data.rect.north);
        this.add(primitive);
        primitive._data = data; // restore date
    }

    moveOutline(viewer, primitive) {
        if (!primitive._data.outline)
            return;
        // move the outline
        this.remove(primitive._data.outline);
        this.drawOutline(viewer, primitive);
    }
}

export default connect((store) => ({
    geoJson: store.search.query.geoJson,
}))(CesiumComponent);
