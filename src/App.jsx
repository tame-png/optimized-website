import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Notebooks from './pages/Notebooks';
import NotebookViewer from './pages/NotebookViewer';
import Resume from './pages/Resume';
import LBRHEPage from './pages/Lbrhe';
import { THEME, FONTS } from './data';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home theme={THEME} fontStack={FONTS} />} />
        <Route path="/notebooks" element={<Notebooks theme={THEME} fontStack={FONTS} />} />
        <Route path="/viewer/:projectId" element={<NotebookViewer theme={THEME} fontStack={FONTS} />} />
        <Route path="/resume" element={<Resume theme={THEME} fontStack={FONTS} />} />
        <Route path="/lbrhe" element={<LBRHEPage theme={THEME} fontStack={FONTS} />} />
        {/* Redirect old HTML paths to the new router paths */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/notebooks.html" element={<Navigate to="/notebooks" replace />} />
        <Route path="/resume.html" element={<Navigate to="/resume" replace />} />
        <Route path="/lbrhe.html" element={<Navigate to="/lbrhe" replace />} />
        <Route path="/viewer.html" element={<Navigate to="/notebooks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
