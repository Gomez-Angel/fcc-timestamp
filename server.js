var http=require('http');
var fs=require('fs');
var url = require('url');
var path = require('path');
var port = process.env.PORT || 15454;
var months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

var server=http.createServer(function(request, response){
    var filePath = './index.html';
    var contentType = 'text/html';
	fs.readFile(filePath,function(err, data){
	  if(err){
        response.writeHead(404);
        response.write("Not Found!");
        response.end(JSON.stringify(err));
      }
      else{
        var urlReq=url.parse(request.url, true);
	    response.writeHead(200, {'Content-Type': contentType});
	    response.write(data);
        response.end(JSON.stringify(checkUrl(urlReq)));
      }
	}); 
});

function checkUrl(urlReq){
	var unixDateTime, naturalDateTime;
	var obj=urlReq;
	var checkDate = obj.pathname;
	checkDate=checkDate.substr(1);//take off the slash "/"
    //check if it's unix time
    if((checkDate.length===10) && (/^\d+$/.test(checkDate))){//unix length is 10 and an integer
    	naturalDateTime=unixDate(checkDate);
    	return {'unix' : checkDate, 'natural' : naturalDateTime };
    }
    else if(checkDate.length>10){
    	naturalDateTime=naturalDate(checkDate);
    	console.log(naturalDateTime);
    	if(naturalDateTime!=null){
    		naturalDateTime=naturalDateTime[1] + " " + naturalDateTime[0] + "," + naturalDateTime[2];
    		unixDateTime=Date.parse(naturalDateTime)/1000;
    	    return {'unix' : unixDateTime, 'natural' : naturalDateTime };
    	}
    	else{
    	    return {'unix' : null, 'natural' : null};	
    	}
    }
    else{
    	return {'unix' : null, 'natural' : null};
    }
}

function unixDate(paramcheckDate)
{
	var date = new Date(paramcheckDate*1000);
	var year = date.getFullYear();
	var month = months[date.getMonth()];
	var day = date.getDate();

	var formattedDate = month + " " + day + ", " + year;
	return formattedDate;
}
function naturalDate(paramcheckDate){
    var datePart=[];
    //split the parameter, Month/Day/Year
    datePart=paramcheckDate.split('%20');
    var day=datePart[1];
    var month=datePart[0];
    var year=datePart[2];
    var dateIsCorrect=0; //if this equals 2, the date exist, is correct

    //make first letter of month uppercase
    month=month.charAt(0).toUpperCase() + month.substr(1).toLowerCase();
    //quit the comma from the day
    day=day.replace(/,/g, "");
    //check if month exist
    if(months.indexOf(month)>-1){
    	dateIsCorrect+=1;
    	//check if day es positive
    	if(day>0){
    		//check if day is correct for the month
    	    if((['January', 'March', 'May', 'July', 'August', 'October', 'December'].indexOf(month)>-1) && (day<=31)){
    		    dateIsCorrect+=1;
    	    }
    	    if((['April', 'June', 'September', 'November'].indexOf(month)>-1) && (day<=30)){
    		    dateIsCorrect+=1;
    	    }
    	    var leapYear=((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    	    if((month="February") && (leapYear===true) && (day<=29)){
    	    	dateIsCorrect+=1;
    	    }
    	    if((month="February") && (leapYear===false) && (day<=28)){
    	    	dateIsCorrect+=1;
    	    }
    	}
    }
    //if date is correct
    if(dateIsCorrect===2){
    	return [day,month,year];
    }
    else{
    	return null;
    }
}


// Listen on port 8080, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
//console.log(port);
console.log("Server running at "+ port);