module.exports = {
  // respect .editorconfig
  editorconfig: true,
  // 打印宽度指定打印将换行的行长
  printWidth: 120,
  // 指定每个缩进的空格数
  tabWidth: 2,
  // 是否用Tab缩进替代空格
  useTabs: false,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 在语句的末尾打印分号
  semi: true,
  // 多行时，尽可能打印尾随逗号。 （例如，一个单行数组永远不会得到尾随的逗号。）
  // 有效选项：
  // none - 没有尾随逗号。
  // es5 - 在ES5中有效的尾随逗号（object，arrays等）
  // all - 尽可能尾随逗号（包括函数参数）。
  trailingComma: 'es5',
  // 在对象文字中的括号之间打印空格
  bracketSpacing: true,
  // 围绕一个唯一的箭头函数参数包括括号.
  // 选项：
  // avoid - 尽可能省略括号 Example： x => x
  // always - 总是包括括号 Example： (x) => x
  arrowParens: 'avoid',
};
