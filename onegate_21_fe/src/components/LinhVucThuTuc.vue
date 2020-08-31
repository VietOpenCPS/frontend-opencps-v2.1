<template>

  <div>
    <div class="row-header no__hidden_class">
      <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
        <span>LĨNH VỰC THỦ TỤC HÀNH CHÍNH</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
      </div> 
    </div>
    <v-layout wrap>
      <v-flex xs12 md3 v-for="(item,index) in domains" :key="index" class="px-2 my-2">
        <div v-if="item.domainCode === 'BGTVT_DB'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-DB.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_DS'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-DS.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_HK'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-HK.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_HH'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-HH.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_DTND'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-CDTND.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_DK'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-DK.png) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else-if="item.domainCode === 'BGTVT_LVK'" @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-LVK.jpg) center center no-repeat;background-size: cover
         "
        >
          <div style="width: 100%; background: #4d47479c;;height: 50px;position: absolute;bottom: 0px; display:flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 20px;">{{item.domainName}}</span>
          </div>
        </div>
        <div v-else @click="redirectDVC(item)"
         style="width: 100%; height:215px;position: relative;display:flex;cursor: pointer;
          background: url(/o/kiemthuduongbo-theme/images/img-BGTVT-LVK.jpg) center center no-repeat;background-size: cover
         "
        >
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