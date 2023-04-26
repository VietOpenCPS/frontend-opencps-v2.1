<template>
  <v-card
    class="mx-auto pa-3"
    outlined
    flat
  >
      <div style="position: relative;max-width: 1200px;">
				<v-btn color="primary" class="btn-form mx-0 text-white" @click="goBack()" style="position: absolute; right: 15px; top: 55px">
					<v-icon size="18">reply</v-icon> &nbsp; Quay lại
				</v-btn>
        <iframe :src="urlRedirect1022" title="Gửi phản ánh kiến nghị Tỉnh Đồng Tháp" frameBorder="0" width="1200" height="1200"></iframe>
      </div>
  </v-card>
</template>

<script>
  export default {
    name: 'GuiPhanAnhKienNghi',
    components: {},
    data: () => ({
      loadingData: false,
			urlRedirect1022: ''
    }),
    created () {
      let vm = this
			try {
        vm.urlRedirect1022 = urlRedirect1022
      } catch (error) {
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      goBack () {
        window.history.back()
      }
    }
  }
</script>

<style lang="sass">
</style>
