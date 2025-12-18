// app/html-viewer/page.tsx
export default function HtmlViewerPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="./index.html"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Result"
      />
    </div>
  );
}
