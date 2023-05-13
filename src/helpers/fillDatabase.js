const fs = require("fs")
const path = require("path")

const { Pool } = require("pg")

const developmentPoolOptions = {
    connectionString: "postgres://user:password@localhost:5433/config",
}

const productionPoolOptions = {
    connectionString: "postgres://<username>:<password>@lf-pgsql.postgres.database.azure.com/config?sslmode=require",
}

const pool = new Pool(developmentPoolOptions)

const insert = async (query) => {
    await pool.query(query)
}

const transportLinesFolder = path.join(__dirname, "transport-lines")
const subFolders = fs.readdirSync(transportLinesFolder)

let insertTransportLinesValues = `
    INSERT INTO transport_lines (area_name, type, name, number, geo_json) VALUES
`

subFolders.forEach((subFolder) => {
    const subFolderPath = path.join(transportLinesFolder, subFolder)
    const files = fs.readdirSync(subFolderPath)

    files.forEach((file) => {
        const data = JSON.parse(fs.readFileSync(path.join(subFolderPath, file)))
        let value = `('Zagreb', '${data.routeTypeName}', '${data.routeLongName}', '${data.routeShortName}', '${JSON.stringify(data.features[0].geometry)}')`
        value += ` ON CONFLICT (area_name, type, number) DO UPDATE SET geo_json = EXCLUDED.geo_json;`
        const insertValue = `${insertTransportLinesValues} ${value}`
        insert(insertValue)
    })
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

const insertNounsValues = `
    INSERT INTO nouns (noun, gender) VALUES
    ('ptica', 'f'),
    ('mačka', 'f'),
    ('pas', 'm'),
    ('konj', 'm'),
    ('žaba', 'f'),
    ('riba', 'f'),
    ('kornjača', 'f'),
    ('kokoš', 'f'),
    ('golub', 'm'),
    ('lisica', 'f'),
    ('medvjed', 'm'),
    ('vuk', 'm'),
    ('lav', 'm'),
    ('tigar', 'm'),
    ('slon', 'm'),
    ('žirafa', 'f'),
    ('zebra', 'f'),
    ('krokodil', 'm'),
    ('pingvin', 'm'),
    ('ždral', 'm'),
    ('žohar', 'm'),
    ('pčela', 'f'),
    ('mrav', 'm'),
    ('puž', 'm'),
    ('zmija', 'f'),
    ('magarac', 'm'),
    ('svinja', 'f'),
    ('krava', 'f'),
    ('ovca', 'f'),
    ('koza', 'f')
    ON CONFLICT (noun) DO NOTHING;
`

const insertAdjectivesValues = `
    INSERT INTO adjectives (adjective, gender) VALUES
    ('Crni', 'm'),
    ('Crna', 'f'),
    ('Bijeli', 'm'),
    ('Bijela', 'f'),
    ('Žuti', 'm'),
    ('Žuta', 'f'),
    ('Plavi', 'm'),
    ('Plava', 'f'),
    ('Crveni', 'm'),
    ('Crvena', 'f'),
    ('Zeleni', 'm'),
    ('Zelena', 'f'),
    ('Sivi', 'm'),
    ('Siva', 'f'),
    ('Ljubičasti', 'm'),
    ('Ljubičasta', 'f'),
    ('Narančasti', 'm'),
    ('Narančasta', 'f'),
    ('Rozi', 'm'),
    ('Roza', 'f'),
    ('Smeđi', 'm'),
    ('Smeđa', 'f'),
    ('Veliki', 'm'),
    ('Velika', 'f'),
    ('Mali', 'm'),
    ('Mala', 'f'),
    ('Brzi', 'm'),
    ('Brza', 'f'),
    ('Spori', 'm'),
    ('Spora', 'f')
    ON CONFLICT (adjective) DO NOTHING;
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
    ('boots', 'Čizme'),
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

insert(insertConnectionStrings)
insert(insertAreasValues)
insert(insertTypesValues)
insert(insertNounsValues)
insert(insertAdjectivesValues)
