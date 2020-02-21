import { BUILD, STRATEGY, STYLE, PKJTOOL } from '@omni-door/tpl-common';
import { parse } from 'path';
import init from './index';
const args = process.argv.slice(2);

if (args.length > 0) {
  const options = {
    build: 'rollup' as BUILD,
    strategy: 'stable' as STRATEGY,
    projectName: parse(process.cwd()).name,
    initPath: process.cwd(),
    ts: true,
    test: false,
    eslint: true,
    commitlint: false,
    style: 'scss' as STYLE,
    stylelint: true,
    pkgtool: 'yarn' as PKJTOOL
  };
  for (let i = 0; i < args.length; i++) {
    const item = args[i];
    const [ k, val ] = item.split('=');
    (options as any)[k] = val === 'true'
      ? true
      : val === 'false'
        ? false
        : val as any;
  }
  init(options);
}