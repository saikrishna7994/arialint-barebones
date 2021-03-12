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
    const msg = [];
    this.messages?.map(message => {
      msg.push(message.rule.message);
    })

    return msg.join('\n');
  }
}

module.exports = Reporter;
