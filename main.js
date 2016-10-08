    // BASIC

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

    // configuring.
    rb.configure({
        startScreen: mainScreen
    });

    // ADVANCED

    // dynamic control of screens example
    function loadPage(resolve, reject) {
        $.get('examples/example2.html', function(data) {

            newScreen.addChild(newScreen = new rb.Screen(data));

            if (++count >= 5) {
                rb.beforeMoveDispatcher.remove(index); // action unregistration
            }
            resolve(true);
        }).fail(function() {
            var error = new Error('Данные не загружены');
            reject(error);
        });
    }
    function action(side, curScreen) {
        var promise;
        if (side === 'right' && curScreen === newScreen) {
            promise = new Promise(loadPage);
        }
        return promise;
    }
    var count = 0,
        newScreen = mainScreen.getChildren()[0],
        index = rb.beforeMoveDispatcher.add(action); // action registration

    // for testing
    //var sides = ['left', 'top', 'right', 'bottom'];
    //rb.afterRenderDispatcher.add(function(side) {
    //    var index = Math.floor(Math.random()*4);
    //    rb.move(sides[index]).then(function(result){
    //        console.log(result.how, result.isOk, 'moved to ' + sides[index], result.isOk ? 'successfully' : 'failed')
    //    });
    //    if (side !== 'center') {
    //        return false;
    //    }
    //});