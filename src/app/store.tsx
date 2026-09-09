import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type TabKey = "home" | "seasons" | "tasks" | "notifications" | "account";

export interface Route {
  name: string;
  params?: Record<string, string>;
}

interface NavState {
  tab: TabKey;
  stack: Route[];
  setTab: (t: TabKey) => void;
  go: (name: string, params?: Record<string, string>) => void;
  back: () => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const NavCtx = createContext<NavState | null>(null);
export const useNav = () => useContext(NavCtx)!;

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTabState] = useState<TabKey>("home");
  const [stack, setStack] = useState<Route[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const setTab = useCallback((t: TabKey) => {
    setTabState(t);
    setStack([]);
  }, []);
  const go = useCallback((name: string, params?: Record<string, string>) => {
    setStack((s) => [...s, { name, params }]);
  }, []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const value = useMemo<NavState>(
    () => ({
      tab,
      stack,
      setTab,
      go,
      back,
      toast,
      toastMsg,
      loggedIn,
      login: () => setLoggedIn(true),
      logout: () => {
        setLoggedIn(false);
        setTabState("home");
        setStack([]);
      },
    }),
    [tab, stack, setTab, go, back, toast, toastMsg, loggedIn],
  );

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}
