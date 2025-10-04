# Excel Format Guide - Solapur Municipal Corporation

This document explains the exact Excel format required for uploading proposal data.

## 📋 Required Columns

The Excel file must contain the following columns in this order:

| # | Column Name | Data Type | Example | Required | Description |
|---|------------|-----------|---------|----------|-------------|
| 1 | Sr No. | Number | 1, 2, 3 | Yes | Serial number |
| 2 | Proposal Number | Text | 1478131 | Yes | Unique proposal ID |
| 3 | Proposal Code | Text | DDMCS-24-ENTRY-112731 | Yes | Proposal code |
| 4 | Transaction Date | Date | 22-08-2025 | Yes | Date of transaction |
| 5 | Service Name | Text | Building Permission | Yes | Type of service |
| 6 | Owner Name | Text | PARAM PRASAD CHARITABALE | Yes | Owner/applicant name |
| 7 | Site Address | Text | S NO. 8/2, SALGARWADI SOLAPUR | Yes | Property address |
| 8 | Pending By | Text | SACHIN OMBASE | Yes | Person responsible |
| 9 | Designation | Text | Municipal Commissioner | Yes | Person's designation |
| 10 | Application Received Date | Date | 16-12-2024 | Yes | Date received |
| 11 | Days | Number | 4 | Yes | Days pending |

## 📝 Excel File Requirements

### File Format
- **Supported formats**: `.xlsx`, `.xls`, `.csv`
- **Maximum file size**: 10 MB
- **Encoding**: UTF-8 (for CSV files)

### Sheet Structure
- Multiple sheets are supported in one Excel file
- Each sheet should follow the same column structure
- Sheet names can be used for designation categories (e.g., "Municipal Commissioner", "Deputy Director Of Town Planner")

### Date Format
Dates should be in one of these formats:
- `DD-MM-YYYY` (e.g., 22-08-2025)
- `YYYY-MM-DD` (e.g., 2025-08-22)

### Number Format
- Use plain numbers without formatting
- No currency symbols
- No thousand separators

## 📊 Sample Excel Structure

### Sheet 1: Municipal Commissioner Sir

| Sr No. | Proposal Number | Proposal Code | Transaction Date | Service Name | Owner Name | Site Address | Pending By | Designation | Application Received Date | Days |
|--------|----------------|---------------|------------------|--------------|------------|--------------|------------|-------------|-------------------------|------|
| 1 | 1478131 | DDMCS-24-ENTRY-112731 | 22-08-2025 | Building Permission | PARAM PRASAD | S NO. 8/2 | SACHIN OMBASE | Municipal Commissioner | 16-12-2024 | 4 |

### Sheet 2: Deputy Director Of Town Planner Sir

| Sr No. | Proposal Number | Proposal Code | Transaction Date | Service Name | Owner Name | Site Address | Pending By | Designation | Application Received Date | Days |
|--------|----------------|---------------|------------------|--------------|------------|--------------|------------|-------------|-------------------------|------|
| 1 | 1475343 | DDMCS-24-39011 | 10-09-2025 | Building Permission | Chinmay Parale | C.S.NO. 1608/13 | MANISH BHISHNURKAR | Deputy Director Of Town Planner | 04-12-2024 | 15 |

## ✅ Data Validation Rules

### Mandatory Fields
All columns are mandatory. Empty cells will cause upload errors.

### Data Types
- **Numbers**: Must be valid integers
- **Dates**: Must be valid dates
- **Text**: Any text is accepted

### Special Characters
- Avoid special characters in proposal numbers
- Addresses can contain all characters
- Names should use proper case

## 🎯 Status Calculation

The system automatically calculates status based on "Days" column:

| Days Pending | Status | Badge Color |
|-------------|--------|-------------|
| 0 | Completed | Green |
| 1-30 | Pending | Orange |
| 31+ | Overdue | Red |

## 📤 Upload Process

1. **Prepare Excel File**
   - Follow the column structure exactly
   - Check all required fields are filled
   - Verify date formats

2. **Login to System**
   - Use admin credentials
   - Navigate to Dashboard

3. **Upload File**
   - Click "Upload Excel" button
   - Select your Excel file
   - Wait for processing

4. **Verify Upload**
   - Check success message
   - Review data in table
   - Verify statistics updated

## ❌ Common Errors

### Error: "No data found in Excel file"
- **Cause**: Empty sheets or incorrect column headers
- **Solution**: Ensure data starts from row 1 with headers

### Error: "Invalid file type"
- **Cause**: Wrong file format
- **Solution**: Use .xlsx, .xls, or .csv format only

### Error: "File too large"
- **Cause**: File exceeds 10MB
- **Solution**: Split data into multiple files

### Error: "Invalid date format"
- **Cause**: Dates not in DD-MM-YYYY or YYYY-MM-DD format
- **Solution**: Format dates correctly in Excel

## 📥 Download Sample Template

A sample template file is available with the correct structure.

### Creating Template in Excel

1. Open Excel
2. Create column headers as listed above
3. Add sample data row
4. Save as `.xlsx` format

### Example Template

```
Sr No. | Proposal Number | Proposal Code | Transaction Date | ...
   1   |    1478131     | DDMCS-24-...  |   22-08-2025    | ...
```

## 🔄 Multiple Uploads (60-Day Cycle)

The system supports multiple Excel uploads for different time periods:

### Upload Tracking
- Each upload gets a unique batch ID
- Batch ID format: `BATCH-{timestamp}`
- All records tagged with batch ID

### Handling New Data
1. **First Upload** (Day 0-60):
   - Upload Excel with initial data
   - System creates batch #1

2. **Second Upload** (Day 61-120):
   - Upload new Excel with updated data
   - System creates batch #2
   - Previous data remains in database

3. **Ongoing Uploads**:
   - Continue uploading new Excel files
   - Each upload is tracked separately
   - Historical data is preserved

## 💡 Best Practices

1. **Data Accuracy**
   - Double-check all entries before upload
   - Verify dates are correct
   - Ensure names are spelled correctly

2. **File Management**
   - Keep backup of original Excel files
   - Name files with dates (e.g., `proposals_2025_01.xlsx`)
   - Document any changes made

3. **Regular Updates**
   - Upload data every 60 days as scheduled
   - Update status of completed work
   - Add new proposals

4. **Testing**
   - Test with small sample file first
   - Verify data appears correctly
   - Check calculations are accurate

## 📞 Support

For issues with Excel format or uploads:
1. Check this guide first
2. Verify Excel file format
3. Review error messages
4. Contact system administrator

---

**Last Updated**: 2025-10-04
