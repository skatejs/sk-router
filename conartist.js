const { config, preset } = require('conartist');

module.exports = config(
  preset.babel(),
  preset.base(),
  preset.jest(),
  preset.rollup(),
  {
    'rollup.config.js'() {
      return Object.assign(
        {
          name: 'skRouter'
        },
        preset.rollup()['rollup.config.js']()
      );
    }
  }
);
