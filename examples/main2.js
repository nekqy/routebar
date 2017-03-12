var screens = [];
for (var i = 0; i < 4; i++) {
    var screenOptions = {
        html: '<div style="width: 100%; height: 100%;background: cornflowerblue;">' +
        '<p style="margin: 0">Example ' + i + ':</p>' +
        '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute">' +
        '<div style="width: 100px; height: 100px; position: absolute">' +
        '<div id="rb_inner' + i + '" class="rb-wrapper">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    };

    screens.push(new rb.Screen(screenOptions));
}
rb.Screen.setMainScreen(screens[0]);

var innerScreen = new rb.Screen('<div style="width: 100%; height: 100%; background: red;">INNER</div>');

rb.start(function() {
    screens[0]._isDirectedGraph = true;
    screens[0].pushChildren([screens[1], screens[2]]);
    screens[3].pushChildren([screens[0]]);

    rb.Instances.rb1.beforeMoveDispatcher.add(function () {
        !$('#rb_inner0').length && rb.remove('rb_inner0');
        !$('#rb_inner1').length && rb.remove('rb_inner1');
        !$('#rb_inner2').length && rb.remove('rb_inner2');
        !$('#rb_inner3').length && rb.remove('rb_inner3');
    });
    rb.Instances.rb1.afterRenderDispatcher.add(function () {
        rb.start({
            rb_inner0: innerScreen,
            rb_inner1: innerScreen,
            rb_inner2: innerScreen,
            rb_inner3: innerScreen
        });
    });
});