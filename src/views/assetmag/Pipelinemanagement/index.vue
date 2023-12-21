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
import {exportUser} from "@/api/user";

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
  name: "",
  gdhb:"",
  ssxm:"",
  gdmc:"",
  bdcgq:"",
  gdmx:"",
  scrq:"",
  ccrq:"",
});

const rules = reactive({
  name: [{ required: true, message: "请输入管道名称", trigger: "blur" }],
  xhbh: [{ required: true, message: "请输入型号编号", trigger: "blur" }],
  cjsj: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
  gdxh: [{ required: true, message: "请输入管道型号", trigger: "blur" }],

  // code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
});
const roleList = ref<RolePageVO[]>();

const Pipelinemanagement = ref<RolePageVO[]>();
const fixedPipelinemanagement = [
  { id: 1, gdbh: 'PZJ001', gdmc: '膨胀节001', gdmx: '管道模型1', ssxm: '项目一', bdcgq: '传感器模型1', scrq: '2023-11-17 08:38:17', ccrq: '2023-11-17 08:38:24' },
  { id: 2, gdbh: 'PZJ002', gdmc: '膨胀节002', gdmx: '管道模型2', ssxm: '项目二', bdcgq: '传感器模型1', scrq: '2023-11-17 08:40:41', ccrq: '2023-11-17 08:40:45' },
  { id: 3, gdbh: 'PZJ003', gdmc: '膨胀节003', gdmx: '管道模型3', ssxm: '项目三', bdcgq: '传感器模型1', scrq: '2023-11-17 08:42:01', ccrq: '2023-11-17 08:42:05' },
  { id: 4, gdbh: 'PZJ004', gdmc: '膨胀节004', gdmx: '管道模型4', ssxm: '项目一', bdcgq: '传感器模型1', scrq: '2023-11-17 08:42:01', ccrq: '2023-11-17 08:42:05' },
  { id: 5, gdbh: 'PZJ005', gdmc: '膨胀节005', gdmx: '管道模型5', ssxm: '项目二', bdcgq: '传感器模型2', scrq: '2023-11-17 08:42:01', ccrq: '2023-11-17 08:42:05' },
];
Pipelinemanagement.value = fixedPipelinemanagement;

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

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
/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开角色表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改角色";
    getRoleForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增传感器";
  }
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
//导出
function handleExport() {
  exportUser(queryParams).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
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
import * as XLSX from 'xlsx';

function exportToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, '传感器管理.xlsx');
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
              placeholder="管道名称"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
          ><i-ep-search />搜索</el-button
          >
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
          <el-button class="ml-3" @click="exportToExcel(fixedPipelinemanagement);"><template #icon><i-ep-download /></template>导出</el-button>

        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"
        ><i-ep-plus />新增</el-button
        >
        <el-button
            type="danger"
            :disabled="ids.length === 0"
        ><i-ep-delete />删除</el-button
        >
      </template>

      <el-table
          ref="dataTableRef"
          v-loading="loading"
          highlight-current-row
          border
          :data="Pipelinemanagement"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="60" />
        <el-table-column label="管道编号" prop="gdbh" min-width="70" />
        <el-table-column label="管道名称" prop="gdmc" min-width="70" />
        <el-table-column label="管道模型" prop="gdmx" min-width="70" />
        <el-table-column label="所属项目" prop="ssxm" min-width="70" />
        <el-table-column label="绑定传感器" prop="bdcgq" min-width="70" />
        <el-table-column label="生产日期" prop="scrq" min-width="70" />
        <el-table-column label="出厂日期" prop="ccrq" min-width="70" />
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <el-button
                type="primary"
                size="small"
                link
                @click="openDialog(scope.row.id)"
            >
              <i-ep-edit />编辑
            </el-button>
            <el-button
                type="primary"
                size="small"
                link
                @click="confirmDelete(scope.row.id)"
            >
              <i-ep-delete />删除
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

    <!-- 角色表单弹窗 -->
    <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="500px"
        @close="closeDialog"
    >
      <el-form
          ref="roleFormRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="管道编号" prop="gdhb">
          <el-input v-model="formData.gdhb" placeholder="请输入管道编号" />
        </el-form-item>
        <el-form-item label="所属项目" prop="ssxm">
          <el-input v-model="formData.ssxm" placeholder="请输入所属项目" />
        </el-form-item>
        <el-form-item label="管道名称" prop="gdmc">
          <el-input v-model="formData.gdmc" placeholder="请输入管道名称" />
        </el-form-item>
        <el-form-item label="绑定传感器" prop="bdcgq">
          <el-input v-model="formData.bdcgq" placeholder="请输入传感器" />
        </el-form-item>
        <el-form-item label="管道模型" prop="gdmx">
          <el-input v-model="formData.gdmx" placeholder="请输入管道模型" />
        </el-form-item>
        <el-form-item label="生产日期" prop="scrq">
          <el-input v-model="formData.scrq" placeholder="请输入生产日期" />
        </el-form-item>
        <el-form-item label="出厂日期" prop="ccrq">
          <el-input v-model="formData.ccrq" placeholder="请输入出厂日期" />
        </el-form-item>

      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
