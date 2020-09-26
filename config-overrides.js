const {
   override,
   fixBabelImports,
   addLessLoader,
   addWebpackAlias,
   addDecoratorsLegacy
} = require('customize-cra');
const { resolve } = require("path");
// 配置babel-plugin-import ==> 只打包import模块及css
module.exports = override(
   fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,  //加载less编译
   }),
   // 添加less-loader对应的配置  ==> 修改primary对应的颜色
   addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#1DA57A' },
   }),
   // 引入路径统一使用的固定根路径
   addWebpackAlias({
      "@": resolve(__dirname, "src")
   }),
   addDecoratorsLegacy() //用于支持装饰器语法
);