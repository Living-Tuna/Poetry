/* ── Comprehensive world languages dataset ──
   Maps each country to its official and major regional languages.
   Structure: { [countryCode]: { name, languages: [{ code, name, nativeName }] } }
*/

export const COUNTRIES = {
  AF: {
    name: "Afghanistan",
    languages: [
      { code: "fa", name: "Dari", nativeName: "دری" },
      { code: "prs", name: "Dari", nativeName: "دری" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ps", name: "Pashto", nativeName: "پښتو" },
      { code: "tk", name: "Turkmen", nativeName: "türkmen dili" },
    ],
  },
  AX: {
    name: "Åland Islands",
    languages: [
      { code: "sv", name: "Swedish", nativeName: "svenska" },
    ],
  },
  AL: {
    name: "Albania",
    languages: [
      { code: "sq", name: "Albanian", nativeName: "Shqip" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
    ],
  },
  DZ: {
    name: "Algeria",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "ber", name: "Berber", nativeName: "ⵜⴰⵎⴰⵣⵉⵖⵜ" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  AS: {
    name: "American Samoa",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "sm", name: "Samoan", nativeName: "Samoan" },
    ],
  },
  AD: {
    name: "Andorra",
    languages: [
      { code: "ca", name: "Catalan", nativeName: "català" },
    ],
  },
  AO: {
    name: "Angola",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
    ],
  },
  AI: {
    name: "Anguilla",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  AG: {
    name: "Antigua and Barbuda",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  AR: {
    name: "Argentina",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "gn", name: "Guaraní", nativeName: "Guarani" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  AM: {
    name: "Armenia",
    languages: [
      { code: "hy", name: "Armenian", nativeName: "Հայերեն" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  AW: {
    name: "Aruba",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "pap", name: "Papiamento", nativeName: "Papiamento" },
    ],
  },
  AU: {
    name: "Australia",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    ],
  },
  AT: {
    name: "Austria",
    languages: [
      { code: "bar", name: "Austro-Bavarian German", nativeName: "Bavarian" },
      { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
    ],
  },
  AZ: {
    name: "Azerbaijan",
    languages: [
      { code: "az", name: "Azerbaijani", nativeName: "Azərbaycanca" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  BS: {
    name: "Bahamas",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BH: {
    name: "Bahrain",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BD: {
    name: "Bangladesh",
    languages: [
      { code: "bn", name: "Bengali", nativeName: "বাংলা" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BB: {
    name: "Barbados",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BY: {
    name: "Belarus",
    languages: [
      { code: "be", name: "Belarusian", nativeName: "Беларуская" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  BE: {
    name: "Belgium",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
    ],
  },
  BZ: {
    name: "Belize",
    languages: [
      { code: "bjz", name: "Belizean Creole", nativeName: "Belizean Creole" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  BJ: {
    name: "Benin",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
    ],
  },
  BM: {
    name: "Bermuda",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BT: {
    name: "Bhutan",
    languages: [
      { code: "dz", name: "Dzongkha", nativeName: "རྫོང་ཁ" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    ],
  },
  BO: {
    name: "Bolivia",
    languages: [
      { code: "ay", name: "Aymara", nativeName: "Aymar aru" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "gn", name: "Guaraní", nativeName: "Guarani" },
      { code: "qu", name: "Quechua", nativeName: "Runa Simi" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  BA: {
    name: "Bosnia and Herzegovina",
    languages: [
      { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
      { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "sr", name: "Serbian", nativeName: "Српски" },
    ],
  },
  BW: {
    name: "Botswana",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "tn", name: "Tswana", nativeName: "Setswana" },
    ],
  },
  BV: {
    name: "Bouvet Island",
    languages: [
      { code: "no", name: "Norwegian", nativeName: "norsk" },
    ],
  },
  BR: {
    name: "Brazil",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  IO: {
    name: "British Indian Ocean Territory",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  VG: {
    name: "British Virgin Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BN: {
    name: "Brunei",
    languages: [
      { code: "ms", name: "Malay", nativeName: "Melayu" },
    ],
  },
  BG: {
    name: "Bulgaria",
    languages: [
      { code: "bg", name: "Bulgarian", nativeName: "Български" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  BF: {
    name: "Burkina Faso",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  BI: {
    name: "Burundi",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "rn", name: "Kirundi", nativeName: "Ikirundi" },
    ],
  },
  KH: {
    name: "Cambodia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
    ],
  },
  CM: {
    name: "Cameroon",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ewo", name: "Ewondo", nativeName: "ewondo" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  CA: {
    name: "Canada",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  CV: {
    name: "Cape Verde",
    languages: [
      { code: "pt", name: "Portuguese", nativeName: "português" },
    ],
  },
  BQ: {
    name: "Caribbean Netherlands",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "pap", name: "Papiamento", nativeName: "Papiamento" },
    ],
  },
  KY: {
    name: "Cayman Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  CF: {
    name: "Central African Republic",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
      { code: "sg", name: "Sango", nativeName: "Sängö" },
    ],
  },
  TD: {
    name: "Chad",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  CL: {
    name: "Chile",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  CN: {
    name: "China",
    languages: [
      { code: "yue", name: "Cantonese", nativeName: "粵語" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "mn", name: "Mongolian", nativeName: "Монгол" },
      { code: "wuu", name: "Shanghainese", nativeName: "上海话" },
      { code: "bo", name: "Tibetan", nativeName: "བོད་སྐད" },
      { code: "ug", name: "Uyghur", nativeName: "ئۇيغۇرچە" },
    ],
  },
  CX: {
    name: "Christmas Island",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  CC: {
    name: "Cocos (Keeling) Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  CO: {
    name: "Colombia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  KM: {
    name: "Comoros",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "zdj", name: "Comorian", nativeName: "Comorian" },
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  CG: {
    name: "Congo",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "kg", name: "Kikongo", nativeName: "Kongo" },
      { code: "ln", name: "Lingala", nativeName: "Lingála" },
    ],
  },
  CK: {
    name: "Cook Islands",
    languages: [
      { code: "rar", name: "Cook Islands Māori", nativeName: "Rarotongan" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  CR: {
    name: "Costa Rica",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  CI: {
    name: "Côte d'Ivoire",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  HR: {
    name: "Croatia",
    languages: [
      { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
    ],
  },
  CU: {
    name: "Cuba",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  CW: {
    name: "Curaçao",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "pap", name: "Papiamento", nativeName: "Papiamento" },
    ],
  },
  CY: {
    name: "Cyprus",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "el", name: "Greek", nativeName: "Ελληνικά" },
      { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    ],
  },
  CZ: {
    name: "Czech Republic",
    languages: [
      { code: "cs", name: "Czech", nativeName: "Čeština" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
    ],
  },
  DK: {
    name: "Denmark",
    languages: [
      { code: "da", name: "Danish", nativeName: "Dansk" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
    ],
  },
  DJ: {
    name: "Djibouti",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  DM: {
    name: "Dominica",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  DO: {
    name: "Dominican Republic",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  CD: {
    name: "DR Congo",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
      { code: "kg", name: "Kikongo", nativeName: "Kongo" },
      { code: "ln", name: "Lingala", nativeName: "lingála" },
      { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
      { code: "lua", name: "Tshiluba", nativeName: "Luba-Lulua" },
    ],
  },
  EC: {
    name: "Ecuador",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "qu", name: "Quechua", nativeName: "Runa Simi" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  EG: {
    name: "Egypt",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  SV: {
    name: "El Salvador",
    languages: [
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  GQ: {
    name: "Equatorial Guinea",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  ER: {
    name: "Eritrea",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ" },
    ],
  },
  EE: {
    name: "Estonia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "et", name: "Estonian", nativeName: "Eesti" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  SZ: {
    name: "Eswatini",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ss", name: "Swati", nativeName: "SiSwati" },
    ],
  },
  ET: {
    name: "Ethiopia",
    languages: [
      { code: "am", name: "Amharic", nativeName: "አማርኛ" },
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "om", name: "Oromo", nativeName: "Afaan Oromoo" },
    ],
  },
  FK: {
    name: "Falkland Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  FO: {
    name: "Faroe Islands",
    languages: [
      { code: "da", name: "Danish", nativeName: "dansk" },
      { code: "fo", name: "Faroese", nativeName: "føroyskt" },
    ],
  },
  FJ: {
    name: "Fiji",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Fiji Hindi", nativeName: "फ़िजी हिंदी" },
      { code: "hif", name: "Fiji Hindi", nativeName: "Fiji Hindi" },
      { code: "fj", name: "Fijian", nativeName: "Na Vosa Vakaviti" },
    ],
  },
  FI: {
    name: "Finland",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fi", name: "Finnish", nativeName: "Suomi" },
      { code: "sv", name: "Swedish", nativeName: "Svenska" },
    ],
  },
  FR: {
    name: "France",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "ber", name: "Berber", nativeName: "ⵜⴰⵎⴰⵣⵉⵖⵜ" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  GF: {
    name: "French Guiana",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  PF: {
    name: "French Polynesia",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  TF: {
    name: "French Southern and Antarctic Lands",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  GA: {
    name: "Gabon",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  GM: {
    name: "Gambia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  GE: {
    name: "Georgia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ka", name: "Georgian", nativeName: "ქართული" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  DE: {
    name: "Germany",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    ],
  },
  GH: {
    name: "Ghana",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ee", name: "Ewe", nativeName: "Eʋegbe" },
      { code: "tw", name: "Twi", nativeName: "Akan" },
    ],
  },
  GI: {
    name: "Gibraltar",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  GR: {
    name: "Greece",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "el", name: "Greek", nativeName: "Ελληνικά" },
    ],
  },
  GL: {
    name: "Greenland",
    languages: [
      { code: "kl", name: "Greenlandic", nativeName: "Kalaallisut" },
    ],
  },
  GD: {
    name: "Grenada",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  GP: {
    name: "Guadeloupe",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  GU: {
    name: "Guam",
    languages: [
      { code: "ch", name: "Chamorro", nativeName: "Chamorro" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  GT: {
    name: "Guatemala",
    languages: [
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  GG: {
    name: "Guernsey",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
      { code: "nfr", name: "Guernésiais", nativeName: "Guernésiais" },
    ],
  },
  GN: {
    name: "Guinea",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  GW: {
    name: "Guinea-Bissau",
    languages: [
      { code: "pt", name: "Portuguese", nativeName: "português" },
      { code: "pov", name: "Upper Guinea Creole", nativeName: "Upper Guinea Creole" },
    ],
  },
  GY: {
    name: "Guyana",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    ],
  },
  HT: {
    name: "Haiti",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen" },
    ],
  },
  HM: {
    name: "Heard Island and McDonald Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  HN: {
    name: "Honduras",
    languages: [
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  HK: {
    name: "Hong Kong",
    languages: [
      { code: "yue", name: "Cantonese", nativeName: "粵語" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  HU: {
    name: "Hungary",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "hu", name: "Hungarian", nativeName: "Magyar" },
    ],
  },
  IS: {
    name: "Iceland",
    languages: [
      { code: "da", name: "Danish", nativeName: "Dansk" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "is", name: "Icelandic", nativeName: "Íslenska" },
    ],
  },
  IN: {
    name: "India",
    languages: [
      { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
      { code: "bn", name: "Bengali", nativeName: "বাংলা" },
      { code: "bodo", name: "Bodo", nativeName: "बर" },
      { code: "doi", name: "Dogri", nativeName: "डोगरी" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
      { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
      { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
      { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
      { code: "mai", name: "Maithili", nativeName: "मैथिली" },
      { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
      { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্" },
      { code: "mr", name: "Marathi", nativeName: "मराठी" },
      { code: "ne", name: "Nepali", nativeName: "नेपाली" },
      { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
      { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
      { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
      { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
      { code: "te", name: "Telugu", nativeName: "తెలుగు" },
      { code: "ur", name: "Urdu", nativeName: "اردو" },
    ],
  },
  ID: {
    name: "Indonesia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
      { code: "jv", name: "Javanese", nativeName: "Basa Jawa" },
      { code: "su", name: "Sundanese", nativeName: "Basa Sunda" },
    ],
  },
  IR: {
    name: "Iran",
    languages: [
      { code: "az", name: "Azerbaijani", nativeName: "Azərbaycanca" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ku", name: "Kurdish", nativeName: "Kurdî" },
      { code: "fa", name: "Persian", nativeName: "فارسی" },
    ],
  },
  IQ: {
    name: "Iraq",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "arc", name: "Aramaic", nativeName: "Aramaic" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ku", name: "Kurdish", nativeName: "Kurdî" },
      { code: "ckb", name: "Sorani", nativeName: "Central Kurdish" },
    ],
  },
  IE: {
    name: "Ireland",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "ga", name: "Irish", nativeName: "Gaeilge" },
    ],
  },
  IM: {
    name: "Isle of Man",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "gv", name: "Manx", nativeName: "Gaelg" },
    ],
  },
  IL: {
    name: "Israel",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "he", name: "Hebrew", nativeName: "עברית" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  IT: {
    name: "Italy",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
    ],
  },
  JM: {
    name: "Jamaica",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "jam", name: "Jamaican Patois", nativeName: "Jamaican Creole English" },
    ],
  },
  JP: {
    name: "Japan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ja", name: "Japanese", nativeName: "日本語" },
    ],
  },
  JE: {
    name: "Jersey",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
      { code: "nrf", name: "Jèrriais", nativeName: "Jèrriais" },
    ],
  },
  JO: {
    name: "Jordan",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  KZ: {
    name: "Kazakhstan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "kk", name: "Kazakh", nativeName: "Қазақша" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  KE: {
    name: "Kenya",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ki", name: "Kikuyu", nativeName: "Gĩkũyũ" },
      { code: "luo", name: "Luo", nativeName: "Dholuo" },
      { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    ],
  },
  KI: {
    name: "Kiribati",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "gil", name: "Gilbertese", nativeName: "Taetae ni Kiribati" },
    ],
  },
  XK: {
    name: "Kosovo",
    languages: [
      { code: "sq", name: "Albanian", nativeName: "shqip" },
      { code: "sr", name: "Serbian", nativeName: "српски" },
    ],
  },
  KW: {
    name: "Kuwait",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  KG: {
    name: "Kyrgyzstan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  LA: {
    name: "Laos",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "lo", name: "Lao", nativeName: "ລາວ" },
    ],
  },
  LV: {
    name: "Latvia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "lv", name: "Latvian", nativeName: "Latviešu" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  LB: {
    name: "Lebanon",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  LS: {
    name: "Lesotho",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "st", name: "Sotho", nativeName: "Sesotho" },
    ],
  },
  LR: {
    name: "Liberia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  LY: {
    name: "Libya",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
    ],
  },
  LI: {
    name: "Liechtenstein",
    languages: [
      { code: "de", name: "German", nativeName: "Deutsch" },
    ],
  },
  LT: {
    name: "Lithuania",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  LU: {
    name: "Luxembourg",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch" },
    ],
  },
  MO: {
    name: "Macau",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "pt", name: "Portuguese", nativeName: "português" },
    ],
  },
  MG: {
    name: "Madagascar",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "mg", name: "Malagasy", nativeName: "Malagasy" },
    ],
  },
  MW: {
    name: "Malawi",
    languages: [
      { code: "ny", name: "Chewa", nativeName: "Chichewa" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  MY: {
    name: "Malaysia",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    ],
  },
  MV: {
    name: "Maldives",
    languages: [
      { code: "dv", name: "Divehi", nativeName: "ދިވެހި" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  ML: {
    name: "Mali",
    languages: [
      { code: "bam", name: "Bambara", nativeName: "Bamanankan" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  MT: {
    name: "Malta",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
      { code: "mt", name: "Maltese", nativeName: "Malti" },
    ],
  },
  MH: {
    name: "Marshall Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "mh", name: "Marshallese", nativeName: "Kajin M̧ajeļ" },
    ],
  },
  MQ: {
    name: "Martinique",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  MR: {
    name: "Mauritania",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  MU: {
    name: "Mauritius",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
      { code: "mfe", name: "Mauritian Creole", nativeName: "Morisyen" },
    ],
  },
  YT: {
    name: "Mayotte",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  MX: {
    name: "Mexico",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "nah", name: "Nahuatl", nativeName: "Nāhuatl" },
      { code: "es", name: "Spanish", nativeName: "Español" },
      { code: "yua", name: "Yucatec Maya", nativeName: "Maya" },
    ],
  },
  FM: {
    name: "Micronesia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  MD: {
    name: "Moldova",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ro", name: "Romanian", nativeName: "Română" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
    ],
  },
  MC: {
    name: "Monaco",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  MN: {
    name: "Mongolia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "mn", name: "Mongolian", nativeName: "Монгол" },
    ],
  },
  ME: {
    name: "Montenegro",
    languages: [
      { code: "sq", name: "Albanian", nativeName: "Shqip" },
      { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "cnr", name: "Montenegrin", nativeName: "srpski (Crna Gora)" },
      { code: "sr", name: "Serbian", nativeName: "Српски" },
    ],
  },
  MS: {
    name: "Montserrat",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  MA: {
    name: "Morocco",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "ber", name: "Berber", nativeName: "ⵜⴰⵎⴰⵣⵉⵖⵜ" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  MZ: {
    name: "Mozambique",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
      { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    ],
  },
  MM: {
    name: "Myanmar",
    languages: [
      { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  NA: {
    name: "Namibia",
    languages: [
      { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "hz", name: "Herero", nativeName: "Herero" },
      { code: "hgm", name: "Khoekhoe", nativeName: "Khoekhoe" },
      { code: "kwn", name: "Kwangali", nativeName: "Kwangali" },
      { code: "loz", name: "Lozi", nativeName: "Lozi" },
      { code: "ng", name: "Ndonga", nativeName: "Ndonga" },
      { code: "tn", name: "Tswana", nativeName: "Setswana" },
    ],
  },
  NR: {
    name: "Nauru",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "na", name: "Nauruan", nativeName: "Dorerin Naoero" },
    ],
  },
  NP: {
    name: "Nepal",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
      { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    ],
  },
  NL: {
    name: "Netherlands",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fy", name: "Frisian", nativeName: "Frysk" },
    ],
  },
  NC: {
    name: "New Caledonia",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  NZ: {
    name: "New Zealand",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "mi", name: "Māori", nativeName: "Te Reo Māori" },
      { code: "nzs", name: "New Zealand Sign Language", nativeName: "New Zealand Sign Language" },
    ],
  },
  NI: {
    name: "Nicaragua",
    languages: [
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  NE: {
    name: "Niger",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "ha", name: "Hausa", nativeName: "Hausa" },
    ],
  },
  NG: {
    name: "Nigeria",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ha", name: "Hausa", nativeName: "Hausa" },
      { code: "ig", name: "Igbo", nativeName: "Igbo" },
      { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
    ],
  },
  NU: {
    name: "Niue",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "niu", name: "Niuean", nativeName: "Niuean" },
    ],
  },
  NF: {
    name: "Norfolk Island",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "pih", name: "Norfuk", nativeName: "Norfuk" },
    ],
  },
  KP: {
    name: "North Korea",
    languages: [
      { code: "ko", name: "Korean", nativeName: "한국어" },
    ],
  },
  MK: {
    name: "North Macedonia",
    languages: [
      { code: "sq", name: "Albanian", nativeName: "Shqip" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "mk", name: "Macedonian", nativeName: "Македонски" },
    ],
  },
  MP: {
    name: "Northern Mariana Islands",
    languages: [
      { code: "cal", name: "Carolinian", nativeName: "Carolinian" },
      { code: "ch", name: "Chamorro", nativeName: "Chamorro" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  NO: {
    name: "Norway",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "nb", name: "Norwegian Bokmål", nativeName: "Norsk bokmål" },
      { code: "nn", name: "Norwegian Nynorsk", nativeName: "Norsk nynorsk" },
      { code: "se", name: "Sami", nativeName: "Sámegiella" },
      { code: "smi", name: "Sami", nativeName: "Sami" },
    ],
  },
  OM: {
    name: "Oman",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  PK: {
    name: "Pakistan",
    languages: [
      { code: "bal", name: "Balochi", nativeName: "بلوچی" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ps", name: "Pashto", nativeName: "پښتو" },
      { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
      { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
      { code: "ur", name: "Urdu", nativeName: "اردو" },
    ],
  },
  PW: {
    name: "Palau",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "pau", name: "Palauan", nativeName: "Te reo er a Belau" },
    ],
  },
  PS: {
    name: "Palestine",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
    ],
  },
  PA: {
    name: "Panama",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  PG: {
    name: "Papua New Guinea",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ho", name: "Hiri Motu", nativeName: "Hiri Motu" },
      { code: "tpi", name: "Tok Pisin", nativeName: "Tok Pisin" },
    ],
  },
  PY: {
    name: "Paraguay",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "gn", name: "Guaraní", nativeName: "Avañe'ẽ" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  PE: {
    name: "Peru",
    languages: [
      { code: "ay", name: "Aymara", nativeName: "Aymar aru" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "qu", name: "Quechua", nativeName: "Runa Simi" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  PH: {
    name: "Philippines",
    languages: [
      { code: "ceb", name: "Cebuano", nativeName: "Cebuano" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fil", name: "Filipino", nativeName: "Filipino" },
      { code: "ilo", name: "Ilocano", nativeName: "Iloco" },
      { code: "tl", name: "Tagalog", nativeName: "Filipino" },
    ],
  },
  PN: {
    name: "Pitcairn Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  PL: {
    name: "Poland",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "pl", name: "Polish", nativeName: "Polski" },
    ],
  },
  PT: {
    name: "Portugal",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
    ],
  },
  PR: {
    name: "Puerto Rico",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  QA: {
    name: "Qatar",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  RE: {
    name: "Réunion",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  RO: {
    name: "Romania",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hu", name: "Hungarian", nativeName: "Magyar" },
      { code: "ro", name: "Romanian", nativeName: "Română" },
    ],
  },
  RU: {
    name: "Russia",
    languages: [
      { code: "ba", name: "Bashkir", nativeName: "Башҡортса" },
      { code: "cv", name: "Chuvash", nativeName: "Чӑвашла" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "tt", name: "Tatar", nativeName: "Татарча" },
    ],
  },
  RW: {
    name: "Rwanda",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda" },
    ],
  },
  BL: {
    name: "Saint Barthélemy",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  SH: {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  KN: {
    name: "Saint Kitts and Nevis",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  LC: {
    name: "Saint Lucia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  MF: {
    name: "Saint Martin",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  PM: {
    name: "Saint Pierre and Miquelon",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  VC: {
    name: "Saint Vincent",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  WS: {
    name: "Samoa",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "sm", name: "Samoan", nativeName: "Gagana Samoa" },
    ],
  },
  SM: {
    name: "San Marino",
    languages: [
      { code: "it", name: "Italian", nativeName: "italiano" },
    ],
  },
  ST: {
    name: "São Tomé and Príncipe",
    languages: [
      { code: "pt", name: "Portuguese", nativeName: "português" },
    ],
  },
  SA: {
    name: "Saudi Arabia",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  SN: {
    name: "Senegal",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "wo", name: "Wolof", nativeName: "Wolof" },
    ],
  },
  RS: {
    name: "Serbia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "sr", name: "Serbian", nativeName: "Српски" },
    ],
  },
  SC: {
    name: "Seychelles",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
      { code: "crs", name: "Seychellois Creole", nativeName: "Seselwa Creole French" },
    ],
  },
  SL: {
    name: "Sierra Leone",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "kri", name: "Krio", nativeName: "Krio" },
    ],
  },
  SG: {
    name: "Singapore",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    ],
  },
  SX: {
    name: "Sint Maarten",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  SK: {
    name: "Slovakia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hu", name: "Hungarian", nativeName: "Magyar" },
      { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
    ],
  },
  SI: {
    name: "Slovenia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
    ],
  },
  SB: {
    name: "Solomon Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  SO: {
    name: "Somalia",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "so", name: "Somali", nativeName: "Soomaali" },
    ],
  },
  ZA: {
    name: "South Africa",
    languages: [
      { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "nso", name: "Northern Sotho", nativeName: "Sesotho sa Leboa" },
      { code: "st", name: "Sotho", nativeName: "Sesotho" },
      { code: "nr", name: "Southern Ndebele", nativeName: "South Ndebele" },
      { code: "ss", name: "Swazi", nativeName: "Swati" },
      { code: "ts", name: "Tsonga", nativeName: "Tsonga" },
      { code: "tn", name: "Tswana", nativeName: "Setswana" },
      { code: "ve", name: "Venda", nativeName: "Venda" },
      { code: "xh", name: "Xhosa", nativeName: "isiXhosa" },
      { code: "zu", name: "Zulu", nativeName: "isiZulu" },
    ],
  },
  GS: {
    name: "South Georgia",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  KR: {
    name: "South Korea",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ko", name: "Korean", nativeName: "한국어" },
    ],
  },
  SS: {
    name: "South Sudan",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  ES: {
    name: "Spain",
    languages: [
      { code: "eu", name: "Basque", nativeName: "Euskara" },
      { code: "ca", name: "Catalan", nativeName: "Català" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "gl", name: "Galician", nativeName: "Galego" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  LK: {
    name: "Sri Lanka",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "si", name: "Sinhala", nativeName: "සිංහල" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    ],
  },
  SD: {
    name: "Sudan",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  SR: {
    name: "Suriname",
    languages: [
      { code: "nl", name: "Dutch", nativeName: "Nederlands" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "srn", name: "Sranan Tongo", nativeName: "Sranantongo" },
    ],
  },
  SJ: {
    name: "Svalbard and Jan Mayen",
    languages: [
      { code: "no", name: "Norwegian", nativeName: "norsk" },
    ],
  },
  SE: {
    name: "Sweden",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "sv", name: "Swedish", nativeName: "Svenska" },
    ],
  },
  CH: {
    name: "Switzerland",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "de", name: "German", nativeName: "Deutsch" },
      { code: "it", name: "Italian", nativeName: "Italiano" },
      { code: "rm", name: "Romansh", nativeName: "Rumantsch" },
      { code: "gsw", name: "Swiss German", nativeName: "Schwiizertüütsch" },
    ],
  },
  SY: {
    name: "Syria",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ku", name: "Kurdish", nativeName: "Kurdî" },
    ],
  },
  TW: {
    name: "Taiwan",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "nan", name: "Taiwanese", nativeName: "臺語" },
    ],
  },
  TJ: {
    name: "Tajikistan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ" },
    ],
  },
  TZ: {
    name: "Tanzania",
    languages: [
      { code: "ny", name: "Chewa", nativeName: "Chichewa" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    ],
  },
  TH: {
    name: "Thailand",
    languages: [
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "th", name: "Thai", nativeName: "ไทย" },
    ],
  },
  TL: {
    name: "Timor-Leste",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "pt", name: "Portuguese", nativeName: "Português" },
      { code: "tet", name: "Tetum", nativeName: "Tetun" },
    ],
  },
  TG: {
    name: "Togo",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ee", name: "Ewe", nativeName: "Eʋegbe" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  TK: {
    name: "Tokelau",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "sm", name: "Samoan", nativeName: "Samoan" },
      { code: "tkl", name: "Tokelauan", nativeName: "Tokelau" },
    ],
  },
  TO: {
    name: "Tonga",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "to", name: "Tongan", nativeName: "Lea Faka-Tonga" },
    ],
  },
  TT: {
    name: "Trinidad and Tobago",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    ],
  },
  TN: {
    name: "Tunisia",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  TR: {
    name: "Turkey",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ku", name: "Kurdish", nativeName: "Kurdî" },
      { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    ],
  },
  TM: {
    name: "Turkmenistan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "tk", name: "Turkmen", nativeName: "Türkmençe" },
    ],
  },
  TC: {
    name: "Turks and Caicos Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  TV: {
    name: "Tuvalu",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "tvl", name: "Tuvaluan", nativeName: "Te Ggana Tuuvalu" },
    ],
  },
  UG: {
    name: "Uganda",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "lg", name: "Luganda", nativeName: "Luganda" },
      { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    ],
  },
  UA: {
    name: "Ukraine",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "uk", name: "Ukrainian", nativeName: "Українська" },
    ],
  },
  AE: {
    name: "United Arab Emirates",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
      { code: "ur", name: "Urdu", nativeName: "اردو" },
    ],
  },
  GB: {
    name: "United Kingdom",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ga", name: "Irish", nativeName: "Gaeilge" },
      { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
      { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig" },
      { code: "ur", name: "Urdu", nativeName: "اردو" },
      { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
    ],
  },
  US: {
    name: "United States",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "ko", name: "Korean", nativeName: "한국어" },
      { code: "es", name: "Spanish", nativeName: "Español" },
      { code: "tl", name: "Tagalog", nativeName: "Filipino" },
      { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    ],
  },
  UM: {
    name: "United States Minor Outlying Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  VI: {
    name: "United States Virgin Islands",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  UY: {
    name: "Uruguay",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  UZ: {
    name: "Uzbekistan",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "ru", name: "Russian", nativeName: "Русский" },
      { code: "uz", name: "Uzbek", nativeName: "O'zbekcha" },
    ],
  },
  VU: {
    name: "Vanuatu",
    languages: [
      { code: "bi", name: "Bislama", nativeName: "Bislama" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
    ],
  },
  VA: {
    name: "Vatican City",
    languages: [
      { code: "it", name: "Italian", nativeName: "italiano" },
      { code: "la", name: "Latin", nativeName: "Latin" },
    ],
  },
  VE: {
    name: "Venezuela",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "es", name: "Spanish", nativeName: "Español" },
    ],
  },
  VN: {
    name: "Vietnam",
    languages: [
      { code: "en", name: "English", nativeName: "English" },
      { code: "fr", name: "French", nativeName: "Français" },
      { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    ],
  },
  WF: {
    name: "Wallis and Futuna",
    languages: [
      { code: "fr", name: "French", nativeName: "français" },
    ],
  },
  EH: {
    name: "Western Sahara",
    languages: [
      { code: "ber", name: "Berber", nativeName: "Berber" },
      { code: "mey", name: "Hassaniya", nativeName: "Hassaniya" },
      { code: "es", name: "Spanish", nativeName: "español" },
    ],
  },
  YE: {
    name: "Yemen",
    languages: [
      { code: "ar", name: "Arabic", nativeName: "العربية" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  ZM: {
    name: "Zambia",
    languages: [
      { code: "bem", name: "Bemba", nativeName: "Ichibemba" },
      { code: "ny", name: "Chewa", nativeName: "Chichewa" },
      { code: "en", name: "English", nativeName: "English" },
    ],
  },
  ZW: {
    name: "Zimbabwe",
    languages: [
      { code: "ny", name: "Chewa", nativeName: "Nyanja" },
      { code: "bwg", name: "Chibarwe", nativeName: "Chibarwe" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "kck", name: "Kalanga", nativeName: "Kalanga" },
      { code: "khi", name: "Khoisan", nativeName: "Khoisan" },
      { code: "ndc", name: "Ndau", nativeName: "Ndau" },
      { code: "nd", name: "Ndebele", nativeName: "isiNdebele" },
      { code: "sn", name: "Shona", nativeName: "chiShona" },
      { code: "st", name: "Sotho", nativeName: "Southern Sotho" },
      { code: "toi", name: "Tonga", nativeName: "Tonga" },
      { code: "ts", name: "Tsonga", nativeName: "Tsonga" },
      { code: "tn", name: "Tswana", nativeName: "Setswana" },
      { code: "ve", name: "Venda", nativeName: "Venda" },
      { code: "xh", name: "Xhosa", nativeName: "IsiXhosa" },
      { code: "zib", name: "Zimbabwean Sign Language", nativeName: "Zimbabwean Sign Language" },
    ],
  },
}

/* Helper: get languages for a country code */
export function getLanguagesForCountry(countryCode) {
  const country = COUNTRIES[countryCode]
  if (!country) return [{ code: 'en', name: 'English', nativeName: 'English' }]
  return country.languages
}

/* Helper: get language name from code */
export function getLanguageName(code) {
  for (const c of Object.values(COUNTRIES)) {
    const found = c.languages.find((l) => l.code === code)
    if (found) return found.name
  }
  return code
}
