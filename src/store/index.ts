import { isContext } from 'vm'
import { createStore } from 'vuex'

export default createStore({
    state: {
        tags: Array,//标签
        tagName: String,//当前标签
        navicate: JSON.stringify([]),//导航
        roles: [],//角色列表
        btns: null,
        userInfo: JSON.stringify({
            userNo: '123456',
            userNm: 'admin',
            userLoginNm: 'admin'
        }),//用户信息
    },
    mutations: {
        saveTags(state, val) {
            state.tags = val
        },
        saveTagName(state, val) {
            state.tagName = val
        },
        saveBtns(state, val) {
            state.btns = val
        },
        saveInfo(state, val) {
            state.userInfo = val
        },
        saveNavicate(state, val) {
            state.navicate = val
        },
        saveRoles(state, val) {
            state.roles = val
        }
    },
    actions: {
        setTags(context, value) {
            context.commit('saveTags', value)
        },
        setInfo(context, value) {
            context.commit('saveInfo', value)
        },
        setBtns(context, value) {
            context.commit('saveBtns', value)
        },
        setRoles(context, value) {
            context.commit('saveRoles', value)
        },
        setNavicate(context, value) {
            context.commit('saveNavicate', value)
        },
        setTagName(context, value) {
            context.commit('saveTagName', value)
        }
    }
})