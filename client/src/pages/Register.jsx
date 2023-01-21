import React from 'react'



class Register extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            formValid: false
        }
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.validateForm = this.validateForm.bind(this)
    }
    handleUserNameChange(event){
        this.setState({
            username: event.target.value,
        })
        this.validateForm()
    }
    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        })
        this.validateForm()
    }
    validateForm(){
        if(this.state.username.length > 0 &&this.state.password.length > 0 ){
            this.setState({
                formValid: true
            })
        }else{
            this.setState({
                formValid: false
            })
        }
    }
    handleSubmit(event){
        event.preventDefault()
        if(this.state.formValid === true){
            event.preventDefault();
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${this.state.username}&password=${this.state.password}`
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if(res.isValid === true){

                    window.location.href = "/"
                }
                else{
                    alert("Username already in use")
                }
            }) 
        }
    }
    render(){
    return(
        <div>
            <div className="login-items">
                <form onSubmit={this.handleSubmit} className="login-forms" action="/api/register" method="POST">
                <div className='form-input'>
                <h1>Register an account:</h1>
                    <h2>Username:</h2>
                    <input value={this.state.username} onChange={this.handleUserNameChange} name='username'/>
                </div>
                <div className="form-input">
                    <h2>Password:</h2>
                    <input value={this.state.password} onChange={this.handlePasswordChange} name='password' type='password'/>
                </div>
                <div>
                    <button onClick={this.validateForm} tyoe="submit" className="login-button">Submit</button>
                </div>
                </form>
            </div>
        </div>
    )
    }
}
export default Register