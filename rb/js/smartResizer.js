define(['jquery', 'utils'], function($, Utils) {
    "use strict";
    var _width, _height, _mainDiv;

    function smartResizeHandler() {
        var
            $window = $(window),
            bodyWidth = $window.width(),
            bodyHeight = $window.height(),
            rbCenter = _mainDiv.find('.rb__center'),
            rbLeft = _mainDiv.find('.rb__left'),
            rbTop = _mainDiv.find('.rb__top'),
            rbRight = _mainDiv.find('.rb__right'),
            rbBottom = _mainDiv.find('.rb__bottom'),
            newWidth, newHeight, scale;

        scale = Math.min(1, bodyWidth / _width, bodyHeight / _height);
        newWidth = _width * scale;
        newHeight = _height * scale;

        _mainDiv.css({'width': newWidth, 'height': newHeight});
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

    return function initSmartResizer(mainDiv, width, height) {
        if (mainDiv instanceof $) {
            _mainDiv = mainDiv;
        } else {
            throw new Error('SmartResizer module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
            _width = width;
            _height = height;
            smartResizeHandler();
        } else {
            throw new Error('SmartResizer module - init - wrong args, width: ' + width + ', height: ' + height);
        }
    };
});
