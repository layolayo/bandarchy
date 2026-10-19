#version 440

layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    vec2 uResolution;
    float uTime;
    float uRhythmPhase;
    int uMotionMode;

    // Audio telemetry
    float uBass;
    float uMid;
    float uTreble;
    float uFlux;
    float uBeatPulse;

    // Motion controls
    float uMotionSpeed;
    float uMotionDepth;
    float uMotionSpread;

    // Off-centre section magnification & pan
    float uPanX;
    float uPanY;
    float uZoom;

    // Whole-stage macro 3D kinematics
    float uMacroSlide;
    float uMacroSlideX;
    float uMacroSlideY;
    float uMacroScale;
    float uMacroRoll;
    float uPitch;
    float uYaw;
    float uRoll;
    float uPlaneShear;

    // 4-sector tonal opacity & palette colour-snatch bloom
    float uPhotoOpacity;
    float uBlackOpacity;
    float uMidOpacity;
    float uWhiteOpacity;
    float uColourSnatchOpacity;
    float uPaletteBloom;

    // Variant & snapshot crossfades and multi-photo pool mode
    float uVariantMix;
    float uSnapshotMix;
    int uPoolMode;
    int uVariantIndex;
    int uSecondaryVariantIndex;
    int uPrevVariantIndex;

    // Texture readiness flags
    int uHasPrimary;
    int uHasSecondary;
    int uHasPrev;
    int uHasPeer;

    // Active palette & stage background colours
    vec4 uCol0;
    vec4 uCol1;
    vec4 uCol2;
    vec4 uBgCol;
};

layout(binding = 1) uniform sampler2D texPrimary;
layout(binding = 2) uniform sampler2D texSecondary;
layout(binding = 3) uniform sampler2D texPrev;
layout(binding = 4) uniform sampler2D texPeer;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

vec2 mirrorUV(vec2 uv) {
    vec2 m = mod(uv, 2.0);
    m = mix(m, m + 2.0, step(m, vec2(0.0)));
    return vec2(
        m.x > 1.0 ? 2.0 - m.x : m.x,
        m.y > 1.0 ? 2.0 - m.y : m.y
    );
}

// Applies the 16 photo variant transformations (V00..V15) in hardware when a mode shifts variant index
vec3 applyVariantStyle(vec3 rgb, vec2 uv, int vIdx) {
    int vid = clamp(vIdx, 0, 15);
    if (vid == 0) return rgb;
    float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
    if (vid == 1) {
        return 1.0 - rgb;
    } else if (vid <= 4) {
        return clamp((rgb - 0.5) * 1.08 + 0.5, 0.0, 1.0);
    } else if (vid == 5) {
        return vec3(smoothstep(0.18, 0.82, luma));
    } else if (vid == 6) {
        return abs(rgb * 2.0 - 1.0);
    } else if (vid == 7) {
        return floor(rgb * 4.0 + 0.5) / 4.0;
    } else if (vid == 8) {
        return mix(uCol0.rgb * 0.45, mix(uCol1.rgb, uCol2.rgb, smoothstep(0.45, 0.95, luma)), smoothstep(0.05, 0.65, luma));
    } else if (vid == 9) {
        vec3 deep = vec3(0.03, 0.10, 0.26);
        vec3 cyan = vec3(0.18, 0.62, 0.88);
        vec3 paper = vec3(0.92, 0.96, 1.0);
        return luma < 0.5 ? mix(deep, cyan, luma * 2.0) : mix(cyan, paper, (luma - 0.5) * 2.0);
    } else if (vid == 10) {
        return 0.5 + 0.5 * sin(vec3(luma * TAU * 1.5) + vec3(0.2, 2.3, 4.4));
    } else if (vid == 11) {
        return clamp(rgb * vec3(1.18, 0.94, 1.18), 0.0, 1.0);
    } else if (vid == 12) {
        return rgb * (0.78 + 0.22 * sin(uv.y * 240.0 * PI));
    } else if (vid == 13) {
        return clamp(mix(rgb, rgb.gbr, 0.22), 0.0, 1.0);
    } else if (vid == 14) {
        return mix(uBgCol.rgb * 0.25, mix(uCol0.rgb, vec3(1.0), 0.65), smoothstep(0.36, 0.58, luma));
    }
    vec3 dream = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, uv.x), uv.y);
    return mix(rgb, dream, 0.42);
}

vec2 applyVariantUV(vec2 uv, int vIdx) {
    int vid = clamp(vIdx, 0, 15);
    vec2 m = mirrorUV(uv);
    if (vid == 2) return vec2(1.0 - m.x, m.y);
    if (vid == 3) return vec2(m.x, 1.0 - m.y);
    if (vid == 4) return abs(m * 2.0 - 1.0);
    if (vid == 13) {
        vec2 c = abs(m - 0.5);
        return (c.x > c.y) ? vec2(0.5 + c.y, 0.5 + c.x) : vec2(0.5 + c.x, 0.5 + c.y);
    }
    return m;
}

// Off-centre section magnification & pan transform matching PhotoMotionEngine.js
vec2 applyViewportSection(vec2 uv) {
    float zoom = clamp(uZoom, 1.0, 4.5);
    float panScale = max(0.12, 1.0 - 1.0 / max(1.08, zoom));
    vec2 centre = vec2(0.5) + vec2(clamp(uPanX, -0.95, 0.95), clamp(uPanY, -0.95, 0.95)) * 0.42 * panScale;
    return (uv - 0.5) / zoom + centre;
}

