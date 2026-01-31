
import { GoogleGenAI } from "@google/genai";

export type FlowerType = 'peach' | 'apricot';
export type SubjectType = 'single' | 'group';
export type FramingType = 'full-body' | 'portrait' | 'close-up';
export type CompanionType = 'none' | 'male' | 'female';
export type LightingType = 'Golden Hour' | 'Soft Morning' | 'Cinematic' | 'Studio' | 'Vintage Warm';

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
  lighting: LightingType;
  isMergeMode: boolean;
}

/**
 * Transforms one or more images into a Tet-themed portrait.
 */
export const transformImageToTetStyle = async (
  base64Images: string | string[], 
  flowerType: FlowerType = 'peach',
  subjectType: SubjectType = 'single',
  advanced: AdvancedOptions
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagesArray = Array.isArray(base64Images) ? base64Images : [base64Images];
    
    // Create image parts for the prompt
    const imageParts = imagesArray.map(base64 => {
      const dataOnly = base64.split(',')[1];
      const mimeType = base64.split(',')[0].split(':')[1].split(';')[0];
      return {
        inlineData: {
          data: dataOnly,
          mimeType: mimeType,
        }
      };
    });

    const flowerDescription = flowerType === 'peach' 
      ? "vườn đào Nhật Tân rực rỡ sắc hồng thắm" 
      : "vườn mai vàng phương Nam rực rỡ nắng xuân";
    
    const framingDesc = advanced.framing === 'full-body' ? "lấy toàn thân (full body shot)" : 
                       advanced.framing === 'close-up' ? "chụp cận mặt (extreme close-up)" : 
                       "chụp chân dung nghệ thuật (waist-up portrait)";

    const companionDesc = advanced.companion === 'male' ? "Thêm một người nam AI đứng cạnh tạo dáng thân mật." :
                         advanced.companion === 'female' ? "Thêm một người nữ AI đứng cạnh tạo dáng duyên dáng." :
                         "";

    const mergeInstruction = advanced.isMergeMode 
      ? "HÃY KẾT HỢP TẤT CẢ NHÂN VẬT TỪ CÁC ẢNH GỐC VÀO TRONG CÙNG MỘT BỨC ẢNH DUY NHẤT. Tạo thành một tấm hình kỷ niệm gia đình/nhóm bạn sum vầy."
      : "Giữ nguyên nhân vật từ ảnh gốc và đặt vào bối cảnh mới.";

    const prompt = `
      Nhiệm vụ: Biến đổi ảnh thành tác phẩm nhiếp ảnh Tết chuyên nghiệp.
      BỐI CẢNH: Một ${flowerDescription}.
      CHẾ ĐỘ XỬ LÝ: ${mergeInstruction}
      
      THÔNG SỐ MÁY ẢNH (CAMERA SPECS):
      - Body: ${advanced.cameraModel}
      - Lens: ${advanced.focalLength}
      - Aperture: ${advanced.aperture} (Xóa phông mượt mà, tạo hiệu ứng bokeh hình tròn lung linh phía sau).
      - Framing: ${framingDesc}.
      - Lighting: ${advanced.lighting} (Ánh sáng tự nhiên, ấm áp, tạo khối cho khuôn mặt).

      YÊU CẦU NHÂN VẬT & TRANG PHỤC:
      - Trang phục: ${advanced.shirtColor}, phong cách ${advanced.style}.
      - Màu da: ${advanced.skinColor}.
      - Màu tóc: ${advanced.hairColor}.
      - Cảm xúc: ${advanced.emotion} (thể hiện rõ trên nét mặt).
      - ${companionDesc}
      
      YÊU CẦU KỸ THUẬT:
      - Giữ nguyên đặc điểm nhận dạng khuôn mặt từ các ảnh nguồn.
      - Chất lượng: 8k, cực kỳ chi tiết, độ tương phản tốt, màu sắc Tết Việt Nam truyền thống.
      - Bố cục: Nghệ thuật, cân đối.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          ...imageParts,
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: advanced.framing === 'full-body' ? "9:16" : "3:4"
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
