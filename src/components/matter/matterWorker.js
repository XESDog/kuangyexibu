global.window = {};
const Matter = require('matter-js');
const Engine = Matter.Engine,
  Events = Matter.Events,
  Runner = Matter.Runner,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Body = Matter.Body;
const engine = Engine.create();
const world = engine.world;
const runner = Runner.create();
Runner.run(runner, engine);


onmessage = function (e) {
  let type = e.data.type;
  let userInfo = e.data.data.userInfo;
  let body;
  switch (type) {
    case 'add':
      let rectangle = e.data.data.rectangle;
      let options = e.data.data.options;
      body = Bodies.rectangle(...rectangle, options);
      World.add(world, body);
      //修正angle，使得箱子不旋转
      // Body.setInertia(body, Infinity);
      body.userInfo = userInfo;
      break;
    case 'remove':
      let id = userInfo.id;
      body = getBodyById(id);
      if (!body) console.log('body未获取' + id);
      World.remove(world, body);
      break;

  }
};
Events.on(runner, "tick", () => {
  let bodies = Composite.allBodies(world);
  postMessage({type: 'tick', bodies});

});

function query(x, y) {
  let bodies = Composite.allBodies(world);
  bodies = bodies.filter(value => {
    return value.userInfo && value.userInfo.type === 'box';
  });
  return Matter.Query.point(bodies, {x, y});
}

function getBodyById(id) {
  let bodies = Composite.allBodies(world);
  let result = null;
  bodies.some(value => {
    if (value.userInfo.id !== undefined &&
      value.userInfo.id !== null &&
      value.userInfo.id === id) {
      result = value;
      return true
    }
  });
  return result;
}
