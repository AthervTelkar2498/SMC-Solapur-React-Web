# Excel File Format for Solapur Municipal Corporation

This document describes the expected format for Excel files to be uploaded to the Work Management System.

## Required Columns

The Excel file must contain the following columns in order:

| Column Index | Column Name | Data Type | Description | Example |
|-------------|-------------|-----------|-------------|---------|
| A (0) | Sr. No. | Integer | Serial number of the proposal | 1, 2, 3... |
| B (1) | Proposal Number | Text | Unique proposal identifier | 1478131, PROP-001 |
| C (2) | Proposal Code | Text | Proposal code identifier | DDMCS-24-ENTRY-112731 |
| D (3) | Transaction Date | Date | Date of transaction | 22-08-2025, 10-09-2025 |
| E (4) | Service Name | Text | Name/type of service | Building Permission (Revised accommodation and Thomas Tit Cit |
| F (5) | Owner Name | Text | Name of the proposal owner | PARAM PRASAD CHARITABALE SOCIETY FOR |
| G (6) | Site Address | Text | Address of the site | S NO. 8/2 , SALGARWADI SOLAPUR |
| H (7) | Pending By | Text | Person/authority with pending action | SACHIN OMBASE, MANISH BHISHNURKAR |
| I (8) | Designation | Text | Designation of pending authority | Municipal Commissioner, Deputy Director Of Town Planner |
| J (9) | Application Received Date | Date | Date when application was received | 16-12-2024, 04-12-2024 |

## Sample Excel Data

### Municipal Commissioner Sir
| Sr No. | Proposal Number | Proposal Code | Transaction Date | Service Name | Owner Name | Site Address | Pending By | Designation | Application Received Date | Days |
|--------|----------------|---------------|------------------|--------------|------------|-------------|------------|-------------|--------------------------|------|
| 1 | 1478131 | DDMCS-24-ENTRY-112731 | 22-08-2025 | Building Permission (Revised accommodation and Thomas Tit Cit | PARAM PRASAD CHARITABALE SOCIETY FOR | S NO. 8/2 , SALGARWADI SOLAPUR | SACHIN OMBASE | Municipal Commissioner | 16-12-2024 | 4 |

### Deputy Director Of Town Planner Sir
| Sr No. | Proposal Number | Proposal Code | Transaction Date | Service Name | Owner Name | Site Address | Pending By | Designation | Application Received Date | Days |
|--------|----------------|---------------|------------------|--------------|------------|-------------|------------|-------------|--------------------------|------|
| 1 | 1475343 | DDMCS-24-39011 | 10-09-2025 | Building Permission | Chinmay Parale | C.S.NO. 1608/13 AT CIVILLINE SOLAPUR | MANISH BHISHNURKAR | Deputy Director Of Town Planner | 04-12-2024 | 15 |
| 2 | 1543787 | DDMCS-25-93232 | 23-09-2025 | Building Permission | KULSACHIV SOLAPUR VIDYAPITH SOLAPUR;ATUL TANAJI LAKDE | GAT NO 37 KEGAON UTTAR | MANISH BHISHNURKAR | Deputy Director Of Town Planner | 29-08-2025 | 3 |

## File Requirements

### Format
- **Supported formats**: .xlsx, .xls
- **Maximum file size**: 10 MB
- **Encoding**: UTF-8 recommended

### Data Guidelines
1. **Headers**: First row should contain column headers (optional, system will skip)
2. **Empty rows**: Empty rows will be automatically skipped
3. **Date format**: DD-MM-YYYY or DD/MM/YYYY
4. **Text encoding**: Use UTF-8 for special characters
5. **Numbers**: Integer values for Sr. No. and Days

### Status Calculation
The system will automatically calculate:
- **Days Pending**: Calculated from Application Received Date to current date
- **Status**: 
  - `completed`: Days ≤ 30
  - `pending`: Days 31-60
  - `overdue`: Days > 60

## Upload Process

1. **File Selection**: Choose your Excel file using the upload interface
2. **Validation**: System validates file format and structure
3. **Processing**: Data is parsed and validated row by row
4. **Import**: Valid records are imported into the database
5. **Report**: Upload summary with success/error counts

## Error Handling

Common errors and solutions:

### File Format Errors
- **Invalid file type**: Only .xlsx and .xls files are accepted
- **File too large**: Reduce file size to under 10MB
- **Corrupted file**: Re-save the Excel file and try again

### Data Validation Errors
- **Invalid date format**: Use DD-MM-YYYY or DD/MM/YYYY format
- **Missing required data**: Ensure all important fields have values
- **Duplicate entries**: System will import duplicates but track them by batch

### Performance Tips
- **Large files**: For files with 1000+ rows, upload during off-peak hours
- **Multiple sheets**: Only the first sheet will be processed
- **Formula cells**: Convert formulas to values before uploading

## Batch Tracking

Each upload is assigned a unique batch ID for tracking:
- Format: `batch_TIMESTAMP`
- Example: `batch_1703581200000`
- Used for grouping and managing uploaded data

## Example Upload Flow

1. Prepare Excel file with proper column structure
2. Navigate to "Upload Excel" in the admin panel
3. Click "Upload Excel" button
4. Select your file from the file browser
5. Wait for processing to complete
6. Review the upload summary
7. Check the dashboard for updated statistics

For technical support, contact the system administrator.