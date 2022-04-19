<template>
  <el-row :gutter="20">
    <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="1"></el-col>
    <el-col :xs="22" :sm="20" :md="18" :lg="16" :xl="10">
      <div class="cart">
        <el-button
          :icon="ShoppingCart"
          type="warning"
          @click="toCart"
        >购物车 {{ cartData.length > 0 ? cartData.length : '' }}</el-button>
      </div>

      <el-table class="table-flex" :data="tableData" border style="width: 100%">
        <template v-for="(v, k) in state.tableColumnList" :key="k">
          <el-table-column
            v-if="v.label === '单价'"
            :prop="v.prop"
            :label="v.label"
            :min-width="v.width"
            align="center"
          >
            <template #default="scope">{{ price[scope.$index] }} ￥</template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="v.prop"
            :label="v.label"
            :min-width="v.width"
            align="center"
          />
        </template>
        <el-table-column fixed="right" min-width="165" align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" :icon="ShoppingCart" @click="addCart(scope.row)">添加购物车</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="1"></el-col>
  </el-row>
</template>
<script setup>import { ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import List from '@/utils/tableColumnList.js'
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { formatPrice } from '@/utils/format.js'
const state = reactive({
  tableColumnList: List,
})
const store = useStore()
const { state: { tableData, cartData } } = store
// 添加到购物车
const addCart = ({ id, inventory }) => {
  if (inventory < 1) {
    return ElMessage({
      message: '抱歉噢！这边库存不够了！',
      type: 'warning',
    })
  }
  store.commit('delTable', { id })
}

// 跳转购物车
const router = useRouter()
const toCart = (() => {
  router.push({
    path: '/cart'
  })
})

/* 单价 格式化 */
const price = computed(() => {
  let priceList = []
  store.state.tableData.forEach(item => {
    priceList.push(formatPrice(item.price * 1))
  })
  return priceList
})
</script>


<style lang="less" scoped>
.el-row {
  display: flex;
  justify-content: center;
  // align-items: center;
  .cart {
    margin-top: 100px;
    text-align: right;
  }
  .table-flex {
    margin-top: 20px;
  }
}
</style>