<script setup>
import axios from 'axios'
import { MetaMaskSDK } from '@metamask/sdk'
import { BrowserProvider, Contract, formatEther } from 'ethers'
import { ref, computed, onMounted, onServerPrefetch } from 'vue'

const sdk = new MetaMaskSDK({
    dappMetadata: {
        url: window.location.href,
        name: 'MetaMask VueJS Example Dapp',
    },
    enableDebug: true,
    autoConnect: {
        enable: true,
    },
    logging: {
        developerMode: true,
    },
    storage: {
        enabled: true,
    },
})

const accounts = ref(null)
const chainId = ref(null)
const connected = ref(false)
const networkBalance = ref(null)
const tinBalance = ref(null)
const testnetContract = ref('0x936bd2C380ddE7FCECD58e3a90DA324981CDB572')
const presaleContract = ref('0xC7f1db70E1C7ADef041E1a07b751AA18eDaF5194')

const account = computed(() => (accounts.value && accounts.value.length) ? accounts.value[0] : null)

async function onConnect() {
    try {
        const { ethereum } = window
        const response = await ethereum.request({ method: 'eth_requestAccounts', params: [] })
    } catch (e) {
        console.log('request accounts ERR', e);
    }
}

function handleAccountsChanged(newAccounts) {
    try {
        accounts.value = newAccounts
        getAssetsBalance()
    } catch (e) { console.log(e) }
}

function handleChainIdChanged(newChainId) {
    chainId.value = newChainId
    if (chainId.value !== '0x61') {
        addEthereumChain()
    }
}

function handleConnect(_connectInfo) {
    connected.value = window.ethereum.isConnected()
}

function handleDisconnect() {
    connected.value = window.ethereum.isConnected()
    setDefaultValues()
}

function handleInitialized() {
    if (window.ethereum?.chainId) {
        chainId.value = window.ethereum.chainId;
    }
}

async function addEthereumChain() {
    try {
        const res = await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x61',
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                    chainName: 'BNB Smart Chain Testnet',
                    nativeCurrency: { symbol: 'BNB', decimals: 18 },
                    blockExplorerUrls: ['https://polygonscan.com'],
                },
            ],
        })
    } catch (e) {
        console.log('ADD ERR', e);
    }
}
async function watchAsset() {
    try {
        const res = await window.ethereum.request({
            method: "wallet_watchAsset", params: {
                "type": "ERC20",
                "options": {
                    "address": '0x936bd2C380ddE7FCECD58e3a90DA324981CDB572',
                    "symbol": "TTT",
                    "decimals": 18,
                }
            }
        })
    } catch (e) {
        console.log(e)
    }
}
async function getAssetsBalance() {
    try {
        if (chainId.value !== '0x61') {
            await addEthereumChain()
        }
        const provider = new BrowserProvider(window.ethereum)
        const { data: testnetAbi } = await axios.get('https://api-testnet.bscscan.com/api', {
            params: {
                module: 'contract',
                action: 'getabi',
                address: testnetContract.value,
                format: 'raw',
            }
        })
        const readerContract = new Contract(testnetContract.value, testnetAbi, provider)
        tinBalance.value = await readerContract.balanceOf(account.value)
        networkBalance.value = await window.ethereum.request({ method: "eth_getBalance", params: [account.value] })

    } catch (e) {
        console.log(e)
    }

}
function terminate() {
    sdk?.terminate()
    setDefaultValues()
}
function setDefaultValues(error) {
    console.log('setting default values', error)
    connected.value = false
    accounts.value = null
    chainId.value = null
    networkBalance.value = null
    tinBalance.value = null
}
onServerPrefetch(() => {
    if(window.ethereum?.isConnected()){
        accounts.value = window.ethereum.request({method: "eth_accounts", params: []})
        getAssetsBalance()
    }
})
onMounted(() => {
    // if (sdk.isInitialized()) {
        window.ethereum?.on("chainChanged", handleChainIdChanged)
        window.ethereum?.on("accountsChanged", handleAccountsChanged)
        window.ethereum?.on('connect', handleConnect)
        window.ethereum?.on('disconnect', handleDisconnect)
        window.ethereum?.on('_initialized', handleInitialized)
        
    // }
})
</script>
<template>
    <div>
        <button @click="onConnect">connect</button>
        <button @click="watchAsset">add tin token</button>
        <button @click="addEthereumChain">add chain</button>
        <button @click="terminate">TERMINATE</button>
        <ul>
            <li>connection: {{ connected ? 'CONNECTED' : 'NOT CONNECTED' }}</li>
            <li>account: {{ account }}</li>
            <li>
                accounts:
                <ul>
                    <li v-for="acc in accounts" :key="acc">
                        {{ acc }}
                    </li>
                </ul>
            </li>
            <li>ChainId: {{ chainId }}</li>
            <li>BNB Balance: {{ (networkBalance) ? formatEther(networkBalance) : null }}</li>
            <li>TTT Balance: {{ (tinBalance) ? formatEther(tinBalance) : null }}</li>
        </ul>
    </div>
</template>
  
