export interface Recording {
  recordID: string,
  meetingID: string,
  internalMeetingID: string;
  name: string;
  isBreakout: boolean;
  published: boolean;
  state: string;
  startTime: number;
  endTime: number;
  participants: number;
  rawSize: number;
  metadata: {
      "bbb-origin-version": string;
      meetingName: string;
      meetingId: string;
      "gl-listed": boolean;
      "bbb-origin": string;
      "isBreakout": boolean;
      "bbb-origin-server-name": string;
  },
  size: number;
  playback: {
      format: {
          type: string;
          url: string;
          processingTime: number;
          length: number;
          size: number;
          preview?: {
            images: {
              image: string[];
            }
          }
      }
  },
  data: string;
  appState: 'none' | 'inprogress' | 'done'
}
