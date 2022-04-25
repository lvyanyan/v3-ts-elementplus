import { createStore } from 'vuex'

export default createStore({
    state: {
        tags: Array,//标签
        tagName: String,//当前标签
        nodes: Array,//导航
        roles: [],//角色列表
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
        saveNodes(state, val) {
            state.nodes = val
        },
        saveTagName(state, val) {
            state.tagName = val
        },
        saveInfo(state, val) {
            state.userInfo = val
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
        setRoles(context, value) {
            context.commit('saveRoles', value)
        },
        setTagName(context, value) {
            context.commit('saveTagName', value)
        }
    }
})