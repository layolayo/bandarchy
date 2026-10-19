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

// Applies the 16 pre-computed photo variant transformations (V00..V15) in hardware
vec3 applyVariantStyle(vec3 rgb, vec2 uv, int vIdx) {
    int vid = clamp(vIdx, 0, 15);
    float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
    if (vid == 0) {
        return rgb;
    } else if (vid == 1) {
        // V01: Inverted Negative
        return 1.0 - rgb;
    } else if (vid == 2 || vid == 3 || vid == 4) {
        // V02..V04: Geometric mirrors (handled in UV sampling, slight crisp contrast boost)
        return clamp((rgb - 0.5) * 1.08 + 0.5, 0.0, 1.0);
    } else if (vid == 5) {
        // V05: High-Contrast Noir
        float n = smoothstep(0.18, 0.82, luma);
        return vec3(n);
    } else if (vid == 6) {
        // V06: Solarised Edge
        return abs(rgb * 2.0 - 1.0);
    } else if (vid == 7) {
        // V07: Posterised Pop
        return floor(rgb * 4.0 + 0.5) / 4.0;
    } else if (vid == 8) {
        // V08: Thermal Duotone
        return mix(uCol0.rgb * 0.45, mix(uCol1.rgb, uCol2.rgb, smoothstep(0.45, 0.95, luma)), smoothstep(0.05, 0.65, luma));
    } else if (vid == 9) {
        // V09: Cyanotype Blueprint
        vec3 deep = vec3(0.03, 0.10, 0.26);
        vec3 cyan = vec3(0.18, 0.62, 0.88);
        vec3 paper = vec3(0.92, 0.96, 1.0);
        return luma < 0.5 ? mix(deep, cyan, luma * 2.0) : mix(cyan, paper, (luma - 0.5) * 2.0);
    } else if (vid == 10) {
        // V10: Acid Neon Map
        return vec3(
            0.5 + 0.5 * sin(luma * TAU * 1.5 + 0.2),
            0.5 + 0.5 * sin(luma * TAU * 1.5 + 2.3),
            0.5 + 0.5 * sin(luma * TAU * 1.5 + 4.4)
        );
    } else if (vid == 11) {
        // V11: Chromatic Split
        return clamp(vec3(rgb.r * 1.18, rgb.g * 0.94, rgb.b * 1.18), 0.0, 1.0);
    } else if (vid == 12) {
        // V12: Halftone Scanline
        float scan = 0.78 + 0.22 * sin(uv.y * 240.0 * PI);
        return rgb * scan;
    } else if (vid == 13) {
        // V13: Kaleido 90 deg Fold
        return clamp(mix(rgb, rgb.gbr, 0.22), 0.0, 1.0);
    } else if (vid == 14) {
        // V14: Luma Threshold Stencil
        float st = smoothstep(0.36, 0.58, luma);
        return mix(uBgCol.rgb * 0.25, mix(uCol0.rgb, vec3(1.0), 0.65), st);
    } else {
        // V15: Prismatic Dream
        vec3 dream = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, uv.x), uv.y);
        return mix(rgb, dream, 0.42);
    }
}

