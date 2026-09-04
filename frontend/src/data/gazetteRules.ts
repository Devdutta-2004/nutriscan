export interface StatutoryRule {
  id: string;
  title: string;
  act_rule: string;
  gazette_ref: string;
  verbatim_text: string;
  officer_guidance: string;
  penalty_rule: string;
  tags: string[];
}

export const STATUTORY_RULES: StatutoryRule[] = [
  {
    id: "rule_6_1_s",
    title: "Rule 6(1)(s) - Unit Sale Price (USP) Mandate",
    act_rule: "Legal Metrology (Packaged Commodities) Amendment Rules, 2024",
    gazette_ref: "G.S.R. 784(E) / Ministry of Consumer Affairs, Food & Public Distribution",
    verbatim_text:
      "Declaration of unit sale price shall be made on every package where MRP is declared, indicating price per g or per 100g for commodities whose net quantity is less than 1 kilogram, or price per kg for net quantities of 1 kilogram or more. For liquids, price per ml or per 100ml for quantities under 1 litre, or price per litre for 1 litre or more. For items sold by number or length, declaration must be per piece or per metre respectively.",
    officer_guidance:
      "Inspectors must strictly verify that the declared USP equals MRP divided by Net Quantity. Non-declaration or mathematical mismatch constitutes an offense punishable under Rule 32.",
    penalty_rule: "Rule 32 (Fine up to ₹25,000 for 1st offense, ₹50,000 for 2nd offense)",
    tags: ["usp", "unit sale price", "pricing", "mrp", "calculation", "formula", "2024 amendment"]
  },
  {
    id: "rule_6_1_d",
    title: "Rule 6(1)(d) - Maximum Retail Price (Inclusive of all taxes)",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(d)",
    verbatim_text:
      "The retail sale price of the package shall clearly indicate 'Maximum Retail Price Rs... inclusive of all taxes' or 'MRP Rs... incl. of all taxes'. No dealer or retail seller shall alter, obscure, or sell the commodity at a rate higher than the Maximum Retail Price printed thereon.",
    officer_guidance:
      "Ensure the words 'inclusive of all taxes' or 'incl. of all taxes' are unambiguously present. Omitting the tax inclusion clause violates Section 18 of the Legal Metrology Act, 2009.",
    penalty_rule: "Section 36(1) of LM Act, 2009 (Fine up to ₹25,000)",
    tags: ["mrp", "retail price", "taxes", "inclusive", "overcharging", "pricing"]
  },
  {
    id: "rule_6_1_a",
    title: "Rule 6(1)(a) - Name & Address of Manufacturer / Importer",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(a)",
    verbatim_text:
      "The name and complete postal address of the manufacturer, or where manufacturer is not the packer, the name and complete address of the manufacturer and packer, or for imported packages the name and complete postal address of the importer shall be declared on every package. Complete address includes postal pin code.",
    officer_guidance:
      "For foreign-manufactured items, the package MUST declare the registered Indian Importer's name, complete postal address with PIN code, and importer registration under Rule 27.",
    penalty_rule: "Rule 32 & Rule 27 of LMPC Rules, 2011",
    tags: ["manufacturer", "importer", "address", "packer", "postal address", "pin code", "foreign"]
  },
  {
    id: "rule_6_1_h",
    title: "Rule 6(1)(h) - Consumer Care / Grievance Redressal Mechanism",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) as amended by G.S.R. 784(E)",
    verbatim_text:
      "The name, address, telephone number and e-mail address of the person or office which can be contacted in the case of consumer complaints or grievance redressal shall be declared conspicuously on the package.",
    officer_guidance:
      "Both telephone number and email address are strictly mandatory. Declaring only a website URL or only a phone number without an active email address is non-compliant.",
    penalty_rule: "Rule 32 of LMPC Rules, 2011",
    tags: ["consumer care", "customer service", "complaints", "email", "telephone", "helpline"]
  },
  {
    id: "rule_6_1_b",
    title: "Rule 6(1)(b) - Generic or Common Name of Commodity",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(b)",
    verbatim_text:
      "The generic name or common name of the commodity contained in the package shall be declared. Fancy brand names cannot substitute the true generic description of the product.",
    officer_guidance:
      "Ensure the consumer can ascertain the true identity of the product without being misled by trademark brand terminology.",
    penalty_rule: "Rule 32 of LMPC Rules, 2011",
    tags: ["generic name", "commodity name", "identity", "misleading", "product description"]
  },
  {
    id: "rule_6_1_c",
    title: "Rule 6(1)(c) - Net Quantity Declaration in Standard Units",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(c) read with First Schedule",
    verbatim_text:
      "The net quantity in terms of the standard units of weight or measure shall be declared on every package. Net weight must be expressed in grams (g) or kilograms (kg); liquid volume in millilitres (ml) or litres (l); and length in metres (m). Non-standard units (e.g. lbs, fluid oz) cannot be used as primary declarations.",
    officer_guidance:
      "Check that standard SI symbols are used (g, kg, ml, l). Maximum permissible error (MPE) tolerances as per Schedule II apply if quantity verification by test weighing is conducted.",
    penalty_rule: "Section 36(2) of Legal Metrology Act, 2009",
    tags: ["net quantity", "weight", "volume", "grams", "kilograms", "metric units", "mpe"]
  },
  {
    id: "rule_6_1_e",
    title: "Rule 6(1)(e) - Month and Year of Manufacture / Packing",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(e)",
    verbatim_text:
      "The month and year in which the commodity is manufactured or pre-packed or imported shall be clearly declared. Packages containing commodities that can become unfit for human consumption after a period of time shall also bear 'Best before' or 'Use by' date, month, and year.",
    officer_guidance:
      "Both Month and Year are compulsory. Stating only the year or omitting the packaging date violates this rule.",
    penalty_rule: "Rule 32 of LMPC Rules, 2011",
    tags: ["mfg date", "packaging date", "expiry", "best before", "month", "year"]
  },
  {
    id: "rule_6_1_g",
    title: "Rule 6(1)(g) - Country of Origin Mandate",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 6(1)(g) & E-Commerce Guidelines",
    verbatim_text:
      "The name of the country of origin or manufacture shall be mentioned on every package containing imported goods. For domestic manufacture, 'Made in India' or 'Country of Origin: India' fulfills this mandate.",
    officer_guidance:
      "For all imported products, check that country of origin is declared in English or Hindi on the principal display panel.",
    penalty_rule: "Rule 32 of LMPC Rules, 2011",
    tags: ["country of origin", "made in india", "import", "customs", "foreign"]
  },
  {
    id: "rule_32",
    title: "Rule 32 - Statutory Penalties for Non-Compliance",
    act_rule: "Legal Metrology (Packaged Commodities) Rules, 2011",
    gazette_ref: "G.S.R. 202(E) / Rule 32",
    verbatim_text:
      "Whoever contravenes any of the provisions of these rules, for which no punishment is provided elsewhere, shall be punishable with a fine which may extend to twenty-five thousand rupees (₹25,000) for the first offense, and to fifty thousand rupees (₹50,000) or imprisonment for a term which may extend to one year, or both, for the second or subsequent offense.",
    officer_guidance:
      "Legal Metrology Officers are empowered to issue a Notice of Non-Compliance and seize non-compliant packages under Section 15 of the Act.",
    penalty_rule: "Rule 32 read with Section 36 & 39 of LM Act, 2009",
    tags: ["penalty", "punishment", "fine", "rule 32", "seizure", "legal notice", "enforcement"]
  }
];
