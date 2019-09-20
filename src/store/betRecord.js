const betRecord = {
  state: {
    params:{}
  },

  mutations: {
    SET_ITEM:(state,item) => {
      console.log(item);
      state.params = item;
    },
    CLEAR_ITEM:(state) => {
      state.params = {};
    },
  },
  actions: {
    setBetParams({commit},item){
      commit('SET_ITEM',item)
    },
    clearBetParams({commit}){
      commit('CLEAR_ITEM')
    },
  }
}

export default betRecord