<template>
    <div class="form_vuejs">
        <v-layout wrap>
            <v-flex xs12 class="px-2 my-2"><strong>Thông tin người nộp</strong></v-flex>
            <v-flex xs12 sm6  class="px-2">
                <label>Họ và tên<span class="red--text">*</span></label>
                <v-text-field
                    v-model="dossiers.delegateName"
                    :rules="[rules.required,rules.varChar50]"
                    required
                    solo
                    @input="dossiers.delegateName = dossiers.delegateName.toUpperCase()"         
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>CMND/CCCD số</label>
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
                    :rules="[rules.varChar15]"
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label>Email</label>
                <v-text-field
                    v-model="dossiers.delegateEmail"
                    solo
                    :rules="[rules.varChar50]"
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label for="">Địa chỉ</label>
                <v-text-field
                    v-model="dossiers.delegateAddress"
                    solo
                    placeholder="Không quá 100 ký tự"
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 class="px-2 ">
                <label>Tỉnh/thành</label>
                <v-autocomplete
                    hide-no-data
                    :items="delegateCitys"
                    v-model="delegateCityCode"
                    item-text="itemName"
                    item-value="itemCode"
                    clearable
                    @change="changeDossier()"
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
                    hide-no-data
                    @change="changeDossier()"
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
                    @change="changeDossier()"
                    hide-no-data
                    clearable
                    solo
                ></v-autocomplete>
            </v-flex>
            <v-flex xs12  class="px-2 ">
                <label for="">Thông tin đoàn <span class="red--text">*</span></label>
                <v-text-field
                    v-model="dossiers.bookingName"
                    :rules="[rules.required]"
                    required
                    solo
                    @change="changeDossier()"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 ">
                <label for="">Lấy mẫu tờ khai từ mã tờ khai trực tuyến</label>
                <div style="display:flex; flex-wrap: wrap; align-items: center;">
                    <v-text-field
                        v-model="eFormCode"
                        solo
                        @keyup.enter="getDataEform()"
                    ></v-text-field>
                    <v-btn small color="primary" @click="getDataEform()" class="ml-2 mt-0" style="height: 32px;">
                        <v-icon>save_alt</v-icon>&nbsp; Lấy dữ liệu
                    </v-btn>
                </div>
            </v-flex>
            <v-flex xs12 class="px-2 ">
                <div style="display:flex; flex-wrap: wrap; align-items: center;">
                    <strong>Thông tin văn bản, quyết định <span class="red--text">*</span> </strong>
                    <v-btn small color="primary" @click.stop="openDialogThemVanBan()"><v-icon>add</v-icon>&nbsp; Thêm văn bản</v-btn>
                </div>
            </v-flex>
            <v-flex xs12  class="px-2 my-2">
                <v-data-table
                    :headers="headerVanBan"
                    :items="listVanBan"
                    hide-actions
                    no-data-text="Không có thông tin văn bản quyết định nào"
                    class="table_vuejs"
                    style="border-left: 0.5px solid #dedede;"
                >
                    <template slot="items" slot-scope="props">
                    <tr>
                        <td class="py-2">{{props.item.Loai_Cong_Van}}</td>
                        <td class="py-2">{{props.item.So_Cong_Van}}</td>
                        <td class="py-2">{{props.item.Ngay_Cong_Van}}</td>
                        <td class="py-2">{{props.item.Cq_Ca_Nhan_Cong_Van}}</td>
                        <td class="text-xs-center">
                            <v-btn flat icon color="primary" @click="openDialogUpdateVanBan(props.index,props.item)">
                                <v-icon>create</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-xs-center">
                            <v-btn flat icon color="#F44336" @click="deleteVanBan(props.index)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex xs12 sm6  class="px-2 my-2">
                <div style="display:flex; flex-wrap: wrap; align-items: center;">
                    <strong>Danh sách thành viên đoàn <span class="red--text">*</span></strong>
                    <v-btn small color="primary" @click.stop="openDialogThemThanhVien()"><v-icon>add</v-icon>&nbsp; Thêm thành viên</v-btn>
                </div>
            </v-flex>
            <v-flex xs12  class="px-2 my-2">
                <v-data-table
                    :headers="headerThanhVien"
                    :items="listThanhVien"
                    hide-actions
                    no-data-text="Không có thành viên đoàn nào"
                    class="table_vuejs"
                    style="border-left: 0.5px solid #dedede;"
                >
                    <template slot="items" slot-scope="props">
                        <tr>
                            <td style="width: 50px">
                                <v-checkbox
                                    v-model="props.item.kiem_tra"
                                    primary
                                    @change="toggleKT(props.index, props.item)"
                                >
                                </v-checkbox> 
                            </td>
                            <td class="text-xs-center py-2">{{props.index + 1}}</td>
                            <td class="py-2">{{props.item.Ten}}</td>
                            <td class="py-2">{{props.item.So_Ho_Chieu}}</td>
                            <td class="py-2">{{props.item.Ngay_Sinh_F}}</td>
                            <td class="py-2">
                                <span v-if="props.item.So_Cv_Den">
                                    {{props.item.So_Cv_Den}} - {{props.item.Ngay_Cv_Den}} - {{props.item.Co_Quan_De_Nghi_Ten}}
                                </span>
                                <span v-else style="color: red">
                                    Chưa có văn bản quyết định
                                </span>
                            </td>
                            <td class="text-xs-center">
                                <v-btn flat icon color="primary" @click="openDialogUpdateThanhVien(props.index,props.item)">
                                    <v-icon>create</v-icon>
                                </v-btn>
                            </td>
                            <td class="text-xs-center">
                                <v-btn flat icon color="#F44336" @click="deleteThanhVien(props.index)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
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
                    <tr v-if="(props.item.dossierPartNo != 'TP01' && props.item.dossierPartNo != 'TP02') && props.item.partType === 1">
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
            <v-flex xs12 sm4 class="px-2 my-2">
                <label for="">Số người <span class="red--text">*</span></label>
                <v-text-field
                    v-model="so_nguoi"
                    solo
                    type="number"
                ></v-text-field>
            </v-flex>
            
            <v-flex xs12 sm4  class="px-2 my-2">
                <label for="">Dự thu lệ phí</label>
                <v-text-field
                    v-model="le_phi_format"
                    solo
                    type="number"
                    @change="changLePhi()"
                ></v-text-field>        
            </v-flex>
            <v-flex xs12 sm4  class="px-2 my-2">
                <label for="">Ngày hẹn trả <span class="red--text">*</span></label><br/>
                <!-- <v-text-field
                    v-model="dossiers.dueDate"
                    :rules="[rules.required]"
                    required
                    solo
                ></v-text-field> -->
                <!-- <v-menu
                    ref="menu5"
                    :close-on-content-click="false"
                    v-model="menu5"
                    transition="scale-transition"
                    offset-y
                


                > -->
                    <v-text-field
                        slot="activator"
                        v-model="dateDueDateFormated"
                        persistent-hint
                        append-icon="event"
                        hint="DD/MM/YYYY"
                        
                        @change="dateDueDate = parseDate(dateDueDateFormated)"
                        :rules="[rules.required, rules.checkDateFuture]"
                        
                    ></v-text-field>
            
                    <!-- <v-date-picker v-model="dateDueDate" no-title @input="menu5 = false" locale="vi"></v-date-picker>
                </v-menu>       -->
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
        <!-- Dialog thêm văn bản -->
        <v-dialog
            v-model="dialogThemVanBan"
            max-width="800px"
            persistent
        >
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Thông tin văn bản</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click.native="dialogThemVanBan = false">
                    <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="form_vuejs px-0 pb-0">
                    <v-form ref="formVanBan" lazy-validation>
                        <v-layout wrap>
                            <v-flex class="xs12 px-2">
                                <v-layout wrap>
                                    <v-flex xs12 class="px-2 mb-2">
                                        <label for="">Cơ quan, cá nhân mời đón <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="listCoQuanChuQuan"
                                            v-model="co_quan_chu_quan"
                                            item-text="CQTen"
                                            item-value="CQID"
                                            clearable
                                            hide-no-data
                                            return-object
                                            :rules="[rules.required]"
                                            required
                                            solo               
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 mb-2">
                                        <label for="">Văn bản đề nghị <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="listLoaiVanBan"
                                            v-model="loaiVanBan"
                                            item-text="itemName"
                                            item-value="itemCode"
                                            clearable
                                            hide-no-data
                                            return-object
                                            :rules="[rules.required]"
                                            required
                                            solo               
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 md6 class="px-2 mb-2">
                                        <label for="">Số văn bản <span class="red--text">*</span></label>
                                        <v-text-field
                                            v-model="so_van_ban"
                                            solo
                                            :rules="[rules.required]"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                    
                                    <v-flex xs12 md6 class="px-2 mb-2">
                                        <label for="">Ngày gửi <span class="red--text">*</span></label>
                                        <!-- <v-menu
                                            ref="menu"
                                            :close-on-content-click="false"
                                            v-model="menu"
                                            transition="scale-transition"
                                            offset-y
                                            style="width: 100%;"
                                        > -->
                                            <v-text-field
                                                slot="activator"
                                                v-model="vb_ngay_ky"
                                                persistent-hint
                                                append-icon="event"
                                                hint="DD/MM/YYYY"
                                                @change="changeNgayKy()"
                                                @input="inputNgayKy()"
                                                solo
                                                :rules="[rules.required,rules.checkDatePast]"
                                                required
                                            ></v-text-field>
                                            <!-- <v-date-picker v-model="dateNgayKy" no-title @input="menu = false" locale="vi"></v-date-picker>
                                        </v-menu> -->
                                    </v-flex>
                                    <v-flex xs12 class="px-2 mb-2">
                                        <label for="">Đề nghị khác</label>
                                        <v-textarea class="py-0"
                                            box
                                            v-model="de_nghi_khac"
                                            rows="3"
                                            solo
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            
                            <v-flex xs12 class="mx-0 py-1 mt-2 px-3" style="background: #dededeb3;">
                                <v-btn small color="red" class="white--text right mr-0" @click="dialogThemVanBan=false"><v-icon>clear</v-icon>&nbsp; Đóng</v-btn>
                                <v-btn small color="primary" class="right" @click="updateCQCQ()">
                                    <span v-if="update_cqcq !== 'add'"><v-icon>save</v-icon>&nbsp; Cập nhật</span>
                                    <span v-else> <v-icon>add</v-icon>&nbsp; Thêm văn bản</span>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Dialog thêm thành viên -->
        <v-dialog
            v-model="dialogThemThanhVien"
            max-width="1000px"
            class="form_vuejs"
            persistent
        >
            <v-card class="dialog_menuTabs">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Thông tin thành viên</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click.native="closeThemThanhVien">
                    <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="form_vuejs mt-0 pt-0 mx-0 px-0 mb-0 pb-0">
                    <div class="">
                        <v-tabs icons-and-text v-model="active" slider-color="primary">
                            <!-- <v-tabs-slider color="primary"></v-tabs-slider> -->
                            <v-tab :key="1" href="#tab-1" ripple class=""> Thông tin nhân thân và hộ chiếu </v-tab>
                            <v-tab :key="2" href="#tab-2" ripple class=""> Thân nhân</v-tab>
                            <v-tab :key="3" href="#tab-3" ripple class=""> Người đi cùng hộ chiếu</v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="active">
                            <v-tab-item :key="1" value="tab-1" >
                                <v-card>
                                    <v-card-text class="px-0 py-0 mt-2">
                                        <v-form ref="formThanhVien" lazy-validation>
                                            <v-layout wrap>
                                                <v-flex xs12 class="px-2">
                                                    <v-layout wrap>
                                                        <v-flex xs12 class="px-2 my-2">
                                                            <label for="">Văn bản cử đi nước ngoài <span class="red--text">*</span></label>
                                                            <v-autocomplete
                                                                :items="listVanBan"
                                                                v-model="vb_co_quan_chu_quan"
                                                                item-text="Loai_Cong_Van"
                                                                item-value="Ma_Loai_Cong_Van"
                                                                return-object
                                                                clearable
                                                                hide-no-data
                                                                :rules="[rules.required]"
                                                                required
                                                                solo
                                                            >
                                                                <template slot="selection" slot-scope="props">
                                                                    <div>{{ props.item.So_Cong_Van }} - {{ props.item.Ngay_Cong_Van }} - {{props.item.Cq_Ca_Nhan_Cong_Van}}</div>
                                                                </template>
                                                                <template slot="item" slot-scope="props">
                                                                    <div>{{ props.item.So_Cong_Van }} - {{ props.item.Ngay_Cong_Van }} - {{props.item.Cq_Ca_Nhan_Cong_Van}}</div>
                                                                </template>
                                                            </v-autocomplete>
                                                        </v-flex>
                                                        <div class="mx-2 my-2 flex xs12" style="font-weight: bold; padding: 4px 10px 4px 10px; background: #645d7f; color: white;">I. Thông tin cá nhân</div>
                                                        <v-flex class="xs12 mx-2" v-if="saiSoHoChieu">
                                                            <span style="color: red">(*) </span> <span>Không tìm thấy thông tin hộ chiếu số: <b>{{so_ho_chieu}}</b></span>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">1. Số hộ chiếu <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-text-field
                                                                    v-model="so_ho_chieu"
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    @input="changeSoHieuChieu"
                                                                ></v-text-field>
                                                                <v-btn class="mt-0" small color="primary" @click="kiemTraHoChieu()" style="height: 34px;">
                                                                    <v-icon>check_circle_outline</v-icon>&nbsp; Kiểm tra thông tin
                                                                </v-btn>
                                                            </div>  
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">2. Hạn hộ chiếu <span class="red--text">*</span></label>
                                                            <!-- <v-menu
                                                                ref="menu2"
                                                                :close-on-content-click="false"
                                                                v-model="menu2"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="hanHoChieuFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeHanHoChieu()"
                                                                    @input="inputHanHoChieu()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDateFuture]"
                                                                    required
                                                                ></v-text-field>
                                                                <!-- <v-date-picker v-model="hanHoChieu" no-title @input="menu2 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">3. Loại hộ chiếu</label>
                                                            <v-autocomplete
                                                                :items="listLoaiHoChieu"
                                                                v-model="loai_ho_chieu"
                                                                item-text="text"
                                                                item-value="value"
                                                                return-object
                                                                clearable
                                                                hide-no-data
                                                                solo                  
                                                            ></v-autocomplete>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">4. Cấp bởi <span class="red--text">*</span></label>
                                                            <v-autocomplete
                                                                :items="listNoiCapHoChieu"
                                                                v-model="noi_cap_ho_chieu"
                                                                item-text="itemName"
                                                                item-value="itemCode"
                                                                return-object
                                                                clearable
                                                                hide-no-data
                                                                :rules="[rules.required]"
                                                                required
                                                                solo                  
                                                            ></v-autocomplete>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 my-2">
                                                            <label for="">5. Họ và tên (Chữ in viết hoa) <span class="red--text">*</span></label>
                                                            <v-text-field
                                                                v-model="ho_ten"
                                                                :rules="[rules.required]"
                                                                required
                                                                solo
                                                                @input="ho_ten= ho_ten ? ho_ten.toUpperCase() : ''"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">6. Giới tính <span class="red--text">*</span></label>
                                                            <v-autocomplete
                                                                :items="listGioiTinh"
                                                                v-model="gioi_tinh"
                                                                item-text="name"
                                                                item-value="value"
                                                                return-object
                                                                clearable
                                                                hide-no-data
                                                                :rules="[rules.required]"
                                                                required
                                                                solo                  
                                                            ></v-autocomplete>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">7.Ngày sinh <span class="red--text">*</span></label>
                                                            <!-- <v-menu
                                                                ref="menu7"
                                                                :close-on-content-click="false"
                                                                v-model="menu7"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="birthdayFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgaySinh()"
                                                                    @input="inputNgaySinh()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDatePast]"
                                                                    required
                                                                ></v-text-field>
                                                                <!-- <v-date-picker v-model="birthday" no-title @input="menu7 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">8. Quốc tịch hiện nay <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listNuocDi"
                                                                    v-model="quoc_tich_hien_nay"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">9. Quốc tịch gốc</label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listNuocDi"
                                                                    v-model="quoc_tich_goc"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 my-2">
                                                            <label for="">10. Nghề nghiệp </label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-text-field
                                                                    v-model="nghe_nghiep"
                                                                    solo
                                                                ></v-text-field>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">11. Mục đích <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listMucDich"
                                                                    v-model="muc_dich"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <v-text-field
                                                                style="margin-top: 19px;"
                                                                v-model="ten_theo_muc_dich"
                                                                solo
                                                                placeholder="Tên theo mục đích"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">12. Địa chỉ Việt Nam </label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-text-field
                                                                    v-model="dia_chi_viet_nam"
                                                                    solo
                                                                ></v-text-field>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 sm6 class="px-2 my-2">
                                                            <label for="">13. Địa chỉ nước ngoài </label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-text-field
                                                                    v-model="dia_chi_nuoc_ngoai"
                                                                    solo
                                                                ></v-text-field>
                                                            </div>
                                                        </v-flex>
                                                        <div class="mx-2 my-2 flex xs12" style="font-weight: bold; padding: 4px 10px 4px 10px; background: #645d7f; color: white;">
                                                            II. Thông tin thị thực
                                                        </div>
                                                        <v-flex xs12 md4 class="px-2 my-2">
                                                            <label for="">1. Loại thị thực <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listLoaiThiThuc"
                                                                    v-model="loai_thi_thuc"
                                                                    item-text="text"
                                                                    item-value="value"
                                                                    clearable
                                                                    hide-no-data
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 my-2">
                                                            <label for="">2. Số lần <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listSoLanThiThuc"
                                                                    v-model="so_lan_thi_thuc"
                                                                    item-text="text"
                                                                    item-value="value"
                                                                    clearable
                                                                    hide-no-data
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 my-2">
                                                            <label for="">3. Ký hiệu <span class="red--text">*</span></label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listKyHieu"
                                                                    v-model="ky_hieu_thi_thuc"
                                                                    item-text="itemDescription"
                                                                    item-value="itemDescription"
                                                                    clearable
                                                                    hide-no-data
                                                                    :rules="[rules.required]"
                                                                    required
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 my-2">
                                                            <label for="">4. Dự kiến nhập cảnh từ ngày <span class="red--text">*</span></label>
                                                            <!-- <v-menu
                                                                ref="menu8"
                                                                :close-on-content-click="false"
                                                                v-model="menu8"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="dateNgayDuKienNkFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgayDuKienNk()"
                                                                    @input="inputNgayDuKienNk()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDateFuture]"
                                                                    required
                                                                ></v-text-field>
                                                                <!-- <v-date-picker :max="dateNgayDuKienXkFormated ? getMinMax(dateNgayDuKienXkFormated) : null" v-model="dateNgayDuKienNk" no-title @input="menu8 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 my-2">
                                                            <label for="">5. Đến ngày <span class="red--text">*</span></label>
                                                            <!-- <v-menu
                                                                ref="menu9"
                                                                :close-on-content-click="false"
                                                                v-model="menu9"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="dateNgayDuKienXkFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgayDuKienXk()"
                                                                    @input="inputNgayDuKienXk()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDateFuture]"
                                                                    required
                                                                ></v-text-field>
                                                                <!-- <v-date-picker :min="dateNgayDuKienNkFormated ? getMinMax(dateNgayDuKienNkFormated) : null" v-model="dateNgayDuKienXk" no-title @input="menu9 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <!-- <v-flex xs12 md4 class="px-2 my-2"></v-flex>
                                                        <div class="mx-2 my-2 flex xs12" style="font-weight: bold; padding: 4px 10px 4px 10px; background: #645d7f; color: white;">
                                                            III. Thông tin cơ quan/ cá nhân mời đón
                                                        </div>
                                                        <v-flex xs12 class="px-2 mb-2">
                                                            <label for="">Cơ quan, cá nhân mời đón</label>
                                                            <v-autocomplete
                                                                :items="listCoQuanChuQuan"
                                                                v-model="co_quan_chu_quan"
                                                                item-text="CQTen"
                                                                item-value="CQID"
                                                                clearable
                                                                hide-no-data
                                                                return-object
                                                                :rules="[rules.required]"
                                                                required
                                                                solo               
                                                            ></v-autocomplete>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 mb-2">
                                                            <label for="">Văn bản đề nghị</label>
                                                            <v-autocomplete
                                                                :items="listVanBan"
                                                                v-model="van_ban_de_nghi"
                                                                item-text="text"
                                                                item-value="value"
                                                                clearable
                                                                hide-no-data
                                                                return-object
                                                                solo               
                                                            ></v-autocomplete>
                                                        </v-flex>
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">Số văn bản</label>
                                                            <v-text-field
                                                                v-model="so_van_ban"
                                                                solo
                                                                type="number"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">Ngày gửi</label>
                                                            <v-menu
                                                                ref="menu3"
                                                                :close-on-content-click="false"
                                                                v-model="menu3"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            >
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="dateNgayGuiVbNhanThanFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgayGuiVbNhanThan()"
                                                                    @input="inputNgayGuiVbNhanThan()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDatePast]"
                                                                    required
                                                                ></v-text-field>
                                                                <v-date-picker v-model="dateNgayGuiVbNhanThan" no-title @input="menu3 = false" locale="vi"></v-date-picker>
                                                            </v-menu>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 mb-2">
                                                            <label for="">Đề nghị khác</label>
                                                            <v-textarea class="py-0"
                                                                box
                                                                v-model="de_nghi_khac"
                                                                rows="3"
                                                                solo
                                                            ></v-textarea>
                                                        </v-flex> -->
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12 class="mx-0 py-1 mt-2 px-3" style="background: #dededeb3;">
                                                    <v-btn small color="red" class="white--text right mr-0" @click="closeThemThanhVien"><v-icon>clear</v-icon>&nbsp; Đóng</v-btn>
                                                    <v-btn small color="primary" class="right" @click="updateThanhVien()"><v-icon>save</v-icon>&nbsp; 
                                                        <span v-if="update_thanhvien !== 'add'">Cập nhật thành viên</span>
                                                        <span v-else>Thêm thành viên</span>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-form>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item :key="2" value="tab-2" >
                                <v-card style="min-height: calc(90vh - 150px)">
                                    <v-card-text class="px-0 py-0 mt-2">
                                        <v-form ref="formThanNhan" lazy-validation>
                                            <v-layout wrap>
                                                <v-flex xs12 class="px-2">
                                                    <v-layout wrap>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">1. Loại quan hệ</label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listLoaiQuanHe"
                                                                    v-model="loai_quan_he"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">2. Họ tên <span class="red--text">*</span></label>
                                                            <v-text-field
                                                                v-model="ho_ten_than_nhan"
                                                                :rules="[rules.required]"
                                                                required
                                                                solo
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">3. Ngày sinh</label>
                                                            <!-- <v-menu
                                                                ref="menu10"
                                                                :close-on-content-click="false"
                                                                v-model="menu10"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="birthdayThanNhanFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgaySinhThanNhan()"
                                                                    @input="inputNgaySinhThanNhan()"
                                                                    solo
                                                                ></v-text-field>
                                                                <!-- <v-date-picker v-model="birthdayThanNhan" no-title @input="menu10 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">4. Quốc tịch</label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listNuocDi"
                                                                    v-model="quoc_tich_than_nhan"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">5. Địa chỉ thường trú </label>
                                                            <v-text-field
                                                                v-model="dia_chi_thuong_tru_than_nhan"
                                                                solo
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 class="mx-2 mb-2">
                                                            <v-btn small color="red" class="right white--text mr-0" @click="cancelAction('than_nhan')"><v-icon>reply</v-icon>&nbsp; Hủy thao tác</v-btn>
                                                            <v-btn small color="primary" class="right" @click="updateThanNhan">
                                                                <span v-if="update_than_nhan !== 'add'"><v-icon>save</v-icon>&nbsp; Cập nhật</span>
                                                                <span v-else><v-icon>add</v-icon>&nbsp; Thêm</span>
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 mb-2" style="padding-bottom: 50px;">
                                                            <v-data-table
                                                                :headers="headerThanNhan"
                                                                :items="listThanNhan"
                                                                hide-actions
                                                                no-data-text="Không có thân nhân nào"
                                                                class="table_vuejs"
                                                                style="border-left: 0.5px solid #dedede;"
                                                            >
                                                                <template slot="items" slot-scope="props">
                                                                <tr>
                                                                    <td class="py-2 text-xs-center">{{props.index + 1}}</td>
                                                                    <td class="py-2">{{props.item.Qhgd_Text}}</td>
                                                                    <td class="py-2">{{props.item.Ten}}</td>
                                                                    <td class="py-2">{{props.item.Ngay_Sinh}}</td>
                                                                    <td class="py-2">{{props.item.Dia_Chi_Thuong_Tru}}</td>
                                                                    <td class="py-2">{{props.item.Quoc_Tich_Text}}</td>
                                                                    <td style="width: 95px;">
                                                                        <v-btn small flat icon color="primary" @click="editThanNhan(props.item, props.index)">
                                                                            <v-icon>create</v-icon>
                                                                        </v-btn>
                                                                        <v-btn small flat icon color="#F44336" @click="deleteThanNhan(props.item, props.index)">
                                                                            <v-icon>delete</v-icon>
                                                                        </v-btn>
                                                                    </td>
                                                                </tr>
                                                                </template>
                                                            </v-data-table>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12 class="mx-0 py-1 mt-2 px-3" style="background: #dededeb3;position: absolute;width: 100%;bottom: 0">
                                                    <v-btn small color="red" class="white--text right mr-0" @click="closeThemThanhVien"><v-icon>clear</v-icon>&nbsp; Đóng</v-btn>
                                                    <v-btn small color="primary" class="right" @click="updateThanhVien()"><v-icon>save</v-icon>&nbsp; 
                                                        <span v-if="update_thanhvien !== 'add'">Cập nhật thành viên</span>
                                                        <span v-else>Thêm thành viên</span>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-form>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item :key="3" value="tab-3" >
                                <v-card style="min-height: calc(90vh - 150px)">
                                    <v-card-text class="px-0 py-0 mt-2">
                                        <v-form ref="formNguoiDiCung" lazy-validation>
                                            <v-layout wrap>
                                                <v-flex xs12 class="px-2">
                                                    <v-layout wrap>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">1. Loại quan hệ</label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listLoaiQuanHe"
                                                                    v-model="loai_quan_he"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">2. Họ tên <span class="red--text">*</span></label>
                                                            <v-text-field
                                                                v-model="ho_ten_di_cung"
                                                                solo
                                                                :rules="[rules.required]"
                                                                required
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 md4 class="px-2 mb-2">
                                                            <label for="">3. Ngày sinh <span class="red--text">*</span></label>
                                                            <!-- <v-menu
                                                                ref="menu6"
                                                                :close-on-content-click="false"
                                                                v-model="menu6"
                                                                transition="scale-transition"
                                                                offset-y
                                                                style="width: 100%;"
                                                            > -->
                                                                <v-text-field
                                                                    slot="activator"
                                                                    v-model="birthdayDiCungFormated"
                                                                    persistent-hint
                                                                    append-icon="event"
                                                                    hint="DD/MM/YYYY"
                                                                    @change="changeNgaySinhDiCung()"
                                                                    @input="inputNgaySinhDiCung()"
                                                                    solo
                                                                    :rules="[rules.required,rules.checkDatePast]"
                                                                    required
                                                                ></v-text-field>
                                                                <!-- <v-date-picker v-model="birthdayDiCung" no-title @input="menu6 = false" locale="vi"></v-date-picker>
                                                            </v-menu> -->
                                                        </v-flex>
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">4. Quốc tịch</label>
                                                            <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                                                <v-autocomplete
                                                                    :items="listNuocDi"
                                                                    v-model="quoc_tich_di_cung"
                                                                    item-text="itemName"
                                                                    item-value="itemCode"
                                                                    clearable
                                                                    hide-no-data
                                                                    solo
                                                                    return-object
                                                                ></v-autocomplete>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs12 md6 class="px-2 mb-2">
                                                            <label for="">5. Số hộ chiếu </label>
                                                            <v-text-field
                                                                v-model="so_ho_chieu_di_cung"
                                                                solo
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 class="mx-2 mb-2">
                                                            <v-btn small color="red" class="right white--text mr-0" @click="cancelAction('nguoi_di_cung')"><v-icon>reply</v-icon>&nbsp; Hủy thao tác</v-btn>
                                                            <v-btn small color="primary" class="right" @click="updateNguoiDiCung">
                                                                <span v-if="update_di_cung !== 'add'"><v-icon>save</v-icon>&nbsp; Cập nhật</span>
                                                                <span v-else><v-icon>add</v-icon>&nbsp; Thêm</span>
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs12 class="px-2 mb-2" style="padding-bottom: 50px;">
                                                            <v-data-table
                                                                :headers="headerNguoiDiCung"
                                                                :items="listNguoiDiCung"
                                                                hide-actions
                                                                no-data-text="Không có người đi cùng nào"
                                                                class="table_vuejs"
                                                                style="border-left: 0.5px solid #dedede;"
                                                            >
                                                                <template slot="items" slot-scope="props">
                                                                <tr>
                                                                    <td class="py-2 text-xs-center">{{props.index + 1}}</td>
                                                                    <td class="py-2">{{props.item.Qhgd_Text}}</td>
                                                                    <td class="py-2">{{props.item.Ten}}</td>
                                                                    <td class="py-2">{{props.item.Ngay_Sinh}}</td>
                                                                    <td class="py-2">{{props.item.Quoc_Tich_Text}}</td>
                                                                    <td class="py-2">{{props.item.So_Ho_Chieu}}</td>
                                                                    <td style="width: 95px;">
                                                                        <v-btn small flat icon color="primary" @click="editNguoiDiCung(props.item, props.index)">
                                                                            <v-icon>create</v-icon>
                                                                        </v-btn>
                                                                        <v-btn small flat icon color="#F44336" @click="deleteNguoiDiCung(props.item, props.index)">
                                                                            <v-icon>delete</v-icon>
                                                                        </v-btn>
                                                                    </td>
                                                                </tr>
                                                                </template>
                                                            </v-data-table>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12 class="mx-0 py-1 mt-2 px-3" style="background: #dededeb3;position: absolute;width: 100%;bottom: 0">
                                                    <v-btn small color="red" class="white--text right mr-0" @click="closeThemThanhVien"><v-icon>clear</v-icon>&nbsp; Đóng</v-btn>
                                                    <v-btn small color="primary" class="right" @click="updateThanhVien()"><v-icon>save</v-icon>&nbsp; 
                                                        <span v-if="update_thanhvien !== 'add'">Cập nhật thành viên</span>
                                                        <span v-else>Thêm thành viên</span>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-form>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Dialog danh sách thành viên-->
        <v-dialog
            v-model="dialogDanhSach"
            max-width="800px"
            class="form_vuejs"
            persistent
        >
            <v-card>
                <v-card-title
                    class="headline lighten-2"
                    primary-title
                    style="display: flex;justify-content: space-between;"
                >
                    Danh sách thành viên
                    <v-btn color="#115ebe" fab small dark  @click="dialogDanhSach = false">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="form_vuejs">
                    <v-data-table
                        :headers="headerDanhSach"
                        :items="listDanhSach"
                        hide-actions
                        no-data-text="Không có thông tin thành viên nào"
                        class="table_vuejs"
                        style="border-left: 0.5px solid #dedede;"
                    >
                        <template slot="items" slot-scope="props">
                        <tr style="cursor: pointer" @click="chonThanhVien(props.item)">
                            <!-- <td>{{props.item.madoan}}</td> -->
                            <td>{{props.item.NguoiID}}</td>
                            <td>{{props.item.HoTen}}</td>
                            <td>{{props.item.NgaySinhFormart}}</td>
                            <td>{{props.item.NoiSinhText}}</td>
                            <td>{{props.item.SoSeri}}</td>
                            <td>{{props.item.HanDungFormart}}</td>
                            <td>{{props.item.DaHuy ? 'Đã hủy' : 'Đang sử dụng'}}</td>
                        </tr>
                        </template>
                    </v-data-table>
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
        active: 'tab-1',
        saiSoHoChieu: false,
        listMucDich: [],
        muc_dich: '',
        ten_theo_muc_dich: '',
        dia_chi_viet_nam: '',
        dia_chi_nuoc_ngoai: '',
        listLoaiHoChieu: [
            {"text": "Liên hợp quốc", "value": "LHQ"},
            {"text": "Phổ thông", "value": "PT"},
            {"text": "Ngoại giao", "value": "NG"},
            {"text": "Công vụ", "value": "CV"}
        ],
        loai_ho_chieu: '',
        listLoaiThiThuc: [
            {"text": "Dán", "value": "D"},
            {"text": "Rời", "value": "R"}
        ],
        loai_thi_thuc: '',
        listSoLanThiThuc: [
            {"text": "Một lần", "value": "1"},
            {"text": "Nhiều lần", "value": "N"}
        ],
        so_lan_thi_thuc: '',
        listLoaiQuanHe: [
        ],
        loai_quan_he: '',
        listKyHieu: [],
        ky_hieu_thi_thuc: '',
        ho_ten_than_nhan: '',
        ho_ten_di_cung: '',
        quoc_tich_than_nhan: '',
        quoc_tich_di_cung: '',
        menu: true,
        menu2: true,
        menu3: true,
        menu4: true,
        menu5: true,
        menu6: false,
        menu7: true,
        menu8: true,
        menu9: true,
        menu10: true,
        menu11: true,
        checkCMT: false,
        errorNgayCapCMT: false,
        dialogDanhSach: false,
        messengeCMT: '',
        soNuocKhongDuocMien: 0,
        dateNgayKy: '',
        dateNgayCapHCNG: '',
        dateNgayCapHCCV: '',
        dateNgayCapCMND: '',
        dateNgayHenTra: '',
        dateDueDate: '',
        dateNgayGuiVbNhanThan: '',
        dateNgayDuKienNk: '',
        dateNgayDuKienXk: '',
        birthdayDiCung: '',
        birthdayThanNhan: '',
        dateDueDateFormated: '',
        birthdayFormated: '',
        birthdayDiCungFormated: '',
        birthdayThanNhanFormated: '',
        hanHoChieuFormated: '',
        dateNgayGuiVbNhanThanFormated: '',
        dateNgayDuKienNkFormated: '',
        dateNgayDuKienXkFormated: '',
        crurentHours: '',
        birthday: '',
        hanHoChieu: '',
        eFormCode: '',
        tinhSelected: '',
        srcMauChuKy: '',
        update_cqcq: '',
        update_than_nhan: '',
        update_di_cung: '',
        update_thanhvien: '',
        searchOptions: {
            inputClass: 'input_vuejs'
        },
        ngayHetHieuLuc: '',
        quoc_tich_hien_nay: '',
        quoc_tich_goc: '',
        nghe_nghiep: '',
        eFormCodeArr: [],
        listTinh: [],
        checkVanBan: [],
        headerVanBan: [
            {
            text: 'Văn bản đề nghị',
            align: 'center',
            sortable: false
          },
          {
            text: 'Số văn bản',
            align: 'center',
            sortable: false
          },
          {
            text: 'Ngày gửi',
            align: 'center',
            sortable: false
          },
          {
            text: 'Cơ quan, cá nhân mời đón',
            align: 'center',
            sortable: false
          },
          {
            text: 'Sửa',
            align: 'center',
            sortable: false
          },
          {
            text: 'Xóa',
            align: 'center',
            sortable: false
          }
        ],
        listLoaiVanBan: [
        ],
        loaiVanBan: '',
        listVanBan: [],
        headerThanhVien: [
            {
                text: 'Đã KT',
                align: 'center',
                sortable: false,
                textEng: ''
            },
            {
                text: 'STT',
                align: 'center',
                sortable: false
            },
            {
                text: 'Họ tên',
                align: 'center',
                sortable: false
            },
            {
                text: 'Số hộ chiếu',
                align: 'center',
                sortable: false
            },
            {
                text: 'Ngày sinh',
                align: 'center',
                sortable: false
            },
            {
                text: 'Văn bản quyết định',
                align: 'center',
                sortable: false
            },
            {
                text: 'Sửa',
                align: 'center',
                sortable: false
            },
            {
                text: 'Xóa',
                align: 'center',
                sortable: false
            }
        ],
        listThanhVien: [],
        headerThanhPhanHoSo: [
            {
                text: 'Chọn',
                align: 'center',
                sortable: false,
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
        listThanhPhanHoSo: [],
        headerDanhSach: [
          {
            text: 'Mã nhân thân',
            align: 'center',
            sortable: false
          },
          {
            text: 'Họ và tên',
            align: 'center',
            sortable: false
          },
          {
            text: 'Ngày sinh',
            align: 'center',
            sortable: false
          },
          {
            text: 'Nơi sinh',
            align: 'center',
            sortable: false
          },
          {
            text: 'Số hộ chiếu',
            align: 'center',
            sortable: false
          },
          {
            text: 'Ngày hết hạn',
            align: 'center',
            sortable: false
          },
          {
            text: 'Trạng thái',
            align: 'center',
            sortable: false
          }
        ],
        headerThanNhan: [
            {
                text: 'STT',
                align: 'center',
                sortable: false
            },
            {
                text: 'Loại quan hệ',
                align: 'center',
                sortable: false
            },
            {
                text: 'Họ tên',
                align: 'center',
                sortable: false
            },
            {
                text: 'Ngày sinh',
                align: 'center',
                sortable: false
            },
            {
                text: 'Quốc tịch',
                align: 'center',
                sortable: false
            },
            {
                text: 'Địa chỉ thường trú',
                align: 'center',
                sortable: false
            },
            {
                text: 'Thao tác',
                align: 'center',
                sortable: false
            }
        ],
        headerNguoiDiCung: [
            {
                text: 'STT',
                align: 'center',
                sortable: false
            },
            {
                text: 'Loại quan hệ',
                align: 'center',
                sortable: false
            },
            {
                text: 'Họ tên',
                align: 'center',
                sortable: false
            },
            {
                text: 'Ngày sinh',
                align: 'center',
                sortable: false
            },
            {
                text: 'Quốc tịch',
                align: 'center',
                sortable: false
            },
            {
                text: 'Số hộ chiếu',
                align: 'center',
                sortable: false
            },
            {
                text: 'Thao tác',
                align: 'center',
                sortable: false
            }
        ],
        listThanNhan: [],
        listNguoiDiCung: [],
        listDanhSach: [],
        listGioiTinh: [{name: 'Nam', value: 'M'},{name: 'Nữ', value: 'F'}],
        fileMarks: [{value: 1, name: 'Bản chụp'},{value: 2, name: 'Bản sao'},{value: 3, name: 'Bản gốc'},{value: 4, name: 'Bản dịch'}],
        checkbox: false,
        dialogThemVanBan: false,
        dialogThemThanhVien: false,
        isLoadingDelegateIdNo: false,
        applicants: [],
        searchApplicants: null,
        dossierParts: [],
        delegateCitys: [],
        delegateCityCode: '',
        delegateDistricts: [],
        delegateDistrictCode: '',
        delegateWards: [],
        delegateWardCode: '',
        listNuocDi: [],
        listCoQuanChuQuan: [],
        listVanBanDeNghi: [],
        listVanBanNguoiKy: [],
        co_quan_ca_nhan_moi_don: '',
        van_ban_de_nghi: '',
        so_van_ban: '',
        de_nghi_khac: '',
        eformCodeThanhVienEdit: '',
        serviceCode: $('#serviceCode_hidden').val(),
        govAgencyCode: $('#govAgencyCode_hidden').val(),
        dossierTemplateNo: "",
        originality: 3,
        danhSachQGMienCongHam: [],
        selected: [],
        dossierFileCustom: [],
        dossierMarkArr: [],
        dossierFileArr: [],
        dossiers: {
            "applicantName": $('#applicantName').val(),
            "applicantIdType": "citizen","applicantIdNo": '',
            "address": "","cityCode": "",
            "districtCode": "","wardCode": "",
            "contactName": '',
            "contactTelNo": '',
            "contactEmail": '',
            "delegateName":'',
            "delegateIdNo": '',
            "delegateTelNo": '',
            "delegateEmail": '',
            "delegateAddress": '',
            "delegateCityCode": '',
            "delegateDistrictCode": '',
            "delegateWardCode": '',
            "applicantNote": "",
            "dossierName": $('#serviceName_hidden').val(),
            "viaPostal": 1,
            "postalServiceCode": "VNPOST",
            "postalAddress": "",
            "postalCityCode": "",
            "postalTelNo": "",
            "sampleCount": 1,
            "dueDate": '',
            "dossierNote": '',
            "dossierFilePayment": '',
            'durationCount': 4,
            "metaData": '{}'
        },
        bookingName: '',
        vb_so_thu_tu: '',
        so_nguoi: null,
        nuoc_di: [],
        ho_chieu_ngoai_giao_cu: 0,
        ho_chieu_cong_vu_cu: 0,
        ho_chieu_pho_thong_cu: 0,
        ho_chieu_ngoai_giao_moi: 0,
        ho_chieu_cong_vu_moi: 0,
        ho_chieu_gia_han: 0,
        ho_chieu_hong: 0,
        ho_chieu_mat: 0,
        cong_ham_so_nuoc: 0,
        cong_ham_so_nguoi: 0,
        cong_ham_nhap_canh: 0,
        cong_ham_qua_canh: 0,
        cong_ham_schengen: 0,
        le_phi_format: null,
        dueDate: null,
        dossierNote: null,
        vb_so_hieu_van_ban: null,
        co_quan_chu_quan: null,
        vb_ngay_ky: null,
        vb_co_quan_tieng_anh: null,
        vb_nguoi_ky: null,
        ho_chieu_ngoai_giao: null,
        ho_chieu_cong_vu: null,
        cong_ham: null,
        co_quan_chu_quan_thanh_vien: [],
        co_quan_chu_quan_thanh_vien_select: null,
        so_ho_chieu: null,
        ma_nhan_than: null,
        ho_ten: null,
        ngay_sinh: null,
        thang_sinh: null,
        nam_sing: null,
        gioi_tinh: null,
        noi_sinh: {},
        dictCollection: '',
        listNoiSinh: [],
        listNoiSinhNuocNgoai: [],
        listNoiSinhTrongNuoc: [],
        listNoiCapHoChieu: [],
        ho_khau: null,
        so_cmt: null,
        ngay_cap_cmt: null,
        noi_cap_cmt: null,
        co_quan_cong_tac: null,
        chuc_vu: null,
        dien_thoai: null,
        cong_chuc_loai: null,
        cong_chuc_bac: null,
        cong_chuc_ngach: null,
        can_bo_bo_nhiem: null,
        cap_bac_ham: null,
        so_ho_chieu_ngoai_giao: null,
        ngay_ho_chieu_ngoai_giao: null,
        noi_cap_ho_chieu: '',
        noi_cap_ho_chieu_ngoai_giao: null,
        so_ho_chieu_cong_vu: null,
        ngay_ho_chieu_cong_vu: null,
        noi_cap_ho_chieu_cong_vu: null,
        viaPostal: false,
        gia_dinh: [
            {
                gia_dinh: "1",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            },
            {
                gia_dinh: "2",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            },
            {
                gia_dinh: "3",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            },
            {
                gia_dinh: "4",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            },
            {
                gia_dinh: "4",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            },
            {
                gia_dinh: "4",
                ho_ten: '',
                nam_sinh: '',
                nghe_nghiep: '',
                dia_chi: ''
            }
        ],
        payment: {},
        auth: 'false',
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
            thonTinHoChieu: () => {
              let vm = this
              if (vm.saiSoHoChieu) {
                return 'Không tìm thấy thông tin hộ chiếu'
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
            },
            varChar15: (val) => {
                if(val){
                    val = String(val).trim()
                    return val.length <= 15 ? true : 'Không được nhập quá 15 ký tự'   
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
            vm.getDelegateCity()
            vm.getCoQuanChuQuan()
            vm.getNoiCapHoChieu()
            vm.getQuocGia()
            vm.getMucDich()
            vm.getLoaiVanBan()
            vm.getLoaiQuanHe()
            setTimeout(()=>{
                if(vm.formCode==='UPDATE'){
                    vm.getDetail()
                } else {                   
                    vm.dossiers['metaData'] = JSON.stringify({"newFormTemplate": "true", "dossierFileCustom": [], 'ma_to_khai': [], 'totalRecord': 0, 'delegateIdNo': '','delegateName': '','delegateTelNo': '', 'durationCountMeta': 4})
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
        active () {
            let vm = this
            vm.$refs.formNguoiDiCung.reset()
            vm.$refs.formThanNhan.reset()
            vm.$refs.formNguoiDiCung.resetValidation()
            vm.$refs.formThanNhan.resetValidation()
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
        dossierFileArr: {
            deep: true,
            handler:  (val, oldVal) => {
                let dataOut = val.filter(function (item) {
                    return item.formData || (!item.formData && item.fileEntryId)
                })
                $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
            }
        },
        dossierMarkArr: {
            deep: true,
            handler:  (val, oldVal) => {
                let arr = val.filter(e => e.recordCount) 
                arr.push({"dossierPartNo":"TP01","fileMark":3,"partName":"Tờ khai đề nghị cấp hộ chiếu ngoại giao, hộ chiếu công vụ và công hàm","partType":1,"fileCheck":0,"fileComment":"","recordCount":1})
                arr.push({"dossierPartNo":"TP02","fileMark":3,"partName":"Văn bản hoặc quyết định cử hoặc cho phép cán bộ, công chức, viên chức, sỹ quan, quân nhân chuyên nghiệp ra nước ngoài","partType":1,"fileCheck":0,"fileComment":"","recordCount":1})
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
        co_quan_chu_quan (val) {
            // this.vb_nguoi_ky = ''
            // this.getNguoiKyVB()
        },
        vb_nguoi_ky (val) {
            this.srcMauChuKy = ''
            this.ngayHetHieuLuc = ''
            if(val) {
                this.getImageCK(val)
                this.ngayHetHieuLuc = this.formatDate(val['ngayHL'].substr(0,10))
            }
        },
        dateNgayKy (val) {
            this.vb_ngay_ky = this.formatDate(this.dateNgayKy)
        },
        dateNgayCapHCNG(val) {
            this.ngay_ho_chieu_ngoai_giao = this.formatDate(this.dateNgayCapHCNG)
        },
        dateNgayCapHCCV(val) {
            this.ngay_ho_chieu_cong_vu = this.formatDate(this.dateNgayCapHCCV)
        },
        dateNgayCapCMND(val) {
            this.ngay_cap_cmt = this.formatDate(this.dateNgayCapCMND)
            this.changeNgayCapCMT()
        },
        birthday(val){
            this.birthdayFormated =  this.formatDate(this.birthday)
        },
        birthdayDiCung(val) {
            this.birthdayDiCungFormated = this.formatDate(this.birthdayDiCung)
        },
        birthdayThanNhan(val) {
            this.birthdayThanNhanFormated = this.formatDate(this.birthdayThanNhan)
        },
        hanHoChieu(val){
            this.hanHoChieuFormated =  this.formatDate(this.hanHoChieu)
        },
        dateNgayGuiVbNhanThan (val) {
            this.dateNgayGuiVbNhanThanFormated =  this.formatDate(this.dateNgayGuiVbNhanThan)
        },
        dateNgayDuKienNk (val) {
            this.dateNgayDuKienNkFormated =  this.formatDate(this.dateNgayDuKienNk)
        },
        dateNgayDuKienXk (val) {
            this.dateNgayDuKienXkFormated =  this.formatDate(this.dateNgayDuKienXk)
        },
        dateDueDate (val) {
            this.dateDueDateFormated = this.formatDate(this.dateDueDate)
            const [year, month, day] = this.dateDueDate.split('-')
            let date = new Date(this.dateDueDate + this.crurentHours)
            // date.setFullYear(parseInt(year), parseInt(month), parseInt(day))
            this.dossiers.dueDate = date.getTime()
        },
        searchApplicants (val) {
            let vm = this
            // if (vm.applicants.length > 0) return
            if (vm.isLoadingDelegateIdNo) return
            vm.isLoadingDelegateIdNo = true
            let config = {
                url: '/o/rest/v2/applicants?start=0&end=5&idNo=' + val,
                // headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.applicants = res.data.data
                vm.isLoadingDelegateIdNo = false
            }).catch(err => { vm.isLoadingDelegateIdNo = false})           

        },
        viaPostal(val) {
            if(val){
                this.dossiers.viaPostal = 2
            } else {
                this.dossiers.viaPostal = 1
            }
        },
        ho_chieu_cong_vu (val) {
            // if(val) {
            //     if(this.ho_chieu_ngoai_giao){
            //          this.ho_chieu_ngoai_giao = !this.ho_chieu_ngoai_giao 
            //     }
            // }
        },
        ho_chieu_ngoai_giao (val) {
            // if(val) {
            //     if(this.ho_chieu_cong_vu) {
            //         this.ho_chieu_cong_vu = !this.ho_chieu_cong_vu 
            //     }
            // }    
        },
        nuoc_di (val) {
            // this.cong_ham_so_nuoc = this.nuoc_di.length
            this.genLePhi()
        },
        ho_chieu_hong (val){
            this.genLePhi()
        },
        ho_chieu_gia_han(val){
            this.genLePhi()
        },
        ho_chieu_mat(val){
            this.genLePhi()
        },
        ho_chieu_ngoai_giao_moi(){
            this.genLePhi()
        },
        ho_chieu_cong_vu_moi(){
            this.genLePhi()
        },
        cong_ham_so_nuoc(){
            this.genLePhi()
        },
        cong_ham_schengen(){
            this.genLePhi()
        },
        cong_ham_nhap_canh(){
            this.genLePhi()
        },
        cong_ham_qua_canh(){
            this.genLePhi()
        },
        muc_dich(val) {
            if (val) {
                this.ky_hieu_thi_thuc = val
                this.ten_theo_muc_dich = val['itemName']
            }
        }
    },
    methods: {
        getDetail(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/'+vm.id,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                let metaData = JSON.parse(res.data.metaData)
                if(metaData.dossierFileCustom)
                {   
                    vm.dossierFileCustom = metaData.dossierFileCustom
                }
                if(metaData.ma_to_khai){
                    vm.eFormCodeArr = metaData.ma_to_khai
                }
                vm.dossiers = res.data
                vm.dossiers['bookingName'] = res.data['applicantName']
                vm.delegateCityCode = vm.dossiers.delegateCityCode
                vm.delegateDistrictCode = vm.dossiers.delegateDistrictCode
                vm.delegateWardCode = vm.dossiers.delegateWardCode
                vm.dateDueDate = vm.parseDate(vm.dossiers.dueDate.substr(0, 10))
                vm.crurentHours = vm.dossiers.dueDate.substring(10)
                vm.viaPostal = vm.dossiers.viaPostal === 2 ?  true : false
                vm.dossierFileCustom.forEach(e=>{
                    if(e.partNo !== 'TP01' && e.partNo !== 'TP02'){
                        vm.dossierFileArr.push(e)
                    }
                })
                vm.genLePhi()
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
                        if(data[i]['dossierPartNo'] === 'TP01'){
                            let formData = JSON.parse(data[i]['formData'])
                            vm.listThanhVien = formData.thanh_vien_doan
                        }
                        if(data[i]['dossierPartNo'] === 'TP02'){
                            let formData = JSON.parse(data[i]['formData'])
                            vm.listVanBan = formData.van_ban
                            vm.fillCheckBox()
                            vm.genSelectCQCQ()
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
        getLoaiVanBan () {
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/MOFA2_LOAI_VAN_BAN/dictitems?level=0&parent=0',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listLoaiVanBan = vm.sortArr(res.data.data, 'itemName')
            }).catch(err => {})
        },
        getLoaiQuanHe () {
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/MOFA2_QUAN_HE/dictitems?level=0&parent=0',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listLoaiQuanHe = vm.sortArr(res.data.data, 'itemName')
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
                        if((vm.dossierParts[i]['partNo'] === 'TP01' || vm.dossierParts[i]['partNo'] === 'TP02') && vm.dossierParts[i].partType === 1){
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
        getDataEform(){
            let vm = this
            let checkEformCode = vm.eFormCodeArr.find(e => e === vm.eFormCode)
            if(checkEformCode){
                vm.eFormCode = ''
                toastr.clear()
                toastr.error('Không hợp lệ. Mã tờ khai đã được lấy dữ liệu')
            } else {
                let config = {
                    url: '/o/rest/v2/serverconfigs/SERVER_EFORM_DATA_DVC/protocols/API_CONNECT?eFormNo=' + vm.eFormCode,
                    headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
                }
                axios.request(config).then(res => {
                    if(Object.keys(res.data).length !== 0 && res.data.constructor === Object){
                        vm.eFormCodeArr.push(vm.eFormCode)
                        let metaData = JSON.parse(vm.dossiers['metaData'])
                        metaData['ma_to_khai'].push(vm.eFormCode)
                        vm.dossiers['metaData'] = JSON.stringify(metaData)
                        vm.eFormCode = ''
                        if(res.data.auth){
                            vm.auth = res.data.auth
                        }
                        vm.viaPostal = res.data.viaPostal ? true : false
                        if(!vm.dossiers.delegateName){
                            if(res.data.delegateName) {
                                vm.dossiers.delegateName = res.data.ho_ten
                            }
                        }
                        if(!vm.dossiers.delegateIdNo){
                            if(res.data.delegateIdNo) {
                                 vm.dossiers.delegateIdNo = res.data.delegateIdNo
                            }
                        }
                        if(!vm.dossiers.delegateTelNo){
                            if(res.data.delegateTelNo) {
                                vm.dossiers.delegateTelNo = res.data.delegateTelNo
                            }
                        }
                        if(!vm.dossiers.delegateAddress){
                            if(res.data.delegateAddress ){
                                vm.dossiers.delegateAddress = res.data.delegateAddress.length < 100 ? res.data.delegateAddress : ''
                            } 
                        }
                        if(!vm.dossiers.delegateEmail){
                            if(res.data.delegateEmail ){
                                vm.dossiers.delegateEmail = res.data.delegateEmail
                            } 
                        }
                        if(!vm.dossiers.applicantName){
                            if(res.data.vb_co_quan_chu_quan) {
                                vm.dossiers.applicantName = res.data.vb_co_quan_chu_quan
                            }
                        }
                        if(!vm.dossiers.applicantIdNo){
                            if(res.data.applicantIdNo) {
                                vm.dossiers.applicantIdNo = res.data.applicantIdNo
                            }
                        }
                        if(!vm.dossiers.contactTelNo){
                            if(res.data.contactTelNo) {
                                vm.dossiers.contactTelNo = res.data.contactTelNo
                            }
                        }
                        if(!vm.dossiers.contactEmail){
                            if(res.data.contactEmail) {
                                vm.dossiers.contactEmail = res.data.contactEmail
                            }
                        }
                        if(!vm.dossiers.contactName){
                            if(res.data.contactName) {
                                vm.dossiers.contactName = res.data.contactName
                            }
                        }
                        if(!vm.dossiers.address){
                            if(res.data.address ){
                                vm.dossiers.address = res.data.address.length < 100 ? res.data.address : ''
                            } 
                        }
                        if(!vm.dossiers.bookingName){
                            if(res.data.vb_co_quan_chu_quan ){
                                vm.dossiers.bookingName = res.data.vb_co_quan_chu_quan
                            } 
                        }
                        vm.changeDossier()            
                        vm.fillDataEform(res.data)
                    } else {
                        vm.eFormCode = ''
                        toastr.clear()
                        toastr.error('Mã tờ khai không tìm thấy') 
                    }
                }).catch(err => {
                    vm.eFormCode = ''
                    toastr.clear()
                    toastr.error('Mã tờ khai không tìm thấy') 
                }) 
                // 
                let filterGetDetailEform = {
                  eFormNo: vm.eFormCode
                }
                vm.$store.dispatch('getThongTinToKhai', filterGetDetailEform).then(function (response) {
                  console.log('eformInfomation', response)
                  if (response && response.hasOwnProperty('eFormId') && response.hasOwnProperty('secret')) {
                      let filterGetFileEform = {
                          eFormId: response.eFormId,
                          secret: response.secret
                      }
                      vm.$store.dispatch('getFileToKhai', filterGetFileEform).then(function (responseFile) {
                          let partNoEform = response.fileTemplateNo.split('_')[0]
                          let fileEform = [{fileEntryId: responseFile ? responseFile : 0, partNo: partNoEform, eform: false, displayName: 'Tờ khai - ' +  response.eFormNo}]
                          vm.dossierFileArr = vm.dossierFileArr.concat(fileEform)
                      }).catch(function (reject) {
                      })
                  }
                }).catch({})
            }
        },
        fillDataEform (res) {
            let vm = this
            if(Object.keys(res).length !== 0 && res.constructor === Object){
                // vm.fillTableVanBan(res);
                vm.fillTableThanhVien(res);
            }
            
        },
        fillTableVanBan (res) {
            let vm = this
            if(res.vb_so_hieu_van_ban && res.vb_co_quan_chu_quan && res.vb_ma_co_quan_chu_quan)
            {
                let tg = {
                    vb_so_hieu_van_ban: res.vb_so_hieu_van_ban.toUpperCase(),
                    vb_co_quan_chu_quan: res.vb_co_quan_chu_quan,
                    vb_ma_co_quan_chu_quan: res.vb_ma_co_quan_chu_quan,
                    vb_ngay_ky: res.vb_ngay_ky,
                    vb_co_quan_tieng_anh: res.vb_co_quan_tieng_anh,
                    vb_nguoi_ky: '',
                    ho_ten_nguoi_ky: res.vb_nguoi_ky,
                    chuc_vu_nguoi_ky:''
                }
                let vanban = vm.listVanBan.find(e => e.vb_so_hieu_van_ban.toLowerCase() === tg.vb_so_hieu_van_ban.toLowerCase() && e.vb_ngay_ky === tg.vb_ngay_ky && e.vb_ma_co_quan_chu_quan === tg.vb_ma_co_quan_chu_quan )
                if (!vanban) {
                    vm.listVanBan.push(tg)
                    for (let i =0; i< vm.dossierFileArr.length; i++){
                        if(vm.dossierFileArr[i]['partNo'] === 'TP02' && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                            vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                            vm.dossierFileArr[i]['eform'] = 'true'
                        }
                    }
                    let dataOut = vm.dossierFileArr.filter(function (item) {
                        return item.formData || (!item.formData && item.fileEntryId)
                    })
                    $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
                    vm.genSelectCQCQ()
                }
            }

        },
        fillTableThanhVien (res) {
            let vm = this
            let tk = {
                kiem_tra: false,
                Id: null,
                Ca_Nhan_Id: null,
                Buoc_Xl: 'DA_NHAP_TO_KHAI',
                Ten: res.Ten,
                Ten_Kd: res.Ten,
                Ngay_Sinh: vm.dateDef(res.Ngay_Sinh),
                Ngay_Sinh_F: res.Ngay_Sinh,
                Def_Ngay_Sinh: 'D',
                Gioi_Tinh: res.Gioi_Tinh,
                Gioi_Tinh_Text: res.Gioi_Tinh === 'M' ? 'Nam' : 'Nữ',
                Quoc_Tich_Hn_Id: res.Quoc_Tich_Hn_Id,
                Quoc_Tich_Hn_Text: res.Quoc_Tich_Hn_Id_Text,
                Dc_Tam_Tru_Chi_Tiet: null,
                Dia_Chi_Thuong_Tru: null,
                So_Ho_Chieu: res.So_Ho_Chieu,
                Han_Hc: vm.dateDef(res.Han_Hc),
                Ma_To_Khai: vm.eFormCode,
                Loai_Ho_Chieu: res.Loai_Ho_Chieu,
                Noi_Cap_Hc_Id: res.Noi_Cap_Hc_Id,
                Noi_Cap_Hc_Id_Text: res.Noi_Cap_Hc_Id_Text,
                Quoc_Tich_Goc_Id: res.Quoc_Tich_Goc_Id,
                Quoc_Tich_Goc_Text: res.Quoc_Tich_Goc_Id_Text,
                Nghe_Nghiep_Id: res.Nghe_Nghiep_Id,
                Nghe_Nghiep: res.Nghe_Nghiep,
                Muc_Dich_Id: res.Muc_Dich_Id,
                Muc_Dich: res.Muc_Dich,
                Loai_TT: null,
                Xin_Gia_Tri_TT: res.Xin_Gia_Tri_TT,
                xin_ky_hieu_tt: null,
                Xin_Tt_Tu_Ngay: res.hasOwnProperty('Ngay_Dk_Nhap_Canh') && res.Ngay_Dk_Nhap_Canh ? vm.dateDef(res.Ngay_Dk_Nhap_Canh) : '',
                Xin_Tt_Den_Ngay: res.hasOwnProperty('Ngay_Dk_Xuat_Canh') && res.Ngay_Dk_Xuat_Canh ? vm.dateDef(res.Ngay_Dk_Xuat_Canh) : '',
                Co_Quan_De_Nghi_Ten: null,
                Co_Quan_De_Nghi_Id: null,
                Loai_Cv_Den: null,
                So_Cv_Den: null,
                Ngay_Cv_Den: null,
                De_Nghi_Khac: null,
                Du_Kien_Thu: null,
                Don_Vi_Tien_Te: '$',

                So_Dien_Thoai: null,
                So_Dien_Thoai_Cq: null,
                So_Luong_Hc: null,
                So_Luong_To_Khai: null,
                Giay_To_Kem_Theo: null,
                Noi_Hen_Tra_Kq_Id: null,
                Noi_Hen_Tra_Kq: null,
                Ngay_Hen_Tra: null,
                Ngay_Huy: null,
                Nguoi_Huy: null,
                Ly_Do_Huy: null,
                Ghi_Chu: null,
                Ngay_Tao: vm.dateDef(vm.currentDate()),
                Nguoi_Tao: window.themeDisplay.getUserName(),
                Ngay_Lap_Phieu: vm.dateDef(vm.currentDate()),
                Nguoi_Sua_Cuoi: null,
                Ngay_Sua_Cuoi: null,
                Nguoi_Nhan: null,
                Ngay_Nhan: null,
                Bl_Ten_Cq_Ca_Nhan: null,
                Bl_Dia_Chi_Id: null,
                Bl_Dia_Chi_Chi_Tiet: null,
                Bl_So_Dien_Thoai: null,
                Noi_Gui_Cv_Den: null,
                Noi_Dung_Tra_Loi: null,
                Ngay_Luu_Ho_So: null,
                Nguoi_Luu_Ho_So: null,
                So_Giay_Hen: null,
                Noi_Gui_Cv_Den_Id: null,
                Ten_Co_Quan: null,
                HsAnh: null,
                Loai_To_Khai: 'THI_THUC',
                Noi_Nop_Hs_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3',
                HsThiThucNoi:{
                    Id:null, 
                    Hs_Thi_Thuc_Id:null, 
                    Noi_Nhan_Thi_Thuc_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3', 
                    Hieu_Luc: 'Y', 
                    Ngay_Tao: vm.dateDef(vm.currentDate()),
                    Nguoi_Tao: window.themeDisplay.getUserName()
                },
                CaNhan: {
                    Id: null,
                    ca_nhan_goc_id: null,
                    noi_sinh: null,
                    Ten: null,
                    Ten_Kd: null,
                    Ngay_Sinh: null,
                    Def_Ngay_Sinh: 'D',
                    Gioi_Tinh: null,
                    Quoc_Tich_Hn_Id: null,
                    So_Ho_Chieu: null,
                    Quoc_Tich_Goc_Id: null,
                    Ngay_Tao: vm.dateDef(vm.currentDate()),
                    Nguoi_Tao: window.themeDisplay.getUserName()
                },
                // PhepNhapCanh: {
                //     PhepNhapCanhChiTiet: [
                //         {
                //             Id: null,
                //             Phep_Nhap_Canh_Id: null,
                //             Ten: null,
                //             Ten_Kd: null,
                //             Ngay_Sinh: null,
                //             Def_Ngay_Sinh: 'D',
                //             Quoc_Tich_Id: null,
                //             So_Ho_Chieu: null,
                //             Duoc_Nc_Tu_Ngay: null,
                //             Duoc_Nc_Den_Ngay: null,
                //             Gia_Tri_Tt: null,
                //             Ngay_Tao: vm.dateDef(vm.currentDate()),
                //             Nguoi_Tao: window.themeDisplay.getUserName(),
                //             Muc_Dich_Id: null,
                //             Ky_Hieu_Tt: null,
                //             Hs_Thi_Thuc_Id: null,
                //             So_Fax: null,
                //             Ngay_Fax: null,
                //             Co_Quan_De_Nghi_Ten: window.themeDisplay.getScopeGroupId() == "124302" ? 'Cục lãnh sự' : 'Sở ngoại vụ thành phố Hồ Chí Minh',
                //             Co_Quan_De_Nghi_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3',
                //             Don_Vi_Nhan_Phep_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3'
                //         }
                //     ],
                //     Id: null,
                //     So_Fax: null,
                //     Ngay_Fax: null,
                //     Ma_So_Khach: null,
                //     Don_Vi_Cap_Phep_Id: null,
                //     Ngay_Tao: vm.dateDef(vm.currentDate()),
                //     Nguoi_Tao: window.themeDisplay.getUserName(),
                //     Trang_Thai: null,
                //     Co_Quan_De_Nghi_Ten: null,
                //     Co_Quan_De_Nghi_Id: null,
                //     Nguoi_Ky: null,
                //     Chuc_Vu: null
                // },
                PhepNhapCanh: null,
                HsThanNhan: [],
                HsTreEmDiCung: []
            }
            console.log('thanhvien', tk)
            
            vm.listThanhVien.push(tk)
            vm.so_nguoi = vm.listThanhVien.length
            // Day  formData vao dossierFileArr 
            for (let i =0; i< vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] === 'TP01'  && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                    vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien})
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            let dataOut = vm.dossierFileArr.filter(function (item) {
                return item.formData || (!item.formData && item.fileEntryId)
            })
            $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
            vm.genLePhi()
            
        },
        getQuocGia(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/MOFA2_QUOC_GIA/dictitems',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNuocDi = vm.sortArr(res.data.data, 'itemName') 
            }).catch(err => {})  
        },
        getMucDich(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/MOFA2_MUC_DICH/dictitems',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listMucDich = vm.sortArr(res.data.data, 'itemName')
                vm.listKyHieu = vm.sortArr(res.data.data, 'itemDescription')
            }).catch(err => {})  
        },
        getCoQuanChuQuan(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_CQQC/protocols/API_CONNECT?cqTen=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listCoQuanChuQuan = vm.sortArr(res.data.data, 'CQTen') 

            }).catch(err => {})       
        },
        getNguoiKyVB(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_NGUOI_KY/protocols/API_CONNECT?cqId='+vm.co_quan_chu_quan.CQID,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listVanBanNguoiKy = vm.sortArr(res.data.data, 'NguoiKy')
            }).catch(err => {}) 

        },
        getNoiSinh(dictCollection){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_DIA_DANH/protocols/API_CONNECT?loai='+dictCollection+'&ten=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNoiSinh = vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})
        },
        getNoiSinhNuocNgoai(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_DIA_DANH/protocols/API_CONNECT?loai=quoc_gia&ten=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNoiSinhNuocNgoai = vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})
        },
        getNoiSinhTrongNuoc(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_DIA_DANH/protocols/API_CONNECT?loai=tinh_thanh&ten=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNoiSinhTrongNuoc = vm.sortArr(res.data.data, 'TEN')
            }).catch(err => {})
        },
        getNoiCapHoChieu(){
            let vm = this
            let config = {
                url: '/o/rest/v2/dictcollections/MOFA2_QUOC_GIA/dictitems',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNoiCapHoChieu = vm.sortArr(res.data.data, 'itemName')
            }).catch(err => {})
        },
        updateCQCQ(){
            let vm = this
            if (this.$refs.formVanBan.validate()) {
                let tg = {
                    So_Cong_Van: vm.so_van_ban,
                    Cq_Ca_Nhan_Cong_Van: vm.co_quan_chu_quan.CQTen,
                    Ma_Cq_Ca_Nhan_Cong_Van: vm.co_quan_chu_quan.CQID.toString(),
                    Ngay_Cong_Van: vm.vb_ngay_ky,
                    Loai_Cong_Van: vm.loaiVanBan ? vm.loaiVanBan.itemName : '',
                    Ma_Loai_Cong_Van: vm.loaiVanBan ? vm.loaiVanBan.itemCode : ''
                }
                if(vm.update_cqcq === 'add'){
                    vm.listVanBan.push(tg)
                    vm.checkVanBan.push(tg)
                } else {
                    vm.$set(vm.listVanBan, vm.update_cqcq, tg)
                    vm.$set(vm.checkVanBan, vm.update_cqcq, tg) 
                }
                // vm.changeCheckCKCD()
                vm.genSelectCQCQ()
                
                for (let i =0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === 'TP02' && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                let dataOut = vm.dossierFileArr.filter(function (item) {
                    return item.formData || (!item.formData && item.fileEntryId)
                })
                $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
                vm.dialogThemVanBan = false
            } else {
                toastr.clear()
                toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
            }
        },
        editThanNhan (item, index) {
            let vm = this
            vm.update_than_nhan = index
            if (vm.listLoaiQuanHe) {
                vm.loai_quan_he = vm.listLoaiQuanHe.filter(function (itemList) {
                    return itemList.itemCode ==  item.Qhgd_Id
                })[0]
            }
            if (vm.listNuocDi) {
                vm.quoc_tich_than_nhan = vm.listNuocDi.filter(function (itemList) {
                    return itemList.itemCode ==  item.Quoc_Tich_Id
                })[0]
            }
            vm.ho_ten_than_nhan = item.Ten
            vm.birthdayThanNhanFormated = item.Ngay_Sinh
            vm.dia_chi_thuong_tru_than_nhan = item.Dia_Chi_Thuong_Tru
        },
        deleteThanNhan (item, index) {
            let vm = this
            vm.listThanNhan.splice(index, 1)
            if (vm.update_than_nhan !== 'add') {
                vm.$refs.formThanNhan.reset()
                vm.$refs.formThanNhan.resetValidation()
                vm.update_than_nhan = 'add'
            }
        },
        updateThanNhan () {
            let vm = this
            if (vm.$refs.formThanNhan.validate()) {
                let tg = {
                    Qhgd_Id: vm.loai_quan_he ? vm.loai_quan_he['itemCode'] : null,
                    Qhgd_Text: vm.loai_quan_he ? vm.loai_quan_he['itemName'] : null,
                    Ten: vm.ho_ten_than_nhan ? vm.ho_ten_than_nhan : null,
                    Ten_Kd: vm.ho_ten_than_nhan ? vm.ho_ten_than_nhan : null,
                    Ngay_Sinh: vm.birthdayThanNhanFormated ?  vm.birthdayThanNhanFormated : null,
                    Quoc_Tich_Id: vm.quoc_tich_than_nhan ? vm.quoc_tich_than_nhan.itemCode : null,
                    Quoc_Tich_Text: vm.quoc_tich_than_nhan ? vm.quoc_tich_than_nhan.itemName : null,
                    Dia_Chi_Thuong_Tru: vm.dia_chi_thuong_tru_than_nhan ? vm.dia_chi_thuong_tru_than_nhan : null,
                    Id: null,
                    Hs_Thi_Thuc_Id: null,
                    Ngay_Tao: vm.dateDef(vm.currentDate()),
                    Nguoi_Tao: window.themeDisplay.getUserName()
                }
                if(vm.update_than_nhan === 'add'){
                    vm.listThanNhan.push(tg)
                } else {
                    vm.$set(vm.listThanNhan, vm.update_than_nhan, tg)
                }
            } else {
                toastr.clear()
                toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
            }
        },
        editNguoiDiCung (item, index) {
            let vm = this
            vm.update_di_cung = index
            if (vm.listLoaiQuanHe) {
                vm.loai_quan_he = vm.listLoaiQuanHe.filter(function (itemList) {
                    return itemList.itemCode ==  item.Qhgd_Id
                })[0]
            }
            if (vm.listNuocDi) {
                vm.quoc_tich_di_cung = vm.listNuocDi.filter(function (itemList) {
                    return itemList.itemCode ==  item.Quoc_Tich_Id
                })[0]
            }
            vm.ho_ten_di_cung = item.Ten
            vm.birthdayDiCungFormated = item.Ngay_Sinh
            vm.so_ho_chieu_di_cung = item.So_Ho_Chieu
        },
        deleteNguoiDiCung (item, index) {
            let vm = this
            vm.listNguoiDiCung.splice(index,1)
            if (vm.update_di_cung !== 'add') {
                vm.$refs.formNguoiDiCung.reset()
                vm.$refs.formNguoiDiCung.resetValidation()
                vm.update_di_cung = 'add'
            }
        },
        updateNguoiDiCung () {
            let vm = this
            if (vm.$refs.formNguoiDiCung.validate()) {
                let tg = {
                    Qhgd_Id: vm.loai_quan_he? vm.loai_quan_he['itemCode'] : null,
                    Qhgd_Text: vm.loai_quan_he ? vm.loai_quan_he['itemName'] : null,
                    Ten: vm.ho_ten_di_cung ? vm.ho_ten_di_cung : null,
                    Ten_Kd: vm.ho_ten_di_cung ? vm.ho_ten_di_cung : null,
                    Ngay_Sinh: vm.birthdayDiCungFormated ? vm.birthdayDiCungFormated : null,
                    Quoc_Tich_Id: vm.quoc_tich_di_cung ? vm.quoc_tich_di_cung.itemCode : null,
                    Quoc_Tich_Text: vm.quoc_tich_di_cung ? vm.quoc_tich_di_cung.itemName : null,
                    So_Ho_Chieu: vm.so_ho_chieu_di_cung ? vm.so_ho_chieu_di_cung : null,
                    Id: null,
                    Hs_Thi_Thuc_Id: null,
                    Ngay_Tao: vm.dateDef(vm.currentDate()),
                    Nguoi_Tao: window.themeDisplay.getUserName()
                }
                if(vm.update_di_cung === 'add'){
                    vm.listNguoiDiCung.push(tg)
                } else {
                    vm.$set(vm.listNguoiDiCung, vm.update_di_cung, tg)
                }
                
            } else {
                toastr.clear()
                toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
            }
        },
        cancelAction (target) {
            let vm = this
            if (target === 'than_nhan') {
                vm.$refs.formThanNhan.reset()
                vm.$refs.formThanNhan.resetValidation()
                vm.update_than_nhan = 'add'
            }
            if (target === 'nguoi_di_cung') {
                vm.$refs.formNguoiDiCung.reset()
                vm.$refs.formNguoiDiCung.resetValidation()
                vm.update_di_cung = 'add'
            }
        },
        updateThanhVien(){
            let vm = this
            if(vm.$refs.formThanhVien.validate()){
                let thanNhan = vm.listThanNhan.map(item => {
                    item['Ngay_Sinh'] = vm.dateDef(item.Ngay_Sinh)
                    item['Def_Ngay_Sinh'] = 'D'
                    return item
                })
                let danhSachDiCung = vm.listNguoiDiCung.map(item => {
                    item['Ngay_Sinh'] = vm.dateDef(item.Ngay_Sinh)
                    item['Def_Ngay_Sinh'] = 'D'
                    return item
                })
                let tk = {
                    kiem_tra: false,
                    Id: null,
                    Ca_Nhan_Id: null,
                    Buoc_Xl: 'DA_NHAP_TO_KHAI',
                    Ten: vm.ho_ten.toUpperCase(),
                    Ten_Kd: vm.ho_ten.toUpperCase(),
                    Ngay_Sinh: vm.dateDef(vm.birthdayFormated),
                    Ngay_Sinh_F: vm.birthdayFormated,
                    Def_Ngay_Sinh: 'D',
                    Gioi_Tinh: vm.gioi_tinh['value'],
                    Gioi_Tinh_Text: vm.gioi_tinh['name'],
                    Quoc_Tich_Hn_Id: vm.quoc_tich_hien_nay ? vm.quoc_tich_hien_nay['itemCode'] : null,
                    Quoc_Tich_Hn_Text: vm.quoc_tich_hien_nay ? vm.quoc_tich_hien_nay['itemName'] : null,
                    Dc_Tam_Tru_Chi_Tiet: vm.dia_chi_viet_nam ? vm.dia_chi_viet_nam : null,
                    Dia_Chi_Thuong_Tru: vm.dia_chi_nuoc_ngoai ? vm.dia_chi_nuoc_ngoai : null,
                    So_Ho_Chieu: vm.so_ho_chieu,
                    Han_Hc: vm.dateDef(vm.hanHoChieuFormated),
                    Ma_To_Khai: vm.eformCodeThanhVienEdit ? vm.eformCodeThanhVienEdit : (new Date()).getTime(),
                    Loai_Ho_Chieu: vm.loai_ho_chieu ? vm.loai_ho_chieu['value'] : null,
                    Noi_Cap_Hc_Id: vm.noi_cap_ho_chieu ? vm.noi_cap_ho_chieu['itemCode'] : null,
                    Noi_Cap_Hc_Id_Text: vm.noi_cap_ho_chieu ? vm.noi_cap_ho_chieu['itemName'] : null,
                    Quoc_Tich_Goc_Id: vm.quoc_tich_goc ? vm.quoc_tich_goc['itemCode'] : null,
                    Quoc_Tich_Goc_Text: vm.quoc_tich_goc ? vm.quoc_tich_goc['itemName'] : null,
                    Nghe_Nghiep_Id: null,
                    Nghe_Nghiep: vm.nghe_nghiep,
                    Muc_Dich_Id: vm.muc_dich ? vm.muc_dich['itemCode'] : null,
                    Muc_Dich: vm.muc_dich ? vm.muc_dich['itemName'] : null,
                    Loai_TT: vm.loai_thi_thuc ? vm.loai_thi_thuc['value'] : null,
                    Xin_Gia_Tri_TT: vm.so_lan_thi_thuc ? vm.so_lan_thi_thuc['value'] : null,
                    xin_ky_hieu_tt: vm.ky_hieu_thi_thuc ? vm.ky_hieu_thi_thuc['itemDescription'] : null,
                    Xin_Tt_Tu_Ngay: vm.dateDef(vm.dateNgayDuKienNkFormated),
                    Xin_Tt_Den_Ngay: vm.dateDef(vm.dateNgayDuKienXkFormated),
                    Co_Quan_De_Nghi_Ten: vm.vb_co_quan_chu_quan['Cq_Ca_Nhan_Cong_Van'],
                    Co_Quan_De_Nghi_Id: vm.vb_co_quan_chu_quan['Ma_Cq_Ca_Nhan_Cong_Van'],
                    Loai_Cv_Den: vm.vb_co_quan_chu_quan['Ma_Loai_Cong_Van'],
                    So_Cv_Den: vm.vb_co_quan_chu_quan['So_Cong_Van'],
                    Ngay_Cv_Den: vm.dateDef(vm.vb_co_quan_chu_quan['Ngay_Cong_Van']),
                    De_Nghi_Khac: vm.de_nghi_khac,
                    Du_Kien_Thu: null,
                    Don_Vi_Tien_Te: '$',

                    So_Dien_Thoai: null,
                    So_Dien_Thoai_Cq: null,
                    So_Luong_Hc: null,
                    So_Luong_To_Khai: null,
                    Giay_To_Kem_Theo: null,
                    Noi_Hen_Tra_Kq_Id: null,
                    Noi_Hen_Tra_Kq: null,
                    Ngay_Hen_Tra: null,
                    Ngay_Huy: null,
                    Nguoi_Huy: null,
                    Ly_Do_Huy: null,
                    Ghi_Chu: null,
                    Ngay_Tao: vm.dateDef(vm.currentDate()),
                    Nguoi_Tao: window.themeDisplay.getUserName(),
                    Ngay_Lap_Phieu: vm.dateDef(vm.currentDate()),
                    Nguoi_Sua_Cuoi: null,
                    Ngay_Sua_Cuoi: null,
                    Nguoi_Nhan: null,
                    Ngay_Nhan: null,
                    Bl_Ten_Cq_Ca_Nhan: null,
                    Bl_Dia_Chi_Id: null,
                    Bl_Dia_Chi_Chi_Tiet: null,
                    Bl_So_Dien_Thoai: null,
                    Noi_Gui_Cv_Den: null,
                    Noi_Dung_Tra_Loi: null,
                    Ngay_Luu_Ho_So: null,
                    Nguoi_Luu_Ho_So: null,
                    So_Giay_Hen: null,
                    Noi_Gui_Cv_Den_Id: null,
                    Ten_Co_Quan: null,
                    HsAnh: null,
                    Loai_To_Khai: 'THI_THUC',
                    Noi_Nop_Hs_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3',
                    HsThiThucNoi:{
                        Id:null, 
                        Hs_Thi_Thuc_Id:null, 
                        Noi_Nhan_Thi_Thuc_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3', 
                        Hieu_Luc: 'Y', 
                        Ngay_Tao: vm.dateDef(vm.currentDate()),
                        Nguoi_Tao: window.themeDisplay.getUserName()
                    },
                    CaNhan: {
                        Id: null,
                        ca_nhan_goc_id: null,
                        noi_sinh: null,
                        Ten: vm.ho_ten.toUpperCase(),
                        Ten_Kd: vm.ho_ten.toUpperCase(),
                        Ngay_Sinh: vm.dateDef(vm.birthdayFormated),
                        Def_Ngay_Sinh: 'D',
                        Gioi_Tinh: vm.gioi_tinh['value'],
                        Quoc_Tich_Hn_Id: vm.quoc_tich_hien_nay ? vm.quoc_tich_hien_nay['itemCode'] : null,
                        So_Ho_Chieu: vm.so_ho_chieu,
                        Quoc_Tich_Goc_Id: vm.quoc_tich_goc ? vm.quoc_tich_goc['itemCode'] : null,
                        Ngay_Tao: vm.dateDef(vm.currentDate()),
                        Nguoi_Tao: window.themeDisplay.getUserName()
                    },
                    // PhepNhapCanh: {
                    //     PhepNhapCanhChiTiet: [
                    //         {
                    //             Id: null,
                    //             Phep_Nhap_Canh_Id: null,
                    //             Ten: null,
                    //             Ten_Kd: null,
                    //             Ngay_Sinh: null,
                    //             Def_Ngay_Sinh: 'D',
                    //             Quoc_Tich_Id: null,
                    //             So_Ho_Chieu: null,
                    //             Duoc_Nc_Tu_Ngay: vm.dateDef(vm.dateNgayDuKienNkFormated),
                    //             Duoc_Nc_Den_Ngay: vm.dateDef(vm.dateNgayDuKienXkFormated),
                    //             Gia_Tri_Tt: vm.so_lan_thi_thuc['value'],
                    //             Ngay_Tao: vm.dateDef(vm.currentDate()),
                    //             Nguoi_Tao: window.themeDisplay.getUserName(),
                    //             Muc_Dich_Id: vm.muc_dich ? vm.muc_dich['itemCode'] :null,
                    //             Ky_Hieu_Tt: vm.ky_hieu_thi_thuc ? vm.ky_hieu_thi_thuc['itemDescription'] : null,
                    //             Hs_Thi_Thuc_Id: null,
                    //             So_Fax: null,
                    //             Ngay_Fax: null,
                    //             Co_Quan_De_Nghi_Ten: window.themeDisplay.getScopeGroupId() == "124302" ? 'Cục lãnh sự' : 'Sở ngoại vụ thành phố Hồ Chí Minh',
                    //             Co_Quan_De_Nghi_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3',
                    //             Don_Vi_Nhan_Phep_Id: window.themeDisplay.getScopeGroupId() == "124302" ? '2' : '3'
                    //         }
                    //     ],
                    //     Id: null,
                    //     So_Fax: null,
                    //     Ngay_Fax: null,
                    //     Ma_So_Khach: null,
                    //     Don_Vi_Cap_Phep_Id: null,
                    //     Ngay_Tao: vm.dateDef(vm.currentDate()),
                    //     Nguoi_Tao: window.themeDisplay.getUserName(),
                    //     Trang_Thai: null,
                    //     Co_Quan_De_Nghi_Ten: null,
                    //     Co_Quan_De_Nghi_Id: null,
                    //     Nguoi_Ky: null,
                    //     Chuc_Vu: null
                    // },
                    PhepNhapCanh: null,
                    HsThanNhan: thanNhan,
                    HsTreEmDiCung: danhSachDiCung
                }

                if(vm.update_thanhvien === 'add'){
                    vm.listThanhVien.push(tk)
                } else {
                   vm.$set(vm.listThanhVien, vm.update_thanhvien, tk)
                }
                vm.so_nguoi = vm.listThanhVien.length
                for (let i=0; i<vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] == 'TP01' && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien })
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                let dataOut = vm.dossierFileArr.filter(function (item) {
                    return item.formData || (!item.formData && item.fileEntryId)
                })
                $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
                vm.genLePhi()
                vm.dialogThemThanhVien = false
            } else {
                toastr.clear()
                toastr.error('Vui lòng nhập đầy đủ thông tin nhân thân và hộ chiếu')
            }
        },
        closeThemThanhVien () {
            let vm = this
            if (vm.update_thanhvien !== 'add') {
                let x = confirm('Bạn có muốn lưu thông tin sửa đổi?')
                if (x) {
                    vm.updateThanhVien()
                } else {
                    vm.dialogThemThanhVien = false
                }
            } else {
                vm.dialogThemThanhVien = false
            }
        },
        openDialogThemVanBan(){
            this.update_cqcq = 'add'
            this.dialogThemVanBan = true
            this.srcMauChuKy = ''
            this.ngayHetHieuLuc = ''
            this.$refs.formVanBan.reset()
        },
        openDialogThemThanhVien(){
            let vm = this
            vm.active = 'tab-1'
            vm.update_thanhvien = 'add'
            vm.update_di_cung = 'add'
            vm.update_than_nhan = 'add'
            vm.dictCollection = 'tinh_thanh'
            // vm.getNoiSinh(vm.dictCollection)
            vm.dialogThemThanhVien = true
            vm.$refs.formThanhVien.reset()
            vm.$refs.formThanhVien.resetValidation()
            vm.$refs.formNguoiDiCung.reset()
            vm.$refs.formThanNhan.reset()
            vm.$refs.formNguoiDiCung.resetValidation()
            vm.$refs.formThanNhan.resetValidation()
        },
        openDialogUpdateVanBan(index,item){
            let vm = this
            vm.update_cqcq = index
            // vm.vb_so_hieu_van_ban = item.vb_so_hieu_van_ban
            // vm.co_quan_chu_quan =vm.listCoQuanChuQuan.find(e=>e.CQTen === item.vb_co_quan_chu_quan) 
            // vm.vb_ngay_ky = item.vb_ngay_ky
            // vm.vb_co_quan_tieng_anh = item.vb_co_quan_tieng_anh
            // setTimeout(()=>{
            //     vm.vb_nguoi_ky = vm.listVanBanNguoiKy.find( e=> e.ID === item.vb_nguoi_ky)
            // }, 1000)
            // vm.dialogThemVanBan = true

            vm.so_van_ban = item.So_Cong_Van
            vm.co_quan_chu_quan =vm.listCoQuanChuQuan.find(e=>e.CQID == item.Ma_Cq_Ca_Nhan_Cong_Van) 
            vm.vb_ngay_ky = item.Ngay_Cong_Van
            vm.van_ban_de_nghi = vm.listVanBanDeNghi.find(e=>e.ID == item.Ma_Loai_Cong_Van)
            // setTimeout(()=>{
            //     vm.vb_nguoi_ky = vm.listVanBanDeNghi.find( e=> e.ID === item.vb_nguoi_ky)
            // }, 1000)
            vm.dialogThemVanBan = true
        },
        openDialogUpdateThanhVien (index,item) {
            let vm = this
            vm.update_thanhvien = index
            vm.update_di_cung = 'add'
            vm.update_than_nhan = 'add'
            vm.dialogThemThanhVien = true
            
            vm.ho_ten = item.Ten
            vm.birthdayFormated = item.Ngay_Sinh_F
            vm.gioi_tinh = item.Gioi_Tinh ? vm.listGioiTinh.filter(function (itemSelect) {
                return itemSelect.value == item.Gioi_Tinh
            })[0] : ''
            vm.quoc_tich_hien_nay = item.Quoc_Tich_Hn_Id ? vm.listNuocDi.filter(function (itemSelect) {
                return itemSelect.itemCode == item.Quoc_Tich_Hn_Id
            })[0] : ''
            vm.dia_chi_viet_nam = item.Dc_Tam_Tru_Chi_Tiet
            vm.dia_chi_nuoc_ngoai = item.Dia_Chi_Thuong_Tru
            vm.so_ho_chieu = item.So_Ho_Chieu
            vm.loai_ho_chieu = item.Loai_Ho_Chieu ? vm.listLoaiHoChieu.filter(function (itemSelect) {
                return itemSelect.value == item.Loai_Ho_Chieu
            })[0] : ''
            vm.noi_cap_ho_chieu = item.Noi_Cap_Hc_Id ? vm.listNoiCapHoChieu.filter(function (itemSelect) {
                return itemSelect.itemCode == item.Noi_Cap_Hc_Id
            })[0] : ''
            vm.quoc_tich_goc = item.Quoc_Tich_Goc_Id ? vm.listNuocDi.filter(function (itemSelect) {
                return itemSelect.itemCode == item.Quoc_Tich_Goc_Id
            })[0] : ''
            vm.nghe_nghiep = item.Nghe_Nghiep
            vm.muc_dich = item.Muc_Dich_Id ? vm.listMucDich.filter(function (itemSelect) {
                return itemSelect.itemCode == item.Muc_Dich_Id
            })[0] : ''
            vm.loai_thi_thuc = item.Loai_TT ? vm.listLoaiThiThuc.filter(function (itemSelect) {
                return itemSelect.value == item.Loai_TT
            })[0] : ''
            vm.so_lan_thi_thuc = item.Xin_Gia_Tri_TT ? vm.listSoLanThiThuc.filter(function (itemSelect) {
                return itemSelect.value == item.Xin_Gia_Tri_TT
            })[0] : ''
            vm.ky_hieu_thi_thuc = item.xin_ky_hieu_tt ? vm.listKyHieu.filter(function (itemSelect) {
                return itemSelect.itemDescription == item.xin_ky_hieu_tt
            })[0] : ''
            if (!vm.ky_hieu_thi_thuc) {
                vm.ky_hieu_thi_thuc = vm.muc_dich
            }
            vm.hanHoChieuFormated = vm.dateDefReverd(item.Han_Hc)
            vm.dateNgayDuKienNkFormated = vm.dateDefReverd(item.Xin_Tt_Tu_Ngay)
            vm.dateNgayDuKienXkFormated = vm.dateDefReverd(item.Xin_Tt_Den_Ngay)
            vm.vb_co_quan_chu_quan = vm.listVanBan.filter(function (itemSelect) {
                return itemSelect.Ma_Cq_Ca_Nhan_Cong_Van == item.Co_Quan_De_Nghi_Id && itemSelect.So_Cong_Van == item.So_Cv_Den
            })[0]
            vm.de_nghi_khac = item.De_Nghi_Khac
            vm.listThanNhan = item.HsThanNhan && item.HsThanNhan.length > 0 ? item.HsThanNhan.map(item => {
                item['Ngay_Sinh'] = vm.dateDefReverd(item.Ngay_Sinh)
                return item
            }) : []
            vm.listNguoiDiCung = item.HsTreEmDiCung && item.HsTreEmDiCung.length > 0 ? item.HsTreEmDiCung.map(item => {
                item['Ngay_Sinh'] = vm.dateDefReverd(item.Ngay_Sinh)
                return item
            }) : []
            vm.eformCodeThanhVienEdit = item.Ma_To_Khai
        },
        genSelectCQCQ(){
            let vm = this
            vm.co_quan_chu_quan_thanh_vien = []
            vm.listVanBan.forEach(e=> {
                vm.co_quan_chu_quan_thanh_vien.push(
                    {
                        name: e.vb_so_hieu_van_ban + '-'+ e.vb_ngay_ky + '-' + e.vb_co_quan_chu_quan,
                        value: e.vb_so_hieu_van_ban + '-'+ e.vb_ngay_ky + '-' + e.vb_co_quan_chu_quan,
                        vb_ma_co_quan_chu_quan: e.vb_ma_co_quan_chu_quan,
                        vb_co_quan_chu_quan: e.vb_co_quan_chu_quan,
                        vb_so_hieu_van_ban: e.vb_so_hieu_van_ban,
                        vb_ngay_ky: e.vb_ngay_ky,
                        vb_co_quan_tieng_anh: e.vb_co_quan_tieng_anh,
                        vb_nguoi_ky: e.vb_nguoi_ky,
                        ho_ten_nguoi_ky: e.ho_ten_nguoi_ky,
                        chuc_vu_nguoi_ky: e.chuc_vu_nguoi_ky
                    }
                )
            })
        },
        deleteThanhVien(index){
            let vm = this
            vm.listThanhVien.splice(index,1)
            for (let i =0; i< vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] === 'TP01' && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                    vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien})
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            vm.so_nguoi = vm.listThanhVien.length
            let dataOut = vm.dossierFileArr.filter(function (item) {
                return item.formData || (!item.formData && item.fileEntryId)
            })
            $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
        },
        deleteVanBan(index){
            let vm = this
            vm.listVanBan.splice(index,1)
            for (let i =0; i< vm.dossierFileArr.length; i++){
                if(vm.dossierFileArr[i]['partNo'] === 'TP02' && !vm.dossierFileArr[i].hasOwnProperty('fileEntryId') && !vm.dossierFileArr[i]['fileEntryId']){
                    vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            // 
            vm.dossierFileArr = vm.dossierFileArr.filter(function (item) {
                return !item.hasOwnProperty('fileEntryId')
            })
            // 
            let dataOut = vm.dossierFileArr.filter(function (item) {
                return item.formData || (!item.formData && item.fileEntryId)
            })
            $('#dossierFileArr_hidden').val(JSON.stringify(dataOut))
            this.genSelectCQCQ()
        },
        genLePhi(){
            let vm = this
            let hcng_moi = vm.ho_chieu_ngoai_giao_moi != '' ? parseInt(vm.ho_chieu_ngoai_giao_moi) : 0
            let hccv_moi = vm.ho_chieu_cong_vu_moi != '' ? parseInt(vm.ho_chieu_cong_vu_moi) : 0
            let hc_gh = vm.ho_chieu_gia_han != '' ? parseInt(vm.ho_chieu_gia_han) : 0
            let hc_hong = vm.ho_chieu_hong != '' ? parseInt(vm.ho_chieu_hong) : 0
            let hc_mat = vm.ho_chieu_mat != '' ? parseInt(vm.ho_chieu_mat) : 0
            for(let i=0;i<vm.nuoc_di.length;i++){

            }
            // let so_nuoc = vm.cong_ham_so_nuoc != '' ? parseInt(vm.cong_ham_so_nuoc) : 0
            let so_nuoc = vm.soNuocKhongDuocMien
            let so_schengen = vm.cong_ham_schengen != '' ? parseInt(vm.cong_ham_schengen) : 0
            let so_nhap_canh = vm.cong_ham_nhap_canh != '' ? parseInt(vm.cong_ham_nhap_canh) : 0
            let so_qua_canh = vm.cong_ham_qua_canh != '' ? parseInt(vm.cong_ham_qua_canh) : 0
            
            let giaLePhiMoi = 160000
            if(vm.serviceCode === 'BNG-270820'){
                giaLePhiMoi = 80000
            }
            let lp_moi = (hcng_moi + hccv_moi)*giaLePhiMoi;
            let lp_gia_han = hc_gh * 80000;
            let lp_hong = (hc_hong + hc_mat) * 320000;
            let lp_schengen = so_schengen * 10000;
            let lp_nhap = so_nuoc * so_nhap_canh * 10000;
            let lp_qua = so_nuoc * so_qua_canh * 10000;
            let so_cong_ham = so_schengen + so_nhap_canh + so_qua_canh
            let lp_cong_ham = lp_schengen + lp_nhap + lp_qua
            
            let le_phi = lp_moi + lp_gia_han + lp_hong + lp_schengen + lp_nhap + lp_qua;
            
            let file_payment2 = new Array();
            file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu cấp mới', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hcng_moi + hccv_moi), 'trang_thai': 1, 'don_gia': vm.serviceCode === 'BNG-270820' ? 80000 : 160000, 'thanh_tien': lp_moi};
            file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Gia hạn hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu gia hạn', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': hc_gh, 'trang_thai': 1, 'don_gia': 80000, 'thanh_tien': lp_gia_han};
            file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ (mất, hỏng)', 'partName': 'Hộ chiếu hỏng', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hc_hong + hc_mat), 'trang_thai': 1, 'don_gia': 320000, 'thanh_tien': lp_hong};
            file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp công hàm đề nghị cấp thị thực', 'partName': 'Công hàm', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': so_cong_ham, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_cong_ham};

            // if(lp_moi > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu cấp mới', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hcng_moi + hccv_moi), 'trang_thai': 1, 'don_gia': vm.serviceCode === 'BNG-270820' ? 80000 : 160000, 'thanh_tien': lp_moi};
            // if(lp_gia_han > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Gia hạn hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu gia hạn', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': hc_gh, 'trang_thai': 1, 'don_gia': 100000, 'thanh_tien': lp_gia_han};
            
            // if(lp_hong > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ (mất, hỏng)', 'partName': 'Hộ chiếu hỏng', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hc_hong + hc_mat), 'trang_thai': 1, 'don_gia': 320000, 'thanh_tien': lp_hong};
                  
            // if (lp_cong_ham > 0 ){
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp công hàm đề nghị cấp thị thực', 'partName': 'Công hàm', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': so_cong_ham, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_cong_ham};
            // }
            if(file_payment2.length === 2)
            {
                file_payment2[file_payment2.length] = {'partNo': 'empty','serviceName': 'empty', 'partName': 'empty', 'fileMark': 'empty', 'fileMarkName': 'empty', 'recordCount': 'empty', 'trang_thai': 'empty', 'don_gia': 'empty', 'thanh_tien': 'empty'}; 
                file_payment2[file_payment2.length] = {'partNo': 'empty','serviceName': 'empty', 'partName': 'empty', 'fileMark': 'empty', 'fileMarkName': 'empty', 'recordCount': 'empty', 'trang_thai': 'empty', 'don_gia': 'empty', 'thanh_tien': 'empty'};   
            }
            if(file_payment2.length === 3)
            {
                file_payment2[file_payment2.length] = {'partNo': 'empty','serviceName': 'empty', 'partName': 'empty', 'fileMark': 'empty', 'fileMarkName': 'empty', 'recordCount': 'empty', 'trang_thai': 'empty', 'don_gia': 'empty', 'thanh_tien': 'empty'}; 
            }
            if(le_phi != '' && le_phi != null)
                vm.le_phi_format = le_phi.toString()
           
            let nuoc_id = vm.nuoc_di.join()
            let nuoc_di = ''
            vm.nuoc_di.forEach((e)=>{
                let nc = vm.listNuocDi.find(item=>item.itemCode === e)
                if(nc){
                    if(nuoc_di){
                        nuoc_di+=', ' + nc.itemName
                    } else {
                       nuoc_di+= nc.itemName
                    }
                    
                }     
            });
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount":le_phi,"serviceAmount":0,"shipAmount":0}
            console.log(vm.dossiers['metaData'] , typeof vm.dossiers['metaData'])   
            let hs = JSON.parse(vm.dossiers['metaData']);
            hs['dossierFilePayment'] = file_payment2
            vm.dossiers['metaData'] = JSON.stringify(hs)
            
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
        genDueDate () {
            let vm = this
            let config = {
                url: '/o/rest/v2/dossiers/'+ 4 +'/calculate/duedate',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.dossiers['durationCount'] = 4
                let dateString =  res.data.substr(0, 10)
                vm.crurentHours = res.data.substr(10)
                vm.dateDueDate = vm.parseDate(dateString)
                let metaData = JSON.parse(vm.dossiers['metaData'])
                metaData['durationCountMeta'] = 4
                vm.dossiers['metaData'] = JSON.stringify(metaData)
            }).catch(err => {})  
        },
        kiemTraHoChieu (autorun) {
            let vm = this
            if (vm.so_ho_chieu) {
                let data = {}
                data['ktHoChieu'] = 1
                data['soHC'] = vm.so_ho_chieu.trim()
                data['soPhep'] = ''
                let config = {
                    method: 'get',
                    url: '/o/rest/v2/mofa2/KTHochieu',
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'groupId' : Liferay.ThemeDisplay.getScopeGroupId()
                    },
                    params: data
                };
                axios.request(config).then(res => {
                    let dataHoChieu
                    try {
                        let dataJson = JSON.parse(res.data.data)[0]
                        dataHoChieu = dataJson['SoHc'] === vm.so_ho_chieu.trim() ? dataJson : ''
                    } catch (error) {
                    }
                    if(dataHoChieu) {
                        vm.saiSoHoChieu = false
                        let [year, month, day] = dataHoChieu.NgaySinh.substr(0, 10).split('-')
                        vm.birthdayFormated = `${day}/${month}/${year}`
                        vm.ho_ten = dataHoChieu['HoTen']
                        vm.noi_cap_ho_chieu = vm.listNoiCapHoChieu.filter(function(item) {
                            return item.itemCode == dataHoChieu['QuocTichId']
                        })[0]
                    } else {
                        vm.saiSoHoChieu = true
                        toastr.clear()
                        if (!autorun) {
                            toastr.error('Không tìm thấy thông tin hộ chiếu số: ' + vm.so_ho_chieu)
                        }
                    }
                }).catch(err => {
                    if (!autorun) {
                        toastr.error('Kiểm tra thông tin thực hiện thất bại')}
                    }
                ) 
            } else {
                toastr.error('Vui lòng nhập số hộ chiếu')
            }
        },
        chonThanhVien(item){
            let vm = this
            let tg = item
            if(isNaN(tg['NoiSinh'])){
                vm.dictCollection = 'quoc_gia'
            } else {
                vm.dictCollection = 'tinh_thanh'
            }

            vm.getNoiSinh(vm.dictCollection)
            setTimeout(()=>{
                vm.noi_sinh = vm.listNoiSinh.find(e=>e.ID===tg['NoiSinh'])
            },1000)
            vm.so_ho_chieu = tg['SoSeri']
            vm.ho_ten = tg['HoTen']
            vm.ho_khau = tg['NoiThuongTru']
            vm.so_cmt = tg['SoGCM']
            if(tg['GioiTinh'] == true)
                vm.gioi_tinh = 'Nam';
            else
                vm.gioi_tinh = 'Nữ'
            vm.chuc_vu = tg['ChucVuCaNhan']
            vm.co_quan_cong_tac = tg['NoilamViec']
            vm.dien_thoai= tg['NoiDangO']
            let ngay = new Date(tg['NgaySinh']);
            vm.ngay_sinh = ngay.getDate()
            vm.thang_sinh = ngay.getMonth() + 1
            vm.nam_sinh = ngay.getFullYear()
            vm.birthday = vm.parseDate(vm.ngay_sinh+'/'+vm.thang_sinh+'/'+vm.nam_sinh)
            vm.ma_nhan_than = tg['NguoiID']
            vm.gia_dinh = [{"gia_dinh": "1","ho_ten": tg['HoTenBo']},{"gia_dinh": "2", "ho_ten": tg['HoTenMe']},{"gia_dinh": "3", "ho_ten": tg['HoTenV_C']},{"gia_dinh": "4"},{"gia_dinh": "4"},{"gia_dinh": "4"}]
            vm.dialogDanhSach = false

        },
        getNoiKhac(){
            this.dictCollection = this.dictCollection === 'tinh_thanh' ? 'quoc_gia' : 'tinh_thanh'
            this.getNoiSinh(this.dictCollection)
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
        checkCongHam (event) {
            let vm = this
            if(event){
                if(vm.ho_chieu_ngoai_giao || vm.ho_chieu_cong_vu){
                    vm.cong_ham = vm.cong_ham
                } else {
                    toastr.clear()
                    toastr.error('Bắt buộc phải chọn hộ chiếu ngoại giao hoặc hộ chiếu công vụ')
                    vm.cong_ham = !vm.cong_ham
                }
            }
        },
        chooseAplicant (event) {
            let vm = this
            let applicant = vm.applicants.find(e=>e.applicantIdNo === event)
            vm.dossiers.delegateName = applicant.applicantName.toUpperCase()
            vm.dossiers.delegateTelNo = applicant.contactTelNo
            vm.dossiers.delegateEmail = applicant.contactEmail
            vm.delegateCityCode =  applicant.cityCode
            vm.delegateDistrictCode = applicant.districtCode
            vm.delegateWardCode = applicant.wardCode
        },
        sortArr (arr, key) {
          return arr.sort((a, b) => a[key].localeCompare(b[key]))
        },
        onSearchItemSelected (item) {
            var vm = this
            vm.selectedSearchItem = item
            // let value = vm.selectedSearchItem['applicantIdNo'].toString()
            // let pattern1 = /^(([0-9]{9,9}))$/
            // let pattern2 = /^(([0-9]{12,12}))$/
            // if(pattern1.test(value) || pattern2.test(value)){
                vm.checkCMT = false
                vm.dossiers['delegateIdNo'] = vm.selectedSearchItem['applicantIdNo']
                vm.dossiers['delegateName'] = vm.selectedSearchItem['applicantName']
                vm.dossiers['delegateTelNo'] = vm.selectedSearchItem['contactTelNo']
               // vm.dossiers['contactTelNo'] = vm.selectedSearchItem['contactTelNo']
                vm.dossiers['delegateEmail'] = vm.selectedSearchItem['contactEmail']
               // vm.dossiers['contactEmail'] = vm.selectedSearchItem['contactEmail']
                
                vm.delegateCityCode = vm.selectedSearchItem['cityCode']
                vm.delegateDistrictCode = vm.selectedSearchItem['districtCode']
                vm.delegateWardCode = vm.selectedSearchItem['wardCode']
                vm.changeDossier()
            // } else {
            //     vm.checkCMT = true
            //     vm.messengeCMT = 'Số CMND gồm 9 hoặc 12 ký tự 0-9'  
            // }

        },
        onInputChange (query) {
            let vm = this
            // let pattern1 = /^(([0-9]{9,9}))$/
            // let pattern2 = /^(([0-9]{12,12}))$/
            // if(pattern1.test(query) || pattern2.test(query)){
            //     vm.checkCMT = false
            // } else {
            //     vm.checkCMT = true
            //     vm.messengeCMT = 'Số CMND gồm 9 hoặc 12 ký tự 0-9'  
            // }
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
                        vm.changeDossier()
                    } else {
                        vm.changeDossier()
                    }
                        resolve(items)
                    })
                })
            })
        },
        soHoChieuNgoaiGiaoChange () {
            let vm = this
            let value = vm.so_ho_chieu_ngoai_giao
            let regex = /^([A-Z])\d{7}$/;
              if (!regex.test(value)) {
                vm.so_ho_chieu_ngoai_giao = ''
              }
        },
        soHoChieuCongVuChange () {
            let vm = this
            let value = vm.so_ho_chieu_cong_vu
            let regex = /^([A-Z])\d{7}$/;
              if (!regex.test(value)) {
                vm.so_ho_chieu_cong_vu = ''
              }       
        },
        calculateYear(date) { 
            var ageDifMs = Date.now() - date;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        },
        changeNgayCapCMT(){
            let vm = this
            let date = new Date(vm.dateNgayCapCMND)
            if(vm.calculateYear(date) >= 15 ) {
                vm.errorNgayCapCMT = true
                vm.ngay_cap_cmt = ''
            } else {
                vm.errorNgayCapCMT = false
            }

        },
        checkCMND(){
            // let vm = this
            // let value = vm.so_cmt
            // if(value){
            //     if (value.length === 9) {
            //         const pattern = /^(([0-9]{9,9}))$/
            //         if (!pattern.test(value)) vm.so_cmt = ''
            //     } else {
            //         const pattern = /^(([0-9]{12,12}))$/
            //         if(!pattern.test(value)) vm.so_cmt = ''
            //     }
            // }
        },
        changeAdress(){
            let vm = this
            if(vm.dossiers.delegateAddress.length > 100){
                vm.dossiers.delegateAddress = ''
                vm.dossiers.address = ''
            } else {
                vm.dossiers.address = vm.dossiers.delegateAddress
            }
            

        },
        changeCheckCKCD(){
            let vm = this
            if((vm.listVanBan.length === vm.checkVanBan.length ) && vm.listVanBan.length > 0){
                vm.$emit('changeCheckCKCD', true)
            } else {
                vm.$emit('changeCheckCKCD', false)
            } 
        },
        fillCheckBox(){
            let vm = this
            vm.checkVanBan = []
            for(let i = 0; i< vm.listVanBan.length ; i++){
                if(vm.listVanBan[i]['vb_nguoi_ky'] && vm.listVanBan[i]['ho_ten_nguoi_ky'] ){
                    vm.checkVanBan.push(vm.listVanBan[i])
                }
            }
            vm.changeCheckCKCD()
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
        changeNgayKy(){
            let vm = this
            vm.changeDate('vb_ngay_ky')
            vm.dateNgayKy = vm.parseDate(vm.vb_ngay_ky)
        },
        inputNgayKy(){
            let vm = this
            vm.inputDate('vb_ngay_ky')
        },
        changeHanHoChieu () {
            let vm = this
            vm.changeDate('hanHoChieuFormated')
            vm.hanHoChieu = vm.parseDate(vm.hanHoChieuFormated)
        },
        inputHanHoChieu(){
            let vm = this
            vm.inputDate('hanHoChieuFormated')
        },
        changeNgayGuiVbNhanThan () {
            let vm = this
            vm.changeDate('dateNgayGuiVbNhanThanFormated')
            vm.dateNgayGuiVbNhanThan = vm.parseDate(vm.dateNgayGuiVbNhanThanFormated)
        },
        inputNgayGuiVbNhanThan(){
            let vm = this
            vm.inputDate('dateNgayGuiVbNhanThanFormated')
        },
        changeNgayDuKienNk () {
            let vm = this
            vm.changeDate('dateNgayDuKienNkFormated')
            vm.dateNgayDuKienNk = vm.parseDate(vm.dateNgayDuKienNkFormated)
        },
        inputNgayDuKienNk(){
            let vm = this
            vm.inputDate('dateNgayDuKienNkFormated')
        },
        changeNgayDuKienXk () {
            let vm = this
            vm.changeDate('dateNgayDuKienXkFormated')
            vm.dateNgayDuKienXk = vm.parseDate(vm.dateNgayDuKienXkFormated)
        },
        inputNgayDuKienXk(){
            let vm = this
            vm.inputDate('dateNgayDuKienXkFormated')
        },
        changeNgaySinh(){
            let vm = this
            vm.changeDate('birthdayFormated')
            vm.birthday = vm.parseDate(vm.birthdayFormated)
        },
        inputNgaySinh(){
            let vm = this
            vm.inputDate('birthdayFormated')
        },
        changeNgaySinhThanNhan(){
            let vm = this
            vm.changeDate('birthdayThanNhanFormated')
            vm.birthdayThanNhan = vm.parseDate(vm.birthdayThanNhanFormated)
        },
        inputNgaySinhThanNhan(){
            let vm = this
            vm.inputDate('birthdayThanNhanFormated')
        },
        changeNgaySinhDiCung(){
            let vm = this
            vm.changeDate('birthdayDiCungFormated')
            vm.birthdayDiCung = vm.parseDate(vm.birthdayDiCungFormated)
        },
        inputNgaySinhDiCung(){
            let vm = this
            vm.inputDate('birthdayDiCungFormated')
        },
        changeDate(key){
            let vm = this 
            let dateString = vm[key];
            if (dateString) {
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
                            if(key==="birthdayFormated" || key==="birthdayThanNhanFormated" || key==="birthdayDiCungFormated"){
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
            }
            
        },
        validateDate(str){
            if (str) {
                return str.replace(/[^\d\/]/g, "");
            }
        },
        inputDate (key) {
            let vm = this
            let gt = vm.validateDate(vm[key]);
            if (gt) {
                if (gt.match(/^\d{2}$/) !== null) {
                    vm[key] = gt + '/'
                } else if (gt.match(/^\d{2}\/\d{2}$/) !== null) {
                    vm[key] = gt + '/'
                }else
                    vm[key] = gt
            }
        },
        changLePhi(){
            let vm = this
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount": parseInt(vm.le_phi_format),"serviceAmount":0,"shipAmount":0}
        },
        getImageCK(item){
            let vm = this
            if(item.ImgFile){
                let config = {
                    url: '/o/rest/v2/serverconfigs/HCTN_GET_IMAGE/protocols/API_CONNECT?imageName=' + item.ImgFile,
                    headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
                }
                axios.request(config).then(res => {
                    vm.srcMauChuKy = 'data:image/png;base64,'+ res.data.imageBase64
                }).catch(err => {})
            }
            
        },
        changeDossier(){
            let vm = this
            console.log(vm.dossiers)
            let metaData = JSON.parse(vm.dossiers.metaData)
            console.log(metaData)
            metaData['delegateIdNo']= vm.dossiers.delegateIdNo
            metaData['delegateName']=vm.dossiers.delegateName
            metaData['delegateTelNo']=vm.dossiers.delegateTelNo
            if( vm.auth === "false") {
                vm.dossiers['contactTelNo'] = vm.dossiers['delegateTelNo']
                vm.dossiers['contactEmail'] = vm.dossiers['delegateEmail']
                vm.dossiers['contactName'] = vm.dossiers['delegateName']
                vm.dossiers['applicantIdNo'] = vm.dossiers['delegateIdNo']
                vm.dossiers['applicantName'] = vm.dossiers['bookingName']
                vm.dossiers['address'] = vm.dossiers['delegateAddress']
                vm.dossiers['cityCode'] = vm.dossiers['delegateCityCode']
                vm.dossiers['districtCode'] = vm.dossiers['delegateDistrictCode']
                vm.dossiers['wardCode'] = vm.dossiers['delegateWardCode']
                vm.dossiers['contactTelNo'] = vm.dossiers['delegateTelNo']
                vm.dossiers['contactEmail'] = vm.dossiers['delegateEmail']
            }
            vm.dossiers['applicantName'] = vm.dossiers['bookingName']
            vm.dossiers['metaData'] = JSON.stringify(metaData)
            $('#dossiers_hidden').val(JSON.stringify(vm.dossiers))
        },
        toggleKT(index, item){
            let vm = this
            vm.$set(vm.listThanhVien, index, item)
        },
        changeSoHieuChieu () {
            let vm = this
            if (vm.functionTimeOut) {
                clearTimeout(vm.functionTimeOut)
            }
            vm.functionTimeOut = setTimeout(function () {
                if (vm.so_ho_chieu.length >= 3) {
                    vm.kiemTraHoChieu('autorun')
                }
            }, 1000)
        },
        dateDef (date) {
            if (date) {
                const [day, month, year] = date.split('/')
                return `${month}/${day}/${year}`
            } else {
                return ''
            }
        },
        dateDefReverd (date) {
            if (date) {
                const [month, day, year] = date.split('/')
                return `${day}/${month}/${year}`
            } else {
                return ''
            }
        },
        currentDate () {
            let value = new Date()
            return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
        },
        getMinMax (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month}-${day}`
        }
    }
}
</script>