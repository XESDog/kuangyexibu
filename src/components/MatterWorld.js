import {Container} from 'pixi.js'
import Box from "./Box";

const Matter = require('matter-js');
const RenderPixi = require('./RenderPixi.js');
const Engine = Matter.Engine,
  Render = RenderPixi,
  // Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = require('./Mouse'),
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
        wireframes: true
      }
    });


    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    Render.run(this.render);

    // add mouse control
    this.mouse = Mouse.create(renderer.view);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(this.world, this.mouseConstraint);

    this.createArea();

    // keep the mouse in sync with rendering
    this.render.mouse = this.mouse;
  }

  createArea() {
    World.add(this.world, [
      Bodies.rectangle(124, 500, 80, 500, {isStatic: true}),
      Bodies.rectangle(380, 737, 500, 80, {isStatic: true}),
      Bodies.rectangle(657, 508, 80, 500, {isStatic: true}),

      Bodies.rectangle(124 + 530, 500, 80, 500, {isStatic: true}),
      Bodies.rectangle(380 + 530, 737, 500, 80, {isStatic: true}),
      Bodies.rectangle(657 + 530, 508, 80, 500, {isStatic: true}),

      Bodies.rectangle(124 + 530 * 2, 500, 80, 500, {isStatic: true}),
      Bodies.rectangle(380 + 530 * 2, 737, 500, 80, {isStatic: true}),
      Bodies.rectangle(657 + 530 * 2, 508, 80, 500, {isStatic: true}),

    ])

  }

  stop() {
    Render.stop(this.render);
    Runner.stop(this.runner);
  }

  run() {
    Runner.run(this.runner);
    Render.run(this.render);
  }

  queryPoint(x, y) {
    return Matter.Query.point(Matter.Composite.allBodies(this.world), Matter.Vector.create(x, y));
  }

  removeBox(body) {
    console.log(body)
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
   * @param levelIndex 关卡
   * @param boxIndex 箱子编号
   * @param index 放在哪个框中
   * @param x
   * @param y
   */
  addBox(levelIndex, boxIndex, index, x, y) {
    let b = new Box(levelIndex, boxIndex, 0.5, 0.5);
    World.add(this.world, [
      Bodies.rectangle(x, y, 200, 162, {
        // isStatic: true,
        render: {
          // sprite: this.createBox()
          sprite: {
            texture: b,
          },
          userInfo: [levelIndex, boxIndex, index]

        }
      })
    ]);
  }

}
