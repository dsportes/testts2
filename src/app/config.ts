const head = `<html><head><meta charset="utf-8">
<style>div {font-size:18px;margin:12px;font-family:sans-serif;text-align:center;};a{margin-right:20px};</style>
</head><body>
`
const tail =`
</body></html>
`

const dupfr = head + `<div>Le lancement de l'application plus d'une fois dans ce browser n'est pas autorisé.
<a href="https://asocialapps.github.io/frdocs/">Aide</a></div>
` + tail

const dupen = head + `<div>Duplicate application launch in this browser not allowed.
<a href="https://asocialapps.github.io/frdocs/">Help</a></div>
` + tail

export default {
  LOCATION: 'http://locahost:8080',
  BUILD: '2.1',

  APPNAME: 'asocial2',

  DUPBYE: { fr: dupfr, en: dupen }, // ou DUPBYE: ''
  RELOADDELAY: 1000,
  NOTIFICATIONCLICK: true,
  // vapidPublicKey in B64
  WEBPUSH: 'BC8J60JGGoZRHWJDrSbRih-0qi4Ug0LPbYsnft668oH56hqApUR0piwzZ_fsr0qGrkbOYSJ0lX1hPRTawQE88Ew',
  DEBUG: true,

  LANGOPTIONS: [
    { value: 'en', label: 'English 🇬🇧',  flag: '🇬🇧' },
    { value: 'fr', label: 'Français 🇫🇷', flag: '🇫🇷' }
  ],
  LANG: 'fr',

  DARK: true,
  THEMES: {
    // primary: ['#B71C1C', '#0D47A1'], // pour tester le changement de theme
    primary: ['#0D47A1', '#0D47A1'],
    secondary: ['#33691E', '#33691E'],
    info: ['#82C8E8', '#0101FF'],
    accent: ['#9C27B0', '#9C27B0'],
    positive: ['#21BA45', '#21BA45'],
    negative: ['#C10015', '#C10015'],
    warning: ['#E65100', '#E65100'],
    msgbg: ['#FFF176', '#FFF176'],
    msgtc: ['#B71C1C', '#B71C1C'],
    tbptc: ['#FFFFFF', '#FFFFFF'],
    tbstc: ['#FFFFFF', '#FFFFFF'],
    btnbg: ['#1976D2', '#1976D2'],
    btntc: ['#FFFFFF', '#FFFFFF'],
    btwbg: ['#E65100', '#E65100'],
    btwtc: ['#FFFFFF', '#FFFFFF'],
    mdtitre: ['#64B5F6', '#1565C0'],
    mdtitlesd: ['rgb(90, 1, 1)', 'rgb(90, 1, 1)'],
    mdtitlesc: ['rgb(155, 148, 253)', 'rgb(155, 148, 253)']
  }

}