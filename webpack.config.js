/**
 * @param {any} _
 * @param {Object} argv
 * @param {'development' | 'production' | 'none'} [argv.mode]
 * @returns {import('webpack').Configuration}
 */
module.exports = (_, argv) => {
  return [
    require('./webpack.__background.config')(_, argv),
    require('./webpack.__options.config')(_, argv)
  ]
}
