webpackJsonp([1],{175:function(t,e){t.exports={renderURLInit:"?p_p_id=FrontendWebServiceInfo&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_resource_id=renderURLInit"}},176:function(t,e,i){"use strict";i.d(e,"a",function(){return u});var a=i(208),n=i.n(a),s=i(81),r=i.n(s),o=i(458),c=i(117),l=i.n(c),v=i(175);i.n(v);r.a.use(o.a);var u=new o.a.Store({state:{initData:{},loading:!1,index:0,agencyList:[],domainList:[],levelList:[]},actions:{loadInitResource:function(t){var e=(t.commit,t.state);return new n.a(function(t,i){null!==window.themeDisplay&&void 0!==window.themeDisplay?(e.initData.groupId=window.themeDisplay.getScopeGroupId(),e.initData.user={userName:window.themeDisplay.getUserName(),userEmail:"",userId:window.themeDisplay.getUserId()}):(e.initData.groupId=0,e.initData.user={userName:"",userEmail:"",userId:20103}),t(e.initData)})},getGovAgency:function(t,e){var i=(t.commit,t.state);return new n.a(function(t,e){u.dispatch("loadInitResource").then(function(e){var a={headers:{groupId:i.initData.groupId}};l.a.get("/o/rest/v2/serviceinfos/statistics/agencies",a).then(function(e){var i=e.data;if(i.data){var a=i.data;t(a)}else t([])}).catch(function(t){})})})},getDomain:function(t,e){var i=(t.commit,t.state);return new n.a(function(t,e){u.dispatch("loadInitResource").then(function(e){var a={headers:{groupId:i.initData.groupId}};l.a.get("/o/rest/v2/serviceinfos/statistics/domains",a).then(function(e){var i=e.data;if(i.data){var a=i.data;t(a)}else t([])}).catch(function(t){})})})},getLevelList:function(t,e){var i=(t.commit,t.state);return new n.a(function(t,e){u.dispatch("loadInitResource").then(function(a){var n={headers:{groupId:i.initData.groupId}};l.a.get("/o/rest/v2/serviceinfos/statistics/levels",n).then(function(e){var i=e.data;if(i.data){var a=i.data;for(var n in a)a[n].textLevel="Mức độ "+a[n].level;t(a)}else t([])}).catch(function(t){e(t)})})})},getServiceLists:function(t,e){var i=(t.commit,t.state);return new n.a(function(t,a){u.dispatch("loadInitResource").then(function(n){var s={headers:{groupId:i.initData.groupId},params:{start:15*e.page-15,end:15*e.page,administration:e.administration?e.administration:"",keyword:e.keyword?e.keyword:"",level:e.level?e.level:0,domain:e.domain?e.domain:""}};l.a.get("/o/rest/v2/serviceinfos",s).then(function(e){var i=e.data;t(i)}).catch(function(t){a(t)})})})},getServiceDetail:function(t,e){var i=(t.commit,t.state);return new n.a(function(t,a){u.dispatch("loadInitResource").then(function(n){var s={headers:{groupId:i.initData.groupId}};l.a.get("/o/rest/v2/serviceinfos/"+e.index,s).then(function(e){var i=e.data;t(i)}).catch(function(t){a(t)})})})}},mutations:{setLoading:function(t,e){t.loading=e},setInitData:function(t,e){t.initData=e},setAgencyList:function(t,e){t.agencyList=e},setDomainList:function(t,e){t.domainList=e},setLevelList:function(t,e){t.levelList=e}},getters:{loading:function(t){return t.loading},index:function(t){return t.index},getAgencyList:function(t){return t.agencyList},getDomainList:function(t){return t.domainList},getLevelList:function(t){return t.levelList}}})},178:function(t,e){},179:function(t,e){},180:function(t,e){},182:function(t,e,i){var a=i(59)(i(202),i(451),null,null);a.options.__file="/Users/binhthgc/Documents/fds/github/frontend-opencps-v2.1/onegate_21_serviceinfo/src/App.vue",a.esModule&&Object.keys(a.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),a.options.functional&&console.error("[vue-loader] App.vue: functional components are not supported with templates, they should use render functions."),t.exports=a.exports},201:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(179),n=(i.n(a),i(178)),s=(i.n(n),i(180)),r=(i.n(s),i(81)),o=i.n(r),c=i(182),l=i.n(c),v=i(60),u=i(183),d=i.n(u),p=i(176),g=i(181),h=i(177),m=(i.n(h),i(117));i.n(m).a.defaults.headers.common.Token=window.Liferay.authToken,o.a.use(g.default),o.a.use(d.a),o.a.config.productionTip=!1,new o.a({el:"#app",router:v.a,store:p.a,render:function(t){return t(l.a)}})},202:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(60);e.default={data:function(){return{active:null,currentAgency:"",currentDomain:"",currentLevel:"",text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}},computed:{currentIndex:function(){return this.$store.getters.index},govAgencyList:function(){return this.$store.getters.getAgencyList},domainList:function(){return this.$store.getters.getDomainList},levelList:function(){return this.$store.getters.getLevelList}},created:function(){var t=this;t.$nextTick(function(){var e=t.$router.history.current,i=e.query;t.$store.dispatch("getGovAgency").then(function(e){if(t.$store.commit("setAgencyList",e),t.govAgencyList.length>0){t.currentAgency=t.govAgencyList[0].administrationCode;var n="?";i.page=1,i.agency=t.govAgencyList[0].administrationCode;for(var s in i)""!==i[s]&&"undefined"!==i[s]&&void 0!==i[s]&&null!==i[s]&&(n+=s+"="+i[s]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+n,query:{renew:Math.floor(100*Math.random())+1}})}}),t.$store.dispatch("getDomain").then(function(e){t.$store.commit("setDomainList",e)}),t.$store.dispatch("getLevelList").then(function(e){t.$store.commit("setLevelList",e)})})},watch:{$route:function(t,e){var i=this,a=(t.params,t.query);i.currentAgency=a.hasOwnProperty("agency")?a.agency:"",i.currentDomain=a.hasOwnProperty("domain")?a.domain:"",i.currentLevel=a.hasOwnProperty("level")?a.level:""}},methods:{filterAgency:function(t){var e=this;e.currentAgency=t.administrationCode;var i=e.$router.history.current,n=i.query,s="?";n.page=1,n.agency=t.administrationCode,n.domain="",n.level="";for(var r in n)""!==n[r]&&"undefined"!==n[r]&&void 0!==n[r]&&null!==n[r]&&(s+=r+"="+n[r]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+s,query:{renew:Math.floor(100*Math.random())+1}})},filterDomain:function(t){var e=this;e.currentDomain=t.domainCode;var i=e.$router.history.current,n=i.query,s="?";n.page=1,n.domain=t.domainCode,n.agency="",n.level="";for(var r in n)""!==n[r]&&"undefined"!==n[r]&&void 0!==n[r]&&null!==n[r]&&(s+=r+"="+n[r]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+s,query:{renew:Math.floor(100*Math.random())+1}})},filterLevel:function(t){var e=this;e.currentLevel=t.level;var i=e.$router.history.current,n=i.query,s="?";n.page=1,n.domain="",n.agency="",n.level=t.level;for(var r in n)""!==n[r]&&"undefined"!==n[r]&&void 0!==n[r]&&null!==n[r]&&(s+=r+"="+n[r]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+s,query:{renew:Math.floor(100*Math.random())+1}})}}}},203:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=(i(60),i(174));i.n(a);e.default={props:["index"],components:{},data:function(){return{loading:!1,loadingAction:!1,serviceDetail:"",serviceConfigDetail:"",active:null,dialogGuide:!1}},computed:{},created:function(){this.$nextTick(function(){var t=this;t.loading=!0;var e={index:t.index};t.$store.dispatch("getServiceDetail",e).then(function(e){t.serviceDetail=e,t.loading=!1}).catch(function(e){t.loading=!1})})},watch:{},methods:{createDossier:function(t){var e="/web/cong-dich-vu-cong/dich-vu-cong#/add-dvc/"+t.serviceConfigId;window.open(e)},viewGuide:function(t){var e=this;e.serviceConfigDetail=t,e.dialogGuide=!0},downloadFileTemplate:function(t){var e=this,i="/o/rest/v2/serviceinfos/"+e.index+"/filetemplates/"+t.fileTemplateNo;window.open(i)},fileTemplate:function(t){return Array.isArray(t)?t:!!t.hasOwnProperty("fileTemplateNo")&&[t]},serviceConfigs:function(t){return Array.isArray(t)?t:t.hasOwnProperty("serviceConfigId")?[t]:[]},goBack:function(){window.history.back()},getColor:function(t){return 2===t?"green":3===t?"orange":4===t?"red":void 0}}}},204:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(60),n=i(174),s=(i.n(n),i(445)),r=(i.n(s),i(175)),o=(i.n(r),i(450)),c=i.n(o);e.default={props:[],components:{"tiny-pagination":c.a},data:function(){return{serviceInfoList:[],totalThuTuc:0,thutucPage:1,govAgencySelected:{},domainListCurrent:[],domainSelected:{},levelSelected:{},serviceNameKey:"",serviceDetail:"",dialogGuide:!1,loading:!1,headers:[{text:"STT",align:"center",sortable:!1},{text:"Tên thủ tục",align:"center",sortable:!1},{text:"Lĩnh vực",align:"center",sortable:!1},{text:"Mức độ",align:"center",sortable:!1},{text:"Thao tác",align:"center",sortable:!1}]}},computed:{govAgencyList:function(){return this.$store.getters.getAgencyList},domainList:function(){return this.$store.getters.getDomainList},levelList:function(){return this.$store.getters.getLevelList}},created:function(){this.$nextTick(function(){var t=this,e=t.$router.history.current,i=e.query;t.govAgencySelected=t.domainSelected=t.levelSelected=t.serviceNameKey="",t.govAgencySelected=i.hasOwnProperty("agency")?i.agency:"",t.domainSelected=i.hasOwnProperty("domain")?i.domain:"",t.levelSelected=i.hasOwnProperty("level")?Number(i.level):"",t.serviceNameKey=i.hasOwnProperty("keyword")?i.keyword:"",t.doLoadingThuTuc()})},updated:function(){this.$nextTick(function(){})},watch:{$route:function(t,e){var i=this,a=(t.params,t.query);i.domainListCurrent=[],a.hasOwnProperty("agency")?i.domainListCurrent=i.domainList.filter(function(t){return 0===t.domainCode.indexOf(a.agency)}):i.domainListCurrent=i.domainList,i.govAgencySelected=i.domainSelected=i.levelSelected=i.serviceNameKey="",i.govAgencySelected=a.hasOwnProperty("agency")?a.agency:"",i.domainSelected=a.hasOwnProperty("domain")?a.domain:"",i.levelSelected=a.hasOwnProperty("level")?Number(a.level):"",i.serviceNameKey=a.hasOwnProperty("keyword")?a.keyword:"",i.doLoadingThuTuc()},domainList:function(t){var e=this;e.govAgencySelected?e.domainListCurrent=t.filter(function(t){return 0===t.domainCode.indexOf(e.govAgencySelected)}):e.domainListCurrent=t}},methods:{changeAdministration:function(){var t=this;setTimeout(function(){var e=t.$router.history.current,i=e.query,n="?";i.page=1,i.agency=t.govAgencySelected,i.domain="";for(var s in i)""!==i[s]&&"undefined"!==i[s]&&void 0!==i[s]&&null!==i[s]&&(n+=s+"="+i[s]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+n,query:{renew:Math.floor(100*Math.random())+1}})},100)},changeDomain:function(){var t=this;setTimeout(function(){var e=t.$router.history.current,i=e.query,n="?";i.page=1,i.domain=t.domainSelected;for(var s in i)""!==i[s]&&"undefined"!==i[s]&&void 0!==i[s]&&null!==i[s]&&(n+=s+"="+i[s]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+n,query:{renew:Math.floor(100*Math.random())+1}})},100)},changeLevel:function(){var t=this;setTimeout(function(){var e=t.$router.history.current,i=e.query,n="?";i.page=1,i.level=t.levelSelected;for(var s in i)""!==i[s]&&"undefined"!==i[s]&&void 0!==i[s]&&null!==i[s]&&(n+=s+"="+i[s]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+n,query:{renew:Math.floor(100*Math.random())+1}})},100)},filterServiceName:function(){var t=this;setTimeout(function(){var e=t.$router.history.current,i=e.query,n="?";i.page=1,i.keyword=t.serviceNameKey;for(var s in i)""!==i[s]&&"undefined"!==i[s]&&void 0!==i[s]&&null!==i[s]&&(n+=s+"="+i[s]+"&");a.a.push({path:"/thu-tuc-hanh-chinh"+n,query:{renew:Math.floor(100*Math.random())+1}})},100)},doLoadingThuTuc:function(){var t=this;t.serviceInfoList=[],t.loading=!0;var e=a.a.history.current.query,i=null;i={page:e.page?e.page:1,administration:e.hasOwnProperty("agency")?e.agency:"",keyword:e.hasOwnProperty("keyword")?e.keyword:"",level:e.hasOwnProperty("level")?e.level:"",domain:e.hasOwnProperty("domain")?e.domain:""},t.$store.dispatch("getServiceLists",i).then(function(i){t.loading=!1,i.data?(t.serviceInfoList=i.data,t.thutucPage=Number(e.page)?Number(e.page):1,t.totalThuTuc=i.total):(t.totalThuTuc=0,t.serviceInfoList=[]),t.serviceItemTotal=i.total}).catch(function(e){t.loading=!1,t.serviceInfoList=[],t.totalThuTuc=0,t.thutucPage=1})},paggingData:function(t){var e=this,i=e.$router.history.current,a=i.query,n="?";a.page="";for(var s in a)""!==a[s]&&"undefined"!==a[s]&&void 0!==a[s]&&null!==a[s]&&"null"!==a[s]&&(n+=s+"="+a[s]+"&");n+="page="+t.page,e.$router.push({path:i.path+n})},viewDetail:function(t){this.$router.push({path:"/thu-tuc-hanh-chinh/"+t.serviceInfoId})},createDossier:function(t){var e="/web/cong-dich-vu-cong/dich-vu-cong#/add-dvc/"+t.serviceConfigId;window.open(e)},viewGuide:function(t){var e=this;e.serviceDetail=t,e.dialogGuide=!0},serviceConfigs:function(t){return Array.isArray(t)?t:t.hasOwnProperty("serviceConfigId")?[t]:[]},getColor:function(t){return 2===t?"green":3===t?"orange darken-1":4===t?"red":void 0}}}},205:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={}},206:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={name:"TinyPagination",props:{total:{type:Number,required:!0},page:{type:Number,default:1},lang:{type:String,default:"en"},customClass:{type:String},limits:{type:Array,default:function(){return[10,15,20,50,100]}},showLimit:{type:Boolean,default:!0}},data:function(){return{version:"0.2.1",currentPage:1,currentLimit:15,translations:{en:{prev:"Previous",title:"Page",next:"Next"}},availableLanguages:["en"]}},created:function(){this.currentPage=this.page},watch:{page:function(t){this.currentPage=parseInt(t)}},computed:{translation:function(){return this.availableLanguages.includes(this.lang)?this.translations[this.lang]:this.translations.en},totalPages:function(){return Math.ceil(this.total/this.currentLimit)},totalPagesData:function(){for(var t=[],e={},i=1;i<=this.totalPages;++i)e={value:i,text:"Trang "+i},t.push(e);return t},titlePage:function(){return""+this.currentPage},classFirstPage:function(){return{"c-not-allowed pagination__navigation--disabled":1===this.currentPage}},classLastPage:function(){return{"c-not-allowed pagination__navigation--disabled":this.currentPage===this.totalPages}}},methods:{nextPage:function(){this.currentPage!==this.totalPages&&(this.currentPage+=1,this.$emit("tiny:change-page",{page:this.currentPage}))},lastPage:function(){this.currentPage>1&&(this.currentPage-=1,this.$emit("tiny:change-page",{page:this.currentPage}))},nextPageLast:function(){this.currentPage=this.totalPages,this.$emit("tiny:change-page",{page:this.totalPages})},lastPageLast:function(){this.currentPage=1,this.$emit("tiny:change-page",{page:1})},goToPage:function(){this.$emit("tiny:change-page",{page:this.currentPage})},onLimitChange:function(){this.currentPage=1}}}},443:function(t,e){},447:function(t,e,i){var a=i(59)(i(203),i(455),null,null);a.options.__file="/Users/binhthgc/Documents/fds/github/frontend-opencps-v2.1/onegate_21_serviceinfo/src/components/ChiTietThuTuc.vue",a.esModule&&Object.keys(a.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),a.options.functional&&console.error("[vue-loader] ChiTietThuTuc.vue: functional components are not supported with templates, they should use render functions."),t.exports=a.exports},448:function(t,e,i){var a=i(59)(i(204),i(453),null,null);a.options.__file="/Users/binhthgc/Documents/fds/github/frontend-opencps-v2.1/onegate_21_serviceinfo/src/components/Landing.vue",a.esModule&&Object.keys(a.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),a.options.functional&&console.error("[vue-loader] Landing.vue: functional components are not supported with templates, they should use render functions."),t.exports=a.exports},449:function(t,e,i){var a=i(59)(i(205),i(452),null,null);a.options.__file="/Users/binhthgc/Documents/fds/github/frontend-opencps-v2.1/onegate_21_serviceinfo/src/components/NotFound.vue",a.esModule&&Object.keys(a.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),a.options.functional&&console.error("[vue-loader] NotFound.vue: functional components are not supported with templates, they should use render functions."),t.exports=a.exports},450:function(t,e,i){var a=i(59)(i(206),i(454),null,null);a.options.__file="/Users/binhthgc/Documents/fds/github/frontend-opencps-v2.1/onegate_21_serviceinfo/src/components/Pagination.vue",a.esModule&&Object.keys(a.esModule).some(function(t){return"default"!==t&&"__esModule"!==t})&&console.error("named exports are not supported in *.vue files."),a.options.functional&&console.error("[vue-loader] Pagination.vue: functional components are not supported with templates, they should use render functions."),t.exports=a.exports},451:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-navigation-drawer",{attrs:{app:"",clipped:"",floating:"",width:"310"}},[i("v-tabs",{model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},[i("v-tabs-slider",{attrs:{color:"primary"}}),t._v(" "),i("v-tab",{key:"tab-1",staticClass:"primary--text",attrs:{ripple:""}},[t._v("\n        Cơ quan quản lý\n      ")]),t._v(" "),i("v-tab",{key:"tab-2",staticClass:"primary--text",attrs:{ripple:""}},[t._v("\n        Lĩnh vực\n      ")]),t._v(" "),i("v-tab",{key:"tab-3",staticClass:"primary--text",attrs:{ripple:""}},[t._v("\n        Mức độ\n      ")]),t._v(" "),i("v-tab-item",{key:"tab-1",staticClass:"list-coquan",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-list",{staticClass:"pt-0"},t._l(t.govAgencyList,function(e){return i("v-list-tile",{key:e.administrationCode,class:{"list__tile--active":String(t.currentAgency)===String(e.administrationCode)},on:{click:function(i){t.filterAgency(e)}}},[i("v-list-tile-action",[String(t.currentAgency)===String(e.administrationCode)?i("v-icon",{attrs:{color:"primary"}},[t._v("play_arrow")]):t._e()],1),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",{domProps:{textContent:t._s(e.administrationName)}}),t._v(" "),i("span",{staticClass:"status__counter",staticStyle:{color:"#0b72ba"}},[t._v("\n                  "+t._s(e.count)+"\n                ")])],1)],1)}))],1)],1),t._v(" "),i("v-tab-item",{key:"tab-2",staticClass:"list-coquan",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-list",{staticClass:"pt-0"},t._l(t.domainList,function(e){return i("v-list-tile",{key:e.domainCode,class:{"list__tile--active":String(t.currentDomain)===String(e.domainCode)},on:{click:function(i){t.filterDomain(e)}}},[i("v-list-tile-action",[String(t.currentDomain)===String(e.domainCode)?i("v-icon",{attrs:{color:"primary"}},[t._v("play_arrow")]):t._e()],1),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",{domProps:{textContent:t._s(e.domainName)}}),t._v(" "),i("span",{staticClass:"status__counter",staticStyle:{color:"#0b72ba"}},[t._v("\n                  "+t._s(e.count)+"\n                ")])],1)],1)}))],1)],1),t._v(" "),i("v-tab-item",{key:"tab-3",staticClass:"list-coquan",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-list",{staticClass:"pt-0"},t._l(t.levelList,function(e){return i("v-list-tile",{key:e.level,class:{"list__tile--active":String(t.currentLevel)===String(e.level)},on:{click:function(i){t.filterLevel(e)}}},[i("v-list-tile-action",[String(t.currentLevel)===String(e.level)?i("v-icon",{attrs:{color:"primary"}},[t._v("play_arrow")]):t._e()],1),t._v(" "),i("v-list-tile-content",[i("v-list-tile-title",[t._v("Mức độ "+t._s(e.level))]),t._v(" "),i("span",{staticClass:"status__counter",staticStyle:{color:"#0b72ba"}},[t._v("\n                  "+t._s(e.count)+"\n                ")])],1)],1)}))],1)],1)],1)],1),t._v(" "),i("v-content",[i("router-view")],1)],1)},staticRenderFns:[]},t.exports.render._withStripped=!0},452:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",{attrs:{fluid:""}},[i("v-layout",{attrs:{row:"",wrap:""}},[i("v-flex",{staticClass:"text-xs-center",attrs:{xs12:"","mt-5":""}},[i("v-progress-circular",{attrs:{size:100,width:1,color:"primary",indeterminate:""}})],1)],1)],1)},staticRenderFns:[]},t.exports.render._withStripped=!0},453:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"list-thu-tuc"},[t._m(0),t._v(" "),i("v-layout",{staticClass:"white py-2",attrs:{wrap:""}},[i("v-flex",{staticClass:"px-2 input-group--text-field-box",attrs:{xs3:""}},[i("v-select",{staticClass:"select-border",attrs:{items:t.govAgencyList,placeholder:"Chọn cơ quan","item-text":"administrationName","item-value":"administrationCode","hide-selected":!0,clearable:""},on:{change:t.changeAdministration},model:{value:t.govAgencySelected,callback:function(e){t.govAgencySelected=e},expression:"govAgencySelected"}})],1),t._v(" "),i("v-flex",{staticClass:"px-2 input-group--text-field-box",attrs:{xs3:""}},[i("v-select",{staticClass:"select-border",attrs:{items:t.domainListCurrent,placeholder:"Chọn lĩnh vực","item-text":"domainName","item-value":"domainCode","hide-selected":!0,clearable:""},on:{change:t.changeDomain},model:{value:t.domainSelected,callback:function(e){t.domainSelected=e},expression:"domainSelected"}})],1),t._v(" "),i("v-flex",{staticClass:"px-2 input-group--text-field-box",attrs:{xs3:""}},[i("v-select",{staticClass:"select-border",attrs:{items:t.levelList,autocomplete:"",placeholder:"Chọn mức độ","item-text":"textLevel","item-value":"level","hide-selected":!0,clearable:""},on:{change:t.changeLevel},model:{value:t.levelSelected,callback:function(e){t.levelSelected=e},expression:"levelSelected"}})],1),t._v(" "),i("v-flex",{staticClass:"pl-2 pr-2",attrs:{xs3:""}},[i("div",{staticStyle:{position:"relative"}},[i("v-text-field",{staticClass:"input-border input-search",attrs:{placeholder:"Nhập tên thủ tục hành chính",clearable:"",box:"","append-icon":"search"},on:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;t.filterServiceName()}},model:{value:t.serviceNameKey,callback:function(e){t.serviceNameKey=e},expression:"serviceNameKey"}})],1)])],1),t._v(" "),i("div",{staticClass:"service__info__table"},[i("v-data-table",{staticClass:"table-landing table-bordered",attrs:{headers:t.headers,items:t.serviceInfoList,"hide-actions":""},scopedSlots:t._u([{key:"items",fn:function(e){return[i("tr",{staticClass:"hover-pointer",class:{active:e.index%2==1}},[i("td",{staticClass:"text-xs-center"},[t.loading?i("content-placeholders",[i("content-placeholders-text",{attrs:{lines:1}})],1):i("div",[i("span",[t._v(t._s(15*t.thutucPage-15+e.index+1))]),i("br")])],1),t._v(" "),i("td",{staticClass:"text-xs-left",on:{click:function(i){t.viewDetail(e.item)}}},[t.loading?i("content-placeholders",[i("content-placeholders-text",{attrs:{lines:1}})],1):i("div",[i("span",[t._v(t._s(e.item.serviceName))])])],1),t._v(" "),i("td",{staticClass:"text-xs-left"},[t.loading?i("content-placeholders",[i("content-placeholders-text",{attrs:{lines:1}})],1):i("div",[i("span",[i("span",[t._v(t._s(e.item.domainName))])])])],1),t._v(" "),i("td",{staticClass:"text-xs-center"},[t.loading?i("content-placeholders",[i("content-placeholders-text",{attrs:{lines:1}})],1):i("div",[i("span",[i("v-chip",{staticClass:"mx-0 my-0 mt-1",attrs:{small:"",disabled:"",label:"",color:t.getColor(e.item.maxLevel),"text-color":"white"}},[t._v("\n                  Mức độ "+t._s(e.item.maxLevel)+"\n                ")])],1)])],1),t._v(" "),i("td",{staticClass:"text-xs-center"},[t.loading?i("content-placeholders",[i("content-placeholders-text",{attrs:{lines:1}})],1):i("div",[i("v-menu",{attrs:{bottom:"",right:"","offset-y":""}},[e.item.maxLevel>=3?i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Nộp hồ sơ   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1):i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Xem hướng dẫn   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),t._v(" "),e.item.serviceConfigs?i("v-list",t._l(t.serviceConfigs(e.item.serviceConfigs),function(e,a){return i("v-list-tile",{key:a},[e.serviceLevel>=3?i("v-list-tile-title",{on:{click:function(i){t.createDossier(e)}}},[t._v(t._s(e.govAgencyName))]):i("v-list-tile-title",{on:{click:function(i){t.viewGuide(e)}}},[t._v(t._s(e.govAgencyName))])],1)})):t._e()],1)],1)],1)])]}}])},[i("template",{slot:"no-data"},[i("div",{staticClass:"text-xs-center mt-2"},[t._v("\n          Không có thủ tục nào được tìm thấy\n        ")])])],2),t._v(" "),i("div",{staticClass:"text-xs-right layout wrap",staticStyle:{position:"relative"}},[i("div",{staticClass:"flex pagging-table px-2"},[i("tiny-pagination",{attrs:{total:t.totalThuTuc,page:t.thutucPage,"custom-class":"custom-tiny-class"},on:{"tiny:change-page":t.paggingData}})],1)])],1),t._v(" "),i("v-dialog",{attrs:{scrollable:"",persistent:"","max-width":"600"},model:{value:t.dialogGuide,callback:function(e){t.dialogGuide=e},expression:"dialogGuide"}},[i("v-card",[i("v-card-title",{staticClass:"headline"},[t._v("Hướng dẫn nộp hồ sơ")]),t._v(" "),t.serviceDetail?i("v-card-text",{staticStyle:{"max-height":"400px"},domProps:{innerHTML:t._s(t.serviceDetail.serviceInstruction)}}):t._e(),t._v(" "),i("v-card-actions",[i("v-spacer"),t._v(" "),i("v-btn",{attrs:{color:"green darken-1",flat:"flat"},nativeOn:{click:function(e){t.dialogGuide=!1}}},[t._v("\n          Đóng\n        ")])],1)],1)],1)],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"row-header"},[i("div",{staticClass:"background-triangle-big"},[i("span",[t._v("DANH SÁCH THỦ TỤC HÀNH CHÍNH")])])])}]},t.exports.render._withStripped=!0},454:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticStyle:{"text-align":"left",position:"absolute","line-height":"46px"}},[t._v("Tổng số "),i("span",{staticClass:"text-bold primary--text"},[t._v(t._s(t.total))]),t._v(" thủ tục. ")]),t._v(" "),t.total>0?i("div",{staticClass:"vue-tiny-pagination pagination layout",staticStyle:{"justify-content":"flex-end","-webkit-justify-content":"flex-end"}},[i("div",{staticClass:"px-3 xs4 flex"},[i("v-select",{attrs:{items:t.totalPagesData,"item-text":"text","item-value":"value",autocomplete:""},on:{input:t.goToPage},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1),t._v(" "),i("ul",{staticClass:"tiny-pagination",class:t.customClass},[i("li",{staticClass:"page-item",class:t.classFirstPage},[i("button",{staticClass:"pagination__navigation",class:t.classFirstPage,on:{click:function(e){return e.preventDefault(),t.lastPageLast(e)}}},[i("i",{staticClass:"material-icons icon",attrs:{"aria-hidden":"true"}},[t._v("first_page")])])]),t._v(" "),i("li",{staticClass:"page-item",class:t.classFirstPage},[i("button",{staticClass:"pagination__navigation",class:t.classFirstPage,staticStyle:{"border-left":"0"},on:{click:function(e){return e.preventDefault(),t.lastPage(e)}}},[i("i",{staticClass:"material-icons icon",attrs:{"aria-hidden":"true"}},[t._v("chevron_left")])])]),t._v(" "),i("li",{staticClass:"page-item",staticStyle:{"margin-right":"0"}},[i("button",{staticClass:"pagination__navigation pagination__navigation--disabled text-bold primary--text",staticStyle:{"border-right":"0","border-left":"0"}},[t._v("\n          "+t._s(t.titlePage)+"\n        ")])]),t._v(" "),i("li",{staticClass:"page-item",class:t.classLastPage,staticStyle:{"margin-right":"0"}},[i("button",{staticClass:"pagination__navigation",class:t.classLastPage,staticStyle:{"border-left":"0"},on:{click:function(e){return e.preventDefault(),t.nextPage(e)}}},[i("i",{staticClass:"material-icons icon",attrs:{"aria-hidden":"true"}},[t._v("chevron_right")])])]),t._v(" "),i("li",{staticClass:"page-item",class:t.classLastPage},[i("button",{staticClass:"pagination__navigation",class:t.classLastPage,on:{click:function(e){return e.preventDefault(),t.nextPageLast(e)}}},[i("i",{staticClass:"material-icons icon",attrs:{"aria-hidden":"true"}},[t._v("last_page")])])])])]):t._e()])},staticRenderFns:[]},t.exports.render._withStripped=!0},455:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"px-2 py-0"},[i("v-card",[i("div",{staticClass:"row-header"},[i("div",{staticClass:"background-triangle-big"},[i("span",[t._v("CHI TIẾT THỦ TỤC HÀNH CHÍNH")])]),t._v(" "),i("div",{staticClass:"layout row wrap header_tools row-blue"},[i("div",{staticClass:"flex xs4 sm2 text-right",staticStyle:{"margin-left":"auto"}},[i("v-btn",{staticClass:"my-0 mx-0 btn-border-left",attrs:{flat:"","active-class":"temp_active"},on:{click:t.goBack}},[t._v("\n            Quay lại  \n            "),i("v-icon",{attrs:{size:"16"}},[t._v("undo")])],1)],1)])]),t._v(" "),t.loading?i("content-placeholders",{staticClass:"mt-3"},[i("content-placeholders-text",{attrs:{lines:10}})],1):i("div",[i("v-layout",{staticClass:"wrap mt-3 ml-2"},[i("div",{staticClass:"pb-2",staticStyle:{width:"100px"}},[i("v-chip",{staticClass:"mx-0 my-0",staticStyle:{height:"px"},attrs:{small:"",disabled:"",label:"",color:t.getColor(t.serviceDetail.maxLevel),"text-color":"white"}},[t._v("\n            Mức độ "+t._s(t.serviceDetail.maxLevel)+"\n          ")])],1),t._v(" "),i("div",{staticStyle:{width:"calc(100% - 100px)"}},[i("span",{staticClass:"text-bold"},[t._v(t._s(t.serviceDetail.serviceName))])])]),t._v(" "),i("div",{staticClass:"mt-3"},[i("v-tabs",{attrs:{color:"#fff","slider-color":"#fff0"},model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},[i("v-tab",{key:"1",staticClass:"mr-2",attrs:{ripple:""}},[t._v(" Thông tin chung ")]),t._v(" "),i("v-tab",{key:"2",staticClass:"mr-2",attrs:{ripple:""}},[t._v(" Trình tự thực hiện")]),t._v(" "),i("v-tab",{key:"3",staticClass:"mr-2",attrs:{ripple:""}},[t._v(" Thành phần hồ sơ ")]),t._v(" "),i("v-tab",{key:"4",staticClass:"mr-2",attrs:{ripple:""}},[t._v(" Yêu cầu điều kiện ")]),t._v(" "),i("v-tab-item",{key:"1",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-card-text",{staticClass:"px-0 py-0"},[i("div",{staticClass:"table-detail-domain table-bordered"},[i("div",{staticClass:"table__overflow"},[i("table",{staticClass:"datatable table"},[i("tbody",[i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Cơ quan quản lý")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",[t._v(t._s(t.serviceDetail.administrationName))])])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Lĩnh vực")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",[t._v(t._s(t.serviceDetail.domainName))])])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Cách thực hiện")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.methodText)}})])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Thời gian giải quyết")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.durationText)}})])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Đối tượng")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.applicantText)}})])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Kết quả giải quyết")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.resultText)}})])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Lệ phí")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.feeText)}})])]),t._v(" "),i("tr",[i("td",{staticClass:"pt-2"},[i("span",{staticClass:"text-bold"},[t._v("Căn cứ pháp lý")])]),t._v(" "),i("td",{staticClass:"pt-2"},[i("span",{domProps:{innerHTML:t._s(t.serviceDetail.regularText)}})])])])])])])]),t._v(" "),i("v-menu",{staticClass:"ml-2 my-2",attrs:{bottom:"",right:"","offset-y":""}},[t.serviceDetail.maxLevel>=3?i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Nộp hồ sơ   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1):i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Xem hướng dẫn   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),t._v(" "),t.serviceDetail.serviceConfigs?i("v-list",t._l(t.serviceConfigs(t.serviceDetail.serviceConfigs),function(e,a){return i("v-list-tile",{key:a},[e.serviceLevel>=3?i("v-list-tile-title",{on:{click:function(i){t.createDossier(e)}}},[t._v(t._s(e.govAgencyName))]):i("v-list-tile-title",{on:{click:function(i){t.viewGuide(e)}}},[t._v(t._s(e.govAgencyName))])],1)})):t._e()],1)],1)],1),t._v(" "),i("v-tab-item",{key:"2",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-card-text",[i("div",{domProps:{innerHTML:t._s(t.serviceDetail.processText)}})]),t._v(" "),i("v-menu",{staticClass:"ml-2 mb-2",attrs:{bottom:"",right:"","offset-y":""}},[t.serviceDetail.maxLevel>=3?i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Nộp hồ sơ   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1):i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Xem hướng dẫn   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),t._v(" "),t.serviceDetail.serviceConfigs?i("v-list",t._l(t.serviceConfigs(t.serviceDetail.serviceConfigs),function(e,a){return i("v-list-tile",{key:a},[e.serviceLevel>=3?i("v-list-tile-title",{on:{click:function(i){t.createDossier(e)}}},[t._v(t._s(e.govAgencyName))]):i("v-list-tile-title",{on:{click:function(i){t.viewGuide(e)}}},[t._v(t._s(e.govAgencyName))])],1)})):t._e()],1)],1)],1),t._v(" "),i("v-tab-item",{key:"3",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-card-text",[i("div",{staticClass:"mb-2",domProps:{innerHTML:t._s(t.serviceDetail.dossierText)}}),t._v(" "),t.serviceDetail.fileTemplates&&t.fileTemplate(t.serviceDetail.fileTemplates)?i("div",[i("div",{staticClass:"text-bold mb-2"},[t._v("File biểu mẫu")]),t._v(" "),t._l(t.fileTemplate(t.serviceDetail.fileTemplates),function(e){return i("div",{key:e.fileTemplateNo,staticClass:"hover-pointer mb-1"},[i("span",{attrs:{slot:"activator"},on:{click:function(i){i.stopPropagation(),t.downloadFileTemplate(e)}},slot:"activator"},[i("v-icon",{staticStyle:{color:"#0d71bb"},attrs:{size:"16",color:"primary"}},[t._v("save_alt")]),t._v(" "),i("span",{staticClass:"pl-2 text-bold"},[t._v(t._s(e.templateName))])],1)])})],2):t._e()]),t._v(" "),i("v-menu",{staticClass:"ml-2 mb-2",attrs:{bottom:"",right:"","offset-y":""}},[t.serviceDetail.maxLevel>=3?i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Nộp hồ sơ   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1):i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Xem hướng dẫn   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),t._v(" "),t.serviceDetail.serviceConfigs?i("v-list",t._l(t.serviceConfigs(t.serviceDetail.serviceConfigs),function(e,a){return i("v-list-tile",{key:a},[e.serviceLevel>=3?i("v-list-tile-title",{on:{click:function(i){t.createDossier(e)}}},[t._v(t._s(e.govAgencyName))]):i("v-list-tile-title",{on:{click:function(i){t.viewGuide(e)}}},[t._v(t._s(e.govAgencyName))])],1)})):t._e()],1)],1)],1),t._v(" "),i("v-tab-item",{key:"4",attrs:{transition:"fade-transition","reverse-transition":"fade-transition"}},[i("v-card",[i("v-card-text",[i("div",{domProps:{innerHTML:t._s(t.serviceDetail.conditionText)}})]),t._v(" "),i("v-menu",{staticClass:"ml-2 mb-2",attrs:{bottom:"",right:"","offset-y":""}},[t.serviceDetail.maxLevel>=3?i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Nộp hồ sơ   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1):i("v-btn",{attrs:{slot:"activator",small:"",color:"primary"},slot:"activator"},[t._v("Xem hướng dẫn   "),i("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),t._v(" "),t.serviceDetail.serviceConfigs?i("v-list",t._l(t.serviceConfigs(t.serviceDetail.serviceConfigs),function(e,a){return i("v-list-tile",{key:a},[e.serviceLevel>=3?i("v-list-tile-title",{on:{click:function(i){t.createDossier(e)}}},[t._v(t._s(e.govAgencyName))]):i("v-list-tile-title",{on:{click:function(i){t.viewGuide(e)}}},[t._v(t._s(e.govAgencyName))])],1)})):t._e()],1)],1)],1)],1)],1)],1)],1),t._v(" "),i("v-dialog",{attrs:{scrollable:"",persistent:"","max-width":"600"},model:{value:t.dialogGuide,callback:function(e){t.dialogGuide=e},expression:"dialogGuide"}},[i("v-card",[i("v-card-title",{staticClass:"headline"},[t._v("Hướng dẫn nộp hồ sơ")]),t._v(" "),t.serviceConfigDetail?i("v-card-text",{staticStyle:{"max-height":"400px"},domProps:{innerHTML:t._s(t.serviceConfigDetail.serviceInstruction)}}):t._e(),t._v(" "),i("v-card-actions",[i("v-spacer"),t._v(" "),i("v-btn",{attrs:{color:"green darken-1",flat:"flat"},nativeOn:{click:function(e){t.dialogGuide=!1}}},[t._v("\n          Đóng\n        ")])],1)],1)],1)],1)},staticRenderFns:[]},t.exports.render._withStripped=!0},60:function(t,e,i){"use strict";var a=i(81),n=i.n(a),s=i(456),r=i(448),o=i.n(r),c=i(447),l=i.n(c),v=i(449),u=i.n(v),d=[{path:"/thu-tuc-hanh-chinh",name:"Landing",component:o.a,props:!0},{path:"/thu-tuc-hanh-chinh/:index",name:"ChiTietThuTuc",component:l.a,props:!0},{path:"*",name:"NotFound",component:u.a}];n.a.use(s.a);var p=new s.a({routes:d});e.a=p}},[201]);
//# sourceMappingURL=app.js.map