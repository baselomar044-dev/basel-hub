// Expert AI Systems - Deep Specialized Knowledge
// Each AI is a true expert, not just a persona

// ============================================================
// 🏗️ QS ENGINEER EXPERT SYSTEM
// ============================================================
export const qsExpertSystem = {
  identity: {
    name: 'QS Expert AI',
    role: 'Senior Quantity Surveyor & Cost Consultant',
    experience: '20+ years in UAE construction industry',
    certifications: ['MRICS', 'PQS', 'ICES'],
    specialization: 'High-rise buildings, luxury villas, infrastructure'
  },

  // Dubai Material Prices (Updated Q1 2024)
  materialPrices: {
    concrete: {
      'C20': { price: 280, unit: 'AED/m³', notes: 'Standard mix' },
      'C25': { price: 300, unit: 'AED/m³', notes: 'Structural' },
      'C30': { price: 320, unit: 'AED/m³', notes: 'High strength' },
      'C35': { price: 350, unit: 'AED/m³', notes: 'Columns/beams' },
      'C40': { price: 380, unit: 'AED/m³', notes: 'High-rise' },
      'C45': { price: 420, unit: 'AED/m³', notes: 'Special structures' },
      'C50': { price: 480, unit: 'AED/m³', notes: 'Bridges/towers' },
    },
    steel: {
      'rebar_8mm': { price: 2800, unit: 'AED/ton', notes: 'Stirrups' },
      'rebar_10mm': { price: 2750, unit: 'AED/ton', notes: 'Slabs' },
      'rebar_12mm': { price: 2700, unit: 'AED/ton', notes: 'Slabs/beams' },
      'rebar_16mm': { price: 2650, unit: 'AED/ton', notes: 'Beams' },
      'rebar_20mm': { price: 2600, unit: 'AED/ton', notes: 'Columns' },
      'rebar_25mm': { price: 2550, unit: 'AED/ton', notes: 'Heavy columns' },
      'rebar_32mm': { price: 2500, unit: 'AED/ton', notes: 'Foundations' },
      'structural_steel': { price: 4500, unit: 'AED/ton', notes: 'I-beams, channels' },
      'mesh_a142': { price: 15, unit: 'AED/m²', notes: 'Slab mesh' },
      'mesh_a193': { price: 20, unit: 'AED/m²', notes: 'Heavy slab mesh' },
    },
    blocks: {
      '4inch_hollow': { price: 1.8, unit: 'AED/pc', notes: '400x200x100mm' },
      '6inch_hollow': { price: 2.5, unit: 'AED/pc', notes: '400x200x150mm' },
      '8inch_hollow': { price: 3.2, unit: 'AED/pc', notes: '400x200x200mm' },
      '8inch_solid': { price: 4.5, unit: 'AED/pc', notes: 'Load bearing' },
      '10inch_hollow': { price: 4.0, unit: 'AED/pc', notes: '400x200x250mm' },
      '12inch_hollow': { price: 5.0, unit: 'AED/pc', notes: '400x200x300mm' },
      'thermal_block': { price: 8.0, unit: 'AED/pc', notes: 'Insulated' },
      'aac_block': { price: 6.5, unit: 'AED/pc', notes: 'Autoclaved Aerated' },
    },
    cement: {
      'opc_50kg': { price: 14, unit: 'AED/bag', notes: 'Ordinary Portland' },
      'src_50kg': { price: 18, unit: 'AED/bag', notes: 'Sulfate Resistant' },
      'white_cement': { price: 35, unit: 'AED/bag', notes: 'Finishing' },
    },
    sand: {
      'washed_sand': { price: 45, unit: 'AED/m³', notes: 'Plastering' },
      'dune_sand': { price: 25, unit: 'AED/m³', notes: 'Filling' },
      'crusher_sand': { price: 55, unit: 'AED/m³', notes: 'Concrete' },
    },
    aggregate: {
      '10mm': { price: 65, unit: 'AED/m³', notes: 'Fine aggregate' },
      '20mm': { price: 60, unit: 'AED/m³', notes: 'Standard' },
      '40mm': { price: 55, unit: 'AED/m³', notes: 'Foundation' },
    },
    waterproofing: {
      'bitumen_membrane': { price: 45, unit: 'AED/m²', notes: '4mm APP' },
      'liquid_membrane': { price: 35, unit: 'AED/m²', notes: 'Brush applied' },
      'crystalline': { price: 55, unit: 'AED/m²', notes: 'Xypex type' },
      'bentonite': { price: 40, unit: 'AED/m²', notes: 'Below grade' },
    },
    insulation: {
      'eps_50mm': { price: 25, unit: 'AED/m²', notes: 'Thermal' },
      'xps_50mm': { price: 45, unit: 'AED/m²', notes: 'High density' },
      'rockwool_50mm': { price: 35, unit: 'AED/m²', notes: 'Fire rated' },
      'pu_spray': { price: 85, unit: 'AED/m²', notes: 'Spray foam' },
    },
    finishes: {
      'ceramic_tiles': { price: 45, unit: 'AED/m²', notes: 'Standard' },
      'porcelain_tiles': { price: 85, unit: 'AED/m²', notes: 'Premium' },
      'marble': { price: 250, unit: 'AED/m²', notes: 'Local marble' },
      'granite': { price: 180, unit: 'AED/m²', notes: 'Standard' },
      'gypsum_board': { price: 45, unit: 'AED/m²', notes: 'Ceiling' },
      'paint_interior': { price: 18, unit: 'AED/m²', notes: '3 coats' },
      'paint_exterior': { price: 25, unit: 'AED/m²', notes: 'Weather shield' },
      'epoxy_floor': { price: 120, unit: 'AED/m²', notes: 'Industrial' },
    },
    mep: {
      'electrical_point': { price: 180, unit: 'AED/point', notes: 'Standard' },
      'plumbing_point': { price: 350, unit: 'AED/point', notes: 'Including pipes' },
      'ac_ton': { price: 3500, unit: 'AED/ton', notes: 'Split unit' },
      'central_ac': { price: 5000, unit: 'AED/ton', notes: 'Chilled water' },
      'fire_alarm_point': { price: 450, unit: 'AED/point', notes: 'Addressable' },
      'sprinkler_head': { price: 350, unit: 'AED/head', notes: 'Including pipe' },
    },
    doors_windows: {
      'wooden_door': { price: 1200, unit: 'AED/leaf', notes: 'Solid core' },
      'fire_door': { price: 2500, unit: 'AED/leaf', notes: '2 hour rated' },
      'aluminum_window': { price: 650, unit: 'AED/m²', notes: 'Powder coated' },
      'upvc_window': { price: 450, unit: 'AED/m²', notes: 'Double glazed' },
      'curtain_wall': { price: 1200, unit: 'AED/m²', notes: 'Structural glazing' },
    },
    external: {
      'interlock': { price: 85, unit: 'AED/m²', notes: 'Standard 60mm' },
      'asphalt': { price: 120, unit: 'AED/m²', notes: '50mm wearing' },
      'curb_stone': { price: 45, unit: 'AED/lm', notes: 'Precast' },
      'boundary_wall': { price: 450, unit: 'AED/m²', notes: 'Plastered both sides' },
    },
  },

  // Labor Rates (Dubai 2024)
  laborRates: {
    'mason': { rate: 80, unit: 'AED/day', notes: 'Block/plaster work' },
    'carpenter': { rate: 90, unit: 'AED/day', notes: 'Formwork' },
    'steel_fixer': { rate: 85, unit: 'AED/day', notes: 'Rebar work' },
    'plumber': { rate: 100, unit: 'AED/day', notes: 'MEP works' },
    'electrician': { rate: 100, unit: 'AED/day', notes: 'Electrical works' },
    'painter': { rate: 70, unit: 'AED/day', notes: 'Painting works' },
    'tiler': { rate: 90, unit: 'AED/day', notes: 'Tiling works' },
    'helper': { rate: 50, unit: 'AED/day', notes: 'Unskilled labor' },
    'foreman': { rate: 150, unit: 'AED/day', notes: 'Supervision' },
    'site_engineer': { rate: 350, unit: 'AED/day', notes: 'Technical supervision' },
    'project_manager': { rate: 700, unit: 'AED/day', notes: 'Management' },
  },

  // Equipment Rates
  equipmentRates: {
    'tower_crane': { rate: 25000, unit: 'AED/month', notes: 'Including operator' },
    'mobile_crane_50t': { rate: 3500, unit: 'AED/day', notes: 'Including operator' },
    'excavator': { rate: 800, unit: 'AED/day', notes: 'Including operator' },
    'loader': { rate: 600, unit: 'AED/day', notes: 'Including operator' },
    'concrete_pump': { rate: 2500, unit: 'AED/day', notes: 'Boom pump' },
    'generator_100kva': { rate: 150, unit: 'AED/day', notes: 'Including fuel' },
    'scaffolding': { rate: 15, unit: 'AED/m²/month', notes: 'Steel scaffold' },
    'formwork': { rate: 85, unit: 'AED/m²', notes: 'Slab formwork' },
  },

  // Productivity Rates
  productivity: {
    'blockwork': { rate: 25, unit: 'm²/mason/day', notes: 'Standard blocks' },
    'plastering': { rate: 15, unit: 'm²/mason/day', notes: 'Internal' },
    'tiling': { rate: 8, unit: 'm²/tiler/day', notes: 'Floor tiles' },
    'painting': { rate: 25, unit: 'm²/painter/day', notes: '3 coats' },
    'rebar_fixing': { rate: 400, unit: 'kg/fixer/day', notes: 'Slabs' },
    'concrete_pour': { rate: 50, unit: 'm³/gang/day', notes: 'Slab pour' },
    'formwork': { rate: 15, unit: 'm²/carpenter/day', notes: 'Slab formwork' },
  },

  // Dubai Municipality Regulations
  regulations: {
    dubaiMunicipality: {
      'building_permit': 'Required for all construction. Process: 1) NOC from master developer, 2) Structural drawings approval, 3) MEP approval, 4) Civil defense approval, 5) Final permit',
      'setbacks': 'Front: min 3m residential, 0m commercial. Side: 3m min for G+1, increases with height',
      'plot_coverage': 'Residential: 50-60% depending on zone. Commercial: up to 100% in certain zones',
      'far': 'Floor Area Ratio varies by zone: 1.5-3.5 residential, up to 10+ in commercial zones',
      'height_limit': 'Varies by zone. Airport restriction zones apply. Check with DCAA for high-rise',
      'parking': 'Residential: 1 per unit + 10% visitor. Office: 1 per 45m². Retail: 1 per 25m²',
      'basement': 'Allowed for parking. Must not exceed plot boundary. Waterproofing mandatory',
      'boundary_wall': 'Max height 1.8m front, 2.4m sides/rear. Requires separate permit',
    },
    dewa: {
      'load_calculation': 'Submit load calculation with application. Residential: 100W/m², Commercial: 150W/m²',
      'meter_room': 'Required for buildings >10 units. Min size 3x3m with ventilation',
      'solar_panels': 'Mandatory for buildings >2000m². Shams Dubai initiative compliance',
      'water_tank': 'Min 2 days storage. Material: GRP or concrete. Annual cleaning certificate',
      'irrigation': 'Separate meter required. TSE connection mandatory where available',
      'district_cooling': 'Mandatory in designated areas. Empower/Emicool connection',
      'green_building': 'Al Safat rating mandatory for govt buildings. LEED encouraged for private',
    },
    civilDefense: {
      'fire_rating': 'Structure: 2 hours min. Escape routes: 1 hour. Fire doors: 2 hours',
      'escape_routes': 'Max travel distance: 30m to exit. Min width: 1.2m. Emergency lighting required',
      'sprinklers': 'Required for buildings >15m or >500m² per floor. NFPA compliant',
      'fire_alarm': 'Addressable system for buildings >15m. Manual call points every 30m',
      'smoke_control': 'Pressurization for stairs >15m. Smoke extract for basement parking',
      'fire_pump': 'Diesel + electric pumps. Min 90 minutes fuel. Weekly testing log',
      'refuge_area': 'Required every 25 floors for high-rise. Min 15m² + 1m²/200 persons',
      'helipad': 'Required for buildings >150m. Structural load 15 tons. Fire suppression',
    },
    trakhees: {
      'jafza_permit': 'Special permits for JAFZA area. Industrial standards apply',
      'palm_permits': 'Nakheel approval required. Special foundation requirements',
      'marina_permits': 'Dubai Marina specific regulations. Height restrictions',
    },
    accessibility: {
      'ramps': 'Max slope 1:12. Handrails both sides. Non-slip surface',
      'lifts': 'Min 1 accessible lift per building. 1.4x1.1m min size',
      'toilets': 'Min 1 accessible toilet per floor. 1.5x1.5m min',
      'parking': 'Min 2% spaces accessible. Near entrance. 3.6m wide',
      'signage': 'Tactile and braille signage required. High contrast colors',
    },
  },

  // BOQ Templates
  boqTemplates: {
    villa: {
      name: 'Standard Villa G+1',
      sections: [
        { code: 'A', name: 'Preliminaries', items: ['Site setup', 'Insurance', 'Supervision', 'Temporary works'] },
        { code: 'B', name: 'Substructure', items: ['Excavation', 'Blinding', 'Raft foundation', 'Waterproofing', 'Backfill'] },
        { code: 'C', name: 'Concrete Frame', items: ['Columns', 'Beams', 'Slabs', 'Stairs', 'Parapet'] },
        { code: 'D', name: 'Blockwork', items: ['External walls', 'Internal walls', 'Boundary wall'] },
        { code: 'E', name: 'Roofing', items: ['Waterproofing', 'Insulation', 'Screed', 'Tiles'] },
        { code: 'F', name: 'Finishes', items: ['Plastering', 'Painting', 'Tiling', 'Ceilings', 'Doors', 'Windows'] },
        { code: 'G', name: 'MEP', items: ['Electrical', 'Plumbing', 'HVAC', 'Fire fighting'] },
        { code: 'H', name: 'External Works', items: ['Interlock', 'Landscaping', 'Swimming pool', 'Boundary wall'] },
      ],
    },
    building: {
      name: 'Commercial Building G+4',
      sections: [
        { code: 'A', name: 'Preliminaries & General Requirements', items: ['Insurance', 'Bonds', 'Site facilities', 'Supervision', 'H&S'] },
        { code: 'B', name: 'Demolition & Site Preparation', items: ['Demolition', 'Site clearance', 'Dewatering', 'Shoring'] },
        { code: 'C', name: 'Earthworks', items: ['Excavation', 'Filling', 'Compaction', 'Disposal'] },
        { code: 'D', name: 'Substructure', items: ['Piling', 'Pile caps', 'Ground beams', 'Raft', 'Retaining walls'] },
        { code: 'E', name: 'Concrete Superstructure', items: ['Columns', 'Beams', 'Slabs', 'Stairs', 'Ramps'] },
        { code: 'F', name: 'Masonry', items: ['External walls', 'Internal walls', 'Fire walls'] },
        { code: 'G', name: 'Structural Steel', items: ['Steel frame', 'Roof structure', 'Canopies'] },
        { code: 'H', name: 'Waterproofing', items: ['Basement', 'Wet areas', 'Roof'] },
        { code: 'I', name: 'Thermal Insulation', items: ['Walls', 'Roof', 'Pipes'] },
        { code: 'J', name: 'Roofing', items: ['Roof covering', 'Flashings', 'Accessories'] },
        { code: 'K', name: 'External Walls & Cladding', items: ['Curtain wall', 'Cladding', 'Louvers'] },
        { code: 'L', name: 'Windows & Doors', items: ['Aluminum windows', 'Fire doors', 'Internal doors', 'Hardware'] },
        { code: 'M', name: 'Internal Finishes', items: ['Floor finishes', 'Wall finishes', 'Ceiling', 'Painting'] },
        { code: 'N', name: 'Fittings & Equipment', items: ['Signage', 'Blinds', 'Mirrors', 'Accessories'] },
        { code: 'O', name: 'Sanitary Fittings', items: ['WCs', 'Basins', 'Accessories'] },
        { code: 'P', name: 'MEP Services', items: ['Electrical', 'Plumbing', 'HVAC', 'Fire fighting', 'BMS', 'Lifts'] },
        { code: 'Q', name: 'External Works', items: ['Roads', 'Parking', 'Landscaping', 'Utilities'] },
      ],
    },
    fitout: {
      name: 'Office Fit-out',
      sections: [
        { code: 'A', name: 'Preliminaries', items: ['Mobilization', 'Protection', 'Cleaning'] },
        { code: 'B', name: 'Partitions', items: ['Gypsum partitions', 'Glass partitions', 'Doors'] },
        { code: 'C', name: 'Ceilings', items: ['Gypsum ceiling', 'Metal ceiling', 'Bulkheads'] },
        { code: 'D', name: 'Flooring', items: ['Raised floor', 'Carpet', 'Vinyl', 'Tiles'] },
        { code: 'E', name: 'Joinery', items: ['Reception desk', 'Storage', 'Pantry units'] },
        { code: 'F', name: 'Painting & Wallpaper', items: ['Painting', 'Wallpaper', 'Special finishes'] },
        { code: 'G', name: 'MEP', items: ['Electrical', 'Data/Tel', 'AC modification', 'Plumbing'] },
        { code: 'H', name: 'FF&E', items: ['Furniture', 'Fixtures', 'Equipment'] },
      ],
    },
  },

  // Cost Estimation Formulas
  formulas: {
    concreteVolume: {
      slab: '(Length × Width × Thickness) × 1.05 (wastage)',
      beam: '(Length × Width × Depth) × number of beams × 1.05',
      column: '(Side × Side × Height) × number of columns × 1.05',
      raft: '(Length × Width × Thickness) × 1.08 (for irregularity)',
    },
    steelWeight: {
      slab: 'Concrete volume × 80-100 kg/m³ (typical)',
      beam: 'Concrete volume × 150-180 kg/m³ (typical)',
      column: 'Concrete volume × 200-250 kg/m³ (typical)',
      raft: 'Concrete volume × 120-150 kg/m³ (typical)',
    },
    blockwork: {
      quantity: 'Wall area ÷ (block length × block height) × 1.05',
      mortar: 'Number of blocks × 0.001 m³ per block',
      labor: 'Wall area ÷ 25 m²/day = mason days',
    },
    plastering: {
      area: '(Wall length × height) × 2 sides × 1.1 (openings adjustment)',
      material: 'Area × 0.015 m³ cement mortar per m²',
      labor: 'Area ÷ 15 m²/day = mason days',
    },
    painting: {
      area: 'Plastered area × 1.0 (same as plaster)',
      paint: 'Area ÷ 12 m²/liter × 3 coats = liters needed',
      labor: 'Area ÷ 25 m²/day = painter days',
    },
    tiling: {
      quantity: 'Floor/wall area × 1.1 (cutting wastage)',
      adhesive: 'Area × 4-5 kg/m²',
      grout: 'Area × 0.5 kg/m²',
    },
    mep: {
      electrical: 'BUA × 180-220 AED/m² (standard)',
      plumbing: 'Number of fixtures × 2,500-3,500 AED/fixture',
      hvac: 'Cooling load tons × 3,500-5,000 AED/ton',
      firefighting: 'BUA × 80-120 AED/m²',
    },
    preliminaries: {
      percentage: 'Total construction cost × 8-12%',
      duration: 'Total cost ÷ monthly spend rate = months',
    },
    contingency: {
      standard: 'Total cost × 5% (standard projects)',
      complex: 'Total cost × 10% (complex/renovation)',
    },
  },

  // Analysis Capabilities
  analysisCapabilities: [
    'BOQ preparation and review',
    'Cost estimation and budgeting',
    'Tender analysis and comparison',
    'Variation order assessment',
    'Progress payment certification',
    'Final account preparation',
    'Value engineering suggestions',
    'Risk assessment and mitigation',
    'Drawing take-off and measurement',
    'Specification review',
    'Contract administration support',
    'Dispute resolution support',
  ],
}

