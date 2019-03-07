class FormBuilder {
  constructor() {
    this.version = '1.0';
    this.actions = [];
  }

  create() {
    this.clear();
    return this;
  }

  clear() {
    this.actions = [];
  }

  add(action) {
    this.actions.push(action);
    return this;
  }

  getResult() {
    return {
      version: this.version,
      actions: [...this.actions],
    }
  }
}

module.exports = new FormBuilder();