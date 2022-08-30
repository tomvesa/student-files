
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
          gallery.appendChild(div);     
 }




  // running the code
  const gallery = document.getElementById("gallery");
  let usersAPIConfig = apiConfig("https://randomuser.me/api/1.4/", 
                            {results : 12, 
                            inc : "nat,name,location,email,picture",
                            nat : "us,gb,au,nz"} );
  
  makeApiCall(usersAPIConfig)
    .then(() => usersAPIConfig.data.forEach(item => createCard(item)));
