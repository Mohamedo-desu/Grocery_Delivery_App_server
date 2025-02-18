import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dark, light, noSidebar } from "@adminjs/themes";
import AdminJS from "adminjs";
import * as Models from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.CustomerModel,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.DeliveryPartnerModel,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.AdminModel,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.BranchModel,
    },
    {
      resource: Models.ProductModel,
    },
    {
      resource: Models.CategoryModel,
    },
    {
      resource: Models.CounterModel,
    },
    {
      resource: Models.OrderModel,
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "Grocery Delivery App",
    withMadeWithLove: true,
    favicon:
      "https://res.cloudinary.com/dponzgerb/image/upload/v1722852076/s32qztc3slzqukdletgj.png",
    logo: "https://res.cloudinary.com/dponzgerb/image/upload/v1722852076/s32qztc3slzqukdletgj.png",
  },
  defaultTheme: dark.id,
  availableThemes: [light, dark, noSidebar],
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs",
    },
    app,
    {
      store: sessionStore,
      saveUnintialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
