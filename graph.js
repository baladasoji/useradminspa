var roles_url = "https://jwtdecoder.azurewebsites.net/";
//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";
var graph_url = "https://graph.microsoft.com/v1.0/";
var graph_url_groups = "https://graph.microsoft.com/v1.0/groups";
var graph_url_users = "https://graph.microsoft.com/v1.0/users";
var user;
var grp_memberships;
var testgrp;
var stagegrp;
var prodgrp;
var access_token='';

var res='';

var allgroups = [{"Name":"MaerskPortal-SelectAnyCustomer (Test)","Env":"CDT", "id" :"5caad941-0fdf-4eb6-b863-6c205e7a7aa4"}, {"Name":"MaerskPortal-ContractRate (Test)","Env":"CDT", "id" :"e78ebbe0-d929-4e7a-920f-8af450f7c24e"}, {"Name":"MaerskPortal-Booking (Test)","Env":"CDT", "id" :"e2e00652-061e-4fa4-96bd-7ba5774f955b"}, {"Name":"MaerskPortal-Documentation(Test)","Env":"CDT", "id" :"cbd38137-ac70-471a-816d-d61a4b080ec6"}, {"Name":"MaerskPortal-WBOLApprover (Test)","Env":"CDT", "id" :"6e62dcf0-d3ca-48a5-b228-3a970b066e3c"}, {"Name":"MaerskPortal-WBOLPrinter (Test)","Env":"CDT", "id" :"1f622b07-1f50-4fb6-9e4a-b76f5564fddc"}, {"Name":"MaerskPortal-MilitaryBooking (Test)","Env":"CDT", "id" :"50a8c1ed-ebdc-432d-aa3f-3ac1c3a4c24e"}, {"Name":"MaerskPortal-Invoices (Test)","Env":"CDT", "id" :"081e09ad-f10f-4c8c-a857-0927f74f948c"}, {"Name":"MaerskPortal-SAPBankPayments (Test)","Env":"CDT", "id" :"2bf297ad-af10-4287-843b-2a42f1fc8058"}, {"Name":"MaerskPortal-InternalPayments (Test)","Env":"CDT", "id" :"19661dfa-7af5-4d8b-819b-5f47a569e79b"}, {"Name":"MaerskPortal-ImportCSA (Test)","Env":"CDT", "id" :"bf79f984-e51a-494f-bf2c-8046b62ed3e0"}, {"Name":"MaerskPortal-InternalAccessPackage (Test)","Env":"CDT", "id" :"997432aa-f3ae-4d41-9805-ac5ca58900e0"}, {"Name":"MaerskPortal-BasicCustomer (Test)","Env":"CDT", "id" :"4d76288a-e8a5-4346-a9c6-87c2cbb64f8e"}, {"Name":"MaerskPortal-InternalAccessPackage (Prod)","Env":"Production", "id" :"fd64f48a-f4c2-45fd-b3da-9cbcf42e79d5"}, {"Name":"MaerskPortal-SelectAnyCustomer (Prod)","Env":"Production", "id" :"febec376-67d7-4ffc-a902-425e0ece9800"}, {"Name":"MaerskPortal-BasicCustomer (Prod)","Env":"Production", "id" :"3b288542-22ae-4cee-affb-36a491904308"}, {"Name":"MaerskPortal-ContractRate (Prod)","Env":"Production", "id" :"f5b596ac-084f-485c-91b7-c996cc053ddb"}, {"Name":"MaerskPortal-Booking (Prod)","Env":"Production", "id" :"d04fca92-4c5c-4026-bd91-b26239d4b23b"}, {"Name":"MaerskPortal-Documentation (Prod)","Env":"Production", "id" :"ef757b3f-7960-4de9-91bf-c9e47fa3a750"}, {"Name":"MaerskPortal-WBOLApprover (Prod)","Env":"Production", "id" :"8dfdeca6-4886-49c2-8954-1b5b559258d9"}, {"Name":"MaerskPortal-WBOLPrinter (Prod)","Env":"Production", "id" :"d36f7db7-21c5-45dd-9556-0c5ae3ce08c6"}, {"Name":"MaerskPortal-InternalPayments (Prod)","Env":"Production", "id" :"96e4499a-649f-4f32-b6ed-1cbd0c630654"}, {"Name":"MaerskPortal-MilitaryBooking (Prod)","Env":"Production", "id" :"abfe6748-5753-44a7-9077-25f8b1dd5556"}, {"Name":"MaerskPortal-Invoices (Prod)","Env":"Production", "id" :"75504d36-c7fd-43e1-b685-13343b018023"}, {"Name":"MaerskPortal-SAPBankPayments (Prod)","Env":"Production", "id" :"79cfe0c0-698f-4213-8a23-66c17a4c2603"}, {"Name":"MaerskPortal-ImportCSA (Prod)","Env":"Production", "id" :"2acc3b2e-4e60-46cc-ae08-1ad0674a3de4"}, {"Name":"MaerskPortal-SelectAnyCustomer (Stage)","Env":"Staging", "id" :"e40a8b6c-8daf-4428-8b14-42d6c83a0828"}, {"Name":"MaerskPortal-BasicCustomer (Stage)","Env":"Staging", "id" :"fff3031e-8c60-445f-a862-d3f9221fd8f4"}, {"Name":"MaerskPortal-Documentation (Stage)","Env":"Staging", "id" :"63a79798-3321-4816-8739-435bb0ad0849"}, {"Name":"MaerskPortal-Booking (Stage)","Env":"Staging", "id" :"fd837951-9ffc-4623-9fb6-8d35f8d4c22d"}, {"Name":"MaerskPortal-ContractRate (Stage)","Env":"Staging", "id" :"a5fe066a-142d-4dfb-b82d-bb9672d1da2e"}, {"Name":"MaerskPortal-WBOLApprover (Stage)","Env":"Staging", "id" :"8cd99a55-0e0c-4ae0-85f3-dbc829c72708"}, {"Name":"MaerskPortal-WBOLPrinter (Stage)","Env":"Staging", "id" :"2f0c6116-f429-4ead-a151-53ad7f42f96a"}, {"Name":"MaerskPortal-MilitaryBooking (Stage)","Env":"Staging", "id" :"f9b1df25-0fd2-4322-8e4c-f1b627b75476"}, {"Name":"MaerskPortal-Invoices (Stage)","Env":"Staging", "id" :"69b0e245-40e9-43c0-a04f-9f30535b83ed"}, {"Name":"MaerskPortal-InternalPayments (Stage)","Env":"Staging", "id" :"1e841727-4d04-46f0-9ced-6d24c161617d"}, {"Name":"MaerskPortal-SAPBankPayments (Stage)","Env":"Staging", "id" :"b2219c53-c10c-4572-aeb2-f2d4e817abb8"}, {"Name":"MaerskPortal-ImportCSA (Stage)","Env":"Staging", "id" :"60d8066a-ea75-40dd-b30c-185d8ad575bb"}, {"Name":"MaerskPortal-InternalAccessPackage (Stage)","Env":"Staging", "id" :"1cbe15a4-e810-4572-8c4e-b2303b4ecf99"} ] ;
function getToken()
{

  //document.getElementById('mydiv').innerHTML = sessionStorage.id_token;
  callRest();
}
function removeUserFromGroup ( groupid)
{
	userid = user.id;
	url = `/${groupid}/members/${userid}/$ref`;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
		alert('removed');
	checkUserGroups();
	}};
    apiXMLReq.open("DELETE", graph_url_groups + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
    apiXMLReq.setRequestHeader("Content-type","application/json");
    apiXMLReq.send(null);
}
function assignUserToGroup ( groupid)
{
	url = `/${groupid}/members/$ref`;
	userid = user.id;
	userm = `{ "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/${userid}" }` ;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
		alert('added');
		checkUserGroups();
	}};
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
			console.log(res[item]);
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
	    user = JSON.parse(apiXMLReq.responseText).value[0];
		document.getElementById('userdisplayname').innerText = user.displayName;
		document.getElementById('useremail').innerText = user.mail;
		document.getElementById('userid').innerText = user.id;
	checkUserGroups();
        }
      };
    apiXMLReq.open("GET", graph_url + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+token);
    apiXMLReq.send(null);

}


