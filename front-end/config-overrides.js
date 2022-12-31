const { babelInclude, override } = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    babelInclude([
      path.resolve('src'),
    ])
    // and configure other stuff here like csp-html-webpack-plugin
  ),
};

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    
    return config;
}