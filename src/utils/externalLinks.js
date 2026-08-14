// 外部链接安全跳转（rel=noopener/noreferrer，防止 tabnabbing）
export function openExternal(url) {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}
