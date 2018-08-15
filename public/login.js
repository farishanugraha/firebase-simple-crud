document.getElementById('loginBtn').addEventListener('click', loginHandler)

function loginHandler(){
	const addUserInputsUI = document.getElementsByClassName("user-input");

	// this object will hold the new user information
	let loginData = {};

	// loop through View to get the data for the model 
	for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

		let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		loginData[key] = value;
	}

	console.log(loginData)

	firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
	.then(function() {
		console.log('signin success')
		window.location = '/'
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