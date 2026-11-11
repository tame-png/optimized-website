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
    # Indicators of Heavy Traffic on I-94
    In this project, we're going to analyze a dataset about the westbound traffic on the [I-94 Interstate highway](https://en.wikipedia.org/wiki/Interstate_94).
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The goal of our analysis is to determine a few indicators of heavy traffic on I-94. These indicators can be weather type, time of the day, time of the week, etc.
    ***
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # The I-94 Traffic Dataset
    John Hogue made the dataset available that we'll be working with, and you can download it from the [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/492/metro+interstate+traffic+volume).
    ***
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Variables Table
    | Variable Name       | Role    | Type        | Description                                                      | Units  | Missing Values |
    |:--------------------|:--------|:------------|:-----------------------------------------------------------------|:-------|:---------------|
    | holiday             | Feature | Categorical | US National holidays plus regional holiday, Minnesota State Fair |        | no             |
    | temp                | Feature | Continuous  | Average temp in kelvin                                           | Kelvin | no             |
    | rain_1h             | Feature | Continuous  | Amount in mm of rain that occurred in the hour                   | mm     | no             |
    | snow_1h             | Feature | Continuous  | Amount in mm of snow that occurred in the hour                   | mm     | no             |
    | clouds_all          | Feature | Integer     | Percentage of cloud cover                                        | %      | no             |
    | weather_main        | Feature | Categorical | Short textual description of the current weather                 |        | no             |
    | weather_description | Feature | Categorical | Longer textual description of the current weather                |        | no             |
    | date_time           | Feature | Date        | Hour of the data collected in local CST time                     |        | no             |
    | traffic_volume      | Target  | Integer     | Hourly I-94 ATR 301 reported westbound traffic volume            |        | no             |
    ***
    """)
    return


@app.cell
def _(mo):
    import pandas as pd

    path = str(mo.notebook_location() / "public" / "Metro_Interstate_Traffic_Volume.csv")
    try:
        from pyodide.http import open_url
        i_94 = pd.read_csv(open_url(path))
    except ImportError:
        i_94 = pd.read_csv(path)
        
    return i_94, pd


@app.cell
def _(i_94):
    i_94.info()
    i_94.head()
    return


@app.cell
def _(i_94):
    import matplotlib.pyplot as plt
    # '%matplotlib inline' command supported automatically in marimo

    i_94.traffic_volume.plot.hist(title = "distribution of traffic volume", xlabel= "Traffic Volume (cars per hour)",)
    plt.gca()
    return (plt,)


@app.cell
def _(i_94):
    i_94['traffic_volume'].describe()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The range of hourly traffic volume varied from 0 to 7,280 cars, with an average of 3,260 cars. About 25% of the time, there were only 1,193 cars or fewer passing the station each hour,this probably occurs during the night or when a road is under construction. However, about 25% of the time, the traffic volume was four times as much (4,933 cars or more). This observation gives our analysis an interesting direction: comparing daytime data with nighttime data.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Traffic Volume: Day vs. Night

    We are going to divide the dataset into 2:
    * Daytime Data: hours from 7am to 7pm
    * Nighttime Data: hours from 7pm to 7am
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Twelve hours each as a starting point
    """)
    return


@app.cell
def _(i_94, pd):
    i_94['date_time'] = pd.to_datetime(i_94['date_time'])

    day = i_94.copy()[(i_94['date_time'].dt.hour >= 7) & (i_94['date_time'].dt.hour<19)]
    print(day.shape)

    night = i_94.copy()[(i_94['date_time'].dt.hour >= 19) | (i_94['date_time'].dt.hour<7)]
    print(night.shape)
    return day, night


@app.cell
def _(i_94):
    i_94.iloc[176:178]
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The reason theirs a difference in the number of rows is because there is a discontinuity in the reporting data where on October 10th of 2012 we are missing 2 hours worth of data
    """)
    return


@app.cell
def _(day, night, plt):
    plt.figure(figsize=(12,4))

    plt.subplot(1,2,1)
    day["traffic_volume"].plot.hist(title = 'Daytime traffic volume', xlabel = 'Traffic Volume(cars per hour)', ylabel = 'Frequency')

    plt.subplot(1,2,2)
    night['traffic_volume'].plot.hist(title = 'Nighttime traffic volume',xlabel = 'Traffic Volume(cars per hour)', ylabel = 'Frequency')
    plt.gcf()
    return


@app.cell
def _(day):
    day['traffic_volume'].describe()
    return


@app.cell
def _(night):
    night['traffic_volume'].describe()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    The daytime histogram shows us that the highest frequency of car volume is in the range of 4,000 to 6,000 cars, and has consistent high traffic volumes with at least 4,200 cars passing through 75% of the time (25th percentile). The nighttime histogram shows us the traffic volume remains low, being concentrated on the front of the histogram, while the series describing tell us 75% of the time they theirs at least 530 cars passing through. Since we are concerned about finding the causes of high traffic volume, the focus shall be shifted to the daytime hours.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Time Indicators

    One of the possible indicators of heavy traffic is time. There might be more people on the road in a certain month, on a certain day, or at a certain time of day.
    We're going to look at a few line plots showing how the traffic volume changes according to the following:

    - Month
    - Day of the week
    - Time of day
    """)
    return


@app.cell
def _(day, plt):
    day['month'] = day['date_time'].dt.month
    by_month = day.groupby('month').mean(numeric_only=True)
    by_month['traffic_volume'].plot.line()
    plt.gca()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    From the line graph above we can see that traffic volume by months, that it remains rather high throughout the year with two exceptions. The first being that in the month of July, we see a big dip which eventually recovers in the month of September. The second being that towards the end of the year, the volume of traffic seems to steeply decrease until it recovers in the following January.
    """)
    return


@app.cell
def _(day, plt):
    day['year'] = day['date_time'].dt.year

    only_july = day[day['month'] == 7]

    only_july.groupby('year')['traffic_volume'].mean().plot.line()

    plt.gca()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Upon further investigation, we can see that by looking at the change of traffic for the month of July year over year, that July 2014 we begin a decrease in traffic volume. The lowest traffic volume occurring in July 2016 before rapidly increasing in 2017, to slowly begin to decrease again in 2018.
    """)
    return


@app.cell
def _(day, plt):
    day['dayofweek'] = day['date_time'].dt.dayofweek
    by_dayofweek = day.groupby('dayofweek').mean(numeric_only=True)
    by_dayofweek['traffic_volume'].plot.line() # 0 is Monday, 6 is Sunday
    plt.xticks(range(7), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    plt.xlabel('Day of the Week')
    plt.gca()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    From here we can see that, overall traffic volume is very heavy during the bussines days of the week. During the weekends though the traffic volume drops below 4,800.
    """)
    return


if __name__ == "__main__":
    app.run()
