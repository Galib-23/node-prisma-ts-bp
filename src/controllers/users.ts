import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user?.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json({ message: "Address Deleted successfully" });
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND,
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddressId) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Shipping address not found",
        ErrorCode.ADDRESS_NOT_FOUND,
      );
    }
    if (shippingAddress.userId != req.user?.id) {
      throw new BadRequestException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG,
      );
    }
  }
  if (validatedData.defaultBillingAddressId) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Billing address not found",
        ErrorCode.ADDRESS_NOT_FOUND,
      );
    }
    if (billingAddress.userId != req.user?.id) {
      throw new BadRequestException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG,
      );
    }
  }
  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      defaultShippingAddressId: validatedData.defaultShippingAddressId,
      defaultBillingAddressId: validatedData.defaultBillingAddressId,
    },
  });
  res.json(updatedUser);
};
