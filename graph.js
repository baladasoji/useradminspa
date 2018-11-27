var roles_url = "https://jwtdecoder.azurewebsites.net/";
//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";
var graph_url = "https://graph.microsoft.com/v1.0/";
var graph_url_groups = "https://graph.microsoft.com/v1.0/groups";
var graph_url_users = "https://graph.microsoft.com/v1.0/users";
var user;
var grp_memberships;
var access_token='';
var currentEnvGroups=[];
var currentEnv='';

var res='';

var CDTGroups = [
 {"Name":"MaerskPortal-InternalAccessPackage (Test)","Env":"CDT", "id" :"997432aa-f3ae-4d41-9805-ac5ca58900e0", "type":"package","displayclass":" active" },
 {"Name":"MaerskPortal-SelectAnyCustomer (Test)","Env":"CDT", "id" :"5caad941-0fdf-4eb6-b863-6c205e7a7aa4", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-BasicCustomer (Test)","Env":"CDT", "id" :"4d76288a-e8a5-4346-a9c6-87c2cbb64f8e", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-ContractRate (Test)","Env":"CDT", "id" :"e78ebbe0-d929-4e7a-920f-8af450f7c24e", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-Booking (Test)","Env":"CDT", "id" :"e2e00652-061e-4fa4-96bd-7ba5774f955b", "type":"included","displayclass":" disabled  ml-4 " },
 {"Name":"MaerskPortal-Documentation(Test)","Env":"CDT", "id" :"cbd38137-ac70-471a-816d-d61a4b080ec6", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLApprover (Test)","Env":"CDT", "id" :"6e62dcf0-d3ca-48a5-b228-3a970b066e3c", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLPrinter (Test)","Env":"CDT", "id" :"1f622b07-1f50-4fb6-9e4a-b76f5564fddc", "type":"additional","displayclass":" active " },
 {"Name":"MaerskPortal-MilitaryBooking (Test)","Env":"CDT", "id" :"50a8c1ed-ebdc-432d-aa3f-3ac1c3a4c24e", "type":"additional","displayclass":" active " },
 {"Name":"MaerskPortal-Invoices (Test)","Env":"CDT", "id" :"081e09ad-f10f-4c8c-a857-0927f74f948c", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-SAPBankPayments (Test)","Env":"CDT", "id" :"2bf297ad-af10-4287-843b-2a42f1fc8058", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-InternalPayments (Test)","Env":"CDT", "id" :"19661dfa-7af5-4d8b-819b-5f47a569e79b", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-ImportCSA (Test)","Env":"CDT", "id" :"bf79f984-e51a-494f-bf2c-8046b62ed3e0", "type":"additional","displayclass":" active  " } ];

var PRODGroups = [
 {"Name":"MaerskPortal-InternalAccessPackage (Prod)","Env":"PRODUCTION", "id" :"fd64f48a-f4c2-45fd-b3da-9cbcf42e79d5", "type":"package","displayclass":" active " },
 {"Name":"MaerskPortal-SelectAnyCustomer (Prod)","Env":"PRODUCTION", "id" :"febec376-67d7-4ffc-a902-425e0ece9800", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-BasicCustomer (Prod)","Env":"PRODUCTION", "id" :"3b288542-22ae-4cee-affb-36a491904308", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-ContractRate (Prod)","Env":"PRODUCTION", "id" :"f5b596ac-084f-485c-91b7-c996cc053ddb", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-Booking (Prod)","Env":"PRODUCTION", "id" :"d04fca92-4c5c-4026-bd91-b26239d4b23b", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-Documentation (Prod)","Env":"PRODUCTION", "id" :"ef757b3f-7960-4de9-91bf-c9e47fa3a750", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLApprover (Prod)","Env":"PRODUCTION", "id" :"8dfdeca6-4886-49c2-8954-1b5b559258d9", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLPrinter (Prod)","Env":"PRODUCTION", "id" :"d36f7db7-21c5-45dd-9556-0c5ae3ce08c6", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-InternalPayments (Prod)","Env":"PRODUCTION", "id" :"96e4499a-649f-4f32-b6ed-1cbd0c630654", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-MilitaryBooking (Prod)","Env":"PRODUCTION", "id" :"abfe6748-5753-44a7-9077-25f8b1dd5556", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-Invoices (Prod)","Env":"PRODUCTION", "id" :"75504d36-c7fd-43e1-b685-13343b018023", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-SAPBankPayments (Prod)","Env":"PRODUCTION", "id" :"79cfe0c0-698f-4213-8a23-66c17a4c2603", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-ImportCSA (Prod)","Env":"PRODUCTION", "id" :"2acc3b2e-4e60-46cc-ae08-1ad0674a3de4", "type":"additional","displayclass":" active  " } ];

var STAGEGroups = [
 {"Name":"MaerskPortal-InternalAccessPackage (Stage)","Env":"STAGE", "id" :"1cbe15a4-e810-4572-8c4e-b2303b4ecf99", "type":"package","displayclass":" active " },
 {"Name":"MaerskPortal-SelectAnyCustomer (Stage)","Env":"STAGE", "id" :"e40a8b6c-8daf-4428-8b14-42d6c83a0828", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-BasicCustomer (Stage)","Env":"STAGE", "id" :"fff3031e-8c60-445f-a862-d3f9221fd8f4", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-Documentation (Stage)","Env":"STAGE", "id" :"63a79798-3321-4816-8739-435bb0ad0849", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-Booking (Stage)","Env":"STAGE", "id" :"fd837951-9ffc-4623-9fb6-8d35f8d4c22d", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-ContractRate (Stage)","Env":"STAGE", "id" :"a5fe066a-142d-4dfb-b82d-bb9672d1da2e", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLApprover (Stage)","Env":"STAGE", "id" :"8cd99a55-0e0c-4ae0-85f3-dbc829c72708", "type":"included","displayclass":" disabled ml-4 " },
 {"Name":"MaerskPortal-WBOLPrinter (Stage)","Env":"STAGE", "id" :"2f0c6116-f429-4ead-a151-53ad7f42f96a", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-MilitaryBooking (Stage)","Env":"STAGE", "id" :"f9b1df25-0fd2-4322-8e4c-f1b627b75476", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-Invoices (Stage)","Env":"STAGE", "id" :"69b0e245-40e9-43c0-a04f-9f30535b83ed", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-InternalPayments (Stage)","Env":"STAGE", "id" :"1e841727-4d04-46f0-9ced-6d24c161617d", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-SAPBankPayments (Stage)","Env":"STAGE", "id" :"b2219c53-c10c-4572-aeb2-f2d4e817abb8", "type":"additional","displayclass":" active  " },
 {"Name":"MaerskPortal-ImportCSA (Stage)","Env":"STAGE", "id" :"60d8066a-ea75-40dd-b30c-185d8ad575bb", "type":"additional","displayclass":" active  " } ];

//var allgroups = [{"Name":"MaerskPortal-SelectAnyCustomer (Test)","Env":"CDT", "id" :"5caad941-0fdf-4eb6-b863-6c205e7a7aa4"}, {"Name":"MaerskPortal-ContractRate (Test)","Env":"CDT", "id" :"e78ebbe0-d929-4e7a-920f-8af450f7c24e"}, {"Name":"MaerskPortal-Booking (Test)","Env":"CDT", "id" :"e2e00652-061e-4fa4-96bd-7ba5774f955b"}, {"Name":"MaerskPortal-Documentation(Test)","Env":"CDT", "id" :"cbd38137-ac70-471a-816d-d61a4b080ec6"}, {"Name":"MaerskPortal-WBOLApprover (Test)","Env":"CDT", "id" :"6e62dcf0-d3ca-48a5-b228-3a970b066e3c"}, {"Name":"MaerskPortal-WBOLPrinter (Test)","Env":"CDT", "id" :"1f622b07-1f50-4fb6-9e4a-b76f5564fddc"}, {"Name":"MaerskPortal-MilitaryBooking (Test)","Env":"CDT", "id" :"50a8c1ed-ebdc-432d-aa3f-3ac1c3a4c24e"}, {"Name":"MaerskPortal-Invoices (Test)","Env":"CDT", "id" :"081e09ad-f10f-4c8c-a857-0927f74f948c"}, {"Name":"MaerskPortal-SAPBankPayments (Test)","Env":"CDT", "id" :"2bf297ad-af10-4287-843b-2a42f1fc8058"}, {"Name":"MaerskPortal-InternalPayments (Test)","Env":"CDT", "id" :"19661dfa-7af5-4d8b-819b-5f47a569e79b"}, {"Name":"MaerskPortal-ImportCSA (Test)","Env":"CDT", "id" :"bf79f984-e51a-494f-bf2c-8046b62ed3e0"}, {"Name":"MaerskPortal-InternalAccessPackage (Test)","Env":"CDT", "id" :"997432aa-f3ae-4d41-9805-ac5ca58900e0"}, {"Name":"MaerskPortal-BasicCustomer (Test)","Env":"CDT", "id" :"4d76288a-e8a5-4346-a9c6-87c2cbb64f8e"}, {"Name":"MaerskPortal-InternalAccessPackage (Prod)","Env":"PRODUCTION", "id" :"fd64f48a-f4c2-45fd-b3da-9cbcf42e79d5"}, {"Name":"MaerskPortal-SelectAnyCustomer (Prod)","Env":"PRODUCTION", "id" :"febec376-67d7-4ffc-a902-425e0ece9800"}, {"Name":"MaerskPortal-BasicCustomer (Prod)","Env":"PRODUCTION", "id" :"3b288542-22ae-4cee-affb-36a491904308"}, {"Name":"MaerskPortal-ContractRate (Prod)","Env":"PRODUCTION", "id" :"f5b596ac-084f-485c-91b7-c996cc053ddb"}, {"Name":"MaerskPortal-Booking (Prod)","Env":"PRODUCTION", "id" :"d04fca92-4c5c-4026-bd91-b26239d4b23b"}, {"Name":"MaerskPortal-Documentation (Prod)","Env":"PRODUCTION", "id" :"ef757b3f-7960-4de9-91bf-c9e47fa3a750"}, {"Name":"MaerskPortal-WBOLApprover (Prod)","Env":"PRODUCTION", "id" :"8dfdeca6-4886-49c2-8954-1b5b559258d9"}, {"Name":"MaerskPortal-WBOLPrinter (Prod)","Env":"PRODUCTION", "id" :"d36f7db7-21c5-45dd-9556-0c5ae3ce08c6"}, {"Name":"MaerskPortal-InternalPayments (Prod)","Env":"PRODUCTION", "id" :"96e4499a-649f-4f32-b6ed-1cbd0c630654"}, {"Name":"MaerskPortal-MilitaryBooking (Prod)","Env":"PRODUCTION", "id" :"abfe6748-5753-44a7-9077-25f8b1dd5556"}, {"Name":"MaerskPortal-Invoices (Prod)","Env":"PRODUCTION", "id" :"75504d36-c7fd-43e1-b685-13343b018023"}, {"Name":"MaerskPortal-SAPBankPayments (Prod)","Env":"PRODUCTION", "id" :"79cfe0c0-698f-4213-8a23-66c17a4c2603"}, {"Name":"MaerskPortal-ImportCSA (Prod)","Env":"PRODUCTION", "id" :"2acc3b2e-4e60-46cc-ae08-1ad0674a3de4"}, {"Name":"MaerskPortal-SelectAnyCustomer (Stage)","Env":"STAGE", "id" :"e40a8b6c-8daf-4428-8b14-42d6c83a0828"}, {"Name":"MaerskPortal-BasicCustomer (Stage)","Env":"STAGE", "id" :"fff3031e-8c60-445f-a862-d3f9221fd8f4"}, {"Name":"MaerskPortal-Documentation (Stage)","Env":"STAGE", "id" :"63a79798-3321-4816-8739-435bb0ad0849"}, {"Name":"MaerskPortal-Booking (Stage)","Env":"STAGE", "id" :"fd837951-9ffc-4623-9fb6-8d35f8d4c22d"}, {"Name":"MaerskPortal-ContractRate (Stage)","Env":"STAGE", "id" :"a5fe066a-142d-4dfb-b82d-bb9672d1da2e"}, {"Name":"MaerskPortal-WBOLApprover (Stage)","Env":"STAGE", "id" :"8cd99a55-0e0c-4ae0-85f3-dbc829c72708"}, {"Name":"MaerskPortal-WBOLPrinter (Stage)","Env":"STAGE", "id" :"2f0c6116-f429-4ead-a151-53ad7f42f96a"}, {"Name":"MaerskPortal-MilitaryBooking (Stage)","Env":"STAGE", "id" :"f9b1df25-0fd2-4322-8e4c-f1b627b75476"}, {"Name":"MaerskPortal-Invoices (Stage)","Env":"STAGE", "id" :"69b0e245-40e9-43c0-a04f-9f30535b83ed"}, {"Name":"MaerskPortal-InternalPayments (Stage)","Env":"STAGE", "id" :"1e841727-4d04-46f0-9ced-6d24c161617d"}, {"Name":"MaerskPortal-SAPBankPayments (Stage)","Env":"STAGE", "id" :"b2219c53-c10c-4572-aeb2-f2d4e817abb8"}, {"Name":"MaerskPortal-ImportCSA (Stage)","Env":"STAGE", "id" :"60d8066a-ea75-40dd-b30c-185d8ad575bb"}, {"Name":"MaerskPortal-InternalAccessPackage (Stage)","Env":"STAGE", "id" :"1cbe15a4-e810-4572-8c4e-b2303b4ecf99"} ] ;
var packagegrpids = [ "997432aa-f3ae-4d41-9805-ac5ca58900e0", "fd64f48a-f4c2-45fd-b3da-9cbcf42e79d5","1cbe15a4-e810-4572-8c4e-b2303b4ecf99" ] ;

function getSubGroups(ingroup , env, type)
{
    var subgrpids = [];
    for (item in ingroup)
    {
	if (ingroup[item].Env === env && ingroup[item].type === type)
	{
	    subgrpids.push(ingroup[item].id);
	}
    }
    return subgrpids;
}
	
    


function getToken()
{

  //document.getElementById('mydiv').innerHTML = sessionStorage.access_token;
  callRest();
}


// Removes the curent active user from the group
function removeUserFromGroup ( groupid)
{
    var included=false;  
    included=getSubGroups(currentEnvGroups, currentEnv , "included").includes(groupid);
    var pkg = false;
    pkg=getSubGroups(currentEnvGroups, currentEnv , "package").includes(groupid);
    var additional = false;
    additional=getSubGroups(currentEnvGroups, currentEnv , "additional").includes(groupid);
    var timeout = pkg ? 5 : 1;
    if (pkg)
    {
	//alert ('got a package group');
	sgrp = getSubGroups(currentEnvGroups, currentEnv, "included") ;
	for (grp in sgrp)
	{
	    removeUserFromGroup (sgrp[grp]);
	}
    }
    var included=false;  
    if (getSubGroups(currentEnvGroups, currentEnv , "included").includes(groupid))
    {
	included = true;
    }
	userid = user.id;
	url = `/${groupid}/members/${userid}/$ref`;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    if (this.status == 204)
	    {
		if (!included)
		{
		    showMsgNSecs('alert-info','Removing group from user <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>', timeout);
		    setTimeout(function() 
		    { 
			checkUserGroups();
		    }, timeout*1000);
		}
	    }
	    if (this.status == 401)
	    {
		responseJson = JSON.parse(apiXMLReq.responseText);
		handle401(responseJson)
	    }
	}};
    apiXMLReq.open("DELETE", graph_url_groups + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
    apiXMLReq.setRequestHeader("Content-type","application/json");
    apiXMLReq.send(null);
}


function handle401(responseJson)
{
    msg = responseJson.error.code ;
    msg = msg+ " - " + responseJson.error.message ;
    msg = msg+ " <BR> Click <a href='index.html'> here </a> to Login" ;
    showMsgNSecs('alert-danger',msg, 10);
}


// Assigns the current active user to the group

function assignUserToGroup ( groupid)
{

    var included=false;  
    included=getSubGroups(currentEnvGroups, currentEnv , "included").includes(groupid);
    var pkg = false;
    pkg=getSubGroups(currentEnvGroups, currentEnv , "package").includes(groupid);
    var additional = false;
    additional=getSubGroups(currentEnvGroups, currentEnv , "additional").includes(groupid);
    var timeout = pkg ? 5 : 1;
    // Treat package groups differently
    if (pkg)
    {
//	alert ('got a package group');
	sgrp = getSubGroups(currentEnvGroups, currentEnv, "included") ;
	for (grp in sgrp)
	{
	    assignUserToGroup (sgrp[grp]);
	}
    }

	url = `/${groupid}/members/$ref`;
	userid = user.id;
	userm = `{ "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/${userid}" }` ;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
	    if (this.status == 204)
	    {
		if (!included)
		{
		showMsgNSecs('alert-info','Adding group to user <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>', timeout);
		    setTimeout(function() 
		    { 
			checkUserGroups();
		    }, timeout*1000);
		}
	    }
	    if (this.status == 401)
	    {
		responseJson = JSON.parse(apiXMLReq.responseText);
		handle401(responseJson)
	    }
	};
    apiXMLReq.open("POST", graph_url_groups + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
    apiXMLReq.setRequestHeader("Content-type","application/json");
    apiXMLReq.send(userm);
}

function callGraphApi(element, url, token)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
		ht='<table>';
	    res = JSON.parse(apiXMLReq.responseText).value;
	    for (var item in res)
		{
			//console.log(res[item]);
			ht = ht + '<tr><td>' + res[item].displayName + '</td><td>'+ res[item].mail + '</td><td>'+ res[item].id + '</td></tr>' ;

		}
		ht=ht+ '</table>';
            document.getElementById(element).innerHTML = ht;

        }
      };
    apiXMLReq.open("GET", graph_url + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+token);
    apiXMLReq.send(null);

}

function callUserApi(element, url, token)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    if (this.status == 200)
	    {
		user = JSON.parse(apiXMLReq.responseText).value[0];
		document.getElementById('userdisplayname').innerText = user.displayName;
		document.getElementById('useremail').innerText = user.mail;
		document.getElementById('userresult').style = 'display:show';
		//document.getElementById('userid').innerText = user.id;
		document.getElementById('allgroups').style = 'display:show';
		checkUserGroups();
	    }
	    if (this.status == 401)
	    {
		responseJson = JSON.parse(apiXMLReq.responseText);
		handle401(responseJson)
	    }
        }
      };
    apiXMLReq.open("GET", graph_url + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+token);
    apiXMLReq.send(null);

}

