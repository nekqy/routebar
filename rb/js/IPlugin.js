define([], function() {
    "use strict";

    function IPlugin() {

    }

    IPlugin.prototype.configure = function() {
        throw new Error('Configure function not realized');
    };

    return IPlugin;
});