export default class DragBoxEvent {
  static create(icon=null,index=0,from=-1,to=-1){
    let d=new DragBoxEvent();
    d.icon=icon;
    d.index=index;
    d.from=from;
    d.to = to;
    return d;
  }
  static FROM_SELECTOR = 0;
  static FROM_TRAIN = 1;
  x=0;
  y=0;
  /**
   * box编号
   * @type {number}
   */
  index = 0;
  /**
   * box的位置
   * 0 表示从selector拖出
   * 1 表示从火车拖出
   * @type {number}
   */
  from = -1;
  /**
   * 放到哪个位置
   * -1 放丢了
   * 0,1,2 车厢编号
   *
   * @type {number}
   */
  to = -1;
  /**
   * 拖拽时候显示的图标
   * @type {Box|null}
   */
  icon = null;
}
