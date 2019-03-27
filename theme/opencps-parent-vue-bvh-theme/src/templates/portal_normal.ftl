<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>Hệ thống Dịch vụ công trực tuyến</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<base href="/">
	
	<link href="${themeDisplay.getPathThemeRoot()}/images/favicon.ico" rel="Shortcut Icon">
	
	<@liferay_util["include"] page=top_head_include />
	
	<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	
	<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css" rel="stylesheet">
	
	<link href="${themeDisplay.getPathThemeRoot()}/css/main.css?t=123122111991223" rel="stylesheet" type="text/css">

	<link type="text/css" href="${themeDisplay.getPathThemeRoot()}/css/chunk-vendors.css?t=211232123214" rel="stylesheet">
	<link type="text/css" href="${themeDisplay.getPathThemeRoot()}/css/upgrade.css?t=21212318823211312312334" rel="stylesheet">
	
	<#if permissionChecker.isOmniadmin()>
		<link href="${themeDisplay.getPathThemeRoot()}/css/clay_overide.css?t=123122111299123" rel="stylesheet" type="text/css">
	</#if>

	<script>
        window.__define = window.define;
        window.__require = window.require;
        window.define = undefined;
        window.require = undefined;
    </script>
    
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.min.js?t=123"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/handlebars.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/alpaca.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment-with-locales.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap-datetimepicker.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery-comments.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.textcomplete.js"></script>
	
	<script src="${themeDisplay.getPathThemeRoot()}/js/slick.min.js"></script>

	<script>
        window.define = window.__define;
        window.require = window.__require;
        window.__define = undefined;
        window.__require = undefined;
    </script>

</head>

<body class="${css_class}">

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

<div class="" id="wrapper" style="
    overflow: hidden;
">
	<header id="banner">		
		<div class="container align-middle hide-title">
			<div class="logo align-middle">
				<a href="${site_default_url}">
					<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png">
					<div class="text-logo">
						<span>Bộ văn HÓA, thể thao và du lịch</span>
						Cổng dịch vụ công trực tuyến
					</div>
				</a>
			</div>
			
			<div id="react-root" style="float: right;width: 100%;height: 71px;">
				<div id="app_login"></div>
			</div>

		</div>
	</header>
		
	<#if has_navigation && is_setup_complete>
		<#include "${full_templates_path}/navigation.ftl" />
	</#if>

	<@liferay_util["include"] page=content_include />

</div>

	<footer id="footer">
	    <div class="container first align-middle-lg">
	        <div>
	            <div class="site-name">
	            	Cổng dịch vụ công trực tuyến
	            	<span>${sitename}</span>
	            </div>
	        </div>
	        <div class="contact">
	            <p>Địa chỉ cơ quan: <b>${address}</b></p>
	            <p>Điện thoại: <b>${phone}</b></p>
	            <p>Email: <b>${email}</b></p>
	        </div>
	    </div>
	    <div class="text-center last">Phát triển bởi Tập đoàn Công nghệ <a href="https://www.cmc.com.vn/vi" target="_blank"> CMC </a>
						trên nền <a href="https://opencps.vn" target="_blank"> OpenCPS </a></div>
	</footer>

<!-- inject:js -->
	<script type="text/javascript" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend-cli/login/app/js/app.js"></script>
	<script type="text/javascript" src="https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend-cli/login/app/js/chunk-vendors.js"></script>
	<#if permissionChecker.isOmniadmin()>
		<@liferay_util["include"] page=body_bottom_include />
		<@liferay_util["include"] page=bottom_include />
	</#if>

<!-- endinject -->

<script type="text/javascript">
    $.ajaxSetup({
		headers: {"Token": Liferay.authToken},
		global: true
	});
</script>

<style>

body .v-dialog .v-toolbar .v-toolbar__content {
    height: 40px !important;
    background-color: #004983;
}
body .primary {
    background-color: #004983 !important;
    border-color: #004983 !important;
}
body .accent--text {
    color: #004983 !important;
    caret-color: #004983 !important;
}

#app_register .radio_register_type .v-label {
    margin-bottom: 0;
}

#app_register .layout > .flex.xs12 > .layout.row.wrap { 
    margin: 0;
}

body #app_login .v-badge .v-icon {
    color: #ffffff !important;
}

#app_login .login-wrapper .login-input a {
    color: #ffffff !important;
}

</style>

</body>

</html>