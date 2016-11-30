
var game = new Phaser.Game(window.innerWidth - 15, window.innerHeight- 50, Phaser.Canvas, 'gameDiv', { preload: preload, 
    create: create, update: update, render: render });

var bmd;
var bmd2;

var availableColors = [{hex: 0xff0000, rgba: 'rgba(255,0,0,0.2)'},
                       {hex: 0x00ff00, rgba: 'rgba(0,255,0,0.2)'},
                       {hex: 0xff00ff, rgba: 'rgba(255,0,255,0.2)'},
                       {hex: 0x0000ff, rgba: 'rgba(0,0,255,0.2)'},
                       {hex: 0xffff00, rgba: 'rgba(255,255,0,0.2)'}];

var currentColorIndex = 2;
var currentColorSprite;

var paletteButtons;

function preload() {
}

function update() {
    if(game.input.pointer1.isDown) {
        var p = game.input.pointer1;
        paintCircle(p.x, p.y);
    }
}

function render() {
}

function create() {

    bmd = game.make.bitmapData(window.innerWidth, window.innerHeight);
    bmd.addToWorld();

    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, 'rgba(255,0,255,0.2)');

    game.input.addMoveCallback(paint, this);

    drawPalette();
}

function drawPalette() {

    paletteButtons = game.add.group();

    for(var i = 0; i < availableColors.length; i++) {

        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(availableColors[i].hex, 1);
        graphics.drawRect(2, (60* i + 60), 50, 50);
        graphics.endFill();

        var button = game.add.sprite(2, (60*i + 60), graphics.generateTexture());
        graphics.destroy();
        button.colorId = i;
        button.inputEnabled = true;

        button.events.onInputDown.add(chooseColor, this);
        paletteButtons.add(button);
    }

    paletteButtons.callAll('events.onInputDown.add', 'events.onInputDown', chooseColor);
    drawCurrentColorSprite(); 
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
    graphics.destroy();
}

function chooseColor(button) {
    bmd2 = game.make.bitmapData(64, 64);
    bmd2.circle(16, 16, 16, availableColors[button.colorId].rgba);

    currentColorIndex = button.colorId;
    drawCurrentColorSprite();
}

function paint(pointer, x, y) {

    if (pointer.isDown)
    {
        var pointerOverAnyButton = false;
        paletteButtons.forEach(function(button) {
            if(button.input.pointerOver()){
               pointerOverAnyButton = true;
            }
        });

        if(!pointerOverAnyButton){
            bmd.draw(bmd2, x - 16, y - 16);
        }
    }
}

function paintCircle(x, y){
    bmd.draw(bmd2, x - 16, y - 16);
}
