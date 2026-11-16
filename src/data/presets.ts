/**
 * Rich Fallback Presets and Demo Configurations for all Personas.
 * Allows 1-click evaluation without requiring an API key.
 */
import { CompleteSmogPlan, SmogContextInput } from '../types/smog';

export interface PersonaPreset {
  id: string;
  name: string;
  shortDesc: string;
  context: SmogContextInput;
  plan: CompleteSmogPlan;
}

export const PRESET_FAMILY_VULNERABLE: PersonaPreset = {
  id: 'family_vulnerable',
  name: 'Urban Family (Kids & Elderly)',
  shortDesc: 'Family with a 4yo child & 72yo grandparent in a severe winter inversion basin (Delhi NCR, AQI 425).',
  context: {
    persona: 'family_vulnerable',
    cityName: 'Delhi NCR',
    currentAQI: 425,
    temperatureCelsius: 9,
    hasThermalInversion: true,
    ventilationType: 'natural_drafty',
    proximityHazard: 'near_highway',
    commuteMethod: 'private_car_ice',
    commuteDurationMinutes: 45,
    heatingMethod: 'lpg_cylinder',
    cookingFuel: 'lpg',
    airPurifierStatus: 'none',
    householdMembersCount: 4,
    hasVulnerableMembers: true,
    notes: 'Ground floor apartment 150m from arterial bypass road. Morning fog creates dense chemical haze.'
  },
  plan: {
    timestamp: new Date().toISOString(),
    context: {
      persona: 'family_vulnerable',
      cityName: 'Delhi NCR',
      currentAQI: 425,
      temperatureCelsius: 9,
      hasThermalInversion: true,
      ventilationType: 'natural_drafty',
      proximityHazard: 'near_highway',
      commuteMethod: 'private_car_ice',
      commuteDurationMinutes: 45,
      heatingMethod: 'lpg_cylinder',
      cookingFuel: 'lpg',
      airPurifierStatus: 'none',
      householdMembersCount: 4,
      hasVulnerableMembers: true,
      notes: 'Ground floor apartment near highway corridor.'
    },
    deterministicAnalysis: {
      exposureScore: 92,
      vulnerabilityLevel: 'extreme',
      estimatedPm25InhaledMicrogramsPerDay: 485,
      baselineComparisonMultiple: 32.3, // WHO 24h guideline is 15 ug/m3
      peakExposureRiskHours: [
        '06:00 - 09:30 (Morning Boundary Layer Trap & Heavy Freight Inversion)',
        '18:30 - 22:30 (Nighttime Surface Cooling & Stagnant Vehicle Exhaust)'
      ],
      safeVentilationWindows: [
        {
          startHour: '13:00',
          endHour: '15:00',
          recommendedAction: 'Rapid cross-ventilation (15 mins only) through courtyard-facing windows with particulate mesh',
          reason: 'Solar radiation breaks lower inversion boundary, temporary particulate dilution by 40%',
          ambientEstimatedAQI: 260
        }
      ],
      riskAlerts: [
        {
          id: 'alert-crit-1',
          severity: 'critical',
          title: 'Extreme Pediatric & Geriatric Health Hazard',
          message: 'Ambient PM2.5 (340 µg/m³) is triggering systemic inflammatory markers in lungs and bloodstream.',
          mitigation: 'Keep children and grandparents indoors; seal exterior window gaps with weatherstripping tape immediately.'
        },
        {
          id: 'alert-warn-1',
          severity: 'warning',
          title: 'Unvented LPG Combustion Infiltration',
          message: 'LPG room heating + cooking produces nitrogen dioxide (NO2) and carbon monoxide indoors in sealed rooms.',
          mitigation: 'Switch to oil-filled electric radiator or hot water bottles; run kitchen exhaust with cracked baffle.'
        }
      ]
    },
    routine: {
      dailySchedule: [
        {
          id: 'rs-1',
          timeBlock: '06:00 - 08:30',
          originalActivity: 'Early morning park jog & kids waiting outdoors at open bus stop',
          optimizedActivity: 'Indoor stretch routine; coordinate parent carpool/school-van pickup inside covered lobby',
          category: 'Transport',
          exposureReductionPct: 62,
          explanation: 'Early morning winter cold traps particulate matter within 50m of ground level.',
          actionableTip: 'Ensure child wears well-fitted certified KF94 or N95 mask during transit.'
        },
        {
          id: 'rs-2',
          timeBlock: '08:30 - 10:00',
          originalActivity: 'Solo petrol SUV commute via congested ring road with cracked windows',
          optimizedActivity: 'Metro rail transit or carpool with car AC set strictly to recirculate mode',
          category: 'Transport',
          exposureReductionPct: 45,
          explanation: 'Traffic jams generate micro-plumes of toxic black carbon and volatile polycyclic aromatics.',
          actionableTip: 'Check car cabin air filter (replace with HEPA-grade activated carbon filter).'
        },
        {
          id: 'rs-3',
          timeBlock: '13:30 - 14:15',
          originalActivity: 'Keeping all windows shut all day accumulating indoor CO2 and VOCs',
          optimizedActivity: 'Controlled 20-minute rapid aeration during peak solar wind dilution window',
          category: 'Indoor Health',
          exposureReductionPct: 28,
          explanation: 'Thermal turbulence dilutes ground-level smog temporarily in early afternoon.',
          actionableTip: 'Open only courtyard/leeward windows, never street-facing windows.'
        },
        {
          id: 'rs-4',
          timeBlock: '18:00 - 20:30',
          originalActivity: 'Outdoor evening shopping and burning LPG heater in living room',
          optimizedActivity: 'Consolidate deliveries; switch to electric oil-filled radiant heater + layered thermal fleece',
          category: 'Energy/Heating',
          exposureReductionPct: 55,
          explanation: 'Evening temperature inversion causes re-condensation of particulate pollution and biomass smoke.',
          actionableTip: 'Isolate sleeping quarters into a single "clean room" with active filtration.'
        }
      ],
      overallExposureReductionPct: 52.4,
      keyHealthBenefit: 'Reduces daily alveolar particulate deposition by ~255 µg, drastically lowering acute childhood asthma exacerbation risk.',
      optimalOutdoorWindow: '13:00 to 15:30 (Solar mixing window with lowest particulate density)'
    },
    iaq: {
      diyHacks: [
        {
          id: 'diy-cr-box',
          title: 'DIY Corsi-Rosenthal Clean Air Cube',
          difficulty: 'Easy',
          estimatedCost: '$25 - $35 (vs $180 commercial unit)',
          pmReductionEfficiencyPct: 88,
          buildTimeMinutes: 30,
          materials: [
            '1x 20-inch standard box fan ($15)',
            '4x MERV 13 (or F7/H11 equivalent) HVAC air filters (20" x 20")',
            '1x Cardboard shroud (cut to circular diameter of fan blades)',
            'Duct tape / painter’s masking tape'
          ],
          steps: [
            'Form a cube base by taping the four MERV 13 filters together with airflow arrows pointing inward.',
            'Seal the bottom of the cube with a square piece of cardboard.',
            'Place the box fan on top facing upward (blowing filtered air toward the ceiling).',
            'Tape all edges airtight and attach a cardboard circular shroud on top to prevent fan-corner backflow.'
          ],
          scientificRationale: 'Delivers a high Clean Air Delivery Rate (CADR > 220 CFM) with low static backpressure, outperforming many single-filter commercial purifiers.'
        },
        {
          id: 'diy-inversion-seal',
          title: 'Thermal Bubble Window Perimeter Sealing',
          difficulty: 'Easy',
          estimatedCost: '$6 - $10',
          pmReductionEfficiencyPct: 65,
          buildTimeMinutes: 20,
          materials: [
            'EVA foam weatherstripping tape (9mm x 6mm)',
            'Silicone door draft stopper twin-tubes',
            'Clear shrink insulating film or bubble wrap with misting water'
          ],
          steps: [
            'Clean window jambs with rubbing alcohol to remove grease and dust.',
            'Press high-density foam adhesive strip along all sliding sash tracks and bottom rails.',
            'Slide dual-draft excluders under front entry doors facing exterior hallways.',
            'For drafty single-pane windows, apply misted bubble wrap to pane surface as thermal barrier.'
          ],
          scientificRationale: 'Reduces cold-induced stack effect which pulls dirty outdoor air through building envelope fissures.'
        }
      ],
      roomByRoomAssessment: [
        {
          room: 'Children & Elderly Bedroom (Designated Clean Haven)',
          vulnerabilityLevel: 'Severe',
          mainHazardSource: 'Window envelope infiltration + dust mite re-suspension',
          ventilationTimingAdvice: 'Zero outdoor air after 17:00; run air purifier continuously on medium fan speed',
          immediateAction: 'Seal baseboards, introduce HEPA/CR box, maintain indoor relative humidity at 40-50%.'
        },
        {
          room: 'Kitchen & Dining Area',
          vulnerabilityLevel: 'High',
          mainHazardSource: 'LPG combustion byproducts (NO2, ultrafine particles) + oil aerosolization',
          ventilationTimingAdvice: 'Run range hood with exterior damper; keep kitchen door closed from rest of apartment',
          immediateAction: 'Cook with lids on pots to halve fuel burn; switch deep frying to electric steam/boil.'
        },
        {
          room: 'Living Room & Entryway',
          vulnerabilityLevel: 'Moderate',
          mainHazardSource: 'Doorway tracking of street toxic dust and heavy particulate deposition',
          ventilationTimingAdvice: 'Aeration only permitted between 13:00 - 15:00 if winds exceed 6 km/h',
          immediateAction: 'Establish a "shoes-off" double mat entry buffer and damp-mop floors daily (no dry sweeping).'
        }
      ],
      plantRecommendations: [
        {
          name: 'Snake Plant (Sansevieria / Mother-in-Law’s Tongue)',
          scientificName: 'Dracaena trifasciata',
          targetedPollutants: ['Formaldehyde', 'Benzene', 'Trichloroethylene', 'Carbon Dioxide (Night-cycle CAM)'],
          maintenanceEffort: 'Low',
          placementTip: 'Place 2-3 mature pots in bedrooms; releases oxygen and binds VOCs overnight.'
        },
        {
          name: 'Areca Palm',
          scientificName: 'Dypsis lutescens',
          targetedPollutants: ['Xylene', 'Toluene', 'Dry ambient winter micro-particulates'],
          maintenanceEffort: 'Medium',
          placementTip: 'Place near living room window seals; acts as a natural transpirational humidifier in dry smog.'
        }
      ],
      criticalCookingProtocol: 'Always ignite exhaust fan 60 seconds BEFORE lighting burners. Keep doors to sleeping quarters sealed during frying or spice tempering.',
      inversionSealingGuide: 'During severe inversion warnings, tape windows shut with blue painter tape on three sides, leaving only one latchable sash for emergency midday air flushing.'
    },
    impact: {
      comparisons: [
        {
          id: 'imp-1',
          category: 'Heating',
          currentHabit: 'Burning LPG cylinder heater or coal chulha for living room winter warmth',
          sustainableAlternative: '5-star inverter heat-pump / mica-thermic electric radiant panel + wool bedrolls',
          dailyPm25AvertedGrams: 85,
          monthlyCo2eAvertedKg: 64,
          estimatedCostImpact: 'Save $18/mo in cylinder refills; reduces toxic indoor CO/NO2 to 0',
          healthBenefitSummary: 'Eliminates direct indoor combustion emissions responsible for 34% of winter respiratory attacks.'
        },
        {
          id: 'imp-2',
          category: 'Transport',
          currentHabit: 'Daily solo ICE SUV commute in stop-and-go winter traffic gridlock',
          sustainableAlternative: 'Metro rail transit + EV feeder ride-share twice weekly',
          dailyPm25AvertedGrams: 42,
          monthlyCo2eAvertedKg: 110,
          estimatedCostImpact: 'Save $65/mo in fuel & parking; lowers commute stress',
          healthBenefitSummary: 'Avoids prime exposure to highway micro-tunnels with 5x higher benzene concentrations.'
        },
        {
          id: 'imp-3',
          category: 'Cooking',
          currentHabit: 'High-heat open frying on unvented gas burner for 90 minutes daily',
          sustainableAlternative: 'Induction cooktop batch steaming and pressurized slow-cooking with tight lid',
          dailyPm25AvertedGrams: 18,
          monthlyCo2eAvertedKg: 22,
          estimatedCostImpact: 'Neutral operational cost, 40% faster cook times',
          healthBenefitSummary: 'Reduces ultrafine particle count (<0.1 µm) inside home by up to 74%.'
        }
      ],
      totalDailyPmAvertedGrams: 145,
      totalMonthlyCo2eAvertedKg: 196,
      annualHealthRiskDropPct: 41.5,
      equivalentCigarettesAvertedMonthly: 58
    },
    crisis: {
      communityPlaybook: [
        {
          id: 'cp-schools',
          targetAudience: 'Schools',
          triggerCondition: 'Ambient AQI exceeds 350 for 3 consecutive hours',
          immediateActionProtocol: [
            'Immediately cancel all outdoor morning sports, assemblies, and recess activities.',
            'Activate central or classroom MERV-13 filter banks with doors firmly latched.',
            'Deploy mandatory N95 mask guidelines for school bus arrival and departure queues.',
            'Activate hybrid remote study protocol for kindergarten through Grade 5 students.'
          ],
          longTermResilienceStep: 'Install outdoor-indoor AQI monitoring telemetry displays at main entrance to build environmental literacy.'
        },
        {
          id: 'cp-apartments',
          targetAudience: 'Apartment Complexes',
          triggerCondition: 'Severe GRAP Stage IV declaration or AQI > 400',
          immediateActionProtocol: [
            'Halt all non-essential diesel backup generator exercising; enforce 100% grid priority.',
            'Transform the ground floor clubhouse / library into an air-filtered "Clean Haven Refuge" for senior citizens.',
            'Prohibit burning of garden leaves, municipal solid waste, and security guard warming fires; distribute electric heating blankets.',
            'Coordinate building-wide grocery delivery clusters to reduce delivery bike trips.'
          ],
          longTermResilienceStep: 'Form an Air Quality Volunteer Brigade to seal common corridor windows and monitor boiler emissions.'
        }
      ],
      crisisScenarios: [
        {
          id: 'crisis-stubble-inversion',
          scenarioName: 'Sudden Stubble Spike (AQI 520+ Severe+ Emergency)',
          aqiSpike: 520,
          triggerDesc: 'Regional biomass stubble burning combined with 0.8 m/s wind calm and zero thermal lift.',
          urgentProtocols: [
            'Enforce complete home shelter-in-place for children, pregnant women, and seniors.',
            'Tape damp microfiber cloths over external window seams to trap incoming smoke particles.',
            'Run purifiers on maximum boost; turn off any kitchen fresh-air intakes without HEPA scrubbers.',
            'Wear double-strapped N95/FFP2 respirator even for short 2-minute trash disposal tasks.'
          ],
          emergencyFamilyGuideline: 'Monitor resting respiratory rate. If child breathes > 40 breaths/min or exhibits retractions, seek immediate nebulized care.',
          communityAlertMessage: '🚨 HEALTH EMERGENCY: Ambient AQI has breached 500. All outdoor activities forbidden. Clean air shelter active in Community Center B.'
        },
        {
          id: 'crisis-grid-outage',
          scenarioName: 'Winter Power Grid Blackout during Hazardous Smog',
          aqiSpike: 450,
          triggerDesc: 'Substation failure in sub-zero/freezing weather, disabling electric purifiers and heaters.',
          urgentProtocols: [
            'DO NOT burn charcoal, firewood, or gas canisters in closed rooms (deadly CO poisoning risk!).',
            'Isolate family into one interior room without windows; use layered merino wool blankets and hot water bottles.',
            'Wear N95 masks indoors if ambient smoke infiltrates through drafts.',
            'Keep emergency hand-crank or USB battery-powered air quality meter active to track room PM levels.'
          ],
          emergencyFamilyGuideline: 'Maintain body warmth through insulated layering, keep doors closed to retain body heat in a small thermal tent zone.',
          communityAlertMessage: '⚠️ POWER OUTAGE ALERT: Do not burn open solid fuels indoors. Battery-assisted heating stations deployed at Fire Station 4.'
        }
      ]
    },
    source: 'fallback_preset'
  }
};

