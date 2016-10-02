define(['jquery', 'utils'], function($, Utils) {
    "use strict";
    var _width, _height;

    function smartResizeHandler() {
        var
            $window = $(window),
            bodyWidth = $window.width(),
            bodyHeight = $window.height();

        var
            $rb = $('#rb'),
            rbCenter = $('.rb__center'),
            rbLeft = $('.rb__left'),
            rbTop = $('.rb__top'),
            rbRight = $('.rb__right'),
            rbBottom = $('.rb__bottom'),
            newWidth, newHeight, scale;

        scale = Math.min(1, bodyWidth / _width, bodyHeight / _height);
        newWidth = _width * scale;
        newHeight = _height * scale;

        $rb.css({'width': newWidth, 'height': newHeight});
        rbCenter.css({'margin-left': newWidth, 'margin-top': newHeight});
        rbLeft.css({'margin-left': newWidth, 'margin-top': newHeight});
        rbTop.css({'margin-left': newWidth, 'margin-top': newHeight});
        rbRight.css({'margin-left': newWidth, 'margin-top': newHeight});
        rbBottom.css({'margin-left': newWidth, 'margin-top': newHeight});
    }

    // smartresize
    $.fn['smartresize'] = function(fn){
        return fn ? this.bind('resize', Utils.debounce(fn)) : this.trigger('smartresize');
    };

    $(window).smartresize(smartResizeHandler);

    return function initSmartResizer(width, height) {
        _width = width;
        _height = height;
        smartResizeHandler();
    };
});
