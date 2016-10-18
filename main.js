
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

    // configuring
    function prepare() {
        // dynamic control of screens example
        function action() {
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
        var newScreen = mainScreen.getChildren()[0];

        rb.rb1.configure({
            startScreen: firstScreen
        });
        rb.rb2.configure({
            startScreen: secondScreen
        });
        rb.rb1.beforeMoveDispatcher.add(action(), true);
        rb.rb2.beforeMoveDispatcher.add(action());

        // for testing
        var sides = ['left', 'top', 'right', 'bottom'],
            cfg = {
                wrongTime1: 1500,
                wrongTime2: 1500,
                correctTime: 3000
            };
        rb.rb1.configure(cfg);
        rb.rb2.configure(cfg);
        rb.rb3.configure(cfg);
        rb.rb4.configure(cfg);
        function randomStep(side, curScreen, moving) {
            var index = Math.floor(Math.random()*4);
            moving.move(sides[index]).then(function(result){
                console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
            });
            if (side !== 'center') {
                return false;
            }
        }
        rb.rb1.afterRenderDispatcher.add(randomStep);
        rb.rb2.afterRenderDispatcher.add(randomStep);
        rb.rb3.afterRenderDispatcher.add(randomStep);
        rb.rb4.afterRenderDispatcher.add(randomStep);
    }

    //rb.Screen.setMainScreen(mainScreen);
    rb.prepare(prepare);
