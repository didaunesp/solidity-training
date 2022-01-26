const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' })
}
const nodeUrl = process.env.NODE_URL
const privateKey = process.env.PRIVATE_KEY

if (!nodeUrl || !privateKey) {
  console.log('Create a .env file with NODE_URL and PRIVATE_KEY variables')
} else {
  const provider = new HDWalletProvider(
    process.env.PRIVATE_KEY,
    process.env.NODE_URL
  )

  const web3 = new Web3(provider)

  const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: ['Hi there!'] })
      .send({ from: accounts[0], gas: '1000000' })

    console.log('Contract deployed to', result.options.address)

    // prevents a hanging deployment
    provider.engine.stop()
  }
  // try with closure
  deploy()
}
