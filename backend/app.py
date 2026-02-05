import base64
import sqlite3
from flask import Flask, request, send_from_directory
from pathlib import Path


DATA_PATH = 'data'


# Initializing flask app
app = Flask(__name__, static_url_path='/')


@app.route("/api/filelist")
def filelist():
    root = Path(DATA_PATH).resolve()
    db_files = []
    for file_path in root.rglob('*.db'):
        if file_path.is_file():
            rel_path = file_path.relative_to(root)

            if 'backup' not in rel_path.parts[:-1]:
                db_files.append(str(rel_path))
    return db_files


@app.route("/api/coins")
def coins():
    file = request.args.get('f')
    con = sqlite3.connect(Path(DATA_PATH) / file)
    cur = con.cursor()

    res = cur.execute("""
        SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
        FROM coins LEFT OUTER JOIN images ON images.id = coins.image
    """)
    data = res.fetchall()
    con.close()

    for i, record in enumerate(data):
        data[i] = list(record)
        if data[i][1]:
            data[i][1] = base64.b64encode(data[i][1]).decode('utf-8')

    return data


@app.route("/api/coin_data")
def coin_data():
    info_fields = ('coins.title', 'obverseimg.image', 'reverseimg.image',
                  'status', 'region', 'country', 'period', 'ruler', 'value', 'unit', 'type',
                  'series', 'subjectshort', 'issuedate', 'year', 'mintage', 'material',
                  'mint', 'mintmark', 'features', 'subject', 'grade', 'paydate', 'payprice',
                  'storage', 'condition', 'quantity', )

    file = request.args.get('f')
    coin_id = request.args.get('id')
    con = sqlite3.connect(Path(DATA_PATH) / file)
    cur = con.cursor()

    res = cur.execute(f"SELECT {','.join(info_fields)} FROM coins "
        "LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id "
        "LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id "
        "WHERE coins.id=?", coin_id)
    data = res.fetchall()
    con.close()

    result = list(data[0])
    if result[1]:
        result[1] = base64.b64encode(result[1]).decode('utf-8')
    if result[2]:
        result[2] = base64.b64encode(result[2]).decode('utf-8')

    return result


@app.route("/api/photos")
def photos():
    file = request.args.get('f')
    coin_id = request.args.get('id')
    con = sqlite3.connect(Path(DATA_PATH) / file)
    cur = con.cursor()

    res = cur.execute("""SELECT obverseimg.image, reverseimg.image, edgeimg.image, photo1.image, photo2.image, photo3.image, photo4.image FROM coins
          LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
          LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
          LEFT JOIN photos AS edgeimg ON coins.edgeimg = edgeimg.id
          LEFT JOIN photos AS photo1 ON coins.photo1 = photo1.id
          LEFT JOIN photos AS photo2 ON coins.photo2 = photo2.id
          LEFT JOIN photos AS photo3 ON coins.photo3 = photo3.id
          LEFT JOIN photos AS photo4 ON coins.photo4 = photo4.id
          WHERE coins.id=?""", coin_id)
    data = res.fetchall()
    con.close()

    result = []
    for i, img in enumerate(data[0]):
        if img:
            encoded_img = base64.b64encode(img).decode('utf-8')
            result.append(encoded_img)

    return result


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

    query = request.args.get('f')
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
