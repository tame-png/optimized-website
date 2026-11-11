# /// script
# requires-python = ">=3.10,<3.15"
# dependencies = ["marimo-studio==0.3.0"]
#
# [tool.marimo-studio]
# default = "explainer"
#
# [tool.marimo-studio.cells]
# cell-3 = {ref = "cell:v1:a91d30dc35079419482d167c213ca16c7faa852b4f92e81f267e14c8fb48dbd0:a91d30dc35079419482d167c213ca16c7faa852b4f92e81f267e14c8fb48dbd0:0"}
# cell-5 = {ref = "cell:v1:644b7bdfdb5fd0fde378eab62f1ac7fc2e16e4793ced5f0e4d0a31e6fe5cba69:644b7bdfdb5fd0fde378eab62f1ac7fc2e16e4793ced5f0e4d0a31e6fe5cba69:0"}
# cell-6 = {ref = "cell:v1:c8a313b40d1034702c5c7a03cdbcc1fd8b1d1884e7ed58bb32596d0c8ca3cabd:8f53ae592d8abaf8950c88fdc06c931f63ed0ad07d1a7dabd44e0ecb4042d77c:0"}
# ///

import marimo

__generated_with = "0.25.1"
app = marimo.App(width="medium", app_title="I-94 traffic explorer")


@app.cell
def _():
    import marimo as mo
    import polars as pl
    import altair as alt

    return alt, mo, pl


@app.cell
def _(mo, pl):
    i94_path = str(mo.notebook_location() / "public" / "Metro_Interstate_Traffic_Volume.csv")
    i94_raw = (
        pl.read_csv(i94_path, try_parse_dates=True)
        .select(["date_time", "weather_main", "traffic_volume"])
        .with_columns(
            hour=pl.col("date_time").dt.hour(),
            is_weekend=pl.col("date_time").dt.weekday() >= 6,
        )
    )
    return (i94_raw,)


@app.cell(hide_code=True)
def _(mo):
    i94_day_type = mo.ui.radio(
        options=["Weekday", "Weekend"], value="Weekday", label="day type", inline=True
    )
    i94_window = mo.ui.radio(
        options=["Morning 6–9", "Midday 10–15", "Evening 16–19", "Night 20–5"],
        value="Morning 6–9",
        label="hours of the day",
        inline=True,
    )
    i94_weather = mo.ui.radio(
        options=["Any", "Clear", "Rain or snow"], value="Any", label="weather", inline=True
    )
    mo.vstack([i94_day_type, i94_window, i94_weather])
    return i94_day_type, i94_weather, i94_window


@app.cell
def _(i94_day_type, i94_raw, i94_weather, i94_window, pl):
    _windows = {
        "Morning 6–9": (6, 9),
        "Midday 10–15": (10, 15),
        "Evening 16–19": (16, 19),
        "Night 20–5": (20, 5),
    }
    _first, _last = _windows[i94_window.value]
    _weekend = i94_day_type.value == "Weekend"
    _same_day = i94_raw.filter(pl.col("is_weekend") == _weekend)
    if i94_weather.value == "Clear":
        _picked = _same_day.filter(pl.col("weather_main") == "Clear")
    elif i94_weather.value == "Rain or snow":
        _picked = _same_day.filter(
            pl.col("weather_main").is_in(["Rain", "Drizzle", "Snow", "Thunderstorm"])
        )
    else:
        _picked = _same_day

    _by_hour = (
        _picked.group_by("hour")
        .agg(vehicles=pl.col("traffic_volume").mean(), records=pl.len())
        .sort("hour")
    )
    _all_hours = pl.DataFrame({"hour": list(range(24))})
    i94_hourly = _all_hours.join(_by_hour, on="hour", how="left").with_columns(
        series=pl.lit("Selected")
    )
    i94_reference = (
        _all_hours.join(
            _same_day.group_by("hour").agg(vehicles=pl.col("traffic_volume").mean()),
            on="hour",
            how="left",
        )
        .with_columns(series=pl.lit("All weather"))
    )

    if _first <= _last:
        _in_window = pl.col("hour").is_between(_first, _last)
        i94_band = pl.DataFrame({"start": [_first - 0.5], "end": [_last + 0.5]})
    else:
        _in_window = (pl.col("hour") >= _first) | (pl.col("hour") <= _last)
        i94_band = pl.DataFrame({"start": [-0.5, _first - 0.5], "end": [_last + 0.5, 23.5]})

    _window_rows = _picked.filter(_in_window)
    _peak = i94_hourly.drop_nulls("vehicles").sort("vehicles", descending=True)
    if _window_rows.height and _peak.height:
        _window_mean = float(_window_rows["traffic_volume"].mean())
        _peak_mean = float(_peak["vehicles"][0])
        i94_numbers = {
            "mean": round(_window_mean),
            "share": round(100 * _window_mean / _peak_mean),
            "peak_hour": int(_peak["hour"][0]),
            "records": _window_rows.height,
            "window": i94_window.value,
            "day_type": i94_day_type.value,
            "weather": i94_weather.value,
        }
    else:
        i94_numbers = {
            "mean": None,
            "share": None,
            "peak_hour": None,
            "records": 0,
            "window": i94_window.value,
            "day_type": i94_day_type.value,
            "weather": i94_weather.value,
        }
    return i94_band, i94_hourly, i94_numbers, i94_reference


