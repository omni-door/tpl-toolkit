export default (config: {
  name: string;
  ts: boolean;
  test: boolean;
  eslint: boolean;
  prettier: boolean;
  commitlint: boolean;
}) => {
  const { name, ts, test, eslint, prettier, commitlint } = config;
  const script_eslint = eslint && 'npm run lint:es';
  const script_prettier = prettier && 'npm run lint:prettier';

  const script_eslint_fix = eslint && 'npm run lint:es_fix';
  const script_prettier_fix = prettier && 'npm run lint:prettier_fix';

  const script_lint = `${script_prettier ? `${script_prettier}${script_eslint ? ' && ' : ''}` : ''}${script_eslint ? `${script_eslint}` : ''}`.trim();
  const script_lint_fix = `${script_prettier_fix ? `${script_prettier_fix}${script_eslint_fix ? ' && ' : ''}` : ''}${script_eslint_fix ? `${script_eslint_fix}` : ''}`.trim();

  const lowerName = name.toLowerCase();
  return `{
  "name": "${lowerName}",
  "version": "0.0.1",
  "description": "",
  "main": "lib/index.js",
  "module": "es/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    "start": "dumi dev",
    "dev": "dumi dev",
    ${
      test
        ? `"test": "karma start --single-run && npm run test:mocha",
          "test:mocha": "nyc mocha --opts mocha.opts",
          "test:headless": "karma start --single-run --browsers ChromeHeadless karma.conf.js",
          "test:browser": "karma start --browsers Chrome",`
        : ''
    }
    ${
      script_lint
        ? `"lint": "${script_lint}",
          "lint:fix": "${script_lint_fix}",
          ${eslint ? `"lint:es": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'}",
          "lint:es_fix": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'} --fix",` : ''}
          ${prettier ? `"lint:prettier": "prettier --check src/",
          "lint:prettier_fix": "prettier --write src/",` : ''}`
      : ''
    }
    ${
      commitlint
        ? '"lint:commit": "commitlint -e $HUSKY_GIT_PARAMS",'
        : ''
    }
    "new": "omni new",
    "build": "omni build",
    "release": "omni release"
  },
  ${
    commitlint
      ? `"husky": {
          "hooks": {
            "pre-commit": "lint-staged",
            "pre-push": ${
    (eslint || prettier) && test
      ? '"npm run lint && npm run test"'
      : eslint || prettier
        ? '"npm run lint"'
        : test
          ? '"npm run test"'
          : ''},
            "commit-msg": "npm run lint:commit"
          }
        },
        "lint-staged": {
          ${eslint ? `"src/**/*.{js,jsx,ts,tsx}": [
            "npm run lint:es_fix"
          ]` : ''}
        },`
      : ''
  }
  "keywords": [],
  "author": "",
  "license": "ISC"
}`;
};

