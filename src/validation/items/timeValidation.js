const timeValidation = (body) => {
    const {
        time: { startTime, endTime },
    } = body
    const isStartTimeInvalid = isNaN(new Date(startTime))
    const isEndTimeInvalid = isNaN(new Date(endTime))

    return {
        success: isStartTimeInvalid || isEndTimeInvalid ? false : true,
        ...((isStartTimeInvalid || isEndTimeInvalid) && {
            error: {
                message: "Invalid time",
                ...(isStartTimeInvalid && { startTimeValid: false }), // isStartTimeInvalid ? { startTimeValid: false } : {}
                ...(isEndTimeInvalid && { endTimeValid: false }), // isEndTimeInvalid ? { endTimeValid: false } : {}
            },
        }),
    }
}

module.exports = timeValidation
