export interface MediaStreamRecorder {
  startRecording?: () => void;
  stopRecording?: (callback: () => void) => void;
  getBlob?: () => Blob;
};
