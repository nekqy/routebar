define(['utils'], function(Utils) {
    "use strict";

    function IPlugin() {

    }

    IPlugin.prototype.configure = function() {
        throw new Error('Configure function not realized');
    };

    IPlugin.prototype.destroy = function() {
        throw new Error('Destroy function not realized');
    };

    IPlugin.inherite = function(module) {
        Utils.inherite(module, IPlugin);
    };

    return IPlugin;
});