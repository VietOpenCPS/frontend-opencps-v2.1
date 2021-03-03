<template>
    <div class="form_vuejs">
        <v-layout wrap>
            <v-flex xs12 sm6 class="px-2 my-2">
                <div style="display:flex; flex-wrap: wrap; align-items: center;">
                    <strong>Tham chiếu thông tin từ mã tờ khai trực tuyến</strong>
                    <div style="width: 100px;" class="mx-2">
                        <v-text-field
                            v-model="eFormCode"
                            solo
                            @keyup.enter="getDataEform()"
                        ></v-text-field>
                    </div>
                    <v-btn small color="primary" @click="getDataEform()" class="ml-2">Lấy dữ liệu</v-btn>
                </div>
            </v-flex>
            <v-flex xs12 class="px-2">
                <label for="">Họ, chữ đệm, tên người yêu cầu </label>
                <v-text-field
                    v-model="dossiers.delegateName"
                    solo
                    @input="dossiers.delegateName = dossiers.delegateName.toUpperCase()"
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Điện thoại</label>
                <v-text-field
                    v-model="dossiers.delegateTelNo"
                 
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Email</label>
                <v-text-field
                    v-model="dossiers.delegateEmail"
               
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label for="">Nơi cư trú</label>
                <v-text-field
                    v-model="dossiers.delegateAddress"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12  sm6 class="px-2 ">
                <label>Giấy tờ tùy thân</label>
                <v-text-field
                    v-model="dossiers.delegateIdNo"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Quan hệ với người được cấp bản sao Trích lục hộ tịch</label>
                <v-text-field
                    v-model="quan_he"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <label>Đề nghị Cục Lãnh sự cấp bản sao trích lục</label>
                <!-- <v-text-field  
                    v-model="loai_viec_ho_tich"
                    solo
                    @change="changeDossier()"
                ></v-text-field> -->
            </v-flex>
            <v-flex xs12  class="px-2 my-2">
                <v-data-table
                    :headers="headerListTrichLuc"
                    :items="list_trich_luc"
                    hide-actions
                    no-data-text="Không có thành phần hồ sơ nào"
                    class="table_vuejs"
                    style="border-left: 0.5px solid #dedede;"
                >
                    <template slot="items" slot-scope="props">
                    <tr>
                            <td>{{ props.item.ten_giay_to }}</td>
                            <td>
                                <v-text-field
                                    solo
                                    v-model="props.item.so_luong"
                                    @change="changeListTrichLuc(props.item,props.index)"
                                ></v-text-field>
                            </td>
                    </tr>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex xs12 class="px-2 my-2">
                <strong>Tổng số bản: {{tongSoBan}}</strong>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <strong>Cho người có tên dưới đây</strong>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Họ, chữ đệm, tên</label>
                <v-text-field
                    v-model="dossiers.applicantName"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Giới tính</label>
                <v-autocomplete
                    :items="listGioiTinh"
                    v-model="gioi_tinh"
                    item-text="name"
                    item-value="value"
                    clearable
                    hide-no-data
                    solo
                    @change="changeDossier()"              
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Dân tộc</label>
                <v-text-field
                    v-model="dan_toc"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Quốc tịch</label>
                <v-text-field
                    v-model="quoc_tich"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Nơi cư trú</label>
                <v-text-field
                    v-model="dossiers.address"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Giấy tờ tùy thân</label>
                <v-text-field
                    v-model="dossiers.applicantIdNo"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Số định danh các nhân nếu có</label>
                <v-text-field
                    v-model="so_dinh_danh"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Đã đăng ký tại</label>
                <v-text-field
                    v-model="noi_dang_ky"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <label>Ngày cấp</label><br>
                <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    transition="scale-transition"
                    offset-y
                >
                    <v-text-field
                        slot="activator"
                        v-model="ngay_cap"
                        persistent-hint
                        append-icon="event"
                        hint="DD/MM/YYYY"
                        @change="changeNgayCap()"
                        @input="inputNgayCap()"
                        solo
                        required
                    ></v-text-field>
                    <v-date-picker v-model="dateNgayCap" no-title @input="menu = false" locale="vi"></v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 sm4 class="px-2 ">
                <label>Theo</label>
                <v-text-field
                    v-model="loai_giay_to_da_cap"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 class="px-2 ">
                <label>Số</label>
                <v-text-field
                    v-model="so_giay_to"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 class="px-2 ">
                <label>Quyển sổ</label>
                <v-text-field
                    v-model="quyen_so"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 my-2">
                <div style="display:flex; flex-wrap: wrap;">
                    <strong>Thành phần hồ sơ kèm theo</strong>
                </div>
            </v-flex>
            <v-flex xs12  class="px-2 my-2">
                <v-data-table
                    :headers="headerThanhPhanHoSo"
                    :items="dossierMarkArr"
                    hide-actions
                    no-data-text="Không có thành phần hồ sơ nào"
                    class="table_vuejs"
                    style="border-left: 0.5px solid #dedede;"
                >
                    <template slot="items" slot-scope="props">
                    <tr v-if="(props.item.dossierPartNo != 'TP01-BNG-270814') && props.item.partType === 1">
                            <td>          
                                <v-checkbox
                                    v-model="selected"
                                    primary
                                    hide-details
                                    :value="props.item"
                                    @change="toggleCheckbox(props.item, props.index)">
                                ></v-checkbox>
                            </td>
                            <td>{{ props.item.partName }}</td>
                            <td>                            
                                <v-select
                                    v-model="props.item.fileMark"
                                    :items="fileMarks"
                                    item-text="name"
                                    item-value="value"
                                    solo
                                    @change="changeThanhPhan(props.item,props.index)"
                                >
                                </v-select>
                            </td>
                            <td>
                                <v-text-field
                                    solo
                                    v-model="props.item.recordCount"
                                    @change="changeThanhPhan(props.item,props.index)"
                                ></v-text-field>
                            </td>
                    </tr>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex xs12 sm4 class="px-2 ">
                <label>Dự thu lệ phí</label>
                <v-text-field
                    v-model="le_phi_format"
                    solo
                    @change="changLePhi()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4  class="px-2 my-2">
                <label for="">Ngày hẹn trả </label><br/>
                <v-menu
                    ref="menu5"
                    :close-on-content-click="false"
                    v-model="menu5"
                    transition="scale-transition"
                    offset-y
                >
                    <v-text-field
                        slot="activator"
                        v-model="dateDueDateFormated"
                        persistent-hint
                        append-icon="event"
                        hint="DD/MM/YYYY"
                        
                        @change="dateDueDate = parseDate(dateDueDateFormated)"
                       
                        
                    ></v-text-field>
            
                    <v-date-picker v-model="dateDueDate" no-title @input="menu5 = false" locale="vi"></v-date-picker>
                </v-menu>      
            </v-flex>
            <v-flex xs12 sm4  class="px-2 ">
                <v-checkbox
                    v-model="viaPostal"
                    label="Nhận kết quả qua bưu chính"   
                >
                </v-checkbox>       
            </v-flex>
            <v-flex xs12  class="px-2 ">
                <label for="">Ghi chú</label>
                <v-textarea
                    v-model="dossiers.dossierNote"
                    name="input-7-1" 
                    solo   
                ></v-textarea>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import toastr from 'toastr'
