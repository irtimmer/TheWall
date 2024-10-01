// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

export function useWebRTC(polite: boolean, signal: (signal: {description?: RTCSessionDescription, candidate?: RTCIceCandidate}) => Promise<void>, remoteView: HTMLVideoElement | undefined) {
  const config = useRuntimeConfig()

  let makingOffer = false;
  let ignoreOffer = false;

  let bufferedCandidates: RTCIceCandidate[] = []

  const pc = new RTCPeerConnection({
    iceServers: config.public?.iceServers
  });
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
      await signal({ description: pc.localDescription})
    } catch (err) {
      console.error(err)
    } finally {
      makingOffer = false
    }
  };
  pc.onicecandidate = async ({ candidate }) => await signal({ candidate })

  const onsignal = async ({data: {description: descriptionRemote, candidate: candidateRemote}}: MessageEvent) => {
    try {
      if (descriptionRemote) {
        const offerCollision = descriptionRemote.type === "offer" && (makingOffer || pc.signalingState !== "stable")

        ignoreOffer = !polite && offerCollision
        if (ignoreOffer)
          return

        await pc.setRemoteDescription(descriptionRemote)
        for (const candidate of bufferedCandidates)
          await pc.addIceCandidate(candidate)

        bufferedCandidates = []
        if (descriptionRemote.type === "offer") {
          await pc.setLocalDescription()
          await signal({ description: pc.localDescription})
        }
      } else if (candidateRemote) {
        if (!pc.remoteDescription) {
          bufferedCandidates.push(candidateRemote)
          return
        }

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
    onsignal,
    cleanup
  }
}
