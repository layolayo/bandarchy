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
    float uL1Speed;
    float uL1Density;
    float uL1Direction;
    float uL2Enabled;
    float uL2Mode;
    float uL2VizMode;
    float uZoom;
    float uFacets;
    float uComplexity;
    float uTracerCount;
    float uTracerDir;
    float uDriftX;
    float uDriftY;
    float uL4Enabled;
    float uL4Mode;
    float uL4DualEnabled;
    float uL4SecondaryMode;
    float uL4DualMix;
    float uL4WallPattern;
    float uL4Twist;
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

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
}

float segGlow(vec2 p, vec2 a, vec2 b, float lw) {
    vec2 ab = b - a;
    float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
    return exp(-length((p - a) - ab * t) * lw);
}

// Smooth polygon / star distance metric with branch-cut-free sector folding
float shapeRadius(vec2 p, float folds, float starDepth, float roundness) {
    float r = length(p);
    if (r < 0.0001) return 0.0;
    float f = max(3.0, floor(folds + 0.5));
    float a = atan(p.y, p.x);
    float sector = TAU / f;
    float halfSector = sector * 0.5;
    float localA = mod(a + halfSector, sector) - halfSector;
    float poly = cos(halfSector) / max(0.25, cos(localA));
    float star = 1.0 + cos(localA * f) * starDepth;
    return r * mix(1.0, poly * star, clamp(1.0 - roundness, 0.0, 1.0));
}

// Evaluates the 5 Layer 4 Wall Patterns (0: Rings, 1: Hex Grid, 2: Ribbons, 3: Matrix, 4: Strobe)
float evalWallPattern(int wallPat, float zPhase, float aFold, float sym, float birthFade) {
    if (wallPat == 1) {
        // 1: Hex Grid
        vec2 hexUV = vec2(zPhase * 0.85, aFold * sym * 1.35);
        vec2 hFrac = abs(fract(hexUV) - 0.5);
        float hexEdge = smoothstep(0.36, 0.48, max(hFrac.x + hFrac.y * 0.58, hFrac.y * 1.15));
        return hexEdge * birthFade;
    } else if (wallPat == 2) {
        // 2: Ribbons
        float rib = smoothstep(0.55, 0.96, cos(aFold * sym * PI + sin(zPhase * 0.75) * 1.4));
        return rib * birthFade;
    } else if (wallPat == 3) {
        // 3: Matrix
        float matRing = smoothstep(0.62, 0.95, sin(zPhase * PI));
        float matSeg = step(0.15, sin(zPhase * 3.5 + floor(aFold * sym * 2.0) * 1.7));
        return matRing * matSeg * birthFade;
    } else if (wallPat == 4) {
        // 4: Strobe
        float strb = smoothstep(0.45, 0.96, sin(zPhase * PI * 0.5) * cos(aFold * sym * PI));
        return strb * (0.65 + 0.35 * uBeat) * birthFade;
    }
    // 0: Rings (Default concentric depth rings)
    return smoothstep(0.64, 0.97, sin(zPhase * TAU * 0.5)) * birthFade;
}

