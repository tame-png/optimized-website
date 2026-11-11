import marimo

__generated_with = "0.25.2"
app = marimo.App()


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Analyzing Used Car Listings on eBay Kleinanzeigen
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    We will be working on a dataset of used cars from *eBay Kleinanzeigen*, a [classifieds](https://en.wikipedia.org/wiki/Classified_advertising) section of the German eBay website.

    The dataset was originally scraped and uploaded to [Kaggle](https://www.kaggle.com/orgesleka/used-cars-database/data).  The version of the dataset we are working with is a sample of 50,000 data points that was prepared by [Dataquest](https://www.dataquest.io) including simulating a less-cleaned version of the data.

    The data dictionary provided with data is as follows:

    - `dateCrawled` - When this ad was first crawled. All field-values are taken from this date.
    - `name` - Name of the car.
    - `seller` - Whether the seller is private or a dealer.
    - `offerType` - The type of listing
    - `price` - The price on the ad to sell the car.
    - `abtest` - Whether the listing is included in an A/B test.
    - `vehicleType` - The vehicle Type.
    - `yearOfRegistration` - The year in which which year the car was first registered.
    - `gearbox` - The transmission type.
    - `powerPS` - The power of the car in PS.
    - `model` - The car model name.
    - `kilometer` - How many kilometers the car has driven.
    - `monthOfRegistration` - The month in which which year the car was first registered.
    - `fuelType` - What type of fuel the car uses.
    - `brand` - The brand of the car.
    - `notRepairedDamage` - If the car has a damage which is not yet repaired.
    - `dateCreated` - The date on which the eBay listing was created.
    - `nrOfPictures` - The number of pictures in the ad.
    - `postalCode` - The postal code for the location of the vehicle.
    - `lastSeenOnline` - When the crawler saw this ad last online.

    The aim of this project is to clean the data and analyze the included used car listings.
    """)
    return


@app.cell
def _():
    import numpy as np
    import pandas as pd

    return (pd,)


@app.cell
def _(mo, pd):
    path = str(mo.notebook_location() / "public" / "autos.csv")
    try:
        from pyodide.http import open_url
        autos = pd.read_csv(open_url(path), encoding="latin1")
    except ImportError:
        autos = pd.read_csv(path, encoding="latin1")
    return (autos,)


@app.cell
def _(autos):
    autos.info()
    autos.head()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Observation:
    * price is a object and may need to be converted to a int/float
    * odomoter must be converted to a int/float to make anaylsis easier
    """)
    return


@app.cell
def _(autos):
    print(autos.columns.values)
    columns_orginal_header = {}
    column_desired_change = {'yearOfRegistration': 'registration_year', 'monthOfRegistration': 'registration_month', 'notRepairedDamage': 'unrepaired_damage', 'dateCreated': 'ad_created'}
    for c in autos.columns.values:
        if c in column_desired_change:
            columns_orginal_header[c] = column_desired_change[c]
        else:
            columns_orginal_header[c] = c
    autos_1 = autos.rename(columns=columns_orginal_header)
    autos_1.head()
    return (autos_1,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Data cleaning:

    Above we have renamed some of the colums for a clearer understanding of the dataframe,
    * `yearOfRegistration` &rarr; `registration_year`
    *  `monthOfRegistration` &rarr; `registration_month`
    * `notRepairedDamage` &rarr;`unrepaired_damage`
    * `dateCreated` &rarr; `ad_created`
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### Initial Data Exploration and Cleaning
    """)
    return


@app.cell
def _(autos_1):
    autos_1.describe()
    return


@app.cell
def _(autos_1):
    autos_1.describe(include='all')
    return


@app.cell
def _(autos_1):
    autos_1.loc[:, 'seller'].value_counts()
    return


@app.cell
def _(autos_1):
    autos_1.loc[:, 'offerType'].value_counts()
    return


@app.cell
def _(autos_1):
    autos_1.loc[:, 'nrOfPictures'].value_counts()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The data pulled for `offerType` and `nrOfPictures` dont seem to be relevant to this analysis since one value is domiant and dont tell much  of a story.

    The `seller` column is also domianted by one value being private seller but I belive it may be relvant to the analysis so I will convert all values to privat
    """)
    return


@app.cell
def _(autos_1):
    autos_1['seller'] = 'privat'
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Cleaning `Price` and `odometer`:
    * We are going to convert price from a obj to a int value by removing the `$` and `,` on all values for the column
    * `odometer` &rarr; `odometer_km` to make it simpler to anaylze be convertin it to a string to int
    """)
    return


@app.cell
def _(autos_1):
    def clean_price(value):
        value = value.strip()
        value = value.replace(',', '')
        value = value.replace('$', '')
        return int(value)
    clean_value = []
    for _value in autos_1.loc[:, 'price']:
        _value = clean_price(_value)
        clean_value.append(_value)
    return (clean_value,)


@app.cell
def _(autos_1, clean_value):
    autos_1['price'] = clean_value

    def clean_odometer(value):
        value = value.strip()
        value = value.replace(',', '')
        value = value.replace('km', '')
        return int(value)
    clean_distance = []
    for _value in autos_1.loc[:, 'odometer']:
        _value = clean_odometer(_value)
        clean_distance.append(_value)
    return (clean_distance,)


@app.cell
def _(autos_1, clean_distance):
    autos_1.rename(columns={'odometer': 'odometer_km'})
    autos_1['odometer_km'] = clean_distance
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Exploring Odometer and Price
    """)
    return


