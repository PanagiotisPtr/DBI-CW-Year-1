var ActorData = {};

var MovieData = {};

const onMobile = _ => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const copyObject = dict => {
    return JSON.parse(JSON.stringify(dict));
}

const listToItems = list => {
    let rv = ``;
    for(let i = 0; i < list.length; i++)
        rv += `<li>${list[i]}</li>`;
    return rv;
}

const dictionaryToItems = dict => {
    let keys = Object.keys(dict);
    let rv = ``;
    for(item in keys) {
        for(let key in item) {
            rv += `<li>${keys[item]}: ${dict[keys[item]]}</li>`;
        }
        rv += `\n`;
    }
    return rv;
}

const makeActorItem = (actor, movies, idx) => {
    return `
    <div id="actorList">
    <li class="CardItem actorItem">
        <div class="Header" id="header_${idx}">
            <div style="float: left;">${actor}</div>
            <a href='#' id="delete_${idx}"><div class="Button" style="float: right;">x</div></a>
            <a href='#' id="expand_${idx}"><div class="Button" style="float: right;">expand</div></a>
        </div>
        <div id="details_${idx}" class="Details invisible">
            Movies
            <ul>
                ${listToItems(movies)}
            </ul>
        </div>
    </li>
    </div>
    `;
}

const makeMovieItem = (movieName, details, idx) => {
    return `
    <div id="movieList">
    <li class="CardItem movieItem">
        <div class="Header" id="headerMovie_${idx}">
            <div style="float: left;">${movieName}</div>
            <a href='#' id="deleteMovie_${idx}"><div class="Button" style="float: right;">x</div></a>
            <a href='#' id="expandMovie_${idx}"><div class="Button" style="float: right;">expand</div></a>
        </div>
        <div id="detailsMovie_${idx}" class="Details invisible">
            Details
            <ul>
                ${dictionaryToItems(details)}
            </ul>
        </div>
    </li>
    </div>
    `;
}

const renderActors = data => {
    var i = 0;
    let searchBar = `<input type="text" class="SearchBar" id="actorSearch" placeholder="Search...">`;
    document.getElementById('ActorTable').innerHTML += searchBar;
    for(let actorName in data)
        document.getElementById('ActorTable')
            .innerHTML += makeActorItem(actorName, data[actorName], i++);
}

const renderMovies = data => {
    var i = 0;
    let searchBar = `<input type="text" class="SearchBar" id="movieSearch" placeholder="Search...">`;
    document.getElementById('MovieTable').innerHTML += searchBar;
    for(let movieName in data)
        document.getElementById('MovieTable')
            .innerHTML += makeMovieItem(movieName, data[movieName], i++);
}

const updateActors = data => {
    let items = document.getElementsByClassName('actorItem');
    while(items[0])
        items[0].parentNode.removeChild(items[0]);
    let i = 0;
    for(let actorName in data) {
        document.getElementById('actorList')
            .innerHTML += makeActorItem(actorName, data[actorName], i++);
    }
    linkButtons(data);
}

const updateMovies = data => {
    let items = document.getElementsByClassName('movieItem');
    while(items[0])
        items[0].parentNode.removeChild(items[0]);
    let i = 0;
    for(let movieName in data)
        document.getElementById('movieList')
            .innerHTML += makeMovieItem(movieName, data[movieName], i++);
    linkButtonsMovie(data);
}

const linkActorSearch = data => {
    document.querySelector(`#actorSearch`).addEventListener('input', _ => {
        let results = copyObject(data);
        let searchTerm = document.querySelector(`#actorSearch`).value;
        toRemove = Object.keys(results).filter(val => !val.toUpperCase().startsWith(searchTerm.toUpperCase()));
        for(let i = 0; i < toRemove.length; i++)
            delete results[toRemove[i]];
        updateActors(results);
    });
}

