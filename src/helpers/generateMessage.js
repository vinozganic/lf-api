const generateItemToProcessMessage = (item, type) => {
    return JSON.stringify({
        item_type: type,
        id: item.id,
        type: item.type,
        subtype: item.subtype,
        color: item.color,
        location: item.location,
        date: item.date,
        identifiable: item.identifiable,
    })
}

module.exports = { generateItemToProcessMessage }
