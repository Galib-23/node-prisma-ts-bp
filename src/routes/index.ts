import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import userRoutes from "./users";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', userRoutes);


export default rootRouter;