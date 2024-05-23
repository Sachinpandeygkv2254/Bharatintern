const login_button = document.querySelector(".container");
const login  = document.querySelector(".login-field"); 
const phone = document.querySelector("#phone");
const otp_field = document.querySelector("#otp");
const username_field = document.querySelector(".usernamePassword")


const admin = document.querySelector(".admin");
const user = document.querySelector(".user");
const owner = document.querySelector(".owner");
const nameProfile = document.querySelector(".name")
const roleProfile = document.querySelector(".role")
const phoneProfile = document.querySelector(".phoneProfile")
const operatorLogin = document.querySelector(".operatorLogin")

const userName = document.querySelector("#userName")
const userRole = document.querySelector("#userRole")
const userPhone = document.querySelector("#userPhone")


const ownerParkingName = document.querySelector("#parkingName")
const ownerPhone = document.querySelector("#operatorMobile")
const ownerUsername = document.querySelector("#operatorUserName")
const ownerPassword = document.querySelector("#operatorPassword")
const ownerCnfPassword = document.querySelector("#operatorCnfPassword")
const latitude = document.querySelector("#lati").innerText;
const longitude = document.querySelector("#long").innerText;

const button = document.getElementById('myButton');

let role;


if(localStorage.getItem("token"))
{
    const token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://192.168.151.24:3000/user/profile")
    .then(response =>  {
        login.classList.add("hide");
        const role = response.data.result.role;
        if( role === "admin" ) {
            admin.classList.add("show");
            showProfile(token)
            showAllUserDetails(token)
        }
        if( role === "user" ) {
            showUserDetails(token);
        }
        if( role === "owner" ) {
            owner.classList.add("show");
        }
    })
    .catch(err => console.log(err))
    
    
}

//in workin
function uploadPic(event)
{
    const file = event.target.files[0];
    console.log(event.target.files[0])
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    
    axios.post("http://192.168.151.24:3000/user/update-pic",  file , { headers: {
        'Content-Type': 'image/png'
      }}
       )
    .then(response => console.log(response))
    .catch(err => console.log(err))
}

function showAdminPanel()
{
    const username = document.querySelector("#user").value;
    const password = document.querySelector("#pass").value;
    
    const credentials = {
        username,
        password,
        "role":"admin",
        "phone": "NA"
    }

    axios.post("http://192.168.151.24:3000/login/admin", { credentials } )
    .then(response => {
        if(response.data.success)
        {
            const token = response.data.result.token
            username_field.classList.add("hide");
            localStorage.setItem("token", token);
            admin.classList.add("show");
            showProfile(token)
            showAllUserDetails(token)
        }
    })
    .catch(err => console.log(err))
}

function loginUser(userRole) {
    login.classList.add("hide");
    if(userRole === "admin")
    {
        username_field.classList.remove("hide");
    }
    else if(userRole === "user"){
        login_button.classList.add("show");
    }
    else{
        operatorLogin.classList.add("show")
    }
    role = userRole
}

