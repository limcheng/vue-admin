import axios from 'axios';

//var qs=require('qs');
//var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });

//let base = 'http://120.79.9.157:8080/workReport';
let base = 'https://www.dingguangroup.com/test/workReport';

let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('adminId');
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Authorization'] = token;
axios.defaults.headers.common['Authorization'] = token;  //设置请求头

//this.$axios.setHeader('Authorization', token)

export const requestLogin = params => { return axios.post(`${base}/Admin/login`, params).then(res => res.data).catch(function (error) {
  console.log(error.response);
}); };
// export const requestLogin = params => { return axios.post(`${base}/Admin/login`, params).then(res => res).catch(function (error) {
//   console.log(error.response);
// }); };



//用户
export const getUserList = params => { return axios.get(`${base}/User`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/User`, {params}); };

export const removeUser = params => { return axios.delete(`${base}/User/${params}`); };

//export const removeUser = params => { return axios.delete(`${base}/user/remove/`, {data: { params: params }}); };

// export const batchRemoveUser = params => { return axios.delete(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.put(`${base}/User`, params); };

export const addUser = params => { return axios.post(`${base}/User`, params); };


//咨询点
export const getPointList = params => { return axios.get(`${base}/Consult`, { params: params }); };

export const getPointListPage = params => { return axios.get(`${base}/Consult`, {params}); };

export const removePoint = params => { return axios.delete(`${base}/Consult/${params}`); };

// export const batchRemovePoint = params => { return axios.get(`${base}/Consult`, { params: params }); };

export const editPoint = params => { return axios.put(`${base}/Consult`,  params ); };

export const addPoint = params => { return axios.post(`${base}/Consult`, params ); };


//区域
export const getAreaList = params => { return axios.get(`${base}/Area`, { params: params }); };

export const getAreaListPage = params => { return axios.get(`${base}/Area`, { params: params }); };

export const removeArea = params => { return axios.delete(`${base}/Area/${params.id}`); };

// export const batchRemoveArea = params => { return axios.get(`${base}/Area/batchremove`, { params: params }); };

export const editArea = params => { return axios.put(`${base}/Area`, params ); };

export const addArea = params => { return axios.post(`${base}/Area`, params ); };


//报表

export const getReportExcle = params => { return axios.get(`${base}/Report/export`, {params}); };

export const getReportPage = params => { return axios.get(`${base}/Report`, {params}); };

export const removeReport = params => { return axios.delete(`${base}/Report/${params}`); };

// export const batchRemoveReport = params => { return axios.get(`${base}/report/batchremove`, { params: params }); };

export const editReport = params => { return axios.put(`${base}/Report`, params); };

export const addReport = params => { return axios.post(`${base}/Report`, params); };


//管理员
// export const getAdminList = params => { return axios.get(`${base}/Admin/`, { params: params }); };

export const getAdminListPage = params => { return axios.get(`${base}/Admin/`, params); };

export const removeAdmin = params => { return axios.delete(`${base}/Admin/${params}`); };

export const editAdmin = params => { return axios.put(`${base}/Admin/`, params ); };

export const addAdmin = params => { return axios.post(`${base}/Admin/add`, params ); };


//公告
// export const getNoticeList = params => { return axios.get(`${base}/Notice/list`, { params: params }); };

export const getNoticeListPage = params => { return axios.get(`${base}/Notice`, {params}); };

export const removeNotice = params => { return axios.delete(`${base}/Notice/${params}`); };

// export const batchRemoveNotice = params => { return axios.get(`${base}/Notice/batchremove`, { params: params }); };

export const editNotice = params => { return axios.put(`${base}/Notice`, params); };

export const addNotice = params => { return axios.post(`${base}/Notice`, params); };