function similarity(a: string, b: string): number {
    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a
    const longerLength = longer.length
    if (longerLength === 0) return 1.0
    const editDist = levenshtein(longer, shorter)
    return (longerLength - editDist) / longerLength
}

function levenshtein(a: string, b: string): number {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
    for (let j = 1; j <= a.length; j++) matrix[0][j] = j
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b[i - 1] === a[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                )
        }
    }
    return matrix[b.length][a.length]
}


export {similarity, levenshtein}