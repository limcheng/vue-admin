import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Area from './views/nav1/Area.vue'
import user from './views/nav1/user.vue'
import point from './views/nav1/point.vue'
import notice from './views/nav1/notice.vue'
import admin from './views/nav1/admin.vue'
import report from './views/nav3/report.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '数据管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/notice', component: notice, name: '公告' },
            { path: '/Area', component: Area, name: '区域' },
            { path: '/point', component: point, name: '咨询点' },
            { path: '/admin', component: admin, name: '管理员' },
            { path: '/user', component: user, name: '用户列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/report', component: report, name: '报表汇总' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/Main' }
    }
];

export default routes;