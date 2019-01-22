'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.genPoints = genPoints;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function genPoints(points, boundary) {
    var minX = boundary.minX,
        minY = boundary.minY,
        maxX = boundary.maxX,
        maxY = boundary.maxY;

    var normalisedPoints = points.map(function (item) {
        return typeof item === 'number' ? item : item.value;
    });
    var maxValue = Math.max.apply(Math, _toConsumableArray(normalisedPoints)) + 1;
    var minValue = Math.min.apply(Math, _toConsumableArray(normalisedPoints));
    if (minValue) minValue -= 1;
    var gridX = (maxX - minX) / (normalisedPoints.length - 1);
    var gridY = (maxY - minY) / (maxValue - minValue);
    return normalisedPoints.map(function (value, index) {
        return {
            x: index * gridX + minX,
            y: maxY - (value - minValue) * gridY + +(index === normalisedPoints.length - 1) * 0.00001 - +(index === 0) * 0.00001,
            value: value
        };
    });
}
//# sourceMappingURL=core.js.map