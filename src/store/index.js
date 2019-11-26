import Vue from 'vue'
import Vuex from 'vuex'
import i18n from 'static/js/i18n'

Vue.use(Vuex)

const state = { //要设置的全局访问的state对象，初始属性值
  account: null,
  lang: i18n.locale,
  isLoading: true,
  domain: process.env.NODE_ENV == 'development' ? 'http://rpcdev.xinchain.org/' : 'https://rpc.medishares.net/',
}
const getters = { //实时监听state值的变化(最新状态)
  account(state) { //承载变化的值
    return state.account
  },
  isLoading(state) {
    return state.isLoading
  },
  getLang(state) {
    return state.lang
  },
  getDomain(state) {
    return state.domain
  },
}
const mutations = {
  // 设置账号
  setAccount(state, val) {
    state.account = val;
  },
  setLoading(state, val) {
    state.isLoading = val;
  },
  setLang(state, val) {
    i18n.setUserLanguage(val)
    state.lang = val;
  },
  logout(state) {
    state.account = null;
    window.location.reload();
  },
}
const actions = {
  setAccount(context, val) {
    context.commit('setAccount', val)
  },
  setLoading(context, val) {
    context.commit('setLoading', val)
  },
  setLang(context, val) {
    context.commit('setLang', val)
  },
  logout(context) {
    context.commit('logout')
  },
}
export default new Vuex.Store({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
})