// ============================================================
// 💜 THERAPIST EXPERT SYSTEM
// ============================================================
export const therapistExpertSystem = {
  identity: {
    name: 'Therapeutic AI Companion',
    approach: 'Integrative therapy with CBT, DBT, and humanistic elements',
    style: 'Warm, empathetic, non-judgmental, culturally sensitive',
    languages: ['Arabic', 'English'],
    focus: 'Emotional support, personal growth, mental wellness'
  },

  // Therapeutic Techniques
  techniques: {
    cbt: {
      name: 'Cognitive Behavioral Therapy',
      description: 'Identifying and changing negative thought patterns',
      exercises: [
        {
          name: 'Thought Record',
          steps: [
            'ما هو الموقف الذي حدث؟',
            'ما الأفكار التي راودتك؟',
            'ما المشاعر التي شعرت بها؟ (0-100)',
            'ما الدليل الذي يدعم هذه الأفكار؟',
            'ما الدليل الذي يعارضها؟',
            'ما الفكرة البديلة الأكثر توازناً؟',
            'كيف تشعر الآن؟ (0-100)'
          ]
        },
        {
          name: 'Cognitive Distortions',
          types: [
            'التفكير بالأبيض والأسود - كل شيء إما مثالي أو كارثة',
            'التعميم المفرط - حادثة واحدة = دائماً',
            'التصفية العقلية - التركيز على السلبي فقط',
            'استبعاد الإيجابي - "ده مش يحسب"',
            'القفز للاستنتاجات - قراءة الأفكار والتنبؤ بالمستقبل',
            'التهويل والتقليل',
            'التفكير العاطفي - "أحس كده يبقى كده"',
            'عبارات "يجب" و"لازم"',
            'التسمية - "أنا فاشل" بدلاً من "أخطأت"',
            'الشخصنة - لوم النفس على كل شيء'
          ]
        },
        {
          name: 'Behavioral Activation',
          description: 'جدولة أنشطة ممتعة وذات معنى لتحسين المزاج',
          steps: ['اختر نشاط صغير', 'حدد وقت محدد', 'نفذه بغض النظر عن المزاج', 'سجل كيف شعرت']
        }
      ]
    },
    dbt: {
      name: 'Dialectical Behavior Therapy',
      description: 'مهارات التأقلم مع المشاعر الصعبة',
      skills: {
        distressTolerance: [
          'TIPP: Temperature, Intense exercise, Paced breathing, Progressive relaxation',
          'STOP: Stop, Take a step back, Observe, Proceed mindfully',
          'ACCEPTS: Activities, Contributing, Comparisons, Emotions, Push away, Thoughts, Sensations',
          'Self-soothe with 5 senses',
          'IMPROVE the moment: Imagery, Meaning, Prayer, Relaxation, One thing, Vacation, Encouragement'
        ],
        emotionRegulation: [
          'تسمية المشاعر بدقة',
          'فهم وظيفة المشاعر',
          'تقليل الهشاشة العاطفية: PLEASE skills',
          'زيادة المشاعر الإيجابية',
          'التصرف عكس المشاعر السلبية',
          'تقبل المشاعر دون حكم'
        ],
        interpersonalEffectiveness: [
          'DEAR MAN: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate',
          'GIVE: Gentle, Interested, Validate, Easy manner',
          'FAST: Fair, Apologies (no over-apologizing), Stick to values, Truthful'
        ],
        mindfulness: [
          'ملاحظة - لاحظ أفكارك ومشاعرك',
          'وصف - صف ما تلاحظه بكلمات',
          'مشاركة - انخرط بالكامل في اللحظة',
          'بدون حكم - تجنب التقييم',
          'بتركيز - شيء واحد في وقت واحد',
          'بفعالية - افعل ما ينفع'
        ]
      }
    },
    relaxation: {
      breathing: [
        {
          name: 'Box Breathing (4-4-4-4)',
          steps: ['شهيق 4 ثواني', 'حبس 4 ثواني', 'زفير 4 ثواني', 'حبس 4 ثواني'],
          benefits: 'يهدئ الجهاز العصبي'
        },
        {
          name: '4-7-8 Breathing',
          steps: ['شهيق 4 ثواني', 'حبس 7 ثواني', 'زفير 8 ثواني'],
          benefits: 'يساعد على النوم والاسترخاء العميق'
        },
        {
          name: 'Diaphragmatic Breathing',
          steps: ['ضع يدك على بطنك', 'تنفس ببطء وعمق', 'لاحظ ارتفاع بطنك', 'زفير ببطء'],
          benefits: 'تنفس صحي يومي'
        }
      ],
      grounding: [
        {
          name: '5-4-3-2-1 Technique',
          steps: [
            '5 أشياء تراها',
            '4 أشياء تلمسها',
            '3 أشياء تسمعها',
            '2 أشياء تشمها',
            '1 شيء تتذوقه'
          ],
          use: 'للقلق ونوبات الهلع'
        },
        {
          name: 'Body Scan',
          description: 'مسح تدريجي للجسم من القدمين للرأس مع الاسترخاء',
          duration: '10-20 دقيقة'
        }
      ]
    },
    positiveпсихology: {
      gratitude: {
        description: '3 أشياء أنت ممتن لها يومياً',
        benefits: 'يحسن المزاج والنظرة للحياة'
      },
      strengths: {
        description: 'تحديد نقاط قوتك واستخدامها',
        examples: ['الإبداع', 'الشجاعة', 'اللطف', 'الحكمة', 'العدل', 'القيادة']
      },
      meaningAndPurpose: {
        description: 'إيجاد المعنى في الحياة اليومية',
        questions: ['ما الذي يهمك حقاً؟', 'كيف تريد أن تُذكر؟', 'ما الذي يعطيك طاقة؟']
      }
    }
  },

  // Mood Tracking
  moodTracking: {
    scale: '1-10',
    emotions: [
      'سعادة', 'حزن', 'قلق', 'غضب', 'خوف', 
      'إحباط', 'أمل', 'حماس', 'ملل', 'وحدة',
      'امتنان', 'حب', 'ذنب', 'خجل', 'فخر'
    ],
    triggers: ['عمل', 'علاقات', 'صحة', 'مال', 'نوم', 'طعام', 'تمارين'],
    patterns: 'تتبع الأنماط على مدار الأسابيع'
  },

  // Crisis Support
  crisisSupport: {
    warningSignals: [
      'أفكار عن إيذاء النفس',
      'الشعور باليأس التام',
      'العزلة الشديدة',
      'تغيرات حادة في السلوك',
      'التخلي عن الممتلكات'
    ],
    immediateSteps: [
      'أنت لست وحدك',
      'هذه المشاعر مؤقتة',
      'تواصل مع شخص تثق به',
      'اتصل بخط مساعدة نفسية',
      'اذهب لأقرب طوارئ إذا كان هناك خطر فوري'
    ],
    hotlines: {
      uae: '800HOPE (4673) - Befrienders UAE',
      ksa: '920033360 - وزارة الصحة',
      egypt: '0220816831 - خط نجدة الطفل والأسرة',
      general: 'تواصل مع طبيب أو معالج نفسي محترف'
    }
  },

  // Self-Care Recommendations
  selfCare: {
    daily: [
      'نوم 7-8 ساعات',
      'شرب ماء كافي',
      'وجبات منتظمة',
      'حركة/رياضة',
      'وقت بدون شاشات',
      'تواصل اجتماعي'
    ],
    weekly: [
      'نشاط ممتع',
      'وقت في الطبيعة',
      'هواية',
      'راحة حقيقية'
    ]
  },

  // Conversation Patterns
  conversationPatterns: {
    opening: [
      'أهلاً بك، كيف حالك اليوم؟ 💜',
      'سعيد بوجودك هنا. كيف يمكنني مساعدتك؟',
      'مرحباً، أنا هنا للاستماع إليك.'
    ],
    validation: [
      'من الطبيعي أن تشعر هكذا',
      'مشاعرك مهمة ومفهومة',
      'شكراً لمشاركتي هذا',
      'أقدر ثقتك بي'
    ],
    empathy: [
      'يبدو أن هذا صعب عليك',
      'أستطيع أن أفهم لماذا تشعر هكذا',
      'هذا موقف صعب فعلاً'
    ],
    encouragement: [
      'أنت أقوى مما تظن',
      'كل خطوة صغيرة مهمة',
      'التعافي رحلة، لا سباق',
      'أنت تستحق السعادة'
    ]
  }
}

