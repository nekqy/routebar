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

mainScreen.pushChildren([firstScreen, secondScreen, thirdScreen]);

// dynamic markup loading
$.get('example3.html', function(data) {
    // attach loaded content as child for secondScreen
    var lastScreen = new rb.Screen(data);
    secondScreen.pushChildren(lastScreen);

    // panel initializing
    rb.start({
        rb1: firstScreen
    }, function(instances) {
        // panel configuring
        var cfg = {
            wrongTime1: 500,
            wrongTime2: 500,
            correctTime: 1000
        };
        rb.Batch.configure(cfg);

        // dynamic control of screens example
        function action() {
            var newScreen = mainScreen.getChild(0);
            function loadPage(resolve, reject) {
                $.get('example2.html', function(data) {
                    newScreen.pushChildren(newScreen = new rb.Screen(data));
                    resolve(true);
                }).fail(function() {
                    var error = new Error('Data not loaded');
                    reject(error);
                });
            }
            return function (side, moving, isWrongStep) {
                var promise;
                if (side === 'right' && isWrongStep) {
                    promise = new Promise(loadPage);
                }
                return promise;
            }
        }
        // register html loading function as handler. move function will start when handler is ended.
        // 'true' argument means that handler is executed only once.
        instances.rb1.beforeMoveDispatcher.add(action(), true);

        // // automatic moving for testing
        // var sides = ['left', 'top', 'right', 'bottom'];
        // function randomStep(side, moving) {
        //     var index = Math.floor(Math.random()*4);
        //     moving.move(sides[index]).then(function(result){
        //         console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
        //     });
        // }
        // for (var id in instances) {
        //     if (instances.hasOwnProperty(id)) {
        //         instances[id].afterRenderDispatcher.add(randomStep);
        //     }
        // }
    });
});
