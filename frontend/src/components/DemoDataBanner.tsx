import { useState } from 'react';
import { loadDemo } from '../api/client';

interface DemoDataBannerProps {
  onLoaded?: () => void;
}

function DemoDataBanner({ onLoaded }: DemoDataBannerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);

    try {
      await loadDemo();
      setSuccess(true);
      
      // Show success briefly, then trigger callback
      setTimeout(() => {
        onLoaded?.();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo data');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="demo-banner demo-banner-success">
        <span className="banner-icon">✅</span>
        <span className="banner-message">Demo data loaded successfully! Refreshing...</span>
      </div>
    );
  }

  return (
    <div className="demo-banner demo-banner-warning">
      <span className="banner-icon">⚠️</span>
      <span className="banner-message">
        Demo data not loaded. Please load demo data first.
      </span>
      <button
        onClick={handleLoadDemo}
        disabled={loading}
        className="btn btn-demo-load"
      >
        {loading ? 'Loading...' : 'Load Demo Data'}
      </button>
      {error && <span className="banner-error">{error}</span>}
    </div>
  );
}

export default DemoDataBanner;
