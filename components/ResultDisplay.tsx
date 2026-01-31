
import React from 'react';

interface ResultDisplayProps {
  original: string;
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ original, result, isLoading, error }) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 flex flex-col gap-4">
      {/* Container for original/result */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 group">
        {!result && !isLoading && !error && (
          <img 
            src={original} 
            alt="Original" 
            className="w-full h-full object-cover opacity-80"
          />
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-red-50/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-red-800 font-bold animate-pulse text-sm">Đang vẽ phong vị Tết...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
            <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium text-xs">{error}</p>
          </div>
        )}

        {result && (
          <img 
            src={result} 
            alt="Transformed" 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
          />
        )}

        {/* Hover label */}
        {!result && !isLoading && !error && (
          <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">ẢNH CHỜ</div>
        )}
      </div>
      
      {result && !isLoading && (
        <div className="flex gap-2">
           <a 
            href={result} 
            download={`anh-tet-${Date.now()}.png`}
            className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-2 rounded-xl transition text-sm"
          >
            Tải Ảnh
          </a>
          <button 
            onClick={() => {
              const win = window.open();
              win?.document.write(`<img src="${result}" style="width:100%"/>`);
            }}
            className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            👁️
          </button>
        </div>
      )}
    </div>
  );
};
