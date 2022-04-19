import { createStore } from 'vuex'
import defaultState from '@/store/state'

// Create a new store instance.
export default createStore({
    state() {
        return defaultState
    },
    mutations: {
        // 表格删除
        delTable(state, { id }) {
            const { tableData } = state
            state.tableData = tableData.map(item => {
                if (item.id === id) {
                    item.inventory = item.inventory - 1
                    // state.cartData.unshift(item)
                    this.commit('addCart', item)
                }
                return item
            })
        },
        /* 添加进购物车 */
        addCart(state, { id, price, product_name }) {
            // 如果购物车为空
            if (state.cartData.length < 1) {
                state.cartData.push({
                    id,
                    price,
                    product_name,
                    number: 1
                })
            } else {
                const result = state.cartData.findIndex(item => {
                    return item.id === id
                })
                if (result !== -1) {
                    state.cartData[result].number++
                } else {
                    state.cartData.push({
                        id,
                        price,
                        product_name,
                        number: 1
                    })
                }
            }
        },
        /* 删除商品 */
        delCommodity(state, { id }) {
            // 购物车删除
            state.cartData = state.cartData.filter(item => {
                return item.id !== id
            })
            state.checkList = state.checkList.filter(item => {
                return item.id !== id
            })
            // 商品列表恢复库存
            state.tableData.forEach(item => {
                if (item.id === id) {
                    item.inventory = item.total_number
                }
            })
        },
        /* 数量操作取消 */
        delCancel(state, { id }) {
            state.cartData.forEach(item => {
                if (item.id === id) {
                    item.number++
                }
            })
            console.log(state.cartData);
        },
        /* 购物车修改数量/库存修改 */
        modifyInventory(state, { id, number }) {
            state.tableData.forEach(item => {
                if (item.id === id) {
                    item.inventory = item.total_number - number
                }
            })
        }
    },
})
