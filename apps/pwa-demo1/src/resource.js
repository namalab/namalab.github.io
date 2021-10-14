/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var res = {
  img_fighter1: "res/galaga-fighter1.png",
  img_fighter2: "res/galaga-fighter2.png",
  img_enemy1: "res/galaga-enemy1.png",
  img_enemy2: "res/galaga-enemy2.png",
  img_firework1: "res/firework1.png",
  bgm_1: "res/bgm/galaga_bgm1.mp3",
  se_firework1: "res/se/galaga_se_firework1.mp3",
  gamefont: { type: "font", name: "gamefont", srcs: ["res/font/x8y12pxTheStrongGamer.ttf"] }
};

var g_resources = [];
for (var i in res) {
  g_resources.push(res[i]);
}
