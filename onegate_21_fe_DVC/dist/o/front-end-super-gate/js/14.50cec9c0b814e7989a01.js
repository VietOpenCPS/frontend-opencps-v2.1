webpackJsonp([14],{273:function(t,e,s){var a=s(195)(s(315),s(319),null,null);t.exports=a.exports},315:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{detailDossier:{type:Object,default:function(){}}},watch:{detailDossier:function(t){this.thongTinChiTietHoSo=t}},components:{},data:function(){return{thongTinChiTietHoSo:{},showContactDetail:!1}},computed:{loading:function(){return this.$store.getters.loading}},created:function(){},methods:{initData:function(t){var e=this;e.$store.dispatch("getDetailDossier",t).then(function(t){e.thongTinChiTietHoSo=t})},goBack:function(){window.history.back()}},filters:{dateTimeView:function(t){if(t){var e=new Date(t);return e.getDate().toString().padStart(2,"0")+"/"+(e.getMonth()+1).toString().padStart(2,"0")+"/"+e.getFullYear()+" | "+e.getHours().toString().padStart(2,"0")+":"+e.getMinutes().toString().padStart(2,"0")}return""}}}},319:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-expansion-panel",{staticClass:"expansion-pl ext__form"},[s("v-expansion-panel-content",{attrs:{"hide-actions":"",value:"1"}},[s("div",{attrs:{slot:"header"},slot:"header"},[s("div",{staticClass:"background-triangle-small"},[s("v-icon",{attrs:{size:"18",color:"white"}},[t._v("star_rate")])],1),t._v("THÔNG TIN CHUNG HỒ SƠ")]),t._v(" "),s("v-card",[s("v-card-text",{staticClass:"py-2 px-2"},[s("v-layout",{attrs:{wrap:""}},[s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Tên doanh nghiệp: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.applicantName))])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Thời gian gửi: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.submitDate)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Mã hồ sơ: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v("  "+t._s(t.thongTinChiTietHoSo.dossierIdCTN)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Thời gian tiếp nhận: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t._f("dateTimeView")(t.thongTinChiTietHoSo.receiveDate)))])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Số hồ sơ: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.dossierNo)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Thời hạn xử lý: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[s("i",[t._v(t._s(t.thongTinChiTietHoSo.durationDate)+" làm việc")])])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 hover-pointer",attrs:{title:t.showContactDetail?"Thu gọn":"Chi tiết liên hệ"},on:{click:function(e){e.preventDefault(),e.stopPropagation(),t.showContactDetail=!t.showContactDetail}}},[t._v("\n              Thông tin liên hệ:\n            ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field hover-pointer"},[s("span",{attrs:{title:t.showContactDetail?"Thu gọn":"Chi tiết liên hệ"},on:{click:function(e){e.preventDefault(),e.stopPropagation(),t.showContactDetail=!t.showContactDetail}}},[t.showContactDetail?t._e():s("v-icon",{attrs:{color:"primary"}},[t._v("keyboard_arrow_down")]),t._v(" "),t.showContactDetail?s("v-icon",{attrs:{color:"primary"}},[t._v("keyboard_arrow_up")]):t._e()],1)])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0"},[t._v("Trạng thái: ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[t.loading?s("content-placeholders",{staticClass:"mt-1"},[s("content-placeholders-text",{attrs:{lines:1}})],1):s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.dossierStatusText)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm12:""}},[s("v-slide-y-transition",[t.showContactDetail?s("div",[s("v-layout",{attrs:{wrap:""}},[s("v-flex",{attrs:{xs12:"",sm2:""}},[s("v-subheader",{staticClass:"pl-0"},[s("i",[t._v("Tên doanh nghiệp: ")])])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.applicantName)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[s("v-subheader",{staticClass:"pl-0"},[s("i",[t._v("Địa chỉ Email: ")])])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.contactEmail)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[s("v-subheader",{staticClass:"pl-0"},[s("i",[t._v("Số điện thoại: ")])])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.contactTelNo)+" ")])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm2:""}},[s("v-subheader",{staticClass:"pl-0"},[s("i",[t._v("Địa chỉ: ")])])],1),t._v(" "),s("v-flex",{attrs:{xs12:"",sm4:""}},[s("v-subheader",{staticClass:"pl-0 header-text-field"},[t._v(" "+t._s(t.thongTinChiTietHoSo.address)+" ")])],1)],1)],1):t._e()])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=14.50cec9c0b814e7989a01.js.map