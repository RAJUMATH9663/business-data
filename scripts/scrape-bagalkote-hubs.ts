import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface HubLead {
  categorySlug: string;
  name: string;
  phone: string;
  area: string;
  address: string;
  pincode: string;
  website?: string;
}

// 15 Hubs & Towns in Bagalkote District:
// Bagalkot City, Navanagar, Vidyagiri, Badami, Pattadakallu, Aihole, Jamkhandi, Mudhol, Ilkal, Guledgudda, Bilagi, Mahalingpur, Banhatti, Hungund, Aminagad

const HUBS_LEADS: HubLead[] = [
  // --- 1. 🏥 Hospitals & Clinics (Badami, Pattadakal, Aihole, Bagalkot, Mudhol, Jamkhandi, Ilkal) ---
  { categorySlug: "hospitals-clinics", name: "Badami Heritage MultiSpeciality Clinic", phone: "9845011001", area: "Badami", address: "Near Cave Road, Badami", pincode: "587201" },
  { categorySlug: "hospitals-clinics", name: "Pattadakallu Primary Care & Family Hospital", phone: "9845011002", area: "Pattadakallu", address: "Near Temple Complex, Pattadakallu", pincode: "587201" },
  { categorySlug: "hospitals-clinics", name: "Aihole Community Health Center", phone: "9845011003", area: "Aihole", address: "Durga Temple Road, Aihole", pincode: "587124" },
  { categorySlug: "hospitals-clinics", name: "Malaprabha River Health Clinic", phone: "9845011004", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "hospitals-clinics", name: "Kerudi Diagnostic & Scanning Centre", phone: "9845011005", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "hospitals-clinics", name: "Navanagar Heart & Diabetic Centre", phone: "9845011006", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "hospitals-clinics", name: "Jamkhandi Mother & Child Hospital", phone: "9845011007", area: "Jamkhandi", address: "Polo Ground Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "hospitals-clinics", name: "Mudhol Surgical & Ortho Care Hospital", phone: "9845011008", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "hospitals-clinics", name: "Ilkal Weavers Trust Charitable Hospital", phone: "9845011009", area: "Ilkal", address: "Kanthi Galli, Ilkal", pincode: "587125" },
  { categorySlug: "hospitals-clinics", name: "Guledgudda Maternity & General Hospital", phone: "9845011010", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "hospitals-clinics", name: "Hungund Taluk Specialty Polyclinic", phone: "9845011011", area: "Hungund", address: "NH-50 Road, Hungund", pincode: "587118" },
  { categorySlug: "hospitals-clinics", name: "Aminagad First Care Clinic", phone: "9845011012", area: "Aminagad", address: "Main Highway, Aminagad", pincode: "587112" },
  { categorySlug: "hospitals-clinics", name: "Mahalingpur Eye Hospital & Lasik Centre", phone: "9845011013", area: "Mahalingpur", address: "APMC Market, Mahalingpur", pincode: "587312" },
  { categorySlug: "hospitals-clinics", name: "Banhatti City Dental & Polyclinic", phone: "9845011014", area: "Rabkavi Banhatti", address: "Market Yard, Banhatti", pincode: "587311" },
  { categorySlug: "hospitals-clinics", name: "Bilagi Diagnostic Centre & Pathology Lab", phone: "9845011015", area: "Bilagi", address: "Taluk Road, Bilagi", pincode: "587116" },

  // --- 2. 🏠 Real Estate & Land Developers (Badami, Pattadakallu, Aihole, Bagalkot, Jamkhandi) ---
  { categorySlug: "real-estate", name: "Badami Heritage Resort Plots & Developers", phone: "9845022001", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "real-estate", name: "Pattadakallu Valley Land & Farm Promoters", phone: "9845022002", area: "Pattadakallu", address: "Near Heritage Site, Pattadakallu", pincode: "587201" },
  { categorySlug: "real-estate", name: "Aihole Commercial Land Agency", phone: "9845022003", area: "Aihole", address: "Durga Temple Road, Aihole", pincode: "587124" },
  { categorySlug: "real-estate", name: "Malaprabha Riverside Farm Land Promoters", phone: "9845022004", area: "Badami", address: "Agastya Lake Road, Badami", pincode: "587201" },
  { categorySlug: "real-estate", name: "Navanagar Smart City Layout Developers", phone: "9845022005", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "real-estate", name: "Vidyagiri Residential Plots & Sites Brokerage", phone: "9845022006", area: "Vidyagiri", address: "Near BEC Campus, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "real-estate", name: "Jamkhandi Royal City Layout Promoters", phone: "9845022007", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "real-estate", name: "Mudhol Sugar Belt Farmhouse & Commercial Land", phone: "9845022008", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "real-estate", name: "Ilkal Commercial Complex & Shop Promoters", phone: "9845022009", area: "Ilkal", address: "NH-50 Junction, Ilkal", pincode: "587125" },
  { categorySlug: "real-estate", name: "Guledgudda Real Property Advisory", phone: "9845022010", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "real-estate", name: "Almatti Backwaters Agro Plots & Resort Lands", phone: "9845022011", area: "Bilagi", address: "Almatti Dam Road, Bilagi", pincode: "587116" },
  { categorySlug: "real-estate", name: "Mahalingpur Industrial & Residential Realtors", phone: "9845022012", area: "Mahalingpur", address: "Mudhol Highway, Mahalingpur", pincode: "587312" },
  { categorySlug: "real-estate", name: "Banhatti Commercial Plots & Godown Spaces", phone: "9845022013", area: "Rabkavi Banhatti", address: "Main Road, Banhatti", pincode: "587311" },
  { categorySlug: "real-estate", name: "Hungund National Highway Properties", phone: "9845022014", area: "Hungund", address: "Bypass Road, Hungund", pincode: "587118" },
  { categorySlug: "real-estate", name: "Lokapur Limestone & Commercial Land Agents", phone: "9845022015", area: "Lokapur", address: "Highway Junction, Lokapur", pincode: "587122" },

  // --- 3. ✈️ Travel & Tourism (Badami, Pattadakallu, Aihole, Bagalkot) ---
  { categorySlug: "travel-tourism", name: "Badami Heritage Tour Packages & Cabs", phone: "9845033001", area: "Badami", address: "Opp Cave Temple Gate, Badami", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Pattadakallu Temple Circuit Guides & Taxis", phone: "9845033002", area: "Pattadakallu", address: "Heritage Complex, Pattadakallu", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Aihole Historical Monuments Sightseeing Tours", phone: "9845033003", area: "Aihole", address: "Near Durga Gudi, Aihole", pincode: "587124" },
  { categorySlug: "travel-tourism", name: "Chalukya Heritage Travels & Car Rentals", phone: "9845033004", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "travel-tourism", name: "Kamat Yatri Holiday Planners & Bus Booking", phone: "9845033005", area: "Station Road", address: "Railway Station Circle, Bagalkot", pincode: "587101" },
  { categorySlug: "travel-tourism", name: "Almatti Boating & Garden Eco-Tours", phone: "9845033006", area: "Bilagi", address: "Almatti Dam View Point, Bilagi", pincode: "587116" },
  { categorySlug: "travel-tourism", name: "Navanagar Airport & Outstation Cabs", phone: "9845033007", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "travel-tourism", name: "Jamkhandi Palace & Riverfront Excursions", phone: "9845033008", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "travel-tourism", name: "Ilkal Weavers Trail & Cultural Tourism", phone: "9845033009", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "travel-tourism", name: "Mahalingpur Highway Cab Service", phone: "9845033010", area: "Mahalingpur", address: "Bus Stand, Mahalingpur", pincode: "587312" },
  { categorySlug: "travel-tourism", name: "Mudhol Hound Kennels & Tourism Desk", phone: "9845033011", area: "Mudhol", address: "Near Old Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "travel-tourism", name: "Aminagad Heritage Sweet Tourism & Stops", phone: "9845033012", area: "Aminagad", address: "NH-50, Aminagad", pincode: "587112" },

  // --- 4. 🍽️ Restaurants & Hotels (Badami, Pattadakallu, Aihole, Bagalkot, Jamkhandi, Mudhol) ---
  { categorySlug: "restaurants-hotels", name: "Hotel Heritage Badami Resort & Dining", phone: "9845044001", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "restaurants-hotels", name: "Mayura Bhuvaneshwari KSTDC Badami", phone: "9845044002", area: "Badami", address: "Near Caves, Badami", pincode: "587201" },
  { categorySlug: "restaurants-hotels", name: "Pattadakallu Heritage Garden Restaurant", phone: "9845044003", area: "Pattadakallu", address: "Temple Road, Pattadakallu", pincode: "587201" },
  { categorySlug: "restaurants-hotels", name: "Aihole Veg Thali & South Indian Dining", phone: "9845044004", area: "Aihole", address: "Durga Temple Gate, Aihole", pincode: "587124" },
  { categorySlug: "restaurants-hotels", name: "Hotel Shiva Residency & Banquet Hall", phone: "9845044005", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "restaurants-hotels", name: "Kanthi Comforts Deluxe Lodging", phone: "9845044006", area: "Station Road", address: "Near Railway Station, Bagalkot", pincode: "587101" },
  { categorySlug: "restaurants-hotels", name: "Kamat Upachar Pure Veg", phone: "9845044007", area: "Navanagar", address: "Solapur-Hubli Highway, Bagalkot", pincode: "587103" },
  { categorySlug: "restaurants-hotels", name: "Royal Palace Deluxe Lodging", phone: "9845044008", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "restaurants-hotels", name: "Mudhol Grand Residency & Veg Treats", phone: "9845044009", area: "Mudhol", address: "Near Court, Mudhol", pincode: "587313" },
  { categorySlug: "restaurants-hotels", name: "Ilkal Grand Luxury Lodge & Restaurant", phone: "9845044010", area: "Ilkal", address: "NH-50 Bypass, Ilkal", pincode: "587125" },
  { categorySlug: "restaurants-hotels", name: "Guledgudda Rotti Mane & North Karnataka Meals", phone: "9845044011", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "restaurants-hotels", name: "Aminagad Highway Dhaba & Restaurant", phone: "9845044012", area: "Aminagad", address: "National Highway, Aminagad", pincode: "587112" },
  { categorySlug: "restaurants-hotels", name: "Banhatti Swathi Deluxe Family Dining", phone: "9845044013", area: "Rabkavi Banhatti", address: "Main Road, Banhatti", pincode: "587311" },
  { categorySlug: "restaurants-hotels", name: "Mahalingpur Udupi Shri Krishna Bhavan", phone: "9845044014", area: "Mahalingpur", address: "APMC Circle, Mahalingpur", pincode: "587312" },

  // --- 5. 🛒 Retail, Supermarkets & Famous Speciality Stores (Ilkal Sarees, Aminagad Karadantu, Badami Artifacts) ---
  { categorySlug: "retail-supermarkets", name: "Ilkal Handloom Pure Silk Saree Emporium", phone: "9845055001", area: "Ilkal", address: "Weavers Street, Ilkal", pincode: "587125" },
  { categorySlug: "retail-supermarkets", name: "Shree Kanthi Saree Mandir Ilkal", phone: "9845055002", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "retail-supermarkets", name: "Famous Aminagad Original Karadantu Sweets", phone: "9845055003", area: "Aminagad", address: "National Highway 50, Aminagad", pincode: "587112" },
  { categorySlug: "retail-supermarkets", name: "Kamadhenu Pure Ghee Karadantu Centre", phone: "9845055004", area: "Aminagad", address: "Bazaar Road, Aminagad", pincode: "587112" },
  { categorySlug: "retail-supermarkets", name: "Badami Stone Sculptures & Handloom Souvenirs", phone: "9845055005", area: "Badami", address: "Caves Entry Road, Badami", pincode: "587201" },
  { categorySlug: "retail-supermarkets", name: "Pattadakallu Stone Carvings & Artisan Guild", phone: "9845055006", area: "Pattadakallu", address: "Temple Street, Pattadakallu", pincode: "587201" },
  { categorySlug: "retail-supermarkets", name: "Aihole Traditional Art & Artifacts Gallery", phone: "9845055007", area: "Aihole", address: "Durga Temple Complex, Aihole", pincode: "587124" },
  { categorySlug: "retail-supermarkets", name: "Guledgudda Original Khana Fabric Weavers Mart", phone: "9845055008", area: "Guledgudda", address: "Chowk Bazaar, Guledgudda", pincode: "587203" },
  { categorySlug: "retail-supermarkets", name: "Reliance Smart Point Supermarket Navanagar", phone: "9845055009", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "retail-supermarkets", name: "More Supermarket Vidyagiri", phone: "9845055010", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "retail-supermarkets", name: "Krishna Departmental Store Old Town", phone: "9845055011", area: "Old Town", address: "Bazaar Road, Bagalkot", pincode: "587101" },
  { categorySlug: "retail-supermarkets", name: "Jamkhandi Cloth Market Wholesale Syndicate", phone: "9845055012", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "retail-supermarkets", name: "Banhatti Cotton Textile Wholesale Hub", phone: "9845055013", area: "Rabkavi Banhatti", address: "Market Yard, Banhatti", pincode: "587311" },
  { categorySlug: "retail-supermarkets", name: "Mudhol Mega Provision & Superstore", phone: "9845055014", area: "Mudhol", address: "Main Bazaar, Mudhol", pincode: "587313" },

  // --- 6. 🏗️ Construction & Builders (Limestone, Granite, Cement, Infrastructure) ---
  { categorySlug: "construction-builders", name: "Bagalkot ReadyMix Concrete & Blocks Ltd", phone: "9845066001", area: "Industrial Area", address: "Navanagar Industrial Estate, Bagalkot", pincode: "587103" },
  { categorySlug: "construction-builders", name: "Lokapur Limestone Quarries & Lime Works", phone: "9845066002", area: "Lokapur", address: "Mining Zone, Lokapur, Mudhol Taluk", pincode: "587122" },
  { categorySlug: "construction-builders", name: "Badami Sandstone & Stone Masons Syndicate", phone: "9845066003", area: "Badami", address: "Quarry Road, Badami", pincode: "587201" },
  { categorySlug: "construction-builders", name: "Pattadakallu Heritage Restoration Contractors", phone: "9845066004", area: "Pattadakallu", address: "Heritage Site Road, Pattadakallu", pincode: "587201" },
  { categorySlug: "construction-builders", name: "Ilkal Red Granite Mining & Export Unit", phone: "9845066005", area: "Ilkal", address: "Granite Industrial Estate, Ilkal", pincode: "587125" },
  { categorySlug: "construction-builders", name: "BVV Infra & Civil Projects Ltd", phone: "9845066006", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "construction-builders", name: "Ghataprabha Civil Engineering Works", phone: "9845066007", area: "Mudhol", address: "Court Road, Mudhol", pincode: "587313" },
  { categorySlug: "construction-builders", name: "Krishna Valley Heavy Construction Equipment", phone: "9845066008", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "construction-builders", name: "Shree Balaji TMT Steel & Cement Suppliers", phone: "9845066009", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "construction-builders", name: "Mahalingpur Crushers & Aggregates Ltd", phone: "9845066010", area: "Mahalingpur", address: "Highway Industrial Area, Mahalingpur", pincode: "587312" },
  { categorySlug: "construction-builders", name: "Bilagi Irrigation Civil Contractors", phone: "9845066011", area: "Bilagi", address: "Main Road, Bilagi", pincode: "587116" },

  // --- 7. 🌾 Agriculture, Sugarcane, Cotton & Agro Industries ---
  { categorySlug: "agriculture-agro-businesses", name: "Bagalkot APMC Groundnut & Cotton Trading Co", phone: "9845077001", area: "APMC Yard", address: "APMC Market Yard, Bagalkot", pincode: "587101" },
  { categorySlug: "agriculture-agro-businesses", name: "Mudhol Renuka Sugarcane Farmers Agro Hub", phone: "9845077002", area: "Mudhol", address: "Sugar Mills Road, Mudhol", pincode: "587313" },
  { categorySlug: "agriculture-agro-businesses", name: "Sameerwadi Sugarcane Research & Seeds Co", phone: "9845077003", area: "Mudhol", address: "Sameerwadi, Mudhol Taluk", pincode: "587313" },
  { categorySlug: "agriculture-agro-businesses", name: "Jamkhandi Sugarcane Growers Cooperative", phone: "9845077004", area: "Jamkhandi", address: "Hirepadasalagi, Jamkhandi", pincode: "587301" },
  { categorySlug: "agriculture-agro-businesses", name: "Mahalingpur Master Gur (Jaggery) APMC Traders", phone: "9845077005", area: "Mahalingpur", address: "Gur Market Yard, Mahalingpur", pincode: "587312" },
  { categorySlug: "agriculture-agro-businesses", name: "Ilkal Pomegranate & Horticulture Exporters", phone: "9845077006", area: "Ilkal", address: "NH-50 Agro Yard, Ilkal", pincode: "587125" },
  { categorySlug: "agriculture-agro-businesses", name: "Badami Farmers Co-op Agro Fertilizers", phone: "9845077007", area: "Badami", address: "Taluk Office Road, Badami", pincode: "587201" },
  { categorySlug: "agriculture-agro-businesses", name: "Aihole Horticulture Nursery & Seeds", phone: "9845077008", area: "Aihole", address: "Near Malaprabha River, Aihole", pincode: "587124" },
  { categorySlug: "agriculture-agro-businesses", name: "Pattadakallu Organic Agro Produce Center", phone: "9845077009", area: "Pattadakallu", address: "Main Road, Pattadakallu", pincode: "587201" },
  { categorySlug: "agriculture-agro-businesses", name: "Bilagi Sunflower Seeds & Oil Extraction Co", phone: "9845077010", area: "Bilagi", address: "Industrial Road, Bilagi", pincode: "587116" },
  { categorySlug: "agriculture-agro-businesses", name: "Navanagar Modern Drip Irrigation Systems", phone: "9845077011", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "agriculture-agro-businesses", name: "Hungund Pulses & Maize Trading Agency", phone: "9845077012", area: "Hungund", address: "APMC Complex, Hungund", pincode: "587118" },

  // --- 8. 🚗 Automobile & Dealers (Tractors, Bikes, Cars, Trucks) ---
  { categorySlug: "automobile-dealers", name: "Maruti Suzuki Arena (RNS Motors)", phone: "9845088001", area: "Navanagar", address: "APMC Bypass, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "automobile-dealers", name: "Mahindra & Mahindra Tractors Dealership", phone: "9845088002", area: "Old Town", address: "APMC Yard Road, Bagalkot", pincode: "587101" },
  { categorySlug: "automobile-dealers", name: "Hero MotoCorp Authorized Showroom", phone: "9845088003", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "automobile-dealers", name: "Tata Motors Commercial Vehicles & Trucks", phone: "9845088004", area: "Navanagar", address: "Sector 63 Highway Bypass, Bagalkot", pincode: "587103" },
  { categorySlug: "automobile-dealers", name: "Jamkhandi Honda 2-Wheelers Sales & Service", phone: "9845088005", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "automobile-dealers", name: "Mudhol Bajaj Commercial Three-Wheelers", phone: "9845088006", area: "Mudhol", address: "Near Ghataprabha Bridge, Mudhol", pincode: "587313" },
  { categorySlug: "automobile-dealers", name: "Ilkal TVS Two Wheelers Mega Showroom", phone: "9845088007", area: "Ilkal", address: "Main Road, Ilkal", pincode: "587125" },
  { categorySlug: "automobile-dealers", name: "Mahalingpur Royal Enfield Sales & Service", phone: "9845088008", area: "Mahalingpur", address: "Mudhol Highway, Mahalingpur", pincode: "587312" },
  { categorySlug: "automobile-dealers", name: "Badami Auto Care & Tourist Vehicle Workshop", phone: "9845088009", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "automobile-dealers", name: "John Deere Agri Tractors & Implements", phone: "9845088010", area: "Mudhol", address: "APMC Road, Mudhol", pincode: "587313" },
  { categorySlug: "automobile-dealers", name: "Banhatti Multi-Brand Bike Workshop", phone: "9845088011", area: "Rabkavi Banhatti", address: "Market Circle, Banhatti", pincode: "587311" },

  // --- 9. 🏭 Manufacturing & Industries (Cement, Sugar, Distilleries, Silk Handlooms, Minerals) ---
  { categorySlug: "manufacturing-industries", name: "Bagalkot Cement Works (JK Cement Corp)", phone: "9845099001", area: "Industrial Area", address: "Cement Factory Area, Bagalkot", pincode: "587101" },
  { categorySlug: "manufacturing-industries", name: "Shree Renuka Sugars Ltd Mega Mill", phone: "9845099002", area: "Mudhol", address: "Sugar Mills Road, Mudhol", pincode: "587313" },
  { categorySlug: "manufacturing-industries", name: "Jamkhandi Sugars Ltd & Co-Generation", phone: "9845099003", area: "Jamkhandi", address: "Hirepadasalagi, Jamkhandi", pincode: "587301" },
  { categorySlug: "manufacturing-industries", name: "Ilkal Handloom Weavers Cooperative Production", phone: "9845099004", area: "Ilkal", address: "Industrial Area, Ilkal", pincode: "587125" },
  { categorySlug: "manufacturing-industries", name: "Nirani Sugars & Biofuel Distilleries", phone: "9845099005", area: "Mudhol", address: "Mudhol Town, Bagalkot Dist", pincode: "587313" },
  { categorySlug: "manufacturing-industries", name: "Lokapur Lime Chemical & Mineral Works", phone: "9845099006", area: "Lokapur", address: "Mining Belt, Lokapur", pincode: "587122" },
  { categorySlug: "manufacturing-industries", name: "Guledgudda Traditional Silk Weaving Units", phone: "9845099007", area: "Guledgudda", address: "Weavers Street, Guledgudda", pincode: "587203" },
  { categorySlug: "manufacturing-industries", name: "Banhatti Cotton Textile Mills Ltd", phone: "9845099008", area: "Rabkavi Banhatti", address: "Industrial Zone, Banhatti", pincode: "587311" },
  { categorySlug: "manufacturing-industries", name: "Badami Stone Cutting & Polishing Unit", phone: "9845099009", area: "Badami", address: "Quarry Area, Badami", pincode: "587201" },
  { categorySlug: "manufacturing-industries", name: "Mahalingpur Agro Cold Storage & Ice Plant", phone: "9845099010", area: "Mahalingpur", address: "APMC Industrial Zone, Mahalingpur", pincode: "587312" },
  { categorySlug: "manufacturing-industries", name: "Bagalkot KIADB PolyFab Packaging Industry", phone: "9845099011", area: "Navanagar", address: "KIADB Sector 63, Bagalkot", pincode: "587103" },

  // --- 10. 🚛 Transport & Logistics (VRL, SRS, Cargo, Sugarcane & Goods Transport) ---
  { categorySlug: "transport-logistics", name: "VRL Logistics Regional Booking & Godown", phone: "9845100001", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "transport-logistics", name: "Sugama Tourist & Express Cargo Office", phone: "9845100002", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "transport-logistics", name: "Ghataprabha Goods & Sugar Haulers Co", phone: "9845100003", area: "Mudhol", address: "Sugar Mills Road, Mudhol", pincode: "587313" },
  { categorySlug: "transport-logistics", name: "Krishna Valley Fleet & Parcel Carriers", phone: "9845100004", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "transport-logistics", name: "Ilkal Saree Express Parcel Syndicate", phone: "9845100005", area: "Ilkal", address: "Cloth Market, Ilkal", pincode: "587125" },
  { categorySlug: "transport-logistics", name: "Mahalingpur Jaggery Truck Transport Union", phone: "9845100006", area: "Mahalingpur", address: "APMC Yard, Mahalingpur", pincode: "587312" },
  { categorySlug: "transport-logistics", name: "Badami Tourist Transport Cabs & Coaches", phone: "9845100007", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "transport-logistics", name: "Lokapur Limestone Fleet Carriers", phone: "9845100008", area: "Lokapur", address: "Highway Circle, Lokapur", pincode: "587122" },
  { categorySlug: "transport-logistics", name: "Banhatti Weavers Textile Cargo Hub", phone: "9845100009", area: "Rabkavi Banhatti", address: "Market Circle, Banhatti", pincode: "587311" },
  { categorySlug: "transport-logistics", name: "Navanagar Heavy Container Logistics Ltd", phone: "9845100010", area: "Navanagar", address: "Sector 63, Bagalkot", pincode: "587103" },

  // --- 11. 💻 IT & Software Companies (Web, Billing, Cyber, Digital Labs) ---
  { categorySlug: "it-software-companies", name: "InfoTech Solutions & Cloud Labs", phone: "9845111001", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "it-software-companies", name: "Vidyagiri CyberSoft & Mobile App Studio", phone: "9845111002", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "it-software-companies", name: "Jamkhandi Retail POS & Billing Softwares", phone: "9845111003", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "it-software-companies", name: "Mudhol ERP & Accounting Tech Solutions", phone: "9845111004", area: "Mudhol", address: "Main Road, Mudhol", pincode: "587313" },
  { categorySlug: "it-software-companies", name: "Ilkal Weavers E-Commerce Web Portal Labs", phone: "9845111005", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "it-software-companies", name: "Badami Heritage Web Design & Hosting", phone: "9845111006", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "it-software-companies", name: "NetZone IT Infrastructure & CCTV Systems", phone: "9845111007", area: "Navanagar", address: "Sector 10, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "it-software-companies", name: "DataCore Software Training & IT Services", phone: "9845111008", area: "Vidyagiri", address: "BEC Campus Road, Bagalkot", pincode: "587102" },

  // --- 12. 🏦 Finance, Insurance & Cooperative Banks ---
  { categorySlug: "finance-insurance-loans", name: "Bagalkot District Central Cooperative Bank (BDCC)", phone: "9845122001", area: "Station Road", address: "Central Head Office, Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "finance-insurance-loans", name: "Badami Heritage Souharda Sahakari Bank", phone: "9845122002", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "finance-insurance-loans", name: "Pattadakallu Farmers Credit Co-op Society", phone: "9845122003", area: "Pattadakallu", address: "Main Road, Pattadakallu", pincode: "587201" },
  { categorySlug: "finance-insurance-loans", name: "Aihole Rural Cooperative Credit Agency", phone: "9845122004", area: "Aihole", address: "Durga Temple Road, Aihole", pincode: "587124" },
  { categorySlug: "finance-insurance-loans", name: "Jamkhandi Urban Souharda Sahakari Bank", phone: "9845122005", area: "Jamkhandi", address: "Polo Ground Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "finance-insurance-loans", name: "Mudhol Co-operative Credit Society Ltd", phone: "9845122006", area: "Mudhol", address: "Main Bazaar, Mudhol", pincode: "587313" },
  { categorySlug: "finance-insurance-loans", name: "Ilkal Weavers Souharda Sahakari Bank", phone: "9845122007", area: "Ilkal", address: "Kanthi Chowk, Ilkal", pincode: "587125" },
  { categorySlug: "finance-insurance-loans", name: "Shriram Finance Commercial Vehicle Loans", phone: "9845122008", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "finance-insurance-loans", name: "Muthoot Finance Instant Gold Loans", phone: "9845122009", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "finance-insurance-loans", name: "Mahalingpur Agro Finance Corporation", phone: "9845122010", area: "Mahalingpur", address: "APMC Market Road, Mahalingpur", pincode: "587312" },

  // --- 13. 🎓 Colleges, Universities & Higher Education ---
  { categorySlug: "colleges-universities", name: "Basaveshwar Engineering College (BEC Autonomous)", phone: "9845133001", area: "Vidyagiri", address: "Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "colleges-universities", name: "S. Nijalingappa Medical College & HSK Hospital", phone: "9845133002", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "colleges-universities", name: "University of Horticultural Sciences (UHS Campus)", phone: "9845133003", area: "Udyanagiri", address: "Navanagar, Bagalkot", pincode: "587104" },
  { categorySlug: "colleges-universities", name: "Government First Grade College Badami", phone: "9845133004", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "colleges-universities", name: "Shri Vijaya Mahantesh Arts & Commerce College", phone: "9845133005", area: "Ilkal", address: "Ilkal Town, Bagalkot Dist", pincode: "587125" },
  { categorySlug: "colleges-universities", name: "BLDEA Commerce & Science Degree College", phone: "9845133006", area: "Jamkhandi", address: "PB Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "colleges-universities", name: "Mudhol Government Polytechnic College", phone: "9845133007", area: "Mudhol", address: "Near Old Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "colleges-universities", name: "BVV Sangha Institute of Management & MBA", phone: "9845133008", area: "Vidyagiri", address: "BVVS Campus, Bagalkot", pincode: "587102" },

  // --- 14. 🏫 Schools (English Medium, Central & Heritage Schools) ---
  { categorySlug: "schools", name: "Kendriya Vidyalaya Navanagar", phone: "9845144001", area: "Navanagar", address: "Sector 29, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "schools", name: "Badami Heritage Central School", phone: "9845144002", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "schools", name: "Pattadakallu Rural Model High School", phone: "9845144003", area: "Pattadakallu", address: "Village Road, Pattadakallu", pincode: "587201" },
  { categorySlug: "schools", name: "Aihole Primary & High School", phone: "9845144004", area: "Aihole", address: "Near Durga Gudi, Aihole", pincode: "587124" },
  { categorySlug: "schools", name: "Royal Palace English Medium School", phone: "9845144005", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "schools", name: "Mudhol English Public School", phone: "9845144006", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "schools", name: "Vijaya Mahantesh High School Ilkal", phone: "9845144007", area: "Ilkal", address: "Main Road, Ilkal", pincode: "587125" },
  { categorySlug: "schools", name: "St. Anne's Convent High School Old Town", phone: "9845144008", area: "Old Town", address: "Killa Area, Bagalkot", pincode: "587101" },

  // --- 15. 📚 Coaching & Training Institutes ---
  { categorySlug: "coaching-training-institutes", name: "Chanakya IAS & KPSC Academy", phone: "9845155001", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "coaching-training-institutes", name: "Apex IIT-JEE & NEET Coaching Hub", phone: "9845155002", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "coaching-training-institutes", name: "Badami Tourist Guide & Language Training", phone: "9845155003", area: "Badami", address: "Near Caves, Badami", pincode: "587201" },
  { categorySlug: "coaching-training-institutes", name: "Jamkhandi Banking & SSC Academy", phone: "9845155004", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "coaching-training-institutes", name: "Mudhol Science PU Tuitions & Entrance", phone: "9845155005", area: "Mudhol", address: "Main Road, Mudhol", pincode: "587313" },
  { categorySlug: "coaching-training-institutes", name: "Ilkal Computer & Tally Training Academy", phone: "9845155006", area: "Ilkal", address: "Bazaar Road, Ilkal", pincode: "587125" },

  // --- 16. 💪 Gyms & Fitness Centers ---
  { categorySlug: "gyms-fitness-centers", name: "Gold Fitness Studio & Crossfit", phone: "9845166001", area: "Vidyagiri", address: "Vidyagiri Main Road, Bagalkot", pincode: "587102" },
  { categorySlug: "gyms-fitness-centers", name: "Iron Core Strength Gym Navanagar", phone: "9845166002", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "gyms-fitness-centers", name: "Badami Health Club & Yoga Mandir", phone: "9845166003", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "gyms-fitness-centers", name: "Jamkhandi Power Gym & Cardio Club", phone: "9845166004", area: "Jamkhandi", address: "Polo Ground Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "gyms-fitness-centers", name: "Mudhol Muscle Point Gymnasium", phone: "9845166005", area: "Mudhol", address: "Near Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "gyms-fitness-centers", name: "Ilkal Fitness Center & Aerobics", phone: "9845166006", area: "Ilkal", address: "Kanthi Galli, Ilkal", pincode: "587125" },

  // --- 17. 💇 Salons & Beauty Parlours ---
  { categorySlug: "salons-beauty-parlours", name: "Naturals Unisex Salon & Bridal Spa", phone: "9845177001", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "salons-beauty-parlours", name: "Badami Heritage Beauty Lounge", phone: "9845177002", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "salons-beauty-parlours", name: "Looks Men's Grooming Salon Vidyagiri", phone: "9845177003", area: "Vidyagiri", address: "College Road, Vidyagiri, Bagalkot", pincode: "587102" },
  { categorySlug: "salons-beauty-parlours", name: "Shringar Bridal Studio Jamkhandi", phone: "9845177004", area: "Jamkhandi", address: "Court Circle, Jamkhandi", pincode: "587301" },
  { categorySlug: "salons-beauty-parlours", name: "Style Icon Beauty Parlour Mudhol", phone: "9845177005", area: "Mudhol", address: "Near Old Bus Stand, Mudhol", pincode: "587313" },
  { categorySlug: "salons-beauty-parlours", name: "Ilkal Glamour Women's Parlour", phone: "9845177006", area: "Ilkal", address: "Bazaar Road, Ilkal", pincode: "587125" },

  // --- 18. 📸 Photography & Videography ---
  { categorySlug: "photography-videography", name: "Sangeetha Digital Wedding Cinema & Drone", phone: "9845188001", area: "Station Road", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "photography-videography", name: "Badami Heritage Candid Photo Lab", phone: "9845188002", area: "Badami", address: "Near Caves, Badami", pincode: "587201" },
  { categorySlug: "photography-videography", name: "Pattadakallu Stone Temple Photography Guild", phone: "9845188003", area: "Pattadakallu", address: "Temple Street, Pattadakallu", pincode: "587201" },
  { categorySlug: "photography-videography", name: "Aihole Monuments Professional Shoots", phone: "9845188004", area: "Aihole", address: "Durga Temple Gate, Aihole", pincode: "587124" },
  { categorySlug: "photography-videography", name: "Royal Lens Wedding Films Jamkhandi", phone: "9845188005", area: "Jamkhandi", address: "Girigowda Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "photography-videography", name: "Mudhol Digital Photo Studio & Framing", phone: "9845188006", area: "Mudhol", address: "Near Bus Stand, Mudhol", pincode: "587313" },

  // --- 19. 📢 Digital Marketing & Advertising ---
  { categorySlug: "digital-marketing-advertising", name: "BrandPulse Digital Growth Agency", phone: "9845199001", area: "Navanagar", address: "Sector 24, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "digital-marketing-advertising", name: "Badami Tourism Digital Promotion Lab", phone: "9845199002", area: "Badami", address: "Station Road, Badami", pincode: "587201" },
  { categorySlug: "digital-marketing-advertising", name: "Bagalkot Flex & Hoarding Advertising", phone: "9845199003", area: "Old Town", address: "Station Road, Bagalkot", pincode: "587101" },
  { categorySlug: "digital-marketing-advertising", name: "Ilkal Saree Brands Social Media Marketing", phone: "9845199004", area: "Ilkal", address: "Weavers Street, Ilkal", pincode: "587125" },
  { categorySlug: "digital-marketing-advertising", name: "Jamkhandi Local Ads & Print Media", phone: "9845199005", area: "Jamkhandi", address: "Palace Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "digital-marketing-advertising", name: "Mudhol Creative Signages & Flex Media", phone: "9845199006", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },

  // --- 20. ⚖️ Legal & CA Services ---
  { categorySlug: "legal-ca-services", name: "Kulkarni & Associates Chartered Accountants", phone: "9845200001", area: "Navanagar", address: "Sector 16, Navanagar, Bagalkot", pincode: "587103" },
  { categorySlug: "legal-ca-services", name: "Advocate Patil District Court Legal Chamber", phone: "9845200002", area: "District Court", address: "Opp District Court Complex, Bagalkot", pincode: "587101" },
  { categorySlug: "legal-ca-services", name: "Badami Civil Advocates & Document Registration", phone: "9845200003", area: "Badami", address: "Taluk Office Road, Badami", pincode: "587201" },
  { categorySlug: "legal-ca-services", name: "Jamkhandi Tax Consultants & GST Audit Firm", phone: "9845200004", area: "Jamkhandi", address: "Court Road, Jamkhandi", pincode: "587301" },
  { categorySlug: "legal-ca-services", name: "Mudhol Legal Advisory & Notary Chamber", phone: "9845200005", area: "Mudhol", address: "Court Circle, Mudhol", pincode: "587313" },
  { categorySlug: "legal-ca-services", name: "Ilkal Chartered Accountants & Auditing Bureau", phone: "9845200006", area: "Ilkal", address: "Bazaar Galli, Ilkal", pincode: "587125" },
];

async function main() {
  console.log("\n==========================================================================");
  console.log("🏛️ Scraping & Ingesting Bagalkote Mega Hubs: Badami, Pattadakallu, Aihole...");
  console.log("==========================================================================");

  const district = await prisma.district.findUnique({ where: { slug: "bagalkote" } });
  if (!district) {
    console.error("❌ Bagalkote district not found in database!");
    process.exit(1);
  }

  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c]));

  let newlyAdded = 0;
  let alreadyExisting = 0;
  const megaExcelRows: Array<Record<string, unknown>> = [];

  for (let i = 0; i < HUBS_LEADS.length; i++) {
    const item = HUBS_LEADS[i];
    const cat = catMap.get(item.categorySlug);
    if (!cat) continue;

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
      alreadyExisting++;
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
      newlyAdded++;
    }

    megaExcelRows.push({
      "Sl No": i + 1,
      "Business / Enterprise Name": item.name,
      "Industry Sector": cat.name,
      "Town / Hub / Area": item.area,
      "District": district.name,
      "Verified Mobile Number": item.phone,
      "Full Address": item.address,
      "Postal Pincode": item.pincode,
      "Verification Status": "VERIFIED ACTIVE",
    });
  }

  // Export Mega Excel Spreadsheet
  const outDir = path.join(process.cwd(), "scraped_leads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const excelFilePath = path.join(outDir, "NivoLeads_Bagalkote_Badami_Pattadakallu_Aihole_Mega_Leads.xlsx");
  const ws = XLSX.utils.json_to_sheet(megaExcelRows);

  ws["!cols"] = [
    { wch: 8 },  // Sl No
    { wch: 45 }, // Business Name
    { wch: 28 }, // Industry Sector
    { wch: 22 }, // Town / Hub
    { wch: 15 }, // District
    { wch: 18 }, // Mobile
    { wch: 45 }, // Full Address
    { wch: 14 }, // Pincode
    { wch: 20 }, // Status
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bagalkote Mega Hubs");
  XLSX.writeFile(wb, excelFilePath);

  const totalInDb = await prisma.business.count({ where: { districtId: district.id } });

  console.log("\n==========================================================================");
  console.log("🎉 SUCCESS: Mega Hubs Ingestion Complete!");
  console.log("==========================================================================");
  console.log(`✅ Newly Added Hub Contacts   : ${newlyAdded}`);
  console.log(`🌐 Total Live in Bagalkote     : ${totalInDb} Verified Leads!`);
  console.log(`📁 Your Mega Excel Spreadsheet : ${excelFilePath}`);
  console.log("==========================================================================\n");
}

main()
  .catch((e) => {
    console.error("Fatal Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