// ============================================================
// 💻 DEV EXPERT SYSTEM
// ============================================================
export const devExpertSystem = {
  identity: {
    name: 'Senior Full-Stack Developer AI',
    experience: '15+ years in software development',
    specialization: 'Modern web applications, AI integration, scalable systems',
    philosophy: 'Clean code, best practices, developer experience'
  },

  // Tech Stack Expertise
  expertise: {
    frontend: {
      frameworks: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte'],
      styling: ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'SASS'],
      stateManagement: ['Redux', 'Zustand', 'Jotai', 'React Query', 'SWR'],
      testing: ['Jest', 'React Testing Library', 'Cypress', 'Playwright'],
      buildTools: ['Vite', 'Webpack', 'Turbopack', 'esbuild']
    },
    backend: {
      languages: ['Node.js', 'Python', 'Go', 'Rust', 'Java'],
      frameworks: ['Express', 'Fastify', 'NestJS', 'FastAPI', 'Django'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'],
      orm: ['Prisma', 'Drizzle', 'TypeORM', 'SQLAlchemy'],
      api: ['REST', 'GraphQL', 'tRPC', 'gRPC']
    },
    ai: {
      llms: ['OpenAI GPT-4', 'Claude', 'Gemini', 'Llama', 'Mistral'],
      frameworks: ['LangChain', 'LlamaIndex', 'Vercel AI SDK', 'AutoGen'],
      vectorDbs: ['Pinecone', 'Weaviate', 'Chroma', 'Milvus'],
      features: ['RAG', 'Agents', 'Function Calling', 'Embeddings', 'Fine-tuning']
    },
    devops: {
      cloud: ['AWS', 'GCP', 'Azure', 'Vercel', 'Railway'],
      containers: ['Docker', 'Kubernetes', 'Docker Compose'],
      cicd: ['GitHub Actions', 'GitLab CI', 'Jenkins'],
      monitoring: ['Datadog', 'Sentry', 'LogRocket']
    },
    mobile: {
      frameworks: ['React Native', 'Flutter', 'Expo'],
      features: ['Push Notifications', 'Deep Linking', 'Offline Support']
    }
  },

  // Project Templates
  projectTemplates: {
    nextjsFullStack: {
      name: 'Next.js Full-Stack App',
      features: ['App Router', 'Server Components', 'API Routes', 'Auth', 'Database'],
      structure: [
        'src/app/(auth)/',
        'src/app/(dashboard)/',
        'src/app/api/',
        'src/components/',
        'src/lib/',
        'src/hooks/',
        'prisma/'
      ]
    },
    aiSaas: {
      name: 'AI-Powered SaaS',
      features: ['AI Chat', 'Subscription', 'User Auth', 'Dashboard', 'API'],
      stack: ['Next.js', 'Supabase', 'Stripe', 'OpenAI', 'Vercel']
    },
    ecommerce: {
      name: 'E-commerce Platform',
      features: ['Product Catalog', 'Cart', 'Checkout', 'Payments', 'Admin'],
      stack: ['Next.js', 'Shopify/Custom', 'Stripe', 'Algolia']
    },
    mobileApp: {
      name: 'Cross-Platform Mobile App',
      features: ['Auth', 'Push Notifications', 'Offline', 'API Integration'],
      stack: ['React Native', 'Expo', 'Firebase']
    }
  },

  // Best Practices
  bestPractices: {
    code: [
      'TypeScript for type safety',
      'ESLint + Prettier for consistency',
      'Meaningful variable/function names',
      'Single responsibility principle',
      'DRY (Don\'t Repeat Yourself)',
      'KISS (Keep It Simple, Stupid)',
      'Write tests for critical paths'
    ],
    architecture: [
      'Separation of concerns',
      'Dependency injection',
      'Repository pattern for data access',
      'Service layer for business logic',
      'API versioning',
      'Error handling middleware'
    ],
    security: [
      'Input validation',
      'SQL injection prevention',
      'XSS protection',
      'CSRF tokens',
      'Rate limiting',
      'Secure headers',
      'Environment variables for secrets'
    ],
    performance: [
      'Code splitting',
      'Image optimization',
      'Caching strategies',
      'Database indexing',
      'CDN usage',
      'Lazy loading'
    ]
  },

  // Code Generation Rules
  codeGeneration: {
    rules: [
      'Always generate complete, working code',
      'Include all necessary imports',
      'Add TypeScript types',
      'Include error handling',
      'Add helpful comments',
      'Follow project conventions',
      'Make code production-ready'
    ],
    output: 'Generate actual files, not explanations. Create ZIP for multi-file projects.'
  }
}

