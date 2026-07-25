/* Seed dataset — Sunline Kitchens (shapes mirror data-proflow.js, the
   reference dataset). All people, contacts and suppliers are fictional.
   Dates are relative to today via d(offset[, 'HH:MM']) so the demo stays live. */
(function () {
  'use strict';
  var d = DEMO.util.d;

  DEMO.registerData('sunline-kitchens', {

    customers: [
      { id: 'c1', name: 'Hayley Brennan', suburb: 'Burleigh Waters', phone: '0407 812 344', email: 'hayley.brennan@examplemail.com.au' },
      { id: 'c2', name: 'Josh Tanaka', suburb: 'Palm Beach', phone: '0432 664 910', email: 'josh.tanaka@examplemail.com.au' },
      { id: 'c3', name: 'Amrita Kaur', suburb: 'Miami', phone: '0418 205 776', email: 'amrita.kaur@examplemail.com.au' },
      { id: 'c4', name: 'Colin Fitzgerald', suburb: 'Elanora', phone: '0429 483 057', email: 'colin.fitzgerald@examplemail.com.au' },
      { id: 'c5', name: 'Renee Vella', suburb: 'Currumbin', phone: '0403 917 268', email: 'renee.vella@examplemail.com.au' },
      { id: 'c6', name: 'Steph Delaney', suburb: 'Tallebudgera', phone: '0426 550 384', email: 'steph.delaney@examplemail.com.au' },
      { id: 'c7', name: 'Owen Mercer', suburb: 'Mermaid Waters', phone: '0436 271 905', email: 'owen.mercer@examplemail.com.au' },
      { id: 'c8', name: 'Lucia Moretti', suburb: 'Robina', phone: '0414 638 522', email: 'lucia.moretti@examplemail.com.au' },
      { id: 'c9', name: 'Tim Aldridge', suburb: 'Varsity Lakes', phone: '0408 194 637', email: 'tim.aldridge@examplemail.com.au' },
      { id: 'c10', name: 'Fiona Marsh — Driftwood Apartments BC', suburb: 'Burleigh Heads', phone: '0425 803 166', email: 'fiona.marsh@examplemail.com.au' },
      { id: 'c11', name: 'Bec Saunders', suburb: 'Reedy Creek', phone: '0431 246 879', email: 'bec.saunders@examplemail.com.au' },
      { id: 'c12', name: 'Harvey Lim', suburb: 'Mudgeeraba', phone: '0417 529 043', email: 'harvey.lim@examplemail.com.au' }
    ],

    /* status: scheduled | in_progress | done | invoiced
       source: manual | booking | quote | maintenance */
    jobs: [
      { id: 'j1', customerId: 'c3', title: 'Refresh install — doors, benchtop & splashback', status: 'invoiced', start: d(-10, '07:00'), durationHrs: 8, assignee: 'Marco', source: 'quote', quoteId: 'q1', notes: 'Coastal white doors with sand oak feature. Stone templated prior.' },
      { id: 'j2', customerId: 'c5', title: 'In-home design consultation', status: 'invoiced', start: d(-9, '10:00'), durationHrs: 1.5, assignee: 'Dana', source: 'booking', notes: 'Keen on stone benchtop upgrade.' },
      { id: 'j3', customerId: 'c1', title: 'Appliance install — oven & induction cooktop', status: 'invoiced', start: d(-7, '08:30'), durationHrs: 3, assignee: 'Marco', source: 'manual', notes: 'Cabinet cut-out modified for new oven.' },
      { id: 'j4', customerId: 'c10', title: 'Aftercare visit — Driftwood display kitchen', status: 'done', start: d(-4, '09:00'), durationHrs: 1, assignee: 'Priya', source: 'maintenance', notes: 'Hinges adjusted, benchtop resealed.' },
      { id: 'j5', customerId: 'c7', title: 'Site measure & scope — full renovation', status: 'done', start: d(-3, '13:00'), durationHrs: 1, assignee: 'Dana', source: 'booking', notes: 'Measurements for q3 concept.' },
      { id: 'j6', customerId: 'c9', title: 'Handover walkthrough — Varsity Lakes reno', status: 'done', start: d(-1, '15:00'), durationHrs: 1, assignee: 'Priya', source: 'manual', notes: 'Care pack left with client. Stage two pantry discussed.' },
      { id: 'j7', customerId: 'c8', title: 'Full Reno install — week two cabinetry fit-off', status: 'in_progress', start: d(0, '07:00'), durationHrs: 8, assignee: 'Marco', source: 'manual', notes: 'Drawer fit-off and kickboards today. Stone due Thursday.' },
      { id: 'j8', customerId: 'c2', title: 'In-home design consultation', status: 'scheduled', start: d(0, '10:30'), durationHrs: 1.5, assignee: 'Dana', source: 'booking', notes: '' },
      { id: 'j9', customerId: 'c6', title: 'Aftercare visit — 6-month care', status: 'scheduled', start: d(0, '14:30'), durationHrs: 1, assignee: 'Priya', source: 'maintenance', notes: 'Overdue visit — check door alignment and silicone.' },
      { id: 'j10', customerId: 'c4', title: 'Site measure — benchtop template check', status: 'scheduled', start: d(1, '08:00'), durationHrs: 1, assignee: 'Marco', source: 'booking', notes: '' },
      { id: 'j11', customerId: 'c12', title: 'Splashback install — sea mist glass', status: 'scheduled', start: d(1, '11:00'), durationHrs: 2, assignee: 'Marco', source: 'manual', notes: 'Verbal go-ahead on q5, chase signed acceptance.' },
      { id: 'j12', customerId: 'c11', title: 'In-home design consultation', status: 'scheduled', start: d(2, '09:30'), durationHrs: 1.5, assignee: 'Dana', source: 'booking', notes: '' },
      { id: 'j13', customerId: 'c10', title: 'Warranty check — Driftwood Apartments lot 12', status: 'scheduled', start: d(3, '08:30'), durationHrs: 1.5, assignee: 'Priya', source: 'maintenance', notes: 'Reported sticky drawer runners.' },
      { id: 'j14', customerId: 'c7', title: 'Quote presentation — full reno concept', status: 'scheduled', start: d(4, '16:00'), durationHrs: 1, assignee: 'Dana', source: 'manual', notes: 'Present q3 with finish samples.' },
      { id: 'j15', customerId: 'c3', title: 'Aftercare visit — drawer alignment follow-up', status: 'scheduled', start: d(5, '10:00'), durationHrs: 1, assignee: 'Priya', source: 'booking', notes: '' },
      { id: 'j16', customerId: 'c5', title: 'Stone benchtop upgrade install', status: 'scheduled', start: d(6, '07:30'), durationHrs: 6, assignee: 'Marco', source: 'manual', notes: 'Add-on agreed at design consult. Slab held with Stonecraft.' }
    ],

    /* status: draft | sent | accepted | declined */
    quotes: [
      { id: 'q1', customerId: 'c3', status: 'accepted', date: d(-24), notes: 'Converted to project j1.',
        lines: [
          { desc: 'Refresh package — doors, benchtop & splashback', qty: 1, unit: 'ea', price: 14500 },
          { desc: 'Soft-close drawer upgrade', qty: 8, unit: 'ea', price: 95 }
        ] },
      { id: 'q2', customerId: 'c8', status: 'accepted', date: d(-18), notes: 'Deposit paid. Install underway (project j7).',
        lines: [
          { desc: 'Full Reno package — complete kitchen', qty: 1, unit: 'ea', price: 32000 },
          { desc: 'Stone benchtop upgrade', qty: 4, unit: 'lm', price: 890 },
          { desc: 'Appliance installation allowance', qty: 1, unit: 'ea', price: 1200 }
        ] },
      { id: 'q3', customerId: 'c7', status: 'sent', date: d(-2), notes: 'Concept to be presented at project j14.',
        lines: [
          { desc: 'Full Reno package — complete kitchen', qty: 1, unit: 'ea', price: 32000 },
          { desc: 'Stone benchtop upgrade', qty: 3.6, unit: 'lm', price: 890 },
          { desc: 'Appliance installation allowance', qty: 1, unit: 'ea', price: 1200 }
        ] },
      { id: 'q4', customerId: 'c4', status: 'sent', date: d(-5), notes: '',
        lines: [
          { desc: 'Refresh package — doors, benchtop & splashback', qty: 1, unit: 'ea', price: 14500 },
          { desc: 'Soft-close drawer upgrade', qty: 6, unit: 'ea', price: 95 }
        ] },
      { id: 'q5', customerId: 'c12', status: 'sent', date: d(-9), notes: 'Verbal go-ahead — signed acceptance due before project j11.',
        lines: [
          { desc: 'Glass splashback — sea mist (supply & fit)', qty: 1, unit: 'ea', price: 1450 },
          { desc: 'Stone benchtop upgrade', qty: 2.4, unit: 'lm', price: 890 }
        ] },
      { id: 'q6', customerId: 'c1', status: 'declined', date: d(-13), notes: 'Went ahead with appliance update only (project j3).',
        lines: [
          { desc: 'Luxe package — premium finishes & appliances', qty: 1, unit: 'ea', price: 54000 }
        ] },
      { id: 'q7', customerId: 'c6', status: 'draft', date: d(0), notes: 'Ideas from today’s care visit — waiting on stone colour choice.',
        lines: [
          { desc: 'Stone benchtop upgrade', qty: 2.8, unit: 'lm', price: 890 },
          { desc: 'Soft-close drawer upgrade', qty: 4, unit: 'ea', price: 95 }
        ] },
      { id: 'q8', customerId: 'c9', status: 'draft', date: d(-1), notes: 'Stage two discussed at handover (project j6).',
        lines: [
          { desc: 'Butler’s pantry fit-out — stage two', qty: 1, unit: 'ea', price: 6800 },
          { desc: 'Soft-close drawer upgrade', qty: 5, unit: 'ea', price: 95 }
        ] }
    ],

    /* status: draft | sent | paid | overdue */
    invoices: [
      { id: 'i1', jobId: 'j1', customerId: 'c3', status: 'paid', issued: d(-9), due: d(5),
        lines: [
          { desc: 'Refresh package — final stage payment (50%)', qty: 1, unit: 'ea', price: 7250 },
          { desc: 'Soft-close drawer upgrade', qty: 8, unit: 'ea', price: 95 }
        ] },
      { id: 'i2', jobId: 'j2', customerId: 'c5', status: 'paid', issued: d(-8), due: d(6),
        lines: [
          { desc: 'In-home design consultation (credited on booking)', qty: 1, unit: 'ea', price: 190 }
        ] },
      { id: 'i3', jobId: 'j3', customerId: 'c1', status: 'paid', issued: d(-6), due: d(8),
        lines: [
          { desc: 'Appliance installation allowance', qty: 1, unit: 'ea', price: 1200 },
          { desc: 'Cabinetry modification for new oven housing', qty: 1, unit: 'ea', price: 380 }
        ] },
      { id: 'i4', jobId: 'j6', customerId: 'c9', status: 'sent', issued: d(-1), due: d(13),
        lines: [
          { desc: 'Full Reno package — final stage payment (10%)', qty: 1, unit: 'ea', price: 3200 }
        ] },
      { id: 'i5', jobId: null, customerId: 'c8', status: 'sent', issued: d(-2), due: d(12),
        lines: [
          { desc: 'Full Reno package — progress payment (25%)', qty: 1, unit: 'ea', price: 8000 }
        ] },
      { id: 'i6', jobId: null, customerId: 'c10', status: 'overdue', issued: d(-35), due: d(-21),
        lines: [
          { desc: 'Display kitchen refresh — Driftwood common room', qty: 1, unit: 'ea', price: 5400 },
          { desc: 'Appliance installation allowance', qty: 1, unit: 'ea', price: 1200 }
        ] }
    ],

    suppliers: [
      { id: 's1', name: 'Coastline Board & Panel Co.', contact: 'Gavin Herrera', phone: '(07) 5522 8174', email: 'orders@coastlineboard.example.com.au', terms: '30 days' },
      { id: 's2', name: 'Stonecraft Benchtops Qld', contact: 'Ines Kovacevic', phone: '(07) 5576 3390', email: 'trade@stonecraftqld.example.com.au', terms: '30 days' },
      { id: 's3', name: 'Meridian Cabinet Hardware', contact: 'Counter sales', phone: '1300 662 418', email: 'sales@meridianhardware.example.com.au', terms: 'COD' },
      { id: 's4', name: 'BrightHaus Appliance Wholesale', contact: 'Terry Nolan', phone: '(07) 5593 1046', email: 'trade@brighthaus.example.com.au', terms: '14 days' }
    ],

    /* status: draft | sent | received */
    purchaseOrders: [
      { id: 'po1', supplierId: 's3', status: 'received', date: d(-7),
        lines: [
          { stockId: 'st1', qty: 24, unitCost: 9.5 },
          { stockId: 'st16', qty: 4, unitCost: 58 }
        ] },
      { id: 'po2', supplierId: 's1', status: 'sent', date: d(-1),
        lines: [
          { stockId: 'st5', qty: 10, unitCost: 74 },
          { stockId: 'st4', qty: 8, unitCost: 62 },
          { stockId: 'st7', qty: 6, unitCost: 34 }
        ] },
      { id: 'po3', supplierId: 's2', status: 'draft', date: d(0),
        lines: [
          { stockId: 'st9', qty: 2, unitCost: 640 }
        ] }
    ],

    stock: [
      { id: 'st1', sku: 'HNG-SC-110', name: 'Soft-close hinge 110° (pair)', category: 'Hardware', qty: 48, min: 24, unitCost: 9.5, supplierId: 's3' },
      { id: 'st2', sku: 'RUN-SC-500', name: 'Soft-close drawer runner set — 500mm', category: 'Hardware', qty: 10, min: 12, unitCost: 21, supplierId: 's3' },
      { id: 'st3', sku: 'HDL-BRS-160', name: 'Brushed brass bar handle — 160mm', category: 'Hardware', qty: 30, min: 15, unitCost: 7.2, supplierId: 's3' },
      { id: 'st4', sku: 'MEL-CW-16', name: 'Melamine board 16mm — coastal white (sheet)', category: 'Panels & board', qty: 14, min: 8, unitCost: 62, supplierId: 's1' },
      { id: 'st5', sku: 'MEL-SO-16', name: 'Melamine board 16mm — sand oak (sheet)', category: 'Panels & board', qty: 5, min: 8, unitCost: 74, supplierId: 's1' },
      { id: 'st6', sku: 'DOOR-SHK-P', name: 'Shaker profile door blank — primed', category: 'Panels & board', qty: 22, min: 10, unitCost: 48, supplierId: 's1' },
      { id: 'st7', sku: 'KICK-ALU-3M', name: 'Aluminium kickboard — 3m length', category: 'Panels & board', qty: 6, min: 6, unitCost: 34, supplierId: 's1' },
      { id: 'st8', sku: 'STN-20-CM', name: 'Engineered stone slab 20mm — coastal mist', category: 'Benchtops', qty: 3, min: 2, unitCost: 640, supplierId: 's2' },
      { id: 'st9', sku: 'STN-20-PD', name: 'Engineered stone slab 20mm — pearl dune', category: 'Benchtops', qty: 1, min: 2, unitCost: 640, supplierId: 's2' },
      { id: 'st10', sku: 'SPL-GLS-SM', name: 'Glass splashback panel — sea mist', category: 'Splashbacks', qty: 4, min: 2, unitCost: 290, supplierId: 's2' },
      { id: 'st11', sku: 'SNK-UM-DBL', name: 'Undermount double-bowl sink — stainless', category: 'Sinks & taps', qty: 3, min: 2, unitCost: 245, supplierId: 's4' },
      { id: 'st12', sku: 'TAP-PO-BN', name: 'Pull-out sink mixer — brushed nickel', category: 'Sinks & taps', qty: 5, min: 3, unitCost: 168, supplierId: 's4' },
      { id: 'st13', sku: 'OVN-600-PY', name: '600mm built-in pyrolytic oven', category: 'Appliances', qty: 2, min: 1, unitCost: 1180, supplierId: 's4' },
      { id: 'st14', sku: 'CKT-IND-600', name: '600mm induction cooktop', category: 'Appliances', qty: 2, min: 1, unitCost: 720, supplierId: 's4' },
      { id: 'st15', sku: 'RHD-CON-600', name: 'Concealed rangehood 600mm', category: 'Appliances', qty: 1, min: 1, unitCost: 385, supplierId: 's4' },
      { id: 'st16', sku: 'LED-UC-5M', name: 'Under-cabinet LED strip kit — 5m', category: 'Lighting', qty: 7, min: 3, unitCost: 58, supplierId: 's3' },
      { id: 'st17', sku: 'SIL-TRN-300', name: 'Kitchen & bath silicone — translucent 300g', category: 'Consumables', qty: 18, min: 6, unitCost: 8.5, supplierId: 's1' },
      { id: 'st18', sku: 'EDGE-CW-50M', name: 'ABS edging roll — coastal white 50m', category: 'Consumables', qty: 9, min: 4, unitCost: 26, supplierId: 's1' }
    ],

    movements: [
      { id: 'm1', date: d(-10), stockId: 'st6', delta: -14, reason: 'Project j1 — replacement doors' },
      { id: 'm2', date: d(-10), stockId: 'st8', delta: -1, reason: 'Project j1 — stone benchtop' },
      { id: 'm3', date: d(-10), stockId: 'st1', delta: -14, reason: 'Project j1 — soft-close hinges' },
      { id: 'm4', date: d(-7), stockId: 'st1', delta: 24, reason: 'PO po1 received' },
      { id: 'm5', date: d(-7), stockId: 'st16', delta: 4, reason: 'PO po1 received' },
      { id: 'm6', date: d(-7), stockId: 'st13', delta: -1, reason: 'Project j3 — oven install' },
      { id: 'm7', date: d(-7), stockId: 'st14', delta: -1, reason: 'Project j3 — induction cooktop' },
      { id: 'm8', date: d(0), stockId: 'st2', delta: -2, reason: 'Project j7 — drawer fit-off' }
    ],

    /* Recurring aftercare/warranty visits. nextDue is derived: lastService + intervalMonths. */
    assets: [
      { id: 'a1', customerId: 'c3', name: 'Refresh kitchen — coastal white & sand oak', location: 'Miami', installed: d(-10), intervalMonths: 6, lastService: d(-10),
        history: [ { date: d(-10), notes: 'Installation complete (project j1). First 6-month care visit to be booked.' } ] },
      { id: 'a2', customerId: 'c10', name: 'Display kitchen — Driftwood common room', location: 'Burleigh Heads', installed: d(-750), intervalMonths: 6, lastService: d(-4),
        history: [ { date: d(-4), notes: 'Aftercare visit (project j4): hinges adjusted, benchtop resealed.' }, { date: d(-186), notes: 'Drawer runners replaced under warranty.' } ] },
      { id: 'a3', customerId: 'c6', name: 'Full reno kitchen — two-tone shaker', location: 'Tallebudgera', installed: d(-190), intervalMonths: 6, lastService: d(-190),
        history: [ { date: d(-190), notes: 'Handover complete. 6-month care visit due — now booked (project j9).' } ] },
      { id: 'a4', customerId: 'c9', name: 'Full Reno kitchen — Varsity Lakes', location: 'Varsity Lakes', installed: d(-1), intervalMonths: 6, lastService: d(-1),
        history: [ { date: d(-1), notes: 'Handover walkthrough (project j6). Care pack issued.' } ] },
      { id: 'a5', customerId: 'c2', name: 'Refresh kitchen — Palm Beach', location: 'Palm Beach', installed: d(-900), intervalMonths: 12, lastService: d(-385),
        history: [ { date: d(-385), notes: '12-month aftercare: doors realigned, silicone refreshed.' }, { date: d(-740), notes: 'First aftercare visit — no issues.' } ] },
      { id: 'a6', customerId: 'c11', name: 'Luxe kitchen — Reedy Creek', location: 'Reedy Creek', installed: d(-500), intervalMonths: 12, lastService: d(-330),
        history: [ { date: d(-330), notes: 'Aftercare: stone resealed, rangehood filters replaced.' } ] },
      { id: 'a7', customerId: 'c12', name: 'Refresh kitchen — Mudgeeraba', location: 'Mudgeeraba', installed: d(-350), intervalMonths: 6, lastService: d(-150),
        history: [ { date: d(-150), notes: '6-month care visit: hinges adjusted, drawers aligned.' }, { date: d(-330), notes: 'Handover walkthrough, care pack issued.' } ] }
    ]
  });
})();
