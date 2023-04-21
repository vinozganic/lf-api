const validateAreaId = (areaId) => {
    areaId = parseInt(areaId, 10)

    if (isNaN(areaId)) {
        return { success: false, error: { message: "Area id must be a number" } }
    }

    return { success: true }
}

module.exports = validateAreaId
