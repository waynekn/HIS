import { Client } from "./clients";

export type healthProgram = {
  id: number;
  name: string;
};

export type HealthProgramDetail = {
  name: string;
  clients: Client[];
};
