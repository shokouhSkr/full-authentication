import prisma from "@/helpers/connect";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type UserToken = {
  id: string;
};

const { ACTIVATION_TOKEN_SECRET } = process.env;

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { token } = body;

    const userToken = jwt.verify(token, ACTIVATION_TOKEN_SECRET!) as UserToken;

    const user = await prisma.user.findUnique({
      where: { id: userToken?.id.toString() },
    });

    if (user?.emailVerified) {
      return new NextResponse("Email address already verified.", { status: 400 });
    }

    return new NextResponse("Your account has been successfully verified.", { status: 200 });
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
};