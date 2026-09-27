interface ConnectionBadgeProps {
  isConnected: boolean;
}

export const ConnectionBadge = ({ isConnected }: ConnectionBadgeProps) => (
  <span
    className={`badge ${isConnected ? 'badge-online' : 'badge-offline'}`}
    role="status"
    aria-live="polite"
  >
    <span className="badge-dot" aria-hidden="true" />
    {isConnected ? 'Connected' : 'Reconnecting'}
  </span>
);
