<script setup lang="ts">
import {
  getRolePage,
  updateRole,
  getRoleForm,
  addRole,
  deleteRoles,
  getRoleMenuIds,
  updateRoleMenus,
} from "@/api/role";
import { getMenuOptions } from "@/api/menu";

import { RolePageVO, RoleForm, RoleQuery } from "@/api/role/types";

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
const dateTimeRange = ref("");


const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10,
});

const roleList = ref<RolePageVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  dict: "",
  code: "",
  name: " "
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
/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  dateTimeRange.value = "";

  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}



/** 角色保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        updateRole(roleId, formData)
            .then(() => {
              ElMessage.success("修改成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
      } else {
        addRole(formData)
            .then(() => {
              ElMessage.success("新增成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
      }
    }
  });
}
import * as XLSX from 'xlsx';

function exportToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, '未处理报警.xlsx');
}

function saveAsExcelFile(buffer: any, fileName: string) {
  const data = new Blob([buffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}
const Noalarm = ref<RolePageVO[]>();

const fixedNoalarm = [
  {
    id: 4,
    sszh:'测试',
    bjsj: '2023-11-07 08:00:00',
    bjsb: '传感器01',
    sjdmc: '数据点4',
    dqz: '60pa',
    bjnr: '压力过高',
    clr: 'test',
    clfs: '自动处理',
    clzt: 0,
  },
  {
    id: 5,
    sszh:'测试',
    bjsj: '2023-11-08 08:00:00',
    bjsb: '传感器03',
    sjdmc: '数据点4',
    dqz: '60pa',
    bjnr: '压力过高',
    clr: 'test',
    clfs: '自动处理',
    clzt: 0,
  },
  // 可以继续添加更多的固定数据
];

function handleProcess(id: number) {
  if (Noalarm.value) {
    const index = Noalarm.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      Noalarm.value.splice(index, 1); // 从Noalarm数组中删除对应的数据
    }
  }
}
Noalarm.value = fixedNoalarm;
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
function refreshPage(){
  window.location.reload(); // 使用window.location.reload()来刷新页面
}
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="报警时间">
          <el-date-picker
              class="!w-[240px]"
              v-model="dateTimeRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="截止时间"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item prop="keywords" label="关键字">
          <el-input
              v-model="queryParams.keywords"
              placeholder="输入关键字"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
          ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
          <el-button class="ml-3" @click="exportToExcel(fixedNoalarm);"><template #icon><i-ep-download /></template>导出</el-button>
          <el-button type="success" @click="refreshPage"><i-ep-refresh />刷新一次</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table
          ref="dataTableRef"
          v-loading="loading"
          highlight-current-row
          border
          :data="Noalarm"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="所属租户" prop="sszh" min-width="80" />
        <el-table-column label="报警时间" prop="bjsj" min-width="80" />
        <el-table-column label="报警设备" prop="bjsb" min-width="80" />
        <el-table-column label="数据点名称" prop="sjdmc" min-width="80" />
        <el-table-column label="当前值" prop="dqz" min-width="80" />
        <el-table-column label="报警内容" prop="bjnr" min-width="80" />
        <el-table-column label="处理人" prop="clr" min-width="80" />
        <el-table-column label="处理方式" prop="clfs" min-width="80" />
        <el-table-column label="处理状态" align="clzt" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.clzt === 1" type="success">已处理</el-tag>
            <el-tag v-else type="info">未处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
                type="primary"
                size="small"
                link
                @click="handleProcess(scope.row.id)"
            >处理
            </el-button>
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
