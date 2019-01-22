<template>
  <v-app id="app_voting">
    <v-navigation-drawer app clipped floating width="310" v-if="!viewMobile">
      <v-tabs v-model="active" class="service__info__menu">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="tab-1" ripple class="primary--text">
          Cơ quan quản lý
        </v-tab>
        <v-tab key="tab-2" ripple class="primary--text">
          Lĩnh vực
        </v-tab>
        <v-tab key="tab-3" ripple class="primary--text">
          Mức độ
        </v-tab>
        <v-tab-item key="tab-1" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in govAgencyList" :key="item.administrationCode"
                :class="{'list__tile--active': String(currentAgency) === String(item.administrationCode)}"
                @click="filterAgency(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentAgency) === String(item.administrationCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title style="width: calc(100% - 45px)" :title="item.administrationName" v-text="item.administrationName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item key="tab-2" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in domainList" :key="item.domainCode"
                :class="{'list__tile--active': String(currentDomain) === String(item.domainCode)}"
                @click="filterDomain(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentDomain) === String(item.domainCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.domainName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item key="tab-3" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in levelList" :key="item.level"
                :class="{'list__tile--active': String(currentLevel) === String(item.level)}"
                @click="filterLevel(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentLevel) === String(item.level)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Mức độ {{item.level}}</v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-navigation-drawer>
    <div v-if="viewMobile && !isDetail">
      <div class="row-header mb-2 py-1" style="background-color: #070f52">
        <div class="ml-2 text-bold white--text"> <span>THỦ TỤC HÀNH CHÍNH</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left white--text" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp; Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <v-tabs v-model="active" class="service__info__menu">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="tab-1" ripple class="primary--text">
          Cơ quan quản lý
        </v-tab>
        <v-tab key="tab-2" ripple class="primary--text">
          Lĩnh vực
        </v-tab>
        <v-tab key="tab-3" ripple class="primary--text">
          Mức độ
        </v-tab>
        <v-tab-item key="tab-1" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in govAgencyList" :key="item.administrationCode"
                :class="{'list__tile--active': String(currentAgency) === String(item.administrationCode)}"
                @click="filterAgency(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentAgency) === String(item.administrationCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.administrationName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
        <v-tab-item key="tab-2" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in domainList" :key="item.domainCode"
                :class="{'list__tile--active': String(currentDomain) === String(item.domainCode)}"
                @click="filterDomain(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentDomain) === String(item.domainCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.domainName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
        <v-tab-item key="tab-3" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in levelList" :key="item.level"
                :class="{'list__tile--active': String(currentLevel) === String(item.level)}"
                @click="filterLevel(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentLevel) === String(item.level)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Mức độ {{item.level}}</v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-content>
      1231231313
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  
  import { isMobile } from 'mobile-device-detect'
  export default {
    data: () => ({
      active: null,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      isDetail: false,
      text: ''
    })
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
