

var user;
var access_token='';

//var res='';


// Removes the curent active user from the group
function removeOwnerFromGroup ( groupid)
{
  var timeout=1;
  userid = user.id;
  url = `${groupid}/owners/${userid}/$ref`;
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.onreadystatechange = function() {
    if (this.readyState == 4)
    {
      if (this.status == 204)
      {
          showMsgNSecs('alert-info','Removing group ownership from user <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>', timeout);
          setTimeout(function()
          {
            checkOwnerGroups();
          }, timeout*1000);
      }
      else if (this.status == 401)
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

  function assignOwnerToGroup ( groupid)
  {
    var timeout=1;
    url = `${groupid}/owners/$ref`;
    userid = user.id;
    userm = `{ "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/${userid}" }` ;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
      if (this.status == 204)
      {
        showMsgNSecs('alert-info','Adding group ownership to user <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>', timeout);
        setTimeout(function()
        {
          checkOwnerGroups();
        }, timeout*1000);
      }
      else if (this.status == 401)
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
          // Most likely we only get one result - In case of multiple we just pick the first one.
          user = JSON.parse(apiXMLReq.responseText).value[0];
          document.getElementById('userdisplayname').innerText = user.displayName;
          document.getElementById('useremail').innerText = user.mail;
          document.getElementById('userresult').style = 'display:show';
          //document.getElementById('userid').innerText = user.id;
          document.getElementById('allgroups').style = 'display:show';
          checkOwnerGroups();
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
    var allgrp = document.getElementById('allgroups');
    cleanUpElement(allgrp);
    for (var item = 0; item < grparray.length; item++)
    {
      var col = document.createElement("BUTTON");
      col.className = "mt-1 btn group btn-block btn-secondary";
      col.id = grparray[item].id ;
      col.innerText = grparray[item].Name.substr(13) ;
      col.setAttribute("width","100%");
      var type = grparray[item].type;
      col.setAttribute("type",type);
      col.addEventListener('click', function() {
          //console.log(this.id);
          if (this.className.includes("btn-secondary"))
          {
            assignOwnerToGroup ( this.id);
          }
          else
          {
            removeOwnerFromGroup( this.id);
          }
      });
      allgrp.appendChild(col);
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
      callUserApi('userresult',"users?$filter=startswith(mail,\'" + mailaddress+ "\')&$select=id,mail,displayName",access_token);
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
      checkOwnerGroups();
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
  function checkOwnerGroups()
  {
    if (user != null)
    {
      curenvids=currentEnvGroups.map(i => i.id);
      resetColorOfGroups();
      for (i=0; i<curenvids.length; i++)
      {
        checkIfGroupOwner(curenvids[i], user.id);
      }

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
