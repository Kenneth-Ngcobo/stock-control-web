export const state = () => ({
    item: {}
})


export const mutations = {
    SET_ITEM(state, item) {
        console.log("bom mutations SET_ITEM item =",item);
        state.item = item || {}
    }
}