
var
    child1 = new rb.Screen('<div class="child1">child1</div>'),
    child2 = new rb.Screen('<iframe width="100%" height="100%" frameborder="0" src="examples/example1.html"></iframe>'),
    child3 = new rb.Screen('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/pg5iRruqcps" frameborder="0" allowfullscreen></iframe>'),
    children = [child1, child2, child3],
    mainScreen2 = new rb.Screen('<div class="mainScreen">mainScreen2</div>', children),
    mainScreen = new rb.Screen('<div class="mainScreen">mainScreen</div>', children),
    dynamicScreen = child1,
    count = 0;

mainScreen.getChildren()[2].setChildren([mainScreen, mainScreen2]);


rb.start(mainScreen);

var index = rb.beforeMoveDispatcher.add(function(side, curScreen) {
    var promise;
    if (side === 'right' && curScreen === dynamicScreen) {
        promise = new Promise(function(resolve, reject) {
            $.get('examples/example2.html', function(data) {
                var children = curScreen.getChildren(),
                    newScreen = new rb.Screen(data);
                children.push(newScreen);
                curScreen.setChildren(children);
                dynamicScreen = newScreen;
                if (++count >= 5) {
                    rb.beforeMoveDispatcher.remove(index);
                }
                resolve(true);
            }).fail(function() {
                var error = new Error('Данные не загружены');
                //rb.beforeMoveDispatcher.remove(index);
                reject(error);
            });
        });
        return promise;
    }
    return null;
});
