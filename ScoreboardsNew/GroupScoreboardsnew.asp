<!--#include virtual="/common/includes/CheckSession.asp" -->
<!--#include virtual="/common/scripts/DatabaseFunctions.asp" -->
<!--#include virtual="/common/scripts/VariableFunctions.asp" -->
<!--#include virtual="/common/includes/BrowserIdentification.asp" -->
<!--#include virtual="/common/includes/UsageLogging.asp" -->
<!--#include virtual="/application/includes/PopUps.asp" -->

<%
    ' Allow CORS
    Response.AddHeader "Access-Control-Allow-Origin", "https://dev-scoreboard.rpmretail.com"
    Response.AddHeader "Access-Control-Allow-Methods", "GET, POST, OPTIONS"
    Response.AddHeader "Access-Control-Allow-Headers", "Content-Type, Authorization"
    Response.AddHeader "Access-Control-Allow-Credentials", "true"

    ' Handle preflight (OPTIONS) request
    If Request.ServerVariables("REQUEST_METHOD") = "OPTIONS" Then
        Response.Status = "200 OK"
        Response.End
    End If

	Response.Expires = -1

    Heading = split(session("Viewing")," || ")
    if ubound(Heading) > 1 then ReportTitle = Heading(ubound(Heading)) else ReportTitle = Heading(0)

    ObjectType = request("ObjectType")
	if ObjectType = "" then ObjectType = "Group"
	if ObjectType = "GroupCategory" then ObjectType = "Group"
	if ObjectType = "Category" then ObjectType = "Group"
	if ObjectType = "Suppliers" then ObjectType = "Group"
	if ObjectType = "GroupSupplier" then ObjectType = "Group"
    

    Response.Cookies("UserID") = Session("UserID")
    Response.Cookies("FirstName") = Session("FirstName")
    Response.Cookies("LastName") = Session("LastName")
    Response.Cookies("UserName") = Session("UserName")
    Response.Cookies("UserEmail") = Session("UserEmail")
    Response.Cookies("DataWarehouseDB") = Session("DataWarehouseDB")
    Response.Cookies("ApplicationName") = Session("ApplicationName")
    Response.Cookies("UserSession") = Session("UserSession")
    Response.Cookies("OrganisationName") = Session("OrganisationName")
    Response.Cookies("SessionActive") = Session("SessionActive")
    Response.Cookies("Viewing") = Session("Viewing")
    Response.Cookies("SubscriptionObjectType") = Session("SubscriptionObjectType")
    Response.Cookies("SubscriptionGroupName") = Session("SubscriptionGroupName")
    Response.Cookies("SelectedDataSource") = Session("SelectedDataSource")
    Response.Cookies("Viewing") = Session("Viewing")
    Response.Cookies("CurrentDate") = Session("CurrentDate")
    Response.Cookies("CurrentDateKey") = Session("CurrentDateKey")
    Response.Cookies("CurrentDateDisplay") = Session("CurrentDateDisplay")
    Response.Cookies("EnvironmentDate") = Session("EnvironmentDate")
    Response.Cookies("EnvironmentDateKey") = Session("EnvironmentDateKey")
    Response.Cookies("EnvironmentDateDisplay") = Session("EnvironmentDateDisplay")

    Response.Cookies("UserID").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("FirstName").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("LastName").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("UserName").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("UserEmail").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("DataWarehouseDB").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("ApplicationName").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("UserSession").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("OrganisationName").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("SessionActive").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("Viewing").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("SubscriptionObjectType").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("SelectedDataSource").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("Viewing").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("CurrentDate").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("CurrentDateKey").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("CurrentDateDisplay").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("EnvironmentDate").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("EnvironmentDateKey").Domain = "dev-gateway.rpmretail.com"
    Response.Cookies("EnvironmentDateDisplay").Domain = "dev-gateway.rpmretail.com"

    Response.Cookies("UserID").Path = "/"
    Response.Cookies("FirstName").Path = "/"
    Response.Cookies("LastName").Path = "/"
    Response.Cookies("UserName").Path = "/"
    Response.Cookies("UserEmail").Path = "/"
    Response.Cookies("DataWarehouseDB").Path = "/"
    Response.Cookies("ApplicationName").Path = "/"
    Response.Cookies("UserSession").Path = "/"
    Response.Cookies("OrganisationName").Path = "/"
    Response.Cookies("SessionActive").Path = "/"
    Response.Cookies("Viewing").Path = "/"
    Response.Cookies("SubscriptionObjectType").Path = "/"
    Response.Cookies("SelectedDataSource").Path = "/"
    Response.Cookies("Viewing").Path = "/"
    Response.Cookies("CurrentDate").Path = "/"
    Response.Cookies("CurrentDateKey").Path = "/"
    Response.Cookies("CurrentDateDisplay").Path = "/"
    Response.Cookies("EnvironmentDate").Path = "/"
    Response.Cookies("EnvironmentDateKey").Path = "/"
    Response.Cookies("EnvironmentDateDisplay").Path = "/"

    Response.Cookies("UserID").Secure = true
    Response.Cookies("FirstName").Secure = true
    Response.Cookies("LastName").Secure = true
    Response.Cookies("UserName").Secure = true
    Response.Cookies("UserEmail").Secure = true
    Response.Cookies("DataWarehouseDB").Secure = true
    Response.Cookies("ApplicationName").Secure = true
    Response.Cookies("UserSession").Secure = true
    Response.Cookies("OrganisationName").Secure = true
    Response.Cookies("SessionActive").Secure = true
    Response.Cookies("Viewing").Secure = true
    Response.Cookies("SubscriptionObjectType").Secure = true
    Response.Cookies("SelectedDataSource").Secure = true
    Response.Cookies("Viewing").Secure = true
    Response.Cookies("CurrentDate").Secure = true
    Response.Cookies("CurrentDateKey").Secure = true
    Response.Cookies("CurrentDateDisplay").Secure = true
    Response.Cookies("EnvironmentDate").Secure = true
    Response.Cookies("EnvironmentDateKey").Secure = true
    Response.Cookies("EnvironmentDateDisplay").Secure = true

    Dim SelectedDataSource, CurrentDateDisplay
    SelectedDataSource = Session("SelectedDataSource")
    CurrentDate = session("CurrentDate")
    CurrentDateDisplay = session("CurrentDateDisplay")

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <title><%= ReportTitle %></title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
        <link rel="stylesheet" type="text/css" href="/common/css/Defaults.css">
        <link rel="stylesheet" type="text/css" href="/common/css/Structure_MultiFrame.css">
        <link rel="stylesheet" type="text/css" href="/common/css/Fonts.css">
        <link rel="stylesheet" type="text/css" href="/common/css/Skin.css">
        <link rel="stylesheet" type="text/css" href="/common/css/SystemAlert.css">
        <link rel="stylesheet" type="text/css" href="/common/css/Reports.css">
        <link rel="stylesheet" type="text/css" href="/common/css/Printer.css" media="print">
