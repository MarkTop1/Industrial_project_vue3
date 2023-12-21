// import request from "@/utils/request";
// import { AxiosPromise } from "axios";
// import { UserForm, UserInfo, UserPageVO, UserQuery } from "./types";
//
// /**
//  * 登录成功后获取项目信息
//  */
// export function getUserInfoApi(): AxiosPromise<UserInfo> {
//   return request({
//     url: "/api/v1/users/me",
//     method: "get",
//   });
// }
//
// /**
//  * 获取用户分页列表
//  *
//  * @param queryParams
//  */
// export function getUserPage(
//   queryParams: UserQuery
// ): AxiosPromise<PageResult<UserPageVO[]>> {
//   return request({
//     url: "/api/v1/users/page",
//     method: "get",
//     params: queryParams,
//   });
// }
//
// /**
//  * 获取用户表单详情
//  *
//  * @param userId
//  */
// export function getUserForm(userId: number): AxiosPromise<UserForm> {
//   return request({
//     url: "/api/v1/users/" + userId + "/form",
//     method: "get",
//   });
// }
