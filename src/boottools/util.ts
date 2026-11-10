
let appConfig: any
let boot: any
let $t: Function

const encoder = new TextEncoder()

export function setup (_boot: any, _$t: Function, _appConfig: any) {
  appConfig = _appConfig
  $t = _$t
  boot = _boot
}

export function urlFromText (text: string, type?: string) : string {
  const blob = new Blob([encoder.encode(text)], { type: type || 'text/html' })
  return URL.createObjectURL(blob)
}

export function reloadPage () {
  const m1 = $t('reload')
  const hr = window.location.href
  const t =  `<html><head><meta charset="utf-8">
<script>
setTimeout(() => { window.location.href = "${hr}" }, 2000)
</script>
<style>div {font-size:18px;margin:12px;font-family:sans-serif;text-align:center;};</style>
</head><body>
<div>${m1}</div>
</body></html>`
  window.location.href = urlFromText(t)
}

export function coolBye () {
  const m1 = $t('coolbye')
  const m2 = $t('backtoapp')
  const help = $t('help')
  const url = $t('helpurl')
  const href = window.location.href
  const t = `<html><head><meta charset="utf-8">
<style>div {font-size:18px;margin:12px;font-family:sans-serif;text-align:center;};</style>
</head>
<body>
<div>${m1}</div>
<div><a href="${href}">${m2}</a></div>
<div><a href="${url}">${help}</a></div>
</body></html>`
  window.location.href = urlFromText(t)
}