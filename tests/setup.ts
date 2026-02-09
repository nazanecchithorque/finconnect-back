import request from "supertest";
import { app } from "../app";
import TestAgent from "supertest/lib/agent";
import { beforeAll } from "vitest";

export let req: TestAgent;
