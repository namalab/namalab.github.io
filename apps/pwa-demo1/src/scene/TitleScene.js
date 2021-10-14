var TitleScene = cc.Scene.extend({
  onEnter: function () {
    this._super();

    var cLayer = new ColorLayer(cc.color(0, 0, 50, 255));
    this.addChild(cLayer);

    var layer = new TitleLayer();
    this.addChild(layer);
  }
});

var TitleLayer = cc.Layer.extend({
  ctor: function () {
    this._super();

    var size = cc.winSize;
    var label = cc.LabelTTF.create("PWA Demo-1", "Arial", 16);
    label.setPosition(size.width / 2, 200);
    label.setColor(cc.color("#FFFFFF"));
    this.addChild(label, 1);

    var button = new cc.MenuItemFont("START", this.startGame, this);
    button.setPosition(size.width / 2, 100);
    button.setColor(cc.color("#CCCCCC"));
    button.setFontSize(12);
    var menu = new cc.Menu(button);
    menu.x = 0;
    menu.y = 0;
    this.addChild(menu);

    return true;
  },

  startGame: function () {
    cc.director.runScene(new GameScene());
  }
});
