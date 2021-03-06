class WebSocketService{
    static instance = null;

    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    constructor() {
        this.socketRef = null;
    }

    connect(chatURL) {
//        const path = `ws://127.0.0.1:8000/ws/chat/${chatURL}/`;
//        const path = "ws://127.0.0.1:8000/ws/chat/"+chatURL;
        const first = "ws://127.0.0.1:8000/ws/chat/";
        const second = chatURL.toString();
        const third = "/";
        const final = second.concat(third);
        const path = first.concat(final);
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log("websocket open");
        };
        //this.socketNewMessage(JSON.stringify({
        //    command: "fetch_messages"
        //}))
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data);
        };
        this.socketRef.onerror = e => {
            console.log("error occurred");
        };
        this.socketRef.onclose = () => {
            console.log("socket close");
            this.connect();
        };
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if(Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command ==="messages") {
            this.callbacks[command](parsedData.messages);
        }
        if (command === "new_message") {
            this.callbacks[command](parsedData.message);
        }
    }

    fetchMessages(username, chatId) {
        this.sendMessage({
            command: "fetch_messages", 
            username: username,
            chatId: chatId
        });
    }

    newChatMessage(message) {
        this.sendMessage({
            command: "new_message", 
            from: message.from, 
            message: message.content,
            chatId: message.chatId
        });
    }

    addCallbacks(messagesCallback, newMessageCallback){
        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({ ...data }))
        }
        catch (error) {
            console.log(error.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }

    waitSocketConnection(callback) {
        const socket = this.socketRef;
        const recursion = this.waitSocketConnection;
        setTimeout(
            function() {
                if (socket.readyState === 1) {
                    console.log("connection is secure");
                    if (callback != null) {
                        callback();
                    }
                    return;
                }else {
                    console.log("waiting for connection....");
                    recursion(callback);
                }
            }, 1);
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