@app.cell
def _(autos_1):
    autos_1['odometer_km'].value_counts()
    return


@app.cell
def _(autos_1):
    print(autos_1['price'].unique().shape)
    print(autos_1['price'].describe())
    autos_1['price'].value_counts().head(20)
    return


@app.cell
def _(autos_1):
    autos_1['price'].value_counts().sort_index(ascending=False).head(20)
    return


@app.cell
def _(autos_1):
    autos_1['price'].value_counts().sort_index(ascending=True).head(20)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## further anaylsis:

    After exploring the `price` column I have noticed that they are many low value price(0) and well as prices that exceed 1 million to further narrow down the extremes of the price values we are only going to include price between 1 and 350,000$
    """)
    return


@app.cell
def _(autos_1):
    autos_2 = autos_1[autos_1['price'].between(1, 351000)]
    autos_2['price'].describe()
    return (autos_2,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Exploring Registration Year:
    """)
    return


@app.cell
def _(autos_2):
    autos_2['registration_year'].describe()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * the min value and max value dont make sense the registration years are eiter to far into the furture or pass
    """)
    return


@app.cell
def _(autos_2):
    autos_3 = autos_2[autos_2['registration_year'].between(1900, 2017)]
    return (autos_3,)


@app.cell
def _(autos_3):
    autos_3['registration_year'].value_counts(normalize=True).head(10)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * It seems that most of the car listings on ebay came from the registrations from 1998 to the 2010s
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Exploring Car Brands:
    """)
    return


@app.cell
def _(autos_3):
    autos_3['brand'].value_counts(normalize=True)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * We only want to analyze brands that have over 5% market sales
    """)
    return


@app.cell
def _(autos_3):
    brand_counts = autos_3['brand'].value_counts(normalize=True)
    top_brands = brand_counts[brand_counts > 0.05].index
    print(top_brands)
    return (top_brands,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * Now that we have a list of brands with over 5%, we are going to find the median price of those large brands
    """)
    return


@app.cell
def _(autos_3, top_brands):
    brand_mean_price = {}
    for _brand in top_brands:
        _brand_only = autos_3[autos_3['brand'] == _brand]
        mean_price = _brand_only['price'].mean()
        brand_mean_price[_brand] = int(mean_price)
    print(brand_mean_price)
    return (brand_mean_price,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * the german brands are have the most expensives median listings
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Exploring the milleage
    """)
    return


@app.cell
def _(brand_mean_price, pd):
    bmp_series = pd.Series(brand_mean_price)
    return (bmp_series,)


@app.cell
def _(bmp_series, pd):
    df = pd.DataFrame(bmp_series, columns=['mean_price'])
    return


@app.cell
def _(autos_3, top_brands):
    brand_mean_milleage = {}
    for _brand in top_brands:
        _brand_only = autos_3[autos_3['brand'] == _brand]
        mean_milleage = _brand_only['odometer_km'].mean()
        brand_mean_milleage[_brand] = int(mean_milleage)
    return (brand_mean_milleage,)


@app.cell
def _(brand_mean_milleage, brand_mean_price, pd):
    mean_milleage_1 = pd.Series(brand_mean_milleage).sort_values(ascending=False)
    mean_price_1 = pd.Series(brand_mean_price).sort_values(ascending=False)
    return mean_milleage_1, mean_price_1


@app.cell
def _(mean_milleage_1, pd):
    brand_info = pd.DataFrame(mean_milleage_1, columns=['mean_mileage'])
    brand_info
    return (brand_info,)


@app.cell
def _(brand_info, mean_price_1):
    brand_info['mean_price'] = mean_price_1
    brand_info
    return


if __name__ == "__main__":
    app.run()
