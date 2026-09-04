import { USPVerification } from '../types/compliance';

export class ClientMathEngine {
  static parseQuantity(quantityStr: string): { val: number; unit: string } | null {
    if (!quantityStr) return null;
    const clean = quantityStr.trim().toLowerCase();
    const match = clean.match(/([\d\.]+)\s*([a-zA-Z]+)/);
    if (!match) return null;
    const val = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    return isNaN(val) ? null : { val, unit };
  }

  static parsePrice(priceStr: string): number | null {
    if (!priceStr) return null;
    const match = priceStr.match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const val = parseFloat(match[1]);
    return isNaN(val) ? null : val;
  }

  static calculateExpectedUsp(mrp: number, netQty: number, unit: string) {
    const u = unit.toLowerCase();
    let uspVal = 0;
    let targetUnit = u;
    let altVal: number | null = null;
    let altUnit: string | null = null;

    if (['g', 'gm', 'gms', 'gram', 'grams'].includes(u)) {
      if (netQty < 1000) {
        uspVal = mrp / netQty;
        targetUnit = 'g';
        altVal = uspVal * 100;
        altUnit = '100g';
      } else {
        uspVal = mrp / (netQty / 1000.0);
        targetUnit = 'kg';
      }
    } else if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(u)) {
      uspVal = mrp / netQty;
      targetUnit = 'kg';
    } else if (['ml', 'mls', 'millilitre', 'millilitres'].includes(u)) {
      if (netQty < 1000) {
        uspVal = mrp / netQty;
        targetUnit = 'ml';
        altVal = uspVal * 100;
        altUnit = '100ml';
      } else {
        uspVal = mrp / (netQty / 1000.0);
        targetUnit = 'L';
      }
    } else if (['l', 'ltr', 'litre', 'litres'].includes(u)) {
      uspVal = mrp / netQty;
      targetUnit = 'L';
    } else if (['piece', 'pieces', 'pc', 'pcs', 'unit', 'units', 'n', 'no', 'nos'].includes(u)) {
      uspVal = mrp / netQty;
      targetUnit = 'piece';
    } else {
      uspVal = netQty > 0 ? mrp / netQty : 0;
      targetUnit = u;
    }

    return {
      expected_usp_value: Number(uspVal.toFixed(2)),
      expected_usp_unit: targetUnit,
      expected_display: `₹${uspVal.toFixed(2)}/${targetUnit}`,
      alt_usp_value: altVal ? Number(altVal.toFixed(2)) : null,
      alt_usp_unit: altUnit,
      alt_display: altVal ? `₹${altVal.toFixed(2)}/${altUnit}` : null,
      formula: `MRP (₹${mrp.toFixed(2)}) ÷ Net Qty (${netQty}${unit})`,
    };
  }

  static verifyUsp(mrpStr: string, qtyStr: string, printedUspStr?: string | null): USPVerification {
    const mrp = this.parsePrice(mrpStr);
    const parsedQty = this.parseQuantity(qtyStr);

    if (mrp === null || !parsedQty) {
      return {
        status: 'WARNING',
        is_valid: false,
        reason: 'Could not parse MRP or Net Quantity accurately.',
        statutory_rule: 'Rule 6(1)(s)',
      };
    }

    const calc = this.calculateExpectedUsp(mrp, parsedQty.val, parsedQty.unit);

    if (!printedUspStr || ['none', 'n/a', 'missing', ''].includes(printedUspStr.trim().toLowerCase())) {
      return {
        status: 'VIOLATION',
        is_valid: false,
        violation_code: 'LMPC-RULE-6-1-S',
        reason: 'Unit Sale Price (USP) is missing completely on the packaging.',
        calculated: calc,
        printed: null,
        discrepancy: 'Mandatory declaration omitted under Rule 6(1)(s) (2024 Amendment).',
        statutory_rule: 'Rule 6(1)(s)',
      };
    }

    const printedPrice = this.parsePrice(printedUspStr);
    if (printedPrice === null) {
      return {
        status: 'WARNING',
        is_valid: false,
        violation_code: 'LMPC-RULE-6-1-S-FORMAT',
        reason: `Printed USP '${printedUspStr}' could not be decoded numerically.`,
        calculated: calc,
        printed: printedUspStr,
        statutory_rule: 'Rule 6(1)(s)',
      };
    }

    const expectedVal = calc.expected_usp_value;
    const altVal = calc.alt_usp_value;

    const diffPrimary = Math.abs(printedPrice - expectedVal);
    const diffAlt = altVal !== null ? Math.abs(printedPrice - altVal) : 9999.0;

    const matchesPrimary = diffPrimary <= Math.max(0.05, expectedVal * 0.02);
    const matchesAlt = diffAlt <= Math.max(0.05, (altVal || 0) * 0.02);

    if (matchesPrimary || matchesAlt) {
      return {
        status: 'COMPLIANT',
        is_valid: true,
        reason: 'Printed Unit Sale Price accurately matches calculated statutory value.',
        calculated: calc,
        printed: `₹${printedPrice.toFixed(2)}`,
        statutory_rule: 'Rule 6(1)(s)',
      };
    } else {
      return {
        status: 'VIOLATION',
        is_valid: false,
        violation_code: 'LMPC-RULE-6-1-S-MISMATCH',
        reason: `USP mismatch: Printed ₹${printedPrice.toFixed(2)} differs from calculated ${calc.expected_display}.`,
        calculated: calc,
        printed: `₹${printedPrice.toFixed(2)}`,
        discrepancy: `Overstated or inaccurate unit rate (Difference: ₹${Math.abs(printedPrice - expectedVal).toFixed(2)}).`,
        statutory_rule: 'Rule 6(1)(s)',
      };
    }
  }
}
