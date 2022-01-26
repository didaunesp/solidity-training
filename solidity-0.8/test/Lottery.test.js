const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const compile = require('../compile')

let lottery
let accounts
let buildedContract
let abi, evm

describe('Lottery testing', async () => {
  before(async () => {
    buildedContract = await compile('Lottery')
    abi = buildedContract.abi
    evm = buildedContract.evm

    accounts = await web3.eth.getAccounts()
  })

  beforeEach(async () => {
    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object })
      .send({ from: accounts[0], gas: '1000000' })
  })

  it('Deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('Sets manager', async () => {
    const manager = await lottery.methods.manager().call()
    assert.equal(manager, accounts[0])
  })

  it('submits enter', async () => {
    const txId = await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') })
    assert.ok(txId)
  })

  it('enter player', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') })

    const player = await lottery.methods.players(0).call()

    assert.equal(player, accounts[1])
  })

  it('requiers a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[1], value: 0 })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('get players', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') })

    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei('0.01', 'ether') })

    const players = await lottery.methods.getPlayers().call()

    assert.equal(players.length, 2)
    assert.equal(players[0], accounts[1])
    assert.equal(players[1], accounts[2])
  })

  it('Only manager can pick winner', async () => {
    try {
      const test = await lottery.methods
        .pickWinner()
        .send({ from: accounts[1] })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('PickWinner Sends money to the winner', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') })

    const initialBalance = await web3.eth.getBalance(accounts[1])

    await lottery.methods.pickWinner().send({ from: accounts[0] })

    const finalBalance = await web3.eth.getBalance(accounts[1])

    const profit = finalBalance - initialBalance

    assert.equal(profit, web3.utils.toWei('0.01', 'ether'))
  })

  it('PickWinner resets the players array ', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.01', 'ether') })

    await lottery.methods.pickWinner().send({ from: accounts[0] })

    const players = await lottery.methods.getPlayers().call()

    assert.equal(players.length, 0)
  })
})
