var StarLayer = cc.Layer.extend({
  _stars: [],

  ctor: function () {
    this._super();

    var wSize = cc.director.getWinSize();

    for (i = 0; i < 50; i++) {
      var x = Math.random() * wSize.width;
      var y = Math.random() * wSize.height;
      var speed = 0.4 + Math.random() * 0.5;
      var color = cc.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);

      var node = new cc.DrawNode();
      node.drawDot(cc.p(0, 0), 0.5, color);
      node.setPosition(x, y);
      this.addChild(node);

      var star = { node, speed };
      this._stars.push(star);
    }

    this.scheduleUpdate();
  },

  update: function (dt) {
    var wSize = cc.director.getWinSize();
    var h = wSize.height;

    this._stars.forEach(star => {
      var node = star.node;

      var y = node.y;
      y -= star.speed;
      if (y < 0) y = h;
      node.y = y;

      if (Math.random() > 0.98) {
        node.visible = !node.visible;
      }
    })
  }
});
