const dateValidation = (body) => {
    const { date } = body
    const providedDate = new Date(date)
    const currentDate = new Date()

    const isDateInvalid = isNaN(providedDate) || providedDate > currentDate

    return {
        success: isDateInvalid ? false : true,
        ...(isDateInvalid && {
            error: {
                message: "Invalid date",
            },
        }),
    }
}

module.exports = dateValidation
