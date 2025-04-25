import { healthProgram } from "./healthProgram";

export type Client = healthProgram;

export type ClientDetail = {
  client: Client;
  programs: healthProgram[];
  doctor: string;
};
