
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
    const response = await fetch(`${config.url}?${createQueryString(config.query)}`);
    const json = await response.json();
    return config.data = json.results;
  }
  
 function createCard(userData){
   let {
        picture: {thumbnail : avatar} ,
        name : {first : firstName,
                last : lastName},
        email,
        location: {city,
                   country}

                } = userData;
   const div = document.createElement("DIV");
          div.className = "card";
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
  let {
    email,
    cell,
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
              </div>`;

          body.appendChild(div);

          closeModal();

 }

 function closeModal(){
    const closeBtn = document.getElementById("modal-close-btn");
          closeBtn.addEventListener("click", e=>{
            closeBtn.parentElement.parentElement.remove();
          })
 }

function getDobDate(date){
    const dob = new Date(date);
    let month = dob.getMonth() + 1;

    return `${month >= 10 ? month : `0${month}` } / ${dob.getDate()} /${dob.getFullYear()}`; 
}


  // running the code
  const body = document.body;
  const gallery = document.getElementById("gallery");
  let usersAPIConfig = apiConfig("https://randomuser.me/api/1.4/", 
                            {results : 12, 
                            inc : "nat,name,location,email,picture,dob,cell",
                            nat : "us,gb,au,nz"} );
  
  makeApiCall(usersAPIConfig)
    .then(() => usersAPIConfig.data.forEach(item => createCard(item)));

