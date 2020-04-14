<template>

  <div>
    <v-layout wrap>
      <v-flex xs12 md3 v-for="(item,index) in domains" :key="index" class="px-2 my-2">
        <div @click="redirectDVC(item)" style="width: 100%; height:215px;background: rgb(27, 117, 227); position: relative;display:flex;cursor: pointer;">
            <v-icon v-if="item.domainCode === 'BGTVT_DB'" color="#fff" style="font-size: 163px; margin: 0 auto;">local_shipping</v-icon>
            <v-icon v-if="item.domainCode ==='BGTVT_DS'" color="#fff" style="font-size: 163px; margin: 0 auto;">directions_transit</v-icon>
            <v-icon  v-if="item.domainCode ==='BGTVT_HK'" color="#fff" style="font-size: 163px; margin: 0 auto;">local_airport</v-icon>
            <v-icon v-if="item.domainCode ==='BGTVT_HH'" color="#fff" style="font-size: 163px; margin: 0 auto;">directions_boat</v-icon>
            <v-icon v-if="item.domainCode ==='BGTVT_DTND'" color="#fff" style="font-size: 163px; margin: 0 auto;">rowing</v-icon>
            <v-icon  v-if="item.domainCode ==='BGTVT_DK'" color="#fff" style="font-size: 163px; margin: 0 auto;">local_shipping</v-icon>
            <v-icon  v-if="item.domainCode ==='BGTVT_LVK'" color="#fff" style="font-size: 163px; margin: 0 auto;">devices_other</v-icon>
            <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
              <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
            </div>
        </div>
      </v-flex>
    </v-layout>
  </div>

</template>
<script>
export default {
    data () {
        return{
          loading: true,
            domains: []
        }
    },
    created(){
        let vm = this
        vm.$nextTick(()=>{
            vm.getDomains()
        })
    },
    methods: {
      getDomains(){
          let vm = this
          let filter = {}
          vm.$store.dispatch('getDomains',filter).then((res => {
            console.log(res)
              vm.domains = res
          }))
      },
      redirectDVC(item) {
          let vm = this
          let newQuery = {}
          let queryString = '?'
          newQuery['domain'] = item.domainCode
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          vm.$router.push({
            path: '/add-dvc/0'+ queryString,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
      }
    }
}
</script>