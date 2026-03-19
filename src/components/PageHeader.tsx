interface PageHeaderProps {
  onLeft: () => void;
  leftIcon: "back" | "close";
  title: string;
  subtitle?: string;
  onSave: () => void;
}

export function PageHeader({ onLeft, leftIcon, title, subtitle, onSave }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
      <button
        onClick={onLeft}
        className="text-gray-500 hover:text-gray-700 p-1 flex items-center gap-1"
      >
        {leftIcon === "back" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </button>
      <div className="text-center">
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate max-w-50">{subtitle}</p>
        )}
      </div>
      <button
        onClick={onSave}
        className="text-[#5bc5a7] font-semibold text-base hover:text-[#4aad91]"
      >
        Save
      </button>
    </div>
  );
}
