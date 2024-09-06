/* eslint-disable max-lines-per-function */
import { ElementRef, Inject, Injectable } from '@angular/core';
import { WebsocketService } from './socket-gateway.service';
import { SOCKET_SCREEN_ACTION } from '#utils/const';
import { DOCUMENT } from '@angular/common';
import { ISignalPayload, IUserJoinedPayload } from '#interfaces/meeting.interface';

const peerConnectionConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@Injectable({
  providedIn: 'root',
})
export class WebRTCService {
  private localStream: MediaStream;
  private peers: { [key: string]: RTCPeerConnection } = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private socket: WebsocketService,
  ) {}

  showCamera(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  showMicro() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  createVideoElement(id: string, videoContainer: ElementRef<HTMLElement>) {
    const videoElement = this.document.createElement('video');
    videoElement.id = id;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    if (id === 'local') {
      videoElement.muted = true;
    }
    videoContainer.nativeElement.appendChild(videoElement);
    return videoElement;
  }

  async getUserMedia(videoContainer: ElementRef<HTMLElement>) {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const localVideoElement = this.createVideoElement('local', videoContainer);
    localVideoElement.srcObject = this.localStream;
  }

  createPeerConnection(peerId: string, videoContainer: ElementRef<HTMLElement>) {
    const peerConnection = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          to: peerId,
          signal: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (!this.document.getElementById(peerId)) {
        const videoElement = this.createVideoElement(peerId, videoContainer);
        videoElement.srcObject = event.streams[0];
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, this.localStream));
    }

    return peerConnection;
  }

  async handleUserJoined(payload: IUserJoinedPayload, videoContainer: ElementRef<HTMLElement>) {
    const peerConnection = this.createPeerConnection(payload.id, videoContainer);
    this.peers[payload.id] = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
      roomId: payload.roomId,
      to: payload.id,
      signal: offer,
    });
  }

  async handleSignal(payload: ISignalPayload, videoContainer: ElementRef<HTMLElement>) {
    const peerConnection = this.peers[payload.from] || this.createPeerConnection(payload.from, videoContainer);
    this.peers[payload.from] = peerConnection;

    if (payload.signal.type === 'offer') {
      const peerConnection = this.peers[payload.from] || this.createPeerConnection(payload.from, videoContainer);
      this.peers[payload.from] = peerConnection;

      if (payload.signal.type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.signal));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          to: payload.from,
          signal: answer,
        });
      } else if (payload.signal.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.signal));
      } else if (payload.signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(payload.signal));
      }
    }
  }
}
