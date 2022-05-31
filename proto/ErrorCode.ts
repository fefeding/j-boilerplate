//    错误码使用9位[1:2:2:4], 第一位为语言(9-java)，后面2位为系统号，中间2位为服务号，后4位为错误编码；如[9][10][10][0001]

export enum ErrorCode {
  // ErrorCode
  'unspecified exception' = -1,
  'data access exception' = -2,
  'redis access exception' = -3,
  'aes decode exception' = -4,
  'fastjson parse exception' = -5,
  'params illegal' = -6,
  'No enum constant exists' = -7,
  'Ok http service exception' = -8,
  'gson parse exception' = -9,
  'reflect method invoke exception' = -10,
  '服务不可用' = -1001,
}
