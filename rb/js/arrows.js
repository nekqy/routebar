define([], function() {
    "use strict";

    function clearArrowTimeout(container) {
        container.toggleClass('rb__arrow-hide', false);
        container.toggleClass('rb__arrow-cursor', true);
        if (container.length) {
            clearTimeout(container[0].hideArrowId);
            container[0].hideArrowId = null;
        }
    }
    function hideArrowTimeout(container) {
        function hideArrow() {
            container.toggleClass('rb__arrow-hide', true);
            container.toggleClass('rb__arrow-cursor', false);
        }

        clearArrowTimeout(container);
        if (container.length) {
            container[0].hideArrowId = setTimeout(hideArrow, 3000);
        }
    }

    return function ($rb, actionFn) {
        $rb.append($(
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left">' +
            '<div class="rb__arrow rb__arrow_left"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top">' +
            '<div class="rb__arrow rb__arrow_top"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right">' +
            '<div class="rb__arrow rb__arrow_right"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom">' +
            '<div class="rb__arrow rb__arrow_bottom"></div>'
        ));

        var $rbArrowContainer = $rb.find('.rb__arrow-container');
        $rbArrowContainer.on('click', function(e) {
            var container = $(this);

            if (!container.is('.rb__arrow-hide')) {
                hideArrowTimeout(container);
                actionFn(container);
            } else {
                container.css('display', 'none');
                try {
                    var behindElem = document.elementFromPoint(e.clientX, e.clientY);
                    if (behindElem.tagName.toLowerCase() === 'iframe') {
                        var doc = behindElem.contentDocument || behindElem.contentWindow.document;
                        behindElem = doc.elementFromPoint(e.clientX, e.clientY);
                    }
                    $(behindElem).trigger(e);
                }
                finally {
                    container.css('display', '');
                }
            }
        });
        $rbArrowContainer.on('mouseenter', function() {
            hideArrowTimeout($(this));
        });
        $rbArrowContainer.on('mouseleave', function() {
            clearArrowTimeout($(this));
        });
    };

});
