import { Request, Response } from "express";
import {
    createBuilder,
    deleteBuilder,
    findAllBuilder,
    findOneBuilder,
    updateBuilder
} from "bradb";
import { clientService } from "../services/client.service";
import {
    clientCreateSchema,
    clientFilterSchema,
    clientUpdateSchema
} from "../validators/client.validator";

import { LoginClient } from "../validators/client.validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Unauthorized } from "../errors/http.error";
import { env } from "../env";

async function login(
    req: Request,
    res: Response,
    data: LoginClient
): Promise<Response> {
    const client = await clientService.findByEmail(data.email);

    const match = await bcrypt.compare(
        data.password,
        Buffer.from(client.password).toString("ascii")
    );
    if (!match) throw new Unauthorized("Wrong password");

    let tokenData = {
        id: client.id,
        role: client.role
    };

    // If the client its a provider, save the providerId in the token
    const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
    const token = jwt.sign(tokenData, env.JWT_SECRET, options);

    return res.status(200).json({
        success: true,
        message: "Logged successfully",
        token: token,
        ...tokenData
    });
}

export const clientController = {
    getById: findOneBuilder(clientService),
    getAll: findAllBuilder(clientService, clientFilterSchema),
    update: updateBuilder(clientService, clientUpdateSchema),
    create: createBuilder(clientService, clientCreateSchema),
    delete: deleteBuilder(clientService),
    action: (req: Request, res: Response) => {
        res.status(200).send("no deberias haber llegado hasta aca");
    },
    login
};

export const premiumController = {
    ...clientController,
    action: (req: Request, res: Response) => {
        res.status(200).send("soy un usuario premium");
    }
};

export const freeController = {
    ...clientController,
    action: (req: Request, res: Response) => {
        res.status(200).send("soy un usuario free");
    }
};
