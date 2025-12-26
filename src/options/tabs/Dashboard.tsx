import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../../types/common';
import styles from '../options.module.css';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATISTICS' }, (response) => {
      if (response && response.stats) {
        setStats(response.stats);
      }
    });
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <StatCard 
          title="Total Videos"
          value={stats?.totalVideos || 0}
          icon="📹"
        />
        <StatCard 
          title="Total Translations"
          value={stats?.totalTranslations || 0}
          icon="🌍"
        />
        <StatCard 
          title="Avg Response"
          value={`${stats?.averageResponseTime || 0}ms`}
          icon="⚡"
        />
        <StatCard 
          title="Accuracy"
          value={`${stats?.accuracyRate || 100}%`}
          icon="✅"
        />
      </div>

      <div className={styles.recentActivity}>
        <h3>Recent Activity</h3>
        <div className={styles.placeholderChart}>
           {/* Chart.js would go here */}
           <p>Usage chart visualization placeholder</p>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className={styles.statCard}>
    <span className={styles.statIcon}>{icon}</span>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statTitle}>{title}</span>
    </div>
  </div>
);
