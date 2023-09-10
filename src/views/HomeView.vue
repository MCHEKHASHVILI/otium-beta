<script>
// import { onMounted } from 'vue'
// import { connect } from '../interceptors/swaper/swaper';
// import { useClipboard } from '@vueuse/core'
// import { formatEther } from 'ethers'

// import {
//     account,
//     tinBalance,
//     tinSymbol,
//     networkBalance,
//     networkSymbol,
//     connect,
//     submit,
//     tinAmount,
//     networkAmount,
//     buyMax,
// } from '@/composables/useSwaper'

// const { isSupported, copy } = useClipboard({ account })
// import { mapActions, mapGetters } from 'vuex'
// export default {
//     computed: {
//         ...mapGetters('swapper', ['account']),
//     },
//     methods: {
//         ...mapActions('swapper', ['connect']),
//     },
//     mounted(){
//         // console.log(window.ethereum)
//     },
//     unmounted(){

//     }
// }

import { MetaMaskSDK } from '@metamask/sdk'
import { ethers, id } from 'ethers'
import { ref } from 'vue'
import MetaMaskOnboarding from '@metamask/onboarding';

export default {
    setup(){
        const chainId = ref(97)
        const account = ref('')

        const assetParams = {
            "type": "ERC20",
            "options": {
                "address": "0x936bd2C380ddE7FCECD58e3a90DA324981CDB572",
                "symbol": "TTT",
                "decimals": 18,
                // "image": "https://foo.io/token-image.svg"
            }
        }

        const chainParams = {
            chainId: '0x' + chainId.value.toString(16),
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            chainName: "BNB Smart Chain Testnet",
            nativeCurrency: {
                name: "Test BNB",
                symbol: "BNB",
                decimals: 18
            },
            blockExplorerUrls: ["https://testnet.bscscan.com"]
        }

        

        const checkAccounts = async () => {
            const { ethereum } = window
            let accounts = await ethereum.request({ "method": "eth_accounts" })
            if (!accounts.length) {
                accounts = await ethereum.request({ "method": "eth_requestAccounts" })
            }
            account.value = accounts[0]
        }

        const checkNetwork = async () => {
            if(await window.ethereum.request({ "method": "eth_chainId" }) !== '0x'+chainId.value.toString(16)){
                console.log('need network')
                // window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ "chainId": chainParams.chainId }] })
                    // .catch(e => window.ethereum.request({ method: "wallet_addEthereumChain", params: [chainParams] }) )   
                await window.ethereum.request({ method: "wallet_addEthereumChain", params: [chainParams] })
            }else{
                console.log('network matches')
            }
        }

        const watchAsset = async () => {
           await window.ethereum.request({ method: "wallet_watchAsset", params: assetParams})
        }

        const connect = async () => {
            console.log('function is runnint')
            let options = {
                dappMetadata: { name: "Test Dapp", url: "https://swaper.laradevtest.com" }
            }
            const MMSDK = new MetaMaskSDK(options)
            
            await MMSDK.init()

            // console.log(MMSDK)

            // console.log('MMSDK initialized')

            // const ethereum = MMSDK.getProvider() // You can also access via window.ethereum

            const { ethereum } = window

            if(ethereum && ethereum.isMetaMask){

                ethereum.on('accountsChanged', checkAccounts )
                
                await checkAccounts()


                // await ethereum.request({ method: 'eth_accounts' })
                // console.log(accounts)
            }else{
                // console.log(ethereum)
            }

            // if(window.ethereum){
            //     console.log("injected in window")

            //     let accounts = await window.ethereum.request({ method: 'eth_requestAccounts', params: [] })

            //     console.log(accounts)
            //     account.value = accounts[0]
            //     // .then((res) => {
            //         // account.value = res[0]
            //         // console.log('have accounts ' + res)
            //     // })
            //     // .catch((err) => {
            //         // console.log(err)
            //     // })

            // }else{
            //     console.log('not injected in window')
            // }


            // alert('done')
            // await checkAccounts()
            // await checkNetwork()
            // await watchAsset()
        }

        const swap = async () => {
            // set contract and swap
        }
        
        // window.ethereum.on('accountsChanged', checkAccounts )
        // window.ethereum.on('ccheckAssetsged', (chainChanged) => { console.log('chainChanged', chainChanged) })
        // window.ethereum.on('connect', (connect) => { console.log('connect', connect) })
        // window.ethereum.on('disconnect', (disconnect) => { console.log('disconnect', disconnect) })
        // window.ethereum.on('message', (message) => { console.log('message', message) })

        return {
            account,
            connect,
            checkNetwork,
            watchAsset,
        }
    }
}
</script>
<template>
    <div>
        <h1>Here we go</h1>
        <span>{{ account }}</span>
        <button @click.prevent="connect">Connect</button>
        <button @click.prevent="checkNetwork">checkNetwork</button>
        <button @click.prevent="watchAsset">watchAsset</button>
    </div>
    <!-- <div class="d-flex flex-column justify-content-between">
        <div class="w-100 p-4 bg-white rounded mb-2">
            <div class="w-50 d-flex py-2 align-items-center justify-content-center">
                <h4 class="text-nowrap flex-fill">Wallet Address:</h4>
                <input type="text" v-model="account" readonly
                    class="text-primary text-center form-control-plaintext flex-fill mx-1 px-0" />
                <img v-if="isSupported" src="@/assets/images/icons/copy.png" width="24" height="24" class=""
                    @click.prevent="copy(account)" />
            </div> 
        </div>
        <div class="d-flex flex-row justify-content-between align-items-top space-x-2">
            <div class="w-100 p-5 rounded bg-white">
                <h2 class="text-dark font-bold">Assets</h2>
                <hr />
                <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-start align-items-center">
                        <img src="@/assets/images/icons/BNB.png" width="24" height="24" class="" />
                        <a href="#" class="btn btn-xs btn-auto btn-info ml-2 w-100 px-4"><span>{{ networkSymbol
                        }}</span></a>
                    </div>
                    <div>{{ (networkBalance) ? formatEther(networkBalance) : null }}</div>
                </div>
                <hr />
                <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-start align-items-center">
                        <img src="@/assets/images/icons/Tini.png" width="24" height="24" class="" />
                        <a href="#" class="btn btn-xs btn-auto btn-info ml-2 w-100 px-4"><span>{{ tinSymbol }}</span></a>
                    </div>
                    <div>{{ (tinBalance) ? formatEther(tinBalance) : null }}</div>
                </div>
            </div>
            <div class="w-100 p-5 rounded bg-white mx-2">
                <h2 class="text-dark font-bold">Swap Coins</h2>
                <hr />
                <div class="d-flex justify-content-start align-items-center text-nowrap">
                    <img src="@/assets/images/icons/infocircle.png" width="16" height="16" class="" />
                    <small class="ml-1 w-100 text-sm text-primary">
                        Please enter the quantity of items you wish to exchange
                    </small>
                </div>
                <form class="mt-2 d-flex flex-column" @submit.prevent="submit">
                    <div class="form-group">
                        <label class="font-semibold text-dark">From</label>
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <input type="text" class="form-control rounded-r-full flex-grow-1 mr-2"
                                v-model="networkAmount" />
                            <img src="@/assets/images/icons/BNB.png" width="24" height="24" class="mx-1" />
                            <button class="btn btn-xs btn-auto btn-success px-4">{{ networkSymbol }}</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="font-semibold text-dark">To</label>
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <input type="text" class="form-control rounded-r-full flex-grow-1 mr-2" v-model="tinAmount" />
                            <img src="@/assets/images/icons/Tini.png" width="24" height="24" class="mx-1" />
                            <button class="btn btn-xs btn-auto btn-success px-4">{{ tinSymbol }}</button>
                        </div>
                    </div>
                    <div class="form-group d-flex justify-content-center">
                        <button type="submit" class="btn btn-sm btn-auto btn-info px-4">
                            <img src="@/assets/images/icons/arrowswaphorizontal.png" width="24" height="24" />
                            <span>Swap</span>
                        </button>
                    </div>
                </form>
            </div>
            <div class="w-100 p-5 rounded bg-white d-flex flex-column">
                <div>
                    <h2 class="text-dark font-bold">Staking</h2>
                    <hr />
                </div>
                <div class="d-flex w-100 h-100 align-items-center justify-content-center">
                    <h3><span>Coming Soon!</span></h3>
                </div>
            </div>
        </div>
    </div> -->
</template>