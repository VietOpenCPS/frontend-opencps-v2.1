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
                        ></v-text-field>
                    </div>
                    <v-btn small color="primary" @click="getDataEform()" class="ml-2">Lấy dữ liệu</v-btn>
                </div>
            </v-flex>
            <v-flex xs12 class="px-2 my-2">
                <strong>Thông tin người nộp</strong>
            </v-flex>
            <v-flex xs12 sm6 class="px-2">
                <label for="">Họ và tên <span class="red--text">*</span></label>
                <v-text-field
                    v-model="dossiers.delegateName"
                    :rules="[rules.required]"
                    required
                    solo
                    @input="dossiers.delegateName = dossiers.delegateName.toUpperCase()"
                    @change="dossiers.applicantName = dossiers.delegateName.toUpperCase()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>CMND/CCCD số <span class="red--text">*</span></label>
                <suggestions
                    v-model="dossiers.delegateIdNo"
                    :options="searchOptions"
                    :onItemSelected="onSearchItemSelected"
                    :onInputChange="onInputChange"
                    
                >
                    <div slot="item" slot-scope="props" class="single-item">
                        <v-list-tile-content>
                        <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </div>
                </suggestions>
                <div v-if="checkCMT"><span class="red--text">{{messengeCMT}}</span></div>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Điện thoại</label>
                <v-text-field
                    v-model="dossiers.delegateTelNo"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Email</label>
                <v-text-field
                    v-model="dossiers.delegateEmail"
                    solo
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label for="">Địa chỉ</label>
                <v-text-field
                    v-model="dossiers.delegateAddress"
                    placeholder="Không quá 100 ký tự"
                    solo
                    @change="changeAdress()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label>Tỉnh/thành</label>
                <v-autocomplete
                    :items="delegateCitys"
                    v-model="delegateCityCode"
                    item-text="itemName"
                    item-value="itemCode"
                    clearable
                    solo
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label>Quận/huyện</label>
                <v-autocomplete
                    :items="delegateDistricts"
                    v-model="delegateDistrictCode"
                    item-text="itemName"
                    item-value="itemCode"
                    clearable
                    solo
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label>Xã/phường</label>
                <v-autocomplete
                    :items="delegateWards"
                    v-model="delegateWardCode"
                    item-text="itemName"
                    item-value="itemCode"
                    clearable
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
                    :rules="[rules.required]"
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
                    
                    :rules="[rules.required]"
                    required
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
                <!-- <v-text-field
                    v-model="dossiers.dueDate"
                    :rules="[rules.required]"
                    required
                    solo
                ></v-text-field> -->
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
        <!-- Dialog Giấy tờ -->
        <v-dialog
            v-model="dialogGiayTo"
            max-width="1000px"
            class="form_vuejs"
            persistent
        >
            <v-card v-if="!dialogTimKiemConDau">
                <v-card-title
                    class="headline lighten-2"
                    primary-title
                    style="display: flex;justify-content: space-between;"
                >
                    Thông tin giấy tờ
                    <v-btn color="#115ebe" fab small dark  @click="close()">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="form_vuejs">
                    <v-layout wrap>
                        <v-flex xs12 sm8>
                            <v-form ref="formGiayTo" lazy-validation>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">Tên giấy tờ <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="listTenGiayTo"
                                            v-model="giay_to"
                                            item-text="TEN"
                                            item-value="MA"
                                            clearable
                                            solo
                                            return-object
                                            required
                                            :rules="[rules.required]"
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">Loại giấy tờ <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="litstLoaiGiayTo"
                                            v-model="loai_giay_to"
                                            item-text="text"
                                            item-value="value"
                                            clearable
                                            solo
                                            return-object
                                            required
                                            :rules="[rules.required]"
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Loại CV <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="listLoaiCV"
                                            v-model="loai_cong_viec"
                                            item-text="text"
                                            item-value="value"
                                            clearable
                                            solo
                                            return-object
                                            required
                                            :rules="[rules.required]"
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Số hiệu của giấy tờ <span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="so_hieu_giay_to"
                                            required
                                            :rules="[rules.required, rules.soHieuGiayTo]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Tổng số bản<span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="so_ban"
                                            required
                                            :rules="[rules.required]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Tên người được cấp giấy tờ <span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="ten_nguoi_duoc_cap"
                                            required
                                            :rules="[rules.required]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Cơ quan cấp / sao chứng thực <span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="co_quan_cap"
                                            required
                                            :rules="[rules.required]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Người ký <span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="nguoi_ky"
                                            required
                                            :rules="[rules.required]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Chức danh <span class="red--text">*</span></label>
                                        <v-text-field
                                            solo
                                            v-model="chuc_danh_ky"
                                            required
                                            :rules="[rules.required]"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm4 class="px-2 my-2">
                                        <label for="">Ngày ký <span class="red--text">*</span></label>
                                        <v-menu
                                            ref="menu"
                                            :close-on-content-click="false"
                                            v-model="menu"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <v-text-field
                                                slot="activator"
                                                v-model="ngay_ky"
                                                persistent-hint
                                                append-icon="event"
                                                placeholder="DD/MM/YYYY"
                                                @change="dateNgayKy = parseDate(ngay_ky)"
                                                solo
                                                :rules="[rules.required,rules.checkDate]"
                                                required
                                            ></v-text-field>
                                            <v-date-picker v-model="dateNgayKy" no-title @input="menu = false" locale="vi"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs12 class="text-xs-right">
                                        <v-btn small color="primary" @click="openKiemTraChuKyConDau()">Kiểm tra chữ ký con dấu</v-btn>
                                        <v-btn small color="primary" @click="backGiayto()" v-if="update_giayto !== 'add' && update_giayto > 0">Chuyển giấy tờ trước</v-btn>
                                        <v-btn small color="primary" @click="nextGiayto()" v-if="update_giayto !== 'add'">Chuyển giấy tờ tiếp theo</v-btn>
                                    </v-flex>                     
                                </v-layout>
                            </v-form>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-layout wrap class="pa-2" style="border: 0.5px solid #dedede">
                                <v-flex xs12> Mẫu con dấu</v-flex>
                                <v-flex xs12>
                                    <div style="width: 100%; height: 140px; border: 0.5px solid #dedede;">
                                        <img :src="'data:image/png;base64,' +  conDau" alt="" style="width: 100%; height: 100%;">
                                    </div>
                                </v-flex>
                                <v-flex xs12 class="my-2"> Mẫu chữ ký</v-flex>
                                <v-flex xs12>
                                    <div style="width: 100%; height: 140px; border: 0.5px solid #dedede;">
                                        <img :src="'data:image/png;base64,' +  chuKy" alt="" style="width: 100%; height: 100%;">
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 class="text-xs-right">
                            <v-btn small color="primary" @click="updateGiayTo()">Cập nhập</v-btn>
                            <v-btn small color="primary" @click="dialogGiayTo=false">Đóng</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-card-title
                    class="headline lighten-2"
                    primary-title
                    style="display: flex;justify-content: space-between;"
                >
                    Thông tin giấy tờ
                    <v-btn color="#115ebe" fab small dark  @click="close()">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="form_vuejs">
                    <v-layout wrap>
                        <v-flex xs12 sm8>
                            <v-layout wrap>
                                <v-flex xs12 class="px-2 my-2">
                                    <label for="">Tên cơ quan</label>
                                    <v-text-field
                                        solo
                                        v-model="co_quan_cap_tg"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 class="px-2 my-2">
                                    <label for="">Người ký</label>
                                    <div style="display:flex; flex-wrap: wrap; align-items: center;">
                                        <v-text-field
                                            solo
                                            v-model="nguoi_ky_tg"
                                        >
                                        </v-text-field>
                                        <v-btn small color="primary" @click="getDSNguoiKy()">Tìm kiếm</v-btn>
                                    </div>
                                </v-flex>
                                <v-flex xs12 class="px-2 my-2">
                                    <label for="">Danh sách người ký</label>
                                </v-flex>
                                <v-flex xs12  class="px-2 my-2">
                                    <v-data-table
                                        :headers="headerNguoiKy"
                                        :items="listNguoiKy"
                                        
                                        no-data-text="Không có người ký nào"
                                        class="table_vuejs"
                                        style="border-left: 0.5px solid #dedede;"
                                        rows-per-page-text
                                    >
                                        <template slot="items" slot-scope="props">
                                            <tr @click="getChuKyConDau(props.item)" style="cursor: pointer;">
                                                <td>{{ props.item.TEN }}</td>
                                                <td>{{ props.item.TEN_CHUC_VU }}</td>
                                                <td>{{ props.item.TEN_CQQL }}</td>
                                            </tr>
                                        </template>
                                    </v-data-table> 
                                </v-flex>                     
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-layout wrap class="pa-2" style="border: 0.5px solid #dedede">
                                <v-flex xs12> Mẫu con dấu</v-flex>
                                <v-flex xs12>
                                    <div style="width: 100%; height: 190px; border: 0.5px solid #dedede;overflow-x: scroll;">
                                        <div style="width: 1000px;">
                                            <div v-if="loadingImage" style="height: 140px;font-size: 16pt;color: blue;">Loading ....</div>
                                            <div v-if="!loadingImage" style="width: 100%; height: 190px;display:flex;">
                                                <div v-for="(item, index) in listConDau" :key="index">
                                                    <img :src="'data:image/png;base64,' +  hexToBase64(item['CD_IMAGE_FILE'])" alt="" style="width: 200px; height: 140px;">
                                                    <v-checkbox
                                                        v-model="chonConDau"
                                                        primary
                                                        :label="item['CD_NGAY_HL']"
                                                        :value="item['CD_MA_CON_DAU']"
                                                        @change="checkedConDau(item)"
                                                        class="ma-0"
                                                    >
                                                    ></v-checkbox> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-flex>
                                <v-flex xs12 class="my-2"> Mẫu chữ ký</v-flex>
                                <v-flex xs12>
                                    <div style="width: 100%; height: 190px; border: 0.5px solid #dedede;overflow-x: scroll;">
                                        <div style="width: 1000px;">
                                            <div v-if="loadingImage" style="height: 140px;font-size: 16pt;color: blue;">Loading ....</div>
                                            <div v-if="!loadingImage" style="width: 100%; height: 190px;display:flex;">
                                                <div v-for="(item, index) in listChuKy" :key="index">
                                                    <img :src="'data:image/png;base64,' +  hexToBase64(item['CK_IMAGE_FILE'])" alt="" style="width: 200px; height: 140px;">
                                                    <v-checkbox
                                                        v-model="chonChuKy"
                                                        primary
                                                        :value="item['CK_MA_CK']"
                                                        :label="item['CK_NGAY_HL']"
                                                        @change="checkedChuKy(item)"
                                                        class="ma-0"
                                                    >
                                                    ></v-checkbox> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 class="text-xs-right">
                            <v-btn small color="primary" @click="chonConDauChuKy()">Chọn</v-btn>
                            <v-btn small color="primary" @click="closeConDauChuKy()">Quay lại</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
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
        dialogGiayTo: false,
        dialogTimKiemConDau: false,
        isLoadingDelegateIdNo: false,
        menu5: false,
        loadingImage: false,
        checkCMT: false,
        messengeCMT: '',
        searchOptions: {
            inputClass: 'input_vuejs'
        },
        chonConDau: [],
        chonChuKy: [],
        selected: [],
        applicants: [],
        headerGiayTo: [
            {
                text: 'Đã KT',
                align: 'center',
                sortable: false,
                textEng: ''
            },
            {
                text: 'Tên giấy tờ',
                align: 'center',
                sortable: false,
                textEng: 'Name of documents'
            },
            {
                text: 'Loại giấy tờ',
                align: 'center',
                sortable: false,
                textEng: 'Type of documents'
            },
            {
                text: 'Tên người được cấp giấy tờ',
                align: 'center',
                sortable: false,
                textEng: 'Holder of document'
            },
            {
                text: 'Tổng số bản',
                align: 'center',
                sortable: false,
                textEng: 'Total of Documents'
            },
            {
                text: 'Số hiệu của giấy tờ',
                align: 'center',
                sortable: false,
                textEng: 'Number sign of document'
            },
            {
                text: 'Cơ quan cấp/sao chứng thực',
                align: 'center',
                sortable: false,
                textEng: 'Authentication office'
            },
            {
                text: 'Người ký',
                align: 'center',
                sortable: false,
                textEng: 'Name of signer'
            },
            {
                text: 'Chức danh',
                align: 'center',
                sortable: false,
                textEng: 'Title of signer'
            },
            {
                text: 'Ngày ký',
                align: 'center',
                sortable: false,
                textEng: 'Signed date'
            },
            {
                text: 'Sửa',
                align: 'center',
                sortable: false,
                textEng: ''
                
            },
            {
                text: 'Sao chép',
                align: 'center',
                sortable: false,
                textEng: ''
            },
            {
                text: 'Xóa',
                align: 'center',
                sortable: false,
                textEng: ''
            },
        ],
        listGiayTo: [],
        listMucDichSuDung: '',
        headerThanhPhanHoSo: [
            {
                text: 'Chọn',
                align: 'center',
                sorttable: false,
            },
          {
            text: 'Tên thành phần',
            align: 'center',
            sortable: false
          },
          {
            text: 'Loại',
            align: 'center',
            sortable: false
          },
          {
            text: 'Số lượng',
            align: 'center',
            sortable: false
          }
        ],
        headerNguoiKy: [
            {text: 'Tên người ký',align: 'center', sortable: false},
            {text: 'Chức danh',align: 'center', sortable: false},
            {text: 'Đơn vị',align: 'center', sortable: false},
        ],
        fileMarks: [{value: 1, name: 'Bản chụp'},{value: 2, name: 'Bản sao'},{value: 3, name: 'Bản gốc'},{value: 4, name: 'Bản dịch'}],
        rules: {
            required: (v) => !!v || 'Thông tin này là bắt buộc',
            checkDate: (date)=> {
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
            checkYear: (year) => {
                let today = new Date()
                let newDate = new Date()
                newDate.setFullYear(year)
                 return today >= newDate || 'Năm không được lớn hơn năm hiện tại'
            },
            credit: (value) => {
                if (value.length === 9) {
                const pattern = /^(([0-9]{9,9}))$/
                return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
                } else {
                const pattern = /^(([0-9]{12,12}))$/
                return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
                }
            },
            soHieuGiayTo: (value) => {
                return value.length > 50 ?  'Số hiệu giấy tờ không được quá 50 ký tự' : true
            }
        },
        dateDueDateFormated: '',
        dateDueDate: new Date().toISOString().substr(0, 10),
        dateNgayKy: new Date().toISOString().substr(0, 10),
        listQuocGia: [],
        delegateCitys: [],
        delegateCityCode: '',
        delegateDistricts: [],
        delegateDistrictCode: '',
        delegateWards: [],
        delegateWardCode: '',
        dossierParts: [],
        dossierMarkArr: [],
        dossierFileArr: [],
        listTenGiayTo: [],
        listNguoiKy: [],
        litstLoaiGiayTo: [
            {"value": "0501", "text": "Bản chính"},
            {"value": "0504", "text": "Bản dịch"},
            {"value": "0502", "text": "Bản sao"},
            {"value": "0503", "text": "Bản trích lục"}
        ],
        listLoaiCV: [
            {"value": "HPHLS", "text": "HPHLS"},
            {"value": "CNLS", "text": "CNLS"},
            {"value": "CNXT", "text": "CNXT"}
        ],
        chuKy: '',
        conDau: '',
        viaPostal: false,
        conDauSelected: {},
        chuKySelected: {},
        listConDau: [],
        listChuKy: [],
        dossierFileCustom: [],
        muc_dich: '',
        nguoi_ky_tg : '',
        co_quan_cap_tg: '',
        chuc_danh_ky_tg: '',
        ma_co_quan_cap_tg: '',
        ma_nguoi_ky_tg: '',
        ma_chuc_vu_tg: '',
        ma_con_dau_tg: '',
        ma_chu_ky_tg: '',
        su_dung_tai_nuoc_ma: [],
        su_dung_tai_nuoc: [],
        loai_giay_to: '',
        loai_cong_viec: '',
        de_nghi_chung_nhan: null,
        giay_to: null,
        so_hieu_giay_to: '',
        so_ban: '',
        ten_nguoi_duoc_cap: '',
        co_quan_cap: '',
        ma_co_quan_cap: '',
        ma_nguoi_ky: '',
        chuc_danh_ky: '',
        ma_chuc_vu: '',
        ma_con_dau: '',
        ma_chu_ky: '',
        nguoi_ky: '',
        chuc_danh_ky: '',
        ngay_ky: '',
        tongSoBan: '',
        serviceCode: $('#serviceCode_hidden').val(),
        govAgencyCode: $('#govAgencyCode_hidden').val(),
        dossierTemplateNo: '',
        update_giayto: '',
        dossiers: {
            "applicantName": $('#applicantName').val(),
            "applicantIdType": "citizen",
            "applicantIdNo": '',
            "address": "",
            "cityCode": "",
            "districtCode": "",
            "wardCode": "",
            "contactTelNo": '',
            "contactEmail":'',
            "delegateName": '',
            "delegateIdNo": '',
            "delegateTelNo": '',
            "delegateEmail": '',
            "delegateAddress": '',
            "delegateCityCode": '',
            "delegateDistrictCode": '',
            "delegateWardCode": '',
            "applicantNote": "",
            "dossierName": $('#serviceName_hidden').val(),
            "viaPostal": 0,
            "postalServiceCode": "VNPOST",
            "postalAddress": "",
            "postalCityCode": "",
            "postalTelNo": "",
            "sampleCount": 1,
            "dueDate": '',
            "dossierNote": '',
            "Doan_HCTN": '',
            "dossierFilePayment": '',
            "metaData": '{}'
        },
        payment: {}
    }),
    created () {
        let vm = this
        vm.$nextTick(()=>{
            let currentQuery = vm.$router.history.current.query
            vm.dossierTemplateNo = currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
            console.log(vm.dossierTemplateNo)
            if(vm.formCode==='UPDATE'){
                vm.getDetail()
            } else {
                vm.dossiers['metaData'] = JSON.stringify({"newFormTemplate": "true", "dossierFileCustom": []})
                vm.getThanhPhan()
                vm.genDueDate()
            }
            vm.getDelegateCity()
            vm.getQuocGia()
            vm.getMucDich()
            vm.getTenGiayTo()
        })
    },
    watch: {
        payment: {
            deep: true,
            handler:  (val, oldVal) => {
                $('#payment_hidden').val(JSON.stringify(val))
            }
        },
        dossiers: {
            deep: true,
            handler:  (val, oldVal) => {
                console.log(val.metaData)
                $('#dossiers_hidden').val(JSON.stringify(val))
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
                let arr = val.filter(e => e.recordCount) 
                $('#dossierMarkArr_hidden').val(JSON.stringify(arr))
            }
        },
        delegateCityCode (val) {
            this.dossiers.delegateCityCode = val
            this.getDelegateDistrict()
        },
        delegateDistrictCode (val) {
            this.dossiers.delegateDistrictCode = val
            this.getDelegateWard()
        },
        delegateWardCode (val) {
            this.dossiers.delegateWardCode = val 
        },
        dateNgayKy (val) {
            this.ngay_ky = this.formatDate(this.dateNgayKy)
        },
        viaPostal(val) {
            if(val){
                this.dossiers.viaPostal = 2
            } else {
                this.dossiers.viaPostal = 0
            }
        },
        de_nghi_chung_nhan(val){
            let vm = this
            for (let i=0; i<vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                    try{
                        let formData = JSON.parse(vm.dossierFileArr[i]['formData'])
                        formData['de_nghi_chung_nhan'] = val
                        // let formData = {
                        //     ho_ten_yeu_cau: vm.dossiers.delegateName,
                        //     so_cmnd: vm.delegateIdNo,
                        //     dien_thoai: vm.delegateTelNo,
                        //     email: vm.delegateEmail,
                        //     dia_chi: vm.delegateAddress,
                        //     de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                        //     list_giay_to : vm.listGiayTo,
                        //     tong_so: vm.tongSoBan,
                        //     su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                        //     ma_muc_dich: vm.muc_dich.MA,
                        //     muc_dich: vm.muc_dich.TEN
                        // }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    }catch(err){
                      let formData = {
                          de_nghi_chung_nhan: val
                      }
                      vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    }

                    // vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))  
        },
        su_dung_tai_nuoc_ma (val) {
            let vm = this
            for (let i=0; i<vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                    try{
                        let formData = JSON.parse(vm.dossierFileArr[i]['formData'])
                        formData['su_dung_tai_nuoc_ma'] = val
                        // let formData = {
                        //     ho_ten_yeu_cau: vm.dossiers.delegateName,
                        //     so_cmnd: vm.delegateIdNo,
                        //     dien_thoai: vm.delegateTelNo,
                        //     email: vm.delegateEmail,
                        //     dia_chi: vm.delegateAddress,
                        //     de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                        //     list_giay_to : vm.listGiayTo,
                        //     tong_so: vm.tongSoBan,
                        //     su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                        //     ma_muc_dich: vm.muc_dich.MA,
                        //     muc_dich: vm.muc_dich.TEN
                        // }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                        // vm.dossierFileArr[i]['eform'] = 'true'
                    }catch(err){
                        let formData = {
                            su_dung_tai_nuoc_ma: val
                        }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    }
                }
            }
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))             
        },
        muc_dich (val) {
            let vm = this
            for (let i=0; i<vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                    try{
                        let formData = JSON.parse(vm.dossierFileArr[i]['formData'])
                        formData['ma_muc_dich'] = val.MA
                        formData['muc_dich'] = val.TEN
                        // let formData = {
                        //     ho_ten_yeu_cau: vm.dossiers.delegateName,
                        //     so_cmnd: vm.delegateIdNo,
                        //     dien_thoai: vm.delegateTelNo,
                        //     email: vm.delegateEmail,
                        //     dia_chi: vm.delegateAddress,
                        //     de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                        //     list_giay_to : vm.listGiayTo,
                        //     tong_so: vm.tongSoBan,
                        //     su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                        //     ma_muc_dich: vm.muc_dich.MA,
                        //     muc_dich: vm.muc_dich.TEN
                        // }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                        // vm.dossierFileArr[i]['eform'] = 'true'
                    } catch(err){
                        let formData = {
                            ma_muc_dich: val.MA,
                            muc_dich: val.TEN
                        }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    }
                }
            }
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))            
        },
        dateDueDate (val) {
            this.dateDueDateFormated = this.formatDate(this.dateDueDate)
            const [year, month, day] = this.dateDueDate.split('-')
            let date = new Date()
            date.setFullYear(parseInt(year), parseInt(month), parseInt(day))
            console.log(date)
            console.log(date.getTime())
            this.dossiers.dueDate = date.getTime()
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
                console.log(res.data)
                console.log(JSON.parse(res.data.metaData))
                let metaData = JSON.parse(res.data.metaData)
                if(metaData.dossierFileCustom)
                {   
                    vm.dossierFileCustom = metaData.dossierFileCustom
                }
                vm.dossiers = res.data
                vm.delegateCityCode = vm.dossiers.delegateCityCode
                vm.delegateDistrictCode = vm.dossiers.delegateDistrictCode
                vm.delegateWardCode = vm.dossiers.delegateWardCode
                vm.dateDueDate = vm.parseDate(vm.dossiers.dueDate.substr(0, 10))
                vm.viaPostal = vm.dossiers.viaPostal ?  true : false
               
                // vm.nuoc_di = metaData.Doan_HCTN.CacNuocDi_ma.split(',')

                // vm.ho_chieu_ngoai_giao_cu = metaData.Doan_HCTN.SoHCCu_NG ? parseInt(metaData.Doan_HCTN.SoHCCu_NG) : 0
                // vm.ho_chieu_cong_vu_cu = metaData.Doan_HCTN.SoHCCu_CV ? parseInt(metaData.Doan_HCTN.SoHCCu_CV) : 0
                // vm.ho_chieu_pho_thong_cu = metaData.Doan_HCTN.SoHCCu_PT ? parseInt(metaData.Doan_HCTN.SoHCCu_PT) : 0
                // vm.ho_chieu_cong_vu_moi = metaData.Doan_HCTN.SoHCCapMoi ? parseInt(metaData.Doan_HCTN.SoHCCapMoi) : 0
                // vm.cong_ham_so_nuoc = metaData.Doan_HCTN.SoNuocXinCH ? parseInt(metaData.Doan_HCTN.SoNuocXinCH) : 0
                // vm.ho_chieu_ngoai_giao_moi = metaData.Doan_HCTN.SoHCCapMoi_NG ? parseInt(metaData.Doan_HCTN.SoHCCapMoi_NG) : 0
                // vm.cong_ham_schengen = metaData.Doan_HCTN.SoNguoiMienCH ? parseInt(metaData.Doan_HCTN.SoNguoiMienCH) : 0
                // vm.cong_ham_nhap_canh = metaData.Doan_HCTN.SoCHNhapCanh ? parseInt(metaData.Doan_HCTN.SoCHNhapCanh) : 0
                // vm.cong_ham_qua_canh = metaData.Doan_HCTN.SoCHQuaCanh ? parseInt(metaData.Doan_HCTN.SoCHQuaCanh) : 0
                // vm.ho_chieu_gia_han = metaData.Doan_HCTN.SoHCGH ? parseInt(metaData.Doan_HCTN.SoHCGH) : 0
                // vm.ho_chieu_hong = metaData.Doan_HCTN.SoHCHong ? parseInt(metaData.Doan_HCTN.SoHCHong) : 0
                // vm.ho_chieu_mat = metaData.Doan_HCTN.SoHCMat ? parseInt(metaData.Doan_HCTN.SoHCMat) : 0
                // vm.so_nguoi = metaData.Doan_HCTN.SoNguoi ? parseInt(metaData.Doan_HCTN.SoNguoi) : 0
                // vm.genLePhi()
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
                console.log('dossierFile', res.data)
                if(data.length){
                    for(let i =0; i<data.length; i++){
                        let tg = {
                            partNo: data[i]['dossierPartNo'],
                            formData: data[i]['formData'],
                            eform: 'true',
                            referenceUid: data[i]['referenceUid']
                        }
                        vm.dossierFileArr.push(tg)
                        if(data[i]['dossierPartNo'] === 'TP01'){
                            let formData = JSON.parse(data[i]['formData'])
                            console.log(formData)
                            vm.listGiayTo = formData.list_giay_to
                            vm.de_nghi_chung_nhan = formData.de_nghi_chung_nhan
                            vm.su_dung_tai_nuoc_ma = formData.su_dung_tai_nuoc_ma
                            vm.muc_dich = {
                                MA: formData.ma_muc_dich,
                                TEN: formData.muc_dich
                            }
                            vm.tongSoBan = 0
                            vm.listGiayTo.forEach(e=>{
                                vm.tongSoBan+=parseInt(e['so_ban'])
                            })
                            vm.genLePhi()
                        }
                    }
                }
            }).catch(err => {})       
        },
        getDelegateCity(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?level=0&parent=0',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.delegateCitys = vm.sortArr(res.data.data, 'itemName')
            }).catch(err => {})
        },
        getDelegateDistrict(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?level=1&parent=' + vm.delegateCityCode,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.delegateDistricts = vm.sortArr(res.data.data, 'itemName')
            }).catch(err => {})   
        },
        getDelegateWard(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?level=2&parent=' + vm.delegateDistrictCode,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.delegateWards = vm.sortArr(res.data.data, 'itemName')
            }).catch(err => {})   
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
                        console.log(tp)
                        file_bien_nhan[i] = tp
                        console.log(file_bien_nhan[i])
                    }
                }
                let totalRecord = 0
                for(let i =0; i<file_bien_nhan.length ; i++){
                    totalRecord+=parseInt(file_bien_nhan[i]['recordCount'])
                }
                tg['totalRecord'] = totalRecord
                tg['dossierFileCustom'] = file_bien_nhan
                console.log(tg['dossierFileCustom'])
                vm.dossiers['metaData'] = JSON.stringify(tg)
            },200)
        },
        getQuocGia(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/TICH_HOP_DIA_BAN/protocols/API_CONNECT?parentId=98',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listQuocGia = vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})  
        },
        getMucDich(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/TICH_HOP_DM/protocols/API_CONNECT?maCha=03&nameDM=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listMucDichSuDung = vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})  
        },
        // getThanhPhan(){
        //     let vm = this
        //     let config = {
        //         url: '/o/rest/v2/dossiertemplates/'+ vm.dossierTemplateNo,
        //         headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
        //     }
        //     axios.request(config).then(res => {
        //         vm.dossierParts = res.data.dossierParts
        //         let file_bien_nhan = new Array();
        //         let j = 0
        //         vm.dossierFileArr = []
        //         for (let i=0; i<vm.dossierParts.length; i++){
        //             vm.dossierMarkArr.push({
        //                 dossierPartNo: vm.dossierParts[i]['partNo'],
        //                 fileMark: vm.dossierParts[i]['fileMark'],
        //                 partName: vm.dossierParts[i]['partName'],
        //                 partType: vm.dossierParts[i]['partType'],
        //                 fileCheck: 0,
        //                 fileComment: '',
        //                 recordCount: ''
        //             })
        //             if( (vm.dossierParts[i]['partNo'] === 'TP01' || vm.dossierParts[i]['partNo'] === 'TP03') && vm.dossierParts[i].partType === 1){
        //                 vm.dossierFileArr[j] = {formData: '', partNo: vm.dossierParts[i]['partNo']}
        //                 file_bien_nhan[j] = {'partNo': vm.dossierParts[i]['partNo'], 'partName': vm.dossierParts[i]['partName'], 'fileMark': vm.dossierParts[i]['fileMark'], 'recordCount': 1}
        //                 j++;
        //             } 
        //         }
        //         let tg2 = JSON.parse(vm.dossiers['metaData']);
        //         tg2['dossierFileCustom'] = file_bien_nhan;
        //         vm.dossiers['metaData'] = JSON.stringify(tg2);
        //     }).catch(err => {})  
        // },
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
                        if( (vm.dossierParts[i]['partNo'] === 'TP01' || vm.dossierParts[i]['partNo'] === 'TP03') && vm.dossierParts[i].partType === 1){
                            vm.dossierFileArr[j] = {formData: '', partNo: vm.dossierParts[i]['partNo']}
                            file_bien_nhan[j] = {'partNo': vm.dossierParts[i]['partNo'], 'partName': vm.dossierParts[i]['partName'], 'fileMark': vm.dossierParts[i]['fileMark'], 'recordCount': 1}
                            j++;
                        } 
                    }
                    let tg2 = JSON.parse(vm.dossiers['metaData']);
                    tg2['dossierFileCustom'] = file_bien_nhan;
                    vm.dossiers['metaData'] = JSON.stringify(tg2);
                }
            }).catch(err => {})  
        },
        getDSNguoiKy(){
            let vm = this
            let co_quan_cap = vm.co_quan_cap_tg ? vm.co_quan_cap_tg : ''
            let nguoi_ky = vm.nguoi_ky_tg ? vm.nguoi_ky_tg : ''
            if(co_quan_cap || nguoi_ky){
                if(co_quan_cap){
                    if(co_quan_cap.split(' ').length >= 2){
                        let filter = {
                            flagSearch: false,
                            govAgencyName: co_quan_cap,
                            employeeName: nguoi_ky
                        }
                        for (let key in filter) { 
                            if (filter[key] === '' || filter[key] === undefined) {
                                delete filter[key];
                            }
                        }
                        let config = {
                            url: 'o/rest/v2/serverconfigs/TICH_HOP_DM_NG_KY/protocols/API_CONNECT',
                            params: filter,
                            headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
                        }
                        axios.request(config).then(res => {
                            vm.listNguoiKy = res.data.data
                            vm.listConDau = []
                            vm.listChuKy = []
                            vm.chonChuKy = []
                            vm.chonConDau = []
                            vm.chuKySelected = ''
                            vm.conDauSelected = ''
                        }).catch(err => {}) 
                    } else {
                        toastr.error('Cơ quan chủ quản phải ít nhất 2 từ trở lên')
                        return
                    }
                } else {
                        let filter = {
                            flagSearch: false,
                            govAgencyName: co_quan_cap,
                            employeeName: nguoi_ky
                        }
                        for (let key in filter) { 
                            if (filter[key] === '' || filter[key] === undefined) {
                                delete filter[key];
                            }
                        }
                        let config = {
                            url: 'o/rest/v2/serverconfigs/TICH_HOP_DM_NG_KY/protocols/API_CONNECT',
                            params: filter,
                            headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
                        }
                        axios.request(config).then(res => {
                            vm.listNguoiKy = res.data.data
                            vm.listConDau = []
                            vm.listChuKy = []
                            vm.chonChuKy = []
                            vm.chonConDau = []
                            vm.chuKySelected = ''
                            vm.conDauSelected = ''
                        }).catch(err => {}) 
                }
            } else {
                toastr.error('Chưa nhập đối tượng để tìm kiếm')
            }

        },
        getDataEform() {
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/SERVER_EFORM_DATA_DVC/protocols/API_CONNECT?eFormNo=' + vm.eFormCode,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                if(Object.keys(res.data).length !== 0 && res.data.constructor === Object){
                    vm.dossiers.delegateName = res.data.bookingName
                    vm.dossiers.applicantName = res.data.bookingName
                    vm.dossiers.delegateIdNo = res.data.so_cmnd
                    vm.dossiers.delegateTelNo = res.data.dien_thoai
                    vm.dossiers.delegateEmail = res.data.email
                    vm.dossiers.delegateAddress = res.data.dia_chi
                    vm.dossiers.address = res.data.dia_chi
                    vm.su_dung_tai_nuoc_ma = res.data.su_dung_tai_nuoc_ma
                    vm.de_nghi_chung_nhan = res.data.de_nghi_chung_nhan
                    vm.muc_dich = vm.listMucDichSuDung.find(e=>e.TEN === res.data.muc_dich)
                    vm.fillTableGiayTo(res.data.list_giay_to)
                }
            }).catch(err => {}) 
        },
        fillTableGiayTo (data) {
            let vm = this
          
            // let gt = {
            //     ten_giay_to: data.ten_giay_to,
            //     ma_ten_giay_to: data.ma_ten_giay_to,
            //     ma_loai_giay_to:  data.ma_loai_giay_to,
            //     loai_giay_to: data.loai_giay_to,
            //     so_ban: data.so_ban,
            //     loai_cong_viec: data.loai_cong_viec,
            //     so_hieu_giay_to: data.so_hieu_giay_to,
            //     ten_nguoi_duoc_cap: data.ten_nguoi_duoc_cap,
            //     co_quan_cap: data.co_quan_cap,
            //     ma_co_quan_cap: data.ma_co_quan_cap,
            //     nguoi_ky: data.nguoi_ky,
            //     ma_nguoi_ky: data.ma_nguoi_ky,
            //     chuc_danh_ky: data.chuc_danh_ky,
            //     ma_chuc_vu: data.ma_chuc_vu,
            //     ngay_ky: data.ngay_ky,
            //     ma_con_dau: data.ma_con_dau,
            //     ma_chu_ky: data.ma_chu_ky,
            //     kiem_tra: 1,
            // }

            vm.listGiayTo = data
            vm.tongSoBan = 0
            vm.listGiayTo.forEach(e=>{
                vm.tongSoBan+=parseInt(e['so_ban'])
            })
            // 
            for (let i=0; i<vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                    let formData = {
                        ho_ten_yeu_cau: vm.dossiers.delegateName,
                        so_cmnd: vm.delegateIdNo,
                        dien_thoai: vm.delegateTelNo,
                        email: vm.delegateEmail,
                        dia_chi: vm.delegateAddress,
                        de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                        list_giay_to : vm.listGiayTo,
                        tong_so: vm.tongSoBan,
                        su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                        ma_muc_dich: vm.muc_dich.MA,
                        muc_dich: vm.muc_dich.TEN
                    }
                    vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))

            // Gen le phi
            vm.genLePhi()
        },
        genDueDate () {
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/dueDate?service='+vm.serviceCode+'&agency='+vm.govAgencyCode+'&template='+vm.dossierTemplateNo+'&fromReceiveDate=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                let tg = new Date(parseInt(res.data['dueDate']));
                    
                // let ngay = tg.getDate()+'/'+(tg.getMonth()+1)+'/'+tg.getFullYear()
                // vm.dossiers['dueDate'] = ngay
                 vm.dateDueDate = tg.getFullYear()+'-'+(tg.getMonth()+1)+'-'+tg.getDate()
            }).catch(err => {}) 
        },
        getTenGiayTo(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/TICH_HOP_DM/protocols/API_CONNECT?maCha=02&nameDM=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listTenGiayTo =  vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})  
        },
        getChuKyConDau (item) {
            let vm = this
            vm.nguoi_ky_tg =  item.TEN
            vm.co_quan_cap_tg =  item.TEN_CQQL
            vm.chuc_danh_ky_tg = item.TEN_CHUC_VU
            vm.ma_co_quan_cap_tg = item.MA_CQQL
            vm.ma_chuc_vu_tg = item.MA_CHUC_VU
            vm.ma_nguoi_ky_tg = item.MA
            let config = {
                url: 'o/rest/v2/serverconfigs/TICH_HOP_CHU_KY_CON_DAU/protocols/API_CONNECT?ma_ng_ky='+item.MA+'&ma_cqql='+item.MA_CQQL,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            vm.loadingImage = true
            axios.request(config).then(res => {
                vm.listConDau = vm.sortDate(res.data.CON_DAU, 'CD_NGAY_HL')
                vm.listChuKy = vm.sortDate (res.data.CHU_KY, 'CK_NGAY_HL')
                vm.loadingImage = false
            }).catch(err => {})
        },
        checkedConDau (item) {
            let vm = this

            if(vm.chonConDau.includes(item['CD_MA_CON_DAU'])){
                vm.chonConDau = [item['CD_MA_CON_DAU']]

                vm.ma_con_dau_tg = item['CD_MA_CON_DAU']
                vm.conDauSelected = vm.hexToBase64(item['CD_IMAGE_FILE'])
            } else {
                vm.conDauSelected = ''
            }
            
        },
        checkedChuKy (item) {
            let vm = this
            if(vm.chonChuKy.includes(item['CK_MA_CK'])){
                vm.chonChuKy = [item['CK_MA_CK']]
                vm.ma_chu_ky_tg =  item['CK_MA_CK']
                vm.chuKySelected = vm.hexToBase64(item['CK_IMAGE_FILE'])
            } else {
                vm.chuKySelected = ''
            }
        },
        openThemGiayTo(){
            let vm = this
            vm.update_giayto = 'add'
            vm.dialogGiayTo = true
            vm.$refs.formGiayTo.reset()
            vm.conDau = ''
            vm.chuKy = ''
        },
        openKiemTraChuKyConDau(){
            this.dialogTimKiemConDau = true
            this.nguoi_ky_tg = this.nguoi_ky
            this.co_quan_cap_tg = this.co_quan_cap
            this.listNguoiKy =  []
            this.listConDau = []
            this.listChuKy = []
            this.chonChuKy = []
            this.chonConDau = []
            this.chuKySelected = ''
            this.conDauSelected = ''
        },
        updateGiayTo () {
            let vm = this
            if(vm.$refs.formGiayTo.validate()){
                let gt = {
                  ten_giay_to: vm.giay_to.TEN,
                  ma_ten_giay_to: vm.giay_to.MA,
                  ma_loai_giay_to:  vm.loai_giay_to.value,
                  loai_giay_to: vm.loai_giay_to.text,
                  so_ban: vm.so_ban,
                  loai_cong_viec: vm.loai_cong_viec.text,
                  so_hieu_giay_to: vm.so_hieu_giay_to,
                  ten_nguoi_duoc_cap: vm.ten_nguoi_duoc_cap,
                  co_quan_cap: vm.co_quan_cap,
                  ma_co_quan_cap: vm.ma_co_quan_cap,
                  nguoi_ky: vm.nguoi_ky,
                  ma_nguoi_ky: vm.ma_nguoi_ky,
                  chuc_danh_ky: vm.chuc_danh_ky,
                  ma_chuc_vu: vm.ma_chuc_vu,
                  ngay_ky: vm.ngay_ky,
                  ma_con_dau: vm.ma_con_dau,
                  ma_chu_ky: vm.ma_chu_ky,
                  kiem_tra: 1,
                  anh_con_dau: vm.conDau,
                  anh_chu_ky: vm.chuKy,
                    
                }  
                if(vm.update_giayto === 'add') {
                    vm.listGiayTo.push(gt) 
                } else {
                    vm.$set(vm.listGiayTo, vm.update_giayto, gt)
                }
                // Count Sl giay to
                vm.tongSoBan = 0
                vm.listGiayTo.forEach(e=>{
                    vm.tongSoBan+=parseInt(e['so_ban'])
                })
                // 
                for (let i=0; i<vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                        let arr = []
                        vm.listGiayTo.forEach(e=>{
                            let obj = Object.assign({}, e)
                            // delete obj['anh_chu_ky']
                            // delete obj['anh_con_dau']
                            arr.push(obj)
                        }) 
                        let formData = {
                            ho_ten_yeu_cau: vm.dossiers.delegateName,
                            so_cmnd: vm.delegateIdNo,
                            dien_thoai: vm.delegateTelNo,
                            email: vm.delegateEmail,
                            dia_chi: vm.delegateAddress,
                            de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                            list_giay_to : arr,
                            tong_so: vm.tongSoBan,
                            su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                            ma_muc_dich: vm.muc_dich.MA,
                            muc_dich: vm.muc_dich.TEN
                        }
                        vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))

                // Gen le phi
                vm.genLePhi()
                vm.dialogGiayTo =  false

            }
        },
        genLePhi () {
            let vm = this
            let tg2 = JSON.parse(vm.dossiers['metaData']);
            let file_bien_nhan = tg2['dossierFileCustom'];			
            let i=0;
            let file_bien_nhan2 = new Array();
            let file_payment2 = new Array();
            file_bien_nhan.forEach(e=> {
                if(e['partNo'] != 'TP03') {
                    file_bien_nhan2[i] = e
                    i++
                }
            })
            console.log(file_bien_nhan2)
            let tong_so=0;
            let thanh_tien = 0;
            vm.listGiayTo.forEach(e=>{
                tong_so+=parseInt(e['so_ban'])
                file_bien_nhan2[file_bien_nhan2.length] = {'partNo': 'TP03', 'partName': e['ten_giay_to'] + ' ('+e['so_hieu_giay_to']+')', 'fileMark': '-1', 'fileMarkName': e['loai_giay_to'], 'recordCount': e['so_ban']}
                thanh_tien = parseInt(e['so_ban']) * 30000;
                file_payment2[file_payment2.length] = {'partNo': 'TP03', 'partName': e['ten_giay_to'] + ' ('+e['so_hieu_giay_to']+')', 'fileMark': '-1', 'fileMarkName': e['loai_giay_to'], 'recordCount': e['so_ban'], 'trang_thai': 1, 'don_gia': 30000, 'thanh_tien': thanh_tien}

            })
             console.log(file_bien_nhan2)
            tg2['dossierFileCustom'] =file_bien_nhan2;
            tg2['dossierFilePayment'] =file_payment2;
            vm.dossiers['metaData'] = JSON.stringify(tg2);
            let le_phi = 30000*tong_so;
            vm.le_phi_format = le_phi
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount":le_phi,"serviceAmount": 0,"shipAmount":0}
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
        hexToBase64 (str) {
            if(str) {
                let bString = "";
                for( let i = 0; i < str.length; i +=2) {
                        bString += String.fromCharCode( parseInt( str.substr( i, 2), 16));
                }
                return btoa(bString);
            } else {
                return ''
            }

        },
        chonConDauChuKy() {
            let vm = this
            if (vm.nguoi_ky_tg && vm.co_quan_cap_tg && vm.chuc_danh_ky_tg && vm.conDauSelected && vm.chuKySelected) {
                vm.nguoi_ky = vm.nguoi_ky_tg
                vm.ma_nguoi_ky =  vm.ma_nguoi_ky_tg
                vm.co_quan_cap = vm.co_quan_cap_tg
                vm.ma_co_quan_cap = vm.ma_co_quan_cap_tg
                vm.chuc_danh_ky = vm.chuc_danh_ky_tg
                vm.ma_chuc_vu = vm.ma_chuc_vu_tg
                vm.ma_con_dau =  vm.ma_con_dau_tg
                vm.ma_chu_ky = vm.ma_chu_ky_tg

                vm.conDau = vm.conDauSelected
                vm.chuKy = vm.chuKySelected

                vm.dialogTimKiemConDau = false
                vm.conDauSelected = ''
                vm.chuKySelected = ''
            } else {
                 toastr.error('Chưa chọn chữ ký hoặc con dấu')
            }
        },
        openDialogUpdateGiayTo (index, item) {
            let vm = this
            vm.update_giayto = index
            vm.ten_giay_to = item.ten_giay_to,
            vm.ma_ten_giay_to = item.ma_ten_giay_to,
            vm.ma_loai_giay_to =  item.ma_loai_giay_to,
            vm.loai_giay_to = item.loai_giay_to,
            vm.so_ban = item.so_ban,
            vm.loai_cong_viec = item.loai_cong_viec,
            vm.so_hieu_giay_to = item.so_hieu_giay_to,
            vm.ten_nguoi_duoc_cap = item.ten_nguoi_duoc_cap,
            vm.co_quan_cap = item.co_quan_cap,
            vm.ma_co_quan_cap = item.ma_co_quan_cap,
            vm.nguoi_ky = item.nguoi_ky,
            vm.ma_nguoi_ky = item.ma_nguoi_ky,
            vm.chuc_danh_ky = item.chuc_danh_ky,
            vm.ma_chuc_vu = item.ma_chuc_vu,
            vm.ngay_ky = item.ngay_ky,
            vm.ma_con_dau = item.ma_con_dau,
            vm.ma_chu_ky = item.ma_chu_ky,
            vm.kiem_tra =item.kiem_tra,
            vm.conDau = item.anh_con_dau
            vm.chuKy = item.anh_chu_ky
            vm.giay_to = {
                TEN: item.ten_giay_to,
                MA: item.ma_ten_giay_to,
            }
            vm.loai_giay_to = {
                text: item.loai_giay_to,
                value: item.ma_loai_giay_to
            }
            vm.loai_cong_viec = {
                text: item.loai_cong_viec,
                value:  item.loai_cong_viec
            }
            // vm.conDau = ''
            // vm.chuKy = ''
            vm.dialogGiayTo = true
        },
        openDialogCopyGiayTo (index, item) {
            let vm = this
            vm.update_giayto = 'add'
            vm.ten_giay_to = item.ten_giay_to,
            vm.ma_ten_giay_to = item.ma_ten_giay_to,
            vm.ma_loai_giay_to =  item.ma_loai_giay_to,
            vm.loai_giay_to = item.loai_giay_to,
            vm.so_ban = item.so_ban,
            vm.loai_cong_viec = item.loai_cong_viec,
            vm.so_hieu_giay_to = item.so_hieu_giay_to,
            vm.ten_nguoi_duoc_cap = item.ten_nguoi_duoc_cap,
            vm.co_quan_cap = item.co_quan_cap,
            vm.ma_co_quan_cap = item.ma_co_quan_cap,
            vm.nguoi_ky = item.nguoi_ky,
            vm.ma_nguoi_ky = item.ma_nguoi_ky,
            vm.chuc_danh_ky = item.chuc_danh_ky,
            vm.ma_chuc_vu = item.ma_chuc_vu,
            vm.ngay_ky = item.ngay_ky,
            vm.ma_con_dau = item.ma_con_dau,
            vm.ma_chu_ky = item.ma_chu_ky,
            vm.kiem_tra =item.kiem_tra,
            vm.giay_to = {
                TEN: item.ten_giay_to,
                MA: item.ma_ten_giay_to,
            }
            vm.loai_giay_to = {
                text: item.loai_giay_to,
                value: item.ma_loai_giay_to
            }
            vm.loai_cong_viec = {
                text: item.loai_cong_viec,
                value:  item.loai_cong_viec
            }
            vm.dialogGiayTo = true
            vm.conDau = item.anh_con_dau
            vm.chuKy = item.anh_chu_ky
        },
        deleteGiayTo(index) {
            let vm = this
            vm.listGiayTo.splice(index,1)
            // Count Sl giay to
            vm.tongSoBan = 0
            vm.listGiayTo.forEach(e=>{
                vm.tongSoBan+=parseInt(e['so_ban'])
            })
            // 
            for (let i=0; i<vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                    let arr = []
                    vm.listGiayTo.forEach(e=>{
                        let obj = Object.assign({}, e)
                        // delete obj['anh_chu_ky']
                        // delete obj['anh_con_dau']
                        arr.push(obj)
                    }) 
                    let formData = {
                        ho_ten_yeu_cau: vm.dossiers.delegateName,
                        so_cmnd: vm.delegateIdNo,
                        dien_thoai: vm.delegateTelNo,
                        email: vm.delegateEmail,
                        dia_chi: vm.delegateAddress,
                        de_nghi_chung_nhan: vm.de_nghi_chung_nhan,
                        list_giay_to : arr,
                        tong_so: vm.tongSoBan,
                        su_dung_tai_nuoc_ma: vm.su_dung_tai_nuoc_ma,
                        ma_muc_dich: vm.muc_dich.MA,
                        muc_dich: vm.muc_dich.TEN
                    }
                    vm.dossierFileArr[i]['formData'] = JSON.stringify(formData)
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))

            // Gen le phi
            vm.genLePhi()
        },
        toggleCheckbox (item, index){
            let vm = this
            if(this.selected.includes(item)){
                let check = true
                let tg = JSON.parse(vm.dossiers['metaData'])
                let file_bien_nhan = tg['dossierFileCustom']
                vm.dossierMarkArr[index]['recordCount'] = 1
                console.log(file_bien_nhan)
                for(let i=0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === item.dossierPartNo || vm.dossierFileArr[i]['dossierPartNo'] === item.dossierPartNo){
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
                    if(file_bien_nhan[i]['partNo'] === item.dossierPartNo || file_bien_nhan[i]['dossierPartNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        file_bien_nhan[i] = tp
                        check2 = false
                    }
                }
                if(check2){
                     let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                   file_bien_nhan.push(tp) 
                }
                tg['dossierFileCustom'] = file_bien_nhan
                vm.dossiers['metaData'] = JSON.stringify(tg)
            } else {
                            // let check = true
                let tg = JSON.parse(vm.dossiers['metaData'])
                let file_bien_nhan = tg['dossierFileCustom']
                console.log(file_bien_nhan)
                for(let i=0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === item.dossierPartNo || vm.dossierFileArr[i]['dossierPartNo'] === item.dossierPartNo){
                        vm.dossierFileArr.splice(i,1)
                        // check = false
                    }
                }
                // if(check){
                //     let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount} 
                //    vm.dossierFileArr.push(item) 
                // }
                // let check2 = true
                for(let i=0; i< file_bien_nhan.length; i++){
                    if(file_bien_nhan[i]['partNo'] === item.dossierPartNo || file_bien_nhan[i]['dossierPartNo'] === item.dossierPartNo){
                        let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                        file_bien_nhan[i] = tp
                        file_bien_nhan.splice(i,1)
                        // check2 = false
                    }
                }
                // if(check2){
                //      let tp = {'partNo': item.dossierPartNo, 'partName': item.partName, 'fileMark': item.fileMark,'recordCount': item.recordCount}
                //    file_bien_nhan.push(item) 
                // }
                tg['dossierFileCustom'] = file_bien_nhan
                vm.dossiers['metaData'] = JSON.stringify(tg)
            }

        },
        sortArr (arr, key) {
          return arr.sort((a, b) => a[key].localeCompare(b[key]))
        },
        sortDate(arr, key){
            return arr.sort((a, b) => {
                let date1 = new Date (a[key])
                let date2 = new Date (b[key])
                if(date1 > date2) {
                    return -1
                }
                if(date1 < date2){
                    return 1
                }
                return 0 
            })
        },
        onSearchItemSelected (item) {
            var vm = this
            vm.selectedSearchItem = item
            let value = vm.selectedSearchItem['applicantIdNo'].toString()
            let pattern1 = /^(([0-9]{9,9}))$/
            let pattern2 = /^(([0-9]{12,12}))$/
            if(pattern1.test(value) || pattern2.test(value)){
                vm.checkCMT = false
                vm.dossiers['delegateIdNo'] = vm.selectedSearchItem['applicantIdNo']
                vm.dossiers['delegateName'] = vm.selectedSearchItem['applicantName']
                vm.dossiers['applicantName'] = vm.selectedSearchItem['applicantName']
                vm.dossiers['delegateTelNo'] = vm.selectedSearchItem['contactTelNo']
                vm.dossiers['contactTelNo'] = vm.selectedSearchItem['contactTelNo']
                vm.dossiers['delegateEmail'] = vm.selectedSearchItem['contactEmail']
                vm.dossiers['contactEmail'] = vm.selectedSearchItem['contactEmail']
                vm.delegateCityCode = vm.selectedSearchItem['cityCode']
                vm.delegateDistrictCode = vm.selectedSearchItem['districtCode']
                vm.delegateWardCode = vm.selectedSearchItem['wardCode']
            } else {
                vm.checkCMT = true
                vm.messengeCMT = 'Số CMND gồm 9 hoặc 12 ký tự 0-9'  
            }

        },
        onInputChange (query) {
            let vm = this
            let pattern1 = /^(([0-9]{9,9}))$/
            let pattern2 = /^(([0-9]{12,12}))$/
            if(pattern1.test(query) || pattern2.test(query)){
                vm.checkCMT = false
            } else {
                vm.checkCMT = true
                vm.messengeCMT = 'Số CMND gồm 9 hoặc 12 ký tự 0-9'  
            }
            if (query.trim().length === 0) {
                return null
            }
            let url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`

            return new Promise(resolve => {
                vm.$store.dispatch('loadInitResource').then(result => {
                    let param = {
                        headers: {
                        }
                    }
                    axios.get(url, param).then(response => {
                    let items = []
                    if (response.data.hasOwnProperty('data')) {
                        items = response.data.data
                    } else {
                    }
                        resolve(items)
                    })
                })
            })
        },
        close(){
            this.dialogGiayTo = false
            this.dialogTimKiemConDau = false
        },
        closeConDauChuKy(){
            this.dialogTimKiemConDau = false
            this.conDauSelected = ''
            this.chuKySelected = ''
        },
        nextGiayto () {
            let vm = this
            if(vm.update_giayto === 'add' || vm.update_giayto === (vm.listGiayTo.length - 1)) {
                vm.update_giayto === 'add'
                vm.$refs.formGiayTo.reset()
                vm.conDau = ''
                vm.chuKy = ''
            } else {
                vm.update_giayto = vm.update_giayto + 1
                vm.ten_giay_to = vm.listGiayTo[vm.update_giayto].ten_giay_to,
                vm.ma_ten_giay_to = vm.listGiayTo[vm.update_giayto].ma_ten_giay_to,
                vm.ma_loai_giay_to =  vm.listGiayTo[vm.update_giayto].ma_loai_giay_to,
                vm.loai_giay_to = vm.listGiayTo[vm.update_giayto].loai_giay_to,
                vm.so_ban = vm.listGiayTo[vm.update_giayto].so_ban,
                vm.loai_cong_viec = vm.listGiayTo[vm.update_giayto].loai_cong_viec,
                vm.so_hieu_giay_to = vm.listGiayTo[vm.update_giayto].so_hieu_giay_to,
                vm.ten_nguoi_duoc_cap = vm.listGiayTo[vm.update_giayto].ten_nguoi_duoc_cap,
                vm.co_quan_cap = vm.listGiayTo[vm.update_giayto].co_quan_cap,
                vm.ma_co_quan_cap = vm.listGiayTo[vm.update_giayto].ma_co_quan_cap,
                vm.nguoi_ky = vm.listGiayTo[vm.update_giayto].nguoi_ky,
                vm.ma_nguoi_ky = vm.listGiayTo[vm.update_giayto].ma_nguoi_ky,
                vm.chuc_danh_ky = vm.listGiayTo[vm.update_giayto].chuc_danh_ky,
                vm.ma_chuc_vu = vm.listGiayTo[vm.update_giayto].ma_chuc_vu,
                vm.ngay_ky = vm.listGiayTo[vm.update_giayto].ngay_ky,
                vm.ma_con_dau = vm.listGiayTo[vm.update_giayto].ma_con_dau,
                vm.ma_chu_ky = vm.listGiayTo[vm.update_giayto].ma_chu_ky,
                vm.kiem_tra =vm.listGiayTo[vm.update_giayto].kiem_tra,
                vm.conDau = vm.listGiayTo[vm.update_giayto].anh_con_dau
                vm.chuKy = vm.listGiayTo[vm.update_giayto].anh_chu_ky
                vm.giay_to = {
                    TEN: vm.listGiayTo[vm.update_giayto].ten_giay_to,
                    MA: vm.listGiayTo[vm.update_giayto].ma_ten_giay_to,
                }
                vm.loai_giay_to = {
                    text: vm.listGiayTo[vm.update_giayto].loai_giay_to,
                    value: vm.listGiayTo[vm.update_giayto].ma_loai_giay_to
                }
                vm.loai_cong_viec = {
                    text: vm.listGiayTo[vm.update_giayto].loai_cong_viec,
                    value:  vm.listGiayTo[vm.update_giayto].loai_cong_viec
                }
            }
        },
        backGiayto () {
            let vm = this
            vm.update_giayto = vm.update_giayto - 1
            vm.ten_giay_to = vm.listGiayTo[vm.update_giayto].ten_giay_to,
            vm.ma_ten_giay_to = vm.listGiayTo[vm.update_giayto].ma_ten_giay_to,
            vm.ma_loai_giay_to =  vm.listGiayTo[vm.update_giayto].ma_loai_giay_to,
            vm.loai_giay_to = vm.listGiayTo[vm.update_giayto].loai_giay_to,
            vm.so_ban = vm.listGiayTo[vm.update_giayto].so_ban,
            vm.loai_cong_viec = vm.listGiayTo[vm.update_giayto].loai_cong_viec,
            vm.so_hieu_giay_to = vm.listGiayTo[vm.update_giayto].so_hieu_giay_to,
            vm.ten_nguoi_duoc_cap = vm.listGiayTo[vm.update_giayto].ten_nguoi_duoc_cap,
            vm.co_quan_cap = vm.listGiayTo[vm.update_giayto].co_quan_cap,
            vm.ma_co_quan_cap = vm.listGiayTo[vm.update_giayto].ma_co_quan_cap,
            vm.nguoi_ky = vm.listGiayTo[vm.update_giayto].nguoi_ky,
            vm.ma_nguoi_ky = vm.listGiayTo[vm.update_giayto].ma_nguoi_ky,
            vm.chuc_danh_ky = vm.listGiayTo[vm.update_giayto].chuc_danh_ky,
            vm.ma_chuc_vu = vm.listGiayTo[vm.update_giayto].ma_chuc_vu,
            vm.ngay_ky = vm.listGiayTo[vm.update_giayto].ngay_ky,
            vm.ma_con_dau = vm.listGiayTo[vm.update_giayto].ma_con_dau,
            vm.ma_chu_ky = vm.listGiayTo[vm.update_giayto].ma_chu_ky,
            vm.kiem_tra =vm.listGiayTo[vm.update_giayto].kiem_tra,
            vm.conDau = vm.listGiayTo[vm.update_giayto].anh_con_dau
            vm.chuKy = vm.listGiayTo[vm.update_giayto].anh_chu_ky
            vm.giay_to = {
                TEN: vm.listGiayTo[vm.update_giayto].ten_giay_to,
                MA: vm.listGiayTo[vm.update_giayto].ma_ten_giay_to,
            }
            vm.loai_giay_to = {
                text: vm.listGiayTo[vm.update_giayto].loai_giay_to,
                value: vm.listGiayTo[vm.update_giayto].ma_loai_giay_to
            }
            vm.loai_cong_viec = {
                text: vm.listGiayTo[vm.update_giayto].loai_cong_viec,
                value:  vm.listGiayTo[vm.update_giayto].loai_cong_viec
            }
        },
        changeAdress(){
            let vm = this
            if(vm.dossiers.delegateAddress.length > 100){
                vm.dossiers.delegateAddress = '',
                vm.dossiers.address = ''
            } else {
                vm.dossiers.address = vm.dossiers.delegateAddress
            }
            

        }
    }
}
</script>