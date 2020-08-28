<template>
<div>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-layout v-if="detailForm !== null && detailForm.length > 0" row wrap style="
      margin-bottom: 100px;
    ">
      <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
        <v-subheader class="px-0" v-if="item.type === 'ricktext'">{{item['label']}}</v-subheader>
        <trumbowyg v-if="item.type === 'ricktext'" v-model="data[item.model]" :config="config"></trumbowyg>
        <attached-file-avatar v-if="item.type === 'avatar'" :pk="data[item.model]" :pick-item="item" :current-data="data"></attached-file-avatar>
        <datetime-picker :class="item['class_component']" v-if="item.type === 'date'" v-model="data[item.model]" :item="item" :data-value="data[item.model]"></datetime-picker>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['link'] && ((item.dependency && String(id) !== '0') || !item.dependency)" :to="item.url + '?pk=' + data[item.pk] + '&col=' + (item.hasOwnProperty('pk_foreign') ? item.pk_foreign : item.pk) + '&pk_type=' + (item.hasOwnProperty('pk_type') ? item.pk_type : 'number') ">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['account'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAccount(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['attached'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['fileform'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['unlock']" v-on:click.native="unlock()">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'unlock'">lock_open</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['changeEmail']" v-on:click.native="showChangeEmail">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'changeEmail'">swap_horiz</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['active_acount'] && data['activationCode'] === 'verified'" v-on:click.native="activeAcount()">
          <v-icon class="mr-1" size="14">lock_open</v-icon>
          {{item.label}}
        </v-btn>
        <div v-if="item.type === 'image'" style="width: 100%;height:150px;">
          <span>{{data['applicantIdType'] === 'citizen' ? 'Ảnh CMND' : 'Ảnh giấy phép kinh doanh'}}</span>
          <img v-if="isJsonString(data['profile'])" :src="JSON.parse(data['profile']).indentifyNoFileUrl" style="width: 100%;height:140px;">
          <img v-else style="width: 100%;height:140px;">
        </div>
        <!-- <div v-if="item.type === 'imageBack'" style="width: 100%;height:150px;">
          <span>{{data['applicantIdType'] === 'citizen' ? 'Ảnh CMND mặt sau' : 'Ảnh giấy phép kinh doanh mặt sau'}}</span>
          <img v-if="isJsonString(data['profile'])" :src="JSON.parse(data['profile']).indentifyNoBFileUrl" style="width: 100%;height:140px;">
          <img v-else style="width: 100%;height:140px;">
          
        </div> -->
        <content-placeholders v-if="item.type === 'selects' && !pullOk && item.hasOwnProperty('datasource_key')">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && pullOk && item.hasOwnProperty('datasource_key')"
          v-model="data[item.model]"
          :items="dataSocket[item['datasource_key']]"
          :item-text="item.itemText"
          :item-value="item.itemValue"
          box
          :rules="processRules(item.rules, item)"
          :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
          @change="processChangeDataSource($event, item)"
          :chips="item['chips']"
          :multiple="item['multiple']"
          clearable
          :disabled="item['disabled']"
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-autocomplete>
        <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && !item.hasOwnProperty('datasource_key')"
          v-model="data[item.model]"
          :items="item.datasource"
          :item-text="item.itemText"
          :item-value="item.itemValue"
          box
          :rules="processRules(item.rules, item)"
          :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
          @change="processChangeDataSource($event, item)"
          :chips="item['chips']"
          :multiple="item['multiple']"
          clearable
          :disabled="item['disabled']"
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-autocomplete>
        <v-text-field :class="item['class_component']" v-if="item.type === 'text-fields'"
          v-model="data[item.model]"
          :rules="processRules(item.rules, item)"
          :placeholder="item['placeholder']"
          :disabled="item['disabled']"
          :maxlength="getMaxLength(item)"
          :counter="getMaxLength(item)"
          box 
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-textarea :class="item['class_component']" v-if="item.type === 'textarea'"
          v-model="data[item.model]"
          :rules="processRules(item.rules, item)"
          :placeholder="item['placeholder']"
          :disabled="item['disabled']"
          :maxlength="getMaxLength(item)"
          :counter="getMaxLength(item)"
          box 
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-textarea>
        <v-subheader class="px-0" v-if="item.type === 'codemirror'">{{item['label']}}</v-subheader>
        <codemirror v-if="item.type === 'codemirror'" v-model="data[item.model]" :options="cmOptions"></codemirror>
        <v-switch :class="item['class_component']" v-if="item.type === 'v-switch'"
          :label="item['label']" 
          v-model="data[item.model]"
        ></v-switch>
        <div v-if="item.hasOwnProperty('alongside')" v-for="(itemChild, indexChild) in item['alongside']" v-bind:key="indexChild">
          <v-subheader class="px-0" v-if="itemChild.type === 'ricktext'">{{itemChild['label']}}</v-subheader>
          <trumbowyg v-if="itemChild.type === 'ricktext'" v-model="data[itemChild.model]" :config="config"></trumbowyg>
          <attached-file-avatar :class="itemChild['class_component']" v-if="itemChild.type === 'avatar'" :pk="data[itemChild.model]" :pick-item="itemChild"></attached-file-avatar>
          <datetime-picker :class="itemChild['class_component']" v-if="itemChild.type === 'date'" v-model="data[itemChild.model]" :item="itemChild" :data-value="data[itemChild.model]"></datetime-picker>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['link'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" :to="itemChild.url + '?pk=' + data[itemChild.pk] + '&col=' + itemChild.pk">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['account'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAccount(itemChild)">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['attached'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAttached(itemChild)">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['unlock']" v-on:click.native="unlock()">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'unlock'">lock_open</v-icon>
            {{itemChild.label}}
          </v-btn>
          <content-placeholders v-if="itemChild.type === 'selects' && !pullOk && itemChild.hasOwnProperty('datasource_key')">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && pullOk && itemChild.hasOwnProperty('datasource_key')"
            v-model="data[itemChild.model]"
            :items="dataSocket[itemChild['datasource_key']]"
            :item-text="itemChild.itemText"
            :item-value="itemChild.itemValue"
            box
            :rules="processRules(itemChild.rules, itemChild)"
            :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
            @change="processChangeDataSource($event, itemChild)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
            :disabled="item['disabled']"
          >
            <template slot="label">{{itemChild['label']}} <span v-if="itemChild.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && !itemChild.hasOwnProperty('datasource_key')"
            v-model="data[itemChild.model]"
            :items="itemChild.datasource"
            :item-text="itemChild.itemText"
            :item-value="itemChild.itemValue"
            box
            :rules="processRules(itemChild.rules, itemChild)"
            :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
            @change="processChangeDataSource($event, itemChild)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
            :disabled="item['disabled']"
          >
            <template slot="label">{{itemChild['label']}} <span v-if="itemChild.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-text-field :class="itemChild['class_component']" v-if="itemChild.type === 'text-fields'"
            v-model="data[itemChild.model]"
            :rules="processRules(itemChild.rules, itemChild)"
            :placeholder="itemChild['placeholder']"
            box
            clearable
          >
            <template slot="label">{{itemChild['label']}} <span v-if="itemChild.required" class="red--text darken-3">*</span></template>
          </v-text-field>
          <v-textarea :class="itemChild['class_component']" v-if="itemChild.type === 'textarea'"
            v-model="data[itemChild.model]"
            :rules="processRules(itemChild.rules, itemChild)"
            :placeholder="itemChild['placeholder']"
            box
            clearable
          >
            <template slot="label">{{itemChild['label']}} <span v-if="itemChild.required" class="red--text darken-3">*</span></template>
          </v-textarea>
          <v-subheader class="px-0" v-if="itemChild.type === 'codemirror'">{{itemChild['label']}}</v-subheader>
          <codemirror v-if="itemChild.type === 'codemirror'" v-model="data[itemChild.model]" :options="cmOptions"></codemirror>
          <v-switch :class="itemChild['class_component']" v-if="itemChild.type === 'v-switch'"
            :label="itemChild['label']" 
            v-model="data[itemChild.model]"
          ></v-switch>
        </div>
      </v-flex>
      <v-flex xs12 class="text-right pt-0 ml-1 px-0" style="
          position: fixed;
          bottom: 0;
          width: -webkit-calc( 100% - 308px );
          width: calc( 100% - 308px );
          background: white;
          z-index: 4;
          border-top: 1px solid #dcdcdc;
      ">
        <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
        <v-btn v-if="(!tableConfig.hasOwnProperty('flagHtml') || (tableConfig.hasOwnProperty('flagHtml') && tableConfig['flagHtml']) ) && String(id) === '0'" color="teal darken-3" class="mr-0" dark
          :loading="loading"
          :disabled="loading"
          v-on:click.native="saveToData('cmd_ide')"
        >Ghi lại và thêm mới</v-btn>
        <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="saveToData('cmd')"
          :loading="loading"
          :disabled="loading"
          v-if="!tableConfig.hasOwnProperty('flagHtml') || (tableConfig.hasOwnProperty('flagHtml') && tableConfig['flagHtml']) "
        >Ghi lại</v-btn>
        <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
          <v-icon>reply</v-icon> &nbsp;
          Quay lại
        </v-btn>
        <!-- Thao tác preview -->
        <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="viewForm"
          v-if="tableName === 'opencps_dossierpart' && data['EForm']"
        >Xem trước form nhập</v-btn>
        <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="viewPdf(false)"
          :loading="loadingPdf"
          :disabled="loadingPdf"
          v-if="(tableName === 'opencps_dossierpart' && data['EForm']) || tableName === 'opencps_documenttype'"
        >Xem trước bản in</v-btn>
        <!--  -->
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <div id="video-preloader" class="video-preloader">
          <video loop id="editor-video-preloader" width="100%" height="350" muted="true" src="https://editorassets.parastorage.com/video-preloader/editor-video-preloader-2-@2x.mp4"></video>
        </div>
      </v-flex>
    </v-layout>
    <v-navigation-drawer
      v-model="rightAttached"
      right
      app
      fixed
      temporary
      style="background: #fff;"
      :width="600"
    >
      <v-card>
        <v-card-title primary-title class="pb-0">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              <span id="rightAttachedCounter"></span> {{layoutNameDynamic}}
            </v-flex>
          </v-layout>
          <v-btn class="my-0" flat icon color="primary" v-on:click.native="rightAttached = false" style="
    position: absolute;
    right: 25px;
">
            <v-icon size="18">clear</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2" v-if="pickItem['attached']">
          <attached-file-template v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-template>
        </v-card-title>
        <v-card-title primary-title class="pb-0 pt-2" v-if="pickItem['fileform']">
          <v-layout row wrap class="my-3">
            <v-flex xs12 class="text-center title">
              Tải file cấu hình mẫu FORM
            </v-flex>
            <attached-file-form v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-form>
            <v-flex xs12 class="text-center title mt-3">
              Tải file cấu hình mẫu Jasper
            </v-flex>
            <attached-file-jasper v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-jasper>
          </v-layout>
        </v-card-title>
      </v-card>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="rightAccount" right app fixed temporary style="background: #fff;">
      <v-card>
        <v-card-title primary-title class="pb-0">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              {{layoutNameDynamic}}
            </v-flex>
          </v-layout>
          <v-btn class="my-0" flat icon color="primary" v-on:click.native="rightAccount = false" style="position: absolute;right: 25px;">
            <v-icon size="18">clear</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="screenLogin"
                label="Tên đăng nhập" 
                box 
                readonly
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="emailLogin"
                label="Tài khoản đăng nhập" 
                box 
                readonly
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      <v-divider></v-divider>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              Đổi mật khẩu
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pt-2">
          <v-layout row wrap>
            <v-flex xs12 class="px-0">
              <v-form ref="form_2" v-model="valid2" lazy-validation>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    box
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :rules="[rules.required, rules.passWord]"
                    :type="e1 ? 'password' : 'text'"
                    name="input-10-2"
                    min="8"
                  >
                    <template slot="label">Mật khẩu mới <span class="red--text darken-3">*</span></template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-btn block color="blue darken-3" dark v-on:click.native="doChangePassWord()">Xác nhận</v-btn>
                </v-flex>
              </v-form>
            </v-flex>
            
            <v-flex xs12>
              <v-switch
                label="Kích hoạt tài khoản"
                v-model="deactiveAccountFlagBoolean"
                @change="doChangeStatusAccount($event)"
              ></v-switch>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      
    </v-navigation-drawer>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-form>
    <v-alert
      style="position: fixed!important;right: 0!important;top:46px;z-index:9999999999;"
      v-model="alertSuccess"
      max-width="300"
      color="cyan"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-lock-open-variant"
    >
      Thao tác thành công.
    </v-alert>
    <v-alert
      max-width="300"
      style="position: fixed!important;right: 0!important;top:46px;z-index:9999999999;"
      v-model="alertFail"
      color="#D32F2F"
      border="left"
      elevation="2"
      colored-border
      icon="mdi-lock-outline"
    >
      Thao tác thất bại.
    </v-alert>
    <v-dialog v-model="dialogChangeMail" persistent max-width="400">
      <v-card>
        <v-toolbar flat dark color="blue">
          <v-toolbar-title class="px-3">Cập nhật email tài khoản</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogChangeMail = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-2">
          <v-form ref="formChangeMail" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="oldEmail" label="Email hiện tại" disabled></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newEmail" label="Email mới" 
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          <v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" dark @click="dialogChangeMail = false">
            <v-icon>clear</v-icon>&nbsp;
            Thoát
          </v-btn>
          <v-btn color="blue darken-3" dark @click="changeEmail()">
            <v-icon>save</v-icon>&nbsp;
            Cập nhập
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!--  -->
  <v-dialog v-model="dialogEform" fullscreen hide-overlay transition="dialog-bottom-transition">
    <div class="">
      <v-toolbar class="toolbar-script" flat height="36" dark color="#1867c0">
        <v-toolbar-title class="white--text">
          <span v-if="viewFormInput">Form nhập</span>
          <span v-else>Bản in</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="tableName === 'opencps_dossierpart' && !viewFormInput" round dark small color="blue" @click="viewForm"
        >
          <v-icon size="18" class="white--text">description</v-icon> &nbsp; Form nhập
        </v-btn>
        <v-btn v-else round dark small color="green" @click="viewPdf(true)" class="mr-2"
          :loading="loadingPdf"
          :disabled="loadingPdf"
        >
          <v-icon size="16" class="white--text">fa fa-file-pdf-o</v-icon> &nbsp; Bản in
          <span slot="loader">Loading...</span>
        </v-btn>
        <v-btn flat small color="blue" icon @click="dialogEform = false">
          <v-icon size="28" class="white--text">clear</v-icon>
        </v-btn>
      </v-toolbar>
      <div v-if="viewFormInput === true" id="formInput" style="background: #fafafa;color: black;padding: 15px;"></div>
      <iframe v-else id="pdfPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;height: 100vh" frameborder="0">
      </iframe>
    </div>
  </v-dialog>
</div>
</template>

<script>
  import Vue from 'vue'
  import DatetimePicker from './DatetimePicker.vue'
  import AttachedFileTemplate from './AttachedFileTemplate.vue'
  import AttachedFileAvatar from './AttachedFileAvatar.vue'
  import AttachedFileForm from './AttachedFileForm.vue'
  import AttachedFileJasper from './AttachedFileJasper.vue'
  import axios from 'axios'
  import toastr from 'toastr'

  Vue.use(toastr)
  export default {
    props: ['tableConfig', 'detailData', 'id', 'tableName'],
    components: {
      DatetimePicker,
      AttachedFileTemplate,
      AttachedFileAvatar,
      AttachedFileForm,
      AttachedFileJasper,
      'trumbowyg': window.VueTrumbowyg.default
    },
    data() {
      return {
        alertFail: false,
        alertSuccess: false,
        dialogChangeMail: false,
        config: {},
        oldEmail: '',
        newEmail: '',
        deactiveAccountFlag: 0,
        deactiveAccountFlagBoolean: false,
        snackbarsuccess: false,
        snackbarerror: false,
        pickItem: {},
        layoutNameDynamic: '',
        mappingUserIdCurrent: '',
        screenLogin: '',
        emailLogin: '',
        password: '',
        rightAttached: false,
        rightAccount: false,
        pullOk: true,
        pullCounter: 0,
        valid: true,
        valid2: true,
        loading: false,
        data: {},
        dataSocket: {},
        detailForm: [],
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
        },
        e1: true,
        rules: {
          required: value => !!value || 'Bắt buộc phải nhập.',
          number: value => {
            const pattern = /^\d+$/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          },
          passWord: (value) => {
            const pattern = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
            return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
          },
          telNo: (value) => {
            const pattern = /^0([1-9]{1}\d{8})$/
            if (value) {
              return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
            } else {
              return []
            }
          },
          syntaxError: (value) => {
            if (value) {
              value = String(value).trim()
              return value.indexOf('</') < 0 ? true : 'Không được có ký tự </'   
            } else {
              return true
            }  
          },
          varchar50: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
            } else {
              return true
            }  
          },
          varchar75: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 75 ? true : 'Không được nhập quá 75 ký tự'   
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
          varchar2000: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
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
        },
        loadingPdf: false,
        viewFormInput: true,
        dialogEform: false
      }
    },
    computed: {
      isConnected: {
        // getter
        get: function() {
          return this.$store.getters.getisConnected
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setisConnected', newValue)
        }
      },
      oldEmail () {
        return this.data.email ? this.data.email : this.data.contactEmail
      }
    },
    created() {
      console.log('created')
      
      var vm = this
      vm.$nextTick(function() {
        
        if (vm.tableConfig !== null && vm.tableConfig !== undefined) {
          if (vm.tableConfig['detailColumns'] !== '') {
            vm.detailForm = eval('( ' + vm.tableConfig['detailColumns'] + ' )')
            console.log('1',vm.detailForm)
          } else {
            let videoElement = document.getElementById('editor-video-preloader')
            if (videoElement !== null && videoElement !== undefined) {
              videoElement.play()
            }
          }
          if (vm.detailData !== null && vm.detailData !== undefined && Array.isArray(vm.detailData) && vm.detailData.length > 0) {
             console.log(vm.tableName.split('_')[vm.tableName.split('_').length])
            if(vm.$router.history.current.query.idCopy){
              let data = {}
              for (let i=0; i< vm.detailForm.length; i++) {
                data[vm.detailForm[i]['model']] = vm.detailData[0][vm.detailForm[i]['model']]
              }
              for(let key in data) {
                if(!data[key]){
                  delete data[key]
                }
               
                if(key === vm.tableName.split('_')[vm.tableName.split('_').length] + 'Id') {
                  delete data[key]
                }
              }
              vm.data = data
              console.log('data1-a', vm.data)
              vm.processDataSourceVerify()
            } else {
              vm.data = vm.detailData[0]
              console.log('data1-b', vm.data)
              vm.processDataSourceVerify()
            }

          } else {
            vm.data = {}
          }
          vm.processDataSource()
        } else {
          let dataPost = new URLSearchParams()
          let textPost = {
            'type': 'admin',
            'cmd': 'get',
            'config': 'true',
            'code': vm.$router.history.current.params.tableName,
            'respone': 'tableConfig'
          }
          dataPost.append('text', JSON.stringify(textPost))
          axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
            let dataObj = response.data
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (dataObj.respone === 'tableConfig' && vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined) {
              vm.detailForm = eval('( ' + vm.dataSocket['tableConfig']['detailColumns'] + ' )')
              console.log('load tableConfig')
              console.log('2',vm.detailForm)
              vm.processDataSource()
            }
            textPost = {
              'type': 'admin',
              'cmd': 'get',
              'code': vm.$router.history.current.params.tableName,
              'respone': 'detail',
              'responeType': 'detail',
              'filter': [
                {
                  'key': 'id',
                  'value_filter': vm.id,
                  'compare': '=',
                  'type': 'number'
                }
              ]
            }
            dataPost = new URLSearchParams();
            dataPost.append('text', JSON.stringify(textPost))
            axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
              let dataObj = response.data
              vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
              if (dataObj.respone === 'detail') {
                if (vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && Array.isArray(vm.dataSocket['detail'])) {
                  if (vm.dataSocket['detail'].length === 0) {
                    vm.data = {}
                  } else {
                    vm.data = vm.dataSocket[dataObj.respone][0]
                    console.log('data1', vm.data)
                  }
                  vm.processDataSourceVerify()
                } else {
                  vm.data = {}
                }
              } else if (dataObj.respone === 'loginUser') {
                vm.$store.commit('setloginUser', dataObj['loginUser'])
              } 
            }).catch(function (error) {
            })
          }).catch(function (error) {
          })
        }
        // 
        try {
          if (rulesConfig) {
            vm.rules = Object.assign({}, vm.rules, rulesConfig)
          }
        } catch (error) {
        }
      })
    },
    methods: {
      clearLoading () {
        this.loading = false
      },
      backToList () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let currentPath = current.path
        let queryString = '?'
        newQuery['state_change'] = '0'
        newQuery['renew'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
        vm.$router.push({
          path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
        })
      },
      saveToData (cmdText) {
        let vm = this
        if (vm.isConnected) {
          vm.isConnected = false
        }
        if (vm.$refs.form.validate()) {
          vm.loading = true
          let current = vm.$router.history.current
          let newQuery = current.query
          let dataPOST = Object.assign({}, vm.data)
          delete dataPOST['expandoBridge']
          delete dataPOST['modelAttributes']
          delete dataPOST['stagedModelType']
          if (newQuery.hasOwnProperty('col') && newQuery.hasOwnProperty('pk')) {
            dataPOST[newQuery['col']] = newQuery['pk']
          }
          let dataPost = new URLSearchParams()
          let textPost = {
            'type': 'admin',
            'cmd': cmdText,
            'respone': 'detail',
            'id': vm.id,
            'code': vm.$router.history.current.params.tableName,
            'data': dataPOST
          }
          dataPost.append('text', JSON.stringify(textPost))
          axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
            let dataObj = response.data
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (dataObj.respone === 'detail') {
              if (vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && Array.isArray(vm.dataSocket['detail'])) {
                if (vm.dataSocket['detail'].length === 0) {
                  vm.data = {}
                } else {
                  vm.data = vm.dataSocket[dataObj.respone][0]
                }
                vm.processDataSourceVerify()
              } else {
                vm.data = {}
              }
            } else if (dataObj.respone === 'loginUser') {
              vm.$store.commit('setloginUser', dataObj['loginUser'])
            } 
            if (dataObj.respone === 'tableConfig' && vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined) {
              vm.detailForm = eval('( ' + vm.dataSocket['tableConfig']['detailColumns'] + ' )')
              console.log('3',vm.detailForm)
              console.log('load tableConfig')
              vm.processDataSource()
            }
            vm.loading = false
            if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get' && dataObj['cmd'] !== 'cmd_ide') {
              let current = vm.$router.history.current
              let newQuery = current.query
              let currentPath = current.path
              let queryString = '?'
              newQuery['state_change'] = '0'
              newQuery['renew'] = ''
              for (let key in newQuery) {
                if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                  queryString += key + '=' + newQuery[key] + '&'
                }
              }
              queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
              vm.$router.push({
                path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
              })
            } else if (dataObj['status'] === '200' && dataObj['cmd'] === 'cmd_ide') {
              vm.snackbarsuccess = true
              vm.data = {}
            }
            if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
              vm.pullCounter = vm.pullCounter - 1
              if (vm.pullCounter === 0) {
                vm.pullOk = true
              }
            }
          }).catch(function (error) {
          })
        }
      },
      processRules (rulesStr, itemData) {
        let maxLength
        let syntaxErrorInput = false
        let vm = this
        if (itemData.hasOwnProperty('type') && (itemData.type === 'text-fields' || itemData.type === 'textarea')) {
          maxLength = 500
          if (itemData.type === 'textarea') {
            maxLength = 2000
          }
          if (itemData.hasOwnProperty('model') && (itemData.model.endsWith('Code') || itemData.model.endsWith('No') || itemData.model.endsWith('Id'))) {
            maxLength = 75
          }
          syntaxErrorInput = true
        }
        let rulesInput = []
        if (rulesStr) {
          let hasRuleVarChar = rulesStr.indexOf('varchar') >= 0 ? true : false
          rulesInput = eval('( ' + rulesStr + ' )')
          if (maxLength == 2000 && !hasRuleVarChar) {
            rulesInput.push(vm.rules.varchar2000)
          }
          if (maxLength == 500 && !hasRuleVarChar) {
            rulesInput.push(vm.rules.varchar500)
          }
          if (maxLength == 75 && !hasRuleVarChar) {
            rulesInput.push(vm.rules.varchar75)
          }
        } else {
          if (maxLength == 2000) {
            rulesInput.push(vm.rules.varchar2000)
          }
          if (maxLength == 500) {
            rulesInput.push(vm.rules.varchar500)
          }
          if (maxLength == 75) {
            rulesInput.push(vm.rules.varchar75)
          }
        }
        if (syntaxErrorInput) {
          rulesInput.push(vm.rules.syntaxError)
        }
        return rulesInput
        // return eval('( ' + rulesStr + ' )')
      },
      getMaxLength(itemData) {
        let maxLength
        if (itemData.hasOwnProperty('type') && (itemData.type === 'text-fields' || itemData.type === 'textarea')) {
          maxLength = 500
          if (itemData.type === 'textarea') {
            maxLength = 2000
          }
          if (itemData.hasOwnProperty('model') && (itemData.model.endsWith('Code') || itemData.model.endsWith('No') || itemData.model.endsWith('Id'))) {
            maxLength = 100
          }
        }
        return maxLength

      },
      processChangeDataSource (data, item) {
        let vm = this
        if (item.hasOwnProperty('concatina')) {
          vm.pullOk = false
          vm.pullCounter = vm.pullCounter + 1
          // comment send login user
          if (item.concatina['datasource_key'] !== 'loginUser') {
            let dataPost = new URLSearchParams()
            let textPost = {
              'type': 'api',
              'cmd': 'get',
              'respone': item.concatina['datasource_key'],
              'api': item.concatina['datasource_api'] + '?' + item.concatina['query'] + '=' + data,
              'headers': {
                'Token': vm.getAuthToken(),
                'groupId': vm.getScopeGroupId(),
                'USER_ID': vm.getUserId()
              }
            }
            dataPost.append('text', JSON.stringify(textPost))
            axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
              let dataObj = response.data
              vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
              if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get' && dataObj['cmd'] !== 'cmd_ide') {
                let current = vm.$router.history.current
                let newQuery = current.query
                let currentPath = current.path
                let queryString = '?'
                newQuery['state_change'] = '0'
                newQuery['renew'] = ''
                for (let key in newQuery) {
                  if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                    queryString += key + '=' + newQuery[key] + '&'
                  }
                }
                queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
                vm.$router.push({
                  path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
                })
              } else if (dataObj['status'] === '200' && dataObj['cmd'] === 'cmd_ide') {
                vm.snackbarsuccess = true
                vm.data = {}
              }
              if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
                vm.pullCounter = vm.pullCounter - 1
                if (vm.pullCounter === 0) {
                  vm.pullOk = true
                }
              }
            }).catch(function (error) {
            })
            
          }
        }
      },
      processDataSourceVerify () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            if (vm.data.hasOwnProperty(vm.detailForm[key]['model']) && String(vm.data[vm.detailForm[key]['model']]).startsWith("[")) {
              vm.data[vm.detailForm[key]['model']] = JSON.parse(vm.data[vm.detailForm[key]['model']])
            }
          }
        }
      },
      processDataSource () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            vm.pullOk = false
            vm.pullCounter = vm.pullCounter + 1
            let apiURL = vm.detailForm[key]['datasource_api']
            if (vm.detailForm[key]['dependency'] && vm.detailForm[key].hasOwnProperty('pk')) {
              apiURL = apiURL + '?pk' + '=' + vm.id + '&col=' + vm.detailForm[key]['pk']
            }
            // comment send login user
            
            if (vm.detailForm[key]['datasource_key'] !== 'loginUser') {
              let dataPost = new URLSearchParams()
              let textPost = {
                'type': 'api',
                'cmd': 'get',
                'respone': vm.detailForm[key]['datasource_key'],
                'api': apiURL,
                'headers': {
                  'Token': vm.getAuthToken(),
                  'groupId': vm.getScopeGroupId(),
                  'USER_ID': vm.getUserId()
                }
              }
              dataPost.append('text', JSON.stringify(textPost))
              axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
                let dataObj = response.data
                vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
                if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get' && dataObj['cmd'] !== 'cmd_ide') {
                  let current = vm.$router.history.current
                  let newQuery = current.query
                  let currentPath = current.path
                  let queryString = '?'
                  newQuery['state_change'] = '0'
                  newQuery['renew'] = ''
                  for (let key in newQuery) {
                    if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                      queryString += key + '=' + newQuery[key] + '&'
                    }
                  }
                  queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
                  vm.$router.push({
                    path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
                  })
                } else if (dataObj['status'] === '200' && dataObj['cmd'] === 'cmd_ide') {
                  vm.snackbarsuccess = true
                  vm.data = {}
                }
                if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
                  vm.pullCounter = vm.pullCounter - 1
                  if (vm.pullCounter === 0) {
                    vm.pullOk = true
                  }
                }
              }).catch(function (error) {
              })
              
            }
          }
        }
      },
      doDeactiveAccount () {
        let vm = this
        let postData = {
          id: vm.detailData[0]['mappingUserId'],
          data: {
            locked: vm.password
          }
        }
        vm.$store.dispatch('deactiveAccount', postData).then(function (data) {
          vm.snackbarsuccess = true
          console.log(data)
        })
      },
      doChangePassWord () {
        let vm = this
        if (vm.$refs.form_2.validate()) {
          var result = confirm('Bạn có muốn đổi mật khẩu?');
          if (result) {
            let postData = {
              id: vm.detailData[0]['mappingUserId'] ? vm.detailData[0]['mappingUserId'] : vm.mappingUserIdCurrent,
              data: {
                password: vm.password
              }
            }
            vm.$store.dispatch('changePassUserAccount', postData).then(function (data) {
              vm.snackbarsuccess = true
              console.log(data)
            })
          }
        }
      },
      doChangeStatusAccount (dataLock) {
        let vm = this
        let labelStatus = 'Bạn có muốn khoá tài khoản này?'
        if (dataLock) {
          labelStatus = 'Bạn có muốn mở khoá tài khoản này?'
        }
        var result = confirm(labelStatus)
        if (result) {
          let postData = {
            id: vm.detailData[0]['mappingUserId'] ? vm.detailData[0]['mappingUserId'] : vm.mappingUserIdCurrent,
            data: {
              locked: !dataLock
            }
          }
          vm.$store.dispatch('doChangeStatusAccount', postData).then(function (data) {
            vm.snackbarsuccess = true
            console.log(data)
          })
        } else {
          setTimeout(function() {
            vm.deactiveAccountFlagBoolean = !dataLock
          }, 10)
        }
      },
      showAccount (item) {
        let vm = this
        if (
          (vm.detailData[0]['mappingUserId'] === 0) ||
          (vm.detailData[0]['modelClassName'] === 'org.opencps.usermgt.model.Applicant' && vm.detailData[0]['mappingUserId'] !== 0 && vm.detailData[0]['activationCode'])
        ) {
          let emailItem = (vm.detailData[0]['modelClassName'] === 'org.opencps.usermgt.model.Applicant') ? vm.detailData[0]['contactEmail'] : vm.detailData[0]['email']
          let typeUser = (vm.detailData[0]['modelClassName'] === 'org.opencps.usermgt.model.Applicant') ? 'applicant' : 'employee'
          let filterDetaiUser = {
            type: (vm.detailData[0]['modelClassName'] === 'org.opencps.usermgt.model.Applicant') ? 'applicant' : 'employee',
            id: vm.id
          }
          vm.$store.dispatch('getUserDetail', filterDetaiUser).then(function (data) {
            if (!data['mappingUser'] || 
              (vm.detailData[0]['modelClassName'] === 'org.opencps.usermgt.model.Applicant' && data['mappingUser'] && vm.detailData[0]['activationCode'])
            ) {
              if (item['email'] === '') {
                alert('Cấp địa chỉ email trước khi tạo tài khoản.')
              } else {
                let textNotify = (typeUser === 'applicant') ? 'Bạn có muốn cấp tài khoản sử dụng cho công dân, doanh nghiệp này?' : 'Bạn có muốn cấp tài khoản sử dụng cho nhân sự này?'
                var result = confirm(textNotify)
                if (result) {
                  let postData = {
                    type: typeUser,
                    id: vm.id,
                    data: {
                      email: emailItem,
                      screenName: '',
                      exist: false
                    }
                  }
                  vm.$store.dispatch('createUserAccount', postData).then(function (data) {
                    vm.$store.dispatch('getUserDetail', filterDetaiUser).then(function (data) {
                      vm.mappingUserIdCurrent = data['mappingUser']['userId']
                      vm.screenLogin = data['mappingUser']['screenName']
                      vm.emailLogin = emailItem
                    })
                    vm.deactiveAccountFlag = data['deactiveAccountFlag']
                    if (vm.deactiveAccountFlag === 0) {
                      vm.deactiveAccountFlagBoolean = true
                    } else {
                      vm.deactiveAccountFlagBoolean = false
                    }
                    vm.layoutNameDynamic = item['label']
                    vm.rightAccount = !vm.rightAccount
                  })
                }
              }
            } else {
              vm.screenLogin = data['mappingUser']['screenName']
              vm.emailLogin = emailItem
              vm.deactiveAccountFlagBoolean = false
              vm.layoutNameDynamic = item['label']
              vm.rightAccount = !vm.rightAccount
            }
          })
        } else {
          vm.$store.dispatch('getUserAccount', vm.detailData[0]['mappingUserId']).then(function (data) {
            vm.screenLogin = data['screenName']
            vm.emailLogin = data['email']
            vm.deactiveAccountFlag = data['deactiveAccountFlag']
            if (vm.deactiveAccountFlag === 0) {
              vm.deactiveAccountFlagBoolean = true
            } else {
              vm.deactiveAccountFlagBoolean = false
            }
            vm.layoutNameDynamic = item['label']
            vm.rightAccount = !vm.rightAccount
          })
        }
      },
      showAttached (item) {
        let vm = this
        vm.layoutNameDynamic = item['label']
        vm.pickItem = item
        if(vm.tableName === 'opencps_deliverabletype') {
          vm.pickItem['fileTemplateId'] = vm.data['fileTemplateId']
          vm.pickItem['deliverableTypeId'] = vm.data['deliverableTypeId']
        }
        vm.rightAttached = !vm.rightAttached
      },
      unlock () {
        let vm = this
        let params = {}
        if(vm.data.modelClassName === 'org.opencps.usermgt.model.Employee'){
          params = {
            email: vm.data.email,
            mappingUserId: vm.data.mappingUserId
          }
        }
        if(vm.data.modelClassName === 'org.opencps.usermgt.model.Applicant'){
          params = {
            email: vm.data.contactEmail,
            mappingUserId: vm.data.mappingUserId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('email', JSON.stringify(params.email))
        dataPost.append('mappingUserId', JSON.stringify(params.mappingUserId))
        axios.post('/o/rest/v2/users/lockin', dataPost).then((res)=>{
          console.log('lockin', res)
          vm.snackbarsuccess = true
        }).catch( ()=>{
        })
      },
      activeAcount () {
        let vm = this
        axios.post('/o/rest/v2/applicants/'+vm.data.applicantId+'/active').then((res)=>{
          console.log('activeAcount', res)
          vm.snackbarsuccess = true
        }).catch( ()=>{
          vm.snackbarerror = true
        })
      },
      showChangeEmail () {
        let vm = this
        vm.dialogChangeMail = true
        if(vm.data.modelClassName === 'org.opencps.usermgt.model.Employee'){
          vm.oldEmail = vm.data.email
        }
        if(vm.data.modelClassName === 'org.opencps.usermgt.model.Applicant'){
          vm.oldEmail = vm.data.contactEmail
        }
        vm.newEmail = ''
        vm.$refs.formChangeMail.resetValidation()
      },
      changeEmail(){
        let vm = this
        if(vm.$refs.formChangeMail.validate()){
          let params = {}
          console.log(vm.data)
          if(vm.data.modelClassName === 'org.opencps.usermgt.model.Employee'){
            params = {
              oldEmail: vm.data.email,
              newEmail: vm.newEmail
            }
          }
          if(vm.data.modelClassName === 'org.opencps.usermgt.model.Applicant'){
            params = {
              oldEmail: vm.data.contactEmail,
              newEmail: vm.newEmail
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('oldEmail', params.oldEmail)
          dataPost.append('newEmail', params.newEmail)
          axios.post('/o/rest/v2/applicants/updatemail', dataPost).then((res)=>{
            vm.dialogChangeMail= false
            console.log('changeMail', res)
            if (res.data.user && res.data.user.hasOwnProperty('emailAddess') && res.data.user.emailAddess){
              vm.snackbarsuccess = true
            } else {
              vm.snackbarerror = true
            }
          }).catch( ()=>{
            vm.snackbarerror = true
          })
        }
      },
      isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
      },
      viewForm () {
        let vm = this
        let formScript, formData
        /* eslint-disable */
        try {
          formScript =  eval('(' + vm.data.formScript + ')')
        } catch (error) {
          if (vm.data.formScript === '') {
            toastr.error('Chưa có cấu hình mã tạo form')
          } else {
            toastr.error('Lỗi cấu hình mã tạo form')
          }
          return
        }
        formData = {}
        /* eslint-disable */
        try {
          formScript.data = eval('(' + vm.data.sampleData + ')')
          vm.viewFormInput = true
          vm.dialogEform = true
          setTimeout(function () {
            window.$('#formInput').empty()
            window.$('#formInput').alpaca(formScript)
          }, 200)
        } catch (error) {
          if (vm.data.sampleData === '') {
            toastr.error('Chưa có cấu hình dữ liệu mẫu')
            formScript.data = {}
          } else {
            toastr.error('Lỗi cấu hình dữ liệu mẫu')
            return
          }
          vm.viewFormInput = true
          vm.dialogEform = true
          setTimeout(function () {
            window.$('#formInput').empty()
            window.$('#formInput').alpaca(formScript)
          }, 200)
          
        }
        
      },
      viewPdf (t) {
        let vm = this
        if ((vm.tableName === 'opencps_dossierpart' && vm.data.formReport === '') || (vm.tableName === 'opencps_documenttype' && vm.data.documentScript === '')) {
          toastr.error('Chưa có cấu hình mã thiết kế xml jasper')
          return
        }
        let formData = {}
        try {
          if (t) {
            let control = window.$('#formInput').alpaca('get')
            formData = control.getValue()
          } else {
            formData = vm.data.sampleData ? eval('(' + vm.data.sampleData + ')') : {}
          }
        } catch (error) {
          
        }
        vm.loadingPdf = true
        let options = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          responseType: 'blob'
        }
        if (!formData) {
          formData = {}
        }
        let formReport
        if (vm.tableName === 'opencps_dossierpart') {
          formReport = vm.data.formReport
        }
        if (vm.tableName === 'opencps_documenttype') {
          formReport = vm.data.documentScript
        }
        let dataCreate = new URLSearchParams()
        dataCreate.append('scriptStr', formReport)
        dataCreate.append('jsonDataStr', JSON.stringify(formData))
        axios.post('/o/rest/v2/jaspers/preview', dataCreate, options).then(function (response) {
          vm.loadingPdf = false
          vm.dialogEform = true
          vm.viewFormInput = false
          let serializable = response.data
          let file = window.URL.createObjectURL(serializable)
          setTimeout(() => {
            document.getElementById('pdfPreview').src = file
          }, 200)
        }).catch(function (response) {
          vm.loadingPdf = false
        })
      },
    }
  }
</script>
