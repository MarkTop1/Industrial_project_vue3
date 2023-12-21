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
// watch(dateTimeRange, (newVal) => {
// });

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
  name: "",
  dz: "",
});

const logList = ref<RolePageVO[]>();
// 创建包含固定数据的数组
const fixedlogList = [
  {
    id: 1,
    name: 'admin',
    czlx: '添加用户',
    czsj: '2023-11-16 11:39:52',
    cznr: '执行添加操作',
    clzt: 1,
  },
  {
    id: 2,
    name: 'test',
    czlx: '删除数据',
    czsj: '2023-11-03 11:44:45',
    cznr: '执行删除操作',
    clzt: 1,
  },
  {
    id: 3,
    name: 'admin',
    czlx: '删除数据',
    czsj: '2023-11-03 11:44:45',
    cznr: '执行删除操作',
    clzt: 1,
  },
  {
    id: 4,
    name: 'admin',
    czlx: '删除数据',
    czsj: '2023-11-03 11:44:45',
    cznr: '执行删除操作',
    clzt: 1,
  },
  // 可以继续添加更多的固定数据
];

// 将固定数据赋值给 roleList
logList.value = fixedlogList;

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

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}
import * as XLSX from 'xlsx';

function exportToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, '日志管理.xlsx');
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

/** 删除按钮点击事件处理函数 */
function confirmDelete(id: number) {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 用户点击了确定按钮，执行删除逻辑
    // handleDelete(id);
  }).catch(() => {
    // 用户点击了取消按钮，不执行任何操作
  });
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
          resetQuery();
        })
        .finally(() => (loading.value = false));
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
        <el-form-item label="操作时间">
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

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
          ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
          <el-button class="ml-3" @click="exportToExcel(fixedlogList);"><template #icon><i-ep-download /></template>导出</el-button>
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
          :data="logList"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="用户名" prop="name" min-width="80" />
        <el-table-column label="操作类型" prop="czlx" min-width="80" />
        <el-table-column label="操作时间" prop="czsj" min-width="80" />
        <el-table-column label="操作内容" prop="cznr" min-width="80" />
        <el-table-column label="处理状态" align="clzt" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.clzt === 1" type="success">成功执行</el-tag>
            <el-tag v-else type="info">未执行</el-tag>
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
