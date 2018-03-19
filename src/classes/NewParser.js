export default class Parser {
  constructor(styles) {
    // console.log(styles);
    this.flattened = this.flatten(styles);
    this.generated = [];
    this.run({});
  }
  flatten(obj, depth = 0) {
    const newObj = Object.entries(obj);
    return newObj.map(([key, value]) => {
      let type = 'node';
      let target = '&';
      if(key.startsWith('_')) {
        
      }
      if(typeof value === 'object'){
        type = 'nested';
        value = this.flatten(value, depth + 1);
      }
      return {
        key,
        type,
        value,
        depth,
        target,
      };
    })
  }
  run(props) {
    this.props = props;
    this.queue = [];
    this.traverseArray(this.flattened, '&');
    // console.log(this.generated);
  }
  addToQueue(node) {
  }
  runQueue() {

  }
  handleNested(node) {
    this.traverseArray(node.value, node.target);
  }
  handleNode(node, index) {
    Object.assign(this.generated[index].styles, {
      [node.key]: node.value
    });
  }
  traverseArray(array, target) {
    let index = this.generated.findIndex(o => o.selector === target);
    if(index === -1) {
      index = this.generated.push({ selector: target, styles: {}}) - 1;
    }
    // If nested
    let i = 0;
    do {
      const node = array[i];
      if(node.type === 'nested') {
        this.handleNested(node);
      } else {
        this.handleNode(node, index);
      }
      i++;
    } while(i < array.length);
  }
}