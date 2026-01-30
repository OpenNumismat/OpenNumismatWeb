import sqlite3
from flask import Flask, request, send_from_directory
from pathlib import Path


DATA_PATH = 'data'


# Initializing flask app
app = Flask(__name__, static_url_path='/')


@app.route("/api/filelist")
def filelist():
    root = Path(DATA_PATH)
    db_files = root.rglob('*.db')
    return [str(file.relative_to(root)) for file in db_files]


@app.route("/api/coins")
def coins():
    query = request.args.get('f', default='demo.db')
    print(Path(DATA_PATH) / query)
    con = sqlite3.connect(Path(DATA_PATH) / query)
    cur = con.cursor()

    res = cur.execute("""
        SELECT coins.id, NULL, title, status, subjectshort, value, unit, year, mintmark, series, country
        FROM coins
    """)
    coins_data = res.fetchall()
    con.close()

    return coins_data


@app.route("/api/settings")
def settings():
    field_ids = {
        13: 'status',
        75: 'region',
        4: 'country',
        6: 'period',
        74: 'ruler',
        10: 'type',
        11: 'series',
        12: 'subjectshort',
        9: 'issuedate',
        5: 'year',
        25: 'mintage',
        14: 'material',
        7: 'mint',
        8: 'mintmark',
        20: 'grade',
        40: 'paydate',
        41: 'payprice',
        67: 'storage',
        83: 'condition',
        71: 'quantity',
    }

    query = request.args.get('f', default='demo.db')
    con = sqlite3.connect(Path(DATA_PATH) / query)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM settings")
    settings_data = res.fetchall()
    res = cur.execute(f"SELECT id, title FROM fields WHERE id IN ({",".join(map(str, field_ids))})")
    fields_data = res.fetchall()

    con.close()

    collection_settings = {
        'version': 0,
        'password': '',
        'type': None,
        'convert_fraction': True,
        'enable_bc': True,
        'statuses': {
            'demo': 'demo',
            'pass': 'pass',
            'owned': 'owned',
            'ordered': 'ordered',
            'sold': 'sold',
            'sale': 'sale',
            'wish': 'wish',
            'missing': 'missing',
            'bidding': 'bidding',
            'duplicate': 'duplicate',
            'replacement': 'replacement',
        },
        'fields': {},
    }

    for field_data in fields_data:
        field_id = field_data[0]
        field_name = field_ids[field_id]
        field_title = field_data[1]
        collection_settings['fields'][field_name] = field_title

    print(collection_settings)

    return collection_settings


@app.route('/', defaults={'path': ''})
def catch_all(path):
    return send_from_directory('static', 'index.html')


# Running app
if __name__ == '__main__':
    app.run(debug=True)
