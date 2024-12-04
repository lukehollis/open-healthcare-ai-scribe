import {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import HomeContext from '@/pages/api/home/home.context';
import { Message, Role } from '@/types/chat';
import { Plugin } from '@/types/plugin';
import { MediaStreamRecorder } from '@/types/mediaStreamRecorder';

let RecordRTC: any;

interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
}

export const ChatStartOfficeVisit = ({
  onSend,
}: Props) => {
  const { t } = useTranslation('chat');
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
            const messageContent = `This is an automated transcription of my patient visit. Write a progress note for the visit. Include ICD 10 and CPT codes. Here is the transcription: ${response.data.text}`;

            // set new message from audio
            const message = { 
              role: 'user' as Role, 
              content: messageContent, 
            };
            onSend(message, null);

          } catch (error) {
            console.error('Error fetching the transcription', error);
            homeDispatch({ field: 'transcribingAudio', value: false });
          }

        }
      });
    } 
  };


  useEffect(() => {
    import('recordrtc').then((R) => {
      RecordRTC = R.default || R;
    });
  }, []);

  return (
    <div 
      className={`flex flex-col h-full space-y-4 rounded-lg border border-neutral-200 px-6 dark:border-neutral-600 cursor-pointer hover:bg-gray-100/30 dark:hover:bg-gray-700 record-button ${recording ? 'is-recording' : ''}`} 
      onClick={recording ? handleStopRecording : handleStartRecording} 
    >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2  items-center">
        <div className="relative h-12 w-12 sm:h-40 sm:w-40">
          <img 
            src="/diagnosis.png" 
            className="absolute h-12 w-12 sm:h-40 sm:w-40 object-contain object-center " 
            style={{
              width: "50%",
              height: "50%",
              top: "25%",
              left: "30%",
            }}
          />
        </div>

        <div className="text-left col-span-2">
          <h3 className="text-xs sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
            {t("Start Office Visit")}
          </h3>
          <p className="text-xs sm:text-base text-neutral-500 dark:text-neutral-300">
            {t("Click to record, transcribe, and write a progress note for an office visit.")}
          </p>
        </div>
      </div>
    </div>
  );
}
