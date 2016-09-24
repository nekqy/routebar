var
    children = [
        new rb.Screen('<div class="child1">child1</div>'),
        new rb.Screen('<iframe width="100%" height="100%" frameborder="0" src="examples/example1.html"></iframe>'),
        new rb.Screen('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/pg5iRruqcps" frameborder="0" allowfullscreen></iframe>')
    ],
    mainScreen2 = new rb.Screen('<div class="mainScreen">mainScreen2</div>', children),
    mainScreen = new rb.Screen('<div class="mainScreen">mainScreen</div>', children);

mainScreen.getChildren()[2].setChildren([mainScreen, mainScreen2]);

//rb.start(mainScreen);
