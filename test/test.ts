import * as child_process from 'child_process';
import * as util from 'util';
const execFile = util.promisify(child_process.execFile);


test("check", async ():Promise<void> => {
  console.log("OK");
  const { stdout, stderr } = await execFile('docker', ['ps']);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  expect(stdout).toContain("test.ts");

});