function cleanUpElement(element)
{
    while (element.firstChild)
    {
	console.log("removing "+element.firstChild); 
	element.firstChild.remove();
    }

}

function populateGroups (grparray)
{
    var pkggrp = document.getElementById('packagegrp');
    var inheritedgrp = document.getElementById('inheritedgrp');
    var additionalgrp = document.getElementById('additionalgrp');
    cleanUpElement(pkggrp);
    cleanUpElement(inheritedgrp);
    cleanUpElement(additionalgrp);
    for (item in grparray)
    {
	var col = document.createElement("BUTTON");
	col.className = "mt-1 btn group btn-block btn-secondary " + grparray[item].displayclass ;
	col.id = grparray[item].id ;
	col.innerText = grparray[item].Name.substr(13) ;
	col.setAttribute("width","100%");
	var type = grparray[item].type;
	col.setAttribute("type",type);
	if ( type === "package")
	{
	    col.addEventListener('click', function() { 
		    //console.log(this.id);
		    if (this.className.includes("btn-secondary"))
		    {
			    assignUserToGroup ( this.id);
		    }
		    else
		    {
			    removeUserFromGroup(this.id);
		    }
	    });
	    packagegrp.appendChild(col);
	    
	}
	else if ( type === "included")
	{
	    inheritedgrp.appendChild(col);
	}
	else if ( type === "additional")
	{
	    col.addEventListener('click', function() { 
		    //console.log(this.id);
		    if (this.className.includes("btn-secondary"))
		    {
			    assignUserToGroup ( this.id);
		    }
		    else
		    {
			    removeUserFromGroup( this.id);
		    }
	    });
	    additionalgrp.appendChild(col);
	}
    }
	
}

