define(['utils', 'errors'], function(Utils, Errors) {
    "use strict";

    function IPlugin() {

    }

    IPlugin.prototype.configure = function() {
        throw new Errors.FatalError('Configure function not realized');
    };

    IPlugin.prototype.destroy = function() {
        throw new Errors.FatalError('Destroy function not realized');
    };

    IPlugin.inherite = function(module) {
        Utils.inherite(module, IPlugin);
    };

    return IPlugin;
});