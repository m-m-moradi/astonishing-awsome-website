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

function clear_form() {
    result = null;
    let result_gender = document.getElementById("result-gender");
    let result_probability = document.getElementById("result-probability");
    let radios = document.forms["name-form"]["gender"];
    let saved_gender = document.getElementById("saved-gender");
    let saved_probability = document.getElementById("saved-probability");

    for (var i = 0, iLen = radios.length; i < iLen; i++) {
        radios[i].checked = false;
    }
    result_gender.innerHTML = "";
    result_probability.innerHTML = "";
    saved_gender.innerHTML = "";
    saved_probability.innerHTML = "";
}

function load_data(name) {
    let saved_data = JSON.parse(window.localStorage.getItem(name));
    if (saved_data != null) {
        let saved = new Result(saved_data["name"], saved_data["gender"], saved_data["probability"], saved_data["count"]);
        let saved_gender = document.getElementById("saved-gender");
        let saved_probability = document.getElementById("saved-probability");
        saved_gender.innerHTML = saved.gender;
        saved_probability.innerHTML = saved.probability;
    }
}

let result = null;
async function submit_form(event) {
    try {
        clear_form();
        let name = document.forms["name-form"]["name"].value;
        let endpoint = "https://api.genderize.io/";

        let reg_expr = /^[a-zA-Z ]{1,255}$/;
        if (reg_expr.test(name)) {
            let url = `${endpoint}?name=${name}`;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data["gender"] != null) {
                        let result_gender = document.getElementById("result-gender");
                        let result_probability = document.getElementById("result-probability");
                        result = new Result(data["name"], data["gender"], data["probability"], data["count"]);

                        let radio_button = (document.getElementById(result.gender).checked = true);
                        result_gender.innerHTML = result.gender;
                        result_probability.innerHTML = result.probability;
                    } else {
                        alert("sorry we cant find out what gender is this?");
                    }
                })
                .catch((reason) => {
                    alert(reason);
                });

            load_data(name);
        } else {
            alert("please provide valid name");
        }
    } catch (e) {
        alert(e);
    } finally {
        event.preventDefault();
    }
}

function save_data() {
    let selected_male = document.getElementById("male").checked;
    let selected_female = document.getElementById("female").checked;

    if (selected_male) data = new Result(result.name, "male", result.probability, result.count);
    else if (selected_female) data = new Result(result.name, "female", result.probability, result.count);
    else return;

    let key = result.name;
    window.localStorage.setItem(key, JSON.stringify(data));
    load_data(key)
}
