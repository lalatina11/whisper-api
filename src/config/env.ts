import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development", "stagging"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().min(1000),
});

const getEnv = () => {
  try {
    const { success, data } = envSchema.safeParse(process.env);
    if (!success) {
      throw new Error("Cannot find the .env or some env variables!");
    }
    return data;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const ENV = getEnv();

export default ENV;
