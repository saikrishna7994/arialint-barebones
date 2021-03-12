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

    const msg = [];

    console.log({messages})
    for (var i = 0; i < len; i++) {
      msg.push(this.messages[i].element);
      msg.push(this.messages[i].rule.message);
    }
    return msg.join('\n');
  }
}

module.exports = Reporter;
