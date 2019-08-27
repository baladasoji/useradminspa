//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";

var user;
var access_token='';


var res='';


// Removes the curent active user from the group
function removeUserFromGroup (userid, groupid)
{
  //console.log("userid is "+userid + "group id is "+groupid);
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
    for (i=0; i<sgrp.length; i++)
    {
      removeUserFromGroup (userid, sgrp[i]);
    }
  }
  url = `${groupid}/members/${userid}/$ref`;
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
            curuserelement = document.getElementById(userid)
            if (curuserelement.className != null)
            {
              cn = curuserelement.className;
              curuserelement.className= cn.replace("btn-success","btn-secondary");
            }
            //checkUserGroups();
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



  // Assigns the current active user to the group

  function assignUserToGroup (userid, groupid)
  {
    //console.log("userid is "+userid + "group id is "+groupid);
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
	for (i=0; i<sgrp.length; i++)
      {
        assignUserToGroup (userid, sgrp[i]);
      }
    }

    url = `${groupid}/members/$ref`;
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
            curuserelement = document.getElementById(userid)
            if (curuserelement.className != null)
            {
              cn = curuserelement.className;
              curuserelement.className= cn.replace("btn-secondary","btn-success");
            }
            //checkUserGroups();
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

  function callUserApi(element, url, token)
  {
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
      if (this.readyState == 4)
      {
        if (this.status == 200)
        {
          user = JSON.parse(apiXMLReq.responseText).value[0];

          var col = document.createElement("BUTTON");
          col.className = "mt-1 btn user btn-block btn-secondary " ;
          col.id = user.id ;
          col.innerText = user.displayName ;
          col.setAttribute("width","100%");
          col.addEventListener('click', function() {
            //console.log(this.id);
            if (this.className.includes("btn-secondary"))
            {
              assignUserToGroup ( this.id, currentPkgGroup);
            }
            else
            {
              removeUserFromGroup(this.id, currentPkgGroup);
            }
          });

          document.getElementById(element).appendChild(col);
          checkUserInGroup(user.id, currentPkgGroup);

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


function getUsersWithEmail()
{
  if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
  {
    showMsgNSecs ('alert-danger','Please choose environment first',3);
  }
  else
  {
    cleanUpElement(document.getElementById('userresult'));
    allemailsstr=  document.getElementById('emails').value;
    emails = allemailsstr.split("\n");
    for (i=0; i<emails.length; i++)
    {
      curmail = emails[i];
      if (curmail.trim() != "")
      {
        //console.log(emails[email]);
        callUserApi('userresult',"users?$filter=startswith(userprincipalname,\'" + curmail+ "\')&$select=id,userprincipalname,displayName",access_token);
      }
    }
  }
}

function changeEnvironment()
{
  currentEnv = this.value;
  //console.log("Current environment is "+currentEnv);
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
  if (checkIfOwner())
  {
    cleanUpElement(document.getElementById('userresult'));
    currentPkgGroup = getSubGroups(currentEnvGroups, currentEnv , "package")[0];
  }

}

// This function checks if the logged in user is an owner of all the current environment Groups
function checkIfOwner()
{
  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };
  curenvids=currentEnvGroups.map(i => i.id);
  notownedgroups = curenvids.diff(ownedgroups);
  notownedgroupnames = currentEnvGroups.filter(n => notownedgroups.includes(n.id)).map(i => i.Name);
  if (notownedgroupnames.length > 0)
  {
    msg = "You are not an owner of the following groups in Azure AD. Please correct this first " + notownedgroupnames;
    showMsgNSecs ('alert-danger', msg, 10);
    return false;
  }
  return true;
}
// This function obtains the list of groups a user is in and updates the color coding of the groups based on the user membership
function checkUserInGroup(userid, groupid)
{
  groupids = [];
  groupids.push(new String(groupid));
  //console.log(groupids);
  pmsg = "{" + JSON.stringify("groupIds") + ":" + JSON.stringify(groupids) + "}";
  //console.log(pmsg);
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.onreadystatechange = function() {
    if (this.readyState == 4)
    {
      // Once you get response from the call then reset the color of groups
      //resetColorOfGroups();
      if (this.status == 200)
      {
        usergrps = JSON.parse(apiXMLReq.responseText).value;
        if (usergrps.length > 0)
        {
          curuser = document.getElementById(userid);
          cn = curuser.className;
          curuser.className=cn.replace("btn-secondary","btn-success");
        }
      }
      else
      {
        responseJson = JSON.parse(apiXMLReq.responseText);
        handle401(responseJson)
      }
    }
  };
  apiXMLReq.open("POST", graph_url_users + "/" + userid + "/checkMemberGroups" , true );
  apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
  apiXMLReq.setRequestHeader("Content-type","application/json");
  apiXMLReq.send(pmsg);

}

function preChecksForAll()
{
  //console.log("inside prechecksforall");
  if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
  {
    showMsgNSecs ('alert-danger','Please choose environment first',3);
    return false;
  }
  else if (!document.getElementById('userresult').firstChild)
  {

    showMsgNSecs ('alert-danger','Please search for users first',3);
    return false;
  }
  else
  return true;
}

function assignToAll()
{
  //console.log("inside assignt ot all");
  if (preChecksForAll())
  {
    allusers = document.getElementById("userresult").childNodes;
    for (u=0 ;u <allusers.length; u++)
    {
      assignUserToGroup(allusers[u].id, currentPkgGroup);
    }

  }
}

function removeFromAll()
{
  //console.log("inside remove from  all");
  if (preChecksForAll())
  {
    var allusers = document.getElementsByClassName("user");
    for (u=0 ;u <allusers.length; u++)
    {
      removeUserFromGroup(allusers[u].id, currentPkgGroup);
    }

  }
}

function callRest()
{
  //document.getElementById('btnGetMyGroups').addEventListener('click', getMyOwnedGroups);
  access_token=sessionStorage.access_token;
  //alert("inside call rest");
  cleanUpElement(document.getElementById('userresult'));
  document.getElementById('btnGetUsersWithEmail').addEventListener('click', getUsersWithEmail);
  document.getElementById('btnAssignToAllUsers').addEventListener('click', assignToAll);
  document.getElementById('btnRemoveFromAllUsers').addEventListener('click', removeFromAll);
  document.getElementById('btnGetUsersWithEmail').addEventListener('click', getUsersWithEmail);
  document.getElementById('environmentChoice').addEventListener('click', changeEnvironment);
  getMyOwnedGroups();
  //callGraphApi('result','ownedObjects','');
  //	callGraphApi('result','ownedObjects?$select=id,displayName','');
  //	callGraphApi('result','users?$filter=startswith(mail,\'john.doe\')&$select=id,mail','');
}

// Utility function to display a message for some number of seconds
