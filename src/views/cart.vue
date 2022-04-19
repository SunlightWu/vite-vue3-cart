<template>
  <el-row :gutter="20">
    <el-col :xs="0" :sm="4" :md="3" :lg="2" :xl="1"></el-col>
    <el-col :xs="22" :sm="20" :md="18" :lg="16" :xl="10">
      <div class="cart">
        <el-button type="primary" @click="router.go(-1)">返回</el-button>
      </div>
      <el-table
        ref="multipleTableRef"
        class="table-flex"
        :data="store.state.cartData"
        style="width: 100%"
        fit
        border
        empty-text="购物车空空，快去选购吧！"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
        <el-table-column label="商品名称" min-width="100" prop="product_name" align="center" />
        <!-- <template #default="scope">{{ scope.row.product_name }}</template> -->
        <el-table-column label="单价" min-width="100" prop="price" align="center">
          <template #default="scope">{{ price[scope.$index] }}￥</template>
        </el-table-column>

        <el-table-column label="数量" min-width="180" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.number"
              :min="0"
              :max="maxNumber[scope.$index]"
              @change="handleChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" min-width="100" align="center">
          <template #default="scope">{{ subtotal[scope.$index] }}￥</template>
        </el-table-column>

        <el-table-column fixed="right" min-width="80" label="操作" align="center">
          <template #default="scope">
            <el-button type="danger" @click="del(scope.row)" :icon="Delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cart">
        <el-button type="warning" @click="pay">支付 {{ checked_price }} ￥</el-button>
      </div>
    </el-col>
    <el-col :xs="0" :sm="4" :md="3" :lg="2" :xl="1"></el-col>
  </el-row>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { formatPrice } from '@/utils/format.js'
const router = useRouter()
const store = useStore()
const multipleTableRef = ref(null)
/* 初始化加载勾选商品 */
onMounted(() => {
  store.state.checkList.forEach(item => {
    multipleTableRef.value.toggleRowSelection(item, true)
  })
})
const handleSelectionChange = (val) => {
  store.state.checkList = val
}
/* 记住勾选状态 */
const getRowKey = ((row) => {
  return row.id
})
/* 计算选中商品价格 */
const checked_price = computed(() => {
  let total_price = 0
  store.state.checkList.forEach(item => {
    total_price += item.price * item.number
  })
  return formatPrice(total_price)
})

/* 修改数量 */
const handleChange = ({ id, number }) => {
  if (number < 1) {
    ElMessageBox.confirm(
      '是否确认删除？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        store.commit('delCommodity', { id })
      })
      .catch((err) => {
        store.commit('delCancel', { id })
      })
  } else {
    store.commit('modifyInventory', { id, number })
  }
}

/* 数量最大件 */
const maxNumber = computed(() => {
  let maxNumberList = []
  store.state.cartData.forEach(item => {
    store.state.tableData.forEach(ele => {
      if (item.id === ele.id) {
        maxNumberList.push(ele.total_number)
      }
    })
  })
  return maxNumberList
})

/* 单价 格式化 */
const price = computed(() => {
  let priceList = []
  store.state.cartData.forEach(item => {
    priceList.push(formatPrice(item.price * 1))
  })
  return priceList
})

/* 小计  计算/格式化 */
const subtotal = computed(() => {
  let subtotalList = []
  store.state.cartData.forEach(item => {
    subtotalList.push(formatPrice(item.number * item.price))
  })
  return subtotalList
})

/* 删除购物车商品 */
const del = (({ id }) => {
  ElMessageBox.confirm(
    '是否确认删除？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      store.commit('delCommodity', { id })
    })
    .catch((err) => {
      console.log(err);
    })
})

/* 支付 */
const pay = (() => {
  ElMessage({
    message: '支付成功！',
    type: 'success',
  })
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