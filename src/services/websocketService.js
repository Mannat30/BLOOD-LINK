import { Client } from '@stomp/stompjs'

const WS_URL =
    import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

let client = null

export const connectDonorWebSocket = (
    donorId,
    onEmergencyAlert
) => {

    if (!donorId) {
        console.error(
            'Cannot connect WebSocket: donorId is missing'
        )

        return () => {}
    }

    client = new Client({

        brokerURL: WS_URL,

        reconnectDelay: 5000,

        debug: () => {},

        onConnect: () => {

            console.log(
                'WebSocket connected for donor:',
                donorId
            )

            client.subscribe(
                `/topic/donor/${donorId}`,
                (message) => {

                    try {

                        const alert =
                            JSON.parse(message.body)

                        console.log(
                            '🚨 Emergency blood alert:',
                            alert
                        )

                        onEmergencyAlert(alert)

                    } catch (error) {

                        console.error(
                            'Failed to parse WebSocket alert:',
                            error
                        )
                    }
                }
            )
        },

        onStompError: (frame) => {

            console.error(
                'WebSocket STOMP error:',
                frame.headers['message']
            )
        },

        onWebSocketError: (error) => {

            console.error(
                'WebSocket error:',
                error
            )
        }
    })

    client.activate()

    return () => {

        if (client) {

            client.deactivate()

            client = null

            console.log(
                'WebSocket disconnected'
            )
        }
    }
}