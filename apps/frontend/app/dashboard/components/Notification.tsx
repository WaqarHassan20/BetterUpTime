interface NotificationProps {
  type: 'error' | 'success';
  message: string;
  onClose: () => void;
}

export default function Notification({ type, message, onClose }: NotificationProps) {
  const styles = {
    error: "bg-red-900/50 border border-red-500 text-red-200",
    success: "bg-green-900/50 border border-green-500 text-green-200"
  };

  return (
    <div className={`${styles[type]} px-4 py-3 rounded-lg mb-6`}>
      {message}
      <button 
        onClick={onClose} 
        className="float-right text-lg leading-none hover:opacity-75"
      >
        ×
      </button>
    </div>
  );
}
