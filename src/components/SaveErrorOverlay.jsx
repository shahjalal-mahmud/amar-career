export default function SaveErrorOverlay({ message }) {
  if (!message) return null

  return (
    <div className="save-error-overlay" role="alert">
      ⚠ {message}
    </div>
  )
}