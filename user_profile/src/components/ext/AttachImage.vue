<template>
    <div>
        <div class="avatar-wrapper" style="position: relative;height: 250px;width: 250px;overflow: hidden;transition: all .3s ease; cursor: pointer;">
            <img class="profile-pic" :src="dataImage"  style="height: 100%;width: 100%;transition: all .3s ease;"/>
            <div @click="onPickFile" class="upload-button" style="position: absolute;top: 0; left: 0;height: 100%;width: 100%;">
                <i class="fa fa-arrow-circle-up" aria-hidden="true" style="position: absolute;font-size: 234px;top: -17px;left: 0;text-align: center;opacity: 0;transition: all .3s ease;color: #34495e;"></i>
            </div>
            <input @change="onFilePicked" type="file" accept="image/*" style="display: none" ref="refFile"/>
        </div>
    </div>
</template>
<script>
export default {
    props: ['dataImage'],
    data () {
        return {

        }
    },
    methods: {
        onPickFile () {
            this.$refs.refFile.click()
        },
        onFilePicked (e) {
            var files = e.target.files || e.dataTransfer.files
            if (!files.length)
                return;
            if((files[0].size / 1024 / 1024).toFixed(2) > 10){
                alert("Tệp quá lớn. Vui lòng chọn tệp kích thước hơn 10MB"); 
            } else {
                this.$emit('changeImage', {
                    file: files[0]
                })
                this.createImage(files[0]);
            }
        },
        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.dataImage = e.target.result;
            };
            reader.readAsDataURL(file);
        },
    }
}
</script>