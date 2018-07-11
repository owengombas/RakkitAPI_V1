module.exports = {
  getParentDir: filename => {
    const path = require('path')
    return path.basename(path.dirname(filename))
  }
}
