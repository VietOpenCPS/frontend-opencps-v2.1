(function(t){function e(e){for(var n,s,r=e[0],c=e[1],l=e[2],d=0,u=[];d<r.length;d++)s=r[d],i[s]&&u.push(i[s][0]),i[s]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);p&&p(e);while(u.length)u.shift()();return o.push.apply(o,l||[]),a()}function a(){for(var t,e=0;e<o.length;e++){for(var a=o[e],n=!0,s=1;s<a.length;s++){var c=a[s];0!==i[c]&&(n=!1)}n&&(o.splice(e--,1),t=r(r.s=a[0]))}return t}var n={},i={app:0},o=[];function s(t){return r.p+"../../wars/opencps-store/src/main/webapp/js/cli/thanhtoan_tructuyen/app/js/"+({HoanThienBoSungHoSoDetail:"HoanThienBoSungHoSoDetail",Landing:"Landing",TiepNhanHoSoDetail:"TiepNhanHoSoDetail"}[t]||t)+".js"}function r(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.e=function(t){var e=[],a=i[t];if(0!==a)if(a)e.push(a[2]);else{var n=new Promise((function(e,n){a=i[t]=[e,n]}));e.push(a[2]=n);var o,c=document.createElement("script");c.charset="utf-8",c.timeout=120,r.nc&&c.setAttribute("nonce",r.nc),c.src=s(t),o=function(e){c.onerror=c.onload=null,clearTimeout(l);var a=i[t];if(0!==a){if(a){var n=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src,s=new Error("Loading chunk "+t+" failed.\n("+n+": "+o+")");s.type=n,s.request=o,a[1](s)}i[t]=void 0}};var l=setTimeout((function(){o({type:"timeout",target:c})}),12e4);c.onerror=c.onload=o,document.head.appendChild(c)}return Promise.all(e)},r.m=t,r.c=n,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/",r.oe=function(t){throw console.error(t),t};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=e,c=c.slice();for(var d=0;d<c.length;d++)e(c[d]);var p=l;o.push(["56d7","chunk-vendors"]),a()})({"56d7":function(t,e,a){"use strict";a.r(e);a("0f18");var n=a("a026"),i=a("bb71");a("74ef");n["a"].use(i["a"],{theme:{primary:"#001f4d",secondary:"#424242",accent:"#001f4d",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"},customProperties:!0,iconfont:"md"});var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",{staticStyle:{background:"#fff !important"},attrs:{id:"app_thanhtoan_tructuyen"}},[t._e(),a("v-content",{staticStyle:{width:"100%","max-width":"1300px",margin:"0 auto"}},[a("router-view")],1)],1)},s=[],r={data:function(){return{isMobile:!1}},computed:{loading:function(){return this.$store.getters.loading}},created:function(){var t=this;t.$nextTick((function(){var t=window.location.search.replace("?id=",""),e=t.split("-secretKey=");if(2===e.length){var a=e[0],n=e[1],i=window.location.origin+window.location.pathname+"#/?id="+a+"&secretKey="+n;window.location.href=i}}))},beforeDestroy:function(){"undefined"!==typeof window&&window.removeEventListener("resize",this.onResize,{passive:!0})},mounted:function(){this.onResize(),window.addEventListener("resize",this.onResize,{passive:!0})},watch:{$route:function(t,e){t.params,t.query}},methods:{onResize:function(){var t=this;t.isMobile=window.innerWidth<1024},parse_query_string:function(t){for(var e=t.split("&"),a={},n=0;n<e.length;n++){var i=e[n].split("="),o=decodeURIComponent(i[0]),s=decodeURIComponent(i[1]);if("undefined"===typeof a[o])a[o]=decodeURIComponent(s);else if("string"===typeof a[o]){var r=[a[o],decodeURIComponent(s)];a[o]=r}else a[o].push(decodeURIComponent(s))}return a}}},c=r,l=a("2877"),d=a("6544"),p=a.n(d),u=a("7496"),h=a("549c"),m=a("f774"),v=Object(l["a"])(c,o,s,!1,null,null,null),f=v.exports;p()(v,{VApp:u["a"],VContent:h["a"],VNavigationDrawer:m["a"]});var g=a("8c4f"),y=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{staticClass:"text-xs-center",attrs:{xs12:"","mt-5":""}},[a("v-progress-circular",{attrs:{size:100,width:1,color:"primary",indeterminate:""}})],1)],1)],1)},_=[],w={},x=w,C=a("a523"),b=a("0e8f"),k=a("a722"),D=a("490a"),S=Object(l["a"])(x,y,_,!1,null,null,null),T=S.exports;p()(S,{VContainer:C["a"],VFlex:b["a"],VLayout:k["a"],VProgressCircular:D["a"]});var I=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-card",{staticClass:"pb-3",staticStyle:{border:"1px solid #dedede"}},[a("div",{staticClass:"row-header"},[a("div",{staticClass:"background-triangle-big"},[a("span",[t._v("THÔNG TIN THANH TOÁN")])]),a("div",{staticClass:"layout row wrap header_tools row-blue"},[a("div",{staticClass:"flex xs4 sm2 text-right",staticStyle:{"margin-left":"auto"}},[a("v-btn",{staticClass:"my-0 mx-0 btn-border-left",attrs:{flat:"","active-class":"temp_active"},on:{click:t.goBack}},[a("v-icon",{attrs:{size:"16"}},[t._v("reply")]),t._v("   Quay lại \n            \n          ")],1)],1)])]),a("div",[a("div",{staticClass:"mx-2 my-3"},[t.statusDeal?a("v-alert",{attrs:{outline:"",value:!0,type:"success"}},[t._v("\n          Giao dịch thanh toán thành công\n        ")]):a("v-alert",{attrs:{outline:"",value:!0,type:"error"}},[t._v("\n          Giao dịch thực hiện thất bại. "+t._s(t.keypayStatusText)+"\n        ")])],1),a("v-card",{staticClass:"mx-2"},[a("v-card-text",{staticClass:"px-0 py-0"},[a("div",{staticClass:"table-bordered",staticStyle:{"border-top":"1px solid #dedede"}},[a("div",{staticClass:"table__overflow"},[a("table",{staticClass:"datatable table"},[a("tbody",[a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Mã hồ sơ")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.dossierNo))])])]),a("tr",[a("td",{staticClass:"py-2",attrs:{width:"200"}},[a("span",{staticClass:"text-bold"},[t._v("Tên hồ sơ")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.serviceName))])])]),a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Chủ hồ sơ")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.applicantName))])])]),a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Cơ quan thực hiện")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.govAgencyName))])])]),a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Số tiền thanh toán")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.currency(t.dossierDetail.paymentAmount))+" VNĐ")])])]),t.statusDeal&&!t.payGate&&t.dossierDetail.transId?a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Mã giao dịch trực tuyến")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.transId))])])]):t._e(),t.statusDeal&&!t.payGate&&t.dossierDetail.goodCode?a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Mã hóa đơn")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(t.dossierDetail.goodCode))])])]):t._e(),t.statusDeal&&t.dossierDetail.paymentPortal?a("tr",[a("td",{staticClass:"py-2"},[a("span",{staticClass:"text-bold"},[t._v("Cổng thanh toán")])]),a("td",{staticClass:"py-2"},[a("span",[t._v(t._s(String(t.dossierDetail.paymentPortal).toUpperCase()))])])]):t._e()])])])])])],1)],1)])],1)},N=[],P={props:[],components:{},data:function(){return{dossierNoShift:!1,loading:!0,loadingAction:!1,statusDeal:!1,keypayStatusText:"",payGate:!1,dossierDetail:{serviceName:"",dossierNo:"",govAgencyName:"",applicantName:"",paymentFee:"",paymentAmount:"",transId:"",goodCode:"",paymentPortal:""},keypayStatusCode:{"00":"Thành công","01":"Đại lý không tồn tại trong hệ thống","02":"Chuỗi mã hóa không hợp lệ","03":"Mã giao dịch đại lý không hợp lệ","04":"Không tìm thấy giao dịch trong hệ thống","05":"Mã dịch vụ không hợp lệ","06":"Lỗi xác nhận giao dịch: giao dịch đã được xác nhận (thành công/ không thành công trước đó và không thể xác nhận lại)","07":"Mã quốc gia không hợp lệ","08":"Không nhận được thông điệp trả về từ Ngân Hàng","09":"Mô tả đơn hàng không hợp lệ",10:"Mã đơn hàng không hợp lệ",11:"Số tiền không hợp lệ",12:"Phí vận chuyển không hợp lệ",13:"Thuế không hợp lệ",14:"Đại lý chưa được cấu hình phí",15:"Sai mã Ngân hàng",16:"Số tiền thanh toán của Đại lý không nằm trong khoảng cho phép",17:"Tài khoản không đủ tiền",18:"Khách hàng đã Hủy giao dịch",19:"Thời gian thanh toán không hợp lệ",20:"Kiểu nhận mã OTP không hợp lệ",21:"Mã OTP sai",25:"Nhập sai thông tin chủ thẻ lần 1",26:"Nhập sai thông tin chủ thẻ lần 2",27:"Nhập sai thông tin chủ thẻ lần 3",30:"Phiên bản không hợp lệ",31:"Mã lệnh không hợp lệ",32:"Loại tiền tệ không hợp lệ",33:"Ngôn ngữ không hợp lệ",34:"Thông tin thêm (desc 1) không hợp lệ",35:"Thông tin thêm (desc 2) không hợp lệ",36:"Thông tin thêm (desc 3) không hợp lệ",37:"Thông tin thêm (desc 4) không hợp lệ",38:"Thông tin thêm (desc 5) không hợp lệ",39:"Chuỗi trả về - Return URL không hợp lệ",40:"Loại thẻ không hợp lệ",41:"Thẻ nghi vấn (thẻ đánh mất, hot card)",54:"Thẻ hết hạn",57:"Chưa đăng ký dịch vụ thanh toán trực tuyến",61:"Quá hạn mức giao dịch trong ngày",62:"Thẻ bị khóa",65:"Quá hạn mức 1 lần giao dịch",97:"Ngân hàng chưa sẵn sàng",98:"Giao dịch không",99:"Lỗi hệ thống"}}},computed:{},created:function(){var t=this;try{t.dossierNoShift=dossierNoShift}catch(e){}t.$nextTick((function(){var e=window.location.search.replace("?","");if(e){var a=t.parse_query_string(e),n=a.hasOwnProperty("response_code")?a.response_code:"";n=a.hasOwnProperty("responseCode")?a.responseCode:"";var i=a.hasOwnProperty("errorCode")?a.errorCode:"",o=(a.hasOwnProperty("dossierId")&&a.dossierId,a.hasOwnProperty("referenceUid")?a.referenceUid:""),s=a.hasOwnProperty("actionCode")?a.actionCode:"",r=a.hasOwnProperty("data")?a.data:"";if(!o&&r&&(o=r.split("_")[2]),a.hasOwnProperty("paygate")&&a.hasOwnProperty("orderId")){t.statusDeal="00"===i,t.payGate=!0;var c=a["orderId"].split("-");c.pop(),t.dossierNoShift&&c.shift();var l={dossierNo:c.join("-")};t.$store.dispatch("getDossiers",l).then((function(e){e&&e.length>0&&(t.dossierDetail["serviceName"]=e[0].dossierName,t.dossierDetail["dossierNo"]=e[0].dossierNo,t.dossierDetail["govAgencyName"]=e[0].govAgencyName,t.dossierDetail["applicantName"]=e[0].applicantName,t.dossierDetail["paymentPortal"]=a.hasOwnProperty("paygate")?a.paygate:"",t.dossierDetail["paymentAmount"]=a.hasOwnProperty("amount")?a.amount:"")}))}else"00"===n?t.statusDeal=!0:(t.statusDeal=!1,t.keypayStatusText=t.keypayStatusCode["responseCode"]?t.keypayStatusCode["responseCode"]:""),t.$store.dispatch("getDetailDossier",o).then((function(e){t.dossierDetail["serviceName"]=e.serviceName,t.dossierDetail["dossierNo"]=e.dossierNo,t.dossierDetail["govAgencyName"]=e.govAgencyName,t.dossierDetail["applicantName"]=e.applicantName,t.dossierDetail["transId"]=a.transId,t.dossierDetail["goodCode"]=a.goodCode,t.dossierDetail["paymentPortal"]=a.paymentPortal,t.dossierDetail["paymentAmount"]=a.net_cost;e.dossierId,o||e.referenceUid;var n={dossierId:o||e.referenceUid};if(!0===t.statusDeal){if(t.$store.dispatch("loadDossierPayments",n).then((function(e){t.dossierDetail["paymentAmount"]||(t.dossierDetail["paymentAmount"]=e.paymentAmount),t.dossierDetail["paymentFee"]=t.getEPaymentProfile(e.epaymentProfile).paymentFee})).catch((function(t){})),s){var i={dossierId:o||e.referenceUid,actionCode:s};t.$store.dispatch("processDossierRouter",i).then((function(t){})).catch((function(){}))}}else t.$store.dispatch("loadDossierPayments",n).then((function(e){t.dossierDetail["paymentFee"]=t.getEPaymentProfile(e.epaymentProfile).paymentFee})).catch((function(t){}))}))}}))},watch:{},methods:{parse_query_string:function(t){for(var e=t.split("&"),a={},n=0;n<e.length;n++){var i=e[n].split("="),o=decodeURIComponent(i[0]),s=decodeURIComponent(i[1]);if("undefined"===typeof a[o])a[o]=decodeURIComponent(s);else if("string"===typeof a[o]){var r=[a[o],decodeURIComponent(s)];a[o]=r}else a[o].push(decodeURIComponent(s))}return a},currency:function(t){return t&&t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")?t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."):0},goBack:function(){window.history.back()},getEPaymentProfile:function(t){if(!t)return"";try{return JSON.parse(t),JSON.parse(t)}catch(e){return""}}}},V=P,F=a("0798"),A=a("8336"),O=a("b0af"),U=a("99d9"),E=a("132d"),L=Object(l["a"])(V,I,N,!1,null,null,null),z=L.exports;p()(L,{VAlert:F["a"],VBtn:A["a"],VCard:O["a"],VCardText:U["b"],VIcon:E["a"]});var M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._v("\n  13123\n")])},R=[],H=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"form-chitiet"},[a("div",[a("v-tabs",{attrs:{"icons-and-text":""},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[a("v-tabs-slider",{attrs:{color:"primary"}}),a("v-tab",{key:1,attrs:{href:"#tabs-1"},on:{click:function(e){t.getNextActions()}}},[a("v-btn",{staticClass:"px-0 py-0 mx-0 my-0",attrs:{flat:""}},[3===t.originality?a("span",[t._v("XỬ LÝ HỒ SƠ")]):a("span",[t._v("CHUẨN BỊ HỒ SƠ")])])],1),a("v-tabs-items",{staticStyle:{overflow:"visible!important"},attrs:{"reverse-transition":"fade-transition",transition:"fade-transition"},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[a("v-tab-item",{key:1,attrs:{value:"tabs-1","reverse-transition":"fade-transition",transition:"fade-transition"}},[0!==t.checkInput&&t.filterNextActionEnable(t.btnDossierDynamics)?a("div",{staticStyle:{position:"relative"}},[a("v-expansion-panel",{staticClass:"expansion-pl",attrs:{value:[!0]}},[a("v-expansion-panel-content",{key:1,attrs:{"hide-actions":""}},[t._v("\n                123\n              ")])],1)],1):t._e(),t.btnStateVisible?a("div",{staticClass:"px-4 py-3",staticStyle:{"border-bottom":"1px solid #dddddd"}},[t._l(t.btnPlugins,(function(e,n){return a("v-btn",{key:n,staticClass:"ml-0 mr-2",attrs:{color:"primary",loading:t.loadingPlugin,disabled:t.loadingPlugin},nativeOn:{click:function(a){t.processPullBtnplugin(e,n)}}},[t._v("\n              "+t._s(e.pluginName)+"\n              "),a("span",{attrs:{slot:"loader"},slot:"loader"},[t._v("Loading...")])])})),t.btnStepsDynamics.length>0&&t.thongTinChiTietHoSo["permission"].indexOf("write")>=0?a("v-menu",{staticStyle:{display:"inline-block",position:"relative !important"},attrs:{bottom:"","offset-y":""}},[a("v-btn",{staticClass:"deactive__btn",attrs:{slot:"activator",color:"primary",dark:""},slot:"activator"},[t._v("Khác   "),a("v-icon",{attrs:{size:"18"}},[t._v("arrow_drop_down")])],1),a("v-list",t._l(t.btnStepsDynamics,(function(e,n){return a("v-list-tile",{key:n,on:{click:function(a){t.btnActionEvent(e,n)}}},[a("v-list-tile-title",[t._v(t._s(e.title))])],1)})),1)],1):t._e()],2):t._e()])],1)],1)],1)])},B=[],j=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-card",[t._l(t.dossierTemplateItems,(function(e,n){return t.partTypes.includes(e.partType)&&t.checkVisibleTemp(e,n)?a("div",{key:e.partNo,staticClass:"form_alpaca",staticStyle:{position:"relative"}},[a("v-expansion-panel",{staticClass:"expaned__list__data",attrs:{expand:"",value:[t.currentFormView==="formAlpaca"+e.partNo+t.id]}},[a("v-expansion-panel-content",{attrs:{"hide-actions":""}},[a("div",{staticStyle:{"background-color":"#fff"},attrs:{slot:"header"},on:{click:function(e){t.stateView=!1}},slot:"header"},[a("div",{staticStyle:{"align-items":"center",background:"#fff","padding-left":"25px"},style:{width:t.checkStyle(e)}},[a("div",{staticClass:"mr-2",staticStyle:{"min-width":"18px",display:"flex"},on:{click:function(a){t.onlyView&&e.hasForm?t.viewFile2(e):t.loadAlpcaForm(e)}}},[a("div",{staticClass:"header__tphs"},[a("span",{staticClass:"text-bold"},[t._v(t._s(n+1)+".")]),t._v("  ")]),a("div",{staticClass:"header__tphs"},[a("v-tooltip",{staticStyle:{"max-width":"100% !important"},attrs:{top:""}},[a("span",{attrs:{slot:"activator"},slot:"activator"},[t._v("\n                      "+t._s(e.partName)+"  \n                      "),e.required?a("span",{staticStyle:{color:"red"}},[t._v(" (*) ")]):t._e(),t._v("\n                        \n                    ")]),e.partTip["tip"]?a("span",[t._v(t._s(e.partTip["tip"]))]):t._e()]),e.hasForm&&e.daKhai&&(1===t.originality&&2!==e.partType||1!==t.originality)?a("v-tooltip",{attrs:{top:""}},[a("i",{staticClass:"fa fa-file-text-o",staticStyle:{color:"#0d71bb","font-size":"13px"},attrs:{slot:"activator","aria-hidden":"true"},slot:"activator"}),a("span",[t._v("Biểu mẫu trực tuyến (Đã khai)")])]):t._e(),e.hasForm&&!e.daKhai&&(1===t.originality&&2!==e.partType||1!==t.originality)?a("v-tooltip",{attrs:{top:""}},[a("i",{staticClass:"fa fa-file-o",staticStyle:{color:"#0d71bb","font-size":"13px"},attrs:{slot:"activator"},slot:"activator"}),a("span",[t._v("Biểu mẫu trực tuyến (Chưa khai)")])]):t._e(),t._v("\n                    \n                  "),!e.hasForm&&e.hasFileTemp?a("v-tooltip",{attrs:{top:""}},[a("v-icon",{staticStyle:{color:"#0d71bb"},attrs:{slot:"activator",size:"16",color:"primary"},on:{click:function(a){a.stopPropagation(),t.downloadFileTemplate(e,n)}},slot:"activator"},[t._v("save_alt")]),a("span",[t._v("Biểu mẫu điền thủ công")])],1):t._e()],1)]),a("div",{staticStyle:{display:"flex"}},[1===t.checkInput&&2===e.fileCheck&&e.stateEditFileCheck?a("v-text-field",{attrs:{placeholder:"Nhập lý do",rules:[function(t){return!!t||"Bạn phải nhập lý do trước khi gửi"}],required:""},on:{keyup:function(a){if(!("button"in a)&&t._k(a.keyCode,"enter",13,a.key,"Enter"))return null;t.changeFileComment(e,n)}},model:{value:e.fileComment,callback:function(a){t.$set(e,"fileComment",a)},expression:"item.fileComment"}}):t._e(),1===t.checkInput&&2===e.fileCheck&&e.stateEditFileCheck?a("v-tooltip",{attrs:{top:""}},[a("v-btn",{staticClass:"mx-0 my-0",attrs:{slot:"activator",icon:""},on:{click:function(a){a.stopPropagation(),t.changeFileComment(e,n)}},slot:"activator"},[a("v-icon",{staticClass:"mx-0",attrs:{size:"16",color:"primary"}},[t._v("send")])],1),a("span",[t._v("Gửi")])],1):t._e()],1),e.fileComment&&!e.stateEditFileCheck?a("i",{staticStyle:{"font-size":"12px",color:"#0d71bb","margin-left":"10px"}},[t._v(t._s(e.fileComment))]):t._e(),e.fileComment&&!e.stateEditFileCheck&&1===t.checkInput?a("v-tooltip",{attrs:{top:""}},[a("v-icon",{staticStyle:{"font-size":"13px",color:"#0d71bb","margin-left":"10px",cursor:"pointer"},attrs:{slot:"activator"},on:{click:function(t){t.stopPropagation(),e.stateEditFileCheck=!e.stateEditFileCheck}},slot:"activator"},[t._v("edit")]),a("span",[t._v("Chỉnh sửa ý kiến")])],1):t._e(),t._l(t.dossierFilesItems,(function(n,i){return e.partNo!==n.dossierPartNo||n.eForm?t._e():a("div",{key:i},[a("div",{style:{width:"calc(100% - 370px)",display:"flex","align-items":"center",background:"#fff","padding-left":"15px","font-size":"12px","margin-bottom":t.onlyView?"5px":"0px"}},[a("span",{staticClass:"ml-3",staticStyle:{cursor:"pointer"},on:{click:function(e){e.stopPropagation(),t.viewFile2(n)}}},[0!==n.fileSize?a("v-icon",[t._v("attach_file")]):t._e(),t._v("\n                    "+t._s(n.displayName)+" - \n                    "),a("i",[t._v(t._s(n.modifiedDate))])],1),t.onlyView||1===t.checkInput?t._e():a("v-btn",{staticClass:"mx-0 my-0",attrs:{icon:"",ripple:""},on:{click:function(e){e.stopPropagation(),t.deleteSingleFile(n,i)}}},[a("v-icon",{staticStyle:{color:"red"}},[t._v("delete_outline")])],1)],1)])})),a("div",{staticClass:"mr-3 my-1 py-2",staticStyle:{display:"none",border:"1px solid #f3ae75"},attrs:{id:"fileApplicant-"+e.partNo}},t._l(t.dossierFilesApplicant,(function(n,i){return n.dossierTemplateNo===t.thongTinHoSo["dossierTemplateNo"]&&e.partNo===n.dossierPartNo?a("div",{key:i},[n.eForm?a("div",{style:{width:"calc(100% - 0px)",display:"flex","align-items":"center",background:"#fff","padding-left":"15px","font-size":"12px","margin-bottom":t.onlyView?"5px":"0px"}},[a("v-tooltip",{staticStyle:{"max-width":"100%"},attrs:{top:""}},[a("span",{staticClass:"ml-3",staticStyle:{cursor:"pointer"},attrs:{slot:"activator"},on:{click:function(e){e.stopPropagation(),t.viewGiayToDaNop(n)}},slot:"activator"},[a("i",{staticClass:"ml-1 fa fa-file-o",staticStyle:{color:"#0d71bb","font-size":"13px"}}),t._v("  \n                        "+t._s(n.referenceUid)+"."+t._s(n.fileType)+" - \n                        "),a("i",[t._v(t._s(n.modifiedDate))])]),a("span",[t._v("Bản khai trực tuyến")])])],1):a("div",{style:{width:"calc(100% - 0px)",display:"flex","align-items":"center",background:"#fff","padding-left":"15px","font-size":"12px","margin-bottom":t.onlyView?"5px":"0px"}},[a("v-tooltip",{staticStyle:{"max-width":"100%"},attrs:{top:""}},[a("span",{staticClass:"ml-3",staticStyle:{cursor:"pointer"},attrs:{slot:"activator"},on:{click:function(e){e.stopPropagation(),t.viewGiayToDaNop(n)}},slot:"activator"},[0!==n.fileSize?a("v-icon",{staticStyle:{color:"#0d71bb"}},[t._v("attach_file")]):t._e(),t._v("\n                        "+t._s(n.displayName)+" - \n                        "),a("i",[t._v(t._s(n.modifiedDate))])],1),a("span",[t._v("Đính kèm")])])],1)]):t._e()})),0)],2)]),e.hasForm&&!t.onlyView?a("v-card",[a("v-card-text",{staticStyle:{"background-color":"rgba(244, 247, 213, 0.19)"}},[a("v-layout",{attrs:{wrap:""}},[t.stateView?t._e():a("v-flex",{staticClass:"text-xs-right",attrs:{xs12:""}},[a("div",{style:t.pstFixed>t.pstEl&&t.pstFixed<t.endEl+t.pstEl?"position:fixed;top:5px;z-index:101":"",attrs:{id:"wrapForm"+e.partNo+t.id}},[e.hasForm&&!t.onlyView&&1!==t.checkInput?a("v-btn",{attrs:{color:"primary"},on:{click:function(a){t.saveAlpacaForm(e,n)}}},[t._v("Lưu lại")]):t._e(),e.daKhai&&e.hasForm&&!t.onlyView&&1!==t.checkInput?a("v-btn",{attrs:{color:"primary"},on:{click:function(a){t.deleteSingleFileEform(e,n)}}},[t._v("Xóa")]):t._e(),e.daKhai&&e.hasForm?a("v-btn",{attrs:{color:"primary"},on:{click:function(a){t.previewFileEfom(e,n)}}},[t._v("In")]):t._e()],1),!t.onlyView||e.daKhai?a("div",{class:{no_acction__event:t.onlyView},attrs:{id:"formAlpaca"+e.partNo+t.id}}):t._e()])],1)],1)],1):t._e()],1)],1),a("div",{staticClass:"absolute__btn group__thanh_phan mr-1"},[t.loading?a("content-placeholders",{staticClass:"mt-1"},[a("content-placeholders-text",{attrs:{lines:1}})],1):a("v-layout",{attrs:{row:"",wrap:""}},[1===t.originality||1!==e.partType||t.thongTinHoSo.online||1===t.checkInput?t._e():a("v-flex",{staticClass:"layout wrap",staticStyle:{width:"110px"}},[a("v-select",{attrs:{items:t.fileMarkItems,disabled:t.onlyView},on:{change:function(e){t.changeFileMark(e,n)}},model:{value:t.dossierTemplateItems[n].fileMark,callback:function(e){t.$set(t.dossierTemplateItems[n],"fileMark",e)},expression:"dossierTemplateItems[index].fileMark"}})],1),1===t.checkInput?a("v-flex",{staticClass:"layout wrap",staticStyle:{width:"120px"}},[a("v-select",{attrs:{items:t.fileCheckItems,"item-text":"text","item-value":"value"},on:{change:function(e){t.changeFileCheck(e,n)}},model:{value:t.dossierTemplateItems[n].fileCheck,callback:function(e){t.$set(t.dossierTemplateItems[n],"fileCheck",e)},expression:"dossierTemplateItems[index].fileCheck"}})],1):e.fileCheck>0?a("v-flex",{staticClass:"layout wrap",style:{width:"20px","align-items":"center","margin-left":"10px","margin-top":t.thongTinHoSo.online?"10px":"0px"}},[1===e.fileCheck?a("v-tooltip",{attrs:{top:""}},[a("v-icon",{staticClass:"mx-0",attrs:{slot:"activator",size:"16",color:"primary"},slot:"activator"},[t._v("done")]),a("span",[t._v("Đạt")])],1):2===e.fileCheck?a("v-tooltip",{attrs:{top:""}},[a("v-icon",{staticClass:"mx-0",attrs:{slot:"activator",size:"16",color:"primary"},slot:"activator"},[t._v("close")]),a("span",[t._v("Không đạt")])],1):t._e()],1):t._e(),1!==t.checkInput?a("v-flex",{class:{"text-xs-right":t.onlyView},style:{width:t.onlyView?"auto":"90px"}},[a("input",{staticStyle:{display:"none"},attrs:{type:"file",id:"file"+e.partNo},on:{change:function(a){t.onUploadSingleFile(a,e,n)}}}),3!==e.partType||3!==t.originality||t.onlyView?t._e():a("v-tooltip",{attrs:{top:""}},[a("v-btn",{staticClass:"mx-0 my-0",attrs:{slot:"activator",icon:""},on:{click:function(a){t.addFileOther(e)}},slot:"activator"},[a("v-icon",{staticClass:"mx-0",attrs:{size:"16",color:"primary"}},[t._v("add")])],1),a("span",[t._v("Thêm giấy tờ khác")])],1),t.progressUploadPart===e.partNo?a("v-progress-circular",{attrs:{width:2,size:25,color:"green",indeterminate:""}}):t.progressUploadPart===e.partNo||t.onlyView?t._e():a("v-tooltip",{attrs:{left:""}},[a("v-btn",{staticClass:"mx-0 my-0",attrs:{slot:"activator",icon:""},on:{click:function(a){t.pickFile(e)}},slot:"activator"},[a("v-badge",[a("v-icon",{attrs:{size:"16",color:"primary"}},[t._v("cloud_upload")])],1)],1),e.partTip["extensions"]||e.partTip["maxSize"]?a("span",[t._v("Chấp nhận tải lên các định dạng: "+t._s(e.partTip["extensions"])+". Tối đa "+t._s(e.partTip["maxSize"])+" MB ")]):a("span",[t._v("Tải file lên")])],1),t.partNoApplicantHasFile(e.partNo)&&!t.onlyView?a("v-tooltip",{attrs:{top:""}},[a("v-btn",{staticClass:"mx-0 my-0",attrs:{slot:"activator",icon:""},on:{click:function(a){t.showFilesApplicant(e.partNo)}},slot:"activator"},[a("v-badge",[a("v-icon",{attrs:{size:"16",color:"orange darken-3"}},[t._v("warning")])],1)],1),a("span",[t._v("Giấy tờ đã nộp")])],1):t._e()],1):t._e()],1)],1)],1):t._e()})),t.partTypes.includes(2)?t._e():a("div",[a("v-layout",{staticClass:"mx-4",attrs:{wrap:""}},[!t.onlyView||t.onlyView&&t.applicantNoteDossier?a("v-flex",{staticClass:"my-0 py-2 text-bold",staticStyle:{width:"60px"}},[t._v("Ghi chú:")]):t._e(),a("v-flex",{staticStyle:{width:"calc(100% - 80px)"}},[t.onlyView?t._e():a("div",{staticClass:"pl-2"},[a("v-text-field",{staticClass:"py-0",attrs:{"multi-line":"",rows:"3"},on:{input:t.changeApplicantNote},model:{value:t.applicantNoteDossier,callback:function(e){t.applicantNoteDossier=e},expression:"applicantNoteDossier"}})],1),t.onlyView&&t.applicantNoteDossier?a("p",{staticClass:"my-0 py-2"},[t._v("\n            "+t._s(t.applicantNoteDossier)+" \n          ")]):t._e()])],1)],1),a("v-dialog",{attrs:{"max-width":"400",transition:"fade-transition",persistent:""},model:{value:t.dialogAddOtherTemp,callback:function(e){t.dialogAddOtherTemp=e},expression:"dialogAddOtherTemp"}},[a("v-card",[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-card-title",{staticClass:"headline"},[t._v("Tên giấy tờ")]),a("v-btn",{staticClass:"mx-0 my-0 absolute__btn_panel mr-2",attrs:{icon:"",dark:""},nativeOn:{click:function(e){return t.cancelDialog(e)}}},[a("v-icon",[t._v("clear")])],1),t.loadingAddOther?a("v-progress-linear",{staticClass:"my-0",attrs:{indeterminate:!0}}):t._e(),a("v-card-text",{staticClass:"pb-0 pt-4"},[a("v-layout",{attrs:{wrap:""}},[a("v-flex",{staticClass:"px-2 pb-3 fix__label",attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"Tên giấy tờ:",rules:[function(t){return!!t||"Bạn phải điền tên giấy tờ."}],required:""},model:{value:t.otherDossierTemplate,callback:function(e){t.otherDossierTemplate=e},expression:"otherDossierTemplate"}})],1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"red darken-3",flat:"flat"},nativeOn:{click:function(e){return t.cancelDialog(e)}}},[t._v("\n              Quay lại\n            ")]),a("v-btn",{attrs:{color:"primary",flat:"flat",loading:t.loadingAddOther},nativeOn:{click:function(e){return t.addOtherTemplate(e)}}},[t._v("\n              Đồng ý\n              "),a("span",{attrs:{slot:"loader"},slot:"loader"},[t._v("Loading...")])])],1)],1)],1)],1)],2),a("v-dialog",{staticStyle:{overflow:"hidden"},attrs:{"max-width":"900",transition:"fade-transition"},model:{value:t.dialogPDF,callback:function(e){t.dialogPDF=e},expression:"dialogPDF"}},[a("v-card",[a("v-card-title",{staticClass:"headline"},[t.pdfEform?a("span",[t._v("Bản khai trực tuyến")]):a("span",[t._v("File đính kèm")])]),a("v-btn",{staticClass:"mx-0 my-0 absolute__btn_panel mr-2",attrs:{icon:"",dark:""},nativeOn:{click:function(e){t.dialogPDF=!1}}},[a("v-icon",[t._v("clear")])],1),t.dialogPDFLoading?a("div",{staticStyle:{"min-height":"600px","text-align":"center",margin:"auto",padding:"25%"}},[a("v-progress-circular",{attrs:{size:100,width:1,color:"primary",indeterminate:""}})],1):t._e(),a("iframe",{directives:[{name:"show",rawName:"v-show",value:!t.dialogPDFLoading,expression:"!dialogPDFLoading"}],staticStyle:{overflow:"auto","min-height":"600px"},attrs:{id:"dialogPDFPreview"+t.id,src:"",type:"application/pdf",width:"100%",height:"100%",frameborder:"0"}})],1)],1)],1)},G=[],$={data:function(){return{}}},q=$,K=a("4ca6"),J=a("12b2"),Q=a("169a"),X=a("cd55"),W=a("49e2"),Y=a("4bd4"),Z=a("8e36"),tt=a("b56d"),et=a("9910"),at=a("2677"),nt=a("3a2f"),it=Object(l["a"])(q,j,G,!1,null,null,null),ot=it.exports;p()(it,{VBadge:K["a"],VBtn:A["a"],VCard:O["a"],VCardActions:U["a"],VCardText:U["b"],VCardTitle:J["a"],VDialog:Q["a"],VExpansionPanel:X["a"],VExpansionPanelContent:W["a"],VFlex:b["a"],VForm:Y["a"],VIcon:E["a"],VLayout:k["a"],VProgressCircular:D["a"],VProgressLinear:Z["a"],VSelect:tt["a"],VSpacer:et["a"],VTextField:at["a"],VTooltip:nt["a"]});var st={props:["index","id"],components:{"thanh-phan-ho-so":ot},data:function(){return{}}},rt=st,ct=a("8860"),lt=a("ba95"),dt=a("5d23"),pt=a("e449"),ut=a("71a3"),ht=a("c671"),mt=a("fe57"),vt=a("aac8"),ft=a("9a96"),gt=Object(l["a"])(rt,H,B,!1,null,null,null),yt=gt.exports;p()(gt,{VBtn:A["a"],VExpansionPanel:X["a"],VExpansionPanelContent:W["a"],VIcon:E["a"],VList:ct["a"],VListTile:lt["a"],VListTileTitle:dt["b"],VMenu:pt["a"],VTab:ut["a"],VTabItem:ht["a"],VTabs:mt["a"],VTabsItems:vt["a"],VTabsSlider:ft["a"]});var _t={props:["id","formCode"],components:{"xem-chi-tiet-ho-so-detail-can-bo":yt},data:function(){return{initData:null,step:""}}},wt=_t,xt=Object(l["a"])(wt,M,R,!1,null,null,null),Ct=xt.exports,bt=[{path:"/",name:"Landing",component:z,props:!1},{path:"/danh-sach-ho-so/:index",name:"Landing",component:function(){return a.e("Landing").then(a.bind(null,"306c"))},props:!0,meta:{requiresAuth:!1}},{path:"/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode",name:"TiepNhanHoSoDetail",component:function(){return a.e("TiepNhanHoSoDetail").then(a.bind(null,"d129"))},props:!0,meta:{requiresAuth:!1}},{path:"/danh-sach-ho-so/:index/bo-sung-ho-so/:id",name:"HoanThienBoSungHoSoDetail",component:function(){return a.e("HoanThienBoSungHoSoDetail").then(a.bind(null,"a35c"))},props:!0,meta:{requiresAuth:!1}},{path:"/danh-sach-ho-so/:index/ho-so/:id/:formCode",name:"DetailForward",component:Ct,props:!0},{path:"*",name:"NotFound",component:T}];n["a"].use(g["a"]);var kt=new g["a"]({routes:bt}),Dt=kt,St=a("2f62"),Tt=a("854a"),It=a.n(Tt),Nt=a("bc3a"),Pt=a.n(Nt),Vt=(a("1157"),a("6821f")),Ft=a.n(Vt);n["a"].use(It.a),n["a"].use(St["a"]),It.a.options={closeButton:!0,timeOut:"3000"};var At=new St["a"].Store({state:{initData:{},loading:!1,user:{role:""},endPointApi:"/o/rest/v2",dossierDetail:"",secretCode:"",md5Token:""},actions:{loadInitResource:function(t){var e=t.commit,a=t.state;return new Promise((function(t,n){null!==window.themeDisplay&&void 0!==window.themeDisplay?(a.initData["groupId"]=window.themeDisplay.getScopeGroupId(),a.initData["user"]={userName:window.themeDisplay.getUserName(),userEmail:"",userId:window.themeDisplay.getUserId()}):(a.initData["groupId"]=0,a.initData["user"]={userName:"",userEmail:"",userId:20103}),""===a["user"].role?At.dispatch("getRoleUser").then((function(n){a["user"].role=n,e("setInitData",a.initData),t(a.initData)})).catch((function(n){a["user"].role=["default"],e("setInitData",a.initData),t(a.initData)})):(e("setInitData",a.initData),t(a.initData))}))},loadingDataHoSo:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){At.dispatch("getTokenMd5");var o={headers:{groupId:a.initData.groupId,authenKey:a.md5Token},params:{start:10*e.page-10,end:10*e.page,dossierNo:e.dossierNo?e.dossierNo:"",applicantIdNo:e.applicantIdNo?e.applicantIdNo:"",status:e.status?e.status:""}};Pt.a.get(a.endPointApi+"/dossiers",o).then((function(e){var a=e.data;t(a)})).catch((function(t){n(t)}))}))}))},getDossiers:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){At.dispatch("getTokenMd5");var o={url:"/o/rest/v2/dossiers",method:"get",params:{dossierNo:e.dossierNo,order:!0,start:0,end:15},headers:{groupId:a.initData.groupId,authenKey:a.md5Token}};Pt.a.request(o).then((function(e){var a=e.data;a.data?t(a.data):t([])})).catch((function(t){n(t)}))})).catch((function(){}))}))},doActionPayGov:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){var i={headers:{groupId:a.initData.groupId,Accept:"application/json"}},o={amount:e.amount,orderId:e.orderId,orderInfo:e.orderInfo,requestCode:e.requestCode,transactionNo:e.transactionNo,transactionCode:e.transactionCode,payDate:e.payDate,errorCode:e.errorCode,paygate:e.paygate,type:e.type,checksum:e.checksum};Pt.a.post("/o/pgi/paygov/dpnhankqthanhtoanhs",o,i).then((function(t){})).catch((function(t){}))}))},getDetailDossier:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){var o={headers:{groupId:a.initData.groupId}};Pt.a.get("/o/rest/v2/dossiers/"+e,o).then((function(e){t(e.data)}),(function(t){n(t)})).catch((function(t){}))})).catch((function(){}))}))},getRoleUser:function(t,e){t.commit;var a=t.state;return new Promise((function(t,e){var n={headers:{groupId:window.themeDisplay?window.themeDisplay.getScopeGroupId():""}};Pt.a.get(a.endPointApi+"/users/login",n).then((function(e){var a=e.data;if(a&&a.length>0){var n=[];for(var i in a)a[i]["role"]&&n.push(a[i]["role"]);t(n)}else t(["default"])})).catch((function(t){e("default")}))}))},loadDossierActions:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){var o={headers:{groupId:a.initData.groupId}};Pt.a.get(a.endPointApi+"/dossiers/"+e.dossierId+"/sequences",o).then((function(e){t(e.data)})).catch((function(t){n(t)}))}))}))},loadDossierPayments:function(t,e){t.commit;var a=t.state,n={headers:{groupId:a.initData.groupId},params:{}},i="/o/rest/v2/dossiers/"+e.dossierId+"/payment";return new Promise((function(t,e){Pt.a.get(i,n).then((function(e){t(e.data)})).catch((function(t){e(t)}))}))},putPayments:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){var i={headers:{groupId:a.initData.groupId}},o=new URLSearchParams;Pt.a.put("/o/rest/v2/dossiers/keypay/"+e.referenceUid+"/"+e.referenceUid,o,i).then((function(e){e.data?t(e.data):t([])})).catch((function(t){n(t)}))}))},processDossierRouter:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){var o={headers:{groupId:a.initData.groupId,Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}},s=new URLSearchParams;s.append("actionCode",e.actionCode?e.actionCode:""),s.append("payment",e.payment?JSON.stringify(e.payment):""),s.append("assignUsers",e.toUsers?JSON.stringify(e.toUsers):""),s.append("actionNote",e.userNote?JSON.stringify(e.userNote):""),s.append("payload",e.payload?JSON.stringify(e.payload):""),Pt.a.post("/o/rest/v2/dossiers/"+e.dossierId+"/actions",s,o).then((function(e){var a=e.data;t(a)})).catch((function(t){n(t)}))})).catch((function(){}))}))},checkkeypay:function(t,e){t.commit;var a=t.state;return new Promise((function(t,n){At.dispatch("loadInitResource").then((function(i){var o={headers:{groupId:a.initData.groupId,Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}},s=new URLSearchParams;s.append("good_code",e.good_code),s.append("command",e.command),s.append("merchant_trans_id",e.merchant_trans_id),s.append("merchant_code",e.merchant_code),s.append("response_code",e.response_code),s.append("trans_id",e.trans_id),s.append("net_cost",e.net_cost),s.append("ship_fee",e.ship_fee),s.append("tax",e.tax),s.append("service_code",e.service_code),s.append("currency_code",e.currency_code),s.append("bank_code",e.bank_code),s.append("secure_hash",e.secure_hash),s.append("dossierId",e.dossierId),Pt.a.post("o/rest/v2/dossiers/checkkeypay",s,o).then((function(e){var a=e.data;t(a)})).catch((function(t){n(t)}))})).catch((function(){}))}))},getTokenMd5:function(t){var e=t.commit,a=(t.state,(new Date).getDate()),n=(new Date).getMonth()+1,i=(new Date).getFullYear(),o=(new Date).getHours(),s=(new Date).getMinutes(),r=new Date("".concat(i,"-").concat(n.toString().padStart(2,"0"),"-").concat(a.toString().padStart(2,"0"),"T").concat(o.toString().padStart(2,"0"),":").concat(s.toString().padStart(2,"0"))).getTime(),c=Ft()("opencps"+r);e("setMd5Token",c)}},mutations:{setLoading:function(t,e){t.loading=e},setInitData:function(t,e){t.initData=e},setDossierDetail:function(t,e){t.dossierDetail=e},setScretCode:function(t,e){t.secretCode=e},setMd5Token:function(t,e){t.md5Token=e}},getters:{loading:function(t){return t.loading},getDetailDossier:function(t){return t.dossierDetail},getScretCode:function(t){return t.secretCode}}}),Ot=a("967d"),Ut=(a("d304"),void 0!==window.themeDisplay?window.themeDisplay.getScopeGroupId():0);Pt.a.defaults.withCredentials=!0,Pt.a.defaults.headers.common["Token"]=void 0!==window.Liferay?window.Liferay.authToken:"",Pt.a.defaults.headers.common["groupId"]=Ut,n["a"].config.productionTip=!0,n["a"].use(Ot["default"]),n["a"].mixin({methods:{getScopeGroupId:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.themeDisplay.getScopeGroupId():0},getAuthToken:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.Liferay.authToken:""},getUserId:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.themeDisplay.getUserId():0}}}),new n["a"]({router:Dt,store:At,render:function(t){return t(f)}}).$mount("#app_thanhtoan_tructuyen")},"74ef":function(t,e,a){}});