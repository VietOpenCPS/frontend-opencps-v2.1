<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>${the_title} - ${company_name}</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<base href="/">

	<link href="${themeDisplay.getPathThemeRoot()}/images/favicon.ico" rel="Shortcut Icon">

	<@liferay_util["include"] page=top_head_include />

	<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;subset=vietnamese" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<link href="${themeDisplay.getPathThemeRoot()}/css/main.css?t=889122122" rel="stylesheet" type="text/css">

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

<div class="container-fluid" id="">
	<header id="banner" class="row">
		<div class="container-fluid align-middle-lg">
			<div class="mLogo">
				<a href="${site_default_url}" class="align-middle">
					<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png"/>
					<span>${site_name}</span>
				</a>
			</div>
			<@liferay_portlet["runtime"] portletName="npmreactlogin"/>
		</div>

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
</div>

<!-- inject:js -->
	<script type="text/javascript" src="${themeDisplay.getPathThemeRoot()}/js/bundle.js?t=65722572255"></script>
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
	</style>
</html>