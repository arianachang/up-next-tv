//tvToday.js
//script for displaying TV shows airing today

//calculate today's date
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
const yyyy = today.getFullYear();
if(dd<10) { dd = '0'+dd; }
if(mm<10) { mm = '0'+mm; }
today = yyyy + '-' + mm + '-' + dd;

function main() {
	let page = 1;
	getMovieData(page);

	document.querySelector('#loadMore').addEventListener('click', (event) => {
		page++;
		getMovieData(page);
	});
}

function getMovieData(pg) {
	theMovieDb.tv.getAiringToday({page:pg}, (shows) => {
		let tvshows = JSON.parse(shows);
		showsArr = tvshows.results;
		showsArr.forEach((show) => {
			var id = show.id;
			theMovieDb.tv.getById({id}, (data) => {
				const s = JSON.parse(data);
				const curSeason = s.seasons[s.seasons.length-1].season_number;
				const numEps = s.seasons[s.seasons.length-1].episode_count;
				theMovieDb.tvSeasons.getById({id:id, season_number:curSeason}, (season) => {
					const szn = JSON.parse(season);
					let nextEp;
					for(let i=0; i<szn.episodes.length; i++) {
						let date = szn.episodes[i]["air_date"].split('-');
						if(Number(date[1]) >= Number(mm)) { //compare month
							if(Number(date[2]) >= Number(dd)) { //compare day
								nextEp = szn.episodes[i];
								break;
							}
						}
					}
					let epData = '<strong>' + s.name + '</strong> ' + curSeason + 'x' + nextEp["episode_number"] + ' airs today';
					let newDiv = document.createElement('div');
					newDiv.innerHTML = epData;
					newDiv.className = 'col-sm-4 col-md-3 text-center';
					newDiv.id = 'showBlock';
					
					let img = new Image();
					img.onload = () => { newDiv.appendChild(img); }
					img.src = 'https://image.tmdb.org/t/p/w185/' + s.poster_path;
					img.className = 'img-responsive center-block';
					document.querySelector('.row').appendChild(newDiv);
				}, (error) => {console.log(error)});
			}, (error) => {console.log(error)});
		});
	}, (error) => {console.log(error)});
}

document.addEventListener('DOMContentLoaded', main);