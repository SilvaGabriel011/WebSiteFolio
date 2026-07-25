/* Seed dataset — Harbourline Joinery (shapes copied from data-proflow.js, the
   reference dataset). All people, contacts and suppliers are fictional.
   Dates are relative to today via d(offset[, 'HH:MM']) so the demo stays live. */
(function () {
  'use strict';
  var d = DEMO.util.d;

  DEMO.registerData('harbourline-joinery', {

    customers: [
      { id: 'c1', name: 'Margaret Ellery', suburb: 'Hamilton', phone: '0407 331 258', email: 'margaret.ellery@examplemail.com.au' },
      { id: 'c2', name: 'Josh Whitaker', suburb: 'Merewether', phone: '0421 904 776', email: 'josh.whitaker@examplemail.com.au' },
      { id: 'c3', name: 'Anh Pham', suburb: 'Mayfield', phone: '0434 617 092', email: 'anh.pham@examplemail.com.au' },
      { id: 'c4', name: 'Colin Braithwaite', suburb: 'Adamstown', phone: '0418 250 943', email: 'colin.braithwaite@examplemail.com.au' },
      { id: 'c5', name: 'Sarah Delaney', suburb: 'Cooks Hill', phone: '0402 785 316', email: 'sarah.delaney@examplemail.com.au' },
      { id: 'c6', name: 'Marcus Vella', suburb: 'Islington', phone: '0439 128 507', email: 'marcus.vella@examplemail.com.au' },
      { id: 'c7', name: 'Ruth Okafor', suburb: 'New Lambton', phone: '0415 662 384', email: 'ruth.okafor@examplemail.com.au' },
      { id: 'c8', name: 'Tim Hargreaves', suburb: 'Carrington', phone: '0426 493 810', email: 'tim.hargreaves@examplemail.com.au' },
      { id: 'c9', name: 'Bianca Rossi', suburb: 'The Junction', phone: '0410 857 269', email: 'bianca.rossi@examplemail.com.au' },
      { id: 'c10', name: 'Fiona Keller — Anchorage Strata', suburb: 'Wickham', phone: '0431 074 592', email: 'fiona.keller@examplemail.com.au' },
      { id: 'c11', name: 'Dean McAllister', suburb: 'Tighes Hill', phone: '0408 316 745', email: 'dean.mcallister@examplemail.com.au' },
      { id: 'c12', name: 'Helen Chow', suburb: 'Stockton', phone: '0423 590 168', email: 'helen.chow@examplemail.com.au' }
    ],

    /* status: scheduled | in_progress | done | invoiced
       source: manual | booking | quote | maintenance */
    jobs: [
      { id: 'j1', customerId: 'c5', title: 'Solid timber entry door — supply, hang & hardware', status: 'invoiced', start: d(-10, '07:30'), durationHrs: 5, assignee: 'Rob', source: 'quote', quoteId: 'q1', notes: 'Heritage terrace. Matched existing sidelight profile.' },
      { id: 'j2', customerId: 'c2', title: 'Double-hung window service ×2 — re-cord & ease', status: 'invoiced', start: d(-8, '09:00'), durationHrs: 2, assignee: 'Sam', source: 'booking', notes: '' },
      { id: 'j3', customerId: 'c7', title: 'Architrave & skirting replacement — hallway', status: 'invoiced', start: d(-6, '08:00'), durationHrs: 4, assignee: 'Jenny', source: 'manual', notes: 'Colonial profile to match existing.' },
      { id: 'j4', customerId: 'c10', title: 'Common-area door service — Anchorage Strata (contract)', status: 'done', start: d(-3, '08:30'), durationHrs: 3, assignee: 'Rob', source: 'maintenance', notes: 'Quarterly contract visit. Two closers adjusted.' },
      { id: 'j5', customerId: 'c8', title: 'Front door service & rehang — dropped hinge', status: 'done', start: d(-2, '13:00'), durationHrs: 1.5, assignee: 'Sam', source: 'booking', notes: '' },
      { id: 'j6', customerId: 'c3', title: 'Sash window service — kitchen (contract visit)', status: 'done', start: d(-1, '09:30'), durationHrs: 1.5, assignee: 'Jenny', source: 'maintenance', notes: '' },
      { id: 'j7', customerId: 'c6', title: 'Stair tread & baluster repair — Victorian ash', status: 'in_progress', start: d(0, '07:30'), durationHrs: 3, assignee: 'Rob', source: 'booking', notes: 'Two treads split. Full staircase quoted separately (q2).' },
      { id: 'j8', customerId: 'c1', title: 'Site measure — built-in wardrobe fit-out', status: 'scheduled', start: d(0, '11:00'), durationHrs: 1, assignee: 'Jenny', source: 'manual', notes: 'Measurements for q8.' },
      { id: 'j9', customerId: 'c4', title: 'Rehang laundry door & fit new mortice lock', status: 'scheduled', start: d(0, '14:30'), durationHrs: 1.5, assignee: 'Sam', source: 'booking', notes: '' },
      { id: 'j10', customerId: 'c11', title: 'Internal doors ×3 — hang & hardware', status: 'scheduled', start: d(1, '07:30'), durationHrs: 4, assignee: 'Rob', source: 'manual', notes: 'Doors on site, client supplied handles.' },
      { id: 'j11', customerId: 'c12', title: 'Coastal door seal replacement — front & back', status: 'scheduled', start: d(1, '12:30'), durationHrs: 2, assignee: 'Sam', source: 'booking', notes: 'Salt-air corrosion on old seals. Bronze kit.' },
      { id: 'j12', customerId: 'c10', title: 'Anchorage Strata — quarterly door & hardware check', status: 'scheduled', start: d(2, '08:00'), durationHrs: 3, assignee: 'Jenny', source: 'maintenance', notes: '' },
      { id: 'j13', customerId: 'c9', title: 'Entry door measure & timber selection', status: 'scheduled', start: d(3, '10:00'), durationHrs: 1, assignee: 'Rob', source: 'manual', notes: 'For q5 — bring cedar and oak samples.' },
      { id: 'j14', customerId: 'c5', title: 'French doors — ease, seal & re-oil', status: 'scheduled', start: d(4, '08:30'), durationHrs: 2.5, assignee: 'Sam', source: 'booking', notes: '' },
      { id: 'j15', customerId: 'c3', title: 'Sash cord replacement — bedroom windows', status: 'scheduled', start: d(5, '09:00'), durationHrs: 2, assignee: 'Jenny', source: 'booking', notes: '' },
      { id: 'j16', customerId: 'c7', title: 'Staircase handrail check (contract visit)', status: 'scheduled', start: d(6, '08:00'), durationHrs: 1.5, assignee: 'Rob', source: 'maintenance', notes: 'Annual service contract falling due.' }
    ],

    /* status: draft | sent | accepted | declined */
    quotes: [
      { id: 'q1', customerId: 'c5', status: 'accepted', date: d(-12), notes: 'Converted to job j1.',
        lines: [
          { desc: 'Solid timber entry door (supply)', qty: 1, unit: 'ea', price: 1850 },
          { desc: 'Door hang & hardware install', qty: 1, unit: 'ea', price: 420 },
          { desc: 'Site measure & consultation', qty: 1, unit: 'ea', price: 120 }
        ] },
      { id: 'q2', customerId: 'c6', status: 'sent', date: d(-4), notes: 'Full staircase replacement — repair booked meanwhile (j7).',
        lines: [
          { desc: 'Custom staircase — design deposit', qty: 1, unit: 'ea', price: 2500 },
          { desc: 'Site measure & consultation', qty: 1, unit: 'ea', price: 120 }
        ] },
      { id: 'q3', customerId: 'c10', status: 'accepted', date: d(-7), notes: 'Anchorage Strata — foyer refresh under service contract.',
        lines: [
          { desc: 'Commercial fit-out labour', qty: 24, unit: 'hr', price: 115 },
          { desc: 'Architrave & skirting supply/install', qty: 40, unit: 'lm', price: 38 }
        ] },
      { id: 'q4', customerId: 'c2', status: 'sent', date: d(-2), notes: 'Remaining windows after j2.',
        lines: [
          { desc: 'Double-hung window service', qty: 4, unit: 'ea', price: 260 }
        ] },
      { id: 'q5', customerId: 'c9', status: 'draft', date: d(-1), notes: 'Awaiting timber selection — measure booked (j13).',
        lines: [
          { desc: 'Solid timber entry door (supply)', qty: 1, unit: 'ea', price: 1850 },
          { desc: 'Door hang & hardware install', qty: 1, unit: 'ea', price: 420 }
        ] },
      { id: 'q6', customerId: 'c4', status: 'declined', date: d(-14), notes: 'Went with a flat-pack alternative.',
        lines: [
          { desc: 'Custom staircase — design deposit', qty: 1, unit: 'ea', price: 2500 },
          { desc: 'Commercial fit-out labour', qty: 30, unit: 'hr', price: 115 }
        ] },
      { id: 'q7', customerId: 'c8', status: 'sent', date: d(0), notes: 'Follow-up from j5 — door beyond economical repair.',
        lines: [
          { desc: 'Solid timber entry door (supply)', qty: 1, unit: 'ea', price: 1850 },
          { desc: 'Door hang & hardware install', qty: 1, unit: 'ea', price: 420 }
        ] },
      { id: 'q8', customerId: 'c1', status: 'draft', date: d(0), notes: 'Wardrobe fit-out — pending site measure (j8).',
        lines: [
          { desc: 'Wardrobe fit-out — joinery labour', qty: 16, unit: 'hr', price: 115 },
          { desc: 'Architrave & skirting supply/install', qty: 10, unit: 'lm', price: 38 }
        ] }
    ],

    /* status: draft | sent | paid | overdue */
    invoices: [
      { id: 'i1', jobId: 'j1', customerId: 'c5', status: 'paid', issued: d(-9), due: d(5),
        lines: [
          { desc: 'Solid timber entry door (supply)', qty: 1, unit: 'ea', price: 1850 },
          { desc: 'Door hang & hardware install', qty: 1, unit: 'ea', price: 420 }
        ] },
      { id: 'i2', jobId: 'j2', customerId: 'c2', status: 'paid', issued: d(-7), due: d(7),
        lines: [
          { desc: 'Double-hung window service', qty: 2, unit: 'ea', price: 260 }
        ] },
      { id: 'i3', jobId: 'j3', customerId: 'c7', status: 'sent', issued: d(-5), due: d(9),
        lines: [
          { desc: 'Architrave & skirting supply/install', qty: 32, unit: 'lm', price: 38 },
          { desc: 'Site measure & consultation', qty: 1, unit: 'ea', price: 120 }
        ] },
      { id: 'i4', jobId: 'j4', customerId: 'c10', status: 'sent', issued: d(-2), due: d(12),
        lines: [
          { desc: 'Contract door service — common areas', qty: 3, unit: 'hr', price: 115 },
          { desc: 'Mortice lock set (supply & fit)', qty: 1, unit: 'ea', price: 145 }
        ] },
      { id: 'i5', jobId: null, customerId: 'c4', status: 'overdue', issued: d(-35), due: d(-21),
        lines: [
          { desc: 'Double-hung window service', qty: 3, unit: 'ea', price: 260 },
          { desc: 'Sash cord & weight rebalance', qty: 1, unit: 'ea', price: 120 }
        ] },
      { id: 'i6', jobId: 'j5', customerId: 'c8', status: 'paid', issued: d(-1), due: d(13),
        lines: [
          { desc: 'Door service & rehang', qty: 1, unit: 'ea', price: 260 },
          { desc: 'Ball-bearing hinges (supply & fit)', qty: 1, unit: 'ea', price: 48 }
        ] }
    ],

    suppliers: [
      { id: 's1', name: 'Hunter Timber & Panel Co.', contact: 'Gary Pemberton', phone: '(02) 4960 3318', email: 'orders@huntertimberpanel.example.com.au', terms: '30 days' },
      { id: 's2', name: 'Anchorage Architectural Hardware', contact: 'Mel Christou', phone: '(02) 4962 7740', email: 'sales@anchoragehardware.example.com.au', terms: '14 days' },
      { id: 's3', name: 'Maitland Mouldings & Millwork', contact: 'Deb Farrier', phone: '(02) 4933 6205', email: 'trade@maitlandmillwork.example.com.au', terms: '30 days' },
      { id: 's4', name: 'Coastline Finishes & Abrasives', contact: 'Counter sales', phone: '1300 552 807', email: 'newcastle@coastlinefinishes.example.com.au', terms: 'COD' }
    ],

    /* status: draft | sent | received */
    purchaseOrders: [
      { id: 'po1', supplierId: 's3', status: 'received', date: d(-7),
        lines: [
          { stockId: 'st7', qty: 1, unitCost: 890 },
          { stockId: 'st9', qty: 10, unitCost: 21 }
        ] },
      { id: 'po2', supplierId: 's2', status: 'sent', date: d(-1),
        lines: [
          { stockId: 'st13', qty: 6, unitCost: 92 },
          { stockId: 'st11', qty: 10, unitCost: 14.5 }
        ] },
      { id: 'po3', supplierId: 's1', status: 'draft', date: d(0),
        lines: [
          { stockId: 'st2', qty: 12, unitCost: 48 },
          { stockId: 'st4', qty: 10, unitCost: 58 }
        ] }
    ],

    stock: [
      { id: 'st1', sku: 'TAS-OAK-1990', name: 'Tasmanian oak board 19×90 — 5.4m', category: 'Timber', qty: 24, min: 10, unitCost: 32, supplierId: 's1' },
      { id: 'st2', sku: 'TAS-OAK-19138', name: 'Tasmanian oak board 19×138 — 5.4m', category: 'Timber', qty: 8, min: 10, unitCost: 48, supplierId: 's1' },
      { id: 'st3', sku: 'VA-STR-42240', name: 'Victorian ash stringer blank 42×240', category: 'Stair parts', qty: 3, min: 2, unitCost: 165, supplierId: 's1' },
      { id: 'st4', sku: 'VA-TRD-1000', name: 'Victorian ash stair tread 1000mm', category: 'Stair parts', qty: 6, min: 8, unitCost: 58, supplierId: 's1' },
      { id: 'st5', sku: 'PLY-BIR-2418', name: 'Birch plywood 2400×1200×18mm', category: 'Sheet goods', qty: 12, min: 6, unitCost: 96, supplierId: 's1' },
      { id: 'st6', sku: 'MDF-MR-2416', name: 'Moisture-resistant MDF 2400×1200×16mm', category: 'Sheet goods', qty: 15, min: 8, unitCost: 54, supplierId: 's1' },
      { id: 'st7', sku: 'DOOR-ENT-CED', name: 'Cedar entry door blank 2040×820', category: 'Doors', qty: 2, min: 1, unitCost: 890, supplierId: 's3' },
      { id: 'st8', sku: 'DOOR-INT-VJ', name: 'Internal VJ profile door 2040×820', category: 'Doors', qty: 5, min: 4, unitCost: 210, supplierId: 's3' },
      { id: 'st9', sku: 'ARCH-CM-92', name: 'Colonial architrave 92mm — 5.4m', category: 'Mouldings', qty: 30, min: 12, unitCost: 21, supplierId: 's3' },
      { id: 'st10', sku: 'SKIRT-LT-138', name: 'Lambs tongue skirting 138mm — 5.4m', category: 'Mouldings', qty: 9, min: 12, unitCost: 27, supplierId: 's3' },
      { id: 'st11', sku: 'HNG-BB-100', name: 'Ball-bearing butt hinge 100mm (pair)', category: 'Hardware', qty: 22, min: 10, unitCost: 14.5, supplierId: 's2' },
      { id: 'st12', sku: 'LOCK-MOR-60', name: 'Mortice lock set 60mm backset', category: 'Hardware', qty: 5, min: 3, unitCost: 68, supplierId: 's2' },
      { id: 'st13', sku: 'HDL-LEV-BR', name: 'Lever handle set — brushed brass', category: 'Hardware', qty: 3, min: 6, unitCost: 92, supplierId: 's2' },
      { id: 'st14', sku: 'SASH-CORD-10', name: 'Waxed sash cord — 10m hank', category: 'Hardware', qty: 7, min: 4, unitCost: 19, supplierId: 's2' },
      { id: 'st15', sku: 'SEAL-DR-BRZ', name: 'Door perimeter seal kit — bronze', category: 'Hardware', qty: 9, min: 5, unitCost: 34, supplierId: 's2' },
      { id: 'st16', sku: 'OIL-HW-1L', name: 'Hard-wax timber oil — 1L', category: 'Finishes', qty: 6, min: 4, unitCost: 42, supplierId: 's4' },
      { id: 'st17', sku: 'PU-EXT-750', name: 'Exterior PU adhesive 750g', category: 'Consumables', qty: 10, min: 6, unitCost: 16.5, supplierId: 's4' },
      { id: 'st18', sku: 'ABR-120-50', name: 'Abrasive discs 120 grit (50 pack)', category: 'Consumables', qty: 4, min: 5, unitCost: 28, supplierId: 's4' }
    ],

    movements: [
      { id: 'm1', date: d(-10), stockId: 'st7', delta: -1, reason: 'Job j1 — entry door blank' },
      { id: 'm2', date: d(-10), stockId: 'st11', delta: -2, reason: 'Job j1 — hinges' },
      { id: 'm3', date: d(-8), stockId: 'st14', delta: -1, reason: 'Job j2 — sash re-cord' },
      { id: 'm4', date: d(-7), stockId: 'st7', delta: 1, reason: 'PO po1 received' },
      { id: 'm5', date: d(-7), stockId: 'st9', delta: 10, reason: 'PO po1 received' },
      { id: 'm6', date: d(-6), stockId: 'st9', delta: -6, reason: 'Job j3 — hallway architraves' },
      { id: 'm7', date: d(-2), stockId: 'st15', delta: -1, reason: 'Job j5 — door seal' },
      { id: 'm8', date: d(0), stockId: 'st18', delta: -1, reason: 'Job j7 — stair repair sanding' }
    ],

    /* Recurring service contracts. nextDue is derived: lastService + intervalMonths. */
    assets: [
      { id: 'a1', customerId: 'c10', name: 'Service contract — Anchorage Strata common-area doors', location: 'Wickham', installed: d(-1100), intervalMonths: 3, lastService: d(-3),
        history: [ { date: d(-3), notes: 'Quarterly visit (job j4). Two closers adjusted, all fire doors latching.' }, { date: d(-95), notes: 'Quarterly visit. Replaced worn lever set, unit 4.' } ] },
      { id: 'a2', customerId: 'c5', name: 'Heritage entry door — aftercare & oil schedule', location: 'Cooks Hill', installed: d(-10), intervalMonths: 12, lastService: d(-10),
        history: [ { date: d(-10), notes: 'New installation (job j1). First re-oil and ease check due in 12 months.' } ] },
      { id: 'a3', customerId: 'c3', name: 'Sash window service program — 6 windows', location: 'Mayfield', installed: d(-760), intervalMonths: 6, lastService: d(-1),
        history: [ { date: d(-1), notes: 'Kitchen sash serviced (job j6). Bedroom cords booked (j15).' }, { date: d(-184), notes: 'All sashes eased, parting beads waxed.' } ] },
      { id: 'a4', customerId: 'c7', name: 'Staircase & handrail service contract', location: 'New Lambton', installed: d(-1450), intervalMonths: 12, lastService: d(-340),
        history: [ { date: d(-340), notes: 'Handrail brackets tightened, treads inspected — no movement.' }, { date: d(-705), notes: 'Annual inspection. Re-glued one loose baluster.' } ] },
      { id: 'a5', customerId: 'c2', name: 'Timber window maintenance contract', location: 'Merewether', installed: d(-880), intervalMonths: 6, lastService: d(-145),
        history: [ { date: d(-145), notes: 'Seaside face windows eased and re-oiled.' }, { date: d(-330), notes: 'Two cords replaced, sills resealed.' } ] },
      { id: 'a6', customerId: 'c12', name: 'Coastal door & seal care program', location: 'Stockton', installed: d(-620), intervalMonths: 6, lastService: d(-200),
        history: [ { date: d(-200), notes: 'Seals checked, threshold re-bedded. Salt corrosion noted on both doors.' } ] },
      { id: 'a7', customerId: 'c6', name: 'Staircase warranty inspection', location: 'Islington', installed: d(-395), intervalMonths: 12, lastService: d(-395),
        history: [ { date: d(-395), notes: 'Staircase handover — 12-month warranty inspection scheduled. Tread damage now under repair (job j7).' } ] }
    ]
  });
})();
