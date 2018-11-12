'use strict';
module.exports = function(_) {
	if (_ === undefined) {
		_ = require('lodash').runInContext();
	}

	_.mixin(
		{
			bindKeyRight: function(context, key) {
				var args = _.toArray(arguments).slice(2);

				args.unshift(_.bindKey(context, key));

				return _.partialRight.apply(_, args);
			},

			bindRight: function(fn, context) {
				var args = _.toArray(arguments).slice(2);

				args.unshift(_.bind(fn, context));

				return _.partialRight.apply(_, args);
			}
		}
	);

	return _;
};