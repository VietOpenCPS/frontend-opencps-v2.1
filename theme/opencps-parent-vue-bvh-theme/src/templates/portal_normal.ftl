<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>${the_title} - ${company_name}</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />

	<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<#if permissionChecker.isOmniadmin()>
	
		<@liferay_util["include"] page=top_head_include />
	
	</#if>
	
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

<div class="" id="wrapper">
	<header id="banner">		
		<div class="container align-middle hide-title">
			<div class="logo align-middle">
				<a href="${site_default_url}">
					<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png">
					<div class="text-logo">
						Cổng dịch vụ công trực tuyến
						<span>${site_name}</span>
					</div>
				</a>
			</div>
			<@liferay_portlet["runtime"] portletName="npmreactlogin"/>
		</div>
	</header>
		
	<#if has_navigation && is_setup_complete>
		<#include "${full_templates_path}/navigation.ftl" />
	</#if>

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
	    <div class="container first align-middle-lg">
	        <div>
	            <div class="site-name">
	            	Cổng dịch vụ công trực tuyến
	            	<span>${sitename}</span>
	            </div>
	            <div>Chịu trách nhiệm chính: ${main_responsibility}</div>
	        </div>
	        <div class="contact">
	            <p>Địa chỉ: <b>${address}</b></p>
	            <p>Điện thoại: <b>${phone}</b></p>
	            <p>Email: <b>${email}</b></p>
	        </div>
	    </div>
	    <div class="text-center last">${copyright}</div>
	</footer>
</div>

<#if permissionChecker.isOmniadmin()>

	<@liferay_util["include"] page=body_bottom_include />

	<@liferay_util["include"] page=bottom_include />
	
</#if>

<!-- inject:js -->
<!-- endinject -->

</body>

</html>