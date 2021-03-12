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
    const messages = this.messages
    if (messages.length < 1) return ''

    const reports = messages.reduce((agg, message) => {
      agg.push(message.rule.message);
      return agg
    }, [])
    return reports.join('/n')
  }
}

module.exports = Reporter;
