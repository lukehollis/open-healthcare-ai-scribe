import {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import axios from 'axios';
import HomeContext from '@/pages/api/home/home.context';

import {
  IconMicrophone,
} from '@tabler/icons-react';
import { Message, Role } from '@/types/chat';
import { Plugin } from '@/types/plugin';
import { MediaStreamRecorder } from '@/types/mediaStreamRecorder';

let RecordRTC: any;


interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
  messageIsStreaming: boolean;
}

export const ChatInputMicButton = ({
  onSend,
  messageIsStreaming,
}: Props) => {
  const recordRTC = useRef<MediaStreamRecorder | null>(null);
  const {
    state: { recording, transcribingAudio },
    dispatch: homeDispatch,
    handleCreateFolder,
    handleNewConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleStartRecording = () => {
    console.log("handle start recording");
    
    // Check if code is running on client
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          recordRTC.current = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/mp3',
          });
          if (recordRTC.current?.startRecording) {
            recordRTC.current.startRecording();
          }
          homeDispatch({ field: 'recording', value: true });
        }).catch(function(error) {
          console.error(error);
        });
    } else {
      console.error("Audio recording not supported");
    }
  };

  const handleStopRecording = () => {
    console.log("handle stop recording");
    homeDispatch({ field: 'recording', value: false });

    if (recordRTC.current?.stopRecording) {
      recordRTC.current.stopRecording(async function() {
        homeDispatch({ field: 'transcribingAudio', value: true });

        let blob;
        if (recordRTC.current?.getBlob) {
          blob = recordRTC.current.getBlob();

          let formData = new FormData();
          formData.append("file", blob, 'audio.mp4');
          formData.append('model', 'whisper-1');

          try {
            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
              headers: {
                'Authorization': `Bearer sk-proj-`,
                'Content-Type': 'multipart/form-data',
              },
            });

            // Note: with axios, you can directly access the data property
            homeDispatch({ field: 'transcribingAudio', value: false });

            // set new message from audio
            const message = { 
              role: 'user' as Role, 
              content: response.data.text,
            };

            console.log(message);
            onSend(message, null);

          } catch (error) {
            console.error('Error fetching the transcription', error);
            homeDispatch({ field: 'transcribingAudio', value: false });
          }

        }
      });
    }
  };


  // Event Handler for key down
  const handleKeyDown = (event: any) => {
    if (event.code === 'Space' && !(document.activeElement instanceof HTMLTextAreaElement)) {
      event.preventDefault();

      if (!event.repeat && !recording) {
        handleStartRecording(); // Start recording when the spacebar is pressed
      }
    }
  };

  // Event Handler for key up
  const handleKeyUp = (event: any) => {
    if (event.code === 'Space' && !(document.activeElement instanceof HTMLTextAreaElement)) {
      event.preventDefault();
      handleStopRecording(); // Stop recording when the spacebar is released
    }
  };

  // bind voice mode events 
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      handleStopRecording(); // Stop recording when the component unmounts
    }
  }, []); 

  useEffect(() => {
    import('recordrtc').then((R) => {
      RecordRTC = R.default || R;
    });
  }, []);

  return (
    <button
      className={`ml-1 rounded-sm p-1 text-neutral-800  hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200 ${recording ? 'chatbar-button-is-recording' : transcribingAudio ? 'bg-gray-200 dark:bg-gray-700' : 'opacity-60'}`}
      onClick={recording ? handleStopRecording : handleStartRecording}
    >
      {messageIsStreaming ? '' : (
        <IconMicrophone size={18} />
      )}
    </button>
  );
}
