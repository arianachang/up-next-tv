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
	theMovieDb.tv.getOnTheAir({page:pg}, (shows) => {
		const tvshows = JSON.parse(shows);
		const showsArr = tvshows.results;
		showsArr.forEach((show) => {
			let id = show.id;
			theMovieDb.tv.getById({id}, (data) => {
				let s = JSON.parse(data);
				let curSeason = s.seasons[s.seasons.length-1].season_number;
				let numEps = s.seasons[s.seasons.length-1].episode_count;
				theMovieDb.tvSeasons.getById({id:id, season_number:curSeason}, (season) => {
					let szn = JSON.parse(season);
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

					//fetch episode data & add to page
					const epData = '<strong>' + s.name + '</strong> ' + curSeason + 'x' + nextEp["episode_number"] + ' airs on ' + nextEp["air_date"];
					const newDiv = document.createElement('div');
					newDiv.id = s.name;
					newDiv.innerHTML = epData;
					newDiv.className = 'col-sm-4 col-md-3 text-center';
					newDiv.id = 'showBlock';

					//add to my shows button
					const chkbx = createCheckbox(id);
					newDiv.appendChild(chkbx);

					//collect image data
					const imgDiv = document.createElement('div');
					imgDiv.className = 'hovereffect';
					
					const imgMask = document.createElement('div');
					imgMask.id = 'imgMask';

					const img = new Image();
					img.onload = () => {
						imgMask.appendChild(img);
						imgDiv.appendChild(imgMask);
						newDiv.appendChild(imgDiv); }
					img.src = 'https://image.tmdb.org/t/p/w185/' + s.poster_path;
					img.className = 'img-responsive center-block';
					img.onclick = () => {
						//toggle checkbox selection
						document.getElementById(id).checked = !document.getElementById(id).checked;
						imgMask.classList.toggle('overlay');
					};

					document.querySelector('.row').appendChild(newDiv);
				}, (error) => {console.log(error)});
			}, (error) => {console.log(error)});
		});
	}, (error) => {console.log(error)});
}

function createCheckbox(id) {
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.name = 'tv';
	checkbox.id = id;
	checkbox.value = id;
	checkbox.className = 'hidden';

	return checkbox;
}

document.addEventListener('DOMContentLoaded', main);