import { io, type Socket } from 'socket.io-client'
import type { ApiChatMessage } from '../../api/chat'
import { apiBaseUrl, getAccessToken, refreshOnce } from '../../api/client'

export type ChatSocketMessageEvent = {
  giftRequestId: string
  message: ApiChatMessage
}

type JoinAck =
  | { ok: true }
  | { ok: false; code?: string; message?: string }

let sharedSocket: Socket | null = null
let connectPromise: Promise<Socket> | null = null

function createSocket(token: string): Socket {
  return io(`${apiBaseUrl()}/chat`, {
    path: '/socket.io',
    auth: { token },
    withCredentials: true,
    autoConnect: true,
    // Keep default transports (polling then websocket) for LiteSpeed proxy.
  })
}

export async function getChatSocket(): Promise<Socket> {
  const token = getAccessToken()
  if (!token) {
    throw new Error('No access token for chat socket')
  }

  if (sharedSocket?.connected) {
    return sharedSocket
  }

  if (connectPromise) {
    return connectPromise
  }

  connectPromise = new Promise<Socket>((resolve, reject) => {
    if (sharedSocket) {
      sharedSocket.removeAllListeners()
      sharedSocket.disconnect()
      sharedSocket = null
    }

    const socket = createSocket(token)
    sharedSocket = socket

    const onConnect = () => {
      cleanup()
      resolve(socket)
    }

    const onConnectError = async (error: Error & { data?: { code?: string } }) => {
      cleanup()
      const code = error.data?.code
      if (code === 'UNAUTHORIZED') {
        try {
          const refreshed = await refreshOnce()
          const nextToken = getAccessToken()
          if (refreshed && nextToken) {
            socket.auth = { token: nextToken }
            socket.connect()
            socket.once('connect', () => resolve(socket))
            socket.once('connect_error', (retryError) => {
              reject(retryError)
            })
            return
          }
        } catch {
          // fall through
        }
      }
      reject(error)
    }

    function cleanup() {
      socket.off('connect', onConnect)
      socket.off('connect_error', onConnectError)
      connectPromise = null
    }

    socket.once('connect', onConnect)
    socket.once('connect_error', (error) => {
      void onConnectError(error)
    })
  })

  return connectPromise
}

export function joinChatRoom(
  socket: Socket,
  giftRequestId: string,
): Promise<JoinAck> {
  return new Promise((resolve) => {
    socket.emit('join', { giftRequestId }, (ack: JoinAck) => {
      resolve(ack ?? { ok: false })
    })
  })
}

export function leaveChatRoom(socket: Socket, giftRequestId: string): void {
  socket.emit('leave', { giftRequestId })
}

export function disconnectChatSocket(): void {
  if (sharedSocket) {
    sharedSocket.removeAllListeners()
    sharedSocket.disconnect()
    sharedSocket = null
  }
  connectPromise = null
}
