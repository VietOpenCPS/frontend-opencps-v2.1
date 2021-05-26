# frontend-opencps

Hướng dẫn build + deploy Front-end OpenCPS.
-	Front-end OpenCps:
    + JavaScript Framework: VueJS v2.x (https://vuejs.org/)
    + JavaScript UI: Vuetifyjs v1.5.x (https://vuetifyjs.com/en/)
    + Tooling for Vue.js Development: Vue CLI (https://cli.vuejs.org/)
    (Nên sử dụng IDE Visual Studio Code để phát triển)
-	Mỗi giao diện nghiệp vụ (Liferay portlet) tương ứng 1 module front-end độc lập.
-	Cài đặt:
    +  NodeJs  https://nodejs.org/download/release/v10.15.3/
1.	Clone source code:  https://github.com/VietOpenCPS/frontend-opencps-v2.1
2.	Install package, plugin sử dụng cho từng module:
    + npm install
3.	Build compile *.js:
    + npm run build
- ex:
    + cd ./asked_questions
    + npm install
    + npm run build
- Thư mục lưu *.js: /wars/opencps-store

4.	Build *.war:
    + cd /wars/opencps-store
    + npm i gradle (cài đặt gradle khi chạy lần đầu)
    + gradle build
- Thư mục lưu *.war:  wars/opencps-store/build/libs