function callRolesApi(element, url, token)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    allroles = ["Booking", "Documentation", "MaerskInternal", "WBOLPrinter", "ImportCSA", "SAPBankPayments", "InternalPayments", "Invoices", "MilitaryBooking" , " WBOLApprover", "ContractRate" ] ;
            assignedroles = JSON.parse(apiXMLReq.responseText);
            if (assignedroles.length == 0)
            {
              row = 'You do not have access to the Internal portal. Please request access on <a href="https://maersk.service-now.com"> SNOW </a>';
            }
            else
            {

              var i = 1;
              var row='<div class="container"> <h2 class="display-5">Role Information</h2>' ;
              for ( var s in allroles)
              {
        		    if (assignedroles.includes(allroles[s]))
        		    {
                        	    row = row + '<div class="row"> <div class="col-6 checkedin-player-name" >' + allroles[s] +  '</div> </div>';
        		    }
        		    else
        		    {
                        	    row = row + '<div class="row"> <div class="col-6 checkedout-player-name">' + allroles[s] +  ' </div> </div>';
        		    }
                  // Do something
              }
	            row = row + `</div>`;
            }
            document.getElementById(element).innerHTML = row;

        }
      };
    apiXMLReq.open("POST", roles_url + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+token);
    apiXMLReq.send(null);

}

