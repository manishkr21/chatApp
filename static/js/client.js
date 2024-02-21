const socket = io("http://localhost:8000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
var audio = new Audio('static/source/ting.mp3');

const append = (message,position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement)
    if(position == 'left'){
        audio.play();
    }
    
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();    // page does not reload
    const message = messageInput.value;
    const up_message = `you: ${message}`;
    
    console.log(up_message);
    append(up_message,'right');
    socket.emit('send', message);
    messageInput.value = '';

})

const name1 = prompt("Enter your name to join");
socket.emit('new-user-joined', name1);

socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right')
})

socket.on('receive', data=>{
    // const message = data.message;
    // const updated_message = `${data.name}: ${message}`;
    append(`${data.name}: ${data.message}`, 'left');
})

socket.on('left', name=>{
    append(`${name} : left the chat`, 'left');
})
