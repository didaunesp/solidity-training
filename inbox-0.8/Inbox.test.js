const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let inbox
let accounts

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  console.log(accounts[0])

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Inbox testing', async () => {
  it('Deploys a contract', () => {
    assert.ok(inbox.options.address)
  })

  it('Initial Message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hi there!')
  })

  it('Set Message', async () => {
    await inbox.methods.setMessage('New Message').send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.equal(message, 'New Message')
  })
})
