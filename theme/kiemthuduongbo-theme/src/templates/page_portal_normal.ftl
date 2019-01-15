<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>Hệ thống dịch vụ công trực tuyến</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<base href="/">

	<link href="${themeDisplay.getPathThemeRoot()}/images/favicon.ico" rel="Shortcut Icon">

	<@liferay_util["include"] page=top_head_include />

	<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;subset=vietnamese" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet">

	<link href="${themeDisplay.getPathThemeRoot()}/css/main.css?t=546564564" rel="stylesheet" type="text/css">

	<script>
        window.__define = window.define;
        window.__require = window.require;
        window.define = undefined;
        window.require = undefined;
    </script>
    
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/handlebars.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/alpaca.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment-with-locales.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap-datetimepicker.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery-comments.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.textcomplete.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/svg-pan-zoom.min.js"></script>
	
	<script>
        window.define = window.__define;
        window.require = window.__require;
        window.__define = undefined;
        window.__require = undefined;
    </script>
</head>

<body class="${css_class} page-theme">

<!-- <@liferay_ui["quick-access"] contentId="#main-content" /> -->

<#if permissionChecker.isOmniadmin()>
	<@liferay_util["include"] page=body_top_include />
	<@liferay.control_menu />
<#else>
	<style>
		html .has-control-menu #wrapper {
			margin-top: 0 !important;
		}
		html body.open #wrapper {
			padding-left: 0 !important;
		}
	</style>
</#if>

<div class="container-fluid" id="wrapper" style="    overflow: hidden;">
	<header id="banner" class="row">
		<div class="logo align-middle" style="
    width: 100%;    max-width: 1300px;
    margin: 0 auto;
"> 
			<a href="${site_default_url}"> 
				<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png"> 
				<div class="text-logo" style="
    padding-left: 65px;
"> 
					<p style="
    font-size: 18px;
    display: block;
    white-space: nowrap;
    font-weight: bold;
    line-height: 27px;
    margin-bottom: 0;
">BỘ GIAO THÔNG VẬN TẢI
	<br/>
	<span style="
		font-weight: normal;
		font-size: 16px;
	">HỆ THỐNG DỊCH VỤ CÔNG TRỰC TUYẾN</span>
 </p>
				</div> 
			</a> 
		</div>
		<div id="react-root" style="float: right;width: 100%;"></div>

		<#if has_navigation && is_setup_complete>
			<#include "${full_templates_path}/navigation.ftl" />
		</#if>
	</header>

	<section id="content">
		<#if selectable>
			<@liferay_util["include"] page=content_include />
		<#else>
			${portletDisplay.recycle()}

			${portletDisplay.setTitle(the_title)}

			<@liferay_theme["wrap-portlet"] page="portlet.ftl">
				<@liferay_util["include"] page=content_include />
			</@>
		</#if>
	</section>
	
</div>

	<footer id="footer" >
		<p class="site-name">Trung tâm Công nghệ thông tin<br>Bộ Giao thông Vận tải</p>
		<p class="info" style="
    background-color: transparent !important;
">
			<span>Địa chỉ: 80 Trần Hưng Đạo, Hoàn kiếm, Hà Nội</span>
			<span>Hotline: 1900 0318</span>
			<span>Điện thoại: (04) 3822 2979</span>
			<span>Fax: 38221066</span>
			<span>Email: bophanhotro@mt.gov.vn</span>
		</p>
	</footer>
<!-- inject:js -->
	<script type="text/javascript" src="${themeDisplay.getPathThemeRoot()}/js/bundle.js?t=111212313"></script>
	<#if permissionChecker.isOmniadmin()>
		<@liferay_util["include"] page=body_bottom_include />
		<@liferay_util["include"] page=bottom_include />
	</#if>
<!-- endinject -->

</body>
	<style>
		.page-theme #navigation {
			overflow: hidden;
			margin-bottom: 10px;
		}
		#portlet_npmreactlogin {
			    position: absolute;
				right: 15px;
				top: 25px;
		}
		#navigation ul.child-menu {
			display: none;
		}
		#wrapper {
			padding-top: 0 !important;
		}

