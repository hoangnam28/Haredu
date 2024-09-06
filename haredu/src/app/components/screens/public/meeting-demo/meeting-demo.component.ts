/* eslint-disable max-lines-per-function */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { DOCUMENT } from '@angular/common';
import { SOCKET_SCREEN_ACTION } from '#utils/const';
import { ISignalPayload, IUserJoinedPayload } from '#interfaces/meeting.interface';
import { vi } from 'date-fns/locale';

const peerConnectionConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@Component({
  selector: 'app-meeting-demo',
  templateUrl: './meeting-demo.component.html',
  styleUrls: ['./meeting-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingDemoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('videoContainer') videoContainer: ElementRef<HTMLElement>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected componentService: ComponentService,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
  }

  private localStream: MediaStream;
  private peers: { [key: string]: RTCPeerConnection } = {};

  get videoElements() {
    return this.videoContainer.nativeElement;
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    await this.getUserMedia();
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.JOIN, {
      roomId: '123',
    });

    this.subscribeUntilDestroy(
      this.socket.getMessage<ISignalPayload>(SOCKET_SCREEN_ACTION.SIGNAL),
      async ({ payload }) => {
        const peerConnection = this.peers[payload.from] || this.createPeerConnection(payload.from);
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
      },
    );

    this.subscribeUntilDestroy(
      this.socket.getMessage<IUserJoinedPayload>(SOCKET_SCREEN_ACTION.USER_JOINED),
      async ({ payload }) => {
        const peerConnection = this.createPeerConnection(payload.id);
        this.peers[payload.id] = peerConnection;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          roomId: payload.roomId,
          to: payload.id,
          signal: offer,
        });
      },
    );
  }

  createVideoElement(id: string) {
    const videoElement = this.document.createElement('video');
    videoElement.id = id;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    if (id === 'local') {
      videoElement.muted = true;
    }
    this.videoContainer.nativeElement.appendChild(videoElement);
    this.cdr.detectChanges();
    return videoElement;
  }

  async getUserMedia() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const localVideoElement = this.createVideoElement('local');
    localVideoElement.srcObject = this.localStream;
  }

  createPeerConnection(peerId: string) {
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
        const videoElement = this.createVideoElement(peerId);
        videoElement.srcObject = event.streams[0];
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, this.localStream));
    }

    return peerConnection;
  }
}
