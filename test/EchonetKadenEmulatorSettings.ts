
export interface EchonetKadenEmulatorSettings {
  devices?:{
    monoFunctionalLighting?:{
      disabled?:boolean;
      id?: string;
    };
    temperatureSensor?:{
      disabled?:boolean;
      id?: string;
    };
    humiditySensor?:{
      disabled?:boolean;
      id?: string;
    };
    humanDetectionSensor?:{
      disabled?:boolean;
      id?: string;
    };
    generalLighting?:{
      disabled?:boolean;
      id?: string;
    };
    electricallyOperatedRainSlidingDoorShutter?:{
      disabled?:boolean;
      id?: string;
    };
    electricLock?:{
      disabled?:boolean;
      id?: string;
    };
    switch?:{
      disabled?:boolean;
      id?: string;
    };
    homeAirConditioner?:{
      disabled?:boolean;
      id?: string;
    };
    electricWaterHeater?:{
      disabled?:boolean;
      id?: string;
    };
  }
  nodeProfileId?:string;
}

export class EchonetKadenEmulatorSettings
{
  public static createDefault():EchonetKadenEmulatorSettings
  {
    return {
      devices:{
        monoFunctionalLighting:{},
        temperatureSensor:{},
        humiditySensor:{},
        humanDetectionSensor:{},
        generalLighting:{},
        electricallyOperatedRainSlidingDoorShutter:{},
        electricLock:{},
        switch:{},
        homeAirConditioner:{},
        electricWaterHeater:{},
      }
    };
  }

  public static disabledAllDevices(settings:EchonetKadenEmulatorSettings):EchonetKadenEmulatorSettings
  {
    const result = JSON.parse(JSON.stringify(settings)) as EchonetKadenEmulatorSettings;
    
    for(const key in result.devices)
    {
      if(key === "nodeProfileId")
      {
        continue;
      }

      (result.devices as any)[key].disabled = true;
    }

    return result;
  }
  
  

}
