const generateItemToProcessMessage = (item, type) => {
    return JSON.stringify({
        item_type: type,
        id: item.id,
        type: item.type,
        color: item.color,
        location: item.location,
        date: item.date,
    })
}

module.exports = { generateItemToProcessMessage }
