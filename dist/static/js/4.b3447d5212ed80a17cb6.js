webpackJsonp([4],{"2E4k":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("ItkU"),o={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"project"},[s("div",{staticClass:"container"},[s("h4",{staticClass:"title text-center"},[t._v(t._s(t.$t("all_projects")))]),t._v(" "),t.projects&&t.projects.length>0?s("ul",{staticClass:"row project-list"},t._l(t.projects,function(t){return s("li",{key:t.id,staticClass:"col-sm-4 col-xs-12"},[s("project-list",{attrs:{id:t.ID,picture:t.img,title:t.title,targetAccount:t.targetAccount}})],1)}),0):s("blank-page",{attrs:{isProject:!0}}),t._v(" "),t.projects&&t.projects.length>3&&t.isOver?s("div",{staticClass:"bottom-line"},[s("span",[t._v(t._s(t.$t("bottom_line")))])]):t._e()],1),t._v(" "),s("foot")],1)},staticRenderFns:[]};var i=function(t){s("PkBu")},c=s("VU/8")(a.a,o,!1,i,"data-v-14db8a73",null);e.default=c.exports},FHam:function(t,e,s){"use strict";var a={props:["picture","id","title","targetAccount"],data:()=>({people:0,amount:"0 EOS"}),created(){this.getProjectInfo()},methods:{getProjectInfo(){this.$http.post(this.table_url,{json:!0,code:this.targetAccount,scope:this.targetAccount,table:"global"}).then(t=>{let e=t.data.rows[0];e&&(this.people=e.guaranteed_accounts,this.amount=e.guarantee_pool)}).catch(t=>{console.log(t)})}}},o={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("router-link",{staticClass:"program-list",attrs:{to:{path:"/projectDetail",query:{id:t.id}}}},[s("div",{staticClass:"list-pic",style:{backgroundImage:"url("+t.picture+")"}}),t._v(" "),s("div",{staticClass:"info"},[s("h4",{staticStyle:{"-webkit-box-orient":"vertical"}},[t._v(t._s(t.title))]),t._v(" "),s("p",{staticClass:"pool"},[t._v(t._s(t.$t("mutual_aid_pool"))+":")]),t._v(" "),s("div",{staticClass:"pool-amount"},[t._v(t._s(t.amount?t.amount:"0 EOS"))]),t._v(" "),s("div",{staticClass:"people"},[t._v(t._s(t.$t("people"))+": "+t._s(t.people?t.people:0))])])])},staticRenderFns:[]};var i=s("VU/8")(a,o,!1,function(t){s("S4Sl")},"data-v-2e3e4290",null);e.a=i.exports},ItkU:function(t,e,s){"use strict";(function(t){var a=s("IDhe"),o=s("FHam"),i=s("VXza");e.a={data:()=>({url:"apiDao/getProjectList?v=1.0&page=",isOver:!1,page:1,projects:[]}),created(){this.getProjects()},methods:{getProjects(){let e=!1;this.setLoading(!0),this.$http.get(this.domain+this.url+this.page).then(t=>{this.setLoading(!1),t.data.success&&(this.projects=t.data.data.data,this.projects&&this.projects.length<9?(this.isOver=!0,e=!1):e=!0)}).catch(t=>{this.setLoading(!1),console.log(t)}),t(window).scroll(()=>{1==e&&t(window).scrollTop()+t(window).height()>=t("#app").outerHeight(!0)-t("footer").outerHeight(!0)&&(this.setLoading(!0),this.page++,e=!1,this.$http.get(this.domain+this.url+this.page).then(t=>{this.setLoading(!1),this.projects=this.projects.concat(t.data.data.data),t.data.data.data.length<9?(this.isOver=!0,e=!1):e=!0}).catch(t=>{this.setLoading(!1),console.log(t)}))})}},components:{foot:i.a,projectList:o.a,blankPage:a.a}}}).call(e,s("7t+N"))},PkBu:function(t,e){},S4Sl:function(t,e){}});
//# sourceMappingURL=4.b3447d5212ed80a17cb6.js.map