$(window).on('load',function(){
    var url = getRandomMovieUrl();
    if(url === undefined){
        url = "http://203.130.55.101/ws.acgvideo.com/c/83/16358886-1-hd.mp4?wsTime=1492371389&platform=pc&wsSecret2=574a8fe3065e031c5155b609198ad90f&oi=1924520460&rate=1350&wshc_tag=0&wsts_tag=58f396b2&wsid_tag=72b5da0c&wsiphost=ipdbm";
    }
    playMovie(url);
});

function saveUrl(){
    var url =  document.getElementById("url").value;


    if (!checkUrl()) {
        return false;
    }
    
    // LocalStorage Save
    localStorage.setItem(getDate(),url);
    
    // Cookie Save 
    // $.cookie(getDate(), url, { expires: 365*5, path: './' });
    
    if(document.getElementById("urlLoad").checked){
        playMovie(url);
    } 
}

function checkUrl(url){
    for (var i = 0; i < localStorage.length; i++) {
        if (url === localStorage.key(i)){
            return false;
        }
    }
    return true;
}

function getRandomMovieUrl(){
    // cookie
    // var cookieItem = document.cookie.split(";");
    // if(cookieItem.length === 0){return;}
    // return cookieItem[getRandomArbitary(0,cookieItem.length)];

    // localstoge
    if(localStorage.length > 1){
        var key = localStorage.key(getRandomArbitary(1, localStorage.length));
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