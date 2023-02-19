export const baseURL: string = "http://192.168.43.178:8080"

export const POSITION = [
  { code: 'ADMIN', label: '管理员' },
  { code: 'INSTRUCTOR', label: '辅导员' },
  { code: 'STUDENT', label: '学生' },
]
export const filterRouter = (routes: any, roles: any) => {
  const res: any = []
  routes.forEach((route: any) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
export const hasPermission = (roles: any, route: any) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role: any) => route.meta.roles.includes(role))
  } else {
    return true
  }
}