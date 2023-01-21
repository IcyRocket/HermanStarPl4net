import React from 'react';



class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
    username: "",
    update: 0,
    messageList: [],
    messageField: "",
    messageSent: false,
    inputText: ""
  }
  this.handleMessageField = this.handleMessageField.bind(this)
  this.handleSubmitMessage = this.handleSubmitMessage.bind(this)
  }

  getUser(){
    let token = localStorage.getItem('jwt')
    fetch('/api/home', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `token=${token}`
  })
  .then(response => response.json())
  .then(data => {
    this.setState({data: data, update: 1});
    if(data.expired === true){
      localStorage.removeItem('jwt')
      window.location.href = "/"
    }else if( data.token.username){
      this.setState({username: data.token.username})
    }
    
  })
  .catch(error => console.error('Error:', error));
  
  } 
  handleMessageField(event){
    this.setState({
     inputText: event.target.value
    })
    console.log(this.state.messageList)
  }
  handleSubmitMessage(){
    this.setState({
      inputText: ""
    })
    fetch("/api/messages",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `username=${this.state.username}&message=${this.state.inputText}`
    })
    .then(res => res.json())
    .then(res => {
    })
  }
  fetchData(){
    fetch("/api/post_message")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message)
      this.setState({
        messageList: data.message
      })
    });
  }
  
  componentDidMount() {
    this.getUser();
    setInterval(() => this.fetchData(), 5000);  
  }
    
render(){
  return(
      <div className="body-home">
        <div className="chat-div">
          <h1>Chatbox</h1>
          <div>
            <h3>
              Du er logget inn som {this.state.username}!
            </h3>
            <div className="message-post">
            {this.state.messageList.map((items, index) =>(
                <p>
                  {items.username}: <br/>
                  {items.message}
                </p>
            ))}
            </div>
            <input value={this.state.inputText} onChange={this.handleMessageField}></input>
            <button onClick={this.handleSubmitMessage}>Send</button>
          </div>

        </div>
      </div>
  )
}
}

    export default Home;