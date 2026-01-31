
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-dashed border-red-200 text-center transition hover:border-red-400">
      <div className="mb-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-800">Tải ảnh của bạn lên</h2>
        <p className="text-gray-500 mt-2">Chúng tôi sẽ biến bạn thành người mẫu ảnh Tết trong vườn đào</p>
      </div>

      <input
        type="file"
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

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
        <img src="https://picsum.photos/seed/tet1/200/200" className="rounded-xl grayscale" alt="Example" />
        <img src="https://picsum.photos/seed/tet2/200/200" className="rounded-xl grayscale" alt="Example" />
        <img src="https://picsum.photos/seed/tet3/200/200" className="rounded-xl grayscale" alt="Example" />
        <img src="https://picsum.photos/seed/tet4/200/200" className="rounded-xl grayscale" alt="Example" />
      </div>
    </div>
  );
};
