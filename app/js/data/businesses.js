/* Business registry — identity, contact details, branding hooks and per-trade
   terminology for the systems app. All details are fictional (see README).
   Sites live at sites/<slug>/<variant>/ (variants: premium | classic | bold). */
(function () {
  'use strict';

  DEMO.registerBusiness('proflow-plumbing', {
    name: 'ProFlow Plumbing',
    tagline: 'Fast, licensed plumbing across Western Sydney — 24/7',
    trade: 'Plumbing & Gas',
    suburb: 'Penrith NSW 2750',
    phone: '0400 776 121',
    landline: '(02) 4732 8841',
    email: 'bookings@proflowplumbing.com.au',
    abn: '62 405 118 397',
    licence: 'NSW Plumbing Lic. L048213',
    owner: 'Shane Doherty',
    brand: '#0B4F8A',
    accent: '#F26722',
    siteUrl: '../sites/proflow-plumbing/bold/index.html',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3.2 3.9 5.5 6.8 5.5 9.7a5.5 5.5 0 1 1-11 0C6.5 9.8 8.8 6.9 12 3z"/><path d="M9.5 13.2a2.6 2.6 0 0 0 2.4 2.7"/></svg>',
    terms: {
      jobNoun: 'job',
      assetNoun: 'device',
      assetLabel: 'Compliance & servicing',
      staff: ['Shane', 'Mitch', 'Lena'],
      bookingServices: [
        { id: 'emergency', name: 'Emergency call-out (24/7)', durationHrs: 1.5, fromPrice: 220 },
        { id: 'blocked-drain', name: 'Blocked drain', durationHrs: 1.5, fromPrice: 380 },
        { id: 'hot-water', name: 'Hot water repair / replacement', durationHrs: 3, fromPrice: 350 },
        { id: 'taps-toilets', name: 'Leaking tap or toilet', durationHrs: 1, fromPrice: 165 },
        { id: 'gas', name: 'Gas fitting & compliance', durationHrs: 2, fromPrice: 190 },
        { id: 'backflow', name: 'Backflow prevention test', durationHrs: 1, fromPrice: 145 }
      ],
      priceList: [
        { desc: 'Call-out & first hour labour', unit: 'ea', price: 165 },
        { desc: 'Additional labour', unit: 'hr', price: 110 },
        { desc: '315L electric hot water system (supply)', unit: 'ea', price: 1480 },
        { desc: 'HWS install & removal of old unit', unit: 'ea', price: 650 },
        { desc: 'Blocked drain — high-pressure jet clear', unit: 'ea', price: 380 },
        { desc: 'Tap service / re-washer', unit: 'ea', price: 45 },
        { desc: 'Braided flexi hose replacement', unit: 'ea', price: 85 },
        { desc: 'Toilet cistern rebuild kit (fitted)', unit: 'ea', price: 120 },
        { desc: 'Gas compliance certificate', unit: 'ea', price: 190 },
        { desc: 'Backflow device annual test & report', unit: 'ea', price: 145 }
      ]
    }
  });

  DEMO.registerBusiness('ironbark-cabinetry', {
    name: 'Ironbark Cabinetry',
    tagline: 'Furniture-grade cabinetry, designed and made in Brunswick',
    trade: 'Bespoke Cabinet Making',
    suburb: 'Brunswick VIC 3056',
    phone: '0412 384 062',
    landline: '(03) 9384 2217',
    email: 'studio@ironbarkcabinetry.com.au',
    abn: '51 824 753 190',
    licence: 'Registered building practitioner DB-U 44271',
    owner: 'Marcus Reid',
    brand: '#B98A4E',
    accent: '#1F1D1A',
    siteUrl: '../sites/ironbark-cabinetry/premium/index.html',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M9.5 8h5M9.5 16h5"/></svg>',
    terms: {
      jobNoun: 'project',
      assetNoun: 'installation',
      assetLabel: 'Warranty & care',
      staff: ['Marcus', 'Tom', 'Aiko'],
      bookingServices: [
        { id: 'design', name: 'Design consultation (studio or in-home)', durationHrs: 2, fromPrice: 0 },
        { id: 'measure', name: 'Site measure', durationHrs: 1, fromPrice: 140 },
        { id: 'install', name: 'Installation day', durationHrs: 8, fromPrice: 1450 },
        { id: 'warranty', name: 'Warranty adjustment visit', durationHrs: 1, fromPrice: 0 }
      ],
      priceList: [
        { desc: 'Design & drafting consultation', unit: 'hr', price: 140 },
        { desc: 'Custom base cabinetry', unit: 'lm', price: 1250 },
        { desc: 'Custom overhead cabinetry', unit: 'lm', price: 980 },
        { desc: 'Walk-in wardrobe fit-out', unit: 'ea', price: 4800 },
        { desc: 'Two-pack spray finish upgrade', unit: 'lm', price: 320 },
        { desc: 'Soft-close hinge set (pair)', unit: 'ea', price: 28 },
        { desc: 'Soft-close drawer runner set', unit: 'ea', price: 46 },
        { desc: 'Site installation (per day, two trades)', unit: 'day', price: 1450 }
      ]
    }
  });

  DEMO.registerBusiness('harbourline-joinery', {
    name: 'Harbourline Joinery',
    tagline: 'Family-run joinery since 1987 — doors, stairs & fit-outs',
    trade: 'Joinery & Fit-outs',
    suburb: 'Hamilton NSW 2303',
    phone: '0403 118 265',
    landline: '(02) 4961 5083',
    email: 'workshop@harbourlinejoinery.com.au',
    abn: '33 617 208 445',
    licence: 'NSW Builders Lic. 187442C',
    owner: 'The Calloway family',
    brand: '#16324F',
    accent: '#C9A227',
    siteUrl: '../sites/harbourline-joinery/classic/index.html',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V8a7 7 0 0 1 14 0v13"/><path d="M5 21h14M12 21v-6"/><path d="M8.5 11h7"/></svg>',
    terms: {
      jobNoun: 'job',
      assetNoun: 'contract',
      assetLabel: 'Service contracts',
      staff: ['Rob', 'Jenny', 'Sam'],
      bookingServices: [
        { id: 'measure', name: 'Site measure & consult', durationHrs: 1, fromPrice: 120 },
        { id: 'door-service', name: 'Door service & rehang', durationHrs: 1.5, fromPrice: 260 },
        { id: 'window-service', name: 'Timber window service', durationHrs: 1.5, fromPrice: 260 },
        { id: 'commercial', name: 'Commercial fit-out consultation', durationHrs: 2, fromPrice: 0 }
      ],
      priceList: [
        { desc: 'Site measure & consultation', unit: 'ea', price: 120 },
        { desc: 'Solid timber entry door (supply)', unit: 'ea', price: 1850 },
        { desc: 'Door hang & hardware install', unit: 'ea', price: 420 },
        { desc: 'Double-hung window service', unit: 'ea', price: 260 },
        { desc: 'Custom staircase — design deposit', unit: 'ea', price: 2500 },
        { desc: 'Commercial fit-out labour', unit: 'hr', price: 115 },
        { desc: 'Architrave & skirting supply/install', unit: 'lm', price: 38 }
      ]
    }
  });

  DEMO.registerBusiness('sunline-kitchens', {
    name: 'Sunline Kitchens',
    tagline: 'Kitchen renovations, designed for the way you live',
    trade: 'Kitchen Renovations',
    suburb: 'Burleigh Heads QLD 4220',
    phone: '0421 906 743',
    landline: '(07) 5535 6629',
    email: 'hello@sunlinekitchens.com.au',
    abn: '74 290 561 883',
    licence: 'QBCC Lic. 15093488',
    owner: 'Dana Whitfield & Priya Sharma',
    brand: '#8BA88E',
    accent: '#B58B3E',
    siteUrl: '../sites/sunline-kitchens/premium/index.html',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 5V3M5.6 7.6 4.2 6.2M18.4 7.6l1.4-1.4"/><path d="M2 21h20M6 17h12"/></svg>',
    terms: {
      jobNoun: 'project',
      assetNoun: 'kitchen',
      assetLabel: 'Aftercare visits',
      staff: ['Dana', 'Priya', 'Marco'],
      bookingServices: [
        { id: 'design', name: 'In-home design consultation', durationHrs: 1.5, fromPrice: 190 },
        { id: 'measure', name: 'Site measure', durationHrs: 1, fromPrice: 0 },
        { id: 'handover', name: 'Renovation handover walkthrough', durationHrs: 1, fromPrice: 0 },
        { id: 'care', name: '6-month care visit', durationHrs: 1, fromPrice: 0 }
      ],
      priceList: [
        { desc: 'In-home design consultation (credited on booking)', unit: 'ea', price: 190 },
        { desc: 'Refresh package — doors, benchtop & splashback', unit: 'ea', price: 14500 },
        { desc: 'Full Reno package — complete kitchen', unit: 'ea', price: 32000 },
        { desc: 'Luxe package — premium finishes & appliances', unit: 'ea', price: 54000 },
        { desc: 'Stone benchtop upgrade', unit: 'lm', price: 890 },
        { desc: 'Soft-close drawer upgrade', unit: 'ea', price: 95 },
        { desc: 'Appliance installation allowance', unit: 'ea', price: 1200 }
      ]
    }
  });
})();
