export const baseURL: string = "http://127.0.0.1:8080"

export const PUBLIC_PATH = '/'

export const POSITION = [
  { code: 'ADMIN', label: '管理员' },
  { code: 'INSTRUCTOR', label: '辅导员' },
  { code: 'STUDENT', label: '学生' },
]
// 政治面貌
export const POLITICAL = [
  { name: '群众', code: 'MASS' },
  { name: '少先队员', code: 'YOUNG_PIONEER' },
  { name: '共青团员', code: 'LEAGUE_MEMBER' },
  { name: '共产党员', code: 'COMMUNIST' },
]
// 学生职务
export const STUDENT_POSITION = [
  { name: '班长', code: 'monitor' },
  { name: '副班长', code: 'vicemonitor' },
  { name: '学习委员', code: 'studycomm' },
  { name: '劳动委员', code: 'labcomm' },
  { name: '组织委员', code: 'orgcomm' },
  { name: '宣传委员', code: 'pubcomm' },
  { name: '体育委员', code: 'spocomm' },
  { name: '文艺委员', code: 'litartcomm' },
  { name: '暂无职务', code: '' },
]
export const SEX = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
];
// 审核状态
export const APPROVAL = {
  1: '新建',
  2: '审核中',
  3: '通过',
  4: '退回',
}
export const fileDownload = (url: string) => {
  const a = document.createElement('a')
  a.href = baseURL + url
  window.open(a.href,'_blank')
  a.remove()
}
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
export function buildShortUUID(prefix = ''): string {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  return prefix + '_' + random + String(time);
}
export function checkValueType(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}
// tiny -------start
export const plugins = [
  'advlist anchor autolink autosave code codesample  directionality  fullscreen hr insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus  template  textpattern visualblocks visualchars wordcount',
];

export const toolbar = [
  'fontsizeselect lineheight searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
  'hr bullist numlist link  preview anchor pagebreak insertdatetime media  forecolor backcolor fullscreen',
];
// tiny -------end
// 民族
export const NATION = [
  { name: '汉族', code: '0' },
  { name: '蒙古族', code: '1' },
  { name: '回族', code: '2' },
  { name: '藏族', code: '3' },
  { name: '维吾尔族', code: '4' },
  { name: '苗族', code: '5' },
  { name: '彝族', code: '6' },
  { name: '壮族', code: '7' },
  { name: '布依族', code: '8' },
  { name: '朝鲜族', code: '9' },
  { name: '满族', code: '10' },
  { name: '侗族', code: '11' },
  { name: '瑶族', code: '12' },
  { name: '白族', code: '13' },
  { name: '土家族', code: '14' },
  { name: '哈尼族', code: '15' },
  { name: '哈萨克族', code: '16' },
  { name: '傣族', code: '17' },
  { name: '黎族', code: '18' },
  { name: '傈傈族', code: '19' },
  { name: '佤族', code: '20' },
  { name: '畲族', code: '21' },
  { name: '高山族', code: '22' },
  { name: '拉祜族', code: '23' },
  { name: '水族', code: '24' },
  { name: '东乡族', code: '25' },
  { name: '纳西族', code: '26' },
  { name: '景颇族', code: '27' },
  { name: '柯尔克孜族', code: '28' },
  { name: '土族', code: '29' },
  { name: '达斡尔族', code: '30' },
  { name: '仫佬族', code: '31' },
  { name: '羌族', code: '32' },
  { name: '布朗族', code: '33' },
  { name: '撒拉族', code: '34' },
  { name: '毛南族', code: '35' },
  { name: '仡佬族', code: '36' },
  { name: '锡伯族', code: '37' },
  { name: '阿昌族', code: '38' },
  { name: '普米族', code: '39' },
  { name: '塔吉克族', code: '40' },
  { name: '怒族', code: '41' },
  { name: '乌兹别克族', code: '42' },
  { name: '俄罗斯族', code: '43' },
  { name: '鄂温克族', code: '44' },
  { name: '德昂族', code: '45' },
  { name: '保安族', code: '46' },
  { name: '裕固族', code: '47' },
  { name: '京族', code: '48' },
  { name: '塔塔尔族', code: '49' },
  { name: '独龙族', code: '50' },
  { name: '鄂伦春族', code: '51' },
  { name: '赫哲族', code: '52' },
  { name: '门巴族', code: '53' },
  { name: '珞巴族', code: '54' },
  { name: '基诺族', code: '55' },
  { name: '其他', code: '56' },
]
