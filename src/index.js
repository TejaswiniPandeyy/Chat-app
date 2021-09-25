/*
//Goal: Create a express web server

1.Initialize npm and install Express ($ npm init)
2. Setup new Express Server ($ npm i express@4.16.4)
  - Serve up fhe public directory
  - listen on port 3000
3. create index.html and render "Chat App" to the screen
4. test your work! Start the server and view the page in the browser ($ node src/index.js)


const path = require('path')  //core node module
const express = require("express")

const app = express()

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

app.listen(port,() => {
    console.log(`Server is up on the port ${port}!`)
})


Goal: Setup scripts in package.json

1.Create a "start" script to start  the app using node
2. Install nodemon and a developement dependency ($ npm i nodemon@1.18.7 --save-dev)
3. Create a "dev" script to start the app using nodemon
4. Run both scripts to test your work!

soln: 
"scripts": {
    "start": "node src/index.js",
    "dev" : "nodemon src/index.js"
  } in package.json

  Terminal commands used:
  $ npm run start
  $ npm run dev




const path = require('path')  //core node module
const http = require('http')
const express = require("express")
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

//let count = 0

io.on('connection',(socket) => {
    console.log('New Web socket connection')
    socket.emit('message',"Welcome")
    socket.broadcast.emit('message','A new user has joined!') //will send a msg to old Users

    socket.on('sendMessage',(message) => {
        io.emit('message',message)
    })
    socket.on('sendLocation',(coords) => {
        // io.emit('message',`Location: ${coords.latitude},${coords.longitude}`)
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect',() => {
        io.emit('message','A user has left!')
    })

    // socket.emit('countUpdated', count)  //not using io.emit becoz if new user joins would send old data to old users as well which is not requires as they already have it
    // socket.on('increment', () => {
    //     count++
    //    // socket.emit('countUpdated',count)  <-- not working as opening on different browser didnt notify of changes made inn first browser
    //    io.emit('countUpdated',count)
    // })
})

server.listen(port,() => {
    console.log(`Server is up on the port ${port}!`)
})
 
// Challenge: Send a welcome message to new users
// 1.have server emit "message" when new client connects
//   - send "welcome " as the event Data 
// 2.  have client listen for "message" event and print ti console
// 3. Test your work

// //Challenge: Allow clients to send messages
// 1. create a form with an input and Button
//     similar to the weather form
// 2. Setup event listener for form submission
//  - Emit "sendMessage" with input string as message Data
// 3. have server listen for "sendMessage"
//  - Send message to all connected clients 
// 4. test your work!

*/

const path = require('path')
const http = require('http')
const express = require("express")
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket) => {
    console.log('New Web socket connection')
    socket.emit('message',"Welcome")
    socket.broadcast.emit('message','A new user has joined!') //will send a msg to old Users

    socket.on('sendMessage',(message,callback) => {
        const filter = new Filter()  

        if(filter.isProfane(message)) {
            return callback("profinity is not allowed")
        }

        io.emit('message',message)
        callback("Delivered")
    })
    socket.on('sendLocation',(coords,callback) => {
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect',() => {
        io.emit('message','A user has left!')
    })
})

server.listen(port,() => {
    console.log(`Server is up on the port ${port}!`)
})