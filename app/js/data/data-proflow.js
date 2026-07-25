/* Seed dataset — ProFlow Plumbing (reference dataset: other data-*.js files
   copy these exact shapes). All people, contacts and suppliers are fictional.
   Dates are relative to today via d(offset[, 'HH:MM']) so the demo stays live. */
(function () {
  'use strict';
  var d = DEMO.util.d;

  DEMO.registerData('proflow-plumbing', {

    customers: [
      { id: 'c1', name: 'Karen Mitchell', suburb: 'Emu Plains', phone: '0410 223 481', email: 'karen.mitchell@examplemail.com.au' },
      { id: 'c2', name: 'Raj Patel', suburb: 'Glenmore Park', phone: '0433 907 265', email: 'raj.patel@examplemail.com.au' },
      { id: 'c3', name: 'Sophie Nguyen', suburb: 'Jordan Springs', phone: '0401 558 372', email: 'sophie.nguyen@examplemail.com.au' },
      { id: 'c4', name: 'Dave Holloway', suburb: 'Penrith', phone: '0422 016 984', email: 'dave.holloway@examplemail.com.au' },
      { id: 'c5', name: 'Maria Costa', suburb: 'St Marys', phone: '0439 274 610', email: 'maria.costa@examplemail.com.au' },
      { id: 'c6', name: 'Ben Sutherland', suburb: 'Cranebrook', phone: '0417 830 296', email: 'ben.sutherland@examplemail.com.au' },
      { id: 'c7', name: 'Lisa Tran', suburb: 'Kingswood', phone: '0405 662 148', email: 'lisa.tran@examplemail.com.au' },
      { id: 'c8', name: 'Ahmed Hassan', suburb: 'Werrington', phone: '0428 391 507', email: 'ahmed.hassan@examplemail.com.au' },
      { id: 'c9', name: 'Nicole Barrett', suburb: 'Leonay', phone: '0413 745 029', email: 'nicole.barrett@examplemail.com.au' },
      { id: 'c10', name: 'Grant Ellis — Peachtree Strata', suburb: 'South Penrith', phone: '0402 118 663', email: 'grant.ellis@examplemail.com.au' },
      { id: 'c11', name: 'Tegan Walsh', suburb: 'Cambridge Park', phone: '0431 596 802', email: 'tegan.walsh@examplemail.com.au' },
      { id: 'c12', name: 'Peter Kovac', suburb: 'Mulgoa', phone: '0419 037 254', email: 'peter.kovac@examplemail.com.au' }
    ],

    /* status: scheduled | in_progress | done | invoiced
       source: manual | booking | quote | maintenance */
    jobs: [
      { id: 'j1', customerId: 'c5', title: 'Blocked sewer drain — jet clear', status: 'invoiced', start: d(-9, '08:00'), durationHrs: 2, assignee: 'Shane', source: 'manual', notes: 'Tree roots at boundary trap. Recommended annual jet.' },
      { id: 'j2', customerId: 'c2', title: 'Replace burst flexi hose under kitchen sink', status: 'invoiced', start: d(-8, '10:30'), durationHrs: 1, assignee: 'Mitch', source: 'booking', notes: '' },
      { id: 'j3', customerId: 'c7', title: 'Hot water system replacement — 315L electric', status: 'invoiced', start: d(-6, '07:30'), durationHrs: 4, assignee: 'Shane', source: 'quote', quoteId: 'q1', notes: 'Old unit leaking from base. New unit on existing pad.' },
      { id: 'j4', customerId: 'c10', title: 'Backflow device annual test — Peachtree Strata', status: 'done', start: d(-3, '09:00'), durationHrs: 1.5, assignee: 'Lena', source: 'maintenance', notes: 'Passed. Report lodged.' },
      { id: 'j5', customerId: 'c1', title: 'Leaking ensuite toilet — cistern rebuild', status: 'done', start: d(-2, '13:00'), durationHrs: 1, assignee: 'Mitch', source: 'booking', notes: '' },
      { id: 'j6', customerId: 'c8', title: 'Gas cooktop connection & compliance cert', status: 'done', start: d(-1, '08:30'), durationHrs: 2, assignee: 'Shane', source: 'manual', notes: '' },
      { id: 'j7', customerId: 'c3', title: 'Blocked stormwater drain — front yard', status: 'in_progress', start: d(0, '07:30'), durationHrs: 2, assignee: 'Shane', source: 'booking', notes: 'Camera inspection included.' },
      { id: 'j8', customerId: 'c6', title: 'Dripping mixer taps ×3 — service', status: 'scheduled', start: d(0, '10:30'), durationHrs: 1.5, assignee: 'Mitch', source: 'booking', notes: '' },
      { id: 'j9', customerId: 'c9', title: 'Quote visit — bathroom reno rough-in', status: 'scheduled', start: d(0, '14:00'), durationHrs: 1, assignee: 'Shane', source: 'manual', notes: 'Take measurements for q4.' },
      { id: 'j10', customerId: 'c11', title: 'Hot water not heating — element check', status: 'scheduled', start: d(1, '08:00'), durationHrs: 1.5, assignee: 'Lena', source: 'booking', notes: '' },
      { id: 'j11', customerId: 'c4', title: 'Install dishwasher & new stop valve', status: 'scheduled', start: d(1, '11:00'), durationHrs: 1.5, assignee: 'Mitch', source: 'manual', notes: '' },
      { id: 'j12', customerId: 'c12', title: 'Rural pressure pump service', status: 'scheduled', start: d(2, '09:00'), durationHrs: 2, assignee: 'Shane', source: 'manual', notes: 'Bring spare pressure switch.' },
      { id: 'j13', customerId: 'c10', title: 'TMV annual service — Peachtree common areas', status: 'scheduled', start: d(3, '08:00'), durationHrs: 2.5, assignee: 'Lena', source: 'maintenance', notes: '' },
      { id: 'j14', customerId: 'c5', title: 'Replace garden tap & install rain head', status: 'scheduled', start: d(4, '13:30'), durationHrs: 1.5, assignee: 'Mitch', source: 'booking', notes: '' },
      { id: 'j15', customerId: 'c8', title: 'Re-washer laundry taps & check WM hoses', status: 'scheduled', start: d(5, '10:00'), durationHrs: 1, assignee: 'Lena', source: 'booking', notes: '' },
      { id: 'j16', customerId: 'c2', title: 'Hot water anode inspection', status: 'scheduled', start: d(6, '08:30'), durationHrs: 1, assignee: 'Shane', source: 'maintenance', notes: '' }
    ],

    /* status: draft | sent | accepted | declined */
    quotes: [
      { id: 'q1', customerId: 'c7', status: 'accepted', date: d(-10), notes: 'Converted to job j3.',
        lines: [
          { desc: '315L electric hot water system (supply)', qty: 1, unit: 'ea', price: 1480 },
          { desc: 'HWS install & removal of old unit', qty: 1, unit: 'ea', price: 650 }
        ] },
      { id: 'q2', customerId: 'c9', status: 'sent', date: d(-4), notes: 'Bathroom reno rough-in. Site visit booked (j9).',
        lines: [
          { desc: 'Bathroom rough-in — new PEX supply lines', qty: 1, unit: 'ea', price: 2350 },
          { desc: 'Floor waste & drainage relocation', qty: 1, unit: 'ea', price: 980 },
          { desc: 'Additional labour', qty: 6, unit: 'hr', price: 110 }
        ] },
      { id: 'q3', customerId: 'c10', status: 'accepted', date: d(-7), notes: 'Strata annual compliance bundle.',
        lines: [
          { desc: 'Backflow device annual test & report', qty: 4, unit: 'ea', price: 145 },
          { desc: 'TMV annual service', qty: 3, unit: 'ea', price: 185 }
        ] },
      { id: 'q4', customerId: 'c6', status: 'sent', date: d(-2), notes: '',
        lines: [
          { desc: 'Replace 3× mixer taps (supply & fit)', qty: 3, unit: 'ea', price: 265 }
        ] },
      { id: 'q5', customerId: 'c12', status: 'draft', date: d(-1), notes: 'Waiting on pump model confirmation.',
        lines: [
          { desc: 'Pressure pump replacement (supply)', qty: 1, unit: 'ea', price: 1180 },
          { desc: 'Install & commission', qty: 1, unit: 'ea', price: 340 }
        ] },
      { id: 'q6', customerId: 'c4', status: 'declined', date: d(-12), notes: 'Went with cheaper quote.',
        lines: [
          { desc: 'Whole-house water filtration system', qty: 1, unit: 'ea', price: 2650 },
          { desc: 'Install & commission', qty: 1, unit: 'ea', price: 420 }
        ] },
      { id: 'q7', customerId: 'c3', status: 'sent', date: d(0), notes: 'Follow-up from today’s stormwater job.',
        lines: [
          { desc: 'Stormwater relining — 6m section', qty: 1, unit: 'ea', price: 3900 }
        ] },
      { id: 'q8', customerId: 'c1', status: 'draft', date: d(0), notes: '',
        lines: [
          { desc: 'Replace ensuite vanity mixer (supply & fit)', qty: 1, unit: 'ea', price: 310 }
        ] }
    ],

    /* status: draft | sent | paid | overdue */
    invoices: [
      { id: 'i1', jobId: 'j1', customerId: 'c5', status: 'paid', issued: d(-8), due: d(6),
        lines: [
          { desc: 'Blocked drain — high-pressure jet clear', qty: 1, unit: 'ea', price: 380 },
          { desc: 'CCTV drain inspection', qty: 1, unit: 'ea', price: 180 }
        ] },
      { id: 'i2', jobId: 'j2', customerId: 'c2', status: 'paid', issued: d(-7), due: d(7),
        lines: [
          { desc: 'Call-out & first hour labour', qty: 1, unit: 'ea', price: 165 },
          { desc: 'Braided flexi hose replacement', qty: 1, unit: 'ea', price: 85 }
        ] },
      { id: 'i3', jobId: 'j3', customerId: 'c7', status: 'sent', issued: d(-5), due: d(9),
        lines: [
          { desc: '315L electric hot water system (supply)', qty: 1, unit: 'ea', price: 1480 },
          { desc: 'HWS install & removal of old unit', qty: 1, unit: 'ea', price: 650 }
        ] },
      { id: 'i4', jobId: 'j4', customerId: 'c10', status: 'sent', issued: d(-2), due: d(12),
        lines: [
          { desc: 'Backflow device annual test & report', qty: 1, unit: 'ea', price: 145 }
        ] },
      { id: 'i5', jobId: null, customerId: 'c4', status: 'overdue', issued: d(-35), due: d(-21),
        lines: [
          { desc: 'Emergency call-out — burst pipe (after hours)', qty: 1, unit: 'ea', price: 330 },
          { desc: 'Copper pipe repair & lagging', qty: 1, unit: 'ea', price: 240 }
        ] },
      { id: 'i6', jobId: 'j5', customerId: 'c1', status: 'paid', issued: d(-1), due: d(13),
        lines: [
          { desc: 'Toilet cistern rebuild kit (fitted)', qty: 1, unit: 'ea', price: 120 },
          { desc: 'Call-out & first hour labour', qty: 1, unit: 'ea', price: 165 }
        ] }
    ],

    suppliers: [
      { id: 's1', name: 'Nepean Plumbing Supplies', contact: 'Trish Doyle', phone: '(02) 4731 2280', email: 'orders@nepeanplumbing.example.com.au', terms: '30 days' },
      { id: 's2', name: 'Westline Pipe & Fittings', contact: 'Marco Silvestri', phone: '(02) 9672 4415', email: 'sales@westlinepf.example.com.au', terms: '14 days' },
      { id: 's3', name: 'AquaMax Hot Water Distributors', contact: 'Belinda Chu', phone: '1300 118 226', email: 'trade@aquamaxhw.example.com.au', terms: '30 days' },
      { id: 's4', name: 'TradeBolt Fasteners & Fixings', contact: 'Counter sales', phone: '(02) 4722 9038', email: 'penrith@tradebolt.example.com.au', terms: 'COD' }
    ],

    /* status: draft | sent | received */
    purchaseOrders: [
      { id: 'po1', supplierId: 's3', status: 'received', date: d(-7),
        lines: [
          { stockId: 'st1', qty: 2, unitCost: 1120 },
          { stockId: 'st12', qty: 4, unitCost: 38 }
        ] },
      { id: 'po2', supplierId: 's1', status: 'sent', date: d(-1),
        lines: [
          { stockId: 'st4', qty: 20, unitCost: 9.8 },
          { stockId: 'st6', qty: 12, unitCost: 22.5 },
          { stockId: 'st7', qty: 15, unitCost: 6.4 }
        ] },
      { id: 'po3', supplierId: 's2', status: 'draft', date: d(0),
        lines: [
          { stockId: 'st3', qty: 10, unitCost: 41 }
        ] }
    ],

    stock: [
      { id: 'st1', sku: 'HWS-315E', name: '315L electric hot water system', category: 'Hot water', qty: 2, min: 1, unitCost: 1120, supplierId: 's3' },
      { id: 'st2', sku: 'HWS-170E', name: '170L electric hot water system', category: 'Hot water', qty: 1, min: 1, unitCost: 890, supplierId: 's3' },
      { id: 'st3', sku: 'CU-15-3M', name: '15mm copper tube — 3m length', category: 'Pipe & tube', qty: 4, min: 10, unitCost: 41, supplierId: 's2' },
      { id: 'st4', sku: 'PEX-16-5M', name: '16mm PEX pipe — 5m coil', category: 'Pipe & tube', qty: 6, min: 8, unitCost: 9.8, supplierId: 's1' },
      { id: 'st5', sku: 'PVC-100-6M', name: '100mm PVC DWV pipe — 6m', category: 'Pipe & tube', qty: 9, min: 4, unitCost: 58, supplierId: 's2' },
      { id: 'st6', sku: 'BV-20', name: '20mm brass ball valve', category: 'Valves', qty: 3, min: 6, unitCost: 22.5, supplierId: 's1' },
      { id: 'st7', sku: 'FLX-450', name: 'Braided flexi hose 450mm', category: 'Connectors', qty: 2, min: 10, unitCost: 6.4, supplierId: 's1' },
      { id: 'st8', sku: 'TMV-20', name: 'Thermostatic mixing valve 20mm', category: 'Valves', qty: 2, min: 2, unitCost: 148, supplierId: 's1' },
      { id: 'st9', sku: 'CIST-KIT', name: 'Universal cistern rebuild kit', category: 'Toilets', qty: 7, min: 3, unitCost: 32, supplierId: 's1' },
      { id: 'st10', sku: 'MIX-BAS-CH', name: 'Basin mixer — chrome', category: 'Tapware', qty: 5, min: 2, unitCost: 96, supplierId: 's2' },
      { id: 'st11', sku: 'MIX-SNK-CH', name: 'Sink mixer — chrome, pull-out', category: 'Tapware', qty: 3, min: 2, unitCost: 128, supplierId: 's2' },
      { id: 'st12', sku: 'AN-HWS-M', name: 'Sacrificial anode — magnesium', category: 'Hot water', qty: 5, min: 3, unitCost: 38, supplierId: 's3' },
      { id: 'st13', sku: 'ELEM-36', name: 'HWS heating element 3.6kW', category: 'Hot water', qty: 4, min: 2, unitCost: 45, supplierId: 's3' },
      { id: 'st14', sku: 'WASH-AST', name: 'Tap washer assortment box', category: 'Consumables', qty: 11, min: 4, unitCost: 18, supplierId: 's4' },
      { id: 'st15', sku: 'SIL-300', name: 'Sanitary silicone — clear 300g', category: 'Consumables', qty: 14, min: 6, unitCost: 9.5, supplierId: 's4' },
      { id: 'st16', sku: 'TAPE-PTFE', name: 'PTFE thread tape (10 pack)', category: 'Consumables', qty: 8, min: 5, unitCost: 12, supplierId: 's4' },
      { id: 'st17', sku: 'GT-20-BR', name: 'Garden tap 20mm — brass', category: 'Tapware', qty: 6, min: 3, unitCost: 24, supplierId: 's2' },
      { id: 'st18', sku: 'PMP-PRS', name: 'Pressure pump switch', category: 'Pumps', qty: 1, min: 1, unitCost: 74, supplierId: 's2' }
    ],

    movements: [
      { id: 'm1', date: d(-9), stockId: 'st15', delta: -1, reason: 'Job j1' },
      { id: 'm2', date: d(-8), stockId: 'st7', delta: -1, reason: 'Job j2' },
      { id: 'm3', date: d(-7), stockId: 'st1', delta: 2, reason: 'PO po1 received' },
      { id: 'm4', date: d(-7), stockId: 'st12', delta: 4, reason: 'PO po1 received' },
      { id: 'm5', date: d(-6), stockId: 'st1', delta: -1, reason: 'Job j3 — HWS replacement' },
      { id: 'm6', date: d(-2), stockId: 'st9', delta: -1, reason: 'Job j5' },
      { id: 'm7', date: d(-1), stockId: 'st16', delta: -1, reason: 'Job j6' },
      { id: 'm8', date: d(0), stockId: 'st14', delta: -1, reason: 'Job j8 — tap service' }
    ],

    /* Recurring compliance/servicing. nextDue is derived: lastService + intervalMonths. */
    assets: [
      { id: 'a1', customerId: 'c10', name: 'Backflow device — Peachtree main meter', location: 'South Penrith', installed: d(-980), intervalMonths: 12, lastService: d(-3),
        history: [ { date: d(-3), notes: 'Annual test passed, report lodged.' }, { date: d(-368), notes: 'Annual test passed.' } ] },
      { id: 'a2', customerId: 'c10', name: 'TMV bank — Peachtree common bathrooms', location: 'South Penrith', installed: d(-980), intervalMonths: 12, lastService: d(-362),
        history: [ { date: d(-362), notes: 'Serviced, thermostatic elements replaced.' } ] },
      { id: 'a3', customerId: 'c7', name: '315L electric HWS', location: 'Kingswood', installed: d(-6), intervalMonths: 24, lastService: d(-6),
        history: [ { date: d(-6), notes: 'New installation (job j3). First anode check due in 24 months.' } ] },
      { id: 'a4', customerId: 'c2', name: '250L electric HWS — anode program', location: 'Glenmore Park', installed: d(-1480), intervalMonths: 12, lastService: d(-372),
        history: [ { date: d(-372), notes: 'Anode replaced, tank flushed.' } ] },
      { id: 'a5', customerId: 'c12', name: 'Rural pressure pump & tank', location: 'Mulgoa', installed: d(-1120), intervalMonths: 6, lastService: d(-178),
        history: [ { date: d(-178), notes: 'Pressure switch adjusted, foot valve cleaned.' } ] },
      { id: 'a6', customerId: 'c8', name: 'Gas appliance compliance check', location: 'Werrington', installed: d(-1), intervalMonths: 24, lastService: d(-1),
        history: [ { date: d(-1), notes: 'Cooktop connected, compliance certificate issued (job j6).' } ] },
      { id: 'a7', customerId: 'c5', name: 'Sewer line — root management program', location: 'St Marys', installed: d(-740), intervalMonths: 12, lastService: d(-9),
        history: [ { date: d(-9), notes: 'Jet clear + CCTV (job j1). Roots at boundary trap, re-check in 12 months.' }, { date: d(-374), notes: 'Preventative jet clear.' } ] }
    ]
  });
})();
