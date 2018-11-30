//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";
var graph_url = "https://graph.microsoft.com/v1.0/";
var graph_url_groups = "https://graph.microsoft.com/v1.0/groups";
var graph_url_users = "https://graph.microsoft.com/v1.0/users";
var user;
var grp_memberships;
var access_token='';
var currentEnvGroups=[];
var currentEnv='';
var currentPkgGroup='';

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
    for (grp in sgrp)
    {
      removeUserFromGroup (userid, sgrp[grp]);
    }
  }
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


  function handle401(responseJson)
  {
    msg = responseJson.error.code ;
    msg = msg+ " - " + responseJson.error.message ;
    msg = msg+ " <BR> Click <a href='index.html'> here </a> to Login" ;
    showMsgNSecs('alert-danger',msg, 10);
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
      for (grp in sgrp)
      {
        assignUserToGroup (userid, sgrp[grp]);
      }
    }

    url = `/${groupid}/members/$ref`;
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


  function cleanUpElement(element)
  {
    while (element.firstChild)
    {
      //console.log("removing "+element.firstChild);
      element.firstChild.remove();
    }

  }

  /*
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
assignUserToGroup ( this.id );
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

*/

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
    for (email in emails)
    {
      curmail = emails[email];
      if (curmail.trim() != "")
      {
        //console.log(emails[email]);
        callUserApi('userresult',"users?$filter=startswith(mail,\'" + curmail+ "\')&$select=id,mail,displayName",access_token);
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
  currentPkgGroup = getSubGroups(currentEnvGroups, currentEnv , "package")[0];
  //    populateGroups( currentEnvGroups );
  //    checkUserGroups();

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
