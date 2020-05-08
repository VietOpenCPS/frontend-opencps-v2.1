<template>
    <div>
        <div class="content-wrapper">
            <div class="search-section" style="height: calc(100vh - 162px) !important">
                <div class="note">
                    <span style="font-size: 18px;">Nhập mã số hồ sơ mà bạn muốn xử lý <br>Hoặc chọn đơn vị để thực hiện quản lý hồ sơ</span>
                </div>
                <div class="search-wrapper">
                    <div class="search">
                        <input type="text" class="form-control" placeholder="Nhập mã số hồ sơ" id="keyword" name="keyword">
                        <input name="secretKey" type="hidden" value="OPENCPSV2">
                        <button type="button" @click="">Xử lý hồ sơ</button>
                    </div>
                </div>

                <v-flex class="select-gov text-xs-center flex mt-3">
                    <div style="width: 565px" class="d-inline-block">
                        <v-autocomplete
                            class="select-search d-inline-block"
                            style="width: 450px"
                            placeholder="Chọn đơn vị"
                            :items="listDonVi"
                            v-model="donviSelect"
                            :hide-selected="true"
                            item-text="itemName"
                            item-value="itemCode"
                            clearable
                            hide-details
                            solo
                            flat
                            height="32"
                            min-height="32"
                        ></v-autocomplete>
                        <button class="d-inline-block" type="button" @click="">Quản lý hồ sơ</button>
                    </div>
                    
                </v-flex>
                
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      listDonVi: [],
      donviSelect: ''
    }),
    components: {

    },
    computed: {
      
    },
    beforeDestroy () {

    },
    mounted () {
     
    },
    beforeCreate() {

    },
    created () {
    },
    watch: {
    },
    methods: {
      
    }
  }
</script>

