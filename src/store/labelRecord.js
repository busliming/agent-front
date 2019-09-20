const labelRecord = {
    state: {
        list:[]
    },

    mutations: {
        setLabelParams:(state,item) => {
            console.log(item);
            state.list = item;
        },
        clearLabelParams:(state) => {
            state.list = [];
        },
    },
    actions: {
        setLabelParams({commit},item){
            commit('setLabelParams',item)
        },
        clearLabelParams({commit}){
            commit('clearLabelParams')
        },
    }
}

export default labelRecord