var EventEmitter = require('eventemitter3');
export const MyEvent = new EventEmitter();
export const BOX_SELECTED = Symbol();
export const SUBMIT = Symbol();
export const RESET = Symbol();
export const TIME_OVER = Symbol();
export const CLICK = Symbol();
export const ADD_EXCEPT = Symbol();
export const REMOVE_EXCEPT = Symbol();