// Whole-stage macro 3D perspective & slide transform matching PhotoMotionEngine.js
vec2 applyMacroKinematics(vec2 uv, out float planeFade) {
    planeFade = 1.0;
    vec2 p = uv - 0.5;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    p.x *= aspect;

    float slideMag = clamp(uMacroSlide, 0.0, 2.0);
    p -= vec2(uMacroSlideX, uMacroSlideY) * (0.42 + 0.18 * slideMag);
    p /= max(0.25, uMacroScale);

    float totalRoll = uMacroRoll + uRoll * 0.65;
    p = rot2(-totalRoll) * p;

    float sx = sin(uYaw), cx = cos(uYaw);
    float sy = sin(uPitch), cy = cos(uPitch);
    float denom = 1.0 + (p.x * sx * 0.55 + p.y * sy * 0.55) * (0.65 + 0.35 * uPlaneShear);
    if (denom < 0.14) {
        planeFade = 0.0;
        return vec2(0.5);
    }
    p.x = (p.x / max(0.32, abs(cx)) + p.y * sin(uRoll) * 0.22 * uPlaneShear) / denom;
    p.y = (p.y / max(0.32, abs(cy)) - p.x * sin(uPitch) * 0.18 * uPlaneShear) / denom;

    p.x /= aspect;
    vec2 outUV = p + 0.5;

    vec2 edgeDist = min(outUV, 1.0 - outUV);
    float edgeMin = min(edgeDist.x, edgeDist.y);
    if (edgeMin < 0.0) {
        planeFade = clamp(1.0 + edgeMin * 3.5, 0.18, 1.0);
    }
    return outUV;
}

// Unified stage sampler: blends primary/secondary/prev/peer textures first, then applies variant style once.
// Called at most twice at the end of main() so SPIR-V compilation stays < 50 ms on Intel Arc / Mesa.
vec4 sampleStageAt(vec2 rawUV, int variantOverride, float peerBlendOverride) {
    vec2 secUV = applyViewportSection(rawUV);
    int vPri = (variantOverride >= 0) ? variantOverride : uVariantIndex;
    bool isPinned = (uVariantIndex == uSecondaryVariantIndex);
    int effPri = (isPinned && vPri == uVariantIndex) ? 0 : vPri;

    vec2 uvPri = applyVariantUV(secUV, effPri);
    vec4 cPri = (uHasPrimary != 0)
        ? texture(texPrimary, uvPri)
        : ((uHasPrev != 0) ? texture(texPrev, uvPri) : vec4(uCol0.rgb * 0.35, 1.0));

    if (uVariantMix > 0.001) {
        if (uPoolMode == 0 || uHasSecondary == 0) {
            int effSec = (isPinned && uSecondaryVariantIndex == uVariantIndex) ? 0 : uSecondaryVariantIndex;
            vec2 uvSec = applyVariantUV(secUV, effSec);
            vec4 cSec = (uHasPrimary != 0) ? texture(texPrimary, uvSec) : cPri;
            cPri = mix(cPri, cSec, clamp(uVariantMix, 0.0, 1.0));
        } else {
            vec4 cSec = texture(texSecondary, uvPri);
            cPri = mix(cPri, cSec, sin(clamp(uVariantMix, 0.0, 1.0) * PI) * 0.35 + clamp(uVariantMix, 0.0, 1.0) * 0.65);
        }
    }

    if (uHasPrev != 0 && uSnapshotMix < 0.999) {
        vec4 cPrev = texture(texPrev, uvPri);
        cPri = mix(cPrev, cPri, clamp(uSnapshotMix, 0.0, 1.0));
    }

    if (uHasPeer != 0 && (uPoolMode > 0 || peerBlendOverride > 0.001)) {
        vec2 peerUV = mirrorUV(secUV * 1.04 - 0.02 + vec2(sin(uTime * 0.35), cos(uTime * 0.29)) * 0.03);
        vec4 cPeer = texture(texPeer, peerUV);
        float pMix = peerBlendOverride;
        if (pMix <= 0.001) {
            if (uPoolMode == 1) {
                pMix = 0.38 + 0.14 * sin(uRhythmPhase + secUV.x * PI);
            } else if (uPoolMode == 2) {
                pMix = step(0.5, fract((secUV.x + secUV.y * 0.35) * 6.0 + uTime * 0.25)) * 0.75;
            } else {
                pMix = smoothstep(0.28, 0.78, length(secUV - 0.5) * 1.414) * 0.68;
            }
        }
        cPri = mix(cPri, cPeer, clamp(pMix, 0.0, 1.0));
    }

    cPri.rgb = applyVariantStyle(cPri.rgb, uvPri, effPri);
    return cPri;
}

