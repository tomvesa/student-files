//create a search input field
function renderSearchField(target){
const searchField = document.createElement("FORM");
      searchField.innerHTML = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
                                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`
      
      target.append(searchField);
}

// api call configuration
const apiConfig = (url, query={}, data=[]) =>({
            url, 
            query,
            data,
          });

// API call functions
  function createQueryString(queryObject){
    // input object with query string items key:value
    // return query string from all items in the string
    // example "seed=teamtreehouse&results=12"
    let queryArr = Object.entries(queryObject);
  
    return queryArr.reduce((acc, item, index) =>{
                    // if index>0 prefix with "&"
                    if(index){
                    acc += `&${item[0]}=${item[1]}`;
                    }else{
                    // first item starts without "&"  
                        acc += `${item[0]}=${item[1]}`
                    }
                return acc.replace(" ", "%20") //replace all spaces
                }, "");
  } 

  async function makeApiCall(config){
    const response = await fetch(`${config.url}?${createQueryString(config.query)}`)
                            .catch(error => displayErrorMessage(error, gallery));
    const json = await response.json();
    return config.data = json.results;
  }

  function displayErrorMessage(error, messageTarget){
    console.log("Something went wrong! " , error)
    messageTarget.innerHTML = `<h2>OOPS, SOMETHING WENT WRONG!</h2>`;
  }
  
 function createCard(userData){
   let {
        picture: {thumbnail : avatar} ,
        name : {first : firstName,
                last : lastName},
        email,
        location: {city,
                   country},
        index 

                } = userData;
   const div = document.createElement("DIV");
          div.className = "card";
          div.dataset.index = index;
          div.innerHTML =   `<div class="card-img-container">
                                <img class="card-img" src="${avatar}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                                <p class="card-text">${email}</p>
                                <p class="card-text cap">${city}, ${country}</p>
                            </div> `;
          div.addEventListener("click", (e)=>{
            displayModal(userData);
 
          });                  
          gallery.appendChild(div);     
 }

 function displayModal(userData){
  let {// deconstruct user data
        email,
        cell,
        index,
        picture : {medium : avatar} ,
        name    : {first : firstName,
                    last : lastName},
        location: {city,
                  country,
                  postcode,
                  street:{number :streetNum, 
                            name:streetName}
                  },
        dob : {date : dobDate}
                                              } = userData;

    const div = document.createElement("DIV");
          div.className = "modal-container";
          div.dataset.index = index;
          div.innerHTML = `<div class="modal">
              <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
              <div class="modal-info-container">
                  <img class="modal-img" src="${avatar}" alt="profile picture">
                  <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                  <p class="modal-text">${email}</p>
                  <p class="modal-text cap">${city}</p>
                  <hr>
                  <p class="modal-text">${cell}</p>
                  <p class="modal-text"> ${streetNum} ${streetName}, ${city}, ${postcode}</p>
                  <p class="modal-text">Birthday: ${getDobDate(dobDate)}</p>
              <div class="modal-btn-container">                  
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
              </div>
              </div>`;

              body.appendChild(div);

          closeModal(div);
          getPreviousCard(index);
          getNextCard(index);




 }

 function closeModal(elem){
      const closeBtn = elem.querySelector("#modal-close-btn");
          closeBtn.addEventListener("click", e=>{
            closeBtn.parentElement.parentElement.remove();
          })
 }

 function getNextCard(index){
  //add listener to a next button
  // check visible cards and decide what is the next card to display
  const currentCardIndex = index;
        const nextBtn = document.getElementById('modal-next');
               nextBtn.addEventListener("click", e =>{
                //first check all card that are visible
                const visibleCardIndexes = [...document.querySelectorAll(".card:not(.card-invisible)")]
                                                .map(item => parseInt(item.dataset.index));
                // get the index of this card out of those currently visible, then get next visible card data
                // to display another modal                                 
                const nowVisibleCardIndex = parseInt(visibleCardIndexes.indexOf(index));
                if(nowVisibleCardIndex < visibleCardIndexes.length - 1 ){                               
                  document.querySelector('.modal-container').remove();
                  const  nextCardIndex = visibleCardIndexes.indexOf(currentCardIndex) + 1;
                  const nextCardData = usersAPIConfig.data.find(item => item.index === visibleCardIndexes[nextCardIndex]);
                displayModal(nextCardData);
                }
        });
      
}

 function getPreviousCard(index){
    //add listener to a previous button
  // check visible cards and decide what is the previous card to display
  const currentCardIndex = index;
        const prevBtn = document.querySelector('#modal-prev');
               prevBtn.addEventListener("click", e =>{
      //first check all card that are visible
                const visibleCardIndexes = [...document.querySelectorAll(".card:not(.card-invisible)")]
                                                .map(item => parseInt(item.dataset.index));
    // get the index of this card out of those currently visible, then get previous visible card data
      // to display another modal                                           
                const nowVisibleCardIndex = parseInt(visibleCardIndexes.indexOf(index));
                if(nowVisibleCardIndex){                               
                document.querySelector('.modal-container').remove();
              const  prevCardIndex = visibleCardIndexes.indexOf(currentCardIndex) - 1;
                const prevCardData = usersAPIConfig.data.find(item => item.index === visibleCardIndexes[prevCardIndex]);
                displayModal(prevCardData);

                }
        });
      
}

function getDobDate(date){
      // render date to display in mm/dd/yyyy
    const dob = new Date(date);
    let month = dob.getMonth() + 1;
    return `${month >= 10 ? month : `0${month}` } / ${dob.getDate()} /${dob.getFullYear()}`; 
}

function searchingUser(){
  // search input funtionality after clicking the search button
const searchBtn = document.getElementById("search-submit");
searchBtn.addEventListener("click", e=>{
  e.preventDefault();
   const searchValue = document.getElementById("search-input").value.toLowerCase();
// add class to hide cards that do not match the search value of the name
   usersAPIConfig.data.forEach( item => {
    const card = document.querySelector(`[data-index="${item.index}"]`);    
          const {first: firstName, last : lastName} = item.name;  
          const fullName = `${firstName} ${lastName}` 
            if(fullName.toLowerCase()
                              .includes(searchValue)){
                        card.classList.remove("card-invisible");
            } else {
                        card.classList.add("card-invisible");
            }
    });
});


}  // running the code
  const body = document.body;
  const searchBox = document.querySelector(".search-container")
  const gallery = document.getElementById("gallery");

  renderSearchField(searchBox);
  let usersAPIConfig = apiConfig("https://randomuser.me/api/1.4/", 
                            {results : 12, 
                            inc : "nat,name,location,email,picture,dob,cell",
                            nat : "us,gb,au,nz"} );
  
  makeApiCall(usersAPIConfig)
    .then(() => {
                  usersAPIConfig.data.forEach((item, index) => {
                            item.index = index;
                            createCard(item)});
                            searchingUser(); // load searching functionality
                });
  

