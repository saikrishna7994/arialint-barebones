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
    const globber = await glob.create('**/*index.html');
    const files = await globber.glob();

    const rulePageLang = new Rule({
      name: 'Language of Page',

      message: 'Please add the lang attribute to the HTML tag',

      ruleUrl:
        'https://www.w3.org/TR/UNDERSTANDING-WCAG20/meaning-doc-lang-id.html',

      level: 'A',

      template: false,

      callback: function (dom) {
        var lang = dom.$('html')[0].lang;
        if (typeof lang === 'undefined' || lang === '') {
          throw {
            reportType: 'error',
            el: dom.$('html')[0],
          };
        }
      },
    });

    const ruleImageAlt = new Rule({
      name: 'All img must have alt',

      message: 'Please add the alt attribute to this image',

      ruleUrl: 'https://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv.html',

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

    const sha = github.context.sha;
    const [owner, repo] = core.getInput('repository').split('/');
    const octokit = github.getOctokit(core.getInput('token'));

    const reporter = new Reporter();
    JSDOM.fromFile(files[0]).then((dom) => {
      dom.window.$ = $(dom.window);
      ruleImageAlt.applyRule(dom.window, reporter);
      rulePageLang.applyRule(dom.window, reporter);
      msg = reporter.print();

      const o = {
        owner: owner,
        repo: repo,
        commit_sha: sha,
        body: msg,
      };
      console.log(o);
      octokit.repos.createCommitComment(o);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
main();
