var ColorLayer = cc.LayerColor.extend({
  ctor: function (color) {
    var wSize = cc.director.getWinSize();
    var w = wSize.width;
    var h = wSize.height;
    this._super(color, w, h);
    this.ignoreAnchorPointForPosition(false);
    this.x = wSize.width / 2;
    this.y = wSize.height / 2;
  }
});
