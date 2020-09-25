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
                    :rules="[rules.varchar50]"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Email</label>
                <v-text-field
                    v-model="dossiers.delegateEmail"
                    :rules="[rules.varChar50]"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <label for="">Nơi cư chú</label>
                <v-text-field
                    v-model="dossiers.delegateAddress"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12  class="px-2 ">
                <label>Giấy tờ tùy thân</label>
                <v-text-field
                    v-model="dossiers.delegateIdNo"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <label>Quan hệ với người được cấp bản sao Trích lục hộ tịch</label>
                <v-text-field
                    v-model="quan_he"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <label>Đề nghị Cục Lãnh sự cấp bản sao trích lục</label>
                <v-text-field
                    v-model="loai_viec_ho_tich"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <strong>Cho người có tên dưới đây</strong>
            </v-flex>
            <v-flex xs12 sm8 class="px-2 ">
                <label>Họ, chữ đệm, tên</label>
                <v-text-field
                    v-model="dossiers.applicantName"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 class="px-2 ">
                <label>Giới tính</label>
                <v-autocomplete
                    :items="listGioiTinh"
                    v-model="gioi_tinh"
                    item-text="name"
                    item-value="value"
                    clearable
                    hide-no-data
                    solo                  
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 ">
                <div style="display:flex; flex-wrap: wrap; align-items: center;">
                    <strong>Danh sách các giấy tờ cần đăng ký CNLS/HPHLS <span class="red--text">*</span></strong>
                     <v-btn small color="primary" class="ml-2" @click="openThemGiayTo()">Thêm giấy tờ</v-btn>
                </div>
            </v-flex>
            <v-flex xs12  class="px-2 my-2">
                <v-data-table
                    :headers="headerGiayTo"
                    :items="listGiayTo"
                    hide-actions
                    class="table_vuejs"
                    no-data-text="Không có giấy tờ nào"
                    style="border-left: 0.5px solid #dedede;"
                >
                    <template slot="headerCell" slot-scope="props">
                        <p><strong style="color: black!important;;">{{ props.header.text }}</strong></p>
                        <p style="font-weight: 400!important;">{{ props.header.textEng }}</p>
                    </template>
                    <template slot="items" slot-scope="props">
                    <tr>
                        <td>
                            <v-checkbox
                                v-model="props.item.kiem_tra"
                                primary
                                @change="toggleKT(props.index, props.item)"
                            >
                            </v-checkbox> 
                        </td>
                        <td>{{props.item.ten_giay_to}}</td>
                        <td>{{props.item.loai_giay_to}}</td>
                        <td>{{props.item.ten_nguoi_duoc_cap}}</td>
                        <td>{{props.item.so_ban}}</td>
                        <td>{{props.item.so_hieu_giay_to}}</td>
                        <td>{{props.item.co_quan_cap}}</td>
                        <td>{{props.item.nguoi_ky}}</td>
                        <td>{{props.item.chuc_danh_ky}}</td>
                        <td>{{props.item.ngay_ky}}</td>
                        <td>
                            <v-btn flat icon color="primary" @click="openDialogUpdateGiayTo(props.index,props.item)">
                                <v-icon>create</v-icon>
                            </v-btn>
                        </td>
                        <td>
                            <v-btn flat icon color="primary" @click="openDialogCopyGiayTo(props.index,props.item)">
                                <v-icon>file_copy</v-icon>
                            </v-btn>
                        </td>
                        <td>
                            <v-btn flat icon color="#F44336" @click="deleteGiayTo(props.index)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex xs12 class="px-2 my-2">
                <strong>Số lượng giấy tờ: <span>{{tongSoBan}}</span></strong>
            </v-flex>
            <v-flex xs12 class="px-2 my-2">
                <strong>Thành phần hồ sơ kèm theo</strong>
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
                        <tr v-if="(props.item.dossierPartNo != 'TP01' && props.item.dossierPartNo != 'TP03') && props.item.partType === 1">
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
            <v-flex xs12 class="px-2">
                <v-checkbox
                    v-model="de_nghi_chung_nhan"
                    label="Đề nghị chứng nhận giấy tờ đã được xuất trình tại Bộ Ngoại giao"
                    @change="changeDeNghiChungNhan()"
                >
                </v-checkbox>  
            </v-flex>
            <v-flex xssss12 sm6 class="px-2">
                <label for="">Giấy tờ trên sẽ sử dụng tại nước <span class="red--text">*</span></label>
                <v-autocomplete
                    :items="listQuocGia"
                    v-model="su_dung_tai_nuoc_ma"
                    item-text="TEN"
                    item-value="MA"
                    clearable
                    multiple
                    hide-no-data
                    :rules="[rules.required, rules.requiredArr,]"
                    required
                    solo
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
                <label for="">Mục đích sử dụng</label>
                <v-autocomplete
                    :items="listMucDichSuDung"
                    v-model="muc_dich"
                    item-text="TEN"
                    item-value="ID"
                    clearable
                    return-object
                    hide-no-data

                    solo
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm4  class="px-2 my-2">
                <label for="">Dự thu lệ phí</label>
                <v-text-field
                    v-model="le_phi_format"
                    solo
                ></v-text-field>        
            </v-flex>
            <v-flex xs12 sm4  class="px-2 my-2">
                <label for="">Ngày hẹn trả</label><br/>
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
                        @change="dateDueDate = parseDate(dateDueDateFormated.substring(0,10))"
                        :rules="[rules.required]"
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
        eFormCode: '',
        eFormCodeArr: [],
        loai_viec_ho_tich: '',
        quan_he: '',
        listGioiTinh: [],
        gioi_tinh: '',
        dossiers: {
            address: "",
            applicantIdNo: "",
            applicantIdType: "",
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
            postalServiceCode: "",
            postalTelNo: "",
            sampleCount: 0,
            viaPostal:0,
            wardCode: "",

        }
    }),
    created () {

    },
    methods: {
        getDataEform () {
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/SERVER_EFORM_DATA_DVC/protocols/API_CONNECT?eFormNo=' + vm.eFormCode,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            vm.eFormCodeArr = []
            axios.request(config).then(res => {
                if(Object.keys(res.data).length !== 0 && res.data.constructor === Object){
                    
                }
                else {
                    toastr.error('Mã tờ khai không hợp lệ')  
                }
            }).catch(err => {
                 toastr.error('Mã tờ khai không tìm thấy') 
            }) 
        },
        changeDossier(){

        }
    }
}
</script>