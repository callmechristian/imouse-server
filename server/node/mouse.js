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
    },

    sendMouseLeftClick: function() {
        var currentPosition = getCursorPosition();
        sendCursorEvent({
            event: cursorEvents.LEFT_DOWN,
            data: 0,
            x: currentPosition.x,
            y: currentPosition.y
        });
        sendCursorEvent({
            event: cursorEvents.LEFT_UP,
            data: 0,
            x: currentPosition.x,
            y: currentPosition.y
        });
    },

    sendMouseRightClick: function() {
        var currentPosition = getCursorPosition();
        sendCursorEvent({
            event: cursorEvents.RIGHT_DOWN,
            data: 0,
            x: currentPosition.x,
            y: currentPosition.y
        });
        sendCursorEvent({
            event: cursorEvents.RIGHT_UP,
            data: 0,
            x: currentPosition.x,
            y: currentPosition.y
        });
    },

    scrollEvent: function(disp_y) {
        var currentPosition = getCursorPosition();
        sendCursorEvent({
            event: cursorEvents.WHEEL,
            data: disp_y, //amount of wheel movement
            x: currentPosition.x,
            y: currentPosition.y
        });
    },

    setMousePosition: function(x, y) {
        // console.log("Set cursor y to:" + y);
        setCursorPosition({
            x: x,
            y: y
        })
    }
}