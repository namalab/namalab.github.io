var GameScene = cc.Scene.extend({
  onEnter: function () {
    this._super();

    var cLayer = new ColorLayer(cc.color(0, 0, 50, 255));
    this.addChild(cLayer);

    var backLayer = new StarLayer();
    this.addChild(backLayer);

    var layer = new GameLayer();
    this.addChild(layer);
  },
});

var GameLayer = cc.Layer.extend({
  _fighter: null,

  ctor: function () {
    this._super();

    var size = cc.director.getWinSize();

    this._fighter = cc.Sprite.create(res.img_fighter1, cc.rect(0, 0, 16, 16));
    this._fighter.setScale(1.0);
    this._fighter.getTexture().setAliasTexParameters();
    this._fighter.setPosition(size.width / 2, 32);
    this.addChild(this._fighter, 0);

    // BGM
    cc.audioEngine.playMusic(res.bgm_1, false);

    this.scheduleUpdate();
    this.schedule(this.spawnEnemy, 0.1);
  },

  update: function (dt) {
    // 敵の移動
    for (var i = this._enemies.length - 1; i >= 0; i--) {
      var enemy = this._enemies[i];
      if (!enemy) continue;

      enemy.update(dt);
      if (enemy._isDestroy) continue;
    }

    // reference
    // 2021/9/5
    // ギャラガ’８８ チャレンジングステージメドレー おまけでラスボス～エンディングまで GALAGA '88 Galactic Dancin' Challenge Stage.mp4
    // arcade 解像度：224, 288
  },

  spawnEnemy: function () {
    var rec = enemyData[this._enemySpawnIndex];

    var enemy = new Enemy(this, rec);
    this._enemies.push(enemy);

    // 左右対称のも登録
    var rec2 = JSON.parse(JSON.stringify(rec));
    rec2.x = 224 - rec2.x;
    rec2.reverse = true;
    var enemy2 = new Enemy(this, rec2);
    this._enemies.push(enemy2);

    // 次のスケジュール登録
    this.unschedule(this.spawnEnemy);
    this._enemySpawnIndex++;
    if (this._enemySpawnIndex < enemyData.length) {
      this.schedule(this.spawnEnemy, rec.interval);
    } else {
      this._lastEnemy = true;
    }
  },

  onEnemyDestroy: async function (obj) {
    this._enemies.forEach((item, index) => {
      if (item === obj) {
        this._enemies.splice(index, 1);
      }
    });

    if (this._lastEnemy && this._enemies.length == 0) {
      await sleep(1000);
      var size = cc.director.getWinSize();

      var label1 = cc.LabelTTF.create("NUMBER OF HITS   0", "gamefont", 10);
      label1.setPosition(size.width / 2, 160);
      label1.setColor(cc.color("#00FFFF"));
      this.addChild(label1, 1);

      await sleep(2000);
      this.removeChild(label1);

      var label2 = cc.LabelTTF.create("SECRET BONUS", "gamefont", 10);
      label2.setPosition(size.width / 2, 160);
      label2.setColor(cc.color("#FF0000"));
      this.addChild(label2, 1);

      await sleep(500);

      await this.firework();

      this.removeChild(label2);

      var button = new cc.MenuItemFont("RESTART", this.restartGame, this);
      button.setPosition(size.width / 2, 100);
      button.setColor(cc.color("#CCCCCC"));
      button.setFontSize(12);
      var menu = new cc.Menu(button);
      menu.x = 0;
      menu.y = 0;
      this.addChild(menu);
    }
  },

  restartGame: function () {
    cc.director.runScene(new GameScene());
  },

  firework: async function () {
    var size = cc.director.getWinSize();

    var firework = cc.Sprite.create(res.img_firework1, cc.rect(0, 0, 64, 64));
    firework.setScale(1.0);
    firework.getTexture().setAliasTexParameters();
    firework.setPosition(size.width / 2, size.height / 2);
    this.addChild(firework, 0);

    var frameSeq = [];
    for (var i = 0; i < 7; i++) {
      var frame = cc.SpriteFrame.create(res.img_firework1, cc.rect(64 * i, 0, 64, 64));
      frameSeq.push(frame);
    }
    var anime = cc.Animation.create(frameSeq, 0.08);
    var animate = cc.Animate.create(anime)
    var down = cc.sequence(cc.delayTime(0.5), cc.moveBy(2.0, cc.p(0, -20)));
    firework.runAction(cc.Spawn.create(animate, down));

    // Sound
    cc.audioEngine.playEffect(res.se_firework1);

    await sleep(800);
    this.removeChild(firework);
  },

  _enemySpawnIndex: 0,
  _enemies: [],
  _lastEnemy: false,
});

