const dateValidation = (body) => {
    const {
        date: setDate, // I have to put it this way (setDate), because Date is a reserved word in JS
    } = body
    const providedDate = new Date(setDate)
    const currentDate = new Date()

    const isDateInvalid = isNaN(providedDate) || providedDate > currentDate

    return {
        success: isDateInvalid ? false : true,
        ...(isDateInvalid && {
            error: {
                message: "Invalid date",
                dateValid: false,
            },
        }),
    }
}

module.exports = dateValidation
