import React from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            formValid: false,
            redirect: false
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
    }
    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        })
    }
    validateForm(){
        if(this.state.username.length > 0 &&this.state.password > 0 ){
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
        if(this.state.formValid === true){
            event.preventDefault();
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${this.state.username}&password=${this.state.password}`
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.isValid === true) {
                    localStorage.setItem('jwt', res.token);
                    this.setState({ redirect: true });

                  
                } else {
                    this.setState({ redirect: false });
                    alert('Invalid login credentials');
                }
            })
            .catch(error => console.error('Error:', error));
        }else{
            alert("Fill the username field or/and password field before submiting")
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.redirect !== this.state.redirect) {
          if(this.state.redirect === true){
            window.location.href = "/home"
          }
        }
      }
    render(){
    
    return(

        <div>
            
        <div className="login-items">

            <form onSubmit={this.handleSubmit} className="login-forms" action="/api/register" method="POST">
            <div className='form-input'>
                <h1>Login into an account:</h1>
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
export default Login
