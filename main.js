// It is defined to create object from.
// Technically there is no need for this (there is no point in here to populate
// this object from a JSON with exactly same structure as this).
class Result {
    constructor(name, gender, probability, count) {
        this.name = name;
        this.gender = gender;
        this.probability = probability;
        this.count = count;
    }
    toString() {
        return `${this.name}-${this.probability}`;
    }
}

// Global result object.
// It is defined to be used as "shared state" between function. (like Redux or Vuex)
let result = null;

// Validate name 
// length between 1 and 255
// only lowercase and uppercase english letters and spaces
function validate_form(name) {
    let reg_expr = /^[a-zA-Z ]{1,255}$/;
    return reg_expr.test(name);
}

// It is defined to clear all information that is displaying on screen, 
// after submitting a new name to lookup
function clear_results() {
    result = null; // clear shared state
    let result_gender = document.getElementById("result-gender");
    let result_probability = document.getElementById("result-probability");
    let radios = document.forms["name-form"]["gender"];
    let stored_gender = document.getElementById("stored-gender");
    let stored_probability = document.getElementById("stored-probability");

    for (var i = 0, iLen = radios.length; i < iLen; i++) {
        radios[i].checked = false;
    }
    result_gender.innerHTML = "";
    result_probability.innerHTML = "";
    stored_gender.innerHTML = "";
    stored_probability.innerHTML = "";
}

// It is defined to loading data from LocalStorage and show it on "stored-box", if exist.
function load_data(name) {
    let stored_data = window.localStorage.getItem(name);
    if (stored_data != null) {
        stored_data = JSON.parse(stored_data)
        // technically there is no need for below line
        // it is written, only because the same logic has became mandatory in
        // requirements (in fetching stage - using Object instead of json)
        let stored = new Result(stored_data["name"], stored_data["gender"], stored_data["probability"], stored_data["count"]);
        let stored_gender = document.getElementById("stored-gender");
        let stored_probability = document.getElementById("stored-probability");

        stored_gender.innerHTML = stored.gender;
        stored_probability.innerHTML = stored.probability;
    }
}

// It is defined to store form data in LocalStorage
// "gender" must be picked up from the radio buttons
// "name" is available in global "result" variable (it also can be picked up by document.GetElementByID from the form)
function store_data() {
    let selected_male = document.getElementById("male").checked;
    let selected_female = document.getElementById("female").checked;

    if (selected_male) data = new Result(result.name, "male", result.probability, result.count);
    else if (selected_female) data = new Result(result.name, "female", result.probability, result.count);
    else return;

    let key = result.name;
    window.localStorage.setItem(key, JSON.stringify(data));
    load_data(key);
}

// It is defined to clear data from LocalStorage
// Note: clear_results is used to clear screen, but this function is used to clear data from LocalStorage
// After clearing data, we must clear "saved answers" section to inform the user that operation has been done.
function clear_data() {
    let key = result.name;
    window.localStorage.removeItem(key);

    let stored_gender = document.getElementById("stored-gender");
    let stored_probability = document.getElementById("stored-probability");
    stored_gender.innerHTML = "";
    stored_probability.innerHTML = "";
}

// It is defined to fetch data from the API provider and populate the form with this data.
// Here the only thing that is going to be populated is gender radio button.
function fetch_data(name) {
    let endpoint = "https://api.genderize.io/";
    let url = `${endpoint}?name=${name}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data["gender"] != null) {
                result = new Result(data["name"], data["gender"], data["probability"], data["count"]);

                let result_gender = document.getElementById("result-gender");
                let result_probability = document.getElementById("result-probability");
                let radio = document.getElementById(result.gender);

                radio.checked = true;
                result_gender.innerHTML = result.gender;
                result_probability.innerHTML = result.probability;
            } else {
                console.log("sorry we cant find out what gender is this?");
            }
        })
        .catch((reason) => {
            console.log(reason);
        });
}

// Defines the flow of submitting data and displaying it on screen.
// Runs after submit button clicked.
async function submit_form(event) {
    try {
        clear_results();
        let name = document.forms["name-form"]["name"].value;
        if (validate_form(name)) {
            fetch_data(name);
            load_data(name);
        } else {
            console.log("please provide valid name");
        }
    } catch (e) {
        console.log(e);
    } finally {
        event.preventDefault();
    }
}
