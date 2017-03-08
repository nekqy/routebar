// markups of screens
var
    mainScreenHtml = '<div class="mainScreen">mainScreen</div>',
    firstHtml = '<div class="child1">child1</div>',
    secondHtml = '<iframe width="100%" height="100%" frameborder="0" src="examples/example1.html"></iframe>',
    thirdHtml = '<iframe width="100%" height="100%" frameborder="0" src="examples/example1.html"></iframe>';

// main screen defining
var mainScreen = new rb.Screen(mainScreenHtml);

// children screens adding
var firstScreen = new rb.Screen(firstHtml),
    secondScreen = new rb.Screen(secondHtml),
    thirdScreen = new rb.Screen(thirdHtml, [mainScreen]);
mainScreen
    .pushChild(firstScreen)
    .pushChild(secondScreen)
    .pushChild(thirdScreen);

// dynamic control of screens example
function action() {
    var newScreen = mainScreen.getChild(0);
    //var count = 0;
    function loadPage(resolve, reject) {
        $.get('examples/example2.html', function(data) {

            newScreen.pushChild(newScreen = new rb.Screen(data));

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
    secondScreen.pushChild(lastScreen);

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
        rb.Batch.configure(cfg);
        function randomStep(side, curScreen, moving) {
            var index = Math.floor(Math.random()*4);
            moving.move(sides[index]).then(function(result){
                console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
            });
        }
        for (var id in instances) {
            if (instances.hasOwnProperty(id)) {
                instances[id].afterRenderDispatcher.add(randomStep);
                randomStep(undefined, undefined, instances[id]);

                (function (){
                    var inst = instances[id];
                    require(['./smartResizer'], function(SmartResizer) {
                        var smartResizer = new SmartResizer(inst._mainDiv);
                        inst.addPlugin(smartResizer);
                        setTimeout(function() {
                            inst.removePlugin(smartResizer);
                        }, 60000);
                    });
                })();
            }
        }
    });
});
