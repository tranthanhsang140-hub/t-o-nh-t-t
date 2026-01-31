
import { GoogleGenAI } from "@google/genai";

export type FlowerType = 'peach' | 'apricot';
export type SubjectType = 'single' | 'group';
export type FramingType = 'full-body' | 'portrait' | 'close-up';
export type CompanionType = 'none' | 'male' | 'female';

export interface AdvancedOptions {
  shirtColor: string;
  style: string;
  emotion: string;
  aperture: string;
  focalLength: string;
  cameraModel: string;
  framing: FramingType;
  skinColor: string;
  hairColor: string;
  companion: CompanionType;
}

/**
 * Transforms an image into a Tet-themed portrait using Gemini 2.5 Flash Image.
 */
export const transformImageToTetStyle = async (
  base64Image: string, 
  flowerType: FlowerType = 'peach',
  subjectType: SubjectType = 'single',
  advanced?: AdvancedOptions
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataOnly = base64Image.split(',')[1];
    const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];

    const variations = [
      "nắng chiều vàng nhẹ", 
      "không khí sáng sớm tinh khôi", 
      "bokeh lung linh từ đèn trang trí", 
      "hơi sương mờ ảo mùa xuân"
    ];
    const randomVar = variations[Math.floor(Math.random() * variations.length)];

    const flowerDescription = flowerType === 'peach' 
      ? "trồng đầy hoa đào Nhật Tân (Hà Nội) rực rỡ sắc hồng" 
      : "vườn mai vàng rực rỡ (miền Nam) khoe sắc vàng óng";
    
    const colorsDescription = flowerType === 'peach'
      ? "Tông màu: Hồng, đỏ, xanh lá mạ."
      : "Tông màu: Vàng rực, đỏ, xanh tươi.";

    const adv = advanced || {
      shirtColor: 'Màu đỏ',
      style: 'Áo dài',
      emotion: 'Vui vẻ',
      aperture: 'f/1.4',
      focalLength: '85mm',
      cameraModel: 'Sony A7R V',
      framing: 'portrait',
      skinColor: 'Tự nhiên',
      hairColor: 'Đen',
      companion: 'none'
    };

    const framingDesc = adv.framing === 'full-body' ? "lấy toàn thân (full body shot)" : 
                       adv.framing === 'close-up' ? "chụp cận mặt (extreme close-up)" : 
                       "chụp chân dung từ ngực trở lên (waist-up portrait)";

    const companionDesc = adv.companion === 'male' ? "Thêm một người nam (AI companion) đứng bên cạnh chủ thể, mặc áo dài cùng tông màu, tạo dáng thân thiện." :
                         adv.companion === 'female' ? "Thêm một người nữ (AI companion) đứng bên cạnh chủ thể, mặc áo dài cùng tông màu, tạo dáng duyên dáng." :
                         "";

    const subjectDescription = subjectType === 'single'
      ? `Tập trung vào 1 người duy nhất từ ảnh gốc, ${framingDesc}.`
      : `Giữ toàn bộ các thành viên trong ảnh gốc, ${framingDesc}, sắp xếp bố cục gia đình/nhóm hài hòa trong vườn hoa.`;

    const prompt = `
      Hãy biến đổi ảnh này thành một bức ảnh nghệ thuật đón Tết Việt Nam đẳng cấp.
      BỐI CẢNH: Một ${flowerDescription}.
      GÓC CHỤP & THÔNG SỐ:
      - Góc chụp: ${framingDesc}.
      - Sử dụng máy ảnh ${adv.cameraModel} với ống kính ${adv.focalLength}.
      - Khẩu độ ${adv.aperture} tạo hiệu ứng xóa phông (bokeh) mịt mù nghệ thuật.
      - ${subjectDescription}
      - ${companionDesc}
      
      YÊU CẦU NGOẠI HÌNH & TRANG PHỤC:
      - Nhân vật mặc ${adv.shirtColor} với phong cách ${adv.style}.
      - Màu da chủ thể: ${adv.skinColor}.
      - Màu tóc chủ thể: ${adv.hairColor}.
      - Cảm xúc của nhân vật: ${adv.emotion}.
      - Giữ nguyên đường nét cốt lõi của người trong ảnh gốc nhưng nâng cấp để trông chuyên nghiệp hơn.
      
      CHI TIẾT BỔ SUNG:
      - Ánh sáng: ${randomVar}.
      - Không khí Tết rực rỡ, ấm áp, đậm chất truyền thống Việt Nam.
      - Chất lượng: 4k, cinematic, cực kỳ sắc nét ở chủ thể.
      - ${colorsDescription}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: dataOnly,
              mimeType: mimeType,
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: adv.framing === 'full-body' ? "9:16" : "3:4"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