@app.cell(hide_code=True)
def _(alt, i94_band, i94_hourly, i94_numbers, i94_reference, pl):
    _weather_label = {"Any": "any weather", "Clear": "clear sky", "Rain or snow": "rain or snow"}
    _lines = pl.concat(
        [
            i94_hourly.select(["hour", "vehicles", "series"]),
            i94_reference.select(["hour", "vehicles", "series"]),
        ]
    )
    _band = (
        alt.Chart(i94_band)
        .mark_rect(color="#d4a017", opacity=0.22)
        .encode(x=alt.X("start:Q"), x2="end:Q")
    )
    _line = (
        alt.Chart(_lines)
        .mark_line(point=alt.OverlayMarkDef(size=36), strokeWidth=2.5)
        .encode(
            x=alt.X(
                "hour:Q",
                title="hour of the day (24-hour clock)",
                scale=alt.Scale(domain=[-0.5, 23.5], nice=False),
                axis=alt.Axis(values=list(range(0, 24, 3))),
            ),
            y=alt.Y("vehicles:Q", title="mean vehicles per hour", scale=alt.Scale(domain=[0, 6500])),
            color=alt.Color(
                "series:N",
                title=None,
                scale=alt.Scale(range=["#8a8a8a", "#1f6fa5"], domain=["All weather", "Selected"]),
                legend=alt.Legend(orient="top"),
            ),
            strokeDash=alt.condition(
                alt.datum.series == "All weather", alt.value([5, 4]), alt.value([1, 0])
            ),
            tooltip=[
                alt.Tooltip("hour:Q", title="hour"),
                alt.Tooltip("series:N", title="series"),
                alt.Tooltip("vehicles:Q", title="vehicles per hour", format=",.0f"),
            ],
        )
    )
    alt.layer(_band, _line).properties(
        width=520,
        height=300,
        title=f"{i94_numbers['day_type']}s, {_weather_label[i94_numbers['weather']]}: shaded hours are {i94_numbers['window']}",
    ).configure(background="transparent").configure_axis(
        labelColor="#8a8a8a", titleColor="#8a8a8a", domainColor="#8a8a8a", gridColor="#8a8a8a", gridOpacity=0.25
    ).configure_title(color="#8a8a8a", fontWeight="normal", anchor="start").configure_legend(
        labelColor="#8a8a8a"
    ).configure_view(stroke=None)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    **What to notice.** On weekdays the road has two daily peaks, one in the morning commute and one in the evening, with a dip between them. Weekends have a single broad hump and a lower top. Switch the weather filter and the line barely moves away from the dashed all-weather line: once the hour of the day is fixed, weather explains little of the traffic. Time of day and day type do almost all the work.
    """)
    return


if __name__ == "__main__":
    app.run()
