import { ref } from 'vue'
import { BrowserProvider, Contract, getDefaultProvider, parseEther } from "ethers"
import { presaleAbi, contractAbi, presaleAddress, contractAddress } from "./assets"
import { MetaMaskSDK } from '@metamask/sdk'

export const rate = ref(null)
export const account = ref(null)
export const tinBalance = ref(null)
export const tinSymbol = ref(null)
export const networkBalance = ref(null)
export const networkSymbol = ref(null)
export const accounts = ref([])


let ethereum,
    provider,
    signer,
    baseContractSigner,
    baseContractReader,
    presaleContractSigner,
    presaleContractReader



// if (provider) {
//     console.log(provider)
// } else {
//     console.log(provider)
//     console.log('Please install MetaMask!');
// }

/**
 * Swap coins
 * 
 * @param { String | Number } amount
 */
export async function swap(amount = null) {
    const result = await presaleContractSigner.buyTokens({
        value: parseEther(`${amount}`)
    })
    console.log(result)
}

export async function connect() {

    try {

        // const options = {}
// 
        // const MMSDK = new MetaMaskSDK()
// 
        // await MMSDK.init()
        
        // ethereum = MMSDK.getProvider()

        // await onConnect()

    } catch (error) { console.log(error) }
}




async function onDisconnect() {
    // ...
}

async function onConnect() {
    // await getAccounts()
    // await setInitialObjects()
    // await getAssets()
}

async function getAccounts() {
    accounts.value = await ethereum.request({ method: 'eth_requestAccounts' })
    account.value = accounts.value[0]
}

async function setInitialObjects() {
    provider = new BrowserProvider(ethereum)
    signer = await provider.getSigner()
    baseContractSigner = new Contract(contractAddress, contractAbi.result, signer)
    baseContractReader = new Contract(contractAddress, contractAbi.result, provider)
    presaleContractSigner = new Contract(presaleAddress, presaleAbi.result, signer)
    presaleContractReader = new Contract(presaleAddress, presaleAbi.result, provider)
}

async function getAssets() {

    networkBalance.value = await provider.getBalance(account.value)
    networkSymbol.value = await provider.getFeeData()
    networkSymbol.value = 'tBNB'
    tinBalance.value = await baseContractReader.balanceOf(account.value)
    tinSymbol.value = await baseContractReader.symbol()
    rate.value = await presaleContractReader.rate()
    console.log('connected')
}