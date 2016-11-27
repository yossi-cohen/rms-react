import Cesium from "cesium/Cesium"

function getToolbarElement() {
    var toolbarElement = document.getElementsByClassName('cesium-viewer-toolbar')[0];
    return toolbarElement;
}

const cesiumTools = {
    declare() {
    },

    highlight() {
    },

    reset() {
    },

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
        // toolbarElement.insertBefore(button, toolbarElement.firstChild);
    },

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
    },

    // get ongitude, latitude, altitude from mouse position
    getLatLongAlt(viewer, mousePosition) {
        const scene = viewer.scene;
        const ellipsoid = scene.globe.ellipsoid;

        let pos = { longitude: 0, latitude: 0, altitude: 0 };

        const cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
        if (cartesian) {
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            pos.longitude = Cesium.Math.toDegrees(cartographic.longitude);
            pos.latitude = Cesium.Math.toDegrees(cartographic.latitude);

            // get height
            const ray = viewer.camera.getPickRay(mousePosition);
            const position = viewer.scene.globe.pick(ray, viewer.scene);
            if (Cesium.defined(position)) {
                const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                pos.altitude = cartographic.height;
            }
        }

        //lilox
        // console.log(
        //     '### longitude:', pos.longitude.toFixed(2),
        //     ', latitude:', pos.latitude.toFixed(2),
        //     ', height:', pos.altitude.toFixed(2));

        return pos;
    },

    // enable/disable cesium default event handlers
    enableDefaultEventHandlers(scene, state = true) {
        scene.screenSpaceCameraController.enableRotate = state;
        scene.screenSpaceCameraController.enableTranslate = state;
        scene.screenSpaceCameraController.enableZoom = state;
        scene.screenSpaceCameraController.enableTilt = state;
        scene.screenSpaceCameraController.enableLook = state;
    },
}

export default cesiumTools;
