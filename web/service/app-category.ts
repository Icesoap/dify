import type { Fetcher } from 'swr'
import {del, get, post, put} from './base'
import type {
  AppCategoryResponse,
} from '@/models/app'
import type {CommonResponse, CommonResponseCustom} from "@/models/common";

// 获取应用分类-自己添加的方法
export const fetchAppCategoryList: Fetcher<AppCategoryResponse, { url: string }> = ({ url }) => {
  return get<AppCategoryResponse>(url)
}

// 获取应用分类分页方式-自己添加的方法
export const fetchAppCategoryListPage: Fetcher<AppCategoryResponse, { url: string; page: number; limit: number }> = ({ url, page, limit }) => {
  // return get<AppCategoryResponse>(`${url}?page=${page}&limit=${limit}`)
  return get<AppCategoryResponse>(url, { params: { page, limit } })
}

// 新建应用分类-自己添加的方法
export const addAppCategory: Fetcher<AppCategoryResponse, { categoryName: string }> = ({ categoryName }) => {
  // return get<AppCategoryResponse>(`${url}?page=${page}&limit=${limit}`)
  return post<AppCategoryResponse>('/app_category', { body: { category_name: categoryName } })
}

// 修改应用分类-自己添加的方法
export const updateAppCategory: Fetcher<AppCategoryResponse, { id: string;categoryName: string }> = ({ id, categoryName }) => {
  // return get<AppCategoryResponse>(`${url}?page=${page}&limit=${limit}`)
  // debugger
  return put<AppCategoryResponse>('/app_category', { body: { id, categoryName: categoryName } })
}

export const deleteAppCategory: Fetcher<CommonResponseCustom, string> = (appCategoryID) => {
  return del<CommonResponseCustom>(`app_category_api/${appCategoryID}`)
}

export const updateAppSSO = async ({ id, enabled }: { id: string; enabled: boolean }) => {
  return post('/enterprise/app-setting/sso', { body: { app_id: id, enabled } })
}
