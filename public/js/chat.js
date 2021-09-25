const socket = io() 

//Elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML

socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate)
    $messages.insertAdjacentHTML('beforeend', html)

})

document.querySelector('#message-form').addEventListener('submit',(e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    //disable

    //const message = document.querySelector('input').value  <--becoz name has been added to input form taking advantage of that
    const message = e.target.elements.message.value

    socket.emit('sendMessage',message, (error) => {
        // console.log('The message was delievered!',message)
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        //enable 
         
        if(error) {
            return console.log(error)
        }  

        console.log("Message delivered!")
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude: position.coords.longitude

        },() => {
            $sendLocationButton.removeAttribute('disabled')
            console.log("Location shared!")
        })
    })
})
// socket.on('countUpdated',(count) => {
//     console.log("Your account has been updated", count)
// })

// document.querySelector("#increment").addEventListener('click', () => {
//     console.log("Clicked")
//     socket.emit('increment')
// })

 

