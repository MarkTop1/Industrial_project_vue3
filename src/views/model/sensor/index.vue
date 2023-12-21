<script setup lang="ts">
import {
  getRolePage,
  updateRole,
  getRoleForm,
  addRole,
  deleteRoles,
} from "@/api/role";
// import { getMenuOptions } from "@/api/menu";

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
  dict:"",
  code:"",
  name:"",
  gdmc:"",
  xhbm:"",
  gdxh:"",
  cjsj:"",
});

const rules = reactive({
  name: [{ required: true, message: "请输入管道名称", trigger: "blur" }],
  xhbm: [{ required: true, message: "请输入型号编码", trigger: "blur" }],
  gdxh: [{ required: true, message: "请输入管道型号", trigger: "blur" }],
  cjsj: [{ required: true, message: "请输入创建时间", trigger: "blur" }],

  // code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

const Sensor = ref<RolePageVO[]>();
// 创建包含固定数据的数组
const fixedSensor = [
  {
    id: 1,
    xhbh: 'GDCGQ001',
    gdmc: '温度传感器',
    gdxh: '管道型号001',
    cjsj: '2023-12-20 05:02:00',
  },
  {
    id: 2,
    xhbh: 'GDCGQ002',
    gdmc: '压力传感器',
    gdxh: '管道型号002',
    cjsj: '2023-12-20 05:02:00',
  },
  {
    id: 3,
    xhbh: 'GDCGQ003',
    gdmc: '位移传感器',
    gdxh: '管道型号003',
    cjsj: '2023-12-20 05:02:00',
  },
  {
    id: 4,
    xhbh: 'GDCGQ004',
    gdmc: '压力传感器',
    gdxh: '管道型号004',
    cjsj: '2023-12-20 05:02:00',
  },
];

Sensor.value = fixedSensor;

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
    dialog.title = "新增管道模型";
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
  saveAsExcelFile(excelBuffer, '工业管道模型.xlsx');
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
          <el-button class="ml-3" @click="exportToExcel(fixedSensor);"><template #icon><i-ep-download /></template>导出</el-button>

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
          @click="handleDelete()"
        ><i-ep-delete />删除</el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        highlight-current-row
        border
        :data="Sensor"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" min-width="60" />
        <el-table-column label="型号编码" prop="xhbh" min-width="70" />
        <el-table-column label="管道名称" prop="gdmc" min-width="70" />
        <el-table-column label="管道型号" prop="gdxh" min-width="70" />
        <el-table-column label="创建时间" prop="cjsj" min-width="70" />

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
              @click="handleDelete(scope.row.id)"
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
        <el-form-item label="管道名称" prop="gdmc">
          <el-input v-model="formData.gdmc" placeholder="请输入管道名称" />
        </el-form-item>
        <el-form-item label="型号编码" prop="xhbm">
          <el-input v-model="formData.xhbm" placeholder="请输入型号编码" />
        </el-form-item>
        <el-form-item label="管道型号" prop="gdxh">
          <el-input v-model="formData.gdxh" placeholder="请输入管道型号" />
        </el-form-item>
        <el-form-item label="创建时间" prop="cjsj">
          <el-input v-model="formData.cjsj" placeholder="请输入创建时间" />
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