var Enemy = cc.Class.extend({
  _parent: null,
  _sprite: null,
  _rec: null,
  _move: null,

  _moveIndex: 0,
  _rad: 0,
  _radV: 0,
  _speed: 1,
  _reverse: false,

  ctor: function (parent, rec) {
    this._parent = parent;
    this._rec = rec;

    // sprite
    var img;
    switch (rec.e) {
      case 'enemy1': img = res.img_enemy1; break;
      case 'enemy2': img = res.img_enemy2; break;
    }
    this._sprite = cc.Sprite.create(img, cc.rect(0, 0, 16, 16));
    this._sprite._enemy = this;
    this._sprite.setScale(1.0);
    this._sprite.getTexture().setAliasTexParameters();
    this._sprite.setPosition(rec.x, rec.y);

    // animation
    var frameSeq = [];
    switch (rec.e) {
      case 'enemy1': {
        for (var i = 0; i <= 1; i++) {
          var frame = cc.SpriteFrame.create(img, cc.rect(16 * i, 0, 16, 16));
          frameSeq.push(frame);
        }
        break;
      }
      case 'enemy2': {
        frameSeq.push(cc.SpriteFrame.create(img, cc.rect(0, 0, 16, 16)));
        frameSeq.push(cc.SpriteFrame.create(img, cc.rect(16, 0, 16, 16)));
        frameSeq.push(cc.SpriteFrame.create(img, cc.rect(32, 0, 16, 16)));
        frameSeq.push(cc.SpriteFrame.create(img, cc.rect(16, 0, 16, 16)));
        break;
      }
    }
    var anime = cc.Animation.create(frameSeq, 0.20);
    var action = cc.RepeatForever.create(cc.Animate.create(anime));
    this._sprite.runAction(action);

    switch (rec.m) {
      case 'move1': this._move = new Move1(this); break;
      case 'move2': this._move = new Move2(this); break;
      default: break;
    }

    if (this._move) this._move.init();

    parent.addChild(this._sprite, 0);
  },

  update: function (dt) {
    if (this._isDestroy) return;

    this.updateMove(dt);
  },

  updateMove: function (dt) {
    var pos = this._sprite.getPosition();

    // 重い時の補正に、dt（前回からの秒数）に応じてレートを掛ける
    // 適正値は 1/60＝0.0166秒
    // var dtRatio = dt / (1.0 / 60.0);
    var dtRatio = 1.0;

    this._rad += this._radV;
    pos.x += Math.cos(this._rad) * this._speed * dtRatio;
    pos.y += Math.sin(this._rad) * this._speed * dtRatio;

    this._sprite.setPosition(pos);

    // 回転。＋で時計回りなので、Radと逆。
    // this._rad が現在の方向だけど、次の方向を意識して _radV も足す
    this._sprite.setRotation(90 - (this._rad + this._radV) * 180.0 / Math.PI);
  },

  destroy: function () {
    this._parent.removeChild(this._sprite);
    this._isDestroy = true;

    this._parent.onEnemyDestroy(this);
  },
});

var MoveBass = cc.Class.extend({
  _enemy: null,

  ctor: function (enemy) {
    this._enemy = enemy;
  }
});

