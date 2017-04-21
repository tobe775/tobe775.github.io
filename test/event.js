$(window).on('load',function(){
    if(getRandomMovieUrl() === undefined){
        defaultSetMovie();
    }
    // Event
    document.getElementById('video').addEventListener("ended", updateState, false);
    document.getElementById('video').addEventListener("error", updateState, false);
    document.getElementById('video').addEventListener("waiting", updateState, false);
    document.getElementById('video').addEventListener("timeupdate", updateState, false);
    document.getElementById('video').volume = 0.5;
    
    // Youtube
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // テーブル作成
    createTable();
    // KeyboradEnvet
    keyboradEnvet();

    // Youtube設定
    player = new YT.Player('player', {
        playerVars: {
            autoplay: 1,
            controls: 1,
            showinfo: 0
        }
        ,events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });

    $.ajax({
        type: 'GET',
        url: 'http://www.youtube.com/get_video_info?video_id=2hLZLnWZelk',
        dataType: 'jsonp',
        jsonp: 'callback',//コールバックパラメータ名の指定
        //jsonpCallback: 'testCallback',//callback関数名を自分で指名した場合
    })
    .done(function(data){
        console.log("success");
            console.log(data);
            // $.each(data,function(i, item){
            //     $("#jsonp").append(item.formal  + ' <a href=" ' + item.url_pc + ' " target="_blank"> ' + item.url_pc +'</a><br />');
            // });
            
            /*
            for(var i=0; i < data.length; i++){
                $("#jsonp").append(data[i].formal  + ' <a href=" ' + data[i].url_pc + ' " target="_blank"> ' + data[i].url_pc +'</a><br />');
            }
            */
    })
    .fail(function(data){
        console.log("error");
            $("#jsonp").append("エラーです");
    });
});

function defaultSetMovie(){
    var movieList = [
        "http://ws.acgvideo.com/c/68/16239234-1-hd.mp4?wsTime=1492530217&platform=pc&wsSecret2=82a94b5f6706b91511f58639ff93e4f6&oi=1924520460&rate=1350"
        ,"http://s3.amazonaws.com/ksr/assets/016/297/835/984404f51db3a3d9c1e6ab61547ed34b_original.mp3?"
        ,"https://www.youtube.com/embed/2hLZLnWZelk?autoplay=1"
        ,"https://ia601505.us.archive.org/10/items/GuP05_201704/GuP05.mp4"
        ,"https://files.catbox.moe/ghz35z.mp3?"
        ,"https://nodefiles.com/vidembed-qdaka8v7uf4u.mp4"
        ,"http://www.indishare.com/mp3embed-v68501bjywo3.mp3?"
        ,"https://file.ac/llqc5lLKxLo/Warau-New_03.mp4"
    ];

    var count = 0;
    for (var startUrl of movieList){
        localStorage.setItem("start" + count.toString() + "_" + getDate(), startUrl);
        count++;
    }
}

// LocalStorage Save
function saveUrl(){
    var url = document.getElementById("urlTable").value;

    if (url.length === 0) {
       return; 
    }

    if (hasMovieUrl(url)) {
        url = searchUrl(url);
    } else {
        localStorage.setItem(getDate(), url);
    }

    // 再生変換    
    if (document.getElementById("urlLoad").checked) {
        playMovie(url);
    } 

    // テーブル作成
    createTable();
}

// local storege date delete
function reset(){
    while(localStorage.length != 0){
        localStorage.removeItem(localStorage.key(0));
    }
    defaultSetMovie();
    playMovie(getRandomMovieUrl());
    // テーブル作成
    createTable();
}

function hasMovieUrl(url){
    for (var i = 0; i < localStorage.length; i++) {
        if (getLocalStorageItemVal(i).indexOf(url) > -1){
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
    $("#movieTable tr").remove();

    for (var i = 0; i < localStorage.length; i++) {
        var cell = table.insertRow(-1).insertCell(-1);
        cell.innerText = getLocalStorageItemVal(i).split("?")[0];
    }
}

function playMovie(src){
    var title = document.getElementById('title');
    var video = document.getElementById('video');
    var youtube = document.getElementById('player');

    title.innerHTML = src;

    if(src.indexOf("youtu.be") > 0 || src.indexOf("www.youtube.com") > 0){
        var matchList = [
            "https://([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)/([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)/([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)[?]{0,1}"
            ,"https://([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)/watch\[?]{1}v=([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)"
            ,"https://youtu.be/([a-zA-Z0-9\-_\.:@!~*'\(¥);\+$,]+)"
        ];


        var cnt = 0;
        var youId = undefined;
        for (item in matchList) {
            var resultVal = src.match(matchList[item]);
            
            if (resultVal !== null) {
                if (cnt === 0) {
                    youId = resultVal[3];
                }
                else if (cnt === 1) {
                    youId = resultVal[2];
                }
                else if (cnt === 2) {
                    youId = resultVal[1];
                }
                break;
            }
            cnt++;
        }

        // URLの場合
        if (youId === undefined ){
             playMovie(getRandomMovieUrl());
        }
        
        // Video Start
        player.loadVideoById({
            'videoId': youId,
        });
        
        // None
        video.pause();
        video.style.display= "none";
        youtube.style.display = "block";
    } else {
        // Video Start
        video.src = src;
        video.play();

        // None
        player.stopVideo();
        youtube.style.display= "none"
        video.style.display = "block";
    }
}

/* 状態表示 */
function updateState(evt) {
	var t = "loadeddata";
    var video = document.getElementById("video");

    if( evt && evt.type ) {
		t = evt.type;
	}

	if( video.error ) {
        if (localStorage.length > 0) {
            console.log(video.error);
            console.log(document.getElementById('video').src);
            playMovie(getRandomMovieUrl());
        }
	} else if( t == "loadstart" ) {
	} else if( t == "loadeddata" ) {
	} else if( t == "play" ) {
	} else if( t == "playing" ) {
	} else if( t == "pause" ) {
	} else if( t == "ended" ) {
        playMovie(getRandomMovieUrl());
	} else if( t == "waiting" ) {
        console.log("waiting");
        video.currentTime = video.currentTime + 10.0;
        video.currentTime = video.currentTime - 10.0;
	} else if( t == "timeupdate" ){
        console.log("timeupdate " + video.currentTime.toString());
    }
}

function onPlayerReady(event) {
    initVolume();
    // Start Video
    playMovie(getRandomMovieUrl());
}

function initVolume(){
    // ボリューム制御
    player.setVolume(playerVol * 100);
    video.volume = playerVol;
}

function setVolume(addNum){
    
    playerVol += addNum;

    if (playerVol < 0){
        playerVol = 0;
    }
    else if (playerVol > 1){
        playerVol = 1;
    }

    player.setVolume(playerVol * 100);
    video.volume = playerVol;
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        playMovie(getRandomMovieUrl());
    }
}


function keyboradEnvet(){
    document.onkeydown = function(event) {
        var keyCode = false;
    
        if (event) {
            if (event.keyCode) {
                keyCode = event.keyCode;
            } else if (event.which) {
                keyCode = event.which;
            }
        }

        // Space Key
        if (keyCode === 32) {
            
        }
        else if (keyCode === 37 || keyCode === 39) {
             playMovie(getRandomMovieUrl());
        }
        else if (keyCode === 38) {
            // ボリュームアップ
            setVolume(playerAddVol);
        }
        else if (keyCode === 40) {
            // ボリュームダウン
            setVolume(-1 * playerAddVol);
        }

        console.log(keyCode);
    };
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