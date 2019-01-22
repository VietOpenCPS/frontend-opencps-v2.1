var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
import { genPoints } from './helpers/core';
import { genPath as _genPath } from './helpers/path';
export default mixins(Colorable).extend({
    name: 'VSparkline',
    props: {
        autoDraw: Boolean,
        autoDrawDuration: {
            type: Number,
            default: 2000
        },
        autoDrawEasing: {
            type: String,
            default: 'ease'
        },
        color: {
            type: String,
            default: 'primary'
        },
        gradient: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        gradientDirection: {
            type: String,
            validator: function validator(val) {
                return ['top', 'bottom', 'left', 'right'].includes(val);
            },
            default: 'top'
        },
        height: {
            type: [String, Number],
            default: 75
        },
        labels: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        lineWidth: {
            type: [String, Number],
            default: 4
        },
        padding: {
            type: [String, Number],
            default: 8
        },
        smooth: {
            type: [Boolean, Number, String],
            default: false
        },
        showLabels: Boolean,
        value: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        width: {
            type: [Number, String],
            default: 300
        }
    },
    data: function data() {
        return {
            lastLength: 0
        };
    },
    computed: {
        boundary: function boundary() {
            var padding = Number(this.padding);
            var height = Number(this.height);
            var width = Number(this.width);
            return {
                minX: padding,
                minY: padding,
                maxX: width - padding,
                maxY: height - padding
            };
        },
        hasLabels: function hasLabels() {
            return Boolean(this.showLabels || this.labels.length > 0 || this.$scopedSlots.label);
        },
        parsedLabels: function parsedLabels() {
            var labels = [];
            var points = this.points;
            var len = points.length;
            for (var i = 0; labels.length < len; i++) {
                var item = points[i];
                var value = this.labels[i];
                if (!value) {
                    value = item === Object(item) ? item.value : item;
                }
                labels.push(_extends({}, item, {
                    value: String(value)
                }));
            }
            return labels;
        },
        points: function points() {
            return genPoints(this.value.slice(), this.boundary);
        },
        textY: function textY() {
            return this.boundary.maxY + 6;
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function handler() {
                var _this = this;

                this.$nextTick(function () {
                    if (!_this.autoDraw) return;
                    var path = _this.$refs.path;
                    var length = path.getTotalLength();
                    path.style.transition = 'none';
                    path.style.strokeDasharray = length + ' ' + length;
                    path.style.strokeDashoffset = Math.abs(length - (_this.lastLength || 0)).toString();
                    path.getBoundingClientRect();
                    path.style.transition = 'stroke-dashoffset ' + _this.autoDrawDuration + 'ms ' + _this.autoDrawEasing;
                    path.style.strokeDashoffset = '0';
                    _this.lastLength = length;
                });
            }
        }
    },
    methods: {
        genGradient: function genGradient() {
            var _this2 = this;

            var gradientDirection = this.gradientDirection;
            var gradient = this.gradient.slice();
            // Pushes empty string to force
            // a fallback to currentColor
            if (!gradient.length) gradient.push('');
            var len = Math.max(gradient.length - 1, 1);
            var stops = gradient.reverse().map(function (color, index) {
                return _this2.$createElement('stop', {
                    attrs: {
                        offset: index / len,
                        'stop-color': color || 'currentColor'
                    }
                });
            });
            return this.$createElement('defs', [this.$createElement('linearGradient', {
                attrs: {
                    id: this._uid,
                    x1: +(gradientDirection === 'left'),
                    y1: +(gradientDirection === 'top'),
                    x2: +(gradientDirection === 'right'),
                    y2: +(gradientDirection === 'bottom')
                }
            }, stops)]);
        },
        genLabels: function genLabels() {
            if (!this.hasLabels) return undefined;
            return this.$createElement('g', {
                style: {
                    fontSize: '8',
                    textAnchor: 'middle',
                    dominantBaseline: 'mathematical',
                    fill: 'currentColor'
                }
            }, this.parsedLabels.map(this.genText));
        },
        genPath: function genPath() {
            var radius = this.smooth === true ? 8 : Number(this.smooth);
            return this.$createElement('path', {
                attrs: {
                    id: this._uid,
                    d: _genPath(this.points.slice(), radius),
                    fill: 'none',
                    stroke: 'url(#' + this._uid + ')'
                },
                ref: 'path'
            });
        },
        genText: function genText(item, index) {
            var children = this.$scopedSlots.label ? this.$scopedSlots.label({ index: index, value: item.value }) : item.value;
            return this.$createElement('text', {
                attrs: {
                    x: item.x,
                    y: this.textY
                }
            }, [children]);
        }
    },
    render: function render(h) {
        if (this.value.length < 2) return undefined;
        return h('svg', this.setTextColor(this.color, {
            attrs: {
                'stroke-width': this.lineWidth || 1,
                width: '100%',
                height: '25%',
                viewBox: '0 0 ' + this.width + ' ' + this.height
            }
        }), [this.genGradient(), this.genLabels(), this.genPath()]);
    }
});
//# sourceMappingURL=VSparkline.js.map