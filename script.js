const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random-btn'),
meals = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
singleMeal = document.getElementById('single-meal');


//search meal and fetch from api
function searchMeal(e){
    e.preventDefault();

    // clear single meal
    singleMeal.innerHTML = "";

    //Get search term
    const term = search.value;
    //console.log(term);

    //check if content is there
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h3>Search Results For "${term}"</h3>`;

            if(data.meals === null){
                resultHeading.innerHTML = "There Are No Results. Please Try Again";
            }else{
                meals.innerHTML = data.meals.map(meal=> 
                    `<div class="meal">

                    <div class="meal-info" data-mealID = "${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    </div>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                      
                        </div>`
                )
                .join("");
            }
        });
        search.value = "";
        //meals.appendChild(meals);
    }else{
        alert("Please Input Meal Or Keyword");
    }
}

function getMealById(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data =>
        {
            //console.log(data);
            const meal = data.meals[0];

            addToDOM(meal);
        })
}

function addToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }else{
            break;
        }
    }

    singleMeal.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt = "${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : "" }
                ${meal.strArea ? `<p>${meal.strArea}</p>` : "" }
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
                </ul>
            </div>
        </div>
    `
}

function randomMeal(){
    // clear meal and heading
    //console.log("working");
    meals.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addToDOM(meal);
    });
}

//event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);


meals.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
       // console.log(item);
       if (item.classList) {
           return item.classList.contains('meal-info');
       } else {
           return false;
       }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    } else {
    }
  
});


