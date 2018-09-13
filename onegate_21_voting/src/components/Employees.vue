<template>
  <div style="height: 100%; background-color: #ffff;">
    <v-layout row wrap>
     <v-flex xs12 sm12 class="text-xs-center mt-4 mb-5">
          <h3 class="text-xs-center">ĐÁNH GÍA CÁN BỘ CÔNG CHỨC</h3>
          <h3 style="text-transform: uppercase; color: #237ff9;" class="text-xs-center">{{administrationName}}</h3>
      </v-flex>
     <v-flex xs12 sm1>
     </v-flex>
     <v-flex xs12 sm10>
       <v-layout row wrap>
         <v-flex xs4 sm3 v-for="(item, index) in employeeItems" class="text-xs-center" :key="index">
           <v-card style="width: 200px; margin: 0 auto; padding: 10px 0;">
              <img v-if="item['imageUrl']" style="width: 166px; height: 166px;" src="item['imageUrl']"/>
              <img v-else style="width: 166px; height: 166px;" src="https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0="/> <br>
             <span>{{item.fullName}}</span> <br>
             <v-btn small color="primary" @click="viewVotings(item, index)">Đánh giá</v-btn>
           </v-card>
           <!-- <div>
             <img style="width: 166px; height: 166px;" src="https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0="/> <br>
             <span>{{item.fullName}}</span> <br>
             <v-btn small color="primary" :to="'/danh-sach-can-bo/' + itemCode + '/' + item.employeeId">Đánh gía</v-btn>
           </div> -->
         </v-flex>
       </v-layout>
     </v-flex>
     <v-flex xs12 sm1>
       
     </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: ['itemCode'],
  components: {
  },
  data: () => ({
    govAgencyName: {},
    administrationName: '',
    employeeItems: [],
    btnLoading: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------', vm.itemCode)
    let currentQuery = vm.$router.history.current.query
    if (currentQuery.hasOwnProperty('administrationName')) {
      vm.administrationName = currentQuery.administrationName
    }
    vm.$nextTick(function () {
      vm.$store.dispatch('loadEmployees', {
        itemCode: vm.itemCode
      }).then(result => {
        vm.employeeItems = result
        if (vm.employeeItems.length > 0) {
          for (var i = 0; i < vm.employeeItems.length; i++) {
            vm.getImageUsers(i, vm.employeeItems[i])
          }
        }
        console.log(vm.employeeItems)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    getImageUsers (key, item) {
      var vm = this
      vm.$store.dispatch('loadImageEmployee', item).then(result => {
        item['imageUrl'] = result
      }).catch(xhr => {
      })
      // vm.fileAttachmentUrl({
      //   method : 'GET',
      //   url : '/o/rest/v2/users/' + item.mappingUser.userId + '/photo',
      //   async : false,
      //   success: function (options) {
      //     var urlOut = options.url
      //     item['imageUrl'] = urlOut
      //   },
      //   error: function () {}
      // })
    },
    viewVotings (item, index) {
      var vm = this
      var query = item
      query['administrationName'] = vm.administrationName
      router.push({
        path: '/danh-sach-can-bo/' + vm.itemCode + '/' + item.employeeId,
        query: query
      })
    }
  },
  filters: {
  }
}
</script>
