define([], function() {
    "use strict";

    function IPlugin() {

    }

    IPlugin.prototype.configure = function() {
        throw new Error('Configure function not realized');
    };

    IPlugin.prototype.destroy = function() {
        throw new Error('Destroy function not realized');
    };

    return IPlugin;
});