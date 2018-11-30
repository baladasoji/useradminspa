//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";
var graph_url = "https://graph.microsoft.com/v1.0/";
var graph_url_groups = "https://graph.microsoft.com/v1.0/groups";
var graph_url_users = "https://graph.microsoft.com/v1.0/users";
var user;
var grp_memberships;
var access_token='';
var currentEnvGroups=[];
var currentEnv='';
var ownedgroups=[];

var res='';


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
    url='me/ownedObjects?$select=id,displayName';
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
      if (this.readyState == 4)
      {
        if (this.status == 200)
        {

          res = JSON.parse(apiXMLReq.responseText).value;
          for (var item in res)
          {
            ownedgroups.push(res[item].id);

          }
//          console.log(ownedgroups);

        }
        else if (this.status == 401)
        {
          responseJson = JSON.parse(apiXMLReq.responseText);
          handle401(responseJson)
        }

      }
    };
    apiXMLReq.open("GET", graph_url + url , true );
    apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
    apiXMLReq.send(null);
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
    if (checkIfOwner())
    {
      populateGroups( currentEnvGroups );
      checkUserGroups();
    }

  }

// This function checks if the logged in user is an owner of all the current environment Groups
  function checkIfOwner()
  {
    //console.log(ownedgroups);
    //console.log(currentEnvGroups);
    //envgrpid = currentEnvGroups.map(grp, grp => id);
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    curenvids=currentEnvGroups.map(i => i.id);
    notownedgroups = curenvids.diff(ownedgroups);
    notownedgroupnames = currentEnvGroups.filter(n => notownedgroups.includes(n.id)).map(i => i.Name);
    if (notownedgroupnames.length > 0)
    {
      msg = "You are not an owner of the following groups. Please correct first " + notownedgroupnames;
      showMsgNSecs ('alert-danger', msg, 10);
      return false;
    }
    return true;
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
    getMyOwnedGroups();

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
