var ActorData = {};
var MovieData = {};

const copyObject = dict => {
    return JSON.parse(JSON.stringify(dict));
}

const getActorData = _ => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ActorData = JSON.parse(this.responseText);
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
        }
    };
    xmlhttp.open("GET","getMovies.php",true);
    xmlhttp.send();
}

const actorFormValidation = form => {
    let fname = form.elements[0].value;
    let lname = form.elements[1].value;
    let valid = new RegExp("^[a-zA-Z]+$");
    if(!valid.test(fname) || !valid.test(lname)) {
        alert('The actor form contains invalid information');
        return false;
    }
    
    if(ActorData[fname + " " + lname] != undefined) {
        alert('Actor already exists');
        return false;
    }

    alert('Added actor');

    return true;
}

const movieFormValidation = form => {
    let validName = new RegExp("^[a-zA-Z ]+$");
    let validNumber = new RegExp("^[0-9.]+$");

    let mvTitle = form.elements[0].value;
    let mvPrice = form.elements[1].value;
    let mvYear = form.elements[2].value;
    let mvGenre = form.elements[3].value;
    let fname = form.elements[4].value;
    let lname = form.elements[5].value;

    var isValid = validName.test(mvTitle) && validName.test(mvGenre)
    && validName.test(fname) && validName.test(lname) && validNumber.test(mvPrice)
    && validNumber.test(mvYear);

    if(!isValid) {
        alert('The movie form contains invalid information');
        return false;
    }
    
    if(MovieData[mvTitle] != undefined) {
        alert('Movie already exists');
        return false;
    }

    if(ActorData[fname + " " + lname] == undefined) {
        console.log(ActorData);
        alert('Actor doesn\'t exists');
        return false;
    }

    alert('Added movie');

    return true;
}

window.onload = _ => {
    getMovieData();
    getActorData();
};