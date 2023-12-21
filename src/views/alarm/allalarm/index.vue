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

import * as XLSX from 'xlsx';

function exportToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, '全部报警.xlsx');
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

const roleList = ref<RolePageVO[]>();

const alarmlist = ref<RolePageVO[]>();
const fixedalarmlist = [
  {
    id: 1,
    bjsj: '2023-11-01 08:00:00',
    bjsb: '传感器01',
    sjdmc: '数据点1',
    dqz: '70℃',
    bjnr: '温度过高',
    clr: 'admin',
    clfs: '自动处理',
    clzt: 1,
  },
  {
    id: 2,
    bjsj: '2023-11-02 08:00:00',
    bjsb: '传感器02',
    sjdmc: '数据点2',
    dqz: '50pa',
    bjnr: '压力过高',
    clr: 'admin',
    clfs: '自动处理',
    clzt: 1,
  },
  {
    id: 3,
    bjsj: '2023-11-02 08:00:00',
    bjsb: '传感器03',
    sjdmc: '数据点3',
    dqz: '46pa',
    bjnr: '压力过高',
    clr: 'admin',
    clfs: '自动处理',
    clzt: 1,
  },
  {
    id: 4,
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

alarmlist.value = fixedalarmlist;
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

/** 重置表单 */
function resetForm() {
    roleFormRef.value.resetFields();
    roleFormRef.value.clearValidate();

    formData.id = undefined;
    formData.sort = 1;
    formData.status = 1;
}
/** 删除按钮点击事件处理函数 */
function confirmDelete(id: number) {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 用户点击了确定按钮，执行删除逻辑
    handleDelete(id);
  }).catch(() => {
    // 用户点击了取消按钮，不执行任何操作
  });
}

/** 删除数据的逻辑 */
function handleDelete(id: number) {
  const index = alarmlist.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    alarmlist.value.splice(index, 1); // 从alarmlist数组中删除对应的数据
  }
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
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                    ><i-ep-search />搜索</el-button
                    >
                    <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
                  <el-button class="ml-3" @click="exportToExcel(fixedalarmlist);"><template #icon><i-ep-download /></template>导出</el-button>
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
                    :data="alarmlist"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" prop="id" min-width="80" />
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
    </div>
</template>
