$(window).on('load',function(){
    var url = getRandomMovieUrl();
    if(url === undefined){
        url = "http://203.130.55.101/ws.acgvideo.com/c/83/16358886-1-hd.mp4?wsTime=1492371389&platform=pc&wsSecret2=574a8fe3065e031c5155b609198ad90f&oi=1924520460&rate=1350&wshc_tag=0&wsts_tag=58f396b2&wsid_tag=72b5da0c&wsiphost=ipdbm";
        localStorage.setItem("start0_" + getDate(), url);
        url = "http://ws.acgvideo.com/8/52/16358887-1-hd.mp4?wsTime=1492373620&platform=pc&wsSecret2=0ba8e3a7a19c4666566c79c3878b4f4a&oi=1924520460&rate=1350"
        localStorage.setItem("start1_" + getDate(), url);
    }
    
    playMovie(url);
    document.getElementById('video').addEventListener("ended", updateState, true);
});

function saveUrl(){
    var url = document.getElementById("url").value;


    if (hasMovieUrl(url)) {
    } else {
        // LocalStorage Save
        localStorage.setItem(getDate(), url);
    }

    // 再生変換    
    if (document.getElementById("urlLoad").checked) {
        playMovie(url);
    } 
}

function hasMovieUrl(url){
    for (var i = 0; i < localStorage.length; i++) {
        if (url === localStorage.key(i)){
            return true;
        }
    }
    return false;
}

function getRandomMovieUrl(){
    // localstoge
    if(localStorage.length > 0){
        var key = localStorage.key(getRandomArbitary(0, localStorage.length));
        return localStorage.getItem(key);
    }
}

function getRandomArbitary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function playMovie(src){
    var video = document.getElementById('video');
    video.src = src;
    video.play();
}

/* 状態表示 */
function updateState(evt) {
    alert("updateState");
	var msg = "";
	var t = "loadeddata";
	if( evt && evt.type ) {
		t = evt.type;
	}
	if( video.error ) {
	} else if( t == "loadstart" ) {
	} else if( t == "loadeddata" ) {
	} else if( t == "play" ) {
	} else if( t == "playing" ) {
	} else if( t == "pause" ) {
	} else if( t == "ended" ) {
        document.getElementById('video').src = getRandomMovieUrl();
        document.getElementById('video').play();
	} else if( t == "waiting" ) {
	}
}

function getDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    return "a" + year + "" + month + "" + day + "" + hh + "" + mm + "" + ss;
}