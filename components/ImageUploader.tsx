
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (base64Array: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length > 0) {
      const base64Promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      const results = await Promise.all(base64Promises);
      onUpload(results);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-12 shadow-xl border-4 border-dashed border-red-200 text-center transition hover:border-red-400">
      <div className="mb-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-red-800">Tải ảnh của bạn lên</h2>
        <p className="text-gray-500 mt-2">Chọn tối đa 5 ảnh để thực hiện bộ sưu tập ảnh Tết chuyên nghiệp</p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 text-xl"
      >
        Chọn Ảnh
      </button>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 opacity-50">
        {[1, 2, 3, 4, 5].map(i => (
          <img key={i} src={`https://picsum.photos/seed/tet${i}/200/200`} className="rounded-xl grayscale" alt="Example" />
        ))}
      </div>
    </div>
  );
};
