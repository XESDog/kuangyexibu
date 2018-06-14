export default class DragBoxEvent {
  static FROM_SELECTOR=0;
  static FROM_TRAIN=1;
  constructor() {
    this.boxIndex = 0;
    this.boxPosition = null;
    this.from = -1//0表示从selector拖出，1表示从火车拖出
  }
}
