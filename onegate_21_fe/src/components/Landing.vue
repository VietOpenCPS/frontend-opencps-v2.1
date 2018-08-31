<template>
  <div>
    <div class="row-header no__hidden_class">
      <div v-if="trangThaiHoSoList !== null" class="background-triangle-big"> <span>{{trangThaiHoSoList[index]['title']}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-select
            v-model="advSearchItems"
            placeholder="Tìm kiếm theo từ khoá ..."
            solo
            chips
            tags
            deletable-chips
            item-value="value"
            item-text="text"
            @input="keywordEventChange"
            content-class="adv__search__select"
            return-object
          ></v-select>
          <v-fade-transition>
            <div v-if="menusss"
            class="adv__search_container"
            >
              <v-layout wrap v-for="(item, indexTool) in advSearchTools" v-bind:key="indexTool" v-if="item.display">
                <v-flex xs12 sm5>
                  <v-select
                    :items="advSearchTools"
                    v-model="item.value"
                    label="Chọn điều kiện lọc"
                    single-line
                    item-value="value"
                    item-text="text"
                    disabled
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm1 class="text-center">
                  <v-btn icon class="my-0 mx-0">
                    <v-icon size="16">drag_handle</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs2 sm2 v-if="item.spec === 'year_month'">
                  <v-select
                    :items="itemFilterSupport.years"
                    v-model="itemFilterSupport.year"
                    label="Chọn năm"
                    autocomplete
                    single-line
                    item-value="value"
                    item-text="name"
                    hide-selected
                    @change="changeAdvFilterData($event, 'year', item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm2 class="text-center" v-if="item.spec === 'year_month'">
                  <v-btn icon class="my-0 mx-0">
                    <v-icon size="16">remove</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs2 sm2 v-if="item.spec === 'year_month'">
                  <v-select
                    :items="itemFilterSupport.months"
                    v-model="itemFilterSupport.month"
                    label="Chọn tháng"
                    autocomplete
                    single-line
                    item-value="value"
                    item-text="name"
                    @change="changeAdvFilterData($event, 'month', item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'top'">
                  <v-select
                    :items="itemFilterSupport.tops"
                    v-model="itemFilterSupport.top"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="value"
                    item-text="name"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'status'">
                  <v-select
                    :items="itemFilterSupport.statusLists"
                    v-model="itemFilterSupport.status"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="itemCode"
                    item-text="itemName"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'substatus'">
                  <v-select
                    :items="itemFilterSupport.substatusLists"
                    v-model="itemFilterSupport.substatus"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="itemCode"
                    item-text="itemName"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'agency'">
                  <v-select
                    :items="itemFilterSupport.agencyLists"
                    v-model="itemFilterSupport.agency"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="administrationCode"
                    item-text="administrationName"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'service'">
                  <v-select
                    :items="itemFilterSupport.serviceLists"
                    v-model="itemFilterSupport.service"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="serviceCode"
                    item-text="serviceName"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'domain'">
                  <v-select
                    :items="itemFilterSupport.domainLists"
                    v-model="itemFilterSupport.domain"
                    :label="item.text + ':'"
                    autocomplete
                    single-line
                    item-value="domainCode"
                    item-text="domainName"
                    @change="changeAdvFilterData($event, item.spec, item.index)"
                  ></v-select>
                </v-flex>
                <v-flex xs 12 sm6 v-if="item.spec === 'register'">
                  <v-text-field 
                    v-model="itemFilterSupport.register" 
                    :placeholder="item.text">
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 sm10 class="no__selected__items">
                  <v-select
                    :items="advSearchTools"
                    v-model="advSearchToolsSelected"
                    label="Chọn điều kiện lọc"
                    autocomplete
                    single-line
                    item-value="text"
                    item-text="text"
                    return-object
                    @change="selectedAdvFilter"
                    hide-selected
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm2 class="text-right">
                  <v-btn color="primary" class="mx-0 my-0 mt-1" v-on:click.native="menusss = false">
                    <v-icon class="mr-2">clear</v-icon>
                    Quay lại
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>
          </v-fade-transition>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2" v-on:click.native="showAdvFilter">
            <v-icon size="16">filter_list</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
    <v-layout wrap class="menu_header_list" :class='{"no__border__bottom": btnDynamics === null || btnDynamics === undefined || btnDynamics === "undefined" || (btnDynamics !== null && btnDynamics !== undefined && btnDynamics !== "undefined" && btnDynamics.length === 0)}'>
      <!-- <template-rendering v-if="menuType === 3" :item="itemFilterSupport" :layout_view="filterForm"></template-rendering> -->
      <v-layout wrap v-if="originality !== 1">
        <v-flex xs4 class="pl-2 pr-2">
          <v-select
            :items="listLinhVuc"
            v-model="linhVucSelected"
            autocomplete
            placeholder="Chọn lĩnh vực"
            item-text="displayName"
            item-value="domainCode"
            return-object
            :hide-selected="true"
            @change="changeDomain"
            clearable
          ></v-select>
        </v-flex>
        <v-flex xs4 class="pl-2 pr-2">
          <v-select
            :items="listThuTucHanhChinh"
            v-model="thuTucHanhChinhSelected"
            autocomplete
            placeholder="Chọn thủ tục hành chính"
            item-text="displayName"
            item-value="serviceConfigId"
            return-object
            :hide-selected="true"
            @change="changeServiceConfigs"
            clearable
          ></v-select>
        </v-flex>
        <v-flex xs4 class="pl-2 pr-2">
          <div style="position:relative">
            <v-text-field
              placeholder="Nhập mã hồ sơ"
              v-model="dossierNoKey"
              @keyup.enter="changeDossierNoKey"
            ></v-text-field>
            <v-icon v-if="dossierNoKey" color="primary" @click="clearDossierNoKey" class="hover-pointer" style="position:absolute;top:15px;right:0px">clear</v-icon>
          </div>
        </v-flex>
      </v-layout>
      <div class="py-1 px-1" style="background: #f6f6f6;border-top: 1px solid lightgrey;"
        v-if="dossierCounting !== null && dossierCounting !== undefined && dossierCounting.length > 0 && dossierCountingShow">
        <v-chip v-for="(item, index) in dossierCounting" v-bind:key="index" @click="changeAdvFilterDataChips(item)">
          <v-avatar style="background-color: #0b72ba;border-color: #0b72ba;color: #fff;">{{item.count}}</v-avatar>
          {{item.title}}
        </v-chip>
      </div>
    </v-layout>
    <v-layout wrap v-if="loadingDynamicBtn">
      <v-flex xs12 sm6>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
    </v-layout>
    <div v-if="!loadingDynamicBtn" class="btn_wrap_actions">
      <v-btn color="primary" v-for="(item, indexBTN) in btnDynamics" v-bind:key="indexBTN"
        v-on:click.native="btnActionEvent(null, item, indexBTN, true)" 
        v-if="String(item.form).indexOf('VIEW') < 0 && menuType !== 3"
        :loading="loadingAction && indexBTN === indexAction"
        :disabled="loadingAction && indexBTN === indexAction"
      >
        {{item.title}}{{item.tiltle}}
        <span slot="loader">Loading...</span>
      </v-btn>
    </div>
    
    <v-data-table
        :headers="headers"
        :items="hosoDatas"
        :total-items="hosoDatasTotal"
        v-model="selected"
        item-key="dossierId"
        :select-all="menuType !== 3 && originality !== 1"
        class="table-landing table-bordered"
        hide-actions
      >
      <!--  -->
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-if="menuType !== 3 && originality !== 1">
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              :disabled="!thuTucHanhChinhSelected || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '0') || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '')"
              primary
              hide-details
              @click.native="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="header['class'] ? header['class'] : ''"
            :width="header['width'] ? header['width'] + 'px' : ''"
          >
            <v-tooltip bottom>
              <span slot="activator">{{ header.text }}</span>
              <span>{{ header.text }}</span>
            </v-tooltip>
          </th>
        </tr>
      </template>
      <!--  -->
      <template slot="items" slot-scope="props">
        <tr>
          <td v-if="menuType !== 3 && originality !== 1">
            <v-checkbox
              :disabled="props.item['assigned'] === 0 || !thuTucHanhChinhSelected || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '0') || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '')"
              v-model="props.selected"
              primary
              hide-details
              color="primary"
            ></v-checkbox>
          </td>
          <td class="text-xs-center px-0 py-0">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <span v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;" :class="{'no_acction__event': !props.item['permission']}">
              {{ hosoDatasPage * 15 - 15 + props.index + 1 }}
            </span>
          </td>

          <td v-for="(itemHeader, indexHeader) in headers" v-bind:key="indexHeader + '_' + props.item.dossierId"
            :class="itemHeader['class_column']"
            v-if="itemHeader.hasOwnProperty('value')"
          >
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;" :class="{'no_acction__event': !props.item['permission']}">
              <template-rendering v-if="itemHeader.hasOwnProperty('layout_view')" :item="props.item" :layout_view="itemHeader.layout_view"></template-rendering>
              <span v-else>
                {{ props.item[itemHeader.value] }}
              </span>
            </div>
          </td>
          <td class="text-xs-center px-0 py-0" v-if="!hideAction">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-menu left :nudge-left="50" :nudge-top="15" 
              v-if="!loadingTable && ((btnDynamics !== null || btnDynamics !== undefined || btnDynamics !== 'undefined') || 
                (btnDossierDynamics !== null || btnDossierDynamics !== undefined || btnDossierDynamics !== 'undefined'))">
              <v-btn class="mx-0 my-0" slot="activator" icon @click="processPullBtnDynamics(props.item)">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <!-- :class="{'no_acction__event': (item['enable'] === 2 || props.item['assigned'] === 0)}" -->
                <v-list-tile v-for="(item, i) in btnDossierDynamics" :key="i + '_' + props.item.dossierId" 
                  @click="processPullBtnDetail(props.item, item, props.index, i)" 
                  :disabled="item['enable'] === 2 || String(props.item['permission']).indexOf('write') === -1"
                  v-if="item['enable'] > 0 || item['autoEvent'] === 'special'"
                  >
                  <v-list-tile-title>{{ item.actionName }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-for="(item, i) in btnStepsDynamics" :key="i + '_' + props.item.dossierId + '_' + props.item.dossierId"
                  v-if="checkPemissionSpecialAction(item.form, currentUser, thongTinChiTietHoSo) && String(item.form) !== 'NEW'"
                  @click="btnActionEvent(props.item, item, index, false)"
                >
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="viewDetail(props.item, props.index)">
                  Xem chi tiết
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-xs-right layout wrap" style="position: relative;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingData" ></tiny-pagination> 
      </div>
    </div>
    <v-dialog v-model="dialogAction" max-width="400" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="headline">{{itemAction.title}}{{itemAction.tiltle}}</v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogAction = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-progress-linear v-if="loadingAction" class="my-0" :indeterminate="true"></v-progress-linear>
          <v-card-text class="pb-0 pt-4">
            <v-layout wrap>
              <v-flex xs12 class="px-2 pb-3">
                <v-select
                  :items="listThuTucHanhChinh"
                  v-model="thuTucHanhChinhSelected"
                  autocomplete
                  placeholder="chọn thủ tục hành chính"
                  item-text="serviceName"
                  item-value="serviceConfigId"
                  return-object
                  :hide-selected="true"
                  @change = "changeServiceConfigs"
                ></v-select>
              </v-flex>
              <v-flex xs12 class="px-2">
                <v-select
                  :items="listDichVu"
                  v-model="dichVuSelected"
                  label="Dịch vụ:"
                  autocomplete
                  placeholder="chọn dịch vụ"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  :hide-selected="true"
                  v-if="thuTucHanhChinhSelected && listDichVu.length > 1"
                  :rules="[v => !!v || 'dịch vụ bắt buộc phải chọn.']"
                  @change = "changeDichVuConfigs"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogAction = false"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>undo</v-icon>&nbsp;
              Quay lại
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn color="primary" flat="flat" @click.native="doSubmitDialogAction(itemAction)"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>save</v-icon>&nbsp;
              Đồng ý
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogActionProcess" max-width="1000" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="validProcess" lazy-validation>
          <v-card-title class="headline">{{itemAction.actionName}}</v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogActionProcess = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-progress-linear v-if="loadingActionProcess" class="my-0" :indeterminate="true"></v-progress-linear>
          <v-card-text class="py-0 px-0">
            <v-layout wrap>
              <thong-tin-co-ban-ho-so v-if="dialogActionProcess" :detailDossier="thongtinhoso"></thong-tin-co-ban-ho-so>
              <!-- showFormBoSungThongTinNgan: {{showFormBoSungThongTinNgan}} <br/> -->
              <phan-cong v-if="dialogActionProcess && showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign" ></phan-cong>
              <!-- showTaoTaiLieuKetQua: {{showTaoTaiLieuKetQua}} <br/> -->
              <!-- showKyPheDuyetTaiLieu: {{showKyPheDuyetTaiLieu}} <br/> -->
              <tra-ket-qua v-if="dialogActionProcess && showTraKetQua" :resultFiles="returnFiles"></tra-ket-qua>
              <thu-phi v-if="dialogActionProcess && showThuPhi" v-model="payments" :viaPortal="viaPortalDetail"></thu-phi>
              <!-- showThucHienThanhToanDienTu: {{showThucHienThanhToanDienTu}} <br/> -->
              <y-kien-can-bo ref="ykiencanbo" v-if="dialogActionProcess && showYkienCanBoThucHien" :user_note="userNote"></y-kien-can-bo>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.native="submitFormXuLy(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)"
              :loading="loadingActionProcess"
              :disabled="loadingActionProcess"
            >
            <v-icon>save</v-icon>&nbsp;
            Xác nhận
            <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn color="red" dark @click.native="dialogActionProcess = false"
              :loading="loadingActionProcess"
              :disabled="loadingActionProcess"
            >
            <v-icon>undo</v-icon>&nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition">
      <v-card>
        <v-card-title class="headline">{{itemAction.title}}{{itemAction.tiltle}}</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogPDF = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <div v-if="dialogPDFLoading" style="
            min-height: 600px;
            text-align: center;
            margin: auto;
            padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_statusAction" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline">
          Trạng thái xử lý
        </v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="closeDialogStatusAction">
          <v-icon>clear</v-icon>
        </v-btn>
        <v-card-text style="max-height: 350px">
          <div v-for="(item, index) in selected" v-bind:key="item.dossierIdCTN">
            <v-layout wrap class="py-1 align-center row-list-style" style="border-bottom: 1px solid #ddd;position:relative"> 
              <v-flex xs11>
                <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                <div class="ml-4"><span class="text-bold">{{item.dossierNo}}</span> - {{item.serviceName}}</div>
              </v-flex>
              <v-flex xs1 class="text-right">
                <v-tooltip top v-if="item.statusAction">
                  <v-icon size="20" color="primary" slot="activator">
                    check
                  </v-icon>
                  <span>Thành công</span>
                </v-tooltip>
                <v-tooltip top v-else>
                  <v-icon size="20" color="red darken-3" slot="activator">
                    block
                  </v-icon>
                  <span>Thất bại</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="resend" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">refresh</v-icon>&nbsp;
            Thử lại
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red" dark @click.native="closeDialogStatusAction"
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon>undo</v-icon>&nbsp;
            Thoát
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.min.js'
import router from '@/router'
import TemplateRendering from './pagging/template_rendering.vue'
import TinyPagination from './pagging/hanghai_pagination.vue'
import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import XacNhanThuPhi from './form_xu_ly/XacNhanThuPhi.vue'
import ThuPhi from './form_xu_ly/FeeDetail.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import support from '../store/support.json'

export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination,
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo,
    'phan-cong': PhanCong,
    'tra-ket-qua': TraKetQua,
    'xac-nhan-thu-phi': XacNhanThuPhi,
    'thu-phi': ThuPhi,
    'y-kien-can-bo': YkienCanBoThucHien,
    'template-rendering': TemplateRendering
  },
  data: () => ({
    dossierCountingShow: false,
    dossierCounting: [],
    advSearchToolsSelected: [],
    advSearchTools: support.advSearchTools,
    advSearchItems: [],
    advObjectSearch: {},
    menusss: false,
    itemFilterSupport: {
      years: [
        {
          'value': '',
          'name': 'Lọc theo năm'
        },
        {
          'value': '2017',
          'name': 'năm 2017'
        },
        {
          'value': '2018',
          'name': 'năm 2018'
        },
        {
          'value': '2019',
          'name': 'năm 2019'
        }
      ],
      year: '',
      months: [
        {
          'value': '',
          'name': 'Lọc theo tháng'
        },
        {
          'value': '1',
          'name': 'tháng 1'
        },
        {
          'value': '2',
          'name': 'tháng 2'
        },
        {
          'value': '3',
          'name': 'tháng 3'
        },
        {
          'value': '4',
          'name': 'tháng 4'
        },
        {
          'value': '5',
          'name': 'tháng 5'
        },
        {
          'value': '6',
          'name': 'tháng 6'
        },
        {
          'value': '7',
          'name': 'tháng 7'
        },
        {
          'value': '8',
          'name': 'tháng 8'
        },
        {
          'value': '9',
          'name': 'tháng 9'
        },
        {
          'value': '10',
          'name': 'tháng 10'
        },
        {
          'value': '11',
          'name': 'tháng 11'
        },
        {
          'value': '12',
          'name': 'tháng 12'
        }
      ],
      month: '',
      tops: [
        {
          'value': '',
          'name': 'toàn bộ'
        },
        {
          'value': 'overdue',
          'name': 'hồ sơ đang quá hạn cần giải quyết'
        },
        {
          'value': 'delay',
          'name': 'chậm hạn trả'
        },
        {
          'value': 'coming',
          'name': 'sắp đến hạn'
        }
      ],
      top: '',
      statusLists: [],
      status: '',
      substatusLists: [
        {
          'itemCode': '',
          'itemName': 'toàn bộ'
        }
      ],
      substatus: '',
      agencyLists: [],
      agency: '',
      serviceLists: [],
      service: '',
      domainLists: [],
      domain: '',
      keyword: '',
      register: ''
    },
    menuType: 0,
    type_assign: '',
    assign_items: [],
    /* data TraKetQua */
    returnFiles: [],
    /* data XacNhanThuPhi */
    payments: '',
    viaPortalDetail: 0,
    /* */
    countSelected: 0,
    statusFailed: 0,
    dialog_statusAction: false,
    dossierSelected: [
      {
        dossierNo: '18ACE289',
        serviceName: 'Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu đối với tài sản gắn liền với đất mà chủ sở hữu không đồng thời là người sử dụng đất',
        statusAction: false
      }
    ],
    /** */
    buttonConfigItem: {},
    /* ý kiến cán bộ */
    textNote: '',
    /** */
    thongtinhoso: {},
    dossierId: 0,
    valid: true,
    isCallBack: true,
    trangThaiHoSoList: null,
    listDichVu: [],
    dichVuSelected: null,
    btnDynamics: [],
    btnDossierDynamics: [],
    btnStepsDynamics: [],
    loading: true,
    headers: [],
    hideAction: false,
    hosoDatas: [],
    hosoDatasTotal: 0,
    hosoDatasPage: 1,
    selected: [],
    listThuTucHanhChinh: [],
    thuTucHanhChinhSelected: null,
    listLinhVuc: [],
    linhVucSelected: null,
    domainCode: '',
    govAgencyCode: '',
    serviceCode: '',
    templateNo: '',
    dossierNoKey: '',
    dialogAction: false,
    loadingAction: false,
    dialogActionProcess: false,
    loadingActionProcess: false,
    validProcess: false,
    indexAction: -1,
    itemAction: {
      title: ''
    },
    showThongTinCoBanHoSo: false,
    showYkienCanBoThucHien: false,
    showFormBoSungThongTinNgan: false,
    showPhanCongNguoiThucHien: false,
    showTaoTaiLieuKetQua: false,
    showKyPheDuyetTaiLieu: false,
    showTraKetQua: false,
    showXacNhanThuPhi: false,
    showThuPhi: false,
    showThucHienThanhToanDienTu: false,
    dossierItemDialogPick: null,
    itemDialogPick: null,
    resultDialogPick: null,
    indexDialogPick: 0,
    userNote: 0,
    dialogPDF: false,
    dialogPDFLoading: true,
    filterForm: null,
    checkSelectAll: (this.menuType !== 3 && this.originality !== 1),
    titleLanding: ''
  }),
  computed: {
    loadingDynamicBtn () {
      return this.$store.getters.loadingDynamicBtn
    },
    loadingTable () {
      return this.$store.getters.loadingTable
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    currentUser () {
      return this.$store.getters.loadingInitData.user
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('page') && query['page'] !== '1') {
        vm.hosoDatasPage = parseInt(query['page'])
      } else {
        vm.hosoDatasPage = 1
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.$store.commit('setLoadingDynamicBtn', true)
        setTimeout(() => {
          vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
            vm.btnDynamics = []
            vm.trangThaiHoSoList = result
            vm.menuType = parseInt(vm.trangThaiHoSoList[vm.index]['menuType'])
            vm.processListTTHC(currentQuery)
            vm.processListDomain(currentQuery)
            // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('headers')) {
              vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
              vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
            }
            if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
              vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
            }
            if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('layout_view')) {
              vm.filterForm = vm.trangThaiHoSoList[vm.index]['buttonConfig']['layout_view']
              // console.log('filterForm11111', vm.trangThaiHoSoList[vm.index]['buttonConfig'])
              // console.log('filterForm', vm.filterForm)
            }
            let btnDynamicsOnlySteps = []
            let btnDynamicsView = []
            for (let key in vm.btnDynamics) {
              if (vm.btnDynamics[key].hasOwnProperty('onlySteps')) {
                btnDynamicsOnlySteps.push(vm.btnDynamics[key])
              } else {
                btnDynamicsView.push(vm.btnDynamics[key])
              }
            }
            vm.btnDynamics = []
            vm.btnDynamics = btnDynamicsView
            vm.btnStepsDynamics = []
            if (currentQuery.hasOwnProperty('step')) {
              // if (vm.trangThaiHoSoList[vm.index]['item'].length > 0) {
              //   vm.trangThaiHoSoList[vm.index]['item'].forEach(item => {
              //     if (item.stepCode === currentQuery['step']) {
              //       vm.titleLanding = item.stepName
              //     }
              //   })
              // }
              for (let key in vm.trangThaiHoSoList[vm.index]['items']) {
                let currentStep = vm.trangThaiHoSoList[vm.index]['items'][key]
                if (String(currentStep.stepCode) === String(currentQuery.step)) {
                  let buttonConfig = currentStep.buttonConfig
                  if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                    vm.btnStepsDynamics = JSON.parse(buttonConfig)['buttons']
                    for (let key in btnDynamicsOnlySteps) {
                      for (var i = 0; i < btnDynamicsOnlySteps[key].onlySteps.length; i++) {
                        if (String(btnDynamicsOnlySteps[key].onlySteps[i]) === String(currentStep.stepCode)) {
                          vm.btnDynamics.push(btnDynamicsOnlySteps[key])
                        }
                      }
                    }
                  } else {
                    vm.btnStepsDynamics = []
                  }
                  break
                }
              }
            }
            vm.$store.commit('setLoadingDynamicBtn', false)
          })
        }, 200)
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      // console.log('currentQuery watch router', currentQuery)
      if (currentQuery.hasOwnProperty('q')) {
        vm.btnDynamics = []
        vm.$store.commit('setLoadingDynamicBtn', true)
        vm.menuType = vm.trangThaiHoSoList[vm.index]['menuType']
        // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
        vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
          vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
          vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('layout_view')) {
          vm.filterForm = vm.trangThaiHoSoList[vm.index]['buttonConfig']['layout_view']
          // console.log('filterForm11111', vm.trangThaiHoSoList[vm.index]['buttonConfig'])
          // console.log('filterForm', vm.filterForm)
        }
        let btnDynamicsOnlySteps = []
        let btnDynamicsView = []
        for (let key in vm.btnDynamics) {
          if (vm.btnDynamics[key].hasOwnProperty('onlySteps')) {
            btnDynamicsOnlySteps.push(vm.btnDynamics[key])
          } else {
            btnDynamicsView.push(vm.btnDynamics[key])
          }
        }
        vm.btnDynamics = []
        vm.btnDynamics = btnDynamicsView
        vm.btnStepsDynamics = []
        if (currentQuery.hasOwnProperty('step')) {
          for (let key in vm.trangThaiHoSoList[vm.index]['items']) {
            let currentStep = vm.trangThaiHoSoList[vm.index]['items'][key]
            if (String(currentStep.stepCode) === String(currentQuery.step)) {
              let buttonConfig = currentStep.buttonConfig
              if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                vm.btnStepsDynamics = JSON.parse(buttonConfig)['buttons']
                for (let key in btnDynamicsOnlySteps) {
                  for (var i = 0; i < btnDynamicsOnlySteps[key].onlySteps.length; i++) {
                    if (String(btnDynamicsOnlySteps[key].onlySteps[i]) === String(currentStep.stepCode)) {
                      vm.btnDynamics.push(btnDynamicsOnlySteps[key])
                    }
                  }
                }
              } else {
                vm.btnStepsDynamics = []
              }
              break
            }
          }
        }
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = parseInt(currentQuery.page)
        } else {
          vm.hosoDatasPage = 1
        }
        vm.$store.commit('setLoadingDynamicBtn', false)
        console.log('watch: landing')
        if (vm.listLinhVuc === null || vm.listLinhVuc === undefined || (vm.listLinhVuc !== null && vm.listLinhVuc !== undefined && vm.listLinhVuc.length === 0)) {
          vm.processListDomain(currentQuery)
        } else {
          for (let key in vm.listLinhVuc) {
            if (String(vm.listLinhVuc[key]['domainCode']) === String(currentQuery.domain)) {
              vm.linhVucSelected = vm.listLinhVuc[key]
              vm.domainCode = vm.linhVucSelected['domainCode']
            }
          }
        }
        if (vm.listThuTucHanhChinh === null || vm.listThuTucHanhChinh === undefined || (vm.listThuTucHanhChinh !== null && vm.listThuTucHanhChinh !== undefined && vm.listThuTucHanhChinh.length === 0)) {
          vm.processListTTHC(currentQuery)
        } else {
          vm.doLoadingDataHoSo()
        }
      }
    }
  },
  methods: {
    toggleAll () {
      var vm = this
      if (!vm.thuTucHanhChinhSelected || (vm.thuTucHanhChinhSelected && vm.thuTucHanhChinhSelected.serviceConfigId === '0') || (vm.thuTucHanhChinhSelected && vm.thuTucHanhChinhSelected.serviceConfigId === '')) {
        return
      } else {
        if (vm.selected.length) {
          vm.selected = []
        } else {
          vm.selected = vm.hosoDatas.filter(function (item) {
            return item['assigned'] !== 0
          })
        }
      }
    },
    resend () {
      var vm = this
      vm.doActions(null, vm.buttonConfigItem, null, true)
    },
    closeDialogStatusAction () {
      var vm = this
      vm.dialog_statusAction = false
      vm.selected = vm.selected.filter(function (item) {
        return !item.statusAction
      })
    },
    submitFormXuLy (dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, isGroup) {
      var vm = this
      if (vm.showYkienCanBoThucHien) {
        let result = vm.$refs.ykiencanbo.doExport()
        if (result.valid) {
          vm.textNote = result.text
          vm.processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)
        }
      } else {
        vm.processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)
      }
    },
    processListTTHC (currentQuery) {
      let vm = this
      vm.$store.dispatch('loadListThuTucHanhChinh').then(function (result) {
        vm.listThuTucHanhChinh = result.map(thuTuc => {
          thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
          return thuTuc
        })
        if (currentQuery.hasOwnProperty('service_config') && String(currentQuery.service_config) !== '0') {
          for (let key in vm.listThuTucHanhChinh) {
            if (String(vm.listThuTucHanhChinh[key].serviceConfigId) === String(currentQuery.service_config)) {
              vm.thuTucHanhChinhSelected = vm.listThuTucHanhChinh[key]
              if (vm.thuTucHanhChinhSelected !== null && vm.thuTucHanhChinhSelected !== undefined && vm.thuTucHanhChinhSelected.hasOwnProperty('options')) {
                vm.govAgencyCode = vm.thuTucHanhChinhSelected.govAgencyCode
                vm.serviceCode = vm.thuTucHanhChinhSelected.serviceCode
                if (currentQuery.hasOwnProperty('template_no')) {
                  vm.listDichVu = vm.thuTucHanhChinhSelected.options
                  for (let keyDv in vm.listDichVu) {
                    if (vm.listDichVu[keyDv].templateNo === currentQuery.template_no) {
                      vm.dichVuSelected = vm.listDichVu[keyDv]
                      vm.templateNo = vm.dichVuSelected.templateNo
                    }
                  }
                } else {
                  vm.listDichVu = []
                  vm.dichVuSelected = null
                  vm.govAgencyCode = ''
                  vm.serviceCode = ''
                  vm.templateNo = ''
                }
              }
              break
            }
          }
        } else {
          vm.thuTucHanhChinhSelected = null
          vm.dichVuSelected = null
          vm.govAgencyCode = ''
          vm.serviceCode = ''
          vm.templateNo = ''
        }
        vm.doLoadingDataHoSo()
      })
    },
    processListDomain (currentQuery) {
      let vm = this
      vm.$store.dispatch('getDomainLists').then(function (result) {
        if (result.length > 0) {
          vm.listLinhVuc = result.map(domain => {
            domain['displayName'] = domain['domainCode'] + ' - ' + domain['domainName']
            return domain
          })
        }
        if (currentQuery.hasOwnProperty('domain') && String(currentQuery.domain) !== '') {
          for (let key in vm.listLinhVuc) {
            if (String(vm.listLinhVuc[key]['domainCode']) === String(currentQuery.domain)) {
              vm.linhVucSelected = vm.listLinhVuc[key]
              vm.domainCode = vm.linhVucSelected['domainCode']
            }
          }
        } else {
          vm.linhVucSelected = null
        }
        // vm.doLoadingDataHoSo()
      })
    },
    checkPemissionSpecialAction (form, currentUser, thongtinchitiet) {
      var vm = this
      var checkValue = true
      // check theo người thực hiện
      if (form !== 'PRINT_01' && form !== 'PRINT_02' && form !== 'PRINT_03' && form !== 'GUIDE' && form !== 'PREVIEW' && form !== 'BETIMES') {
        let userArr = vm.$store.getters.getUsersNextAction
        if (userArr.length > 0) {
          let check = userArr.filter(function (item) {
            return item['userId'].toString() === currentUser['userId'].toString()
          })
          if (check.length > 0) {
            checkValue = true
          } else {
            checkValue = false
          }
        } else {
          checkValue = false
        }
      }
      // check theo lastactionUser
      if (form === 'ROLLBACK_01' || form === 'ROLLBACK_02' || form === 'ROLLBACK_03') {
        // if (currentUser.userId === thongtinchitiet.lastActionUserId) {
        //   checkValue = true
        // } else {
        checkValue = false
        // }
      }
      return checkValue
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      // console.log('queryString=====', queryString)
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      let currentQuery = router.history.current.query
      console.log('currentQuery======', currentQuery)
      if (currentQuery.hasOwnProperty('q')) {
        let querySet
        if (currentQuery.q.indexOf('step') > 0) {
          querySet = currentQuery.q
          console.log('querySet------', querySet)
        } else {
          querySet = currentQuery['step'] ? currentQuery.q + '&step=' + currentQuery['step'] : currentQuery.q
        }
        var filter = null
        if (vm.menuType !== 3) {
          filter = {
            queryParams: querySet,
            /*  test Local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyCode,
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceCode,
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : vm.templateNo,
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            dossierNo: vm.dossierNoKey ? vm.dossierNoKey : ''
          }
        } else {
          filter = {
            queryParams: querySet,
            /*  test Local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : '',
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : '',
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : '',
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            dossierNo: vm.dossierNoKey ? vm.dossierNoKey : ''
          }
        }
        vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
          vm.hosoDatas = result.data
          vm.hosoDatasTotal = result.total
        }).catch(reject => {
          vm.hosoDatas = []
          vm.hosoDatasTotal = 0
        })
      }
      if (vm.menuType === 3 || String(vm.menuType) === '3') {
        setTimeout(() => {
          vm.$store.dispatch('loadingDossierCounting').then(function (result) {
            if (result !== null && result !== undefined) {
              vm.dossierCounting = result
            } else {
              vm.dossierCounting = []
            }
            vm.dossierCountingShow = true
          })
        }, 200)
      } else {
        vm.dossierCountingShow = false
      }
    },
    changeServiceConfigs (item) {
      let vm = this
      if (item !== null && item !== 'null' && item.hasOwnProperty('options')) {
        this.listDichVu = item.options
      } else {
        this.listDichVu = []
      }
      if (this.listDichVu !== null && this.listDichVu !== undefined && this.listDichVu !== 'undefined' && this.listDichVu.length > 0) {
        this.dichVuSelected = this.listDichVu[0]
        this.templateNo = this.dichVuSelected.templateNo
      } else {
        this.dichVuSelected = null
      }
      let current = vm.$router.history.current
      let newQuery = current.query
      console.log('++++++++++++++++++')
      console.log('newQuery-------', newQuery)
      console.log('current-------', current)
      console.log('++++++++++++++++++')
      let queryString = '?'
      newQuery['service_config'] = ''
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1) {
        queryString += 'step=' + newQuery['step'] + '&'
      }
      if (this.listDichVu !== null && this.listDichVu !== undefined && this.listDichVu !== 'undefined' && this.listDichVu.length > 0) {
        queryString += 'service_config=' + item.serviceConfigId
        queryString += '&template_no=' + this.dichVuSelected.templateNo
        vm.govAgencyCode = item.govAgencyCode
        vm.serviceCode = item.serviceCode
      } else {
        vm.templateNo = ''
        vm.govAgencyCode = ''
        vm.serviceCode = ''
      }
      vm.$router.push({
        path: current.path + queryString
      })
    },
    changeDomain (item) {
      console.log('change Domain')
      let vm = this
      vm.linhVucSelected = item
      if (item !== null) {
        vm.domainCode = vm.linhVucSelected['domainCode']
      } else {
        vm.domainCode = ''
      }
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['domain'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1) {
        queryString += 'step=' + newQuery['step'] + '&'
      }
      queryString += 'domain=' + vm.domainCode
      console.log('change Domain queryString', queryString)
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeDossierNoKey () {
      var vm = this
      console.log('run log ...')
      setTimeout(function () {
        if (vm.dossierNoKey) {
          if (vm.dossierNoKey.length > 3 || vm.dossierNoKey === '') {
            vm.doLoadingDataHoSo()
          }
        } else {
          vm.doLoadingDataHoSo()
        }
      }, 200)
    },
    clearDossierNoKey () {
      this.dossierNoKey = ''
      this.changeDossierNoKey()
    },
    changeDichVuConfigs (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'template_no=' + item.templateNo
      vm.templateNo = item.templateNo
      vm.$router.push({
        path: current.path + queryString
      })
    },
    btnActionEvent (dossierItem, item, index, isGroup) {
      let vm = this
      // set info buttonConfig
      vm.buttonConfigItem = {}
      vm.buttonConfigItem = item
      //
      vm.itemAction = item
      console.log('itemAction++++++++++++', item)
      vm.indexAction = index
      if (String(item.form) === 'NEW') {
        let isOpenDialog = true
        if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu.length === 1) {
          isOpenDialog = false
        }
        if (isOpenDialog) {
          // vm.thuTucHanhChinhSelected = null
          vm.dialogAction = true
        } else {
          vm.doCreateDossier()
        }
        // console.log('isOpenDialog++++++++', isOpenDialog)
      } else if (String(item.form) === 'UPDATE') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + dossierItem.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'ADD') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/bo-sung-ho-so/' + dossierItem.dossierId,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'COPY') {
        vm.doCopy(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'CANCEL') {
        vm.doCancel(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_01') {
        // Xem trước phiếu của một hồ sơ
        vm.doPrint01(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_02') {
        // Xem trước phiếu gộp của nhiều hồ sơ
        vm.doPrint02(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_03') {
        // In văn bản mới nhất đã phê duyệt
        vm.doPrint03(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'GUIDING') {
        vm.doGuiding(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PREVIEW') {
        vm.doPreview(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'ACTIONS') {
        vm.doActions(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'DELETE') {
        vm.doDeleteDossier(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'ROLLBACK_01') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(dossierItem, item, result, index, true)
      } else if (String(item.form) === 'ROLLBACK_02') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(dossierItem, item, result, index, true)
      } else if (String(item.form) === 'OVERDUE') {
        let result = {
          actionCode: 8500,
          dossierId: dossierItem.dossierId,
          overdue: dossierItem['extendDate']
        }
        vm.processPullBtnDetailRouter(dossierItem, null, result, null, 111)
      } else if (String(item.form) === 'BETIMES') {
        let result = {
          actionCode: 8400,
          dossierId: dossierItem.dossierId,
          betimes: dossierItem['extendDate']
        }
        vm.processPullBtnDetailRouter(dossierItem, null, result, null, 333)
      }
    },
    doPrint01 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint01', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doPrint02 (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          document: item.document,
          'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selected)
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doGuiding (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelected.serviceConfigId,
          serviceCode: vm.thuTucHanhChinhSelected.serviceCode,
          serviceName: vm.thuTucHanhChinhSelected.serviceName,
          typeCode: 'DOC_03'
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    doPreview (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doActions (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let result = {
        actionCode: item.action
      }
      if (isGroup) {
        vm.countSelected = 0
        if (vm.selected.length === 1) {
          for (let key in vm.selected) {
            let actionDossierItem = vm.selected[key]
            router.push({
              path: '/danh-sach-ho-so/' + vm.index + '/chi-tiet-ho-so/' + actionDossierItem['dossierId'],
              query: {
                activeTab: 'tabs-1',
                btnIndex: null
              }
            })
            // vm.processAction(actionDossierItem, item, result, key, false)
          }
        } else if (vm.selected.length > 1) {
          console.log('run doActions Landing')
          vm.$store.dispatch('loadActionActive', item).then(function () {
            vm.$store.dispatch('loadDossierSelected', vm.selected).then(function () {
              let dossiersSelect = vm.selected.map(select => {
                return select.dossierId
              }).join(',')
              let query = vm.$router.history.current.query
              query['dossiers'] = dossiersSelect
              query['actionActive'] = JSON.stringify(item)
              router.push({
                path: '/danh-sach-ho-so/' + vm.index + '/xu-ly-ho-so',
                query: query
              })
            })
          })
        } else {
          alert('Chọn hồ sơ để thao tác')
        }
      }
    },
    doCopy (dossierItem, item, index, isGroup) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId
      }
      vm.loadingAction = true
      vm.$store.dispatch('doCopy', filter).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    doCancel (dossierItem, item, index, isGroup) {
      let vm = this
      vm.loadingAction = true
      if (isGroup) {
        // console.log(vm.selected)
      } else {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        vm.$store.dispatch('doCancel', filter).then(function (result) {
          vm.loadingAction = false
          vm.indexAction = -1
          router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        }).catch(reject => {
          vm.loadingAction = false
        })
      }
    },
    doDeleteDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let x = confirm('Bạn có muốn thực hiện hành động này?')
      if (x) {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        let currentQuery = vm.$router.history.current.query
        //
        if (isGroup) {
          // console.log(vm.selected)
        } else {
          vm.$store.dispatch('deleteDossier', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          })
        }
      } else {
        return false
      }
    },
    doCreateDossier () {
      let vm = this
      let data = {
        serviceCode: vm.serviceCode,
        govAgencyCode: vm.govAgencyCode,
        templateNo: vm.templateNo,
        originality: vm.getOriginality()
      }
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    doSubmitDialogAction (item) {
      let vm = this
      if (vm.$refs.form.validate()) {
        // console.log('yes-----')
        // console.log('item++++++++', item)
        vm.doCreateDossier()
      }
    },
    processPullBtnDynamics (item) {
      let vm = this
      vm.btnDossierDynamics = []
      let filter = {
        dossierId: item.dossierId,
        dossierStatus: item.dossierStatus,
        dossierSubStatus: item.dossierSubStatus
      }
      vm.dossierId = item.dossierId
      if (vm.$router.history.current.query.hasOwnProperty('step')) {
        vm.$store.dispatch('pullNextactions', filter).then(result => {
          vm.btnDossierDynamics = result
        })
      } else {
        if (item.dossierStatus === '' || item.dossierSubStatus === '') {
          vm.$store.dispatch('pullNextactions', filter).then(result => {
            vm.btnDossierDynamics = result
          })
        } else {
          vm.btnStepsDynamics = []
          var getbuttonAction = [vm.$store.dispatch('pullNextactions', filter), vm.$store.dispatch('pullBtnConfigStep', filter)]
          Promise.all(getbuttonAction).then(result => {
            vm.btnDossierDynamics = result[0]
            vm.btnStepsDynamics = result[1]
          }).catch(reject => {
            vm.$store.dispatch('pullNextactions', filter).then(result => {
              vm.btnDossierDynamics = result
            })
          })
        }
      }
    },
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      var paymentsOut = null
      if (vm.payments) {
        paymentsOut = {
          requestPayment: vm.payments['requestPayment'],
          advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
          feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
          serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
          shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
        }
      }
      let filter = {
        dossierId: dossierItem.dossierId,
        actionCode: result.actionCode,
        toUsers: vm.assign_items,
        payment: paymentsOut,
        userNote: vm.textNote ? vm.textNote : ''
      }
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          })
        } else {
          return false
        }
      } else {
        if (!dossierItem.statusAction) {
          vm.$store.dispatch('processCheckNextActions', filter).then(function (newFilter) {
            vm.$store.dispatch('processDossierRouter', newFilter).then(function (result) {
              vm.dialogActionProcess = false
              vm.loadingActionProcess = false
              //
              if (String(item.form) === 'ACTIONS') {
                // get dossier submit fail and show on dialog
                vm.hosoDatas.splice(index, 1)
                vm.selected[index].statusAction = true
                vm.countSelected += 1
                if (vm.countSelected === vm.selected.length && vm.statusFailed > 0 && vm.selected.length > 1) {
                  vm.dialog_statusAction = true
                } else if (vm.countSelected === vm.selected.length && vm.statusFailed === 0) {
                  router.push({
                    path: vm.$router.history.current.path,
                    query: {
                      recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      q: currentQuery['q']
                    }
                  })
                }
              } else {
                router.push({
                  path: vm.$router.history.current.path,
                  query: {
                    recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                    renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                    q: currentQuery['q']
                  }
                })
              }
            }).catch(function () {
              vm.loadingActionProcess = false
              //
              if (String(item.form) === 'ACTIONS') {
                vm.countSelected += 1
                vm.statusFailed += 1
                vm.selected[index].statusAction = false
                if (vm.countSelected === vm.selected.length && vm.statusFailed > 0 && vm.selected.length > 1) {
                  vm.dialog_statusAction = true
                }
              } else {}
            })
          })
        }
      }
    },
    processPullBtnDetailRouter (dossierItem, item, result, index, btnIndex) {
      let vm = this
      let isPopup = false
      vm.dossierId = dossierItem.dossierId
      vm.showYkienCanBoThucHien = false
      vm.showFormBoSungThongTinNgan = false
      vm.showPhanCongNguoiThucHien = false
      vm.showTaoTaiLieuKetQua = false
      vm.showKyPheDuyetTaiLieu = false
      vm.showTraKetQua = false
      vm.showXacNhanThuPhi = false
      vm.showThuPhi = false
      vm.showThucHienThanhToanDienTu = false
      vm.dossierItemDialogPick = dossierItem
      vm.itemDialogPick = item
      vm.resultDialogPick = result
      vm.indexDialogPick = index
      vm.userNote = 0
      if (result !== null && result !== undefined && result !== 'undefined' &&
        (result.hasOwnProperty('userNote') || result.hasOwnProperty('extraForm') || result.hasOwnProperty('allowAssignUser') ||
        result.hasOwnProperty('createFiles') || result.hasOwnProperty('eSignature') || result.hasOwnProperty('returnFiles') ||
        result.hasOwnProperty('payment') || result.hasOwnProperty('overdue') || result.hasOwnProperty('betimes'))) {
        if (result.hasOwnProperty('userNote') && (result.userNote === 1 || result.userNote === '1' || result.userNote === 2 || result.userNote === '2')) {
          isPopup = true
          vm.showYkienCanBoThucHien = true
          vm.userNote = result.userNote
        }
        if (result.hasOwnProperty('extraForm') && result.extraForm) {
          isPopup = true
          vm.showFormBoSungThongTinNgan = true
        }
        if (result.hasOwnProperty('allowAssignUser') && result.allowAssignUser !== 0) {
          vm.assign_items = result.toUsers
          vm.type_assign = result.allowAssignUser
          isPopup = true
          vm.showPhanCongNguoiThucHien = true
        }
        if (result.hasOwnProperty('returnFiles') && result.createFiles !== null && result.createFiles !== undefined && result.createFiles !== 'undefined' && result.createFiles.length > 0) {
          isPopup = true
          vm.showTaoTaiLieuKetQua = true
        }
        if (result.hasOwnProperty('eSignature') && result.eSignature) {
          isPopup = true
          vm.showKyPheDuyetTaiLieu = true
        }
        if (result.hasOwnProperty('returnFiles') && result.returnFiles !== null && result.returnFiles !== undefined && result.returnFiles !== 'undefined' && result.returnFiles.length > 0) {
          isPopup = true
          vm.showTraKetQua = true
          vm.returnFiles = result.returnFiles
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment !== '') {
          isPopup = true
          vm.showThuPhi = true
          vm.payments = result.payment
          vm.viaPortalDetail = dossierItem.viaPostal
        }
        if (result.hasOwnProperty('overdue')) {
          isPopup = true
        }
        if (result.hasOwnProperty('betimes')) {
          isPopup = true
        }
      }
      if (isPopup) {
        /*
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
        */
        let query = {
          activeTab: 'tabs-1',
          btnIndex: btnIndex
        }
        // if (item['autoEvent']) {
        //   if (item['autoEvent'] === 'special') {
        //     query['actionSpecial'] = true
        //   }
        // }
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/chi-tiet-ho-so/' + dossierItem['dossierId'],
          query: query
        })
      } else {
        vm.processAction(dossierItem, item, result, index, true)
      }
    },
    processPullBtnDetail (dossierItem, item, index, btnIndex) {
      let vm = this
      if (item['enable'] === 1 || item['autoEvent'] === 'special') {
        vm.itemAction = item
        let filter = {
          dossierId: dossierItem.dossierId,
          actionId: item.processActionId
        }
        vm.dossierId = dossierItem.dossierId
        vm.loadingActionProcess = true
        vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
          vm.processPullBtnDetailRouter(dossierItem, item, result, index, btnIndex)
        })
      }
    },
    goBack () {
      window.history.back()
    },
    viewDetail (item, indexItem) {
      // console.log('permission: ', item.permission)
      // if (item.permission !== null && item.permission !== '') {
      router.push('/danh-sach-ho-so/' + this.index + '/chi-tiet-ho-so/' + item['dossierId'])
      // }
    },
    keywordEventChange (data) {
      let vm = this
      console.log('keywordEventChange', data)
      vm.advObjectSearch = {}
      for (let key in data) {
        if (typeof data[key] === 'string' && data[key] !== null && data[key] !== undefined && data[key] !== 'undefined') {
          if (!data[key].startsWith('keyword:') && !data[key].startsWith('year_month:') && !data[key].startsWith('top:') &&
            !data[key].startsWith('status:') && !data[key].startsWith('substatus:') && !data[key].startsWith('agency:') &&
            !data[key].startsWith('service:') && !data[key].startsWith('domain:') && !data[key].startsWith('register:')) {
            vm.advObjectSearch['keyword'] = data[key]
          }
          if (data[key].startsWith('keyword:')) {
            vm.advObjectSearch['keyword'] = data[key].replace('keyword:', '')
          } else {
            console.log('vm.advSearchItems', vm.advSearchItems)
            for (let keyTool in vm.advSearchItems) {
              if (data[key].startsWith(vm.advSearchItems[keyTool].spec + ':')) {
                vm.advObjectSearch[vm.advSearchItems[keyTool].spec] = data[key].replace(vm.advSearchItems[keyTool].spec + ':', '')
              }
            }
          }
        } else {
          let newText = data[key].value
          vm.advObjectSearch[data[key].spec] = newText.replace(data[key].spec + ':', '')
        }
      }
      console.log('advObjectSearch', vm.advObjectSearch)
      vm.advSearchItems = []
      for (let key in vm.advObjectSearch) {
        if (!vm.advObjectSearch.hasOwnProperty(key)) continue
        let value = vm.advObjectSearch[key]
        if (typeof value === 'string' && value !== null && value !== undefined && value !== '') {
          if (key === 'keyword') {
            vm.advSearchItems.push({
              spec: key,
              value: key + ':' + value,
              text: key + ':' + value,
              index: -1
            })
          } else {
            let toolIndex = -2
            for (let keyTool in vm.advSearchTools) {
              if (vm.advSearchTools[keyTool].spec === key) {
                toolIndex = vm.advSearchTools[keyTool].index
                break
              }
            }
            vm.advSearchItems.push({
              spec: key,
              value: key + ':' + value,
              text: key + ':' + value,
              index: toolIndex
            })
          }
        } else if (typeof value !== 'string' && value !== null && value !== undefined && value !== '') {
          vm.advSearchItems.push({
            spec: key,
            value: key + ':' + value.value,
            text: key + ':' + value.value,
            index: key + ':' + value.index
          })
        }
      }
      for (let keyTool in vm.advSearchTools) {
        vm.advSearchTools[keyTool].display = false
        vm.advSearchTools[keyTool].disabled = false
        if (vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== null && vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== undefined &&
          vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== '') {
          vm.advSearchTools[keyTool].display = true
          vm.advSearchTools[keyTool].disabled = true
        }
      }
      vm.doRedirectFilter()
    },
    selectedAdvFilter (item) {
      let vm = this
      vm.advSearchTools[item.index].display = true
      vm.advSearchTools[item.index].disabled = true
      let hasKey = false
      for (let key in vm.advSearchItems) {
        if (vm.advSearchItems[key].index === item.index) {
          hasKey = true
          break
        }
      }
      if (!hasKey) {
        vm.advSearchItems.push({
          spec: vm.advSearchTools[item.index].spec,
          value: vm.advSearchTools[item.index].spec + ':' + '__',
          text: vm.advSearchTools[item.index].spec + ':' + '__',
          index: item.index
        })
      }
    },
    showAdvFilter () {
      let vm = this

      vm.menusss = !vm.menusss
      vm.$store.dispatch('getStatusLists').then(function (result) {
        vm.itemFilterSupport.statusLists = result
      })
      let filter = {
        itemCode: ''
      }
      vm.$store.dispatch('getSubstatusLists', filter).then(function (result) {
        vm.itemFilterSupport.substatusLists = result
      })
      vm.$store.dispatch('getAgencyLists').then(function (result) {
        vm.itemFilterSupport.agencyLists = result
      })
      vm.$store.dispatch('getServiceLists').then(function (result) {
        vm.itemFilterSupport.serviceLists = result
      })
      vm.$store.dispatch('getDomainLists').then(function (result) {
        vm.itemFilterSupport.domainLists = result
      })
    },
    changeAdvFilterData (data, spec, index) {
      let vm = this
      if (spec === 'status') {
        let filter = {
          itemCode: data
        }
        vm.$store.dispatch('getSubstatusLists', filter).then(function (result) {
          vm.itemFilterSupport.substatusLists = result
        })
      }
      let valueFilter = data
      if (spec === 'year') {
        vm.itemFilterSupport.year = data
        valueFilter = vm.itemFilterSupport.year + '_' + vm.itemFilterSupport.month
        spec = 'year_month'
      } else if (spec === 'month') {
        vm.itemFilterSupport.month = data
        valueFilter = vm.itemFilterSupport.year + '_' + vm.itemFilterSupport.month
        spec = 'year_month'
      }
      for (let key in vm.advSearchItems) {
        if (vm.advSearchItems[key].index === index) {
          vm.advSearchItems[key].value = spec + ':' + valueFilter
          vm.advSearchItems[key].text = spec + ':' + valueFilter
          break
        }
      }
      vm.doRedirectFilter()
    },
    doRedirectFilter () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined &&
          key !== 'top' && key !== 'status' && key !== 'substatus' && key !== 'agency' && key !== 'service' && key !== 'domain' &&
          key !== 'register' && key !== 'year' && key !== 'month' && key !== 'adv_renew' && key !== 'keyword') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      for (let key in vm.advSearchItems) {
        let currentItemFilter = vm.advSearchItems[key]
        if (currentItemFilter.spec === 'year_month') {
          let currentYearMonth = currentItemFilter.text.replace(currentItemFilter.spec + ':', '')
          const [year, month] = currentYearMonth.split('_')
          queryString += 'year' + '=' + year + '&' + 'month' + '=' + month + '&'
        } else {
          queryString += currentItemFilter.spec + '=' + currentItemFilter.text.replace(currentItemFilter.spec + ':', '') + '&'
        }
      }
      queryString += 'adv_renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
      queryString = queryString.replace(/=__/g, '=')
      vm.$router.push({
        path: current.path + queryString
      })
    },
    changeAdvFilterDataChips (item) {
      let vm = this
      console.log('changeAdvFilterDataChips', vm.advSearchItems)
      let indexPush = -2
      for (let key in vm.advSearchTools) {
        if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
          if (vm.advSearchTools[key]['spec'] === 'top') {
            indexPush = vm.advSearchTools[key]['index']
            vm.advSearchTools[key].display = true
            vm.advSearchTools[key].disabled = true
          }
        } else {
          if (vm.advSearchTools[key]['spec'] === 'status') {
            indexPush = vm.advSearchTools[key]['index']
            vm.advSearchTools[key].display = true
            vm.advSearchTools[key].disabled = true
          }
        }
      }
      let typeSearch = ''
      if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
        typeSearch = 'top'
      } else {
        typeSearch = 'status'
      }
      let noFilterData = true
      for (let key in vm.advSearchItems) {
        if (vm.advSearchItems[key]['spec'] === 'status') {
          if (item.key !== 'delay' && item.key !== 'overdue' && item.key !== 'coming') {
            vm.advSearchItems[key].value = 'status' + ':' + item.key
            vm.advSearchItems[key].text = 'status' + ':' + item.key
            noFilterData = false
            break
          }
        } else if (vm.advSearchItems[key]['spec'] === 'top') {
          if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
            vm.advSearchItems[key].value = 'top' + ':' + item.key
            vm.advSearchItems[key].text = 'top' + ':' + item.key
            noFilterData = false
            break
          }
        }
      }
      if (noFilterData) {
        vm.advSearchItems.push({
          spec: typeSearch,
          value: typeSearch + ':' + item.key,
          text: typeSearch + ':' + item.key,
          index: indexPush
        })
      }
      vm.doRedirectFilter()
    }
  }
}
</script>
