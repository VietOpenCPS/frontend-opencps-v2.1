<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app width="240">
      <v-list dense>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="deliverableRouter(item)"
        >
          <v-list-tile-action>
            <v-icon>description</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid class="px-0">
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
      items() {
        return this.$store.getters.getlistTableMenu
      },
      loginUser() {
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
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      redirectControlPanel() {
        let controlPanelURL = ''
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          controlPanelURL = window.themeDisplay.getLayoutRelativeControlPanelURL()
        }
        window.location.href = controlPanelURL + '?p_p_id=com_liferay_layout_admin_web_portlet_GroupPagesPortlet'
      },
      getItemSearch() {
        let vm = this
        if (vm.items.length === 2) {
          return vm.items[1].children
        } else if (vm.items.length > 2) {
          return vm.items[2].children
        } else {
          return []
        }
      },
      doLogOut() {
        window.location.href = '/o/portal/logout'
      },
      deliverableRouter (item) {
        console.log(item)
      }
    }
  }
</script>