export default function CustomModal({
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>{message}</h3>

        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: "#1976d2",
            color: "white",
            border: "none",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}