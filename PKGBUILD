# Maintainer: layolayo <layolayo@users.noreply.github.com>
pkgname=bandarchy
pkgver=0.1.0
pkgrel=1
pkgdesc="Bandcamp purchased collection & local lossless music player and Omarchy shell plugin with TTE album-art visualiser"
arch=('any')
url="https://github.com/layolayo/bandarchy"
license=('MIT')
depends=('python' 'mpv' 'cava' 'quickshell' 'curl' 'sqlite')
optdepends=(
  'yt-dlp: Bandcamp stream fallback extraction'
  'ffmpeg: Audio duration probing and format conversion'
  'python-terminaltexteffects: Native ttfx terminal screensaver effects'
)
source=()
sha256sums=()

package() {
  local plugindir="${pkgdir}/usr/share/omarchy/plugins/io.github.layolayo.bandarchy"
  install -dm755 "${plugindir}/bin" "${plugindir}/share" "${pkgdir}/usr/bin" "${pkgdir}/usr/share/applications"

  install -m644 "${startdir}/manifest.json" "${plugindir}/manifest.json"
  install -m644 "${startdir}/Service.qml" "${plugindir}/Service.qml"
  install -m644 "${startdir}/BarWidget.qml" "${plugindir}/BarWidget.qml"
  install -m644 "${startdir}/Panel.qml" "${plugindir}/Panel.qml"
  install -m644 "${startdir}/App.qml" "${plugindir}/App.qml"
  install -m644 "${startdir}/Visualiser.qml" "${plugindir}/Visualiser.qml"
  install -m644 "${startdir}/Spectrum.qml" "${plugindir}/Spectrum.qml"
  install -m644 "${startdir}/Vinyl.qml" "${plugindir}/Vinyl.qml"
  install -m644 "${startdir}/PsychedelicEngine.js" "${plugindir}/PsychedelicEngine.js"
  install -m644 "${startdir}/icon.svg" "${plugindir}/icon.svg"
  install -m644 "${startdir}/share/cava.conf" "${plugindir}/share/cava.conf"
  install -m755 "${startdir}/bin/bandarchy" "${plugindir}/bin/bandarchy"
  install -m755 "${startdir}/bin/bandarchy-player" "${plugindir}/bin/bandarchy-player"
  ln -sf bandarchy "${plugindir}/bin/bandcamp"

  ln -sf "/usr/share/omarchy/plugins/io.github.layolayo.bandarchy/bin/bandarchy" "${pkgdir}/usr/bin/bandarchy"
  ln -sf "/usr/share/omarchy/plugins/io.github.layolayo.bandarchy/bin/bandarchy-player" "${pkgdir}/usr/bin/bandarchy-player"
  install -m644 "${startdir}/io.github.layolayo.bandarchy.desktop" "${pkgdir}/usr/share/applications/io.github.layolayo.bandarchy.desktop"
  install -Dm644 "${startdir}/LICENSE" "${pkgdir}/usr/share/licenses/${pkgname}/LICENSE"
}
