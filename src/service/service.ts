import RequestAxios from '@/service/index'
import { method } from 'lodash-es';

type T = any
type Result<T> = {
  data: T;
  code?: number,
  msg?: string,
};
interface login {
  sno: string,
  password: string,
}
interface newsList {
  start: number,
  limit: number,
  noticeType: number
}
interface heat {
  id: number,
}
interface userInfo {
  sno: string,
}
interface deleteNews {
  id: number,
}
interface insertNews {
  noticeContent: string,
  noticeTitle: string,
  noticeType: number,
  createBy: string,
}
interface modifyNews {
  updateBy: string,
  id: number,
  noticeContent: string,
  noticeTitle: string,
  noticeType: number,
}
interface department {
  id: number,
  deptName: string;
  className: string;
}
interface departmentList {
  start: number,
  limit: number,
}
interface carousel {
  title: string,
  url: string,
  status: number,
}
interface findInstructor {
  id: number,
}
interface getSubject {
  semesterId: number,
  start: number,
  limit: number,
}
interface getAchievement {
  sno: string,
  subjectId: number,
  semesterId: number,
  start: number,
  limit: number,
}
interface insertSubject {
  subjectName: string,
  semesterId: number,
}
interface modifySubject {
  subjectName: string,
  subjectId: number,
}
interface deleteSubject {
  subjectId: number,
}
interface deleteAchievement {
  sno: String,
  semesterId: number,
}
interface modifyAchievement {
  achievementId: number,
  achievementValue: number,
}
interface selectCarousel {
  start: number,
  limit: number,
}
interface loginLog {
  start: number,
  limit: number,
}
interface deleteCarousel {
  id: number,
}
interface addUser {
  avatar: string
  departmentId: number,
  email: string,
  id: number,
  instructorId: number,
  password: string,
  phone: string,
  positions: string,
  sno: string,
  username: string
}
interface selectUser {
  sno: string,
  positions: string,
  start: number,
  limit: number,
}
interface deleteUser {
  id: number,
}
// 登录接口
export const login = (data: login): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
// 获取轮播图接口
export const getCarousel = (): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysRotationChart/selectOnAll',
    method: 'get',
  })
}
// 获取开启公告、资讯
export const getNews = (): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/selectOnAll',
    method: 'get',
  })
}
// 增加次数
export const addHeat = (data: heat): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/heatIncr',
    method: 'post',
    data,
  })
}
// 获取公告、资讯列表
export const getNewsList = (params: newsList): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/selectPage',
    method: 'get',
    params,
  })
}
// 获取个人信息详情
export const getUserInfo = (params: userInfo): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/selectUserInfo',
    method: 'get',
    params,
  })
}
// 保存个人信息修改
export const updateUserInfo = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/update',
    method: 'put',
    data,
  })
}
// 头像上传
export const imagesUpload = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/upload/images',
    method: 'post',
    data,
  })
}
// 公共文件 
export const fileUpload = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/upload/file',
    method: 'post',
    data,
  })
}
// 轮播图上传 
export const carouselUpload = (data: carousel): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysRotationChart/insert',
    method: 'post',
    data,
  })
}
// 删除轮播图
export const deleteCarousel = (params: deleteCarousel): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysRotationChart/delete',
    method: 'delete',
    params,
  })
}
// 查询轮播图列表
export const selectCarousel = (params: selectCarousel): Promise<Result<T>>  => {
  return RequestAxios.request({
    url:'/sysRotationChart/selectPage',
    method: 'get',
    params,
  })
}
// 修改轮播图信息
export const modifyCarousel = (data: carousel): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysRotationChart/update',
    method: 'PUT',
    data,
  })
}
// 删除资讯
export const deleteNews = (params: deleteNews): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/delete',
    method: 'delete',
    params,
  })
}
// 添加一条公告
export const insertNews = (data: insertNews): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/insert',
    method: 'post',
    data,
  })
}
// 修改公告信息 
export const modifyNews = (data: modifyNews): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysNotice/update',
    method: 'put',
    data,
  })
}
// 院系列表全部
export const departmentList = (): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/department/selectAll',
    method: 'get',
  })
}
// 院系列表 分页
export const departmentsPage = (params: departmentList): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/department/selectPage',
    method: 'get',
    params,
  })
}
// 新增一个院系
export const insertDepartment = (data: department): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/department/insert',
    method: 'post',
    data,
  })
}
// 删除一个院系
export const deleteDepartment = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/department/delete',
    method: 'delete',
    params,
  })
}
// 修改院系名称
export const modifyDepartment = (data: department): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/department/update',
    method: 'put',
    data,
  })
}
// 根据院系的id查询辅导员

