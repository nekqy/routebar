// markups of screens
var
    mainScreenHtml = '<div class="mainScreen">mainScreen</div>',
    firstHtml = '<div class="child1">child1</div>',
    secondHtml = '<iframe width="100%" height="100%" frameborder="0" src="examples/example1.html"></iframe>',
    thirdHtml = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/pg5iRruqcps" frameborder="0" allowfullscreen></iframe>';

// main screen defining
var mainScreen = new rb.Screen(mainScreenHtml);

// children screens adding
var firstScreen = new rb.Screen(firstHtml),
    secondScreen = new rb.Screen(secondHtml),
    thirdScreen = new rb.Screen(thirdHtml, [mainScreen]);
mainScreen
    .addChild(firstScreen)
    .addChild(secondScreen)
    .addChild(thirdScreen);

// dynamic control of screens example
function action() {
    var newScreen = mainScreen.getChildren()[0];
    //var count = 0;
    function loadPage(resolve, reject) {
        $.get('examples/example2.html', function(data) {

            newScreen.addChild(newScreen = new rb.Screen(data));

            //if (++count >= 5) {
            //    inst.beforeMoveDispatcher.remove(index);
            //}
            resolve(true);
        }).fail(function() {
            var error = new Error('Данные не загружены');
            reject(error);
        });
    }
    return function (side, curScreen) {
        var promise;
        if (side === 'right' && curScreen === newScreen) {
            promise = new Promise(loadPage);
        }
        return promise;
    }
}

$.get('examples/example2.html', function(data) {
    var lastScreen = new rb.Screen(data);
    secondScreen.addChild(lastScreen);

    rb.Screen.setMainScreen(mainScreen);

    rb.start({
        rb1: firstScreen,
        rb2: secondScreen
    }, function(instances) {
        instances.rb1.beforeMoveDispatcher.add(action(), true);

        // for testing
        var sides = ['left', 'top', 'right', 'bottom'],
            cfg = {
                wrongTime1: 1500,
                wrongTime2: 1500,
                correctTime: 3000
            };
        instances.rb1.configure(cfg);
        instances.rb2.configure(cfg);
        instances.rb3.configure(cfg);
        instances.rb4.configure(cfg);
        function randomStep(side, curScreen, moving) {
            var index = Math.floor(Math.random()*4);
            moving.move(sides[index]).then(function(result){
                console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
            });
        }
        instances.rb1.afterRenderDispatcher.add(randomStep);
        instances.rb2.afterRenderDispatcher.add(randomStep);
        instances.rb3.afterRenderDispatcher.add(randomStep);
        instances.rb4.afterRenderDispatcher.add(randomStep);
        randomStep(undefined, undefined, instances.rb1);
        randomStep(undefined, undefined, instances.rb2);
        randomStep(undefined, undefined, instances.rb3);
        randomStep(undefined, undefined, instances.rb4);
    });
});
