import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Janus from "./janus.js";
import { useDispatch } from "react-redux";
import { ToggleVideoButton } from "./ToggleVideoButton.jsx";
import { ToggleAudioButton } from "./ToggleAudioButton.jsx";
import adapter from "webrtc-adapter";
import styles from "./JanusWebRTC.module.css";

const JanusWebRTC = forwardRef(({ roomId, isPublisher, publisherId }, ref) => {
    const dispatch = useDispatch();
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [auctionRooms, setAuctionRooms] = useState([]);

    const videoRef = useRef(null);
    const janusRef = useRef(null);
    const storePluginRef = useRef(null);
    const remoteFeedRef = useRef(null);
    const mystreamRef = useRef(null);

    const opaqueId = "videoroom-test-" + Janus.randomString(12);
    const serverUrl = "https://janus.jsflux.co.kr/janus";

    useImperativeHandle(ref, () => ({
        destroyRoom: () => {
            if (isPublisher && storePluginRef.current) {
                const destroyRequest = { request: "destroy", room: roomId };
                storePluginRef.current.send({
                    message: destroyRequest,
                    success: (response) => console.log("Room destroyed successfully:", response),
                    error: (error) => console.error("Error destroying room:", error),
                });
            }
        },
    }));

    useEffect(() => {
        console.log("Initializing Janus for room:", roomId);

        Janus.init({
            debug: "all",
            dependencies: Janus.useDefaultDependencies({ adapter }),
            callback: function () {
                if (!Janus.isWebrtcSupported()) {
                    console.error("WebRTC is not supported in this browser.");
                    return;
                }

                janusRef.current = new Janus({
                    server: serverUrl,
                    success: function () {
                        attachPlugin();
                        fetchAuctionRooms();
                    },
                    error: function (error) {
                        console.error("Janus initialization failed:", error);
                    },
                    destroyed: function () {
                        console.log("Janus instance destroyed.");
                    },
                });
            },
        });

        return () => {
            if (janusRef.current) {
                janusRef.current.destroy();
            }
        };
    }, [roomId, isPublisher]);

    const fetchAuctionRooms = () => {
        if (storePluginRef.current) {
            const listRequest = { request: "list" };
            storePluginRef.current.send({
                message: listRequest,
                success: (response) => {
                    console.log("Auction rooms list:", response);
                    const rooms = response.list.filter(room => room.room >= 20000 && room.room <= 20020);
                    setAuctionRooms(rooms);
                },
                error: (error) => console.error("Error fetching auction rooms:", error),
            });
        } else {
            const waitForPlugin = setInterval(() => {
                if (storePluginRef.current) {
                    fetchAuctionRooms();
                    clearInterval(waitForPlugin);
                }
            }, 100);
        }
    };

    const deleteAuctionRooms = () => {
        if (!storePluginRef.current) {
            console.error("Plugin handle not available.");
            return;
        }
        auctionRooms.forEach(room => {
            const destroyRequest = { request: "destroy", room: room.room };
            storePluginRef.current.send({
                message: destroyRequest,
                success: (response) => console.log(`Room ${room.room} destroyed successfully:`, response),
                error: (error) => console.error(`Error destroying room ${room.room}:`, error),
            });
        });
        setAuctionRooms([]);
    };

    const attachPlugin = () => {
        if (isPublisher) {
            janusRef.current.attach({
                plugin: "janus.plugin.videoroom",
                opaqueId: opaqueId,
                success: function (pluginHandle) {
                    storePluginRef.current = pluginHandle;
                    createOrJoinRoom();
                },
                error: function (error) {
                    console.error("Error attaching publisher plugin:", error);
                },
                onmessage: handlePublisherMessage,
                onlocalstream: function (stream) {
                    console.log("Local stream received:", stream);
                    mystreamRef.current = stream;
                    attachStreamToVideo(stream);
                },
                oncleanup: function () {
                    mystreamRef.current = null;
                    console.log("Publisher cleanup completed.");
                },
            });
        } else {
            janusRef.current.attach({
                plugin: "janus.plugin.videoroom",
                opaqueId: opaqueId + "-subscriber",
                success: function (pluginHandle) {
                    remoteFeedRef.current = pluginHandle;
                    subscribeToPublisher();
                },
                error: function (error) {
                    console.error("Error attaching subscriber plugin:", error);
                },
                onmessage: handleSubscriberMessage,
                onremotestream: function (stream) {
                    console.log("Received remote stream:", stream);
                    attachStreamToVideo(stream);
                },
                oncleanup: function () {
                    console.log("Subscriber cleanup completed.");
                },
            });
        }
    };

    const createOrJoinRoom = () => {
        const createRoom = {
            request: "create",
            room: roomId,
            permanent: false,
            record: false,
            publishers: 1,
            bitrate: 128000,
            fir_freq: 10,
            description: "test",
            is_private: false,
        };
        storePluginRef.current.send({
            message: createRoom,
            success: (response) => {
                console.log("Room creation response:", response);
                if (response["videoroom"] === "created") {
                    joinAsPublisher();
                }
            },
            error: (error) => {
                console.error("Room creation failed, attempting to join:", error);
                joinAsPublisher();
            },
        });
    };

    const joinAsPublisher = () => {
        const register = { request: "join", room: roomId, ptype: "publisher" };
        storePluginRef.current.send({ message: register });
    };

    const handlePublisherMessage = (msg, jsep) => {
        console.log("Publisher message:", msg);
        if (msg["videoroom"] === "joined") {
            console.log("Publisher joined room:", msg["room"]);
            dispatch({
                type: "JOIN_ROOM",
                payload: { room: msg["room"], publisherId: msg["id"], publisherPvtId: msg["private_id"] },
            });
            publishOwnFeed(true);
        }
        if (jsep) {
            storePluginRef.current.handleRemoteJsep({ jsep: jsep });
        }
    };

    const subscribeToPublisher = () => {
        if (publisherId) {
            console.log("Subscribing to publisher:", publisherId);
            const joinAsSubscriber = { request: "join", room: roomId, ptype: "subscriber", feed: publisherId };
            remoteFeedRef.current.send({ message: joinAsSubscriber });
        } else {
            const listRequest = { request: "listparticipants", room: roomId };
            remoteFeedRef.current.send({
                message: listRequest,
                success: (response) => {
                    console.log("Participants list:", response);
                    const publishers = response.participants.filter(p => p.publisher);
                    if (publishers.length > 0) {
                        const feedId = publishers[0].id;
                        console.log("Subscribing to feed:", feedId);
                        const joinAsSubscriber = { request: "join", room: roomId, ptype: "subscriber", feed: feedId };
                        remoteFeedRef.current.send({ message: joinAsSubscriber });
                    } else {
                        console.warn("No publishers found in room:", roomId);
                        alert("방에 퍼블리셔가 없습니다. 나중에 다시 시도하세요.");
                    }
                },
                error: (error) => {
                    console.error("Error fetching participants:", error);
                    alert("퍼블리셔 목록을 가져오는데 실패했습니다.");
                },
            });
        }
    };

    const handleSubscriberMessage = (msg, jsep) => {
        console.log("Subscriber message:", msg);
        if (msg["videoroom"] === "attached") {
            console.log("Attached to publisher:", msg["id"]);
        }
        if (jsep) {
            remoteFeedRef.current.createAnswer({
                jsep: jsep,
                media: { audioSend: false, videoSend: false },
                success: (jsepAnswer) => {
                    console.log("Generated SDP answer:", jsepAnswer);
                    const start = { request: "start", room: roomId };
                    remoteFeedRef.current.send({
                        message: start,
                        jsep: jsepAnswer,
                        success: () => console.log("Stream started successfully"),
                        error: (err) => console.error("Start error:", err),
                    });
                },
                error: (err) => console.error("Error creating answer:", err),
            });
        }
    };

    const attachStreamToVideo = (stream) => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => console.error("Video play error:", err));
        }
    };

    const publishOwnFeed = (start) => {
        if (!start || !isPublisher) return;
        const constraints = { audio: true, video: true };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                console.log("Publishing stream:", stream);
                mystreamRef.current = stream;
                attachStreamToVideo(stream);
                storePluginRef.current.createOffer({
                    stream: stream,
                    success: (jsep) => {
                        const body = { request: "configure", room: roomId, audio: true, video: true };
                        storePluginRef.current.send({
                            message: body,
                            jsep: jsep,
                            success: () => console.log("Stream configured successfully"),
                            error: (err) => console.error("Configure error:", err),
                        });
                    },
                    error: (error) => console.error("Error creating offer:", error),
                });
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error);
                alert("미디어 장치에 접근할 수 없습니다: " + error.message);
            });
    };

    const toggleVideoHandler = () => {
        if (!isPublisher || !mystreamRef.current) return;
        const videoTrack = mystreamRef.current.getVideoTracks()[0];
        if (videoTrack.enabled) {
            videoTrack.enabled = false;
            setIsVideoMuted(true);
        } else {
            videoTrack.enabled = true;
            setIsVideoMuted(false);
        }
    };

    const toggleAudioHandler = () => {
        if (!isPublisher || !mystreamRef.current) return;
        const audioTrack = mystreamRef.current.getAudioTracks()[0];
        if (audioTrack.enabled) {
            audioTrack.enabled = false;
            setIsAudioMuted(true);
        } else {
            audioTrack.enabled = true;
            setIsAudioMuted(false);
        }
    };

    return (
        <div>
            {isPublisher && (
                <div className={styles.buttonContainer}>
                    <ToggleVideoButton isVideoMuted={isVideoMuted} onClick={toggleVideoHandler} />
                    <ToggleAudioButton isAudioMuted={isAudioMuted} onClick={toggleAudioHandler} />
                </div>
            )}
            <div className={styles.videoBox}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={true}
                    className={isPublisher ? styles.localVideo : styles.mainVideo}
                />
                {/*<button*/}
                {/*    onClick={deleteAuctionRooms}*/}
                {/*    style={{*/}
                {/*        position: "absolute",*/}
                {/*        bottom: "10px",*/}
                {/*        right: "10px",*/}
                {/*        padding: "5px 10px",*/}
                {/*        fontSize: "12px",*/}
                {/*        backgroundColor: "#ff4444",*/}
                {/*        color: "#fff",*/}
                {/*        border: "none",*/}
                {/*        borderRadius: "3px",*/}
                {/*        cursor: "pointer",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Delete Rooms*/}
                {/*</button>*/}
            </div>
        </div>
    );
});

export default JanusWebRTC;