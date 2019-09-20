const levelRecord = {
    state: {
        list:[],
        listName:[]
    },

    mutations: {
        setLevelParams:(state,item) => {
            console.log(item);
            state.list = item;
        },
        clearLevelParams:(state) => {
            state.list = [];
        },
        setLevelParams1:(state,item) => {
            console.log(item);
            state.listName = item;
        },
        clearLevelParams1:(state) => {
            state.listName = [];
        },
    },
    actions: {
        setLevelParams({commit},item){
            commit('setLevelParams',item)
        },
        clearLevelParams({commit}){
            commit('clearLevelParams')
        },
        setLevelParams1({commit},item){
            commit('setLevelParams1',item)
        },
        clearLevelParams1({commit}){
            commit('clearLevelParams1')
        },
    }
}

export default levelRecord