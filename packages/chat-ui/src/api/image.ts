import axios from 'axios'
import type { ImageGenerationError, ImageGenerationOptions, ImageGenerationResponse } from '../types/image'
import { API_CONFIG } from '../config'

/**
 * 验证图片生成选项
 */
function validateOptions(options: ImageGenerationOptions): void {
  const { prompt, n = 1, size = '1024x1024' } = options
  const { maxTokens, limits } = API_CONFIG.imageGeneration

  if (!prompt || prompt.length > maxTokens)
    throw new Error(`提示词长度必须在1-${maxTokens}字符之间`)

  if (n < 1 || n > limits.maxImages)
    throw new Error(`生成图片数量必须在1-${limits.maxImages}之间`)

  const [width, height] = size.split('x').map(Number)
  if (width < limits.minSize || width > limits.maxSize || height < limits.minSize || height > limits.maxSize)
    throw new Error(`图片尺寸必须在${limits.minSize}x${limits.minSize}到${limits.maxSize}x${limits.maxSize}之间`)
}

/**
 * 图片生成服务
 */
export const imageService = {
  /**
   * 生成图片
   */
  async generateImage(
    options: ImageGenerationOptions,
    onProgress?: (progress: number) => void,
  ): Promise<ImageGenerationResponse> {
    try {
      // 验证选项
      validateOptions(options)

      // 设置默认值
      const finalOptions = {
        model: API_CONFIG.imageGeneration.model,
        n: 1,
        size: API_CONFIG.imageGeneration.defaultSize,
        response_format: 'url',
        ...options,
      }

      // 发送请求
      const response = await axios.post<ImageGenerationResponse>(
        `${API_CONFIG.baseURL}/images/generations`,
        finalOptions,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
            'Content-Type': 'application/json',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = (progressEvent.loaded / progressEvent.total) * 100
              onProgress(Math.min(progress, 99))
            }
          },
        },
      )

      // 请求完成
      onProgress?.(100)

      return response.data
    }
    catch (error: any) {
      // 转换错误格式
      const apiError: ImageGenerationError = {
        message: error.response?.data?.error?.message || error.message || '图片生成失败',
        type: error.response?.data?.error?.type || 'GenerationError',
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      }
      throw apiError
    }
  },

  /**
   * 获取支持的图片尺寸
   */
  getSupportedSizes(): string[] {
    return ['256x256', '512x512', '1024x1024']
  },

  /**
   * 获取支持的返回格式
   */
  getSupportedFormats(): string[] {
    return API_CONFIG.imageGeneration.supportedFormats
  },

  /**
   * 获取图片生成限制
   */
  getLimits() {
    return API_CONFIG.imageGeneration.limits
  },
}
