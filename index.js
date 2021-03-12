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
            el: dom.$('html')[0].outerHTML,
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

    const sendCommitComment = async (msg) => {
      const o = {
        owner: owner,
        repo: repo,
        commit_sha: sha,
        body: msg,
      };

      await octokit.repos.createCommitComment(o);
    }

    const reporter = new Reporter();
    let msg = ''

    JSDOM.fromFile(files[0]).then(async (dom) => {
      dom.window.$ = $(dom.window);
      ruleImageAlt.applyRule(dom.window, reporter);
      rulePageLang.applyRule(dom.window, reporter);
      msg = reporter.print();

      await sendCommitComment(msg)
      if (reporter.getMessages().length > 0) {
        core.setFailed('Unresolved accessibility issues');
      }
    });
  } catch (error) {
    if (msg !== '') sendCommitComment(msg)
    core.setFailed(error.message);
  }
}
main();
