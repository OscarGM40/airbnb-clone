import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import prisma from "@/app/libs/prismadb"; // es la export default
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // si no viene nada lanzamos error directamente
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        //buscamos el user(fijate que tengo tipado ya por el prisma db push,amazing)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        // si el user no tiene la password hasheada o no hay un user
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        //  si encontramos un user comprobamos las passwords
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/", // dado que usamos la home como signIn cuando haya un error es aqui donde queremos dirigir,en otra app puede ser /register,etc
  },
  debug: process.env.NODE_ENV === "development", // realmente no lo necesito más que en dev,ni siquiera en testing
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
// ojo que el import es sobre la funcion NextAuth(authOptions)
export default NextAuth(authOptions);
