import path from 'path';
import {
  arr2str,
  intersection,
  PKJTOOL,
  STYLE,
  STRATEGY,
  BUILD,
  MARKDOWN
} from '@omni-door/tpl-utils';
import {
  babel as babelConfigJs,
  commitlint as commitlintConfigJs,
  eslint as eslintrcJS,
  eslintignore,
  gitignore,
  npmignore,
  omni,
  pkj,
  readme,
  tsconfig,
  karma,
  mocha,
  indexTpl,
  demo_html,
  demo_index_react,
  demo_webpack_dev,
  component_index,
  component_readme,
  component_test,
  TPLS_INITIAL,
  TPLS_INITIAL_FN,
  TPLS_INITIAL_RETURE,
  TPLS_NEW,
  TPLS_NEW_FN,
  TPLS_NEW_RETURE
} from './templates';
import { devDependencies } from './configs/dependencies';
import {
  exec,
  logErr,
  logWarn,
  output_file,
  logSuc
} from '@omni-door/tpl-utils';

const default_tpl_list = {
  babel: babelConfigJs,
  commitlint: commitlintConfigJs,
  eslint: eslintrcJS,
  eslintignore,
  gitignore,
  npmignore,
  omni,
  pkj,
  readme,
  tsconfig,
  karma,
  mocha,
  indexTpl,
  demo_html,
  demo_index_react,
  demo_webpack_dev,
  component_index,
  component_readme,
  component_test
};

export type ResultOfDependencies = string[] | { add?: string[]; remove?: string[]; };

export type InitOptions = {
  build?: BUILD;
  strategy: STRATEGY;
  projectName: string;
  initPath: string;
  configFileName?: string;
  ts: boolean;
  test: boolean;
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  pkgtool?: PKJTOOL;
  isSlient?: boolean;
  tpls?: (tpls: TPLS_INITIAL) => TPLS_INITIAL_RETURE;
  dependencies?: (dependecies_default: string[]) => ResultOfDependencies;
  devDependencies?: (devDependecies_default: string[]) => ResultOfDependencies;
  error?: () => any;
  success?: () => any;
};

