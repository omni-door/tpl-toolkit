import { STRATEGY } from '@omni-door/tpl-utils';

export default (config: {
  name: string;
  ts: boolean;
  test: boolean;
  eslint: boolean;
  commitlint: boolean;
  strategy: STRATEGY;
  type_react?: string;
}) => {
  const { name, ts, test, eslint, commitlint } = config;

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
      eslint
        ? `"lint": "npm run lint:es",
        "lint:fix": "npm run lint:es_fix",
        "lint:es": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'}",
        "lint:es_fix": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'} --fix",`
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
    eslint && test
      ? '"npm run lint && npm run test"'
      : eslint
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