export const PRESET_OUTDOOR_COMMUTER: PersonaPreset = {
  id: 'outdoor_commuter',
  name: 'Outdoor Commuter & Delivery Field Worker',
  shortDesc: 'Daily 75-minute two-wheeler commute through heavy freight corridor in dense smog (Lahore, AQI 380).',
  context: {
    persona: 'outdoor_commuter',
    cityName: 'Lahore',
    currentAQI: 380,
    temperatureCelsius: 11,
    hasThermalInversion: true,
    ventilationType: 'moderately_sealed',
    proximityHazard: 'near_highway',
    commuteMethod: 'two_wheeler_motorcycle',
    commuteDurationMinutes: 75,
    heatingMethod: 'clean_electric_heatpump',
    cookingFuel: 'piped_natural_gas',
    airPurifierStatus: 'none',
    householdMembersCount: 2,
    hasVulnerableMembers: false,
    notes: 'Motorcycle transit twice daily along ring road freight corridor.'
  },
  plan: {
    timestamp: new Date().toISOString(),
    context: {
      persona: 'outdoor_commuter',
      cityName: 'Lahore',
      currentAQI: 380,
      temperatureCelsius: 11,
      hasThermalInversion: true,
      ventilationType: 'moderately_sealed',
      proximityHazard: 'near_highway',
      commuteMethod: 'two_wheeler_motorcycle',
      commuteDurationMinutes: 75,
      heatingMethod: 'clean_electric_heatpump',
      cookingFuel: 'piped_natural_gas',
      airPurifierStatus: 'none',
      householdMembersCount: 2,
      hasVulnerableMembers: false,
      notes: 'Motorcycle transit twice daily.'
    },
    deterministicAnalysis: {
      exposureScore: 88,
      vulnerabilityLevel: 'high',
      estimatedPm25InhaledMicrogramsPerDay: 540,
      baselineComparisonMultiple: 36.0,
      peakExposureRiskHours: [
        '07:00 - 09:45 (Diesel Freight Inflow & Morning Fog Inversion)',
        '18:00 - 21:30 (Evening Traffic Idling & Smog Pooling)'
      ],
      safeVentilationWindows: [
        {
          startHour: '12:30',
          endHour: '14:30',
          recommendedAction: 'Quick air refresh in workplace or home',
          reason: 'Direct sunlight raises mixing layer ceiling from 120m to 650m',
          ambientEstimatedAQI: 230
        }
      ],
      riskAlerts: [
        {
          id: 'alert-comm-1',
          severity: 'critical',
          title: 'Direct Tailpipe Exhaust & Black Carbon Exposure',
          message: 'Two-wheeler riders breathe 4.5x more elemental carbon and volatile aromatics than enclosed car passengers.',
          mitigation: 'Wear certified N95/FFP2 with exhalation valve; install anti-pollution helmet chin skirt.'
        }
      ]
    },
    routine: {
      dailySchedule: [
        {
          id: 'com-1',
          timeBlock: '07:00 - 08:15',
          originalActivity: 'Direct highway motorcycle commute behind diesel trucks',
          optimizedActivity: 'Depart 40 mins later or route through secondary tree-lined suburban avenues',
          category: 'Transport',
          exposureReductionPct: 48,
          explanation: 'Tree-lined secondary roads buffer up to 35% of coarse particles compared to concrete canyons.',
          actionableTip: 'Ensure tight nasal seal on respirator; replace disposable masks every 40 riding hours.'
        },
        {
          id: 'com-2',
          timeBlock: '12:00 - 13:00',
          originalActivity: 'Eating street food at open-air roadside stall',
          optimizedActivity: 'Shift lunch to indoor sheltered canteen with active particle filtration',
          category: 'Indoor Health',
          exposureReductionPct: 65,
          explanation: 'Roadside food stalls expose respiratory and digestive systems to settled polyaromatic hydrocarbons.',
          actionableTip: 'Rinse face and gargle warm saline to remove particulate deposits from mucous membranes.'
        },
        {
          id: 'com-3',
          timeBlock: '18:15 - 19:30',
          originalActivity: 'Idling motorcycle in bumper-to-bumper evening gridlock',
          optimizedActivity: 'Park & Ride via metro line or shift commute past 20:30 when heavy transit disperses',
          category: 'Transport',
          exposureReductionPct: 52,
          explanation: 'Idling intersections exhibit localized PM2.5 spikes exceeding 800 µg/m³.',
          actionableTip: 'Shut off engine at signals lasting over 20 seconds.'
        }
      ],
      overallExposureReductionPct: 49.2,
      keyHealthBenefit: 'Saves over 260 µg/day of toxic combustion soot, dramatically reducing risk of chronic bronchitis and vascular inflammation.',
      optimalOutdoorWindow: '12:00 to 14:30'
    },
    iaq: {
      diyHacks: [
        {
          id: 'diy-helmet-seal',
          title: 'Field Worker Gear Decontamination & Mask Seal Protocol',
          difficulty: 'Easy',
          estimatedCost: '$8',
          pmReductionEfficiencyPct: 75,
          buildTimeMinutes: 10,
          materials: ['Silicone mask bracket', 'Microfiber wipes', 'Sealable airtight storage container'],
          steps: [
            'Use an inner silicone bracket under N95 to prevent mask collapse during heavy physical breathing.',
            'Wipe helmet visor and external shell before bringing inside living quarters.',
            'Store riding jacket in an isolated vestibule to prevent dust re-suspension in bedrooms.'
          ],
          scientificRationale: 'Prevents secondary indoor inhalation of settled toxic road dust brought inside on motorcycle clothing.'
        }
      ],
      roomByRoomAssessment: [
        {
          room: 'Entry Vestibule / Mudroom',
          vulnerabilityLevel: 'High',
          mainHazardSource: 'Outdoor road soot transfer from riding gear and work boots',
          ventilationTimingAdvice: 'Keep isolated from sleeping spaces',
          immediateAction: 'Strip outer layers at door; use sticky dirt-trapping mat.'
        },
        {
          room: 'Bedroom',
          vulnerabilityLevel: 'Low',
          mainHazardSource: 'Nighttime air infiltration',
          ventilationTimingAdvice: 'Keep sealed overnight',
          immediateAction: 'Run small portable air purifier next to pillow.'
        }
      ],
      plantRecommendations: [
        {
          name: 'Rubber Plant',
          scientificName: 'Ficus elastica',
          targetedPollutants: ['Carbon monoxide', 'Tri-chloroethylene', 'Aerosolized toxins'],
          maintenanceEffort: 'Low',
          placementTip: 'Place near entry hall; large waxy leaves trap settling fine dust particles.'
        }
      ],
      criticalCookingProtocol: 'Avoid indoor stir-frying without high-speed venting after long outdoor shifts.',
      inversionSealingGuide: 'Keep bedroom window taped shut on eastern and highway-facing exposures.'
    },
    impact: {
      comparisons: [
        {
          id: 'imp-c1',
          category: 'Transport',
          currentHabit: 'Solo two-wheeler commute with 2-stroke/4-stroke carbureted engine',
          sustainableAlternative: 'Switch to electric two-wheeler or shared metro rail commute',
          dailyPm25AvertedGrams: 36,
          monthlyCo2eAvertedKg: 78,
          estimatedCostImpact: 'Save $45/mo in fuel and spark-plug maintenance',
          healthBenefitSummary: 'Reduces rider direct lung exposure to volatile unburned hydrocarbons by 80%.'
        }
      ],
      totalDailyPmAvertedGrams: 36,
      totalMonthlyCo2eAvertedKg: 78,
      annualHealthRiskDropPct: 34.0,
      equivalentCigarettesAvertedMonthly: 38
    },
    crisis: {
      communityPlaybook: [
        {
          id: 'cp-commuters',
          targetAudience: 'Workplaces',
          triggerCondition: 'Severe Smog Day (AQI > 350)',
          immediateActionProtocol: [
            'Allow outdoor and logistics staff flexible arrival windows to bypass 07:30 - 09:30 morning peak.',
            'Provide employer-funded certified N95 respirators for all courier and field personnel.',
            'Provide indoor filtered hydration and rest stations at dispatch depots.'
          ],
          longTermResilienceStep: 'Transition corporate delivery fleet to electric commercial scooters with regenerative braking.'
        }
      ],
      crisisScenarios: [
        {
          id: 'crisis-dust-smog-surge',
          scenarioName: 'Industrial Plume & Stagnant Thermal Inversion',
          aqiSpike: 490,
          triggerDesc: 'Temperature dropping to 4°C with absolute zero wind causing industrial corridor plume pooling.',
          urgentProtocols: [
            'Switch to public underground metro; cancel open two-wheeler transit completely.',
            'Double-mask or upgrade to elastomeric half-mask respirator with P100 cartridges.',
            'Wash eyes with sterile saline after field exposure.'
          ],
          emergencyFamilyGuideline: 'Monitor for chest tightness or wheezing; avoid strenuous cardio exertion.',
          communityAlertMessage: '⚠️ COMMUTER ADVISORY: High-risk toxic smog on expressway corridors. Metro frequency augmented.'
        }
      ]
    },
    source: 'fallback_preset'
  }
};

