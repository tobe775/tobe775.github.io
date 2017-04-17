$(window).on('load',function(){
    var url = getRandomMovieUrl();
    if(url === undefined){
        var movieList = [
            "http://ws.acgvideo.com/5/8f/16324689-1-hd.mp4?wsTime=1492383152&platform=pc&wsSecret2=26f5d985ec487472675fb4973462c344&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/b/c2/16324690-1-hd.mp4?wsTime=1492383205&platform=pc&wsSecret2=a521625c54518089225fbf89315c0bb6&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/c/68/16239234-1-hd.mp4?wsTime=1492382425&platform=pc&wsSecret2=1c7e92793842b5257d8f4bf4d95a4672&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/6/5e/16239418-1-hd.mp4?wsTime=1492382482&platform=pc&wsSecret2=135fc75eb6639505c39e9ebb82a5d5d3&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/d/d8/15957515-1-hd.mp4?wsTime=1492385470&platform=pc&wsSecret2=7f604d83e0b1cdeb8bbe3411d418b4c8&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/d/70/15537449-1-hd.mp4?wsTime=1492385782&platform=pc&wsSecret2=f79cbc5635745e7e688c32a3244299a6&oi=1924520460&rate=1350"
            ,"http://ws.acgvideo.com/6/bc/15940645-1-hd.mp4?wsTime=1492392952&platform=pc&wsSecret2=fca3479fed902f09f479905a66ca556c&oi=1924520460&rate=1350"

        ];

        var count = 0;
        for (var startUrl of movieList){
            localStorage.setItem("start" + count.toString() + "_" + getDate(), startUrl);
            count++;
        }
    }
    // Event
    document.getElementById('video').addEventListener("ended", updateState, false);
    document.getElementById('video').addEventListener("error", updateState, false);
    document.getElementById('video').addEventListener("waiting", updateState, false);
    document.getElementById('video').addEventListener("timeupdate", updateState, false);
    
    // Video
    playMovie(url);
    createTable();
});

// LocalStorage Save
function saveUrl(){
    var url = document.getElementById("url").value;

    if (hasMovieUrl(url)) {
        url = searchUrl(url);
    } else {
        localStorage.setItem(getDate(), url);
    }

    // 再生変換    
    if (document.getElementById("urlLoad").checked) {
        playMovie(url);
    } 
}

function hasMovieUrl(url){
    for (var i = 0; i < localStorage.length; i++) {
        if (getLocalStorageItemVal(i).indexOf(url) > 0){
            return true;
        }
    }
    return false;
}

function searchUrl(hint){
    for (var i = 0; i < localStorage.length; i++) {
        var src = getLocalStorageItemVal(i);
        if (src.indexOf(hint) > 0){
            return src; 
        }
    }
}

function getRandomMovieUrl(){
    // localstoge
    if(localStorage.length > 0){
        return getLocalStorageItemVal(getRandomArbitary(0, localStorage.length))
    }
}

function getRandomArbitary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function getLocalStorageItemVal(index){
    return localStorage.getItem(localStorage.key(index));
}

function createTable(){
    var table = document.getElementById("movieTable");

    for (var i = 0; i < localStorage.length; i++) {
        var cell = table.insertRow(-1).insertCell(-1);
        cell.innerText = getLocalStorageItemVal(i).split("?")[0];
    }
}

function playMovie(src){
    var title = document.getElementById('title');
    var video = document.getElementById('video');
    
    title.innerHTML = src;

    video.src = src;
    video.play();
}

/* 状態表示 */
function updateState(evt) {
	var t = "loadeddata";
    var video = document.getElementById("video");

    if( evt && evt.type ) {
		t = evt.type;
	}

	if( video.error ) {
        console.log(video.error);
        console.log(document.getElementById('video').src);
        playMovie(getRandomMovieUrl());
	} else if( t == "loadstart" ) {
	} else if( t == "loadeddata" ) {
	} else if( t == "play" ) {
	} else if( t == "playing" ) {
	} else if( t == "pause" ) {
	} else if( t == "ended" ) {
        playMovie(getRandomMovieUrl());
	} else if( t == "waiting" ) {
        console.log("waiting");
        video.currentTime = video.currentTime + 5.0;
        video.currentTime = video.currentTime - 5.0;
        // video.currentTime = video.currentTime - 1.0;
	} else if( t == "timeupdate" ){
        console.log("timeupdate " + video.currentTime.toString());
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