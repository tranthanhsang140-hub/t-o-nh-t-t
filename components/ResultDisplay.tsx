
import React from 'react';

interface ResultDisplayProps {
  original: string;
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ original, result, isLoading, error }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Original Image Card */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <h3 className="text-center font-bold text-red-800 mb-3 uppercase tracking-wider text-sm">Ảnh Gốc</h3>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
          <img 
            src={original} 
            alt="Original" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Result Image Card */}
      <div className="bg-white rounded-3xl p-4 shadow-lg border-2 border-yellow-200">
        <h3 className="text-center font-bold text-red-800 mb-3 uppercase tracking-wider text-sm">
          {result ? "Ảnh Tết Của Bạn ✨" : "Kết Quả AI"}
        </h3>
        
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-red-800 font-bold animate-pulse">Đang rắc hoa đào...</p>
                <p className="text-xs text-gray-400 mt-2">Gemini 2.5 đang vẽ lại khoảnh khắc Tết của bạn</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          ) : result ? (
            <img 
              src={result} 
              alt="Transformed" 
              className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
            />
          ) : (
            <div className="text-center text-gray-300 p-8">
              <p>Nhấn nút bên dưới để bắt đầu</p>
            </div>
          )}
        </div>
        
        {result && !isLoading && (
          <div className="mt-4">
             <a 
              href={result} 
              download="anh-tet-cua-toi.png"
              className="w-full block text-center bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-3 rounded-xl transition"
            >
              Tải Ảnh Về Máy
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
