import {Container, Rectangle} from 'pixi.js'
import {DragManager} from "../manager/DragManager";
import DragBoxEvent from "../type/DragBoxEvent";
import {dragEvent, END_DRAG, levelEvent, RESET, storeEvent, USER_ANSWERS} from "../Event";


//worker不能传输显示对象，因此，需要在这里建立boxIndex和显示对象的对应关系
//将id传给worker，以便将显示对象和body对象对应起来
/**
 * key=id;value=sprite
 * @type {Object}
 */
let bodySprites = {};

function getBodySprite(boxIndex) {
  return bodySprites[boxIndex];
}

function removeBodySprite(boxIndex) {
  let sprite = bodySprites[boxIndex];
  delete  bodySprites[boxIndex];

  return sprite;
}

function addBodySprite(sprite, boxIndex) {
  bodySprites[boxIndex] = sprite;

  return boxIndex;
}

//========================================================

export default class MatterWorld extends Container {
  constructor(state) {
    super();

    this.state = state;
    this.container = new Container();
    this.spriteContainer = new Container();
    this.addChild(this.container);
    this.addChild(this.spriteContainer);

    this.carriageW = 520;
    this.carriageH = 420;
    this.carriageY = 324;
    this.rectangles = [
      new Rectangle(140, this.carriageY, this.carriageW, this.carriageH),
      new Rectangle(650, this.carriageY, this.carriageW, this.carriageH),
      new Rectangle(1190, this.carriageY, this.carriageW, this.carriageH),
    ];

    this.MatterWorker = require('worker-loader!./matterWorker');
    this.worker = new this.MatterWorker();

//侦听userAnswers的变化
    storeEvent.on(USER_ANSWERS, this.update, this);
    levelEvent.on(RESET, this.removeAllBox, this);

    this.worker.onmessage = (e) => {
      if (e.data.type === 'tick') {
        let bodies = e.data.bodies;
        bodies.forEach(body => {
          let userInfo = body.userInfo;
          if (userInfo.type === 'bound') {

          } else if (userInfo.type === 'box') {
            let x = body.position.x;
            let y = body.position.y;
            let angle = body.angle;

            let texture = getBodySprite(userInfo.boxIndex);
            if (texture) {
              texture.x = x;
              texture.y = y;
              texture.rotation = angle;
              this.spriteContainer.addChild(texture);
            }

            //超出世界范围，需要销毁
            /*if (body.position.y > 3000) {
              this.removeBox(userInfo.id);
              let b = removeBodySprite(userInfo.id);
              DragManager.instance.unregister(b);
              b.destroy();
            }*/
          }
        });
        this.spriteContainer.children.sort((a, b) => {
          return b.y - a.y;
        })
      }
    };

    const w = 500;
    const h = 80;
    this.rectangles.forEach(value => {
      this.addBound(value.x, value.y + value.height / 2, h, w, true);
      this.addBound(value.x + value.width / 2, value.y + value.height, w, h, true);
      this.addBound(value.x + value.width, value.y + value.height / 2, h, w, true);
    })
  }

  getWhichRectangle(x, y) {
    let i = 3;
    this.rectangles.some((value, index) => {
      if (value.contains(x, y)) {
        i = index;
      }
    });
    return i;
  }

  /**
   *
   * @param levelIndex 关卡
   * @param boxIndex 箱子编号
   * @param x
   * @param y
   * @param isStatic
   */
  addBox(x, y, isStatic, levelIndex, boxIndex) {
    let Box = require("../ui/Box").default;
    let b = Box.create(x, y, 0, 0.5, 0.5, levelIndex, boxIndex);
    let dragBox = DragBoxEvent.create(
      levelIndex,
      boxIndex,
      DragBoxEvent.FROM_TRAIN);
    b.interactive = true;
    DragManager.instance.register(b, dragBox);

    addBodySprite(b, boxIndex);
    this.spriteContainer.addChild(b);

    b.on('pointerdown', () => {
      b.alpha = 0.5;
      dragEvent.on(END_DRAG, onEndDrag)
    });

    function onEndDrag() {
      b.alpha = 1;
      dragEvent.off(END_DRAG, onEndDrag);
    }


    this.worker.postMessage({
      type: 'add',
      data: {
        userInfo: {type: "box", levelIndex, boxIndex},
        rectangle: [x, y, 200, 162],
        options: {
          isStatic
        }
      }
    });
  }

  removeBox(boxIndex) {
    this.worker.postMessage({type: 'remove', data: {userInfo: {boxIndex}}});
    let b = removeBodySprite(boxIndex);
    DragManager.instance.unregister(b);
    b.destroy();
  }

  removeAllBox() {
    for (let key in bodySprites) {
      this.removeBox(key);
    }
  }

  update(data) {
    let state = this.state;
    data.forEach(value => {
      if (value.from < 3) {
        this.removeBox(value.value);
      }
      if (value.to < 3) {
        this.addBox(state.mouseX, state.mouseY, false, state.levelIndex, value.value)
      }
    })
  }

  addBound(x, y, w, h, isStatic) {
    this.worker.postMessage({
      type: 'add',
      data: {
        userInfo: {type: "bound"},
        rectangle: [x, y, w, h],
        options: {
          isStatic
        }
      }
    });
  }

}
