<template>
  <v-layout row wrap>
    <v-flex xs12 class="control-section file-preview py-0">
      <div class="control_wrapper">
        <div class="camera-box">
          <div v-show="isCameraSelect">
            <canvas
              v-show="isPhotoTaken"
              ref="canvasDup"
              id="canvasDup"
              style="width: 100%"
              :height="300"
            ></canvas>
          </div>
          <div v-show="!isCameraSelect">
            <ejs-uploader
              id="imageSelfiePreview"
              name="UploadFiles"
              :allowedExtensions="extensions"
              ref="uploadObj"
              :uploading="addHeaders"
              :selected="onFrontFileSelect"
              :multiple="false"
            >
            </ejs-uploader>
            <img id="upload-selfie-image" />
          </div>
        </div>
      </div>
    </v-flex>
    <v-layout align-center justify-center class="mt-3">
      <v-btn
        color="info"
        class="mt-2"
        @click="handleSelectCamera"
      >
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
          <div v-show="isCameraSelect">
            <video
              v-show="!isPhotoTaken"
              ref="camera"
              id="video"
              :width="680"
              :height="510"
              autoplay
            ></video>
            <canvas
              v-show="isPhotoTaken"
              id="selfiePhotoTaken"
              ref="canvas"
              :width="680"
              :height="510"
            ></canvas>
            <div class="camera-shot" v-show="isCameraSelect">
              <v-btn fab class="btn-50px" @click="takePhoto" v-show="!isPhotoTaken">
                <v-icon>camera_alt</v-icon>
              </v-btn>
              <v-btn fab class="btn-50px" @click="takePhoto" v-show="isPhotoTaken">
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
      isCameraSelect: false,
      isPhotoTaken: false,
      isShowDialog: false,
    };
  },
  watch: {},
  methods: {
    addHeaders(args) {
      let vm = this;
      args.currentRequest.setRequestHeader("Token", vm.getAuthToken());
      args.currentRequest.setRequestHeader("groupId", vm.getScopeGroupId());
    },
    uploadImage() {
      document
        .getElementsByClassName("e-file-select-wrap")[2]
        .querySelector("button")
        .click();
      this.isCameraSelect = false;
    },
    onFrontFileSelect: function (args) {
      let vm = this;
      args.cancel = true;
      vm.readSelfieFileURL(args["filesData"][0]);
      let newFile = args["filesData"][0];
      if (
        String(newFile.name).indexOf("<") >= 0 ||
        String(newFile.name).indexOf(">") >= 0
      ) {
        toastr.error(
          "Ảnh tải lên không hợp lệ. Vui lòng kiểm tra định dạng ảnh, tên ảnh."
        );
        return;
      } else {
        vm.$refs.uploadObj.upload(newFile, true);
      }
    },
    readSelfieFileURL: function (args) {
      let preview = document.getElementById("upload-selfie-image");
      let file = args.rawFile;
      let reader = new FileReader();
      let vm = this;
      reader.addEventListener(
        "load",
        function () {
          preview.src = reader.result;
          vm.image_selfie = reader.result;
          let data = {
            live_image: vm.image_selfie.replace(
              /data:image\/(png|jpeg|jpg);base64,/,
              ""
            ),
            front_image: vm.userData["front_image"],
          };
          vm.$store.dispatch("postSelfieImage", data).then(function (result) {
            let response = result.data;
            response["live_image"] = data.live_image;
            if (response.code == "1") {
              vm.$emit("loadSelfieData", response);
              toastr.clear();
              toastr.success("Xác thực khuôn mặt thành công");
            } else {
              vm.$emit("clearSelfieData");
              toastr.clear();
              toastr.error(response.message);
            }
          });
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    handleSelectCamera() {
      this.isCameraSelect = true
      this.isPhotoTaken = false
      this.openCamera()
    },
    openCamera() {
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
    takePhoto() {
      let vm = this;
      vm.isPhotoTaken = !vm.isPhotoTaken;
      if (vm.isPhotoTaken) {
        vm.shotCamera();
      } else {
        vm.openCamera();
        vm.isPhotoTaken = false;
        vm.isCameraSelect = true;
      }
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
    shotCamera() {
      let vm = this;
      const context = vm.$refs.canvas.getContext("2d");
      context.drawImage(vm.$refs.camera, 0, 0, 680, 510);

      let canvasDup = document.getElementById("canvasDup");
      const contextDup = vm.$refs.canvasDup.getContext("2d");
      contextDup.drawImage(vm.$refs.camera, 0, 0, canvasDup.width, 300);
      vm.closeCamera()

      const live_image = document
        .getElementById("selfiePhotoTaken")
        .toDataURL("image/jpeg")
        .replace("data:image/jpeg;base64,", "");
      let data = {
        live_image: live_image,
        front_image: vm.userData["front_image"],
      };
      vm.$emit("changeLoading");
      vm.$store.dispatch("postSelfieImage", data).then(function (result) {
        let response = result.data;
        response["live_image"] = data.live_image;
        if (response.code == "1") {
          vm.$emit("loadSelfieData", response);
          let saveData = {
            ekycId: response.user_id,
            name: vm.userData["name"],
            id: vm.userData["id"],
            birthday: vm.userData["birthday"],
            address: vm.userData["address"],
            wardCode: vm.userData["wardCode"],
            wardName: vm.userData["wardName"],
            districtCode: vm.userData["districtCode"],
            districtName: vm.userData["districtName"],
            cityCode: vm.userData["cityCode"],
            cityName: vm.userData["cityName"],
            issue_by: vm.userData["issue_by"],
            issue_date: vm.userData["issue_date"]
          }
          vm.$store.dispatch("saveEkycApplicant", saveData).then(function (result) {
            let response = result.data
            vm.$emit("updateUserInfomation", response)
            if (response.code == "1") {
              setTimeout(function() {
                vm.isShowDialog = false
              }, 1000)
              toastr.clear();
              toastr.success("Xác thực khuôn mặt thành công. Hoàn thành định danh thông tin.");
            } else {
              toastr.clear();
              toastr.error(response.message);
            }
          })
        } else {
          vm.$emit("clearSelfieData");
          toastr.clear();
          toastr.error(response.message);
        }
      });
    },
    deleteImageWhenClosePopup () {
      this.isPhotoTaken = false
    }
  },
};
</script>
