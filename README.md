# frontend-opencps

Hướng dẫn build + deploy Front-end OpenCPS.
-	Cài đặt:
    +  nodejs  https://nodejs.org/download/release/v10.15.3/

-	Phần front-end sử dụng:
    + JavaScript Framework: VueJS v2.x (https://vuejs.org/)
    + JavaScript UI: Vuetifyjs v1.5.x (https://vuetifyjs.com/en/)
    + Tooling for Vue.js Development: Vue CLI (https://cli.vuejs.org/)
    (Nên sử dụng IDE Visual Studio Code để phát triển)
-	Mỗi giao diện nghiệp vụ (Liferay portlet) tương ứng với 1 module front-end độc lập.

1.	Clone source code trên github tại địa chỉ:  https://github.com/VietOpenCPS/frontend-opencps-v2.1
    Nhánh đang phát triển https://github.com/VietOpenCPS/frontend-opencps-v2.1/tree/bgt
2.	Install các package, plugin sử dụng với từng module:
    + npm install
3.	Build compile file *.js:
    + npm run build
	- example:
        + cd ./asked_questions
        + npm install
        + npm run build
    - Thư mục lưu các file *.js cấu hình trong file vue.config.js

4.	Build file deploy *.war:
    + cd /wars/opencps-store
    + npm i gradle (cài đặt gradle khi chạy lần đầu)
    + gradle build
	- Thư mục chứa file *.war:  wars/opencps-store/build/libs

