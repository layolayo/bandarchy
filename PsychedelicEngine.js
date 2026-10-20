.pragma library

// PsychedelicEngine.js — 3-Layer Configurable Psychedelic & Classic Nightclub Visualiser Engine
//
// Engineered for locked 60–120 FPS buttery-smooth rendering in Qt6 QQuickContext2D:
//   - Adaptive Gain Controller (AGC) + dual-band sub-bass/snare onset beat detector
//   - Colour-bucketed path batching (< 2ms CPU frame time at 1080p)
//   - Layer #1: Background & Iterative Framebuffer Feedback Engine (MilkDrop/Geiss/G-Force/Cthugha)
//   - Layer #2: 12 Psychedelic & Classic PC Nightclub Visualiser Modes (MilkDrop, AVS SuperScope,
//               G-Force WaveShape, Cthugha Rave Scope, Jeff Minter VLM, Mandelbulb/Julia, DMT Lotus,
//               Spacetime Quasar, Alien Mycelium, Cyber Matrix, 4D Sacred Polytopes, Strange Attractors)
//   - Layer #3: Autonomous Album Art Dismantle, Evolution & Rebuild Engine (6 choreographies +
//               permanent track-progress evolution + Omarchy `/usr/bin/ttfx` keyframe morphing)

var LAYER1_MODES = [
    "MilkDrop Liquid Feedback Warp",
    "G-Force Polar FlowField",
    "Cthugha Rave Flame",
    "Relativistic Starfield",
    "Atari Battlezone Landscape",
    "Death Star Trench Run",
    "Obsidian Deep Void",
    "TRON 1982 Grid",
    "SynthGrid Outrun Canyon",
    "Demoscene Polygon Tunnel",
    "Tempest & Asteroids 3D",
    "Stark Photo Realm"
]

var ALL_LAYER1_MODES = [
    "MilkDrop Liquid Feedback Warp",
    "G-Force Polar FlowField",
    "Cthugha Rave Flame",
    "Relativistic Starfield",
    "Atari Battlezone Landscape",
    "Death Star Trench Run",
    "Obsidian Deep Void",
    "TRON 1982 Grid",
    "SynthGrid Outrun Canyon",
    "Demoscene Polygon Tunnel",
    "Tempest & Asteroids 3D",
    "Stark Photo Realm",
    "Shader Warp Vortex",
    "Shader Polar Spiral",
    "Shader Rave Flame",
    "Shader Starfield",
    "Shader Hybrid DNA Helix",
    "Shader Death Star Trench",
    "Shader BlackHole Horizon",
    "Shader TRON Swoop Towers",
    "Shader Dyson Hyper-Orrery",
    "Shader PolyTunnel",
    "Shader Tempest Web",
    "Death Star 3D Warp Trench",
    "CRT Rave-Man E-Pill Roam",
    "Sumerian TARDIS"
]

var SHORT_LAYER1_MODES = [
    "1:Warp", "2:Spiral", "3:Flame", "4:Stars", "5:Battlezone", "6:Trench",
    "7:BlackHole", "8:TRON", "9:SynthGrid", "10:PolyTunnel", "11:Tempest", "12:Photo",
    "13:ShdWarp", "14:ShdSpiral", "15:ShdFlame", "16:ShdStars", "17:ShdDNA", "18:ShdTrench",
    "19:ShdVoid", "20:ShdTRON", "21:ShdOrrery", "22:ShdPoly", "23:ShdTempest", "24:3DWarpTrench",
    "25:RaveMan", "26:SumerTardis"
]

var MODE_NAMES = [
    "MilkDrop Geiss Cathedral",
    "AVS 3D SuperScope",
    "G-Force WaveShape Vortex",
    "Cthugha Rave Oscilloscope",
    "Minter VLM Neon Lattice",
    "Julia & Fractal Orbit",
    "DMT Lotus Hyperspace",
    "Spacetime Quasar Grid",
    "Bioluminescent Mycelium",
    "Cyber Matrix Tunnel",
    "4D Sacred Polytope",
    "Chaos Strange Attractor",
    "3D Sierpinski Fractal"
]

var ALL_MODE_NAMES = [
    "MilkDrop Geiss Cathedral",
    "AVS 3D SuperScope",
    "G-Force WaveShape Vortex",
    "Cthugha Rave Oscilloscope",
    "Minter VLM Neon Lattice",
    "Julia & Fractal Orbit",
    "DMT Lotus Hyperspace",
    "Spacetime Quasar Grid",
    "Bioluminescent Mycelium",
    "Cyber Matrix Tunnel",
    "4D Sacred Polytope",
    "Chaos Strange Attractor",
    "3D Sierpinski Fractal",
    "3D Hopf Fibration Torus",
    "3D Calabi-Yau Manifold",
    "3D Gyroscopic Merkaba",
    "3D Hyperbolic Poincare Web",
    "3D Quantum Bloch Sphere",
    "3D Klein Bottle Immersion",
    "3D Penrose Quasicrystal",
    "3D Tetris Soma Cube"
]

var SHORT_MODE_NAMES = [
    "1:MilkDrop", "2:SuperScope", "3:G-Force", "4:Cthugha", "5:MinterVLM", "6:Julia",
    "7:Lotus", "8:Quasar", "9:Mycelium", "10:Matrix", "11:Polytope", "12:Attractor", "13:Sierpinski",
    "14:HopfTorus", "15:CalabiYau", "16:Merkaba3D", "17:Poincare", "18:BlochOrb", "19:KleinBottle", "20:Quasicrystal",
    "21:3DTetris"
]

var LAYER2_MODES = MODE_NAMES

var LAYER3_MODES = [
    "Shatter & Evolving Rebuild",
    "Cellular Automata Growth",
    "Blackhole Accretion & Nova",
    "Tectonic Shear & Acid Melt",
    "Swarm Flocking Vortex",
    "Omarchy TTE Keyframe Morph",
    "Liquid Acid Wave",
    "3D Cylinder Banner",
    "Rubber Accordion",
    "3D Perspective Crawl",
    "Chromatic Mirror",
    "Fisheye Sonic Lens"
]

var LAYER3_TEXT_STYLES = [
    "Cyber Techno",
    "Psychedelic Liquid",
    "Rave Laser Stencil",
    "Dance Chrome",
    "Club LED Wall",
    "Acid Glitch IDM",
    "Psytrance UV Glow",
    "Berlin Brutalist",
    "Holographic Sci-Fi HUD",
    "Oscilloscope Vector Beam",
    "3D Isometric Extrude",
    "Plasma Arc Tesla",
    "Y2K Iridescent Mercury",
    "Demoscene Copperbars",
    "Bioluminescent Mycelium",
    "Quantum Matrix Datastream",
    "ASCII Black Block / White Text",
    "ASCII White Back / Black Text",
    "ASCII Transparent Back / Text",
    "ASCII Coloured Back / Transparent Text",
    "ASCII Cell Matrix"
]
var LAYER3_TEXT_STYLE_NAMES = LAYER3_TEXT_STYLES
var SHORT_LAYER3_TEXT_STYLES = [
    "Techno",
    "Liquid",
    "Laser",
    "Chrome",
    "LED Wall",
    "Acid Glitch",
    "UV Glow",
    "Brutalist",
    "Holo HUD",
    "Oscillo XY",
    "Iso 3D",
    "Tesla Arc",
    "Y2K Metal",
    "Copperbar",
    "Bio Spore",
    "Quantum",
    "ASCII Black Block",
    "ASCII White Block",
    "ASCII Transparent",
    "ASCII Colour Knockout",
    "ASCII Cell Matrix"
]

var LAYER3_ART_STYLES = [
    "Chromatic K-Means 3D Planes",
    "Subject Salience Isolation",
    "Sobel Tangent Flow Ribbons",
    "Adaptive Quadtree Mondrian",
    "Delaunay Stained-Glass Shards",
    "Topographical Iso-Contours",
    "3D Normal-Map Lit Bas-Relief",
    "Thermal Warm-Cool Depth Split",
    "DoG Woodcut & Ink Ridges",
    "Negative-Space Shadow Inversion",
    "Hue-Angle Spiral Vortex",
    "Fourier Cymatic Interference",
    "3D Point-Cloud Sculpture",
    "Gabor Oriented Cross-Hatch",
    "Chromatic RGB Prism Split",
    "Poisson Organic Stipple Swarm",
    "Turing Reaction-Diffusion",
    "Isometric Cityscape Extrude",
    "CMYK Rosette Halftone Press",
    "Magnetic Dipole Vector Field",
    "Holographic Slice Tomography"
]

var SHORT_LAYER3_ART_STYLES = [
    "K-Means 3D",
    "Salience",
    "Tangent Flow",
    "Quadtree",
    "Delaunay",
    "Iso-Contours",
    "Bas-Relief",
    "Thermal 3D",
    "DoG Woodcut",
    "Neg-Space",
    "Hue Vortex",
    "FFT Cymatic",
    "Point Cloud",
    "Gabor Hatch",
    "RGB Prism",
    "Stipple 3D",
    "Turing Coral",
    "Iso City",
    "CMYK Press",
    "Dipole Field",
    "Tomography"
]

var LAYER3_CYLINDER_DIRS = [
    "L→R",
    "R→L",
    "U→D",
    "D→U",
    "360° Spin CW",
    "360° Spin CCW"
]

var LAYER3_COLOUR_MODES = [
    "Style Signature",
    "Line Palette",
    "Duotone Contrast",
    "Audio Spectrum",
    "Prism Wave",
    "Letter Alternate"
]
var SHORT_LAYER3_COLOUR_MODES = [
    "Style",
    "Line Pal",
    "Duotone",
    "EQ Spec",
    "Prism",
    "Letter"
]

var LAYER3_FONT_PRESETS = [
    "Style Default",
    "Woodcut Slab (ChunkFive Print)",
    "Heavy Slab (ChunkFive)",
    "Gothic Chancery (Z003 Italic)",
    "Venetian Old-Style (P052 Palatino)",
    "Classic Bookman (URW Bookman)",
    "Century Editorial (C059 Serif)",
    "Avant-Garde Geometric (URW Gothic)",
    "Condensed Headline (Nimbus Narrow)",
    "Noir Typewriter (Nimbus Mono PS)",
    "Duospace Author (iA Writer Duo)",
    "Editorial Mono (iA Writer Mono S)",
    "Literary Drama (Liberation Serif)",
    "Brutalist Sans (Liberation Sans)",
    " Broadcast Ubuntu (Ubuntu Bold)",
    "Terminal Nerd (JetBrainsMono)"
]
var SHORT_LAYER3_FONT_PRESETS = [
    "Default",
    "Woodcut Slab",
    "Heavy Slab",
    "Gothic Z003",
    "Palatino Serif",
    "Bookman",
    "Century C059",
    "Avant-Garde",
    "Condensed",
    "Typewriter",
    "iA Duospace",
    "iA Mono",
    "Drama Serif",
    "Brutalist Sans",
    "Ubuntu Bold",
    "Terminal Mono"
]
var LAYER3_FONT_PRESET_FAMILIES = [
    "",
    "'ChunkFive Print', 'ChunkFive', 'URW Bookman', serif",
    "'ChunkFive', 'ChunkFive Print', 'Impact', serif",
    "'Z003', 'P052', 'URW Bookman', 'Liberation Serif', serif",
    "'P052', 'URW Palladio L', 'Palatino', 'Liberation Serif', serif",
    "'URW Bookman', 'Bookman Old Style', 'C059', 'Liberation Serif', serif",
    "'C059', 'Century Schoolbook L', 'Nimbus Roman', 'Liberation Serif', serif",
    "'URW Gothic', 'ITC Avant Garde Gothic', 'Ubuntu', 'Liberation Sans', sans-serif",
    "'Nimbus Sans Narrow', 'Arial Narrow', 'Liberation Sans', sans-serif",
    "'Nimbus Mono PS', 'Courier New', 'Liberation Mono', monospace",
    "'iA Writer Duospace', 'Nimbus Mono PS', 'JetBrainsMono Nerd Font', monospace",
    "'iA Writer Mono S', 'Liberation Mono', 'JetBrainsMono Nerd Font', monospace",
    "'Liberation Serif', 'Nimbus Roman', 'Times New Roman', serif",
    "'Liberation Sans', 'Nimbus Sans', 'Adwaita Sans', sans-serif",
    "'Ubuntu', 'Adwaita Sans', 'Liberation Sans', sans-serif",
    "'JetBrainsMono Nerd Font', 'JetBrains Mono', 'Liberation Mono', monospace"
]

var LAYER4_MODES = [
    "Cyber Tunnel",
    "Spiral Vortex",
    "Twin Ripple",
    "Binary Twin Vortex",
    "Butterchurn Liquid Mesh",
    "projectM Fluid Preset",
    "Magic Liquid Waves",
    "VS Synth Matrix",
    "VSXu Fluid Ribbons",
    "TouchDesigner Curl Fluid",
    "Metaball Liquid Chrome",
    "Wormhole Bend",
    "Moiré Dual Grids",
    "Mandelbrot Deep Dive",
    "Gargantua Blackhole",
    "Voronoi Bio-Cells",
    "DMT Machine Elves"
]

var LAYER4_WALL_PATTERNS = [
    "Rings",
    "Hex Grid",
    "Ribbons",
    "Matrix",
    "Strobe"
]

var LAYER1_MODE_NAMES = LAYER1_MODES
var LAYER2_MODE_NAMES = LAYER2_MODES
var LAYER3_MODE_NAMES = LAYER3_MODES
var LAYER4_MODE_NAMES = LAYER4_MODES

var BACKDROP_MODES = [
    "Harmonic Ripple Flower",
    "Stained-Glass Rose",
    "Volumetric Plasma",
    "Julia Seahorse Fractal",
    "Raymarched Shape Field",
    "Cosmic Aura Pulse",
    "Relativistic Event Horizon",
    "Voronoi Bio-Cells"
]
var BACKDROP_MODE_NAMES = BACKDROP_MODES

var LAYER1_EQ_STYLES = [
    "Skyline Mountain",
    "LED Bars & Peaks",
    "Mirrored Reflection",
    "3D Waterfall Ridges",
    "Sun Rays",
    "Centre Twin Wave",
    "Horizon Spotlights",
    "3D Sonic Orb",
    "3D Torus Reactor",
    "Cymatic Chladni",
    "3D Helix Vortex",
    "Tesla Plasma Arcs",
    "Tralis Voxel City",
    "Aurora Curtains",
    "DNA Helix Beam",
    "Ferrofluid Lake"
]

var ALL_LAYER1_EQ_STYLES = [
    "Skyline Mountain",
    "LED Bars & Peaks",
    "Mirrored Reflection",
    "3D Waterfall Ridges",
    "Sun Rays",
    "Centre Twin Wave",
    "Horizon Spotlights",
    "3D Sonic Orb",
    "3D Torus Reactor",
    "Cymatic Chladni",
    "3D Helix Vortex",
    "Tesla Plasma Arcs",
    "Tralis Voxel City",
    "Aurora Curtains",
    "DNA Helix Beam",
    "Ferrofluid Lake",
    "3D Tubed Neon Matrix",
    "Hyper-Ribbon Spectrum Canyon",
    "Cybernetic Spine & Ribs",
    "Holographic Prism Pillars",
    "Relativistic Warp Rings EQ",
    "Liquid Mercury Ferro-Wave",
    "Laser Harp Cathedral",
    "3D Synth Keyboard Valley"
]

var SHORT_LAYER1_EQ_STYLES = [
    "1:Skyline", "2:LED Bars", "3:Mirror", "4:Waterfall", "5:SunRays", "6:TwinWave",
    "7:Spotlights", "8:3D Orb", "9:3D Torus", "10:Chladni", "11:3D Helix", "12:TeslaArc",
    "13:VoxelCity", "14:Aurora", "15:DNA Beam", "16:Ferrofluid",
    "17:TubeMatrix", "18:RibbonCanyon", "19:CyberSpine", "20:HoloPrisms",
    "21:WarpRings", "22:MercuryWave", "23:LaserHarp", "24:SynthKeys"
]

var LAYER1_EQ_LAYOUTS = [
    "Bottom ▲ (Up)",
    "Mid ▲ (Up)",
    "Mid ▼ (Down)",
    "Top ▼ (Down)"
]

var LAYER1_EQ_BAND_ORDERS = [
    "Low→High",
    "Centre-Out",
    "Stereo Mirror"
]

var SHORT_LAYER1_EQ_BAND_ORDERS = [
    "1:Low→High",
    "2:Centre-Out",
    "3:StereoMirror"
]

var LAYER1_EQ_DAMPING = [
    "Snappy",
    "Smooth",
    "Peak-Hold"
]

var LAYER1_SHAPE_STYLES = [
    "Battlezone Tanks",
    "Star Wars Craft",
    "TRON Recognizers",
    "Sacred Polygons",
    "Merkaba Starbursts",
    "Sonic Boom Rings",
    "Elite Cobra Mk III",
    "Tempest Claw & Flippers",
    "Asteroids Deluxe Ship & UFO",
    "Red Baron 3D Biplanes",
    "Lunar Lander Apollo LEM",
    "Star Castle Energy Rings",
    "Battlezone Saucers & Pyramids",
    "Vectrex Cosmic Chasm",
    "3D Botanical Flowers",
    "Classic Religious Symbols",
    "3D Platonic Solids"
]
var ALL_LAYER1_SHAPE_STYLES = LAYER1_SHAPE_STYLES
var SHORT_LAYER1_SHAPE_STYLES = [
    "BZone Tank", "Star Wars", "Recognizer", "Polygons", "Starbursts", "Boom Rings",
    "CobraMkIII", "TempestClaw", "AsteroidsUFO", "RedBaron", "LunarLander", "StarCastle",
    "BZoneUFOs", "VectrexChasm", "3D Flowers", "SacredSymbols", "PlatonicSolids"
]

var TRACK_ARC_MODES = [
    "Dynamic Audio Arc",
    "Song Climax Arc (75% Peak)",
    "Progressive Dismantle (0→100%)",
    "Progressive Rebuild (0→100%)",
    "Quarter-Track Chapters (25/50/75%)"
]

var TTFX_EFFECTS = [
    "waves",
    "blackhole",
    "beams",
    "crumble",
    "swarm",
    "rings",
    "fireworks",
    "matrix"
]

var SYMMETRY_OPTIONS = [1, 2, 4, 6, 8, 12, 16]

var DEFAULT_STATEMENTS = [
    "WE ARE THE FREQUENCIES",
    "RESONANCE IS ARCHITECTURE",
    "SOUND BECOMES GEOMETRY",
    "ENTER THE VORTEX",
    "ACID IN THE CIRCUITRY",
    "SYNTHESISE THE INFINITE",
    "PULSE OF THE UNDERGROUND",
    "SUBWOOFER CATHEDRAL",
    "VOLTAGE AND VELVET",
    "BEYOND THE EVENT HORIZON",
    "ANALOGUE SOUL DIGITAL VOID",
    "HYPNOTIC MOMENTUM",
    "DANCE IN THE VECTOR FIELD",
    "FUTURE PRIMITIVE RAVE",
    "PHOSPHOR DREAMS IN 60HZ",
    "NO BORDERS IN THE BASSLINE",
    "LUMINOUS FREQUENCIES",
    "TRANSMITTING FROM THE DEEP",
    "KINETIC EUPHORIA",
    "CYBERNETIC ECSTASY",
    "EVERY BEAT REWRITES SPACE",
    "MODULATE REALITY",
    "ELECTRIC MYCELIUM",
    "HIGH VOLTAGE SERENITY",
    "ECHOES OF TOMORROW",
    "THE FLOOR IS LIQUID LIGHT",
    "WAREHOUSE TELEPATHY",
    "OSCILLATE FOREVER",
    "INFINITE FEEDBACK LOOP",
    "LASER THROUGH THE FOG",
    "CHROMATIC TRANSCENDENCE",
    "SYNTHESIS IS LIBERATION",
    "DEEP SPACE SUBHARMONICS",
    "VECTOR HORIZON",
    "PURE WAVEFORM ALCHEMY",
    "NIGHT DRIVE TO INFINITY",
    "NEURAL RAVE SYNCHRONISATION",
    "SONIC HOLOGRAPHY",
    "FRACTAL MEMORY",
    "RHYTHM OF THE COSMOS",
    "SUBTERRANEAN SUNRISE",
    "ZERO GRAVITY GROOVE",
    "PHANTOM OSCILLATOR",
    "ULTRA VIOLET VELOCITY",
    "SIGNAL IN THE NOISE",
    "SILICON AND STARLIGHT",
    "TIME DISSOLVES IN REVERB",
    "POLYPHONIC REBELLION",
    "BASS IS THE FOUNDATION",
    "LIQUID CHROME HORIZON",
    "PERPETUAL MOTION ENGINE",
    "THE MACHINE BREATHES MUSIC",
    "ASTRAL PROJECTION",
    "HYPERDIMENSIONAL DUB",
    "ACID HOUSE FOREVER",
    "DEMOSCENE FOREVER",
    "GREETINGS TO ALL NIGHT OWLS",
    "STAY IN THE FREQUENCY",
    "WE NEVER STOP DANCING",
    "LIGHT SPEED ARPEGGIO"
]

var PALETTE_NAMES = [
    "Acid Rainbow",
    "Cyber Neon",
    "Solar Flare",
    "Bioluminescence",
    "Ultraviolet Rave",
    "Deep Nebula",
    "Emerald Matrix",
    "Blood Moon",
    "Cosmic Gold",
    "Arctic Aurora",
    "Tokyo Synthwave",
    "Electric Plasma",
    "Toxic Acid 303",
    "Outrun Sunset",
    "Holographic Prism",
    "DMT Hyperspace",
    "Sub-Zero Cryo",
    "Volcanic Magma",
    "Vaporwave Mall",
    "Quantum Supernova",
    "Jungle Biolume",
    "Berlin Strobe",
    "Amethyst Crystal",
    "Copper Demoscene",
    "Abalone Pearl",
    "Radioactive Isotope",
    "Starlight Quasar",
    "Crimson Velvet",
    "Oceanic Trench",
    "Prismatic Kaleidoscope",
    "Dark Horror",
    "Gritty Drama",
    "Noir Thriller",
    "Slasher Giallo",
    "Psychological Dread",
    "Eldritch Abyss",
    "Post-Apocalyptic Ash",
    "Nordic Noir",
    "Occult Ritual",
    "Industrial Morgue",
    "Cyber Thriller",
    "Vampiric Catacombs"
]

var DARK_PALETTE_START_INDEX = 30

var PALETTES = [
    ["#ff007f", "#00f5d4", "#fee440", "#9b5de5", "#00bbf9", "#f15bb5"],
    ["#00f5ff", "#ff2a85", "#7b2cbf", "#38b000", "#ffbe0b", "#4cc9f0"],
    ["#ff4800", "#ff9e00", "#ff0055", "#ffd000", "#ff6d00", "#ff206e"],
    ["#00f5d4", "#38bdf8", "#a78bfa", "#4ade80", "#f472b6", "#2dd4bf"],
    ["#c084fc", "#f472b6", "#38bdf8", "#818cf8", "#e879f9", "#22d3ee"],
    ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6", "#06b6d4"],
    ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#22d3ee"],
    ["#ef4444", "#f97316", "#f43f5e", "#eab308", "#ec4899", "#dc2626"],
    ["#fbbf24", "#f59e0b", "#fde047", "#38bdf8", "#f472b6", "#fb923c"],
    ["#2dd4bf", "#38bdf8", "#818cf8", "#c084fc", "#4ade80", "#60a5fa"],
    ["#ff00a0", "#00f0ff", "#7a04eb", "#fe75fe", "#ff124f", "#05d9e8"],
    ["#00ffff", "#7df9ff", "#b5179e", "#4cc9f0", "#f72585", "#4361ee"],
    ["#ccff00", "#00ff66", "#ff0055", "#faff00", "#10b981", "#7c3aed"],
    ["#ff2a6d", "#ff9e00", "#d1f7ff", "#05d9e8", "#7700a6", "#ffbe0b"],
    ["#67e8f9", "#f472b6", "#c084fc", "#fde047", "#34d399", "#fb7185"],
    ["#ff007f", "#ffbe0b", "#8338ec", "#3a86ff", "#fb5607", "#06d6a0"],
    ["#00f5d4", "#00bbf9", "#e0fbfc", "#38bdf8", "#818cf8", "#90e0ef"],
    ["#ff1744", "#ff6d00", "#ffea00", "#d50000", "#ff9100", "#ff3d00"],
    ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96", "#f687b3"],
    ["#f72585", "#4cc9f0", "#ffd166", "#7209b7", "#06d6a0", "#ef476f"],
    ["#4ade80", "#a3e635", "#2dd4bf", "#facc15", "#38bdf8", "#c084fc"],
    ["#f8fafc", "#ff1e38", "#00e5ff", "#e2e8f0", "#f43f5e", "#38bdf8"],
    ["#d8b4fe", "#a855f7", "#f472b6", "#818cf8", "#e879f9", "#60a5fa"],
    ["#ff9f1c", "#ffbf69", "#e71d36", "#2ec4b6", "#cbf3f0", "#ff595e"],
    ["#a5f3fc", "#f9a8d4", "#d8b4fe", "#fde68a", "#6ee7b7", "#93c5fd"],
    ["#a3e635", "#22c55e", "#eab308", "#06b6d4", "#d9f99d", "#14b8a6"],
    ["#38bdf8", "#f43f5e", "#fbbf24", "#a855f7", "#2dd4bf", "#ffffff"],
    ["#ff0054", "#ff5400", "#ffbd00", "#9e0059", "#390099", "#ff85a1"],
    ["#00e5ff", "#0077b6", "#48cae4", "#00f5d4", "#7209b7", "#90e0ef"],
    ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c"],
    ["#7f1d1d", "#991b1b", "#450a0a", "#78716c", "#b91c1c", "#292524"],
    ["#475569", "#94a3b8", "#78350f", "#64748b", "#b45309", "#334155"],
    ["#94a3b8", "#cbd5e1", "#991b1b", "#475569", "#64748b", "#1e293b"],
    ["#b91c1c", "#dc2626", "#4c0519", "#a16207", "#1e1b4b", "#881337"],
    ["#365314", "#4d7c0f", "#713f12", "#3f6212", "#52525b", "#1a2e05"],
    ["#115e59", "#134e4a", "#3b0764", "#0f766e", "#4c1d95", "#042f2e"],
    ["#7c2d12", "#9a3412", "#57534e", "#a8a29e", "#44403c", "#431407"],
    ["#1e3a8a", "#334155", "#64748b", "#0f172a", "#475569", "#1e293b"],
    ["#581c87", "#7f1d1d", "#854d0e", "#3b0764", "#a16207", "#450a0a"],
    ["#0f766e", "#475569", "#64748b", "#115e59", "#334155", "#134e4a"],
    ["#155e75", "#991b1b", "#334155", "#0e7490", "#7f1d1d", "#1e293b"],
    ["#881337", "#4c0519", "#78716c", "#9f1239", "#57534e", "#27272a"]
]

function isDarkMoodPalette(paletteIndex) {
    var palIdx = ((Number(paletteIndex) || 0) % PALETTES.length + PALETTES.length) % PALETTES.length
    return palIdx >= DARK_PALETTE_START_INDEX
}

var BRAILLE_MUTANTS = ["⣿", "⣷", "⣯", "⣟", "⡿", "⢿", "⣻", "⣽", "⣾", "⢕", "⢝", "⢕", "✦", "◈", "⟡", "░", "▒", "▓", "█"]
var varBRAILLE_MUTANTS = BRAILLE_MUTANTS

// Precomputed 4096-entry Fast Trig Lookup Table for inner-loop 3D projection & wave evaluation
var LUT_SIZE = 4096
var LUT_MASK = 4095
var LUT_FACTOR = 4096.0 / (Math.PI * 2.0)
var SIN_LUT = []
var COS_LUT = []
for (var _lutIdx = 0; _lutIdx < LUT_SIZE; _lutIdx++) {
    var _lutAng = (_lutIdx / LUT_SIZE) * Math.PI * 2.0
    SIN_LUT.push(Math.sin(_lutAng))
    COS_LUT.push(Math.cos(_lutAng))
}

function fastSin(rad) {
    return SIN_LUT[(Math.floor(rad * LUT_FACTOR) & LUT_MASK)]
}

function fastCos(rad) {
    return COS_LUT[(Math.floor(rad * LUT_FACTOR) & LUT_MASK)]
}

function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v)
}

function lerp(a, b, t) {
    return a + (b - a) * t
}

function smoothstep(edge0, edge1, x) {
    if (edge0 > edge1) {
        return 1.0 - smoothstep(edge1, edge0, x)
    }
    var t = clamp((x - edge0) / Math.max(0.00001, edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)
}

function hslToHex(h, s, l, a) {
    h = ((h % 360) + 360) % 360
    s = clamp(s, 0, 1)
    l = clamp(l, 0, 1)
    var c = (1 - Math.abs(2 * l - 1)) * s
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    var m = l - c / 2
    var r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    var ri = Math.round((r + m) * 255)
    var gi = Math.round((g + m) * 255)
    var bi = Math.round((b + m) * 255)
    if (a !== undefined && a < 0.999) {
        return "rgba(" + ri + "," + gi + "," + bi + "," + clamp(a, 0, 1).toFixed(3) + ")"
    }
    return "rgb(" + ri + "," + gi + "," + bi + ")"
}

function colourWithAlpha(col, alpha) {
    var a = clamp(alpha, 0, 1).toFixed(3)
    if (!col) return "rgba(110,231,183," + a + ")"
    if (typeof col === "object" && col.r !== undefined) {
        return "rgba(" + Math.round(col.r * 255) + "," + Math.round(col.g * 255) + "," + Math.round(col.b * 255) + "," + a + ")"
    }
    var s = col.toString()
    if (s.charAt(0) === "#" && s.length >= 7) {
        var offset = s.length === 9 ? 3 : 1
        var r = parseInt(s.slice(offset, offset + 2), 16)
        var g = parseInt(s.slice(offset + 2, offset + 4), 16)
        var b = parseInt(s.slice(offset + 4, offset + 6), 16)
        return "rgba(" + r + "," + g + "," + b + "," + a + ")"
    }
    if (s.indexOf("rgb(") === 0) {
        return "rgba(" + s.slice(4, -1) + "," + a + ")"
    }
    return s
}

function parseRgbTriplet(col) {
    if (!col) return [110, 231, 183]
    if (typeof col === "object" && col.r !== undefined) {
        return [Math.round(col.r * 255), Math.round(col.g * 255), Math.round(col.b * 255)]
    }
    var s = col.toString()
    if (s.charAt(0) === "#" && s.length >= 7) {
        var offset = s.length === 9 ? 3 : 1
        return [
            parseInt(s.slice(offset, offset + 2), 16) || 0,
            parseInt(s.slice(offset + 2, offset + 4), 16) || 0,
            parseInt(s.slice(offset + 4, offset + 6), 16) || 0
        ]
    }
    if (s.indexOf("rgb(") === 0) {
        var parts = s.slice(4, -1).split(",")
        if (parts.length >= 3) {
            return [parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, parseInt(parts[2], 10) || 0]
        }
    }
    return [110, 231, 183]
}

function mixHexColours(colA, colB, t) {
    var f = clamp(Number(t) || 0, 0, 1)
    var a = parseRgbTriplet(colA)
    var b = parseRgbTriplet(colB)
    var r = Math.round(a[0] + (b[0] - a[0]) * f)
    var g = Math.round(a[1] + (b[1] - a[1]) * f)
    var bl = Math.round(a[2] + (b[2] - a[2]) * f)
    return "rgb(" + r + "," + g + "," + bl + ")"
}

function rgbToHsl(col) {
    var rgb = parseRgbTriplet(col)
    var r = (rgb[0] || 0) / 255
    var g = (rgb[1] || 0) / 255
    var b = (rgb[2] || 0) / 255
    var maxC = Math.max(r, g, b)
    var minC = Math.min(r, g, b)
    var h = 0
    var s = 0
    var l = (maxC + minC) * 0.5
    if (maxC !== minC) {
        var d = maxC - minC
        s = l > 0.5 ? d / (2 - maxC - minC) : d / (maxC + minC)
        if (maxC === r) {
            h = ((g - b) / d + (g < b ? 6 : 0)) * 60
        } else if (maxC === g) {
            h = ((b - r) / d + 2) * 60
        } else {
            h = ((r - g) / d + 4) * 60
        }
    }
    return [((h % 360) + 360) % 360, clamp(s, 0, 1), clamp(l, 0, 1)]
}

function hueDistanceDeg(h1, h2) {
    var diff = Math.abs((((h1 - h2) % 360) + 540) % 360 - 180)
    return diff
}

function deriveDistinctTypographyTriad(pal, baseIdx, slotIdx, anchorIdx) {
    var palLen = Math.max(1, pal ? pal.length : 1)
    var rawCh = pal[baseIdx % palLen] || "#38BDF8"
    var rawAlt = pal[(baseIdx + 2) % palLen] || "#F43F5E"
    var rawAcc = pal[(baseIdx + 4) % palLen] || "#FDE047"
    var rawAnchor = pal[(anchorIdx !== undefined ? anchorIdx : 0) % palLen] || rawCh

    var hslAnchor = rgbToHsl(rawAnchor)
    var hslCh = rgbToHsl(rawCh)
    var hslAlt = rgbToHsl(rawAlt)
    var hslAcc = rgbToHsl(rawAcc)

    // Detect dark/moody atmospheric palettes (Horror, Gritty Drama, Noir, Thriller, etc.)
    // so we preserve their desaturated/low-key tonal mood instead of boosting to neon rainbow!
    var isMoodyPal = (hslCh[2] < 0.46 && hslAlt[2] < 0.46)
    if (isMoodyPal) {
        var moodyLTargets = [0.64, 0.50, 0.56, 0.60]
        var moodyLTarget = moodyLTargets[slotIdx % moodyLTargets.length]
        var mSCh = clamp(hslCh[1] * 1.05, 0.08, 0.78)
        var mLCh = clamp(hslCh[2] * 0.55 + moodyLTarget * 0.45, 0.36, 0.70)
        var mSAlt = clamp(hslAlt[1] * 1.05, 0.08, 0.76)
        var mLAlt = clamp(hslAlt[2] * 0.65 + 0.24 * 0.35, 0.18, 0.46)
        var mSAcc = clamp(hslAcc[1] * 1.08, 0.10, 0.82)
        var mLAcc = clamp(hslAcc[2] * 0.50 + 0.58 * 0.50, 0.38, 0.72)
        return {
            colCh: hslToHex(hslCh[0], mSCh, mLCh),
            colAlt: hslToHex(hslAlt[0], mSAlt, mLAlt),
            colAcc: hslToHex(hslAcc[0], mSAcc, mLAcc)
        }
    }

    var hCh = hslCh[0]
    var sCh = clamp(Math.max(hslCh[1], 0.88), 0.82, 1.0)
    var lTargets = [0.76, 0.62, 0.68, 0.72]
    var lTarget = lTargets[slotIdx % lTargets.length]
    var lCh = clamp(hslCh[2] * 0.35 + lTarget * 0.65, 0.56, 0.86)

    // If this line/character swatch is too close in hue to the anchor swatch (monochromatic palette),
    // rotate hue by 68 deg per slot so adjacent lines/letters remain unmistakably distinct.
    if (slotIdx > 0 && hueDistanceDeg(hCh, hslAnchor[0]) < 52) {
        hCh = (hslAnchor[0] + slotIdx * 68) % 360
    }

    // Ensure the 3D extrusion / outer rim (colAlt) has >= 95 deg hue separation from the letter face (colCh)
    var hAlt = hslAlt[0]
    if (hueDistanceDeg(hAlt, hCh) < 95) {
        hAlt = (hCh + 125) % 360
    }
    var sAlt = clamp(Math.max(hslAlt[1], 0.90), 0.84, 1.0)
    var lAlt = clamp(hslAlt[2] * 0.35 + 0.54 * 0.65, 0.48, 0.66)

    // Ensure the highlight / third bevel (colAcc) is separated from both colCh and colAlt
    var hAcc = hslAcc[0]
    if (hueDistanceDeg(hAcc, hCh) < 85 || hueDistanceDeg(hAcc, hAlt) < 65) {
        hAcc = (hCh + 225) % 360
    }
    var sAcc = clamp(Math.max(hslAcc[1], 0.92), 0.86, 1.0)
    var lAcc = clamp(hslAcc[2] * 0.35 + 0.68 * 0.65, 0.58, 0.82)

    return {
        colCh: hslToHex(hCh, sCh, lCh),
        colAlt: hslToHex(hAlt, sAlt, lAlt),
        colAcc: hslToHex(hAcc, sAcc, lAcc)
    }
}


function buildPalette(theme, hueShift, paletteIndex) {
    var palIdx = ((Number(paletteIndex) || 0) % PALETTES.length + PALETTES.length) % PALETTES.length
    var preset = PALETTES[palIdx] || PALETTES[0]
    var h = Number(hueShift) || 0
    if (palIdx >= DARK_PALETTE_START_INDEX) {
        // Dark Horror, Gritty Drama, Noir & Thriller palettes:
        // Derive all 16 slots directly from the 6 dark swatches with subtle atmospheric drift,
        // avoiding bright neon rainbow HSL injection in slots 6..15.
        var darkOut = [
            preset[0],
            preset[1],
            preset[2],
            preset[3],
            preset[4],
            preset[5]
        ]
        var driftDeg = Math.sin((h * Math.PI) / 180.0) * 12.0
        for (var di = 6; di < 16; di++) {
            var baseHex = preset[di % 6]
            var dHsl = rgbToHsl(baseHex)
            var lDelta = ((di % 3) - 1) * 0.06
            var sScale = (di % 2 === 0) ? 0.92 : 1.06
            darkOut.push(hslToHex(
                dHsl[0] + driftDeg * ((di % 2 === 0) ? 1.0 : -0.7),
                clamp(dHsl[1] * sScale, 0.06, 0.78),
                clamp(dHsl[2] + lDelta, 0.12, 0.54)
            ))
        }
        return darkOut
    }
    return [
        preset[0],
        preset[1],
        preset[2],
        preset[3],
        preset[4],
        preset[5],
        (theme && theme.accent) ? theme.accent.toString() : "#6ee7b7",
        (theme && theme.urgent) ? theme.urgent.toString() : "#f472b6",
        hslToHex(h, 0.96, 0.58),
        hslToHex(h + 45, 0.96, 0.60),
        hslToHex(h + 95, 0.95, 0.58),
        hslToHex(h + 145, 0.94, 0.60),
        hslToHex(h + 195, 0.96, 0.62),
        hslToHex(h + 245, 0.95, 0.60),
        hslToHex(h + 295, 0.96, 0.62),
        hslToHex(h + 335, 0.98, 0.68)
    ]
}

function createState() {
    var smooth = []
    var peaks = []
    var waveHist = []
    for (var i = 0; i < 64; i++) {
        smooth.push(0.04)
        peaks.push(0.06)
    }
    for (var wh = 0; wh < 18; wh++) {
        var snap = []
        for (var b = 0; b < 32; b++) snap.push(0.05)
        waveHist.push({
            bands: snap,
            bass: 0.05,
            mid: 0.05,
            high: 0.05,
            hue: (wh * 20) % 360
        })
    }

    var eqRidgeHist = []
    for (var rh = 0; rh < 24; rh++) {
        var rBins = []
        for (var rb = 0; rb < 36; rb++) rBins.push(0.05)
        eqRidgeHist.push({
            bins: rBins,
            bass: 0.05,
            energy: 0.05,
            hue: (rh * 15) % 360
        })
    }

    var stars = []
    for (var s = 0; s < 140; s++) {
        stars.push({
            x: (Math.random() - 0.5) * 2.2,
            y: (Math.random() - 0.5) * 2.2,
            z: Math.random() * 0.95 + 0.05,
            pz: 1.0,
            hue: (s * 29) % 360
        })
    }

    var shockwaves = []
    var flames = []
    for (var f = 0; f < 48; f++) {
        flames.push({
            x: f / 47.0,
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.04,
            vy: 0.25 + Math.random() * 0.35,
            energy: 0.2,
            hueOffset: (f * 15) % 360
        })
    }

    return {
        t: 0.0,
        l1Time: 0.0,
        eqSpinTime: 0.0,
        backdropTime: 0.0,
        driftTime: 0.0,
        zoomTime: 0.0,
        tunnelTime: 0.0,
        matrixTime: 0.0,
        phase: 0.0,
        hueShift: 0.0,
        rollingPeak: 120.0,
        silentFrames: 0,
        smoothBands: smooth,
        peakBands: peaks,
        waveHistory: waveHist,
        eqRidgeHistory: eqRidgeHist,
        eqRidgeStepIdx: 0,
        waveform: [],
        bass: 0.0,
        mid: 0.0,
        high: 0.0,
        bassSmooth: 0.0,
        midSmooth: 0.0,
        highSmooth: 0.0,
        energySmooth: 0.0,
        beatSmooth: 0.0,
        bassFast: 0.08,
        bassSlow: 0.08,
        midFast: 0.08,
        midSlow: 0.08,
        trebFast: 0.08,
        trebSlow: 0.08,
        bassAtt: 1.0,
        midAtt: 1.0,
        trebAtt: 1.0,
        energy: 0.0,
        kickFast: 0.0,
        kickSlow: 0.0,
        snareFast: 0.0,
        snareSlow: 0.0,
        beatPulse: 0.0,
        beatFlash: 0.0,
        beatCooldown: 0.0,
        beatCount: 0,
        rotPolarity: 1.0,
        avsHarmonics: { m: 3, n: 5, k: 2, twist: 1.4, style: 0 },
        avsTarget: { m: 3, n: 5, k: 2, twist: 1.4, style: 0 },
        stars: stars,
        shockwaves: shockwaves,
        flames: flames,
        artSourceKey: "",
        artCells: [],
        artRows: 0,
        artCols: 0,
        artBurst: 0.0,
        clearFeedbackFrames: 0,
        lastL1: true,
        lastL2: true,
        lastL3: true,
        lastFrameMs: 0.0,
        tronHeading: 0,
        tronYaw: 0.0,
        tronYawVel: 0.0,
        tronBikeYaw: 0.0,
        tronTargetYaw: 0.0,
        tronTurnRoll: 0.0,
        tronX: 0.0,
        tronZ: 0.0,
        tronCamX: 0.0,
        tronCamZ: -290.0,
        tronTurnTimer: 1.85,
        tronTurnSeq: 0,
        tronTrail: [[0.0, -400.0], [0.0, 0.0]],
        tronRivalHeading: 0,
        tronRivalYaw: 0.0,
        tronRivalTargetYaw: 0.0,
        tronRivalX: 160.0,
        tronRivalZ: 80.0,
        tronRivalTurnTimer: 1.10,
        tronRivalTurnSeq: 2,
        tronRivalTrail: [[160.0, -320.0], [160.0, 80.0]]
    }
}

function rgbToHex(r, g, b) {
    var ri = clamp(Math.round(r), 0, 255)
    var gi = clamp(Math.round(g), 0, 255)
    var bi = clamp(Math.round(b), 0, 255)
    return "#"
        + (ri < 16 ? "0" : "") + ri.toString(16)
        + (gi < 16 ? "0" : "") + gi.toString(16)
        + (bi < 16 ? "0" : "") + bi.toString(16)
}

function rebuildArtCells(state, asciiLines, mode) {
    if (!asciiLines || asciiLines.length === 0) {
        state.artCells = []
        state.artSourceKey = ""
        return
    }
    var cleanLines = []
    var embeddedModelJson = ""
    for (var li = 0; li < asciiLines.length; li++) {
        var rawL = String(asciiLines[li] || "")
        if (rawL.indexOf("#ARTMODEL:") === 0) {
            embeddedModelJson = rawL.slice(10)
        } else {
            cleanLines.push(rawL)
        }
    }
    if (cleanLines.length === 0 && !embeddedModelJson) {
        state.artCells = []
        state.artSourceKey = ""
        return
    }

    var lineHash = 5381
    for (var hi = 0; hi < cleanLines.length; hi++) {
        var hLine = cleanLines[hi] || ""
        for (var hj = 0; hj < hLine.length; hj += 2) {
            lineHash = (((lineHash << 5) + lineHash) + hLine.charCodeAt(hj)) | 0
        }
    }
    if (embeddedModelJson) {
        lineHash = (((lineHash << 5) + lineHash) + embeddedModelJson.length) | 0
    }
    var seedSuffix = ":" + (state.artInterpretationSeed || 0)
    var key = (mode || "braille") + ":" + cleanLines.length + ":" + lineHash + ":" + (cleanLines[0] || "").slice(0, 28) + seedSuffix
    if (key === state.artSourceKey && state.artCells && state.artCells.length > 0) {
        return
    }
    state.artSourceKey = key
    state.artInterpretationVariant = ((state.artInterpretationVariant || 0) + 1) % 12

    var isWordsMode = String(mode || "").indexOf("words:") === 0
    var parsedModel = null
    if (embeddedModelJson && !isWordsMode) {
        try {
            var pm = JSON.parse(embeddedModelJson)
            if (pm && pm.cells && pm.cells.length > 0) {
                parsedModel = pm
            }
        } catch (e) {
            parsedModel = null
        }
    }

    // Path A: Rich Mathematical Art Model extracted from original full-colour album art
    if (parsedModel) {
        var mCols = Math.max(16, Number(parsedModel.cols) || 48)
        var mRows = Math.max(10, Number(parsedModel.rows) || 28)
        state.artCols = mCols
        state.artRows = mRows
        state.artModel = parsedModel
        state.artQuadtree = parsedModel.quadtree || []
        state.artShards = parsedModel.shards || []

        var rawClusters = parsedModel.clusters || []
        var clusterHexes = []
        for (var ci = 0; ci < rawClusters.length; ci++) {
            var rc = rawClusters[ci]
            if (Array.isArray(rc) && rc.length >= 3) {
                clusterHexes.push(rgbToHex(rc[0], rc[1], rc[2]))
            }
        }
        state.artClusters = clusterHexes

        var variantShift = state.artInterpretationVariant || 0
        var zPolarity = (variantShift % 2 === 0) ? 1.0 : -1.0
        var rawCells = parsedModel.cells || []
        var mCount = Math.min(1200, rawCells.length)
        var modelCells = []

        for (var mi = 0; mi < mCount; mi++) {
            var mc = rawCells[mi]
            if (!mc || mc.length < 12) continue
            var gx = Number(mc[0]) || 0
            var gy = Number(mc[1]) || 0
            var r255 = clamp(Number(mc[2]) || 180, 0, 255)
            var g255 = clamp(Number(mc[3]) || 180, 0, 255)
            var b255 = clamp(Number(mc[4]) || 180, 0, 255)
            var sal = clamp((Number(mc[5]) || 50) / 100.0, 0.05, 1.0)
            var edge = clamp((Number(mc[6]) || 30) / 100.0, 0.0, 1.0)
            var tangRad = ((Number(mc[7]) || 0) * Math.PI) / 180.0
            var zDep = clamp(((Number(mc[8]) || 0) / 100.0) * zPolarity, -1.0, 1.0)
            var clusId = clamp(Number(mc[9]) || 0, 0, 7)
            var contLvl = ((Number(mc[10]) || 0) + variantShift) & 7
            var dogVal = clamp((Number(mc[11]) || 0) / 100.0, -1.0, 1.0)

            var rN = r255 / 255.0
            var gN = g255 / 255.0
            var bN = b255 / 255.0
            var luma = clamp(0.299 * rN + 0.587 * gN + 0.114 * bN, 0.05, 1.0)
            var cMax = Math.max(rN, gN, bN)
            var cMin = Math.min(rN, gN, bN)
            var dlt = cMax - cMin
            var sat = cMax > 0.001 ? (dlt / cMax) : 0.0
            var hueDeg = 0.0
            if (dlt > 0.001) {
                if (cMax === rN) hueDeg = (((gN - bN) / dlt) % 6.0) * 60.0
                else if (cMax === gN) hueDeg = (((bN - rN) / dlt) + 2.0) * 60.0
                else hueDeg = (((rN - gN) / dlt) + 4.0) * 60.0
                if (hueDeg < 0) hueDeg += 360.0
            }
            var thermal = clamp((rN - bN) * (0.55 + 0.45 * sat), -1.0, 1.0)

            var nxCoord = (gx / Math.max(1, mCols - 1)) * 2.0 - 1.0
            var nyCoord = (gy / Math.max(1, mRows - 1)) * 2.0 - 1.0
            var distC = Math.sqrt(nxCoord * nxCoord + nyCoord * nyCoord)
            var angC = Math.atan2(nyCoord, nxCoord)
            var evoXM = nxCoord + Math.cos(tangRad + distC * 3.5) * 0.024
            var evoYM = nyCoord + Math.sin(tangRad - distC * 3.5) * 0.024

            var normX = -Math.sin(tangRad) * edge
            var normY = Math.cos(tangRad) * edge
            var normZ = Math.sqrt(Math.max(0.15, 1.0 - normX * normX - normY * normY))
            var densEquiv = clamp(0.35 + sal * 0.42 + edge * 0.23, 0.18, 1.0)
            var bMask = (((gx * 17 + gy * 31 + Math.round(sal * 15)) & 0xFF) | 0x18)

            modelCells.push({
                gx: gx,
                gy: gy,
                homeX: nxCoord,
                homeY: nyCoord,
                evoX: evoXM,
                evoY: evoYM,
                x: nxCoord,
                y: nyCoord,
                vx: 0.0,
                vy: 0.0,
                ch: sal > 0.72 ? "█" : (edge > 0.48 ? "▓" : "▒"),
                brailleMask: bMask,
                mutCh: BRAILLE_MUTANTS[mi % BRAILLE_MUTANTS.length],
                density: densEquiv,
                r: r255,
                g: g255,
                b: b255,
                hexCol: rgbToHex(r255, g255, b255),
                vividHexCol: hslToHex(hueDeg, clamp(0.68 + sat * 0.32, 0.65, 1.0), clamp(0.44 + luma * 0.28, 0.40, 0.74)),
                hue: hueDeg,
                sat: sat,
                luma: luma,
                thermal: thermal,
                salience: sal,
                edgeMag: edge,
                tangentRad: tangRad,
                zDepth: zDep,
                clusterId: clusId,
                contourLvl: contLvl,
                dogVal: dogVal,
                normX: normX,
                normY: normY,
                normZ: normZ,
                colIdx: clusId % 8,
                phase: (mi * 0.137 + variantShift * 0.52) % (Math.PI * 2),
                alive: 1.0
            })
        }
        state.artCells = modelCells
        return
    }

    var rows = cleanLines.length
    var cols = 0
    for (var r = 0; r < rows; r++) {
        if (cleanLines[r] && cleanLines[r].length > cols) cols = cleanLines[r].length
    }
    state.artRows = rows
    state.artCols = Math.max(1, cols)

    // Sample non-blank cells (up to 960 for ASCII banner words so zero letter strokes are dropped, 560 for cover art)
    var candidates = []
    for (var y = 0; y < rows; y++) {
        var line = cleanLines[y] || ""
        for (var x = 0; x < line.length; x++) {
            var ch = line.charAt(x)
            if (ch === " " || ch === "⠀") continue
            var code = ch.charCodeAt(0)
            var density = 0.72
            var brailleMask = 0
            if (code >= 0x2800 && code <= 0x28FF) {
                brailleMask = code - 0x2800
                var pop = 0
                for (var b = 0; b < 8; b++) {
                    if ((brailleMask >> b) & 1) pop++
                }
                if (pop <= 1) continue
                density = pop / 8.0
            } else if (ch === "▀") {
                density = 0.68
                brailleMask = 0x1B // top 4 Braille dots (dots 1, 2, 4, 5)
            } else if (ch === "▄") {
                density = 0.68
                brailleMask = 0xE4 // bottom 4 Braille dots (dots 3, 6, 7, 8)
            } else if (ch === "▌") {
                density = 0.68
                brailleMask = 0x47 // left column 4 Braille dots (dots 1, 2, 3, 7)
            } else if (ch === "▐") {
                density = 0.68
                brailleMask = 0xB8 // right column 4 Braille dots (dots 4, 5, 6, 8)
            } else if (ch === "░" || ch === "." || ch === "·") {
                density = 0.35
                brailleMask = 0x09 // diagonal sparse Braille dots
            } else if (ch === "▒" || ch === ":") {
                density = 0.62
                brailleMask = 0x5A // checkerboard 4 Braille dots
            } else if (ch === "▓") {
                density = 0.85
                brailleMask = 0x7F // 7 Braille dots
            } else if (ch === "█") {
                density = 1.0
                brailleMask = 0xFF // all 8 Braille dots (⣿)
            } else {
                density = 0.80
                brailleMask = 0xFF
            }
            var nx = (x / Math.max(1, cols - 1)) * 2.0 - 1.0
            var ny = (y / Math.max(1, rows - 1)) * 2.0 - 1.0
            candidates.push({
                gx: x,
                gy: y,
                nx: nx,
                ny: ny,
                ch: ch,
                brailleMask: brailleMask,
                density: density
            })
        }
    }

    var maxParticles = 460
    var stride = candidates.length > maxParticles ? (candidates.length / maxParticles) : 1.0
    var cells = []
    var count = Math.min(maxParticles, candidates.length)
    var fbVariant = state.artInterpretationVariant || 0
    for (var i = 0; i < count; i++) {
        var c = candidates[Math.min(candidates.length - 1, Math.floor(i * stride))]
        var dist = Math.sqrt(c.nx * c.nx + c.ny * c.ny)
        var ang = Math.atan2(c.ny, c.nx)
        var evoX = c.nx + Math.cos(ang * 3.0 + dist * 4.0) * 0.08
        var evoY = c.ny + Math.sin(ang * 3.0 - dist * 4.0) * 0.08
        var synthHue = ((ang + Math.PI) / (Math.PI * 2) * 360 + dist * 140 + fbVariant * 30) % 360
        var synthSal = clamp((1.15 - dist * 0.55) * c.density, 0.15, 1.0)
        var synthEdge = clamp(Math.abs(Math.sin(c.gx * 0.65 + c.gy * 0.45)) * 0.65 + (1.0 - c.density) * 0.35, 0.15, 1.0)
        var synthTang = ang + Math.PI * 0.5 + Math.sin(dist * 4.0) * 0.4
        var synthZ = clamp((c.density - 0.5) * 1.4 + Math.cos(dist * 3.5 + fbVariant) * 0.35, -1.0, 1.0)
        var synthClus = (Math.floor(dist * 3.5 + c.density * 3.0) + fbVariant) % 5

        cells.push({
            gx: c.gx,
            gy: c.gy,
            homeX: c.nx,
            homeY: c.ny,
            evoX: evoX,
            evoY: evoY,
            x: c.nx,
            y: c.ny,
            vx: 0.0,
            vy: 0.0,
            ch: c.ch,
            brailleMask: c.brailleMask,
            mutCh: BRAILLE_MUTANTS[i % BRAILLE_MUTANTS.length],
            density: c.density,
            r: Math.round(128 + 120 * Math.cos(synthHue * Math.PI / 180.0)),
            g: Math.round(128 + 120 * Math.cos((synthHue - 120) * Math.PI / 180.0)),
            b: Math.round(128 + 120 * Math.cos((synthHue + 120) * Math.PI / 180.0)),
            hexCol: hslToHex(synthHue, 0.85, 0.56),
            vividHexCol: hslToHex(synthHue, 0.92, 0.60),
            hue: synthHue,
            sat: 0.82,
            luma: c.density,
            thermal: Math.cos(synthHue * Math.PI / 180.0),
            salience: synthSal,
            edgeMag: synthEdge,
            tangentRad: synthTang,
            zDepth: synthZ,
            clusterId: synthClus,
            contourLvl: Math.floor(synthSal * 7.99) & 7,
            dogVal: Math.sin(c.gx * 0.8) * Math.cos(c.gy * 0.8),
            normX: -Math.cos(ang) * 0.5,
            normY: -Math.sin(ang) * 0.5,
            normZ: 0.86,
            colIdx: synthClus,
            phase: (i * 0.137) % (Math.PI * 2),
            alive: 1.0
        })
    }
    state.artCells = cells
}

function triggerArtBurst(state, strength) {
    if (!state) return
    state.artBurst = Math.max(state.artBurst || 0.0, strength || 1.2)
    var cells = state.artCells || []
    for (var i = 0; i < cells.length; i++) {
        var p = cells[i]
        var ang = Math.atan2(p.y, p.x) + (Math.random() - 0.5) * 0.7
        var spd = (0.4 + Math.random() * 0.9) * (strength || 1.0)
        p.vx += Math.cos(ang) * spd
        p.vy += Math.sin(ang) * spd
    }
}

function shatterAlbumArt(state, strength) {
    triggerArtBurst(state, strength)
}

var FRACTAL_POIS = [
    { re: -0.7436439, im:  0.1318259, cRe: -0.745, cIm:  0.186, folds: 2, name: "Seahorse Valley" },
    { re:  0.2817179, im:  0.5771053, cRe:  0.285, cIm:  0.010, folds: 3, name: "Elephant Valley" },
    { re: -0.0880000, im:  0.6540000, cRe: -0.400, cIm:  0.600, folds: 3, name: "Triple Spiral Valley" },
    { re: -1.7492046, im:  0.0000000, cRe: -0.800, cIm:  0.156, folds: 2, name: "Mini-Mandelbrot Island" },
    { re: -0.1225612, im:  0.7448618, cRe: -0.123, cIm:  0.745, folds: 3, name: "Douady Rabbit Spiral" },
    { re: -0.7500000, im:  0.1100000, cRe: -0.750, cIm:  0.110, folds: 2, name: "San Marco Dragon" },
    { re: -0.3905408, im: -0.5867879, cRe: -0.391, cIm: -0.587, folds: 5, name: "Siegel Disc Vortex" },
    { re: -0.1010964, im:  0.9562865, cRe: -0.701, cIm: -0.384, folds: 4, name: "Dendrite Lightning" }
]

function randomiseState(state) {
    if (!state) return
    state.hueShift = (state.hueShift + 65 + Math.random() * 190) % 360
    state.beatCount = (state.beatCount || 0) + 1
    state.avsTarget = {
        m: 1 + Math.floor(Math.random() * 3),
        n: 2 + Math.floor(Math.random() * 3),
        k: 1 + Math.floor(Math.random() * 2),
        twist: 0.6 + Math.random() * 1.2,
        style: Math.floor(Math.random() * 3)
    }
    state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + Math.floor(Math.random() * (FRACTAL_POIS.length - 1))) % FRACTAL_POIS.length
    state.shockwaves = []
    triggerArtBurst(state, 1.15)
}

function stepState(state, rawBands, active, cfg, dt) {
    cfg = normaliseConfig(cfg)
    dt = clamp(Number(dt) || 0.016, 0.004, 0.055)
    if (state) state.lastDt = dt
    var audioSens = clamp(Number(cfg.audioSensitivity) || 1.0, 0.30, 2.50)
    var beatPunch = clamp(Number(cfg.beatPunch) || 1.0, 0.25, 2.00)
    var smoothSpeedMul = clamp(1.45 - clamp(Number(cfg.audioSmoothing) || 0.65, 0.20, 0.92) * 1.15, 0.25, 1.35)
    var reactivity = clamp((Number(cfg.layer2Reactivity) || 1.35) * audioSens, 0.15, 4.5)
    var l2Speed = clamp(Number(cfg.layer2Speed) || 1.0, 0.1, 4.0)
    var chaos = clamp(Number(cfg.layer2Chaos !== undefined ? cfg.layer2Chaos : 0.4), 0.0, 2.0)

    var n = rawBands ? rawBands.length : 0
    var maxRaw = 0.0
    for (var r = 0; r < n; r++) {
        var rv = Number(rawBands[r]) || 0.0
        if (rv > maxRaw) maxRaw = rv
    }
    if (maxRaw > 1.0) {
        state.silentFrames = 0
        state.rollingPeak = (maxRaw > state.rollingPeak)
            ? (state.rollingPeak + (maxRaw - state.rollingPeak) * 0.22)
            : Math.max(60.0, state.rollingPeak * (1.0 - dt * 0.35))
    } else {
        state.silentFrames = (state.silentFrames || 0) + 1
    }

    var denom = Math.max(60.0, state.rollingPeak)
    var useSynthFallback = active && state.silentFrames > 15
    var bassSum = 0.0, midSum = 0.0, highSum = 0.0

    for (var i = 0; i < 64; i++) {
        var norm = 0.0
        if (useSynthFallback) {
            var beatWave = Math.pow(Math.max(0.0, Math.sin(state.t * 2.2)), 4.0)
            var sub = i < 10 ? beatWave * 0.65 : 0.0
            var harm = (0.26 + 0.20 * Math.sin(state.t * 1.4 + i * 0.22) + 0.14 * Math.cos(state.t * 2.1 - i * 0.35))
            norm = clamp((sub + harm) * reactivity * 0.72, 0.03, 1.0)
        } else if (n > 0) {
            var raw = Number(rawBands[i % n]) || 0.0
            norm = clamp(Math.pow(clamp(raw / denom, 0.0, 1.35), 0.72) * reactivity, 0.0, 1.0)
        } else {
            norm = 0.03 + 0.02 * Math.sin(state.t * 1.1 + i * 0.2)
        }
        var prev = state.smoothBands[i] || 0.0
        var attack = norm > prev
            ? clamp(dt * 24.0 * smoothSpeedMul, 0.14, 0.65)
            : clamp(dt * 8.5 * smoothSpeedMul, 0.04, 0.28)
        var s = prev + (norm - prev) * attack
        state.smoothBands[i] = s

        if (s >= (state.peakBands[i] || 0.0)) {
            state.peakBands[i] = s
        } else {
            state.peakBands[i] = Math.max(s, (state.peakBands[i] || 0.0) - dt * 0.42)
        }

        if (i < 10) bassSum += s * (i < 5 ? 1.38 : 0.88)
        else if (i < 34) midSum += s
        else highSum += s
    }

    var bassRaw = clamp(bassSum / 10.5, 0.0, 1.0)
    var midRaw = clamp(midSum / 22.0, 0.0, 1.0)
    var highRaw = clamp(highSum / 28.0, 0.0, 1.0)

    // MilkDrop relative audio attenuation (`bass_att`, `mid_att`, `treb_att`)
    state.bassFast = 0.72 * (state.bassFast || bassRaw) + 0.28 * bassRaw
    state.bassSlow = 0.985 * (state.bassSlow || bassRaw) + 0.015 * bassRaw
    state.midFast = 0.72 * (state.midFast || midRaw) + 0.28 * midRaw
    state.midSlow = 0.985 * (state.midSlow || midRaw) + 0.015 * midRaw
    state.trebFast = 0.72 * (state.trebFast || highRaw) + 0.28 * highRaw
    state.trebSlow = 0.985 * (state.trebSlow || highRaw) + 0.015 * highRaw

    state.bassAtt = clamp(state.bassFast / Math.max(0.035, state.bassSlow), 0.35, 2.6)
    state.midAtt = clamp(state.midFast / Math.max(0.035, state.midSlow), 0.35, 2.6)
    state.trebAtt = clamp(state.trebFast / Math.max(0.035, state.trebSlow), 0.35, 2.6)

    var bass = clamp(bassRaw * (0.58 + 0.42 * state.bassAtt), 0.0, 1.35)
    var mid = clamp(midRaw * (0.58 + 0.42 * state.midAtt), 0.0, 1.35)
    var high = clamp(highRaw * (0.58 + 0.42 * state.trebAtt), 0.0, 1.35)

    state.energy = clamp(bass * 0.50 + mid * 0.32 + high * 0.18, 0.0, 1.15)

    // Asymmetric fast-attack / organic-release macro envelopes driven by relative-attenuated bass/mid/high
    var envAttack = clamp(dt * 18.0 * smoothSpeedMul, 0.12, 0.52)
    var envRelease = clamp(dt * 6.5 * smoothSpeedMul, 0.03, 0.22)
    var prevBassSm = state.bassSmooth || 0.0
    var prevMidSm = state.midSmooth || 0.0
    var prevHighSm = state.highSmooth || 0.0
    var prevEnergySm = state.energySmooth || 0.0
    state.bassSmooth = lerp(prevBassSm, bass, bass > prevBassSm ? envAttack : envRelease)
    state.midSmooth = lerp(prevMidSm, mid, mid > prevMidSm ? envAttack : envRelease)
    state.highSmooth = lerp(prevHighSm, high, high > prevHighSm ? envAttack : envRelease)
    state.energySmooth = lerp(prevEnergySm, state.energy, state.energy > prevEnergySm ? envAttack : envRelease)

    state.bass = state.bassSmooth
    state.mid = state.midSmooth
    state.high = state.highSmooth

    // Dual-envelope onset / beat detector driven directly by un-lagged bassRaw / midRaw transients
    var snareInput = (midRaw * 0.65 + highRaw * 0.35)
    state.kickFast = lerp(state.kickFast || bassRaw, bassRaw, clamp(dt * 26.0, 0.16, 0.70))
    state.kickSlow = lerp(state.kickSlow || bassRaw, bassRaw, clamp(dt * 3.4, 0.02, 0.16))
    state.snareFast = lerp(state.snareFast || snareInput, snareInput, clamp(dt * 24.0, 0.16, 0.68))
    state.snareSlow = lerp(state.snareSlow || snareInput, snareInput, clamp(dt * 3.6, 0.02, 0.16))

    state.beatCooldown = Math.max(0.0, (state.beatCooldown || 0.0) - dt)
    var kickRatio = state.kickSlow > 0.03 ? (state.kickFast / state.kickSlow) : 1.0
    var snareRatio = state.snareSlow > 0.03 ? (state.snareFast / state.snareSlow) : 1.0

    var rawL1Dir = cfg && cfg.layer1Direction !== undefined ? Number(cfg.layer1Direction) : 1
    var l1Dir = (rawL1Dir === 0) ? Math.sin((state.t || 0.0) * 0.45) : (rawL1Dir < 0 ? -1.0 : 1.0)
    state.l1DirSign = l1Dir < 0.0 ? -1.0 : 1.0

    if ((kickRatio > 1.15 && state.kickFast > 0.10 || snareRatio > 1.20 && state.snareFast > 0.13) && state.beatCooldown <= 0.0) {
        var transientBoost = 0.92 + 0.32 * Math.max(0.0, Math.max(kickRatio - 1.0, snareRatio - 1.0))
        state.beatEnv = clamp(beatPunch * transientBoost, 0.35, 2.0)
        state.beatFlash = clamp(beatPunch * transientBoost, 0.35, 2.0)
        state.beatCooldown = 0.19
        state.beatCount = (state.beatCount || 0) + 1
        // Update target harmonics on every 8th beat (low, clean ratios so AVS Scope is never noisy!)
        if (state.beatCount % 8 === 0) {
            state.avsTarget = {
                m: 1 + (state.beatCount % 3),
                n: 2 + ((state.beatCount * 2) % 3),
                k: 1 + (state.beatCount % 2),
                twist: 0.65 + ((state.beatCount * 0.7) % 1.1) * (0.5 + chaos * 0.3),
                style: state.beatCount % 3
            }
        }
        if (state.beatCount % 16 === 0) {
            state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + (state.beatCount % 3)) % FRACTAL_POIS.length
        }
        var shapeDenBeat = clamp(Number(cfg && cfg.layer1ShapeDensity !== undefined ? cfg.layer1ShapeDensity : 1.0), 0.25, 2.5)
        var beatTargetShapes = shapeDenBeat <= 1.5
            ? Math.round(1.0 + Math.pow((shapeDenBeat - 0.25) / 1.25, 1.15) * 4.0)
            : Math.round(5.0 + Math.pow(shapeDenBeat - 1.5, 0.78) * 3.0)
        var maxBeatShapes = Math.max(1, Math.min(9, beatTargetShapes + 1))
        if (state.shockwaves.length < maxBeatShapes) {
            state.shockwaves.push({
                r: l1Dir < 0 ? 1.58 : 0.015,
                alpha: 0.96,
                sizeMul: 0.42 + Math.random() * 0.52,
                speed: 0.24 + Math.random() * 0.38 + state.bassSmooth * 0.24,
                laneX: (Math.random() * 2.0 - 1.0) * 0.58,
                laneY: (Math.random() * 2.0 - 1.0) * 0.44,
                spinX: (Math.random() * 2.0 - 1.0) * 1.5,
                spinY: (Math.random() * 2.0 - 1.0) * 1.5,
                spinZ: (Math.random() * 2.0 - 1.0) * 1.5,
                variant: Math.floor(Math.random() * 6),
                hueOffset: (state.hueShift + state.beatCount * 35 + Math.random() * 50) % 360,
                sides: 3 + Math.floor(Math.random() * 7)
            })
        }
    } else {
        state.beatEnv = Math.max(0.0, (state.beatEnv !== undefined ? state.beatEnv : (state.beatPulse || 0.0)) - dt * 2.8)
        state.beatFlash = Math.max(0.0, state.beatFlash - dt * 4.0)
    }

    var beatTarget = state.beatEnv !== undefined ? state.beatEnv : 0.0
    var prevBeatSm = state.beatSmooth || 0.0
    var beatRate = beatTarget > prevBeatSm
        ? clamp(dt * 28.0 * smoothSpeedMul, 0.28, 0.82)
        : clamp(dt * 8.0 * smoothSpeedMul, 0.06, 0.28)
    state.beatSmooth = lerp(prevBeatSm, beatTarget, beatRate)
    // Preserve punchy beat amplitude while keeping envelopes free of 1-frame discontinuities
    state.beatPulse = Math.max(beatTarget * 0.85, state.beatSmooth)

    // Smoothly interpolate AVS harmonics toward avsTarget instead of snapping integers
    if (!state.avsHarmonics) state.avsHarmonics = { m: 1, n: 2, k: 1, twist: 0.9, style: 0 }
    if (!state.avsTarget) state.avsTarget = { m: 1, n: 2, k: 1, twist: 0.9, style: 0 }
    var harmRate = clamp(dt * 1.2, 0.01, 0.05)
    state.avsHarmonics.m = lerp(state.avsHarmonics.m, state.avsTarget.m, harmRate)
    state.avsHarmonics.n = lerp(state.avsHarmonics.n, state.avsTarget.n, harmRate)
    state.avsHarmonics.k = lerp(state.avsHarmonics.k, state.avsTarget.k, harmRate)
    state.avsHarmonics.twist = lerp(state.avsHarmonics.twist, state.avsTarget.twist, harmRate)
    state.avsHarmonics.style = state.avsTarget.style

    // Smoothly interpolate active Fractal POI coordinates so fractal zoom wanders across random fractal regions
    var targetPoi = FRACTAL_POIS[(state.fractalPoiIndex || 0) % FRACTAL_POIS.length]
    var poiRate = clamp(dt * 0.65, 0.005, 0.03)
    state.fractalRe = lerp(state.fractalRe !== undefined ? state.fractalRe : targetPoi.re, targetPoi.re, poiRate)
    state.fractalIm = lerp(state.fractalIm !== undefined ? state.fractalIm : targetPoi.im, targetPoi.im, poiRate)
    state.fractalCRe = lerp(state.fractalCRe !== undefined ? state.fractalCRe : targetPoi.cRe, targetPoi.cRe, poiRate)
    state.fractalCIm = lerp(state.fractalCIm !== undefined ? state.fractalCIm : targetPoi.cIm, targetPoi.cIm, poiRate)

    state.artBurst = Math.max(0.0, (state.artBurst || 0.0) - dt * 1.4)

    // Music-Driven Parameter Modulation envelopes (`musicDrive`) & Song Track Progress Arc (`trackArcMode`)
    var rawIntensity = clamp(state.energySmooth * 0.68 + state.beatSmooth * 0.22 + (state.bassAtt - 1.0) * 0.15, 0.0, 1.35)
    state.musicIntensity = lerp(state.musicIntensity || 0.35, rawIntensity, clamp(dt * 3.5, 0.02, 0.12))
    state.musicCalm = clamp(1.0 - state.musicIntensity * 0.80, 0.12, 1.0)

    var trackProg = clamp(Number(cfg.trackProgress) || 0.0, 0.0, 1.0)
    var arcMode = cfg.trackArcMode !== undefined ? clamp(Math.round(Number(cfg.trackArcMode)), 0, 4) : 1
    var arcDismantleMul = 1.0
    var arcRebuildMul = 1.0
    var arcEvoBoost = 0.55 * trackProg
    var arcSpeedBoost = 1.0
    state.trackArcChapter = Math.min(3, Math.floor(trackProg * 4.0))

    if (arcMode === 0) {
        var audioSurge = clamp((state.musicIntensity - 0.32) * 1.45 + Math.max(0.0, state.bassAtt - 1.0) * 0.45, 0.0, 1.35)
        arcDismantleMul = 0.45 + 1.15 * audioSurge
        arcRebuildMul = clamp(1.65 - 0.85 * audioSurge, 0.45, 1.85)
        arcEvoBoost = 0.65 * audioSurge
        arcSpeedBoost = 0.82 + 0.48 * audioSurge
    } else if (arcMode === 1) {
        var climaxCurve = Math.sin(Math.pow(trackProg, 0.82) * Math.PI)
        arcDismantleMul = 0.55 + 1.05 * climaxCurve
        arcRebuildMul = 1.35 - 0.65 * climaxCurve + (trackProg > 0.82 ? (trackProg - 0.82) * 3.5 : 0.0)
        arcEvoBoost = 0.78 * climaxCurve
        arcSpeedBoost = 0.85 + 0.35 * climaxCurve
    } else if (arcMode === 2) {
        arcDismantleMul = 0.25 + 1.85 * trackProg
        arcRebuildMul = clamp(1.85 - 1.45 * trackProg, 0.25, 2.2)
        arcEvoBoost = 1.15 * trackProg
        arcSpeedBoost = 0.80 + 0.50 * trackProg
    } else if (arcMode === 3) {
        arcDismantleMul = clamp(1.90 - 1.65 * trackProg, 0.20, 2.2)
        arcRebuildMul = 0.35 + 2.10 * trackProg
        arcEvoBoost = 0.95 * (1.0 - trackProg)
        arcSpeedBoost = 1.25 - 0.35 * trackProg
    } else if (arcMode === 4) {
        var ch = state.trackArcChapter
        arcDismantleMul = (ch === 0 ? 0.65 : (ch === 1 ? 1.15 : (ch === 2 ? 1.65 : 0.75)))
        arcRebuildMul = (ch === 0 ? 1.35 : (ch === 1 ? 0.95 : (ch === 2 ? 0.65 : 1.75)))
        arcEvoBoost = ch * 0.32
        arcSpeedBoost = 0.85 + ch * 0.18
    }

    var mDrive = cfg.musicDrive !== undefined ? Boolean(cfg.musicDrive) : true
    var targetDismantle = mDrive
        ? clamp(cfg.layer3Dismantle * (0.25 + 1.10 * state.musicIntensity + state.beatSmooth * 0.55) * arcDismantleMul, 0.10, 3.50)
        : clamp(cfg.layer3Dismantle * arcDismantleMul, 0.10, 3.50)
    var targetRebuild = mDrive
        ? clamp(cfg.layer3Rebuild * (0.45 + 1.50 * state.musicCalm) * arcRebuildMul, 0.15, 3.50)
        : clamp(cfg.layer3Rebuild * arcRebuildMul, 0.15, 3.50)
    var targetEvolution = mDrive
        ? clamp(cfg.layer3Evolution * (0.40 + 0.95 * state.midSmooth + arcEvoBoost), 0.10, 3.00)
        : clamp(cfg.layer3Evolution * (0.65 + arcEvoBoost), 0.10, 3.00)
    var targetTracerSpeed = mDrive
        ? clamp(cfg.tracerSpeed * (0.65 + 0.65 * state.musicIntensity + state.beatSmooth * 0.25) * arcSpeedBoost, 0.15, 3.00)
        : clamp(cfg.tracerSpeed * arcSpeedBoost, 0.15, 3.00)
    var targetTracerDrift = mDrive
        ? clamp(cfg.tracerDrift * (0.65 + 0.65 * state.midSmooth), 0.0, 2.50)
        : cfg.tracerDrift

    var liveRate = clamp(dt * 3.0, 0.02, 0.10)
    state.liveDismantle = lerp(state.liveDismantle !== undefined ? state.liveDismantle : targetDismantle, targetDismantle, liveRate)
    state.liveRebuild = lerp(state.liveRebuild !== undefined ? state.liveRebuild : targetRebuild, targetRebuild, liveRate)
    state.liveEvolution = lerp(state.liveEvolution !== undefined ? state.liveEvolution : targetEvolution, targetEvolution, liveRate)
    state.liveTracerSpeed = lerp(state.liveTracerSpeed !== undefined ? state.liveTracerSpeed : targetTracerSpeed, targetTracerSpeed, liveRate)
    state.liveTracerDrift = lerp(state.liveTracerDrift !== undefined ? state.liveTracerDrift : targetTracerDrift, targetTracerDrift, liveRate)

    // Smoothly integrated phase accumulators (honours Tri-State l1Dir: +1 Towards, -1 Away, 0 Breathe!)
    var l1Speed = clamp(Number(cfg && cfg.layer1Speed !== undefined ? cfg.layer1Speed : 1.0), 0.05, 4.0)
    var eqSpinCfg = clamp(Number(cfg && cfg.layer1EqSpin !== undefined ? cfg.layer1EqSpin : 1.0), -2.5, 2.5)
    var bdSpeed = clamp(Number(cfg && cfg.backdropSpeed !== undefined ? cfg.backdropSpeed : 1.0), 0.1, 3.0)
    var bdDirCfg = Number(cfg && cfg.backdropDirection !== undefined ? cfg.backdropDirection : (cfg && cfg.layer1Direction !== undefined ? cfg.layer1Direction : 1))
    var bdDir = (bdDirCfg === 0) ? Math.sin((state.t || 0.0) * 0.72) : clamp(bdDirCfg, -1, 1)
    var trSpeedCfg = clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.0), 0.2, 2.5)
    var timeStep = dt * l2Speed * (active ? (0.35 + state.energySmooth * 0.45) : 0.18)
    state.t += timeStep
    state.l1Time = (state.l1Time || 0.0) + dt * l1Speed * l1Dir * (active ? (0.85 + state.bassSmooth * 0.55) : 0.45)
    state.eqSpinTime = (state.eqSpinTime || 0.0) + dt * eqSpinCfg * (active ? (0.85 + state.bassSmooth * 0.55) : 0.45)
    state.backdropTime = (state.backdropTime || 0.0) + dt * bdSpeed * bdDir * (active ? (0.42 + state.energySmooth * 0.45) : 0.22)
    state.driftTime = (state.driftTime || 0.0) + dt * 0.28 * trSpeedCfg
    state.zoomTime = (state.zoomTime || 0.0) + dt * 0.38 * l2Speed * (0.75 + state.bassSmooth * 0.45)
    state.tunnelTime = (state.tunnelTime || 0.0) + dt * 0.52 * l2Speed * trSpeedCfg * (0.72 + state.bassSmooth * 0.42)
    state.matrixTime = (state.matrixTime || 0.0) + dt * 0.65 * l2Speed * (0.75 + state.energySmooth * 0.25)
    state.phase += timeStep * 0.55 * state.rotPolarity
    var colCycleSpd = clamp(Number(cfg && cfg.colourCycleSpeed !== undefined ? cfg.colourCycleSpeed : 1.0), 0.0, 2.5)
    state.hueShift = (state.hueShift + dt * (8.0 + state.energySmooth * 14.0) * colCycleSpd) % 360.0

    // Periodically drift to a new random fractal region every ~14 seconds even without beat triggers
    if (Math.floor((state.t - timeStep) / 14.0) !== Math.floor(state.t / 14.0)) {
        state.fractalPoiIndex = ((state.fractalPoiIndex || 0) + 1 + Math.floor(Math.random() * (FRACTAL_POIS.length - 1))) % FRACTAL_POIS.length
    }

    // Record 32-band snapshot into state.waveHistory ring buffer (for Cthugha 3D Plasma Tunnel)
    if (!state.waveHistory) state.waveHistory = []
    var snapBands = []
    for (var wb = 0; wb < 32; wb++) {
        snapBands.push(state.smoothBands[wb * 2] || 0.04)
    }
    state.waveHistory.unshift({
        bands: snapBands,
        bass: state.bass,
        mid: state.mid,
        high: state.high,
        hue: state.hueShift
    })
    if (state.waveHistory.length > 18) {
        state.waveHistory.length = 18
    }

    // Record 36-bin snapshot into state.eqRidgeHistory synchronised with state.l1Time * 2.8 depth advection
    if (!state.eqRidgeHistory) state.eqRidgeHistory = []
    var liveBins36 = []
    for (var rb36 = 0; rb36 < 36; rb36++) {
        var bIdx36 = Math.min(63, Math.floor((rb36 / 35.0) * 63))
        liveBins36.push(state.smoothBands[bIdx36] || 0.04)
    }
    var curRidgeStep = Math.floor((state.l1Time || 0.0) * 2.8)
    if (state.eqRidgeHistory.length < 24 || curRidgeStep !== state.eqRidgeStepIdx) {
        state.eqRidgeStepIdx = curRidgeStep
        state.eqRidgeHistory.unshift({
            bins: liveBins36,
            bass: state.bass,
            energy: state.energy,
            hue: state.hueShift,
            stepIdx: curRidgeStep
        })
        if (state.eqRidgeHistory.length > 24) {
            state.eqRidgeHistory.length = 24
        }
    } else if (state.eqRidgeHistory.length > 0) {
        state.eqRidgeHistory[0] = {
            bins: liveBins36,
            bass: state.bass,
            energy: state.energy,
            hue: state.hueShift,
            stepIdx: curRidgeStep
        }
    }

    // Step Layer #1 Beat Shapes (`3: Vectors`) — always spawn new shapes at the furthest depth point away
    // so they emerge from the horizon/vanishing point rather than popping in directly in front of the display.
    var shapeSpeed = clamp(Number(cfg && cfg.layer1ShapeSpeed !== undefined ? cfg.layer1ShapeSpeed : 1.0), 0.2, 3.0)
    var shapeDensity = clamp(Number(cfg && cfg.layer1ShapeDensity !== undefined ? cfg.layer1ShapeDensity : 1.0), 0.25, 2.5)
    var shapeLifespan = clamp(Number(cfg && cfg.layer1ShapeLifespan !== undefined ? cfg.layer1ShapeLifespan : 1.0), 0.35, 3.0)
    var lifeRate = 1.0 / Math.max(0.35, shapeLifespan)
    var shapesOn = cfg ? (cfg.layer1ShapesEnabled !== false) : true
    var rawTargetShapes = shapeDensity <= 1.5
        ? Math.round(1.0 + Math.pow((shapeDensity - 0.25) / 1.25, 1.15) * 4.0)
        : Math.round(5.0 + Math.pow(shapeDensity - 1.5, 0.78) * 3.0)
    var targetShapeCount = Math.max(1, Math.min(8, rawTargetShapes))
    var maxShapeCount = Math.max(targetShapeCount, Math.min(9, targetShapeCount + 1))
    if (state.shockwaves.length > maxShapeCount) {
        state.shockwaves.length = maxShapeCount
    }
    if (shapesOn && active && state.shockwaves.length < targetShapeCount) {
        var existingCount = state.shockwaves.length
        var missing = targetShapeCount - existingCount
        for (var ms = 0; ms < missing; ms++) {
            var idxS = state.shockwaves.length
            // If initialising from empty, stagger gently across the far distance (0.015..0.36);
            // if replenishing an expired shape, ALWAYS spawn at the furthest point away (0.015..0.06)!
            var farStagger = (existingCount === 0 && missing > 1)
                ? ((ms / missing) * 0.34)
                : (ms * 0.035)
            var spawnR = l1Dir < 0
                ? clamp(1.58 - farStagger, 1.15, 1.60)
                : clamp(0.015 + farStagger, 0.012, 0.38)
            state.shockwaves.push({
                r: spawnR,
                alpha: 0.96,
                sizeMul: 0.42 + Math.random() * 0.52,
                speed: 0.24 + Math.random() * 0.38 + state.bassSmooth * 0.24,
                laneX: (Math.random() * 2.0 - 1.0) * 0.58,
                laneY: (Math.random() * 2.0 - 1.0) * 0.44,
                spinX: (Math.random() * 2.0 - 1.0) * 1.5,
                spinY: (Math.random() * 2.0 - 1.0) * 1.5,
                spinZ: (Math.random() * 2.0 - 1.0) * 1.5,
                variant: Math.floor(Math.random() * 6),
                hueOffset: (state.hueShift + (state.beatCount + idxS) * 35 + Math.random() * 50) % 360,
                sides: 3 + Math.floor(Math.random() * 7)
            })
        }
    }
    for (var sw = state.shockwaves.length - 1; sw >= 0; sw--) {
        var wave = state.shockwaves[sw]
        wave.r += dt * wave.speed * shapeSpeed * 0.44 * Math.pow(lifeRate, 0.52) * (rawL1Dir === 0 ? (0.25 + 0.75 * l1Dir) : l1Dir)
        wave.alpha -= dt * 0.14 * lifeRate * (0.55 + 0.45 * shapeSpeed)
        if (wave.alpha <= 0.02 || wave.r > 1.65 || wave.r < 0.01) {
            state.shockwaves.splice(sw, 1)
        }
    }

    // Step Layer #1 Starfield (obeying Tri-State l1Dir: Towards, Away, or Breathe!)
    var starVel = dt * l1Speed * (0.22 + state.bassSmooth * 0.65) * l1Dir
    for (var st = 0; st < state.stars.length; st++) {
        var star = state.stars[st]
        star.pz = star.z
        star.z -= starVel
        if (star.z <= 0.03) {
            star.x = (Math.random() - 0.5) * 2.2
            star.y = (Math.random() - 0.5) * 2.2
            star.z = 1.0
            star.pz = 1.0
        } else if (star.z >= 1.0) {
            star.x = (Math.random() - 0.5) * 2.2
            star.y = (Math.random() - 0.5) * 2.2
            star.z = 0.04
            star.pz = 0.04
        }
    }

    // Step Layer #1 Cthugha Flame ribbons (obeying Tri-State l1Dir)
    var flameDir = rawL1Dir === 0 ? (0.35 + 0.65 * Math.abs(l1Dir)) : (l1Dir < 0 ? -1.0 : 1.0)
    for (var fl = 0; fl < state.flames.length; fl++) {
        var fm = state.flames[fl]
        var bIdx = Math.min(63, Math.floor(fm.x * 63))
        var bandE = state.smoothBands[bIdx] || 0.1
        fm.y -= dt * l1Speed * flameDir * (fm.vy * 0.65 + bandE * 0.45 + state.bassSmooth * 0.25)
        fm.x += Math.sin(state.l1Time * 1.2 + fl * 0.5) * dt * 0.04 * (1.0 + state.midSmooth * 0.5)
        fm.energy = lerp(fm.energy, bandE, 0.15)
        if (fm.y < -0.05) {
            fm.y = 1.02
            fm.x = (fl + (Math.random() - 0.5) * 0.6) / 48.0
            fm.energy = bandE
        } else if (fm.y > 1.05) {
            fm.y = -0.02
            fm.x = (fl + (Math.random() - 0.5) * 0.6) / 48.0
            fm.energy = bandE
        }
    }

    // Step Layer #1 TRON 1982 Light Cycle & Rival Light Cycle along true 90-degree (PI/2) orthogonal world grid axes
    // Turns are strictly flat horizontal ground-plane yaw rotations around the vertical Y-axis (zero Z-axis roll!)
    var tronDirsStep = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    // Primarily alternating S-turns so bikes weave across the Game Grid and only occasionally loop back across a jetwall
    var tronTurnChoices = [1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1]
    if (state.tronHeading === undefined) state.tronHeading = 0
    if (state.tronYaw === undefined) state.tronYaw = 0.0
    if (state.tronYawVel === undefined || !isFinite(state.tronYawVel)) state.tronYawVel = 0.0
    if (state.tronBikeYaw === undefined) state.tronBikeYaw = 0.0
    if (state.tronTargetYaw === undefined) state.tronTargetYaw = 0.0
    if (state.tronX === undefined) state.tronX = 0.0
    if (state.tronZ === undefined) state.tronZ = 0.0
    if (state.tronTurnTimer === undefined) state.tronTurnTimer = 1.45
    if (state.tronTurnSeq === undefined) state.tronTurnSeq = 0
    if (state.tronCrashCooldown === undefined) state.tronCrashCooldown = 0.0
    if (state.tronSinceCrash === undefined) state.tronSinceCrash = 0.0
    if (!state.tronCrashes) state.tronCrashes = []
    if (!state.tronTrail || state.tronTrail.length < 2) {
        state.tronTrail = [[state.tronX, state.tronZ - 480.0], [state.tronX, state.tronZ]]
    }
    if (state.tronRivalHeading === undefined) state.tronRivalHeading = 0
    if (state.tronRivalYaw === undefined) state.tronRivalYaw = 0.0
    if (state.tronRivalTargetYaw === undefined) state.tronRivalTargetYaw = 0.0
    if (state.tronRivalX === undefined) state.tronRivalX = 160.0
    if (state.tronRivalZ === undefined) state.tronRivalZ = 80.0
    if (state.tronRivalTurnTimer === undefined) state.tronRivalTurnTimer = 1.05
    if (state.tronRivalTurnSeq === undefined) state.tronRivalTurnSeq = 2
    if (state.tronRivalCrashCooldown === undefined) state.tronRivalCrashCooldown = 0.0
    if (state.tronRivalSinceCrash === undefined) state.tronRivalSinceCrash = 0.0
    if (!state.tronRivalTrail || state.tronRivalTrail.length < 2) {
        state.tronRivalTrail = [[state.tronRivalX, state.tronRivalZ - 400.0], [state.tronRivalX, state.tronRivalZ]]
    }

    if (cfg && cfg.layer1Enabled !== false && cfg.layer1FieldEnabled !== false && Number(cfg.layer1Mode) === 7) {
    // Step active 3D world-space vectored crashes (bikes continue moving without losing flow!)
    for (var ci = state.tronCrashes.length - 1; ci >= 0; ci--) {
        state.tronCrashes[ci].age += dt
        if (state.tronCrashes[ci].age >= state.tronCrashes[ci].maxAge) {
            state.tronCrashes.splice(ci, 1)
        }
    }

    function spawnTronVectorCrash(cx, cz, cyaw, ccol) {
        state.tronCrashes.push({
            x: cx,
            z: cz,
            yaw: cyaw,
            age: 0.0,
            maxAge: 1.55,
            col: ccol
        })
        if (state.tronCrashes.length > 6) {
            state.tronCrashes.shift()
        }
    }

    function checkJetwallHit(ax, az, bx, bz, ownTrail, otherTrail) {
        var hitTol = 14.0
        function segHit(cx, cz, dx, dz) {
            var minABX = Math.min(ax, bx) - hitTol, maxABX = Math.max(ax, bx) + hitTol
            var minABZ = Math.min(az, bz) - hitTol, maxABZ = Math.max(az, bz) + hitTol
            var minCDX = Math.min(cx, dx) - hitTol, maxCDX = Math.max(cx, dx) + hitTol
            var minCDZ = Math.min(cz, dz) - hitTol, maxCDZ = Math.max(cz, dz) + hitTol
            if (maxABX < minCDX || minABX > maxCDX || maxABZ < minCDZ || minABZ > maxCDZ) return null
            var rX = bx - ax, rZ = bz - az
            var sX = dx - cx, sZ = dz - cz
            var denom = rX * sZ - rZ * sX
            if (Math.abs(denom) < 0.001) return null
            var u = ((cx - ax) * rZ - (cz - az) * rX) / denom
            var t = ((cx - ax) * sZ - (cz - az) * sX) / denom
            if (t >= -0.06 && t <= 1.06 && u >= -0.03 && u <= 1.03) {
                return [ax + clamp(t, 0.0, 1.0) * rX, az + clamp(t, 0.0, 1.0) * rZ]
            }
            return null
        }
        // Check own earlier jetwall segments (skip active last segment and immediate prior corner segment)
        if (ownTrail && ownTrail.length >= 4) {
            for (var oi = 0; oi <= ownTrail.length - 4; oi++) {
                var hOwn = segHit(ownTrail[oi][0], ownTrail[oi][1], ownTrail[oi + 1][0], ownTrail[oi + 1][1])
                if (hOwn) return hOwn
            }
        }
        // Check rival/other bike's standing jetwall segments
        if (otherTrail && otherTrail.length >= 2) {
            for (var ti = 0; ti <= otherTrail.length - 2; ti++) {
                var hOth = segHit(otherTrail[ti][0], otherTrail[ti][1], otherTrail[ti + 1][0], otherTrail[ti + 1][1])
                if (hOth) return hOth
            }
        }
        return null
    }

    var tronSpeed = (390.0 + state.bassSmooth * 180.0) * clamp(l1Speed, 0.25, 2.5)
    var pDir = tronDirsStep[state.tronHeading & 3]
    var prevPX = state.tronX, prevPZ = state.tronZ
    state.tronX += pDir[0] * tronSpeed * dt
    state.tronZ += pDir[1] * tronSpeed * dt
    state.tronSinceCrash += dt
    if (state.tronCrashCooldown > 0.0) state.tronCrashCooldown = Math.max(0.0, state.tronCrashCooldown - dt)

    var pHit = (state.tronCrashCooldown <= 0.0)
        ? checkJetwallHit(prevPX, prevPZ, state.tronX, state.tronZ, state.tronTrail, state.tronRivalTrail)
        : null
    if (pHit) {
        // Trigger 3D vectored crash at impact coordinates while Player Light Cycle continues without losing flow!
        spawnTronVectorCrash(pHit[0], pHit[1], state.tronBikeYaw, "#33FFFF")
        state.tronCrashCooldown = 8.5
        state.tronSinceCrash = 0.0
    }
    state.tronTrail[state.tronTrail.length - 1][0] = state.tronX
    state.tronTrail[state.tronTrail.length - 1][1] = state.tronZ
    state.tronTurnTimer -= dt * clamp(l1Speed, 0.4, 1.8)
    var camSettled = Math.abs(state.tronTargetYaw - state.tronYaw) < 0.06
    if ((state.tronTurnTimer <= 0.0 && camSettled) || (state.beatFlash > 0.72 && state.tronTurnTimer < 0.35 && camSettled)) {
        // Snap corner vertex to 80-unit Game Grid intersection and turn the Light Cycle an instant 90 degrees (+PI/2 or -PI/2) around the vertical Y-axis!
        state.tronX = Math.round(state.tronX / 80.0) * 80.0
        state.tronZ = Math.round(state.tronZ / 80.0) * 80.0
        state.tronTrail[state.tronTrail.length - 1][0] = state.tronX
        state.tronTrail[state.tronTrail.length - 1][1] = state.tronZ
        var tSign = tronTurnChoices[state.tronTurnSeq % tronTurnChoices.length]
        if (state.tronSinceCrash > 24.0) {
            // Only occasionally loop back across a jetwall after a long clean run (~24s)
            tSign = 1
        }
        state.tronTurnSeq = (state.tronTurnSeq + 1) % 1024
        state.tronHeading = (state.tronHeading + tSign + 4) & 3
        state.tronTargetYaw += tSign * (Math.PI * 0.5)
        state.tronBikeYaw = state.tronTargetYaw
        state.tronTrail.push([state.tronX, state.tronZ])
        if (state.tronTrail.length > 10) {
            state.tronTrail.shift()
        }
        state.tronTurnTimer = (state.tronSinceCrash > 22.0)
            ? (1.10 + ((state.tronTurnSeq * 19) % 5) * 0.14)
            : (1.65 + ((state.tronTurnSeq * 37) % 7) * 0.16)
    }

    // Bike turn is 100% instantaneous; camera yaw glides smoothly with rate-limited ease-in / ease-out
    state.tronBikeYaw = state.tronTargetYaw
    var yawErr = state.tronTargetYaw - state.tronYaw
    var maxYawRate = 1.80 * clamp(l1Speed, 0.55, 1.40)
    var desiredYawVel = clamp(yawErr * 2.25, -maxYawRate, maxYawRate)
    state.tronYawVel += (desiredYawVel - state.tronYawVel) * Math.min(1.0, dt * 6.0)
    var yawStep = state.tronYawVel * dt
    if (Math.abs(yawStep) >= Math.abs(yawErr) || Math.abs(yawErr) < 0.0005) {
        state.tronYaw = state.tronTargetYaw
        state.tronYawVel = 0.0
    } else {
        state.tronYaw += yawStep
    }
    state.tronTurnRoll = 0.0
    var tronCamDist = 290.0
    var targetTronCamX = state.tronX - Math.sin(state.tronYaw) * tronCamDist
    var targetTronCamZ = state.tronZ - Math.cos(state.tronYaw) * tronCamDist
    if (state.tronCamX === undefined || !isFinite(state.tronCamX)) state.tronCamX = targetTronCamX
    if (state.tronCamZ === undefined || !isFinite(state.tronCamZ)) state.tronCamZ = targetTronCamZ
    state.tronCamX += (targetTronCamX - state.tronCamX) * Math.min(1.0, dt * 5.2)
    state.tronCamZ += (targetTronCamZ - state.tronCamZ) * Math.min(1.0, dt * 5.2)

    // Step Rival Sark Yellow Light Cycle in the same world space (triggers 3D vectored crashes while continuing at full speed!)
    var rDir = tronDirsStep[state.tronRivalHeading & 3]
    var prevRX = state.tronRivalX, prevRZ = state.tronRivalZ
    state.tronRivalX += rDir[0] * tronSpeed * 1.04 * dt
    state.tronRivalZ += rDir[1] * tronSpeed * 1.04 * dt
    state.tronRivalSinceCrash += dt
    if (state.tronRivalCrashCooldown > 0.0) state.tronRivalCrashCooldown = Math.max(0.0, state.tronRivalCrashCooldown - dt)

    var rHit = (state.tronRivalCrashCooldown <= 0.0)
        ? checkJetwallHit(prevRX, prevRZ, state.tronRivalX, state.tronRivalZ, state.tronRivalTrail, state.tronTrail)
        : null
    if (rHit) {
        spawnTronVectorCrash(rHit[0], rHit[1], state.tronRivalYaw, "#FFAA00")
        state.tronRivalCrashCooldown = 8.5
        state.tronRivalSinceCrash = 0.0
    }
    state.tronRivalTrail[state.tronRivalTrail.length - 1][0] = state.tronRivalX
    state.tronRivalTrail[state.tronRivalTrail.length - 1][1] = state.tronRivalZ
    state.tronRivalTurnTimer -= dt * clamp(l1Speed, 0.4, 2.2)
    if (state.tronRivalTurnTimer <= 0.0) {
        state.tronRivalX = Math.round(state.tronRivalX / 80.0) * 80.0
        state.tronRivalZ = Math.round(state.tronRivalZ / 80.0) * 80.0
        state.tronRivalTrail[state.tronRivalTrail.length - 1][0] = state.tronRivalX
        state.tronRivalTrail[state.tronRivalTrail.length - 1][1] = state.tronRivalZ
        var rSign = (state.tronRivalSinceCrash > 20.0) ? -1 : tronTurnChoices[(state.tronRivalTurnSeq + 3) % tronTurnChoices.length]
        state.tronRivalTurnSeq = (state.tronRivalTurnSeq + 1) % 1024
        state.tronRivalHeading = (state.tronRivalHeading + rSign + 4) & 3
        state.tronRivalTargetYaw += rSign * (Math.PI * 0.5)
        state.tronRivalYaw = state.tronRivalTargetYaw
        // Keep rival near the player's arena sector if it drifts too far away
        if (Math.abs(state.tronRivalX - state.tronX) > 960.0 || Math.abs(state.tronRivalZ - state.tronZ) > 960.0) {
            var pFwd = tronDirsStep[state.tronHeading & 3]
            var pRight = [pFwd[1], -pFwd[0]]
            state.tronRivalX = Math.round((state.tronX + pFwd[0] * 160.0 + pRight[0] * 160.0) / 80.0) * 80.0
            state.tronRivalZ = Math.round((state.tronZ + pFwd[1] * 160.0 + pRight[1] * 160.0) / 80.0) * 80.0
            state.tronRivalHeading = state.tronHeading
            state.tronRivalTargetYaw = state.tronTargetYaw
            state.tronRivalYaw = state.tronTargetYaw
            state.tronRivalTrail = [
                [state.tronRivalX - pFwd[0] * 320.0, state.tronRivalZ - pFwd[1] * 320.0],
                [state.tronRivalX, state.tronRivalZ]
            ]
        } else {
            state.tronRivalTrail.push([state.tronRivalX, state.tronRivalZ])
            if (state.tronRivalTrail.length > 10) {
                state.tronRivalTrail.shift()
            }
        }
        state.tronRivalTurnTimer = 1.15 + ((state.tronRivalTurnSeq * 29) % 6) * 0.14
    }
    state.tronRivalYaw = state.tronRivalTargetYaw
    }

    // Step Layer #3 Autonomous Album Art Particle Cells
    if (cfg && cfg.layer3Enabled && state.artCells && state.artCells.length > 0) {
        stepArtCells(state, cfg, dt)
    }
}

function stepArtCells(state, cfg, dt) {
    var cells = state.artCells
    var n = cells.length
    if (n === 0) return

    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var isWordsSource = (cfg.useAlbumArt === false)

    var dismantle = state.liveDismantle !== undefined
        ? state.liveDismantle
        : clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.0, 4.0)
    var rebuild = state.liveRebuild !== undefined
        ? state.liveRebuild
        : clamp(Number(cfg.layer3Rebuild !== undefined ? cfg.layer3Rebuild : 1.0), 0.05, 4.0)
    var evoRate = state.liveEvolution !== undefined
        ? state.liveEvolution
        : clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.65), 0.0, 3.0)

    // Audio-driven & cyclic "Form & Dance -> Dismantle on Drops/Beats -> Reform" envelope:
    var cycleWave = Math.cos(state.t * 0.92)
    var baseForm = clamp((cycleWave + 0.15) / 0.95, 0.0, 1.0)
    var audioExcite = (cfg && cfg.musicDrive !== false)
        ? clamp(state.bassSmooth * 0.58 + state.beatSmooth * 0.72 + Math.max(0.0, state.energySmooth - 0.25) * 0.75, 0.0, 1.25)
        : 0.35
    var rawForm = clamp(baseForm * (1.0 - audioExcite * 0.68), 0.0, 1.0)
    if ((state.artBurst || 0.0) > 0.08) {
        rawForm = clamp(rawForm - state.artBurst * 0.92, 0.0, 1.0)
    }
    state.l3FormFactor = lerp(state.l3FormFactor !== undefined ? state.l3FormFactor : 0.65, rawForm, clamp(dt * 5.5, 0.04, 0.22))
    var formFactor = state.l3FormFactor
    var dismantleScale = isWordsSource ? 1.0 : 0.28
    var dismantleGate = Math.max(0.12 * dismantle, Math.pow(1.0 - formFactor * 0.85, 1.15) * dismantle * (0.55 + audioExcite * 0.65)) * dismantleScale

    // During Hold phase (formFactor -> 1), evoMix stays subtle so letters and album art remain recognisable while dancing
    var evoMix = isWordsSource ? clamp((1.0 - formFactor) * 0.18 * evoRate, 0.0, 0.25) : clamp((1.0 - formFactor * 0.85) * 0.14 * evoRate, 0.02, 0.16)

    // Responsive spring during Form phase; allows lively elastic bounce on beats
    var springK = (isWordsSource ? (5.0 + 16.0 * formFactor) : (10.0 + 22.0 * formFactor)) * clamp(rebuild, 0.35, 3.0)
    var damping = Math.exp(-dt * (4.2 + formFactor * 4.8 + rebuild * 1.2))

    for (var i = 0; i < n; i++) {
        var p = cells[i]
        var tx = lerp(p.homeX, p.evoX, evoMix)
        var ty = lerp(p.homeY, p.evoY, evoMix)

        var bIdx = (i * 3) & 63
        var bandVal = state.smoothBands[bIdx] || 0.0

        // Continuous kinetic wave & frequency bounce even while formed so words and art visibly dance to the music
        var liveWave = (isWordsSource ? 0.032 : 0.014) * (1.0 + state.bassSmooth * 1.2 + state.beatSmooth * 0.9) * clamp(evoRate, 0.4, 2.0)
        tx += Math.sin(p.homeY * 4.5 + state.t * 2.6 + p.phase * 0.3) * liveWave
        ty += Math.cos(p.homeX * 4.2 - state.t * 2.9 + p.phase * 0.2) * liveWave * 1.15 + (bandVal - 0.25) * (isWordsSource ? 0.065 : 0.024) * (0.5 + state.bassSmooth)

        if (l3Mode >= 6) {
            // Modes 6..11: Coherent readable musical warp & stretch modes (evaluated directly in drawLayer3AlbumArt + lively home ripple)
            p.alive = 1.0
        } else if (dismantleGate > 0.02) {
            if (l3Mode === 0) {
                // Mode 0: Shatter & Reassemble
                var rx = p.homeX || 0.001
                var ry = p.homeY || 0.001
                var rDist = Math.sqrt(rx * rx + ry * ry) + 0.08
                var fault = Math.sin(p.homeX * 6.0 + p.homeY * 4.5 + state.t * 1.2)
                var shatter = (0.45 + bandVal * 1.05 + state.beatSmooth * 1.25) * dismantleGate * (0.45 + 0.55 * Math.abs(fault))
                p.vx += (rx / rDist + Math.sin(p.phase + state.t * 1.4) * 0.45) * shatter * dt * 2.8
                p.vy += (ry / rDist + Math.cos(p.phase - state.t * 1.4) * 0.45) * shatter * dt * 2.8
            } else if (l3Mode === 1) {
                // Mode 1: Cellular Automata & Mycelial Organic Growth
                var caAngle = Math.sin(p.x * 4.2 + state.t * 1.35) * Math.cos(p.y * 4.2 - state.t * 1.15) * Math.PI * 2
                var caPush = (0.35 + bandVal * 1.10 + state.midSmooth * 0.90) * dismantleGate
                p.vx += Math.cos(caAngle + p.phase) * caPush * dt * 2.5
                p.vy += Math.sin(caAngle + p.phase) * caPush * dt * 2.5
                p.alive = lerp(0.45 + 0.55 * Math.abs(Math.sin(state.t * 1.8 + p.gx * 0.35 + p.gy * 0.35)), 1.0, formFactor * 0.7)
            } else if (l3Mode === 2) {
                // Mode 2: Blackhole Accretion & Supernova Ejection
                var bx = -p.x
                var by = -p.y
                var bDist = Math.sqrt(bx * bx + by * by) + 0.10
                var suckOrBlast = (state.beatSmooth > 0.35 || Math.sin(state.t * 0.95) < -0.35) ? -1.55 : 1.15
                var grav = dismantleGate * (0.52 + state.bassSmooth * 1.15) / (bDist * 0.85 + 0.32)
                p.vx += ((bx / bDist) * suckOrBlast - (by / bDist) * 1.45) * grav * dt * 1.85
                p.vy += ((by / bDist) * suckOrBlast + (bx / bDist) * 1.45) * grav * dt * 1.85
            } else if (l3Mode === 3) {
                // Mode 3: Tectonic Shear & Melted Acid Drizzle
                var strata = Math.floor((p.homeY + 1.0) * 6.0)
                var shearDir = (strata % 2 === 0) ? 1.0 : -1.0
                p.vx += shearDir * (0.42 + state.bassSmooth * 1.15 + bandVal * 0.95) * dismantleGate * dt * 2.4
                p.vy += Math.sin(p.homeX * 5.0 + state.t * 2.2) * (0.28 + state.highSmooth * 1.05 + bandVal * 0.9) * dismantleGate * dt * 2.0
            } else if (l3Mode === 4) {
                // Mode 4: Boids Swarm Flocking & Vortex Morph
                var flockX = Math.cos(state.t * 1.15 + (i % 5) * 1.25) * 0.58
                var flockY = Math.sin(state.t * 1.42 + (i % 5) * 1.25) * 0.58
                var dxF = flockX - p.x
                var dyF = flockY - p.y
                p.vx += (dxF * 1.75 - dyF * 2.1) * dismantleGate * (0.5 + state.energySmooth * 1.0) * dt
                p.vy += (dyF * 1.75 + dxF * 2.1) * dismantleGate * (0.5 + state.energySmooth * 1.0) * dt
            } else {
                // Mode 5: Omarchy TTE Keyframe Evolution + Wave Ripple
                var waveX = Math.sin(p.homeY * 5.5 + state.t * 2.2) * 0.28 * dismantleGate * (0.45 + state.bassSmooth * 0.95)
                var waveY = Math.cos(p.homeX * 5.5 - state.t * 1.9) * 0.28 * dismantleGate * (0.45 + state.midSmooth * 0.95)
                tx += waveX
                ty += waveY
            }
        } else {
            p.alive = 1.0
        }

        // Restoring spring toward letter/art home target (tx, ty)
        p.vx += (tx - p.x) * springK * dt
        p.vy += (ty - p.y) * springK * dt

        p.vx *= damping
        p.vy *= damping
        p.x = clamp(p.x + p.vx * dt, -1.35, 1.35)
        p.y = clamp(p.y + p.vy * dt, -1.35, 1.35)
    }
}

// ---------------------------------------------------------------------------
// LAYER #1 — 3 Independent Sub-Systems:
//   1. L1 Field (6 Volumetric Background Fields)
//   2. L1 Equaliser (Independent ON/OFF 6-Style Equaliser over ANY L1 Field)
//   3. L1 Beat Shapes (6 Audio-Reactive Shockwave Shape Styles, Spin, Speed, Scale)
// ---------------------------------------------------------------------------

function mapEqBandIndex(slot, totalSlots, layoutMode) {
    var norm = slot / Math.max(1, totalSlots - 1)
    if (layoutMode === 1) {
        // Centre-Out: Bass (band 0) in the centre, expanding symmetrically to highs at left/right edges
        var distFromCentre = Math.abs(norm - 0.5) * 2.0
        return clamp(Math.floor(distFromCentre * 63), 0, 63)
    }
    if (layoutMode === 2) {
        // Stereo Mirror: High->Low->High mirrored wings
        var wing = 1.0 - Math.abs(norm - 0.5) * 2.0
        return clamp(Math.floor(wing * 63), 0, 63)
    }
    // Default 0: Low->High left-to-right
    return clamp(Math.floor(norm * 63), 0, 63)
}

function sampleEqBandValue(state, bandIdx, dampingMode, eqGain) {
    var s = state.smoothBands[bandIdx] || 0.0
    var p = state.peakBands[bandIdx] || s
    var val = s
    if (dampingMode === 0) {
        // Snappy transient punch
        val = s * (1.0 + state.beatPulse * 0.45)
    } else if (dampingMode === 2) {
        // Peak-Hold weighted
        val = lerp(s, p, 0.65)
    } else {
        // Smooth liquid
        var prevB = state.smoothBands[Math.max(0, bandIdx - 1)] || s
        var nextB = state.smoothBands[Math.min(63, bandIdx + 1)] || s
        val = (prevB + s * 2.0 + nextB) * 0.25
    }
    return clamp(val * eqGain, 0.0, 1.6)
}

// True 3-axis 3D vertex rotation (rx = pitch, ry = yaw, rz = roll) + perspective projection
function project3DPoint(vx, vy, vz, rx, ry, rz, cx, cy, scale, fovDist) {
    // Rotate around Y (yaw)
    var cyaw = Math.cos(ry), syaw = Math.sin(ry)
    var x1 = vx * cyaw + vz * syaw
    var z1 = -vx * syaw + vz * cyaw
    var y1 = vy
    // Rotate around X (pitch)
    var cp = Math.cos(rx), sp = Math.sin(rx)
    var y2 = y1 * cp - z1 * sp
    var z2 = y1 * sp + z1 * cp
    var x2 = x1
    // Rotate around Z (roll)
    var cr = Math.cos(rz), sr = Math.sin(rz)
    var x3 = x2 * cr - y2 * sr
    var y3 = x2 * sr + y2 * cr
    var z3 = z2
    var fd = fovDist || 3.8
    var persp = fd / Math.max(0.45, fd - z3)
    return {
        x: cx + x3 * scale * persp,
        y: cy + y3 * scale * persp,
        z: z3,
        persp: persp
    }
}

// Deterministically fills a configurable fraction (`fillRatio` 0.0..1.0 = 0%..100%) of a 3D craft's polygonal facets
// with configurable per-segment opacity (`_activeShapeFillOpacity` 0.05..1.00 = 5%..100%) before stroking the glowing wireframe edges.
var _activeShapeFillOpacity = 0.55
function fillCraftFaces(ctx, faces, fillRatio, seedIdx, baseHue, sAlpha, palette, fillOpacityOverride) {
    var ratio = clamp(Number(fillRatio) || 0.0, 0.0, 1.0)
    if (!faces || faces.length === 0 || ratio <= 0.01) return
    var segOpac = clamp(
        fillOpacityOverride !== undefined ? Number(fillOpacityOverride) : _activeShapeFillOpacity,
        0.05,
        1.0
    )
    var total = faces.length
    var targetCount = (ratio >= 0.99) ? total : Math.max(1, Math.min(total, Math.round(total * ratio)))
    var coprimeStep = (total % 3 !== 0) ? 3 : ((total % 5 !== 0) ? 5 : 1)
    var startIdx = ((seedIdx || 0) * 7) % total
    for (var k = 0; k < targetCount; k++) {
        var fIdx = (ratio >= 0.99) ? k : ((startIdx + k * coprimeStep) % total)
        var poly = faces[fIdx]
        if (!poly || poly.length < 3) continue
        var shade = 0.42 + ((fIdx * 3 + (seedIdx || 0)) % 4) * 0.07
        var fAlpha = clamp(Math.max(0.48, sAlpha || 0.85) * segOpac * (0.86 + 0.14 * ((fIdx & 1) ? 1.0 : 0.72)), 0.03, 0.98)
        var fHue = ((baseHue || 180) + fIdx * 22) % 360
        ctx.fillStyle = (palette && palette.length > 0 && (fIdx & 1) === 0)
            ? colourWithAlpha(palette[(fIdx + (seedIdx || 0)) % palette.length], fAlpha)
            : hslToHex(fHue, 0.90, shade, fAlpha)
        ctx.beginPath()
        ctx.moveTo(poly[0].x, poly[0].y)
        for (var pi = 1; pi < poly.length; pi++) {
            ctx.lineTo(poly[pi].x, poly[pi].y)
        }
        ctx.closePath()
        ctx.fill()
    }
    ctx.beginPath()
}

// Deterministically fills a configurable fraction (`cfg.layer2FillRatio` 0.0..1.0 = 0%..100%) of Layer 4 Geometry
// polygon segments/facets with per-face random opacity scaled up to the layer's maximum (`cfg.layer2Opacity` & `cfg.layer2FillOpacity`)
// so the collection of faces exhibits smooth multi-layered 3D depth without stark jumps.
function fillGeometrySegments(ctx, polys, cfg, seedIdx, palette, baseAlpha) {
    if (!polys || polys.length === 0) return
    var ratio = cfg && cfg.layer2FillRatio !== undefined ? clamp(Number(cfg.layer2FillRatio), 0.0, 1.0) : 0.45
    if (ratio <= 0.01) return
    var segOpac = cfg && cfg.layer2FillOpacity !== undefined ? clamp(Number(cfg.layer2FillOpacity), 0.05, 1.0) : 0.55
    var layerMaxOpac = cfg && cfg.layer2Opacity !== undefined ? clamp(Number(cfg.layer2Opacity), 0.05, 1.0) : 1.0
    var isEcho = Boolean(cfg && cfg._isEcho)
    var echoMul = isEcho ? 0.55 : 1.0
    var bAlpha = baseAlpha !== undefined ? clamp(Number(baseAlpha), 0.15, 1.0) : 0.85
    var maxLayerAlpha = clamp(layerMaxOpac * segOpac * echoMul * bAlpha, 0.04, layerMaxOpac)
    var total = polys.length
    var targetCount = (ratio >= 0.99) ? total : Math.max(1, Math.min(total, Math.round(total * ratio)))
    var coprimeStep = (total % 3 !== 0) ? 3 : ((total % 5 !== 0) ? 5 : ((total % 7 !== 0) ? 7 : 1))
    for (var k = 0; k < targetCount; k++) {
        var fIdx = (ratio >= 0.99) ? k : ((k * coprimeStep) % total)
        var poly = polys[fIdx]
        if (!poly || poly.length < 3) continue
        var h1 = Math.sin((fIdx + 1) * 12.9898 + total * 4.1414) * 43758.5453
        var r1 = h1 - Math.floor(h1)
        var h2 = Math.sin((fIdx + 1) * 78.233 + k * 19.19) * 19642.349
        var r2 = h2 - Math.floor(h2)
        var faceDepthWeight = 0.12 + 0.88 * (0.65 * r1 + 0.35 * r2)
        var fAlpha = clamp(maxLayerAlpha * faceDepthWeight, 0.02, layerMaxOpac)
        var col = (palette && palette.length > 0)
            ? palette[(fIdx + Math.abs(seedIdx || 0)) % palette.length]
            : "#00e5ff"
        ctx.fillStyle = colourWithAlpha(col, fAlpha)
        ctx.beginPath()
        ctx.moveTo(poly[0].x, poly[0].y)
        for (var pi = 1; pi < poly.length; pi++) {
            ctx.lineTo(poly[pi].x, poly[pi].y)
        }
        ctx.closePath()
        ctx.fill()
    }
    ctx.beginPath()
}

// Dual-pass glowing vector craft wireframe stroke so 3: Vectors shapes are vivid and crisp at all sizes
function strokeVectorCraftPass(ctx, hexCol, coreWidth, sAlpha) {
    var a = clamp(sAlpha, 0.12, 1.0)
    ctx.strokeStyle = colourWithAlpha(hexCol, a * 0.34)
    ctx.lineWidth = coreWidth * 2.35
    ctx.stroke()
    ctx.strokeStyle = colourWithAlpha(hexCol, a)
    ctx.lineWidth = coreWidth
    ctx.stroke()
}

// Appends a complete 1980 Atari Battlezone 3D Wireframe Tank (12-edge lower tread hull +
// 8-edge sloped glacis + 12-edge 360°-rotating 3D turret + elevating 3D gun barrel + spinning 3D radar dish)
// to the active ctx path, and returns the projected muzzle tip { x, y, dx, dy } for cannon shell firing.
function append3DWireframeTank(ctx, cx, cy, scale, rx, ry, rz, turretYawRel, gunElev, radarSpin, fillRatio, seedIdx, baseHue, sAlpha, palette) {
    // 1. Hull & Caterpillar Tracks (12 vertices: 0..3 bottom treads, 4..7 mid chine, 8..11 upper glacis deck)
    var hullV = [
        [-0.92,  0.36, -1.15], [ 0.92,  0.36, -1.15], [ 0.92,  0.36,  1.15], [-0.92,  0.36,  1.15],
        [-1.06,  0.08, -1.30], [ 1.06,  0.08, -1.30], [ 1.06,  0.08,  1.30], [-1.06,  0.08,  1.30],
        [-0.72, -0.16, -0.90], [ 0.72, -0.16, -0.90], [ 0.72, -0.16,  0.94], [-0.72, -0.16,  0.94]
    ]
    var hp = []
    for (var i = 0; i < hullV.length; i++) {
        hp.push(project3DPoint(hullV[i][0], hullV[i][1], hullV[i][2], rx, ry, rz, cx, cy, scale, 4.0))
    }

    // 2. 360° Rotating Polygonal 3D Turret (8 vertices: 0..3 turret base, 4..7 turret roof)
    var tYaw = ry + (turretYawRel || 0.0)
    var turV = [
        [-0.46, -0.16, -0.52], [ 0.46, -0.16, -0.52], [ 0.46, -0.16,  0.56], [-0.46, -0.16,  0.56],
        [-0.30, -0.48, -0.34], [ 0.30, -0.48, -0.34], [ 0.30, -0.48,  0.38], [-0.30, -0.48,  0.38]
    ]
    var tp = []
    for (var ti = 0; ti < turV.length; ti++) {
        tp.push(project3DPoint(turV[ti][0], turV[ti][1], turV[ti][2], rx, tYaw, rz, cx, cy, scale, 4.0))
    }

    if (fillRatio !== undefined && fillRatio > 0.01) {
        var tankFaces = [
            [hp[4], hp[5], hp[9], hp[8]],
            [hp[5], hp[6], hp[10], hp[9]],
            [hp[6], hp[7], hp[11], hp[10]],
            [hp[7], hp[4], hp[8], hp[11]],
            [hp[0], hp[1], hp[5], hp[4]],
            [hp[1], hp[2], hp[6], hp[5]],
            [hp[2], hp[3], hp[7], hp[6]],
            [hp[3], hp[0], hp[4], hp[7]],
            [hp[8], hp[9], hp[10], hp[11]],
            [tp[0], tp[1], tp[5], tp[4]],
            [tp[1], tp[2], tp[6], tp[5]],
            [tp[2], tp[3], tp[7], tp[6]],
            [tp[3], tp[0], tp[4], tp[7]],
            [tp[4], tp[5], tp[6], tp[7]]
        ]
        fillCraftFaces(ctx, tankFaces, fillRatio, seedIdx, baseHue, sAlpha || 0.85, palette)
    }

    var hullEdges = [
        // Bottom tread loop (4 edges)
        0, 1,  1, 2,  2, 3,  3, 0,
        // Mid chine loop (4 edges)
        4, 5,  5, 6,  6, 7,  7, 4,
        // Lower tread verticals (4 edges)
        0, 4,  1, 5,  2, 6,  3, 7,
        // Upper glacis deck loop (4 edges)
        8, 9,  9, 10, 10, 11, 11, 8,
        // Sloped glacis struts (4 edges)
        4, 8,  5, 9,  6, 10, 7, 11
    ]
    for (var he = 0; he < hullEdges.length; he += 2) {
        var pA = hp[hullEdges[he]], pB = hp[hullEdges[he + 1]]
        ctx.moveTo(pA.x, pA.y)
        ctx.lineTo(pB.x, pB.y)
    }

    var turEdges = [
        0, 1,  1, 2,  2, 3,  3, 0,
        4, 5,  5, 6,  6, 7,  7, 4,
        0, 4,  1, 5,  2, 6,  3, 7
    ]
    for (var te = 0; te < turEdges.length; te += 2) {
        var tA = tp[turEdges[te]], tB = tp[turEdges[te + 1]]
        ctx.moveTo(tA.x, tA.y)
        ctx.lineTo(tB.x, tB.y)
    }

    // 3. Elevating 3D Cannon Barrel (Twin parallel vector gun rails + muzzle cross-bar)
    var elev = clamp(gunElev || 0.12, -0.05, 0.55)
    var bLen = 1.42
    var tipY = -0.32 - Math.sin(elev) * bLen
    var tipZ = 0.48 + Math.cos(elev) * bLen
    var gL0 = project3DPoint(-0.06, -0.32, 0.48, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gR0 = project3DPoint( 0.06, -0.32, 0.48, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gL1 = project3DPoint(-0.04, tipY, tipZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    var gR1 = project3DPoint( 0.04, tipY, tipZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    ctx.moveTo(gL0.x, gL0.y); ctx.lineTo(gL1.x, gL1.y)
    ctx.moveTo(gR0.x, gR0.y); ctx.lineTo(gR1.x, gR1.y)
    ctx.moveTo(gL1.x, gL1.y); ctx.lineTo(gR1.x, gR1.y)

    // 4. Spinning 3D Radar Mast & Diamond Dish on Turret Roof
    var rMastBase = project3DPoint(0.0, -0.48, -0.10, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rMastTop  = project3DPoint(0.0, -0.76, -0.10, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rDishW = Math.cos(radarSpin || 0.0) * 0.24
    var rDishZ = Math.sin(radarSpin || 0.0) * 0.24
    var rLeft  = project3DPoint(-rDishW, -0.76, -0.10 - rDishZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    var rRight = project3DPoint( rDishW, -0.76, -0.10 + rDishZ, rx, tYaw, rz, cx, cy, scale, 4.0)
    ctx.moveTo(rMastBase.x, rMastBase.y); ctx.lineTo(rMastTop.x, rMastTop.y)
    ctx.moveTo(rLeft.x, rLeft.y); ctx.lineTo(rRight.x, rRight.y)

    var muzzleMidX = (gL1.x + gR1.x) * 0.5
    var muzzleMidY = (gL1.y + gR1.y) * 0.5
    var breechMidX = (gL0.x + gR0.x) * 0.5
    var breechMidY = (gL0.y + gR0.y) * 0.5
    return {
        x: muzzleMidX,
        y: muzzleMidY,
        dx: muzzleMidX - breechMidX,
        dy: muzzleMidY - breechMidY
    }
}

// Appends a 1983 Atari Color-QuadraScan XY Vector Star Wars spacecraft to the active ctx path:
//   variant 0: Standard TIE Fighter (3D octahedron/hexagon central ball cockpit + smaller front octagon window +
//              horizontal axle struts + vertical elongated hexagonal wings divided into 6 triangular segments by radial spokes)
//   variant 1: Darth Vader's TIE Advanced x1 (central ball cockpit + front octagon window + horizontal axle struts +
//              angled/bent [ ] bracket solar wings with radial internal spokes)
//   variant 2: Rebel X-Wing Starfighter (tapered hexagonal fuselage + canopy ridge + 4 S-Foil wings + 4 wingtip laser cannons)
function append3DStarWarsFighter(ctx, variant, cx, cy, scale, rx, ry, rz) {
    var vMode = ((variant % 3) + 3) % 3
    if (vMode === 2) {
        var xwFus = [
            [ 0.0,  -0.14,  0.88], // 0: Nose cone tip
            [ 0.18, -0.10, -0.15], // 1: Right cockpit shoulder
            [ 0.14,  0.10, -0.68], // 2: Right rear engine block
            [-0.14,  0.10, -0.68], // 3: Left rear engine block
            [-0.18, -0.10, -0.15], // 4: Left cockpit shoulder
            [ 0.0,  -0.26, -0.22]  // 5: Canopy dorsal ridge
        ]
        var xp = []
        for (var xfi = 0; xfi < xwFus.length; xfi++) {
            xp.push(project3DPoint(xwFus[xfi][0], xwFus[xfi][1], xwFus[xfi][2], rx, ry, rz, cx, cy, scale, 3.6))
        }
        var xFusEdges = [0, 1,  1, 2,  2, 3,  3, 4,  4, 0,  0, 5,  5, 2,  5, 3,  1, 5,  4, 5]
        for (var xfe = 0; xfe < xFusEdges.length; xfe += 2) {
            ctx.moveTo(xp[xFusEdges[xfe]].x, xp[xFusEdges[xfe]].y)
            ctx.lineTo(xp[xFusEdges[xfe + 1]].x, xp[xFusEdges[xfe + 1]].y)
        }
        for (var wxS = -1; wxS <= 1; wxS += 2) {
            for (var wyS = -1; wyS <= 1; wyS += 2) {
                var rF = project3DPoint(wxS * 0.15, wyS * 0.06, -0.18, rx, ry, rz, cx, cy, scale, 3.6)
                var rR = project3DPoint(wxS * 0.14, wyS * 0.08, -0.58, rx, ry, rz, cx, cy, scale, 3.6)
                var tF = project3DPoint(wxS * 0.96, wyS * 0.44, -0.14, rx, ry, rz, cx, cy, scale, 3.6)
                var tR = project3DPoint(wxS * 0.96, wyS * 0.52, -0.48, rx, ry, rz, cx, cy, scale, 3.6)
                var cT = project3DPoint(wxS * 0.96, wyS * 0.44,  0.50, rx, ry, rz, cx, cy, scale, 3.6)
                ctx.moveTo(rF.x, rF.y); ctx.lineTo(tF.x, tF.y); ctx.lineTo(tR.x, tR.y); ctx.lineTo(rR.x, rR.y); ctx.closePath()
                ctx.moveTo(tR.x, tR.y); ctx.lineTo(cT.x, cT.y)
            }
        }
        return
    }

    // 1. Central 3D wireframe octahedron/octagon ball cockpit + smaller front octagon viewport window + radial viewport spokes
    var ballR = 0.28
    var winR = 0.14
    var outerRing = []
    var innerWin = []
    for (var bi = 0; bi < 8; bi++) {
        var ba = (bi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
        var ca = Math.cos(ba), sa = Math.sin(ba)
        outerRing.push(project3DPoint(ca * ballR, sa * ballR, 0.0, rx, ry, rz, cx, cy, scale, 3.6))
        innerWin.push(project3DPoint(ca * winR, sa * winR, 0.20, rx, ry, rz, cx, cy, scale, 3.6))
    }
    for (var b0 = 0; b0 < 8; b0++) {
        var b1 = (b0 + 1) & 7
        ctx.moveTo(outerRing[b0].x, outerRing[b0].y); ctx.lineTo(outerRing[b1].x, outerRing[b1].y)
        ctx.moveTo(innerWin[b0].x, innerWin[b0].y);   ctx.lineTo(innerWin[b1].x, innerWin[b1].y)
        ctx.moveTo(innerWin[b0].x, innerWin[b0].y);   ctx.lineTo(outerRing[b0].x, outerRing[b0].y)
    }

    // 2. Horizontal axle struts connecting the central cockpit ball to left and right wing hubs
    var wingX = (vMode === 1) ? 0.78 : 0.74
    var pL0 = project3DPoint(-ballR, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pL1 = project3DPoint(-wingX, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pR0 = project3DPoint( ballR, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    var pR1 = project3DPoint( wingX, 0.0, 0.0, rx, ry, rz, cx, cy, scale, 3.6)
    ctx.moveTo(pL0.x, pL0.y); ctx.lineTo(pL1.x, pL1.y)
    ctx.moveTo(pR0.x, pR0.y); ctx.lineTo(pR1.x, pR1.y)

    // 3. Solar array wings with internal radiating spokes from the centre hub
    for (var side = -1; side <= 1; side += 2) {
        var hubPt = (side < 0) ? pL1 : pR1
        if (vMode === 0) {
            // Standard TIE Fighter: Flat, vertical elongated hexagon divided into 6 triangular segments by internal spokes
            var hexV = [
                [side * wingX,  0.00,  0.54], // 0: Front middle apex
                [side * wingX, -0.76,  0.34], // 1: Top-front corner
                [side * wingX, -0.76, -0.34], // 2: Top-rear corner
                [side * wingX,  0.00, -0.54], // 3: Rear middle apex
                [side * wingX,  0.76, -0.34], // 4: Bottom-rear corner
                [side * wingX,  0.76,  0.34]  // 5: Bottom-front corner
            ]
            var hp = []
            for (var hi = 0; hi < 6; hi++) {
                hp.push(project3DPoint(hexV[hi][0], hexV[hi][1], hexV[hi][2], rx, ry, rz, cx, cy, scale, 3.6))
            }
            for (var h0 = 0; h0 < 6; h0++) {
                var h1 = (h0 + 1) % 6
                // Outer hexagon perimeter segment
                ctx.moveTo(hp[h0].x, hp[h0].y); ctx.lineTo(hp[h1].x, hp[h1].y)
                // Internal spoke radiating from centre wing hub (dividing wing into 6 triangular segments)
                ctx.moveTo(hubPt.x, hubPt.y);   ctx.lineTo(hp[h0].x, hp[h0].y)
            }
        } else {
            // Darth Vader's TIE Advanced x1: Angled/bent top and bottom panels forming a [ ] bracket profile head-on
            var vadV = [
                [side * wingX,  0.00,  0.56], // 0: Centre-front apex
                [side * wingX, -0.32,  0.44], // 1: Upper-knuckle front
                [side * 0.50,  -0.74,  0.36], // 2: Bent top-tip front
                [side * 0.50,  -0.74, -0.36], // 3: Bent top-tip rear
                [side * wingX, -0.32, -0.44], // 4: Upper-knuckle rear
                [side * wingX,  0.00, -0.56], // 5: Centre-rear apex
                [side * wingX,  0.32, -0.44], // 6: Lower-knuckle rear
                [side * 0.50,   0.74, -0.36], // 7: Bent bottom-tip rear
                [side * 0.50,   0.74,  0.36], // 8: Bent bottom-tip front
                [side * wingX,  0.32,  0.44]  // 9: Lower-knuckle front
            ]
            var vp = []
            for (var vi = 0; vi < vadV.length; vi++) {
                vp.push(project3DPoint(vadV[vi][0], vadV[vi][1], vadV[vi][2], rx, ry, rz, cx, cy, scale, 3.6))
            }
            for (var v0 = 0; v0 < vadV.length; v0++) {
                var v1 = (v0 + 1) % vadV.length
                ctx.moveTo(vp[v0].x, vp[v0].y); ctx.lineTo(vp[v1].x, vp[v1].y)
            }
            // Internal fold ribs + radial hub spokes
            ctx.moveTo(vp[1].x, vp[1].y); ctx.lineTo(vp[4].x, vp[4].y)
            ctx.moveTo(vp[9].x, vp[9].y); ctx.lineTo(vp[6].x, vp[6].y)
            var spokeIdx = [0, 1, 4, 5, 6, 9]
            for (var si = 0; si < spokeIdx.length; si++) {
                var spP = vp[spokeIdx[si]]
                ctx.moveTo(hubPt.x, hubPt.y); ctx.lineTo(spP.x, spP.y)
            }
        }
    }
}

// 1983 Atari Amplifone / Wells-Gardner Color-QuadraScan XY Vector CRT Dual-Pass Phosphor Glow Stroke
function strokeQuadraScanPass(ctx, hexColor, coreWidth, alpha, hotCore) {
    var a = clamp(alpha, 0.05, 1.0)
    // Pass 1: Wide outer CRT phosphor bloom halo
    ctx.strokeStyle = colourWithAlpha(hexColor, a * 0.36)
    ctx.lineWidth = coreWidth * 2.65
    ctx.stroke()
    // Pass 2: Crisp saturated QuadraScan neon vector beam
    ctx.strokeStyle = colourWithAlpha(hexColor, a)
    ctx.lineWidth = coreWidth
    ctx.stroke()
    // Optional Pass 3: White-hot electron-beam centre core for primary foreground vectors
    if (hotCore) {
        ctx.strokeStyle = colourWithAlpha("#FFFFFF", a * 0.48)
        ctx.lineWidth = Math.max(0.75, coreWidth * 0.42)
        ctx.stroke()
    }
}

// Multi-colour 1983 Atari Star Wars Color-QuadraScan 3D Fighter renderer:
//   - Solar array hexagonal/bent panels & 6 radial hub spokes in Red (#FF1111) / Yellow (#FFFF11)
//   - Central 3D spherical/octahedral cockpit pod & horizontal axle struts in Green (#11FF11)
//   - Front octagonal viewport window, 8 radial window spokes & laser tips in Cyan (#00FFFF)
function drawMultiColourStarWarsFighter(ctx, variant, cx, cy, scale, rx, ry, rz, strokeW, visAlpha, bloomDots, minXClamp, maxXClamp, fillRatio, seedIdx, palette) {
    var vMode = ((variant % 3) + 3) % 3
    var hasClamp = (minXClamp !== undefined && maxXClamp !== undefined)
    function p3(vx, vy, vz) {
        var pt = project3DPoint(vx, vy, vz, rx, ry, rz, cx, cy, scale, 3.6)
        if (hasClamp) {
            pt.x = clamp(pt.x, minXClamp, maxXClamp)
        }
        return pt
    }

    if (vMode === 2) {
        // Rebel X-Wing Starfighter: Cyan fuselage + Red/Yellow S-Foil wings & 4 wingtip laser cannons
        var xwFus = [
            [ 0.0,  -0.14,  0.88],
            [ 0.18, -0.10, -0.15],
            [ 0.14,  0.10, -0.68],
            [-0.14,  0.10, -0.68],
            [-0.18, -0.10, -0.15],
            [ 0.0,  -0.26, -0.22]
        ]
        var xp = []
        for (var xfi = 0; xfi < xwFus.length; xfi++) {
            xp.push(p3(xwFus[xfi][0], xwFus[xfi][1], xwFus[xfi][2]))
        }
        var xwFaces = [
            [xp[0], xp[1], xp[5]],
            [xp[0], xp[4], xp[5]],
            [xp[1], xp[2], xp[5]],
            [xp[4], xp[3], xp[5]],
            [xp[0], xp[1], xp[2], xp[3], xp[4]]
        ]
        var wingLines = []
        for (var wxS = -1; wxS <= 1; wxS += 2) {
            for (var wyS = -1; wyS <= 1; wyS += 2) {
                var rF = p3(wxS * 0.15, wyS * 0.06, -0.18)
                var rR = p3(wxS * 0.14, wyS * 0.08, -0.58)
                var tF = p3(wxS * 0.96, wyS * 0.44, -0.14)
                var tR = p3(wxS * 0.96, wyS * 0.52, -0.48)
                var cT = p3(wxS * 0.96, wyS * 0.44,  0.50)
                xwFaces.push([rF, tF, tR, rR])
                wingLines.push({ rF: rF, rR: rR, tF: tF, tR: tR, cT: cT })
                if (bloomDots) bloomDots.push({ x: cT.x, y: cT.y })
            }
        }
        if (fillRatio !== undefined && fillRatio > 0.01) {
            fillCraftFaces(ctx, xwFaces, fillRatio, seedIdx, 195, visAlpha, palette)
        }
        ctx.beginPath()
        for (var wli = 0; wli < wingLines.length; wli++) {
            var wl = wingLines[wli]
            ctx.moveTo(wl.rF.x, wl.rF.y); ctx.lineTo(wl.tF.x, wl.tF.y); ctx.lineTo(wl.tR.x, wl.tR.y); ctx.lineTo(wl.rR.x, wl.rR.y); ctx.closePath()
            ctx.moveTo(wl.tR.x, wl.tR.y); ctx.lineTo(wl.cT.x, wl.cT.y)
        }
        strokeQuadraScanPass(ctx, "#FF1111", strokeW, visAlpha, true)

        ctx.beginPath()
        var xFusEdges = [0, 1,  1, 2,  2, 3,  3, 4,  4, 0,  0, 5,  5, 2,  5, 3,  1, 5,  4, 5]
        for (var xfe = 0; xfe < xFusEdges.length; xfe += 2) {
            ctx.moveTo(xp[xFusEdges[xfe]].x, xp[xFusEdges[xfe]].y)
            ctx.lineTo(xp[xFusEdges[xfe + 1]].x, xp[xFusEdges[xfe + 1]].y)
        }
        strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 1.05, visAlpha, true)
        return
    }

    var ballR = 0.28
    var winR = 0.14
    var wingX = (vMode === 1) ? 0.78 : 0.74
    var pL0 = p3(-ballR, 0.0, 0.0)
    var pL1 = p3(-wingX, 0.0, 0.0)
    var pR0 = p3( ballR, 0.0, 0.0)
    var pR1 = p3( wingX, 0.0, 0.0)
    var pL0Top = p3(-ballR * 0.85, -0.07, 0.0), pL1Top = p3(-wingX, -0.05, 0.0)
    var pR0Top = p3( ballR * 0.85, -0.07, 0.0), pR1Top = p3( wingX, -0.05, 0.0)

    var tieFaces = []
    var outerRing = []
    var innerWin = []
    var latRing = []
    for (var bi = 0; bi < 8; bi++) {
        var ba = (bi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
        var ca = Math.cos(ba), sa = Math.sin(ba)
        outerRing.push(p3(ca * ballR, sa * ballR, 0.0))
        innerWin.push(p3(ca * winR, sa * winR, 0.22))
        latRing.push(p3(ca * ballR * 0.86, 0.0, sa * ballR * 0.86))
    }
    for (var bf = 0; bf < 8; bf++) {
        var bfNext = (bf + 1) & 7
        tieFaces.push([innerWin[bf], innerWin[bfNext], outerRing[bfNext], outerRing[bf]])
    }

    // Pass 1: Solar Array Wings & 6 Internal Radial Spokes in Red (#FF1111) / Yellow (#FFFF11)
    var wingEdgeSegments = []
    for (var side = -1; side <= 1; side += 2) {
        var hubPt = (side < 0) ? pL1 : pR1
        if (vMode === 0) {
            var hexV = [
                [side * wingX,  0.00,  0.54],
                [side * wingX, -0.78,  0.35],
                [side * wingX, -0.78, -0.35],
                [side * wingX,  0.00, -0.54],
                [side * wingX,  0.78, -0.35],
                [side * wingX,  0.78,  0.35]
            ]
            var hp = []
            for (var hi = 0; hi < 6; hi++) {
                hp.push(p3(hexV[hi][0], hexV[hi][1], hexV[hi][2]))
            }
            for (var h0 = 0; h0 < 6; h0++) {
                var h1 = (h0 + 1) % 6
                tieFaces.push([hubPt, hp[h0], hp[h1]])
                wingEdgeSegments.push(hp[h0], hp[h1], hubPt, hp[h0])
            }
        } else {
            // Darth Vader's TIE Advanced x1: Angled/bent [ ] solar wings with internal fold ribs & radial spokes
            var vadV = [
                [side * wingX,  0.00,  0.56],
                [side * wingX, -0.34,  0.44],
                [side * 0.48,  -0.76,  0.36],
                [side * 0.48,  -0.76, -0.36],
                [side * wingX, -0.34, -0.44],
                [side * wingX,  0.00, -0.56],
                [side * wingX,  0.34, -0.44],
                [side * 0.48,   0.76, -0.36],
                [side * 0.48,   0.76,  0.36],
                [side * wingX,  0.34,  0.44]
            ]
            var vp = []
            for (var vi = 0; vi < vadV.length; vi++) {
                vp.push(p3(vadV[vi][0], vadV[vi][1], vadV[vi][2]))
            }
            for (var v0 = 0; v0 < vadV.length; v0++) {
                var v1 = (v0 + 1) % vadV.length
                tieFaces.push([hubPt, vp[v0], vp[v1]])
                wingEdgeSegments.push(vp[v0], vp[v1])
            }
            wingEdgeSegments.push(vp[1], vp[4], vp[9], vp[6])
            var spokeIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            for (var si = 0; si < spokeIdx.length; si++) {
                var spP = vp[spokeIdx[si]]
                wingEdgeSegments.push(hubPt, spP)
            }
        }
    }
    if (fillRatio !== undefined && fillRatio > 0.01) {
        fillCraftFaces(ctx, tieFaces, fillRatio, seedIdx, vMode === 1 ? 52 : 12, visAlpha, palette)
    }
    ctx.beginPath()
    for (var wes = 0; wes < wingEdgeSegments.length; wes += 2) {
        ctx.moveTo(wingEdgeSegments[wes].x, wingEdgeSegments[wes].y)
        ctx.lineTo(wingEdgeSegments[wes + 1].x, wingEdgeSegments[wes + 1].y)
    }
    strokeQuadraScanPass(ctx, vMode === 1 ? "#FFFF11" : "#FF1111", strokeW * 1.02, visAlpha * 0.94, false)

    // Pass 2: Central 3D Spherical Cockpit Ball & Tubular Wing Struts in QuadraScan Green (#11FF11)
    ctx.beginPath()
    for (var b0 = 0; b0 < 8; b0++) {
        var b1 = (b0 + 1) & 7
        ctx.moveTo(outerRing[b0].x, outerRing[b0].y); ctx.lineTo(outerRing[b1].x, outerRing[b1].y)
        ctx.moveTo(latRing[b0].x, latRing[b0].y);     ctx.lineTo(latRing[b1].x, latRing[b1].y)
    }
    ctx.moveTo(pL0.x, pL0.y);       ctx.lineTo(pL1.x, pL1.y)
    ctx.moveTo(pR0.x, pR0.y);       ctx.lineTo(pR1.x, pR1.y)
    ctx.moveTo(pL0Top.x, pL0Top.y); ctx.lineTo(pL1Top.x, pL1Top.y)
    ctx.moveTo(pR0Top.x, pR0Top.y); ctx.lineTo(pR1Top.x, pR1Top.y)
    strokeQuadraScanPass(ctx, "#11FF11", strokeW * 1.08, visAlpha * 0.96, true)

    // Pass 3: Front Octagonal Viewport Window & 8 Radial Viewport Spokes in QuadraScan Cyan (#00FFFF)
    ctx.beginPath()
    for (var w0 = 0; w0 < 8; w0++) {
        var w1 = (w0 + 1) & 7
        ctx.moveTo(innerWin[w0].x, innerWin[w0].y); ctx.lineTo(innerWin[w1].x, innerWin[w1].y)
        ctx.moveTo(innerWin[w0].x, innerWin[w0].y); ctx.lineTo(outerRing[w0].x, outerRing[w0].y)
    }
    strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 0.95, visAlpha * 0.96, true)

    if (bloomDots) {
        var cFront = p3(0.0, 0.0, 0.24)
        bloomDots.push({ x: cFront.x, y: cFront.y }, { x: pL1.x, y: pL1.y }, { x: pR1.x, y: pR1.y })
    }
}

function drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, cfg) {
    var rawBgHex = (theme && theme.background) ? theme.background.toString() : "#06080e"
    var enabled = cfg ? Boolean(cfg.layer1Enabled) : true
    var fieldOn = cfg && cfg.layer1FieldEnabled !== undefined ? Boolean(cfg.layer1FieldEnabled) : true
    var eqOn = cfg && cfg.layer1EqEnabled !== undefined ? Boolean(cfg.layer1EqEnabled) : (cfg && Number(cfg.layer1Mode) === 4)
    var shapesOn = cfg && cfg.layer1ShapesEnabled !== undefined ? Boolean(cfg.layer1ShapesEnabled) : true
    var l2On = cfg ? Boolean(cfg.layer2Enabled) : true
    var l2VizMode = cfg ? Number(cfg.layer2Mode !== undefined ? cfg.layer2Mode : cfg.mode) : 0
    var l2BackdropOn = cfg ? Boolean(cfg.backdropEnabled || cfg.layer4Enabled || (l2On && cfg.layer2VizEnabled !== false && l2VizMode === 5)) : false
    var l3On = cfg ? Boolean(cfg.layer3Enabled) : true
    var rawL1Mode = cfg ? (((Number(cfg.layer1Mode) || 0) % ALL_LAYER1_MODES.length + ALL_LAYER1_MODES.length) % ALL_LAYER1_MODES.length) : 0
    var l1Mode = (rawL1Mode >= 24) ? rawL1Mode : ((rawL1Mode === 23) ? 5 : ((rawL1Mode >= 12) ? (rawL1Mode - 12) : rawL1Mode))
    var isStarWarsMode = Boolean(enabled && fieldOn && (l1Mode === 5 || l1Mode === 24 || l1Mode === 25))
    var gpuHw = cfg && cfg.gpuShaderEnabled !== undefined ? Boolean(cfg.gpuShaderEnabled) : true
    var gpuL1Active = Boolean(gpuHw && cfg && cfg.gpuL1Active === true && enabled && fieldOn && rawL1Mode < 24)
    var gpuOn = Boolean(gpuHw && (l2BackdropOn || gpuL1Active))
    var bgHex = (isStarWarsMode && !gpuOn) ? "#000000" : rawBgHex

    // Detect any layer or L1 sub-system ON/OFF toggle so disabled layers clear from the persistent buffer immediately
    if (state.lastL1 !== enabled || state.lastL2 !== l2On || state.lastL3 !== l3On
        || state.lastL1Field !== fieldOn || state.lastL1Eq !== eqOn || state.lastL1Shapes !== shapesOn
        || state.lastGpuOn !== gpuOn || state.lastStarWarsMode !== isStarWarsMode) {
        state.lastL1 = enabled
        state.lastL2 = l2On
        state.lastL3 = l3On
        state.lastL1Field = fieldOn
        state.lastL1Eq = eqOn
        state.lastL1Shapes = shapesOn
        state.lastGpuOn = gpuOn
        state.lastStarWarsMode = isStarWarsMode
        state.clearFeedbackFrames = Math.max(state.clearFeedbackFrames || 0, 2)
    }

    if (gpuOn) {
        // When native GPU ShaderEffect is active behind vizCanvas, clear canvas to transparent
        // so the per-pixel GPU shader shines through cleanly!
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        ctx.clearRect(0, 0, w, h)
        if (!enabled) return
    } else if (!enabled || (state.clearFeedbackFrames && state.clearFeedbackFrames > 0)) {
        if (state.clearFeedbackFrames && state.clearFeedbackFrames > 0) {
            state.clearFeedbackFrames = state.clearFeedbackFrames - 1
        }
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = bgHex
        ctx.fillRect(0, 0, w, h)
        if (!enabled) return
    }

    var trail = cfg && cfg.layer1Trail !== undefined ? clamp(Number(cfg.layer1Trail), 0.10, 0.97) : 0.84
    var dim = cfg && cfg.layer1Dim !== undefined ? clamp(Number(cfg.layer1Dim), 0.0, 0.92) : 0.16
    var density = cfg && cfg.layer1Density !== undefined ? clamp(Number(cfg.layer1Density), 0.2, 3.0) : 1.0
    var l1T = state.l1Time !== undefined ? state.l1Time : state.t
    var l1Dir = (cfg && cfg.layer1Direction !== undefined) ? Number(cfg.layer1Direction) : 1
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t

    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var diagR = Math.sqrt(w * w + h * h) * 0.68
    var endPt = computeTracerEndpoint(
        w,
        h,
        driftT,
        state.liveTracerDrift !== undefined ? state.liveTracerDrift : (cfg ? cfg.tracerDrift : 1.0),
        1.0
    )

    if (!gpuOn) {
        // Zero-copy persistent framebuffer trail fade (no QQuickCanvasItem::toImage() CPU deep copy!)
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1.0
        var veilAlpha = isStarWarsMode
            ? clamp(0.60 + dim * 0.36, 0.52, 0.96)
            : clamp((1.0 - trail) * 1.15 + dim * 0.35 + 0.16, 0.24, 0.72)
        ctx.fillStyle = colourWithAlpha(bgHex, veilAlpha)
        ctx.fillRect(0, 0, w, h)
    }

    var horizonY = Math.round(h * 0.50)
    var vanishX = cx + Math.sin(driftT * 0.42) * w * 0.14

    // Non-linear density curve (`minimal -> many`) so 0.25x..0.5x is genuinely minimal and 1.5x..2.0x is a dense swarm
    var denCurve = Math.pow(density, 1.55)
    _activeShapeFillOpacity = cfg && cfg.layer1ShapeFillOpacity !== undefined ? clamp(Number(cfg.layer1ShapeFillOpacity), 0.05, 1.0) : 0.55

    // =========================================================================
    // SUB-SYSTEM 1: L1 FIELD (11 Volumetric Background Fields 0..10 + Photo-Motion 11)
    // Skipped on CPU when native GPU ShaderEffect (gpuL1Active) is rendering L1!
    // =========================================================================
    var l1Opac = cfg && cfg.layer1Opacity !== undefined ? clamp(Number(cfg.layer1Opacity), 0.05, 1.0) : 1.0
    if (fieldOn && !gpuL1Active) {
        ctx.save()
        ctx.globalAlpha = l1Opac
        try {
        if (l1Mode === 0) {
            // Mode 0: MilkDrop / Geiss 3D Expanding Logarithmic Warp Tunnel Web, Volumetric Curtains & Rotating 3D Segmented Circles
            // Rings and rotating segmented circles expand all the way past diagR so every ring moves towards the user and passes OFF the screen!
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var ringCount = Math.max(2, Math.min(14, Math.round(6 * denCurve)))
            var segs = 24
            var ringsPts = []
            var fract0 = (((l1T * 0.28) % 1.0) + 1.0) % 1.0
            var worldRing0 = Math.floor(l1T * 0.28)
            for (var rIdx = 0; rIdx < ringCount; rIdx++) {
                var rProg = (rIdx + fract0) / ringCount
                var baseR = Math.pow(rProg, 1.85) * diagR * 1.18
                var ringCX = cx + endPt.dx * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var ringCY = cy + endPt.dy * 0.65 * Math.pow(1.0 - rProg, 1.25)
                var wR0 = worldRing0 - rIdx
                var spinSign0 = (wR0 & 1) ? -1.0 : 1.0
                var rot = state.phase * 0.65 * spinSign0 + l1T * 0.85 * spinSign0 + wR0 * 0.35
                var bFade0 = smoothstep(0.0, 0.22, rProg)
                var pts = []
                for (var s = 0; s <= segs; s++) {
                    var ang = (s / segs) * Math.PI * 2 + rot
                    var bVal = state.smoothBands[(s * 2 + rIdx * 7) & 63]
                    var rr = baseR * (1.0 + Math.sin(ang * 4.0 + l1T * 1.1) * 0.06 + bVal * 0.14)
                    pts.push({
                        x: ringCX + Math.cos(ang) * rr,
                        y: ringCY + Math.sin(ang) * rr,
                        cx: ringCX,
                        cy: ringCY,
                        r: baseR * (1.0 + state.bassSmooth * 0.10),
                        rot: rot,
                        spinSign: spinSign0,
                        prog: rProg,
                        fade: bFade0
                    })
                }
                ringsPts.push(pts)
            }

            // Translucent 3D warp-tunnel curtains between adjacent expanding rings
            for (var cIdx = 0; cIdx < ringCount - 1; cIdx++) {
                var r0 = ringsPts[cIdx]
                var r1 = ringsPts[cIdx + 1]
                var cFade = r0[0].fade
                if (cFade < 0.02) continue
                var pAlpha = (0.04 + r1[0].prog * 0.08 + state.bass * 0.05) * cFade * (1.0 - dim) * (gpuOn ? 0.55 : 1.0)
                ctx.fillStyle = colourWithAlpha(palette[(cIdx * 2) % palette.length], pAlpha)
                ctx.beginPath()
                for (var s0 = 0; s0 < segs; s0 += 2) {
                    ctx.moveTo(r0[s0].x, r0[s0].y)
                    ctx.lineTo(r0[s0 + 1].x, r0[s0 + 1].y)
                    ctx.lineTo(r1[s0 + 1].x, r1[s0 + 1].y)
                    ctx.lineTo(r1[s0].x, r1[s0].y)
                    ctx.closePath()
                }
                ctx.fill()
            }

            // Radial warp struts + glowing logarithmic tunnel rings + counter-rotating segmented 3D circle arcs travelling towards the viewer
            for (var rIdx2 = 0; rIdx2 < ringCount; rIdx2++) {
                var rPts = ringsPts[rIdx2]
                var rFade2 = rPts[0].fade
                if (rFade2 < 0.02) continue
                var rb = rIdx2 % 3
                ctx.strokeStyle = colourWithAlpha(palette[(rb * 2 + 1) % palette.length], (0.30 + state.bass * 0.36) * rFade2 * (1.0 - dim))
                ctx.lineWidth = (1.5 + rb * 0.5 + state.bass * 1.4) * rFade2
                ctx.beginPath()
                for (var s2 = 0; s2 <= segs; s2++) {
                    if (s2 === 0) ctx.moveTo(rPts[s2].x, rPts[s2].y)
                    else ctx.lineTo(rPts[s2].x, rPts[s2].y)
                }
                if (rIdx2 > 0 && ringsPts[rIdx2 - 1][0].fade > 0.02) {
                    var prevPts = ringsPts[rIdx2 - 1]
                    for (var sr = 0; sr < segs; sr += 3) {
                        ctx.moveTo(prevPts[sr].x, prevPts[sr].y)
                        ctx.lineTo(rPts[sr].x, rPts[sr].y)
                    }
                }
                ctx.stroke()

                // Rotating & counter-rotating segmented 3D circular arcs rushing towards the viewer
                var arcCount0 = 6
                var cMeta = rPts[0]
                var arcR0 = cMeta.r * 0.92
                ctx.strokeStyle = colourWithAlpha(palette[(rb * 2 + 2) % palette.length], (0.48 + state.beatPulse * 0.32 + state.bass * 0.20) * rFade2 * (1.0 - dim))
                ctx.lineWidth = (2.2 + cMeta.prog * 2.4 + state.bass * 1.6) * rFade2
                ctx.beginPath()
                for (var ac0 = 0; ac0 < arcCount0; ac0++) {
                    var aStart0 = cMeta.rot * 1.35 + (ac0 / arcCount0) * Math.PI * 2.0
                    var aEnd0 = aStart0 + (Math.PI * 2.0 / arcCount0) * 0.58
                    ctx.moveTo(cMeta.cx + Math.cos(aStart0) * arcR0, cMeta.cy + Math.sin(aStart0) * arcR0)
                    ctx.arc(cMeta.cx, cMeta.cy, arcR0, aStart0, aEnd0)
                }
                ctx.stroke()
            }
            ctx.restore()
        } else if (l1Mode === 1) {
            // Mode 1: G-Force 3D Polar FlowField Spiral Ribbons & Plasma Wakes from Moving Endpoint
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var focalX = cx + endPt.dx * 0.55
            var focalY = cy + endPt.dy * 0.55
            var fCount = Math.max(3, Math.min(32, Math.round(12 * denCurve)))
            var segSteps = 5
            for (var fb = 0; fb < 3; fb++) {
                var ribCol = palette[(fb * 3) % palette.length]
                ctx.fillStyle = colourWithAlpha(ribCol, (0.10 + state.mid * 0.14) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(fb * 3 + 1) % palette.length], (0.32 + state.mid * 0.32) * (1.0 - dim))
                ctx.lineWidth = 1.6 + state.bass * 1.2
                ctx.beginPath()
                for (var fi = fb; fi < fCount; fi += 3) {
                    var baseA = (fi / fCount) * Math.PI * 2 + fb * 0.65 + l1T * 0.28
                    var depthBase = (((fi * 0.17 + l1T * 0.22) % 0.78) + 0.78) % 0.78
                    var bVal1 = state.smoothBands[(fi * 3) & 63]
                    var curl = (0.20 + state.mid * 0.24) * (fi % 2 === 0 ? 1.0 : -1.0)
                    var leftX = [], leftY = [], rightX = [], rightY = []
                    for (var stp = 0; stp <= segSteps; stp++) {
                        var u = stp / segSteps
                        var dp = depthBase + u * (0.20 + bVal1 * 0.18)
                        var r = diagR * (0.03 + Math.pow(dp, 1.55) * 0.95)
                        var a = baseA + u * curl * 2.0
                        var ox = lerp(focalX, cx, Math.min(1.0, dp))
                        var oy = lerp(focalY, cy, Math.min(1.0, dp))
                        var px = ox + Math.cos(a) * r
                        var py = oy + Math.sin(a) * r
                        var halfW = (2.5 + u * 7.5 * (0.6 + bVal1)) * (1.0 - u * 0.35)
                        var nx = -Math.sin(a) * halfW
                        var ny = Math.cos(a) * halfW
                        leftX.push(px + nx)
                        leftY.push(py + ny)
                        rightX.push(px - nx)
                        rightY.push(py - ny)
                    }
                    ctx.moveTo(leftX[0], leftY[0])
                    for (var k = 1; k <= segSteps; k++) ctx.lineTo(leftX[k], leftY[k])
                    for (var k2 = segSteps; k2 >= 0; k2--) ctx.lineTo(rightX[k2], rightY[k2])
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
            ctx.restore()
        } else if (l1Mode === 2) {
            // Mode 2: Cthugha 3D Volumetric Rave Flame Curtains & Rising Plasma Tongues
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var hist = state.waveHistory || []
            var flameSheets = 3
            for (var sh = flameSheets - 1; sh >= 0; sh--) {
                var shFrac = sh / flameSheets
                var snap = (hist.length > sh * 2 && hist[sh * 2] && hist[sh * 2].bands) ? hist[sh * 2].bands : state.smoothBands
                var baseY = h * (0.98 - shFrac * 0.12)
                ctx.fillStyle = colourWithAlpha(palette[(sh * 2 + 1) % palette.length], (0.12 + (1.0 - shFrac) * 0.12 + state.bass * 0.10) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(sh * 2) % palette.length], (0.38 + (1.0 - shFrac) * 0.32) * (1.0 - dim))
                ctx.lineWidth = 1.6 + (1.0 - shFrac) * 1.2
                ctx.beginPath()
                ctx.moveTo(0, h)
                for (var sb = 0; sb < 32; sb++) {
                    var u = sb / 31.0
                    var bv = snap[sb] !== undefined ? snap[sb] : (state.smoothBands[sb * 2] || 0.08)
                    var lick = Math.sin(sb * 0.7 + l1T * 1.5 - sh * 1.3) * 0.15 + 0.85
                    var fx = u * w + endPt.dx * 0.18 * shFrac
                    var fy = baseY - (bv * h * (0.26 + state.bass * 0.16) * density * lick)
                    ctx.lineTo(fx, fy)
                }
                ctx.lineTo(w, h)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Rising organic plasma flame tongues (curved diamond/teardrop plumes)
            var flames = state.flames || []
            var flameCount = Math.min(flames.length, Math.max(4, Math.round(flames.length * clamp(0.42 * denCurve, 0.08, 1.0))))
            for (var cBucket = 0; cBucket < 4; cBucket++) {
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2) % palette.length], (0.14 + state.bass * 0.20) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(cBucket * 2 + 1) % palette.length], (0.26 + state.mid * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.2
                ctx.beginPath()
                for (var f = cBucket; f < flameCount; f += 4) {
                    var fm = flames[f]
                    var fx2 = fm.x * w + endPt.dx * 0.28 * (1.0 - fm.y)
                    var fy2 = fm.y * h
                    var fw = (w / 24.0) * (0.65 + fm.energy * 1.45) * clamp(density, 0.5, 1.8)
                    var fh = h * (0.07 + fm.energy * 0.20) * clamp(density, 0.5, 1.8)
                    var sway = Math.sin(l1T * 1.4 + f) * fw * 0.40
                    ctx.moveTo(fx2 + sway, fy2 - fh * 0.65)
                    ctx.lineTo(fx2 + fw * 0.5, fy2)
                    ctx.lineTo(fx2 - sway * 0.4, fy2 + fh * 0.45)
                    ctx.lineTo(fx2 - fw * 0.5, fy2)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()

                // Glowing rising embers detaching from the flame tips
                ctx.fillStyle = colourWithAlpha(palette[(cBucket * 2 + 2) % palette.length], (0.52 + state.high * 0.32) * (1.0 - dim))
                ctx.beginPath()
                for (var fe = cBucket; fe < flameCount; fe += 4) {
                    var fme = flames[fe]
                    var emberPhase = (((l1T * 0.16 + fe * 0.13) % 0.45) + 0.45) % 0.45
                    var emberY = (((fme.y - emberPhase) % 1.0) + 1.0) % 1.0 * h
                    var emberX = fme.x * w + Math.sin(l1T * 1.2 + fe * 1.7) * 14.0 + endPt.dx * 0.25 * (1.0 - emberY / h)
                    var er = 1.6 + fme.energy * 2.2
                    ctx.rect(emberX - er, emberY - er, er * 2.0, er * 2.0)
                }
                ctx.fill()
            }
            ctx.restore()
        } else if (l1Mode === 3) {
            // Mode 3: Relativistic 3D Starfield Warp & Volumetric Nebula Clouds
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var starOriginX = cx + endPt.dx * 0.60
            var starOriginY = cy + endPt.dy * 0.60

            // Volumetric 3D nebula cloud rings around warp origin
            var nebFract = (((l1T * 0.20) % 1.0) + 1.0) % 1.0
            for (var nb = 2; nb >= 0; nb--) {
                var nebProg = (nb + nebFract) / 3.0
                var nebR = diagR * (0.08 + Math.pow(nebProg, 1.5) * 0.72) * (1.0 + state.bass * 0.18)
                var nebX = lerp(starOriginX, cx, nebProg * 0.5)
                var nebY = lerp(starOriginY, cy, nebProg * 0.5)
                ctx.fillStyle = colourWithAlpha(palette[(nb * 3 + 1) % palette.length], (0.06 + (1.0 - nebProg) * 0.07) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
                ctx.strokeStyle = colourWithAlpha(palette[(nb * 3) % palette.length], (0.20 + state.mid * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.4 + state.bass * 1.2
                ctx.beginPath()
                var nebSegs = 20
                for (var ns = 0; ns <= nebSegs; ns++) {
                    var na = (ns / nebSegs) * Math.PI * 2 + state.phase * (nb % 2 === 0 ? 0.25 : -0.25)
                    var nr = nebR * (1.0 + state.smoothBands[(ns * 3 + nb * 7) & 63] * 0.24)
                    var npx = nebX + Math.cos(na) * nr
                    var npy = nebY + Math.sin(na) * nr
                    if (ns === 0) ctx.moveTo(npx, npy)
                    else ctx.lineTo(npx, npy)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Relativistic hyperspace star streaks + glowing star heads
            var starLimit = Math.min(state.stars.length, Math.max(9, Math.round(72 * denCurve)))
            for (var sbk = 0; sbk < 3; sbk++) {
                var stCol = palette[(sbk * 3) % palette.length]
                ctx.strokeStyle = colourWithAlpha(stCol, (0.52 + state.high * 0.42) * (1.0 - dim))
                ctx.fillStyle = colourWithAlpha(palette[(sbk * 3 + 1) % palette.length], (0.75 + state.bass * 0.25) * (1.0 - dim))
                ctx.lineWidth = 1.5 + sbk * 0.5 + state.bass * 1.2
                ctx.beginPath()
                for (var sIdx = sbk; sIdx < starLimit; sIdx += 3) {
                    var st = state.stars[sIdx]
                    var sx0 = starOriginX + (st.x / st.pz) * minDim * 0.55
                    var sy0 = starOriginY + (st.y / st.pz) * minDim * 0.55
                    var sx1 = starOriginX + (st.x / st.z) * minDim * 0.55
                    var sy1 = starOriginY + (st.y / st.z) * minDim * 0.55
                    ctx.moveTo(sx0, sy0)
                    ctx.lineTo(sx1, sy1)
                }
                ctx.stroke()

                // Glowing star head pinpoints on near stars
                ctx.beginPath()
                for (var sIdx2 = sbk; sIdx2 < starLimit; sIdx2 += 3) {
                    var st2 = state.stars[sIdx2]
                    if (st2.z > 0.55) continue
                    var hx = starOriginX + (st2.x / st2.z) * minDim * 0.55
                    var hy = starOriginY + (st2.y / st2.z) * minDim * 0.55
                    var hr = clamp((1.0 - st2.z) * 3.2, 1.2, 3.4)
                    ctx.rect(hx - hr, hy - hr, hr * 2.0, hr * 2.0)
                }
                ctx.fill()
            }
            ctx.restore()
        } else if (l1Mode === 4) {
            // Mode 4: TRON / Atari Battlezone Fixed-Horizon Scrolling 3D Vector Landscape!
            // Features:
            //   1. Rock-steady fixed horizon at `horizonY` (never bobs vertically!)
            //   2. Jagged Atari Battlezone vector mountain range + active volcano peak + vector crescent moon on the horizon
            //   3. True 1/z perspective ground grid scrolling smoothly at calibrated speed (`l1T * 0.095`) in Towards / Away / Breathe
            //   4. 3D wireframe TRON / Battlezone pyramids, monolith blocks & tanks scaled by Content Density (`density`)
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var groundH = h - horizonY
            var panShift = Math.sin(driftT * 0.25) * w * 0.08

            // 1. Atari Battlezone Vector Crescent Moon & Distant Horizon Mountains above `horizonY`
            var moonX = w * 0.78 - panShift * 0.45
            var moonY = horizonY - Math.min(horizonY * 0.58, minDim * 0.26)
            var moonR = minDim * 0.055
            ctx.strokeStyle = colourWithAlpha(palette[1 % palette.length], (0.58 + state.high * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.6
            ctx.beginPath()
            for (var ma = 0; ma <= 16; ma++) {
                var mAng = -Math.PI * 0.65 + (ma / 16.0) * Math.PI * 1.3
                var mx = moonX + Math.cos(mAng) * moonR
                var my = moonY + Math.sin(mAng) * moonR
                if (ma === 0) ctx.moveTo(mx, my)
                else ctx.lineTo(mx, my)
            }
            for (var ma2 = 16; ma2 >= 0; ma2--) {
                var mAng2 = -Math.PI * 0.65 + (ma2 / 16.0) * Math.PI * 1.3
                var mx2 = moonX + moonR * 0.34 + Math.cos(mAng2) * moonR * 0.82
                var my2 = moonY + Math.sin(mAng2) * moonR * 0.88
                ctx.lineTo(mx2, my2)
            }
            ctx.closePath()
            ctx.stroke()

            // Jagged Atari Battlezone vector mountain silhouette + volcano crater along `horizonY`
            var mtnNodes = [
                0.00, 0.06,  0.06, 0.18,  0.11, 0.11,  0.18, 0.28,  0.24, 0.14,
                0.31, 0.22,  0.37, 0.08,  0.44, 0.34,  0.47, 0.31,  0.50, 0.35, // volcano crater at 0.44..0.50
                0.56, 0.09,  0.63, 0.24,  0.70, 0.13,  0.77, 0.29,  0.84, 0.12,
                0.91, 0.21,  0.96, 0.09,  1.00, 0.06
            ]
            var mtnMaxH = Math.min(horizonY * 0.55, h * 0.26)
            ctx.fillStyle = colourWithAlpha(palette[3 % palette.length], (0.09 + state.bass * 0.08) * (1.0 - dim) * (gpuOn ? 0.5 : 1.0))
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.68 + state.bass * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.9 + state.bass * 1.0
            ctx.beginPath()
            ctx.moveTo(0, horizonY)
            for (var mn = 0; mn < mtnNodes.length; mn += 2) {
                var mnx = mtnNodes[mn] * w
                var mny = horizonY - mtnNodes[mn + 1] * mtnMaxH * (1.0 + state.bass * 0.12)
                ctx.lineTo(mnx, mny)
            }
            ctx.lineTo(w, horizonY)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Internal wireframe ridge facets on the Battlezone mountains + erupting Volcano Smoke/Lava Plume
            ctx.strokeStyle = colourWithAlpha(palette[2 % palette.length], (0.42 + state.mid * 0.28) * (1.0 - dim))
            ctx.lineWidth = 1.2
            ctx.beginPath()
            for (var mr = 2; mr < mtnNodes.length - 2; mr += 4) {
                var pkX = mtnNodes[mr] * w
                var pkY = horizonY - mtnNodes[mr + 1] * mtnMaxH * (1.0 + state.bass * 0.12)
                ctx.moveTo(pkX, pkY)
                ctx.lineTo(pkX + (mr % 8 === 2 ? -w * 0.035 : w * 0.035), horizonY)
            }
            // Erupting volcano crater plume particles (from battlezone_1980.html)
            var volcCraterX = 0.47 * w
            var volcCraterY = horizonY - 0.34 * mtnMaxH * (1.0 + state.bass * 0.12)
            for (var vp = 0; vp < 8; vp++) {
                var vpLife = (((l1T * 0.85 + vp * 0.125) % 1.0) + 1.0) % 1.0
                var vpSpread = (vp % 2 === 0 ? 1.0 : -1.0) * (0.3 + (vp % 3) * 0.35) * vpLife * w * 0.035
                var vpHeight = Math.sin(vpLife * Math.PI * 0.85) * mtnMaxH * (0.42 + state.bassSmooth * 0.28)
                var vpx = volcCraterX + vpSpread
                var vpy = volcCraterY - vpHeight
                ctx.moveTo(vpx - 2.5, vpy)
                ctx.lineTo(vpx + 2.5, vpy + 3.0)
            }
            ctx.stroke()

            // 2. True 1/z Perspective Checkered & Scrolling TRON / Battlezone Ground Grid below `horizonY`
            //    Fixed, clean grid spacing (rows = 16, cols = 18) with alternating perspective checkered floor tiles!
            var rows = 16
            var cols = 18
            var worldScroll = l1T * 0.095
            var scrollFract = (((worldScroll * rows) % 1.0) + 1.0) % 1.0
            var worldRowBase = Math.floor(worldScroll * rows)

            // Perspective checkered floor tiles marching towards/away from the viewer
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.09 + state.bass * 0.10) * (1.0 - dim) * (gpuOn ? 0.50 : 1.0))
            ctx.beginPath()
            for (var rf = 0; rf < rows - 1; rf++) {
                var u0 = (rf + scrollFract) / rows
                var u1 = (rf + 1.0 + scrollFract) / rows
                var p0 = Math.pow(u0, 2.05)
                var p1 = Math.pow(u1, 2.05)
                var y0 = horizonY + p0 * groundH
                var y1 = horizonY + p1 * groundH
                var rParity = ((rf - worldRowBase) & 1 + 2) & 1
                for (var cf = -8; cf < 8; cf++) {
                    if (((cf + rParity) & 1) !== 0) continue
                    var topX0 = vanishX + cf * (w * 0.014), topX1 = vanishX + (cf + 1) * (w * 0.014)
                    var botX0 = vanishX + cf * (w * 0.18),  botX1 = vanishX + (cf + 1) * (w * 0.18)
                    var x00 = lerp(topX0, botX0, p0), x01 = lerp(topX1, botX1, p0)
                    var x11 = lerp(topX1, botX1, p1), x10 = lerp(topX0, botX0, p1)
                    ctx.moveTo(x00, y0)
                    ctx.lineTo(x01, y0)
                    ctx.lineTo(x11, y1)
                    ctx.lineTo(x10, y1)
                    ctx.closePath()
                }
            }
            ctx.fill()

            // Crisp neon horizon line + scrolling transverse ground lines + longitudinal perspective lanes
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.46 + state.bass * 0.38) * (1.0 - dim))
            ctx.lineWidth = 1.4 + state.bass * 1.1
            ctx.beginPath()
            ctx.moveTo(0, horizonY)
            ctx.lineTo(w, horizonY)
            for (var r = 0; r < rows; r++) {
                var uRow = (r + scrollFract) / rows
                var gy = horizonY + Math.pow(uRow, 2.05) * groundH
                ctx.moveTo(0, gy)
                ctx.lineTo(w, gy)
            }
            for (var c = -cols; c <= cols; c++) {
                var topX = vanishX + c * (w * 0.014)
                var botX = vanishX + c * (w * 0.18)
                ctx.moveTo(topX, horizonY)
                ctx.lineTo(botX, h)
            }
            ctx.stroke()

            // 3. Full 3-Axis 3D Wireframe Landscape & Airborne Models scaled by Field Density (`density`) and Shape Density (`shapeDenBz`)!
            //    - Non-linear minimal-to-many curve (`bzDenCurve`): 1 obstacle & 1 tank at 0.25x..0.5x up to 16 obstacles & 9 tanks at 2.0x+!
            //    - Shapes in Battlezone appear BOTH on the terrain AND flying/floating OFF the land in the 3D sky above the landscape!
            //    - 3D wireframe Battlezone tanks simultaneously roll across the ground plane firing vector shells!
            var activeShapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
            var shapeScaleBz = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
            var shapeDenBz = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
            var bzDenCurve = Math.pow(density * shapeDenBz, 1.65)
            var obsCount = Math.max(1, Math.min(16, Math.round((shapesOn ? 3.5 : 2.5) * bzDenCurve)))
            var objSpinCfg = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 1.0
            for (var ob = 0; ob < obsCount; ob++) {
                var obProg = ((((ob / obsCount) + worldScroll) % 1.0) + 1.0) % 1.0
                var horizonFade = smoothstep(0.0, 0.14, obProg)
                if (horizonFade < 0.02) continue
                var perspOb = Math.pow(obProg, 2.05) // 0 at horizon -> 1 at foreground bottom
                var sideSign = (ob % 2 === 0) ? -1.0 : 1.0
                var laneSpread = 0.20 + ((ob * 3) % 5) * 0.13
                var obX = vanishX + sideSign * laneSpread * w * (0.03 + perspOb * 0.88)
                var obY = horizonY + perspOb * groundH * 1.05
                var obSizeMul = 0.55 + ((ob * 37) % 11) * 0.095
                var obScale = (5.5 + perspOb * minDim * 0.115) * (1.0 + state.bass * 0.16) * Math.sqrt(shapeScaleBz) * obSizeMul
                // Allow a portion of Battlezone shapes to fly/float OFF the land in the 3D sky above the terrain & horizon!
                var isAirborne = shapesOn ? (ob % 2 === 0 || activeShapeStyle === 1) : (ob % 3 === 2)
                var skyAltitude = isAirborne
                    ? (minDim * (0.16 + 0.13 * ((ob * 3) % 3)) + Math.sin(l1T * 1.6 + ob * 1.9) * minDim * 0.05) * (0.42 + perspOb * 0.85)
                    : 0.0
                var hoverY = obY - obScale * (0.85 + 0.18 * Math.sin(l1T * 1.8 + ob * 2.1)) - skyAltitude

                // Full 3-axis 3D rotation angles (rx, ry, rz) with per-object polarity and speed variation
                var obSpinDir = (ob % 3 === 1) ? -1.0 : 1.0
                var ry = l1T * (0.75 + ((ob * 7) % 5) * 0.28) * obSpinDir * (objSpinCfg !== 0 ? objSpinCfg : 0.6) + ob * 1.57
                var rx = Math.sin(l1T * 0.72 + ob * 1.9) * 0.42 + (ob % 3 === 2 ? l1T * 0.65 * obSpinDir : 0.18)
                var rz = Math.cos(l1T * 0.64 + ob * 1.3) * 0.34

                ctx.strokeStyle = colourWithAlpha(palette[(1 + ob) % palette.length], (0.78 + state.high * 0.22) * horizonFade * (1.0 - dim))
                ctx.lineWidth = (1.5 + perspOb * 1.2 + state.bass * 0.8)
                ctx.beginPath()

                if (shapesOn && activeShapeStyle === 1) {
                    // Style 1: 1983 Atari Color-QuadraScan XY Vector Star Wars Craft (Standard TIE, Vader TIE Advanced x1, X-Wing)
                    var csBz = Math.max(7.0, obScale * 1.15)
                    append3DStarWarsFighter(ctx, ob % 3, obX, hoverY, csBz, rx * 0.6, ry, rz * 0.6)
                } else if (shapesOn && activeShapeStyle === 2) {
                    // Style 2: 3D TRON Recognizers marching & flying across the Battlezone grid
                    var rsBz = Math.max(8.0, obScale * 1.15)
                    var recBoxes = [
                        [-0.48, -0.88, -0.22,  0.48, -0.72, 0.22],
                        [-0.82, -0.62, -0.28,  0.82, -0.34, 0.28],
                        [-0.80, -0.34, -0.24, -0.44,  0.54, 0.24],
                        [ 0.44, -0.34, -0.24,  0.80,  0.54, 0.24],
                        [-0.96,  0.54, -0.32, -0.38,  0.72, 0.32],
                        [ 0.38,  0.54, -0.32,  0.96,  0.72, 0.32]
                    ]
                    var bEdgesBz = [0, 1,  1, 2,  2, 3,  3, 0,  4, 5,  5, 6,  6, 7,  7, 4,  0, 4,  1, 5,  2, 6,  3, 7]
                    for (var rbi = 0; rbi < recBoxes.length; rbi++) {
                        var bx = recBoxes[rbi]
                        var bvBz = [
                            [bx[0], bx[1], bx[2]], [bx[3], bx[1], bx[2]], [bx[3], bx[1], bx[5]], [bx[0], bx[1], bx[5]],
                            [bx[0], bx[4], bx[2]], [bx[3], bx[4], bx[2]], [bx[3], bx[4], bx[5]], [bx[0], bx[4], bx[5]]
                        ]
                        var bpRec = []
                        for (var bvi = 0; bvi < 8; bvi++) {
                            bpRec.push(project3DPoint(bvBz[bvi][0], bvBz[bvi][1], bvBz[bvi][2], rx * 0.4, ry, rz * 0.3, obX, hoverY, rsBz, 3.8))
                        }
                        for (var bei = 0; bei < bEdgesBz.length; bei += 2) {
                            ctx.moveTo(bpRec[bEdgesBz[bei]].x, bpRec[bEdgesBz[bei]].y)
                            ctx.lineTo(bpRec[bEdgesBz[bei + 1]].x, bpRec[bEdgesBz[bei + 1]].y)
                        }
                    }
                } else if (shapesOn && activeShapeStyle === 4) {
                    // Style 4: 3D Merkaba Starbursts (Dual-Apex 3D Star Tetrahedra hovering & flying over the terrain)
                    var pts2Bz = 12
                    var starRingBz = []
                    for (var svB = 0; svB < pts2Bz; svB++) {
                        var ang2B = (svB / pts2Bz) * Math.PI * 2
                        var r2B = (svB % 2 === 0) ? 1.0 : 0.48
                        var szB = (svB % 2 === 0) ? ((svB % 4 === 0) ? 0.32 : -0.32) : 0.0
                        var sPtB = project3DPoint(Math.cos(ang2B) * r2B, Math.sin(ang2B) * r2B, szB, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                        starRingBz.push(sPtB)
                        if (svB === 0) ctx.moveTo(sPtB.x, sPtB.y); else ctx.lineTo(sPtB.x, sPtB.y)
                    }
                    ctx.closePath()
                    var apexFB = project3DPoint(0, 0,  0.68, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                    var apexBB = project3DPoint(0, 0, -0.68, rx, ry, rz, obX, hoverY, obScale * 1.2, 3.6)
                    for (var sv2B = 0; sv2B < pts2Bz; sv2B += 2) {
                        ctx.moveTo(starRingBz[sv2B].x, starRingBz[sv2B].y); ctx.lineTo(apexFB.x, apexFB.y)
                        ctx.moveTo(starRingBz[sv2B].x, starRingBz[sv2B].y); ctx.lineTo(apexBB.x, apexBB.y)
                    }
                } else if (shapesOn && activeShapeStyle === 5) {
                    // Style 5: 3D Sonic Boom Rings (3D Gyroscopic Harmonic Portal Rings across the landscape & sky)
                    var ringSegsBz = 24
                    for (var rs2B = 0; rs2B <= ringSegsBz; rs2B++) {
                        var ang1B = (rs2B / ringSegsBz) * Math.PI * 2
                        var mod1B = 1.0 + Math.sin(ang1B * 4.0) * state.bass * 0.08
                        var rzWaveB = Math.sin(ang1B * 3.0 + l1T * 2.5) * 0.18 * (0.4 + state.bass)
                        var rp1B = project3DPoint(Math.cos(ang1B) * mod1B, Math.sin(ang1B) * mod1B, rzWaveB, rx * 0.65, ry * 0.65, rz, obX, hoverY, obScale * 1.25, 3.6)
                        if (rs2B === 0) ctx.moveTo(rp1B.x, rp1B.y); else ctx.lineTo(rp1B.x, rp1B.y)
                    }
                    ctx.closePath()
                } else {
                    // Style 0/3 or Default Battlezone Obstacles (including when styles 6..13 are rendered by SUB-SYSTEM 3):
                    // 3D Sacred Polyhedra (Pyramids, Monolith Cubes & Octahedra/Prisms)
                    if (ob % 3 === 1) {
                        var pyrV = [
                            [-1.0,  0.75, -1.0],
                            [ 1.0,  0.75, -1.0],
                            [ 1.0,  0.75,  1.0],
                            [-1.0,  0.75,  1.0],
                            [ 0.0, -1.15,  0.0]
                        ]
                        var pp = []
                        for (var pv = 0; pv < 5; pv++) {
                            pp.push(project3DPoint(pyrV[pv][0], pyrV[pv][1], pyrV[pv][2], rx, ry, rz, obX, hoverY, obScale, 3.8))
                        }
                        ctx.moveTo(pp[0].x, pp[0].y); ctx.lineTo(pp[1].x, pp[1].y); ctx.lineTo(pp[2].x, pp[2].y); ctx.lineTo(pp[3].x, pp[3].y); ctx.closePath()
                        for (var pc = 0; pc < 4; pc++) {
                            ctx.moveTo(pp[pc].x, pp[pc].y); ctx.lineTo(pp[4].x, pp[4].y)
                        }
                    } else if (ob % 3 === 0) {
                        var cubV = [
                            [-0.82,  0.88, -0.82], [ 0.82,  0.88, -0.82], [ 0.82,  0.88,  0.82], [-0.82,  0.88,  0.82],
                            [-0.82, -0.88, -0.82], [ 0.82, -0.88, -0.82], [ 0.82, -0.88,  0.82], [-0.82, -0.88,  0.82]
                        ]
                        var cp = []
                        for (var cv = 0; cv < 8; cv++) {
                            cp.push(project3DPoint(cubV[cv][0], cubV[cv][1], cubV[cv][2], rx, ry, rz, obX, hoverY, obScale, 3.8))
                        }
                        var cubEdges = [0, 1,  1, 2,  2, 3,  3, 0,  4, 5,  5, 6,  6, 7,  7, 4,  0, 4,  1, 5,  2, 6,  3, 7]
                        for (var ce = 0; ce < cubEdges.length; ce += 2) {
                            ctx.moveTo(cp[cubEdges[ce]].x, cp[cubEdges[ce]].y)
                            ctx.lineTo(cp[cubEdges[ce + 1]].x, cp[cubEdges[ce + 1]].y)
                        }
                    } else {
                        var sidesBz = 6 + (ob & 1) * 2
                        var topPtsBz = [], botPtsBz = []
                        for (var vBz = 0; vBz < sidesBz; vBz++) {
                            var angBz = (vBz / sidesBz) * Math.PI * 2
                            topPtsBz.push(project3DPoint(Math.cos(angBz), Math.sin(angBz),  0.42, rx, ry, rz, obX, hoverY, obScale * 1.15, 3.6))
                            botPtsBz.push(project3DPoint(Math.cos(angBz), Math.sin(angBz), -0.42, rx, ry, rz, obX, hoverY, obScale * 1.15, 3.6))
                        }
                        for (var v1B = 0; v1B <= sidesBz; v1B++) {
                            var pTB = topPtsBz[v1B % sidesBz]
                            if (v1B === 0) ctx.moveTo(pTB.x, pTB.y); else ctx.lineTo(pTB.x, pTB.y)
                        }
                        for (var v2B = 0; v2B <= sidesBz; v2B++) {
                            var pBB = botPtsBz[v2B % sidesBz]
                            if (v2B === 0) ctx.moveTo(pBB.x, pBB.y); else ctx.lineTo(pBB.x, pBB.y)
                        }
                        for (var v3B = 0; v3B < sidesBz; v3B++) {
                            ctx.moveTo(topPtsBz[v3B].x, topPtsBz[v3B].y)
                            ctx.lineTo(botPtsBz[v3B].x, botPtsBz[v3B].y)
                        }
                    }
                }
                ctx.stroke()
            }

            // 4. 3D Wireframe 1980 Atari Battlezone Tanks Rolling on the Landscape + Cannon Shells!
            var tankCount = Math.max(1, Math.min(9, Math.round(2.5 * bzDenCurve)))
            var shellMuzzles = []
            for (var tk = 0; tk < tankCount; tk++) {
                var tkProg = ((((tk / tankCount) + worldScroll + 0.12) % 1.0) + 1.0) % 1.0
                var tkFade = smoothstep(0.0, 0.14, tkProg)
                if (tkFade < 0.02) continue
                var perspTk = Math.pow(tkProg, 2.05)
                var tkSide = (tk % 2 === 0) ? 1.0 : -1.0
                var tkSteer = Math.sin(l1T * 0.35 + tk * 2.3) * 0.10
                var tkLane = ((tk % 3) * 0.18 + 0.18) * tkSide + tkSteer
                var tkX = vanishX + tkLane * w * (0.04 + perspTk * 0.86)
                var tkY = horizonY + perspTk * groundH * 1.02
                var tkScale = (6.0 + perspTk * minDim * 0.115) * (1.0 + state.bass * 0.12)

                // Tank hull 3D orientation (steering yaw + terrain pitch + subtle suspension roll)
                var hullYaw = Math.sin(l1T * 0.42 + tk * 1.9) * 0.42 - tkSide * 0.22
                var hullPitch = 0.16 + Math.sin(l1T * 1.2 + tk) * 0.04
                var hullRoll = Math.cos(l1T * 0.9 + tk * 1.7) * 0.05
                var turretYawRel = Math.sin(l1T * 0.65 + tk * 2.4) * 0.85 + Math.cos(l1T * 0.28 + tk) * 0.45
                var gunElev = 0.12 + state.bassSmooth * 0.18 + state.beatPulse * 0.12
                var radarSpin = l1T * 2.8 + tk * 1.57

                ctx.strokeStyle = colourWithAlpha(palette[(tk * 2) % palette.length], (0.84 + state.bass * 0.16) * tkFade * (1.0 - dim))
                ctx.lineWidth = 1.6 + perspTk * 1.3 + state.beatPulse * 0.8
                ctx.beginPath()
                var muzzle = append3DWireframeTank(
                    ctx,
                    tkX,
                    tkY - tkScale * 0.34,
                    tkScale,
                    hullPitch,
                    hullYaw,
                    hullRoll,
                    turretYawRel,
                    gunElev,
                    radarSpin
                )
                ctx.stroke()

                if (tkProg > 0.16) {
                    shellMuzzles.push({
                        x: muzzle.x,
                        y: muzzle.y,
                        dx: muzzle.dx,
                        dy: muzzle.dy,
                        scale: tkScale,
                        fade: tkFade,
                        idx: tk
                    })
                }
            }

            // Audio-reactive vector cannon shells / tracer rounds firing from the Battlezone tank turrets!
            if (shellMuzzles.length > 0) {
                ctx.strokeStyle = colourWithAlpha("#fff3a1", (0.88 + state.beatPulse * 0.12) * (1.0 - dim))
                ctx.lineWidth = 2.0 + state.bass * 1.4
                ctx.beginPath()
                for (var sm = 0; sm < shellMuzzles.length; sm++) {
                    var mObj = shellMuzzles[sm]
                    var shotTravel = (((l1T * 0.95 + mObj.idx * 0.37) % 1.0) + 1.0) % 1.0
                    var sx0 = mObj.x + mObj.dx * (0.4 + shotTravel * 4.2)
                    var sy0 = mObj.y + mObj.dy * (0.4 + shotTravel * 4.2)
                    var sx1 = mObj.x + mObj.dx * (1.0 + shotTravel * 4.2)
                    var sy1 = mObj.y + mObj.dy * (1.0 + shotTravel * 4.2)
                    ctx.moveTo(sx0, sy0)
                    ctx.lineTo(sx1, sy1)
                    var flareR = Math.max(2.5, mObj.scale * 0.14 * (1.0 - shotTravel * 0.4))
                    ctx.moveTo(sx1 - flareR, sy1); ctx.lineTo(sx1 + flareR, sy1)
                    ctx.moveTo(sx1, sy1 - flareR); ctx.lineTo(sx1, sy1 + flareR)
                }
                ctx.stroke()
            }

            // 1980 Atari Battlezone 6-Sided 2-Tier Flying Saucer (Bonus 5,000 Pt Disc cruising across the plain)
            var saucerPhase = (l1T * 0.14) % 1.0
            var saucerX = lerp(w * 0.12, w * 0.88, saucerPhase)
            var saucerY = horizonY + h * (0.045 + 0.025 * Math.sin(l1T * 1.4))
            var saucerScale = Math.min(w, h) * 0.042
            var saucerSpin = l1T * 2.4
            ctx.strokeStyle = colourWithAlpha("#24FF44", (0.86 + state.treble * 0.14) * (1.0 - dim))
            ctx.lineWidth = 1.6 + state.beatPulse * 0.8
            ctx.beginPath()
            for (var si = 0; si < 6; si++) {
                var sa0 = saucerSpin + (si / 6) * Math.PI * 2
                var sa1 = saucerSpin + ((si + 1) / 6) * Math.PI * 2
                var rimX0 = saucerX + Math.cos(sa0) * saucerScale
                var rimY0 = saucerY + Math.sin(sa0) * saucerScale * 0.34
                var rimX1 = saucerX + Math.cos(sa1) * saucerScale
                var rimY1 = saucerY + Math.sin(sa1) * saucerScale * 0.34
                var domeX0 = saucerX + Math.cos(sa0) * saucerScale * 0.48
                var domeY0 = saucerY - saucerScale * 0.32 + Math.sin(sa0) * saucerScale * 0.16
                var domeX1 = saucerX + Math.cos(sa1) * saucerScale * 0.48
                var domeY1 = saucerY - saucerScale * 0.32 + Math.sin(sa1) * saucerScale * 0.16
                var baseX0 = saucerX + Math.cos(sa0) * saucerScale * 0.55
                var baseY0 = saucerY + saucerScale * 0.22 + Math.sin(sa0) * saucerScale * 0.18
                var baseX1 = saucerX + Math.cos(sa1) * saucerScale * 0.55
                var baseY1 = saucerY + saucerScale * 0.22 + Math.sin(sa1) * saucerScale * 0.18
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(rimX1, rimY1)
                ctx.moveTo(domeX0, domeY0); ctx.lineTo(domeX1, domeY1)
                ctx.moveTo(baseX0, baseY0); ctx.lineTo(baseX1, baseY1)
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(domeX0, domeY0)
                ctx.moveTo(rimX0, rimY0); ctx.lineTo(baseX0, baseY0)
            }
            ctx.stroke()

            ctx.restore()
        } else if (l1Mode === 5) {
            // Mode 5: 1983 Atari Star Wars Color-QuadraScan XY Vector Arcade Experience (Open Viewport, Zero Cockpit)
            //   - Pure #000000 CRT Void + Dual-Pass QuadraScan Phosphor Glow (`strokeQuadraScanPass`) + White CRT Vertex Bloom Dots
            //   - Looming 3D Wireframe Death Star Sphere (#11FF11 Green) in upper sky with recessed Superlaser Dish & Equatorial Trench
            //   - Tall 3D Surface Defense Towers (#FFFF11 Yellow / #00FFFF Cyan / #FF1111 Red) & Trench Rim 3D Box Gun Turrets
            //   - Deep 3D Death Star Trench with Recessed Greeble Bays & 3D Cuboid X-Braced Girder Catwalk Blockades
            //   - Built-in Multi-Colour 3D TIE Fighter & Darth Vader TIE Advanced x1 Squadron Dogfighting in the Trench
            //   - Player X-Wing Quad Corner Laser Bolts (#FF1111 Red / #11FF11 Green) + Rotating 8-Pointed Star Fireballs + Thermal Exhaust Port
            ctx.save()
            ctx.globalCompositeOperation = "source-over"

            var bankAngle = Math.sin(driftT * 0.52) * 0.16 + Math.cos(l1T * 0.31) * 0.07
            var trenchVX = Math.sin(driftT * 0.42) * w * 0.06
            var camAlt = clamp(
                Math.sin(l1T * 0.82 + driftT * 0.35) * 0.60
                + Math.cos(l1T * 0.41 - driftT * 0.28) * 0.22
                + (state.bassSmooth - state.midSmooth) * 0.20,
                -0.88,
                0.88
            )

            ctx.translate(cx, cy)
            ctx.rotate(bankAngle)

            var halfWFar = w * 0.032
            var halfWNear = w * 0.54
            var halfHFar = h * 0.068
            var halfHNear = h * 1.12

            var vyFar = camAlt * h * 0.24
            var vyNear = camAlt * h * 0.50
            var yTFar = vyFar - halfHFar
            var yBFar = vyFar + halfHFar
            var yTNear = vyNear - halfHNear
            var yBNear = vyNear + halfHNear

            var sliceCount = 12
            var blockadeStride = density >= 1.55 ? 2 : (density <= 0.45 ? 10 : (density <= 0.75 ? 6 : 3))
            var towerStride = density >= 1.45 ? 2 : (density <= 0.45 ? 8 : (density <= 0.75 ? 5 : 3))
            var turretStride = density >= 1.45 ? 2 : (density <= 0.45 ? 8 : (density <= 0.75 ? 4 : 2))
            var tFlow = l1T * 1.95
            var tScroll = ((tFlow % 1.0) + 1.0) % 1.0
            var baseWorldSlice = Math.floor(tFlow)
            var visAlpha = 1.0 - dim
            var strokeW = 1.65 + state.bass * 0.85

            var blockades = []
            var rimTurrets = []
            var surfaceTowers = []
            var bloomDots = []

            // 1. Yellow (#FFFF11) Single-Wall Longitudinal Trench Rails, Vertical Wall Ribs, Recessed 3D Greeble Bays & Tall 3D Surface Defense Towers
            ctx.beginPath()
            for (var wl = 1; wl <= 6; wl++) {
                var wf = wl / 6.0
                var yFarRail = lerp(yTFar, yBFar, wf)
                var yNearRail = lerp(yTNear, yBNear, wf)
                ctx.moveTo(trenchVX - halfWFar, yFarRail)
                ctx.lineTo(-halfWNear, yNearRail)
                ctx.moveTo(trenchVX + halfWFar, yFarRail)
                ctx.lineTo(halfWNear, yNearRail)
            }
            for (var sf = 0; sf < sliceCount; sf++) {
                var uS = (sf + tScroll) / sliceCount
                var pS = Math.pow(uS, 1.85)
                var vxs = trenchVX * (1.0 - pS)
                var xL = vxs - lerp(halfWFar, halfWNear, pS)
                var xR = vxs + lerp(halfWFar, halfWNear, pS)
                var yT = lerp(yTFar, yTNear, pS)
                var yB = lerp(yBFar, yBNear, pS)

                // Left & right vertical wall rib lines
                ctx.moveTo(xL, yT); ctx.lineTo(xL, yB)
                ctx.moveTo(xR, yT); ctx.lineTo(xR, yB)

                if (sf + 1 < sliceCount) {
                    var uNext = (sf + 1 + tScroll) / sliceCount
                    var pNext = Math.pow(uNext, 1.85)
                    var vxNext = trenchVX * (1.0 - pNext)
                    var xLNext = vxNext - lerp(halfWFar, halfWNear, pNext)
                    var xRNext = vxNext + lerp(halfWFar, halfWNear, pNext)
                    var yTNext = lerp(yTFar, yTNear, pNext)
                    var yBNext = lerp(yBFar, yBNear, pNext)

                    var wSlice = baseWorldSlice - sf
                    // Recessed 3D rectangular detail greeble bays on the left & right trench walls
                    if ((wSlice & 1) === 0) {
                        var yp0a = lerp(yT, yB, 0.18), yp0b = lerp(yT, yB, 0.82)
                        var yp1a = lerp(yTNext, yBNext, 0.18), yp1b = lerp(yTNext, yBNext, 0.82)
                        ctx.moveTo(xL, yp0a); ctx.lineTo(xLNext, yp1a); ctx.lineTo(xLNext, yp1b); ctx.lineTo(xL, yp0b); ctx.closePath()
                        ctx.moveTo(xR, yp0a); ctx.lineTo(xRNext, yp1a); ctx.lineTo(xRNext, yp1b); ctx.lineTo(xR, yp0b); ctx.closePath()
                        var ypMid0 = lerp(yT, yB, 0.50), ypMid1 = lerp(yTNext, yBNext, 0.50)
                        ctx.moveTo(xL, ypMid0); ctx.lineTo(xLNext, ypMid1)
                        ctx.moveTo(xR, ypMid0); ctx.lineTo(xRNext, ypMid1)
                    }

                    // Collect true 3D hexagonal-prism barrier beams spanning wall-to-wall across the tunnel
                    if (((wSlice % blockadeStride) + blockadeStride) % blockadeStride === 0 && uS > 0.10) {
                        var blkIdx = Math.floor(wSlice / blockadeStride)
                        var blkSlot = ((blkIdx % 3) + 3) % 3
                        var bFrac0 = blkSlot === 0 ? 0.17 : (blkSlot === 1 ? 0.43 : 0.67)
                        var bFrac1 = blkSlot === 0 ? 0.31 : (blkSlot === 1 ? 0.57 : 0.81)
                        var pRear = lerp(pS, pNext, 0.36)
                        var vxRear = trenchVX * (1.0 - pRear)
                        var xLRear = vxRear - lerp(halfWFar, halfWNear, pRear)
                        var xRRear = vxRear + lerp(halfWFar, halfWNear, pRear)
                        var yTRear = lerp(yTFar, yTNear, pRear)
                        var yBRear = lerp(yBFar, yBNear, pRear)
                        blockades.push({
                            xL0: xL,
                            xR0: xR,
                            y0: lerp(yT, yB, bFrac0),
                            y1: lerp(yT, yB, bFrac1),
                            xL1: xLRear,
                            xR1: xRRear,
                            y0Rear: lerp(yTRear, yBRear, bFrac0),
                            y1Rear: lerp(yTRear, yBRear, bFrac1),
                            p: pS,
                            slot: blkSlot
                        })
                    }

                    // Collect top-ledge 3D wireframe gun turrets along the left & right trench rims
                    if (((wSlice % turretStride) + turretStride) % turretStride === 1 && uS > 0.16 && uS < 0.72) {
                        var pTurRear = lerp(pS, pNext, 0.42)
                        var vxTurRear = trenchVX * (1.0 - pTurRear)
                        var xLTurRear = vxTurRear - lerp(halfWFar, halfWNear, pTurRear)
                        var xRTurRear = vxTurRear + lerp(halfWFar, halfWNear, pTurRear)
                        var yTTurRear = lerp(yTFar, yTNear, pTurRear)
                        rimTurrets.push({
                            xL0: xL, xR0: xR, yT0: yT,
                            xL1: xLTurRear, xR1: xRTurRear, yT1: yTTurRear,
                            p: pS, wSlice: wSlice
                        })
                    }

                    // Collect tall 3D Surface Defense Towers rising from the upper Death Star surface deck
                    if (((wSlice % towerStride) + towerStride) % towerStride === 0 && uS > 0.14 && uS < 0.70) {
                        var pTowRear = lerp(pS, pNext, 0.48)
                        var vxTowRear = trenchVX * (1.0 - pTowRear)
                        var xLTowRear = vxTowRear - lerp(halfWFar, halfWNear, pTowRear)
                        var xRTowRear = vxTowRear + lerp(halfWFar, halfWNear, pTowRear)
                        var yTTowRear = lerp(yTFar, yTNear, pTowRear)
                        var span0 = xR - xL
                        var span1 = xRTowRear - xLTowRear
                        var towW0 = span0 * 0.13
                        var towW1 = span1 * 0.13
                        var hMul = 0.34 + ((Math.abs(wSlice) * 5) % 3) * 0.10
                        var towH0 = span0 * hMul
                        var towH1 = span1 * hMul
                        surfaceTowers.push({
                            lx0: clamp(xL - towW0 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            lx0In: clamp(xL + towW0 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            lx1: clamp(xLTowRear - towW1 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            lx1In: clamp(xLTowRear + towW1 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            rx0: clamp(xR + towW0 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            rx0In: clamp(xR - towW0 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            rx1: clamp(xRTowRear + towW1 * 0.15, -halfWNear * 0.96, halfWNear * 0.96),
                            rx1In: clamp(xRTowRear - towW1 * 0.85, -halfWNear * 0.96, halfWNear * 0.96),
                            yB0: yT, yT0: yT - towH0,
                            yB1: yTTowRear, yT1: yTTowRear - towH1,
                            p: pS
                        })
                    }
                }

                if (uS > 0.18 && uS < 0.80) {
                    bloomDots.push({ x: xL, y: yT }, { x: xR, y: yT }, { x: xL, y: yB }, { x: xR, y: yB })
                }
            }
            // Append tall 3D Surface Defense Tower vertical columns & cross-braced tiers to Yellow batch
            for (var sti = 0; sti < surfaceTowers.length; sti++) {
                var stw = surfaceTowers[sti]
                // Left tower 4 vertical columns + front X-brace
                ctx.moveTo(stw.lx0, stw.yB0);   ctx.lineTo(stw.lx0, stw.yT0)
                ctx.moveTo(stw.lx0In, stw.yB0); ctx.lineTo(stw.lx0In, stw.yT0)
                ctx.moveTo(stw.lx1, stw.yB1);   ctx.lineTo(stw.lx1, stw.yT1)
                ctx.moveTo(stw.lx1In, stw.yB1); ctx.lineTo(stw.lx1In, stw.yT1)
                ctx.moveTo(stw.lx0, stw.yB0);   ctx.lineTo(stw.lx0In, stw.yT0)
                ctx.moveTo(stw.lx0In, stw.yB0); ctx.lineTo(stw.lx0, stw.yT0)
                // Right tower 4 vertical columns + front X-brace
                ctx.moveTo(stw.rx0, stw.yB0);   ctx.lineTo(stw.rx0, stw.yT0)
                ctx.moveTo(stw.rx0In, stw.yB0); ctx.lineTo(stw.rx0In, stw.yT0)
                ctx.moveTo(stw.rx1, stw.yB1);   ctx.lineTo(stw.rx1, stw.yT1)
                ctx.moveTo(stw.rx1In, stw.yB1); ctx.lineTo(stw.rx1In, stw.yT1)
                ctx.moveTo(stw.rx0, stw.yB0);   ctx.lineTo(stw.rx0In, stw.yT0)
                ctx.moveTo(stw.rx0In, stw.yB0); ctx.lineTo(stw.rx0, stw.yT0)
            }
            strokeQuadraScanPass(ctx, "#FFFF11", strokeW, (0.84 + state.bass * 0.16) * visAlpha, false)

            // 2. Cyan (#00FFFF) Top Trench Rim Lip, Rim Gunbox Bases & Surface Tower Roof Decks
            ctx.beginPath()
            ctx.moveTo(trenchVX - halfWFar, yTFar); ctx.lineTo(-halfWNear, yTNear)
            ctx.moveTo(trenchVX + halfWFar, yTFar); ctx.lineTo(halfWNear, yTNear)
            for (var rt = 0; rt < rimTurrets.length; rt++) {
                var tur = rimTurrets[rt]
                var tw0 = (tur.xR0 - tur.xL0) * 0.085
                var tw1 = (tur.xR1 - tur.xL1) * 0.085
                var th0 = tw0 * 0.85
                var th1 = tw1 * 0.85
                var lx0 = tur.xL0, lx0In = tur.xL0 + tw0, ly0 = tur.yT0, ly0Top = tur.yT0 - th0
                var lx1 = tur.xL1, lx1In = tur.xL1 + tw1, ly1 = tur.yT1, ly1Top = tur.yT1 - th1
                ctx.moveTo(lx0, ly0);    ctx.lineTo(lx0In, ly0);    ctx.lineTo(lx0In, ly0Top); ctx.lineTo(lx0, ly0Top); ctx.closePath()
                ctx.moveTo(lx1, ly1);    ctx.lineTo(lx1In, ly1);    ctx.lineTo(lx1In, ly1Top); ctx.lineTo(lx1, ly1Top); ctx.closePath()
                ctx.moveTo(lx0, ly0Top); ctx.lineTo(lx1, ly1Top);   ctx.moveTo(lx0In, ly0Top); ctx.lineTo(lx1In, ly0Top)
                var rx0 = tur.xR0, rx0In = tur.xR0 - tw0, ry0 = tur.yT0, ry0Top = tur.yT0 - th0
                var rx1 = tur.xR1, rx1In = tur.xR1 - tw1, ry1 = tur.yT1, ry1Top = tur.yT1 - th1
                ctx.moveTo(rx0, ry0);    ctx.lineTo(rx0In, ry0);    ctx.lineTo(rx0In, ry0Top); ctx.lineTo(rx0, ry0Top); ctx.closePath()
                ctx.moveTo(rx1, ry1);    ctx.lineTo(rx1In, ry1);    ctx.lineTo(rx1In, ry1Top); ctx.lineTo(rx1, ry1Top); ctx.closePath()
                ctx.moveTo(rx0, ry0Top); ctx.lineTo(rx1, ry1Top);   ctx.moveTo(rx0In, ry0Top); ctx.lineTo(rx1In, ry1Top)
            }
            for (var stc = 0; stc < surfaceTowers.length; stc++) {
                var stwC = surfaceTowers[stc]
                var lMidY0 = lerp(stwC.yB0, stwC.yT0, 0.55), lMidY1 = lerp(stwC.yB1, stwC.yT1, 0.55)
                ctx.moveTo(stwC.lx0, stwC.yT0); ctx.lineTo(stwC.lx0In, stwC.yT0); ctx.lineTo(stwC.lx1In, stwC.yT1); ctx.lineTo(stwC.lx1, stwC.yT1); ctx.closePath()
                ctx.moveTo(stwC.lx0, lMidY0);   ctx.lineTo(stwC.lx0In, lMidY0);   ctx.lineTo(stwC.lx1In, lMidY1);   ctx.lineTo(stwC.lx1, lMidY1);   ctx.closePath()
                ctx.moveTo(stwC.rx0, stwC.yT0); ctx.lineTo(stwC.rx0In, stwC.yT0); ctx.lineTo(stwC.rx1In, stwC.yT1); ctx.lineTo(stwC.rx1, stwC.yT1); ctx.closePath()
                ctx.moveTo(stwC.rx0, lMidY0);   ctx.lineTo(stwC.rx0In, lMidY0);   ctx.lineTo(stwC.rx1In, lMidY1);   ctx.lineTo(stwC.rx1, lMidY1);   ctx.closePath()
            }
            strokeQuadraScanPass(ctx, "#00FFFF", strokeW * 1.12, (0.90 + state.high * 0.10) * visAlpha, true)

            // 3. Green (#11FF11) Looming 3D Wireframe Death Star Sphere in Upper Horizon + Scrolling Trench Floor Grid + Exhaust Port Bay
            ctx.beginPath()
            // 3A. Looming 3D Wireframe Death Star Sphere (latitude bands, longitude meridians, equatorial trench & Superlaser Dish rotating slightly CW and CCW)
            var dsR = minDim * (0.145 + state.bassSmooth * 0.025)
            var dsX = clamp(trenchVX * 0.65 - w * 0.18, -halfWNear * 0.65, halfWNear * 0.65)
            var dsY = Math.min(yTFar - dsR * 1.18, -h * 0.24)
            var dsTilt = Math.sin(driftT * 0.54) * 0.22 + Math.cos(l1T * 0.33) * 0.09
            var dsCosT = Math.cos(dsTilt)
            var dsSinT = Math.sin(dsTilt)
            var dsYawOsc = Math.sin(driftT * 0.44) * 0.48 + Math.cos(l1T * 0.27) * 0.20
            var dsSegs = 20
            for (var dsi = 0; dsi <= dsSegs; dsi++) {
                var dsa = (dsi / dsSegs) * Math.PI * 2 + dsTilt
                var dspx = clamp(dsX + Math.cos(dsa) * dsR, -halfWNear * 0.95, halfWNear * 0.95)
                var dspy = dsY + Math.sin(dsa) * dsR
                if (dsi === 0) ctx.moveTo(dspx, dspy); else ctx.lineTo(dspx, dspy)
            }
            // Latitude rings & double Equatorial Trench band tilting CW and CCW with the Death Star sphere
            var latFracs = [-0.68, -0.36, -0.05, 0.05, 0.38, 0.70]
            for (var lfi = 0; lfi < latFracs.length; lfi++) {
                var lf = latFracs[lfi]
                var latHalfW = Math.sqrt(Math.max(0.0, 1.0 - lf * lf)) * dsR
                var latCurve = (1.0 - lf * lf) * dsR * 0.10
                for (var lsi = 0; lsi <= 10; lsi++) {
                    var lsu = (lsi / 10.0) * 2.0 - 1.0
                    var locX = lsu * latHalfW
                    var locY = lf * dsR + (1.0 - lsu * lsu) * latCurve
                    var lxPt = clamp(dsX + locX * dsCosT - locY * dsSinT, -halfWNear * 0.95, halfWNear * 0.95)
                    var lyPt = dsY + locX * dsSinT + locY * dsCosT
                    if (lsi === 0) ctx.moveTo(lxPt, lyPt); else ctx.lineTo(lxPt, lyPt)
                }
            }
            // Slight CW / CCW Rotating 3D Longitude Meridians
            var dsRot = dsYawOsc
            for (var mri = 0; mri < 5; mri++) {
                var mAng = dsRot + (mri / 5.0) * Math.PI
                var mHoriz = Math.cos(mAng) * dsR
                for (var msi = 0; msi <= 12; msi++) {
                    var mTheta = (msi / 12.0 - 0.5) * Math.PI
                    var mLocX = Math.cos(mTheta) * mHoriz
                    var mLocY = Math.sin(mTheta) * dsR
                    var mxPt = clamp(dsX + mLocX * dsCosT - mLocY * dsSinT, -halfWNear * 0.95, halfWNear * 0.95)
                    var myPt = dsY + mLocX * dsSinT + mLocY * dsCosT
                    if (msi === 0) ctx.moveTo(mxPt, myPt); else ctx.lineTo(mxPt, myPt)
                }
            }
            // Recessed circular Superlaser Dish in upper hemisphere rotating slightly CW and CCW with 8 radial focus spokes
            var dishAz = 0.34 + Math.sin(dsYawOsc) * 0.22
            var dishLocX = dsR * Math.sin(dishAz)
            var dishLocY = -dsR * 0.28
            var dishX = dsX + dishLocX * dsCosT - dishLocY * dsSinT
            var dishY = dsY + dishLocX * dsSinT + dishLocY * dsCosT
            var dishR = dsR * 0.30
            for (var ddi = 0; ddi <= 12; ddi++) {
                var dda = (ddi / 12.0) * Math.PI * 2 + dsTilt
                var ddx = clamp(dishX + Math.cos(dda) * dishR * 0.88, -halfWNear * 0.95, halfWNear * 0.95)
                var ddy = dishY + Math.sin(dda) * dishR
                if (ddi === 0) ctx.moveTo(ddx, ddy); else ctx.lineTo(ddx, ddy)
            }
            for (var dsp = 0; dsp < 8; dsp++) {
                var dspa = (dsp / 8.0) * Math.PI * 2 + dsTilt + dsYawOsc * 0.35
                ctx.moveTo(dishX, dishY)
                ctx.lineTo(clamp(dishX + Math.cos(dspa) * dishR * 0.88, -halfWNear * 0.95, halfWNear * 0.95), dishY + Math.sin(dspa) * dishR)
            }
            bloomDots.push({ x: dishX, y: dishY })

            // 3B. Longitudinal trench floor grid lanes & scrolling horizontal floor cross-lines
            for (var fl = 1; fl <= 3; fl++) {
                var ff = fl / 4.0
                ctx.moveTo(trenchVX + lerp(-halfWFar, halfWFar, ff), yBFar)
                ctx.lineTo(lerp(-halfWNear, halfWNear, ff), yBNear)
            }
            for (var sfFloor = 0; sfFloor < sliceCount; sfFloor++) {
                var uF = (sfFloor + tScroll) / sliceCount
                var pF = Math.pow(uF, 1.85)
                var vxF = trenchVX * (1.0 - pF)
                var xLF = vxF - lerp(halfWFar, halfWNear, pF)
                var xRF = vxF + lerp(halfWFar, halfWNear, pF)
                var yBF = lerp(yBFar, yBNear, pF)
                ctx.moveTo(xLF, yBF); ctx.lineTo(xRF, yBF)
            }
            // Far back-wall terminator & recessed square wireframe frame of the Thermal Exhaust Port
            ctx.moveTo(trenchVX - halfWFar, yTFar); ctx.lineTo(trenchVX + halfWFar, yTFar)
            ctx.lineTo(trenchVX + halfWFar, yBFar); ctx.lineTo(trenchVX - halfWFar, yBFar); ctx.closePath()
            var portFrameW = halfWFar * 0.56
            var portFrameY = lerp(yTFar, yBFar, 0.68)
            ctx.moveTo(trenchVX - portFrameW, portFrameY - portFrameW); ctx.lineTo(trenchVX + portFrameW, portFrameY - portFrameW)
            ctx.lineTo(trenchVX + portFrameW, portFrameY + portFrameW); ctx.lineTo(trenchVX - portFrameW, portFrameY + portFrameW); ctx.closePath()
            strokeQuadraScanPass(ctx, "#11FF11", strokeW * 1.04, (0.86 + state.bass * 0.14) * visAlpha, false)

            // 4. Red (#FF1111) True 3D Hexagonal Prism Barriers Spanning the Trench, Tower/Rim Laser Turret Tops & Rotating 8-Pointed Star Fireballs
            ctx.beginPath()
            for (var bj = 0; bj < blockades.length; bj++) {
                var blk = blockades[bj]
                // Build a 6-vertex 3D hexagonal cross-section ring at horizontal fraction uSpan (0 = left trench wall, 1 = right trench wall)
                var hexVertsAt = function(uSpan) {
                    var xFront = lerp(blk.xL0, blk.xR0, uSpan)
                    var xBack  = lerp(blk.xL1, blk.xR1, uSpan)
                    var xMid   = (xFront + xBack) * 0.5
                    var yTopF  = blk.y0
                    var yBotF  = blk.y1
                    var yTopB  = blk.y0Rear
                    var yBotB  = blk.y1Rear
                    var yMidF  = (yTopF + yBotF) * 0.5
                    var yMidB  = (yTopB + yBotB) * 0.5
                    // 6 vertices of the 3D hexagonal cross-section (Top-Front, Mid-Front nose, Bot-Front, Bot-Rear, Mid-Rear tail, Top-Rear)
                    return [
                        { x: lerp(xFront, xMid, 0.35), y: lerp(yTopF, yMidF, 0.16) },
                        { x: xFront,                   y: yMidF },
                        { x: lerp(xFront, xMid, 0.35), y: lerp(yBotF, yMidF, 0.16) },
                        { x: lerp(xBack,  xMid, 0.35), y: lerp(yBotB, yMidB, 0.16) },
                        { x: xBack,                    y: yMidB },
                        { x: lerp(xBack,  xMid, 0.35), y: lerp(yTopB, yMidB, 0.16) }
                    ]
                }
                var hL  = hexVertsAt(0.0)
                var hM1 = hexVertsAt(0.333)
                var hM2 = hexVertsAt(0.667)
                var hR  = hexVertsAt(1.0)

                // Draw the 4 hexagonal cross-section rings (left wall cap, 2 interior structural ribs, right wall cap)
                var hexRings = [hL, hM1, hM2, hR]
                for (var hri = 0; hri < hexRings.length; hri++) {
                    var hr = hexRings[hri]
                    ctx.moveTo(hr[0].x, hr[0].y)
                    for (var hvi = 1; hvi < 6; hvi++) {
                        ctx.lineTo(hr[hvi].x, hr[hvi].y)
                    }
                    ctx.closePath()
                }
                // Draw the 6 longitudinal prism edges running straight from the left wall hexagonal cap to the right wall hexagonal cap
                for (var hei = 0; hei < 6; hei++) {
                    ctx.moveTo(hL[hei].x, hL[hei].y)
                    ctx.lineTo(hR[hei].x, hR[hei].y)
                }

                if (blk.p < 0.78) {
                    bloomDots.push(
                        { x: hL[1].x, y: hL[1].y },
                        { x: hR[1].x, y: hR[1].y },
                        { x: hM1[1].x, y: hM1[1].y },
                        { x: hM2[1].x, y: hM2[1].y }
                    )
                }
            }
            // Angled gun turret tops & laser barrels on the trench rim turrets
            for (var rt2 = 0; rt2 < rimTurrets.length; rt2++) {
                var tur2 = rimTurrets[rt2]
                var tw2 = (tur2.xR0 - tur2.xL0) * 0.085
                var th2 = tw2 * 0.85
                var lGunX = tur2.xL0 + tw2 * 0.5, lGunY = tur2.yT0 - th2
                var rGunX = tur2.xR0 - tw2 * 0.5, rGunY = tur2.yT0 - th2
                ctx.moveTo(lGunX, lGunY); ctx.lineTo(lGunX + tw2 * 0.75, lGunY + th2 * 0.45)
                ctx.moveTo(rGunX, rGunY); ctx.lineTo(rGunX - tw2 * 0.75, rGunY + th2 * 0.45)
                bloomDots.push({ x: lGunX, y: lGunY }, { x: rGunX, y: rGunY })
            }
            // Pyramidal rotating laser turret crowns & twin barrels on the tall 3D Surface Defense Towers
            for (var stt = 0; stt < surfaceTowers.length; stt++) {
                var stwT = surfaceTowers[stt]
                var lApexX = (stwT.lx0 + stwT.lx0In + stwT.lx1 + stwT.lx1In) * 0.25
                var lApexY = (stwT.yT0 + stwT.yT1) * 0.5 - Math.abs(stwT.lx0In - stwT.lx0) * 0.55
                ctx.moveTo(stwT.lx0, stwT.yT0);   ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx0In, stwT.yT0); ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx1, stwT.yT1);   ctx.lineTo(lApexX, lApexY)
                ctx.moveTo(stwT.lx1In, stwT.yT1); ctx.lineTo(lApexX, lApexY)
                var rApexX = (stwT.rx0 + stwT.rx0In + stwT.rx1 + stwT.rx1In) * 0.25
                var rApexY = (stwT.yT0 + stwT.yT1) * 0.5 - Math.abs(stwT.rx0 - stwT.rx0In) * 0.55
                ctx.moveTo(stwT.rx0, stwT.yT0);   ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx0In, stwT.yT0); ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx1, stwT.yT1);   ctx.lineTo(rApexX, rApexY)
                ctx.moveTo(stwT.rx1In, stwT.yT1); ctx.lineTo(rApexX, rApexY)
                bloomDots.push({ x: lApexX, y: lApexY }, { x: rApexX, y: rApexY })
            }
            // Incoming rotating 8-pointed star/asterisk wireframe plasma fireballs (* in 3D)
            var fbCount = density <= 0.45 ? 0 : Math.min(6, Math.round(2.2 * denCurve))
            for (var fbi = 0; fbi < fbCount; fbi++) {
                var fbU = (((l1T * 0.72 + fbi * (1.0 / fbCount)) % 1.0) + 1.0) % 1.0
                if (fbU < 0.12 || fbU > 0.88) continue
                var fbP = Math.pow(fbU, 1.85)
                var fbSide = (fbi % 2 === 0) ? -1.0 : 1.0
                var fbX = clamp(trenchVX * (1.0 - fbP) + fbSide * lerp(halfWFar, halfWNear, fbP) * 0.34, -halfWNear * 0.90, halfWNear * 0.90)
                var fbY = lerp(lerp(yTFar, yBFar, 0.45), lerp(yTNear, yBNear, 0.48), fbP)
                var fbR = Math.max(4.0, (4.5 + fbP * minDim * 0.068) * (1.0 + state.beatPulse * 0.28))
                var fbRot = l1T * 6.5 + fbi * 1.1
                for (var spk = 0; spk < 8; spk++) {
                    var spkA = fbRot + (spk / 8.0) * Math.PI * 2
                    var spkNext = fbRot + (((spk + 3) % 8) / 8.0) * Math.PI * 2
                    ctx.moveTo(fbX, fbY)
                    ctx.lineTo(clamp(fbX + Math.cos(spkA) * fbR, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkA) * fbR)
                    ctx.moveTo(clamp(fbX + Math.cos(spkA) * fbR * 0.82, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkA) * fbR * 0.82)
                    ctx.lineTo(clamp(fbX + Math.cos(spkNext) * fbR * 0.42, -halfWNear * 0.95, halfWNear * 0.95), fbY + Math.sin(spkNext) * fbR * 0.42)
                }
                bloomDots.push({ x: fbX, y: fbY })
            }
            strokeQuadraScanPass(ctx, "#FF1111", strokeW * 1.15, (0.92 + state.beatPulse * 0.08) * visAlpha, true)

            // 5. Built-In Squadron of Multi-Colour 3D TIE Fighters & Darth Vader's Bent-Wing TIE Advanced x1 Dogfighting in the Trench
            var tieCount = Math.max(1, Math.min(6, Math.round(2.4 * Math.pow(density, 1.35))))
            var leadTargetX = trenchVX
            var leadTargetY = lerp(yTFar, yBFar, 0.46)
            for (var ti = tieCount - 1; ti >= 0; ti--) {
                var tieU = (((l1T * 0.34 + ti * (1.0 / tieCount)) % 1.0) + 1.0) % 1.0
                var tieDepth = 0.18 + tieU * 0.64
                var tieP = Math.pow(tieDepth, 1.65)
                var tieW = lerp(halfWFar, halfWNear, tieP)
                var tieSwayX = Math.sin(l1T * 1.45 + ti * 2.1) * tieW * (ti === 0 ? 0.28 : 0.48)
                var tieSwayY = Math.cos(l1T * 1.15 + ti * 1.7) * (lerp(yBFar, yBNear, tieP) - lerp(yTFar, yTNear, tieP)) * 0.16
                var tieX = clamp(trenchVX * (1.0 - tieP) + tieSwayX, -halfWNear * 0.76, halfWNear * 0.76)
                var tieY = lerp(lerp(yTFar, yBFar, 0.46), lerp(yTNear, yBNear, 0.44), tieP) + tieSwayY
                var tieScale = Math.max(11.0, minDim * (0.040 + tieP * 0.165) * (1.0 + state.bassSmooth * 0.12))
                var tiePitch = Math.sin(l1T * 1.2 + ti * 1.5) * 0.24
                var tieYaw = Math.cos(l1T * 1.1 + ti * 1.9) * 0.38
                var tieRoll = Math.sin(l1T * 1.6 + ti * 2.3) * 0.32
                var tieVar = (ti === 0) ? 1 : 0 // Lead fighter is Darth Vader's bent-wing TIE Advanced x1, flanked by Imperial TIE wingmen
                if (ti === 0) {
                    leadTargetX = tieX
                    leadTargetY = tieY
                }
                drawMultiColourStarWarsFighter(
                    ctx, tieVar, tieX, tieY, tieScale,
                    tiePitch, tieYaw, tieRoll,
                    strokeW * 1.04, visAlpha * clamp(0.65 + tieDepth * 0.45, 0.65, 1.0),
                    bloomDots, -halfWNear * 0.94, halfWNear * 0.94
                )
            }

            // 6. Player X-Wing Quad Corner Laser Bolts (Open Viewport, Zero Cockpit) Converging on Active Trench Target + Impact Sparks
            var corners = [
                { x: -halfWNear * 0.88, y: -h * 0.40 },
                { x:  halfWNear * 0.88, y: -h * 0.40 },
                { x: -halfWNear * 0.88, y:  h * 0.40 },
                { x:  halfWNear * 0.88, y:  h * 0.40 }
            ]
            var laserPulse = ((l1T * 2.8) % 1.0 + 1.0) % 1.0
            var laserPair = (Math.floor(l1T * 2.8) & 1)
            ctx.beginPath()
            for (var ci = 0; ci < 4; ci++) {
                var cOrig = corners[ci]
                var boltU0 = clamp(((laserPulse + (ci & 1) * 0.22) % 1.0) * 0.82, 0.04, 0.82)
                var boltU1 = clamp(boltU0 + 0.18 + state.bass * 0.08, 0.12, 0.96)
                var bx0 = lerp(cOrig.x, leadTargetX, boltU0)
                var by0 = lerp(cOrig.y, leadTargetY, boltU0)
                var bx1 = lerp(cOrig.x, leadTargetX, boltU1)
                var by1 = lerp(cOrig.y, leadTargetY, boltU1)
                ctx.moveTo(bx0, by0); ctx.lineTo(bx1, by1)
            }
            // Vector laser convergence cross-sparks on the target
            var sparkR = Math.max(4.5, minDim * (0.022 + state.beatPulse * 0.018))
            for (var spI = 0; spI < 6; spI++) {
                var spAng = l1T * 5.0 + (spI / 6.0) * Math.PI * 2
                ctx.moveTo(leadTargetX, leadTargetY)
                ctx.lineTo(
                    clamp(leadTargetX + Math.cos(spAng) * sparkR, -halfWNear * 0.94, halfWNear * 0.94),
                    leadTargetY + Math.sin(spAng) * sparkR
                )
            }
            strokeQuadraScanPass(ctx, laserPair === 0 ? "#FF1111" : "#11FF11", strokeW * 1.18, (0.88 + state.beatPulse * 0.12) * visAlpha, true)

            // 7. Magenta (#FF00FF) & White (#FFFFFF) Flashing Thermal Exhaust Port Octagon + Twin Proton Torpedoes
            ctx.beginPath()
            var octR = portFrameW * (0.62 + state.beatPulse * 0.18)
            for (var oi = 0; oi <= 8; oi++) {
                var oa = (oi / 8.0) * Math.PI * 2 + (Math.PI / 8.0)
                var ox = trenchVX + Math.cos(oa) * octR
                var oy = portFrameY + Math.sin(oa) * octR
                if (oi === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy)
            }
            // Twin Proton Torpedo star-bursts diving into the Thermal Exhaust Port
            var torpU = (((l1T * 0.95) % 1.0) + 1.0) % 1.0
            for (var tSide = -1; tSide <= 1; tSide += 2) {
                var txTorp = lerp(tSide * halfWNear * 0.22, trenchVX + tSide * octR * 0.35, torpU)
                var tyTorp = lerp(h * 0.32, portFrameY, torpU)
                var trTorp = Math.max(2.5, (1.0 - torpU * 0.65) * minDim * 0.024)
                for (var tSpk = 0; tSpk < 4; tSpk++) {
                    var tAng = l1T * 7.0 + (tSpk / 4.0) * Math.PI
                    ctx.moveTo(txTorp - Math.cos(tAng) * trTorp, tyTorp - Math.sin(tAng) * trTorp)
                    ctx.lineTo(txTorp + Math.cos(tAng) * trTorp, tyTorp + Math.sin(tAng) * trTorp)
                }
            }
            strokeQuadraScanPass(ctx, (Math.floor(l1T * 10.0) & 1) === 0 ? "#FF00FF" : "#FFFFFF", strokeW * 1.12, (0.94 + state.beatPulse * 0.06) * visAlpha, true)

            // 8. CRT Electron-Beam Vertex Bloom ("Vector Dots" at line intersections)
            ctx.fillStyle = colourWithAlpha("#FFFFFF", (0.90 + state.high * 0.10) * visAlpha)
            ctx.beginPath()
            var dotR = 1.65 + state.beatPulse * 0.75
            for (var di = 0; di < bloomDots.length; di++) {
                var bd = bloomDots[di]
                ctx.moveTo(bd.x + dotR, bd.y)
                ctx.arc(bd.x, bd.y, dotR, 0, Math.PI * 2)
            }
            ctx.fill()

            ctx.restore()
        } else if (l1Mode === 6) {
            // Mode 6: Relativistic Gargantua Black Hole — Infalling Spiral Accretion Vortex, Einstein Lensing Halo & Polar Jets
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var bhX = cx + endPt.dx * 0.35
            var bhY = cy + endPt.dy * 0.35
            var ehR = minDim * (0.11 + state.bassSmooth * 0.035)
            var tiltA = -0.24 + Math.sin(driftT * 0.38) * 0.14
            var palShift6 = Math.floor(state.hueShift / 45)

            ctx.translate(bhX, bhY)
            ctx.rotate(tiltA)

            // 1. Twin Relativistic Polar Pulsar Jets shooting out past diagR
            var jetReach = diagR * (0.75 + state.bassSmooth * 0.35)
            for (var pole = -1; pole <= 1; pole += 2) {
                ctx.strokeStyle = colourWithAlpha(palette[(pole < 0 ? 2 : 4 + palShift6) % palette.length], (0.38 + state.highSmooth * 0.35) * (1.0 - dim))
                ctx.lineWidth = 1.8 + state.bassSmooth * 1.6
                ctx.beginPath()
                for (var jStrand = -1; jStrand <= 1; jStrand++) {
                    for (var js = 0; js <= 14; js++) {
                        var ju = js / 14.0
                        var jy = pole * (ehR * 0.85 + Math.pow(ju, 1.25) * jetReach)
                        var jSpread = (ehR * 0.12 + Math.pow(ju, 1.4) * minDim * 0.18) * (1.0 + state.smoothBands[(js * 4) & 63] * 0.45)
                        var jx = Math.sin(ju * 9.0 - l1T * 4.5 + jStrand * 1.4) * jSpread
                        if (js === 0) ctx.moveTo(jx, jy)
                        else ctx.lineTo(jx, jy)
                    }
                }
                ctx.stroke()
            }

            // 2. Gravitational-Lensing Upper & Lower Einstein Halo Arches (rear disc bent over & under the shadow)
            for (var arch = -1; arch <= 1; arch += 2) {
                ctx.strokeStyle = colourWithAlpha(palette[(1 + palShift6) % palette.length], (0.52 + state.bassSmooth * 0.36) * (1.0 - dim))
                ctx.lineWidth = 2.2 + state.bassSmooth * 1.8
                ctx.beginPath()
                for (var as = 0; as <= 28; as++) {
                    var au = (as / 28.0) * Math.PI
                    var bHalo = state.smoothBands[(as * 2) & 63]
                    var archR = ehR * (1.08 + Math.sin(au) * (0.28 + bHalo * 0.22))
                    var ax = Math.cos(au) * archR * 1.35
                    var ay = arch * Math.sin(au) * archR * 0.95
                    if (as === 0) ctx.moveTo(ax, ay)
                    else ctx.lineTo(ax, ay)
                }
                ctx.stroke()
            }

            // 3. Infalling Logarithmic Spiral Matter Streams pulled from diagR into the Event Horizon
            var spiralArms = Math.max(3, Math.min(28, Math.round(12 * denCurve)))
            var inflowScroll = (((l1T * 0.55) % 1.0) + 1.0) % 1.0
            for (var arm = 0; arm < spiralArms; arm++) {
                var armCol = palette[(arm + palShift6) % palette.length]
                var armBaseA = (arm / spiralArms) * Math.PI * 2 - l1T * 0.65
                ctx.strokeStyle = colourWithAlpha(armCol, (0.42 + state.midSmooth * 0.38) * (1.0 - dim))
                ctx.lineWidth = 1.4 + state.bassSmooth * 1.2
                ctx.beginPath()
                for (var sp = 0; sp <= 16; sp++) {
                    var su = clamp((sp + 1.0 - inflowScroll) / 16.0, 0.02, 1.0)
                    var sr = ehR * 1.02 + Math.pow(su, 1.75) * (diagR - ehR)
                    // Frame-dragging angular acceleration as matter approaches r -> ehR
                    var sAng = armBaseA + 2.6 / (su + 0.18)
                    var sbv = state.smoothBands[(arm * 3 + sp * 2) & 63]
                    var sx = Math.cos(sAng) * sr * (1.0 + sbv * 0.08)
                    var sy = Math.sin(sAng) * sr * 0.44 * (1.0 + sbv * 0.08)
                    if (sp === 0) ctx.moveTo(sx, sy)
                    else ctx.lineTo(sx, sy)
                }
                ctx.stroke()
            }

            // 4. Pure Obsidian Event Horizon Singularity Core + White-Hot Asymmetric Photon Sphere
            ctx.fillStyle = "#010104"
            ctx.strokeStyle = colourWithAlpha("#fff5cc", (0.88 + state.beatSmooth * 0.12) * (1.0 - dim))
            ctx.lineWidth = 2.4 + state.bassSmooth * 2.0
            ctx.beginPath()
            ctx.arc(0, 0, ehR, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            ctx.restore()
        } else if (l1Mode === 7) {
            // Mode 7: 1982 TRON Game Grid (Robert Abel / MAGI Synthavision / Bally Midway Vector & CSG Engine)
            //   - True Cumulative 90-Degree (PI/2) World-Space Camera & Light Cycle Turns (`state.tronYaw`, `state.tronTargetYaw`)
            //   - Dense 80-Unit 3D Cyan/Blue Game Grid Floor (`cellSize = 80.0`) with Major 4-Cell Avenue Lines
            //   - World-Space 3D Recognizers (#FF1E38), MCP 14-Facet Cone (#FF1166) & I/O Tower, Rival (#FFAA00) & Player (#33FFFF) Light Cycles + Standing 90° Jetwalls
            //   - Authentic 1982 TRON Jetwall Collision & 3D Derezz Explosion (`state.tronCrashTimer`, `state.tronRivalCrashTimer`)
            ctx.save()
            ctx.globalCompositeOperation = "source-over"

            if (!gpuOn) {
                ctx.fillStyle = "rgba(1, 3, 10, " + clamp(0.84 - dim * 0.35, 0.45, 0.92).toFixed(3) + ")"
                ctx.fillRect(0, 0, w, h)
            }

            var camYaw = state.tronYaw || 0.0
            var bikeYaw = state.tronBikeYaw !== undefined
                ? state.tronBikeYaw
                : (state.tronTargetYaw !== undefined ? state.tronTargetYaw : camYaw)
            var bikeX = state.tronX || 0.0
            var bikeZ = state.tronZ || 0.0
            var playerTrail = (state.tronTrail && state.tronTrail.length >= 2) ? state.tronTrail : [[bikeX, bikeZ - 320.0], [bikeX, bikeZ]]
            var rivalTrail = (state.tronRivalTrail && state.tronRivalTrail.length >= 2) ? state.tronRivalTrail : [[bikeX + 160.0, bikeZ - 240.0], [bikeX + 160.0, bikeZ + 80.0]]
            var rivalX = state.tronRivalX !== undefined ? state.tronRivalX : rivalTrail[rivalTrail.length - 1][0]
            var rivalZ = state.tronRivalZ !== undefined ? state.tronRivalZ : rivalTrail[rivalTrail.length - 1][1]
            var rivalYaw = state.tronRivalYaw !== undefined
                ? state.tronRivalYaw
                : (state.tronRivalTargetYaw !== undefined ? state.tronRivalTargetYaw : bikeYaw)

            var camDist = 290.0
            var camX = (state.tronCamX !== undefined && isFinite(state.tronCamX))
                ? state.tronCamX
                : (bikeX - Math.sin(camYaw) * camDist)
            var camZ = (state.tronCamZ !== undefined && isFinite(state.tronCamZ))
                ? state.tronCamZ
                : (bikeZ - Math.cos(camYaw) * camDist)
            var camY = 132.0 + state.bassSmooth * 18.0
            var focal = minDim * 0.64
            var zNear = 14.0
            var zFar = 3600.0
            var tronHorizonY = horizonY - h * 0.04

            // Pure horizontal Y-axis yaw projection on the XZ ground plane (zero Z-axis camera roll)
            function projectTron3D(wx, wy, wz) {
                var dx = wx - camX
                var dy = wy - camY
                var dz = wz - camZ
                var cosY = Math.cos(camYaw), sinY = Math.sin(camYaw)
                var rx = dx * cosY - dz * sinY
                var ry = dy
                var rz = dx * sinY + dz * cosY
                return { rx: rx, ry: ry, rz: rz }
            }

            function appendClippedTronLine(x1, y1, z1, x2, y2, z2) {
                var p1 = projectTron3D(x1, y1, z1)
                var p2 = projectTron3D(x2, y2, z2)
                if (p1.rz < zNear && p2.rz < zNear) return
                if (p1.rz > zFar && p2.rz > zFar) return
                if (p1.rz < zNear) {
                    var t1 = (zNear - p1.rz) / (p2.rz - p1.rz)
                    p1.rx += t1 * (p2.rx - p1.rx)
                    p1.ry += t1 * (p2.ry - p1.ry)
                    p1.rz = zNear
                } else if (p2.rz < zNear) {
                    var t2 = (zNear - p2.rz) / (p1.rz - p2.rz)
                    p2.rx += t2 * (p1.rx - p2.rx)
                    p2.ry += t2 * (p1.ry - p2.ry)
                    p2.rz = zNear
                }
                var sx1 = cx + (p1.rx * focal) / p1.rz
                var sy1 = tronHorizonY - (p1.ry * focal) / p1.rz
                var sx2 = cx + (p2.rx * focal) / p2.rz
                var sy2 = tronHorizonY - (p2.ry * focal) / p2.rz
                ctx.moveTo(sx1, sy1)
                ctx.lineTo(sx2, sy2)
            }

            // 1. Dense 1982 TRON Game Grid Floor (`cellSize = 80.0`) + Major 4-Cell Avenue Lines rotating a full 90° with `state.tronYaw`!
            var cellSize = 80.0
            var baseGX = Math.floor(camX / cellSize) * cellSize
            var baseGZ = Math.floor(camZ / cellSize) * cellSize
            var gridCells = Math.max(8, Math.min(24, Math.round(15 * denCurve)))
            var spanDist = gridCells * cellSize

            // Minor 80-unit grid cells in electric blue
            ctx.beginPath()
            for (var gi = -gridCells; gi <= gridCells; gi++) {
                var gxLine = baseGX + gi * cellSize
                var gzLine = baseGZ + gi * cellSize
                var isMajorX = (Math.round(gxLine / cellSize) & 3) === 0
                var isMajorZ = (Math.round(gzLine / cellSize) & 3) === 0
                if (!isMajorX) appendClippedTronLine(gxLine, 0, baseGZ - spanDist, gxLine, 0, baseGZ + spanDist)
                if (!isMajorZ) appendClippedTronLine(baseGX - spanDist, 0, gzLine, baseGX + spanDist, 0, gzLine)
            }
            strokeQuadraScanPass(ctx, "#0066CC", 1.05, 0.55 * (1.0 - dim), false)

            // Major 320-unit avenue lines + horizon line in glowing cyan
            ctx.beginPath()
            for (var gMaj = -gridCells; gMaj <= gridCells; gMaj++) {
                var gxMaj = baseGX + gMaj * cellSize
                var gzMaj = baseGZ + gMaj * cellSize
                if ((Math.round(gxMaj / cellSize) & 3) === 0) {
                    appendClippedTronLine(gxMaj, 0, baseGZ - spanDist, gxMaj, 0, baseGZ + spanDist)
                }
                if ((Math.round(gzMaj / cellSize) & 3) === 0) {
                    appendClippedTronLine(baseGX - spanDist, 0, gzMaj, baseGX + spanDist, 0, gzMaj)
                }
            }
            ctx.moveTo(0, tronHorizonY)
            ctx.lineTo(w, tronHorizonY)
            strokeQuadraScanPass(ctx, "#00E5FF", 1.45 + state.bass * 0.5, 0.80 * (1.0 - dim), true)

            // 2. World-Space Rotating 14-Facet Master Control Program (MCP) Cone & Central I/O Energy Tower Spire
            var mcpSectorX = Math.round(bikeX / 2400.0) * 2400.0
            var mcpSectorZ = Math.round(bikeZ / 2400.0) * 2400.0 + 1800.0
            var mcpFacets = 12
            var mcpRBase = 240.0
            var mcpRTop = 165.0
            var mcpHTop = 520.0
            var mcpRot = l1T * 0.95
            ctx.beginPath()
            for (var mf = 0; mf < mcpFacets; mf++) {
                var ma0 = mcpRot + (mf / mcpFacets) * Math.PI * 2.0
                var ma1 = mcpRot + ((mf + 1) / mcpFacets) * Math.PI * 2.0
                var mbx0 = mcpSectorX + Math.cos(ma0) * mcpRBase, mbz0 = mcpSectorZ + Math.sin(ma0) * mcpRBase
                var mbx1 = mcpSectorX + Math.cos(ma1) * mcpRBase, mbz1 = mcpSectorZ + Math.sin(ma1) * mcpRBase
                var mtx0 = mcpSectorX + Math.cos(ma0) * mcpRTop,  mtz0 = mcpSectorZ + Math.sin(ma0) * mcpRTop
                var mtx1 = mcpSectorX + Math.cos(ma1) * mcpRTop,  mtz1 = mcpSectorZ + Math.sin(ma1) * mcpRTop
                appendClippedTronLine(mbx0, 0, mbz0, mbx1, 0, mbz1)
                appendClippedTronLine(mtx0, mcpHTop, mtz0, mtx1, mcpHTop, mtz1)
                appendClippedTronLine(mbx0, 0, mbz0, mtx0, mcpHTop, mtz0)
            }
            strokeQuadraScanPass(ctx, "#FF1166", 1.5 + state.bass * 0.6, 0.82 * (1.0 - dim), true)

            ctx.beginPath()
            appendClippedTronLine(mcpSectorX - 78, 0, mcpSectorZ, mcpSectorX - 78, mcpHTop * 1.45, mcpSectorZ)
            appendClippedTronLine(mcpSectorX + 78, 0, mcpSectorZ, mcpSectorX + 78, mcpHTop * 1.45, mcpSectorZ)
            strokeQuadraScanPass(ctx, "#33FFFF", 1.8 + state.beatPulse * 0.8, 0.88 * (1.0 - dim), true)

            // 3. World-Space Patrolling 3D TRON Recognizers (#FF1E38) marching along fixed orthogonal grid avenues
            var recBoxes = [
                [-125, 0, -48, -75, 24, 48],   [75, 0, -48, 125, 24, 48],
                [-112, 24, -26, -82, 240, 26], [82, 24, -26, 112, 240, 26],
                [-82, 135, -22, 82, 160, 22],  [-130, 240, -34, 130, 275, 34],
                [-42, 160, -28, 42, 240, 28],  [-78, 292, -24, 78, 330, 24]
            ]
            var recCount7 = Math.max(1, Math.min(4, Math.round(2.0 * denCurve)))
            ctx.beginPath()
            for (var rIdx = 0; rIdx < recCount7; rIdx++) {
                var recHeadingYaw = (rIdx & 1) === 0 ? 0.0 : (Math.PI * 0.5)
                var cosRY = Math.cos(recHeadingYaw), sinRY = Math.sin(recHeadingYaw)
                var patrolOff = Math.sin(l1T * 0.55 + rIdx * 2.1) * 380.0
                var recWX = Math.round(bikeX / 640.0) * 640.0 + ((rIdx & 1) === 0 ? -320.0 : 320.0) * (1 + Math.floor(rIdx / 2)) + sinRY * patrolOff
                var recWZ = Math.round(bikeZ / 640.0) * 640.0 + ((rIdx & 1) === 0 ? 640.0 : -320.0) * (1 + Math.floor(rIdx / 2)) + cosRY * patrolOff
                for (var bi = 0; bi < recBoxes.length; bi++) {
                    var b = recBoxes[bi]
                    var bv = [
                        [b[0], b[1], b[2]], [b[3], b[1], b[2]], [b[3], b[1], b[5]], [b[0], b[1], b[5]],
                        [b[0], b[4], b[2]], [b[3], b[4], b[2]], [b[3], b[4], b[5]], [b[0], b[4], b[5]]
                    ]
                    var wv = []
                    for (var vi = 0; vi < 8; vi++) {
                        wv.push([
                            recWX + bv[vi][0] * cosRY + bv[vi][2] * sinRY,
                            bv[vi][1],
                            recWZ - bv[vi][0] * sinRY + bv[vi][2] * cosRY
                        ])
                    }
                    var boxEdges = [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7]
                    for (var ei = 0; ei < boxEdges.length; ei += 2) {
                        var vA = wv[boxEdges[ei]], vB = wv[boxEdges[ei + 1]]
                        appendClippedTronLine(vA[0], vA[1], vA[2], vB[0], vB[1], vB[2])
                    }
                }
            }
            strokeQuadraScanPass(ctx, "#FF1E38", 1.55 + state.bass * 0.6, 0.88 * (1.0 - dim), true)

            // 4. Extruded 3D Light Cycle Jetwall Ribbon & 3D Light Cycle Bike Mesh (Rival #FFAA00 + Player #33FFFF) + 3D Derezz Explosion
            var lcVerts = [
                [-16, 6, -48], [16, 6, -48], [18, 24, -36], [-18, 24, -36], [-16, 40, -22], [16, 40, -22],
                [-18, 8, 0], [18, 8, 0], [14, 48, -4], [-14, 48, -4],
                [-16, 8, 32], [16, 8, 32], [12, 34, 28], [-12, 34, 28], [-8, 16, 54], [8, 16, 54]
            ]
            var lcEdges = [
                0,1, 1,2, 2,3, 3,0, 3,4, 4,5, 5,2,
                6,7, 7,8, 8,9, 9,6,
                0,6, 1,7, 3,9, 2,8, 4,9, 5,8,
                6,10, 7,11, 8,12, 9,13,
                10,11, 11,12, 12,13, 13,10,
                10,14, 11,15, 12,15, 13,14, 14,15
            ]

            function drawTronLightCycleAndTrail(trailPts, bx, bz, bYaw, bikeCol) {
                var wallH = 52.0 + state.bassSmooth * 10.0

                ctx.beginPath()
                for (var ti = 0; ti < trailPts.length - 1; ti++) {
                    var x1 = trailPts[ti][0], z1 = trailPts[ti][1]
                    var x2 = trailPts[ti + 1][0], z2 = trailPts[ti + 1][1]
                    appendClippedTronLine(x1, wallH, z1, x2, wallH, z2)
                    appendClippedTronLine(x1, wallH * 0.68, z1, x2, wallH * 0.68, z2)
                    appendClippedTronLine(x1, wallH * 0.34, z1, x2, wallH * 0.34, z2)
                    appendClippedTronLine(x1, 0, z1, x2, 0, z2)
                    appendClippedTronLine(x1, 0, z1, x1, wallH, z1)
                    appendClippedTronLine(x2, 0, z2, x2, wallH, z2)
                }
                strokeQuadraScanPass(ctx, bikeCol, 1.7 + state.beatPulse * 0.7, 0.90 * (1.0 - dim), true)

                ctx.beginPath()
                for (var tw = 0; tw < trailPts.length - 1; tw++) {
                    appendClippedTronLine(trailPts[tw][0], wallH + 2, trailPts[tw][1], trailPts[tw + 1][0], wallH + 2, trailPts[tw + 1][1])
                }
                strokeQuadraScanPass(ctx, "#FFFFFF", 1.3, 0.85 * (1.0 - dim), false)

                var cosB = Math.cos(bYaw), sinB = Math.sin(bYaw)
                var bScale = 1.28

                // Intact Light Cycle rendering pivoted horizontally around its rear jetwall nozzle (lv[2] + 48.0)
                var wPts = []
                for (var vi = 0; vi < lcVerts.length; vi++) {
                    var lv = lcVerts[vi]
                    var lx = lv[0] * bScale
                    var lz = (lv[2] + 48.0) * bScale
                    wPts.push([
                        bx + lx * cosB + lz * sinB,
                        lv[1] * bScale,
                        bz - lx * sinB + lz * cosB
                    ])
                }
                ctx.beginPath()
                for (var ei = 0; ei < lcEdges.length; ei += 2) {
                    var pA = wPts[lcEdges[ei]], pB = wPts[lcEdges[ei + 1]]
                    appendClippedTronLine(pA[0], pA[1], pA[2], pB[0], pB[1], pB[2])
                }
                var wheelZOffsets = [14.0, 80.0]
                var wheelR = 16.0 * bScale
                for (var wzIdx = 0; wzIdx < 2; wzIdx++) {
                    var wzLocal = wheelZOffsets[wzIdx] * bScale
                    for (var wSide = -1; wSide <= 1; wSide += 2) {
                        var wxLocal = wSide * 17.5 * bScale
                        for (var ws = 0; ws < 8; ws++) {
                            var wa0 = (ws / 8) * Math.PI * 2.0 + l1T * 6.0
                            var wa1 = ((ws + 1) / 8) * Math.PI * 2.0 + l1T * 6.0
                            var z0 = wzLocal + Math.cos(wa0) * wheelR
                            var y0 = wheelR + Math.sin(wa0) * wheelR
                            var z1 = wzLocal + Math.cos(wa1) * wheelR
                            var y1 = wheelR + Math.sin(wa1) * wheelR
                            appendClippedTronLine(
                                bx + wxLocal * cosB + z0 * sinB, y0, bz - wxLocal * sinB + z0 * cosB,
                                bx + wxLocal * cosB + z1 * sinB, y1, bz - wxLocal * sinB + z1 * cosB
                            )
                        }
                    }
                }
                strokeQuadraScanPass(ctx, bikeCol, 1.9 + state.bass * 0.8, 0.96 * (1.0 - dim), true)
            }

            drawTronLightCycleAndTrail(rivalTrail, rivalX, rivalZ, rivalYaw, "#FFAA00")
            drawTronLightCycleAndTrail(playerTrail, bikeX, bikeZ, bikeYaw, "#33FFFF")

            // 4B. 3D Vectored Light Cycle Crash Explosions in World Space in Vivid RED (while bikes continue moving without losing flow!)
            var crashesList = (rawL1Mode === 19) ? [] : (state.tronCrashes || [])
            for (var crIdx = 0; crIdx < crashesList.length; crIdx++) {
                var cr = crashesList[crIdx]
                var crashProg = clamp(cr.age / (cr.maxAge || 1.55), 0.0, 1.0)
                var crX = cr.x, crZ = cr.z, crYaw = cr.yaw || 0.0
                var cosC = Math.cos(crYaw), sinC = Math.sin(crYaw)
                var crScale = 1.38

                // A. Shattering 3D Vector Light Cycle Chassis & Wheel Shards + Radial Smash Rays flying outward & upward in RED
                ctx.beginPath()
                for (var eiC = 0; eiC < lcEdges.length; eiC += 2) {
                    var vA0 = lcVerts[lcEdges[eiC]], vB0 = lcVerts[lcEdges[eiC + 1]]
                    var shardIdx = eiC >> 1
                    var shAng = shardIdx * 1.15 + crYaw
                    var shSpeed = 105.0 + (shardIdx % 5) * 48.0
                    var shOut = crashProg * shSpeed
                    var shUp = Math.sin(crashProg * Math.PI * 0.88) * (82.0 + (shardIdx % 4) * 44.0)
                    var shSpin = crashProg * (3.8 + (shardIdx % 3) * 2.0)
                    var mx = ((vA0[0] + vB0[0]) * 0.5) * crScale
                    var my = ((vA0[1] + vB0[1]) * 0.5) * crScale
                    var mz = ((vA0[2] + vB0[2]) * 0.5 + 48.0) * crScale
                    var dxS = (vB0[0] - vA0[0]) * 0.62 * crScale * Math.cos(shSpin)
                    var dyS = (vB0[1] - vA0[1]) * 0.62 * crScale + Math.sin(shSpin) * 18.0
                    var dzS = (vB0[2] - vA0[2]) * 0.62 * crScale * Math.cos(shSpin * 0.7)
                    var wxC = crX + mx * cosC + mz * sinC + Math.cos(shAng) * shOut
                    var wyC = Math.max(2.0, my + shUp)
                    var wzC = crZ - mx * sinC + mz * cosC + Math.sin(shAng) * shOut
                    appendClippedTronLine(wxC - dxS, wyC - dyS, wzC - dzS, wxC + dxS, wyC + dyS, wzC + dzS)
                }
                // High-velocity 3D radial smash vector spikes erupting from the impact point
                for (var spk = 0; spk < 12; spk++) {
                    var spkAng = (spk / 12.0) * Math.PI * 2.0 + crYaw * 0.5
                    var spkElev = 0.18 + (spk % 3) * 0.24
                    var rInner = crashProg * 55.0
                    var rOuter = rInner + (52.0 + (spk % 2) * 34.0) * (1.0 - crashProg * 0.35)
                    appendClippedTronLine(
                        crX + Math.cos(spkAng) * rInner, 10.0 + rInner * spkElev, crZ + Math.sin(spkAng) * rInner,
                        crX + Math.cos(spkAng) * rOuter, 14.0 + rOuter * spkElev, crZ + Math.sin(spkAng) * rOuter
                    )
                }
                // B. Expanding 3D Octagonal Derezz Shockwave Rings on the Game Grid floor
                for (var sRing = 0; sRing < 3; sRing++) {
                    var rPhase = clamp(crashProg * 1.25 - sRing * 0.18, 0.02, 1.0)
                    var shockR = rPhase * (215.0 + sRing * 75.0)
                    var shockY = 4.0 + sRing * 18.0 * (1.0 - rPhase * 0.5)
                    for (var os = 0; os < 8; os++) {
                        var oa0 = (os / 8.0) * Math.PI * 2.0 + crashProg * 1.6
                        var oa1 = ((os + 1) / 8.0) * Math.PI * 2.0 + crashProg * 1.6
                        appendClippedTronLine(
                            crX + Math.cos(oa0) * shockR, shockY, crZ + Math.sin(oa0) * shockR,
                            crX + Math.cos(oa1) * shockR, shockY, crZ + Math.sin(oa1) * shockR
                        )
                    }
                }
                strokeQuadraScanPass(ctx, (Math.floor(l1T * 20.0) & 1) === 0 ? "#FF111E" : "#FF3824", 2.45, (1.0 - crashProg * 0.30) * (1.0 - dim), true)

                // C. Towering Vertical RED Derezz Energy Beam Spire shooting into the sky (classic 1982 TRON de-resolution column)
                ctx.beginPath()
                var pillarH = (205.0 + crashProg * 390.0) * (1.0 - crashProg * 0.25)
                var pillarR = 30.0 * (1.0 - crashProg * 0.55)
                for (var pb = 0; pb < 4; pb++) {
                    var pAng = (pb / 4.0) * Math.PI * 2.0 + l1T * 5.5
                    var px = crX + Math.cos(pAng) * pillarR
                    var pz = crZ + Math.sin(pAng) * pillarR
                    appendClippedTronLine(px, 0, pz, px, pillarH, pz)
                }
                strokeQuadraScanPass(ctx, "#FF0022", 2.25, (1.0 - crashProg * 0.40) * (1.0 - dim), true)
            }

            // 5. Floating 3D "Bit" Companion (Octahedron binary entity in upper-left camera space)
            var bitYes = (Math.floor(l1T * 1.2) % 2 === 0) || state.beatPulse > 0.35
            var bitCol = bitYes ? "#FFEE33" : "#FFFFFF"
            var bitR = (bitYes ? 28.0 : 21.0) * (1.0 + state.beatPulse * 0.25)
            var bitWX = camX + Math.sin(camYaw - 0.36) * 210.0
            var bitWZ = camZ + Math.cos(camYaw - 0.36) * 210.0
            var bitWY = camY + 42.0 + Math.sin(l1T * 3.2) * 10.0
            var bitRot = l1T * 2.4
            var bCos = Math.cos(bitRot), bSin = Math.sin(bitRot)
            var bitV = [
                [bitWX, bitWY + bitR, bitWZ],
                [bitWX, bitWY - bitR, bitWZ],
                [bitWX - bitR * bCos, bitWY, bitWZ - bitR * bSin],
                [bitWX + bitR * bCos, bitWY, bitWZ + bitR * bSin],
                [bitWX + bitR * bSin, bitWY, bitWZ - bitR * bCos],
                [bitWX - bitR * bSin, bitWY, bitWZ + bitR * bCos]
            ]
            var bitEdges = [0,2, 0,3, 0,4, 0,5, 1,2, 1,3, 1,4, 1,5, 2,4, 4,3, 3,5, 5,2]
            ctx.beginPath()
            for (var be = 0; be < bitEdges.length; be += 2) {
                var bvA = bitV[bitEdges[be]], bvB = bitV[bitEdges[be + 1]]
                appendClippedTronLine(bvA[0], bvA[1], bvA[2], bvB[0], bvB[1], bvB[2])
            }
            strokeQuadraScanPass(ctx, bitCol, 1.6, 0.90 * (1.0 - dim), true)

            // 6. When in Mode 19 (UI 20: ShdTRON Swoop Towers), render authentic 1983 Atari Star Wars Stage 2 (Death Star Surface)
            // 3D Wireframe Defence Towers strictly anchored to exact ground grid vertices (gridSpacing = 80.0):
            //   Pass A (#FFFF11 Yellow): Tapered X-braced base shaft locked to ground grid cell vertices
            //   Pass B (#11FF11 Green): Narrowed upper turret neck collar
            //   Pass C (#FF2211 Red): Wide flared trapezoidal/octagonal turret command head & rotating twin laser cannon dishes
            if (rawL1Mode === 19) {
                var gridSpacing = cellSize
                var swStep = gridSpacing * 4.0 // 320.0 (exact multiple of gridSpacing = 80.0)
                var swBaseX = Math.floor(camX / swStep) * swStep
                var swBaseZ = Math.floor(camZ / swStep) * swStep
                var baseHalfW = gridSpacing * 0.5 // 40.0 -> twX ± 40 sits on exact integer multiples of gridSpacing (80.0) when twX is shifted by 40.0!
                var neck0HalfW = gridSpacing * 0.34
                var neck1HalfW = gridSpacing * 0.22
                var headHalfW = gridSpacing * 0.45
                var roofHalfW = gridSpacing * 0.30

                // Pass A: Yellow (#FFFF11) Tapered X-braced base shaft anchored at exact ground grid intersections (y = 0 .. 0.56 * twH)
                ctx.beginPath()
                for (var txI = -3; txI <= 3; txI++) {
                    if (txI === 0) continue
                    for (var tzI = -1; tzI <= 5; tzI++) {
                        // Centre of cell [N*80, (N+1)*80] is N*80 + 40, so corners ±40 sit at exact multiples of 80!
                        var twX = swBaseX + txI * swStep + baseHalfW
                        var twZ = swBaseZ + tzI * swStep + baseHalfW
                        var tHash = Math.abs(Math.sin(twX * 0.0137 + twZ * 0.0293) * 43758.5453) % 1.0
                        if (tHash > clamp(0.48 * denCurve, 0.22, 0.82)) continue
                        var twH = 270.0 + (tHash * 140.0) + state.bassSmooth * 45.0
                        var yMidA = twH * 0.28
                        var yTopA = twH * 0.56
                        var midHalfW = (baseHalfW + neck0HalfW) * 0.5
                        var cB = [
                            [twX - baseHalfW, twZ - baseHalfW],
                            [twX + baseHalfW, twZ - baseHalfW],
                            [twX + baseHalfW, twZ + baseHalfW],
                            [twX - baseHalfW, twZ + baseHalfW]
                        ]
                        var cM = [
                            [twX - midHalfW, twZ - midHalfW],
                            [twX + midHalfW, twZ - midHalfW],
                            [twX + midHalfW, twZ + midHalfW],
                            [twX - midHalfW, twZ + midHalfW]
                        ]
                        var cN0 = [
                            [twX - neck0HalfW, twZ - neck0HalfW],
                            [twX + neck0HalfW, twZ - neck0HalfW],
                            [twX + neck0HalfW, twZ + neck0HalfW],
                            [twX - neck0HalfW, twZ + neck0HalfW]
                        ]
                        for (var cc = 0; cc < 4; cc++) {
                            var cn = (cc + 1) & 3
                            // Ground perimeter, mid ring, upper shaft ring & 4 tapered corner struts
                            appendClippedTronLine(cB[cc][0], 0, cB[cc][1], cB[cn][0], 0, cB[cn][1])
                            appendClippedTronLine(cM[cc][0], yMidA, cM[cc][1], cM[cn][0], yMidA, cM[cn][1])
                            appendClippedTronLine(cN0[cc][0], yTopA, cN0[cc][1], cN0[cn][0], yTopA, cN0[cn][1])
                            appendClippedTronLine(cB[cc][0], 0, cB[cc][1], cN0[cc][0], yTopA, cN0[cc][1])
                            // 2-tier diagonal X-braces on each face of the yellow base shaft
                            appendClippedTronLine(cB[cc][0], 0, cB[cc][1], cM[cn][0], yMidA, cM[cn][1])
                            appendClippedTronLine(cB[cn][0], 0, cB[cn][1], cM[cc][0], yMidA, cM[cc][1])
                            appendClippedTronLine(cM[cc][0], yMidA, cM[cc][1], cN0[cn][0], yTopA, cN0[cn][1])
                            appendClippedTronLine(cM[cn][0], yMidA, cM[cn][1], cN0[cc][0], yTopA, cN0[cc][1])
                        }
                    }
                }
                strokeQuadraScanPass(ctx, "#FFFF11", 1.70 + state.bassSmooth * 0.5, 0.94 * (1.0 - dim), true)

                // Pass B: Green (#11FF11) Narrowed Upper Turret Neck Collar (y = 0.56 * twH .. 0.74 * twH)
                ctx.beginPath()
                for (var txI2 = -3; txI2 <= 3; txI2++) {
                    if (txI2 === 0) continue
                    for (var tzI2 = -1; tzI2 <= 5; tzI2++) {
                        var twX2 = swBaseX + txI2 * swStep + baseHalfW
                        var twZ2 = swBaseZ + tzI2 * swStep + baseHalfW
                        var tHash2 = Math.abs(Math.sin(twX2 * 0.0137 + twZ2 * 0.0293) * 43758.5453) % 1.0
                        if (tHash2 > clamp(0.48 * denCurve, 0.22, 0.82)) continue
                        var twH2 = 270.0 + (tHash2 * 140.0) + state.bassSmooth * 45.0
                        var yN0 = twH2 * 0.56
                        var yN1 = twH2 * 0.74
                        var cN0B = [
                            [twX2 - neck0HalfW, twZ2 - neck0HalfW],
                            [twX2 + neck0HalfW, twZ2 - neck0HalfW],
                            [twX2 + neck0HalfW, twZ2 + neck0HalfW],
                            [twX2 - neck0HalfW, twZ2 + neck0HalfW]
                        ]
                        var cN1B = [
                            [twX2 - neck1HalfW, twZ2 - neck1HalfW],
                            [twX2 + neck1HalfW, twZ2 - neck1HalfW],
                            [twX2 + neck1HalfW, twZ2 + neck1HalfW],
                            [twX2 - neck1HalfW, twZ2 + neck1HalfW]
                        ]
                        for (var cc2 = 0; cc2 < 4; cc2++) {
                            var cn2 = (cc2 + 1) & 3
                            appendClippedTronLine(cN0B[cc2][0], yN0, cN0B[cc2][1], cN1B[cc2][0], yN1, cN1B[cc2][1])
                            appendClippedTronLine(cN1B[cc2][0], yN1, cN1B[cc2][1], cN1B[cn2][0], yN1, cN1B[cn2][1])
                            appendClippedTronLine(cN0B[cc2][0], yN0, cN0B[cc2][1], cN1B[cn2][0], yN1, cN1B[cn2][1])
                        }
                    }
                }
                strokeQuadraScanPass(ctx, "#11FF11", 1.65, 0.92 * (1.0 - dim), true)

                // Pass C: Red (#FF2211) Wide Flared Trapezoidal/Octagonal Turret Command Head & Rotating Twin Laser Cannon Dishes
                ctx.beginPath()
                for (var txI3 = -3; txI3 <= 3; txI3++) {
                    if (txI3 === 0) continue
                    for (var tzI3 = -1; tzI3 <= 5; tzI3++) {
                        var twX3 = swBaseX + txI3 * swStep + baseHalfW
                        var twZ3 = swBaseZ + tzI3 * swStep + baseHalfW
                        var tHash3 = Math.abs(Math.sin(twX3 * 0.0137 + twZ3 * 0.0293) * 43758.5453) % 1.0
                        if (tHash3 > clamp(0.48 * denCurve, 0.22, 0.82)) continue
                        var twH3 = 270.0 + (tHash3 * 140.0) + state.bassSmooth * 45.0
                        var yNeckTop = twH3 * 0.74
                        var yHeadBelt = twH3 * 0.88
                        var yRoofTop = twH3 * 1.00
                        var cN1C = [
                            [twX3 - neck1HalfW, twZ3 - neck1HalfW],
                            [twX3 + neck1HalfW, twZ3 - neck1HalfW],
                            [twX3 + neck1HalfW, twZ3 + neck1HalfW],
                            [twX3 - neck1HalfW, twZ3 + neck1HalfW]
                        ]
                        var cHead = [
                            [twX3 - headHalfW, twZ3 - headHalfW],
                            [twX3 + headHalfW, twZ3 - headHalfW],
                            [twX3 + headHalfW, twZ3 + headHalfW],
                            [twX3 - headHalfW, twZ3 + headHalfW]
                        ]
                        var cRoof = [
                            [twX3 - roofHalfW, twZ3 - roofHalfW],
                            [twX3 + roofHalfW, twZ3 - roofHalfW],
                            [twX3 + roofHalfW, twZ3 + roofHalfW],
                            [twX3 - roofHalfW, twZ3 + roofHalfW]
                        ]
                        for (var cc3 = 0; cc3 < 4; cc3++) {
                            var cn3 = (cc3 + 1) & 3
                            // Flared lower chin struts from green neck out to wide command head
                            appendClippedTronLine(cN1C[cc3][0], yNeckTop, cN1C[cc3][1], cHead[cc3][0], yHeadBelt, cHead[cc3][1])
                            // Wide equatorial turret belt
                            appendClippedTronLine(cHead[cc3][0], yHeadBelt, cHead[cc3][1], cHead[cn3][0], yHeadBelt, cHead[cn3][1])
                            // Upper bevelled octagonal roof slopes & roof crown ring
                            appendClippedTronLine(cHead[cc3][0], yHeadBelt, cHead[cc3][1], cRoof[cc3][0], yRoofTop, cRoof[cc3][1])
                            appendClippedTronLine(cRoof[cc3][0], yRoofTop, cRoof[cc3][1], cRoof[cn3][0], yRoofTop, cRoof[cn3][1])
                            // Viewport diagonal struts
                            appendClippedTronLine(cHead[cc3][0], yHeadBelt, cHead[cc3][1], cRoof[cn3][0], yRoofTop, cRoof[cn3][1])
                        }
                        // Rotating twin vector laser cannon dishes & barrels
                        var gunAng = l1T * 1.6 + tHash3 * 6.28
                        var gxDir = Math.cos(gunAng) * 38.0, gzDir = Math.sin(gunAng) * 38.0
                        var pXDir = -Math.sin(gunAng) * 14.0, pZDir = Math.cos(gunAng) * 14.0
                        appendClippedTronLine(twX3 - pXDir, yRoofTop, twZ3 - pZDir, twX3 + pXDir, yRoofTop, twZ3 + pZDir)
                        appendClippedTronLine(twX3 - pXDir, yRoofTop, twZ3 - pZDir, twX3 - pXDir + gxDir, yRoofTop + 14.0, twZ3 - pZDir + gzDir)
                        appendClippedTronLine(twX3 + pXDir, yRoofTop, twZ3 + pZDir, twX3 + pXDir + gxDir, yRoofTop + 14.0, twZ3 + pZDir + gzDir)
                    }
                }
                strokeQuadraScanPass(ctx, "#FF2211", 1.75 + state.beatPulse * 0.7, 0.95 * (1.0 - dim), true)
            }

            ctx.restore()
        } else if (l1Mode === 8) {
            // Mode 8: SynthGrid Outrun Canyon — Flying 3D Synthwave Terrain Canyon, Retro Segmented Horizon Sun & Scrolling Monoliths
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var groundH8 = h - horizonY
            var rows8 = Math.max(5, Math.min(20, Math.round(11 * denCurve)))
            var cols8 = Math.max(6, Math.min(22, Math.round(13 * denCurve)))
            var scrollFract8 = (((l1T * 0.45) % 1.0) + 1.0) % 1.0

            // 1. Segmented Retro Synthwave Outrun Horizon Sun at (vanishX, horizonY)
            var outrunSunR = minDim * (0.22 + state.bassSmooth * 0.04)
            ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], (0.28 + state.bassSmooth * 0.18) * (1.0 - dim) * (gpuOn ? 0.55 : 1.0))
            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.78 + state.highSmooth * 0.22) * (1.0 - dim))
            ctx.lineWidth = 1.8
            for (var sBand = 0; sBand < 7; sBand++) {
                var yTopFrac = sBand / 7.0
                var yBotFrac = (sBand + 0.72) / 7.0
                var sy0 = horizonY - outrunSunR * (1.0 - yTopFrac * 0.92)
                var sy1 = horizonY - outrunSunR * (1.0 - yBotFrac * 0.92)
                var dyMid = ((sy0 + sy1) * 0.5 - horizonY) / outrunSunR
                var chordHalfW = Math.sqrt(Math.max(0.0, 1.0 - dyMid * dyMid)) * outrunSunR
                if (chordHalfW > 2.0) {
                    ctx.beginPath()
                    ctx.rect(vanishX - chordHalfW, sy0, chordHalfW * 2.0, Math.max(1.5, sy1 - sy0))
                    ctx.fill()
                    ctx.stroke()
                }
            }

            // 2. Left & Right 3D Perspective Wireframe Mountain Canyon Walls rising from the valley edges
            ctx.strokeStyle = colourWithAlpha(palette[3 % palette.length], (0.64 + state.midSmooth * 0.30) * (1.0 - dim))
            ctx.fillStyle = colourWithAlpha(palette[4 % palette.length], (0.10 + state.bassSmooth * 0.08) * (1.0 - dim) * (gpuOn ? 0.45 : 1.0))
            ctx.lineWidth = 1.5 + state.bassSmooth * 1.0
            for (var cSide = -1; cSide <= 1; cSide += 2) {
                ctx.beginPath()
                for (var cr = 0; cr < rows8; cr++) {
                    var uC0 = (cr + scrollFract8) / rows8
                    var uC1 = Math.min(1.0, (cr + 1.0 + scrollFract8) / rows8)
                    var pC0 = Math.pow(uC0, 1.85), pC1 = Math.pow(uC1, 1.85)
                    var gy0 = horizonY + pC0 * groundH8
                    var gy1 = horizonY + pC1 * groundH8
                    var valleyX0 = lerp(vanishX + cSide * w * 0.06, cx + cSide * w * 0.34, pC0)
                    var valleyX1 = lerp(vanishX + cSide * w * 0.06, cx + cSide * w * 0.34, pC1)
                    var outerX0 = lerp(vanishX + cSide * w * 0.18, cx + cSide * w * 0.62, pC0)
                    var outerX1 = lerp(vanishX + cSide * w * 0.18, cx + cSide * w * 0.62, pC1)
                    var bMtn = state.smoothBands[((cr * 3 + (cSide > 0 ? 16 : 0)) & 63)] || 0.15
                    var peakH0 = (0.06 + pC0 * 0.28) * h * (0.65 + bMtn * 0.85)
                    var peakH1 = (0.06 + pC1 * 0.28) * h * (0.65 + bMtn * 0.85)
                    ctx.moveTo(valleyX0, gy0)
                    ctx.lineTo(outerX0, gy0 - peakH0)
                    ctx.lineTo(outerX1, gy1 - peakH1)
                    ctx.lineTo(valleyX1, gy1)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            // 3. Perspective SynthGrid Valley Floor Bands & Crisp Neon Grid Lines below horizonY
            ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], (0.08 + state.bass * 0.12) * (1.0 - dim) * (gpuOn ? 0.45 : 1.0))
            ctx.beginPath()
            for (var rf8 = 0; rf8 < rows8; rf8 += 2) {
                var d08 = (rf8 + scrollFract8) / rows8
                var d18 = Math.min(1.0, (rf8 + 0.65 + scrollFract8) / rows8)
                var y08 = horizonY + Math.pow(d08, 1.85) * groundH8
                var y18 = horizonY + Math.pow(d18, 1.85) * groundH8
                ctx.rect(0, y08, w, Math.max(1.5, y18 - y08))
            }
            ctx.fill()

            ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], (0.42 + state.bass * 0.38) * (1.0 - dim))
            ctx.lineWidth = 1.4 + state.bass * 1.2
            ctx.beginPath()
            ctx.moveTo(0, horizonY); ctx.lineTo(w, horizonY)
            for (var r8 = 0; r8 < rows8; r8++) {
                var uRow8 = (r8 + scrollFract8) / rows8
                var gy8 = horizonY + Math.pow(uRow8, 1.85) * groundH8
                ctx.moveTo(0, gy8); ctx.lineTo(w, gy8)
            }
            for (var c8 = -cols8; c8 <= cols8; c8++) {
                ctx.moveTo(vanishX + c8 * (w * 0.015), horizonY)
                ctx.lineTo(cx + c8 * (w * 0.14), h)
            }
            ctx.stroke()

            // 4. Rotating & Counter-Rotating 3D Segmented Circles Coming Towards the Viewer Over the Outrun Canyon
            var circleCount8 = Math.max(3, Math.min(8, Math.round(5 * denCurve)))
            var worldBase8 = Math.floor(l1T * 0.45)
            for (var rc8 = 0; rc8 < circleCount8; rc8++) {
                var uCirc8 = (rc8 + scrollFract8) / circleCount8
                var cFade8 = smoothstep(0.0, 0.18, uCirc8)
                if (cFade8 < 0.02) continue
                var cIdx8 = worldBase8 - rc8
                var spinDir8 = (cIdx8 & 1) ? -1.0 : 1.0
                var rotAng8 = l1T * (1.35 + state.bassSmooth * 0.45) * spinDir8 + cIdx8 * 0.65
                var radCirc8 = Math.pow(uCirc8, 1.85) * diagR * 1.05 * (1.0 + state.bassSmooth * 0.12)
                var cCX8 = lerp(vanishX, cx, Math.min(1.0, uCirc8 * 1.15))
                var cCY8 = lerp(horizonY - outrunSunR * 0.25, cy, Math.min(1.0, uCirc8 * 1.15))
                var colCirc8 = palette[((cIdx8 * 2 + 2) % palette.length + palette.length) % palette.length]
                ctx.strokeStyle = colourWithAlpha(colCirc8, (0.42 + uCirc8 * 0.48) * cFade8 * (1.0 - dim))
                ctx.lineWidth = (1.6 + uCirc8 * 2.4 + state.beatPulse * 1.2) * cFade8
                ctx.beginPath()
                var segArcs8 = 6
                for (var sa8 = 0; sa8 < segArcs8; sa8++) {
                    var a0_8 = rotAng8 + (sa8 / segArcs8) * Math.PI * 2.0
                    var a1_8 = a0_8 + (Math.PI * 2.0 / segArcs8) * 0.62
                    ctx.moveTo(cCX8 + Math.cos(a0_8) * radCirc8, cCY8 + Math.sin(a0_8) * radCirc8)
                    ctx.arc(cCX8, cCY8, radCirc8, a0_8, a1_8)
                }
                ctx.stroke()
            }
            ctx.restore()
        } else if (l1Mode === 9) {
            // Mode 9: Demoscene Polygon & Rotating Circle Tunnel — Expanding 3D Multi-Ring Geometric Polygon Tunnel, Struts & Counter-Rotating 3D Circles
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            var polyRings = Math.max(3, Math.min(16, Math.round(8 * denCurve)))
            var polySides = 5 + (Math.floor(state.t * 0.12) % 4)
            var polyScroll = (((l1T * 0.36) % 1.0) + 1.0) % 1.0
            var polyWorldBase = Math.floor(l1T * 0.36)
            var prevPolyPts = null

            for (var pr = 0; pr < polyRings; pr++) {
                var uP = (pr + polyScroll) / polyRings
                var pFade = smoothstep(0.0, 0.18, uP)
                if (pFade < 0.02) continue
                var radP = Math.pow(uP, 1.95) * diagR * 1.22
                var ringCX9 = lerp(cx + endPt.dx * 0.58, cx, Math.min(1.0, uP * 1.15))
                var ringCY9 = lerp(cy + endPt.dy * 0.58, cy, Math.min(1.0, uP * 1.15))
                var wRingIdx = polyWorldBase - pr
                var spinSign9 = (wRingIdx & 1) ? 1.0 : -1.0
                var rotP = wRingIdx * 0.22 + l1T * 0.48 * spinSign9
                var curPolyPts = []
                for (var ps = 0; ps <= polySides; ps++) {
                    var pAng = (ps / polySides) * Math.PI * 2.0 + rotP
                    var bVal9 = state.smoothBands[(ps * 5 + pr * 7) & 63] || 0.1
                    var rMod = radP * (1.0 + bVal9 * 0.16)
                    curPolyPts.push({
                        x: ringCX9 + Math.cos(pAng) * rMod,
                        y: ringCY9 + Math.sin(pAng) * rMod
                    })
                }
                var col9 = palette[((wRingIdx * 2) % palette.length + palette.length) % palette.length]
                ctx.strokeStyle = colourWithAlpha(col9, (0.38 + uP * 0.56) * pFade * (1.0 - dim))
                ctx.lineWidth = (1.2 + uP * 2.6 + state.bassSmooth * 1.2) * pFade
                ctx.beginPath()
                for (var ps2 = 0; ps2 <= polySides; ps2++) {
                    if (ps2 === 0) ctx.moveTo(curPolyPts[ps2].x, curPolyPts[ps2].y)
                    else ctx.lineTo(curPolyPts[ps2].x, curPolyPts[ps2].y)
                }
                if (prevPolyPts) {
                    for (var ps3 = 0; ps3 < polySides; ps3++) {
                        ctx.moveTo(prevPolyPts[ps3].x, prevPolyPts[ps3].y)
                        ctx.lineTo(curPolyPts[ps3].x, curPolyPts[ps3].y)
                    }
                }
                ctx.stroke()

                // Counter-rotating segmented 3D circle with radial gear notches inside each polygon ring rushing towards the viewer
                var colCirc9 = palette[((wRingIdx * 2 + 1) % palette.length + palette.length) % palette.length]
                ctx.strokeStyle = colourWithAlpha(colCirc9, (0.48 + uP * 0.50 + state.beatPulse * 0.22) * pFade * (1.0 - dim))
                ctx.lineWidth = (1.8 + uP * 2.5 + state.bassSmooth * 1.4) * pFade
                ctx.beginPath()
                var arcSegs9 = 6
                var circRot9 = -l1T * (1.65 + state.bassSmooth * 0.55) * spinSign9 + wRingIdx * 0.45
                var circRad9 = radP * (0.86 + state.bassSmooth * 0.08)
                var innerNotchR9 = circRad9 * 0.74
                for (var a9 = 0; a9 < arcSegs9; a9++) {
                    var aStart9 = circRot9 + (a9 / arcSegs9) * Math.PI * 2.0
                    var aEnd9 = aStart9 + (Math.PI * 2.0 / arcSegs9) * 0.58
                    var aMid9 = (aStart9 + aEnd9) * 0.5
                    ctx.moveTo(ringCX9 + Math.cos(aStart9) * circRad9, ringCY9 + Math.sin(aStart9) * circRad9)
                    ctx.arc(ringCX9, ringCY9, circRad9, aStart9, aEnd9)
                    // Radial gear tooth / iris spoke on each rotating arc segment
                    ctx.moveTo(ringCX9 + Math.cos(aMid9) * innerNotchR9, ringCY9 + Math.sin(aMid9) * innerNotchR9)
                    ctx.lineTo(ringCX9 + Math.cos(aMid9) * (circRad9 * 1.05), ringCY9 + Math.sin(aMid9) * (circRad9 * 1.05))
                }
                ctx.stroke()

                prevPolyPts = curPolyPts
            }
            ctx.restore()
        } else if (l1Mode === 10) {
            // Mode 10: Tempest & Asteroids 3D — 1981 Atari Tempest Color-QuadraScan 3D Tube Web, Deep Tunnel Dive, Sparse 1-2 Enemy Roster, Zapper Starbursts + 1-2 Tumbling 3D Vector Asteroids
            ctx.save()
            ctx.globalCompositeOperation = "source-over"
            if (!gpuOn) {
                ctx.fillStyle = "rgba(1, 2, 10, " + clamp(0.84 - dim * 0.35, 0.48, 0.92).toFixed(3) + ")"
                ctx.fillRect(0, 0, w, h)
            }
            var webLanes = 16
            var webRings = 9
            // Dramatic tunnel-dive zoom & axial travel so the camera & Claw plunge deep down into the tube and surge back to the rim!
            var diveWave = 0.5 + 0.5 * Math.sin(l1T * 0.78)
            var tubeZoom = 0.56 + 1.06 * diveWave + state.bassSmooth * 0.28
            var webOriginX = cx + endPt.dx * (0.30 + 0.16 * Math.sin(l1T * 0.52))
            var webOriginY = cy + endPt.dy * (0.30 + 0.16 * Math.cos(l1T * 0.52))
            var webFlow = (((l1T * 0.85) % 1.0) + 1.0) % 1.0
            var webShapeMode = Math.floor(Math.abs(l1T) * 0.10) % 3

            function evalTempestRimNode(laneVal, radiusVal) {
                var uL = (((laneVal % webLanes) + webLanes) % webLanes) / webLanes
                var theta = uL * Math.PI * 2.0 + Math.sin(l1T * 0.32) * 0.28
                var lobe = 1.0
                if (webShapeMode === 1) {
                    // Clover / Star Tempest web
                    lobe = 0.78 + 0.26 * Math.cos(theta * 4.0)
                } else if (webShapeMode === 2) {
                    // Pinch / Hourglass Tempest web
                    lobe = 0.82 + 0.24 * Math.cos(theta * 2.0)
                }
                return {
                    x: Math.cos(theta) * radiusVal * lobe * 1.12,
                    y: Math.sin(theta) * radiusVal * lobe * 0.88
                }
            }

            function evalTempestPoint(laneVal, uDepth) {
                var uClamped = clamp(uDepth, 0.04, 1.38)
                var rW = minDim * (0.036 + Math.pow(uClamped, 1.75) * 0.52 * tubeZoom)
                var wxC = lerp(webOriginX, cx, Math.min(1.15, uClamped))
                var wyC = lerp(webOriginY, cy, Math.min(1.15, uClamped))
                var offset = evalTempestRimNode(laneVal, rW)
                return { x: wxC + offset.x, y: wyC + offset.y, r: rW, u: uClamped }
            }

            // 1. Electric Blue (#2255FF) 16-Lane 3D Perspective Tempest Tube Web surging up & down the tunnel
            var ringNodes = []
            for (var wr = 0; wr <= webRings; wr++) {
                var uW = clamp((wr + webFlow) / webRings, 0.04, 1.12)
                var rowPts = []
                for (var wl = 0; wl <= webLanes; wl++) {
                    rowPts.push(evalTempestPoint(wl, uW))
                }
                ringNodes.push(rowPts)
            }

            ctx.beginPath()
            for (var wr2 = 0; wr2 < ringNodes.length; wr2++) {
                var rRow = ringNodes[wr2]
                for (var wl2 = 0; wl2 <= webLanes; wl2++) {
                    if (wl2 === 0) ctx.moveTo(rRow[wl2].x, rRow[wl2].y)
                    else ctx.lineTo(rRow[wl2].x, rRow[wl2].y)
                }
            }
            for (var wl3 = 0; wl3 < webLanes; wl3++) {
                var nearPt = evalTempestPoint(wl3, 1.05)
                var farPt = evalTempestPoint(wl3, 0.04)
                ctx.moveTo(farPt.x, farPt.y)
                ctx.lineTo(nearPt.x, nearPt.y)
            }
            strokeQuadraScanPass(ctx, "#2255FF", 1.75 + state.bassSmooth * 0.7, 0.88 * (1.0 - dim), true)

            // 2. Active Player Lane Highlight Rails + Yellow (#FFFF11) Tempest Claw Blaster plunging up & down the tunnel + Dual-Rail Zapper Laser Bolts
            var clawLanePos = ((l1T * 3.1) % webLanes + webLanes) % webLanes
            var clawLane = Math.floor(clawLanePos)
            var uClaw = 0.56 + 0.44 * (0.5 + 0.5 * Math.cos(l1T * 0.85))
            var railNear0 = evalTempestPoint(clawLane, 1.05)
            var railNear1 = evalTempestPoint(clawLane + 1, 1.05)
            var railFar0 = evalTempestPoint(clawLane, 0.04)
            var railFar1 = evalTempestPoint(clawLane + 1, 0.04)

            ctx.beginPath()
            ctx.moveTo(railFar0.x, railFar0.y); ctx.lineTo(railNear0.x, railNear0.y)
            ctx.moveTo(railFar1.x, railFar1.y); ctx.lineTo(railNear1.x, railNear1.y)
            strokeQuadraScanPass(ctx, "#FFFF11", 2.0 + state.beatPulse * 0.9, 0.88 * (1.0 - dim), false)

            var cP0 = evalTempestPoint(clawLanePos - 0.08, uClaw)
            var cP1 = evalTempestPoint(clawLanePos + 1.08, uClaw)
            var cMidInner = evalTempestPoint(clawLanePos + 0.5, uClaw * 0.88)
            var cMidOuter = evalTempestPoint(clawLanePos + 0.5, uClaw * 1.11)
            var cTipL = evalTempestPoint(clawLanePos + 0.16, uClaw * 1.07)
            var cTipR = evalTempestPoint(clawLanePos + 0.84, uClaw * 1.07)
            ctx.beginPath()
            ctx.moveTo(cTipL.x, cTipL.y)
            ctx.lineTo(cP0.x, cP0.y)
            ctx.lineTo(cMidOuter.x, cMidOuter.y)
            ctx.lineTo(cP1.x, cP1.y)
            ctx.lineTo(cTipR.x, cTipR.y)
            ctx.lineTo(cMidInner.x, cMidInner.y)
            ctx.closePath()
            strokeQuadraScanPass(ctx, "#FFFF11", 2.6 + state.beatPulse * 1.0, 0.98 * (1.0 - dim), true)

            // Focused Player Zapper Laser Bolts (1-2 clean bolts firing down the active Claw lane)
            var zapperBoltCount = density <= 0.85 ? 1 : 2
            ctx.beginPath()
            for (var zb = 0; zb < zapperBoltCount; zb++) {
                var zPhase = (((state.t * 4.2 + zb * 0.5) % 1.0) + 1.0) % 1.0
                var uShot = lerp(uClaw * 0.95, 0.06, zPhase)
                var shotLane = (clawLane - zb + webLanes) % webLanes + 0.5
                var sPtA = evalTempestPoint(shotLane, uShot)
                var sPtB = evalTempestPoint(shotLane, Math.max(0.04, uShot - 0.085))
                var sPtL = evalTempestPoint(shotLane - 0.24, uShot - 0.04)
                var sPtR = evalTempestPoint(shotLane + 0.24, uShot - 0.04)
                ctx.moveTo(sPtA.x, sPtA.y); ctx.lineTo(sPtB.x, sPtB.y)
                ctx.moveTo(sPtL.x, sPtL.y); ctx.lineTo(sPtR.x, sPtR.y)
                ctx.moveTo(sPtA.x, sPtA.y); ctx.lineTo(sPtL.x, sPtL.y); ctx.lineTo(sPtB.x, sPtB.y); ctx.lineTo(sPtR.x, sPtR.y); ctx.closePath()
            }
            strokeQuadraScanPass(ctx, "#FFFFFF", 2.1 + state.highSmooth * 0.9, 0.95 * (1.0 - dim), true)

            // Sparse, authentic Tempest enemy roster: strictly 1-2 enemies total at normal density (max 3 at extreme density)
            // Primary enemy: 1 Red (#FF1111) Flipper (or 2 at high density > 1.35)
            var flipperCount = density > 1.35 ? 2 : 1
            ctx.beginPath()
            for (var flp = 0; flp < flipperCount; flp++) {
                var flpProg = (((l1T * (0.44 + flp * 0.13) + flp * 0.47) % 1.0) + 1.0) % 1.0
                var uFlip = 0.10 + 0.86 * flpProg
                var uFlipTop = Math.min(1.10, uFlip + 0.11)
                var baseLane = ((flp * 7 + Math.floor(Math.abs(l1T) * 1.2 + flp)) % webLanes + webLanes) % webLanes
                var flipStrut = Math.max(0.0, Math.sin(state.t * 4.2 + flp * 1.9))
                var fL0 = baseLane - 0.06 + flipStrut * 0.50
                var fL1 = baseLane + 1.06 + flipStrut * 0.50
                var fpA = evalTempestPoint(fL0, uFlip)
                var fpB = evalTempestPoint(fL1, uFlip)
                var fpC = evalTempestPoint(fL0, uFlipTop)
                var fpD = evalTempestPoint(fL1, uFlipTop)
                var fpMid = evalTempestPoint((fL0 + fL1) * 0.5, (uFlip + uFlipTop) * 0.5)
                ctx.moveTo(fpA.x, fpA.y); ctx.lineTo(fpD.x, fpD.y)
                ctx.lineTo(fpB.x, fpB.y); ctx.lineTo(fpC.x, fpC.y)
                ctx.closePath()
                ctx.moveTo(fpA.x, fpA.y); ctx.lineTo(fpB.x, fpB.y)
                ctx.moveTo(fpC.x, fpC.y); ctx.lineTo(fpD.x, fpD.y)
                ctx.moveTo(fpMid.x - 3, fpMid.y); ctx.lineTo(fpMid.x + 3, fpMid.y)
            }
            strokeQuadraScanPass(ctx, "#FF1111", 2.35 + state.bassSmooth * 0.85, 0.96 * (1.0 - dim), true)

            // Secondary enemy slot (0 at low density <= 0.55, 1 rotating specialist enemy at normal density):
            // Cycles cleanly over time between a Magenta Tanker, a Green Spiker, or a Cyan Fuseball so there are only 1-2 enemies on screen!
            var activeSpecialist = density <= 0.55 ? -1 : (Math.floor(Math.abs(l1T) * 0.18) % 3)
            if (activeSpecialist === 0) {
                // 1 Magenta (#FF22FF) Heavy Diamond Tanker
                ctx.beginPath()
                var tnkLane = ((Math.floor(Math.abs(l1T) * 0.18) * 5 + 4) % webLanes) + 0.5
                var tnkProg = (((l1T * 0.38 + 0.29) % 1.0) + 1.0) % 1.0
                var uTank = 0.12 + 0.84 * tnkProg
                var tTop = evalTempestPoint(tnkLane, uTank + 0.095)
                var tBot = evalTempestPoint(tnkLane, Math.max(0.05, uTank - 0.095))
                var tLeft = evalTempestPoint(tnkLane - 0.54, uTank)
                var tRight = evalTempestPoint(tnkLane + 0.54, uTank)
                var tInL = evalTempestPoint(tnkLane - 0.26, uTank)
                var tInR = evalTempestPoint(tnkLane + 0.26, uTank)
                var tInTop = evalTempestPoint(tnkLane, uTank + 0.045)
                var tInBot = evalTempestPoint(tnkLane, Math.max(0.05, uTank - 0.045))
                ctx.moveTo(tTop.x, tTop.y); ctx.lineTo(tRight.x, tRight.y)
                ctx.lineTo(tBot.x, tBot.y); ctx.lineTo(tLeft.x, tLeft.y); ctx.closePath()
                ctx.moveTo(tInTop.x, tInTop.y); ctx.lineTo(tInR.x, tInR.y)
                ctx.lineTo(tInBot.x, tInBot.y); ctx.lineTo(tInL.x, tInL.y); ctx.closePath()
                ctx.moveTo(tTop.x, tTop.y); ctx.lineTo(tBot.x, tBot.y)
                ctx.moveTo(tLeft.x, tLeft.y); ctx.lineTo(tRight.x, tRight.y)
                strokeQuadraScanPass(ctx, "#FF22FF", 2.25 + state.midSmooth * 0.8, 0.94 * (1.0 - dim), true)
            } else if (activeSpecialist === 1) {
                // 1 Green (#11FF33) Spiker extending a green spike rail with spinning spiral head
                ctx.beginPath()
                var spkLane = ((Math.floor(Math.abs(l1T) * 0.18) * 5 + 9) % webLanes) + 0.5
                var spkProg = (((l1T * 0.52 + 0.31) % 1.0) + 1.0) % 1.0
                var uSpikeTip = 0.20 + 0.72 * spkProg
                var spkBase = evalTempestPoint(spkLane, 0.05)
                var spkTip = evalTempestPoint(spkLane, uSpikeTip)
                ctx.moveTo(spkBase.x, spkBase.y)
                ctx.lineTo(spkTip.x, spkTip.y)
                var headR = Math.max(6.5, spkTip.r * 0.135)
                for (var sh = 0; sh <= 14; sh++) {
                    var shU = sh / 14.0
                    var shAng = shU * Math.PI * 4.0 + l1T * 7.0
                    var sxH = spkTip.x + Math.cos(shAng) * headR * shU
                    var syH = spkTip.y + Math.sin(shAng) * headR * shU
                    if (sh === 0) ctx.moveTo(sxH, syH)
                    else ctx.lineTo(sxH, syH)
                }
                strokeQuadraScanPass(ctx, "#11FF33", 2.15 + state.bassSmooth * 0.75, 0.94 * (1.0 - dim), true)
            } else if (activeSpecialist === 2) {
                // 1 Cyan (#00FFFF) Crackling Fuseball zig-zagging along a lane rail
                ctx.beginPath()
                var fzRail = ((Math.floor(Math.abs(l1T) * 0.9) + 6) % webLanes + webLanes) % webLanes
                var fzProg = (((l1T * 0.64 + 0.27) % 1.0) + 1.0) % 1.0
                var uFuse = 0.12 + 0.84 * fzProg
                var fzCenter = evalTempestPoint(fzRail + 0.14 * Math.sin(state.t * 9.0), uFuse)
                var fzRad = Math.max(7.0, fzCenter.r * 0.125 * (1.0 + state.beatPulse * 0.35))
                for (var fSpoke = 0; fSpoke < 8; fSpoke++) {
                    var fAng = (fSpoke / 8.0) * Math.PI * 2.0 + state.t * 8.5
                    var fMidX = fzCenter.x + Math.cos(fAng + 0.32) * fzRad * 0.55
                    var fMidY = fzCenter.y + Math.sin(fAng + 0.32) * fzRad * 0.55
                    var fEndX = fzCenter.x + Math.cos(fAng) * fzRad
                    var fEndY = fzCenter.y + Math.sin(fAng) * fzRad
                    ctx.moveTo(fzCenter.x, fzCenter.y)
                    ctx.lineTo(fMidX, fMidY)
                    ctx.lineTo(fEndX, fEndY)
                }
                strokeQuadraScanPass(ctx, "#00FFFF", 2.05 + state.highSmooth * 0.8, 0.94 * (1.0 - dim), true)
            }

            // 6B. 1981 Atari Tempest Vector Starburst Explosion when Zapper bolts hit in the active lane
            var exLife = (((state.t * 1.8) % 1.0) + 1.0) % 1.0
            if (exLife <= 0.55) {
                ctx.beginPath()
                var exProg = exLife / 0.55
                var exLane = (clawLane + webLanes) % webLanes + 0.5
                var exCenter = evalTempestPoint(exLane, 0.42)
                var exMaxR = Math.max(10.0, exCenter.r * 0.22) * exProg
                for (var eSpk = 0; eSpk < 10; eSpk++) {
                    var eAng = (eSpk / 10.0) * Math.PI * 2.0
                    var rIn = exMaxR * 0.32
                    var rOut = exMaxR * ((eSpk & 1) ? 1.0 : 0.68)
                    ctx.moveTo(exCenter.x + Math.cos(eAng) * rIn, exCenter.y + Math.sin(eAng) * rIn)
                    ctx.lineTo(exCenter.x + Math.cos(eAng) * rOut, exCenter.y + Math.sin(eAng) * rOut)
                }
                strokeQuadraScanPass(ctx, "#FFFF11", 2.1, 0.92 * (1.0 - dim), true)
            }

            // 7. Tumbling 3D Vector Asteroids (strictly 1 or 2 craggy 3D polyhedra orbiting in outer space!)
            var astCount = density <= 0.30 ? 0 : (density < 0.85 ? 1 : (density <= 1.55 ? 2 : 3))
            if (astCount > 0) {
                ctx.beginPath()
                for (var ai = 0; ai < astCount; ai++) {
                    var aAng = (ai / Math.max(1, astCount)) * Math.PI * 2.0 + 0.65 + l1T * 0.20 * (ai & 1 ? 1.0 : -1.0)
                    var aDist = minDim * (0.48 + (ai % 2) * 0.10)
                    var axC = cx + Math.cos(aAng) * aDist * 1.18
                    var ayC = cy + Math.sin(aAng) * aDist * 0.82
                    var aScale = minDim * (0.046 + (ai % 2) * 0.014) * (1.0 + state.bassSmooth * 0.18)
                    var arx = l1T * (0.85 + ai * 0.22), ary = l1T * (0.68 + ai * 0.18), arz = l1T * 0.48
                    var aPts = []
                    for (var av = 0; av < 8; av++) {
                        var va = (av / 8.0) * Math.PI * 2.0
                        var crag = (av % 2 === 0) ? 1.0 : 0.68
                        var vz = ((av % 3) - 1) * 0.45
                        aPts.push(project3DPoint(Math.cos(va) * crag, Math.sin(va) * crag, vz, arx, ary, arz, axC, ayC, aScale, 3.6))
                    }
                    for (var ae = 0; ae < 8; ae++) {
                        var an = (ae + 1) & 7
                        var ac = (ae + 3) & 7
                        ctx.moveTo(aPts[ae].x, aPts[ae].y); ctx.lineTo(aPts[an].x, aPts[an].y)
                        if ((ae & 1) === 0) {
                            ctx.moveTo(aPts[ae].x, aPts[ae].y); ctx.lineTo(aPts[ac].x, aPts[ac].y)
                        }
                    }
                }
                strokeQuadraScanPass(ctx, "#00FFFF", 1.5 + state.highSmooth * 0.6, 0.82 * (1.0 - dim), true)
            }
            ctx.restore()
        } else if (l1Mode === 11) {
            // Mode 11 (UI 12: Stark Photo Realm): 16-Variant Monochrome Silver-Halide & 25-Mode Photo Motion Engine
            var photoDrawn = false
            if (cfg && typeof cfg.photoMotionRenderCallback === "function") {
                ctx.save()
                try {
                    photoDrawn = Boolean(cfg.photoMotionRenderCallback(ctx, w, h, state, palette, cfg))
                } finally {
                    ctx.restore()
                }
            }
            if (!photoDrawn) {
                // Stark Brutalist Silver-Halide Darkroom Aperture & Chiaroscuro Viewfinder Stage when awaiting photo frames
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.globalAlpha = clamp((0.88 - dim * 0.45), 0.15, 0.98)
                var palRgb = parseRgbTriplet(palette[0] || "#94A3B8")
                var darkGrad = ctx.createRadialGradient(cx, cy, minDim * 0.04, cx, cy, Math.max(w, h) * 0.72)
                darkGrad.addColorStop(0.0, "rgba(226, 232, 240, " + clamp(0.12 + state.bassSmooth * 0.14, 0.05, 0.95).toFixed(3) + ")")
                darkGrad.addColorStop(0.45, "rgba(" + palRgb[0] + ", " + palRgb[1] + ", " + palRgb[2] + ", " + clamp(0.08 + state.midSmooth * 0.08, 0.04, 0.90).toFixed(3) + ")")
                darkGrad.addColorStop(1.0, "rgba(4, 5, 10, 0.94)")
                ctx.fillStyle = darkGrad
                ctx.fillRect(0, 0, w, h)

                // Silver-halide contact-sheet frame & audio-reactive iris blades
                if (ctx.strokeCount !== undefined) {
                    var frameW = w * (0.76 + state.bassSmooth * 0.04)
                    var frameH = h * (0.74 + state.bassSmooth * 0.04)
                    var fx0 = cx - frameW * 0.5
                    var fy0 = cy - frameH * 0.5
                    ctx.globalAlpha = 0.0
                    ctx.strokeStyle = "rgba(0, 0, 0, 0)"
                    ctx.lineWidth = 0.001
                    ctx.beginPath()
                    ctx.rect(fx0, fy0, frameW, frameH)
                    ctx.stroke()
                }
                ctx.restore()
            }
        } else if (l1Mode === 24) {
            // =================================================================
            // WORLD #25: CRT RAVE-MAN FREE-ROAMING E-PILL FIELD (Upright 70s/80s
            // CRT Scanline Pac-Man Gliding Smoothly Over Spinning 3D 'E' Pills & Ghosts)
            // =================================================================
            ctx.save()
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            var l1Spd = cfg && cfg.layer1Speed !== undefined ? clamp(Number(cfg.layer1Speed), 0.1, 3.0) : 1.0
            var l1Den = density
            var TAU = Math.PI * 2.0
            // Note: state.l1Time (l1T) already integrates l1Speed * l1Dir in stepState;
            // dirSign reflects the instantaneous sign of dl1T/dt so velocity (vx, vy)
            // always matches the true travel tangent in Towards (+1), Away (-1), and Breathe (0).
            var dirSign = (l1Dir === 0)
                ? (Math.sin((state.t || 0.0) * 0.45) < 0.0 ? -1.0 : 1.0)
                : (l1Dir < 0 ? -1.0 : 1.0)

            // Dynamic 3D Rave Table/Board Pose: wide varying 3D angles + smooth 180°/360° 3D table flips
            var flipCycleDur = 8.5
            var getFlipStep = function (k) {
                var km = ((k % 4) + 4) % 4
                if (km === 0) return { dp: Math.PI, dr: 0.0 }          // 180° pitch somersault inversion
                if (km === 1) return { dp: 0.0, dr: Math.PI }          // 180° roll barrel-flip inversion
                if (km === 2) return { dp: Math.PI, dr: Math.PI }      // 180° diagonal kickflip inversion
                return { dp: TAU, dr: -Math.PI }                       // 360° full rave-table twist flip
            }
            var evalCumulativeFlip = function (kInt) {
                var q = Math.floor(kInt / 4)
                var rem = kInt - q * 4
                var pitchAcc = q * (4.0 * Math.PI)
                var rollAcc = q * Math.PI
                for (var j = 0; j < rem; j++) {
                    var stp = getFlipStep(j)
                    pitchAcc += stp.dp
                    rollAcc += stp.dr
                }
                return { pitch: pitchAcc, roll: rollAcc }
            }
            var evalBoardPose = function (tPlane) {
                var cyc = tPlane / flipCycleDur
                var kIdx = Math.floor(cyc)
                var uPhase = cyc - kIdx
                // Smooth C2 quintic flip window in the second half of each cycle; wide varying angles in the first half
                var wFlip = clamp((uPhase - 0.42) / 0.50, 0.0, 1.0)
                var sFlip = wFlip * wFlip * wFlip * (10.0 - 15.0 * wFlip + 6.0 * wFlip * wFlip)
                var flipAct = 4.0 * wFlip * (1.0 - wFlip)
                var baseFlip = evalCumulativeFlip(kIdx)
                var curStep = getFlipStep(kIdx)
                var flipPitch = baseFlip.pitch + sFlip * curStep.dp
                var flipRoll = baseFlip.roll + sFlip * curStep.dr

                var sYaw = tPlane * 0.22 + Math.sin(tPlane * 0.31) * 0.62 + Math.cos(tPlane * 0.17) * 0.28
                var sPitch = 0.46 + 0.54 * Math.sin(tPlane * 0.29) + 0.32 * Math.cos(tPlane * 0.43) + state.bassSmooth * 0.14 + flipPitch
                var sRoll = 0.52 * Math.sin(tPlane * 0.23) + 0.34 * Math.cos(tPlane * 0.37) + (state.midSmooth || 0.0) * 0.08 + flipRoll
                var cY = Math.cos(sYaw), sY = Math.sin(sYaw)
                var cP = Math.cos(sPitch), sP = Math.sin(sPitch)
                var cR = Math.cos(sRoll), sR = Math.sin(sRoll)
                return {
                    yaw: sYaw, pitch: sPitch, roll: sRoll,
                    cY: cY, sY: sY, cP: cP, sP: sP, cR: cR, sR: sR,
                    normalZ: cP * cR,
                    flipActivity: flipAct
                }
            }

            // Continuous, smooth Lissajous / Figure-8 / slalom trajectory in local stage coordinates
            var roamRate = 0.36 + l1Spd * 0.12
            var roamT = l1T * roamRate
            var roamRx = w * 0.34
            var roamRy = h * 0.28
            var evalLocalPacCurve = function (uVal) {
                return {
                    lx: Math.sin(uVal * 1.0) * roamRx + Math.cos(uVal * 2.0) * (w * 0.06),
                    ly: Math.sin(uVal * 2.0) * roamRy * 0.72 + Math.sin(uVal * 3.0) * (h * 0.05)
                }
            }

            // 4 Classic Arcade Ghosts trajectories in local board coordinates
            var ghostSpecs = [
                { name: "BLINKY", col: "#FF1E38", rim: "#FF94A2", fx: 0.72, fy: 0.95, px: 0.4,  py: 1.1, rx: 0.34, ry: 0.28 },
                { name: "PINKY",  col: "#FF82D8", rim: "#FBCFE8", fx: 0.88, fy: 0.64, px: 2.1,  py: 2.6, rx: 0.36, ry: 0.30 },
                { name: "INKY",   col: "#00F5FF", rim: "#A5F3FC", fx: 0.63, fy: 1.12, px: 3.8,  py: 0.7, rx: 0.32, ry: 0.27 },
                { name: "CLYDE",  col: "#FFB84D", rim: "#FED7AA", fx: 0.54, fy: 0.78, px: 5.1,  py: 4.2, rx: 0.38, ry: 0.32 }
            ]
            var ghostRate = 0.48 + l1Spd * 0.14
            var evalLocalGhostPos = function (gi, tPlane) {
                var gs = ghostSpecs[gi]
                var gtVal = tPlane * ghostRate
                return {
                    lx: Math.cos(gtVal * gs.fx + gs.px) * (w * gs.rx),
                    ly: Math.sin(gtVal * gs.fy + gs.py) * (h * gs.ry)
                }
            }

            // Dynamic Camera Zoom & Panning: zooms right in to Pac-Man & ghosts at varying angles, and pulls back to show full 3D table flips
            var evalCameraState = function (tPlane, pose) {
                var zoomWave = clamp(0.5 - 0.5 * Math.cos(tPlane * 0.34) + 0.18 * Math.sin(tPlane * 0.71), 0.0, 1.0)
                var zoomPullback = 1.0 - 0.26 * pose.flipActivity
                var camZoom = (0.88 + zoomWave * 1.55 * zoomPullback) * (1.0 + state.bassSmooth * 0.12)
                var panWeight = zoomWave * (0.66 - 0.24 * pose.flipActivity)

                var pacAt = evalLocalPacCurve(tPlane * roamRate)
                // Smoothly pan between Pac-Man and the roaming ghosts during close-ups
                var ghostTour = tPlane * 0.24
                var gIdx0 = ((Math.floor(ghostTour) % 4) + 4) % 4
                var gIdx1 = (gIdx0 + 1) % 4
                var gFrac = ghostTour - Math.floor(ghostTour)
                var gSmooth = gFrac * gFrac * (3.0 - 2.0 * gFrac)
                var gPos0 = evalLocalGhostPos(gIdx0, tPlane)
                var gPos1 = evalLocalGhostPos(gIdx1, tPlane)
                var ghostFocusLX = gPos0.lx + (gPos1.lx - gPos0.lx) * gSmooth
                var ghostFocusLY = gPos0.ly + (gPos1.ly - gPos0.ly) * gSmooth
                var ghostVisit = Math.pow(0.5 - 0.5 * Math.cos(tPlane * 0.27), 2.0) * 0.48

                var targetLX = pacAt.lx * (1.0 - ghostVisit) + ghostFocusLX * ghostVisit
                var targetLY = pacAt.ly * (1.0 - ghostVisit) + ghostFocusLY * ghostVisit
                return {
                    zoom: camZoom,
                    focusLX: targetLX * panWeight,
                    focusLY: targetLY * panWeight
                }
            }

            var boardPose = evalBoardPose(l1T)
            var camState = evalCameraState(l1T, boardPose)
            var stageYaw = boardPose.yaw
            var stagePitch = boardPose.pitch
            var stageRoll = boardPose.roll
            var planeFov = minDim * 1.45

            // Rotate a 3D board point (lx, ly, lz) into 3D camera space around the board centre
            var rotateBoardPoint = function (lx, ly, lz, pose) {
                var zVal = lz || 0.0
                var x1 = lx * pose.cY - ly * pose.sY
                var y1 = lx * pose.sY + ly * pose.cY
                var y2 = y1 * pose.cP - zVal * pose.sP
                var z2 = y1 * pose.sP + zVal * pose.cP
                var x3 = x1 * pose.cR + z2 * pose.sR
                var z3 = -x1 * pose.sR + z2 * pose.cR
                return { x: x3, y: y2, z: z3 }
            }

            // Projects a point (lx, ly, lz) on the 3D rave table onto the screen at time tPlane
            var projectRavePlaneAt = function (lx, ly, tPlane, lz) {
                var pose = (tPlane === l1T) ? boardPose : evalBoardPose(tPlane)
                var cam = (tPlane === l1T) ? camState : evalCameraState(tPlane, pose)
                var pt3 = rotateBoardPoint(lx, ly, lz || 0.0, pose)
                var foc3 = rotateBoardPoint(cam.focusLX, cam.focusLY, 0.0, pose)
                var rx = pt3.x - foc3.x
                var ry = pt3.y - foc3.y
                var rz = pt3.z - foc3.z
                var sc = (planeFov * cam.zoom) / Math.max(planeFov * 0.28, planeFov + rz)
                return {
                    x: cx + rx * sc,
                    y: cy + ry * sc,
                    sc: sc,
                    z: rz
                }
            }
            var projectRavePlane = function (lx, ly, lz) {
                return projectRavePlaneAt(lx, ly, l1T, lz || 0.0)
            }

            var pacLocal = evalLocalPacCurve(roamT)
            var pacLX = pacLocal.lx
            var pacLY = pacLocal.ly
            var dtL1 = 0.024 * dirSign
            var pacNextLocal = evalLocalPacCurve((l1T + dtL1) * roamRate)

            // Project Pac-Man and his immediate forward curve tangent on the current 3D tilted/flipped board
            // so his mouth always aims directly along his visible travel path toward the next pill on screen
            var pacPrj = projectRavePlane(pacLX, pacLY, 0.0)
            var pacNextPrj = projectRavePlane(pacNextLocal.lx, pacNextLocal.ly, 0.0)
            var pacX = pacPrj.x
            var pacY = pacPrj.y
            var vx = pacNextPrj.x - pacPrj.x
            var vy = pacNextPrj.y - pacPrj.y
            if (Math.hypot(vx, vy) < 1e-3) {
                var dlx = pacNextLocal.lx - pacLX
                var dly = pacNextLocal.ly - pacLY
                vx = (dlx * boardPose.cY - dly * boardPose.sY) * (boardPose.cR >= 0.0 ? 1.0 : -1.0)
                vy = (dlx * boardPose.sY + dly * boardPose.cY) * (boardPose.cP >= 0.0 ? 1.0 : -1.0)
                if (Math.hypot(vx, vy) < 1e-4) vx = dirSign
            }
            var mouthDir = Math.atan2(vy, vx)

            // 5x7 CRT Scanline Bitmap for 'E'
            var eGlyphRows = [0x1F, 0x10, 0x10, 0x1E, 0x10, 0x10, 0x1F]

            // Helper: Draw embossed CRT vector 'E' glyph centred at (ox, oy)
            var strokeEGlyphPath = function (ox, oy, eW, eH, flipSign) {
                for (var er = 0; er < 7; er++) {
                    var rowBits = eGlyphRows[er]
                    var eyPos = oy + ((er / 6.0) - 0.5) * eH
                    var inRun = false
                    var runStart = 0
                    for (var ec = 0; ec <= 5; ec++) {
                        var bitOn = (ec < 5) && (((rowBits >> (4 - ec)) & 1) === 1)
                        if (bitOn && !inRun) {
                            inRun = true
                            runStart = ec
                        } else if (!bitOn && inRun) {
                            inRun = false
                            var x0 = ox + (((runStart / 5.0) - 0.5) * eW) * flipSign
                            var x1 = ox + ((((ec - 0.15) / 5.0) - 0.5) * eW) * flipSign
                            ctx.moveTo(x0, eyPos)
                            ctx.lineTo(x1, eyPos)
                        }
                    }
                }
            }

            // Helper to draw a 3D Spinning/Rotating Circular Rave Pill stamped with 'E' in CRT Phosphor Scanlines
            var drawSpinningEPill = function (px, py, radius, spinYaw, spinTilt, faceHex, rimHex, eHex, alphaVal, isPower) {
                if (radius < 2.2) return
                var cosSpin = Math.cos(spinYaw)
                var sinSpin = Math.sin(spinYaw)
                var absCos = Math.max(0.20, Math.abs(cosSpin))
                var thickness = radius * (isPower ? 0.40 : 0.34)
                var rimOffset = sinSpin * thickness

                ctx.save()
                ctx.translate(px, py)
                ctx.rotate(spinTilt)

                // 1. 3D Pill Side-Wall / Bevel Cylinder Rim (CRT scanline ribbed edge)
                var scanSteps = isPower ? 8 : 6
                ctx.lineWidth = Math.max(1.2, (radius * 2.0) / (scanSteps * 1.45))
                ctx.strokeStyle = colourWithAlpha(rimHex, alphaVal * 0.82)
                ctx.beginPath()
                for (var sr = 0; sr < scanSteps; sr++) {
                    var uf = (sr / (scanSteps - 1)) * 2.0 - 1.0
                    var sy = uf * radius * 0.90
                    var halfChord = Math.sqrt(Math.max(0.0, 1.0 - uf * uf)) * radius
                    var xBack = -halfChord * absCos + rimOffset
                    var xFront = halfChord * absCos + rimOffset
                    ctx.moveTo(Math.min(xBack, -halfChord * absCos), sy)
                    ctx.lineTo(Math.max(xFront, halfChord * absCos), sy)
                }
                ctx.stroke()

                // 2. Pill Front Tablet Face rendered as 70s/80s Horizontal CRT Phosphor Scanline Bars
                var faceScanRows = isPower ? 11 : 7
                ctx.lineWidth = Math.max(1.3, (radius * 1.85) / faceScanRows)
                ctx.strokeStyle = colourWithAlpha(faceHex, alphaVal * 0.95)
                ctx.beginPath()
                for (var fr = 0; fr < faceScanRows; fr++) {
                    var vf = (fr / (faceScanRows - 1)) * 2.0 - 1.0
                    var fy = vf * radius * 0.88
                    var fChord = Math.sqrt(Math.max(0.0, 1.0 - vf * vf)) * radius * absCos
                    ctx.moveTo(-fChord, fy)
                    ctx.lineTo(fChord, fy)
                }
                ctx.stroke()

                // 3. Outer Neon Bevel Ring
                ctx.lineWidth = isPower ? 1.7 : 1.15
                ctx.strokeStyle = colourWithAlpha("#ffffff", alphaVal * 0.78)
                ctx.beginPath()
                for (var aStep = 0; aStep <= 20; aStep++) {
                    var aRad = (aStep / 20) * TAU
                    var ex = Math.cos(aRad) * radius * absCos
                    var ey = Math.sin(aRad) * radius
                    if (aStep === 0) ctx.moveTo(ex, ey)
                    else ctx.lineTo(ex, ey)
                }
                ctx.stroke()

                // 4. Embossed 'E' Stamped on the Spinning Pill Face (foreshortened by cosSpin!)
                if (absCos > 0.22 && radius >= 3.2) {
                    var eW = radius * 0.82 * absCos
                    var eH = radius * 0.95
                    var flipSign = cosSpin >= 0 ? 1.0 : -1.0
                    ctx.lineWidth = Math.max(1.25, radius * (isPower ? 0.14 : 0.16))
                    ctx.strokeStyle = colourWithAlpha(eHex, alphaVal)
                    ctx.beginPath()
                    strokeEGlyphPath(0, 0, eW, eH, flipSign)
                    ctx.stroke()
                }
                ctx.restore()
            }

            // Helper: Starburst Pop / Respawn Flash when Pac-Man chomps over an 'E' pill
            var drawPillStarburst = function (px, py, baseR, burstProg, pillHex, alphaVal) {
                var p = clamp(burstProg, 0.0, 1.0)
                var fade = (1.0 - p * 0.75) * alphaVal
                if (fade < 0.04) return
                var ringR = baseR * (1.1 + p * 2.8)
                var innerR = baseR * (0.25 + p * 1.05)
                var outerR = baseR * (1.45 + p * 3.45)
                var rayCount = 10
                var rotOff = state.t * 3.5 + px * 0.01

                ctx.save()
                ctx.translate(px, py)

                // Expanding shockwave ring
                ctx.lineWidth = Math.max(1.4, (1.0 - p * 0.7) * 3.0)
                ctx.strokeStyle = colourWithAlpha(pillHex, fade * 0.92)
                ctx.beginPath()
                ctx.arc(0, 0, ringR, 0, TAU)
                ctx.stroke()

                // Radial starburst spikes + expanding 'E' spark
                ctx.lineWidth = Math.max(1.3, (1.0 - p * 0.7) * 2.6)
                ctx.strokeStyle = colourWithAlpha("#FEF08A", fade)
                ctx.beginPath()
                for (var ri = 0; ri < rayCount; ri++) {
                    var rAng = rotOff + (ri / rayCount) * TAU
                    var tipR = (ri & 1) ? (outerR * 0.72) : outerR
                    ctx.moveTo(Math.cos(rAng) * innerR, Math.sin(rAng) * innerR)
                    ctx.lineTo(Math.cos(rAng) * tipR, Math.sin(rAng) * tipR)
                }
                var sparkScale = baseR * (0.95 + p * 1.4)
                strokeEGlyphPath(0, 0, sparkScale * 0.85, sparkScale * 0.95, 1.0)
                ctx.stroke()
                ctx.restore()
            }

            // Helper to draw an upright classic arcade Ghost in 70s/80s CRT Scanline Phosphor Bars
            // with wavy skirt, eyes tracking Pac-Man, and a spinning 'E' badge on its chest
            var drawCrtGhost = function (gx, gy, gRadius, bodyHex, rimHex, lookDX, lookDY, wavePhase, alphaVal) {
                ctx.save()
                ctx.translate(gx, gy)
                var scanRows = 15
                var totalH = gRadius * 2.15
                var topY = -gRadius * 1.05

                // 1. CRT Scanline Ghost Silhouette (dome head + cylindrical torso + 3-wave skirt)
                for (var pass = 0; pass < 2; pass++) {
                    ctx.strokeStyle = pass === 0
                        ? colourWithAlpha(bodyHex, alphaVal * 0.94)
                        : colourWithAlpha(rimHex, alphaVal * 0.65)
                    ctx.lineWidth = pass === 0
                        ? Math.max(2.2, totalH / (scanRows * 1.15))
                        : Math.max(1.0, totalH / (scanRows * 2.4))
                    ctx.beginPath()
                    for (var r = 0; r < scanRows; r++) {
                        var uf = r / (scanRows - 1) // 0 = top of dome, 1 = bottom of skirt
                        var sy = topY + uf * totalH
                        var halfW = gRadius
                        if (uf < 0.45) {
                            // Rounded upper dome
                            var dyNorm = (0.45 - uf) / 0.45
                            halfW = gRadius * Math.sqrt(Math.max(0.08, 1.0 - dyNorm * dyNorm))
                        }
                        if (uf > 0.78) {
                            // 3-wave classic ghost skirt notches at the bottom
                            var skirtFrac = (uf - 0.78) / 0.22
                            var notches = 3
                            for (var ni = 0; ni < notches; ni++) {
                                var segX0 = -halfW + (2.0 * halfW * ni) / notches
                                var segX1 = -halfW + (2.0 * halfW * (ni + 1)) / notches
                                var trim = halfW * 0.14 * skirtFrac * (0.6 + 0.4 * Math.sin(wavePhase + ni * 2.1))
                                ctx.moveTo(segX0 + trim, sy)
                                ctx.lineTo(segX1 - trim, sy)
                            }
                        } else {
                            ctx.moveTo(-halfW, sy)
                            ctx.lineTo(halfW, sy)
                        }
                    }
                    ctx.stroke()
                }

                // 2. Classic Arcade Ghost Eyes (looking toward Pac-Man's position)
                var lookAng = Math.atan2(lookDY, lookDX)
                var eyeOffX = Math.cos(lookAng) * gRadius * 0.14
                var eyeOffY = Math.sin(lookAng) * gRadius * 0.12
                var eyeR = gRadius * 0.24
                var pupilR = gRadius * 0.12
                var eyeY = -gRadius * 0.26
                for (var ei = -1; ei <= 1; ei += 2) {
                    var ex = ei * gRadius * 0.34 + eyeOffX * 0.5
                    ctx.fillStyle = colourWithAlpha("#ffffff", alphaVal * 0.96)
                    ctx.beginPath()
                    ctx.arc(ex, eyeY, eyeR, 0, TAU)
                    ctx.fill()
                    ctx.fillStyle = colourWithAlpha("#1d4ed8", alphaVal * 0.98)
                    ctx.beginPath()
                    ctx.arc(ex + eyeOffX, eyeY + eyeOffY, pupilR, 0, TAU)
                    ctx.fill()
                }

                // 3. Mini spinning 'E' pill crest on the ghost's lower torso
                drawSpinningEPill(
                    0,
                    gRadius * 0.32,
                    gRadius * 0.34,
                    wavePhase * 0.85,
                    0.0,
                    rimHex,
                    "#ffffff",
                    bodyHex,
                    alphaVal * 0.92,
                    false
                )
                ctx.restore()
            }

            // 1. 3D Flipping Arcade Rave Table / Board (Dual-Deck Surface Grid + 3D Slab Side-Wall Rim & Bumpers)
            var isBoardFlipped = boardPose.normalZ < 0.0
            var topGridCol = palette[0] || "#22d3ee"
            var botGridCol = palette[1 % palette.length] || "#f43f5e"
            var rimNeonCol = palette[2 % palette.length] || "#a855f7"
            var activeDeckCol = isBoardFlipped ? botGridCol : topGridCol
            var backDeckCol = isBoardFlipped ? topGridCol : botGridCol
            var halfSpanX = w * 0.46
            var halfSpanY = h * 0.42
            var boardThick = minDim * 0.044
            var zFrontDeck = isBoardFlipped ? (boardThick * 0.5) : (-boardThick * 0.5)
            var zBackDeck = -zFrontDeck
            var gridLines = 8

            // 1a. Back/Opposite Deck Parallax Grid (visible through the translucent neon table as it tilts & flips)
            ctx.strokeStyle = colourWithAlpha(backDeckCol, clamp(0.11 * l1Opac, 0.03, 0.22))
            ctx.lineWidth = 1.0
            ctx.beginPath()
            for (var biLine = 0; biLine <= gridLines; biLine++) {
                var bf = (biLine / gridLines) * 2.0 - 1.0
                var bA = projectRavePlane(bf * halfSpanX, -halfSpanY, zBackDeck)
                var bB = projectRavePlane(bf * halfSpanX,  halfSpanY, zBackDeck)
                ctx.moveTo(bA.x, bA.y)
                ctx.lineTo(bB.x, bB.y)
                var bC = projectRavePlane(-halfSpanX, bf * halfSpanY, zBackDeck)
                var bD = projectRavePlane( halfSpanX, bf * halfSpanY, zBackDeck)
                ctx.moveTo(bC.x, bC.y)
                ctx.lineTo(bD.x, bD.y)
            }
            ctx.stroke()

            // 1b. 3D Table Slab Side-Wall Struts & Dual Perimeter Bezel (shows 3D board thickness during steep tilts & 180°/360° flips)
            ctx.strokeStyle = colourWithAlpha(rimNeonCol, clamp((0.28 + 0.18 * boardPose.flipActivity) * l1Opac, 0.08, 0.52))
            ctx.lineWidth = 1.5
            ctx.beginPath()
            for (var si = 0; si <= gridLines; si++) {
                var sf = (si / gridLines) * 2.0 - 1.0
                var sTopN = projectRavePlane(sf * halfSpanX, -halfSpanY, zFrontDeck)
                var sBotN = projectRavePlane(sf * halfSpanX, -halfSpanY, zBackDeck)
                ctx.moveTo(sTopN.x, sTopN.y)
                ctx.lineTo(sBotN.x, sBotN.y)
                var sTopS = projectRavePlane(sf * halfSpanX, halfSpanY, zFrontDeck)
                var sBotS = projectRavePlane(sf * halfSpanX, halfSpanY, zBackDeck)
                ctx.moveTo(sTopS.x, sTopS.y)
                ctx.lineTo(sBotS.x, sBotS.y)
                if (si > 0 && si < gridLines) {
                    var sTopW = projectRavePlane(-halfSpanX, sf * halfSpanY, zFrontDeck)
                    var sBotW = projectRavePlane(-halfSpanX, sf * halfSpanY, zBackDeck)
                    ctx.moveTo(sTopW.x, sTopW.y)
                    ctx.lineTo(sBotW.x, sBotW.y)
                    var sTopE = projectRavePlane(halfSpanX, sf * halfSpanY, zFrontDeck)
                    var sBotE = projectRavePlane(halfSpanX, sf * halfSpanY, zBackDeck)
                    ctx.moveTo(sTopE.x, sTopE.y)
                    ctx.lineTo(sBotE.x, sBotE.y)
                }
            }
            ctx.stroke()

            // 1c. Active Front Deck Grid + Highlighted Neon Table Rim
            ctx.strokeStyle = colourWithAlpha(activeDeckCol, clamp((0.20 + 0.10 * boardPose.flipActivity) * l1Opac, 0.06, 0.38))
            ctx.lineWidth = 1.25
            ctx.beginPath()
            for (var giLine = 0; giLine <= gridLines; giLine++) {
                var gf = (giLine / gridLines) * 2.0 - 1.0
                var gA = projectRavePlane(gf * halfSpanX, -halfSpanY, zFrontDeck)
                var gB = projectRavePlane(gf * halfSpanX,  halfSpanY, zFrontDeck)
                ctx.moveTo(gA.x, gA.y)
                ctx.lineTo(gB.x, gB.y)
                var gC = projectRavePlane(-halfSpanX, gf * halfSpanY, zFrontDeck)
                var gD = projectRavePlane( halfSpanX, gf * halfSpanY, zFrontDeck)
                ctx.moveTo(gC.x, gC.y)
                ctx.lineTo(gD.x, gD.y)
            }
            ctx.stroke()

            // 2. Open Free-Roaming Constellation & Curve Trail of Spinning 3D 'E' Pills
            var colsCount = clamp(Math.round(5 + l1Den * 2.0), 5, 8)
            var rowsCount = clamp(Math.round(4 + l1Den * 1.5), 4, 6)
            var spanX = w * 0.76
            var spanY = h * 0.68
            var basePillR = minDim * 0.024 * (1.0 + state.beatPulse * 0.16)
            var chompRadius = minDim * 0.095

            for (var rIdx = 0; rIdx < rowsCount; rIdx++) {
                for (var cIdx = 0; cIdx < colsCount; cIdx++) {
                    var seed = rIdx * 13 + cIdx * 7
                    var uCell = (colsCount > 1 ? cIdx / (colsCount - 1) : 0.5) - 0.5
                    var vCell = (rowsCount > 1 ? rIdx / (rowsCount - 1) : 0.5) - 0.5
                    // Gentle organic float in local plane coordinates before 3D plane tilt & flip
                    var plx = uCell * spanX + Math.sin(l1T * 1.15 + seed * 1.7) * (minDim * 0.025)
                    var ply = vCell * spanY + Math.cos(l1T * 1.35 + seed * 2.3) * (minDim * 0.025)
                    var pillPrj = projectRavePlane(plx, ply, 0.0)
                    var px = pillPrj.x
                    var py = pillPrj.y
                    var pillSc = clamp(pillPrj.sc, 0.35, 2.65)
                    var isPower = ((rIdx === 0 || rIdx === rowsCount - 1) && (cIdx === 0 || cIdx === colsCount - 1)) || ((seed % 11) === 0)
                    var pillR = basePillR * (isPower ? 1.55 : 1.0) * pillSc
                    var distToPac = Math.hypot(plx - pacLX, ply - pacLY)
                    var pillCol = isPower
                        ? (palette[1 % palette.length] || "#f43f5e")
                        : (palette[(2 + (seed % 3)) % palette.length] || "#a855f7")

                    if (distToPac < chompRadius) {
                        // Pac-Man is chomping over this pill: draw multi-ray CRT starburst flash!
                        var chompFrac = 1.0 - (distToPac / chompRadius)
                        drawPillStarburst(px, py, pillR, chompFrac, pillCol, l1Opac)
                    } else {
                        var pillSpin = l1T * (2.8 + (isPower ? 1.4 : 0.0)) + seed * 0.9 + stagePitch * 0.5
                        var pillTilt = Math.sin(stageRoll) * 0.55 + Math.sin(pillSpin * 0.5) * 0.24
                        drawSpinningEPill(
                            px,
                            py,
                            pillR,
                            pillSpin,
                            pillTilt,
                            pillCol,
                            "#ffffff",
                            "#fef08a",
                            l1Opac * 0.92,
                            isPower
                        )
                    }
                }
            }

            // Trail of 'E' rave pills directly along Pac-Man's Lissajous curve so he continuously chomps & pops pills
            var trailStepU = 0.26 / clamp(0.65 + l1Den * 0.35, 0.55, 1.65)
            var curStationIdx = Math.floor(roamT / trailStepU)
            for (var sk = curStationIdx - 8; sk <= curStationIdx + 12; sk++) {
                var uStation = sk * trailStepU
                var passedU = (roamT - uStation) * dirSign
                var stLoc = evalLocalPacCurve(uStation)
                var stPrj = projectRavePlane(stLoc.lx, stLoc.ly, 0.0)
                var stSc = clamp(stPrj.sc, 0.35, 2.65)
                var isPowerSt = (((sk % 6) + 6) % 6) === 0
                var stCol = palette[((sk % palette.length) + palette.length) % palette.length] || "#00F5FF"
                var stR = basePillR * (isPowerSt ? 1.45 : 1.0) * stSc
                if (passedU >= -0.025 && passedU <= 0.28) {
                    var burstP = (passedU + 0.025) / 0.305
                    drawPillStarburst(stPrj.x, stPrj.y, stR, burstP, stCol, l1Opac)
                } else if (passedU < -0.025) {
                    var aheadFade = clamp(1.12 + passedU * 0.25, 0.30, 0.95)
                    drawSpinningEPill(
                        stPrj.x,
                        stPrj.y,
                        stR,
                        state.t * 3.4 + sk * 0.85 + stagePitch * 0.5,
                        Math.sin(stageRoll) * 0.55 + Math.sin(state.t * 2.0 + sk) * 0.24,
                        stCol,
                        "#ffffff",
                        "#fef08a",
                        l1Opac * aheadFade,
                        isPowerSt
                    )
                }
            }

            // 3. 4 Classic Arcade Ghosts Free-Roaming Upright Across the Tilting & Flipping Pill Table
            var baseGhostR = minDim * 0.046 * (1.0 + state.bassSmooth * 0.14)
            for (var gi = 0; gi < 4; gi++) {
                var gs = ghostSpecs[gi]
                var gLoc = evalLocalGhostPos(gi, l1T)
                var gPrj = projectRavePlane(gLoc.lx, gLoc.ly, 0.0)
                var gSc = clamp(gPrj.sc, 0.42, 2.65)
                drawCrtGhost(
                    gPrj.x,
                    gPrj.y,
                    baseGhostR * gSc,
                    gs.col,
                    gs.rim,
                    pacX - gPrj.x,
                    pacY - gPrj.y,
                    state.t * 8.5 + gi * 1.5,
                    l1Opac
                )
            }

            // 4. Upright Yellow CRT Rave-Man Gliding Smoothly & Chomping Consistently Every Frame!
            var pacSc = clamp(pacPrj.sc, 0.45, 2.70)
            var pacR = minDim * 0.068 * pacSc * (1.0 + state.beatPulse * 0.14)
            var chompAngle = 0.06 + 0.72 * Math.abs(Math.sin(state.t * 10.0))
            var pacScanRows = Math.round(clamp(17 * Math.sqrt(pacSc * 0.85), 15, 23))

            ctx.save()
            ctx.translate(pacX, pacY)

            // Subtle phosphor wake rings behind Pac-Man along his velocity vector
            var speedNorm = Math.hypot(vx, vy) || 1.0
            var backUX = -vx / speedNorm
            var backUY = -vy / speedNorm
            for (var wk = 1; wk <= 3; wk++) {
                var wkAlpha = (0.28 / wk) * l1Opac
                ctx.strokeStyle = colourWithAlpha("#facc15", wkAlpha)
                ctx.lineWidth = 1.6
                ctx.beginPath()
                ctx.arc(backUX * pacR * 0.48 * wk, backUY * pacR * 0.48 * wk, pacR * (1.0 - wk * 0.18), mouthDir + chompAngle, mouthDir + TAU - chompAngle)
                ctx.stroke()
            }

            // Keep CRT scanlines strictly horizontal in screen space (upright CRT aesthetic)
            // while analytically clipping each scanline chord against Pac-Man's mouth wedge [mouthDir - chompAngle, mouthDir + chompAngle]!
            var jawAng1 = mouthDir - chompAngle
            var jawAng2 = mouthDir + chompAngle
            var sinJ1 = Math.sin(jawAng1), cosJ1 = Math.cos(jawAng1)
            var sinJ2 = Math.sin(jawAng2), cosJ2 = Math.cos(jawAng2)

            for (var pass = 0; pass < 2; pass++) {
                ctx.strokeStyle = pass === 0
                    ? colourWithAlpha("#facc15", l1Opac * 0.98)
                    : colourWithAlpha("#fef9c3", l1Opac * 0.86)
                ctx.lineWidth = pass === 0
                    ? Math.max(2.6, (pacR * 1.85) / pacScanRows)
                    : Math.max(1.2, (pacR * 0.85) / pacScanRows)
                ctx.beginPath()
                for (var pr = 0; pr < pacScanRows; pr++) {
                    var pvf = (pr / (pacScanRows - 1)) * 2.0 - 1.0
                    var pyLine = pvf * pacR * 0.94
                    if (Math.abs(pyLine) < 0.05) pyLine = 0.05
                    var halfW = Math.sqrt(Math.max(0.0, 1.0 - pvf * pvf)) * pacR
                    if (halfW < 1.0) continue

                    var breaks = [-halfW, halfW]
                    if (pyLine * sinJ1 > 0.0 && Math.abs(sinJ1) > 1e-5) {
                        var xHit1 = pyLine * (cosJ1 / sinJ1)
                        if (xHit1 > -halfW && xHit1 < halfW) breaks.push(xHit1)
                    }
                    if (pyLine * sinJ2 > 0.0 && Math.abs(sinJ2) > 1e-5) {
                        var xHit2 = pyLine * (cosJ2 / sinJ2)
                        if (xHit2 > -halfW && xHit2 < halfW) breaks.push(xHit2)
                    }
                    breaks.sort(function (a, b) { return a - b })

                    for (var bi = 0; bi < breaks.length - 1; bi++) {
                        var xa = breaks[bi]
                        var xb = breaks[bi + 1]
                        if (xb - xa < 0.5) continue
                        var xm = 0.5 * (xa + xb)
                        var dMouth = Math.atan2(pyLine, xm) - mouthDir
                        while (dMouth > Math.PI) dMouth -= TAU
                        while (dMouth < -Math.PI) dMouth += TAU
                        if (Math.abs(dMouth) >= chompAngle) {
                            ctx.moveTo(xa, pyLine)
                            ctx.lineTo(xb, pyLine)
                        }
                    }
                }
                ctx.stroke()
            }

            // Crisp Neon Yellow Perimeter Arc & Chomping Jaw Edges so the bite is unmistakable
            ctx.strokeStyle = colourWithAlpha("#fef08a", l1Opac * 0.96)
            ctx.lineWidth = 2.4
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.arc(0, 0, pacR, mouthDir + chompAngle, mouthDir + TAU - chompAngle, false)
            ctx.closePath()
            ctx.stroke()

            // Classic Arcade Pac-Man Eye (always positioned on the upper side of his head relative to his travel direction)
            var eyeSide = Math.cos(mouthDir) >= 0.0 ? -1.0 : 1.0
            var pacEyeAng = mouthDir + eyeSide * Math.max(chompAngle + 0.34, 0.92)
            var pacEyeX = Math.cos(pacEyeAng) * (pacR * 0.54)
            var pacEyeY = Math.sin(pacEyeAng) * (pacR * 0.54)
            ctx.fillStyle = "rgba(8, 12, 24, " + (0.95 * l1Opac).toFixed(3) + ")"
            ctx.beginPath()
            ctx.arc(pacEyeX, pacEyeY, pacR * 0.13, 0, TAU)
            ctx.fill()
            ctx.strokeStyle = colourWithAlpha("#ffffff", l1Opac * 0.85)
            ctx.lineWidth = 1.3
            ctx.stroke()

            ctx.restore()
            ctx.restore()
        } else if (l1Mode === 25) {
            // =================================================================
            // WORLD #26: SUMERIAN TARDIS (Ancient Mesopotamian Lapis-Lazuli &
            // Electrum-Gold Stepped Ziggurat Time-Vessel Hurtling Through a
            // Relativistic Star-of-Inanna & Cuneiform Time-Vortex Tunnel)
            // =================================================================
            ctx.save()
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            var TAU26 = Math.PI * 2.0
            var l1Den26 = density
            var palShift26 = Math.floor((state.hueShift || 0) / 45)
            var lapisDeep = mixHexColours("#0c4a6e", palette[(0 + palShift26) % palette.length], 0.30)
            var lapisBright = mixHexColours("#0284c7", palette[(1 + palShift26) % palette.length], 0.35)
            var turquoiseGlaze = mixHexColours("#22d3ee", palette[(2 + palShift26) % palette.length], 0.32)
            var electrumGold = mixHexColours("#f59e0b", palette[(3 + palShift26) % palette.length], 0.28)
            var solarGold = mixHexColours("#fde047", palette[(4 + palShift26) % palette.length], 0.24)
            var carnelianRotor = mixHexColours("#f43f5e", palette[(5 + palShift26) % palette.length], 0.32)

            // Helper: draw a cuneiform wedge stroke (triangularstylus head + tapered tail)
            var appendCuneiformWedge = function (wx, wy, wLen, wAng, headR) {
                var ca = Math.cos(wAng), sa = Math.sin(wAng)
                var na = -sa, nb = ca
                var hL = headR * 0.95
                // Triangular stylus impression head
                ctx.moveTo(wx + na * headR, wy + nb * headR)
                ctx.lineTo(wx - na * headR, wy - nb * headR)
                ctx.lineTo(wx + ca * hL, wy + sa * hL)
                ctx.closePath()
                // Tapered cuneiform shaft
                ctx.moveTo(wx, wy)
                ctx.lineTo(wx + ca * wLen, wy + sa * wLen)
            }

            // 1. Relativistic Sumerian Time-Vortex Tunnel (14 Counter-Rotating Star-of-Inanna & Cuneiform Rings)
            var ringCount26 = clamp(Math.round(10 + l1Den26 * 3.0), 10, 16)
            var zFlow26 = ((l1T * 1.35) % 1.0 + 1.0) % 1.0

            for (var rStep26 = ringCount26 - 1; rStep26 >= 0; rStep26--) {
                var uDepth26 = (rStep26 + 1.0 - zFlow26) / ringCount26 // 1 = far, 0 = near foreground
                var zDist26 = 0.22 + uDepth26 * 2.85
                var sc26 = (minDim * 0.48) / zDist26
                var ringWorldId = Math.floor(l1T * 1.35) - rStep26
                var spinSign26 = (ringWorldId & 1) === 0 ? 1.0 : -1.0
                var ringRot26 = l1T * (0.65 + (ringWorldId & 3) * 0.14) * spinSign26 + ringWorldId * 0.52

                // Sinuous 3D Time-Vortex bend along the tunnel axis
                var bendPhase = uDepth26 * 3.6 - l1T * 1.25
                var ringCX = cx + Math.sin(bendPhase) * (w * 0.13) * uDepth26
                var ringCY = cy + Math.cos(bendPhase * 0.85) * (h * 0.11) * uDepth26
                var depthAlpha = Math.sin(clamp(1.0 - uDepth26, 0.02, 0.98) * Math.PI) * (1.0 - dim)

                // A. 8-Pointed Star of Inanna / Ishtar (two interlocking rotated squares / octagram)
                var isGoldRing = (Math.abs(ringWorldId) % 3) === 0
                var ringCol = isGoldRing ? electrumGold : ((Math.abs(ringWorldId) & 1) ? turquoiseGlaze : lapisBright)
                ctx.strokeStyle = colourWithAlpha(ringCol, clamp(depthAlpha * (0.68 + state.bassSmooth * 0.24), 0.05, 0.94))
                ctx.lineWidth = clamp(2.6 * (1.0 - uDepth26 * 0.65), 0.9, 3.0)
                ctx.beginPath()
                for (var sqPass = 0; sqPass < 2; sqPass++) {
                    var sqOffset = sqPass * (Math.PI * 0.25)
                    for (var vIdx = 0; vIdx <= 8; vIdx++) {
                        var octAng = ringRot26 + sqOffset + (vIdx / 8.0) * TAU26
                        var starR = sc26 * ((vIdx & 1) === 0 ? 1.08 : 0.82)
                        var vx = ringCX + Math.cos(octAng) * starR
                        var vy = ringCY + Math.sin(octAng) * starR
                        if (vIdx === 0) ctx.moveTo(vx, vy)
                        else ctx.lineTo(vx, vy)
                    }
                }
                ctx.stroke()

                // B. Orbiting Sumerian Cuneiform Wedge Inscriptions around every second Time-Vortex Ring
                if ((rStep26 & 1) === 0 && sc26 > 24.0) {
                    var wedgeCount = 12
                    var wLen = Math.max(4.5, sc26 * 0.14)
                    var headR = Math.max(1.8, sc26 * 0.032)
                    ctx.strokeStyle = colourWithAlpha(solarGold, clamp(depthAlpha * 0.82, 0.06, 0.95))
                    ctx.lineWidth = clamp(1.6 * (1.0 - uDepth26 * 0.55), 0.8, 2.0)
                    ctx.beginPath()
                    for (var wi = 0; wi < wedgeCount; wi++) {
                        var wTheta = -ringRot26 * 1.15 + (wi / wedgeCount) * TAU26
                        var wx = ringCX + Math.cos(wTheta) * (sc26 * 0.94)
                        var wy = ringCY + Math.sin(wTheta) * (sc26 * 0.94)
                        // Tangent + radial cuneiform triad
                        appendCuneiformWedge(wx, wy, wLen, wTheta + Math.PI * 0.5, headR)
                        if ((wi & 1) === 0) {
                            appendCuneiformWedge(wx - Math.cos(wTheta) * headR * 2.2, wy - Math.sin(wTheta) * headR * 2.2, wLen * 0.72, wTheta, headR * 0.8)
                        }
                    }
                    ctx.stroke()
                }
            }

            // 2. Tumbling 3D Sumerian Ziggurat-TARDIS Time-Capsule at the Heart of the Vortex
            //    (Lapis-Lazuli Stepped Ziggurat Monolith + Reciprocating Central Time-Rotor + Cuneiform Door Tablets + Beacon Crystal)
            var tardisScale = minDim * (0.23 + 0.04 * Math.sin(l1T * 0.85) + state.bassSmooth * 0.035)
            var tardisFov = minDim * 1.35
            // Smooth 3-axis relativistic tumble through the Time Vortex
            var tYaw = l1T * 0.78
            var tPitch = 0.28 * Math.sin(l1T * 0.54) + 0.12 * Math.cos(l1T * 0.31)
            var tRoll = 0.24 * Math.cos(l1T * 0.47)
            var cY = Math.cos(tYaw), sY = Math.sin(tYaw)
            var cP = Math.cos(tPitch), sP = Math.sin(tPitch)
            var cR = Math.cos(tRoll), sR = Math.sin(tRoll)

            // Subtle orbital float around vortex centre
            var tardisCX = cx + Math.sin(l1T * 0.62) * (w * 0.055)
            var tardisCY = cy + Math.cos(l1T * 0.49) * (h * 0.045)

            // Materialisation / Dematerialisation "VWORP" harmonic phase pulse
            var vworpWave = 0.82 + 0.18 * Math.sin(l1T * 3.4)
            var tardisOpac = clamp(vworpWave * (1.0 - dim), 0.25, 1.0)

            var projTardisPt = function (lx, ly, lz) {
                // Rotate Y (yaw around monolith vertical axis)
                var x1 = lx * cY - lz * sY
                var z1 = lx * sY + lz * cY
                var y1 = ly
                // Rotate X (pitch)
                var y2 = y1 * cP - z1 * sP
                var z2 = y1 * sP + z1 * cP
                // Rotate Z (roll)
                var x3 = x1 * cR - y2 * sR
                var y3 = x1 * sR + y2 * cR
                var sc = tardisFov / Math.max(tardisFov * 0.35, tardisFov + z2 * tardisScale)
                return {
                    x: tardisCX + x3 * tardisScale * sc,
                    y: tardisCY + y3 * tardisScale * sc,
                    z: z2,
                    sc: sc
                }
            }

            // Helper to project & draw a 3D rectangular prism tier (used for the Base Plinth, Lapis Cabinet Body, and 3 Stepped Ziggurat Roof Tiers)
            var drawZigguratTierBox = function (halfW, yTop, yBot, halfD, fillHex, fillAlpha, edgeHex, lineW, drawPanelGrid) {
                var crn = [
                    projTardisPt(-halfW, yTop, -halfD),
                    projTardisPt( halfW, yTop, -halfD),
                    projTardisPt( halfW, yBot, -halfD),
                    projTardisPt(-halfW, yBot, -halfD),
                    projTardisPt(-halfW, yTop,  halfD),
                    projTardisPt( halfW, yTop,  halfD),
                    projTardisPt( halfW, yBot,  halfD),
                    projTardisPt(-halfW, yBot,  halfD)
                ]
                var faces = [
                    { ids: [0, 1, 2, 3], nx:  0, nz: -1 }, // Front (-Z)
                    { ids: [5, 4, 7, 6], nx:  0, nz:  1 }, // Back (+Z)
                    { ids: [4, 0, 3, 7], nx: -1, nz:  0 }, // Left (-X)
                    { ids: [1, 5, 6, 2], nx:  1, nz:  0 }, // Right (+X)
                    { ids: [4, 5, 1, 0], nx:  0, nz:  0 }, // Top (-Y)
                    { ids: [3, 2, 6, 7], nx:  0, nz:  0 }  // Bottom (+Y)
                ]
                // Sort faces back-to-front by average depth z
                faces.sort(function (a, b) {
                    var za = (crn[a.ids[0]].z + crn[a.ids[1]].z + crn[a.ids[2]].z + crn[a.ids[3]].z) * 0.25
                    var zb = (crn[b.ids[0]].z + crn[b.ids[1]].z + crn[b.ids[2]].z + crn[b.ids[3]].z) * 0.25
                    return zb - za
                })

                for (var fi = 0; fi < faces.length; fi++) {
                    var f = faces[fi]
                    var p0 = crn[f.ids[0]], p1 = crn[f.ids[1]], p2 = crn[f.ids[2]], p3 = crn[f.ids[3]]
                    ctx.fillStyle = colourWithAlpha(fillHex, fillAlpha * tardisOpac)
                    ctx.strokeStyle = colourWithAlpha(edgeHex, 0.90 * tardisOpac)
                    ctx.lineWidth = lineW
                    ctx.beginPath()
                    ctx.moveTo(p0.x, p0.y)
                    ctx.lineTo(p1.x, p1.y)
                    ctx.lineTo(p2.x, p2.y)
                    ctx.lineTo(p3.x, p3.y)
                    ctx.closePath()
                    ctx.fill()
                    ctx.stroke()

                    // Etch Police-Box / Babylonian Cuneiform Recessed Coffered Panels on the 4 vertical cabinet walls
                    if (drawPanelGrid && (f.nx !== 0 || f.nz !== 0)) {
                        ctx.strokeStyle = colourWithAlpha(solarGold, 0.78 * tardisOpac)
                        ctx.lineWidth = Math.max(1.0, lineW * 0.65)
                        ctx.beginPath()
                        // Central vertical double-door seam
                        var topMidX = (p0.x + p1.x) * 0.5, topMidY = (p0.y + p1.y) * 0.5
                        var botMidX = (p3.x + p2.x) * 0.5, botMidY = (p3.y + p2.y) * 0.5
                        ctx.moveTo(topMidX, topMidY)
                        ctx.lineTo(botMidX, botMidY)
                        // 3 horizontal panel lintels (forming 8 recessed Sumerian TARDIS door tablets per wall)
                        for (var hRow = 1; hRow <= 3; hRow++) {
                            var vf = hRow / 4.0
                            var lx = p0.x + (p3.x - p0.x) * vf
                            var ly = p0.y + (p3.y - p0.y) * vf
                            var rx = p1.x + (p2.x - p1.x) * vf
                            var ry = p1.y + (p2.y - p1.y) * vf
                            ctx.moveTo(lx, ly)
                            ctx.lineTo(rx, ry)
                        }
                        // Upper frieze lintel sign box ("DINGIR / TARDIS" cuneiform nameplate)
                        var fTopL_X = p0.x + (p3.x - p0.x) * 0.08, fTopL_Y = p0.y + (p3.y - p0.y) * 0.08
                        var fTopR_X = p1.x + (p2.x - p1.x) * 0.08, fTopR_Y = p1.y + (p2.y - p1.y) * 0.08
                        ctx.moveTo(fTopL_X, fTopL_Y)
                        ctx.lineTo(fTopR_X, fTopR_Y)
                        ctx.stroke()
                    }
                }
            }

            // 2A. Internal Reciprocating Sumerian Time-Rotor Column (glowing inside the translucent Lapis-Lazuli cabinet)
            var rotorCycle = Math.sin(l1T * 4.2)
            var rotorTopY = -0.58 + rotorCycle * 0.16
            var rotorBotY =  0.58 + rotorCycle * 0.16
            var pRotorTop = projTardisPt(0, -0.78, 0)
            var pRotorBot = projTardisPt(0,  0.82, 0)
            ctx.strokeStyle = colourWithAlpha(carnelianRotor, 0.85 * tardisOpac)
            ctx.lineWidth = 4.5 + state.beatPulse * 2.5
            ctx.beginPath()
            ctx.moveTo(pRotorTop.x, pRotorTop.y)
            ctx.lineTo(pRotorBot.x, pRotorBot.y)
            ctx.stroke()

            // Spinning Hexagonal Time-Rotor Seal Rings inside the column
            for (var rRing = 0; rRing < 4; rRing++) {
                var ryPos = rotorTopY + (rRing / 3.0) * (rotorBotY - rotorTopY)
                var rRad = 0.24 + (rRing & 1) * 0.06
                var rSpin = l1T * 3.6 * ((rRing & 1) ? 1.0 : -1.0)
                ctx.strokeStyle = colourWithAlpha(rRing & 1 ? solarGold : turquoiseGlaze, 0.92 * tardisOpac)
                ctx.lineWidth = 1.8
                ctx.beginPath()
                for (var hs = 0; hs <= 6; hs++) {
                    var ha = rSpin + (hs / 6.0) * TAU26
                    var hp = projTardisPt(Math.cos(ha) * rRad, ryPos, Math.sin(ha) * rRad)
                    if (hs === 0) ctx.moveTo(hp.x, hp.y)
                    else ctx.lineTo(hp.x, hp.y)
                }
                ctx.stroke()
            }

            // 2B. Stepped Sumerian Ziggurat Base Plinth & Main Lapis-Lazuli TARDIS Cabinet
            // Base stepped foundation plinth
            drawZigguratTierBox(0.68,  0.82,  0.96, 0.68, lapisDeep,   0.52, electrumGold, 2.0, false)
            // Main Police-Box / Babylonian Temple Sanctuary Body (translucent Lapis Lazuli so internal Time-Rotor shines through!)
            drawZigguratTierBox(0.54, -0.68,  0.82, 0.54, lapisBright, 0.26, turquoiseGlaze, 2.4, true)
            // 3 Stepped Sumerian Ziggurat Roof Tiers (ascending pyramid-ziggurat crown)
            drawZigguratTierBox(0.60, -0.82, -0.68, 0.60, lapisDeep,   0.48, electrumGold, 2.1, false)
            drawZigguratTierBox(0.44, -0.96, -0.82, 0.44, lapisBright, 0.52, solarGold,    1.9, false)
            drawZigguratTierBox(0.28, -1.10, -0.96, 0.28, electrumGold, 0.46, "#ffffff",   1.7, false)

            // 2C. Apex Time-Rotor Lantern Beacon & Volumetric Babylonian Lightning Arcs
            var pBeaconBase = projTardisPt(0, -1.10, 0)
            var pBeaconTip  = projTardisPt(0, -1.32, 0)
            var pBeaconMid  = projTardisPt(0, -1.21, 0)
            var beaconR = Math.max(5.0, tardisScale * 0.11 * pBeaconMid.sc * (1.0 + state.beatPulse * 0.35))

            // Glowing Dingir (8-Rayed Sumerian Divinity Starburst) at the Ziggurat TARDIS Roof Lantern
            ctx.fillStyle = colourWithAlpha("#ffffff", 0.96 * tardisOpac)
            ctx.strokeStyle = colourWithAlpha(solarGold, 0.94 * tardisOpac)
            ctx.lineWidth = 2.2
            ctx.beginPath()
            ctx.arc(pBeaconMid.x, pBeaconMid.y, beaconR * 0.55, 0, TAU26)
            ctx.fill()
            ctx.stroke()

            ctx.beginPath()
            for (var dRay = 0; dRay < 8; dRay++) {
                var dAng = l1T * 2.4 + (dRay / 8.0) * TAU26
                var rayLen = beaconR * ((dRay & 1) ? 1.8 : 2.6) * (1.0 + state.bassSmooth * 0.35)
                ctx.moveTo(pBeaconMid.x - Math.cos(dAng) * rayLen, pBeaconMid.y - Math.sin(dAng) * rayLen)
                ctx.lineTo(pBeaconMid.x + Math.cos(dAng) * rayLen, pBeaconMid.y + Math.sin(dAng) * rayLen)
            }
            ctx.moveTo(pBeaconBase.x, pBeaconBase.y)
            ctx.lineTo(pBeaconTip.x, pBeaconTip.y)
            ctx.stroke()

            // Temporal Lightning Filaments arcing from the Ziggurat Beacon out to the surrounding Time-Vortex
            var arcCount = 4 + (state.beatPulse > 0.3 ? 2 : 0)
            ctx.strokeStyle = colourWithAlpha(turquoiseGlaze, (0.58 + state.beatPulse * 0.36) * tardisOpac)
            ctx.lineWidth = 1.6 + state.beatPulse * 1.2
            ctx.beginPath()
            for (var ai = 0; ai < arcCount; ai++) {
                var arcAng = l1T * 1.9 + (ai / arcCount) * TAU26
                var outerR = minDim * (0.38 + 0.06 * Math.sin(l1T * 3.1 + ai))
                var ax0 = pBeaconMid.x, ay0 = pBeaconMid.y
                ctx.moveTo(ax0, ay0)
                for (var segA = 1; segA <= 4; segA++) {
                    var ufA = segA / 4.0
                    var jag = (segA < 4) ? Math.sin(l1T * 14.0 + ai * 2.7 + segA * 1.9) * (minDim * 0.032) : 0.0
                    var nxA = ax0 + (cx + Math.cos(arcAng) * outerR - ax0) * ufA - Math.sin(arcAng) * jag
                    var nyA = ay0 + (cy + Math.sin(arcAng) * outerR - ay0) * ufA + Math.cos(arcAng) * jag
                    ctx.lineTo(nxA, nyA)
                }
            }
            ctx.stroke()

            ctx.restore()
        }
        } finally {
            ctx.restore()
        }
    }

    // =========================================================================
    // SUB-SYSTEM 2: L1 EQUALISER (Independent ON/OFF — works over ANY L1 Field!)
    // =========================================================================
    if (eqOn) {
        var eqStyle = cfg && cfg.layer1EqStyle !== undefined ? ((Number(cfg.layer1EqStyle) || 0) % ALL_LAYER1_EQ_STYLES.length) : 0
        var eqLayout = cfg && cfg.layer1EqLayout !== undefined ? clamp(Math.round(Number(cfg.layer1EqLayout)), 0, 3) : 0
        var eqBandOrder = cfg && cfg.layer1EqBandOrder !== undefined ? clamp(Math.round(Number(cfg.layer1EqBandOrder)), 0, 2) : 0
        var eqGain = cfg && cfg.layer1EqGain !== undefined ? clamp(Number(cfg.layer1EqGain), 0.20, 1.00) : 0.80
        var eqScale = cfg && cfg.layer1EqScale !== undefined ? clamp(Number(cfg.layer1EqScale), 0.15, 2.25) : 1.0
        var eqSpin = cfg && cfg.layer1EqSpin !== undefined ? clamp(Number(cfg.layer1EqSpin), -2.5, 2.5) : 1.0
        var eqSpinT = state.eqSpinTime !== undefined ? state.eqSpinTime : (l1T * eqSpin)
        var eqSpinDir = eqSpin === 0 ? 0.0 : (eqSpin < 0 ? -1.0 : 1.0)
        var eqDamping = cfg && cfg.layer1EqDamping !== undefined ? ((Number(cfg.layer1EqDamping) || 0) % 3) : 0
        var eqOpac = cfg && cfg.layer1EqOpacity !== undefined ? clamp(Number(cfg.layer1EqOpacity), 0.05, 1.0) : 1.0
        var maxEqH = h * 0.42 * eqScale

        ctx.save()
        ctx.globalAlpha = eqOpac
        ctx.globalCompositeOperation = "source-over"

        // Universal L1 Equaliser Position & Orientation Transform (`eqLayout` 0..3) affecting ALL 24 EQ styles (0..23):
        //   Every EQ style anchors its base/centre relative to `horizonY` pointing UPWARD (`y <= horizonY`) in local space:
        //   0: Bottom ▲ (Up)   — Shift anchor from horizonY down to bottom edge (h * 0.94), pointing UP
        //   1: Mid ▲ (Up)      — Keep anchor at horizonY, pointing UP (identity)
        //   2: Mid ▼ (Down)    — Flip vertically around horizonY to point DOWN
        //   3: Top ▼ (Down)    — Shift anchor to top edge (h * 0.06) and flip vertically to point DOWN
        var isSculptural3D = (eqStyle >= 7 && eqStyle <= 12) || eqStyle === 16 || (eqStyle >= 18 && eqStyle <= 20)
        if (isSculptural3D) {
            // Sculptural 3D EQs (7..12 and 18..20)
            // Anchor directly towards the vertical screen zone defined by `eqLayout` (0: Bottom, 1/2: Middle, 3: Top),
            // roam across horizontal zones within that band, and scale in/out (breathe-style) around their local centre!
            var zoneTargetY = (eqLayout === 0)
                ? (h * 0.78)
                : ((eqLayout === 3) ? (h * 0.22) : (eqLayout === 2 ? (h * 0.54) : (h * 0.46)))
            var localAnchorY = (eqStyle === 10 || eqStyle === 12) ? (horizonY - minDim * 0.22) : (horizonY - minDim * 0.20)
            var wanderScale = clamp(Math.abs(eqSpin), 0.0, 1.0)
            var eqBreathe = (Math.abs(eqSpin) < 0.01)
                ? (0.88 + state.bassSmooth * 0.10)
                : (0.42 + 0.56 * (0.5 + 0.5 * Math.sin(eqSpinT * 0.55 + eqStyle * 0.9)) + state.bassSmooth * 0.10)
            var eqWanderX = (Math.sin(eqSpinT * 0.52 + eqStyle * 0.7) * 0.24 + Math.cos(eqSpinT * 0.29 + eqStyle * 1.3) * 0.08) * w * wanderScale
            var eqWanderY = Math.cos(eqSpinT * 0.44 + eqStyle * 1.1) * (h * 0.065) * wanderScale
            var effEqScale = eqScale * eqBreathe
            ctx.translate(vanishX + eqWanderX, zoneTargetY + eqWanderY)
            ctx.scale(effEqScale, effEqScale)
            ctx.translate(-vanishX, -localAnchorY)
        } else {
            if (eqLayout === 0) {
                ctx.translate(0, h * 0.94 - horizonY)
            } else if (eqLayout === 1) {
                // 1: Mid -> Point Up: anchor stays at horizonY, pointing up (identity)
            } else if (eqLayout === 2) {
                ctx.translate(0, horizonY)
                ctx.scale(1, -1)
                ctx.translate(0, -horizonY)
            } else if (eqLayout === 3) {
                ctx.translate(0, h * 0.06)
                ctx.scale(1, -1)
                ctx.translate(0, -horizonY)
            }

            if (eqStyle === 4 || eqStyle >= 13) {
                var scaleAnchorY = (eqStyle === 4 || eqStyle === 15 || eqStyle === 21 || eqStyle === 22 || eqStyle === 23) ? horizonY : (horizonY - minDim * 0.20)
                ctx.translate(vanishX, scaleAnchorY)
                ctx.scale(eqScale, eqScale)
                ctx.translate(-vanishX, -scaleAnchorY)
            }
        }

        if (eqStyle === 0) {
            // Style 0: Skyline Mountain (Multi-layer neon mountain silhouette + glowing crest)
            for (var mLayer = 1; mLayer >= 0; mLayer--) {
                var layerScale = mLayer === 0 ? 1.0 : 0.62
                ctx.fillStyle = colourWithAlpha(palette[(mLayer * 3 + 2) % palette.length], (0.20 + state.energy * 0.28) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(palette[(mLayer * 2 + 1) % palette.length], (0.72 + state.bass * 0.26) * (1.0 - dim))
                ctx.lineWidth = mLayer === 0 ? 2.4 : 1.5
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var b0 = 0; b0 < 64; b0++) {
                    var idx0 = mapEqBandIndex((b0 + mLayer * 5) & 63, 64, eqBandOrder)
                    var v0 = sampleEqBandValue(state, idx0, eqDamping, eqGain) * layerScale
                    ctx.lineTo((b0 / 63.0) * w, horizonY - v0 * maxEqH)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 1) {
            // Style 1: Hi-Fi Club Spectrum LED Bars & Floating Peak-Hold Bricks
            // (40 columns x 20 discrete horizontal LED bricks, zero unlit socket cages, zero vertical tether lines)
            var barCount = 40
            var segCount1 = 20
            var isEdgeLayout1 = (eqLayout === 0 || eqLayout === 3)
            var maxEqH1 = isEdgeLayout1
                ? Math.min(h * 0.78, Math.max(h * 0.46 * eqScale, maxEqH * 1.10))
                : Math.min(h * 0.42, Math.max(h * 0.35 * eqScale, maxEqH * 0.85))
            var slotW = w / barCount
            var segStepH1 = maxEqH1 / segCount1
            var segBoxH1 = Math.max(1.6, segStepH1 * 0.68)
            var segGap1 = Math.max(0.6, segStepH1 - segBoxH1)
            var capH1 = Math.max(2.2, segBoxH1 * 0.90)
            var palShift1 = Math.floor((state.hueShift || 0) / 48)
            var baseRailCol1 = palette[(0 + palShift1) % palette.length]

            // Per-column audio dynamics with noise-floor gate & expansive valley-to-peak contrast curve
            var colData1 = []
            for (var cIdx1 = 0; cIdx1 < barCount; cIdx1++) {
                var bandIdx1 = mapEqBandIndex(cIdx1, barCount, eqBandOrder)
                var rawV1 = sampleEqBandValue(state, bandIdx1, eqDamping, eqGain)
                var freqTilt1 = 0.90 + 0.28 * (bandIdx1 / 63.0)
                var gatedV1 = Math.max(0.0, rawV1 * freqTilt1 - 0.032)
                var harmWave1 = 0.96 + 0.07 * Math.sin(cIdx1 * 0.42 - eqSpinT * 3.0) + 0.04 * Math.cos(cIdx1 * 0.84 + eqSpinT * 2.0)
                var v1Drive = clamp(Math.pow(gatedV1, 1.16) * (1.28 + state.beatPulse * 0.24) * harmWave1, 0.0, 1.0)
                var litSegs1 = Math.max(1, Math.min(segCount1, 1 + Math.floor(v1Drive * (segCount1 - 0.01))))

                var rawPk1 = Math.max(rawV1, (state.peakBands[bandIdx1] || 0.04) * eqGain * (eqDamping === 0 ? (1.0 + state.beatPulse * 0.24) : 1.0))
                var gatedPk1 = Math.max(0.0, rawPk1 * freqTilt1 - 0.026)
                var pkDrive1 = clamp(Math.pow(gatedPk1, 1.10) * (1.32 + state.beatPulse * 0.20), v1Drive, 1.08)
                var pkSegFloat1 = clamp(Math.max(litSegs1 + 0.85, 1.0 + pkDrive1 * (segCount1 - 0.20)), litSegs1 + 0.85, segCount1 + 1.35)
                var colW1 = slotW * clamp(0.68 + v1Drive * 0.10 + state.beatPulse * 0.03, 0.68, 0.80)
                var colX1 = cIdx1 * slotW + (slotW - colW1) * 0.5
                var peakCapY1 = horizonY - (pkSegFloat1 + 0.85) * segStepH1 + segGap1 * 0.5
                var hitIntensity1 = (v1Drive > 0.52 && (pkSegFloat1 - litSegs1) < 1.25)
                    ? clamp(1.0 - (pkSegFloat1 - litSegs1 - 0.85) * 2.4, 0.0, 1.0)
                    : 0.0
                colData1.push({
                    x: colX1,
                    w: colW1,
                    v: v1Drive,
                    litSegs: litSegs1,
                    pk: pkDrive1,
                    pkSeg: pkSegFloat1,
                    peakY: peakCapY1,
                    hitIntensity: hitIntensity1
                })
            }

            // Pass 1: Sleek Horizon Datum Line
            ctx.strokeStyle = colourWithAlpha(baseRailCol1, (0.62 + state.bassSmooth * 0.22) * (1.0 - dim))
            ctx.lineWidth = 1.6
            ctx.beginPath()
            ctx.moveTo(0, horizonY)
            ctx.lineTo(w, horizonY)
            ctx.stroke()

            // Pass 2: Tight Per-Brick Dark Contrast Backing Pads (lit bricks only — keeps empty air 100% transparent!)
            ctx.fillStyle = "rgba(4, 7, 15, " + (0.80 * (1.0 - dim)).toFixed(3) + ")"
            ctx.beginPath()
            for (var bCol1 = 0; bCol1 < barCount; bCol1++) {
                var cdB1 = colData1[bCol1]
                for (var bSeg1 = 0; bSeg1 < cdB1.litSegs; bSeg1++) {
                    var by1 = horizonY - (bSeg1 + 1) * segStepH1 + segGap1 * 0.5
                    ctx.rect(cdB1.x - 0.6, by1 - 0.4, cdB1.w + 1.2, segBoxH1 + 0.8)
                }
            }
            ctx.fill()

            // Pass 3: 5 Palette-Driven Harmonic Tiers (4 segments per tier: 0..3, 4..7, 8..11, 12..15, 16..19)
            var clubTiers1 = ["#00F59B", "#00E5FF", "#FFB800", "#FF4D00", "#FF0055"]
            for (var tier1 = 0; tier1 < 5; tier1++) {
                var sMin1 = tier1 * 4
                var sMax1 = sMin1 + 3
                var basePal1 = palette[(tier1 + palShift1) % Math.min(6, palette.length)]
                var nextPal1 = palette[(tier1 + 1 + palShift1) % Math.min(6, palette.length)]
                var palBlend1 = (tier1 === 4)
                    ? mixHexColours(basePal1, palette[7 % palette.length] || "#FF0055", 0.35)
                    : mixHexColours(basePal1, nextPal1, 0.22)
                var brickCol1 = mixHexColours(palBlend1, clubTiers1[tier1], 0.32)
                var rimCol1 = mixHexColours(brickCol1, "#ffffff", 0.42)

                // 3A: Soft Atmospheric Outer Glow Halo behind lit bricks
                ctx.strokeStyle = colourWithAlpha(brickCol1, (0.24 + tier1 * 0.05 + state.beatPulse * 0.12) * (1.0 - dim))
                ctx.lineWidth = 2.8 + tier1 * 0.35 + state.bassSmooth * 1.2
                ctx.beginPath()
                for (var biH1 = 0; biH1 < barCount; biH1++) {
                    var cdH1 = colData1[biH1]
                    for (var sgH1 = sMin1; sgH1 <= sMax1 && sgH1 < cdH1.litSegs; sgH1++) {
                        var syH1 = horizonY - (sgH1 + 1) * segStepH1 + segGap1 * 0.5
                        ctx.rect(cdH1.x, syH1, cdH1.w, segBoxH1)
                    }
                }
                ctx.stroke()

                // 3B: Crisp Saturated Chromatic Brick Fill (zero chalky white box borders)
                ctx.fillStyle = colourWithAlpha(brickCol1, (0.95 + state.bass * 0.05) * (1.0 - dim))
                ctx.beginPath()
                for (var biF1 = 0; biF1 < barCount; biF1++) {
                    var cdF1 = colData1[biF1]
                    for (var sgF1 = sMin1; sgF1 <= sMax1 && sgF1 < cdF1.litSegs; sgF1++) {
                        var syF1 = horizonY - (sgF1 + 1) * segStepH1 + segGap1 * 0.5
                        ctx.rect(cdF1.x, syF1, cdF1.w, segBoxH1)
                    }
                }
                ctx.fill()

                // 3C: Subtle Top-Edge Specular Glass Highlight along each brick
                ctx.strokeStyle = colourWithAlpha(rimCol1, (0.72 + tier1 * 0.05) * (1.0 - dim))
                ctx.lineWidth = Math.min(1.2, segBoxH1 * 0.25)
                ctx.beginPath()
                for (var biR1 = 0; biR1 < barCount; biR1++) {
                    var cdR1 = colData1[biR1]
                    for (var sgR1 = sMin1; sgR1 <= sMax1 && sgR1 < cdR1.litSegs; sgR1++) {
                        var syR1 = horizonY - (sgR1 + 1) * segStepH1 + segGap1 * 0.5 + 0.55
                        ctx.moveTo(cdR1.x + 0.7, syR1)
                        ctx.lineTo(cdR1.x + cdR1.w - 0.7, syR1)
                    }
                }
                ctx.stroke()
            }

            // Pass 4: True Floating Peak-Hold Bricks & Horizontal Laser Flares on New Peak Hits
            var pkCol1 = mixHexColours(palette[(5 + palShift1) % palette.length], "#FF0055", 0.42)
            var pkRimCol1 = mixHexColours(pkCol1, "#ffffff", 0.58)

            // Peak-Hold Outer Glow + Contrast Pad
            ctx.fillStyle = "rgba(4, 7, 15, " + (0.82 * (1.0 - dim)).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha(pkCol1, (0.44 + state.beatPulse * 0.28) * (1.0 - dim))
            ctx.lineWidth = 3.0 + state.bassSmooth * 1.2
            ctx.beginPath()
            for (var piH = 0; piH < barCount; piH++) {
                var cdPH = colData1[piH]
                ctx.rect(cdPH.x, cdPH.peakY, cdPH.w, capH1)
            }
            ctx.fill()
            ctx.stroke()

            // Peak-Hold Saturated Brick Fill
            ctx.fillStyle = colourWithAlpha(pkCol1, 0.98 * (1.0 - dim))
            ctx.beginPath()
            for (var pi = 0; pi < barCount; pi++) {
                var cdP = colData1[pi]
                ctx.rect(cdP.x, cdP.peakY, cdP.w, capH1)
            }
            ctx.fill()

            // Peak-Hold Top-Edge Highlight & Horizontal Laser Flare Wings on active peak hits
            ctx.strokeStyle = colourWithAlpha(pkRimCol1, 0.92 * (1.0 - dim))
            ctx.lineWidth = Math.min(1.3, capH1 * 0.32)
            ctx.beginPath()
            for (var piW = 0; piW < barCount; piW++) {
                var cdW = colData1[piW]
                ctx.moveTo(cdW.x + 0.5, cdW.peakY + 0.6)
                ctx.lineTo(cdW.x + cdW.w - 0.5, cdW.peakY + 0.6)
                if (cdW.hitIntensity > 0.05 || cdW.pk > 0.80) {
                    var flareSpan1 = cdW.w * (0.30 + cdW.hitIntensity * 0.55 + state.beatPulse * 0.22)
                    var pkMidY1 = cdW.peakY + capH1 * 0.5
                    ctx.moveTo(cdW.x - flareSpan1, pkMidY1)
                    ctx.lineTo(cdW.x + cdW.w + flareSpan1, pkMidY1)
                }
            }
            ctx.stroke()
        } else if (eqStyle === 2) {
            // Style 2: Twin Mirror LEDs (Anamorphic Horizon Reflection)
            // Upper crisp direct-emission LED bricks + razor horizon seam + lower perspective-fading liquid reflection
            var mBars = 36
            var mSegs = 16
            var mSlot = w / mBars
            var isEdgeLayout2 = (eqLayout === 0 || eqLayout === 3)
            var halfSpan2 = isEdgeLayout2
                ? Math.min(h * 0.38, Math.max(h * 0.24 * eqScale, maxEqH * 0.60))
                : Math.min(h * 0.40, Math.max(h * 0.34 * eqScale, maxEqH * 0.82))
            var mirrorAxisY = isEdgeLayout2
                ? (horizonY - halfSpan2 * 1.08)
                : horizonY
            var mirrorGap = 2.4
            var maxUpH2 = halfSpan2
            var maxDnH2 = halfSpan2 * 0.94
            var mStepUp = maxUpH2 / mSegs
            var mBoxUp = Math.max(1.5, mStepUp * 0.68)
            var mGapUp = Math.max(0.5, mStepUp - mBoxUp)
            var mStepDn = maxDnH2 / mSegs
            var mBoxDn = Math.max(1.3, mStepDn * 0.64)
            var mGapDn = Math.max(0.5, mStepDn - mBoxDn)
            var capUpH2 = Math.max(2.1, mBoxUp * 0.88)
            var capDnH2 = Math.max(1.9, mBoxDn * 0.84)
            var palShift2 = Math.floor((state.hueShift || 0) / 48)
            var axisCol2 = palette[(1 + palShift2) % palette.length]

            // Per-column audio drive with valley-to-peak contrast & anamorphic reflection coordinates
            var colData2 = []
            for (var cIdx2 = 0; cIdx2 < mBars; cIdx2++) {
                var bandIdx2 = mapEqBandIndex(cIdx2, mBars, eqBandOrder)
                var rawV2 = sampleEqBandValue(state, bandIdx2, eqDamping, eqGain)
                var freqTilt2 = 0.90 + 0.28 * (bandIdx2 / 63.0)
                var gatedV2 = Math.max(0.0, rawV2 * freqTilt2 - 0.032)
                var harmWave2 = 0.96 + 0.07 * Math.sin(cIdx2 * 0.38 - eqSpinT * 3.2) + 0.04 * Math.cos(cIdx2 * 0.76 + eqSpinT * 2.1)
                var v2Drive = clamp(Math.pow(gatedV2, 1.16) * (1.28 + state.beatPulse * 0.24) * harmWave2, 0.0, 1.0)
                var litSegs2 = Math.max(1, Math.min(mSegs, 1 + Math.floor(v2Drive * (mSegs - 0.01))))

                var rawPk2 = Math.max(rawV2, (state.peakBands[bandIdx2] || 0.04) * eqGain * (eqDamping === 0 ? (1.0 + state.beatPulse * 0.24) : 1.0))
                var gatedPk2 = Math.max(0.0, rawPk2 * freqTilt2 - 0.026)
                var pkDrive2 = clamp(Math.pow(gatedPk2, 1.10) * (1.32 + state.beatPulse * 0.20), v2Drive, 1.08)
                var pkSegFloat2 = clamp(Math.max(litSegs2 + 0.80, 1.0 + pkDrive2 * (mSegs - 0.20)), litSegs2 + 0.80, mSegs + 1.35)

                var colW2 = mSlot * clamp(0.66 + v2Drive * 0.11 + state.beatPulse * 0.03, 0.66, 0.80)
                var colX2 = cIdx2 * mSlot + (mSlot - colW2) * 0.5
                var peakUpY2 = mirrorAxisY - mirrorGap - (pkSegFloat2 + 0.80) * mStepUp + mGapUp * 0.5
                var peakDnY2 = mirrorAxisY + mirrorGap + (pkSegFloat2 - 0.20) * mStepDn + mGapDn * 0.5
                var pkReflW2 = Math.min(mSlot * 0.94, colW2 * (1.0 + pkSegFloat2 * 0.024))
                var pkRippleX2 = Math.sin(pkSegFloat2 * 0.58 - eqSpinT * 3.6 + cIdx2 * 0.32) * (0.5 + pkSegFloat2 * 0.15)
                var pkReflX2 = colX2 - (pkReflW2 - colW2) * 0.5 + pkRippleX2
                colData2.push({
                    x: colX2,
                    w: colW2,
                    v: v2Drive,
                    litSegs: litSegs2,
                    pk: pkDrive2,
                    pkSeg: pkSegFloat2,
                    peakUpY: peakUpY2,
                    peakDnY: peakDnY2,
                    pkReflX: pkReflX2,
                    pkReflW: pkReflW2
                })
            }

            // Pass 1: Razor-Thin Glowing Horizon Mirror Seam
            ctx.strokeStyle = colourWithAlpha(axisCol2, (0.34 + state.bassSmooth * 0.22) * (1.0 - dim))
            ctx.lineWidth = 3.0 + state.beatPulse * 1.4
            ctx.beginPath()
            ctx.moveTo(0, mirrorAxisY)
            ctx.lineTo(w, mirrorAxisY)
            ctx.stroke()
            ctx.strokeStyle = colourWithAlpha("#ffffff", (0.80 + state.beatPulse * 0.16) * (1.0 - dim))
            ctx.lineWidth = 1.0
            ctx.beginPath()
            ctx.moveTo(0, mirrorAxisY)
            ctx.lineTo(w, mirrorAxisY)
            ctx.stroke()

            // Pass 2: Tight Per-Segment Contrast Backing Pads (Upper Direct-Emission Array Only)
            ctx.fillStyle = "rgba(4, 7, 15, " + (0.76 * (1.0 - dim)).toFixed(3) + ")"
            ctx.beginPath()
            for (var bCol2 = 0; bCol2 < mBars; bCol2++) {
                var cdB2 = colData2[bCol2]
                for (var bSeg2 = 0; bSeg2 < cdB2.litSegs; bSeg2++) {
                    var syUpB = mirrorAxisY - mirrorGap - (bSeg2 + 1) * mStepUp + mGapUp * 0.5
                    ctx.rect(cdB2.x - 0.6, syUpB - 0.4, cdB2.w + 1.2, mBoxUp + 0.8)
                }
            }
            ctx.fill()

            // Pass 3: Lower Anamorphic Perspective-Fading Liquid Reflection Array (batched by row for exact exponential falloff)
            var clubTiers2 = ["#00F59B", "#00E5FF", "#FFB800", "#FF0055"]
            for (var sgr = 0; sgr < mSegs; sgr++) {
                var rTier = Math.min(3, Math.floor(sgr / 4))
                var rBasePal = palette[(rTier + palShift2) % Math.min(6, palette.length)]
                var rNextPal = palette[(rTier + 1 + palShift2) % Math.min(6, palette.length)]
                var colReflRow = mixHexColours(mixHexColours(rBasePal, rNextPal, 0.28), clubTiers2[rTier], 0.30)
                var segFalloff = Math.exp(-sgr * 0.135)
                var rowAlpha = clamp(segFalloff * (0.82 + state.energy * 0.14) * (1.0 - dim), 0.04, 0.90)
                var syDnRow = mirrorAxisY + mirrorGap + sgr * mStepDn + mGapDn * 0.5

                ctx.fillStyle = colourWithAlpha(colReflRow, rowAlpha)
                ctx.strokeStyle = colourWithAlpha(colReflRow, rowAlpha * 0.32)
                ctx.lineWidth = 1.8
                ctx.beginPath()
                var hasRowSegs = false
                for (var mr = 0; mr < mBars; mr++) {
                    var cdMR = colData2[mr]
                    if (sgr < cdMR.litSegs) {
                        hasRowSegs = true
                        var spreadW = Math.min(mSlot * 0.94, cdMR.w * (1.0 + sgr * 0.025 + state.bassSmooth * 0.006 * sgr))
                        var rippleX = Math.sin(sgr * 0.58 - eqSpinT * 3.6 + mr * 0.32) * (0.45 + sgr * 0.15)
                        var rx = cdMR.x - (spreadW - cdMR.w) * 0.5 + rippleX
                        ctx.rect(rx, syDnRow, spreadW, mBoxDn)
                    }
                }
                if (hasRowSegs) {
                    if (sgr < 7) ctx.stroke()
                    ctx.fill()
                }
            }

            // Pass 4: Upper Crisp Direct-Emission LED Array (batched across 4 Harmonic Tiers)
            for (var tier2 = 0; tier2 < 4; tier2++) {
                var sMin2 = tier2 * 4
                var sMax2 = sMin2 + 3
                var uBasePal = palette[(tier2 + palShift2) % Math.min(6, palette.length)]
                var uNextPal = palette[(tier2 + 1 + palShift2) % Math.min(6, palette.length)]
                var uPalBlend = (tier2 === 3)
                    ? mixHexColours(uBasePal, palette[7 % palette.length] || "#FF0055", 0.35)
                    : mixHexColours(uBasePal, uNextPal, 0.22)
                var colUp2 = mixHexColours(uPalBlend, clubTiers2[tier2], 0.32)
                var rimUp2 = mixHexColours(colUp2, "#ffffff", 0.42)

                // 4A. Upper Outer Neon Halo
                ctx.strokeStyle = colourWithAlpha(colUp2, (0.26 + tier2 * 0.06 + state.beatPulse * 0.12) * (1.0 - dim))
                ctx.lineWidth = 2.4 + tier2 * 0.3
                ctx.beginPath()
                for (var miH = 0; miH < mBars; miH++) {
                    var cdMH = colData2[miH]
                    for (var sgMH = sMin2; sgMH <= sMax2 && sgMH < cdMH.litSegs; sgMH++) {
                        var syUpH = mirrorAxisY - mirrorGap - (sgMH + 1) * mStepUp + mGapUp * 0.5
                        ctx.rect(cdMH.x, syUpH, cdMH.w, mBoxUp)
                    }
                }
                ctx.stroke()

                // 4B. Upper Saturated LED Brick Fill
                ctx.fillStyle = colourWithAlpha(colUp2, (0.95 + state.energy * 0.05) * (1.0 - dim))
                ctx.beginPath()
                for (var mi = 0; mi < mBars; mi++) {
                    var cdM = colData2[mi]
                    for (var sg2 = sMin2; sg2 <= sMax2 && sg2 < cdM.litSegs; sg2++) {
                        var sy2 = mirrorAxisY - mirrorGap - (sg2 + 1) * mStepUp + mGapUp * 0.5
                        ctx.rect(cdM.x, sy2, cdM.w, mBoxUp)
                    }
                }
                ctx.fill()

                // 4C. Subtle Top-Edge Specular Highlight
                ctx.strokeStyle = colourWithAlpha(rimUp2, (0.72 + tier2 * 0.05) * (1.0 - dim))
                ctx.lineWidth = Math.min(1.15, mBoxUp * 0.25)
                ctx.beginPath()
                for (var miR = 0; miR < mBars; miR++) {
                    var cdMR2 = colData2[miR]
                    for (var sgR2 = sMin2; sgR2 <= sMax2 && sgR2 < cdMR2.litSegs; sgR2++) {
                        var syR2 = mirrorAxisY - mirrorGap - (sgR2 + 1) * mStepUp + mGapUp * 0.5 + 0.5
                        ctx.moveTo(cdMR2.x + 0.6, syR2)
                        ctx.lineTo(cdMR2.x + cdMR2.w - 0.6, syR2)
                    }
                }
                ctx.stroke()
            }

            // Pass 5: Symmetric Floating Upper & Lower Peak-Hold Bricks
            var pkCol2 = mixHexColours(palette[(5 + palShift2) % palette.length], "#FF0055", 0.42)
            var pkRimCol2 = mixHexColours(pkCol2, "#ffffff", 0.58)

            // Upper Peak-Hold Bricks (Crisp Direct-Emission Cap)
            ctx.fillStyle = "rgba(4, 7, 15, " + (0.80 * (1.0 - dim)).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha(pkCol2, (0.44 + state.beatPulse * 0.28) * (1.0 - dim))
            ctx.lineWidth = 2.8 + state.bassSmooth * 1.1
            ctx.beginPath()
            for (var pi2H = 0; pi2H < mBars; pi2H++) {
                var cd2H = colData2[pi2H]
                ctx.rect(cd2H.x, cd2H.peakUpY, cd2H.w, capUpH2)
            }
            ctx.fill()
            ctx.stroke()

            ctx.fillStyle = colourWithAlpha(pkCol2, 0.98 * (1.0 - dim))
            ctx.beginPath()
            for (var pi2 = 0; pi2 < mBars; pi2++) {
                var cd2 = colData2[pi2]
                ctx.rect(cd2.x, cd2.peakUpY, cd2.w, capUpH2)
            }
            ctx.fill()

            ctx.strokeStyle = colourWithAlpha(pkRimCol2, 0.90 * (1.0 - dim))
            ctx.lineWidth = Math.min(1.2, capUpH2 * 0.30)
            ctx.beginPath()
            for (var pi2W = 0; pi2W < mBars; pi2W++) {
                var cd2W = colData2[pi2W]
                ctx.moveTo(cd2W.x + 0.5, cd2W.peakUpY + 0.55)
                ctx.lineTo(cd2W.x + cd2W.w - 0.5, cd2W.peakUpY + 0.55)
                if (cd2W.pk > 0.80) {
                    var whiskSpan2 = cd2W.w * (0.28 + (cd2W.pk - 0.80) * 1.4 + state.beatPulse * 0.20)
                    var upMidY2 = cd2W.peakUpY + capUpH2 * 0.5
                    ctx.moveTo(cd2W.x - whiskSpan2, upMidY2)
                    ctx.lineTo(cd2W.x + cd2W.w + whiskSpan2, upMidY2)
                }
            }
            ctx.stroke()

            // Lower Reflected Peak-Hold Bricks (Anamorphic Widened, Soft Distance-Attenuated Ghost Cap)
            ctx.fillStyle = colourWithAlpha(pkCol2, (0.48 + state.beatPulse * 0.16) * (1.0 - dim))
            ctx.strokeStyle = colourWithAlpha(pkCol2, 0.28 * (1.0 - dim))
            ctx.lineWidth = 1.6
            ctx.beginPath()
            for (var pi2Dn = 0; pi2Dn < mBars; pi2Dn++) {
                var cd2Dn = colData2[pi2Dn]
                ctx.rect(cd2Dn.pkReflX, cd2Dn.peakDnY, cd2Dn.pkReflW, capDnH2)
            }
            ctx.stroke()
            ctx.fill()
        } else if (eqStyle === 3) {
            // Style 3: 3D Waterfall Ridges — Joy Division / Plexamp 3D Pulsar Spectrum Ridges
            var ridgeHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var ridgeCount = 16
            var binCount3 = 36
            var worldRidgeStep = Math.floor(eqSpinT * 2.8)
            var zPhase = (((eqSpinT * 2.8) % 1.0) + 1.0) % 1.0

            // Render back-to-front (from distant depthSlot=0 down to foreground at horizonY at depthSlot=ridgeCount-1)
            for (var depthSlot = 0; depthSlot < ridgeCount; depthSlot++) {
                var uDepth = clamp((depthSlot + zPhase) / ridgeCount, 0.01, 0.999)
                var histIdx = eqSpinDir >= 0
                    ? Math.min((ridgeHist ? ridgeHist.length : 1) - 1, depthSlot)
                    : Math.min((ridgeHist ? ridgeHist.length : 1) - 1, (ridgeCount - 1) - depthSlot)
                var sliceObj = ridgeHist ? ridgeHist[histIdx] : null
                var worldId = sliceObj && sliceObj.stepIdx !== undefined
                    ? sliceObj.stepIdx
                    : (worldRidgeStep - (eqSpinDir >= 0 ? depthSlot : -depthSlot))

                // Perspective depth mapping (`z` from 3.4 at far ridge to 0.45 at foreground `horizonY`)
                var zDist = lerp(3.4, 0.45, uDepth)
                var persp = 1.0 / zDist
                var perspNorm = clamp((persp - (1.0 / 3.4)) / ((1.0 / 0.45) - (1.0 / 3.4)), 0.0, 1.0)
                var ridgeBaseY = horizonY - h * 0.22 * (1.0 - perspNorm)
                var ridgeW = w * lerp(0.34, 1.16, Math.pow(perspNorm, 0.78))
                var leftXEq = vanishX - ridgeW * 0.5
                var edgeFade = Math.sin(uDepth * Math.PI)

                var curCoords = []
                for (var sb3 = 0; sb3 < binCount3; sb3++) {
                    var uBin = sb3 / (binCount3 - 1)
                    var bMapped3 = mapEqBandIndex(sb3, binCount3, eqBandOrder)
                    var bin36Idx = Math.min(35, Math.floor((bMapped3 / 63.0) * 35))
                    var rawVal = sliceObj && sliceObj.bins ? (sliceObj.bins[bin36Idx] || 0.05) : (state.smoothBands[bMapped3] || 0.05)
                    var pulsarEnv = 0.42 + 0.58 * Math.pow(Math.sin(uBin * Math.PI), 0.65)
                    var ripple3D = 0.88 + 0.16 * Math.sin(uBin * 12.0 + worldId * 0.7)
                    var bv3 = rawVal * eqGain * pulsarEnv * ripple3D * (0.45 + 0.85 * perspNorm)
                    var rx = leftXEq + uBin * ridgeW
                    var ry = ridgeBaseY - bv3 * maxEqH * 0.68
                    curCoords.push({ x: rx, y: ry })
                }

                var ridgeColIdx = (((worldId + Math.floor((state.hueShift || 0) / 30)) % palette.length) + palette.length) % palette.length
                var ridgeCol = palette[ridgeColIdx]
                ctx.fillStyle = colourWithAlpha("#060812", (0.58 + 0.28 * perspNorm) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(ridgeCol, clamp((0.35 + 0.65 * perspNorm) * (0.35 + 0.65 * edgeFade) * (1.0 - dim), 0.08, 1.0))
                ctx.lineWidth = 1.2 + 1.8 * perspNorm
                ctx.beginPath()
                ctx.moveTo(leftXEq, ridgeBaseY)
                for (var ptIdx = 0; ptIdx < binCount3; ptIdx++) {
                    ctx.lineTo(curCoords[ptIdx].x, curCoords[ptIdx].y)
                }
                ctx.lineTo(leftXEq + ridgeW, ridgeBaseY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 4) {
            // Style 4: Sun Rays — Clean Open Sun Horizon & Colour-Adaptive Radial Equaliser Corona Rays
            var sunR = minDim * (0.20 + state.bass * 0.05)
            var rayCount = 44
            var palShiftSun = Math.floor((state.hueShift || 0) / 45)
            ctx.lineWidth = 2.2 + state.bass * 1.4

            // Subtle upper horizon sun rim arc
            ctx.strokeStyle = colourWithAlpha(palette[(1 + palShiftSun) % palette.length], (0.42 + state.bass * 0.24) * (1.0 - dim))
            ctx.beginPath()
            ctx.arc(vanishX, horizonY, sunR * 0.94, Math.PI, Math.PI * 2)
            ctx.stroke()

            var numRayBuckets = 4
            for (var rBucket = 0; rBucket < numRayBuckets; rBucket++) {
                var baseCol = palette[(1 + palShiftSun) % palette.length]
                var adjCol = palette[(1 + rBucket + palShiftSun) % palette.length]
                var rayCol = mixHexColours(baseCol, adjCol, 0.16 * rBucket)
                ctx.strokeStyle = colourWithAlpha(rayCol, (0.80 + state.beatPulse * 0.20) * (1.0 - dim))
                ctx.beginPath()
                for (var ryIdx = rBucket; ryIdx <= rayCount; ryIdx += numRayBuckets) {
                    var rAng = Math.PI + (ryIdx / rayCount) * Math.PI
                    var bIdx4 = mapEqBandIndex(ryIdx, rayCount + 1, eqBandOrder)
                    var v4 = sampleEqBandValue(state, bIdx4, eqDamping, eqGain)
                    var rInner = sunR * 0.95
                    var rOuter = sunR + v4 * maxEqH * 0.85
                    ctx.moveTo(vanishX + Math.cos(rAng) * rInner, horizonY + Math.sin(rAng) * rInner)
                    ctx.lineTo(vanishX + Math.cos(rAng) * rOuter, horizonY + Math.sin(rAng) * rOuter)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 5) {
            // Style 5: Centre-Symmetric Twin Wave Ribbon (respecting eqBandOrder)
            for (var wingPass = 0; wingPass < 3; wingPass++) {
                ctx.strokeStyle = colourWithAlpha(palette[(wingPass * 3) % palette.length], (0.75 - wingPass * 0.15) * (1.0 - dim))
                ctx.fillStyle = colourWithAlpha(palette[(wingPass * 3 + 1) % palette.length], 0.14 * (1.0 - dim))
                ctx.lineWidth = 2.4 - wingPass * 0.5
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var cw = 0; cw < 64; cw++) {
                    var distC = Math.abs((cw / 63.0) - 0.5) * 2.0
                    var cBand = mapEqBandIndex(cw, 64, eqBandOrder === 0 ? 1 : (eqBandOrder === 1 ? 0 : 2))
                    var cv = sampleEqBandValue(state, cBand, eqDamping, eqGain) * (1.0 - wingPass * 0.22)
                    var harmMod = Math.sin(cw * 0.35 + eqSpinT * 1.4 + wingPass) * 0.15 + 0.85
                    var wy5 = horizonY - cv * maxEqH * harmMod * (1.0 - distC * 0.25)
                    ctx.lineTo((cw / 63.0) * w, wy5)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 6) {
            // Style 6: Architectural Ground-Mounted Sky-Tracker Searchlights (Full-Extent Volumetric Beams & Solid Pivoting Projector Units — Zero Airborne Objects)
            var spotCount = 8
            var effSpotScale6 = clamp(eqScale, 0.45, 1.65)
            // Project beams all the way past the display extents so they never terminate inside the viewport
            var fullExtentReach = Math.hypot(w, h) * 1.35 * effSpotScale6
            var palShiftSpot = Math.floor((state.hueShift || 0) / 45)
            var hasGrad = typeof ctx.createLinearGradient === "function"
            var activeBeams6 = []

            for (var sp = 0; sp < spotCount; sp++) {
                var uSp = (sp + 0.5) / spotCount
                var wingSign = uSp < 0.5 ? -1.0 : 1.0
                var wingU = Math.abs(uSp - 0.5) * 2.0
                var baseX = vanishX + (uSp - 0.5) * w * 0.88
                var baseY = horizonY
                var bIdx6 = mapEqBandIndex(sp, spotCount, eqBandOrder)
                var v6 = clamp(sampleEqBandValue(state, bIdx6, eqDamping, eqGain), 0.08, 1.55)
                var spotCol = palette[(sp * 2 + palShiftSpot) % palette.length]
                var coreCol = palette[(sp * 2 + 2 + palShiftSpot) % palette.length]

                // Coordinated sky-scanning choreography: sweeping, crossing, and tracking across the open sky
                var sweepPhase = eqSpinT * (0.62 + (sp % 3) * 0.16) + sp * 1.15
                var crossBias = -wingSign * (0.16 + wingU * 0.30) * Math.cos(eqSpinT * 0.46)
                var trackerSweep = Math.sin(sweepPhase) * 0.48
                                 + Math.cos(eqSpinT * 0.92 - sp * 1.65) * 0.18 * (0.55 + state.bassSmooth * 0.45)
                                 + Math.sin(eqSpinT * 1.45 + sp * 0.85) * 0.08 * state.midSmooth
                var tilt = clamp(crossBias + trackerSweep, -0.82, 0.82)
                var dirX = Math.sin(tilt)
                var dirY = -Math.cos(tilt)
                var nx = Math.cos(tilt)
                var ny = Math.sin(tilt)

                var pedW6 = Math.max(9.0, w * 0.0125) * clamp(effSpotScale6, 0.75, 1.35)
                var pedH6 = Math.max(7.5, h * 0.0155) * clamp(effSpotScale6, 0.75, 1.35)
                var pivotX = baseX
                var pivotY = baseY - pedH6 * 0.68
                var barrelLen = pedH6 * 1.55
                var lensX = pivotX + dirX * (barrelLen * 0.55)
                var lensY = pivotY + dirY * (barrelLen * 0.55)

                var reach = fullExtentReach * (0.95 + Math.min(1.3, v6) * 0.25 + state.beatPulse * 0.12)
                var topX = lensX + dirX * reach
                var topY = lensY + dirY * reach
                var baseHalfW = Math.max(3.2, pedW6 * 0.44)
                var topHalfW = w * (0.042 + Math.min(1.4, v6) * 0.048 + state.bassSmooth * 0.018)

                activeBeams6.push({
                    x0: lensX, y0: lensY, x1: topX, y1: topY,
                    pivotX: pivotX, pivotY: pivotY, baseX: baseX, baseY: baseY,
                    pedW: pedW6, pedH: pedH6, barrelLen: barrelLen,
                    dirX: dirX, dirY: dirY, nx: nx, ny: ny,
                    reach: reach, baseHalfW: baseHalfW, topHalfW: topHalfW,
                    v: v6, col: spotCol, coreCol: coreCol, sp: sp
                })

                // 1A. Wide Outer Atmospheric Tyndall Scatter Cone extending past viewport extents
                var outerTopW = topHalfW * 1.48
                var outerBaseW = baseHalfW * 1.18
                if (hasGrad) {
                    var outerGrad = ctx.createLinearGradient(lensX, lensY, topX, topY)
                    outerGrad.addColorStop(0.0, colourWithAlpha(spotCol, clamp((0.24 + v6 * 0.20) * (1.0 - dim), 0.0, 0.55)))
                    outerGrad.addColorStop(0.45, colourWithAlpha(coreCol, clamp((0.14 + v6 * 0.14) * (1.0 - dim), 0.0, 0.38)))
                    outerGrad.addColorStop(1.0, colourWithAlpha(spotCol, 0.02 * (1.0 - dim)))
                    ctx.fillStyle = outerGrad
                } else {
                    ctx.fillStyle = colourWithAlpha(spotCol, (0.14 + v6 * 0.12) * (1.0 - dim))
                }
                ctx.beginPath()
                ctx.moveTo(lensX - nx * outerBaseW, lensY - ny * outerBaseW)
                ctx.lineTo(topX - nx * outerTopW, topY - ny * outerTopW)
                ctx.lineTo(topX + nx * outerTopW, topY + ny * outerTopW)
                ctx.lineTo(lensX + nx * outerBaseW, lensY + ny * outerBaseW)
                ctx.closePath()
                ctx.fill()

                // 1B. Primary Collimated High-Intensity Searchlight Beam Cone reaching all the way to the viewport extents
                if (hasGrad) {
                    var mainGrad = ctx.createLinearGradient(lensX, lensY, topX, topY)
                    mainGrad.addColorStop(0.0, colourWithAlpha("#ffffff", clamp((0.68 + v6 * 0.28) * (1.0 - dim), 0.0, 0.96)))
                    mainGrad.addColorStop(0.16, colourWithAlpha(spotCol, clamp((0.46 + v6 * 0.30) * (1.0 - dim), 0.0, 0.88)))
                    mainGrad.addColorStop(0.65, colourWithAlpha(coreCol, clamp((0.24 + v6 * 0.22) * (1.0 - dim), 0.0, 0.65)))
                    mainGrad.addColorStop(1.0, colourWithAlpha(spotCol, clamp((0.10 + v6 * 0.12) * (1.0 - dim), 0.0, 0.35)))
                    ctx.fillStyle = mainGrad
                } else {
                    ctx.fillStyle = colourWithAlpha(spotCol, (0.30 + v6 * 0.22) * (1.0 - dim))
                }
                ctx.beginPath()
                ctx.moveTo(lensX - nx * baseHalfW, lensY - ny * baseHalfW)
                ctx.lineTo(topX - nx * topHalfW, topY - ny * topHalfW)
                ctx.lineTo(topX + nx * topHalfW, topY + ny * topHalfW)
                ctx.lineTo(lensX + nx * baseHalfW, lensY + ny * baseHalfW)
                ctx.closePath()
                ctx.fill()

                // 1C. Crisp Lateral Beam Boundary Rays + Internal Volumetric Shimmer Filaments + White-Hot Xenon Core Ray
                ctx.strokeStyle = colourWithAlpha(spotCol, clamp((0.52 + v6 * 0.36) * (1.0 - dim), 0.14, 0.94))
                ctx.lineWidth = 1.15 + v6 * 0.65
                ctx.beginPath()
                ctx.moveTo(lensX - nx * baseHalfW, lensY - ny * baseHalfW)
                ctx.lineTo(topX - nx * topHalfW * 0.94, topY - ny * topHalfW * 0.94)
                ctx.moveTo(lensX + nx * baseHalfW, lensY + ny * baseHalfW)
                ctx.lineTo(topX + nx * topHalfW * 0.94, topY + ny * topHalfW * 0.94)
                for (var fil = -1; fil <= 1; fil += 2) {
                    var filBias = fil * 0.38 * Math.sin(eqSpinT * 2.1 + sp * 1.3 + fil)
                    ctx.moveTo(lensX + nx * baseHalfW * filBias, lensY + ny * baseHalfW * filBias)
                    ctx.lineTo(topX + nx * topHalfW * filBias, topY + ny * topHalfW * filBias)
                }
                ctx.stroke()

                ctx.strokeStyle = colourWithAlpha("#ffffff", clamp((0.72 + v6 * 0.26) * (1.0 - dim), 0.18, 0.98))
                ctx.lineWidth = 1.45 + v6 * 1.15 + state.beatPulse * 0.65
                ctx.beginPath()
                ctx.moveTo(lensX, lensY)
                ctx.lineTo(topX, topY)
                ctx.stroke()
            }

            // 2. Volumetric Mid-Air Cross-Beam Intersection Bloom (pure light-on-air atmospheric scatter where two beams cross)
            for (var bA = 0; bA < activeBeams6.length; bA++) {
                var bmA = activeBeams6[bA]
                for (var bB = bA + 1; bB < activeBeams6.length; bB++) {
                    var bmB = activeBeams6[bB]
                    var denomCross = bmA.dirX * bmB.dirY - bmA.dirY * bmB.dirX
                    if (Math.abs(denomCross) < 0.08) continue
                    var dxAB = bmB.x0 - bmA.x0
                    var dyAB = bmB.y0 - bmA.y0
                    var tA = (dxAB * bmB.dirY - dyAB * bmB.dirX) / denomCross
                    var tB = (dxAB * bmA.dirY - dyAB * bmA.dirX) / denomCross
                    if (tA > minDim * 0.08 && tB > minDim * 0.08 && tA < bmA.reach * 0.85 && tB < bmB.reach * 0.85) {
                        var ix = bmA.x0 + bmA.dirX * tA
                        var iy = bmA.y0 + bmA.dirY * tA
                        if (ix >= -w * 0.1 && ix <= w * 1.1 && iy >= -h * 0.1 && iy <= h * 1.1) {
                            var crossEnergy = clamp((bmA.v + bmB.v) * 0.5, 0.1, 1.4)
                            var crossW = lerp(bmA.baseHalfW, bmA.topHalfW, clamp(tA / bmA.reach, 0.0, 1.0)) * 0.85
                            ctx.fillStyle = colourWithAlpha("#ffffff", clamp((0.08 + crossEnergy * 0.10) * (1.0 - dim), 0.03, 0.26))
                            ctx.beginPath()
                            ctx.moveTo(ix, iy - crossW * 1.35)
                            ctx.lineTo(ix + crossW * 0.95, iy)
                            ctx.lineTo(ix, iy + crossW * 1.35)
                            ctx.lineTo(ix - crossW * 0.95, iy)
                            ctx.closePath()
                            ctx.fill()
                        }
                    }
                }
            }

            // 3. Solid Architectural Ground-Mounted Searchlight Projector Units at the Bottom (Armoured Base, U-Frame Yoke & Pivoting Drum Barrel)
            for (var spU = 0; spU < activeBeams6.length; spU++) {
                var bmU = activeBeams6[spU]
                var bxU = bmU.baseX, byU = bmU.baseY
                var pWU = bmU.pedW, pHU = bmU.pedH
                var pvX = bmU.pivotX, pvY = bmU.pivotY
                var dXU = bmU.dirX, dYU = bmU.dirY
                var nXU = bmU.nx, nYU = bmU.ny
                var bLenU = bmU.barrelLen
                var drumHalfW = pWU * 0.52

                // 3A. Pivoting Cylindrical Searchlight Drum Housing aligned dynamically with beam direction (dirX, dirY)
                var rearX = pvX - dXU * (bLenU * 0.45)
                var rearY = pvY - dYU * (bLenU * 0.45)
                var frontX = bmU.x0
                var frontY = bmU.y0
                ctx.fillStyle = "rgba(10, 15, 28, " + (0.96 * (1.0 - dim * 0.5)).toFixed(3) + ")"
                ctx.strokeStyle = colourWithAlpha(bmU.col, (0.90 + bmU.v * 0.10) * (1.0 - dim))
                ctx.lineWidth = 1.65
                ctx.beginPath()
                ctx.moveTo(rearX - nXU * drumHalfW * 0.82, rearY - nYU * drumHalfW * 0.82)
                ctx.lineTo(frontX - nXU * drumHalfW * 1.08, frontY - nYU * drumHalfW * 1.08)
                ctx.lineTo(frontX + nXU * drumHalfW * 1.08, frontY + nYU * drumHalfW * 1.08)
                ctx.lineTo(rearX + nXU * drumHalfW * 0.82, rearY + nYU * drumHalfW * 0.82)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()

                // Cooling fins across the searchlight drum barrel
                ctx.strokeStyle = colourWithAlpha(bmU.coreCol, 0.58 * (1.0 - dim))
                ctx.lineWidth = 1.1
                ctx.beginPath()
                for (var fn = 1; fn <= 2; fn++) {
                    var fu = fn / 3.0
                    var fxC = lerp(rearX, frontX, fu)
                    var fyC = lerp(rearY, frontY, fu)
                    var fwC = drumHalfW * lerp(0.84, 1.04, fu)
                    ctx.moveTo(fxC - nXU * fwC, fyC - nYU * fwC)
                    ctx.lineTo(fxC + nXU * fwC, fyC + nYU * fwC)
                }
                ctx.stroke()

                // Glowing parabolic xenon aperture lens rim at the front of the pivoting drum
                ctx.fillStyle = "#ffffff"
                ctx.strokeStyle = colourWithAlpha(bmU.coreCol, 0.95 * (1.0 - dim))
                ctx.lineWidth = 1.8
                ctx.beginPath()
                ctx.moveTo(frontX - nXU * drumHalfW * 1.06, frontY - nYU * drumHalfW * 1.06)
                ctx.lineTo(frontX + nXU * drumHalfW * 1.06, frontY + nYU * drumHalfW * 1.06)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(frontX, frontY, Math.max(2.4, drumHalfW * 0.42 + bmU.v * 1.4), 0, Math.PI * 2.0)
                ctx.fill()

                // 3B. Heavy-Duty U-Frame Gimbal Trunnion Yoke Arms cradling the drum pivot
                ctx.strokeStyle = colourWithAlpha(bmU.col, 0.88 * (1.0 - dim))
                ctx.lineWidth = 2.0
                ctx.beginPath()
                ctx.moveTo(bxU - pWU * 0.68, byU - pHU * 0.18)
                ctx.lineTo(bxU - pWU * 0.68, pvY)
                ctx.lineTo(pvX, pvY)
                ctx.lineTo(bxU + pWU * 0.68, pvY)
                ctx.lineTo(bxU + pWU * 0.68, byU - pHU * 0.18)
                ctx.stroke()

                // 3C. Solid Bevelled Architectural Concrete/Steel Anchor Plinth at baseY
                ctx.fillStyle = "rgba(7, 10, 20, " + (0.96 * (1.0 - dim * 0.5)).toFixed(3) + ")"
                ctx.strokeStyle = colourWithAlpha(bmU.col, 0.92 * (1.0 - dim))
                ctx.lineWidth = 1.6
                ctx.beginPath()
                ctx.moveTo(bxU - pWU * 1.25, byU + pHU * 0.52)
                ctx.lineTo(bxU + pWU * 1.25, byU + pHU * 0.52)
                ctx.lineTo(bxU + pWU * 0.86, byU - pHU * 0.22)
                ctx.lineTo(bxU - pWU * 0.86, byU - pHU * 0.22)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()

                // Illuminated power indicator bar on the base plinth
                ctx.fillStyle = colourWithAlpha(bmU.coreCol, clamp((0.65 + bmU.v * 0.35) * (1.0 - dim), 0.2, 1.0))
                ctx.fillRect(bxU - pWU * 0.55, byU + pHU * 0.08, pWU * 1.10, Math.max(2.0, pHU * 0.20))
            }
        } else if (eqStyle === 7) {
            // Style 7: 3D Sonic Orb — Slowly Revolving 3-Axis 3D Sphere Wrapped in 16×8 Extruded Segmented Hardware LED Level Tiles
            var orbCX = vanishX
            var orbCY = horizonY - minDim * 0.20
            var orbScale = minDim * (0.165 + state.bassSmooth * 0.022)
            // Continuous 3-axis 360° 3D revolution so poles, equator, and radial extrusions are seen from every angle
            var orbRx = eqSpinT * 0.36
            var orbRy = eqSpinT * 0.54
            var orbRz = eqSpinT * 0.22
            var orbFov = 4.6
            var lonCols = 16
            var latTiers = 8

            // 1. Solid dark matte hardware chassis sphere + 3D revolving equatorial & polar gimbal rings
            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.45, 0.82).toFixed(3) + ")"
            ctx.beginPath()
            ctx.arc(orbCX, orbCY, orbScale * 1.02, 0, Math.PI * 2)
            ctx.fill()

            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.44 * (1.0 - dim))
            ctx.lineWidth = 1.5
            ctx.beginPath()
            for (var grRing = 0; grRing < 2; grRing++) {
                for (var gs7 = 0; gs7 <= 28; gs7++) {
                    var ga7 = (gs7 / 28.0) * Math.PI * 2.0
                    var gx7 = grRing === 0 ? Math.cos(ga7) * 1.12 : 0.0
                    var gy7 = grRing === 0 ? 0.0 : Math.sin(ga7) * 1.12
                    var gz7 = grRing === 0 ? Math.sin(ga7) * 1.12 : Math.cos(ga7) * 1.12
                    var gp7 = project3DPoint(gx7, gy7, gz7, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    if (gs7 === 0) ctx.moveTo(gp7.x, gp7.y)
                    else ctx.lineTo(gp7.x, gp7.y)
                }
            }
            ctx.stroke()

            // Sample and spatially smooth 16 longitude frequency columns
            var rawColVals = []
            for (var cS = 0; cS < lonCols; cS++) {
                var bIdx7 = mapEqBandIndex(cS, lonCols, eqBandOrder)
                rawColVals.push(clamp(sampleEqBandValue(state, bIdx7, eqDamping, eqGain), 0.04, 1.15))
            }
            var smoothColVals = []
            for (var cSm = 0; cSm < lonCols; cSm++) {
                var prevV = rawColVals[(cSm + lonCols - 1) % lonCols]
                var curV = rawColVals[cSm]
                var nextV = rawColVals[(cSm + 1) % lonCols]
                smoothColVals.push(0.25 * prevV + 0.50 * curV + 0.25 * nextV)
            }

            // 2. Render discrete 3D spherical LED tiles with radial 3D extrusion on lit frequency tiers
            var unlitBuckets = []
            var litBuckets = [[], [], [], []] // 0: Emerald low, 1: Cyan mid-low, 2: Amber mid-high, 3: Crimson peak
            var ledCols7 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var cLon = 0; cLon < lonCols; cLon++) {
                var theta0 = ((cLon + 0.14) / lonCols) * Math.PI * 2.0
                var theta1 = ((cLon + 0.86) / lonCols) * Math.PI * 2.0
                var thetaMid = (theta0 + theta1) * 0.5
                var colLevel = clamp(smoothColVals[cLon] * 1.05, 0.08, 1.0)
                var litTierCount = Math.max(1, Math.min(latTiers, Math.round(colLevel * latTiers)))

                for (var rTier = 0; rTier < latTiers; rTier++) {
                    var u0 = (rTier + 0.14) / latTiers
                    var u1 = (rTier + 0.86) / latTiers
                    var phi0 = (0.5 - u0) * Math.PI * 0.84
                    var phi1 = (0.5 - u1) * Math.PI * 0.84
                    var phiMid = (phi0 + phi1) * 0.5
                    var isLit7 = (rTier < litTierCount)
                    var rRad = isLit7 ? (1.0 + colLevel * 0.18 + (rTier / latTiers) * 0.08) : 1.0

                    var cMid = project3DPoint(
                        Math.cos(phiMid) * Math.cos(thetaMid) * rRad,
                        Math.sin(phiMid) * rRad,
                        Math.cos(phiMid) * Math.sin(thetaMid) * rRad,
                        orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov
                    )
                    if (cMid.z < -0.05) continue

                    var p00 = project3DPoint(Math.cos(phi0) * Math.cos(theta0) * rRad, Math.sin(phi0) * rRad, Math.cos(phi0) * Math.sin(theta0) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p01 = project3DPoint(Math.cos(phi0) * Math.cos(theta1) * rRad, Math.sin(phi0) * rRad, Math.cos(phi0) * Math.sin(theta1) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p11 = project3DPoint(Math.cos(phi1) * Math.cos(theta1) * rRad, Math.sin(phi1) * rRad, Math.cos(phi1) * Math.sin(theta1) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)
                    var p10 = project3DPoint(Math.cos(phi1) * Math.cos(theta0) * rRad, Math.sin(phi1) * rRad, Math.cos(phi1) * Math.sin(theta0) * rRad, orbRx, orbRy, orbRz, orbCX, orbCY, orbScale, orbFov)

                    var quad = { p00: p00, p01: p01, p11: p11, p10: p10 }
                    if (isLit7) {
                        var tierBucket = rTier < 3 ? 0 : (rTier < 5 ? 1 : (rTier < 7 ? 2 : 3))
                        litBuckets[tierBucket].push(quad)
                    } else {
                        unlitBuckets.push(quad)
                    }
                }
            }

            // Draw unlit recessed LED sockets on the sphere
            if (unlitBuckets.length > 0) {
                ctx.fillStyle = "rgba(18, 28, 44, " + (0.52 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(40, 62, 92, " + (0.38 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var ui = 0; ui < unlitBuckets.length; ui++) {
                    var uq = unlitBuckets[ui]
                    ctx.moveTo(uq.p00.x, uq.p00.y)
                    ctx.lineTo(uq.p01.x, uq.p01.y)
                    ctx.lineTo(uq.p11.x, uq.p11.y)
                    ctx.lineTo(uq.p10.x, uq.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            // Draw lit hardware LED tiers (Emerald -> Cyan -> Amber -> Crimson Peak)
            for (var lb = 0; lb < 4; lb++) {
                var bList = litBuckets[lb]
                if (bList.length === 0) continue
                var ledHex = ledCols7[lb]
                ctx.fillStyle = colourWithAlpha(ledHex, (0.82 + state.bassSmooth * 0.16) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.55 + lb * 0.12) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var li = 0; li < bList.length; li++) {
                    var lq = bList[li]
                    ctx.moveTo(lq.p00.x, lq.p00.y)
                    ctx.lineTo(lq.p01.x, lq.p01.y)
                    ctx.lineTo(lq.p11.x, lq.p11.y)
                    ctx.lineTo(lq.p10.x, lq.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 8) {
            // Style 8: 3D Torus Reactor — Slowly 3D-Tumbling Circular Segmented LED VU-Meter Torus Ring
            var torCX = vanishX
            var torCY = horizonY - minDim * 0.20
            var torScale = minDim * (0.22 + state.bassSmooth * 0.025)
            // Continuous 3-axis 3D revolution so the torus flips smoothly through edge-on, angled, and face-on perspectives
            var torRx = eqSpinT * 0.38
            var torRy = eqSpinT * 0.52
            var torRz = eqSpinT * 0.24
            var torFov = 4.2
            var radialCols = 24
            var ringTiers = 6
            var rInner = 0.44
            var rOuter = 1.24

            // 1. Solid dark matte 3D torus chassis ring (occluding background lines between rInner and rOuter)
            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.45, 0.82).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.42 * (1.0 - dim))
            ctx.lineWidth = 1.5
            for (var cSeg = 0; cSeg < radialCols; cSeg++) {
                var a0 = (cSeg / radialCols) * Math.PI * 2.0
                var a1 = ((cSeg + 1) / radialCols) * Math.PI * 2.0
                var cIn0 = project3DPoint(Math.cos(a0) * rInner, 0.0, Math.sin(a0) * rInner, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cIn1 = project3DPoint(Math.cos(a1) * rInner, 0.0, Math.sin(a1) * rInner, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cOut1 = project3DPoint(Math.cos(a1) * rOuter, 0.0, Math.sin(a1) * rOuter, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                var cOut0 = project3DPoint(Math.cos(a0) * rOuter, 0.0, Math.sin(a0) * rOuter, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                ctx.beginPath()
                ctx.moveTo(cIn0.x, cIn0.y)
                ctx.lineTo(cIn1.x, cIn1.y)
                ctx.lineTo(cOut1.x, cOut1.y)
                ctx.lineTo(cOut0.x, cOut0.y)
                ctx.closePath()
                ctx.fill()
            }

            // 2. Render 24 radial columns × 6 concentric 3D LED level segments with 3D poloidal tube arch
            var unlitTorus = []
            var litTorus = [[], [], [], []]
            var ledCols8 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var uIdx = 0; uIdx < radialCols; uIdx++) {
                var bIdx8 = mapEqBandIndex(uIdx, radialCols, eqBandOrder)
                var v8 = clamp(sampleEqBandValue(state, bIdx8, eqDamping, eqGain) * 1.10, 0.06, 1.0)
                var litRings = Math.max(1, Math.min(ringTiers, Math.round(v8 * ringTiers)))
                var uAng0 = ((uIdx + 0.14) / radialCols) * Math.PI * 2.0
                var uAng1 = ((uIdx + 0.86) / radialCols) * Math.PI * 2.0
                var cos0 = Math.cos(uAng0), sin0 = Math.sin(uAng0)
                var cos1 = Math.cos(uAng1), sin1 = Math.sin(uAng1)

                for (var rt = 0; rt < ringTiers; rt++) {
                    var t0 = (rt + 0.14) / ringTiers
                    var t1 = (rt + 0.86) / ringTiers
                    var rad0 = lerp(rInner + 0.04, rOuter - 0.04, t0)
                    var rad1 = lerp(rInner + 0.04, rOuter - 0.04, t1)
                    // 3D poloidal torus arch elevation boosted by audio energy
                    var archBoost = (rt < litRings) ? (0.22 + v8 * 0.16) : 0.14
                    var archY0 = -archBoost * Math.sin(t0 * Math.PI)
                    var archY1 = -archBoost * Math.sin(t1 * Math.PI)

                    var tp00 = project3DPoint(cos0 * rad0, archY0, sin0 * rad0, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp01 = project3DPoint(cos1 * rad0, archY0, sin1 * rad0, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp11 = project3DPoint(cos1 * rad1, archY1, sin1 * rad1, torRx, torRy, torRz, torCX, torCY, torScale, torFov)
                    var tp10 = project3DPoint(cos0 * rad1, archY1, sin0 * rad1, torRx, torRy, torRz, torCX, torCY, torScale, torFov)

                    var tQuad = { p00: tp00, p01: tp01, p11: tp11, p10: tp10 }
                    if (rt < litRings) {
                        var tb8 = rt < 2 ? 0 : (rt < 4 ? 1 : (rt < 5 ? 2 : 3))
                        litTorus[tb8].push(tQuad)
                    } else {
                        unlitTorus.push(tQuad)
                    }
                }
            }

            if (unlitTorus.length > 0) {
                ctx.fillStyle = "rgba(18, 26, 40, " + (0.55 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(42, 60, 88, " + (0.35 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var ut = 0; ut < unlitTorus.length; ut++) {
                    var qU = unlitTorus[ut]
                    ctx.moveTo(qU.p00.x, qU.p00.y)
                    ctx.lineTo(qU.p01.x, qU.p01.y)
                    ctx.lineTo(qU.p11.x, qU.p11.y)
                    ctx.lineTo(qU.p10.x, qU.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            for (var lb8 = 0; lb8 < 4; lb8++) {
                var list8 = litTorus[lb8]
                if (list8.length === 0) continue
                ctx.fillStyle = colourWithAlpha(ledCols8[lb8], (0.85 + state.bassSmooth * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.52 + lb8 * 0.14) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var l8 = 0; l8 < list8.length; l8++) {
                    var qL = list8[l8]
                    ctx.moveTo(qL.p00.x, qL.p00.y)
                    ctx.lineTo(qL.p01.x, qL.p01.y)
                    ctx.lineTo(qL.p11.x, qL.p11.y)
                    ctx.lineTo(qL.p10.x, qL.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 9) {
            // Style 9: Cymatic Chladni — Slowly 3D-Revolving 16×8 Tenori-On / Launchpad LED Resonance Matrix Deck
            var cymCX = vanishX
            var cymCY = horizonY - minDim * 0.20
            var cymScale = minDim * 0.27
            // Continuous 3D yaw revolution + organic 3D pitch & roll tilt so you see the 3D relief from all angles
            var cymRx = 0.68 + Math.sin(eqSpinT * 0.34) * 0.42
            var cymRy = eqSpinT * 0.40
            var cymRz = Math.sin(eqSpinT * 0.26) * 0.26
            var cymFov = 3.8
            var padCols = 16
            var padRows = 8
            var deckW = 1.56
            var deckD = 0.88

            // 1. Solid dark matte 3D hardware Launchpad chassis board + metallic bezel border
            var chFL = project3DPoint(-deckW, 0.06, -deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chFR = project3DPoint( deckW, 0.06, -deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chBR = project3DPoint( deckW, 0.06,  deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
            var chBL = project3DPoint(-deckW, 0.06,  deckD, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)

            ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.72 * (1.0 - dim * 0.4), 0.48, 0.84).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.55 * (1.0 - dim))
            ctx.lineWidth = 2.0
            ctx.beginPath()
            ctx.moveTo(chFL.x, chFL.y)
            ctx.lineTo(chFR.x, chFR.y)
            ctx.lineTo(chBR.x, chBR.y)
            ctx.lineTo(chBL.x, chBL.y)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // Harmonic Chladni standing-wave mode numbers driven by bass/mid/treble
            var modeN = 2.0 + Math.floor(((state.bassSmooth * 3.0 + state.midSmooth * 3.0) % 4.0))
            var modeM = 1.0 + Math.floor(((state.highSmooth * 3.0 + state.energySmooth * 3.0) % 3.0))

            var unlitPads = []
            var litPads = [[], [], [], []]
            var ledCols9 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            for (var pr = padRows - 1; pr >= 0; pr--) {
                var vR0 = (pr + 0.16) / padRows
                var vR1 = (pr + 0.84) / padRows
                var z0 = lerp(-deckD * 0.92, deckD * 0.92, vR0)
                var z1 = lerp(-deckD * 0.92, deckD * 0.92, vR1)
                var nyNorm = ((pr + 0.5) / padRows - 0.5) * 2.0

                for (var pc = 0; pc < padCols; pc++) {
                    var uC0 = (pc + 0.16) / padCols
                    var uC1 = (pc + 0.84) / padCols
                    var x0 = lerp(-deckW * 0.94, deckW * 0.94, uC0)
                    var x1 = lerp(-deckW * 0.94, deckW * 0.94, uC1)
                    var nxNorm = ((pc + 0.5) / padCols - 0.5) * 2.0

                    var bIdx9 = mapEqBandIndex(pc, padCols, eqBandOrder)
                    var v9 = sampleEqBandValue(state, bIdx9, eqDamping, eqGain)

                    // 2D Chladni standing-wave resonance pattern across the 16×8 LED pad matrix
                    var chladniVal = Math.abs(
                        Math.cos(modeN * Math.PI * nxNorm * 0.5 + eqSpinT * 1.1) * Math.cos(modeM * Math.PI * nyNorm * 0.5) -
                        Math.cos(modeM * Math.PI * nxNorm * 0.5 - eqSpinT * 0.9) * Math.cos(modeN * Math.PI * nyNorm * 0.5)
                    )
                    var padEnergy = clamp(chladniVal * (0.42 + v9 * 0.95), 0.0, 1.2)
                    var elevY = padEnergy > 0.22 ? -padEnergy * 0.24 : 0.0

                    var pp00 = project3DPoint(x0, elevY, z0, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp01 = project3DPoint(x1, elevY, z0, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp11 = project3DPoint(x1, elevY, z1, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pp10 = project3DPoint(x0, elevY, z1, cymRx, cymRy, cymRz, cymCX, cymCY, cymScale, cymFov)
                    var pQuad = { p00: pp00, p01: pp01, p11: pp11, p10: pp10 }

                    if (padEnergy < 0.22) {
                        unlitPads.push(pQuad)
                    } else if (padEnergy < 0.45) {
                        litPads[0].push(pQuad)
                    } else if (padEnergy < 0.68) {
                        litPads[1].push(pQuad)
                    } else if (padEnergy < 0.88) {
                        litPads[2].push(pQuad)
                    } else {
                        litPads[3].push(pQuad)
                    }
                }
            }

            if (unlitPads.length > 0) {
                ctx.fillStyle = "rgba(18, 26, 40, " + (0.65 * (1.0 - dim)).toFixed(3) + ")"
                ctx.strokeStyle = "rgba(42, 60, 88, " + (0.40 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.85
                ctx.beginPath()
                for (var up9 = 0; up9 < unlitPads.length; up9++) {
                    var q9U = unlitPads[up9]
                    ctx.moveTo(q9U.p00.x, q9U.p00.y)
                    ctx.lineTo(q9U.p01.x, q9U.p01.y)
                    ctx.lineTo(q9U.p11.x, q9U.p11.y)
                    ctx.lineTo(q9U.p10.x, q9U.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }

            for (var lb9 = 0; lb9 < 4; lb9++) {
                var list9 = litPads[lb9]
                if (list9.length === 0) continue
                ctx.fillStyle = colourWithAlpha(ledCols9[lb9], (0.86 + state.bassSmooth * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.55 + lb9 * 0.12) * (1.0 - dim))
                ctx.lineWidth = 1.05
                ctx.beginPath()
                for (var l9 = 0; l9 < list9.length; l9++) {
                    var q9L = list9[l9]
                    ctx.moveTo(q9L.p00.x, q9L.p00.y)
                    ctx.lineTo(q9L.p01.x, q9L.p01.y)
                    ctx.lineTo(q9L.p11.x, q9L.p11.y)
                    ctx.lineTo(q9L.p10.x, q9L.p10.y)
                    ctx.closePath()
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 10) {
            // Style 10: 3D Helix Vortex — Stereo Flanking 3D-Tumbling Segmented LED DNA Equaliser Cylinders
            var towerFlanks = [-1, 1]
            var rungCount = 16
            var towerScale = minDim * 0.20
            var ledCols10 = ["#00ff9d", "#ffb300", "#ff1744"]

            for (var tf = 0; tf < towerFlanks.length; tf++) {
                var sideSign = towerFlanks[tf]
                var towCX = w * 0.5 + sideSign * w * 0.28
                var towCY = horizonY - minDim * 0.22
                // Continuous 3-axis 3D revolution so each stereo DNA helix cylinder tumbles in 3D space
                var towRx = Math.sin(eqSpinT * 0.42 + sideSign) * 0.65
                var towRy = eqSpinT * 0.78 * sideSign
                var towRz = Math.cos(eqSpinT * 0.31 + sideSign) * 0.42

                // 1. 3D Revolving Cylindrical End-Cap Rings & Axial Core Spine
                ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.45 * (1.0 - dim))
                ctx.lineWidth = 1.4
                ctx.beginPath()
                for (var capEnd = -1; capEnd <= 1; capEnd += 2) {
                    for (var cs10 = 0; cs10 <= 16; cs10++) {
                        var ca10 = (cs10 / 16.0) * Math.PI * 2.0
                        var cp10 = project3DPoint(Math.cos(ca10) * 0.42, capEnd * 1.12, Math.sin(ca10) * 0.42, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                        if (cs10 === 0) ctx.moveTo(cp10.x, cp10.y)
                        else ctx.lineTo(cp10.x, cp10.y)
                    }
                }
                ctx.stroke()

                var strandA = []
                var strandB = []
                for (var rn = 0; rn < rungCount; rn++) {
                    var uY = rn / (rungCount - 1)
                    var y3 = lerp(1.08, -1.08, uY)
                    var bIdx10 = mapEqBandIndex(rn, rungCount, eqBandOrder)
                    var v10 = clamp(sampleEqBandValue(state, bIdx10, eqDamping, eqGain) * 1.15, 0.08, 1.0)
                    var twistAng = uY * Math.PI * 3.2 - eqSpinT * 2.2 * sideSign
                    var rad3 = 0.32 + v10 * 0.14

                    var pA = project3DPoint(Math.cos(twistAng) * rad3, y3, Math.sin(twistAng) * rad3, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                    var pB = project3DPoint(Math.cos(twistAng + Math.PI) * rad3, y3, Math.sin(twistAng + Math.PI) * rad3, towRx, towRy, towRz, towCX, towCY, towerScale, 3.6)
                    strandA.push(pA)
                    strandB.push(pB)

                    // Segmented 5-step LED meter rung bridging strandA and strandB (lights up from centre outward)
                    var activeSegs = Math.max(1, Math.min(3, Math.ceil(v10 * 3.0)))
                    for (var sStep = -2; sStep <= 2; sStep++) {
                        var distStep = Math.abs(sStep) // 0 = centre (Emerald), 1 = mid (Amber), 2 = outer peak (Crimson)
                        var uSeg0 = (sStep + 2.12) / 5.0
                        var uSeg1 = (sStep + 2.88) / 5.0
                        var sx0 = lerp(pA.x, pB.x, uSeg0), sy0 = lerp(pA.y, pB.y, uSeg0)
                        var sx1 = lerp(pA.x, pB.x, uSeg1), sy1 = lerp(pA.y, pB.y, uSeg1)
                        var isLit = distStep < activeSegs
                        ctx.strokeStyle = isLit
                            ? colourWithAlpha(ledCols10[distStep], (0.90 + state.bassSmooth * 0.10) * (1.0 - dim))
                            : "rgba(28, 40, 62, " + (0.48 * (1.0 - dim)).toFixed(3) + ")"
                        ctx.lineWidth = isLit ? 3.4 : 2.0
                        ctx.beginPath()
                        ctx.moveTo(sx0, sy0)
                        ctx.lineTo(sx1, sy1)
                        ctx.stroke()
                    }
                }

                // Glowing 3D double-helix backbone rails
                for (var spSide = 0; spSide < 2; spSide++) {
                    var pts10 = spSide === 0 ? strandA : strandB
                    ctx.strokeStyle = colourWithAlpha(spSide === 0 ? "#00e5ff" : "#ff00aa", 0.85 * (1.0 - dim))
                    ctx.lineWidth = 2.2
                    ctx.beginPath()
                    for (var kp = 0; kp < pts10.length; kp++) {
                        if (kp === 0) ctx.moveTo(pts10[kp].x, pts10[kp].y)
                        else ctx.lineTo(pts10[kp].x, pts10[kp].y)
                    }
                    ctx.stroke()
                }
            }
        } else if (eqStyle === 11) {
            // Style 11: Tesla Plasma Arcs — Slowly 3D-Revolving Cylindrical Carousel of 16 Vacuum Plasma Equaliser Tubes
            var tubeCount = 16
            var tierSteps = 8
            var bankCX = vanishX
            var bankCY = horizonY - minDim * 0.20
            var bankScale = minDim * 0.34
            // Continuous 3D revolution so the 3D carousel of 16 vacuum plasma tubes revolves in 3D space
            var bankRx = 0.36 + Math.sin(eqSpinT * 0.38) * 0.36
            var bankRy = eqSpinT * 0.44
            var bankRz = Math.sin(eqSpinT * 0.26) * 0.22
            var bankFov = 3.8
            var ledCols11 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]
            var carouselR = 1.05

            for (var tb = 0; tb < tubeCount; tb++) {
                var uTube = (tb + 0.5) / tubeCount
                var arcAng = (uTube - 0.5) * Math.PI * 1.75
                var txCenter = Math.sin(arcAng) * carouselR
                var tzCenter = Math.cos(arcAng) * carouselR * 0.72
                var tubeHalfW = 0.048
                var yBot3 = 0.38
                var yTop3 = -0.46

                var bL = project3DPoint(txCenter - tubeHalfW, yBot3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var bR = project3DPoint(txCenter + tubeHalfW, yBot3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var tR = project3DPoint(txCenter + tubeHalfW, yTop3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var tL = project3DPoint(txCenter - tubeHalfW, yTop3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)

                // 1. Dark glass 3D vacuum tube silhouette + metallic cathode base & anode cap
                ctx.fillStyle = "rgba(4, 6, 12, " + clamp(0.76 * (1.0 - dim * 0.4), 0.48, 0.86).toFixed(3) + ")"
                ctx.strokeStyle = colourWithAlpha("#00e5ff", 0.42 * (1.0 - dim))
                ctx.lineWidth = 1.25
                ctx.beginPath()
                ctx.moveTo(bL.x, bL.y)
                ctx.lineTo(bR.x, bR.y)
                ctx.lineTo(tR.x, tR.y)
                ctx.lineTo(tL.x, tL.y)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()

                var bIdx11 = mapEqBandIndex(tb, tubeCount, eqBandOrder)
                var v11 = clamp(sampleEqBandValue(state, bIdx11, eqDamping, eqGain) * 1.12, 0.08, 1.0)
                var litCells = Math.max(1, Math.min(tierSteps, Math.round(v11 * tierSteps)))

                // 2. Segmented 8-tier LED / Nixie plasma cells inside the vacuum tube
                var topLitY3 = yBot3
                for (var ts = 0; ts < tierSteps; ts++) {
                    var uS0 = (ts + 0.18) / tierSteps
                    var uS1 = (ts + 0.82) / tierSteps
                    var sy0 = lerp(yBot3 - 0.03, yTop3 + 0.06, uS0)
                    var sy1 = lerp(yBot3 - 0.03, yTop3 + 0.06, uS1)
                    var inW = tubeHalfW * 0.72
                    var c00 = project3DPoint(txCenter - inW, sy0, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c01 = project3DPoint(txCenter + inW, sy0, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c11 = project3DPoint(txCenter + inW, sy1, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                    var c10 = project3DPoint(txCenter - inW, sy1, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)

                    if (ts < litCells) {
                        topLitY3 = sy1
                        var cBucket = ts < 3 ? 0 : (ts < 5 ? 1 : (ts < 7 ? 2 : 3))
                        ctx.fillStyle = colourWithAlpha(ledCols11[cBucket], (0.86 + state.bassSmooth * 0.14) * (1.0 - dim))
                    } else {
                        ctx.fillStyle = "rgba(18, 26, 40, " + (0.45 * (1.0 - dim)).toFixed(3) + ")"
                    }
                    ctx.beginPath()
                    ctx.moveTo(c00.x, c00.y)
                    ctx.lineTo(c01.x, c01.y)
                    ctx.lineTo(c11.x, c11.y)
                    ctx.lineTo(c10.x, c10.y)
                    ctx.closePath()
                    ctx.fill()
                }

                // 3. Compact high-voltage Tesla plasma arc inside the upper vacuum tube (from top lit cell to anode cap)
                var arcStart = project3DPoint(txCenter, topLitY3, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var arcEnd = project3DPoint(txCenter, yTop3 + 0.02, tzCenter, bankRx, bankRy, bankRz, bankCX, bankCY, bankScale, bankFov)
                var jitX = Math.sin((state.t || 0.0) * 22.0 + tb * 4.1) * (bR.x - bL.x) * 0.28
                ctx.strokeStyle = colourWithAlpha("#ffffff", (0.72 + v11 * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.2 + v11 * 0.9
                ctx.beginPath()
                ctx.moveTo(arcStart.x, arcStart.y)
                ctx.lineTo((arcStart.x + arcEnd.x) * 0.5 + jitX, (arcStart.y + arcEnd.y) * 0.5)
                ctx.lineTo(arcEnd.x, arcEnd.y)
                ctx.stroke()
            }
        } else if (eqStyle === 12) {
            // Style 12: Tralis Voxel City — Slowly 3D-Revolving 12 × 4 Architectural 3D Segmented-LED Skyscraper Metropolis
            var cityHist = (state.eqRidgeHistory && state.eqRidgeHistory.length > 0) ? state.eqRidgeHistory : null
            var cityCols = 12
            var cityRows = 4
            var colSpan = 2.85
            var colSpacing = colSpan / cityCols
            var halfW = colSpacing * 0.30
            var worldCityStep = Math.floor(eqSpinT * 2.4)
            var zPhaseCity = (((eqSpinT * 2.4) % 1.0) + 1.0) % 1.0
            var cityCX = vanishX
            var cityCY = horizonY - minDim * 0.22
            var cityScale = minDim * 0.42
            // Continuous 3D yaw revolution + pitch/roll oscillation so all 3D sides of the voxel towers are revealed
            var cityRx = 0.42 + Math.sin(eqSpinT * 0.29) * 0.22
            var cityRy = Math.sin(eqSpinT * 0.32) * 0.78
            var cityRz = Math.sin(eqSpinT * 0.21) * 0.14
            var ledCols12 = ["#00ff9d", "#00e5ff", "#ffb300", "#ff1744"]

            // Precompute outer-to-inner column draw order so inner towers cleanly occlude outer towers' inner side faces
            var colOrder = []
            for (var cOrd = 0; cOrd < cityCols; cOrd++) {
                colOrder.push(cOrd)
            }
            var midColIdx = (cityCols - 1) * 0.5
            colOrder.sort(function(a, b) {
                return Math.abs(b - midColIdx) - Math.abs(a - midColIdx)
            })

            // Render strictly back-to-front (from farthest horizon row `rCity = 0` to nearest foreground row `rCity = cityRows - 1`)
            for (var rCity = 0; rCity < cityRows; rCity++) {
                var uRow = clamp((rCity + zPhaseCity) / cityRows, 0.04, 0.995)
                var histRowIdx = eqSpinDir >= 0
                    ? Math.min((cityHist ? cityHist.length : 1) - 1, rCity)
                    : Math.min((cityHist ? cityHist.length : 1) - 1, (cityRows - 1 - rCity))
                var rowSlice = cityHist ? cityHist[histRowIdx] : null
                var rowFade = Math.sin(uRow * Math.PI)

                // World Z from far horizon (+2.45) to near foreground (-0.65) with generous row avenue spacing
                var zCenter = lerp(2.45, -0.65, uRow)
                var halfDepthZ = 0.13
                var zBack = zCenter + halfDepthZ
                var zFront = zCenter - halfDepthZ
                var groundY3 = 0.30 // anchored near horizonY in local space so towers rise upward into y <= horizonY

                // 1. Sample raw column heights across the row, then apply 3-tap spatial smoothing (0.25*prev + 0.50*cur + 0.25*next)
                var rawHeights = []
                for (var cRaw = 0; cRaw < cityCols; cRaw++) {
                    var uColRaw = (cRaw + 0.5) / cityCols
                    var bIdx12 = mapEqBandIndex(cRaw, cityCols, eqBandOrder)
                    var bin36City = Math.min(35, Math.floor((bIdx12 / 63.0) * 35))
                    var rawBandVal = rowSlice && rowSlice.bins ? (rowSlice.bins[bin36City] || 0.06) : sampleEqBandValue(state, bIdx12, eqDamping, eqGain)
                    var colDist = Math.abs(uColRaw - 0.5) * 2.0
                    var bmtBoost = colDist < 0.35 ? (0.85 + state.bassSmooth * 0.50) : (colDist < 0.70 ? (0.85 + state.midSmooth * 0.45) : (0.85 + state.highSmooth * 0.45))
                    rawHeights.push(clamp(rawBandVal * eqGain * bmtBoost * 1.02, 0.08, 1.32))
                }

                var hullFillStyle = "rgba(4, 6, 12, " + clamp(0.92 * (0.48 + 0.52 * rowFade), 0.45, 0.95).toFixed(3) + ")"
                ctx.lineWidth = 1.05 + 1.20 * uRow

                // 2. Render columns from outer edges inward toward cityCX so inner towers cleanly occlude outer towers
                for (var oi = 0; oi < colOrder.length; oi++) {
                    var cCity = colOrder[oi]
                    var prevH = rawHeights[Math.max(0, cCity - 1)]
                    var curH = rawHeights[cCity]
                    var nextH = rawHeights[Math.min(cityCols - 1, cCity + 1)]
                    var towerH = 0.25 * prevH + 0.50 * curH + 0.25 * nextH
                    var topY3 = groundY3 - towerH
                    var normH = clamp(towerH / 1.32, 0.08, 1.0)
                    var topTierIdx = normH < 0.35 ? 0 : (normH < 0.62 ? 1 : (normH < 0.84 ? 2 : 3))
                    var topLedCol = ledCols12[topTierIdx]

                    var uCol = (cCity + 0.5) / cityCols
                    var xCenter = (uCol - 0.5) * colSpan
                    var xL = xCenter - halfW
                    var xR = xCenter + halfW

                    // Project visible corners of the 3D skyscraper prism
                    var bFL = project3DPoint(xL, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bFR = project3DPoint(xR, groundY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBR = project3DPoint(xR, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var bBL = project3DPoint(xL, groundY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    var tFL = project3DPoint(xL, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tFR = project3DPoint(xR, topY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBR = project3DPoint(xR, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                    var tBL = project3DPoint(xL, topY3, zBack,  cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)

                    // Step A: Solid dark matte hull fill on visible front face, inner side face, and roof to occlude background clutter
                    ctx.fillStyle = hullFillStyle
                    ctx.beginPath()
                    ctx.moveTo(bFL.x, bFL.y)
                    ctx.lineTo(bFR.x, bFR.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tFL.x, tFL.y)
                    ctx.closePath()
                    if (xCenter < -0.02) {
                        ctx.moveTo(bFR.x, bFR.y)
                        ctx.lineTo(bBR.x, bBR.y)
                        ctx.lineTo(tBR.x, tBR.y)
                        ctx.lineTo(tFR.x, tFR.y)
                        ctx.closePath()
                    } else if (xCenter > 0.02) {
                        ctx.moveTo(bBL.x, bBL.y)
                        ctx.lineTo(bFL.x, bFL.y)
                        ctx.lineTo(tFL.x, tFL.y)
                        ctx.lineTo(tBL.x, tBL.y)
                        ctx.closePath()
                    }
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    ctx.fill()

                    // Step B: Glowing LED level-colour tint on the 3D rooftop quad
                    ctx.fillStyle = colourWithAlpha(topLedCol, clamp((0.42 + 0.38 * uRow) * (0.40 + 0.60 * rowFade) * (1.0 - dim), 0.12, 0.90))
                    ctx.beginPath()
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    ctx.fill()

                    // Step C: Discrete horizontal LED floor-level bars on the front facade (Emerald -> Cyan -> Amber -> Crimson)
                    var maxFloors = 6
                    var activeFloors = Math.max(1, Math.min(maxFloors, Math.round(normH * maxFloors)))
                    for (var fl = 0; fl < activeFloors; fl++) {
                        var uFloor = (fl + 0.5) / maxFloors
                        var fY3 = groundY3 - uFloor * 1.25
                        if (fY3 < topY3 + 0.03) break
                        var fBucket = fl < 2 ? 0 : (fl < 4 ? 1 : (fl < 5 ? 2 : 3))
                        var fL = project3DPoint(xL + halfW * 0.22, fY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                        var fR = project3DPoint(xR - halfW * 0.22, fY3, zFront, cityRx, cityRy, cityRz, cityCX, cityCY, cityScale, 2.5)
                        ctx.strokeStyle = colourWithAlpha(ledCols12[fBucket], clamp((0.62 + 0.34 * uRow) * rowFade * (1.0 - dim), 0.18, 0.98))
                        ctx.lineWidth = 1.4 + 1.4 * uRow
                        ctx.beginPath()
                        ctx.moveTo(fL.x, fL.y)
                        ctx.lineTo(fR.x, fR.y)
                        ctx.stroke()
                    }

                    // Step D: Crisp neon outer edges on visible faces ONLY (zero hidden back-corner wireframe bleed)
                    ctx.strokeStyle = colourWithAlpha(topLedCol, clamp((0.52 + 0.46 * uRow) * (0.40 + 0.60 * rowFade) * (1.0 - dim), 0.16, 1.0))
                    ctx.lineWidth = 1.05 + 1.20 * uRow
                    ctx.beginPath()
                    ctx.moveTo(bFL.x, bFL.y)
                    ctx.lineTo(bFR.x, bFR.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tFL.x, tFL.y)
                    ctx.closePath()
                    ctx.moveTo(tFL.x, tFL.y)
                    ctx.lineTo(tFR.x, tFR.y)
                    ctx.lineTo(tBR.x, tBR.y)
                    ctx.lineTo(tBL.x, tBL.y)
                    ctx.closePath()
                    if (xCenter < -0.02) {
                        ctx.moveTo(bFR.x, bFR.y)
                        ctx.lineTo(bBR.x, bBR.y)
                        ctx.lineTo(tBR.x, tBR.y)
                    } else if (xCenter > 0.02) {
                        ctx.moveTo(bFL.x, bFL.y)
                        ctx.lineTo(bBL.x, bBL.y)
                        ctx.lineTo(tBL.x, tBL.y)
                    }
                    ctx.stroke()
                }
            }
        } else if (eqStyle === 13) {
            // Style 13: Aurora Curtains — 3D Undulating Northern Lights Spectral Ribbons
            var curtainCount = 4
            var segCount13 = 40
            for (var c13 = curtainCount - 1; c13 >= 0; c13--) {
                var uC13 = c13 / Math.max(1, curtainCount - 1)
                var baseCol13 = palette[(c13 * 2 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
                var topCol13 = palette[(c13 * 2 + 1 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
                var baseY13 = horizonY - uC13 * minDim * 0.08
                ctx.fillStyle = colourWithAlpha(baseCol13, (0.14 + (1.0 - uC13) * 0.14) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(topCol13, (0.68 + state.highSmooth * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.8 + (1.0 - uC13) * 1.2
                ctx.beginPath()
                var botPts13 = []
                var topPts13 = []
                for (var s13 = 0; s13 <= segCount13; s13++) {
                    var uS13 = s13 / segCount13
                    var bIdx13 = mapEqBandIndex(s13, segCount13 + 1, eqBandOrder)
                    var v13 = sampleEqBandValue(state, bIdx13, eqDamping, eqGain)
                    var waveX13 = uS13 * w + Math.sin(uS13 * 6.0 + eqSpinT * 1.4 + c13 * 1.2) * w * 0.025
                    var waveY13 = baseY13 - Math.sin(uS13 * Math.PI * 3.0 - eqSpinT * 1.1 + c13) * minDim * 0.05
                    var curtainH13 = (0.08 + v13 * 0.78) * maxEqH * (0.72 + 0.28 * (1.0 - uC13))
                    botPts13.push({ x: waveX13, y: waveY13 })
                    topPts13.push({ x: waveX13 + Math.cos(eqSpinT * 0.9 + uS13 * 5.0) * 10.0, y: waveY13 - curtainH13 })
                }
                ctx.moveTo(botPts13[0].x, botPts13[0].y)
                for (var i13 = 1; i13 <= segCount13; i13++) ctx.lineTo(botPts13[i13].x, botPts13[i13].y)
                for (var j13 = segCount13; j13 >= 0; j13--) ctx.lineTo(topPts13[j13].x, topPts13[j13].y)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 14) {
            // Style 14: DNA Helix Beam — Horizontal Full-Width 3D Double-Helix Spectral Equaliser Bridge
            var rungCount14 = 32
            var beamCY14 = horizonY - minDim * 0.18
            var beamAmp14 = minDim * (0.14 + state.bassSmooth * 0.05)
            var strandA14 = []
            var strandB14 = []
            for (var r14 = 0; r14 < rungCount14; r14++) {
                var u14 = r14 / (rungCount14 - 1)
                var x14 = lerp(w * 0.06, w * 0.94, u14)
                var bIdx14 = mapEqBandIndex(r14, rungCount14, eqBandOrder)
                var v14 = clamp(sampleEqBandValue(state, bIdx14, eqDamping, eqGain), 0.06, 1.35)
                var ang14 = u14 * Math.PI * 4.0 - eqSpinT * 2.4
                var rad14 = beamAmp14 * (0.45 + v14 * 0.85)
                var yA14 = beamCY14 + Math.sin(ang14) * rad14
                var yB14 = beamCY14 - Math.sin(ang14) * rad14
                strandA14.push({ x: x14, y: yA14 })
                strandB14.push({ x: x14, y: yB14 })
                var rungCol14 = palette[(r14 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                ctx.strokeStyle = colourWithAlpha(rungCol14, (0.65 + v14 * 0.30) * (1.0 - dim))
                ctx.lineWidth = 2.2 + v14 * 1.8
                ctx.beginPath()
                ctx.moveTo(x14, yA14)
                ctx.lineTo(x14, yB14)
                ctx.stroke()
            }
            for (var st14 = 0; st14 < 2; st14++) {
                var sPts14 = st14 === 0 ? strandA14 : strandB14
                ctx.strokeStyle = colourWithAlpha(st14 === 0 ? "#00f5d4" : "#ff007f", 0.90 * (1.0 - dim))
                ctx.lineWidth = 2.6 + state.bassSmooth * 1.2
                ctx.beginPath()
                for (var k14 = 0; k14 < sPts14.length; k14++) {
                    if (k14 === 0) ctx.moveTo(sPts14[k14].x, sPts14[k14].y)
                    else ctx.lineTo(sPts14[k14].x, sPts14[k14].y)
                }
                ctx.stroke()
            }
        } else if (eqStyle === 15) {
            // Style 15: Ferrofluid Lake — Magnetic Spiked Liquid-Metal Spectral Pool & Inverted Mirror
            var spikeCount15 = 48
            var colMain15 = palette[(Math.floor((state.hueShift || 0) / 45)) % palette.length]
            var colRim15 = palette[(2 + Math.floor((state.hueShift || 0) / 45)) % palette.length]
            for (var mir15 = 1; mir15 >= 0; mir15--) {
                var sign15 = mir15 === 0 ? -1.0 : 0.48
                ctx.fillStyle = mir15 === 0
                    ? "rgba(8, 12, 22, " + clamp(0.88 * (1.0 - dim * 0.4), 0.50, 0.92).toFixed(3) + ")"
                    : colourWithAlpha(colMain15, 0.20 * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(mir15 === 0 ? colRim15 : colMain15, (mir15 === 0 ? 0.92 : 0.45) * (1.0 - dim))
                ctx.lineWidth = mir15 === 0 ? (2.2 + state.bassSmooth * 1.4) : 1.3
                ctx.beginPath()
                ctx.moveTo(0, horizonY)
                for (var sp15 = 0; sp15 <= spikeCount15; sp15++) {
                    var u15 = sp15 / spikeCount15
                    var bIdx15 = mapEqBandIndex(sp15, spikeCount15 + 1, eqBandOrder)
                    var v15 = sampleEqBandValue(state, bIdx15, eqDamping, eqGain)
                    var thorn = Math.pow(0.5 + 0.5 * Math.sin(sp15 * Math.PI + eqSpinT * 3.2), 2.2)
                    var h15 = (0.04 + v15 * (0.45 + 0.65 * thorn)) * maxEqH
                    var x15 = u15 * w
                    var y15 = horizonY + sign15 * h15
                    ctx.lineTo(x15, y15)
                }
                ctx.lineTo(w, horizonY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 16) {
            // Style 16: 3D Tubes — 3 Orthogonal Axes (Bass = X, Mid = Y, Highs = Z) as Invisible Base Holding 3 Oscillating 3D Coloured Tubes Formed by Circular Circumferences (Zero Construction Lines)
            var centerX16 = vanishX
            var centerY16 = horizonY - minDim * 0.20
            var baseScale16 = minDim * 0.34
            var circleSegs16 = 24
            var ringsPerTube16 = 18
            var fov16 = 3.8
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            // Continuous 3-axis 3D tilt & rotation of the invisible orthogonal coordinate frame
            var rx16 = 0.48 + Math.sin(eqSpinT * 0.44) * 0.36 + eqSpinT * 0.32 + state.bassSmooth * 0.18
            var ry16 = eqSpinT * 0.58 + Math.cos(eqSpinT * 0.31) * 0.28 + state.midSmooth * 0.16
            var rz16 = Math.sin(eqSpinT * 0.39) * 0.42 + eqSpinT * 0.21 + state.highSmooth * 0.14

            var hueOff16 = Math.floor((state.hueShift || 0) / 30)
            var colBass16 = palette[(0 + hueOff16) % palette.length]
            var colMid16  = palette[(2 + hueOff16) % palette.length]
            var colHigh16 = palette[(4 + hueOff16) % palette.length]
            var tubeCols16 = [colBass16, colMid16, colHigh16]

            var bassDrive16 = clamp((state.bass * 0.62 + state.bassSmooth * 0.38) * eqGain, 0.05, 1.45)
            var midDrive16  = clamp((state.mid  * 0.62 + state.midSmooth  * 0.38) * eqGain, 0.05, 1.45)
            var highDrive16 = clamp((state.high * 0.62 + state.highSmooth * 0.38) * eqGain, 0.05, 1.45)
            var axisDrives16 = [bassDrive16, midDrive16, highDrive16]

            // Collect all 3D circular circumference slices across the 3 orthogonal tubes and depth-sort back-to-front
            var tubeSlices16 = []
            for (var axisIdx = 0; axisIdx < 3; axisIdx++) {
                var drive16 = axisDrives16[axisIdx]
                var tubeCol16 = tubeCols16[axisIdx]
                // Band range per axis: 0 = Bass (0..20), 1 = Mid (21..42), 2 = Highs (43..63)
                var bandStart16 = axisIdx === 0 ? 0 : (axisIdx === 1 ? 21 : 43)
                var bandCount16 = axisIdx === 2 ? 21 : 21

                // Tube length expands/contracts along its axis with its frequency band, plus axial oscillation slide
                var halfSpan16 = 0.44 + drive16 * 0.64
                var axisSlide16 = Math.sin(eqSpinT * (2.1 + axisIdx * 0.65) + axisIdx * 2.094) * (0.06 + drive16 * 0.22)

                for (var rIdx = 0; rIdx < ringsPerTube16; rIdx++) {
                    var uRing = ringsPerTube16 > 1 ? (rIdx / (ringsPerTube16 - 1)) : 0.5
                    var signedU = (uRing - 0.5) * 2.0 // -1.0 .. +1.0 along the axis
                    var subBandIdx = bandStart16 + Math.min(bandCount16 - 1, Math.floor(Math.abs(signedU) * bandCount16))
                    var mappedBand = mapEqBandIndex(subBandIdx, 64, eqBandOrder)
                    var bandVal16 = clamp(sampleEqBandValue(state, mappedBand, eqDamping, eqGain), 0.05, 1.42)

                    // Harmonic standing-wave compression & oscillation along the axis
                    var axialWave = Math.sin(signedU * Math.PI * 2.0 - eqSpinT * (3.2 + axisIdx * 0.7) * eqSpinDir) * (0.04 + bandVal16 * 0.09)
                    var axisPos = signedU * halfSpan16 + axisSlide16 + axialWave

                    // Tube radius: fuller in the body with organic peristaltic wave + frequency-band swell, rounded at ends
                    var endProfile = Math.sqrt(Math.max(0.14, 1.0 - signedU * signedU * 0.72))
                    var radialOsc = 1.0 + 0.24 * Math.cos(signedU * Math.PI * 2.5 - eqSpinT * 3.6 + axisIdx * 1.4) * drive16
                    var ringRad16 = (0.13 + drive16 * 0.08 + bandVal16 * 0.11) * endProfile * radialOsc

                    // Project ring centre on the invisible axis for accurate 3D Painter's depth sorting
                    var cx3 = axisIdx === 0 ? axisPos : 0.0
                    var cy3 = axisIdx === 1 ? axisPos : 0.0
                    var cz3 = axisIdx === 2 ? axisPos : 0.0
                    var centerPt = project3DPoint(cx3, cy3, cz3, rx16, ry16, rz16, centerX16, centerY16, baseScale16, fov16)

                    var pts16 = []
                    for (var s16 = 0; s16 <= circleSegs16; s16++) {
                        var ang16 = (s16 / circleSegs16) * Math.PI * 2.0
                        var c16 = Math.cos(ang16) * ringRad16
                        var s16v = Math.sin(ang16) * ringRad16
                        // Circle circumference lies perpendicular to its holding axis:
                        //   axisIdx 0 (X / Bass): circle in YZ plane
                        //   axisIdx 1 (Y / Mid):  circle in XZ plane
                        //   axisIdx 2 (Z / High): circle in XY plane
                        var px3 = axisIdx === 0 ? axisPos : c16
                        var py3 = axisIdx === 0 ? c16     : (axisIdx === 1 ? axisPos : s16v)
                        var pz3 = axisIdx === 2 ? axisPos : s16v
                        pts16.push(project3DPoint(px3, py3, pz3, rx16, ry16, rz16, centerX16, centerY16, baseScale16, fov16))
                    }

                    tubeSlices16.push({
                        z: centerPt.z,
                        pts: pts16,
                        col: tubeCol16,
                        energy: clamp(drive16 * 0.55 + bandVal16 * 0.55, 0.08, 1.45),
                        isTip: (rIdx === 0 || rIdx === ringsPerTube16 - 1)
                    })
                }
            }

            // Sort all circular tube cross-sections back-to-front (smallest z3 = farthest to largest z3 = nearest)
            tubeSlices16.sort(function(a, b) {
                return a.z - b.z
            })

            for (var tsIdx = 0; tsIdx < tubeSlices16.length; tsIdx++) {
                var slice = tubeSlices16[tsIdx]
                var sPts = slice.pts
                ctx.beginPath()
                for (var pIdx = 0; pIdx < sPts.length; pIdx++) {
                    if (pIdx === 0) ctx.moveTo(sPts[pIdx].x, sPts[pIdx].y)
                    else ctx.lineTo(sPts[pIdx].x, sPts[pIdx].y)
                }
                ctx.closePath()

                // 1. Volumetric dark tube body fill + subtle coloured plasma interior so each 3D tube has solid cylindrical depth
                ctx.fillStyle = "rgba(4, 8, 18, " + (0.58 * (1.0 - dim)).toFixed(3) + ")"
                ctx.fill()
                ctx.fillStyle = colourWithAlpha(slice.col, (0.14 + slice.energy * 0.14) * (1.0 - dim))
                ctx.fill()

                // 2. Coloured 3D circular circumference ring (outer casing shadow -> vibrant neon circumference -> specular core)
                var lwSlice = (slice.isTip ? 2.4 : 1.7) + slice.energy * 1.85
                ctx.strokeStyle = "rgba(3, 6, 14, " + (0.72 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = lwSlice * 1.75
                ctx.stroke()

                ctx.strokeStyle = colourWithAlpha(slice.col, clamp((0.72 + slice.energy * 0.26) * (1.0 - dim), 0.20, 1.0))
                ctx.lineWidth = lwSlice
                ctx.stroke()

                if (slice.isTip || slice.energy > 0.52) {
                    ctx.strokeStyle = "rgba(245, 252, 255, " + clamp((0.38 + slice.energy * 0.42) * (1.0 - dim), 0.15, 0.92).toFixed(3) + ")"
                    ctx.lineWidth = Math.max(0.8, lwSlice * 0.34)
                    ctx.stroke()
                }
            }
        } else if (eqStyle === 17) {
            // Style 17: Hyper-Ribbon Spectrum Canyon — 3D Receding Multi-Layer Harmonic Ribbon Canyon with Tubular Crests
            var layers17 = 5
            var segs17 = 36
            ctx.lineJoin = "round"
            ctx.lineCap = "round"
            for (var l17 = layers17 - 1; l17 >= 0; l17--) {
                var du17 = l17 / (layers17 - 1)
                var zS17 = lerp(1.0, 0.36, du17)
                var baseY17 = horizonY - du17 * minDim * 0.25
                var col17 = palette[(l17 * 2 + Math.floor((state.hueShift || 0) / 35)) % palette.length]
                var pts17 = []
                for (var s17 = 0; s17 <= segs17; s17++) {
                    var u17 = s17 / segs17
                    var canyonV = Math.abs(u17 - 0.5) * 2.0
                    var bIdx17 = mapEqBandIndex(s17, segs17 + 1, eqBandOrder)
                    var v17 = sampleEqBandValue(state, bIdx17, eqDamping, eqGain)
                    var wallBoost = 0.45 + 0.85 * Math.pow(canyonV, 0.85)
                    var osc17 = Math.sin(u17 * Math.PI * 4.0 + eqSpinT * 2.1 - l17 * 0.7) * 0.12
                    var h17 = (0.04 + (v17 * wallBoost + Math.max(0.0, osc17)) * 0.82) * maxEqH * zS17
                    var span17 = w * lerp(1.0, 0.48, du17)
                    var px17 = vanishX + (u17 - 0.5) * span17
                    var py17 = baseY17 - h17
                    pts17.push({ x: px17, y: py17 })
                }
                ctx.fillStyle = colourWithAlpha(col17, (0.16 + (1.0 - du17) * 0.18) * (1.0 - dim))
                ctx.beginPath()
                ctx.moveTo(pts17[0].x, baseY17)
                for (var p17 = 0; p17 <= segs17; p17++) ctx.lineTo(pts17[p17].x, pts17[p17].y)
                ctx.lineTo(pts17[segs17].x, baseY17)
                ctx.closePath()
                ctx.fill()
                // Tubular 3D ridge crest (shadow + body + specular)
                var lw17 = (2.8 + state.bassSmooth * 2.0) * zS17
                ctx.strokeStyle = "rgba(4, 7, 15, " + (0.65 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = lw17 * 2.1
                ctx.beginPath()
                for (var k17 = 0; k17 <= segs17; k17++) {
                    if (k17 === 0) ctx.moveTo(pts17[k17].x, pts17[k17].y)
                    else ctx.lineTo(pts17[k17].x, pts17[k17].y)
                }
                ctx.stroke()
                ctx.strokeStyle = colourWithAlpha(col17, 0.92 * (1.0 - dim))
                ctx.lineWidth = lw17 * 1.25
                ctx.stroke()
                ctx.strokeStyle = "rgba(245, 252, 255, " + (0.68 * (1.0 - du17 * 0.5) * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = Math.max(0.9, lw17 * 0.42)
                ctx.stroke()
            }
        } else if (eqStyle === 18) {
            // Style 18: Cybernetic Spine & Ribs — 3D Articulated Biomechanical Vertebral Column & Pulsing Rib Cage
            var center18Y = horizonY - minDim * 0.20
            var spineR18 = minDim * 0.34
            var vertCount18 = 20
            var rx18 = 0.28 + Math.sin(eqSpinT * 0.55) * 0.22
            var ry18 = eqSpinT * 0.68
            var rz18 = Math.cos(eqSpinT * 0.42) * 0.18
            var spinePts18 = []
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            for (var v18 = 0; v18 < vertCount18; v18++) {
                var u18 = (v18 / (vertCount18 - 1)) * 2.0 - 1.0
                var bIdx18 = mapEqBandIndex(v18, vertCount18, eqBandOrder)
                var val18 = clamp(sampleEqBandValue(state, bIdx18, eqDamping, eqGain), 0.06, 1.40)
                var spineCurveZ = Math.sin(u18 * Math.PI * 1.2 + eqSpinT * 1.8) * 0.22
                var spPt = project3DPoint(0.0, u18 * 0.95, spineCurveZ, rx18, ry18, rz18, vanishX, center18Y, spineR18, 3.6)
                spinePts18.push(spPt)
                var ribSpan = (1.0 - Math.abs(u18) * 0.42) * (0.35 + val18 * 0.85)
                var col18 = palette[(v18 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                for (var side18 = -1; side18 <= 1; side18 += 2) {
                    ctx.beginPath()
                    for (var rs18 = 0; rs18 <= 8; rs18++) {
                        var ru18 = rs18 / 8
                        var rAng = ru18 * Math.PI * 0.82
                        var rx3 = side18 * Math.sin(rAng) * ribSpan
                        var ry3 = u18 * 0.95 + ru18 * 0.12
                        var rz3 = spineCurveZ + (1.0 - Math.cos(rAng)) * ribSpan * 0.72
                        var rPt = project3DPoint(rx3, ry3, rz3, rx18, ry18, rz18, vanishX, center18Y, spineR18, 3.6)
                        if (rs18 === 0) ctx.moveTo(rPt.x, rPt.y)
                        else ctx.lineTo(rPt.x, rPt.y)
                    }
                    ctx.strokeStyle = "rgba(5, 8, 18, " + (0.65 * (1.0 - dim)).toFixed(3) + ")"
                    ctx.lineWidth = (2.2 + val18 * 2.2) * 1.8
                    ctx.stroke()
                    ctx.strokeStyle = colourWithAlpha(col18, (0.68 + val18 * 0.28) * (1.0 - dim))
                    ctx.lineWidth = 2.0 + val18 * 2.0
                    ctx.stroke()
                }
            }
            ctx.beginPath()
            for (var s18 = 0; s18 < spinePts18.length; s18++) {
                if (s18 === 0) ctx.moveTo(spinePts18[s18].x, spinePts18[s18].y)
                else ctx.lineTo(spinePts18[s18].x, spinePts18[s18].y)
            }
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 3.2 + state.bassSmooth * 1.8
            ctx.stroke()
        } else if (eqStyle === 19) {
            // Style 19: Holographic Prism Pillars — 16 3D Hexagonal/Triangular Crystal Pillars Rotating on a 3D Ring
            var center19Y = horizonY - minDim * 0.20
            var ringR19 = minDim * 0.30
            var pillarCount19 = 16
            var rx19 = 0.42 + Math.sin(eqSpinT * 0.45) * 0.14
            var ry19 = eqSpinT * 0.58
            var rz19 = Math.cos(eqSpinT * 0.38) * 0.12
            for (var p19 = 0; p19 < pillarCount19; p19++) {
                var ang19 = (p19 / pillarCount19) * Math.PI * 2.0
                var bIdx19 = mapEqBandIndex(p19, pillarCount19, eqBandOrder)
                var val19 = clamp(sampleEqBandValue(state, bIdx19, eqDamping, eqGain), 0.08, 1.40)
                var cx3 = Math.cos(ang19) * 0.82
                var cz3 = Math.sin(ang19) * 0.82
                var halfH19 = 0.12 + val19 * 0.62
                var rad19 = 0.11 + state.bassSmooth * 0.03
                var topRing19 = []
                var botRing19 = []
                for (var c19 = 0; c19 < 4; c19++) {
                    var cAng19 = ang19 + (c19 / 4) * Math.PI * 2.0 + Math.PI * 0.25
                    var vx19 = cx3 + Math.cos(cAng19) * rad19
                    var vz19 = cz3 + Math.sin(cAng19) * rad19
                    topRing19.push(project3DPoint(vx19, -halfH19, vz19, rx19, ry19, rz19, vanishX, center19Y, ringR19, 3.6))
                    botRing19.push(project3DPoint(vx19,  halfH19 * 0.45, vz19, rx19, ry19, rz19, vanishX, center19Y, ringR19, 3.6))
                }
                var apex19 = project3DPoint(cx3, -halfH19 - 0.14 * (0.5 + val19), cz3, rx19, ry19, rz19, vanishX, center19Y, ringR19, 3.6)
                var col19 = palette[(p19 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                ctx.fillStyle = colourWithAlpha(col19, (0.18 + val19 * 0.22) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(col19, (0.78 + val19 * 0.20) * (1.0 - dim))
                ctx.lineWidth = 1.6 + val19 * 1.4
                ctx.beginPath()
                for (var f19 = 0; f19 < 4; f19++) {
                    var n19 = (f19 + 1) % 4
                    ctx.moveTo(topRing19[f19].x, topRing19[f19].y)
                    ctx.lineTo(topRing19[n19].x, topRing19[n19].y)
                    ctx.moveTo(botRing19[f19].x, botRing19[f19].y)
                    ctx.lineTo(botRing19[n19].x, botRing19[n19].y)
                    ctx.moveTo(topRing19[f19].x, topRing19[f19].y)
                    ctx.lineTo(botRing19[f19].x, botRing19[f19].y)
                    ctx.moveTo(topRing19[f19].x, topRing19[f19].y)
                    ctx.lineTo(apex19.x, apex19.y)
                }
                ctx.fill()
                ctx.stroke()
            }
        } else if (eqStyle === 20) {
            // Style 20: Relativistic Warp Rings EQ — 7 Concentric 3D Tilted Gyroscopic Frequency Rings
            var center20Y = horizonY - minDim * 0.20
            var baseR20 = minDim * 0.34
            var rings20 = 7
            var segs20 = 36
            ctx.lineJoin = "round"
            for (var r20 = 0; r20 < rings20; r20++) {
                var ru20 = (r20 + 1) / rings20
                var rx20 = eqSpinT * (0.55 + r20 * 0.14) + r20 * 0.52
                var ry20 = eqSpinT * (0.42 - r20 * 0.11) + r20 * 0.78
                var rz20 = Math.sin(eqSpinT * 0.35 + r20) * 0.45
                var col20 = palette[(r20 * 2 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                ctx.beginPath()
                for (var s20 = 0; s20 <= segs20; s20++) {
                    var a20 = (s20 / segs20) * Math.PI * 2.0
                    var bIdx20 = mapEqBandIndex((s20 + r20 * 5) % 36, 36, eqBandOrder)
                    var v20 = sampleEqBandValue(state, bIdx20, eqDamping, eqGain)
                    var radMod20 = ru20 * (0.72 + v20 * 0.38)
                    var zWarp20 = Math.sin(a20 * 4.0 + eqSpinT * 2.4) * (0.06 + v20 * 0.24)
                    var pt20 = project3DPoint(Math.cos(a20) * radMod20, Math.sin(a20) * radMod20, zWarp20, rx20, ry20, rz20, vanishX, center20Y, baseR20, 3.6)
                    if (s20 === 0) ctx.moveTo(pt20.x, pt20.y)
                    else ctx.lineTo(pt20.x, pt20.y)
                }
                ctx.closePath()
                ctx.strokeStyle = "rgba(4, 7, 16, " + (0.62 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = (2.4 + state.bassSmooth * 1.8) * 2.0
                ctx.stroke()
                ctx.strokeStyle = colourWithAlpha(col20, 0.90 * (1.0 - dim))
                ctx.lineWidth = 2.4 + state.bassSmooth * 1.6
                ctx.stroke()
                ctx.strokeStyle = "rgba(245, 250, 255, " + (0.62 * (1.0 - dim)).toFixed(3) + ")"
                ctx.lineWidth = 0.95
                ctx.stroke()
            }
        } else if (eqStyle === 21) {
            // Style 21: Liquid Mercury Ferro-Wave — 3D Tubular Chrome Standing Wave & Specular Mirror
            var segs21 = 56
            ctx.lineJoin = "round"
            ctx.lineCap = "round"
            for (var strand21 = 2; strand21 >= 0; strand21--) {
                var col21 = palette[(strand21 * 2 + Math.floor((state.hueShift || 0) / 35)) % palette.length]
                for (var mir21 = 1; mir21 >= 0; mir21--) {
                    var dirSign21 = mir21 === 0 ? -1.0 : 0.45
                    ctx.beginPath()
                    for (var i21 = 0; i21 <= segs21; i21++) {
                        var u21 = i21 / segs21
                        var bIdx21 = mapEqBandIndex(i21, segs21 + 1, eqBandOrder)
                        var v21 = sampleEqBandValue(state, bIdx21, eqDamping, eqGain)
                        var ripple21 = Math.sin(u21 * Math.PI * 6.0 - eqSpinT * 2.8 + strand21 * 1.1) * 0.25 + 0.75
                        var env21 = Math.sin(u21 * Math.PI)
                        var h21 = (0.04 + v21 * ripple21 * (0.45 + 0.55 * env21) * (1.0 - strand21 * 0.20)) * maxEqH
                        var x21 = u21 * w
                        var y21 = horizonY + dirSign21 * h21
                        if (i21 === 0) ctx.moveTo(x21, y21)
                        else ctx.lineTo(x21, y21)
                    }
                    var baseW21 = (mir21 === 0 ? 4.2 : 2.2) * (1.0 - strand21 * 0.18) + state.bassSmooth * 1.8
                    ctx.strokeStyle = "rgba(6, 10, 20, " + ((mir21 === 0 ? 0.72 : 0.38) * (1.0 - dim)).toFixed(3) + ")"
                    ctx.lineWidth = baseW21 * 2.1
                    ctx.stroke()
                    ctx.strokeStyle = colourWithAlpha(col21, (mir21 === 0 ? 0.90 : 0.45) * (1.0 - dim))
                    ctx.lineWidth = baseW21 * 1.25
                    ctx.stroke()
                    if (mir21 === 0) {
                        ctx.strokeStyle = "rgba(248, 252, 255, " + (0.82 * (1.0 - dim)).toFixed(3) + ")"
                        ctx.lineWidth = Math.max(1.1, baseW21 * 0.42)
                        ctx.stroke()
                    }
                }
            }
        } else if (eqStyle === 22) {
            // Style 22: Laser Harp Cathedral — Jean-Michel Jarre Central Stage Emitter Pedestal, Outward Radial Laser Fan, Standing-Wave Plucked Beams & Diffraction Starbursts
            var stringCount22 = 24
            var harpReachH22 = Math.max(h * 0.46, maxEqH * 1.12)
            var apexY22 = horizonY - harpReachH22
            var emitterSpanW22 = w * 0.24
            var canopySpanW22 = w * 0.88
            var consoleDepth22 = Math.min(h * 0.045, minDim * 0.055)
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            // 1. 3D Perspective Central Stage Laser Emitter Pedestal at Horizon Base
            ctx.fillStyle = "rgba(6, 10, 22, " + (0.88 * (1.0 - dim)).toFixed(3) + ")"
            ctx.strokeStyle = colourWithAlpha("#00e5ff", (0.72 + state.bassSmooth * 0.25) * (1.0 - dim))
            ctx.lineWidth = 2.0
            ctx.beginPath()
            ctx.moveTo(vanishX - emitterSpanW22 * 0.62, horizonY + consoleDepth22 * 0.45)
            ctx.lineTo(vanishX + emitterSpanW22 * 0.62, horizonY + consoleDepth22 * 0.45)
            ctx.lineTo(vanishX + emitterSpanW22 * 0.48, horizonY - consoleDepth22 * 0.65)
            ctx.lineTo(vanishX - emitterSpanW22 * 0.48, horizonY - consoleDepth22 * 0.65)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()

            // 2. Upper Wide Parabolic Cathedral Reflector Canopy Truss (beams fan OUTWARD from emitter to canopy)
            ctx.strokeStyle = colourWithAlpha("#ff00aa", (0.62 + state.highSmooth * 0.34) * (1.0 - dim))
            ctx.lineWidth = 2.2
            ctx.beginPath()
            for (var aStep22 = 0; aStep22 <= stringCount22; aStep22++) {
                var uArch22 = aStep22 / stringCount22
                var archNorm22 = (uArch22 - 0.5) * 2.0
                var ax22 = vanishX + archNorm22 * (canopySpanW22 * 0.5)
                var ay22 = apexY22 + Math.pow(Math.abs(archNorm22), 1.55) * harpReachH22 * 0.34
                if (aStep22 === 0) ctx.moveTo(ax22, ay22)
                else ctx.lineTo(ax22, ay22)
            }
            ctx.stroke()

            // 3. Multi-Pass Plucked Laser Strings Fanning Outward with Sinusoidal Standing-Wave Harmonics & Travelling Light-Rings
            for (var s22 = 0; s22 < stringCount22; s22++) {
                var u22 = s22 / (stringCount22 - 1)
                var archU22 = (u22 - 0.5) * 2.0
                var baseX22 = vanishX + archU22 * (emitterSpanW22 * 0.44)
                var baseY22 = horizonY - consoleDepth22 * 0.25
                var topX22 = vanishX + archU22 * (canopySpanW22 * 0.5)
                var topY22 = apexY22 + Math.pow(Math.abs(archU22), 1.55) * harpReachH22 * 0.34

                var bdx22 = topX22 - baseX22
                var bdy22 = topY22 - baseY22
                var bLen22 = Math.max(1.0, Math.sqrt(bdx22 * bdx22 + bdy22 * bdy22))
                var nx22 = -bdy22 / bLen22
                var ny22 = bdx22 / bLen22

                var bIdx22 = mapEqBandIndex(s22, stringCount22, eqBandOrder)
                var v22 = clamp(sampleEqBandValue(state, bIdx22, eqDamping, eqGain), 0.05, 1.40)
                var col22 = palette[(s22 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                var isPlucked22 = v22 > 0.26

                // Sample 16 segments along the beam to render smooth, high-Q sinusoidal standing-wave string vibration when plucked
                var segsStr22 = 16
                var strPts22 = []
                var pluckU22 = clamp(((eqSpinT * 1.4 + s22 * 0.19) % 0.72) + 0.16, 0.16, 0.88)
                var pluckX22 = lerp(baseX22, topX22, pluckU22)
                var pluckY22 = lerp(baseY22, topY22, pluckU22)

                for (var k22 = 0; k22 <= segsStr22; k22++) {
                    var tStr = k22 / segsStr22
                    var envStr = Math.sin(tStr * Math.PI)
                    var standingWave = Math.sin(tStr * Math.PI * 2.0) * Math.cos(eqSpinT * 20.0 + s22 * 1.3)
                                     + 0.55 * Math.sin(tStr * Math.PI * 3.0 + eqSpinT * 26.0 + s22 * 2.1)
                    var vibAmp = isPlucked22 ? (v22 * 13.5 * envStr * standingWave) : 0.0
                    var sx22 = lerp(baseX22, topX22, tStr) + nx22 * vibAmp
                    var sy22 = lerp(baseY22, topY22, tStr) + ny22 * vibAmp
                    strPts22.push({ x: sx22, y: sy22 })
                    if (k22 === Math.round(pluckU22 * segsStr22)) {
                        pluckX22 = sx22
                        pluckY22 = sy22
                    }
                }

                // Outer atmospheric laser bloom pass
                ctx.strokeStyle = colourWithAlpha(col22, (0.26 + v22 * 0.38) * (1.0 - dim))
                ctx.lineWidth = 3.2 + v22 * 4.6
                ctx.beginPath()
                for (var pA22 = 0; pA22 <= segsStr22; pA22++) {
                    if (pA22 === 0) ctx.moveTo(strPts22[pA22].x, strPts22[pA22].y)
                    else ctx.lineTo(strPts22[pA22].x, strPts22[pA22].y)
                }
                ctx.stroke()

                // Coherent neon laser core pass
                ctx.strokeStyle = isPlucked22
                    ? "rgba(248, 254, 255, " + ((0.78 + v22 * 0.22) * (1.0 - dim)).toFixed(3) + ")"
                    : colourWithAlpha(col22, (0.70 + v22 * 0.28) * (1.0 - dim))
                ctx.lineWidth = 1.25 + v22 * 1.65
                ctx.stroke()

                // Emitter nozzle lens on the stage console + upper mirror facet on the parabolic arch
                ctx.fillStyle = colourWithAlpha(col22, 0.92 * (1.0 - dim))
                ctx.fillRect(baseX22 - 2.6, baseY22 - 1.6, 5.2, 3.2)
                ctx.fillRect(topX22 - 2.2, topY22 - 1.4, 4.4, 2.8)

                // Travelling harmonic light-ring + 4-point optical diffraction starburst at the pluck node
                var nodeR22 = 2.6 + v22 * 5.2
                ctx.strokeStyle = colourWithAlpha(col22, (0.78 + v22 * 0.22) * (1.0 - dim))
                ctx.lineWidth = 1.5
                ctx.beginPath()
                ctx.arc(pluckX22, pluckY22, nodeR22, 0, Math.PI * 2.0)
                if (isPlucked22) {
                    var starSpan = nodeR22 * (1.8 + v22 * 1.1)
                    ctx.moveTo(pluckX22 - starSpan, pluckY22)
                    ctx.lineTo(pluckX22 + starSpan, pluckY22)
                    ctx.moveTo(pluckX22, pluckY22 - starSpan)
                    ctx.lineTo(pluckX22, pluckY22 + starSpan)
                }
                ctx.stroke()

                ctx.fillStyle = "#ffffff"
                ctx.beginPath()
                ctx.arc(pluckX22, pluckY22, nodeR22 * 0.42, 0, Math.PI * 2.0)
                ctx.fill()
            }
        } else {
            // Style 23: 3D Synth Keyboard Valley — 3D Perspective Piano/Synth Keybeds Depressing & Rising with the Beat
            var keyCount23 = 24
            var spanNear23 = w * 0.92
            var spanFar23 = w * 0.54
            var depthY23 = Math.min(h * 0.22, maxEqH * 0.52)
            ctx.lineJoin = "round"
            for (var k23 = 0; k23 < keyCount23; k23++) {
                var u0_23 = k23 / keyCount23
                var u1_23 = (k23 + 0.86) / keyCount23
                var bIdx23 = mapEqBandIndex(k23, keyCount23, eqBandOrder)
                var v23 = clamp(sampleEqBandValue(state, bIdx23, eqDamping, eqGain), 0.04, 1.35)
                var keyWave23 = 0.5 + 0.5 * Math.sin(eqSpinT * 3.2 + k23 * 0.55)
                var lift23 = (v23 * (0.72 + 0.28 * keyWave23) + state.beatPulse * 0.18) * maxEqH * 0.62
                var nx0 = vanishX + (u0_23 - 0.5) * spanNear23
                var nx1 = vanishX + (u1_23 - 0.5) * spanNear23
                var fx0 = vanishX + (u0_23 - 0.5) * spanFar23
                var fx1 = vanishX + (u1_23 - 0.5) * spanFar23
                var nyBase = horizonY
                var fyBase = horizonY - depthY23
                var nyTop = nyBase - lift23
                var fyTop = fyBase - lift23 * 0.62
                var col23 = palette[(k23 + Math.floor((state.hueShift || 0) / 30)) % palette.length]
                // Top 3D key face
                ctx.fillStyle = colourWithAlpha(col23, (0.28 + v23 * 0.42) * (1.0 - dim))
                ctx.strokeStyle = colourWithAlpha(col23, (0.82 + v23 * 0.18) * (1.0 - dim))
                ctx.lineWidth = 1.6 + v23 * 1.4
                ctx.beginPath()
                ctx.moveTo(nx0, nyTop)
                ctx.lineTo(nx1, nyTop)
                ctx.lineTo(fx1, fyTop)
                ctx.lineTo(fx0, fyTop)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                // Front 3D key bevel face
                ctx.fillStyle = colourWithAlpha(col23, (0.45 + v23 * 0.38) * (1.0 - dim))
                ctx.beginPath()
                ctx.moveTo(nx0, nyBase)
                ctx.lineTo(nx1, nyBase)
                ctx.lineTo(nx1, nyTop)
                ctx.lineTo(nx0, nyTop)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        }
        ctx.restore()
    }

    // =========================================================================
    // SUB-SYSTEM 3: L1 BEAT SHAPES & 3D ARCADE VECTOR CRAFT
    // (Spawning at the distant vanishing point and moving all the way OFF screen;
    //  skipped when Battlezone `l1Mode === 4` is active since Mode 4 renders its own 3D terrain & airborne craft!)
    // =========================================================================
    var shapeStyle = cfg && cfg.layer1ShapeStyle !== undefined ? ((Number(cfg.layer1ShapeStyle) || 0) % LAYER1_SHAPE_STYLES.length) : 0
    if (shapesOn && (!(fieldOn && !gpuL1Active && l1Mode === 4) || shapeStyle >= 6) && state.shockwaves.length > 0) {
        var shapeSpin = cfg && cfg.layer1ShapeSpin !== undefined ? clamp(Number(cfg.layer1ShapeSpin), -2.5, 2.5) : 0.25
        var shapeScale = cfg && cfg.layer1ShapeScale !== undefined ? clamp(Number(cfg.layer1ShapeScale), 0.3, 2.5) : 1.0
        var shapeDensityDraw = cfg && cfg.layer1ShapeDensity !== undefined ? clamp(Number(cfg.layer1ShapeDensity), 0.25, 2.5) : 1.0
        var shapeFillRatio = cfg && cfg.layer1ShapeFillRatio !== undefined ? clamp(Number(cfg.layer1ShapeFillRatio), 0.0, 1.0) : 0.35
        var shapeFillOpacity = cfg && cfg.layer1ShapeFillOpacity !== undefined ? clamp(Number(cfg.layer1ShapeFillOpacity), 0.05, 1.0) : 0.55
        _activeShapeFillOpacity = shapeFillOpacity
        var shapesOpac = cfg && cfg.layer1ShapesOpacity !== undefined ? clamp(Number(cfg.layer1ShapesOpacity), 0.05, 1.0) : 1.0
        var drawTargetCount = shapeDensityDraw <= 1.5
            ? Math.round(1.0 + Math.pow((shapeDensityDraw - 0.25) / 1.25, 1.15) * 4.0)
            : Math.round(5.0 + Math.pow(shapeDensityDraw - 1.5, 0.78) * 3.0)
        var maxDrawShapes = Math.max(1, Math.min(state.shockwaves.length, Math.min(8, drawTargetCount)))

        ctx.save()
        ctx.globalAlpha = shapesOpac
        ctx.globalCompositeOperation = "source-over"
        for (var sw = 0; sw < maxDrawShapes; sw++) {
            var wave = state.shockwaves[sw]
            var uProg = clamp(wave.r / 1.60, 0.0, 1.15)
            var wSizeMul = wave.sizeMul !== undefined ? wave.sizeMul : (0.52 + ((sw * 29) % 7) * 0.06)
            // Perspective size grows from a tiny pinpoint at the distant horizon/vanishing point and expands only as it nears the viewer
            var wr = Math.pow(uProg, 1.95) * diagR * 0.56 * shapeScale * wSizeMul
            var wLaneX = wave.laneX !== undefined ? wave.laneX : (((sw % 3) - 1) * 0.32)
            var wLaneY = wave.laneY !== undefined ? wave.laneY : ((sw % 2 === 0 ? -1 : 1) * 0.22)
            var laneOffset = wLaneX * w * Math.pow(uProg, 1.20)
            var wcx = lerp(vanishX, cx + laneOffset, Math.min(1.0, uProg * 1.15))
            var craftVar = (wave.variant !== undefined ? wave.variant : sw) % 3
            var isGroundUnit = (shapeStyle === 0 || (shapeStyle === 2 && (sw & 1) === 1) || (shapeStyle === 12 && craftVar === 1))
            var wcy = isGroundUnit
                ? lerp(horizonY, h * 0.96, Math.pow(uProg, 1.45))
                : ((fieldOn && l1Mode === 4)
                    ? lerp(horizonY - h * 0.06, h * (0.26 + wLaneY * 0.45) + Math.sin(l1T * 1.5 + sw) * h * 0.06, Math.min(1.0, uProg * 1.1))
                    : lerp(cy + endPt.dy * 0.35, cy + wLaneY * h * uProg, uProg))
            var spinAngle = l1T * shapeSpin * 0.85 + (shapeSpin !== 0 ? sw * 0.25 : 0.0)
            var distFadeIn = smoothstep(0.0, 0.08, uProg)
            var nearFadeOut = 1.0 - smoothstep(0.90, 1.14, uProg)
            var sAlpha = clamp(wave.alpha * (1.0 - dim * 0.65) * distFadeIn * nearFadeOut * 1.18, 0.08, 0.99) * shapesOpac
            var craftStrokeCol = hslToHex(wave.hueOffset, 1.0, 0.66, 1.0)
            var craftLineW = (1.65 + state.bass * 1.65) * Math.sqrt(shapeScale * wSizeMul) * (0.52 + 0.52 * Math.min(1.0, uProg))
            ctx.beginPath()

            // True 3-axis 3D rotation angles (rx, ry, rz) with per-shape randomised spinX, spinY, spinZ
            var spinRate = (shapeSpin !== 0.0) ? shapeSpin : 0.45
            var spX = wave.spinX !== undefined ? wave.spinX : 0.85
            var spY = wave.spinY !== undefined ? wave.spinY : 1.00
            var spZ = wave.spinZ !== undefined ? wave.spinZ : 0.65
            var ry3 = l1T * spinRate * spY * 0.95 + sw * 1.15
            var rx3 = Math.sin(l1T * 0.75 + sw * 1.65) * 0.38 + l1T * spinRate * spX * 0.52
            var rz3 = Math.cos(l1T * 0.62 + sw * 1.35) * 0.30 + spinAngle * spZ * 0.45

            if (shapeStyle === 1) {
                // 1: 1983 Atari Color-QuadraScan XY Vector Star Wars Craft (Standard TIE, Vader TIE Advanced x1, Rebel X-Wing)
                var cs = Math.max(2.5, wr * 0.38)
                var swPitch = Math.sin(l1T * 1.15 + sw * 1.9) * 0.34 + rx3 * 0.25
                var swYaw = Math.cos(l1T * 0.95 + sw * 1.5) * 0.48 + ry3 * 0.35
                var swRoll = Math.sin(l1T * 1.4 + sw * 2.1) * 0.32 + rz3 * 0.35
                drawMultiColourStarWarsFighter(
                    ctx, craftVar, wcx, wcy, cs,
                    swPitch, swYaw, swRoll,
                    craftLineW,
                    sAlpha * 0.96, null, undefined, undefined, shapeFillRatio, sw, palette
                )
            } else if (shapeStyle === 0) {
                // 0: 3D Battlezone Tanks (1980 Atari Battlezone 3D Wireframe Vector Tank rotating in 3D!)
                var ts = Math.max(2.5, wr * 0.36)
                var tankPitch = 0.22 + Math.sin(l1T * 0.85 + sw * 1.4) * 0.14
                var tankYaw = Math.sin(l1T * 0.9 + sw * 1.7) * 0.52 + spinAngle * spY * 0.45
                var tankRoll = Math.cos(l1T * 0.7 + sw * 1.1) * 0.12
                var turYaw = Math.sin(l1T * 1.45 + sw * 2.1) * 0.65
                var gunEl = 0.08 + state.beatPulse * 0.14
                var radSp = l1T * 4.5 + sw * 1.3
                append3DWireframeTank(ctx, wcx, wcy, ts, tankPitch, tankYaw, tankRoll, turYaw, gunEl, radSp, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 2) {
                // 2: 3D TRON Recognizers (1982 TRON 3D Wireframe Arch Craft rotating in 3D!)
                var rs = Math.max(3.0, wr * 0.40)
                var rHover = Math.sin(l1T * 2.4 + sw) * rs * 0.08
                var rcy = wcy + rHover
                var recPitch = 0.14 + Math.sin(l1T * 0.8 + sw) * 0.16
                var recYaw = Math.sin(l1T * 0.95 + sw * 1.5) * 0.55 + spinAngle * 0.45
                var recRoll = Math.cos(l1T * 0.75 + sw * 1.2) * 0.12
                var recFaces = []
                var recEdgeSegs = []

                function recBox(x0, y0, z0, x1, y1, z1) {
                    var bv = [
                        [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
                        [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]
                    ]
                    var bp = []
                    for (var bi = 0; bi < 8; bi++) {
                        bp.push(project3DPoint(bv[bi][0], bv[bi][1], bv[bi][2], recPitch, recYaw, recRoll, wcx, rcy, rs, 3.8))
                    }
                    recFaces.push(
                        [bp[0], bp[1], bp[5], bp[4]],
                        [bp[2], bp[3], bp[7], bp[6]],
                        [bp[0], bp[1], bp[2], bp[3]],
                        [bp[1], bp[2], bp[6], bp[5]],
                        [bp[3], bp[0], bp[4], bp[7]]
                    )
                    var bEdges = [
                        0, 1,  1, 2,  2, 3,  3, 0,
                        4, 5,  5, 6,  6, 7,  7, 4,
                        0, 4,  1, 5,  2, 6,  3, 7
                    ]
                    for (var be = 0; be < bEdges.length; be += 2) {
                        recEdgeSegs.push(bp[bEdges[be]], bp[bEdges[be + 1]])
                    }
                }
                // Floating upper command eye block + main horizontal bridge + left/right legs + foot pads
                recBox(-0.48, -0.88, -0.22,  0.48, -0.72, 0.22)
                recBox(-0.82, -0.62, -0.28,  0.82, -0.34, 0.28)
                recBox(-0.80, -0.34, -0.24, -0.44,  0.54, 0.24)
                recBox( 0.44, -0.34, -0.24,  0.80,  0.54, 0.24)
                recBox(-0.96,  0.54, -0.32, -0.38,  0.72, 0.32)
                recBox( 0.38,  0.54, -0.32,  0.96,  0.72, 0.32)
                fillCraftFaces(ctx, recFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var rse = 0; rse < recEdgeSegs.length; rse += 2) {
                    ctx.moveTo(recEdgeSegs[rse].x, recEdgeSegs[rse].y)
                    ctx.lineTo(recEdgeSegs[rse + 1].x, recEdgeSegs[rse + 1].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 3) {
                // 3: 3D Sacred Polyhedra (Dual-Ring 3D Prism / Antiprism rotating in 3-axis 3D!)
                var sides = wave.sides || 6
                var topPts = []
                var botPts = []
                for (var v = 0; v < sides; v++) {
                    var ang0 = (v / sides) * Math.PI * 2
                    var px3 = Math.cos(ang0)
                    var py3 = Math.sin(ang0)
                    topPts.push(project3DPoint(px3, py3,  0.32, rx3, ry3, rz3, wcx, wcy, wr * 0.85, 3.6))
                    botPts.push(project3DPoint(px3, py3, -0.32, rx3, ry3, rz3, wcx, wcy, wr * 0.85, 3.6))
                }
                var polyFaces = [topPts, botPts]
                for (var pf3 = 0; pf3 < sides; pf3++) {
                    var n3 = (pf3 + 1) % sides
                    polyFaces.push([topPts[pf3], topPts[n3], botPts[n3], botPts[pf3]])
                }
                fillCraftFaces(ctx, polyFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var v1 = 0; v1 <= sides; v1++) {
                    var pT = topPts[v1 % sides]
                    if (v1 === 0) ctx.moveTo(pT.x, pT.y)
                    else ctx.lineTo(pT.x, pT.y)
                }
                for (var v2 = 0; v2 <= sides; v2++) {
                    var pB = botPts[v2 % sides]
                    if (v2 === 0) ctx.moveTo(pB.x, pB.y)
                    else ctx.lineTo(pB.x, pB.y)
                }
                for (var v3 = 0; v3 < sides; v3++) {
                    ctx.moveTo(topPts[v3].x, topPts[v3].y)
                    ctx.lineTo(botPts[v3].x, botPts[v3].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 4) {
                // 4: 3D Merkaba Starbursts (3D Star Tetrahedron / Dual-Apex 3D Star rotating in 3-axis 3D!)
                var pts2 = (wave.sides || 6) * 2
                var starRing = []
                for (var sv = 0; sv < pts2; sv++) {
                    var ang2 = (sv / pts2) * Math.PI * 2
                    var r2 = (sv % 2 === 0) ? 1.0 : 0.48
                    var sz = (sv % 2 === 0) ? ((sv % 4 === 0) ? 0.28 : -0.28) : 0.0
                    var sPt = project3DPoint(Math.cos(ang2) * r2, Math.sin(ang2) * r2, sz, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                    starRing.push(sPt)
                }
                var apexFront = project3DPoint(0, 0,  0.65, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                var apexBack  = project3DPoint(0, 0, -0.65, rx3, ry3, rz3, wcx, wcy, wr * 0.90, 3.6)
                var merkFaces = []
                for (var mf4 = 0; mf4 < pts2; mf4 += 2) {
                    var mn4 = (mf4 + 1) % pts2
                    var mp4 = (mf4 + pts2 - 1) % pts2
                    merkFaces.push(
                        [starRing[mf4], starRing[mn4], apexFront],
                        [starRing[mf4], starRing[mp4], apexBack]
                    )
                }
                fillCraftFaces(ctx, merkFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var sv1 = 0; sv1 < pts2; sv1++) {
                    if (sv1 === 0) ctx.moveTo(starRing[sv1].x, starRing[sv1].y)
                    else ctx.lineTo(starRing[sv1].x, starRing[sv1].y)
                }
                ctx.closePath()
                for (var sv2 = 0; sv2 < pts2; sv2 += 2) {
                    ctx.moveTo(starRing[sv2].x, starRing[sv2].y)
                    ctx.lineTo(apexFront.x, apexFront.y)
                    ctx.moveTo(starRing[sv2].x, starRing[sv2].y)
                    ctx.lineTo(apexBack.x, apexBack.y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 5) {
                // 5: 3D Sonic Boom Rings (3D Gyroscopic Harmonic Wave Rings tilting in 3-axis 3D!)
                var ringSegs = 28
                var outerPts5 = []
                var innerPts5 = []
                for (var rs2 = 0; rs2 < ringSegs; rs2++) {
                    var ang1 = (rs2 / ringSegs) * Math.PI * 2
                    var mod1 = 1.0 + Math.sin(ang1 * 4.0) * state.bass * 0.08
                    var rzWave = Math.sin(ang1 * 3.0 + l1T * 2.5) * 0.18 * (0.4 + state.bass)
                    outerPts5.push(project3DPoint(Math.cos(ang1) * mod1, Math.sin(ang1) * mod1, rzWave, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, wr * 0.92, 3.6))
                    innerPts5.push(project3DPoint(Math.cos(ang1) * mod1 * 0.68, Math.sin(ang1) * mod1 * 0.68, -rzWave * 0.65, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, wr * 0.92, 3.6))
                }
                var ringFaces5 = []
                for (var rf5 = 0; rf5 < ringSegs; rf5++) {
                    var rn5 = (rf5 + 1) % ringSegs
                    ringFaces5.push([outerPts5[rf5], outerPts5[rn5], innerPts5[rn5], innerPts5[rf5]])
                }
                fillCraftFaces(ctx, ringFaces5, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var ro5 = 0; ro5 <= ringSegs; ro5++) {
                    var pO5 = outerPts5[ro5 % ringSegs]
                    if (ro5 === 0) ctx.moveTo(pO5.x, pO5.y)
                    else ctx.lineTo(pO5.x, pO5.y)
                }
                for (var ri5 = 0; ri5 <= ringSegs; ri5++) {
                    var pI5 = innerPts5[ri5 % ringSegs]
                    if (ri5 === 0) ctx.moveTo(pI5.x, pI5.y)
                    else ctx.lineTo(pI5.x, pI5.y)
                }
                for (var rk5 = 0; rk5 < ringSegs; rk5 += 2) {
                    ctx.moveTo(outerPts5[rk5].x, outerPts5[rk5].y)
                    ctx.lineTo(innerPts5[rk5].x, innerPts5[rk5].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 6) {
                // 6: Elite Cobra Mk III (1984 Acorn/BBC Micro 3D Wireframe Cobra Mk III Hull & Twin Exhausts)
                var cobraS = Math.max(3.0, wr * 0.46)
                var cVerts = [
                    [ 0.00,  0.00,  0.92], // 0: Nose tip
                    [-0.48, -0.08,  0.42], // 1: Front port wing leading edge
                    [ 0.48, -0.08,  0.42], // 2: Front starboard wing leading edge
                    [-1.08,  0.04, -0.38], // 3: Outer port wingtip
                    [ 1.08,  0.04, -0.38], // 4: Outer starboard wingtip
                    [-0.68, -0.22, -0.68], // 5: Aft dorsal port corner
                    [ 0.68, -0.22, -0.68], // 6: Aft dorsal starboard corner
                    [ 0.00, -0.34, -0.15], // 7: Canopy peak ridge
                    [-0.68,  0.22, -0.68], // 8: Aft ventral port corner
                    [ 0.68,  0.22, -0.68], // 9: Aft ventral starboard corner
                    [ 0.00,  0.00,  1.22]  // 10: Front military laser lance
                ]
                var cp6 = []
                for (var ci6 = 0; ci6 < cVerts.length; ci6++) {
                    cp6.push(project3DPoint(cVerts[ci6][0], cVerts[ci6][1], cVerts[ci6][2], rx3 * 0.55, ry3 * 0.65, rz3 * 0.45, wcx, wcy, cobraS, 3.8))
                }
                fillCraftFaces(ctx, [
                    [cp6[0], cp6[1], cp6[7]],
                    [cp6[0], cp6[2], cp6[7]],
                    [cp6[1], cp6[3], cp6[5], cp6[7]],
                    [cp6[2], cp6[4], cp6[6], cp6[7]],
                    [cp6[5], cp6[6], cp6[7]],
                    [cp6[5], cp6[6], cp6[9], cp6[8]],
                    [cp6[0], cp6[1], cp6[3], cp6[8]],
                    [cp6[0], cp6[2], cp6[4], cp6[9]]
                ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                var cEdges6 = [
                    0,1, 0,2, 1,2, 1,3, 2,4, 3,5, 4,6, 5,6,
                    0,7, 1,7, 2,7, 5,7, 6,7,
                    0,8, 0,9, 3,8, 4,9, 8,9, 5,8, 6,9, 0,10
                ]
                for (var ce6 = 0; ce6 < cEdges6.length; ce6 += 2) {
                    ctx.moveTo(cp6[cEdges6[ce6]].x, cp6[cEdges6[ce6]].y)
                    ctx.lineTo(cp6[cEdges6[ce6 + 1]].x, cp6[cEdges6[ce6 + 1]].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 7) {
                // 7: Tempest Claw & Flippers (1981 Atari Tempest 3D Yellow Blaster Claw, Bowtie Flippers & Spikers)
                var tempS = Math.max(3.0, wr * 0.44)
                if (craftVar === 0) {
                    // Tempest Yellow 3D Player Claw
                    var clawJaw = 0.25 + 0.18 * Math.sin(l1T * 6.0 + sw)
                    var clV = [
                        [ 0.0,  0.42,  0.18], [-0.55,  0.12,  0.0], [ 0.55,  0.12,  0.0],
                        [-0.85, -0.35,  0.22], [ 0.85, -0.35,  0.22],
                        [-0.45 - clawJaw, -0.88, -0.18], [ 0.45 + clawJaw, -0.88, -0.18],
                        [-0.22, -0.25, -0.24], [ 0.22, -0.25, -0.24]
                    ]
                    var cp7 = []
                    for (var i7 = 0; i7 < clV.length; i7++) {
                        cp7.push(project3DPoint(clV[i7][0], clV[i7][1], clV[i7][2], rx3 * 0.5, ry3 * 0.6, rz3, wcx, wcy, tempS, 3.6))
                    }
                    fillCraftFaces(ctx, [
                        [cp7[0], cp7[1], cp7[7]],
                        [cp7[0], cp7[2], cp7[8]],
                        [cp7[1], cp7[3], cp7[5], cp7[7]],
                        [cp7[2], cp7[4], cp7[6], cp7[8]],
                        [cp7[0], cp7[7], cp7[8]]
                    ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    var clE = [0,1, 0,2, 1,3, 2,4, 3,5, 4,6, 5,7, 6,8, 7,8, 0,7, 0,8, 1,7, 2,8]
                    for (var e7 = 0; e7 < clE.length; e7 += 2) {
                        ctx.moveTo(cp7[clE[e7]].x, cp7[clE[e7]].y)
                        ctx.lineTo(cp7[clE[e7 + 1]].x, cp7[clE[e7 + 1]].y)
                    }
                } else {
                    // Tempest 3D Bowtie Flipper
                    var flV = [
                        [-0.92, -0.52,  0.18], [-0.92,  0.52, -0.18],
                        [ 0.00, -0.16,  0.26], [ 0.00,  0.16, -0.26],
                        [ 0.92, -0.52, -0.18], [ 0.92,  0.52,  0.18]
                    ]
                    var fp7 = []
                    for (var f7 = 0; f7 < flV.length; f7++) {
                        fp7.push(project3DPoint(flV[f7][0], flV[f7][1], flV[f7][2], rx3, ry3, rz3, wcx, wcy, tempS, 3.6))
                    }
                    fillCraftFaces(ctx, [
                        [fp7[0], fp7[1], fp7[3], fp7[2]],
                        [fp7[2], fp7[3], fp7[4], fp7[5]],
                        [fp7[0], fp7[2], fp7[4]],
                        [fp7[1], fp7[3], fp7[5]]
                    ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    var flE = [0,1, 0,3, 1,2, 2,3, 2,5, 3,4, 4,5, 0,4, 1,5]
                    for (var fe7 = 0; fe7 < flE.length; fe7 += 2) {
                        ctx.moveTo(fp7[flE[fe7]].x, fp7[flE[fe7]].y)
                        ctx.lineTo(fp7[flE[fe7 + 1]].x, fp7[flE[fe7 + 1]].y)
                    }
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 8) {
                // 8: Asteroids Deluxe Ship & UFO (1979/1980 Atari 3D Vector A-Frame Wedge Ship & Twin-Dome Saucer UFO)
                var astS = Math.max(3.0, wr * 0.44)
                if (craftVar !== 1) {
                    // 3D A-Frame Vector Ship + Thruster Flame
                    var shV = [
                        [ 0.00, -0.95,  0.00], // 0: Nose
                        [-0.68,  0.78,  0.20], // 1: Port wingtip dorsal
                        [ 0.68,  0.78,  0.20], // 2: Starboard wingtip dorsal
                        [-0.38,  0.44,  0.00], // 3: Aft crossbar port
                        [ 0.38,  0.44,  0.00], // 4: Aft crossbar starboard
                        [ 0.00,  0.10,  0.34], // 5: Dorsal spine
                        [ 0.00,  0.10, -0.34], // 6: Ventral spine
                        [ 0.00,  0.96 + state.bassSmooth * 0.45, 0.00] // 7: Thruster flame tip
                    ]
                    var sp8 = []
                    for (var i8 = 0; i8 < shV.length; i8++) {
                        sp8.push(project3DPoint(shV[i8][0], shV[i8][1], shV[i8][2], rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, astS, 3.6))
                    }
                    fillCraftFaces(ctx, [
                        [sp8[0], sp8[1], sp8[3], sp8[5]],
                        [sp8[0], sp8[2], sp8[4], sp8[5]],
                        [sp8[0], sp8[3], sp8[6]],
                        [sp8[0], sp8[4], sp8[6]],
                        [sp8[3], sp8[4], sp8[7]]
                    ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    var shE = [0,1, 0,2, 1,3, 2,4, 3,4, 0,5, 5,3, 5,4, 0,6, 6,3, 6,4, 3,7, 4,7]
                    for (var e8 = 0; e8 < shE.length; e8 += 2) {
                        ctx.moveTo(sp8[shE[e8]].x, sp8[shE[e8]].y)
                        ctx.lineTo(sp8[shE[e8 + 1]].x, sp8[shE[e8 + 1]].y)
                    }
                } else {
                    // Classic Atari Vector Saucer UFO
                    var ufoSegs = 8
                    var rim8 = [], top8 = [], bot8 = [], ufoFaces8 = []
                    for (var u8 = 0; u8 < ufoSegs; u8++) {
                        var ua8 = (u8 / ufoSegs) * Math.PI * 2.0
                        var ux8 = Math.cos(ua8), uz8 = Math.sin(ua8)
                        rim8.push(project3DPoint(ux8 * 1.0,  0.05, uz8 * 1.0, rx3 * 0.45, ry3, rz3 * 0.35, wcx, wcy, astS, 3.6))
                        top8.push(project3DPoint(ux8 * 0.52, -0.28, uz8 * 0.52, rx3 * 0.45, ry3, rz3 * 0.35, wcx, wcy, astS, 3.6))
                        bot8.push(project3DPoint(ux8 * 0.58,  0.32, uz8 * 0.58, rx3 * 0.45, ry3, rz3 * 0.35, wcx, wcy, astS, 3.6))
                    }
                    for (var uf8 = 0; uf8 < ufoSegs; uf8++) {
                        var nuf8 = (uf8 + 1) % ufoSegs
                        ufoFaces8.push(
                            [rim8[uf8], rim8[nuf8], top8[nuf8], top8[uf8]],
                            [rim8[uf8], rim8[nuf8], bot8[nuf8], bot8[uf8]]
                        )
                    }
                    fillCraftFaces(ctx, ufoFaces8, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    for (var k8 = 0; k8 < ufoSegs; k8++) {
                        var nk8 = (k8 + 1) % ufoSegs
                        ctx.moveTo(rim8[k8].x, rim8[k8].y); ctx.lineTo(rim8[nk8].x, rim8[nk8].y)
                        ctx.moveTo(top8[k8].x, top8[k8].y); ctx.lineTo(top8[nk8].x, top8[nk8].y)
                        ctx.moveTo(bot8[k8].x, bot8[k8].y); ctx.lineTo(bot8[nk8].x, bot8[nk8].y)
                        ctx.moveTo(rim8[k8].x, rim8[k8].y); ctx.lineTo(top8[k8].x, top8[k8].y)
                        ctx.moveTo(rim8[k8].x, rim8[k8].y); ctx.lineTo(bot8[k8].x, bot8[k8].y)
                    }
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 9) {
                // 9: Red Baron 3D Biplanes (1980 Atari Red Baron 3D Wireframe Biplane with Spinning Propeller & Struts)
                var bpS = Math.max(3.0, wr * 0.44)
                var bpPitch = Math.sin(l1T * 0.9 + sw) * 0.25
                var bpYaw = Math.cos(l1T * 0.75 + sw * 1.4) * 0.55 + spinAngle * 0.35
                var bpRoll = Math.sin(l1T * 1.1 + sw * 1.8) * 0.32
                var bpV = [
                    // Upper wing (0..3)
                    [-1.05, -0.32,  0.22], [ 1.05, -0.32,  0.22], [ 1.05, -0.32, -0.10], [-1.05, -0.32, -0.10],
                    // Lower wing (4..7)
                    [-0.92,  0.18,  0.20], [ 0.92,  0.18,  0.20], [ 0.92,  0.18, -0.10], [-0.92,  0.18, -0.10],
                    // Fuselage nose & tail (8..12)
                    [ 0.00, -0.05,  0.58], [ 0.00, -0.05, -0.92],
                    [-0.38, -0.05, -0.88], [ 0.38, -0.05, -0.88],
                    [ 0.00, -0.42, -0.88]
                ]
                var bpp9 = []
                for (var i9 = 0; i9 < bpV.length; i9++) {
                    bpp9.push(project3DPoint(bpV[i9][0], bpV[i9][1], bpV[i9][2], bpPitch, bpYaw, bpRoll, wcx, wcy, bpS, 3.8))
                }
                fillCraftFaces(ctx, [
                    [bpp9[0], bpp9[1], bpp9[2], bpp9[3]],
                    [bpp9[4], bpp9[5], bpp9[6], bpp9[7]],
                    [bpp9[8], bpp9[0], bpp9[4]],
                    [bpp9[8], bpp9[1], bpp9[5]],
                    [bpp9[9], bpp9[10], bpp9[11]],
                    [bpp9[8], bpp9[9], bpp9[12]]
                ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                var bpE = [
                    0,1, 1,2, 2,3, 3,0,
                    4,5, 5,6, 6,7, 7,4,
                    0,4, 1,5, 2,6, 3,7,
                    8,9, 10,11, 9,12, 8,0, 8,1, 8,4, 8,5
                ]
                for (var e9 = 0; e9 < bpE.length; e9 += 2) {
                    ctx.moveTo(bpp9[bpE[e9]].x, bpp9[bpE[e9]].y)
                    ctx.lineTo(bpp9[bpE[e9 + 1]].x, bpp9[bpE[e9 + 1]].y)
                }
                // Spinning 3D propeller blades
                var propAng = l1T * 18.0 + sw
                var pA = project3DPoint(Math.cos(propAng) * 0.42, -0.05 + Math.sin(propAng) * 0.42, 0.62, bpPitch, bpYaw, bpRoll, wcx, wcy, bpS, 3.8)
                var pB = project3DPoint(-Math.cos(propAng) * 0.42, -0.05 - Math.sin(propAng) * 0.42, 0.62, bpPitch, bpYaw, bpRoll, wcx, wcy, bpS, 3.8)
                ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y)
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 10) {
                // 10: Lunar Lander Apollo LEM (1979 Atari Lunar Lander 3D Ascent Module, Landing Legs & Thruster Plume)
                var lemS = Math.max(3.0, wr * 0.42)
                var lemPitch = 0.18 + Math.sin(l1T * 0.8 + sw) * 0.18
                var lemYaw = ry3 * 0.65
                var lemRoll = Math.cos(l1T * 0.7 + sw) * 0.16
                var octSegs = 6
                var ascTop = [], ascMid = [], descBot = [], lemFaces10 = []
                for (var l10 = 0; l10 < octSegs; l10++) {
                    var la10 = (l10 / octSegs) * Math.PI * 2.0
                    var lx10 = Math.cos(la10), lz10 = Math.sin(la10)
                    ascTop.push(project3DPoint(lx10 * 0.42, -0.68, lz10 * 0.42, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8))
                    ascMid.push(project3DPoint(lx10 * 0.58, -0.15, lz10 * 0.58, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8))
                    descBot.push(project3DPoint(lx10 * 0.64,  0.28, lz10 * 0.64, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8))
                }
                lemFaces10.push(ascTop)
                for (var lf10 = 0; lf10 < octSegs; lf10++) {
                    var nlf10 = (lf10 + 1) % octSegs
                    lemFaces10.push(
                        [ascTop[lf10], ascTop[nlf10], ascMid[nlf10], ascMid[lf10]],
                        [ascMid[lf10], ascMid[nlf10], descBot[nlf10], descBot[lf10]]
                    )
                }
                fillCraftFaces(ctx, lemFaces10, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var k10 = 0; k10 < octSegs; k10++) {
                    var nk10 = (k10 + 1) % octSegs
                    ctx.moveTo(ascTop[k10].x, ascTop[k10].y); ctx.lineTo(ascTop[nk10].x, ascTop[nk10].y)
                    ctx.moveTo(ascMid[k10].x, ascMid[k10].y); ctx.lineTo(ascMid[nk10].x, ascMid[nk10].y)
                    ctx.moveTo(descBot[k10].x, descBot[k10].y); ctx.lineTo(descBot[nk10].x, descBot[nk10].y)
                    ctx.moveTo(ascTop[k10].x, ascTop[k10].y); ctx.lineTo(ascMid[k10].x, ascMid[k10].y)
                    ctx.moveTo(ascMid[k10].x, ascMid[k10].y); ctx.lineTo(descBot[k10].x, descBot[k10].y)
                }
                // 4 Splayed Landing Legs & Footpads + Descent Thruster Plume
                for (var leg10 = 0; leg10 < 4; leg10++) {
                    var legA = (leg10 / 4) * Math.PI * 2.0 + Math.PI * 0.25
                    var knee = project3DPoint(Math.cos(legA) * 0.60, 0.22, Math.sin(legA) * 0.60, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8)
                    var foot = project3DPoint(Math.cos(legA) * 0.98, 0.72, Math.sin(legA) * 0.98, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8)
                    ctx.moveTo(knee.x, knee.y); ctx.lineTo(foot.x, foot.y)
                    ctx.moveTo(foot.x - 4, foot.y); ctx.lineTo(foot.x + 4, foot.y)
                }
                var plumeTip = project3DPoint(0.0, 0.78 + state.bassSmooth * 0.55, 0.0, lemPitch, lemYaw, lemRoll, wcx, wcy, lemS, 3.8)
                ctx.moveTo(descBot[0].x, descBot[0].y); ctx.lineTo(plumeTip.x, plumeTip.y)
                ctx.moveTo(descBot[3].x, descBot[3].y); ctx.lineTo(plumeTip.x, plumeTip.y)
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 11) {
                // 11: Star Castle Energy Rings (1980 Cinematronics Star Castle Counter-Rotating 3D Shield Rings & Star Cannon)
                var scS = Math.max(3.0, wr * 0.82)
                var scFaces11 = []
                var scSegEdges11 = []
                for (var r11 = 0; r11 < 3; r11++) {
                    var rad11 = 0.42 + r11 * 0.26
                    var radIn11 = rad11 - 0.11
                    var dir11 = (r11 % 2 === 0) ? 1.0 : -1.0
                    var segs11 = 8
                    for (var s11 = 0; s11 < segs11; s11++) {
                        var a0_11 = (s11 / segs11) * Math.PI * 2.0 + l1T * dir11 * (1.2 - r11 * 0.25)
                        var a1_11 = ((s11 + 0.78) / segs11) * Math.PI * 2.0 + l1T * dir11 * (1.2 - r11 * 0.25)
                        var p0_11 = project3DPoint(Math.cos(a0_11) * rad11, Math.sin(a0_11) * rad11, (r11 - 1) * 0.14, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                        var p1_11 = project3DPoint(Math.cos(a1_11) * rad11, Math.sin(a1_11) * rad11, (r11 - 1) * 0.14, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                        var q0_11 = project3DPoint(Math.cos(a0_11) * radIn11, Math.sin(a0_11) * radIn11, (r11 - 1) * 0.14, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                        var q1_11 = project3DPoint(Math.cos(a1_11) * radIn11, Math.sin(a1_11) * radIn11, (r11 - 1) * 0.14, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                        scFaces11.push([p0_11, p1_11, q1_11, q0_11])
                        scSegEdges11.push(p0_11, p1_11, q0_11, q1_11, p0_11, q0_11, p1_11, q1_11)
                    }
                }
                fillCraftFaces(ctx, scFaces11, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var se11 = 0; se11 < scSegEdges11.length; se11 += 2) {
                    ctx.moveTo(scSegEdges11[se11].x, scSegEdges11[se11].y)
                    ctx.lineTo(scSegEdges11[se11 + 1].x, scSegEdges11[se11 + 1].y)
                }
                // Central Star Cannon
                for (var spk11 = 0; spk11 < 6; spk11++) {
                    var sa11 = (spk11 / 6) * Math.PI * 2.0 - rz3 * 1.5
                    var cIn = project3DPoint(0.0, 0.0, 0.0, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                    var cOut = project3DPoint(Math.cos(sa11) * 0.28, Math.sin(sa11) * 0.28, 0.0, rx3 * 0.55, ry3 * 0.55, rz3, wcx, wcy, scS, 3.6)
                    ctx.moveTo(cIn.x, cIn.y); ctx.lineTo(cOut.x, cOut.y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 12) {
                // 12: Battlezone Saucers & Pyramids (1980 Atari Battlezone 3D Saucer UFO, Obstacle Pyramid & Guided Missile)
                var bzS = Math.max(3.0, wr * 0.44)
                if (craftVar === 1) {
                    // 3D Wireframe Obstacle Pyramid
                    var pyrApex = project3DPoint(0.0, -0.88, 0.0, 0.18, ry3 * 0.65, 0.0, wcx, wcy, bzS, 3.6)
                    var pyrBase = []
                    for (var pb12 = 0; pb12 < 4; pb12++) {
                        var pa12 = (pb12 / 4) * Math.PI * 2.0 + Math.PI * 0.25
                        pyrBase.push(project3DPoint(Math.cos(pa12) * 0.85, 0.55, Math.sin(pa12) * 0.85, 0.18, ry3 * 0.65, 0.0, wcx, wcy, bzS, 3.6))
                    }
                    fillCraftFaces(ctx, [
                        [pyrBase[0], pyrBase[1], pyrApex],
                        [pyrBase[1], pyrBase[2], pyrApex],
                        [pyrBase[2], pyrBase[3], pyrApex],
                        [pyrBase[3], pyrBase[0], pyrApex],
                        pyrBase
                    ], shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    for (var pe12 = 0; pe12 < 4; pe12++) {
                        var ne12 = (pe12 + 1) % 4
                        ctx.moveTo(pyrBase[pe12].x, pyrBase[pe12].y); ctx.lineTo(pyrBase[ne12].x, pyrBase[ne12].y)
                        ctx.moveTo(pyrBase[pe12].x, pyrBase[pe12].y); ctx.lineTo(pyrApex.x, pyrApex.y)
                    }
                } else {
                    // 3D Battlezone Flying Saucer with Rotating Rim Spokes
                    var bzRim = [], bzTop = [], bzBot = [], bzFaces12 = []
                    for (var u12 = 0; u12 < 8; u12++) {
                        var ua12 = (u12 / 8) * Math.PI * 2.0
                        bzRim.push(project3DPoint(Math.cos(ua12) * 0.98, 0.0, Math.sin(ua12) * 0.98, rx3 * 0.35, ry3, rz3 * 0.25, wcx, wcy, bzS, 3.6))
                        bzTop.push(project3DPoint(Math.cos(ua12) * 0.46, -0.34, Math.sin(ua12) * 0.46, rx3 * 0.35, ry3, rz3 * 0.25, wcx, wcy, bzS, 3.6))
                        bzBot.push(project3DPoint(Math.cos(ua12) * 0.46,  0.24, Math.sin(ua12) * 0.46, rx3 * 0.35, ry3, rz3 * 0.25, wcx, wcy, bzS, 3.6))
                    }
                    for (var bf12 = 0; bf12 < 8; bf12++) {
                        var nbf12 = (bf12 + 1) % 8
                        bzFaces12.push(
                            [bzRim[bf12], bzRim[nbf12], bzTop[nbf12], bzTop[bf12]],
                            [bzRim[bf12], bzRim[nbf12], bzBot[nbf12], bzBot[bf12]]
                        )
                    }
                    fillCraftFaces(ctx, bzFaces12, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                    ctx.beginPath()
                    for (var k12 = 0; k12 < 8; k12++) {
                        var nk12 = (k12 + 1) % 8
                        ctx.moveTo(bzRim[k12].x, bzRim[k12].y); ctx.lineTo(bzRim[nk12].x, bzRim[nk12].y)
                        ctx.moveTo(bzTop[k12].x, bzTop[k12].y); ctx.lineTo(bzTop[nk12].x, bzTop[nk12].y)
                        ctx.moveTo(bzBot[k12].x, bzBot[k12].y); ctx.lineTo(bzBot[nk12].x, bzBot[nk12].y)
                        ctx.moveTo(bzRim[k12].x, bzRim[k12].y); ctx.lineTo(bzTop[k12].x, bzTop[k12].y)
                        ctx.moveTo(bzRim[k12].x, bzRim[k12].y); ctx.lineTo(bzBot[k12].x, bzBot[k12].y)
                    }
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 13) {
                // 13: Vectrex Cosmic Chasm (1982 GCE Vectrex Twin-Rotor Shield-Breaker Drill Ship & Reactor Core)
                var vxS = Math.max(3.0, wr * 0.46)
                var nose13 = project3DPoint(0.0, -1.08, 0.0, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6)
                var tail13 = project3DPoint(0.0,  0.65, 0.0, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6)
                var dorsal13 = project3DPoint(0.0, -0.18, 0.36, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6)
                var podL13 = project3DPoint(-0.54, 0.08, 0.0, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6)
                var podR13 = project3DPoint( 0.54, 0.08, 0.0, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6)
                var vxFaces13 = [
                    [nose13, podL13, dorsal13],
                    [nose13, podR13, dorsal13],
                    [tail13, podL13, dorsal13],
                    [tail13, podR13, dorsal13]
                ]
                var rotorRings13 = []
                for (var pod13 = -1; pod13 <= 1; pod13 += 2) {
                    var rSegs13 = 10
                    var rRing13 = []
                    for (var rs13 = 0; rs13 < rSegs13; rs13++) {
                        var ra13 = (rs13 / rSegs13) * Math.PI * 2.0 + l1T * 4.0 * pod13
                        rRing13.push(project3DPoint(pod13 * 0.54 + Math.cos(ra13) * 0.34, 0.08 + Math.sin(ra13) * 0.34, Math.sin(ra13 * 2.0) * 0.12, rx3 * 0.5, ry3 * 0.5, rz3, wcx, wcy, vxS, 3.6))
                    }
                    vxFaces13.push(rRing13)
                    rotorRings13.push({ c: pod13 < 0 ? podL13 : podR13, ring: rRing13 })
                }
                fillCraftFaces(ctx, vxFaces13, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                ctx.moveTo(nose13.x, nose13.y); ctx.lineTo(tail13.x, tail13.y)
                ctx.moveTo(nose13.x, nose13.y); ctx.lineTo(dorsal13.x, dorsal13.y)
                ctx.moveTo(tail13.x, tail13.y); ctx.lineTo(dorsal13.x, dorsal13.y)
                for (var rr13 = 0; rr13 < rotorRings13.length; rr13++) {
                    var podObj = rotorRings13[rr13]
                    ctx.moveTo(nose13.x, nose13.y); ctx.lineTo(podObj.c.x, podObj.c.y)
                    ctx.moveTo(tail13.x, tail13.y); ctx.lineTo(podObj.c.x, podObj.c.y)
                    ctx.moveTo(dorsal13.x, dorsal13.y); ctx.lineTo(podObj.c.x, podObj.c.y)
                    for (var ri13 = 0; ri13 <= podObj.ring.length; ri13++) {
                        var rpPt = podObj.ring[ri13 % podObj.ring.length]
                        if (ri13 === 0) ctx.moveTo(rpPt.x, rpPt.y)
                        else ctx.lineTo(rpPt.x, rpPt.y)
                    }
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 14) {
                // 14 (UI #15): 3D Botanical Flowers (Sacred 8-Petal 3D Lotus, Golden-Ratio 12-Petal Sunflower & 6-Petal 3D Rose Corolla)
                var flwS = Math.max(3.5, wr * 0.56)
                var flwVar = (wave.variant !== undefined ? wave.variant : sw) % 3
                var petalCount = (flwVar === 0) ? 8 : (flwVar === 1 ? 12 : 6)
                var tiers = (flwVar === 1) ? 2 : 3
                var flwFaces = []
                var flwEdges = []
                var flwCore = project3DPoint(0.0, 0.0, 0.16, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6)
                var bloomOpen = 0.85 + state.bassSmooth * 0.25 + state.beatPulse * 0.18

                for (var tr = 0; tr < tiers; tr++) {
                    var uTr = (tr + 1) / tiers
                    var petLen = (0.45 + uTr * 0.58) * bloomOpen
                    var petWid = (flwVar === 1 ? 0.16 : 0.26) * (0.7 + uTr * 0.4)
                    var cupZ = (1.0 - uTr) * 0.34 - uTr * 0.14 + Math.sin(l1T * 1.8 + tr) * 0.06
                    var tierPhase = (tr * Math.PI) / petalCount

                    for (var pt = 0; pt < petalCount; pt++) {
                        var aMid = (pt / petalCount) * Math.PI * 2.0 + tierPhase
                        var aL = aMid - petWid
                        var aR = aMid + petWid
                        var rBase = 0.14 + tr * 0.08
                        var rMid = petLen * 0.62
                        var pBase = project3DPoint(Math.cos(aMid) * rBase, Math.sin(aMid) * rBase, 0.08, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6)
                        var pLeft = project3DPoint(Math.cos(aL) * rMid, Math.sin(aL) * rMid, cupZ * 0.65, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6)
                        var pTip  = project3DPoint(Math.cos(aMid) * petLen, Math.sin(aMid) * petLen, cupZ, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6)
                        var pRight = project3DPoint(Math.cos(aR) * rMid, Math.sin(aR) * rMid, cupZ * 0.65, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6)
                        flwFaces.push([pBase, pLeft, pTip, pRight])
                        flwEdges.push(pBase, pLeft, pLeft, pTip, pTip, pRight, pRight, pBase, pBase, pTip)
                    }
                }
                // Stamen / Seed-Crown Ring
                var crownRing = []
                for (var cr = 0; cr < 8; cr++) {
                    var ca = (cr / 8) * Math.PI * 2.0
                    crownRing.push(project3DPoint(Math.cos(ca) * 0.22, Math.sin(ca) * 0.22, 0.24, rx3 * 0.65, ry3 * 0.65, rz3, wcx, wcy, flwS, 3.6))
                }
                flwFaces.push(crownRing)
                fillCraftFaces(ctx, flwFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var fe = 0; fe < flwEdges.length; fe += 2) {
                    ctx.moveTo(flwEdges[fe].x, flwEdges[fe].y)
                    ctx.lineTo(flwEdges[fe + 1].x, flwEdges[fe + 1].y)
                }
                for (var cri = 0; cri <= crownRing.length; cri++) {
                    var cpt = crownRing[cri % crownRing.length]
                    if (cri === 0) ctx.moveTo(cpt.x, cpt.y)
                    else ctx.lineTo(cpt.x, cpt.y)
                }
                for (var crs = 0; crs < crownRing.length; crs += 2) {
                    ctx.moveTo(flwCore.x, flwCore.y)
                    ctx.lineTo(crownRing[crs].x, crownRing[crs].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 15) {
                // 15 (UI #16): Classic Religious & Sacred Symbols (Ankh, Star of David, Celtic Cross, Crescent & Star, Dharma Wheel, Yin-Yang Taijitu)
                var symS = Math.max(3.5, wr * 0.54)
                var symKind = ((wave.variant !== undefined ? wave.variant : 0) + sw) % 6
                var symFaces = []
                var symEdges = []
                var zThk = 0.18

                function addSymPrism(loop2D) {
                    var nL = loop2D.length
                    var fPts = [], bPts = []
                    for (var i = 0; i < nL; i++) {
                        fPts.push(project3DPoint(loop2D[i][0], loop2D[i][1],  zThk, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                        bPts.push(project3DPoint(loop2D[i][0], loop2D[i][1], -zThk, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                    }
                    symFaces.push(fPts, bPts)
                    for (var j = 0; j < nL; j++) {
                        var nj = (j + 1) % nL
                        symFaces.push([fPts[j], fPts[nj], bPts[nj], bPts[j]])
                        symEdges.push(fPts[j], fPts[nj], bPts[j], bPts[nj], fPts[j], bPts[j])
                    }
                }

                if (symKind === 0) {
                    // 0: 3D Ankh (Crux Ansata — Egyptian Key of Life)
                    addSymPrism([[-0.12, -0.10], [0.12, -0.10], [0.12, 0.95], [-0.12, 0.95]])
                    addSymPrism([[-0.68, -0.18], [0.68, -0.18], [0.68, 0.04], [-0.68, 0.04]])
                    var ankhOuter = [], ankhInner = []
                    var aSegs = 12
                    for (var ai = 0; ai < aSegs; ai++) {
                        var aa = (ai / aSegs) * Math.PI * 2.0
                        ankhOuter.push(project3DPoint(Math.cos(aa) * 0.36, -0.52 + Math.sin(aa) * 0.42,  zThk, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                        ankhInner.push(project3DPoint(Math.cos(aa) * 0.20, -0.52 + Math.sin(aa) * 0.26, -zThk, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                    }
                    for (var ak = 0; ak < aSegs; ak++) {
                        var nak = (ak + 1) % aSegs
                        symFaces.push([ankhOuter[ak], ankhOuter[nak], ankhInner[nak], ankhInner[ak]])
                        symEdges.push(ankhOuter[ak], ankhOuter[nak], ankhInner[ak], ankhInner[nak], ankhOuter[ak], ankhInner[ak])
                    }
                } else if (symKind === 1) {
                    // 1: 3D Star of David (Hexagram — Interlocked Upper & Lower 3D Triangles)
                    var triUp = [], triDn = []
                    for (var ti = 0; ti < 3; ti++) {
                        var aUp = -Math.PI * 0.5 + (ti * Math.PI * 2.0) / 3.0
                        var aDn =  Math.PI * 0.5 + (ti * Math.PI * 2.0) / 3.0
                        triUp.push([Math.cos(aUp) * 0.96, Math.sin(aUp) * 0.96])
                        triDn.push([Math.cos(aDn) * 0.96, Math.sin(aDn) * 0.96])
                    }
                    addSymPrism(triUp)
                    addSymPrism(triDn)
                } else if (symKind === 2) {
                    // 2: 3D Celtic Cross (Latin Cross + Sacred Nimbus Ring)
                    addSymPrism([[-0.14, -0.95], [0.14, -0.95], [0.14, 1.02], [-0.14, 1.02]])
                    addSymPrism([[-0.74, -0.44], [0.74, -0.44], [0.74, -0.18], [-0.74, -0.18]])
                    var nimbus = []
                    for (var ni = 0; ni < 12; ni++) {
                        var na = (ni / 12) * Math.PI * 2.0
                        nimbus.push(project3DPoint(Math.cos(na) * 0.46, -0.31 + Math.sin(na) * 0.46, 0.0, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                    }
                    for (var nk = 0; nk < 12; nk++) {
                        symEdges.push(nimbus[nk], nimbus[(nk + 1) % 12])
                    }
                } else if (symKind === 3) {
                    // 3: 3D Crescent Moon & 5-Pointed Star
                    var crescPts = []
                    var cSteps = 12
                    for (var ci = 0; ci <= cSteps; ci++) {
                        var ca = -Math.PI * 0.78 + (ci / cSteps) * (Math.PI * 1.56)
                        crescPts.push([Math.cos(ca) * 0.88 - 0.10, Math.sin(ca) * 0.88])
                    }
                    for (var ci2 = cSteps; ci2 >= 0; ci2--) {
                        var ca2 = -Math.PI * 0.64 + (ci2 / cSteps) * (Math.PI * 1.28)
                        crescPts.push([Math.cos(ca2) * 0.62 + 0.16, Math.sin(ca2) * 0.64])
                    }
                    addSymPrism(crescPts)
                    var star5 = []
                    for (var s5 = 0; s5 < 10; s5++) {
                        var sa5 = -Math.PI * 0.5 + (s5 * Math.PI) / 5.0
                        var sr5 = (s5 % 2 === 0) ? 0.36 : 0.15
                        star5.push([0.42 + Math.cos(sa5) * sr5, -0.05 + Math.sin(sa5) * sr5])
                    }
                    addSymPrism(star5)
                } else if (symKind === 4) {
                    // 4: 3D Eight-Spoked Dharma Wheel (Dharmachakra)
                    var dwSegs = 16
                    var dwOut = [], dwIn = []
                    for (var dwi = 0; dwi < dwSegs; dwi++) {
                        var dwa = (dwi / dwSegs) * Math.PI * 2.0
                        dwOut.push(project3DPoint(Math.cos(dwa) * 0.92, Math.sin(dwa) * 0.92,  zThk * 0.7, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                        dwIn.push(project3DPoint(Math.cos(dwa) * 0.70, Math.sin(dwa) * 0.70, -zThk * 0.7, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                    }
                    for (var dwk = 0; dwk < dwSegs; dwk++) {
                        var ndwk = (dwk + 1) % dwSegs
                        symFaces.push([dwOut[dwk], dwOut[ndwk], dwIn[ndwk], dwIn[dwk]])
                        symEdges.push(dwOut[dwk], dwOut[ndwk], dwIn[dwk], dwIn[ndwk])
                    }
                    var dwHub = project3DPoint(0.0, 0.0, 0.0, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6)
                    for (var spk = 0; spk < 8; spk++) {
                        var spA = (spk / 8) * Math.PI * 2.0
                        var spTip = project3DPoint(Math.cos(spA) * 1.06, Math.sin(spA) * 1.06, 0.0, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6)
                        symEdges.push(dwHub, spTip)
                    }
                } else {
                    // 5: 3D Sacred Om / Yin-Yang Taijitu in Octagonal Bagua Frame
                    var baguaOut = []
                    for (var bi = 0; bi < 8; bi++) {
                        var ba = (bi / 8) * Math.PI * 2.0 + Math.PI * 0.125
                        baguaOut.push([Math.cos(ba) * 0.92, Math.sin(ba) * 0.92])
                    }
                    addSymPrism(baguaOut)
                    // S-curve divider & dual polar eyes
                    var sCurve = []
                    for (var si = 0; si <= 12; si++) {
                        var su = (si / 12) * 2.0 - 1.0
                        var sx = Math.sin(su * Math.PI) * 0.36
                        var sy = su * 0.78
                        sCurve.push(project3DPoint(sx, sy, zThk * 1.1, rx3 * 0.6, ry3 * 0.75, rz3 * 0.45, wcx, wcy, symS, 3.6))
                    }
                    for (var sk = 0; sk < 12; sk++) {
                        symEdges.push(sCurve[sk], sCurve[sk + 1])
                    }
                }

                fillCraftFaces(ctx, symFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var se = 0; se < symEdges.length; se += 2) {
                    ctx.moveTo(symEdges[se].x, symEdges[se].y)
                    ctx.lineTo(symEdges[se + 1].x, symEdges[se + 1].y)
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            } else if (shapeStyle === 16) {
                // 16 (UI #17): 3D Platonic Solids (Tetrahedron, Hexahedron/Cube, Octahedron, Dodecahedron, Icosahedron)
                var platS = Math.max(3.5, wr * 0.56)
                var solidKind = ((wave.variant !== undefined ? wave.variant : 0) + sw) % 5
                var pVerts = []
                var pFacesIdx = []
                var phi = 1.6180339887
                var invPhi = 1.0 / phi

                if (solidKind === 0) {
                    // Regular Tetrahedron (4 vertices, 4 faces)
                    pVerts = [
                        [ 1.0,  1.0,  1.0],
                        [ 1.0, -1.0, -1.0],
                        [-1.0,  1.0, -1.0],
                        [-1.0, -1.0,  1.0]
                    ]
                    pFacesIdx = [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]]
                } else if (solidKind === 1) {
                    // Regular Hexahedron / Cube (8 vertices, 6 quad faces)
                    pVerts = [
                        [-0.85, -0.85, -0.85], [ 0.85, -0.85, -0.85], [ 0.85,  0.85, -0.85], [-0.85,  0.85, -0.85],
                        [-0.85, -0.85,  0.85], [ 0.85, -0.85,  0.85], [ 0.85,  0.85,  0.85], [-0.85,  0.85,  0.85]
                    ]
                    pFacesIdx = [
                        [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
                        [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]
                    ]
                } else if (solidKind === 2) {
                    // Regular Octahedron (6 vertices, 8 triangular faces)
                    pVerts = [
                        [ 1.15,  0.0,  0.0], [-1.15,  0.0,  0.0],
                        [ 0.0,  1.15,  0.0], [ 0.0, -1.15,  0.0],
                        [ 0.0,  0.0,  1.15], [ 0.0,  0.0, -1.15]
                    ]
                    pFacesIdx = [
                        [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
                        [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]
                    ]
                } else if (solidKind === 3) {
                    // Regular Icosahedron (12 vertices, 20 triangular faces)
                    var nrmI = 0.62
                    pVerts = [
                        [-1*nrmI,  phi*nrmI, 0], [ 1*nrmI,  phi*nrmI, 0], [-1*nrmI, -phi*nrmI, 0], [ 1*nrmI, -phi*nrmI, 0],
                        [0, -1*nrmI,  phi*nrmI], [0,  1*nrmI,  phi*nrmI], [0, -1*nrmI, -phi*nrmI], [0,  1*nrmI, -phi*nrmI],
                        [ phi*nrmI, 0, -1*nrmI], [ phi*nrmI, 0,  1*nrmI], [-phi*nrmI, 0, -1*nrmI], [-phi*nrmI, 0,  1*nrmI]
                    ]
                    pFacesIdx = [
                        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
                        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
                        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
                    ]
                } else {
                    // Regular Dodecahedron (20 vertices, 12 pentagonal faces)
                    var nrmD = 0.58
                    pVerts = [
                        // (±1, ±1, ±1) -> 0..7
                        [-1*nrmD, -1*nrmD, -1*nrmD], [-1*nrmD, -1*nrmD,  1*nrmD], [-1*nrmD,  1*nrmD, -1*nrmD], [-1*nrmD,  1*nrmD,  1*nrmD],
                        [ 1*nrmD, -1*nrmD, -1*nrmD], [ 1*nrmD, -1*nrmD,  1*nrmD], [ 1*nrmD,  1*nrmD, -1*nrmD], [ 1*nrmD,  1*nrmD,  1*nrmD],
                        // (0, ±1/phi, ±phi) -> 8..11
                        [0, -invPhi*nrmD, -phi*nrmD], [0, -invPhi*nrmD,  phi*nrmD], [0,  invPhi*nrmD, -phi*nrmD], [0,  invPhi*nrmD,  phi*nrmD],
                        // (±1/phi, ±phi, 0) -> 12..15
                        [-invPhi*nrmD, -phi*nrmD, 0], [-invPhi*nrmD,  phi*nrmD, 0], [ invPhi*nrmD, -phi*nrmD, 0], [ invPhi*nrmD,  phi*nrmD, 0],
                        // (±phi, 0, ±1/phi) -> 16..19
                        [-phi*nrmD, 0, -invPhi*nrmD], [ phi*nrmD, 0, -invPhi*nrmD], [-phi*nrmD, 0,  invPhi*nrmD], [ phi*nrmD, 0,  invPhi*nrmD]
                    ]
                    pFacesIdx = [
                        [1, 9, 11, 3, 18], [5, 9, 11, 7, 19], [1, 9, 5, 14, 12], [3, 11, 7, 15, 13],
                        [0, 8, 10, 2, 16], [4, 8, 10, 6, 17], [0, 8, 4, 14, 12], [2, 10, 6, 15, 13],
                        [0, 12, 1, 18, 16], [2, 13, 3, 18, 16], [4, 14, 5, 19, 17], [6, 15, 7, 19, 17]
                    ]
                }

                var projPlat = []
                for (var pv = 0; pv < pVerts.length; pv++) {
                    projPlat.push(project3DPoint(pVerts[pv][0], pVerts[pv][1], pVerts[pv][2], rx3, ry3, rz3, wcx, wcy, platS, 3.6))
                }
                var platFaces = []
                for (var pf = 0; pf < pFacesIdx.length; pf++) {
                    var fIdxs = pFacesIdx[pf]
                    var poly = []
                    for (var fk = 0; fk < fIdxs.length; fk++) {
                        poly.push(projPlat[fIdxs[fk]])
                    }
                    platFaces.push(poly)
                }
                fillCraftFaces(ctx, platFaces, shapeFillRatio, sw, wave.hueOffset, sAlpha, palette)
                ctx.beginPath()
                for (var pf2 = 0; pf2 < platFaces.length; pf2++) {
                    var fPts2 = platFaces[pf2]
                    for (var pe = 0; pe <= fPts2.length; pe++) {
                        var ptE = fPts2[pe % fPts2.length]
                        if (pe === 0) ctx.moveTo(ptE.x, ptE.y)
                        else ctx.lineTo(ptE.x, ptE.y)
                    }
                }
                strokeVectorCraftPass(ctx, craftStrokeCol, craftLineW, sAlpha)
            }
        }
        ctx.restore()
    }
}

// ---------------------------------------------------------------------------
// Universal 3D Graded History Tracer Helpers (Shared by L1, L2, and L3)
// ---------------------------------------------------------------------------

function computeTracerEndpoint(w, h, t, drift, speed) {
    var d = clamp(Number(drift !== undefined ? drift : 1.0), 0.0, 2.5)
    var wt = t * 0.32
    var dx = (Math.sin(wt) * 0.22 + Math.cos(wt * 0.63 + 1.3) * 0.12) * w * d
    var dy = (Math.cos(wt * 0.79) * 0.20 + Math.sin(wt * 0.51 + 2.1) * 0.11) * h * d
    return { dx: dx, dy: dy }
}

function rotatePaletteForEcho(palette, echoIdx) {
    if (!palette || palette.length === 0 || echoIdx <= 0) return palette
    var out = []
    var len = palette.length
    for (var i = 0; i < len; i++) {
        out.push(palette[(i + echoIdx) % len])
    }
    return out
}

// ---------------------------------------------------------------------------
// LAYER #2 — 12 Psychedelic & Classic Nightclub Visualiser Modes (Batched)
// ---------------------------------------------------------------------------

// Mode 0: MilkDrop / Geiss 3D Cathedral Warp Mesh & Stained-Glass Rose Window Vaults
function drawMode0MilkDrop(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.72 * (cfg.layer2Zoom || 1.0)
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var facets = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numVaults = isEcho ? 3 : Math.max(5, Math.min(11, Math.round(4 + trCount * 0.45 * comp)))
    var ptsPerFacet = isEcho ? 6 : Math.max(8, Math.floor(11 * clamp(comp, 0.5, 1.35)))
    var hist = state.waveHistory || []
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevVaultRing = null
    var prevVaultFade = 0.0
    var vaultTravel = tunT * 0.42
    var vaultZFract = ((vaultTravel % 1.0) + 1.0) % 1.0
    var vaultZBase = Math.floor(vaultTravel)
    // 1. 3D Vaulted Cathedral Dome expanding from diminishing endpoint (zProg -> 0) out past all 4 screen borders (zProg -> 1)
    for (var v = 0; v < numVaults; v++) {
        var zProg = clamp((v + vaultZFract) / numVaults, 0.0, 1.15) // 0 = deep apex, 1 = past screen borders
        var worldVault = vaultZBase - v
        var birthFade0 = smoothstep(0.0, 0.20, zProg)
        var persp = Math.pow(zProg, 1.78) * 1.38
        var spineX = endPt.dx * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var spineY = endPt.dy * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var curRing = []

        for (var f = 0; f < facets; f++) {
            var baseAng = (f * Math.PI * 2) / facets + state.phase * 0.30 + worldVault * 0.22
            var flip = (f % 2 === 0) ? 1.0 : -1.0
            for (var i = 0; i < ptsPerFacet; i++) {
                var u = i / ptsPerFacet
                var bIdx = (i * 2 + (worldVault & 15) * 5) & 63
                var bv = state.smoothBands[bIdx] || 0.1
                var arch = Math.sin(u * Math.PI) * (0.28 + bv * 0.28 + state.bass * 0.14)
                var r = diagR * persp * (0.28 + arch)
                var theta = baseAng + flip * ((u - 0.5) * (Math.PI * 2 / facets) + Math.sin(u * 4.0 + state.t * 1.4 + worldVault * 0.45) * (0.12 + state.mid * 0.16))
                curRing.push({
                    x: spineX + Math.cos(theta) * r,
                    y: spineY + Math.sin(theta) * r
                })
            }
        }

        var vColIdx0 = ((worldVault * 2 + palShift) % palette.length + palette.length) % palette.length
        var vColIdx1 = ((worldVault * 2 + 1 + palShift) % palette.length + palette.length) % palette.length
        var vaultCol = palette[vColIdx0]
        var ribCol = palette[vColIdx1]
        var totalPts = curRing.length

        if (prevVaultRing && (!isEcho || (state.echoIndex || 0) < 2)) {
            var wallFade0 = Math.min(prevVaultFade, birthFade0)
            if (wallFade0 > 0.01) {
                var vaultPolys0 = []
                for (var q = 0; q < totalPts; q++) {
                    var qNext = (q + 1) % totalPts
                    vaultPolys0.push([prevVaultRing[q], prevVaultRing[qNext], curRing[qNext], curRing[q]])
                }
                fillGeometrySegments(ctx, vaultPolys0, cfg, worldVault + palShift, palette, (0.35 + (1.0 - zProg * 0.5) * 0.45 + state.bass * 0.20) * wallFade0)

                ctx.strokeStyle = colourWithAlpha(vaultCol, (0.24 + zProg * 0.38) * wallFade0)
                ctx.lineWidth = (0.8 + zProg * 1.6) * wallFade0
                ctx.beginPath()
                for (var qr = 0; qr < totalPts; qr += Math.max(2, Math.floor(ptsPerFacet / 2))) {
                    ctx.moveTo(prevVaultRing[qr].x, prevVaultRing[qr].y)
                    ctx.lineTo(curRing[qr].x, curRing[qr].y)
                }
                ctx.stroke()
            }
        }

        if (birthFade0 > 0.01) {
            ctx.strokeStyle = colourWithAlpha(ribCol, (0.42 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.52) * birthFade0)
            ctx.lineWidth = clamp(1.2 + zProg * 2.8 + state.beatPulse * 0.8, 0.8, 4.5) * birthFade0 * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var p = 0; p <= totalPts; p++) {
                var pt = curRing[p % totalPts]
                if (p === 0) ctx.moveTo(pt.x, pt.y)
                else ctx.lineTo(pt.x, pt.y)
            }
            ctx.stroke()
        }

        prevVaultRing = curRing
        prevVaultFade = birthFade0
    }

    // 2. Central Dual-Channel Geiss Custom Waveform Ribbon at the diminishing endpoint
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var wavePts = isEcho ? 20 : 36
        var coreR = minDim * (0.12 + state.bass * 0.08)
        var ch0Bands = (hist.length > 0 && hist[0] && hist[0].bands) ? hist[0].bands : state.smoothBands
        var ch1Bands = (hist.length > 2 && hist[2] && hist[2].bands) ? hist[2].bands : state.smoothBands
        var outerWave = []
        var innerWave = []
        for (var wIdx = 0; wIdx <= wavePts; wIdx++) {
            var wa = (wIdx / wavePts) * Math.PI * 2 + state.phase * 0.65
            var wb0 = ch0Bands[wIdx & 31] !== undefined ? ch0Bands[wIdx & 31] : (state.smoothBands[(wIdx * 2) & 63] || 0.1)
            var wb1 = ch1Bands[(wIdx + 8) & 31] !== undefined ? ch1Bands[(wIdx + 8) & 31] : (state.smoothBands[(wIdx * 2 + 1) & 63] || 0.1)
            var rOuter = coreR * (0.88 + wb0 * 0.52 + Math.sin(wa * facets - state.t * 2.2) * 0.18)
            var rInner = coreR * (0.48 + wb1 * 0.32 - Math.cos(wa * facets + state.t * 1.8) * 0.12)
            outerWave.push({ x: endPt.dx * 0.65 + Math.cos(wa) * rOuter, y: endPt.dy * 0.65 + Math.sin(wa) * rOuter })
            innerWave.push({ x: endPt.dx * 0.65 + Math.cos(wa) * rInner, y: endPt.dy * 0.65 + Math.sin(wa) * rInner })
        }
        ctx.fillStyle = colourWithAlpha(palette[2 % palette.length], 0.18 + state.bass * 0.14)
        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.90)
        ctx.lineWidth = clamp(2.2 + state.beatPulse * 1.4, 2.0, 4.2)
        ctx.beginPath()
        for (var w0 = 0; w0 <= wavePts; w0++) {
            if (w0 === 0) ctx.moveTo(outerWave[w0].x, outerWave[w0].y)
            else ctx.lineTo(outerWave[w0].x, outerWave[w0].y)
        }
        for (var w1 = wavePts; w1 >= 0; w1--) {
            ctx.lineTo(innerWave[w1].x, innerWave[w1].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 1: Winamp AVS 3D SuperScope (Clean 3D Parametric Oscilloscope Wave Ribbon & Stereo Lissajous Core)
function drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var trEnabled = cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var trCount = trEnabled ? clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 12) : 1
    var ringPasses = Math.max(1, Math.min(5, Math.ceil(trCount * 0.4)))
    var N = Math.max(36, Math.min(72, Math.floor(48 * comp)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    var rotX = Math.sin(state.t * 0.38) * 0.42 + state.bassSmooth * 0.18
    var rotY = state.t * 0.44
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    var cosY = Math.cos(rotY), sinY = Math.sin(rotY)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // 1. Clean 3D Parametric AVS Oscilloscope Wave Rings (smooth 1:1 circular / 1:2 saddle wave — zero tangled knot noise!)
    for (var pass = ringPasses - 1; pass >= 0; pass--) {
        var uPass = ringPasses > 1 ? (pass / (ringPasses - 1)) : 0.0
        var passLag = pass * 0.14
        var tPass = state.t - passLag
        var depthScale = minDim * (0.36 - uPass * 0.14 + state.bassSmooth * 0.05)
        var offX = endPt.dx * 0.35 * uPass
        var offY = endPt.dy * 0.35 * uPass
        var alpha = pass === 0 ? 0.92 : (0.48 * (1.0 - uPass * 0.68))

        var ptsTop = []
        var ptsBot = []
        var ribHalfH = (4.5 + state.bassSmooth * 9.0) * (1.0 - uPass * 0.45)

        for (var i = 0; i <= N; i++) {
            var u = (i / N) * Math.PI * 2
            var bVal = state.smoothBands[(i + pass * 5) & 63] || 0.08
            // Smooth AVS oscilloscope displacement along 3D ring
            var waveY = (bVal - 0.18) * 0.55 * Math.sin(u * 3.0 + tPass * 2.4)
                      + Math.cos(u * 2.0 - tPass * 1.6) * (0.12 + state.midSmooth * 0.18)
            var rMod = 1.0 + (bVal * 0.24) * Math.cos(u * 4.0 - tPass * 1.8)
            var x3 = Math.cos(u) * rMod
            var z3 = Math.sin(u) * rMod
            var y3 = waveY

            var x1 = x3 * cosY - z3 * sinY
            var z1 = x3 * sinY + z3 * cosY
            var y2 = y3 * cosX - z1 * sinX
            var z2 = y3 * sinX + z1 * cosX

            var persp = 1.75 / (2.35 - clamp(z2, -1.15, 1.15))
            var sx = offX + x1 * depthScale * persp
            var sy = offY + y2 * depthScale * persp
            var hw = ribHalfH * persp
            ptsTop.push({ x: sx, y: sy - hw, p: persp, b: bVal })
            ptsBot.push({ x: sx, y: sy + hw })
        }

        var colFill = palette[(pass * 2 + palShift) % palette.length]
        var colLine = palette[(pass * 2 + 1 + palShift) % palette.length]

        var avsQuads1 = []
        for (var fq = 0; fq < N; fq += 2) {
            var fnq = Math.min(N, fq + 2)
            avsQuads1.push([ptsTop[fq], ptsTop[fnq], ptsBot[fnq], ptsBot[fq]])
        }
        fillGeometrySegments(ctx, avsQuads1, cfg, pass * 2 + palShift, palette, (0.48 + state.bassSmooth * 0.28) * alpha)

        ctx.strokeStyle = colourWithAlpha(colLine, alpha)
        ctx.lineWidth = (pass === 0 ? 2.4 : 1.5) + state.beatPulse * 0.9
        ctx.beginPath()
        for (var s0 = 0; s0 <= N; s0++) {
            if (s0 === 0) ctx.moveTo(ptsTop[s0].x, ptsTop[s0].y)
            else ctx.lineTo(ptsTop[s0].x, ptsTop[s0].y)
        }
        for (var sb0 = 0; sb0 <= N; sb0++) {
            if (sb0 === 0) ctx.moveTo(ptsBot[sb0].x, ptsBot[sb0].y)
            else ctx.lineTo(ptsBot[sb0].x, ptsBot[sb0].y)
        }
        for (var sr0 = 0; sr0 < N; sr0 += 4) {
            ctx.moveTo(ptsTop[sr0].x, ptsTop[sr0].y)
            ctx.lineTo(ptsBot[sr0].x, ptsBot[sr0].y)
        }
        ctx.stroke()
    }

    // 2. Central Stereo Lissajous Phase-Scope (clean 1:2 / 2:3 figure-8 harmonic loop at core)
    var lissSteps = 48
    var lissR = minDim * (0.16 + state.bassSmooth * 0.06)
    ctx.strokeStyle = colourWithAlpha(palette[(3 + palShift) % palette.length], 0.86)
    ctx.lineWidth = 2.0 + state.highSmooth * 1.2
    ctx.beginPath()
    for (var li = 0; li <= lissSteps; li++) {
        var lu = (li / lissSteps) * Math.PI * 2
        var lb = state.smoothBands[(li * 2) & 63] || 0.08
        var lx = Math.sin(lu + state.t * 1.1) * lissR * (0.85 + lb * 0.30)
        var ly = Math.sin(lu * 2.0 - state.t * 0.85) * lissR * (0.55 + state.midSmooth * 0.28)
        if (li === 0) ctx.moveTo(lx, ly)
        else ctx.lineTo(lx, ly)
    }
    ctx.closePath()
    ctx.stroke()

    ctx.restore()
}

// Mode 2: SoundSpectrum G-Force 3D Logarithmic Vortex Funnel & Plasma Ribbons
// Rings expand all the way past diagR so every wave ring moves towards the user and exits OFF the screen!
function drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.76 * (cfg.layer2Zoom || 1.0)
    var petals = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 12)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numRings = isEcho ? 3 : Math.max(5, Math.min(11, Math.round(4 + trCount * 0.45 * comp)))
    var steps = isEcho ? 28 : Math.max(36, Math.floor(54 * clamp(comp, 0.5, 1.3)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var prevFunnelPts = null
    var prevFunnelFade = 0.0
    var gfTravel = tunT * 0.40
    var gfZFract = ((gfTravel % 1.0) + 1.0) % 1.0
    var gfZBase = Math.floor(gfTravel)
    // Render 3D logarithmic vortex funnel from deep core (zProg -> 0) out past all 4 screen borders (zProg -> 1)
    for (var layer = 0; layer < numRings; layer++) {
        var zProg = clamp((layer + gfZFract) / numRings, 0.0, 1.15)
        var worldRing = gfZBase - layer
        var birthFade2 = smoothstep(0.0, 0.20, zProg)
        var persp = Math.pow(zProg, 1.78) * 1.28
        // Continuous spiral twist along worldRing — never flip sign by (layer % 2)!
        var spiralTwist = (1.0 - Math.min(1.0, zProg)) * (1.0 + state.high * 0.85) + state.phase * 0.45 + worldRing * 0.28
        var ringX = endPt.dx * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.3)
        var ringY = endPt.dy * 0.65 * Math.pow(1.0 - Math.min(1.0, zProg), 1.3)

        var curPts = []
        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bIdx = (i + (worldRing & 15) * 7) & 63
            var bv = state.smoothBands[bIdx] || 0.1
            var wave = Math.sin(a * petals + state.t * 1.8 - worldRing * 0.38) * (0.16 + state.mid * 0.20)
                     + Math.cos(a * (petals * 2 - 1) - state.t * 1.4 + worldRing * 0.22) * (0.10 + bv * 0.28)
            var r = diagR * persp * (0.76 + wave + state.bass * 0.14)
            var spiralA = a + spiralTwist
            curPts.push({
                x: ringX + Math.cos(spiralA) * r,
                y: ringY + Math.sin(spiralA) * r
            })
        }

        var cIdx0 = ((worldRing * 2 + palShift) % palette.length + palette.length) % palette.length
        var cIdx1 = ((worldRing * 2 + 1 + palShift) % palette.length + palette.length) % palette.length
        var curtainCol = palette[cIdx0]
        var crestCol = palette[cIdx1]

        if (prevFunnelPts && (!isEcho || (state.echoIndex || 0) < 3)) {
            var wallFade2 = Math.min(prevFunnelFade, birthFade2)
            if (wallFade2 > 0.01) {
                var funnelPolys2 = []
                for (var k = 0; k < steps; k++) {
                    funnelPolys2.push([prevFunnelPts[k], prevFunnelPts[k + 1], curPts[k + 1], curPts[k]])
                }
                fillGeometrySegments(ctx, funnelPolys2, cfg, worldRing + palShift, palette, (0.35 + zProg * 0.45 + state.bass * 0.20) * wallFade2)

                ctx.strokeStyle = colourWithAlpha(curtainCol, (0.22 + zProg * 0.36) * wallFade2)
                ctx.lineWidth = (0.8 + zProg * 1.5) * wallFade2
                ctx.beginPath()
                for (var vr = 0; vr < steps; vr += 3) {
                    ctx.moveTo(prevFunnelPts[vr].x, prevFunnelPts[vr].y)
                    ctx.lineTo(curPts[vr].x, curPts[vr].y)
                }
                ctx.stroke()
            }
        }

        if (birthFade2 > 0.01) {
            ctx.strokeStyle = colourWithAlpha(crestCol, (0.42 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.52) * birthFade2)
            ctx.lineWidth = (1.1 + zProg * 2.7 + state.bass * 1.2) * birthFade2 * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var p = 0; p <= steps; p++) {
                if (p === 0) ctx.moveTo(curPts[p].x, curPts[p].y)
                else ctx.lineTo(curPts[p].x, curPts[p].y)
            }
            ctx.closePath()
            ctx.stroke()
        }

        prevFunnelPts = curPts
        prevFunnelFade = birthFade2
    }
    ctx.restore()
}

// Mode 3: Cthugha 3D Volumetric Plasma & Flame Oscilloscope Tunnel
function drawMode3CthughaRave(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.72 * (cfg.layer2Zoom || 1.0)
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 6), 1, 16)
    var numSlices = isEcho ? 3 : Math.max(5, Math.min(10, Math.round(4 + trCount * 0.4)))
    var ringSteps = isEcho ? 28 : 48
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    var cthTravel = tunT * 0.38
    var cthZFract = ((cthTravel % 1.0) + 1.0) % 1.0
    var cthZBase = Math.floor(cthTravel)

    // 1. Volumetric Flame & Plasma Shroud Waves expanding past all 4 screen borders with segmented vector cells
    var prevSlicePts3 = null
    var segStep3 = isEcho ? 4 : 3
    for (var s = numSlices - 1; s >= 0; s--) {
        var zProg = clamp((s + cthZFract) / numSlices, 0.0, 1.15)
        var worldSlice = cthZBase - s
        var birthFade3 = smoothstep(0.0, 0.20, zProg)
        if (birthFade3 < 0.01) continue
        var persp = Math.pow(zProg, 1.68) * 1.26
        var baseR = diagR * persp * (0.78 + state.bass * 0.18)
        var rot = state.phase * 0.42 + worldSlice * 0.28
        var colStroke = palette[((worldSlice * 2 + 3 + palShift) % palette.length + palette.length) % palette.length]
        var ringX = endPt.dx * 0.60 * Math.pow(1.0 - Math.min(1.0, zProg), 1.25)
        var ringY = endPt.dy * 0.60 * Math.pow(1.0 - Math.min(1.0, zProg), 1.25)

        var curSlicePts3 = []
        for (var i = 0; i <= ringSteps; i++) {
            var u = i / ringSteps
            var a = u * Math.PI * 2 + rot
            var bIdx = (i + (worldSlice & 15) * 3) & 63
            var wVal = state.smoothBands[bIdx] || 0.05
            var flame = Math.sin(u * Math.PI * 10 + state.t * 3.2 - worldSlice * 0.65) * (0.10 + state.mid * 0.18)
            var excursion = (wVal - 0.14 + flame) * diagR * persp * (0.28 + state.energy * 0.24)
            var r = Math.max(0.0, baseR + excursion)
            var px = ringX + Math.cos(a) * r
            var py = ringY + Math.sin(a) * r - Math.abs(excursion) * 0.18
            curSlicePts3.push({ x: px, y: py })
        }

        // Segmented polygon quads between adjacent oscilloscope rings (or radial inner wedges on the innermost ring)
        var slicePolys3 = []
        for (var sq3 = 0; sq3 < ringSteps; sq3 += segStep3) {
            var sn3 = Math.min(ringSteps, sq3 + segStep3)
            if (prevSlicePts3) {
                slicePolys3.push([prevSlicePts3[sq3], prevSlicePts3[sn3], curSlicePts3[sn3], curSlicePts3[sq3]])
            } else {
                slicePolys3.push([{ x: ringX, y: ringY }, curSlicePts3[sq3], curSlicePts3[sn3]])
            }
        }
        fillGeometrySegments(
            ctx,
            slicePolys3,
            cfg,
            worldSlice + palShift,
            palette,
            (0.42 + (1.0 - Math.min(1.0, zProg)) * 0.32 + state.bass * 0.18) * birthFade3 * (isEcho ? 0.55 : 1.0)
        )

        ctx.strokeStyle = colourWithAlpha(colStroke, (0.45 + Math.sin(Math.min(1.0, zProg) * Math.PI) * 0.50) * birthFade3)
        ctx.lineWidth = (1.0 + zProg * 2.6 + state.bass * 1.2) * birthFade3 * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var ip3 = 0; ip3 <= ringSteps; ip3++) {
            if (ip3 === 0) ctx.moveTo(curSlicePts3[ip3].x, curSlicePts3[ip3].y)
            else ctx.lineTo(curSlicePts3[ip3].x, curSlicePts3[ip3].y)
        }
        ctx.closePath()
        if (prevSlicePts3) {
            for (var sr3 = 0; sr3 < ringSteps; sr3 += segStep3 * 2) {
                ctx.moveTo(prevSlicePts3[sr3].x, prevSlicePts3[sr3].y)
                ctx.lineTo(curSlicePts3[sr3].x, curSlicePts3[sr3].y)
            }
        }
        ctx.stroke()
        prevSlicePts3 = curSlicePts3
    }

    // 2. Dual-Channel Stereo Flame Ribbon Oscilloscope across the horizon core (segmented vector quads)
    if (!isEcho || (state.echoIndex || 0) < 3) {
        var hSteps = isEcho ? 24 : 48
        var spanW = w * 0.44 * (cfg.layer2Zoom || 1.0)
        var topPts3 = []
        var botPts3 = []
        for (var k = 0; k <= hSteps; k++) {
            var kx = ((k / hSteps) * 2.0 - 1.0) * spanW
            var kb = state.smoothBands[(k * 2) & 63]
            var ky = (kb - 0.25) * Math.sin(k * 0.55 + state.t * 4.2) * maxR * (0.42 + state.bass * 0.35)
            var kb2 = state.smoothBands[(k * 2 + 1) & 63]
            var ky2 = -(kb2 * 0.55 + 0.08) * maxR * 0.28
            topPts3.push({ x: kx, y: ky })
            botPts3.push({ x: kx, y: ky2 })
        }
        var ribbonPolys3 = []
        for (var rq3 = 0; rq3 < hSteps; rq3 += 2) {
            var rn3 = Math.min(hSteps, rq3 + 2)
            ribbonPolys3.push([topPts3[rq3], topPts3[rn3], botPts3[rn3], botPts3[rq3]])
        }
        fillGeometrySegments(ctx, ribbonPolys3, cfg, palShift + 1, palette, 0.58 + state.bass * 0.28)

        ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.90)
        ctx.lineWidth = 2.4 + state.beatPulse * 1.5
        ctx.beginPath()
        for (var kt = 0; kt <= hSteps; kt++) {
            if (kt === 0) ctx.moveTo(topPts3[kt].x, topPts3[kt].y)
            else ctx.lineTo(topPts3[kt].x, topPts3[kt].y)
        }
        for (var kbIdx = hSteps; kbIdx >= 0; kbIdx--) {
            ctx.lineTo(botPts3[kbIdx].x, botPts3[kbIdx].y)
        }
        ctx.closePath()
        for (var ks3 = 0; ks3 <= hSteps; ks3 += 4) {
            ctx.moveTo(topPts3[ks3].x, topPts3[ks3].y)
            ctx.lineTo(botPts3[ks3].x, botPts3[ks3].y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Helper for Mode 4: Evaluate C64 / Llamasoft VLM shape profile for an integer or continuous family index
function _evalSingleMinterProfile(kindInt, a, baseFolds) {
    var k = ((kindInt % 5) + 5) % 5
    if (k === 0) {
        // Tempest 2000 Star-Web profile
        return 0.78 + 0.32 * Math.abs(Math.cos(baseFolds * a * 0.5))
    } else if (k === 1) {
        // C64 Psychedelia Diamond / Rhombus profile
        return 0.72 / (Math.abs(Math.cos(a)) * 0.65 + Math.abs(Math.sin(a)) * 0.65 + 0.35)
    } else if (k === 2) {
        // Llamasoft Clover / Flower profile
        return 0.82 + 0.26 * Math.cos(baseFolds * a)
    } else if (k === 3) {
        // C64 Cross / Plus portal profile
        return 0.74 + 0.30 * Math.cos(4.0 * a)
    }
    // Classic Hex / Octagon tube profile
    return 0.88 + 0.14 * Math.cos(6.0 * a)
}

function evalMinterShapeProfile(kindOrPhase, a, baseFolds) {
    var folds = baseFolds || 6
    var kFloor = Math.floor(kindOrPhase)
    var kFract = kindOrPhase - kFloor
    if (kFract <= 0.00001) {
        return _evalSingleMinterProfile(kFloor, a, folds)
    }
    var smoothBlend = kFract * kFract * (3.0 - 2.0 * kFract)
    var p0 = _evalSingleMinterProfile(kFloor, a, folds)
    var p1 = _evalSingleMinterProfile(kFloor + 1, a, folds)
    return lerp(p0, p1, smoothBlend)
}

// Mode 4: Commodore 64 / Jeff Minter VLM (Psychedelia / Tempest 2000) 3D Shape Tunnel!
// Authentic C64 / Llamasoft 3D shape tunnel where distinct geometric shapes (Tempest Star-Webs,
// C64 Octagons, Sacred Diamonds, Llamasoft Crosses, Delta Triangles, and Hex-Portals) spawn at the
// wandering diminishing endpoint and expand with true perspective ALL THE WAY PAST THE SCREEN BORDERS!
function drawMode4MinterVlm(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var diagR = Math.sqrt(w * w + h * h) * 0.88 * (cfg.layer2Zoom || 1.0)
    var minDim = Math.min(w, h) * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 8), 1, 16)

    // Number of 3D tunnel shape rings marching from diminishing endpoint off the screen
    var depthRings = isEcho ? 6 : Math.max(8, Math.min(16, Math.round(6 + trCount * 0.55 * comp)))
    var facets = isEcho ? 16 : 24

    // Smooth monotonic tunnel travel phase (`state.tunnelTime`) — zero phase teleportation!
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var dirSign = (tracerDir < 0) ? -1.0 : 1.0
    var travelPhase = tunT * 1.45 * dirSign
    var zFract = ((travelPhase % 1.0) + 1.0) % 1.0
    var zBaseWorld = Math.floor(travelPhase)

    // Wandering 3D diminishing endpoint offset (snaking C64 tunnel spine)
    var driftScale = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var endPt = computeTracerEndpoint(w, h, driftT, Math.max(0.45, driftScale), 1.0)
    var curveX = endPt.dx * 0.82
    var curveY = endPt.dy * 0.82
    var baseFolds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var palShift = Math.floor((state.hueShift || 0) / 45)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // Precompute 3D shape tunnel rings from diminishing endpoint (d = 0, r -> 0.0px pinpoint)
    // out past all 4 borders of the viewport (d = depthRings, r -> diagR * 1.25)!
    var ringPts = []
    var ringZ = []
    var ringFade = []
    var ringWorld = []
    for (var d = 0; d <= depthRings; d++) {
        var zProg = clamp((d + zFract) / depthRings, 0.0, 1.15)
        ringZ.push(zProg)
        var birthFade = smoothstep(0.0, 0.22, zProg)
        ringFade.push(birthFade)
        var worldZ = zBaseWorld - d
        ringWorld.push(worldZ)

        // True perspective expansion: starts at exact 0.0 pinpoint at endpoint (zProg=0) and expands past diagR (zProg=1)
        var persp = Math.pow(zProg, 1.88)
        var rBase = persp * diagR * (1.16 + state.bass * 0.14)

        // Progressive 3D spine bend toward the wandering diminishing endpoint (zero wobble at zProg -> 0 so apex never snaps!)
        var bendAmt = Math.pow(1.0 - Math.min(1.0, zProg), 1.35)
        var wobbleEnv = zProg * (1.0 - Math.min(1.0, zProg) * 0.65)
        var wobbleX = Math.sin(worldZ * 0.35 + tunT * 1.2) * minDim * 0.045 * wobbleEnv
        var wobbleY = Math.cos(worldZ * 0.30 - tunT * 1.0) * minDim * 0.045 * wobbleEnv
        var spineX = curveX * bendAmt + wobbleX
        var spineY = curveY * bendAmt + wobbleY

        // Smooth C64 / Minter corkscrew rotation along tunnel depth
        var twist = state.phase * 0.65 + worldZ * 0.14

        // Smoothly interpolate between consecutive C64 / Minter shape families along worldZ
        // (eliminates discrete shape-jump joints between adjacent tunnel rings!)
        var worldPhase = worldZ * 0.18

        var pts = []
        for (var s = 0; s <= facets; s++) {
            var u = s / facets
            var a = u * Math.PI * 2
            var bIdx = ((s % facets) * 2 + (worldZ & 15) * 4) & 63
            var bVal = state.smoothBands[bIdx]
            var shapeProfile = evalMinterShapeProfile(worldPhase, a, baseFolds)
            var r = rBase * shapeProfile * (1.0 + bVal * 0.18)
            var rotA = a + twist

            pts.push({
                x: spineX + Math.cos(rotA) * r,
                y: spineY + Math.sin(rotA) * r,
                band: bVal
            })
        }
        ringPts.push(pts)
    }

    // 1. Llamasoft VLM Tunnel Wall Segments rendered back-to-front with configurable Fill % and Segment Opacity %
    if (!isEcho || (state.echoIndex || 0) < 3) {
        for (var d0 = 0; d0 < depthRings; d0++) {
            var bf0 = ringFade[d0]
            if (bf0 < 0.01) continue
            var p0 = ringPts[d0]
            var p1 = ringPts[d0 + 1]
            var wZ = ringWorld[d0]
            var ringQuads4 = []
            for (var s0 = 0; s0 < facets; s0++) {
                ringQuads4.push([p0[s0], p0[s0 + 1], p1[s0 + 1], p1[s0]])
            }
            fillGeometrySegments(ctx, ringQuads4, cfg, wZ + palShift, palette, (0.45 + state.bass * 0.35) * bf0)
        }
    }

    // 2. Longitudinal Tempest Web Lane Rails radiating from diminishing endpoint past all 4 screen edges
    //    Inner rail segments (`ringFade[dLane - 1] < 0.99`) fade in smoothly from 0 alpha & 0 width at the apex!
    var laneCol = palette[(1 + palShift) % palette.length]
    var baseLaneAlpha = 0.68 + state.high * 0.25
    var baseLaneWidth = (isEcho ? 1.5 : 2.2) + state.bass * 1.4
    for (var dLane = 1; dLane <= depthRings; dLane++) {
        var bfLane = ringFade[dLane - 1]
        if (bfLane < 0.01 || bfLane >= 0.99) continue
        ctx.strokeStyle = colourWithAlpha(laneCol, baseLaneAlpha * bfLane)
        ctx.lineWidth = baseLaneWidth * bfLane
        ctx.beginPath()
        for (var sLaneIn = 0; sLaneIn < facets; sLaneIn += 2) {
            ctx.moveTo(ringPts[dLane - 1][sLaneIn].x, ringPts[dLane - 1][sLaneIn].y)
            ctx.lineTo(ringPts[dLane][sLaneIn].x, ringPts[dLane][sLaneIn].y)
        }
        ctx.stroke()
    }
    ctx.strokeStyle = colourWithAlpha(laneCol, baseLaneAlpha)
    ctx.lineWidth = baseLaneWidth
    ctx.beginPath()
    for (var dLaneOut = 1; dLaneOut <= depthRings; dLaneOut++) {
        if (ringFade[dLaneOut - 1] < 0.99) continue
        for (var sLaneOut = 0; sLaneOut < facets; sLaneOut += 2) {
            ctx.moveTo(ringPts[dLaneOut - 1][sLaneOut].x, ringPts[dLaneOut - 1][sLaneOut].y)
            ctx.lineTo(ringPts[dLaneOut][sLaneOut].x, ringPts[dLaneOut][sLaneOut].y)
        }
    }
    ctx.stroke()

    // 3. Bright C64 / Minter Shape Rings expanding towards the user and passing completely OFF screen
    //    Each ring fades and thickens smoothly from 0 at the diminishing endpoint (`birthFade`)!
    for (var dr = 0; dr <= depthRings; dr++) {
        var zp = ringZ[dr]
        var bf = ringFade[dr]
        if (bf < 0.01) continue
        var ptsR = ringPts[dr]
        var wIdx = ((ringWorld[dr] * 2 + palShift) % palette.length + palette.length) % palette.length
        ctx.strokeStyle = colourWithAlpha(palette[wIdx], clamp((0.28 + zp * 0.72) * bf, 0.0, 1.0))
        ctx.lineWidth = (0.8 + zp * 4.2 + state.beatPulse * 1.2) * bf * (isEcho ? 0.72 : 1.0)
        ctx.beginPath()
        for (var sr = 0; sr <= facets; sr++) {
            if (sr === 0) ctx.moveTo(ptsR[sr].x, ptsR[sr].y)
            else ctx.lineTo(ptsR[sr].x, ptsR[sr].y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 5: True Complex-Plane Mandelbrot & Julia Boundary Deep-Zoom Engine
// Zooms continuously in (Towards), out (Away), or breathes (Breathe) directly into a boundary section
// (Seahorse Valley, Elephant Valley, Double Sceptre, Triple Spiral, Feigenbaum Mini-Brot) from the full
// Mandelbrot cardioid/bulb (-0.5, 0.0), allowing the boundary to fractal in and out across generations!
function drawMode5JuliaFractals(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var gpuActive = cfg && cfg.gpuShaderEnabled !== undefined ? Boolean(cfg.gpuShaderEnabled) : true
    var isEcho = Boolean(state.isTracerEcho)

    var trDir = cfg && cfg.tracerDirection !== undefined ? Number(cfg.tracerDirection) : 1
    var dirSign = trDir === 0 ? Math.sin((state.t || 0.0) * 0.45) : (trDir < 0 ? -1.0 : 1.0)
    var zoomFlow = (state.zoomTime !== undefined ? state.zoomTime : state.t * 0.8) * 1.28 * (dirSign < 0 ? -1.0 : 1.0)
    var zoomFract = ((zoomFlow % 1.0) + 1.0) % 1.0
    var zoomGen = Math.floor(zoomFlow)

    var cycPhase = (((state.zoomTime || state.t) * 0.14) % 1.0 + 1.0) % 1.0
    var diveT = trDir === 0
        ? (0.5 - 0.5 * Math.cos(cycPhase * Math.PI * 2.0))
        : (trDir > 0
            ? smoothstep(0.0, 0.78, cycPhase) * (1.0 - smoothstep(0.78, 1.0, cycPhase))
            : smoothstep(0.0, 0.22, cycPhase) * (1.0 - smoothstep(0.22, 1.0, cycPhase)))

    var poiRe = (state.fractalRe !== undefined ? state.fractalRe : -0.74364388) + Math.cos(state.t * 0.22) * 0.015
    var poiIm = (state.fractalIm !== undefined ? state.fractalIm : 0.13182590) + Math.sin(state.t * 0.27) * 0.015
    var cRe = (state.fractalCRe !== undefined ? state.fractalCRe : -0.745) + Math.cos(state.t * 0.31) * (0.04 + state.bassSmooth * 0.04)
    var cIm = (state.fractalCIm !== undefined ? state.fractalCIm : 0.186) + Math.sin(state.t * 0.37) * (0.04 + state.midSmooth * 0.04)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var focalX = cx + endPt.dx * 0.38
    var focalY = cy + endPt.dy * 0.38

    var trEnabled = cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var trCount = trEnabled ? clamp(Math.round(Number(cfg.tracerCount) || 7), 1, 16) : 3
    var octaves = isEcho ? 2 : (gpuActive ? 4 : Math.max(5, Math.min(9, Math.round(4 + trCount * 0.35 * comp))))
    var ratio = 2.08
    var baseScale = minDim * (0.014 + diveT * 0.018)
    var folds = clamp(Math.round(Number(cfg.layer2Facets) || 6), 3, 12)
    var contourSteps = isEcho ? 40 : Math.max(64, Math.min(104, Math.floor(76 * comp)))
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var gpuAlphaMul = gpuActive ? 0.32 : 1.0

    function evalFractalBoundaryLocal(theta, subDetail, cReVal, cImVal, bVal) {
        var cardX = 0.5 * Math.cos(theta) - 0.25 * Math.cos(2.0 * theta)
        var cardY = 0.5 * Math.sin(theta) - 0.25 * Math.sin(2.0 * theta)
        var dHead = Math.cos((theta - Math.PI) * 0.5)
        var headBulb = Math.pow(Math.max(0.0, dHead), 6.0) * 0.42
        var dTop = Math.cos((theta - Math.PI * 0.52) * 0.5)
        var dBot = Math.cos((theta + Math.PI * 0.52) * 0.5)
        var period3Bulbs = (Math.pow(Math.max(0.0, dTop), 8.0) + Math.pow(Math.max(0.0, dBot), 8.0)) * 0.26

        var zr = cardX + poiRe * 0.25
        var zi = cardY + poiIm * 0.25
        var smoothIter = 0.0
        for (var it = 0; it < 8; it++) {
            var r2 = zr * zr, i2 = zi * zi
            if (r2 + i2 > 8.0) break
            zi = 2.0 * zr * zi + cImVal
            zr = r2 - i2 + cReVal
            smoothIter += 1.0 / (1.0 + (r2 + i2) * 0.35)
        }
        var escapePot = clamp(smoothIter / 4.8, 0.15, 1.55)
        var detailGain = subDetail * (0.65 + diveT * 0.65)
        var bud1 = Math.sin(folds * theta + escapePot * 2.4) * 0.14
        var bud2 = Math.cos(folds * 2.0 * theta - escapePot * 3.6 + state.phase * 0.5) * 0.09 * detailGain
        var bud3 = Math.sin(folds * 4.0 * theta + escapePot * 5.2 - state.t * 1.4) * 0.06 * detailGain * detailGain
        var radialOut = 1.0 + headBulb + period3Bulbs + bud1 + bud2 + bud3 + bVal * 0.18
        var nx = Math.cos(theta), ny = Math.sin(theta)
        return {
            x: cardX * radialOut - headBulb * 0.35 + nx * (bud1 + bud2 + bud3) * 0.45,
            y: cardY * radialOut + ny * (bud1 + bud2 + bud3) * 0.45,
            escapePot: escapePot
        }
    }

    var poiTheta = Math.atan2(poiIm, poiRe + 0.25)

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    for (var oct = octaves - 1; oct >= 0; oct--) {
        var octProgress = oct + zoomFract
        var uOct = octProgress / octaves
        var octScale = baseScale * Math.pow(ratio, octProgress)
        var octWorld = zoomGen - oct
        var envAlpha = smoothstep(0.0, 0.20, uOct) * smoothstep(1.08, 0.82, uOct)
        if (envAlpha < 0.01) continue

        var subDetail = smoothstep(0.08, 0.88, uOct) * (0.75 + state.bassSmooth * 0.35)
        var octRot = octWorld * 0.38 + Math.sin(state.phase * 0.22 + octWorld * 0.7) * 0.20
        var cosR = Math.cos(octRot), sinR = Math.sin(octRot)

        var panToBoundary = smoothstep(0.0, 0.75, diveT * 0.75 + uOct * 0.55)
        var poiPt = evalFractalBoundaryLocal(poiTheta, subDetail, cRe, cIm, state.bassSmooth * 0.5)
        var camLocX = lerp(-0.25, poiPt.x, panToBoundary)
        var camLocY = lerp(0.0, poiPt.y, panToBoundary)
        var poiRotX = camLocX * cosR - camLocY * sinR
        var poiRotY = camLocX * sinR + camLocY * cosR
        var shapeOriginX = focalX - poiRotX * octScale
        var shapeOriginY = focalY - poiRotY * octScale

        var colPrimary = palette[((octWorld * 2 + palShift) % palette.length + palette.length) % palette.length]
        var colSecondary = palette[((octWorld * 2 + 1 + palShift) % palette.length + palette.length) % palette.length]
        var colAccent = palette[((octWorld * 2 + 3 + palShift) % palette.length + palette.length) % palette.length]

        ctx.fillStyle = colourWithAlpha(colPrimary, (0.09 + (1.0 - uOct) * 0.10 + state.bassSmooth * 0.05) * envAlpha * gpuAlphaMul)
        ctx.strokeStyle = colourWithAlpha(colSecondary, (0.52 + envAlpha * 0.38) * envAlpha * (gpuActive ? 0.65 : 1.0))
        ctx.lineWidth = (1.1 + uOct * 2.2 + state.beatPulse * 0.9) * envAlpha

        var boundaryPts = []
        for (var s = 0; s <= contourSteps; s++) {
            var u = s / contourSteps
            var theta = u * Math.PI * 2
            var bVal = state.smoothBands[(s + (octWorld & 15) * 4) & 63] || 0.08
            var ptL = evalFractalBoundaryLocal(theta, subDetail, cRe, cIm, bVal)
            var rx = ptL.x * cosR - ptL.y * sinR
            var ry = ptL.x * sinR + ptL.y * cosR
            var jx = shapeOriginX + rx * octScale
            var jy = shapeOriginY + ry * octScale
            boundaryPts.push({ x: jx, y: jy, theta: theta + octRot, pot: ptL.escapePot, band: bVal })
        }

        var juliaSectors5 = []
        var jStep5 = Math.max(2, Math.floor(contourSteps / 16))
        for (var js5 = 0; js5 < contourSteps; js5 += jStep5) {
            var jn5 = Math.min(contourSteps, js5 + jStep5)
            juliaSectors5.push([{ x: shapeOriginX, y: shapeOriginY }, boundaryPts[js5], boundaryPts[jn5]])
        }
        fillGeometrySegments(ctx, juliaSectors5, cfg, octWorld + palShift, palette, (0.36 + (1.0 - uOct) * 0.28 + state.bassSmooth * 0.16) * envAlpha)

        ctx.beginPath()
        for (var sp5 = 0; sp5 <= contourSteps; sp5++) {
            if (sp5 === 0) ctx.moveTo(boundaryPts[sp5].x, boundaryPts[sp5].y)
            else ctx.lineTo(boundaryPts[sp5].x, boundaryPts[sp5].y)
        }
        ctx.closePath()
        ctx.stroke()

        if (!isEcho) {
            var budStride = Math.max(5, Math.floor(contourSteps / Math.max(5, Math.min(10, folds * 2))))
            ctx.strokeStyle = colourWithAlpha(colAccent, (0.62 + state.highSmooth * 0.30) * envAlpha * (gpuActive ? 0.65 : 1.0))
            ctx.fillStyle = colourWithAlpha(colSecondary, (0.14 + state.bassSmooth * 0.10) * envAlpha * gpuAlphaMul)
            ctx.lineWidth = (1.0 + uOct * 1.6 + state.bassSmooth * 0.7) * envAlpha

            for (var bi = 0; bi < contourSteps; bi += budStride) {
                var bNode = boundaryPts[bi]
                var budScale = octScale * (0.14 + subDetail * 0.14 + bNode.band * 0.09)
                var outAng = bNode.theta
                ctx.beginPath()
                var cSteps = 16
                for (var cs = 0; cs <= cSteps; cs++) {
                    var ct = (cs / cSteps) * Math.PI * 2
                    var cr = budScale * (0.55 * (1.0 - Math.cos(ct)) + 0.26 * Math.pow(Math.max(0.0, -Math.cos(ct)), 3.0))
                    var lx = Math.cos(ct) * cr + budScale * 0.28
                    var ly = Math.sin(ct) * cr
                    var bx = bNode.x + lx * Math.cos(outAng) - ly * Math.sin(outAng)
                    var by = bNode.y + lx * Math.sin(outAng) + ly * Math.cos(outAng)
                    if (cs === 0) ctx.moveTo(bx, by)
                    else ctx.lineTo(bx, by)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }
        }
    }

    ctx.restore()
}

// Mode 12: 3D Sierpinski Fractal — Recursive 3D Sierpinski Tetrahedron / Triforce Pyramid & 3D Fractal Canopy
function drawMode12SierpinskiFractal(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var focalX = cx + endPt.dx * 0.30
    var focalY = cy + endPt.dy * 0.30

    var rx = 0.32 + Math.sin(state.t * 0.42) * 0.28 + state.bassSmooth * 0.14
    var ry = state.phase * 0.48
    var rz = Math.cos(state.t * 0.31) * 0.22
    var pyrScale = minDim * (0.34 + state.bassSmooth * 0.06)
    var fov = 3.8

    // Master 3D regular tetrahedron vertices (apex + 3 base corners)
    var rootV0 = [0.0, -1.06, 0.0]
    var rootV1 = [-0.96, 0.56, -0.55]
    var rootV2 = [ 0.96, 0.56, -0.55]
    var rootV3 = [ 0.0,  0.56,  1.10]

    // Audio-reactive breathing separation between recursive sub-tetrahedrons
    var shrink = clamp(0.48 - state.bassSmooth * 0.05, 0.38, 0.50)
    var maxDepth = isEcho ? 2 : (comp > 1.25 ? 3 : 2)
    var leafTetras = []

    function stepTowards(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t,
            a[2] + (b[2] - a[2]) * t
        ]
    }

    function collectSierpinski(v0, v1, v2, v3, depth, branchTag) {
        if (depth <= 0) {
            var p0 = project3DPoint(v0[0], v0[1], v0[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p1 = project3DPoint(v1[0], v1[1], v1[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p2 = project3DPoint(v2[0], v2[1], v2[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var p3 = project3DPoint(v3[0], v3[1], v3[2], rx, ry, rz, focalX, focalY, pyrScale, fov)
            var avgZ = (p0.z + p1.z + p2.z + p3.z) * 0.25
            leafTetras.push({ p0: p0, p1: p1, p2: p2, p3: p3, z: avgZ, tag: branchTag })
            return
        }
        var dNext = depth - 1
        collectSierpinski(
            v0,
            stepTowards(v0, v1, shrink),
            stepTowards(v0, v2, shrink),
            stepTowards(v0, v3, shrink),
            dNext, branchTag * 4 + 0
        )
        collectSierpinski(
            stepTowards(v1, v0, shrink),
            v1,
            stepTowards(v1, v2, shrink),
            stepTowards(v1, v3, shrink),
            dNext, branchTag * 4 + 1
        )
        collectSierpinski(
            stepTowards(v2, v0, shrink),
            stepTowards(v2, v1, shrink),
            v2,
            stepTowards(v2, v3, shrink),
            dNext, branchTag * 4 + 2
        )
        collectSierpinski(
            stepTowards(v3, v0, shrink),
            stepTowards(v3, v1, shrink),
            stepTowards(v3, v2, shrink),
            v3,
            dNext, branchTag * 4 + 3
        )
    }

    collectSierpinski(rootV0, rootV1, rootV2, rootV3, maxDepth, 0)

    // Painter's sort back-to-front by 3D depth `z`
    leafTetras.sort(function(a, b) { return a.z - b.z })

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 1. Render depth-sorted 3D Sierpinski sub-tetrahedrons with configurable Fill % (`layer2FillRatio`) and Segment Opacity % (`layer2FillOpacity`)
    var sierFaces12 = []
    for (var sf = 0; sf < leafTetras.length; sf++) {
        var tetF = leafTetras[sf]
        sierFaces12.push(
            [tetF.p0, tetF.p1, tetF.p3],
            [tetF.p0, tetF.p3, tetF.p2]
        )
    }
    fillGeometrySegments(ctx, sierFaces12, cfg, palShift, palette, 0.72 + state.bassSmooth * 0.24)

    var bucketCount = 4
    for (var bk = 0; bk < bucketCount; bk++) {
        var edgeCol = palette[(bk * 2 + 1 + palShift) % palette.length]
        ctx.strokeStyle = colourWithAlpha(edgeCol, (0.78 + state.beatPulse * 0.20) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.35 + state.bassSmooth * 1.1) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()

        for (var ti = 0; ti < leafTetras.length; ti++) {
            var tet = leafTetras[ti]
            if ((tet.tag % bucketCount) !== bk) continue
            var a = tet.p0, b = tet.p1, c = tet.p2, d = tet.p3

            // Front-Left & Front-Right triangular facets + base edge
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(d.x, d.y); ctx.closePath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(d.x, d.y); ctx.lineTo(c.x, c.y); ctx.closePath()
            ctx.moveTo(b.x, b.y); ctx.lineTo(c.x, c.y)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 6: 3D Sacred Lotus Hyperspace Dome & Harmonic Ripple Flower
function drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var maxR = Math.min(w, h) * 0.46 * (cfg.layer2Zoom || 1.0)
    var diagR = Math.hypot(w, h) * 0.68 * (cfg.layer2Zoom || 1.0)
    var symmetry = clamp(Math.round(Number(cfg.layer2Facets) || 6), 4, 16)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var rings = isEcho ? 4 : Math.max(6, Math.min(10, Math.round(7 * (cfg.layer2Complexity || 1.0) * lod)))
    var steps = isEcho ? 28 : 48
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    // 3D hemispherical dome camera breathing (pitch & roll)
    var camTilt = Math.sin(state.t * 0.48) * 0.28
    var camRoll = Math.cos(state.t * 0.36) * 0.14 * (1.0 + state.mid * 0.5)
    var cosTilt = Math.cos(camTilt), sinTilt = Math.sin(camTilt)

    ctx.save()
    ctx.translate(cx + endPt.dx * 0.28, cy + endPt.dy * 0.28)
    ctx.rotate(camRoll)
    ctx.globalCompositeOperation = "source-over"

    var prevDomeRing = null
    // 1. Concentric Harmonic Ripple Flower (`sin(r * 18.0 - t * 4.0 + sin(a * petals + t))`) & 3D Lotus Dome Tiers
    for (var r = rings; r >= 1; r--) {
        var frac = r / rings
        var domeZ = Math.cos(frac * Math.PI * 0.46) * (0.42 + state.bass * 0.24)
        var curRing = []

        for (var i = 0; i <= steps; i++) {
            var a = (i / steps) * Math.PI * 2
            var bVal = state.smoothBands[(i + r * 7) & 63]
            // Exact Harmonic Ripple Flower wave equation: sin(r * 18 - t * 4 + sin(a * petals + t)) * 0.5 + 0.5
            var flowerWave = Math.sin(frac * 18.0 - state.t * 4.0 + Math.sin(a * symmetry + state.t) * (1.0 + state.bass * 0.75)) * 0.5 + 0.5
            var petal = (flowerWave - 0.5) * (0.26 + bVal * 0.24 + state.mid * 0.12)
                      + Math.cos(a * symmetry * 2.0 - state.phase * 1.2) * 0.06
            var rad3 = frac * (0.86 + state.bass * 0.18 + petal)
            var x3 = Math.cos(a) * rad3
            var y3 = Math.sin(a) * rad3
            var z3 = domeZ + petal * 0.35

            // 3D pitch rotation & perspective projection expanding out toward diagR
            var yRot = y3 * cosTilt - z3 * sinTilt
            var zRot = y3 * sinTilt + z3 * cosTilt
            var persp = 1.55 / (2.10 - clamp(zRot, -1.1, 1.1))
            var ringScale = lerp(maxR, diagR * 0.86, frac * frac)
            curRing.push({
                x: x3 * ringScale * persp,
                y: yRot * ringScale * persp
            })
        }

        var jewelCol = palette[(r * 2 + palShift) % palette.length]
        var goldCol = palette[(r * 2 + 1 + palShift) % palette.length]

        // Filled translucent jewelled lotus petals & harmonic flower wave cells between tiers
        if (prevDomeRing && (!isEcho || (state.echoIndex || 0) < 3)) {
            var domeQuads6 = []
            for (var k = 0; k < steps; k += 2) {
                var kNext = Math.min(steps, k + 2)
                domeQuads6.push([prevDomeRing[k], prevDomeRing[kNext], curRing[kNext], curRing[k]])
            }
            fillGeometrySegments(ctx, domeQuads6, cfg, r + palShift, palette, 0.45 + (1.0 - frac) * 0.35 + state.bass * 0.18)

            // Radial jewelled lattice filaments connecting dome tiers
            ctx.strokeStyle = colourWithAlpha(jewelCol, 0.28 + (1.0 - frac) * 0.38)
            ctx.lineWidth = 1.0 + (1.0 - frac) * 1.2
            ctx.beginPath()
            for (var rf = 0; rf < steps; rf += 2) {
                ctx.moveTo(prevDomeRing[rf].x, prevDomeRing[rf].y)
                ctx.lineTo(curRing[rf].x, curRing[rf].y)
            }
            ctx.stroke()
        }

        // Thick glowing harmonic ripple flower crest
        ctx.strokeStyle = colourWithAlpha(goldCol, 0.54 + (1.0 - frac) * 0.44)
        ctx.lineWidth = (1.6 + (1.0 - frac) * 2.2 + state.beatPulse * 1.2) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var p = 0; p <= steps; p++) {
            if (p === 0) ctx.moveTo(curRing[p].x, curRing[p].y)
            else ctx.lineTo(curRing[p].x, curRing[p].y)
        }
        ctx.closePath()
        ctx.stroke()

        prevDomeRing = curRing
    }

    // 2. Counter-Rotating 3D Inner Merkaba / Sri Yantra Star Polyhedron & Radiant Core Filaments at the Dome Apex
    if (!isEcho || (state.echoIndex || 0) < 2) {
        var starR = maxR * (0.24 + state.bass * 0.12 + state.beatPulse * 0.08)
        for (var tri = 0; tri < 2; tri++) {
            var triRot = state.phase * (tri === 0 ? 1.35 : -1.35) + tri * (Math.PI / symmetry)
            ctx.fillStyle = colourWithAlpha(palette[(tri * 4 + 2 + palShift) % palette.length], 0.16 + state.bass * 0.14)
            ctx.strokeStyle = colourWithAlpha(palette[(tri * 4 + palShift) % palette.length], 0.88)
            ctx.lineWidth = 2.2 + state.beatPulse * 1.2
            ctx.beginPath()
            for (var sv = 0; sv <= symmetry; sv++) {
                var sa = (sv / symmetry) * Math.PI * 2 + triRot
                var sr = (sv % 2 === 0) ? starR : (starR * 0.42)
                var sx = Math.cos(sa) * sr
                var sy = Math.sin(sa) * sr * cosTilt
                if (sv === 0) ctx.moveTo(sx, sy)
                else ctx.lineTo(sx, sy)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }

        // Radiant crown stamen filaments erupting from the sacred lotus apex
        ctx.strokeStyle = colourWithAlpha(palette[(1 + palShift) % palette.length], 0.74 + state.high * 0.26)
        ctx.lineWidth = 1.4 + state.bass * 1.2
        ctx.beginPath()
        for (var cf = 0; cf < symmetry; cf++) {
            var cfa = (cf / symmetry) * Math.PI * 2 - state.phase * 0.75
            var cfr = starR * (0.68 + state.smoothBands[(cf * 4) & 63] * 0.55)
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(cfa) * cfr, Math.sin(cfa) * cfr * cosTilt)
        }
        ctx.stroke()
    }

    ctx.restore()
}

// Mode 7: 3D Relativistic Gargantua Black Hole, Infalling Spiral Accretion Vortex, Einstein Lensing & Twin Quasar Jets
function drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var minDim = Math.min(w, h)
    var zoom = clamp(cfg.layer2Zoom || 1.0, 0.5, 2.5)
    var diagR = Math.hypot(w, h) * 0.72 * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var trCount = clamp(Math.round(Number(cfg && cfg.tracerCount !== undefined ? cfg.tracerCount : 9)), 2, 16)
    var palShift = Math.floor(state.hueShift / 45)

    var driftT = state.driftTime !== undefined ? state.driftTime : state.t
    var tunT = state.tunnelTime !== undefined ? state.tunnelTime : state.t
    var endPt = computeTracerEndpoint(w, h, driftT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)
    var bhX = cx + endPt.dx * 0.28
    var bhY = cy + endPt.dy * 0.28
    var ehR = minDim * (0.095 + state.bassSmooth * 0.032) * zoom

    // 3D orbital precession and disc inclination
    var precession = -0.28 + Math.sin(driftT * 0.34) * 0.22
    var discTilt = 0.36 + Math.cos(driftT * 0.27) * 0.08

    ctx.save()
    ctx.translate(bhX, bhY)
    ctx.rotate(precession)
    ctx.globalCompositeOperation = "source-over"

    // 1. Twin Relativistic Helical Quasar Plasma Jets blasting from North & South Poles past diagR
    var jetLen = diagR * (0.78 + state.bassSmooth * 0.32)
    var jetSteps = 18
    for (var pole = -1; pole <= 1; pole += 2) {
        var jetCol = palette[(pole < 0 ? 3 : 5 + palShift) % palette.length]
        var coreCol = palette[(1 + palShift) % palette.length]
        var leftJet = [], rightJet = []
        for (var js = 0; js <= jetSteps; js++) {
            var ju = js / jetSteps
            var jy = pole * (ehR * 0.82 + Math.pow(ju, 1.22) * jetLen)
            var bJet = state.smoothBands[(js * 3 + (pole > 0 ? 0 : 16)) & 63]
            var coneW = (ehR * 0.14 + Math.pow(ju, 1.38) * minDim * 0.22) * (1.0 + bJet * 0.55)
            var helixSwirl = Math.sin(ju * 8.5 - tunT * 5.2 * pole) * coneW
            leftJet.push({ x: helixSwirl - coneW * 0.45, y: jy })
            rightJet.push({ x: helixSwirl + coneW * 0.45, y: jy })
        }

        var jetQuads7 = []
        for (var jq7 = 0; jq7 < jetSteps; jq7 += 2) {
            var jn7 = Math.min(jetSteps, jq7 + 2)
            jetQuads7.push([leftJet[jq7], leftJet[jn7], rightJet[jn7], rightJet[jq7]])
        }
        fillGeometrySegments(ctx, jetQuads7, cfg, (pole < 0 ? 3 : 5) + palShift, palette, 0.52 + state.bassSmooth * 0.30)

        ctx.strokeStyle = colourWithAlpha(coreCol, 0.84 + state.beatSmooth * 0.16)
        ctx.lineWidth = 2.0 + state.bassSmooth * 2.0
        ctx.beginPath()
        for (var j0 = 0; j0 <= jetSteps; j0++) {
            if (j0 === 0) ctx.moveTo(leftJet[j0].x, leftJet[j0].y)
            else ctx.lineTo(leftJet[j0].x, leftJet[j0].y)
        }
        for (var j1 = jetSteps; j1 >= 0; j1--) {
            ctx.lineTo(rightJet[j1].x, rightJet[j1].y)
        }
        ctx.closePath()
        ctx.stroke()
    }

    // 2. Gravitational-Lensing Einstein Halo Arches (rear accretion disc bent OVER and UNDER the event horizon)
    for (var arch = -1; arch <= 1; arch += 2) {
        for (var hBand = 1; hBand >= 0; hBand--) {
            var archCol = palette[(hBand * 2 + (arch < 0 ? 0 : 2) + palShift) % palette.length]
            ctx.fillStyle = colourWithAlpha(archCol, 0.14 + (1 - hBand) * 0.12 + state.bassSmooth * 0.12)
            ctx.strokeStyle = colourWithAlpha(palette[(hBand + 1 + palShift) % palette.length], 0.78 + state.beatSmooth * 0.22)
            ctx.lineWidth = (hBand === 0 ? 2.5 : 1.5) + state.bassSmooth * 1.6
            ctx.beginPath()
            var archSteps = 32
            for (var as = 0; as <= archSteps; as++) {
                var au = (as / archSteps) * Math.PI
                var bH = state.smoothBands[(as * 2 + hBand * 7) & 63]
                var rOuter = ehR * (1.06 + hBand * 0.18 + Math.sin(au) * (0.42 + bH * 0.28 + state.bassSmooth * 0.18))
                var ax = Math.cos(au) * rOuter * 1.38
                var ay = arch * Math.sin(au) * rOuter * 0.96
                if (as === 0) ctx.moveTo(ax, ay)
                else ctx.lineTo(ax, ay)
            }
            for (var asBack = archSteps; asBack >= 0; asBack--) {
                var au2 = (asBack / archSteps) * Math.PI
                var rInner = ehR * (0.98 + hBand * 0.12)
                ctx.lineTo(Math.cos(au2) * rInner * 1.15, arch * Math.sin(au2) * rInner * 0.84)
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
    }

    // 3. Infalling Logarithmic Spiral Matter Streams pulled from diagR into the Event Horizon
    var armCount = Math.max(10, Math.min(28, Math.round((8 + trCount) * comp)))
    var inflowPhase = (tunT * 0.68) % 1.0
    for (var arm = 0; arm < armCount; arm++) {
        var armCol = palette[(arm + palShift) % palette.length]
        var baseAng = (arm / armCount) * Math.PI * 2 - state.phase * 1.15
        ctx.strokeStyle = colourWithAlpha(armCol, 0.62 + state.midSmooth * 0.34)
        ctx.lineWidth = 1.6 + state.bassSmooth * 1.5
        ctx.beginPath()
        var segSteps = 18
        for (var sp = 0; sp <= segSteps; sp++) {
            var su = clamp((sp + 1.0 - inflowPhase) / segSteps, 0.015, 1.0)
            var sr = ehR * 1.02 + Math.pow(su, 1.78) * (diagR - ehR)
            // Relativistic frame-dragging angular whip as matter spirals into r -> ehR
            var sAng = baseAng + 3.1 / (su + 0.16)
            var bArm = state.smoothBands[(arm * 3 + sp * 2) & 63]
            // Doppler beaming stretches & brightens the approaching left side
            var doppler = 1.0 + 0.22 * Math.cos(sAng)
            var sx = Math.cos(sAng) * sr * doppler * (1.0 + bArm * 0.10)
            var sy = Math.sin(sAng) * sr * discTilt * (1.0 + bArm * 0.14)
            if (sp === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
    }

    // 4. Central Obsidian Event Horizon Singularity Core & Asymmetric Relativistic Photon Ring
    ctx.fillStyle = "#010104"
    ctx.strokeStyle = colourWithAlpha("#fff6d6", 0.94)
    ctx.lineWidth = 2.6 + state.bassSmooth * 2.2
    ctx.beginPath()
    ctx.arc(0, 0, ehR, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
}

// Mode 8: 3D Bioluminescent Deep-Sea Jellyfish & Volumetric Mycelial Canopy (Free-Swimming Across the Entire Stage)
function drawMode8AlienMycelium(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var baseMinDim = Math.min(w, h) * 0.34 * (cfg.layer2Zoom || 1.0)
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var hist = state.waveHistory || []
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var swimT = (state.driftTime !== undefined ? state.driftTime : state.t) * (0.75 + 0.25 * (cfg.layer2Speed || 1.0))
    var endPt = computeTracerEndpoint(w, h, swimT, cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0, 1.0)

    function drawSingleSwimmingJellyfish(jIdx, jellyX, jellyY, headingAngle, scaleMul, phaseOff) {
        var minDim = baseMinDim * scaleMul
        var tendrils = isEcho ? 8 : (jIdx === 0 ? 12 : 9)
        var segs = isEcho ? 8 : Math.max(9, Math.min(16, Math.round((jIdx === 0 ? 12 : 10) * comp)))
        var pulseContract = Math.sin(state.t * 3.4 + phaseOff + state.bass * 2.4)
        var bellCentreY = -minDim * (0.10 + pulseContract * 0.05)

        ctx.save()
        ctx.translate(jellyX, jellyY)
        ctx.rotate(headingAngle)
        ctx.globalCompositeOperation = "source-over"

        // 1. 3D Translucent Bioluminescent Jellyfish Bell / Mycelial Canopy Dome
        var bellLayers = isEcho ? 2 : (jIdx === 0 ? 4 : 3)
        var bellSteps = isEcho ? 18 : 28
        for (var bl = bellLayers - 1; bl >= 0; bl--) {
            var bFrac = (bl + 1) / bellLayers
            var bellW = minDim * (0.14 + bFrac * 0.22) * (1.0 - pulseContract * 0.16 + state.bass * 0.20)
            var bellH = minDim * (0.09 + bFrac * 0.14) * (1.0 + pulseContract * 0.20 + state.bass * 0.16)
            var canopyCol = palette[(bl * 2 + jIdx * 3 + palShift) % palette.length]
            var rimCol = palette[(bl * 2 + 1 + jIdx * 3 + palShift) % palette.length]

            var topBell8 = []
            var botBell8 = []
            for (var bs = 0; bs <= bellSteps; bs++) {
                var u = bs / bellSteps
                var a = Math.PI + u * Math.PI
                var bVal0 = state.smoothBands[(bs * 2 + bl * 7 + jIdx * 11) & 63]
                var scallop = Math.sin(u * Math.PI * 8 + state.t * 3.2 + phaseOff) * minDim * 0.018 * (1.0 + bVal0)
                var bx = Math.cos(a) * (bellW + scallop)
                var by = bellCentreY + Math.sin(a) * bellH
                var sc = Math.sin((1.0 - u) * Math.PI * 10 + state.t * 4.4 + bl + phaseOff) * minDim * (0.018 + state.mid * 0.028)
                var mx = Math.cos((1.0 - u) * Math.PI) * bellW
                var my = bellCentreY + Math.sin((1.0 - u) * Math.PI) * (bellH * 0.28) + sc
                topBell8.push({ x: bx, y: by })
                botBell8.push({ x: mx, y: my })
            }
            var bellQuads8 = []
            for (var bq8 = 0; bq8 < bellSteps; bq8 += 2) {
                var bn8 = Math.min(bellSteps, bq8 + 2)
                bellQuads8.push([topBell8[bq8], topBell8[bn8], botBell8[bn8], botBell8[bq8]])
            }
            fillGeometrySegments(ctx, bellQuads8, cfg, bl * 2 + jIdx * 3 + palShift, palette, (0.48 + (1.0 - bFrac) * 0.28 + state.bass * 0.16) * (isEcho ? 0.55 : 1.0))

            ctx.strokeStyle = colourWithAlpha(rimCol, 0.58 + (1.0 - bFrac) * 0.38)
            ctx.lineWidth = (1.2 + (1.0 - bFrac) * 1.5 + state.beatPulse * 1.0) * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var b0 = 0; b0 <= bellSteps; b0++) {
                if (b0 === 0) ctx.moveTo(topBell8[b0].x, topBell8[b0].y)
                else ctx.lineTo(topBell8[b0].x, topBell8[b0].y)
            }
            for (var b1 = bellSteps; b1 >= 0; b1--) {
                ctx.lineTo(botBell8[b1].x, botBell8[b1].y)
            }
            ctx.closePath()
            ctx.stroke()
        }

        // 2. Extruded 3D Bioluminescent Ribbon Tentacles & Travelling Synaptic Spore Pods
        var baseSpanW = minDim * 0.28 * (1.0 - pulseContract * 0.14)
        var travelPulse = ((state.t * 3.8 + phaseOff) % segs)
        for (var bucket = 0; bucket < 3; bucket++) {
            var tendrilFill = palette[(bucket * 3 + 1 + jIdx * 2 + palShift) % palette.length]
            var tendrilStroke = palette[(bucket * 3 + jIdx * 2 + palShift) % palette.length]
            ctx.fillStyle = colourWithAlpha(tendrilFill, (0.16 + state.mid * 0.18) * (isEcho ? 0.55 : 1.0))
            ctx.strokeStyle = colourWithAlpha(tendrilStroke, 0.68 + state.bass * 0.30)
            ctx.lineWidth = 1.4 + state.bass * 1.15
            ctx.beginPath()

            var nodeSpores = []
            for (var td = bucket; td < tendrils; td += 3) {
                var tNorm = (td / Math.max(1, tendrils - 1)) * 2.0 - 1.0
                var px = tNorm * baseSpanW
                var py = bellCentreY + Math.sin((td / tendrils) * Math.PI) * minDim * 0.04
                var stepLen = (minDim * (0.35 + state.bass * 0.16 + Math.max(0.0, -pulseContract) * 0.08)) / segs
                var leftX = [px - 2.2], leftY = [py]
                var rightX = [px + 2.2], rightY = [py]

                for (var s = 1; s <= segs; s++) {
                    var frac = s / segs
                    var snap = (hist.length > s && hist[s] && hist[s].bands) ? hist[s].bands : state.smoothBands
                    var bVal = snap[(td * 2 + s) & 31] !== undefined ? snap[(td * 2 + s) & 31] : (state.smoothBands[(td * 3 + s) & 63] || 0.1)
                    var wave = Math.sin(state.t * 3.3 + phaseOff - s * 0.50 + td * 0.7) * (0.40 + state.mid * 0.58 + bVal * 0.48)
                    var curAng = Math.PI * 0.5 + tNorm * 0.28 * (1.0 - frac * 0.5) + wave * frac
                    px += Math.cos(curAng) * stepLen
                    py += Math.sin(curAng) * stepLen
                    var ribW = (2.6 * (1.0 - frac * 0.72) + bVal * 2.9) * (isEcho ? 0.65 : 1.0)
                    var nx = -Math.sin(curAng) * ribW
                    var ny = Math.cos(curAng) * ribW
                    leftX.push(px + nx)
                    leftY.push(py + ny)
                    rightX.push(px - nx)
                    rightY.push(py - ny)

                    var isTravelHead = Math.abs(((s - travelPulse + segs) % segs) - 1.0) < 1.2
                    if (!isEcho && (s % 4 === 0 || s === segs || isTravelHead)) {
                        nodeSpores.push(px, py, (isTravelHead ? 2.2 : 1.4) + bVal * 2.6)
                    }
                }

                ctx.moveTo(leftX[0], leftY[0])
                for (var k0 = 1; k0 <= segs; k0++) ctx.lineTo(leftX[k0], leftY[k0])
                for (var k1 = segs; k1 >= 0; k1--) ctx.lineTo(rightX[k1], rightY[k1])
                ctx.closePath()
            }
            ctx.fill()
            ctx.stroke()

            if (nodeSpores.length > 0) {
                ctx.fillStyle = colourWithAlpha(palette[(bucket * 3 + 2 + jIdx * 2 + palShift) % palette.length], 0.86)
                ctx.beginPath()
                for (var sp = 0; sp < nodeSpores.length; sp += 3) {
                    var sx = nodeSpores[sp], sy = nodeSpores[sp + 1], sr = nodeSpores[sp + 2]
                    ctx.rect(sx - sr, sy - sr, sr * 2.0, sr * 2.0)
                }
                ctx.fill()
            }
        }
        ctx.restore()
    }

    // Primary free-swimming Mycelium Jellyfish roaming across the full stage with pulsing bell thrust & banking
    var thrustSurge = Math.sin(state.t * 3.4 + state.bass * 2.0) * 0.035 * Math.min(w, h)
    var roamX0 = cx + endPt.dx * 0.72 + Math.sin(swimT * 0.62) * (w * 0.28) + Math.cos(swimT * 1.15) * (w * 0.11)
    var roamY0 = cy + endPt.dy * 0.65 + Math.cos(swimT * 0.48) * (h * 0.24) + Math.sin(swimT * 0.94) * (h * 0.09)
    var vx0 = Math.cos(swimT * 0.62) * 0.62 * (w * 0.28) - Math.sin(swimT * 1.15) * 1.15 * (w * 0.11)
    var vy0 = -Math.sin(swimT * 0.48) * 0.48 * (h * 0.24) + Math.cos(swimT * 0.94) * 0.94 * (h * 0.09)
    var bankAngle0 = clamp((vx0 / Math.max(1.0, w * 0.25)) * 0.52, -0.68, 0.68) + Math.sin(state.t * 0.85) * 0.14
    roamX0 += Math.sin(bankAngle0) * thrustSurge
    roamY0 -= Math.cos(bankAngle0) * thrustSurge
    var scaleBreath0 = (0.86 + 0.26 * (0.5 + 0.5 * Math.sin(swimT * 0.54)) + state.bassSmooth * 0.14)
    drawSingleSwimmingJellyfish(0, roamX0, roamY0, bankAngle0, scaleBreath0, 0.0)

    // Companion counter-swimming Mycelium Jellyfish in 3D depth parallax (when complexity >= 0.75)
    if (!isEcho && comp >= 0.75) {
        var roamX1 = cx - endPt.dx * 0.55 + Math.cos(swimT * 0.51 + 2.1) * (w * 0.31)
        var roamY1 = cy - endPt.dy * 0.52 + Math.sin(swimT * 0.67 + 1.4) * (h * 0.25)
        var vx1 = -Math.sin(swimT * 0.51 + 2.1) * 0.51 * (w * 0.31)
        var bankAngle1 = clamp((vx1 / Math.max(1.0, w * 0.25)) * 0.55, -0.72, 0.72) + Math.cos(state.t * 0.92 + 1.7) * 0.16
        var scaleBreath1 = 0.56 + 0.20 * (0.5 + 0.5 * Math.cos(swimT * 0.47 + 1.8)) + state.midSmooth * 0.10
        drawSingleSwimmingJellyfish(1, roamX1, roamY1, bankAngle1, scaleBreath1, 2.35)
    }

    // 3. Drifting 3D Bioluminescent Plankton & Mycelial Spore Cloud across the stage
    if (!isEcho) {
        var sporeCount = Math.min(state.spores ? state.spores.length : 0, 24)
        if (sporeCount > 0) {
            ctx.save()
            ctx.fillStyle = colourWithAlpha(palette[(4 + palShift) % palette.length], 0.68 + state.high * 0.28)
            ctx.beginPath()
            for (var scIdx = 0; scIdx < sporeCount; scIdx++) {
                var spObj = state.spores[scIdx]
                var spX = roamX0 + (spObj.x - 0.5) * baseMinDim * 1.45
                var spY = roamY0 + (spObj.y - 0.5) * baseMinDim * 1.45
                var spR = 1.6 + (state.smoothBands[(scIdx * 3) & 63] || 0.1) * 3.0
                ctx.rect(spX - spR, spY - spR, spR * 2.0, spR * 2.0)
            }
            ctx.fill()
            ctx.restore()
        }
    }
}

// Mode 9: Classic Matrix Digital Rain Waterfall (Multi-Depth 3D Parallax Phosphor-Green Code Cascade)
function drawMode9CyberMatrix(ctx, w, h, state, palette, cfg) {
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var zoom = clamp(cfg.layer2Zoom || 1.0, 0.5, 2.2)
    var trCount = clamp(Math.round(Number(cfg.tracerCount) || 8), 1, 16)
    var matT = state.matrixTime !== undefined ? state.matrixTime : state.t

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    function addMatrixGlyph(ctx, gx, gy, gw, gh, seed) {
        var pat = (seed & 7)
        var barH = Math.max(1.3, gh * 0.18)
        var barW = Math.max(1.3, gw * 0.22)
        ctx.rect(gx - gw * 0.42, gy - gh * 0.42, gw * 0.84, barH)
        if (pat === 0) {
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.24, gw * 0.84, barH)
        } else if (pat === 1) {
            ctx.rect(gx - gw * 0.36, gy - gh * 0.06, gw * 0.72, barH)
            ctx.rect(gx - barW * 0.5, gy - gh * 0.06, barW, gh * 0.48)
        } else if (pat === 2) {
            ctx.rect(gx - gw * 0.34, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 3) {
            ctx.rect(gx - gw * 0.38, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx + gw * 0.16, gy - gh * 0.12, barW, gh * 0.54)
        } else if (pat === 4) {
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.04, gw * 0.32, barH)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.12, gw * 0.30, barH)
        } else if (pat === 5) {
            ctx.rect(gx + gw * 0.20, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.36, gy - barH * 0.5, gw * 0.68, barH)
            ctx.rect(gx - gw * 0.42, gy + gh * 0.26, gw * 0.84, barH)
        } else if (pat === 6) {
            ctx.rect(gx - gw * 0.32, gy - gh * 0.20, barW, gh * 0.52)
            ctx.rect(gx + gw * 0.12, gy - gh * 0.42, barW, gh * 0.84)
        } else {
            ctx.rect(gx - barW * 0.5, gy - gh * 0.42, barW, gh * 0.84)
            ctx.rect(gx - gw * 0.40, gy - barH * 0.5, gw * 0.80, barH)
            ctx.rect(gx - gw * 0.38, gy + gh * 0.24, barW, barH * 1.2)
            ctx.rect(gx + gw * 0.18, gy + gh * 0.24, barW, barH * 1.2)
        }
    }

    // 3 Depth Planes of Pure Vertical Falling Matrix Digital Rain
    for (var zPlane = 0; zPlane <= 2; zPlane++) {
        var cols = Math.max(16, Math.min(46, Math.round((18 + zPlane * 9) * clamp(comp, 0.65, 1.35) / Math.sqrt(zoom))))
        var colW = w / cols
        var glyphW = clamp(colW * 0.64, 4.5, 22.0)
        var glyphH = glyphW * 1.28
        var trailLen = Math.max(6, Math.min(20, Math.round(5 + zPlane * 3 + trCount * 0.6)))
        var planeAlpha = 0.38 + zPlane * 0.30

        var colHead = "#eafff5"
        var colNear = zPlane === 2 ? "#00ff66" : "#10d96b"
        var colMid  = zPlane === 1 ? "#09bd56" : "#059e47"
        var colTail = "#034d1f"

        // 1. Subtle vertical phosphor scanline beam behind active columns
        if (zPlane >= 1) {
            ctx.fillStyle = colourWithAlpha("#00ff66", 0.04 + state.bass * 0.06)
            ctx.beginPath()
            for (var cBeam = 0; cBeam < cols; cBeam++) {
                var bBeam = state.smoothBands[(cBeam * 2 + zPlane * 7) & 63]
                if (bBeam < 0.20) continue
                var cSeedB = ((cBeam * 73 + zPlane * 131) % 97) / 97.0
                var fallSpdB = 0.24 + cSeedB * 0.36 + zPlane * 0.12
                var headYB = (((matT * fallSpdB + cSeedB * 3.7) % 1.45) - 0.15) * h
                var beamH = trailLen * glyphH * 0.85
                var bx = (cBeam + 0.5) * colW
                ctx.rect(bx - glyphW * 0.45, headYB - beamH, glyphW * 0.90, beamH + glyphH)
            }
            ctx.fill()
        }

        // 2. Trailing Phosphor-Green Glyph Cascade (pure vertical columns, constant per-column fall speed!)
        var tierColours = [colNear, colMid, colTail]
        var tierAlphas = [0.92 * planeAlpha, 0.64 * planeAlpha, 0.34 * planeAlpha]

        for (var tier = 2; tier >= 0; tier--) {
            ctx.fillStyle = colourWithAlpha(tierColours[tier], tierAlphas[tier])
            ctx.beginPath()
            var tStart = tier === 0 ? 1 : (tier === 1 ? 3 : Math.floor(trailLen * 0.55))
            var tEnd = tier === 0 ? 2 : (tier === 1 ? Math.floor(trailLen * 0.55) - 1 : trailLen)

            for (var c = 0; c < cols; c++) {
                var cSeed = ((c * 73 + zPlane * 131) % 97) / 97.0
                var fallSpeed = 0.24 + cSeed * 0.36 + zPlane * 0.12
                var streams = (zPlane === 2 && (c % 3 === 0)) ? 2 : 1

                for (var st = 0; st < streams; st++) {
                    var headY = (((matT * fallSpeed + cSeed * 3.7 + st * 0.68) % 1.45) - 0.15) * h
                    var gx = (c + 0.5) * colW

                    for (var k = tStart; k <= tEnd; k++) {
                        var gy = headY - k * glyphH * 1.12
                        if (gy < -glyphH || gy > h + glyphH) continue
                        var charTick = Math.floor(matT * (5.0 + (k & 3) * 2.0))
                        var gSeed = (c * 31 + k * 17 + zPlane * 53 + st * 19 + charTick) & 255
                        var scaleK = 1.0 - (k / (trailLen + 2)) * 0.22
                        addMatrixGlyph(ctx, gx, gy, glyphW * scaleK, glyphH * scaleK, gSeed)
                    }
                }
            }
            ctx.fill()
        }

        // 3. White-Hot Phosphor-Mint Leading Head Glyphs dropping vertically at the tip of every Matrix stream
        ctx.fillStyle = colourWithAlpha(colHead, clamp(0.96 * planeAlpha, 0.2, 1.0))
        ctx.strokeStyle = colourWithAlpha("#00ff66", 0.55 * planeAlpha)
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (var ch = 0; ch < cols; ch++) {
            var bIdxH = (ch * 2 + zPlane * 9) & 63
            var bValH = state.smoothBands[bIdxH]
            var cSeedH = ((ch * 73 + zPlane * 131) % 97) / 97.0
            var fallSpeedH = 0.24 + cSeedH * 0.36 + zPlane * 0.12
            var streamsH = (zPlane === 2 && (ch % 3 === 0)) ? 2 : 1

            for (var stH = 0; stH < streamsH; stH++) {
                var headYH = (((matT * fallSpeedH + cSeedH * 3.7 + stH * 0.68) % 1.45) - 0.15) * h
                if (headYH < -glyphH || headYH > h + glyphH) continue
                var gxH = (ch + 0.5) * colW
                var headBoost = 1.06 + bValH * 0.20
                var headSeed = (ch * 41 + Math.floor(matT * 10.0) + zPlane * 19 + stH * 11) & 255
                addMatrixGlyph(ctx, gxH, headYH, glyphW * headBoost, glyphH * headBoost, headSeed)
            }
        }
        ctx.fill()
        ctx.stroke()
    }

    ctx.restore()
}

// Precomputed 4D Tesseract 24 cell quad faces for volumetric hyper-facet rendering
var TESSERACT_FACES = [
    [0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5],
    [8, 9, 11, 10], [12, 13, 15, 14], [8, 9, 13, 12], [10, 11, 15, 14], [8, 10, 14, 12], [9, 11, 15, 13],
    [0, 1, 9, 8], [2, 3, 11, 10], [4, 5, 13, 12], [6, 7, 15, 14],
    [0, 2, 10, 8], [1, 3, 11, 9], [4, 6, 14, 12], [5, 7, 15, 13],
    [0, 4, 12, 8], [1, 5, 13, 9], [2, 6, 14, 10], [3, 7, 15, 11]
]

// Mode 10: Unlocked Pure 4D Hypercube (Tesseract rotating freely in all 6 4D/3D planes with Volumetric Hyper-Facets)
function drawMode10SacredPolytope(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var scale = Math.min(w, h) * 0.32 * (cfg.layer2Zoom || 1.0) * (1.0 + state.bass * 0.28 + state.beatPulse * 0.16)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.globalCompositeOperation = "source-over"

    // Full 6-plane 4D rotation (XW, YW, ZW + 3D XY, XZ, YZ) — completely unlocked!
    var aXW = state.t * 0.78 + state.bass * 0.95
    var aYW = state.t * 0.56 - state.mid * 0.75
    var aZW = state.t * 0.41 + state.high * 0.65
    var aXY = state.phase * 0.48
    var aXZ = state.t * 0.33

    var cosXW = Math.cos(aXW), sinXW = Math.sin(aXW)
    var cosYW = Math.cos(aYW), sinYW = Math.sin(aYW)
    var cosZW = Math.cos(aZW), sinZW = Math.sin(aZW)
    var cosXY = Math.cos(aXY), sinXY = Math.sin(aXY)
    var cosXZ = Math.cos(aXZ), sinXZ = Math.sin(aXZ)

    var proj = []
    for (var i = 0; i < 16; i++) {
        var bVal = state.smoothBands[(i * 4) & 63]
        var m = 1.0 + bVal * 0.32
        var x = ((i & 1) ? 1 : -1) * m
        var y = ((i & 2) ? 1 : -1) * m
        var z = ((i & 4) ? 1 : -1) * m
        var w4 = ((i & 8) ? 1 : -1) * m

        // 4D plane rotations (XW, YW, ZW)
        var x1 = x * cosXW - w4 * sinXW
        var w1 = x * sinXW + w4 * cosXW
        var y2 = y * cosYW - w1 * sinYW
        var w2 = y * sinYW + w1 * cosYW
        var z3 = z * cosZW - w2 * sinZW
        var w3 = z * sinZW + w2 * cosZW

        // Free 3D spatial rotations (XY, XZ)
        var rx1 = x1 * cosXY - y2 * sinXY
        var ry1 = x1 * sinXY + y2 * cosXY
        var rx2 = rx1 * cosXZ - z3 * sinXZ
        var rz2 = rx1 * sinXZ + z3 * cosXZ

        var d4 = 2.65 / (3.35 - clamp(w3, -1.85, 1.85))
        var d3 = 2.25 / (3.15 - clamp(rz2 * d4, -1.85, 1.85))
        var pScale = d4 * d3
        proj.push({
            x: rx2 * pScale * scale,
            y: ry1 * pScale * scale,
            p: pScale
        })
    }

    // Translucent Volumetric 4D Hyper-Cell Faces (selectable Fill % & Segment Opacity %)
    if (!state.isTracerEcho || (state.echoIndex || 0) < 3) {
        var tessPolys10 = []
        for (var f = 0; f < TESSERACT_FACES.length; f++) {
            var face = TESSERACT_FACES[f]
            tessPolys10.push([proj[face[0]], proj[face[1]], proj[face[2]], proj[face[3]]])
        }
        fillGeometrySegments(ctx, tessPolys10, cfg, Math.floor((state.hueShift || 0) / 45), palette, 0.68 + state.bass * 0.28)
    }

    // Group 0: Inner 3D cube cell (w = -1, vertices 0..7, 12 edges)
    ctx.strokeStyle = colourWithAlpha(palette[0 % palette.length], 0.82 + state.bass * 0.18)
    ctx.lineWidth = 2.2 + state.beatPulse * 1.4
    ctx.beginPath()
    for (var u0 = 0; u0 < 8; u0++) {
        for (var b0 = 0; b0 < 3; b0++) {
            var v0 = u0 ^ (1 << b0)
            if (u0 < v0) {
                ctx.moveTo(proj[u0].x, proj[u0].y)
                ctx.lineTo(proj[v0].x, proj[v0].y)
            }
        }
    }
    ctx.stroke()

    // Group 1: Outer 3D cube cell (w = +1, vertices 8..15, 12 edges)
    ctx.strokeStyle = colourWithAlpha(palette[3 % palette.length], 0.82 + state.mid * 0.18)
    ctx.lineWidth = 2.2 + state.beatPulse * 1.4
    ctx.beginPath()
    for (var u1 = 8; u1 < 16; u1++) {
        for (var b1 = 0; b1 < 3; b1++) {
            var v1 = u1 ^ (1 << b1)
            if (u1 < v1) {
                ctx.moveTo(proj[u1].x, proj[u1].y)
                ctx.lineTo(proj[v1].x, proj[v1].y)
            }
        }
    }
    ctx.stroke()

    // Group 2: 8 Fourth-Dimensional W-axis Hyper-Struts connecting inner and outer cubes (bit 3)
    ctx.strokeStyle = colourWithAlpha(palette[6 % palette.length], 0.88 + state.high * 0.12)
    ctx.lineWidth = 2.5 + state.bass * 1.6
    ctx.beginPath()
    for (var u2 = 0; u2 < 8; u2++) {
        var v2 = u2 ^ 8
        ctx.moveTo(proj[u2].x, proj[u2].y)
        ctx.lineTo(proj[v2].x, proj[v2].y)
    }
    ctx.stroke()

    // Glowing 4D corner vertices on the front slices
    if (!state.isTracerEcho || (state.echoIndex || 0) < 3) {
        ctx.fillStyle = colourWithAlpha(palette[1 % palette.length], 0.88)
        ctx.beginPath()
        for (var k = 0; k < 16; k++) {
            var nr = Math.max(1.8, 2.4 * proj[k].p)
            ctx.rect(proj[k].x - nr, proj[k].y - nr, nr * 2.0, nr * 2.0)
        }
        ctx.fill()
    }

    ctx.restore()
}

// Mode 11: 3D Lorenz Butterfly & Aizawa Twin-Wing Strange Attractor Manifold (Calmed, Smooth Laminar Orbits)
function drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var lod = state.echoLod || 1.0
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0) * lod
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.31 + state.bassSmooth * 0.04)

    // Calm, smooth 3D gimbal rotation around the twin-wing Lorenz butterfly manifold
    var rx = 0.38 + Math.sin(state.t * 0.22) * 0.20 + state.bassSmooth * 0.08
    var ry = state.phase * 0.28 + Math.cos(state.t * 0.18) * 0.14
    var rz = Math.sin(state.t * 0.15) * 0.14
    var fov = 3.8

    var shells = isEcho ? 2 : 3
    var segs = isEcho ? 18 : Math.max(22, Math.min(32, Math.floor(26 * clamp(comp, 0.65, 1.25))))
    var segStep = isEcho ? 4 : 4

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 1. Twin Counter-Rotating 3D Lorenz Butterfly Wing Manifolds (Left Wing = -1, Right Wing = +1)
    for (var wingIdx = 0; wingIdx < 2; wingIdx++) {
        var wSign = wingIdx === 0 ? -1.0 : 1.0
        var wingTilt = wSign * (0.50 + state.midSmooth * 0.07)
        var cosWT = Math.cos(wingTilt)
        var sinWT = Math.sin(wingTilt)
        var wingCentreX = wSign * (0.54 + state.bassSmooth * 0.05)
        var wingCentreY = wSign * 0.08
        var wingCentreZ = -0.06 * wSign

        var wingRings = []
        for (var sh = 0; sh < shells; sh++) {
            var uSh = (sh + 1) / shells
            var bShell = state.smoothBands[((sh * 7 + wingIdx * 19) & 63)] || 0.15
            var rMajor = (0.20 + uSh * 0.46) * (1.0 + bShell * 0.10)
            var rMinor = rMajor * (0.78 + 0.08 * Math.sin(state.t * 0.45 + sh))
            var ringPts = []

            for (var s = 0; s <= segs; s++) {
                var u = (s / segs) * Math.PI * 2.0
                // Smooth laminar harmonic orbit (no jagged per-vertex FFT jitter)
                var phaseA = u + wSign * state.t * (0.52 - uSh * 0.10)
                var lx = Math.cos(phaseA) * rMajor * (1.0 + 0.10 * Math.cos(u * 2.0 + state.t * 0.5))
                var ly = Math.sin(phaseA) * rMinor * (1.0 + state.bassSmooth * 0.08)
                var lz = Math.sin(phaseA * 2.0 + sh * 0.6) * (0.12 + uSh * 0.14)

                var wx = wingCentreX * (0.35 + 0.65 * uSh) + lx * cosWT - lz * sinWT
                var wy = wingCentreY + ly
                var wz = wingCentreZ + lx * sinWT + lz * cosWT
                ringPts.push(project3DPoint(wx, wy, wz, rx, ry, rz, cx, cy, scale, fov))
            }
            wingRings.push(ringPts)
        }

        // Build segmented 3D quad cells between concentric Lorenz orbital trajectories on this wing
        var wingQuads = []
        for (var rIdx = 0; rIdx < shells - 1; rIdx++) {
            var rInner = wingRings[rIdx]
            var rOuter = wingRings[rIdx + 1]
            for (var sq = 0; sq < segs; sq += segStep) {
                var sn = Math.min(segs, sq + segStep)
                wingQuads.push([rInner[sq], rInner[sn], rOuter[sn], rOuter[sq]])
            }
        }
        fillGeometrySegments(ctx, wingQuads, cfg, wingIdx * 3 + palShift, palette, (0.54 + state.bassSmooth * 0.22) * (isEcho ? 0.6 : 1.0))

        // Stroke smooth concentric 3D Lorenz orbital trajectories (without dense cross-ribs)
        for (var rDraw = 0; rDraw < shells; rDraw++) {
            var pts = wingRings[rDraw]
            var bDraw = state.smoothBands[((rDraw * 9 + wingIdx * 11) & 63)] || 0.15
            var colOrbit = palette[(rDraw * 2 + wingIdx * 3 + palShift) % palette.length]
            ctx.strokeStyle = colourWithAlpha(colOrbit, (0.64 + (rDraw / shells) * 0.28 + bDraw * 0.15) * (isEcho ? 0.65 : 1.0))
            ctx.lineWidth = (1.35 + (rDraw / shells) * 1.05 + bDraw * 0.85) * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var pIdx = 0; pIdx <= segs; pIdx++) {
                if (pIdx === 0) ctx.moveTo(pts[pIdx].x, pts[pIdx].y)
                else ctx.lineTo(pts[pIdx].x, pts[pIdx].y)
            }
            ctx.closePath()
            ctx.stroke()
        }
    }

    // 2. Central Figure-8 Homoclinic Saddle Crossover Ribbon weaving smoothly between Left & Right Attractor Wings
    var bridgeSteps = isEcho ? 18 : 28
    var bridgeRibbonA = []
    var bridgeRibbonB = []
    for (var bi = 0; bi <= bridgeSteps; bi++) {
        var bu = (bi / bridgeSteps) * Math.PI * 2.0
        var bx = Math.sin(bu + state.t * 0.48) * (0.94 + state.bassSmooth * 0.12)
        var by = Math.sin(bu * 2.0 + state.t * 0.96) * (0.44 + state.midSmooth * 0.10)
        var bz = Math.cos(bu + state.t * 0.48) * 0.40
        var spreadZ = 0.08 + state.bassSmooth * 0.04
        bridgeRibbonA.push(project3DPoint(bx, by + spreadZ * 0.5, bz - spreadZ, rx, ry, rz, cx, cy, scale, fov))
        bridgeRibbonB.push(project3DPoint(bx, by - spreadZ * 0.5, bz + spreadZ, rx, ry, rz, cx, cy, scale, fov))
    }

    var bridgeQuads = []
    for (var bq = 0; bq < bridgeSteps; bq += 4) {
        var bn = Math.min(bridgeSteps, bq + 4)
        bridgeQuads.push([bridgeRibbonA[bq], bridgeRibbonA[bn], bridgeRibbonB[bn], bridgeRibbonB[bq]])
    }
    fillGeometrySegments(ctx, bridgeQuads, cfg, palShift + 4, palette, (0.58 + state.bassSmooth * 0.22) * (isEcho ? 0.6 : 1.0))

    var colBridge = palette[(4 + palShift) % palette.length]
    ctx.strokeStyle = colourWithAlpha(colBridge, (0.82 + state.beatPulse * 0.14) * (isEcho ? 0.7 : 1.0))
    ctx.lineWidth = (1.6 + state.bassSmooth * 1.1) * (isEcho ? 0.75 : 1.0)
    ctx.beginPath()
    for (var b0 = 0; b0 <= bridgeSteps; b0++) {
        if (b0 === 0) ctx.moveTo(bridgeRibbonA[b0].x, bridgeRibbonA[b0].y)
        else ctx.lineTo(bridgeRibbonA[b0].x, bridgeRibbonA[b0].y)
    }
    for (var b1 = 0; b1 <= bridgeSteps; b1++) {
        if (b1 === 0) ctx.moveTo(bridgeRibbonB[b1].x, bridgeRibbonB[b1].y)
        else ctx.lineTo(bridgeRibbonB[b1].x, bridgeRibbonB[b1].y)
    }
    ctx.stroke()

    ctx.restore()
}

// Mode 13: 4D Hopf Fibration Torus — Stereographic Projection of Interlocked S³ Villarceau Circles on Nested Clifford Tori
function drawMode13HopfFibrationTorus(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var comp = clamp(cfg.layer2Complexity || 1.0, 0.4, 2.0)
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.28 + state.bassSmooth * 0.04)

    var rx = state.t * 0.34 + state.bassSmooth * 0.20
    var ry = state.phase * 0.45
    var rz = Math.sin(state.t * 0.25) * 0.30
    var fov = 3.8

    var shells = isEcho ? 1 : 2
    var fibresPerShell = isEcho ? 4 : Math.max(4, Math.min(8, Math.round(6 * comp)))
    var segs = isEcho ? 16 : 24

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    for (var sh = 0; sh < shells; sh++) {
        var eta = 0.46 + sh * 0.42 + Math.sin(state.t * 0.6 + sh) * 0.07
        var cosEta = Math.cos(eta)
        var sinEta = Math.sin(eta)
        var colShell = palette[(sh * 3 + palShift) % palette.length]
        var colSub = palette[(sh * 3 + 1 + palShift) % palette.length]
        var prevFibrePts13 = null
        var shellQuads13 = []

        for (var fb = 0; fb < fibresPerShell; fb++) {
            var phi = (fb / fibresPerShell) * Math.PI * 2.0 + state.phase * (sh % 2 === 0 ? 0.32 : -0.32)
            var bVal = state.smoothBands[(fb * 5 + sh * 13) & 63] || 0.12
            var curFibrePts13 = []
            for (var s = 0; s <= segs; s++) {
                var psi = (s / segs) * Math.PI * 2.0
                var a1 = (phi + psi) * 0.5
                var a2 = (psi - phi) * 0.5
                var x4 = cosEta * Math.cos(a1)
                var y4 = cosEta * Math.sin(a1)
                var z4 = sinEta * Math.cos(a2)
                var w4 = sinEta * Math.sin(a2)
                var denom = 1.65 - w4 * (0.70 + bVal * 0.14)
                var x3 = (x4 / denom) * 1.15
                var y3 = (y4 / denom) * 1.15
                var z3 = (z4 / denom) * 1.15
                curFibrePts13.push(project3DPoint(x3, y3, z3, rx, ry, rz, cx, cy, scale, fov))
            }
            if (prevFibrePts13) {
                for (var qs13 = 0; qs13 < segs; qs13 += 4) {
                    var qn13 = Math.min(segs, qs13 + 4)
                    shellQuads13.push([prevFibrePts13[qs13], prevFibrePts13[qn13], curFibrePts13[qn13], curFibrePts13[qs13]])
                }
            }
            prevFibrePts13 = curFibrePts13
        }
        fillGeometrySegments(ctx, shellQuads13, cfg, sh + palShift, palette, 0.50 + state.bassSmooth * 0.22)

        for (var fb2 = 0; fb2 < fibresPerShell; fb2++) {
            var phi2 = (fb2 / fibresPerShell) * Math.PI * 2.0 + state.phase * (sh % 2 === 0 ? 0.32 : -0.32)
            var bVal2 = state.smoothBands[(fb2 * 5 + sh * 13) & 63] || 0.12
            ctx.strokeStyle = colourWithAlpha(fb2 % 2 === 0 ? colShell : colSub, (0.64 + bVal2 * 0.32) * (isEcho ? 0.65 : 1.0))
            ctx.lineWidth = (1.4 + bVal2 * 1.5) * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            for (var s2 = 0; s2 <= segs; s2++) {
                var psi2 = (s2 / segs) * Math.PI * 2.0
                var a1b = (phi2 + psi2) * 0.5
                var a2b = (psi2 - phi2) * 0.5
                var x4b = cosEta * Math.cos(a1b)
                var y4b = cosEta * Math.sin(a1b)
                var z4b = sinEta * Math.cos(a2b)
                var w4b = sinEta * Math.sin(a2b)
                var denomB = 1.65 - w4b * (0.70 + bVal2 * 0.14)
                var pt2 = project3DPoint((x4b / denomB) * 1.15, (y4b / denomB) * 1.15, (z4b / denomB) * 1.15, rx, ry, rz, cx, cy, scale, fov)
                if (s2 === 0) ctx.moveTo(pt2.x, pt2.y)
                else ctx.lineTo(pt2.x, pt2.y)
            }
            ctx.closePath()
            ctx.stroke()
        }
    }
    ctx.restore()
}

// Mode 14: 3D Calabi-Yau Manifold — 6D String-Theory Quintic Manifold Cross-Section Projected in 3D
function drawMode14CalabiYauManifold(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.31 + state.bassSmooth * 0.04)

    var nOrder = clamp(Math.round((Number(cfg.layer2Facets) || 6) * 0.5), 3, 4)
    var rx = 0.48 + Math.sin(state.t * 0.34) * 0.30
    var ry = state.phase * 0.40
    var rz = Math.cos(state.t * 0.28) * 0.24
    var alphaProj = state.t * 0.30
    var fov = 3.8
    var uSteps = isEcho ? 8 : 12

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    for (var k1 = 0; k1 < nOrder; k1++) {
        var phase1 = (k1 * 2.0 * Math.PI) / nOrder
        var colEdge = palette[(k1 * 2 + 1 + palShift) % palette.length]
        var phase2 = (k1 * 2.0 * Math.PI) / nOrder
        var bVal = state.smoothBands[(k1 * 11) & 63] || 0.14
        ctx.strokeStyle = colourWithAlpha(colEdge, (0.74 + bVal * 0.24) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.5 + bVal * 1.4) * (isEcho ? 0.75 : 1.0)

        var ringA = []
        var ringB = []
        for (var s = 0; s <= uSteps; s++) {
            var u = (s / uSteps) * Math.PI * 2.0
            for (var vIdx = 0; vIdx < 2; vIdx++) {
                var rMod = 0.46 + vIdx * (0.48 + bVal * 0.20)
                var angA = (u + phase1) / nOrder
                var angB = (u * 1.5 - phase2 + state.phase * 0.5) / nOrder
                var x3 = rMod * Math.cos(angA * nOrder) * (1.0 + 0.30 * Math.cos(angB * nOrder))
                var y3 = rMod * Math.sin(angA * nOrder) * (1.0 + 0.30 * Math.cos(angB * nOrder))
                var z3 = rMod * Math.sin(angB * nOrder) * Math.cos(alphaProj) + 0.26 * Math.sin(u * 2.0 + k1) * Math.sin(alphaProj)
                var p3 = project3DPoint(x3, y3, z3, rx, ry, rz, cx, cy, scale, fov)
                if (vIdx === 0) ringA.push(p3)
                else ringB.push(p3)
            }
        }

        var cyQuads14 = []
        for (var sq14 = 0; sq14 < uSteps; sq14 += 2) {
            var sn14 = Math.min(uSteps, sq14 + 2)
            cyQuads14.push([ringA[sq14], ringA[sn14], ringB[sn14], ringB[sq14]])
        }
        fillGeometrySegments(ctx, cyQuads14, cfg, k1 * 2 + palShift, palette, 0.56 + bVal * 0.28)

        ctx.beginPath()
        for (var i = 0; i <= uSteps; i++) {
            if (i === 0) ctx.moveTo(ringA[i].x, ringA[i].y)
            else ctx.lineTo(ringA[i].x, ringA[i].y)
        }
        for (var j = uSteps; j >= 0; j--) {
            ctx.lineTo(ringB[j].x, ringB[j].y)
        }
        ctx.closePath()
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 15: 3D Gyroscopic Merkaba — Counter-Rotating Star Tetrahedron & 3-Axis Orthogonal Gimbal Rings
function drawMode15GyroscopicMerkaba(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.30 + state.bassSmooth * 0.05)

    var rx = 0.35 + Math.sin(state.t * 0.44) * 0.28
    var ry = state.phase * 0.55
    var rz = Math.cos(state.t * 0.32) * 0.24
    var fov = 3.8

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 1. Three Orthogonal 3D Gyroscopic Gimbal Rings (X, Y, Z axes)
    var ringSegs = isEcho ? 20 : 32
    for (var g = 0; g < 3; g++) {
        var gRad = 1.04 + g * 0.10 + state.bassSmooth * 0.08
        var gRx = rx + state.t * (0.52 + g * 0.18) * (g % 2 === 0 ? 1 : -1)
        var gRy = ry + state.t * (0.41 - g * 0.14)
        var gRz = rz + g * 1.047
        var colGimbal = palette[(g * 3 + palShift) % palette.length]
        ctx.strokeStyle = colourWithAlpha(colGimbal, (0.68 + state.highSmooth * 0.28) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.5 + state.bassSmooth * 1.2) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var s = 0; s <= ringSegs; s++) {
            var a = (s / ringSegs) * Math.PI * 2.0
            var gx = g === 0 ? 0.0 : Math.cos(a) * gRad
            var gy = g === 1 ? 0.0 : (g === 0 ? Math.cos(a) * gRad : Math.sin(a) * gRad)
            var gz = g === 2 ? 0.0 : Math.sin(a) * gRad
            var gp = project3DPoint(gx, gy, gz, gRx, gRy, gRz, cx, cy, scale, fov)
            if (s === 0) ctx.moveTo(gp.x, gp.y)
            else ctx.lineTo(gp.x, gp.y)
        }
        ctx.closePath()
        ctx.stroke()
    }

    // 2. Counter-Rotating Dual Interpenetrating 3D Tetrahedra (Star Tetrahedron / Merkaba)
    var tetScale = 0.88 + state.beatPulse * 0.10
    var merkFaces15 = []
    var merkPolyPts15 = []
    for (var polarity = -1; polarity <= 1; polarity += 2) {
        var polIdx = polarity < 0 ? 0 : 1
        var pRy = ry * polarity * 1.25
        var v0 = [0.0, -1.0 * polarity * tetScale, 0.0]
        var v1 = [-0.943 * tetScale, 0.333 * polarity * tetScale, -0.544 * tetScale]
        var v2 = [ 0.943 * tetScale, 0.333 * polarity * tetScale, -0.544 * tetScale]
        var v3 = [ 0.0,              0.333 * polarity * tetScale,  1.088 * tetScale]
        var pts = [
            project3DPoint(v0[0], v0[1], v0[2], rx, pRy, rz, cx, cy, scale, fov),
            project3DPoint(v1[0], v1[1], v1[2], rx, pRy, rz, cx, cy, scale, fov),
            project3DPoint(v2[0], v2[1], v2[2], rx, pRy, rz, cx, cy, scale, fov),
            project3DPoint(v3[0], v3[1], v3[2], rx, pRy, rz, cx, cy, scale, fov)
        ]
        merkPolyPts15.push({ pts: pts, polIdx: polIdx })
        var faces = [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]]
        for (var f = 0; f < faces.length; f++) {
            var fc = faces[f]
            merkFaces15.push([pts[fc[0]], pts[fc[1]], pts[fc[2]]])
        }
    }
    fillGeometrySegments(ctx, merkFaces15, cfg, palShift, palette, 0.72 + state.bassSmooth * 0.24)
    for (var mp15 = 0; mp15 < merkPolyPts15.length; mp15++) {
        var mObj = merkPolyPts15[mp15]
        var ptsM = mObj.pts
        var colStroke = palette[(mObj.polIdx * 4 + 2 + palShift) % palette.length]
        ctx.strokeStyle = colourWithAlpha(colStroke, 0.92 * (isEcho ? 0.7 : 1.0))
        ctx.lineWidth = (1.8 + state.beatPulse * 1.4) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        var facesM = [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]]
        for (var fm = 0; fm < facesM.length; fm++) {
            var fcm = facesM[fm]
            ctx.moveTo(ptsM[fcm[0]].x, ptsM[fcm[0]].y)
            ctx.lineTo(ptsM[fcm[1]].x, ptsM[fcm[1]].y)
            ctx.lineTo(ptsM[fcm[2]].x, ptsM[fcm[2]].y)
            ctx.closePath()
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 16: 3D Hyperbolic Poincare Web — Non-Euclidean Geodesic Orthocircle Lattice & Möbius Flow
function drawMode16HyperbolicPoincareWeb(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.32 + state.bassSmooth * 0.04)

    var symP = clamp(Math.round(Number(cfg.layer2Facets) || 7), 5, 12)
    var rx = 0.42 + Math.sin(state.t * 0.37) * 0.25
    var ry = state.phase * 0.38
    var rz = Math.cos(state.t * 0.28) * 0.22
    var fov = 3.8

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // Boundary Poincaré Horizon Ring + Hyperbolic Geodesic Arcs on a 3D Hemisphere/Bowl
    var tiers = isEcho ? 3 : 4
    var arcSegs = isEcho ? 14 : 22
    var pOrigin16 = project3DPoint(0.0, 0.0, 0.30, rx, ry, rz, cx, cy, scale, fov)
    for (var tr = 1; tr <= tiers; tr++) {
        var rHyp = Math.tanh(tr * 0.48 + ((state.t * 0.35) % 0.48))
        var zBowl = Math.sqrt(Math.max(0.0, 1.0 - rHyp * rHyp)) * 0.55 - 0.25
        var colTier = palette[(tr * 2 + palShift) % palette.length]
        var tierCells16 = []
        var tierArcs16 = []

        for (var k = 0; k < symP; k++) {
            var a0 = (k / symP) * Math.PI * 2.0 + tr * 0.25
            var a1 = ((k + 1) / symP) * Math.PI * 2.0 + tr * 0.25
            var bVal = state.smoothBands[(k * 5 + tr * 9) & 63] || 0.12
            var rInnerBow = rHyp * (0.58 - bVal * 0.18)
            var arcPts16 = []

            for (var s = 0; s <= arcSegs; s++) {
                var u = s / arcSegs
                var aCur = lerp(a0, a1, u)
                var archIn = Math.sin(u * Math.PI)
                var rCur = lerp(rHyp, rInnerBow, archIn)
                var zCur = zBowl - archIn * (0.18 + bVal * 0.16)
                arcPts16.push(project3DPoint(Math.cos(aCur) * rCur, Math.sin(aCur) * rCur, zCur, rx, ry, rz, cx, cy, scale, fov))
            }
            tierArcs16.push(arcPts16)
            var cellPoly16 = [pOrigin16]
            for (var cp16 = 0; cp16 < arcPts16.length; cp16 += 2) {
                cellPoly16.push(arcPts16[cp16])
            }
            tierCells16.push(cellPoly16)
        }
        fillGeometrySegments(ctx, tierCells16, cfg, tr + palShift, palette, (0.45 + (1.0 - rHyp) * 0.35))

        ctx.strokeStyle = colourWithAlpha(colTier, (0.65 + (1.0 - rHyp) * 0.32) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.3 + (1.0 - rHyp) * 1.8 + state.bassSmooth * 0.9) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var ka = 0; ka < tierArcs16.length; ka++) {
            var aList = tierArcs16[ka]
            for (var sa = 0; sa < aList.length; sa++) {
                if (sa === 0) ctx.moveTo(aList[sa].x, aList[sa].y)
                else ctx.lineTo(aList[sa].x, aList[sa].y)
            }
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 17: 3D Quantum Bloch Sphere — Precessing Spinor State Vector, Rabi Trajectories & Entanglement Shell
function drawMode17QuantumBlochSphere(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.29 + state.bassSmooth * 0.04)

    var rx = 0.44 + Math.sin(state.t * 0.42) * 0.28
    var ry = state.phase * 0.52
    var rz = Math.cos(state.t * 0.31) * 0.22
    var fov = 3.8
    var segs = isEcho ? 24 : 36

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 1. Orthogonal Hilbert-Space Great Circles + Latitude Rabi Precession Rings & Filled Spherical Quads
    var latRings17 = []
    for (var lat = -2; lat <= 2; lat++) {
        var zLat = lat * 0.38
        var rLat = Math.sqrt(Math.max(0.05, 1.0 - zLat * zLat))
        var bVal = state.smoothBands[((lat + 2) * 11) & 63] || 0.15
        var ringPts17 = []
        for (var s = 0; s <= segs; s++) {
            var a = (s / segs) * Math.PI * 2.0
            var rMod = rLat * (1.0 + Math.sin(a * 4.0 + state.t * 3.0 + lat) * bVal * 0.08)
            ringPts17.push(project3DPoint(Math.cos(a) * rMod, zLat, Math.sin(a) * rMod, rx, ry, rz, cx, cy, scale, fov))
        }
        latRings17.push({ lat: lat, bVal: bVal, pts: ringPts17 })
    }

    var blochQuads17 = []
    for (var lr = 0; lr < latRings17.length - 1; lr++) {
        var rA17 = latRings17[lr].pts
        var rB17 = latRings17[lr + 1].pts
        for (var sq17 = 0; sq17 < segs; sq17 += 3) {
            var sn17 = Math.min(segs, sq17 + 3)
            blochQuads17.push([rA17[sq17], rA17[sn17], rB17[sn17], rB17[sq17]])
        }
    }
    fillGeometrySegments(ctx, blochQuads17, cfg, palShift, palette, 0.58 + state.bassSmooth * 0.26)

    for (var lr2 = 0; lr2 < latRings17.length; lr2++) {
        var rObj17 = latRings17[lr2]
        var colRing = palette[((rObj17.lat + 2) * 2 + palShift) % palette.length]
        ctx.strokeStyle = colourWithAlpha(colRing, (rObj17.lat === 0 ? 0.88 : 0.54 + rObj17.bVal * 0.32) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (rObj17.lat === 0 ? 2.2 : 1.3 + rObj17.bVal * 1.1) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var sp17 = 0; sp17 <= segs; sp17++) {
            var pt = rObj17.pts[sp17]
            if (sp17 === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
        }
        ctx.closePath()
        ctx.stroke()
    }

        // 2. Orbiting Quantum Spinor Tip Node (moving white radial line removed for clean geometry)
        var thetaPsi = (0.5 + 0.42 * Math.sin(state.t * 1.15 + state.bassSmooth)) * Math.PI
        var phiPsi = state.t * 2.4 + state.phase
        var tipX = Math.sin(thetaPsi) * Math.cos(phiPsi)
        var tipY = -Math.cos(thetaPsi)
        var tipZ = Math.sin(thetaPsi) * Math.sin(phiPsi)
        var pTip = project3DPoint(tipX, tipY, tipZ, rx, ry, rz, cx, cy, scale, fov)

        // Glowing Bloch vector tip orb
        ctx.fillStyle = colourWithAlpha(palette[(3 + palShift) % palette.length], 0.92)
        ctx.beginPath()
        ctx.arc(pTip.x, pTip.y, 4.5 + state.bassSmooth * 4.0, 0, Math.PI * 2.0)
        ctx.fill()

    ctx.restore()
}

// Mode 18: 4D Klein Bottle Immersion — Non-Orientable Figure-8 Klein Surface & Möbius Meridian Ribs
function drawMode18KleinBottleImmersion(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.115 + state.bassSmooth * 0.018)

    var rx = 0.45 + Math.sin(state.t * 0.39) * 0.32
    var ry = state.phase * 0.48
    var rz = Math.cos(state.t * 0.27) * 0.25
    var fov = 4.2

    var uRings = isEcho ? 10 : 16
    var vSegs = isEcho ? 18 : 28
    var aParam = 2.15 + state.bassSmooth * 0.25

    function evalKleinPoint(u, v) {
        var cosU2 = Math.cos(u * 0.5)
        var sinU2 = Math.sin(u * 0.5)
        var sinV = Math.sin(v)
        var sin2V = Math.sin(2.0 * v)
        var r = aParam + cosU2 * sinV - sinU2 * sin2V * 0.5
        return project3DPoint(
            r * Math.cos(u),
            r * Math.sin(u),
            sinU2 * sinV + cosU2 * sin2V * 0.5,
            rx, ry, rz, cx, cy, scale, fov
        )
    }

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    var kleinRings18 = []
    for (var ui = 0; ui < uRings; ui++) {
        var u = (ui / uRings) * Math.PI * 2.0
        var ring18 = []
        for (var vi = 0; vi <= vSegs; vi++) {
            var v = (vi / vSegs) * Math.PI * 2.0 + state.t * 0.65
            ring18.push(evalKleinPoint(u, v))
        }
        kleinRings18.push(ring18)
    }

    var kleinQuads18 = []
    for (var uk = 0; uk < uRings; uk++) {
        var rCur18 = kleinRings18[uk]
        var rNext18 = kleinRings18[(uk + 1) % uRings]
        for (var vk = 0; vk < vSegs; vk += 2) {
            var vn18 = Math.min(vSegs, vk + 2)
            kleinQuads18.push([rCur18[vk], rCur18[vn18], rNext18[vn18], rNext18[vk]])
        }
    }
    fillGeometrySegments(ctx, kleinQuads18, cfg, palShift, palette, 0.56 + state.bassSmooth * 0.26)

    for (var ui2 = 0; ui2 < uRings; ui2++) {
        var bVal = state.smoothBands[(ui2 * 4) & 63] || 0.14
        var colRib = palette[(ui2 + palShift) % palette.length]
        var pts18 = kleinRings18[ui2]
        ctx.strokeStyle = colourWithAlpha(colRib, (0.64 + bVal * 0.34) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.35 + bVal * 1.6) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var vi2 = 0; vi2 <= vSegs; vi2++) {
            var pt = pts18[vi2]
            if (vi2 === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
        }
        ctx.closePath()
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 19: 3D Penrose Quasicrystal — 5-Fold Golden-Ratio Aperiodic Rhombic Lattice & Icosahedral Star Shell
function drawMode19PenroseQuasicrystal(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.31 + state.bassSmooth * 0.04)

    var rx = 0.38 + Math.sin(state.t * 0.36) * 0.26
    var ry = state.phase * 0.44
    var rz = Math.cos(state.t * 0.29) * 0.22
    var fov = 3.8
    var phiGolden = 1.61803398875
    var invPhi = 0.61803398875

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    // 10-Fold Aperiodic Golden-Ratio Rhombic Shells in 3D
    var shells = isEcho ? 2 : 3
    var fold10 = 10
    for (var sh = 0; sh < shells; sh++) {
        var rBase = 0.36 + sh * 0.30
        var zBase = (sh - 1.0) * (0.22 + state.bassSmooth * 0.08)
        var colEdge = palette[(sh * 3 + 1 + palShift) % palette.length]
        var bVal = state.smoothBands[(sh * 13) & 63] || 0.16
        var rhombPolys19 = []

        for (var k = 0; k < fold10; k++) {
            var aMid = (k / fold10) * Math.PI * 2.0 + sh * (Math.PI / fold10)
            var dAng = (Math.PI / fold10) * (k % 2 === 0 ? invPhi : 1.0)
            var rIn = rBase * invPhi
            var rMid = rBase
            var rOut = rBase * (1.0 + invPhi * 0.55 + bVal * 0.18)
            var zCrown = zBase + (k % 2 === 0 ? 1.0 : -1.0) * 0.14

            var pIn = project3DPoint(Math.cos(aMid) * rIn, Math.sin(aMid) * rIn, zBase, rx, ry, rz, cx, cy, scale, fov)
            var pL = project3DPoint(Math.cos(aMid - dAng) * rMid, Math.sin(aMid - dAng) * rMid, zCrown, rx, ry, rz, cx, cy, scale, fov)
            var pOut = project3DPoint(Math.cos(aMid) * rOut, Math.sin(aMid) * rOut, -zBase, rx, ry, rz, cx, cy, scale, fov)
            var pR = project3DPoint(Math.cos(aMid + dAng) * rMid, Math.sin(aMid + dAng) * rMid, zCrown, rx, ry, rz, cx, cy, scale, fov)
            rhombPolys19.push([pIn, pL, pOut, pR])
        }
        fillGeometrySegments(ctx, rhombPolys19, cfg, sh + palShift, palette, 0.68 + bVal * 0.28)

        ctx.strokeStyle = colourWithAlpha(colEdge, (0.78 + bVal * 0.22) * (isEcho ? 0.65 : 1.0))
        ctx.lineWidth = (1.4 + bVal * 1.5) * (isEcho ? 0.75 : 1.0)
        ctx.beginPath()
        for (var kr = 0; kr < rhombPolys19.length; kr++) {
            var rp = rhombPolys19[kr]
            ctx.moveTo(rp[0].x, rp[0].y)
            ctx.lineTo(rp[1].x, rp[1].y)
            ctx.lineTo(rp[2].x, rp[2].y)
            ctx.lineTo(rp[3].x, rp[3].y)
            ctx.closePath()
        }
        ctx.stroke()
    }
    ctx.restore()
}

// Mode 20: 3D Tetris Soma Cube — Clean Solid 3D Polyomino Tetris Blocks
// Flying in from 6 orthogonal 3D directions (±X, ±Y, ±Z) to lock into a uniform 3D Soma Cube, or splitting apart!
function drawMode20TetrisCube(ctx, w, h, state, palette, cfg) {
    var cx = w * 0.5
    var cy = h * 0.5
    var zoom = cfg.layer2Zoom || 1.0
    var minDim = Math.min(w, h) * zoom
    var isEcho = Boolean(state.isTracerEcho)
    var palShift = Math.floor((state.hueShift || 0) / 45)
    var scale = minDim * (0.29 + state.bassSmooth * 0.04 + state.beatPulse * 0.015)
    var l2Spd = clamp(Number(cfg.layer2Speed !== undefined ? cfg.layer2Speed : 1.0), 0.2, 2.5)
    var flowDir = Number(cfg.tracerDirection !== undefined ? cfg.tracerDirection : 0)

    // 7 Connected 3D Soma / Tetris Polyomino Pieces that partition the 3x3x3 Cube (coords in {-1, 0, +1}^3),
    // ordered First-In / Last-Out from core to outer shell along collision-free orthogonal disassembly axes:
    //   Piece 0 (Core): Chiral J-Tetromino (4 blocks) — central/left core, slides along -X (Left)
    //   Piece 1: L-Tetromino (4 blocks at z = -1) — slides along -Z (Back/Deep)
    //   Piece 2: T-Corner Tetromino (4 blocks at y = -1) — slides along -Y (Top)
    //   Piece 3: Z-Tetromino (4 blocks at y = +1) — slides along +Y (Bottom)
    //   Piece 4: T-Tetromino (4 blocks at x = +1) — slides along +X (Right)
    //   Piece 5: O-Tetromino 2x2 (4 blocks at z = +1) — slides along +Z (Front/Near)
    //   Piece 6: I-Tromino Keystone (3 blocks at x = +1, z = +1) — drops in along (+X, +Z)
    var somaPieces = [
        { dir: [-1.0,  0.0,   0.0],  distMul: 1.35, spinAxis: [0.5, 0.3, 0.8], blocks: [[ 0, 0,-1], [ 0, 0, 0], [-1, 0, 0], [-1, 1, 0]] },
        { dir: [ 0.0,  0.0,  -1.0],  distMul: 1.85, spinAxis: [0.0, 1.0, 0.4], blocks: [[-1,-1,-1], [-1, 0,-1], [-1, 1,-1], [ 0, 1,-1]] },
        { dir: [ 0.0, -1.0,   0.0],  distMul: 1.70, spinAxis: [0.8, 0.2, 0.5], blocks: [[-1,-1, 0], [ 0,-1, 0], [ 0,-1,-1], [ 1,-1, 0]] },
        { dir: [ 0.0,  1.0,   0.0],  distMul: 1.75, spinAxis: [1.0, 0.0, 0.3], blocks: [[-1, 1, 1], [ 0, 1, 1], [ 0, 1, 0], [ 1, 1, 0]] },
        { dir: [ 1.0,  0.0,   0.0],  distMul: 1.65, spinAxis: [0.3, 1.0, 0.0], blocks: [[ 1,-1,-1], [ 1, 0,-1], [ 1, 1,-1], [ 1, 0, 0]] },
        { dir: [ 0.0,  0.0,   1.0],  distMul: 1.80, spinAxis: [0.2, 0.9, 0.3], blocks: [[-1, 0, 1], [-1,-1, 1], [ 0,-1, 1], [ 0, 0, 1]] },
        { dir: [ 0.72, 0.22,  0.72], distMul: 1.90, spinAxis: [0.6, 0.6, 0.4], blocks: [[ 1,-1, 1], [ 1, 0, 1], [ 1, 1, 1]] }
    ]

    // Cyclic assembly / disassembly phase
    var cycT = (state.t || 0.0) * 0.26 * l2Spd
    var cycIdx = Math.floor(cycT)
    var u = cycT - cycIdx // 0..1 within cycle

    // Compute per-piece explosion parameter `split` in [0, 1] (0 = locked uniform 3D Cube, 1 = flown apart in 3D space)
    // Uses First-In / Last-Out stagger so outer shell pieces clear the 3x3x3 cube before the core piece moves.
    var evalPieceSplit = function (pIdx) {
        var baseDist = 0.0
        if (flowDir > 0) {
            baseDist = 1.0 - u * 1.35
        } else if (flowDir < 0) {
            baseDist = (u - 0.12) * 1.35
        } else {
            if (u < 0.40) {
                baseDist = 1.0 - (u / 0.40)
            } else if (u < 0.60) {
                baseDist = 0.0
            } else {
                baseDist = (u - 0.60) / 0.40
            }
        }
        var lead = (pIdx === 0) ? 0.44 : ((6 - pIdx) * 0.04)
        var rawSplit = clamp((baseDist - lead) / (1.0 - lead), 0.0, 1.0)
        return rawSplit * rawSplit * (3.0 - 2.0 * rawSplit)
    }

    // Whole-assembly 3D rotation
    var rx = 0.48 + Math.sin(state.t * 0.34) * 0.24
    var ry = state.phase * 0.46 + Math.cos(state.t * 0.27) * 0.28
    var rz = Math.sin(state.t * 0.21) * 0.18
    var fov = 3.85

    // Helper to rotate a local offset vector (lx, ly, lz) around (ax, ay, az) by angle `ang`
    var rotateVec3 = function (lx, ly, lz, ax, ay, az, ang) {
        if (Math.abs(ang) < 0.0005) return [lx, ly, lz]
        var len = Math.hypot(ax, ay, az) || 1.0
        var ux = ax / len, uy = ay / len, uz = az / len
        var c = Math.cos(ang), s = Math.sin(ang), omc = 1.0 - c
        var dot = ux * lx + uy * ly + uz * lz
        var cx0 = uy * lz - uz * ly
        var cy0 = uz * lx - ux * lz
        var cz0 = ux * ly - uy * lx
        return [
            lx * c + cx0 * s + ux * dot * omc,
            ly * c + cy0 * s + uy * dot * omc,
            lz * c + cz0 * s + uz * dot * omc
        ]
    }

    var hasPieceBlock = function (pBlocks, gx, gy, gz) {
        for (var k = 0; k < pBlocks.length; k++) {
            var b = pBlocks[k]
            if (b[0] === gx && b[1] === gy && b[2] === gz) return true
        }
        return false
    }

    // 6 faces of each unit cell in CCW screen-space order with outward normals and 4 in-plane edge neighbour steps
    var faceSpecs = [
        { ids: [4, 5, 6, 7], n: [ 0,  0,  1], shade: 1.00, isKeyFace: true,  edgeDirs: [[ 0,-1, 0], [ 1, 0, 0], [ 0, 1, 0], [-1, 0, 0]] }, // +Z
        { ids: [1, 0, 3, 2], n: [ 0,  0, -1], shade: 0.72, isKeyFace: false, edgeDirs: [[ 0,-1, 0], [-1, 0, 0], [ 0, 1, 0], [ 1, 0, 0]] }, // -Z
        { ids: [3, 7, 6, 2], n: [ 0,  1,  0], shade: 0.92, isKeyFace: true,  edgeDirs: [[-1, 0, 0], [ 0, 0, 1], [ 1, 0, 0], [ 0, 0,-1]] }, // +Y
        { ids: [0, 1, 5, 4], n: [ 0, -1,  0], shade: 0.64, isKeyFace: false, edgeDirs: [[ 0, 0,-1], [ 1, 0, 0], [ 0, 0, 1], [-1, 0, 0]] }, // -Y
        { ids: [5, 1, 2, 6], n: [ 1,  0,  0], shade: 0.84, isKeyFace: false, edgeDirs: [[ 0,-1, 0], [ 0, 0,-1], [ 0, 1, 0], [ 0, 0, 1]] }, // +X
        { ids: [0, 4, 7, 3], n: [-1,  0,  0], shade: 0.78, isKeyFace: false, edgeDirs: [[ 0,-1, 0], [ 0, 0, 1], [ 0, 1, 0], [ 0, 0,-1]] }  // -X
    ]

    var voxelPitch = 0.38
    var halfVox = voxelPitch * 0.50 // Flush contiguous blocks within each polyomino piece (zero internal seams)
    var polyFaces = []
    var coplanarGroups = {}
    var signs = [
        [-1,-1,-1], [ 1,-1,-1], [ 1, 1,-1], [-1, 1,-1],
        [-1,-1, 1], [ 1,-1, 1], [ 1, 1, 1], [-1, 1, 1]
    ]

    for (var pi = 0; pi < somaPieces.length; pi++) {
        var piece = somaPieces[pi]
        var split = evalPieceSplit(pi)
        var bVal = state.smoothBands[(pi * 9) & 63] || 0.18
        var flightDist = split * (piece.distMul + state.bassSmooth * 0.22)
        // Delay tumble spin until the piece has slid clear of its 3x3x3 cube socket so adjacent blocks never interpenetrate
        var spinPhase = clamp((split - 0.28) / 0.72, 0.0, 1.0)
        var spinAngle = spinPhase * spinPhase * (Math.PI * 1.15 + pi * 0.45)

        // Compute piece centroid in target shape coordinates
        var cxPiece = 0.0, cyPiece = 0.0, czPiece = 0.0
        var pBlocks = piece.blocks
        for (var bi0 = 0; bi0 < pBlocks.length; bi0++) {
            cxPiece += pBlocks[bi0][0]
            cyPiece += pBlocks[bi0][1]
            czPiece += pBlocks[bi0][2]
        }
        cxPiece /= pBlocks.length
        cyPiece /= pBlocks.length
        czPiece /= pBlocks.length

        var colMain = palette[(pi + palShift) % palette.length]
        var colAccent = palette[(pi + 2 + palShift) % palette.length]

        for (var bi = 0; bi < pBlocks.length; bi++) {
            var blk = pBlocks[bi]
            var bx = blk[0], by = blk[1], bz = blk[2]

            // Local offset of block from piece centroid (rotated by piece tumble spin during flight)
            var relX = (bx - cxPiece) * voxelPitch
            var relY = (by - cyPiece) * voxelPitch
            var relZ = (bz - czPiece) * voxelPitch
            var rotRel = rotateVec3(relX, relY, relZ, piece.spinAxis[0], piece.spinAxis[1], piece.spinAxis[2], spinAngle)

            // World-space centre of this block
            var wcx = cxPiece * voxelPitch + piece.dir[0] * flightDist + rotRel[0]
            var wcy = cyPiece * voxelPitch + piece.dir[1] * flightDist + rotRel[1]
            var wcz = czPiece * voxelPitch + piece.dir[2] * flightDist + rotRel[2]

            // Project all 8 corners of the unit block
            var corners = []
            for (var ci = 0; ci < 8; ci++) {
                var sc = signs[ci]
                var lCorner = rotateVec3(
                    sc[0] * halfVox,
                    sc[1] * halfVox,
                    sc[2] * halfVox,
                    piece.spinAxis[0], piece.spinAxis[1], piece.spinAxis[2], spinAngle
                )
                corners.push(project3DPoint(
                    wcx + lCorner[0],
                    wcy + lCorner[1],
                    wcz + lCorner[2],
                    rx, ry, rz, cx, cy, scale, fov
                ))
            }

            // Emit only exterior front-facing polyomino faces
            for (var fi = 0; fi < 6; fi++) {
                var fSpec = faceSpecs[fi]
                var nx = fSpec.n[0], ny = fSpec.n[1], nz = fSpec.n[2]
                // Cull internal faces shared between two connected blocks of the same polyomino piece
                if (hasPieceBlock(pBlocks, bx + nx, by + ny, bz + nz)) continue

                var p0 = corners[fSpec.ids[0]]
                var p1 = corners[fSpec.ids[1]]
                var p2 = corners[fSpec.ids[2]]
                var p3 = corners[fSpec.ids[3]]

                // True 2D screen-space back-face culling (CCW signed area > 0 means facing camera)
                var signedArea2 = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x)
                if (signedArea2 <= 0.0) continue

                // Determine which of the 4 quad edges are true outer polyomino boundaries vs internal coplanar seams
                var drawEdgeFlags = [true, true, true, true]
                for (var ei = 0; ei < 4; ei++) {
                    var ed = fSpec.edgeDirs[ei]
                    var hasAdjInPlane = hasPieceBlock(pBlocks, bx + ed[0], by + ed[1], bz + ed[2])
                    var hasStepUp = hasPieceBlock(pBlocks, bx + ed[0] + nx, by + ed[1] + ny, bz + ed[2] + nz)
                    if (hasAdjInPlane && !hasStepUp) {
                        drawEdgeFlags[ei] = false
                    }
                }

                // Group coplanar faces of the same polyomino piece so their outer neon boundary is stroked in one unified pass
                var planeCoord = bx * nx + by * ny + bz * nz
                var groupKey = ((pi * 6 + fi) << 3) | (planeCoord + 3)
                var grp = coplanarGroups[groupKey]
                if (!grp) {
                    grp = { remaining: 0, outerSegs: [] }
                    coplanarGroups[groupKey] = grp
                }
                grp.remaining++

                polyFaces.push({
                    p0: p0, p1: p1, p2: p2, p3: p3,
                    fz: (p0.z + p1.z + p2.z + p3.z) * 0.25,
                    shade: fSpec.shade,
                    isKeyFace: fSpec.isKeyFace,
                    drawEdges: drawEdgeFlags,
                    group: grp,
                    split: split,
                    bVal: bVal,
                    colMain: colMain,
                    colAccent: colAccent
                })
            }
        }
    }

    // Painter's Algorithm: sort all visible exterior polyomino faces back-to-front by camera depth
    polyFaces.sort(function (a, b) { return a.fz - b.fz })

    ctx.save()
    ctx.globalCompositeOperation = "source-over"

    var alphaScale = isEcho ? 0.62 : 1.0
    for (var qi = 0; qi < polyFaces.length; qi++) {
        var vf = polyFaces[qi]
        var pts = [vf.p0, vf.p1, vf.p2, vf.p3]

        // Pre-blend the palette tint onto the opaque obsidian core (#060914) so each face is filled in a single opaque pass
        // and internal seam sealing uses the exact same opaque RGB colour (zero double-alpha seam brightening)
        var baseRgb = parseRgbTriplet(vf.isKeyFace ? vf.colMain : vf.colAccent)
        var tMix = clamp((0.30 + vf.bVal * 0.28 + (1.0 - vf.split) * 0.16 + state.beatPulse * 0.08) * vf.shade, 0.0, 0.92)
        var fr = Math.round(6 + (baseRgb[0] - 6) * tMix)
        var fg = Math.round(9 + (baseRgb[1] - 9) * tMix)
        var fb = Math.round(20 + (baseRgb[2] - 20) * tMix)
        var solidFaceCol = isEcho
            ? ("rgba(" + fr + ", " + fg + ", " + fb + ", " + (0.92 * alphaScale).toFixed(3) + ")")
            : ("rgb(" + fr + ", " + fg + ", " + fb + ")")

        ctx.fillStyle = solidFaceCol
        ctx.beginPath()
        ctx.moveTo(vf.p0.x, vf.p0.y)
        ctx.lineTo(vf.p1.x, vf.p1.y)
        ctx.lineTo(vf.p2.x, vf.p2.y)
        ctx.lineTo(vf.p3.x, vf.p3.y)
        ctx.closePath()
        ctx.fill()

        // Seal internal coplanar seams with an identical-colour sub-threshold hairline stroke (< 0.75 bypasses tube shader)
        // while collecting true outer perimeter edges for the coplanar polyomino face group
        var grpRef = vf.group
        ctx.beginPath()
        var anySeamEdge = false
        for (var eIdx = 0; eIdx < 4; eIdx++) {
            var pa = pts[eIdx]
            var pb = pts[(eIdx + 1) & 3]
            if (vf.drawEdges[eIdx]) {
                grpRef.outerSegs.push(pa, pb)
            } else {
                ctx.moveTo(pa.x, pa.y)
                ctx.lineTo(pb.x, pb.y)
                anySeamEdge = true
            }
        }
        if (anySeamEdge) {
            ctx.strokeStyle = solidFaceCol
            ctx.lineWidth = 0.65
            ctx.stroke()
        }

        // Once the final unit quad of this coplanar polyomino face is filled, stroke its entire outer boundary in one pass
        grpRef.remaining--
        if (grpRef.remaining === 0 && grpRef.outerSegs.length > 0) {
            ctx.strokeStyle = colourWithAlpha(vf.colMain, (0.82 + vf.bVal * 0.18) * vf.shade * alphaScale)
            ctx.lineWidth = (1.35 + vf.bVal * 1.15 + (1.0 - vf.split) * 0.45) * (isEcho ? 0.75 : 1.0)
            ctx.beginPath()
            var segs = grpRef.outerSegs
            for (var si = 0; si < segs.length; si += 2) {
                ctx.moveTo(segs[si].x, segs[si].y)
                ctx.lineTo(segs[si + 1].x, segs[si + 1].y)
            }
            ctx.stroke()
        }
    }
    ctx.restore()
}

function drawSingleLayer2Mode(ctx, w, h, state, palette, cfg, m) {
    // 3D Tubular Cylinder Shading Wrapper for Layer 4 Sacred Geometry & Oscilloscopes:
    // Gives flat 2D strokes real 3D cylindrical girth, outer ambient shadow sheath, and an inner specular highlight core!
    var origStroke = ctx.stroke
    var prevJoin = ctx.lineJoin
    var prevCap = ctx.lineCap
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    var isEchoPass = Boolean(cfg && cfg._isEcho)
    var tubeSpecularCol = colourWithAlpha(palette && palette.length > 0 ? palette[(m + 2) % palette.length] : "#ffffff", isEchoPass ? 0.34 : 0.72)
    ctx.stroke = function () {
        var baseLW = ctx.lineWidth || 1.5
        var baseStroke = ctx.strokeStyle
        var baseAlpha = ctx.globalAlpha !== undefined ? ctx.globalAlpha : 1.0
        if (baseLW >= 0.75) {
            // Pass 1: 3D Outer Dark Shadow / Ambient Halo Sheath
            ctx.lineWidth = baseLW * (isEchoPass ? 1.85 : 2.35)
            ctx.strokeStyle = "rgba(4, 6, 16, " + (isEchoPass ? 0.24 : 0.44).toFixed(2) + ")"
            origStroke.call(ctx)
            // Pass 2: Volumetric Mid-Tone 3D Cylinder Body (boosted girth)
            ctx.lineWidth = baseLW * (isEchoPass ? 1.25 : 1.48)
            ctx.strokeStyle = baseStroke
            origStroke.call(ctx)
            // Pass 3: Bright Inner Specular Cylindrical Core
            if (!isEchoPass || baseLW >= 1.35) {
                ctx.lineWidth = Math.max(0.55, baseLW * 0.44)
                ctx.strokeStyle = tubeSpecularCol
                ctx.globalAlpha = baseAlpha * (isEchoPass ? 0.50 : 0.86)
                origStroke.call(ctx)
                ctx.globalAlpha = baseAlpha
            }
            ctx.lineWidth = baseLW
            ctx.strokeStyle = baseStroke
        } else {
            origStroke.call(ctx)
        }
    }
    try {
        if (m === 0) drawMode0MilkDrop(ctx, w, h, state, palette, cfg)
        else if (m === 1) drawMode1AvsSuperScope(ctx, w, h, state, palette, cfg)
        else if (m === 2) drawMode2GForceWaveShape(ctx, w, h, state, palette, cfg)
        else if (m === 3) drawMode3CthughaRave(ctx, w, h, state, palette, cfg)
        else if (m === 4) drawMode4MinterVlm(ctx, w, h, state, palette, cfg)
        else if (m === 5) drawMode5JuliaFractals(ctx, w, h, state, palette, cfg)
        else if (m === 6) drawMode6DmtChrysanthemum(ctx, w, h, state, palette, cfg)
        else if (m === 7) drawMode7SpacetimeQuasar(ctx, w, h, state, palette, cfg)
        else if (m === 8) drawMode8AlienMycelium(ctx, w, h, state, palette, cfg)
        else if (m === 9) drawMode9CyberMatrix(ctx, w, h, state, palette, cfg)
        else if (m === 10) drawMode10SacredPolytope(ctx, w, h, state, palette, cfg)
        else if (m === 11) drawMode11StrangeAttractor(ctx, w, h, state, palette, cfg)
        else if (m === 12) drawMode12SierpinskiFractal(ctx, w, h, state, palette, cfg)
        else if (m === 13) drawMode13HopfFibrationTorus(ctx, w, h, state, palette, cfg)
        else if (m === 14) drawMode14CalabiYauManifold(ctx, w, h, state, palette, cfg)
        else if (m === 15) drawMode15GyroscopicMerkaba(ctx, w, h, state, palette, cfg)
        else if (m === 16) drawMode16HyperbolicPoincareWeb(ctx, w, h, state, palette, cfg)
        else if (m === 17) drawMode17QuantumBlochSphere(ctx, w, h, state, palette, cfg)
        else if (m === 18) drawMode18KleinBottleImmersion(ctx, w, h, state, palette, cfg)
        else if (m === 19) drawMode19PenroseQuasicrystal(ctx, w, h, state, palette, cfg)
        else drawMode20TetrisCube(ctx, w, h, state, palette, cfg)
    } finally {
        ctx.stroke = origStroke
        ctx.lineJoin = prevJoin
        ctx.lineCap = prevCap
    }
}

function drawLayer2Visualiser(ctx, w, h, state, palette, cfg) {
    if (cfg && !cfg.layer2Enabled) return
    if (cfg && cfg.layer2VizEnabled === false) return
    var m = ((Number(cfg && cfg.layer2Mode !== undefined ? cfg.layer2Mode : (cfg && cfg.mode)) || 0) % ALL_MODE_NAMES.length + ALL_MODE_NAMES.length) % ALL_MODE_NAMES.length

    var l2Opac = cfg && cfg.layer2Opacity !== undefined ? clamp(Number(cfg.layer2Opacity), 0.05, 1.0) : 1.0
    var trEnabled = cfg && cfg.layer2TracersEnabled !== undefined ? Boolean(cfg.layer2TracersEnabled) : true
    var tracerCount = trEnabled ? clamp(Math.round(Number(cfg && cfg.tracerCount !== undefined ? cfg.tracerCount : 9)), 1, 16) : 1
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg && cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg && cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg && cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)

    // Modes 0, 1, 2, 3, 4, 5, 7, 9, and 20 already render native 3D depth scenes, oscilloscope rings, fractal cascades, full-screen Matrix rain, or solid 3D polyomino assemblies.
    var isNativeTunnelOrFullScreen = (m === 0 || m === 1 || m === 2 || m === 3 || m === 4 || m === 5 || m === 7 || m === 9 || m === 20)
    if (tracerCount <= 1 || isNativeTunnelOrFullScreen) {
        state.isTracerEcho = false
        state.echoIndex = 0
        state.echoCount = tracerCount
        state.echoAge = 0.0
        state.echoLod = 1.0
        ctx.save()
        ctx.globalAlpha = l2Opac
        try {
            drawSingleLayer2Mode(ctx, w, h, state, palette, cfg, m)
        } finally {
            ctx.restore()
        }
        return
    }

    var cx = w * 0.5
    var cy = h * 0.5
    var baseT = state.t
    var basePhase = state.phase
    var endPt = computeTracerEndpoint(w, h, state.driftTime !== undefined ? state.driftTime : baseT, tracerDrift, 1.0)
    var lagStep = 0.052 * (0.45 + 0.55 * tracerSpeed)
    var effDir = (tracerDir === 0) ? Math.sin(baseT * 0.55) : clamp(tracerDir, -1, 1)
    var echoAtten = 1.0 / (1.0 + Math.sqrt(tracerCount) * 0.45)

    var noopFill = function() {}
    for (var e = tracerCount - 1; e >= 0; e--) {
        var u = e / Math.max(1, tracerCount - 1)
        var curveU = Math.pow(u, 1.10)

        state.t = baseT - e * lagStep
        state.phase = basePhase - e * lagStep * 1.35
        state.echoIndex = e
        state.echoCount = tracerCount
        state.echoAge = u
        state.isTracerEcho = (e > 0)
        state.echoLod = (e === 0) ? 1.0 : (e >= 2 ? 0.34 : 0.48)

        var echoPalette = rotatePaletteForEcho(palette, e)

        var zScale = 1.0
        var tx = 0.0
        var ty = 0.0
        if (effDir >= 0) {
            var towardsAmt = 0.5 + 0.5 * effDir
            zScale = 0.58 + curveU * (1.05 + 0.65 * tracerSpeed * towardsAmt)
            if (m === 8) zScale = Math.min(zScale, 0.55 + curveU * 0.48)
            tx = endPt.dx * (0.45 * (1.0 - curveU) - 0.35 * curveU)
            ty = endPt.dy * (0.45 * (1.0 - curveU) - 0.35 * curveU)
        } else {
            var awayAmt = Math.abs(effDir)
            zScale = 1.18 / (1.0 + curveU * (1.35 + 0.75 * tracerSpeed * awayAmt))
            if (m === 8) zScale = Math.min(zScale, 0.92 / (1.0 + curveU * 0.85))
            tx = endPt.dx * curveU
            ty = endPt.dy * curveU
        }

        var alphaE = (e === 0) ? 0.98 : (Math.pow(1.0 - u * 0.86, 1.42) * 0.78 * echoAtten)
        var twistAngle = Math.sin(baseT * 0.36) * 0.14 * curveU

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = clamp(alphaE * l2Opac, 0.02, 1.0)
        ctx.translate(cx + tx, cy + ty)
        ctx.scale(zScale, zScale)
        ctx.rotate(twistAngle)
        ctx.translate(-cx, -cy)
        var savedFill = ctx.fill
        if (e > 0 && m !== 9 && m !== 20) {
            ctx.fill = noopFill
        }
        drawSingleLayer2Mode(ctx, w, h, state, echoPalette, cfg, m)
        if (e > 0 && m !== 9 && m !== 20) {
            ctx.fill = savedFill
        }
        ctx.restore()
    }

    state.t = baseT
    state.phase = basePhase
    state.isTracerEcho = false
    state.echoIndex = 0
    state.echoLod = 1.0
}

// ---------------------------------------------------------------------------
// LAYER #3 — Album Art & Song Words Dismantle, Evolution, Tracers & Rebuild
// ---------------------------------------------------------------------------

// Precomputed 2x4 Braille dot relative offsets within [-0.36..+0.36, -0.40..+0.40]
var BRAILLE_DOT_DX = [-0.24, -0.24, -0.24,  0.24,  0.24,  0.24, -0.24,  0.24]
var BRAILLE_DOT_DY = [-0.36, -0.12,  0.12, -0.36, -0.12,  0.12,  0.36,  0.36]

var LAYER3_STYLE_FONTS = [
    "'Orbitron', 'URW Gothic', 'Rajdhani', 'Eurostile', 'JetBrainsMono Nerd Font', sans-serif",          // 0: Cyber Techno
    "'Syne', 'Z003', 'P052', 'Space Grotesk', 'JetBrainsMono Nerd Font', serif",                         // 1: Psychedelic Liquid
    "'Chakra Petch', 'Nimbus Sans Narrow', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",           // 2: Rave Laser Stencil
    "'Montserrat', 'URW Gothic', 'Ubuntu', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",           // 3: Dance Chrome
    "'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace",                                            // 4: Club LED Wall
    "'iA Writer Mono S', 'Nimbus Mono PS', 'JetBrainsMono Nerd Font', monospace",                        // 5: Acid Glitch IDM
    "'Cinzel', 'P052', 'URW Bookman', 'Orbitron', 'JetBrainsMono Nerd Font', serif",                     // 6: Psytrance UV Glow
    "'ChunkFive', 'Impact', 'Nimbus Sans Narrow', 'Liberation Sans', sans-serif",                        // 7: Berlin Brutalist
    "'Rajdhani', 'URW Gothic', 'Nimbus Sans Narrow', 'JetBrainsMono Nerd Font', sans-serif",             // 8: Holographic Sci-Fi HUD
    "'Share Tech Mono', 'Nimbus Mono PS', 'JetBrainsMono Nerd Font', monospace",                         // 9: Oscilloscope Vector Beam
    "'ChunkFive Print', 'ChunkFive', 'Orbitron', 'URW Bookman', serif",                                  // 10: 3D Isometric Extrude
    "'Chakra Petch', 'URW Gothic', 'Orbitron', 'JetBrainsMono Nerd Font', sans-serif",                   // 11: Plasma Arc Tesla
    "'C059', 'URW Bookman', 'Syne', 'Liberation Serif', serif",                                          // 12: Y2K Iridescent Mercury
    "'Press Start 2P', 'iA Writer Duospace', 'JetBrainsMono Nerd Font', monospace",                      // 13: Demoscene Copperbars
    "'P052', 'Z003', 'Space Grotesk', 'Liberation Serif', serif",                                        // 14: Bioluminescent Mycelium
    "'iA Writer Duospace', 'JetBrainsMono Nerd Font', 'Share Tech Mono', monospace",                     // 15: Quantum Matrix Datastream
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', 'JetBrains Mono', monospace",                         // 16: ASCII Black Block / White Text
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', 'JetBrains Mono', monospace",                         // 17: ASCII White Back / Black Text
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', 'JetBrains Mono', monospace",                         // 18: ASCII Transparent Back / Text
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', 'JetBrains Mono', monospace",                         // 19: ASCII Coloured Back / Transparent Text
    "'JetBrainsMono Nerd Font', 'Share Tech Mono', 'JetBrains Mono', monospace"                          // 20: ASCII Cell Matrix
]
var LAYER3_STYLE_PALETTES = [
    ["#00F5FF", "#FF1493", "#E2F9FF", "#7B2CBF", "#00FFB2", "#FFBE0B"], // 0: Cyber Techno
    ["#FF007F", "#FFAA00", "#00FFCC", "#BF00FF", "#FFFF33", "#00C8FF"], // 1: Psychedelic Liquid
    ["#00FF88", "#00F0FF", "#FF0055", "#E6FF00", "#00FFCC", "#FF2A85"], // 2: Rave Laser Stencil
    ["#E8F7FF", "#00E5FF", "#FF2A9D", "#FFFFFF", "#9B5DE5", "#FFD166"], // 3: Dance Chrome
    ["#00FF88", "#00E5FF", "#FFB800", "#FF007F", "#38BDF8", "#A3E635"], // 4: Club LED Wall
    ["#E6FF00", "#00F0FF", "#FF1E56", "#F8FAFC", "#A855F7", "#10B981"], // 5: Acid Glitch IDM
    ["#B5179E", "#00FFFF", "#FFD700", "#7209B7", "#4CC9F0", "#F72585"], // 6: Psytrance UV Glow
    ["#F4F4F6", "#FF1E38", "#E6FF00", "#FFFFFF", "#FF3B30", "#D1D5DB"], // 7: Berlin Brutalist
    ["#00FFD5", "#00B4D8", "#90E0EF", "#38F9D7", "#48CAE4", "#E0FBFC"], // 8: Holographic Sci-Fi HUD
    ["#00FF66", "#33FFCC", "#CCFFDD", "#00E5FF", "#80FFAA", "#FFFFFF"], // 9: Oscilloscope Vector Beam
    ["#00F5D4", "#F15BB5", "#9B5DE5", "#FEE440", "#00BBF9", "#FFFFFF"], // 10: 3D Isometric Extrude
    ["#7DF9FF", "#B5179E", "#FFFFFF", "#4CC9F0", "#9D4EDD", "#E0AAFF"], // 11: Plasma Arc Tesla
    ["#F8FAFC", "#A5F3FC", "#F5D0FE", "#C4B5FD", "#67E8F9", "#F472B6"], // 12: Y2K Iridescent Mercury
    ["#FF0055", "#FF8800", "#FFEE00", "#00FF66", "#00CCFF", "#AA00FF"], // 13: Demoscene Copperbars
    ["#00FFB2", "#38BDF8", "#A3E635", "#E879F9", "#2DD4BF", "#FDE047"], // 14: Bioluminescent Mycelium
    ["#00FF99", "#10B981", "#FFD166", "#6EE7B7", "#34D399", "#ECFDF5"], // 15: Quantum Matrix Datastream
    ["#FFFFFF", "#F8FAFC", "#E2E8F0", "#CBD5E1", "#94A3B8", "#00F5D4"], // 16: ASCII Black Block / White Text
    ["#FFFFFF", "#F8FAFC", "#E2E8F0", "#FEF08A", "#A5F3FC", "#FDE047"], // 17: ASCII White Back / Black Text
    ["#00FF99", "#00F5FF", "#FF2A85", "#FEE440", "#A5F3FC", "#FFFFFF"], // 18: ASCII Transparent Back / Text
    ["#FF006E", "#00F5D4", "#FFBE0B", "#8338EC", "#3A86FF", "#FB5607"], // 19: ASCII Coloured Back / Transparent Text
    ["#FFB000", "#33FF33", "#BCE8FF", "#FF4500", "#70A4B2", "#00F5D4"]  // 20: ASCII Cell Matrix (Cool Retro Term CRT Phosphors)
]

// Cool Retro Term authentic CRT terminal phosphor colour schemes for Style 20 (ASCII Cell Matrix)
var COOL_RETRO_TERM_PHOSPHORS = [
    { name: "P3 Amber Phosphor",   fg: "#FF8800", core: "#FFE082", bg: "#140900", revBg: "#FF8800", bezel: "#663800" }, // 0: Classic Amber P3 (exact crt_ref.png hue)
    { name: "IBM 5151 P1 Green",   fg: "#33FF33", core: "#B3FFB3", bg: "#021402", revBg: "#33FF33", bezel: "#145214" }, // 1: Green P1
    { name: "DEC VT100 P4 White",  fg: "#BCE8FF", core: "#F4FBFF", bg: "#050D14", revBg: "#BCE8FF", bezel: "#2D556E" }, // 2: White/Blue P4
    { name: "IBM 3290 Plasma Red", fg: "#FF4500", core: "#FFAB80", bg: "#1A0500", revBg: "#FF4500", bezel: "#6E1C00" }, // 3: Gas-Plasma Red-Orange
    { name: "Commodore 64 CRT",    fg: "#70A4B2", core: "#C7F0FF", bg: "#141030", revBg: "#70A4B2", bezel: "#352879" }, // 4: C64 Blue/Cyan
    { name: "Apple II Cyan-Green", fg: "#00F5D4", core: "#B8FFF4", bg: "#021412", revBg: "#00F5D4", bezel: "#0D5C54" }  // 5: Cyan-Emerald Matrix
]

// Authentic 5×7 Cool-Retro-Term Horizontal Scanline Raster Bitmap Font (7 horizontal scanline rows per glyph, 5-bit row mask 0x10..0x01)
// Matches the exact horizontal scanline-bar geometry of Cool-Retro-Term (`C`, `R`, `T` & 7-bar block cursor `█`).
var CRT_SCANLINE_FONT_5X7 = {
    "A": [0x0E, 0x11, 0x11, 0x1F, 0x11, 0x11, 0x11],
    "B": [0x1E, 0x11, 0x11, 0x1E, 0x11, 0x11, 0x1E],
    "C": [0x0E, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0E],
    "D": [0x1E, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1E],
    "E": [0x1F, 0x10, 0x10, 0x1E, 0x10, 0x10, 0x1F],
    "F": [0x1F, 0x10, 0x10, 0x1E, 0x10, 0x10, 0x10],
    "G": [0x0E, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0F],
    "H": [0x11, 0x11, 0x11, 0x1F, 0x11, 0x11, 0x11],
    "I": [0x0E, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0E],
    "J": [0x07, 0x02, 0x02, 0x02, 0x12, 0x12, 0x0C],
    "K": [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
    "L": [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1F],
    "M": [0x11, 0x1B, 0x15, 0x15, 0x11, 0x11, 0x11],
    "N": [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
    "O": [0x0E, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0E],
    "P": [0x1E, 0x11, 0x11, 0x1E, 0x10, 0x10, 0x10],
    "Q": [0x0E, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0D],
    "R": [0x1E, 0x11, 0x11, 0x1E, 0x1C, 0x12, 0x11],
    "S": [0x0F, 0x10, 0x10, 0x0E, 0x01, 0x01, 0x1E],
    "T": [0x1F, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
    "U": [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0E],
    "V": [0x11, 0x11, 0x11, 0x11, 0x11, 0x0A, 0x04],
    "W": [0x11, 0x11, 0x11, 0x15, 0x15, 0x1B, 0x11],
    "X": [0x11, 0x11, 0x0A, 0x04, 0x0A, 0x11, 0x11],
    "Y": [0x11, 0x11, 0x0A, 0x04, 0x04, 0x04, 0x04],
    "Z": [0x1F, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1F],
    "0": [0x0E, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0E],
    "1": [0x04, 0x0C, 0x04, 0x04, 0x04, 0x04, 0x0E],
    "2": [0x0E, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1F],
    "3": [0x1F, 0x02, 0x04, 0x06, 0x01, 0x11, 0x0E],
    "4": [0x02, 0x06, 0x0A, 0x12, 0x1F, 0x02, 0x02],
    "5": [0x1F, 0x10, 0x1E, 0x01, 0x01, 0x11, 0x0E],
    "6": [0x06, 0x08, 0x10, 0x1E, 0x11, 0x11, 0x0E],
    "7": [0x1F, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
    "8": [0x0E, 0x11, 0x11, 0x0E, 0x11, 0x11, 0x0E],
    "9": [0x0E, 0x11, 0x11, 0x0F, 0x01, 0x02, 0x0C],
    "!": [0x04, 0x04, 0x04, 0x04, 0x04, 0x00, 0x04],
    "?": [0x0E, 0x11, 0x01, 0x06, 0x04, 0x00, 0x04],
    ".": [0x00, 0x00, 0x00, 0x00, 0x00, 0x0C, 0x0C],
    ",": [0x00, 0x00, 0x00, 0x00, 0x06, 0x04, 0x08],
    ":": [0x00, 0x0C, 0x0C, 0x00, 0x0C, 0x0C, 0x00],
    ";": [0x00, 0x0C, 0x0C, 0x00, 0x0C, 0x04, 0x08],
    "-": [0x00, 0x00, 0x00, 0x1F, 0x00, 0x00, 0x00],
    "_": [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F],
    "+": [0x00, 0x04, 0x04, 0x1F, 0x04, 0x04, 0x00],
    "=": [0x00, 0x00, 0x1F, 0x00, 0x1F, 0x00, 0x00],
    "/": [0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10],
    "\\": [0x10, 0x08, 0x08, 0x04, 0x02, 0x02, 0x01],
    "|": [0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
    "(": [0x02, 0x04, 0x08, 0x08, 0x08, 0x04, 0x02],
    ")": [0x08, 0x04, 0x02, 0x02, 0x02, 0x04, 0x08],
    "[": [0x0E, 0x08, 0x08, 0x08, 0x08, 0x08, 0x0E],
    "]": [0x0E, 0x02, 0x02, 0x02, 0x02, 0x02, 0x0E],
    "<": [0x02, 0x04, 0x08, 0x10, 0x08, 0x04, 0x02],
    ">": [0x08, 0x04, 0x02, 0x01, 0x02, 0x04, 0x08],
    "'": [0x04, 0x04, 0x08, 0x00, 0x00, 0x00, 0x00],
    "\"": [0x0A, 0x0A, 0x0A, 0x00, 0x00, 0x00, 0x00],
    "#": [0x0A, 0x1F, 0x0A, 0x0A, 0x1F, 0x0A, 0x0A],
    "$": [0x04, 0x0F, 0x14, 0x0E, 0x05, 0x1E, 0x04],
    "%": [0x19, 0x19, 0x02, 0x04, 0x08, 0x13, 0x13],
    "&": [0x0C, 0x12, 0x14, 0x08, 0x15, 0x12, 0x0D],
    "*": [0x00, 0x04, 0x15, 0x0E, 0x15, 0x04, 0x00],
    "█": [0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F]
}

function getCrtScanlineBitmap(ch) {
    if (!ch || ch === " ") return [0, 0, 0, 0, 0, 0, 0]
    var up = String(ch).toUpperCase()
    if (CRT_SCANLINE_FONT_5X7[up]) return CRT_SCANLINE_FONT_5X7[up]
    var code = up.charCodeAt(0) || 65
    return [
        0x0E | ((code & 1) << 4),
        0x11 | ((code & 2) << 2),
        0x15,
        0x1F,
        0x15,
        0x11 | ((code & 4) << 1),
        0x0E
    ]
}

// Renders a single Cool-Retro-Term (`crt_ref.png`) 7-scanline-row character cell centered at (0, 0):
//   crtMode 0: Dark CRT glass cell + faint unlit scanline tracks + glowing 7-row horizontal phosphor bars (Style 16 & Style 20 normal)
//   crtMode 1: Pure floating 7-row horizontal CRT phosphor scanline bars with zero background (Style 18)
//   crtMode 2: Reverse-video 7-scanline-row CRT block where unlit pixels glow as horizontal phosphor bars & glyph is dark/carved (Style 17 & Style 20 rev)
//   crtMode 3: Reverse-video Knockout 7-scanline-row CRT block where only the complement horizontal scanline bars are drawn (Style 19 & Style 20 knockout)
function drawCrtScanlineCell(ctx, ch, cellW, cellH, fgCol, coreCol, bgCol, crtMode, isEcho, beatPulse) {
    var rows = getCrtScanlineBitmap(ch)
    var numRows = 7
    var pitchY = cellH / numRows
    var barH = Math.max(1.6, pitchY * 0.62) // 62% glowing phosphor scanline bar, 38% dark horizontal CRT scanline gap!
    var coreH = Math.max(0.85, barH * 0.42)
    var bloomH = barH * 1.48

    // In reverse-video modes (2 & 3), add a 1-column left/right margin (7 columns total: bits 6..0) so the 5×7 character is framed inside the 7 scanline bars!
    var isReverse = (crtMode === 2 || crtMode === 3)
    var numCols = isReverse ? 7 : 5
    var colW = (cellW * (isReverse ? 0.92 : 0.82)) / numCols
    var startX = -0.5 * numCols * colW
    var startY = -0.5 * cellH

    // 1. Optional dark smoked CRT glass backing + faint unlit horizontal raster scanline tracks
    if (crtMode === 0 || crtMode === 2) {
        ctx.fillStyle = colourWithAlpha(bgCol || "#0A0602", isEcho ? 0.76 : 0.92)
        ctx.fillRect(-cellW * 0.48, -cellH * 0.54, cellW * 0.96, cellH * 1.08)
        if (!isEcho) {
            ctx.fillStyle = colourWithAlpha(fgCol, 0.10)
            for (var tr = 0; tr < numRows; tr++) {
                var ty = startY + (tr + 0.5) * pitchY - barH * 0.5
                ctx.fillRect(-cellW * 0.44, ty, cellW * 0.88, barH)
            }
        }
    }

    // Collect merged horizontal scanline bar runs `[x, y, w]` across all 7 scanline rows
    var barRuns = []
    var darkGlyphRuns = []
    for (var r = 0; r < numRows; r++) {
        var raw5 = rows[r] & 0x1F
        // Shift 5-bit glyph into centre of 7-bit row (bits 5..1) when in reverse-video 7-col block mode
        var rowMask = isReverse ? ((~((raw5 << 1) & 0x3E)) & 0x7F) : raw5
        var ry = startY + (r + 0.5) * pitchY - barH * 0.5
        var c = 0
        while (c < numCols) {
            var bitMask = 1 << (numCols - 1 - c)
            if (rowMask & bitMask) {
                var runStart = c
                while (c < numCols && (rowMask & (1 << (numCols - 1 - c)))) {
                    c++
                }
                var runCols = c - runStart
                var rx = startX + runStart * colW
                var rw = Math.max(1.5, runCols * colW - colW * 0.10)
                barRuns.push(rx, ry, rw)
            } else {
                c++
            }
        }
        if (crtMode === 2 && !isEcho) {
            // Also record the inner character scanline bars for dark/contrasting recessed phosphor rendering
            var gc = 0
            while (gc < 5) {
                if (raw5 & (1 << (4 - gc))) {
                    var gStart = gc
                    while (gc < 5 && (raw5 & (1 << (4 - gc)))) {
                        gc++
                    }
                    var gx = startX + (gStart + 1) * colW
                    var gw = Math.max(1.2, (gc - gStart) * colW - colW * 0.12)
                    darkGlyphRuns.push(gx, ry, gw)
                } else {
                    gc++
                }
            }
        }
    }

    // 2. Pass 1: Warm Outer CRT Phosphor Halation Bloom around every horizontal scanline bar
    if (!isEcho && barRuns.length > 0) {
        var padX = Math.max(1.2, colW * 0.22)
        var padY = (bloomH - barH) * 0.5
        ctx.fillStyle = colourWithAlpha(fgCol, 0.34 + (beatPulse || 0.0) * 0.14)
        for (var b0 = 0; b0 < barRuns.length; b0 += 3) {
            ctx.fillRect(barRuns[b0] - padX, barRuns[b0 + 1] - padY, barRuns[b0 + 2] + padX * 2.0, bloomH)
        }
    }

    // 3. Pass 2: Crisp Saturated Horizontal CRT Scanline Phosphor Bars
    ctx.fillStyle = colourWithAlpha(fgCol, isEcho ? 0.80 : 0.98)
    for (var b1 = 0; b1 < barRuns.length; b1 += 3) {
        ctx.fillRect(barRuns[b1], barRuns[b1 + 1], barRuns[b1 + 2], barH)
    }

    // 4. Pass 3: Hot Incandescent Electron-Beam Centre Filament inside each horizontal scanline bar
    if (!isEcho && barRuns.length > 0) {
        var coreInsetX = Math.max(0.5, colW * 0.08)
        var coreOffsetY = (barH - coreH) * 0.5
        ctx.fillStyle = colourWithAlpha(coreCol || "#FFE885", 0.88)
        for (var b2 = 0; b2 < barRuns.length; b2 += 3) {
            var cw = Math.max(1.0, barRuns[b2 + 2] - coreInsetX * 2.0)
            ctx.fillRect(barRuns[b2] + coreInsetX, barRuns[b2 + 1] + coreOffsetY, cw, coreH)
        }
    }

    // 5. In crtMode 2 (Lit Block / Dark Recessed Glyph), render the recessed dark CRT scanline bars inside the cutout
    if (crtMode === 2 && darkGlyphRuns.length > 0) {
        ctx.fillStyle = colourWithAlpha(bgCol || "#050608", 0.96)
        for (var d0 = 0; d0 < darkGlyphRuns.length; d0 += 3) {
            ctx.fillRect(darkGlyphRuns[d0], darkGlyphRuns[d0 + 1], darkGlyphRuns[d0 + 2], barH)
        }
    }
}

function drawLayer3AlbumArt(ctx, w, h, state, palette, cfg, asciiLines, ttfxFrames) {
    if (!cfg || !cfg.layer3Enabled || cfg.layer3IterationPaused) return

    var l3Opac = cfg.layer3Opacity !== undefined ? clamp(Number(cfg.layer3Opacity), 0.05, 1.0) : 0.90
    var l3Mode = (Number(cfg.layer3Mode) || 0) % LAYER3_MODES.length
    var rawAsciiMode = String(cfg.layer3AsciiMode || cfg.asciiMode || "braille").toLowerCase()
    var isWordsSource = (l3Mode === 5 || cfg.useAlbumArt === false || rawAsciiMode === "banner")
    var isTextGlyph = (cfg.useAlbumArt === false) && (rawAsciiMode === "text")
    var isBlockGlyph = (rawAsciiMode === "block")
    var isBrailleGlyph = (!isBlockGlyph && !isTextGlyph)

    var cx = w * 0.5
    var cy = h * 0.5
    var l3T = state.t || 0.0
    var baseL3Scale = clamp(Number(cfg.layer3Scale !== undefined ? cfg.layer3Scale : 1.0), 0.40, 3.00)
    var randomScaleWave = cfg.layer3AutoRandomise
        ? (0.62 + 0.36 * (0.5 + 0.5 * Math.sin(l3T * 0.72 + Math.cos(l3T * 0.31) * 0.8)))
        : 1.0
    var scale = clamp(baseL3Scale * randomScaleWave, 0.38, 3.00)
    var l3Tracers = clamp(Math.round(Number(cfg.layer3Tracers !== undefined ? cfg.layer3Tracers : 3)), 1, 8)
    var tracerSpeed = state.liveTracerSpeed !== undefined
        ? state.liveTracerSpeed
        : clamp(Number(cfg.tracerSpeed !== undefined ? cfg.tracerSpeed : 1.15), 0.15, 3.0)
    var tracerDrift = state.liveTracerDrift !== undefined
        ? state.liveTracerDrift
        : clamp(Number(cfg.tracerDrift !== undefined ? cfg.tracerDrift : 1.0), 0.0, 2.5)
    var tracerDir = Number(cfg.tracerDirection !== undefined ? cfg.tracerDirection : 1)
    var endPt = computeTracerEndpoint(w, h, state.driftTime !== undefined ? state.driftTime : state.t, tracerDrift, 1.0)
    var warpIntensity = clamp(Number(cfg.layer3Dismantle !== undefined ? cfg.layer3Dismantle : 1.15), 0.15, 2.2) * (0.85 + state.bassSmooth * 0.55 + state.beatPulse * 0.35)
    var evoFreq = clamp(Number(cfg.layer3Evolution !== undefined ? cfg.layer3Evolution : 0.85), 0.2, 2.5)

    var showArtist = cfg.layer3ShowArtist !== undefined ? Boolean(cfg.layer3ShowArtist) : true
    var showTrack = cfg.layer3ShowTrack !== undefined ? Boolean(cfg.layer3ShowTrack) : true
    var showAlbum = cfg.layer3ShowAlbum !== undefined ? Boolean(cfg.layer3ShowAlbum) : true
    var showStatements = cfg.layer3ShowStatements !== undefined ? Boolean(cfg.layer3ShowStatements) : false
    var anyTextEnabled = (showArtist || showTrack || showAlbum || showStatements)
    var textStyle = clamp(Math.round(Number(cfg.layer3TextStyle !== undefined ? cfg.layer3TextStyle : 0)), 0, LAYER3_TEXT_STYLES.length - 1)
    var colourMode = clamp(Math.round(Number(cfg.layer3ColourMode !== undefined ? cfg.layer3ColourMode : 0)), 0, LAYER3_COLOUR_MODES.length - 1)
    var cylDir = clamp(Math.round(Number(cfg.layer3CylinderDir !== undefined ? cfg.layer3CylinderDir : 0)), 0, LAYER3_CYLINDER_DIRS.length - 1)

    var rawArtist = String(cfg.trackArtist || "").trim().toUpperCase()
    var rawTitle = String(cfg.trackTitle || "").trim().toUpperCase()
    var rawAlbum = String(cfg.trackAlbum || "").trim().toUpperCase()
    var rawStatement = String(cfg.statementText || "").trim().toUpperCase()
    if (!rawStatement && DEFAULT_STATEMENTS.length > 0) {
        rawStatement = DEFAULT_STATEMENTS[Math.floor(Math.max(0, l3T) * 0.12) % DEFAULT_STATEMENTS.length]
    }
    if (!rawArtist && !rawTitle && !rawAlbum) {
        rawArtist = "BANDARCHY"
        rawTitle = "AUDIO STREAM"
        rawAlbum = "LIVE SYNTHESIS"
    }

    var textLines = []
    if (showArtist && rawArtist) {
        textLines.push(rawArtist)
    }
    if (showTrack && rawTitle && (textLines.length === 0 || rawTitle !== textLines[textLines.length - 1])) {
        textLines.push(rawTitle)
    }
    if (showAlbum && rawAlbum && (textLines.length === 0 || (rawAlbum !== rawTitle && rawAlbum !== rawArtist))) {
        textLines.push(rawAlbum)
    }
    if (showStatements && rawStatement && (textLines.length === 0 || textLines.indexOf(rawStatement) < 0)) {
        textLines.push(rawStatement)
    }
    if (anyTextEnabled && textLines.length === 0) {
        textLines.push(rawStatement || rawArtist || rawTitle || rawAlbum || "BANDARCHY")
    }
    var textStream = textLines.length > 0 ? (textLines.join(" • ") + " • ") : " "

    var isAsciiStyle = (textStyle >= 16 && textStyle <= 20)
    var isLineAsciiBlockStyle = (textStyle === 16 || textStyle === 17 || textStyle === 19)
    var isPaletteShifted = (Number(cfg.palette !== undefined ? cfg.palette : 0) % PALETTES.length) !== 0
    var hasCustomL3Pal = Array.isArray(cfg.layer3CustomPalette) && cfg.layer3CustomPalette.length >= 3
    var isDarkGlobalPal = isDarkMoodPalette(cfg.palette)
    var activeStylePal = hasCustomL3Pal
        ? cfg.layer3CustomPalette
        : ((colourMode === 0 && !isDarkGlobalPal && !(isAsciiStyle && isPaletteShifted))
            ? (LAYER3_STYLE_PALETTES[textStyle] || palette)
            : ((palette && palette.length > 0) ? palette : LAYER3_STYLE_PALETTES[textStyle]))
    var fontPresetIdx = clamp(Math.round(Number(cfg.layer3FontPreset !== undefined ? cfg.layer3FontPreset : 0)), 0, LAYER3_FONT_PRESET_FAMILIES.length - 1)
    var activeFontFamily = (fontPresetIdx > 0 && LAYER3_FONT_PRESET_FAMILIES[fontPresetIdx])
        ? LAYER3_FONT_PRESET_FAMILIES[fontPresetIdx]
        : (LAYER3_STYLE_FONTS[textStyle] || "'JetBrainsMono Nerd Font', sans-serif")

    // Select source lines early so if Art has no lines yet, Crisp Text still renders full-screen
    var effectiveLines = asciiLines
    if (isWordsSource && cfg.bannerLines && cfg.bannerLines.length > 0) {
        effectiveLines = cfg.bannerLines
    } else if (!isWordsSource && cfg.artLines && cfg.artLines.length > 0) {
        effectiveLines = cfg.artLines
    }

    // If in Words / Crisp Text mode (or no art lines) and all 4 text toggles (A/S/D/F) are OFF, draw nothing
    if (!anyTextEnabled && (isWordsSource || isTextGlyph || !effectiveLines || effectiveLines.length === 0)) {
        return
    }

    // Dedicated Crisp Warped Typography Showcase ONLY when Words + Crisp Text is explicitly selected across ALL 12 Layer 3 Modes (0..11)
    if (isTextGlyph) {
        var displayLines = textLines.slice()
        if (textStyle === 0 && displayLines.length > 0) {
            displayLines[0] = "◢ " + displayLines[0] + " ◣"
        } else if (textStyle === 6 && displayLines.length > 0) {
            displayLines[0] = "❖ " + displayLines[0] + " ❖"
        } else if (textStyle === 8 && displayLines.length > 0) {
            displayLines[0] = "⌜ " + displayLines[0] + " ⌝"
        } else if (textStyle === 16 && displayLines.length > 0) {
            displayLines[0] = displayLines[0] + " █"
        } else if (textStyle === 17 && displayLines.length > 0) {
            displayLines[0] = "█ " + displayLines[0] + " █"
        } else if (textStyle === 18 && displayLines.length > 0) {
            for (var a18 = 0; a18 < displayLines.length; a18++) displayLines[a18] = "< " + displayLines[a18] + " >"
        } else if (textStyle === 19 && displayLines.length > 0) {
            for (var a19 = 0; a19 < displayLines.length; a19++) displayLines[a19] = "[ " + displayLines[a19] + " ]"
        } else if (textStyle === 20 && displayLines.length > 0) {
            displayLines[0] = displayLines[0] + " █"
        }
        var maxChars = 12
        for (var li = 0; li < displayLines.length; li++) {
            if (displayLines[li].length > maxChars) maxChars = displayLines[li].length
        }
        var effScale = Math.min(scale, 3.00)
        var baseFontPx = Math.floor(clamp((w * 0.56 * effScale) / Math.max(10, maxChars * 0.74), 14, Math.min(115, h * 0.068 * effScale)))
        if (displayLines.length > 1 && displayLines.length * baseFontPx * 1.40 > h * 0.50 * Math.max(1.0, effScale * 0.65)) {
            baseFontPx = Math.max(14, Math.floor((h * 0.50 * Math.max(1.0, effScale * 0.65)) / (displayLines.length * 1.40)))
        }
        var lineSpanH = baseFontPx * (1.38 + state.bassSmooth * 0.14 + state.beatPulse * 0.10)
        var totalTextH = displayLines.length * lineSpanH

        var lens1X = Math.sin(l3T * 1.15) * 0.68
        var lens1Y = Math.cos(l3T * 1.45) * 0.34
        var lens2X = Math.cos(l3T * 0.86) * 0.68
        var lens2Y = Math.sin(l3T * 1.18) * 0.34
        var lensRad = 0.54 + state.bassSmooth * 0.26

        ctx.save()
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        for (var te = l3Tracers - 1; te >= 0; te--) {
            var isEchoT = (te > 0)
            var uT = l3Tracers > 1 ? (te / (l3Tracers - 1)) : 0.0
            var zScaleT = (tracerDir >= 0)
                ? (1.0 + Math.pow(uT, 1.15) * 0.68 * Math.min(tracerSpeed, 1.8))
                : (1.0 / (1.0 + Math.pow(uT, 1.10) * 0.95 * Math.min(tracerSpeed, 1.8)))
            var txT = endPt.dx * uT * 0.38 * (tracerDir >= 0 ? -1.0 : 1.0)
            var tyT = endPt.dy * uT * 0.38 * (tracerDir >= 0 ? -1.0 : 1.0)
            var passAlphaT = isEchoT ? (Math.pow(1.0 - uT * 0.78, 1.30) * (textStyle === 6 ? 0.54 : 0.42)) : 0.99

            ctx.save()
            ctx.globalAlpha = clamp(passAlphaT * l3Opac, 0.03, 1.0)
            if (isEchoT) {
                ctx.translate(cx + txT, cy + tyT)
                ctx.scale(zScaleT, zScaleT)
                ctx.rotate(Math.sin(l3T * 0.95 + te * 0.6) * 0.045 * uT)
                ctx.translate(-cx, -cy)
            }

            for (var rowIdx = 0; rowIdx < displayLines.length; rowIdx++) {
                var str = displayLines[rowIdx]
                var nCh = str.length
                if (nCh === 0) continue
                var rowFontPx = (rowIdx === 0) ? baseFontPx : Math.max(15, Math.floor(baseFontPx * (rowIdx === 1 ? 0.78 : 0.60)))
                var trackingMul = isAsciiStyle
                    ? (0.88 + state.beatPulse * 0.04)
                    : ((textStyle === 7 || textStyle === 8)
                        ? (0.72 + state.bassSmooth * 0.12 + state.beatPulse * 0.05)
                        : (textStyle === 0 || textStyle === 10 ? (0.70 + state.bassSmooth * 0.06) : (0.66 + state.bassSmooth * 0.06)))
                var charStep = rowFontPx * trackingMul
                var rowHalfW = Math.max(1.0, (nCh - 1) * charStep * 0.5)
                var hyNorm = (displayLines.length === 1) ? 0.0 : ((rowIdx / (displayLines.length - 1)) * 2.0 - 1.0) * 0.55

                // Lively per-row orbital drift & counter-sway so text lines weave and breathe dynamically
                var rowSwayX = Math.sin(l3T * 1.65 * evoFreq + rowIdx * 1.55) * (rowFontPx * (0.42 + state.midSmooth * 0.35) * Math.min(1.35, warpIntensity))
                var rowSwayY = Math.cos(l3T * 1.95 * evoFreq + rowIdx * 1.85) * (rowFontPx * (0.26 + state.bassSmooth * 0.30) * Math.min(1.35, warpIntensity))
                var baseRowY = cy + (rowIdx - (displayLines.length - 1) * 0.5) * lineSpanH + rowSwayY * 0.55

                // Cohesive line-level offset for the line-level ASCII block styles (16, 17, 19) when in flat row modes
                var rowLineCenterX = cx + rowSwayX
                var rowLineCenterY = baseRowY + rowSwayY * 0.45
                var rowPalLen = Math.max(1, activeStylePal.length)
                var rowHueStep = Math.floor(state.hueShift / 42)
                var rowPalIdx = (rowIdx * 2 + te + rowHueStep) % rowPalLen
                var rowColCh = activeStylePal[rowPalIdx]
                var rowColAlt = activeStylePal[(rowPalIdx + 2) % rowPalLen]
                if (colourMode === 1 || colourMode === 2 || colourMode === 5) {
                    var rTriad = deriveDistinctTypographyTriad(activeStylePal, rowPalIdx, rowIdx, (te + rowHueStep) % rowPalLen)
                    rowColCh = (colourMode === 2 && rowIdx === 0 && !isEchoT) ? "#F8FAFC" : rTriad.colCh
                    rowColAlt = rTriad.colAlt
                } else if (colourMode === 3) {
                    var rEqHue = (state.hueShift + rowIdx * 68 + state.bassSmooth * 120) % 360
                    rowColCh = hslToHex(rEqHue, 0.96, 0.60)
                    rowColAlt = hslToHex((rEqHue + 75) % 360, 0.92, 0.56)
                } else if (colourMode === 4) {
                    var rPrismHue = (state.hueShift + rowIdx * 55 + te * 32 + l3T * 36) % 360
                    rowColCh = hslToHex(rPrismHue, 0.96, 0.60)
                    rowColAlt = hslToHex((rPrismHue + 90) % 360, 0.92, 0.55)
                }

                // Per-cell 7-scanline-row Cool-Retro-Term raster rendering is used for Styles 16..20 (no flat solid row fillRects)

                // Row-level stage plates / brutalist bars / laser scanlines / futuristic HUD & Copperbars on front pass
                if (!isEchoT) {
                    var plateW = rowHalfW * 2.0 + rowFontPx * 1.45
                    var plateH = rowFontPx * 1.18
                    var modeUsesPlate = (l3Mode === 1 || l3Mode === 5 || l3Mode === 6 || l3Mode === 8 || l3Mode === 10)
                    if (textStyle === 0 && modeUsesPlate) {
                        // Style 0: Cyber Techno chamfered dark backing plate + dual cyan/magenta laser keylines
                        var chCut = Math.min(14.0, plateH * 0.30)
                        ctx.save()
                        ctx.beginPath()
                        ctx.moveTo(cx - plateW * 0.5 + chCut, baseRowY - plateH * 0.5)
                        ctx.lineTo(cx + plateW * 0.5, baseRowY - plateH * 0.5)
                        ctx.lineTo(cx + plateW * 0.5 - chCut, baseRowY + plateH * 0.5)
                        ctx.lineTo(cx - plateW * 0.5, baseRowY + plateH * 0.5)
                        ctx.closePath()
                        ctx.fillStyle = "rgba(5, 8, 18, 0.78)"
                        ctx.fill()
                        ctx.lineWidth = 1.8 + state.beatPulse * 1.2
                        ctx.strokeStyle = rowIdx === 0 ? "#00F5FF" : "#FF1493"
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 2 && modeUsesPlate) {
                        // Style 2: Rave Laser Stencil horizontal laser beam scanline
                        var scanY = baseRowY + Math.sin(l3T * 6.5 + rowIdx * 1.7) * (plateH * 0.36)
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FF99", 0.52 + state.beatPulse * 0.40)
                        ctx.lineWidth = 1.6 + state.bassSmooth * 2.0
                        ctx.beginPath()
                        ctx.moveTo(cx - plateW * 0.54, scanY)
                        ctx.lineTo(cx + plateW * 0.54, scanY)
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 7 && modeUsesPlate) {
                        // Style 7: Berlin Brutalist monumental high-contrast inverted poster bar
                        ctx.save()
                        ctx.fillStyle = (rowIdx === 0)
                            ? (state.beatPulse > 0.42 ? "#FF1E38" : "#F4F4F6")
                            : "rgba(8, 8, 12, 0.88)"
                        ctx.fillRect(cx - plateW * 0.5, baseRowY - plateH * 0.5, plateW, plateH)
                        ctx.lineWidth = 2.4
                        ctx.strokeStyle = (rowIdx === 0) ? "#060609" : "#FF1E38"
                        if (typeof ctx.strokeRect === "function") ctx.strokeRect(cx - plateW * 0.5, baseRowY - plateH * 0.5, plateW, plateH)
                        ctx.restore()
                    } else if (textStyle === 8) {
                        // Style 8: Holographic Sci-Fi HUD reticle brackets & telemetry scanline
                        ctx.save()
                        var hudX0 = cx - plateW * 0.52
                        var hudX1 = cx + plateW * 0.52
                        var hudY0 = baseRowY - plateH * 0.52
                        var hudY1 = baseRowY + plateH * 0.52
                        var brk = Math.min(18.0, plateH * 0.34)
                        ctx.fillStyle = "rgba(2, 18, 28, 0.46)"
                        ctx.fillRect(hudX0, hudY0, hudX1 - hudX0, hudY1 - hudY0)
                        ctx.strokeStyle = colourWithAlpha("#00FFD5", 0.72 + state.beatPulse * 0.25)
                        ctx.lineWidth = 1.8
                        ctx.beginPath()
                        ctx.moveTo(hudX0, hudY0 + brk); ctx.lineTo(hudX0, hudY0); ctx.lineTo(hudX0 + brk, hudY0)
                        ctx.moveTo(hudX1 - brk, hudY0); ctx.lineTo(hudX1, hudY0); ctx.lineTo(hudX1, hudY0 + brk)
                        ctx.moveTo(hudX0, hudY1 - brk); ctx.lineTo(hudX0, hudY1); ctx.lineTo(hudX0 + brk, hudY1)
                        ctx.moveTo(hudX1 - brk, hudY1); ctx.lineTo(hudX1, hudY1); ctx.lineTo(hudX1, hudY1 - brk)
                        var hScanY = hudY0 + ((l3T * 0.85 + rowIdx * 0.37) % 1.0) * (hudY1 - hudY0)
                        ctx.moveTo(hudX0 + 6, hScanY); ctx.lineTo(hudX1 - 6, hScanY)
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 9) {
                        // Style 9: Oscilloscope Vector Beam continuous audio carrier waveform behind row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FF66", 0.52 + state.bassSmooth * 0.35)
                        ctx.lineWidth = 1.8 + state.beatPulse * 1.4
                        ctx.beginPath()
                        var oscSegs = 28
                        for (var oi = 0; oi <= oscSegs; oi++) {
                            var ou = oi / oscSegs
                            var ox = cx + (ou * 2.0 - 1.0) * (plateW * 0.52)
                            var obin = (oi * 2 + rowIdx * 7) & 63
                            var oAmp = (state.smoothBands[obin] || 0.2) * plateH * 0.42
                            var oy = baseRowY + Math.sin(ou * 12.0 - l3T * 8.0 + rowIdx) * oAmp
                            if (oi === 0) ctx.moveTo(ox, oy)
                            else ctx.lineTo(ox, oy)
                        }
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 11) {
                        // Style 11: Plasma Arc Tesla high-voltage jagged lightning filament across row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#7DF9FF", 0.58 + state.beatPulse * 0.38)
                        ctx.lineWidth = 1.5 + state.bassSmooth * 1.8
                        ctx.beginPath()
                        var arcSteps = 18
                        for (var ai = 0; ai <= arcSteps; ai++) {
                            var au = ai / arcSteps
                            var ax = cx + (au * 2.0 - 1.0) * (rowHalfW + rowFontPx * 0.4)
                            var jag = (ai === 0 || ai === arcSteps) ? 0.0 : Math.sin(ai * 7.3 + Math.floor(l3T * 24.0) * 3.1 + rowIdx) * (rowFontPx * 0.28 * (0.5 + state.bassSmooth))
                            var ay = baseRowY + jag
                            if (ai === 0) ctx.moveTo(ax, ay)
                            else ctx.lineTo(ax, ay)
                        }
                        ctx.stroke()
                        ctx.restore()
                    } else if (textStyle === 13) {
                        // Style 13: Demoscene Copperbars classic Amiga multi-band raster bars slicing behind row
                        ctx.save()
                        var nBars = 5
                        var barH = Math.max(2.5, plateH * 0.14)
                        for (var bi = 0; bi < nBars; bi++) {
                            var bOff = Math.sin(l3T * 3.8 + bi * 0.72 + rowIdx * 1.1) * (plateH * 0.36)
                            ctx.fillStyle = colourWithAlpha(activeStylePal[(bi + rowIdx) % activeStylePal.length], 0.68)
                            ctx.fillRect(cx - plateW * 0.52, baseRowY + bOff - barH * 0.5, plateW * 1.04, barH)
                        }
                        ctx.restore()
                    } else if (textStyle === 14) {
                        // Style 14: Bioluminescent Mycelium organic glowing synaptic tendrils behind row
                        ctx.save()
                        ctx.strokeStyle = colourWithAlpha("#00FFB2", 0.42 + state.midSmooth * 0.35)
                        ctx.lineWidth = 1.6
                        ctx.beginPath()
                        var mycSteps = 20
                        for (var mi = 0; mi <= mycSteps; mi++) {
                            var mu = mi / mycSteps
                            var mx = cx + (mu * 2.0 - 1.0) * (rowHalfW + rowFontPx * 0.3)
                            var my = baseRowY + Math.sin(mu * 7.0 + l3T * 2.4 + rowIdx) * (rowFontPx * 0.24)
                            if (mi === 0) ctx.moveTo(mx, my)
                            else ctx.lineTo(mx, my)
                        }
                        ctx.stroke()
                        ctx.restore()
                    }
                }

                var fontSlope = (textStyle === 1 || textStyle === 3 || textStyle === 12) ? "900 italic " : "900 "
                ctx.font = fontSlope + rowFontPx + "px " + activeFontFamily

                // Sort characters back-to-front by 3D Z depth so letters swooping close to the viewer cleanly overlap distant letters!
                var zDirPol = (tracerDir === 0) ? Math.sin(l3T * 0.55) : (tracerDir < 0 ? -1.0 : 1.0)
                var zSurgeGlobal = Math.sin(l3T * 1.25 * evoFreq * zDirPol + rowIdx * 0.75) * (0.42 + state.bassSmooth * 0.26) * warpIntensity
                var charIndices = []
                for (var ciInit = 0; ciInit < nCh; ciInit++) {
                    var hxInit = (nCh <= 1) ? 0.0 : ((ciInit / (nCh - 1)) * 2.0 - 1.0)
                    var sortZ = ciInit * 0.0001
                    if (l3Mode === 7) {
                        var sSign = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                        var sAng = ((cylDir === 2 || cylDir === 3) ? (hyNorm * Math.PI * 0.82 + hxInit * 0.22) : (hxInit * Math.PI * 0.90))
                                 + sSign * l3T * 1.55 * evoFreq + rowIdx * 0.36
                        sortZ = Math.cos(sAng)
                    } else if (l3Mode === 4 || l3Mode === 9 || l3Mode === 0 || l3Mode === 2 || l3Mode === 3 || l3Mode === 5 || l3Mode === 6 || l3Mode === 10) {
                        var yawEst = (l3Mode === 9)
                            ? (l3T * 1.28 * evoFreq * ((cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0))
                            : Math.cos(l3T * 0.78 * evoFreq + rowIdx * 1.1) * 0.95
                        sortZ = -hxInit * Math.sin(yawEst)
                    }
                    charIndices.push({ ci: ciInit, z: sortZ })
                }
                if (l3Mode === 7 || l3Mode === 4 || l3Mode === 9 || l3Mode === 0 || l3Mode === 2 || l3Mode === 3 || l3Mode === 5 || l3Mode === 6 || l3Mode === 10) {
                    charIndices.sort(function(a, b) { return a.z - b.z })
                }

                for (var cOrd = 0; cOrd < charIndices.length; cOrd++) {
                    var ci = charIndices[cOrd].ci
                    var ch = str.charAt(ci)
                    if (ch === " ") continue
                    var hxNorm = (nCh <= 1) ? 0.0 : ((ci / (nCh - 1)) * 2.0 - 1.0)
                    var bValCh = state.smoothBands[((ci * 5 + rowIdx * 11) & 63)] || 0.0

                    // Cohesive architectural baseline: zero childish per-letter bouncing; whole words lock and glide together
                    var cpx = rowLineCenterX + (ci - (nCh - 1) * 0.5) * charStep
                    var cpy = rowLineCenterY
                    var beatPop = 1.0 + state.beatPulse * 0.14 + state.bassSmooth * 0.10
                    var sx = beatPop
                    var sy = beatPop
                    var rot = 0.0
                    var cylDepthAlpha = 1.0

                    if (l3Mode === 0) {
                        // Mode 0: 3D Tectonic Monolith Split & Lock — magnified 3D perspective swoop & depth travel
                        var splitPhase = Math.sin(l3T * 1.45 * evoFreq + rowIdx * 1.35)
                        var splitDeadzone = Math.max(0.0, Math.abs(splitPhase) - 0.25) * (splitPhase >= 0.0 ? 1.0 : -1.0)
                        var faultShiftX = splitDeadzone * rowHalfW * 0.42 * warpIntensity
                        var monolithPitch = Math.sin(l3T * 0.82 * evoFreq) * 0.34 * warpIntensity
                        var monolithYaw = Math.sin(l3T * 0.72 * evoFreq + rowIdx * 0.9) * 0.82 * warpIntensity
                        var zMonolith = zSurgeGlobal * 0.85 + (rowIdx - (displayLines.length - 1) * 0.5) * 0.24 * state.bassSmooth
                        var projM0 = project3DPoint(
                            hxNorm * 0.96 + (faultShiftX / Math.max(1.0, rowHalfW)) * 0.32,
                            hyNorm * 0.58,
                            zMonolith,
                            monolithPitch, monolithYaw, 0.0,
                            cx, cy, Math.max(w * 0.34, rowHalfW), 1.75
                        )
                        var projM0L = project3DPoint(-0.5, hyNorm * 0.58, zMonolith, monolithPitch, monolithYaw, 0.0, cx, cy, Math.max(w * 0.34, rowHalfW), 1.75)
                        var projM0R = project3DPoint( 0.5, hyNorm * 0.58, zMonolith, monolithPitch, monolithYaw, 0.0, cx, cy, Math.max(w * 0.34, rowHalfW), 1.75)
                        cpx = projM0.x
                        cpy = projM0.y
                        rot = Math.atan2(projM0R.y - projM0L.y, projM0R.x - projM0L.x)
                        sx = clamp(projM0.persp * 1.15 * beatPop, 0.28, 2.45)
                        sy = sx
                        cylDepthAlpha = clamp(0.38 + 0.62 * clamp((projM0.z + 0.9) / 1.8, 0.0, 1.0), 0.32, 1.0)
                    } else if (l3Mode === 1) {
                        // Mode 1: Industrial Step-Sequencer Matrix — quantized 16th-note architectural tracking + 3D Towards/Away depth surge
                        var stepQuant = Math.round(Math.sin(l3T * 2.2 * evoFreq + rowIdx * 1.57) * 2.0) * 0.5
                        var zStep1 = 1.0 + zSurgeGlobal * 0.65
                        var seqTrack = (1.0 + (state.bassSmooth * 0.24 + state.beatPulse * 0.18) * warpIntensity) * zStep1
                        cpx = cx + stepQuant * rowFontPx * 0.85 * warpIntensity + (ci - (nCh - 1) * 0.5) * charStep * seqTrack
                        cpy = cy + (baseRowY - cy) * zStep1
                        sx = clamp(beatPop * zStep1 + state.beatPulse * 0.16, 0.38, 2.25)
                        sy = sx
                    } else if (l3Mode === 2) {
                        // Mode 2: Relativistic 3D Orbital Halo — words mounted on a tilted 3D circular halo ring swooping towards/away from the viewer
                        var haloSign = (tracerDir >= 0 ? 1.0 : -1.0) * (rowIdx % 2 === 0 ? 1.0 : -1.0)
                        var haloAng = hxNorm * (Math.PI * 0.78) + Math.sin(l3T * 0.95 * evoFreq + rowIdx) * 0.72 * haloSign
                        var haloRad = 1.06 + state.bassSmooth * 0.20 * warpIntensity
                        var haloPitch = 0.42 + Math.sin(l3T * 0.62) * 0.24
                        var haloRoll = Math.cos(l3T * 0.54 * evoFreq) * 0.26 * haloSign
                        var projH2 = project3DPoint(
                            Math.sin(haloAng) * haloRad,
                            hyNorm * 0.62,
                            Math.cos(haloAng) * haloRad * 0.96 + zSurgeGlobal * 0.45,
                            haloPitch, 0.0, haloRoll,
                            cx, cy, Math.max(w * 0.34, rowHalfW), 1.72
                        )
                        var projH2Next = project3DPoint(
                            Math.sin(haloAng + 0.06) * haloRad,
                            hyNorm * 0.62,
                            Math.cos(haloAng + 0.06) * haloRad * 0.96 + zSurgeGlobal * 0.45,
                            haloPitch, 0.0, haloRoll,
                            cx, cy, Math.max(w * 0.34, rowHalfW), 1.72
                        )
                        cpx = projH2.x
                        cpy = projH2.y
                        rot = Math.atan2(projH2Next.y - projH2.y, projH2Next.x - projH2.x)
                        sx = clamp(projH2.persp * 1.18 * beatPop, 0.26, 2.55)
                        sy = sx
                        cylDepthAlpha = clamp(0.35 + 0.65 * Math.cos(haloAng * 0.75), 0.28, 1.0)
                    } else if (l3Mode === 3) {
                        // Mode 3: Opposing Counter-Shear 3D Monoliths — rows glide & yaw in opposing 3D planes so one side swoops close
                        var shearDir3 = (rowIdx & 1) ? -1.0 : 1.0
                        var shearPhase3 = Math.sin(l3T * 1.45 * evoFreq + rowIdx * 1.4)
                        var shearYaw3 = shearDir3 * shearPhase3 * 0.78 * warpIntensity
                        var zShear3 = zSurgeGlobal * 0.72 * shearDir3
                        var scale3 = Math.max(w * 0.35, rowHalfW)
                        var projS3 = project3DPoint(hxNorm * 0.95 + shearDir3 * shearPhase3 * 0.22, hyNorm * 0.60, zShear3, 0.16 * shearPhase3, shearYaw3, 0.0, cx, cy, scale3, 1.75)
                        var projS3L = project3DPoint(-0.5, hyNorm * 0.60, zShear3, 0.16 * shearPhase3, shearYaw3, 0.0, cx, cy, scale3, 1.75)
                        var projS3R = project3DPoint( 0.5, hyNorm * 0.60, zShear3, 0.16 * shearPhase3, shearYaw3, 0.0, cx, cy, scale3, 1.75)
                        cpx = projS3.x
                        cpy = projS3.y
                        rot = Math.atan2(projS3R.y - projS3L.y, projS3R.x - projS3L.x)
                        sx = clamp(projS3.persp * 1.15 * beatPop, 0.28, 2.45)
                        sy = sx
                        cylDepthAlpha = clamp(0.38 + 0.62 * clamp((projS3.z + 0.9) / 1.8, 0.0, 1.0), 0.32, 1.0)
                    } else if (l3Mode === 4) {
                        // Mode 4 (UI #5: 3D Gimbal Gyro): Wide-angle 3D perspective swoop — one side of the text swoops huge towards the viewer while the other stretches far into the distance!
                        var gimRx = Math.sin(l3T * 0.88 * evoFreq + rowIdx * 0.9) * 0.48 * warpIntensity
                        var gimSweep = Math.cos(l3T * 0.74 * evoFreq + rowIdx * 1.1)
                        var gimSign = gimSweep >= 0.0 ? 1.0 : -1.0
                        // Ensure strong non-zero 3D yaw angle so one wing always swoops close to the camera while the opposite wing stretches into deep Z
                        var gimRy = gimSign * (0.42 + 0.62 * Math.abs(gimSweep)) * clamp(warpIntensity, 0.55, 1.65)
                        var gimRz = Math.sin(l3T * 0.52 * evoFreq + rowIdx * 0.7) * 0.22 * warpIntensity
                        var zGim4 = zSurgeGlobal * 0.58 - hxNorm * Math.sin(gimRy) * 0.28
                        var gimScale = Math.max(w * 0.36, rowHalfW)
                        var gimFov = 1.58
                        var projG4 = project3DPoint(hxNorm * 0.98, hyNorm * 0.62, zGim4, gimRx, gimRy, gimRz, cx, cy, gimScale, gimFov)
                        var projG4L = project3DPoint(-0.5, hyNorm * 0.62, zGim4, gimRx, gimRy, gimRz, cx, cy, gimScale, gimFov)
                        var projG4R = project3DPoint( 0.5, hyNorm * 0.62, zGim4, gimRx, gimRy, gimRz, cx, cy, gimScale, gimFov)
                        cpx = projG4.x
                        cpy = projG4.y
                        rot = Math.atan2(projG4R.y - projG4L.y, projG4R.x - projG4L.x)
                        sx = clamp(projG4.persp * 1.24 * beatPop, 0.24, 2.75)
                        sy = sx
                        cylDepthAlpha = clamp(0.32 + 0.68 * clamp((projG4.z + 1.0) / 1.9, 0.0, 1.0), 0.26, 1.0)
                    } else if (l3Mode === 5) {
                        // Mode 5 (UI #6 / index 5: Laser Scanner & 3D Swoop): Optical magnification wave + 3D perspective wing swoop towards the viewer
                        var scanPos = Math.sin(l3T * 1.65 * evoFreq + rowIdx * 0.8)
                        var distScan = Math.abs(hxNorm - scanPos)
                        var scanEnv = Math.exp(-distScan * distScan * 5.2) * warpIntensity
                        var swoopYaw5 = (scanPos >= 0.0 ? 1.0 : -1.0) * (0.38 + 0.54 * Math.abs(scanPos)) * clamp(warpIntensity, 0.55, 1.60)
                        var zSwoop5 = zSurgeGlobal * 0.52 + scanEnv * 0.34
                        var scale5 = Math.max(w * 0.36, rowHalfW)
                        var proj5 = project3DPoint(hxNorm * 0.96, hyNorm * 0.60, zSwoop5, Math.sin(l3T * 0.72) * 0.24, swoopYaw5, 0.0, cx, cy, scale5, 1.62)
                        var proj5L = project3DPoint(-0.5, hyNorm * 0.60, zSwoop5, Math.sin(l3T * 0.72) * 0.24, swoopYaw5, 0.0, cx, cy, scale5, 1.62)
                        var proj5R = project3DPoint( 0.5, hyNorm * 0.60, zSwoop5, Math.sin(l3T * 0.72) * 0.24, swoopYaw5, 0.0, cx, cy, scale5, 1.62)
                        cpx = proj5.x
                        cpy = proj5.y
                        rot = Math.atan2(proj5R.y - proj5L.y, proj5R.x - proj5L.x)
                        sx = clamp((proj5.persp * 1.18 + scanEnv * 0.42) * beatPop, 0.25, 2.70)
                        sy = sx
                        cylDepthAlpha = clamp(0.34 + 0.66 * clamp((proj5.z + 1.0) / 1.9, 0.0, 1.0), 0.28, 1.0)
                    } else if (l3Mode === 6) {
                        // Mode 6: 3D Architectural Torsion Ribbon — deep 3D helical ribbon twist & perspective swoop
                        var twistAng6 = hxNorm * 1.05 * warpIntensity + Math.sin(l3T * 1.4 * evoFreq + rowIdx) * 0.65
                        var ribRad6 = 0.42 * warpIntensity
                        var yaw6 = Math.sin(l3T * 0.65 + rowIdx * 0.8) * 0.68 * warpIntensity
                        var projR6 = project3DPoint(
                            hxNorm * 0.96,
                            hyNorm * 0.60 + Math.sin(twistAng6) * ribRad6,
                            Math.cos(twistAng6) * ribRad6 + zSurgeGlobal * 0.48,
                            0.28, yaw6, 0.0,
                            cx, cy, Math.max(w * 0.35, rowHalfW), 1.68
                        )
                        var projR6Next = project3DPoint(
                            (hxNorm + 0.08) * 0.96,
                            hyNorm * 0.60 + Math.sin(twistAng6 + 0.07) * ribRad6,
                            Math.cos(twistAng6 + 0.07) * ribRad6 + zSurgeGlobal * 0.48,
                            0.28, yaw6, 0.0,
                            cx, cy, Math.max(w * 0.35, rowHalfW), 1.68
                        )
                        cpx = projR6.x
                        cpy = projR6.y
                        rot = Math.atan2(projR6Next.y - projR6.y, projR6Next.x - projR6.x)
                        sx = clamp(projR6.persp * 1.20 * beatPop, 0.26, 2.55)
                        sy = sx
                        cylDepthAlpha = clamp(0.35 + 0.65 * clamp((projR6.z + 0.9) / 1.8, 0.0, 1.0), 0.28, 1.0)
                    } else if (l3Mode === 7) {
                        // Mode 7: True 360° Revolving 3D Cylinder Banner (0: L→R, 1: R→L, 2: U→D, 3: D→U, 4: 360° Spin CW, 5: 360° Spin CCW)
                        var cylR = 1.12 + state.bassSmooth * 0.24 * warpIntensity
                        var cylProjScale = Math.max(w * 0.34, rowHalfW)
                        var cylFov = 1.85
                        if (cylDir < 2) {
                            var hSign = (cylDir === 1) ? -1.0 : 1.0
                            var wordOrbitAngle = hSign * l3T * 1.68 * evoFreq + rowIdx * 0.38
                            var cylAng = hxNorm * (Math.PI * 0.90) + wordOrbitAngle
                            var cosA = Math.cos(cylAng), sinA = Math.sin(cylAng)
                            var camPitch = -0.44 - Math.sin(l3T * 0.55) * 0.14
                            var cylRoll = Math.sin(l3T * 0.72 * evoFreq) * 0.22 * hSign
                            var yCyl = hyNorm * 0.58
                            var projC = project3DPoint(sinA * cylR, yCyl, cosA * cylR * 0.95, camPitch, 0.0, cylRoll, cx, cy, cylProjScale, cylFov)
                            var projPrev = project3DPoint(Math.sin(cylAng - 0.09) * cylR, yCyl, Math.cos(cylAng - 0.09) * cylR * 0.95, camPitch, 0.0, cylRoll, cx, cy, cylProjScale, cylFov)
                            var projNext = project3DPoint(Math.sin(cylAng + 0.09) * cylR, yCyl, Math.cos(cylAng + 0.09) * cylR * 0.95, camPitch, 0.0, cylRoll, cx, cy, cylProjScale, cylFov)
                            cpx = projC.x
                            cpy = projC.y
                            var dX = projNext.x - projPrev.x
                            var dY = projNext.y - projPrev.y
                            rot = Math.atan2(dY, Math.abs(dX) + 0.001) * (cosA >= 0.0 ? 1.0 : -1.0)
                            var magSX = clamp(Math.max(0.20, Math.abs(cosA)) * projC.persp * 1.28 * beatPop, 0.20, 2.55)
                            sx = (cosA >= 0.0 ? 1.0 : -1.0) * magSX
                            sy = clamp(projC.persp * 1.24 * beatPop, 0.28, 2.55)
                            cylDepthAlpha = 0.24 + 0.76 * (0.5 + 0.5 * cosA)
                        } else if (cylDir < 4) {
                            var vSign = (cylDir === 3) ? -1.0 : 1.0
                            var drumOrbitAngle = vSign * l3T * 1.68 * evoFreq
                            var drumAng = hyNorm * (Math.PI * 0.82) + drumOrbitAngle
                            var cosD = Math.cos(drumAng), sinD = Math.sin(drumAng)
                            var camYaw = 0.44 + Math.cos(l3T * 0.52) * 0.14
                            var drumRoll = Math.cos(l3T * 0.65 * evoFreq) * 0.20 * vSign
                            var projD = project3DPoint(hxNorm * 0.94, sinD * cylR * 0.72, cosD * cylR * 0.95, 0.0, camYaw, drumRoll, cx, cy, cylProjScale, cylFov)
                            cpx = projD.x
                            cpy = projD.y
                            rot = drumRoll
                            sx = clamp(projD.persp * 1.24 * beatPop, 0.28, 2.55)
                            var magSY = clamp(Math.max(0.20, Math.abs(cosD)) * projD.persp * 1.28 * beatPop, 0.20, 2.55)
                            sy = (cosD >= 0.0 ? 1.0 : -1.0) * magSY
                            cylDepthAlpha = 0.24 + 0.76 * (0.5 + 0.5 * cosD)
                        } else {
                            var spinSign7 = (cylDir === 5) ? -1.0 : 1.0
                            var orbit7 = spinSign7 * l3T * 1.68 * evoFreq + rowIdx * 0.34
                            var cylAng7 = hxNorm * (Math.PI * 0.88) + orbit7
                            var cos7 = Math.cos(cylAng7), sin7 = Math.sin(cylAng7)
                            var fullSpin7 = l3T * 1.35 * evoFreq * spinSign7
                            var gyroYaw7 = l3T * 1.05 * evoFreq * spinSign7
                            var gyroPitch7 = -0.42 + Math.sin(l3T * 0.65 * evoFreq) * 0.42
                            var projS7 = project3DPoint(sin7 * cylR, hyNorm * 0.58, cos7 * cylR * 0.95, gyroPitch7, gyroYaw7, fullSpin7, cx, cy, cylProjScale, cylFov)
                            var projL7 = project3DPoint(Math.sin(cylAng7 - 0.08) * cylR, hyNorm * 0.58, Math.cos(cylAng7 - 0.08) * cylR * 0.95, gyroPitch7, gyroYaw7, fullSpin7, cx, cy, cylProjScale, cylFov)
                            var projR7 = project3DPoint(Math.sin(cylAng7 + 0.08) * cylR, hyNorm * 0.58, Math.cos(cylAng7 + 0.08) * cylR * 0.95, gyroPitch7, gyroYaw7, fullSpin7, cx, cy, cylProjScale, cylFov)
                            cpx = projS7.x
                            cpy = projS7.y
                            rot = Math.atan2(projR7.y - projL7.y, projR7.x - projL7.x)
                            sx = clamp(Math.max(0.22, Math.abs(cos7)) * projS7.persp * 1.26 * beatPop, 0.22, 2.55)
                            sy = clamp(projS7.persp * 1.22 * beatPop, 0.28, 2.55)
                            cylDepthAlpha = clamp(0.26 + 0.74 * ((projS7.z / Math.max(0.5, cylR)) * 0.5 + 0.5), 0.22, 1.0)
                        }
                    } else if (l3Mode === 8) {
                        // Mode 8: Pneumatic Hydraulic 3D Tracking Press — cohesive whole-word tracking + Towards/Away depth surge
                        var accB = Math.sin(l3T * 2.2 * evoFreq + rowIdx * 0.9) * (0.38 + state.bassSmooth * 0.52) * warpIntensity
                        var zPress8 = clamp(1.0 + zSurgeGlobal * 0.72 + accB * 0.35, 0.42, 2.25)
                        var track8 = clamp((1.0 + accB * 0.55) * zPress8, 0.45, 2.20)
                        sx = clamp(beatPop * zPress8 * (1.0 + accB * 0.24), 0.35, 2.45)
                        sy = clamp(beatPop * zPress8 * (1.0 - accB * 0.14), 0.35, 2.35)
                        cpx = rowLineCenterX + (ci - (nCh - 1) * 0.5) * charStep * track8
                        cpy = cy + (rowLineCenterY - cy) * zPress8
                        rot = 0.0
                    } else if (l3Mode === 9) {
                        // Mode 9 (UI #10: 3D Monolith Crawl): Dramatic wide-angle 3D perspective swoop — one side of the text swoops huge towards the viewer while the other stretches far out into the distance!
                        var dirSign9 = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                        var spinYaw9 = l3T * 1.28 * evoFreq * dirSign9 + rowIdx * 0.45
                        var spinPitch9 = Math.sin(l3T * 0.72) * 0.55 + ((cylDir === 2 || cylDir === 3) ? l3T * 1.15 * evoFreq * dirSign9 : 0.0)
                        var spinRoll9 = l3T * 0.78 * evoFreq * dirSign9
                        var zCrawl9 = zSurgeGlobal * 0.58 - hxNorm * Math.sin(spinYaw9) * 0.32
                        var scale9 = Math.max(w * 0.38, rowHalfW)
                        var fov9 = 1.55
                        var projP = project3DPoint(hxNorm * 1.02, hyNorm * 0.68, zCrawl9, spinPitch9, spinYaw9, spinRoll9, cx, cy, scale9, fov9)
                        var projL9 = project3DPoint(-0.5, hyNorm * 0.68, zCrawl9, spinPitch9, spinYaw9, spinRoll9, cx, cy, scale9, fov9)
                        var projR9 = project3DPoint(0.5, hyNorm * 0.68, zCrawl9, spinPitch9, spinYaw9, spinRoll9, cx, cy, scale9, fov9)
                        var projectedWordAngle9 = Math.atan2(projR9.y - projL9.y, projR9.x - projL9.x)
                        cpx = projP.x
                        cpy = projP.y
                        rot = projectedWordAngle9
                        sx = clamp(projP.persp * 1.26 * beatPop, 0.22, 2.80)
                        sy = sx
                        cylDepthAlpha = clamp(0.30 + 0.70 * clamp((projP.z + 1.05) / 2.0, 0.0, 1.0), 0.24, 1.0)
                    } else if (l3Mode === 10) {
                        // Mode 10 (UI #11 / index 10: Anamorphic Chromatic Horizon & 3D Swoop): One side swoops towards the viewer while the other stretches out into the distance above its chromatic mirror
                        var chrOff = isEchoT ? ((te % 2 === 1 ? 1.0 : -1.0) * (7.0 + state.bassSmooth * 20.0 + state.beatPulse * 10.0) * warpIntensity) : 0.0
                        var swoopWave10 = Math.sin(l3T * 0.84 * evoFreq + rowIdx * 0.9)
                        var swoopYaw10 = (swoopWave10 >= 0.0 ? 1.0 : -1.0) * (0.36 + 0.58 * Math.abs(swoopWave10)) * clamp(warpIntensity, 0.55, 1.60)
                        var zHoriz10 = zSurgeGlobal * 0.54
                        var scale10 = Math.max(w * 0.36, rowHalfW)
                        var proj10 = project3DPoint(hxNorm * 0.98, hyNorm * 0.55 - 0.16, zHoriz10, 0.18 * swoopWave10, swoopYaw10, 0.0, cx, cy, scale10, 1.60)
                        var proj10L = project3DPoint(-0.5, hyNorm * 0.55 - 0.16, zHoriz10, 0.18 * swoopWave10, swoopYaw10, 0.0, cx, cy, scale10, 1.60)
                        var proj10R = project3DPoint( 0.5, hyNorm * 0.55 - 0.16, zHoriz10, 0.18 * swoopWave10, swoopYaw10, 0.0, cx, cy, scale10, 1.60)
                        cpx = proj10.x + chrOff
                        cpy = proj10.y
                        rot = Math.atan2(proj10R.y - proj10L.y, proj10R.x - proj10L.x)
                        sx = clamp(proj10.persp * 1.22 * beatPop, 0.24, 2.70)
                        sy = sx
                        cylDepthAlpha = clamp(0.32 + 0.68 * clamp((proj10.z + 1.0) / 1.9, 0.0, 1.0), 0.26, 1.0)
                    } else if (l3Mode === 11) {
                        // Mode 11: Optical Gravitational Lens — twin orbiting optical lenses + 3D Towards/Away depth magnification
                        var zLens11 = clamp(1.0 + zSurgeGlobal * 0.55, 0.52, 1.85)
                        var wx = hxNorm, wy = hyNorm, mag = beatPop * zLens11
                        var dxA = wx - lens1X, dyA = (wy - lens1Y) * 0.75
                        var dA = Math.sqrt(dxA * dxA + dyA * dyA)
                        if (dA < lensRad && dA > 0.0001) {
                            var uA = 1.0 - dA / lensRad
                            var bA = uA * uA * (0.58 + state.bassSmooth * 0.62) * warpIntensity
                            wx += (dxA / dA) * bA * 0.28
                            wy += (dyA / dA) * bA * 0.32
                            mag += bA * 1.35
                        }
                        var dxB = wx - lens2X, dyB = (wy - lens2Y) * 0.75
                        var dB = Math.sqrt(dxB * dxB + dyB * dyB)
                        if (dB < lensRad && dB > 0.0001) {
                            var uB = 1.0 - dB / lensRad
                            var bB = uB * uB * (0.52 + state.midSmooth * 0.56) * warpIntensity
                            wx += (dxB / dB) * bB * 0.24
                            wy += (dyB / dB) * bB * 0.28
                            mag += bB * 1.15
                        }
                        cpx = rowLineCenterX + wx * rowHalfW * zLens11
                        cpy = cy + wy * totalTextH * 0.85 * zLens11 + rowSwayY * 0.35
                        sx = clamp(mag, 0.45, 2.55)
                        sy = sx
                    }

                    // Keep each character strictly locked inside its own CRT scanline cell block (0, 0) while allowing full 3D perspective swoop & scaling!
                    if (isAsciiStyle) {
                        sx = (sx < 0 ? -1.0 : 1.0) * clamp(Math.abs(sx), 0.22, 2.45)
                        sy = (sy < 0 ? -1.0 : 1.0) * clamp(Math.abs(sy), 0.22, 2.45)
                    }

                    var palLen = Math.max(1, activeStylePal.length)
                    var hueStep = Math.floor(state.hueShift / 42)
                    var colCh, colAlt, colAcc
                    if (colourMode === 1) {
                        // 1: Line Palette (Global Palette coloured line-by-line with contrast & hue-separation boost)
                        var lineAnchorIdx = (te + hueStep) % palLen
                        var lineIdx = (rowIdx * 2 + te + hueStep) % palLen
                        var lineTriad = deriveDistinctTypographyTriad(activeStylePal, lineIdx, rowIdx, lineAnchorIdx)
                        colCh = lineTriad.colCh
                        colAlt = lineTriad.colAlt
                        colAcc = lineTriad.colAcc
                    } else if (colourMode === 2) {
                        // 2: Duotone Contrast (Ice-white lead line + contrast-boosted global palette rims & sub-lines)
                        var duoAnchorIdx = (te + hueStep) % palLen
                        var duoIdx = (rowIdx * 2 + te + hueStep) % palLen
                        var duoTriad = deriveDistinctTypographyTriad(activeStylePal, duoIdx, rowIdx, duoAnchorIdx)
                        colCh = (rowIdx === 0 && !isEchoT) ? "#F8FAFC" : duoTriad.colCh
                        colAlt = duoTriad.colAlt
                        colAcc = duoTriad.colAcc
                    } else if (colourMode === 3) {
                        // 3: Audio Spectrum (EQ frequency-driven colour per line & harmonic zone)
                        var eqHue = (state.hueShift + rowIdx * 68 + state.bassSmooth * 90) % 360
                        colCh = hslToHex(eqHue, 0.96, clamp(0.58 + state.bassSmooth * 0.18, 0.50, 0.80))
                        colAlt = hslToHex((eqHue + 75) % 360, 0.92, 0.56)
                        colAcc = hslToHex((eqHue + 165) % 360, 0.95, 0.66)
                    } else if (colourMode === 4) {
                        // 4: Prism Wave (Smooth horizontal gradient sweep across each word & tracer echo)
                        var prismFrac = nCh > 1 ? (ci / (nCh - 1)) : 0.0
                        var prismHue = (state.hueShift + prismFrac * 90 + rowIdx * 55 + te * 32 + l3T * 36) % 360
                        colCh = hslToHex(prismHue, 0.96, 0.60)
                        colAlt = hslToHex((prismHue + 90) % 360, 0.92, 0.55)
                        colAcc = hslToHex((prismHue + 180) % 360, 0.95, 0.66)
                    } else if (colourMode === 5) {
                        // 5: Letter Alternate (Vivid per-character alternating palette triad across every letter & CRT cell)
                        var letAnchorIdx = (rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        var letIdx = (ci + rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        var letTriad = deriveDistinctTypographyTriad(activeStylePal, letIdx, (ci + rowIdx) % 4, letAnchorIdx)
                        colCh = letTriad.colCh
                        colAlt = letTriad.colAlt
                        colAcc = letTriad.colAcc
                    } else {
                        // 0: Style Signature (Cohesive per-line architectural lockup colour; multi-colour per-cell in ASCII styles 16..20)
                        var palIdx = ((isAsciiStyle ? ci : 0) + rowIdx * 2 + te + Math.floor(state.hueShift / 40)) % palLen
                        colCh = activeStylePal[palIdx]
                        colAlt = activeStylePal[(palIdx + 2) % palLen]
                        colAcc = activeStylePal[(palIdx + 4) % palLen]
                    }
                    var useSigCols = (colourMode === 0)

                    sx = (sx < 0 ? -1.0 : 1.0) * clamp(Math.abs(sx), 0.20, 2.85)
                    sy = (sy < 0 ? -1.0 : 1.0) * clamp(Math.abs(sy), 0.20, 2.85)
                    cpx = clamp(cpx, w * 0.03, w * 0.97)
                    cpy = clamp(cpy, h * 0.04, h * 0.96)
                    ctx.save()
                    ctx.globalAlpha = clamp(passAlphaT * cylDepthAlpha, 0.06, 1.0)
                    ctx.translate(cpx, cpy)
                    if (rot !== 0.0) ctx.rotate(rot)
                    ctx.scale(sx, sy)
                    var hasStrokeText = (typeof ctx.strokeText === "function")

                    // Universal 3D extruded depth shadow & beat-reactive chromatic ghost on front pass
                    if (!isEchoT && !isAsciiStyle) {
                        var extDX = Math.cos(l3T * 1.4 + rowIdx) * (2.2 + state.bassSmooth * 3.2)
                        var extDY = Math.sin(l3T * 1.4 + rowIdx) * (2.2 + state.bassSmooth * 3.2) + 2.0
                        ctx.fillStyle = "rgba(4, 5, 14, 0.72)"
                        ctx.fillText(ch, extDX, extDY)
                        if (state.beatPulse > 0.18) {
                            ctx.fillStyle = colourWithAlpha(colAcc, 0.34 * state.beatPulse)
                            ctx.fillText(ch, -extDX * 0.85, -extDY * 0.65)
                        }
                    }

                    if (textStyle === 0) {
                        // 0: Cyber Techno — dual-bevel dark + neon laser rim + crisp cyber fill
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(3.5, rowFontPx * 0.20)
                            ctx.strokeStyle = "rgba(4, 6, 14, 0.94)"
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(1.6, rowFontPx * 0.08)
                            ctx.strokeStyle = useSigCols ? ((rowIdx === 0) ? "#00F5FF" : "#FF1493") : colAlt
                            ctx.strokeText(ch, 1.2, -1.2)
                        }
                        ctx.fillStyle = (rowIdx === 0 && (ci === 0 || ci === nCh - 1)) ? (useSigCols ? "#FF1493" : colAcc) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 1) {
                        // 1: Psychedelic Liquid — concentric multi-ring rainbow prism aura halos + solarised fill
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(5.0, rowFontPx * 0.28)
                            ctx.strokeStyle = colourWithAlpha(colAlt, 0.58 + state.bassSmooth * 0.32)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(2.2, rowFontPx * 0.12)
                            ctx.strokeStyle = "rgba(10, 3, 22, 0.88)"
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 2) {
                        // 2: Rave Laser Stencil — wide RGB chromatic anaglyph split + hollow high-voltage neon vector outline
                        var laserSplit = (2.2 + state.bassSmooth * 6.5 + state.beatPulse * 5.0)
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(1.8, rowFontPx * 0.09)
                            ctx.strokeStyle = useSigCols ? "rgba(255, 0, 85, 0.78)" : colourWithAlpha(colAlt, 0.78)
                            ctx.strokeText(ch, -laserSplit, 0)
                            ctx.strokeStyle = useSigCols ? "rgba(0, 255, 204, 0.78)" : colourWithAlpha(colAcc, 0.78)
                            ctx.strokeText(ch, laserSplit, 0)
                        }
                        ctx.fillStyle = "rgba(5, 8, 14, 0.86)"
                        ctx.fillText(ch, 0, 0)
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(2.0, rowFontPx * 0.11)
                            ctx.strokeStyle = colCh
                            ctx.strokeText(ch, 0, 0)
                        }
                    } else if (textStyle === 3) {
                        // 3: Dance Chrome — 3D extruded shadow + neon rim + metallic chrome + specular horizon bar
                        if (!isEchoT) {
                            ctx.fillStyle = "#090418"
                            ctx.fillText(ch, rowFontPx * 0.08, rowFontPx * 0.09)
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(3.0, rowFontPx * 0.16)
                                ctx.strokeStyle = colAlt
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#E8F7FF" : colCh) : colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.88)"
                            ctx.fillRect(-rowFontPx * 0.28, -rowFontPx * 0.07, rowFontPx * 0.56, Math.max(2.0, rowFontPx * 0.08))
                        }
                    } else if (textStyle === 4) {
                        // 4: Club LED Wall — dark SMD LED cabinet matrix cell + high-intensity stage LED bloom
                        if (!isEchoT) {
                            var cellBoxW = charStep * 0.90
                            var cellBoxH = rowFontPx * 1.04
                            ctx.fillStyle = "rgba(4, 9, 18, 0.84)"
                            ctx.fillRect(-cellBoxW * 0.5, -cellBoxH * 0.5, cellBoxW, cellBoxH)
                            ctx.lineWidth = 1.0
                            ctx.strokeStyle = colourWithAlpha(colCh, 0.42)
                            if (typeof ctx.strokeRect === "function") ctx.strokeRect(-cellBoxW * 0.5, -cellBoxH * 0.5, cellBoxW, cellBoxH)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT && state.beatPulse > 0.25) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.70)"
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 5) {
                        // 5 (#6 in UI): Acid Glitch IDM — character-level inverted strobe block accents + sharp glitch typography
                        var isStrobeCell = (!isEchoT && Math.sin(ci * 2.9 + Math.floor(l3T * 12.0)) > 0.62)
                        if (isStrobeCell) {
                            var stW = charStep * 0.94
                            var stH = rowFontPx * 1.06
                            ctx.fillStyle = colCh
                            ctx.fillRect(-stW * 0.5, -stH * 0.5, stW, stH)
                            ctx.fillStyle = "#05060A"
                            ctx.fillText(ch, 0, 0)
                        } else {
                            if (!isEchoT && hasStrokeText) {
                                ctx.lineWidth = Math.max(2.5, rowFontPx * 0.14)
                                ctx.strokeStyle = "rgba(5, 6, 10, 0.92)"
                                ctx.strokeText(ch, 0, 0)
                            }
                            ctx.fillStyle = colCh
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 6) {
                        // 6: Psytrance UV Glow — deep ultraviolet & electric cyan phosphorescent multi-halo bloom
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.5, rowFontPx * 0.26)
                            ctx.strokeStyle = colourWithAlpha(useSigCols ? "#7209B7" : colAcc, 0.72)
                            ctx.strokeText(ch, 0, 0)
                            if (!isEchoT) {
                                ctx.lineWidth = Math.max(2.2, rowFontPx * 0.12)
                                ctx.strokeStyle = useSigCols ? "#00FFFF" : colAlt
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = (rowIdx === 0 && (ci === 0 || ci === nCh - 1)) ? (useSigCols ? "#FFD700" : colAcc) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 7) {
                        // 7: Berlin Brutalist — monumental heavy block cutout / stark industrial stencil
                        if (rowIdx === 0 && !isEchoT && (l3Mode === 1 || l3Mode === 5 || l3Mode === 6 || l3Mode === 8 || l3Mode === 10)) {
                            ctx.fillStyle = "#060609"
                            ctx.fillText(ch, 0, 0)
                        } else {
                            if (!isEchoT && hasStrokeText) {
                                ctx.lineWidth = Math.max(3.5, rowFontPx * 0.18)
                                ctx.strokeStyle = "#060609"
                                ctx.strokeText(ch, 0, 0)
                            }
                            ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#F4F4F6" : "#FF1E38") : colCh
                            ctx.fillText(ch, 0, 0)
                        }
                    } else if (textStyle === 8) {
                        // 8: Holographic Sci-Fi HUD — phase-shifted hologram ghost + cyan/emerald HUD reticle glyph + telemetry tick
                        var holoShift = (1.8 + state.beatPulse * 3.8) * Math.sin(l3T * 9.0 + ci)
                        ctx.fillStyle = useSigCols ? "rgba(0, 180, 216, 0.42)" : colourWithAlpha(colAlt, 0.42)
                        ctx.fillText(ch, holoShift, -1.6)
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(1.8, rowFontPx * 0.09)
                            ctx.strokeStyle = useSigCols ? "#00FFD5" : colAlt
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "#00FFD5" : colAcc
                            ctx.fillRect(-charStep * 0.34, rowFontPx * 0.46, charStep * 0.68, 2.0)
                        }
                    } else if (textStyle === 9) {
                        // 9: Oscilloscope Vector Beam — Tektronix green/cyan phosphor outer bloom + crisp vector stroke + CRT vertex dots
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.2, rowFontPx * 0.22)
                            ctx.strokeStyle = useSigCols ? "rgba(0, 255, 102, 0.34)" : colourWithAlpha(colAlt, 0.38)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(1.5, rowFontPx * 0.08)
                            ctx.strokeStyle = useSigCols ? "#CCFFDD" : colCh
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = "rgba(4, 24, 14, 0.72)"
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "#FFFFFF" : colAcc
                            ctx.fillRect(-1.8, -rowFontPx * 0.42, 3.6, 3.6)
                            ctx.fillRect(-1.8, rowFontPx * 0.38, 3.6, 3.6)
                        }
                    } else if (textStyle === 10) {
                        // 10: 3D Isometric Extrude — 5-step deep isometric block extrusion receding toward audio-reactive vanishing angle
                        var isoDX = (1.6 + state.bassSmooth * 1.4) * Math.cos(l3T * 0.9)
                        var isoDY = (1.6 + state.bassSmooth * 1.4) * Math.sin(l3T * 0.9) + 1.2
                        if (!isEchoT) {
                            var isoCols = useSigCols
                                ? ["#1E0B36", "#5A189A", "#9B5DE5", "#F15BB5"]
                                : [colourWithAlpha(colAcc, 0.45), colourWithAlpha(colAcc, 0.70), colAcc, colAlt]
                            for (var stp = 4; stp >= 1; stp--) {
                                ctx.fillStyle = isoCols[4 - stp]
                                ctx.fillText(ch, isoDX * stp, isoDY * stp)
                            }
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                                ctx.strokeStyle = "#080714"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = useSigCols ? ((rowIdx === 0) ? "#00F5D4" : colCh) : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 11) {
                        // 11: Plasma Arc Tesla — violet/cyan high-voltage corona discharge + white-hot ionised core
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(5.0, rowFontPx * 0.28)
                            ctx.strokeStyle = colourWithAlpha(useSigCols ? "#B5179E" : colAcc, 0.56 + state.beatPulse * 0.34)
                            ctx.strokeText(ch, 0, 0)
                            ctx.lineWidth = Math.max(2.4, rowFontPx * 0.12)
                            ctx.strokeStyle = useSigCols ? "#7DF9FF" : colAlt
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = useSigCols ? "#FFFFFF" : colCh
                        ctx.fillText(ch, 0, 0)
                    } else if (textStyle === 12) {
                        // 12: Y2K Iridescent Mercury — liquid-metal pearlescent triple rim + star specular glint
                        if (!isEchoT && hasStrokeText) {
                            ctx.lineWidth = Math.max(4.6, rowFontPx * 0.24)
                            ctx.strokeStyle = useSigCols ? "#F472B6" : colAcc
                            ctx.strokeText(ch, -1.2, 1.2)
                            ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                            ctx.strokeStyle = useSigCols ? "#67E8F9" : colAlt
                            ctx.strokeText(ch, 1.0, -1.0)
                        }
                        ctx.fillStyle = useSigCols ? "#F8FAFC" : colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT && ((ci + Math.floor(l3T * 4.0)) % 4 === 0)) {
                            var glintR = Math.max(3.5, rowFontPx * 0.18) * (0.7 + state.beatPulse * 0.6)
                            ctx.fillStyle = "#FFFFFF"
                            ctx.fillRect(-glintR, -rowFontPx * 0.34 - 1.0, glintR * 2.0, 2.0)
                            ctx.fillRect(-1.0, -rowFontPx * 0.34 - glintR, 2.0, glintR * 2.0)
                        }
                    } else if (textStyle === 13) {
                        // 13: Demoscene Copperbars — Amiga raster-bar silhouette shadow + crisp copper-lit glyph
                        if (!isEchoT) {
                            ctx.fillStyle = "#080412"
                            ctx.fillText(ch, 2.6, 2.8)
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.8, rowFontPx * 0.15)
                                ctx.strokeStyle = "#120624"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.78)"
                            ctx.fillRect(-charStep * 0.32, -rowFontPx * 0.16, charStep * 0.64, Math.max(2.0, rowFontPx * 0.08))
                        }
                    } else if (textStyle === 14) {
                        // 14: Bioluminescent Mycelium — deep-sea bioluminescent halo + drifting glowing spore nodes
                        if (hasStrokeText) {
                            ctx.lineWidth = Math.max(4.4, rowFontPx * 0.24)
                            ctx.strokeStyle = colourWithAlpha(colAlt, 0.52 + state.midSmooth * 0.34)
                            ctx.strokeText(ch, 0, 0)
                        }
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        if (!isEchoT) {
                            var spX = Math.cos(l3T * 2.7 + ci * 1.9) * charStep * 0.42
                            var spY = Math.sin(l3T * 3.1 + ci * 2.3) * rowFontPx * 0.44
                            ctx.fillStyle = useSigCols ? "#FDE047" : colAcc
                            ctx.fillRect(spX - 2.2, spY - 2.2, 4.4, 4.4)
                        }
                    } else if (textStyle === 15) {
                        // 15: Quantum Matrix Datastream — vertical cascading telemetry ticks + beat-triggered decrypt glyph + phosphor core
                        if (!isEchoT) {
                            ctx.fillStyle = useSigCols ? "rgba(16, 185, 129, 0.34)" : colourWithAlpha(colAlt, 0.36)
                            for (var qk = -2; qk <= 2; qk++) {
                                var qy = ((qk * 0.28 + (l3T * 1.6 + ci * 0.23) % 1.0) - 0.5) * rowFontPx * 1.25
                                ctx.fillRect(-2.0, qy, 4.0, Math.max(2.5, rowFontPx * 0.10))
                            }
                            if (hasStrokeText) {
                                ctx.lineWidth = Math.max(2.6, rowFontPx * 0.14)
                                ctx.strokeStyle = "rgba(2, 22, 16, 0.92)"
                                ctx.strokeText(ch, 0, 0)
                            }
                        }
                        var qGlyph = (!isEchoT && state.beatPulse > 0.55 && ((ci + Math.floor(l3T * 18.0)) % 5 === 0))
                            ? String.fromCharCode(0x30A2 + ((ci * 7 + Math.floor(l3T * 20.0)) % 42))
                            : ch
                        ctx.fillStyle = (qGlyph !== ch) ? (useSigCols ? "#FFD166" : colAcc) : colCh
                        ctx.fillText(qGlyph, 0, 0)
                    } else if (textStyle === 16) {
                        // 16: ASCII Black Block / Multi-Colour Text — Authentic Cool-Retro-Term 7-scanline-row CRT cell (dark CRT glass + glowing horizontal scanline phosphor bars)
                        var crtW16 = charStep * 0.92
                        var crtH16 = rowFontPx * 1.08
                        var fg16 = (useSigCols && !isPaletteShifted) ? "#FF8800" : colCh
                        var core16 = (useSigCols && !isPaletteShifted) ? "#FFE082" : colAcc
                        drawCrtScanlineCell(ctx, ch, crtW16, crtH16, fg16, core16, "#0A0500", 0, isEchoT, state.beatPulse)
                    } else if (textStyle === 17) {
                        // 17: ASCII Vivid Back / Dark Text — Reverse-video 7-scanline-row CRT block where horizontal phosphor bars frame the recessed dark character
                        var crtW17 = charStep * 0.92
                        var crtH17 = rowFontPx * 1.08
                        var fg17 = (useSigCols && !isPaletteShifted) ? "#FF8800" : colCh
                        var core17 = (useSigCols && !isPaletteShifted) ? "#FFE082" : colAcc
                        drawCrtScanlineCell(ctx, ch, crtW17, crtH17, fg17, core17, "#050608", 2, isEchoT, state.beatPulse)
                    } else if (textStyle === 18) {
                        // 18: ASCII Transparent Back / Multi-Colour Text — Pure floating 7-row horizontal CRT phosphor scanline bars (100% transparent background)
                        var crtW18 = charStep * 0.92
                        var crtH18 = rowFontPx * 1.08
                        var fg18 = (useSigCols && !isPaletteShifted) ? "#00FF99" : colCh
                        var core18 = (useSigCols && !isPaletteShifted) ? "#B8FFF4" : colAcc
                        drawCrtScanlineCell(ctx, ch, crtW18, crtH18, fg18, core18, null, 1, isEchoT, state.beatPulse)
                    } else if (textStyle === 19) {
                        // 19: ASCII Coloured Back / Transparent Text — Reverse-video knockout 7-scanline-row CRT block (complement horizontal scanline bars, transparent glyph cutout)
                        var crtW19 = charStep * 0.92
                        var crtH19 = rowFontPx * 1.08
                        drawCrtScanlineCell(ctx, ch, crtW19, crtH19, colCh, colAlt, null, 3, isEchoT, state.beatPulse)
                    } else {
                        // 20: ASCII Cell Matrix — Authentic Cool-Retro-Term (`crt_ref.png`) 7-scanline-row horizontal phosphor bar matrix!
                        // Mixes normal lit 7-scanline-bar CRT characters (`crtMode = 0`) and reverse-video 7-scanline-bar CRT blocks (`crtMode = 2` / `3`)
                        // across Classic P3 Amber (#FF8800), IBM P1 Green (#33FF33), VT100 P4 White (#BCE8FF), and active palette colours!
                        var cellMixW = charStep * 0.92
                        var cellMixH = rowFontPx * 1.08
                        var crtSchemeIdx = (ci + rowIdx * 2 + Math.floor(state.hueShift / 30)) % COOL_RETRO_TERM_PHOSPHORS.length
                        var crtScheme = COOL_RETRO_TERM_PHOSPHORS[crtSchemeIdx] || COOL_RETRO_TERM_PHOSPHORS[0]
                        var useVividCellTriad = (colourMode !== 0 || isPaletteShifted)
                        var crtFg = useVividCellTriad ? (((ci + rowIdx) & 1) === 0 ? colCh : crtScheme.fg) : crtScheme.fg
                        var crtCore = useVividCellTriad ? (((ci + rowIdx) % 3 === 0) ? colAlt : crtScheme.core) : crtScheme.core
                        var crtBg = crtScheme.bg
                        var cellKind = (ch === "█") ? 0 : ((ci + rowIdx * 2 + Math.floor(l3T * 2.5)) & 3)
                        var cellCrtMode = (cellKind === 1) ? 2 : ((cellKind === 3) ? 3 : 0)
                        drawCrtScanlineCell(ctx, ch, cellMixW, cellMixH, crtFg, crtCore, crtBg, cellCrtMode, isEchoT, state.beatPulse)
                    }
                    ctx.restore()

                    if (l3Mode === 10 && !isEchoT) {
                        ctx.save()
                        var reflRip = Math.sin(ci * 0.7 + l3T * 5.2) * (4.0 + state.bassSmooth * 10.0) * warpIntensity
                        ctx.translate(cpx + reflRip, cy + totalTextH * 0.52 + (displayLines.length - 1 - rowIdx) * lineSpanH * 0.52)
                        ctx.scale(sx, -sy * 0.55)
                        ctx.globalAlpha = passAlphaT * 0.38
                        ctx.fillStyle = colCh
                        ctx.fillText(ch, 0, 0)
                        ctx.restore()
                    }
                }
            }
            ctx.restore()
        }
        ctx.restore()
        return
    }

    if ((!effectiveLines || effectiveLines.length === 0) && isWordsSource && textLines.length > 0) {
        var synthFill = isBlockGlyph ? "█▓▒░" : "⣿⣷⣯⣟"
        var synthRows = []
        for (var sri = 0; sri < textLines.length; sri++) {
            var sRow = textLines[sri] || ""
            var outRow = ""
            for (var sci = 0; sci < sRow.length; sci++) {
                outRow += (sRow.charAt(sci) === " ") ? "  " : (synthFill.charAt((sci + sri) % synthFill.length) + synthFill.charAt((sci + sri + 1) % synthFill.length))
            }
            synthRows.push(outRow)
            synthRows.push(outRow)
        }
        effectiveLines = synthRows
    }

    if (!effectiveLines || effectiveLines.length === 0) return

    var glyphStyleKey = (isWordsSource ? "words:" : "art:") + (isBlockGlyph ? "block" : "braille")
    rebuildArtCells(state, effectiveLines, glyphStyleKey)
    var cells = state.artCells
    if (!cells || cells.length === 0) return

    var cols = Math.max(16, state.artCols || 60)
    var rows = Math.max(6, state.artRows || 20)

    // For Album Cover Art (!isWordsSource), preserve true 1:1 square album-cover proportions so faces, icons & prisms are immediately recognisable
    var effCellScale = Math.min(scale, 1.15)
    var maxBoxW = w * 0.74 * effCellScale
    var maxBoxH = h * 0.62 * effCellScale
    var cellW = Math.min(maxBoxW / cols, (maxBoxH / rows) * 0.72)
    var cellH = Math.min(maxBoxH / rows, cellW * 1.65)
    var boxW = Math.min(maxBoxW, cellW * cols)
    var boxH = Math.min(maxBoxH, cellH * rows)
    if (!isWordsSource) {
        var sqSide = Math.min(w * 0.62, h * 0.70) * effCellScale
        cellW = sqSide / cols
        cellH = sqSide / rows
        boxW = sqSide
        boxH = sqSide
    }
    var halfW = boxW * 0.5
    var halfH = boxH * 0.5

    var tileW = Math.max(2.2, cellW * (!isWordsSource ? 0.96 : 0.88))
    var tileH = Math.max(2.2, cellH * (!isWordsSource ? 0.96 : 0.88))

    // If Mode 5 (Omarchy TTE Keyframe Evolution) and ttfxFrames are available, modulate positions/visibility from current TTE frame
    var activeTtfxFrame = null
    if (l3Mode === 5 && ttfxFrames && ttfxFrames.length > 0) {
        var fPos = (state.t * 3.2 + state.bassSmooth * 1.8) % (ttfxFrames.length * 2)
        var fIdx = Math.floor(fPos >= ttfxFrames.length ? (ttfxFrames.length * 2 - 1 - fPos) : fPos)
        activeTtfxFrame = ttfxFrames[clamp(fIdx, 0, ttfxFrames.length - 1)]
    }

    var numBuckets = isWordsSource ? 6 : 8

    for (var e = l3Tracers - 1; e >= 0; e--) {
        var isEcho = (e > 0)
        var u = l3Tracers > 1 ? (e / (l3Tracers - 1)) : 0.0
        var zScale = (tracerDir >= 0)
            ? (1.0 + Math.pow(u, 1.12) * 1.48 * Math.min(tracerSpeed, 1.8))
            : (1.0 / (1.0 + u * 0.96 * Math.min(tracerSpeed, 1.8)))
        var tx = endPt.dx * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var ty = endPt.dy * u * 0.42 * (tracerDir >= 0 ? -1.0 : 1.0)
        var passAlpha = isEcho ? (Math.pow(1.0 - u * 0.82, 1.4) * 0.36) : (0.84 + state.bassSmooth * 0.16)
        var cellStride = isEcho ? (e >= 2 ? numBuckets * 3 : numBuckets * 2) : numBuckets

        ctx.save()
        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = clamp(passAlpha * l3Opac, 0.03, 1.0)
        if (isEcho) {
            ctx.translate(cx + tx, cy + ty)
            ctx.scale(zScale, zScale)
            ctx.translate(-cx, -cy)
        }

        var lens1X = Math.sin(l3T * 0.88) * 0.66
        var lens1Y = Math.cos(l3T * 1.15) * 0.30
        var lens2X = Math.cos(l3T * 0.64) * 0.66
        var lens2Y = Math.sin(l3T * 0.92) * 0.30
        var lensRad = 0.52 + state.bassSmooth * 0.22

        var artStyle = (isBlockGlyph && cfg.layer3TextStyle === undefined) ? 1 : textStyle
        var isMathArt = (!isWordsSource)
        var coverClusters = (state.artClusters && state.artClusters.length > 0) ? state.artClusters : null
        var lightYaw = l3T * 1.35
        var lightX = Math.cos(lightYaw) * 0.72
        var lightY = Math.sin(lightYaw * 0.8) * 0.58
        var lightZ = 0.55 + state.bassSmooth * 0.35

        // Dedicated Macro-Tessellation Pass for Styles #4 (Quadtree Mondrian, st=3), #5 (Delaunay Shards, st=4), and #18 (Isometric Cityscape, st=17)
        if (isMathArt && !isEcho && (artStyle === 3 || artStyle === 4 || artStyle === 17)) {
            var mColsQ = Math.max(16, state.artCols || 48)
            var mRowsQ = Math.max(10, state.artRows || 28)
            if ((artStyle === 3 || artStyle === 17) && state.artQuadtree && state.artQuadtree.length > 0) {
                var qtList = state.artQuadtree
                var qCamPitch = Math.cos(l3T * 0.52 * evoFreq) * 0.28 + (artStyle === 17 ? -0.36 : 0.0)
                var qCamYaw = Math.sin(l3T * 0.68 * evoFreq) * 0.62
                for (var qi = 0; qi < qtList.length; qi++) {
                    var qb = qtList[qi]
                    if (!qb || qb.length < 10) continue
                    var qSal = (qb[8] || 50) / 100.0
                    if (qSal < 0.20 && (qi % 3 !== 0)) continue
                    var qnx = ((qb[0] + qb[2] * 0.5) / mColsQ) * 2.0 - 1.0
                    var qny = ((qb[1] + qb[3] * 0.5) / mRowsQ) * 2.0 - 1.0
                    var qz = ((qb[7] || 0) / 100.0) * (artStyle === 17 ? (0.75 + state.bassSmooth * 0.55) : 0.42)
                    var qProj = project3DPoint(
                        qnx * 1.04,
                        qny * (halfH / Math.max(1.0, halfW)) * 0.94,
                        qz,
                        qCamPitch, qCamYaw, 0.0,
                        cx, cy, halfW * 1.02, 1.58
                    )
                    var qBw = Math.max(3.0, (qb[2] / mColsQ) * boxW * qProj.persp * 0.92)
                    var qBh = Math.max(3.0, (qb[3] / mRowsQ) * boxH * qProj.persp * 0.92)
                    var qHex = rgbToHex(qb[4], qb[5], qb[6])
                    var qPalCol = activeStylePal[(qb[9] + Math.floor(state.hueShift / 36)) % Math.max(1, activeStylePal.length)]
                    ctx.fillStyle = colourWithAlpha((colourMode <= 1) ? qHex : qPalCol, clamp((0.32 + qSal * 0.54) * l3Opac, 0.08, 0.90))
                    if (artStyle === 17) {
                        var towerH = Math.max(4.0, qSal * 34.0 * (0.6 + state.bassSmooth * 0.7))
                        ctx.fillRect(qProj.x - qBw * 0.45, qProj.y - qBh * 0.45 - towerH, qBw * 0.90, qBh * 0.90 + towerH)
                    } else {
                        ctx.fillRect(qProj.x - qBw * 0.48, qProj.y - qBh * 0.48, qBw * 0.96, qBh * 0.96)
                    }
                    ctx.strokeStyle = colourWithAlpha(qPalCol, clamp(0.55 * l3Opac, 0.10, 0.85))
                    ctx.lineWidth = 1.1
                    if (typeof ctx.strokeRect === "function") {
                        ctx.strokeRect(qProj.x - qBw * 0.48, qProj.y - qBh * 0.48, qBw * 0.96, qBh * 0.96)
                    }
                }
            } else if (artStyle === 4 && state.artShards && state.artShards.length > 0) {
                var shList = state.artShards
                var sCamPitch = Math.cos(l3T * 0.54 * evoFreq) * 0.26
                var sCamYaw = Math.sin(l3T * 0.66 * evoFreq) * 0.64
                for (var si = 0; si < shList.length; si++) {
                    var sh = shList[si]
                    if (!sh || sh.length < 10) continue
                    var sSal = (sh[6] || 50) / 100.0
                    var snx = (sh[0] / Math.max(1, mColsQ - 1)) * 2.0 - 1.0
                    var sny = (sh[1] / Math.max(1, mRowsQ - 1)) * 2.0 - 1.0
                    var szDep = ((sh[5] || 0) / 100.0) * (0.48 + state.beatPulse * 0.42)
                    var sProj = project3DPoint(
                        snx * 1.04,
                        sny * (halfH / Math.max(1.0, halfW)) * 0.94,
                        szDep,
                        sCamPitch, sCamYaw, 0.0,
                        cx, cy, halfW * 1.02, 1.58
                    )
                    var sRad = Math.max(5.0, (sh[8] || 2) * tileW * 0.72 * sProj.persp * (0.85 + state.bassSmooth * 0.25))
                    var sAng = ((sh[9] || 0) * Math.PI) / 180.0 + state.beatPulse * 0.25
                    var sHex = rgbToHex(sh[2], sh[3], sh[4])
                    var sPalCol = activeStylePal[(sh[7] + Math.floor(state.hueShift / 36)) % Math.max(1, activeStylePal.length)]
                    ctx.beginPath()
                    for (var sv = 0; sv < 5; sv++) {
                        var va = sAng + sv * (Math.PI * 2.0 / 5.0) + ((sv & 1) ? 0.18 : -0.14)
                        var vr = sRad * ((sv % 2 === 0) ? 1.08 : 0.78)
                        var vx = sProj.x + Math.cos(va) * vr
                        var vy = sProj.y + Math.sin(va) * vr
                        if (sv === 0) ctx.moveTo(vx, vy)
                        else ctx.lineTo(vx, vy)
                    }
                    ctx.closePath()
                    ctx.fillStyle = colourWithAlpha((colourMode <= 1) ? sHex : sPalCol, clamp((0.36 + sSal * 0.52) * l3Opac, 0.10, 0.88))
                    ctx.fill()
                    ctx.strokeStyle = colourWithAlpha(sPalCol, clamp(0.68 * l3Opac, 0.12, 0.92))
                    ctx.lineWidth = 1.2
                    ctx.stroke()
                }
            }
        }

        for (var b = 0; b < numBuckets; b++) {
            var bHueStep = Math.floor(state.hueShift / 32)
            var bPalLen = Math.max(1, activeStylePal.length)
            var uBucket = b / Math.max(1, numBuckets - 1)
            var bEqVal = state.smoothBands[(b * 8) & 63] || 0.0
            var palColB = activeStylePal[(b * 2 + e + bHueStep) % bPalLen]
            var col = palColB

            // 1. Style-Specific Chromatic Signatures (evaluated first so they are never shadowed by coverClusters)
            if (artStyle === 7 && colourMode === 0) {
                // #8: Thermal Warm-Cool Depth Split — warm crimson/gold foreground to cool cyan/indigo depth, breathing with EQ
                var thermHue = (b < 4) ? (8 + b * 18 + state.bassSmooth * 18) : (184 + (b - 4) * 26 + state.treble * 22)
                col = hslToHex(thermHue % 360, 0.95, clamp(0.48 + (7 - b) * 0.04 + bEqVal * 0.14 + state.beatPulse * 0.08, 0.42, 0.82))
            } else if (artStyle === 10 && colourMode === 0) {
                // #11: Hue-Angle Spiral Vortex — continuous HSV colour wheel rotating with phase & audio
                var wheelHue = (b * (360 / numBuckets) + state.hueShift + l3T * 28 + bEqVal * 45) % 360
                col = hslToHex(wheelHue, clamp(0.88 + state.bassSmooth * 0.12, 0.80, 1.0), clamp(0.54 + bEqVal * 0.18, 0.46, 0.78))
            } else if (artStyle === 14 && colourMode === 0) {
                // #15: Chromatic RGB Prism Split — pure Red / Green / Blue / Cyan / Magenta / Gold prism channels + beat lift
                var rgbPrismHues = [348, 152, 218, 184, 326, 48, 276, 16]
                var pHue14 = (rgbPrismHues[b % rgbPrismHues.length] + Math.sin(l3T * 1.1 + b) * 12) % 360
                col = hslToHex((pHue14 + 360) % 360, 0.96, clamp(0.56 + bEqVal * 0.16 + state.beatPulse * 0.10, 0.48, 0.82))
            } else if (artStyle === 18 && colourMode === 0) {
                // #19: CMYK Rosette Halftone Press — Cyan, Magenta, Yellow, Key highlight + audio pulse
                var cmykCols = ["#00E5FF", "#FF007F", "#FFEA00", "#F8FAFC", "#FF5252", "#B388FF", "#00FF9D", "#FFB300"]
                col = cmykCols[b % cmykCols.length]
            } else if (artStyle === 20 && colourMode === 0) {
                // #21: Holographic Slice Tomography
                var holoHue = (state.hueShift + b * 46 + l3T * 42 + bEqVal * 50) % 360
                var holoSat = clamp(0.78 + (b % 3) * 0.10 + state.midSmooth * 0.10, 0.72, 1.0)
                var holoLit = clamp(0.46 + uBucket * 0.30 + state.beatPulse * 0.08, 0.42, 0.84)
                col = hslToHex(holoHue, holoSat, holoLit)
            } else if (isMathArt && coverClusters && coverClusters.length > 0 && (colourMode === 0 || colourMode === 1)) {
                // 2. Adaptive Cover-Palette Harmonic Synthesis:
                //    Instead of static un-adapted hex strings, extract the K-Means cover cluster HSL,
                //    lift dark/muddy cover colours into vivid luminous contrast, modulate saturation/lightness/hue
                //    with live 64-band EQ + beatPulse + harmonic drift, and cross-pollinate with the active global palette!
                var rawClusterHex = coverClusters[b % coverClusters.length]
                var cRgb = hexToRgb(rawClusterHex)
                var pRgb = hexToRgb(palColB)
                // Cross-blend ratio between extracted album cover cluster and active visualiser palette:
                // - Bucket 5 (Sobel edges) & Bucket 6 (specular peaks) lean more strongly into the vivid palette & beat highlights
                var palMix = (colourMode === 1)
                    ? ((b % 2 === 1) ? 0.72 : 0.38)
                    : ((b >= 5) ? 0.58 : (0.24 + 0.14 * Math.sin(l3T * 0.65 + b)))
                var mixR = Math.round(lerp(cRgb.r, pRgb.r, palMix))
                var mixG = Math.round(lerp(cRgb.g, pRgb.g, palMix))
                var mixB = Math.round(lerp(cRgb.b, pRgb.b, palMix))
                var cHsl = rgbToHsl(mixR, mixG, mixB)
                var adaptHue = (cHsl.h + Math.sin(l3T * 0.82 + b * 1.15) * 18 + state.midSmooth * 24 + e * 16 + 360) % 360
                var adaptSat = clamp(Math.max(0.52, cHsl.s * 1.18) + state.bassSmooth * 0.20 + bEqVal * 0.14, 0.50, 1.0)
                var minLit = (b === 6) ? 0.68 : ((b === 5) ? 0.60 : 0.46)
                var adaptLit = clamp(Math.max(minLit, cHsl.l * 1.12) + bEqVal * 0.16 + state.beatPulse * 0.12 - (isEcho ? 0.06 : 0.0), 0.44, 0.86)
                col = hslToHex(adaptHue, adaptSat, adaptLit)
            } else if (colourMode === 0 || colourMode === 1 || colourMode === 5) {
                var bTriad = deriveDistinctTypographyTriad(activeStylePal, (b * 2 + e + bHueStep) % bPalLen, b % 4, (e + bHueStep) % bPalLen)
                col = (b % 3 === 0) ? bTriad.colCh : ((b % 3 === 1) ? bTriad.colAlt : bTriad.colAcc)
            } else if (colourMode === 2) {
                var bDuo = deriveDistinctTypographyTriad(activeStylePal, (b + e + bHueStep) % bPalLen, b % 4, (e + bHueStep) % bPalLen)
                col = (b === 0 && !isEcho) ? "#F8FAFC" : bDuo.colCh
            } else if (colourMode === 3) {
                var bEqHue = (state.hueShift + b * 48 + bEqVal * 135 + state.bassSmooth * 55) % 360
                col = hslToHex(bEqHue, 0.96, clamp(0.55 + bEqVal * 0.22 + state.beatPulse * 0.08, 0.48, 0.82))
            } else if (colourMode === 4) {
                var bPrismHue = (state.hueShift + b * 36 + e * 30 + l3T * 36) % 360
                col = hslToHex(bPrismHue, 0.96, clamp(0.58 + bEqVal * 0.14, 0.50, 0.78))
            }
            ctx.fillStyle = col
            ctx.beginPath()

            var echoStep = isEcho ? (e >= 2 ? 3 : 2) : 1
            for (var i = 0; i < cells.length; i += echoStep) {
                var p = cells[i]
                if (l3Mode === 1 && p.alive < 0.42) continue

                // Group cells into all 8 buckets (0..4 K-Means clusters, 5 Sobel edges, 6 specular luma peaks, 7 deep iso-contours)
                if (isMathArt && p.clusterId !== undefined) {
                    var cellBucket = p.clusterId % 5
                    if (artStyle === 5) {
                        cellBucket = (p.contourLvl || 0) % numBuckets
                    } else if (artStyle === 7) {
                        cellBucket = clamp(Math.floor((1.0 - (p.thermal || 0.0)) * 3.5), 0, numBuckets - 1)
                    } else if (artStyle === 10) {
                        cellBucket = Math.floor(((p.hue || 0.0) / 360.0) * numBuckets) % numBuckets
                    } else if (p.edgeMag > 0.58) {
                        cellBucket = 5
                    } else if (p.luma > 0.72 && p.salience > 0.48) {
                        cellBucket = 6
                    } else if (p.contourLvl === 1 || p.contourLvl === 6) {
                        cellBucket = 7
                    }
                    if (cellBucket !== b) continue

                    // Model-specific mathematical filtering so each interpretation isolates a distinct structure of the image
                    if (artStyle === 1 && p.salience < 0.36) continue // #2 Subject Salience Isolation: cull background
                    if (artStyle === 2 && p.edgeMag < 0.22 && p.salience < 0.58) continue // #3 Sobel Tangent Flow: contour & high-salience streamlines
                    if (artStyle === 8 && Math.abs(p.dogVal || 0.0) < 0.16 && p.edgeMag < 0.28) continue // #9 DoG Woodcut: ink ridges
                    if (artStyle === 9 && p.salience > 0.62 && p.luma > 0.55) continue // #10 Negative-Space Shadow Inversion
                } else {
                    if ((i % numBuckets) !== b) continue
                }

                var bVal = state.smoothBands[(i * 3) & 63] || 0.0
                var hx = p.homeX !== undefined ? p.homeX : p.x
                var hy = p.homeY !== undefined ? p.homeY : p.y
                var modelZ = 0.0
                var modelDX = 0.0
                var modelDY = 0.0

                if (isMathArt && p.zDepth !== undefined) {
                    if (artStyle === 0) {
                        // #1 Chromatic K-Means 3D Planes: separate the 5 colour clusters into 5 distinct 3D Z-depth planes
                        var planeIdx = (p.clusterId || 0) - 2.0
                        modelZ = -planeIdx * (0.34 + state.bassSmooth * 0.28) + p.zDepth * 0.25
                        modelDX = Math.sin(l3T * 1.2 + (p.clusterId || 0) * 1.4) * 0.06 * (1.0 + state.midSmooth)
                    } else if (artStyle === 1) {
                        // #2 Subject Salience Isolation: foreground subject floats forward in high relief
                        modelZ = (p.salience - 0.35) * (0.95 + state.bassSmooth * 0.45)
                    } else if (artStyle === 2) {
                        // #3 Sobel Tangent Flow: flow displacement along the contour tangent vector
                        var flowSlide = Math.sin(l3T * 2.4 + p.phase) * 0.05 * (0.5 + p.edgeMag)
                        modelDX = Math.cos(p.tangentRad || 0.0) * flowSlide
                        modelDY = Math.sin(p.tangentRad || 0.0) * flowSlide
                        modelZ = p.edgeMag * 0.48
                    } else if (artStyle === 5) {
                        // #6 Topographical Iso-Contours: stepped 3D terrain elevation rings + radar scanner wave
                        var scanBand = ((l3T * 1.8) % 8.0)
                        var bandDist = Math.abs((p.contourLvl || 0) - scanBand)
                        var scanBoost = Math.max(0.0, 1.0 - bandDist * 0.55) * (0.45 + state.beatPulse * 0.45)
                        modelZ = ((p.contourLvl || 0) / 7.0 - 0.5) * 0.85 + scanBoost
                    } else if (artStyle === 7) {
                        // #8 Thermal Warm-Cool Depth Split: warm wavelengths project forward (+Z), cool recede (-Z)
                        modelZ = (p.thermal || 0.0) * (0.72 + state.bassSmooth * 0.38)
                    } else if (artStyle === 9) {
                        // #10 Negative-Space Shadow Inversion: inverted relief depth
                        modelZ = (0.55 - (p.salience || 0.5)) * 0.88
                    } else if (artStyle === 10) {
                        // #11 Hue-Angle Spiral Vortex: radial/rotational displacement by true HSV hue & saturation
                        var hueRad = ((p.hue || 0.0) * Math.PI) / 180.0 + l3T * 1.15
                        var vortexPull = (0.04 + state.bassSmooth * 0.08) * (p.sat || 0.5)
                        modelDX = Math.cos(hueRad) * vortexPull
                        modelDY = Math.sin(hueRad) * vortexPull
                        modelZ = ((p.sat || 0.5) - 0.4) * 0.68
                    } else if (artStyle === 11) {
                        // #12 Fourier Cymatic Interference: 2D standing-wave harmonic elevation
                        modelZ = Math.sin(hx * 6.28 + l3T * 2.2) * Math.cos(hy * 6.28 - l3T * 1.8) * (0.42 + state.bassSmooth * 0.36) + p.zDepth * 0.30
                    } else if (artStyle === 12) {
                        // #13 3D Point-Cloud Sculpture: deep monocular Z-relief
                        modelZ = p.zDepth * (0.88 + state.bassSmooth * 0.42)
                    } else if (artStyle === 14) {
                        // #15 Chromatic RGB Prism Split: shear R, G, B channels in 3D
                        var chIdx = (b % 3) - 1
                        var prismSpread = (0.035 + state.beatPulse * 0.065 + state.bassSmooth * 0.04) * chIdx
                        modelDX = prismSpread
                        modelDY = -prismSpread * 0.45
                        modelZ = chIdx * 0.36 + p.zDepth * 0.32
                    } else if (artStyle === 20) {
                        // #21 Holographic Slice Tomography: scanline elevation bend
                        modelDY = -p.zDepth * (0.12 + state.bassSmooth * 0.10)
                        modelZ = p.zDepth * 0.65
                    } else {
                        modelZ = p.zDepth * 0.48
                    }
                }

                var effX = p.x + modelDX
                var effY = p.y + modelDY
                var px = cx + effX * halfW
                var py = cy + effY * halfH
                var scaleW = 1.0
                var scaleH = 1.0
                var dirSignCell = (tracerDir >= 0) ? 1.0 : -1.0
                var zSurgeCell = Math.sin(l3T * 1.45 * evoFreq) * (0.44 + state.bassSmooth * 0.46) * dirSignCell + modelZ

                if (l3Mode === 0 || l3Mode === 2 || l3Mode === 3 || l3Mode === 4 || l3Mode === 5) {
                    var swoopYawCell = Math.sin(l3T * (l3Mode === 5 ? 0.92 : 0.72) * evoFreq) * (l3Mode === 5 ? 0.98 : 0.86)
                    var swoopPitchCell = Math.cos(l3T * 0.56 * evoFreq) * 0.34
                    var swoopRollCell = Math.sin(l3T * 0.42 * evoFreq) * 0.22
                    var zArcCell = -Math.cos(hx * 1.25 - l3T * 1.1 * dirSignCell) * (0.36 + state.bassSmooth * 0.34) + zSurgeCell * 0.55
                    var projCell5 = project3DPoint(
                        effX * 1.06,
                        effY * (halfH / Math.max(1.0, halfW)) * 0.96,
                        zArcCell,
                        swoopPitchCell, swoopYawCell, swoopRollCell,
                        cx, cy, halfW * 1.02, 1.58
                    )
                    px = projCell5.x
                    py = projCell5.y
                    scaleW = clamp(projCell5.persp * 1.32, 0.24, 2.75)
                    scaleH = clamp(projCell5.persp * 1.32, 0.24, 2.75)
                    if (l3Mode === 5 && activeTtfxFrame && p.gy < activeTtfxFrame.length) {
                        var tLine5 = activeTtfxFrame[p.gy] || ""
                        var tCh5 = p.gx < tLine5.length ? tLine5.charAt(p.gx) : " "
                        if (tCh5 === " " || tCh5 === "⠀") {
                            px += Math.cos(p.phase + state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                            py += Math.sin(p.phase - state.t * 2.4) * (14.0 + state.bassSmooth * 28.0)
                        }
                    }
                } else if (l3Mode === 6) {
                    var colBin = clamp(Math.floor(((hx + 1.0) * 0.5) * 63), 0, 63)
                    var colFFT = state.smoothBands[colBin] || 0.0
                    var stretchY6 = 1.0 + (colFFT * 0.78 + state.bassSmooth * 0.32) * warpIntensity * 0.52
                    var waveDX6 = Math.sin(hy * 3.8 * evoFreq + l3T * 2.2) * 0.11 * warpIntensity + modelDX
                    var waveDY6 = Math.sin(hx * 4.2 * evoFreq - l3T * 2.6) * 0.16 * warpIntensity
                                + Math.cos(hx * 8.4 + l3T * 3.4) * 0.06 * state.midSmooth + modelDY
                    var zWave6 = Math.sin(hx * 2.2 - l3T * 1.6 * dirSignCell) * (0.48 + state.bassSmooth * 0.38) + zSurgeCell * 0.50
                    var proj6 = project3DPoint(
                        hx + waveDX6,
                        (hy * stretchY6 + waveDY6) * (halfH / Math.max(1.0, halfW)),
                        zWave6,
                        Math.cos(l3T * 0.52) * 0.24, Math.sin(l3T * 0.68 * evoFreq) * 0.78, 0.0,
                        cx, cy, halfW * 1.02, 1.62
                    )
                    px = proj6.x
                    py = proj6.y
                    scaleW = clamp(proj6.persp * 1.24, 0.26, 2.55)
                    scaleH = clamp(stretchY6 * proj6.persp * 1.24, 0.30, 2.85)
                } else if (l3Mode === 7) {
                    var cylRad7 = 1.08 + state.bassSmooth * 0.20 * warpIntensity + modelZ * 0.22
                    var yAspect7 = (halfH / Math.max(1.0, halfW))
                    if (cylDir < 2) {
                        var hSign7 = (cylDir === 1) ? -1.0 : 1.0
                        var cylAng7 = (hx + modelDX) * (Math.PI * 0.90) + hSign7 * l3T * 1.55 * evoFreq
                        var cos7 = Math.cos(cylAng7), sin7 = Math.sin(cylAng7)
                        var camPitch7B = -0.44 - Math.sin(l3T * 0.35) * 0.14
                        var camYaw7B = Math.sin(l3T * 0.52 * evoFreq) * 0.52
                        var proj7 = project3DPoint(
                            sin7 * cylRad7,
                            (hy + modelDY) * (0.72 + state.midSmooth * 0.20) * yAspect7,
                            cos7 * cylRad7 * 0.96 + zSurgeCell * 0.42,
                            camPitch7B, camYaw7B, Math.sin(l3T * 0.55 * evoFreq) * 0.22 * hSign7,
                            cx, cy, halfW * 1.02, 1.68
                        )
                        px = proj7.x
                        py = proj7.y
                        scaleW = clamp(Math.max(0.22, Math.abs(cos7)) * proj7.persp * 1.38, 0.22, 2.65)
                        scaleH = clamp(proj7.persp * 1.34, 0.32, 2.65)
                    } else if (cylDir < 4) {
                        var vSign7 = (cylDir === 3) ? -1.0 : 1.0
                        var drumAng7 = (hy + modelDY) * (Math.PI * 0.84) + vSign7 * l3T * 1.55 * evoFreq + hx * 0.20 * warpIntensity
                        var cosD7 = Math.cos(drumAng7), sinD7 = Math.sin(drumAng7)
                        var camYaw7D = 0.54 + Math.sin(l3T * 0.48) * 0.42
                        var projD7 = project3DPoint(
                            (hx + modelDX) * 0.98,
                            sinD7 * cylRad7 * yAspect7 * 0.82,
                            cosD7 * cylRad7 * 0.96 + zSurgeCell * 0.42,
                            0.0, camYaw7D, Math.cos(l3T * 0.52 * evoFreq) * 0.20 * vSign7,
                            cx, cy, halfW * 1.02, 1.68
                        )
                        px = projD7.x
                        py = projD7.y
                        scaleW = clamp(projD7.persp * 1.34, 0.32, 2.65)
                        scaleH = clamp(Math.max(0.22, Math.abs(cosD7)) * projD7.persp * 1.38, 0.22, 2.65)
                    } else {
                        var spinSign7B = (cylDir === 5) ? -1.0 : 1.0
                        var cylAng7S = (hx + modelDX) * (Math.PI * 0.88) + spinSign7B * l3T * 1.55 * evoFreq
                        var cos7S = Math.cos(cylAng7S), sin7S = Math.sin(cylAng7S)
                        var fullSpin7B = l3T * 1.25 * evoFreq * spinSign7B
                        var gyroYaw7B = l3T * 0.95 * evoFreq * spinSign7B
                        var gyroPitch7B = -0.42 + Math.sin(l3T * 0.55 * evoFreq) * 0.38
                        var projS7B = project3DPoint(
                            sin7S * cylRad7,
                            (hy + modelDY) * yAspect7 * 0.78,
                            cos7S * cylRad7 * 0.96 + zSurgeCell * 0.42,
                            gyroPitch7B, gyroYaw7B, fullSpin7B,
                            cx, cy, halfW * 1.02, 1.68
                        )
                        px = projS7B.x
                        py = projS7B.y
                        scaleW = clamp(Math.max(0.22, Math.abs(cos7S)) * projS7B.persp * 1.38, 0.22, 2.65)
                        scaleH = clamp(projS7B.persp * 1.34, 0.32, 2.65)
                    }
                } else if (l3Mode === 8) {
                    var accBeat8 = Math.sin(l3T * 2.4) * (0.35 + state.bassSmooth * 0.55) * warpIntensity
                    var stretchX8 = clamp(1.0 + accBeat8 * 0.40 + Math.cos(hy * Math.PI * evoFreq + l3T * 1.8) * 0.18 * warpIntensity, 0.58, 1.65)
                    var stretchY8 = clamp(1.0 - accBeat8 * 0.30 + (0.25 + state.midSmooth * 0.55) * Math.cos(hx * Math.PI * 1.5 - l3T * 2.1) * 0.35 * warpIntensity, 0.62, 1.88)
                    var concX8 = (hx + modelDX) * stretchX8 + Math.sin(hx * Math.PI * 2.0 + l3T * 2.0) * 0.06 * warpIntensity
                    var concY8 = (hy + modelDY) * stretchY8
                    var proj8 = project3DPoint(
                        concX8,
                        concY8 * (halfH / Math.max(1.0, halfW)),
                        Math.sin(hx * 2.0 + l3T * 1.5 * dirSignCell) * 0.42 + zSurgeCell * 0.48,
                        Math.sin(l3T * 0.52) * 0.25, Math.sin(l3T * 0.74 * evoFreq) * 0.82, 0.0,
                        cx, cy, halfW * 1.02, 1.62
                    )
                    px = proj8.x
                    py = proj8.y
                    scaleW = clamp(stretchX8 * proj8.persp * 1.25, 0.26, 2.65)
                    scaleH = clamp(stretchY8 * proj8.persp * 1.25, 0.26, 2.65)
                } else if (l3Mode === 9) {
                    var dirSign9B = (cylDir === 1 || cylDir === 3 || cylDir === 5) ? -1.0 : 1.0
                    var crawlRx9 = Math.sin(l3T * 0.55) * 0.45 + ((cylDir === 2 || cylDir === 3) ? l3T * 1.05 * evoFreq * dirSign9B : 0.0)
                    var crawlRy9 = l3T * 1.15 * evoFreq * dirSign9B
                    var crawlRz9 = l3T * 0.68 * evoFreq * dirSign9B
                    var zWave9 = Math.sin(hx * 3.2 - l3T * 2.4) * (0.28 + state.bassSmooth * 0.32) * warpIntensity + zSurgeCell * 0.52
                    var proj9 = project3DPoint(
                        (hx + modelDX) * 1.08,
                        (hy + modelDY) * (halfH / Math.max(1.0, halfW)) * 0.96,
                        zWave9,
                        crawlRx9, crawlRy9, crawlRz9,
                        cx, cy, halfW * 1.02, 1.56
                    )
                    px = proj9.x
                    py = proj9.y
                    scaleW = clamp(proj9.persp * 1.36, 0.22, 2.75)
                    scaleH = scaleW
                } else if (l3Mode === 10) {
                    var breath10 = Math.sin(hx * 3.0 + l3T * 1.8) * 0.06 * warpIntensity
                    var splitOff = (e > 0) ? ((e % 2 === 1 ? 1.0 : -1.0) * (6.0 + state.bassSmooth * 18.0 + state.beatPulse * 12.0) * warpIntensity) : 0.0
                    var swoopYaw10 = Math.sin(l3T * 0.84 * evoFreq) * 0.96
                    var swoopPitch10 = -0.18 + Math.cos(l3T * 0.58 * evoFreq) * 0.28
                    var swoopZ10 = -Math.cos(hx * 1.35 + l3T * 1.25 * dirSignCell) * (0.38 + state.bassSmooth * 0.34) * warpIntensity + zSurgeCell * 0.55
                    var proj10 = project3DPoint(
                        (hx + modelDX) * 1.08,
                        (hy + modelDY + breath10) * (halfH / Math.max(1.0, halfW)) * 0.82,
                        swoopZ10,
                        swoopPitch10, swoopYaw10, Math.sin(l3T * 0.46) * 0.18,
                        cx + splitOff, cy - halfH * 0.10, halfW * 1.04, 1.55
                    )
                    px = proj10.x
                    py = proj10.y
                    scaleW = clamp(proj10.persp * 1.36, 0.24, 2.78)
                    scaleH = scaleW
                } else if (l3Mode === 11) {
                    var wx11 = hx + modelDX
                    var wy11 = hy + modelDY
                    var mag11 = 1.0
                    var dx1 = wx11 - lens1X, dy1 = (wy11 - lens1Y) * 0.75
                    var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
                    if (d1 < lensRad && d1 > 0.0001) {
                        var u1 = 1.0 - d1 / lensRad
                        var bulge1 = u1 * u1 * (0.46 + state.bassSmooth * 0.52) * warpIntensity
                        var sw1 = u1 * 0.22 * Math.sin(l3T * 1.6)
                        wx11 += (dx1 / d1) * bulge1 * 0.28 - dy1 * sw1
                        wy11 += (dy1 / d1) * bulge1 * 0.36 + dx1 * sw1
                        mag11 += bulge1 * 1.15
                    }
                    var dx2 = wx11 - lens2X, dy2 = (wy11 - lens2Y) * 0.75
                    var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
                    if (d2 < lensRad && d2 > 0.0001) {
                        var u2 = 1.0 - d2 / lensRad
                        var bulge2 = u2 * u2 * (0.42 + state.midSmooth * 0.48) * warpIntensity
                        wx11 += (dx2 / d2) * bulge2 * 0.24
                        wy11 += (dy2 / d2) * bulge2 * 0.32
                        mag11 += bulge2 * 0.95
                    }
                    px = cx + wx11 * halfW
                    py = cy + wy11 * halfH
                    scaleW = clamp(mag11, 0.85, 2.25)
                    scaleH = scaleW
                }

                // 3D Normal-Map Spotlight modulation for Style #7 (st === 6)
                var lightGain = 1.0
                if (artStyle === 6 && p.normX !== undefined) {
                    var nDotL = Math.max(0.15, (p.normX * lightX + p.normY * lightY + p.normZ * lightZ))
                    lightGain = 0.55 + nDotL * 0.95
                }

                var pulseBoost = (0.82 + p.density * 0.22 + bVal * 0.24) * lightGain
                var szW = tileW * pulseBoost * scaleW
                var szH = tileH * pulseBoost * scaleH

                drawLayer3ArtStyleCell(ctx, artStyle, px, py, szW, szH, p, i, bVal, l3T, isEcho)

                // Mode 10 (Chromatic Mirror): Shimmering water-rippled inverted reflection beneath the baseline
                if (l3Mode === 10 && !isEcho && (i & 1) === 0) {
                    var reflRippleX = Math.sin(hy * 14.0 + l3T * 5.2) * (5.0 + state.bassSmooth * 12.0) * warpIntensity
                    var reflX = px + reflRippleX
                    var reflY = (cy + halfH * 0.66) + (1.0 - hy) * halfH * 0.36
                    ctx.rect(reflX - szW * 0.38, reflY - szH * 0.24, szW * 0.76, szH * 0.48)
                }
            }
            ctx.fill()
        }
        ctx.restore()
    }
}

// 21 Mathematical Art Interpretation Models for Layer 6 Album Art (`useAlbumArt === true`)
function drawLayer3ArtStyleCell(ctx, artStyle, px, py, szW, szH, p, idx, bVal, l3T, isEcho) {
    var dens = clamp(Number(p.density !== undefined ? p.density : 0.65), 0.15, 1.0)
    var sal = clamp(Number(p.salience !== undefined ? p.salience : dens), 0.10, 1.0)
    var edge = clamp(Number(p.edgeMag !== undefined ? p.edgeMag : 0.45), 0.05, 1.0)
    var tang = Number(p.tangentRad !== undefined ? p.tangentRad : ((idx * 0.45) % Math.PI))
    var zDep = clamp(Number(p.zDepth !== undefined ? p.zDepth : 0.0), -1.0, 1.0)
    var dog = clamp(Number(p.dogVal !== undefined ? p.dogVal : 0.3), -1.0, 1.0)
    var mask = p.brailleMask || (((idx * 37 + 13) & 0xFF) | 0x09)
    var st = ((artStyle % 21) + 21) % 21

    if (st === 0) {
        // 0: Chromatic K-Means 3D Planes — layered relief plate + depth shadow offset by cluster plane
        var kw = szW * (0.48 + sal * 0.56)
        var kh = szH * (0.48 + sal * 0.56)
        var zOff = zDep * szW * 0.32
        ctx.rect(px + zOff - kw * 0.5, py - zOff * 0.6 - kh * 0.5, kw, kh)
        if (!isEcho && edge > 0.42) {
            ctx.rect(px - kw * 0.64, py - 1.2, kw * 1.28, 2.4)
        }
    } else if (st === 1) {
        // 1: Subject Salience Isolation — organic focal node + concentric salience aura ring
        var sr = Math.min(szW, szH) * (0.28 + sal * 0.44 + bVal * 0.15)
        ctx.moveTo(px + sr, py)
        ctx.arc(px, py, sr, 0, Math.PI * 2.0)
        if (!isEcho && sal > 0.62) {
            var auraW = sr * 2.35
            var rimT = Math.max(1.2, sr * 0.22)
            ctx.rect(px - auraW * 0.5, py - auraW * 0.5, auraW, rimT)
            ctx.rect(px - auraW * 0.5, py + auraW * 0.5 - rimT, auraW, rimT)
        }
    } else if (st === 2) {
        // 2: Sobel Tangent Flow Ribbons — elongated directional brushstroke rotated along the exact Sobel contour tangent θ
        var ribLen = Math.max(szW, szH) * (0.72 + edge * 1.15 + bVal * 0.35)
        var ribThick = Math.max(1.5, Math.min(szW, szH) * (0.18 + sal * 0.22))
        var cosT = Math.cos(tang), sinT = Math.sin(tang)
        var nxT = -sinT * ribThick * 0.5, nyT = cosT * ribThick * 0.5
        var dxT = cosT * ribLen * 0.5, dyT = sinT * ribLen * 0.5
        ctx.moveTo(px - dxT + nxT, py - dyT + nyT)
        ctx.lineTo(px + dxT + nxT, py + dyT + nyT)
        ctx.lineTo(px + dxT - nxT, py + dyT - nyT)
        ctx.lineTo(px - dxT - nxT, py - dyT - nyT)
        ctx.closePath()
    } else if (st === 3) {
        // 3: Adaptive Quadtree Mondrian — variable-scale architectural subdivision accents
        var qScale = (edge > 0.55) ? 0.42 : ((sal < 0.38) ? 1.18 : 0.78)
        var qw = szW * qScale
        var qh = szH * qScale
        ctx.rect(px - qw * 0.5, py - qh * 0.5, qw, qh)
    } else if (st === 4) {
        // 4: Delaunay Stained-Glass Shards — oriented 3-vertex Delaunay triangle facet aligned to local gradient
        var trR = Math.max(szW, szH) * (0.45 + sal * 0.42)
        for (var tv = 0; tv < 3; tv++) {
            var ta = tang + tv * (Math.PI * 2.0 / 3.0)
            var tx = px + Math.cos(ta) * trR
            var ty = py + Math.sin(ta) * trR
            if (tv === 0) ctx.moveTo(tx, ty)
            else ctx.lineTo(tx, ty)
        }
        ctx.closePath()
    } else if (st === 5) {
        // 5: Topographical Iso-Contours — Marching-Squares elevation contour segment + altitude marker
        var cLen = Math.max(szW, szH) * (0.85 + edge * 0.75)
        var cThk = Math.max(1.4, Math.min(szW, szH) * 0.20)
        var cCos = Math.cos(tang), cSin = Math.sin(tang)
        ctx.moveTo(px - cCos * cLen * 0.5, py - cSin * cLen * 0.5)
        ctx.lineTo(px + cCos * cLen * 0.5, py + cSin * cLen * 0.5)
        ctx.lineTo(px + cCos * cLen * 0.5 - cSin * cThk, py + cSin * cLen * 0.5 + cCos * cThk)
        ctx.lineTo(px - cCos * cLen * 0.5 - cSin * cThk, py - cSin * cLen * 0.5 + cCos * cThk)
        ctx.closePath()
        if ((p.contourLvl || 0) >= 5) {
            ctx.rect(px - cThk, py - cThk, cThk * 2.0, cThk * 2.0)
        }
    } else if (st === 6) {
        // 6: 3D Normal-Map Lit Bas-Relief — bevelled chiseled relief facet Tilted by surface normal (normX, normY)
        var nx = p.normX || 0.0
        var ny = p.normY || 0.0
        var bw6 = szW * (0.48 + sal * 0.42)
        var bh6 = szH * (0.48 + sal * 0.42)
        ctx.moveTo(px + nx * bw6 * 0.5, py - bh6 * 0.55)
        ctx.lineTo(px + bw6 * 0.55, py + ny * bh6 * 0.5)
        ctx.lineTo(px - nx * bw6 * 0.5, py + bh6 * 0.55)
        ctx.lineTo(px - bw6 * 0.55, py - ny * bh6 * 0.5)
        ctx.closePath()
    } else if (st === 7) {
        // 7: Thermal Warm-Cool Depth Split — thermal flare cross for warm foreground, cool horizontal horizon bar for background
        var thVal = p.thermal !== undefined ? p.thermal : (dens - 0.5)
        if (thVal >= 0.0) {
            var tw7 = szW * (0.46 + thVal * 0.52)
            var th7 = szH * (0.46 + thVal * 0.52)
            ctx.rect(px - tw7 * 0.5, py - th7 * 0.22, tw7, th7 * 0.44)
            ctx.rect(px - tw7 * 0.22, py - th7 * 0.5, tw7 * 0.44, th7)
        } else {
            var cw7 = szW * (0.55 - thVal * 0.45)
            var ch7 = Math.max(1.5, szH * 0.26)
            ctx.rect(px - cw7 * 0.5, py - ch7 * 0.5, cw7, ch7)
        }
    } else if (st === 8) {
        // 8: DoG Woodcut & Ink Ridges — tapered diamond woodcut gouge aligned to Sobel tangent angle
        var gLen = Math.max(szW, szH) * (0.68 + Math.abs(dog) * 0.95 + edge * 0.45)
        var gWid = Math.max(1.5, Math.min(szW, szH) * (0.16 + Math.abs(dog) * 0.26))
        var gCos = Math.cos(tang), gSin = Math.sin(tang)
        ctx.moveTo(px + gCos * gLen * 0.5, py + gSin * gLen * 0.5)
        ctx.lineTo(px - gSin * gWid * 0.5, py + gCos * gWid * 0.5)
        ctx.lineTo(px - gCos * gLen * 0.5, py - gSin * gLen * 0.5)
        ctx.lineTo(px + gSin * gWid * 0.5, py - gCos * gWid * 0.5)
        ctx.closePath()
    } else if (st === 9) {
        // 9: Negative-Space Shadow Inversion — hollow architectural portal frame larger in dark/negative regions
        var invSal = clamp(1.15 - sal, 0.25, 1.0)
        var fw9 = szW * (0.52 + invSal * 0.48)
        var fh9 = szH * (0.52 + invSal * 0.48)
        var rim9 = Math.max(1.3, Math.min(fw9, fh9) * 0.20)
        ctx.rect(px - fw9 * 0.5, py - fh9 * 0.5, fw9, rim9)
        ctx.rect(px - fw9 * 0.5, py + fh9 * 0.5 - rim9, fw9, rim9)
        ctx.rect(px - fw9 * 0.5, py - fh9 * 0.5, rim9, fh9)
        ctx.rect(px + fw9 * 0.5 - rim9, py - fh9 * 0.5, rim9, fh9)
    } else if (st === 10) {
        // 10: Hue-Angle Spiral Vortex — crescent/wedge petal rotated by the pixel's true HSV hue angle
        var hueAng = ((p.hue || 0.0) * Math.PI) / 180.0 + l3T * 0.8
        var hLen = Math.max(szW, szH) * (0.45 + (p.sat || 0.6) * 0.58)
        var hWid = Math.min(szW, szH) * 0.36
        var hCos = Math.cos(hueAng), hSin = Math.sin(hueAng)
        ctx.moveTo(px + hCos * hLen, py + hSin * hLen)
        ctx.lineTo(px - hSin * hWid, py + hCos * hWid)
        ctx.lineTo(px - hCos * hLen * 0.45, py - hSin * hLen * 0.45)
        ctx.lineTo(px + hSin * hWid, py - hCos * hWid)
        ctx.closePath()
    } else if (st === 11) {
        // 11: Fourier Cymatic Interference — concentric harmonic interference node + wave bars
        var cymW = szW * (0.42 + edge * 0.52)
        var cymH = Math.max(1.4, szH * 0.20)
        var cymOff = Math.sin((p.gx || 0) * 0.65 + (p.gy || 0) * 0.65 + l3T * 3.2) * szH * 0.28
        ctx.rect(px - cymW * 0.5, py + cymOff - cymH * 0.5, cymW, cymH)
        ctx.rect(px - cymH * 0.5, py - cymOff - cymW * 0.5, cymH, cymW)
    } else if (st === 12) {
        // 12: 3D Point-Cloud Sculpture — 3D depth-scaled sphere + constellation filament along tangent
        var pcR = Math.min(szW, szH) * (0.20 + (zDep + 1.0) * 0.18 + sal * 0.20)
        ctx.moveTo(px + pcR, py)
        ctx.arc(px, py, pcR, 0, Math.PI * 2.0)
        if (!isEcho && edge > 0.32) {
            var filL = szW * (0.75 + sal * 0.65)
            ctx.rect(px, py - 0.9, Math.cos(tang) * filL, 1.8)
        }
    } else if (st === 13) {
        // 13: Gabor Oriented Cross-Hatch — multi-angle engraving hatch strokes selected by gradient orientation & shadow depth
        var hLen13 = Math.max(szW, szH) * (0.64 + edge * 0.55)
        var hThk13 = Math.max(1.2, Math.min(szW, szH) * 0.15)
        var quantAng = Math.round(tang / (Math.PI * 0.25)) * (Math.PI * 0.25)
        var c13 = Math.cos(quantAng), s13 = Math.sin(quantAng)
        ctx.moveTo(px - c13 * hLen13 * 0.5, py - s13 * hLen13 * 0.5)
        ctx.lineTo(px + c13 * hLen13 * 0.5, py + s13 * hLen13 * 0.5)
        ctx.lineTo(px + c13 * hLen13 * 0.5 - s13 * hThk13, py + s13 * hLen13 * 0.5 + c13 * hThk13)
        ctx.lineTo(px - c13 * hLen13 * 0.5 - s13 * hThk13, py - s13 * hLen13 * 0.5 + c13 * hThk13)
        ctx.closePath()
        if ((p.luma || 0.5) < 0.52) {
            ctx.rect(px - hLen13 * 0.35, py - hThk13 * 0.5, hLen13 * 0.70, hThk13)
        }
    } else if (st === 14) {
        // 14: Chromatic RGB Prism Split — 3 sheared RGB channel sub-plates sized by actual R, G, B channel intensities
        var rWeight = (p.r !== undefined ? p.r : 180) / 255.0
        var gWeight = (p.g !== undefined ? p.g : 180) / 255.0
        var bWeight = (p.b !== undefined ? p.b : 180) / 255.0
        var barW14 = Math.max(1.4, szW * 0.26)
        ctx.rect(px - szW * 0.36, py - szH * rWeight * 0.5, barW14, szH * Math.max(0.2, rWeight))
        ctx.rect(px - barW14 * 0.5, py - szH * gWeight * 0.5, barW14, szH * Math.max(0.2, gWeight))
        ctx.rect(px + szW * 0.36 - barW14, py - szH * bWeight * 0.5, barW14, szH * Math.max(0.2, bWeight))
    } else if (st === 15) {
        // 15: Poisson Organic Stipple Swarm — deterministic jittered non-grid stipple disc + specular highlight
        var jitX = Math.sin(idx * 12.9898 + 4.1414) * szW * 0.36
        var jitY = Math.cos(idx * 78.233 + 1.618) * szH * 0.36
        var stR = Math.min(szW, szH) * (0.20 + sal * 0.36 + (p.sat || 0.5) * 0.16)
        ctx.moveTo(px + jitX + stR, py + jitY)
        ctx.arc(px + jitX, py + jitY, stR, 0, Math.PI * 2.0)
    } else if (st === 16) {
        // 16: Turing Reaction-Diffusion — organic L-shaped/T-shaped labyrinth reaction-diffusion bridges
        var rdW = szW * (0.42 + sal * 0.45)
        var rdH = szH * (0.42 + sal * 0.45)
        var rdThk = Math.max(1.6, Math.min(szW, szH) * 0.28)
        var dir16 = ((p.clusterId || 0) + (p.contourLvl || 0)) & 3
        ctx.rect(px - rdThk * 0.5, py - rdThk * 0.5, rdW * (dir16 & 1 ? 0.95 : -0.95), rdThk)
        ctx.rect(px - rdThk * 0.5, py - rdThk * 0.5, rdThk, rdH * (dir16 & 2 ? 0.95 : -0.95))
    } else if (st === 17) {
        // 17: Isometric Cityscape Extrude — 3D extruded isometric roof + vertical tower pillar driven by salience & zDepth
        var extH = Math.max(2.0, (sal * 0.65 + (zDep + 1.0) * 0.35) * szH * (0.75 + bVal * 0.45))
        var topY = py - extH
        var isoW = szW * 0.46
        var isoH = szH * 0.26
        ctx.moveTo(px, topY - isoH)
        ctx.lineTo(px + isoW, topY)
        ctx.lineTo(px, topY + isoH)
        ctx.lineTo(px - isoW, topY)
        ctx.closePath()
        ctx.rect(px - isoW * 0.65, topY + isoH * 0.25, isoW * 1.30, extH)
    } else if (st === 18) {
        // 18: CMYK Rosette Halftone Press — rotated screen-angle diamond/dot rosette sized by chromatic saturation & salience
        var cmykAng = ((p.clusterId || 0) * 15.0 * Math.PI) / 180.0
        var dotR = Math.min(szW, szH) * (0.22 + sal * 0.36 + (p.sat || 0.5) * 0.18)
        var c18 = Math.cos(cmykAng) * dotR, s18 = Math.sin(cmykAng) * dotR
        ctx.moveTo(px + c18, py + s18)
        ctx.lineTo(px - s18, py + c18)
        ctx.lineTo(px - c18, py - s18)
        ctx.lineTo(px + s18, py - c18)
        ctx.closePath()
    } else if (st === 19) {
        // 19: Magnetic Dipole Vector Field — compass vector needle deflected by Sobel gradient + audio bass field
        var dipAng = tang + Math.sin(l3T * 2.2 + (p.hue || 0.0) * 0.02) * (0.35 + bVal * 0.55)
        var nLen = Math.max(szW, szH) * (0.62 + edge * 0.72)
        var nWid = Math.max(1.5, Math.min(szW, szH) * 0.22)
        var dc = Math.cos(dipAng), ds = Math.sin(dipAng)
        ctx.moveTo(px + dc * nLen * 0.65, py + ds * nLen * 0.65)
        ctx.lineTo(px - ds * nWid * 0.5, py + dc * nWid * 0.5)
        ctx.lineTo(px - dc * nLen * 0.35, py - ds * nLen * 0.35)
        ctx.lineTo(px + ds * nWid * 0.5, py - dc * nWid * 0.5)
        ctx.closePath()
    } else {
        // 20: Holographic Slice Tomography — horizontal topographic ribbon segment elevated by zDepth & salience
        var sliceW = szW * (0.95 + sal * 0.35)
        var sliceH = Math.max(1.6, szH * (0.18 + edge * 0.24))
        var ridgeY = py - zDep * szH * 0.55
        ctx.rect(px - sliceW * 0.5, ridgeY - sliceH * 0.5, sliceW, sliceH)
        if (!isEcho && sal > 0.60) {
            ctx.rect(px - 1.0, ridgeY, 2.0, Math.max(2.0, (py - ridgeY)))
        }
    }
}

// ---------------------------------------------------------------------------
// Master 4-Layer Composite Frame Renderer
// ---------------------------------------------------------------------------

function normaliseConfig(cfg, mode, asciiLines) {
    if (cfg && cfg._isNormalised && (mode === undefined || cfg._normMode === mode)) {
        return cfg
    }
    var c = cfg || {}
    var pos = Number(c.position) || 0.0
    var dur = Number(c.duration) || 0.0
    var prog = c.trackProgress !== undefined ? Number(c.trackProgress) : (dur > 0 ? clamp(pos / dur, 0.0, 1.0) : 0.0)
    var geomDetail = c.geometryDetail !== undefined ? clamp(Number(c.geometryDetail), 0.50, 2.00) : 1.0
    var l2TrOn = c.layer2TracersEnabled !== undefined ? Boolean(c.layer2TracersEnabled) : true
    var l4On = c.layer4Enabled !== undefined
        ? Boolean(c.layer4Enabled)
        : (c.backdropEnabled !== undefined ? Boolean(c.backdropEnabled) : false)
    var l4ModeRaw = c.layer4Mode !== undefined ? c.layer4Mode : (c.backdropMode !== undefined ? c.backdropMode : 0)
    return {
        playing: c.playing !== undefined ? Boolean(c.playing) : true,
        palette: Number(c.palette) || 0,
        musicDrive: c.musicDrive !== undefined ? Boolean(c.musicDrive) : true,
        geometryDetail: geomDetail,
        audioSensitivity: c.audioSensitivity !== undefined ? clamp(Number(c.audioSensitivity), 0.30, 2.50) : 1.0,
        beatPunch: c.beatPunch !== undefined ? clamp(Number(c.beatPunch), 0.25, 2.00) : 1.0,
        audioSmoothing: c.audioSmoothing !== undefined ? clamp(Number(c.audioSmoothing), 0.20, 0.92) : 0.65,
        colourCycleSpeed: c.colourCycleSpeed !== undefined ? clamp(Number(c.colourCycleSpeed), 0.0, 2.50) : 1.0,
        masterBrightness: c.masterBrightness !== undefined ? clamp(Number(c.masterBrightness), 0.50, 1.50) : 1.0,
        gpuShaderEnabled: c.gpuShaderEnabled !== undefined ? Boolean(c.gpuShaderEnabled) : true,
        gpuL1Active: c.gpuL1Active !== undefined ? Boolean(c.gpuL1Active) : false,
        backdropEnabled: l4On,
        backdropMode: c.backdropMode !== undefined ? clamp(Math.round(Number(c.backdropMode)), 0, BACKDROP_MODES.length - 1) : 0,
        backdropSpeed: c.backdropSpeed !== undefined ? clamp(Number(c.backdropSpeed), 0.1, 3.0) : 1.0,
        backdropIntensity: c.backdropIntensity !== undefined ? clamp(Number(c.backdropIntensity), 0.2, 2.0) : 1.0,
        backdropSymmetry: c.backdropSymmetry !== undefined ? clamp(Math.round(Number(c.backdropSymmetry)), 2, 16) : 6,
        backdropDirection: c.backdropDirection !== undefined ? Number(c.backdropDirection) : 1,
        layer4Enabled: l4On,
        layer4Mode: clamp(Math.round(Number(l4ModeRaw) || 0), 0, LAYER4_MODES.length - 1),
        layer4DualEnabled: c.layer4DualEnabled !== undefined ? Boolean(c.layer4DualEnabled) : false,
        layer4SecondaryMode: c.layer4SecondaryMode !== undefined ? clamp(Math.round(Number(c.layer4SecondaryMode)), 0, LAYER4_MODES.length - 1) : 1,
        layer4DualMix: c.layer4DualMix !== undefined ? clamp(Number(c.layer4DualMix), 0.15, 0.85) : 0.50,
        layer4WallPattern: c.layer4WallPattern !== undefined ? clamp(Math.round(Number(c.layer4WallPattern)), 0, LAYER4_WALL_PATTERNS.length - 1) : 0,
        layer4Twist: c.layer4Twist !== undefined ? clamp(Number(c.layer4Twist), -2.5, 2.5) : 1.0,
        layer4Speed: c.layer4Speed !== undefined ? clamp(Number(c.layer4Speed), 0.1, 3.0) : (c.backdropSpeed !== undefined ? clamp(Number(c.backdropSpeed), 0.1, 3.0) : 1.0),
        layer4Glow: c.layer4Glow !== undefined ? clamp(Number(c.layer4Glow), 0.2, 2.0) : (c.backdropIntensity !== undefined ? clamp(Number(c.backdropIntensity), 0.2, 2.0) : 1.0),
        layer4Opacity: c.layer4Opacity !== undefined ? clamp(Number(c.layer4Opacity), 0.05, 1.0) : 1.0,
        layer4Symmetry: c.layer4Symmetry !== undefined ? clamp(Math.round(Number(c.layer4Symmetry)), 2, 16) : (c.backdropSymmetry !== undefined ? clamp(Math.round(Number(c.backdropSymmetry)), 2, 16) : 6),
        layer4Direction: c.layer4Direction !== undefined ? Number(c.layer4Direction) : (c.backdropDirection !== undefined ? Number(c.backdropDirection) : 1),
        trackArcMode: c.trackArcMode !== undefined ? clamp(Math.round(Number(c.trackArcMode)), 0, 4) : 0,
        tracerCount: l2TrOn ? (c.tracerCount !== undefined ? clamp(Math.round(Number(c.tracerCount)), 1, 16) : 4) : 1,
        tracerSpeed: c.tracerSpeed !== undefined ? clamp(Number(c.tracerSpeed), 0.15, 3.0) : 1.15,
        tracerDrift: c.tracerDrift !== undefined ? clamp(Number(c.tracerDrift), 0.0, 2.5) : 1.0,
        tracerDirection: c.tracerDirection !== undefined ? Number(c.tracerDirection) : 1,
        layer1Enabled: c.layer1Enabled !== undefined ? Boolean(c.layer1Enabled) : true,
        layer1FieldEnabled: c.layer1FieldEnabled !== undefined ? Boolean(c.layer1FieldEnabled) : true,
        layer1Mode: c.layer1Mode !== undefined ? clamp(Math.round(Number(c.layer1Mode)), 0, ALL_LAYER1_MODES.length - 1) : 0,
        layer1Direction: c.layer1Direction !== undefined ? Number(c.layer1Direction) : 1,
        layer1Trail: Number(c.layer1Trail !== undefined ? c.layer1Trail : (c.layer1Persistence !== undefined ? c.layer1Persistence : 0.85)),
        layer1Speed: Number(c.layer1Speed !== undefined ? c.layer1Speed : 1.0),
        layer1Density: Number(c.layer1Density !== undefined ? c.layer1Density : 1.0) * geomDetail,
        layer1Dim: Number(c.layer1Dim !== undefined ? c.layer1Dim : 0.15),
        layer1Opacity: c.layer1Opacity !== undefined ? clamp(Number(c.layer1Opacity), 0.05, 1.0) : 1.0,
        layer1EqEnabled: c.layer1EqEnabled !== undefined ? Boolean(c.layer1EqEnabled) : false,
        layer1EqStyle: c.layer1EqStyle !== undefined ? clamp(Math.round(Number(c.layer1EqStyle)), 0, ALL_LAYER1_EQ_STYLES.length - 1) : 0,
        layer1EqLayout: c.layer1EqLayout !== undefined ? clamp(Math.round(Number(c.layer1EqLayout)), 0, 3) : 0,
        layer1EqBandOrder: c.layer1EqBandOrder !== undefined ? clamp(Math.round(Number(c.layer1EqBandOrder)), 0, 2) : 0,
        layer1EqGain: c.layer1EqGain !== undefined ? clamp(Number(c.layer1EqGain), 0.20, 1.00) : 0.80,
        layer1EqScale: c.layer1EqScale !== undefined ? clamp(Number(c.layer1EqScale), 0.15, 2.25) : 1.0,
        layer1EqSpin: c.layer1EqSpin !== undefined ? clamp(Number(c.layer1EqSpin), -2.5, 2.5) : 1.0,
        layer1EqDamping: c.layer1EqDamping !== undefined ? clamp(Math.round(Number(c.layer1EqDamping)), 0, 2) : 0,
        layer1EqOpacity: c.layer1EqOpacity !== undefined ? clamp(Number(c.layer1EqOpacity), 0.05, 1.0) : 1.0,
        layer1ShapesEnabled: c.layer1ShapesEnabled !== undefined ? Boolean(c.layer1ShapesEnabled) : true,
        layer1ShapeStyle: c.layer1ShapeStyle !== undefined ? clamp(Math.round(Number(c.layer1ShapeStyle)), 0, LAYER1_SHAPE_STYLES.length - 1) : 0,
        layer1ShapeSpin: c.layer1ShapeSpin !== undefined ? clamp(Number(c.layer1ShapeSpin), -2.5, 2.5) : 0.25,
        layer1ShapeSpeed: c.layer1ShapeSpeed !== undefined ? clamp(Number(c.layer1ShapeSpeed), 0.2, 3.0) : 1.0,
        layer1ShapeScale: c.layer1ShapeScale !== undefined ? clamp(Number(c.layer1ShapeScale), 0.3, 2.5) : 1.0,
        layer1ShapeDensity: c.layer1ShapeDensity !== undefined ? clamp(Number(c.layer1ShapeDensity), 0.25, 2.5) : 1.0,
        layer1ShapeLifespan: c.layer1ShapeLifespan !== undefined ? clamp(Number(c.layer1ShapeLifespan), 0.35, 3.0) : 1.0,
        layer1ShapeFillRatio: c.layer1ShapeFillRatio !== undefined ? clamp(Number(c.layer1ShapeFillRatio), 0.0, 1.0) : 0.35,
        layer1ShapeFillOpacity: c.layer1ShapeFillOpacity !== undefined ? clamp(Number(c.layer1ShapeFillOpacity), 0.05, 1.0) : 0.55,
        layer1ShapesOpacity: c.layer1ShapesOpacity !== undefined ? clamp(Number(c.layer1ShapesOpacity), 0.05, 1.0) : 1.0,
        layer2Enabled: c.layer2Enabled !== undefined ? Boolean(c.layer2Enabled) : true,
        layer2VizEnabled: c.layer2VizEnabled !== undefined ? Boolean(c.layer2VizEnabled) : true,
        layer2TracersEnabled: c.layer2TracersEnabled !== undefined ? Boolean(c.layer2TracersEnabled) : true,
        layer2Mode: clamp(Math.round(Number(c.layer2Mode !== undefined ? c.layer2Mode : (c.mode !== undefined ? c.mode : (mode || 0)))), 0, ALL_MODE_NAMES.length - 1),
        layer2Facets: Number(c.layer2Facets !== undefined ? c.layer2Facets : (c.symmetryFolds !== undefined ? c.symmetryFolds : 6)),
        layer2Complexity: Number(c.layer2Complexity !== undefined ? c.layer2Complexity : 1.0) * geomDetail,
        layer2Speed: Number(c.layer2Speed !== undefined ? c.layer2Speed : 1.0),
        layer2Reactivity: Number(c.layer2Reactivity !== undefined ? c.layer2Reactivity : (c.sensitivity !== undefined ? c.sensitivity : 1.35)),
        layer2Zoom: Number(c.layer2Zoom !== undefined ? c.layer2Zoom : 1.0),
        layer2Chaos: Number(c.layer2Chaos !== undefined ? c.layer2Chaos : 0.45),
        layer2FillRatio: c.layer2FillRatio !== undefined ? clamp(Number(c.layer2FillRatio), 0.0, 1.0) : 0.45,
        layer2FillOpacity: c.layer2FillOpacity !== undefined ? clamp(Number(c.layer2FillOpacity), 0.05, 1.0) : 0.55,
        layer2Opacity: c.layer2Opacity !== undefined ? clamp(Number(c.layer2Opacity), 0.05, 1.0) : 1.0,
        layer3Enabled: c.layer3Enabled !== undefined ? Boolean(c.layer3Enabled) : true,
        layer3IterationPaused: Boolean(c.layer3IterationPaused),
        layer3TransitionPauseSec: c.layer3TransitionPauseSec !== undefined ? clamp(Number(c.layer3TransitionPauseSec), 1.0, 45.0) : (c.layer3PauseSec !== undefined ? clamp(Number(c.layer3PauseSec), 1.0, 45.0) : 5.0),
        layer3PauseSec: c.layer3TransitionPauseSec !== undefined ? clamp(Number(c.layer3TransitionPauseSec), 1.0, 45.0) : (c.layer3PauseSec !== undefined ? clamp(Number(c.layer3PauseSec), 1.0, 45.0) : 5.0),
        layer3AutoRandomise: Boolean(c.layer3AutoRandomise),
        autoCycle: Boolean(c.autoCycle),
        layer3Mode: c.layer3Mode !== undefined ? clamp(Math.round(Number(c.layer3Mode)), 0, LAYER3_MODES.length - 1) : 0,
        layer3TextStyle: c.layer3TextStyle !== undefined ? clamp(Math.round(Number(c.layer3TextStyle)), 0, LAYER3_TEXT_STYLES.length - 1) : 0,
        layer3FontPreset: c.layer3FontPreset !== undefined ? clamp(Math.round(Number(c.layer3FontPreset)), 0, LAYER3_FONT_PRESETS.length - 1) : 0,
        layer3CustomPalette: Array.isArray(c.layer3CustomPalette) ? c.layer3CustomPalette : [],
        layer3ColourMode: c.layer3ColourMode !== undefined ? clamp(Math.round(Number(c.layer3ColourMode)), 0, LAYER3_COLOUR_MODES.length - 1) : 0,
        layer3CylinderDir: c.layer3CylinderDir !== undefined ? clamp(Math.round(Number(c.layer3CylinderDir)), 0, LAYER3_CYLINDER_DIRS.length - 1) : 0,
        layer3ShowArtist: c.layer3ShowArtist !== undefined ? Boolean(c.layer3ShowArtist) : true,
        layer3ShowTrack: c.layer3ShowTrack !== undefined ? Boolean(c.layer3ShowTrack) : true,
        layer3ShowAlbum: c.layer3ShowAlbum !== undefined ? Boolean(c.layer3ShowAlbum) : true,
        layer3ShowStatements: c.layer3ShowStatements !== undefined ? Boolean(c.layer3ShowStatements) : false,
        statementText: String(c.statementText || ""),
        layer3Dismantle: Number(c.layer3Dismantle !== undefined ? c.layer3Dismantle : 1.15),
        layer3Rebuild: Number(c.layer3Rebuild !== undefined ? c.layer3Rebuild : 1.0),
        layer3Evolution: Number(c.layer3Evolution !== undefined ? c.layer3Evolution : 0.85),
        layer3Scale: clamp(Number(c.layer3Scale !== undefined ? c.layer3Scale : 1.0), 0.40, 3.00),
        layer3Opacity: c.layer3Opacity !== undefined ? clamp(Number(c.layer3Opacity), 0.05, 1.0) : 0.90,
        layer3Tracers: c.layer3Tracers !== undefined ? clamp(Math.round(Number(c.layer3Tracers)), 1, 8) : 3,
        layer3AsciiMode: c.layer3AsciiMode || c.asciiMode || "braille",
        asciiMode: c.asciiMode || c.layer3AsciiMode || "braille",
        useAlbumArt: c.useAlbumArt !== undefined ? Boolean(c.useAlbumArt) : true,
        bannerLines: c.bannerLines || [],
        artLines: c.artLines || [],
        trackTitle: String(c.trackTitle || ""),
        trackArtist: String(c.trackArtist || ""),
        trackAlbum: String(c.trackAlbum || ""),
        trackProgress: prog,
        photoMotionRenderCallback: typeof c.photoMotionRenderCallback === "function" ? c.photoMotionRenderCallback : null,
        _isNormalised: true,
        _normMode: mode
    }
}

function renderFrame(ctx, w, h, state, mode, theme, asciiLines, asciiSource, ttfxFrames, cfg, canvasItem) {
    if (w <= 4 || h <= 4) return

    if (typeof ctx.resetTransform === "function") {
        ctx.resetTransform()
    } else if (typeof ctx.setTransform === "function") {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    ctx.globalAlpha = 1.0
    ctx.globalCompositeOperation = "source-over"

    // Backward-compatible support if called with 6 args: renderFrame(ctx, w, h, state, rawBands, opts)
    if (Array.isArray(mode) && typeof theme === "object" && asciiLines === undefined) {
        var legacyBands = mode
        var legacyOpts = theme || {}
        var legacyCfg = normaliseConfig(legacyOpts, legacyOpts.mode || 0, legacyOpts.asciiLines)
        stepState(state, legacyBands, legacyCfg.playing, legacyCfg, 0.016)
        var legacyPalette = buildPalette(legacyOpts.themeColours, state.hueShift, legacyCfg.palette)
        ctx.save(); try { drawLayer1Background(ctx, null, w, h, state, legacyOpts.themeColours, legacyPalette, legacyCfg) } finally { ctx.restore() }
        ctx.save(); try { drawLayer2Visualiser(ctx, w, h, state, legacyPalette, legacyCfg) } finally { ctx.restore() }
        ctx.save(); try { drawLayer3AlbumArt(ctx, w, h, state, legacyPalette, legacyCfg, legacyOpts.asciiLines || [], legacyOpts.ttfxFrames || []) } finally { ctx.restore() }
        return
    }

    var effectiveCfg = normaliseConfig(cfg, mode, asciiLines)
    var palette = buildPalette(theme, state.hueShift, effectiveCfg.palette)

    // Layer #1: Background & Iterative Framebuffer Feedback
    ctx.save()
    try {
        drawLayer1Background(ctx, canvasItem, w, h, state, theme, palette, effectiveCfg)
    } finally {
        ctx.restore()
    }

    // Layer #2: Psychedelic & Nightclub Visualiser Engine (with Universal 3D Graded History Tracers)
    ctx.save()
    try {
        drawLayer2Visualiser(ctx, w, h, state, palette, effectiveCfg)
    } finally {
        ctx.restore()
    }

    // Layer #3: Album Art & Words Dismantle, Evolution, Tracers & Rebuild Engine
    ctx.save()
    try {
        drawLayer3AlbumArt(ctx, w, h, state, palette, effectiveCfg, asciiLines, ttfxFrames)
    } finally {
        ctx.restore()
    }
}
