const {getCursorPosition, setCursorPosition, sendCursorEvent, cursorEvents} = require("node-cursor");

module.exports = {
    setRelativeMousePosition: function(_x, _y) {
        var current_x = getCursorPosition().x;
        var current_y = getCursorPosition().y;
        var next_x = current_x + _x;
        var next_y = current_y + _y;

        var nextPos = {
            x: next_x,
            y: next_y
        };

        setCursorPosition(nextPos);
    }
}