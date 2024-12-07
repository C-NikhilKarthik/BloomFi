
import { useRoom } from '@huddle01/react/hooks';


export default function Huddle() {
    const { joinRoom, leaveRoom } = useRoom({
        onJoin: () => {
            console.log('Joined the room');
        },
        onLeave: () => {
            console.log('Left the room');
        },
    });

    return (
        <div>
            <button onClick={() => {

                // join room
                joinRoom({
                    roomId: "123456",
                    token: "ak_xBMGDMxeQ8iUaDv6",
                });
            }}>
                Join Room
            </button>
            <button onClick={leaveRoom}>
                Leave Room
            </button>
        </div>
    );
};

