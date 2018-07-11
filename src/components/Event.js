var EventEmitter = require('eventemitter3');

export const appEvent=new EventEmitter();
export const levelEvent = new EventEmitter();


export const dragEvent = new EventEmitter();
export const START_DRAG=Symbol()
export const DRAG_MOVE=Symbol()
export const END_DRAG=Symbol()

export const storeEvent=new EventEmitter;
export const USER_ANSWERS=Symbol();


export const GAME_START = Symbol();
export const BOX_SELECTED = Symbol();
export const SUBMIT = Symbol();
export const RESET = Symbol();
export const TIME_OVER = Symbol();
export const CLICK = Symbol();
export const LIFT_UP = Symbol();
export const REMOVE_EXCEPT = Symbol();
export const START_GAME = Symbol();
export const SIT_DOWN = Symbol();

