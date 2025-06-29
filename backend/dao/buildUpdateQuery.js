

export default async function buildUpdateQuery(tableName, fields, idFieldName, idValue, checkFieldExistsFn) {
    const allowedFields = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
        const fieldExists = await checkFieldExistsFn(tableName, field);
        if (fieldExists) {
            allowedFields.push(`\`${field}\` = ?`); // Escape field names safely
            values.push(value);
        }
    }

    if (allowedFields.length === 0) {
        throw new Error("No valid fields provided for update.");
    }

    const query = `
        UPDATE \`${tableName}\`
        SET ${allowedFields.join(', ')}
        WHERE \`${idFieldName}\` = ?
    `;

    values.push(idValue);

    return { query, values };
}
