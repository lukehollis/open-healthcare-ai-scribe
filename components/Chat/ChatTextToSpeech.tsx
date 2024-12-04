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

export const ChatTextToSpeech = ({
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


  useEffect(() => {
    import('recordrtc').then((R) => {
      RecordRTC = R.default || R;
    });
  }, []);

  return (
    <div 
      className={`mt-4 flex flex-col h-full space-y-4 rounded-lg border border-neutral-200 px-6 py-6 dark:border-neutral-600 cursor-pointer hover:bg-gray-100/30 dark:hover:bg-gray-700 record-button ${recording ? 'is-recording' : ''}`} 
      onClick={recording ? handleStopRecording : handleStartRecording} 
    >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2  items-center">
        <div className="relative h-12 w-12 sm:h-40 sm:w-40">

          <div className="absolute rounded-full border border-gray-200 opacity-0 transition-all w-full h-full record-button-ring">
          </div>
          <div className="absolute rounded-full hidden sm:block sm:p-2 bg-gray-300/10 w-full h-full">
          </div>
          <div 
            className={`absolute rounded-full sm:p-12 bg-gray-400/10 transition-all recording-button-inner hidden sm:block`} 
            style={{
              width: "90%",
              height: "90%",
              top: "5%",
              left: "5%",
            }}
          >
          </div>
          {transcribingAudio ? 
            <div 
              className="flex items-center justify-center p-5 absolute"
              style={{
                width: "30%",
                height: "30%",
                top: "35%",
                left: "35%",
              }}
            >
              <div className="flex space-x-2 animate-pulse">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          :
            <img 
              src="/voice-search.png" 
              className="absolute h-10 w-10 object-contain object-center " 
              style={{
                width: "30%",
                height: "30%",
                top: "35%",
                left: "35%",
              }}
            />
          }
        </div>

        <div className="text-left col-span-2">
          <h3 className="text-xs sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
            {recording ? t("Recording") : transcribingAudio ? t("Transcribing") : t("Voice Mode")}
          </h3>
          <p className="text-xs sm:text-base text-neutral-500 dark:text-neutral-300">
            {recording ? t("Click again or stop holding spacebar to stop.") : transcribingAudio ? t("One moment while your voice is transcribed.") : t("Dictate instructions by holding spacebar or clicking here.")}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-4">
            Try saying &quot;Write a progress note about a patient with symptoms . . . and include the ICD 10 and CPT codes.&quot; 
          </p>
        </div>
      </div>
    </div>
  );
}
