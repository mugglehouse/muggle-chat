/**
 * 图片生成选项接口
 * @interface ImageGenerationOptions
 * @property {string} prompt - 图片生成提示词
 * @property {number} [n=1] - 生成图片数量，默认1张，最多10张
 * @property {string} [size='1024x1024'] - 图片尺寸
 * @property {string} [response_format='url'] - 返回格式：'url' 或 'b64_json'
 * @property {string} [user] - 用户标识符，用于OpenAI统计
 */
export interface ImageGenerationOptions {
  prompt: string
  n?: number
  size?: '256x256' | '512x512' | '1024x1024'
  response_format?: 'url' | 'b64_json'
  user?: string
}

/**
 * 图片生成响应接口
 * @interface ImageGenerationResponse
 * @property {number} created - 创建时间戳
 * @property {Array<ImageData>} data - 生成的图片数据数组
 */
export interface ImageGenerationResponse {
  created: number
  data: ImageData[]
}

/**
 * 图片数据接口
 * @interface ImageData
 * @property {string} url - 当responseFormat为'url'时的图片URL
 * @property {string} b64_json - 当responseFormat为'b64_json'时的Base64编码图片数据
 */
export interface ImageData {
  url?: string
  b64_json?: string
}

/**
 * 图片生成错误接口
 * @interface ImageGenerationError
 * @property {string} message - 错误信息
 * @property {string} type - 错误类型
 * @property {string} code - 错误代码
 */
export interface ImageGenerationError {
  message: string
  type: string
  code: string
}