<% if WebBrowser <> "MSIE" then %>
        <link rel="stylesheet" type="text/css" href="/common/css/ForGatewayIn<%= BrowserType %>.css">
<% end if %>
        <link rel="stylesheet" type="text/css" href="/css/Skin.css">
        <link rel="stylesheet" type="text/css" href="/application/css/Options.css">
        <script type="text/javascript" src="/common/scripts/JavaScriptLibrary.js"></script>
        <script type="text/javascript" src="/Application/scripts/ApplicationScripts.js"></script>
        <script>
            let uri = "https://dev-scoreboard.rpmretail.com/?DS=<%= SelectedDataSource %>&CurrentDateDisplay=<%= CurrentDateDisplay%>&CurrentDate=<%= CurrentDate %>";
            let encodedParams = `DS=${encodeURIComponent('<%= SelectedDataSource %>')}&CurrentDateDisplay=${encodeURIComponent('<%= CurrentDateDisplay %>')}&CurrentDate=${encodeURIComponent('<%= CurrentDate %>')}`;
            let encodedUrl = `https://dev-scoreboard.rpmretail.com/?${encodedParams}`;
        </script>

<!--#include virtual="/common/scripts/GoogleAnalytics.asp" -->


    </head>
    <body class="ContentPage" onLoad="SetSelectTab( 'ScoreboardsNew' )">
        <div id="RPMLogoPrint" class="PrintOnly">

        </div>
        <div id="ReportHeader">
            <p id="ReportTitle"><%= ReportTitle %> - Scoreboard (New)</p>
<%  if session("OrganisationCount") > 1 and ubound(Heading) > 1 then %>
            <p id="ReportSubTitle"><%= Heading(0) %></p>
<%  end if %>
            <p id="ReportDate">As at <%= session("CurrentDateDisplay") %></p>
        </div>
        <div id="ReportContent">

        <table id="ReportMenu">
            <tr>
                <td class="ReportMenuHeading" colspan="2">New Scoreboard</td>
            </tr>
            <tr>
                <td class="ReportMenuList">
                    <p class="message"><a href="javascript:void(0)" 
                        onClick="javascript:open(encodedUrl, '_blank', 'status=1,scrollbars=1,menubar=0,resizable=1,toolbar=0,location=1,width=' + screen.width + ',height=' + screen.height + ',fullscreen=1')"><img src="/common/images/insighticons/RPM.png" style="float:left;">KPI Scoreboard</a><br/>
                    View the latest version of KPI scoreboard!</p><br/>

                </td>
                <td class="ReportMenuList">


                </td>
            </tr>
        </table>
        </div>

    </body>
</html>