import axios from 'axios'
import $ from 'jquery'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
import Suggestions from 'v-suggestions'
export default {
    props: ['id', 'formCode'],
    components:{
        'suggestions': Suggestions,
    },
    data: () => ({
        menu: false,
        menu5: false,
        eFormCode: '',
        tongSoBan: 0,
        eFormCodeArr: [],
        listGioiTinh: [{name: 'Nam', value: 'Nam'},{name: 'Nữ', value: 'Nữ'}],
        fileMarks: [{value: 1, name: 'Bản chụp'},{value: 2, name: 'Bản sao'},{value: 3, name: 'Bản gốc'},{value: 4, name: 'Bản dịch'}],
        list_trich_luc: [
            {
                ten_giay_to: "Bản sao trích lục giấy khai sinh",
                so_luong: 0
            },
            {
                ten_giay_to: "Bản sao trích lục giấy khai tử",
                so_luong: 0
            },
            {
                ten_giay_to: "Bản sao trích lục giấy đăng ký kết hôn",
                so_luong: 0
            },
        ],
        loai_viec_ho_tich: '',
        quan_he: '',
        gioi_tinh: '',
        dan_toc: '',
        quoc_tich: '',
        so_dinh_danh: '',
        noi_dang_ky: '',
        ngay_cap: '',
        loai_giay_to_da_cap: '',
        so_giay_to: '',
        quyen_so: '',
        viaPostal: false,
        dateNgayCap: new Date().toISOString().substr(0, 10),
        headerListTrichLuc: [{text: 'Tên giấy tờ',align: 'center',sortable: false,},{text: 'Số lượng',align: 'center',sortable: false,}],
        headerThanhPhanHoSo: [{text: 'Chọn',align: 'center',sortable: false,},{text: 'Tên thành phần',align: 'center',sortable: false},{text: 'Loại',align: 'center',sortable: false},{text: 'Số lượng',align: 'center',sortable: false}],
        dossierMarkArr: [],
        dossierFileArr: [],
        dossierParts: [],
        selected: [],
        dossierFileCustom: [],
        crurentHours: '',
        dateDueDateFormated: '',
        dateDueDate: '',
        dossierTemplateNo: '',
        le_phi_format: 0,
        payment: {},
        dossiers: {
            address: "",
            applicantIdNo: "",
            applicantIdType: "citizen",
            applicantName: "",
            applicantNote: "",
            cityCode: "",
            contactEmail: "",
            contactTelNo: "",
            delegateAddress: "",
            delegateCityCode: "",
            delegateDistrictCode: "",
            delegateEmail: "",
            delegateIdNo: "",
            delegateName: "",
            delegateTelNo: "",
            delegateWardCode: "",
            districtCode: "",
            dossierName: "",
            dossierNote: "",
            dueDate: 0,
            metaData: "",
            postalAddress: "",
            postalCityCode: "",
            postalServiceCode: "VNPOST",
            postalTelNo: "",
            sampleCount: 0,
            viaPostal:0,
            wardCode: "",
        },
        rules: {
            required: (v) => !!v || 'Thông tin này là bắt buộc',
            checkDatePast: (date)=> {
                if(date){
                     let today = new Date()
                    const [day, month, year] = date.split('/')
                    let newDate = new Date()
                    newDate.setFullYear(year, month - 1 , day) 
                    return today >= newDate || 'Ngày không được lớn hơn ngày hiện tại'
                } else {
                    return true
                }     
            },
            checkDateFuture: (date)=> {
                if(date){
                     let today = new Date()
                    const [day, month, year] = date.split('/')
                    let newDate = new Date()
                    newDate.setFullYear(year, month - 1 , day) 
                    return today <= newDate || 'Ngày không được nhỏ hơn ngày hiện tại'
                } else {
                    return true
                }     
            },
            checkYear: (year) => {
                let today = new Date()
                let newDate = new Date()
                newDate.setFullYear(year)
                 return today >= newDate || 'Năm không được lớn hơn năm hiện tại'
            },
            credit: (value) => {
                if(value){
                    if (value.length === 9) {
                    const pattern = /^(([0-9]{9,9}))$/
                    return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
                    } else {
                    const pattern = /^(([0-9]{12,12}))$/
                    return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
                    }
                }

            },
            soHoChieu: (value) => {
              var regex = /^([A-Z])\d{7}$/;
              if (!regex.test(value)) {
                return 'Gồm 1 chữ cái và 7 số'
              } else {
                  return true
              }
            },
            telNo: (value) => {
                const pattern = /^0([1-9]{1}\d{8})$/
                if (value) {
                return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
                } else {
                return []
                }
            },
            varChar50: (val) => {
                if(val){
                val = String(val).trim()
                return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
                } else {
                return true
                }    
            }
        }
        
    }),
    created () {
        let vm = this
        vm.$nextTick(()=>{
            let currentQuery = vm.$router.history.current.query
            vm.dossierTemplateNo = currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
            // vm.dossierTemplateNo = $('#dossierTemplateNo_hidden').val()
            vm.eFormCode = currentQuery.hasOwnProperty('eformCode') && currentQuery.eformCode ? currentQuery.eformCode : ''
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount": 0,"serviceAmount":0,"shipAmount":0}
            setTimeout(()=>{
                if(vm.formCode==='UPDATE'){
                    vm.getDetail()
                } else {                   
                    vm.dossiers['metaData'] = JSON.stringify({"newFormTemplate": "true", "dossierFileCustom": [], 'ma_to_khai': [], 'totalRecord': 0, 'delegateIdNo': '','delegateName': '','delegateTelNo': '','Doan_HCTN': '', 'durationCountMeta': 4, "loai_viec_ho_tich": '',"quan_he": '',"gioi_tinh": '', "dan_toc": '',"quoc_tich": '',"so_dinh_danh": '',"noi_dang_ky": '',"ngay_cap": '',"loai_giay_to_da_cap": '',"so_giay_to": '',"quyen_so": '',"list_trich_luc": vm.list_trich_luc})
                    vm.getThanhPhan()
                    vm.genDueDate()
                    if(vm.eFormCode){
                        setTimeout(() => {
                            vm.getDataEform()
                        }, 500);
                    }
                }
            }, 500)
        })
    },
    watch: {
        dateNgayCap (val) {
            this.ngay_cap = this.formatDate(this.dateNgayCap)
        },
        dateDueDate (val) {
            this.dateDueDateFormated = this.formatDate(this.dateDueDate)
            const [year, month, day] = this.dateDueDate.split('-')
            let date = new Date(this.dateDueDate + this.crurentHours)
            // date.setFullYear(parseInt(year), parseInt(month), parseInt(day))
            this.dossiers.dueDate = date.getTime()
        },
        viaPostal(val) {
            if(val){
                this.dossiers.viaPostal = 2
            } else {
                this.dossiers.viaPostal = 1
            }
        },
        dossierFileArr: {
            deep: true,
            handler:  (val, oldVal) => {
                $('#dossierFileArr_hidden').val(JSON.stringify(val))
            }
        },
        dossierMarkArr: {
            deep: true,
            handler:  (val, oldVal) => {
                // let arr = val.filter(e => e.recordCount) 
                // arr.push({"dossierPartNo":"TP01","fileMark":3,"partName":"Tờ khai  đề nghị cấp hộ chiếu ngoại giao, hộ chiếu công vụ và công hàm","partType":1,"fileCheck":0,"fileComment":"","recordCount":1})
                // arr.push({"dossierPartNo":"TP02","fileMark":3,"partName":"Văn bản hoặc quyết định cử hoặc cho phép cán bộ, công chức, viên chức, sỹ quan, quân nhân chuyên nghiệp ra nước ngoài","partType":1,"fileCheck":0,"fileComment":"","recordCount":1})
                $('#dossierMarkArr_hidden').val(JSON.stringify(val))
            }
        },
        payment: {
            deep: true,
            handler:  (val, oldVal) => {
                $('#payment_hidden').val(JSON.stringify(val))
            }
        },
        dossiers: {
            deep: true,
            handler:  (val, oldVal) => {
                $('#dossiers_hidden').val(JSON.stringify(val))
            }
        },
    },
    methods: {
        getDetail(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/'+vm.id,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                try{
                    console.log('res.data.metaData',res.data.metaData)
                    let metaData =  JSON.parse(res.data.metaData)
                    console.log('metaData',metaData)
                    if(metaData.dossierFileCustom)
                    {   
                        vm.dossierFileCustom = metaData.dossierFileCustom
                    }
                    vm.dossiers = res.data
                    vm.dateDueDate = vm.parseDate(vm.dossiers.dueDate.substr(0, 10))
                    vm.crurentHours = vm.dossiers.dueDate.substring(10)
                    vm.dossiers.delegateName = res.data.delegateName
                    vm.dossiers.delegateIdNo = res.data.delegateIdNo
                    vm.dossiers.delegateTelNo = res.data.delegateTelNo
                    vm.dossiers.delegateEmail = res.data.delegateEmail
                    vm.dossiers.delegateAddress = res.data.delegateAddress
                    vm.dossiers.applicantName = res.data.applicantName
                    vm.dossiers.applicantIdNo = res.data.applicantIdNo
                    vm.dossiers.contactTelNo = res.data.contactTelNo
                    vm.dossiers.address = res.data.address
                    vm.loai_viec_ho_tich = metaData['loai_viec_ho_tich']
                    vm.quan_he = metaData['quan_he']
                    vm.gioi_tinh = metaData['gioi_tinh']
                    vm.dan_toc = metaData['dan_toc']
                    vm.quoc_tich = metaData['quoc_tich']
                    vm.so_dinh_danh = metaData['so_dinh_danh']
                    vm.noi_dang_ky = metaData['noi_dang_ky']
                    vm.ngay_cap = metaData['ngay_cap']
                    vm.loai_giay_to_da_cap = metaData['loai_giay_to_da_cap']
                    vm.so_giay_to = metaData['so_giay_to']
                    vm.quyen_so = metaData['quyen_so']
                    vm.list_trich_luc = metaData['list_trich_luc']
                }catch(err) {

                }
                vm.changeDossier()
                vm.getThanhPhan()
                vm.getDossierFile()
            }).catch(err => {})       
        },
        getDossierFile(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/'+vm.id+'/files',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                let data = res.data.data
                if(data.length){
                    for(let i =0; i<data.length; i++){
                        let tg = {
                            partNo: data[i]['dossierPartNo'],
                            formData: data[i]['formData'],
                            referenceUid: data[i]['referenceUid'],
                            eform: 'true'
                        }
                        
                        vm.dossierFileArr.push(tg)
                    }
                }
            }).catch(err => {})       
        },
        getThanhPhan(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiertemplates/'+ vm.dossierTemplateNo,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.dossierParts = res.data.dossierParts
                if(vm.formCode === 'UPDATE') {
                    for (let i=0; i<vm.dossierParts.length; i++){
                        let check = vm.dossierFileCustom.find(e=> e.partNo === vm.dossierParts[i]['partNo'])
                        if(check){
                            let temp = {
                                dossierPartNo: vm.dossierParts[i]['partNo'],
                                fileMark: check.fileMark,
                                partName: vm.dossierParts[i]['partName'],
                                partType: vm.dossierParts[i]['partType'],
                                fileCheck: 0,
                                fileComment: '',
                                recordCount: check.recordCount
                            }
                            vm.selected.push(temp)
                            vm.dossierMarkArr.push(temp)
                        }
                        else {
                            vm.dossierMarkArr.push({
                                dossierPartNo: vm.dossierParts[i]['partNo'],
                                fileMark: vm.dossierParts[i]['fileMark'],
                                partName: vm.dossierParts[i]['partName'],
                                partType: vm.dossierParts[i]['partType'],
                                fileCheck: 0,
                                fileComment: '',
                                recordCount: ''
                            })
                        }
                    }
                } else {
                    let file_bien_nhan = new Array();
                    let j = 0
                    vm.dossierFileArr = []
                    for (let i=0; i<vm.dossierParts.length; i++){
                        vm.dossierMarkArr.push({
                            dossierPartNo: vm.dossierParts[i]['partNo'],
                            fileMark: vm.dossierParts[i]['fileMark'],
                            partName: vm.dossierParts[i]['partName'],
                            partType: vm.dossierParts[i]['partType'],
                            fileCheck: 0,
                            fileComment: '',
                            recordCount: ''
                        })
                        if((vm.dossierParts[i]['partNo'] === 'TP01-BNG-270814') && vm.dossierParts[i].partType === 1){
                            vm.dossierFileArr[j] = {formData: '', partNo: vm.dossierParts[i]['partNo'], eform: false}
                            file_bien_nhan[j] = {'partNo': vm.dossierParts[i]['partNo'], 'partName': vm.dossierParts[i]['partName'], 'fileMark': vm.dossierParts[i]['fileMark'], 'recordCount': 1}
                            j++;
                        }
                        
                    }
                    let totalRecord = 0
                    for(let i =0; i<file_bien_nhan.length ; i++){
                        totalRecord+=parseInt(file_bien_nhan[i]['recordCount'])
                    }
                    let tg2 = JSON.parse(vm.dossiers['metaData']);
                    tg2['dossierFileCustom'] = file_bien_nhan;
                    tg2['totalRecord'] = totalRecord
                    vm.dossiers['metaData'] = JSON.stringify(tg2);
                }
            }).catch(err => {})  
        },
        getDataEform () {
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/SERVER_EFORM_DATA_DVC/protocols/API_CONNECT?eFormNo=' + vm.eFormCode,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            vm.eFormCodeArr = []
            axios.request(config).then(res => {
                if(Object.keys(res.data).length !== 0 && res.data.constructor === Object){
                    let metaData = JSON.parse(vm.dossiers['metaData'])
                    vm.dossiers['metaData'] = JSON.stringify(metaData)
                    vm.eFormCode = ''
                    if(res.data.hasOwnProperty('viaPostal')){
                        vm.viaPostal = res.data.viaPostal ? true : false
                    }
                    if(!vm.dossiers.delegateName){
                        if(res.data.ho_ten_yeu_cau) {
                            vm.dossiers.delegateName = res.data.ho_ten_yeu_cau
                        }
                    }
                    if(!vm.dossiers.delegateIdNo){
                        if(res.data.giay_to_tuy_than_yeu_cau) {
                            vm.dossiers.delegateIdNo = res.data.giay_to_tuy_than_yeu_cau
                        }
                    }
                    if(!vm.dossiers.delegateTelNo){
                        if(res.data.delegateTelNo) {
                            vm.dossiers.delegateTelNo = res.data.delegateTelNo
                        }
                    }
                    if(!vm.dossiers.delegateEmail){
                        if(res.data.delegateEmail) {
                            vm.dossiers.delegateEmail = res.data.delegateEmail
                        }
                    }
                    if(!vm.dossiers.delegateAddress){
                        if(res.data.noi_cu_tru_yeu_cau ){
                            vm.dossiers.delegateAddress = res.data.noi_cu_tru_yeu_cau.length < 100 ? res.data.noi_cu_tru_yeu_cau : ''
                        } 
                    }
                    if(!vm.dossiers.applicantName){
                        if(res.data.ho_ten) {
                            vm.dossiers.applicantName = res.data.ho_ten
                        }
                    }
                    if(!vm.dossiers.applicantIdNo){
                        if(res.data.giay_to_tuy_than) {
                            vm.dossiers.applicantIdNo = res.data.giay_to_tuy_than
                        }
                    }
                    if(!vm.dossiers.contactTelNo){
                        if(res.data.contactTelNo) {
                            vm.dossiers.contactTelNo = res.data.contactTelNo
                        }
                    }
                    if(!vm.dossiers.address){
                        if(res.data.noi_cu_tru ){
                            vm.dossiers.address = res.data.noi_cu_tru.length < 100 ? res.data.noi_cu_tru : ''
                        } 
                    }
                    if(!vm.loai_viec_ho_tich){
                        if(res.data.loai_viec_ho_tich) {
                            vm.loai_viec_ho_tich = res.data.loai_viec_ho_tich
                        }
                    }
                    if(!vm.quan_he){
                        if(res.data.quan_he) {
                            vm.quan_he = res.data.quan_he
                        }
                    }
                    if(!vm.gioi_tinh){
                        if(res.data.gioi_tinh) {
                            vm.gioi_tinh = res.data.gioi_tinh
                        }
                    }
                    if(!vm.dan_toc){
                        if(res.data.dan_toc) {
                            vm.dan_toc = res.data.dan_toc
                        }
                    }
                    if(!vm.quoc_tich){
                        if(res.data.quoc_tich) {
                            vm.quoc_tich = res.data.quoc_tich
                        }
                    }
                    if(!vm.so_dinh_danh){
                        if(res.data.so_dinh_danh) {
                            vm.so_dinh_danh = res.data.so_dinh_danh
                        }
                    }
                    if(!vm.noi_dang_ky){
                        if(res.data.noi_dang_ky) {
                            vm.noi_dang_ky = res.data.noi_dang_ky
                        }
                    }
                    if(!vm.ngay_cap){
                        if(res.data.ngay_cap) {
                            vm.ngay_cap = res.data.ngay_cap
                        }
                    }
                    if(!vm.loai_giay_to_da_cap){
                        if(res.data.loai_giay_to_da_cap) {
                            vm.loai_giay_to_da_cap = res.data.loai_giay_to_da_cap
                        }
                    }
                    if(!vm.so_giay_to){
                        if(res.data.so_giay_to) {
                            vm.so_giay_to = res.data.so_giay_to
                        }
                    }
                    if(!vm.quyen_so){
                        if(res.data.quyen_so) {
                            vm.quyen_so = res.data.quyen_so
                        }
                    }
                    if(res.data.list_trich_luc) {
                        vm.list_trich_luc =  res.data.list_trich_luc
                    }
                    vm.changeDossier()            
                }
                else {
                    toastr.error('Mã tờ khai không hợp lệ')  
                }
            }).catch(err => {
                 toastr.error('Mã tờ khai không tìm thấy') 
            }) 
        },
        genDueDate () {
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/'+ 1 +'/calculate/duedate',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.dossiers['durationCount'] = 1
                let dateString =  res.data.substr(0, 10)
                vm.crurentHours = res.data.substr(10)
                vm.dateDueDate = vm.parseDate(dateString)
                let metaData = JSON.parse(vm.dossiers['metaData'])
                metaData['durationCountMeta'] = 1
                vm.dossiers['metaData'] = JSON.stringify(metaData)
            }).catch(err => {})  
        },
        changLePhi(){
            let vm = this
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount": parseInt(vm.le_phi_format),"serviceAmount":0,"shipAmount":0}
        },
        changeThanhPhan(item,index){
            setTimeout(()=>{
                let vm = this
                let tg = JSON.parse(vm.dossiers['metaData'])
                let file_bien_nhan = tg['dossierFileCustom']
   
                for(let i=0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item['fileMark'],'recordCount': item.recordCount}
                        vm.$set(vm.dossierFileArr, i, tp)
                    }
                }
                for(let i=0; i< file_bien_nhan.length; i++){
                    if(file_bien_nhan[i]['partNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        file_bien_nhan[i] = tp
                    }
                }
                let totalRecord = 0
                for(let i =0; i<file_bien_nhan.length ; i++){
                    totalRecord+=parseInt(file_bien_nhan[i]['recordCount'])
                }
                tg['totalRecord'] = totalRecord
                tg['dossierFileCustom'] = file_bien_nhan
                vm.dossiers['metaData'] = JSON.stringify(tg)
            },200)
        },
        toggleCheckbox (item, index){
            let vm = this
            if(this.selected.includes(item)){
                let check = true
                let tg = JSON.parse(vm.dossiers['metaData'])
                let file_bien_nhan = tg['dossierFileCustom']
                vm.dossierMarkArr[index]['recordCount'] = 1
                item['recordCount'] = 1
                for(let i=0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        vm.$set(vm.dossierFileArr, i, tp)
                        check = false
                    }
                }
                if(check){
                    let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount} 
                    vm.dossierFileArr.push(tp) 
                }
                let check2 = true
                for(let i=0; i< file_bien_nhan.length; i++){
                    if(file_bien_nhan[i]['partNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        file_bien_nhan[i] = tp
                        check2 = false
                    }
                }
                if(check2){
                    let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                    file_bien_nhan.push(tp) 
                }
                let totalRecord = 0
                for(let i =0; i<file_bien_nhan.length ; i++){
                    totalRecord+=parseInt(file_bien_nhan[i]['recordCount'])
                }
                tg['totalRecord'] = totalRecord
                tg['dossierFileCustom'] = file_bien_nhan
                vm.dossiers['metaData'] = JSON.stringify(tg)


            } else {
                let tg = JSON.parse(vm.dossiers['metaData'])
                let file_bien_nhan = tg['dossierFileCustom']
                vm.dossierMarkArr[index]['recordCount'] = 0
                for(let i=0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === item.dossierPartNo || vm.dossierFileArr[i]['dossierPartNo'] === item.dossierPartNo){
                        vm.dossierFileArr.splice(i,1)
                    }
                }
                for(let i=0; i< file_bien_nhan.length; i++){
                    if(file_bien_nhan[i]['partNo'] === item.dossierPartNo || file_bien_nhan[i]['dossierPartNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        file_bien_nhan[i] = tp
                        file_bien_nhan.splice(i,1)
                    }
                }
                let totalRecord = 0
                for(let i =0; i<file_bien_nhan.length ; i++){
                    totalRecord+=parseInt(file_bien_nhan[i]['recordCount'])
                }
                tg['totalRecord'] = totalRecord
                tg['dossierFileCustom'] = file_bien_nhan
                vm.dossiers['metaData'] = JSON.stringify(tg)
            }
        },
        changeDossier(){
            let vm = this
            vm.dossiers['contactTelNo'] = vm.dossiers['delegateTelNo']
            vm.dossiers['contactEmail'] = vm.dossiers['delegateEmail']
            let metaData = JSON.parse(vm.dossiers.metaData)
            metaData['loai_viec_ho_tich'] = vm.loai_viec_ho_tich
            metaData['quan_he'] = vm.quan_he
            metaData['dan_toc'] = vm.dan_toc
            metaData['quoc_tich'] = vm.quoc_tich
            metaData['noi_dang_ky'] = vm.noi_dang_ky
            metaData['gioi_tinh'] = vm.gioi_tinh
            metaData['ngay_cap'] = vm.ngay_cap
            metaData['so_dinh_danh'] = vm.so_dinh_danh
            metaData['loai_giay_to_da_cap'] = vm.loai_giay_to_da_cap
            metaData['so_giay_to'] = vm.so_giay_to
            metaData['quyen_so'] = vm.quyen_so
            metaData['list_trich_luc'] = vm.list_trich_luc
            vm.dossiers['metaData'] = JSON.stringify(metaData)
            $('#dossiers_hidden').val(JSON.stringify(vm.dossiers))
            vm.genLePhi()
        },
        formatDate (date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        parseDate (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        changeNgayCap(){
            let vm = this
            vm.changeDate('ngay_cap')
            vm.dateNgayCap = vm.parseDate(vm.ngay_cap)
        },
        inputNgayCap(){
            let vm = this
            vm.inputDate('ngay_cap')
        },
        changeDate(key){
            let vm = this 
            let dateString = vm[key];
            let regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
            let regex2 = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/
            if (!regex.test(dateString) && !regex2.test(dateString)) {
                vm[key] = ''
            }
            else{
                let date = vm[key].split("/");
                let day = date[0];
                let month = date[1];
                if (day > 31) {
                    vm[key] = ''
                }
                else
                    if (month > 12) {
                    vm[key] = ''
                    }else
                    if(date[2].length == 2){
                        if(key==="birthdayFormated"){
                            if(date[2] <= 20){
                                vm[key] = day+'/'+month+'/20'+date[2]
                            } else {
                                vm[key] = day+'/'+month+'/19'+date[2]
                            }
                            
                        }else{
                            vm[key] = day+'/'+month+'/20'+date[2]
                        }
                    }
            }
        },
        validateDate(str){
            return str.replace(/[^\d\/]/g, "");
        },
        inputDate (key) {
            let vm = this
            let gt = vm.validateDate(vm[key]);
            if (gt.match(/^\d{2}$/) !== null) {
                vm[key] = gt + '/'
            } else if (gt.match(/^\d{2}\/\d{2}$/) !== null) {
                vm[key] = gt + '/'
            }else
                vm[key] = gt
        },
        changeListTrichLuc (item, index) {
            let vm = this
            let tg = {
                ten_giay_to: item.ten_giay_to,
                so_luong: item.so_luong
            }
            vm.$set(vm.list_trich_luc, index, tg) 
            vm.changeDossier()
        },
        genLePhi () {
            let vm = this
            let tong = 0
            console.log(vm.list_trich_luc)
            for(let i=0;i<vm.list_trich_luc.length;i++){
                console.log(parseInt(vm.list_trich_luc[i]['so_luong']))
                tong += parseInt(vm.list_trich_luc[i]['so_luong']) ? parseInt(vm.list_trich_luc[i]['so_luong']) : 0
                console.log(tong)
            }
            vm.tongSoBan = tong
            let lePhi = tong*8000
            vm.le_phi_format = lePhi.toString()
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount":vm.le_phi_format,"serviceAmount":0,"shipAmount":0}
        }    
    }
}
</script>