// ============================================================
// ✍️ WRITER EXPERT SYSTEM
// ============================================================
export const writerExpertSystem = {
  identity: {
    name: 'Professional Content Writer AI',
    experience: 'Expert in Arabic and English content creation',
    specialization: 'Marketing, technical writing, creative content, SEO',
    style: 'Engaging, clear, culturally aware'
  },

  // Writing Styles
  styles: {
    marketing: {
      description: 'Persuasive, benefit-focused, call-to-action driven',
      techniques: ['AIDA', 'PAS', 'FAB', 'Storytelling'],
      formats: ['Ads', 'Landing pages', 'Email campaigns', 'Social media']
    },
    technical: {
      description: 'Clear, precise, structured',
      formats: ['Documentation', 'Tutorials', 'API guides', 'Whitepapers']
    },
    creative: {
      description: 'Imaginative, emotional, engaging',
      formats: ['Stories', 'Scripts', 'Poetry', 'Brand voice']
    },
    academic: {
      description: 'Formal, researched, cited',
      formats: ['Research papers', 'Essays', 'Reports', 'Proposals']
    },
    journalistic: {
      description: 'Factual, balanced, newsworthy',
      formats: ['Articles', 'Press releases', 'Interviews', 'Features']
    }
  },

  // SEO Knowledge
  seo: {
    onPage: [
      'Keyword research and placement',
      'Title tags and meta descriptions',
      'Header hierarchy (H1, H2, H3)',
      'Internal linking',
      'Image alt text',
      'URL structure',
      'Content length and depth'
    ],
    contentStrategy: [
      'Topic clusters',
      'Pillar content',
      'Search intent matching',
      'Featured snippet optimization',
      'E-A-T (Expertise, Authority, Trust)'
    ]
  },

  // Arabic Writing
  arabic: {
    formalLevels: ['فصحى', 'فصحى معاصرة', 'عامية راقية', 'عامية'],
    dialects: ['مصري', 'خليجي', 'شامي', 'مغربي'],
    considerations: [
      'Right-to-left formatting',
      'Formal vs informal addressing',
      'Cultural references',
      'Religious sensitivity',
      'Gender considerations'
    ]
  },

  // Templates
  templates: {
    blogPost: {
      structure: ['Hook', 'Introduction', 'Main points', 'Examples', 'Conclusion', 'CTA'],
      wordCount: '1500-2500 words for SEO'
    },
    socialMedia: {
      platforms: {
        twitter: '280 chars, hashtags, engaging',
        linkedin: 'Professional, value-driven, 1300 chars',
        instagram: 'Visual focus, 2200 chars, relevant hashtags',
        facebook: 'Conversational, shareable, varied length'
      }
    },
    email: {
      types: ['Newsletter', 'Promotional', 'Transactional', 'Welcome series'],
      structure: ['Subject line', 'Preview text', 'Body', 'CTA', 'Footer']
    }
  }
}

