const colorValidation = (body) => {
    const { color } = body
    if (!Array.isArray(color) || color.length !== 3) {
        return {
            success: false,
            error: {
                message: "Invalid color format. Color must be an array of 3 numbers",
                invalidColor: color,
            },
        }
    }

    const isColorValid = color.every((c) => typeof c == "number" && c >= 0 && c <= 255)

    if (!isColorValid) {
        return {
            success: false,
            error: {
                message: "Invalid color",
                invalidColor: color,
            },
        }
    }

    return {
        success: true,
    }
}

module.exports = colorValidation
