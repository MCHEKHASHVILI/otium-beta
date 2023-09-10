<template>
    <div class="metamask-container">
        <button class="action-button" @click="onConnect">CONNECT</button>
        <button class="action-button" @click="addTinToken">add token</button>
        <button class="action-button" @click="addEthereumChain">
            ADD POLYGON CHAIN
        </button>
        <button class="action-button" @click="terminate">TERMINATE</button>
        <div class="spacer">
            {{ connected ? 'CONNECTED' : 'NOT CONNECTED' }}
        </div>
        <div class="spacer">
            Accounts:
            <ul>
                <li v-for='account in accounts' :key='account'>
                    {{ account }}
                </li>
            </ul>
        </div>
        <div class="spacer">
            ChainId: {{ chainId }}
        </div>
        <div class="spacer">
            Last response: {{ lastResponse }}
        </div>
        <div class="spacer">
            BNB Balance: {{ (networkBalance) ? formatEther(networkBalance) : null }}
        </div>
        <div class="spacer">
            TTT Balance: {{ (tinBalance) ? formatEther(tinBalance) : null }}
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
import { MetaMaskSDK } from '@metamask/sdk'
import { BrowserProvider, Contract, formatEther } from 'ethers'
//   const { Buffer } = require('buffer')

export default {
    name: 'MetaMaskComponent',
    data() {
        return {
            sdk: null,
            accounts: null,
            chainId: null,
            connected: false,
            networkBalance: null,
            tinBalance: null,
            lastResponse: null,
            testnetContract: '0x936bd2C380ddE7FCECD58e3a90DA324981CDB572',
            presaleContract: '0xC7f1db70E1C7ADef041E1a07b751AA18eDaF5194',
        };
    },
    computed: {
        account() { return (this.accounts && this.accounts.length) ? this.accounts[0] : null }
    },
    created() {
        this.sdk = new MetaMaskSDK({
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
    },
    mounted() {
        // if(this.sdk.isInitialized()){
            // Chain changed
            window.ethereum?.on("chainChanged", (chain) => {
                console.log(`App::Chain changed:'`, chain);
                this.chainId = chain;
            })
            // Accounts changed
            window.ethereum?.on("accountsChanged", (accounts) => {
                console.log(`App::Accounts changed:'`, accounts)
                this.accounts = accounts
                this.getContractDetails()
            })
            // Initialized event
            window.ethereum?.on('_initialized', () => {
                console.debug(`App::useEffect on _initialized`);
                // Getting the accounts again to display in the UI
                this.onConnect();
                if (window.ethereum?.chainId) {
                    this.chainId = window.ethereum.chainId;
                }
            })
            // Connected event
            window.ethereum?.on('connect', (_connectInfo) => {
                console.log(`App::connect`, _connectInfo)
                this.connected = true;
            })
            // Disconnect event
            window.ethereum?.on('disconnect', (error) => {
                console.log(`App::disconnect`, error);
                this.setDefaultValues()
            })
        // }
    },
    methods: {
        async onConnect() {
            try {
                const { ethereum } = window
                const response = await ethereum.request({ method: 'eth_requestAccounts', params: [] })
                this.accounts = response;
                this.chainId = ethereum.chainId;
                // await this.addEthereumChain()
                // await this.addTinToken()
                // await this.getContractDetails()
            } catch (e) {
                console.log('request accounts ERR', e);
            }
        },
        async addEthereumChain() {
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
                });
                console.log('add', res);
                this.lastResponse = res;
            } catch (e) {
                console.log('ADD ERR', e);
            }
        },
        async addTinToken() {
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
                this.lastResponse = res
            } catch (e) {
                console.log(e)
            }
        },
        async getContractDetails() {
            try {

                if(this.chainId !== '0x61'){
                    await this.addEthereumChain()
                }
                const provider = new BrowserProvider(window.ethereum)
                const signer = await provider.getSigner()

                const { data: testnetAbi } = await axios.get('https://api-testnet.bscscan.com/api', {
                    params: {
                        module: 'contract',
                        action: 'getabi',
                        address: this.testnetContract,
                        format: 'raw',
                    }
                })

                const readerContract = new Contract(this.testnetContract, testnetAbi, provider)

                this.tinBalance = await readerContract.balanceOf(this.account)
                this.networkBalance = await window.ethereum.request({ method: "eth_getBalance", params: [this.account] })

            } catch (e) {
                console.log(e)
            }

        },
        terminate() {
            this.sdk?.terminate()
            this.setDefaultValues()
        },
        setDefaultValues(){
            this.connected = false
            this.accounts = null
            this.lastResponse = "Terminated!"
            this.chainId = null
            this.networkBalance = null
            this.tinBalance = null
        },
        formatEther,
    },
};
</script>