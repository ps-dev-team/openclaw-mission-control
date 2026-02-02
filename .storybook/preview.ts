import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme mode',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      return (
        <div className={theme === 'dark' ? 'dark' : ''}>
          <div
            style={{
              backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F0EEEB',
              color: theme === 'dark' ? '#E1E1E1' : '#111111',
              padding: '2rem',
              minHeight: '100vh',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
