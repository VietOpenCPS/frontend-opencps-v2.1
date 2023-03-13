<template>
  <v-card
    class="mx-auto pa-3"
    outlined
    flat
  >
      <div>
        <v-row justify="start" class="mt-0">
          <v-col class="d-flex align-center justify-start" style="color: #025E29;font-weight: 500;max-width: 300px;">
            <div class="header-content">
              DANH SÁCH PHẢN ÁNH KIẾN NGHỊ
            </div>
            <div class="triangle-header"></div>
          </v-col>
          <v-col class="d-flex align-center justify-end" style="padding-left: 100px;">
            <v-text-field
                class="input-form"
                v-model="keywordSearch"
                solo
                dense
                clearable
                hide-details="auto"
                placeholder="Nhập từ khóa tìm kiếm ..."
                append-icon="search"
                @click:append="getDanhSachCauHoi('reset')"
                @keyup.enter="getDanhSachCauHoi('reset')"
            ></v-text-field>
          </v-col>
          <!-- <v-col class="d-flex align-center justify-end" style="max-width: 300px;">
            <v-autocomplete
              class="flex input-form"
              hide-no-data
              :items="itemsLoai"
              v-model="loaiSearch"
              item-text="name"
              item-value="value"
              dense
              solo
              hide-details="auto"
              return-object
            >
            </v-autocomplete>
          </v-col> -->
          <v-col class="d-flex align-center justify-end pl-3" style="max-width: 200px;">
            <v-btn color="primary" class="btn-form mx-0 text-white" @click="guiPhanAnhKienNghi()">
              <v-icon size="18">add_comment</v-icon> &nbsp; Gửi phản ánh kiến nghị
            </v-btn>
          </v-col>
        </v-row>
        <div>
          <div v-for="item in itemsCauHoi" :key="item.Id" class="item" style="
            padding-top: 15px;
            padding-bottom: 15px;
            position: relative;
            padding-left: 140px;
            position: relative;
            min-height: 100px;
            border-bottom: 1px solid #dde8f3;
            cursor: pointer;
          "
            @click="showTraLoi(item)"
          >
            <div class="">
              <div href="" class="d-inline-block" style="width: 100px;
                height: 100px;
                position: absolute;
                left: 0px
                top: 0px;
                background: transparent;
                border-radius: 50%;
                display: flex !important;
                align-items: center;
                justify-content: center;">
                <v-icon size="36" style="color: #658a04 !important">question_answer</v-icon>
              </div>
              <div class="post-info" style="font-size: 16px; color: #666;  margin-bottom: 7px;">
                <span>{{item.HoTenNguoiGui}} -  {{item.ThoiGianGui}}</span>
                <span :style="item.TrangThai == '1' ? 'color: #FFAB00; margin-left: 30px;' : 'color: green; margin-left: 30px;'">
                  {{item.TrangThai == '1' ? 'Chưa trả lời' : 'Đã trả lời'}}
                </span>
              </div>
              <h3 class="post-title" style="margin: 0px;  margin-bottom: 5px; font-size: 18px;">
                <p style="text-align: left; display: block; font-weight: 500; line-height: 26px;">
                  <span style="    
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;">
                    {{item.TieuDe}}
                  </span>
                </p>
              </h3>
              <p style="text-align: justify; margin-bottom: 5px;font-size: 16px;display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;" class="post-shortdesc">
                Nội dung kiến nghị: {{item.NoiDungKienNghi}}
              </p>
            </div>
          </div>
        </div>
        <pagination :pageInput="page-1" :pageCount="pageCount" :total="total" @tiny:change-page="changePage"></pagination>
      </div>
      <v-dialog
        v-model="dialogTraLoi"
        persistent
        fullscreen
      >
        <v-card>
          <v-toolbar
            dark
            color="primary" class="px-3"
          >
            <v-toolbar-title>Trả lời phản ánh, kiến nghị</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                icon
                dark
                @click="dialogTraLoi = false"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="mt-3 px-3" style="max-width: 1200px; margin: 0 auto;">
            <div class="" style="
                margin: 0px;
                font-size: 24px;
                display: block;
                margin-bottom: 20px;
                color: #333333;
                font-weight: 500;
                line-height: 36px;
                position: relative;
                text-align: justify;
            ">{{selected.TieuDe}}</div>
            <div style="font-size: 16px; color: #666; margin-bottom: 7px;"> 
              <span>{{selected.HoTenNguoiGui}} -  {{selected.ThoiGianGui}}</span>
            </div>
            <div class="item" style="
              padding-top: 15px;
              padding-bottom: 15px;
              position: relative;
              padding-left: 140px;
              position: relative;
              min-height: 100px;
              border-bottom: 1px solid #E9F0F8;"
            >
              <div class="">
                <div href="" class="d-inline-block" style="width: 80px;
                  height: 80px;
                  position: absolute;
                  left: 0px
                  top: 0px;
                  background: #fbecd6;
                  border-radius: 50%;
                  display: flex !important;
                  align-items: center;
                  justify-content: center;">
                  <v-icon size="36" style="color: #ce7a58 !important">textsms</v-icon>
                </div>

                <div class="post-title" style="margin: 0px;  margin-bottom: 5px; font-size: 18px;">
                  <p style="text-align: left; display: block; font-weight: 500; line-height: 26px;color: #ce7a58;">
                    Nội dung kiến nghị:
                  </p>
                </div>
                <p style="text-align: justify; margin-bottom: 5px;font-size: 16px;" class="post-shortdesc">
                  {{selected.NoiDungKienNghi}}
                </p>
              </div>
            </div>
            <div class="item" style="
              padding-top: 15px;
              padding-bottom: 15px;
              position: relative;
              padding-left: 140px;
              position: relative;
              min-height: 100px;
              border-bottom: 1px solid #E9F0F8;"
            >
              <div class="">
                <div href="" class="d-inline-block" style="width: 80px;
                  height: 80px;
                  position: absolute;
                  left: 0px
                  top: 0px;
                  background: #e5eadb;
                  border-radius: 50%;
                  display: flex !important;
                  align-items: center;
                  justify-content: center;">
                  <v-icon size="36" style="color: #7c964c !important">question_answer</v-icon>
                </div>

                <h3 class="post-title" style="margin: 0px;  margin-bottom: 5px; font-size: 18px;">
                  <p style="text-align: left; display: block; font-weight: 500; line-height: 26px;">
                    Cơ quan chức năng trả lời:
                  </p>
                </h3>
                <p style="text-align: justify; margin-bottom: 5px;font-size: 16px;" class="post-shortdesc">
                  {{selected.NoiDungTraLoi}}
                </p>
              </div>
            </div>
            <div class="flex mt-4" style="text-align: center;">
              <v-btn color="red" class="white--text"  @click="dialogTraLoi = false">
                <v-icon left style="color: #fff !important;">
                  close
                </v-icon>
                Thoát
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
  import $ from 'jquery'
  import toastr from 'toastr'
  import Pagination from './Pagination.vue'
  toastr.options = {
    'closeButton': true,
    'timeOut': '5000',
    "positionClass": "toast-top-center"
  }

  export default {
    name: 'PhanAnhKienNghi',
    components: {
      Pagination
    },
    data: () => ({
      dialogTraLoi: false,
      loadingData: false,
      itemsCauHoi: [
        {
          Id: 1,
          HoTenNguoiGui: "Nguyễn Văn Nam",
          ThoiGianGui: "12:30 20/08/2022",
          TrangThai: 1,
          TieuDe: "Đèn đường trước cửa số nhà 120 đường 30/4 không hoạt động",
          NoiDungKienNghi: "Người dân phản ánh đèn đường trước cửa số nhà 120 đường 30/4, phường 1, TP Cao Lãnh bị hư lâu không thấy chiếu sáng nhưng chưa được sửa chữa. Nhờ cơ quan chức năng hỗ trợ xử lý giúp!",
          NoiDungTraLoi: "Tiếp nhận thông tin phản ánh từ người dân, trong ngày 23/12/2022 Ban Quản lý công trình công cộng thành phố đã khắc phục, sửa chữa xong đèn chiếu sáng ngay số 120 đường 30/4, Phường 1, Thành phố Cao Lãnh.  "
        },
        {
          Id: 2,
          HoTenNguoiGui: "Nguyễn Văn Bắc",
          ThoiGianGui: "08:30 23/09/2022",
          TrangThai: 1,
          TieuDe: "Thủ tục kết hôn trong nước",
          NoiDungKienNghi: "Cho hỏi thủ tục kết hôn trong nước cần những giấy tờ gì và thời gian giải quyết đăng ký trong bao lâu?",
          NoiDungTraLoi: "Tiếp nhận thông tin phản ánh từ người dân, trong ngày 23/12/2022 Ban Quản lý công trình công cộng thành phố đã khắc phục, sửa chữa xong đèn chiếu sáng ngay số 120 đường 30/4, Phường 1, Thành phố Cao Lãnh.  "
        },
        {
          Id: 3,
          HoTenNguoiGui: "Nguyễn Văn Nam",
          ThoiGianGui: "12:30 20/08/2022",
          TrangThai: 1,
          TieuDe: "Đèn đường trước cửa số nhà 120 đường 30/4 không hoạt động",
          NoiDungKienNghi: "Người dân phản ánh đèn đường trước cửa số nhà 120 đường 30/4, phường 1, TP Cao Lãnh bị hư lâu không thấy chiếu sáng nhưng chưa được sửa chữa. Nhờ cơ quan chức năng hỗ trợ xử lý giúp!",
          NoiDungTraLoi: "Tiếp nhận thông tin phản ánh từ người dân, trong ngày 23/12/2022 Ban Quản lý công trình công cộng thành phố đã khắc phục, sửa chữa xong đèn chiếu sáng ngay số 120 đường 30/4, Phường 1, Thành phố Cao Lãnh.  "
        }
      ],
      selected: '',
      keywordSearch: '',
      page: 1,
      itemsPerPage: 10,
      total: 15,
      pageCount: 2
    }),
    created () {
      let vm = this
      vm.getDanhSachCauHoi('reset')
    },
    computed: {
    },
    watch: {
    },
    methods: {
      getDanhSachCauHoi (type) {
        let vm = this
        if (type === 'reset') {
          vm.total = 0
          vm.pageCount = 0
          vm.page = 1
        }
        if (vm.loadingData) {
          return
        }
        vm.loadingData = true
        let filter = {
          data: {
            page: vm.page,
            tukhoa: String(vm.keywordSearch).trim(),
            itemsPerPage: vm.itemsPerPage
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Authorization: "Bearer " + vm.$cookies.get('Token', '')
          }
        }
        vm.$store.dispatch('getDanhSachCauHoi', filter).then(function (response) {
          vm.loadingData = false
          vm.itemsCauHoi = response.data
          vm.total = response.recordsTotal
          vm.pageCount = Math.ceil(vm.total / vm.itemsPerPage)
        }).catch(function () {
          vm.loadingData = false
        })
      },
      showTraLoi (item) {
        let vm = this
        vm.selected = item
        vm.dialogTraLoi = true
      },
      changePage(config) {
        let vm = this
        vm.page = config.page + 1
        vm.getDanhSachCauHoi()
      },
      guiPhanAnhKienNghi () {
        let vm = this
          vm.$router.push({
          path: '/gui-phan-anh-kien-nghi',
          query: {}
        })
      },
      fomatDate (val) {
        if (val) {
          let arg = String(val).replace(/\(/g, "").replace(/\)/g, "").replace(/Date/g, "").replace(/\//g, "")
          let value = new Date(Number(arg))
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}  ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="sass">
</style>
