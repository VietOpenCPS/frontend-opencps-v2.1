<template>
  <div>
    <div class="row-header no__hidden_class" v-if="trangThaiHoSoList">
      <div v-if="trangThaiHoSoList !== null" class="background-triangle-big"> <span>{{trangThaiHoSoList[index]['title']}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div v-if="!isMobile" class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-text-field
            v-if="trangThaiHoSoList[index]['id'].indexOf('CV_DI') !== 0 && trangThaiHoSoList[index]['id'].indexOf('CV_DEN') !== 0"
            v-model="keyword"
            placeholder="Tìm kiếm theo tên hồ sơ, mã hồ sơ, tên thủ tục, chủ hồ sơ ..."
            solo
            @change="keyword=String(keyword).trim()"
            @keyup.enter="keywordEventChange"
          ></v-text-field>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-tooltip top>
            <v-btn v-if="advSearchShow || getCountAdvSearch() === 0" slot="activator" icon class="my-0 mx-0 mr-2 px-0" v-on:click.native="showAdvFilter">
              <v-icon size="20">fas fa fa-filter</v-icon>
            </v-btn>

            <v-badge color="primary" v-if="!advSearchShow && getCountAdvSearch() >= 1" left slot="activator">
              <template slot='badge'>
                <span style="font-size: 12px;">{{getCountAdvSearch()}}</span>
              </template>
              <v-btn icon class="my-0 mr-2 px-0" v-on:click.native="showAdvFilter" style="margin-left: -7px">
                <v-icon size="20">fas fa fa-filter</v-icon>
              </v-btn>
            </v-badge>
            <span>Tìm kiếm nâng cao</span>
          </v-tooltip>
        </div>
      </div> 
    </div>
    <!-- Tìm kiếm nâng cao -->
    <tim-kiem-nang-cao :menuInfo="trangThaiHoSoList[index]" ref="advSearch" v-if="advSearchShow"></tim-kiem-nang-cao>
    <!--  -->
    <div class="menu_header_list py-2" :class='{"no__border__bottom": btnDynamics === null || btnDynamics === undefined || btnDynamics === "undefined" || (btnDynamics !== null && btnDynamics !== undefined && btnDynamics !== "undefined" && btnDynamics.length === 0)}'>
      <v-layout wrap v-if="originality !== 1 && trangThaiHoSoList">
        <v-flex v-if="!trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan') && !hiddenFilterDomain" xs12 sm3 class="pl-2 pr-2 input-group--text-field-box">
          <v-autocomplete
            placeholder="Chọn cơ quan"
            :items="agencyListXuLyThuTuc"
            v-model="agencyXuLyThuTuc"
            @change="changeAgencyXuLy"
            item-text="itemName"
            item-value="itemCode"
            hide-details
            hide-no-data
            return-object
            box
            clearable
          >
          </v-autocomplete>
        </v-flex>
        <v-flex v-if="!trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan') && !hiddenFilterDomain" xs12 sm3 class="pl-2 pr-2 input-group--text-field-box">
          <v-autocomplete
            :items="listLinhVuc"
            v-model="linhVucSelected"
            label="Chọn lĩnh vực"
            item-text="displayName"
            item-value="domainCode"
            return-object
            hide-no-data
            :hide-selected="true"
            @change="changeDomain"
            :clearable="Array.isArray(listLinhVuc) && listLinhVuc.length > 1"
            box
          ></v-autocomplete>
        </v-flex>
        <v-flex v-if="trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan')" xs12 sm3 class="pl-2 pr-2 input-group--text-field-box">
          <v-autocomplete
            :items="listCongVan"
            v-model="congvanSelected"
            label="Chọn công văn"
            item-text="displayName"
            item-value="dossierId"
            return-object
            hide-no-data
            :hide-selected="true"
            @change="changeCongVan"
            clearable
            box
            :autofocus="focusSelect === 1"
          ></v-autocomplete>
        </v-flex>
        <v-flex v-if="trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan')" xs12 sm3 class="pl-2 pr-2 input-group--text-field-box">
          <v-autocomplete
            :items="listDonviCongVan"
            v-model="donviguiSelected"
            label="Chọn đơn vị gửi công văn"
            item-text="itemName"
            item-value="itemCode"
            return-object
            hide-no-data
            :hide-selected="true"
            @change="changeDonViGuiCongVan"
            clearable
            box
          ></v-autocomplete>
        </v-flex>
        <v-flex :class="!hiddenFilterDomain || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan') || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan') ? 'xs12 sm3 pl-2 pr-2 input-group--text-field-box' : 'xs12 sm4 pl-2 pr-2 input-group--text-field-box'">
          <v-autocomplete
            :items="listThuTucHanhChinh"
            v-model="thuTucHanhChinhSelected"
            label="Chọn thủ tục hành chính"
            item-text="displayName"
            item-value="serviceConfigId"
            return-object
            hide-no-data
            :hide-selected="true"
            @change="changeServiceConfigs"
            clearable
            box
            :autofocus="focusSelect === 2"
          ></v-autocomplete>
        </v-flex>
        <v-flex :class="!hiddenFilterDomain || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan') || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan') ? 'xs12 sm3 pl-2 pr-2 input-group--text-field-box' : 'xs12 sm4 pl-2 pr-2 input-group--text-field-box'" v-if="trangThaiHoSoList">
          <v-autocomplete
            v-if="trangThaiHoSoList[index]['id'].indexOf('CV_DI') !== 0 && trangThaiHoSoList[index]['id'].indexOf('CV_DEN') !== 0"
            :items="listDichVu"
            v-model="dichVuSelected"
            label="Chọn dịch vụ"
            item-text="optionName"
            item-value="processOptionId"
            return-object
            hide-no-data
            :hide-selected="true"
            @change="changeDichVuConfigs"
            box
          ></v-autocomplete>
          <v-menu
            v-else
            ref="menuDateCV"
            v-model="menuDateCV"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              label="Chọn ngày công văn"
              slot="activator"
              class="search-input-appbar input-search"
              v-model="dateCvFormatted"
              append-icon="event"
              @blur="dateCv = parseDate(dateCvFormatted)"
              box
              clearable
            >
            </v-text-field>
            <v-date-picker v-model="dateCv" locale="vi" :first-day-of-week="1" no-title @input="changeDate()"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex v-if="trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan')" :class="!hiddenFilterDomain || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchCongVan') || trangThaiHoSoList[index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan') ? 'xs12 sm3 pl-2 pr-2' : 'xs12 sm4 pl-2 pr-2'">
          <div style="position:relative" v-if="trangThaiHoSoList">
            <v-text-field
              v-if="trangThaiHoSoList[index]['id'].indexOf('CV_DI') !== 0 && trangThaiHoSoList[index]['id'].indexOf('CV_DEN') !== 0"
              label="Nhập mã hồ sơ đầy đủ"
              v-model="dossierNoKey"
              @keyup.enter="changeDossierNoKey"
              append-icon="search"
              box
              @change="dossierNoKey=String(dossierNoKey).trim()"
              @click:append="changeDossierNoKey"
            ></v-text-field>
            <v-text-field
              v-else
              label="Nhập số công văn đầy đủ"
              v-model="documentNo"
              @keyup.enter="changeDossierNoKey"
              append-icon="search"
              box
              @click:append="changeDossierNoKey"
            ></v-text-field>
            <!-- <v-icon v-if="dossierNoKey" color="primary" @click="clearDossierNoKey" class="hover-pointer" style="position:absolute;top:15px;right:0px">clear</v-icon> -->
          </div>
        </v-flex>
      </v-layout>
      <div class="py-1 px-1" style="background: #ffffff;border-top: 1px solid lightgrey;"
        v-if="dossierCounting !== null && dossierCounting !== undefined && dossierCounting.length > 0 && dossierCountingShow"
      >
        <v-chip v-for="(item, index) in dossierCounting" v-bind:key="index"
         @click="changeAdvFilterDataChips(item)" :color="item.key === status || item.key === top ? 'orange' : ''"
        >
          <v-avatar v-if="item.key === 'deleted'" style="background-color: #da0e0e;border-color: #da0e0e;color: #fff;"><v-icon size="16">delete</v-icon></v-avatar>
          <v-avatar v-else style="background-color: #0b72ba;border-color: #0b72ba;color: #fff;">{{item.count}}</v-avatar>
          <span :style="item.key === status || item.key === top ? 'color: #fff' : ''">{{item.title}}</span>
        </v-chip>
      </div>
    </div>
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
      <v-btn color="red" dark
        v-on:click.native="btnActionEvent(null, {form: 'UNDO_DOSSIER'}, 0, true)" 
        v-if="getUser('Administrator_data') && currentQueryState['status'] !== 'deleted'"
      >
       &nbsp; &nbsp; Undo&nbsp; &nbsp;
      </v-btn>
      
      <v-menu bottom v-if="getUser('Administrator_data')" style="position:relative !important">
        <v-btn slot="activator" color="red" dark>Go to &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
        <v-list>
          <v-list-tile @click="btnActionEvent(selectedDoAction[selectedDoAction.length - 1], {form: 'GOTO_DONE'}, 0, true)" >
            <v-list-tile-title>Hoàn thành</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="btnActionEvent(selectedDoAction[selectedDoAction.length - 1], {form: 'GOTO_CANCEL'}, 0, true)">
            <v-list-tile-title>Rút hồ sơ</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="btnActionEvent(selectedDoAction[selectedDoAction.length - 1], {form: 'GOTO_DENY'}, 0, true)">
            <v-list-tile-title>Từ chối</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      
      <v-btn color="red" dark
        v-on:click.native="btnActionEvent(null, {form: 'CHANGE_DATA_DOSSIER'}, 0, true)" 
        v-if="getUser('Administrator_data') && currentQueryState['status'] !== 'deleted'"
      >
        Điều chỉnh dữ liệu
      </v-btn>

      <v-btn color="red" dark
        v-on:click.native="btnActionEvent(null, {form: 'DELETE'}, 0, true)" 
        v-if="getUser('Administrator')"
      >
        DELETE
      </v-btn>
      <v-btn color="red" dark
        v-on:click.native="btnActionEvent(null, {form: 'RESTORE_DOSSIER'}, 0, true)" 
        v-if="getUser('Administrator_data') && currentQueryState.hasOwnProperty('status') && currentQueryState['status'] === 'deleted'"
      >
        Khôi phục hồ sơ
      </v-btn>
      <!-- <v-btn color="red" dark
        v-on:click.native="btnActionEvent(null, {form: 'IMPORT'}, 0, true)"
      >
        Import hồ sơ
      </v-btn> -->
      <v-btn color="primary" v-for="(item, indexBTN) in btnDynamics" v-bind:key="indexBTN"
        v-on:click.native="btnActionEvent(null, item, indexBTN, true)" 
        v-if="(String(item.form).indexOf('VIEW') < 0 && menuType !== 3 && !hideGroupAction) || (String(item.form).indexOf('VIEW') < 0 && menuType !== 3 && hideGroupAction && String(item.form) !== 'ACTIONS') "
        :loading="loadingAction && indexBTN === indexAction"
        :disabled="loadingAction && indexBTN === indexAction"
      >
        {{item.title}}{{item.tiltle}}
        <span slot="loader">Loading...</span>
      </v-btn>
    </div>
    <!--  -->
    <v-data-table
        id="table-dossier"
        :headers="headers"
        :items="hosoDatas"
        :total-items="hosoDatasTotal"
        v-model="selected"
        item-key="dossierId"
        :select-all="(menuType !== 3 && originality !== 1 && btnDynamics.length > 0) || getUser('Administrator') || getUser('Administrator_data')"
        class="table-landing table-bordered"
        no-data-text="Không có hồ sơ nào"
        hide-actions
      >
      <!--  -->
      <template slot="headers" slot-scope="props">
        <tr>
          <th width="32px" class="v_data_table_check_all" v-if="(menuType !== 3 && originality !== 1 && btnDynamics.length > 0) || getUser('Administrator') || getUser('Administrator_data')">
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.native="toggleAll"
              v-if="getUser('Administrator')"
            ></v-checkbox>
            <v-checkbox v-else
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              :disabled="!thuTucHanhChinhSelected && (!doActionGroup || !doActionGroupKhacThuTuc) || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '0' && (!doActionGroup || !doActionGroupKhacThuTuc)) || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '' && (!doActionGroup || !doActionGroupKhacThuTuc))"
              primary
              hide-details
              @click.native="toggleAll"
            ></v-checkbox>
          </th>
          <th v-if="!isMobile"
            v-for="header in props.headers"
            :key="header.text"
            :class="header['class'] ? header['class'] : ''"
            :width="header['width'] ? header['width'] + 'px' : ''"
            @click="String(header['sortable']) === 'true' ? sortAction(header['value']) : ''"
            :style="header['sortable'] ? 'cursor: pointer' : ''"
          >
            <v-tooltip bottom>
              <span slot="activator">{{ header.text }}</span>
              <span>{{ header.text }}</span>
            </v-tooltip> 
            <v-icon v-if="header['sortable'] && header['value'] === sortValue" size="16" class="ml-2" :style="header['sortable'] && orderSort==='false' ? 'transform: rotate(180deg)' : ''">arrow_downward</v-icon>
            <v-icon v-if="header['sortable'] && header['value'] !== sortValue" size="16" class="ml-2" style="opacity: 0.5">arrow_downward</v-icon>
          </th>
          <!--  -->
          <th width="30px" v-if="isMobile">
            <span>STT</span>
          </th>
          <th v-if="isMobile">
            <span>Tên thủ tục</span>
          </th>
          <!--  -->
          <th width="30px" v-if="isMobile"></th>
          <!--  -->
        </tr>
      </template>
      <!--  -->
      <template slot="items" slot-scope="props">
        <tr>
          <td width="32px" class="v_data_table_check_all" v-if="(menuType !== 3 && originality !== 1 && btnDynamics.length > 0) || getUser('Administrator') || getUser('Administrator_data')">
            <v-checkbox
              v-model="props.selected"
              @change="changeSelected"
              primary
              hide-details
              color="primary"
              v-if="getUser('Administrator') || getUser('Administrator_data')"
            ></v-checkbox>
            <v-checkbox v-else
              :disabled="props.item['assigned'] === 0 && (!doActionGroup || !doActionGroupKhacThuTuc) || (!thuTucHanhChinhSelected && !doActionGroupKhacThuTuc) || 
              (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '0' && !doActionGroupKhacThuTuc) || (thuTucHanhChinhSelected && thuTucHanhChinhSelected.serviceConfigId === '' && !doActionGroupKhacThuTuc)"
              v-model="props.selected"
              @change="changeSelected"
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
              {{ hosoDatasPage * limitRecord - limitRecord + props.index + 1 }}
            </span>
          </td>
          <!-- desktop -->
          <td v-for="(itemHeader, indexHeader) in headers" v-bind:key="indexHeader + '_' + props.item.dossierId"
            :class="itemHeader['class_column']"
            v-if="!isMobile && itemHeader.hasOwnProperty('value')"
          >
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;word-break: break-word;" :class="{'no_acction__event': !props.item['permission']}">
              <template-rendering v-if="itemHeader.hasOwnProperty('layout_view')" :item="props.item" :layout_view="itemHeader.layout_view"></template-rendering>
              <span v-else>
                {{ props.item[itemHeader.value] }}
              </span>
            </div>
          </td>
          <!-- mobile -->
          <td class="px-1 py-0" v-if="isMobile">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;word-break: break-word;" :class="{'no_acction__event': !props.item['permission']}">
              <span class="primary--text" v-if="props.item.dossierNo"> {{ props.item.dossierNo }} - </span><span class="primary--text"> {{ props.item.online ? 'Hồ sơ trực tuyến' : 'Hồ sơ một cửa' }}</span><br>
              <span class="primary--text text-bold"> {{ props.item.serviceName }} </span><br>
              <span class="text-bold">Chủ hồ sơ: </span> <span>{{ props.item.applicantName }}</span><br>
              <span class="text-bold">Tiếp nhận: </span> <span>{{ props.item.receiveDate }}</span><br>
              <span class="text-bold">Hẹn trả: </span> <span>{{ props.item.dueDate }}</span><br>
              <span v-if="props.item.dossierOverdue" :class="props.item.dossierOverdue.indexOf('Quá hạn') >= 0 ? 'red--text' : 'green--text'">{{ props.item.dossierOverdue }}</span>
            </div>
          </td>
          <!--  -->
          <td class="text-xs-center px-0 py-0" v-if="!hideAction">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-menu left :nudge-left="50" :nudge-top="15" 
              v-if="!loadingTable && ((btnDynamics !== null || btnDynamics !== undefined || btnDynamics !== 'undefined') || 
                (btnDossierDynamics !== null || btnDossierDynamics !== undefined || btnDossierDynamics !== 'undefined'))">
              <v-btn class="mx-0 my-0" slot="activator" icon @click="processPullBtnDynamics(props.item)">
                <v-icon>filter_list</v-icon>
              </v-btn>
              <v-list>
                <!-- :class="{'no_acction__event': (item['enable'] === 2 || props.item['assigned'] === 0)}" -->
                <v-list-tile v-for="(item, i) in btnDynamics" :key="i + '_menu_' + props.item.dossierId" 
                  @click="btnActionEvent(props.item, item, props.index, false)"
                  :disabled="String(props.item['permission']).indexOf('write') === -1"
                  v-if="menuType === 3"
                  >
                  <v-list-tile-title>{{item.title}}{{item.tiltle}}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-for="(item, i) in btnDossierDynamics" :key="i + '_' + props.item.dossierId" 
                  @click="processPullBtnDetail(props.item, item, props.index, i)" 
                  :disabled="item['enable'] === 2 || String(props.item['permission']).indexOf('write') === -1"
                  v-if="(item['enable'] > 0 || item['autoEvent'] === 'special') && menuType !== 3"
                  >
                  <v-list-tile-title>{{ item.actionName }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-for="(item, i) in btnStepsDynamics" :key="i + '_' + props.item.dossierId + '_' + props.item.dossierId"
                  v-if="String(props.item['permission']).indexOf('write') !== -1 && String(item.form) !== 'NEW' && menuType !== 3
                    && (!item.hasOwnProperty('roleCode') || item.hasOwnProperty('roleCode') && getUser(item.roleCode))
                  "
                  @click="btnActionEvent(props.item, item, index, false)"
                >
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="(trangThaiHoSoList[index]['id'].indexOf('CV_DI') === 0 || trangThaiHoSoList[index]['id'].indexOf('CV_DEN') !== 0) &&
                props.item.metaData && getMetaData(props.item).hasOwnProperty('congvandagui') && !getMetaData(props.item)['congvandagui']" @click="deleteCongVan(props.item, props.index)">
                  Xóa công văn
                </v-list-tile>
                <v-list-tile @click="viewDetail(props.item, props.index)" :disabled="!props.item['permission']">
                  Xem chi tiết
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-xs-right layout wrap" style="position: relative;">
      <div class="flex pagging-table px-2" :class="isMobile ? 'mt-2' : ''"> 
        <!-- <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" :numberPerPage="limitRecord" :showLimit="showLimit ? showLimit : false" custom-class="custom-tiny-class" 
          :limits="limits" @tiny:change-page="paggingData" ></tiny-pagination>  -->
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" :numberPerPage="limitRecord" :showLimit="true" custom-class="custom-tiny-class" 
          :limits="limits" @tiny:change-page="paggingData" ></tiny-pagination> 
      </div>
    </div>
    <v-dialog v-model="dialogAction" max-width="700" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form1" v-model="valid" lazy-validation>
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{itemAction.title}}{{itemAction.tiltle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogAction = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pb-0 pt-4">
            <v-layout wrap>
              <v-flex xs12 class="px-2 pb-3">
                <v-autocomplete
                  label="Thủ tục:"
                  :items="listThuTucHanhChinh"
                  v-model="thuTucHanhChinhSelected"
                  :rules="[v => !!v || 'Thủ tục hành chính bắt buộc phải chọn']"
                  required
                  placeholder="Chọn thủ tục hành chính"
                  item-text="displayName"
                  item-value="serviceConfigId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  @change ="changeServiceConfigs"
                  box
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-2">
                <v-autocomplete
                  :items="listDichVu"
                  v-model="dichVuSelected"
                  label="Dịch vụ:"
                  placeholder="Chọn dịch vụ"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  v-if="thuTucHanhChinhSelected && listDichVu.length > 1"
                  :rules="[v => !!v || 'Dịch vụ bắt buộc phải chọn']"
                  @change="changeDichVuConfigs"
                  required
                  box
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-spacer></v-spacer>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogAction = false"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>reply</v-icon>&nbsp;
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
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>{{itemAction.actionName}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogActionProcess = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="py-0 px-0">
            <v-layout wrap>
              <phan-cong v-if="dialogActionProcess && showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign" ></phan-cong>
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
            <v-icon>reply</v-icon>&nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPDF" max-width="1000" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>{{itemAction.title}}{{itemAction.tiltle}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
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
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Trạng thái xử lý</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="closeDialogStatusAction">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
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
    <!-- Form phiếu hướng dẫn -->
    <v-dialog v-model="dialog_printGuide" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin phiếu hướng dẫn hoàn thiện hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_printGuide = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formGuide" v-model="validGuide" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thủ tục hành chính <span style="color:red">*</span>:</div>
                <v-autocomplete
                  box
                  class="input-group--text-field-box"
                  :items="listThuTucHanhChinh"
                  v-model="thuTucHanhChinhSelectedGuide"
                  placeholder="Chọn thủ tục hành chính"
                  item-text="displayName"
                  item-value="serviceConfigId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  @change="changeServiceConfigsGuide"
                  :rules="[v => !!v || 'Thủ tục bắt buộc phải chọn.']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Dịch vụ <span style="color:red">*</span>:</div>
                <v-autocomplete
                  box
                  class="input-group--text-field-box"
                  :items="listDichVuGuide"
                  v-model="dichVuSelectedGuide"
                  placeholder="Chọn dịch vụ"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  :rules="[v => !!v || 'Dịch vụ bắt buộc phải chọn.']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-2" style="position:relative">
                <div class="my-2 text-bold">Tên người làm thủ tục <span style="color:red">*</span>:</div>
                <v-text-field
                  placeholder="Nhập tên người làm thủ tục"
                  box
                  v-model="applicantNameGuide"
                  :rules="[rules.required, rules.varchar500]"
                  required
                ></v-text-field>
                <v-radio-group class="my-0" v-model="applicantTypeGuide" row style="position:absolute;right:0;top:0">
                  <v-radio label="Công dân" :value="true"></v-radio>
                  <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Địa chỉ:</div>
                <v-text-field
                  placeholder="Nhập địa chỉ"
                  box
                  :rules="[rules.varchar500]"
                  v-model="applicantAddressGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thư điện tử:</div>
                <v-text-field
                  box
                  placeholder="Nhập thư điện tử"
                  v-model="applicantEmailGuide"
                  :rules="[rules.varchar100]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Số điện thoại:</div>
                <v-text-field
                  box
                  placeholder="Nhập số điện thoại"
                  v-model="applicantTelNoGuide"
                  :rules="[rules.varchar100]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thông tin thành phần hồ sơ:</div>
                <v-data-table
                  :headers="headersTphsGuide"
                  :items="tphsGuide"
                  hide-actions
                  class="table-landing table-bordered"
                  style="border-left: 1px solid #dedede"
                >
                  <template slot="items" slot-scope="props">
                    <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                      <td class="text-xs-center" style="width:50px">
                        <div>
                          <span>{{props.index + 1}}</span><br>
                        </div>
                      </td>
                      <td class="text-xs-left">
                        <div>
                          <span>{{props.item.partName}}</span>
                        </div>
                      </td>
                      <td class="text-xs-center" style="width: 50px">
                        <div>
                          <v-checkbox
                            v-model="props.item.fileMark"
                            primary
                            hide-details
                            color="primary"
                            style="display: inline-block;width: 25px"
                          ></v-checkbox>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Ghi chú:</div>
                <v-textarea class="py-0"
                box
                v-model="applicantNoteGuide"
                rows="3"
                :rules="[rules.varchar5000]"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doGuiding('doc')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>save</v-icon> &nbsp;
            Lưu phiếu hướng dẫn
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn class="mr-3" color="primary" @click="doGuiding('pdf')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>print</v-icon> &nbsp;
            In phiếu hướng dẫn
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Form phiếu từ chối -->
    <v-dialog v-model="dialog_denied" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin phiếu từ chối tiếp nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_denied = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formDenied" v-model="validDenied" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thủ tục hành chính <span style="color:red">*</span>:</div>
                <v-autocomplete
                  box
                  class="input-group--text-field-box"
                  :items="listThuTucHanhChinh"
                  v-model="thuTucHanhChinhSelectedGuide"
                  placeholder="Chọn thủ tục hành chính"
                  item-text="displayName"
                  item-value="serviceConfigId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  @change="changeServiceConfigsGuide"
                  :rules="[v => !!v || 'Thủ tục bắt buộc phải chọn.']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Dịch vụ <span style="color:red">*</span>:</div>
                <v-autocomplete
                  box
                  class="input-group--text-field-box"
                  :items="listDichVuGuide"
                  v-model="dichVuSelectedGuide"
                  placeholder="Chọn dịch vụ"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  hide-no-data
                  :hide-selected="true"
                  :rules="[v => !!v || 'Dịch vụ bắt buộc phải chọn.']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-2" style="position:relative">
                <div class="my-2 text-bold">Tên người làm thủ tục <span style="color:red">*</span>:</div>
                <v-text-field
                  placeholder="Nhập tên người làm thủ tục"
                  box
                  v-model="applicantNameGuide"
                  :rules="[rules.required, rules.varchar500]"
                  required
                ></v-text-field>
                <v-radio-group class="my-0" v-model="applicantTypeGuide" row style="position:absolute;right:0;top:0">
                  <v-radio label="Công dân" :value="true"></v-radio>
                  <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Địa chỉ:</div>
                <v-text-field
                  placeholder="Nhập địa chỉ"
                  box
                  v-model="applicantAddressGuide"
                  :rules="[rules.varchar500]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thư điện tử:</div>
                <v-text-field
                  box
                  placeholder="Nhập thư điện tử"
                  v-model="applicantEmailGuide"
                  :rules="[rules.varchar100]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Số điện thoại:</div>
                <v-text-field
                  box
                  v-model="applicantTelNoGuide"
                  :rules="[rules.varchar100]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Lý do từ chối tiếp nhận:</div>
                <v-textarea class="py-0"
                box
                v-model="applicantNoteGuide"
                rows="3"
                :rules="[rules.varchar5000]"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doDenied('doc')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>save</v-icon> &nbsp;
            Lưu phiếu từ chối
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn class="mr-3" color="primary" @click="doDenied('pdf')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>print</v-icon> &nbsp;
            In phiếu từ chối
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Form điều chỉnh hồ sơ -->
    <v-dialog v-model="dialog_extraForm" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>
            Điều chỉnh dữ liệu mã hồ sơ: {{selectedDoAction.length > 0 ? selectedDoAction[selectedDoAction.length - 1]['dossierNo'] : ''}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_extraForm = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text flat class="px-0">
          <form-bo-sung-thong-tin ref="formBoSungThongTinNgan" :dossier_id="dossierIdSelected" :action_id="actionId" :type="'dieuchinhdulieu'"></form-bo-sung-thong-tin>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doChangeDossierExtraForm()">
            <v-icon>save</v-icon> &nbsp;
            Xác nhận
          </v-btn>
          <v-btn class="mr-3" color="primary" @click="dialog_extraForm = false">
            <v-icon>clear</v-icon> &nbsp;
            Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
import toastr from 'toastr'
import $ from 'jquery'
import TemplateRendering from './pagging/template_rendering.vue'
import TinyPagination from './pagging/opencps_pagination.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import support from '../store/support.json'
import FormBoSungThongTinNgan from './form_xu_ly/FormBoSungThongTinNgan.vue'
import AdvSearch from './TimKiemNangCao'

export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination,
    'phan-cong': PhanCong,
    'y-kien-can-bo': YkienCanBoThucHien,
    'template-rendering': TemplateRendering,
    'form-bo-sung-thong-tin': FormBoSungThongTinNgan,
    'tim-kiem-nang-cao': AdvSearch
  },
  data: () => ({
    xacthuc_BNG: false,
    doActionGroup: false,
    doActionGroupKhacThuTuc: false,
    agencyListXuLyThuTuc: [],
    agencyXuLyThuTuc: '',
    isAdminSuper: false,
    actionId: '',
    dossierIdSelected: '',
    agencyCode: '',
    dossierCountingShow: false,
    dossierCounting: [],
    advSearchToolsSelected: [],
    advSearchTools: support.advSearchTools,
    advSearchItems: [],
    advObjectSearch: {},
    menusss: false,
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
    dialog_printGuide: false,
    dialog_denied: false,
    dialog_extraForm: false,
    validGuide: false,
    validDenied: false,
    applicantNameGuide: '',
    applicantEmailGuide: '',
    applicantTelNoGuide: '',
    applicantNoteGuide: '',
    applicantAddressGuide: '',
    reasonNote: '',
    dossierSelected: [],
    /** */
    buttonConfigItem: {},
    /* ý kiến cán bộ */
    textNote: '',
    /** */
    thongtinhoso: {},
    dossierId: 0,
    valid: false,
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
    hideGroupAction: false,
    hosoDatas: [],
    hosoDatasTotal: 0,
    hosoDatasPage: 1,
    limitRecord: 15,
    hosoTotalPage: 0,
    selectedDoAction: [],
    selectMultiplePage: [],
    selected: [],
    listThuTucHanhChinh: [],
    listThuTuc: [],
    thuTucHanhChinhSelected: null,
    thuTucHanhChinhSelectedGuide: null,
    docTypePrint: '',
    listCongVan: [],
    congvanSelected: null,
    listDonviCongVan: [],
    donviguiSelected: null,
    listLinhVuc: [],
    linhVucSelected: null,
    listDichVuGuide: [],
    dichVuSelectedGuide: null,
    templateNoGuide: '',
    domainCode: '',
    govAgencyCode: '',
    serviceCode: '',
    templateNo: '',
    dossierNoKey: '',
    documentNo: '',
    dateCvFormatted: '',
    menuDateCV: false,
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
    checkSelectAll: false,
    titleLanding: '',
    currentQueryState: '',
    tphsGuide: [],
    headersTphsGuide: [
      {
        text: 'TT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thành phần',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đã có',
        align: 'center',
        sortable: false
      }
    ],
    applicantTypeGuide: true,
    limits: [],
    showLimit: false,
    advSearchShow: false,
    filterKeyAdvSearch: ['status','substatus','top','agency','domain','register','fromReceiveDate','toReceiveDate',
      'fromDueDate','toDueDate','fromReleaseDate','toReleaseDate','fromFinishDate','toFinishDate','documentNo','dateCv'
    ],
    status: '',
    top: '',
    orderSort: '',
    sortValue: '',
    govAgencyFilterMenuConfig: '',
    groupServiceFilterMenuConfig: '',
    disableSearchAgency: false,
    hiddenFilterDomain: false,
    focusSelect: 0,
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      cmndHoChieu: (value) => {
        const pattern = /^(?![0-9]{4,12})[0-9a-zA-Z]{4,12}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 4-12 ký tự'
      },
      email: (value) => {
        value = value.trim()
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        if(typeof value === 'string'){
          value = value.trim()
        }
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      },
      varchar50: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
        } else {
          return true
        }  
      },
      varchar100: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 100 ? true : 'Không được nhập quá 100 ký tự'   
        } else {
          return true
        }  
      },
      varchar255: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 255 ? true : 'Không được nhập quá 255 ký tự'   
        } else {
          return true
        }  
      },
      varchar500: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 500 ? true : 'Không được nhập quá 500 ký tự'   
        } else {
          return true
        }  
      },
      varchar5000: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
        } else {
          return true
        }
      },
    }
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
    },
    activeLoadingDataHoSo () {
      return this.$store.getters.activeLoadingDataHoSo
    },
    activePrintBienNhan () {
      return this.$store.getters.getActivePrintBienNhan
    },
    itemsFilterAdv () {
      return this.$store.getters.getItemsFilterAdv
    },
    // advSearchShow () {
    //   return this.$store.getters.advSearchShow
    // },
    isMobile () {
      return this.$store.getters.getIsMobile
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
    },
    employeeLoginInfomation () {
      return this.$store.getters.getEmployeeLogin
    },
  },
  created () {
    let vm = this
    vm.selectMultiplePage = []
    vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      let currentQuery = vm.$router.history.current.query
      if (vm.isMobile) {
        $('#m-navigation').css('display', 'block')
      }
      
      vm.currentQueryState = query
      vm.keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.status = currentQuery.hasOwnProperty('status') ? currentQuery.status : ''
      vm.top = currentQuery.hasOwnProperty('top') ? currentQuery.top : ''
      if (query.hasOwnProperty('page') && query['page'] !== '1') {
        vm.hosoDatasPage = parseInt(query['page'])
      } else {
        vm.hosoDatasPage = 1
      }
      vm.getGovAgency()
      if (vm.activePrintBienNhan) {
        vm.itemAction = {
          title: 'In phiếu biên nhận',
          form: 'PRINT_03'
        }
        $(window).scrollTop(0)
        setTimeout(function () {
          let dossier = {
            dossierId: vm.activePrintBienNhan
          }
          vm.doPrint03(dossier)
          vm.$store.commit('setActivePrintBienNhan', '')
        }, 500)
      }
      try {
        if (xacthuc_BNG) {
          vm.xacthuc_BNG = true
          vm.getFieldPick()
        }
      } catch (error) {
      }
    })
  },
  updated () {
    var vm = this
    console.log('run updated')
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      vm.currentQueryState = currentQuery
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.$store.commit('setLoadingDynamicBtn', true)
        setTimeout(() => {
          vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
            vm.btnDynamics = []
            vm.trangThaiHoSoList = result
            vm.menuType = parseInt(vm.trangThaiHoSoList[vm.index]['menuType'])
            vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
            vm.doActionGroup = vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('activeGroupAction') && vm.trangThaiHoSoList[vm.index]['tableConfig'].activeGroupAction
            vm.doActionGroupKhacThuTuc = vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('activeGroupActionService') && vm.trangThaiHoSoList[vm.index]['tableConfig'].activeGroupActionService
            // 
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchGovAgencyCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode) {
              vm.govAgencyFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('groupServiceCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode) {
              vm.groupServiceFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('disableSearchAgency') && vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency) {
              vm.disableSearchAgency = vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hiddenFilterDomain') && vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain) {
              vm.hiddenFilterDomain = vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain
            }
            // 
            vm.processListTTHC(currentQuery)
            if (!vm.hiddenFilterDomain) {
              vm.processListDomain(currentQuery)
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
              vm.processListCongVan(currentQuery)
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan')) {
              vm.getDonViCongVan(currentQuery)
            }
            // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('headers')) {
              vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
              vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideGroupAction')) {
              vm.hideGroupAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideGroupAction']
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
                  for (let keyOnlyStep in btnDynamicsOnlySteps) {
                    for (var i = 0; i < btnDynamicsOnlySteps[keyOnlyStep].onlySteps.length; i++) {
                      if (String(btnDynamicsOnlySteps[keyOnlyStep].onlySteps[i]) === String(currentStep.stepCode)) {
                        vm.btnDynamics.push(btnDynamicsOnlySteps[keyOnlyStep])
                      }
                    }
                  }
                  break
                }
              }
            }
            console.log('btnDynamics_menu 1', vm.btnDynamics)
            vm.$store.commit('setLoadingDynamicBtn', false)
          }).catch(function (){})
        }, 200)
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      console.log('run watched')
      let vm = this
      vm.dossierNoKey = ''
      vm.linhVucSelected = ''
      vm.domainCode = ''
      let currentQuery = newRoute.query
      let currentQueryOld = oldRoute.query
      vm.currentQueryState = currentQuery
      vm.doActionGroup = vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('activeGroupAction') && vm.trangThaiHoSoList[vm.index]['tableConfig'].activeGroupAction
      vm.doActionGroupKhacThuTuc = vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('activeGroupActionService') && vm.trangThaiHoSoList[vm.index]['tableConfig'].activeGroupActionService
      vm.keyword = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.status = currentQuery.hasOwnProperty('status') ? currentQuery.status : ''
      vm.top = currentQuery.hasOwnProperty('top') ? currentQuery.top : ''
      vm.orderSort = currentQuery.hasOwnProperty('order') ? currentQuery.order : ''
      vm.sortValue = currentQuery.hasOwnProperty('sort') ? currentQuery.sort : ''
      vm.documentNo = currentQuery.hasOwnProperty('documentNo') ? currentQuery.documentNo : ''
      vm.dateCv = currentQuery.hasOwnProperty('dateCv') ? vm.parseDate(currentQuery.dateCv) : ''
      vm.dateCvFormatted = vm.formatDate(vm.dateCv)
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchGovAgencyCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode) {
        vm.govAgencyFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('groupServiceCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode) {
        vm.groupServiceFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('disableSearchAgency') && vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency) {
        vm.disableSearchAgency = vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hiddenFilterDomain') && vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain) {
        vm.hiddenFilterDomain = vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain
      }
      if (currentQuery.hasOwnProperty('q')) {
        vm.btnDynamics = []
        vm.$store.commit('setLoadingDynamicBtn', true)
        vm.menuType = vm.trangThaiHoSoList[vm.index]['menuType']
        vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
        // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
        vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
          vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
        }
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideGroupAction')) {
          vm.hideGroupAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideGroupAction']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
          vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('layout_view')) {
          vm.filterForm = vm.trangThaiHoSoList[vm.index]['buttonConfig']['layout_view']
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
              for (let keyOnlySteps in btnDynamicsOnlySteps) {
                for (var i = 0; i < btnDynamicsOnlySteps[keyOnlySteps].onlySteps.length; i++) {
                  if (String(btnDynamicsOnlySteps[keyOnlySteps].onlySteps[i]) === String(currentStep.stepCode)) {
                    vm.btnDynamics.push(btnDynamicsOnlySteps[keyOnlySteps])
                  }
                }
              }
              break
            }
          }
        }
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = parseInt(currentQuery.page)
          if (currentQuery.page === currentQueryOld['page']) {
            vm.selectMultiplePage = []
          }
        } else {
          vm.hosoDatasPage = 1
          vm.selectMultiplePage = []
        }
        vm.$store.commit('setLoadingDynamicBtn', false)
        if (!vm.hiddenFilterDomain) {
          if (vm.listLinhVuc === null || vm.listLinhVuc === undefined || (vm.listLinhVuc !== null && vm.listLinhVuc !== undefined && vm.listLinhVuc.length === 0)) {
            vm.processListDomain(currentQuery)
          } else {
            if (vm.listLinhVuc.length === 1 && !vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
              vm.linhVucSelected = vm.listLinhVuc[0]
              vm.domainCode = vm.linhVucSelected['domainCode']
            } else {
              vm.linhVucSelected = ''
              vm.domainCode = ''
            }
            for (let key in vm.listLinhVuc) {
              if (!vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
                if (String(vm.listLinhVuc[key]['domainCode']) === String(currentQuery.domain)) {
                  vm.linhVucSelected = vm.listLinhVuc[key]
                  vm.domainCode = vm.linhVucSelected['domainCode']
                }
                console.log('linhVucSelected watch', vm.linhVucSelected)
              }
            }
          }
        }
        
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
          vm.processListCongVan(currentQuery)
        }
        vm.getGovAgency()
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchDonViGuiCongVan')) {
          vm.getDonViCongVan(currentQuery)
        }
        // if (vm.listThuTucHanhChinh === null || vm.listThuTucHanhChinh === undefined || (vm.listThuTucHanhChinh !== null && vm.listThuTucHanhChinh !== undefined && vm.listThuTucHanhChinh.length === 0)) {
          console.log('watchRouter', currentQuery)
          vm.processListTTHC(currentQuery)
        // } else {
          // vm.doLoadingDataHoSo()
        // }
      }
    },
    activeLoadingDataHoSo (val) {
      var vm = this
      setTimeout(function () {
        vm.doLoadingDataHoSo()
      }, 100)
    },
    selectMultiplePage: {
      handler: function (val) {
        let vm = this
        if (val.length > 0) {
          vm.selectedDoAction = []
          for (let key in val) {
            vm.selectedDoAction = vm.selectedDoAction.concat(val[key]['selected'])
          }
        } else {
          vm.selectedDoAction = []
        }
        // console.log('selectedDoAction', vm.selectedDoAction)
        vm.$store.commit('setDossierSelectedDoAction', vm.selectedDoAction)
        
      },
      deep: true
    },

    dichVuSelectedGuide (val) {
      let vm = this
      if (val) {
        vm.templateNoGuide = val['templateNo']
        val.dossierTemplateNo = val['templateNo']
        // console.log('val_dichVuSelectedGuide', val)
        vm.$store.dispatch('loadDossierTemplates', val).then(function (result) {
          for (let key in result['dossierParts']) {
            result['dossierParts'][key].fileMark = true
          }
          vm.tphsGuide = result['dossierParts'].filter(function (item) {
            return item['partType'] === 1
          })
        }).catch(function (){})
      }
    },
    trangThaiHoSoList (val) {
      let vm = this
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('pagination') && vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination']) {
        vm.limits = vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination'].filter(function (item) {
          return Number(item) <= 100
        })
        if (vm.limits.length > 0) {
          vm.limitRecord = vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination'][0]
          vm.showLimit = true
        } else {
          vm.showLimit = false
          vm.limitRecord = 15
        }
      } else {
        vm.showLimit = false
        vm.limitRecord = 15
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchGovAgencyCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode) {
        vm.govAgencyFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('groupServiceCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode) {
        vm.groupServiceFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('disableSearchAgency') && vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency) {
        vm.disableSearchAgency = vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hiddenFilterDomain') && vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain) {
        vm.hiddenFilterDomain = vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain
      }
      console.log('govAgencyFilterMenuConfig', vm.govAgencyFilterMenuConfig, vm.groupServiceFilterMenuConfig)
    },
    index (val) {
      let vm = this
      console.log('indexMenu', vm.index)
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('pagination') && vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination']) {
        vm.limits = vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination'].filter(function (item) {
          return Number(item) <= 100
        })
        if (vm.limits.length > 0) {
          vm.limitRecord = vm.trangThaiHoSoList[vm.index]['tableConfig']['pagination'][0]
          vm.showLimit = true
        } else {
          vm.showLimit = false
          vm.limitRecord = 15
        }
      } else {
        vm.showLimit = false
        vm.limitRecord = 15
      }

      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchGovAgencyCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode) {
        vm.govAgencyFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].searchGovAgencyCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('groupServiceCode') && vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode) {
        vm.groupServiceFilterMenuConfig = vm.trangThaiHoSoList[vm.index]['tableConfig'].groupServiceCode
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('disableSearchAgency') && vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency) {
        vm.disableSearchAgency = vm.trangThaiHoSoList[vm.index]['tableConfig'].disableSearchAgency
      }
      if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hiddenFilterDomain') && vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain) {
        vm.hiddenFilterDomain = vm.trangThaiHoSoList[vm.index]['tableConfig'].hiddenFilterDomain
      }
      console.log('govAgencyFilterMenuConfig333', vm.govAgencyFilterMenuConfig, vm.groupServiceFilterMenuConfig)
    }
  },
  methods: {
    toggleAll () {
      var vm = this
      /*
      if (window.themeDisplay !== null && window.themeDisplay !== undefined && String(window.themeDisplay.getUserId()) === '20139') {
        vm.isAdminSuper = true
      }
      */
      if (vm.getUser('Administrator') || vm.doActionGroup || vm.doActionGroupKhacThuTuc) {
        if (vm.selected.length) {
          vm.selected = []
        } else {
          vm.selected = vm.hosoDatas
        }
      } else {
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
      }
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selected
      // console.log('selected toggle all', vm.selectMultiplePage)
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)
    },
    changeSelected () {
      let vm = this
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selected
      // console.log('selected item', vm.selectMultiplePage)
    },
    resend () {
      var vm = this
      vm.doActions(null, vm.buttonConfigItem, null, true)
    },
    closeDialogStatusAction () {
      var vm = this
      vm.dialog_statusAction = false
      vm.selectedDoAction = vm.selectedDoAction.filter(function (item) {
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
      let filterGetService = {
        searchGovAgencyCode: vm.govAgencyFilterMenuConfig,
        groupServiceCode: vm.groupServiceFilterMenuConfig
      }
      vm.$store.dispatch('loadListThuTucHanhChinh', filterGetService).then(function (result) {
        if (!currentQuery.hasOwnProperty('domain') || (currentQuery.hasOwnProperty('domain') && String(currentQuery.domain) === '')) {
          vm.listThuTucHanhChinh = result.map(thuTuc => {
            thuTuc['displayName'] = thuTuc['serviceCodeDVCQG'] ? thuTuc['serviceCodeDVCQG'] + ' - ' + thuTuc['serviceName'] : thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
            // thuTuc['displayName'] = thuTuc['serviceName']
            return thuTuc
          })
          // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
        }
        vm.listThuTuc = result.map(thuTuc => {
          thuTuc['displayName'] = thuTuc['serviceCodeDVCQG'] ? thuTuc['serviceCodeDVCQG'] + ' - ' + thuTuc['serviceName'] : thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
          // thuTuc['displayName'] = thuTuc['serviceName']
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
          console.log('thuTucHanhChinhSelected---999', vm.thuTucHanhChinhSelected, vm.dichVuSelected)
        } else {
          vm.thuTucHanhChinhSelected = null
          vm.dichVuSelected = null
          vm.govAgencyCode = ''
          vm.serviceCode = ''
          vm.templateNo = ''
        }
        console.log('thuTucHanhChinhSelected---7777', vm.thuTucHanhChinhSelected, vm.dichVuSelected)
        vm.doLoadingDataHoSo()
      }).catch(function (){
        vm.doLoadingDataHoSo()
      })
    },
    processListDomain (currentQuery) {
      let vm = this
      vm.$store.dispatch('getDomainLists').then(function (result) {
        if (result.length > 0) {
          vm.listLinhVuc = result.map(domain => {
            domain['displayName'] = domain['domainCode'] + ' - ' + domain['domainName']
            // domain['displayName'] = domain['domainName']
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
          let domain = {
            domain: vm.linhVucSelected.domainCode,
            searchGovAgencyCode: vm.govAgencyFilterMenuConfig,
            groupServiceCode: vm.groupServiceFilterMenuConfig
          }
          vm.$store.dispatch('getServiceinfoFilter', domain).then(result => {
            vm.listThuTucHanhChinh = result.map(thuTuc => {
              thuTuc['displayName'] = thuTuc['serviceCodeDVCQG'] ? thuTuc['serviceCodeDVCQG'] + ' - ' + thuTuc['serviceName'] : thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
              // thuTuc['displayName'] = thuTuc['serviceName']
              return thuTuc
            })
            // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
            console.log('listThuTucHanhChinh2', vm.listThuTucHanhChinh)
          }).catch(function (){})
        } else if (vm.listLinhVuc.length === 1) {
          if (!vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
            vm.linhVucSelected = vm.listLinhVuc[0]
            vm.domainCode = vm.linhVucSelected['domainCode']
          }
        } else {
          vm.linhVucSelected = null
        }
        vm.doLoadingDataHoSo()
      }).catch(function (){})
    },
    processListCongVan (currentQuery) {
      let vm = this
      console.log('currentQuery9999999 -- processListCongVan', currentQuery)
      let getAllUrlParams = function(arr) {
        let obj = {}
        for (var i = 0; i < arr.length; i++) {
          let a = arr[i].split('=')
          let paramName = a[0]
          let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
          paramName = paramName.toLowerCase()
          if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
          if (paramName.match(/\[(\d+)?\]$/)) {
            var key = paramName.replace(/\[(\d+)?\]/, '')
            if (!obj[key]) obj[key] = []
            if (paramName.match(/\[\d+\]$/)) {
              var index = /\[(\d+)\]/.exec(paramName)[1]
              obj[key][index] = paramValue
            } else {
              obj[key].push(paramValue)
            }
          } else {
            if (!obj[paramName]) {
              obj[paramName] = paramValue
            } else if (obj[paramName] && typeof obj[paramName] === 'string'){
              obj[paramName] = [obj[paramName]]
              obj[paramName].push(paramValue)
            } else {
              obj[paramName].push(paramValue)
            }
          }
        }
        return obj
      }
      let filter = {
        paramSearch: vm.trangThaiHoSoList[vm.index]['queryParams'] ? getAllUrlParams(vm.trangThaiHoSoList[vm.index]['queryParams'].split('?')[1].split('&')) : {}
      }
      let agencyDonViNhan = vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVanTheoDonViNhan') ? vm.trangThaiHoSoList[vm.index]['tableConfig']['searchCongVanTheoDonViNhan'] : ''
      filter.paramSearch = Object.assign(filter.paramSearch, {searchCongVanTheoDonViNhan: agencyDonViNhan})
      vm.$store.dispatch('getListCongVan', filter).then(function (result) {
        if (result.length > 0) {
          vm.listCongVan = result.map(cv => {
            cv['displayName'] = cv['documentNo'] + ' - ' + cv['documentDate'].split(' ')[0] + ' - ' + cv['govAgencyName']
            return cv
          })
        }
        if (currentQuery.hasOwnProperty('groupDossierId') && String(currentQuery.groupDossierId) !== '') {
          for (let key in vm.listCongVan) {
            if (String(vm.listCongVan[key]['dossierId']) === String(currentQuery.groupDossierId)) {
              vm.congvanSelected = vm.listCongVan[key]
              // test ----
              let thutuccongvan = vm.congvanSelected ? vm.congvanSelected.serviceCode : ''
              if (thutuccongvan) {
                let chonthutuc = vm.listThuTucHanhChinh.filter(function (item) {
                  return item.serviceCode == thutuccongvan
                })
                if (chonthutuc && chonthutuc.length > 0) {
                  vm.thuTucHanhChinhSelected = chonthutuc[0]
                  if (vm.thuTucHanhChinhSelected !== null && vm.thuTucHanhChinhSelected !== 'null' && vm.thuTucHanhChinhSelected !== undefined && vm.thuTucHanhChinhSelected.hasOwnProperty('options')) {
                    vm.listDichVu = vm.thuTucHanhChinhSelected.options
                  } else {
                    vm.listDichVu = []
                  }
                  if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
                    vm.dichVuSelected = vm.listDichVu[0]
                    vm.templateNo = vm.dichVuSelected.templateNo
                  } else {
                    vm.dichVuSelected = null
                  }
                }
              }
              // end test -------
            }
          }
        } else {
          vm.congvanSelected = null
        }
      }).catch(function (){})
    },
    getDonViCongVan (currentQuery) {
      let vm = this
      let filter = {
        collectionCode: 'DON_VI_CONG_VAN',
        level: '',
        parent: ''
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.listDonviCongVan = result.data
        if (currentQuery.hasOwnProperty('donvigui') && String(currentQuery.donvigui) !== '') {
          for (let key in vm.listDonviCongVan) {
            if (String(vm.listDonviCongVan[key]['itemCode']) === String(currentQuery.donvigui)) {
              vm.donviguiSelected = vm.listDonviCongVan[key]
            }
          }
        } else {
          vm.donviguiSelected = null
        }
      }).catch(function () {
        vm.listDonviCongVan = []
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
            if (item !== undefined && currentUser !== undefined) {
              return item['userId'].toString() === currentUser['userId'].toString()
            }
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
      vm.limitRecord = config.numberPerPage ? config.numberPerPage : 15
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
    sortAction (val) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['sort'] = val
      newQuery['order'] = newQuery.hasOwnProperty('order') && newQuery['order'] === 'true' ? 'false' : 'true'
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== 'null' && newQuery[key] !== null && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.selected = []
      let currentQuery =vm.$router.history.current.query
      vm.orderSort = currentQuery.hasOwnProperty('order') ? currentQuery.order : ''
      vm.sortValue = currentQuery.hasOwnProperty('sort') ? currentQuery.sort : ''
      if (currentQuery.hasOwnProperty('q')) {
        let querySet
        if (currentQuery.q.indexOf('step') > 0 || currentQuery.q.indexOf('originality') > 0) {
          querySet = currentQuery.q
        } else {
          querySet = currentQuery['step'] ? currentQuery.q + '&step=' + currentQuery['step'] : currentQuery.q
        }
        var filter = null
        if (vm.menuType !== 3) {
          filter = {
            queryParams: querySet,
            /*  test local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            numberPerPage: vm.limitRecord,
            order: currentQuery.hasOwnProperty('order') ? currentQuery.order : '',
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyCode,
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceCode,
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : vm.templateNo,
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            day: currentQuery.hasOwnProperty('day') ? currentQuery.day : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            paymentStatus: currentQuery.hasOwnProperty('paymentStatus') ? currentQuery.paymentStatus : '',
            dossierNo: vm.dossierNoKey ? String(vm.dossierNoKey).trim() : '',
            follow: currentQuery.hasOwnProperty('follow') ? currentQuery.follow : '',
            originality: currentQuery.hasOwnProperty('originality') && currentQuery['originality'] ? currentQuery.originality : '',
            viapostal: currentQuery.hasOwnProperty('viapostal') ? currentQuery.viapostal : '',

            fromReceiveDate: currentQuery.hasOwnProperty('fromReceiveDate') ? currentQuery.fromReceiveDate : '',
            toReceiveDate: currentQuery.hasOwnProperty('toReceiveDate') ? currentQuery.toReceiveDate : '',
            fromDueDate: currentQuery.hasOwnProperty('fromDueDate') ? currentQuery.fromDueDate : '',
            toDueDate: currentQuery.hasOwnProperty('toDueDate') ? currentQuery.toDueDate : '',
            fromReleaseDate: currentQuery.hasOwnProperty('fromReleaseDate') ? currentQuery.fromReleaseDate : '',
            toReleaseDate: currentQuery.hasOwnProperty('toReleaseDate') ? currentQuery.toReleaseDate : '',
            fromFinishDate: currentQuery.hasOwnProperty('fromFinishDate') ? currentQuery.fromFinishDate : '',
            toFinishDate: currentQuery.hasOwnProperty('toFinishDate') ? currentQuery.toFinishDate : '',
            dateCv: currentQuery.hasOwnProperty('dateCv') ? currentQuery.dateCv : vm.dateCvFormatted,
            documentNo: currentQuery.hasOwnProperty('documentNo') ? currentQuery.documentNo : vm.documentNo,
            donvigui: currentQuery.hasOwnProperty('donvigui') ? currentQuery.donvigui : '',
            donvinhan: currentQuery.hasOwnProperty('donvinhan') ? currentQuery.donvinhan : '',
            sort: vm.sortValue
          }
        } else {
          let originalityDossierDeleted = currentQuery.hasOwnProperty('status') && currentQuery['status'] === 'deleted' ? -1 : ''
          filter = {
            queryParams: querySet,
            /*  test local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            numberPerPage: vm.limitRecord,
            order: currentQuery.hasOwnProperty('order') ? currentQuery.order : '',
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyCode,
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceCode,
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : vm.templateNo,
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') && currentQuery['status'] && currentQuery['status'] !== 'deleted' ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            day: currentQuery.hasOwnProperty('day') ? currentQuery.day : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            originality: currentQuery.hasOwnProperty('originality') && currentQuery['originality'] ? currentQuery.originality : originalityDossierDeleted,
            paymentStatus: currentQuery.hasOwnProperty('paymentStatus') ? currentQuery.paymentStatus : '',
            dossierNo: vm.dossierNoKey ? String(vm.dossierNoKey).trim() : '',
            follow: currentQuery.hasOwnProperty('follow') ? currentQuery.follow : '',
            viapostal: currentQuery.hasOwnProperty('viapostal') ? currentQuery.viapostal : '',

            fromReceiveDate: currentQuery.hasOwnProperty('fromReceiveDate') ? currentQuery.fromReceiveDate : '',
            toReceiveDate: currentQuery.hasOwnProperty('toReceiveDate') ? currentQuery.toReceiveDate : '',
            fromDueDate: currentQuery.hasOwnProperty('fromDueDate') ? currentQuery.fromDueDate : '',
            toDueDate: currentQuery.hasOwnProperty('toDueDate') ? currentQuery.toDueDate : '',
            fromReleaseDate: currentQuery.hasOwnProperty('fromReleaseDate') ? currentQuery.fromReleaseDate : '',
            toReleaseDate: currentQuery.hasOwnProperty('toReleaseDate') ? currentQuery.toReleaseDate : '',
            fromFinishDate: currentQuery.hasOwnProperty('fromFinishDate') ? currentQuery.fromFinishDate : '',
            toFinishDate: currentQuery.hasOwnProperty('toFinishDate') ? currentQuery.toFinishDate : '',
            dateCv: currentQuery.hasOwnProperty('dateCv') ? currentQuery.dateCv : vm.dateCvFormatted,
            documentNo: currentQuery.hasOwnProperty('documentNo') ? currentQuery.documentNo : vm.documentNo,
            donvigui: currentQuery.hasOwnProperty('donvigui') ? currentQuery.donvigui : '',
            donvinhan: currentQuery.hasOwnProperty('donvinhan') ? currentQuery.donvinhan : '',
            sort: vm.sortValue
          }
        }
        if (vm.groupServiceFilterMenuConfig || vm.disableSearchAgency) {
          filter.agency = ''
        }
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('searchCongVan')) {
          let group = {
            groupDossierId: currentQuery.hasOwnProperty('groupDossierId') ? currentQuery.groupDossierId : (vm.congvanSelected ? vm.congvanSelected.dossierId : '')
          }
          filter = Object.assign(filter, group)
        }
        // console.log('filter doLoadingData', filter)
        vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
          vm.hosoDatas = result.data
          vm.hosoDatasTotal = result.total
          vm.limits = [15 , 30, 50, 100 ]
          vm.hosoTotalPage = Math.ceil(vm.hosoDatasTotal / vm.limitRecord)
          /*
          if (window.themeDisplay !== null && window.themeDisplay !== undefined && String(window.themeDisplay.getUserId()) === '20139') {
            vm.isAdminSuper = true
          }
          */
          if (vm.hosoTotalPage > 0 && vm.selectMultiplePage.length === 0) {
            for (let key = 0; key < vm.hosoTotalPage; key++) {
              let item = {
                selected: [],
                page: key + 1
              }
              vm.selectMultiplePage.push(item)
            }
            // console.log('selectMultiplePage', vm.selectMultiplePage)
          }
          vm.selected = vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected']
        }).catch(reject => {
          vm.hosoDatas = []
          vm.hosoDatasTotal = 0
        })
      }
      if (vm.menuType === 3 || String(vm.menuType) === '3') {
        setTimeout(() => {
          vm.dossierCounting = []
          vm.$store.dispatch('loadingDossierCounting').then(function (result) {
            if (result !== null && result !== undefined) {
              
              if (vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('advanceSearchCounting')) {
                let status = vm.trangThaiHoSoList[vm.index]['tableConfig']['advanceSearchCounting'].split(',')
                result.forEach(element => {
                  if (status.filter(function(item) {
                    return item === element['key']
                  }).length > 0) {
                    vm.dossierCounting.push(element)
                  }
                })
              } else {
                vm.dossierCounting = result
              }
              
              // add search dossierDeleted
              if (vm.getUser('Administrator_data')) {
                let dossierDelete = {key: 'deleted', title: 'Hồ sơ đã xóa', count: 0}
                vm.dossierCounting.push(dossierDelete)
              }
            } else {
              vm.dossierCounting = []
            }
            vm.dossierCountingShow = true
          }).catch(function (){})
        }, 200)
      } else {
        vm.dossierCountingShow = false
      }
    },
    changeServiceConfigs (item) {
      let vm = this
      vm.selectMultiplePage = []
      if (item !== null && item !== 'null' && item !== undefined && item.hasOwnProperty('options')) {
        vm.listDichVu = item.options
      } else {
        vm.listDichVu = []
      }
      if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
        vm.dichVuSelected = vm.listDichVu[0]
        vm.templateNo = vm.dichVuSelected.templateNo
      } else {
        vm.dichVuSelected = null
      }
      let current = vm.$router.history.current
      let newQuery = current.query
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
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
        queryString += 'service_config=' + item.serviceConfigId
        queryString += '&template_no=' + vm.dichVuSelected.templateNo
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
    changeServiceConfigsGuide (item) {
      let vm = this
      vm.listDichVuGuide = []
      setTimeout (function () {
        if (item !== null && item !== 'null' && item !== undefined && item.hasOwnProperty('options')) {
          vm.listDichVuGuide = item.options
        } else {
          vm.listDichVuGuide = []
        }
        if (vm.listDichVuGuide !== null && vm.listDichVuGuide !== undefined && vm.listDichVuGuide !== 'undefined' && vm.listDichVuGuide.length > 0) {
          vm.dichVuSelectedGuide = vm.listDichVuGuide[0]
          vm.templateNoGuide = vm.dichVuSelectedGuide.templateNo
        } else {
          vm.dichVuSelectedGuide = null
        }
      }, 300)
    },
    changeDomain (item) {
      console.log('change Domain', item)
      let vm = this
      vm.selectMultiplePage = []
      vm.linhVucSelected = item
      if (item) {
        setTimeout(function () {
          let domain = {
            domain: vm.linhVucSelected.domainCode,
            searchGovAgencyCode: vm.govAgencyFilterMenuConfig,
            groupServiceCode: vm.groupServiceFilterMenuConfig
          }
          vm.$store.dispatch('getServiceinfoFilter', domain).then(result => {
            vm.listThuTucHanhChinh = result.map(thuTuc => {
              thuTuc['displayName'] = thuTuc['serviceCodeDVCQG'] ? thuTuc['serviceCodeDVCQG'] + ' - ' + thuTuc['serviceName'] : thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
              // thuTuc['displayName'] = thuTuc['serviceName']
              return thuTuc
            })
            // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
          }).catch(function (){})
        }, 100)
      } else {
        vm.listThuTucHanhChinh = vm.listThuTuc
        // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
      }
      if (item !== null && item !== undefined) {
        vm.domainCode = vm.linhVucSelected['domainCode']
      } else {
        vm.domainCode = ''
      }
      if(vm.xacthuc_BNG){
        vm.postFieldPick('domain',vm.linhVucSelected)
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
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      queryString += 'domain=' + vm.domainCode
      // console.log('change Domain queryString', queryString)
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeCongVan (item) {
      let vm = this
      console.log('congvanSelected', item)
      vm.selectMultiplePage = []
      vm.congvanSelected = item
      // test -----
      let thutuccongvan = item ? item.serviceCode : ''
      if (thutuccongvan) {
        let chonthutuc = vm.listThuTucHanhChinh.filter(function (item) {
          return item.serviceCode == thutuccongvan
        })
        if (chonthutuc && chonthutuc.length > 0) {
          vm.thuTucHanhChinhSelected = chonthutuc[0]
          if (vm.thuTucHanhChinhSelected !== null && vm.thuTucHanhChinhSelected !== 'null' && vm.thuTucHanhChinhSelected !== undefined && vm.thuTucHanhChinhSelected.hasOwnProperty('options')) {
            vm.listDichVu = vm.thuTucHanhChinhSelected.options
          } else {
            vm.listDichVu = []
          }
          if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
            vm.dichVuSelected = vm.listDichVu[0]
            vm.templateNo = vm.dichVuSelected.templateNo
          } else {
            vm.dichVuSelected = null
          }
        }
      }
      // end test -------
      let groupIdQuery = vm.congvanSelected ? vm.congvanSelected.dossierId : ''
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['groupDossierId'] = ''
      newQuery['service_config'] = ''
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      queryString += 'groupDossierId=' + groupIdQuery
      if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
        queryString += '&service_config=' + vm.thuTucHanhChinhSelected.serviceConfigId
        queryString += '&template_no=' + vm.dichVuSelected.templateNo
        vm.govAgencyCode = vm.thuTucHanhChinhSelected.govAgencyCode
        vm.serviceCode = vm.thuTucHanhChinhSelected.serviceCode
      } else {
        vm.templateNo = ''
        vm.govAgencyCode = ''
        vm.serviceCode = ''
      }
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeDonViGuiCongVan (item) {
      let vm = this
      vm.selectMultiplePage = []
      vm.donviguiSelected = item
      let donvigui = vm.donviguiSelected ? vm.donviguiSelected.itemCode : ''
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['donvigui'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      queryString += 'donvigui=' + donvigui
      // console.log('change Domain queryString', queryString)
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeDossierNoKey () {
      var vm = this
      vm.selectMultiplePage = []
      // console.log('run log ...')
      setTimeout(function () {
        vm.doLoadingDataHoSo()
      }, 200)
    },
    clearDossierNoKey () {
      this.dossierNoKey = ''
      this.changeDossierNoKey()
    },
    changeDichVuConfigs (item) {
      let vm = this
      vm.selectMultiplePage = []
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (item !== null && item !== undefined) {
        queryString += 'template_no=' + item.templateNo
        vm.templateNo = item.templateNo
      }
      vm.$router.push({
        path: current.path + queryString
      })
    },
    btnActionEvent (dossierItem, item, index, isGroup) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      // set info buttonConfig
      vm.buttonConfigItem = {}
      vm.buttonConfigItem = item
      //
      vm.itemAction = item
      vm.indexAction = index
      if (item.hasOwnProperty('requiredCVDen') && (!vm.congvanSelected || !vm.thuTucHanhChinhSelected)) {
        if (!vm.congvanSelected && !vm.thuTucHanhChinhSelected) {
          alert('Vui lòng chọn công văn và thủ tục để thực hiện')
          vm.focusSelect = 1
        } else if (!vm.congvanSelected && vm.thuTucHanhChinhSelected) {
          alert('Vui lòng chọn công văn để thực hiện')
          vm.focusSelect = 1
        } else {
          alert('Vui lòng chọn thủ tục để thực hiện')
          vm.focusSelect = 2
        }
        
      } else {
        if (String(item.form) === 'NEW' || String(item.form) === 'NEW_GROUP' || String(item.form) === 'NEW_GROUP_CV' || String(item.form) === 'NEW_GROUP_CV_DI') {
          let isOpenDialog = true
          if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu.length === 1) {
            isOpenDialog = false
          }
          if (String(item.form) === 'NEW_GROUP_CV_DI') {
            isOpenDialog = false
          }
          if (isOpenDialog) {
            vm.dialogAction = true
          } else {
            if(String(item.form) === 'NEW_GROUP_CV_DI') {
              if(vm.serviceCode && vm.templateNo) {
                if (item.hasOwnProperty('requiredCVDen')) {
                  item = Object.assign(item, {requiredCVDenGovCode: vm.congvanSelected.govAgencyCode, requiredCVDenGroupId: vm.congvanSelected.dossierId})
                }
                vm.$store.commit('setFormActionGroup', item)
                vm.doCreateDossier() 
              } else {
                toastr.error('Chưa chọn thủ tục hành chính')
              }
            } else {
              if (item.hasOwnProperty('requiredCVDen')) {
                item = Object.assign(item, {requiredCVDenGovCode: vm.congvanSelected.govAgencyCode, requiredCVDenGroupId: vm.congvanSelected.dossierId})
              }
              vm.$store.commit('setFormActionGroup', item)
              vm.doCreateDossier()
            }
          }
        } else if (String(item.form) === 'UPDATE') {
          if(dossierItem.serviceCode === 'BNG-270817' || dossierItem.serviceCode === 'BNG-270821' || dossierItem.serviceCode === 'BNG-270820' || dossierItem.serviceCode === 'BNG-270816' || dossierItem.serviceCode === 'BNG-270819' || dossierItem.serviceCode === 'BNG-270815'){
            vm.$router.history.current.query['template_no'] = dossierItem.dossierTemplateNo
            vm.$router.history.current.query['serviceCode'] = dossierItem.serviceCode
          }
          // 
          vm.$router.history.current.query['template_no'] = dossierItem.dossierTemplateNo
          vm.$router.history.current.query['serviceCode'] = dossierItem.serviceCode
          // 
          vm.$router.push({
              path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + dossierItem.dossierId + '/' + vm.itemAction.form,
              query: vm.$router.history.current.query
            })
        } else if (String(item.form) === 'ADD') {
          vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/bo-sung-ho-so/' + dossierItem.dossierId,
            query: vm.$router.history.current.query
          })
        } else if (String(item.form) === 'IMPORT') {
          if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined) {
            vm.doImportDossier()
          } else {
            alert('Chọn thủ tục để thực hiện')
          }
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
          vm.thuTucHanhChinhSelectedGuide = ''
          vm.dichVuSelectedGuide = ''
          vm.tphsGuide = []
          if (vm.thuTucHanhChinhSelected) {
            vm.thuTucHanhChinhSelectedGuide = vm.thuTucHanhChinhSelected
            vm.listDichVuGuide = vm.thuTucHanhChinhSelectedGuide.hasOwnProperty('options') ? vm.thuTucHanhChinhSelectedGuide['options'] : ''
            vm.dichVuSelectedGuide = vm.dichVuSelected ? vm.dichVuSelected : ''
            vm.templateNoGuide = vm.dichVuSelectedGuide ? vm.dichVuSelectedGuide.templateNo : ''
          }
          vm.docTypePrint = item.document
          vm.dialog_printGuide = true
          vm.$refs.formGuide.reset()
        } else if (String(item.form) === 'DENIED') {
          vm.docTypePrint = item.document
          vm.thuTucHanhChinhSelectedGuide = ''
          vm.dichVuSelectedGuide = ''
          if (vm.thuTucHanhChinhSelected) {
            vm.thuTucHanhChinhSelectedGuide = vm.thuTucHanhChinhSelected
            vm.listDichVuGuide = vm.thuTucHanhChinhSelectedGuide.hasOwnProperty('options') ? vm.thuTucHanhChinhSelectedGuide['options'] : ''
            vm.dichVuSelectedGuide = vm.dichVuSelected ? vm.dichVuSelected : ''
            vm.templateNoGuide = vm.dichVuSelectedGuide ? vm.dichVuSelectedGuide.templateNo : ''
          }
          vm.dialog_denied = true
          vm.$refs.formDenied.reset()
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
          vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8500)
        } else if (String(item.form) === 'PREOVERDUE') {
          let result = {
            actionCode: 8501,
            dossierId: dossierItem.dossierId,
            preoverdue: dossierItem['extendDate']
          }
          vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8501)
        } else if (String(item.form) === 'BETIMES') {
          let result = {
            actionCode: 8400,
            dossierId: dossierItem.dossierId,
            betimes: dossierItem['extendDate']
          }
          vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8400)
        } else if (String(item.form) === 'CHANGE_DATA_DOSSIER') {
          vm.doChangeDossier(dossierItem, item, index, isGroup)
        } else if (String(item.form) === 'UNDO_DOSSIER') {
          vm.doUndoDossier(dossierItem, item, index, isGroup)
        } else if (String(item.form) === 'RESTORE_DOSSIER') {
          vm.doRestoreDossier(dossierItem, item, index, isGroup)
        } else if (String(item.form) === 'GOTO_DONE') {
          if (!dossierItem) {
            alert('Chọn hồ sơ để thực hiện')
            return
          }
          let result = {
            stepCode: 400,
            stepName: 'hoàn thành'
          }
          vm.gotoStep(dossierItem, result)
        } else if (String(item.form) === 'GOTO_CANCEL') {
          if (!dossierItem) {
            alert('Chọn hồ sơ để thực hiện')
            return
          }
          let result = {
            stepCode: 410,
            stepName: 'rút'
          }
          vm.gotoStep(dossierItem, result)
        } else if (String(item.form) === 'GOTO_DENY') {
          if (!dossierItem) {
            alert('Chọn hồ sơ để thực hiện')
            return
          }
          let result = {
            stepCode: 420,
            stepName: 'từ chối'
          }
          vm.gotoStep(dossierItem, result)
        }
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
      }).catch(function (){})
    },
    doPrint02 (dossierItem, item, index, isGroup) {
      let vm = this
      // console.log('vm.selectedDoAction', vm.selectedDoAction)
      if ((vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') && (!vm.doActionGroup || !vm.doActionGroupKhacThuTuc)) {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        if (vm.selectedDoAction.length === 0) {
          alert('Chọn hồ sơ để thực hiện')
          return
        }
        let filter = {
          document: item.document,
          // 'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          // 'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selectedDoAction)
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        }).catch(function (){})
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item ? item.document : ''
      }
      let counter = 0
      let callServer = function() {
        setTimeout(function () {
          vm.$store.dispatch('doPrint03', filter).then(function (result) {
            if (result === 'pending' && counter <= 10) {
              counter += 1
              callServer()
            } else {
              if (counter > 10) {
                vm.dialogPDFLoading = false
              } else {
                vm.dialogPDFLoading = false
                vm.dialogPDF = true
                setTimeout(function () {
                  document.getElementById('dialogPDFPreview').src = result
                }, 100)
              }
            }
          })
        }, 1000)
      }
      callServer()
    },
    doGuiding (type) {
      let vm = this
      if (vm.$refs.formGuide.validate()) {
        vm.loadingAction = true
        let partNoRequired = []
        for (let key in vm.tphsGuide) {
          if (!vm.tphsGuide[key]['fileMark']) {
            partNoRequired.push(vm.tphsGuide[key]['partNo'])
          }
        }
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelectedGuide.serviceConfigId,
          serviceCode: vm.thuTucHanhChinhSelectedGuide.serviceCode,
          serviceName: vm.thuTucHanhChinhSelectedGuide.serviceName,
          templateNo: vm.templateNoGuide,
          applicantName: vm.applicantNameGuide,
          applicantAddress: vm.applicantAddressGuide,
          applicantEmail: vm.applicantEmailGuide,
          applicantTelNo: vm.applicantTelNoGuide,
          govAgencyCode: vm.thuTucHanhChinhSelectedGuide.govAgencyCode,
          govAgencyName: vm.thuTucHanhChinhSelectedGuide.govAgencyName,
          typeCode: vm.docTypePrint ? vm.docTypePrint : 'DOC_03',
          partNo: partNoRequired.toString(),
          applicantNote: vm.applicantNoteGuide,
          type: 'completed',
          applicantType: vm.applicantTypeGuide ? 'citizen' : 'business'
        }
        if (type === 'doc') {
          filter['reportType'] = 'word'
        }
        if (type !== 'doc') {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
        }
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.loadingAction = false
          vm.dialog_printGuide = false
          vm.dialogPDFLoading = false
          if (type !== 'doc') {
            document.getElementById('dialogPDFPreview').src = result
          }
        }).catch(function () {
          vm.loadingAction = false
        })
      }
    },
    doDenied (type) {
      let vm = this
      if (vm.$refs.formDenied.validate()) {
        vm.loadingAction = true
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelectedGuide.serviceConfigId,
          serviceCode: vm.thuTucHanhChinhSelectedGuide.serviceCode,
          serviceName: vm.thuTucHanhChinhSelectedGuide.serviceName,
          templateNo: vm.templateNoGuide,
          applicantName: vm.applicantNameGuide,
          applicantAddress: vm.applicantAddressGuide,
          applicantEmail: vm.applicantEmailGuide,
          applicantTelNo: vm.applicantTelNoGuide,
          govAgencyCode: vm.thuTucHanhChinhSelectedGuide.govAgencyCode,
          govAgencyName: vm.thuTucHanhChinhSelectedGuide.govAgencyName,
          typeCode: vm.docTypePrint ? vm.docTypePrint : 'DOC_03',
          applicantNote: vm.applicantNoteGuide,
          type: 'denied',
          applicantType: vm.applicantTypeGuide ? 'citizen' : 'business'
        }
        if (type === 'doc') {
          filter['reportType'] = 'word'
        }
        if (type !== 'doc') {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
        }
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.loadingAction = false
          vm.dialog_printGuide = false
          vm.dialogPDFLoading = false
          if (type !== 'doc') {
            document.getElementById('dialogPDFPreview').src = result
          }
        }).catch(function () {
          vm.loadingAction = false
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
      }).catch(function (){})
    },
    doActions (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let result = {
        actionCode: item.action
      }
      if (isGroup) {
        vm.countSelected = 0
        if (vm.selectedDoAction.length > 0) {
          // console.log('run doActions Landing')
          vm.$store.dispatch('loadActionActive', item).then(function () {
            vm.$store.dispatch('loadDossierSelected', vm.selectedDoAction).then(function () {
              let dossiersSelect = vm.selectedDoAction.map(select => {
                return select.dossierId
              }).join(',')
              let query = vm.$router.history.current.query
              query['dossiers'] = dossiersSelect
              query['actionActive'] = JSON.stringify(item)
             vm.$router.push({
                path: '/danh-sach-ho-so/' + vm.index + '/xu-ly-ho-so',
                query: query
              })
            }).catch(function (){})
          }).catch(function (){})
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
       vm.$router.push({
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
         vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        }).catch(reject => {
          vm.loadingAction = false
        })
      }
    },
    doChangeDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (isGroup) {
        if (vm.selectedDoAction.length > 0) {
          let countSelectedDoAction = vm.selectedDoAction.length
          vm.actionId = 9100
          vm.dossierIdSelected = vm.selectedDoAction[countSelectedDoAction - 1].dossierId
          // console.log('selectExtraForm', vm.dossierIdSelected, vm.actionId)
          vm.dialog_extraForm = true
        } else {
          alert('Chọn hồ sơ để thực hiện')
        }
      }
    },
    doUndoDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.selectedDoAction.length > 0) {
        let countSelectedDoAction = vm.selectedDoAction.length
        let x = confirm('Xác thực Undo hồ sơ với mã: ' + vm.selectedDoAction[countSelectedDoAction - 1].dossierNo)
        if (x) {
          let fiter = {
            dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId
          }
          vm.$store.dispatch('rollBack', fiter).then(function (result) {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          }).catch(function () {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          })
        }
      } else {
        alert('Chọn hồ sơ để thực hiện')
      }
    },
    gotoStep (dossierItem, result) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.selectedDoAction.length > 0) {
        let countSelectedDoAction = vm.selectedDoAction.length
        let x = confirm('Xác thực ' + result['stepName'] + ' hồ sơ với mã: ' + vm.selectedDoAction[countSelectedDoAction - 1].dossierNo)
        if (x) {
          let fiter = {
            dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId,
            stepCode: result['stepCode']
          }
          vm.$store.dispatch('goToStep', fiter).then(function (result) {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          }).catch(function () {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          })
        }
      } else {
        alert('Chọn hồ sơ để thực hiện')
      }
    },
    doChangeDossierExtraForm () {
      let vm = this
      let validation = vm.$refs.formBoSungThongTinNgan.checkValid()
      if (validation) {
        let payloadExtraForm = vm.$refs.formBoSungThongTinNgan.formSubmitData()
        if (payloadExtraForm) {
          let x = confirm('Bạn có chắc chắn thực hiện hành động điều chỉnh dữ liệu?')
          if (x) {
            let countSelectedDoAction = vm.selectedDoAction.length
            let fiter = {
              dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId,
              actionCode: vm.actionId,
              payload: payloadExtraForm
            }
            vm.$store.dispatch('processDossierRouter', fiter).then(function (result) {
              vm.doLoadingDataHoSo()
              vm.dialog_extraForm = false
            }).catch(function () {
              vm.dialog_extraForm = false
              vm.doLoadingDataHoSo()
            })
          }
        } else {
          vm.dialog_extraForm = false
        }
      }
    },
    doRestoreDossier () {
      let vm = this
      let x = confirm('Bạn có chắc chắn thực hiện hành động khôi phục hồ sơ?')
      if (x) {
        if (vm.selectedDoAction.length > 0) {
          let restoreCounter = 0
          let lengthDossier = vm.selectedDoAction.length
          for (let key in vm.selectedDoAction) {
            let filter = {
              dossierId: vm.selectedDoAction[key]['dossierId']
            }
            // console.log('filter Restore', filter)
            if (vm.selectedDoAction[key]['originality']) {
              vm.$store.dispatch('restoreDossier', filter).then(function (result) {
                restoreCounter += 1
                if (restoreCounter === lengthDossier) {
                  vm.doLoadingDataHoSo()
                }
              }).catch(function () {
                restoreCounter += 1
                if (restoreCounter === lengthDossier) {
                  vm.doLoadingDataHoSo()
                }
              })
            }
          }
        } else {
          alert('Chọn hồ sơ để thực hiện')
        }
      }
    },
    doDeleteDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let x = confirm('Bạn có chắc chắn thực hiện hành động xóa hồ sơ?')
      if (x) {
        let currentQuery = vm.$router.history.current.query
        //
        if (isGroup) {
          let filter = {
            dossierId: 0
          }
          // console.log(vm.selected)
          if (vm.selectedDoAction.length > 0) {
            let deleteIds = []
            for (let key in vm.selectedDoAction) {
              deleteIds.push(vm.selectedDoAction[key]['dossierId'])
            }
            filter['dossierId'] = deleteIds
            vm.$store.dispatch('deleteDossierPatch', filter).then(function (result) {
            }).catch(function (){})
          } else {
            alert('Chọn hồ sơ để thực hiện')
          }
        } else {
          let filter = {
            dossierId: dossierItem.dossierId
          }
          vm.$store.dispatch('deleteDossier', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.$router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          }).catch(function (){})
        }
      } else {
        return false
      }
    },
    deleteCongVan (item, index) {
      let vm = this
      let filter = {
        dossierId: item.dossierId
      }
      let x = confirm('Bạn có chắc chắn thực hiện xóa công văn?')
      if (x) {
        vm.$store.dispatch('deleteDossier', filter).then(function (result) {
          toastr.success('Xóa công văn thành công')
          vm.doLoadingDataHoSo()
        }).catch(function (){})
      }
    },
    doCreateDossier () {
      let vm = this
      let data = {
        serviceCode: vm.serviceCode,
        govAgencyCode: vm.govAgencyCode,
        templateNo: vm.templateNo,
        originality: vm.itemAction['form'] === 'NEW_GROUP' || vm.itemAction['form'] === 'NEW_GROUP_CV' || vm.itemAction['form'] === 'NEW_GROUP_CV_DI' ? 9 : vm.getOriginality()
      }
      // add new template
      let filter = {
        dossierTemplateNo: vm.templateNo
      }
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result1) {
        let mauCongVan = result1['newFormScript'] && result1['newFormScript'].startsWith('MAU_CV_') ? result1['newFormScript'] : false 
        if (result1['newFormScript'] && !mauCongVan) {
          vm.$router.push({
            path: '/danh-sach-ho-so/0/ho-so/0/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        } else {
          vm.$store.commit('setDataCreateDossier', data)
          vm.loadingAction = true
          let query_redirect = vm.$router.history.current.query
          if (vm.itemAction['form'] === 'NEW_GROUP_CV' || vm.itemAction['form'] === 'NEW_GROUP_CV_DI') {
            query_redirect = Object.assign(query_redirect, {formActionGroup: JSON.stringify(vm.itemAction)})
            console.log('query_redirect_Landing', query_redirect)
          }
          vm.$store.dispatch('postDossier', data).then(function (result) {
            vm.loadingAction = false
            vm.indexAction = -1
            vm.$router.push({
              path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
              query: query_redirect
            })
          }).catch(reject => {
            vm.loadingAction = false
          })
        }
      }).catch(function (){})
      //
    },
    doSubmitDialogAction (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      if (vm.$refs.form1.validate()) {
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
      // if (vm.$router.history.current.query.hasOwnProperty('step')) {
      //   vm.$store.dispatch('pullNextactions', filter).then(result => {
      //     vm.btnDossierDynamics = result
      //   })
      // } else {
      if (item.dossierStatus === '' || item.dossierSubStatus === '') {
        vm.$store.dispatch('pullNextactions', filter).then(result => {
          vm.btnDossierDynamics = result
        }).catch(function (){})
      } else {
        vm.btnStepsDynamics = []
        var getbuttonAction = [vm.$store.dispatch('pullNextactions', filter), vm.$store.dispatch('pullBtnConfigStep', filter)]
        Promise.all(getbuttonAction).then(result => {
          vm.btnDossierDynamics = result[0]
          vm.btnStepsDynamics = result[1]
        }).catch(reject => {
          vm.$store.dispatch('pullNextactions', filter).then(result => {
            vm.btnDossierDynamics = result
          }).catch(function (){})
        })
      }
      // }
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
      let queryString = '?'
      currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
      currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
      for (let key in currentQuery) {
        if (currentQuery[key] !== '' && currentQuery[key] !== 'undefined' && currentQuery[key] !== undefined) {
          queryString += key + '=' + currentQuery[key] + '&'
        }
      }
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.$router.push({
              path: vm.$router.history.current.path + queryString
            })
          }).catch(function (){})
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
                vm.selectedDoAction[index].statusAction = true
                vm.countSelected += 1
                if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed > 0 && vm.selectedDoAction.length > 1) {
                  vm.dialog_statusAction = true
                } else if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed === 0) {
                 vm.$router.push({
                    path: vm.$router.history.current.path,
                    query: {
                      recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      q: currentQuery['q']
                    }
                  })
                }
              } else {
               vm.$router.push({
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
                vm.selectedDoAction[index].statusAction = false
                if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed > 0 && vm.selectedDoAction.length > 1) {
                  vm.dialog_statusAction = true
                }
              } else {}
            })
          }).catch(function (){})
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
        // if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment !== '') {
        //   isPopup = true
        //   vm.showThuPhi = true
        //   vm.payments = result.payment
        //   vm.viaPortalDetail = dossierItem.viaPostal
        // }
        // add thanh toán điện tử
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          if (result.payment.requestPayment === 2 || result.payment.requestPayment === '2') {
            isPopup = true
            let filter = {
              dossierId: vm.dossierId
            }
            vm.$store.dispatch('loadDossierPayments', filter).then(result => {
              vm.paymentProfile = result
              // vm.showThanhToanDienTu = true
            }).catch(reject => {
            })
          } else {
            isPopup = true
            vm.showThuPhi = true
            vm.payments = result.payment
            vm.viaPortalDetail = dossierItem.viaPostal
          }
        }
        //
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
       vm.$router.push({
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
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (item.permission) {
        if (item['originality'] === 9) {
          if (vm.trangThaiHoSoList[vm.index]['id'].indexOf('CV_DI') !== -1) {
            vm.$router.push({
              path: '/danh-sach-ho-so/'+ this.index +'/nhom-ho-so/NEW_GROUP_CV_DI/' + item.dossierId,
              query: vm.$router.history.current.query
            })
          } else {
            vm.$router.push({
              path: '/danh-sach-ho-so/'+ this.index +'/nhom-ho-so/NEW_GROUP_CV/' + item.dossierId,
              query: vm.$router.history.current.query
            })
          }
          
        } else {
          vm.$router.push('/danh-sach-ho-so/' + this.index + '/chi-tiet-ho-so/' + item['dossierId'])
        }
      } else {
        if (item['originality'] === 1) {
          vm.$router.push('/danh-sach-ho-so/' + this.index + '/chi-tiet-ho-so/' + item['dossierId'])
        } else {
          alert('Bạn không có quyền thao tác với hồ sơ này')
        }
      }
    },
    keywordEventChange (data) {
      let vm = this
      vm.doRedirectFilter()
    },
    showAdvFilter () {
      let vm = this
      vm.advSearchShow = !vm.advSearchShow
      setTimeout(function () {
        if (vm.$refs.advSearch) {
          vm.$refs.advSearch.setShow(vm.advSearchShow)
        }
      }, 200)
    },

    doRedirectFilter () {
      let vm = this
      vm.selectMultiplePage = []
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['keyword'] = String(vm.keyword).trim()
      newQuery['status'] = vm.status
      newQuery['top'] = vm.top
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== 'adv_renew') {
          queryString += key + '=' + newQuery[key] + '&'
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
      if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
        if (vm.top === item.key) {
          vm.top = ''
        } else {
          vm.top = item.key
          vm.status = ''
        }
      } else {
        if (vm.status === item.key) {
          vm.status = ''
        } else {
          vm.status = item.key
          vm.top = ''
        }
      }
      vm.doRedirectFilter()
    },
    doImportDossier () {
      let vm = this
      let data = {
        serviceCode: vm.serviceCode,
        govAgencyCode: vm.govAgencyCode,
        templateNo: vm.templateNo,
        originality: vm.getOriginality()
      }
      vm.$store.commit('setDataCreateDossier', data)
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        vm.$router.push({
          path: '/import-ho-so/' + result.dossierId,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    getCountAdvSearch() {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let count = 0
      for (let index in vm.filterKeyAdvSearch) {
        if (newQuery.hasOwnProperty(vm.filterKeyAdvSearch[index]) && newQuery[vm.filterKeyAdvSearch[index]]) {
          count+=1
        }
      }
      return count
    },
    filterServiceConfig (serviceList) {
      let vm = this
      if (!vm.govAgencyFilterMenuConfig && !vm.groupServiceFilterMenuConfig) {
        return serviceList
      } else if (vm.govAgencyFilterMenuConfig && !vm.groupServiceFilterMenuConfig) {
        let data = serviceList.filter(function (item) {
          return item.govAgencyCode === vm.govAgencyFilterMenuConfig
        })
        return data
      } else if (!vm.govAgencyFilterMenuConfig && vm.groupServiceFilterMenuConfig) {
        let list = []
        for (let index in serviceList) {
          let exits = list.filter(function(item) {
            return item.serviceCode === serviceList[index]['serviceCode']
          }).length
          if (exits === 0) {
            console.log('serviceListIndex', serviceList[index], list)
            list.push(serviceList[index])
            console.log('list', list)
          }
        }
        return list
      } else {
        let data1 = serviceList.filter(function (item) {
          return item.govAgencyCode === vm.govAgencyFilterMenuConfig
        })
        let list = []
        for (let index in data1) {
          let exits = list.filter(function(item) {
            return item.serviceCode === data1[index]['serviceCode']
          }).length
          if (exits === 0) {
            list.push(data1[index])
          }
        }
        return list
      }
      
    },
    changeDate() {
      let vm = this
      vm.menuDateCV = false
      vm.dateCvFormatted = vm.formatDate(vm.dateCv)
      setTimeout(function () {
        vm.doLoadingDataHoSo()
      }, 200)
    },
    formatDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) return ''
      if (String(date).indexOf('/') > 0) {
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else if (String(date).indexOf('-') > 0) {
        const [day, month, year] = date.split('-')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else {
        let date1 = new Date(Number(date))
        return `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')}`
      }
    },
    validate () {
      // validate your form , if you don't have validate prop , default validate pass .
      return true
    },
    callback (token) {
      // google recaptcha token , then you can pass to backend with your form data .
      if (token) {
        alert(token)
      } else {
        // if you use data-size show reCAPTCHA , maybe you will get empty token. 6LfuMm4UAAAAAIeNgZHhWHR-aVaqXqNUSsurnzm2
        alert('please check you are not robot')
      }
    },
    getFieldPick () {
      let vm = this
      let classPK = 'MOTCUA'
      vm.$store.dispatch('getFieldPick', classPK).then(function (result) {
          let formData = result
          if(formData.domain) {
             vm.linhVucSelected = JSON.parse(formData.domain)
          }
      }).catch (function (reject) {
      }) 
    },
    postFieldPick(key,val){
      let vm = this
      let filter = {
        classPK: 'MOTCUA',
        key,
        val
      }
      vm.$store.dispatch('postFieldPick', filter).then(function (result) {
      
      }).catch (function (reject) {
      }) 
    },
    getMetaData (val) {
      let metaDataOut = ''
      try {
        metaDataOut = JSON.parse(val.metaData)
      } catch (error) {
      }
      return metaDataOut
    },
    getGovAgency () {
      let vm = this
      let filter={
        isEmployee: true
      }
      vm.$store.dispatch('getGovAgencysNew',filter).then(
        result => {
          vm.agencyListXuLyThuTuc = result ? result : []
        }
      ).catch(()=>{})
    },
    changeAgencyXuLy (item) {
      console.log('change changeAgencyXuLy', item)
      let vm = this
      vm.agencyListXuLyThuTuc = item
      if (item) {
        setTimeout(function () {
          // let domain = {
          //   domain: vm.linhVucSelected.domainCode,
          //   searchGovAgencyCode: vm.govAgencyFilterMenuConfig,
          //   groupServiceCode: vm.groupServiceFilterMenuConfig
          // }
          // vm.$store.dispatch('getServiceinfoFilter', domain).then(result => {
          //   vm.listThuTucHanhChinh = result.map(thuTuc => {
          //     thuTuc['displayName'] = thuTuc['serviceCodeDVCQG'] ? thuTuc['serviceCodeDVCQG'] + ' - ' + thuTuc['serviceName'] : thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
          //     // thuTuc['displayName'] = thuTuc['serviceName']
          //     return thuTuc
          //   })
          //   // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
          // }).catch(function (){})
          vm.listThuTucHanhChinh = vm.listThuTuc.filter(e=>e.govAgencyCode === item.itemCode)
        }, 100)
      } else {
        vm.listThuTucHanhChinh = vm.listThuTuc
        // vm.listThuTucHanhChinh = vm.filterServiceConfig(vm.listThuTucHanhChinh)
      }
      if (item !== null && item !== undefined) {
        vm.govAgencyCode = vm.agencyListXuLyThuTuc['itemCode']
      } else {
        vm.govAgencyCode = ''
      }
      console.log('change Domain queryString', queryString)
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['agency'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        let stepQuery = newQuery.hasOwnProperty('step') ? newQuery['step'] : ''
        queryString += 'step=' + stepQuery + '&'
      }
      queryString += 'agency=' + vm.govAgencyCode
      console.log('change Agency queryString', queryString)
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
      
  }
}
</script>
