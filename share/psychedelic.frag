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
    float dir = (abs(uTracerDir) < 0.05) ? 1.0 : sign(uTracerDir);
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
            // Mode 0: MilkDrop 3D Expanding Warp Tunnel & Harmonic Ripple Field
            vec2 tp0 = rot2D(uL1Time * 0.22) * q;
            float dShape0 = shapeRadius(tp0, 6.0, sin(uL1Time * 0.4) * 0.14, 0.42);
            float zDepth0 = 0.80 / max(0.04, dShape0);
            float zPhase0 = zDepth0 - uL1Time * 2.4;
            float birth0 = smoothstep(0.04, 0.22, dShape0);
            float ring0 = smoothstep(0.65, 0.96, sin(zPhase0 * TAU * 0.5)) * birth0;
            float w = sin(rq * 14.0 - uL1Time * 3.2 + sin(aq * 6.0 + uL1Time * 0.9) * (1.0 + uBass * 0.8)) * 0.5 + 0.5;
            float w2 = sin(rq * 8.0 - uL1Time * 2.1 - cos(aq * 4.0 - uL1Time * 0.7)) * 0.5 + 0.5;
            vec3 cMix = mix(uCol0.rgb, uCol1.rgb, w2);
            col += (cMix * pow(w, 1.6) * (0.28 + 0.24 * uBass) + mix(uCol1.rgb, uCol2.rgb, 0.5 + 0.5 * sin(zPhase0 * 0.5)) * ring0 * (0.45 + 0.35 * uBass)) * l1Bright;
        } else if (l1m == 1) {
            // Mode 1: G-Force Polar Spiral FlowField
            float spiral = sin(log(max(0.03, rq)) * 7.5 - uL1Time * 2.4 + aq * 4.0 + sin(rq * 6.0 - uL1Time)) * 0.5 + 0.5;
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
            float neb2 = sin(rq * 6.5 - uL1Time * 1.5 + aq * 3.0) * 0.5 + 0.5;
            float ringGlow = exp(-abs(rq - (0.35 + 0.12 * sin(uL1Time * 0.5))) * 5.5);
            col += (mix(uCol0.rgb, uCol2.rgb, neb1) * neb2 * 0.24 + uCol1.rgb * ringGlow * 0.32) * l1Bright;
        } else if (l1m == 4) {
            // Mode 4: TRON / Atari Battlezone Fixed-Horizon Vector Landscape Backing
            float hy = qt_TexCoord0.y - 0.50;
            float horizonGlow = exp(-abs(hy) * 28.0) * (0.42 + uBass * 0.28);
            col += uCol0.rgb * horizonGlow * l1Bright;
            if (hy > 0.0) {
                float floorGrad = clamp(hy * 1.9, 0.0, 1.0);
                col += mix(uCol0.rgb, uCol1.rgb, floorGrad) * (0.06 + 0.06 * uBass) * floorGrad * l1Bright;
            }
        } else if (l1m == 5) {
            // Mode 5: 1983 Atari Star Wars Death Star Trench Run Backing
            float camAlt = sin(uL1Time * 0.82 + uTime * 0.35) * 0.24 + cos(uL1Time * 0.41 - uTime * 0.28) * 0.10;
            vec2 tp = p - vec2(drift.x * 0.35, camAlt);
            float trenchGlow = exp(-abs(tp.x) * 4.2) * (0.18 + 0.16 * uBass);
            float targetGlow = exp(-length(tp) * 5.8) * (0.28 + 0.24 * uBeat);
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
    // INDEPENDENT GPU SHADER TUNNEL & BACKDROP ENGINE (7 Modes 0..6)
    //   0: Harmonic Ripple Tunnel
    //   1: Stained-Glass Rose Tunnel
    //   2: Volumetric Plasma Tunnel
    //   3: Julia Seahorse Fractal Tunnel
    //   4: Raymarched Polygonal Tunnel
    //   5: Cosmic Aura Pulse
    //   6: Relativistic Event Horizon
    // =========================================================================
    if (uL2Enabled > 0.5) {
        int m = int(floor(uL2Mode + 0.5));
        float sym = max(2.0, floor(uFacets + 0.5));
        float zoom = clamp(uZoom, 0.4, 2.5);
        float bIntensity = clamp(uComplexity, 0.2, 2.0);
        vec2 cPos = (p - drift * 0.42) / zoom;
        float r = length(cPos);
        float a = atan(cPos.y, cPos.x);

        if (m == 0) {
            // Mode 0: Harmonic Ripple Tunnel (3D Expanding Polygonal Tunnel Rings + Harmonic Ripple Flower)
            float petals = max(4.0, sym);
            vec2 tp0 = rot2D(uTime * 0.24 * dir) * cPos;
            float dShape0 = shapeRadius(tp0, petals, sin(uTime * 0.42) * 0.16, 0.40);
            float zDepth0 = 0.82 / max(0.04, dShape0);
            float zPhase0 = zDepth0 - uZoomTime * 2.4 * dir;
            float birth0 = smoothstep(0.04, 0.22, dShape0);
            float ring0 = smoothstep(0.66, 0.97, sin(zPhase0 * TAU * 0.5)) * birth0;

            float wPrimary = sin(r * 18.0 - uTime * 3.8 * dir + sin(a * petals + uTime * 1.15) * (1.05 + uBass * 0.85)) * 0.5 + 0.5;
            float wHarmonic = sin(r * 12.0 - uTime * 2.6 * dir - cos(a * (petals * 2.0) - uTime * 0.85) * (0.85 + uMid * 0.95)) * 0.5 + 0.5;
            float petalCrest = pow(wPrimary, 1.45);
            float innerBloom = pow(wHarmonic, 1.85) * exp(-r * 0.45);

            vec3 flowerCol = mix(uCol0.rgb, uCol1.rgb, wHarmonic);
            flowerCol = mix(flowerCol, uCol2.rgb, innerBloom * (0.55 + 0.45 * uHigh));
            float intensity = (0.52 + 0.48 * uBass + 0.22 * uBeat) * bIntensity;
            col = mix(col, flowerCol, clamp(petalCrest * intensity * 0.78, 0.0, 0.94));

            float ridge = smoothstep(0.86, 0.99, wPrimary) * (0.55 + 0.45 * uBass) * bIntensity;
            vec3 tunRingCol = mix(uCol1.rgb, uCol2.rgb, 0.5 + 0.5 * sin(zPhase0 * 0.5));
            col += mix(uCol1.rgb, vec3(0.92, 1.0, 0.96), 0.45) * ridge * 0.52 + tunRingCol * ring0 * (0.48 + 0.36 * uBass) * bIntensity;
        } else if (m == 1) {
            // Mode 1: Stained-Glass Rose Cathedral Field
            float kAng = abs(mod(a + uTime * 0.22, TAU / sym) - (PI / sym));
            float rose = sin(r * 14.0 - uTime * 2.8 * dir + cos(kAng * sym * 2.0 + uTime) * (1.2 + uBass)) * 0.5 + 0.5;
            float arch = cos(kAng * sym * 3.0 - r * 8.0 + uTime * 1.4) * 0.5 + 0.5;
            vec3 glass = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, arch), rose);
            col += glass * pow(rose, 1.5) * (0.42 + 0.30 * uBass) * bIntensity;
        } else if (m == 2) {
            // Mode 2: Volumetric Plasma Field
            float plasma = sin(r * 15.0 - uTime * 3.4 * dir + sin(a * sym + uTime * 1.5) * (0.9 + uMid)) * 0.5 + 0.5;
            float lift = sin(cPos.x * 7.0 + uTime * 1.6) * cos(cPos.y * 7.0 - uTime * 2.0) * 0.5 + 0.5;
            vec3 pCol = mix(uCol0.rgb, uCol2.rgb, lift);
            col += pCol * pow(plasma, 1.55) * (0.42 + 0.30 * uBass) * bIntensity;
        } else if (m == 3) {
            // Mode 3: Mandelbrot & Julia Boundary Deep-Zoom (Seahorse Valley boundary section zoom in/out)
            vec2 poi = vec2(-0.743643887, 0.131825904);
            vec2 cJulia = vec2(-0.745 + cos(uTime * 0.25) * (0.025 + uBass * 0.02),
                               0.186 + sin(uTime * 0.31) * (0.025 + uMid * 0.02));
            float zCycle = uZoomTime * 0.42 * dir;
            vec3 accumCol = vec3(0.0);
            float totalW = 0.0;
            const float maxIter = 26.0;

            for (int k = 0; k < 2; k++) {
                float phase = fract(zCycle + float(k) * 0.5);
                float sWin = sin(phase * PI);
                float wOct = sWin * sWin;
                // Starts at full Mandelbrot cardioid/bulb view (scale=1.65) and zooms 36x into the Seahorse Valley boundary!
                float scale = exp2(-phase * 5.2) * 1.65;
                float rotA = floor(zCycle + float(k) * 0.5) * 0.45 + uTime * 0.10;
                vec2 zOff = rot2D(rotA) * cPos * scale;
                vec2 c = poi + zOff;
                vec2 z = c;
                vec2 cStep = mix(c, cJulia, 0.18 + 0.08 * sin(uTime * 0.35 + phase * PI));

                float iter = 0.0;
                for (float i = 0.0; i < maxIter; i += 1.0) {
                    if (dot(z, z) > 16.0) break;
                    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + cStep;
                    iter += 1.0;
                }
                float smoothIt = iter;
                if (iter < maxIter) {
                    float log_zn = log(max(1.001, dot(z, z))) * 0.5;
                    float nu = log(max(0.001, log_zn / log(2.0))) / log(2.0);
                    smoothIt = iter + 1.0 - nu;
                }
                float fVal = sin(smoothIt * 0.48 - uTime * 1.1) * 0.5 + 0.5;
                float edgeGlow = exp(-abs(iter - maxIter * 0.62) * 0.22);
                vec3 kCol = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, fVal), edgeGlow);
                accumCol += kCol * (0.38 + 0.52 * edgeGlow) * wOct;
                totalW += wOct;
            }
            vec3 fracCol = accumCol / max(0.001, totalW);
            col = mix(col, fracCol, clamp((0.56 + 0.26 * uBass) * bIntensity, 0.0, 0.92));
        } else if (m == 4) {
            // Mode 4: Raymarched Shape Field (Smooth vanishing-point fade so zero sudden joint appears at r -> 0)
            float rotBase = uTime * 0.32;
            vec2 tp = rot2D(rotBase) * cPos;
            float starMod = sin(uTime * 0.42) * 0.18 * (0.6 + uMid * 0.6);
            float roundMod = 0.30 + 0.25 * cos(uTime * 0.31);
            float dShape = shapeRadius(tp, sym, starMod, roundMod);

            float zDepth = 0.85 / max(0.04, dShape);
            float zPhase = zDepth - uZoomTime * 2.2 * dir;
            float birthFade = smoothstep(0.04, 0.22, dShape);
            float ringWave = sin(zPhase * TAU * 0.5);
            float ringLine = smoothstep(0.68, 0.97, ringWave) * birthFade;

            float laneWave = abs(sin(atan(tp.y, tp.x) * sym + sin(zDepth * 0.6 + uTime * 0.5) * 0.28));
            float laneLine = smoothstep(0.92, 0.995, laneWave) * smoothstep(0.06, 0.24, dShape) * 0.42;

            float check = 0.5 + 0.5 * sin(zPhase * PI * 0.5) * sin(atan(tp.y, tp.x) * sym);
            vec3 wallCol = mix(uCol0.rgb, uCol2.rgb, check);
            float wallAlpha = birthFade * (0.14 + 0.12 * uBass) * bIntensity;

            vec3 ringCol = mix(uCol1.rgb, uCol0.rgb, 0.5 + 0.5 * sin(zPhase * 0.4));
            col += wallCol * wallAlpha + ringCol * (ringLine * (0.62 + 0.38 * uBass) + laneLine) * bIntensity;
            col *= smoothstep(0.02, 0.10, dShape);
        } else if (m == 5) {
            // Mode 5: Cosmic Aura Pulse (Concentric Interference Corona & Starburst Filaments)
            float aura = sin(r * 12.0 - uTime * 2.4 * dir + sin(a * sym + uTime * 0.8)) * 0.5 + 0.5;
            float rays = pow(0.5 + 0.5 * cos(a * sym * 2.0 - uTime * 1.1 + sin(r * 6.0)), 2.2);
            float falloff = exp(-r * 1.15) * (0.38 + 0.32 * uBass + 0.18 * uBeat) * bIntensity;
            col += (mix(uCol0.rgb, uCol1.rgb, aura) + uCol2.rgb * rays * 0.45) * falloff;
        } else {
            // Mode 6: Relativistic Event Horizon & Gravitational Lensing Accretion Halo
            float ehR = 0.22 + uBass * 0.04;
            float photonRing = exp(-abs(r - ehR) * 18.0) * (0.72 + uBeat * 0.38);
            float swirl = sin(a * sym - log(max(0.04, r)) * 8.0 - uTime * 2.2 * dir) * 0.5 + 0.5;
            float corona = smoothstep(ehR * 0.82, ehR * 1.08, r) * exp(-max(0.0, r - ehR) * 3.0);
            col += (uCol0.rgb * photonRing + mix(uCol1.rgb, uCol2.rgb, swirl) * corona * 0.52) * bIntensity;
            col *= smoothstep(ehR * 0.70, ehR * 0.98, r);
        }
    }

    // Subtle vignette for cinema depth
    float vig = 1.0 - dot(uv * 0.42, uv * 0.42);
    col *= clamp(vig, 0.55, 1.0);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * qt_Opacity;
}
