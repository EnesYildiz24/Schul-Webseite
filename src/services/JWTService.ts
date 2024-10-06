export async function verifyPasswordAndCreateJWT(campusID: string, password: string): Promise<string | undefined> {
    throw new Error("Function verifyPasswordAndCreateJWT not implemented");
}

export function verifyJWT(jwtString: string | undefined): LoginResource {
    throw new Error("Function verifyJWT not implemented");
}
