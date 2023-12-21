<script setup lang="ts">
// import {
//   getRolePage,
// } from "@/api/role";
import { RolePageVO, RoleForm, RoleQuery } from "@/api/role/types";
import {getRolePage} from "@/api/role";

defineOptions({
  name: "Role",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);
const menuRef = ref(ElTree);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10,
});

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  dict: "",
  code: "",
  name: ""
});

const rules = reactive({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

const menuDialogVisible = ref(false);
const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});
const roleList = ref<RolePageVO[]>();
const Historycallog = ref<RolePageVO[]>();

const fixedHistorycallog = [
  { id: 1, ssxm: '项目一', cpmc: '压力监测产品', cgq: '压力传感器', shd: '数据点1', dqz: '50pa', bjxx: '正常', clzt: 1 },
  { id: 2, ssxm: '项目二', cpmc: '温度监测产品', cgq: '温度传感器', shd: '数据点2', dqz: '90℃', bjxx: '温度过高', clzt: 0 },
  { id: 3, ssxm: '项目三', cpmc: '温度监测产品', cgq: '温度传感器', shd: '数据点2', dqz: '91℃', bjxx: '温度过高', clzt: 0 },
  { id: 4, ssxm: '项目一', cpmc: '温度监测产品', cgq: '温度传感器', shd: '数据点2', dqz: '92℃', bjxx: '温度过高', clzt: 0 },
  { id: 5, ssxm: '项目一', cpmc: '温度监测产品', cgq: '温度传感器', shd: '数据点2', dqz: '60℃', bjxx: '正常', clzt: 1 },
];
Historycallog.value = fixedHistorycallog;

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

/** 查询 */
function handleQuery() {
  loading.value = true;
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  getRolePage(queryParams)
      .then(({ data }) => {
        roleList.value = data.list;
        total.value = data.total;
      })
      .finally(() => {
        loading.value = false;
      });
}
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
              v-model="queryParams.keywords"
              placeholder="输入关键字"
              clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
          ><i-ep-search />搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table
          ref="dataTableRef"
          v-loading="loading"
          highlight-current-row
          border
          :data="Historycallog"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="所属项目" prop="ssxm" min-width="80" />
        <el-table-column label="产品名称" prop="cpmc" min-width="80" />
        <el-table-column label="传感器" prop="cgq" min-width="80" />
        <el-table-column label="数据点" prop="shd" min-width="80" />
        <el-table-column label="当前值" prop="dqz" min-width="80" />
        <el-table-column label="报警信息" prop="bjxx" min-width="80" />
        <el-table-column label="处理状态" align="clzt" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.clzt === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">异常</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-if="total > 0"
          v-model:total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