async function init ({
  build = 'rollup',
  strategy = 'stable',
  projectName: name,
  initPath,
  configFileName = 'omni.config.js',
  ts,
  test,
  eslint,
  commitlint,
  tpls,
  pkgtool = 'yarn',
  isSlient,
  dependencies: dependencies_custom,
  devDependencies: devDependencies_custom,
  error = () => {
    logErr('SDK工具库项目初始化失败！(The SDK-Tool project initialization has been occured some error!)');
    process.exit(1);
  },
  success = () => logSuc('SDK工具库项目初始化完成！(The SDK-Tool project initialization has been completed!)')
}: InitOptions) {
  let custom_tpl_list = {};
  try {
    custom_tpl_list = typeof tpls === 'function'
      ? tpls(default_tpl_list)
      : custom_tpl_list;

    for (const tpl_name in custom_tpl_list) {
      const name = tpl_name as keyof TPLS_INITIAL_RETURE;
      const list = custom_tpl_list as TPLS_INITIAL_RETURE;
      const tpl = list[name];
      const tplFactory = (config: any) => {
        try {
          return tpl && tpl(config);
        } catch (err) {
          logWarn(JSON.stringify(err));
          logWarn(`自定义模板 [${name}] 解析出错，将使用默认模板进行初始化！(The custom template [${name}] parsing occured error, the default template will be used for initialization!)`);    
        }

        return default_tpl_list[name](config);
      };

      (list[name] as TPLS_INITIAL_FN) = tplFactory as TPLS_INITIAL_FN;
    }
  } catch (err_tpls) {
    logWarn(JSON.stringify(err_tpls));
    logWarn('生成自定义模板出错，将全部使用默认模板进行初始化！(The custom template generating occured error, all will be initializated with the default template!)');
  }
  const tpl = { ...default_tpl_list, ...custom_tpl_list };
  const project_type = 'toolkit';

  // default files
  const content_omni = tpl.omni({
    project_type,
    build,
    ts,
    test,
    eslint,
    commitlint,
    mdx: false
  });
  const content_pkg = tpl.pkj({
    name,
    ts,
    test,
    eslint,
    commitlint,
    strategy
  });
  const content_gitignore = tpl.gitignore();

  // demo files
  const content_demo_index = tpl.demo_index_react({ ts });
  const content_demo_html = tpl.demo_html({ name });
  const content_demo_webpack = tpl.demo_webpack_dev({ name, ts });
  
  // tsconfig
  const content_ts = ts && tpl.tsconfig();

  // test files
  const content_mocha = test && tpl.mocha({ ts });
  const content_karma = test && tpl.karma({ ts });

  // lint files
  const content_eslintrc = eslint && tpl.eslint({ ts });
  const content_eslintignore = eslint && tpl.eslintignore();
  const content_commitlint = commitlint && tpl.commitlint({ name });

  // build files
  const content_babel = tpl.babel({ ts });

  // ReadMe
  const content_readMe = tpl.readme({ name, configFileName });

  const pathToFileContentMap = {
    [`${configFileName}`]: content_omni,
    'package.json': content_pkg,
    '.gitignore': content_gitignore,
    'tsconfig.json': content_ts,
    '.eslintrc.js': content_eslintrc,
    '.eslintignore': content_eslintignore,
    'commitlint.config.js': content_commitlint,
    'babel.config.js': content_babel,
    'README.md': content_readMe,
    [`demo/index.${ts ? 'tsx' : 'jsx'}`]: content_demo_index,
    'demo/index.html': content_demo_html,
    'demo/webpack.config.js': content_demo_webpack,
    'mocha.opts': content_mocha,
    'karma.conf.js': content_karma,
  }
  /**
   * create files
   */
  const file_path = (p: string) => path.resolve(initPath, p);
  for (const p in pathToFileContentMap) {
    output_file({
      file_path: file_path(p),
      file_content: pathToFileContentMap[p]
    });
  }

  let installCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add --cwd ${initPath}` : `${pkgtool} install --save --prefix ${initPath}`;
  let installDevCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add -D --cwd ${initPath}` : `${pkgtool} install --save-dev --prefix ${initPath}`;
  if (pkgtool === 'cnpm' && initPath !== process.cwd()) {
    installCliPrefix = `cd ${initPath} && ${installCliPrefix}`;
    installDevCliPrefix = `cd ${initPath} && ${installDevCliPrefix}`;
  }

  let dependencies_str = '';
  if (typeof dependencies_custom === 'function') {
    const result = dependencies_custom([]);
    if (result instanceof Array) {
      dependencies_str = arr2str(result);
    } else {
      const { add = [] } = result;
      dependencies_str = arr2str(add);
    }
  }
  const installCli = dependencies_str ? `${installCliPrefix} ${dependencies_str}` : '';

  let {
    defaultDepArr,
    defaultDepStr,
    buildDepArr,
    buildDepStr,
    tsDepArr,
    tsDepStr,
    testDepStr,
    testDepArr,
    eslintDepArr,
    eslintDepStr,
    commitlintDepArr,
    commitlintDepStr,
    devServerDepArr,
    devServerDepStr,
    devDepArr
  } = devDependencies(strategy, {
    ts,
    eslint,
    commitlint,
    test
  });

  let customDepStr;
  if (typeof devDependencies_custom === 'function') {
    const result = devDependencies_custom(devDepArr);
    if (result instanceof Array) {
      customDepStr = arr2str(result);
    } else {
      const { add = [], remove = [] } = result;
      for (let i = 0; i < remove.length; i++) {
        const item_rm = remove[i];
        defaultDepArr = [ ...intersection(defaultDepArr, defaultDepArr.filter(v => v !== item_rm)) ];
        buildDepArr = [ ...intersection(buildDepArr, buildDepArr.filter(v => v !== item_rm)) ];
        tsDepArr = [ ...intersection(tsDepArr, tsDepArr.filter(v => v !== item_rm)) ];
        testDepArr = [ ...intersection(testDepArr, testDepArr.filter(v => v !== item_rm)) ];
        eslintDepArr = [ ...intersection(eslintDepArr, eslintDepArr.filter(v => v !== item_rm)) ];
        commitlintDepArr = [ ...intersection(commitlintDepArr, commitlintDepArr.filter(v => v !== item_rm)) ];
        devServerDepArr = [ ...intersection(devServerDepArr, devServerDepArr.filter(v => v !== item_rm)) ];
      }
      defaultDepStr = arr2str(defaultDepArr);
      buildDepStr = arr2str(buildDepArr);
      tsDepStr = arr2str(tsDepArr);
      testDepStr = arr2str(testDepArr);
      eslintDepStr = arr2str(eslintDepArr);
      commitlintDepStr = arr2str(commitlintDepArr);
      devServerDepStr = arr2str(devServerDepArr);
      customDepStr = arr2str(add);
    }
  }

  const installDevCli = defaultDepStr ? `${installDevCliPrefix} ${defaultDepStr}` : '';
  const installBuildDevCli = buildDepStr ? `${installDevCliPrefix} ${buildDepStr}` : '';
  const installTsDevCli = tsDepStr ? `${installDevCliPrefix} ${tsDepStr}` : '';
  const installTestDevCli = testDepStr ? `${installDevCliPrefix} ${testDepStr}` : '';
  const installEslintDevCli = eslintDepStr ? `${installDevCliPrefix} ${eslintDepStr}` : '';
  const installCommitlintDevCli = commitlintDepStr ? `${installDevCliPrefix} ${commitlintDepStr}` : '';
  const installServerDevCli = devServerDepStr ? `${installDevCliPrefix} ${devServerDepStr}` : '';
  const installCustomDevCli = customDepStr ? `${installDevCliPrefix} ${customDepStr}` : '';

  exec([
    installCli,
    installDevCli,
    installBuildDevCli,
    installTsDevCli,
    installTestDevCli,
    installEslintDevCli,
    installCommitlintDevCli,
    installServerDevCli,
    installCustomDevCli
  ], success, error, isSlient);
}

