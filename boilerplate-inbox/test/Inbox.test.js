const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let inbox

beforeEach(async () => {
  // Get a list of all accounts
  const accounts = await web3.eth.getAccounts()

  console.log(accounts[0])

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there"!'] })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('First Test', async () => {
  it('Fist assertion', async () => {
    assert.equal(true, true)
  })

  it('Second assertion', async () => {
    assert.equal(false, true)
  })
})
