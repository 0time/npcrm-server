// customFormatters should have the formatter we're looking for
// and it should return a function which takes in the config options
// and that should return a function which takes in a winston info object and does something with it
// Something like this should be returned by the first options call:
//  https://github.com/winstonjs/winston#creating-custom-formats
const customStringify = require('./custom-stringify');

module.exports = { 'custom-stringify': customStringify };
