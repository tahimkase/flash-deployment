from flask import Flask, request, send_file, render_template
import io
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch  # Importing inch for measurements

app = Flask(__name__)

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling the form submission
@app.route('/calculate', methods=['POST'])
def calculate():
    # Determine which button was clicked based on the 'action' value
    action = request.form.get('action')
    
    # Get the user's income from the form
    income = float(request.form.get('income', 0))
    
    # Get the lists of expense types and amounts from the form
    expense_types = request.form.getlist('expense_type[]')
    expense_amounts = request.form.getlist('expense_amount[]')
    
    # Combine the expense types and amounts into a list of dictionaries
    expenses = [{'type': t, 'amount': float(a)} for t, a in zip(expense_types, expense_amounts)]
    
    # Check which action to take based on the button clicked
    if action == 'export_excel':
        # If "Export to Excel" was clicked, generate an Excel file
        output = io.BytesIO()
        generate_excel_report(output, income, expenses)
        output.seek(0)
        return send_file(output, download_name="budget_report.xlsx", as_attachment=True)
    
    elif action == 'generate_pdf':
        # If "Generate PDF Report" was clicked, generate a PDF file
        output = io.BytesIO()
        generate_pdf_report(output, income, expenses)
        output.seek(0)
        return send_file(output, download_name="budget_report.pdf", as_attachment=True)

# Function to generate the Excel report
def generate_excel_report(output, income, expenses):
    # Create a DataFrame from the expenses list
    df = pd.DataFrame(expenses)
    
    # Calculate total expenses and remaining budget
    total_expenses = sum(expense['amount'] for expense in expenses)
    remaining_budget = income - total_expenses

    # Create a Pandas Excel writer using XlsxWriter as the engine
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        # Write the expenses DataFrame to the Excel file
        df.to_excel(writer, sheet_name='Expenses', index=False)
        
        # Access the XlsxWriter workbook and worksheet objects
        workbook = writer.book
        worksheet = writer.sheets['Expenses']
        
        # Write summary data below the expenses table
        summary_row = len(df) + 2
        worksheet.write(summary_row, 0, 'Income')
        worksheet.write(summary_row, 1, income)
        worksheet.write(summary_row + 1, 0, 'Total Expenses')
        worksheet.write(summary_row + 1, 1, total_expenses)
        worksheet.write(summary_row + 2, 0, 'Remaining Budget')
        worksheet.write(summary_row + 2, 1, remaining_budget)

# Function to generate the PDF report
def generate_pdf_report(output, income, expenses):
    # Create a PDF document
    doc = SimpleDocTemplate(output, pagesize=letter)
    elements = []
    
    # Get styles for the PDF
    styles = getSampleStyleSheet()
    
    # Add a title to the PDF
    title = Paragraph("Budget Report", styles['Title'])
    elements.append(title)
    
    # Prepare summary data for the PDF
    summary_data = [
        ["Income", income],
        ["Total Expenses", sum(expense['amount'] for expense in expenses)],
        ["Remaining Budget", income - sum(expense['amount'] for expense in expenses)]
    ]
    
    # Create a table for the summary data
    summary_table = Table(summary_data, colWidths=[3 * inch, 2 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#CCCCCC'),
        ('TEXTCOLOR', (0, 0), (-1, 0), '#000000'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), '#FFFFFF'),
    ]))
    elements.append(summary_table)
    
    # Add some space between tables
    elements.append(Paragraph(" ", styles['Normal']))
    
    # Prepare expenses data for the PDF
    expenses_data = [["Expense Type", "Amount"]]
    for expense in expenses:
        expenses_data.append([expense['type'], expense['amount']])
    
    # Create a table for the expenses data
    expenses_table = Table(expenses_data, colWidths=[3 * inch, 2 * inch])
    expenses_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#CCCCCC'),
        ('TEXTCOLOR', (0, 0), (-1, 0), '#000000'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), '#FFFFFF'),
    ]))
    elements.append(expenses_table)
    
    # Build the PDF document
    doc.build(elements)


@app.route('/about')
def about():
    return render_template('about.html')



