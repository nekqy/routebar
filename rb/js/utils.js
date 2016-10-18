define([], function() {
    "use strict";

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    function debounce(func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }

    function oppositeSide(side) {
        if (side === 'left') return 'right';
        if (side === 'right') return 'left';
        if (side === 'top') return 'bottom';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Error('move function', 'wrong side');
    }
    function getStartSide(side) {
        if (side === 'left') return 'left';
        if (side === 'right') return 'left';
        if (side === 'top') return 'top';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Error('move function', 'wrong side');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function setMixin(base, mixin) {
        for(var key in mixin) {
            if (mixin.hasOwnProperty(key)) {
                base.prototype[key] = mixin[key];
            }
        }
    }
    function inherite(parent, child) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }

    return {
        debounce: debounce,
        oppositeSide: oppositeSide,
        getStartSide: getStartSide,
        capitalizeFirstLetter: capitalizeFirstLetter,
        nop: function() {},
        setMixin: setMixin,
        inherite: inherite
    };
});