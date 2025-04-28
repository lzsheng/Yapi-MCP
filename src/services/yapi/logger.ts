/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * 日志级别字符串映射
 */
const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  'debug': LogLevel.DEBUG,
  'info': LogLevel.INFO,
  'warn': LogLevel.WARN,
  'error': LogLevel.ERROR,
  'none': LogLevel.NONE
};

/**
 * 获取日志级别
 */
export function getLogLevel(level: string): LogLevel {
  return LOG_LEVEL_MAP[level.toLowerCase()] ?? LogLevel.INFO;
}

/**
 * 日志工具类
 */
export class Logger {
  private readonly prefix: string;
  private readonly logLevel: LogLevel;
  
  constructor(prefix: string, logLevel: LogLevel | string = LogLevel.INFO) {
    this.prefix = prefix;
    this.logLevel = typeof logLevel === 'string' ? getLogLevel(logLevel) : logLevel;
  }
  
  /**
   * 输出调试日志
   * @param message 日志消息
   * @param args 额外参数
   */
  debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(`[DEBUG][${this.prefix}] ${message}`, ...args);
    }
  }
  
  /**
   * 输出信息日志
   * @param message 日志消息
   * @param args 额外参数
   */
  info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.log(`[INFO][${this.prefix}] ${message}`, ...args);
    }
  }
  
  /**
   * 输出警告日志
   * @param message 日志消息
   * @param args 额外参数
   */
  warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN][${this.prefix}] ${message}`, ...args);
    }
  }
  
  /**
   * 输出错误日志
   * @param message 日志消息
   * @param args 额外参数
   */
  error(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR][${this.prefix}] ${message}`, ...args);
    }
  }
} 