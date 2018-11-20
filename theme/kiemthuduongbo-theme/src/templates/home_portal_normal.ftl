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

<body class="${css_class} home-theme">

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
	<header id="banner">
		<a href="${site_default_url}" class="mLogo">
			<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png"/>
			<span>${site_name}</span>
		</a>
		<#if has_navigation && is_setup_complete>
			<#include "${full_templates_path}/navigation.ftl" />
		</#if>
		<div class="group-actions">
			<a href="/login" class="btn-login">Đăng nhập</a>
			<a href="/register" class="btn-dregister">Đăng ký</a>
		</div>
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

	<footer id="footer">
		<p>Trung tâm Công nghệ thông tin - Bộ Giao thông Vận tải</p>
		<p>Địa chỉ: 80 Trần Hưng Đạo, Hoàn kiếm, Hà Nội</p>
		<p>Hotline: 1900 0318 - Điện thoại: (04) 3822 2979 - Fax: 38221066 - Email: bophanhotro@mt.gov.vn</p>
		<a target="_blank" href="https://www.facebook.com/groups/1207489822675506/" style="color: #fff;font-size: 12px;"><img style="width: 20px;vertical-align: sub;border: 1px solid lightblue;margin-left: -15px;margin-right: 1px;" src="https://dichvucong.mt.gov.vn/opencps-ux-theme/images/custom/fb_opencps.png" alt="opencps"> Hỗ trợ người dùng Cổng DVC Bộ GTVT</a>
		<p>Bản quyền thuộc về Bộ Giao thông vận tải </p>
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

</html>