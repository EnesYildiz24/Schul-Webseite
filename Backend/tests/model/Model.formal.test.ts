import { constants } from "fs";
import { access } from "fs/promises";

test.each([
  "src/model/ProfModel.ts",
  "src/model/GebietModel.ts",
  "src/model/ThemaModel.ts",
  "tests/model/ProfModel.test.ts",
  "tests/model/GebietModel.test.ts",
  "tests/model/ThemaModel.test.ts",
])('File "%s" is present', async (filename) => {
  await access(filename, constants.R_OK);
});

test.each(["Prof", "Gebiet", "Thema"])(
  'Model class "%s" defined and exported',
  async (domainClassName) => {
    const module = await import(`../../src/model/${domainClassName}Model.ts`);
    const modelClass = module[domainClassName];
    expect(modelClass).toBeInstanceOf(Function);
  }
);