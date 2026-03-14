/**
 * K2 Loan Comparison Spreadsheet Generator
 *
 * Run:  node scripts/generate-loan-comparison.mjs
 *
 * Produces: public/assets/K2_Loan_Comparison_Spreadsheet.xlsx
 *
 * Requires: npm install exceljs
 */

import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'K2 Commercial Finance';
  wb.created = new Date();

  /* ─────────────────────────────────────────────────────────────── */
  /*  Sheet 1: Loan Comparison                                       */
  /* ─────────────────────────────────────────────────────────────── */
  const ws = wb.addWorksheet('Loan Comparison', {
    views: [{ state: 'frozen', ySplit: 2 }],
  });

  // ── Title row ──
  ws.mergeCells('A1:K1');
  const titleCell = ws.getCell('A1');
  titleCell.value = 'K2 Financing Success Kit — Loan Comparison Worksheet';
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1B5E20' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
  ws.getRow(1).height = 32;

  // ── Column headers ──
  const headers = [
    { header: 'Lender Name', key: 'lender', width: 22 },
    { header: 'Contact', key: 'contact', width: 22 },
    { header: 'Term (years)', key: 'term', width: 14 },
    { header: 'Interest Rate', key: 'rate', width: 14 },
    { header: 'Prepayment Penalty (Y/N)', key: 'prepayment', width: 22 },
    { header: 'Origination / Closing Costs', key: 'costs', width: 26 },
    { header: 'Loan-to-Value (LTV)', key: 'ltv', width: 18 },
    { header: 'Recourse / Non-Recourse', key: 'recourse', width: 22 },
    { header: 'Reserves Required', key: 'reserves', width: 18 },
    { header: 'Other Fees', key: 'fees', width: 18 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  ws.columns = headers;

  // Style the header row (row 2 since row 1 is title)
  const headerRow = ws.getRow(2);
  headerRow.values = headers.map((h) => h.header);
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF1B5E20' } },
    };
  });
  headerRow.height = 28;

  // ── Example rows (to demonstrate usage) ──
  const examples = [
    {
      lender: 'First National Bank',
      contact: 'John Smith\n(555) 123-4567',
      term: 10,
      rate: '6.75%',
      prepayment: 'Y — 3-2-1 step-down',
      costs: '1% origination + $3,500 closing',
      ltv: '75%',
      recourse: 'Full recourse',
      reserves: '6 months',
      fees: 'Appraisal: $3,500',
      notes: 'Existing relationship; may negotiate rate',
    },
    {
      lender: 'ABC Credit Union',
      contact: 'Jane Doe\njdoe@abccu.org',
      term: 7,
      rate: '7.25%',
      prepayment: 'N',
      costs: '0.5% origination + $2,800 closing',
      ltv: '70%',
      recourse: 'Full recourse',
      reserves: '3 months',
      fees: 'Legal review: $1,200',
      notes: 'Faster turnaround; member pricing available',
    },
    {
      lender: 'SBA 504 (via CDC)',
      contact: 'Regional CDC\n(555) 987-6543',
      term: 25,
      rate: '5.50% fixed (CDC portion)',
      prepayment: 'Y — 10-year lockout',
      costs: 'CDC fee ~1.5% + SBA guarantee fee',
      ltv: '90%',
      recourse: 'Full recourse',
      reserves: '12 months',
      fees: 'SBA guarantee fee: 2.15%',
      notes: 'Must occupy 51%+; lowest down payment',
    },
  ];

  examples.forEach((ex, i) => {
    const rowNum = 3 + i;
    const row = ws.getRow(rowNum);
    row.values = [
      ex.lender,
      ex.contact,
      ex.term,
      ex.rate,
      ex.prepayment,
      ex.costs,
      ex.ltv,
      ex.recourse,
      ex.reserves,
      ex.fees,
      ex.notes,
    ];
    row.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF9E9E9E' } };
      cell.alignment = { vertical: 'top', wrapText: true };
    });
    row.height = 40;
  });

  // ── Blank rows for user input ──
  for (let i = 0; i < 7; i++) {
    const rowNum = 6 + i;
    const row = ws.getRow(rowNum);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber <= 11) {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        };
      }
    });
    // Force light grid on empty rows
    for (let c = 1; c <= 11; c++) {
      const cell = ws.getCell(rowNum, c);
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFF5F5F5' } },
      };
    }
    row.height = 28;
  }

  // ── Footer / instructions ──
  const instrRow = ws.getRow(14);
  ws.mergeCells('A14:K14');
  const instrCell = ws.getCell('A14');
  instrCell.value =
    'Instructions: Replace example rows with your actual lender quotes. Use this to compare offers side-by-side before making a decision. See the K2 Financing Success Kit for detailed guidance.';
  instrCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF757575' } };
  instrCell.alignment = { wrapText: true };

  /* ─────────────────────────────────────────────────────────────── */
  /*  Sheet 2: Quick Reference                                       */
  /* ─────────────────────────────────────────────────────────────── */
  const ref = wb.addWorksheet('Quick Reference');

  ref.mergeCells('A1:B1');
  const refTitle = ref.getCell('A1');
  refTitle.value = 'Key Formulas & Benchmarks';
  refTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1B5E20' } };
  refTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
  ref.getRow(1).height = 30;

  const refHeaders = ref.getRow(2);
  refHeaders.values = ['Metric', 'Formula / Benchmark'];
  refHeaders.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };
  });

  ref.getColumn(1).width = 28;
  ref.getColumn(2).width = 50;

  const formulas = [
    ['DSCR', 'NOI ÷ Annual Debt Service (target ≥ 1.25x)'],
    ['NOI', 'Gross Income − Vacancy − Operating Expenses'],
    ['Cap Rate', 'NOI ÷ Property Value'],
    ['LTV', 'Loan Amount ÷ Appraised Value × 100 (target ≤ 75%)'],
    ['Debt Yield', 'NOI ÷ Loan Amount × 100 (target ≥ 8%)'],
    ['Cash-on-Cash Return', 'Annual Cash Flow ÷ Total Cash Invested × 100'],
    ['Break-Even Ratio', '(Debt Service + OpEx) ÷ Gross Income × 100 (target ≤ 85%)'],
    ['Operating Expense Ratio', 'OpEx ÷ Gross Operating Income × 100'],
  ];

  formulas.forEach(([metric, formula], i) => {
    const row = ref.getRow(3 + i);
    row.values = [metric, formula];
    row.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle' };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } } };
    });
  });

  /* ─────────────────────────────────────────────────────────────── */
  /*  Save                                                            */
  /* ─────────────────────────────────────────────────────────────── */
  const outPath = path.join(__dirname, '..', 'public', 'assets', 'K2_Loan_Comparison_Spreadsheet.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log(`✅  Spreadsheet generated: ${outPath}`);
}

generate().catch((err) => {
  console.error('Failed to generate spreadsheet:', err);
  process.exit(1);
});
