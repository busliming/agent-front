const auditRecord = {
  state: {
    params:{},
    DomainLis:'',
  },

  mutations: {
    SET_ITEM:(state,item) => {
      state.params = item;
    },
    CLEAR_ITEM:(state) => {
      state.params = {};
    },
    SET_DOMAIN:(state,item) =>{
      state.DomainLis=item
    }
  },
  actions: {
    setAuditParams({commit},item){
      commit('SET_ITEM',item)
    },
    clearAuditParams({commit}){
      console.log('已清除');
      commit('CLEAR_ITEM')
    },
    SetMainSiteDomainList({commit},item){
      commit('SET_DOMAIN',item)
    },
  }
}

export default auditRecord