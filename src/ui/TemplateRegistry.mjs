import { HashMap, HashStrategy } from '../utils';

class TemplateNode {
  constructor(name, node) {
    this.name = name;
    this.node = node;
    this.tainted = false;
    this.locked = false;
  }

  release() {
    this.locked = false;
  }
}

class TemplateRegistry extends HashMap {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  acquireWithLock(name) {
    const entry = this.get(name);
    if (entry) {
      entry.locked = true;
    }
    return entry;
  }

  acquireByList(list) {
    return list.split(',').map(name => (
      this.acquireWithLock(name.trim())
    ));
  }

  register(node, name, tainted, status) {
    let entry = this.get(name);
    if (entry) {
      if (!entry.tainted || tainted) {
        status.warning(`virtual frame named ${name} already exists`);
        return;
      }

      // TODO: What else to do in this scenario?
    } else {
      entry = new TemplateNode(name, node);
      entry.tainted = tainted;
      this.set(name, entry);
    }

    status.info(`registered virtual frame ${name}`);
  }
}

export default TemplateRegistry;
