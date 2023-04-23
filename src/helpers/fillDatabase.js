const fs = require("fs")
const path = require("path")

const { Pool } = require("pg")

const files = fs.readdirSync(__dirname + "\\transport-lines")
const filteredFiles = files.filter((file) => file !== "scriptTram.js")

console.log(filteredFiles)

let insertTransportLinesValues = `
    INSERT INTO transport_lines (area_id, type, name, number, geo_json) VALUES 
`

filteredFiles.forEach((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "transport-lines", file)))
    const value = `(${1}, 'tram', '${data.routeLongName}', '${data.routeShortName}', '${JSON.stringify(data.features[0].geometry)}'),`
    insertTransportLinesValues += value
})
insertTransportLinesValues = insertTransportLinesValues.slice(0, -1)

const pool = new Pool({
    connectionString: "postgres://user:password@localhost:5433/config",
    user: "user",
    password: "password",
})

const insertAreasValues = `
    INSERT INTO areas (name, geo_json) VALUES
    ('Test1', '{"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}'),
    ('Test2', '{"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}')
`

const insertTypesValues = `
    INSERT INTO types (name, nice_name) VALUES
    ('clothes', 'Odjeća'),
    ('tech', 'Tehnologija'),
    ('misc', 'Razno')
`

const insertSubtypesValues = `
    INSERT INTO subtypes (type_id, name, nice_name) VALUES
    (1, 'shoes', 'Cipele'),
    (1, 'shirt', 'Košulja'),
    (2, 'mobilePhone', 'Telefon'),
    (2, 'laptop', 'Laptop'),
    (3, 'earring', 'Naušnice')
`

const insert = async (query) => {
    await pool.query(query)
}

insert(insertAreasValues)
insert(insertTypesValues)
insert(insertSubtypesValues)
insert(insertTransportLinesValues)
