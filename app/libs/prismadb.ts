import { PrismaClient } from "@prisma/client";

// la linea declare lo que hace es tipar la variable(debe ir con var además)
declare global {
  var prisma: PrismaClient | undefined
}
// globalThis es literalmente el valor global de this,es decir el valor de this en el scope global.Fijate que la de arriba tipa la variable,pero la asignacion es desde aqui
const client = globalThis.prisma || new PrismaClient();
// fuera de producción lo inicializamos ??
if(process.env.NODE_ENV !== 'production') globalThis.prisma = client;
// esto hay que hacerlo porque el hot reloading de Next va a crear un montón de prisma client,de esta forma estamos atando el client a la variable this global,que no es afectada por el hot reload.Es una buena practica al usar hot reload y Prisma

export default client;