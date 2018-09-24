<#assign sitename = theme_display.getThemeSetting('m_sitename')/>
<#if sitename == ''>
	<#assign sitename = 'Bộ Văn hóa, Thể thao và Du lịch'/>
<#else>
	<#assign sitename = theme_display.getThemeSetting('m_sitename')/>
</#if>

<#assign main_responsibility = theme_display.getThemeSetting('m_main_responsibility')/>
<#if main_responsibility == ''>
	<#assign main_responsibility = 'Nguyễn Thanh Liêm, Giám đốc Trung tâm Công nghệ thông tin'/>
<#else>
	<#assign main_responsibility = theme_display.getThemeSetting('m_main_responsibility')/>
</#if>

<#assign address = theme_display.getThemeSetting('m_address')/>
<#if address == ''>
	<#assign address = 'Số 20, ngõ 2, Hoa Lư, Q.Hai Bà Trưng, TP.Hà Nội'/>
<#else>
	<#assign address = theme_display.getThemeSetting('m_address')/>
</#if>

<#assign phone = theme_display.getThemeSetting('m_phone')/>
<#if phone == ''>
	<#assign phone = '0243.9745845 - 0243.9745846'/>
<#else>
	<#assign phone = theme_display.getThemeSetting('m_phone')/>
</#if>

<#assign email = theme_display.getThemeSetting('m_email')/>
<#if email == ''>
	<#assign email = 'ttcntt@cntt.gov.vn'/>
<#else>
	<#assign email = theme_display.getThemeSetting('m_email')/>
</#if>

<#assign copyright = theme_display.getThemeSetting('m_copyright')/>
<#if copyright == ''>
	<#assign copyright = 'Ghi rõ nguồn "Cổng Dịch vụ công trực tuyến của Bộ VHTTDL", dichvucong.bvhttdl.gov.vn khi phát hành lại thông tin từ website này'/>
<#else>
	<#assign copyright = theme_display.getThemeSetting('m_copyright')/>
</#if>