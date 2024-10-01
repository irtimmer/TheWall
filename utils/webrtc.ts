// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

export function useWebRTC(polite: boolean, remoteView: HTMLVideoElement | undefined) {
  const description = ref<RTCSessionDescription | null>(null)
  const candidate = ref<RTCIceCandidate | null>(null)

  let makingOffer = false;
  let ignoreOffer = false;

  const pc = new RTCPeerConnection();
  pc.ontrack = ({ track, streams }) => {
    track.onunmute = () => {
      if (!remoteView || remoteView.srcObject)
        return

      remoteView.srcObject = streams[0]
    }
  }
  pc.onnegotiationneeded = async () => {
    try {
      makingOffer = true
      await pc.setLocalDescription()
      description.value = pc.localDescription
    } catch (err) {
      console.error(err)
    } finally {
      makingOffer = false
    }
  };
  pc.onicecandidate = ({ candidate: c }) => candidate.value = c

  const onsignal = async ({data: {description: descriptionRemote, candidate: candidateRemote}}: MessageEvent) => {
    try {
      if (descriptionRemote) {
        const offerCollision = descriptionRemote.type === "offer" && (makingOffer || pc.signalingState !== "stable")

        ignoreOffer = !polite && offerCollision
        if (ignoreOffer)
          return

        await pc.setRemoteDescription(descriptionRemote)
        if (descriptionRemote.type === "offer") {
          await pc.setLocalDescription()
          description.value = pc.localDescription
        }
      } else if (candidateRemote) {
        console.log("onsignal", "candidate")
        try {
          await pc.addIceCandidate(candidateRemote)
        } catch (err) {
          if (!ignoreOffer)
            throw err
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const cleanup = () => {
    pc.close()
  }

  return {
    pc,
    description,
    candidate,
    onsignal,
    cleanup
  }
}