void main() {
    if (uHasPrimary == 0 && uHasPrev == 0) {
        fragColor = vec4(0.0);
        return;
    }

    float aspect = uResolution.x / max(1.0, uResolution.y);
    float spd = clamp(uMotionSpeed, 0.1, 3.0);
    float dep = clamp(uMotionDepth, 0.05, 2.5);
    float spr = clamp(uMotionSpread, 0.1, 2.5);
    float t = uTime * spd;
    float rPhase = uRhythmPhase;
    int mode = clamp(uMotionMode, 0, 24);

    float macroFade = 1.0;
    vec2 uv = applyMacroKinematics(qt_TexCoord0, macroFade);
    vec2 p = uv - 0.5;
    vec2 pa = vec2(p.x * aspect, p.y);
    float r = length(pa);
    float ang = atan(pa.y, pa.x);

    // Deferred multi-tap sampling descriptors (populated by the active mode 0..24, sampled once below)
    vec2 uv0 = uv;
    int var0 = -1;
    float peer0 = 0.0;
    vec3 tint0 = vec3(0.0);
    float tint0Mix = 0.0;

    vec2 uv1 = uv;
    int var1 = uSecondaryVariantIndex;
    float peer1 = 0.0;
    float mix1 = 0.0;
    vec3 tint1 = vec3(0.0);
    float tint1Mix = 0.0;

    vec2 uv2 = uv;
    float mix2 = 0.0;
    int specialCombine = 0; // 0: standard mix, 1: M13 tri-vector prism, 2: M18 RGB tear, 3: M19 luma contour, 4: M23 luma-key portal

    vec3 postScale = vec3(1.0);
    vec3 postAdd = vec3(0.0);

    // =========================================================================
    // 25 AUTHENTIC PHOTO-MOTION MODES (M01..M25, 0..24)
    // =========================================================================
    if (mode == 0) {
        // M01: 3D XYZ Plane Tilt & Flip (primary tilted plane + receding 3D ghost planes)
        uv0 = uv;
        var0 = uVariantIndex;
        float g1Scale = max(0.25, 1.0 - 0.16 * spr * (0.85 + 0.25 * uBass));
        float g1Roll = 0.09 * sin(rPhase + 1.0) * dep;
        vec2 gp1 = rot2(g1Roll) * (p / g1Scale) + vec2(sin(rPhase * 0.7 + 1.0), cos(rPhase * 0.5 + 1.0)) * 0.045 * spr;
        uv1 = gp1 + 0.5;
        var1 = (uVariantIndex + 2) & 15;
        peer1 = (uPoolMode > 0) ? 0.65 : 0.0;
        mix1 = 0.36;
        tint1 = uCol0.rgb;
        tint1Mix = 0.24;

        float g2Scale = max(0.25, 1.0 - 0.32 * spr * (0.85 + 0.25 * uBass));
        vec2 gp2 = rot2(-g1Roll * 1.6) * (p / g2Scale) - vec2(cos(rPhase * 0.6), sin(rPhase * 0.8)) * 0.07 * spr;
        uv2 = gp2 + 0.5;
        mix2 = 0.22;
        float ghostRim = smoothstep(0.47, 0.50, max(abs(gp1.x), abs(gp1.y))) * step(max(abs(gp1.x), abs(gp1.y)), 0.52);
        postAdd = uCol0.rgb * ghostRim * 0.32;
    } else if (mode == 1) {
        // M02: 4D Tesseract Folding Cube (outer cube + inner hypercube extended to 50% of tiled space + 4 trapezium side walls)
        float innerHalf = clamp((0.35 + 0.05 * sin(rPhase * 0.85) + uBass * 0.04) / max(0.65, spr * 0.85), 0.28, 0.42);
        vec2 ap = abs(p);
        float maxC = max(ap.x, ap.y);
        if (maxC <= innerHalf) {
            uv0 = (p / (innerHalf * 2.0)) + 0.5;
            var0 = (uVariantIndex + 4) & 15;
            peer0 = uPoolMode > 0 ? 0.65 : 0.0;
            float edge = smoothstep(innerHalf * 0.78, innerHalf, maxC);
            tint0 = uCol0.rgb;
            tint0Mix = 0.14 + edge * 0.48;
            postScale = vec3(1.10);
        } else {
            float wallT = clamp((maxC - innerHalf) / max(0.001, 0.5 - innerHalf), 0.0, 1.0);
            if (ap.x > ap.y) {
                float sy = p.y / max(0.001, ap.x) * 0.5 + 0.5;
                uv0 = vec2(p.x > 0.0 ? wallT : 1.0 - wallT, sy);
                var0 = (uVariantIndex + (p.x > 0.0 ? 2 : 3)) & 15;
            } else {
                float sx = p.x / max(0.001, ap.y) * 0.5 + 0.5;
                uv0 = vec2(sx, p.y > 0.0 ? wallT : 1.0 - wallT);
                var0 = (uVariantIndex + (p.y > 0.0 ? 6 : 8)) & 15;
            }
            float diagSeam = smoothstep(0.025, 0.0, abs(ap.x - ap.y));
            postScale = vec3(0.74 + 0.26 * (1.0 - wallT * 0.45));
            postAdd = uCol1.rgb * diagSeam * (0.35 + 0.35 * uBeatPulse);
        }
    } else if (mode == 2) {
        // M03: Relativistic Z-Corridor Echo Train (depth-sorted corridor frames)
        float travel = fract(t * 0.42);
        bool hit0 = false;
        bool hit1 = false;
        for (int i = 5; i >= 0; --i) {
            float z = fract((float(i) + travel) / 6.0);
            float scale = mix(0.14, 1.35, z * z);
            float twist = (1.0 - z) * 0.38 * sin(rPhase * 0.6) * dep;
            vec2 cp = rot2(twist) * (p / max(0.08, scale));
            float box = max(abs(cp.x), abs(cp.y));
            if (box < 0.52) {
                float rim = smoothstep(0.45, 0.50, box) * step(box, 0.515);
                postAdd += ((i % 2 == 0) ? uCol0.rgb : uCol2.rgb) * rim * (0.22 + 0.25 * z);
                if (!hit0) {
                    uv0 = cp + 0.5;
                    var0 = (uVariantIndex + i) & 15;
                    peer0 = (i % 2 == 1 && uPoolMode > 0) ? 0.55 : 0.0;
                    hit0 = true;
                } else if (!hit1) {
                    uv1 = cp + 0.5;
                    var1 = (uVariantIndex + i) & 15;
                    mix1 = 0.38;
                    hit1 = true;
                }
            }
        }
    } else if (mode == 3) {
        // M04: Stroboscopic Shutter & Ghost Flicker (50% highlighted vertical shutter louvers + ghost echo)
        float blades = floor(10.0 + 6.0 * spr);
        float colIdx = floor(uv.x * blades);
        float localX = fract(uv.x * blades);
        float phase = rPhase * 2.4 + colIdx * 0.65 + uBeatPulse * 1.8;
        float openAmt = 0.50 + 0.42 * abs(cos(phase * (0.6 + 0.4 * dep)));
        float centred = (localX - 0.5) / max(0.12, openAmt);
        bool isHiBlade = (mod(colIdx + floor(rPhase * 1.5), 2.0) < 1.0);
        if (abs(centred) <= 0.5) {
            uv0 = vec2((colIdx + centred + 0.5) / blades, uv.y + sin(phase) * 0.03 * dep);
            var0 = isHiBlade ? uSecondaryVariantIndex : uVariantIndex;
            peer0 = (isHiBlade && uPoolMode > 0) ? 0.55 : 0.0;
            postScale = isHiBlade ? vec3(1.10) : vec3(0.92);
            tint0 = uCol0.rgb;
            tint0Mix = isHiBlade ? (0.16 + 0.14 * uBeatPulse) : 0.0;
        } else {
            uv0 = uv + vec2(0.035 * sin(t * 1.8), -0.025 * cos(t * 1.4)) * spr;
            var0 = (uVariantIndex + 1) & 15;
            peer0 = 0.65;
            postScale = vec3(0.72);
            tint0 = uCol1.rgb * 0.65;
            tint0Mix = 0.28;
        }
    } else if (mode == 4) {
        // M05: Gyroscopic 3-Axis Card-Flip Cascade (grid of 3D flipping tiles with 50% highlighted tiled space)
        vec2 grid = vec2(floor(4.0 + 2.0 * spr), floor(3.0 + 2.0 * spr));
        vec2 cellId = floor(uv * grid);
        vec2 cellUV = fract(uv * grid) - 0.5;
        float wave = rPhase * 1.5 + cellId.x * 0.55 + cellId.y * 0.75 + uBass * 1.4;
        float flipCos = cos(wave * dep);
        float flipDir = (mod(cellId.x + cellId.y, 2.0) < 0.5) ? 1.0 : -1.0;
        float isHiTile = step(0.0, sin(wave)); // 50% of the tiled grid space highlighted
        vec2 warpedCell = cellUV;
        float cardSpan = mix(0.55, 1.0, abs(flipCos));
        if (flipDir > 0.0) {
            warpedCell.x /= sign(flipCos) * cardSpan;
        } else {
            warpedCell.y /= sign(flipCos) * cardSpan;
        }
        if (max(abs(warpedCell.x), abs(warpedCell.y)) <= 0.48) {
            uv0 = (cellId + warpedCell + 0.5) / grid;
            var0 = (isHiTile > 0.5) ? uSecondaryVariantIndex : uVariantIndex;
            peer0 = (isHiTile > 0.5 && uPoolMode > 0) ? 0.65 : 0.0;
            postScale = vec3(mix(0.84, 1.12, isHiTile));
            tint0 = uCol0.rgb;
            tint0Mix = isHiTile * (0.18 + 0.16 * uBeatPulse);
        } else {
            uv0 = uv;
            var0 = (uVariantIndex + 5) & 15;
            postScale = vec3(0.62);
        }
    } else if (mode == 5) {
        // M06: Chronos Time-Slice Slit-Scan (horizontal slits with 50% highlighted tiled bands)
        float slits = floor(22.0 + 14.0 * spr);
        float sIdx = floor(uv.y * slits);
        float sNorm = sIdx / slits;
        float delay = sin(sNorm * TAU * (1.2 + 0.6 * spr) - rPhase * 2.2) * (0.08 + 0.14 * dep * (0.5 + uBass));
        float shearX = (sNorm - 0.5) * 0.16 * sin(rPhase * 0.9) * dep;
        uv0 = vec2(uv.x + delay + shearX, uv.y + cos(sNorm * PI * 4.0 + t) * 0.015 * dep);
        float isHiSlit = step(0.0, sin(sNorm * TAU * 2.0 - rPhase * 1.8)); // 50% of slits highlighted
        var0 = (isHiSlit > 0.5) ? uSecondaryVariantIndex : uVariantIndex;
        peer0 = (isHiSlit > 0.5 && uPoolMode > 0) ? 0.50 : 0.0;
        postScale = vec3(mix(0.90, 1.10, isHiSlit));
        tint0 = uCol0.rgb;
        tint0Mix = isHiSlit * 0.16;
    } else if (mode == 6) {
        // M07: Sacred 8-Way Kaleidoscopic Mirror Fold
        float segs = 8.0;
        float a = ang + rPhase * 0.35 * dep;
        float sector = TAU / segs;
        float secIdx = floor(mod(a, TAU) / sector);
        float fAng = mod(a, sector);
        if (fAng > sector * 0.5) fAng = sector - fAng;
        float rad = r * (0.85 + 0.25 * sin(rPhase + r * 4.0 * spr) * dep);
        uv0 = vec2(cos(fAng), sin(fAng)) * rad + 0.5 + vec2(sin(t * 0.31), cos(t * 0.27)) * 0.08 * spr;
        float isHiWedge = (mod(secIdx, 2.0) < 1.0) ? 1.0 : 0.0; // 4 of 8 wedges (50%) highlighted
        var0 = (isHiWedge > 0.5) ? uSecondaryVariantIndex : uVariantIndex;
        float seam = smoothstep(0.04, 0.0, min(fAng, sector * 0.5 - fAng));
        postScale = vec3(mix(0.92, 1.08, isHiWedge));
        postAdd = uCol0.rgb * seam * (0.28 + 0.42 * uTreble);
    } else if (mode == 7) {
        // M08: 4x4 All-16-Variants Mosaic Matrix (50% of the 16-tile grid highlighted simultaneously)
        vec2 mGrid = vec2(4.0, 4.0);
        vec2 mId = clamp(floor(uv * mGrid), vec2(0.0), vec2(3.0));
        vec2 mLocal = fract(uv * mGrid);
        int cellVar = int(mId.y * 4.0 + mId.x);
        int focusStart = int(mod(floor(rPhase * 1.5), 16.0));
        int relCell = (cellVar - focusStart + 16) & 15;
        // Highlight 8 out of 16 tiles (50% of the tiled space)
        float isFocus = (relCell < 8) ? 1.0 : 0.0;
        float cellZoom = 1.0 + isFocus * 0.18 * (0.5 + uBeatPulse);
        uv0 = (mLocal - 0.5) / cellZoom + 0.5;
        var0 = cellVar;
        peer0 = (isFocus > 0.5 && uPoolMode > 0) ? 0.55 : 0.0;
        float border = smoothstep(0.44, 0.495, max(abs(mLocal.x - 0.5), abs(mLocal.y - 0.5)));
        postScale = vec3(mix(0.86, 1.14, isFocus));
        tint0 = mix(uCol1.rgb * 0.55, uCol0.rgb, isFocus);
        tint0Mix = isFocus * (0.18 + 0.14 * uBeatPulse) + border * mix(0.32, 0.78, isFocus);
    } else if (mode == 8) {
        // M09: Infinite Droste Recursive Frame-In-Frame Spiral Tunnel
        float ratio = 0.62;
        float logR = log(max(0.001, max(abs(p.x), abs(p.y)) * 2.0)) / log(ratio);
        float zoomLoop = fract(t * 0.48);
        float level = floor(logR + zoomLoop);
        float scale = pow(ratio, level - zoomLoop);
        float spiralAng = (level - zoomLoop) * 0.24 * sin(rPhase * 0.5) * dep;
        vec2 dp = rot2(spiralAng) * (p / max(0.001, scale));
        uv0 = dp + 0.5;
        float isHiFrame = (mod(abs(level), 2.0) < 1.0) ? 1.0 : 0.0; // 50% of nested frames highlighted
        var0 = (uVariantIndex + int(mod(abs(level), 4.0)) * 3) & 15;
        float frameEdge = smoothstep(0.44, 0.495, max(abs(dp.x), abs(dp.y)));
        postScale = vec3(mix(0.90, 1.10, isHiFrame));
        tint0 = mix(uCol1.rgb, uCol0.rgb, isHiFrame) * (0.70 + 0.30 * uBeatPulse);
        tint0Mix = isHiFrame * 0.14 + frameEdge * 0.58;
    } else if (mode == 9) {
        // M10: Tectonic Counter-Sliding Mirror Strips (alternating 50% highlighted horizontal/vertical slabs)
        float strips = floor(9.0 + 5.0 * spr);
        bool horiz = (sin(rPhase * 0.25) >= -0.2);
        float coord = horiz ? uv.y : uv.x;
        float sId = floor(coord * strips);
        float dir = (mod(sId, 2.0) < 0.5) ? 1.0 : -1.0; // 50% of strips
        float isHiStrip = (dir > 0.0) ? 1.0 : 0.0;
        float slide = dir * (0.12 + 0.18 * dep) * sin(rPhase * 1.4 + sId * 0.7 + uBass * 1.5);
        uv0 = uv;
        if (horiz) uv0.x += slide; else uv0.y += slide;
        var0 = (dir < 0.0) ? uSecondaryVariantIndex : uVariantIndex;
        peer0 = (isHiStrip > 0.5 && uPoolMode > 0) ? 0.50 : 0.0;
        float seam = smoothstep(0.04, 0.0, abs(fract(coord * strips) - 0.5) - 0.46);
        postScale = vec3(mix(0.90, 1.10, isHiStrip));
        tint0 = uCol0.rgb;
        tint0Mix = isHiStrip * 0.15;
        postAdd = uCol2.rgb * seam * 0.28;
    } else if (mode == 10) {
        // M11: Hexagonal Honeycomb Prism Array (50% of honeycomb cells highlighted)
        float hexScale = 7.0 + 5.0 * spr;
        vec2 hp = pa * hexScale;
        const vec2 s = vec2(1.0, 1.7320508);
        vec4 hC = floor(vec4(hp, hp - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
        vec4 hD = vec4(hp - hC.xy * s, hp - (hC.zw + 0.5) * s);
        vec4 hex = (dot(hD.xy, hD.xy) < dot(hD.zw, hD.zw)) ? vec4(hD.xy, hC.xy) : vec4(hD.zw, hC.zw + 0.5);
        float cellR = length(hex.xy);
        float pulse = sin(rPhase * 1.8 + length(hex.zw) * 0.65) * dep;
        float isHiHex = step(0.0, pulse); // 50% of honeycomb cells highlighted
        uv0 = uv + hex.xy * (0.06 + 0.08 * pulse) + vec2(cos(pulse), sin(pulse)) * 0.02 * uBass;
        var0 = (isHiHex > 0.5)
            ? uSecondaryVariantIndex
            : ((uVariantIndex + int(mod(abs(hex.z + hex.w * 3.0), 4.0)) * 2) & 15);
        peer0 = (isHiHex > 0.5 && uPoolMode > 0) ? 0.55 : 0.0;
        float hexRim = smoothstep(0.40, 0.52, cellR);
        postScale = vec3(mix(0.88, 1.12, isHiHex));
        tint0 = mix(uCol1.rgb, uCol0.rgb, isHiHex) * (0.65 + 0.35 * uTreble);
        tint0Mix = isHiHex * 0.16 + hexRim * 0.52;
    } else if (mode == 11) {
        // M12: Inception 4-Wall Architectural Box Fold (Portal extended to 50% of tiled space + 4 bright walls)
        float portal = clamp(0.35 + 0.04 * sin(rPhase * 0.7) - 0.02 * dep, 0.28, 0.40);
        vec2 ap = abs(p);
        float m = max(ap.x, ap.y);
        if (m <= portal) {
            uv0 = (p / (portal * 2.0)) + 0.5;
            var0 = uSecondaryVariantIndex;
            peer0 = 0.6;
            float portalRim = smoothstep(portal * 0.82, portal, m);
            postScale = vec3(1.10);
            tint0 = uCol0.rgb;
            tint0Mix = 0.12 + portalRim * 0.42;
        } else {
            float depthT = (m - portal) / max(0.001, 0.5 - portal);
            float zWalk = fract(depthT - t * 0.28);
            float wallLight = 0.82;
            if (ap.y >= ap.x) {
                uv0 = vec2((p.x / max(0.001, ap.y)) * 0.5 + 0.5, zWalk);
                wallLight = (p.y < 0.0) ? 0.88 : 0.96;
            } else {
                uv0 = vec2(zWalk, (p.y / max(0.001, ap.x)) * 0.5 + 0.5);
            }
            var0 = uVariantIndex;
            postScale = vec3(wallLight * (0.72 + 0.28 * depthT));
        }
    } else if (mode == 12) {
        // M13: Tri-Vector Palette Channel Separation (3 independent offset & rotated colour ghosts)
        float sep = (0.025 + 0.055 * dep * (0.45 + uBass + uBeatPulse * 0.5)) * spr;
        uv0 = uv + vec2(cos(rPhase * 1.3), sin(rPhase * 1.3)) * sep;
        var0 = uVariantIndex;
        uv1 = uv + vec2(cos(rPhase * 1.3 + 2.094), sin(rPhase * 1.3 + 2.094)) * sep;
        var1 = uSecondaryVariantIndex;
        mix1 = 1.0;
        uv2 = uv + vec2(cos(rPhase * 1.3 + 4.188), sin(rPhase * 1.3 + 4.188)) * sep;
        mix2 = 1.0;
        specialCombine = 1;
    } else if (mode == 13) {
        // M14: 48-Band Equaliser Venetian Shredder (vertical EQ columns with 50% highlighted bands)
        float bands = 48.0;
        float bIdx = floor(uv.x * bands);
        float bNorm = bIdx / bands;
        float eqEnergy = (bNorm < 0.33)
            ? mix(uBass, uMid, bNorm * 3.0)
            : mix(uMid, uTreble, (bNorm - 0.33) * 1.5);
        float wave = sin(bNorm * TAU * 3.0 + rPhase * 2.5) * 0.5 + 0.5;
        float yShift = (eqEnergy * (0.6 + 0.4 * wave) - 0.35) * 0.28 * dep * ((mod(bIdx, 2.0) < 0.5) ? 1.0 : -1.0);
        float isHiBand = step(0.50, wave); // 50% of EQ bands highlighted
        uv0 = vec2(uv.x, uv.y + yShift);
        var0 = (isHiBand > 0.5) ? uSecondaryVariantIndex : uVariantIndex;
        peer0 = (isHiBand > 0.5 && uPoolMode > 0) ? 0.55 : 0.0;
        postScale = vec3(mix(0.88, 1.12, isHiBand));
        tint0 = uCol0.rgb;
        tint0Mix = isHiBand * (0.16 + 0.14 * uBeatPulse);
    } else if (mode == 14) {
        // M15: Berlin Rave Shutter & Negative Strobe (50% of the 4x3 tiled grid highlighted)
        vec2 qGrid = floor(uv * vec2(4.0, 3.0));
        float cellHash = fract(hash21(qGrid) + floor(rPhase * (2.0 + spd)) * 0.37);
        float strobeActive = step(0.50, cellHash); // 50% of tiled space highlighted
        var0 = (strobeActive > 0.5)
            ? ((cellHash > 0.75) ? 1 : uSecondaryVariantIndex)
            : uVariantIndex;
        uv0 = uv + (strobeActive * (cellHash - 0.5) * 0.06 * dep);
        peer0 = strobeActive * 0.55;
        postScale = vec3(mix(0.88, 1.14, strobeActive));
        tint0 = uCol0.rgb;
        tint0Mix = strobeActive * (0.22 + 0.20 * uBeatPulse);
    } else if (mode == 15) {
        // M16: Concentric Counter-Rotating Ring Shear (50% alternating rings highlighted)
        float rings = floor(6.0 + 4.0 * spr);
        float ringIdx = floor(r * rings);
        float dir = (mod(ringIdx, 2.0) < 0.5) ? 1.0 : -1.0; // 50% of concentric rings
        float isHiRing = (dir > 0.0) ? 1.0 : 0.0;
        float rotAmt = dir * (0.35 + 0.45 * dep) * sin(rPhase * 0.9 + ringIdx * 0.65) + dir * uBass * 0.25;
        vec2 rp = rot2(rotAmt) * pa;
        uv0 = vec2(rp.x / aspect, rp.y) + 0.5;
        var0 = (dir < 0.0) ? uSecondaryVariantIndex : uVariantIndex;
        peer0 = (isHiRing > 0.5 && uPoolMode > 0) ? 0.50 : 0.0;
        float ringEdge = smoothstep(0.04, 0.0, abs(fract(r * rings) - 0.5) - 0.46);
        postScale = vec3(mix(0.90, 1.10, isHiRing));
        tint0 = uCol0.rgb;
        tint0Mix = isHiRing * 0.14;
        postAdd = uCol1.rgb * ringEdge * 0.32;
    } else if (mode == 16) {
        // M17: Voronoi Glass Shatter & Beat Reform (50% of polygonal Voronoi shards highlighted)
        float vScale = 5.0 + 3.0 * spr;
        vec2 vp = pa * vScale;
        vec2 i_st = floor(vp);
        vec2 f_st = fract(vp);
        float m_dist = 8.0;
        float m_dist2 = 8.0;
        vec2 m_id = vec2(0.0);
        vec2 m_diff = vec2(0.0);
        for (int y = -1; y <= 1; ++y) {
            for (int x = -1; x <= 1; ++x) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 cell = i_st + neighbor;
                vec2 pt = vec2(hash21(cell), hash21(cell + 17.3));
                pt = 0.5 + 0.38 * sin(rPhase * 0.9 + TAU * pt);
                vec2 diff = neighbor + pt - f_st;
                float d = length(diff);
                if (d < m_dist) {
                    m_dist2 = m_dist;
                    m_dist = d;
                    m_id = cell;
                    m_diff = diff;
                } else if (d < m_dist2) {
                    m_dist2 = d;
                }
            }
        }
        float shatter = (0.04 + 0.14 * (uBeatPulse + uBass * 0.7)) * dep;
        vec2 shardVec = normalize(m_id + 0.001) * shatter;
        float isHiShard = step(0.50, fract(hash21(m_id) + floor(rPhase * 1.2) * 0.37)); // 50% of Voronoi shards highlighted
        uv0 = uv - shardVec + m_diff * 0.03 * dep;
        var0 = (isHiShard > 0.5) ? uSecondaryVariantIndex : uVariantIndex;
        peer0 = (isHiShard > 0.5 && uPoolMode > 0) ? 0.55 : 0.0;
        float crack = smoothstep(0.08, 0.0, m_dist2 - m_dist);
        postScale = vec3(mix(0.88, 1.12, isHiShard));
        tint0 = uCol0.rgb * (0.8 + 0.6 * uBeatPulse);
        tint0Mix = isHiShard * 0.16 + crack * 0.75;
    } else if (mode == 17) {
        // M18: CRT Scanline Phase-Slip & Tracking Tear (VHS tracking bar, RGB split, horizontal jitter)
        float tearY = fract(t * 0.32);
        float inTear = smoothstep(0.14, 0.0, abs(uv.y - tearY));
        float lineJitter = (hash21(vec2(floor(uv.y * 180.0), floor(t * 18.0))) - 0.5) * 0.025 * dep;
        float xShift = lineJitter + inTear * sin(uv.y * 80.0 + t * 20.0) * 0.12 * (0.5 + uFlux + uBass);
        float rgbSep = (0.006 + 0.024 * inTear + 0.012 * uBass) * dep;
        uv0 = vec2(uv.x + xShift, uv.y);
        var0 = uVariantIndex;
        uv1 = vec2(uv.x + xShift + rgbSep, uv.y);
        var1 = uVariantIndex;
        mix1 = 1.0;
        uv2 = vec2(uv.x + xShift - rgbSep, uv.y);
        mix2 = 1.0;
        specialCombine = 2;
        postScale = vec3(0.84 + 0.16 * sin(uv.y * uResolution.y * 1.2));
    } else if (mode == 18) {
        // M19: Palette Resonance Hyper-Enhancer
        uv0 = uv;
        var0 = uVariantIndex;
        specialCombine = 3;
    } else if (mode == 19) {
        // M20: Event Horizon Gravitational Lens (Einstein ring black hole bending light around singularity)
        vec2 bhPos = vec2(sin(rPhase * 0.55), cos(rPhase * 0.42)) * 0.16 * spr;
        vec2 d = pa - bhPos;
        float dist = length(d) + 0.0001;
        float rs = (0.08 + 0.05 * uBass) * dep;
        float einstein = (rs * rs) / (dist + rs * 0.35);
        vec2 swirled = rot2(rs * 2.2 / (dist + 0.06)) * (d * (1.0 - einstein / dist));
        uv0 = vec2((swirled.x + bhPos.x) / aspect, swirled.y + bhPos.y) + 0.5;
        float ringGlow = exp(-abs(dist - rs * 1.45) * 22.0);
        float horizonMask = smoothstep(rs * 0.55, rs * 1.05, dist);
        postScale = vec3(horizonMask);
        postAdd = mix(uCol0.rgb, uCol2.rgb, 0.5) * ringGlow * (0.85 + 0.65 * uBeatPulse);
    } else if (mode == 20) {
        // M21: Mobius Cylinder & Torus Tunnel Wrap
        float u = (ang + PI) / TAU + t * 0.12;
        float v = 1.0 / (r + 0.18 + 0.06 * sin(rPhase)) + t * 0.28;
        float mobiusTwist = u + v * 0.35 * sin(rPhase * 0.4) * dep;
        uv0 = vec2(mobiusTwist, v * 0.45);
        float depthFog = smoothstep(0.04, 0.28, r);
        tint0 = uBgCol.rgb * 0.25 + uCol0.rgb * 0.25;
        tint0Mix = 1.0 - depthFog;
    } else if (mode == 21) {
        // M22: Liquid Acid Domain-Warp Melt
        vec2 w1 = vec2(
            sin(uv.y * 6.0 * spr + rPhase * 1.4) + cos(uv.x * 4.5 * spr - rPhase * 1.1),
            cos(uv.x * 6.0 * spr + rPhase * 1.2) - sin(uv.y * 5.0 * spr + rPhase * 1.5)
        );
        vec2 w2 = vec2(
            sin((uv.x + w1.x * 0.25) * 9.0 + t * 1.8),
            cos((uv.y + w1.y * 0.25) * 9.0 - t * 1.6)
        );
        uv0 = uv + (w1 * 0.055 + w2 * 0.028) * dep * (0.7 + 0.5 * uBass);
    } else if (mode == 22) {
        // M23: Luma-Key Vortex Portal Bleed
        uv0 = uv;
        var0 = uVariantIndex;
        vec2 vortexP = rot2(rPhase * 0.8 + (1.0 - r) * 2.4 * dep) * pa * (0.85 + 0.25 * sin(t));
        uv1 = vec2(vortexP.x / aspect, vortexP.y) + 0.5;
        var1 = uSecondaryVariantIndex;
        peer1 = 0.85;
        mix1 = 1.0;
        specialCombine = 4;
    } else if (mode == 23) {
        // M24: Cymatic Chladni Standing-Wave Ripple
        float n = floor(2.0 + mod(floor(rPhase * 0.35), 4.0));
        float m = floor(3.0 + mod(floor(rPhase * 0.22 + 1.0), 5.0));
        float chladni = cos(n * PI * p.x * 2.0 * spr) * cos(m * PI * p.y * 2.0 * spr)
                      - cos(m * PI * p.x * 2.0 * spr) * cos(n * PI * p.y * 2.0 * spr);
        vec2 grad = vec2(
            -sin(n * PI * p.x * 2.0 * spr) * cos(m * PI * p.y * 2.0 * spr),
            -cos(n * PI * p.x * 2.0 * spr) * sin(m * PI * p.y * 2.0 * spr)
        );
        uv0 = uv + grad * (0.045 + 0.055 * uBass) * dep * sin(rPhase * 2.0);
        float nodalLine = exp(-abs(chladni) * 7.5);
        tint0 = uCol0.rgb * (0.75 + 0.5 * uTreble);
        tint0Mix = nodalLine * 0.42 * dep;
    } else {
        // M25: Hyperdrive Volumetric Radial Extrusion
        vec2 focal = vec2(sin(rPhase * 0.45), cos(rPhase * 0.38)) * 0.14 * spr;
        vec2 dir = p - focal;
        float strength = (0.14 + 0.22 * (uBass * 0.7 + uBeatPulse)) * dep;
        uv0 = focal + dir * (1.0 - 0.12 * strength) + 0.5;
        var0 = uVariantIndex;
        uv1 = focal + dir * (1.0 - 0.52 * strength) + 0.5;
        var1 = uSecondaryVariantIndex;
        mix1 = 0.42;
        tint1 = uCol0.rgb;
        tint1Mix = 0.22;
        uv2 = focal + dir * (1.0 - 0.92 * strength) + 0.5;
        mix2 = 0.26;
    }

    // =========================================================================
    // UNIFIED STAGE TEXTURE EVALUATION (ONLY 2-3 SAMPLES TOTAL)
    // =========================================================================
    vec4 col = sampleStageAt(uv0, var0, peer0);
    if (tint0Mix > 0.001) {
        col.rgb = mix(col.rgb, tint0, clamp(tint0Mix, 0.0, 1.0));
    }

    if (mix1 > 0.001) {
        vec4 s1 = sampleStageAt(uv1, var1, peer1);
        if (tint1Mix > 0.001) {
            s1.rgb = mix(s1.rgb, tint1, clamp(tint1Mix, 0.0, 1.0));
        }
        vec3 s2 = col.rgb;
        if (mix2 > 0.001) {
            vec2 secUV2 = mirrorUV(applyViewportSection(uv2));
            s2 = (uHasPrimary != 0) ? texture(texPrimary, secUV2).rgb : col.rgb;
        }
        if (specialCombine == 1) {
            // M13: Tri-Vector Palette Channel Separation
            float l0 = dot(col.rgb, vec3(0.299, 0.587, 0.114));
            float l1 = dot(s1.rgb, vec3(0.299, 0.587, 0.114));
            float l2 = dot(s2, vec3(0.299, 0.587, 0.114));
            vec3 base = (col.rgb + s1.rgb + s2) / 3.0;
            vec3 prism = l0 * uCol0.rgb + l1 * uCol1.rgb + l2 * uCol2.rgb;
            col.rgb = mix(base, prism, 0.58);
        } else if (specialCombine == 2) {
            // M18: CRT RGB Tear
            col.rgb = vec3(s1.r, col.g, s2.b);
        } else if (specialCombine == 4) {
            // M23: Luma-Key Vortex Portal
            float fgLuma = dot(col.rgb, vec3(0.299, 0.587, 0.114));
            float thresh = 0.5 + 0.28 * sin(rPhase * 1.1) + (uBass - 0.5) * 0.2;
            float keyMask = smoothstep(thresh - 0.16, thresh + 0.16, fgLuma);
            float edgeGlow = 1.0 - abs(keyMask * 2.0 - 1.0);
            col = mix(col, s1, keyMask);
            col.rgb += uCol1.rgb * edgeGlow * 0.35 * (0.6 + uBeatPulse);
        } else {
            col.rgb = mix(col.rgb, s1.rgb, clamp(mix1, 0.0, 1.0));
            if (mix2 > 0.001) {
                col.rgb = mix(col.rgb, mix(s2, uCol2.rgb, 0.25), clamp(mix2, 0.0, 1.0));
            }
        }
    } else if (specialCombine == 3) {
        // M19: Palette Resonance Hyper-Enhancer (50% contour highlight band across the photo)
        float luma0 = dot(col.rgb, vec3(0.299, 0.587, 0.114));
        float contourWave = sin(luma0 * TAU * (2.5 + 1.5 * spr) - rPhase * 2.2 + r * 4.0);
        float band = smoothstep(-0.15, 0.35, contourWave) * (0.50 + 0.50 * (uBass + uMid * 0.6));
        vec3 palWave = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, 0.5 + 0.5 * sin(ang * 2.0 + rPhase)), luma0);
        col.rgb = mix(col.rgb, col.rgb * 0.55 + palWave * 0.85, band * clamp(dep * 0.68, 0.22, 0.92));
    }

    col.rgb = col.rgb * postScale + postAdd;

    // =========================================================================
    // PALETTE COLOUR-SNATCH BLOOM & 4-SECTOR TONAL OPACITY
    // =========================================================================
    float luma = clamp(dot(col.rgb, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);

    float wBlack = clamp(1.0 - luma * 2.20, 0.0, 1.0);
    float wWhite = clamp((luma - 0.45) * 1.85, 0.0, 1.0); // Upper 50% highlight range
    float wMid = clamp(1.0 - wBlack - wWhite, 0.0, 1.0);

    vec3 palTarget = (luma < 0.50)
        ? mix(uCol0.rgb, uCol1.rgb, luma / 0.50)
        : mix(uCol1.rgb, uCol2.rgb, (luma - 0.50) / 0.50);
    float snatchAmt = clamp(uPaletteBloom * (0.42 + 0.58 * (wMid + wWhite * 0.90)) * clamp(uColourSnatchOpacity, 0.0, 1.5), 0.0, 0.92);
    col.rgb = mix(col.rgb, mix(col.rgb, palTarget, 0.72) + palTarget * 0.22 * uBeatPulse, snatchAmt);

    float tonalAlpha = wBlack * clamp(uBlackOpacity, 0.0, 1.5)
                     + wMid   * clamp(uMidOpacity,   0.0, 1.5)
                     + wWhite * clamp(uWhiteOpacity, 0.0, 1.5);
    float finalAlpha = clamp(uPhotoOpacity * tonalAlpha * macroFade, 0.0, 1.0) * qt_Opacity;

    fragColor = vec4(col.rgb * finalAlpha, finalAlpha);
}
