// lib/utils/translations.ts

import type { SupportedLocale } from './locale';

export interface Translations {
  header: {
    searchPlaceholder: string;
    myAccount: string;
    contactUs: string;
    cart: string;
  };
  navigation: {
    dishwashing: string;
    iceMachines: string;
    refrigeration: string;
    cookingBaking: string;
    foodPrep: string;
    dessertEquipment: string;
    vacuumSealing: string;
    brands: string;
    // Dishwashing submenu
    undercounter: string;
    glasswashers: string;
    passThrough: string;
    potsPans: string;
    pizzaOvens: string;
    conveyor: string;
    accessories: string;
    // Ice Machines submenu
    waterIceDispensers: string;
    iceMakers: string;
    // Refrigeration submenu
    juiceSlushDispensers: string;
    blastChillers: string;
    dryAgingCabinets: string;
    wineCabinets: string;
    // Cooking & Baking submenu
    inductionCookers: string;
    paniniGrills: string;
    convectionOvens: string;
    gyroMachines: string;
    fryers: string;
    griddles: string;
    countertops: string;
    // Food Prep submenu
    slicers: string;
    foodProcessor: string;
    cutters: string;
    meatGrinders: string;
    hamburgerPress: string;
    mixers: string;
    immersion: string;
    bakeryEquipment: string;
    pizzaPrepConditioning: string;
    // Dessert Equipment submenu
    gelatoIceCream: string;
    sorbet: string;
    waffleMakers: string;
    crepeMachines: string;
    // Vacuum sealing submenu
    chamberVacuum: string;
    externalVacuum: string;
    handWrappers: string;
    sousVideCooking: string;
    bags: string;
  };
  emailSignup: {
    title: string;
    emailPlaceholder: string;
    buttonText: string;
  };
  signIn: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    rememberMe: string;
    signInButton: string;
    signingIn: string;
    forgotPassword: string;
    noAccountTitle: string;
    advantages: string;
    advantageOrder: string;
    advantageDownload: string;
    advantageTraining: string;
    advantageDiscounts: string;
    createAccount: string;
    errorFillFields: string;
    errorUnableToSignIn: string;
    showPassword: string;
    hidePassword: string;
    pageTitle: string;
    pageDescription: string;
  };
  createAccount: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    subtitle: string;
    companyInfo: string;
    companyName: string;
    companyLegalName: string;
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phone: string;
    inBusinessSince: string;
    accountsPayableContact: string;
    firstName: string;
    lastName: string;
    email: string;
    emailForInvoices: string;
    preferredLanguage: string;
    consentPrivacy: string;
    consentPrivacyLink: string;
    consentPrivacyEnd: string;
    consentTruth: string;
    newsletterOptin: string;
    notRobot: string;
    send: string;
  };
  ourReps: {
    canada: string;
    unitedStates: string;
    searchPlaceholder: string;
    findRep: string;
    selectedArea: string;
    loading: string;
    noRepsFound: string;
  };
  whereToBuy: {
    postalCodePlaceholder: string;
    findRetailer: string;
  };
  forgotPassword: {
    pageTitle: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    resetButton: string;
  };
  brands: {
    pageTitle: string;
    pageDescription: string;
    home: string;
    categories: string;
    ourBrands: string;
    bannerAlt: string;
    defaultTitle: string;
    defaultSeoTitle: string;
    defaultSeoDescription: string;
  };
  becomeDealer: {
    pageTitle: string;
    pageDescription: string;
    home: string;
    breadcrumb: string;
    title: string;
    subtitle: string;
    subject: string;
    subjectContactUs: string;
    subjectPartsService: string;
    subjectRequestQuote: string;
    subjectBecomeDealer: string;
    subjectJobApplication: string;
    subjectMarketing: string;
    companyName: string;
    website: string;
    address: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    dragDrop: string;
    browse: string;
    pdfOnly: string;
    recaptcha: string;
    send: string;
  };
  cart: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    product: string;
    unitPrice: string;
    qty: string;
    subtotal: string;
    emptyTitle: string;
    emptyMessage: string;
    estimatedTotal: string;
    requestQuote: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    notRobot: string;
    recaptcha: string;
    privacyTerms: string;
    send: string;
    removeItem: string;
    decrease: string;
    increase: string;
    quantity: string;
  };
  account: {
    pageTitle: string;
    pageDescription: string;
    profile: string;
    placeOrder: string;
    previousOrders: string;
    resourceCenter: string;
    bookTraining: string;
    signOut: string;
    home: string;
    userProfile: string;
    firstName: string;
    lastName: string;
    companyName: string;
    preferredLanguage: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    editProfile: string;
    editPlaceholder: string;
    send: string;
    ordersPageTitle: string;
    ordersPageDescription: string;
    ordersTitle: string;
    orderPlacedOn: string;
    qty: string;
    reorder: string;
    noOrders: string;
    noOrdersMessage: string;
    trainingPageTitle: string;
    trainingPageDescription: string;
    trainingTitle: string;
    trainingSubtitle: string;
    trainingFirstName: string;
    trainingLastName: string;
    trainingCompanyName: string;
    trainingPhone: string;
    trainingEmail: string;
    trainingEstablishmentType: string;
    trainingEstablishmentDistributor: string;
    trainingEstablishmentRestaurant: string;
    trainingEstablishmentHotel: string;
    trainingEstablishmentCatering: string;
    trainingEstablishmentOther: string;
    trainingFor: string;
    trainingForInternalSales: string;
    trainingForExternalSales: string;
    trainingForServiceTeam: string;
    trainingForEndUsers: string;
    trainingAttendees: string;
    trainingAttendees1: string;
    trainingAttendees2: string;
    trainingAttendees3: string;
    trainingAttendees4: string;
    trainingAttendees5Plus: string;
    trainingFormat: string;
    trainingFormatVideoCall: string;
    trainingFormatOnSite: string;
    trainingFormatWebinar: string;
    trainingIdealDate: string;
    trainingGoals: string;
    trainingNewsletter: string;
    trainingNotRobot: string;
    trainingSend: string;
  };
  footer: {
    description: string;
    ourStory: string;
    ourBrands: string;
    ourReps: string;
    whereToBuy: string;
    becomeADealer: string;
    ourPolicies: string;
    careers: string;
    latestNews: string;
    contactUs: string;
    partsService: string;
    copyright: string;
    termsAndConditions: string;
    privacyPolicy: string;
    cookiePreferences: string;
    sitemap: string;
  };
}

