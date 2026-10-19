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
  'python-terminaltexteffects: Layer 3 TTE text animations'
  'ffmpeg: Audio duration probing and format conversion'
  'ttfx: Native Omarchy terminal screensaver effects'
  'imagemagick: Album art ASCII transcoding via omarchy-transcode-ascii'
)
source=()
sha256sums=()

package() {
  local plugindir="${pkgdir}/usr/share/omarchy/plugins/io.github.layolayo.bandarchy"
  install -dm755 "${plugindir}/bin" "${plugindir}/share" "${plugindir}/share/photo_engine" \
                 "${pkgdir}/usr/share/bandarchy/photo_engine" "${pkgdir}/usr/bin" "${pkgdir}/usr/share/applications"

  install -m644 "${startdir}/manifest.json" "${plugindir}/manifest.json"
  install -m644 "${startdir}/Service.qml" "${plugindir}/Service.qml"
  install -m644 "${startdir}/BarWidget.qml" "${plugindir}/BarWidget.qml"
  install -m644 "${startdir}/Panel.qml" "${plugindir}/Panel.qml"
  install -m644 "${startdir}/App.qml" "${plugindir}/App.qml"
  install -m644 "${startdir}/Visualiser.qml" "${plugindir}/Visualiser.qml"
  install -m644 "${startdir}/Spectrum.qml" "${plugindir}/Spectrum.qml"
  install -m644 "${startdir}/Vinyl.qml" "${plugindir}/Vinyl.qml"
  install -m644 "${startdir}/PsychedelicEngine.js" "${plugindir}/PsychedelicEngine.js"
  install -m644 "${startdir}/PhotoMotionEngine.js" "${plugindir}/PhotoMotionEngine.js"
  install -m644 "${startdir}/icon.svg" "${plugindir}/icon.svg"
  install -m644 "${startdir}/share/cava.conf" "${plugindir}/share/cava.conf"
  for _shader in psychedelic.frag psychedelic.frag.qsb photo_motion.frag photo_motion.frag.qsb; do
    if [ -f "${startdir}/share/${_shader}" ]; then
      install -m644 "${startdir}/share/${_shader}" "${plugindir}/share/${_shader}"
    fi
  done
  if [ -f "${startdir}/share/statements.txt" ]; then
    install -m644 "${startdir}/share/statements.txt" "${plugindir}/share/statements.txt"
  fi
  install -m755 "${startdir}/share/photo_engine/bandarchy_photo_import.py" "${plugindir}/share/photo_engine/bandarchy_photo_import.py"
  install -m644 "${startdir}/share/photo_engine/"effects_family*.py "${plugindir}/share/photo_engine/"
  install -m644 "${startdir}/share/photo_engine/"photo_motion_group*.py "${plugindir}/share/photo_engine/"
  install -m755 "${startdir}/share/photo_engine/bandarchy_photo_import.py" "${pkgdir}/usr/share/bandarchy/photo_engine/bandarchy_photo_import.py"
  install -m644 "${startdir}/share/photo_engine/"effects_family*.py "${pkgdir}/usr/share/bandarchy/photo_engine/"
  install -m644 "${startdir}/share/photo_engine/"photo_motion_group*.py "${pkgdir}/usr/share/bandarchy/photo_engine/"
  install -m755 "${startdir}/bin/bandarchy" "${plugindir}/bin/bandarchy"
  install -m755 "${startdir}/bin/bandarchy-player" "${plugindir}/bin/bandarchy-player"

  ln -sf "/usr/share/omarchy/plugins/io.github.layolayo.bandarchy/bin/bandarchy" "${pkgdir}/usr/bin/bandarchy"
  ln -sf "/usr/share/omarchy/plugins/io.github.layolayo.bandarchy/bin/bandarchy-player" "${pkgdir}/usr/bin/bandarchy-player"
  install -Dm644 "${startdir}/icon.svg" "${pkgdir}/usr/share/icons/hicolor/scalable/apps/io.github.layolayo.bandarchy.svg"
  sed -e 's|^Exec=.*|Exec=/usr/bin/bandarchy-player|' \
      -e 's|^Icon=.*|Icon=/usr/share/omarchy/plugins/io.github.layolayo.bandarchy/icon.svg|' \
      "${startdir}/io.github.layolayo.bandarchy.desktop" \
      > "${pkgdir}/usr/share/applications/io.github.layolayo.bandarchy.desktop"
  chmod 644 "${pkgdir}/usr/share/applications/io.github.layolayo.bandarchy.desktop"
  install -Dm644 "${startdir}/LICENSE" "${pkgdir}/usr/share/licenses/${pkgname}/LICENSE"
}
