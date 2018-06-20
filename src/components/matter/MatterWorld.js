import {Container, Rectangle} from 'pixi.js'

const Matter = require('matter-js');
const RenderPixi = require('./RenderPixi.js');
const Engine = Matter.Engine,
  Render = RenderPixi,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  World = Matter.World,
  Bodies = Matter.Bodies;


export default class MatterWorld extends Container {
  constructor(renderer) {
    super();

    this.container = new Container();
    this.spriteContainer = new Container();
    this.addChild(this.container);
    this.addChild(this.spriteContainer);

    // create engine
    this.engine = Engine.create();
    this.world = this.engine.world;

    // create renderer
    this.render = Render.create({
      container: this.container,
      spriteContainer: this.spriteContainer,
      engine: this.engine,
      renderer: renderer,
      options: {
        // wireframes: true,
      }
    });
    this.carriageW = 520;
    this.carriageH = 420;
    this.carriageY = 324;
    this.rectangles = [
      new Rectangle(140, this.carriageY, this.carriageW, this.carriageH),
      new Rectangle(650, this.carriageY, this.carriageW, this.carriageH),
      new Rectangle(1190, this.carriageY, this.carriageW, this.carriageH),
    ]


    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    Render.run(this.render);


    this.createArea();
  }

  createArea() {
    const w = 500;
    const h = 80;
    let rects = [];
    this.rectangles.forEach(value => {
      rects = rects.concat([Bodies.rectangle(value.x, value.y + value.height / 2, h, w, {isStatic: true}),
        Bodies.rectangle(value.x + value.width / 2, value.y + value.height, w, h, {isStatic: true}),
        Bodies.rectangle(value.x + value.width, value.y + value.height / 2, h, w, {isStatic: true}),
      ])
    });
    World.add(this.world, rects)

  }

  queryPoint(x, y) {
    return Matter.Query.point(Matter.Composite.allBodies(this.world), Matter.Vector.create(x, y));
  }

  removeBox(body) {
    World.remove(this.world, body);
  }

  removeAllBox() {
    let bodies = Matter.Composite.allBodies(this.world);
    let body;
    while (body = bodies.shift()) {
      if (body.render && body.render.userInfo) {
        this.removeBox(body)
      }
    }
  }

  /**
   *
   * @param texture
   * @param levelIndex 关卡
   * @param boxIndex 箱子编号
   * @param index 放在哪个框中
   * @param x
   * @param y
   */
  addBox(texture, levelIndex, boxIndex, index, x, y) {
    World.add(this.world, [
      Bodies.rectangle(x, y, 200, 162, {
        render: {
          sprite: {
            texture: texture,
          },
          userInfo: [levelIndex, boxIndex, index]

        }
      })
    ]);
  }

}
