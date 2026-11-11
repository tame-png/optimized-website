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
    # Profitable App Profiles for the App Store and Google Play Markets
    Android and iOS mobile apps, and our job is to make data-driven decisions with respect to the kind of apps built.
    ## Opening and Exploring the Data
    As of September 2018, there were approximately 2 million iOS apps available on the App Store, and 2.1 million Android apps on Google Play.
    Collecting data for over four million apps requires a significant amount of time and money, so we'll try to analyze a sample of data instead. To avoid spending resources on collecting new data ourselves, we should first try to see whether we can find any relevant existing data at no cost.
    ## Data Sets:
    * A data set containing data about approximately ten thousand Android apps from Google Play. https://www.kaggle.com/datasets/lava18/google-play-store-apps
    * A data set containing data about approximately seven thousand iOS apps from the App Store. https://www.kaggle.com/datasets/ramamet4/app-store-apple-data-set-10k-apps
    """)
    return


@app.cell
def _(mo):
    from csv import reader
    
    path_g = str(mo.notebook_location() / "public" / "googleplaystore.csv")
    try:
        from pyodide.http import open_url
        lines_g = open_url(path_g).readlines()
    except ImportError:
        if path_g.startswith("http"):
            import urllib.request
            lines_g = urllib.request.urlopen(path_g).read().decode('utf8').splitlines()
        else:
            with open(path_g, encoding="utf8") as f:
                lines_g = f.readlines()
                
    read_file_g = reader(lines_g)
    android = list(read_file_g)
    android_header = android[0]
    android = android[1:]

    path_a = str(mo.notebook_location() / "public" / "AppleStore.csv")
    try:
        from pyodide.http import open_url
        lines_a = open_url(path_a).readlines()
    except ImportError:
        if path_a.startswith("http"):
            import urllib.request
            lines_a = urllib.request.urlopen(path_a).read().decode('utf8').splitlines()
        else:
            with open(path_a, encoding="utf8") as f:
                lines_a = f.readlines()
                
    read_file_a = reader(lines_a)
    ios = list(read_file_a)
    ios_header = ios[0]
    ios = ios[1:]
    
    return android, android_header, ios, ios_header


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## data cleaning:
    * removing incomplete row
    """)
    return


@app.cell
def _(android, android_header):
    print(android[10472])  # incorrect row
    print('\n')
    print(android_header)  # header
    print('\n')

    #del android[10472] #remove it from data set
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    * inaccurate data/deleting duplicate data
    """)
    return


@app.cell
def _(android):
    unique_app = []
    duplicate_apps = []
    for _app in android:
        if _app[0] in unique_app:
            duplicate_apps.append(_app[0])
        else:
            unique_app.append(_app[0])
    print(len(unique_app))
    print(len(duplicate_apps))
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Removing duplicates data
    """)
    return


@app.cell
def _(android, android_header):
    print(android[2604])  # incorrect row
    print('\n')
    print(android_header)  # header
    print('\n')
    print(len(android_header))
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    We are expecting 9659 apps after we subtract the duplicates to the length of the list
    """)
    return


@app.cell
def _(android):
    unique_app_dic = {}
    test_app = ['Facebook', 'SOCIAL', '4.6', '66577313', 'Varies with device', '1,000,000,000+', 'Free', '0', 'Teen', 'Social', 'July 31, 2018', 'Varies with device', 'Varies with device']
    test_header = ['App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver']
    for _app in android:
        if _app[0] in unique_app_dic:
            comparison_dic = float(unique_app_dic[_app[0]][2])
            comparison_i = float(_app[3])
            if len(_app) == 13 and comparison_dic < comparison_i:
                updated_values = []
                for i in range(1, 13):
                    updated_values.append(_app[i])
                unique_app_dic[_app[0]] = updated_values
        elif _app[0] not in unique_app_dic and len(_app) == 13:
            updated_values = []
            for i in range(1, 13):
                updated_values.append(_app[i])
            unique_app_dic[_app[0]] = updated_values
    print(len(unique_app_dic))
    return (unique_app_dic,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ^ we removed the duplicates as well as only leaving the apps with the highest number of reviews within the dictionary
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Isolating the Free Apps
    As we only want to analyze data from applications that are free to the user
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Android Free Apps Only

    In this Code we have removed all the paid apps from our original `unique_dicitoniary_dic` and created a new dic with only free apps in `android_free_app_dic` removing 755 paid apps
    """)
    return


@app.cell
def _(unique_app_dic):
    android_free_app_dic ={}

    for key in unique_app_dic:
        price = unique_app_dic[key][5]
        if price == 'Free':
            if key not in android_free_app_dic:
                android_free_app_dic[key] = []
            android_free_app_dic[key].extend(unique_app_dic[key])
    print(len(android_free_app_dic))
    return (android_free_app_dic,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ### IOS Free Apps Only
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    In this code we did the same thing as what we did with the android data with the only difference is the nested if/else statements have conditionals making sure that there is no incomplete data or duplicated data. If there is an instance of duplicate apps, we only load the data of the app which has the highest amount of rating count
    """)
    return


@app.cell
def _(ios, ios_header):
    print(ios_header)
    IOS_free_app_dic = {}
    for _app in ios:
        ios_price = float(_app[4])
        ios_name = _app[1]
        rating_count_tot = int(_app[5])
        desired_info = _app[2:]
        track_id = _app[0]
        if ios_price == 0.0 and len(_app) == 16:
            if ios_name in IOS_free_app_dic:
                if int(IOS_free_app_dic[ios_name][4]) < rating_count_tot:
                    desired_info.insert(0, track_id)
                    ios_updated_values = desired_info
                    IOS_free_app_dic[ios_name] = ios_updated_values
            else:
                desired_info.insert(0, track_id)
                IOS_free_app_dic[ios_name] = desired_info
    print(len(IOS_free_app_dic))
    return (IOS_free_app_dic,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Most Common Apps by Genre:
    In order to identify which apps would potentially be the most successful, we are going to look through popular genres and their ratings to see which genre would give us the highest chance of developing a successful app
    """)
    return


@app.cell
def _():
    def freq_table(dataset, index):
        freq_t = {}
        for key in dataset:
            value = dataset[key][index]
            if value not in freq_t:
                freq_t[value] = 1
            else:
                freq_t[value] += 1
        total_sum = sum(freq_t.values())
        for key in freq_t:
            freq_t[key] = (freq_t[key] / total_sum) * 100
        return freq_t


    def display_table(dataset, index):
        table = freq_table(dataset, index)
        table_display = []
        for key in table:
            key_val_as_tuple = (table[key], key)
            table_display.append(key_val_as_tuple)

        table_sorted = sorted(table_display, reverse=True)
        for entry in table_sorted:
            print(entry[1], ':', entry[0])

    return (display_table,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    Here we used the display table to show the percentage of frequent genres for both IOS and Android stores
    """)
    return


@app.cell
def _(android_free_app_dic, display_table):
    android_genre = display_table(android_free_app_dic,8)
    return


@app.cell
def _(IOS_free_app_dic, display_table):
    IOS_genre = display_table(IOS_free_app_dic,10)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Takeaways
    From here we can tell that if we were to attempt to create a app that is succesfull based off their genres it would be games and tools for the IOS stores, and Google Play store respectively
    """)
    return


if __name__ == "__main__":
    app.run()
