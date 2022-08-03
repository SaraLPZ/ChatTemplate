let messagesContainer = document.getElementById('messages')


import { APP_ID } from './env.js '

let appID = APP_ID
let token = null
let uid = String(Math.floor(Math.random() * 232))
let room = 'default'


let initiate = async () => {
    const rtmClient = await AgoraRTM.createInstance(appID)

    await rtmClient.login({ uid, token })

    const channel = await rtmClient.createChannel(room)
    await channel.join()

    channel.on('ChannelMessage', (messageData, memberId) => {
        let data = JSON.parse(messageData.text)
        addMessageToDom(data.message, memberId)
    })


    let addMessageToDom = (messageData, memberId) => {
        let messagesWrapper = document.getElementById('messages')
        let messageItem = `<div class="message__wrapper">
                            <p>${memberId}</p>
                            <p class="message">${messageData}</p>
                        </div>`
        messagesWrapper.insertAdjacentHTML('beforeend', messageItem)

        messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    let sendMessage = async (e) => {
        e.preventDefault()
        let message = e.target.message.value
        channel.sendMessage({ text: JSON.stringify({ 'message': message }) })
        addMessageToDom(message, uid)
        e.target.reset()
    }


    let messageForm = document.getElementById('message__form')
    messageForm.addEventListener('submit', sendMessage)
}

initiate()