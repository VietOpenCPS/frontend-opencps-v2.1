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
      <div class="sidebar-background" style="background-image: url(&quot;/o/vue-admin/images/bg_menu.jpg&quot;);"></div>
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
            v-else-if="item.hasOwnProperty('children')"
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
              v-if="item.hasOwnProperty('children')"
              v-for="(child, i) in item.children"
              :key="i"
              :class='{"list__active": tableName === child.code}'
              :to="child.link + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1"
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
          <v-list-tile v-else :key="item.text">
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
      <v-autocomplete
        :items="getItemSearch()"
        item-text="text"
        item-value="link"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
        @change="redirectFilter($event)"
      ></v-autocomplete>
      <v-spacer style="max-width: 25px;"></v-spacer>
      <v-btn v-if="loginUser['role'] === 'Administrator'" flat class="mx-0 my-0" v-on:click.native="redirectControlPanel()">
        <v-avatar size="32px" tile>
          <v-icon>settings</v-icon>
        </v-avatar>
        Cấu hình trang
      </v-btn>
      <v-btn flat class="mr-2 my-0 ml-0">
        <v-avatar size="32px" tile>
          <v-icon dark>account_circle</v-icon>
        </v-avatar>
          {{loginUser['email']}}
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="closeError()"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarsocket"
      :bottom="true"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="0"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      <v-progress-circular
        :size="20"
        :width="1"
        color="white"
        indeterminate
      ></v-progress-circular>
      &nbsp;
      Mất kết nối, tự động kết nối lại trong giây lát ... 
      
      <v-btn
        icon
        @click="reloadPage()"
      >
        <v-icon>replay</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {}
    }),
    props: {
      tableName: String
    },
    computed: {
      items () {
        return this.$store.getters.getlistTableMenu
      },
      loginUser () {
        return this.$store.getters.getloginUser
      },
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      },
      snackbarsocket: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarsocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarsocket', newValue)
        }
      }
    },
    methods: {
      redirectFilter (val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError () {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage () {
        window.location.reload(true)
      },
      redirectControlPanel () {
        let controlPanelURL = ''
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          controlPanelURL = window.themeDisplay.getLayoutRelativeControlPanelURL()
        }
        window.location.href = controlPanelURL + '?p_p_id=com_liferay_layout_admin_web_portlet_GroupPagesPortlet'
      },
      getItemSearch () {
        let vm = this
        if (vm.items.length === 2) {
          return vm.items[1].children
        } else if (vm.items.length > 2) {
          return vm.items[2].children
        } else {
          return []
        }
      }
    }
  }
</script>