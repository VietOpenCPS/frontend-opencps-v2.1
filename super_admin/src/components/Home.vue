<template>
  <v-app>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
      width="240"
      dark
    >
      <div class="sidebar-background" style="background-image: url(&quot;http://localhost:8081/static/img/bg__default.png&quot;);"></div>
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :append-icon="item.model ? item.icon : item['icon-alt']"
            prepend-icon="folder_open"
            dark
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
              :class='{"list__active": tableName === child.code}'
              :to="child.link"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text" @click="">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
      height="48"
    >
      <v-toolbar-title style="width: 240px" class="ml-0 pl-1">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Quản trị dữ liệu</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer style="max-width: 25px;"></v-spacer>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Nghiệp vụ',
          model: true,
          children: [
            {
              icon: 'group_add',
              link: '/can_bo',
              code: 'can_bo',
              text: 'Cán bộ'
            },
            {
              icon: 'filter_1',
              link: '/thu_tuc_hanh_chinh',
              code: 'thu_tuc_hanh_chinh',
              text: 'Thủ tục hành chính'
            },
            {
              icon: 'filter_2',
              link: '/mau_ho_so',
              code: 'mau_ho_so',
              text: 'Mẫu hồ sơ'
            },
            {
              icon: 'filter_3',
              link: '/quy_trinh_thu_tuc',
              code: 'quy_trinh_thu_tuc',
              text: 'Quy trình thủ tục'
            },
            {
              icon: 'filter_4',
              link: '/dich_vu_cong',
              code: 'dich_vu_cong',
              text: 'Dịch vụ công'
            },
            {
              icon: 'import_export',
              link: '/import/tool_import',
              code: 'import',
              text: 'Import'
            }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Dữ liệu dùng chung',
          model: false,
          children: [
            {
              icon: 'arrow_right',
              link: '/opencps_dictcollection',
              code: 'opencps_dictcollection',
              text: 'Nhóm danh mục'
            },
            {
              icon: 'arrow_right',
              link: '/opencps_dictgroup',
              code: 'opencps_dictgroup',
              text: 'Nhóm dữ liệu danh mục'
            },
            {
              icon: 'arrow_right',
              link: '/opencps_dictitem',
              code: 'opencps_dictitem',
              text: 'Dữ liệu danh mục'
            },
            {
              icon: 'arrow_right',
              link: '/opencps_holiday',
              code: 'opencps_holiday',
              text: 'Ngày nghỉ lễ'
            },
            {
              icon: 'arrow_right',
              link: '/opencps_worktime',
              code: 'opencps_worktime',
              text: 'Ngày làm việc trong tuần'
            },
            {
              icon: 'arrow_right',
              link: '/opencps_notificationtemplate',
              code: 'opencps_notificationtemplate',
              text: 'Mẫu thông báo'
            }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Bảng dữ liệu DB',
          model: false,
          children: [
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Cấu hình',
          model: false,
          children: [
            {
              icon: 'apps',
              link: '/table/opencps_adminconfig',
              code: 'opencps_adminconfig',
              text: 'Danh sách màn hình'
            }
          ]
        }
      ]
    }),
    props: {
      tableName: String
    }
  }
</script>