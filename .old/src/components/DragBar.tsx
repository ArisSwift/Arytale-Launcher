import React from "react";
import { useTranslation } from "react-i18next";

const DragBar: React.FC<{
  left?: React.ReactNode;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onSettingsClick?: () => void;
}> = ({ left, isDark, onToggleTheme, onSettingsClick }) => {
  const { t } = useTranslation();

  const handleMinimize = () => {
    window.ipcRenderer.send("minimize-window");
  };

  const handleToggleMaximize = () => {
    window.ipcRenderer.send("toggle-maximize-window");
  };

  const handleClose = () => {
    window.ipcRenderer.send("app:request-close");
  };

  const squareBtn =
    "no-drag w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200";

  return (
    <div
      id="frame"
      className="w-full h-16 flex items-center justify-between px-6 select-none relative z-[5000]"
    >
      {/* Left: offline banner / custom content */}
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-on-surface-muted)" }}>
        {left}
      </div>

      {/* Right: controls with dark background pill */}
      <div
        className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-xl"
        style={{ background: "rgba(0, 0, 0, 0.45)", backdropFilter: "blur(12px)" }}
      >
        {/* Theme toggle */}
        {onToggleTheme && (
          <button
            className={`${squareBtn} no-drag`}
            style={{ color: "rgba(255,255,255,0.7)" }}
            onClick={onToggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="0.5" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="13.5" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0.5" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="13.5" y1="8" x2="15.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2.768" y1="2.768" x2="4.182" y2="4.182" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="11.818" y1="11.818" x2="13.232" y2="13.232" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2.768" y1="13.232" x2="4.182" y2="11.818" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="11.818" y1="4.182" x2="13.232" y2="2.768" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 9.5a5.5 5.5 0 0 1-7-7 5.5 5.5 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}

        {/* Settings */}
        {onSettingsClick && (
          <button
            className={`${squareBtn} no-drag`}
            style={{ color: "rgba(255,255,255,0.7)" }}
            onClick={onSettingsClick}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13.27 5.83a1.1 1.1 0 0 0-.22-.06l-.84-.17a4.67 4.67 0 0 0-.35-.77l.43-.7a1.1 1.1 0 0 0-.1-1.38l-.78-.78a1.1 1.1 0 0 0-1.38-.1l-.7.43a4.67 4.67 0 0 0-.77-.35l-.17-.84a1.1 1.1 0 0 0-1.06-.8h-1.12a1.1 1.1 0 0 0-1.06.8l-.17.84a4.67 4.67 0 0 0-.77.35l-.7-.43a1.1 1.1 0 0 0-1.38.1l-.78.78a1.1 1.1 0 0 0-.1 1.38l.43.7a4.67 4.67 0 0 0-.35.77l-.84.17a1.1 1.1 0 0 0-.8 1.06v1.12a1.1 1.1 0 0 0 .8 1.06l.84.17c.09.26.2.52.35.77l-.43.7a1.1 1.1 0 0 0 .1 1.38l.78.78a1.1 1.1 0 0 0 1.38.1l.7-.43c.25.15.51.26.77.35l.17.84a1.1 1.1 0 0 0 1.06.8h1.12a1.1 1.1 0 0 0 1.06-.8l.17-.84c.26-.09.52-.2.77-.35l.7.43a1.1 1.1 0 0 0 1.38-.1l.78-.78a1.1 1.1 0 0 0 .1-1.38l-.43-.7c.15-.25.26-.51.35-.77l.84-.17a1.1 1.1 0 0 0 .8-1.06v-1.12a1.1 1.1 0 0 0-.8-1.06z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.2)" }} />

        {/* Window controls */}
        <button
          className={`${squareBtn} no-drag`}
          style={{ color: "rgba(255,255,255,0.7)" }}
          onClick={handleMinimize}
          title={t("common.minimize")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect y="7.5" width="16" height="1" rx="0.5" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`${squareBtn} no-drag`}
          style={{ color: "rgba(255,255,255,0.7)" }}
          onClick={handleToggleMaximize}
          title={t("common.maximize")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3.25" y="3.25" width="9.5" height="9.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <button
          className={`${squareBtn} no-drag hover:!bg-red-500/20 hover:!text-red-500`}
          style={{ color: "rgba(255,255,255,0.7)" }}
          onClick={handleClose}
          title={t("common.close")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="4.35355" y1="4.35355" x2="11.6464" y2="11.6464" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11.6464" y1="4.35355" x2="4.35355" y2="11.6464" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DragBar;
