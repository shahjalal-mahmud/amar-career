import { Component } from 'react'

/**
 * Catches any render-time error in its child subtree and shows a fallback
 * UI instead of taking the whole app down. Per project.md §8, a single
 * page crash shouldn't break the sidebar/navigation — so we wrap the main
 * page content, not the entire shell.
 *
 * Notes:
 * - ErrorBoundaries must be class components (React limitation).
 * - We intentionally do NOT swallow the original error: it's logged to the
 *   console so the author can still debug. The user just sees a friendlier
 *   screen with a reload button.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught error:', error, info)
  }

  handleReload = () => {
    // Reset boundary state and reload the current page.
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="page"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: 520,
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>💥</div>
          <h2
            className="page-title"
            style={{ fontSize: 22, marginBottom: 8 }}
          >
            Something went wrong
          </h2>
          <p
            className="empty-sub"
            style={{ marginBottom: 4, fontSize: 14 }}
          >
            A component on this page crashed. The rest of the app is still working —
            reload this view to try again.
          </p>
          {this.state.error?.message && (
            <pre
              style={{
                margin: '14px auto 0',
                padding: '10px 14px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 8,
                color: '#f87171',
                fontSize: 12,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginTop: 22,
              flexWrap: 'wrap',
            }}
          >
            <button type="button" className="btn-primary" onClick={this.handleReload}>
              ↻ Reload page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                border: '1px solid var(--input-border)',
                background: 'transparent',
                color: 'var(--label-color)',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }
}
