$(function(){

	// csv,jsonの変換アルゴリズムはここから拝謝
	// http://jsfiddle.net/sturtevant/AZFvQ/
	function CSVToArray(strData, strDelimiter) {
	    // Check to see if the delimiter is defined. If not,
	    // then default to comma.
	    strDelimiter = (strDelimiter || ",");
	    // Create a regular expression to parse the CSV values.
	    var objPattern = new RegExp((
	    // Delimiters.
	    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	    // Quoted fields.
	    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	    // Standard fields.
	    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
	    // Create an array to hold our data. Give the array
	    // a default empty first row.
	    var arrData = [[]];
	    // Create an array to hold our individual pattern
	    // matching groups.
	    var arrMatches = null;
	    // Keep looping over the regular expression matches
	    // until we can no longer find a match.
	    while (arrMatches = objPattern.exec(strData)) {
	        // Get the delimiter that was found.
	        var strMatchedDelimiter = arrMatches[1];
	        // Check to see if the given delimiter has a length
	        // (is not the start of string) and if it matches
	        // field delimiter. If id does not, then we know
	        // that this delimiter is a row delimiter.
	        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
	            // Since we have reached a new row of data,
	            // add an empty row to our data array.
	            arrData.push([]);
	        }
	        // Now that we have our delimiter out of the way,
	        // let's check to see which kind of value we
	        // captured (quoted or unquoted).
	        if (arrMatches[2]) {
	            // We found a quoted value. When we capture
	            // this value, unescape any double quotes.
	            var strMatchedValue = arrMatches[2].replace(
	            new RegExp("\"\"", "g"), "\"");
	        } else {
	            // We found a non-quoted value.
	            var strMatchedValue = arrMatches[3];
	        }
	        // Now that we have our value string, let's add
	        // it to the data array.
	        arrData[arrData.length - 1].push(strMatchedValue);
	    }
	    // Return the parsed data.
	    return (arrData);
	}

	function CSV2JSON(csv) {
	    var array = CSVToArray(csv);
	    var objArray = [];
	    for (var i = 1; i < array.length; i++) {
	        objArray[i - 1] = {};
	        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
	            var key = array[0][k];
	            objArray[i - 1][key] = array[i][k]
	        }
	    }

	    var json = JSON.stringify(objArray);
	    // オブジェクトのままで使いたいのでstring変換をしない
	    // var str = json.replace(/},/g, "},\r\n");

	    return objArray;
	}

	function inTimeChanger(mytime){

		if(!mytime){
			mytime = '';
		}else{

			var _hourArr = mytime.split(':');
			var _hour = Number(_hourArr[0]);
			var _min = Number(_hourArr[1]);

			if( _min == 0 ) _min = '00';
			if( _min > 0 && _min < 15) _min = 15;
			if( _min > 15 && _min < 30 ) _min = 30;
			if( _min > 30 && _min < 45 ) _min = 45;
			if( _min > 45 ){
				_min = '00';
				_hour = _hour + 1;
			}

			mytime = _hour + ':' + _min;
		}

		return mytime;
	}


	function outTimeChanger(mytime){

		if(!mytime){
			mytime = '';
		}else{

			var _hourArr = mytime.split(':');
			var _hour = Number(_hourArr[0]);
			var _min = Number(_hourArr[1]);

			if( _min >= 0 && _min < 15) _min = '00';
			if( _min > 15 && _min < 30 ) _min = 15;
			if( _min > 30 && _min < 45 ) _min = 30;
			if( _min > 45 ) _min = '45';

			mytime = _hour + ':' + _min;
		}

		return mytime;
	}

	function getBreakTime(timeObj){
		var str = '';
		if( timeObj.出社時刻 && timeObj.退社時刻 ) str = '1:00';
		return str;
	}

	function convert(){

		var csv = $('#input').val();

		// csvが入力されたら処理を実行する
		if( csv ){

			var json = CSV2JSON(csv);

			// console.log(json);

			var inTimeStr = '';
			var outTimeStr = '';
			var breakTimeStr = '';

			for (var i = 0; i < json.length; i++) {
				console.log(json[i].退社時刻);
				var intime = json[i].出社時刻;
				var outtime = json[i].退社時刻;
				inTimeStr += inTimeChanger(intime) + "\r\n";
				outTimeStr += outTimeChanger(outtime) + "\r\n";
				breakTimeStr += getBreakTime(json[i]) + "\r\n";
			};

			$('#inhour').val(inTimeStr);
			$('#outtime').val(outTimeStr);
			$('#breaktime').val(breakTimeStr);

		}
	}

	$( "#btnConvert" ).on('click',function(e) {
		convert();
	});


});
