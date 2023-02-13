const colorValidation = (body) => {
    const { color } = body
    if(!Array.isArray(color) || color.length !== 3) {
        return {
            success: false,
            error: {
                message: "Invalid color format. Color must be an array of 3 numbers",
                invalidColor: color,
            },
        }
    }

    const isColorValid = color.every((color) => 
        typeof color[i] !== "number" || color[i] < 0 || color[i] > 255)

    if(!isColorValid) {
        return {
            success: false,
            error: {
                message: "Invalid color format. Color must be an array of 3 numbers",
            }
        }
    }

    return {
        success: true
    }
    
}

module.exports = colorValidation