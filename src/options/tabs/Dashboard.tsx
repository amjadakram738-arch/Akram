import React, { useState, useEffect, useRef } from 'react';
import { DashboardStats } from '../../types/common';
import { formatNumber, formatDuration, formatTimeAgo, formatPercentage } from '../../utils/formatters';
import styles from './dashboard.module.css';

interface DailyData {
  date: string;
  translations: number;
  videos: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    stats: null,
    loading: true,
    error: null,
  });

  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stats = await chrome.storage.local.get([
        'totalTranslations',
        'totalVideos',
        'totalTimeSaved',
        'averageResponseTime',
        'accuracyRate',
        'topLanguages',
        'dailyStats',
      ]);

      const dailyStats = (stats.dailyStats as DailyData[]) || generateMockDailyData();
      setDailyData(dailyStats);

      setState({
        stats: {
          totalTranslations: (stats.totalTranslations as number) || 0,
          totalVideos: (stats.totalVideos as number) || 0,
          totalTimeSaved: (stats.totalTimeSaved as number) || 0,
          averageResponseTime: (stats.averageResponseTime as number) || 0,
          accuracyRate: (stats.accuracyRate as number) || 95,
          topLanguages: (stats.topLanguages as Array<{ language: string; count: number }>) || [
            { language: 'English', count: 100 },
            { language: 'Spanish', count: 75 },
            { language: 'French', count: 50 },
            { language: 'German', count: 30 },
            { language: 'Japanese', count: 25 },
          ],
          dailyUsage: dailyStats.map(d => ({ date: d.date, count: d.translations })),
          enginePerformance: [
            { engine: 'Google', success: 95, failure: 5 },
            { engine: 'DeepL', success: 98, failure: 2 },
            { engine: 'Libre', success: 88, failure: 12 },
            { engine: 'Microsoft', success: 92, failure: 8 },
          ],
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Failed to load statistics' }));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (state.loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const maxDaily = Math.max(...dailyData.map(d => d.translations), 1);

  return (
    <div className={styles.dashboard}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌍</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatNumber(state.stats?.totalTranslations || 0)}</span>
            <span className={styles.statLabel}>Total Translations</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📹</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatNumber(state.stats?.totalVideos || 0)}</span>
            <span className={styles.statLabel}>Videos Processed</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatDuration(state.stats?.totalTimeSaved || 0)}</span>
            <span className={styles.statLabel}>Time Saved</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{state.stats?.averageResponseTime || 0}ms</span>
            <span className={styles.statLabel}>Avg Response</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatPercentage(state.stats?.accuracyRate || 95)}</span>
            <span className={styles.statLabel}>Accuracy Rate</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>+{formatNumber(dailyData.reduce((sum, d) => sum + d.translations, 0))}</span>
            <span className={styles.statLabel}>This Week</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Daily Usage Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Daily Translations</h3>
          <div className={styles.barChart}>
            {dailyData.slice(-14).map((day, idx) => (
              <div key={idx} className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ height: `${(day.translations / maxDaily) * 100}%` }}
                  title={`${day.translations} translations`}
                />
                <span className={styles.barLabel}>{formatDate(day.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Performance */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Engine Performance</h3>
          <div className={styles.engineList}>
            {state.stats?.enginePerformance.map((engine, idx) => (
              <div key={idx} className={styles.engineItem}>
                <div className={styles.engineHeader}>
                  <span className={styles.engineName}>{engine.engine}</span>
                  <span className={styles.engineStats}>{engine.success}% success</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${engine.success}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Top Languages */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Top Languages</h3>
          <div className={styles.languageList}>
            {state.stats?.topLanguages.slice(0, 6).map((lang, idx) => (
              <div key={idx} className={styles.languageItem}>
                <span className={styles.rank}>{idx + 1}</span>
                <span className={styles.langName}>{lang.language}</span>
                <span className={styles.langCount}>{formatNumber(lang.count)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>🌍</span>
              <span className={styles.activityText}>Translation completed</span>
              <span className={styles.activityTime}>Just now</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>📹</span>
              <span className={styles.activityText}>Video detected: YouTube</span>
              <span className={styles.activityTime}>2 min ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>⚙️</span>
              <span className={styles.activityText}>Settings synced</span>
              <span className={styles.activityTime}>15 min ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>🔄</span>
              <span className={styles.activityText}>Language changed to Spanish</span>
              <span className={styles.activityTime}>1 hour ago</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityIcon}>🌍</span>
              <span className={styles.activityText}>50 translations completed</span>
              <span className={styles.activityTime}>2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Stats</h3>
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickLabel}>Sessions Today</span>
              <span className={styles.quickValue}>5</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickLabel}>Avg Session</span>
              <span className={styles.quickValue}>25 min</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickLabel}>Favorite Engine</span>
              <span className={styles.quickValue}>Google</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickLabel}>Last Update</span>
              <span className={styles.quickValue}>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateMockDailyData(): DailyData[] {
  const data: DailyData[] = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      translations: Math.floor(Math.random() * 100) + 20,
      videos: Math.floor(Math.random() * 10) + 1,
    });
  }
  
  return data;
}