const linkMovieSearch = data => {
    document.querySelector(`#movieSearch`).addEventListener('input', _ => {
        let results = copyObject(data);
        let searchTerm = document.querySelector(`#movieSearch`).value;
        toRemove = Object.keys(results).filter(val => !val.toUpperCase().startsWith(searchTerm.toUpperCase()));
        for(let i = 0; i < toRemove.length; i++)
            delete results[toRemove[i]];
        updateMovies(results);
    });
}

const linkButtons = data => {
    for(let i = 0; i < Object.keys(data).length; i++) {
        let num_lines = 1 + data[Object.keys(data)[i]].length;
        document.querySelector(`#expand_${i}`).addEventListener('click', _ => {
            let height = document.querySelector(`#details_${i}`).clientHeight;
            let new_height = height == 0 ? num_lines * 3 : 0;
            if(onMobile())
                new_height *= 2;
            document.querySelector(`#details_${i}`).classList.toggle('invisible');
            document.querySelector(`#details_${i}`).setAttribute('style', 'height: ' + new_height + 'vw');
            document.querySelector(`#header_${i}`).classList.toggle('expand');
        });

        document.querySelector(`#delete_${i}`).addEventListener('click', _ => {
            if(ActorData[Object.keys(data)[i]].length != 0) {
                alert('This actor is still related to some movies. Remove those movies first and try again');
                return;
            }
            let actorName = Object.keys(data)[i];
            delete ActorData[Object.keys(data)[i]];
            updateActors(ActorData);
            document.querySelector(`#actorSearch`).value = '';
            deleteActorRequest(actorName);
        });
    }
}

const linkButtonsMovie = data => {
    for(let i = 0; i < Object.keys(data).length; i++) {
        let num_lines = 1 + Object.keys(data[Object.keys(data)[i]]).length;
        document.querySelector(`#expandMovie_${i}`).addEventListener('click', _ => {
            let height = document.querySelector(`#detailsMovie_${i}`).clientHeight;
            let new_height = height == 0 ? num_lines * 3 : 0;
            if(onMobile())
                new_height *= 2;
            document.querySelector(`#detailsMovie_${i}`).classList.toggle('invisible');
            document.querySelector(`#detailsMovie_${i}`).setAttribute('style', 'height: ' + new_height + 'vw');
            document.querySelector(`#headerMovie_${i}`).classList.toggle('expand');
        });

        document.querySelector(`#deleteMovie_${i}`).addEventListener('click', _ => {
            let movieName = Object.keys(data)[i];
            delete MovieData[Object.keys(data)[i]];
            updateMovies(MovieData);
            document.querySelector(`#movieSearch`).value = '';
            deleteMovieRequest(movieName);
        });
    }
}

const getActorData = _ => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ActorData = JSON.parse(this.responseText);
            initActors();
        }
    };
    xmlhttp.open("GET","getActors.php",true);
    xmlhttp.send();
}

const getMovieData = _ => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            MovieData = JSON.parse(this.responseText);
            initMovies();
        }
    };
    xmlhttp.open("GET","getMovies.php",true);
    xmlhttp.send();
}

const deleteActorRequest = actorName => {
    let actForm = document.createElement('form');
    actForm.action = 'deleteActor.php';
    actForm.method = 'POST';

    let data = document.createElement('input');
    data.type = 'hidden';
    data.name = 'actName';
    data.value = actorName;

    actForm.appendChild(data);
    document.getElementById('JShook').appendChild(actForm);
    actForm.submit();
}

const deleteMovieRequest = movieName => {
    let mvForm = document.createElement('form');
    mvForm.action = 'deleteMovie.php';
    mvForm.method = 'POST';

    let data = document.createElement('input');
    data.type = 'hidden';
    data.name = 'mvName';
    data.value = movieName;

    mvForm.appendChild(data);
    document.getElementById('JShook').appendChild(mvForm);
    mvForm.submit();
}

const initActors = _ => {
    renderActors(ActorData);
    linkButtons(ActorData);
    linkActorSearch(ActorData);
}

const initMovies = _ => {
    renderMovies(MovieData);
    linkButtonsMovie(MovieData);
    linkMovieSearch(MovieData);
}

window.onload = _ => {
    getActorData();
    getMovieData();
};