function sendOtp() {  
    const userData = {
        role,
        "phone": phone.value
    }

    
    fetch('http://192.168.151.24:3000/login/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => console.log(response))
    .catch(err => console.log(err))
}

function showProfile(token)  {

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://192.168.151.24:3000/user/profile")
    .then(response => {
        nameProfile.innerHTML = convertTitleCase(response.data.result.name);
        roleProfile.innerHTML = convertTitleCase(response.data.result.role);
        phoneProfile.innerText = response.data.result.phone;
    })
    .catch(err => {
        console.log(err)
    })
}

function logout()
{
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    axios.get("http://192.168.151.24:3000/user/logout")
    .then(response => {
        if(response.data.success)  {
            localStorage.removeItem("token");
            location.reload();
        }
    })
    .catch(err => console.log(err))
}

function showAllUserDetails(token)
{
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://192.168.151.24:3000/admin/users")
    .then(response => {
        for(let i=0; i < response.data.result.length; i++ )
        {
            let name = response.data.result[i].name;
            const phone =  response.data.result[i].phone;
            const role =  response.data.result[i].role;
            const block =  response.data.result[i].block;
            const _id = response.data.result[i]._id;
            if(role === "owner") {
                name = response.data.result[i].parkingName;
            }

            addRow(_id, convertTitleCase(name), phone, convertTitleCase(role), block);
        }
    })
    .catch(err => console.log(err))
}

function showUserDetails(token) {
    user.classList.add("show");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get("http://192.168.151.24:3000/user/profile")
    .then(response => {
        userName.innerText = convertTitleCase(response.data.result.name);
        userRole.innerText = convertTitleCase(response.data.result.role);
        userPhone.innerText = response.data.result.phone;
    })
    .catch(err => {
        console.log(err)
    })
}

function verifyOTP() {     
    const userData = {
        role,
        "phone": phone.value,
        "otp": otp_field.value
    }

    axios.post('http://192.168.151.24:3000/login/verify-otp', userData)
    .then(response => {
        login_button.classList.add("hide");
        let token;
        if(response.data.success){
            token = response.data.result.token;
            localStorage.setItem("token",token)
        }
        showUserDetails(token);
    })
    .catch(err => console.log(err))
}

function blockUser(_id, block){
    axios.put("http://192.168.151.24:3000/admin/user",{_id, block})
    location.reload();
}


function addRow(_id, name, phone, role, block){
    const allUserTable = document.querySelector(".allUserTable")
    const row = document.createElement("div");
    const cell1 = document.createElement("p");
    const cell2 = document.createElement("p");
    const cell3 = document.createElement("p");
    const cell4Before = document.createElement("p")
    const cell4 = document.createElement("label");
    const cell4_1 = document.createElement("input");
    const cell4_2 = document.createElement("span");

    cell4.classList.add("slide-button")
    cell4_1.setAttribute("type","checkbox")
    cell4_1.className = "input";

    cell4_2.classList.add("slider")

    cell4.appendChild(cell4_1);
    cell4.appendChild(cell4_2);

    cell4Before.appendChild(cell4)

    cell1.innerText = name;
    cell2.innerText = phone;
    cell3.innerText = role;
    cell4_1.checked = block;

    cell1.classList.add("all-user-cell")
    cell2.classList.add("all-user-cell")
    cell3.classList.add("all-user-cell")
    cell4Before.classList.add("all-user-cell")
    

    row.appendChild(cell1)
    row.appendChild(cell2)
    row.appendChild(cell3)
    row.appendChild(cell4Before)

    row.classList.add("all-user-row")

    allUserTable.appendChild(row);

    row.setAttribute("onClick","userProfileData()")
    
    if(cell4_1.checked)
    {
        cell4_1.setAttribute("onClick",`blockUser("${_id}",false)`);
    }
    if(!cell4_1.checked)
    {
        cell4_1.setAttribute("onClick",`blockUser("${_id}",true)`)
    }
}

//in working
function userProfileData()
{
    // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    // axios.get("http://192.168.151.24:3000/user/profile")
    // .then(response => console.log(response.data))
    // .catch(err => console.log(err))
    console.log("clicked")
}


function convertTitleCase(input) {
    const arr = input.split(" ");
    for( let i=0; i < arr.length; i++)
    {
        arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1);
    }
    const output = arr.join(" ");
    return output;
}

function entryOwner(){
    if( ownerPassword.value ===  ownerCnfPassword.value) {
        const data = {
            parkingName: ownerParkingName.value,
            phone: ownerPhone.value,
            username: ownerUsername.value,
            password: ownerPassword.value,
            latitude,
            longitude,
            "role": "owner"
        }

        axios.post("http://192.168.151.24:3000/owner/registration", data)
        .then(response => console.log(response))
        .catch(err => console.log(err))
    }else  {
        alert("Password and Confirm Password do not match")
    }   
}