export function newTpl ({
  ts,
  test,
  componentName,
  newPath,
  md,
  tpls
}: {
  ts: boolean;
  test: boolean;
  componentName: string;
  newPath: string;
  md: MARKDOWN;
  tpls?: (tpls: TPLS_NEW) => TPLS_NEW_RETURE;
}) {
  let custom_tpl_list = {};
  try {
    custom_tpl_list = typeof tpls === 'function'
      ? tpls(default_tpl_list)
      : custom_tpl_list;

    for (const tpl_name in custom_tpl_list) {
      const name = tpl_name as keyof TPLS_NEW_RETURE;
      const list = custom_tpl_list as TPLS_NEW_RETURE;
      const tpl = list[name];
      const tplFactory = (config: any) => {
        try {
          return tpl && tpl(config);
        } catch (err) {
          logWarn(JSON.stringify(err));
          logWarn(`自定义模板 [${name}] 解析出错，将使用默认模板进行创建组件！(The custom template [${name}] parsing occured error, the default template will be used for initialization!)`);    
        }

        return default_tpl_list[name](config);
      };

      (list[name] as TPLS_NEW_FN) = tplFactory as TPLS_NEW_FN;
    }
  } catch (err_tpls) {
    logWarn(JSON.stringify(err_tpls));
    logWarn('生成自定义模板出错，将全部使用默认模板进行创建组件！(The custom template generating occured error, all will be initializated with the default template!)');
  }
  const tpl = { ...default_tpl_list, ...custom_tpl_list };
  // component tpl
  const content_index = tpl.component_index({ componentName });
  const content_readme = md === 'md' && tpl.component_readme({ componentName });
  const content_test = test && tpl.component_test({ componentName });

  const pathToFileContentMap = {
    [`index.${ts ? 'ts' : 'js'}`]: content_index,
    [`__test__/index.test.${
      ts
        ? 'ts'
        : 'js'
    }`]: content_test,
    'README.md': content_readme
  }
  /**
   * create files
   */
  const file_path = (p: string) => path.resolve(newPath, p);
  for (const p in pathToFileContentMap) {
    output_file({
      file_path: file_path(p),
      file_content: pathToFileContentMap[p]
    });
  }
}

export default init;