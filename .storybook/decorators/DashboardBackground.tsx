import type { Decorator } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';

function DashboardBg({ children, theme }: { children: ReactNode; theme: string }) {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'auto',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/bg-dashboard.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: isDark ? 'rgba(26, 26, 26, 0.7)' : 'rgba(240, 238, 235, 0.7)',
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '2rem',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const withDashboardBackground: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <DashboardBg theme={theme}>
        <Story />
      </DashboardBg>
    </div>
  );
};