// Evaluates any of the 16 Layer 4 GPU Tunnel & Vortex Modes (0..15)
vec3 evalLayer4Mode(int m, vec2 cPos, float sym, float bIntensity, float dir, float twist, int wallPat, vec3 baseCol) {
    vec3 col = baseCol;
    float fSym = max(2.0, floor(sym + 0.5));
    float sector = TAU / fSym;
    float halfSector = sector * 0.5;
    float r = length(cPos);

    if (m == 0) {
        // Mode 0: Cyber Tunnel (3D Expanding Polygonal Tunnel Rings + Configurable Wall Pattern)
        vec2 tp0 = rot2D(uTime * 0.28 * dir * twist + 0.22 * twist / max(0.14, r)) * cPos;
        float dShape0 = shapeRadius(tp0, fSym, sin(uTime * 0.42) * 0.16, 0.36);
        float zDepth0 = 0.84 / max(0.04, dShape0);
        float zPhase0 = zDepth0 + uZoomTime * 2.4 * dir;
        float birth0 = smoothstep(0.04, 0.22, dShape0);
        float a0 = atan(tp0.y, tp0.x);
        float aFold0 = abs(mod(a0 + halfSector, sector) - halfSector) / halfSector;
        float ring0 = evalWallPattern(wallPat, zPhase0, aFold0, fSym, birth0);
        float lane0 = smoothstep(0.88, 0.99, 1.0 - abs(aFold0 - 0.5) * 2.0) * birth0 * 0.45;

        float wPrimary = sin(r * 16.0 - uTime * 3.6 * dir + cos(aFold0 * PI * 2.0 + uTime * 1.1) * (1.0 + uBass * 0.85)) * 0.5 + 0.5;
        vec3 wallCol = mix(uCol0.rgb, uCol1.rgb, wPrimary);
        vec3 ringCol = mix(uCol1.rgb, uCol2.rgb, 0.5 + 0.5 * sin(zPhase0 * 0.5));
        col = mix(col, wallCol, clamp(pow(wPrimary, 1.5) * (0.42 + 0.38 * uBass) * bIntensity, 0.0, 0.88));
        col += (ringCol * ring0 * (0.62 + 0.42 * uBass) + uCol2.rgb * lane0) * bIntensity;
    } else if (m == 1) {
        // Mode 1: Spiral Vortex (Logarithmic Multi-Arm Whirlpool Vortex)
        float logR = log(max(0.025, r));
        vec2 tp1 = rot2D(-logR * 1.85 * twist + uTime * 0.65 * dir) * cPos;
        float a1 = atan(tp1.y, tp1.x);
        float aFold1 = abs(mod(a1 + halfSector, sector) - halfSector) / halfSector;
        float zPhase1 = -logR * 3.2 + uZoomTime * 2.2 * dir;
        float birth1 = smoothstep(0.02, 0.16, r);
        float armCrest = pow(0.5 + 0.5 * cos(aFold1 * PI * 2.0 + sin(logR * 4.0 - uTime * 1.8) * (0.8 + uBass)), 1.65);
        float wallMod = evalWallPattern(wallPat, zPhase1, aFold1, fSym, birth1);
        vec3 vortCol = mix(uCol0.rgb, uCol1.rgb, armCrest);
        vortCol = mix(vortCol, uCol2.rgb, wallMod * (0.55 + 0.45 * uHigh));
        col = mix(col, vortCol, clamp((armCrest * 0.65 + wallMod * 0.48) * (0.55 + 0.42 * uBass) * bIntensity * birth1, 0.0, 0.94));
    } else if (m == 2) {
        // Mode 2: Twin Ripple (2 Simultaneous Interfering Wave Emitters)
        float orbitA = uTime * 0.58 * twist;
        float sep = 0.42 + 0.14 * sin(uTime * 0.37) + uBass * 0.08;
        vec2 e1 = vec2(cos(orbitA), sin(orbitA * 0.85)) * sep;
        vec2 e2 = -e1;
        float d1 = length(cPos - e1);
        float d2 = length(cPos - e2);
        float freq = (16.0 + fSym * 1.2) * (0.85 + 0.25 * abs(twist));
        float w1 = sin(d1 * freq - uZoomTime * 4.2 * dir);
        float w2 = sin(d2 * freq - uZoomTime * 4.2 * dir + PI * 0.25);
        float interf = (w1 + w2) * 0.5;
        float hyperbolic = 0.5 + 0.5 * cos((d1 - d2) * freq * 0.85 + uTime * 1.4);
        float crests = smoothstep(0.25, 0.96, abs(interf));
        float nodes = exp(-min(d1, d2) * 4.5) * (0.65 + 0.45 * uBeat);
        vec3 ripCol = mix(uCol0.rgb, uCol1.rgb, hyperbolic);
        ripCol = mix(ripCol, uCol2.rgb, crests * (0.55 + 0.45 * uMid));
        col = mix(col, ripCol, clamp((crests * 0.72 + hyperbolic * 0.28) * (0.58 + 0.38 * uBass) * bIntensity, 0.0, 0.94));
        col += vec3(0.95, 0.98, 1.0) * nodes * bIntensity * 0.55;
    } else if (m == 3) {
        // Mode 3: Binary Twin Vortex (2 Simultaneous Counter-Rotating Interacting Vortex Cores)
        float orb = uTime * 0.52 * dir;
        float sep3 = 0.38 + 0.10 * cos(uTime * 0.4) + uBass * 0.08;
        vec2 v1 = vec2(cos(orb), sin(orb)) * sep3;
        vec2 v2 = -v1;
        vec2 p1 = cPos - v1;
        vec2 p2 = cPos - v2;
        float r1 = max(0.025, length(p1));
        float r2 = max(0.025, length(p2));
        vec2 rp1 = rot2D(-log(r1) * 2.2 * twist + uTime * 1.4 * dir) * p1;
        vec2 rp2 = rot2D( log(r2) * 2.2 * twist - uTime * 1.4 * dir) * p2;
        float a1 = abs(mod(atan(rp1.y, rp1.x) + halfSector, sector) - halfSector) / halfSector;
        float a2 = abs(mod(atan(rp2.y, rp2.x) + halfSector, sector) - halfSector) / halfSector;
        float s1 = cos(a1 * PI * 2.0 - log(r1) * 5.0 - uZoomTime * 3.0 * dir) * 0.5 + 0.5;
        float s2 = cos(a2 * PI * 2.0 + log(r2) * 5.0 - uZoomTime * 3.0 * dir) * 0.5 + 0.5;
        float bridge = exp(-abs(r1 - r2) * 5.5) * (0.55 + 0.45 * uBeat);
        vec3 binCol = mix(uCol0.rgb * s1, uCol1.rgb * s2, r1 / (r1 + r2));
        binCol += uCol2.rgb * (pow(s1 * s2, 1.35) * 1.25 + bridge * 0.75);
        float coreFade = smoothstep(0.02, 0.11, min(r1, r2));
        col = mix(col, binCol * coreFade, clamp((0.68 + 0.30 * uBass) * bIntensity, 0.0, 0.95));
    } else if (m == 4) {
        // Mode 4: Butterchurn Liquid Mesh (Iterative Curl-Warped MilkDrop Feedback Caustics)
        vec2 q = rot2D(uTime * 0.18 * twist) * cPos;
        for (int i = 0; i < 3; i++) {
            float fi = float(i) + 1.0;
            q += vec2(
                sin(q.y * (3.2 * fi) + uTime * 1.1 * dir + uBass * 1.4),
                cos(q.x * (3.2 * fi) - uTime * 0.95 * dir + uMid * 1.4)
            ) * (0.22 / fi) * (0.75 + 0.25 * abs(twist));
        }
        float caustic = 0.5 + 0.5 * sin(length(q) * 10.0 - uZoomTime * 2.8 * dir);
        float mesh = smoothstep(0.72, 0.98, max(sin(q.x * fSym * 1.4), cos(q.y * fSym * 1.4)));
        vec3 liqCol = mix(uCol0.rgb, uCol1.rgb, caustic);
        liqCol = mix(liqCol, uCol2.rgb, 0.5 + 0.5 * sin(q.x * 3.0 - q.y * 3.0 + uTime));
        col = mix(col, liqCol + vec3(0.85, 0.95, 1.0) * mesh * 0.35, clamp((0.62 + 0.32 * uBass) * bIntensity, 0.0, 0.94));
    } else if (m == 5) {
        // Mode 5: projectM Fluid Preset (Radial Cathedral Symmetry Folds & Harmonic Ribbon Waves)
        vec2 tp5 = rot2D(uTime * 0.22 * dir + sin(r * 4.0 - uTime) * 0.28 * twist) * cPos;
        float a5 = atan(tp5.y, tp5.x);
        float kAng = abs(mod(a5 + halfSector, sector) - halfSector);
        float rose = sin(r * 14.0 - uZoomTime * 2.8 * dir + cos(kAng * fSym * 2.0 + uTime) * (1.2 + uBass)) * 0.5 + 0.5;
        float arch = cos(kAng * fSym * 3.0 - r * 8.0 + uTime * 1.4) * 0.5 + 0.5;
        vec3 glass = mix(uCol0.rgb, mix(uCol1.rgb, uCol2.rgb, arch), rose);
        col += glass * pow(rose, 1.45) * (0.52 + 0.38 * uBass) * bIntensity;
    } else if (m == 6) {
        // Mode 6: Magic Liquid Waves (Multi-Layered Harmonic Sine-Interference Aurora Curtains)
        vec2 wp = rot2D(0.25 * twist * sin(uTime * 0.3)) * cPos;
        float w1 = sin(wp.x * 5.0 + sin(wp.y * 4.5 - uTime * 1.8 * dir) * (1.1 + uBass));
        float w2 = cos(wp.y * 5.5 + cos(wp.x * 4.0 + uTime * 1.5 * dir) * (1.1 + uMid));
        float w3 = sin((wp.x + wp.y) * 4.2 - uZoomTime * 2.6 * dir);
        float band = 0.5 + 0.5 * sin((w1 + w2 + w3) * 2.2);
        float ribbon = smoothstep(0.75, 0.98, abs(sin((w1 - w2) * 3.0)));
        vec3 magicCol = mix(uCol0.rgb, uCol1.rgb, band);
        magicCol = mix(magicCol, uCol2.rgb, ribbon);
        col = mix(col, magicCol + uCol2.rgb * ribbon * 0.42, clamp((0.60 + 0.34 * uBass) * bIntensity, 0.0, 0.93));
    } else if (m == 7) {
        // Mode 7: VS Synth Matrix (Quantized Neon Synth Grid, Polar Radar Sweep & CRT Beams)
        vec2 mp = rot2D(uTime * 0.14 * twist) * cPos;
        float gScale = 4.5 + fSym * 0.35;
        vec2 gUV = mp * gScale + vec2(0.0, -uZoomTime * 1.6 * dir);
        vec2 gCell = abs(fract(gUV) - 0.5);
        float gridLine = smoothstep(0.40, 0.48, max(gCell.x, gCell.y));
        vec2 gId = floor(gUV);
        vec2 hId = hash2(gId);
        float cellPulse = step(0.45, fract(hId.x + uTime * (0.6 + hId.y * 0.8) + uBass * 0.5));
        float radarRing = smoothstep(0.84, 0.98, sin(r * 16.0 - uZoomTime * 3.8 * dir));
        vec3 vsCol = mix(uCol0.rgb, uCol1.rgb, hId.y) * (cellPulse * 0.55 + gridLine * 0.95);
        vsCol += uCol2.rgb * radarRing * (0.65 + 0.45 * uBeat);
        col = mix(col, vsCol, clamp((0.64 + 0.32 * uBass) * bIntensity, 0.0, 0.94));
    } else if (m == 8) {
        // Mode 8: VSXu Fluid Ribbons & Rotating 3D Circles (Twisting Silk Ribbon Streams + Counter-Rotating Segmented 3D Rings Travelling Towards the Viewer)
        float zDepth8 = 0.85 / max(0.04, r);
        vec2 rp8 = rot2D(zDepth8 * 0.28 * twist - uTime * 0.45 * dir) * cPos;
        float a8 = atan(rp8.y, rp8.x);
        float aFold8 = abs(mod(a8 + halfSector, sector) - halfSector) / halfSector;
        float ribWave = sin(aFold8 * PI * 3.0 + sin(zDepth8 * 1.4 - uZoomTime * 3.2 * dir) * (1.2 + uBass));
        float silk = smoothstep(0.45, 0.96, abs(ribWave)) * smoothstep(0.04, 0.20, r);
        float coreEdge = smoothstep(0.86, 0.99, abs(ribWave)) * smoothstep(0.05, 0.24, r);
        // Rotating & counter-rotating segmented 3D circles travelling towards the viewer along zDepth8
        float ringStream = zDepth8 * 1.35 - uZoomTime * 2.85 * dir;
        float ringIdx8 = floor(ringStream);
        float ringLocal8 = abs(fract(ringStream) - 0.5) * 2.0;
        float ringBand8 = smoothstep(0.32, 0.03, ringLocal8) * smoothstep(0.035, 0.18, r);
        float ringSpinDir8 = (mod(ringIdx8, 2.0) < 0.5) ? 1.0 : -1.0;
        float rawAng8 = atan(cPos.y, cPos.x) + uTime * (1.45 + 0.45 * uBass) * ringSpinDir8 * twist + ringIdx8 * 0.7854;
        float segArc8 = smoothstep(-0.15, 0.55, cos(rawAng8 * max(4.0, fSym))) * ringBand8;
        float ringRim8 = smoothstep(0.11, 0.0, ringLocal8) * smoothstep(0.05, 0.65, cos(rawAng8 * max(4.0, fSym))) * smoothstep(0.04, 0.20, r);
        vec3 silkCol = mix(uCol0.rgb, uCol1.rgb, 0.5 + 0.5 * sin(zDepth8 * 0.6 - uTime));
        silkCol = mix(silkCol, uCol2.rgb, aFold8);
        vec3 ringCol8 = mix(uCol2.rgb, uCol0.rgb, 0.5 + 0.5 * sin(ringIdx8 * 1.3 + uTime * 1.6));
        vec3 vsxuTotal = silkCol * silk * 0.85
                       + ringCol8 * segArc8 * (0.95 + 0.48 * uBass + 0.35 * uBeat)
                       + vec3(0.96, 0.99, 1.0) * (coreEdge * 0.48 + ringRim8 * (0.78 + 0.45 * uBeat));
        col = mix(col, vsxuTotal, clamp((0.68 + 0.32 * uBass) * bIntensity, 0.0, 0.95));
    } else if (m == 9) {
        // Mode 9: TouchDesigner Curl Fluid (Domain-Warped Advection Streams & Filaments)
        vec2 p9 = cPos * 2.2;
        vec2 v = vec2(
            sin(p9.y * 2.4 + uTime * 1.1 * dir),
            cos(p9.x * 2.4 - uTime * 0.9 * dir)
        );
        vec2 w = p9 + v * (0.65 + 0.35 * uBass) * twist;
        w += vec2(sin(w.y * 4.2 - uZoomTime * 2.0 * dir), cos(w.x * 4.2 + uZoomTime * 1.8 * dir)) * 0.38;
        float curlVal = 0.5 + 0.5 * sin(length(w) * 4.5 - uTime * 2.2 * dir);
        float ridge9 = smoothstep(0.78, 0.98, sin(w.x * 3.5 + w.y * 3.5));
        vec3 tdCol = mix(uCol0.rgb, uCol1.rgb, curlVal);
        tdCol = mix(tdCol, uCol2.rgb, 0.5 + 0.5 * cos(w.x * 2.2 - w.y * 2.2));
        col = mix(col, tdCol + vec3(0.92, 0.97, 1.0) * ridge9 * 0.45, clamp((0.65 + 0.30 * uBass) * bIntensity, 0.0, 0.94));
    } else if (m == 10) {
        // Mode 10: Metaball Liquid Chrome (5 Orbiting Audio-Reactive Scalar Metaballs with Chrome Rim Specular)
        float field = 0.0;
        vec2 grad = vec2(0.0);
        for (int i = 0; i < 5; i++) {
            float fi = float(i);
            float ang = uTime * (0.55 + fi * 0.14) * dir * (mod(fi, 2.0) == 0.0 ? 1.0 : -1.0) + fi * 1.2566;
            float rad = (0.28 + 0.18 * sin(uTime * 0.7 + fi * 1.7)) * (1.0 + uBass * 0.25);
            vec2 mb = vec2(cos(ang), sin(ang * 1.15)) * rad;
            vec2 diff = cPos - mb;
            float d2 = dot(diff, diff) + 0.028;
            float w = (0.042 + 0.014 * uBeat) / d2;
            field += w;
            grad += (-2.0 * w / d2) * diff;
        }
        vec2 norm = normalize(grad + vec2(0.0001));
        float envRefl = 0.5 + 0.5 * sin(norm.x * 6.0 + norm.y * 6.0 + uTime * 1.8);
        float chromeMask = smoothstep(0.68, 1.12, field);
        float rimGlow = exp(-abs(field - 0.95) * 7.5) * (0.85 + 0.45 * uBeat);
        vec3 chromeCol = mix(uCol0.rgb, uCol1.rgb, envRefl);
        chromeCol = mix(chromeCol, vec3(0.96, 0.98, 1.0), pow(envRefl, 3.0) * 0.65);
        col = mix(col, chromeCol, clamp(chromeMask * (0.72 + 0.25 * uBass) * bIntensity, 0.0, 0.94));
        col += uCol2.rgb * rimGlow * bIntensity * 0.65;
    } else if (m == 11) {
        // Mode 11: Wormhole Bend (Curved Einstein-Rosen Spacetime Bridge with Orbiting Throat)
        vec2 throat = vec2(cos(uTime * 0.68), sin(uTime * 0.54)) * (0.28 + 0.10 * uBass) * twist;
        float rawR = max(0.035, length(cPos - throat));
        float zW = 0.78 / rawR;
        vec2 bentP = (cPos - throat) + throat * exp(-rawR * 2.2) * sin(zW * 0.6 + uZoomTime * 2.4 * dir);
        vec2 rotW = rot2D(zW * 0.24 * twist + uTime * 0.35 * dir) * bentP;
        float aW = atan(rotW.y, rotW.x);
        float aFoldW = abs(mod(aW + halfSector, sector) - halfSector) / halfSector;
        float zPhaseW = zW + uZoomTime * 2.6 * dir;
        float birthW = smoothstep(0.035, 0.20, rawR);
        float ringW = evalWallPattern(wallPat, zPhaseW, aFoldW, fSym, birthW);
        float ribsW = smoothstep(0.84, 0.99, cos(aFoldW * PI * 2.0)) * birthW;
        vec3 whCol = mix(uCol0.rgb, uCol1.rgb, 0.5 + 0.5 * sin(zPhaseW * 0.45));
        whCol = mix(whCol, uCol2.rgb, ribsW);
        col = mix(col, whCol, clamp((ringW * 0.75 + ribsW * 0.45) * (0.62 + 0.38 * uBass) * bIntensity, 0.0, 0.95));
    } else if (m == 12) {
        // Mode 12: Moiré Dual Grids (Counter-Rotating Polar & Hexagonal Super-Interference Grids)
        float freqM = 11.0 + fSym * 0.85;
        vec2 g1 = rot2D(uTime * 0.32 * dir * twist) * (cPos - vec2(0.08 * cos(uTime * 0.7), 0.08 * sin(uTime * 0.7)));
        vec2 g2 = rot2D(-uTime * 0.29 * dir * twist) * (cPos + vec2(0.08 * cos(uTime * 0.7), 0.08 * sin(uTime * 0.7)));
        float p1 = sin(length(g1) * freqM * 1.5 - uZoomTime * 2.8 * dir) * cos(g1.x * freqM) * cos(g1.y * freqM);
        float p2 = sin(length(g2) * freqM * 1.5 + uZoomTime * 2.4 * dir) * cos(g2.x * freqM * 1.08) * cos(g2.y * freqM * 1.08);
        float moire = 0.5 + 0.5 * sin((p1 - p2) * PI * (1.6 + uBass * 0.8));
        float fineBeat = smoothstep(0.65, 0.98, abs(p1 + p2));
        vec3 mCol = mix(uCol0.rgb, uCol1.rgb, moire);
        mCol = mix(mCol, uCol2.rgb, fineBeat);
        col = mix(col, mCol, clamp((0.64 + 0.32 * uBass) * bIntensity, 0.0, 0.94));
    } else if (m == 13) {
        // Mode 13: Mandelbrot Deep Dive (Full-Resolution 96-Iteration Boundary Valley Dive)
        float zFlow = uZoomTime * 0.14;
        int poiIdx = int(mod(floor(zFlow), 5.0));
        vec2 poi = vec2(-0.74364388, 0.13182590);
        if (poiIdx == 1) poi = vec2(0.28171792, 0.57710528);
        else if (poiIdx == 2) poi = vec2(-0.10109636, 0.95628651);
        else if (poiIdx == 3) poi = vec2(-0.08800000, 0.65400000);
        else if (poiIdx == 4) poi = vec2(-1.40115500, 0.00000000);

        float cycPhase = fract(zFlow);
        float diveT;
        if (abs(uTracerDir) < 0.05) {
            diveT = 0.5 - 0.5 * cos(cycPhase * TAU);
        } else if (uTracerDir > 0.0) {
            diveT = smoothstep(0.0, 0.78, cycPhase) * (1.0 - smoothstep(0.78, 1.0, cycPhase));
        } else {
            diveT = smoothstep(0.0, 0.22, cycPhase) * (1.0 - smoothstep(0.22, 1.0, cycPhase));
        }
        float zoomExp = diveT * 9.8;
        float scale = 2.6 * exp(-zoomExp);
        vec2 camCenter = mix(vec2(-0.5, 0.0), poi, smoothstep(0.0, 2.2, zoomExp));
        float camRot = sin(uTime * 0.12) * 0.28 * twist * smoothstep(0.5, 3.5, zoomExp);
        vec2 c = camCenter + rot2D(camRot) * cPos * scale;

        vec2 z = c;
        vec2 cOrbit = c + vec2(cos(uTime * 0.45) * uBass, sin(uTime * 0.52) * uMid) * scale * 0.035;
        const float maxIter = 96.0;
        float iter = 0.0;
        for (float i = 0.0; i < maxIter; i += 1.0) {
            float r2 = dot(z, z);
            if (r2 > 256.0) break;
            z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + cOrbit;
            iter += 1.0;
        }

        vec3 fracCol = uBgCol.rgb * 0.08;
        if (iter < maxIter) {
            float nu = iter + 1.0 - log2(max(1.0, log2(max(1.0001, dot(z, z)))));
            float cyc = nu * 0.11 - uTime * 0.35;
            float w0 = 0.5 + 0.5 * sin(cyc * TAU);
            float w1 = 0.5 + 0.5 * cos(cyc * TAU * 0.67 + 1.2);
            float filament = pow(0.5 + 0.5 * sin(nu * 0.55 + uBass * 1.4), 2.2);
            fracCol = mix(uCol0.rgb, uCol1.rgb, w0);
            fracCol = mix(fracCol, uCol2.rgb, w1 * 0.72);
            fracCol += vec3(0.95, 0.98, 1.0) * filament * (0.28 + 0.32 * uBeat);
        } else {
            float intGlow = exp(-dot(z, z) * 2.4) * (0.22 + 0.25 * uBass);
            fracCol = mix(uBgCol.rgb * 0.05, uCol2.rgb * 0.35, intGlow);
        }
        col = mix(col, fracCol, clamp((0.68 + 0.24 * uBass) * bIntensity, 0.0, 0.96));
    } else if (m == 14) {
        // Mode 14: Gargantua Blackhole (Interstellar Relativistic Event Horizon & Doppler Accretion Disk)
        float tiltAngle = -0.24 * twist + sin(uTime * 0.18) * 0.08;
        vec2 bhPos = rot2D(tiltAngle) * cPos;
        float rHorizon = 0.25 + uBass * 0.035;
        float rBH = length(bhPos);
        float doppler = clamp(1.0 - bhPos.x * 1.15 * dir, 0.32, 1.85);

        float rLensed = length(vec2(bhPos.x * 0.82, abs(bhPos.y) - rHorizon * 0.18));
        float lensedHalo = exp(-abs(rLensed - rHorizon * 1.06) * 14.0) * smoothstep(rHorizon * 0.90, rHorizon * 1.04, rBH);

        vec2 diskCoord = vec2(bhPos.x, bhPos.y / 0.22);
        float rDisk = length(diskCoord);
        vec2 rotDisk = rot2D(-uTime * 1.15 * dir) * diskCoord;
        float diskAngle = atan(rotDisk.y, rotDisk.x);
        float diskRings = 0.5 + 0.5 * sin(rDisk * 28.0 - uZoomTime * 5.0 * dir + sin(diskAngle * 3.0) * 0.65);
        float diskMask = smoothstep(rHorizon * 0.95, rHorizon * 1.25, rDisk) * exp(-max(0.0, rDisk - rHorizon * 1.15) * 2.35);
        bool inFrontBelt = (bhPos.y < 0.0) && (abs(bhPos.y) < rHorizon * 0.24) && (rDisk > rHorizon * 1.05);

        float photonRing = smoothstep(0.022, 0.0, abs(rBH - rHorizon)) + exp(-abs(rBH - rHorizon) * 42.0) * 0.85;

        float jetWidth = 0.022 + abs(bhPos.y) * 0.085;
        float jetCore = exp(-(bhPos.x * bhPos.x) / max(0.0002, jetWidth * jetWidth))
                      * smoothstep(rHorizon * 0.88, rHorizon * 1.35, abs(bhPos.y))
                      * exp(-abs(bhPos.y) * 1.35)
                      * (0.45 + uBass * 0.85 + uBeat * 0.65);
        float jetShock = 0.65 + 0.35 * sin(abs(bhPos.y) * 24.0 - uTime * 9.0);

        vec3 diskCol = mix(uCol1.rgb, uCol0.rgb, diskRings) * doppler;
        diskCol = mix(diskCol, vec3(1.0, 0.97, 0.90), clamp(diskRings * doppler * 0.48, 0.0, 1.0));
        vec3 jetCol = mix(uCol2.rgb, vec3(0.88, 0.96, 1.0), 0.55) * jetCore * jetShock;
        vec3 ringCol = mix(uCol0.rgb, vec3(1.0, 0.98, 0.92), 0.72) * photonRing * (0.95 + uBeat * 0.45);

        if (rBH < rHorizon && !inFrontBelt) {
            col = vec3(0.0);
        } else {
            float shadowEdge = smoothstep(rHorizon * 0.96, rHorizon * 1.02, rBH);
            col *= shadowEdge;
            col += (diskCol * (diskMask * 0.95 + lensedHalo * 0.78) + ringCol + jetCol) * bIntensity;
        }
        if (inFrontBelt && rBH < rHorizon) {
            col = diskCol * diskMask * bIntensity;
        }
    } else if (m == 15) {
        // Mode 15: Voronoi Bio-Cells (Bioluminescent Living Cellular Tessellation)
        float flowPhase = uZoomTime * 1.15 * dir;
        float cellScale = 3.2 + bIntensity * 1.4;
        vec2 st = rot2D(uTime * 0.08 * twist) * cPos * cellScale + vec2(sin(flowPhase * 0.32), cos(flowPhase * 0.27)) * 0.65;
        vec2 ip = floor(st);
        vec2 fp = fract(st);

        float d1 = 8.0;
        float d2 = 8.0;
        vec2 bestCellId = vec2(0.0);

        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 offset = vec2(float(x), float(y));
                vec2 h2 = hash2(ip + offset);
                vec2 seed = offset + 0.5 + (0.42 + uBass * 0.06) * sin(flowPhase * 1.4 + TAU * h2 + vec2(uMid * 1.3, uHigh * 1.3));
                float dist = length(seed - fp);
                if (dist < d1) {
                    d2 = d1;
                    d1 = dist;
                    bestCellId = h2;
                } else if (dist < d2) {
                    d2 = dist;
                }
            }
        }

        float edge = 1.0 - smoothstep(0.0, 0.08 + uBass * 0.05, d2 - d1);
        float nucleus = exp(-d1 * d1 * (18.0 - uBeat * 8.0));
        float cytoplasm = 0.5 + 0.5 * sin(d1 * 18.0 - flowPhase * 4.0 + bestCellId.x * TAU);

        vec3 cellTint = mix(uCol0.rgb, uCol1.rgb, bestCellId.x);
        cellTint = mix(cellTint, uCol2.rgb, bestCellId.y * 0.75);
        vec3 membraneCol = mix(uCol2.rgb, vec3(0.95, 1.0, 0.98), 0.55);

        vec3 voronoiCol = cellTint * (0.20 + 0.42 * cytoplasm)
                        + membraneCol * edge * (0.85 + 0.45 * uBass)
                        + mix(uCol1.rgb, vec3(1.0), 0.6) * nucleus * (0.65 + 0.55 * uBeat);
        col = mix(col, voronoiCol, clamp((0.68 + 0.24 * uBass) * bIntensity, 0.0, 0.95));
    } else {
        // Mode 16: DMT Machine Elves (Hyper-Dimensional Fractal Entity Morphogenesis & Toroidal Pillar Lattice)
        float flow = uZoomTime * 1.35 * dir;
        // Morphogenesis growth envelope (0 -> 1 -> 0 breathing emergence from the hyperbolic lattice)
        float growth = 0.58 + 0.42 * sin(uTime * 0.42 + uBass * 1.2);
        // Bilateral mirror symmetry for the central emerging hyper-being + peripheral column elves
        vec2 bp = vec2(abs(cPos.x), cPos.y);
        float r0 = max(length(cPos), 0.001);
        float ang0 = atan(cPos.y, cPos.x);

        // 1. Hyperbolic Toroidal Vault & Alex Grey Pillar Columns
        float torusWarp = 1.0 / (r0 + 0.36);
        float vaultRings = sin(10.0 * torusWarp - flow * 3.2 + sin(ang0 * sym) * 0.75 * twist);
        float pillarWave = cos((cPos.x * 3.6 + sin(cPos.y * 2.8 + uTime * 0.5) * 0.45) * PI);

        // 2. Recursive KIFS (Kaleidoscopic Iterated Function System) Fold for Self-Transforming Elf Facets
        vec2 q = bp * (1.55 + 0.25 * (1.0 - growth));
        float kifsAccum = 0.0;
        float kifsScale = 1.0;
        for (int i = 0; i < 4; i++) {
            q = abs(q) - vec2(0.46 + 0.08 * sin(uTime * 0.55 + float(i)), 0.38 + 0.07 * cos(uTime * 0.43 + float(i) * 1.3));
            q = rot2D(0.42 * twist + 0.18 * sin(uTime * 0.37 + float(i)) + uMid * 0.22) * q;
            q *= 1.38;
            kifsScale *= 1.38;
            float dFold = abs(min(q.x, q.y)) / kifsScale;
            kifsAccum += exp(-dFold * 28.0);
        }

        // 3. Implicit SDF Entity Anatomy (Cranial Dome, Almond Eyes, Pineal Third-Eye Crown, Ribbed Torso)
        vec2 headP = vec2(bp.x, cPos.y - 0.06 * sin(uTime * 0.8));
        // Cranial chalice / dome contour
        float dHead = length(headP * vec2(1.15, 0.92 + 0.12 * cPos.y)) - (0.48 * growth + uBass * 0.05);
        // Bilateral Almond Eyes (vesica intersection)
        vec2 eyeP = bp - vec2(0.19 * growth, 0.08 + 0.02 * sin(uTime * 1.3));
        eyeP = rot2D(-0.18) * eyeP;
        float dEye = length(eyeP * vec2(1.0, 2.15)) - (0.095 * growth + uBeat * 0.02);
        float dPupil = length(eyeP) - 0.036 * growth;
        // Pineal Third-Eye Mandala at forehead centre (x = 0, y = 0.26)
        vec2 thirdEyeP = vec2(bp.x, cPos.y - 0.26 * growth);
        float dThirdEye = length(thirdEyeP * vec2(1.45, 0.95)) - (0.085 * growth + uHigh * 0.03);
        // Harmonic mouth / энергетический throat lattice
        vec2 mouthP = vec2(bp.x, cPos.y + 0.14 * growth);
        float dMouth = abs(length(mouthP * vec2(0.95, 1.85)) - 0.11 * growth) - 0.018;
        // Smooth-min blend of cranial anatomy + ribbed torso spine
        float dSpine = abs(bp.x - (0.12 + 0.08 * sin(cPos.y * 14.0 - flow * 2.5)) * smoothstep(0.1, -0.65, cPos.y)) - 0.04;
        float dEntity = min(dHead, dSpine);

        // 4. Multi-Eyes & Sacred Rib Striations Across the Entity & Vault
        float entityShell = exp(-abs(dEntity) * 14.0) + 0.65 * smoothstep(0.08, -0.12, dHead);
        float anatomicalRibs = 0.5 + 0.5 * cos(dEntity * 48.0 - flow * 4.2 + kifsAccum * 2.4);
        float eyeGlow = exp(-max(0.0, dEye) * 32.0) + 1.35 * exp(-dPupil * dPupil * 900.0);
        float thirdEyeGlow = exp(-abs(dThirdEye) * 36.0) + 1.2 * exp(- dot(thirdEyeP, thirdEyeP) * 420.0);
        float mouthGlow = exp(-max(0.0, dMouth) * 42.0);

        // Peripheral Twin Column Elves flanking left & right in the hyperbolic colonnade
        vec2 sideElfP = vec2(abs(bp.x - 0.72), cPos.y - 0.04 * cos(uTime * 0.9));
        float dSideHead = length(sideElfP * vec2(1.35, 1.0)) - 0.26 * growth;
        float dSideEye = length(( abs(sideElfP) - vec2(0.09, 0.04) ) * vec2(1.0, 2.0)) - 0.045 * growth;
        float sideElfGlow = exp(-abs(dSideHead) * 18.0) + exp(-max(0.0, dSideEye) * 38.0);

        // Chromatic Alex Grey / DMT Jewel Palette Synthesis
        vec3 vaultCol = mix(uCol0.rgb, uCol2.rgb, 0.5 + 0.5 * vaultRings) * (0.28 + 0.32 * max(0.0, pillarWave));
        vec3 elfSkin = mix(uCol0.rgb, uCol1.rgb, anatomicalRibs) * entityShell * (0.65 + 0.45 * kifsAccum);
        vec3 jewelFacets = mix(uCol1.rgb, uCol2.rgb, fract(kifsAccum * 0.55 + uTime * 0.15)) * kifsAccum * 0.48;
        vec3 visionEyes = mix(uCol2.rgb, vec3(1.0, 0.97, 0.85), 0.65) * (eyeGlow + thirdEyeGlow * 1.25 + mouthGlow * 0.7 + sideElfGlow * 0.65);

        vec3 dmtCol = vaultCol + (elfSkin + jewelFacets + visionEyes) * (0.78 + 0.35 * uBass + 0.35 * uBeat);
        col = mix(col, dmtCol, clamp((0.76 + 0.22 * uBass) * bIntensity, 0.0, 0.96));
    }
    return col;
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
    // LAYER #1: Per-Pixel Smooth GPU Background Worlds (Modes 0..11)
    // =========================================================================
    if (uL1Enabled > 0.5) {
        int l1m = clamp(int(floor(uL1Mode + 0.5)), 0, 11);
        float l1Bright = clamp(1.0 - uL1Dim, 0.04, 1.0);
        float l1Spd = clamp(uL1Speed, 0.0, 2.5);
        float l1Den = clamp(uL1Density, 0.2, 2.5);
        float l1Dir = (abs(uL1Direction) < 0.05) ? sin(uTime * 0.6) : sign(uL1Direction);
        // state.l1Time already integrates dt * l1Speed * l1Dir on the engine side;
        // do not multiply uL1Time by l1Dir * l1Spd again or -1 ("Away") inverts to +1!
        float l1T = (abs(uL1Time) > 0.0001) ? uL1Time : (uTime * max(0.05, l1Spd) * l1Dir);
        vec2 q = pDrift;
        float rq = length(q);
        float aq = atan(q.y, q.x);

        if (l1m == 0) {
            // Mode 0: MilkDrop Liquid Feedback Warp (13:ShdWarp)
            vec2 w = q * (1.8 * sqrt(l1Den));
            for (int i = 0; i < 3; i++) {
                float fi = float(i) + 1.0;
                w += vec2(
                    sin(w.y * (2.6 * fi) + l1T * 1.1 + uBass * 1.4),
                    cos(w.x * (2.6 * fi) - l1T * 0.9 + uMid * 1.4)
                ) * (0.30 / fi);
            }
            float f1 = 0.5 + 0.5 * sin(w.x * 2.5 + w.y * 2.0 + l1T);
            float f2 = 0.5 + 0.5 * cos(length(w) * (3.5 * l1Den) - l1T * 1.4);
            float ridge = smoothstep(0.70, 0.98, sin(length(w) * (6.0 * l1Den) - l1T * 2.2));
            vec3 wCol = mix(uCol0.rgb, uCol1.rgb, f1);
            wCol = mix(wCol, uCol2.rgb, f2 * 0.72);
            col += (wCol * (0.30 + 0.32 * uBass) + uCol2.rgb * ridge * (0.28 + 0.30 * uBeat)) * l1Bright;
        } else if (l1m == 1) {
            // Mode 1: G-Force Polar FlowField (14:ShdSpiral)
            float spiralA = aq * floor(4.0 + 2.0 * l1Den) + log(max(0.04, rq)) * (6.5 * l1Den) - l1T * 2.4;
            float spiralB = aq * floor(3.0 + 2.0 * l1Den) - rq * (9.0 * l1Den) - l1T * 1.8;
            float s1 = smoothstep(0.35, 0.96, 0.5 + 0.5 * sin(spiralA + sin(rq * 6.0 - l1T) * (1.2 + uBass)));
            float s2 = smoothstep(0.45, 0.96, 0.5 + 0.5 * cos(spiralB));
            float coreFade = smoothstep(0.02, 0.16, rq);
            vec3 gCol = uCol0.rgb * s1 + uCol1.rgb * s2 + uCol2.rgb * (s1 * s2) * 1.25;
            col += gCol * coreFade * (0.36 + 0.34 * uBass + 0.22 * uBeat) * l1Bright;
        } else if (l1m == 2) {
            // Mode 2: Cthugha Rave Flame (15:ShdFlame)
            vec2 fp = vec2(p.x * (2.2 * sqrt(l1Den)), uv.y * 1.6);
            float n = sin(fp.x * 3.5 + l1T * 1.5) * 0.35
                    + sin(fp.x * 7.2 - l1T * 2.6 + uBass * 2.0) * 0.20
                    + cos((fp.x + fp.y) * (5.0 * l1Den) + l1T * 3.4) * 0.15;
            float flameH = (0.55 - uv.y * 0.55) + n * (0.45 + 0.35 * uBass);
            float flameCore = clamp(flameH, 0.0, 1.0);
            float tongues = smoothstep(0.45, 0.92, sin(fp.x * (9.0 * l1Den) + sin(uv.y * 8.0 + l1T * 4.5) * 1.6));
            vec3 fCol = mix(uCol0.rgb, uCol1.rgb, clamp(flameCore * 1.3, 0.0, 1.0));
            fCol = mix(fCol, uCol2.rgb, pow(flameCore, 2.2) * (0.65 + 0.35 * tongues));
            col += fCol * pow(flameCore, 1.35) * (0.44 + 0.38 * uBass + 0.22 * uBeat) * l1Bright;
        } else if (l1m == 3) {
            // Mode 3: Relativistic Starfield (16:ShdStars)
            vec3 starAcc = vec3(0.0);
            for (int layer = 0; layer < 3; layer++) {
                float fl = float(layer);
                float zFract = fract(fl * 0.333 + l1T * 0.28);
                float scale = mix(18.0 * l1Den, 3.2 * l1Den, zFract);
                vec2 sUV = rot2D(fl * 0.8 + l1T * 0.05) * q * scale;
                vec2 cell = floor(sUV);
                vec2 local = fract(sUV) - 0.5;
                vec2 h = hash2(cell + fl * 37.0);
                vec2 offset = (h - 0.5) * 0.55;
                float d = length(local - offset);
                float fade = smoothstep(0.0, 0.2, zFract) * smoothstep(1.0, 0.78, zFract);
                float spark = exp(-d * (26.0 - 10.0 * uBeat)) * fade;
                vec3 sCol = (layer == 0) ? uCol0.rgb : ((layer == 1) ? uCol1.rgb : uCol2.rgb);
                starAcc += mix(sCol, vec3(1.0), 0.45) * spark;
            }
            col += starAcc * (0.75 + 0.45 * uBass) * l1Bright;
        } else if (l1m == 4) {
            // Mode 4 (17:ShdDNA): Hybrid DNA Helix Intelligence — 3D Twisting Bioluminescent Double-Helix, Base-Pair Codon Rungs & Neural-Synaptic Lattice
            vec2 dp = rot2D(sin(l1T * 0.22) * 0.38) * q;
            float spineWave = sin(dp.y * 2.4 - l1T * 0.95) * 0.14 + cos(dp.y * 1.3 + l1T * 0.55) * 0.06;
            float hx = dp.x - spineWave;
            float pitch = (5.2 + 2.0 * l1Den);
            float helPhase = dp.y * pitch - l1T * 2.6;
            float amp = 0.24 + 0.05 * uBass + 0.03 * sin(dp.y * 3.0 + l1T);

            // Primary 3D Double-Helix Backbones (Strand A & Strand B with front/back Z-depth sorting)
            float xA = sin(helPhase) * amp;
            float zA = cos(helPhase);
            float xB = -xA;
            float zB = -zA;
            float dA = abs(hx - xA);
            float dB = abs(hx - xB);
            float strandA = exp(-dA * (38.0 - 10.0 * zA)) * (0.65 + 0.35 * zA);
            float strandB = exp(-dB * (38.0 - 10.0 * zB)) * (0.65 + 0.35 * zB);
            float strandCore = exp(-min(dA, dB) * 95.0);

            // Base-Pair Hydrogen-Bond Rungs & Pulsing Codon Intelligence Nodes
            float rungFreq = pitch * 2.0;
            float rungCell = floor(dp.y * rungFreq / PI);
            float rungLocal = abs(fract(dp.y * rungFreq / PI) - 0.5) * 2.0;
            float spanX = max(0.015, abs(xA));
            float inSpan = smoothstep(spanX + 0.02, spanX - 0.01, abs(hx));
            float rungLine = exp(-rungLocal * 12.0) * inSpan;
            float codonPulse = 0.5 + 0.5 * sin(rungCell * 1.7 + l1T * 4.5 + uBass * 3.0);
            float codonNode = exp(-length(vec2(hx - sin(rungCell * 2.3) * spanX * 0.45, (fract(dp.y * rungFreq / PI) - 0.5) * 0.18)) * 42.0)
                            * inSpan * (0.65 + 0.65 * codonPulse + 0.45 * uBeat);

            // Secondary Flanking Evolutionary Helices & Neural-Synaptic Intelligence Filaments
            float flankHelix = 0.0;
            for (int fh = -1; fh <= 1; fh += 2) {
                float fSign = float(fh);
                float fx = dp.x - fSign * 0.58 + sin(dp.y * 3.2 + l1T * 1.2 * fSign) * 0.08;
                float fPh = dp.y * (pitch * 1.25) + l1T * 1.9 * fSign;
                float fAmp = 0.09 + 0.02 * uMid;
                float fStrand = exp(-abs(fx - sin(fPh) * fAmp) * 52.0) + exp(-abs(fx + sin(fPh) * fAmp) * 52.0);
                flankHelix += fStrand * 0.42;
            }
            vec2 synUV = rot2D(0.45) * dp * (3.8 * sqrt(l1Den)) + vec2(sin(l1T * 0.4), -l1T * 0.55);
            vec2 synId = floor(synUV);
            vec2 synF = fract(synUV) - 0.5;
            vec2 hSyn = hash2(synId);
            vec2 synPos = (hSyn - 0.5) * 0.62 * sin(l1T * 1.4 + hSyn.x * TAU);
            float synDist = length(synF - synPos);
            float synapseNode = exp(-synDist * 24.0) * (0.5 + 0.5 * sin(l1T * 5.0 + hSyn.y * TAU));
            float axonWeb = exp(-abs(synF.x * cos(hSyn.x * PI) + synF.y * sin(hSyn.x * PI)) * 28.0) * exp(-length(synF) * 2.5) * 0.38;

            vec3 dnaCol = uCol0.rgb * (strandA * 1.15 + flankHelix * 0.75)
                        + uCol1.rgb * (strandB * 1.15 + axonWeb * (0.75 + 0.45 * uMid))
                        + mix(uCol2.rgb, vec3(0.88, 1.0, 0.96), 0.45) * (rungLine * (0.72 + 0.40 * codonPulse) + codonNode * 1.25 + synapseNode * (0.85 + 0.45 * uHigh))
                        + vec3(0.95, 0.99, 1.0) * strandCore * (0.70 + 0.40 * uBeat);
            col += dnaCol * (0.78 + uBass * 0.34) * l1Bright;
        } else if (l1m == 5) {
            // Mode 5 (18:ShdTrench): ShdTrench: True 3D Star Wars Death Star Trench Run — Vertical Sidewalls, Trench Floor, Open Starry Sky Slot, Catwalk Girders & Exhaust Port Torpedo Bay
            float rollAng5 = sin(l1T * 0.62) * 0.24 + cos(l1T * 0.27) * 0.10;
            vec2 camWeave = vec2(sin(l1T * 0.72) * 0.08, cos(l1T * 0.54) * 0.04 - 0.03);
            vec2 tp0 = rot2D(rollAng5) * (p - camWeave);

            // True U-channel Death Star Trench geometry:
            //   - Left & right vertical sidewalls at |x| = trenchHalfW (0.34)
            //   - Trench floor at y = +trenchFloorY (0.28)
            //   - Open starry space slot above y = -trenchTopY (-0.26)
            float trenchHalfW = 0.34;
            float trenchFloorY = 0.28;
            float trenchTopY = -0.26;

            float wallRayDist = abs(tp0.x) / trenchHalfW;
            float floorRayDist = (tp0.y > 0.0) ? (tp0.y / trenchFloorY) : 0.0;
            bool isOpenSky = (tp0.y < 0.0) && (abs(tp0.x) < (-tp0.y / abs(trenchTopY)) * trenchHalfW);
            bool hitFloor = (!isOpenSky) && (floorRayDist > wallRayDist);

            float surfaceHit = hitFloor ? floorRayDist : wallRayDist;
            float zTrench = 0.52 / max(0.024, surfaceHit);
            float wz = zTrench + l1T * 6.4;

            vec3 trenchCol = vec3(0.0);

            if (isOpenSky) {
                // Open space above the trench rim: starfield + upper trench lip rails receding to the vanishing point
                float skyH = fract(sin(dot(floor((tp0 + vec2(0.0, l1T * 0.02)) * 95.0), vec2(127.1, 311.7))) * 43758.5453);
                float stars = smoothstep(0.985, 0.999, skyH) * (0.65 + 0.35 * sin(uTime * 4.0 + skyH * 40.0));
                float rimRatio = abs(tp0.x) / max(0.01, (-tp0.y / abs(trenchTopY)) * trenchHalfW);
                float upperLip = smoothstep(0.86, 0.995, rimRatio) * exp(tp0.y * 2.5);
                trenchCol += vec3(0.75, 0.88, 1.0) * stars + mix(uCol0.rgb, vec3(1.0, 0.85, 0.25), 0.45) * upperLip * 1.15;
            } else {
                float fade = smoothstep(0.025, 0.11, surfaceHit) * exp(-zTrench * 0.075);
                float bayRibs = smoothstep(0.86, 0.99, cos(wz * (1.35 + 0.45 * l1Den) * PI));
                float subRibs = smoothstep(0.92, 0.995, cos(wz * 5.4 * PI)) * 0.45;

                if (hitFloor) {
                    // Trench Floor: longitudinal trench guide tracks, exhaust conduits & recessed floor bays
                    float floorX = tp0.x / max(0.02, floorRayDist);
                    float trackRails = smoothstep(0.90, 0.995, cos(floorX * 28.0));
                    float centreConduit = exp(-abs(floorX) * 28.0) * (0.55 + 0.45 * sin(wz * 2.5 - uTime * 8.0));
                    float floorGreeble = step(0.35, sin(wz * 3.6 + floor(floorX * 14.0) * 2.1)) * 0.28;
                    trenchCol += mix(uCol0.rgb, vec3(0.35, 0.75, 1.0), 0.35) * (bayRibs * 0.95 + subRibs + trackRails * 0.82 + floorGreeble) * fade;
                    trenchCol += mix(uCol1.rgb, vec3(1.0, 0.45, 0.15), 0.5) * centreConduit * (0.95 + uBass * 0.65) * fade;
                } else {
                    // Left & Right Vertical Trench Sidewalls: horizontal armour strakes, recessed reactor bays & turbolaser ports
                    float wallY = tp0.y / max(0.02, wallRayDist);
                    float horizStrakes = smoothstep(0.88, 0.994, cos(wallY * 26.0));
                    float topParapet = exp(-abs(wallY - trenchTopY) * 24.0) * 1.25;
                    float floorCorner = exp(-abs(wallY - trenchFloorY) * 24.0) * 1.10;
                    float bayHash = fract(sin(floor(wz * 1.35) * 127.1 + floor(wallY * 8.0) * 311.7 + sign(tp0.x) * 71.3) * 43758.5453);
                    float reactorPanel = step(0.42, bayHash) * step(0.18, fract(wz * 1.35)) * (0.30 + 0.70 * sin(uTime * 5.5 + bayHash * TAU));
                    trenchCol += mix(uCol0.rgb, uCol2.rgb, 0.30) * (bayRibs + subRibs + horizStrakes * 0.78 + topParapet + floorCorner) * fade;
                    trenchCol += mix(uCol1.rgb, vec3(1.0, 0.72, 0.18), 0.45) * reactorPanel * 0.38 * fade;
                }
            }

            // Over-and-under 3D Trench Catwalk Girders & Defense Struts flying past the camera
            float catwalkBarriers = 0.0;
            float laserTurretAcc = 0.0;
            for (int cb = 0; cb < 5; cb++) {
                float cbFrac = fract(float(cb) * 0.20 - l1T * 0.44);
                float zGate = mix(0.40, 12.5, cbFrac);
                float gFade = smoothstep(12.5, 2.0, zGate) * smoothstep(0.40, 0.78, zGate);
                float gHalfW = trenchHalfW * (0.52 / zGate);
                float gFloorY = trenchFloorY * (0.52 / zGate);
                float gTopY = trenchTopY * (0.52 / zGate);
                float inSpanX = step(abs(tp0.x), gHalfW * 1.04);
                float inSpanY = step(gTopY * 1.04, tp0.y) * step(tp0.y, gFloorY * 1.04);

                // Alternate high/low catwalk beams (classic Atari Star Wars trench obstacles)
                float beamY = ((cb & 1) == 0) ? mix(gTopY, gFloorY, 0.22) : mix(gTopY, gFloorY, 0.74);
                float crossBeam = exp(-abs(tp0.y - beamY) * (95.0 + zGate * 7.0)) * inSpanX;
                float sidePillars = (exp(-abs(abs(tp0.x) - gHalfW) * (95.0 + zGate * 7.0))) * inSpanY;
                float floorTie = exp(-abs(tp0.y - gFloorY) * (90.0 + zGate * 6.0)) * inSpanX;
                catwalkBarriers += (crossBeam * 1.25 + sidePillars + floorTie * 0.85) * gFade;
                laserTurretAcc += exp(-length(vec2(abs(tp0.x) - gHalfW * 0.88, tp0.y - gTopY * 0.92)) * (65.0 + zGate * 5.0)) * gFade;
            }

            // End-of-Trench Thermal Exhaust Port Torpedo Bay & Twin Proton Torpedoes diving down the trench
            float portPulse = 0.65 + 0.35 * sin(l1T * 4.5);
            vec2 portCenter = vec2(0.0, 0.05);
            vec2 portP = tp0 - portCenter;
            float portBox = max(abs(portP.x) * 1.15, abs(portP.y) * 1.45);
            float exhaustPort = (exp(-abs(portBox - 0.055) * 95.0) + exp(-abs(portBox - 0.028) * 120.0) * portPulse)
                              * (0.75 + uBeat * 0.65);
            float torpedoT = fract(l1T * 0.65);
            float torpZ = mix(0.28, 0.04, torpedoT);
            vec2 torpL = portCenter + vec2(-0.42 * torpZ, 0.32 * torpZ);
            vec2 torpR = portCenter + vec2( 0.42 * torpZ, 0.32 * torpZ);
            float protonTorpedoes = (exp(-length(tp0 - torpL) * 75.0) + exp(-length(tp0 - torpR) * 75.0)) * (1.0 + uBeat * 0.8);

            // Banking TIE Advanced + Wingmen weaving through the trench
            float tieScale = 0.56 + 0.34 * fract(l1T * 0.40);
            vec2 tieCenter = vec2(sin(l1T * 1.35) * 0.12, cos(l1T * 0.95) * 0.06);
            vec2 tieP = rot2D(cos(l1T * 1.35) * 0.32) * (tp0 - tieCenter) / max(0.35, tieScale);
            float tiePod = exp(-abs(length(tieP) - 0.025) * 165.0) + exp(-length(tieP) * 58.0) * 0.65;
            float tieStrut = exp(-abs(tieP.y) * 185.0) * step(abs(tieP.x), 0.066);
            float tieWings = exp(-abs(abs(tieP.x) - 0.066) * 155.0) * step(abs(tieP.y) + abs(abs(tieP.x) - 0.066) * 0.38, 0.058);
            float tieShape = clamp(tiePod + tieStrut + tieWings, 0.0, 1.35);

            // Rebel Red/Green Quad Laser bolts firing down the trench walls
            float quadLaser = exp(-abs(abs(tp0.x) - abs(tp0.y - 0.04) * 1.05) * 110.0)
                            * smoothstep(0.65, 0.99, sin(wz * 3.2 - uTime * 15.0)) * step(-0.18, tp0.y);

            trenchCol += mix(vec3(1.0, 0.88, 0.22), uCol2.rgb, 0.38) * catwalkBarriers * (0.90 + uBass * 0.42)
                       + vec3(0.20, 1.0, 0.35) * laserTurretAcc * (0.95 + uBeat * 0.55)
                       + vec3(1.0, 0.28, 0.12) * exhaustPort * 1.15
                       + vec3(1.0, 0.55, 0.95) * protonTorpedoes * 1.10
                       + vec3(0.45, 0.94, 1.0) * tieShape * (0.95 + uBeat * 0.45)
                       + mix(vec3(1.0, 0.16, 0.12), vec3(0.16, 1.0, 0.32), step(0.0, tp0.x)) * quadLaser * (0.95 + uBeat * 0.45);
            col += trenchCol * (0.82 + uBass * 0.34) * l1Bright;
        } else if (l1m == 6) {
            // Mode 6: BlackHole — Multi-Octave Relativistic Spiral Accretion Vortex, Keplerian Shear & Gravitational Lensing Arch
            float ehR = 0.165 + uBass * 0.028;
            float tiltAng = 0.26 + 0.08 * sin(uTime * 0.28);
            vec2 dp = rot2D(tiltAng) * q;
            // Relativistic gravitational lensing arch bending over & under the Schwarzschild shadow
            float squashY = mix(1.15, 2.55, smoothstep(ehR * 0.85, ehR * 3.4, rq));
            vec2 discCoord = vec2(dp.x, dp.y * squashY);
            float rDisc = length(discCoord);
            float ang = atan(discCoord.y, discCoord.x);

            // Differential Keplerian angular velocity: inner plasma whips around the event horizon dramatically faster
            float keplerTwist = (3.95 + l1Den * 0.95) / (rDisc + 0.052) - log(max(0.025, rDisc)) * 8.5 + l1T * (2.8 + uBass * 0.65);
            float arm3 = pow(0.5 + 0.5 * sin(ang * 3.0 + keplerTwist * 1.45), 2.1);
            float arm5 = pow(0.5 + 0.5 * cos(ang * 5.0 + keplerTwist * 2.10 - sin(rDisc * 16.0 - l1T * 3.6) * 1.25), 2.6);
            float arm8 = pow(0.5 + 0.5 * sin(ang * 8.0 - keplerTwist * 0.95 + cos(rDisc * 24.0 + l1T * 4.8) * 0.95), 3.2);
            float infallingWave = 0.55 + 0.45 * sin(log(max(0.025, rDisc)) * 11.0 + l1T * 4.4 + ang * 2.0);
            float swirl = clamp((arm3 * 0.52 + arm5 * 0.38 + arm8 * 0.30) * infallingWave, 0.0, 1.35);

            float discBand = smoothstep(ehR * 0.82, ehR * 1.22, rDisc) * exp(-max(0.0, rDisc - ehR * 1.12) * 2.45);
            // Secondary lensed Einstein halo arch wrapping over the top and bottom of the black hole shadow
            float einsteinArch = exp(-abs(rq - ehR * (1.08 + 0.14 * abs(dp.y) / max(0.06, rq))) * 24.0) * (0.65 + 0.35 * sin(ang * 4.0 + keplerTwist));
            float doppler = 0.62 + 0.52 * clamp(-dp.x / max(0.05, rDisc), -0.8, 1.0);
            float photonRing = exp(-abs(rq - ehR) * 42.0) * (1.15 + uBeat * 0.55 + uBass * 0.45);

            vec3 innerPlasma = mix(uCol2.rgb, vec3(1.0, 0.96, 0.86), 0.55);
            vec3 swirlTint = mix(uCol0.rgb, uCol1.rgb, clamp(arm5 * 0.65 + (rDisc - ehR) * 1.4, 0.0, 1.0));
            vec3 discCol = mix(innerPlasma, swirlTint, smoothstep(ehR * 1.0, ehR * 2.8, rDisc));
            vec3 accCol = discCol * (0.28 + 0.95 * swirl) * discBand * doppler * 1.32
                        + mix(uCol1.rgb, innerPlasma, 0.55) * einsteinArch * 0.78
                        + innerPlasma * photonRing;
            col += accCol * (0.82 + uBass * 0.34) * l1Bright;
            col *= smoothstep(ehR * 0.76, ehR * 0.98, rq);
        } else if (l1m == 7) {
            // Mode 7 (20:TowerRun): Swooping & Rotational Banking 3D Surface Grid with Separated Gun Turrets Firing Laser Bolts (Zero Red Ground Lines)
            vec3 towerYellow = vec3(1.0, 1.0, 0.08);
            vec3 towerGreen = vec3(0.08, 1.0, 0.12);
            vec3 towerRed = vec3(1.0, 0.14, 0.08);
            vec3 gridCyan = vec3(0.10, 0.92, 1.0);
            vec3 gridBlue = vec3(0.06, 0.42, 1.0);

            float gridScaleX = 2.4 * max(0.5, l1Den);
            float gridScaleZ = 2.2 * max(0.5, l1Den);
            float scrollGZ = l1T * 4.6;
            float rowSpacingGZ = 3.2; // Well-separated longitudinal spacing between turret rows
            float rowPhase = scrollGZ / rowSpacingGZ;
            float curRowIdx = floor(rowPhase);
            float uRow = fract(rowPhase);

            // Varied, non-repeating multi-lane flight path (L -> L -> Centre -> R -> Far-R -> Centre-L etc.)
            // Interpolated with a C1-continuous Catmull-Rom spline across 4 consecutive row waypoints
            // so velocity and banking are 100% smooth with zero jerky stops or repetitive L-R-L-R oscillation!
            float wM1 = (hash2(vec2(curRowIdx - 1.0, 7.1)).x - 0.5) * 5.2 + sin((curRowIdx - 1.0) * 1.73) * 1.35;
            float w0  = (hash2(vec2(curRowIdx,       7.1)).x - 0.5) * 5.2 + sin( curRowIdx        * 1.73) * 1.35;
            float wP1 = (hash2(vec2(curRowIdx + 1.0, 7.1)).x - 0.5) * 5.2 + sin((curRowIdx + 1.0) * 1.73) * 1.35;
            float wP2 = (hash2(vec2(curRowIdx + 2.0, 7.1)).x - 0.5) * 5.2 + sin((curRowIdx + 2.0) * 1.73) * 1.35;

            float u2 = uRow * uRow;
            float u3 = u2 * uRow;
            // Catmull-Rom position & analytical first derivative (lateral velocity)
            float camPanX = 0.5 * (
                (2.0 * w0) +
                (-wM1 + wP1) * uRow +
                (2.0 * wM1 - 5.0 * w0 + 4.0 * wP1 - wP2) * u2 +
                (-wM1 + 3.0 * w0 - 3.0 * wP1 + wP2) * u3
            );
            float lateralVel = 0.5 * (
                (-wM1 + wP1) +
                (2.0 * wM1 - 5.0 * w0 + 4.0 * wP1 - wP2) * (2.0 * uRow) +
                (-wM1 + 3.0 * w0 - 3.0 * wP1 + wP2) * (3.0 * u2)
            );

            // Gentle, fluid aerodynamic banking roll (capped at ~7 degrees so it never whips or feels jerky)
            float bankAng = clamp(-lateralVel * 0.045, -0.12, 0.12) + sin(l1T * 0.42) * 0.025;
            vec2 bp = rot2D(bankAng) * p;
            float swoopPitch = sin(l1T * 0.48) * 0.038 + cos(l1T * 0.29) * 0.018;
            float horizonOffset = -0.04 + swoopPitch;
            float hy = bp.y - horizonOffset;

            // Horizon glow + upper sky vector starfield (strictly cyan/blue/gold, zero red ground lines)
            float hGlow = exp(-abs(hy) * 38.0) * 0.78;
            col += mix(gridCyan, uCol0.rgb, 0.28) * hGlow * l1Bright;
            if (hy < 0.0) {
                vec2 skyCell = floor((bp + vec2(camPanX * 0.08, 0.0)) * 32.0);
                float starH = hash2(skyCell + 19.3).x;
                if (starH > 0.94) {
                    vec2 starPos = (skyCell + 0.5 + 0.32 * vec2(sin(starH * 43.0), cos(starH * 29.0))) / 32.0 - vec2(camPanX * 0.08, 0.0);
                    float dStar = length(bp - starPos);
                    col += mix(vec3(0.75, 0.95, 1.0), towerYellow, 0.35) * exp(-dStar * 190.0) * (0.65 + 0.35 * sin(uTime * 5.0 + starH * 40.0)) * l1Bright;
                }
            }

            if (hy > 0.002) {
                float z = 0.26 / max(0.004, hy);
                float gx = bp.x * z * gridScaleX + camPanX;
                float gz = z * gridScaleZ + scrollGZ;

                // Crisp cyan/blue ground grid cells (strictly zero red lines on the ground plane)
                float minorX = smoothstep(0.945, 0.996, abs(cos(gx * PI)));
                float minorZ = smoothstep(0.940, 0.995, abs(cos(gz * PI)));
                float majorX = smoothstep(0.978, 0.999, abs(cos(gx * PI * 0.5)));
                float majorZ = smoothstep(0.975, 0.999, abs(cos(gz * PI * 0.5)));
                float minorGrid = max(minorX, minorZ);
                float majorGrid = max(majorX, majorZ);
                float nodePulse = minorX * minorZ * (1.2 + 0.6 * uBeat);
                float fade = smoothstep(0.002, 0.065, hy) * exp(-z * 0.058);

                vec3 gridCol = gridBlue * minorGrid * 0.68
                             + gridCyan * majorGrid * 1.15
                             + mix(gridCyan, towerYellow, 0.45) * nodePulse * 0.95;
                col += gridCol * fade * (0.84 + uBass * 0.32) * l1Bright;
            }

            // Separated 3D Armoured Gun Turrets with Articulated Twin Laser Cannons & Tracer Fire locked to integer ground grid intersections
            vec3 towerAcc = vec3(0.0);
            float baseGridRow = floor(scrollGZ / rowSpacingGZ);

            for (int rStep = 1; rStep <= 5; rStep++) {
                float rowIdx = baseGridRow + float(rStep);
                float rowWorldGZ = rowIdx * rowSpacingGZ;
                float zF = (rowWorldGZ - scrollGZ) / gridScaleZ;
                if (zF < 0.26 || zF > 8.2) continue;

                float hyF = 0.26 / zF;
                float baseYF = horizonOffset + hyF;
                float scaleXF = 1.0 / (gridScaleX * zF);
                float distFade = smoothstep(8.2, 1.4, zF) * smoothstep(0.26, 0.48, zF);
                float lw = 215.0 + zF * 24.0;

                // Exact spline waypoint where the camera passes through this row (uRow == 0 at rowIdx),
                // ensuring turrets are always placed outside our flight corridor with varied asymmetric formations!
                float rowPassX = (hash2(vec2(rowIdx, 7.1)).x - 0.5) * 5.2 + sin(rowIdx * 1.73) * 1.35;
                vec2 rowRand = hash2(vec2(rowIdx, 19.7));
                for (int tSlot = 0; tSlot < 2; tSlot++) {
                    // Place one turret to the left of our pass-through lane and one to the right,
                    // snapped to integer grid cells with asymmetric spacing so formations look organic and never collide with the camera
                    float clearGapL = 1.6 + floor(rowRand.x * 2.0); // 1.6 to 2.6 cells left of pass-through
                    float clearGapR = 1.2 + floor(rowRand.y * 2.0); // 1.2 to 2.2 cells right of pass-through
                    float gx0 = (tSlot == 0)
                        ? floor(rowPassX - clearGapL)
                        : ceil(rowPassX + clearGapR);
                    float gx1 = gx0 + 1.0;

                    float xBaseL = (gx0 - camPanX) * scaleXF;
                    float xBaseR = (gx1 - camPanX) * scaleXF;
                    float xMid = 0.5 * (xBaseL + xBaseR);
                    float cellW = abs(xBaseR - xBaseL);
                    float totalH = hyF * (1.72 + 0.20 * uBass);

                    // Turret proportions:
                    // Stage 1 (0..45%): Yellow armoured bunker pedestal & X-braced base ring
                    // Stage 2 (45%..78%): Green rotating gun-house turret dome & trunnion cheeks
                    // Stage 3 (78%..100%): Red rangefinder cupola + twin long articulated gun barrels & muzzle flashes
                    float y0 = baseYF;
                    float y1 = baseYF - totalH * 0.45;
                    float y2 = baseYF - totalH * 0.78;
                    float y3 = baseYF - totalH;
                    float yCupola = y3 - totalH * 0.12;

                    // Stage 1: Yellow (#FFFF11) armoured turret pedestal anchored at exact integer grid corners
                    vec2 bL = vec2(xBaseL, y0);
                    vec2 bR = vec2(xBaseR, y0);
                    vec2 s1L = vec2(xMid - cellW * 0.38, y1);
                    vec2 s1R = vec2(xMid + cellW * 0.38, y1);
                    vec2 s1MidL = mix(bL, s1L, 0.52);
                    vec2 s1MidR = mix(bR, s1R, 0.52);

                    float stage1Yellow = segGlow(bp, bL, bR, lw)
                                       + segGlow(bp, bL, s1L, lw)
                                       + segGlow(bp, bR, s1R, lw)
                                       + segGlow(bp, s1L, s1R, lw)
                                       + segGlow(bp, s1MidL, s1MidR, lw * 0.94)
                                       + segGlow(bp, bL, s1R, lw * 0.88)
                                       + segGlow(bp, bR, s1L, lw * 0.88);

                    // Stage 2: Green (#11FF11) swivelling octagonal gun-house turret dome & cannon trunnion mounts
                    float aimSign = sign(-xMid); // Turret tracks towards the player's evasive flight path!
                    float aimShift = clamp(-xMid * 0.22, -cellW * 0.18, cellW * 0.18);
                    vec2 gJawL = vec2(xMid - cellW * 0.52 + aimShift * 0.5, mix(y1, y2, 0.45));
                    vec2 gJawR = vec2(xMid + cellW * 0.52 + aimShift * 0.5, mix(y1, y2, 0.45));
                    vec2 s2L = vec2(xMid - cellW * 0.36 + aimShift, y2);
                    vec2 s2R = vec2(xMid + cellW * 0.36 + aimShift, y2);
                    vec2 visorL = vec2(xMid - cellW * 0.24 + aimShift, mix(y1, y2, 0.62));
                    vec2 visorR = vec2(xMid + cellW * 0.24 + aimShift, mix(y1, y2, 0.62));

                    float stage2Green = segGlow(bp, s1L, gJawL, lw)
                                      + segGlow(bp, s1R, gJawR, lw)
                                      + segGlow(bp, gJawL, s2L, lw)
                                      + segGlow(bp, gJawR, s2R, lw)
                                      + segGlow(bp, s2L, s2R, lw)
                                      + segGlow(bp, gJawL, gJawR, lw * 0.92)
                                      + segGlow(bp, visorL, visorR, lw * 1.05);

                    // Stage 3: Red (#FF2211) rangefinder cupola + Twin 3D Forward-Aiming Gun Barrels & Incoming 3D Perspective Laser Bolts!
                    vec2 cTopL = vec2(xMid - cellW * 0.22 + aimShift, y3);
                    vec2 cTopR = vec2(xMid + cellW * 0.22 + aimShift, y3);
                    vec2 cPeak = vec2(xMid + aimShift * 1.1, yCupola);

                    // Gun breeches mounted on the Red Stage 3 gun head at depth zF, with muzzles projecting FORWARD in 3D (-z towards camera!)
                    // Driven by strictly monotonic forward time uTime so bolts ALWAYS fire out of the muzzles towards the camera
                    float fireCycle = fract(uTime * 1.45 + rowIdx * 0.37 + float(tSlot) * 0.53);
                    float recoil = exp(-fireCycle * 8.0) * 0.06;
                    float gunHeadRatio = (1.72 + 0.20 * uBass) * 0.85 - 1.0; // ~0.50 above camera horizon
                    vec2 breechL = vec2(xMid - cellW * 0.26 + aimShift, horizonOffset - gunHeadRatio * hyF);
                    vec2 breechR = vec2(xMid + cellW * 0.26 + aimShift, horizonOffset - gunHeadRatio * hyF);

                    // True 3D perspective projection for the gun muzzles (closer to the camera at zMuzzle < zF)
                    // and incoming laser bolts/missiles flying from zMuzzle -> zNear (0.18) past the player's canopy!
                    float zMuzzle = max(0.22, zF - (0.30 - recoil));
                    float scaleXMuz = 1.0 / (gridScaleX * zMuzzle);
                    float hyMuz = 0.26 / zMuzzle;
                    float gxTurret = gx0 + 0.5;
                    float aimTowardPlayer = clamp(camPanX - gxTurret, -2.2, 2.2) * 0.16;
                    float gxMuzL = gxTurret - 0.24 + aimTowardPlayer;
                    float gxMuzR = gxTurret + 0.24 + aimTowardPlayer;
                    float yMuz = horizonOffset - gunHeadRatio * hyMuz;
                    vec2 muzzleL = vec2((gxMuzL - camPanX) * scaleXMuz, yMuz);
                    vec2 muzzleR = vec2((gxMuzR - camPanX) * scaleXMuz, yMuz);
                    vec2 railOffset = vec2(0.0, -totalH * 0.048);

                    float stage3Red = segGlow(bp, s2L, cTopL, lw)
                                    + segGlow(bp, s2R, cTopR, lw)
                                    + segGlow(bp, cTopL, cTopR, lw)
                                    + segGlow(bp, cTopL, cPeak, lw * 0.92)
                                    + segGlow(bp, cTopR, cPeak, lw * 0.92)
                                    // Twin heavy 3D gun barrels projecting forward towards the camera
                                    + segGlow(bp, breechL, muzzleL, lw * 1.15) * 1.25
                                    + segGlow(bp, breechL + railOffset, muzzleL + railOffset, lw * 1.05)
                                    + segGlow(bp, muzzleL, muzzleL + railOffset, lw)
                                    + segGlow(bp, breechR, muzzleR, lw * 1.15) * 1.25
                                    + segGlow(bp, breechR + railOffset, muzzleR + railOffset, lw * 1.05)
                                    + segGlow(bp, muzzleR, muzzleR + railOffset, lw);

                    // Incoming 3D Laser Bolts / Missiles travelling FORWARD from the turret muzzles (zMuzzle)
                    // towards the foreground camera canopy (zNear = 0.18) as we fly forward!
                    float laserBolts = 0.0;
                    if (zF > 0.48) {
                        float zNear = 0.18;
                        float s0 = fireCycle;
                        float s1 = min(1.0, fireCycle + 0.16);
                        float zB0 = mix(zMuzzle, zNear, s0);
                        float zB1 = mix(zMuzzle, zNear, s1);
                        float scX0 = 1.0 / (gridScaleX * zB0);
                        float scX1 = 1.0 / (gridScaleX * zB1);
                        float hyB0 = 0.26 / zB0;
                        float hyB1 = 0.26 / zB1;
                        float yB0 = horizonOffset - mix(gunHeadRatio, gunHeadRatio * 0.84, s0) * hyB0;
                        float yB1 = horizonOffset - mix(gunHeadRatio, gunHeadRatio * 0.84, s1) * hyB1;
                        float gxB0L = gxMuzL + aimTowardPlayer * (s0 * 1.35);
                        float gxB1L = gxMuzL + aimTowardPlayer * (s1 * 1.35);
                        float gxB0R = gxMuzR + aimTowardPlayer * (s0 * 1.35);
                        float gxB1R = gxMuzR + aimTowardPlayer * (s1 * 1.35);

                        vec2 boltL0 = vec2((gxB0L - camPanX) * scX0, yB0);
                        vec2 boltL1 = vec2((gxB1L - camPanX) * scX1, yB1);
                        vec2 boltR0 = vec2((gxB0R - camPanX) * scX0, yB0);
                        vec2 boltR1 = vec2((gxB1R - camPanX) * scX1, yB1);
                        float boltFade = (1.0 - smoothstep(0.82, 1.0, s0));
                        laserBolts = (segGlow(bp, boltL0, boltL1, lw * 0.82) + segGlow(bp, boltR0, boltR1, lw * 0.82))
                                   * boltFade * (1.40 + 0.65 * uBeat);
                    }
                    float muzzleFlash = (exp(-length(bp - muzzleL) * (lw * 0.85)) + exp(-length(bp - muzzleR) * (lw * 0.85)))
                                      * exp(-fireCycle * 6.0) * 1.6;

                    vec3 tCol = towerYellow * clamp(stage1Yellow, 0.0, 2.4)
                              + towerGreen  * clamp(stage2Green, 0.0, 2.2) * (1.05 + 0.30 * uMid)
                              + towerRed    * clamp(stage3Red + laserBolts, 0.0, 2.8) * (1.10 + 0.45 * uBeat)
                              + vec3(1.0, 0.96, 0.75) * muzzleFlash;
                    towerAcc += tCol * distFade;
                }
            }
            col += towerAcc * (0.90 + uBass * 0.32) * l1Bright;
        } else if (l1m == 8) {
            // Mode 8 (21:ShdOrrery): Shader Dyson Hyper-Orrery & Ferrofluid Singularity — 3D Raymarched Morphing Star-Crystal, Precessing Gyroscope Gimbal Rings & Plasma Filaments
            vec2 op = q;
            float rO = length(op);
            float aO = atan(op.y, op.x);

            // 1. 3D Raymarched Morphing Ferrofluid Star-Crystal Singularity at the Core
            vec3 ro = vec3(0.0, 0.0, 2.35);
            vec3 rd = normalize(vec3(op, -1.55));
            float tRay = 0.0;
            float hitGlow = 0.0;
            float minDist = 10.0;
            vec3 hitPos = vec3(0.0);
            for (int stp = 0; stp < 22; stp++) {
                vec3 pos = ro + rd * tRay;
                // 3-axis rotation of the harmonic ferrofluid polyhedron
                pos.xz = rot2D(l1T * 0.62) * pos.xz;
                pos.yz = rot2D(l1T * 0.44 + 0.5) * pos.yz;
                float r3 = length(pos);
                // Harmonic octahedral + ferrofluid spike displacement driven by bass/mid/beat
                float oct = (abs(pos.x) + abs(pos.y) + abs(pos.z)) * 0.577;
                float spikes = sin(pos.x * (7.0 + 2.0 * l1Den) + l1T * 2.2)
                             * sin(pos.y * (7.0 + 2.0 * l1Den) - l1T * 1.9)
                             * sin(pos.z * (7.0 + 2.0 * l1Den) + l1T * 1.5);
                float coreR = 0.38 + 0.08 * uBass + 0.06 * uBeat;
                float dCrystal = mix(r3, oct, 0.55) - coreR - spikes * (0.085 + 0.075 * uBass);
                minDist = min(minDist, dCrystal);
                hitGlow += exp(-max(0.0, dCrystal) * 14.0) * 0.055;
                if (dCrystal < 0.008 || tRay > 3.6) {
                    hitPos = pos;
                    break;
                }
                tRay += dCrystal * 0.68;
            }
            vec3 coreCol = vec3(0.0);
            if (minDist < 0.015) {
                vec3 normC = normalize(hitPos + vec3(0.0001));
                float fresnel = pow(1.0 - abs(dot(normC, rd)), 2.2);
                float irid = 0.5 + 0.5 * sin(dot(normC, vec3(3.5, 4.2, 2.8)) * (2.0 + uBass) + l1T * 2.5);
                coreCol = mix(uCol0.rgb, uCol1.rgb, irid) * (0.65 + 0.55 * fresnel)
                        + mix(uCol2.rgb, vec3(1.0), 0.55) * pow(fresnel, 1.8) * (0.95 + 0.45 * uBeat);
            }
            coreCol += mix(uCol0.rgb, uCol2.rgb, 0.5 + 0.5 * sin(rO * 8.0 - l1T * 2.0)) * hitGlow * 0.85;

            // 2. Three Interlocking 3D Precessing Dyson Gyroscope Gimbal Rings & Orbital Runes
            vec3 gimbalCol = vec3(0.0);
            int ringTotal = int(clamp(floor(2.0 + l1Den * 1.5), 2.0, 5.0));
            for (int gi = 0; gi < 5; gi++) {
                if (gi >= ringTotal) break;
                float fgi = float(gi);
                float ringRad = 0.48 + fgi * 0.17 + 0.03 * uBass;
                float tiltA = l1T * (0.52 - fgi * 0.11) * (mod(fgi, 2.0) < 0.5 ? 1.0 : -1.0) + fgi * 1.1;
                float pitchB = 1.35 + 1.45 * sin(l1T * 0.37 + fgi * 1.3);
                vec2 gp = rot2D(tiltA) * op;
                vec2 ellP = vec2(gp.x, gp.y * pitchB);
                float dRing = abs(length(ellP) - ringRad);
                float ringBeam = exp(-dRing * 75.0) + exp(-dRing * 18.0) * 0.35;
                float runeAngle = atan(ellP.y, ellP.x);
                float runeNodes = smoothstep(0.84, 0.99, cos(runeAngle * (6.0 + fgi * 2.0) - l1T * 3.2 * (mod(fgi, 2.0) < 0.5 ? 1.0 : -1.0)));
                vec3 rTint = (gi % 3 == 0) ? uCol0.rgb : ((gi % 3 == 1) ? uCol1.rgb : uCol2.rgb);
                gimbalCol += (rTint * ringBeam * (0.78 + 0.45 * runeNodes) + vec3(0.95, 0.98, 1.0) * ringBeam * runeNodes * 0.55);
            }

            // 3. Volumetric Plasma Filaments arcing between the Singularity Core and Dyson Rings
            float plasmaArc = pow(0.5 + 0.5 * sin(aO * floor(5.0 + 2.0 * l1Den) + sin(rO * 9.0 - l1T * 3.8) * (1.6 + uBass * 1.2)), 4.5)
                            * smoothstep(0.18, 0.38, rO) * exp(-max(0.0, rO - 0.55) * 2.8);
            col += (coreCol + gimbalCol * (0.82 + 0.32 * uMid) + uCol2.rgb * plasmaArc * (0.85 + 0.55 * uBeat)) * (0.80 + uBass * 0.32) * l1Bright;
        } else if (l1m == 9) {
            // Mode 9 (World #22): Demoscene Polygon Tunnel & Rotating 3D Cyber-Mandala Iris Rings
            float sides = 5.0 + mod(floor(uTime * 0.12), 4.0);
            float rQ = length(q);
            float baseAng = atan(q.y, q.x);
            float fade = smoothstep(0.03, 0.15, rQ);

            // 1. Expanding Geometric Polygon Tunnel with Tear-Free Interleaved CW & CCW Counter-Rotating Rings
            vec2 tpCW = rot2D(l1T * 0.62) * q;
            vec2 tpCCW = rot2D(-l1T * 0.62 + PI / sides) * q;
            float dPolyCW = shapeRadius(tpCW, sides, 0.07, 0.12);
            float dPolyCCW = shapeRadius(tpCCW, sides, 0.07, 0.12);
            float phaseCW = (0.55 / max(0.03, dPolyCW)) * (0.85 * l1Den) + l1T * 1.15;
            float phaseCCW = (0.55 / max(0.03, dPolyCCW)) * (0.85 * l1Den) + l1T * 1.15 + 1.0;
            float ringCW = smoothstep(0.84, 0.99, cos(phaseCW * PI));
            float ringCCW = smoothstep(0.84, 0.99, cos(phaseCCW * PI));
            float polyRing = max(ringCW, ringCCW);
            float strutCW = smoothstep(0.93, 0.996, cos(atan(tpCW.y, tpCW.x) * sides));
            float strutCCW = smoothstep(0.93, 0.996, cos(atan(tpCCW.y, tpCCW.x) * sides));
            float polyStrut = max(strutCW * (0.45 + 0.55 * ringCW), strutCCW * (0.45 + 0.55 * ringCCW));
            vec3 pCol = mix(uCol0.rgb, uCol1.rgb, 0.5 + 0.5 * sin((phaseCW + phaseCCW) * 0.7)) * ringCW
                      + mix(uCol1.rgb, uCol0.rgb, 0.5 + 0.5 * cos(phaseCCW * 1.1)) * ringCCW;
            pCol = mix(max(pCol, 0.35 * (uCol0.rgb + uCol1.rgb)), uCol2.rgb, polyStrut * 0.65);
            vec3 tunnelCol = pCol * max(polyRing * 0.86, polyStrut * 0.58) * fade;

            // 2. Travelling Counter-Rotating Segmented 3D Circular Rings Rushing Through the Tunnel
            float zCirc = 0.55 / max(0.028, rQ);
            float circStream = zCirc * (1.45 * l1Den) + l1T * 2.1;
            float circIdx = floor(circStream);
            float circLocal = abs(fract(circStream) - 0.5) * 2.0;
            float circSign = (mod(abs(circIdx), 2.0) < 0.5) ? 1.0 : -1.0;
            // Pure monotonic l1T angular phase (l1T already integrates bass speed on the engine side)
            float circRotAng = baseAng + l1T * 2.35 * circSign + circIdx * 0.7854;
            // Wide open gaps between the 6 circular arc segments + radial vernier spokes so rotation is unmistakable
            float circArcMask = smoothstep(0.04, 0.32, cos(circRotAng * 6.0));
            float circTeeth = smoothstep(0.42, 0.90, cos(circRotAng * 18.0)) * exp(-abs(circLocal - 0.16) * 15.0) * (0.20 + 0.80 * circArcMask);
            float circSpokes = smoothstep(0.93, 0.997, cos(circRotAng * 6.0)) * exp(-circLocal * 5.5);
            float circBand = (exp(-circLocal * 11.5) * (0.03 + 0.97 * circArcMask) + circTeeth * 0.72 + circSpokes * 0.65) * fade;
            vec3 streamCircCol = mix(uCol2.rgb, uCol0.rgb, 0.5 + 0.5 * sin(circIdx * 1.2 + l1T * 0.8)) * circBand * (1.08 + 0.45 * uBeat);

            // 3. Visibly Rotating & 3D-Precessing Concentric Chronometer / Mandala Gear Rings with Rigid Spokes & Directional Satellites
            vec3 wheelCol = vec3(0.0);
            for (int wi = 0; wi < 4; wi++) {
                float fwi = float(wi);
                float wSign = (wi % 2 == 0) ? 1.0 : -1.0;
                // Smooth 3D gyroscopic tilt axis precession + elliptical foreshortening
                float tiltYaw = -l1T * (0.32 + fwi * 0.08) * wSign + fwi * 1.05;
                vec2 wp = rot2D(tiltYaw) * q;
                float tiltSquash = 1.0 + (0.24 + 0.10 * uMid) * sin(l1T * 0.88 + fwi * 1.55);
                vec2 ellW = vec2(wp.x, wp.y * tiltSquash);
                float rEll = length(ellW);
                float aEll = atan(ellW.y, ellW.x);

                float wRad = (0.145 + fwi * 0.135) * (1.0 + 0.07 * sin(l1T * 1.7 + fwi * 1.4) + uBeat * 0.10 + uBass * 0.06);
                float dWheel = abs(rEll - wRad);
                // Rigid-body monotonic rotation angle (aligned with tiltYaw so spin is never cancelled or scrambled by uBass)
                float rotAng = aEll + l1T * (1.85 + fwi * 0.42) * wSign;
                float segCount = 4.0 + fwi * 2.0;
                float gearTeeth = segCount * 3.0;
                // High-contrast segmented arcs (near-zero in gaps so rotation leaps off the screen) + outer gear teeth
                float segWave = cos(rotAng * segCount);
                float segArc = smoothstep(0.04, 0.30, segWave);
                float toothWave = cos(rotAng * gearTeeth);
                float toothNotch = smoothstep(0.48, 0.92, toothWave) * exp(-abs(rEll - (wRad + 0.013)) * 135.0) * (0.22 + 0.78 * segArc);
                float wheelRim = exp(-dWheel * 108.0) * (0.03 + 0.97 * segArc) + toothNotch * 0.90 + exp(-dWheel * 26.0) * segArc * 0.28;

                // Rigidly locked radial rotor spokes & cardinal keyway needle rotating together with the wheel rim
                float innerRad = max(0.035, wRad - 0.095);
                float inBand = smoothstep(innerRad - 0.008, innerRad + 0.014, rEll) * smoothstep(wRad + 0.010, wRad - 0.008, rEll);
                float spokeHelix = (rEll - wRad) * 5.5 * wSign;
                float irisBlades = smoothstep(0.92, 0.996, cos((rotAng + spokeHelix) * segCount)) * inBand;
                float keywayNeedle = smoothstep(0.965, 0.999, cos(rotAng * 2.0)) * inBand;

                // Directional orbiting satellite nodes with true asymmetric trailing comet wakes
                float satPhase = fract((rotAng * 2.0) / TAU - l1T * 0.55 * wSign);
                float satTrail = (wSign > 0.0) ? (1.0 - satPhase) : satPhase;
                float satHotspot = exp(-satTrail * 32.0) * exp(-dWheel * 54.0);
                float satWake = exp(-satTrail * 5.5) * smoothstep(0.0, 0.04, satTrail) * exp(-dWheel * 78.0) * 0.62;

                vec3 wTint = (wi % 3 == 0) ? uCol2.rgb : ((wi % 3 == 1) ? uCol0.rgb : uCol1.rgb);
                wheelCol += wTint * (wheelRim + irisBlades * 0.78 + satWake)
                          + vec3(1.0, 0.98, 0.92) * (satHotspot * 1.65 + keywayNeedle * 0.85 + toothNotch * 0.58);
            }

            // 4. Central Rotating Cyber-Lotus Starburst & Mechanical Shutter Core
            float lotusAng = baseAng - l1T * 2.55;
            float lotusR = (0.112 + 0.045 * cos(lotusAng * 6.0) + 0.022 * sin(baseAng * 12.0 + l1T * 3.8)) * (1.0 + uBass * 0.45 + uBeat * 0.22);
            float dLotus = abs(rQ - lotusR);
            float innerSpokes = smoothstep(0.88, 0.995, cos(lotusAng * 6.0 + rQ * 14.0)) * smoothstep(lotusR + 0.02, 0.018, rQ);
            float lotusGlow = exp(-dLotus * 92.0) + innerSpokes * 0.82 + exp(-rQ * 15.0) * (0.38 + 0.42 * uBeat);
            vec3 lotusCol = mix(uCol1.rgb, vec3(1.0, 0.96, 0.88), 0.55) * lotusGlow;

            col += (tunnelCol * 0.74 + streamCircCol * 0.85 + wheelCol * (0.98 + 0.38 * uMid) + lotusCol) * (0.82 + uBass * 0.38) * l1Bright;
        } else if (l1m == 10) {
            // Mode 10: Tempest & Asteroids 3D — 16-Lane Electric Blue Tube Web, Yellow Claw/Zapper & Sparse 1-2 Enemies
            vec3 tempBlue = vec3(0.13, 0.33, 1.0);
            vec3 tempYellow = vec3(1.0, 1.0, 0.08);
            vec3 tempRed = vec3(1.0, 0.08, 0.08);
            vec3 tempMagenta = vec3(1.0, 0.14, 1.0);
            vec3 tempGreen = vec3(0.08, 1.0, 0.22);
            vec3 tempCyan = vec3(0.0, 1.0, 1.0);
            float dWeb = shapeRadius(q, 16.0, 0.08 * sin(l1T * 0.4), 0.25);
            float zWeb = 0.48 / max(0.03, dWeb);
            float webRings = smoothstep(0.86, 0.985, cos((zWeb * 1.6 * l1Den + l1T * 2.6) * PI));
            float laneCoord = mod((aq + PI) / TAU * 16.0, 16.0);
            float laneIdx = floor(laneCoord);
            float laneLocal = fract(laneCoord) - 0.5;
            float webSpokes = smoothstep(0.90, 0.992, cos(aq * 16.0));
            float clawLane = floor(mod(l1T * 3.1, 16.0));
            float isClawLane = 1.0 - step(0.5, abs(laneIdx - clawLane));
            // Drastically reduced enemy spawn thresholds so only 1-2 sparse enemies appear at default density
            float flpThresh = clamp(0.95 - 0.05 * l1Den, 0.84, 0.96);
            float tnkThresh = clamp(0.97 - 0.04 * l1Den, 0.89, 0.98);
            float spkThresh = clamp(0.985 - 0.03 * l1Den, 0.92, 0.99);
            float singleWaveEnv = step(zWeb, 3.8);
            float flipperHit = smoothstep(0.86, 0.99, sin(zWeb * 1.4 + l1T * 3.2 + laneIdx * 1.7)) * step(flpThresh, fract(laneIdx * 0.37)) * singleWaveEnv;
            float tankerHit = smoothstep(0.88, 0.995, cos(zWeb * 1.2 + l1T * 2.4 + laneIdx * 2.3)) * step(abs(laneLocal), 0.28) * step(tnkThresh, fract(laneIdx * 0.29 + 0.1)) * singleWaveEnv;
            float spikerRail = step(abs(laneLocal), 0.08) * step(1.2, zWeb) * step(zWeb, 3.2) * step(spkThresh, fract(laneIdx * 0.41));
            float zapperShot = isClawLane * step(abs(laneLocal), 0.14) * smoothstep(0.72, 0.99, sin(zWeb * 4.5 - uTime * 14.0));
            float fade = smoothstep(0.03, 0.14, dWeb);
            vec3 tCol = mix(tempBlue, tempYellow, isClawLane) * max(webRings, webSpokes)
                      + tempRed * flipperHit * max(webSpokes, webRings) * 1.35
                      + tempMagenta * tankerHit * 1.15
                      + tempGreen * spikerRail * 0.95
                      + vec3(1.0) * zapperShot * 1.25
                      + tempCyan * exp(-abs(dWeb - (0.58 + 0.08 * sin(aq * 5.0 + l1T))) * 45.0) * 0.65;
            col += tCol * fade * (0.82 + uBass * 0.36 + uBeat * 0.24) * l1Bright;
        } else {
            // Mode 11 (UI 24: Death Star 3D Warp Trench): 3D Trench Corridor rotating slightly CW and CCW with Catwalk Ribs & Quad Lasers (Zero Cockpit)
            float rollAng = sin(l1T * 0.52) * 0.26 + cos(l1T * 0.29) * 0.11;
            vec2 rp = rot2D(rollAng) * q;
            float prelimDist = max(abs(rp.x) * 0.78, abs(rp.y) * 0.92);
            float zPre = 0.32 / max(0.025, prelimDist);
            // 3D sinusoidal tunnel bending & slight CW/CCW warp along depth zPre
            vec2 bend = vec2(
                sin(zPre * 0.42 + l1T * 1.65) * 0.14,
                cos(zPre * 0.34 - l1T * 1.35) * 0.11
            ) * smoothstep(1.2, 0.04, prelimDist);
            vec2 tp = rot2D(sin(zPre * 0.26 + l1T * 0.85) * 0.18) * (rp + bend);
            float wallDist = max(abs(tp.x) * 0.80, abs(tp.y) * 0.96);
            float octDist = max(wallDist, (abs(tp.x) + abs(tp.y)) * 0.62);
            float zTrench = 0.30 / max(0.022, octDist);
            float bayRibs = smoothstep(0.84, 0.985, cos((zTrench * 1.9 * l1Den + l1T * 3.8) * PI));
            float catwalkGirders = smoothstep(0.92, 0.995, cos((zTrench * 0.48 * l1Den + l1T * 0.95) * PI))
                                 * smoothstep(0.04, 0.32, abs(tp.x) + abs(tp.y));
            float longRails = smoothstep(0.90, 0.992, cos(atan(tp.y, tp.x) * 8.0));
            float greeblePanels = step(0.45, sin(zTrench * 5.5 + floor(atan(tp.y, tp.x) * 4.0) * 1.7)) * 0.24;
            float fade = smoothstep(0.022, 0.14, octDist);
            float quadLaser = exp(-abs(abs(tp.x) - abs(tp.y) * 0.88) * 115.0)
                            * smoothstep(0.62, 0.99, sin(zTrench * 3.4 - uTime * 14.0));
            // Advancing TIE fighter enemy in the warping trench
            float tieScaleW = 0.62 + 0.38 * fract(l1T * 0.48 + 0.3);
            vec2 tiePW = (tp - vec2(sin(l1T * 1.25) * 0.12, cos(l1T * 0.92) * 0.08)) / max(0.35, tieScaleW);
            float tiePodW = exp(-abs(length(tiePW) - 0.026) * 165.0);
            float tieStrutW = exp(-abs(tiePW.y) * 185.0) * step(abs(tiePW.x), 0.064);
            float tieWingsW = exp(-abs(abs(tiePW.x) - 0.064) * 155.0) * step(abs(tiePW.y), 0.055);
            float tieShapeW = clamp(tiePodW + tieStrutW + tieWingsW, 0.0, 1.2);
            vec3 trenchCol = mix(uCol0.rgb, uCol1.rgb, 0.5 + 0.5 * sin(zTrench * 0.35)) * (bayRibs + longRails * 0.72 + greeblePanels) * fade * 0.82
                           + uCol2.rgb * catwalkGirders * fade * (0.85 + uBass * 0.45)
                           + vec3(0.45, 0.88, 1.0) * tieShapeW * (0.92 + uBeat * 0.45)
                           + mix(vec3(1.0, 0.18, 0.14), vec3(0.18, 1.0, 0.32), step(0.0, tp.y)) * quadLaser * (0.95 + uBeat * 0.45);
            col += trenchCol * (0.78 + uBass * 0.34) * l1Bright;
        }
    }

    // =========================================================================
    // LAYER #4: DEDICATED GPU SHADER TUNNEL & VORTEX ENGINE (16 Modes 0..15 + Dual 2x Mode)
    // =========================================================================
    bool l2FractalActive = (int(floor(uL2VizMode + 0.5)) == 5);
    bool l4Active = (uL4Enabled > 0.5) || (uL2Enabled > 0.5);
    if (l4Active || l2FractalActive) {
        int m1 = l4Active
            ? int(floor(((uL4Enabled > 0.5) ? uL4Mode : uL2Mode) + 0.5))
            : 13;
        m1 = clamp(m1, 0, 16);
        float sym = max(2.0, floor(uFacets + 0.5));
        float zoom = clamp(uZoom, 0.4, 2.5);
        float bIntensity = clamp(uComplexity, 0.04, 2.0);
        float twist = (abs(uL4Twist) < 0.05) ? 1.0 : clamp(uL4Twist, -2.5, 2.5);
        int wallPat = clamp(int(floor(uL4WallPattern + 0.5)), 0, 4);
        vec2 cPos = (p - drift * 0.42) / zoom;

        int m2 = clamp(int(floor(uL4SecondaryMode + 0.5)), 0, 16);
        int dualPasses = (l4Active && uL4DualEnabled > 0.5) ? 2 : 1;
        vec3 colPrimary = col;
        for (int pass = 0; pass < dualPasses; ++pass) {
            int mCur = (pass == 0) ? m1 : m2;
            vec2 cPosCur = (pass == 0) ? cPos : (rot2D(0.38 * twist + uTime * 0.08 * dir) * cPos);
            float symCur = (pass == 0) ? sym : max(2.0, sym + 2.0);
            float dirCur = (pass == 0) ? dir : -dir;
            float twistCur = (pass == 0) ? twist : (-twist * 0.85);
            int wallPatCur = (pass == 0) ? wallPat : ((wallPat + 1) % 5);
            vec3 evalCol = evalLayer4Mode(mCur, cPosCur, symCur, bIntensity, dirCur, twistCur, wallPatCur, col);
            if (pass == 0) {
                colPrimary = evalCol;
            } else {
                float mixW = clamp(uL4DualMix, 0.15, 0.85);
                vec3 interfere = min(colPrimary, evalCol) * (0.42 + 0.36 * uBass);
                colPrimary = clamp(mix(colPrimary, evalCol, mixW) + interfere, 0.0, 1.0);
            }
        }
        col = colPrimary;
    }

    // Subtle vignette for cinema depth
    float vig = 1.0 - dot(uv * 0.42, uv * 0.42);
    col *= clamp(vig, 0.55, 1.0);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * qt_Opacity;
}
