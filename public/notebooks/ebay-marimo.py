import marimo

__generated_with = "0.23.5"
app = marimo.App()


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    #  Exploring Ebay Car Sales Data

    In this project we will be analyzing a dataset from kaggle that pulled eBay Klenianzeigen advertisements on the sight which could be found:

    Dataset ---> https://www.kaggle.com/datasets/sijovm/used-cars-data-from-ebay-kleinanzeigen
    """)
    return


@app.cell
def _(mo):
    from os import remove

    import pandas as pd
    import numpy as np

    path = str(mo.notebook_location() / "public" / "autos.csv")
    try:
        from pyodide.http import open_url
        autos = pd.read_csv(open_url(path), index_col=0, encoding='latin1')
    except ImportError:
        autos = pd.read_csv(path, index_col=0, encoding='latin1')
        
    return (autos,)


@app.cell
def _(autos):
    autos.info()
    autos.head()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Observations to note:
    1. dataCrawled potentially may need to be seperated
    2. odometer is not an int or float but an object so must be changed
    3. the brand is sometimes included in the name of the car and may need to be separated
    """)
    return


@app.cell
def _(autos):
    autos.columns
    autos_columns_renaming ={}
    bool_auto_columns = {'yearOfRegistration': 'registration_year', 'monthOfRegistration':'registration_month', 'notRepairedDamage': 'unrepaired_damage', 'dateCreated':'ad_created'}
    for c in autos.columns:
        if str(c) in bool_auto_columns:
            autos_columns_renaming[c] = (bool_auto_columns[c])
        else:
            autos_columns_renaming[c] = c
    autos.rename(autos_columns_renaming, axis =1, inplace= True)
    autos.head()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Renaming Column Headers for Clarity

    In this cell, I performed the following steps to rename specific columns in the dataset:

    1. Created a dictionary `bool_auto_columns` with mappings for columns that needed clearer, more descriptive names:
       - `yearOfRegistration` → `registration_year`
       - `monthOfRegistration` → `registration_month`
       - `notRepairedDamage` → `unrepaired_damage`
       - `dateCreated` → `ad_created`

    2. Looped through all existing column names in the dataset

    3. For columns that matched keys in the `bool_auto_columns` dictionary, applied the new name; otherwise, kept the original name

    4. Used the `rename()` method with `inplace=True` to update the DataFrame column names directly

    This renaming makes the column names more readable and follows Python Snakecase
    """)
    return


@app.cell
def _(autos):
    autos.describe(include= 'all')
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Piercing the dataframe:
    * `offerType` has 100% agent as the only advertisements listed
    * `seller` is the only type of sellers on these listings
    * `vehicleType` could be broken down to include a comparison of high capacity vehicles to low capacity ones
    * `price` and `odometers` are both stored as text data and must be converted
    *  create a graph demonstrating the spread of `price`
    """)
    return


@app.cell
def _(autos):
    autos['price'] = autos['price'].str.replace('$','').str.replace(',','')
    autos['price'] = autos['price'].astype(int)

    autos['odometer'] = autos['odometer'].str.replace('km','').str.replace(',','')
    autos['odometer'] = autos['odometer'].astype(int)
    return


@app.cell
def _(autos):
    autos.rename({'odometer':'odometer_km'},axis=1,inplace=True)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Data Cleaning: Converting Price and Odometer to Numeric Values

    In this cell, I cleaned the `price` and `odometer` columns to convert them from text format to numeric values:

    **Price Column:**
    1. Removed dollar signs (`$`) from the price values
    2. Removed commas (`,`) used as a thousand separators
    3. Converted the cleaned string values to integers

    **Odometer Column:**
    1. Removed the 'km' unit suffix from odometer readings
    2. Removed commas (`,`) used as a thousand separators
    3. Converted the cleaned string values to integers
    """)
    return


@app.cell
def _(autos):
    odometer_km_series = autos['odometer_km']
    price_series = autos['price']
    return odometer_km_series, price_series


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Exploring Odometer and Price
    """)
    return


@app.cell
def _(odometer_km_series):
    odometer_km_series.value_counts()
    return


@app.cell
def _(price_series):
    price_series.unique().shape
    price_series.describe()
    return


@app.cell
def _(price_series):
    price_series.value_counts().head(20)
    return


@app.cell
def _(price_series):
    price_series.value_counts().sort_index(ascending=False).head(20)
    return


@app.cell
def _(price_series):
    price_series.value_counts().sort_index(ascending=True).head(20)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    After Diving Deeper into the both price and odometer, there seems to be 1421 listings for 0$ and many above 350,000 dollars; thus I will be removing any data above 350,000 and below 1 so that statical analysis using the aggregate won't give such large numbers such as the one above
    """)
    return


@app.cell
def _(autos):
    autos_1 = autos[autos['price'].between(1, 351000)]
    autos_1['price'].describe()
    return


if __name__ == "__main__":
    app.run()