var Move1 = MoveBass.extend({
  ctor: function (enemy) {
    this._super(enemy);
  },

  init: function () {
    var data = move1data[0];
    this._enemy._rad = data.rad;
    this._enemy._radV = data.radV;
    this._enemy._speed = data.speed;

    if (this._enemy._rec.reverse) {
      this._enemy._rad = Math.PI - this._enemy._rad;
      this._enemy._radV *= -1.0;
    }

    this._enemy._moveIndex = 1;
    this._enemy._sprite.schedule(this.moveChange, data.interval);
  },

  moveChange: function () {
    // ここは sprite クラスとして呼ばれるので、sprite に持った enemy オブジェクトを使って処理
    var enemy = this._enemy;
    var rec = move1data[enemy._moveIndex];

    if (rec.destroy) {
      enemy.destroy();
      return;
    }

    if (rec.rad != null) enemy._rad = (enemy._rec.reverse ? Math.PI - rec.rad : rec.rad);
    if (rec.radV != null) enemy._radV = (enemy._rec.reverse ? rec.radV * -1.0 : rec.radV);
    if (rec.speed != null) enemy._speed = rec.speed;

    this.unschedule(enemy._move.moveChange);
    enemy._moveIndex++;
    if (enemy._moveIndex < move1data.length) {
      this.schedule(enemy._move.moveChange, rec.interval);
    }
  },
});

var Move2 = MoveBass.extend({
  ctor: function (enemy) {
    this._super(enemy);
  },

  init: function () {
    var data = move1data[0];
    this._enemy._rad = (Math.PI * 2) - data.rad;
    this._enemy._radV = -data.radV;
    this._enemy._speed = data.speed;

    if (this._enemy._rec.reverse) {
      this._enemy._rad = Math.PI - this._enemy._rad;
      this._enemy._radV *= -1.0;
    }

    this._enemy._moveIndex = 1;
    this._enemy._sprite.schedule(this.moveChange, data.interval);
  },

  moveChange: function () {
    // ここは sprite クラスとして呼ばれるので、sprite に持った enemy オブジェクトを使って処理
    var enemy = this._enemy;
    var rec = move1data[enemy._moveIndex];

    if (rec.destroy) {
      enemy.destroy();
      return;
    }

    if (rec.rad != null) enemy._rad = (enemy._rec.reverse ? Math.PI - (Math.PI * 2 - rec.rad) : (Math.PI * 2) - rec.rad);
    if (rec.radV != null) enemy._radV = (enemy._rec.reverse ? rec.radV : -rec.radV);
    if (rec.speed != null) enemy._speed = rec.speed;

    this.unschedule(enemy._move.moveChange);
    enemy._moveIndex++;
    if (enemy._moveIndex < move1data.length) {
      this.schedule(enemy._move.moveChange, rec.interval);
    }
  },
});

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const enemyData = [
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 5.82, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },

  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 5.82, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },

  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 0.13, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },
  { interval: 5.82, x: 224, y: 250, e: "enemy1", m: "move1", reverse: false },

  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy2", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
  { interval: 0.13, x: 224, y: 288 + 16 - 250, e: "enemy2", m: "move2", reverse: false },
  { interval: 5.60, x: 224, y: 288 + 16 - 250, e: "enemy1", m: "move2", reverse: false },
];

const move1data = [
  { interval: 0.30, rad: Math.PI, radV: 0.032, speed: 2.9 },
  { interval: 0.30, rad: null, radV: null, speed: 1.8 },
  { interval: 0.50, rad: null, radV: 0.019, speed: 2.9 },
  { interval: 0.50, rad: null, radV: 0.004, speed: 1.8 },
  { interval: 1.25, rad: null, radV: -0.206, speed: 3.7 },
  { interval: 0.50, rad: 2.20, radV: -0.020, speed: 2.9 },
  { interval: 0.30, rad: null, radV: null, speed: 1.9 },
  { interval: 0.30, rad: null, radV: null, speed: 2.9 },
  { interval: 0.30, rad: null, radV: null, speed: 1.8 },
  { interval: 0.40, rad: null, radV: null, speed: 2.9 },
  { destroy: true },
];
