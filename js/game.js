
var game = new Phaser.Game(window.innerWidth - 15, window.innerHeight- 50, Phaser.Canvas, 'gameDiv', { preload: preload, 
    create: create, update: update, render: render });

var bmd;
var bmd2;

var colorAlphaDefault = 0.4;

var availableColors = [{hex: 0xff0000, rgba: 'rgba(255,0,0,'+ colorAlphaDefault +')'},
                       {hex: 0x00ff00, rgba: 'rgba(0,255,0,'+ colorAlphaDefault +')'},
                       {hex: 0xff00ff, rgba: 'rgba(255,0,255,'+ colorAlphaDefault +')'},
                       {hex: 0x0000ff, rgba: 'rgba(0,0,255,'+ colorAlphaDefault +')'},
                       {hex: 0xffff00, rgba: 'rgba(255,255,0,'+ colorAlphaDefault +')'}];

var currentColorIndex = 2;
var currentColorSprite;

var paletteButtons;

var toolButtons;

var isToolboxOpen = false;

function preload() {
    game.load.image('eraser', 'assets/eraser.png');
}

function render() {
}

function update() {
}

function create() {
    game.input.addPointer();
    game.input.addPointer();

    bmd = game.make.bitmapData(window.innerWidth, window.innerHeight);
    bmd.addToWorld();

    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, 'rgba(255,0,255,0.2)');

    game.input.addMoveCallback(paint, this);


    toolButtons = game.add.group();
    var eraser = game.add.sprite(0, 0, 'eraser');
    eraser.inputEnabled = true;
    eraser.events.onInputDown.add(selectTool, this);
    toolButtons.add(eraser);

    drawPalette();

    closeToolbox();
}

function drawPalette() {

    paletteButtons = game.add.group();

    for(var i = 0; i < availableColors.length; i++) {

        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(availableColors[i].hex, 1);
        graphics.drawRect(2, (60* i + 60), 50, 50);
        graphics.endFill();

        var button = game.add.sprite(2, 0, graphics.generateTexture());
        graphics.destroy();
        button.colorId = i;
        button.inputEnabled = true;

        button.events.onInputDown.add(chooseColor, this);
        paletteButtons.add(button);
    }

    paletteButtons.callAll('events.onInputDown.add', 'events.onInputDown', chooseColor);
    drawSelectedToolSprite(); 
}

function openToolbox() {

    for(var i = 0; i < paletteButtons.children.length; i++) {
        game.add.tween(paletteButtons.children[i]).to( { y: (i * 60) + 60 }, 500, Phaser.Easing.Quadratic.Out, true);
    }

    for(var i = 0; i < toolButtons.children.length; i++) {
        game.add.tween(toolButtons.children[i]).to( { x: (i * 60) + 60 }, 500, Phaser.Easing.Quadratic.Out, true);
    }

    isToolboxOpen = true;
}

function closeToolbox() {
    for(var i = 0; i < paletteButtons.children.length; i++) {
        game.add.tween(paletteButtons.children[i]).to( { y: 0}, 500, Phaser.Easing.Quadratic.Out, true);
    }

    for(var i = 0; i < toolButtons.children.length; i++) {
        game.add.tween(toolButtons.children[i]).to( { x: 0}, 500, Phaser.Easing.Quadratic.Out, true);
    }

    isToolboxOpen = false
}

function toggleToolbox() {
    if(isToolboxOpen){
        closeToolbox();
    }
    else {
        openToolbox();
    }
}

function drawSelectedToolSprite() {

    if(currentColorIndex !== -1) {
        //Draw the current color sprite
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xFFFFFF, 1);
        graphics.drawRect(-1, -1, 52, 52);
        graphics.beginFill(availableColors[currentColorIndex].hex, 1);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();

        currentColorSprite = game.add.sprite(0, 0, graphics.generateTexture());

        currentColorSprite.inputEnabled = true;
        currentColorSprite.events.onInputDown.add(toggleToolbox, this);

        graphics.destroy();
    }
    else //Draw eraser, since thats the only selectable tool we got for now
    {
        //Draw the current color sprite
        var graphics = game.add.graphics(1, 1);
        graphics.beginFill(0xFFFFFF, 1);
        graphics.drawRect(-1, -1, 52, 52);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, 50, 50);
        graphics.endFill();

        currentColorSprite = game.add.sprite(1, 1, 'eraser');
        currentColorSprite.inputEnabled = true;
        currentColorSprite.events.onInputDown.add(toggleToolbox, this);
    }
}

function chooseColor(button) {
    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, availableColors[button.colorId].rgba);

    currentColorIndex = button.colorId;
    drawSelectedToolSprite();
    closeToolbox();
}

function selectTool(button){
    if(button.key === "eraser"){
        bmd2 = game.make.bitmapData(128, 128);
        bmd2.circle(32, 32, 32, 'rgba(0, 0, 0, 1)');

        currentColorIndex = -1;
        drawSelectedToolSprite();
    }

    closeToolbox();
}

function paint(pointer, x, y) {

    if (pointer.isDown)
    {
        var pointerOverAnyButton = false;
        paletteButtons.forEach(function(button) {

            if(button.getBounds().contains(pointer.x, pointer.y)){
               pointerOverAnyButton = true;
            }
        }, this);

        toolButtons.forEach(function(button) {
            if(button.getBounds().contains(pointer.x, pointer.y)){
               pointerOverAnyButton = true;
            }
        }, this);

        if(currentColorSprite.input.pointerOver())
        {
            pointerOverAnyButton = true;
        }

        if(!pointerOverAnyButton){
            bmd.draw(bmd2, x - 16, y - 16);

            closeToolbox();
        }
    }
}

function paintCircle(x, y){
    bmd.draw(bmd2, x - 16, y - 16);
}