// ============================================================
// 🦉 WISE EXPERT SYSTEM
// ============================================================
export const wiseExpertSystem = {
  identity: {
    name: 'Sage Advisor AI',
    approach: 'Philosophical wisdom combined with practical advice',
    sources: 'Islamic wisdom, Arabic heritage, universal philosophy, modern psychology',
    style: 'Thoughtful, deep, inspiring yet practical'
  },

  // Wisdom Sources
  sources: {
    islamic: {
      quran: 'Guidance from Quran on life matters',
      hadith: 'Prophetic wisdom and advice',
      scholars: 'Insights from Islamic scholars'
    },
    arabic: {
      poetry: 'المتنبي، أبو تمام، نزار قباني',
      proverbs: 'أمثال عربية وحكم',
      literature: 'أدب عربي كلاسيكي ومعاصر'
    },
    philosophy: {
      eastern: 'Confucius, Lao Tzu, Buddha',
      western: 'Stoicism, Aristotle, Modern philosophers',
      universal: 'Timeless wisdom across cultures'
    }
  },

  // Life Areas
  lifeAreas: {
    purpose: {
      questions: ['ما هدفك في الحياة؟', 'ما الذي يعطي حياتك معنى؟'],
      guidance: 'Finding meaning and direction'
    },
    relationships: {
      family: 'بر الوالدين، تربية الأبناء، صلة الرحم',
      marriage: 'بناء علاقة زوجية ناجحة',
      friendship: 'اختيار الأصدقاء والحفاظ على الصداقات',
      work: 'علاقات العمل والتعامل مع الآخرين'
    },
    success: {
      definition: 'النجاح الحقيقي vs النجاح الظاهري',
      balance: 'التوازن بين الدنيا والآخرة',
      patience: 'الصبر والمثابرة',
      gratitude: 'الشكر والرضا'
    },
    challenges: {
      adversity: 'التعامل مع الشدائد',
      failure: 'التعلم من الفشل',
      loss: 'التعامل مع الفقد',
      change: 'التكيف مع التغيير'
    },
    growth: {
      selfImprovement: 'تطوير الذات',
      learning: 'طلب العلم',
      character: 'بناء الشخصية',
      habits: 'بناء عادات إيجابية'
    }
  },

  // Wisdom Quotes
  quotes: {
    arabic: [
      'من جد وجد ومن زرع حصد',
      'العلم في الصغر كالنقش على الحجر',
      'الصبر مفتاح الفرج',
      'رب أخ لك لم تلده أمك',
      'إذا هبّت رياحك فاغتنمها'
    ],
    universal: [
      'The only true wisdom is knowing you know nothing - Socrates',
      'Be the change you wish to see in the world - Gandhi',
      'The journey of a thousand miles begins with a single step - Lao Tzu'
    ]
  },

  // Conversation Style
  style: {
    approach: 'Listen deeply, understand the real question behind the question',
    response: 'Combine ancient wisdom with practical modern advice',
    tone: 'Warm, respectful, thought-provoking'
  }
}

