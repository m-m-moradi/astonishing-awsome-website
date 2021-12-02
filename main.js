async function form_validation(event) {
    try {
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
                    let prediction_box = document.getElementById("prediction-box");
                    prediction_box.innerHTML = JSON.stringify(data);
                })
                .catch((reason) => {
                    console.log(reason);
                });
        } else {
            alert("please provide valid name");
        }
    } catch (e) {
        console.log(e);
    } finally {
        event.preventDefault();
    }
}