function showGroup (element, grparray)
{
	var tbl = document.createElement("TABLE");
	tbl.className = "table table-bordered";
	for (item in grparray)
	{
		var tr = document.createElement("TR");
		var td = document.createElement("TD");
//		td.nodeValue = grparray[item].Name;
		td.innerText = grparray[item].Name;
		td.id = grparray[item].id;
		td.className= "btn group btn-secondary";
		td.addEventListener('click', function() { 
			console.log(this.id);
			if (this.className.includes("btn-secondary"))
			{
				assignUserToGroup (this.id);
			}
			else
			{
				removeUserFromGroup(this.id);
			}
		});
		td.setAttribute("width","100%");
		tr.appendChild(td);
		tbl.appendChild(tr);
	}
	document.getElementById(element).appendChild(tbl);


}

function resetColorOfGroups()
{
	var grptds= document.getElementsByClassName("group");
	for (t in grptds)
	{
		grptds[t].className="btn group btn-secondary";
	}
}

function sortOutGroups()
{
	testgrp =  allgroups.filter(function(grp) { return grp.Env === "CDT" ; }) ;
	stagegrp =  allgroups.filter(function(grp) { return grp.Env === "Staging" ; }) ;
	prodgrp =  allgroups.filter(function(grp) { return grp.Env === "Production" ; }) ;
	showGroup('testgrp', testgrp);
	showGroup('stagegrp', stagegrp);
	showGroup('prodgrp', prodgrp);

}

function addUserToGroup()
{

}

function getMyOwnedGroups()
{
	callGraphApi('ownedgroups','me/ownedObjects?$select=id,displayName',access_token);
}

function getUserWithEmail()
{
	mailaddress=document.getElementById('email').value;
	callUserApi('userresult',"users?$filter=startswith(mail,\'" + mailaddress+ "\')&$select=id,mail,displayName",access_token);
//	callGraphApi('result','users?$filter=startswith(mail,\'ashish.pinjani\')&$select=id,mail',access_token);
}

function checkUserGroups()
{

	resetColorOfGroups();
	groupids = [];
	for (grp in testgrp)
	{
		groupids.push(new String(allgroups[grp].id));
	}
	console.log(groupids);
	pmsg = "{" + JSON.stringify("groupIds") + ":" + JSON.stringify(groupids) + "}";
	console.log(pmsg);
	    var apiXMLReq = new XMLHttpRequest();
	    apiXMLReq.onreadystatechange = function() {
		if (this.readyState == 4)
		{
		    usergrps = JSON.parse(apiXMLReq.responseText).value;
		//	document.getElementById('usergrp').innerText = usergrps;
			for (ugrp in usergrps)
			{
				document.getElementById(usergrps[ugrp]).className="btn group btn-success";
			}
		}
	      };
	    apiXMLReq.open("POST", graph_url_users + "/" + user.id + "/checkMemberGroups" , true );
	    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
	    apiXMLReq.setRequestHeader("Content-type","application/json");
	    apiXMLReq.send(pmsg);

}

function callRest()
{
//	alert('I am getting called');
	//document.getElementById('btnGetMyGroups').addEventListener('click', getMyOwnedGroups);
	document.getElementById('btnGetUserWithEmail').addEventListener('click', getUserWithEmail);
	sortOutGroups();

        //callRolesApi('userroles','roles', sessionStorage.id_token);
        //callUserApi('username','username', sessionStorage.id_token);
	//callGraphApi('result','ownedObjects','');
//	callGraphApi('result','ownedObjects?$select=id,displayName','');
//	callGraphApi('result','users?$filter=startswith(mail,\'john.doe\')&$select=id,mail','');
}
