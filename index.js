const Rule = require('./lib/rule.js');
const Reporter = require('./lib/reporter.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const $ = require('jquery');

async function main() {
  const rule = new Rule({
    name: 'Language of Page',

    message: 'Please add the lang attribute to the HTML tag',

    ruleUrl:
      'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html',

    level: 'A',

    template: false,

    callback: function (dom, reporter) {
      // console.log(dom);
      var lang = dom.$('html').attr('lang');
      // console.log(dom.$('html').attr('lang'));
      if (typeof lang === 'undefined' || lang === '') {
        throw {
          reportType: 'error',
          el: dom.$('html').parent().html(),
        };
      }
    },
  });

  const { window } = await new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

  // const dom = await jsdom.fromURL('https://github.com/');
  window.$ = $(window);
  // console.log(window);

  const reporter = new Reporter();
  // const rule = new Rule({
  //   id: 123,
  //   name: 'sally',
  // });

  // // console.log(rule.getName());

  // jsdom.env(uri, function (err, window) {
  //   window.$ = $(window);

  //   if (!err) {
  //     that.dom = window;
  //     callback();
  //   } else {
  //     console.log('Error on jsdom.env: ' + err);
  //     throw 'Error: ' + uri + ' cant be accessed.';
  //   }
  // });

  rule.applyRule(window, reporter);

  console.log(reporter);
}
main();
