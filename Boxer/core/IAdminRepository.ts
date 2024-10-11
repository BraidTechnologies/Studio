// Copyright (c) 2024 Braid Technologies Ltd

import { Persona} from "./Persona";
import { EConfigStrings } from "./ConfigStrings";

export interface IAdminRepository {

   isAdmin (persona : Persona) : Promise<boolean>; 
}

export function getDetaultAdminRepository(): IAdminRepository {
   return new DefaultAdminRepository();
}

// THis is a local implementation of IAdminRepository that just searches strigs for a well know name
// If it is present, user can be an admin. 
export class DefaultAdminRepository implements IAdminRepository {

   isAdmin (persona : Persona) : Promise<boolean> {
      
      let done = new Promise<boolean>(function(resolve, reject) {

         let isAdmin = (EConfigStrings.kAdminUserNames.includes (persona.name));

         resolve (isAdmin);
      });

      return done;
   }
}