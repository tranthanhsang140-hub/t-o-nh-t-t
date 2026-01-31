
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { transformImageToTetStyle, FlowerType, SubjectType, AdvancedOptions, FramingType, CompanionType, LightingType } from './services/geminiService';

export interface ImageItem {
  id: string;
  original: string;
  transformed: string | null;
  isLoading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [mergedResult, setMergedResult] = useState<string | null>(null);
  
  const [flowerType, setFlowerType] = useState<FlowerType>('peach');
  const [subjectType, setSubjectType] = useState<SubjectType>('single');

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    shirtColor: 'Áo dài đỏ rực rỡ',
    style: 'Truyền thống sang trọng',
    emotion: 'Rạng rỡ, hạnh phúc',
    aperture: 'f/1.4',
    focalLength: '85mm Prime',
    cameraModel: 'Sony A7R V (Full-frame)',
    framing: 'portrait',
    skinColor: 'Trắng hồng tự nhiên',
    hairColor: 'Đen mượt',
    companion: 'none',
    lighting: 'Golden Hour',
    isMergeMode: false
  });

  const handleImagesUpload = (base64Array: string[]) => {
    const newItems: ImageItem[] = base64Array.map((base64, index) => ({
      id: `${Date.now()}-${index}`,
      original: base64,
      transformed: null,
      isLoading: false,
      error: null
    }));
    setImages(newItems);
    setMergedResult(null);
  };

  const processBatch = async () => {
    setIsProcessingBatch(true);
    
    if (advancedOptions.isMergeMode) {
      // Merge all uploaded images into one
      try {
        const originals = images.map(img => img.original);
        const result = await transformImageToTetStyle(originals, flowerType, subjectType, advancedOptions);
        setMergedResult(result);
      } catch (err) {
        alert("Lỗi khi ghép ảnh. Vui lòng thử lại.");
      }
    } else {
      // Process images one by one
      for (const img of images) {
        if (!img.transformed) {
          setImages(prev => prev.map(i => i.id === img.id ? { ...i, isLoading: true, error: null } : i));
          try {
            const result = await transformImageToTetStyle(img.original, flowerType, subjectType, advancedOptions);
            setImages(prev => prev.map(i => i.id === img.id ? { ...i, transformed: result, isLoading: false } : i));
          } catch (err) {
            setImages(prev => prev.map(i => i.id === img.id ? { ...i, isLoading: false, error: "Lỗi AI" } : i));
          }
        }
      }
    }
    setIsProcessingBatch(false);
  };

  const handleReset = () => {
    setImages([]);
    setMergedResult(null);
    setIsProcessingBatch(false);
  };

  const updateAdvanced = (key: keyof AdvancedOptions, value: any) => {
    setAdvancedOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fef2f2] text-gray-900 pb-20">
      <header className="bg-[#b91c1c] text-white py-10 px-4 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap justify-around items-center">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-4xl">🌸</span>
          ))}
        </div>
        <h1 className="text-5xl md:text-7xl font-festive mb-4 relative z-10 drop-shadow-lg">Tết Photo Studio Pro</h1>
        <p className="text-red-100 max-w-2xl mx-auto opacity-90 text-lg">
          Nâng tầm ảnh Tết với thông số máy ảnh chuyên nghiệp và công nghệ AI ghép ảnh tối tân.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-10">
        {images.length === 0 ? (
          <ImageUploader onUpload={handleImagesUpload} />
        ) : (
          <div className="space-y-8">
            {/* Professional Settings Panel */}
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-red-100 animate-in fade-in slide-in-from-top-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-red-50 pb-6 mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-red-800">Studio Configuration</h3>
                  <p className="text-sm text-gray-500">Thiết lập thông số cho {images.length} tệp ảnh</p>
                </div>
                <div className="flex items-center gap-4 bg-red-50 p-2 rounded-2xl">
                   <span className="text-sm font-bold text-red-800 ml-2">Chế độ Ghép Ảnh (Merge):</span>
                   <button 
                    onClick={() => updateAdvanced('isMergeMode', !advancedOptions.isMergeMode)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${advancedOptions.isMergeMode ? 'bg-red-600' : 'bg-gray-300'}`}
                   >
                     <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${advancedOptions.isMergeMode ? 'translate-x-7' : 'translate-x-1'}`} />
                   </button>
                </div>
              </div>

              {/* Grid of Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Visual Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-red-700 uppercase tracking-widest border-l-4 border-red-600 pl-2">Cảnh quan</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Vườn hoa:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setFlowerType('peach')} className={`py-2 rounded-lg text-xs font-bold ${flowerType === 'peach' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>🌸 Đào Bắc</button>
                      <button onClick={() => setFlowerType('apricot')} className={`py-2 rounded-lg text-xs font-bold ${flowerType === 'apricot' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>🌼 Mai Nam</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Ánh sáng (Lighting):</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.lighting} onChange={e => updateAdvanced('lighting', e.target.value)}>
                      <option>Golden Hour</option>
                      <option>Soft Morning</option>
                      <option>Cinematic</option>
                      <option>Studio</option>
                      <option>Vintage Warm</option>
                    </select>
                  </div>
                </div>

                {/* Technical Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-red-700 uppercase tracking-widest border-l-4 border-red-600 pl-2">Thông số máy</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Dòng máy (Body):</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.cameraModel} onChange={e => updateAdvanced('cameraModel', e.target.value)}>
                      <option>Sony A7R V (Full-frame)</option>
                      <option>Canon EOS R5</option>
                      <option>Nikon Z9</option>
                      <option>Fujifilm GFX100 (Medium Format)</option>
                      <option>Leica M11</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Tiêu cự (Lens):</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.focalLength} onChange={e => updateAdvanced('focalLength', e.target.value)}>
                        <option>35mm Wide</option>
                        <option>50mm Standard</option>
                        <option>85mm Prime</option>
                        <option>135mm Tele</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Khẩu độ (Aper):</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.aperture} onChange={e => updateAdvanced('aperture', e.target.value)}>
                        <option>f/0.95</option>
                        <option>f/1.2</option>
                        <option>f/1.4</option>
                        <option>f/1.8</option>
                        <option>f/2.8</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subject Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-red-700 uppercase tracking-widest border-l-4 border-red-600 pl-2">Nhân vật</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Cảm xúc:</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.emotion} onChange={e => updateAdvanced('emotion', e.target.value)}>
                      <option>Rạng rỡ, hạnh phúc</option>
                      <option>Dịu dàng, đằm thắm</option>
                      <option>Nostalgic (Hoài niệm)</option>
                      <option>Elegant (Thanh lịch)</option>
                      <option>Energetic (Sôi nổi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Trang phục:</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-sm" value={advancedOptions.shirtColor} onChange={e => updateAdvanced('shirtColor', e.target.value)}>
                      <option>Áo dài đỏ rực rỡ</option>
                      <option>Áo dài vàng hoàng kim</option>
                      <option>Áo dài xanh ngọc bích</option>
                      <option>Áo dài trắng tinh khôi</option>
                      <option>Áo ngũ thân truyền thống</option>
                    </select>
                  </div>
                </div>

                {/* Framing Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-red-700 uppercase tracking-widest border-l-4 border-red-600 pl-2">Bố cục</h4>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Góc chụp:</label>
                    <div className="grid grid-cols-1 gap-1">
                      <button onClick={() => updateAdvanced('framing', 'portrait')} className={`py-1.5 rounded-lg text-[10px] font-bold ${advancedOptions.framing === 'portrait' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>CHÂN DUNG</button>
                      <button onClick={() => updateAdvanced('framing', 'full-body')} className={`py-1.5 rounded-lg text-[10px] font-bold ${advancedOptions.framing === 'full-body' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>TOÀN THÂN</button>
                      <button onClick={() => updateAdvanced('framing', 'close-up')} className={`py-1.5 rounded-lg text-[10px] font-bold ${advancedOptions.framing === 'close-up' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>CẬN MẶT</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-12">
                <button
                  onClick={processBatch}
                  disabled={isProcessingBatch}
                  className={`group relative overflow-hidden font-bold py-5 px-20 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 text-2xl ${isProcessingBatch ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-800 text-white'}`}
                >
                  <span className="relative z-10">{isProcessingBatch ? 'Đang Xử Lý...' : '🚀 BẮT ĐẦU CHỤP ẢNH'}</span>
                  {!isProcessingBatch && <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />}
                </button>
                <button onClick={handleReset} className="text-red-700 font-bold underline text-sm">Hủy bỏ và làm lại</button>
              </div>
            </div>

            {/* Results Section */}
            {advancedOptions.isMergeMode && mergedResult ? (
              <div className="max-w-3xl mx-auto">
                <h3 className="text-center text-2xl font-bold text-red-800 mb-6 italic">Tác phẩm Ghép Ảnh Sum Vầy</h3>
                <ResultDisplay 
                  original={images[0].original} 
                  result={mergedResult} 
                  isLoading={isProcessingBatch} 
                  error={null}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((img) => (
                  <ResultDisplay 
                    key={img.id}
                    original={img.original} 
                    result={img.transformed} 
                    isLoading={img.isLoading} 
                    error={img.error}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-red-100 py-3 text-center text-red-800 text-sm font-medium z-50">
        Professional AI Imaging • Powered by Gemini 2.5 • Happy Lunar New Year 🧧
      </footer>
    </div>
  );
};

export default App;
