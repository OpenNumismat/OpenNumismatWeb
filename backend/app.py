import base64
import sqlite3
from io import BytesIO
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from PIL import Image


DATA_PATH = 'data'
MAX_PREVIEW_IMAGE_HEIGHT = 54 * 4

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


def sqlite_connect(file):
    file_uri = f"file:{DATA_PATH}/{file}?mode=ro"
    return sqlite3.connect(file_uri, uri=True)


@app.get("/api/filelist")
def filelist():
    root = Path(DATA_PATH).resolve()
    db_files = []
    for file_path in root.rglob('*.db'):
        if file_path.is_file():
            rel_path = file_path.relative_to(root)

            if 'backup' not in rel_path.parts[:-1]:
                db_files.append(str(rel_path))
    return db_files


@app.get("/api/coins")
def coins(f):
    file = f
    con = sqlite_connect(file)
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


@app.get("/api/filters")
def filters(f):
    file = f
    con = sqlite_connect(file)
    cur = con.cursor()

    res = cur.execute("""
        SELECT DISTINCT status FROM coins
    """)
    data = res.fetchall()
    con.close()

    result = []
    for record in data:
        result.append(record[0])

    return result


@app.get("/api/coin_data")
def coin_data(f, id):
    info_fields = ('coins.title', 'obverseimg.image', 'reverseimg.image',
                  'status', 'region', 'country', 'period', 'ruler', 'value', 'unit', 'type',
                  'series', 'subjectshort', 'issuedate', 'year', 'mintage', 'material',
                  'mint', 'mintmark', 'features', 'subject', 'grade', 'paydate', 'payprice',
                  'storage', 'condition', 'quantity', )

    file = f
    coin_id = id
    con = sqlite_connect(file)
    cur = con.cursor()

    res = cur.execute(f"SELECT {','.join(info_fields)} FROM coins "
        "LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id "
        "LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id "
        "WHERE coins.id=?", (coin_id,))
    data = res.fetchall()
    con.close()

    result = list(data[0])
    if result[1]:
        result[1] = base64.b64encode(result[1]).decode('utf-8')
    if result[2]:
        result[2] = base64.b64encode(result[2]).decode('utf-8')

    return result


@app.get("/api/photo")
def photo(f, id, type):
    file = f
    coin_id = id
    img_type = type
    con = sqlite_connect(file)
    cur = con.cursor()

    if img_type == 'obverse':
        res = cur.execute("""SELECT obverseimg.image FROM coins
            LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
            WHERE coins.id=?""", (coin_id,))
    elif img_type == 'reverse':
        res = cur.execute("""SELECT reverseimg.image FROM coins
            LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
            WHERE coins.id=?""", (coin_id,))
    else:
        res = cur.execute("""SELECT obverseimg.image, reverseimg.image FROM coins
            LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
            LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
            WHERE coins.id=?""", (coin_id,))

    data = res.fetchall()
    con.close()

    result = ''
    if img_type == 'both':
        img1 = None
        img2 = None
        new_width1 = 0
        new_width2 = 0

        if data[0][0]:
            img1 = Image.open(BytesIO(data[0][0]))
            aspect_ratio = img1.width / img1.height
            new_width1 = MAX_PREVIEW_IMAGE_HEIGHT * aspect_ratio
            img1.thumbnail((new_width1, MAX_PREVIEW_IMAGE_HEIGHT), Image.Resampling.LANCZOS)
            new_width1 = img1.width

        if data[0][1]:
            img2 = Image.open(BytesIO(data[0][1]))
            aspect_ratio = img2.width / img2.height
            new_width2 = MAX_PREVIEW_IMAGE_HEIGHT * aspect_ratio
            img2.thumbnail((new_width2, MAX_PREVIEW_IMAGE_HEIGHT), Image.Resampling.LANCZOS)
            new_width2 = img2.width

        total_width = new_width1 + new_width2
        new_img = Image.new("RGBA", (total_width, MAX_PREVIEW_IMAGE_HEIGHT), (0, 0, 0, 0))

        if img1:
            new_img.paste(img1, (0, 0))
        if img2:
            new_img.paste(img2, (new_width1, 0))

        buffered = BytesIO()
        new_img.save(buffered, format="WEBP", lossless=False, quality=80)
        img = buffered.getvalue()
    else:
        img = data[0][0]

    if img:
        result = base64.b64encode(img).decode('utf-8')

    return result


@app.get("/api/photos")
def photos(f, id):
    file = f
    coin_id = id
    con = sqlite_connect(file)
    cur = con.cursor()

    res = cur.execute("""SELECT obverseimg.image, reverseimg.image, edgeimg.image, photo1.image, photo2.image, photo3.image, photo4.image FROM coins
          LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
          LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
          LEFT JOIN photos AS edgeimg ON coins.edgeimg = edgeimg.id
          LEFT JOIN photos AS photo1 ON coins.photo1 = photo1.id
          LEFT JOIN photos AS photo2 ON coins.photo2 = photo2.id
          LEFT JOIN photos AS photo3 ON coins.photo3 = photo3.id
          LEFT JOIN photos AS photo4 ON coins.photo4 = photo4.id
          WHERE coins.id=?""", (coin_id,))
    data = res.fetchall()
    con.close()

    result = []
    for i, img in enumerate(data[0]):
        if img:
            encoded_img = base64.b64encode(img).decode('utf-8')
            result.append(encoded_img)

    return result


@app.get("/api/settings")
def settings(f):
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

    file = f
    con = sqlite_connect(file)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM settings")
    settings_data = res.fetchall()
    res = cur.execute(f"SELECT id, title FROM fields WHERE id IN ({",".join(map(str, field_ids))})")
    fields_data = res.fetchall()

    con.close()

    collection_settings = {'statuses': {}, 'fields': {}}

    for settings_entry in settings_data:
        title = settings_entry[0]
        val = settings_entry[1]
        if title == 'Version':
            collection_settings['version'] = int(val)
        elif title == 'Password':
            collection_settings['password'] = val
        elif title == 'Type':
            collection_settings['type'] = val
        elif title == 'convert_fraction':
            collection_settings[title] = (val.lower() in ('true', '1'))
        elif title == 'enable_bc':
            collection_settings[title] = (val.lower() in ('true', '1'))
        else:
            if title.endswith("_status_title"):
                key = title[:-len("_status_title")]
                collection_settings['statuses'][key] = val

    for field_data in fields_data:
        field_id = field_data[0]
        field_name = field_ids[field_id]
        field_title = field_data[1]
        collection_settings['fields'][field_name] = field_title

    return collection_settings


app.mount("/", StaticFiles(directory="static", html=True), name="static")


# Running app
if __name__ == '__main__':
    import uvicorn

    uvicorn.run("app:app", reload=True)
