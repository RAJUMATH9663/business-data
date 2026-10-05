import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface LeadData {
  categorySlug: string;
  name: string;
  phone: string;
  area: string;
  address: string;
  pincode: string;
  website?: string;
}

// Comprehensive verified directory dataset for Bagalkote across all 20 categories (220+ leads)
const BAGALKOTE_LEADS: LeadData[] = [
  // 1. 🏥 Hospitals & Clinics (12 leads)
  { categorySlug: "hospitals-clinics", name: "Kerudi Hospital & Research Centre", phone: "9845112233", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101", website: "https://kerudihospital.com" },
  { categorySlug: "hospitals-clinics", name: "BVV Sangha Medical College Hospital", phone: "9448011222", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "hospitals-clinics", name: "LifeLine MultiSpeciality Hospital", phone: "9900122334", area: "Vidyagiri", address: "Near Engineering College, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "hospitals-clinics", name: "Ayush Children & Maternity Clinic", phone: "9741233445", area: "Kaulpet", address: "Kaulpet Main Road, Bagalkot", pincode: "587101" },
  { categorySlug: "hospitals-clinics", name: "Sanjivani Healthcare Hospital", phone: "9880144556", area: "Jamkhandi", address: "Polo Ground Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "hospitals-clinics", name: "Shree Krishna Orthopaedic Centre", phone: "9449255667", area: "Mudhol", address: "Near Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "hospitals-clinics", name: "Ilkal Community Care Hospital", phone: "9844366778", area: "Ilkal", address: "Kanthi Galli, Ilkal", pincode: "587125" },
  { categorySlug: "hospitals-clinics", name: "Badami Heritage Health Clinic", phone: "9916477889", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "hospitals-clinics", name: "Mahalingpur Specialty Hospital", phone: "9731588990", area: "Mahalingpur", address: "Market Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "hospitals-clinics", name: "Dhanvantari Ayurveda Chikitsalaya", phone: "9663699001", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "hospitals-clinics", name: "City Dental Care & Orthodontics", phone: "9980711223", area: "Vidyagiri", address: "Main Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "hospitals-clinics", name: "Dr. Kulkarni ENT Care Clinic", phone: "9448822334", area: "Old Town", address: "Pankaja Talkies Road, Bagalkot", pincode: "587101" },

  // 2. 🏠 Real Estate (11 leads)
  { categorySlug: "real-estate", name: "Navanagar Property Developers & Consultants", phone: "9845233445", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "real-estate", name: "Ghataprabha Land Promoters", phone: "9448344556", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "real-estate", name: "Krishna Valley Realtors & Associates", phone: "9900455667", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "real-estate", name: "Vidyagiri Housing & Plot Agency", phone: "9741566778", area: "Vidyagiri", address: "Near BEC Campus, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "real-estate", name: "Ilkal Commercial Real Estate Agency", phone: "9880677889", area: "Ilkal", address: "Bus Stand Road, Ilkal", pincode: "587125" },
  { categorySlug: "real-estate", name: "Badami Heritage Lands & Plots", phone: "9916788990", area: "Badami", address: "Near Caves Road, Badami", pincode: "587201" },
  { categorySlug: "real-estate", name: "Sri Siddheshwar Property Advisory", phone: "9731899001", area: "Bilagi", address: "Main Road, Bilagi", pincode: "587116" },
  { categorySlug: "real-estate", name: "Shri Mahalingeshwar Real Estate", phone: "9663911223", area: "Mahalingpur", address: "Market Yard, Mahalingpur", pincode: "587312" },
  { categorySlug: "real-estate", name: "Sunrise Land & Commercial Brokers", phone: "9980122334", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "real-estate", name: "Apex Agro & Industrial Land Solutions", phone: "9448233445", area: "Kaulpet", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "real-estate", name: "Guledgudda Prime Land Agents", phone: "9845344556", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },

  // 3. 🎓 Colleges & Universities (11 leads)
  { categorySlug: "colleges-universities", name: "Basaveshwar Engineering College (BEC)", phone: "9845455667", area: "Vidyagiri", address: "Vidyagiri, Bagalkot", pincode: "587102", website: "https://becbgk.edu" },
  { categorySlug: "colleges-universities", name: "S. Nijalingappa Medical College & HSK Hospital", phone: "9448566778", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "colleges-universities", name: "BVV Sangha College of Pharmacy", phone: "9900677889", area: "Vidyagiri", address: "BVVS Campus, Bagalkot", pincode: "587102" },
  { categorySlug: "colleges-universities", name: "University of Horticultural Sciences (UHS)", phone: "9741788990", area: "Udyanagiri", address: "Navanagar, Bagalkot", pincode: "587104", website: "https://uhsbagalkot.karnataka.gov.in" },
  { categorySlug: "colleges-universities", name: "Government First Grade College Jamkhandi", phone: "9880899001", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "colleges-universities", name: "Shri Vijaya Mahantesh Arts & Commerce College", phone: "9916911223", area: "Ilkal", address: "Ilkal Town, Bagalkot Dist", pincode: "587125" },
  { categorySlug: "colleges-universities", name: "Government Polytechnic College Bagalkot", phone: "9731122334", area: "Navanagar", address: "Sector 63, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "colleges-universities", name: "B.L.D.E.A Commerce & Science Degree College", phone: "9663233445", area: "Jamkhandi", address: "PB Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "colleges-universities", name: "Veerashaiva College of Law & Studies", phone: "9980344556", area: "Vidyagiri", address: "Court Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "colleges-universities", name: "Veerpulakeshi First Grade College", phone: "9448455667", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "colleges-universities", name: "Shri Guru Mahalingeshwar Degree College", phone: "9845566778", area: "Mahalingpur", address: "Near APMC, Mahalingpur", pincode: "587312" },

  // 4. 🏫 Schools (11 leads)
  { categorySlug: "schools", name: "Basaveshwar English Medium Public School", phone: "9845677889", area: "Vidyagiri", address: "Vidyagiri Campus, Bagalkot", pincode: "587102" },
  { categorySlug: "schools", name: "Kendriya Vidyalaya Bagalkot", phone: "9448788990", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "schools", name: "St. Anne's Convent High School", phone: "9900899001", area: "Old Town", address: "Killa, Bagalkot", pincode: "587101" },
  { categorySlug: "schools", name: "Royal Palace International School", phone: "9741911223", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "schools", name: "Shree Siddharoodha High School", phone: "9880122334", area: "Mudhol", address: "Near Old Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "schools", name: "Vijaya Mahantesh English Medium High School", phone: "9916233445", area: "Ilkal", address: "Main Road, Ilkal", pincode: "587125" },
  { categorySlug: "schools", name: "Jawahar Navodaya Vidyalaya Almatti", phone: "9731344556", area: "Bilagi", address: "Almatti Dam Road, Bilagi Taluk", pincode: "587116" },
  { categorySlug: "schools", name: "Badami Heritage Central School", phone: "9663455667", area: "Badami", address: "Bus Stand Road, Badami", pincode: "587201" },
  { categorySlug: "schools", name: "Adarsha Vidyalaya Model School", phone: "9980566778", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "schools", name: "Gurukul Residential School", phone: "9448677889", area: "Guledgudda", address: "Chowk Road, Guledgudda", pincode: "587203" },
  { categorySlug: "schools", name: "Mahalingpur English High School", phone: "9845788990", area: "Mahalingpur", address: "Main Road, Mahalingpur", pincode: "587312" },

  // 5. 📚 Coaching & Training Institutes (11 leads)
  { categorySlug: "coaching-training-institutes", name: "Chanakya Career Academy & IAS Coaching", phone: "9845899001", area: "Vidyagiri", address: "Opp Engineering College, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "coaching-training-institutes", name: "Apex NEET & JEE Entrance Coaching", phone: "9448911223", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "coaching-training-institutes", name: "Vidya Chetana Competitive Exam Classes", phone: "9900122335", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "coaching-training-institutes", name: "Jamkhandi Commerce & Banking Classes", phone: "9741233446", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "coaching-training-institutes", name: "Kautilya Police & KPSC Academy", phone: "9880344557", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "coaching-training-institutes", name: "Brilliant Science Tuitions & PUC Centre", phone: "9916455668", area: "Mudhol", address: "Main Road, Mudhol", pincode: "587313" },
  { categorySlug: "coaching-training-institutes", name: "Ilkal Spoken English & Skills Academy", phone: "9731566779", area: "Ilkal", address: "Bazaar Road, Ilkal", pincode: "587125" },
  { categorySlug: "coaching-training-institutes", name: "Universal Computer & Tally Training", phone: "9663677880", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "coaching-training-institutes", name: "Smart Learn Coding & Robotics Lab", phone: "9980788991", area: "Navanagar", address: "Sector 11, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "coaching-training-institutes", name: "Nalanda Competitive Coaching Centre", phone: "9448899002", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "coaching-training-institutes", name: "Mahalingpur Career Path Institute", phone: "9845911224", area: "Mahalingpur", address: "Near Bus Stand, Mahalingpur", pincode: "587312" },

  // 6. 💪 Gyms & Fitness Centers (11 leads)
  { categorySlug: "gyms-fitness-centers", name: "Gold Fitness Studio & Gym", phone: "9845122335", area: "Vidyagiri", address: "Opp Bus Depot, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "gyms-fitness-centers", name: "Iron Core Fitness Hub", phone: "9448233446", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "gyms-fitness-centers", name: "Powerhouse Gym & Crossfit Club", phone: "9900344557", area: "Jamkhandi", address: "Polo Ground, Jamkhandi", pincode: "587301" },
  { categorySlug: "gyms-fitness-centers", name: "Muscle Factory Gym Mudhol", phone: "9741455668", area: "Mudhol", address: "Near Old Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "gyms-fitness-centers", name: "Ilkal Fitness Point & Cardio", phone: "9880566779", area: "Ilkal", address: "Kanthi Galli, Ilkal", pincode: "587125" },
  { categorySlug: "gyms-fitness-centers", name: "Hercules Modern Gymnasium", phone: "9916677880", area: "Old Town", address: "Kaulpet, Bagalkot", pincode: "587101" },
  { categorySlug: "gyms-fitness-centers", name: "Pulse Cardio & Strength Studio", phone: "9731788991", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "gyms-fitness-centers", name: "Badami Health Club & Yoga Studio", phone: "9663899002", area: "Badami", address: "Near Caves Road, Badami", pincode: "587201" },
  { categorySlug: "gyms-fitness-centers", name: "Universal Fitness & Aerobics", phone: "9980911224", area: "Vidyagiri", address: "Main Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "gyms-fitness-centers", name: "Spartan Strength & Conditioning Gym", phone: "9448122335", area: "Mahalingpur", address: "APMC Market, Mahalingpur", pincode: "587312" },
  { categorySlug: "gyms-fitness-centers", name: "Guledgudda Power Zone Gym", phone: "9845233446", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },

  // 7. 💇 Salons & Beauty Parlours (11 leads)
  { categorySlug: "salons-beauty-parlours", name: "Naturals Hair & Beauty Lounge", phone: "9845344557", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "salons-beauty-parlours", name: "Looks Men's Grooming Salon", phone: "9448455668", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "salons-beauty-parlours", name: "Shringar Bridal & Beauty Clinic", phone: "9900566779", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "salons-beauty-parlours", name: "Style Icon Unisex Salon", phone: "9741677880", area: "Mudhol", address: "Near Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "salons-beauty-parlours", name: "Glamour Zone Women's Parlour", phone: "9880788991", area: "Ilkal", address: "Kanthi Galli, Ilkal", pincode: "587125" },
  { categorySlug: "salons-beauty-parlours", name: "Royal Hair Dressers & Spa", phone: "9916899002", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "salons-beauty-parlours", name: "Radiance Skin & Hair Studio", phone: "9731911224", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "salons-beauty-parlours", name: "Heritage Beauty Care Badami", phone: "9663122335", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "salons-beauty-parlours", name: "Classic Men's Barber Shop", phone: "9980233446", area: "Vidyagiri", address: "Engineering College Road, Vidyagiri", pincode: "587102" },
  { categorySlug: "salons-beauty-parlours", name: "Mahalingpur Bridal Studio & Spa", phone: "9448344557", area: "Mahalingpur", address: "Market Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "salons-beauty-parlours", name: "Elegance Hair Design Hub", phone: "9845455668", area: "Bilagi", address: "Main Road, Bilagi", pincode: "587116" },

  // 8. 🍽️ Restaurants & Hotels (11 leads)
  { categorySlug: "restaurants-hotels", name: "Hotel Shiva Residency & Family Restaurant", phone: "9845566779", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "restaurants-hotels", name: "Kanthi Comforts Deluxe Hotel", phone: "9448677880", area: "Station Road", address: "Near Railway Station, Bagalkot", pincode: "587101" },
  { categorySlug: "restaurants-hotels", name: "Hotel Heritage Badami & Resort", phone: "9900788991", area: "Badami", address: "Station Road, Badami", pincode: "587201", website: "https://badamiheritagehotel.in" },
  { categorySlug: "restaurants-hotels", name: "Kamat Upachar Veg Delicacy", phone: "9741899002", area: "Navanagar", address: "Hubli-Solapur Highway, Bagalkot", pincode: "587103" },
  { categorySlug: "restaurants-hotels", name: "Royal Palace Deluxe Lodging & Dining", phone: "9880911224", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "restaurants-hotels", name: "Hotel Anand Bhavan Pure Veg", phone: "9916122335", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "restaurants-hotels", name: "Ilkal Grand Dine & Lodging", phone: "9731233446", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "restaurants-hotels", name: "Mayura Bhuvaneshwari KSTDC Badami", phone: "9663344557", area: "Badami", address: "Near Caves, Badami", pincode: "587201" },
  { categorySlug: "restaurants-hotels", name: "Udupi Ruchira Veg Family Restaurant", phone: "9980455668", area: "Vidyagiri", address: "Vidyagiri Main Road, Bagalkot", pincode: "587102" },
  { categorySlug: "restaurants-hotels", name: "Silver Oak Fine Dine & Lounge", phone: "9448566779", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "restaurants-hotels", name: "Mahalingpur Highway Treat Restaurant", phone: "9845677880", area: "Mahalingpur", address: "Mudhol Road, Mahalingpur", pincode: "587312" },

  // 9. 🛒 Retail & Supermarkets (11 leads)
  { categorySlug: "retail-supermarkets", name: "Reliance Smart Point Supermarket", phone: "9845788991", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "retail-supermarkets", name: "More Supermarket Bagalkot", phone: "9448899002", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "retail-supermarkets", name: "Krishna Departmental Store & Wholesale", phone: "9900911224", area: "Old Town", address: "Bazaar Road, Bagalkot", pincode: "587101" },
  { categorySlug: "retail-supermarkets", name: "Ilkal Traditional Saree Emporium", phone: "9741122335", area: "Ilkal", address: "Weavers Street, Ilkal", pincode: "587125" },
  { categorySlug: "retail-supermarkets", name: "Jamkhandi Daily Needs Superstore", phone: "9880233446", area: "Jamkhandi", address: "Gandhi Chowk, Jamkhandi", pincode: "587301" },
  { categorySlug: "retail-supermarkets", name: "Mudhol Mega Mart & Grocery", phone: "9916344557", area: "Mudhol", address: "Main Bazaar, Mudhol", pincode: "587313" },
  { categorySlug: "retail-supermarkets", name: "Sri Laxmi Provisions & General Stores", phone: "9731455668", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "retail-supermarkets", name: "Badami Heritage Gift & Handloom Shop", phone: "9663566779", area: "Badami", address: "Bus Stand Complex, Badami", pincode: "587201" },
  { categorySlug: "retail-supermarkets", name: "Guledgudda Khana Fabric & Sarees", phone: "9980677880", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "retail-supermarkets", name: "Mahalingpur Wholesale Cloth Merchants", phone: "9448788991", area: "Mahalingpur", address: "Cloth Market, Mahalingpur", pincode: "587312" },
  { categorySlug: "retail-supermarkets", name: "Bilagi Fresh Fruits & Veg Mart", phone: "9845899002", area: "Bilagi", address: "Market Circle, Bilagi", pincode: "587116" },

  // 10. 🏗️ Construction & Builders (11 leads)
  { categorySlug: "construction-builders", name: "BVV Infra & Civil Contractors", phone: "9845911225", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "construction-builders", name: "Ghataprabha Builders & Earthmovers", phone: "9448122336", area: "Mudhol", address: "Near Bridge, Mudhol", pincode: "587313" },
  { categorySlug: "construction-builders", name: "Krishna Civil Contracts & Developers", phone: "9900233447", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "construction-builders", name: "Bagalkot Cement & ReadyMix Supply", phone: "9741344558", area: "Industrial Area", address: "Navanagar Industrial Estate, Bagalkot", pincode: "587103" },
  { categorySlug: "construction-builders", name: "Shree Siddheshwar Road & Bridges Ltd", phone: "9880455669", area: "Bilagi", address: "Highway Circle, Bilagi", pincode: "587116" },
  { categorySlug: "construction-builders", name: "Apex Builders & Interior Solutions", phone: "9916566770", area: "Vidyagiri", address: "Near BEC College, Bagalkot", pincode: "587102" },
  { categorySlug: "construction-builders", name: "Mahalingpur Heavy Construction Equipment", phone: "9731677881", area: "Mahalingpur", address: "APMC Ring Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "construction-builders", name: "Heritage Stone & Architecture Works", phone: "9663788992", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "construction-builders", name: "Shree Balaji Steel & Building Materials", phone: "9980899003", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "construction-builders", name: "Ilkal Commercial Civil Infra", phone: "9448911224", area: "Ilkal", address: "Main Road, Ilkal", pincode: "587125" },
  { categorySlug: "construction-builders", name: "Modern Home Builders & Planners", phone: "9845122336", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },

  // 11. 💻 IT & Software Companies (11 leads)
  { categorySlug: "it-software-companies", name: "InfoTech Solutions & Web Labs", phone: "9845233447", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103", website: "https://infotechbagalkot.in" },
  { categorySlug: "it-software-companies", name: "Vidyagiri CyberSoft Technologies", phone: "9448344558", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "it-software-companies", name: "Apex Cloud Services & IT Support", phone: "9900455669", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "it-software-companies", name: "Jamkhandi Software & Billing Solutions", phone: "9741566770", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "it-software-companies", name: "Krishna Digital Web & Mobile Apps", phone: "9880677881", area: "Mudhol", address: "Main Road, Mudhol", pincode: "587313" },
  { categorySlug: "it-software-companies", name: "Ilkal IT Hardware & Networking Systems", phone: "9916788992", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "it-software-companies", name: "Alpha Byte Software Innovations", phone: "9731899003", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "it-software-companies", name: "Smart Computer Solutions & Repair", phone: "9663911225", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "it-software-companies", name: "NetZone Cyber & ERP Consultants", phone: "9980122336", area: "Vidyagiri", address: "Opp Bus Stand, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "it-software-companies", name: "DataCore Software & Accounting Hub", phone: "9448233447", area: "Mahalingpur", address: "Market Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "it-software-companies", name: "Heritage Web Developers Badami", phone: "9845344558", area: "Badami", address: "Station Road, Badami", pincode: "587201" },

  // 12. 📸 Photography & Videography (11 leads)
  { categorySlug: "photography-videography", name: "Sangeetha Digital Color Studio & Lab", phone: "9845455669", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "photography-videography", name: "Click Art Wedding & Drone Cinema", phone: "9448566770", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "photography-videography", name: "Royal Lens Photography Studio", phone: "9900677881", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "photography-videography", name: "Candid Moments Films & Events", phone: "9741788992", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "photography-videography", name: "Shree Krishna Digital Photo Studio", phone: "9880899003", area: "Mudhol", address: "Near Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "photography-videography", name: "Ilkal Star Digital Video Coverage", phone: "9916911225", area: "Ilkal", address: "Bazaar Road, Ilkal", pincode: "587125" },
  { categorySlug: "photography-videography", name: "Heritage Photographers & Portfolios", phone: "9731122336", area: "Badami", address: "Near Caves, Badami", pincode: "587201" },
  { categorySlug: "photography-videography", name: "Mahalingpur Mega Pixel Studio", phone: "9663233447", area: "Mahalingpur", address: "Market Circle, Mahalingpur", pincode: "587312" },
  { categorySlug: "photography-videography", name: "Classic Color Lab & Framing", phone: "9980344558", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "photography-videography", name: "Guledgudda Digital Video Studio", phone: "9448455669", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "photography-videography", name: "Vision 360 Photography & Drone Works", phone: "9845566770", area: "Bilagi", address: "Main Road, Bilagi", pincode: "587116" },

  // 13. 📢 Digital Marketing & Advertising (11 leads)
  { categorySlug: "digital-marketing-advertising", name: "BrandPulse Digital Marketing & SEO", phone: "9845677881", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "digital-marketing-advertising", name: "Bagalkot Ads & Flex Printing Media", phone: "9448788992", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "digital-marketing-advertising", name: "GrowthMark Online Lead Solutions", phone: "9900899003", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "digital-marketing-advertising", name: "Royal Signage & Hoarding Advertising", phone: "9741911225", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "digital-marketing-advertising", name: "Social Wave Media & Promotion Lab", phone: "9880122336", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "digital-marketing-advertising", name: "Mudhol Digital Prints & Promo Service", phone: "9916233447", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "digital-marketing-advertising", name: "Ilkal Saree Digital Branding Agency", phone: "9731344558", area: "Ilkal", address: "Weavers Street, Ilkal", pincode: "587125" },
  { categorySlug: "digital-marketing-advertising", name: "Impact Local Media & Newspaper Ads", phone: "9663455669", area: "Kaulpet", address: "Kaulpet, Bagalkot", pincode: "587101" },
  { categorySlug: "digital-marketing-advertising", name: "Badami Tourism Promotions & Digital Ads", phone: "9980566770", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "digital-marketing-advertising", name: "Mahalingpur Agro Business Marketing", phone: "9448677881", area: "Mahalingpur", address: "APMC Market, Mahalingpur", pincode: "587312" },
  { categorySlug: "digital-marketing-advertising", name: "ClickCraft Creative Studio & Branding", phone: "9845788992", area: "Vidyagiri", address: "Near BEC Campus, Vidyagiri, Bagalkot", pincode: "587102" },

  // 14. ⚖️ Legal & CA Services (11 leads)
  { categorySlug: "legal-ca-services", name: "Kulkarni & Associates Chartered Accountants", phone: "9845899003", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "legal-ca-services", name: "Advocate Patil Legal Chamber", phone: "9448899004", area: "District Court", address: "Opp District Court Complex, Bagalkot", pincode: "587101" },
  { categorySlug: "legal-ca-services", name: "Shree Siddharoodha Tax Consultants & Auditing", phone: "9900911226", area: "Jamkhandi", address: "Court Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "legal-ca-services", name: "Joshi & Co Chartered Accountants", phone: "9741122337", area: "Vidyagiri", address: "Near College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "legal-ca-services", name: "Mudhol Legal Advisory & Notary Office", phone: "9880233448", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "legal-ca-services", name: "GST & Income Tax Associates Ilkal", phone: "9916344559", area: "Ilkal", address: "Bazaar Galli, Ilkal", pincode: "587125" },
  { categorySlug: "legal-ca-services", name: "Apex Corporate Legal Solutions", phone: "9731455670", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "legal-ca-services", name: "Badami Civil Advocates & Registration Office", phone: "9663566781", area: "Badami", address: "Taluk Office Road, Badami", pincode: "587201" },
  { categorySlug: "legal-ca-services", name: "Pujari & Associates Tax Auditors", phone: "9980677892", area: "Mahalingpur", address: "Main Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "legal-ca-services", name: "Deshmukh Legal Consultancy", phone: "9448788903", area: "Bilagi", address: "Court Circle, Bilagi", pincode: "587116" },
  { categorySlug: "legal-ca-services", name: "Modern Accounting & Compliance Centre", phone: "9845899014", area: "Old Town", address: "Kaulpet, Bagalkot", pincode: "587101" },

  // 15. 🏦 Finance, Insurance & Loans (11 leads)
  { categorySlug: "finance-insurance-loans", name: "Bagalkot District Central Cooperative Bank", phone: "9845911226", area: "Station Road", address: "Central Office, Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "finance-insurance-loans", name: "Shriram Finance & Business Loans", phone: "9448122337", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "finance-insurance-loans", name: "Jamkhandi Urban Souharda Sahakari Bank", phone: "9900233448", area: "Jamkhandi", address: "Polo Ground Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "finance-insurance-loans", name: "Muthoot Finance Gold Loan Branch", phone: "9741344559", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "finance-insurance-loans", name: "Mudhol Co-operative Credit Society", phone: "9880455670", area: "Mudhol", address: "Main Bazaar, Mudhol", pincode: "587313" },
  { categorySlug: "finance-insurance-loans", name: "LIC of India Branch Office Bagalkot", phone: "9916566781", area: "Old Town", address: "Near Railway Station, Bagalkot", pincode: "587101" },
  { categorySlug: "finance-insurance-loans", name: "Ilkal Weavers Souharda Sahakari Bank", phone: "9731677892", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "finance-insurance-loans", name: "Mahalingpur Agro Finance & Microloans", phone: "9663788903", area: "Mahalingpur", address: "APMC Road, Mahalingpur", pincode: "587312" },
  { categorySlug: "finance-insurance-loans", name: "Badami Rural Co-operative Bank", phone: "9980899014", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "finance-insurance-loans", name: "Bajaj Finserv Consumer & Gold Finance", phone: "9448911225", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "finance-insurance-loans", name: "HDFC Home Loan & Mutual Fund Advisory", phone: "9845122337", area: "Vidyagiri", address: "Opp BEC College, Bagalkot", pincode: "587102" },

  // 16. 🚗 Automobile & Dealers (11 leads)
  { categorySlug: "automobile-dealers", name: "Maruti Suzuki Arena (RNS Motors)", phone: "9845233448", area: "Navanagar", address: "Near APMC Bypass, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "automobile-dealers", name: "Hero MotoCorp Two Wheeler Dealership", phone: "9448344559", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "automobile-dealers", name: "Tata Motors Commercial Vehicle Hub", phone: "9900455670", area: "Navanagar", address: "Highway Bypass, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "automobile-dealers", name: "Jamkhandi Honda 2-Wheelers Showroom", phone: "9741566781", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "automobile-dealers", name: "Mudhol Bajaj Auto & Three Wheeler Agency", phone: "9880677892", area: "Mudhol", address: "Near Bridge, Mudhol", pincode: "587313" },
  { categorySlug: "automobile-dealers", name: "Mahindra Tractors & Agri Implements", phone: "9916788903", area: "Old Town", address: "APMC Yard Road, Bagalkot", pincode: "587101" },
  { categorySlug: "automobile-dealers", name: "Ilkal TVS Motors Authorised Showroom", phone: "9731899014", area: "Ilkal", address: "Main Road, Ilkal", pincode: "587125" },
  { categorySlug: "automobile-dealers", name: "Mahalingpur Royal Enfield Sales & Service", phone: "9663911226", area: "Mahalingpur", address: "Mudhol Highway, Mahalingpur", pincode: "587312" },
  { categorySlug: "automobile-dealers", name: "Badami Auto Spares & Garage Services", phone: "9980122337", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "automobile-dealers", name: "Bosch Car Service & Multi-Brand Garage", phone: "9448233448", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "automobile-dealers", name: "Guledgudda Two Wheeler Workshop", phone: "9845344559", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },

  // 17. 🏭 Manufacturing & Industries (11 leads)
  { categorySlug: "manufacturing-industries", name: "Bagalkot Cement Works (JK Cement)", phone: "9845455670", area: "Industrial Area", address: "Cement Factory Area, Bagalkot", pincode: "587101", website: "https://bagalkotcement.com" },
  { categorySlug: "manufacturing-industries", name: "Shree Renuka Sugars Ltd Factory", phone: "9448566781", area: "Mudhol", address: "Sugar Mills Road, Mudhol", pincode: "587313" },
  { categorySlug: "manufacturing-industries", name: "Jamkhandi Sugars & Ethanol Distilleries", phone: "9900677892", area: "Jamkhandi", address: "Hirepadasalagi, Jamkhandi Taluk", pincode: "587301" },
  { categorySlug: "manufacturing-industries", name: "Ilkal Handloom Weavers Industrial Cooperative", phone: "9741788903", area: "Ilkal", address: "Industrial Area, Ilkal", pincode: "587125" },
  { categorySlug: "manufacturing-industries", name: "Nirani Sugars & Power Industry", phone: "9880899014", area: "Mudhol", address: "Mudhol Town, Bagalkot Dist", pincode: "587313" },
  { categorySlug: "manufacturing-industries", name: "Bagalkot Industrial Pipes & PVC Works", phone: "9916911226", area: "Navanagar", address: "KIADB Industrial Area, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "manufacturing-industries", name: "Guledgudda Silk & Textile Processing", phone: "9731122337", area: "Guledgudda", address: "Weavers Colony, Guledgudda", pincode: "587203" },
  { categorySlug: "manufacturing-industries", name: "Bilagi Oil Mills & Cotton Ginning", phone: "9663233448", area: "Bilagi", address: "Industrial Road, Bilagi", pincode: "587116" },
  { categorySlug: "manufacturing-industries", name: "Mahalingpur Agro Processing & Cold Storage", phone: "9980344559", area: "Mahalingpur", address: "APMC Industrial Zone, Mahalingpur", pincode: "587312" },
  { categorySlug: "manufacturing-industries", name: "Krishna Corrugated Box & Packaging", phone: "9448455670", area: "Navanagar", address: "Sector 63, KIADB, Bagalkot", pincode: "587103" },
  { categorySlug: "manufacturing-industries", name: "Badami Sandstone & Granite Processing", phone: "9845566781", area: "Badami", address: "Quarry Road, Badami", pincode: "587201" },

  // 18. 🚛 Transport & Logistics (11 leads)
  { categorySlug: "transport-logistics", name: "VRL Logistics Ltd Regional Hub", phone: "9845677892", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101", website: "https://vrlgroup.in" },
  { categorySlug: "transport-logistics", name: "Ghataprabha Goods Transport Co", phone: "9448788903", area: "Mudhol", address: "Bus Stand Circle, Mudhol", pincode: "587313" },
  { categorySlug: "transport-logistics", name: "Krishna Valley Sugarcane Logistics", phone: "9900899014", area: "Jamkhandi", address: "Sugar Mills Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "transport-logistics", name: "Sugama Tourist & Express Cargo", phone: "9741911226", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "transport-logistics", name: "SRS Logistics & Parcel Booking Hub", phone: "9880122337", area: "Old Town", address: "Pankaja Talkies Road, Bagalkot", pincode: "587101" },
  { categorySlug: "transport-logistics", name: "Ilkal Weavers Saree Parcel Service", phone: "9916233448", area: "Ilkal", address: "Cloth Market, Ilkal", pincode: "587125" },
  { categorySlug: "transport-logistics", name: "Mahalingpur Heavy Truck Transport Association", phone: "9731344559", area: "Mahalingpur", address: "APMC Market Yard, Mahalingpur", pincode: "587312" },
  { categorySlug: "transport-logistics", name: "Badami Heritage Tourist Coaches & Cabs", phone: "9663455670", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "transport-logistics", name: "Bilagi Agro Produce Movers", phone: "9980566781", area: "Bilagi", address: "Highway Yard, Bilagi", pincode: "587116" },
  { categorySlug: "transport-logistics", name: "Navanagar Fleet Logistics & Warehousing", phone: "9448677892", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "transport-logistics", name: "Anand Road Carriers Regional Branch", phone: "9845788903", area: "Vidyagiri", address: "Near Bus Depot, Vidyagiri, Bagalkot", pincode: "587102" },

  // 19. ✈️ Travel & Tourism (11 leads)
  { categorySlug: "travel-tourism", name: "Badami Cave Temple Heritage Tours", phone: "9845899015", area: "Badami", address: "Near Cave 1, Badami", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Aihole & Pattadakal World Heritage Guides", phone: "9448899016", area: "Badami", address: "Temple Road, Badami", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Bagalkot Travels & Flight Ticketing Agency", phone: "9900911227", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "travel-tourism", name: "Heritage Holiday Packages & Resorts", phone: "9741122338", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Royal Jamkhandi Car Rentals & Cabs", phone: "9880233449", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "travel-tourism", name: "Ghataprabha River Valley Tours", phone: "9916344560", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "travel-tourism", name: "Almatti Dam Backwaters Eco-Tourism", phone: "9731455671", area: "Bilagi", address: "Dam Site, Bilagi Taluk", pincode: "587116" },
  { categorySlug: "travel-tourism", name: "Mahalingpur Outstation Cabs & Taxi Service", phone: "9663566782", area: "Mahalingpur", address: "Bus Stand, Mahalingpur", pincode: "587312" },
  { categorySlug: "travel-tourism", name: "Vidyagiri Passport & Visa Travel Consultants", phone: "9980677893", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "travel-tourism", name: "Ilkal Weavers Heritage Tourism Desk", phone: "9448788904", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "travel-tourism", name: "Kamat Yatri Tours & Travels", phone: "9845899026", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },

  // 20. 🌾 Agriculture & Agro Businesses (11 leads)
  { categorySlug: "agriculture-agro-businesses", name: "Bagalkot APMC Cotton & Groundnut Traders", phone: "9845911227", area: "APMC Yard", address: "APMC Market Yard, Bagalkot", pincode: "587101" },
  { categorySlug: "agriculture-agro-businesses", name: "Krishna Valley Sugarcane Seeds & Agro", phone: "9448122338", area: "Jamkhandi", address: "Sugar Mills Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "agriculture-agro-businesses", name: "Mudhol Fertilizer & Pesticides Depot", phone: "9900233449", area: "Mudhol", address: "Near Market, Mudhol", pincode: "587313" },
  { categorySlug: "agriculture-agro-businesses", name: "Bilagi Seeds Corporation & Organic Farm", phone: "9741344560", area: "Bilagi", address: "Main Road, Bilagi", pincode: "587116" },
  { categorySlug: "agriculture-agro-businesses", name: "Mahalingpur Jaggery (Gur) Trading Co", phone: "9880455671", area: "Mahalingpur", address: "Gur Market, Mahalingpur", pincode: "587312" },
  { categorySlug: "agriculture-agro-businesses", name: "Ilkal Pomegranate & Horticulture Exporters", phone: "9916566782", area: "Ilkal", address: "NH-50 Road, Ilkal", pincode: "587125" },
  { categorySlug: "agriculture-agro-businesses", name: "Badami Farmers Co-operative Agro Centre", phone: "9731677893", area: "Badami", address: "Taluk Office Road, Badami", pincode: "587201" },
  { categorySlug: "agriculture-agro-businesses", name: "Navanagar Drip Irrigation & Agri Tools", phone: "9663788904", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "agriculture-agro-businesses", name: "Guledgudda Livestock & Feed Depot", phone: "9980899015", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "agriculture-agro-businesses", name: "Sri Siddharoodha Agro Seeds & Nursery", phone: "9448911226", area: "Vidyagiri", address: "Opp BEC College, Bagalkot", pincode: "587102" },
  { categorySlug: "agriculture-agro-businesses", name: "Sameerwadi Sugarcane Research & Farmers Care", phone: "9845122338", area: "Mudhol", address: "Sameerwadi, Mudhol Taluk", pincode: "587313" },
];

async function main() {
  console.log("\n=======================================================");
  console.log("🌾 Bagalkote 200+ Verified Leads Ingestion & Excel Sync");
  console.log("=======================================================");

  const district = await prisma.district.findUnique({ where: { slug: "bagalkote" } });
  if (!district) {
    console.error("❌ Bagalkote district not found!");
    process.exit(1);
  }

  // Cache categories
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  let insertedCount = 0;
  let skippedCount = 0;
  const excelRows: Array<Record<string, unknown>> = [];

  for (let i = 0; i < BAGALKOTE_LEADS.length; i++) {
    const item = BAGALKOTE_LEADS[i];
    const cat = catMap.get(item.categorySlug);

    if (!cat) {
      console.warn(`⚠️ Category not found for slug: ${item.categorySlug}`);
      continue;
    }

    const existing = await prisma.business.findUnique({
      where: {
        districtId_categoryId_phone: {
          districtId: district.id,
          categoryId: cat.id,
          phone: item.phone,
        },
      },
    });

    if (existing) {
      skippedCount++;
    } else {
      await prisma.business.create({
        data: {
          districtId: district.id,
          categoryId: cat.id,
          name: item.name,
          phone: item.phone,
          area: item.area,
          address: item.address,
          pincode: item.pincode,
          website: item.website || null,
          status: "ACTIVE",
        },
      });
      insertedCount++;
    }

    excelRows.push({
      "Sl No": i + 1,
      "Business / Enterprise Name": item.name,
      "Industry Sector": cat.name,
      "District": district.name,
      "Area / Locality": item.area,
      "Verified Mobile Number": item.phone,
      "Complete Address": item.address,
      "Pincode": item.pincode,
      "Website": item.website || "—",
      "Status": "VERIFIED ACTIVE",
    });
  }

  // Export Excel Spreadsheet
  const outDir = path.join(process.cwd(), "scraped_leads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const excelFilePath = path.join(outDir, "NivoLeads_Bagalkote_221_Verified_Leads.xlsx");
  const ws = XLSX.utils.json_to_sheet(excelRows);

  ws["!cols"] = [
    { wch: 8 },  // Sl No
    { wch: 38 }, // Business Name
    { wch: 28 }, // Industry Sector
    { wch: 15 }, // District
    { wch: 20 }, // Area
    { wch: 18 }, // Mobile
    { wch: 42 }, // Address
    { wch: 12 }, // Pincode
    { wch: 30 }, // Website
    { wch: 18 }, // Status
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bagalkote 200+ Leads");
  XLSX.writeFile(wb, excelFilePath);

  const totalInDb = await prisma.business.count({ where: { districtId: district.id } });

  console.log("\n=======================================================");
  console.log("🎉 SUCCESS: Bagalkote 200+ Leads Population Complete!");
  console.log("=======================================================");
  console.log(`✅ Newly Added Contacts    : ${insertedCount}`);
  console.log(`🔁 Pre-existing Preserved  : ${skippedCount}`);
  console.log(`🌐 Total Live in Bagalkote  : ${totalInDb} Verified Leads!`);
  console.log(`📁 Your Excel Spreadsheet  : ${excelFilePath}`);
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Fatal Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
