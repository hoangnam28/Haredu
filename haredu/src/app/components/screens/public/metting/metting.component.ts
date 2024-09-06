import { UserProfileService } from '#services/user-profile.service';
/* eslint-disable max-lines-per-function */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Inject,
  HostListener,
} from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import {
  IMember,
  IMessPayload,
  ISignalPayload,
  IUserJoinedPayload,
  IUserLeftPayload,
} from '#interfaces/meeting.interface';
import { SOCKET_SCREEN_ACTION } from '#utils/const';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BaseSocketService } from '#services/socket.service';

const peerConnectionConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@Component({
  selector: 'app-metting',
  templateUrl: './metting.component.html',
  styleUrls: ['./metting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MettingComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('videoContainer') videoContainer: ElementRef<HTMLElement>;
  @ViewChild('membersContainer') membersContainer: ElementRef<HTMLElement>;
  private localStream: MediaStream;
  screenStream: MediaStream;
  private peers: { [key: string]: RTCPeerConnection } = {};
  isOnCamera = true;
  isOnMicro = true;
  isShowLocalVideo = true;
  members: IMember[] = [];
  visible = false;
  isShareScreen = false;
  isShowMess = false;
  mess = '';
  messages: IMessPayload[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private activetedRoute: ActivatedRoute,
    private userProfileService: UserProfileService,
    private socketConnect: BaseSocketService,
  ) {
    super(componentService);
  }

  get videoElements() {
    return this.videoContainer.nativeElement;
  }

  get roomId() {
    return this.activetedRoute.snapshot.params.id;
  }

  get currentMember() {
    return this.members.find((member) => member.userId === this.userProfileService.currentUser._id);
  }

  get hostUser() {
    return this.members.find((member) => member.isHost);
  }

  async ngOnInit() {
    this.socketConnect.connectSocket();
  }

  async ngAfterViewInit() {
    await this.getFirstLocalMedia();

    this.subscribeUntilDestroy(
      this.socket.getMessage<ISignalPayload>(SOCKET_SCREEN_ACTION.SIGNAL),
      async ({ payload }) => {
        const peerConnection =
          this.peers[payload.from] || this.createPeerConnection(payload.from, payload.isHost, payload.userId);
        this.peers[payload.from] = peerConnection;

        if (payload.signal.type === 'offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.signal));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
            to: payload.from,
            signal: answer,
            userId: this.userProfileService.currentUser._id,
            userName: payload.userName,
            isHost: payload.isHost,
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
        this.componentService.toast.success(`'User ${payload.userName} join the room'`);
        this.members = payload.room.members;
        this.cdr.detectChanges();
        this.setHostLocal();
        const peerConnection = this.createPeerConnection(payload.id, payload.isHost, payload.userId);
        this.peers[payload.id] = peerConnection;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          to: payload.id,
          signal: offer,
          userId: this.userProfileService.currentUser._id,
          userName: payload.userName,
          isHost: payload.isHost,
        });
      },
    );

    this.subscribeUntilDestroy(
      this.socket.getMessage<IUserLeftPayload>(SOCKET_SCREEN_ACTION.USER_LEFT),
      async ({ payload }) => {
        if (this.peers[payload.id]) {
          this.peers[payload.id].close();
          delete this.peers[payload.id];
          const videoElement = document.getElementById('member-video-container' + payload.id);
          if (videoElement) {
            this.membersContainer.nativeElement.removeChild(videoElement);
            this.componentService.toast.success(`'User ${payload.userLeft} left the room'`);
          }
        }
        console.log('🚀 ~ MettingComponent ~ peers:');
      },
    );

    this.subscribeUntilDestroy(
      this.socket.getMessage<IMessPayload>(SOCKET_SCREEN_ACTION.MESSAGE),
      async ({ payload }) => {
        this.messages.push(payload);
        this.cdr.detectChanges();
      },
    );
  }

  setHostLocal() {
    const local = document.getElementById('local')! as HTMLVideoElement;
    if (this.currentMember?.isHost) {
      local.classList.add('host-video');
    }
  }

  async shareScreen() {
    try {
      this.isShareScreen = true;
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenVideoElement = this.createVideoElement('screen');
      screenVideoElement.srcObject = this.screenStream;
      screenVideoElement.style.zIndex = '15';
      screenVideoElement.style.position = 'relative';

      const videoTrack = this.screenStream.getVideoTracks()[0];

      videoTrack.onended = () => {
        this.stopScreen();
      };

      //local video or host video
      if (this.currentMember?.isHost) {
        const localVideo = document.getElementById('local')! as HTMLVideoElement;
        localVideo.classList.remove('host-video');
        screenVideoElement.classList.add('host-video');
      } else {
        const remoteHost = document.getElementById(this.hostUser?.clientId ?? '') as HTMLVideoElement;
        if (remoteHost) remoteHost.classList.add('host-video');
      }

      // Add screen stream to all peer connections
      Object.entries(this.peers).forEach(([peerId, peerConnection]) => {
        this.screenStream.getTracks().forEach((track) => {
          const sender = peerConnection.getSenders().find((s) => s.track && s.track.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            peerConnection.addTrack(track, this.screenStream);
          }
        });

        // Renegotiate the connection
        this.renegotiate(peerId, peerConnection);
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }

  async stopScreen() {
    if (!this.screenStream) return;

    this.isShareScreen = false;
    // Stop each track on the screen stream
    this.screenStream.getTracks().forEach((track) => track.stop());

    const screenVideoElement = document.getElementById('screen');

    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const localVideo = document.getElementById('local')! as HTMLVideoElement;
    localVideo.srcObject = cameraStream;
    if (screenVideoElement) {
      this.videoContainer.nativeElement.removeChild(screenVideoElement);
    }

    if (this.currentMember?.isHost) {
      localVideo.classList.add('host-video');
    } else {
      const remoteHost = document.getElementById(this.hostUser?.clientId ?? '') as HTMLVideoElement;
      if (remoteHost) remoteHost.classList.add('host-video');
    }

    // Replace screen stream tracks with camera stream tracks in all peer connections
    Object.entries(this.peers).forEach(([peerId, peerConnection]) => {
      cameraStream.getTracks().forEach((track) => {
        const sender = peerConnection.getSenders().find((s) => s.track && s.track.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          peerConnection.addTrack(track, cameraStream);
        }
      });

      // Renegotiate the connection
      this.renegotiate(peerId, peerConnection);
    });

    // Reset the host video class settings if necessary
    localVideo.classList.add('host-video');
    if (this.currentMember?.isHost) {
      localVideo.classList.add('host-video');
    } else {
      const remoteHost = document.getElementById(this.hostUser?.clientId ?? '') as HTMLVideoElement;
      if (remoteHost) remoteHost.classList.remove('host-video');
    }
  }

  async getDisplayMedia() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const videoElement = this.document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    this.videoContainer.nativeElement.appendChild(videoElement);
  }

  async renegotiate(peerId: string, peerConnection: RTCPeerConnection) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
      to: peerId,
      signal: offer,
    });
  }

  async startCall() {
    this.isShowLocalVideo = false;
    await this.getUserMedia();
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.JOIN, {
      roomId: this.roomId,
      userName: this.userProfileService.currentUser.name,
      userId: this.userProfileService.currentUser._id,
      role: this.userProfileService.currentUser.role,
    });
    this.cdr.detectChanges();
  }

  createVideoElement(id: string) {
    const videoElement = this.document.createElement('video');
    videoElement.id = id;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    if (id === 'local') videoElement.muted = true;
    this.videoContainer.nativeElement.appendChild(videoElement);
    this.cdr.detectChanges();
    return videoElement;
  }

  createMemberElement(id: string) {
    const videoElement = this.document.createElement('video');
    videoElement.id = id;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    const memberName = this.document.createElement('div');
    memberName.className = 'member-name';
    memberName.innerText = this.getMemberByPeerId(id)?.userName ?? '';

    const videoContainer = this.document.createElement('div');
    videoContainer.className = 'member-video-container';
    videoContainer.id = 'member-video-container' + id;
    videoContainer.onclick = () => this.showFullScreen(id);
    videoContainer.appendChild(memberName);
    videoContainer.appendChild(videoElement);

    this.membersContainer.nativeElement.appendChild(videoContainer);
    this.cdr.detectChanges();
    return videoElement;
  }

  async getUserMedia() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: this.isOnCamera,
      audio: this.isOnMicro,
    });
    const localVideoElement = this.createVideoElement('local');
    localVideoElement.srcObject = this.localStream;
    // localVideoElement.localVideoElement.requestFullscreen();
  }

  async getFirstLocalMedia() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const localVideo = this.document.getElementById('localVideo')! as HTMLVideoElement;
    localVideo.srcObject = this.localStream;
  }

  createPeerConnection(peerId: string, isHost: boolean = false, userId: string) {
    const peerConnection = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.sendMessage(SOCKET_SCREEN_ACTION.SIGNAL, {
          to: peerId,
          signal: event.candidate,
          isHost,
          userId: userId,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (!this.document.getElementById(peerId) && this.currentMember?.clientId !== peerId) {
        if (this.hostUser?.clientId !== peerId) {
          const videoElement = this.createMemberElement(peerId);
          videoElement.srcObject = event.streams[0];
        } else {
          const videoElement = this.createVideoElement(peerId);
          videoElement.srcObject = event.streams[0];
          videoElement.classList.add('host-video');
        }
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, this.localStream));
    }

    return peerConnection;
  }

  showCamera(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.isOnCamera = videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    this.isOnCamera = false;
    return false;
  }

  showMicro() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.isOnMicro = audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    this.isOnMicro = false;
    return false;
  }

  leftRoom() {
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.LEAVE, {
      roomId: this.roomId,
      userId: this.userProfileService.currentUser._id,
      userName: this.userProfileService.currentUser.name,
    });
    this.localStream.getTracks().forEach((track) => track.stop());
  }

  @HostListener('window:beforeunload', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unloadNotification($event: any) {
    this.leftRoom();
  }

  showUserList() {
    this.closeMes();
    this.visible = !this.visible;
  }

  close(): void {
    this.visible = false;
  }

  showMessageList() {
    this.close();
    this.isShowMess = true;
  }

  closeMes() {
    this.isShowMess = false;
  }

  getMemberByPeerId(peerId: string) {
    return this.members.find((member) => member.clientId === peerId);
  }

  sendMessage() {
    this.socket.sendMessage(SOCKET_SCREEN_ACTION.MESSAGE, {
      roomId: this.roomId,
      userId: this.userProfileService.currentUser._id,
      userName: this.userProfileService.currentUser.name,
      message: this.mess,
    });
    this.mess = '';
  }

  showFullScreen(id: string) {
    const videoElement = document.getElementById(id) as HTMLVideoElement;
    if (videoElement) videoElement.requestFullscreen();
  }

  protected override preDestroy(): void {
    this.leftRoom();
  }
}
