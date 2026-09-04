export interface StatutoryRule {
  id: string;
  title: string;
  act_rule: string;
  gazette_ref: string;
  verbatim_text: string;
  officer_guidance: string;
  penalty_rule: string;
  tags: string[];
  category?: string;
  applies_to?: string[];
  effective_date?: string;
  amendment_refs?: string[];
  related_rules?: string[];
}

export const STATUTORY_RULES: StatutoryRule[] = [
  {
    "id": "rule_6_1_a",
    "title": "Rule 6(1)(a) - Manufacturer/Packer/Importer Details",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E) dated 07.03.2011",
    "verbatim_text": "Every package shall bear thereon or on a label securely affixed thereto, a definite, plain and conspicuous declaration made in accordance with the provisions of this chapter as to, (a) the name and address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer and for any imported package the name and address of the importer shall be mentioned.",
    "officer_guidance": "Ensure the complete postal address including PIN code is present. For imported goods, both manufacturer (country of origin) and Indian importer details must be present. 'Marketed by' alone is not sufficient; the actual manufacturer or packer must be specified.",
    "penalty_rule": "rule_32",
    "tags": [
      "manufacturer",
      "packer",
      "importer",
      "address",
      "name",
      "contact"
    ],
    "category": "declaration",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 629(E)"
    ],
    "related_rules": [
      "rule_10",
      "rule_27"
    ]
  },
  {
    "id": "rule_6_1_b",
    "title": "Rule 6(1)(b) - Generic/Common Name",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(b) The common or generic names of the commodity contained in the package and in case of packages with more than one product, the name and number or quantity of each product shall be mentioned on the package.",
    "officer_guidance": "Check if the product name clearly identifies what is inside. A brand name is not a substitute for the generic name. If multiple items are packed together, each item must be listed with its quantity.",
    "penalty_rule": "rule_32",
    "tags": [
      "generic name",
      "common name",
      "product name",
      "multi-pack"
    ],
    "category": "declaration",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_13"
    ]
  },
  {
    "id": "rule_6_1_c",
    "title": "Rule 6(1)(c) - Net Quantity",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(c) The net quantity, in terms of the standard unit of weight or measure, of the commodity contained in the package or where the commodity is packed or sold by number, the number of the commodity contained in the package shall be mentioned.",
    "officer_guidance": "Must use standard SI units (g, kg, ml, L, m, cm). 'N' or 'U' for numbers. Must not have qualifiers like 'when packed' (except for specified commodities like soap).",
    "penalty_rule": "section_36_2",
    "tags": [
      "net quantity",
      "weight",
      "volume",
      "measure",
      "SI units"
    ],
    "category": "quantity",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_11",
      "rule_12",
      "rule_12_6"
    ]
  },
  {
    "id": "rule_6_1_d",
    "title": "Rule 6(1)(d) - Maximum Retail Price (MRP)",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(d) The retail sale price of the package shall clearly indicate that it is the maximum retail price inclusive of all taxes and the price in rupees and paise be rounded off to the nearest rupee or 50 paise; \nExplanation: For the purposes of this clause, the maximum retail price shall be printed in the Indian currency.",
    "officer_guidance": "Must explicitly state 'MRP Rs. ... (inclusive of all taxes)'. No dual MRP is allowed. Price cannot be altered or obscured.",
    "penalty_rule": "rule_32",
    "tags": [
      "mrp",
      "price",
      "retail price",
      "taxes",
      "inclusive"
    ],
    "category": "pricing",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 629(E)"
    ],
    "related_rules": [
      "rule_18_1",
      "rule_18_2a"
    ]
  },
  {
    "id": "rule_6_1_e",
    "title": "Rule 6(1)(e) - Month and Year of Manufacture",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(e) the month and year in which the commodity is manufactured or pre-packed or imported shall be mentioned in the package.",
    "officer_guidance": "Month and year must be clear. E.g., 'Mfg. Date: 05/2023' or 'May 2023'. Either manufacturing, packing, or import date is acceptable depending on the product, but for certain products, manufacturing is mandatory.",
    "penalty_rule": "rule_32",
    "tags": [
      "month",
      "year",
      "manufacture date",
      "pkd",
      "packing date",
      "import date"
    ],
    "category": "declaration",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 784(E)"
    ],
    "related_rules": []
  },
  {
    "id": "rule_6_1_f",
    "title": "Rule 6(1)(f) - Best Before / Expiry Date",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(f) the 'best before or use by the date, month and year' shall also be mentioned on the packages if they contain a commodity which may become unfit for human consumption after a period of time.",
    "officer_guidance": "Mandatory for food, cosmetics, and perishable items. Format should clearly state 'Best Before' or 'Use By' or 'Expiry Date'.",
    "penalty_rule": "rule_32",
    "tags": [
      "best before",
      "expiry",
      "use by",
      "perishable"
    ],
    "category": "declaration",
    "applies_to": [
      "food",
      "cosmetics",
      "perishables"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_6_1_g",
    "title": "Rule 6(1)(g) - Country of Origin",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(g) the name of the country of origin or manufacture or assembly in case of imported products shall be mentioned on the package.",
    "officer_guidance": "Crucial for imported goods. Must explicitly state 'Made in [Country]' or 'Country of Origin: [Country]'.",
    "penalty_rule": "rule_32",
    "tags": [
      "country of origin",
      "imported",
      "made in"
    ],
    "category": "declaration",
    "applies_to": [
      "imported"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_6_1_h",
    "title": "Rule 6(1)(h) - Consumer Care Details",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(h) the name, address, telephone number, e-mail address, if available, of the person who can be or the office which can be, contacted, in case of consumer complaints.",
    "officer_guidance": "Must have Name, Address, Telephone No, AND Email Address. Missing any of these is a violation.",
    "penalty_rule": "rule_32",
    "tags": [
      "consumer care",
      "complaints",
      "customer care",
      "helpline",
      "email",
      "phone"
    ],
    "category": "declaration",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 629(E)"
    ],
    "related_rules": []
  },
  {
    "id": "rule_6_1_s",
    "title": "Rule 6(1) - Unit Sale Price (USP)",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2021",
    "gazette_ref": "G.S.R. 779(E)",
    "verbatim_text": "(1) Every package shall bear... (s) the unit sale price in rupees, rounded off to the nearest two decimal places, shall be declared on every pre-packaged commodities.",
    "officer_guidance": "Must declare price per gram, per kg, per ml, per liter, or per piece. E.g., 'Rs. 0.50 per g'. Mandatory from Oct 1, 2022.",
    "penalty_rule": "rule_32",
    "tags": [
      "unit sale price",
      "usp",
      "per unit",
      "pricing"
    ],
    "category": "pricing",
    "applies_to": [
      "all"
    ],
    "effective_date": "2022-10-01",
    "amendment_refs": [
      "G.S.R. 226(E)"
    ],
    "related_rules": [
      "rule_6_11"
    ]
  },
  {
    "id": "rule_6_10",
    "title": "Rule 6(10) - E-Commerce Platform Compliance",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2017",
    "gazette_ref": "G.S.R. 629(E)",
    "verbatim_text": "(10) An E-Commerce entity shall ensure that the mandatory declarations as specified in sub-rule (1), except the month and year in which the commodity is manufactured or packed, shall be displayed on the digital and electronic network used for e-commerce transactions.",
    "officer_guidance": "All physical declarations must be visible on the product listing page online. The e-commerce entity is responsible for displaying the information provided by the seller/manufacturer.",
    "penalty_rule": "rule_32",
    "tags": [
      "ecommerce",
      "online",
      "digital platform",
      "website"
    ],
    "category": "ecommerce",
    "applies_to": [
      "ecommerce"
    ],
    "effective_date": "2018-01-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_6_10_ecommerce"
    ]
  },
  {
    "id": "rule_6_11",
    "title": "Rule 6(11) - Unit Sale Price Framework",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 779(E)",
    "verbatim_text": "The unit sale price shall be declared as:\n(i) Rs. __ per g for net quantity less than 1 kg;\n(ii) Rs. __ per kg for net quantity of 1 kg or more;\n(iii) Rs. __ per cm for net length less than 1 m;\n(iv) Rs. __ per m for net length of 1 m or more;\n(v) Rs. __ per ml for net volume less than 1 litre;\n(vi) Rs. __ per L for net volume of 1 litre or more;\n(vii) Rs. __ per number for items sold by number.",
    "officer_guidance": "Check the correct unit is used based on the total net quantity. Formula is MRP / Net Quantity in standard base units.",
    "penalty_rule": "rule_32",
    "tags": [
      "unit sale price",
      "usp",
      "formula",
      "calculation"
    ],
    "category": "pricing",
    "applies_to": [
      "all"
    ],
    "effective_date": "2022-10-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_11",
    "title": "Rule 11 - Standard Units",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "11. General provisions relating to declaration of quantity.- (1) In declaring the net quantity of the commodity contained in a package, the weight of wrappers and materials other than the commodity shall be excluded. (2) Where a commodity in a package is not likely to undergo any variation in weight or measure, on account of the environmental conditions, the quantity declared on the package shall correspond to the net quantity which will be received by the consumer.",
    "officer_guidance": "Net quantity must be actual product weight/volume. Tare weight (packaging) must not be included.",
    "penalty_rule": "section_36_2",
    "tags": [
      "units",
      "tare weight",
      "actual quantity"
    ],
    "category": "quantity",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_12"
    ]
  },
  {
    "id": "rule_12",
    "title": "Rule 12 - Declaration of Net Quantity",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "12. Manner in which declaration of quantity shall be expressed.- (1) The declaration of quantity shall be expressed in terms of such unit of weight, measure or number or a combination of weight, measure or number as would give an accurate and adequate information to the consumer with regard to the quantity of the commodity contained in the package.",
    "officer_guidance": "Solids in weight (g, kg). Liquids in volume (ml, L) or weight. Semi-solids in weight or volume.",
    "penalty_rule": "section_36_2",
    "tags": [
      "expression of quantity",
      "solids",
      "liquids"
    ],
    "category": "quantity",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_11"
    ]
  },
  {
    "id": "rule_12_6",
    "title": "Rule 12(6) - Prohibition of Qualifiers",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(6) The declaration of quantity shall not contain any word or expression of any sort whatsoever which tends to create an exaggerated, misleading or inadequate impression as to the quantity of the commodity contained in the package, for example, words or expressions like 'minimum', 'not less than', 'average', 'about', 'approximately' or other words of a similar nature.",
    "officer_guidance": "Look for words like 'Approx', 'When packed', 'Minimum'. These are strictly illegal. Only exact standard quantities are allowed.",
    "penalty_rule": "section_36_1",
    "tags": [
      "qualifiers",
      "approximate",
      "minimum",
      "when packed",
      "misleading"
    ],
    "category": "quantity",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 784(E)"
    ],
    "related_rules": []
  },
  {
    "id": "rule_13",
    "title": "Rule 13 - Multipacks",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "13. Declaration of quantity in relation to commodities packed in multi-piece packages. (1) Every multi-piece package shall bear on the outside of the package a declaration of the number of individual pieces or packages contained therein and the total quantity of the commodity in the multi-piece package.",
    "officer_guidance": "Multipacks must show number of pieces AND individual quantity of each piece (e.g., '10 N x 50 g = 500 g'). If individual pieces are for retail sale, they must have full declarations.",
    "penalty_rule": "rule_32",
    "tags": [
      "multipack",
      "multi-piece",
      "combination package"
    ],
    "category": "quantity",
    "applies_to": [
      "multi-pack"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_7",
    "title": "Rule 7 - Principal Display Panel & Font Height",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "Every declaration required to be made under these rules shall appear on the principal display panel. Minimum height of numerals and letters for declaration of MRP and Net Quantity is based on PDP area: \nPDP <= 50 cm2: Normal 1.0mm, Blown/molded 2.0mm\n50 < PDP <= 100: Normal 2.0mm, Molded 3.0mm\n100 < PDP <= 500: Normal 2.5mm, Molded 4.0mm\n500 < PDP <= 2500: Normal 4.0mm, Molded 6.0mm\nPDP > 2500: Normal 6.0mm, Molded 6.0mm.\nWidth of the letter or numeral shall not be less than one-third of its height, except in the case of numeral '1' and letters 'i', 'I', and 'l'.",
    "officer_guidance": "Measure the PDP area, then check Table-I for the required font height of Net Quantity and MRP. Measure actual font height on package. Width must be >= 1/3 of height.",
    "penalty_rule": "section_36_1",
    "tags": [
      "font size",
      "pdp",
      "principal display panel",
      "height",
      "width",
      "typography",
      "table 1"
    ],
    "category": "typography",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 629(E)"
    ],
    "related_rules": [
      "rule_7_pdp_calc",
      "rule_8"
    ]
  },
  {
    "id": "rule_8",
    "title": "Rule 8 - Declaration Clearance and Spacing",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "8. Declaration where to appear.- (1) Every declaration required to be made under these rules shall appear on the principal display panel... The area surrounding the quantity declaration shall be free of printed information: (a) above and below, by a space equal to at least the height of the numeral in the declaration, and (b) to the left and right, by a space equal to twice the height of the numeral in the declaration.",
    "officer_guidance": "Ensure there is sufficient blank 'breathing space' around the Net Quantity and MRP declarations so they stand out.",
    "penalty_rule": "section_36_1",
    "tags": [
      "spacing",
      "clearance",
      "margins",
      "typography",
      "pdp"
    ],
    "category": "typography",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_7"
    ]
  },
  {
    "id": "rule_7_pdp_calc",
    "title": "Rule 7 - PDP Area Calculation",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "The area of the principal display panel shall be: (a) in the case of a rectangular package, where one entire side can properly be considered to be the principal display panel side, the product of the height multiplied by the width of that side; (b) in case of a cylindrical or nearly cylindrical package, 40 percent of the product of the height of the package multiplied by the circumference; (c) in case of any other shaped package, 40 percent of the total surface of the package.",
    "officer_guidance": "Use correct formula based on shape. Rectangular = HxW. Cylindrical = 0.40xHxC. Others = 40% of total surface area.",
    "penalty_rule": "section_36_1",
    "tags": [
      "pdp calculation",
      "area",
      "rectangular",
      "cylindrical"
    ],
    "category": "typography",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_9_4",
    "title": "Rule 9(4) - Mandatory Languages",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(4) The declarations to be given under these rules shall be in Hindi in Devanagari script or in English. Provided that nothing contained in this sub-rule shall prevent the use of any other language in addition to Hindi or English language.",
    "officer_guidance": "All mandatory declarations MUST be in English or Hindi. Regional languages can be extra, but cannot replace English/Hindi.",
    "penalty_rule": "section_36_1",
    "tags": [
      "language",
      "hindi",
      "english",
      "regional"
    ],
    "category": "language",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_9_1_2",
    "title": "Rule 9(1) & (2) - Conspicuous Contrast",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "9. Manner in which declaration shall be made.- (1) Every declaration which is required to be made on a package under these rules shall be - (a) legible and prominent; (b) numerals of the retail sale price and net quantity declaration shall be printed, painted or inscribed on the package in a colour that contrasts conspicuously with the background of the label.",
    "officer_guidance": "Ensure MRP and Net Quantity numerals stand out. E.g., black text on white background. White on yellow or light gray on white may be non-conspicuous.",
    "penalty_rule": "section_36_1",
    "tags": [
      "contrast",
      "color",
      "background",
      "legible",
      "conspicuous"
    ],
    "category": "typography",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_3",
    "title": "Rule 3 - Applicability and Exemptions (>25kg/L)",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "3. Applicability of the Chapter.- The provisions of this Chapter shall not apply to,- (a) packages of commodities containing quantity of more than 25 kilogram or 25 litre; (b) cement, fertilizer and agricultural farm produce sold in bags above 50 kilogram; and (c) packaged commodities meant for industrial consumers or institutional consumers.",
    "officer_guidance": "If a retail package is >25kg or >25L, PC Rules Chapter II (declarations) do NOT apply. Exception: Cement/fertilizer limit is 50kg.",
    "penalty_rule": "None",
    "tags": [
      "exemption",
      "25kg",
      "25L",
      "institutional",
      "industrial"
    ],
    "category": "exemption",
    "applies_to": [
      "bulk",
      "industrial"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_26_a",
    "title": "Rule 26(a) - Small Packages Exemption",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "26. Exemption in respect of certain packages.- Nothing contained in these rules shall apply to any package containing a commodity if- (a) the net weight or measure of the commodity is ten gram or ten millilitre or less, if sold by weight or measure; Provided that the declaration in respect of maximum retail price and net quantity shall be declared on packages containing 10g to 20g or 10ml to 20ml; Provided further that this exemption shall not apply to tobacco and tobacco products.",
    "officer_guidance": "Packages <= 10g or 10ml are exempt from most rules, EXCEPT tobacco and pan masala which need all declarations regardless of size.",
    "penalty_rule": "None",
    "tags": [
      "exemption",
      "10g",
      "10ml",
      "small",
      "tobacco"
    ],
    "category": "exemption",
    "applies_to": [
      "small packages"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 427(E)"
    ],
    "related_rules": []
  },
  {
    "id": "rule_26_b_f",
    "title": "Rule 26(b-f) - Fast Food & Loose Clothing Exemptions",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(b) any package containing fast food items packed by restaurant or hotel and the like; (c) it contains scheduled formulations and non-scheduled formulations covered under the Drugs (Price Control) Order, 2013... (f) garments or hosiery sold in loose or open form.",
    "officer_guidance": "Restaurant parcels and loose hosiery/clothing don't need full PC Rules declarations.",
    "penalty_rule": "None",
    "tags": [
      "exemption",
      "fast food",
      "hotel",
      "restaurant",
      "hosiery",
      "drugs"
    ],
    "category": "exemption",
    "applies_to": [
      "food",
      "clothing",
      "drugs"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_6_10_ecommerce",
    "title": "Rule 6(10) - E-Commerce Digital Declarations",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2017",
    "gazette_ref": "G.S.R. 629(E)",
    "verbatim_text": "An E-Commerce entity shall ensure that the mandatory declarations... shall be displayed on the digital and electronic network used for e-commerce transactions.",
    "officer_guidance": "Verify the URL. If the physical product has MRP 100, the website must show MRP 100. Name, address, net qty, etc., must be present online.",
    "penalty_rule": "rule_32",
    "tags": [
      "ecommerce",
      "digital",
      "online",
      "website"
    ],
    "category": "ecommerce",
    "applies_to": [
      "ecommerce"
    ],
    "effective_date": "2018-01-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "gsr_524_e_qr",
    "title": "QR Code for Electronic Products",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2022",
    "gazette_ref": "G.S.R. 524(E)",
    "verbatim_text": "Provided that in case of electronic products which are manufactured or pre-packed or imported on or after the 15th July, 2022, the package may declare the name of the manufacturer or packer or importer, the month and year of manufacture or pre-packing or import, the net quantity and the maximum retail price, on the package itself and the other declarations through a QR code.",
    "officer_guidance": "For electronics only, secondary info (consumer care, address, etc.) can be via QR code. But Name, Month/Year, Net Qty, MRP MUST still be printed on the package.",
    "penalty_rule": "section_36_1",
    "tags": [
      "qr code",
      "electronics",
      "digital declaration"
    ],
    "category": "ecommerce",
    "applies_to": [
      "electronics"
    ],
    "effective_date": "2022-07-14",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_27",
    "title": "Rule 27 - Registration of Manufacturers/Packers",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "27. Registration of manufacturers, packers and importers.- (1) Every individual, firm, Hindu undivided family, society, company or corporation who or which pre-packs or imports any commodity for sale, distribution or delivery shall make an application, accompanied by a fee of rupees five hundred, to the Director or the Controller for the registration of his or its name and complete address.",
    "officer_guidance": "Check if the manufacturer/packer/importer has a valid LMPC registration certificate. Registration number is usually printed but not mandatory; registration itself is.",
    "penalty_rule": "rule_32",
    "tags": [
      "registration",
      "license",
      "packer registration",
      "importer registration"
    ],
    "category": "registration",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "rule_18_1",
    "title": "Rule 18(1) - Sale Above MRP",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "18. Provisions relating to wholesale dealer and retail dealers.- (1) No wholesale dealer or retail dealer or importer shall sell, distribute, deliver, display or store for sale any commodity in the packaged form unless the package complies with in all respects, the provisions of the Act and these rules. (2) No retail dealer or other person including manufacturer, packer, importer and wholesale dealer shall make any sale of any commodity in packed form at a price exceeding the retail sale price thereof.",
    "officer_guidance": "Overcharging above MRP is illegal. Check bills or test purchases.",
    "penalty_rule": "section_36_1",
    "tags": [
      "overcharging",
      "exceeding mrp",
      "sale price"
    ],
    "category": "pricing",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_6_1_d"
    ]
  },
  {
    "id": "rule_18_2a",
    "title": "Rule 18(2A) - Dual MRP Ban",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2017",
    "gazette_ref": "G.S.R. 629(E)",
    "verbatim_text": "(2A) Unless otherwise specifically provided under any other law, no manufacturer or packer or importer shall declare different maximum retail prices on an identical pre-packaged commodity by adopting restrictive trade practices or unfair trade practices as defined under clause (c) of sub-section (1) of section 2 of the Consumer Protection Act, 1986.",
    "officer_guidance": "Cannot have a separate 'Airport MRP' or 'Mall MRP' for the identical product.",
    "penalty_rule": "section_36_1",
    "tags": [
      "dual mrp",
      "different prices",
      "identical product"
    ],
    "category": "pricing",
    "applies_to": [
      "all"
    ],
    "effective_date": "2018-01-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_6_1_d"
    ]
  },
  {
    "id": "rule_32",
    "title": "Rule 32 - General Contravention Penalty",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "32. Penalty for contravention of Rules.- (1) Whoever contravenes the provisions of rules 27 to 31, he shall be punished with fine of four thousand rupees. (2) Whoever contravenes any other provision of these rules, for the contravention of which no punishment has been provided either in the Act or in the rules he shall be punished with fine of two thousand rupees. [Note: Fines often updated by subsequent acts].",
    "officer_guidance": "General penalty rule for violations not specifically covered under sections 36(1) or 36(2) of the Act.",
    "penalty_rule": "rule_32",
    "tags": [
      "penalty",
      "fine",
      "contravention",
      "violation"
    ],
    "category": "penalty",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "section_36_1",
    "title": "Section 36(1) - Non-conforming Labels Penalty",
    "act_rule": "The Legal Metrology Act, 2009",
    "gazette_ref": "Act No. 1 of 2010",
    "verbatim_text": "36. Penalty for selling, etc., of non-standard packages.- (1) Whoever manufactures, packs, imports, sells, distributes, delivers or otherwise transfers, offers, exposes or possesses for sale, or causes to be sold, distributed, delivered or otherwise transferred, offered, exposed for sale any pre-packaged commodity which does not conform to the declarations on the package as provided in this Act, shall be punished with fine which may extend to twenty-five thousand rupees, for the second offence, with fine which may extend to fifty thousand rupees and for the subsequent offence, with fine which shall not be less than fifty thousand rupees but which may extend to one lakh rupees or with imprisonment for a term which may extend to one year or with both.",
    "officer_guidance": "Main section for missing declarations, wrong font sizes, incorrect formatting.",
    "penalty_rule": "section_36_1",
    "tags": [
      "penalty",
      "non-standard",
      "labeling error",
      "jan vishwas"
    ],
    "category": "penalty",
    "applies_to": [
      "all"
    ],
    "effective_date": "2010-01-14",
    "amendment_refs": [
      "Jan Vishwas Act, 2023"
    ],
    "related_rules": []
  },
  {
    "id": "section_36_2",
    "title": "Section 36(2) - Net Quantity Discrepancy",
    "act_rule": "The Legal Metrology Act, 2009",
    "gazette_ref": "Act No. 1 of 2010",
    "verbatim_text": "(2) Whoever manufactures or packs or imports or causes to be manufactured or packed or imported, any pre-packaged commodity, with error in net quantity as may be prescribed shall be punished with fine which shall not be less than ten thousand rupees but which may extend to fifty thousand rupees and for the second and subsequent offence, with fine which may extend to one lakh rupees or with imprisonment for a term which may extend to one year or with both.",
    "officer_guidance": "Used when actual net quantity is less than declared net quantity beyond the Maximum Permissible Error (MPE).",
    "penalty_rule": "section_36_2",
    "tags": [
      "penalty",
      "short weight",
      "net quantity error",
      "mpe"
    ],
    "category": "penalty",
    "applies_to": [
      "all"
    ],
    "effective_date": "2010-01-14",
    "amendment_refs": [
      "Jan Vishwas Act, 2023"
    ],
    "related_rules": [
      "schedule_2_mpe"
    ]
  },
  {
    "id": "section_49",
    "title": "Section 49 - Corporate Liability",
    "act_rule": "The Legal Metrology Act, 2009",
    "gazette_ref": "Act No. 1 of 2010",
    "verbatim_text": "49. Offences by companies and power of court to publish name, place of business, etc., for companies convicted.- (1) Where an offence under this Act has been committed by a company, (a) the person, if any, who has been nominated under sub-section (2) to be in charge of, and responsible to, the company for the conduct of the business of the company, or (b) where no person has been nominated, every person who at the time the offence was committed was in charge of, and was responsible to, the company for the conduct of the business of the company... shall be deemed to be guilty of the offence and shall be liable to be proceeded against and punished accordingly.",
    "officer_guidance": "Notices go to the Nominated Director. If no nomination exists, all directors/partners are liable.",
    "penalty_rule": "section_49",
    "tags": [
      "company",
      "directors",
      "corporate liability",
      "nomination"
    ],
    "category": "penalty",
    "applies_to": [
      "companies"
    ],
    "effective_date": "2010-01-14",
    "amendment_refs": [],
    "related_rules": []
  },
  {
    "id": "schedule_1_food",
    "title": "Schedule I - Standard Pack Sizes (Food)",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "Commodities to be packed in specified quantities... Baby food, Weaning food, Biscuits, Bread, Un-canned packages of butter and margarine, Cereals and Pulses, Coffee, Tea, Materials which may be constituted or reconstituted as beverages... (Repealed by GSR 779(E) effective Oct 2022, replaced by Unit Sale Price declaration).",
    "officer_guidance": "Schedule II mandatory sizes were mostly abolished in 2022 to introduce Unit Sale Price (USP), but specific standard quantities might still apply depending on sector rules.",
    "penalty_rule": "section_36_1",
    "tags": [
      "schedule 1",
      "pack sizes",
      "food",
      "standard quantity"
    ],
    "category": "schedule",
    "applies_to": [
      "food"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 779(E)"
    ],
    "related_rules": [
      "rule_6_1_s"
    ]
  },
  {
    "id": "schedule_1_general",
    "title": "Schedule I - Standard Pack Sizes (General)",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "(Mostly repealed by GSR 779(E) effective Oct 2022, replaced by Unit Sale Price declaration).",
    "officer_guidance": "General non-food standard pack sizes were abolished to allow market freedom, provided Unit Sale Price is printed.",
    "penalty_rule": "None",
    "tags": [
      "schedule 1",
      "pack sizes",
      "general"
    ],
    "category": "schedule",
    "applies_to": [
      "general"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [
      "G.S.R. 779(E)"
    ],
    "related_rules": [
      "rule_6_1_s"
    ]
  },
  {
    "id": "schedule_2_mpe",
    "title": "Schedule II - Maximum Permissible Error",
    "act_rule": "The Legal Metrology (Packaged Commodities) Rules, 2011",
    "gazette_ref": "G.S.R. 202(E)",
    "verbatim_text": "Second Schedule: Maximum permissible error in relation to the quantity contained in an individual package. Up to 50g/ml: 9%; 50-100g/ml: 4.5g/ml; 100-200g/ml: 4.5%; 200-300g/ml: 9g/ml; 300-500g/ml: 3%; 500-1000g/ml: 15g/ml; 1000-10000g/ml: 1.5%; 10000-15000g/ml: 150g/ml; More than 15000g/ml: 1%.",
    "officer_guidance": "Used to determine if short weight violation occurred. If deficiency is within MPE, it passes. If beyond MPE, it's a violation of Sec 36(2).",
    "penalty_rule": "section_36_2",
    "tags": [
      "mpe",
      "error",
      "tolerance",
      "short weight",
      "schedule 2"
    ],
    "category": "schedule",
    "applies_to": [
      "all"
    ],
    "effective_date": "2011-04-01",
    "amendment_refs": [],
    "related_rules": [
      "section_36_2"
    ]
  },
  {
    "id": "amendment_gsr_629e",
    "title": "Amendment GSR 629(E) - E-commerce & Dual MRP",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2017",
    "gazette_ref": "G.S.R. 629(E)",
    "verbatim_text": "Introduced Rule 6(10) for E-commerce platforms. Substituted Table I in Rule 7. Introduced Rule 18(2A) banning dual MRP.",
    "officer_guidance": "Key amendment that brought E-commerce platforms under compliance and banned different MRPs for malls/airports.",
    "penalty_rule": "None",
    "tags": [
      "amendment",
      "2017",
      "ecommerce",
      "dual mrp",
      "gsr 629(e)"
    ],
    "category": "amendment",
    "applies_to": [
      "all",
      "ecommerce"
    ],
    "effective_date": "2018-01-01",
    "amendment_refs": [],
    "related_rules": [
      "rule_6_10",
      "rule_18_2a",
      "rule_7"
    ]
  },
  {
    "id": "amendment_gsr_779e",
    "title": "Amendment GSR 779(E) - Unit Sale Price",
    "act_rule": "The Legal Metrology (Packaged Commodities) Amendment Rules, 2021",
    "gazette_ref": "G.S.R. 779(E)",
    "verbatim_text": "Omitted Schedule II (standard pack sizes). Introduced Rule 6(1)(s) and Rule 6(11) mandating Unit Sale Price.",
    "officer_guidance": "Shifted regulatory focus from fixed pack sizes to transparent pricing via USP.",
    "penalty_rule": "None",
    "tags": [
      "amendment",
      "2021",
      "usp",
      "unit sale price",
      "gsr 779(e)"
    ],
    "category": "amendment",
    "applies_to": [
      "all"
    ],
    "effective_date": "2022-10-01",
    "amendment_refs": [
      "G.S.R. 226(E)"
    ],
    "related_rules": [
      "rule_6_1_s",
      "rule_6_11",
      "schedule_1_food"
    ]
  },
  {
    "id": "amendment_jan_vishwas",
    "title": "Jan Vishwas Act Amendment",
    "act_rule": "Jan Vishwas (Amendment of Provisions) Act, 2023",
    "gazette_ref": "Act No. 18 of 2023",
    "verbatim_text": "Amends Section 36 of the Legal Metrology Act to decriminalize certain offenses, converting imprisonment for first offenses into higher fines.",
    "officer_guidance": "First offenses under Sec 36 are now punishable by fines only, up to 5 Lakhs, handled by adjudicating officers rather than courts.",
    "penalty_rule": "None",
    "tags": [
      "amendment",
      "jan vishwas",
      "decriminalization",
      "penalties"
    ],
    "category": "amendment",
    "applies_to": [
      "all"
    ],
    "effective_date": "2023-10-01",
    "amendment_refs": [],
    "related_rules": [
      "section_36_1",
      "section_36_2"
    ]
  }
];
