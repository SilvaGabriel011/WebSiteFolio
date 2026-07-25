/* Seed dataset — Ironbark Cabinetry (shapes copied from data-proflow.js, the
   reference dataset). All people, contacts and suppliers are fictional.
   Dates are relative to today via d(offset[, 'HH:MM']) so the demo stays live. */
(function () {
  'use strict';
  var d = DEMO.util.d;

  DEMO.registerData('ironbark-cabinetry', {

    customers: [
      { id: 'c1', name: 'Freya Lindqvist', suburb: 'Brunswick East', phone: '0421 448 903', email: 'freya.lindqvist@examplemail.com.au' },
      { id: 'c2', name: 'Daniel O’Keefe', suburb: 'Coburg', phone: '0437 215 668', email: 'daniel.okeefe@examplemail.com.au' },
      { id: 'c3', name: 'Mei-Ling Chao', suburb: 'Thornbury', phone: '0402 883 174', email: 'meiling.chao@examplemail.com.au' },
      { id: 'c4', name: 'Stavros Economou', suburb: 'Pascoe Vale', phone: '0418 620 495', email: 'stavros.economou@examplemail.com.au' },
      { id: 'c5', name: 'Hannah Whitford', suburb: 'Northcote', phone: '0430 774 281', email: 'hannah.whitford@examplemail.com.au' },
      { id: 'c6', name: 'Josh Mercer', suburb: 'Brunswick West', phone: '0409 356 720', email: 'josh.mercer@examplemail.com.au' },
      { id: 'c7', name: 'Amara Okafor', suburb: 'Fitzroy North', phone: '0424 091 537', email: 'amara.okafor@examplemail.com.au' },
      { id: 'c8', name: 'Callum Byrne', suburb: 'Carlton North', phone: '0416 502 948', email: 'callum.byrne@examplemail.com.au' },
      { id: 'c9', name: 'Ingrid Halvorsen', suburb: 'Preston', phone: '0433 187 265', email: 'ingrid.halvorsen@examplemail.com.au' },
      { id: 'c10', name: 'Vince Battaglia — Gilbert St Apartments OC', suburb: 'Brunswick', phone: '0407 662 314', email: 'vince.battaglia@examplemail.com.au' },
      { id: 'c11', name: 'Ruby Tanaka', suburb: 'Fairfield', phone: '0428 940 176', email: 'ruby.tanaka@examplemail.com.au' },
      { id: 'c12', name: 'Sean Gallagher', suburb: 'Moonee Ponds', phone: '0411 273 850', email: 'sean.gallagher@examplemail.com.au' }
    ],

    /* status: scheduled | in_progress | done | invoiced
       source: manual | booking | quote | maintenance */
    jobs: [
      { id: 'j1', customerId: 'c7', title: 'Walk-in wardrobe fit-out — install day', status: 'invoiced', start: d(-10, '07:30'), durationHrs: 8, assignee: 'Tom', source: 'quote', quoteId: 'q1', notes: 'Two-pack finish. Client kept existing carpet — protect floors.' },
      { id: 'j2', customerId: 'c1', title: 'Site measure — kitchen renovation', status: 'invoiced', start: d(-9, '09:00'), durationHrs: 1, assignee: 'Marcus', source: 'booking', notes: 'Measurements feed quote q3.' },
      { id: 'j3', customerId: 'c4', title: 'Replace warped pantry doors & rehang', status: 'invoiced', start: d(-7, '08:00'), durationHrs: 3, assignee: 'Aiko', source: 'manual', notes: 'Doors resprayed in workshop, new soft-close hinges.' },
      { id: 'j4', customerId: 'c10', title: 'Foyer joinery touch-up — Gilbert St Apartments', status: 'done', start: d(-4, '09:30'), durationHrs: 2, assignee: 'Tom', source: 'maintenance', notes: 'Re-oiled timber panelling, tightened handles.' },
      { id: 'j5', customerId: 'c2', title: 'Warranty visit — realign drawer fronts', status: 'done', start: d(-2, '13:00'), durationHrs: 1, assignee: 'Aiko', source: 'booking', notes: 'Two runner sets replaced (out of warranty period).' },
      { id: 'j6', customerId: 'c6', title: 'Design consultation — study built-ins', status: 'done', start: d(-1, '10:00'), durationHrs: 2, assignee: 'Marcus', source: 'booking', notes: 'Concept sketched; quote q4 to follow.' },
      { id: 'j7', customerId: 'c5', title: 'Kitchen install — day 1 (base cabinets)', status: 'in_progress', start: d(0, '07:00'), durationHrs: 8, assignee: 'Tom', source: 'manual', notes: 'From accepted quote q2. Stone templater booked separately.' },
      { id: 'j8', customerId: 'c9', title: 'Site measure — laundry cabinetry', status: 'scheduled', start: d(0, '11:30'), durationHrs: 1, assignee: 'Marcus', source: 'booking', notes: '' },
      { id: 'j9', customerId: 'c8', title: 'Deliver & fit floating shelves', status: 'scheduled', start: d(0, '14:30'), durationHrs: 2, assignee: 'Aiko', source: 'manual', notes: 'Concealed brackets pre-fitted in workshop.' },
      { id: 'j10', customerId: 'c5', title: 'Kitchen install — day 2 (overheads & panels)', status: 'scheduled', start: d(1, '07:00'), durationHrs: 8, assignee: 'Tom', source: 'manual', notes: '' },
      { id: 'j11', customerId: 'c11', title: 'Design consultation — alcove cabinetry', status: 'scheduled', start: d(1, '15:00'), durationHrs: 1.5, assignee: 'Marcus', source: 'booking', notes: 'In-home consult, bring veneer samples.' },
      { id: 'j12', customerId: 'c10', title: 'Mailroom cabinetry adjustments — Gilbert St', status: 'scheduled', start: d(2, '08:30'), durationHrs: 3, assignee: 'Aiko', source: 'maintenance', notes: 'Contract visit — check parcel cupboard locks.' },
      { id: 'j13', customerId: 'c12', title: 'Site measure — entertainment unit', status: 'scheduled', start: d(3, '10:00'), durationHrs: 1, assignee: 'Marcus', source: 'booking', notes: 'Measurements for draft quote q6.' },
      { id: 'j14', customerId: 'c3', title: '12-month care visit — hinge & runner tune', status: 'scheduled', start: d(4, '09:00'), durationHrs: 1.5, assignee: 'Aiko', source: 'maintenance', notes: 'Wardrobe care program — bring touch-up kit.' },
      { id: 'j15', customerId: 'c9', title: 'Two-pack door spray — workshop batch', status: 'scheduled', start: d(5, '07:30'), durationHrs: 6, assignee: 'Tom', source: 'manual', notes: 'Satin white, booth booked all morning.' },
      { id: 'j16', customerId: 'c2', title: 'Install bench seat & window surround', status: 'scheduled', start: d(6, '08:00'), durationHrs: 5, assignee: 'Tom', source: 'booking', notes: '' }
    ],

    /* status: draft | sent | accepted | declined */
    quotes: [
      { id: 'q1', customerId: 'c7', status: 'accepted', date: d(-16), notes: 'Converted to project j1.',
        lines: [
          { desc: 'Walk-in wardrobe fit-out', qty: 1, unit: 'ea', price: 4800 },
          { desc: 'Two-pack spray finish upgrade', qty: 3, unit: 'lm', price: 320 }
        ] },
      { id: 'q2', customerId: 'c5', status: 'accepted', date: d(-12), notes: 'Deposit received. Install underway (j7/j10).',
        lines: [
          { desc: 'Custom base cabinetry', qty: 5.4, unit: 'lm', price: 1250 },
          { desc: 'Custom overhead cabinetry', qty: 4.2, unit: 'lm', price: 980 },
          { desc: 'Site installation (per day, two trades)', qty: 2, unit: 'day', price: 1450 }
        ] },
      { id: 'q3', customerId: 'c1', status: 'sent', date: d(-6), notes: 'Kitchen renovation — measured on j2.',
        lines: [
          { desc: 'Custom base cabinetry', qty: 4.8, unit: 'lm', price: 1250 },
          { desc: 'Custom overhead cabinetry', qty: 3.6, unit: 'lm', price: 980 },
          { desc: 'Two-pack spray finish upgrade', qty: 8.4, unit: 'lm', price: 320 },
          { desc: 'Site installation (per day, two trades)', qty: 2, unit: 'day', price: 1450 }
        ] },
      { id: 'q4', customerId: 'c6', status: 'sent', date: d(0), notes: 'Study built-ins — follow-up from consult j6.',
        lines: [
          { desc: 'Custom base cabinetry', qty: 3.2, unit: 'lm', price: 1250 },
          { desc: 'Design & drafting consultation', qty: 4, unit: 'hr', price: 140 }
        ] },
      { id: 'q5', customerId: 'c10', status: 'sent', date: d(-3), notes: 'Letterbox bank & parcel cupboard — Gilbert St foyer.',
        lines: [
          { desc: 'Custom base cabinetry', qty: 2.6, unit: 'lm', price: 1250 },
          { desc: 'Two-pack spray finish upgrade', qty: 2.6, unit: 'lm', price: 320 }
        ] },
      { id: 'q6', customerId: 'c12', status: 'draft', date: d(0), notes: 'Entertainment unit — awaiting veneer selection and site measure (j13).',
        lines: [
          { desc: 'Custom base cabinetry', qty: 3.8, unit: 'lm', price: 1250 },
          { desc: 'Two-pack spray finish upgrade', qty: 3.8, unit: 'lm', price: 320 }
        ] },
      { id: 'q7', customerId: 'c11', status: 'draft', date: d(-1), notes: '',
        lines: [
          { desc: 'Custom overhead cabinetry', qty: 2.4, unit: 'lm', price: 980 }
        ] },
      { id: 'q8', customerId: 'c8', status: 'declined', date: d(-13), notes: 'Went with a flat-pack alternative.',
        lines: [
          { desc: 'Walk-in wardrobe fit-out', qty: 1, unit: 'ea', price: 4800 }
        ] }
    ],

    /* status: draft | sent | paid | overdue */
    invoices: [
      { id: 'i1', jobId: 'j1', customerId: 'c7', status: 'paid', issued: d(-9), due: d(5),
        lines: [
          { desc: 'Walk-in wardrobe fit-out', qty: 1, unit: 'ea', price: 4800 },
          { desc: 'Two-pack spray finish upgrade', qty: 3, unit: 'lm', price: 320 }
        ] },
      { id: 'i2', jobId: 'j2', customerId: 'c1', status: 'paid', issued: d(-8), due: d(6),
        lines: [
          { desc: 'Site measure', qty: 1, unit: 'ea', price: 140 }
        ] },
      { id: 'i3', jobId: 'j3', customerId: 'c4', status: 'sent', issued: d(-6), due: d(8),
        lines: [
          { desc: 'Replacement pantry doors — two-pack (supply)', qty: 2, unit: 'ea', price: 240 },
          { desc: 'Soft-close hinge set (pair)', qty: 2, unit: 'ea', price: 28 },
          { desc: 'Rehang & on-site adjustment', qty: 2, unit: 'hr', price: 140 }
        ] },
      { id: 'i4', jobId: 'j4', customerId: 'c10', status: 'sent', issued: d(-3), due: d(11),
        lines: [
          { desc: 'Foyer joinery touch-up & re-oil (contract visit)', qty: 1, unit: 'ea', price: 380 }
        ] },
      { id: 'i5', jobId: null, customerId: 'c12', status: 'overdue', issued: d(-35), due: d(-21),
        lines: [
          { desc: 'Floating shelves — oak veneer (supply & install)', qty: 4, unit: 'ea', price: 265 },
          { desc: 'Two-pack spray finish upgrade', qty: 1.8, unit: 'lm', price: 320 }
        ] },
      { id: 'i6', jobId: 'j5', customerId: 'c2', status: 'paid', issued: d(-1), due: d(13),
        lines: [
          { desc: 'Soft-close drawer runner set', qty: 2, unit: 'ea', price: 46 },
          { desc: 'Drawer front realignment (out of warranty)', qty: 1, unit: 'hr', price: 140 }
        ] }
    ],

    suppliers: [
      { id: 's1', name: 'Merri Creek Panel & Veneer', contact: 'Louisa Grech', phone: '(03) 9384 6650', email: 'orders@merricreekpanel.example.com.au', terms: '30 days' },
      { id: 's2', name: 'Northside Hardware & Fittings', contact: 'Dev Chandran', phone: '(03) 9350 2218', email: 'trade@northsidefittings.example.com.au', terms: '14 days' },
      { id: 's3', name: 'Wattle Lane Timber Co.', contact: 'Bruno Marchetti', phone: '(03) 9482 7731', email: 'sales@wattlelanetimber.example.com.au', terms: '30 days' },
      { id: 's4', name: 'Sprayline Coatings Supply', contact: 'Counter sales', phone: '1300 662 884', email: 'brunswick@spraylinecoatings.example.com.au', terms: 'COD' }
    ],

    /* status: draft | sent | received */
    purchaseOrders: [
      { id: 'po1', supplierId: 's1', status: 'received', date: d(-7),
        lines: [
          { stockId: 'st2', qty: 6, unitCost: 118 },
          { stockId: 'st4', qty: 4, unitCost: 96 }
        ] },
      { id: 'po2', supplierId: 's2', status: 'sent', date: d(-1),
        lines: [
          { stockId: 'st8', qty: 50, unitCost: 11.5 },
          { stockId: 'st9', qty: 20, unitCost: 19.5 },
          { stockId: 'st16', qty: 4, unitCost: 22 }
        ] },
      { id: 'po3', supplierId: 's4', status: 'draft', date: d(0),
        lines: [
          { stockId: 'st13', qty: 6, unitCost: 89 }
        ] }
    ],

    stock: [
      { id: 'st1', sku: 'MDF-18-MR', name: 'Moisture-resistant MDF 18mm — 2400×1200', category: 'Sheet goods', qty: 14, min: 8, unitCost: 62, supplierId: 's1' },
      { id: 'st2', sku: 'PLY-18-BF', name: 'Birch-face plywood 18mm — 2400×1200', category: 'Sheet goods', qty: 5, min: 6, unitCost: 118, supplierId: 's1' },
      { id: 'st3', sku: 'MEL-16-WH', name: 'White melamine board 16mm — 2400×1200', category: 'Sheet goods', qty: 22, min: 10, unitCost: 48, supplierId: 's1' },
      { id: 'st4', sku: 'VEN-OAK-A', name: 'American oak veneer sheet — A grade', category: 'Sheet goods', qty: 3, min: 4, unitCost: 96, supplierId: 's1' },
      { id: 'st5', sku: 'TMB-ASH-27', name: 'Victorian ash board 42×19 — 2.7m', category: 'Timber', qty: 18, min: 10, unitCost: 34, supplierId: 's3' },
      { id: 'st6', sku: 'TMB-OAK-PNL', name: 'Tasmanian oak panel 25mm — laminated', category: 'Timber', qty: 6, min: 4, unitCost: 145, supplierId: 's3' },
      { id: 'st7', sku: 'EDG-OAK-50', name: 'Oak edge banding — 50m roll', category: 'Consumables', qty: 4, min: 3, unitCost: 42, supplierId: 's1' },
      { id: 'st8', sku: 'HNG-SC-110', name: 'Soft-close concealed hinge (pair)', category: 'Hardware', qty: 24, min: 30, unitCost: 11.5, supplierId: 's2' },
      { id: 'st9', sku: 'RUN-SC-450', name: 'Soft-close drawer runner set — 450mm', category: 'Hardware', qty: 12, min: 10, unitCost: 19.5, supplierId: 's2' },
      { id: 'st10', sku: 'HDL-BR-128', name: 'Brushed brass handle — 128mm', category: 'Hardware', qty: 30, min: 12, unitCost: 8.4, supplierId: 's2' },
      { id: 'st11', sku: 'LEG-ADJ-4', name: 'Adjustable cabinet leg set (4)', category: 'Hardware', qty: 16, min: 8, unitCost: 6.9, supplierId: 's2' },
      { id: 'st12', sku: 'SHF-PIN-200', name: 'Shelf support pins — box of 200', category: 'Hardware', qty: 5, min: 2, unitCost: 14, supplierId: 's2' },
      { id: 'st13', sku: '2PAC-WHT-4L', name: 'Two-pack polyurethane — satin white 4L', category: 'Finishes', qty: 3, min: 4, unitCost: 89, supplierId: 's4' },
      { id: 'st14', sku: 'PRM-UC-4L', name: 'Spray primer / undercoat 4L', category: 'Finishes', qty: 6, min: 3, unitCost: 54, supplierId: 's4' },
      { id: 'st15', sku: 'OIL-DAN-1L', name: 'Danish oil 1L', category: 'Finishes', qty: 7, min: 3, unitCost: 26, supplierId: 's4' },
      { id: 'st16', sku: 'GLU-PVA-4L', name: 'PVA wood adhesive 4L', category: 'Consumables', qty: 2, min: 3, unitCost: 22, supplierId: 's2' },
      { id: 'st17', sku: 'SCR-CAB-BX', name: 'Cabinet screw assortment box', category: 'Consumables', qty: 9, min: 4, unitCost: 16, supplierId: 's2' },
      { id: 'st18', sku: 'BEN-LAM-36', name: 'Laminate benchtop blank 38mm — 3.6m', category: 'Benchtops', qty: 3, min: 2, unitCost: 168, supplierId: 's1' }
    ],

    movements: [
      { id: 'm1', date: d(-10), stockId: 'st8', delta: -8, reason: 'Project j1 — wardrobe hinges' },
      { id: 'm2', date: d(-10), stockId: 'st9', delta: -6, reason: 'Project j1 — drawer runners' },
      { id: 'm3', date: d(-7), stockId: 'st2', delta: 6, reason: 'PO po1 received' },
      { id: 'm4', date: d(-7), stockId: 'st4', delta: 4, reason: 'PO po1 received' },
      { id: 'm5', date: d(-4), stockId: 'st15', delta: -1, reason: 'Project j4 — foyer re-oil' },
      { id: 'm6', date: d(-2), stockId: 'st9', delta: -2, reason: 'Project j5 — runner replacement' },
      { id: 'm7', date: d(0), stockId: 'st1', delta: -4, reason: 'Project j7 — base cabinet carcasses' },
      { id: 'm8', date: d(0), stockId: 'st8', delta: -10, reason: 'Project j7 — base cabinet hinges' }
    ],

    /* Warranty & care schedules. nextDue is derived: lastService + intervalMonths. */
    assets: [
      { id: 'a1', customerId: 'c4', name: 'Kitchen cabinetry — annual care program', location: 'Pascoe Vale', installed: d(-820), intervalMonths: 12, lastService: d(-395),
        history: [ { date: d(-395), notes: 'Hinges adjusted, doors realigned, benchtop resealed.' }, { date: d(-760), notes: 'Handover walkthrough, care guide left with client.' } ] },
      { id: 'a2', customerId: 'c10', name: 'Foyer & mailroom joinery — service contract, Gilbert St', location: 'Brunswick', installed: d(-700), intervalMonths: 6, lastService: d(-210),
        history: [ { date: d(-210), notes: 'Contract visit — timber re-oiled, handles tightened.' }, { date: d(-390), notes: 'Contract visit — two hinge pairs replaced in mailroom.' } ] },
      { id: 'a3', customerId: 'c3', name: 'Walk-in wardrobe — warranty & care', location: 'Thornbury', installed: d(-340), intervalMonths: 12, lastService: d(-340),
        history: [ { date: d(-340), notes: 'Installed. 12-month care visit booked as project j14.' } ] },
      { id: 'a4', customerId: 'c2', name: 'Window seat & alcove joinery — care schedule', location: 'Coburg', installed: d(-520), intervalMonths: 6, lastService: d(-150),
        history: [ { date: d(-150), notes: 'Seat lid hinges serviced, timber top re-oiled.' }, { date: d(-330), notes: 'First care visit — no faults found.' } ] },
      { id: 'a5', customerId: 'c7', name: 'Walk-in wardrobe fit-out', location: 'Fitzroy North', installed: d(-10), intervalMonths: 12, lastService: d(-10),
        history: [ { date: d(-10), notes: 'New installation (project j1). First care visit due in 12 months.' } ] },
      { id: 'a6', customerId: 'c12', name: 'Floating shelves & media joinery', location: 'Moonee Ponds', installed: d(-36), intervalMonths: 12, lastService: d(-36),
        history: [ { date: d(-36), notes: 'Installed. Two-year workmanship warranty commenced.' } ] },
      { id: 'a7', customerId: 'c1', name: 'Kitchen island unit — care program', location: 'Brunswick East', installed: d(-560), intervalMonths: 12, lastService: d(-200),
        history: [ { date: d(-200), notes: 'Care visit — island top re-oiled, hinges adjusted.' }, { date: d(-540), notes: 'Handover walkthrough.' } ] }
    ]
  });
})();