const translations: Record<SupportedLocale, Translations> = {
  'en-CA': {
    header: {
      searchPlaceholder: 'Search for a product…',
      myAccount: 'My Account',
      contactUs: 'Contact Us',
      cart: 'Cart',
    },
    navigation: {
      dishwashing: 'Dishwashing',
      iceMachines: 'Ice Machines',
      refrigeration: 'Refrigeration',
      cookingBaking: 'Cooking & Baking',
      foodPrep: 'Food Prep',
      dessertEquipment: 'Dessert Equipment',
      vacuumSealing: 'Vacuum sealing',
      brands: 'Brands',
      undercounter: 'Undercounter',
      glasswashers: 'Glasswashers',
      passThrough: 'Pass-Through',
      potsPans: 'Pots & Pans',
      pizzaOvens: 'Pizza Ovens',
      conveyor: 'Conveyor',
      accessories: 'Accessories',
      waterIceDispensers: 'Water & Ice Dispensers',
      iceMakers: 'Ice Makers',
      juiceSlushDispensers: 'Juice & Slush Dispensers',
      blastChillers: 'Blast Chillers',
      dryAgingCabinets: 'Dry-Aging Cabinets',
      wineCabinets: 'Wine Cabinets',
      inductionCookers: 'Induction Cookerss',
      paniniGrills: 'Panini Grills',
      convectionOvens: 'Convection Ovens',
      gyroMachines: 'Gyro Machines',
      fryers: 'Fryers',
      griddles: 'Griddles',
      countertops: 'Countertops',
      slicers: 'Slicers',
      foodProcessor: 'Food processor',
      cutters: 'Cutters',
      meatGrinders: 'Meat Grinders',
      hamburgerPress: 'Hamburger Press',
      mixers: 'Mixers',
      immersion: 'Immersion',
      bakeryEquipment: 'Bakery equipment',
      pizzaPrepConditioning: 'Pizza Prep & Conditioning',
      gelatoIceCream: 'Gelato & Ice Cream',
      sorbet: 'Sorbet',
      waffleMakers: 'Waffle makers',
      crepeMachines: 'Crepe machines',
      chamberVacuum: 'Chamber Vacuum',
      externalVacuum: 'External Vacuum',
      handWrappers: 'Hand Wrappers',
      sousVideCooking: 'Sous-Vide Cooking',
      bags: 'Bags',
    },
    emailSignup: {
      title: 'ENTER YOUR EMAIL TO GET LATEST DEALS & MORE!',
      emailPlaceholder: 'Your email address',
      buttonText: 'Sign Up',
    },
    signIn: {
      title: 'Sign in',
      subtitle: 'If you have an account, sign in with your email address.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      rememberMe: 'Remember me',
      signInButton: 'Sign in',
      signingIn: 'Signing in…',
      forgotPassword: 'Forgot your password?',
      noAccountTitle: 'You don\'t have an account?',
      advantages: 'Advantages',
      advantageOrder: 'Order your products online',
      advantageDownload: 'Download logos, pictures and documents',
      advantageTraining: 'Training request forms',
      advantageDiscounts: 'See all products with your discounts',
      createAccount: 'Create account',
      errorFillFields: 'Please fill in all required fields.',
      errorUnableToSignIn: 'Unable to sign in. Please try again later.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      pageTitle: 'Sign In | Eurodib',
      pageDescription: 'Sign in to your Eurodib account to access exclusive features, order products online, and manage your account.',
    },
    createAccount: {
      pageTitle: 'Create an account | Eurodib',
      pageDescription: 'Create a Eurodib dealer account by providing your company information, accounts payable contact and consent to our privacy policy.',
      title: 'Create an account',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      companyInfo: 'Company information',
      companyName: 'Company name',
      companyLegalName: 'Company legal name',
      address: 'Address',
      city: 'City',
      province: 'Province',
      country: 'Country',
      postalCode: 'Postal code',
      phone: 'Phone',
      inBusinessSince: 'In business since',
      accountsPayableContact: 'Accounts payable contact',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      emailForInvoices: 'Email for invoices',
      preferredLanguage: 'Preferred language',
      consentPrivacy: 'By submitting this form, you consent to Eurodib collecting, using and storing your personal information in accordance with our',
      consentPrivacyLink: 'privacy policy',
      consentPrivacyEnd: 'and current legal requirements.',
      consentTruth: 'I declare that the information provided is complete and true.',
      newsletterOptin: 'I would like to subscribe to the newsletter to stay informed about promotions and the latest news.',
      notRobot: 'I\'m not a robot',
      send: 'Send',
    },
    ourReps: {
      canada: 'Canada',
      unitedStates: 'United States',
      searchPlaceholder: 'Enter ZIP (US) or Postal Code (CA), or State/Province',
      findRep: 'Find a rep',
      selectedArea: 'Selected area',
      loading: 'Loading representatives…',
      noRepsFound: 'No representatives found for this query.',
    },
    whereToBuy: {
      postalCodePlaceholder: 'Your postal code',
      findRetailer: 'Find a retailer',
    },
    forgotPassword: {
      pageTitle: 'Forgot your password | Eurodib',
      title: 'Forgot your password',
      subtitle: 'Please enter your email address below to receive a password reset.',
      emailLabel: 'Email',
      resetButton: 'Reset my password',
    },
    brands: {
      pageTitle: 'Our Brands | Eurodib',
      pageDescription: "Discover Eurodib's premium brand portfolio: Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz, and more professional kitchen equipment brands.",
      home: 'Home',
      categories: 'Categories',
      ourBrands: 'Our Brands',
      bannerAlt: 'Our brands banner',
      defaultTitle: 'Our Brands',
      defaultSeoTitle: 'Our Brands | Eurodib',
      defaultSeoDescription: "Discover Eurodib's premium brand portfolio: Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz, and more professional kitchen equipment brands.",
    },
    becomeDealer: {
      pageTitle: 'Become a Dealer | Eurodib',
      pageDescription: 'Join Eurodib\'s dealer network and become a trusted partner. Expand your business with premium commercial kitchen equipment and expert support.',
      home: 'Home',
      breadcrumb: 'Become a dealer',
      title: 'Become a dealer',
      subtitle: 'Join our dealer network across Canada & the USA. Access competitive pricing, dedicated support, marketing assets, and premium kitchen equipment brands.',
      subject: 'Subject',
      subjectContactUs: 'Contact us',
      subjectPartsService: 'Parts & Service',
      subjectRequestQuote: 'Request a quote',
      subjectBecomeDealer: 'Become a dealer',
      subjectJobApplication: 'Spontaneous job application',
      subjectMarketing: 'Marketing & Sponsorships',
      companyName: 'Company name',
      website: 'Website',
      address: 'Address',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      dragDrop: 'Drag & drop or',
      browse: 'browse',
      pdfOnly: '(PDF files only)',
      recaptcha: 'reCAPTCHA',
      send: 'Send',
    },
    cart: {
      pageTitle: 'Your cart | Eurodib',
      pageDescription: 'Review your cart and request a quote for Eurodib professional kitchen equipment.',
      title: 'Your cart',
      product: 'Product',
      unitPrice: 'Unit price',
      qty: 'Qty',
      subtotal: 'Subtotal',
      emptyTitle: 'Your cart is empty',
      emptyMessage: 'Add products to your cart to request a quote',
      estimatedTotal: 'Estimated total',
      requestQuote: 'Request a quote',
      firstName: 'First name*',
      lastName: 'Last name*',
      company: 'Company*',
      email: 'Email*',
      phone: 'Phone*',
      notRobot: 'I\'m not a robot',
      recaptcha: 'reCAPTCHA',
      privacyTerms: 'Privacy · Terms',
      send: 'Send',
      removeItem: 'Remove item',
      decrease: 'decrease',
      increase: 'increase',
      quantity: 'quantity',
    },
    account: {
      pageTitle: 'My Account | EURODIB',
      pageDescription: 'View and manage your Eurodib account details, company information and contact preferences.',
      profile: 'Profile',
      placeOrder: 'Place your order',
      previousOrders: 'Previous orders',
      resourceCenter: 'Resource center',
      bookTraining: 'Book a training',
      signOut: 'Sign out',
      home: 'Home',
      userProfile: 'User profile',
      firstName: 'First name',
      lastName: 'Last name',
      companyName: 'Company name',
      preferredLanguage: 'Preferred language',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      province: 'Province',
      postalCode: 'Postal code',
      country: 'Country',
      editProfile: 'Edit my profile',
      editPlaceholder: 'Please type in the changes you want to make',
      send: 'Send',
      ordersPageTitle: 'Previous orders | EURODIB',
      ordersPageDescription: 'View your Eurodib order history: previous purchases, order details and quick reorder options for authorized dealers.',
      ordersTitle: 'Previous orders',
      orderPlacedOn: 'Order placed on',
      qty: 'Qty',
      reorder: 'Reorder',
      noOrders: 'No orders yet',
      noOrdersMessage: 'You haven\'t placed any orders yet. When you do, they will appear here.',
      trainingPageTitle: 'Book a training | EURODIB',
      trainingPageDescription: 'Request a Eurodib product training session for your team: distributors, sales, service or end users.',
      trainingTitle: 'Book a training',
      trainingSubtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      trainingFirstName: 'First name',
      trainingLastName: 'Last name',
      trainingCompanyName: 'Company name',
      trainingPhone: 'Phone',
      trainingEmail: 'Email',
      trainingEstablishmentType: 'Type of establishment',
      trainingEstablishmentDistributor: 'Distributor',
      trainingEstablishmentRestaurant: 'Restaurant',
      trainingEstablishmentHotel: 'Hotel',
      trainingEstablishmentCatering: 'Catering',
      trainingEstablishmentOther: 'Other',
      trainingFor: 'Who is the training for?',
      trainingForInternalSales: 'Internal Sales',
      trainingForExternalSales: 'External Sales',
      trainingForServiceTeam: 'Service Team',
      trainingForEndUsers: 'End Users',
      trainingAttendees: 'Number of people attending',
      trainingAttendees1: '1',
      trainingAttendees2: '2',
      trainingAttendees3: '3',
      trainingAttendees4: '4',
      trainingAttendees5Plus: '5+',
      trainingFormat: 'Training format',
      trainingFormatVideoCall: 'Video Call',
      trainingFormatOnSite: 'On-site',
      trainingFormatWebinar: 'Webinar',
      trainingIdealDate: 'Ideal training date',
      trainingGoals: 'Please describe your goals for the training session, including any specific products you might have in mind',
      trainingNewsletter: 'I would like to subscribe to the newsletter to stay informed about promotions and the latest news.',
      trainingNotRobot: 'I\'m not a robot',
      trainingSend: 'Send',
    },
    footer: {
      description: 'Eurodib is a leading distributor.',
      ourStory: 'Our Story',
      ourBrands: 'Our Brands',
      ourReps: 'Our Reps',
      whereToBuy: 'Where to Buy',
      becomeADealer: 'Become a dealer',
      ourPolicies: 'Our Policies',
      careers: 'Careers',
      latestNews: 'Latest News',
      contactUs: 'Contact Us',
      partsService: 'Parts & Service',
      copyright: '© 2025 Eurodib - All Rights Reserved.',
      termsAndConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy',
      cookiePreferences: 'Cookie Preferences',
      sitemap: 'Sitemap',
    },
  },
  'en-US': {
    header: {
      searchPlaceholder: 'Search for a product…',
      myAccount: 'My Account',
      contactUs: 'Contact Us',
      cart: 'Cart',
    },
    navigation: {
      dishwashing: 'Dishwashing',
      iceMachines: 'Ice Machines',
      refrigeration: 'Refrigeration',
      cookingBaking: 'Cooking & Baking',
      foodPrep: 'Food Prep',
      dessertEquipment: 'Dessert Equipment',
      vacuumSealing: 'Vacuum sealing',
      brands: 'Brands',
      undercounter: 'Undercounter',
      glasswashers: 'Glasswashers',
      passThrough: 'Pass-Through',
      potsPans: 'Pots & Pans',
      pizzaOvens: 'Pizza Ovens',
      conveyor: 'Conveyor',
      accessories: 'Accessories',
      waterIceDispensers: 'Water & Ice Dispensers',
      iceMakers: 'Ice Makers',
      juiceSlushDispensers: 'Juice & Slush Dispensers',
      blastChillers: 'Blast Chillers',
      dryAgingCabinets: 'Dry-Aging Cabinets',
      wineCabinets: 'Wine Cabinets',
      inductionCookers: 'Induction Cookerss',
      paniniGrills: 'Panini Grills',
      convectionOvens: 'Convection Ovens',
      gyroMachines: 'Gyro Machines',
      fryers: 'Fryers',
      griddles: 'Griddles',
      countertops: 'Countertops',
      slicers: 'Slicers',
      foodProcessor: 'Food processor',
      cutters: 'Cutters',
      meatGrinders: 'Meat Grinders',
      hamburgerPress: 'Hamburger Press',
      mixers: 'Mixers',
      immersion: 'Immersion',
      bakeryEquipment: 'Bakery equipment',
      pizzaPrepConditioning: 'Pizza Prep & Conditioning',
      gelatoIceCream: 'Gelato & Ice Cream',
      sorbet: 'Sorbet',
      waffleMakers: 'Waffle makers',
      crepeMachines: 'Crepe machines',
      chamberVacuum: 'Chamber Vacuum',
      externalVacuum: 'External Vacuum',
      handWrappers: 'Hand Wrappers',
      sousVideCooking: 'Sous-Vide Cooking',
      bags: 'Bags',
    },
    emailSignup: {
      title: 'ENTER YOUR EMAIL TO GET LATEST DEALS & MORE!',
      emailPlaceholder: 'Your email address',
      buttonText: 'Sign Up',
    },
    signIn: {
      title: 'Sign in',
      subtitle: 'If you have an account, sign in with your email address.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      rememberMe: 'Remember me',
      signInButton: 'Sign in',
      signingIn: 'Signing in…',
      forgotPassword: 'Forgot your password?',
      noAccountTitle: 'You don\'t have an account?',
      advantages: 'Advantages',
      advantageOrder: 'Order your products online',
      advantageDownload: 'Download logos, pictures and documents',
      advantageTraining: 'Training request forms',
      advantageDiscounts: 'See all products with your discounts',
      createAccount: 'Create account',
      errorFillFields: 'Please fill in all required fields.',
      errorUnableToSignIn: 'Unable to sign in. Please try again later.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      pageTitle: 'Sign In | Eurodib',
      pageDescription: 'Sign in to your Eurodib account to access exclusive features, order products online, and manage your account.',
    },
    createAccount: {
      pageTitle: 'Create an account | Eurodib',
      pageDescription: 'Create a Eurodib dealer account by providing your company information, accounts payable contact and consent to our privacy policy.',
      title: 'Create an account',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      companyInfo: 'Company information',
      companyName: 'Company name',
      companyLegalName: 'Company legal name',
      address: 'Address',
      city: 'City',
      province: 'Province',
      country: 'Country',
      postalCode: 'Postal code',
      phone: 'Phone',
      inBusinessSince: 'In business since',
      accountsPayableContact: 'Accounts payable contact',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      emailForInvoices: 'Email for invoices',
      preferredLanguage: 'Preferred language',
      consentPrivacy: 'By submitting this form, you consent to Eurodib collecting, using and storing your personal information in accordance with our',
      consentPrivacyLink: 'privacy policy',
      consentPrivacyEnd: 'and current legal requirements.',
      consentTruth: 'I declare that the information provided is complete and true.',
      newsletterOptin: 'I would like to subscribe to the newsletter to stay informed about promotions and the latest news.',
      notRobot: 'I\'m not a robot',
      send: 'Send',
    },
    ourReps: {
      canada: 'Canada',
      unitedStates: 'United States',
      searchPlaceholder: 'Enter ZIP (US) or Postal Code (CA), or State/Province',
      findRep: 'Find a rep',
      selectedArea: 'Selected area',
      loading: 'Loading representatives…',
      noRepsFound: 'No representatives found for this query.',
    },
    whereToBuy: {
      postalCodePlaceholder: 'Your postal code',
      findRetailer: 'Find a retailer',
    },
    forgotPassword: {
      pageTitle: 'Forgot your password | Eurodib',
      title: 'Forgot your password',
      subtitle: 'Please enter your email address below to receive a password reset.',
      emailLabel: 'Email',
      resetButton: 'Reset my password',
    },
    brands: {
      pageTitle: 'Our Brands | Eurodib',
      pageDescription: "Discover Eurodib's premium brand portfolio: Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz, and more professional kitchen equipment brands.",
      home: 'Home',
      categories: 'Categories',
      ourBrands: 'Our Brands',
      bannerAlt: 'Our brands banner',
      defaultTitle: 'Our Brands',
      defaultSeoTitle: 'Our Brands | Eurodib',
      defaultSeoDescription: "Discover Eurodib's premium brand portfolio: Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz, and more professional kitchen equipment brands.",
    },
    becomeDealer: {
      pageTitle: 'Become a Dealer | Eurodib',
      pageDescription: 'Join Eurodib\'s dealer network and become a trusted partner. Expand your business with premium commercial kitchen equipment and expert support.',
      home: 'Home',
      breadcrumb: 'Become a dealer',
      title: 'Become a dealer',
      subtitle: 'Join our dealer network across Canada & the USA. Access competitive pricing, dedicated support, marketing assets, and premium kitchen equipment brands.',
      subject: 'Subject',
      subjectContactUs: 'Contact us',
      subjectPartsService: 'Parts & Service',
      subjectRequestQuote: 'Request a quote',
      subjectBecomeDealer: 'Become a dealer',
      subjectJobApplication: 'Spontaneous job application',
      subjectMarketing: 'Marketing & Sponsorships',
      companyName: 'Company name',
      website: 'Website',
      address: 'Address',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      dragDrop: 'Drag & drop or',
      browse: 'browse',
      pdfOnly: '(PDF files only)',
      recaptcha: 'reCAPTCHA',
      send: 'Send',
    },
    cart: {
      pageTitle: 'Your cart | Eurodib',
      pageDescription: 'Review your cart and request a quote for Eurodib professional kitchen equipment.',
      title: 'Your cart',
      product: 'Product',
      unitPrice: 'Unit price',
      qty: 'Qty',
      subtotal: 'Subtotal',
      emptyTitle: 'Your cart is empty',
      emptyMessage: 'Add products to your cart to request a quote',
      estimatedTotal: 'Estimated total',
      requestQuote: 'Request a quote',
      firstName: 'First name*',
      lastName: 'Last name*',
      company: 'Company*',
      email: 'Email*',
      phone: 'Phone*',
      notRobot: 'I\'m not a robot',
      recaptcha: 'reCAPTCHA',
      privacyTerms: 'Privacy · Terms',
      send: 'Send',
      removeItem: 'Remove item',
      decrease: 'decrease',
      increase: 'increase',
      quantity: 'quantity',
    },
    account: {
      pageTitle: 'My Account | EURODIB',
      pageDescription: 'View and manage your Eurodib account details, company information and contact preferences.',
      profile: 'Profile',
      placeOrder: 'Place your order',
      previousOrders: 'Previous orders',
      resourceCenter: 'Resource center',
      bookTraining: 'Book a training',
      signOut: 'Sign out',
      home: 'Home',
      userProfile: 'User profile',
      firstName: 'First name',
      lastName: 'Last name',
      companyName: 'Company name',
      preferredLanguage: 'Preferred language',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      province: 'Province',
      postalCode: 'Postal code',
      country: 'Country',
      editProfile: 'Edit my profile',
      editPlaceholder: 'Please type in the changes you want to make',
      send: 'Send',
      ordersPageTitle: 'Previous orders | EURODIB',
      ordersPageDescription: 'View your Eurodib order history: previous purchases, order details and quick reorder options for authorized dealers.',
      ordersTitle: 'Previous orders',
      orderPlacedOn: 'Order placed on',
      qty: 'Qty',
      reorder: 'Reorder',
      noOrders: 'No orders yet',
      noOrdersMessage: 'You haven\'t placed any orders yet. When you do, they will appear here.',
      trainingPageTitle: 'Book a training | EURODIB',
      trainingPageDescription: 'Request a Eurodib product training session for your team: distributors, sales, service or end users.',
      trainingTitle: 'Book a training',
      trainingSubtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      trainingFirstName: 'First name',
      trainingLastName: 'Last name',
      trainingCompanyName: 'Company name',
      trainingPhone: 'Phone',
      trainingEmail: 'Email',
      trainingEstablishmentType: 'Type of establishment',
      trainingEstablishmentDistributor: 'Distributor',
      trainingEstablishmentRestaurant: 'Restaurant',
      trainingEstablishmentHotel: 'Hotel',
      trainingEstablishmentCatering: 'Catering',
      trainingEstablishmentOther: 'Other',
      trainingFor: 'Who is the training for?',
      trainingForInternalSales: 'Internal Sales',
      trainingForExternalSales: 'External Sales',
      trainingForServiceTeam: 'Service Team',
      trainingForEndUsers: 'End Users',
      trainingAttendees: 'Number of people attending',
      trainingAttendees1: '1',
      trainingAttendees2: '2',
      trainingAttendees3: '3',
      trainingAttendees4: '4',
      trainingAttendees5Plus: '5+',
      trainingFormat: 'Training format',
      trainingFormatVideoCall: 'Video Call',
      trainingFormatOnSite: 'On-site',
      trainingFormatWebinar: 'Webinar',
      trainingIdealDate: 'Ideal training date',
      trainingGoals: 'Please describe your goals for the training session, including any specific products you might have in mind',
      trainingNewsletter: 'I would like to subscribe to the newsletter to stay informed about promotions and the latest news.',
      trainingNotRobot: 'I\'m not a robot',
      trainingSend: 'Send',
    },
    footer: {
      description: 'Eurodib is a leading distributor.',
      ourStory: 'Our Story',
      ourBrands: 'Our Brands',
      ourReps: 'Our Reps',
      whereToBuy: 'Where to Buy',
      becomeADealer: 'Become a dealer',
      ourPolicies: 'Our Policies',
      careers: 'Careers',
      latestNews: 'Latest News',
      contactUs: 'Contact Us',
      partsService: 'Parts & Service',
      copyright: '© 2025 Eurodib - All Rights Reserved.',
      termsAndConditions: 'Terms and Conditions',
      privacyPolicy: 'Privacy Policy',
      cookiePreferences: 'Cookie Preferences',
      sitemap: 'Sitemap',
    },
  },
  'fr-CA': {
    header: {
      searchPlaceholder: 'Rechercher un produit…',
      myAccount: 'Mon compte',
      contactUs: 'Nous contacter',
      cart: 'Panier',
    },
    navigation: {
      dishwashing: 'Lave-vaisselle',
      iceMachines: 'Machines à glace',
      refrigeration: 'Réfrigération',
      cookingBaking: 'Cuisson et pâtisserie',
      foodPrep: 'Préparation des aliments',
      dessertEquipment: 'Équipement pour desserts',
      vacuumSealing: 'Sous vide',
      brands: 'Marques',
      undercounter: 'Sous comptoir',
      glasswashers: 'Lave-verres',
      passThrough: 'Passe-plat',
      potsPans: 'Casseroles et poêles',
      pizzaOvens: 'Fours à pizza',
      conveyor: 'Convoyeur',
      accessories: 'Accessoires',
      waterIceDispensers: 'Distributeurs d\'eau et de glace',
      iceMakers: 'Fabricants de glace',
      juiceSlushDispensers: 'Distributeurs de jus et de slush',
      blastChillers: 'Surgélateurs',
      dryAgingCabinets: 'Armoires de maturation',
      wineCabinets: 'Caves à vin',
      inductionCookers: 'Tables de cuisson à induction',
      paniniGrills: 'Grilles panini',
      convectionOvens: 'Fours à convection',
      gyroMachines: 'Machines à gyros',
      fryers: 'Friteuses',
      griddles: 'Plaques de cuisson',
      countertops: 'Plans de travail',
      slicers: 'Trancheuses',
      foodProcessor: 'Robot culinaire',
      cutters: 'Coupeurs',
      meatGrinders: 'Hachoirs à viande',
      hamburgerPress: 'Presse à hamburgers',
      mixers: 'Mélangeurs',
      immersion: 'Immersion',
      bakeryEquipment: 'Équipement de boulangerie',
      pizzaPrepConditioning: 'Préparation et conditionnement de pizza',
      gelatoIceCream: 'Gelato et crème glacée',
      sorbet: 'Sorbet',
      waffleMakers: 'Gaufriers',
      crepeMachines: 'Machines à crêpes',
      chamberVacuum: 'Sous vide à chambre',
      externalVacuum: 'Sous vide externe',
      handWrappers: 'Enrouleurs manuels',
      sousVideCooking: 'Cuisson sous vide',
      bags: 'Sacs',
    },
    emailSignup: {
      title: 'ENTREZ VOTRE E-MAIL POUR RECEVOIR LES DERNIÈRES OFFRES ET PLUS ENCORE !',
      emailPlaceholder: 'Votre adresse e-mail',
      buttonText: 'S\'inscrire',
    },
    signIn: {
      title: 'Se connecter',
      subtitle: 'Si vous avez un compte, connectez-vous avec votre adresse e-mail.',
      emailLabel: 'E-mail',
      passwordLabel: 'Mot de passe',
      rememberMe: 'Se souvenir de moi',
      signInButton: 'Se connecter',
      signingIn: 'Connexion en cours…',
      forgotPassword: 'Mot de passe oublié ?',
      noAccountTitle: 'Vous n\'avez pas de compte ?',
      advantages: 'Avantages',
      advantageOrder: 'Commandez vos produits en ligne',
      advantageDownload: 'Téléchargez des logos, images et documents',
      advantageTraining: 'Formulaires de demande de formation',
      advantageDiscounts: 'Voir tous les produits avec vos remises',
      createAccount: 'Créer un compte',
      errorFillFields: 'Veuillez remplir tous les champs obligatoires.',
      errorUnableToSignIn: 'Impossible de se connecter. Veuillez réessayer plus tard.',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
      pageTitle: 'Se connecter | Eurodib',
      pageDescription: 'Connectez-vous à votre compte Eurodib pour accéder à des fonctionnalités exclusives, commander des produits en ligne et gérer votre compte.',
    },
    createAccount: {
      pageTitle: 'Créer un compte | Eurodib',
      pageDescription: 'Créez un compte revendeur Eurodib en fournissant les informations de votre entreprise, le contact comptes fournisseurs et votre consentement à notre politique de confidentialité.',
      title: 'Créer un compte',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      companyInfo: 'Informations sur l\'entreprise',
      companyName: 'Nom de l\'entreprise',
      companyLegalName: 'Nom légal de l\'entreprise',
      address: 'Adresse',
      city: 'Ville',
      province: 'Province',
      country: 'Pays',
      postalCode: 'Code postal',
      phone: 'Téléphone',
      inBusinessSince: 'En activité depuis',
      accountsPayableContact: 'Contact comptes fournisseurs',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'E-mail',
      emailForInvoices: 'E-mail pour les factures',
      preferredLanguage: 'Langue préférée',
      consentPrivacy: 'En soumettant ce formulaire, vous consentez à ce qu\'Eurodib collecte, utilise et stocke vos informations personnelles conformément à notre',
      consentPrivacyLink: 'politique de confidentialité',
      consentPrivacyEnd: 'et aux exigences légales en vigueur.',
      consentTruth: 'Je déclare que les informations fournies sont complètes et exactes.',
      newsletterOptin: 'Je souhaite m\'abonner à la newsletter pour être informé des promotions et des dernières nouvelles.',
      notRobot: 'Je ne suis pas un robot',
      send: 'Envoyer',
    },
    ourReps: {
      canada: 'Canada',
      unitedStates: 'États-Unis',
      searchPlaceholder: 'Entrez le code postal (US) ou le code postal (CA), ou l\'État/Province',
      findRep: 'Trouver un représentant',
      selectedArea: 'Zone sélectionnée',
      loading: 'Chargement des représentants…',
      noRepsFound: 'Aucun représentant trouvé pour cette recherche.',
    },
    whereToBuy: {
      postalCodePlaceholder: 'Votre code postal',
      findRetailer: 'Trouver un détaillant',
    },
    forgotPassword: {
      pageTitle: 'Mot de passe oublié | Eurodib',
      title: 'Mot de passe oublié',
      subtitle: 'Veuillez entrer votre adresse e-mail ci-dessous pour recevoir une réinitialisation de mot de passe.',
      emailLabel: 'E-mail',
      resetButton: 'Réinitialiser mon mot de passe',
    },
    brands: {
      pageTitle: 'Nos marques | Eurodib',
      pageDescription: 'Découvrez le portefeuille de marques premium d\'Eurodib : Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz et d\'autres marques d\'équipements de cuisine professionnels.',
      home: 'Accueil',
      categories: 'Catégories',
      ourBrands: 'Nos marques',
      bannerAlt: 'Bannière de nos marques',
      defaultTitle: 'Nos marques',
      defaultSeoTitle: 'Nos marques | Eurodib',
      defaultSeoDescription: 'Découvrez le portefeuille de marques premium d\'Eurodib : Atmovac, Brema, Cofrimell, Dito Sama, Eurodib, Gemm, Krampouz et d\'autres marques d\'équipements de cuisine professionnels.',
    },
    becomeDealer: {
      pageTitle: 'Devenir un revendeur | Eurodib',
      pageDescription: 'Rejoignez le réseau de revendeurs Eurodib et devenez un partenaire de confiance. Développez votre entreprise avec des équipements de cuisine professionnels haut de gamme et un support expert.',
      home: 'Accueil',
      breadcrumb: 'Devenir un revendeur',
      title: 'Devenir un revendeur',
      subtitle: 'Rejoignez notre réseau de revendeurs au Canada et aux États-Unis. Accédez à des prix compétitifs, un support dédié, des ressources marketing et des marques d\'équipements de cuisine haut de gamme.',
      subject: 'Sujet',
      subjectContactUs: 'Nous contacter',
      subjectPartsService: 'Pièces et service',
      subjectRequestQuote: 'Demander un devis',
      subjectBecomeDealer: 'Devenir un revendeur',
      subjectJobApplication: 'Candidature spontanée',
      subjectMarketing: 'Marketing et parrainages',
      companyName: 'Nom de l\'entreprise',
      website: 'Site web',
      address: 'Adresse',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'E-mail',
      phone: 'Téléphone',
      message: 'Message',
      dragDrop: 'Glisser-déposer ou',
      browse: 'parcourir',
      pdfOnly: '(Fichiers PDF uniquement)',
      recaptcha: 'reCAPTCHA',
      send: 'Envoyer',
    },
    cart: {
      pageTitle: 'Votre panier | Eurodib',
      pageDescription: 'Consultez votre panier et demandez un devis pour l\'équipement de cuisine professionnel Eurodib.',
      title: 'Votre panier',
      product: 'Produit',
      unitPrice: 'Prix unitaire',
      qty: 'Qté',
      subtotal: 'Sous-total',
      emptyTitle: 'Votre panier est vide',
      emptyMessage: 'Ajoutez des produits à votre panier pour demander un devis',
      estimatedTotal: 'Total estimé',
      requestQuote: 'Demander un devis',
      firstName: 'Prénom*',
      lastName: 'Nom de famille*',
      company: 'Entreprise*',
      email: 'E-mail*',
      phone: 'Téléphone*',
      notRobot: 'Je ne suis pas un robot',
      recaptcha: 'reCAPTCHA',
      privacyTerms: 'Confidentialité · Conditions',
      send: 'Envoyer',
      removeItem: 'Retirer l\'article',
      decrease: 'diminuer',
      increase: 'augmenter',
      quantity: 'quantité',
    },
    account: {
      pageTitle: 'Mon compte | EURODIB',
      pageDescription: 'Consultez et gérez les détails de votre compte Eurodib, les informations de l\'entreprise et les préférences de contact.',
      profile: 'Profil',
      placeOrder: 'Passer votre commande',
      previousOrders: 'Commandes précédentes',
      resourceCenter: 'Centre de ressources',
      bookTraining: 'Réserver une formation',
      signOut: 'Se déconnecter',
      home: 'Accueil',
      userProfile: 'Profil utilisateur',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      companyName: 'Nom de l\'entreprise',
      preferredLanguage: 'Langue préférée',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      province: 'Province',
      postalCode: 'Code postal',
      country: 'Pays',
      editProfile: 'Modifier mon profil',
      editPlaceholder: 'Veuillez saisir les modifications que vous souhaitez apporter',
      send: 'Envoyer',
      ordersPageTitle: 'Commandes précédentes | EURODIB',
      ordersPageDescription: 'Consultez l\'historique de vos commandes Eurodib : achats précédents, détails des commandes et options de recommande rapide pour les revendeurs autorisés.',
      ordersTitle: 'Commandes précédentes',
      orderPlacedOn: 'Commande passée le',
      qty: 'Qté',
      reorder: 'Recommander',
      noOrders: 'Aucune commande pour le moment',
      noOrdersMessage: 'Vous n\'avez pas encore passé de commande. Lorsque vous le ferez, elles apparaîtront ici.',
      trainingPageTitle: 'Réserver une formation | EURODIB',
      trainingPageDescription: 'Demandez une session de formation sur les produits Eurodib pour votre équipe : distributeurs, ventes, service ou utilisateurs finaux.',
      trainingTitle: 'Réserver une formation',
      trainingSubtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNullam eu orci a diam facilisis vulputate. Suspendisse maximus fusce.',
      trainingFirstName: 'Prénom',
      trainingLastName: 'Nom de famille',
      trainingCompanyName: 'Nom de l\'entreprise',
      trainingPhone: 'Téléphone',
      trainingEmail: 'E-mail',
      trainingEstablishmentType: 'Type d\'établissement',
      trainingEstablishmentDistributor: 'Distributeur',
      trainingEstablishmentRestaurant: 'Restaurant',
      trainingEstablishmentHotel: 'Hôtel',
      trainingEstablishmentCatering: 'Traiteur',
      trainingEstablishmentOther: 'Autre',
      trainingFor: 'Pour qui est la formation ?',
      trainingForInternalSales: 'Ventes internes',
      trainingForExternalSales: 'Ventes externes',
      trainingForServiceTeam: 'Équipe de service',
      trainingForEndUsers: 'Utilisateurs finaux',
      trainingAttendees: 'Nombre de participants',
      trainingAttendees1: '1',
      trainingAttendees2: '2',
      trainingAttendees3: '3',
      trainingAttendees4: '4',
      trainingAttendees5Plus: '5+',
      trainingFormat: 'Format de formation',
      trainingFormatVideoCall: 'Appel vidéo',
      trainingFormatOnSite: 'Sur site',
      trainingFormatWebinar: 'Webinaire',
      trainingIdealDate: 'Date idéale pour la formation',
      trainingGoals: 'Veuillez décrire vos objectifs pour la session de formation, y compris tout produit spécifique que vous pourriez avoir à l\'esprit',
      trainingNewsletter: 'Je souhaite m\'abonner à la newsletter pour être informé des promotions et des dernières nouvelles.',
      trainingNotRobot: 'Je ne suis pas un robot',
      trainingSend: 'Envoyer',
    },
    footer: {
      description: 'Eurodib est un distributeur de premier plan.',
      ourStory: 'Notre histoire',
      ourBrands: 'Nos marques',
      ourReps: 'Nos représentants',
      whereToBuy: 'Où acheter',
      becomeADealer: 'Devenir un revendeur',
      ourPolicies: 'Nos politiques',
      careers: 'Carrières',
      latestNews: 'Dernières nouvelles',
      contactUs: 'Nous contacter',
      partsService: 'Pièces et service',
      copyright: '© 2025 Eurodib - Tous droits réservés.',
      termsAndConditions: 'Termes et conditions',
      privacyPolicy: 'Politique de confidentialité',
      cookiePreferences: 'Préférences de cookies',
      sitemap: 'Plan du site',
    },
  },
};

export function getTranslations(locale: SupportedLocale = 'en-CA'): Translations {
  return translations[locale] || translations['en-CA'];
}

/**
 * Получить текущую локаль из браузера (cookie или query параметр)
 */
export function getCurrentLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return 'en-CA';
  }

  // Проверяем query параметр
  const urlParams = new URLSearchParams(window.location.search);
  const localeFromQuery = urlParams.get('locale');
  if (localeFromQuery === 'en-CA' || localeFromQuery === 'fr-CA' || localeFromQuery === 'en-US') {
    return localeFromQuery as SupportedLocale;
  }

  // Проверяем cookie
  const localeFromCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
    ?.split('=')[1];
  if (localeFromCookie === 'en-CA' || localeFromCookie === 'fr-CA' || localeFromCookie === 'en-US') {
    return localeFromCookie as SupportedLocale;
  }

  return 'en-CA';
}

