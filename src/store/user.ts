import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { GlobalStoreStateProps } from './index';

export interface UserDataProps {
  data: {
    isLogin: boolean;
    userName?: string;    
  }

}


const state: UserDataProps = {
  data: {
    isLogin: false,
  }
  
};

// getters
const getters: GetterTree<UserDataProps, GlobalStoreStateProps> = {
};

// actions
const actions: ActionTree<UserDataProps, GlobalStoreStateProps> = {
  login({ commit }) {
    commit('userLogin');
  },
  logout({ commit }) {
    commit('userLogout');
  }
};

// mutations
const mutations: MutationTree<UserDataProps> = {
  userLogin(state) {
    state.data = {
      ...state.data,
      isLogin : true,
      userName : 'fesa'
    }

  },
  userLogout(state) {
    state.data = {
      isLogin : false,
    }
  }
};

const user: Module<UserDataProps, GlobalStoreStateProps> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
export default user;