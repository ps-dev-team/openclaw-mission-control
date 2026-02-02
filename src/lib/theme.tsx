'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type AgentState = 'online' | 'idle' | 'offline';

interface ThemeContextValue {
  theme: Theme;
  agentState: AgentState;
  setAgentState: (state: AgentState) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  agentState: 'offline',
  setAgentState: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Theme is driven by agent state, NOT a toggle:
 * - online → light mode
 * - idle / offline → dark mode
 */
function agentStateToTheme(state: AgentState): Theme {
  return state === 'online' ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [agentState, setAgentState] = useState<AgentState>('offline');
  const theme = agentStateToTheme(agentState);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, agentState, setAgentState }}>
      {children}
    </ThemeContext.Provider>
  );
}
