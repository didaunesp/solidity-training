const path = require('path')
const fs = require('fs')
const solc = require('solc')

const compile = async (filename) => {
  const inboxPath = path.resolve(__dirname, 'contracts', `${filename}.sol`)

  const source = fs.readFileSync(inboxPath, 'utf8')

  const input = {
    language: 'Solidity',
    sources: {
      filename: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts
    .filename[`${filename}`]
  //console.log(compiled)
  return compiled
}

module.exports = compile
