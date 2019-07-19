
var graph_url = "https://graph.microsoft.com/v1.0/";
var graph_url_groups = "https://graph.microsoft.com/v1.0/groups/";
var graph_url_users = "https://graph.microsoft.com/v1.0/users";
var CDTGroups = [
  {"Name":"MaerskPortal-InternalAccessPackage (Test)","Env":"CDT", "id" :"997432aa-f3ae-4d41-9805-ac5ca58900e0", "type":"package","displayclass":" active" },
  {"Name":"MaerskPortal-BasicCustomer (Test)","Env":"CDT", "id" :"4d76288a-e8a5-4346-a9c6-87c2cbb64f8e", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Booking (Test)","Env":"CDT", "id" :"e2e00652-061e-4fa4-96bd-7ba5774f955b", "type":"included","displayclass":" disabled  ml-4 " },
  {"Name":"MaerskPortal-ContractRate (Test)","Env":"CDT", "id" :"e78ebbe0-d929-4e7a-920f-8af450f7c24e", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Documentation(Test)","Env":"CDT", "id" :"cbd38137-ac70-471a-816d-d61a4b080ec6", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-ImportCSA (Test)","Env":"CDT", "id" :"bf79f984-e51a-494f-bf2c-8046b62ed3e0", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-Invoices (Test)","Env":"CDT", "id" :"081e09ad-f10f-4c8c-a857-0927f74f948c", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-SelectAnyCustomer (Test)","Env":"CDT", "id" :"5caad941-0fdf-4eb6-b863-6c205e7a7aa4", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-WBOLApprover (Test)","Env":"CDT", "id" :"6e62dcf0-d3ca-48a5-b228-3a970b066e3c", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-CSOPAdmin (Test)","Env":"CDT", "id" :"19661dfa-7af5-4d8b-819b-5f47a569e79b", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPApprover (Test)","Env":"CDT", "id" :"7b1903f5-c808-407e-ae9d-fb2c26754b4a", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPAgent (Test)","Env":"CDT", "id" :"1b328de8-0a77-448c-96e6-2363d0566db9", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CHBAdmin (Test)","Env":"CDT", "id" :"78ccaed4-9628-40bb-959a-351629a0e523", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-MilitaryBooking (Test)","Env":"CDT", "id" :"50a8c1ed-ebdc-432d-aa3f-3ac1c3a4c24e", "type":"additional","displayclass":" active " },
  {"Name":"MaerskPortal-NotificationsAdmin (Test)","Env":"CDT", "id" :"6d4c52b1-e865-4018-ac64-4f491dfa4cb9", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-OfficeAccess (Test)","Env":"CDT", "id" :"27fde6bb-8103-4c48-a36f-12bf5773884b", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-BackofficeAdmin (Test)","Env":"CDT", "id" :"2bf297ad-af10-4287-843b-2a42f1fc8058", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-WBOLPrinter (Test)","Env":"CDT", "id" :"1f622b07-1f50-4fb6-9e4a-b76f5564fddc", "type":"additional","displayclass":" active " },
  {"Name":"MaerskPortal-RCMInternal (Test)","Env":"CDT", "id" :"4b6b193c-e407-4fc3-9ae2-631cef8256e3", "type":"additional","displayclass":" active " }
];

var STAGEGroups = [
  {"Name":"MaerskPortal-InternalAccessPackage (Stage)","Env":"STAGE", "id" :"1cbe15a4-e810-4572-8c4e-b2303b4ecf99", "type":"package","displayclass":" active " },
  {"Name":"MaerskPortal-BasicCustomer (Stage)","Env":"STAGE", "id" :"fff3031e-8c60-445f-a862-d3f9221fd8f4", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Booking (Stage)","Env":"STAGE", "id" :"fd837951-9ffc-4623-9fb6-8d35f8d4c22d", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-ContractRate (Stage)","Env":"STAGE", "id" :"a5fe066a-142d-4dfb-b82d-bb9672d1da2e", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Documentation (Stage)","Env":"STAGE", "id" :"63a79798-3321-4816-8739-435bb0ad0849", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-ImportCSA (Stage)","Env":"STAGE", "id" :"60d8066a-ea75-40dd-b30c-185d8ad575bb", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-Invoices (Stage)","Env":"STAGE", "id" :"69b0e245-40e9-43c0-a04f-9f30535b83ed", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-SelectAnyCustomer (Stage)","Env":"STAGE", "id" :"e40a8b6c-8daf-4428-8b14-42d6c83a0828", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-WBOLApprover (Stage)","Env":"STAGE", "id" :"8cd99a55-0e0c-4ae0-85f3-dbc829c72708", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-CSOPAdmin (Stage)","Env":"STAGE", "id" :"1e841727-4d04-46f0-9ced-6d24c161617d", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPApprover (Stage)","Env":"STAGE", "id" :"0ca558c4-5ad4-404a-bf66-33701188b8e1", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPAgent (Stage)","Env":"STAGE", "id" :"04ae6554-d863-403a-83e7-12db27e5ae2c", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CHBAdmin (Stage)","Env":"STAGE", "id" :"90abf3b2-b182-403a-9622-5457f15cc795", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-MilitaryBooking (Stage)","Env":"STAGE", "id" :"f9b1df25-0fd2-4322-8e4c-f1b627b75476", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-NotificationsAdmin (Stage)","Env":"STAGE", "id" :"c088ff8a-a945-443f-9a65-055e23e70389", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-OfficeAccess (Stage)","Env":"STAGE", "id" :"ee1802ee-afe7-45e2-9d5e-67be200488fa", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-BackofficeAdmin (Stage)","Env":"STAGE", "id" :"b2219c53-c10c-4572-aeb2-f2d4e817abb8", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-WBOLPrinter (Stage)","Env":"STAGE", "id" :"2f0c6116-f429-4ead-a151-53ad7f42f96a", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-RCMInternal (Stage)","Env":"STAGE", "id" :"1f34ea7c-edfc-48f4-9467-14196ad32f79", "type":"additional","displayclass":" active  " }
];

var PRODGroups = [
  {"Name":"MaerskPortal-InternalAccessPackage (Prod)","Env":"PRODUCTION", "id" :"fd64f48a-f4c2-45fd-b3da-9cbcf42e79d5", "type":"package","displayclass":" active " },
  {"Name":"MaerskPortal-BasicCustomer (Prod)","Env":"PRODUCTION", "id" :"3b288542-22ae-4cee-affb-36a491904308", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Booking (Prod)","Env":"PRODUCTION", "id" :"d04fca92-4c5c-4026-bd91-b26239d4b23b", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-ContractRate (Prod)","Env":"PRODUCTION", "id" :"f5b596ac-084f-485c-91b7-c996cc053ddb", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-Documentation (Prod)","Env":"PRODUCTION", "id" :"ef757b3f-7960-4de9-91bf-c9e47fa3a750", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-ImportCSA (Prod)","Env":"PRODUCTION", "id" :"2acc3b2e-4e60-46cc-ae08-1ad0674a3de4", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-Invoices (Prod)","Env":"PRODUCTION", "id" :"75504d36-c7fd-43e1-b685-13343b018023", "type":"included","displayclass":" disabled ml-4  " },
  {"Name":"MaerskPortal-SelectAnyCustomer (Prod)","Env":"PRODUCTION", "id" :"febec376-67d7-4ffc-a902-425e0ece9800", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-WBOLApprover (Prod)","Env":"PRODUCTION", "id" :"8dfdeca6-4886-49c2-8954-1b5b559258d9", "type":"included","displayclass":" disabled ml-4 " },
  {"Name":"MaerskPortal-CSOPAdmin (Prod)","Env":"PRODUCTION", "id" :"96e4499a-649f-4f32-b6ed-1cbd0c630654", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPApprover (Prod)","Env":"PRODUCTION", "id" :"8bd288cc-a8f9-41f2-93d3-ee0b6c7bb0e4", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CSOPAgent (Prod)","Env":"PRODUCTION", "id" :"a0dbf80f-ea88-456d-88cd-0cc952938162", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-CHBAdmin (Prod)","Env":"PRODUCTION", "id" :"a8d5c63e-1be4-4ca4-a84a-dbbd13b81065", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-MilitaryBooking (Prod)","Env":"PRODUCTION", "id" :"abfe6748-5753-44a7-9077-25f8b1dd5556", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-NotificationsAdmin (Prod)","Env":"PRODUCTION", "id" :"a2561fd8-bb1a-4e9c-b010-cb4844c42f5c", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-OfficeAccess (Prod)","Env":"PRODUCTION", "id" :"4bd0fac7-fe95-413d-8b0c-0341c345dc78", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-BackofficeAdmin (Prod)","Env":"PRODUCTION", "id" :"79cfe0c0-698f-4213-8a23-66c17a4c2603", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-WBOLPrinter (Prod)","Env":"PRODUCTION", "id" :"d36f7db7-21c5-45dd-9556-0c5ae3ce08c6", "type":"additional","displayclass":" active  " },
  {"Name":"MaerskPortal-RCMInternal (Prod)","Env":"PRODUCTION", "id" :"c321af97-f625-47b0-a412-c7bd07bc4135", "type":"additional","displayclass":" active  " }
];

var ownedgroups=[];
var currentEnvGroups=[];
var currentEnv='';
var currentPkgGroup='';

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

function cleanUpElement(element)
{
  //console.log(" inside cleanup " +element);
  while (element.firstChild)
  {
    //console.log("removing "+element.firstChild);
    element.firstChild.remove();
  }
}

function getMyOwnedGroups()
{
  getOwnedGroups('me');
}

function getOwnedGroups(userid)
{
  url=userid+'/ownedObjects?$select=id,displayName';
  ownedgroups = [];
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
        //console.log(ownedgroups);
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

function checkIfGroupOwner(groupid,userid)
{
  url= groupid + "/owners" ;
  var apiXMLReq = new XMLHttpRequest();
  apiXMLReq.onreadystatechange = function() {
    if (this.readyState == 4)
    {
      if (this.status == 200)
      {
        res = JSON.parse(apiXMLReq.responseText).value;
        owners=[];
        for (i=0; i< res.length; i++)
        {
          owners.push(res[i].id);
        }
        //console.log(owners);
        if (owners.includes(userid))
        {
          cn = document.getElementById(groupid).className;
          document.getElementById(groupid).className=cn.replace("btn-secondary","btn-success");
        }
      }
      else if (this.status == 401)
      {
        responseJson = JSON.parse(apiXMLReq.responseText);
        handle401(responseJson);
        return false;
      }
    }
  };
  apiXMLReq.open("GET", graph_url_groups + url , true );
  apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
  apiXMLReq.send(null);

}



  function handle401(responseJson)
  {
    msg = responseJson.error.code ;
    msg = msg+ " - " + responseJson.error.message ;
    msg = msg+ " <BR> Click <a href='index.html'> here </a> to Login" ;
    showMsgNSecs('alert-danger',msg, 10);
  }

  function showMsgNSecs (alertclass, message, numsecs)
  {
    document.getElementById('message').className = "alert "+alertclass;
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style = 'visibility:visible';

    setTimeout(function(){
      document.getElementById('message').style = 'visibility:hidden';
    }, numsecs*1000);
  }
