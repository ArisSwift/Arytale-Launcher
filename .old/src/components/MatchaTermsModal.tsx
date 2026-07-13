import React from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import cn from "../utils/cn";

const MatchaTermsModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();

  if (!open) return null;
  if (typeof document === "undefined" || !document.body) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("friendsMenu.terms.title")}
    >
      <div
        className={cn(
          `
          relative w-[92vw] max-w-[1000px] h-[88vh] mx-auto
          rounded-xl
          shadow-2xl
          px-4 py-4
          flex flex-col animate-settings-in`,
        )}
        style={{
          background: "var(--modal-bg)",
          border: "1px solid var(--modal-border)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full transition flex items-center justify-center"
          style={{ background: "var(--card-bg)", color: "var(--text-on-surface-muted)", border: "1px solid var(--card-border)" }}
          onClick={onClose}
          title={t("common.close")}
        >
          <IconX size={18} />
        </button>

        <div className="flex items-center justify-between gap-3 mb-1 pr-12">
          <h2 className="text-lg font-semibold tracking-wide" style={{ color: "var(--text-on-surface)" }}>{t("friendsMenu.terms.title")}</h2>
        </div>
        <div className="text-xs" style={{ color: "var(--text-on-surface-muted)" }}>{t("friendsMenu.terms.lastUpdated")}</div>

        <div className="mt-3 flex-1 min-h-0 rounded-lg overflow-auto dark-scrollbar p-3 text-sm whitespace-pre-wrap leading-relaxed"
             style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-on-surface)" }}>
          {t("friendsMenu.terms.body")}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MatchaTermsModal;
