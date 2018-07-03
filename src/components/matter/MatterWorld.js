import {Container, Rectangle} from 'pixi.js'
import {DragManager} from "../manager/DragManager";
import DragBoxEvent from "../type/DragBoxEvent";


let bodyId = -1;

export default class MatterWorld extends Container {
  constructor() {
    super();

    this.boxs = [];
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
          if (body.userInfo.type === 'bound') {

          } else if (body.userInfo.type === 'box') {
            let x = body.position.x;
            let y = body.position.y;
            let angle = body.angle;
            let texture = this.boxs[body.userInfo.id];
            if (texture) {
              texture.x = x;
              texture.y = y;
              texture.rotation = angle;
              this.spriteContainer.addChild(texture);
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
      //todo:这里的icon如何回收
      Box.create(
        x,
        y,
        0,
        0.5,
        0.5,
        levelIndex,
        boxIndex),
      boxIndex,
      DragBoxEvent.FROM_TRAIN);
    b.interactive = true;
    DragManager.instance.register(b, dragBox);
    b.on('pointerdown', () => {
      DragManager.instance.unregister(b);
      this.removeBox();
    });
    this.boxs[++bodyId] = b;
    this.worker.postMessage({
      type: 'add',
      data: {
        userInfo: {type: "box", levelIndex, boxIndex, index, id: bodyId},
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

  addBound(x, y, w, h, isStatic) {
    this.worker.postMessage({
      type: 'add',
      data: {
        userInfo: {type: "bound", id: bodyId},
        rectangle: [x, y, w, h],
        options: {
          isStatic
        }
      }
    });
  }

}