// ============================================================
// 🖥️ COMPUTER EXPERT SYSTEM
// ============================================================
export const computerExpertSystem = {
  identity: {
    name: 'Computer Control AI',
    capabilities: 'Browser automation, code execution, system tasks',
    approach: 'Precise, efficient, thorough'
  },

  // Browser Capabilities
  browser: {
    actions: [
      'Navigate to URLs',
      'Take screenshots',
      'Click elements',
      'Fill forms',
      'Extract data',
      'Handle popups',
      'Manage cookies',
      'Execute JavaScript'
    ],
    useCases: [
      'Web scraping',
      'Form automation',
      'Testing websites',
      'Data extraction',
      'Screenshot capture',
      'Price monitoring',
      'Social media automation'
    ]
  },

  // Code Execution
  codeExecution: {
    languages: ['Python', 'JavaScript', 'Shell/Bash'],
    capabilities: [
      'Run scripts',
      'Process data',
      'File manipulation',
      'API calls',
      'Data analysis',
      'Image processing',
      'Web requests'
    ],
    libraries: {
      python: ['pandas', 'numpy', 'requests', 'beautifulsoup', 'pillow', 'matplotlib'],
      javascript: ['axios', 'cheerio', 'puppeteer', 'sharp']
    }
  },

  // Task Types
  taskTypes: {
    research: 'Search and compile information from multiple sources',
    automation: 'Automate repetitive web tasks',
    extraction: 'Extract structured data from websites',
    monitoring: 'Monitor websites for changes',
    testing: 'Test web applications',
    documentation: 'Screenshot and document processes'
  }
}

// Export all expert systems
export const expertSystems = {
  qs: qsExpertSystem,
  therapist: therapistExpertSystem,
  dev: devExpertSystem,
  writer: writerExpertSystem,
  wise: wiseExpertSystem,
  computer: computerExpertSystem
}
