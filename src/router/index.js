import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      component: () =>
        import ('../components/home')
    },
    // 项目列表
    {
      path: '/project',
      component: () =>
        import ('../components/project')
    },
    // 发布项目
    {
      path: '/submitProject',
      component: () =>
        import ('../components/submit-project')
    },
    // 申请互助
    {
      path: '/submitClaim',
      component: () =>
        import ('../components/submit-claim'),
      props: (route) => ({
        id: route.query.id,
        projectAccount: route.query.projectAccount
      })
    },
    // 项目详情
    {
      path: '/projectDetail',
      component: () =>
        import ('../components/project-detail'),
      props: (route) => ({
        id: route.query.id
      })
    },
    // 我的项目
    {
      path: '/myProject',
      component: () =>
        import ('../components/my-project')
    },
    // 我支持的项目
    {
      path: '/projectJoined',
      component: () =>
        import ('../components/project-joined')
    },
    // 申请互助列表
    {
      path: '/projectApplied',
      component: () =>
        import ('../components/project-applied')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})