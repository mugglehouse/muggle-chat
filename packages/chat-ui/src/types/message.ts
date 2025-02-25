/**
 * 基础消息接口
 * @interface BaseMessage
 * @property {string} id - 消息唯一标识符
 * @property {'user' | 'assistant'} role - 消息发送者角色
 * @property {number} timestamp - 消息发送时间戳
 * @property {'sending' | 'success' | 'error'} status - 消息发送状态
 */
export interface BaseMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: number
  status: 'sending' | 'success' | 'error'
}

/**
 * 文本消息接口
 * @interface TextMessage
 * @extends {BaseMessage}
 * @property {'text'} type - 消息类型标识
 * @property {string} content - 文本内容
 */
export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

/**
 * 图片消息接口
 * @interface ImageMessage
 * @extends {BaseMessage}
 * @property {'image'} type - 消息类型标识
 * @property {string} content - 生成图片的提示词
 * @property {string[]} imageUrls - 生成的图片URL数组
 * @property {ImageMetadata} [metadata] - 图片相关元数据
 */
export interface ImageMessage extends BaseMessage {
  type: 'image'
  content: string
  imageUrls: string[]
  metadata?: ImageMetadata
}

/**
 * 图片元数据接口
 * @interface ImageMetadata
 * @property {string} size - 图片尺寸，例如：'1024x1024'
 * @property {number} n - 生成的图片数量
 * @property {string} model - 使用的模型
 * @property {number} created - 创建时间戳
 * @property {string} description - API返回的图片描述
 */
export interface ImageMetadata {
  size: '256x256' | '512x512' | '1024x1024'
  n: number
  model?: string
  created: number
  description?: string
}

/**
 * 消息类型联合
 * @type {Message}
 */
export type Message = TextMessage | ImageMessage
