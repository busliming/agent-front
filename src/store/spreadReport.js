const spreadReport = {
    state: {
        params:JSON.parse(window.sessionStorage.getItem('params')),
        params1:{}
    },

    mutations: {
        SET_ITEM:(state,item) => {
            state.params = item;
            window.sessionStorage.setItem('params',JSON.stringify(item));
        },
        CLEAR_ITEM:(state) => {
            state.params = {};
        },
        SET_ITEM1:(state,item) => {
            state.params1 = item;
        },
    },
    actions: {
        setParams({commit},item){
            commit('SET_ITEM',item)
        },
        clearParams({commit}){
            console.log('已清除');
            commit('CLEAR_ITEM')
        },
        setParams1({commit},item){
            commit('SET_ITEM1',item)
        },

    }
}

export default spreadReport