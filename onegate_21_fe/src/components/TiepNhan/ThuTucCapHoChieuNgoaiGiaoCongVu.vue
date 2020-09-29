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
                    <!-- <v-text-field
                        v-model="dossiers.delegateIdNo"
                        :rules="[rules.credit]"
                        required
                        solo
                    ></v-text-field> -->
                    <!-- <v-autocomplete
                        v-model="dossiers.delegateIdNo"
                        :items="applicants"
                        :loading="isLoadingDelegateIdNo"
                        :search-input.sync="searchApplicants"
                        @change="chooseAplicant($event)"
                        hide-no-data
                        hide-selected
                        item-text="applicantIdNo"
                        item-value="applicantIdNo"
                        solo
                        :rules="[rules.credit]"
                    >

                    </v-autocomplete> -->
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
                        :rules="[rules.varchar50]"
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
                        <v-btn small color="primary" @click="getDataEform()" class="ml-2">Lấy dữ liệu</v-btn>
                    </div>
                </v-flex>
                <v-flex xs12 class="px-2 ">
                    <div style="display:flex; flex-wrap: wrap; align-items: center;">
                        <strong>Thông tin văn bản (Quyết định) cử đi nước ngoài <span class="red--text">*</span> </strong>
                        <v-btn small color="primary" @click.stop="openDialogThemVanBan()">Thêm văn bản</v-btn>
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
                            <td>          
                                <v-checkbox
                                    v-model="checkVanBan"
                                    primary
                                    hide-details
                                    :value="props.item"
                                ></v-checkbox>
                            </td>
                            <td>{{props.item.vb_so_hieu_van_ban}}</td>
                            <td>{{props.item.vb_ngay_ky}}</td>
                            <td>{{props.item.vb_co_quan_chu_quan}}</td>
                            <td>{{props.item.ho_ten_nguoi_ky}}</td>
                            <td>
                                <v-btn flat icon color="primary" @click="openDialogUpdateVanBan(props.index,props.item)">
                                    <v-icon>create</v-icon>
                                </v-btn>
                            </td>
                            <td>
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
                        <v-btn small color="primary" @click.stop="openDialogThemThanhVien()">Thêm thành viên</v-btn>
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
                            <td>{{props.index + 1}}</td>
                            <td>{{props.item.ho_ten}}</td>
                            <td>{{props.item.so_cmt}}</td>
                            <td>{{props.item.ngay_sinh}}/{{props.item.thang_sinh}}/{{props.item.nam_sinh}}</td>
                            <td>{{props.item.noi_sinh_text}}</td>
                            <td>{{props.item.vb_so_hieu_van_ban}} - {{props.item.vb_ngay_ky}} - {{props.item.co_quan_chu_quan_text}}</td>
                            <td>
                                <v-btn flat icon color="primary" @click="openDialogUpdateThanhVien(props.index,props.item)">
                                    <v-icon>create</v-icon>
                                </v-btn>
                            </td>
                            <td>
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
                <v-flex xs12 sm4  class="px-2">
                    <label for="">Số người <span class="red--text">*</span></label>
                    <v-text-field
                        v-model="so_nguoi"
                        solo
                        type="number"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm8  class="px-2 ">
                    <label for="">Nước đi <span class="red--text"></span></label>
                    <v-autocomplete
                        :items="listNuocDi"
                        v-model="nuoc_di"
                        item-text="TEN"
                        item-value="ID"
                        clearable
                        hide-no-data
                        multiple

                        solo
                    ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm4  class="px-2 my-2">
                    <label>Hộ chiếu cũ</label>
                    <div style="display:flex; flex-wrap: wrap; align-items: center;">
                        <div>
                            <v-text-field
                                v-model="ho_chieu_ngoai_giao_cu"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Ngoại giao)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="ho_chieu_cong_vu_cu"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Công vụ)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="ho_chieu_pho_thong_cu"
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>
                            <label for="">(Phổ thông)</label>
                        </div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4  class="px-2 my-2">
                    <label>Hộ chiếu cấp mới</label>
                    <div style="display:flex; flex-wrap: wrap;align-items: center;">
                        <div>
                            <v-text-field
                                v-model="ho_chieu_ngoai_giao_moi"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Ngoại giao)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="ho_chieu_cong_vu_moi"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Công vụ)</label>
                        </div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4  class="px-2 my-2">
                    <label>Hộ chiếu</label>
                    <div style="display:flex; flex-wrap: wrap;align-items: center;">
                        <div>
                            <v-text-field
                                v-model="ho_chieu_gia_han"
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>
                            <label for="">(Gia hạn)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="ho_chieu_hong"
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>  
                            <label for="">(Hỏng)</label>                         
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="ho_chieu_mat"
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>
                            <label for="">(Mất)</label>
                        </div>

                    </div>
                </v-flex>
                <v-flex xs12 class="px-2 my-2">
                    <label>Công hàm</label>
                    <div style="display:flex; flex-wrap: wrap;align-items: center;">
                        <div>
                            <v-text-field
                                v-model="cong_ham_so_nuoc"
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>
                            <label for="">(Số nước xin)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="cong_ham_so_nguoi"  
                                style="width: 100px;"
                                solo
                                type="number"
                            ></v-text-field>
                            <label for="">(Số người xin CH)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="cong_ham_nhap_canh"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Nhập cảnh)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="cong_ham_qua_canh"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Quá cảnh)</label>
                        </div>
                        <div class="ml-2">
                            <v-text-field
                                v-model="cong_ham_schengen"
                                class="mx-2"
                                style="width: 100px;"
                                solo
                                type="number"
                                
                            ></v-text-field>
                            <label for="">(Schengen)</label>
                        </div>
                    </div>
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
                            :rules="[rules.required, rules.checkDateFuture]"
                            
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
        <!-- Dialog thêm văn bản -->
        <v-dialog
            v-model="dialogThemVanBan"
            max-width="800px"
            persistent
        >
            <v-card>
                <v-card-title
                    class="headline lighten-2"
                    primary-title
                    style="display: flex;justify-content: space-between;"
                >
                    Thông tin văn bản cử đi nước ngoài
                    <v-btn color="#115ebe" fab small dark  @click="dialogThemVanBan = false">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="form_vuejs">
                    <v-form ref="formVanBan" lazy-validation>
                        <v-layout wrap>
                            <v-flex xs6 class="px-2">
                                <v-layout wrap>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Quyết định cử/cho phép đi nước ngoài số <span class="red--text">*</span></label>
                                        <v-text-field
                                            v-model="vb_so_hieu_van_ban"
                                            :rules="[rules.required]"
                                            required
                                            solo
                                            @input="vb_so_hieu_van_ban = vb_so_hieu_van_ban.toUpperCase()"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
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
                                            <v-date-picker v-model="dateNgayKy" no-title @input="menu = false" locale="vi"></v-date-picker>
                                        </v-menu>
                                        <!-- <v-text-field
                                            v-model="vb_ngay_ky"
                                            label="Ngày ký"
                                            :rules="rules"
                                            required
                                        ></v-text-field> -->
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Cơ quan chủ quản <span class="red--text">*</span></label>
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
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Cơ quan chủ quản(tiếng Anh)</label>
                                        <v-text-field
                                            v-model="vb_co_quan_tieng_anh"
                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Người ký Văn bản/Quyết định <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="listVanBanNguoiKy"
                                            v-model="vb_nguoi_ky"
                                            item-text="NguoiKy"
                                            item-value="NguoiKy"
                                            clearable
                                            :rules="[rules.required]"
                                            required
                                            hide-no-data
                                            solo
                                            return-object
                                        >
                                            <template slot="selection" slot-scope="{ item, selected }">
                                                {{item.NguoiKy}}- {{item.ChucVu}}
                                            </template>
                                            <template slot="item" slot-scope="{ item, tile }">{{item.NguoiKy}} -{{item.ChucVu}}</template>
                                        </v-autocomplete>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6 class="px-2">
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <label>Mẫu chữ ký</label>
                                    </v-flex>
                                    <v-flex xs12>
                                        <div v-if="srcMauChuKy">
                                            <img :src="srcMauChuKy" style="width: 200px;height: 200px;" alt="">
                                        </div>
                                        <p v-else><span>Không có chữ ký</span></p>
                                        <p><span>Ngày hết hiệu lực: {{ngayHetHieuLuc}}</span></p>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="text-xs-right">
                                <v-btn small color="primary" @click="updateCQCQ()">Cập nhập</v-btn>
                                <v-btn small color="primary" @click="dialogThemVanBan=false">Đóng</v-btn>
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
            <v-card>
                <v-card-title
                    class="headline lighten-2"
                    primary-title
                    style="display: flex;justify-content: space-between;"
                >
                    Thông tin thành viên
                    <v-btn color="#115ebe" fab small dark  @click="dialogThemThanhVien = false">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="form_vuejs">
                    <v-form ref="formThanhVien" lazy-validation>
                        <v-layout wrap>
                            <v-flex xs12 class="px-2">
                                <v-layout wrap>
                                    <v-flex xs12 class="px-2 my-2">
                                        <div style="display: flex;">
                                    
                                            <v-checkbox
                                                v-model="ho_chieu_ngoai_giao"
                                                label="CẤP HỘ CHIẾU NGOẠI GIAO"
                                                required
                                            >
                                            </v-checkbox>
                                    
                                            <v-checkbox
                                                v-model="ho_chieu_cong_vu"
                                                label="CẤP HỘ CHIẾU CÔNG VỤ"
                                                required
                                                >
                                            </v-checkbox>
                                    
                                            <!-- <v-checkbox
                                                v-model="cong_ham"
                                                label="CẤP CÔNG HÀM XIN THỊ THỰC"
                                                @change="checkCongHam($event)"
                                                >
                                            </v-checkbox> -->
                                            <v-checkbox
                                                v-model="cong_ham"
                                                label="CẤP CÔNG HÀM XIN THỊ THỰC"
                                           
                                                >
                                            </v-checkbox>                                           
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">Văn bản cử đi nước ngoài <span class="red--text">*</span></label>
                                        <v-autocomplete
                                            :items="co_quan_chu_quan_thanh_vien"
                                            v-model="co_quan_chu_quan_thanh_vien_select"
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
                                        <label for="">Số hộ chiếu</label>
                                        <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                            <v-text-field
                                                v-model="so_ho_chieu"
                                                solo
                                            ></v-text-field>
                                            <v-btn small color="primary" @click="getThongTinNhanThan()">Kiểm tra thông tin</v-btn>
                                        </div>  
                                    </v-flex>
                                    <v-flex xs12  sm6 class="px-2 my-2">
                                        <label for="">Mã nhân thân</label>
                                        <v-text-field
                                            v-model="ma_nhan_than"
                                            solo
                                            readonly
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">1. Họ và tên (Chữ in viết hoa) <span class="red--text">*</span></label>
                                        <v-text-field
                                            v-model="ho_ten"
                                            :rules="[rules.required]"
                                            required
                                            solo
                                            @input="ho_ten= ho_ten.toUpperCase()"
                                        ></v-text-field>
                                    </v-flex>
                                    <!-- <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">2. Sinh ngày </label>
                                        <v-text-field
                                            type="number"
                                            v-model="ngay_sinh"

                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Tháng sinh</label>
                                        <v-text-field
                                            type="number"
                                            v-model="thang_sinh"
                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Năm sinh <span class="red--text">*</span></label>
                                        <v-text-field
                                            type="number"
                                            v-model="nam_sinh"
                                            :rules="[rules.required,rules.checkYear]"
                                            required
                                            solo
                                        ></v-text-field>
                                    </v-flex> -->
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">2.Ngày sinh</label>
                                        <v-text-field
                                            slot="activator"
                                            v-model="birthdayFormated"
                                            persistent-hint
                                            append-icon="event"
                                            hint="DD/MM/YYYY"
                                            @change="changeNgaySinh()"
                                            @input="inputNgaySinh()"
                                            :rules="[rules.required, rules.checkDatePast]"
                                            
                                        ></v-text-field>
                                        <!-- <v-menu
                                            ref="menu6"
                                            :close-on-content-click="false"
                                            v-model="menu6"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                    

                                
                                            <v-date-picker v-model="birthday" no-title @input="menu6 = false" locale="vi"></v-date-picker>
                                        </v-menu> -->
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                            <label for="">3. Giới tính <span class="red--text">*</span></label>
                                                <v-autocomplete
                                                    :items="listGioiTinh"
                                                    v-model="gioi_tinh"
                                                    item-text="name"
                                                    item-value="value"
                                                    clearable
                                                    hide-no-data
                                                    :rules="[rules.required]"
                                                    required
                                                    solo                  
                                                ></v-autocomplete>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">4. Nơi sinh <span class="red--text">*</span></label>
                                        <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                            <v-autocomplete
                                                :items="listNoiSinh"
                                                v-model="noi_sinh"
                                                item-text="TEN"
                                                item-value="ID"
                                                clearable
                                                hide-no-data
                                                :rules="[rules.required]"
                                                required
                                                solo
                                                return-object
                                            ></v-autocomplete>
                                            <v-btn small color="primary" @click="getNoiKhac()">Nơi khác</v-btn>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <span><i>Chọn nơi sinh từ danh sách tỉnh thành. Trong trường hợp nơi sinh là nước ngoài, nhấp "Nơi khác" và chọn nước tương ứng trong danh sách.</i></span>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">5. Hộ khẩu thường trú </label>
                                        <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                            <v-text-field
                                                v-model="ho_khau"

                                                solo
                                            ></v-text-field>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">6. Giấy CMND/Thẻ CCCD số </label>
                                        <div style="display:flex; flex-wrap: wrap;align-items: center;">
                                            <v-text-field
                                                v-model="so_cmt"
                                              
                                                solo
                                                @change="checkCMND()"
                                            ></v-text-field>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <!-- <v-text-field
                                            v-model="ngay_cap_cmt"
                                            label="Cấp ngày"
                                            :rules="rules"
                                            required
                                        ></v-text-field> -->
                                        <label for="">Ngày cấp </label>
                                        <v-menu
                                            ref="menu2"
                                            :close-on-content-click="false"
                                            v-model="menu2"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <v-text-field
                                                slot="activator"
                                                v-model="ngay_cap_cmt"
                                                hint="DD/MM/YYYY"
                                                persistent-hint
                                                append-icon="event"
                                                @change="dateNgayCapCMND = parseDate(ngay_cap_cmt)"

                                                solo
                                            ></v-text-field>
                                            <v-date-picker v-model="dateNgayCapCMND" no-title @input="menu2 = false" locale="vi"></v-date-picker>
                                        </v-menu>
                                        <span v-if="errorNgayCapCMT" class="red--text">Ngày cấp đã quá hạn</span>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Tại </label>
                                        <v-text-field
                                            v-model="noi_cap_cmt"

                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">7.Cơ quan công tác  </label>
                                        <v-text-field
                                            v-model="co_quan_cong_tac"

                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">8.Chức vụ</label>
                                        <v-text-field
                                            v-model="chuc_vu"
                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">Điện thoại</label>
                                        <v-text-field
                                            v-model="dien_thoai"
                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <label for="">a. Công chức/viên chức quản lý</label>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Loại</label>
                                        <v-text-field
                                            v-model="cong_chuc_loai"
                                            solo
                                        ></v-text-field>                                       
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Bậc</label>
                                        <v-text-field
                                            v-model="cong_chuc_bac"
                                            
                                            solo
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Ngạch</label>
                                        <v-text-field
                                            v-model="cong_chuc_ngach"
                                            
                                            solo
                                        ></v-text-field>
                                    </v-flex>

                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">b. Cán bộ (bầu cử, phê chuẩn, bổ nhiệm):</label>
                                        <v-text-field
                                            v-model="can_bo_bo_nhiem"
                                            solo
                                        ></v-text-field>                                      
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label for="">c. Cấp bậc,hàm(lực lượng vũ trang): </label>
                                        <v-text-field
                                            v-model="cap_bac_ham"
                                            solo
                                        ></v-text-field>                                      
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label for="">9. Đã được cấp hộ chiếu ngoại giao số</label>
                                        <v-text-field
                                            v-model="so_ho_chieu_ngoai_giao"
                                            solo
                                            placeholder="Gồm 1 chữ cái và 7 số"
                                            @change="soHoChieuNgoaiGiaoChange()"
                                        ></v-text-field>                                      
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Cấp ngày</label>
                                        <v-menu
                                            ref="menu3"
                                            :close-on-content-click="false"
                                            v-model="menu3"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <v-text-field
                                                slot="activator"
                                                v-model="ngay_ho_chieu_ngoai_giao"
                                                persistent-hint
                                                hint="DD/MM/YYYY"
                                                append-icon="event"
                                                @change="dateNgayCapHCNG = parseDate(ngay_ho_chieu_ngoai_giao)"
                                                solo
                                                :rules="[rules.checkDatePast]"
                                                
                                            ></v-text-field>
                                            <v-date-picker v-model="dateNgayCapHCNG" no-title @input="menu3 = false" locale="vi"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Tại</label>
                                        <v-autocomplete
                                            :items="listNoiCapHoChieu"
                                            v-model="noi_cap_ho_chieu_ngoai_giao"
                                            item-text="itemName"
                                            item-value="itemName"
                                            clearable
                                            hide-no-data
                                            solo                               
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 sm6 class="px-2 my-2">
                                        <label>hoặc/và hộ chiếu công vụ số</label>
                                        <v-text-field
                                            v-model="so_ho_chieu_cong_vu"
                                            solo
                                            placeholder="Gồm 1 chữ cái và 7 số"
                                            @change="soHoChieuCongVuChange()"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Cấp ngày</label>
                                        <v-menu
                                            ref="menu4"
                                            :close-on-content-click="false"
                                            v-model="menu4"
                                            transition="scale-transition"
                                            offset-y
                                        >
                                            <v-text-field
                                                slot="activator"
                                                v-model="ngay_ho_chieu_cong_vu"
                                                persistent-hint
                                                hint="DD/MM/YYYY"
                                                append-icon="event"
                                                @change="dateNgayCapHCCV = parseDate(ngay_ho_chieu_cong_vu)"
                                                solo
                                                :rules="[rules.checkDatePast]"
                                                
                                            ></v-text-field>
                                            <v-date-picker v-model="dateNgayCapHCCV" no-title @input="menu4 = false" locale="vi"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs12 sm3 class="px-2 my-2">
                                        <label for="">Tại</label>
                                        <v-autocomplete
                                            :items="listNoiCapHoChieu"
                                            v-model="noi_cap_ho_chieu_cong_vu"
                                            item-text="itemName"
                                            item-value="itemName"
                                            clearable
                                            hide-no-data
                                            solo
                                        ></v-autocomplete>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <label>10. Thông tin gia đình</label>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Cha</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display:flex; align-items: center">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[0].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[0].nam_sinh"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[0].nghe_nghiep"    
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[0].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Mẹ</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display: flex; aligin-items: center">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[1].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[1].nam_sinh"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[1].nghe_nghiep"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[1].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Vợ/chồng</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display: flex; align-items: center;">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[2].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[2].nam_sinh"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[2].nghe_nghiep"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[2].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Con</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display:flex; align-items: center">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[3].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[3].nam_sinh"
                                                        
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[3].nghe_nghiep"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[3].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Con</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display:flex; align-items: center">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[4].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[4].nam_sinh"
                                                
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[4].nghe_nghiep"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[4].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="px-2 my-2">
                                        <v-layout wrap>
                                            <v-flex xs1><strong>Con</strong></v-flex>
                                            <v-flex xs11>
                                                <div style="display:flex; align-items: center">
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Họ tên"
                                                        v-model="gia_dinh[5].ho_ten"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Năm sinh"
                                                        v-model="gia_dinh[5].nam_sinh"
                                                
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Nghề nghiệp"
                                                        v-model="gia_dinh[5].nghe_nghiep"
                                                        solo
                                                    ></v-text-field>
                                                    <v-text-field
                                                        class="mx-2"
                                                        label="Địa chỉ"
                                                        v-model="gia_dinh[5].dia_chi"
                                                        solo
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="text-xs-right">
                                <v-btn small color="primary" @click="updateThanhVien()">Cập nhập</v-btn>
                                <v-btn small color="primary" @click="dialogThemThanhVien=false">Đóng</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Dialog danh sách thanh thành viên-->
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
        menu: true,
        menu2: true,
        menu3: true,
        menu4: true,
        menu5: true,
        menu6: false,
        checkCMT: false,
        errorNgayCapCMT: false,
        dialogDanhSach: false,
        messengeCMT: '',
        soNuocKhongDuocMien: 0,
        dateNgayKy: new Date().toISOString().substr(0, 10),
        dateNgayCapHCNG: new Date().toISOString().substr(0, 10),
        dateNgayCapHCCV: new Date().toISOString().substr(0, 10),
        dateNgayCapCMND: new Date().toISOString().substr(0, 10),
        dateNgayHenTra: new Date().toISOString().substr(0, 10),
        dateDueDate: new Date().toISOString().substr(0, 10),
        dateDueDateFormated: '',
        birthdayFormated: '',
        crurentHours: '',
        birthday: new Date().toISOString().substr(0, 10),
        eFormCode: '',
        tinhSelected: '',
        srcMauChuKy: '',
        update_cqcq: '',
        update_thanhvien: '',
        searchOptions: {
            inputClass: 'input_vuejs'
        },
        ngayHetHieuLuc: '',
        eFormCodeArr: [],
        listTinh: [],
        checkVanBan: [],
        headerVanBan: [
            {
            text: 'Đã KT',
            align: 'center',
            sortable: false
            },
          {
            text: 'Số ký hiệu',
            align: 'center',
            sortable: false
          },
          {
            text: 'Ngày ký',
            align: 'center',
            sortable: false
          },
          {
            text: 'Cơ quan chủ quản',
            align: 'center',
            sortable: false
          },
          {
            text: 'Người ký',
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
        listVanBan: [],
        headerThanhVien: [
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
            text: 'CMND/CCCD',
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
        listDanhSach: [],
        listGioiTinh: [{name: 'Nam', value: 'Nam'},{name: 'Nữ', value: 'Nữ'}],
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
        listVanBanNguoiKy: [],
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
            "Doan_HCTN": '',
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
            vm.getDelegateCity()
            vm.getCoQuanChuQuan()
            vm.getNoiCapHoChieu()
            vm.getNuocDi()
            vm.getNoiSinhTrongNuoc()
            vm.getNoiSinhNuocNgoai()
            vm.getBGMienCongHam()
            setTimeout(()=>{
                if(vm.formCode==='UPDATE'){
                    vm.getDetail()
                } else {                   
                    vm.dossiers['metaData'] = JSON.stringify({"newFormTemplate": "true", "dossierFileCustom": [], 'ma_to_khai': [], 'totalRecord': 0, 'delegateIdNo': '','delegateName': '','delegateTelNo': '','Doan_HCTN': '', 'durationCountMeta': 4})
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
        payment: {
            deep: true,
            handler:  (val, oldVal) => {
                $('#payment_hidden').val(JSON.stringify(val))
            }
        },
        dossiers: {
            deep: true,
            handler:  (val, oldVal) => {
                // let vm = this
                // let metaData = JSON.parse(val.metaData)
                // console.log(metaData)
                // metaData['delegateIdNo']= val.delegateIdNo
                // metaData['delegateName']=val.delegateName
                // metaData['delegateTelNo']=val.delegateTelNo

                // if( vm.eFormCodeArr.length === 0 ) {
                //     val['contactTelNo'] = val.delegateTelNo
                //     val['contactEmail'] = val.delegateEmail
                //     val['contactName'] = val.delegateName
                    
                //     val['applicantIdNo'] = val.delegateIdNo
                //     val['applicantName'] = val.delegateName
                //     val['address'] = val.delegateAddress
                //     val['cityCode'] = val.delegateCityCode
                //     val['districtCode'] = val.delegateDistrictCode
                //     val['wardCode'] = val.delegateWardCode
                //     val['contactTelNo'] = val.delegateTelNo
                //     val['contactEmail'] = val.delegateEmail
                // }
                // val['metaData'] = JSON.stringify(metaData)
                // $('#dossiers_hidden').val(JSON.stringify(val))
                // try{
                    
                //     metaData = JSON.parse(val.metaData)
                //     console.log(metaData)
                //     metaData['delegateIdNo']= val.delegateIdNo
                //     metaData['delegateName']=val.delegateName
                //     metaData['delegateTelNo']=val.delegateTelNo

                //     if( vm.eFormCodeArr.length === 0 ) {
                //         val['contactTelNo'] = val.delegateTelNo
                //         val['contactEmail'] = val.delegateEmail
                //         val['contactName'] = val.delegateName
                        
                //         val['applicantIdNo'] = val.delegateIdNo
                //         val['applicantName'] = val.delegateName
                //         val['address'] = val.delegateAddress
                //         val['cityCode'] = val.delegateCityCode
                //         val['districtCode'] = val.delegateDistrictCode
                //         val['wardCode'] = val.delegateWardCode
                //         val['contactTelNo'] = val.delegateTelNo
                //         val['contactEmail'] = val.delegateEmail
                //     }
                //     val['metaData'] = JSON.stringify(metaData)
                //     $('#dossiers_hidden').val(JSON.stringify(val))
                // } catch (err) {
                //     metaData = val.metaData
                //     console.log(metaData)
                //     metaData['delegateIdNo']= val.delegateIdNo
                //     metaData['delegateName']=val.delegateName
                //     metaData['delegateTelNo']=val.delegateTelNo
                    
                //     if( vm.eFormCodeArr.length === 0 ) {
                //         val['contactTelNo'] = val.delegateTelNo
                //         val['contactEmail'] = val.delegateEmail
                //         val['contactName'] = val.delegateName
                        
                //         val['applicantIdNo'] = val.delegateIdNo
                //         val['applicantName'] = val.delegateName
                //         val['address'] = val.delegateAddress
                //         val['cityCode'] = val.delegateCityCode
                //         val['districtCode'] = val.delegateDistrictCode
                //         val['wardCode'] = val.delegateWardCode
                //         val['contactTelNo'] = val.delegateTelNo
                //         val['contactEmail'] = val.delegateEmail
                //     }
                //     val['metaData'] = JSON.stringify(metaData)
                //     $('#dossiers_hidden').val(JSON.stringify(val))
                // }
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
            this.vb_nguoi_ky = ''
            this.getNguoiKyVB()
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
                vm.nuoc_di = metaData.Doan_HCTN.CacNuocDi_ma.split(',')
                

                vm.ho_chieu_ngoai_giao_cu = metaData.Doan_HCTN.SoHCCu_NG ? parseInt(metaData.Doan_HCTN.SoHCCu_NG) : 0
                vm.ho_chieu_cong_vu_cu = metaData.Doan_HCTN.SoHCCu_CV ? parseInt(metaData.Doan_HCTN.SoHCCu_CV) : 0
                vm.ho_chieu_pho_thong_cu = metaData.Doan_HCTN.SoHCCu_PT ? parseInt(metaData.Doan_HCTN.SoHCCu_PT) : 0
                vm.ho_chieu_cong_vu_moi = metaData.Doan_HCTN.SoHCCapMoi ? parseInt(metaData.Doan_HCTN.SoHCCapMoi) : 0
                vm.cong_ham_so_nuoc = metaData.Doan_HCTN.SoNuocXinCH ? parseInt(metaData.Doan_HCTN.SoNuocXinCH) : 0
                vm.ho_chieu_ngoai_giao_moi = metaData.Doan_HCTN.SoHCCapMoi_NG ? parseInt(metaData.Doan_HCTN.SoHCCapMoi_NG) : 0
                vm.cong_ham_schengen = metaData.Doan_HCTN.SoNguoiMienCH ? parseInt(metaData.Doan_HCTN.SoNguoiMienCH) : 0
                vm.cong_ham_nhap_canh = metaData.Doan_HCTN.SoCHNhapCanh ? parseInt(metaData.Doan_HCTN.SoCHNhapCanh) : 0
                vm.cong_ham_qua_canh = metaData.Doan_HCTN.SoCHQuaCanh ? parseInt(metaData.Doan_HCTN.SoCHQuaCanh) : 0
                vm.ho_chieu_gia_han = metaData.Doan_HCTN.SoHCGH ? parseInt(metaData.Doan_HCTN.SoHCGH) : 0
                vm.ho_chieu_hong = metaData.Doan_HCTN.SoHCHong ? parseInt(metaData.Doan_HCTN.SoHCHong) : 0
                vm.ho_chieu_mat = metaData.Doan_HCTN.SoHCMat ? parseInt(metaData.Doan_HCTN.SoHCMat) : 0
                vm.so_nguoi = metaData.Doan_HCTN.SoNguoi ? parseInt(metaData.Doan_HCTN.SoNguoi) : 0

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
                        toastr.error('Mã tờ khai không tìm thấy') 
                    }
                }).catch(err => {
                    vm.eFormCode = ''
                     toastr.error('Mã tờ khai không tìm thấy') 
                }) 
            }
        },
        fillDataEform (res) {
            let vm = this
            if(Object.keys(res).length !== 0 && res.constructor === Object){
                vm.fillTableVanBan(res);
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
                        if(vm.dossierFileArr[i]['partNo'] === 'TP02'){
                            vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                            vm.dossierFileArr[i]['eform'] = 'true'
                        }
                    }
                    $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))
                    vm.genSelectCQCQ()
                }
            }

        },
        fillTableThanhVien (res) {
            let vm = this
            vm.vb_so_thu_tu = res.vb_so_thu_tu ? res.vb_so_thu_tu : ''
            if(res.vb_so_hieu_van_ban && res.vb_co_quan_chu_quan && res.vb_ma_co_quan_chu_quan){
                let tg = {
                    bookingName: res.bookingName ? res.bookingName : '',
                    applicantName: res.applicantName ? res.applicantName : '',
                    applicantIdNo: res.applicantIdNo ? res.applicantIdNo : '',
                    address: res.address ? res.address : '',
                    vb_so_thu_tu: res.vb_so_thu_tu ? res.vb_so_thu_tu : '',
                    vb_so_hieu_van_ban: res.vb_so_hieu_van_ban ? res.vb_so_hieu_van_ban.toUpperCase() : '',
                    vb_ngay_ky: res.vb_ngay_ky ? res.vb_ngay_ky : '',
                    vb_co_quan_chu_quan: res.vb_co_quan_chu_quan ? res.vb_co_quan_chu_quan : '',
                    vb_ma_co_quan_chu_quan: res.vb_ma_co_quan_chu_quan ? res.vb_ma_co_quan_chu_quan : '',
                    vb_nguoi_ky: res.vb_nguoi_ky ? res.vb_nguoi_ky : '',
                    vb_co_quan_tieng_anh: res.vb_co_quan_tieng_anh ? res.vb_co_quan_tieng_anh : '',
                    
                    ma_nhan_than: "",
                    ho_chieu_ngoai_giao: res.ho_chieu_ngoai_giao ? res.ho_chieu_ngoai_giao : false,
                    ho_chieu_cong_vu: res.ho_chieu_cong_vu ? res.ho_chieu_cong_vu : false,
                    cong_ham: res.cong_ham ? res.cong_ham : false,
                    so_ho_chieu: res.so_ho_chieu ? res.so_ho_chieu : '',
                    so_hieu_van_ban: res.vb_so_hieu_van_ban ? res.vb_so_hieu_van_ban.toUpperCase() : '',
                    co_quan_chu_quan: res.vb_ma_co_quan_chu_quan ? res.vb_ma_co_quan_chu_quan : '',
                    co_quan_chu_quan_text: res.vb_co_quan_chu_quan ? res.vb_co_quan_chu_quan : '',
                    ho_ten: res.ho_ten  ? res.ho_ten : '',
                    gioi_tinh: res.gioi_tinh ? res.gioi_tinh : '',
                    ngay_sinh: res.ngay_sinh ? res.ngay_sinh : '',
                    thang_sinh: res.thang_sinh ? res.thang_sinh : '',
                    nam_sinh: res.nam_sinh ? res.nam_sinh : '',
                    noi_sinh_khac: "",
                    noi_sinh: res.noi_sinh ? res.noi_sinh : '',
                    noi_sinh_text: res.noi_sinh_text ? res.noi_sinh_text : '',
                    ho_khau: res.ho_khau ? res.ho_khau : '',
                    so_cmt: res.so_cmt ? res.so_cmt : '',
                    ngay_cap_cmt: res.ngay_cap_cmt ? res.ngay_cap_cmt : '',
                    noi_cap_cmt: res.noi_cap_cmt ? res.noi_cap_cmt : '',
                    co_quan_cong_tac: res.co_quan_cong_tac ? res.co_quan_cong_tac : '',
                    dien_thoai: res.dien_thoai ? res.dien_thoai : '',
                    chuc_vu: res.chuc_vu ? res.chuc_vu : '',
                    cap_bac_ham: res.cap_bac_ham ? res.cap_bac_ham : '',
                    chuc_vu_tieng_anh: "",
                    cong_chuc_loai: res.cong_chuc_loai ? res.cong_chuc_loai : '',
                    cong_chuc_bac: res.cong_chuc_bac  ? res.cong_chuc_bac : '',
                    cong_chuc_ngach: res.cong_chuc_ngach ? res.cong_chuc_ngach : '',
                    can_bo_bo_nhiem: res.can_bo_bo_nhiem ? res.can_bo_bo_nhiem : '',
                    so_ho_chieu_ngoai_giao: res.so_ho_chieu_ngoai_giao ? res.so_ho_chieu_ngoai_giao : '',
                    ngay_ho_chieu_ngoai_giao: res.ngay_ho_chieu_ngoai_giao ? res.ngay_ho_chieu_ngoai_giao : '',
                    noi_cap_ho_chieu_ngoai_giao: res.noi_cap_ho_chieu_ngoai_giao_text ? res.noi_cap_ho_chieu_ngoai_giao_text : '',
                    so_ho_chieu_cong_vu: res.so_ho_chieu_cong_vu ? res.so_ho_chieu_cong_vu : '',
                    ngay_ho_chieu_cong_vu: res.ngay_ho_chieu_cong_vu ? res.ngay_ho_chieu_cong_vu : '',
                    noi_cap_ho_chieu_cong_vu: res.noi_cap_ho_chieu_cong_vu_text ? res.noi_cap_ho_chieu_cong_vu_text : '',
                    gia_dinh: [],
                    loai_ho_chieu: res.loai_ho_chieu ? res.loai_ho_chieu : ''
                }
                if(res.gia_dinh) {
                    tg['gia_dinh'] = res.gia_dinh.map(obj=>{
                        obj['gia_dinh'] = obj['gia_dinh']
                        obj['ho_ten'] = obj['ho_ten'] ? obj['ho_ten'] : ''
                        obj['nam_sinh'] = obj['nam_sinh'] ? obj['nam_sinh'] : ''
                        obj['nghe_nghiep'] = obj['nghe_nghiep'] ? obj['nghe_nghiep'] : ''
                        obj['dia_chi'] = obj['dia_chi'] ? obj['dia_chi'] : ''
                        return obj
                    })
                } else {
                    tg['gia_dinh'] = vm.gia_dinh
                }
                if(vm.serviceCode === 'BNG-270820' || vm.serviceCode === 'BNG-270816'){
                    if(tg['loai_ho_chieu'] === 'Công vụ'){
                        tg['ho_chieu_cong_vu'] = true
                    }
                    if(tg['loai_ho_chieu'] === 'Ngoại giao'){
                        tg['ho_chieu_ngoai_giao'] = true
                    }
                }
                if(vm.serviceCode === 'BNG-270819'){
                    tg['cong_ham'] = true
                }
                vm.listThanhVien.push(tg)
                vm.so_nguoi = vm.listThanhVien.length
                // fill Nuoc di
                // res.di_den.forEach(e => {
                //     let nuocditg = vm.listNuocDi.find(item=>item.ID === e )
                //     if(nuocditg){
                //         let nuocditg2 = vm.nuoc_di.find(item=>item.ID === nuocditg.ID)
                //         if(!nuocditg2){
                //             vm.nuoc_di.push(nuocditg.ID) 
                //         }   
                //     }
                // })
                if(res.di_den) {
                    for(let i = 0; i< res.di_den.length ; i++){
                        let nuocditg = vm.listNuocDi.find(item=>item.ID === res.di_den[i] )
                    
                        if(nuocditg){
                            
                            let nuocditg2 = vm.nuoc_di.find(item=>item === nuocditg.ID)
                            if(!nuocditg2){
                                vm.nuoc_di.push(nuocditg.ID) 
                            }   
                        }
                    }  
                }
    
                
                // Day  formData vao dossierFileArr 
                for (let i =0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === 'TP01'){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien})
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))

                // 
                vm.cong_ham_so_nguoi = vm.listThanhVien.filter(e => e.cong_ham).length
                if(res.nhap_canh){
                    vm.cong_ham_nhap_canh++
                }
                if(res.qua_canh){
                    vm.cong_ham_qua_canh++
                }
                if(res.schengen){
                    vm.cong_ham_schengen++
                }
                if(res.nhap_canh || res.qua_canh || res.schengen){
                    if(res.di_den){
                        vm.cong_ham_so_nuoc += res.di_den.length
                    }
                    if(res.di_den_text){
                        let arrNuocDi = res.di_den_text.split(', ')
                        for(let i = 0;i<arrNuocDi.length;i++){
                            let find =  vm.danhSachQGMienCongHam.find(e=>e.itemName !== arrNuocDi[i])
                            vm.soNuocKhongDuocMien++
                        } 
                    }
                }
                vm.countPassport()
                vm.genLePhi()
            }
        },
        getNuocDi(){
            let vm = this
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_DIA_DANH/protocols/API_CONNECT?loai=quoc_gia&ten=',
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                vm.listNuocDi = vm.sortArr(res.data.data, 'TEN') 

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
                url: '/o/rest/v2/dictcollections/NOI_CAP_HO_CHIEU/dictitems',
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
                    vb_so_hieu_van_ban: vm.vb_so_hieu_van_ban,
                    vb_co_quan_chu_quan: vm.co_quan_chu_quan.CQTen,
                    vb_ma_co_quan_chu_quan: vm.co_quan_chu_quan.CQID.toString(),
                    vb_ngay_ky: vm.vb_ngay_ky,
                    vb_co_quan_tieng_anh: vm.vb_co_quan_tieng_anh,
                    vb_nguoi_ky: vm.vb_nguoi_ky.ID,
                    ho_ten_nguoi_ky: vm.vb_nguoi_ky.NguoiKy,
                    chuc_vu_nguoi_ky: vm.vb_nguoi_ky.ChucVu
                }
                if(vm.update_cqcq === 'add'){
                    vm.listVanBan.push(tg)
                    vm.checkVanBan.push(tg)
                    
                } else {
                    vm.$set(vm.listVanBan, vm.update_cqcq, tg)
                    vm.$set(vm.checkVanBan, vm.update_cqcq, tg) 
                }
                vm.changeCheckCKCD()
                vm.genSelectCQCQ()
                
                for (let i =0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === 'TP02'){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))
                vm.dialogThemVanBan = false
            } else {
                toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
            }

            
        },
        updateThanhVien(){
            let vm = this
            if(this.$refs.formThanhVien.validate() && (this.ho_chieu_ngoai_giao || this.ho_chieu_cong_vu || this.cong_ham)){
                const [day, month, year] = vm.birthdayFormated.split('/')
                let tk = {
                    bookingName: vm.dossiers.delegateName,
                    applicantName: vm.dossiers.applicantName,
                    applicantIdNo: vm.dossiers.applicantIdNo,
                    address: vm.dossiers.address,
                    vb_so_thu_tu: vm.vb_so_thu_tu,
                    vb_so_hieu_van_ban: vm.co_quan_chu_quan_thanh_vien_select.vb_so_hieu_van_ban,
                    vb_ngay_ky: vm.co_quan_chu_quan_thanh_vien_select.vb_ngay_ky,
                    vb_co_quan_chu_quan: vm.co_quan_chu_quan_thanh_vien_select.vb_co_quan_chu_quan,
                    vb_ma_co_quan_chu_quan: vm.co_quan_chu_quan_thanh_vien_select.vb_ma_co_quan_chu_quan,
                    vb_nguoi_ky: vm.co_quan_chu_quan_thanh_vien_select.vb_nguoi_ky,
                    vb_co_quan_tieng_anh: vm.co_quan_chu_quan_thanh_vien_select.vb_co_quan_tieng_anh,

                    ma_nhan_than: vm.ma_nhan_than,
                    ho_chieu_ngoai_giao: vm.ho_chieu_ngoai_giao,
                    ho_chieu_cong_vu: vm.ho_chieu_cong_vu,
                    cong_ham: vm.cong_ham,
                    so_ho_chieu: vm.so_ho_chieu,
                    so_hieu_van_ban: vm.co_quan_chu_quan_thanh_vien_select.vb_so_hieu_van_ban,
                    co_quan_chu_quan: vm.co_quan_chu_quan_thanh_vien_select.vb_ma_co_quan_chu_quan,
                    co_quan_chu_quan_text: vm.co_quan_chu_quan_thanh_vien_select.vb_co_quan_chu_quan,
                    ho_ten: vm.ho_ten,
                    gioi_tinh: vm.gioi_tinh,
                    ngay_sinh: day,
                    thang_sinh: month,
                    nam_sinh: year,
                    noi_sinh_khac: vm.noi_sinh_khac,
                    noi_sinh: vm.noi_sinh.ID,
                    noi_sinh_text: vm.noi_sinh.TEN,
                    ho_khau: vm.ho_khau,
                    so_cmt: vm.so_cmt,
                    ngay_cap_cmt: vm.ngay_cap_cmt,
                    noi_cap_cmt: vm.noi_cap_cmt,
                    co_quan_cong_tac: vm.co_quan_cong_tac,
                    dien_thoai: vm.dien_thoai,
                    chuc_vu: vm.chuc_vu,
                    cap_bac_ham: vm.cap_bac_ham,
                    chuc_vu_tieng_anh: vm.chuc_vu_tieng_anh,
                    cong_chuc_loai: vm.cong_chuc_loai,
                    cong_chuc_bac: vm.cong_chuc_bac,
                    cong_chuc_ngach: vm.cong_chuc_ngach,
                    can_bo_bo_nhiem: vm.can_bo_bo_nhiem,
                    so_ho_chieu_ngoai_giao: vm.so_ho_chieu_ngoai_giao,
                    ngay_ho_chieu_ngoai_giao: vm.ngay_ho_chieu_ngoai_giao,
                    noi_cap_ho_chieu_ngoai_giao: vm.noi_cap_ho_chieu_ngoai_giao,
                    so_ho_chieu_cong_vu: vm.so_ho_chieu_ngoai_giao,
                    ngay_ho_chieu_cong_vu: vm.ngay_ho_chieu_cong_vu,
                    noi_cap_ho_chieu_cong_vu: vm.noi_cap_ho_chieu_ngoai_giao,
                    gia_dinh: vm.gia_dinh
                }

                if(vm.serviceCode === 'BNG-270820' || vm.serviceCode === 'BNG-270816' || vm.serviceCode === 'BNG-270819') {
                    if(vm.ho_chieu_ngoai_giao){
                        tk['loai_ho_chieu'] = 'Ngoại giao'
                    }
                    if(vm.ho_chieu_cong_vu){
                        tk['loai_ho_chieu'] = 'Công vụ'
                    } 
                }

                if(vm.update_thanhvien === 'add'){
                    vm.listThanhVien.push(tk)
                } else {
                   vm.$set(vm.listThanhVien, vm.update_thanhvien, tk)
                
                }
                vm.so_nguoi = vm.listThanhVien.length
                for (let i=0; i<vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] == 'TP01'){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien })
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))
                vm.cong_ham_so_nguoi = vm.listThanhVien.filter(e => e.cong_ham).length

                vm.countPassport()
                vm.genLePhi()

                vm.dialogThemThanhVien = false
            } else {
                toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
            }
        },
        countPassport(){

            let vm = this
            vm.ho_chieu_ngoai_giao_cu = 0
            vm.ho_chieu_cong_vu_cu = 0
            vm.ho_chieu_cong_vu_moi = 0
            vm.ho_chieu_ngoai_giao_moi = 0
            vm.listThanhVien.forEach(e=>{
                if(e.so_ho_chieu_ngoai_giao){
                    vm.ho_chieu_ngoai_giao_cu++
                }
                if(e.so_ho_chieu_cong_vu){
                    vm.ho_chieu_cong_vu_cu++
                }
                if(e.ho_chieu_cong_vu){
                    vm.ho_chieu_cong_vu_moi++
                }
                if(e.ho_chieu_ngoai_giao){
                    vm.ho_chieu_ngoai_giao_moi++
                }
            })

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
            this.update_thanhvien = 'add'
            vm.dictCollection = 'tinh_thanh'
            vm.getNoiSinh(vm.dictCollection)
            this.dialogThemThanhVien = true
            this.$refs.formThanhVien.reset()
        },
        openDialogUpdateVanBan(index,item){
            let vm = this
            vm.update_cqcq = index
            vm.vb_so_hieu_van_ban = item.vb_so_hieu_van_ban
            vm.co_quan_chu_quan =vm.listCoQuanChuQuan.find(e=>e.CQTen === item.vb_co_quan_chu_quan) 
            vm.vb_ngay_ky = item.vb_ngay_ky
            vm.vb_co_quan_tieng_anh = item.vb_co_quan_tieng_anh
            setTimeout(()=>{
                vm.vb_nguoi_ky = vm.listVanBanNguoiKy.find( e=> e.ID === item.vb_nguoi_ky)
            }, 1000)
            vm.dialogThemVanBan = true
        },
        openDialogUpdateThanhVien(index,item){
           
            let vm = this
            this.update_thanhvien = index
            this.dialogThemThanhVien = true
            let tg = 'ma_nhan_than,ho_chieu_ngoai_giao,ho_chieu_cong_vu,cong_ham,so_ho_chieu,so_hieu_van_ban,ho_ten,gioi_tinh,ngay_sinh,thang_sinh,nam_sinh,noi_sinh_khac,noi_sinh,noi_sinh_text,ho_khau,so_cmt,ngay_cap_cmt,noi_cap_cmt,co_quan_cong_tac,dien_thoai,chuc_vu,cap_bac_ham,chuc_vu_tieng_anh,cong_chuc_loai,cong_chuc_bac,cong_chuc_ngach,can_bo_bo_nhiem,so_ho_chieu_ngoai_giao,ngay_ho_chieu_ngoai_giao,noi_cap_ho_chieu_ngoai_giao,so_ho_chieu_cong_vu,ngay_ho_chieu_cong_vu,noi_cap_ho_chieu_cong_vu,gia_dinh'
            let mang_key = tg.split(',')
            console.log(item)
            console.log(vm.co_quan_chu_quan_thanh_vien)
            mang_key.forEach( e => {
               
                if (e === 'so_hieu_van_ban'){
                    vm.co_quan_chu_quan_thanh_vien_select = vm.co_quan_chu_quan_thanh_vien.find(item2 => item2['vb_so_hieu_van_ban'].toLowerCase() === item[e].toLowerCase() && item2['vb_ngay_ky'] === item['vb_ngay_ky']  && item2['vb_ma_co_quan_chu_quan'] === item['vb_ma_co_quan_chu_quan'])
                } else if (e === 'nam_sinh' ||e === 'thang_sinh' || e === 'ngay_sinh') {
                    vm.birthday = vm.parseDate(item['ngay_sinh']+'/'+item['thang_sinh']+'/'+item['nam_sinh'])
                } else if (e === 'noi_sinh') {
                    if(isNaN(item[e])){
                        vm.dictCollection = 'quoc_gia'
                    } else {
                        vm.dictCollection = 'tinh_thanh'
                    }
                    vm.getNoiSinh(vm.dictCollection)
                    setTimeout(()=>{
                        vm.noi_sinh =  vm.listNoiSinh.find(el=>el.ID===item[e])
                    }, 1000)
                }
                 else {
                    vm[e] = item[e]
                }
              
            })


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
                if(vm.dossierFileArr[i]['partNo'] === 'TP01'){
                    vm.dossierFileArr[i]['formData'] = JSON.stringify({'thanh_vien_doan': vm.listThanhVien})
                    vm.dossierFileArr[i]['eform'] = 'true'
                }
            }
            vm.so_nguoi = vm.listThanhVien.length
            $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))
        },
        checkThanhVien (index) {
            let vm = this
            console.log(vm.listVanBan[index])
            let thanhvien =  vm.listThanhVien.find(e => e.vb_so_hieu_van_ban === vm.listVanBan[index].vb_so_hieu_van_ban && e.vb_ngay_ky === vm.listVanBan[index].vb_ngay_ky && e.vb_ma_co_quan_chu_quan === vm.listVanBan[index].vb_ma_co_quan_chu_quan)
            console.log(thanhvien)
            return thanhvien ? true : false
        },
        deleteVanBan(index){
            let vm = this
            if(!vm.checkThanhVien(index)){
                vm.listVanBan.splice(index,1)
                for (let i =0; i< vm.dossierFileArr.length; i++){
                    if(vm.dossierFileArr[i]['partNo'] === 'TP02'){
                        vm.dossierFileArr[i]['formData'] = JSON.stringify({'van_ban': vm.listVanBan})
                        vm.dossierFileArr[i]['eform'] = 'true'
                    }
                }
                $('#dossierFileArr_hidden').val(JSON.stringify(vm.dossierFileArr))
                this.genSelectCQCQ()
            } else {
                toastr.error('Văn bản quyết định đã được sử dụng. Phải xóa thành viên sử dụng văn bản quyết định ' + vm.listVanBan[index].vb_so_hieu_van_ban + ' - ' + vm.listVanBan[index].vb_ngay_ky + ' - ' + vm.listVanBan[index].vb_co_quan_chu_quan)
            }
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
            soNuocKhongDuocMien
            let so_nuoc = vm.soNuocKhongDuocMien
            let so_schengen = vm.cong_ham_schengen != '' ? parseInt(vm.cong_ham_schengen) : 0
            let so_nhap_canh = vm.cong_ham_nhap_canh != '' ? parseInt(vm.cong_ham_nhap_canh) : 0
            let so_qua_canh = vm.cong_ham_qua_canh != '' ? parseInt(vm.cong_ham_qua_canh) : 0
            
            let giaLePhiMoi = 160000
            if(vm.serviceCode === 'BNG-270820'){
                giaLePhiMoi = 80000
            }
            let lp_moi = (hcng_moi + hccv_moi)*giaLePhiMoi;
            let lp_gia_han = hc_gh * 100000;
            let lp_hong = (hc_hong + hc_mat) * 320000;
            let lp_schengen = so_schengen * 10000;
            let lp_nhap = so_nuoc * so_nhap_canh * 10000;
            let lp_qua = so_nuoc * so_qua_canh * 10000;
            let so_cong_ham = so_schengen + so_nhap_canh + so_qua_canh
            let lp_cong_ham = lp_schengen + lp_nhap + lp_qua
            
            let le_phi = lp_moi + lp_gia_han + lp_hong + lp_schengen + lp_nhap + lp_qua;
            
            let file_payment2 = new Array();
            if(lp_moi > 0)
                file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu cấp mới', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hcng_moi + hccv_moi), 'trang_thai': 1, 'don_gia': vm.serviceCode === 'BNG-270820' ? 80000 : 160000, 'thanh_tien': lp_moi};
            // if((hcng_moi <= 0 || hccv_moi <=0) && lp_gia_han <=0 && lp_hong <=0 && lp_cong_ham <=0 )
            // {
            //     file_payment2[file_payment2.length] = {'partNo': 'empty','serviceName': 'empty', 'partName': 'empty', 'fileMark': 'empty', 'fileMarkName': 'empty', 'recordCount': 'empty', 'trang_thai': 'empty', 'don_gia': 'empty', 'thanh_tien': 'empty'}; 
            //     file_payment2[file_payment2.length] = {'partNo': 'empty','serviceName': 'empty', 'partName': 'empty', 'fileMark': 'empty', 'fileMarkName': 'empty', 'recordCount': 'empty', 'trang_thai': 'empty', 'don_gia': 'empty', 'thanh_tien': 'empty'};   
            // }
            if(lp_gia_han > 0)
                file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Gia hạn hộ chiếu ngoại giao, hộ chiếu công vụ', 'partName': 'Hộ chiếu gia hạn', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': hc_gh, 'trang_thai': 1, 'don_gia': 100000, 'thanh_tien': lp_gia_han};
            
            if(lp_hong > 0)
                file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp hộ chiếu ngoại giao, hộ chiếu công vụ (mất, hỏng)', 'partName': 'Hộ chiếu hỏng', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': (hc_hong + hc_mat), 'trang_thai': 1, 'don_gia': 320000, 'thanh_tien': lp_hong};
            
            // if(lp_schengen > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': vm.dossiers.dossierName + ' (Số công hàm)', 'partName': 'Schengen', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': so_schengen, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_schengen};
            
            // if(lp_nhap > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': vm.dossiers.dossierName + ' (Số công hàm)', 'partName': 'Nhập cảnh '+so_nuoc +' quốc gia', 'fileMark': '-1', 'fileMarkName': '', 'so_nuoc': so_nuoc, 'recordCount': so_nhap_canh, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_nhap};
            
            // if(lp_qua > 0)
            //     file_payment2[file_payment2.length] = {'partNo': '','serviceName': vm.dossiers.dossierName + ' (Số công hàm)', 'partName': 'Quá cảnh '+so_nuoc +' quốc gia', 'fileMark': '-1', 'fileMarkName': '', 'so_nuoc': so_nuoc, 'recordCount': so_qua_canh, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_qua};
            
            if (lp_cong_ham > 0 ){
                file_payment2[file_payment2.length] = {'partNo': '','serviceName': 'Cấp công hàm đề nghị cấp thị thực', 'partName': '', 'fileMark': '-1', 'fileMarkName': '', 'recordCount': so_cong_ham, 'trang_thai': 1, 'don_gia': 10000, 'thanh_tien': lp_cong_ham};
            }
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
                let nc = vm.listNuocDi.find(item=>item.ID === e)
                if(nc){
                    if(nuoc_di){
                        nuoc_di+=', ' + nc.TEN
                    } else {
                       nuoc_di+= nc.TEN
                    }
                    
                }     
            });
            vm.payment = {"requestPayment":1,"paymentNote":"","advanceAmount":0,"feeAmount":le_phi,"serviceAmount":0,"shipAmount":0}
            console.log(vm.dossiers['metaData'] , typeof vm.dossiers['metaData'])   
            let hs = JSON.parse(vm.dossiers['metaData']);
            hs['dossierFilePayment'] = file_payment2
            hs['Doan_HCTN'] = {
                "CQCuDi": vm.dossiers.applicantName, 
                "QD_CV": "", 
                "SoNguoi": String(vm.so_nguoi), 
                "MucDich": "", 
                "TaiChinh": "", 
                "CQChuQuan": 0, 
                "SoNgay": "", 
                "CacNuocDi_ma": nuoc_id, 
                "CacNuocDi": nuoc_di, 
                "SoHCCu_NG": vm.ho_chieu_ngoai_giao_cu.toString(),
                "SoHCCu_CV": vm.ho_chieu_cong_vu_cu.toString(),
                "SoHCCu_PT": vm.ho_chieu_pho_thong_cu.toString(),
                "SoHCCapMoi": vm.ho_chieu_cong_vu_moi.toString(),
                "SoNuocXinCH": vm.cong_ham_so_nuoc.toString(), 
                "SoNguoiMLP": "", 
                "SoHCCapMoi_NG": vm.ho_chieu_ngoai_giao_moi.toString(), 
                "SoNguoiMienCH": vm.cong_ham_schengen.toString(),
                "SoCHNhapCanh": vm.cong_ham_nhap_canh.toString(),
                "SoCHQuaCanh": vm.cong_ham_qua_canh.toString(),
                "SoHCGH": vm.ho_chieu_gia_han.toString(),
                "SoHCHong": vm.ho_chieu_hong.toString(),
                "SoHCMat": vm.ho_chieu_mat.toString()
            };
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
            // let config = {
            //     url: '/o/rest/v2/dossiers/dueDate?service='+vm.serviceCode+'&agency='+vm.govAgencyCode+'&template='+vm.dossierTemplateNo+'&fromReceiveDate=',
            //     headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            // }
            // axios.request(config).then(res => {
            //     let tg = new Date(parseInt(res.data['dueDate']));
                    
            //     // let ngay = tg.getDate()+'/'+(tg.getMonth()+1)+'/'+tg.getFullYear()
            //     // vm.dossiers['dueDate'] = ngay
            //     vm.dateDueDate = tg.toISOString().substr(0, 10)
            // }).catch(err => {}) 
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
        getThongTinNhanThan () {
            let vm = this
            vm.listDanhSach = []
            let params = {}
            params['soHoChieu'] = vm.so_ho_chieu ? vm.so_ho_chieu : ''
            params['hoTen'] = vm.ho_ten ? vm.ho_ten : ''
            params['ngaySinh'] = vm.birthdayFormated ? vm.birthdayFormated : ''
            if(vm.noi_sinh){
                if(Object.keys(vm.noi_sinh).length !== 0 && vm.noi_sinh.constructor === Object){
                    params['noiSinh'] = vm.noi_sinh.ID ? vm.noi_sinh.ID : ''
                }
            }
            let config = {
                url: '/o/rest/v2/serverconfigs/HCTN_GET_CA_NHAN/protocols/API_CONNECT',
                params: params,
                headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            }
            axios.request(config).then(res => {
                if(res.data.data.length > 0) {
                    let arr = res.data.data.map(obj=>{
                        let NoiSinhText = {}
                        if(isNaN(obj.NoiSinh)){
                            NoiSinhText = vm.listNoiSinhNuocNgoai.find(e=>e.ID===obj.NoiSinh)
                        } else {
                            NoiSinhText = vm.listNoiSinhTrongNuoc.find(e=>e.ID===obj.NoiSinh)
                        }
                        
                        const [year, month, day] = obj.NgaySinh.substr(0, 10).split('-')
                        const [year2, month2, day2] = obj.HanDung.substr(0, 10).split('-')
                        let NgaySinhFormart = `${day}/${month}/${year}`
                        let HanDungFormart = `${day2}/${month2}/${year2}`
                        return {
                            ...obj,
                            NgaySinhFormart: NgaySinhFormart,
                            NoiSinhText: NoiSinhText.TEN ? NoiSinhText.TEN : '',
                            HanDungFormart: HanDungFormart
                        }
                    })
                    vm.listDanhSach =  vm.sortDate(arr, 'HanDung')
                    vm.dialogDanhSach = true
                }else{
                    toastr.error('Không tìm thấy thông tin')
                }
            }).catch(err => {toastr.error('Không tìm thấy thông tin')}) 
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
        changeNgaySinh(){
            let vm = this
            vm.changeDate('birthdayFormated')
            vm.birthday = vm.parseDate(vm.birthdayFormated)
        },
        inputNgaySinh(){
            let vm = this
            vm.inputDate('birthdayFormated')
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
            console.log('1')
            metaData['delegateName']=vm.dossiers.delegateName
             console.log('2')
            metaData['delegateTelNo']=vm.dossiers.delegateTelNo
            console.log('3')
            if( vm.auth === "false") {
                 console.log('4')
                vm.dossiers['contactTelNo'] = vm.dossiers['delegateTelNo']
                 console.log('5')
                vm.dossiers['contactEmail'] = vm.dossiers['delegateEmail']
                 console.log('6')
                vm.dossiers['contactName'] = vm.dossiers['delegateName']
                 console.log('7')
                vm.dossiers['applicantIdNo'] = vm.dossiers['delegateIdNo']
                 console.log('8')
                vm.dossiers['applicantName'] = vm.dossiers['bookingName']
                 console.log('9')
                vm.dossiers['address'] = vm.dossiers['delegateAddress']
                 console.log('10')
                vm.dossiers['cityCode'] = vm.dossiers['delegateCityCode']
                 console.log('11')
                vm.dossiers['districtCode'] = vm.dossiers['delegateDistrictCode']
                 console.log('12')
                vm.dossiers['wardCode'] = vm.dossiers['delegateWardCode']
                 console.log('13')
                vm.dossiers['contactTelNo'] = vm.dossiers['delegateTelNo']
                 console.log('14')
                vm.dossiers['contactEmail'] = vm.dossiers['delegateEmail']
                 console.log('15')
            }
            vm.dossiers['applicantName'] = vm.dossiers['bookingName']
            vm.dossiers['metaData'] = JSON.stringify(metaData)
            console.log('16')
            $('#dossiers_hidden').val(JSON.stringify(vm.dossiers))
            console.log('17')
        },
        getBGMienCongHam(){
            let vm = this
            let headers = {
                groupId: window.themeDisplay.getScopeGroupId(),
                Token: window.Liferay ? window.Liferay.authToken : ''
            }
            axios({
                method: 'GET',
                url: '/o/rest/v2/dictcollections/QG_MIENCONGHAM/dictitems',
                headers: headers,
            }).then(function (response) {
                if(response.data.hasOwnProperty('data')){
                    vm.danhSachQGMienCongHam =  response.data.data
                } else {
                    vm.danhSachQGMienCongHam = []
                }
            }).catch(function (error) {
            })
        }
    }
}
</script>