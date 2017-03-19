# documentation

A visual component for navigating between panel cells containing user content. 

- [NPM](https://www.npmjs.com/package/routebar) `npm install routebar`.
- Bower `bower install routebar`.

## Examples

- [Example 1](https://nekqy.github.io/routebar/examples/index.html) - simple graph
- [Example 2](https://nekqy.github.io/routebar/examples/index2.html) - panel inside the panel
- [Example 3](https://nekqy.github.io/routebar/examples/index3.html) - move in the picture
- [Example 4](https://nekqy.github.io/routebar/examples/index4.html) - multiple panels

## Build 

To compile RouteBar by yourself:

1) Clone the repository

	git clone https://github.com/nekqy/routebar.git

2) Go inside the RouteBar folder that you fetched and install Node dependencies. I use Node v.5.11
because of node v.6 show me "fs: re-evaluating native module sources is not supported".

	cd routebar/rb && npm install

3) Run `npm run build` to generate the JS and CSS files in the `rb/dist` folder. Also it generates jsdoc in the `docs/jsdoc` folder. 

	npm run build
	
4) Run `npm run test` to run tests and generate coverage in the `docs/coverage` folder.

	npm run test
	
## User Guide

Add an element with class 'rb-wrapper' to your page. 'data-id' or 'id' attribute contains name of adding panel.

    $('body').html('' +
    '<div style="position: fixed; left: 100px; top: 100px; width: 300px; height: 300px;">' +
    '<div id="rb1" class="rb-wrapper"></div>' +
    '</div>');

Create an instance of the content model (screen).

    var screen = new rb.Screen('<div style="width: 100%; height: 100%; background: #6af;">some markup</div>');

Run the panel initialization.

The default content model is not specified, so by default the first created model will be taken.
It will be added to the panel as the start model.

    rb.start();
 
The panel is already initialized inside the callback function and you can additionally configure it.

    rb.start(function() {...});

For example, 'maxHistoryLength' option configured. All options you can found [here](https://nekqy.github.io/routebar/docs/jsdoc/Moving.html#~config).

    var f = function(){
        rb.Instances.rb1.configure({maxHistoryLength: 5});
    }
    rb.start(f);
    
Make the connections between the models and then you can navigate between these models in the panel.

    var screen2 = new rb.Screen('<div style="width: 100%; height: 100%; background: #fa6;">some markup</div>');
    screen.pushChild(screen2);

You can also configure start model for the panel, when calling panel initialization.

    rb.start({ rb1: screen2 }, f);

## License

MIT

## About

RouteBar is developed by [Andrey Shipin](http://vk.com/andrey_shipin). 

## Bugs & contributing

Please report bugs via GitHub. Feel free to submit commit [pull-request](https://github.com/nekqy/routebar/pulls), even the tiniest contributions to the script or to the documentation are very welcome.

