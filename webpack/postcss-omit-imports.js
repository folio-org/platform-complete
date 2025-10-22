/* omit-imports will remove imports that match the supplied 'contains' regex */

const plugin = (options = { contains: '' }) => {
  return {
    postcssPlugin: 'postcss-omit-imports',
    prepare (result) {
      return {
        AtRuleExit: {
          import: atRule => {
            if (options.contains && options.contains.test(atRule.params)) {
              atRule.remove();
            }
          }
        },
      }
    }
  }
};
plugin.postcss = true;

module.exports = plugin;
