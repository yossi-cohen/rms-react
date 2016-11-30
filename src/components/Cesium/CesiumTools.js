import Cesium from "cesium/Cesium"

function getToolbarElement() {
    var toolbarElement = document.getElementsByClassName('cesium-viewer-toolbar')[0];
    return toolbarElement;
}

const COLOR_PRIMITIVE = new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN.withAlpha(0.5));
const COLOR_OUTLINE = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOWGREEN);

class CesiumTools {
    constructor() {
    }

    declare() {
    }

    highlight() {
    }

    reset() {
    }

    addToolbarButton(text, onclick) {
        var button = document.createElement('button');
        button.className = 'cesium-button';
        button.type = 'button';
        button.textContent = text;
        button.onclick = function () {
            cesiumTools.reset();
            cesiumTools.highlight(onclick);
            onclick();
        };

        var toolbarElement = getToolbarElement();
        toolbarElement.appendChild(button);
    }

    addToolbarMenu(options, onchange) {
        var menu = document.createElement('select');
        menu.className = 'cesium-button';
        menu.onchange = onchange;

        var toolbarElement = getToolbarElement();
        toolbarElement.appendChild(menu);

        for (var i = 0, len = options.length; i < len; ++i) {
            var option = document.createElement('option');
            option.textContent = options[i].text;
            option.value = options[i].value;
            menu.appendChild(option);
        }

        return menu;
    }

    // get ongitude, latitude, altitude from mouse position
    getLatLongAlt(viewer, windowPosition) {
        const scene = viewer.scene;
        const ellipsoid = scene.globe.ellipsoid;

        let pos = { x: 0, y: 0, z: 0 };

        const cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
        if (cartesian) {
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            pos.x = Cesium.Math.toDegrees(cartographic.longitude);
            pos.y = Cesium.Math.toDegrees(cartographic.latitude);

            // get height
            const ray = viewer.camera.getPickRay(windowPosition);
            const position = viewer.scene.globe.pick(ray, viewer.scene);
            if (Cesium.defined(position)) {
                const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                pos.z = cartographic.height;
            }
        }

        return pos;
    }

    // enable/disable cesium default event handlers
    enableDefaultEventHandlers(scene, state = true) {
        scene.screenSpaceCameraController.enableRotate = state;
        scene.screenSpaceCameraController.enableTranslate = state;
        scene.screenSpaceCameraController.enableZoom = state;
        scene.screenSpaceCameraController.enableTilt = state;
        scene.screenSpaceCameraController.enableLook = state;
    }

    setCesiumHome(latitude, longitude) {
        const west = longitude;
        const south = latitude;
        const east = longitude + 0.01;
        const north = latitude + 0.01;
        let extent = Cesium.Rectangle.fromDegrees(west, south, east, north);

        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
    }

    drawCirclePrimitive(viewer, center, radius) {
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center: center,
                radius: radius,
            }),
            attributes: {
                color: COLOR_PRIMITIVE
            },
            id: 'circle'
        });

        const primitive = new Cesium.Primitive({
            name: 'circle',
            geometryInstances: instance,
            asynchronous: false,
            appearance: new Cesium.PerInstanceColorAppearance()
        });

        viewer.scene.primitives.add(primitive);
        return primitive;
    }

    drawCircleOutlinePrimitive(viewer, center, radius) {
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.CircleOutlineGeometry({
                center: center,
                radius: radius,
            }),
            attributes: {
                color: COLOR_OUTLINE
            },
            id: 'circle-outline'
        });

        const primitive = new Cesium.Primitive({
            name: 'circle-outline',
            geometryInstances: instance,
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

    drawBoxPrimitive(viewer, west, south, east, north) {
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
                ellipsoid: Cesium.Ellipsoid.WGS84,
                rectangle: { west, south, east, north },
            }),
            attributes: {
                color: COLOR_PRIMITIVE
            },
            id: 'box'
        });

        const primitive = new Cesium.Primitive({
            name: 'box',
            geometryInstances: instance,
            asynchronous: false,
            appearance: new Cesium.PerInstanceColorAppearance()
        });

        viewer.scene.primitives.add(primitive);
        return primitive;
    }

    drawBoxEntity(viewer, west, south, east, north) {
        return viewer.entities.add({
            name: 'box',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
                material: Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.RED
            }
        });
    }

    drawBoxOutlinePrimitive(viewer, west, south, east, north) {
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleOutlineGeometry({
                ellipsoid: Cesium.Ellipsoid.WGS84,
                rectangle: { west, south, east, north },
            }),
            attributes: {
                color: COLOR_OUTLINE
            },
            id: 'box-outline'
        });

        const primitive = new Cesium.Primitive({
            name: 'box-outline',
            geometryInstances: instance,
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
}

const cesiumTools = new CesiumTools();
export default cesiumTools;
