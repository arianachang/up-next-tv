//tvToday.js
//script for handling upcoming TV shows

function main() {
	//get movie data
	const req = new XMLHttpRequest();
	const url = "https://api.themoviedb.org/3/tv/on_the_air?api_key=f37fe7539ba050a16ea23fd7d0e5685d&language=en-US&page=1"
	req.open('GET', url, true);
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {
			const shows = JSON.parse(req.responseText);
			console.log(shows);
			let str = '';
			shows.results.forEach(function(show) {
				str += '<li><strong>' + show.name + '</strong>: ' + show.overview + '</li>';
			});
			const tvTable = document.querySelector('#tvshows');
			tvTable.innerHTML = str;
		}
	});
	req.addEventListener('error', function(e) {
		console.log(e);
	});
	req.send();
}

document.addEventListener('DOMContentLoaded', main);
