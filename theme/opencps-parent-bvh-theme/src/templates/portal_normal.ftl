<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>${the_title} - ${company_name}</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<!-- <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700&amp;subset=vietnamese" rel="stylesheet"> -->

	<@liferay_util["include"] page=top_head_include />
	
	<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
	<link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet" />
	<link href="${themeDisplay.getPathThemeRoot()}/css/claycustom.css?t=123" rel="stylesheet" />
	
	<!-- Mainly scripts -->
	<script>
        window.__define = window.define;
        window.__require = window.require;
        window.define = undefined;
        window.require = undefined;
    </script>
	 
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/kendo.ui.core.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jasny-bootstrap.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment-with-locales.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap-datetimepicker.min.js"></script>
	
	<script src="${themeDisplay.getPathThemeRoot()}/js/bootstrap-editable.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/moment.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/kendo.culture.vi-VN.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/summernote.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/toastr.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/handlebars.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.ui.widget.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.fileupload.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.fileupload-process.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.fileupload-validate.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.iframe-transport.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/jquery.textcomplete.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/alpaca.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/mobilink-alpaca-form.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/mobilink.util.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
	<script src="${themeDisplay.getPathThemeRoot()}/js/custom.js"></script>
	
	<script>
        window.define = window.__define;
        window.require = window.__require;
        window.__define = undefined;
        window.__require = undefined;
    </script>
</head>

<body class="${css_class} OpenCPS mBody page-theme">

<@liferay_util["include"] page=body_top_include />

<#if permissionChecker.isOmniadmin()>
	<style>
		html .has-control-menu #wrapper {
			margin-top: 0 !important;
		}
		html body.open #wrapper {
			padding-left: 0 !important;
		}
	</style>
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

<div class="mWrapper">
	<header id="banner">		
		<div class="container align-middle hide-title">
			<a href="${site_default_url}" class="logo align-middle">
				<img src="${themeDisplay.getPathThemeRoot()}/images/logo.png">
				<div class="text-logo">
					${site_name}
					<span>HỆ THỐNG MỘT CỬA ĐIỆN TỬ VÀ DỊCH VỤ CÔNG TRỰC TUYẾN</span>
				</div>
			</a>
			<@liferay_portlet["runtime"] portletName="npmreactlogin"/>
		</div>
	</header>
		
	<#if has_navigation && is_setup_complete>
		<#include "${full_templates_path}/navigation.ftl" />
	</#if>

	<section id="main-content">
		<div class="container-fluid">
			<#if selectable>
				<@liferay_util["include"] page=content_include />
			<#else>
				${portletDisplay.recycle()}

				${portletDisplay.setTitle(the_title)}

				<@liferay_theme["wrap-portlet"] page="portlet.ftl">
					<@liferay_util["include"] page=content_include />
				</@>
			</#if>
		</div>
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

</body>

<script type="text/javascript">
	    $.ajaxSetup({
			headers: {"Token": Liferay.authToken},
			global: true
		});
</script>

</html>
