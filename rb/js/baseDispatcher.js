define([], function() {
    "use strict";

    function BaseDispatcher(loadingDiv) {
        this._actions = {};
        this._index = 0;
        this._loadingDiv = $(loadingDiv);
    }
    BaseDispatcher.prototype.add = function(action, once) {
        if (typeof action === 'function') {
            this._actions[this._index++] = {
                action: action,
                once: once
            };
            return this._index-1;
        }
        return null;
    };
    BaseDispatcher.prototype.remove = function(index) {
        if (this._actions.hasOwnProperty(index)) {
            delete this._actions[index];
        }
    };
    BaseDispatcher.prototype._runActions = function(fn, actionArgs) {
        var
            actions = [],
            results = [],
            self = this;

        if (Object.keys(this._actions).length) {
            $('#rb').append(this._loadingDiv);

            Object.keys(this._actions).map(function(index) {
                var value = this._actions[index],
                    result = value.action.apply(undefined, actionArgs);

                if (value.once) {
                    delete this._actions[index];
                }
                if (result instanceof Promise) {
                    actions.push(result);
                } else {
                    results.push(result);
                }
            }.bind(this));

            Promise.all(actions).then(function(promiseResult) {
                self._loadingDiv.remove();

                var isOk = results.concat(promiseResult).every(function(res) {
                    return res !== false;
                });
                if (isOk) {
                    fn();
                }
            }, function(error) {
                self._loadingDiv.remove();
                console.error(error);

                var isOk = results.every(function(res) {
                    return res !== false;
                });
                if (isOk) {
                    fn();
                }
            });
        } else {
            fn();
        }
    };

    return BaseDispatcher;
});