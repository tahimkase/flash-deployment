# Libraries
import pandas as pd # data manipulation and analysis
import os # interacting with the os




# This function calculates the total expenses and the remaining budget
def calculate_budget(income, expenses):
    total_expenses = sum(amount for _, amount in expenses)  
    # Calculate remaining budget
    remaining_budget = income - total_expenses
    # Return the result
    return total_expenses, remaining_budget





# This function will export to excel, which takes four parameters
def export_to_excel(income, expenses, total_expenses, remaining_budget):

    # Create a data dictionary
    data = {
        "Type": ["Income"] + [expense[0] for expense in expenses] + ["Total Expenses", "Remaining Budget"],
        "Amount": [income] + [expense[1] for expense in expenses] + [total_expenses, remaining_budget]
    }
   
    # Convert dictionary to dataframe
    df = pd.DataFrame(data)

    # File path
    file_path = "budget_report.xlsx"

    # prints the first few rows of the DataFrame to the console. 
    print(df.head())

    # The index=False parameter is used to prevent pandas from writing 
    # row numbers (index) into the Excel file, resulting in a cleaner report.
    df.to_excel(file_path, index=False)

    # Return absolute file path
    return os.path.abspath(file_path)





# main function
def main():

    # calling functions
    total_expenses, remaining_budget = calculate_budget()
    export_to_excel(total_expenses, remaining_budget)


if __name__ == "__main__":
    main()