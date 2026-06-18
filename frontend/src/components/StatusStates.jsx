import { AlertTriangle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-inksoft">
      <Loader2 size={26} className="animate-spin mb-3 text-azure" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <AlertTriangle size={26} className="text-amber mb-3" />
      <p className="text-sm text-ink font-medium">Data tidak dapat dimuat.</p>
      <p className="text-xs text-inksoft mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-azure hover:text-azuredeep"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