export const PRESET_COMMUNITY_ADMIN: PersonaPreset = {
  id: 'community_admin',
  name: 'Community Leader & School Admin',
  shortDesc: 'Overseeing a residential society of 400 families & K-12 school in a mountain valley smog basin (Salt Lake City / Ulaanbaatar, AQI 310).',
  context: {
    persona: 'community_admin',
    cityName: 'Salt Lake City Basin',
    currentAQI: 310,
    temperatureCelsius: -2,
    hasThermalInversion: true,
    ventilationType: 'tightly_sealed_hvac',
    proximityHazard: 'dense_urban',
    commuteMethod: 'carpool_ev',
    commuteDurationMinutes: 20,
    heatingMethod: 'piped_gas',
    cookingFuel: 'induction_electric',
    airPurifierStatus: 'hepa_commercial',
    householdMembersCount: 450,
    hasVulnerableMembers: true,
    notes: 'Valley topography traps winter cold air pool with woodsmoke and traffic smog.'
  },
  plan: {
    timestamp: new Date().toISOString(),
    context: {
      persona: 'community_admin',
      cityName: 'Salt Lake City Basin',
      currentAQI: 310,
      temperatureCelsius: -2,
      hasThermalInversion: true,
      ventilationType: 'tightly_sealed_hvac',
      proximityHazard: 'dense_urban',
      commuteMethod: 'carpool_ev',
      commuteDurationMinutes: 20,
      heatingMethod: 'piped_gas',
      cookingFuel: 'induction_electric',
      airPurifierStatus: 'hepa_commercial',
      householdMembersCount: 450,
      hasVulnerableMembers: true,
      notes: 'Overseeing community campus.'
    },
    deterministicAnalysis: {
      exposureScore: 74,
      vulnerabilityLevel: 'high',
      estimatedPm25InhaledMicrogramsPerDay: 290,
      baselineComparisonMultiple: 19.3,
      peakExposureRiskHours: [
        '07:30 - 10:00 (Valley Morning Cold Pool Accumulation)',
        '17:00 - 21:00 (Residential Woodsmoke & Vehicle Inversion Cap)'
      ],
      safeVentilationWindows: [
        {
          startHour: '13:30',
          endHour: '15:30',
          recommendedAction: 'HVAC economizer cycle with MERV-14 scrubbers active',
          reason: 'Midday thermal mixing slightly breaks surface inversion cap',
          ambientEstimatedAQI: 180
        }
      ],
      riskAlerts: [
        {
          id: 'alert-comm-leader-1',
          severity: 'warning',
          title: 'Institutional Air Quality Advisory for Minors',
          message: 'Children exercising in AQI > 250 inhale 2.3x more particulate volume per kg body weight than adults.',
          mitigation: 'Move all physical education inside clean gymnasium; run central air scrubbers.'
        }
      ]
    },
    routine: {
      dailySchedule: [
        {
          id: 'sch-1',
          timeBlock: '07:30 - 08:30',
          originalActivity: 'Open-gate student dropoff with hundreds of idling cars in school parking lot',
          optimizedActivity: 'Implement "No-Idling Zone" with remote drop-off loop & staggered entry times',
          category: 'Community Action',
          exposureReductionPct: 58,
          explanation: 'Idling cold combustion engines emit dense clouds of uncombusted VOCs and PM2.5 right at children eye level.',
          actionableTip: 'Deploy student air marshals to issue friendly reminder cards to idling parents.'
        },
        {
          id: 'sch-2',
          timeBlock: '10:00 - 11:30',
          originalActivity: 'Outdoor recess and sports practice in the schoolyard',
          optimizedActivity: 'Indoor gymnasium activity with active HEPA filtration and air quality monitors',
          category: 'Indoor Health',
          exposureReductionPct: 70,
          explanation: 'Strenuous cardio in cold smog leads to deep bronchial constriction and microvascular distress.',
          actionableTip: 'Use digital color-coded AQI LED flags (Green/Yellow/Red/Purple) visible to students.'
        },
        {
          id: 'sch-3',
          timeBlock: '16:00 - 18:00',
          originalActivity: 'Residents burning decorative or supplemental fireplace wood in apartment society',
          optimizedActivity: 'Enforce society-wide clean heat rule; open heated community lounge for social hours',
          category: 'Energy/Heating',
          exposureReductionPct: 62,
          explanation: 'Single residential woodstove emits as much PM2.5 per hour as 60 modern diesel passenger cars.',
          actionableTip: 'Offer subsidized bulk electricity heating vouchers through community association.'
        }
      ],
      overallExposureReductionPct: 63.3,
      keyHealthBenefit: 'Protects 350+ school children and elderly residents from severe asthma attacks and bronchitis flare-ups.',
      optimalOutdoorWindow: '13:30 to 15:30'
    },
    iaq: {
      diyHacks: [
        {
          id: 'diy-classroom-cube',
          title: 'Classroom Scale MERV-13 Dual-Fan Air Scrubbers',
          difficulty: 'Moderate',
          estimatedCost: '$65 per classroom (CADR 450 CFM)',
          pmReductionEfficiencyPct: 92,
          buildTimeMinutes: 45,
          materials: ['2x 20-inch box fans', '5x MERV-13 20x25 filters', 'Plywood base with locking caster wheels'],
          steps: [
            'Assemble a high-volume pentagonal filter bay.',
            'Mount dual top fans blowing upward at low whisper-quiet speed.',
            'Add sound-dampening foam rings to prevent classroom audio distraction.',
            'Run continuously during all instructional hours.'
          ],
          scientificRationale: 'Provides 5.5 air changes per hour (ACH) in typical 600 sq ft classrooms, dropping particulate load by over 90% in 25 minutes.'
        }
      ],
      roomByRoomAssessment: [
        {
          room: 'School Gymnasium & Auditorium',
          vulnerabilityLevel: 'Low',
          mainHazardSource: 'High human occupancy and outdoor fresh-air damper infiltration',
          ventilationTimingAdvice: 'Keep dampers at minimum 15% fresh air; maximize MERV-14 recirculation loop',
          immediateAction: 'Convert into designated Community Clean Air Sanctuary open to vulnerable neighborhood seniors.'
        },
        {
          room: 'Classrooms (North & West Facing)',
          vulnerabilityLevel: 'Moderate',
          mainHazardSource: 'Old single-pane window draft leaks',
          ventilationTimingAdvice: 'Never open windows during morning inversion; use scheduled afternoon purge',
          immediateAction: 'Apply magnetic silicone draft tape along window sashes.'
        }
      ],
      plantRecommendations: [
        {
          name: 'Peace Lily',
          scientificName: 'Spathiphyllum',
          targetedPollutants: ['Benzene', 'Formaldehyde', 'Trichloroethylene'],
          maintenanceEffort: 'Low',
          placementTip: 'Place along library and admin desk counters.'
        }
      ],
      criticalCookingProtocol: 'School cafeteria commercial hoods must use grease baffles and certified electrostatic precipitators.',
      inversionSealingGuide: 'Perform building envelope smoke-pen audits before first winter cold wave.'
    },
    impact: {
      comparisons: [
        {
          id: 'imp-admin-1',
          category: 'Heating',
          currentHabit: 'Allowing 40 households to burn residential fireplace logs during valley inversion',
          sustainableAlternative: 'Society ban on decorative solid wood burning with central radiant electric heating',
          dailyPm25AvertedGrams: 3200,
          monthlyCo2eAvertedKg: 4200,
          estimatedCostImpact: 'Neutral for community; prevents $15,000 in collective emergency medical expenses',
          healthBenefitSummary: 'Lowers neighborhood-wide ambient PM2.5 by 28% within 200m radius of residential block.'
        },
        {
          id: 'imp-admin-2',
          category: 'Transport',
          currentHabit: '300 parents individual solo car drop-offs idling for 15 minutes each morning',
          sustainableAlternative: 'Consolidated electric community shuttle buses & organized walking school bus from safe radius',
          dailyPm25AvertedGrams: 480,
          monthlyCo2eAvertedKg: 1800,
          estimatedCostImpact: 'Save parents $35/student/month in gasoline',
          healthBenefitSummary: 'Eliminates peak morning toxic exhaust plume in school entrance zone.'
        }
      ],
      totalDailyPmAvertedGrams: 3680,
      totalMonthlyCo2eAvertedKg: 6000,
      annualHealthRiskDropPct: 56.0,
      equivalentCigarettesAvertedMonthly: 620
    },
    crisis: {
      communityPlaybook: [
        {
          id: 'cp-valley-inversion',
          targetAudience: 'Apartment Complexes',
          triggerCondition: 'Persistent Multi-Day Winter Valley Inversion (AQI > 300 for 48+ hours)',
          immediateActionProtocol: [
            'Trigger Phase 2 Winter Resilience Protocol: Mandate clean fuels only.',
            'Activate 24/7 Community Clean Air Haven in the social center with emergency oxygen supplies.',
            'Coordinate bulk grocery purchasing for isolated elderly residents to prevent unnecessary outdoor trips.',
            'Send automated SMS air alerts at 06:30 and 17:30 daily to all resident families.'
          ],
          longTermResilienceStep: 'Procure community-owned industrial HEPA trailers and establish rooftop solar arrays for uninterrupted clean filtration during grid brownouts.'
        }
      ],
      crisisScenarios: [
        {
          id: 'crisis-persistent-inversion',
          scenarioName: '7-Day Stagnant Winter Inversion Cap (AQI 450+)',
          aqiSpike: 450,
          triggerDesc: 'Dense freezing high-pressure dome traps all valley emissions for over a week.',
          urgentProtocols: [
            'Transition all primary and middle school grades to synchronous remote learning.',
            'Open school gym with industrial filtration as 24-hour clean air shelter for unhoused and vulnerable citizens.',
            'Suspend non-critical municipal vehicle movements.'
          ],
          emergencyFamilyGuideline: 'Maintain strictly filtered indoor haven; vulnerable members should wear N95 even inside if indoor PM exceeds 35 µg/m³.',
          communityAlertMessage: '🚨 VALLEY CRISIS: Cold air pool trapped under inversion. School sports suspended. Shelter open at Main Gymnasium.'
        }
      ]
    },
    source: 'fallback_preset'
  }
};

