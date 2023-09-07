import { ref } from 'vue'

export default function useMetamaskWallet() {

    const account = ref(null)
    const accounts = ref([])

    /**
     * after connect we must check the available networks
     * find there BNB network and if there is no such network we must add it to metamask from website.
     * 
     */
    async function connectWallet() {
        try {
            const { ethereum } = window

            if (!ethereum) {
                alert('Must connect to MetaMask!')
                return
            }

            accounts.value = await ethereum.request({ method: 'eth_requestAccounts' })
            // set default account
            account.value = accounts.value[0]

        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Disconnect can be made using events.
     * accountchanged, disconnect
     */
    async function disconnectWallet() {
        // initiate disconnect event somehow.
    }

    return {
        account,
        accounts,
        connectWallet,
        disconnectWallet,
    }
}