import { getDependency, arr2str, STRATEGY } from '@omni-door/tpl-utils';
import { devDependencies as devDependenciesMap } from './dependencies_stable_map';

interface Config {
  ts: boolean;
  test: boolean;
  eslint: boolean;
  commitlint: boolean;
}

export function devDependencies (strategy: STRATEGY, config: Config) {
  const dependency = getDependency(strategy, devDependenciesMap);

  const {
    ts,
    test,
    eslint,
    commitlint
  } = config;

  // const reactDependencies = [
  //   dependency('react'),
  //   dependency('react-dom')
  // ];

  // const loaderDependencies = [
  //   dependency('babel-loader')
  // ];

  // const babelDependencies = [
  //   dependency('@babel/core'),
  //   dependency('@babel/preset-env'),
  //   dependency('@babel/preset-react'),
  //   ts ? dependency('@babel/preset-typescript') : ''
  // ];

  // const pluginDependencies = [
  //   dependency('html-webpack-plugin'),
  //   dependency('webpackbar')
  // ];

  const buildDependencies = [
    dependency('rollup'),
    dependency('rollup-plugin-node-resolve'),
    dependency('rollup-plugin-babel'),
    dependency('rollup-plugin-commonjs'),
    dependency('rollup-plugin-node-resolve'),
    ts ? dependency('rollup-plugin-typescript') : '',
    ts ? dependency('rollup-plugin-typescript2') : '',
    dependency('rollup-plugin-json')
  ];

  const testDependencies = test ? [
    dependency('chai'),
    dependency('mocha'),
    dependency('nyc'),
    dependency('karma'),
    dependency('karma-chrome-launcher'),
    dependency('karma-firefox-launcher'),
    dependency('karma-coverage'),
    dependency('karma-firefox-launcher'),
    dependency('karma-mocha'),
    dependency('karma-opera-launcher'),
    dependency('karma-safari-launcher'),
    dependency('karma-typescript'),
    dependency('karma-webpack')
  ] : [];

  const testTypesDependencies = test ? [
    dependency('@types/chai'),
    dependency('@types/mocha')
  ] : [];

  const tsDependencies = ts ? [
    // dependency('@types/react'),
    // dependency('@types/react-dom'),
    // dependency('@types/webpack-env'),
    dependency('typescript'),
    dependency('ts-node'),
    dependency('ts-loader'),
    ...testTypesDependencies
  ] : [];

  const eslintDependencies = eslint ? [
    dependency('eslint'),
    ts ? dependency('@typescript-eslint/eslint-plugin') : '',
    ts ? dependency('@typescript-eslint/parser') : ''
  ] : [];

  const commitlintDependencies = commitlint ? [
    dependency('@commitlint/cli'),
    dependency('husky'),
    dependency('lint-staged')
  ] : [];

  // const devServerDependencies = [
  //   dependency('open'),
  //   dependency('ip'),
  //   dependency('detect-port'),
  //   dependency('express'),
  //   dependency('webpack'),
  //   dependency('webpack-cli'),
  //   dependency('webpack-dev-middleware'),
  //   dependency('webpack-hot-middleware'),
  //   dependency('http-proxy-middleware'),
  //   ...loaderDependencies,
  //   ...babelDependencies,
  //   ...pluginDependencies,
  //   ...reactDependencies
  // ];

  const dumiDependencies = [
    dependency('dumi')
  ];

  const defaultDep = [
    dependency('@omni-door/cli'),
    dependency('del')
  ];

  return {
    devDepArr: [
      ...defaultDep,
      ...buildDependencies,
      ...tsDependencies,
      ...testDependencies,
      ...eslintDependencies,
      ...commitlintDependencies,
      ...dumiDependencies
    ],
    defaultDepArr: defaultDep,
    defaultDepStr: arr2str(defaultDep),
    buildDepArr: buildDependencies,
    buildDepStr: arr2str(buildDependencies),
    tsDepArr: tsDependencies,
    tsDepStr: arr2str(tsDependencies),
    testDepArr: testDependencies,
    testDepStr: arr2str(testDependencies),
    eslintDepArr: eslintDependencies,
    eslintDepStr: arr2str(eslintDependencies),
    commitlintDepArr: commitlintDependencies,
    commitlintDepStr: arr2str(commitlintDependencies),
    devServerDepArr: dumiDependencies,
    devServerDepStr: arr2str(dumiDependencies)
  };
}

