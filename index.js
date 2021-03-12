const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');
const Rule = require('./lib/rule.js');
const Reporter = require('./lib/reporter.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const $ = require('jquery');

async function main() {
  try {
    const ruleImageAlt = new Rule({
      name: 'All img must have alt',

      message: 'Please add the alt attribute to this image',

      ruleUrl:
        'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html',

      level: 'A',

      template: true,

      callback: function (dom) {
        dom.$('img').each(function () {
          if (typeof dom.$(this).attr('alt') === 'undefined') {
            throw {
              reportType: 'error',
              el: dom.$(this).parent().html(),
            };
          }
        });
      },
    });

    const dom = await new JSDOM(
      `<!DOCTYPE html>
    <img src="https://www.w3schools.com/images/w3schools_green.jpg" >
    <p>Hello world</p>`
    );
    dom.window.$ = $(dom.window);
    const reporter = new Reporter();

    // rulePageLang.applyRule(dom.window, reporter);
    ruleImageAlt.applyRule(dom.window, reporter);

    console.log(reporter);
  } catch (error) {
    core.setFailed(error.message);
  }
}
main();

// const rulePageLang = new Rule({
//   name: 'Language of Page',

//   message: 'Please add the lang attribute to the HTML tag',

//   ruleUrl:
//     'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html',

//   level: 'A',

//   template: false,

//   callback: function (dom, reporter) {
//     var lang = dom.$('html').attr('lang');
//     if (typeof lang === 'undefined' || lang === '') {
//       throw {
//         reportType: 'error',
//         el: dom.$('html').parent().html(),
//       };
//     }
//   },
// });
