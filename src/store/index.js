import { createStore } from 'vuex'

import swapper from './modules/swapperModule'

const store = createStore({
    modules: { 
        swapper
    }
})

export default store