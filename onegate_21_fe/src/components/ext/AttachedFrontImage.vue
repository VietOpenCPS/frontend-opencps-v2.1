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
          <div v-show="showPreviewImage">
            <ejs-uploader
              id="imageFrontPreview"
              name="UploadFiles"
              :allowedExtensions="extensions"
              ref="uploadObj"
              :uploading="addHeaders"
              :selected="onFrontFileSelect"
              :multiple="false"
            >
            </ejs-uploader>
            <img id="upload-front-image" />
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
      <v-spacer></v-spacer>
      <v-btn color="warning" class="mt-2" @click="uploadImage">
        <v-icon>upload</v-icon>
        <span class="px-2">Upload ảnh</span>
      </v-btn>
    </v-layout>
    <v-dialog v-model="isShowDialog" persistent max-width="680">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Chụp ảnh mặt trước</v-toolbar-title>
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
              id="frontPhotoTaken"
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
  data() {
    return {
      extensions: ".jpg, .png",
      image_front: "",
      isCameraSelect: false,
      isPhotoTaken: false,
      isShowDialog: false,
      showPreviewImage: false
    };
  },
  watch: {},
  methods: {
    uploadImage() {
      document.getElementById('imageFrontPreview').value = ''
      document
        .getElementsByClassName("e-file-select-wrap")[0]
        .querySelector("button")
        .click();
      this.isCameraSelect = false;
    },
    addHeaders(args) {
      let vm = this;
      args.currentRequest.setRequestHeader("Token", vm.getAuthToken());
      args.currentRequest.setRequestHeader("groupId", vm.getScopeGroupId());
    },
    onFrontFileSelect: function (args) {
      let vm = this;
      args.cancel = true;
      let newFile = args["filesData"][0];
      let extensions = ['png', 'jpg']
      if (
        String(newFile.name).indexOf("<") >= 0 ||
        String(newFile.name).indexOf(">") >= 0 ||
        !extensions.includes(String(newFile.name).split('.').pop())
      ) {
        toastr.clear()
        toastr.error(
          "Ảnh tải lên không hợp lệ. Vui lòng kiểm tra định dạng ảnh, tên ảnh."
        );
        return;
      } else {
        vm.readFrontFileURL(args["filesData"][0]);
        vm.$refs.uploadObj.upload(newFile, true);
      }
    },
    readFrontFileURL: function (args) {
      let preview = document.getElementById("upload-front-image");
      let file = args.rawFile;
      let reader = new FileReader();
      let vm = this;
      reader.addEventListener(
        "load",
        function () {
          preview.src = reader.result;
          vm.showPreviewImage = true
          vm.image_front = reader.result;
          let data = {
            image_front: vm.image_front.replace(
              /data:image\/(png|jpeg|jpg);base64,/,
              ""
            ),
          };
          vm.$emit("changeLoading");
          vm.$store.dispatch("postFrontID", data).then(function (result) {
            let response = result.data;
            response["front_image"] = data.image_front;
            if (response.code == "1" && vm.checkEnoughInformation(response.information)) {
              vm.$emit("loadFrontData", response);
              setTimeout(function() {
                vm.isShowDialog = false
              }, 1000)
              toastr.clear();
              toastr.success("Tải ảnh mặt trước thành công");
            } else if (response.code == "1") {
              vm.$emit("clearFrontData");
              toastr.clear();
              toastr.error("Ảnh tải lên không phải là ảnh mặt trước");
            } else {
              vm.$emit("clearFrontData");
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
      this.showPreviewImage = false
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
      this.isShowDialog = true
          alert("Trình duyệt không hỗ trợ hoặc thiết bị không có camera.");
        });
    },
    takePhoto() {
      let vm = this
      vm.isPhotoTaken = !vm.isPhotoTaken;
      if (vm.isPhotoTaken) {
        vm.shotCamera()
      } else {
        vm.handleSelectCamera()
      }
    },
    closeCamera() {
      let vm = this
      let tracks = vm.$refs.camera.srcObject.getTracks();

      tracks.forEach(track => {
        track.stop();
      });
    },
    closeDialog() {
      this.isShowDialog = false;
      this.closeCamera()
    },
    shotCamera() {
      let vm = this
      const context = vm.$refs.canvas.getContext("2d");
      context.drawImage(vm.$refs.camera, 0, 0, 680, 510);

      let canvasDup = document.getElementById("canvasDup");
      const contextDup = vm.$refs.canvasDup.getContext("2d");
      contextDup.drawImage(vm.$refs.camera, 0, 0, canvasDup.width, 300);
      vm.closeCamera()

      const front_image = document.getElementById("frontPhotoTaken").toDataURL("image/jpeg")
        .replace( "data:image/jpeg;base64,", "")
      let data = {
        image_front: front_image,
      };
      vm.$emit("changeLoading");
      vm.$store.dispatch("postFrontID", data).then(function (result) {
        let response = result.data;
        response["front_image"] = data.image_front;
        let flag = vm.checkEnoughInformation(response.information);
        if (response.code == "1" && flag) {
          vm.$emit("loadFrontData", response);
          setTimeout(function() {
            vm.isShowDialog = false
          }, 1000)
          toastr.clear();
          toastr.clear();
          toastr.success("Tải ảnh mặt trước thành công");
        } else if (response.code == "1") {
          vm.$emit("clearFrontData");
          toastr.clear();
          toastr.error("Ảnh tải lên không phải là ảnh mặt trước");
        } else {
          vm.$emit("clearFrontData");
          toastr.clear();
          toastr.error(response.message);
        }
      });
    },
    checkEnoughInformation(info) {
      if (info.name == "" || info.id == "" || info.address == "" || info.birthday == "") return false;
      return true
    },
    deleteImageWhenClosePopup () {
      this.showPreviewImage = false
      this.isPhotoTaken = false
    }
  },
};
</script>