export const findInstructor = (params: findInstructor): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/selectInstructorByDeptId',
    method: 'get',
    params,
  })
}
// 获取学期
export const getSemester = (): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/semester/selectAll',
    method: 'get',
  })
}
// 获取学科
export const getSubject = (params: getSubject): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/subject/selectPage',
    method: 'get',
    params,
  })
}
// 新增学科
export const insertSubject = (data: insertSubject): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/subject/insert',
    method: 'post',
    data,
  })
}
// 修改学科名称
export const modifySubject = (data: modifySubject): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/subject/update',
    method: 'put',
    data,
  })
}
// 没有成绩的情况下移除学科
export const deleteSubject = (params: deleteSubject ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/subject/delete',
    method: 'delete',
    params,
  })
}
// 新增成绩
export const addAchievement = (data: any[] ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/achievement/insert',
    method: 'post',
    data,
  })
}
// 删除成绩
export const deleteAchievement = (params: deleteAchievement ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/achievement/delete',
    method: 'delete',
    params,
  })
}
// 修改成绩
export const modifyAchievement = (data: any[] ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/achievement/update',
    method: 'put',
    data,
  })
}
// 查询成绩列表
export const getAchievement = (params: getAchievement ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/achievement/selectPage',
    method: 'get',
    params,
  })
}
// 用户新增
export const addUser = (data: any ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/insert',
    method: 'post',
    data,
  })
}
// 用户查询
export const selectUser = (params: selectUser ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/selectPage',
    method: 'get',
    params,
  })
}
// 用户修改
export const modifyUser = (data: any ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/update',
    method: 'put',
    data,
  })
}
// 用户删除
export const deleteUser = (params: deleteUser ): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/user/delete',
    method: 'delete',
    params,
  })
}
// 登录用户日志 
export const loginLog = (params: loginLog): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/sysLoginLog/selectPage',
    method: 'GET',
    params,
  })
}
// 导出
export const importExcel = (data: any, params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/achievement/importExcel',
    method: 'post',
    data,
    params,
  })
}
// 奖学金 --- 查询
export const selectScholarship = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/scholarship/selectPage',
    method: 'get',
    params,
  })
}
// 奖学金 --- 查询单条
export const getScholarship = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/scholarship/get',
    method: 'get',
    params,
  })
}
// 奖学金  --- 删除
export const deleteScholarship = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/scholarship/delete',
    method: 'delete',
    params,
  })
}
// 奖学金 --- 新增
export const insertScholarship = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/scholarship/insert',
    method: 'post',
    data,
  })
}
// 奖学金 --- 修改
export const modifyScholarship = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/scholarship/update',
    method: 'put',
    data,
  })
}
// 学生违规违纪调查表 --- 删除
export const deleteViolation = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/violation/delete',
    method: 'delete',
    params,
  })
}
// 学生违规违纪调查表 --- 查询单条数据
export const getViolation = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/violation/get',
    method: 'get',
    params,
  })
}
// 学生违规违纪调查表 --- 新增
export const insertViolation = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/violation/insert',
    method: 'post',
    data,
  })
}
// 学生违规违纪调查表 --- 新增
export const updateViolation = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/violation/update',
    method: 'put',
    data,
  })
}
// 学生违规违纪调查表 --- 分页查询
export const selectViolation = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/violation/selectPage',
    method: 'get',
    params,
  })
}
// 专利发 --- 删除
export const deleteInvention = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/patentedInvention/delete',
    method: 'delete',
    params,
  })
}
// 专利发 --- 查询单条
export const getInvention = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/patentedInvention/get',
    method: 'get',
    params,
  })
}
// 专利发 --- 新增
export const insertInvention = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/patentedInvention/insert',
    method: 'post',
    data,
  })
}
// 专利发 --- 分页查询
export const selectInvention = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/patentedInvention/selectPage',
    method: 'get',
    params,
  })
}
// 专利发 --- 修改
export const updateInvention = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/patentedInvention/update',
    method: 'put',
    data,
  })
}
// 出版和论文发表 -- 删除
export const deletePaper = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/paper/delete',
    method: 'delete',
    params,
  })
}
// 出版和论文发表 -- 查询单条
export const getPaper = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/paper/get',
    method: 'get',
    params,
  })
}
// 出版和论文发表 -- 新增
export const insertPaper = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/paper/insert',
    method: 'post',
    data,
  })
}
// 出版和论文发表 -- 分页查询
export const selectPaper = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/paper/selectPage',
    method: 'get',
    params,
  })
}
// 出版和论文发表 -- 分页查询
export const updatePaper = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/paper/update',
    method: 'put',
    data,
  })
}
// 助人为乐事迹 -- 删除
export const deleteHelpGood = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/helpGood/delete',
    method: 'delete',
    params,
  })
}
// 助人为乐事迹 -- 查询单条
export const getHelpGood = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/helpGood/get',
    method: 'get',
    params,
  })
}
// 助人为乐事迹 -- 新增
export const insertHelpGood = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/helpGood/insert',
    method: 'post',
    data,
  })
}
// 助人为乐事迹 -- 分页查询
export const selectHelpGood = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/helpGood/selectPage',
    method: 'get',
    params,
  })
}
// 助人为乐事迹 -- 修改
export const updateHelpGood = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/helpGood/update',
    method: 'put',
    data,
  })
}
// 班干部任职表 -- 删除
export const deleteClassCadrePost = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/classCadrePost/delete',
    method: 'delete',
    params,
  })
}
// 班干部任职表 -- 查询单条
export const getClassCadrePost = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/classCadrePost/get',
    method: 'get',
    params,
  })
}
// 班干部任职表 -- 新增
export const insertClassCadrePost = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/classCadrePost/insert',
    method: 'post',
    data,
  })
}
// 班干部任职表 -- 分页查询
export const selectClassCadrePost = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/classCadrePost/selectPage',
    method: 'get',
    params,
  })
}
// 班干部任职表 -- 修改
export const updateClassCadrePost = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/classCadrePost/update',
    method: 'put',
    data,
  })
}
// 竞赛参赛表 -- 删除
export const deleteCompetition = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/competition/delete',
    method: 'delete',
    params,
  })
}
// 竞赛参赛表 -- 查询单条
export const getCompetition = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/competition/get',
    method: 'get',
    params,
  })
}
// 竞赛参赛表 -- 新增
export const insertCompetition = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/competition/insert',
    method: 'post',
    data,
  })
}
// 竞赛参赛表 -- 分页查询
export const selectCompetition = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/competition/selectPage',
    method: 'get',
    params,
  })
}
// 竞赛参赛表 -- 修改
export const updateCompetition = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/competition/update',
    method: 'put',
    data,
  })
}
// 表彰荣誉表 -- 删除
export const deleteHonor = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/honor/delete',
    method: 'delete',
    params,
  })
}
// 表彰荣誉表 -- 查询单条
export const getHonor = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/honor/get',
    method: 'get',
    params,
  })
}
// 表彰荣誉表 -- 新增
export const insertHonor = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/honor/insert',
    method: 'post',
    data,
  })
}
// 表彰荣誉表 -- 分页查询
export const selectHonor = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/honor/selectPage',
    method: 'get',
    params,
  })
}
// 表彰荣誉表 -- 修改
export const updateHonor = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/honor/update',
    method: 'put',
    data,
  })
}
// 综合成绩 -- 删除
export const deleteComprehensive = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/comprehensive/delete',
    method: 'delete',
    params,
  })
}
// 综合成绩 -- 新增
export const insertComprehensive = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/comprehensive/insert',
    method: 'post',
    data,
  })
}
// 综合成绩 -- 分页查询
export const selectComprehensive = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/comprehensive/selectPage',
    method: 'get',
    params,
  })
}
// 综合成绩 -- 修改
export const updateComprehensive = (data: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/comprehensive/update',
    method: 'put',
    data,
  })
}
// 综合成绩 -- 汇算
export const settleAccounts = (params: any): Promise<Result<T>> => {
  return RequestAxios.request({
    url: '/comprehensive/settleAccounts',
    method: 'get',
    params,
  })
}



