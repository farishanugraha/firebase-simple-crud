// Initialize Firebase
var config = {
	apiKey: "AIzaSyDcWPal33LFLDOqFyP2CUxx_H5BpBP8l0Q",
	authDomain: "practice-164701.firebaseapp.com",
	databaseURL: "https://practice-164701.firebaseio.com",
	projectId: "practice-164701",
	storageBucket: "practice-164701.appspot.com",
	messagingSenderId: "377461018133"
};
firebase.initializeApp(config);

// Get Database & Collection
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
const userListUI = document.getElementById("userList");

// Read Data
document.getElementById('loading').style.display = 'block'
var count = 1;
userListUI.innerHTML = '';
usersRef.on("child_added", snap => {
	let user = snap.val();
	let $li = document.createElement("li");
	$li.innerHTML = user.name;

	// edit icon
	let editIconUI = document.createElement("span");
	editIconUI.class = "edit-user";
	editIconUI.innerHTML = " ✎";
	editIconUI.setAttribute("userid", snap.key);
	editIconUI.addEventListener("click", editButtonClicked)
	$li.append(editIconUI);

	// delete icon
	let deleteIconUI = document.createElement("span");
	deleteIconUI.class = "delete-user";
	deleteIconUI.innerHTML = " ☓";
	deleteIconUI.setAttribute("userid", snap.key);
	deleteIconUI.addEventListener("click", deleteButtonClicked)
	$li.append(deleteIconUI)
	
	$li.setAttribute("child-key", snap.key); 
	$li.addEventListener("click", userClicked)

	userListUI.append($li);

	count++;
	if(count === snap.numChildren()){
		document.getElementById('loading').style.display = 'none'
	}
});

function userClicked(e) {
	var userID = e.target.getAttribute("child-key");

	const userRef = dbRef.child('users/' + userID);

	const userDetailUI = document.getElementById("userDetail");
	userDetailUI.innerHTML = ""

	userRef.on("child_added", snap => {
		var $p = document.createElement("p");
		$p.innerHTML = snap.key + " - " + snap.val()
		userDetailUI.append($p);
	});
}

function editButtonClicked(e){
	document.getElementById('edit-user-module').style.display = "block";
	//set user id to the hidden input field
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");
	
	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));

	// set data to the user field
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	userRef.on("value", snap => {
		if(snap){
			for(var i = 0, len = editUserInputsUI.length; i < len; i++) {
				var key = editUserInputsUI[i].getAttribute("data-key");
				editUserInputsUI[i].value = snap.val()[key];
			}
		}
	});
}

function deleteButtonClicked(e) {
	e.stopPropagation();
	const userID = e.target.getAttribute("userid");
	const userRef = dbRef.child('users/' + userID);
	userRef.remove()

	window.location.reload();
}

// Update Data
const saveBtn = document.querySelector("#edit-user-btn");
saveBtn.addEventListener("click", saveUserBtnClicked)

function saveUserBtnClicked(){
	const userID = document.querySelector(".edit-userid").value;
	const userRef = dbRef.child('users/' + userID);
	var editedUserObject = {}
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
		editedUserObject[textField.getAttribute("data-key")] = textField.value
	});

	console.log(editedUserObject)

	userRef.update(editedUserObject, function(){
		console.log("user has been updated"); 
		document.getElementById('edit-user-module').style.display = "none";
	});

	window.location.reload();
}

// Write Data
const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked);

function addUserBtnClicked(){
	const addUserInputsUI = document.getElementsByClassName("user-input");

	// this object will hold the new user information
	let newUser = {};

	// loop through View to get the data for the model 
	for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

		let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		newUser[key] = value;
	}

	// Push to database
	usersRef.push(newUser, function(){
		console.log("data has been inserted");
	})
}