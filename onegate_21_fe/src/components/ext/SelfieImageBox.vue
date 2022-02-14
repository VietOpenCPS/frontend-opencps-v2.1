<template>
  <v-layout row wrap>
    <div class="camera-selfie-box">
      <div>
        <canvas
          v-show="hasPhoto"
          ref="canvasDup"
          id="canvasDup"
          :width="240"
          :height="180"
        ></canvas>
      </div>
    </div>

    <v-layout wrap align-center class="mx-5">
      <v-btn color="primary" class="mx-2" @click="openCamera">
        <v-icon>camera_alt</v-icon>
        <span class="px-2">Chụp ảnh</span>
      </v-btn>
    </v-layout>

    <v-dialog v-model="isShowDialog" persistent max-width="680">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Chụp ảnh khuôn mặt</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <div class="camera-box--big">
          <div>
            <video
              v-show="!hasPhoto"
              ref="camera"
              id="video"
              :width="680"
              :height="510"
              autoplay
            ></video>
            <canvas
              v-show="hasPhoto"
              id="selfiePhotoTaken"
              ref="canvas"
              :width="680"
              :height="510"
            ></canvas>
            <div class="camera-shot">
              <v-btn fab class="btn-50px" @click="takePhoto" v-show="!hasPhoto">
                <v-icon>camera_alt</v-icon>
              </v-btn>
              <v-btn fab class="btn-50px" @click="openCamera" v-show="hasPhoto">
                <v-icon>replay</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Vue from "vue";
import toastr from "toastr";
Vue.use(toastr);
toastr.options = {
  closeButton: true,
  timeOut: "3000",
};
import { UploaderPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(UploaderPlugin);

export default {
  props: ["userData"],
  data() {
    return {
      extensions: ".jpg, .png",
      image_selfie: "",
      hasPhoto: false,
      isShowDialog: false
    };
  },
  watch: {},
  methods: {
    addHeaders(args) {
      let vm = this;
      args.currentRequest.setRequestHeader("Token", vm.getAuthToken());
      args.currentRequest.setRequestHeader("groupId", vm.getScopeGroupId());
    },
    openCamera() {
      this.hasPhoto = false
      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isShowDialog = true
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          alert("Trình duyệt không hỗ trợ hoặc thiết bị không có camera.");
        });
    },
    closeCamera() {
      let vm = this;
      let tracks = vm.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },
    closeDialog() {
      this.isShowDialog = false;
      this.closeCamera()
    },
    takePhoto() {
      let vm = this;
      this.image_selfie = ''
      const context = vm.$refs.canvas.getContext("2d");
      context.drawImage(vm.$refs.camera, 0, 0, 680, 510);

      let canvasDup = document.getElementById("canvasDup");
      const contextDup = vm.$refs.canvasDup.getContext("2d");
      contextDup.drawImage(vm.$refs.camera, 0, 0, canvasDup.width, canvasDup.height);

      this.hasPhoto = true
      vm.closeCamera()

      vm.image_selfie = document
        .getElementById("selfiePhotoTaken")
        .toDataURL("image/jpeg")
        .replace("data:image/jpeg;base64,", "");

      let data = {
        image_live: vm.image_selfie
      }

      vm.$store.dispatch("getApplicantIdNoByImage", data).then(function (result) {
        let response = result.data;
        if (response.code == "1") {
          vm.$emit('filterByApplicantIdNo', response.applicantIdNo)
          setTimeout(function() {
            vm.isShowDialog = false
          }, 1000)
          toastr.clear();
          toastr.success('Tra cứu thành công');
        } else {
          toastr.clear();
          toastr.error(response.message);
        }
      })
    },
    deleteImage() {
      let canvasDup = document.getElementById("canvasDup");
      const contextDup = canvasDup.getContext("2d");
      contextDup.clearRect(0, 0, canvasDup.width, canvasDup.height)
    }
  },
};
</script>
