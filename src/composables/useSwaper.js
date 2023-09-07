import { ref, watch } from 'vue'
import { getNumber, formatEther } from 'ethers'

import { networkBalance, rate, swap } from '../interceptors/swaper'
export {
    account,
    tinBalance,
    tinSymbol,
    networkBalance,
    networkSymbol,
    connect
} from '../interceptors/swaper'

export const networkAmount = ref(null)
export const tinAmount = ref(null)

watch(networkAmount,(amount) => {
    tinAmount.value = amount * getNumber(rate.value)
})
watch(tinAmount,(amount) => {
    networkAmount.value = amount / getNumber(rate.value)
})

export async function submit(){
    await swap(networkAmount.value)
}

export function buyMax(){ 
    networkAmount.value = formatEther(networkBalance.value)
}