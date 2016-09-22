const fs = require('fs')
const Log = require('log')
const browserify = require('browserify')
const babelify = require('babelify') // eslint-disable-line no-unused-vars
const uglifyify = require('uglifyify') // eslint-disable-line no-unused-vars
const errorify = require('errorify')
const exec = require('child_process').exec

const log = new Log('info')

const fileMap = {
  'dist.js': 'onwheel-fix'
}

const files = Object.keys(fileMap)
const srcFolder = '.'
const buildFolder = 'dist'

exec(`rm -rf ${buildFolder}`, (err) => {
  if (err) {
    throw err
  }
  fs.mkdir(buildFolder)
  files.forEach(file => {
    const inFile = `${srcFolder}/${file}`
    const outFile = `${buildFolder}/${fileMap[file]}`
    const b = browserify({
      entries: [inFile],
      plugin: [errorify]
    })
    const u = browserify({
      entries: [inFile],
      plugin: [errorify]
    })
    u.transform({
      global: true
    }, 'uglifyify')

    function bundle () {
      b.bundle().pipe(fs.createWriteStream(`${outFile}.js`))
      u.bundle().pipe(fs.createWriteStream(`${outFile}.min.js`))
    }

    b.on('log', message => log.info(message))
    b.on('error', message => log.error(message))
    u.on('log', message => log.info(message))
    u.on('error', message => log.error(message))
    bundle()
  })
})
