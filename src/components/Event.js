var EventEmitter = require('eventemitter3');

export const appEvent=new EventEmitter();
export const GAME_START = Symbol();

export const levelEvent = new EventEmitter();
export const LEVEL_PASS=Symbol();
export const RESET = Symbol();
export const TIME_OVER = Symbol();
export const REPLAY=Symbol();
export const CLOSE = Symbol();


export const dragEvent = new EventEmitter();
export const START_DRAG = Symbol();
export const DRAG_MOVE = Symbol();
export const END_DRAG = Symbol();

export const storeEvent=new EventEmitter;
export const USER_ANSWERS=Symbol();


