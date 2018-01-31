
<%
	on error goto 0
	Dim ResponseXML:  ResponseXML=""
	Dim postData : postData =Request.Form
	toolURL="http://10.10.10.22:2000/search"
	if request("submit1")<>"" then
		Set ObjXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP")
		ObjXmlHttp.Open "POST", toolURL, false
		ObjXmlHttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
		ObjXmlHttp.Send(postData)
		if ObjXmlHttp.readyState <> 4 then
			ObjXmlHttp.waitForResponse(WAIT_TIMEOUT)
		end if	
		ResponseXML= ObjXmlHttp.ResponseText
		Set ObjXmlHttp = nothing
	end if
	if err<>"" then response.write err.description
%>	
	<html>
	<table width="100%">
	<tr>
		<td width="50%">
			<%call ShowForm()%>
		</td>
		<td width="50%">
			<textarea style="width:400px; height:450px">
				<%=server.htmlEncode(ResponseXML)%>
			</textarea>
		</td>
	</html>

<%
function ShowForm()
	%>
	<style>
		label{
			padding-right:10px;
			font-weight:bold;
		}
	</style>
	<form method="post" action="toolpost.asp">
		<label>Sessionid:</label><input type="text" name="sessionid" value="<%=helper("sessionid", "123456")%>"/><br>
		<label>AgentID:</label><input type="text" name="AgentID" value="<%=helper("AgentID", "60042")%>"/><br>
		<label>CodeFrom:</label><input type="text" name="CodeFrom" value="<%=helper("CodeFrom", "ALC")%>"/><br>
		<label>CodeTo:</label><input type="text" name="CodeTo" value="<%=helper("CodeTo", "BEN")%>"/><br>
		<label>Adults:</label><input type="text" name="Adults" value="<%=helper("Adults", "2")%>"/><br>
		<label>FromLat:</label><input type="text" name="FromLat" value="<%=helper("FromLat", "51.4703")%>"/><br>
		<label>FromLong:</label><input type="text" name="FromLong" value="<%=helper("FromLong", "-0.45342")%>"/><br>
		<label>ToLat:</label><input type="text" name="ToLat" value="<%=helper("ToLat", "50.8197675")%>"/><br>
		<label>ToLong:</label><input type="text" name="ToLong" value="<%=helper("ToLong", "-1.0879769000000579")%>"/><br>
		<label>Children:</label><input type="text" name="Children" value="<%=helper("Children", "0")%>"/><br>
		<label>Infants:</label><input type="text" name="Infants" value="<%=helper("Infants", "0")%>"/><br>
		<label>FromDate:</label><input type="text" name="FromDate" value="<%=helper("FromDate", "20180415")%>"/><br>
		<label>ToDate:</label><input type="text" name="ToDate" value="<%=helper("ToDate", "20180428")%>"/><br>
		<label>FromTime:</label><input type="text" name="FromTime" value="<%=helper("FromTime", "1400")%>"/><br>
		<label>ToTime:</label><input type="text" name="ToTime" value="<%=helper("ToTime", "1200")%>"/><br>
		<label>currencyid:</label><input type="text" name="currencyid" value="<%=helper("currencyid", "USD")%>"/><br>
		<fieldset>
			<legend>Checking boxes will not send requests to checked suppliers</legend>
			<label>Remove Mozio</label><input type="checkbox" value="-1" name="Mozio" <%if request("Mozio")="-1" then response.write "checked='checked'"%>><br>
			<label>Remove TaxiCode</label><input type="checkbox" value="-1"  name="TaxiCode" <%if request("TaxiCode")="-1" then response.write "checked='checked'"%>><br>
			<label>Remove P2P</label><input type="checkbox"  value="-1" name="P2P" <%if request("P2P")="-1" then response.write "checked='checked'"%>><br>
		</fieldset>
		<input type="submit" name="submit1" value="Search"/>
	
	</form><%
end function

function helper(obj, defVal)
	dim retval : retval =defVal
	if trim(request(obj))<>"" then retval=request(obj)
	helper=retval
end function
%>