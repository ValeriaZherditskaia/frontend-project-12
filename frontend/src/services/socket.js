import io from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
  if (socket) return socket
  socket = io({
    auth: { token },
    reconnection: true,
    timeout: 20000,
  })
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const onNewMessage = (callback) => {
  if (socket) socket.on('newMessage', callback)
}

export const offNewMessage = (callback) => {
  if (socket) socket.off('newMessage', callback)
}
