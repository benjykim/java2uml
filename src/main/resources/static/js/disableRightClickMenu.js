function disableRightClickContextMenu(element) {
    element.addEventListener('contextmenu', function(e) {
        if (e.button == 2) {
            // Block right-click menu thru preventing default action.
            e.stopPropagation();
            e.preventDefault();
        }
    });
}

// Once the page is loaded, disable the right click menu of the canvas.
$(document).ready(function() {
    disableRightClickContextMenu(document.getElementsByTagName('canvas')[0]);
});