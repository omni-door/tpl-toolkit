import babel from './babel';
import commitlint from './commitlint';
import eslint from './eslint';
import eslintignore from './eslintignore';
import gitignore from './gitignore';
import npmignore from './npmignore';
import omni from './omni';
import pkj from './package';
import prettier from './prettier';
import prettierignore from './prettierignore';
import readme from './readme';
import tsconfig from './tsconfig';
import indexTpl from './indexTpl';
import karma from './karma';
import mocha from './mocha';
import component_index from './new/index';
import component_readme from './new/readme';
import component_test from './new/test';
import umirc from './umirc';
import env from './env';

export { default as babel } from './babel';
export { default as commitlint } from './commitlint';
export { default as eslint } from './eslint';
export { default as eslintignore } from './eslintignore';
export { default as gitignore } from './gitignore';
export { default as npmignore } from './npmignore';
export { default as omni } from './omni';
export { default as pkj } from './package';
export { default as prettier } from './prettier';
export { default as prettierignore } from './prettierignore';
export { default as readme } from './readme';
export { default as tsconfig } from './tsconfig';
export { default as indexTpl } from './indexTpl';
export { default as karma } from './karma';
export { default as mocha } from './mocha';
export { default as component_index } from './new/index';
export { default as component_readme } from './new/readme';
export { default as component_test } from './new/test';
export { default as umirc } from './umirc';
export { default as env } from './env';

const tpls = {
  babel,
  commitlint,
  eslint,
  eslintignore,
  gitignore,
  npmignore,
  omni,
  pkj,
  prettier,
  prettierignore,
  readme,
  tsconfig,
  indexTpl,
  karma,
  mocha,
  component_index,
  component_readme,
  component_test,
  umirc,
  env
};

type TPLS = {
  [T in keyof typeof tpls]: typeof tpls[T];
};

export type TPLS_INITIAL = Omit<TPLS,
  'component_index' |
  'component_readme' |
  'component_test'
>;

export type TPLS_INITIAL_FN = TPLS_INITIAL[keyof TPLS_INITIAL];

export type TPLS_INITIAL_RETURE = Partial<TPLS_INITIAL>;

export type TPLS_NEW = Pick<TPLS,
  'component_index' |
  'component_readme' |
  'component_test'
>;

export type TPLS_NEW_FN = TPLS_NEW[keyof TPLS_NEW];

export type TPLS_NEW_RETURE = Partial<TPLS_NEW>;

export default tpls;