// This function resets the color of all the groups to unassigned color
function resetColorOfGroups()
{
	var grptds= document.getElementsByClassName("group");
	for (t in grptds)
	{
		if (grptds[t].className != null)
		{
		    cn = grptds[t].className;
		    grptds[t].className= cn.replace("btn-success","btn-secondary");
		}
	}
}



function getMyOwnedGroups()
{
	callGraphApi('ownedgroups','me/ownedObjects?$select=id,displayName',access_token);
}

function getUserWithEmail()
{
	if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
	{
	    showMsgNSecs ('alert-danger','Please choose environment first',3);
	}
	else
	{
	    mailaddress=document.getElementById('email').value;
	    callUserApi('userresult',"users?$filter=startswith(mail,\'" + mailaddress+ "\')&$select=id,mail,displayName",access_token);
	}
}

function changeEnvironment()
{
    currentEnv = this.value;
    console.log("Current environment is "+currentEnv);
    if (currentEnv === "NONE")
    {
	return;
    }
    else if (currentEnv === "CDT")
    {
	currentEnvGroups = CDTGroups;
    }
    else if (currentEnv === "STAGE")
    {
	currentEnvGroups = STAGEGroups;
    }
    else if (currentEnv == "PRODUCTION")
    { 
	currentEnvGroups = PRODGroups;
    }
    populateGroups( currentEnvGroups );
    checkUserGroups();
    
}

