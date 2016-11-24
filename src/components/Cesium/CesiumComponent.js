import React from 'react';
import Cesium from 'cesium/Source/Cesium.js';
import Box from 'react-layout-components'
import 'styles/cesium.css';
import 'assets/cesiumWidgets.css'

class CesiumComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickPositions: []
        }

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
        this.handleClick();
        // this.handleDrawPolygon();
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

        // home
        const latitude = 32.80;
        const longitude = 35.13;
        const height = 17.0;

        const west = longitude;
        const south = latitude;
        const east = longitude + 0.01;
        const north = latitude + 0.01;
        let extent = Cesium.Rectangle.fromDegrees(west, south, east, north);

        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

        return new Cesium.Viewer(this.refs.cesiumNode, cesiumViewerOptions);
    }

    handleClick() {
        // handle click
        let viewer = this.viewer;
        viewer.canvas.addEventListener('click', function (e) {
            let mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);

            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
            if (cartesian) {
                let cartographic = ellipsoid.cartesianToCartographic(cartesian);
                let longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                let latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

                console.log(longitudeString + ', ' + latitudeString);
            } else {
                console.log('Globe was not picked');
            }
        }, false);
    }

    //lilox
    // get coordinates (longitude, latitude, altitude) on mouse click:
    // You don't have to use Cesium.Math.toDegrees on the height, it is given in meters.
    // You can also use the ScreenSpaceEventHandler to handle the click event directly. 
    // Use ScreenSpaceEventType.LEFT_CLICK.  
    // Then, replace movement.endPosition with movement.position in the handler function.
    getCoordinates() {
        let ray = viewer.camera.getPickRay(movement.endPosition);
        let position = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(position)) {
            let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            let height = cartographic.height
        }
    }

    handleDrawPolygon() {
        //lilox:TODO
        let viewer = this.viewer;

        // let cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
        //     url: '//assets.agi.com/stk-terrain/world'
        // });
        // viewer.terrainProvider = cesiumTerrainProvider;
        // viewer.selectionIndicator = false;
        // viewer.baseLayerPicker = false;

        viewer.scene.globe.depthTestAgainstTerrain = true;

        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        let scene = viewer.scene;
        let camera = viewer.camera;
        let color;
        let colors = [];
        let polyline;
        let drawing = false;
        let positions = [];

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(
            function (click) {
                let pickedObject = scene.pick(click.position);
                let length = colors.length;
                let lastColor = colors[length - 1];
                let cartesian = scene.pickPosition(click.position);

                if (scene.pickPositionSupported && Cesium.defined(cartesian)) {
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    let altitude = cartographic.height;
                    let altitudeString = Math.round(altitude).toString();

                    viewer.entities.add({
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return [cartesian, Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 9.5)];
                            }, false),
                            width: 2
                        }
                    });
                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 10.0),
                        label: {
                            heightReference: 1,
                            text: altitudeString,
                            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -25.0),
                            scale: 0.75
                        }
                    });
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        handler.setInputAction(
            function (click) {
                if (drawing) {
                    reset(color, positions);
                } else {
                    polyline = viewer.entities.add({
                        polyline: {
                            positions: new Cesium.CallbackProperty(function () {
                                return positions;
                            }, false),
                            material: color,
                            width: 10
                        }
                    });
                }
                drawing = !drawing;
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(
            function (movement) {
                if (!movement || !movement.endPosition)
                    return;
                let pickedObject = scene.pick(movement.endPosition);
                console.log('lilox --- pickedObject:', pickedObject);
                if (!pickedObject)
                    return;
                let length = colors.length;
                let lastColor = colors[length - 1];
                let cartesian = scene.pickPosition(movement.endPosition);

                if (scene.pickPositionSupported && Cesium.defined(cartesian)) {
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                    // are we drawing on the globe
                    if (!Cesium.defined(pickedObject)) {
                        color = Cesium.Color.BLUE;

                        if (!Cesium.defined(lastColor) || !lastColor.equals(Cesium.Color.BLUE)) {
                            colors.push(Cesium.Color.BLUE);
                        }
                        if (drawing) {
                            if (Cesium.defined(lastColor) && lastColor.equals(Cesium.Color.BLUE)) {
                                positions.push(cartesian);
                            } else {
                                reset(lastColor, positions);
                                draw(color, positions);
                            }
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    pushColor(color, colors) {
        let lastColor = colors[colors.length - 1];
        if (!Cesium.defined(lastColor) || !color.equals(lastColor)) {
            colors.push(color);
        }
    }

    reset(color, currentPositions) {
        viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(function () {
                    return currentPositions;
                }, false),
                material: color,
                width: 10
            }
        });
        positions = [];
        viewer.entities.remove(polyline);
    }

    draw(color, currentPositions) {
        polyline = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(function () {
                    return currentPositions;
                }, false),
                material: color,
                width: 10
            }
        });
    }
}

export default CesiumComponent;
