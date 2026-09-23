import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

function MeetRoom() {
  const { code } = useParams();
  const navigate = useNavigate();

  // -----------------------------
  // STATE
  // -----------------------------

  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [connected, setConnected] = useState(false);

  // -----------------------------
  // REFS
  // -----------------------------

  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // -----------------------------
  // CONNECT TO LIVEKIT
  // -----------------------------

  useEffect(() => {
    let mounted = true;

    async function connectToRoom() {
      try {
        console.log("Getting LiveKit token...");

        const response = await fetch(
          `http://localhost:5000/api/livekit/token?room=${code}&identity=Harsha`
        );

        if (!response.ok) {
          throw new Error("Could not get LiveKit token");
        }

        const data = await response.json();

        console.log("Token received");

        // Create LiveKit room
        const room = new Room();

        // Save room
        roomRef.current = room;

        // --------------------------------
        // REMOTE TRACK SUBSCRIBED
        // --------------------------------

        room.on(
          RoomEvent.TrackSubscribed,
          (track, publication, participant) => {
            console.log(
              "Remote track subscribed:",
              track.kind,
              participant.identity
            );

            if (
              track.kind === Track.Kind.Video &&
              remoteVideoRef.current
            ) {
              track.attach(remoteVideoRef.current);
            }

            if (track.kind === Track.Kind.Audio) {
              track.attach();
            }
          }
        );

        // --------------------------------
        // REMOTE TRACK UNSUBSCRIBED
        // --------------------------------

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track) => {
            console.log("Remote track unsubscribed");

            track.detach();
          }
        );

        // --------------------------------
        // CONNECT
        // --------------------------------
        console.log("LiveKit server URL:", data.serverUrl);
console.log("Token received:", !!data.token);
        await room.connect(data.serverUrl, data.token);

        console.log("Connected to LiveKit!");

        if (!mounted) {
          await room.disconnect();
          return;
        }

        setConnected(true);

        // --------------------------------
        // ENABLE CAMERA + MICROPHONE
        // --------------------------------

        await room.localParticipant.enableCameraAndMicrophone();

        console.log("Camera and microphone enabled!");

        // --------------------------------
        // GET LOCAL VIDEO TRACK
        // --------------------------------

        const videoPublication =
          Array.from(
            room.localParticipant.videoTrackPublications.values()
          )[0];

        const videoTrack = videoPublication?.videoTrack;

        if (videoTrack && videoRef.current) {
          videoTrack.attach(videoRef.current);
        }

        console.log("Local video attached!");

      } catch (error) {
        console.error("LiveKit connection error:", error);
      }
    }

    connectToRoom();

    // --------------------------------
    // CLEANUP
    // --------------------------------

    return () => {
      mounted = false;

      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [code]);

  // -----------------------------
  // MICROPHONE
  // -----------------------------

  async function handleMic() {
    if (!roomRef.current) return;

    const newMicState = !mic;

    try {
      await roomRef.current.localParticipant.setMicrophoneEnabled(
        newMicState
      );

      setMic(newMicState);

      console.log(
        "Microphone:",
        newMicState ? "ON" : "OFF"
      );
    } catch (error) {
      console.error("Microphone error:", error);
    }
  }

  // -----------------------------
  // CAMERA
  // -----------------------------

  async function handleCam() {
    if (!roomRef.current) return;

    const newCamState = !cam;

    try {
      await roomRef.current.localParticipant.setCameraEnabled(
        newCamState
      );

      setCam(newCamState);

      console.log(
        "Camera:",
        newCamState ? "ON" : "OFF"
      );
    } catch (error) {
      console.error("Camera error:", error);
    }
  }

  // -----------------------------
  // SCREEN SHARE
  // -----------------------------

  async function handleScreenShare() {
    if (!roomRef.current) return;

    const newScreenState = !screenShare;

    try {
      await roomRef.current.localParticipant.setScreenShareEnabled(
        newScreenState
      );

      setScreenShare(newScreenState);

      console.log(
        "Screen sharing:",
        newScreenState ? "ON" : "OFF"
      );
    } catch (error) {
      console.error("Screen sharing error:", error);
    }
  }

  // -----------------------------
  // HANG UP
  // -----------------------------

  async function handleHangup() {
    console.log("Leaving meeting...");

    try {
      if (roomRef.current) {
        await roomRef.current.disconnect();
        roomRef.current = null;
      }

      navigate("/home");
    } catch (error) {
      console.error("Hang up error:", error);

      navigate("/home");
    }
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* HEADER */}

      <div className="p-4 bg-blue-300 text-black">

        <h1 className="font-bold text-xl mb-3">
          Smart Meet
        </h1>

        <div className="bg-blue-600 w-fit text-white border rounded-lg p-2">
          Meet ID: {code}
        </div>

        <div className="mt-2">
          {connected ? (
            <span className="text-green-700 font-semibold">
              Connected
            </span>
          ) : (
            <span className="text-red-700 font-semibold">
              Connecting...
            </span>
          )}
        </div>

      </div>

      {/* VIDEO AREA */}

      <div className="p-6 bg-black min-h-[500px]">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* LOCAL VIDEO */}

          <div className="bg-gray-800 rounded-lg overflow-hidden">

            <div className="p-2 bg-gray-700">
              You
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[400px] object-cover bg-black"
            />

          </div>

          {/* REMOTE VIDEO */}

          <div className="bg-gray-800 rounded-lg overflow-hidden">

            <div className="p-2 bg-gray-700">
              Participant
            </div>

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-[400px] object-cover bg-black"
            />

          </div>

        </div>

      </div>

      {/* CONTROLS */}

      <div className="flex justify-center gap-4 p-6 flex-wrap">

        {/* MICROPHONE */}

        <button
          className={`w-24 h-16 rounded-lg font-semibold ${
            mic
              ? "bg-blue-200 text-black"
              : "bg-red-500 text-white"
          }`}
          onClick={handleMic}
        >
          {mic ? "Mic ON" : "Mic OFF"}
        </button>

        {/* CAMERA */}

        <button
          className={`w-24 h-16 rounded-lg font-semibold ${
            cam
              ? "bg-blue-200 text-black"
              : "bg-red-500 text-white"
          }`}
          onClick={handleCam}
        >
          {cam ? "Cam ON" : "Cam OFF"}
        </button>

        {/* SCREEN SHARE */}

        <button
          className={`w-28 h-16 rounded-lg font-semibold ${
            screenShare
              ? "bg-green-500 text-white"
              : "bg-blue-200 text-black"
          }`}
          onClick={handleScreenShare}
        >
          {screenShare ? "Stop Share" : "Share Screen"}
        </button>

        {/* HANG UP */}

        <button
          className="w-24 h-16 rounded-lg bg-red-600 text-white font-semibold"
          onClick={handleHangup}
        >
          Hang Up
        </button>

      </div>

    </div>
  );
}

export default MeetRoom;