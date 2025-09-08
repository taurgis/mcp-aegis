import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WhyTestMCPPage from './pages/WhyTestMCPPage';
import InstallationPage from './pages/InstallationPage';
import QuickStartPage from './pages/QuickStartPage';
import YamlTestingPage from './pages/YamlTestingPage';
import ProgrammaticTestingPage from './pages/ProgrammaticTestingPage';
import ExamplesPage from './pages/ExamplesPage';
import AIAgentsPage from './pages/AIAgentsPage';
import ApiReferencePage from './pages/ApiReferencePage';
import TroubleshootingPage from './pages/TroubleshootingPage';
import DevelopmentPage from './pages/DevelopmentPage';

// Pattern Matching Pages
import PatternMatchingOverviewPage from './pages/pattern-matching/OverviewPage';
import BasicPatternsPage from './pages/pattern-matching/BasicPatternsPage';
import StringPatternsPage from './pages/pattern-matching/StringPatternsPage';
import RegexPatternsPage from './pages/pattern-matching/RegexPatternsPage';
import ArrayPatternsPage from './pages/pattern-matching/ArrayPatternsPage';
import ObjectFieldPatternsPage from './pages/pattern-matching/ObjectFieldPatternsPage';

// Component to handle GitHub Pages SPA redirects
const RedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RedirectHandler />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why-test-mcp" element={<WhyTestMCPPage />} />
          <Route path="/installation" element={<InstallationPage />} />
          <Route path="/quick-start" element={<QuickStartPage />} />
          <Route path="/yaml-testing" element={<YamlTestingPage />} />
          <Route path="/programmatic-testing" element={<ProgrammaticTestingPage />} />
          
          <Route path="/pattern-matching" element={<Navigate to="/pattern-matching/overview" />} />
          <Route path="/pattern-matching/overview" element={<PatternMatchingOverviewPage />} />
          <Route path="/pattern-matching/basic" element={<BasicPatternsPage />} />
          <Route path="/pattern-matching/string" element={<StringPatternsPage />} />
          <Route path="/pattern-matching/regex" element={<RegexPatternsPage />} />
          <Route path="/pattern-matching/array" element={<ArrayPatternsPage />} />
          <Route path="/pattern-matching/object-field" element={<ObjectFieldPatternsPage />} />

          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/ai-agents" element={<AIAgentsPage />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
          <Route path="/development" element={<DevelopmentPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;