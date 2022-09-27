export function relativeMousePosition(_x, _y) {
    var new_x = 0;
    var new_y = 0;
    var currentPos = getCursorPosition();

    new_x = currentPos.x + _x;
    new_y = currentPos.y + _y;

    setCursorPosition({ x: new_x, y: new_y });
}