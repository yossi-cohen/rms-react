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
    }
}

export default cesiumTools;
