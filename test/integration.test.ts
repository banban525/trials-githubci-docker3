import * as child_process from 'child_process';
import * as util from 'util';
import {ComposeSpecification} from './compose-spec';
import yaml from "js-yaml";
import fs from "fs";
import fetch from "node-fetch";

const execFile = util.promisify(child_process.execFile);


const defaultCompose : ComposeSpecification = {
  services:{
    echonetlite2mqtt:{
      image:"banban525/echonetlite2mqtt:latest",
      ports:["3000:3000"],
      networks:{
        echonet_network_test:{
          ipv4_address:"10.254.247.2"
        }
      }
    },
    aircon01:{
      image:"banban525/echonet-lite-kaden-emulator:latest",
      ports:["3001:3000"],
      volumes:[
        "./test/aircon01-settings.json:/home/node/app/config/aircon01-settings.json"
      ],
      environment:{
        SETTINGS: "/home/node/app/config/aircon01-settings.json"
      },
      networks:{
        echonet_network_test:{
          ipv4_address:"10.254.247.3"
        }
      }
    }
  },
  networks:{
    echonet_network_test:{
      ipam:{
        driver:"default",
        config:[
          {
            subnet:"10.254.247.0/24"
          }
        ]
      }
    }
  }
}

interface echonetlite2mqttStatus
{
  systemVersion:string;
  devices: {id:string}[];
}


test("check", async ():Promise<void> => {
  const yml = yaml.dump(defaultCompose);
  fs.writeFileSync("../compose.yml", yml, {encoding:"utf-8"});
  await execFile('docker', ['compose', "-f", "../compose.yml", 'up', "-d"]);

  let lastStatus:echonetlite2mqttStatus = {systemVersion:"", devices:[]};
  for(let i=0; i<10; i++){
    try{
      const res = await fetch("http://localhost:3000/api/status", {timeout:500});
      const json = await res.json();
      lastStatus = json as echonetlite2mqttStatus;
      break;
    }
    catch(e)
    {
      console.log("retry");
      await new Promise((resolve)=>setTimeout(resolve, 1000));
      continue;
    }
  }
  
  expect(lastStatus.systemVersion).not.toBe("");

  console.log(`OK:${lastStatus.systemVersion}`);

  for(let i=0; i<40; i++){
    try{
      const res = await fetch("http://localhost:3000/api/status", {timeout:500});
      const json = await res.json();
      lastStatus = json as echonetlite2mqttStatus;
      if(lastStatus.devices.length === 0)
      {
        console.log("retry");
        await new Promise((resolve)=>setTimeout(resolve, 1000));
        continue;
      }
      break;
    }
    catch(e)
    {
      console.log("retry");
      await new Promise((resolve)=>setTimeout(resolve, 1000));
      continue;
    }
  }

  console.dir(lastStatus);

  const { stdout, stderr } = await execFile('docker', ['ps']);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  //expect(stdout).toContain("testrunner");

  await execFile('docker', ['compose', 'down']);

}, 60*1000);
