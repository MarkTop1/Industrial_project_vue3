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
import {getDeptOptions} from "@/api/dept";
import { ref, reactive } from 'vue';
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
const deptList = ref<OptionType[]>(); // 部门下拉数据源

const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10,
});

const roleList = ref<RolePageVO[]>();
const itemlist = ref<RolePageVO[]>();
const fixeditemlist = [
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
itemlist.value = fixeditemlist;


const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  code: "",
  name: "",
  phone: this,
  dict:"",
  dz:"",
  xmmc:"",
  xmbh:"",
});

const rules = reactive({
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  phone:[{required: true, message: "请输入手机号码", trigger: "blur"}],
  dict:[{required: true, message: "请选择所属部门", trigger: "blur"}],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});


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

/** 打开项目表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改项目";
    getRoleForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增项目";
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
import * as XLSX from 'xlsx';

function exportToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, '项目管理.xlsx');
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
/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
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

//引用部门数据
async function loadDeptOptions() {
  getDeptOptions().then((response) => {
    deptList.value = response.data;
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

        <el-form-item prop="itemname" label="项目名称">
          <el-input
            v-model="queryParams.itemname"
            placeholder="输入项目名称"
            clearable
          />
        </el-form-item>

        <el-form-item prop="keywords" label="项目编号">
          <el-input
            v-model="queryParams.keywords"
            placeholder="输入项目编号"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
          ><i-ep-search />搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="ml-3" @click="exportToExcel(fixeditemlist);"><template #icon><i-ep-download /></template>导出</el-button>
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
          :data="itemlist"
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

        <el-form-item label="项目编号" prop="bh">
          <el-input v-model="formData.xmbh" placeholder="请输入项目编号" />
        </el-form-item>

        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="formData.xmmc" placeholder="请输入项目名称" />
        </el-form-item>

        <el-form-item label="项目地址" prop="xmdz">
          <el-input v-model="formData.dz" placeholder="请输入项目地址" />
        </el-form-item>

        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="所属组织" prop="sszz">
          <el-input v-model="formData.dict" placeholder="请选择所属组织" />
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
