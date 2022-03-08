const path = require('path')
const { readFileSync } = require('fs')

const abspath = (relpath: string) => path.join(__dirname, relpath)

const read = (abspath: string) => readFileSync(abspath, 'utf8')

const builtPath = abspath('../build/input.js')
const expectedPath = abspath('./output.js')

const built = read(builtPath)
const expected = read(expectedPath)

if (built !== expected) {
    console.error("ERROR: Output of latest build differs from expected result.")

    process.exit(1)
}

process.exit(0)
