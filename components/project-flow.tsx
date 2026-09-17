export function ProjectFlow() {
  return <div className="project-flow" aria-label="Encryptron application flow: upload a file, process it in memory with Flask, and download the result. SQLite stores accounts and file metadata.">
    <div className="flow-heading"><span>Encryptron</span><span>File workflow</span></div>
    <ol className="flow-steps">
      <li><strong>Upload</strong><p>File + password</p></li>
      <li><strong>Process</strong><p>Flask / Python</p></li>
      <li><strong>Download</strong><p>Processed file</p></li>
    </ol>
    <div className="flow-database"><span>SQLite</span><span>Accounts, file records, permissions</span></div>
    <p className="flow-caption">File processing happens in memory.</p>
  </div>;
}
