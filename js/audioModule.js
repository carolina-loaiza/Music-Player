(function(window, undefined){
	//Inicial settings
	var audio = undefined;
	var loop = false;
	var volumeSlider = undefined;
	var durationElement = undefined;
	var currentTimeElement = undefined;
	var currentTrackNumber = 0;
	var playlistLength;
  var playlistTitle;
	var fullSong;
	var details;
	var tracks;

	//html elements
	var btnPlayPause = document.getElementById('btnPlayPause');
	var infoArtist = document.getElementById('info-artist');
	var toggleMuted = document.getElementById('toggleMuted');
	var coverholder = document.getElementById('album_cover');
	var smallCover = document.getElementById('photo');
  var playlist = document.getElementById('playlist');
  var seekbar = document.getElementById('seekbar');

  //call for the playlist
  function apiCall(playlistID){
    $.ajax({
      type:'GET',
      url: 'http://api.deezer.com/playlist/'+playlistID+'?output=jsonp',
      dataType:'jsonp',

      success: function(data) {
        tracks = data.tracks.data;
        playlistTitle = data.title;
        playlistGenerator(tracks);
      },

      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }

	function init(){
		audio = document.createElement('audio');
		audio.setAttribute('src', '#.mp3');
				
		// volume slider
		volumeSlider = document.getElementById("volumeSlider");
		volumeSlider.addEventListener("change", setVolume, false);

		audio.durationchange = duration;
		durationElement = document.getElementById('duration');
		currentTimeElement = document.getElementById('currentTime');

		// audio events
		audio.addEventListener('durationchange', setDuration);
		audio.addEventListener('timeupdate', setCurrentTime);
    audio.addEventListener("timeupdate", progressBar, true);
		setCurrentTime();
	};

	//Play-Pause button toggle
	btnPlayPause.addEventListener('click', function(){
		//barRun(fullSong);
		if(audio.paused || audio.ended){
			audio.play();
			btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
		}else{
			audio.pause();
			btnPlayPause.innerHTML = "<i class='fa fa-play'></i>";
		}	
	});


	//Playable list generator
	function playlistGenerator(tracks){ 
		var listContainer = "<h3>"+playlistTitle+" <button onclick='player.apiCall(1242984263)'>New Playlist</button></h3><ul>";
		var listNumber = 0;

    for(var i = 0; i < 15; i++){
      listNumber ++;
      listContainer+= 
      "<li class='playlist-item' onclick='player.trackPlayer(" +listNumber+ ")'>"+
      "<span class='playlist-id' >" +listNumber+ "</span>"+
      "<p class='playlist-song'>"+tracks[i].title+ "</p>"+
      "<span class='playlist-time'>" +transform(tracks[i].duration)+ "</span>"+
      "<p class='playlist-artist'>" +tracks[i].artist.name+ "</p>"
      "</li>";
    }
    listContainer += "</ul>";
    document.getElementById('playlist').innerHTML = listContainer;
    playlistLength = listNumber;

    trackDataDisplayer(tracks, 1);
	};

	function showList(){
		playlist.classList.toggle('clicked');
		document.getElementById("photo").classList.toggle('reset_position');
	};

	//song click player
	function trackPlayer(id){
		currentTrackNumber = id;
		trackDataDisplayer(tracks, currentTrackNumber);
		btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
		audio.play();
	};

	function trackDataDisplayer(tracks, position){
		id = position-1;
		details = 
			"<div class='photo' id='photo'style='background-image:url("+ tracks[id].album.cover_big +")'></div>"+
			"<p class='name-song'>" + tracks[id].title + "</p>"+
			"<p class='name-artist'>" + tracks[id].artist.name +"</p>"+
			"<p class='name-album'>" + tracks[id].album.title + "</p>";

		infoArtist.innerHTML = details;
		coverholder.style.backgroundImage = "url("+tracks[id].album.cover_big+")";
		audio.setAttribute('src', tracks[id].preview);
	};

	//Next track player on click
	function nextTrack(){
		currentTrackNumber = getNextTrackNum(currentTrackNumber);
		trackDataDisplayer(tracks, currentTrackNumber);
		btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
		audio.play();
	};
	
	function getNextTrackNum(currTrackNum){
		currTrackNum++;
		if(currTrackNum == playlistLength+1){
			currTrackNum = 1;
		}
		return currTrackNum;
	};

	//Previous track player on click
	function previousTrack(){
		currentTrackNumber = getPreviousTrackNum(currentTrackNumber);
		trackDataDisplayer(tracks, currentTrackNumber);
		btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
		audio.play();
	};

	function getPreviousTrackNum(currTrack){
		currTrack--;
		if(currTrack == 0){
			currTrack = playlistLength;
		}
		return currTrack;
	};

	function muted(){
		if(audio.muted = !audio.muted){
			toggleMuted.innerHTML = "<i class='fa fa-volume-off'>";
		}else{
			toggleMuted.innerHTML = "<i class='fa fa-volume-up'>";
		}
	};

	function setVolume(){
		audio.volume = volumeSlider.value / 100;
	};

	function progressBar() { 
    seekbar.setAttribute("value", playingSong / fullSong);
  }

	function setDuration(){
		fullSong = Math.floor(audio.duration);
		durationElement.innerHTML = " / "+transform(fullSong);
	};

	function setCurrentTime(){
		playingSong = Math.floor(audio.currentTime);
		currentTimeElement.innerHTML = transform(playingSong);
	};

	function transform(secondsRaw){
		var minutes = Math.floor(secondsRaw / 60);
		var seconds = secondsRaw - minutes * 60;
		seconds = seconds.toString();
		if( seconds.length == 1 ){
			seconds = "0"+seconds;
		}else{
			false;
		}
		return minutes+" : "+seconds;
	};

	function repeatSong(button){
		loop = !loop;
		if(loop){
			audio.setAttribute('loop', '');
			button.classList.add('active');
		}else{
			audio.removeAttribute('loop');
			button.classList.remove('active');
		};
	};

	function resetSong(button){
		audio.load();
		audio.play();
		currentTimeElement.innerHTML = '0 : 00';
	};

	// Javascript Class using Revealing Module Pattern
	window.Player = function(){
    apiCall(923312155);
		init();
		// Revealing Module Pattern
		return {
      apiCall: apiCall,
			muted: muted,
			setVolume: setVolume,
			trackPlayer:trackPlayer,
			next: nextTrack,
			previous: previousTrack,
			showList:showList,
			repeatSong: repeatSong,
			resetSong: resetSong
		};
	}
})(window, undefined);