import { Router } from "express";

import userRoute from "./userRoutes";
import workspaceRoute from "./workspaceRoutes";
import pageRoute from "./pageRoutes";

const router = Router();

router.use("/user", userRoute);
router.use("/workspace", workspaceRoute);
router.use("/page", pageRoute);

export default router;