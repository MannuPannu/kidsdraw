
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

var isPaletteOpen = false;

function preload() {
}

function render() {
}

function update() {
}

function create() {

    bmd = game.make.bitmapData(window.innerWidth, window.innerHeight);
    bmd.addToWorld();

    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, 'rgba(255,0,255,0.2)');

    game.input.addMoveCallback(paint, this);

    drawPalette();

    // //Animate the paletteButtons
    closePalette();
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
    drawCurrentColorSprite(); 
}

function openPalette() {
    for(var i = 0; i < paletteButtons.children.length; i++) {
        game.add.tween(paletteButtons.children[i]).to( { y: (i * 60) + 60 }, 500, Phaser.Easing.Quadratic.Out, true);
    }
    isPaletteOpen = true;
}

function closePalette() {
    for(var i = 0; i < paletteButtons.children.length; i++) {
        game.add.tween(paletteButtons.children[i]).to( { y: 0}, 500, Phaser.Easing.Quadratic.Out, true);
    }
    isPaletteOpen = false;
}

function togglePalette() {
    if(isPaletteOpen){
        closePalette();
    }
    else {
        openPalette();
    }
}

function drawCurrentColorSprite() {
    //Draw the current color sprite
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawRect(-2, -2, 54, 54);
    graphics.beginFill(availableColors[currentColorIndex].hex, 1);
    graphics.drawRect(0, 0, 50, 50);
    graphics.endFill();

    currentColorSprite = game.add.sprite(0, 0, graphics.generateTexture());

    currentColorSprite.inputEnabled = true;
    currentColorSprite.events.onInputDown.add(togglePalette, this);

    graphics.destroy();
}

function chooseColor(button) {
    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, availableColors[button.colorId].rgba);

    currentColorIndex = button.colorId;
    drawCurrentColorSprite();
    closePalette();
}

function paint(pointer, x, y) {

    if (pointer.isDown)
    {
        var pointerOverAnyButton = false;
        paletteButtons.forEach(function(button) {

            debugger;
            if(button.getBounds().contains(pointer.x, pointer.y)){
               pointerOverAnyButton = true;
            }
            // if(button.input.pointerOver()){
            //    pointerOverAnyButton = true;
            // }
        }, this);

        if(currentColorSprite.input.pointerOver())
        {
            pointerOverAnyButton = true;
        }

        if(!pointerOverAnyButton){
            bmd.draw(bmd2, x - 16, y - 16);
        }
    }
}

function paintCircle(x, y){
    bmd.draw(bmd2, x - 16, y - 16);
}
