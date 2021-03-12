class Reporter {
  constructor() {
    this.messages = [];
  }

  error(element, rule) {
    this.messages.push({
      type: 'error',
      element: element,
      rule: rule,
    });
  }

  info(element, rule) {
    this.messages.push({
      type: 'info',
      element: element,
      rule: rule,
    });
  }

  getMessages() {
    return this.messages;
  }

  hasMessages() {
    return this.messages.length !== 0;
  }

  print() {
    var len = this.messages.length;

    for (var i = 0; i < len; i++) {
      console.log(this.element);
      console.log(this.messages[i].message);
    }
  }
}

module.exports = Reporter;
