<!-- 用户管理 -->
<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import {
  getUserPage,
  getUserForm,
  deleteUsers,
  addUser,
  updateUser,
  updateUserPassword,
  downloadTemplateApi,
  exportUser,
  importUser,
} from "@/api/user";
import { getDeptOptions } from "@/api/dept";
import { getRoleOptions } from "@/api/role";

import { UserForm, UserQuery, UserPageVO } from "@/api/user/types";
import type { UploadInstance } from "element-plus";
import { genFileId } from "element-plus";
import newlogecharts from "/src/views/monitor/newlogecharts.vue";

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单
const uploadRef = ref<UploadInstance>(); // 上传组件

const loading = ref(false); //  加载状态
const removeIds = ref([]); // 删除用户ID集合 用于批量删除
const queryParams = reactive<UserQuery>({
  pageNum: 1,
  pageSize: 10,
});
const dateTimeRange = ref("");
const total = ref(0); // 数据总数
const pageData = ref<UserPageVO[]>(); // 用户分页数据
const deptList = ref<OptionType[]>(); // 部门下拉数据源
const roleList = ref<OptionType[]>(); // 角色下拉数据源

watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.startTime = newVal[0];
    queryParams.endTime = newVal[1];
  }
});

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "user-form",
  width: 800,
  title: "",
});

// 用户表单数据
const formData = reactive<UserForm>({
  status: 1,
});

// 用户导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: [],
});

// 校验规则
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getUserPage(queryParams)
    .then(({ data }) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  dateTimeRange.value = "";
  queryParams.pageNum = 1;
  queryParams.deptId = undefined;
  queryParams.startTime = undefined;
  queryParams.endTime = undefined;
  handleQuery();
}

/** 行选中 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 重置密码 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(({ value }) => {
    if (!value) {
      ElMessage.warning("请输入新密码");
      return false;
    }
    updateUserPassword(row.id, value).then(() => {
      ElMessage.success("密码重置成功，新密码是：" + value);
    });
  });
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  getRoleOptions().then((response) => {
    roleList.value = response.data;
  });
}

/** 加载部门下拉数据源 */
async function loadDeptOptions() {
  getDeptOptions().then((response) => {
    deptList.value = response.data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "user-form") {
    // 用户表单弹窗
    await loadDeptOptions();
    await loadRoleOptions();
    if (id) {
      dialog.title = "修改用户";
      getUserForm(id).then(({ data }) => {
        Object.assign(formData, { ...data });
      });
    } else {
      dialog.title = "新增用户";
    }
  } else if (dialog.type === "user-import") {
    // 用户导入弹窗
    dialog.title = "导入用户";
    dialog.width = 600;
    loadDeptOptions();
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "user-form") {
    userFormRef.value.resetFields();
    userFormRef.value.clearValidate();

    formData.id = undefined;
    formData.status = 1;
  } else if (dialog.type === "user-import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "user-form") {
    userFormRef.value.validate((valid: any) => {
      if (valid) {
        const userId = formData.id;
        loading.value = true;
        if (userId) {
          updateUser(userId, formData)
            .then(() => {
              ElMessage.success("修改用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        } else {
          addUser(formData)
            .then(() => {
              ElMessage.success("新增用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        }
      }
    });
  } else if (dialog.type === "user-import") {
    if (!importData?.deptId) {
      ElMessage.warning("请选择部门");
      return false;
    }
    if (!importData?.file) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    importUser(importData?.deptId, importData?.file).then((response) => {
      ElMessage.success(response.data);
      closeDialog();
      resetQuery();
    });
  }
}, 3000);

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    deleteUsers(userIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/** 下载导入模板 */
function downloadTemplate() {
  downloadTemplateApi().then((response: any) => {
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

/** Excel文件 Change */
function handleFileChange(file: any) {
  importData.file = file.raw;
  console.log(importData.file);
}

/** Excel文件 Exceed  */
function handleFileExceed(files: any) {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  importData.file = file;
}

/** 导出用户 */
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

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20" class="mt-3">
      <!-- 项目监测树 -->
<!--      <el-col :lg="4" :xs="24" class="mb-[12px]">-->
<!--        <newlog-tree v-model="queryParams.deptId" @node-click="handleQuery" />-->
<!--      </el-col>-->

      <!-- 数据卡片 -->
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              <p>管道1</p>
            </div>
            <svg-icon icon-class="monitor" size="2em" />
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 状态 </span>
            <span> <p>正常</p> </span>
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 传感器数量 </span>
            <span> <p>1</p> </span>
            <span> <button>详情</button> </span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">

          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              <p>管道2</p>
            </div>
            <svg-icon icon-class="monitor" size="2em" />
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 状态 </span>
            <span> <p>正常</p> </span>
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 传感器数量 </span>
            <span> <p>1</p> </span>
              <span> <button>详情</button> </span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="never">
          <div class="flex items-center justify-between mt-5">
            <div class="text-lg text-right">
              <p>管道3</p>
            </div>
            <svg-icon icon-class="monitor" size="2em" />
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 状态 </span>
            <span> <p>正常</p> </span>
          </div>
          <div
            class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
          >
            <span> 传感器数量 </span>
            <span> <p>1</p> </span>
            <span> <button>详情</button> </span>
          </div>
        </el-card>
      </el-col>

        <el-col :xs="24" :sm="12" :lg="6">
            <el-card shadow="never">
                <div class="flex items-center justify-between mt-5">
                    <div class="text-lg text-right">
                        <p>管道4</p>
                    </div>
                    <svg-icon icon-class="monitor" size="2em" />
                </div>
                <div
                        class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
                >
                    <span> 状态 </span>
                    <span> <p>正常</p> </span>
                </div>
                <div
                        class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]"
                >
                    <span> 传感器数量 </span>
                    <span> <p>1</p> </span>
                    <span> <button>详情</button> </span>
                </div>
            </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :lg="6">
              <p> </p>
        </el-col>

      <el-col>
        <div class="dashboard-container">
          <el-col :xs="300" :sm="150" :lg="150" class="mb-2">
            <newlogecharts
              id="bigChart"
              height="500px"
              width="100%"
              class="bg-[var(--el-bg-color-overlay)]"
            />
          </el-col>
        </div>
      </el-col>

    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      append-to-body
      @close="closeDialog"
    >
      <!-- 用户新增/编辑表单 -->
      <el-form
        v-if="dialog.type === 'user-form'"
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptList"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <dictionary v-model="formData.gender" type-code="gender" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 用户导入表单 -->
      <el-form
        v-else-if="dialog.type === 'user-import'"
        :model="importData"
        label-width="100px"
      >
        <el-form-item label="部门">
          <el-tree-select
            v-model="importData.deptId"
            placeholder="请选择部门"
            :data="deptList"
            filterable
            check-strictly
          />
        </el-form-item>

        <el-form-item label="Excel文件">
          <el-upload
            ref="uploadRef"
            action=""
            drag
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :limit="1"
            :auto-upload="false"
            :file-list="importData.fileList"
            :on-change="handleFileChange"
            :on-exceed="handleFileExceed"
          >
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div>xls/xlsx files</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
