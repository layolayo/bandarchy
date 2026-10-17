#version 440

layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    float uTime;
    float uL1Time;
    float uZoomTime;
    float uBass;
    float uMid;
    float uHigh;
    float uBeat;
    float uAspect;
    float uL1Enabled;
    float uL1Mode;
    float uL1Dim;
    float uL2Enabled;
    float uL2Mode;
    float uZoom;
    float uFacets;
    float uComplexity;
    float uTracerCount;
    float uTracerDir;
    float uDriftX;
    float uDriftY;
    vec4 uBgCol;
    vec4 uCol0;
    vec4 uCol1;
    vec4 uCol2;
};

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

mat2 rot2D(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

// Smooth polygon / star distance metric for C64 / Minter tunnel rings
float shapeRadius(vec2 p, float folds, float starDepth, float roundness) {
    float r = length(p);
    if (r < 0.0001) return 0.0;
    float a = atan(p.y, p.x);
    float sector = TAU / max(3.0, folds);
    float halfSector = sector * 0.5;
    float localA = mod(a + halfSector, sector) - halfSector;
    float poly = cos(halfSector) / max(0.25, cos(localA));
    float star = 1.0 + sin(a * folds) * starDepth;
    return r * mix(1.0, poly * star, clamp(1.0 - roundness, 0.0, 1.0));
}

void main() {
    vec2 uv = qt_TexCoord0 * 2.0 - 1.0;
    vec2 p = vec2(uv.x * uAspect, uv.y);
    vec2 drift = vec2(uDriftX * uAspect, uDriftY);
    vec2 pDrift = p - drift * 0.55;

    vec3 col = uBgCol.rgb;
    float dir = (abs(uTracerDir) < 0.05) ? sin(uTime * 0.25) : sign(uTracerDir);
    if (dir == 0.0) dir = 1.0;

    // =========================================================================
    // LAYER #1: Per-Pixel Smooth GPU Background Field
    // =========================================================================
    if (uL1Enabled > 0.5) {
        int l1m = int(floor(uL1Mode + 0.5));
        float l1Bright = clamp(1.0 - uL1Dim, 0.12, 1.0);
        vec2 q = pDrift;
        float rq = length(q);
        float aq = atan(q.y, q.x);

        if (l1m == 0) {
            // Mode 0: MilkDrop Liquid Feedback Warp (Harmonic Ripple Field)
            float w = sin(rq * 14.0 - uL1Time * 3.2 * dir + sin(aq * 6.0 + uL1Time * 0.9) * (1.0 + uBass * 0.8)) * 0.5 + 0.5;
            float w2 = sin(rq * 8.0 - uL1Time * 2.1 * dir - cos(aq * 4.0 - uL1Time * 0.7)) * 0.5 + 0.5;
            vec3 cMix = mix(uCol0.rgb, uCol1.rgb, w2);
            col += cMix * pow(w, 1.6) * (0.32 + 0.28 * uBass) * l1Bright;
        } else if (l1m == 1) {
            // Mode 1: G-Force Polar Spiral FlowField
            float spiral = sin(log(max(0.03, rq)) * 7.5 - uL1Time * 2.4 * dir + aq * 4.0 + sin(rq * 6.0 - uL1Time)) * 0.5 + 0.5;
            float wake = cos(aq * 6.0 - rq * 9.0 + uL1Time * 1.6) * 0.5 + 0.5;
            vec3 cFlow = mix(uCol1.rgb, uCol2.rgb, wake);
            col += cFlow * pow(spiral, 1.8) * (0.30 + 0.26 * uMid) * l1Bright;
        } else if (l1m == 2) {
            // Mode 2: Cthugha Volumetric Rave Flame Curtain
            float fy = 1.0 - qt_TexCoord0.y;
            float wave1 = sin(p.x * 5.5 + uL1Time * 1.8 + sin(fy * 6.0 - uL1Time * 3.0)) * 0.5 + 0.5;
            float wave2 = sin(p.x * 11.0 - uL1Time * 1.4 + cos(fy * 9.0 - uL1Time * 2.4)) * 0.5 + 0.5;
            float flameEnv = smoothstep(1.15, 0.0, fy / (0.55 + uBass * 0.45 + wave1 * 0.28));
            vec3 flameCol = mix(uCol2.rgb, mix(uCol0.rgb, vec3(1.0, 0.92, 0.65), flameEnv * 0.6), wave2);
            col += flameCol * flameEnv * (0.38 + 0.28 * uBass) * l1Bright;
        } else if (l1m == 3) {
            // Mode 3: Relativistic Nebula & Deep-Space Aurora
            float neb1 = sin(q.x * 3.2 + sin(q.y * 2.8 + uL1Time * 0.7)) * cos(q.y * 3.0 - uL1Time * 0.6) * 0.5 + 0.5;
            float neb2 = sin(rq * 6.5 - uL1Time * 1.5 * dir + aq * 3.0) * 0.5 + 0.5;
            float ringGlow = exp(-abs(rq - (0.35 + 0.12 * sin(uL1Time * 0.5))) * 5.5);
            col += (mix(uCol0.rgb, uCol2.rgb, neb1) * neb2 * 0.24 + uCol1.rgb * ringGlow * 0.32) * l1Bright;
        } else if (l1m == 4) {
            // Mode 4: TRON / Atari Battlezone Fixed-Horizon Vector Landscape Backing
            float hy = qt_TexCoord0.y - 0.48;
            float horizonGlow = exp(-abs(hy) * 28.0) * (0.42 + uBass * 0.28);
            col += uCol0.rgb * horizonGlow * l1Bright;
            if (hy > 0.0) {
                float floorGrad = clamp(hy * 1.9, 0.0, 1.0);
                col += mix(uCol0.rgb, uCol1.rgb, floorGrad) * (0.06 + 0.06 * uBass) * floorGrad * l1Bright;
            }
        } else if (l1m == 5) {
            // Mode 5: 1983 Atari Star Wars Death Star Trench Run Backing
            vec2 tp = p - vec2(drift.x * 0.35, drift.y * 0.25);
            float trenchGlow = exp(-abs(tp.x) * 4.2) * step(-0.35, tp.y) * (0.18 + 0.16 * uBass);
            float targetGlow = exp(-length(tp) * 6.5) * (0.28 + 0.24 * uBeat);
            col += (uCol0.rgb * trenchGlow + uCol1.rgb * targetGlow) * l1Bright;
        } else {
            // Mode 6: Black Hole Event Horizon & Gravitational Lensing Corona
            float ehR = 0.24 + uBass * 0.04;
            float photonRing = exp(-abs(rq - ehR) * 18.0) * (0.65 + uBeat * 0.35);
            float swirl = sin(aq * 5.0 - log(max(0.04, rq)) * 8.0 - uL1Time * 1.8) * 0.5 + 0.5;
            float corona = smoothstep(ehR * 0.85, ehR * 1.05, rq) * exp(-max(0.0, rq - ehR) * 3.5);
            col += (uCol0.rgb * photonRing + mix(uCol1.rgb, uCol2.rgb, swirl) * corona * 0.42) * l1Bright;
            col *= smoothstep(ehR * 0.72, ehR * 0.98, rq);
        }
    }

    // =========================================================================
    // LAYER #2: Per-Pixel GPU Psychedelic Shader Modes
    //   - Showcases the exact silky-smooth Harmonic Ripple Flower (`w = sin(r * 18.0 - uTime * 4.0 + sin(a * 6.0 + uTime)) * 0.5 + 0.5`)
    //   - True 1/z C64 / Minter Shape Tunnel where shapes rush from the vanishing point all the way OFF the screen edges!
    //   - True per-pixel GPU Julia Fractal Zoom!
    // =========================================================================
    if (uL2Enabled > 0.5) {
        int m = int(floor(uL2Mode + 0.5));
        float sym = max(3.0, floor(uFacets + 0.5));
        float zoom = clamp(uZoom, 0.4, 2.5);
        vec2 cPos = (p - drift * 0.42) / zoom;
        float r = length(cPos);
        float a = atan(cPos.y, cPos.x);

        if (m == 6 || m == 2) {
            // Mode 6 (DMT Flower / Lotus) & Mode 2 (G-Force WaveShape):
            // The EXACT silky-smooth Harmonic Ripple Flower graphic (`sin(r * 18.0 - uTime * 4.0 + sin(a * 6.0 + uTime)) * 0.5 + 0.5`)!
            float petals = (m == 6) ? sym : max(4.0, sym);
            float wPrimary = sin(r * 18.0 - uTime * 3.8 * dir + sin(a * petals + uTime * 1.15) * (1.05 + uBass * 0.85)) * 0.5 + 0.5;
            float wHarmonic = sin(r * 12.0 - uTime * 2.6 * dir - cos(a * (petals * 2.0) - uTime * 0.85) * (0.85 + uMid * 0.95)) * 0.5 + 0.5;
            float petalCrest = pow(wPrimary, 1.45);
            float innerBloom = pow(wHarmonic, 1.85) * exp(-r * 0.45);

            vec3 flowerCol = mix(uCol0.rgb, uCol1.rgb, wHarmonic);
            flowerCol = mix(flowerCol, uCol2.rgb, innerBloom * (0.55 + 0.45 * uHigh));
            float intensity = (0.52 + 0.48 * uBass + 0.22 * uBeat);
            col = mix(col, flowerCol, clamp(petalCrest * intensity * 0.78, 0.0, 0.92));

            // Crisp glowing neon interference filaments along the flower wave crests
            float ridge = smoothstep(0.86, 0.99, wPrimary) * (0.55 + 0.45 * uBass);
            col += mix(uCol1.rgb, vec3(0.92, 1.0, 0.96), 0.45) * ridge * 0.58;
        } else if (m == 4) {
            // Mode 4: Commodore 64 / Jeff Minter 3D Raymarched Shape Tunnel
            // Every shape spawns at the drifting vanishing endpoint (r -> 0) and expands continuously
            // past all 4 edges of the screen (r > 2.0) in true 1/z perspective!
            float rotBase = uTime * 0.35;
            vec2 tp = rot2D(rotBase) * cPos;
            float starMod = sin(uTime * 0.42) * 0.18 * (0.6 + uMid * 0.6);
            float roundMod = 0.25 + 0.25 * cos(uTime * 0.31);
            float dShape = shapeRadius(tp, sym, starMod, roundMod);

            // Perspective depth z = 1 / dShape -> rings accelerate exponentially as they pass the viewer!
            float ringDensity = 2.2 + uTracerCount * 0.35;
            float zDepth = 0.85 / max(0.025, dShape);
            float zPhase = zDepth - uZoomTime * 2.4 * dir;
            float ringWave = sin(zPhase * TAU * 0.5);
            float ringLine = smoothstep(0.68, 0.97, ringWave) * smoothstep(0.02, 0.09, dShape);

            // Longitudinal C64 / Tempest lane web struts radiating to the vanishing point
            float laneWave = abs(sin(atan(tp.y, tp.x) * sym + sin(zDepth * 0.8 + uTime * 0.6) * 0.35));
            float laneLine = smoothstep(0.92, 0.995, laneWave) * smoothstep(0.03, 0.14, dShape) * 0.48;

            // Alternating Llamasoft checkered tunnel wall bands
            float check = step(0.0, sin(zPhase * PI * 0.5) * sin(atan(tp.y, tp.x) * sym));
            vec3 wallCol = mix(uCol0.rgb, uCol2.rgb, check);
            float wallAlpha = smoothstep(0.03, 0.20, dShape) * (0.14 + 0.12 * uBass);

            vec3 ringCol = mix(uCol1.rgb, uCol0.rgb, 0.5 + 0.5 * sin(zPhase * 0.4));
            col += wallCol * wallAlpha + ringCol * (ringLine * (0.62 + 0.38 * uBass) + laneLine);
            // Dark vanishing core so the distant endpoint never bleaches
            col *= smoothstep(0.015, 0.065, dShape);
        } else if (m == 5) {
            // Mode 5: True Per-Pixel GPU Continuous Infinite Log-Polar Julia Seahorse Fractal
            // Log-polar coordinate mapping makes the complex Julia set zoom infinitely without ever hitting float precision limits!
            float logR = log(max(0.0005, r)) * 0.65 - uZoomTime * 0.85 * dir;
            float wrappedR = exp(mod(logR, 1.38629436) - 0.69314718); // exact 2x self-similar octave period
            float spiralA = a + floor(logR / 1.38629436) * 0.523598 + uTime * 0.22;
            vec2 z = vec2(cos(spiralA), sin(spiralA)) * wrappedR * 1.15;
            vec2 c = vec2(-0.745 + cos(uTime * 0.28) * (0.06 + uBass * 0.04),
                          0.186 + sin(uTime * 0.34) * (0.06 + uMid * 0.04));

            float iter = 0.0;
            const float maxIter = 18.0;
            for (float i = 0.0; i < maxIter; i += 1.0) {
                if (dot(z, z) > 16.0) break;
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                iter += 1.0;
            }
            float smoothIt = iter;
            if (iter < maxIter) {
                float log_zn = log(max(1.001, dot(z, z))) * 0.5;
                float nu = log(max(0.001, log_zn / log(2.0))) / log(2.0);
                smoothIt = iter + 1.0 - nu;
            }
            float fVal = sin(smoothIt * 0.55 - uTime * 1.2) * 0.5 + 0.5;
            float edgeGlow = exp(-abs(iter - maxIter * 0.55) * 0.28);
            vec3 fracCol = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, fVal), edgeGlow);
            col = mix(col, fracCol, clamp(0.45 + 0.35 * edgeGlow + 0.15 * uBass, 0.0, 0.85));
        } else if (m == 0) {
            // Mode 0: MilkDrop Geiss Stained-Glass Rose Cathedral Field
            float kAng = abs(mod(a + uTime * 0.22, TAU / sym) - (PI / sym));
            float rose = sin(r * 14.0 - uTime * 2.8 * dir + cos(kAng * sym * 2.0 + uTime) * (1.2 + uBass)) * 0.5 + 0.5;
            float arch = cos(kAng * sym * 3.0 - r * 8.0 + uTime * 1.4) * 0.5 + 0.5;
            vec3 glass = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, arch), rose);
            col += glass * pow(rose, 1.5) * (0.38 + 0.26 * uBass);
        } else if (m == 3) {
            // Mode 3: Cthugha Volumetric Plasma Tunnel
            float plasma = sin(r * 15.0 - uTime * 3.4 * dir + sin(a * 8.0 + uTime * 1.5) * (0.9 + uMid)) * 0.5 + 0.5;
            float lift = sin(cPos.x * 7.0 + uTime * 1.6) * cos(cPos.y * 7.0 - uTime * 2.0) * 0.5 + 0.5;
            vec3 pCol = mix(uCol0.rgb, uCol2.rgb, lift);
            col += pCol * pow(plasma, 1.6) * (0.38 + 0.28 * uBass);
        } else {
            // Subtle harmonic aura backing for 3D vector modes (AVS, Quasar, Mycelium, Matrix, Hypercube, Attractor)
            float aura = sin(r * 12.0 - uTime * 2.4 * dir + sin(a * sym + uTime * 0.8)) * 0.5 + 0.5;
            float falloff = exp(-r * 1.4) * (0.24 + 0.22 * uBass);
            col += mix(uCol0.rgb, uCol1.rgb, aura) * falloff;
        }
    }

    // Subtle vignette for cinema depth
    float vig = 1.0 - dot(uv * 0.42, uv * 0.42);
    col *= clamp(vig, 0.55, 1.0);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * qt_Opacity;
}
