import React, { useState } from 'react';
import { TabNavigation } from '../shared/components/TabNavigation';
import { Dashboard } from './tabs/Dashboard';
import { GeneralSettings } from './tabs/GeneralSettings';
import { TranslationSettings, AudioSettingsTab, DisplaySettingsTab, PerformanceSettingsTab, PrivacySettingsTab, IntegrationsSettingsTab, AdvancedSettingsTab } from './tabs/RemainingTabs';
import styles from './options.module.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'translation', label: 'Translation', icon: '🌍' },
  { id: 'audio', label: 'Audio', icon: '🔊' },
  { id: 'display', label: 'Display', icon: '📺' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
  { id: 'advanced', label: 'Advanced', icon: '🛠️' },
];

export const OptionsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'general': return <GeneralSettings />;
      case 'translation': return <TranslationSettings />;
      case 'audio': return <AudioSettingsTab />;
      case 'display': return <DisplaySettingsTab />;
      case 'performance': return <PerformanceSettingsTab />;
      case 'privacy': return <PrivacySettingsTab />;
      case 'integrations': return <IntegrationsSettingsTab />;
      case 'advanced': return <AdvancedSettingsTab />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/icons/icon48.png" alt="Logo" />
          <span>Video Translator</span>
        </div>
        <TabNavigation 
          tabs={TABS} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </aside>
      <main className={styles.content}>
        <header className={styles.header}>
          <h1>{TABS.find(t => t.id === activeTab)?.label}</h1>
        </header>
        <div className={styles.tabContent}>
          {renderTab()}
        </div>
      </main>
    </div>
  );
};
