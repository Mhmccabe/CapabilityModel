import React, { useState, useMemo } from 'react';
import { CapabilityViewer } from './components/CapabilityViewer';
import { parseCapabilityModel } from './services/parser';
import type { CapabilityNodeData } from './types';
import { DEFAULT_CAPABILITY_MODEL } from './constants';

const App: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_CAPABILITY_MODEL);

  const capabilityTree: CapabilityNodeData[] = useMemo(() => {
    try {
      return parseCapabilityModel(text);
    } catch (error) {
      console.error("Failed to parse capability model:", error);
      return [];
    }
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-700">ArchiMate Capability Mapper</h1>
          <p className="text-sm text-gray-500">Visualize your business capabilities based on the ArchiMate 3.2 Strategy Layer</p>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="flex flex-col lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">Capability Model Input</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use hyphens or asterisks for bullet points. Indent with spaces to create a hierarchy. The map will update live as you type.
          </p>
          <div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full flex-grow p-4 resize-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm bg-white text-gray-900 placeholder-gray-400"
              placeholder="- Top Level Capability..."
              spellCheck="false"
            />
          </div>
        </section>

        <section className="flex flex-col lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Generated Capability Map</h2>
           <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
             {capabilityTree.length > 0 ? (
                <CapabilityViewer capabilities={capabilityTree} />
             ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Start typing in the input area to see your capability map.</p>
                </div>
             )}
           </div>
        </section>
      </main>
      
      <footer className="text-center p-4 text-xs text-gray-400">
        have fun
      </footer>
    </div>
  );
};

export default App;