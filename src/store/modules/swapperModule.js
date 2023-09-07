import { MetaMaskSDK } from '@metamask/sdk'
import { ethers } from 'ethers'



let account = ''

const checkAccounts = async () => {
  let accounts = await window.ethereum.request({ "method": "eth_accounts" })
  if(!accounts.length){
    accounts = await window.ethereum.request({ "method": "eth_requestAccounts" })
  }
  account = accounts[0]

}

const assetParams = {
  "type": "ERC20",
  "options": {
    "address": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    "symbol": "FOO",
    "decimals": 18,
    "image": "https://foo.io/token-image.svg"
  }
}

const chainId = 97

const chainParams = {
  chainId: '0x'+chainId.toString(16),
  rpcUrls: [ "https://data-seed-prebsc-1-s1.binance.org:8545/" ],
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "Test BNB",
    symbol: "BNB",
    decimals: 18
  },
  blockExplorerUrls: ["https://testnet.bscscan.com"]
}

const swapper = {
  namespaced: true,
  state() {
    return { account }
  },
  getters: {
    // account: ({ account }) => account,
  },
  mutations: {
    // 'SET_ACCOUNT': (state, payload) => state.account = payload,
  },
  actions: {
    
    connect: async ({ dispatch }) => {
      // const mmsdk = new MetaMaskSDK({
      // dappMetadata: { name: "Tincoin Test", url: "http://localhost:5173" }
      // })
      // 
      // await mmsdk.init()
      // 
      // if (!window.ethereum.isMetaMask) {
      // 
      // window.ethereum = mmsdk.getProvider()
      // 
      // console.log('must connect to metamask')
      // return
      // }
      await dispatch('checkAccounts')

      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [chainParams] })

      // First Grab Accounts
      
      
      // const accounts = (!window.ethereum.isConnected())
        // ? await window.ethereum.request({ "method": "eth_requestAccounts" })
        // : await window.ethereum.request({ "method": "eth_requestAccounts" })
// 
      // if (accounts.length <= 0) {
        // console.log('no accounts provided')
        // return
      // }
// 
      // commit('SET_ACCOUNT', accounts[0])
// 
      // const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      // await window.ethereum.request({ method: "wallet_addEthereumChain", params: [chainParams] })
      // await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ "chainId": chainParams.chainId }] })
      // await window.ethereum.request({ method: "wallet_watchAsset", params: assetParams })

    },
  },
}


window.ethereum.on('accountsChanged', checkAccounts )
window.ethereum.on('chainChanged', (chainChanged) => { console.log('chainChanged', chainChanged) })
window.ethereum.on('connect', (connect) => { console.log('connect', connect) })
window.ethereum.on('disconnect', (disconnect) => { console.log('disconnect', disconnect) })
window.ethereum.on('message', (message) => { console.log('message', message) })

export default swapper