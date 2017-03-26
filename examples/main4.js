// markups of screens
var
    mainScreenHtml = '<div class="mainScreen">mainScreen</div>',
    firstHtml = '<div class="child1">child1</div>',
    secondHtml = '<div class="child2">child2</div>',
    thirdHtml = '<iframe width="100%" height="100%" frameborder="0" src="example1.html"></iframe>';

// main screen defining
var mainScreen = new rb.Screen(mainScreenHtml);

// children screens adding
var firstScreen = new rb.Screen(firstHtml),
    secondScreen = new rb.Screen(secondHtml),
    thirdScreen = new rb.Screen(thirdHtml, [mainScreen]);
mainScreen
    .pushChildren(firstScreen)
    .pushChildren(secondScreen)
    .pushChildren(thirdScreen);

$.get('example2.html', function(data) {
    var lastScreen = new rb.Screen(data);
    secondScreen.pushChildren(lastScreen);

    rb.Screen.setMainScreen(mainScreen);

    rb.start({
        rb1: firstScreen,
        rb2: secondScreen
    }, function(instances) {
        // for testing
        var sides = ['left', 'top', 'right', 'bottom'],
            cfg = {
                wrongTime1: 1500,
                wrongTime2: 1500,
                correctTime: 3000
            };
        function randomStep(side, moving) {
            var index = Math.floor(Math.random()*4);
            moving.move(sides[index]).then(function(result){
                console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
            });
        }
        for (var id in instances) {
            if (instances.hasOwnProperty(id)) {
                instances[id].configure(cfg);
                instances[id].afterRenderDispatcher.add(randomStep);
            }
        }
    });
});
