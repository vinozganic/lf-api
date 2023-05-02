const fs = require("fs")
const path = require("path")

const { Pool } = require("pg")

const files = fs.readdirSync(__dirname + "\\transport-lines")
const filteredFiles = files.filter((file) => file !== "scriptTram.js")

let insertTransportLinesValues = `
    INSERT INTO transport_lines (area_name, type, name, number, geo_json) VALUES 
`

filteredFiles.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "transport-lines", file)))
    const value = `('Zagreb', 'tram', '${data.routeLongName}', '${data.routeShortName}', '${JSON.stringify(data.features[0].geometry)}'),`
    insertTransportLinesValues += value
})
insertTransportLinesValues = insertTransportLinesValues.slice(0, -1)
insertTransportLinesValues += `ON CONFLICT (area_name, type, number) DO UPDATE SET geo_json = EXCLUDED.geo_json;`

const pool = new Pool({
    connectionString: "postgres://user:password@localhost:5433/config",
    user: "user",
    password: "password",
})

const insertConnectionStrings = `
    INSERT INTO connection_strings (name, value) VALUES  
    ('matches_database', 'postgres://user:password@postgres:5432/matches'),
    ('items_database', 'mongodb://user:password@mongo:27017/lf'),
    ('rabbitmq_service', 'amqp://user:password@rabbit:5672')
    ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value    
`

const insertAreasValues = `
    INSERT INTO areas (name, geo_json) VALUES
    ('Zagreb', '{"type":"Polygon","coordinates":[[[15.823455952406732,45.83483852311042],[15.807594626826585,45.75162862980267],[16.061244070353183,45.699652455692075],[16.225926918015432,45.72564658776736],[16.275142481685037,45.80399630448167],[16.213938511481103,45.915169196895846],[16.073863445653046,45.935358568941695],[15.926934827287766,45.92927534004576],[15.823455952406732,45.83483852311042]]]}')
    ON CONFLICT (name) DO UPDATE SET geo_json = EXCLUDED.geo_json;
`

const insertTypesValues = `
    INSERT INTO types (name, nice_name) VALUES
    ('tshirt', 'Majica kratkih rukava'),
    ('shirt', 'Košulja'),
    ('lstshirt', 'Majica dugih rukava'),
    ('trousers', 'Hlače'),
    ('jeans', 'Traperice'),
    ('shorts', 'Kratke hlače'),
    ('sweatpants', 'Donji dio trenirke'),
    ('sweatshirt', 'Pulover'),
    ('jacket', 'Jakna'),
    ('cap', 'Kapa'),
    ('hat', 'Šešir'),
    ('scarf', 'Šal'),
    ('gloves', 'Rukavice'),
    ('belt', 'Remen'),
    ('skirt', 'Suknja'),
    ('dress', 'Haljina'),
    ('sneakers', 'Tenisice'),
    ('shoes', 'Cipele'),
    ('boots', 'Čižme'),
    ('underpants', 'Gaće'),
    ('socks', 'Čarape'),
    ('mobilePhone', 'Mobitel'),
    ('tablet', 'Tablet'),
    ('smartWatch', 'Pametni sat'),
    ('usbstick', 'USB stick'),
    ('wiredHeadphones', 'Slušalice sa žicom'),
    ('wirelessHeadphones', 'Bežične slušalice'),
    ('camera', 'Fotoaparat/kamera'),
    ('mouse', 'Miš'),
    ('keyboard', 'Tipkovnica'),
    ('laptop', 'Laptop'),
    ('ring', 'Prsten'),
    ('necklace', 'Ogrlica'),
    ('earring', 'Naušnice'),
    ('anklet', 'Nakit za nogu'),
    ('bracelet', 'Narukvica'),
    ('chain', 'Lančić'),
    ('sunglasses', 'Sunčane naočale'),
    ('glasses', 'Dioptrijske naočale'),
    ('umbrella', 'Kišobran'),
    ('keys', 'Ključevi'),
    ('book', 'Knjiga'),
    ('wristwatch', 'Sat'),
    ('ball', 'Lopta'),
    ('pillow', 'Jastuk'),
    ('racket', 'Reket'),
    ('bat', 'Palica za baseball'),
    ('skis', 'Skije'),
    ('wallet', 'Novčanik'),
    ('bag', 'Torba'),
    ('backpack', 'Ruksak'),
    ('idCard', 'Osobna iskaznica'),
    ('drivingLicense', 'Vozačka dozvola'),
    ('passport', 'Putovnica'),
    ('other', 'Ostalo')
    ON CONFLICT (name) DO UPDATE SET nice_name = EXCLUDED.nice_name;
`

const insert = async (query) => {
    await pool.query(query)
}

insert(insertConnectionStrings)
insert(insertAreasValues)
insert(insertTypesValues)
insert(insertTransportLinesValues)
