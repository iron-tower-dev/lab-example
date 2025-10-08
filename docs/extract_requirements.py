#!/usr/bin/env python3
"""
Extract requirements from Excel file by parsing the XML structure
"""
import xml.etree.ElementTree as ET
import re
import sys

def clean_html_text(text):
    """Clean HTML entities and tags from text"""
    if not text:
        return ""
    
    # Decode HTML entities
    text = text.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
    text = text.replace('&quot;', '"').replace('&#39;', "'")
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def extract_shared_strings(shared_strings_file):
    """Extract shared strings from Excel XML"""
    strings = []
    try:
        tree = ET.parse(shared_strings_file)
        root = tree.getroot()
        
        # Excel uses namespace
        ns = {'ss': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        
        for si in root.findall('.//ss:si', ns):
            text_elements = si.findall('.//ss:t', ns)
            if text_elements:
                # Concatenate all text elements in this string item
                full_text = ''.join([elem.text or '' for elem in text_elements])
                strings.append(clean_html_text(full_text))
            else:
                strings.append('')
        
        return strings
    except Exception as e:
        print(f"Error parsing shared strings: {e}")
        return []

def extract_worksheet_data(worksheet_file, shared_strings):
    """Extract worksheet data from Excel XML"""
    data = []
    try:
        tree = ET.parse(worksheet_file)
        root = tree.getroot()
        
        # Excel uses namespace
        ns = {'ss': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        
        for row in root.findall('.//ss:row', ns):
            row_data = []
            for cell in row.findall('.//ss:c', ns):
                value_elem = cell.find('.//ss:v', ns)
                if value_elem is not None:
                    cell_type = cell.get('t', '')
                    value = value_elem.text or ''
                    
                    # If it's a shared string, get the actual text
                    if cell_type == 's' and value.isdigit():
                        idx = int(value)
                        if 0 <= idx < len(shared_strings):
                            row_data.append(shared_strings[idx])
                        else:
                            row_data.append('')
                    else:
                        row_data.append(value)
                else:
                    row_data.append('')
            
            if row_data:  # Only add non-empty rows
                data.append(row_data)
        
        return data
    except Exception as e:
        print(f"Error parsing worksheet: {e}")
        return []

def main():
    # File paths
    shared_strings_file = 'temp_excel/xl/sharedStrings.xml'
    worksheet_file = 'temp_excel/xl/worksheets/sheet1.xml'
    
    print("Extracting requirements from Excel file...")
    
    # Extract shared strings
    print("Reading shared strings...")
    shared_strings = extract_shared_strings(shared_strings_file)
    print(f"Found {len(shared_strings)} shared strings")
    
    # Extract worksheet data
    print("Reading worksheet data...")
    worksheet_data = extract_worksheet_data(worksheet_file, shared_strings)
    print(f"Found {len(worksheet_data)} rows")
    
    # Process and display the data
    print("\n" + "="*80)
    print("REQUIREMENTS EXTRACTED FROM EXCEL FILE")
    print("="*80)
    
    for i, row in enumerate(worksheet_data):
        if i == 0:
            print("\nHEADERS:")
            print("-" * 40)
            for j, cell in enumerate(row):
                print(f"Column {j+1}: {cell}")
            print("\nDATA:")
            print("-" * 40)
        else:
            print(f"\nRow {i}:")
            for j, cell in enumerate(row):
                if cell.strip():  # Only show non-empty cells
                    print(f"  {cell}")
    
    # Save to text file
    output_file = 'extracted_requirements.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("REQUIREMENTS EXTRACTED FROM EXCEL FILE\n")
        f.write("="*80 + "\n\n")
        
        for i, row in enumerate(worksheet_data):
            if i == 0:
                f.write("HEADERS:\n")
                f.write("-" * 40 + "\n")
                for j, cell in enumerate(row):
                    f.write(f"Column {j+1}: {cell}\n")
                f.write("\nDATA:\n")
                f.write("-" * 40 + "\n")
            else:
                f.write(f"\nRow {i}:\n")
                for j, cell in enumerate(row):
                    if cell.strip():
                        f.write(f"  {cell}\n")
    
    print(f"\nRequirements saved to: {output_file}")

if __name__ == "__main__":
    main()
