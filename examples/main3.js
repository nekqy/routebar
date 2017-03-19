var screens = [],
    width = 400,
    height = 400,
    n = 4,
    m = 4;

for (var i = 0; i < n; i++) {
    screens[i] = [];
    for (var j = 0; j < m; j++) {
        screens[i][j] = new rb.Screen({
            html:
            "<div style='width: " + width + "px; height: " + height + "px; background: " +
            "url(pic.jpg) " + (-i * width) + "px " + (-j * height) + "px;'>" +
            "</div>",
            isPermanent: true,
            defaultChildIndex: j,
            defaultParentIndex: j
        });
        if (i > 0) {
            screens[i][j].pushParents(screens[i-1]);
        }
    }
}

$('body').prepend('<div style="position: absolute; left: 100px; top: 100px; width: 400px; height: 400px;">' +
    '<div id="rb1" class="rb-wrapper"></div>' +
    '</div>');

rb.start({
    rb1: screens[0][0]
}, function(instances) {
    var cfg = {
            savePrevious: false,
            cyclicStep: false,
            correctEasing: 'linear'
            // correctTime: 500,
            // lockControls: true
        };
    rb.Batch.configure(cfg);
});
