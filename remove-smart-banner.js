// ============================================
// Remove Smart App Banner (x.com / twitter.com)
// 删除 HTML 中的 <meta name="apple-itunes-app"> 标签
// 阻止 Safari 渲染"在App中打开"横幅
// 适用: Quantumult X (script-response-body)
// 兼容: $response.body 为字符串 或 Uint8Array(gzip/二进制)
// ============================================

const body = $response && $response.body;
let str = null;

if (typeof body === 'string') {
  str = body;
} else if (body && typeof body === 'object' && body.byteLength !== undefined) {
  // Uint8Array: 可能是 gzip 压缩内容
  try {
    let bytes = body;
    // gzip magic bytes: 0x1f 0x8b
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      if ($utils && typeof $utils.ungzip === 'function') {
        bytes = $utils.ungzip(bytes);
      }
    }
    str = new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    str = null;
  }
}

if (str !== null && str.indexOf('apple-itunes-app') !== -1) {
  $response.body = str.replace(/<meta[^>]*name=["']apple-itunes-app["'][^>]*>/gi, '');
  // body 已改为明文，移除压缩头避免客户端按 gzip 解压失败
  if ($response.headers) {
    delete $response.headers['Content-Encoding'];
    delete $response.headers['content-encoding'];
  }
}

$done($response);
