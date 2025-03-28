import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Janus from "./janus.js";
import { useDispatch } from "react-redux";
import styles from "./Video.module.css";
import { ToggleVideoButton } from "./ToggleVideoButton.jsx";
import { ToggleAudioButton } from "./ToggleAudioButton.jsx";
import VideoView from "./VideoView";
import adapter from "webrtc-adapter";

const JanusWebRTC = forwardRef(({ roomId, isPublisher, publisherId }, ref) => {
    const dispatch = useDispatch();
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const mainVideoRef = useRef(null); // 서버 송출 화면용
    const localVideoRef = useRef(null); // 로컬 캠 화면용
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
                    attachLocalStreamToVideo(stream);
                },
                oncleanup: function () {
                    mystreamRef.current = null;
                    console.log("Publisher cleanup completed.");
                },
            });
            janusRef.current.attach({
                plugin: "janus.plugin.videoroom",
                opaqueId: opaqueId + "-self-subscriber",
                success: function (pluginHandle) {
                    remoteFeedRef.current = pluginHandle;
                    console.log("Self-subscriber plugin attached:", pluginHandle);
                },
                error: function (error) {
                    console.error("Error attaching self-subscriber plugin:", error);
                },
                onmessage: handleSubscriberMessage,
                onremotestream: function (stream) {
                    console.log("Received remote stream (self):", stream);
                    attachMainStreamToVideo(stream);
                },
                oncleanup: function () {
                    console.log("Self-subscriber cleanup completed.");
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
                    attachMainStreamToVideo(stream);
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

    const handlePublisherMessage = async (msg, jsep) => {
        console.log("Publisher message:", msg);
        if (msg["videoroom"] === "joined") {
            console.log("Publisher joined room:", msg["room"]);
            const myPublisherId = msg["id"];
            dispatch({
                type: "JOIN_ROOM",
                payload: { room: msg["room"], publisherId: myPublisherId, publisherPvtId: msg["private_id"] },
            });
            window.myPublisherId = myPublisherId;
            publishOwnFeed(true);
        } else if (msg["configured"] === "ok" && msg["room"] === roomId) {
            console.log("Stream configuration confirmed, waiting for WebRTC to be up...");
        } else if (msg.janus === "webrtcup" && msg.sender === storePluginRef.current?.id) {
            console.log("WebRTC is up, subscribing to self...");
            if (remoteFeedRef.current && window.myPublisherId) {
                console.log("Subscribing to self with publisherId:", window.myPublisherId);
                const joinAsSubscriber = {
                    request: "join",
                    room: roomId,
                    ptype: "subscriber",
                    feed: window.myPublisherId,
                };
                remoteFeedRef.current.send({
                    message: joinAsSubscriber,
                    success: (response) => console.log("Self-subscription success:", response),
                    error: (err) => console.error("Self-subscription error:", err),
                });
            } else {
                console.error("Cannot subscribe: remoteFeedRef or myPublisherId is missing", {
                    remoteFeedRef: remoteFeedRef.current,
                    myPublisherId: window.myPublisherId,
                });
            }
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

    const attachMainStreamToVideo = (stream) => {
        if (mainVideoRef.current) {
            console.log("Attaching main stream to video element");
            mainVideoRef.current.srcObject = stream;
            mainVideoRef.current.play().catch((err) => console.error("Main video play error:", err));
        } else {
            console.error("mainVideoRef.current is null");
        }
    };

    const attachLocalStreamToVideo = (stream) => {
        if (localVideoRef.current) {
            console.log("Attaching local stream to video element");
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch((err) => console.error("Local video play error:", err));
        } else {
            console.error("localVideoRef.current is null");
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
                storePluginRef.current.createOffer({
                    stream: stream,
                    success: (jsep) => {
                        const body = { request: "configure", room: roomId, audio: true, video: true };
                        storePluginRef.current.send({
                            message: body,
                            jsep: jsep,
                            success: () => {
                                console.log("Stream configured successfully");
                                console.log("JSEP sent to server:", jsep);
                            },
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
        if (!isPublisher || !storePluginRef.current) return;
        if (storePluginRef.current.isVideoMuted()) {
            setIsVideoMuted(false);
            storePluginRef.current.unmuteVideo();
        } else {
            setIsVideoMuted(true);
            storePluginRef.current.muteVideo();
        }
    };

    const toggleAudioHandler = () => {
        if (!isPublisher || !storePluginRef.current) return;
        if (storePluginRef.current.isAudioMuted()) {
            setIsAudioMuted(false);
            storePluginRef.current.unmuteAudio();
        } else {
            setIsAudioMuted(true);
            storePluginRef.current.muteAudio();
        }
    };

    return (
        <div className={styles.videoContainer}>
            {isPublisher && (
                <>
                    <ToggleVideoButton isVideoMuted={isVideoMuted} onClick={toggleVideoHandler} />
                    <ToggleAudioButton isAudioMuted={isAudioMuted} onClick={toggleAudioHandler} />
                    <VideoView
                        ref={localVideoRef}
                        videoType="local"
                        isMuted={true}
                        className={styles.localVideo}
                    />
                </>
            )}
            <VideoView
                ref={mainVideoRef}
                videoType={isPublisher ? "main" : "main"}
                isMuted={true}
                className={styles.mainVideo}
            />
        </div>
    );
});

export default JanusWebRTC;