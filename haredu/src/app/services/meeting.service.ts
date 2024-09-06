import { Injectable } from '@angular/core';
import { WebsocketService } from './socket-gateway.service';
import { SOCKET_SCREEN_ACTION } from '#utils/const';
import { ISignalPayload, IUserJoinedPayload } from '#interfaces/meeting.interface';

@Injectable({
  providedIn: 'root',
})
export class MettingService {
  localStream: MediaStream;
  remoteStream: MediaStream;
  peerConnection: RTCPeerConnection;
  token = '';
  uid: string = String(Math.floor(Math.random() * 1000000));
  servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  constructor(private socket: WebsocketService) {}

  async init(roomId: string) {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.getElementById('localVideo')! as HTMLMediaElement;
    localVideo.srcObject = this.localStream;
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.JOIN, { roomId });
  }

  async initPeerConnection(roomId: string, userId: string) {
    this.peerConnection = new RTCPeerConnection(this.servers);

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, { roomId, signal: event.candidate, sendBy: userId });
      }
    };
    const remoteVideo = document.getElementById('remoteVideo')! as HTMLMediaElement;
    this.peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    this.localStream.getTracks().forEach((track) => this.peerConnection.addTrack(track, this.localStream));
  }

  async createOffer(roomId: string, userId: string) {
    this.peerConnection = new RTCPeerConnection(this.servers);

    this.localStream.getTracks().forEach((track) => this.peerConnection.addTrack(track, this.localStream));

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, { roomId, signal: event.candidate, sendBy: userId });
      }
    };
    const remoteVideo = document.getElementById('remoteVideo')! as HTMLMediaElement;
    this.peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
    this.peerConnection
      .createOffer()
      .then((offer) => {
        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          roomId,
          signal: this.peerConnection.localDescription,
          sendBy: userId,
        });
      });
  }

  async subscribeEvent() {
    this.socket.getMessage<IUserJoinedPayload>(SOCKET_SCREEN_ACTION.USER_JOINED).subscribe({
      next: async ({ payload }) => {
        this.createOffer(payload.roomId, payload.userId);
      },
    });

    this.socket.getMessage<ISignalPayload>(SOCKET_SCREEN_ACTION.SIGNAL).subscribe({
      next: async ({ payload }) => {
        console.log('ok', this.peerConnection);

        if (!this.peerConnection) {
          this.initPeerConnection(payload.roomId, payload.sendBy);
        }

        if (payload.signal.type === 'offer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.signal));
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);

          console.log('ok1', payload.signal);
          this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, { roomId: payload.roomId, signal: answer });
        } else if (payload.signal.type === 'answer') {
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(payload.signal));
          console.log('ok2', payload.signal);
        } else if (payload.signal.candidate) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(payload.signal));
          console.log('ok3', payload.signal);
        }
      },
    });
  }

  async unSubscribeEvent() {
    // todo
  }
}