export const PRESET_RESPIRATORY_PATIENT: PersonaPreset = {
  id: 'respiratory_patient',
  name: 'Asthma & Respiratory Patient',
  shortDesc: 'Individual with chronic adult-onset asthma in a heavily polluted industrial city (Beijing, AQI 345).',
  context: {
    persona: 'respiratory_patient',
    cityName: 'Beijing / Industrial Basin',
    currentAQI: 345,
    temperatureCelsius: 4,
    hasThermalInversion: true,
    ventilationType: 'moderately_sealed',
    proximityHazard: 'near_industrial',
    commuteMethod: 'work_from_home',
    commuteDurationMinutes: 0,
    heatingMethod: 'clean_electric_heatpump',
    cookingFuel: 'induction_electric',
    airPurifierStatus: 'hepa_commercial',
    householdMembersCount: 2,
    hasVulnerableMembers: true,
    notes: 'Severe airway hyperreactivity triggered by PM2.5 > 75 µg/m³ and sudden temperature drops.'
  },
  plan: {
    timestamp: new Date().toISOString(),
    context: {
      persona: 'respiratory_patient',
      cityName: 'Beijing / Industrial Basin',
      currentAQI: 345,
      temperatureCelsius: 4,
      hasThermalInversion: true,
      ventilationType: 'moderately_sealed',
      proximityHazard: 'near_industrial',
      commuteMethod: 'work_from_home',
      commuteDurationMinutes: 0,
      heatingMethod: 'clean_electric_heatpump',
      cookingFuel: 'induction_electric',
      airPurifierStatus: 'hepa_commercial',
      householdMembersCount: 2,
      hasVulnerableMembers: true,
      notes: 'Asthma patient.'
    },
    deterministicAnalysis: {
      exposureScore: 82,
      vulnerabilityLevel: 'extreme',
      estimatedPm25InhaledMicrogramsPerDay: 220,
      baselineComparisonMultiple: 14.6,
      peakExposureRiskHours: [
        '05:30 - 09:30 (Dawn Cold Inversion & Industrial Plume Trapping)',
        '19:00 - 23:00 (Evening Radiational Cooling & Low Mixing Height)'
      ],
      safeVentilationWindows: [
        {
          startHour: '13:00',
          endHour: '14:30',
          recommendedAction: 'Micro-aeration through activated carbon filter mesh only',
          reason: 'Surface temperature warming provides brief particulate thinning',
          ambientEstimatedAQI: 210
        }
      ],
      riskAlerts: [
        {
          id: 'alert-asthma-1',
          severity: 'critical',
          title: 'Extreme Bronchospasm & Airway Inflammation Warning',
          message: 'Fine particulate matter penetrates terminal bronchioles and triggers eosinophilic cascade.',
          mitigation: 'Keep prescribed rescue inhaler (SABA) within arm reach; verify peak flow meter readings twice daily.'
        }
      ]
    },
    routine: {
      dailySchedule: [
        {
          id: 'rp-1',
          timeBlock: '06:00 - 08:00',
          originalActivity: 'Stepping outside onto balcony to check weather and drink warm tea',
          optimizedActivity: 'Strictly remain indoors; check outdoor digital sensor remotely; turn on bedroom humidifier',
          category: 'Indoor Health',
          exposureReductionPct: 75,
          explanation: 'Sudden inhalation of cold, smoggy morning air triggers immediate bronchospasm in asthmatic airways.',
          actionableTip: 'Breathe through nose or warm indoor scarf for first 15 minutes of waking.'
        },
        {
          id: 'rp-2',
          timeBlock: '12:00 - 13:00',
          originalActivity: 'Cooking with pungent aromatic spices without kitchen isolation',
          optimizedActivity: 'Steam-based low-oil meal preparation with closed kitchen door & active exhaust',
          category: 'Indoor Health',
          exposureReductionPct: 60,
          explanation: 'Aerosolized capsaicin and frying smoke exacerbate hyper-reactive bronchial tissue.',
          actionableTip: 'Maintain continuous HEPA filtration in adjoining dining space.'
        },
        {
          id: 'rp-3',
          timeBlock: '17:30 - 18:30',
          originalActivity: 'Leaving home for outdoor evening pharmacy run or groceries',
          optimizedActivity: 'Order online delivery or delegate errands; schedule medical check-ins via telemedicine',
          category: 'Transport',
          exposureReductionPct: 70,
          explanation: 'Evening temperature drops push dirty smog into stagnant ground-level pooling.',
          actionableTip: 'If transit is mandatory, don a fit-tested silicone half-mask respirator with P100 filters.'
        }
      ],
      overallExposureReductionPct: 68.3,
      keyHealthBenefit: 'Prevents acute peak flow drops (<80% personal best), averting nocturnal asthma attacks and ER visits.',
      optimalOutdoorWindow: '13:00 to 14:30 (Only if mandatory with P100 respirator)'
    },
    iaq: {
      diyHacks: [
        {
          id: 'diy-positive-pressure-bedroom',
          title: 'Positive Pressure Clean Sanctuary Bedroom Protocol',
          difficulty: 'Moderate',
          estimatedCost: '$40',
          pmReductionEfficiencyPct: 95,
          buildTimeMinutes: 35,
          materials: ['Continuous-run true HEPA filter with sealed gasket', 'Silicone perimeter door sweep', 'Airtight magnetic threshold seal'],
          steps: [
            'Seal bedroom perimeter windows with removable silicone glazing tape.',
            'Install silicone door sweep on bottom of bedroom door to prevent hallway draft ingress.',
            'Position HEPA filter 1 meter from head of bed facing airflow directly across breathing zone.',
            'Maintain indoor PM2.5 under 5 µg/m³ continuously.'
          ],
          scientificRationale: 'Sleeping in a truly clean environment gives alveolar macrophages 8 hours to clear inflammatory particulate residues.'
        }
      ],
      roomByRoomAssessment: [
        {
          room: 'Master Bedroom (Primary Recovery Zone)',
          vulnerabilityLevel: 'Severe',
          mainHazardSource: 'Bedding lint, dust mites, and nighttime infiltration',
          ventilationTimingAdvice: '100% sealed during winter smog season; no open windows',
          immediateAction: 'Wash bedsheets weekly in 60°C water; run HEPA on continuous whisper mode 24/7.'
        },
        {
          room: 'Bathroom',
          vulnerabilityLevel: 'Moderate',
          mainHazardSource: 'High humidity mold spore risk vs dry winter air',
          ventilationTimingAdvice: 'Run exhaust fan for 20 minutes post-shower with door cracked',
          immediateAction: 'Ensure no black mold develops in shower corners (mold toxins intensify asthma by 300%).'
        }
      ],
      plantRecommendations: [
        {
          name: 'Boston Fern',
          scientificName: 'Nephrolepis exaltata',
          targetedPollutants: ['Formaldehyde', 'Xylene', 'Dry air humidification'],
          maintenanceEffort: 'Medium',
          placementTip: 'Place in bathroom or bedroom corner; acts as a natural air humidifier.'
        }
      ],
      criticalCookingProtocol: 'Strict zero-smoke cooking protocol: avoid stir-frying, grilling, and deep frying entirely on smog warning days.',
      inversionSealingGuide: 'Inspect window silicone seals before winter; use painter tape to seal edges of secondary windows.'
    },
    impact: {
      comparisons: [
        {
          id: 'imp-rp-1',
          category: 'Heating',
          currentHabit: 'Drafty room with supplementary oil radiator running intermittently',
          sustainableAlternative: 'Airtight insulated sanctuary room with inverter heat-pump and continuous HEPA filtration',
          dailyPm25AvertedGrams: 28,
          monthlyCo2eAvertedKg: 45,
          estimatedCostImpact: 'Save $120/mo in averted emergency corticosteroids and inhalers',
          healthBenefitSummary: 'Reduces bronchial eosinophilia and nighttime awakenings by over 85%.'
        }
      ],
      totalDailyPmAvertedGrams: 28,
      totalMonthlyCo2eAvertedKg: 45,
      annualHealthRiskDropPct: 62.0,
      equivalentCigarettesAvertedMonthly: 44
    },
    crisis: {
      communityPlaybook: [
        {
          id: 'cp-respiratory-support',
          targetAudience: 'Neighborhoods',
          triggerCondition: 'AQI > 300 or Thermal Inversion Red Alert',
          immediateActionProtocol: [
            'Register on local high-risk respiratory vulnerable resident registry.',
            'Confirm 14-day supply of controller medications (ICS-LABA) and rescue inhalers.',
            'Coordinate check-in buddy with neighbor for emergency assistance.',
            'Keep portable battery power bank ready for electronic nebulizer machines.'
          ],
          longTermResilienceStep: 'Advocate for municipal clean-air refuge centers equipped with medical grade air scrubbers within 15 minutes of every residential cluster.'
        }
      ],
      crisisScenarios: [
        {
          id: 'crisis-respiratory-emergency',
          scenarioName: 'Peak Smog Inversion with Sudden Medication Shortage',
          aqiSpike: 480,
          triggerDesc: 'AQI breaches 480 while local pharmacies face supply chain delays during smog lockdown.',
          urgentProtocols: [
            'Immediately activate emergency tele-health consultation with pulmonologist.',
            'Isolate inside positive-pressure clean room; avoid speaking or exertion to conserve lung capacity.',
            'Practice pursed-lip breathing and warm steam inhalation from purified water.',
            'If peak expiratory flow drops into the Red Zone (<50%), dial emergency medical services without delay.'
          ],
          emergencyFamilyGuideline: 'Keep emergency hospital route pre-mapped with vehicle set to internal air circulation only.',
          communityAlertMessage: '🚨 VULNERABLE CITIZEN ALERT: Extreme respiratory hazard in progress. Free emergency inhaler delivery active via Red Cross helpline.'
        }
      ]
    },
    source: 'fallback_preset'
  }
};

export const ALL_PRESETS: Record<string, PersonaPreset> = {
  family_vulnerable: PRESET_FAMILY_VULNERABLE,
  outdoor_commuter: PRESET_OUTDOOR_COMMUTER,
  community_admin: PRESET_COMMUNITY_ADMIN,
  respiratory_patient: PRESET_RESPIRATORY_PATIENT,
};

export const DEFAULT_PRESET = PRESET_FAMILY_VULNERABLE;
