(function(e){function t(t){for(var n,r,c=t[0],l=t[1],s=t[2],d=0,p=[];d<c.length;d++)r=c[d],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&p.push(o[r][0]),o[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);u&&u(t);while(p.length)p.shift()();return i.push.apply(i,s||[]),a()}function a(){for(var e,t=0;t<i.length;t++){for(var a=i[t],n=!0,c=1;c<a.length;c++){var l=a[c];0!==o[l]&&(n=!1)}n&&(i.splice(t--,1),e=r(r.s=a[0]))}return e}var n={},o={app:0},i=[];function r(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=n,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var s=0;s<c.length;s++)t(c[s]);var u=l;i.push(["56d7","chunk-vendors"]),a()})({"034f":function(e,t,a){"use strict";a("64a9")},"56d7":function(e,t,a){"use strict";a.r(t);a("0f18");var n=a("a026"),o=a("bb71");a("74ef");n["a"].use(o["a"],{theme:{primary:"#001f4d",secondary:"#424242",accent:"#001f4d",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"},customProperties:!0,iconfont:"md"});var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{attrs:{id:"app_chart_vue"}},[e._e(),a("v-content",[a("v-card-text",{staticClass:"px-0 py-0"},[a("div",{staticClass:"row-header mb-5"},[a("div",{staticClass:"background-triangle-big1"},[e._v("THỐNG KÊ ĐÁNH GIÁ HÀI LÒNG CÁN BỘ")]),a("v-layout",{attrs:{wrap:""}},[a("v-flex",{staticClass:"filter-time ml-3"},[a("v-select",{staticStyle:{width:"300px",display:"inline-block",margin:"0 10px"},attrs:{items:e.listGroup,"item-text":"text","item-value":"code"},on:{change:e.getStatisticVoting},model:{value:e.groupSelected,callback:function(t){e.groupSelected=t},expression:"groupSelected"}}),a("v-select",{staticStyle:{width:"120px",display:"inline-block",margin:"0 10px"},attrs:{items:e.monthList,"item-text":"name","item-value":"value"},on:{change:e.getStatisticVoting},model:{value:e.monthSelected,callback:function(t){e.monthSelected=t},expression:"monthSelected"}}),a("v-select",{staticStyle:{width:"120px",display:"inline-block",margin:"0 10px"},attrs:{items:e.yearList,"item-text":"name","item-value":"value"},on:{change:e.getStatisticVoting},model:{value:e.yearSelected,callback:function(t){e.yearSelected=t},expression:"yearSelected"}})],1),a("v-flex",{},[a("v-menu",{ref:"menuDate1",attrs:{"close-on-content-click":!0,transition:"scale-transition","offset-y":"","full-width":""},model:{value:e.menuDate1,callback:function(t){e.menuDate1=t},expression:"menuDate1"}},[a("v-text-field",{staticClass:"search-input-appbar input-search",attrs:{slot:"activator",placeholder:"Từ ngày","persistent-hint":"","append-icon":"event","hide-details":"",flat:"",height:"32","min-height":"32","append-outer-icon":"remove",readonly:""},on:{blur:function(t){e.fromReceiveDate=e.parseDate(e.fromReceiveDateFormatted)}},slot:"activator",model:{value:e.fromReceiveDateFormatted,callback:function(t){e.fromReceiveDateFormatted=t},expression:"fromReceiveDateFormatted"}},[a("template",{slot:"append-outer"},[a("v-icon",{attrs:{color:"primary"}},[e._v("remove")])],1)],2),a("v-date-picker",{attrs:{max:e.toReceiveDateFormatted?e.getMinMax(e.toReceiveDateFormatted):e.currentDate(),locale:"vi","first-day-of-week":1,"no-title":""},on:{input:function(t){return e.changeDate("1")}},model:{value:e.fromReceiveDate,callback:function(t){e.fromReceiveDate=t},expression:"fromReceiveDate"}})],1)],1),a("v-flex",{staticClass:"pl-2"},[a("v-menu",{ref:"menuDate2",attrs:{"close-on-content-click":!0,transition:"scale-transition","offset-y":"","full-width":""},model:{value:e.menuDate2,callback:function(t){e.menuDate2=t},expression:"menuDate2"}},[a("v-text-field",{staticClass:"search-input-appbar input-search",attrs:{slot:"activator",placeholder:"Đến ngày","persistent-hint":"","append-icon":"event","hide-details":"",flat:"",height:"32","min-height":"32",readonly:""},on:{blur:function(t){e.toReceiveDate=e.parseDate(e.toReceiveDateFormatted)}},slot:"activator",model:{value:e.toReceiveDateFormatted,callback:function(t){e.toReceiveDateFormatted=t},expression:"toReceiveDateFormatted"}}),a("v-date-picker",{attrs:{min:e.fromReceiveDateFormatted?e.getMinMax(e.fromReceiveDateFormatted):null,max:e.currentDate(),locale:"vi","first-day-of-week":1,"no-title":""},on:{input:function(t){return e.changeDate("2")}},model:{value:e.toReceiveDate,callback:function(t){e.toReceiveDate=t},expression:"toReceiveDate"}})],1)],1)],1)],1),a("div",[a("apexchart",{staticClass:"colum-chart",attrs:{type:"bar",height:"600",options:e.chartOptionsColumn,series:e.seriesColumn}})],1),a("v-layout",{staticStyle:{width:"400px",margin:"20px auto"},attrs:{wrap:""}},[a("v-flex",{staticClass:"mr-3",staticStyle:{"max-width":"120px"}},[a("v-icon",{staticStyle:{color:"#8bc34a !important"}},[e._v("square")]),e._v("   \n          "),a("span",[e._v("Rất hài lòng")])],1),a("v-flex",{staticClass:"mr-3",staticStyle:{"max-width":"120px"}},[a("v-icon",{staticStyle:{color:"#2196f3 !important"}},[e._v("square")]),e._v("   \n          "),a("span",[e._v("Hài lòng")])],1),a("v-flex",{staticClass:"mr-3",staticStyle:{"max-width":"150px"}},[a("v-icon",{staticStyle:{color:"#CE7A58 !important"}},[e._v("square")]),e._v("   \n          "),a("span",[e._v("Không hài lòng")])],1)],1)],1)],1)],1)},r=[],c=a("bc3a"),l=a.n(c),s=a("854a"),u=a.n(s);function d(e,t){return T(e)||v(e,t)||m(e,t)||p()}function p(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function m(e,t){if(e){if("string"===typeof e)return h(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?h(e,t):void 0}}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function v(e,t){var a=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var n,o,i=[],r=!0,c=!1;try{for(a=a.call(e);!(r=(n=a.next()).done);r=!0)if(i.push(n.value),t&&i.length===t)break}catch(l){c=!0,o=l}finally{try{r||null==a["return"]||a["return"]()}finally{if(c)throw o}}return i}}function T(e){if(Array.isArray(e))return e}n["a"].use(u.a),u.a.options={positionClass:"toast-top-center",timeOut:"5000"};var H={data:function(){return{menuDate1:!1,menuDate2:!1,fromReceiveDate:"",fromReceiveDateFormatted:"",toReceiveDate:"",toReceiveDateFormatted:"",listGroup:[{code:"STNMT,SXD,SCT,SGDDT,SGTVT,SKHDT,SKHCN,SLDTBXH,SNV,SNNPTNT,STC,STTTT,STP,SVHTTDL,SYT,BQLKKT,BQLKCN,VPT,CAT",text:"Cấp Sở ban ngành"},{code:"HCHAUTHANH,HCHAUTHANHA,HPHUNGHIEP,HVITHUY,HTPNGABAY,HTPVITHANH,HLONGMY,HTXLONGMY",text:"Cấp Huyện, Thành phố, Thị xã"},{code:"XHCT_TTNGASAU,XHCT_TTMAIDAM,XHCT_XADONGPHUOC,XHCT_XADONGPHUOCA,XHCT_XAPHUHUU,XHCT_XAPHUTAN,XHCT_XAPHUAN,XHCT_XADONGPHU,XHCT_XADONGTHANH",text:"Cấp xã huyện Châu Thành"},{code:"XHCTA_TTMOTNGAN,XHCTA_TTBAYNGAN,XHCTA_TTCAITAC,XHCTA_TTRACHGOI,XHCTA_XATHANHXUAN,XHCTA_XATANPHUTHANH,XHCTA_XATANHOA,XHCTA_XATRUONGLONGTAY,XHCTA_XATRUONGLONGA,XHCTA_XANHONNGHIAA",text:"Cấp xã huyện Châu Thành A"},{code:"XHPH_TTCAYDUONG,XHPH_TTKINHCUNG,XHPH_TTBUNGTAU,XHPH_XAPHUNGHIEP,XHPH_XATANPHUOCHUNG,XHPH_XATANBINH,XHPH_XAHOAAN,XHPH_XAPHUONGBINH,XHPH_XAPHUONGPHU,XHPH_XAHOAMY,XHPH_XAHIEPHUNG,XHPH_XATHANHHOA,XHPH_XABINHTHANH,XHPH_XATANLONG,XHPH_XALONGTHANH",text:"Cấp xã huyện Phụng Hiệp"},{code:"XHVT_TTNANGMAU,XHVT_XAVIBINH,XHVT_XAVIDONG,XHVT_XAVITHANH,XHVT_XAVITHANG,XHVT_XAVITHUY,XHVT_XAVITRUNG,XHVT_XAVINHTHUANTAY,XHVT_XAVINHTRUNG,XHVT_XAVINHTUONG",text:"Cấp xã huyện Vị Thủy"},{code:"XTPNB_PHUONGNGABAY,XTPNB_PHUONGLAIHIEU,XTPNB_PHUONGHIEPTHANH,XTPNB_PHUONGHIEPLOI,XTPNB_XADAITHANH,XTPNB_XATANTHANH",text:"Cấp xã Thành phố Ngã Bảy"},{code:"XTPVT_PHUONG1,XTPVT_PHUONG3,XTPVT_PHUONG4,XTPVT_PHUONG5,XTPVT_PHUONG7,XTPVT_XAVITAN,XTPVT_XAHOALUU,XTPVT_XATANTIEN,XTPVT_XAHOATIEN",text:"Cấp xã thành phố Vị Thanh"},{code:"XHLM_XATHUANHOA,XHLM_XATHUANHUNG,XHLM_XAVINHTHUANDONG,XHLM_XAVINHVIEN,XHLM_XAVINHVIENA,XHLM_XAXAPHIEN,XHLM_XALUONGTAM,XHLM_XALUONGNGHIA",text:"Cấp xã huyện Long Mỹ"},{code:"XTXLM_PHUONGTHUANAN,XTXLM_PHUONGBINHTHANH,XTXLM_PHUONGVINHTUONG,XTXLM_PHUONGTRALONG,XTXLM_XALONGBINH,XTXLM_XALONGTRI,XTXLM_XALONGTRIA,XTXLM_XATANPHU,XTXLM_XALONGPHU",text:"Cấp xã thị xã Long Mỹ"}],groupSelected:"",widthChart:"100%",chartOptionsColumn:{chart:{type:"bar",width:"100%",toolbar:{show:!1}},plotOptions:{bar:{horizontal:!1,columnWidth:"60%",endingShape:"rounded"}},dataLabels:{enabled:!0},legend:{show:!1},stroke:{show:!0,width:2,colors:["transparent"]},xaxis:{categories:[],labels:{show:!0,rotate:-45,rotateAlways:!1,hideOverlappingLabels:!0,showDuplicates:!1,trim:!1,minHeight:void 0,maxHeight:170}},fill:{opacity:1},tooltip:{custom:function(e){e.series;var t=e.seriesIndex,a=e.dataPointIndex,n=e.w,o=n.globals.initialSeries[t].data[a];return'<div class="wrap-tooltip-chart"><div class="header-tooltip-chart">'+o.x+'</div><div class="content-tooltip-chart">'+o.title+': <span class="count-text">'+o.y+"% ("+o.count+" lượt)</span></div></div>"}},colors:["#8bc34a","#2196f3","#CE7A58"]},seriesColumn:[{name:"Rất hài lòng",data:[]},{name:"Hài lòng",data:[]},{name:"Không hài lòng",data:[]}],dataVoting:[],yearList:[{name:"Năm 2022",value:2022}],yearSelected:(new Date).getFullYear(),monthSelected:(new Date).getMonth()+1,monthList:[{name:"Cả năm",value:"all"},{name:"Tháng 1",value:1},{name:"Tháng 2",value:2},{name:"Tháng 3",value:3},{name:"Tháng 4",value:4},{name:"Tháng 5",value:5},{name:"Tháng 6",value:6},{name:"Tháng 7",value:7},{name:"Tháng 8",value:8},{name:"Tháng 9",value:9},{name:"Tháng 10",value:10},{name:"Tháng 11",value:11},{name:"Tháng 12",value:12}]}},beforeDestroy:function(){"undefined"!==typeof window&&window.removeEventListener("resize",this.onResize,{passive:!0})},mounted:function(){this.$nextTick((function(){}))},computed:{},watch:{monthSelected:function(e){var t=this;setTimeout((function(){t.monthSelected&&(t.fromReceiveDateFormatted="",t.toReceiveDateFormatted="")}),100)},yearSelected:function(e){var t=this;setTimeout((function(){t.yearSelected&&(t.fromReceiveDateFormatted="",t.toReceiveDateFormatted="")}),100)},fromReceiveDateFormatted:function(e,t){if(t){var a=this;a.fromDate=a.parseDate(a.fromReceiveDateFormatted)}},toReceiveDateFormatted:function(e,t){if(t){var a=this;a.toDate=a.parseDate(a.toReceiveDateFormatted)}}},created:function(){var e=this;e.groupSelected=e.listGroup[0]["code"],e.yearSelected=(new Date).getFullYear(),e.monthSelected=(new Date).getMonth()+1,e.getStatisticVoting()},methods:{getStatisticVoting:function(){var e=this;setTimeout((function(){e.resetChart();var t="",a="";if(console.log("fromReceiveDate",e.fromReceiveDate,e.toReceiveDate),e.monthSelected)if("all"!==e.monthSelected){var n=e.getDaysInMonth(e.monthSelected,e.yearSelected);t=new Date("".concat(e.yearSelected,"-").concat(String(e.monthSelected).padStart(2,"0"),"-01T00:00")).getTime(),a=new Date("".concat(e.yearSelected,"-").concat(String(e.monthSelected).padStart(2,"0"),"-").concat(String(n).padStart(2,"0"),"T23:59")).getTime()}else t=new Date("".concat(e.yearSelected,"-01-01T00:00")).getTime(),a=new Date("".concat(e.yearSelected,"-12-31T23:59")).getTime();else t=new Date("".concat(e.fromReceiveDate,"T00:00")).getTime(),a=e.toReceiveDate?new Date("".concat(e.toReceiveDate,"T23:59")).getTime():(new Date).getTime();var o={method:"get",url:"/o/rest/v2/votings/reportVE",headers:{Accept:"application/json"},params:{type:1,fromDate:t,toDate:a,listGov:e.groupSelected}};l()(o).then((function(t){if(e.dataVoting=t.data,e.dataVoting.length){e.dataVoting=e.dataVoting.sort((function(e,t){return e.unHappyCount>t.unHappyCount?-1:e.unHappyCount<t.unHappyCount?1:e.govAgencyName<t.govAgencyName?-1:e.govAgencyName>t.govAgencyName?1:0}));for(var a=[],n=[],o=[],i=[],r=0;r<e.dataVoting.length;r++){var c={x:e.dataVoting[r]["govAgencyName"],y:e.dataVoting[r]["percentVeryHappy"],count:e.dataVoting[r]["veryHappyCount"],title:"Rất hài lòng"},l={x:e.dataVoting[r]["govAgencyName"],y:e.dataVoting[r]["percentHappy"],count:e.dataVoting[r]["happyCount"],title:"Hài lòng"},s={x:e.dataVoting[r]["govAgencyName"],y:e.dataVoting[r]["percentUnHappy"],count:e.dataVoting[r]["unHappyCount"],title:"Không hài lòng"};n.push(c),o.push(l),i.push(s)}e.seriesColumn=[{name:"Rất hài lòng",data:n},{name:"Hài lòng",data:o},{name:"Không hài lòng",data:i}],e.chartOptionsColumn={chart:{type:"bar",toolbar:{show:!1},width:e.dataVoting.length>4?150*e.dataVoting.length:"600"},plotOptions:{bar:{horizontal:!1,columnWidth:"60%",endingShape:"rounded"}},dataLabels:{enabled:!0},legend:{show:!1},stroke:{show:!0,width:2,colors:["transparent"]},xaxis:{categories:a,labels:{show:!0,rotate:-45,rotateAlways:!1,hideOverlappingLabels:!0,showDuplicates:!1,trim:!1,minHeight:void 0,maxHeight:170}},yaxis:{max:100},fill:{opacity:1},tooltip:{custom:function(e){e.series;var t=e.seriesIndex,a=e.dataPointIndex,n=e.w,o=n.globals.initialSeries[t].data[a];return'<div class="wrap-tooltip-chart"><div class="header-tooltip-chart">'+o.x+'</div><div class="content-tooltip-chart">'+o.title+': <span class="count-text">'+o.y+"% ("+o.count+" lượt)</span></div></div>"}},colors:["#8bc34a","#2196f3","#CE7A58"]}}})).catch((function(e){}))}),100)},getDaysInMonth:function(e,t){return 2===e?3&t||!(t%25)&&15&t?28:29:30+(e+(e>>3)&1)},sortList:function(e){function t(e,t){return type,e[key]>t[key]?-1:e[key]<t[key]?1:0}return e.sort(t)},resetChart:function(){var e=this;e.seriesColumn=[{name:"Rất hài lòng",data:[]},{name:"Hài lòng",data:[]},{name:"Không hài lòng",data:[]}],e.chartOptionsColumn={chart:{type:"bar",toolbar:{show:!1}},plotOptions:{bar:{horizontal:!1,columnWidth:"60%",endingShape:"rounded"}},dataLabels:{enabled:!0},legend:{show:!1},stroke:{show:!0,width:2,colors:["transparent"]},xaxis:{categories:[],labels:{show:!0,rotate:-45,rotateAlways:!1,hideOverlappingLabels:!0,showDuplicates:!1,trim:!1,minHeight:void 0,maxHeight:170}},yaxis:{max:100},fill:{opacity:1},tooltip:{y:{formatter:function(e){return e}}},colors:["#8bc34a","#2196f3","#CE7A58"]},e.dataVoting=[]},parsedate:function(e){var t=e.split("-"),a=d(t,3),n=a[0],o=a[1],i=a[2];return"".concat(i,"-").concat(o,"-").concat(n)},currentDate:function(){var e=new Date;return"".concat(e.getFullYear(),"-").concat((e.getMonth()+1).toString().padStart(2,"0"),"-").concat(e.getDate().toString().padStart(2,"0"))},changeDate:function(e){var t=this;t.monthSelected="",t.yearSelected="",t.menuDate=t.menuDate2=!1,"1"===e?t.fromReceiveDateFormatted=t.formatDate(t.fromReceiveDate):"2"===e&&(t.toReceiveDateFormatted=t.formatDate(t.toReceiveDate)),(t.fromReceiveDateFormatted||t.toReceiveDateFormatted)&&t.getStatisticVoting()},getMinMax:function(e){if(!e)return null;var t=e.split("/"),a=d(t,3),n=a[0],o=a[1],i=a[2];return"".concat(i,"-").concat(o,"-").concat(n)},getMinFromDate30:function(e){var t=this,a=new Date(t.parseDate(e)).getTime()-2592e6;return t.parseDate(a)},getMaxToDate30:function(e){var t=this,a=new Date(t.parseDate(e)).getTime()+2592e6;return a>(new Date).getTime()?t.parseDate((new Date).getTime()):t.parseDate(a)},parseDate:function(e){if(!e)return"";if(String(e).indexOf("/")>0){var t=e.split("/"),a=d(t,3),n=a[0],o=a[1],i=a[2];return"".concat(i,"-").concat(o.padStart(2,"0"),"-").concat(n.padStart(2,"0"))}if(String(e).indexOf("-")>0){var r=e.split("-"),c=d(r,3),l=c[0],s=c[1],u=c[2];return"".concat(u,"-").concat(s.padStart(2,"0"),"-").concat(l.padStart(2,"0"))}var p=new Date(Number(e));return"".concat(p.getFullYear(),"-").concat((p.getMonth()+1).toString().padStart(2,"0"),"-").concat(p.getDate().toString().padStart(2,"0"))},formatDate:function(e){if(!e)return"";var t=e.split("-"),a=d(t,3),n=a[0],o=a[1],i=a[2];return"".concat(i,"/").concat(o,"/").concat(n)},currentDateFormat:function(e){var t=e?new Date(e):new Date;return"".concat(t.getDate().toString().padStart(2,"0"),"/").concat((t.getMonth()+1).toString().padStart(2,"0"),"/").concat(t.getFullYear())}}},g=H,f=(a("034f"),a("2877")),A=a("6544"),y=a.n(A),X=a("7496"),N=a("99d9"),D=a("549c"),w=a("2e4b"),S=a("0e8f"),x=a("132d"),_=a("a722"),C=a("e449"),b=a("f774"),P=a("b56d"),O=a("2677"),V=Object(f["a"])(g,i,r,!1,null,null,null),G=V.exports;y()(V,{VApp:X["a"],VCardText:N["a"],VContent:D["a"],VDatePicker:w["a"],VFlex:S["a"],VIcon:x["a"],VLayout:_["a"],VMenu:C["a"],VNavigationDrawer:b["a"],VSelect:P["a"],VTextField:O["a"]});var U=a("1321"),I=a.n(U);a("d304");n["a"].use(I.a),n["a"].component("apexchart",I.a);var R=void 0!==window.themeDisplay?window.themeDisplay.getScopeGroupId():0;l.a.defaults.withCredentials=!0,l.a.defaults.headers.common["Token"]=void 0!==window.Liferay?window.Liferay.authToken:"",l.a.defaults.headers.common["groupId"]=R,n["a"].config.productionTip=!0,n["a"].mixin({methods:{getScopeGroupId:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.themeDisplay.getScopeGroupId():0},getAuthToken:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.Liferay.authToken:""},getUserId:function(){return null!==window.themeDisplay&&void 0!==window.themeDisplay?window.themeDisplay.getUserId():0}}}),new n["a"]({render:function(e){return e(G)}}).$mount("#app_chart_vue")},"64a9":function(e,t,a){},"74ef":function(e,t,a){}});