vec2 applyVariantUV(vec2 uv, int vIdx) {
    int vid = clamp(vIdx, 0, 15);
    vec2 m = mirrorUV(uv);
    if (vid == 2) {
        return vec2(1.0 - m.x, m.y);
    } else if (vid == 3) {
        return vec2(m.x, 1.0 - m.y);
    } else if (vid == 4) {
        return abs(m * 2.0 - 1.0);
    } else if (vid == 13) {
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

    // Macro slide (combination of uMacroSlideX/Y and scalar uMacroSlide)
    float slideMag = clamp(uMacroSlide, 0.0, 2.0);
    p -= vec2(uMacroSlideX, uMacroSlideY) * (0.42 + 0.18 * slideMag);

    // Macro scale
    float mScale = max(0.25, uMacroScale);
    p /= mScale;

    // Macro roll + 3D roll
    float totalRoll = uMacroRoll + uRoll * 0.65;
    p = rot2(-totalRoll) * p;

    // 3D pitch, yaw & plane shear homography
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

    // Soft edge feather when whole photo plane slides or tilts inside stage bounds
    vec2 edgeDist = min(outUV, 1.0 - outUV);
    float edgeMin = min(edgeDist.x, edgeDist.y);
    if (edgeMin < 0.0) {
        // Mirror fallback damped outside primary slab when tilted strongly
        planeFade = clamp(1.0 + edgeMin * 3.5, 0.18, 1.0);
    }
    return outUV;
}

// Base sampler that combines primary, secondary variant crossfade, snapshot crossfade, and pool peer
vec4 sampleStageAt(vec2 rawUV, int variantOverride, float peerBlendOverride) {
    vec2 secUV = applyViewportSection(rawUV);
    int vPri = (variantOverride >= 0) ? variantOverride : uVariantIndex;
    int vSec = (variantOverride >= 0) ? ((variantOverride + 5) & 15) : uSecondaryVariantIndex;
    int vPrev = uPrevVariantIndex;

    // When a variant is pinned by the user (uVariantIndex == uSecondaryVariantIndex), texPrimary and texPrev
    // already contain that exact pre-rendered Stage-1 variant from disk, so do not double-apply its UV/style.
    bool isPinned = (uVariantIndex == uSecondaryVariantIndex);
    int effPri = (isPinned && vPri == uVariantIndex) ? 0 : vPri;
    int effSec = (isPinned && vSec == uVariantIndex) ? 0 : vSec;
    int effPrev = (isPinned && vPrev == uVariantIndex) ? 0 : vPrev;

    vec2 uvPri = applyVariantUV(secUV, effPri);
    vec2 uvSec = applyVariantUV(secUV, effSec);
    vec2 uvPrev = applyVariantUV(secUV, effPrev);

    vec4 cPri = (uHasPrimary != 0)
        ? texture(texPrimary, uvPri)
        : ((uHasPrev != 0) ? texture(texPrev, uvPri) : vec4(uCol0.rgb * 0.35, 1.0));
    cPri.rgb = applyVariantStyle(cPri.rgb, uvPri, effPri);

    if (uVariantMix > 0.001) {
        vec4 cSec;
        if (uPoolMode == 0 || uHasSecondary == 0) {
            cSec = (uHasPrimary != 0)
                ? texture(texPrimary, uvSec)
                : ((uHasPrev != 0) ? texture(texPrev, uvSec) : vec4(uCol0.rgb * 0.35, 1.0));
        } else {
            vec4 cSecBase = (uHasPrimary != 0)
                ? texture(texPrimary, uvSec)
                : texture(texSecondary, uvSec);
            cSec = mix(cSecBase, texture(texSecondary, uvSec), sin(clamp(uVariantMix, 0.0, 1.0) * PI) * 0.35);
        }
        cSec.rgb = applyVariantStyle(cSec.rgb, uvSec, effSec);
        cPri = mix(cPri, cSec, clamp(uVariantMix, 0.0, 1.0));
    }

    if (uHasPrev != 0 && uSnapshotMix < 0.999) {
        vec4 cPrev = texture(texPrev, uvPrev);
        cPrev.rgb = applyVariantStyle(cPrev.rgb, uvPrev, effPrev);
        cPri = mix(cPrev, cPri, clamp(uSnapshotMix, 0.0, 1.0));
    }

    // Multi-photo pool peer blending (uPoolMode: 1 = Double Exposure, 2 = Split & Interlace, 3 = Depth Dual-Planes)
    if (uHasPeer != 0 && (uPoolMode > 0 || peerBlendOverride > 0.001)) {
        vec2 peerUV = mirrorUV(secUV * vec2(1.04, 1.04) - 0.02 + vec2(sin(uTime * 0.35), cos(uTime * 0.29)) * 0.03);
        vec4 cPeer = texture(texPeer, peerUV);
        cPeer.rgb = applyVariantStyle(cPeer.rgb, peerUV, (vPri + 3) & 15);
        float pMix = peerBlendOverride;
        if (pMix <= 0.001) {
            if (uPoolMode == 1) {
                pMix = 0.38 + 0.14 * sin(uRhythmPhase + secUV.x * PI);
            } else if (uPoolMode == 2) {
                float stripe = step(0.5, fract((secUV.x + secUV.y * 0.35) * 6.0 + uTime * 0.25));
                pMix = stripe * 0.75;
            } else if (uPoolMode == 3) {
                float radial = length(secUV - 0.5) * 1.414;
                pMix = smoothstep(0.28, 0.78, radial) * 0.68;
            }
        }
        cPri = mix(cPri, cPeer, clamp(pMix, 0.0, 1.0));
    }

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

    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    // =========================================================================
    // 25 AUTHENTIC PHOTO-MOTION MODES (M01..M25, 0..24)
    // =========================================================================
    if (mode == 0) {
        // M01: 3D XYZ Plane Tilt & Flip (receding 3D ghost planes + primary tilted plane)
        vec3 acc = vec3(0.0);
        float wSum = 0.0;
        for (int g = 3; g >= 0; --g) {
            float gf = float(g);
            float zScale = 1.0 - gf * 0.13 * spr * (0.85 + 0.25 * uBass);
            float gRoll = gf * 0.07 * sin(rPhase + gf) * dep;
            vec2 gp = rot2(gRoll) * (p / max(0.25, zScale));
            gp += vec2(sin(rPhase * 0.7 + gf), cos(rPhase * 0.5 + gf)) * 0.035 * gf * spr;
            vec2 guv = gp + 0.5;
            float inBounds = smoothstep(0.54, 0.46, max(abs(guv.x - 0.5), abs(guv.y - 0.5)));
            float w = (g == 0) ? 1.0 : (0.28 / gf) * (0.45 + 0.55 * inBounds);
            vec4 sc = sampleStageAt(guv, (uVariantIndex + g * 2) & 15, (g == 2 && uPoolMode > 0) ? 0.65 : 0.0);
            if (g > 0) {
                sc.rgb = mix(sc.rgb, (g == 1) ? uCol0.rgb : uCol1.rgb, 0.24);
            }
            acc += sc.rgb * w;
            wSum += w;
        }
        col = vec4(acc / max(0.001, wSum), 1.0);
    } else if (mode == 1) {
        // M02: 4D Tesseract Folding Cube (outer cube + inner hypercube + 4 trapezium side walls)
        float innerHalf = clamp((0.21 + 0.07 * sin(rPhase * 0.85) + uBass * 0.06) / max(0.5, spr * 0.85), 0.12, 0.36);
        vec2 ap = abs(p);
        float maxC = max(ap.x, ap.y);
        if (maxC <= innerHalf) {
            // Inner hypercube face
            vec2 iuv = (p / (innerHalf * 2.0)) + 0.5;
            col = sampleStageAt(iuv, (uVariantIndex + 4) & 15, uPoolMode > 0 ? 0.65 : 0.0);
            float edge = smoothstep(innerHalf * 0.88, innerHalf, maxC);
            col.rgb = mix(col.rgb, uCol0.rgb, edge * 0.55);
        } else {
            // 4 folding hypercube walls (Top, Bottom, Left, Right)
            float wallT = clamp((maxC - innerHalf) / max(0.001, 0.5 - innerHalf), 0.0, 1.0);
            vec2 wuv;
            int wallVar = uVariantIndex;
            if (ap.x > ap.y) {
                float sy = p.y / max(0.001, ap.x) * 0.5 + 0.5;
                wuv = vec2(p.x > 0.0 ? wallT : 1.0 - wallT, sy);
                wallVar = (uVariantIndex + (p.x > 0.0 ? 2 : 3)) & 15;
            } else {
                float sx = p.x / max(0.001, ap.y) * 0.5 + 0.5;
                wuv = vec2(sx, p.y > 0.0 ? wallT : 1.0 - wallT);
                wallVar = (uVariantIndex + (p.y > 0.0 ? 6 : 8)) & 15;
            }
            col = sampleStageAt(wuv, wallVar, 0.0);
            float diagSeam = smoothstep(0.025, 0.0, abs(ap.x - ap.y));
            float shade = 0.62 + 0.38 * (1.0 - wallT * 0.55);
            col.rgb = col.rgb * shade + uCol1.rgb * diagSeam * (0.35 + 0.35 * uBeatPulse);
        }
    } else if (mode == 2) {
        // M03: Relativistic Z-Corridor Echo Train (8 depth-sorted corridor frames)
        float travel = fract(t * 0.42);
        vec3 acc = vec3(0.0);
        float wSum = 0.0;
        for (int i = 0; i < 6; ++i) {
            float z = fract((float(i) + travel) / 6.0);
            float scale = mix(0.14, 1.35, z * z);
            float twist = (1.0 - z) * 0.38 * sin(rPhase * 0.6) * dep;
            vec2 cp = rot2(twist) * (p / max(0.08, scale));
            vec2 cuv = cp + 0.5;
            float box = max(abs(cp.x), abs(cp.y));
            if (box < 0.52) {
                float rim = smoothstep(0.45, 0.50, box);
                float w = (0.25 + 0.75 * z) * (1.0 + rim * 1.4);
                vec4 sc = sampleStageAt(cuv, (uVariantIndex + i) & 15, (i % 2 == 1 && uPoolMode > 0) ? 0.55 : 0.0);
                sc.rgb = mix(sc.rgb, (i % 2 == 0) ? uCol0.rgb : uCol2.rgb, rim * 0.55);
                acc += sc.rgb * w;
                wSum += w;
            }
        }
        col = (wSum > 0.001) ? vec4(acc / wSum, 1.0) : sampleStageAt(uv, -1, 0.0);
    } else if (mode == 3) {
        // M04: Stroboscopic Shutter & Ghost Flicker (vertical shutter louvers + ghost echo)
        float blades = floor(10.0 + 6.0 * spr);
        float colIdx = floor(uv.x * blades);
        float localX = fract(uv.x * blades);
        float phase = rPhase * 2.4 + colIdx * 0.65 + uBeatPulse * 1.8;
        float openAmt = 0.28 + 0.72 * abs(cos(phase * (0.6 + 0.4 * dep)));
        float centred = (localX - 0.5) / max(0.12, openAmt);
        if (abs(centred) <= 0.5) {
            vec2 suv = vec2((colIdx + centred + 0.5) / blades, uv.y + sin(phase) * 0.03 * dep);
            int vIdx = (mod(colIdx, 2.0) < 0.5) ? uVariantIndex : uSecondaryVariantIndex;
            col = sampleStageAt(suv, vIdx, 0.0);
        } else {
            // Ghost echo visible between shutter blades
            vec2 guv = uv + vec2(0.035 * sin(t * 1.8), -0.025 * cos(t * 1.4)) * spr;
            col = sampleStageAt(guv, (uVariantIndex + 1) & 15, 0.65);
            col.rgb = mix(col.rgb * 0.55, uCol1.rgb * 0.45, 0.35);
        }
    } else if (mode == 4) {
        // M05: Gyroscopic 3-Axis Card-Flip Cascade (grid of 3D flipping tiles)
        vec2 grid = vec2(floor(4.0 + 2.0 * spr), floor(3.0 + 2.0 * spr));
        vec2 cellId = floor(uv * grid);
        vec2 cellUV = fract(uv * grid) - 0.5;
        float wave = rPhase * 1.5 + cellId.x * 0.55 + cellId.y * 0.75 + uBass * 1.4;
        float flipCos = cos(wave * dep);
        float flipDir = (mod(cellId.x + cellId.y, 2.0) < 0.5) ? 1.0 : -1.0;
        vec2 warpedCell = cellUV;
        if (flipDir > 0.0) {
            warpedCell.x /= sign(flipCos) * max(0.16, abs(flipCos));
        } else {
            warpedCell.y /= sign(flipCos) * max(0.16, abs(flipCos));
        }
        if (max(abs(warpedCell.x), abs(warpedCell.y)) <= 0.48) {
            vec2 tuv = (cellId + warpedCell + 0.5) / grid;
            int cardVar = (flipCos < 0.0) ? uSecondaryVariantIndex : uVariantIndex;
            col = sampleStageAt(tuv, cardVar, (flipCos < 0.0 && uPoolMode > 0) ? 0.75 : 0.0);
            col.rgb *= 0.65 + 0.35 * abs(flipCos);
        } else {
            col = sampleStageAt(uv, (uVariantIndex + 5) & 15, 0.0);
            col.rgb *= 0.28;
        }
    } else if (mode == 5) {
        // M06: Chronos Time-Slice Slit-Scan (horizontal slits phase-delayed by audio & wave)
        float slits = floor(22.0 + 14.0 * spr);
        float sIdx = floor(uv.y * slits);
        float sNorm = sIdx / slits;
        float delay = sin(sNorm * TAU * (1.2 + 0.6 * spr) - rPhase * 2.2) * (0.08 + 0.14 * dep * (0.5 + uBass));
        float shearX = (sNorm - 0.5) * 0.16 * sin(rPhase * 0.9) * dep;
        vec2 suv = vec2(uv.x + delay + shearX, uv.y + cos(sNorm * PI * 4.0 + t) * 0.015 * dep);
        int slitVar = (mod(sIdx, 4.0) < 1.0) ? uSecondaryVariantIndex : uVariantIndex;
        col = sampleStageAt(suv, slitVar, 0.0);
    } else if (mode == 6) {
        // M07: Sacred 8-Way Kaleidoscopic Mirror Fold
        float segs = 8.0;
        float a = ang + rPhase * 0.35 * dep;
        float sector = TAU / segs;
        float fAng = mod(a, sector);
        if (fAng > sector * 0.5) fAng = sector - fAng;
        float rad = r * (0.85 + 0.25 * sin(rPhase + r * 4.0 * spr) * dep);
        vec2 kuv = vec2(cos(fAng), sin(fAng)) * rad + 0.5 + vec2(sin(t * 0.31), cos(t * 0.27)) * 0.08 * spr;
        col = sampleStageAt(kuv, -1, 0.0);
        float seam = smoothstep(0.04, 0.0, min(fAng, sector * 0.5 - fAng));
        col.rgb += uCol0.rgb * seam * (0.28 + 0.42 * uTreble);
    } else if (mode == 7) {
        // M08: 4x4 All-16-Variants Mosaic Matrix (simultaneous 16-variant grid with beat expansion)
        vec2 mGrid = vec2(4.0, 4.0);
        vec2 mId = clamp(floor(uv * mGrid), vec2(0.0), vec2(3.0));
        vec2 mLocal = fract(uv * mGrid);
        int cellVar = int(mId.y * 4.0 + mId.x);
        int focusCell = int(mod(floor(rPhase * 1.5), 16.0));
        float isFocus = (cellVar == focusCell) ? 1.0 : 0.0;
        float cellZoom = 1.0 + isFocus * 0.22 * (0.5 + uBeatPulse);
        vec2 cuv = (mLocal - 0.5) / cellZoom + 0.5;
        col = sampleStageAt(cuv, cellVar, (cellVar % 3 == 0 && uPoolMode > 0) ? 0.5 : 0.0);
        float border = smoothstep(0.46, 0.495, max(abs(mLocal.x - 0.5), abs(mLocal.y - 0.5)));
        vec3 borderCol = mix(uBgCol.rgb * 0.3, uCol0.rgb, isFocus);
        col.rgb = mix(col.rgb, borderCol, border * 0.72);
    } else if (mode == 8) {
        // M09: Infinite Droste Recursive Frame-In-Frame Spiral Tunnel
        float ratio = 0.62;
        float logR = log(max(0.001, max(abs(p.x), abs(p.y)) * 2.0)) / log(ratio);
        float zoomLoop = fract(t * 0.48);
        float level = floor(logR + zoomLoop);
        float scale = pow(ratio, level - zoomLoop);
        float spiralAng = (level - zoomLoop) * 0.24 * sin(rPhase * 0.5) * dep;
        vec2 dp = rot2(spiralAng) * (p / max(0.001, scale));
        vec2 duv = dp + 0.5;
        int dVar = (uVariantIndex + int(mod(abs(level), 4.0)) * 3) & 15;
        col = sampleStageAt(duv, dVar, 0.0);
        float frameEdge = smoothstep(0.45, 0.495, max(abs(dp.x), abs(dp.y)));
        col.rgb = mix(col.rgb, uCol1.rgb * (0.65 + 0.35 * uBeatPulse), frameEdge * 0.55);
    } else if (mode == 9) {
        // M10: Tectonic Counter-Sliding Mirror Strips (alternating horizontal/vertical slabs)
        float strips = floor(9.0 + 5.0 * spr);
        bool horiz = (sin(rPhase * 0.25) >= -0.2);
        float coord = horiz ? uv.y : uv.x;
        float sId = floor(coord * strips);
        float dir = (mod(sId, 2.0) < 0.5) ? 1.0 : -1.0;
        float slide = dir * (0.12 + 0.18 * dep) * sin(rPhase * 1.4 + sId * 0.7 + uBass * 1.5);
        vec2 tuv = uv;
        if (horiz) tuv.x += slide; else tuv.y += slide;
        int sVar = (dir < 0.0) ? uSecondaryVariantIndex : uVariantIndex;
        col = sampleStageAt(tuv, sVar, 0.0);
        float seam = smoothstep(0.04, 0.0, abs(fract(coord * strips) - 0.5) - 0.46);
        col.rgb += uCol2.rgb * seam * 0.25;
    } else if (mode == 10) {
        // M11: Hexagonal Honeycomb Prism Array
        float hexScale = 7.0 + 5.0 * spr;
        vec2 hp = pa * hexScale;
        const vec2 s = vec2(1.0, 1.7320508);
        vec4 hC = floor(vec4(hp, hp - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
        vec4 hD = vec4(hp - hC.xy * s, hp - (hC.zw + 0.5) * s);
        vec4 hex = (dot(hD.xy, hD.xy) < dot(hD.zw, hD.zw)) ? vec4(hD.xy, hC.xy) : vec4(hD.zw, hC.zw + 0.5);
        float cellR = length(hex.xy);
        float pulse = sin(rPhase * 1.8 + length(hex.zw) * 0.65) * dep;
        vec2 refractUV = uv + hex.xy * (0.06 + 0.08 * pulse) + vec2(cos(pulse), sin(pulse)) * 0.02 * uBass;
        int hVar = (uVariantIndex + int(mod(abs(hex.z + hex.w * 3.0), 4.0)) * 2) & 15;
        col = sampleStageAt(refractUV, hVar, 0.0);
        float hexRim = smoothstep(0.42, 0.52, cellR);
        col.rgb = mix(col.rgb, uCol0.rgb * (0.6 + 0.4 * uTreble), hexRim * 0.48);
    } else if (mode == 11) {
        // M12: Inception 4-Wall Architectural Box Fold (Floor, Ceiling, Left Wall, Right Wall + End Portal)
        float portal = clamp(0.18 + 0.06 * sin(rPhase * 0.7) - 0.04 * dep, 0.10, 0.30);
        vec2 ap = abs(p);
        float m = max(ap.x, ap.y);
        if (m <= portal) {
            vec2 puv = (p / (portal * 2.0)) + 0.5;
            col = sampleStageAt(puv, uSecondaryVariantIndex, 0.6);
        } else {
            float depthT = (m - portal) / max(0.001, 0.5 - portal);
            float zWalk = fract(depthT - t * 0.28);
            vec2 buv;
            float wallLight = 1.0;
            if (ap.y >= ap.x) {
                // Ceiling or Floor
                buv = vec2((p.x / max(0.001, ap.y)) * 0.5 + 0.5, zWalk);
                wallLight = (p.y < 0.0) ? 0.78 : 0.92;
            } else {
                // Left or Right architectural wall
                buv = vec2(zWalk, (p.y / max(0.001, ap.x)) * 0.5 + 0.5);
                wallLight = 0.68;
            }
            col = sampleStageAt(buv, uVariantIndex, 0.0);
            col.rgb *= wallLight * (0.45 + 0.55 * depthT);
        }
    } else if (mode == 12) {
        // M13: Tri-Vector Palette Channel Separation (3 independent offset & rotated colour ghosts)
        float sep = (0.025 + 0.055 * dep * (0.45 + uBass + uBeatPulse * 0.5)) * spr;
        vec2 off0 = vec2(cos(rPhase * 1.3), sin(rPhase * 1.3)) * sep;
        vec2 off1 = vec2(cos(rPhase * 1.3 + 2.094), sin(rPhase * 1.3 + 2.094)) * sep;
        vec2 off2 = vec2(cos(rPhase * 1.3 + 4.188), sin(rPhase * 1.3 + 4.188)) * sep;
        vec3 s0 = sampleStageAt(uv + off0, uVariantIndex, 0.0).rgb;
        vec3 s1 = sampleStageAt(uv + off1, uSecondaryVariantIndex, 0.0).rgb;
        vec3 s2 = sampleStageAt(uv + off2, (uVariantIndex + 6) & 15, 0.0).rgb;
        float l0 = dot(s0, vec3(0.299, 0.587, 0.114));
        float l1 = dot(s1, vec3(0.299, 0.587, 0.114));
        float l2 = dot(s2, vec3(0.299, 0.587, 0.114));
        vec3 base = (s0 + s1 + s2) / 3.0;
        vec3 prism = l0 * uCol0.rgb + l1 * uCol1.rgb + l2 * uCol2.rgb;
        col = vec4(mix(base, prism, 0.58), 1.0);
    } else if (mode == 13) {
        // M14: 48-Band Equaliser Venetian Shredder (vertical EQ columns displaced by audio)
        float bands = 48.0;
        float bIdx = floor(uv.x * bands);
        float bNorm = bIdx / bands;
        float eqEnergy = (bNorm < 0.33)
            ? mix(uBass, uMid, bNorm * 3.0)
            : mix(uMid, uTreble, (bNorm - 0.33) * 1.5);
        float wave = sin(bNorm * TAU * 3.0 + rPhase * 2.5) * 0.5 + 0.5;
        float yShift = (eqEnergy * (0.6 + 0.4 * wave) - 0.35) * 0.28 * dep * ((mod(bIdx, 2.0) < 0.5) ? 1.0 : -1.0);
        vec2 euv = vec2(uv.x, uv.y + yShift);
        int eqVar = (wave > 0.68 && uBeatPulse > 0.35) ? uSecondaryVariantIndex : uVariantIndex;
        col = sampleStageAt(euv, eqVar, 0.0);
    } else if (mode == 14) {
        // M15: Berlin Rave Shutter & Negative Strobe (quadrant/octant negative & solarised flash)
        vec2 qGrid = floor(uv * vec2(4.0, 3.0));
        float cellHash = hash21(qGrid + floor(rPhase * (2.0 + spd)));
        float strobeActive = step(0.62 - 0.28 * (uBeatPulse + uFlux), cellHash);
        int raveVar = (strobeActive > 0.5)
            ? ((cellHash > 0.82) ? 1 : 6) // V01 Inverted Negative or V06 Solarised Edge
            : uVariantIndex;
        vec2 ruv = uv + (strobeActive * (cellHash - 0.5) * 0.06 * dep);
        col = sampleStageAt(ruv, raveVar, strobeActive * 0.5);
        if (strobeActive > 0.5) {
            col.rgb = mix(col.rgb, uCol0.rgb, 0.22 * uBeatPulse);
        }
    } else if (mode == 15) {
        // M16: Concentric Counter-Rotating Ring Shear (annular rings rotating in opposite directions)
        float rings = floor(6.0 + 4.0 * spr);
        float ringIdx = floor(r * rings);
        float dir = (mod(ringIdx, 2.0) < 0.5) ? 1.0 : -1.0;
        float rotAmt = dir * (0.35 + 0.45 * dep) * sin(rPhase * 0.9 + ringIdx * 0.65) + dir * uBass * 0.25;
        vec2 rp = rot2(rotAmt) * pa;
        vec2 ruv = vec2(rp.x / aspect, rp.y) + 0.5;
        int rVar = (dir < 0.0) ? uSecondaryVariantIndex : uVariantIndex;
        col = sampleStageAt(ruv, rVar, 0.0);
        float ringEdge = smoothstep(0.04, 0.0, abs(fract(r * rings) - 0.5) - 0.46);
        col.rgb += uCol1.rgb * ringEdge * 0.32;
    } else if (mode == 16) {
        // M17: Voronoi Glass Shatter & Beat Reform (polygonal shards blasting apart on beats)
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
        vec2 suv = uv - shardVec + m_diff * 0.03 * dep;
        int shardVar = (hash21(m_id) > 0.65) ? uSecondaryVariantIndex : uVariantIndex;
        col = sampleStageAt(suv, shardVar, 0.0);
        float crack = smoothstep(0.08, 0.0, m_dist2 - m_dist);
        col.rgb = mix(col.rgb, uCol0.rgb * (0.8 + 0.6 * uBeatPulse), crack * 0.75);
    } else if (mode == 17) {
        // M18: CRT Scanline Phase-Slip & Tracking Tear (VHS tracking bar, RGB split, horizontal jitter)
        float tearY = fract(t * 0.32);
        float inTear = smoothstep(0.14, 0.0, abs(uv.y - tearY));
        float lineJitter = (hash21(vec2(floor(uv.y * 180.0), floor(t * 18.0))) - 0.5) * 0.025 * dep;
        float xShift = lineJitter + inTear * sin(uv.y * 80.0 + t * 20.0) * 0.12 * (0.5 + uFlux + uBass);
        float rgbSep = (0.006 + 0.024 * inTear + 0.012 * uBass) * dep;
        float rCh = sampleStageAt(vec2(uv.x + xShift + rgbSep, uv.y), uVariantIndex, 0.0).r;
        float gCh = sampleStageAt(vec2(uv.x + xShift, uv.y), uVariantIndex, 0.0).g;
        float bCh = sampleStageAt(vec2(uv.x + xShift - rgbSep, uv.y), uSecondaryVariantIndex, 0.0).b;
        float scan = 0.84 + 0.16 * sin(uv.y * uResolution.y * 1.2);
        col = vec4(vec3(rCh, gCh, bCh) * scan, 1.0);
    } else if (mode == 18) {
        // M19: Palette Resonance Hyper-Enhancer (keep photo crisp & still while harmonic waves surge across luma contours)
        vec4 base = sampleStageAt(uv, uVariantIndex, 0.0);
        float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));
        float contourWave = sin(luma * TAU * (2.5 + 1.5 * spr) - rPhase * 2.2 + r * 4.0);
        float band = smoothstep(0.35, 0.95, contourWave) * (0.45 + 0.55 * (uBass + uMid * 0.6));
        vec3 palWave = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, 0.5 + 0.5 * sin(ang * 2.0 + rPhase)), luma);
        col = vec4(mix(base.rgb, base.rgb * 0.55 + palWave * 0.85, band * clamp(dep * 0.65, 0.15, 0.92)), base.a);
    } else if (mode == 19) {
        // M20: Event Horizon Gravitational Lens (Einstein ring black hole bending light around singularity)
        vec2 bhPos = vec2(sin(rPhase * 0.55), cos(rPhase * 0.42)) * 0.16 * spr;
        vec2 d = pa - bhPos;
        float dist = length(d) + 0.0001;
        float rs = (0.08 + 0.05 * uBass) * dep;
        float einstein = (rs * rs) / (dist + rs * 0.35);
        vec2 swirled = rot2(rs * 2.2 / (dist + 0.06)) * (d * (1.0 - einstein / dist));
        vec2 luv = vec2((swirled.x + bhPos.x) / aspect, swirled.y + bhPos.y) + 0.5;
        col = sampleStageAt(luv, -1, 0.0);
        float ringGlow = exp(-abs(dist - rs * 1.45) * 22.0);
        float horizonMask = smoothstep(rs * 0.55, rs * 1.05, dist);
        col.rgb = col.rgb * horizonMask + mix(uCol0.rgb, uCol2.rgb, 0.5) * ringGlow * (0.85 + 0.65 * uBeatPulse);
    } else if (mode == 20) {
        // M21: Mobius Cylinder & Torus Tunnel Wrap (continuous 360-degree torus/cylinder surface)
        float u = (ang + PI) / TAU + t * 0.12;
        float v = 1.0 / (r + 0.18 + 0.06 * sin(rPhase)) + t * 0.28;
        float mobiusTwist = u + v * 0.35 * sin(rPhase * 0.4) * dep;
        vec2 tuv = vec2(mobiusTwist, v * 0.45);
        col = sampleStageAt(tuv, -1, 0.0);
        float depthFog = smoothstep(0.04, 0.28, r);
        col.rgb = mix(uBgCol.rgb * 0.25 + uCol0.rgb * 0.25, col.rgb, depthFog);
    } else if (mode == 21) {
        // M22: Liquid Acid Domain-Warp Melt (multi-frequency organic sine/cosine fluid warp)
        vec2 w1 = vec2(
            sin(uv.y * 6.0 * spr + rPhase * 1.4) + cos(uv.x * 4.5 * spr - rPhase * 1.1),
            cos(uv.x * 6.0 * spr + rPhase * 1.2) - sin(uv.y * 5.0 * spr + rPhase * 1.5)
        );
        vec2 w2 = vec2(
            sin((uv.x + w1.x * 0.25) * 9.0 + t * 1.8),
            cos((uv.y + w1.y * 0.25) * 9.0 - t * 1.6)
        );
        vec2 muv = uv + (w1 * 0.055 + w2 * 0.028) * dep * (0.7 + 0.5 * uBass);
        col = sampleStageAt(muv, -1, 0.0);
    } else if (mode == 22) {
        // M23: Luma-Key Vortex Portal Bleed (luminance threshold opens swirling portal to secondary variant/peer)
        vec4 fg = sampleStageAt(uv, uVariantIndex, 0.0);
        float fgLuma = dot(fg.rgb, vec3(0.299, 0.587, 0.114));
        float thresh = 0.5 + 0.28 * sin(rPhase * 1.1) + (uBass - 0.5) * 0.2;
        float keyMask = smoothstep(thresh - 0.16, thresh + 0.16, fgLuma);
        vec2 vortexP = rot2(rPhase * 0.8 + (1.0 - r) * 2.4 * dep) * pa * (0.85 + 0.25 * sin(t));
        vec2 portalUV = vec2(vortexP.x / aspect, vortexP.y) + 0.5;
        vec4 bgPortal = sampleStageAt(portalUV, uSecondaryVariantIndex, 0.85);
        float edgeGlow = 1.0 - abs(keyMask * 2.0 - 1.0);
        col = mix(fg, bgPortal, keyMask);
        col.rgb += uCol1.rgb * edgeGlow * 0.35 * (0.6 + uBeatPulse);
    } else if (mode == 23) {
        // M24: Cymatic Chladni Standing-Wave Ripple (nodal plate interference pattern displacing pixels)
        float n = floor(2.0 + mod(floor(rPhase * 0.35), 4.0));
        float m = floor(3.0 + mod(floor(rPhase * 0.22 + 1.0), 5.0));
        float chladni = cos(n * PI * p.x * 2.0 * spr) * cos(m * PI * p.y * 2.0 * spr)
                      - cos(m * PI * p.x * 2.0 * spr) * cos(n * PI * p.y * 2.0 * spr);
        vec2 grad = vec2(
            -sin(n * PI * p.x * 2.0 * spr) * cos(m * PI * p.y * 2.0 * spr),
            -cos(n * PI * p.x * 2.0 * spr) * sin(m * PI * p.y * 2.0 * spr)
        );
        vec2 cuv = uv + grad * (0.045 + 0.055 * uBass) * dep * sin(rPhase * 2.0);
        col = sampleStageAt(cuv, -1, 0.0);
        float nodalLine = exp(-abs(chladni) * 7.5);
        col.rgb = mix(col.rgb, uCol0.rgb * (0.75 + 0.5 * uTreble), nodalLine * 0.42 * dep);
    } else {
        // M25: Hyperdrive Volumetric Radial Extrusion (multi-tap radial zoom blur + prismatic edge bloom)
        vec2 focal = vec2(sin(rPhase * 0.45), cos(rPhase * 0.38)) * 0.14 * spr;
        vec2 dir = p - focal;
        float strength = (0.14 + 0.22 * (uBass * 0.7 + uBeatPulse)) * dep;
        vec3 acc = vec3(0.0);
        float wSum = 0.0;
        for (int s = 0; s < 7; ++s) {
            float sf = float(s) / 6.0;
            float scale = 1.0 - sf * strength;
            vec2 suv = focal + dir * scale + 0.5;
            float w = 1.0 - sf * 0.65;
            vec3 sc = sampleStageAt(suv, (s == 6) ? uSecondaryVariantIndex : uVariantIndex, 0.0).rgb;
            if (s >= 4) {
                sc = mix(sc, (s == 4) ? uCol0.rgb : uCol2.rgb, 0.32 * sf);
            }
            acc += sc * w;
            wSum += w;
        }
        col = vec4(acc / wSum, 1.0);
    }

    // =========================================================================
    // PALETTE COLOUR-SNATCH BLOOM & 4-SECTOR TONAL OPACITY
    // =========================================================================
    float luma = clamp(dot(col.rgb, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);

    // 3-way tonal Weights: Black (shadows), Mid (midtones), White (highlights)
    float wBlack = clamp(1.0 - luma * 2.35, 0.0, 1.0);
    float wWhite = clamp((luma - 0.55) * 2.22, 0.0, 1.0);
    float wMid = clamp(1.0 - wBlack - wWhite, 0.0, 1.0);

    // Palette Colour-Snatch Bloom: snatches mid/high contours toward active 3-colour palette
    vec3 palTarget = (luma < 0.45)
        ? mix(uCol0.rgb, uCol1.rgb, luma / 0.45)
        : mix(uCol1.rgb, uCol2.rgb, (luma - 0.45) / 0.55);
    float snatchAmt = clamp(uPaletteBloom * (0.35 + 0.65 * (wMid + wWhite * 0.8)) * clamp(uColourSnatchOpacity, 0.0, 1.5), 0.0, 0.92);
    col.rgb = mix(col.rgb, mix(col.rgb, palTarget, 0.72) + palTarget * 0.22 * uBeatPulse, snatchAmt);

    // 4-sector tonal opacity modulation (Photo master, Black sector, Mid sector, White sector)
    float tonalAlpha = wBlack * clamp(uBlackOpacity, 0.0, 1.5)
                     + wMid   * clamp(uMidOpacity,   0.0, 1.5)
                     + wWhite * clamp(uWhiteOpacity, 0.0, 1.5);
    float finalAlpha = clamp(uPhotoOpacity * tonalAlpha * macroFade, 0.0, 1.0) * qt_Opacity;

    // Premultiplied alpha output required by Qt Quick RHI ShaderEffect
    fragColor = vec4(col.rgb * finalAlpha, finalAlpha);
}
