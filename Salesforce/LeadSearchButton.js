{!REQUIRESCRIPT("/soap/ajax/24.0/connection.js")}
var retURL = parent.location.href;
/* Collect lead info we need */
var id = "{!Lead.Id}";
var fullName = "{!Lead.Full_Name__c}"; 
var firstName = "{!Lead.FirstName}";
var lastName = "{!Lead.LastName}";
var phone = "{!Lead.Stripped_Phone__c}";
var email = "{!Lead.Email}";

/* Build Query */
var query = [];                                                                 //  Array will contain one member for each query parameter.
    if (fullName !== null) { query.push(fullName); }                            //  Full name should always have value since last name is req'd
    if (firstName !== null && lastName !== null) {                              //  If firstname & lastname are present, use first 4 chars of each, append a * to each, and space between.
        query.push(firstName.slice(0,4) + '* ' + lastName.slice(0,4) + '*');
        } else if (lastName !== null) {                                         //  If firstname is blank, use first four of lastname, append a star
            query.push(lastName.slice(0,4) + '*'); }
    if (phone.length > 0) {
        query.push( phone );}
    if (phone.length >= 7) {                                                    //  Only search phone if it's full 7 digits
        query.push( phone.slice(phone.length-7,phone.length) );}
    if (email.length > 0) {        query.push(email);     }                       //  If email present, add to query
    query = query.join(' OR ');                                                 //  Join each query element with " OR " 

/* Build search URL */
var searchURL = parent.location.origin;                                         //  Gives us the instance name so we don't accidently break if changed.
    searchURL += "/_ui/common/search/client/ui/UnifiedSearchResults";
	searchURL += "?sen=001&sen=003&sen=00U&sen=a0H&sen=00Q&sen=00T&str=";       //  sen= filters objects searched, uses object prefix as param value, str= query string

if (searchURL+query !== null) {
    window.open(searchURL + query);
}

/* Start creating object to update field */
var a = new sforce.SObject("Lead");                                             //	Initialize Account Object
a.Id = "{!Lead.Id}";                                                            //	Giving Id of Current Account to the object
a.searched_dupes__c = true;                                                     //  Set value to true since button was clicked.

sforce.connection.update([a]);                                                  //	Update Records in the array to database

parent.location.href=retURL;                                                    //  Reload page so user can continue.