'use client';

import React, { useState } from 'react';

export default function CloudinaryVerificationTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      } else {
        throw new Error('Please select a file or enter an image URL.');
      }

      const res = await fetch('/api/cloudinary-verify', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status} Error`);
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || 'Cloudinary AI Vision verification test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'monospace', backgroundColor: '#090d16', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px', color: '#38bdf8' }}>
          VERIFICATION: Cloudinary AI Vision General (`ai_vision_general`) API Test Bench
        </h1>

        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', color: '#94a3b8', marginTop: 0 }}>Input Test Asset</h2>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Option A: Upload File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              style={{ background: '#1e293b', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #334155' }}
            />
            {file && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#a7f3d0' }}>Selected: {file.name}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Option B: Remote Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setFile(null);
              }}
              style={{ width: '100%', padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Calling Official Cloudinary Analyze API...' : 'Call Cloudinary ai_vision_general API'}
          </button>
        </div>

        {error && (
          <div style={{ padding: '16px', background: '#450a0a', border: '1px solid #991b1b', borderRadius: '8px', color: '#fca5a5', marginBottom: '24px' }}>
            <strong>Cloudinary API Error Logged:</strong>
            <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{error}</pre>
          </div>
        )}

        {result && (
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Identity */}
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#4ade80', margin: '0 0 12px 0', fontSize: '15px' }}>✓ Uploaded Cloudinary Asset Identity</h3>
              <div><strong>Asset ID:</strong> {result.asset_id}</div>
              <div><strong>Public ID:</strong> {result.public_id}</div>
              <div><strong>Secure URL:</strong> <a href={result.secure_url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{result.secure_url}</a></div>
            </div>

            {/* AI Vision General Execution & Raw API Response */}
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#facc15', margin: '0 0 12px 0', fontSize: '15px' }}>Cloudinary `ai_vision_general` API Execution Log</h3>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Endpoint URL Used:</strong> <code style={{ color: '#38bdf8' }}>{result.ai_vision_general_execution.endpoint_used}</code>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>HTTP Response Status:</strong>{' '}
                <span style={{ color: result.ai_vision_general_execution.http_status === 200 ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                  {result.ai_vision_general_execution.http_status || 'Failed'}
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <strong>Outbound JSON Request Payload:</strong>
                <pre style={{ background: '#020617', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#e2e8f0', overflowX: 'auto' }}>
                  {JSON.stringify(result.ai_vision_general_execution.request_payload, null, 2)}
                </pre>
              </div>

              <div>
                <strong>RAW Cloudinary API Response:</strong>
                <pre style={{ background: '#020617', padding: '12px', borderRadius: '6px', fontSize: '11px', color: result.ai_vision_general_execution.http_status === 200 ? '#4ade80' : '#fca5a5', overflowX: 'auto', maxHeight: '350px' }}>
                  {typeof result.ai_vision_general_execution.raw_cloudinary_response === 'string'
                    ? result.ai_vision_general_execution.raw_cloudinary_response.slice(0, 1000)
                    : JSON.stringify(result.ai_vision_general_execution.raw_cloudinary_response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Raw Upload Response metadata */}
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <h3 style={{ color: '#a7f3d0', margin: '0 0 12px 0', fontSize: '15px' }}>Full Raw Cloudinary Upload API Response</h3>
              <pre style={{ background: '#020617', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#94a3b8', overflowX: 'auto', maxHeight: '300px' }}>
                {JSON.stringify(result.raw_cloudinary_upload_response, null, 2)}
              </pre>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
