import {Container, Rectangle} from 'pixi.js'
import {DragManager} from "../manager/DragManager";
import DragBoxEvent from "../type/DragBoxEvent";
import {ADD_BOX, dragEvent, END_DRAG, matterEvent, REMOVE_BOX} from "../Event";


//worker不能传输显示对象，因此，需要在这里建立id和显示对象的对应关系
//将id传给worker，以便将显示对象和body对象对应起来
let bodyId = -1;
/**
 * key=id;value=sprite
 * @type {Object}
 */
let bodySprites = {};

function getBodySprite(id) {
  return bodySprites[id];
}

function removeBodySprite(id) {
  let sprite = bodySprites[id];
  delete  bodySprites[id];

  return sprite;
}

function addBodySprite(sprite) {
  bodySprites[++bodyId] = sprite;

  return bodyId;
}

//========================================================

export default class MatterWorld extends Container {
  constructor() {
    super();

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

            let texture = getBodySprite(userInfo.id);
            if (texture) {
              texture.x = x;
              texture.y = y;
              texture.rotation = angle;
              this.spriteContainer.addChild(texture);
            }

            //超出世界范围，需要销毁
            if (body.position.y > 3000) {
              this.removeBox(userInfo.id);
              let b = removeBodySprite(userInfo.id);
              DragManager.instance.unregister(b);
              b.destroy();
            }
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
    let i = -1;
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
   * @param index 放在哪个框中
   * @param x
   * @param y
   * @param w box 200
   * @param h box 162
   * @param isStatic
   */
  addBox(x, y, w, h, isStatic, levelIndex, boxIndex, index) {
    let Box = require("../ui/Box").default;
    let b = Box.create(x, y, 0, 0.5, 0.5, levelIndex, boxIndex);
    let dragBox = DragBoxEvent.create(
      levelIndex,
      boxIndex,
      DragBoxEvent.FROM_TRAIN);
    b.interactive = true;
    DragManager.instance.register(b, dragBox);

    let id = addBodySprite(b);

    b.on('pointerdown', () => {
      this.removeBox(id);
      let t = removeBodySprite(id);
      let i=index;
      let value = boxIndex;
      t.alpha = 0.5;

      matterEvent.emit(REMOVE_BOX,{index:i,value});
      dragEvent.on(END_DRAG, onEndDrag);

      function onEndDrag(data) {
        let target = data.target;
        if (target === b) {
          DragManager.instance.unregister(target);
          target.destroy();
          dragEvent.off(END_DRAG, onEndDrag);
        }
      }
    });

    this.worker.postMessage({
      type: 'add',
      data: {
        userInfo: {type: "box", levelIndex, boxIndex, index, id},
        rectangle: [x, y, w, h],
        options: {
          isStatic
        }
      }
    });
  }

  removeBox(id) {
    this.worker.postMessage({type: 'remove', data: {userInfo: {id}}});
  }

  removeAllBox() {
    for (let key in bodySprites) {
      console.log(`${key},${bodySprites[key]}`);

    }
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
