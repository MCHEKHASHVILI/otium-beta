
import { ref } from 'vue'

export default function useLoader(){
    const loader = ref(null)

    const setLoader = (state) => {
        loader.value = state
    }

    return {
        loader,
        setLoader
    }
    
}

 useLoader