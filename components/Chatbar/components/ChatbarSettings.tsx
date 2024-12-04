import { IconFileExport, IconSettings, IconMessagePlus, IconDatabase, IconBuildingHospital } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';
import { TypeformDialog } from '@/components/Settings/TypeformDialog';


import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);
  const [isTypeformDialogOpen, setIsTypeformDialog] = useState<boolean>(false);

  const {
    state: {
      apiKey,
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <SidebarButton
        text={t('Provider Signup/Login')}
        icon={<IconBuildingHospital size={18} />}
        onClick={() => setIsTypeformDialog(true)}
        featured
      />

      <SidebarButton
        text={t('Connect EHR')}
        icon={<IconDatabase size={18} />}
        onClick={() => setIsTypeformDialog(true)}
      />

      <SidebarButton
        text={t('Add data for smarter text')}
        icon={<IconMessagePlus size={18} />}
        onClick={() => setIsTypeformDialog(true)}
      />


      <Import onImport={handleImportConversations} />

      <SidebarButton
        text={t('Export templates')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      />

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

      {!serverSideApiKeyIsSet ? (
        <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      ) : null}

      {!serverSidePluginKeysSet ? <PluginKeys /> : null}

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
      <TypeformDialog
        open={isTypeformDialogOpen}
        onClose={() => {
          setIsTypeformDialog(false);
        }}
      />
    </div>
  );
};
