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
        float zPhase0 = zDepth0 - uZoomTime * 2.4 * dir;
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
        float zPhase1 = -logR * 3.2 - uZoomTime * 2.2 * dir;
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
        // Mode 8: VSXu Fluid Ribbons (3D Twisting Silk Ribbon Streams Inside a Cylindrical Tunnel)
        float zDepth8 = 0.85 / max(0.05, r);
        vec2 rp8 = rot2D(zDepth8 * 0.28 * twist - uTime * 0.45 * dir) * cPos;
        float a8 = atan(rp8.y, rp8.x);
        float aFold8 = abs(mod(a8 + halfSector, sector) - halfSector) / halfSector;
        float ribWave = sin(aFold8 * PI * 3.0 + sin(zDepth8 * 1.4 - uZoomTime * 3.2 * dir) * (1.2 + uBass));
        float silk = smoothstep(0.45, 0.96, abs(ribWave)) * smoothstep(0.04, 0.20, r);
        float coreEdge = smoothstep(0.86, 0.99, abs(ribWave)) * smoothstep(0.05, 0.24, r);
        vec3 silkCol = mix(uCol0.rgb, uCol1.rgb, 0.5 + 0.5 * sin(zDepth8 * 0.6 - uTime));
        silkCol = mix(silkCol, uCol2.rgb, aFold8);
        col = mix(col, silkCol * silk + vec3(0.95, 0.98, 1.0) * coreEdge * 0.55, clamp((0.64 + 0.34 * uBass) * bIntensity, 0.0, 0.94));
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
        vec2 bentP = (cPos - throat) + throat * exp(-rawR * 2.2) * sin(zW * 0.6 - uZoomTime * 2.4 * dir);
        vec2 rotW = rot2D(zW * 0.24 * twist + uTime * 0.35 * dir) * bentP;
        float aW = atan(rotW.y, rotW.x);
        float aFoldW = abs(mod(aW + halfSector, sector) - halfSector) / halfSector;
        float zPhaseW = zW - uZoomTime * 2.6 * dir;
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
    } else {
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
    // LAYER #1: Per-Pixel Smooth GPU Background Field
    // =========================================================================
    if (uL1Enabled > 0.5) {
        int l1m = int(floor(uL1Mode + 0.5));
        float l1Bright = clamp(1.0 - uL1Dim, 0.12, 1.0);
        vec2 q = pDrift;
        float rq = length(q);
        float aq = atan(q.y, q.x);

        if (l1m == 0) {
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
            float spiral = sin(log(max(0.03, rq)) * 7.5 - uL1Time * 2.4 + aq * 4.0 + sin(rq * 6.0 - uL1Time)) * 0.5 + 0.5;
            float wake = cos(aq * 6.0 - rq * 9.0 + uL1Time * 1.6) * 0.5 + 0.5;
            vec3 cFlow = mix(uCol1.rgb, uCol2.rgb, wake);
            col += cFlow * pow(spiral, 1.8) * (0.30 + 0.26 * uMid) * l1Bright;
        } else if (l1m == 2) {
            float fy = 1.0 - qt_TexCoord0.y;
            float wave1 = sin(p.x * 5.5 + uL1Time * 1.8 + sin(fy * 6.0 - uL1Time * 3.0)) * 0.5 + 0.5;
            float wave2 = sin(p.x * 11.0 - uL1Time * 1.4 + cos(fy * 9.0 - uL1Time * 2.4)) * 0.5 + 0.5;
            float flameEnv = smoothstep(1.15, 0.0, fy / (0.55 + uBass * 0.45 + wave1 * 0.28));
            vec3 flameCol = mix(uCol2.rgb, mix(uCol0.rgb, vec3(1.0, 0.92, 0.65), flameEnv * 0.6), wave2);
            col += flameCol * flameEnv * (0.38 + 0.28 * uBass) * l1Bright;
        } else if (l1m == 3) {
            float neb1 = sin(q.x * 3.2 + sin(q.y * 2.8 + uL1Time * 0.7)) * cos(q.y * 3.0 - uL1Time * 0.6) * 0.5 + 0.5;
            float neb2 = sin(rq * 6.5 - uL1Time * 1.5 + aq * 3.0) * 0.5 + 0.5;
            float ringGlow = exp(-abs(rq - (0.35 + 0.12 * sin(uL1Time * 0.5))) * 5.5);
            col += (mix(uCol0.rgb, uCol2.rgb, neb1) * neb2 * 0.24 + uCol1.rgb * ringGlow * 0.32) * l1Bright;
        } else if (l1m == 4) {
            // Mode 4: Atari Battlezone Fixed-Horizon Vector Landscape Backing
            float hy = qt_TexCoord0.y - 0.50;
            float horizonGlow = exp(-abs(hy) * 28.0) * (0.42 + uBass * 0.28);
            col += uCol0.rgb * horizonGlow * l1Bright;
            if (hy > 0.0) {
                float floorGrad = clamp(hy * 1.9, 0.0, 1.0);
                col += mix(uCol0.rgb, uCol1.rgb, floorGrad) * (0.06 + 0.06 * uBass) * floorGrad * l1Bright;
            }
        } else if (l1m == 5) {
            float camAlt = sin(uL1Time * 0.82 + uTime * 0.35) * 0.24 + cos(uL1Time * 0.41 - uTime * 0.28) * 0.10;
            vec2 tp = p - vec2(drift.x * 0.35, camAlt);
            float trenchGlow = exp(-abs(tp.x) * 4.2) * (0.18 + 0.16 * uBass);
            float targetGlow = exp(-length(tp) * 5.8) * (0.28 + 0.24 * uBeat);
            col += (uCol0.rgb * trenchGlow + uCol1.rgb * targetGlow) * l1Bright;
        } else {
            float ehR = 0.24 + uBass * 0.04;
            float photonRing = exp(-abs(rq - ehR) * 18.0) * (0.65 + uBeat * 0.35);
            float swirl = sin(aq * 5.0 - log(max(0.04, rq)) * 8.0 - uL1Time * 1.8) * 0.5 + 0.5;
            float corona = smoothstep(ehR * 0.85, ehR * 1.05, rq) * exp(-max(0.0, rq - ehR) * 3.5);
            col += (uCol0.rgb * photonRing + mix(uCol1.rgb, uCol2.rgb, swirl) * corona * 0.42) * l1Bright;
            col *= smoothstep(ehR * 0.72, ehR * 0.98, rq);
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
        m1 = clamp(m1, 0, 15);
        float sym = max(2.0, floor(uFacets + 0.5));
        float zoom = clamp(uZoom, 0.4, 2.5);
        float bIntensity = clamp(uComplexity, 0.2, 2.0);
        float twist = (abs(uL4Twist) < 0.05) ? 1.0 : clamp(uL4Twist, -2.5, 2.5);
        int wallPat = clamp(int(floor(uL4WallPattern + 0.5)), 0, 4);
        vec2 cPos = (p - drift * 0.42) / zoom;

        vec3 colPrimary = evalLayer4Mode(m1, cPos, sym, bIntensity, dir, twist, wallPat, col);
        if (l4Active && uL4DualEnabled > 0.5) {
            int m2 = clamp(int(floor(uL4SecondaryMode + 0.5)), 0, 15);
            vec2 cPosSecondary = rot2D(0.38 * twist + uTime * 0.08 * dir) * cPos;
            vec3 colSecondary = evalLayer4Mode(m2, cPosSecondary, max(2.0, sym + 2.0), bIntensity, -dir, -twist * 0.85, (wallPat + 1) % 5, col);
            float mixW = clamp(uL4DualMix, 0.15, 0.85);
            vec3 interfere = min(colPrimary, colSecondary) * (0.42 + 0.36 * uBass);
            col = clamp(mix(colPrimary, colSecondary, mixW) + interfere, 0.0, 1.0);
        } else {
            col = colPrimary;
        }
    }

    // Subtle vignette for cinema depth
    float vig = 1.0 - dot(uv * 0.42, uv * 0.42);
    col *= clamp(vig, 0.55, 1.0);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0) * qt_Opacity;
}
