

var user;
var access_token='';

//var res='';


// Removes the curent active user from the group
function removeUserFromGroup ( groupid)
{
  // Find out what type of group are we removing from the user
  var included=false;
  included=getSubGroups(currentEnvGroups, currentEnv , "included").includes(groupid);
  var pkg = false;
  pkg=getSubGroups(currentEnvGroups, currentEnv , "package").includes(groupid);
  var additional = false;
  additional=getSubGroups(currentEnvGroups, currentEnv , "additional").includes(groupid);
  // Package group requires more time to be removed as it involves the included groups. Hence set a higher timeout for package group
  var timeout = pkg ? 5 : 1;
  // If we got a package group then we need to remove all the included groups too..
  if (pkg)
  {
    //alert ('got a package group');
    sgrp = getSubGroups(currentEnvGroups, currentEnv, "included") ;
    for (grp in sgrp)
    {
      removeUserFromGroup (sgrp[grp]);
    }
  }

  userid = user.id;
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


  // Assigns the current active user to the group

  function assignUserToGroup ( groupid)
  {
    // Find out what type of group are we adding to the user
    var included=false;
    included=getSubGroups(currentEnvGroups, currentEnv , "included").includes(groupid);
    var pkg = false;
    pkg=getSubGroups(currentEnvGroups, currentEnv , "package").includes(groupid);
    var additional = false;
    additional=getSubGroups(currentEnvGroups, currentEnv , "additional").includes(groupid);
    var timeout = pkg ? 5 : 1;
    // If we got a package group then we need to add all the included groups too..
    if (pkg)
    {
      //	alert ('got a package group');
      sgrp = getSubGroups(currentEnvGroups, currentEnv, "included") ;
      for (grp in sgrp)
      {
        assignUserToGroup (sgrp[grp]);
      }
    }

    url = `${groupid}/members/$ref`;
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
  // Old method not used - Only here for reference
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
          // Most likely we only get one result - In case of multiple we just pick the first one.
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
    for (var item = 0; item < grparray.length; item++)
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





  function getUserWithEmail()
  {
    if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
    {
      showMsgNSecs ('alert-danger','Please choose environment first',3);
    }
    else
    {
      mailaddress=document.getElementById('email').value;
      callUserApi('userresult',"users?$filter=startswith(userprincipalname,\'" + mailaddress+ "\')&$select=id,userprincipalname,displayName",access_token);
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
      populateGroups( currentEnvGroups );
      checkUserGroups();
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
  function checkUserGroups()
  {
    if (user != null)
    {
      groupids = currentEnvGroups.map(i => i.id);
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
            for (ugrp=0; ugrp<usergrps.length; ugrp++)
            {
              cn = document.getElementById(usergrps[ugrp]).className;
              document.getElementById(usergrps[ugrp]).className=cn.replace("btn-secondary","btn-success");
            }
          }
          else if (this.status == 401)
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
    // Get users owned groups from AD first we use this in comparision later
    getMyOwnedGroups();

    //callGraphApi('result','ownedObjects','');
    //	callGraphApi('result','ownedObjects?$select=id,displayName','');
    //	callGraphApi('result','users?$filter=startswith(mail,\'john.doe\')&$select=id,mail','');
  }
