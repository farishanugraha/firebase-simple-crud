document.getElementById('registerBtn').addEventListener('click', registerUser)

function registerUser(){
	const addUserInputsUI = document.getElementsByClassName("user-input");

	// this object will hold the new user information
	let newUser = {};

	// loop through View to get the data for the model 
	for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

		let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		newUser[key] = value;
	}

	console.log(newUser)

	firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
	.then(function() {
		console.log('register success')
	})
	.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if(errorCode || errorMessage){
			console.log(errorCode, errorMessage)
		}
		// ...
	});
}