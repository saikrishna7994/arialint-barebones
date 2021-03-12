class Rule {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.callback = options.callback;
    this.message = options.message;
    this.ruleUrl = options.ruleUrl;
    this.level = options.level;
    this.template = options.template;
  }

  applyRule(dom, reporter) {
    try {
      this.callback(dom);
      return true;
    } catch (e) {
      console.log('YOA');
      if (reporter && e && e.reportType) {
        console.log('YOB');
        reporter[e.reportType](e.el, this);
      }
      return e;
    }
  }

  getName() {
    return this.name;
  }

  getMessage() {
    return this.message;
  }
}

module.exports = Rule;
