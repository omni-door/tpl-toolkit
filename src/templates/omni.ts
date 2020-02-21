import { PROJECT_TYPE, BUILD } from '@omni-door/tpl-common';
export default (config: {
  project_type: PROJECT_TYPE;
  build: BUILD;
  ts: boolean;
  test: boolean;
  eslint: boolean;
  commitlint: boolean;
  mdx: boolean;
}) => {
  const { project_type, build, ts, test, eslint, commitlint, mdx } = config;

  return `'use strict';

const path = require('path');
module.exports = {
  type: '${project_type}', // 项目类型，请勿任意变动 (project type, please don't modify)

  dev: {
    webpack: require(path.resolve('demo/webpack.config.dev.js')), // 开发服务端webpack配置 (dev-server webpack configuration)
    proxy:  [
      // {
      //   route: '/api',
      //   config: {
      //     target: 'http://www.api.com/api',
      //     changeOrigin: true
      //   }
      // }
    ], // 开发服务代理配置 (dev-server proxy config)
    port: 6200, // 开发服务端口号 (dev-server port)
    logLevel: 'error' // 开发服务日志输出等级，可选 'debug'、'info'、'warn'、'error'、'silent' (The log-level which dev-server will apply)
  },

  build: {
    // 构建完成后是否自动发布 (auto release project after build success)
    autoRelease: false,

    // 输入路径 (the build source directory)
    // 务必使用绝对路径 (must be a absolute path)
    srcDir: path.resolve('src/toolkit'),
    
    // 输出路径 (the directory for compiled project)
    // 务必使用绝对路径 (must be a absolute path)
    outDir: path.resolve('lib'),

    // es6 module输出路径 (es6 module compiled directory)
    // 务必使用绝对路径 (must be a absolute path)
    esmDir: path.resolve('es'),

    // 打包工具，支持 tsc、rollup、webpack (build tool, support tsc, rollup and webpack)
    tool: '${build}', 

    // 构建阶段的自定义配置回调 (The callback will be call in the build-process)
    // 返回自定义的配置 (You can return your custom build configuration)
    configuration: config => config,

    reserve: {
      assets: [] // 构建结果保留资源的路径 (reserve assets paths)
    },

    preflight: {
      typescript: ${!!ts}, // 是否处理ts或tsx文件 (whether or not process the ts or tsx files)
      test: ${!!test}, // 是否进行单元测试 (whether or not process unit-test)
      eslint: ${!!eslint} // 是否进行eslint检测 (whether or not process eslint fix and check)
    }
  },

  release: {
    git: '', // 发布的git仓库地址 (project git repo url)
    npm: '', // 发布的npm仓库地址 (npm depository url)
    preflight: {
      test: ${!!test}, // 发布前是否进行单元测试 (whether or not process unit-test)
      eslint: ${!!eslint}, // 发布前是否进行eslint检测 (whether or not process eslint fix and check)
      commitlint: ${!!commitlint}, // 发布前是否进行单元测试commitlint检测 (whether or not process commit lint check)
      branch: 'master' // 发布前进行分支检测，设置为空字符串则不会检测 (only can release in this branch, set empty string to ignore this check)
    }
  },

  template: {
    // 生成模板的根路径 (the root directory for generate template)
    // 务必使用绝对路径 (must be a absolute path)
    root: path.resolve('src/toolkit'),
    typescript: ${!!ts}, // 是否创建ts文件 (whether or not apply typescript)
    test: 'mocha', // 创建单元测试文件类型 (the unit test frame)
    readme: [true, 'md'] // [是否生成ReadMe文件, 创建md 或 mdx文件] ([whether or not README.md, generate mdx or md file])
  },

  plugins: []
};`;
};
