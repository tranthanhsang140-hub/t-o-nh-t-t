
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { transformImageToTetStyle, FlowerType, SubjectType, AdvancedOptions, FramingType, CompanionType } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [flowerType, setFlowerType] = useState<FlowerType>('peach');
  const [subjectType, setSubjectType] = useState<SubjectType>('single');

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    shirtColor: 'Màu đỏ (truyền thống)',
    style: 'Áo dài truyền thống',
    emotion: 'Vui tươi, rạng rỡ',
    aperture: 'f/1.4',
    focalLength: '85mm',
    cameraModel: 'Sony A7R V',
    framing: 'portrait',
    skinColor: 'Trắng sáng hồng hào',
    hairColor: 'Đen tự nhiên',
    companion: 'none'
  });

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setTransformedImage(null);
    setError(null);
  };

  const handleTransform = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await transformImageToTetStyle(originalImage, flowerType, subjectType, advancedOptions);
      if (result) {
        setTransformedImage(result);
      } else {
        setError("Không thể tạo ảnh. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi trong quá trình xử lý ảnh. Hãy chắc chắn rằng bạn đang sử dụng API Key hợp lệ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setTransformedImage(null);
    setError(null);
  };

  const updateAdvanced = (key: keyof AdvancedOptions, value: string) => {
    setAdvancedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-red-50 text-gray-900 pb-20">
      <header className="bg-red-700 text-white py-8 px-4 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 text-6xl">🌸</div>
          <div className="absolute top-10 right-10 text-6xl">🏮</div>
          <div className="absolute bottom-5 left-20 text-4xl">🧧</div>
        </div>
        <h1 className="text-4xl md:text-6xl font-festive mb-2 relative z-10">Tết Photo Magic</h1>
        <p className="text-red-100 max-w-2xl mx-auto opacity-90">
          Studio ảnh Tết AI: Tùy chỉnh bối cảnh, nhân vật và phong cách nhiếp ảnh đỉnh cao.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {!originalImage ? (
          <ImageUploader onUpload={handleImageUpload} />
        ) : (
          <div className="space-y-6">
            {!transformedImage && !isLoading && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-red-100 space-y-8 animate-in fade-in slide-in-from-top-4">
                {/* Basic Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-red-800 font-bold mb-3 flex items-center gap-2">
                      <span>🌼</span> Vườn hoa:
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setFlowerType('peach')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition ${flowerType === 'peach' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-600'}`}>🌸 Đào</button>
                      <button onClick={() => setFlowerType('apricot')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition ${flowerType === 'apricot' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-yellow-50 text-yellow-700'}`}>🌼 Mai</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-red-800 font-bold mb-3 flex items-center gap-2">
                      <span>👥</span> Chủ thể:
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setSubjectType('single')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition ${subjectType === 'single' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-600'}`}>👤 Một người</button>
                      <button onClick={() => setSubjectType('group')} className={`flex-1 py-3 px-2 rounded-xl text-sm font-semibold transition ${subjectType === 'group' ? 'bg-red-600 text-white shadow-lg' : 'bg-red-50 text-red-600'}`}>👨‍👩‍👧 Nhóm</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-red-800 font-bold mb-3 flex items-center gap-2">
                      <span>📸</span> Góc chụp:
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => updateAdvanced('framing', 'full-body')} className={`flex-1 py-3 px-1 rounded-xl text-xs font-semibold transition ${advancedOptions.framing === 'full-body' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}>Toàn thân</button>
                      <button onClick={() => updateAdvanced('framing', 'portrait')} className={`flex-1 py-3 px-1 rounded-xl text-xs font-semibold transition ${advancedOptions.framing === 'portrait' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}>Chân dung</button>
                      <button onClick={() => updateAdvanced('framing', 'close-up')} className={`flex-1 py-3 px-1 rounded-xl text-xs font-semibold transition ${advancedOptions.framing === 'close-up' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600'}`}>Cận mặt</button>
                    </div>
                  </div>
                </div>

                {/* Advanced Customization Section */}
                <div className="border-t border-red-50 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-4">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2"><span>⚙️</span> Tùy chỉnh chi tiết:</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Màu da:</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.skinColor} onChange={(e) => updateAdvanced('skinColor', e.target.value)}>
                      <option>Trắng sáng hồng hào</option>
                      <option>Tự nhiên</option>
                      <option>Rám nắng khỏe khoắn</option>
                      <option>Giữ nguyên ảnh gốc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Màu tóc:</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.hairColor} onChange={(e) => updateAdvanced('hairColor', e.target.value)}>
                      <option>Đen tự nhiên</option>
                      <option>Nâu hạt dẻ</option>
                      <option>Nâu tây</option>
                      <option>Bạch kim</option>
                      <option>Giữ nguyên ảnh gốc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Bạn đồng hành (AI):</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.companion} onChange={(e) => updateAdvanced('companion', e.target.value)}>
                      <option value="none">Không thêm</option>
                      <option value="male">Thêm một bạn nam</option>
                      <option value="female">Thêm một bạn nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Trang phục:</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.shirtColor} onChange={(e) => updateAdvanced('shirtColor', e.target.value)}>
                      <option>Áo dài đỏ truyền thống</option>
                      <option>Áo dài vàng hoàng kim</option>
                      <option>Áo dài xanh ngọc</option>
                      <option>Trang phục hiện đại</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Khẩu độ (Aperture):</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.aperture} onChange={(e) => updateAdvanced('aperture', e.target.value)}>
                      <option>f/1.2 (Siêu xóa phông)</option>
                      <option>f/1.4 (Chuyên nghiệp)</option>
                      <option>f/2.8 (Vừa phải)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Tiêu cự (Lens):</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.focalLength} onChange={(e) => updateAdvanced('focalLength', e.target.value)}>
                      <option>85mm (Chân dung)</option>
                      <option>50mm (Tự nhiên)</option>
                      <option>135mm (Nén phông)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Dòng máy:</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.cameraModel} onChange={(e) => updateAdvanced('cameraModel', e.target.value)}>
                      <option>Sony A7R V</option>
                      <option>Canon EOS R5</option>
                      <option>Fujifilm GFX100</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tight">Cảm xúc:</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" value={advancedOptions.emotion} onChange={(e) => updateAdvanced('emotion', e.target.value)}>
                      <option>Rạng rỡ, hạnh phúc</option>
                      <option>Dịu dàng, đằm thắm</option>
                      <option>Cá tính, sắc sảo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <ResultDisplay 
              original={originalImage} 
              result={transformedImage} 
              isLoading={isLoading} 
              error={error}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!transformedImage && !isLoading && (
                <button
                  onClick={handleTransform}
                  className={`font-bold py-4 px-12 rounded-full shadow-2xl transform transition hover:scale-105 active:scale-95 flex items-center gap-2 text-xl ${flowerType === 'peach' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-red-900'}`}
                >
                  🚀 Tạo Ảnh Tết Ngay
                </button>
              )}
              
              {(transformedImage || (!isLoading && originalImage)) && (
                <button onClick={handleReset} className="bg-white border-2 border-red-700 text-red-700 hover:bg-red-50 font-semibold py-3 px-8 rounded-full transition">Chọn Ảnh Khác</button>
              )}

              {transformedImage && !isLoading && (
                <button onClick={handleTransform} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition flex items-center gap-2">🔄 Thử Mẫu Khác</button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-red-100 py-3 text-center text-red-800 text-sm font-medium z-50">
        AI powered by Gemini 2.5 Flash Image 🌸 Chúc Mừng Năm Mới!
      </footer>
    </div>
  );
};

export default App;
