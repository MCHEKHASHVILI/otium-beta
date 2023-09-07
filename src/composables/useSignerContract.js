import { ref } from "vue"
import {  BrowserProvider, parseUnits, Contract, parseEther, formatEther } from "ethers"
// import { HDNodeWallet } from "ethers/wallet"
import useLoader from "./useLoader"
import useMetamaskWallet from "./useMetamaskWallet"

import daiAbi from '../assets/tincoinAbi.json'
import presaleAbi from '../assets/presaleAbi.json'

export default function useSignerContract() {

    const { loader, setLoader } = useLoader()
    const { account, accounts, connectWallet, disconnectWallet } = useMetamaskWallet()
    const daiAddress = '0x936bd2C380ddE7FCECD58e3a90DA324981CDB572'
    const presaleAddress = '0xC7f1db70E1C7ADef041E1a07b751AA18eDaF5194'
    const signerContract = ref(null)


    /**
     * TODO:
     * Grab all assets from account.
     * implement max function to take all available BNB balance on the account.
     */
    async function connect(){

        if(typeof window.ethereum !== 'undefined'){

            await connectWallet();

            // let fakeAccount = '0xb74e923ae86221aace92067f639ebca07fe771f5'
            
            const provider = new BrowserProvider(window.ethereum)
            
            console.log('provider:', provider)

            const signer = await provider.getSigner()

            console.log('signer:', signer)

            const contract = new Contract(daiAddress, daiAbi.result, provider);

            console.log('contract:', contract)

            const symbol = await contract.symbol()
            
            console.log('symbol:', symbol)

            const name = await contract.name()

            console.log('name:', name)

            const balance = await contract.balanceOf(account.value)

            console.log('balance of ', account.value, ' is: ',  formatEther(balance))

            const total = await contract.totalSupply()

            console.log('total of ',account.value,' is: ',  formatEther(total))

        }
    }

    async function signConnect()
    {
        await connectWallet()

        const provider = new BrowserProvider(window.ethereum)

        console.log(provider)

        const signer = await provider.getSigner()

        console.log(signer)

        const contract = new Contract(presaleAddress, presaleAbi.result, signer)

        console.log(contract)

        signerContract.value = contract

    }
   
    async function swap()
    {
        const result = signerContract.value.buyTokens({value: parseEther('0.000000000000000002')})

        console.log(result)
    }

    return {
        connect,
        loader,
        account,
        connectWallet,
        disconnectWallet,
        signConnect,
        swap,
    }


}