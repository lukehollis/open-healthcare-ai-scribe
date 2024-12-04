import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { PluginKey } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

export interface HomeInitialState {
  apiKey: string;
  pluginKeys: PluginKey[];
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: OpenAIModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showChatbar: boolean;
  showPromptbar: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: OpenAIModelID | undefined;
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
  promptModalVisible: boolean;
  activePromptIndex: number;
  promptVariables: any;
  textInputContent: string;
  recording: boolean;
  transcribingAudio: boolean;
}

export const initialState: HomeInitialState = {
  apiKey: '',
  loading: false,
  pluginKeys: [],
  lightMode: 'dark',
  messageIsStreaming: false,
  modelError: null,
  models: [],
  "folders": [
    {
      "id": "2ffea20d-f7d2-42f3-896d-a7f3e35a678b",
      "name": "Screenings/Vaccinations",
      "type": "prompt"
    },
    {
      "id": "6d7a6cc2-75f6-44b0-8674-955140ff25ae",
      "name": "Patient Progress/History",
      "type": "prompt"
    },
    {
      "id": "c1a2ba86-cbcc-452a-93b3-4890283402a2",
      "name": "Office & Miscellaneous",
      "type": "prompt"
    },
    {
      "id": "b108a1c5-1baa-4197-9b79-4db2a267d11b",
      "name": "Patient Care Resources",
      "type": "prompt"
    }
  ],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [
    {
      "id": "5329819d-8c8e-40d9-b415-80d6e2694928",
      "name": "Preauthorize Procedure",
      "description": "A preauthorize procedure, also known as prior authorization, is a process in which providers must obtain approval from an insurance company or payer before performing a specific medical procedure or prescribing certain medications. ",
      "content": "Procedure/Medication Details:\n{{ProcedureOrMedicationDetails}}\n\nMedical Justification:\n{{MedicalJustification}}\n\nSupporting Documentation:\n{{SupportingDocumentation}}\n\nInsurance/Payer Information:\n{{InsuranceOrPayerInformation}}\n\nSubmission Details:\n{{SubmissionDetails}}\n\nFollow-Up:\n{{FollowUp}}",
      "model": {
        "id": "gpt-4",
        "name": "GPT-4",
        "maxLength": 24000,
        "tokenLimit": 8000
      },
      "folderId": null
    },
    {
      "id": "db22f728-d3a9-4984-b883-9ddbe18cee29",
      "name": "History & Physical",
      "description": "A History and Physical (H&P) is a detailed assessment to gather information about a patient's medical history, current complaints, and physical examination findings.",
      "content": "Generate an H&P for a patient given the following inputs:\nChief Complaint:\n{{ChiefComplaint}}\n\nHistory of Present Illness:\n{{HistoryOfPresentIllness}}\n\nPast Medical History:\n{{PastMedicalHistory}}\n\nMedications:\n{{Medications}}\n\nAllergies:\n{{Allergies}}\n\nFamily History:\n{{FamilyHistory}}\n\nSocial History:\n{{SocialHistory}}\n\nReview of Systems:\n{{ReviewOfSystems}}\n\nPhysical Examination:\n{{PhysicalExamination}}\n\nAssessment and Plan:\n{{AssessmentAndPlan}}",
      "model": {
        "id": "gpt-4",
        "name": "GPT-4",
        "maxLength": 24000,
        "tokenLimit": 8000
      },
      "folderId": null
    },
    {
      "id": "3d6de702-a716-45ac-8404-d987d630ba9e",
      "name": "Progress Note",
      "description": "A progress note is a concise and organized documentation of a patient's ongoing medical care during a particular visit or hospital stay. It serves as a communication tool, providing a summary of the patient's condition, progress, and any changes in treatment.",
      "content": "Generate a progress note for a patient given the following information about the visit: \n\nSubjective:\n{{Subjective}}\n\nObjective:\n{{Objective}}\n\nAssessment:\n{{Assessment}}\n\nPlan:\n{{Plan}}\n\nResponse:\n{{Response}}\n\nPlan for Discharge:\n{{PlanForDischarge}}",
      "model": {
        "id": "gpt-4",
        "name": "GPT-4",
        "maxLength": 24000,
        "tokenLimit": 8000
      },
      "folderId": null
    },
    {
      "id": "ee1c23bc-4aa3-45ff-9e37-5225b8eae14d",
      "name": "Patient Communication",
      "description": "A general patient communication form to be used for generating instructions for patients, before or after care and for general health education.",
      "content": "Type of Communication:\n{{Type of Communication}}\n\nInstructions:\n{{Instructions}}\n\nHealth Education Tips:\n{{HealthEducationTips}}\n\nFollow up:\n{{FollowUp}}",
      "model": {
        "id": "gpt-4",
        "name": "GPT-4",
        "maxLength": 24000,
        "tokenLimit": 8000
      },
      "folderId": null
    },
  ],
  temperature: 1,
  showPromptbar: false,
  showChatbar: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  serverSidePluginKeysSet: false,
  promptModalVisible: false,
  activePromptIndex: 0,
  promptVariables: [],
  textInputContent: '',
  recording: false,
  transcribingAudio: false,
};