body #react-root > div > div {
    width: auto !important;
    float: right;
}
.hidden__temp {
		opacity: 0;
	}
	#react-root .navigation-drawer--right>.navigation-drawer__border {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		background-image: url(http://hanhchinhcong.phutho.gov.vn/o/parent-opencps-vue/images/bg-home.jpg);
		background-size: cover;
		-webkit-filter: blur(200px);
		z-index: -1;
		filter: blur(200px);
	}
	#react-root .navigation-drawer .list {
		background: transparent;
	}
	#react-root .navigation-drawer>.list .list__tile:hover {
		background: transparent !important;
	}
	#react-root .btn-toggle--selected {
		box-shadow: none !important;
	}
	#react-root .theme--light .v-divider {
		border-color: #eee;
	}
	#react-root .theme--light .v-list__tile__content {
		height: 30px;
	}
	#react-root .navigation-drawer>.list .list__tile {
			height: 42px;
			padding: 0 16px !important;
	}
	#react-root .theme--light .btn-toggle {
			width: 100%;
		background: #fff;
		border-radius: 4px;
		height: 20px;
	}
	#react-root .theme--light .btn-toggle .btn {
			height: 20px;
			opacity: 1;
		font-size: 10px;
	}
	#react-root .theme--light .v-list__tile__title {
			font-size: 24px;
		padding-left: 10px;
		color: #383838;
	}
	#react-root .theme--light .btn--small {
		height: 18px !important;
		width: 18px !important;
	}
	body #react-root  .v-navigation-drawer--is-mobile:not(.v-navigation-drawer--close), 
	body #react-root .v-navigation-drawer--temporary:not(.v-navigation-drawer--close) {
		-webkit-box-shadow: 0 1px 3px -1px rgba(0,0,0,.2), 1px 1px 5px -5px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
		box-shadow: 0 1px 3px -1px rgba(0,0,0,.2), 1px 1px 5px -5px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
	}
	#react-root .overlay--absolute {
		opacity: 0;
	}
	
	.login-wrapper {
		float: right;
	}
	.forgetten-password-input {
		width: 100%;
		line-height: 31px;
		font-size: 13px;
		padding-left: 10px;
		text-decoration: underline;
		color: #fff;
	}
	.action-btn-login-input {
		width: 100%;
		text-align: right;
	}
	.login-wrapper .login-input {
		display: -webkit-box;
		display: flex;
	}
	.login-wrapper .login-input .ico {
		position: relative;
		margin-left: 10px;
	}
	.login-wrapper .login-input .ico:first-child {
		margin-left: 0;
	}
	.login-wrapper .login-input .ico:before {
		content: "";
		font-family: FontAwesome;
		position: absolute;
		color: #005792;
		width: 30px;
		height: 100%;
		display: -webkit-box;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
	}
	.login-wrapper .login-input .ico-user:before {
		content: "\f007";
	}
	.login-wrapper .login-input .ico-pass:before {
		content: "\f023";
	}
	.login-wrapper .login-input .ico:after {
		content: "";
		position: absolute;
		top: 20%;
		left: 30px;
		width: 1px;
		height: 60%;
		background-color: #005792;
	}
	.login-wrapper .login-input input {
		height: 26px;
		width: 200px;
		border: 1px solid #005792;
		border-radius: 30px;
		padding-left: 35px;
		font-size: 12px;
		background: #fff;
	}
	.login-wrapper .login-input input:focus {
		outline: none;
	}
	.login-wrapper .btn-action {
		text-align: right;
	}
	.login-wrapper button {
		margin: 5px 0 0 5px;
		height: 26px;
		line-height: 26px;
		padding: 0 12px;
		color: white;
		-webkit-box-shadow: none;
		box-shadow: none;
		border: 0;
		border-radius: 30px;
		background-color: #005792;
		font-size: 12px;
		font-weight: bold;
		will-change: box-shadow;
		box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
	}
	.login-wrapper .btn-register {
		background-color: #fdb44b;
	}
	.login-wrapper button:hover {
		background-color: #00204a;
		cursor: pointer;
	}
	.login-wrapper .btn-register:hover {
		background-color: #0072bc;
		cursor: pointer;
	}
	#react-root .application--wrap {
		min-height: unset;
	}
	#react-root .application.theme--light {
		background: transparent !important;
		width: 100%;
	}
	#react-root .application--wrap {
		border-top: none !important;
	}
	#react-root .login-wrapper input {
		background-color: #fff;
	}
	#react-root .navigation-drawer{
		height: 100vh !important;
		z-index: 11;
	}
	#react-root .badge__badge {
		font-size: 10px;
		border-radius: 4px;
		height: 16px;
		width: auto;
		padding: 0 4px;
		right: -6px;
		top: -2px;
		min-width: 18px;
		z-index: 10;
	}
	#react-root {
		min-width: 300px;
		width: 100%;
		position: absolute;
		top: 15px;
		right: 15px;
	}
	body #banner__content {
		padding: 0!important;
		height: 66px !important;
	}
	#banner #banner__content .logo {
		position: absolute;
	}
	body #banner .navigation-drawer--fixed {
		position: fixed !important;
	}
	#react-root .btn-toggle .btn__content {
		text-transform: none;
		background: #929292;
		color: #fff;
		font-size: 10px !important;
	}
	#react-root span {
		font-size: 13px;
	}
	#react-root .btn-toggle .btn--active .btn__content {
		background: #fff;
		color: inherit;
	}
	#react-root .btn-toggle .btn--active .btn__content::before {
		opacity: 0;
	}
	#react-root .theme--light.chip,
	#react-root .theme--light .chip {
		background: transparent !important;
	}
	#react-root .menu__content {
		margin-top: 0;
	}
	#react-root .menu__content .list {
		margin-bottom: 0;
		padding: 0;
	}
	#react-root .menu__content .list>div > .list__tile {
		height: 32px;
		font-size: 13px;
		cursor: pointer;
	}
	#react-root .menu__content .list>div:hover {
		background-color: #eee !important;
	}
	#react-root .menu__content .list>div {
		border-bottom: 1px dashed #ddd;
		display: block;
		padding: 0;
		font-size: 13px;
		height: auto;
		color: rgba(0,0,0,.87);
		position: relative;
	}
	#react-root .chip .avatar {
		margin-right: 2px;
	}
	#react-root .chip .avatar img {
		width: 24px;
		height: 24px;
		margin-right: 0px !important;
	}
	#react-root .list__tile__action {
		min-width: 25px;
	}
	.page-theme #banner img {
		margin-right: unset;
		float: left;
	}
	.user-profile-menu-react > div[class*='MuiPopover-paper'] {
		top: 5px !important;
		right: 0 !important;
		left: unset !important;
		position: absolute !important;
	}
	.user-profile-menu-react > div > ul > li {
		border-bottom: 1px dashed #adabab !important;
		padding: 5px 10px !important;
		font-size: 13px !important;
	}
	.user-profile-menu-react > div > ul {
		padding: 0 !important;
	}
	body .page-theme #navigation {
		border-top: 1px solid #ebebeb !important;
	}
	.v-window__container--is-active {
		height: auto !important;
	}
	</style>

	<script type="text/javascript">
	    $.ajaxSetup({
			headers: {"Token": Liferay.authToken},
			global: true
		});
	</script>
	
</html>