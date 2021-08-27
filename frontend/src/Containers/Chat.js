import React from "react";
import Sidepanel from "./SidePanel/SidePanel";
import WebSocketInstance from "../websocket";


class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addmessasge.bind(this));
            WebSocketInstance.fetchMessages(this.props.currentUser);
        });
    }

    setMessages(messages) {
        this.setState({messages: messages.reverse()});
    }

    addmessasge(message) {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function() {
                if (WebSocketInstance.state() === 1) {
                    console.log("connection is secure");
                    callback();
                    return;
                }else {
                    console.log("waiting for connection....");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    changeMessagehandler = event => {
        this.setState({
            message: event.target.value
        });
    }

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            
        }
    }

    renderMessages = (messages) => {
        const currentUser = "admin";
        return messages.map(message => (
            <li
                key={message.id}
                className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>{message.content}</p>
            </li>
        ));
    }

    render(){
        const messages = this.state.messages;
        return(
            <div id="frame">
                <Sidepanel />
                <div className="content">
                <div className="contact-profile">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>username</p>
                    <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="messages">
                    <ul id="chat-log">
                        {
                            messages && this.renderMessages(messages)
                        }
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                        <input
                            onChange={this.changeMessagehandler}
                            value={this.state.message} 
                            id="chat-message-input" 
                            type="text" 
                            placeholder="Write your message..." />
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button id="chat-message-submit" className="submit">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                        </div>
                    </form>
                    
                </div>
                </div>
            </div>
        )
    }
}


export default Chat;

