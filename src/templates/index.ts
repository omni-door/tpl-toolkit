import babel from './babel';
import commitlint from './commitlint';
import eslint from './eslint';
import eslintignore from './eslintignore';
import gitignore from './gitignore';
import npmignore from './npmignore';
import omni from './omni';
import pkj from './package';
import readme from './readme';
import tsconfig from './tsconfig';
import indexTpl from './indexTpl';
import karma from './karma';
import mocha from './mocha';
import demo_index_react from './demo/index_react';
import demo_html from './demo/html';
import demo_webpack_dev from './demo/webpack_dev';

export { default as babel } from './babel';
export { default as commitlint } from './commitlint';
export { default as eslint } from './eslint';
export { default as eslintignore } from './eslintignore';
export { default as gitignore } from './gitignore';
export { default as npmignore } from './npmignore';
export { default as omni } from './omni';
export { default as pkj } from './package';
export { default as readme } from './readme';
export { default as tsconfig } from './tsconfig';
export { default as indexTpl } from './indexTpl';
export { default as karma } from './karma';
export { default as mocha } from './mocha';
export { default as demo_index_react } from './demo/index_react';
export { default as demo_html } from './demo/html';
export { default as demo_webpack_dev } from './demo/webpack_dev';

const tpls = {
  babel,
  commitlint,
  eslint,
  eslintignore,
  gitignore,
  npmignore,
  omni,
  pkj,
  readme,
  tsconfig,
  demo_index_react,
  demo_html,
  demo_webpack_dev,
  indexTpl,
  karma,
  mocha
};

export type TPLS_INITIAL = {
  [T in keyof typeof tpls]: typeof tpls[T];
};

export type TPLS_INITIAL_FN = TPLS_INITIAL[keyof TPLS_INITIAL];

export type TPLS_INITIAL_RETURE = Partial<TPLS_INITIAL>;

export default tpls;