// This function obtains the list of groups a user is in and updates the color coding of the groups based on the user membership
function checkUserGroups()
{
	if (user != null)
	{
	    groupids = [];
	    for (grp in currentEnvGroups)
	    {
		    groupids.push(new String(currentEnvGroups[grp].id));
	    }
	    //console.log(groupids);
	    pmsg = "{" + JSON.stringify("groupIds") + ":" + JSON.stringify(groupids) + "}";
	    //console.log(pmsg);
	    var apiXMLReq = new XMLHttpRequest();
	    apiXMLReq.onreadystatechange = function() {
		if (this.readyState == 4)
		{
		    // Once you get response from the call then reset the color of groups
		    resetColorOfGroups();
		    if (this.status == 200)
		    {
			usergrps = JSON.parse(apiXMLReq.responseText).value;
		//	document.getElementById('usergrp').innerText = usergrps;
			for (ugrp in usergrps)
			{
				cn = document.getElementById(usergrps[ugrp]).className;
				document.getElementById(usergrps[ugrp]).className=cn.replace("btn-secondary","btn-success");
			}
		    }
		    else
		    {
			responseJson = JSON.parse(apiXMLReq.responseText);
			handle401(responseJson)
		    }
		}
	      };
	    apiXMLReq.open("POST", graph_url_users + "/" + user.id + "/checkMemberGroups" , true );
	    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
	    apiXMLReq.setRequestHeader("Content-type","application/json");
	    apiXMLReq.send(pmsg);
	}

}

function callRest()
{
	//document.getElementById('btnGetMyGroups').addEventListener('click', getMyOwnedGroups);
	access_token=sessionStorage.access_token;
	document.getElementById('btnGetUserWithEmail').addEventListener('click', getUserWithEmail);
	document.getElementById('environmentChoice').addEventListener('click', changeEnvironment);

	//callGraphApi('result','ownedObjects','');
//	callGraphApi('result','ownedObjects?$select=id,displayName','');
//	callGraphApi('result','users?$filter=startswith(mail,\'john.doe\')&$select=id,mail','');
}

// Utility function to display a message for some number of seconds
function showMsgNSecs (alertclass, message, numsecs)
{
    document.getElementById('message').className = "alert "+alertclass;
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style = 'visibility:visible';

    setTimeout(function(){
	document.getElementById('message').className = "alert alert-info ";
	document.getElementById('message').innerHTML = 'Click on the Groups to Add or Remove them from user';
	document.getElementById('message').style = 'visibility:hidden';
    }, numsecs*1000);
}
