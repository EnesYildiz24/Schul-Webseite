import { parseCookies } from "restmatcher";
import supertest from "supertest";
import app from "../../src/app";
import { createProf } from "../../src/services/ProfService";

test(`/api/login POST, Positivtest`, async () => {
    // arrange:
    await createProf({name: "Admin", campusID: "admin", password: "xyzXYZ123!§xxx", admin: true })
    
    // act:
    const testee = supertest(app);
    const loginData = { campusID: "admin", password: "xyzXYZ123!§xxx" };
    const response = parseCookies(await testee.post(`/api/login`).send(loginData));
    
    // assert:
    expect(response).statusCode("2*")
    // added by parseCookies, similar to express middleware cookieParser
    expect(response).toHaveProperty("cookies"); // added by parseCookies
    expect(response.cookies).toHaveProperty("access_token"); // the cookie with the JWT
    const token = response.cookies.access_token;
    expect(token).toBeDefined();
 });
