//var graph_url = "https://graph.microsoft.com/v1.0/users/bd3298eb-8cde-49ea-b6c0-cff6ad1c4b1c/";

var user;
var access_token='';

var sap_text='';
var res='';


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
          col.value = user.mail ;
          col.setAttribute("width","100%");

          document.getElementById(element).appendChild(col);

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
    saptext='';
    cleanUpElement(document.getElementById('userresult'));
    document.getElementById('saptext').innerText=saptext;
    allemailsstr=  document.getElementById('emails').value;
    emails = allemailsstr.split("\n");
    for (i=0; i<emails.length; i++)
    {
      curmail = emails[i];
      if (curmail.trim() != "")
      {
        //console.log(emails[email]);
        callUserApi('userresult',"users?$filter=startswith(mail,\'" + curmail+ "\')&$select=id,mail,displayName",access_token);
      }
    }
}


function generateImport()
{
  //console.log("inside assignt ot all");
    saptext='';
    allusers = document.getElementById("userresult").childNodes;
    for (u=0 ;u < allusers.length; u++)
    {
	email = allusers[u].value;
	names = allusers[u].innerText.split(",");
	lastname = names[0];
	firstname = names[1];
	curusertext='[User]\nuid=EMAIL\nlast_name=LASTNAME\nfirst_name=FIRSTNAME\ncom.sap.security.core.user.references:objkey_0=1000DKINTMSL\ncom.sap.security.core.user.references:objtype_0=BUS3007\ncom.sap.security.core.user.refuser:fscm_refuser=BD_REF1000\n';
	curusertext = curusertext.replace('EMAIL',email.trim());
	curusertext = curusertext.replace('FIRSTNAME',firstname.trim());
	curusertext = curusertext.replace('LASTNAME',lastname.trim());
	saptext = saptext + curusertext;
    }
//    console.log(saptext);
    document.getElementById('saptext').innerText=saptext;

}

function callRest()
{
  access_token=sessionStorage.access_token;
  cleanUpElement(document.getElementById('userresult'));
  document.getElementById('btnGetUsersWithEmail').addEventListener('click', getUsersWithEmail);
  document.getElementById('btnGenerateSAPText').addEventListener('click', generateImport);
}

// Utility function to display a message for some number of seconds
