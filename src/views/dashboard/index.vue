<script setup lang="ts">
import StackedAreaChart from "@/views/dashboard/components/StackedAreaChart.vue";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";
import {RoleForm, RolePageVO, RoleQuery} from "@/api/role/types";

import { getMenuOptions } from "@/api/menu";
import {
  getRolePage,
  updateRole,
  getRoleForm,
  addRole,
  deleteRoles,
  getRoleMenuIds,
  updateRoleMenus,
} from "@/api/role";
import BarChart from "@/views/dashboard/components/BarChart.vue";
import RadarChart from "@/views/dashboard/components/RadarChart.vue";
import PieChart from "@/views/dashboard/components/PieChart.vue";
import { ref, reactive } from 'vue';

const userStore = useUserStore();
const date: Date = new Date();
const duration = 5000;

const total = ref(0);
const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10,
});
const menuRef = ref(ElTree);
const menuList = ref<OptionType[]>([]);
const menuDialogVisible = ref(false);
const ids = ref<number[]>([]);
const loading = ref(false);
const roleList = ref<RolePageVO[]>();

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}
const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  dict: "",
  code: "",
  name: " "
});

const fixedRoleList = [
  {
    id: 1,
    bh: '1001',
    xmmc: '项目一',
    xmdz: '南京市雨花台区',
    lxdh: '10293827136',
    sszz: '测试部门'
  },
  {
    id: 2,
    bh: '1002',
    xmmc: '项目二',
    xmdz: '南京市玄武区',
    lxdh: '10293827133',
    sszz: '测试部门'
  },
  {
    id: 3,
    bh: '1003',
    xmmc: '项目三',
    xmdz: '南京市栖霞区',
    lxdh: '10234918271',
    sszz: '管理部门'
  },
];
roleList.value = fixedRoleList;

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

const dialog = reactive({
  title: "",
  visible: false,
});
/** 打开角色表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改角色";
    getRoleForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增角色";
  }
}


/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteRoles(roleIds)
        .then(() => {
          ElMessage.success("删除成功");
        })
        .finally(() => (loading.value = false));
  });
}
/** 打开分配菜单弹窗 */
function openMenuDialog(row: RolePageVO) {
  const roleId = row.id;
  if (roleId) {
    checkedRole = {
      id: roleId,
      name: row.name,
    };
    menuDialogVisible.value = true;
    loading.value = true;

    // 获取所有的菜单
    getMenuOptions().then((response) => {
      menuList.value = response.data;
      // 回显角色已拥有的菜单
      getRoleMenuIds(roleId)
          .then(({ data }) => {
            const checkedMenuIds = data;
            console.log("勾选权限", checkedMenuIds);
            checkedMenuIds.forEach((menuId) =>
                menuRef.value.setChecked(menuId, true, false)
            );
          })
          .finally(() => {
            loading.value = false;
          });
    });
  }
}
/** 查询 */
function handleQuery() {
  loading.value = true;
  getRolePage(queryParams)
      .then(({ data }) => {
        roleList.value = data.list;
        total.value = data.total;
      })
      .finally(() => {
        loading.value = false;
      });
}

const amount = ref(0);
const amountOutput = useTransition(amount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
amount.value = 1645;


const visitCount = ref(0);
const visitCountOutput = useTransition(visitCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
visitCount.value = 1368;


const dauCount = ref(0);
const dauCountOutput = useTransition(dauCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
dauCount.value = 1425;


const orderCount = ref(0);
const orderCountOutput = useTransition(orderCount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo,
});
orderCount.value = 1354;
</script>

<template>
  <div class="dashboard-container">
    <!-- 数据卡片 -->
    <el-row :gutter="10" class="mt-3">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-[var(--el-text-color-secondary)]">项目</span>
            </div>
          </template>

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              {{ Math.round(visitCountOutput) }}
            </div>
            <svg-icon icon-class="monitor" size="2em" />
          </div>

          <div
              class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 总项目数 </span>
            <span> {{ Math.round(visitCountOutput * 15) }} </span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-[var(--el-text-color-secondary)]">未处理</span>
              <el-tag type="success">日</el-tag>
            </div>
          </template>

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              {{ Math.round(dauCountOutput) }}
            </div>
            <svg-icon icon-class="close" size="2em" />
          </div>

          <div
              class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 总未处理数 </span>
            <span> {{ Math.round(dauCountOutput) }} </span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-[var(--el-text-color-secondary)]">传感器</span>
            </div>
          </template>

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              {{ Math.round(amountOutput) }}
            </div>
            <svg-icon icon-class="cascader" size="2em" />
          </div>

          <div
              class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 总传感器 </span>
            <span> {{ Math.round(amountOutput * 15) }} </span>
          </div>
        </el-card>
      </el-col>

      <!--订单量-->
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-[var(--el-text-color-secondary)]">报错</span>
              <el-tag type="danger">月</el-tag>
            </div>
          </template>

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              {{ Math.round(orderCountOutput) }}
            </div>
            <svg-icon icon-class="security" size="2em" />
          </div>

          <div
              class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 总报错 </span>
            <span> {{ Math.round(orderCountOutput * 15) }} </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="10" class="mt-3">

      <el-col :xs="24" :sm="12" :lg="8" class="mb-2">
        <RadarChart
            id="radarChart"
            height="400px"
            width="100%"
            class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>
      <el-col :sm="24" :lg="8" class="mb-2">
        <BarChart
            id="barChart"
            height="400px"
            width="100%"
            class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-2">
        <PieChart
            id="pieChart"
            height="400px"
            width="100%"
            class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>
    </el-row>


    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-[var(--el-text-color-secondary)]">最近项目</span>
          <router-link to="../item/item">
            <el-button type="success"><i-ep-plus />更多</el-button>
          </router-link>
        </div>
      </template>
      <el-table
          ref="dataTableRef"
          v-loading="loading"
          :data="roleList"
          highlight-current-row
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="项目编号" prop="bh" min-width="80" />
        <el-table-column label="项目名称" prop="xmmc" min-width="80" />
        <el-table-column label="项目地址" prop="xmdz" min-width="80" />
        <el-table-column label="联系电话" prop="lxdh" min-width="80" />
        <el-table-column label="所属组织" prop="sszz" min-width="80" />
      </el-table>

      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery"
      />
    </el-card>


    <el-col :xs="300" :sm="150" :lg="150" class="mb-2">
      <StackedAreaChart
          id="bigChart"
          height="500px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
      />
    </el-col>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>
