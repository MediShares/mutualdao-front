webpackJsonp([6],{DebZ:function(t,s,e){"use strict";(function(t){var a=e("D8k7");s.a={props:["id"],data:()=>({successModalTitle:"",successModalInfo:"",claim:null,comments:null,comment:"",page:1,isOver:!1}),computed:{status(){let t=Date.now()-new Date(this.claim.endTime.replace(/\-/g,"/"))>=0;return 1!=this.claim.status&&!t}},created(){this.getCase(),this.getComments()},methods:{getCase(){this.$http.get(this.domain+"apiDao/getCaseInfo?v=1.0&id="+this.id).then(t=>{this.setLoading(!1),t.data.success&&(this.claim=t.data.data)}).catch(t=>{this.setLoading(!1),console.log(t)})},getComments(){let s=!1;this.setLoading(!0),this.$http.get(this.domain+"apiDao/getCommentList?v=1.0&id="+this.id+"&page="+this.page).then(t=>{this.setLoading(!1),t.data.success?(this.comments=t.data.data.data,this.comments&&this.comments.length<9?(this.isOver=!0,s=!1):s=!0):(this.comments=null,this.isOver=!0,s=!1)}).catch(t=>{this.setLoading(!1),console.log(t)}),t(window).scroll(()=>{1==s&&t(window).scrollTop()+t(window).height()>=t("#app").outerHeight(!0)&&(this.setLoading(!0),this.page++,s=!1,this.$http.get(this.domain+"apiDao/getCommentList?v=1.0&id="+this.id+"&page="+this.page).then(t=>{this.setLoading(!1),t.data.success?(this.comments=this.comments.concat(t.data.data.data),t.data.data.data.length<9?(this.isOver=!0,s=!1):s=!0):(this.isOver=!0,s=!1)}).catch(t=>{this.setLoading(!1),console.log(t)}))})},submitComment(){this.getAccount().then(s=>{if(!this.comment.trim())return this.$toast(this.$t("enter_comment")),!1;this.setLoading(!0),this.$http.post(this.domain+"apiDao/submitComment?v=1.0",{content:this.comment,user:s.name,caseID:this.claim.ID,projectID:this.claim.projectID},{emulateJSON:!0}).then(s=>{s.data.success?(this.successModalTitle="comment_success",t("#successModal").modal("show"),t("#successModal").on("hidden.bs.modal",function(t){window.location.reload()})):this.$toast(this.$t("comment_error"))}).catch(()=>{this.$toast(this.$t("comment_error"))})})}},watch:{id(){this.getCase(),this.getComments()}},components:{successModal:a.a}}}).call(s,e("7t+N"))},bkWg:function(t,s){},dipK:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=e("DebZ"),i={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return t.claim?e("section",{staticClass:"project-sm-container"},[e("article",{staticClass:"container"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-md-8 col-md-offset-2"},[e("h2",{staticClass:"project-title"},[t._v(t._s(t.claim.title))]),t._v(" "),e("h4",{staticClass:"info-title",style:"backgroundImage:url(https://api.medishares.net/apiTools/getAddressHead?address="+t.claim.proposer+"&v=1.0)"},[t._v(t._s(t.claim.proposer))]),t._v(" "),e("p",{staticClass:"claim-des",domProps:{innerHTML:t._s(t.webUtil.getFormatCode(t.claim.story))}}),t._v(" "),e("viewer",{staticClass:"clearfix",attrs:{images:t.claim.photo}},t._l(t.claim.photo,function(t){return e("span",{key:t,staticClass:"pic-container"},[e("img",{attrs:{src:t}})])}),0),t._v(" "),e("ul",{staticClass:"vote-info"},[e("li",[e("span",{staticClass:"label-name"},[t._v(t._s(t.$t("status")))]),t._v(" "),t.status?e("p",[t._v(t._s(t.$t("voting")))]):e("p",[t._v(t._s(t.$t("vote_end")))])]),t._v(" "),e("li",[e("span",{staticClass:"label-name"},[t._v(t._s(t.$t("application_amount")))]),t._v(" "),e("p",[t._v(t._s(t.claim.amount)+" "+t._s(t.claim.token))])]),t._v(" "),e("li",[e("span",{staticClass:"label-name"},[t._v(t._s(t.$t("claim_time")))]),t._v(" "),e("p",[t._v(t._s(t.claim.createDate))])]),t._v(" "),e("li",[e("span",{staticClass:"label-name"},[t._v(t._s(t.$t("voting_endtime")))]),t._v(" "),e("p",[t._v(t._s(t.claim.endTime))])])])],1),t._v(" "),e("div",{staticClass:"col-md-8 col-md-offset-2 comment"},[e("h4",[t._v(t._s(t.$t("discussion")))]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.comment,expression:"comment"}],staticClass:"basic-input",attrs:{type:"text",placeholder:t.$t("enter_comment")},domProps:{value:t.comment},on:{input:function(s){s.target.composing||(t.comment=s.target.value)}}}),t._v(" "),e("div",{staticClass:"submit",on:{click:t.submitComment}},[t._v(t._s(t.$t("comment")))]),t._v(" "),t.comments&&t.comments.length>0?e("ul",{staticClass:"comment-info"},t._l(t.comments,function(s){return e("li",{key:s.ID,style:"backgroundImage:url(https://api.medishares.net/apiTools/getAddressHead?address="+s.proposer+"&v=1.0)"},[e("h4",[t._v(t._s(s.user))]),t._v(" "),e("p",[t._v(t._s(s.content))]),t._v(" "),e("time",[t._v(t._s(s.createDate))])])}),0):t._e(),t._v(" "),t.comments&&t.comments.length>0&&t.isOver?e("div",{staticClass:"bottom-line"},[e("span",[t._v(t._s(t.$t("bottom_line")))])]):t._e()])])]),t._v(" "),e("successModal",{attrs:{title:t.successModalTitle,info:t.successModalInfo}})],1):e("section",{staticClass:"isNull"},[t._v(t._s(t.$t("no_claim")))])},staticRenderFns:[]};var o=function(t){e("bkWg")},c=e("VU/8")(a.a,i,!1,o,"data-v-3825c5f6",null);s.default=c.exports}});
//# sourceMappingURL=6.fe630b7e9c386752ddfd.js.map