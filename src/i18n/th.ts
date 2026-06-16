/** Thai UI string dictionary */
const th = {
  // App
  appName: 'AsiaPet EHR',
  clinicSystem: 'ระบบเวชระเบียนสัตว์',

  // Nav
  home: 'หน้าหลัก',
  patients: 'รายชื่อสัตว์ป่วย',
  owners: 'เจ้าของสัตว์',
  appointments: 'นัดหมาย',
  bookings: 'การจองออนไลน์',
  drugReference: 'คู่มือยา',
  diseaseLibrary: 'คลังโรค',
  logout: 'ออกจากระบบ',

  // Auth
  login: 'เข้าสู่ระบบ',
  email: 'อีเมล',
  password: 'รหัสผ่าน',
  loginButton: 'เข้าสู่ระบบ',
  loggingIn: 'กำลังเข้าสู่ระบบ...',
  loginError: 'เข้าสู่ระบบไม่สำเร็จ',
  demoHint: 'บัญชีทดสอบ: vet@asiapet.local / asiapet123',

  // Patients
  patientList: 'รายชื่อสัตว์ป่วย',
  addPatient: 'เพิ่มสัตว์ป่วย',
  searchPatient: 'ค้นหาชื่อ, HN, เจ้าของ...',
  hn: 'HN',
  name: 'ชื่อ',
  species: 'ชนิด',
  breed: 'พันธุ์',
  sex: 'เพศ',
  birthdate: 'วันเกิด',
  color: 'สี',
  owner: 'เจ้าของ',
  ownerPhone: 'เบอร์โทร',
  allergies: 'การแพ้ยา',
  mainDisease: 'โรคประจำตัว',
  deceased: 'เสียชีวิต',
  loading: 'กำลังโหลด...',
  noData: 'ไม่พบข้อมูล',
  save: 'บันทึก',
  saving: 'กำลังบันทึก...',
  cancel: 'ยกเลิก',
  edit: 'แก้ไข',
  delete: 'ลบ',
  confirmDelete: 'ยืนยันการลบ?',
  back: 'กลับ',
  close: 'ปิด',
  total: 'ทั้งหมด',
  items: 'รายการ',
  noResults: 'ไม่พบผลการค้นหา',

  // Patient form
  createPatient: 'เพิ่มสัตว์ป่วยใหม่',
  editPatient: 'แก้ไขข้อมูลสัตว์ป่วย',
  patientInfo: 'ข้อมูลสัตว์ป่วย',
  ownerInfo: 'ข้อมูลเจ้าของ',
  ownerLine: 'Line ID',
  ownerFacebook: 'Facebook',

  // Patient detail tabs
  opdTab: 'OPD',
  rxTab: 'ใบยา (Rx)',
  historyTab: 'ประวัติ',
  labTab: 'ผลแล็บ',
  imagingTab: 'ภาพถ่าย',
  ipdTab: 'ผู้ป่วยใน',
  followupTab: 'นัดติดตาม',
  vaccinesTab: 'วัคซีน',

  // OPD
  opdRecord: 'บันทึก OPD',
  weight: 'น้ำหนัก (kg)',
  temp: 'อุณหภูมิ (°C)',
  heartRate: 'HR (ครั้ง/นาที)',
  respRate: 'RR (ครั้ง/นาที)',
  chiefComplaint: 'Chief Complaint (CC)',
  history: 'ประวัติ (Hx)',
  physicalExam: 'Physical Exam (PE)',
  diagnosis: 'การวินิจฉัย (Dx)',
  diffDiagnosis: 'Differential Dx',
  treatmentPlan: 'แผนการรักษา (Plan)',
  vet: 'สัตวแพทย์',
  savedAt: 'บันทึกเมื่อ',
  noVisit: 'ยังไม่มีบันทึกการรักษา',
  addVisit: 'เริ่มบันทึกการรักษา',
  visitDate: 'วันที่รักษา',

  // Rx
  rxItems: 'รายการยา',
  drugName: 'ชื่อยา',
  instruction: 'วิธีใช้',
  qty: 'จำนวน',
  noRx: 'ไม่มีรายการยา',
  addRxItem: 'เพิ่มรายการยา',

  // Visit history
  visitHistory: 'ประวัติการรักษา',
  noHistory: 'ยังไม่มีประวัติการรักษา',
  visitNo: 'ครั้งที่',

  // Drugs
  drugRef: 'คู่มือยา',
  searchDrug: 'ค้นหายา (ชื่อ, หมวดหมู่)...',
  allCategories: 'ทุกหมวดหมู่',
  brand: 'ยี่ห้อ',
  category: 'หมวดหมู่',
  drugClass: 'กลุ่มยา',
  indication: 'ข้อบ่งใช้',
  doseTable: 'ตารางขนาดยา',
  dosingSpecies: 'ชนิดสัตว์',
  dose: 'ขนาดยา',
  route: 'วิธีให้',
  frequency: 'ความถี่',
  source: 'แหล่งอ้างอิง',
  contraindications: 'ข้อห้ามใช้',
  warning: 'คำเตือน',
  doseCalculator: 'คำนวณขนาดยา',
  bodyWeight: 'น้ำหนักตัว (kg)',
  selectDoseRow: 'เลือกแถวขนาดยา',
  calculatedDose: 'ขนาดยาที่คำนวณได้',
  rawDoseString: 'ขนาดยาดิบ (ต้นฉบับ)',
  noDrugs: 'ไม่พบข้อมูลยา',
  drugCount: 'รายการยา',
  verified: 'ยืนยันจาก',

  // Diseases
  diseaseLib: 'คลังโรค',
  searchDisease: 'ค้นหาโรค (ชื่อ, หมวดหมู่)...',
  allSeverities: 'ทุกระดับ',
  diseaseName: 'ชื่อโรค',
  alsoKnownAs: 'รู้จักในชื่อ',
  affectedSpecies: 'สัตว์ที่ได้รับผล',
  cause: 'สาเหตุ',
  clientScript: 'คำอธิบายสำหรับเจ้าของ',
  prognosis: 'การพยากรณ์โรค',
  prevention: 'การป้องกัน',
  preventable: 'ป้องกันได้',
  preventableNote: 'หมายเหตุการป้องกัน',
  severity: 'ความรุนแรง',
  noDisease: 'ไม่พบข้อมูลโรค',
  diseaseCount: 'รายการโรค',

  // Severity labels
  emergency: 'ฉุกเฉิน',
  urgent: 'เร่งด่วน',
  chronic: 'เรื้อรัง',
  routine: 'ทั่วไป',

  // Preventable
  yes: 'ใช่',
  partial: 'บางส่วน',
  no: 'ไม่',

  // Errors
  errorLoad: 'โหลดข้อมูลไม่สำเร็จ',
  errorSave: 'บันทึกข้อมูลไม่สำเร็จ',
  errorDelete: 'ลบข้อมูลไม่สำเร็จ',
  errorNetwork: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์',
  retry: 'ลองอีกครั้ง',

  // Home
  welcomeTitle: 'ยินดีต้อนรับสู่ AsiaPet EHR',
  welcomeSubtitle: 'ระบบเวชระเบียนอิเล็กทรอนิกส์สำหรับคลินิกสัตว์',
  quickNav: 'เมนูลัด',
  viewPatients: 'ดูรายชื่อสัตว์ป่วย',
  viewDrugs: 'ดูคู่มือยา',
  viewDiseases: 'ดูคลังโรค',

  // Misc
  bloodPressure: 'ความดันโลหิต',
  select: 'เลือก',
  actions: 'การดำเนินการ',
  view: 'ดู',
  required: 'จำเป็น',
  optional: 'ไม่บังคับ',
  notes: 'หมายเหตุ',
  phone: 'เบอร์โทร',
  date: 'วันที่',
  time: 'เวลา',
  status: 'สถานะ',

  // Owners
  ownersList: 'รายชื่อเจ้าของสัตว์',
  addOwner: 'เพิ่มเจ้าของ',
  searchOwner: 'ค้นหาชื่อ, เบอร์โทร...',
  createOwner: 'เพิ่มเจ้าของใหม่',
  editOwner: 'แก้ไขข้อมูลเจ้าของ',

  // Appointments
  appointmentsList: 'รายการนัดหมาย',
  addAppointment: 'เพิ่มนัดหมาย',
  createAppointment: 'เพิ่มนัดหมายใหม่',
  filterByDate: 'กรองตามวันที่',
  appointmentDate: 'วันที่นัด',
  appointmentTime: 'เวลา',
  patientHN: 'HN สัตว์ป่วย',
  statusPending: 'รอยืนยัน',
  statusConfirmed: 'ยืนยันแล้ว',
  statusDone: 'เสร็จสิ้น',
  statusCancelled: 'ยกเลิก',

  // Bookings
  bookingsList: 'รายการจองออนไลน์',
  bookingName: 'ชื่อผู้จอง',
  bookingPetName: 'ชื่อสัตว์เลี้ยง',
  bookingReason: 'เหตุผลการจอง',

  // Lab tab
  labSpecies: 'ชนิดสัตว์ (ค่าอ้างอิง)',
  labName: 'รายการ',
  labResult: 'ผล',
  labUnit: 'หน่วย',
  labMin: 'Min',
  labMax: 'Max',
  labSmear: 'Blood Smear',
  addLabRow: 'เพิ่มรายการ',
  noLab: 'ไม่มีผลแล็บ',

  // Imaging tab
  imagingNotes: 'บันทึกภาพถ่าย',
  noImaging: 'ไม่มีข้อมูลภาพถ่าย',

  // IPD tab
  ipdNotes: 'บันทึก IPD',
  noIpd: 'ไม่มีข้อมูล IPD',

  // Followup tab
  recheckDate: 'วันนัดติดตาม',
  recheckTime: 'เวลานัด',
  recheckReason: 'เหตุผลการนัด',
  noFollowup: 'ยังไม่มีนัดติดตาม',

  // Vaccines tab
  vaccineName: 'ชื่อวัคซีน',
  vaccineDate: 'วันที่ฉีด',
  vaccineNextDue: 'นัดครั้งต่อไป',
  addVaccine: 'เพิ่มวัคซีน',
  noVaccines: 'ไม่มีประวัติวัคซีน',

  // ---- Clinical Tools nav ----
  clinicalTools: 'เครื่องมือคลินิก',
  toolFluid: 'คำนวณสารน้ำ',
  toolBsa: 'พื้นที่ผิวกาย (BSA)',
  toolPotassium: 'เสริมโพแทสเซียม',
  toolTransfusion: 'การให้เลือด',
  toolFlk: 'FLK/พลาสมา CRI',
  toolFeeding: 'ให้อาหารป่วยวิกฤต',
  toolCrop: 'ป้อนอาหารนก',
  toolNebulization: 'พ่นยา',
  toolAnaphylaxis: 'แพ้รุนแรง',

  // ---- Shared calculator strings ----
  calcWeight: 'น้ำหนัก (kg)',
  calcSpecies: 'ชนิดสัตว์',
  calcEnterWeight: 'กรอกน้ำหนักเพื่อคำนวณ',
  calcResult: 'ผลการคำนวณ',
  calcInputs: 'ข้อมูลป้อนเข้า',
  calcNotes: 'หมายเหตุ/ข้อควรระวัง',

  // ---- Fluid calculator ----
  fluidTitle: 'คำนวณสารน้ำ',
  fluidDesc: 'คำนวณอัตราน้ำเกลือ (Maintenance + Deficit + Ongoing loss) แยกตามชนิดสัตว์',
  fluidDehydration: 'ระดับขาดน้ำ (%)',
  fluidReplaceHours: 'ระยะเวลาแก้ขาดน้ำ (ชั่วโมง)',
  fluidOngoingLoss: 'Ongoing loss (ml/kg/day)',
  fluidShock: 'ต้องการ Shock bolus',
  fluidMaint: 'Maintenance',
  fluidDeficit: 'Deficit',
  fluidOngoing: 'Ongoing loss',
  fluidTotal24h: 'รวม 24 ชั่วโมงแรก',
  fluidMaintRate: 'อัตรา Maintenance',
  fluidDeficitRate: 'อัตรา Deficit',
  fluidCombinedRate: 'Combined IV/IO drip',
  fluidShockDose: 'Total shock dose',
  fluidShockIncrement: 'ให้ 1/4 ครั้งละ',
  fluidRouteNotes: 'เส้นทางและข้อควรระวัง',
  fluidCrystalloid: 'การเลือกสารน้ำ',

  // ---- BSA calculator ----
  bsaTitle: 'BSA — พื้นที่ผิวกาย',
  bsaDesc: 'คำนวณ Body Surface Area (m²) สำหรับคำนวณยาเคมีบำบัดตามพื้นที่ผิว',
  bsaSelectDrug: 'เลือกยา (ไม่บังคับ)',
  bsaNoDrug: '— ไม่เลือกยา —',
  bsaResult: 'Body Surface Area',
  bsaConstK: 'ค่าคงที่ K',
  bsaFormula: 'สูตรคำนวณ',
  bsaTotalDose: 'Total dose',
  bsaDosePerM2: 'ขนาดต่อ m²',

  // ---- Potassium supplementation ----
  potassiumTitle: 'เสริมโพแทสเซียม (K⁺ Sliding Scale)',
  potassiumDesc: 'Scott\'s potassium supplementation sliding scale — กำหนดปริมาณ KCl ใน fluids จากระดับ serum K⁺',
  potassiumSerum: 'Serum K⁺ (mEq/L)',
  potassiumDiagnosis: 'การวินิจฉัย',
  potassiumKcl: 'เพิ่ม KCl ใน 1L fluids',
  potassiumMaxRate: 'อัตราสารน้ำสูงสุด',
  potassiumHyper: 'HYPERKALEMIA',
  potassiumEnterK: 'กรอก Serum K⁺ เพื่อดูคำแนะนำ',

  // ---- Blood transfusion ----
  transfusionTitle: 'การให้เลือด (Blood Transfusion)',
  transfusionDesc: 'คำนวณปริมาตรเลือดที่ต้องการสำหรับ transfusion',
  transfusionKFactor: 'Species (ค่า K)',
  transfusionCurrentPcv: 'PCV ปัจจุบัน (%)',
  transfusionDesiredPcv: 'PCV เป้าหมาย',
  transfusionDonorPcv: 'PCV donor (%)',
  transfusionVolume: 'ปริมาตรเลือด',
  transfusionCpd: 'Anticoagulant CPD',
  transfusionDonorFluid: 'สารน้ำทดแทน donor',
  transfusionCpm: 'CPM (Chlorpheniramine)',
  transfusionInitRate: 'อัตรา 15 นาทีแรก',
  transfusionFullRate: 'อัตราหลัง 15 นาที',

  // ---- FLK CRI ----
  flkTitle: 'FLK / FFP CRI Calculator',
  flkDesc: 'คำนวณ Fentanyl-Lidocaine-Ketamine CRI recipe ใน syringe ขนาดที่กำหนด',
  flkDuration: 'ระยะเวลา (ชั่วโมง)',
  flkSyringe: 'ขนาด Syringe (ml)',
  flkFRate: 'Fentanyl (mg/kg/h)',
  flkLRate: 'Lidocaine (mg/kg/h)',
  flkKRate: 'Ketamine (mg/kg/h)',
  flkFentanyl: 'Fentanyl',
  flkLidocaine: 'Lidocaine',
  flkKetamine: 'Ketamine',
  flkNss: 'เติม NSS',
  flkDeliveryRate: 'อัตราหยด',
  flkTotalDrug: 'ปริมาตรยารวม',
  flkExceeds: 'ปริมาตรยาเกิน syringe',

  // ---- Critical care feeding ----
  feedingTitle: 'ให้อาหารป่วยวิกฤต (RER)',
  feedingDesc: 'คำนวณ Resting Energy Requirement (RER) และแผนการให้อาหารในสัตว์ป่วยหนัก',
  feedingSpecies: 'กลุ่มสัตว์',
  feedingIllness: 'Illness factor',
  feedingDietKcal: 'ค่าพลังงานอาหาร (kcal/g)',
  feedingFeeds: 'จำนวนมื้อ/วัน',
  feedingRatio: 'อัตราส่วน ผง:น้ำ',
  feedingBaseRer: 'Baseline RER/SMR',
  feedingTotalKcal: 'kcal รวม/วัน',
  feedingTotalGrams: 'ผงรวม',
  feedingTotalSlurry: 'Slurry รวม',
  feedingPerFeed: 'ต่อมื้อ',
  feedingOralLimitWarn: 'เกิน Oral limit 3% BW',

  // ---- Crop feeding ----
  cropTitle: 'ป้อนอาหารนก (Post-op Crop)',
  cropDesc: 'แผนการป้อนอาหารหลังผ่าตัด Crop ในนก — ลดปริมาณตามระยะหาย',
  cropCap: 'Crop capacity',
  cropDay: 'วัน',
  cropPct: '% capacity',
  cropVolume: 'ปริมาตร (ml)',
  cropMix: 'สัดส่วนผง:น้ำ',
  cropNotes2: 'หมายเหตุ',
  cropComplications: 'ภาวะแทรกซ้อนที่ต้องระวัง',
  cropWoundCare: 'การดูแลแผลและการแนะนำเจ้าของ',

  // ---- Nebulization ----
  nebTitle: 'พ่นยา (Nebulization)',
  nebDesc: 'ตารางสูตรพ่นยา — แหล่งที่มา BSAVA Manual of Rabbit Medicine 2e, Chapter 11, Table 11.8',
  nebDrug: 'ยา',
  nebDose: 'ขนาด (BSAVA Rabbit Med Ch.11)',
  nebClass: 'กลุ่มยา',
  nebIndication: 'ข้อบ่งใช้',
  nebProtocol: 'วิธีปฏิบัติ',
  nebSafety: 'ความปลอดภัย',

  // ---- Anaphylaxis ----
  anaphTitle: 'แพ้รุนแรง (Anaphylaxis Protocol)',
  anaphDesc: 'โปรโตคอลรักษาภาวะแพ้รุนแรงแบบ stepwise พร้อมขนาดยาคำนวณตามน้ำหนัก',
  anaphSteps: 'ขั้นตอนการรักษา',
  anaphTriggers: 'Triggers ที่พบบ่อยในสัตว์แปลกหลาย',
} as const;

export type ThKey = keyof typeof th;
export default th;
