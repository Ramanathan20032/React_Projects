import { useEffect, useState } from 'react'
import { Button, InputGroup, EditableText, Toaster } from '@blueprintjs/core'
import './App.css'

const AppToaster = Toaster.create({
	position : 'top'
})

function App() {

	const [users, setUsers] = useState([]) // we Gonna get an Array of Objects from the API.
	// to handle new inputs through InputGroups
	const [newName, setNewName] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [newWebsite, setNewWebsite] = useState('')

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/users') // local api [Method : GET] (it will be the default method) getting from the server to read
		.then((response) => response.json())
		.then((data) => setUsers(data)) 
	},[]) // [] - to call the useEffect only one time, after the App() component called.


	// function for adding new User using POST (request method)
	function addUser(){
		// remove unwanted space before and after
		const name = newName.trim()
		const email = newEmail.trim()
		const website = newWebsite.trim()

		if(name && email && website){

			fetch('https://jsonplaceholder.typicode.com/users',
				{
					method : 'POST',   // To POST the data to the server.
					body : JSON.stringify({ 	// to send the data as a json format
						// In json object, it should have a key-value pair.
						// But, here (name, email, website) itself the [key : value]
						name, 
						email,
						website
					}),
					// details about the request that the sent are json.
					headers : {
						"content-type" : "application/json; charset=UTF-8" // [charset=UTF-8] for encoding purpose
					}
				}
				// after posted it we are updating the list
			).then((response) => response.json())
			.then((data) => {
				// new array, getting the previous (...)users data and updated data.
				setUsers([...users, data])
				// Toaster component - like pop-up 
				AppToaster.show({
					message : 'User Added Successfully',
					intent : 'Success',
					timeout : '3000'
				})
				setNewName('')
				setNewEmail('')
				setNewWebsite('')
			})
		}
	}

	// function to edit and change the value of email and website 
	function onchangeHandler(id, key, value){
		setUsers((users) => {						// changing the users with the function of setUsers
			return users.map((user) => {			// map function iterates over the each user.
				return user.id === id ? {...user, [key]: value} : user;		// if id == user.id then it retain the all feild in the user.id & change the particular field(website, email).
																			// else it retain the user data.
			})
		})
	}

	// function for updating the data of the user using PUT (request method)   PUT - /posts/1
	function updateUser(id){
		const user = users.find((user) => user.id === id);      // finding the particular user which is onclicked() 
		fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
			{
				method : 'PUT',
				body : JSON.stringify(user),
				headers : {
					"content-type" : "application/json; charset=UTF-8"
				}
			}
		).then((response) => response.json())
		.then((data) => {
			AppToaster.show({
				message : 'User Updated Successfully',
				intent : 'Success',
				timeout : '3000'
			})
		})
	}

	//function for deleting the data using DELETE (request method)  DELETE - /posts/1
	function deleteUser(id){
		fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
			{
				method : 'DELETE'
			}
		).then((response) => response.json())
		.then((data) => {
			setUsers((users) => {
				return users.filter((user) => user.id !== id)  // filter olone the data to be deleted based on the condition.
			})

			AppToaster.show({
				message : 'User Deleted Successfully',
				intent : 'Success',
				timeout : '3000'
			})
		})
	}

  return (
    <div className="app">
		<table className='bp4-html-table modifier'>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Email</th>
					<th>Website</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{/* note this is a list of array each element should have unique key to manipulate it in future */}
				{/* Rendering Data */}
				{users.map((user) => 		// The map function iterates over the users array and returns a table row (<tr>) for each user, ensuring each row has a unique key prop. 
            		<tr key={user.id}>						
              			<td>{user.id}</td>
						<td>{user.name}</td>
						{/* EditableText - To make the text Editable */}
						<td><EditableText value={user.email} onChange={(value) => onchangeHandler(user.id, 'email', value)}/></td>  
						{/* 
							while changing the text in EditableText tracked by onchange.
							The value which are changed are passed as parameter to function (onchangeHandler) and it has a three parameter. 
							To manipulate the particular user with [id], and feild that need to edited [key], and the value which is changed [value]. 
						*/}
						<td><EditableText value={user.website} onChange={(value) => onchangeHandler(user.id, 'website', value)}/></td>
						<td>
							<Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button> 
							&nbsp;
							<Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
						</td>
            		</tr>
				)}
			</tbody>
			<tfoot>
				<tr>
					<td></td>
					{/* new input for Name */}
					<td>
						{/* InputGroup - input tag */}
						<InputGroup
							value={newName}
							onChange={ (event) => setNewName(event.target.value) }
							placeholder='Enter Name...'
						/>
					</td>
					<td>
						<InputGroup
							value={newEmail}
							onChange={ (event) => setNewEmail(event.target.value) }
							placeholder='Enter Email...'
						/>
					</td>
					<td>
						<InputGroup
							value={newWebsite}
							onChange={ (event) => setNewWebsite(event.target.value) }
							placeholder='Enter Website...'
						/>
					</td>
					<td>
						{/* Button - button tag */}
						<Button intent='success' onClick={addUser}>
							Add User
						</Button>
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
  )
}

export default App;
